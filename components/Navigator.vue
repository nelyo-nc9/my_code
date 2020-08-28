<template>
  <div class="navigator" v-loading="loading" :element-loading-text="title" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <Home key="navigator"></Home>
    <div class="wrap">
      <Child></Child>
    </div>
    <div class="navigator-wrap"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Home from './SecendRouterView'
import Child from './Home'
import Crypto from '../common/cryptoAES'
import otherModuleRoutes from '../router/module'
export default {
  name: 'navigator',
  components: { Home, Child },
  data() {
    return {
      title: '正在登陆...',
      loading: true,
      macIp: sessionStorage.macAddress ? JSON.parse(sessionStorage.macAddress).adaptors : [{ip: 'XXX.XXX.XXX.XXX', mac: 'XX-XX-XX-XX-XX-XX'}]
    }
  },
  beforeCreate() {
    if (sessionStorage.macAddress === 'false') {
      sessionStorage.removeItem('macAddress')
    }
    sessionStorage.removeItem('poweRoute')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('superUser')
    sessionStorage.removeItem('useRouter')
  },
  computed: {},
  created() {
    let token = Crypto.urlSlice('st')
    if (token) {
      this.loading = true
      let obj = {
        token,
        ip: this.macIp[0].ip,
        mac: this.macIp[0].mac,
        loginType: 1
      }
      if (sessionStorage.user) {
        this.$router.push('/home')
      }
      this.urlToken(obj)
    }
  },
  methods: {
    ...mapActions('login', ['setState', 'userToken', 'userRouter']),
    // url
    urlToken(obj) {
      this.userToken(obj).then(res => {
        let {code, message, data} = res.data
        if (code === 0) {
          sessionStorage.user = JSON.stringify(data)
          this.setState({ type: 'SET_STATE', key: 'user', value: data })
          this.getRouter({ userId: data.id })
        } else {
          throw message
        }
      }).catch(err => {
        this.$notify.error({
          title: '登录失败',
          message: err
          // position: 'bottom-right',
        })
        let timer = setTimeout(_ => {
          window.history.back(-1)
        }, 2000)
        this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
      })
    },
    // 根据人员Id获取功能权限
    async getRouter(obj = {}) {
      await this.userRouter(obj)
        .then(res => {
          let { code, data } = res.data
          let moduleRoute = this.$lodash.cloneDeep(otherModuleRoutes)
          moduleRoute = moduleRoute.map(one => {
            if (one.children) {
              one.children = one.children.map(two => {
                if (two.children) {
                  two.children = two.children.map(three => {
                    delete three.component
                    return three
                  })
                }
                delete two.component
                return two
              })
            }
            delete one.component
            return one
          })
          // console.log(data, moduleRoute)
          if (code === 0) {
            if (data.list) {
              sessionStorage.useRouter = JSON.stringify(data.list)
              this.setState({ type: 'SET_STATE', key: 'useRouter', value: data.list })
              let arr = []
              let { module, page, type } = data.list
              let poweRoute = []
              if (module && page) {
                poweRoute = [...module, ...page]
              }
              if (type && type === 3) {
                sessionStorage.superUser = JSON.stringify('superUser')
                arr = moduleRoute
              } else {
                arr = moduleRoute.filter(one => {
                  if (poweRoute.some(i => i.url === one.path)) {
                    if (one.children) {
                      let arr = one.children.filter(two => {
                        if (poweRoute.some(i => i.url === two.path)) {
                          if (two.children) {
                            let arr = two.children.filter(three => {
                              if (poweRoute.some(i => i.url === three.path)) {
                                return three
                              }
                            })
                            two.children = arr
                          }
                          return two
                        }
                      })
                      one.children = arr
                    }
                    return one
                  }
                })
              }
              sessionStorage.poweRoute = JSON.stringify(arr)
              this.setState({ type: 'SET_STATE', key: 'poweRoute', value: arr })
              this.$router.push('/home')
            } else {
              this.$notify({
                title: '失败',
                message: '页面权限获取失败',
                type: 'error'
              })
            }
          } else {
            throw res.data.message
          }
        }).catch(err => {
          this.$notify({
            title: '',
            message: err || '页面权限获取失败',
            type: 'error'
          })
          // this.$confirm('用户名密码登录，请确定。     退出，请取消。', '页面权限获取失败', {
          //   closeOnClickModal: false,
          //   showClose: false,
          //   confirmButtonText: '取消',
          //   cancelButtonText: '确定',
          //   type: 'error'
          // }).then(() => {
          window.history.back(-1)
          // }).catch(() => {
          //   this.$router.push('/login')
          // })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.navigator {
  width: 100%;
  height: 100%;
  position: relative;
  .wrap{
    width: 100%;
    height:calc(~'100% - 40px');
    position: absolute;
    left: 0;top: 40px;
    padding: 0;margin: 0;
    display: flex;overflow: hidden;
  }
  .navigator-wrap{
    width: 100%;height: 100%;
    position: absolute;top: 0;left: 0;z-index: 1999;
  }
}
</style>
