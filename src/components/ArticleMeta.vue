<script setup lang="ts">
defineProps<{
  title: string
  date: string
  topicName: string
  topicSlug: string
}>()
</script>

<template>
  <header class="border-b border-ink/15 pb-10">
    <RouterLink
      :to="{ name: 'topic', params: { slug: topicSlug } }"
      class="font-mono text-xs uppercase tracking-[0.16em] text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {{ topicName }}
    </RouterLink>
    <h1
      id="article-title"
      class="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl"
    >
      {{ title }}
    </h1>
    <time :datetime="date" class="mt-6 block font-mono text-xs tabular-nums text-muted">
      {{ date }}
    </time>
  </header>
</template>
