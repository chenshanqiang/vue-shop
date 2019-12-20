/* jshint esversion: 6 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//引入axios
import axios from 'axios'
//配置请求基路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //请求拦截器
axios.interceptors.request.use(config => {
        //为请求头对象，添加Token验证的Authorization字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    //将axios组件挂载到vue原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false
    // 注册全局组件
Vue.component('tree-table', TreeTable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')