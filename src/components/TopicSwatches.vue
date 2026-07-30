<script setup lang="ts">
import { topicColor } from '@/content/topicColors'
import type { Topic } from '@/content/types'

defineProps<{
  topics: Topic[]
}>()
</script>

<template>
  <ul
    aria-label="研究主题色标"
    class="flex flex-wrap gap-x-5 gap-y-3 border-y border-ink/20 py-4"
  >
    <li v-for="topic in topics" :key="topic.slug">
      <RouterLink
        :to="{ name: 'topic', params: { slug: topic.slug } }"
        class="group flex items-center gap-2.5 font-mono text-xs text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          class="h-2 w-7 transition-transform group-hover:scale-x-110"
          :style="{ backgroundColor: topicColor(topic.slug) }"
        />
        <span>{{ topic.name }}</span>
      </RouterLink>
    </li>
  </ul>
</template>
