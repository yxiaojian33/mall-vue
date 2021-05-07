import request from '@/utils/request'
export function getInfo(params) {
    return request({
        url:'/mall-portal/sso/info',
        method:'get',
        params:params
    })
}
export function login(params) {
    return request({
        url:'/mall-portal/sso/login',
        method:'post',
        params: params
    })
}
export function logout(params) {
    return request({
        url:'/mall-portal/sso/info',
        method:'get',
        params:params
    })
}