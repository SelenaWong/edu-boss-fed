import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshToken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 通过改写config配置信息，实现业务功能的统一处理
  const { user } = store.state
  if (user?.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回config，否则请求发不出去
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
let isRefreshing = false // 控制刷新token的状态
let requests: any[] = [] // 存储刷新token期间的401请求
request.interceptors.response.use(function (response) {
  // 当Http状态码 2xxx都进入这里
  console.log('请求响应成功了', response)
  // 如果是自定义错误状态码， 错误处理就写在这里
  return response
}, async function (error) { // 超出2xx状态码执行到这里
  // console.dir(error)
  // 如果是使用HTTP状态码，错误处理写在这里
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了2xx范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效（没有提供token、token是无效的、token过期了 ）
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if (!isRefreshing) {
        isRefreshing = true // 开始刷新状态
        // 如果有refresh_token则尝试使用refresh_token获取新的access_token
        // 这里如果使用request发请求，则如果返回失败，则会死循环
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }
          // 成功了，则把本次失败的请求重新发出去
          // 把刷新拿到的新的access_token更新到容器和本地存储中
          store.commit('setUser', res.data.content)
          console.log(error.config) // 失败请求的配置信息
          // 把requests队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置request数组
          requests = []
          return request(error.config) // 重新提交上次的失败请求
        }).catch(err => {
          console.log(err)
          // 把当前登录用户状态清除
          store.commit('setUser', null)
          // 失败了，跳转登录页面重新登录获取新的token
          // 如果没有，则直接跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 开始刷新状态
        })
      }
      // 刷新状态下，把请求挂起放到requests数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应
    console.log(error.request)
    Message.error('请求超时，请刷新重试')
  } else {
    // 在设置请求时发生了一些事情，触发了一个错误
    console.log('Error', error.message)
    Message.error(`请求失败：${error.message}`)
  }
  console.log(error.config)
  // 把请求失败的错误对象继续抛出， 扔给下一个调用者
  return Promise.reject(error)
})
export default request
