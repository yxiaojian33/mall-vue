import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//TODO vue3.0+ lazy-load
// import VueLazyload from 'vue-lazyload'
import {
    ElButton,ElAutocomplete,ElInput,ElBreadcrumb,ElBreadcrumbItem ,ElCarousel,ElCarouselItem,ElCol,ElRow ,ElImage,ElInfiniteScroll,ElLoading,ElPagination} from 'element-plus'

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
    .mount('#app')
