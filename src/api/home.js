import request from '@/utils/request'
export function homeContent(params) {
    return request({
        url:'/mall-portal/home/content',
        method:'get',
        params:params
    })
}
export function hotProductList(params) {
    return request({
        url:'/mall-portal/home/hotProductList',
        method:'get',
        params:params
    })
}
export function recommendProductList(params) {
    return request({
        url:'/mall-portal/home/recommendProductList',
        method:'get',
        params:params
    })
}
export function search(params) {
    return request({
        url:'/mall-search/search',
        method:'get',
        params:params
    })
}