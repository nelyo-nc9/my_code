<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-row class="rowbuttons">
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
          prop="name"
          label="策略名称"
          width="160">
        </el-table-column>
        <el-table-column
          align="center"
          prop="push"
          label="推送对象"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="start"
          label="启用"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="business"
          label="业务事件类型"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          label="时间模板"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="merge"
          label="报警合并"
          width="100">
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
  data() {
      return {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
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
        },],
        multipleSelection: []
      }
    },
  methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    padding-left: 20px;
    margin: 10px 0;
  }
  .rowbuttons{  
  margin: 20px 0 20px 20px;
  }
  .el-table{
    height: 500px;
    border: 1px solid #cccccc;
  }
  .tables{
    margin-left: 20px;
  }
  .block{
    text-align: center;
    margin: 20px 0;
  }
</style>