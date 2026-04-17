import { createRouter, createWebHashHistory } from 'vue-router'
import RandomPage from '@/views/RandomPage.vue'
import DetailPage from '@/views/DetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'Random',
    component: RandomPage
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router