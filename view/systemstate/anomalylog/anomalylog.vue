<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
        <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
        <el-breadcrumb-item>异常日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="table-box">
      <div class="box-title">
          <span class="pointer" @click="toggleOpen('searchCondition')">
            查询条件
            <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="query-anomaly" v-if="dropdownStatus.searchCondition"> 
          <div class="querycontent">
            <div class="left-query">
              <div>
                <label>所属机构</label>
                <el-input v-model="form.mechanismName" placeholder=""></el-input>
              </div>
              <div>
                <label>服务器名称</label>
                <el-input v-model="form.serverName" placeholder=""></el-input>
              </div>
              <div>
                <label>异常类型</label>
                <el-input v-model="form.abType" placeholder=""></el-input>
              </div>
            </div>
            <div class="center-query">
              <div>
                <label>异常内容</label>
                <el-input v-model="form.abContent" placeholder=""></el-input>
              </div>
              <div class="form-item">
                <label>异常时间</label>
                <span>
                  <el-date-picker
                    v-model="form.abTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                  <span>到</span>
                  <!-- <el-input v-model="form.abTime1" placeholder="请输入内容"></el-input> -->
                  <el-date-picker
                    v-model="form.abTime1"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                </span>
              </div>
              <div class="form-item">
                <label>处置时间</label>
                <span>
                  <!-- <el-input v-model="form.dealTime" placeholder="请输入内容"></el-input> -->
                  <el-date-picker
                    v-model="form.dealTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                  <span>到</span>
                  <!-- <el-input v-model="form.dealTime1" placeholder="请输入内容"></el-input> -->
                  <el-date-picker
                    v-model="form.dealTime1"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="">
                  </el-date-picker>
                </span>
              </div>              
            </div>
            <div class="right-query">
              <div>
                <label>是否通知</label>
                <el-select v-model="form.isNotice" placeholder="">
                  <el-option
                    v-for="item in isNotice"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div>
                <label>处理结果</label>
                <el-input v-model="form.dealResult" placeholder=""></el-input>
              </div>
              <div>
                <label>处理状态</label>
                <el-input v-model="form.dealState" placeholder=""></el-input>
              </div>
            </div>
          </div>
          <div class="footer-button">
            <el-button @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="exportFile">导出</el-button>
          </div>
        </div>
        <div class="query-results">
          <div>
            <div class="top-name">
              <span class="name">查询结果</span>
              <span class="border-span"></span>
            </div>
          </div>
          <div class="table-content" style="text-align:center;">
            <el-table :data="tableData.slice((page.Page-1)*page.PageSize, page.Page * page.PageSize)" @selection-change="handleSelectionChange" border size="mini" stripe height='520px' style="text-align:center;">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" prop="index" label="序号"></el-table-column>
              <el-table-column v-for="item in column" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" :sortable="column.sortable" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- <el-pagination style="text-align:center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tableData?tableData.length:0"></el-pagination> -->
            <el-pagination
              ref="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.Page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="page.PageSize"
              layout="sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { getlogApi } from '@src/http/systemstate/anomaly.api.js'
export default {
  data() {
    return {
      // pagesize: 10,
      // currentPage: 1,
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      },
      form:{
        mechanismName:'',
        serverName:'',
        isNotice:'',
        abType:'',
        abContent:'',
        // time2:'',
        abTime:'',
        abTime1:'',
        dealTime:'',
        dealTime1:'',
        dealResult:'',
        dealState:'',
      },
      page: {
        Page: 1,
        PageSize: 10,
      },
      total:0,
      column: [
        // 表格标题行内容
        { prop: 'mergeQuantity', sortable: true, label: '合并数量', width: '' },
        { prop: 'serverName', sortable: true, label: '服务器名称', width: '' },
        { prop: 'mechanismName', sortable: true, label: '所属机构', width: '' },
        { prop: 'abTime', sortable: true, label: '异常时间', width: '' },
        { prop: 'abType', sortable: true, label: '异常类型', width: '' },
        { prop: 'abContent', sortable: true, label: '异常内容', width: '' },
        { prop: 'dealState', sortable: true, label: '处理状态', width: '' },
        { prop: 'dealTime', sortable: true, label: '处理时间', width: '' },
        { prop: 'isNotice', sortable: true, label: '是否通知', width: '' },
        { prop: 'dealResult', sortable: true, label: '处理结果', width: '' },
        { prop: 'disposer', sortable: true, label: '处置人', width: '' },
      ],
      tableData: [
        // 列表数据
      ],
      // multipleSelection:[],
      isNotice:[
        {label: '是', value: '是'},
        {label: '否', value: '否'},
      ]
    }
  },
  methods: {
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    search(){
      var conditions = [];
      if(this.form.mechanismName){
        var mechanismName = {
             key:'mechanismName',
             value:this.form.mechanismName,
             operator:4
          };
          conditions.push(mechanismName)
      }
      if(this.form.serverName){
        var serverName = {
             key:'serverName',
             value:this.form.serverName,
             operator:4
          };
          conditions.push(serverName)
      }
      if(this.form.abType){
        var abType = {
             key:'abType',
             value:this.form.abType,
             operator:4
          };
          conditions.push(abType)
      }
      if(this.form.abContent){
        var abContent = {
             key:'abContent',
             value:this.form.abContent,
             operator:4
          };
          conditions.push(abContent)
      }
      if(this.form.abTime){
        var abTime = {
             key:'abTime',
             value:this.form.abTime,
             operator:0
          };
          conditions.push(abTime)
      }
      if(this.form.abTime){
        var abTime1 = {
             key:'abTime',
             value:this.form.abTime1,
             operator:2
          };
          conditions.push(abTime1)
      }
      if(this.form.dealTime){
        var dealTime = {
             key:'deal_time',
             value:this.form.dealTime,
             operator:0
          }
          conditions.push(dealTime)
      }
      if(this.form.dealTime){
        var dealTime1 = {
             key:'deal_time',
             value:this.form.dealTime1,
             operator:2
          }
          conditions.push(dealTime1)
      }
      if(this.form.isNotice){
        var isNotice = {
             key:'is_notice',
             value:this.form.isNotice,
             operator:4
          };
          conditions.push(isNotice)
      }
      if(this.form.dealResult){
        var dealResult = {
             key:'deal_result',
             value:this.form.dealResult,
             operator:4
          };
          conditions.push(dealResult)
      }
      if(this.form.dealState){
        var dealState = {
             key:'dealState',
             value:this.form.dealState,
             operator:1
          };
          conditions.push(dealState)
      }
      let params = {
        conditions:conditions,
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize,
        }
      }
      getlogApi(params).then(res => {
        console.log('查询',res)
        this.total = res.data.data.page.totalNumber
        let result = res.data.data.sysAbState
        result.map((item, index) => {
          if(item.isNotice == '1'){
            item.isNotice = '是'
          }else if(item.isNotice == '2'){
            item.isNotice = '否'
          }
        })
        console.log('列表', result)
        this.tableData = result
      }).catch((err) => {
         this.Error(err)
        // this.$notify.warning({
        //   title: '警告',
        //   message: '未查到数据'
        // })
      })
      // this.reset()
    },
    //重置
    reset(){
        this.form.mechanismName = ''
        this.form.serverName = ''
        this.form.isNotice = ''
        this.form.abType = ''
        this.form.abContent = ''
        // this.form.time2 = ''
        this.form.abTime = ''
        this.form.abTime1 = ''
        this.form.dealTime = ''
        this.form.dealTime1 = ''
        this.form.dealResult = ''
        this.form.dealState = ''
    },
    //导出
    exportFile(){
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '序号',
        '合并数量',
        '服务器名称',
        '所属机构',
        '异常时间',
        '异常类型',
        '异常内容',
        '处理状态',
        '处理时间',
        '是否通知',
        '处理结果',
        '处置人',
      ]

      //字段名
      const filterVal = [
        'index',
        'mergeQuantity',
        'serverName',
        'mechanismName',
        'abTime',
        'abType',
        'abContent',
        'dealState',
        'time',
        'isNotice',
        'dealResult',
        'disposer'
      ]
      let list = []
      //导出全部或导出选中
      if(this.multipleSelection && this.multipleSelection.length > 0){
        list=this.multipleSelection
      }else{
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '报警推送策略配置列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //选中
    handleSelectionChange(val) {
      console.log("handleSelectionChange--",val);
      this.multipleSelection = val;
    },
    handleSizeChange(newsize) {
      this.page.PageSize = newsize
      // this.pagesize = newsize
      console.log(`每页 ${newsize} 条`);
      this.search()

    },
    handleCurrentChange(newPage) {
      this.page.Page = newPage
      // this.currentPage = newPage
      console.log(`当前页: ${newPage}`);
      this.search()
      console.log(123);
    }
  },
}
</script>

<style scoped lang="less">
  .nav{
    font-size: 12px;
    width: 500px;
    padding-left: 20px;
    margin: 10px 0;
    // i{
    //   float: left;
    //   margin-right: 5px;
    // }
    i {
        display: inline-block;
        // cursor: pointer;
        // margin-top: 1px;
        font-size: 15px;
      }
    el-breadcrumb{
      float: left;
    }
  }
  .table-box {
      width: 100%;
      height: calc(~'100% - 34px');
      display: flex;
      flex-direction: column;
      padding: 0 20px;
      .top-name {
        display: flex;
        width: 100%;
        align-content: center;
        height: 19px;
        .name {
          color: #606266;
          font-size: 12px;
          width: 75px;
        }
        .border-span {
          height: 1px;
          width: calc(~'100% - 75px');
          background: #ccc;
          margin-top: 10px;
        }
      }
      .query-anomaly {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .footer-button {
          margin: 10px;
        }
      }
      .query-results {
        flex: 1;
        .table-content {
          height: calc(~'100% - 19px');
        }
        /deep/.el-table th>.cell{
          text-align: center;
        }
      }
    }
    .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    width: 100%;
    i {
      position: absolute;
      top: 50%;
      left: 55px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 100px;
      margin-top: -12px;
    }
  }
  .querycontent>div{
    display: flex;
    justify-content: space-between;
  }
  .querycontent{
    border: 1px solid #cccccc;
    .el-input{
      width: 290px;     
    }
    .el-select{
      width: 290px;
    }
    /deep/.el-input__inner {
      height: 30px;
      border-radius: 0px;
    }
    label {
      width: 140px;
      margin-left: 5px;
      background: #f1f1f1;
      display: inline-block;
      height: 30px;
      font-size: 13px;
      line-height: 30px;
      text-align: center;
    }
  }
  .form-item{
    .el-input{
      width: 135px;
    }
  }
</style>