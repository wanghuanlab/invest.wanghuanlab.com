import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import TopicView from './TopicView.vue'

async function renderTopic(path: string): Promise<string> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/topics/:slug', name: 'topic', component: TopicView },
      {
        path: '/topics/:slug/:article',
        name: 'article',
        component: { template: '<div />' },
      },
    ],
  })
  await router.push(path)
  await router.isReady()

  const app = createSSRApp(TopicView)
  app.use(router)
  return renderToString(app)
}

describe('TopicView', () => {
  it('renders the topic intro, articles, and future data slot', async () => {
    const html = await renderTopic('/topics/gold')

    expect(html).toContain('黄金')
    expect(html).toContain('实际利率、美元与避险需求的三角关系。')
    expect(html).toContain('实际利率视角下的黄金')
    expect(html).toContain('后续将接入采集与统计服务')
    expect(html).toContain('第一版不提供图表')
  })

  it('renders the site 404 experience for an unknown topic', async () => {
    const html = await renderTopic('/topics/nope')

    expect(html).toContain('404')
    expect(html).toContain('页面未找到')
    expect(html).toContain('/topics/nope')
    expect(html).toContain('返回首页')
  })
})
