<!-- 考核自评 -->
<template>
  <div class="content">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>总行本级安全管理</el-breadcrumb-item>
          <el-breadcrumb-item>年度考核</el-breadcrumb-item>
          <el-breadcrumb-item>考核管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.topTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
    </div>
    <div v-if="isList">
      <div class="button-top">
        <div class="button-left">
          <p class="button-left-p">所属机构</p>
          <el-input v-model="institutions" disabled></el-input>
          <p class="button-left-p">所属部门</p>
          <el-input v-model="department" disabled></el-input>
        </div>
        <div class="button-right">
          <el-button size="mini" icon="el-icon-download" @click="exportFile('考核自评表')">导出</el-button>
          <el-button size="mini" icon="el-icon-printer" @click="Toprint('考核自评表')">打印</el-button>
        </div>
      </div>
      <div class="main">
        <div class="list-box-table">
          <el-table
            :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
            style="font-size: 12px;"
            stripe
            border
            max-height="500"
            :data="tableData"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" align="center" sortable></el-table-column>
            <el-table-column prop="orgName" label="所属机构" align="center" sortable></el-table-column>
            <el-table-column prop="startTime" label="考核开始时间" align="center" sortable></el-table-column>
            <el-table-column prop="endTime" label="考核结束时间" align="center" sortable></el-table-column>
            <el-table-column prop="selfTime" label="考核自评时间" align="center" sortable></el-table-column>
            <el-table-column prop="operation" label="操作" align="center" sortable>
              <template slot-scope="scope">
                <el-button class="btn" size="mini" @click="handleEdit(scope.$index, scope.row)">考核自评</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="审批状态" width="120" align="center" sortable></el-table-column>
            <el-table-column prop="updatedTime" label="录入时间" width="150" align="center" sortable></el-table-column>
            <el-table-column prop="updatedOrg" label="录入机构" width="130" align="center" sortable></el-table-column>
            <el-table-column prop="updatedAt" label="录入人" width="110" align="center" sortable></el-table-column>
            <!-- <el-table-column :row-style="{height:'10px'}" 
                  style="font-size: 12px" 
                  v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
                  :sortable="column.sortable" show-overflow-tooltip align="center" :formatter="formatterTable">
            </el-table-column>-->
          </el-table>
        </div>
        <div class="pagination-right-end">
          <el-pagination
            class="pagination"
            style="text-align:center;"
            :page-size="25"
            :page-sizes="[10, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <divide v-if="isdiv"></divide>
  </div>
</template>
<script>
import divide from './divide'
import { headOfficeMixin } from '../../../commonjs/headOfficeMixin'
export default {
  mixins: [headOfficeMixin],
  name: '',
  components: {
    divide
  },
  data() {
    return {
      topTitle: '考核自评',
      institutions: '自动填充',
      department: '自动填充',
      isdiv: false,
      isList: true,
      tHeader: [
        '所属机构',
        '考核开始时间',
        '考核结束时间',
        '考核自评时间',
        '审批状态',
        '录入时间',
        '录入机构',
        '录入人'
      ], //导出表头
      filterVal: ['orgName', 'startTime', 'endTime', 'selfTime', 'status', 'updatedTime', 'updatedOrg', 'updatedAt'], //导出对应的字段
      properties: [
        { field: 'orgName', displayName: '所属机构' },
        { field: 'startTime', displayName: '考核开始时间' },
        { field: 'endTime', displayName: '考核结束时间' },
        { field: 'selfTime', displayName: '考核自评时间' },
        { field: 'status', displayName: '审批状态' },
        { field: 'updatedTime', displayName: '录入时间' },
        { field: 'updatedOrg', displayName: '录入机构' },
        { field: 'updatedAt', displayName: '录入人' }
      ], // 打印参数
      tableData: [
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '未提交',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '已提交',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '未审核',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '被退回',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '已审核',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '未提交',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '已提交',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '未审核',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '被退回',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          status: '已审核',
          operation: '',
          updatedTime: '2020-01-01 15:00:01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        }
      ]
    }
  },
  methods: {
    handleEdit(index, row) {
      this.isList = false
      this.isdiv = true
      this.topTitle = '考核自评得分'
    },
    close() {
      this.isList = true
      this.isdiv = false
    }
    // cellStyle(row, column, rowIndex, columnIndex) {
    //         if (row.column.label == "事件告警信息" || row.column.label == "性能告警信息"  ) {
    //             return "color:#FF747B";
    //         }
    //         if(row.column.label == "系统状态" && row.row.equStatus == "正常" ){
    //              return "color:#08AD2B";
    //         }
    //         if(row.column.label == "均衡状态" && row.row.equStatus == "正常" ){
    //              return "color:#08AD2B";
    //         }
    //     },
    // formatterTable(row, column, cellValue, index) {
    //   let params = ''
    //   let obj = {}
    //   switch (column.property) {
    //     case 'status':
    //       if(cellValue == 1){
    //         params = '已提交';

    //       }else if(cellValue == 2){
    //         params = '未提交';
    //       }else if(cellValue == 3){
    //         params = '已审批';
    //       }else if(cellValue == 4){
    //         params = '未审批'
    //       }else if(cellValue == 5){
    //         params = '被退回'

    //       }
    //       break
    //   }
    //   return params
    // },
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  .button-top {
    width: 900px;
    height: 50px;
    margin-top: 30px;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    .button-left {
      display: flex;
      flex-direction: row;
      width: 50%;
      height: 100%;
      p {
        width: 174px;
        height: 35px;
        margin-right: 10px;
        line-height: 35px;
      }
      /deep/.el-input__inner {
        width: 124px;
        height: 30px;
      }
    }
    .button-right {
      margin-left: 100px;
      /deep/.el-button {
        margin-right: 30px;
        // height: 30px;
        // width: 70px;
      }
    }
  }
  .main {
    width: 100%;
    height: calc(~'100% - 112px');
    .list-box-table {
      width: 100%;
      height: calc(~'100% - 40px');
      margin-top: 20px;
      .btn {
        height: 20px;
        margin-top: 5px;
        line-height: 7px;
      }
    }
  }
  .pagination-right-end {
    margin-top: 10px;
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>