<script setup lang="ts">
import { useRoute } from 'vue-router'
import NotFoundBlock from '@/components/NotFoundBlock.vue'

const route = useRoute()
</script>

<template>
  <NotFoundBlock :path="route.path" />
</template>
