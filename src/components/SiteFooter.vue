<script setup lang="ts">
import { getTopics } from '@/content/loadContent'

const topics = getTopics()
</script>

<template>
  <footer class="mt-12 border-t border-ink/15">
    <div
      class="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="font-display text-base font-semibold text-ink">Invest Lab</p>
        <p class="mt-1 text-sm text-muted">个人研究笔记，非投资建议</p>
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            class="underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            苏ICP备2026043670号
          </a>
          <span aria-hidden="true">·</span>
          <span>SUZHOU · CN</span>
        </div>
      </div>
      <nav class="flex max-w-xl flex-wrap gap-x-5 gap-y-2" aria-label="页脚主题导航">
        <RouterLink
          v-for="topic in topics"
          :key="topic.slug"
          :to="{ name: 'topic', params: { slug: topic.slug } }"
          class="font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {{ topic.name }}
        </RouterLink>
      </nav>
    </div>
  </footer>
</template>
