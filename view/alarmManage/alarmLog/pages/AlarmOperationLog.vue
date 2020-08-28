<template>
  <div class="alarm-video">
    <el-dialog title='操作日志' :visible.sync="logStatus" width="60%" @close="close" :close-on-click-modal="false">
        <div class="alarm-opt-content">
          <el-table ref="multipleTable" :data="alarmOptLogData" style="width: 100%" height="340">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column show-overflow-tooltip v-for="(item,index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          </el-table>
          <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize"
              :current-page="page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination> -->
          <video-pagination ref="listAlarmPagination"
                  :total="total"
                  :pageSizes="[10, 25, 50, 100]"
                  :limitDefault="pageSize"
                  @paginationConfChange="eventChange"></video-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="sureLinkClick" size="small">关闭</el-button>
            <el-button @click="sureLinkClick" size="small">确定</el-button> -->
        </div>
    </el-dialog>
  </div>
</template>

<script>
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { getAlarmOperationLog } from '@src/http/alarm/alarmHostConfig.api.js'
export default {
  components: {
    VideoPagination
  },
  props: {
    logControl: {
      type: Boolean,
      default: false
    },
    optLogData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      pageSize: 25,
      page: 1,
      total: 0,
      logStatus: false,
      alarmOptLogData: [],
      tableColumn: [
        { prop: 'name', label: '姓名', width: '150', sortable: true },
        { prop: 'userName', label: '用户名', width: '150', sortable: true },
        { prop: 'createdAt', label: '时间', width: '150', sortable: true },
        { prop: 'orgName', label: '所属机构', width: '150', sortable: true },
        { prop: 'clientName', label: '客户端类型', width: '150', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '150', sortable: true },
        { prop: 'operateName', label: '操作类型', width: '150', sortable: true },
        { prop: 'action', label: '动作', width: '150', sortable: true },
        { prop: 'object', label: '操作对象', width: '150', sortable: true },
        { prop: 'result', label: '操作结果', width: '150', sortable: true },
        { prop: 'description', label: '操作描述', width: '200', sortable: true }
      ]
    }
  },
  watch: {},
  created() {
    this.logStatus = this.logControl
    console.log('~~查看日志报警数据~~', this.optLogData)
    this.getLogData()
  },
  methods: {
    getLogData() {
      let alarmOptLog = {
        moduleType: 2,
        userName: this.optLogData.dealPerson,
        startTime: this.optLogData.startTime,
        endTime: this.optLogData.dealTime
      }
      let pageArgs = {
        page: this.page,
        limit: this.pageSize
      }
      getAlarmOperationLog(alarmOptLog, pageArgs).then(res => {
        this.alarmOptLogData = []
        this.total = res.data.data.page.totalNumber
        this.alarmOptLogData = res.data.data.logs
      })
    },
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.getLogData()
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.getLogData()
    },
    // X条/页
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 确认关联控制
    sureLinkClick() {
      this.logStatus = false
      this.$emit('sureClick', false)
    },
    close() {
      this.$emit('sureClick', false)
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-opt-content {
  .el-pagination {
    float: right;
    margin: 10px 0;
  }
}
</style>
