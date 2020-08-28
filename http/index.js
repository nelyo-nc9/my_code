import Vue from 'vue'
import axios from 'axios'
import router from '../router/index'
import {DomMessage} from './messageOnce'
import {MessageBox} from 'element-ui'
const Message = new DomMessage()
const MsgBox = async() => {
  sessionStorage.removeItem('poweRoute')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('superUser')
  sessionStorage.removeItem('useRouter')
  await MessageBox('用户信息异常, 请重新登录', '安全提示', {showClose: false, closeOnClickModal: false, confirmButtonText: '确定'})
}
// import store from '../store'
// import { Notice } from 'bs-iview'
const requestMap = {}
let userinfo = sessionStorage.getItem('user') // 得到登录页存储信息
let role = userinfo && JSON.parse(userinfo).token // 得到登录的 token
// response interceptor
axios.interceptors.request.use(request => {
  request.headers['Authorization'] = sessionStorage.user && JSON.parse(sessionStorage.user).token
  let key
  // abort the same post request
  if (/POST|PUT|DELETE/.test(request.method)) {
    key = `${request.method}${request.url}${JSON.stringify(request.body)}`
    // abort the existed request
    if (key && requestMap[key]) {
      key = null
      setTimeout(() => {
        request.abort()
      })
    } else {
      requestMap[key] = request
    }
  }
  // if (store.getters.loggedIn) {
  //   // if logged in, add the token to the header
  //   request.headers.common.Authorization = `Bearer ${
  //     store.getters.accessToken
  //   }`
  // }
  return request
})

axios.interceptors.response.use(
  response => {
    // delete current request in the map
    const request = response.request
    let key
    if (/POST|PUT|DELETE/.test(request.method)) {
      key = `${request.method}${request.url}${JSON.stringify(request.body)}`
      delete requestMap[key]
    }
    return response
  },
  error => {
    switch (error.response.status) {
      // case 400:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E400')
      //   })
      //   break
      // case 401:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E401')、
      //   })
      //   break
      case 403:
        Message.warning({type: 'error', message: error.response.status + '安全信息异常, 请重新登录'}, MsgBox)
        router.push('/login')
        //   Vue.$Notice.error({
        //     title: Vue.t('http.error.E403')
        //   })
        break
      // case 404:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E404')
      //   })
      //   break
      case 412:
        Vue.$Notice.error({
          title: Vue.t('http.error.E412')
        })
        break
      // case 500:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E500')
      //   })
      //   break
      // default:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.others'),
      //   })
    }
    return Promise.reject(error)
  }
)
