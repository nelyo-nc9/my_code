<template>
  <div class="role-manage-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box" style="padding:10px 0px;">
          <el-button v-if="isBtn('新建')" size="small" @click="create" icon="el-icon-plus">新建</el-button>
          <el-button v-if="isBtn('编辑')"
            size="small"
            @click="edit"
            icon="el-icon-edit-outline"
            :disabled="arr.length !== 1"
          >编辑</el-button>
          <el-button v-if="isBtn('删除')"
            size="small"
            @click="cancel"
            icon="el-icon-delete"
            :disabled="arr.length === 0"
          >删除</el-button>
          <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
          <el-button size="small" @click="print" icon="el-icon-printer">打印</el-button>
        </div>
        <!-- <div class="action-type">
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        </div>-->
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
  name: 'RoleManageList',
  data() {
    return {
      resizable: true,
      columns: [
        { prop: 'name', sortable: true, label: '角色名称', width: '200' },
        { prop: 'type', sortable: true, label: '角色类型', width: '200' },
        { prop: 'authorityAssignType', sortable: true, label: '权限分配方式', width: '240' },
        { prop: 'description', sortable: true, label: '备注', width: '200' }
      ],
      tableData: [],
      total: 0,
      currentOrgId: '',
      showSubOrg: false,
      paginationConfig: {},
      selectData: [],
      pageSize: 25,
      page: 1,
      currentFlag: false,
      arr: []
    }
  },
  computed: {
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      currentView: ({ roleManage }) => roleManage.currentView,
      currentTitle: ({ roleManage }) => roleManage.currentTitle
    })
  },
  created() {
    this.getTableList()
  },
  methods: {
    ...mapActions('roleManage', ['setState', 'getList', 'deleteRole', 'exportManage']),
    ...mapMutations('roleManage', ['SET_STATE']),
    // 请求列表数据
    getTableList(obj = { pageSize: 25, page: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.total = data.page.totalNumber
          if (data.roles.length > 0) {
            this.$messageSuccess('列表获取成功')
          }
          let arr = JSON.parse(JSON.stringify(data.roles))
          arr.forEach(item => {
            if (item.type === 1) {
              item.type = '正常授权'
            }
            if (item.type === 2) {
              item.type = '排除授权'
            }
            if (item.authorityAssignType === 1) {
              item.authorityAssignType = '按部位授权'
            }
            if (item.authorityAssignType === 2) {
              item.authorityAssignType = '按点位授权'
            }
          })
          this.tableData = arr.filter(item => item.type !== 3)
        }
      })
    },
    // 刷新表格
    refresh() {
      let obj = { pageSize: this.pageSize, page: 1 }
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
      this.setState({ type: 'SET_STATE', key: 'currentId', value: '1' })
      this.setState({ type: 'SET_STATE', key: 'resourceData', value: [] })
      this.setState({ type: 'SET_STATE', key: 'checkRigth', value: [] })
      this.setState({ type: 'SET_STATE', key: 'lastCheckOver', value: [] })
      this.setState({ type: 'SET_STATE', key: 'openKey', value: '' })
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
        let roleId = this.arr.map(item => {
          let { id } = item
          return id
        })
        this.deleteRole({ roleId }).then(res => {
          let { code } = res.data
          if (code === 0) {
            this.page = 1
            this.getTableList({ pageSize: this.pageSize, page: 1 })
          }
        })
      }
      return this.$message('删除')
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['角色名称', '角色类型', '权限分配方式', '备注']
      const filterVal = ['name', 'type', 'authorityAssignType', 'description']
      let list = []
      if (this.arr && this.arr.length > 0) {
        list = this.arr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '角色列表')
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
              let name = `角色列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
          { field: 'name', displayName: '角色名称' },
          { field: 'type', displayName: '角色类型' },
          { field: 'authorityAssignType', displayName: '权限分配方式' },
          { field: 'description', displayName: '备注' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">角色管理列表</p>',
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
    }
  }
}
</script>

<style lang="less" scoped>
.role-manage-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      // max-width: 1630px;
      margin: 0 auto;
      // height: 110px;
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
    .main {
      width: 972px;
      // margin: 0 auto;
      height: calc(~'100% - 80px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: calc(~'100% - 50px');
      }
      .main-footer {
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
