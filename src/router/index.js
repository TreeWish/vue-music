import { createRouter, createWebHashHistory } from 'vue-router';
import Recommend from '../views/recommend.vue';
import Singer from '../views/singer.vue';
import Search from '../views/search.vue';
import topList from '../views/top-list.vue';
import SingerDetail from '@/views/singer-detail.vue';
import Album from '@/views/album.vue';
import TopDetail from '@/views/top-detail.vue';
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        name: 'album',
        component: Album
      }
    ]
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
    component: topList,
    children: [
      {
        path: ':id',
        name: 'top-detail',
        component: TopDetail
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
