import request from '@/utils/request'
export function cartList(params) {
    return request({
        url:'/mall-portal/cart/list',
        method:'get',
        params:params
    })
}

/**添加购物车**/
export function addToCart(params) {
    return request({
        url:'/mall-portal/cart/add',
        method:'post',
        data: params
    })
}

/**修改购物车中某个商品的数量**/
export function updateCart(params) {
    return request({
        url: '/mall-portal/cart/update/quantity',
        method:'get',
        params: params
    })
}
/**批量删除购物车**/
export function deleteCarts(params) {
    return request({
        url: '/mall-portal/cart/delete',
        method:'post',
        data: params
    })
}