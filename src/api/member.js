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

export function getAuthCode(params) {
    return request({
        url:'/mall-portal/sso/getAuthCode',
        method:'get',
        params:params
    })
}

/**添加收货地址**/
export function addAddress(params) {
    return request({
        url:'/mall-portal/member/address/add',
        method:'post',
        data:params
    })
}

/**获取用户所有收货地址**/
export function getAddress(params) {
    return request({
        url:'/mall-portal/member/address/list',
        method:'get',
        params :params
    })
}

export function register(params) {
    return request({
        url:'/mall-portal/sso/register',
        method:'post',
        params:params
    })
}