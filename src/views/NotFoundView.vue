<script setup lang="ts">
import { useRoute } from 'vue-router'
import NotFoundBlock from '@/components/NotFoundBlock.vue'

const route = useRoute()
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <NotFoundBlock :path="route.path" />
  </div>
</template>
