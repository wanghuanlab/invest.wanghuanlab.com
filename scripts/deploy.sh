#!/usr/bin/env bash
#
# Publish invest.wanghuanlab.com through its 1Panel Node runtime.
# The 1Panel virtual host proxies to the Vite server in node24-runtime; its
# static site root is intentionally not the active application source.

set -Eeuo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_HOST="${DEPLOY_SSH_HOST:-visualization.wanghuanlab.com}"
SSH_USER="${DEPLOY_SSH_USER:-root}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"
REMOTE_APP_DIR="${DEPLOY_REMOTE_APP_DIR:-/opt/apps/invest.wanghuanlab.com}"
CONTAINER_NAME="${DEPLOY_CONTAINER_NAME:-node24-runtime}"
HEALTH_URL="${DEPLOY_HEALTH_URL:-https://invest.wanghuanlab.com/}"
DRY_RUN=false

usage() {
  cat <<'EOF'
部署 Invest Lab 到 1Panel Node 运行时。

用法：
  npm run deploy [-- 选项]

选项：
  --host HOST         SSH 主机（默认 visualization.wanghuanlab.com）
  --user USER         SSH 用户（默认 root）
  --port PORT         SSH 端口（默认 22）
  --remote-dir DIR    服务器上的 Git 工作目录
  --container NAME    1Panel Node 运行时容器名（默认 node24-runtime）
  --health-url URL    发布后的 HTTPS 健康检查地址
  --dry-run           只做本地校验并显示计划，不推送、不连接服务器
  -h, --help          显示帮助

环境变量：
  DEPLOY_CONFIRM=yes  跳过交互确认，适合受控自动化环境

此脚本会要求本地工作区干净，运行测试和构建，推送 codeup/main，
再使服务器工作区快进更新并重启 1Panel 的 Node 运行时。
EOF
}

while (($# > 0)); do
  case "$1" in
    --host) SSH_HOST="${2:?--host 需要参数}"; shift 2 ;;
    --user) SSH_USER="${2:?--user 需要参数}"; shift 2 ;;
    --port) SSH_PORT="${2:?--port 需要参数}"; shift 2 ;;
    --remote-dir) REMOTE_APP_DIR="${2:?--remote-dir 需要参数}"; shift 2 ;;
    --container) CONTAINER_NAME="${2:?--container 需要参数}"; shift 2 ;;
    --health-url) HEALTH_URL="${2:?--health-url 需要参数}"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "未知参数：$1" >&2; usage >&2; exit 2 ;;
  esac
done

[[ "$SSH_HOST" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "SSH 主机格式不安全。" >&2; exit 2; }
[[ "$SSH_USER" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "SSH 用户格式不安全。" >&2; exit 2; }
[[ "$SSH_PORT" =~ ^[0-9]+$ ]] && ((SSH_PORT >= 1 && SSH_PORT <= 65535)) || {
  echo "SSH 端口无效。" >&2; exit 2;
}
[[ "$REMOTE_APP_DIR" =~ ^/opt/apps/[A-Za-z0-9._/-]+$ ]] || {
  echo "远端目录必须位于 /opt/apps/ 下。" >&2; exit 2;
}
[[ "$CONTAINER_NAME" =~ ^[A-Za-z0-9][A-Za-z0-9_.-]*$ ]] || {
  echo "容器名格式不安全。" >&2; exit 2;
}

for command in git npm ssh curl; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "缺少命令：$command" >&2; exit 1;
  }
done

cd "$PROJECT_ROOT"

[[ "$(git branch --show-current)" == "main" ]] || {
  echo "只能从 main 分支发布。" >&2; exit 1;
}
[[ -z "$(git status --porcelain)" ]] || {
  echo "工作区有未提交改动；请先提交后再发布。" >&2; exit 1;
}

echo "[1/5] 本地校验"
npm test
npm run build

LOCAL_REVISION="$(git rev-parse --short HEAD)"
TARGET="$SSH_USER@$SSH_HOST"
echo "[2/5] 发布计划"
echo "  revision: $LOCAL_REVISION"
echo "  source: codeup/main"
echo "  target: $TARGET:$REMOTE_APP_DIR"
echo "  runtime: $CONTAINER_NAME"

if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run 完成，未推送或连接服务器。"
  exit 0
fi

if [[ "${DEPLOY_CONFIRM:-}" != "yes" ]]; then
  read -r -p "输入 DEPLOY 继续发布: " confirmation
  [[ "$confirmation" == "DEPLOY" ]] || { echo "已取消。"; exit 1; }
fi

echo "[3/5] 推送 codeup/main"
git push codeup main

SSH_ARGS=(
  -p "$SSH_PORT"
  -o BatchMode=yes
  -o ConnectTimeout=15
  -o ServerAliveInterval=15
)

echo "[4/5] 更新远端并重启运行时"
REMOTE_REVISION="$(ssh "${SSH_ARGS[@]}" "$TARGET" sh -s -- \
  "$REMOTE_APP_DIR" "$CONTAINER_NAME" <<'REMOTE_SCRIPT'
set -eu
app_dir="$1"
container="$2"

test -d "$app_dir/.git" || { echo "远端 Git 工作目录不存在：$app_dir" >&2; exit 1; }
cd "$app_dir"
test "$(git branch --show-current)" = "main" || { echo "远端不在 main 分支。" >&2; exit 1; }
test -z "$(git status --porcelain)" || { echo "远端工作区有未提交改动，已停止发布。" >&2; exit 1; }

git fetch origin main >&2
git merge --ff-only origin/main >&2
git rev-parse --short HEAD

docker inspect --format '{{.State.Running}}' "$container" | grep -qx true || {
  echo "运行时容器未运行：$container" >&2; exit 1;
}
docker restart "$container" >/dev/null

for _ in $(seq 1 30); do
  docker inspect --format '{{.State.Running}}' "$container" | grep -qx true && exit 0
  sleep 1
done
echo "运行时容器未在 30 秒内恢复。" >&2
exit 1
REMOTE_SCRIPT
)"

echo "  remote revision: $REMOTE_REVISION"
[[ "$REMOTE_REVISION" == "$LOCAL_REVISION" ]] || {
  echo "远端版本与本地提交不一致。" >&2; exit 1;
}

echo "[5/5] HTTPS 健康检查"
HTTP_CODE="000"
for _ in $(seq 1 30); do
  HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || true)"
  [[ "$HTTP_CODE" == "200" ]] && break
  sleep 1
done
echo "  $HEALTH_URL → HTTP ${HTTP_CODE:-000}"
[[ "$HTTP_CODE" == "200" ]] || {
  echo "健康检查未通过；请检查 1Panel 运行时日志。" >&2; exit 1;
}

echo "部署完成：$HEALTH_URL（$LOCAL_REVISION）"
