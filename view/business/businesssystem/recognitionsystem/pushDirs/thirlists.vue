<template>
  <!-- 信访识别预警  -- 推送日志 -->

  <div>
    <!-- 导航 -->
    <div class="nav">
      <!-- 定位图标 -->
      <div class="location-icon float-left">
        <span class="el-icon-location-outline"></span>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
        <el-breadcrumb-item>信访识别预警</el-breadcrumb-item>
        <el-breadcrumb-item>推送日志</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 顶部导航 -->
    <div class="buttonsection">
      <el-row>
        <el-button @click="exportFile">导出</el-button>
        <el-button @click="Toprint">打印</el-button>
      </el-row>
    </div>

    <!-- 列表部分 -->
    <div class="list">
      <p>推送日志列表</p>

      <!-- 列表内容部分 -->
      <div class="list-container">
        <el-table
          ref="multipleTable"
          :data="pushStrategyLogList"
          :border="true"
          tooltip-effect="dark"
          style="width: 100%"
          height="500px"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            min-width="5%">
          </el-table-column>
          <el-table-column label="序号" type="index" prop="index" align="center" min-width="5%"></el-table-column>
          <el-table-column
            align="center"
            prop="orgName"
            label="所属机构"
            min-width="12%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="keyPartName"
            label="所属重点部位"
            min-width="12%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="resource"
            label="资源名称"
            min-width="12%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="pushObject"
            label="推送对象"
            min-width="12%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="time"
            label="抓拍时间"
            min-width="13%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="pushTime"
            label="推送时间"
            min-width="13%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="pushResult"
            label="推送结果"
           min-width="10%">
          </el-table-column>
          <el-table-column
            align="center"
            prop="path"
            label="查看"
           min-width="6%">
           <template slot-scope="scope">
             <!-- <el-button type="primary"  size="mini" style="height:25px;">查看</el-button> -->
             <el-image :src="scope.row.path" style="width: 20px; height: 20px" :preview-src-list="[scope.row.path]" ></el-image>
           </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.Page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

  </div>
</template>

<script>
import {
  getPetitionLogApi,
  setlogApi
} from '@src/http/businessLinkage/business.api.js'
export default {
  data() {
    return {
      total:0,
      multipleSelection:[],
      way:'',
      page: {
        Page: 1,
        PageSize: 100,
      },
      pushStrategyLogList: [],  // 信访识别预警 推送日志
    }
  },
  created() {
    this.getPetitionLog()
  },
  methods: {
    //获取列表
    getPetitionLog(){
      // let myName = JSON.parse(sessionStorage.getItem('user'))
      let params = {
        // orgId: myName.org,
        conditions: [],
        // updat: [],
        page: {
          Page: this.page.Page,
          PageSize: this.page.PageSize,
        },
      }
      getPetitionLogApi(params).then((res) => {
        console.log('总数',res)
        this.total = res.data.data.page.totalNumber
        // console.log(this.total)
        let result = res.data.data.petitionPushInfo 
        this.pushStrategyLogList = result
      })
    },
    //导出
    exportFile(){
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '资源名称',
        '推送对象',
        '抓拍时间',
        '推送时间',
        '推送结果'
      ]

      //字段名
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'resource',
        'pushObject',
        'time',
        'pushTime',
        'pushResult'
      ]
      let list = []
      //导出全部或导出选中
      if(this.multipleSelection && this.multipleSelection.length > 0){
        list=this.multipleSelection
      }else{
        list = this.pushStrategyLogList
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '推送日志列表')
      // let list = []
      // if (this.multipleSelection.length > 0) {
      //   list = this.multipleSelection
      // }
      // let ids = []
      // for (var i = 0; i < list.length; i++) {
      //   ids.push(list[i].id)
      // }
      // if(this.multipleSelection.length !== 0){
      //   let setexport = {
      //     id: ids,
      //   }
      //   setlogApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //   })
      // }
      // if(this.multipleSelection.length == 0){
      //   let setexport = {
      //     conditions: [
      //       {
      //         key: 'index',
      //         value: this.pushStrategyLogList.index,
      //         operator: 1,
      //       },
      //       {
      //         key: 'keyPartName',
      //         value: this.pushStrategyLogList.keyPartName,
      //         operator: 1,
      //       },
      //       {
      //         key: 'resource',
      //         value: this.pushStrategyLogList.resource,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushObject',
      //         value: this.pushStrategyLogList.pushObject,
      //         operator: 1,
      //       },
      //       {
      //         key: 'time',
      //         value: this.pushStrategyLogList.time,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushTime',
      //         value: this.pushStrategyLogList.pushTime,
      //         operator: 1,
      //       },
      //       {
      //         key: 'pushResult',
      //         value: this.pushStrategyLogList.pushResult,
      //         operator: 1,
      //       },
      //     ],
      //   }
      //   setlogApi(setexport).then((res) => {
      //     console.log(res.data.data)
      //     this.way = res.data.data
      //   })
      // }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange--",val);
      this.multipleSelection = val;
    },
    handleSizeChange(newsize) {
      this.page.PageSize = newsize
      console.log(`每页 ${newsize} 条`)
      this.getPetitionLog()
    },
    handleCurrentChange(newPage) {
      this.page.Page = newPage
      console.log(`当前页: ${newPage}`)
      this.getPetitionLog()
    },
    // jumpFirstPage () {
    //     this.$refs.pagination.handleCurrentChange(1);
    //     this.$emit('handleCurrentChange', 1);
    // },
    // jumpLastPage () {
    //     let font = this.$refs.pagination
    //     let cpage = Math.ceil(font.total / font.pageSize);
    //     font.handleCurrentChange(cpage);
    // },
    //打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.pushStrategyLogList
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'resource', displayName: '资源名称' },
          { field: 'pushObject', displayName: '推送对象' },
          { field: 'time', displayName: '抓拍时间' },
          { field: 'pushTime', displayName: '推送时间' },
          { field: 'pushResult', displayName: '推送结果' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">推送日志列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
        //内容样式
        gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
      })
    },
  },
}
</script>

<style scoped lang="less">
  .nav{
    width: 500px;
    padding-left: 20px;
    margin: 10px 0;
    i{
      float: left;
      margin-right: 5px;
    }
    el-breadcrumb{
      float: left;
    }
  }
  .buttonsection{
    margin: 14px 0 14px 20px;
  }
  .list{
    margin: 0 20px;
    // height: 500px;
    p{
      text-align: center;
      margin-top: -50px;
      margin-bottom: 30px;
    }
  }
  .pagination-wrap{
    text-align: center;
    padding: 14px 20px 20px;
    // display: flex;
    // justify-content: center;
    // .el-button:first-child{
    //   line-height: 12px;
    // }
  }
  .location-icon{
    font-size: 18px;
    float: left;
    margin-top:-4px;
  }
</style>