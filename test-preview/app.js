/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express') // 后端common.js 规范
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')

// app.get('/', (req, res) =>{
//   res.send('test')
// })
// 托管静态资源，如果有多个静态资源，可以写多行; 访问 / 默认会查找静态目录中的
app.use(express.static('../dist'))


app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com', // target host
  changeOrigin: true
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com', // target host
  changeOrigin: true
}))

app.listen(3000, ()=>{
  console.log('running at http://localhost:3000/')
})
