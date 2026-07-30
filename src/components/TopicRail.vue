<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getTopics } from '@/content/loadContent'

const route = useRoute()
const topics = getTopics()

function isCurrentTopic(slug: string): boolean {
  return route.params.slug === slug
}
</script>

<template>
  <nav class="border-b border-ink/15" aria-label="研究主题">
    <div class="mx-auto w-full max-w-5xl overflow-x-auto px-4">
      <div class="flex min-w-max items-center gap-7">
        <RouterLink
          v-for="topic in topics"
          :key="topic.slug"
          :to="{ name: 'topic', params: { slug: topic.slug } }"
          class="border-b-2 px-0.5 py-3 font-mono text-xs tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :class="
            isCurrentTopic(topic.slug)
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:border-ink/25 hover:text-ink'
          "
          :aria-current="isCurrentTopic(topic.slug) ? 'page' : undefined"
        >
          {{ topic.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
