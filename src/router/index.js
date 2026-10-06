import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '../views/ProductView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 商品管理（默认页）
    {
      path: '/',
      name: 'product',
      component: ProductView,
    },
    // 数据看板
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
  ],
})

export default router