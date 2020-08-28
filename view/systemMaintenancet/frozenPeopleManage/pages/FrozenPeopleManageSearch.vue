<template>
  <div class="frozen-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>冻结用户管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 冻结用户信息 -->
          <div class="main-box">
            <div class="box-title">冻结用户管理查询</div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>用户名</span>
                  <section :class="[rules.name ? 'blur-rule' : '']">
                    <el-input v-model="form.name" size="small" clearable @clear="rules.name=false" @blur="regExp(form.name, 'name', ['long'])"></el-input>
                    <p v-if="rules.name">{{ruleTitle.name}}</p>
                  </section>
                </li>
                <!-- <li>
                  <span>职务</span>
                  <section>
                    <el-select v-model="form.job" placeholder="请选择职务" size="small" filterable clearable>
                      <el-option label="柜员" value="柜员"></el-option>
                      <el-option label="部门主管" value="部门主管"></el-option>
                      <el-option label="客户经理" value="客户经理"></el-option>
                    </el-select>
                  </section>
                </li> -->
                <li>
                  <span>所属机构</span>
                  <section>
                    <el-select v-model="form.orgName" placeholder="请选择所属机构" size="small" clearable  ref="selectTree">
                     <el-option hidden value="tree"></el-option>
                     <Tree ref="tree" :lazyTreeApi="getTree" :lazyTreeCheckApi="getLazyTree" @clickData="clickData" treeLazyToggle></Tree>
                    </el-select>
                  </section>
                </li>
                <!-- <li>
                  <span>权限</span>
                  <section>
                    <el-select v-model="form.permission" placeholder="请选择权限" size="small" filterable clearable>
                      <el-option label="柜员" value="柜员"></el-option>
                      <el-option label="经理" value="经理"></el-option>
                      <el-option label="主管" value="主管"></el-option>
                    </el-select>
                  </section>
                </li> -->
                <!-- <li>
                  <span>录入人</span>
                  <section>
                    <el-input v-model="form.createdUserName" size="small" clearable></el-input>
                  </section>
                </li>
                <li>
                  <span>录入时间</span>
                  <section>
                    <el-date-picker v-model="form.createdAt" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"></el-date-picker>
                  </section>
                </li>
                <li>
                  <span>录入机构</span>
                  <section>
                    <el-input v-model="form.createdOrgName" size="small" clearable></el-input>
                  </section>
                </li> -->
              </ul>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
              <!-- <el-button size="small" @click="restart" :disabled="locaArr.length === 0">解除冻结</el-button> -->
              <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <!-- <div class="button-box">
        <el-button size="small" @click="restart" :disabled="locaArr.length === 0">解除冻结</el-button>
        <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
        <el-button size="small" @click="resetPwd">重置密码</el-button>
        <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
      </div> -->
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
            @current-change="handleCurrentItem"
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="120" align="center"></el-table-column>
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
import { download } from '@src/common/download.js'
import Tree from '@src/components/tree/treeBox'
import { orgTreeApi, orgLazyTreeApi } from '@src/http/systemMaintain/roleManage.api.js'

export default {
  name: 'FrozenPeopleManageSearch',
  components: { Tree },
  data() {
    return {
      status: '全部',
      resizable: true,
      columns: [
        { prop: 'name', sortable: true, label: '用户名', width: '200' },
        // { prop: 'job', sortable: true, label: '职位', width: '240' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '200' },
        // { prop: 'department', sortable: true, label: '所属部门', width: '280' },
        // { prop: 'power', sortable: true, label: '权限', width: '240' },
        { prop: 'status', sortable: false, label: '状态', width: '200' },
        { prop: 'createdUserName', sortable: true, label: '录入人', width: '200' },
        { prop: 'createdOrgName', sortable: true, label: '录入机构', width: '200' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '200' }
      ],
      tableData: [],
      total: 0,
      showSubOrg: true,
      selectData: [],
      obj: {},
      form: {
        name: '',
        // job: '',
        org: '',
        orgName: ''
        // department: '',
        // permission: '',
        // status: 1,
        // createdOrgName: '',
        // createdAt: '',
        // createdUserName: ''
      },
      rules: {
        name: false,
        // job: false,
        org: false,
        orgName: false
        // department: false,
        // permission: false,
        // status: 1,
        // createdOrgName: false,
        // createdAt: false,
        // createdUserName: false
      },
      ruleTitle: {
        name: '',
        // job: '',
        org: '',
        orgName: ''
        // department: '',
        // permission: '',
        // status: 1,
        // createdOrgName: '',
        // createdAt: '',
        // createdUserName: ''
      },
      pageSize: 25,
      page: 1,
      locaArr: [],
      flag: false
    }
  },
  computed: {
    ...mapState({
      currentView: ({ frozenPeopleManage }) => frozenPeopleManage.currentView,
      currentTitle: ({ frozenPeopleManage }) => frozenPeopleManage.currentTitle
    })
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('frozenPeopleManage', ['setState', 'getList', 'setStatus']),
    ...mapActions('peopleManage', ['exportManage']),
    ...mapMutations('frozenPeopleManage', ['SET_STATE']),
    getTree(params) {
      return orgTreeApi(params)
    },
    getLazyTree(params) {
      return orgLazyTreeApi(params)
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
    getTableList(obj = { pageSize: 25, page: 1, status: 1, sync: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.total = data.page.totalNumber
          if (data.user.length > 0) {
            this.$messageSuccess('列表获取成功')
          } else {
            this.$notify({  type: 'info', message: '无数据', position: 'bottom-right', offset: 100 })
          }
          this.tableData = this.handleData(data.user)
        }
      })
    },
    // 键值处理
    handleData(data) {
      let arr = JSON.parse(JSON.stringify(data))
      arr.forEach(item => {
        if (item.sex === 1) {
          item.sex = '男'
        } else if (item.sex === 2) {
          item.sex = '女'
        }
        if (item.status === 1) {
          item.status = '冻结'
        } else if (item.status === 2) {
          item.status = '激活'
        }
        if (item.result === 0) {
          item.result = '失败'
        } else if (item.result === 1) {
          item.result = '成功'
        }
        if (this.flag) {
          item.status = item.status + '/激活' + item.result
        }
      })
      return arr
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.locaArr = [...val]
      this.setState({ type: 'SET_STATE', key: 'selectData', value: [...val] })
      console.log(val, '列表勾选')
    },
    // 列表当前项
    handleCurrentItem(val) {
      console.log(val, '列表当前项')
      this.selectData = [...val]
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = Object.assign({ pageSize: this.pageSize, page: val, status: 1, sync: 1 }, this.form)
      this.getTableList(Object.assign(obj, this.form))
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询
    onSubmit() {
      console.log('submit!', this.form)
      let obj = Object.assign({ pageSize: this.pageSize, page: this.page, status: 1, sync: 1 }, this.form)
      delete obj.orgName
      console.log(obj)
      // obj.createdAt[0] = this.$moment(obj.createdAt[0]).format('YYYY-MM-DD HH:mm')
      // obj.createdAt[1] = this.$moment(obj.createdAt[1]).format('YYYY-MM-DD HH:mm')
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
    // 激活用户
    restart() {
      this.flag = true
      if (this.locaArr.length <= 0) {
        return this.$message('请勾选解冻用户')
      }
      let arr = this.locaArr.map(item => {
        let { id, status } = item
        if (status === '冻结') {
          status = 1
        }
        //  else if (status === '解冻') {
        //   status = 2
        // }
        item = { userId: id, status: 2 }
        return item
      })
      this.setStatus({ list: arr }).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          let arr = this.$lodash.cloneDeep(this.tableData)
          arr.map(item => {
            data.list.forEach(ctm => {
              if (item.id === ctm.userId) {
                item.status = ctm.status
                item.result = ctm.result
                return item
              }
            })
          })
          this.tableData = this.handleData(arr)
        }
      }).then(_ => {
        setTimeout(() => {
          this.flag = false
          this.page = 1
          this.getTableList({ pageSize: this.pageSize, page: 1, status: 1, sync: 1 })
        }, 0)
      })
    },
    // 重置密码
    resetPwd() {
      return this.$message('重置密码')
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['用户名', '所属机构', '状态', '录入人', '录入机构', '录入时间']
      const filterVal = ['name', 'orgName', 'status', 'createdUserName', 'createdOrgName', 'createdAt']
      let list = []
      if (this.locaArr && this.locaArr.length > 0) {
        list = this.locaArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '冻结用户查询列表')
      } else {
        let obj = Object.assign({status: 1, sync: 1 }, this.form)
        delete obj.orgName
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {status: 1, sync: 1 }) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `冻结用户查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
      if (this.locaArr && this.locaArr.length > 0) {
        list = this.locaArr
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '用户名' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'status', displayName: '状态' },
          { field: 'createdUserName', displayName: '录入人' },
          { field: 'createdOrgName', displayName: '录入机构' },
          { field: 'createdAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">冻结用户管理查询</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
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
    }
  }
}
</script>

<style lang="less" scoped>
.frozen-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
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
          .p-serach-from {
            border: 1px solid #ddd;
            padding: 15px 10px 5px 20px;
            width: 1377px;
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
            padding-top: 20px;
            text-align: center;
          }
        }
      }
    }
    // .button-box {
    //   width: 1377px;
    //   margin: 9px auto;
    // }
    .main {
      width: 1377px;
      margin: 0 auto;
      height: calc(~'100% - 240px');
      .list-box-table {
        width: 1377px;
        // width: 100%;
        height: calc(~'100% - 50px');
        overflow: auto;
      }
      .main-footer {
        width: 1377px;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2D72D3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
