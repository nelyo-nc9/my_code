<template>
  <div>
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>协查管理</el-breadcrumb-item>
        <el-breadcrumb-item>协查事件</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 查询条件 -->
    <dropresult label="查询条件"
                _key="query"
                :show="tabShow.query"
                @changeDrop="changeDrop">
      <div class="content">
        <p class="header">协查事件查询</p>
        <el-card class="card"
                 shadow="hover">
          <el-form label-width="80px"
                   :model="form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="事件名称">
                  <el-input v-model="form.eventName"
                            class="input"
                            size="mini"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="事件编号">
                  <el-input v-model="form.eventCode"
                            class="input"
                            clearable
                            size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协查类型">
                  <el-radio-group v-model="form.type">
                    <el-radio label=1>行内协查</el-radio>
                    <el-radio label=0>行外协查</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协查原因">
                  <el-select v-model="form.origin"
                             placeholder="审计"
                             clearable
                             size="mini"
                             class="input">
                    <el-option v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间">
                  <el-date-picker v-model="form.startTime"
                                  type="date"
                                  clearable
                                  size="mini"
                                  placeholder="选择日期"
                                  class="input" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间">
                  <el-date-picker v-model="form.endTime"
                                  type="date"
                                  clearable
                                  size="mini"
                                  placeholder="选择日期"
                                  class="input" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="form.userName"
                            class="input"
                            clearable
                            size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协查进展">
                  <el-select v-model="form.status"
                             placeholder="全部"
                             class="input"
                             size="mini">
                    <el-option label="全部"
                               value="1"></el-option>
                    <el-option label="未开始"
                               value="2"></el-option>
                    <el-option label="处理中"
                               value="3"></el-option>
                    <el-option label="结束"
                               value="4"></el-option>
                    <el-option label="超时"
                               value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item class="query-button">
                  <el-button type="primary"
                             @click="onQuery">查询</el-button>
                  <el-button @click="resetForm">重置</el-button>
                  <el-button @click="cancel">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </dropresult>
    <!-- 查询结果 -->
    <dropresult label="查询结果"
                _key="result"
                :show="tabShow.result"
                @changeDrop="changeDrop">
      <!-- 按钮组 -->
      <div class="result-button">
        <el-button size="medium">导出</el-button>
        <el-button size="medium"
                   @click="handlerPrint">打印</el-button>
        <el-button size="medium"
                   @click="handlerDelete">删除</el-button>
      </div>
      <!-- 表格数据 -->
      <div class="query-list"
           id="qrCode">
        <el-table class="tables"
                  :data="tableSearchData"
                  stripe
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
        </el-table>
      </div>
    </dropresult>
  </div>
</template>
<script>
import dropresult from './dropResult'
import { mapState } from 'vuex'
import { searchTaskListApi } from '../../../http/assistantManage/admin.api'
export default {
  name: 'search',
  components: {
    dropresult
  },
  data() {
    return {
      form: {},
      options: [
        {
          value: 1,
          label: '审计'
        },
        {
          value: 2,
          label: '风险'
        },
        {
          value: 3,
          label: '内控'
        },
        {
          value: 4,
          label: '其他'
        }
      ],
      // 保存当前dropresult组件状态
      tabShow: {
        query: true,
        result: true
      },
      tableSearchData: [], // 表格数据
      selectDate: [] // 选中项列表
    }
  },
  computed: {
    ...mapState('assistantManageMenu/admin', ['listData'])
  },
  mounted() {
    this.getListTable({})
  },
  methods: {
    // 获取表格数据
    getListTable(form) {
      searchTaskListApi(form).then(res => {
        if (res.data.code === 0) {
          this.tableSearchData = res.data.data.data
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
    // 重置清空表单数据
    resetForm() {
      this.form = {}
    },
    onQuery() {
      this.getListTable(this.form)
    },
    // 触发条件下拉选择事件
    changeDrop({ _key, isShow }) {
      // tabShow动态添加属性
      this.$set(this.tabShow, _key, isShow)
    },
    // 取消跳转列表
    cancel() {
      this.$router.push({ path: `/centerDutyManagement/assistantManage/assistantManageAdmin/list` })
      this.$emit('cancel', 'list')
    },
    // 复选框选中时触发
    handleChange(row) {
      this.selectDate = row
    },
    // 删除
    handlerDelete() {
      if (this.selectDate.length !== 1) {
        return this.$message({
          type: 'warning',
          message: '至少选择一条数据'
        })
      } else {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
    },
    // 打印
    handlerPrint() {
      var newWin = window.open('') // 新打开一个空窗口
      var imageToPrint = document.getElementById('qrCode') // 将要被打印的图片
      newWin.document.write(imageToPrint.outerHTML) // 将图片添加进新的窗口
      setTimeout(function() {
        newWin.print() // 打印
        newWin.close() // 关闭窗口
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}
.content {
  .card {
    margin: 0 auto;
    width: 80%;
    margin-top: 20px;
    .input {
      width: 200px;
    }
  }
}
.query-button {
  text-align: center;
  /deep/ .el-form-item__content {
    margin: 0px !important;
    justify-content: center;
    display: flex;
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
.result-button {
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
.query-list {
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
</style>
