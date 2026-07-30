import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import HomeView from './HomeView.vue'

async function renderHome(): Promise<string> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      {
        path: '/topics/:slug',
        name: 'topic',
        component: { template: '<div />' },
      },
      {
        path: '/topics/:slug/:article',
        name: 'article',
        component: { template: '<div />' },
      },
    ],
  })
  await router.push('/')
  await router.isReady()

  const app = createSSRApp(HomeView)
  app.use(router)
  return renderToString(app)
}

describe('HomeView', () => {
  it('renders the home narrative and reading sections', async () => {
    const html = await renderHome()

    expect(html).toContain('个人投资思考笔记')
    expect(html).toContain('推荐阅读')
    expect(html).toContain('最近更新')
    expect(html).toContain('静态 Markdown 研究库')
  })
})
