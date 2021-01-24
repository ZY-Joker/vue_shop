import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 整个项目的入口文件
Vue.config.productionTip = false
// 配置请求的路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
Vue.prototype.$http = axios
// axios 请求拦截器添加token 保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 全局过滤器
Vue.filter('dateFormat', function (o) {
  const dt = new Date(o)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
