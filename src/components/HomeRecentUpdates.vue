<script setup lang="ts">
import { getTopic } from '@/content/loadContent'
import { topicColor } from '@/content/topicColors'
import type { ArticleMeta } from '@/content/types'

defineProps<{
  articles: ArticleMeta[]
}>()

function topicName(slug: string): string {
  return getTopic(slug)?.name ?? slug
}
</script>

<template>
  <section
    v-if="articles.length"
    aria-labelledby="latest-brief-title"
    class="mt-8 border-y border-ink/25"
  >
    <div class="flex items-center justify-between border-b border-ink/20 py-4">
      <h2
        id="latest-brief-title"
        class="border-l-2 border-accent pl-3 font-display text-base font-semibold text-ink"
      >
        最近更新
      </h2>
      <a
        href="#latest"
        class="font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        查看全部更新 →
      </a>
    </div>

    <ol class="grid divide-y divide-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0">
      <li
        v-for="article in articles.slice(0, 3)"
        :key="`${article.topicSlug}/${article.slug}`"
      >
        <RouterLink
          :to="{
            name: 'article',
            params: { slug: article.topicSlug, article: article.slug },
          }"
          class="group block min-h-32 p-4 transition-colors hover:bg-ink/[0.035] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:p-5"
        >
          <span class="flex items-center gap-2 font-mono text-xs text-muted">
            <span
              aria-hidden="true"
              class="size-2"
              :style="{ backgroundColor: topicColor(article.topicSlug) }"
            />
            {{ topicName(article.topicSlug) }}
          </span>
          <span
            class="mt-3 block font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-accent"
          >
            {{ article.title }}
          </span>
          <time
            :datetime="article.date"
            class="mt-4 block font-mono text-xs tabular-nums text-muted"
          >
            {{ article.date }}
          </time>
        </RouterLink>
      </li>
    </ol>
  </section>
</template>
