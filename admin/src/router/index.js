import { createRouter, createWebHistory } from 'vue-router'
import DishManage from "@/views/DishManage.vue";

const routes = [
  {
    path: '/',
    redirect: '/dish'
  },
  {
    path: '/dish',
    name: 'DishManage',
    component: DishManage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
