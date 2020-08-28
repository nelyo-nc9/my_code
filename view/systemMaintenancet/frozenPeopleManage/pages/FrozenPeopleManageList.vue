<template>
  <div class="frozen-manage-list-box">
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
      </div>
      <div class="main">
        <section style="text-align: center;margin:10px 0px;font-size:16px;">
          <b>冻结用户列表</b>
        </section>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button v-if="isBtn('解除冻结')" size="small" @click="restart" :disabled="locaArr.length === 0">解除冻结</el-button>
          <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
          <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        </div>
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { download } from '@src/common/download.js'

export default {
  name: 'FrozenPeopleManageList',
  data() {
    return {
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
      showSubOrg: false,
      selectData: [],
      pageSize: 25,
      page: 1,
      locaArr: [],
      flag: false
      // currentRowIndex:''
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      currentView: ({ frozenPeopleManage }) => frozenPeopleManage.currentView,
      currentTitle: ({ frozenPeopleManage }) => frozenPeopleManage.currentTitle
    })
  },
  created() {
    this.tableData = this.$store.state.frozenPeopleManage.tableData
    this.tableData = this.handleData(this.tableData)
    this.getTableList()
  },
  methods: {
    ...mapActions('frozenPeopleManage', ['setState', 'getList', 'setStatus']),
    ...mapActions('peopleManage', ['exportManage']),
    ...mapMutations('frozenPeopleManage', ['SET_STATE']),
    getTableList(obj = { pageSize: 25, page: 1, status: 1, sync: 1 }) {
      // 请求表格数据方法
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
        if (item.result && item.result) {
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
      let obj = { pageSize: this.pageSize, page: val, status: 1, sync: 1 }
      this.clearSelectData()
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.clearSelectData()
      this.handleCurrentPageNum(1)
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
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
        //  else if (status === '激活') {
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
          // console.log(arr)
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
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['用户名', '所属机构', '状态', '录入人', '录入机构', '录入时间']
      const filterVal = ['name', 'orgName', 'status', 'createdUserName', 'createdOrgName', 'createdAt']
      let list = []
      if (this.locaArr && this.locaArr.length > 0) {
        list = this.locaArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '冻结用户列表')
      } else {
        let obj = {status: 1, sync: 1 }
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
            let name = `冻结用户列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
      let arr = this.$lodash.cloneDeep(this.columns)
      list.forEach(item => {
        arr.forEach(atm => {
          if (item[atm.prop]) {
            item[atm.prop] = item[atm.prop] === '' ? '   ' : item[atm.prop]
          } else {
            item[atm.prop] = '      '
          }
        })
      })
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
        header: '<p class="custom">冻结用户管理列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.frozen-manage-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding: 5px 0px 5px 10px;
    .top {
      width: 100%;
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
    .main {
      width: 1377px;
      margin: 0 auto;
      height: calc(~'100% - 24px');
      .list-box-table {
        width: 1377px;
        margin-top: 10px;
        // width: 100%;
        overflow: auto;
        height: calc(~'100% - 124px');
        /deep/ .cell{
          height: 40px;
          vertical-align:middle;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
