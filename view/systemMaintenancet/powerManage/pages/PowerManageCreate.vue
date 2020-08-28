<template>
  <div class="power-manage-import-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{powerTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main-box" id="print-gplot">
        <div class="box-title">{{powerTitle}}权限</div>
        <div class="create-from">
          <ul>
            <li>
              <span>用户名</span>
              <section :class="[rules.userName ? 'blur-rule' : '']">
                <el-select v-model="form.userName" placeholder="请选择" clearable @clear="_ => {
                  this.form.name = ''
                  this.rules.userName=false
                  }"  :disabled="edit" size="small">
                  <el-option v-for="item in peopleArr" :label="item.userName" :value="item.id" @click.native="setUser(item, 'userName')" :key="item.id"></el-option>
                </el-select>
                <p v-if="rules.userName">{{ruleTitle.userName}}</p>
              </section>
            </li>
            <li>
              <span>姓名</span>
              <section :class="[rules.name ? 'blur-rule' : '']">
                <el-select v-model="form.name" placeholder="请选择" clearable  @clear="_ => {
                  this.form.userName = ''
                  this.rules.name=false
                  }" :disabled="edit" size="small">
                  <el-option v-for="item in peopleArr" :label="item.name" :value="item.id" @click.native="setUser(item, 'name')" :key="item.id"></el-option>
                </el-select>
                <p v-if="rules.name">{{ruleTitle.name}}</p>
              </section>
            </li>
            <li>
              <span>所属机构</span>
              <section>
                <el-input v-model="form.orgName" size="small" clearable :disabled="true"></el-input>
              </section>
            </li>
            <!-- <li>
              <span>有效期类型</span>
              <section>
                <el-select v-model="form.term" placeholder="请选择" size="small">
                  <el-option label="全部" value="全部"></el-option>
                  <el-option label="无期限" value="无期限"></el-option>
                  <el-option label="有期限" value="有期限"></el-option>
                </el-select>
              </section>
            </li> -->
            <li>
              <span>生效日期</span>
              <section>
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.startTime"
                  style="width: 100%;"
                  size="small"
                  :disabled="flag"
                ></el-date-picker>
              </section>
            </li>
            <li>
              <span>失效日期</span>
              <section>
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.endTime"
                  style="width: 100%;"
                  size="small"
                  :disabled="flag"
                ></el-date-picker>
              </section>
            </li>
            <li>
              <span>IP地址绑定</span>
              <section :class="[rules.ip ? 'blur-rule' : '']">
                <el-input v-model="form.ip" size="small" @clear="rules.ip=false" @blur="regExp(form.ip, 'ip', ['ip'])" placeholder="XXX.XXX.XXX.XXX" clearable :disabled="flag"></el-input>
                <p v-if="rules.ip">{{ruleTitle.ip}}</p>
              </section>
            </li>
            <li>
              <span>MAC地址绑定</span>
              <section :class="[rules.mac ? 'blur-rule' : '']">
                <el-input v-model="form.mac" size="small" @clear="rules.mac=false" @blur="regExp(form.mac, 'mac', ['mac'])" placeholder="XX-XX-XX-XX-XX-XX" clearable :disabled="flag"></el-input>
                <p v-if="rules.mac">{{ruleTitle.mac}}</p>
              </section>
            </li>
            <li class="last">
              <span>备注</span>
              <section :class="[rules.description ? 'blur-rule' : '']">
                <el-input v-model="form.description" size="small" @clear="rules.description=false" @blur="regExp(form.description, 'description', ['long'])" clearable :disabled="flag"></el-input>
                <p v-if="rules.description">{{ruleTitle.description}}</p>
              </section>
            </li>
          </ul>
        </div>
        <div class="transfer">
          <el-transfer
            v-model="value"
            :data="data"
            :titles="['已创建功能角色', '已分配角色']"
            :button-texts="[' 删除', '添加 ']"
            :right-default-checked="value"
            @change="handleChange"
          ></el-transfer>
        </div>
        <div class="from-detail">
          <ul>
            <li>
              <span>录入时间</span>
              <section>{{form.createAt}}</section>
            </li>
            <li>
              <span>录入机构</span>
              <section>{{form.createOrgId}}</section>
            </li>
            <li>
              <span>录入人</span>
              <section>{{form.createUid}}</section>
            </li>
          </ul>
        </div>
        <div class="p-search-footer">
          <el-button type="primary" @click="onSubmit" size="small" :disabled="flag">保存</el-button>
          <el-button @click="reset" size="small" :disabled="flag">重置</el-button>
          <!-- <el-button size="small" @click="print" v-show="edit">打印</el-button> -->
          <el-button @click="close" size="small" v-show="edit">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import {getTreeApi} from '@src/http/systemMaintain/powerManage.api.js'
export default {
  name: 'PowerManageCreate',
  data() {
    return {
      timer: '',
      obj: {},
      form: {
        userId: '',
        userName: '',
        name: '',
        nameArr: '',
        orgId: '',
        orgName: '',
        department: '',
        startTime: '',
        endTime: '',
        ip: '',
        mac: '',
        term: '',
        description: '',
        createUid: '',
        createOrgId: '',
        createAt: ''
      },
      ruleTitle: {
        userId: '',
        userName: '',
        name: '',
        nameArr: '',
        orgId: '',
        orgName: '',
        department: '',
        startTime: '',
        endTime: '',
        ip: '',
        mac: '',
        term: '',
        description: '',
        createUid: '',
        createOrgId: '',
        createAt: ''
      },
      rules: {
        title: '',
        userId: false,
        userName: false,
        name: false,
        nameArr: false,
        orgId: false,
        orgName: false,
        department: false,
        startTime: false,
        endTime: false,
        ip: false,
        mac: false,
        term: false,
        description: false,
        createUid: false,
        createOrgId: false,
        createAt: false
      },
      data: [],
      value: [],
      flag: false,
      props: {
        children: 'children',
        label: 'name',
        isLeaf: data => this.isLeafTreeItem(data) // 是否为最后子节点
      },
      initdata: [],
      treeType: 4,
      peopleArr: [],
      lastCheckRoles: []
    }
  },
  computed: {
    ...mapState({
      currentView: ({ powerManage }) => powerManage.currentView,
      currentTitle: ({ powerManage }) => powerManage.currentTitle,
      fromView: ({ powerManage }) => powerManage.fromView,
      fromTitle: ({ powerManage }) => powerManage.fromTitle,
      powerTitle: ({ powerManage }) => powerManage.powerTitle,
      lastTitle: ({ powerManage }) => powerManage.lastTitle,
      detailData: ({ powerManage }) => powerManage.detailData[0],
      orgId: ({ powerManage }) => powerManage.orgId,
      orgName: ({ powerManage }) => powerManage.orgName
    }),
    edit() {
      if (this.powerTitle !== '新建') {
        return true
      } else {
        return false
      }
    },
    tim() {
      let str = ''
      setInterval(_ => {
        str = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
      return str
    }
  },
  created() {
    this.formOrgIdName()
    this.getList()
    this.obj = { ...this.form }
    this.getPeople({orgId: [this.orgId]})
    this.getState()
    if (this.powerTitle === '编辑') {
      this.form = Object.assign(this.form, this.detailData)
      let arr = this.detailData.roles && this.$lodash.cloneDeep(this.detailData.roles)
      this.lastCheckRoles = arr
      let arr1 = arr && arr.map(item => (item = item.id))
      this.value = arr1
      this.obj = { ...this.form }
    }
    this.timer = setInterval(_ => {
      this.form.createAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  },
  methods: {
    ...mapActions('powerManage', ['setState', 'setPower', 'updatePower', 'getRoleList', 'getUser']),
    ...mapMutations('powerManage', ['SET_STATE']),
    // 获取人员信息
    getPeople(obj = {orgId: [this.orgId]}) {
      this.getUser(obj).then(res => {
        console.log(res.data)
        let {code, data} = res.data
        if (code === 0) {
          if (data[0]) {
            this.peopleArr = data[0].user
          }
        }
      })
    },
    setUser(item, str) {
      console.log(item)
      if (item) {
        this.form.orgName = item.orgName
        this.form.userName = item.userName
        this.form.name = item.name
        this.form.userId = item.id
        this.form.orgId = item.org
        this.regExp(item[str], str, ['null'])
      }
    },
    async loadNode(node, resolve) {
      try {
        if (node.level === 0) {
          let param = {
            type: this.treeType,
            oId: this.orgId
          }
          const params = await this.getTreeData(param)
          this.initdata = this.$lodash.cloneDeep(params[0] || {})
          await resolve(params)
        } else {
          const param = this.verifyQuery(node.data)
          await resolve(await this.getTreeData(param))
        }
      } catch (err) {
        throw err
      }
    },
    // 后端数据请求 封装
    async getTreeData(param) {
      let params = []
      try {
        if (!getTreeApi) {
          const massage = '没有接口'
          throw massage
        } else {
          await getTreeApi(param).then(res => {
            let {code, data} = res.data
            if (code === 0) {
              params = this.$lodash.cloneDeep(data)
            } else {
              throw res.data.message
            }
          }).catch(err => {
            throw err
          })
        }
      } catch (error) {
        console.log('error', error)
      }
      return params
    },
    // 接口入参校验及配置
    verifyQuery(data) {
      let query = {
        type: this.treeType,
        oId: this.orgId
      }
      // 动态获取的参数
      if (data.hasOwnProperty('dataType') && data.hasOwnProperty('id')) {
        switch (data.dataType) {
          case 'org':
            query['oId'] = data.id
            break
          default:
            break
        }
      }
      // console.log(node)
      return query
    },
    // 最后子节点校验
    isLeafTreeItem(data) {
      let status = false
      if (data.dataType && data.dataType === 'org') {
        return status
      }
      if (data.dataType && data.dataType === 'user') {
        return !status
      }
    },
    clickData(data) {
      console.log(data)
      if (data.isRoot && data.dataType === 'org') {
        this.form.userName = ''
        this.form.name = ''
        this.form.orgName = ''
      }
      if (data.dataType === 'user') {
        this.form.userName = data.userName
        this.form.name = data.name
        this.form.orgName = data.orgName
        this.form.userId = data.id
        this.$refs.selectTree.blur()
      }
    },
    // 请求角色列表
    getList() {
      this.getRoleList().then(res => {
        let {code, data} = res.data
        if (code === 0) {
          let arr = data.roles.map(item => {
            let {id, name, type} = item
            item = {
              key: id,
              label: name,
              disabled: false,
              type
            }
            return item
          })
          this.data = arr
        }
      })
    },
    // 穿梭
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys, this.value)
    },
    // 打印
    print() {
      this.setState({ type: 'SET_STATE', key: 'lastTitle', value: this.powerTitle })
      this.setState({ type: 'SET_STATE', key: 'powerTitle', value: '用户权限信息' })
      this.flag = true
      let arr = JSON.parse(JSON.stringify(this.data))
      arr.forEach(item => (item.disabled = true))
      this.data = arr
      printJS('print-gplot', 'html')
    },
    // form修改
    getState() {
      console.log()
      this.form.createOrgId = JSON.parse(sessionStorage.user).orgName
      this.form.createUid = JSON.parse(sessionStorage.user).name
    },
    // 保存
    onSubmit() {
      if (this.form.userName === '') {
        this.rules.userName = true
        this.ruleTitle.userName = '内容不能为空'
        return false
      }
      if (this.form.name === '') {
        this.rules.name = true
        this.ruleTitle.name = '内容不能为空'
        return false
      }
      let { startTime, endTime, ip, mac, description, userId, orgId } = this.form
      let arr = this.$lodash.cloneDeep(this.value)
      let arr1 = arr.map(item => (item = { id: item, status: 1 }))
      let delArr = []
      let lastCheckRoles = this.$lodash.cloneDeep(this.lastCheckRoles)
      console.log(lastCheckRoles, arr1)
      if (lastCheckRoles && lastCheckRoles.length > 0) {
        lastCheckRoles.forEach(item => {
          let flag = arr1.some(atm => atm.id === item.id)
          if (!flag) {
            delArr.push({ id: item.id, status: 2 })
          }
        })
      }
      arr1.push(...delArr)
      let obj = {
        createUserId: '1', // 创建人ID
        orgId: orgId, // 权限所属机构ID
        userId: [userId], // 人员ID 20 21
        startTime: this.$moment(startTime).format('YYYY-MM-DD'),
        endTime: this.$moment(endTime).format('YYYY-MM-DD'),
        ip: ip,
        mac: mac,
        description: description,
        roles: arr1
      }
      if (obj.startTime === 'Invalid date') { obj.startTime = '' }
      if (obj.endTime === 'Invalid date') { obj.endTime = '' }
      let typeOne = this.data.filter(item => item.type === 1)
      if (typeOne.length <= 0) {
        return this.$notify({
          title: '已创建功能角色，没有一项是正常授权',
          message: '请创建正常授权功能角色至少一项',
          type: 'warning',
          position: 'bottom-right'
        })
      }
      let flag = []
      obj.roles.forEach(item => {
        typeOne.forEach(atm => {
          if (item.id === atm.key) {
            flag.push(item)
          }
        })
      })
      console.log(flag)
      if (flag.length <= 0) {
        return this.$notify({
          title: '已分配角色错误',
          message: '请分配至少一项正常授权功能角色',
          type: 'warning',
          position: 'bottom-right'
        })
      }
      console.log(obj, this.data)
      if (this.powerTitle === '新建') {
        // console.log(obj)
        this.setPower(obj).then(res => {
          let { code, data } = res.data
          console.log(data)
          if (code === 0) {
            this.$message('新建成功')
            setTimeout(() => {
              this.close()
              this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PowerManageList' })
              this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '列表' })
            }, 500)
          } else {
            return this.$message('新建失败')
          }
        })
      }
      if (this.powerTitle === '编辑') {
        // console.log(obj, this.form)
        obj.id = this.form.id
        this.updatePower(obj).then(res => {
          let { code, data } = res.data
          console.log(data)
          if (code === 0) {
            this.$message('编辑修改成功')
            setTimeout(() => this.close(), 500)
          } else {
            return this.$message('编辑修改失败')
          }
        })
      }
    },
    // 重置
    reset() {
      if (this.powerTitle === '编辑') {
        this.form = { ...this.obj }
        let arr = this.$lodash.cloneDeep(this.detailData.roles)
        let arr1 = arr && arr.map(item => (item = item.id))
        this.value = arr1
        // this.form = Object.assign(this.form, this.detailData)
        // let arr = JSON.parse(JSON.stringify(this.detailData.roles))
        // let arr1 = arr && arr.map(item => (item = item.id))
        // this.value = arr1
      } else {
        this.form = { ...this.obj }
        this.value = []
      }
    },
    // 关闭
    close() {
      // if (this.powerTitle === '编辑') {
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PowerManageList' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '列表' })
      // }
      this.flag = false
      let arr = JSON.parse(JSON.stringify(this.data))
      arr.forEach(item => (item.disabled = false))
      this.data = arr
      this.setState({ type: 'SET_STATE', key: 'powerTitle', value: this.lastTitle })
    },
    formOrgIdName() {
      this.form.org = this.orgId
      this.form.orgName = this.orgName
    },
    // 节点点击事件
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.form.userName = data.label
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectTree.blur()
    },
    // 选择器配置可以清空选项，用户点击清空按钮时触发
    handleClear() {
      // 将选择器的值置空
      this.form.userName = ''
    },
    // 校验
    regExp(value, key, arr) {
      console.log(value, key, arr)
      let ip = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/ // ip格式
      let mac = /^[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}-[A-Fa-f\d]{2}$/ // mac格式
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      console.log(str)
      arr.forEach(item => {
        if (item === 'null') {
          if (str === '') {
            this.rules[key] = true
            this.ruleTitle[key] = '内容不能为空'
          } else if (str.length > 64) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出64个字符'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'long') {
          if (str.length > 128) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出128个字符'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'ip') {
          if (!ip.test(value)) {
            this.rules[key] = true
            this.ruleTitle[key] = 'ip格式不对'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'mac') {
          if (!mac.test(value)) {
            this.rules[key] = true
            this.ruleTitle[key] = 'mac格式不对'
          } else {
            this.rules[key] = false
          }
        } else {
          this.rules[key] = false
        }
      })
    }
  },
  watch: {
    orgId() {
      this.getPeople()
      if (this.powerTitle === '新建') {
        this.formOrgIdName()
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除定时器
    }
  }
}
</script>

<style lang="less" scoped>
.power-manage-import-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    width: 100%;
    padding: 5px 0px 5px 10px;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      // height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .header {
        margin-bottom: 10px;
        color: #333333;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2D72D3;
            }
          }
        }
      }
    }
    .main-box {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .box-title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      .create-from {
        border: 1px solid #ddd;
        padding: 15px 10px 5px 20px;
        width: 80%;
        // min-height: 160px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          width: 100%;
          height: 96%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 50%;
            height: 48px;
            display: flex;
            span {
              width: 150px;
              height: 32px;
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
              flex-direction: column;
              .el-select {
                width: 100%;
              }
              el-date-picker {
                width: 100%;
              }
              p{
                color: red;font-size: 12px;
              }
            }
            .blur-rule{
              .el-input {
                /deep/ input{border-color: red;}
              }
              /deep/ .el-select{
                /deep/ .el-input {
                  /deep/ input{border-color: red;}
                }
              }
            }
          }
          .last {
            width: 100%;
          }
        }
      }
      .transfer {
        flex: 1;
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        margin: 15px auto;
        .el-transfer {
          display: flex;
          min-height: 360px;
          height: 100%;
          justify-content: space-around;
          align-items: center;
          /deep/.el-transfer-panel {
            display: flex;
            flex-direction: column;
            width: 320px !important;
            min-height: 360px;
            height: 100%;
            /deep/.el-transfer-panel__body {
              flex: 1;
              height: 100%;
              /deep/.el-transfer-panel__list {
                height: 100% !important;
              }
            }
          }
        }
      }
      .from-detail {
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        min-height: 46px;
        height: 46px;
        margin: 5px auto;
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
</style>
