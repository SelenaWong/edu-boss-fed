/**
 * 用户相关请求模块
 * */
import request from '@/utils/request'
import qs from 'qs'
import store from '@/store'

interface User {
  phone: string
  password: string
}
export const login = (data: User):Promise<any> => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // 1.如果data为普通对象，则Content-Type是 application/json
    // 2.如果data是qs.stringify(data)转换之后的数据： key=value&key=value,则
    // Content-type会被设置为application/x-www-form-urlencoded
    // 3.如果data是FormData对象， 则Content-Type是multipart/form-data
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data) // axios默认发送的是application/json格式的数据
  })
}

// 获取用户信息
export const getUserInfo = ():Promise<any> => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
