import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
    ElButton,ElAutocomplete,ElInput,ElBreadcrumb,ElBreadcrumbItem ,ElCarousel } from 'element-plus'

createApp(App)
    .use(store)
    .use(router)
    .use(ElButton)
    .use(ElAutocomplete)
    .use(ElInput)
    .use(ElBreadcrumb)
    .use(ElBreadcrumbItem)
    .use(ElCarousel)
    .mount('#app')
