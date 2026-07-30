import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import ArticleView from './ArticleView.vue'

async function renderArticle(path: string): Promise<string> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/topics/:slug', name: 'topic', component: { template: '<div />' } },
      {
        path: '/topics/:slug/:article',
        name: 'article',
        component: ArticleView,
      },
    ],
  })
  await router.push(path)
  await router.isReady()

  const app = createSSRApp(ArticleView)
  app.use(router)
  return renderToString(app)
}

describe('ArticleView', () => {
  it.each([
    ['/topics/housing/rates-meet-inventory', '利率遇上库存：房产笔记起点'],
    ['/topics/demographics/age-structure-lens', '年龄结构：人口主题的观察镜头'],
    ['/topics/gold/real-yields-and-gold', '实际利率视角下的黄金'],
    ['/topics/stocks/earnings-vs-multiple', '盈利还是估值：股票笔记入口'],
    ['/topics/bonds/duration-and-supply', '久期与供给：国债笔记提纲'],
    ['/topics/rates/reading-the-policy-rate', '读懂政策利率的第一层'],
  ])('renders the sample article at %s', async (path, title) => {
    const html = await renderArticle(path)

    expect(html).toContain(title)
    expect(html).toContain('<h2>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<blockquote>')
  })

  it('renders article metadata and Markdown as semantic HTML', async () => {
    const html = await renderArticle('/topics/rates/reading-the-policy-rate')

    expect(html).toContain('读懂政策利率的第一层')
    expect(html).toContain('2026-07-24')
    expect(html).toContain('利率')
    expect(html).toContain('<div class="prose-invest">')
    expect(html).toContain('<h2>这一层先记住什么</h2>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<strong>变的是哪一层利率、持续多久、影响谁的融资成本</strong>')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('返回利率')
  })

  it('hides unavailable adjacent article directions', async () => {
    const html = await renderArticle('/topics/gold/real-yields-and-gold')

    expect(html).not.toContain('上一篇')
    expect(html).not.toContain('下一篇')
  })

  it('renders the site 404 experience for a missing article', async () => {
    const html = await renderArticle('/topics/gold/nope')

    expect(html).toContain('404')
    expect(html).toContain('页面未找到')
    expect(html).toContain('没有找到这个页面，地址可能已经变更或输入有误。')
    expect(html).toContain('/topics/gold/nope')
    expect(html).toContain('返回首页')
    expect(html).toContain('浏览主题')
    expect(html).toContain('href="/#topics"')
  })
})
