<template>
  <div class="emphasis-part-import">
    <!-- 重点部位-导出界面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>重点部位</el-breadcrumb-item>
            <el-breadcrumb-item>{{componentTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>导出</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-input v-model="localPath" class="button-box-input" size="small"></el-input>
          <el-upload class="button-box-upload" action="" :on-change="handleChange" accept=".csv,.xlsx,.xls">
            <el-button size="small" class="upload-button">预览</el-button>
          </el-upload>
          <el-button size="small">导入</el-button>
          <el-button size="small">导入模板</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="main-title"> <h3>已导入机构列表</h3></div>
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @row-dblclick="rowDbClick"
            height="100%"
            max-height="805"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns" :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :page-sizes="[25, 50, 100, 200]"
            :page-size.sync="limit"
            :current-page.sync="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Import',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
    keyPartType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      resizable: true,
      tableData: [],
      total: 0,
      localPath: '', // 文件导入路径
      page: 1,
      limit: 100
    }
  },
  created() {
  },
  methods: {
    sizeChange() { // 每页条数改变
      this.getTableList()
    },
    currentChange() { // 当前页改变
      this.getTableList()
    },
    getTableList() { // 请求表格数据方法
    },
    select() {
    },
    rowDbClick(row) {
    },
    handleChange(file, fileList) {
      console.log(file, fileList, 'file, fileList')
    }
  }
}
</script>

<style lang="less" scoped>
  .emphasis-part-import {
    width: 100%;
    height: 100%;
    .content {
      height: 100%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        flex-direction: column;
        .header {
          margin-bottom: 10px;
        }
        .button-box {
          display: flex;
          margin-bottom: 10px;
          .el-button {
            width: 80px;
          }
          .button-box-input {
            line-height: 35px;
            height: 35px;
            width: 250px;
          }
          .button-box-upload {
            margin-right: 30px;
          }
        }
      }
      .main {
        display: flex;
        flex-direction: column;
        height: calc(~'100% - 110px');
        .main-title {
          height: 60px;
          line-height: 60px;
        }
        .list-box-table {
          overflow: auto;
          // height: 620px;
          height: calc(~'100% - 10px');
        }
      }
      .footer{
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
</style>
