<!--
 * @Author: tuozhaoping
 * @Date: 2020-07-05 17:30:55
 * @LastEditTime: 2020-07-05 15:44:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\cascadeManagement\pages\SubordinateCenterList.vue
-->
<template>
  <div class="subordinate-center-list-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统维护</el-breadcrumb-item>
          <el-breadcrumb-item>系统运维</el-breadcrumb-item>
          <el-breadcrumb-item>级联管理</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-checkbox v-model="checked" style="margin-right:5px;">显示子机构</el-checkbox>
          <el-button size="small" icon="el-icon-plus" @click="creat">新建</el-button>
          <el-button size="small" icon="el-icon-edit-outline">编辑</el-button>
          <el-button size="small" icon="el-icon-delete">删除</el-button>
          <el-button size="small" @click="exportFile">导出</el-button>
          <el-button size="small" @click="print">打印</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentItem" @sort-change="sortChange" ref="Table" height="100%" max-height="700" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubordinateCenterList',
  components: {
  },
  data() {
    return {
      columns: [
        { prop: 'secondaryCentreName', sortable: true, label: '下级中心名称', width: '' },
        { prop: 'org', sortable: true, label: '所属机构', width: '' },
        { prop: 'status', sortable: true, label: '状态', width: '' },
        { prop: 'secondaryCentreAddress', sortable: true, label: '下级中心地址', width: '' },
        { prop: 'ctrlPort', sortable: true, label: '控制端口', width: '' },
        { prop: 'dataPort', sortable: true, label: '数据端口', width: '' },
        { prop: 'userName', sortable: true, label: '用户名', width: '' },
        { prop: 'paddWord', sortable: true, label: '密码', width: '' }
      ],
      resizable: true,
      tableData: [
      ],
      checked: false, // 子机构
      total: 0,
      selectData: [],
      storeArr: [],
      pageSize: 10,
      page: 1
      // isCreat: false
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.storeArr = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['名字', '显示名', '类别', '排列序号', '状态', '创建时间']
      const filterVal = ['name', 'showName', 'type', 'permutationsNum', 'status', 'creatTime']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '数据字典列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 列表当前项
    handleCurrentItem(val) {
      this.selectData = [val]
      console.log(val, this.selectData, '列表当前项')
    },
    // 清空列表当前项
    clearSelectData() {
      this.selectData = []
    },
    // 打印
    print() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '名字' },
          { field: 'showName', displayName: '显示名' },
          { field: 'type', displayName: '类别' },
          { field: 'permutationsNum', displayName: '排列序号' },
          { field: 'status', displayName: '状态' },
          { field: 'creatTime', displayName: '创建时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">数据字典列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    creat() {
      return this.$messageSuccess('新建')
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/elementModify.less';
.subordinate-center-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    height: 100%;
    width: 100%;
    .directory {
      padding-bottom: 5px;
      overflow: hidden;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .top {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 100px');
      .list-box-table {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
