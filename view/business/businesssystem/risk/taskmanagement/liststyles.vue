<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>AI任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>  

    <!-- 顶部导航 -->
    <el-row class="rowbutton">
      <el-button @click="newcom">新建</el-button>
      <el-button @click="edit" :disabled="multipleSelection.length !== 1">编辑</el-button>
      <el-button @click="deleteInfo" :disabled="multipleSelection.length == 0">删除</el-button>
      <el-button @click="exportFile">导出</el-button>
      <el-button @click="Toprint">打印</el-button>
    </el-row>

    <!-- 列表 -->
    <div class="tables" id="printContent">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          prop="number"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          align="center"
          prop="keyposition"
          label="所属重点部位"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="subsidiaryorgan"
          label="所属机构"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="devicename"
          label="设备名称"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="cameraname"
          label="摄像机名称"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="analysis"
          label="分析模块"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          prop="equipment"
          label="AI设备"
          width="115">
        </el-table-column>
        <el-table-column
          align="center"
          prop="enabled"
          label="启用"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          label="时间模板"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="frequency"
          label="分析频率"
          width="120">
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
          width="120">
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
</template>

<script>
export default {
  data(){
    return{
      currentPage: 1,
      pagesize: 10,
      currpage: 1,
      tableData: [{
          number: '1',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '2',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '3',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '4',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '5',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '6',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '7',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '8',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        },
        {
          number: '9',
          keyposition: 'XXX监控中心',
          subsidiaryorgan: 'XXX分行',
          devicename: '设备名称1',
          cameraname: '摄像机名称1',
          analysis: '业务终端拍照',
          equipment: 'XXX分析设备',
          enabled: '启用',
          time: '24小时',
          frequency: '20S',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26'
        }],
        multipleSelection: []
    }
  },
  methods: {
      //新建
      newcom(){
        this.$emit('changeComponent', 'News');
      },
      // 编辑
      edit(){
        this.$emit('changeComponent', 'News');
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
          '所属重点部位',
          '所属机构',
          '设备名称',
          '摄像机名称',
          '分析模块',
          'AI设备',
          '启用',
          '时间模板',
          '分析频率',
          '录入人',
          '录入机构',
          '录入时间'
        ]

        //字段名
        const filterVal = [
          'keyposition',
          'subsidiaryorgan',
          'devicename',
          'cameraname',
          'analysis',
          'equipment',
          'enabled',
          'time',
          'frequency',
          'inputer',
          'organization',
          'date'
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
        export_json_to_excel(tHeader, data, 'AI任务管理列表')
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
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
            { field: 'keyposition', displayName: '所属重点部位' },
            { field: 'subsidiaryorgan', displayName: '所属机构' },
            { field: 'devicename', displayName: '设备名称' },
            { field: 'cameraname', displayName: '摄像机名称' },
            { field: 'analysis', displayName: '分析模块' },
            { field: 'equipment', displayName: 'AI设备' },
            { field: 'enabled', displayName: '启用' },
            { field: 'time', displayName: '时间模板' },
            { field: 'frequency', displayName: '分析频率' },
            { field: 'inputer', displayName: '录入人' },
            { field: 'organization', displayName: '录入机构' },
            { field: 'date', displayName: '录入时间' },
          ],
          type: 'json',
          // 表题 
          header: '<p class="custom">AI任务管理列表</p>',
          // 表题样式 
          style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
          //表头样式
          gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
          //内容样式
          gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
        })
      },
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
      }
  },
}
</script>

<style scoped lang="less">
  .nav{
    width: 500px;
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
  .rowbutton{  
    margin: 20px 0 20px 20px;
  }
  .tables{
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
    height: 500px;
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