<!--
 * @Author: your name
 * @Date: 2020-08-03 10:49:39
 * @LastEditTime: 2020-08-03 16:26:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\storageServerManageList.vue
-->
<template>
  <div class="storage-server-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-delete" :disabled="this.selectData.length === 0" @click="deleteStoreServer">删除</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="this.selectData.length !== 1" @click="edit">编辑</el-button>
          <el-button size="small" icon="el-icon-refresh-left" :disabled="this.selectData.length === 0" @click="initialize">初始化</el-button>
          <el-button  size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
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
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="编辑存储服务器"
      :visible.sync="dialogVisible"
      width="400px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form :model="editForm">
        <el-form-item label="服务器名称*" label-width="100px">
          <el-input v-model="editForm.serverName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" label-width="100px">
          <el-input v-model="editForm.ipAddr" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="端口" label-width="100px">
          <el-input v-model="editForm.port" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="初始化存储服务器"
      :visible.sync="initDialogVisible"
      width="400px" :close-on-click-modal="false"
      :before-close="initFormhandleClose">
      <el-form :model="initForm">
        <el-form-item label="硬盘总容量" label-width="100px">
          <el-input v-model="initForm.totalSize" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="100px">
          <el-select v-model="initForm.videoType" style="width: 100%;">
            <el-option v-for="(item,index) in typeArray" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="initClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { download } from '@src/common/download.js'
import VideoPagination from '../../../videoManage/components/VideoPagination'
import { getStoreServerListApi,
  editorStoreServerApi,
  updateServerInfoApi,
  deleteServerApi } from '@src/http/systemOperationManage/serverManagement.api'
export default {
  components: {
    VideoPagination
  },
  props: {
  },
  name: 'storageServerManagementList',
  data() {
    return {
      dialogVisible: false,
      initDialogVisible: false,
      columns: [
        { prop: 'orgName', sortable: true, label: '机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '重点部位', width: '' },
        { prop: 'serverName', sortable: true, label: '服务器名称', width: '' },
        { prop: 'ipAddr', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'totalSize', sortable: true, label: '总容量', width: '' },
        { prop: 'freeSize', sortable: true, label: '剩余容量', width: '' },
        { prop: 'isInit', sortable: true, label: '服务器状态', width: '' },
        { prop: 'vedioType', sortable: true, label: '类型', width: '' }
      ],
      editForm: {
        serverName: '',
        ipAddr: '',
        port: ''
      },
      initForm: {
        videoType: 1
      },
      typeArray: [
        {value: 1, label: '报警录像'},
        {value: 2, label: '定时录像'}
      ],
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      paginationConfig: {
        limit: 100,
        page: 1
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getStoreServerListApiFuc()
  },
  methods: {
    // 获取存储服务器列表信息
    getStoreServerListApiFuc() {
      let param = {
        ...this.paginationConfig,
        hostIp: window.location.hostname
      }
      getStoreServerListApi(param).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list || []
          this.total = res.data.data.pageData ? res.data.data.pageData.totalNumber : 0
        } else {
          this.$messageError('获取列表失败')
        }
      })
        .catch(err => {
          this.$messageError('获取列表失败')
          console.log(err)
        })
    },
    // 删除服务器按钮
    deleteStoreServer() {
      this.$confirm('确认删除存储服务器吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delStoreServerApi()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除服务器
    delStoreServerApi() {
      let param = {
        ids: []
      }
      this.selectData.forEach(item => {
        param.ids.push(item.id)
      })
      deleteServerApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.getStoreServerListApiFuc()
        } else {
          this.$messageError('删除失败')
        }
      })
        .catch(err => {
          console.log(err)
          this.$messageError('删除失败')
        })
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getStoreServerListApiFuc()
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
    handleClose() {
      this.dialogVisible = false
    },
    dataFormat() {
      this.editForm = JSON.parse(JSON.stringify(this.selectData[0]))
      if (this.editForm.system === 'Linux') {
        this.editForm.system = 1
      } else if (this.editForm.system === 'Windows') {
        this.editForm.system = 2
      }
      if (this.editForm.serverType === '设备接入服务器') {
        this.editForm.serverType = 1
      } else if (this.editForm.serverType === '流媒体服务器') {
        this.editForm.serverType = 2
      } else if (this.editForm.serverType === '存储服务器') {
        this.editForm.serverType = 3
      } else if (this.editForm.serverType === 'RTSP协议转换服务器') {
        this.editForm.serverType = 4
      } else if (this.editForm.serverType === '国标向上接入服务器') {
        this.editForm.serverType = 5
      } else if (this.editForm.serverType === '前端回放转发服务器') {
        this.editForm.serverType = 6
      } else if (this.editForm.serverType === '模拟国标镜头服务器') {
        this.editForm.serverType = 7
      } else if (this.editForm.serverType === '国标向下接入服务器') {
        this.editForm.serverType = 8
      } else if (this.editForm.serverType === '报警事件处理服务器') {
        this.editForm.serverType = 9
      } else if (this.editForm.serverType === '通知管理服务器') {
        this.editForm.serverType = 10
      } else if (this.editForm.serverType === '对讲转发服务器') {
        this.editForm.serverType = 11
      }
      if (this.editForm.status === '在线') {
        this.editForm.onlineStatus = 1
      } else if (this.editForm.status === '离线') {
        this.editForm.onlineStatus = 2
      }
    },
    // 编辑
    edit() {
      this.dialogVisible = true
      this.editForm = JSON.parse(JSON.stringify(this.selectData[0]))
      this.dataFormat()
    },
    editClick() {
      if (this.editForm.serverName === '') {
        return this.$messageWarn('请填写服务器名称')
      }
      let param = {
        id: this.editForm.id,
        serverName: this.editForm.serverName,
        ipAddr: this.editForm.ipAddr,
        port: this.editForm.port,
        username: this.editForm.username,
        password: this.editForm.password,
        onlineStatus: this.editForm.onlineStatus,
        serverType: this.editForm.serverType,
        system: this.editForm.system
      }
      updateServerInfoApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(res.data.message)
          this.getStoreServerListApiFuc()
        } else {
          this.$messageError('编辑失败')
        }
      })
        .catch(err => {
          this.$messageError(err + '编辑失败')
        })
      this.dialogVisible = false
    },
    // 初始化
    initialize() {
      this.initDialogVisible = true
      this.initForm.totalSize = this.selectData[0].totalSize || 0
    },
    initClick() {
      let param = {
        ids: [],
        vedioType: this.initForm.videoType
      }
      this.selectData.forEach(item => {
        param.ids.push(item.id)
      })
      editorStoreServerApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('初始化成功')
          this.getStoreServerListApiFuc()
        } else {
          this.$messageError('初始化失败')
        }
      })
        .catch(err => {
          this.$messageError(err + '初始化失败')
        })
      this.initDialogVisible = false
    },
    initFormhandleClose() {
      this.initDialogVisible = false
    },
    // 导出
    educe() {
      let param = {
        hostIp: window.location.hostname,
        path: './storeServer.xlsx'
      }
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/systemOpsManager/v1/systemOpsManager/exportStoreServerList`
        let name = `存储服务器列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', param)
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['机构', '重点部位', '服务器名称', 'IP地址', '端口', '总容量', '剩余容量', '服务器状态', '类型']
        const filterVal = ['orgName', 'keyPart', 'serverName', 'ipAddr', 'port', 'totalSize', 'freeSize', 'isInit', 'vedioType']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '存储服务器列表')
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
          { field: 'ipAddr', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'totalCapacity', displayName: '总容量' },
          { field: 'excessCapacity', displayName: '剩余容量' },
          { field: 'serverStatus', displayName: '服务器状态' },
          { field: 'type', displayName: '类型' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">存储服务器列表</p>',
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
.storage-server-list-box {
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
.el-dialog__headerbtn {
  top: 15px;
}
.el-dialog__header {
  padding: 15px 20px 10px;
}
</style>
