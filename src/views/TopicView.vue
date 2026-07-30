<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from '@/components/ArticleList.vue'
import { getArticlesByTopic, getTopic } from '@/content/loadContent'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const topic = computed(() => getTopic(slug.value))
const articles = computed(() => getArticlesByTopic(slug.value))

watchEffect(() => {
  if (typeof document === 'undefined') return
  document.title = topic.value ? `${topic.value.name} | Invest Lab` : '页面未找到 | Invest Lab'
})
</script>

<template>
  <div v-if="topic">
    <section aria-labelledby="topic-title">
      <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">
        /topics/{{ slug }}
      </p>
      <h1
        id="topic-title"
        class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink"
      >
        {{ topic.name }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-8 text-muted">
        {{ topic.summary }}
      </p>
    </section>

    <section aria-labelledby="articles-title" class="py-16">
      <h2
        id="articles-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        主题文章
      </h2>
      <ArticleList :articles="articles" />
    </section>

    <section
      aria-labelledby="data-slot-title"
      class="border border-ink/15 bg-ink/[0.025] p-6 sm:p-8"
    >
      <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">Data slot</p>
      <h2
        id="data-slot-title"
        class="mt-3 font-display text-2xl font-semibold tracking-tight text-ink"
      >
        主题数据
      </h2>
      <p class="mt-4 max-w-2xl leading-7 text-muted">
        数据区预留：后续将接入采集与统计服务，用于展示该主题的关键指标。第一版不提供图表。
      </p>
    </section>
  </div>

  <section v-else aria-labelledby="not-found-title">
    <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">404</p>
    <h1
      id="not-found-title"
      class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink"
    >
      页面未找到
    </h1>
    <p class="mt-4 font-mono text-sm text-muted">{{ route.path }}</p>
    <RouterLink
      to="/"
      class="mt-8 inline-block text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      返回首页
    </RouterLink>
  </section>
</template>
