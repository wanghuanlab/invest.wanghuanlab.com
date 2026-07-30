<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section aria-labelledby="not-found-title">
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
