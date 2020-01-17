/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ './components/user/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ './components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ './components/goods/Params.vue')

// import Goods from './components/goods/Goods.vue'
const Goods = () => import(/* webpackChunkName: "goods_add" */ './components/goods/Goods.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "goods_add" */ './components/goods/Add.vue')

// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "report_orders" */ './components/report/Report.vue')
// import Orders from './components/orders/Orders.vue'
const Orders = () => import(/* webpackChunkName: "report_orders" */ './components/orders/Orders.vue')

Vue.use(Router)

const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/welcome',
                children: [
                    { path: '/welcome', component: Welcome },
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/goods', component: Goods },
                    { path: '/params', component: Params },
                    { path: '/reports', component: Report },
                    { path: '/orders', component: Orders },
                    { path: '/goods/add', component: Add }
                ]
            }
        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from代表从哪个路径跳转而来
    // next是一个函数，表示放行
    // next()放行 next('/login')
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router
