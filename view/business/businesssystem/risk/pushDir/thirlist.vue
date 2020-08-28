<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>推送日志</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 列表部分 -->
    <div>
      <el-row class="buttons">
        <el-button @click="exportFile">导出</el-button>
        <el-button @click="Toprint">打印</el-button>
      </el-row>
      <div class="lists">
        <p>推送日志列表</p>
        <div>
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
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      currpage: 1,
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
          number: '2',
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
        export_json_to_excel(tHeader, data, '推送日志列表')
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
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
          { field: 'number', displayName: '序号' },
          { field: 'keyposition', displayName: '所属机构' },
          { field: 'subsidiaryorgan', displayName: '所属重点部位' },
          { field: 'devicename', displayName: '资源名称' },
          { field: 'resource', displayName: '推送对象' },
          { field: 'operation', displayName: '抓拍时间' },
          { field: 'time', displayName: '推送时间' },
          { field: 'date', displayName: '推送结果' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">推送日志列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
        //内容样式
        gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
      })
    },
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
  .buttons{
    margin-left: 20px;
  }
  .lists{
    margin-left: 20px;
    width: 100%;
    margin-right: 20px;
    height: 718px;
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