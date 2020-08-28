<template>
  <div class="main">
    <div class="header" v-show="isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>施工报备</el-breadcrumb-item>
        <el-breadcrumb-item>已审核列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowInfo==false">
      <el-button style="font-size:12px;" plain @click="rem('确认删除已选中列表')">删除</el-button>
      <el-button style="font-size:12px;" plain @click="exportFile('施工报备已审批列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('施工报备已审批列表')">打印</el-button>
    </div>
    <div v-show="isShowInfo==false">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @sort-change="sortChange"
        @select="selectChange"
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
              @click.native.prevent="handleEdit(scope.row)"
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
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

    <Info v-show="isShowInfo==true" :isShowInfo.sync='isShowInfo'></Info>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Info from './info.vue'
export default {
    components: {
      Info
    },
  data() {
    return {
      isShowInfo: false,
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
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'date', label: '申请编号', width: '', sortable: 'true' },
        { prop: 'name', label: '申请部门', width: '', sortable: 'true' },
        { prop: 'name', label: '申请人', width: '', sortable: 'true' },
        { prop: 'date', label: '施工单位', width: '', sortable: 'true' },
        { prop: 'name', label: '施工区域', width: '', sortable: 'true' },
        { prop: 'date', label: '施工类型', width: '', sortable: 'true' },
        { prop: 'name', label: '开始时间', width: '', sortable: 'true' },
        { prop: 'date', label: '结束时间', width: '', sortable: 'true' },
        { prop: 'name', label: '录入人', width: '', sortable: 'true' },
        { prop: 'date', label: '审批状态', width: '', sortable: 'true' }
      ],
      downloadObject: [], //打印/导出数据
      remArr: [],
      remObj: {}
    }
  },
  methods: {
    //排序
    sortChange(val) {
      console.log(val)
    },
    //勾选
    selectChange(select, row) {
      this.downloadObject = select //打印/导出数据
      this.remArr = select
      this.remObj = row
      console.log(this.remObj)
    },

    // 查看审批
    handleEdit(row) {
       this.isShowInfo = true
    },
    //删除
    rem(title) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remArr.map(item => {
            let indexs = this.tableData.indexOf(item)
            this.tableData.splice(indexs, 1)
          })
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
          { field: 'date', displayName: '申请编号' },
          { field: 'name', displayName: '申请部门' },
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
        '所属机构',
        '所属重点部位',
        '申请编号',
        '申请部门',
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
        'date',
        'name',
        'name',
        'date',
        'name',
        'date',
        'name',
        'date',
        'date',
        'name'
      ]
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
