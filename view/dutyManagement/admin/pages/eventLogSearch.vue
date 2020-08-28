<!--
 * @Author: your name
 * @Date: 2020-06-08 15:43:29
 * @LastEditTime: 2020-06-09 09:55:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\eventLogSearch.vue
-->
<template>
  <div class="event-log">
      <div style="margin:10px 0 0 20px;">
        <div style="width:100%;">
          查询条件
          <i style="cursor: pointer;" @click="searchConditionsDis" :class="eventLogSearchConditionsIsShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="event-log-top" v-if="eventLogSearchConditionsIsShow">
        <p>事件记录查询</p>
        <div class="event-log-inquire">
            <div class="event-log-select">
                <ul>
                    <li>
                        <i>发起人</i>
                        <el-input v-model="formInline.username" placeholder="" size="mini"></el-input>
                    </li>
                    <li>
                        <i>资源信息</i>
                        <el-input v-model="formInline.channelName" placeholder="" size="mini"></el-input>
                    </li>
                    <li style="width:100%;">
                        <i>位置信息</i>
                        <el-input v-model="formInline.location" class="address" placeholder="" size="mini"></el-input>
                    </li>
                    <li>
                        <i>事件类型</i>
                        <el-select v-model="formInline.event" placeholder="" size="mini">
                            <el-option v-for="(item,index) in eventTypeArray" :key="index" :label="item.label" :value="item.value">{{item.label}}</el-option>
                        </el-select>
                    </li>
                    <li>
                        <i>关键字</i>
                        <el-input v-model="formInline.key" size="mini"></el-input>
                    </li>
                </ul>
            </div>
            <div class="event-log-btn">
                <el-button type="primary" icon="el-icon-search" @click="inquireClick" size="small">查询</el-button>
                <el-button @click="resetClick" size="small">重置</el-button>
            </div>
        </div>
      </div>
      <div style="margin:10px 0 10px 20px;">
        <div style="width:100%;">
          查询结果
          <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:100%">
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <div style="margin-bottom:20px;font-size:16px;">
            <el-button  size="small" @click="exportFile" :disabled="eventLogTableData.length === 0">导出</el-button>
            <el-button  size="small" icon="el-icon-printer" :disabled="eventLogTableData.length === 0" @click="print">打印</el-button>
            <el-button  size="small" icon="el-icon-delete" :disabled="selectData.length === 0" @click="eventLogDelete">删除</el-button>
          </div>
          <el-table stripe border size="medium" :data="eventLogTableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="385" max-height="385" style="width: 100%">
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
</template>

<script>
import { download } from '@src/common/download.js'
import { eventlogApi, deleteEventlogApi } from '@src/http/dutyManagement/dutyManagement.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  components: {
    VideoPagination
  },
  name: 'eventLogSearch',
  data() {
    return {
      eventLogSearchConditionsIsShow: true,
      // 事件记录数据
      eventLogTableData: [
      ],
      columns: [
        { prop: 'username', sortable: true, label: '发起人', width: '' },
        { prop: 'channelName', sortable: true, label: '资源信息', width: '' },
        { prop: 'location', sortable: true, label: '位置信息', width: '' },
        { prop: 'event', sortable: true, label: '事件类型', width: '' },
        { prop: 'desc', sortable: true, label: '事件描述', width: '' }
      ],
      selectData: [], // 选中数据
      obj: {},
      resizable: false,
      pageSize: 10,
      page: 1,
      total: 0,
      formInline: {
        username: '', // 发起人
        channelName: '', // 资源信息
        location: '', // 位置信息
        event: '全部',
        key: ''
      },
      // 检查动作
      eventTypeArray: [
        {value: '全部', label: '全部'},
        {value: '违规操作', label: '违规操作'},
        {value: '异常情况', label: '异常情况'},
        {value: '用户脱岗', label: '用户脱岗'},
        {value: '镜头异常', label: '镜头异常'},
        {value: '对讲异常', label: '对讲异常'}
      ],
      paginationConfig: {
        limit: 100,
        page: 1
      }
    }
  },
  created() {
  },
  methods: {
    // 分页组件方法
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },
    /**
     * @description:  事件记录查询按钮
     * @param {无}
     * @return: 无
     */
    inquireClick() {
      eventlogApi(this.formInline).then(res => {
        if (res.data.code === 0) {
          this.eventLogTableData = res.data.data.logs || []
          this.total = res.data.data.total || 0
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @description:  事件记录查询重置按钮
     * @param {无}
     * @return: 无
     */
    resetClick() {
      this.formInline = {
        username: '',
        channelName: '',
        location: '',
        event: '全部',
        key: ''
      }
    },
    /**
     * @description:  列表勾选
     * @param {无}
     * @return: 无
     */
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    /**
     * @description:  表格排序
     * @param {无}
     * @return: 无
     */
    sortChange(a) {
      console.log(a)
    },
    // 导出
    exportFile() {
      if (this.selectData.length === 0) {
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/daily/v1/duty/eventlog/explode`
        let name = `事件记录导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'get', '')
      } else {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        const tHeader = ['发起人', '资源信息', '位置信息', '事件类型', '事件描述']
        const filterVal = ['username', 'channelName', 'location', 'event', 'desc']
        const data = this.formatJson(filterVal, this.selectData)
        export_json_to_excel(tHeader, data, '事件记录列表')
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
        list = this.eventLogTableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'username', displayName: '发起人' },
          { field: 'channelName', displayName: '资源信息' },
          { field: 'location', displayName: '位置信息' },
          { field: 'event', displayName: '事件类型' },
          { field: 'desc', displayName: '事件描述' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">事件记录查询列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    /**
     * @description:  列表删除
     * @param {无}
     * @return: 无
     */
    eventLogDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        this.selectData.forEach(item => {
          ids.push(item.id)
        })
        let param = {
          ids: ids.join(',')
        }
        this.deleteEventlogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteEventlogApiFuc(ids) {
      deleteEventlogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.eventlogApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @description:  控制查询条件的显隐
     * @param {无}
     * @return: 无
     */
    searchConditionsDis() {
      this.eventLogSearchConditionsIsShow = !this.eventLogSearchConditionsIsShow
    }
  }
}
</script>

<style scoped lang="less">
.event-log {
  padding: 5px;
  height: 100%;
  overflow: hidden;
  .event-log-top {
    width: 870px;
    margin: 0 auto;
    p {
      padding: 10px 0;
      font-size: 16px;
      text-align:center;
    }
  }
  .main {
    width: 100%;
    height: 67%;
    margin: 20px 0 0 10px;
    .list-box-table {
      width: 100%;
      overflow: auto;
      height: 100%;
    }
    .main-footer {
      height: 40px;
      width: 500px;
      margin: 0 auto;
      // display: flex;
      // justify-content: center;
      // align-items: flex-end;
    }
  }
  .host-header {
    margin-bottom: 15px;
  }
  .event-log-inquire {
    margin: 10px 0;
    .event-log-select {
      width: 866px;
      overflow: hidden;
      border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
        margin: 10px;
        li {
          float: left;
          width: 420px;
          margin: 0 2px 2px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 136px;
            line-height: 32px;
            text-align: center;
            background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input:not(.address) {
            width: 270px!important;
            margin-top: 2px;
          }
          .el-input,[class="address"] {
            width: 692px!important;
            margin-top: 2px;
          }
          .el-select {
            width: 270px !important;
            margin-top: 2px;
          }
        }
      }
    }
    .event-log-btn {
      width: 866px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;
    i {
      float: left;
      width: 4%;
      font-size: 14px;
    }
    .zone-header-line {
      float: right;
      width: 96%;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
.event-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.event-log .el-form--inline .el-form-item__content {
  width: 200px !important;
}
</style>
