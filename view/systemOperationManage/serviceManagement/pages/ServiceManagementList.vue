<!--
 * @Author: your name
 * @Date: 2020-06-22 15:49:39
 * @LastEditTime: 2020-06-24 21:57:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serviceManagement\pages\ServiceManagementList.vue
-->
<template>
  <div class="service-management-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="selectData.length === 0" icon="el-icon-edit" @click="edit">编辑</el-button>
          <el-button size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="exportFile">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
          <el-button size="small" :disabled="tableData.length === 0" icon="el-icon-printer" @click="print">打印</el-button>
          <!-- <el-button size="small" :disabled="selectData.length === 0" @click="restartService">一键重启服务</el-button> -->
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="100%" max-height="750" style="width: 100%">
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
      <el-dialog title="修改服务名称" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="20%">
        <el-form :model="editForm">
          <el-form-item label="服务名称" label-width="80px">
            <el-input v-model="editForm.serviceName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Bus from '../Bus'
import { download } from '@src/common/download.js'
import { restartServiceApi, getServiceListApi, modifyService } from '@src/http/systemOperationManage/serviceManagement.api'
export default {
  props: {
    listParam: { // 请求服务列表参数
      type: Object,
      default: () => {}
    }
  },
  name: 'ServiceManagementList',
  data() {
    return {
      columns: [
        { prop: 'abbreviation', sortable: true, label: '简称', width: '' },
        { prop: 'serviceName', sortable: true, label: '服务名称', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'colony', sortable: true, label: '是否集群', width: '' },
        { prop: 'status', sortable: true, label: '状态', width: '' },
        { prop: 'serviceType', sortable: true, label: '服务类型', width: '' },
        { prop: 'serviceExplain', sortable: true, label: '服务说明', width: '' }
      ],
      dialogFormVisible: false,
      editForm: {
        serviceName: ''
      },
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      pageSize: 10,
      page: 1
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    Bus.$on('isSearch', (flag) => {
      if (flag) {
        this.getServiceListApiFuc()
      }
    })
  },
  created() {
  },
  methods: {
    // 编辑
    edit() {
      this.editForm.serviceName = this.selectData[0].serviceName
      this.dialogFormVisible = true
    },
    // 编辑服务确定按钮
    editSubmit() {
      if (this.editForm.serviceName === '') {
        return this.$messageWarn('服务名称不得为空')
      }
      let param = {
        serverId: this.selectData[0].serverId,
        ServiceName: this.editForm.serviceName,
        abbreviation: this.selectData[0].abbreviation,
        port: this.selectData[0].port
      }
      this.dialogFormVisible = false
      modifyService(param).then(res => {
        if (res.data.code === 0) {
          this.dialogFormVisible = false
          this.$messageSuccess(res.data.message)
          this.getServiceListApiFuc()
        }
      })
        .catch(err => {
          this.$messageError('编辑失败')
          console.log(err)
        })
    },
    // 查询服务列表
    getServiceListApiFuc() {
      let param = {
        ...this.listParam,
        page: this.page,
        limit: this.pageSize,
        hostIp: window.location.hostname
      }
      getServiceListApi(param).then(res => {
        if (res.data.code === 0) {
          this.tableData = this.handelData(res.data.data.list) || []
          this.total = res.data.data.pageData.totalNumber || 0
        }
      })
    },
    handelData(data) {
      let arr = JSON.parse(JSON.stringify(data || []))
      arr.forEach(item => {
        if (item.colony === 1) {
          item.colony = '是'
        } else if (item.colony === 2) {
          item.colony = '是'
        }
        if (item.status === 1) {
          item.status = '正常'
        } else if (item.status === 2) {
          item.status = '停用'
        }
      })
      return arr
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
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
          { field: 'abbreviation', displayName: '简称' },
          { field: 'serviceName', displayName: '服务名称' },
          { field: 'port', displayName: '端口' },
          { field: 'colony', displayName: '是否集群' },
          { field: 'status', displayName: '状态' },
          { field: 'serviceType', displayName: '服务类型' },
          { field: 'serviceExplain', displayName: '服务说明' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">服务列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile() {
      if (this.selectData.length === 0) {
        let param = {
          path: 'service.xlsx'
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/systemOpsManager/v1/systemOpsManager/ServiceManager/exportService`
        let name = `服务列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', param)
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['简称', '服务名称', '端口', '是否集群', '状态', '服务类型', '服务说明']
        const filterVal = ['abbreviation', 'serviceName', 'port', 'colony', 'status', 'serviceType', 'serviceExplain']
        const data = this.formatJson(filterVal, this.tableData)
        export_json_to_excel(tHeader, data, '服务列表')
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
    // 一键重启服务
    // restartService() {
    //   let param = { // 测试数据
    //     serverIp: '192.168.1.1',
    //     serverId: 1,
    //     serviceAbbr: []
    //   }
    //   this.selectData.forEach(item => {
    //     param.serviceAbbr.push(String(item.id))
    //   })
    //   restartServiceApi(param).then(res => {
    //     console.log(res)
    //     if (res.data.code === 0) {
    //       this.$messageSuccess('服务重启成功')
    //     }
    //   })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
  }
}
</script>

<style lang="less" scoped>
.service-management-list-box {
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
  /deep/.el-dialog__body {
    padding: 20px 20px;
  }
}
</style>
