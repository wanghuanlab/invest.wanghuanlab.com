<script setup lang="ts">
import ArticleList from '@/components/ArticleList.vue'
import HomeReadingPanel from '@/components/HomeReadingPanel.vue'
import TopicGrid from '@/components/TopicGrid.vue'
import TopicSwatches from '@/components/TopicSwatches.vue'
import { getFeaturedArticles, getRecentArticles, getTopics } from '@/content/loadContent'

const topics = getTopics()
const recentArticles = getRecentArticles()
const featuredArticle = getFeaturedArticles(1)[0] ?? recentArticles[0]
const latestArticles = recentArticles.filter(
  (article) =>
    article.slug !== featuredArticle?.slug ||
    article.topicSlug !== featuredArticle.topicSlug,
)
</script>

<template>
  <div>
    <section aria-labelledby="home-title" class="py-10 sm:py-14 lg:py-20">
      <div
        class="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:gap-16"
      >
        <div class="py-2">
          <p class="font-display text-lg font-semibold tracking-tight text-accent">
            Invest Lab
          </p>
          <h1
            id="home-title"
            class="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl"
          >
            个人投资思考笔记
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            连接利率与资产，理解周期与结构，
            <br class="hidden sm:block" />
            在不确定的世界里寻找可重复的思考。
          </p>
          <a
            href="#topics"
            class="mt-9 inline-flex border border-ink bg-ink px-5 py-3 font-mono text-sm text-paper transition-[background-color,color,transform] hover:bg-transparent hover:text-ink active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            浏览主题
          </a>
          <p class="mt-8 border-l-2 border-accent pl-3 font-mono text-xs tracking-[0.08em] text-muted">
            静态 Markdown 研究库
          </p>
          <TopicSwatches :topics="topics" class="mt-14" />
        </div>

        <HomeReadingPanel :featured="featuredArticle" :latest="latestArticles" />
      </div>
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

    <section id="latest" aria-labelledby="recent-title" class="py-16">
      <h2
        id="recent-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        最新文章
      </h2>
      <ArticleList :articles="recentArticles" show-topic />
    </section>
  </div>
</template>
