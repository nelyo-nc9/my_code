<template>
  <div class="main">
    <div class="header" v-show="isShowAdd==false && isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>安全检查</el-breadcrumb-item>
        <el-breadcrumb-item>检查录入</el-breadcrumb-item>
        <el-breadcrumb-item>整改录入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px 0;" v-show="isShowAdd==false && isShowInfo==false">
      <!-- <el-button style="font-size:12px;" plain @click="add('新建')">新建</el-button> -->
      <el-button style="font-size:12px;" plain @click="exportFile('安全检查列表')">导出</el-button>
      <el-button style="font-size:12px;" plain @click="Toprint('安全检查列表')">打印</el-button>
    </div>
    <div v-show="isShowAdd==false && isShowInfo==false">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="index" label="序号" min-width="30"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
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
              @click="handleView('详情',scope.row)"
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

    <!-- 增加组件 -->
    <!-- <Add
      v-show="isShowAdd==true"
      :isShowAdd.sync="isShowAdd"
      :addTitle.sync="addTitle"
    ></Add>
    <Info
      v-show="isShowInfo==true"
      :isShowInfo.sync="isShowInfo"
      :infoTitle.sync='infoTitle'
    ></Info> -->
  </div>
</template>

<script>
// import treeBox from '@src/components/tree/treeBox'
export default {
  //  components: { treeBox },
   data() {
    return {
      isShowAdd: false, //增加组件显隐
      isShowInfo: false, //查看组件显隐
      addTitle: '',
      addObj: {},
      infoTitle:'',
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
        { prop: 'orgName', label: '所属部门', width: '',},
        { prop: 'date', label: '申请编号', width: '',},
        { prop: 'name', label: '申请缘由', width: '',},
        { prop: 'date', label: '访客信息', width: '',},
        { prop: 'name', label: '入园时间', width: '',},
        { prop: 'date', label: '结束时间', width: '',},
        { prop: 'name', label: '被访区域', width: '',},
        { prop: 'date', label: '审批状态', width: '',}
      ],
      downloadObject: [] //打印/导出数据
    }
  },
  methods: {

    handleSelectionChange(val) {
      this.downloadObject = val
    },
    // 列表编辑
    handleEdit(title, val) {
      this.isShowAdd = true
      this.addTitle = title
    },

    // 列表查看
    handleView(title, val) {
      this.isShowInfo = true
      this.infoTitle = title
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
          { field: 'orgName', displayName: '所属部门' },
          { field: 'date', displayName: '申请编号' },
          { field: 'name', displayName: '申请缘由' },
          { field: 'date', displayName: '访客信息' },
          { field: 'name', displayName: '入园时间' },
          { field: 'date', displayName: '结束时间' },
          { field: 'name', displayName: '被访区域' },
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
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '所属部门',
        '申请编号',
        '申请缘由',
        '访客信息',
        '入园时间',
        '结束时间',
        '被访区域',
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
