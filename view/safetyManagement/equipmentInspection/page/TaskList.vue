
<!-- 设备巡检列表 -->
<template>
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
          <!-- 头部左 -->
          <div class="button-box">
            <el-button size="mini" @click="switchpage">新建</el-button>
            <el-button size="mini" @click="switchEditor" :disabled="selectData.length !== 1">编辑</el-button>
            <el-button size="mini" @click="switchView" :disabled="selectData.length !== 1">详情</el-button>
            <el-button size="mini" :disabled="selectData.length<1" @click="showConfirmDialog = true">删除</el-button>
            <el-button size="mini" @click="stopTask" :disabled="selectData.length !== 1">{{ isStatus === '停用' ? '启用' : '停用'}}</el-button>
            <el-button size="mini" @click="exportFile">导出</el-button>
            <el-button size="mini" @click="Toprint">打印</el-button>
          </div>
        </div>
        <div style="flex:1;" ref="tableBox">
          <el-table
            :data="tableData"
            stripe
            :height="'calc(78vh)'"
            @row-dblclick="showDetail"
            @selection-change="handleSelectionChange"
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
            style="text-align:center; margin-top:8px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[25, 50, 100, 200]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

        </div>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="showConfirmDialog"
      width="450px">
      <span>请确认是否删除当前选中巡检任务</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTasksList, isStopTask, removeTask } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'

import taskView from './taskView'

// import NewTaskVue from './NewTask.vue'

export default {
  components: {
    taskView
  },
  data() {
    return {
      isDisabled: true,
      // 获取列表需要参数
      queryInfo: {
        pagenum: 1,
        pagesize: 25
      },
      // 表格标题行内容
      tableColumn: [
        { prop: 'inspectName', label: '巡检计划名称', width: 'auto' },
        { prop: 'subSystemId', label: '子系统', width: '200' },
        { prop: 'deviceType', label: '设备类型', width: '200' },
        { prop: 'inspectPeriod', label: '巡检周期', width: '200' },
        { prop: 'inspectAt', label: '巡检时间', width: '200' },
        { prop: 'status', label: '状态', width: '150' },
        { prop: 'updatedBy', label: '录入人', width: '150' },
        { prop: 'updatedDept', label: '录入机构', width: '150' },
        { prop: 'updatedAt', label: '录入时间', width: '150' }
      ],
      // 表格数据
      tableData: [
      ],
      total: 0,
      // 选中项
      selectData: [],
      // 选中id
      isId: [],
      isStatus: '停用',
      // 控制显示于隐藏
      isShow: true,
      isCreate: true,
      titleNa: '新建',
      showConfirmDialog: false // 确认删除对话框显隐
    }
  },
  mounted() {
    this.tasksList()
  },

  methods: {
    stopTask() {
      if (this.selectData.length !== 1) { return }

      let params = {
        id: this.isId[0],
        status: this.isStatus === '启用' ? 2 : 1
      }
      isStopTask(params.id, params.status).then(res => {
        let result = res.data.data
        if (result.commonReply.msg) {
          this.$messageSuccess('启用成功')
          this.tasksList()
        } else {
          this.$messageError('启用失败')
        }
      })
    },

    //  获取巡检任务列表
    tasksList() {
      let params = {
        page: this.queryInfo.pagenum,
        limit: this.queryInfo.pagesize
      }
      getTasksList(params).then(res => {
        this.total = res.data.data.count.total
        res = res.data.data.tasks
        res.forEach(item => {
          item.subSystemId = ['', '视频', '报警', '门禁', '音频', '防护舱', '停车场', '电视墙'][item.subSystemId] + '子系统'
          item.deviceType = ['', 'NVR', 'HDVR', 'DVR', 'IPC'][item.deviceType] || ''
          item.status = ['', '启用', '停用', '未知'][item.status]
        })
        this.tableData = res
      })
    },
    // 选中的和选中的id
    handleSelectionChange(val) {
      this.selectData = val
      this.isId = this.selectData.map(item => item.id)
      this.isStatus = this.selectData.map(item => item.status)[0] || '停用'
    },
    // 新建
    switchpage() {
      // 传值
      // this.$emit('giveValue', '创建', true, {})
      // 跳转
      this.$parent.changeList('NewTask')
    },
    // 编辑
    switchEditor() {
      this.$emit('giveValue', '修改', true, this.selectData[0], this.isId[0])
      // this.$parent.changeList('NewTask')
    },
    // 详情
    switchView() {
      this.$emit('giveValue', '查看', false, this.selectData[0], this.isId[0])
      // this.$parent.changeList('NewTask')
    },
    // 导出功能
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '巡检计划名称',
        '子系统',
        '设备类型',
        '巡检周期',
        '巡检时间',
        '状态',
        '录入人',
        '录入机构',
        '录入时间'
      ]
      // 字段名
      const filterVal = [
        'inspectName',
        'subSystemId',
        'deviceType',
        'inspectPeriod',
        'inspectAt',
        'status',
        'updatedBy',
        'updatedDept',
        'updatedAt'
      ]
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
      return jsonData.map(v => filterVal.map(j => v[j]))
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
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'inspectName', displayName: '巡检计划名称' },
          { field: 'subSystemId', displayName: '子系统' },
          { field: 'deviceType', displayName: '设备类型' },
          { field: 'inspectPeriod', displayName: '巡检周期' },
          { field: 'inspectAt', displayName: '巡检时间' },
          { field: 'status', displayName: '状态' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
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
      this.queryInfo.pagesize = newSize
      this.tasksList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.tasksList()
    },
    // 删除用户
    removeUser() {
      removeTask({
        ids: this.isId
      }).then(res => {
        let result = res.data
        if (result.message) {
          this.tasksList()
          this.$messageSuccess('删除成功')
          this.showConfirmDialog = false
        } else {
          this.$messageError('删除失败')
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
