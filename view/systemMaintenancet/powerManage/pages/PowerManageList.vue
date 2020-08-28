<template>
  <div class="power-manage-list-box">
    <!-- <div class="content-left">
      <PowerTree></PowerTree>
    </div> -->
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
        <!-- 操作按钮 -->
        <div class="button-box">
          <!-- <el-button size="small" @click="look()">查看</el-button> -->
          <el-button size="small" v-if="isBtn('新建')" @click="create" icon="el-icon-plus">新建</el-button>
          <el-button size="small" v-if="isBtn('编辑')" @click="edit" icon="el-icon-edit-outline" :disabled="arr.length !== 1">编辑</el-button>
          <el-button size="small" v-if="isBtn('删除')" @click="cancel" icon="el-icon-delete" :disabled="arr.length === 0">删除</el-button>
          <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
          <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        </div>
        <div class="action-type">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
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
            @current-change="handleCurrentItem"
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { download } from '@src/common/download.js'
// import PowerTree from './PowerTree'
export default {
  name: 'PowerManageList',
  // components: {PowerTree},
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'userName', sortable: true, label: '用户名', width: '120' },
        { prop: 'name', sortable: true, label: '姓名', width: '100' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '120' },
        { prop: 'roleName', sortable: true, label: '角色', width: '180' },
        { prop: 'startTime', sortable: true, label: '生效日期', width: '120' },
        { prop: 'endTime', sortable: true, label: '失效日期', width: '120' },
        { prop: 'ip', sortable: true, label: 'Ip绑定地址', width: '160' },
        { prop: 'mac', sortable: true, label: 'MAC地址绑定', width: '180' },
        { prop: 'description', sortable: true, label: '备注', width: '150' },
        { prop: 'createUid', sortable: true, label: '录入人', width: '180' },
        { prop: 'createOrgId', sortable: true, label: '录入机构', width: '180' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '180' }
      ],
      tableData: [],
      total: 0,
      showSubOrg: true,
      selectData: [],
      pageSize: 25,
      page: 1,
      arr: []
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState('powerManage', ['currentView', 'currentTitle', 'orgId'])
  },
  created() {
    if (this.orgId) {
      this.getTableList()
    }
  },
  methods: {
    ...mapActions('powerManage', ['setState', 'getList', 'deletePower', 'exportManage']),
    ...mapMutations('powerManage', ['SET_STATE']),
    // ...mapMutations('fireOperationManagement', ['SET_NAV_NAME']),
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1, isChildren: this.showSubOrg ? 1 : 2, orgId: this.orgId }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
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
    // 刷新表格
    refresh() {
      let obj = { pageSize: this.pageSize, page: this.page, isChildren: this.showSubOrg ? 1 : 2, orgId: this.orgId }
      this.getTableList(obj)
    },
    select() {},
    rowDbClick(row) {
      console.log(row)
    },
    // 新建
    create() {
      // this.SET_NAV_NAME('peopleManage')
      // this.$router.push('/systemMaintenancet/basicInfo/peopleManage')
      this.setState({ type: 'SET_STATE', key: 'detailData', value: [] })
      this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
      this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PowerManageCreate' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
      this.setState({ type: 'SET_STATE', key: 'powerTitle', value: '新建' })
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
        this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PowerManageCreate' })
        this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '新建' })
        this.setState({ type: 'SET_STATE', key: 'powerTitle', value: '编辑' })
      }
    },
    // 删除
    cancel() {
      if (this.arr.length <= 0) {
        return this.$message('请勾选删除项')
      } else {
        let permissionId = this.arr.map(item => {
          let { id } = item
          return id
        })
        console.log(permissionId)
        this.deletePower({permissionId}).then(res => {
          let { code } = res.data
          if (code === 0) {
            this.page = 1
            this.getTableList({ pageSize: this.pageSize, page: 1, isChildren: this.showSubOrg ? 1 : 2, orgId: this.orgId })
          }
        })
      }
      return this.$message('删除')
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['用户名', '姓名', '所属机构', '角色', '生效日期', '失效日期', 'Ip绑定地址', 'MAC地址绑定', '备注', '录入人', '录入机构', '录入时间']
      const filterVal = ['userName', 'name', 'orgName', 'roleName', 'startTime', 'endTime', 'ip', 'mac', 'description', 'createUid', 'createOrgId', 'createdAt']
      let list = []
      if (this.arr && this.arr.length > 0) {
        list = this.arr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '权限列表')
      } else {
        let obj = {isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `权限列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
        header: '<p class="custom">权限管理列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:12px; text-align:center;color:#333 ',
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
      let obj = { pageSize: this.pageSize, page: val, isChildren: this.showSubOrg ? 1 : 2, orgId: this.orgId }
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
    }
  },
  watch: {
    showSubOrg() {
      this.getTableList()
    },
    orgId() {
      this.getTableList()
    }
  }
}
</script>

<style lang="less" scoped>
.power-manage-list-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // display: flex;
  // .content-left{
  //   width: 280px;
  //   flex-shrink: 0;
  //   height: 100%;margin-right: 20px;
  // }
  .content {
    // flex: 1;
    width: 100%;height: 100%;
    padding: 5px 0px 5px 10px;
    .top {
      width: 100%;
      height: 110px;
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
      width: 100%;
      height: calc(~'100% - 110px');
      .list-box-table {
        width: 100%;
        max-width: 1567px;
        overflow: auto;
        height: calc(~'100% - 40px');
        /deep/ .cell{
          height: 40px;
          vertical-align:middle;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .main-footer {
        max-width: 1567px;
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
