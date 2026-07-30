<script setup lang="ts">
import { getTopic } from '@/content/loadContent'
import type { ArticleMeta } from '@/content/types'

withDefaults(
  defineProps<{
    articles: ArticleMeta[]
    showTopic?: boolean
  }>(),
  {
    showTopic: false,
  },
)

function topicName(slug: string): string {
  return getTopic(slug)?.name ?? slug
}
</script>

<template>
  <ol class="border-t border-ink/20">
    <li
      v-for="article in articles"
      :key="`${article.topicSlug}/${article.slug}`"
      class="grid gap-4 border-b border-ink/15 py-7 md:grid-cols-[8rem_1fr] md:gap-8"
    >
      <div class="flex items-center gap-3 md:block">
        <time :datetime="article.date" class="font-mono text-xs tabular-nums text-muted">
          {{ article.date }}
        </time>
        <span
          v-if="showTopic"
          class="font-mono text-xs text-accent md:mt-3 md:block"
        >
          {{ topicName(article.topicSlug) }}
        </span>
      </div>
      <div>
        <h3 class="font-display text-xl font-semibold leading-snug tracking-tight text-ink">
          <RouterLink
            :to="{
              name: 'article',
              params: { slug: article.topicSlug, article: article.slug },
            }"
            class="bg-gradient-to-r from-accent to-accent bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {{ article.title }}
          </RouterLink>
        </h3>
        <p class="mt-3 max-w-2xl leading-7 text-muted">
          {{ article.summary }}
        </p>
      </div>
    </li>
  </ol>
</template>
