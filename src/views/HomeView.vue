<script setup lang="ts">
import ArticleList from '@/components/ArticleList.vue'
import TopicGrid from '@/components/TopicGrid.vue'
import { getRecentArticles, getTopics } from '@/content/loadContent'

const topics = getTopics()
const recentArticles = getRecentArticles(6)
</script>

<template>
  <div>
    <section
      aria-labelledby="home-title"
      class="flex min-h-[calc(100dvh-12rem)] flex-col justify-center py-12"
    >
      <p class="font-display text-lg font-semibold tracking-tight text-accent">
        Invest Lab
      </p>
      <h1
        id="home-title"
        class="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl"
      >
        利率到房产的个人宏观笔记
      </h1>
      <a
        href="#topics"
        class="mt-10 w-fit border border-ink bg-ink px-5 py-3 font-mono text-sm text-paper transition-[background-color,color,transform] hover:bg-transparent hover:text-ink active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        浏览主题
      </a>
    </section>

    <section id="topics" aria-labelledby="topics-title" class="scroll-mt-6 py-16">
      <h2
        id="topics-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        研究主题
      </h2>
      <TopicGrid :topics="topics" />
    </section>

    <section aria-labelledby="recent-title" class="py-16">
      <h2
        id="recent-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        最近更新
      </h2>
      <ArticleList :articles="recentArticles" show-topic />
    </section>
  </div>
</template>
