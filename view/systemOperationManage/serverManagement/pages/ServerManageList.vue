<!--
 * @Author: your name
 * @Date: 2020-06-17 15:49:39
 * @LastEditTime: 2020-06-17 16:26:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\ServerManageList.vue
-->
<template>
  <div class="server-manage-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-plus" @click="creat">新建</el-button>
          <el-button size="small" icon="el-icon-delete" :disabled="this.selectData.length === 0" @click="deleteServer">删除</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="this.selectData.length !== 1" @click="edit">编辑</el-button>
          <el-button size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
          <el-button size="small" :disabled="tableData.length === 0" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="100%" max-height="735" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
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
import Bus from './Bus'
import { download } from '@src/common/download.js'
import { deleteServerApi, getServerListApi } from '@src/http/systemOperationManage/serverManagement.api'
export default {
  props: {
    defaultMenu: {
      type: String
    }
  },
  name: 'ServerManageList',
  data() {
    return {
      columns: [
        { prop: 'orgName', sortable: true, label: '机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '重点部位', width: '' },
        { prop: 'serverName', sortable: true, label: '服务器名称', width: '' },
        { prop: 'system', sortable: true, label: '系统', width: '' },
        { prop: 'serverType', sortable: true, label: '类型', width: '' },
        { prop: 'onlineStatus', sortable: true, label: '状态', width: '' },
        { prop: 'ipAddr', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'username', sortable: true, label: '用户名', width: '' }
        // { prop: 'password', sortable: true, label: '密码', width: '' }
      ],
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      pageSize: 10,
      page: 1,
      flag: true
    }
  },
  computed: {
  },
  watch: {
    'total'(nval, oval) {
      if (nval !== 0) {
        this.flag = false
      } else {
        this.flag = true
      }
    }
  },
  created() {
    this.getServerListData()
  },
  methods: {
    // 获取服务器列表数据
    getServerListData() {
      let param = {
        page: this.page,
        limit: this.pageSize,
        hostIp: window.location.hostname
      }
      getServerListApi(param).then(res => {
        if (res.data.code === 0) {
          if (!Object.keys(res.data.data).length) {
            this.tableData = []
            return this.$messageError('暂无数据')
          }
          this.tableData = res.data.data.list || []
          this.total = res.data.data.pageData.totalNumber || 0
        } else {
          this.$messageError('查询列表失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(this.selectData, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.getServerListData()
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.getServerListData()
    },
    // 新建
    creat() {
      this.$emit('changeMenu', 'creat')
      Bus.$off() // 防止Bus传递过去的数据重复
      this.$nextTick(() => {
        Bus.$emit('creat', false)
      })
    },
    // 删除服务器按钮
    deleteServer() {
      this.$confirm('确认删除服务器吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delServerApi()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除服务器
    delServerApi() {
      let param = {
        ids: []
      }
      this.selectData.forEach(item => {
        param.ids.push(item.id)
      })
      deleteServerApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.getServerListData()
        } else {
          this.$messageError('删除失败')
        }
      })
        .catch(err => {
          this.$messageError('删除失败')
          console.log(err)
        })
    },
    // 编辑
    edit() {
      this.$emit('changeMenu', 'edit')
      Bus.$off() // 防止Bus传递过去的数据重复
      this.$nextTick(() => {
        Bus.$emit('edit', this.selectData, true)
      })
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    // 导出
    educe() {
      let param = {
        path: 'server.xlsx',
        hostIp: window.location.hostname
      }
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/systemOpsManager/v1/systemOpsManager/exportServerList`
        let name = `服务器列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', param)
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['机构', '重点部位', '服务器名称', '系统', '类型', '状态', 'IP地址', '端口', '用户名', '密码']
        const filterVal = ['orgName', 'keyPart', 'serverName', 'system', 'serverType', 'onlineStatus', 'ipAddr', 'port', 'username', 'password']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, `服务器列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '机构' },
          { field: 'keyPart', displayName: '重点部位' },
          { field: 'serverName', displayName: '服务器名称' },
          { field: 'system', displayName: '系统' },
          { field: 'serverType', displayName: '类型' },
          { field: 'onlineStatus', displayName: '状态' },
          { field: 'ipAddr', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'username', displayName: '用户名' },
          { field: 'password', displayName: '密码' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">服务器列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.server-manage-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 70px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
