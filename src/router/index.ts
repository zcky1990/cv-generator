import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'builder',
      component: () => import('@/views/BuilderView.vue'),
      meta: { title: 'CV Builder' },
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue'),
      meta: { title: 'Preview' },
    },
  ],
})

router.beforeEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = `${title} - Printable CV`
  }
  return true
})

export default router
