<template>
  <div class="login-app">
    <div class="login">
      <div class="login-wrap">
        <div class="login-bg">
          <div class="ul">
            <ul>
              <li class="li">
                <el-input v-model="form.userName"
                          ref="user"
                          placeholder="请输入账号"
                          prefix-icon="el-icon-s-custom"
                          clearable
                          @keyup.enter.native="next"></el-input>
              </li>
              <li class="li">
                <el-input v-model="form.password"
                          ref="pwd"
                          placeholder="请输入密码"
                          prefix-icon="el-icon-s-goods"
                          show-password
                          clearable
                          @keyup.enter.native="submitForm"></el-input>
              </li>
              <li>
                <el-button type="primary"
                           @click="submitForm">登录</el-button>
              </li>
            </ul>
          </div>
          <p class="bg-footer">©2020 中国建设银行 | 版本{{WEB_VERSION}}</p>
        </div>
        <!-- <div class="login-form-bg">
          <ul>
            <li @click="() => (this.show = true)" @mouseleave="() => (this.show = false)">
              <el-input
                v-model="form.userName" ref="user"
                placeholder="请输入账号"
                prefix-icon="el-icon-s-custom"
                clearable @keyup.enter.native="next"
              ></el-input>
              <div class="ul" :style="{height: show ? `${ulHeight}px` : '0px' + ' !important', overflow: 'hidden', transition: 'height .5s', boxShadow:'1px 1px 2px rgba(0, 0, 0, .1)'}">
                <ol>
                  <li v-for="(item, index) in arr" :key="index">
                    <p @click="changeform(item)">{{item.userName}}</p>
                    <i class="el-icon-delete" @click="cancel(item)"></i>
                  </li>
                </ol>
              </div>
            </li>
            <li>
              <el-input
                v-model="form.password" ref="pwd"
                placeholder="请输入密码"
                prefix-icon="el-icon-s-goods"
                show-password
                clearable @keyup.enter.native="submitForm"
              ></el-input>
            </li>
            <li> style="margin: 12px 0px;"
              <el-checkbox
                v-model="form.checked"
                style="margin: 0px 0px 0px 20px;font-size: 18px;font-weight: bold;"
              >记住密码</el-checkbox>
            </li>
          </ul>
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { nextuserApi } from '@src/http/dutyManagement/dutyManagement.api'
import { connectAlarm } from '../socket/alarm.js'
import { mapActions, mapMutations } from 'vuex'
import { Base64 } from 'js-base64'
import otherModuleRoutes from '../router/module'
import Crypto from '../common/cryptoAES'
import { WEB_VERSION } from '../../static/constants'
export default {
  name: 'login',
  data() {
    return {
      WEB_VERSION: WEB_VERSION,
      show: false,
      form: {
        time: '',
        userName: '',
        password: '',
        checked: false
      },
      arr: [],
      macIp: sessionStorage.macAddress && JSON.parse(sessionStorage.macAddress).adaptors
    }
  },
  computed: {
    ulHeight() {
      let str = ''
      if (this.arr && this.arr.length <= 3) {
        str = this.arr.length * 30
      } else if (this.form.userName !== '') {
        str = 0
      } else {
        str = 90
      }
      return str
    }
  },
  created() {
    if (sessionStorage.macAddress === 'false') {
      this.macIp = [{ ip: 'XXX.XXX.XXX.XXX', mac: 'XX-XX-XX-XX-XX-XX' }]
    }
    // 获取cookie值
    let arr = this.getCookie('user')
    if (arr && arr) {
      this.arr = arr
    }
    // this.userOut({}, {cb: res => {
    //   console.log(res)
    // }})
  },
  mounted() {
    this.$refs.user.focus()
    this.$nextTick(_ => this.$refs.user.focus())
    // window.onresize = _ => {
    //   console.log('111)
    // }
  },
  methods: {
    ...mapMutations('dutyManagement', ['SET_DUTY_MODEL_SHOW', 'SET_CHECK_DETAIL_ID']),
    ...mapActions('login', ['setState', 'userLogin', 'logout', 'userRouter', 'userOut']),
    ...mapActions('sysParametersCof', ['getConfParam']),
    ...mapMutations('login', ['SET_STATE']),
    next() {
      this.$refs.user.blur()
      this.$refs.pwd.focus()
    },
    cancel(data) {
      let key = data.time + 'user'
      let arr = this.arr.filter(item => item !== data)
      this.arr = arr
      this.clearCookie(key)
    },
    changeform(item) {
      this.form = { ...item }
      this.show = false
    },
    // 点击登录调用方法
    submitForm() {
      this.form = {
        time: new Date()
          .getTime()
          .toString()
          .slice(-6),
        userName: this.form.userName.replace(/(^\s*)|(\s*$)/g, ''),
        password: this.form.password.replace(/(^\s*)|(\s*$)/g, ''),
        checked: this.form.checked
      }
      // 账号/密码
      let obj = { ...this.form }
      if (obj.userName === '' || obj.userName === null) {
        return this.$message('请输入正确的用户名')
      } else if (obj.password === '' || obj.password === null) {
        return this.$message('请输入正确的密码')
      }
      this.arr.forEach(item => {
        if (obj.userName === item.userName) {
          obj.time = item.time
        }
      })
      // 判断复选框是否被勾选 勾选则调用配置cookie
      if (obj.checked === true) {
        let cobj = this.$lodash.cloneDeep(obj)
        cobj.password = Crypto.encrypt(cobj.password)
        let str = JSON.stringify(cobj)
        let user = Base64.encode(str)
        // 传入key, 账号名/密码，和保存天数 参数
        this.setCookie(cobj.time + 'user', user, 7)
      }
      // console.log(this.macIp)
      // 接口
      let user = {
        userName: obj.userName,
        password: Base64.encode(obj.password),
        ip: this.macIp[0].ip,
        mac: this.macIp[0].mac,
        loginType: 1
      }
      user.password = Crypto.encrypt(user.password)
      this.userLogin(user).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          sessionStorage.user = JSON.stringify(data)
          this.setState({ type: 'SET_STATE', key: 'user', value: data })
          this.getRouter({ userId: data.id })
          this.getConfParam()
          this.$parent.getTreeApiFuc()
          this.nextuserApiFuc()
          connectAlarm() // 定时提醒socket推送
        } else {
          this.$message({ type: 'info', message: '登录失败' })
        }
      })
    },
    nextuserApiFuc() {
      nextuserApi()
        .then(res => {
          // this.SET_DUTY_MODEL_SHOW(true)
          this.SET_CHECK_DETAIL_ID('7') // 测试  此ID为查询下一个值班员接口返回主键ID
        })
        .catch(err => {
          console.log(err)
        })
    },
    // url过滤
    urlArr(data, arr = []) {
      data.forEach(item => {
        if (item.children) {
          arr.push(item.url)
          this.urlArr(item.children, arr)
        } else {
          arr.push(item.url)
        }
      })
      return arr
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
          console.log(data, moduleRoute)
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
              console.log(arr)
              sessionStorage.poweRoute = JSON.stringify(arr)
              this.setState({ type: 'SET_STATE', key: 'poweRoute', value: arr })
              this.$router.push('/home')
            } else {
              this.$message({ type: 'info', message: '页面权限获取失败' })
            }
          } else {
            this.$message({ type: 'info', message: '页面权限获取失败' })
            throw res.data.message
          }
        })
        .catch(err => {
          throw err
        })
    },
    // 读取cookie
    getCookie(key) {
      // let user = key+"=";
      let decodeCookie = decodeURIComponent(document.cookie).split('; ')
      let arr = []
      decodeCookie.forEach(item => {
        if (item.substring(6, 10) === 'user') {
          let str = item.substring(11)
          let obj = JSON.parse(Base64.decode(str))
          obj.password = Crypto.decrypt(obj.password)
          arr.push(obj)
        }
      })
      return arr
    },
    // 设置cookie
    setCookie(key, value, day = 7) {
      // 获取当前时间
      let time = new Date()
      time.setTime(time.getTime() + day * 24 * 60 * 60 * 1000)
      let expires = 'expires=' + time.toUTCString()
      document.cookie = key + '=' + value + ';' + expires + ';path=/;'
    },
    // 清除cookie
    clearCookie(key) {
      // console.log(key)
      this.setCookie(key, '', -1) // 修改值为空，天数为负1天
    }
  }
}
</script>

<style lang="less" scoped>
// .login {
//   width: 100vw;
//   min-width: 1920px;
//   height: 100vh;min-height: 1080px;overflow: auto;
//   //       327
//   // max-width: 100vw;       387
//   //      366
//   background: url(../../static/login/login.png) no-repeat center;
//     background-size: cover;
//       .login-form-bg {
//         width: 400px;
//         height: 320px;
//         background: white;
//         border-radius: 12px;
//         position: absolute;
//         top: 51.8%;
//         margin-top: -200px;
//         right: 21.392%;
//         padding: 38px;
//         ul {
//           width: 324px;
//           height: 190px;
//           display: flex;
//           flex-direction: column;
//           li {
//             flex: 1;width: 100%;
//             position: relative;
//             .ul {
//               width: 100%;
//               position: absolute;
//               top: 40px;
//               left: 0;
//               z-index: 999;
//               overflow: hidden;
//               background: white;
//               ol {
//                 width: calc(~'100% + 30px');
//                 max-height: 90px;
//                 overflow: auto;
//                 box-shadow: inset 0 -1px 1px 1px rgba(0, 0, 0, 0.1);
//                 li {
//                   padding: 0px 10px;
//                   height: 30px;
//                   display: flex;
//                   align-items: center;
//                   justify-content: space-between;
//                   box-shadow: inset 0 0px 1px 1px rgba(0, 0, 0, 0.1);
//                   cursor: pointer;
//                   p {
//                     flex: 1;
//                     height: 100%;
//                     padding-left: 20px;
//                     display: flex;
//                     align-items: center;
//                     color: #626266;
//                     font-size: 13px;
//                   }
//                   i {
//                     border-radius: 50%;
//                     margin-right: 30px;
//                   }
//                   i:hover {
//                     box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0.15);
//                     background: rgba(0, 0, 0, 0.15);
//                   }
//                 }
//                 li:hover {
//                   background: #f5f5f5;
//                 }
//               }
//             }
//           }
//         }
//         button {
//           width: 324px;
//           height: 50px;
//           border-radius: 66px;
//         }
//       }
// }
// @media screen and (min-device-width: 1921px) {1156-960
//   .login {
//     width: 100%;height: 100%;
//     background: red;
//     // background: url(../../static/login/login.png) no-repeat center;
//     // background-size: cover;
//   }      0.0083
// }
@media screen and (min-width: 1921px) {
  .login-app {
    width: 100%;
    height: 100%;
    .login {
      width: 100%;
      height: 100%;
      min-height: 1081px;
      background: url(../../static/login/login.png) no-repeat center;
      background-size: cover;
      .login-wrap {
        width: 100%;
        height: 100%;
        background: url(../../static/login/ccbLogo.png) no-repeat 36px 23px;
        position: relative;
        .login-bg {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          .ul {
            width: 18.2292%;
            max-width: 520px;
            height: 25.925926%;
            max-height: 400px;
            background: white;
            border-radius: 12px;
            margin-left: 60.20834%;
            font-size: 18px !important;
            ul {
              width: 100%;
              height: 100%;
              padding: 40px 45px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              li {
                .el-input {
                  font-size: 16px;
                  /deep/ .el-input__inner {
                    height: 50px !important;
                    border: none;
                  }
                  /deep/ .el-input__inner:focus {
                    font-size: 18px;
                    border-style: none;
                  }
                }
                .el-button {
                  width: 100%;
                  height: 50px;
                  border-radius: 25px;
                  font-size: 16px !important;
                }
              }
              .li {
                border-bottom: 2px solid #2d72d3;
                box-shadow: inset 0 0px 5px 5px white;
              }
            }
          }
          .bg-footer {
            width: 100%;
            text-align: center;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
            position: absolute;
            left: 0;
            bottom: 48px;
            z-index: 999;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1025px) and (max-width: 1920px) {
  .login-app {
    width: 100%;
    height: 100%;
    overflow: auto;
    .login {
      width: 100%;
      height: 100%;
      min-height: 697.5px;
      background: url(../../static/login/login.png) no-repeat center;
      background-size: cover;
      .login-wrap {
        width: 100%;
        height: 100%;
        background: url(../../static/login/ccbLogo.png) no-repeat 36px 23px;
        position: relative;
        .login-bg {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          .ul {
            width: 350px;
            height: 280px;
            background: white;
            border-radius: 12px;
            margin-left: 60.20834%;
            font-size: 18px !important;
            ul {
              width: 100%;
              height: 100%;
              padding: 40px 45px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              li {
                .el-input {
                  /deep/ .el-input__inner {
                    border: none;
                  }
                }
                .el-button {
                  width: 100%;
                  height: 40px;
                  border-radius: 20px;
                  font-size: 16px !important;
                }
              }
              .li {
                border-bottom: 1px solid #2d72d3;
                box-shadow: inset 0 0px 5px 5px white;
              }
            }
          }
          .bg-footer {
            width: 100%;
            text-align: center;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
            position: absolute;
            left: 0;
            bottom: 48px;
            z-index: 999;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .login-app {
    width: 100%;
    height: 100%;
    overflow: auto;
    .login {
      width: 100%;
      height: 100%;
      min-height: 697px;
      background: url(../../static/login/login.png) no-repeat center;
      background-size: cover;
      .login-wrap {
        width: 100%;
        height: 100%;
        background: url(../../static/login/ccbLogo.png) no-repeat 36px 23px;
        position: relative;
        .login-bg {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          .ul {
            width: 350px;
            height: 280px;
            background: white;
            border-radius: 12px;
            margin-left: 60.20834%;
            font-size: 18px !important;
            ul {
              width: 100%;
              height: 100%;
              padding: 40px 45px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              li {
                .el-input {
                  /deep/ .el-input__inner {
                    border: none;
                  }
                }
                .el-button {
                  width: 100%;
                  height: 40px;
                  border-radius: 20px;
                  font-size: 16px !important;
                }
              }
              .li {
                border-bottom: 1px solid #2d72d3;
                box-shadow: inset 0 0px 5px 5px white;
              }
            }
          }
          .bg-footer {
            width: 100%;
            text-align: center;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(120, 120, 120, 1);
            position: absolute;
            left: 0;
            bottom: 48px;
            z-index: 999;
          }
        }
      }
    }
  }
}
</style>
