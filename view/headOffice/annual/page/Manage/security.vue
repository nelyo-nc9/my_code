<!--  -->
<template>
  <div class="big-box">
    <div class="first-div-but">
      机构
      <el-button
        type="primary"
        icon="el-icon-refresh-right"
        :loading="refreshLoading"
        @click="refreshTree"
      ></el-button>
    </div>
    <div class="list-box">
      <orgTree
        class="orgTree-input"
        :lazyTreeApi="getAudioTreeApi"
        style="width:270px"
        :treeType="treeType"
        searchType="filter"
        treeLazyToggle
        iconToggle
        @onceClick="onceClick"
      ></orgTree>
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
        <div class="show" v-if="isList">
          <div class="btn">
            <el-button
              size="mini"
              style="width:70px;"
              icon="el-icon-edit-outline"
              @click="Toprint('总行安保部待复批考核事项')"
            >打印</el-button>
            <el-button
              size="mini"
              style="width:70px;"
              icon="el-icon-download"
              @click="exportFile('总行安保部待复批考核事项')"
            >导出</el-button>
          </div>
          <div class="main">
            <div class="list-box-table">
              <el-table
                :row-style="{height:'10px'}"
                :cell-style="{padding:'0px'}"
                style="font-size: 12px;height:446px;"
                stripe
                border
                height="100%"
                max-height="446"
                :data="tableData"
              >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="序号" type="index" width="50" align="center" sortable></el-table-column>
                <el-table-column prop="orgName" label="所属机构" width="140" align="center" sortable></el-table-column>
                <el-table-column prop="proposer" label="申请人" width="100" align="center" sortable></el-table-column>
                <el-table-column prop="orgName" label="考核总分数" width="150" align="center" sortable></el-table-column>
                <el-table-column
                  prop="startTime"
                  label="考核开始时间"
                  width="150"
                  align="center"
                  sortable
                ></el-table-column>
                <el-table-column prop="endTime" label="考核结束时间" width="150" align="center" sortable></el-table-column>
                <el-table-column prop="approver" label="上一级审批人" width="150" align="center" sortable></el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable></el-table-column>
                <el-table-column prop="operation" label="操作" width="130" align="center" sortable>
                  <template slot-scope="scope" align="center">
                    <el-button
                      class="btn2"
                      type="primary"
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)"
                    >复批</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="updatedTime"
                  label="录入时间"
                  width="110"
                  align="center"
                  sortable
                ></el-table-column>
                <el-table-column
                  prop="updatedOrg"
                  label="录入机构"
                  width="130"
                  align="center"
                  show-overflow-tooltip
                  stripe
                  sortable
                ></el-table-column>
                <el-table-column prop="updatedAt" label="录入人" width="100" align="center" sortable></el-table-column>
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
        <shenpi v-if="isShen" :typedata="typedata"></shenpi>
      </div>
    </div>
  </div>
</template>
<script>
import orgTree from '@src/components/tree/treeBox'
import { getAudioTreeApi } from '@src/http/audioManage/audioTree.api.js'
import { headOfficeMixin } from '../../../commonjs/headOfficeMixin'
import shenpi from './shenpi'
export default {
  name: '',
  mixins: [headOfficeMixin],
  components: {
    orgTree,
    shenpi
  },
  data() {
    return {
      topTitle: '总行安保部待复批考核事项',
      isList: true,
      isShen: false,
      treeType: 2,
      typedata: 'zhbab',
      refreshLoading: false,
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
        'operation',
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
        { field: 'operation', displayName: '考核总分' },
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
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          approver: '王小虎',
          selfTime: '2020-08-08',
          status: '未提交',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: '总行/成都开发中心',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          approver: '王小虎',
          status: '已提交',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: 'xxx分行',
          updatedAt: '二哥'
        },
        {
          orgName: '成都开发中心',
          proposer: '三哥',
          startTime: '2020-01-01',
          endTime: '2020-08-08',
          selfTime: '2020-08-08',
          approver: '王小虎',
          status: '未审核',
          operation: '',
          updatedTime: '2020-01-01',
          updatedOrg: 'xxx分行',
          updatedAt: '二哥'
        }
      ]
    }
  },
  methods: {
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },

    // 刷新
    refreshTree() {
      let that = this
      this.refreshLoading = true
      return getAudioTreeApi({ type: 2, oId: 340000000 }).then(res => {
        if (res.data.message == 'success') {
          that.refreshLoading = false
        }
      })
      // return getAudioTreeApi({ type: 2, oId: 340000000 })
    },

    onceClick() {},

    handleEdit() {
      this.isList = false
      this.isShen = true
      this.title = '考核自评复批'
    },

    close() {
      this.isList = true
      this.isShen = false
    }
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
/deep/.treeBox .tree {
  width: 270px;
}
/deep/.orgTree-input .el-input--mini .el-input__inner {
  width: 270px;
}
/deep/.el-tree {
  width: 270px;
}
/deep/.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0px;
}
.first-div-but {
  width: 270px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #f5f5f5;
  position: relative;
  margin-left: 4px;
  /deep/.el-button--primary {
    position: absolute;
    right: -4px;
    background: none;
    border: none;
  }
  /deep/ .el-icon-refresh-right:before {
    font-size: 20px;
    line-height: 12px;
    color: #333;
  }
  /deep/ .el-icon-loading:before {
    font-size: 20px;
    line-height: 12px;
    color: #333;
  }
  /deep/ .el-button.is-loading:before {
    background: none;
  }
}
.big-box {
  width: 100%;
  height: 100%;
}
.list-box {
  width: 100%;
  height: calc(~'100% - 35px');
  display: flex;
  .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 12px;
    margin-top: -35px;
  }
  .btn {
    width: 500px;
    height: 50px;
    margin-top: 30px;
    margin-left: 20px;
  }
  .main {
    width: 100%;
    height: calc(~'100% - 112px');
    .list-box-table {
      width: 100%;
      height: calc(~'100% - 40px');
      margin-top: 20px;
      .btn2 {
        width: 78px;
        height: 20px;
        margin-top: 5px;
        line-height: 7px;
      }
    }
  }
  // .pagination {
  //   position: absolute;
  //   top: 80%;
  //   left: 50%;
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