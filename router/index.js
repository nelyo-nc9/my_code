/*
* @Author: mahuichun
* @Date: 2020-05-18 21:23:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-08-04 19:54:08
*/
import home from '../components/Home'
import container from '../components/Container'
import otherModuleRoutes from './module'
import printingModuleRoutes from './printModule'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Notification } from 'element-ui'
// import store from '../store'

Vue.use(VueRouter)
const routes = [
  {
    path: '/navigator',
    name: 'navigator',
    component: resolve => (require(['../components/Navigator'], resolve))
  },
  {
    path: '/home',
    component: resolve => (require(['../components/SecendRouterView'], resolve)),
    children: [
      {
        path: '/home',
        name: 'home',
        component: home
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => (require(['../components/Login'], resolve))
  },
  {
    path: '/',
    component: home,
    redirect: '/home'
  },
  {
    path: '/',
    name: 'container',
    component: container,
    children: [
      ...otherModuleRoutes
    ]

  },
  {
    path: '/LinkVideo',
    name: 'LinkVideo',
    component: resolve => (require(['../view/alarmManage/eventDeal/LinkVideo'], resolve))
  }, {
    path: '/printing',
    component: container,
    children: [
      ...printingModuleRoutes
    ]
  },
  {
    path: '*',
    component: {
      render (h) {
        return h('div', {
          staticClass: 'flex flex-main-center',
          attrs: {
            style: 'width:100%;font-size:32px'
          }
        }, '未找到哦')
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

export function hook (userPromise) {
  router.beforeEach((to, from, next) => {
    //消防一张图跳转地图模块，离开地图后清空访问来源状态 -shenzhe 20200815
    if (sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice') {
      if (to.fullPath.indexOf('intelligentFire/onePicturePlatform') === -1) {
        sessionStorage.removeItem('sessionStorage_fromPage')
      }
    }
    //
    $('.container .nav').show()
    // console.log(to, from, next)
    const route = ['/login', '/navigator', '/LinkVideo'] // 不用登录的页面，放开拦截
    let userInfo = sessionStorage.getItem('user') // 得到登录页存储信息
    // let role = userinfo && JSON.parse(userinfo).token // 得到登录的 token
    let superUser = sessionStorage.getItem('superUser') // 管理员信息
    let urlInfo = sessionStorage.useRouter && JSON.parse(sessionStorage.useRouter)
    // console.log(urlInfo)
    let poweRoute = []
    if (urlInfo && urlInfo.type === 3) {
      superUser = 'superUser'
    } else {
      poweRoute = urlInfo ? [{ url: '/home' }, ...urlInfo.module, ...urlInfo.page] : [{ url: '/home' }]
    }
    // console.log(route.some(item => item === to.path), poweRoute)
    if (!userInfo) {
      if (route.some(item => item === to.path)) {
        // 在登录名单中，直接进入
        next()
      } else {
        // 没有访问权限的其他页将重定向到登录页。
        next({ path: '/login' })
      }
    } else {
      if (poweRoute.some(item => item.url === to.path)) {
        next()
      } else if (route.some(item => item === to.path)) {
        next()
      } else if (superUser) {
        next()
      } else {
        // console.log(to.path)
        // alert('aa')
        // Notification({
        //   type: 'info',
        //   title: '无权访问',
        //   offset: 100,
        //   message: '请联系相关人员获取权限',
        //   position: 'top'
        // })
        // this.$message({
        //   type: 'info',
        //   message: '无数据'
        // })
        next('/home')
      }
    }
    //   store.dispatch('setRouterUrl', to.path) // 新运维嵌入校园平台需要获取当前路由
    //   // 判断用户未按照操作流程进入其他模块
    //   store.dispatch('getMainMenu')
    //   store.dispatch('getUserId')
    //   store.dispatch('setUsrAuth', {
    //     url: to.path
    //   })
    //   store.commit('SET_ROUTE_STATE', to.path)
    //   // 确保用户身份信息已获取

    //   store.dispatch('changeRouteLoading', true).then(() => {
    //     // has logged in, reject
    //     save('routerPath', to.path)
    //     if (to.path === '/login' && store.getters.loggedIn) {
    //       // return next(false)
    //       return next({
    //         path: '/navigation'
    //       })
    //     }
    //     // if (refreshAddr.includes(from.path) && to.path === '/navigation') {
    //     if (from.path !== '/' && to.path === '/navigation') {
    //     }
    //     if (!to.meta.skipAuth) {
    //       // this route requires auth, check if logged in
    //       // if not, redirect to login page.
    //       if (!store.getters.loggedIn) {
    //         next({
    //           path: '/login'
    //         })
    //       } else {
    //         if (to.path === '/') {
    //           next({
    //             path: read('homeRoute')
    //           })
    //         } else if (!store.getters.getUserAuth && to.path !== '/localConf') {
    //           next({
    //             path: '/navigation'
    //           })
    //         }
    //         next()
    //       }
    //     } else {
    //       next()
    //     }
    //   })
    // })

    // router.afterEach((to) => {
    //   store.dispatch('changeRouteLoading', false)
  })
}

export default router
