import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue'),
    },
    {
      path: '/bag',
      name: 'bag',
      component: () => import('../views/BagView.vue'),
    },
    {
      path: '/dev',
      name: 'dev',
      component: () => import('../views/DevView.vue'),
    },
    {
      path: '/bag/:uuid',
      name: 'bagItem',
      component: () => import('../views/BagItemView.vue'),
    },
    {
      path: '/gongfa',
      name: 'gongfa',
      component: () => import('../views/GongfaView.vue'),
    },
  ],
})

export default router
