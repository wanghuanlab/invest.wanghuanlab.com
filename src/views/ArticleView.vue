<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const topicSlug = computed(() => String(route.params.slug ?? ''))
const articleSlug = computed(() => String(route.params.article ?? ''))
</script>

<template>
  <article aria-labelledby="article-title">
    <p class="font-mono text-xs text-accent">/topics/{{ topicSlug }}/{{ articleSlug }}</p>
    <h1
      id="article-title"
      class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink"
    >
      {{ articleSlug }}
    </h1>
  </article>
</template>
