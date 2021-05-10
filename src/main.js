import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuex from 'vuex'
import {getInfo} from '@/api/member'
//TODO vue3.0+ lazy-load
// import VueLazyload from 'vue-lazyload'
import {
    ElButton,ElAutocomplete,ElInput,ElBreadcrumb,ElBreadcrumbItem ,ElCarousel,ElCarouselItem,ElCol,ElRow ,ElImage,ElInfiniteScroll,ElLoading,ElPagination,ElInputNumber,ElRadioButton,ElRadioGroup,ElForm,ElFormItem ,ElCheckbox ,ElCheckboxGroup,ElPopover,ElCard,ElCollapse,ElCollapseItem ,ElRadio,ElNotification} from 'element-plus'
import {getToken} from "./utils/auth";
import { mapState } from "vuex";
import {getStore} from "@/utils/storage";
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
    .use(ElCheckbox)
    .use(ElCheckboxGroup)
    .use(ElPopover)
    .use(ElCard)
    .use(ElCollapse)
    .use(ElCollapseItem)
    .use(ElRadio)
    .use(ElNotification)
    .use(Vuex)
    .mount('#app')
router.beforeEach((to, from, next) => {
    if (!JSON.parse( getStore('login')) && to.matched.some(record => record.meta.auth)) {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        })
    }
    else next()
})
