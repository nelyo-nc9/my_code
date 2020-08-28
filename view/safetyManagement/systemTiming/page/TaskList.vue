<template>
<!-- ============================================列表页======================================================== -->
  <div class="content-page">
    <div v-if="isCreate" class="right-content">
      <div class="table-box">
        <div class="bread-crumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
            <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="table-top">
          <!-- 头部左aa -->
          <div class="button-box">
            <el-button size="mini" @click="switchpage">新建</el-button>
            <el-button
              size="mini"
              @click="switchEditor"
              :disabled="selectData.length>1||selectData.length==0"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="switchView"
              :disabled="selectData.length>1||selectData.length==0"
            >详情</el-button>
            <el-button size="mini" :disabled="selectData.length<1" @click="removeUser">删除</el-button>
            <el-button
              size="mini"
              @click="handleStatus"
              :disabled="selectData.length>1||selectData.length==0"
            >{{isStatus == 1 ? '启用': '停用'}}</el-button>
            <el-button size="mini" @click="exportFile">导出</el-button>
            <el-button size="mini" @click="Toprint">打印</el-button>
          </div>
        </div>
        <div style="flex:1;" ref="tableBox">
          <el-table
            :data="tableData"
            border
            size="mini"
            stripe
            :height="'calc(78vh)'"
            @row-dblclick="showDetail"
            @select="handleSelectionChange"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              :sortable="item.sortable"
              align="center"
            ></el-table-column>
          </el-table>
          <el-pagination
            style="text-align:center;"
            :page-sizes="[2, 50, 100, 200]"
            :page-size="pagesize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewlyBuildVue from './NewlyBuild.vue'
import {
  delCorrectingTask,
  putFlagCorrecting,
  getCorrectingTaskList
} from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'

export default {
  created() {
    this.tasksList()
    console.log(123)
  },
  data() {
    return {
      isDisabled: true,
      // 获取列表需要参数
      pagenum: 1,
      pagesize: 25,
      // 表格标题行内容
      tableColumn: [
        { prop: 'timingName', label: '校时任务', width: 'auto' },
        { prop: 'timingPeriod', label: '执行周期', width: 'auto' },
        { prop: 'status', label: '状态', width: 'auto' },
        { prop: 'updatedDept', label: '录入机构', width: 'auto' },
        { prop: 'updatedBy', label: '录入人', width: 'auto' },
        { prop: 'updatedAt', label: '录入时间', width: 'auto' }
      ],
      // 表格数据
      tableData: [],
      total: null,
      // 选中项
      selectData: [],
      // 选中id
      isId: [],
      // 选中的巡检状态
      isStatus: true,
      // 控制显示于隐藏
      isShow: true,
      isCreate: true,
      titleNa: '新建'
    }
  },
  // mounted() {
  //   this.seachEvent()
  // },
  methods: {
    // 获取列表
    tasksList() {
      let params = {
        page: this.pagenum,
        limit: this.pagesize
      }
      getCorrectingTaskList(params).then((res) => {
        let result = res.data
        console.log(result)
        if (result.message) {
          this.tableData = result.data.tasks
          this.total = result.data.count.total
          this.$messageSuccess('获取巡检任务列表成功')
        } else {
          this.$messageError('获取巡检任务列表失败')
        }
      })
    },
    // 选中的和选中的id
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
      this.isId = this.selectData.map((item) => item.id)
      this.isStatus = this.selectData.map((item) => item.status)[0]
    },
    // 新建
    switchpage() {
      // 传值
      this.$emit('giveValue', '创建', true, {})
      // 跳转
      this.$parent.changeList(NewlyBuildVue)
    },
    // 编辑
    switchEditor() {
      this.$emit('giveValue', '修改', true, this.selectData[0])
      this.$parent.changeList(NewlyBuildVue)
    },
    // 详情
    switchView() {
      this.$emit('giveValue', '查看', false, this.selectData[0])
      this.$parent.changeList(NewlyBuildVue)
      console.log(this.isId)
      console.log(this.selectData[0])
    },

    // 导出功能
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['校时任务', '执行周期', '状态', '录入机构', '录入人', '录入时间']
      // 字段名
      const filterVal = ['timingName', 'timingPeriod', 'status', 'updatedDept', 'updatedBy', 'updatedAt']
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    // 打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      console.log(list)
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'timingName', displayName: '校时任务' },
          { field: 'timingPeriod', displayName: '执行周期' },
          { field: 'status', displayName: '状态' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 双击显示
    showDetail() {},

    // 分页器方法
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.tasksList()
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.tasksList()
    },
    // 删除用户
    removeUser() {
      console.log('列表页的表头删除按钮')
      console.log(this.isId)
      delCorrectingTask({
        ids: this.isId
      }).then((result) => {
        console.log(result)
        // console.log(result.data)
        if (result.data.data.commonReply.msg === 'Ok') {
          this.$messageSuccess('删除成功')
          this.tasksList()
        } else {
          this.$messageError('删除失败')
        }
      })
    },
    // 启用停用
    handleStatus() {
      let params = {
        id: this.isId[0],
        status: this.isStatus === 'T' ? 2 : 1
      }
      putFlagCorrecting(params).then((res) => {
        let result = res.data
        // console.log(result)
        // console.log(params.status)
        if (result.data.commonReply.msg === 'success') {
          if (this.isStatus === 2) {
            this.$messageSuccess('已停用')
            // this.isStatus = 1
          } else {
            this.$messageSuccess('已启用')
            // this.isStatus = 2
          }
        } else {
          this.$messageError('切换失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      .bread-crumb {
        margin-top: 10px;
      }
      .table-top {
        display: flex;
        justify-content: space-between;
        align-content: center;
        box-sizing: border-box;
        .button-box {
          display: flex;
          align-items: center;
          margin: 10px 0;
          .el-checkbox {
            margin-left: 10px;
          }
          .count {
            margin-left: 200px;
            display: flex;
            span {
              margin: 0 10px;
              display: flex;
              align-items: center;
            }
            span:nth-child(1) {
              font-weight: 700;
            }
            span:nth-child(2) {
              color: green;
            }
            span:nth-child(4) {
              color: red;
            }
          }
        }
        div {
          display: flex;
          align-items: center;
          .from {
            width: 100px;
            margin-right: 10px;
            font-size: 13px;
          }
          .el-input {
            margin-right: 8px;
          }
          /deep/ .el-select {
            margin-right: 8px;
            .el-input {
              // height: 28px;
              .el-input__inner {
                height: 28px;
              }
              .el-input__suffix {
                height: 28px;
                .el-select__caret {
                  line-height: 28px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.form-content {
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  /* justify-content: space-between; */
  border: 1px solid #e1e1e1;
  /* margin-left: 60px; */
  justify-content: space-around;
  padding-top: 20px;
}
</style>
