import Vue from 'vue'
import './locales'
import store from './store'
import ElementUI from 'element-ui'
import lodash from 'lodash'
import './common/dialog'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/common.css'
import router, { hook as routerHook } from './router'
import App from './App'
import Echarts from 'echarts'
// 电子地图工具库
import opengis from '../static/opengis/index'
import axios from 'axios'
import './http/index'
import moment from 'moment'
import bsvue from './view/videoManage/playback/bsvue' // npm install animate.css --save安装，在引入
import { messageWarn, messageSuccess, messageError } from './common/message'
// 打印
import Print from 'vue-print-nb'
import printJS from 'print-js'
import CryptoAES from './common/cryptoAES'
require('./assets/elementModify.less')

Vue.use(Print) // 注册
Vue.use(bsvue)
Vue.use(Echarts)
Vue.prototype.$lodash = Vue.lodash = lodash

Vue.use(ElementUI)
Vue.use(opengis)
Vue.prototype.$PageInfo = Vue.PageInfo = {
  limit: 25,
  size: [25, 50, 100, 200]
}
Vue.prototype.$moment = Vue.moment = moment
Vue.prototype.$http = Vue.http = axios
Vue.prototype.$moment = Vue.moment = moment
Vue.prototype.$messageWarn = messageWarn
Vue.prototype.$messageSuccess = messageSuccess
Vue.prototype.$messageError = messageError
Vue.prototype.$CryptoAES = Vue.CryptoAES = CryptoAES

Vue.prototype.requestFullscreen = (element) => {
  element = element || document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}
Vue.prototype.exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  }
}

Vue.prototype.$echarts = Echarts
axios.defaults.baseURL = '/api'
routerHook()
const opt = {
  router,
  store,
  ...App
}
const app = new Vue(opt)
app.$mount('app')
window.onbeforeunload = function() {
  app.$destroy()
}
