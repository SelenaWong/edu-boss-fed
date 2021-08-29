/**
 * 菜单相关请求模块
 * */
import request from '@/utils/request'

export const createOrUpdateMenu = (data: any):Promise<any> => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

export const getEditMenuInfo = (id = -1):Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}
