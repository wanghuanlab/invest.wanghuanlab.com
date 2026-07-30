import { readFileSync } from 'node:fs'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import AboutView from './AboutView.vue'
import NotFoundView from './NotFoundView.vue'

const readProjectFile = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

async function renderStaticPage(path: string): Promise<string> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/about', name: 'about', component: AboutView },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
  })
  await router.push(path)
  await router.isReady()

  const component = path === '/about' ? AboutView : NotFoundView
  const app = createSSRApp(component)
  app.use(router)
  return renderToString(app)
}

describe('static informational pages', () => {
  it('renders the About brief from the shared topic data', async () => {
    const html = await renderStaticPage('/about')

    expect(html).toContain('个人宏观与跨资产研究笔记')
    for (const topic of ['利率', '国债', '股票', '黄金', '人口', '房产']) {
      expect(html).toContain(topic)
    }
    expect(html).toContain('采集、分析与统计')
    expect(html).toContain('不构成投资建议')
  })

  it('offers recovery links from the 404 page', async () => {
    const html = await renderStaticPage('/missing-page')

    expect(html).toContain('没有找到这个页面，地址可能已经变更或输入有误。')
    expect(html).toContain('/missing-page')
    expect(html).toContain('返回首页')
    expect(html).toContain('浏览主题')
    expect(html).toContain('href="/#topics"')
  })

  it('keeps the API directory reserved with the exact V1 notice', () => {
    expect(readProjectFile('src/api/README.md')).toBe(
      '# API client (reserved)\n\n' +
        'Future home for HTTP clients that talk to acquisition / analytics / stats services.\n\n' +
        'V1 ships with static `content/` only. Do not add mock chart APIs here yet.\n',
    )
  })

  it('documents setup, verification, and adding notes', () => {
    const source = readProjectFile('README.md')

    for (const command of ['npm install', 'npm run dev', 'npm run build', 'npm test']) {
      expect(source).toContain(command)
    }
    expect(source).toContain('content/<topic>/<article-slug>.md')
    expect(source).toContain('title')
    expect(source).toContain('date')
    expect(source).toContain('summary')
    expect(source).toContain('tags')
    expect(source).toContain('docs/superpowers/specs/2026-07-30-invest-lab-design.md')
  })
})
