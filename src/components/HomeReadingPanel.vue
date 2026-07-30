<script setup lang="ts">
import { getTopic } from '@/content/loadContent'
import type { ArticleMeta } from '@/content/types'

defineProps<{
  featured?: ArticleMeta
}>()

function topicName(slug: string): string {
  return getTopic(slug)?.name ?? slug
}
</script>

<template>
  <aside
    aria-labelledby="reading-title"
    class="border border-ink/25 bg-paper/45 p-5 sm:p-6"
  >
    <div class="flex items-center justify-between border-b border-ink/25 pb-4">
      <h2
        id="reading-title"
        class="border-l-2 border-accent pl-3 font-display text-base font-semibold text-ink"
      >
        推荐阅读
      </h2>
      <a
        href="#latest"
        class="font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        查看全部 →
      </a>
    </div>

    <RouterLink
      v-if="featured"
      :to="{
        name: 'article',
        params: { slug: featured.topicSlug, article: featured.slug },
      }"
      class="group mt-6 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <p class="font-mono text-xs text-accent">
        {{ topicName(featured.topicSlug) }}
      </p>
      <h3
        class="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent"
      >
        {{ featured.title }}
      </h3>
      <time :datetime="featured.date" class="mt-3 block font-mono text-xs text-muted">
        {{ featured.date }}
      </time>
      <img
        v-if="featured.cover"
        :src="featured.cover"
        :alt="featured.title"
        class="mt-5 aspect-video w-full border border-ink/20 object-cover"
      />
      <p class="mt-4 line-clamp-2 text-sm leading-6 text-muted">
        {{ featured.summary }}
      </p>
    </RouterLink>

  </aside>
</template>
