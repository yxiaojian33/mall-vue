import request from '@/utils/request'
export function cartList(params) {
    return request({
        url:'/mall-portal/cart/list',
        method:'get',
        params:params
    })
}