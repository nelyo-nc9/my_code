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
          <el-breadcrumb-item>时间维度统计</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
    </div>
    <div class="button" >
       <el-button size="mini" v-for="(tab,index) in tabs" :key="index"
        @click="toggle(index,tab.view)" :class="{active:active==index}">{{tab.type}}</el-button>
       <!-- <el-button size="mini" @click="ambtn">上下午</el-button>
       <el-button size="mini">日</el-button>
       <el-button size="mini">周</el-button>
       <el-button size="mini">月</el-button> -->
    </div>
    <div class="all">
      <component :is="currentView"></component>
    </div>
    <el-table class="table"
        :data="tableData"
        border
        style="width:700px;margin-left:30px">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column prop="orgName" label="机构" width="230" align="center"></el-table-column>
      <el-table-column prop="time" label="时间" width="199" align="center" ></el-table-column>
      <el-table-column prop="number" label="通行数量" width="210" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import ampm from "./components/ampm"
import hours from "./components/hours"
import day from "./components/day"
import week from "./components/week"
import month from "./components/month"
export default {
  name: '',
  components: {
    ampm,
    hours,
    day,
    week,
    month
  },
  data() {
    return {
      active:0,
      currentView:'hours',
      tabs:[
        {
          type:'小时',
          view:'hours'
        },
        {
          type:'上下午',
          view:'ampm'
        },
        {
          type:'日',
          view:'day'
        },
        {
          type:'周',
          view:'week'
        },
        {
          type:'月',
          view:'month'
        }
      ],
      tableData:[
        {
          orgName:"河北省分行",
          time:"7:00-8:00",
          number:'5'
        },
        {
          orgName:"河北省分行",
          time:"8:00-9:00",
          number:'25'
        },
        {
          orgName:"河北省分行",
          time:"9:00-10:00",
          number:'15'
        }
      ]
    }
  },
  mounted(){
    
  // this.drawLine()
  },
  methods: {
     toggle(i,v){
      this.active=i;
      this.currentView=v;
    }
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
    .button{
      width: 600px;
      margin-left: 50px;
      margin-top:20px;
      // button{
      //   width: 50px;
      //   height: 30px;
      //   border: none;
      // }
    }
    .all{
      width: 700px;
      height: 400px;
      margin-left: 30px;
      margin-top:20px;
      margin-bottom: 20px;
      #echarts{
        width: 700px;
        height: 400px;
      
      }
    }
  }
</style>