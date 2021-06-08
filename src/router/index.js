import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '../views/recommend.vue'
import Singer from '../views/singer.vue'
import Search from '../views/search.vue'
import topList from '../views/top-list.vue'
import SingerDetail from '@/views/singer-detail.vue'
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [
      {
        path: ':id',
        name: 'singer-detail',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/top-list',
    name: 'top-list',
    component: topList
  }
  // {
  //   path: '/singer/:id',
  //   name: 'singer-detail',
  //   component: SingerDetail
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
