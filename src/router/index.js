import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/users/user'
import Rights from '../components/power/rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import params from '../components/goods/params'
import goods from '../components/goods/goods'
import Add from '../components/goods/Add'
Vue.use(VueRouter)
// 路由规则
const routes = [
  // 当访问“/” 重定向到“/login”
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: params },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: Add }
    ]
  }
]
const router = new VueRouter({
  routes
})
// 拿到路由对象，做一个路由导航守卫， 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转来
  // next 是一个函数，表示放行    next() 放行   next('/login')强制跳转
  if (to.path === '/login') return next()
  else {
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    else return next()
  }
})
export default router
