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

// 获取菜单信息
export const getEditMenuInfo = (id: string | number):Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

export const getAllMenus = ():Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

export const deleteMenus = (id: number):Promise<any> => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

export const getMenuNodeList = ():Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

export const allocateRoleMenus = (data: any):Promise<any> => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data: data
  })
}

export const getRoleMenus = (roleId: string | number):Promise<any> => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: { // axios会自动把params转换为key=value&key=value的格式,并拼接放在url后面
      roleId
    }
  })
}
