<script setup lang="ts">
import ArticleList from '@/components/ArticleList.vue'
import TopicGrid from '@/components/TopicGrid.vue'
import {
  getFeaturedArticles,
  getRecentArticles,
  getTopic,
  getTopics,
} from '@/content/loadContent'

const topics = getTopics()
const recentArticles = getRecentArticles(6)
const featuredArticles = getFeaturedArticles(6)
const featuredArticle = featuredArticles[0]
const latestArticles = recentArticles.filter(
  (article) =>
    article.slug !== featuredArticle?.slug ||
    article.topicSlug !== featuredArticle.topicSlug,
)

function topicName(slug: string): string {
  return getTopic(slug)?.name ?? slug
}
</script>

<template>
  <div>
    <section aria-labelledby="home-title" class="py-10 sm:py-14 lg:py-20">
      <div
        class="grid gap-12 lg:items-start lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.72fr)] lg:gap-16"
      >
        <div class="py-2">
          <p class="font-display text-lg font-semibold tracking-tight text-accent">
            Invest Lab
          </p>
          <h1
            id="home-title"
            class="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl"
          >
            个人投资思考笔记
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            连接利率与资产，理解周期与结构，
            <br class="hidden sm:block" />
            在不确定的世界里寻找可重复的思考。
          </p>
          <a
            href="#topics"
            class="mt-9 inline-flex border border-ink bg-ink px-5 py-3 font-mono text-sm text-paper transition-[background-color,color,transform] hover:bg-transparent hover:text-ink active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            浏览主题
          </a>
          <p class="mt-8 border-l-2 border-accent pl-3 font-mono text-xs tracking-[0.08em] text-muted">
            静态 Markdown 研究库
          </p>

          <div class="mt-14 border-y border-ink/20 py-4">
            <ul
              class="flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs text-muted"
              aria-label="研究主题索引"
            >
              <li v-for="topic in topics" :key="topic.slug">
                <RouterLink
                  :to="{ name: 'topic', params: { slug: topic.slug } }"
                  class="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {{ topic.name }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <aside
          class="border border-ink/25 bg-paper/45 p-5 sm:p-6"
          aria-labelledby="reading-title"
        >
          <div class="flex items-center justify-between border-b border-ink/25 pb-4">
            <h2
              id="reading-title"
              class="border-l-2 border-accent pl-3 font-display text-base font-semibold text-ink"
            >
              推荐阅读
            </h2>
            <a
              href="#latest"
              class="font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              查看全部 →
            </a>
          </div>

          <template v-if="featuredArticle">
            <RouterLink
              :to="{
                name: 'article',
                params: {
                  slug: featuredArticle.topicSlug,
                  article: featuredArticle.slug,
                },
              }"
              class="group mt-6 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <p class="font-mono text-xs text-accent">
                {{ topicName(featuredArticle.topicSlug) }}
              </p>
              <h3
                class="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent"
              >
                {{ featuredArticle.title }}
              </h3>
              <time
                :datetime="featuredArticle.date"
                class="mt-3 block font-mono text-xs text-muted"
              >
                {{ featuredArticle.date }}
              </time>
              <img
                src="/images/six-paths-for-ordinary-investors.png"
                :alt="featuredArticle.title"
                class="mt-5 aspect-[3/2] w-full border border-ink/20 object-cover"
              />
              <p class="mt-4 text-sm leading-6 text-muted">
                {{ featuredArticle.summary }}
              </p>
            </RouterLink>
          </template>

          <section
            v-if="latestArticles.length"
            aria-labelledby="latest-brief-title"
            class="mt-7 border-t border-ink/25 pt-5"
          >
            <h3
              id="latest-brief-title"
              class="border-l-2 border-accent pl-3 font-display text-base font-semibold text-ink"
            >
              最近更新
            </h3>
            <ol class="mt-4 divide-y divide-ink/15 border-y border-ink/15">
              <li
                v-for="article in latestArticles.slice(0, 3)"
                :key="`${article.topicSlug}/${article.slug}`"
              >
                <RouterLink
                  :to="{
                    name: 'article',
                    params: { slug: article.topicSlug, article: article.slug },
                  }"
                  class="grid grid-cols-[1fr_auto] gap-4 py-3 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <span>
                    <span class="block font-mono text-xs text-accent">
                      {{ topicName(article.topicSlug) }}
                    </span>
                    <span class="mt-1 block text-sm font-semibold leading-5 text-ink">
                      {{ article.title }}
                    </span>
                  </span>
                  <time
                    :datetime="article.date"
                    class="pt-1 font-mono text-xs tabular-nums text-muted"
                  >
                    {{ article.date }}
                  </time>
                </RouterLink>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </section>

    <section id="topics" aria-labelledby="topics-title" class="scroll-mt-6 py-16">
      <h2
        id="topics-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        研究主题
      </h2>
      <TopicGrid :topics="topics" />
    </section>

    <section id="latest" aria-labelledby="recent-title" class="py-16">
      <h2
        id="recent-title"
        class="mb-8 font-display text-3xl font-semibold tracking-tight text-ink"
      >
        最新文章
      </h2>
      <ArticleList :articles="recentArticles" show-topic />
    </section>
  </div>
</template>
