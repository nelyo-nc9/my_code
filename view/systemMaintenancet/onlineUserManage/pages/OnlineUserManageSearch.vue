<template>
  <div class="onlineUser-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>在线用户管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">在线用户管理查询</div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>姓名</span>
                  <section :class="[rules.name ? 'blur-rule' : '']">
                    <el-input v-model="form.name" size="small" clearable @clear="rules.name=false" @blur="regExp(form.name, 'name', ['long'])"></el-input>
                    <p v-if="rules.name">{{ruleTitle.name}}</p>
                  </section>
                </li>
                <li>
                  <span>登录用户</span>
                  <section :class="[rules.userName ? 'blur-rule' : '']">
                    <el-input v-model="form.userName" size="small" clearable @clear="rules.userName=false" @blur="regExp(form.userName, 'userName', ['long'])"></el-input>
                    <p v-if="rules.userName">{{ruleTitle.userName}}</p>
                  </section>
                </li>
                <li>
                  <span>所属机构</span>
                  <section>
                    <el-select v-model="form.orgName" placeholder="请选择所属机构" size="small" clearable  ref="selectTree">
                     <el-option hidden value="tree"></el-option>
                     <Tree ref="tree" :lazyTreeApi="getTree" @clickData="clickData" treeLazyToggle></Tree>
                    </el-select>
                    <!-- <el-select v-model="form.orgName" placeholder="请选择机构" size="small">
                      <el-option label="全部" value="全部"></el-option>
                    </el-select> -->
                    <!-- <el-select v-model="form.org" placeholder="请选择机构" size="small" clearable @clear="handleClear"  ref="selectTree">
                      <el-option hidden value="tree"></el-option>
                      <el-tree :data="data" :props="defaultProps" node-key="id"
                        :expand-on-click-node="false"
                        :check-on-click-node="true"
                        @node-click="handleNodeClick"
                      >
                      </el-tree>
                    </el-select> -->
                  </section>
                </li>
                <!-- <li>
                  <span>所属部门</span>
                  <section>
                    <el-input v-model="form.department" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>职务</span>
                  <section>
                    <el-input v-model="form.job" size="small" clearable></el-input>
                  </section>
                </li>-->
                <li>
                  <span>用户IP</span>
                  <section :class="[rules.ip ? 'blur-rule' : '']">
                    <el-input v-model="form.ip" @clear="rules.ip=false" @blur="regExp(form.ip, 'ip', ['ip'])" placeholder="XXX.XXX.XXX.XXX" size="small" clearable></el-input>
                    <p v-if="rules.ip">{{ruleTitle.ip}}</p>
                  </section>
                </li>
                <li>
                  <span>登录类型</span>
                  <section>
                    <el-select v-model="form.loginType" placeholder="请选择类型" size="small" clearable>
                      <el-option label="web登录" value="1"></el-option>
                      <!-- <el-option label="app登录" value="2"></el-option> -->
                    </el-select>
                  </section>
                </li>
                <li>
                  <span>登录时间</span>
                  <section>
                     <!-- <el-date-picker v-model="form.time" type="date" placeholder="选择日期" size="small"></el-date-picker> -->
                    <el-date-picker
                      v-model="form.time"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="center" style="width: 100%;"
                      size="small"
                    ></el-date-picker>
                  </section>
                </li>
                <li>
                  <span>登录时长</span>
                  <section>
                    <el-select v-model="form.timeLang" placeholder="请选择时长" size="small" clearable>
                      <el-option label="2小时以内" value="1"></el-option>
                      <el-option label="6小时以内" value="2"></el-option>
                      <el-option label="一天以内" value="3"></el-option>
                      <el-option label="一天以上" value="4"></el-option>
                    </el-select>
                  </section>
                </li>
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
            <el-table-column type="selection" width="50" align="center"></el-table-column>
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
import Tree from '@src/components/tree/treeBox'
import { orgTreeApi } from '@src/http/systemMaintain/roleManage.api.js'
import { download } from '@src/common/download.js'

export default {
  name: 'OnlineUserManageSearch',
  components: { Tree },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      resizable: false,
      columns: [
        { prop: 'name', sortable: true, label: '姓名', width: '150' },
        { prop: 'userName', sortable: true, label: '登录用户', width: '230' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '230' },
        { prop: 'ip', sortable: true, label: '用户IP', width: '230' },
        { prop: 'loginType', sortable: true, label: '登录类型', width: '230' },
        { prop: 'loginTime', sortable: true, label: '登录时间', width: '230' },
        { prop: 'timeLang', sortable: true, label: '登录时长', width: '230' }
      ],
      tableData: [],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        name: '',
        userName: '',
        orgName: '',
        org: '',
        ip: '',
        loginType: '',
        time: '',
        timeLang: ''
      },
      ruleTitle: {
        name: '',
        userName: '',
        orgName: '',
        org: '',
        ip: '',
        loginType: '',
        time: '',
        timeLang: ''
      },
      rules: {
        name: false,
        userName: false,
        orgName: false,
        org: false,
        ip: false,
        loginType: false,
        time: false,
        timeLang: false
      },
      pageSize: 25,
      page: 1
    }
  },
  computed: {
    ...mapState({
      currentView: ({ onlineUserManage }) => onlineUserManage.currentView,
      currentTitle: ({ onlineUserManage }) => onlineUserManage.currentTitle
    })
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('onlineUserManage', ['setState', 'getList', 'exportManage']),
    ...mapMutations('onlineUserManage', ['SET_STATE']),
    getTree(params) {
      return orgTreeApi(params)
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
      if (data && data instanceof Object) {
        this.form.org = data.serial
        this.form.orgName = data.name
        this.$refs.selectTree.blur()
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        console.log(data)
        if (code === 0) {
          if (data['liveUserList']) {
            this.total = data.page.totalNumber
            if (data.liveUserList.length > 0) {
              this.$messageSuccess('列表获取成功')
            }
            this.tableData = this.handleData(data.liveUserList)
          } else {
            this.$message('当前无在线用户')
          }
        }
      })
    },
    // 键值处理
    handleData(data) {
      let arr = JSON.parse(JSON.stringify(data))
      arr.forEach(item => {
        if (item.loginType === 1) {
          item.loginType = 'web登录'
        } else if (item.loginType === 2) {
          item.loginType = 'app登录'
        }
        item.timeLang = this.formatSeconds(item.timeLang)
        if (item.status) {
          item.UserName = item.UserName + '/下线' + item.status ? '成功' : '失败'
        }
      })
      return arr
    },
    // 时分秒
    formatSeconds(value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      result = `${h}:${m}:${s}`
      return result
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = Object.assign({ pageSize: this.pageSize, page: val }, this.handleForm(this.form))
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
        item.loginType = item.loginType * 1
        item.findTimeLang = item.timeLang * 1
        if (item.time instanceof Array) {
          item.startTime = this.$moment(item.time[0]).format('YYYY-MM-DD HH:mm')
          item.endTime = this.$moment(item.time[1]).format('YYYY-MM-DD HH:mm')
        }
        if (item.loginType !== 1 && item.loginType !== 2) {
          delete item.loginType
        }
        if (item.findTimeLang !== 1 && item.findTimeLang !== 2 && item.findTimeLang !== 3 && item.findTimeLang !== 4) {
          delete item.findTimeLang
        }
        delete item.timeLang
        delete item.orgName
        delete item.time
        return item
      })
      return arr[0]
    },
    // 查询
    onSubmit() {
      let obj = Object.assign({ pageSize: this.pageSize, page: this.page }, this.handleForm(this.form))
      this.getTableList(obj)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.tableData = []
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['姓名', '登录用户', '所属机构', '用户IP', '登录类型', '登录时间', '登录时长']
      const filterVal = ['name', 'userName', 'orgName', 'ip', 'loginType', 'loginTime', 'timeLang']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '在线用户查询')
      } else {
      let obj = Object.assign({}, this.handleForm(this.form))
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
            let name = `在线用户查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        throw err
      })
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
    },
    // 节点点击事件
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.form.org = data.label
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectTree.blur()
    },
    // 选择器配置可以清空选项，用户点击清空按钮时触发
    handleClear() {
      // 将选择器的值置空
      this.form.org = ''
    }
  }
}
</script>

<style lang="less" scoped>
.onlineUser-manage-search-box {
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
            max-width: 1662px;
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
      max-width: 1662px;
      height: calc(~'100% - 340px');margin: 0 auto;
      .list-box-table {
        max-width: 1662px;
        width: 100%;
        overflow: auto;
        height: calc(~'100% - 40px');
      }
      .main-footer {
        max-width: 1662px;
        height: 40px;
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
