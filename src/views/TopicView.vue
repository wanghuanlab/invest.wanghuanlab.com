<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTopic } from '@/content/loadContent'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const topic = computed(() => getTopic(slug.value))
</script>

<template>
  <section aria-labelledby="topic-title">
    <p class="font-mono text-xs uppercase tracking-[0.16em] text-accent">
      /topics/{{ slug }}
    </p>
    <h1 id="topic-title" class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
      {{ topic?.name ?? slug }}
    </h1>
    <p v-if="topic" class="mt-4 max-w-2xl text-lg leading-8 text-muted">
      {{ topic.summary }}
    </p>
  </section>
</template>
