import request from '@/utils/request'
export function generateOrder(params) {
    return request({
        url:'/mall-portal/order/generateOrder',
        method:'post',
        data: params
    })
}
