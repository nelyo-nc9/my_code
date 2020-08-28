<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 推送策略查询 -->
    <div class="query">
      <p>推送策略查询</p>
      <el-form class="querys" ref="form" :model="form" label-width="160px">
        <el-form-item label="策略名称">
          <el-input v-model="form.names"></el-input>
        </el-form-item>
        <el-form-item label="推送对象">
          <el-select v-model="form.objects" placeholder="请选择">
            <el-option
              v-for="item in objoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-select v-model="form.start" placeholder="请选择">
            <el-option
              v-for="item in startoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警合并">
          <el-select v-model="form.alarm" placeholder="请选择">
            <el-option
              v-for="item in alarmoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务事件类型">
          <el-select v-model="form.transaction" placeholder="请选择">
            <el-option
              v-for="item in tranoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间模板">
          <el-date-picker
            :unlink-panels="true"
            v-model="form.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="录入人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="录入机构">
          <el-input v-model="form.institution"></el-input>
        </el-form-item>
        <el-form-item label="录入机构" class="last">
          <el-date-picker
            :unlink-panels="true"
            v-model="form.times"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-row class="rowbutton">
        <el-button>查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="exportFile">导出</el-button>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="list">

      <!-- 列表部分 -->
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
            width="50">
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
      form:{
        name: '',
        names: '',
        objects: 'RAD',
        start: '全部',
        alarm: '全部',
        transaction:'全部',
        time: '',
        institution: '',
        times: ''
      },
      objoptions:[{
        value: 'RAD',
        label: 'RAD'
      }],
      startoptions: [{
        value: '全部',
        label: '全部'
      },
      {
        value: '启用',
        label: '启用'
      }, 
      {
        value: '禁止',
        label: '禁止'
      }],
      alarmoptions: [
      {
        value: '全部',
        label: '全部'
      },
      {
        value: '是',
        label: '是'
      },
      {
        value: '否',
        label: '否'
      }
      ],
      tranoptions: [
      {
        value: '全部',
        label: '全部'
      },
      {
        value: '非工作时间进入营业网点',
        label: '非工作时间进入营业网点'
      },
      {
        value: '非工作时间进入加钞间',
        label: '非工作时间进入加钞间'
      },
      {
        value: '业务终端拍照行为',
        label: '业务终端拍照行为'
      },
      ],
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
        multipleSelection: [],
        //选中项
        selectData: []
      }
    },
    methods:{
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
        export_json_to_excel(tHeader, data, '报警推送策略配置查询')
      },
      // 筛选方法
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      reset(){
        this.form.name = '',
        this.form.names = '',
        this.form.objects = 'RAD',
        this.form.start = '全部',
        this.form.alarm = '全部',
        this.form.transaction = '全部',
        this.form.time = '',
        this.form.institution = '',
        this.form.times = ''
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
    }
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
  .last{
    float: left;
  }
  .query{
    text-align: center;
    // width: 1027px;
    margin: 20px 0;
  }
  .query>p{
    text-align: center;
  }
  .querys{
    width: 928px;
    height: 202px;
    margin: 20px;
    /deep/ .el-input__inner{
      width: 300px;
    }
  }
  /deep/ .el-form-item__label{
    margin-top: 1px;
    padding: 5px 0;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .el-form-item{
    margin: 0;
  }
  .el-form{
    display: inline-block;
  }
  .el-input{
    width: 300px;
  }
  .el-form-item{
    display: inline-block;
  }
  .el-select{
    width: 300px;
  }
  .rowbutton{
  text-align: center;
  margin: 20px 0;
  }
  .el-table{
    height: 500px;
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