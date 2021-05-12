import request from '@/utils/request'
/**根据购物车信息生成确认单信息**/
export function generateConfirmOrder(params) {
    return request({
        url:'/mall-portal/order/generateConfirmOrder',
        method:'post',
        data: params
    })
}
/**根据购物车信息生成订单信息**/
export function generateOrder(params) {
    return request({
        url:'/mall-portal/order/generateOrder',
        method:'post',
        data: params
    })
}
