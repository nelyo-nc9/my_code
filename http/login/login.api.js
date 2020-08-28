import { post } from '../base'

// 用户登录
export const loginApi = (playload, config = {}) => {
  let param = {
    url: '/auth/user/v1/login',
    body: playload
  }
  return post(param, config)
}
// 用户token
export const tokenApi = (playload, config = {}) => {
  let param = {
    url: '/auth/user/v1/token',
    body: playload
  }
  return post(param, config)
}
// 退出登录
export const logoutApi = (playload, config = {}) => {
  let param = {
    url: '/auth/user/v1/logOut',
    body: playload
  }
  return post(param, config)
}
// 根据人员Id获取功能权限
export const userRouterApi = (playload, config = {}) => {
  let param = {
    url: '/user/v1/findUserOperation',
    body: playload
  }
  return post(param, config)
}
