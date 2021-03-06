/**
 * 资源分类相关请求模块
 * */
import request from '@/utils/request'

export const getResourceCategories = ():Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
