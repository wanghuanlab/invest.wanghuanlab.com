import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TopicView from '@/views/TopicView.vue'
import ArticleView from '@/views/ArticleView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { getPageTitle } from './pageTitle'
import { getScrollPosition } from './scrollBehavior'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/topics/:slug', name: 'topic', component: TopicView },
    {
      path: '/topics/:slug/:article',
      name: 'article',
      component: ArticleView,
    },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior(to) {
    return getScrollPosition(to)
  },
})

router.afterEach((to) => {
  if (typeof document !== 'undefined') {
    document.title = getPageTitle(to.name, to.params)
  }
})
