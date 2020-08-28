<template>
  <div class="main">
    <div class="header" v-show="isShowPendingListInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>访客入园申请</el-breadcrumb-item>
        <el-breadcrumb-item>待审批列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowPendingListInfo==false">
      <el-button style="font-size:12px;" plain @click="exportFile('访客管理待审核列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('访客管理待审核列表')">打印</el-button>
    </div>
    <div v-show="isShowPendingListInfo==false">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="index" label="序号" min-width="30"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          show-overflow-tooltip
          sortable
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              @click="handleEdit(scope.row)"
              style="font-size:12px;margin-left:0;"
            >审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:center;"
        :page-sizes="[25, 50, 100, 200]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>

    <PendingListInfo v-show="isShowPendingListInfo==true" :isShowPendingListInfo.sync='isShowPendingListInfo'></PendingListInfo>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import PendingListInfo from './pendingInfo.vue'
export default {
  components: {
    PendingListInfo
  },
  data() {
    return {
      isShowPendingListInfo: false,
      tableData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          id: 1,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          id: 2,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          id: 3,
          orgName: '北京',
          keyPartName: 'haidian'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          id: 4,
          orgName: '北京',
          keyPartName: 'haidian'
        }
      ],
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '申请人', width: '', sortable: 'true' },
        { prop: 'date', label: '申请编号', width: '', sortable: 'true' },
        { prop: 'name', label: '所属部门', width: '', sortable: 'true' },
        { prop: 'name', label: '申请缘由', width: '', sortable: 'true' },
        { prop: 'date', label: '访客信息', width: '', sortable: 'true' },
        { prop: 'name', label: '入园时间', width: '', sortable: 'true' },
        { prop: 'date', label: '结束时间', width: '', sortable: 'true' },
        { prop: 'name', label: '被访区域', width: '', sortable: 'true' }
      ],
      downloadObject: [] //打印/导出数据
    }
  },
  methods: {
    //排序
    sortChange(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      console.log(222, val)
      this.downloadObject = val
    },

    // 列表审批
    handleEdit(index, row, val) {
      this.isShowPendingListInfo = true
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '申请人' },
          { field: 'keyPartName', displayName: '申请编号' },
          { field: 'date', displayName: '所属部门' },
          { field: 'name', displayName: '申请缘由' },
          { field: 'name', displayName: '访客信息' },
          { field: 'date', displayName: '入园时间' },
          { field: 'name', displayName: '结束时间' },
          { field: 'date', displayName: '被访区域' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = ['申请人', '申请编号', '所属部门', '申请缘由', '访客信息', '入园时间', '结束时间', '被访区域']
      // 字段名
      const filterVal = ['orgName', 'keyPartName', 'date', 'name', 'name', 'date', 'name', 'date']
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
