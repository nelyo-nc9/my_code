<template>
  <div class="alarm-video">
    <el-dialog title="操作日志" :visible.sync="logStatus" width="60%" @close="close" :close-on-click-modal="false">
      <div class="alarm-opt-content">
        <el-table ref="multipleTable" :data="alarmOptLogData" style="width: 100%" height="340">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              <span v-if="item.prop === 'operateType'">{{ operateType[scope.row[item.prop]] }}</span>
              <span v-if="scope.row[item.prop] === 0 && item.prop === 'clientType'">全部</span>
              <span v-if="scope.row[item.prop] === 1 && item.prop === 'clientType'">B/S</span>
              <span v-if="scope.row[item.prop] === 2 && item.prop === 'clientType'">APP</span>
              <span v-if="item.prop !== 'clientType' && item.prop !== 'operateType'">{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize"
              :current-page="page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination> -->
        <video-pagination
          ref="listAlarmPagination"
          :total="total"
          :pageSizes="[10, 25, 50, 100]"
          :limitDefault="pageSize"
          @paginationConfChange="eventChange"
        ></video-pagination>
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
      ],
      operateType: {
        100000: '消防系统配置',
        100001: '系统部件管理',
        100002: '消防系统关联配置',
        100003: '系统部件关联配置',
        100004: '消防报警策略配置',
        100005: '消防报警等级及联动录像配置',
        100006: '消防报警联动配置的修改',
        100007: '报警紧急处置',
        100008: '视频复核',
        100009: '发送短信',
        1000010: '拒绝开门',
        1000011: '对讲开启',
        1000012: '对讲挂断',
        1000013: '报警输出'
      }
    }
  },
  watch: {},
  created() {
    this.logStatus = this.logControl
    // console.log('~~查看日志报警数据~~', this.optLogData)
    this.getLogData()
  },
  methods: {
    getLogData() {
      let alarmOptLog = {
        moduleType: 8, // 消防操作日志
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
