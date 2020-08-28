<!--  -->
<template>
  <div class="main">
      <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>人员出入管控</el-breadcrumb-item>
          <el-breadcrumb-item>门禁数据分析</el-breadcrumb-item>
          <el-breadcrumb-item>门禁维度统计</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
    </div>
    <div class="all">
       <div id="echarts"></div>
    </div>
    <el-table class="table"
        :data="tableData"
        border
        style="width:750px;margin-left:50px">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column prop="orgName" label="机构" width="180" align="center"></el-table-column>
      <el-table-column prop="keyPartName" label="重点部位" width="169" align="center"></el-table-column>
      <el-table-column prop="todayNumber" label="今日通行数量" width="170" align="center"></el-table-column>
      <el-table-column prop="yestNumber" label="昨日通行数量" width="170" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  data() {
    return {
      tableData:[
        {
          orgName:"河北省分行",
          keyPartName:"xxx监控中心",
          todayNumber:'5',
          yestNumber:'8'
        },
        {
          orgName:"河北省分行",
          keyPartName:"xxx金库",
          todayNumber:'25',
          yestNumber:'9'
        },
        {
          orgName:"河北省分行",
          keyPartName:"xxx营业网点",
          todayNumber:'15',
          yestNumber:'10'
        }
      ]
    }
  },
  methods: {
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echarts'))
        // 绘制图表
        myChart.setOption({
              tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              backgroundColor:'rgb(255,255,255,1)',
                  textStyle:{
                      color:"#585858",
                      fontSize:"12"
                  }
              },
              legend: {
                  data: ['today', 'yesterday'],
                  bottom:"0"
              },
              xAxis: [
                  {
                      type: 'category',
                      data: ['重点部位1','重点部位2','重点部位3','重点部位4','重点部位5']
                      
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      max:60,
                      interval:10,
                      splitLine:{
                         show:true,
                         lineStyle:{
                            type:'dashed'
                         }
                      },
                      axisLine:{       //y轴
                        "show":false
                      },
                      axisTick:{       //y轴刻度线
                        "show":false
                      },
                  }
              ],
              series: [
                  {
                      name: 'today',
                      type: 'bar',
                      data: [16, 14, 37, 16, 25],
                      itemStyle:{
                          normal:{
                              color:'#0099ff'
                          }
                      },
                  },
                  {
                      name: 'yesterday',
                      type: 'bar',
                      data: [12, 25, 29, 46, 28],
                      itemStyle:{
                          normal:{
                              color:'#00CC00'
                          }
                      },
                  }
              ]
          });
     }
  },
   mounted(){
     this.drawLine()
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  .main {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding:12px;
    .all{
      width: 750px;
      height: 400px;
      margin-left: 30px;
      margin-top:20px;
      margin-bottom: 20px;
      #echarts{
        width: 750px;
        height: 400px;
      
      }
    }
  }
</style>