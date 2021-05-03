import request from '@/utils/request'
export function homeContent(params) {
    return request({
        url:'/mall-portal/home/content',
        method:'get',
        params:params
    })
}