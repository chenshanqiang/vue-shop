/* jshint esversion: 6 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
//引入axios
import axios from 'axios'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'
//导入Nprogress包对应的js和css
import NProgress from 'nprogress'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//配置请求基路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config => {
        //在request拦截器中，展示进度条NProgress.start（）
        NProgress.start()
        //为请求头对象，添加Token验证的Authorization字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
//响应拦截器
axios.interceptors.response.use(config => {
        //在response拦截器中，隐藏进度条NProgress.done（）
        NProgress.done()
        return config
    })
//将axios组件挂载到vue原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册全局组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
