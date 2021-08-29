/**
 * 资源相关请求模块
 * */
import request from '@/utils/request'

export const getResourcePage = (data: any):Promise<any> => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
