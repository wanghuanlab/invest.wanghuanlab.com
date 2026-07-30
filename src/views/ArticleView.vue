<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ArticleMeta from '@/components/ArticleMeta.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { getAdjacentArticles, getArticle, getTopic } from '@/content/loadContent'

const route = useRoute()
const topicSlug = computed(() => String(route.params.slug ?? ''))
const articleSlug = computed(() => String(route.params.article ?? ''))
const article = computed(() => getArticle(topicSlug.value, articleSlug.value))
const topic = computed(() => getTopic(topicSlug.value))
const adjacent = computed(() => getAdjacentArticles(topicSlug.value, articleSlug.value))

watchEffect(() => {
  if (typeof document === 'undefined') return
  document.title = article.value
    ? `${article.value.title} | Invest Lab`
    : '页面未找到 | Invest Lab'
})
</script>

<template>
  <article v-if="article && topic" aria-labelledby="article-title" class="mx-auto max-w-3xl">
    <ArticleMeta
      :title="article.title"
      :date="article.date"
      :topic-name="topic.name"
      :topic-slug="topic.slug"
    />

    <MarkdownRenderer :source="article.body" />

    <footer class="mt-16 border-t border-ink/20 pt-8">
      <RouterLink
        :to="{ name: 'topic', params: { slug: topic.slug } }"
        class="text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        返回{{ topic.name }}
      </RouterLink>

      <nav
        v-if="adjacent.prev || adjacent.next"
        aria-label="相邻文章"
        class="mt-10 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-2"
      >
        <RouterLink
          v-if="adjacent.prev"
          :to="{
            name: 'article',
            params: { slug: adjacent.prev.topicSlug, article: adjacent.prev.slug },
          }"
          class="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span class="font-mono text-xs text-muted">上一篇 · 更旧</span>
          <span class="mt-2 block font-display text-lg font-semibold text-ink group-hover:text-accent">
            {{ adjacent.prev.title }}
          </span>
        </RouterLink>
        <RouterLink
          v-if="adjacent.next"
          :to="{
            name: 'article',
            params: { slug: adjacent.next.topicSlug, article: adjacent.next.slug },
          }"
          class="group sm:text-right sm:[grid-column:2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span class="font-mono text-xs text-muted">下一篇 · 更新</span>
          <span class="mt-2 block font-display text-lg font-semibold text-ink group-hover:text-accent">
            {{ adjacent.next.title }}
          </span>
        </RouterLink>
      </nav>
    </footer>
  </article>

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
