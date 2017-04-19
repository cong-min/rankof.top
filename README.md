# Rank of Top

> **毕业设计**
> 
> 网络社区热点爬取与分析系统

## 开发

``` bash
# 安装依赖
cnpm install

# 前端开发调试 localhost:8080
npm run dev

# 前端生产构建
npm run build

# 服务端启动 localhost:2017
npm run server

# 前后端生产构建 localhost:2017
npm start  # npm run start
           # npm run build && npm run server

# pm2守护进程
npm run pm2  # npm run build && sudo pm2 start server/app.js --name 'rankof.top'

# pm2重启进程
npm run repm2  # npm run build && sudo pm2 restart 'rankof.top'

# pm2结束进程
npm run killpm2  # sudo pm2 delete 'rankof.top'
```