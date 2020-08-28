<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
      <el-breadcrumb-item>查询</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 推送策略查询 -->
    <div class="query">
      <p>推送策略查询</p>
      <div class="queryt">
        <div class="querys">
          <div>
            <span>策略名称</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
          <div>
            <span>推送对象</span>
            <el-form>
              <el-select v-model="form.region" placeholder="RAD" style="width:380px">
                <el-option label="RAD" value="RAD"></el-option>
              </el-select>
            </el-form>
          </div>
          <div>
            <span>启用</span>
            <el-form>
              <el-select v-model="form.enabled" placeholder="启用" style="width:380px">
                <el-option label="启用" value="启用"></el-option>
                <el-option label="禁用" value="禁用"></el-option>
                <el-option label="全部" value="全部"></el-option>
              </el-select>
            </el-form>
          </div>
          <div>
            <span>报警合并</span>
            <el-select v-model="form.merge" placeholder="全部" style="width:380px">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </div>
          <div>
            <span>业务事件类型</span>
            <el-form>
              <el-select v-model="form.transaction" placeholder="非工作时间进入营业网点" style="width:380px">
                <el-option label="非工作时间进入营业网点" value="非工作时间进入营业网点"></el-option>
                <el-option label="非工作时间进入加钞间" value="非工作时间进入加钞间"></el-option>
                <el-option label="业务终端拍照行为" value="业务终端拍照行为"></el-option>
              </el-select>
            </el-form>
          </div>
          <div>
            <span>时间模板</span>
            <el-form>
              <el-select v-model="form.time" placeholder="非工作时间" style="width:380px">
                <el-option label="非工作时间" value="非工作时间"></el-option>
                <el-option label="工作时间" value="工作时间"></el-option>
              </el-select>
            </el-form>
          </div>
        </div>
      </div>
      <el-row class="rowbutton">
        <el-button>查询</el-button>
        <el-button>重置</el-button>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="list">

      <!-- 按钮 -->
      <el-row class="rowbuttons">
        <el-button>导出</el-button>
        <el-button>打印</el-button>
      </el-row>

      <!-- 列表部分 -->
      <div class="tables">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :border="true"
          tooltip-effect="dark"
          style="width: 100%"
          >
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
      input:'',
      form:{
        region:'RAD',
        enabled:'启用',
        merge:'全部',
        transaction:'非工作时间进入营业网点',
        time:'非工作时间'
      },
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
          name: 'XXX自助银行加钞间',
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
          name: 'XXX自助银行加钞间',
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
          name: 'XXX自助银行加钞间',
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
          business: '业务终端拍照',
          time: '24小时',
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
          business: '业务终端拍照',
          time: '24小时',
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
          business: '业务终端拍照',
          time: '24小时',
          merge: '是',
          inputer: '管理员',
          organization: 'XXX分行',
          date: '2020-02-26',
        },],
        multipleSelection: []
      }
    },
    methods:{
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
  .query{
    width: 1027px;
    margin: 20px 0;
    text-align: center;
  }
  .queryt{
    width: 100%;
    margin-left: 20px;
    margin-top: 20px;
    border: 1px solid #cccccc;
  }
  .querys{
    margin: 20px;
  }
  .querys div{
    display: inline-block;
  }
  .querys div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 100px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .el-input{
    width: 380px;
    display: inline-block;
  }
  .el-form{
    display: inline-block;
  }
  .rowbutton{
  text-align: center;
  margin: 20px 0;
  }
  .rowbuttons{
    margin: -40px 0 20px 40px;
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