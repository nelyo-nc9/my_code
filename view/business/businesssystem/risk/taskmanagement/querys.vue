<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>AI任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>  

    <!-- 查询条件 -->
    <div class="querys" id="printContent">
      <el-form class="query" ref="form" :model="form" label-width="160px">
        <el-form-item label="所属重点部位">
          <el-input v-model="form.keyposition"></el-input>
        </el-form-item>
        <el-form-item label="所属机构">
          <el-input v-model="form.institution"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.devicename"></el-input>
        </el-form-item>
        <el-form-item label="摄像机名称">
          <el-input v-model="form.cameraname"></el-input>
        </el-form-item>
        <el-form-item label="AI设备">
          <el-select v-model="form.value" placeholder="请选择">
            <el-option
              v-for="item in AIoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析模块">
          <el-select v-model="form.analyze" placeholder="请选择">
            <el-option
              v-for="item in analyzeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select v-model="form.start" placeholder="请选择">
            <el-option
              v-for="item in startoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="录入人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="录入机构">
          <el-input v-model="form.typeinstitution"></el-input>
        </el-form-item>
        <el-form-item label="录入时间">
          <el-date-picker
            :unlink-panels="true"
            v-model="form.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-row>
          <el-button>查询</el-button>
        </el-row>
        <el-row>
          <el-button @click="reset">重置</el-button>
        </el-row>
        <el-row>
          <el-button @click="exportFile">导出</el-button>
        </el-row>
      </div>
    </div>

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
  data() {
      return {
        currentPage: 1,
        pagesize: 10,
        currpage: 1,
        form: {
          keyposition: '',
          institution: '',
          devicename: '',
          cameraname: '',
          value: '全部',
          analyze: '全部',
          start: '全部',
          name: '',
          typeinstitution: '',
          time: ''
        },
        AIoptions: [
          {
            value:'全部',
            labei:'全部'
          }
        ],
        analyzeoptions: [
          {
            value:'全部',
            labei:'全部'
          },
          {
            value:'业务终端拍照',
            labei:'业务终端拍照'
          }
        ],
        startoptions: [
          {
            value: '全部',
            labei: '全部'
          },
          {
            value: '是',
            labei: '是'
          },
          {
            value: '否',
            labei: '否'
          }
        ],
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
        multipleSelection: [],
        shortcuts: [{
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      }
    },
    methods: {
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
        export_json_to_excel(tHeader, data, 'AI任务管理查询')
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //重置
      reset(){
          this.form.keyposition = '';
          this.form.nstitution ='';
          this.form.devicename = '';
          this.form.cameraname = '';
          this.form.value = '全部';
          this.form.analyze = '全部';
          this.form.start = '全部';
          this.form.name = '';
          this.form.typeinstitution = '';
          this.form.institution = '';
          this.form.time = '';
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
  .querys{
    text-align: center;
    margin-left: 20px;
    /deep/.el-input__inner{
      width: 300px;
    }
  }
  .query{
    width: 928px;
    height: 202px;
    margin-left: 20px;
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
  
  .el-form-item{
    display: inline-block;
  }
  .el-select{
    width: 300px;
  }
  .el-row{
    display: inline-block;
  }
  .buttons{
    // width: 928px;
    text-align: center;
    margin: 10px 0;
  }
  .tables{
    margin-top: 20px;
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