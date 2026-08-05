<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/content/markdown'
import PortfolioLineChart, { type SeriesItem } from './PortfolioLineChart.vue'

const props = defineProps<{
  source: string
}>()

interface Section {
  id: string
  type: 'html' | 'chart'
  content?: string
  chartData?: {
    title?: string
    dates: string[]
    series: SeriesItem[]
  }
}

const sections = computed<Section[]>(() => {
  const rawHtml = renderMarkdown(props.source)
  const result: Section[] = []
  
  // 正则匹配 <div data-portfolio-chart="..."></div> 或 data-portfolio-chart='...'
  const chartRegex = /<div\s+data-portfolio-chart=(['"])([\s\S]*?)\1\s*>\s*<\/div>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = chartRegex.exec(rawHtml)) !== null) {
    const htmlChunk = rawHtml.slice(lastIndex, match.index)
    if (htmlChunk) {
      result.push({ id: `html-${lastIndex}`, type: 'html', content: htmlChunk })
    }
    
    try {
      const unescapedJson = match[2]
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
      
      const parsedData = JSON.parse(unescapedJson)
      result.push({
        id: `chart-${match.index}`,
        type: 'chart',
        chartData: parsedData,
      })
    } catch (e) {
      console.error('Failed to parse portfolio chart JSON data:', e)
    }

    lastIndex = chartRegex.lastIndex
  }

  const remainingHtml = rawHtml.slice(lastIndex)
  if (remainingHtml) {
    result.push({ id: `html-${lastIndex}`, type: 'html', content: remainingHtml })
  }

  return result
})
</script>

<template>
  <div class="prose-invest">
    <template v-for="sec in sections" :key="sec.id">
      <div v-if="sec.type === 'html'" v-html="sec.content"></div>
      <PortfolioLineChart
        v-else-if="sec.type === 'chart' && sec.chartData"
        :title="sec.chartData.title"
        :dates="sec.chartData.dates"
        :series="sec.chartData.series"
      />
    </template>
  </div>
</template>
