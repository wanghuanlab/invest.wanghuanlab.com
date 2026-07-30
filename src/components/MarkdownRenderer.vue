<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/content/markdown'

const props = defineProps<{
  source: string
}>()

const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <div class="prose-invest" v-html="html" />
</template>
