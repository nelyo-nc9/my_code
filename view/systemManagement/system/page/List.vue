<template>
  <div class="main">
    <div class="header" v-show="isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>制度和安全</el-breadcrumb-item>
        <el-breadcrumb-item>规章制度管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="button-con" v-show="isShowInfo==false">
      <el-button style="font-size:12px;" plain size="small" icon="el-icon-plus" @click="add('新建')">新建</el-button>
      <el-button style="font-size:12px;" plain size="small" icon="el-icon-edit-outline" @click="enit('编辑')">编辑</el-button>
      <el-button style="font-size:12px;" plain size="small" icon="el-icon-delete" @click="rem">删除</el-button>
      <el-button style="font-size:12px;" plain size="small" icon="el-icon-document" @click="exportFile('规章制度管理')">导出</el-button>
      <el-button style="font-size:12px;" plain size="small" icon="el-icon-printer" @click="Toprint('规章制度管理')">打印</el-button>
    </div>
    <div class="table-con" v-show="isShowInfo==false">
      <div class="table-con-box">
      <el-table
        :data="tableData"
        style="width: 100%;"
        height="100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{'text-align':'center'}"
        @selection-change="selectionData"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="name" label="文件名" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="文号" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="source" label="文件来源" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="level" label="颁布级别" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="文件种类" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="发布单位" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="time" label="发布时间" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="contentType" label="内容分类" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="validity" label="有效性" width="" sortable show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="samll"
              type="text"
              @click="handleView(scope.row)"
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <el-pagination
        style="text-align:center;margin-top:15px;"        
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <Info v-if="isShowInfo==true" :isShowInfo.sync="isShowInfo" :formData="addList"></Info>
  </div>
</template>

<script>
import Info from './Info'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Info
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  data() {
    return {
      //查看显隐
      isShowInfo: false,
      //表格数据
      tableData: [
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        },
        {
          name: '规章制度1',
          number: '10001',
          source: '行内',
          level: '总行',
          type: '制度',
          company: '北京分行',
          time: '2020/08/24',
          contentType : ['营业网点', '办公楼' ,'金库'],
          enclosure: [{fileName: '建行.pdf'}],
          enterTime: '2020/08/24',
          enterMechanism: '建设银行北京分行',
          enterPerson: '王小虎',
          validity: '有效'
        }
      ],
      //打印/导出数据
      downloadObject: [],
      //查看时储存该条数据
      addList: {},
      //每页条数
      pageSize: 5,
      //当前页
      currentPage: 1 
    }
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    //排序
    sortChange(val) {
      //console.log(val)
    },
    //改变每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
      this.$confirm('暂无后台接口调用', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
      })
    },
    //改变当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$confirm('暂无后台接口调用', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
      })
    },
    //表格选中
    selectionData(val) {
      this.downloadObject = val;
      this.remArr = val;
      this.wantEnit = val;
    },
    //列表查看
    handleView(val) {
      this.isShowInfo = true;
      this.addList = val;
    },
    //新建
    add(title) {
       this.$emit('transmitAddList', []);
      this.SET_EQUIPMENT_COMPONENTID('Add')
    },
    //编辑
    enit(title) {
      if(!this.wantEnit || this.wantEnit.length == 0){
        this.$confirm('请选择一个要编辑的对象！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        })
        return false;
      }
      if(this.wantEnit.length > 1){
        this.$confirm('只能选择一个要编辑的对象！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        })
        return false;
      }
      if(this.wantEnit.length == 1){
        this.$emit('transmitAddList', this.wantEnit[0]);
        this.SET_EQUIPMENT_COMPONENTID('Add');
      }      
    },
    // 删除
    rem() {
      if(!this.remArr || this.remArr.length == 0){
        this.$confirm('请选要删除的的对象！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning'
        })
        return false;
      }
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
    //打印方法
    Toprint(title) {
      //判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '文件名' },
          { field: 'number', displayName: '文号' },
          { field: 'source', displayName: '文件来源' },
          { field: 'level', displayName: '颁布级别' },
          { field: 'type', displayName: '文件种类' },
          { field: 'company', displayName: '发布单位' },
          { field: 'time', displayName: '发布时间' },
          { field: 'contentType', displayName: '内容分类' },
          { field: 'enclosure', displayName: '附件' },
          { field: 'enterTime', displayName: '录入时间' },
          { field: 'enterMechanism', displayName: '录入机构' },
          { field: 'enterPerson', displayName: '录入人' },
          { field: 'validity', displayName: '有效性' }
        ],
        type: 'json',
        //表题
        header: '<p class="custom">' + title + '</p>',
        //表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        //表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        //内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    //导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '文件名',
        '文号',
        '文件来源',
        '颁布级别',
        '文件种类',
        '发布单位',
        '发布时间',
        '内容分类',
        '附件',
        '录入时间',
        '录入机构',
        '录入人',
        '有效性'
      ]
      //字段名
      const filterVal = [
        'name',
        'number',
        'source',
        'level',
        'type',
        'company',
        'time',
        'contentType',
        'enclosure',
        'enterTime',
        'enterMechanism',
        'enterPerson',
        'validity'
      ]
      let list = []
      //导出全部或导出选中
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

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow:hidden;
  .button-con{
    padding: 20px 0;
  }
  .table-con{
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow:hidden;
    .table-con-box{
      flex: 1;
      overflow: hidden;
    }
    /deep/ .el-table::before{
      height: 0;
    }
    /deep/ .el-table .caret-wrapper{
      width: 13px;
    }
  }
}
</style>
