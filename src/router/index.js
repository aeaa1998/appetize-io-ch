import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/',
          component: () => import('@/views/Samples.vue')
        },
        {
          path: 'sample/share',
          component: () => import('@/views/samples/ShareSample.vue')
        },
        {
          path: 'sample/speedrunner',
          component: () => import('@/views/samples/SpeedRunnerSample.vue')
        }
      ]
    }
  ]
})

export default router
