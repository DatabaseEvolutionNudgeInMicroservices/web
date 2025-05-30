import { createRouter, createWebHistory } from 'vue-router'
import Treemap from '../views/Treemap.view.vue'
import Home from '../views/Home.view.vue'
import PageNotFound from '../views/PageNotFound.view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Treemap',
      name: 'Treemap',
      component: Treemap
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: PageNotFound
    }
  ]
})

export default router
