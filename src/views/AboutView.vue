<script setup lang="ts">
import { getTopics } from '@/content/loadContent'

const topics = getTopics()
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <section aria-labelledby="about-title">
      <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">About</p>
      <h1
        id="about-title"
        class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink"
      >
        关于 Invest Lab
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
        这里是一份个人宏观与跨资产研究笔记，用来整理、沉淀和回顾影响资产定价的长期线索。
      </p>
    </section>

    <section aria-labelledby="scope-title" class="py-14">
      <h2 id="scope-title" class="font-display text-2xl font-semibold tracking-tight text-ink">
        研究范围
      </h2>
      <p class="mt-4 max-w-2xl leading-7 text-muted">
        当前围绕六个相互关联的主题持续积累：
      </p>
      <div class="mt-7 grid border-l border-t border-ink/20 sm:grid-cols-2">
        <RouterLink
          v-for="topic in topics"
          :key="topic.slug"
          :to="`/topics/${topic.slug}`"
          class="group flex items-center justify-between border-b border-r border-ink/20 px-5 py-4 transition-colors hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <span class="font-semibold text-ink">{{ topic.name }}</span>
          <span class="font-mono text-xs text-accent">/{{ topic.slug }}</span>
        </RouterLink>
      </div>
    </section>

    <section aria-labelledby="roadmap-title" class="border-t border-ink/20 pt-10">
      <h2 id="roadmap-title" class="font-display text-2xl font-semibold tracking-tight text-ink">
        后续计划
      </h2>
      <p class="mt-4 max-w-2xl leading-7 text-muted">
        第一版只使用仓库内的静态内容。后续计划接入数据采集、分析与统计服务，为各主题补充可追溯的指标与图表。
      </p>
      <p class="mt-8 border-l-2 border-accent pl-4 font-semibold leading-7 text-ink">
        本站内容仅用于个人研究记录与交流，不构成投资建议。
      </p>
    </section>
  </div>
</template>
