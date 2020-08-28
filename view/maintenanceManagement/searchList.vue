
<template>
    <div class="page">
        <div class="menuBox">
            <Menu activeMenu='1-3' :isMenuShow='true'></Menu>
        </div>
        <div class="formBox">
            <div class="titleBox">
                <Step secondTitle="维保任务管理" title="查询"></Step>
            </div>
            <div class="detailForm">
                <button class="serchBtn" @click="openOrClose"><p class="searchTitle">查询条件</p><i :class=" flag ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></button>
                <div class="formNav" v-show="flag">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <div class="needFlex">
                            <el-form-item label="所属机构">
                                <el-input v-model="ruleForm.belong" style="width:230px"></el-input>
                            </el-form-item>
                            <el-form-item label="所属重点部位">
                                <el-input v-model="ruleForm.belongPart" style="width:230px"></el-input>
                            </el-form-item>
                            <el-form-item label="任务名称">
                                <el-input v-model="ruleForm.taskName" style="width:230px"></el-input>
                            </el-form-item>
                            <el-form-item label="任务类别">
                                <el-select v-model="ruleForm.taskType" placeholder="请选择任务类别" style="width:230px">
                                    <el-option label="区域一" value="shanghai" style="width:230px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:230px"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="needFlex">
                            <el-form-item label="维保单位">
                                <el-select v-model="ruleForm.company" placeholder="请选择维保单位" style="width:230px">
                                    <el-option label="区域一" value="shanghai" style="width:230px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:230px"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系人">
                                <el-select v-model="ruleForm.name" placeholder="请选择联系人" style="width:230px">
                                    <el-option label="区域一" value="shanghai" style="width:230px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:230px"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="维保合同编号">
                                <el-input v-model="ruleForm.number" style="width:230px" type="number" class="input"></el-input>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="ruleForm.status" placeholder="请选择状态" style="width:230px">
                                    <el-option label="区域一" value="shanghai" style="width:230px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:230px"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="needFlex">
                            <el-form-item label="开始日期">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startTime" style="width:230px" ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束日期">
                                <el-date-picker type="date" v-model="ruleForm.endTime" style="width:230px"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="录入机构">
                                <el-input v-model="ruleForm.intoCompany" style="width:230px"></el-input>
                            </el-form-item>
                            <el-form-item label="录入人">
                                <el-input v-model="ruleForm.intoPerson" style="width:230px"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="录入时间">
                            <el-date-picker v-model="ruleForm.intoTime"
                                type="daterange" align="right"
                                unlink-panels range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="btnBox" v-show="flag">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
                <el-button type="primary" @click="exportFile">导出</el-button>
            </div>
            <div class="listBox">
                <button class="serchBtn"><p class="searchTitle">查询结果</p></button>
                <div class="list">
                    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :default-sort = "{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="id" label="序号" width="55" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" sortable label="状态" width="80"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="startDate" sortable label="开始日期" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="endDate" sortable label="结束日期" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="taskName" label="任务名称" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="taskType" label="任务类别" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="company" label="维保单位" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="联系人" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="tel" label="联系电话" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="belong" label="所属机构" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="belongPart" label="所属重点部位" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="number" label="维保合同编号" width="120"  align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="remark" label="备注" width="120"  align="center" show-overflow-tooltip></el-table-column>
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
    </div>
</template>

<script>
import Step from './components/step.vue'
import Menu from './components/menu.vue'
export default {
  name: '',
  components: {
    Menu,
    Step
  },
  data() {
    return {
      currentPage: 2,
      flag: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      ruleForm: {
        taskName: '',
        belong: '',
        belongPart: '',
        taskType: '',
        name: '',
        status: '',
        company: '',
        startTime: '',
        endTime: '',
        number: '',
        intoCompany: '',
        intoPerson: '',
        intoTime: []
      },
      tableData: [
        {id: 1, status: '已完成', startDate: '2016-05-03', endDate: '2016-05-03', taskName: '电视墙大屏改造', taskType: '设备改造', company: '四方达', name: '张三', tel: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, status: '已完成', startDate: '2016-05-03', endDate: '2016-05-03', taskName: '电视墙大屏改造', taskType: '设备改造', company: '四方达', name: '张三', tel: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, status: '已完成', startDate: '2016-05-03', endDate: '2016-05-03', taskName: '电视墙大屏改造', taskType: '设备改造', company: '四方达', name: '张三', tel: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'},
        {id: 1, status: '已完成', startDate: '2016-05-03', endDate: '2016-05-03', taskName: '电视墙大屏改造', taskType: '设备改造', company: '四方达', name: '张三', tel: '13888888888', belong: '保定分行', belongPart: 'xx监控中心', number: '124532623512412', remark: '工期正常进行工期正常进行工期正常进行', into: '保定分行', intoName: '李四', intoTime: '2016-05-03'}
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openOrClose() {
      this.flag = !this.flag
    },
    search() {
      console.log('aaaa')
    },
    reset() {
      this.ruleForm.taskName = ''
      this.ruleForm.belong = ''
      this.ruleForm.belongPart = ''
      this.ruleForm.taskType = ''
      this.ruleForm.name = ''
      this.ruleForm.status = ''
      this.ruleForm.company = ''
      this.ruleForm.startTime = ''
      this.ruleForm.endTime = ''
      this.ruleForm.number = ''
      this.ruleForm.intoCompany = ''
      this.ruleForm.intoPerson = ''
      this.ruleForm.intoTime = []
    },
    exportThese() {
      console.log('aaaa')
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
    },
    exportFile() { // 导出
      const { export_json_to_excel } = require('../../common/vendor/Export2Excel')
      const tHeader = ['序号', '状态', '开始日期', '结束日期', '任务名称', '任务类别', '维保单位', '联系人', '联系电话', '所属机构', '所属重点部位', '维保合同编号', '备注', '录入机构', '录入人', '录入时间']
      const filterVal = ['id', 'status', 'startDate', 'endDate', 'taskName', 'taskType', 'company', 'name', 'tel', 'belong', 'belongPart', 'number', 'remark', 'into', 'intoName', 'intoTime']
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
    }
  },
  created() {

  }

}
</script>

<style lang="less" scoped>
    /deep/ input::-webkit-outer-spin-button, /deep/ input::-webkit-inner-spin-button{
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        -o-appearance: none !important;
        -ms-appearance: none !important;
        appearance: none !important;
        margin: 0;
    }
    /deep/ input[type="number"]{
        -webkit-appearance:textfield;
        -moz-appearance:textfield;
        -o-appearance:textfield;
        -ms-appearance:textfield;
        appearance:textfield;
    }
    .page {
        width: 100%;
        height: 100%;
        display: flex;
        .formBox{
            margin:7px 0 0 7px;
            padding:17px 24px;
            background: #fff;
            width:100%;
            height:100%;
        }
    }
    .detailForm{
        margin-top:30px;
        width:1440px;
        .serchBtn{
            border:none;
            background:none;
            padding:0;
            margin:0;
            outline: none;
            display: flex;
            align-items: center;
            position: relative;
            border-left:2px solid rgba(45,114,211,1);
            padding-left:5px;
            i{
                margin-left:5px;
            }
        }
        .serchBtn:hover{
            color:rgba(45,114,211,1);
        }
        .formNav{
            margin-top:15px;
            box-sizing: border-box;
            width:1360px;
            height:253px;
            background:rgba(245,245,245,1);
            padding:16px 0;
            .needFlex{
                display: flex;
            }
        }
    }
    .btnBox{
        margin:30px 0;
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 500px;
    }
    .listBox{
        margin-top:30px;
        .serchBtn{
            border:none;
            background:none;
            padding:0;
            margin:0;
            outline: none;
            display: flex;
            align-items: center;
            position: relative;
            border-left:2px solid rgba(45,114,211,1);
            padding-left:5px;
        }
        .list{
            margin:20px;
        }
        .pagination{
            width:100%;
            display: flex;
            margin-bottom:50px;
            justify-content: flex-end;
        }
    }
</style>
