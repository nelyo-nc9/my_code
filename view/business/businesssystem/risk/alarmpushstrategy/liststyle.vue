<template>
  <div class="liststyle">
    <div  v-if="!isnews">
      <!-- 导航 -->
      <div class="nav">
        <i class="el-icon-location"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
          <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
          <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 按钮 -->
      <el-row class="rowbuttons">
        <el-button @click="newcom">新建</el-button>
        <el-button @click="edit" :disabled="multipleSelection.length !== 1">编辑</el-button>
        <el-button @click="deleteInfo" :disabled="multipleSelection.length == 0">删除</el-button>
        <el-button @click="exportFile">导出</el-button>
        <el-button @click="Toprint">打印</el-button>
      </el-row>

      <!-- 列表 -->
      <div class="tables">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :border="true"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="53">
          </el-table-column>
          <el-table-column
            align="center"
            prop="number"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="策略名称"
            width="250">
          </el-table-column>
          <el-table-column
            align="center"
            prop="push"
            label="推送对象"
            width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="start"
            label="启用"
            width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="business"
            label="业务事件类型"
            width="240">
          </el-table-column>
          <el-table-column
            align="center"
            prop="time"
            label="时间模板"
            width="170">
          </el-table-column>
          <el-table-column
            align="center"
            prop="merge"
            label="报警合并"
            width="130">
          </el-table-column>
          <el-table-column
            align="center"
            prop="inputer"
            label="录入人"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organization"
            label="录入机构"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="date"
            label="录入时间"
            width="180">
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="block">
        <el-button type="button" @click="jumpFirstPage" class="my-btn" size="mini">首页</el-button>
          <el-pagination
            ref="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="sizes, prev, pager, next, jumper"
            :total="0">
          </el-pagination>
        <el-button type="button" @click="jumpLastPage" class="my-btn" size="mini" style="margin: 0px 5px">尾页</el-button>
      </div>
    </div>
    <!-- <new-com v-if="isnews"></new-com> -->
  </div>
</template>

<script>
// import NewCom from './new'
export default {
  // components:{
  //   NewCom
  // },
  data() {
      return {
        //currentPage1: 5,
        // currentPage2: 5,
        // currentPage3: 5,
        currentPage: 1,
        pagesize: 10,
        currpage: 1,
        isliststyle:true,
        isnews:false,
        tableData: [{
          number: '1',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '2',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '3',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '4',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '5',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '6',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '7',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '8',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },
        {
          number: '9',
          name: 'XXX营业网点推送策略',
          push: 'RAD',
          start: '启用',
          business: '非工作时间进入营业网点',
          time: '非工作时间',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        }],
        //选中项
        multipleSelection: [],
      }
    },
  methods: {
    //新建
    newcom(){
     console.log(52656565)
      this.$emit('changeComponent', 'New');
    },
    // 编辑
    edit(){
      this.$emit('changeComponent', 'New');
    },
    //删除
    deleteInfo(){
    this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //导出
    exportFile(){
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      //表头
      let tHeader = [
        '策略名称',
        '推送对象',
        '启用',
        '业务事件类型',
        '时间模板',
        '报警合并',
        '录入人',
        '录入机构',
        '录入时间'
      ]

      //字段名
      const filterVal = [
        'name',
        'push',
        'start',
        'business',
        'time',
        'merge',
        'inputer',
        'organization',
        'date',
      ]
      let list = []
      //导出全部或导出选中
      if(this.multipleSelection && this.multipleSelection.length > 0){
        list=this.multipleSelection
      }else{
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '报警推送策略配置列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //选中
    handleSelectionChange(val) {
      console.log("handleSelectionChange--",val);
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currpage=val;
    },
    jumpFirstPage () {
        this.$refs.pagination.handleCurrentChange(1);
        this.$emit('handleCurrentChange', 1);
    },
    jumpLastPage () {
        let font = this.$refs.pagination
        let cpage = Math.ceil(font.total / font.pageSize);
        font.handleCurrentChange(cpage);
    },

    //打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if(this.multipleSelection && this.multipleSelection.length > 0){
          list=this.multipleSelection
      } else {
        list = this.tableData
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'name', displayName: '策略名称' },
          { field: 'push', displayName: '推送对象' },
          { field: 'start', displayName: '启用' },
          { field: 'business', displayName: '业务事件类型' },
          { field: 'time', displayName: '时间模板' },
          { field: 'merge', displayName: '报警合并' },
          { field: 'inputer', displayName: '录入人' },
          { field: 'organization', displayName: '录入机构' },
          { field: 'date', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">报警推送策略配置列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
        //内容样式
        gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
      })
    },
  }
}
</script>

<style scoped lang="less">
  .nav{
    // width: 500px;
    padding-left: 20px;
    margin: 10px 0;
    i{
      float: left;
      margin-right: 5px;
    }
    el-breadcrumb{
      float: left;
    }
  }
  .rowbuttons{  
  margin: 20px 0 20px 20px;
  }
  .el-table{
    max-height: 500px;
    border: 1px solid #cccccc;
  }
  .tables{
    width: 98%;
    margin-left: 20px;
  }
  .block{
    text-align: center;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    .el-button:first-child{
      line-height: 12px;
    }
  }
</style>