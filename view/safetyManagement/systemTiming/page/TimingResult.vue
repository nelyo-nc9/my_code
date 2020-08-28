<template>
  <!-- ===================================================校时结果查询======================================================= -->
  <div class="page-content">
    <div class="top-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>系统校时</el-breadcrumb-item>
        <el-breadcrumb-item>校时任务</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="buttom-content">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            &nbsp;&nbsp;校时任务执行情况
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="isShow">
          <div ref="tableBox">
            <el-table
              :data="tableData"
              border
              size="mini"
              stripe
              :height="'calc(30vh - 29px)'"
              @row-dblclick="showDetail"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <!-- :formatter="formatterTable" -->
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
              style="text-align:right;margin-top:20px;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>

        <!--按设备 结果详情  -->

        <div class="box-title">
          <span class="pointer" @click="changeShow2">
            &nbsp;&nbsp;校时任务执行详情
            <i :class="isShow2? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>

        <div v-if="isShow2">
          <div class="top-inner">
            <div class="btn-left">
              <el-button
                :disabled="tableData2.length == 0"
                size="mini"
                plain
                @click="exportFile2"
              >导出</el-button>
              <el-button :disabled="tableData2.length == 0" size="mini" plain @click="Toprint2">打印</el-button>
              <!-- <el-checkbox :disabled="tableData2.length == 0" v-model="checked" style="margin-left:20px;">仅显示异常设备</el-checkbox> -->
            </div>
            <div class="inner-center">
              <div class="block">
                校时结果
                <el-select :disabled="tableData2.length == 0" v-model="value2" size="small">
                  <el-option value="3" label="全部"></el-option>
                  <el-option value="1" label="成功"></el-option>
                  <el-option value="2" label="失败"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div>
            <el-table
              :data="tableData2"
              border
              size="mini"
              stripe
              :height="isShow ?'calc(30vh - 29px)':'calc(67vh - 29px)'"
              @selection-change="handleSelectionChange2"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <!-- :formatter="formatterTable2" -->
              <el-table-column
                v-for="item in tableColumn2"
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
              style="text-align:right;margin-top:20px;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="pagesize2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total2"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resultCorrectList, resultCorrectInfos } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  components: {
  },
  data() {
    return {
      isShow: true,
      isShow2: true,
      isShow5: true,
      isShow6: true,
      // 日期
      value1: '',
      form: {

      },
      modalShow: true,

      sucTime: [], // 详情弹窗获取成功的时间
      sucData: [], // 详情弹窗获取成功的数据
      detailData: [], // 详情数据
      timeData: [], // 详情界面时间数据
      tableColumn: [
        // 表格1标题行内容
        {  prop: 'timingName', label: '校时任务', width: 'auto' },
        {  prop: 'implementDate', label: '执行日期', width: 'auto' },
        {  prop: 'implementResult', label: '执行结果', width: 'auto' },
        {  prop: 'deviceCount', label: '校时设备总数', width: 'auto' },
        {  prop: 'deviceFailCount', label: '校时失败数量', width: 'auto' },
      ],
      tableColumn2: [
        // 表格2标题行内容
        {  prop: 'subSystemId', label: '所属子系统', width: 'auto' },
        {  prop: 'orgId', label: '所属机构', width: 'auto' },
        {  prop: 'keyPartId', label: '所属重点部位', width: '120' },
        {  prop: 'deviceType', label: '设备类型', width: 'auto' },
        {  prop: 'deviceName', label: '设备名称', width: 'auto' },
        {  prop: 'resourceCode', label: '资源编码', width: 'auto' },
        {  prop: 'timing', label: '校时时间', width: 'auto' },
        {  prop: 'timingResult', label: '校时结果', width: 'auto' },
        {  prop: 'updatedBy', label: '录入人', width: 'auto' },
        {  prop: 'updatedDept', label: '录入机构', width: 'auto' },
        {  prop: 'updatedAt', label: '录入时间', with : 'auto' }
      ],
      tableData: [],
      tableData2: [],
      selectData: [],
      selectData2: [],

      // 分页项
      pagenum: 1,
      pagesize: 25,
      total: '',
      pagenum2: 1,
      pagesize2: 25,
      total2: '',

      // 下拉列表项
      value2: ''
    }
  },
  watch: {
    value2() {
      this.tasksList2()
    }
  },
  computed: {},
  created() {
    this.tasksList()
  },
  methods: {
    // 添加的分页的事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      let params = {
        page: 1,
        limit: val,
      }
      tasksList(params).then((res) => {
        console.log(res)
        this.tableData = res.data.data.infos
      })
    },
    handleCurrentChange(val) {
      // console.log(this.inquireForm.pagesize)
      let params = {
        page: val,
        limit: 25,
      }
      tasksList(params).then((res) => {
        console.log(res)
        this.tableData = res.data.data.infos
      })
      console.log(`当前页: ${val}`)
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    changeShow2() {
      this.isShow2 = !this.isShow2
    },
    showDetail(row, column, event) {
      this.tasksList2(row.id)
    },
    // 获取列表
    tasksList() {
      let params = {
        page: this.pagenum,
        limit: this.pagesize
      }
      resultCorrectList(params).then(res => {
        let result = res.data
        // debugger
        console.log(result, '牛皮')
        if (result.message) {
          this.tableData = result.data.taskResults
          this.total = result.data.count.total
          console.log(this.tableData)
          this.$messageSuccess('获取列表成功')
        } else {
          this.$messageError('获取列表失败')
        }
      })
    },
    // 获取列表2
    tasksList2(id) {
      let params = {
        page: this.pagenum2,
        limit: this.pagesize2,
        inspectResultId: id
      }
      console.log(this.value2)
      if (this.value2 !== '') {
        params['videoResult'] = this.value2
      }
      resultCorrectInfos(params).then(res => {
        let result = res.data
        console.log(result)
        if (result.message) {
          this.tableData2 = result.data.taskResults
          this.total2 = result.data.count.total
          this.$messageSuccess('获取列表成功')
        } else {
          this.$messageError('获取列表失败')
        }
      })
    },
    // 选中的和选中的id
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
      this.isId = this.selectData.map(item => item.id)
      this.isStatus = this.selectData.map(item => item.status)[0]
    },
    handleSelectionChange2(val) {
      console.log(val)
      this.selectData2 = val
    },
    // 导出功能
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['巡检计划名称', '执行日期', '执行时间', '执行结果', '巡检设备总数', '巡检异常总数']
      // 字段名
      const filterVal = ['inspectName', 'execDate', 'execTime', 'execResult', 'channelCount', 'abnormalChannelCount']
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
      console.log(111111)
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
          { field: 'inspectName', displayName: '巡检计划名称' },
          { field: 'execDate', displayName: '执行日期' },
          { field: 'execTime', displayName: '执行时间' },
          { field: 'execResult', displayName: '执行结果' },
          { field: 'channelCount', displayName: '巡检设备总数' },
          { field: 'abnormalChannelCount', displayName: '巡检异常总数' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
        // 内容样式
        gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
      })
    },
    // 导出2功能
    exportFile2() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属子系统',
        '所属机构',
        '所属重点部位',
        '设备类型',
        '设备名称',
        '资源编码',
        '校时时间',
        '校时结果',
        '录入人',
        '录入机构',
        '录入时间'
        ]
        /*
           { field: 'subSystemId', displayName: '所属子系统' },
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'deviceType', displayName: '设备类型' },
          { field: 'deviceName', displayName: '设备名称' },
          { field: 'resourceCode', displayName: '资源编码' },
          { field: 'timing', displayName: '校时时间' },
          { field: 'timingResult', displayName: '校时结果' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' }
        */
      // 字段名
      const filterVal = [
        'subSystemId',
        'orgId',
        'keyPartId',
        'deviceType',
        'deviceName',
        'resourceCode',
        'timing',
        'timingResult',
        'updatedBy',
        'updatedDept',
        'updatedAt'
        ]
      let list = []
      // 导出全部或导出选中
      if (this.selectData2 && this.selectData2.length > 0) {
        list = this.selectData2
      } else {
        list = this.tableData2
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    // 打印2方法
    Toprint2() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData2 && this.selectData2.length > 0) {
        list = this.selectData2
      } else {
        list = this.tableData2
      }
      console.log(list)
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'subSystemId', displayName: '所属子系统' },
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'deviceType', displayName: '设备类型' },
          { field: 'deviceName', displayName: '设备名称' },
          { field: 'resourceCode', displayName: '资源编码' },
          { field: 'timing', displayName: '校时时间' },
          { field: 'timingResult', displayName: '校时结果' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' }

        ],
        type: 'json',
        // 表题
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle: "border: 1px solid  lightgray;font-size:14px; text-align:center;color:#333 ",
        // 内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;",
      })
    },
    // formatterTable(row, column, cellValue, index) {
    //   let params = ''
    //   let obj = {}
    //   switch (column.property) {
    //     case 'abnormalChannelCount':
    //       params = cellValue ? 0 : cellValue
    //       break
    //       // params = obj[cellValue] || ''
    //       // break
    //     default:
    //       params = cellValue
    //       break
    //   }
    //   return params
    // },
    // formatterTable2(row, column, cellValue, index) {
    //   let params = ''
    //   let obj = {}
    //   switch (column.property) {
    //     case 'digitalNumber':
    //       params = cellValue === '' ? 0 : cellValue
    //       break
    //     case 'videoResult':
    //       obj = {
    //         1: '正常',
    //         2: '异常',
    //         3: '未知'
    //       }
    //       params = obj[cellValue] || ''
    //       break
    //     case 'videotapeResult':
    //       obj = {
    //         1: '正常',
    //         2: '异常',
    //         3: '未知'
    //       }
    //       params = obj[cellValue] || ''
    //       break
    //     default:
    //       params = cellValue
    //       break
    //   }
    //   return params
    // },
    // 分页器方法
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.tasksList()
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.tasksList()
    }
  }
}
</script>

<style lang="less" scoped>
.page-content {
  height: calc(100% - 10px);
  width: 100%;
  .top-content {
    height: 100%;
    width: 100%;
    .el-breadcrumb {
      margin-top: 10px;
      margin-left: 10px;
    }
    .buttom-content {
      // margin-left: 10px;
      margin: 10px 24px 0 24px;
      .top-inner {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .btn-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .inner-center {
          display: flex;
          align-items: center;
          justify-content: center;
          .inner-right {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 0 0 50px;
            span {
              width: 80px;
            }
          }
        }
      }
    }
  }
  .details {
    margin-top: 10px;
    margin-left: 10px;
    // .el-breadcrumb {
    // }
    .details-btn {
      margin: 10px 0 0 0;
    }
    .content-info {
      margin-left: 200px;
      .table-content {
        .title-name {
          margin-left: 360px;
        }
        .form-content {
          border: 1px solid #e1e1e1;
          width: 800px;
          box-sizing: border-box;
          margin-left: 120px;
          .form-inner {
            width: 100%;
            height: 30px;
            margin: 2px;
            .form-item {
              width: 50%;
              height: 100%;
              // span {
              //   box-sizing: border-box;
              //   height: 26px;
              //   line-height: 26px;
              // }
              .bg-c {
                display: inline-block;
                width: 120px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: #e1e1e1;
              }
              span {
                display: inline-block;
                width: 270px;
                text-align: center;
                font-size: 12px;
              }
              .el-input {
                width: 270px;
                height: 30px;
              }
              .el-select {
                width: 270px;
                height: 30px;
              }
              .el-checkbox-group {
                display: inline-block;
                width: 270px;
                height: 30px;
              }
            }
          }
        }
      }
    }
  }
}
.el-divider--horizontal {
  margin: 18px 0;
}
.box-title {
  margin: 0 0 8px 0;
  .pointer {
    border-left: 3px solid #2d72d3;
  }
}
/deep/.el-tabs {
  box-sizing: border-box;
  .is-active {
    border-top: 2px solid #2d72d3;
  }
}
/deep/.el-checkbox-group {
  margin-left: 6px;
  .el-checkbox {
    margin-right: 10px;
    .el-checkbox__label {
      padding-left: 4px;
    }
  }
}
.online-detail {
  width: 70%;
}
</style>
