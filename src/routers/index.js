import { createRouter, createWebHistory } from 'vue-router'
import PageNotFound from '../views/PageNotFound.view.vue'
import Home from '../views/Home.view.vue'
import Downloading from '../views/Downloading.view.vue'
import ReverseEngineering from '../views/ReverseEngineering.view.vue'
import Treemap from '../views/Treemap.view.vue'
import Timeline from '../views/Timeline.view.vue'
import AnimatedHeatTreemap from '../views/AnimatedHeatTreemap.view.vue'
import EvolutionaryTreemap from '../views/EvolutionaryTreemap.view.vue'
import DifferenceTreemap from '../views/DifferenceTreemap.view.vue'
import ComparisonTreemap from '../views/ComparisonTreemap.view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Downloading',
      name: 'Downloading',
      component: Downloading
    },
    {
      path: '/ReverseEngineering',
      name: 'ReverseEngineering',
      component: ReverseEngineering
    },
    {
      path: '/Treemap',
      name: 'Treemap',
      component: Treemap
    },
    {
      path: '/Timeline',
      name: 'Timeline',
      component: Timeline
    },
    {
      path: '/AnimatedHeatTreemap',
      name: 'AnimatedHeatTreemap',
      component: AnimatedHeatTreemap
    },
    {
      path: '/EvolutionaryTreemap',
      name: 'EvolutionaryTreemap',
      component: EvolutionaryTreemap
    },
    {
      path: '/DifferenceTreemap',
      name: 'DifferenceTreemap',
      component: DifferenceTreemap
    },
    {
      path: '/ComparisonTreemap',
      name: 'ComparisonTreemap',
      component: ComparisonTreemap
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: PageNotFound
    }
  ]
})

export default router
