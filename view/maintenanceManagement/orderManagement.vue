
<template>
    <div class="page">
      <div class="menuBox">
        <Menu  activeMenu='2-2' :isMenuShow='false'></Menu>
      </div>
      <div class="treeBox">
        <Tree></Tree>
      </div>
      <div class="formBox">
        <div class="titleBox">
          <Step secondTitle="工单管理" title="列表"></Step>
        </div>
        <div class="buttonBox">
          <el-button class="elBtn" size="small" icon="el-icon-plus" @click="gotoDetailForm('add')">新建</el-button>
          <el-button class="elBtn" size="small" icon="el-icon-edit-outline" @click="gotoDetailForm('reWrite', chooseID)">编辑</el-button>
          <el-button class="elBtn" size="small" icon="el-icon-check" @click="gotoDetailForm('check', chooseID)">确认</el-button>
          <el-button class="elBtn" size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFile">导出</el-button>
          <el-button class="elBtn" size="small" icon="el-icon-printer" @click="Toprint">打印</el-button>
        </div>
        <div class="refreshBox">
          <div class="butn">
            <el-checkbox v-model="checked">显示子机构</el-checkbox>
            <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
          </div>
          <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="treeValue" style="height:35px; width:300px"> </el-input>
        </div>
        <div class="tableBox">
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="序号" width="55" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderNumber" sortable label="工单号" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="belong" label="所属机构" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="belongPart" label="所属重点部位" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="belongPlatform" sortable label="所属平台" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="belongDevice" sortable label="所属设备" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="errorDevice" label="故障设备" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="foundTime" label="发现时间" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="finder" label="发现人" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="declareType" label="申报类型" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="declareReason" label="申报原因" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="number" label="维保合同编号" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="into" label="录入机构" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="intoName" label="录入人" width="120"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="intoTime" label="录入时间" width="120"  align="center" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
          </el-pagination>
      </div>
      </div>
    </div>
</template>

<script>
import Menu from './components/menu.vue'
import Step from './components/step.vue'
import Tree from './components/tree.vue'
// import { download } from '@src/common/download.js'

export default {
  name: '',
  components: {
    Menu,
    Tree,
    Step
  },
  data() {
    return {
      checked: false,
      currentPage: 2,
      chooseID: '',
      tableData: [
        {id: 1, orderNumber: '已完成', belongPlatform: '2016-05-03', belongDevice: '2016-05-03', errorDevice: '电视墙大屏改造', foundTime: '设备改造', finder: '四方达', declareType: '张三', declareReason: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, orderNumber: '已完成', belongPlatform: '2016-05-03', belongDevice: '2016-05-03', errorDevice: '电视墙大屏改造', foundTime: '设备改造', finder: '四方达', declareType: '张三', declareReason: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, orderNumber: '已完成', belongPlatform: '2016-05-03', belongDevice: '2016-05-03', errorDevice: '电视墙大屏改造', foundTime: '设备改造', finder: '四方达', declareType: '张三', declareReason: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, orderNumber: '已完成', belongPlatform: '2016-05-03', belongDevice: '2016-05-03', errorDevice: '电视墙大屏改造', foundTime: '设备改造', finder: '四方达', declareType: '张三', declareReason: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'}
      ],
      multipleSelection: []
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    gotoDetailForm(val, id) {
      if (val === 'add') {
        this.$router.push({name: 'detailForm'})
      } else {
        this.$router.push({name: 'detailForm', query: {flag: val, id: id}})
      }
    },
    refresh() {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    exportFile() { // 导出
      const { export_json_to_excel } = require('../../common/vendor/Export2Excel')
      const tHeader = ['序号', '工单号', '所属机构', '所属重点部位', '所属平台', '所属设备', '故障设备', '发现时间', '发现人', '申报类型', '申报原因', '维保合同编号', '录入机构', '录入人', '录入时间']
      const filterVal = ['id', 'orderNumber', 'belongPlatform', 'belongDevice', 'errorDevice', 'foundTime', 'finder', 'declareType', 'declareReason', 'belong', 'belongPart', 'number', 'remark', 'into', 'intoName', 'intoTime']
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let list = this.multipleSelection
        let data = list.map(v => filterVal.map(j => v[j]))
        data = data.map(item => this.formatt(item))
        export_json_to_excel(tHeader, data, `维保任务列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
        alert('未选中导出的列表数据')
        // let params = {
        //   pattern: 'list',
        //   status: this.status,
        //   orgId: this.currentOrgId,
        //   keyPartId: this.currentKeyPartId || '',
        //   rescusive: this.showSubOrg,
        //   key: this.keyword
        // }
        // // zp去掉url中间的/host
        // let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/download/host`
        // let name = `维保任务列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        // download(url, name, () => {}, () => { this.$message({type: 'error', message: '导出文件下载失败！'}) }, () => {}, 'post', params)
      }
    },
    Toprint() { // 打印
      // 判断打印全部还是选中
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      list = list.map(item => this.formatt(item))
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'id', displayName: '序号' },
          { field: 'orderNumber', displayName: '工单号' },
          { field: 'belong', displayName: '所属机构' },
          { field: 'belongPart', displayName: '所属重点部位' },
          { field: 'belongPlatform', displayName: '所属平台' },
          { field: 'belongDevice', displayName: '所属设备' },
          { field: 'errorDevice', displayName: '故障设备' },
          { field: 'foundTime', displayName: '发现时间' },
          { field: 'finder', displayName: '发现人' },
          { field: 'declareType', displayName: '申报类型' },
          { field: 'declareReason', displayName: '申报原因' },
          { field: 'number', displayName: '维保合同编号' },
          { field: 'into', displayName: '录入机构' },
          { field: 'intoName', displayName: '录入人' },
          { field: 'intoTime', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">视频主机列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:10px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:8px; text-align:center;'
      })
    },
    formatt(row) {
      let obj = {}
      for (let i in row) {
        if (i === 'status') {
          obj[i] = row[i] === 2 ? '在线' : '离线'
        }
        if (i === ('inputNumber' || 'outputNumber' || 'analogNumber' || 'audioNumber' || 'digitalNumber')) {
          obj[i] = row[i] === '' ? '0' : row[i]
        }
        if (i === 'type') {
          obj[i] = DEVICETYPE.filter(item => item.value === row[i])[0] ? DEVICETYPE.filter(item => item.value === row[i])[0].label : '  '
        }
        if (i === 'protocol') {
          obj[i] = TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0] ? TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0].label : '  '
        }
        if (i === 'brand') {
          obj[i] = BRANDS.filter(item => item.value === row[i])[0] ? BRANDS.filter(item => item.value === row[i])[0].label : '  '
        }
      }
      return Object.assign(row, obj)
    }
  },
  created() {

  }
}
</script>

<style lang="less" scoped>
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    .treeBox{
      height: 100%;
      background: #fff;
    }
    .formBox{
      margin:7px 0 0 7px;
      padding:17px 24px;
      background: #fff;
      width:100%;
      height:100%;
      .buttonBox{
        margin-top:20px;
        .elBtn{
          margin-right:20px;
          width:80px !important;
          height:35px !important;
        }
      }
      .refreshBox{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top:24px;
        /deep/ .el-button {
          padding: 0;
          color:rgba(51,51,51,1);
          font-size:14px;
        }
        /deep/ .el-button:hover{
          color: #2D72D3;
        }
      }
      .tableBox{
        margin-top:20px;
      }
      .pagination{
        margin-top:30px;
        width:100%;
        display: flex;
        margin-bottom:50px;
        justify-content: flex-end;
      }
    }
  }
</style>
