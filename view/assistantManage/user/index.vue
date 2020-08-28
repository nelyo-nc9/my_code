<template>
  <div class="assistantManageUser">
    <div class="assistantManageUserList"
         v-if="getUserListShowStatus">
      <div class="header">
        <div class="location">
          <i class="el-icon-location-outline"
             style="font-size: 16px"></i>
          <span>
            当前位置
          </span>
        </div>
        <div class="stopAssistantBtn">
          <el-button type="primary">结束协查</el-button>
        </div>
      </div>
      <div class="main">
        <el-table :data="tableData"
                  height="100%"
                  stripe
                  style="width: 100%"
                  header-row-class-name="tableStyle"
                  @selection-change="handleChange">
          <el-table-column width="55"
                           type="selection"
                           align="center">
          </el-table-column>
          <el-table-column prop="code"
                           label="序号"
                           type="index"
                           width="100"
                           align="center">
          </el-table-column>
          <el-table-column prop="eventName"
                           label="事件名称"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="eventCode"
                           label="事件编号"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="type"
                           label="协查类型"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="origin"
                           label="协查原因"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="startTime"
                           label="协查开始时间"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              {{getMyDate(scope.row.startTime*1000)}}
            </template>
          </el-table-column>
          <el-table-column prop="endTime"
                           label="协查结束时间"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              {{getMyDate(scope.row.endTime*1000)}}
            </template>
          </el-table-column>
          <el-table-column prop="assistanterName"
                           label="协查人姓名"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="status"
                           label="协查状态"
                           width="120"
                           align="center"
                           :formatter="(row, column, cellValue, index)=> cellValue==='1'?'处理中':'未开始'">
          </el-table-column>
          <el-table-column prop="backups"
                           label="备份进度"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="updatedBy"
                           label="录入人"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column prop="updatedAt"
                           label="录入时间"
                           width="120"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.assistantStatus==='1'">
                <el-link :underline="false"
                         @click="toUserAssistantChild(scope,'assistantPropress')">协查进展</el-link>
                <el-link :underline="false"
                         @click="toUserAssistantChild(scope,'startAssistant')">继续协查</el-link>
              </div>
              <div v-else>
                <el-link :underline="false"
                         @click="toUserAssistantChild(scope,'startAssistant')">开始协查</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-tooltip placement="top">
          <div slot="content">
            <h4>说明</h4>
            绿色：使用空间＜总空间的80%</br>
            黄色：使用空间≥总空间的80%，使用空间＜总空间的90%，</br>
            红色：使用空间≥总空间的90%</br>
          </div>
          <div class="videoStorage">
            录像存储空间：150GB/20000GB
          </div>
        </el-tooltip>
        <div class="pagination">
          <el-pagination :current-page="searchData.page"
                         :page-sizes="[5, 10, 15, 20]"
                         :page-size="searchData.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="searchData.total"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="assistantManageUserListChild"
         v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getTaskDetailsApi } from '../../../http/assistantManage/admin.api'
export default {
  name: 'assistantManageUser',
  data() {
    return {
      searchData: {
        page: 1,
        size: 10,
        total: 20
      },
      tableData: [],
      loading: true,
      selectData: []
    }
  },
  computed: {
    ...mapGetters('assistantManageMenu/user', ['getUserListShowStatus'])
  },
  mounted() {
    this.getListTable()
  },
  methods: {
    // 获取表格数据
    getListTable() {
      let getListObj = {
        skip: this.searchData.page,
        limit: this.searchData.size
      }
      getTaskDetailsApi(getListObj).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.tableData = res.data.data.data
          this.searchData.total = Number(res.data.data.total)
        }
      })
    },

    // 时间转化
    getMyDate(str) {
      var oDate = new Date(str)
      var oYear = oDate.getFullYear()
      var oMonth = oDate.getMonth() + 1
      var oDay = oDate.getDate()
      var oHour = oDate.getHours()
      var oMin = oDate.getMinutes()
      var oSen = oDate.getSeconds()
      var oTime =
        oYear +
        '-' +
        this.getzf(oMonth) +
        '-' +
        this.getzf(oDay) +
        ' ' +
        this.getzf(oHour) +
        ':' +
        this.getzf(oMin) +
        ':' +
        this.getzf(oSen) // 最后拼接时间
      return oTime
    },

    // 补0操作
    getzf(num) {
      if (parseInt(num) < 10) {
        num = '0' + num
      }
      return num
    },

    // 分页（修改数量）
    handleSizeChange(val) {
      this.searchData.page = 1
      this.searchData.size = val
      this.getListTable()
    },

    // 分页（修改页码）
    handleCurrentChange(val) {
      this.searchData.page = val
      this.getListTable()
    },

    // table页面选择
    handleChange(row) {
      this.selectData = row
    },
    ...mapMutations('assistantManageMenu/user', ['SET_USER_LIST_SHOW_STATUS']),
    toUserAssistantChild(scope, flag) {
      this.SET_USER_LIST_SHOW_STATUS(false)
      let params = {}
      params[flag] = scope.row.eventCode
      this.$router.push({ name: flag, params: params })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'assistantManageAuthority') {
        // 返回用户列表页
        this.SET_USER_LIST_SHOW_STATUS(true)
      } else {
        this.SET_USER_LIST_SHOW_STATUS(false)
      }
    }
  }
}
</script>

<style scoped  lang="less">
.assistantManageUser {
  display: flex;
  flex: auto;
  flex-direction: column;
  height: 100%;
  .assistantManageUserList {
    display: flex;
    flex-direction: column;
    flex: auto;
    height: 100%;
    .header {
      flex-basis: auto;
      height: 92px;
      .location {
        width: 100%;
        padding: 15px 0;
        .span {
          font-size: 14px;
          position: relative;
          top: -1px;
        }
      }
      .stopAssistantBtn {
        margin-bottom: 15px;
        .el-button {
          width: 70px;
          height: 30px;
          font-size: 12px;
          color: #000000;
          text-align: center;
          background-color: rgba(255, 255, 255, 1);
          border-color: rgba(22, 155, 213, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .main {
      height: calc(~'100% - 137px');
      /deep/ .el-table {
        .el-table__header-wrapper {
          font-size: 12px;
        }
        .el-table__body-wrapper {
          font-size: 12px;
          .el-link--inner {
            font-size: 12px;
          }
        }
      }
    }
    .footer {
      height: 45px;
      text-align: center;
      position: relative;
      .videoStorage {
        position: absolute;
        left: 5px;
        top: 17px;
      }
      .pagination {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .assistantManageUserListChild {
    display: flex;
    flex: auto;
  }
}
</style>
