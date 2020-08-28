<template>
  <div class="main">
    <div class="header" v-show="isShowAdd==false && isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>施工报备</el-breadcrumb-item>
        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowAdd==false && isShowInfo==false">
      <el-button style="font-size:12px;" plain @click="add('新建')">新建</el-button>
      <el-button style="font-size:12px;" plain @click="exportFile('施工报备申请列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('施工报备申请列表')">打印</el-button>
    </div>
    <div v-show="isShowAdd==false && isShowInfo==false">
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
          sortable
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              @click="handleEdit('编辑',scope.row)"
              style="font-size:12px;margin-left:0;"
            >编辑</el-button>
            <el-button
              size="samll"
              type="text"
              @click="handleDelete(scope.$index, tableData)"
              style="font-size:12px;margin-left:0;"
            >删除</el-button>
            <el-button
              size="samll"
              type="text"
              @click="handleView('施工报备申请单详情',scope.row)"
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
            <el-button
              size="samll"
              type="text"
              @click="handleWithdraw('延期申请',scope.row)"
              style="font-size:12px;margin-left:0;"
            >延期申请</el-button>
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

    <!-- 增加组件 -->
    <Add
      v-show="isShowAdd==true"
      :isShowAdd.sync="isShowAdd"
      :addTitle.sync="addTitle"
      :addObj="addObj"
    ></Add>
    <Info
      v-show="isShowInfo==true"
      :isShowInfo.sync="isShowInfo"
      :infoTitle.sync="infoTitle"
      :infoObj="infoObj"
    ></Info>
  </div>
</template>

<script>
import Add from './add.vue'
import Info from './info.vue'
export default {
  components: {
    Add,
    Info
  },
  data() {
    return {
      isShowAdd: false, //增加组件显隐
      isShowInfo: false, //查看组件显隐
      addTitle: '',
      addObj: {},
      infoTitle: '',
      infoObj: {
        index: 1,
        date: '2016-05-02',
        name: '王小虎',
        id: 1,
        orgName: '北京'
      },
      tableData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          id: 1,
          orgName: '北京'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          id: 2,
          orgName: '上海'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          id: 3,
          orgName: '北京'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          id: 4,
          orgName: '西安'
        }
      ],
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'name', label: '申请部门', width: '', sortable: 'true' },
        { prop: 'date', label: '申请编号', width: '', sortable: 'true' },
        { prop: 'name', label: '申请人', width: '', sortable: 'true' },
        { prop: 'date', label: '施工单位', width: '', sortable: 'true' },
        { prop: 'name', label: '施工区域', width: '', sortable: 'true' },
        { prop: 'date', label: '施工类型', width: '', sortable: 'true' },
        { prop: 'name', label: '开始时间', width: '', sortable: 'true' },
        { prop: 'date', label: '结束时间', width: '', sortable: 'true' },
        { prop: 'name', label: '录入人', width: '', sortable: 'true' },
        { prop: 'date', label: '审批状态', width: '', sortable: 'true' }
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
      this.downloadObject = val
    },
    //新增申请
    add(title) {
      this.isShowAdd = true
      this.addTitle = title
      this.addObj = {}
    },
    // 列表编辑
    handleEdit(title, val) {
      this.isShowAdd = true
      this.addTitle = title
      this.addObj = val
    },
    // 延期申请
    handleWithdraw(title, val) {
      this.isShowAdd = true
      this.addTitle = title
      this.addObj = val
    },
    // 列表查看
    handleView(title, val) {
      this.isShowInfo = true
      this.infoTitle = title
      this.infoObj = val
    },
    // 列表删除
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          row.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '申请部门' },
          { field: 'date', displayName: '申请编号' },
          { field: 'name', displayName: '申请人' },
          { field: 'date', displayName: '施工单位' },
          { field: 'name', displayName: '施工区域' },
          { field: 'date', displayName: '施工类型' },
          { field: 'name', displayName: '开始时间' },
          { field: 'date', displayName: '结束时间' },
          { field: 'name', displayName: '录入人' },
          { field: 'date', displayName: '审批状态' }
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
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '申请部门',
        '申请编号',
        '申请人',
        '施工单位',
        '施工区域',
        '施工类型',
        '开始时间',
        '结束时间',
        '录入人',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'name',
        'date',
        'name',
        'date',
        'name',
        'date',
        'name',
        'date',
        'name',
        'date'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
