import { createRouter, createWebHashHistory } from 'vue-router'
import DishManage from "@/views/DishManage.vue";
import UXProMaxLanding from "@/views/UXProMaxLanding.vue";

const routes = [
  {
    path: '/',
    name: 'DishManage',
    component: DishManage
  },
  {
    path: '/landing',
    name: 'Landing',
    component: UXProMaxLanding
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router