<template>
  <div class="assistant">
    <div class="header">
      <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>协查管理</el-breadcrumb-item>
          <el-breadcrumb-item>协查事件</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-button">
        <el-button size="medium"
                   @click="handlerSave">新增</el-button>
        <el-button size="medium"
                   @click="handlerEdit">修改</el-button>
        <el-button size="medium"
                   @click="handlerDelete">删除</el-button>
        <el-button size="medium"
                   @click="handlerRefresh">刷新</el-button>
        <el-button size="medium"
                   @click="handlerPrint">打印</el-button>
        <el-button size="medium"
                   @click="handlerExport">导出</el-button>
      </div>
    </div>
    <el-row class="center-table">
      <el-table class="tables"
                v-loading="loading"
                :data="tableData"
                stripe
                height='100%'
                style="width: 100%"
                @selection-change="handleChange">
        <el-table-column type="selection"
                         width="55" />
        <el-table-column type="index"
                         label="序号"
                         width="55"
                         align="center" />
        <el-table-column prop="eventName"
                         label="事件名称"
                         width="100"
                         align="center" />
        <el-table-column prop="eventCode"
                         label="事件编号"
                         width="120"
                         align="center" />
        <el-table-column prop="type"
                         label="协查类型"
                         align="center" />
        <el-table-column prop="origin"
                         label="协查原因"
                         align="center" />
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
        <el-table-column prop="user.userName"
                         label="协查人"
                         align="center" />
        <el-table-column prop="status"
                         label="协查状态"
                         align="center" />
        <el-table-column prop="progress"
                         label="备份进度"
                         align="center" />
        <el-table-column prop="updatedBy"
                         label="记录人"
                         width="120"
                         align="center" />
        <el-table-column prop="updatedAt"
                         label="记录时间"
                         width="200"
                         align="center" />
        <el-table-column prop="operation "
                         label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="backPlan(scope.row)"
                       size="small">协查进展</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
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
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getTaskDetailsApi, deleteTaskApi } from '../../../http/assistantManage/admin.api'
export default {
  name: 'assistantManageAdmin',
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
    ...mapState('assistantManageMenu/admin', ['listData', 'hardDiskStatus']),
    sign() {
      if (this.hardDiskStatus === '1') {
        return 'sign-yellow'
      }
      if (this.hardDiskStatus === '2') {
        return 'sign-red'
      }
      return 'sign-green'
    }
  },
  mounted() {
    this.getListTable()
  },
  methods: {
    ...mapMutations('assistantManageMenu/admin', ['SET_FORM_STATUS']),
    handlerSearch() {
      console.log(this.searchData)
    },

    // 获取表格数据
    getListTable() {
      let getListObj = {
        skip: this.searchData.page,
        limit: this.searchData.size
      }
      getTaskDetailsApi(getListObj).then(res => {
        console.log(res.data.data)
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

    handlerSave() {
      this.$router.push({ name: 'formData', params: {} })
      this.SET_FORM_STATUS(false)
    },

    backPlan(r) {
      this.$router.push({ name: 'formData' })
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

    // 数据编辑
    handlerEdit() {
      if (this.selectData.length !== 1) {
        return this.$message({
          message: '请选择一条数据进行编辑',
          type: 'warning'
        })
      }
      this.$router.push({ name: 'formData', params: this.selectData[0] })
      this.SET_FORM_STATUS(false)
    },

    // 数据删除
    handlerDelete() {
      if (this.selectData.length < 1) {
        return this.$message({
          message: '请选择一条数据进行删除',
          type: 'warning'
        })
      }
      deleteTaskApi(
        this.selectData.map(v => {
          return v.id
        })
      ).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getListTable()
        }
      })
    },

    // table页面选择
    handleChange(row) {
      this.selectData = row
    },

    // 刷新
    handlerRefresh() {
      this.searchData.page = 1
      this.getListTable()
    },

    // 打印
    handlerPrint() {},

    // 导出
    handlerExport() {}
  },
  created() {
    // setTimeout(() => {
    //   this.loading = false
    //   this.tableData = this.listData
    //   this.searchData.total = this.listData.length
    // }, 3000)
  }
}
</script>

<style lang="less" scoped>
.assistant {
  height: 100%;
  .header {
    .header-button {
      display: flex;
      padding: 20px 0px;
      /deep/ .el-button {
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
  .center-table {
    height: calc(~'100% - 129px');
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
.sign-green {
  color: green;
}
.sign-yellow {
  color: yellow;
}
.sign-red {
  color: red;
}
</style>
