<template>
  <div class="sync-setting-box">
    <div class="content">
      <div class="top-main">
        <!-- 机构同步设置 -->
        <div class="main-box">
          <div class="box-title">机构同步设置</div>
          <div class="setting-from">
            <ul>
              <li>
                <span>服务器地址</span>
                <section>
                  <el-input v-model="form.ip" size="small" @blur="regExp(form.ip,'ip')" placeholder="XXX.XXX.XXX.XXX" clearable :disabled="!flag"></el-input>
                </section>
              </li>
              <li>
                <span>用户</span>
                <section>
                  <el-input v-model="form.userName" size="small" clearable :disabled="!flag"></el-input>
                </section>
              </li>
              <li>
                <span>同步间隔</span>
                <section>
                  <el-input v-model="form.time" size="small" clearable :disabled="!flag"></el-input>
                </section>
              </li>
            </ul>
            <ul>
              <li>
                <span>端口</span>
                <section>
                  <el-input v-model="form.port" size="small" @blur="regExp(form.port,'port')" placeholder="端口格式为0-65535" clearable :disabled="!flag"></el-input>
                </section>
              </li>
              <li>
                <span>密码</span>
                <section>
                  <el-input v-model="form.password" size="small" @blur="regExp(form.password,'pwd')" placeholder="密码格式为以字母开头6-18位" clearable :disabled="!flag"></el-input>
                </section>
              </li>
              <li>
                <span></span>
                <section></section>
              </li>
            </ul>
          </div>
          <div class="from-detail">
            <ul>
              <li>
                <span>录入时间</span>
                <section>{{form.createdAt}}</section>
              </li>
              <li>
                <span>录入机构</span>
                <section>{{form.org}}</section>
              </li>
              <li>
                <span>录入人</span>
                <section>{{form.userId}}</section>
              </li>
            </ul>
          </div>
          <div class="p-search-footer">
            <el-button v-show="!flag" @click="update" size="small">更新</el-button>
            <el-button v-show="!flag" @click="add" size="small">添加</el-button>
            <el-button v-show="flag" type="primary" @click="onSubmit" size="small">保存</el-button>
            <el-button v-show="flag" @click="reset" size="small">重置</el-button>
            <el-button v-show="flag" @click="close" size="small">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SyncSetting',
  data() {
    return {
      obj: {},
      form: {
        ip: '',
        userName: '',
        time: '',
        port: '',
        password: '',
        createdAt: '',
        org: '',
        userId: ''
      },
      backup: {},
      field: '',
      flag: false
    }
  },
  created() {
    this.obj = { ...this.form }
    this.getSetting()
    this.getState()
  },
  methods: {
    ...mapActions('syncSetting', ['setState', 'getConfig', 'updateSetting', 'addSetSetting']),
    // 获取服务配置信息
    getSetting(obj = {}) {
      this.getConfig(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.form = Object.assign(this.form, data.config)
          this.backup = this.form
        }
      })
    },
    // 更新服务配置
    updateConfig(obj = {}) {
      this.updateSetting(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.form = Object.assign(this.form, data.config)
          this.backup = this.form
        }
      })
    },
    // 添加服务设置
    addConfig(obj = {}) {
      this.addSetSetting(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.form = Object.assign(this.form, data.config)
          this.backup = this.form
        }
      })
    },
    // form修改
    getState() {
      this.form.createdAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.form.org = '省分行/支行'
      this.form.userId = '王美丽'
    },
    // 更新
    update() {
      this.flag = true
      this.field = '更新'
    },
    // 添加
    add() {
      this.flag = true
      this.field = '添加'
      this.reset()
    },
    // 保存设置
    onSubmit() {
      this.getState()
      this.form.port = Number(this.form.port)
      let { ip, port, userName, password, time, userId } = this.form
      let obj = { ip, port, userName, password, time, userId }
      if (this.field === '添加') {
        this.addConfig(obj)
        console.log(this.form, obj)
        this.form = Object.assign(this.form, obj)
      } else if (this.field === '更新') {
        obj.id = this.form.id
        this.updateConfig(obj)
      }
      this.close()
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.getState()
    },
    // 关闭
    close() {
      this.flag = false
      this.form = this.backup
    },
    // 校验
    regExp(value, key) {
      console.log(value, key)
      let ip = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/ // ip格式
      let port = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/ // 端口格式
      let pwd = /^[a-zA-Z]\w{5,17}$/ // 密码格式
      if (key === 'ip') {
        if (!ip.test(value)) {
          return this.$message('ip格式不对')
        }
      }
      if (key === 'port') {
        if (!port.test(value)) {
          return this.$message('端口格式不对')
        }
      }
      if (key === 'pwd') {
        if (!pwd.test(value)) {
          return this.$message('密码格式不对')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sync-setting-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top-main {
      margin: 10px 0;
      width: 100%;
      .main-box {
        padding: 20px;
        .box-title {
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
        }
        .setting-from {
          border: 1px solid #ddd;
          padding: 10px;
          width: 80%;
          height: 150px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          ul {
            width: 48%;
            height: 96%;
            display: flex;
            flex-direction: column;
            li {
              flex: 1;
              width: 100%;
              display: flex;
              span {
                width: 150px;
                height: 96%;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              section {
                flex: 1;
                height: 100%;
                padding: 0px 10px;
                display: flex;
                align-items: center;
                .el-select {
                  width: 100%;
                }
                el-date-picker {
                  width: 100%;
                }
              }
            }
          }
        }
        .from-detail {
          border: 1px solid #ddd;
          padding: 2px;
          width: 80%;
          height: 46px;
          margin: 15px auto;
          display: flex;
          justify-content: center;
          align-items: center;
          ul {
            width: 94%;
            height: 98%;
            display: flex;
            li {
              flex: 1;
              width: 100%;
              display: flex;
              span {
                width: 150px;
                height: 96%;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              section {
                flex: 1;
                height: 100%;
                padding: 0px 10px;
                display: flex;
                align-items: center;
                .el-select {
                  width: 100%;
                }
                el-date-picker {
                  width: 100%;
                }
              }
            }
          }
        }
        .p-search-footer {
          padding-top: 20px;
          text-align: center;
        }
      }
    }
  }
}
</style>
