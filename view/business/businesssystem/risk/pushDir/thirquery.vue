<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>推送日志</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 查询条件 -->
    <div class="querys">
      <el-form class="query" ref="form" :model="form" label-width="160px">
        <el-form-item label="所属机构">
          <el-input v-model="form.keyposition"></el-input>
        </el-form-item>
        <el-form-item label="所属重点部位">
          <el-input v-model="form.institution"></el-input>
        </el-form-item>
        <el-form-item label="推送策略名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="推送对象">
          <el-select v-model="form.typeinstitution" placeholder="请选择">
            <el-option
              v-for="item in instoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="form.resource"></el-input>
        </el-form-item>
        <el-form-item label="抓拍时间">
          <el-date-picker
            :unlink-panels="true"
            v-model="form.policetime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送时间">
          <el-date-picker
            :unlink-panels="true"
            v-model="form.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送结果">
          <el-select v-model="form.result" placeholder="请选择">
            <el-option
              v-for="item in resultoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属设备">
          <el-input v-model="form.devicename"></el-input>
        </el-form-item> -->
        
        <!-- <el-form-item label="业务事件类型">
          <el-select v-model="form.value" placeholder="请选择">
            <el-option
              v-for="item in proptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

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

    <!-- 列表部分 -->
    <div class="lists">
      <el-table
        ref="multipleTable"
        :data="tableData.slice((currpage-1)*pagesize, currpage * pagesize)"
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
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="keyposition"
          label="所属机构"
          width="210">
        </el-table-column>
        <el-table-column
          align="center"
          prop="subsidiaryorgan"
          label="所属重点部位"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          prop="devicename"
          label="资源名称"
          width="250">
        </el-table-column>
        <el-table-column
          align="center"
          prop="resource"
          label="推送对象"
          width="170">
        </el-table-column>
        <el-table-column
          align="center"
          prop="date"
          label="抓拍时间"
          width="200">
        </el-table-column>
        <el-table-column
          align="center"
          prop="time"
          label="推送时间"
          width="250">
        </el-table-column>
        <el-table-column
          align="center"
          prop="operation"
          label="推送结果"
          width="250">
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
          subsidiaryorgan:'',
          resource: '',
          institution: '',
          policetime: '',
          result: '全部',
          name: '',
          typeinstitution: '信访平台',
          time: ''
        },
        instoptions: [
          {
            value:'信访平台',
            label:'信访平台'
          }
        ],
        resultoptions: [
          {
            value: '全部',
            labei: '全部'
          },
          {
            value: '成功',
            labei: '成功'
          },
          {
            value: '失败',
            labei: '失败'
          }
        ],
        tableData: [{
          number: '1',
          keyposition: '中国建设银行/总行',
          subsidiaryorgan: '总部大楼',
          devicename: '西北门人脸抓拍机',
          resource: '信访平台',
          operation: '成功',
          time: '2020-05-03 06:30:00',
          date: '2020-05-03 06:30:00'
        },
        {
          number: '1',
          keyposition: '中国建设银行/总行',
          subsidiaryorgan: '总部大楼',
          devicename: '西北门人脸抓拍机',
          resource: '信访平台',
          operation: '成功',
          time: '2020-05-03 06:30:00',
          date: '2020-05-03 06:30:00'
        }]
    }
  },
  methods: {
      //导出
      exportFile(){
        const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
        //表头
        let tHeader = [
          '序号',
          '所属机构',
          '所属重点部位',
          '资源名称',
          '推送对象',
          '抓拍时间',
          '推送时间',
          '推送结果',
        ]

        //字段名
        const filterVal = [
          'number',
          'keyposition',
          'subsidiaryorgan',
          'devicename',
          'resource',
          'operation',
          'time',
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
        export_json_to_excel(tHeader, data, '推送日志查询')
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      reset(){
          this.form.keyposition = '';
          this.form.institution = '';
          // this.form.devicename = '';
          this.form.resource = '';
          this.form.policetime = '';
          this.form.result = '全部';
          this.form.name = '';
          this.form.typeinstitution = '信访平台';
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
  .querys{
    margin-left: 20px;
    text-align: center;
  }
  .query{
    width: 928px;
    height: 202px;
    margin-left: 20px;
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
  .el-row{
    display: inline-block;
  }
  .buttons{
    // width: 928px;
    text-align: center;
    margin: 10px 0;
  }
  .lists{
    margin-left: 20px;
    // width: 1371px;
    height: 385px;
    p{
      text-align: center;
      line-height: 50px;
      font-size: 14px;
    }
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