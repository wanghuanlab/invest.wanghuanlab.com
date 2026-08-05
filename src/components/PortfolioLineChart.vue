<script setup lang="ts">
import { ref, computed } from 'vue'

export interface SeriesItem {
  name: string
  color: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    title?: string
    dates: string[]
    series: SeriesItem[]
  }>(),
  {
    title: '投资组合走势分析',
  }
)

const activeIndex = ref<number | null>(null)

// SVG viewBox 坐标空间定义
const width = 680
const height = 320
const padding = { top: 40, right: 30, bottom: 40, left: 50 }

const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// 计算全局 min 和 max 值
const allValues = computed(() => props.series.flatMap((s) => s.data))
const minValue = computed(() => {
  const min = Math.min(...allValues.value)
  return Math.floor(min - 1)
})
const maxValue = computed(() => {
  const max = Math.max(...allValues.value)
  return Math.ceil(max + 1)
})

// 计算 Y 轴刻度
const yTicks = computed(() => {
  const count = 5
  const step = (maxValue.value - minValue.value) / (count - 1)
  return Array.from({ length: count }, (_, i) => {
    const val = minValue.value + step * i
    return Math.round(val * 10) / 10
  })
})

// 坐标映射
function getX(index: number): number {
  if (props.dates.length <= 1) return padding.left + chartWidth / 2
  return padding.left + (index / (props.dates.length - 1)) * chartWidth
}

function getY(val: number): number {
  const range = maxValue.value - minValue.value || 1
  return padding.top + chartHeight - ((val - minValue.value) / range) * chartHeight
}

// SVG path 路径生成
function getPathD(data: number[]): string {
  if (data.length === 0) return ''
  return data.reduce((acc, val, i) => {
    const x = getX(i)
    const y = getY(val)
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, '')
}

function handleMouseMove(event: MouseEvent) {
  const svg = event.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  
  // 转换相对 viewBox 缩放比的 X
  const scaledX = (mouseX / rect.width) * width
  const relativeX = scaledX - padding.left

  if (relativeX < 0 || relativeX > chartWidth) {
    activeIndex.value = null
    return
  }

  const stepWidth = chartWidth / (props.dates.length - 1)
  const index = Math.round(relativeX / stepWidth)
  if (index >= 0 && index < props.dates.length) {
    activeIndex.value = index
  }
}

function handleMouseLeave() {
  activeIndex.value = null
}
</script>

<template>
  <div class="portfolio-chart-wrapper my-6 p-4 rounded-lg border border-[color-mix(in_srgb,var(--color-ink)_15%,transparent)] bg-[color-mix(in_srgb,var(--color-paper)_50%,white)]">
    <!-- Chart Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 class="text-lg font-semibold font-display text-[var(--color-ink)] m-0">
        {{ title }}
      </h3>
      <!-- Legend -->
      <div class="flex items-center gap-4 text-xs font-medium">
        <div v-for="item in series" :key="item.name" class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full inline-block" :style="{ backgroundColor: item.color }"></span>
          <span class="text-[var(--color-ink)]">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- SVG Chart Area -->
    <div class="relative w-full overflow-hidden select-none">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full h-auto cursor-crosshair overflow-visible"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <!-- Background Grid Lines -->
        <g class="grid-lines">
          <line
            v-for="tick in yTicks"
            :key="tick"
            :x1="padding.left"
            :y1="getY(tick)"
            :x2="width - padding.right"
            :y2="getY(tick)"
            stroke="rgba(11, 31, 51, 0.08)"
            stroke-dasharray="4 4"
            stroke-width="1"
          />
        </g>

        <!-- Y Axis Labels -->
        <g class="y-labels text-xs">
          <text
            v-for="tick in yTicks"
            :key="tick"
            :x="padding.left - 8"
            :y="getY(tick) + 4"
            text-anchor="end"
            fill="var(--color-muted)"
            font-size="11"
            font-family="var(--font-mono)"
          >
            {{ tick }}
          </text>
        </g>

        <!-- X Axis Labels -->
        <g class="x-labels text-xs">
          <text
            v-for="(d, i) in dates"
            :key="d"
            :x="getX(i)"
            :y="height - 12"
            text-anchor="middle"
            fill="var(--color-muted)"
            font-size="11"
            font-family="var(--font-mono)"
          >
            {{ d.slice(5) }}
          </text>
        </g>

        <!-- Lines -->
        <g class="series-lines">
          <path
            v-for="item in series"
            :key="item.name"
            :d="getPathD(item.data)"
            fill="none"
            :stroke="item.color"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>

        <!-- Data Dots -->
        <g class="data-dots">
          <template v-for="item in series" :key="item.name">
            <circle
              v-for="(val, i) in item.data"
              :key="i"
              :cx="getX(i)"
              :cy="getY(val)"
              r="3.5"
              :fill="item.color"
              stroke="var(--color-paper)"
              stroke-width="1.5"
            />
          </template>
        </g>

        <!-- Active Hover Indicator & Line -->
        <g v-if="activeIndex !== null">
          <line
            :x1="getX(activeIndex)"
            :y1="padding.top"
            :x2="getX(activeIndex)"
            :y2="height - padding.bottom"
            stroke="var(--color-ink)"
            stroke-opacity="0.3"
            stroke-dasharray="3 3"
            stroke-width="1.5"
          />
          <circle
            v-for="item in series"
            :key="item.name"
            :cx="getX(activeIndex)"
            :cy="getY(item.data[activeIndex])"
            r="5.5"
            :fill="item.color"
            stroke="#ffffff"
            stroke-width="2"
          />
        </g>
      </svg>

      <!-- Active Hover Tooltip Box -->
      <div
        v-if="activeIndex !== null"
        class="absolute top-2 right-4 pointer-events-none bg-[var(--color-ink)] text-white text-xs p-2.5 rounded shadow-lg opacity-90 border border-slate-700 font-mono flex flex-col gap-1 min-w-[140px]"
      >
        <div class="font-semibold text-slate-300 pb-1 border-b border-slate-700">
          📅 {{ dates[activeIndex] }}
        </div>
        <div
          v-for="item in series"
          :key="item.name"
          class="flex items-center justify-between gap-3"
        >
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full inline-block" :style="{ backgroundColor: item.color }"></span>
            <span>{{ item.name }}</span>
          </span>
          <span class="font-bold">{{ item.data[activeIndex] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.portfolio-chart-wrapper {
  box-shadow: 0 1px 3px rgba(11, 31, 51, 0.05);
}
</style>
