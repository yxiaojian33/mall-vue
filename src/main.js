import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuex from 'vuex'
import {getInfo} from '@/api/member'
//TODO vue3.0+ lazy-load
// import VueLazyload from 'vue-lazyload'
import {
    ElButton,ElAutocomplete,ElInput,ElBreadcrumb,ElBreadcrumbItem ,ElCarousel,ElCarouselItem,ElCol,ElRow ,ElImage,ElInfiniteScroll,ElLoading,ElPagination,ElInputNumber,ElRadioButton,ElRadioGroup,ElForm,ElFormItem} from 'element-plus'
import {getToken} from "./utils/auth";

createApp(App)
    .use(store)
    .use(router)
    .use(ElButton)
    .use(ElAutocomplete)
    .use(ElInput)
    .use(ElBreadcrumb)
    .use(ElBreadcrumbItem)
    .use(ElCarousel)
    .use(ElCarouselItem)
    .use(ElRow)
    .use(ElCol)
    .use(ElImage)
    .use(ElInfiniteScroll)
    .use(ElLoading)
    .use(ElPagination)
    .use(ElInputNumber)
    .use(ElRadioGroup)
    .use(ElRadioButton)
    .use(ElForm)
    .use(ElFormItem)
    .use(Vuex)
    .mount('#app')
const whiteList = ['/','/home', '/products', '/login', '/register', '/saleRecommend', '/productsDetail', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
router.beforeEach((to, from, next) => {
    if (getToken() && to.path === '/login') { //  跳转到
        next({path: '/'})
    }
    if (whiteList.indexOf(to.path) !== -1) { // 白名单
        next()
    }
    else if(!getToken()){
        next({path:'/login'})
    }
    else getInfo().then(res=>{
            if (res.code === 401) { // 没登录
                next({path:'/login'})
            } else {
                store.commit('ISLOGIN', res.data)
                if (to.path === '/login') { //  跳转到
                    next({path: '/'})
                }
                next()
            }
        }).catch(error=>{
            console.log(error)
        })
})


