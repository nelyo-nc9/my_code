<template>
  <div class="power-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">权限管理查询</div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>用户名</span>
                  <section :class="[rules.userName ? 'blur-rule' : '']">
                    <el-input v-model="form.userName" size="small" placeholder="请输入用户名" clearable @clear="rules.userName=false" @blur="regExp(form.userName, 'userName', ['long'])"></el-input>
                    <!-- <el-select v-model="form.userName" placeholder="请选择" size="small" clearable @clear="handleClear"  ref="selectTree">
                      <el-option hidden value="tree"></el-option>
                      <el-tree ref="tree" :props="props" :load="loadNode" :highlight-current="true" @node-click="clickData" lazy :key="orgId"></el-tree>
                      </el-select> -->
                    <p v-if="rules.userName">{{ruleTitle.userName}}</p>
                  </section>
                </li>
                <li>
                  <span>姓名</span>
                  <section :class="[rules.name ? 'blur-rule' : '']">
                    <el-input v-model="form.name" size="small" placeholder="请输入姓名" clearable @clear="rules.name=false" @blur="regExp(form.name, 'name', ['long'])"></el-input>
                    <p v-if="rules.name">{{ruleTitle.name}}</p>
                  </section>
                </li>
                <li>
                  <span>所属机构</span>
                  <section :class="[rules.orgName ? 'blur-rule' : '']">
                    <el-input v-model="form.orgName" size="small" placeholder="请输入机构名" clearable @clear="rules.orgName=false" @blur="regExp(form.orgName, 'orgName', ['long'])"></el-input>
                    <p v-if="rules.orgName">{{ruleTitle.orgName}}</p>
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
                     <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" style="width: 100%;" size="small"></el-date-picker>
                    <!-- <el-date-picker v-model="form." type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
                  </section>
                </li>
                <li>
                  <span>失效日期</span>
                  <section>
                     <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" style="width: 100%;" size="small"></el-date-picker>
                    <!-- <el-date-picker v-model="form." type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;" size="small"></el-date-picker> -->
                  </section>
                </li>
                <li>
                  <span>IP地址绑定</span>
                  <section :class="[rules.ip ? 'blur-rule' : '']">
                    <el-input v-model="form.ip" @clear="rules.ip=false" @blur="regExp(form.ip, 'ip', ['ip'])" placeholder="XXX.XXX.XXX.XXX" size="small" clearable></el-input>
                    <p v-if="rules.ip">{{ruleTitle.ip}}</p>
                  </section>
                </li>
                <li>
                  <span>MAC地址绑定</span>
                  <section :class="[rules.mac ? 'blur-rule' : '']">
                    <el-input v-model="form.mac" @clear="rules.mac=false" @blur="regExp(form.mac, 'mac', ['mac'])" placeholder="XX-XX-XX-XX-XX-XX" size="small" clearable></el-input>
                    <p v-if="rules.mac">{{ruleTitle.mac}}</p>
                  </section>
                </li>
                <li>
                  <span>角色</span>
                  <section :class="[rules.roleName ? 'blur-rule' : '']">
                    <el-input v-model="form.roleName" size="small" clearable @clear="rules.roleName=false" @blur="regExp(form.roleName, 'roleName', ['long'])"></el-input>
                    <p v-if="rules.roleName">{{ruleTitle.roleName}}</p>
                  </section>
                </li>
                <li>
                  <span>备注</span>
                  <section :class="[rules.description ? 'blur-rule' : '']">
                    <el-input v-model="form.description" size="small" clearable @clear="rules.description=false" @blur="regExp(form.description, 'description', ['null'])"></el-input>
                    <p v-if="rules.description">{{ruleTitle.description}}</p>
                  </section>
                </li>
                <!-- <li>
                  <span>录入机构</span>
                  <section>
                    <el-input v-model="form.createdOrgName" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>录入人</span>
                  <section>
                    <el-input v-model="form.createdUserName" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>录入时间</span>
                  <section>
                    <el-date-picker v-model="form.createdAt" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;"  size="small"></el-date-picker>
                  </section>
                </li> -->
              </ul>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
              <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            highlight-current-row
            @selection-change="handleSelectionChange"
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[25,50,100,200]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {getTreeApi} from '@src/http/systemMaintain/powerManage.api.js'
import { download } from '@src/common/download.js'
export default {
  name: 'PowerManageSearch',
  data() {
    return {
      status: '全部',
      resizable: true,
      columns: [
        { prop: 'userName', sortable: true, label: '用户名', width: '120' },
        { prop: 'name', sortable: true, label: '姓名', width: '100' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '120' },
        { prop: 'roleName', sortable: true, label: '角色', width: '180' },
        { prop: 'startTime', sortable: true, label: '生效日期', width: '120' },
        { prop: 'endTime', sortable: true, label: '失效日期', width: '120' },
        { prop: 'ip', sortable: true, label: 'Ip绑定地址', width: '200' },
        { prop: 'mac', sortable: true, label: 'MAC地址绑定', width: '200' },
        { prop: 'description', sortable: true, label: '备注', width: '155' },
        { prop: 'createUid', sortable: true, label: '录入人', width: '180' },
        { prop: 'createOrgId', sortable: true, label: '录入机构', width: '180' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '180' }
      ],
      tableData: [],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        userId: '',
        userName: '',
        name: '',
        orgName: '',
        roleName: '',
        startTime: '',
        endTime: '',
        ip: '',
        mac: '',
        description: ''
        // createdOrgName: '',
        // createdAt: '',
        // createdUserName: ''
      },
      ruleTitle: {
        userId: '',
        userName: '',
        name: '',
        orgName: '',
        roleName: '',
        startTime: '',
        endTime: '',
        ip: '',
        mac: '',
        description: ''
        // createdOrgName: '',
        // createdAt: '',
        // createdUserName: ''
      },
      rules: {
        userId: false,
        userName: false,
        name: false,
        orgName: false,
        roleName: false,
        startTime: false,
        endTime: false,
        ip: false,
        mac: false,
        description: false
        // createdOrgName: false,
        // createdAt: false,
        // createdUserName: false
      },
      pageSize: 25,
      page: 1,
      props: {
        children: 'children',
        label: 'name',
        isLeaf: data => this.isLeafTreeItem(data) // 是否为最后子节点
      },
      initdata: [],
      treeType: 4
    }
  },
  computed: {
    ...mapState({
      currentView: ({ powerManage }) => powerManage.currentView,
      currentTitle: ({ powerManage }) => powerManage.currentTitle,
      orgId: ({ powerManage }) => powerManage.orgId
    })
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('powerManage', ['setState', 'getList', 'exportManage']),
    ...mapMutations('powerManage', ['SET_STATE']),
    async loadNode(node, resolve) {
      try {
        if (node.level === 0) {
          let param = {
            type: this.treeType
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
    getTableList(obj = { pageSize: 25, page: 1, isChildren: 2 }) {
      // 请求表格数据方法
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          console.log(data)
          this.total = data.page.totalNumber
          let list = []
          if (data.authorities && data.authorities.length > 0) {
            list = this.$lodash.cloneDeep(data.authorities)
            this.$messageSuccess('列表获取成功')
          } else {
            this.$notify({  type: 'info', message: '无数据', position: 'bottom-right', offset: 100 })
          }
          if (list.length > 0) {
            list.forEach(item => {
              let arr = item.roles && item.roles.map(i => {
                i = i.name
                return i
              })
              item.roleName = item.roles && item.roles[0] ? JSON.stringify(arr).replace(/(^\[*)|(\]*$)|"/g, '').replace(/,/g, '/') : ''
            })
          }
          this.tableData = list
        }
      })
    },
    select(val) {
      console.log(val)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = Object.assign({ pageSize: this.pageSize, page: val, isChildren: 2 }, this.handleForm(this.form))
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // form键值处理
    handleForm(form) {
      let arr = this.$lodash.cloneDeep([form])
      arr = arr.map(item => {
        // item.startTime = this.$moment(item.startTime).format('YYYY-MM-DD')
        // item.endTime = this.$moment(item.endTime).format('YYYY-MM-DD')
        // item.status = item.status * 1
        // item.type = item.type * 1
        // if (item.sex === '女') {
        //   item.sex = 2
        // }
        // if (item.sex === '男') {
        //   item.sex = 1
        // }
        // if (item.sex === '') {
        //   delete item.sex
        // }
        // if (item.status === 0) {
        //   delete item.status
        // }
        item.startTime = this.$moment(item.startTime).format('YYYY-MM-DD')
        item.endTime = this.$moment(item.endTime).format('YYYY-MM-DD')
        if (item.startTime === 'Invalid date') {
          delete item.startTime
        }
        if (item.endTime === 'Invalid date') {
          delete item.endTime
        }
        // if (item.createdAt instanceof Array) {
        //   item.createdAt[0] = this.$moment(item.createdAt[0]).format('YYYY-MM-DD HH:mm')
        //   item.createdAt[1] = this.$moment(item.createdAt[1]).format('YYYY-MM-DD HH:mm')
        // } else {
        //   delete item.createdAt
        // }
        return item
      })
      return arr[0]
    },
    // 查询
    onSubmit() {
      let obj = Object.assign({pageSize: this.pageSize, page: this.page, isChildren: 2}, this.handleForm(this.form))
      if (obj.endTime === 'Invalid date') {
        delete obj.endTime
      }
      if (obj.startTime === 'Invalid date') {
        delete obj.startTime
      }
      delete obj.userId
      console.log(obj)
      this.getTableList(obj)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.tableData = []
      this.total = 0
      this.pageSize = 25
      this.page = 1
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['用户名', '姓名', '所属机构', '角色', '生效日期', '失效日期', 'Ip绑定地址', 'MAC地址绑定', '备注', '录入人', '录入机构', '录入时间']
      const filterVal = ['userName', 'name', 'orgName', 'roleName', 'startTime', 'endTime', 'ip', 'mac', 'description', 'createUid', 'createOrgId', 'createdAt']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '权限查询')
      } else {
        let obj = Object.assign({isChildren: 2}, this.handleForm(this.form))
        if (obj.endTime === 'Invalid date') {
          delete obj.endTime
        }
        if (obj.startTime === 'Invalid date') {
          delete obj.startTime
        }
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `权限查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        throw err
      })
    },
    // 打印
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.arr && this.arr.length > 0) {
        list = this.arr
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'userName', displayName: '用户名' },
          { field: 'name', displayName: '姓名' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'roleName', displayName: '角色' },
          { field: 'startTime', displayName: '生效日期' },
          { field: 'endTime', displayName: '失效日期' },
          { field: 'ip', displayName: 'Ip绑定地址' },
          { field: 'mac', displayName: 'MAC地址绑定' },
          { field: 'description', displayName: '备注' },
          { field: 'createUid', displayName: '录入人' },
          { field: 'createOrgId', displayName: '录入机构' },
          { field: 'createdAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">权限管理查询</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
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
  }
}
</script>

<style lang="less" scoped>
.power-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding: 5px 0px 5px 10px;
    .top {
      width: 100%;
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
      .top-main {
        width: 100%;
        .main-box {
          padding: 0px 20px;
          .box-title {
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
          }
          .p-serach-from {
            border: 1px solid #ddd;
            padding: 15px 10px 5px 20px;
            width: 80%;
            max-width: 1567px;
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
          .p-search-footer {
            padding: 10px 0px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 400px');
      .list-box-table {
        width: 1632px;
        overflow: auto;margin: 0 auto;
        height: calc(~'100% - 40px');
      }
      .main-footer {
        width: 1632px;
        height: 40px;margin: 0 auto;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2d72d3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
