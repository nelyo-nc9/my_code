<!--
 * @Author: your name
 * @Date: 2020-07-02 16:23:12
 * @LastEditTime: 2020-07-02 20:45:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\messageControl\pages\MessageControlList.vue
-->
<template>
  <div class="message-control-list-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>短信管理</el-breadcrumb-item>
          <el-breadcrumb-item>短信列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div style="margin:15px 0;font-size:16px;">
          <el-button  size="small" icon="el-icon-plus" @click="creatMessage">新建</el-button>
          <el-button  size="small" icon="el-icon-delete" @click="deleteMessage" :disabled="selectData.length === 0">删除</el-button>
          <!-- <el-button  size="small" @click="sortMessage">排序</el-button> 暂时不做 -->
          <el-button size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="exportMessage">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
          <el-button  size="small" icon="el-icon-printer" @click="print">打印</el-button>
        </div>
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="690" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
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
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../../../videoManage/components/VideoPagination'
import { getShortMessageListApi, deleteShortMessageApi } from '@src/http/systemOperationManage/messageControl.api'
export default {
  name: 'MessageControlList',
  components: {
    VideoPagination
  },
  data() {
    return {
      resizable: false,
      columns: [
        { prop: 'receiver', sortable: true, label: '收件人', width: '' },
        { prop: 'content', sortable: true, label: '短信内容', width: '' },
        { prop: 'mode', sortable: true, label: '发送方式', width: '' },
        { prop: 'time', sortable: true, label: '发送时间', width: '' },
        { prop: 'status', sortable: true, label: '发送状态', width: '' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '' }
      ],
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
  created() {
    this.getSmsManagerListApiFuc()
  },
  methods: {
    // 获取短信列表
    getSmsManagerListApiFuc() {
      getShortMessageListApi(this.paginationConfig).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.smsList || []
          this.total = res.data.data.page.totalNumber || 0
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // handelData(list) {
    //   let arr = JSON.parse(JSON.stringify(list))
    //   arr.forEach(item => {
    //     item.mode = item.mode === 1 ? '立即发送' : '定时发送'
    //     item.time = this.$moment(Number(item.time)).format('YYYY-MM-DD HH:mm:ss')
    //     item.status = item.status === 1 ? '新建' : '已发送'
    //     item.receiver = item.receiver[0].receiver || ''
    //   })
    //   return arr
    // },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getSmsManagerListApiFuc()
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
    // 新建按钮
    creatMessage() {
      this.$emit('changeMenu', 'creat')
    },
    // 删除按钮
    deleteMessage() {
      this.$confirm('确认信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMessageFuc()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteMessageFuc() {
      let param = {
        ids: []
      }
      this.selectData.forEach(it => {
        param.ids.push(it.id)
      })
      deleteShortMessageApi(param).then(res => {
        if (res.data.code === 0) {
          this.getSmsManagerListApiFuc()
          this.$messageSuccess(res.data.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    sortMessage() {},
    // 导出
    exportMessage() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['收件人', '短信内容', '发送方式', '发送时间', '发送状态', '录入人', '录入机构', '录入时间']
      const filterVal = ['receiver', 'content', 'mode', 'time', 'status', 'updatedBy', 'updatedDept', 'createdAt']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '服务器列表')
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
          { field: 'receiver', displayName: '收件人' },
          { field: 'content', displayName: '短信内容' },
          { field: 'mode', displayName: '发送方式' },
          { field: 'time', displayName: '发送时间' },
          { field: 'status', displayName: '发送状态' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'createdAt', displayName: '录入时间' }
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
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/elementModify.less';
.message-control-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .directory {
      overflow: hidden;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 110px');
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
