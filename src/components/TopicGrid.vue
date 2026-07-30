<script setup lang="ts">
import type { Topic } from '@/content/types'

defineProps<{
  topics: Topic[]
}>()
</script>

<template>
  <div class="grid border-l border-t border-ink/20 md:grid-cols-2">
    <RouterLink
      v-for="(topic, index) in topics"
      :key="topic.slug"
      :to="{ name: 'topic', params: { slug: topic.slug } }"
      class="topic-link group min-h-44 border-b border-r border-ink/20 p-6 transition-colors hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:p-8"
      :style="{ animationDelay: `${index * 70}ms` }"
    >
      <span class="font-mono text-xs text-accent">/{{ topic.slug }}</span>
      <h3 class="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">
        <span
          class="bg-gradient-to-r from-accent to-accent bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]"
        >
          {{ topic.name }}
        </span>
      </h3>
      <p class="mt-3 max-w-sm leading-7 text-muted">
        {{ topic.summary }}
      </p>
    </RouterLink>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .topic-link {
    animation: fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
