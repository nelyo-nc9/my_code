<template>
  <div class="main">
    <div class="header" v-show="isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>演练管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowInfo==false">
      <el-button style="font-size:12px;" plain @click="add('新建')">新建</el-button>
      <el-button style="font-size:12px;" plain @click="rem">删除</el-button>
      <el-button style="font-size:12px;" plain @click="exportFile('演练管理列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('演练管理列表')">打印</el-button>
    </div>
    <div v-show="isShowInfo==false">
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
              @click="handleView(scope.row)"
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
            <el-button
              size="samll"
              type="text"
              @click="handleEdit('编辑',scope.row)"
              style="font-size:12px;margin-left:0;"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right;"
        :page-sizes="[25, 50, 100, 200]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>
    <Info v-if="isShowInfo==true" :isShowInfo.sync='isShowInfo' :addList='addList'></Info>
  </div>
</template>

<script>
import Info from "./info"
import { mapState, mapMutations } from 'vuex'
export default {
  components:{
    Info,
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  data() {
    return {
      isShowInfo:false,//查看显隐
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
        { prop: 'orgName', label: '应急演练名称', width: '', sortable: 'true' },
        { prop: 'name', label: '应急演练机构', width: '', sortable: 'true' },
        { prop: 'name', label: '演练日期', width: '', sortable: 'true' },
        { prop: 'date', label: '演练种类', width: '', sortable: 'true' },
        { prop: 'name', label: '演练人数', width: '', sortable: 'true' }
      ],
      downloadObject: [], //打印/导出数据
      addList:{},//查看
    }
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    //排序
    sortChange(val) {
      console.log(val)
    },

    handleSelectionChange(val) {
      this.downloadObject = val
      this.remArr = val
    },
    // 列表编辑
    handleEdit(title, val) {
      this.SET_EQUIPMENT_COMPONENTID('Add')
    },
    // 列表查看
    handleView(val) {
      this.isShowInfo = true
      this.addList = val
    },
    add(title) {
      this.SET_EQUIPMENT_COMPONENTID('Add')
    },
    // 删除
    rem() {
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
          { field: 'orgName', displayName: '应急演练名称' },
          { field: 'date', displayName: '应急演练机构' },
          { field: 'name', displayName: '演练日期' },
          { field: 'date', displayName: '演练种类' },
          { field: 'name', displayName: '演练人数' }
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
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = ['应急演练名称', '应急演练机构', '演练日期', '演练种类', '演练人数']
      // 字段名
      const filterVal = ['orgName', 'date', 'name', 'date', 'name']
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
