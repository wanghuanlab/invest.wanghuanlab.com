<script setup lang="ts">
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import TopicRail from '@/components/TopicRail.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <TopicRail />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
