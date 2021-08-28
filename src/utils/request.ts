import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 配置选项
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 通过改写config配置信息，实现业务功能的统一处理
  const { user } = store.state
  if (user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回config，否则请求发不出去
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
export default request
