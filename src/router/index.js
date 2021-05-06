import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'index',
    redirect : 'home',
    component: ()=> import('@/views/index'),
    children :[
      {
        path: 'home',
        component : ()=>import('@/views/home')
      },
      {
        path: 'products',
        component : ()=>import('@/views/products')
      },
      {
        path: 'saleRecommend',
        component : ()=>import('@/views/saleRecommend')
      }
    ]
  },
  {
    path: '/header',
    name: 'header',
    component: ()=> import('@/views/header'),
    children: [
      {
        path: '/search',
        component: ()=> import('@/views/search')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: ()=> import('@/views/login')
  },
  {path: '/refreshsearch', name: 'refreshsearch', component: ()=>import('@/views/refresh/refreshsearch.vue')},

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
