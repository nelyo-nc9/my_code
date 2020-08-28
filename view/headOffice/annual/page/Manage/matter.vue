<!--  -->
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
      <div class="btn">
        <el-button size="mini" icon="el-icon-printer" @click="Toprint('待审批考核事项')">打印</el-button>
        <el-button size="mini" icon="el-icon-download" @click="exportFile('待审批考核事项')">导出</el-button>
      </div>
      <div class="main">
        <div class="list-box-table">
          <el-table
            :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
            style="font-size: 12px;height:240px;"
            stripe
            border
            height="100%"
            max-height="345"
            :data="tableData"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" align="center" sortable></el-table-column>
            <el-table-column prop="orgName" label="所属机构" width="160" align="center" sortable></el-table-column>
            <el-table-column prop="proposer" label="申请人" width="100" align="center" sortable></el-table-column>
            <el-table-column prop="totalScore" label="考核总分数" width="140" align="center" sortable></el-table-column>
            <el-table-column prop="startTime" label="考核开始时间" width="150" align="center" sortable></el-table-column>
            <el-table-column prop="endTime" label="考核结束时间" width="150" align="center" sortable></el-table-column>
            <el-table-column prop="approver" label="上一级审批人" width="150" align="center" sortable></el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center" sortable></el-table-column>
            <el-table-column prop="operation" label="操作" width="200" align="center" sortable>
              <template slot-scope="scope" align="center">
                <el-button class="btn" size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                <el-button
                  class="btn2"
                  type="primary"
                  size="mini"
                  @click="Shen(scope.$index, scope.row)"
                >审批</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="录入时间" width="130" align="center" sortable></el-table-column>
            <el-table-column prop="updatedOrg" label="录入机构" width="130" align="center" sortable></el-table-column>
            <el-table-column prop="updatedAt" label="录入人" width="110" align="center" sortable></el-table-column>
          </el-table>
        </div>
        <div class="pagination-right-end">
          <el-pagination
            class="pagination"
            style="text-align:center;"
            :page-sizes="[25, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <examine v-if="isLook"></examine>
    <shenpi v-if="isShen" :typedata="typedata"></shenpi>
  </div>
</template>
<script>
import examine from './examine'
import shenpi from './shenpi'
import { headOfficeMixin } from '../../../commonjs/headOfficeMixin'

export default {
  mixins: [headOfficeMixin],
  name: '',
  components: {
    examine,
    shenpi
  },
  data() {
    return {
      topTitle: '待批审考核事项',
      isList: true,
      isLook: false,
      isShen: false,
      typedata: 'dpskh',
      tHeader: [
        '所属机构',
        '申请人',
        '考核总分',
        '考核开始时间',
        '考核结束时间',
        '上一级审批人',
        '状态',
        '录入时间',
        '录入机构',
        '录入人'
      ], //导出表头
      filterVal: [
        'orgName',
        'proposer',
        'totalScore',
        'startTime',
        'endTime',
        'approver',
        'status',
        'updatedTime',
        'updatedOrg',
        'updatedAt'
      ], //导出对应的字段
      properties: [
        { field: 'orgName', displayName: '所属机构' },
        { field: 'proposer', displayName: '申请人' },
        { field: 'totalScore', displayName: '考核总分' },
        { field: 'startTime', displayName: '考核开始时间' },
        { field: 'endTime', displayName: '考核结束时间' },
        { field: 'approver', displayName: '上一级审批人' },
        { field: 'status', displayName: '状态' },
        { field: 'updatedTime', displayName: '录入时间' },
        { field: 'updatedOrg', displayName: '录入机构' },
        { field: 'updatedAt', displayName: '录入人' }
      ], // 打印参数
      tableData: [
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          totalScore: '',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          status: '未提交',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          totalScore: '',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          status: '已提交',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          totalScore: '',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          status: '未审核',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          totalScore: '',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          status: '被退回',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          totalScore: '',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          status: '已审核',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        }
      ]
    }
  },
  methods: {
    handleEdit() {
      this.isList = false
      this.isLook = true
    },
    close() {
      this.isLook = false
      this.isList = true
      this.isShen = false
    },
    Shen() {
      this.isList = false
      this.isShen = true
      this.title = '考核自评审批'
    }
  },
  created() {
    this.$notify.warning({
      title: '提示',
      message: '有新的考核自评审批 请审批！'
    })
  },
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
/deep/.el-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2d72d3 !important;
  border-color: #2d72d3 !important;
}

/deep/.el-table .el-checkbox__inner::after {
  border: 1px solid #fff !important;
  border-top: none !important;
  border-left: none !important;
}
.serialNumberColor {
  color: #94163c;
}
.content {
  width: 100%;
  height: 100%;
  // overflow-y: auto;
  padding: 12px;
  .btn {
    width: 500px;
    height: 50px;
    margin-top: 30px;
    margin-left: 20px;
  }
  .main {
    width: 100%;
    overflow-y: auto;

    // overflow-x: scroll;
    height: calc(~'100% - 112px');
    .list-box-table {
      width: 100%;
      height: calc(~'100% - 40px');
      margin-top: 20px;
      .btn {
        width: 50px;
        height: 20px;
        margin-top: 5px;
        line-height: 7px;
        margin-left: -5px;
      }
      .btn2 {
        width: 50px;
        height: 20px;
        margin-top: 5px;
        margin-left: 10px;
        line-height: 7px;
      }
    }
  }
  // .pagination {
  //   // position: absolute;
  //   // top: 80%;
  //   // left: 50%;
  // }
  .pagination-right-end {
    margin-top: 10px;
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>