<script setup lang="ts">
defineProps<{
  path: string
}>()
</script>

<template>
  <section aria-labelledby="not-found-title" class="max-w-2xl py-12 sm:py-20">
    <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">404</p>
    <h1
      id="not-found-title"
      class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink"
    >
      页面未找到
    </h1>
    <p class="mt-4 leading-7 text-muted">
      没有找到这个页面，地址可能已经变更或输入有误。
    </p>
    <p class="mt-3 font-mono text-sm text-muted">{{ path }}</p>
    <nav aria-label="页面未找到后的导航" class="mt-8 flex flex-wrap gap-x-6 gap-y-3">
      <RouterLink
        to="/"
        class="text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        返回首页
      </RouterLink>
      <RouterLink
        to="/#topics"
        class="text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        浏览主题
      </RouterLink>
    </nav>
  </section>
</template>
