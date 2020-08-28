<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>AI任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部导航 -->
    <el-row class="rowbutton">
      <el-button>新建</el-button>
      <el-button>编辑</el-button>
      <el-button>删除</el-button>
      <el-button>导出</el-button>
      <el-button>打印</el-button>
    </el-row>

    <!-- 列表 -->
    <div class="tables">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        tooltip-effect="dark"
        style="width: 100%"
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
          width="160">
        </el-table-column>
        <el-table-column
          align="center"
          prop="subsidiaryorgan"
          label="所属机构"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="devicename"
          label="设备名称"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="cameraname"
          label="摄像机名称"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="analysis"
          label="分析模块"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="equipment"
          label="AI设备"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="enabled"
          label="启用"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          label="时间模板"
          width="180">
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes, prev, pager, next, jumper"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
  },
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    padding-left: 20px;
    margin: 10px 0;
  }
  .rowbutton{  
    margin: 20px 0 20px 20px;
  }
  .tables{
    margin-left: 10px;
    height: 500px;
  }
  .block{
    text-align: center;
    margin: 20px 0;
  }
</style>