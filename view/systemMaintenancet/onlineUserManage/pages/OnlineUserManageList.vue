<template>
  <div class="onlineUser-manage-list-box">
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
        <!-- <div class="action-type">
          <el-button
            type="text"
            icon="el-icon-refresh-right"
            style="color:#333333;"
            @click="refresh"
          >刷新列表</el-button>
        </div>-->
      </div>
      <!-- 操作按钮 -->
      <div class="button-box">
        <el-button size="small" v-if="isBtn('强制下线')" @click="open" :disabled="arr.length <= 0">强制下线</el-button>
        <!-- <el-button size="small" @click="edit">编辑</el-button>
        <el-button size="small" @click="cancel">删除</el-button>-->
        <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
        <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        <el-button size="small" @click="refresh" icon="el-icon-refresh">刷新</el-button>
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
            @current-change="handleCurrentItem"
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { download } from '@src/common/download.js'
export default {
  name: 'OnlineUserManageList',
  data() {
    return {
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
      currentOrgId: '',
      selectData: [],
      pageSize: 25,
      page: 1,
      currentFlag: false,
      arr: [],
      flag: false
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      currentView: ({ onlineUserManage }) => onlineUserManage.currentView,
      currentTitle: ({ onlineUserManage }) => onlineUserManage.currentTitle
    })
  },
  created() {
    this.getTableList()
  },
  methods: {
    ...mapActions('onlineUserManage', ['setState', 'getList', 'setOffline', 'exportManage']),
    ...mapMutations('onlineUserManage', ['SET_STATE']),
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        console.log(data)
        if (code === 0) {
          if (data) {
            this.total = data.page && data.page.totalNumber
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
    // 刷新表格
    refresh() {
      let obj = { pageSize: this.pageSize, page: this.page }
      this.getTableList(obj)
    },
    // 新建
    create() {
      this.setState({ type: 'SET_STATE', key: 'detailData', value: [] })
      this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
      this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'RoleManageCreate' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
      this.setState({ type: 'SET_STATE', key: 'roleTitle', value: '新建' })
    },
    // 编辑
    edit() {
      if (this.arr.length === 0) {
        return this.$message('请勾选编辑项')
      } else if (this.arr.length > 1) {
        return this.$message('不可批量编辑，请单选')
      } else {
        this.setState({ type: 'SET_STATE', key: 'detailData', value: this.arr })
        this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
        this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
        this.setState({ type: 'SET_STATE', key: 'currentView', value: 'RoleManageCreate' })
        this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
        this.setState({ type: 'SET_STATE', key: 'roleTitle', value: '编辑' })
      }
    },
    // 删除
    cancel() {
      console.log('111', this.arr)
      if (this.arr.length <= 0) {
        return this.$message('请勾选删除项')
      } else {
        let permissionId = this.arr.map(item => {
          let { id } = item
          return id
        })
        console.log(permissionId)
      }
      return this.$message('删除')
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['姓名', '登录用户', '所属机构', '用户IP', '登录类型', '登录时间', '登录时长']
      const filterVal = ['name', 'userName', 'orgName', 'ip', 'loginType', 'loginTime', 'timeLang']
      let list = []
      if (this.arr && this.arr.length > 0) {
        list = this.arr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '在线用户列表')
      } else {
        this.exportEduce()
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {}) {
      await this.exportManage(obj)
        .then(res => {
          // console.log(res)
          let { code, data } = res.data
          if (code === 0) {
            let fileName = data.fileName && data.fileName
            if (fileName) {
              let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
              let name = `在线用户列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
              download(
                url,
                name,
                () => {},
                () => {
                  this.$message({ type: 'info', message: '导出文件下载失败！' })
                }
              )
            }
          } else {
            throw res.data.message
          }
        })
        .catch(err => {
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
          { field: 'name', displayName: '姓名' },
          { field: 'userName', displayName: '登录用户' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'ip', displayName: '用户IP' },
          { field: 'loginType', displayName: '登录类型' },
          { field: 'loginTime', displayName: '登录时间' },
          { field: 'timeLang', displayName: '登录时长' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">在线用户管理列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:10px; text-align:center;'
      })
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.arr = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      let obj = { pageSize: this.pageSize, page: val }
      this.clearSelectData()
      this.getTableList(obj)
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.clearSelectData()
      this.handleCurrentPageNum(1)
    },
    // 列表当前项
    handleCurrentItem(val) {
      this.selectData = [val]
      console.log(val, this.selectData, '列表当前项')
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
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
      let m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
      result = `${h}:${m}:${s}`
      return result
    },
    // 强制下线
    open() {
      this.$prompt('', '请输入强制下线原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.flag = true
          let list = this.arr.map(item => {
            let { id } = item
            return { userId: id, message: value }
          })
          console.log(list)
          this.setOffline({ list }).then(res => {
            let { code, data } = res.data
            if (code === 0) {
              let arr = JSON.parse(JSON.stringify(this.tableData))
              arr.map(item => {
                data.forEach(ctm => {
                  if (item.id === ctm.userId) {
                    item.status = ctm.status
                    return item
                  }
                })
              })
              this.tableData = this.handleData(arr)
            }
          })
          console.log(value)
          this.$message({
            type: 'success',
            message: '下线成功'
          })
        })
        .then(_ => {
          setTimeout(() => {
            this.flag = false
            this.page = 1
            this.getTableList({ pageSize: this.pageSize, page: 1 })
          }, 3000)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消下线'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.onlineUser-manage-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      // height: 70px;
      padding-bottom: 10px;
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
              color: #2d72d3;
            }
          }
        }
      }
    }
    .button-box {
      padding-bottom: 15px;
      max-width: 1662px;
      margin: 0 auto;
    }
    .main {
      width: 100%;
      max-width: 1662px;
      height: calc(~'100% - 85px');
      margin: 0 auto;
      .list-box-table {
        max-width: 1662px;
        width: 100%;
        overflow: auto;
        height: calc(~'100% - 40px');
        /deep/ .cell {
          height: 40px;
          vertical-align: middle;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .main-footer {
        max-width: 1662px;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2d72d3 !important;
          cursor: pointer;
          background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
