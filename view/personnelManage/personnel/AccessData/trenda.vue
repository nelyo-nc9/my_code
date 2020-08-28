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
          <el-breadcrumb-item>趋势分析</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
    </div>
    <div class="button" >
       <el-button size="mini" v-for="(tab,index) in tabs" :key="index"
        @click="toggle(index,tab.view)" :class="{active:active==index}">{{tab.type}}</el-button>
      
    </div>
    <div class="all">
      <component :is="currentView"></component>
    </div>
    <el-table class="table"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        style="width:700px;margin-left:30px">
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column prop="orgName" label="机构" width="230" align="center"></el-table-column>
      <el-table-column prop="time" label="时间" width="199" align="center" ></el-table-column>
      <el-table-column prop="number" label="通行数量" width="210" align="center"></el-table-column>
    </el-table>
    <el-pagination class="pagination" 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length">
          </el-pagination>
  </div>
</template>
<script>
import days from "./tren/days"
import weeks from "./tren/weeks"
import months from "./tren/months"
export default {
  name: '',
  components: {
     days,
     weeks,
     months
  },
  data() {
    return {
      active:0,
      currentView:'days',
      tabs:[
        {
          type:'日',
          view:'days'
        },
        {
          type:'周',
          view:'weeks'
        },
        {
          type:'月',
          view:'months'
        }
      ],
      tableData:[
        {
          orgName:"河北省分行",
          time:"2020/3/8",
          number:'5'
        },
        {
          orgName:"河北省分行",
          time:"2020/3/9",
          number:'25'
        },
        {
          orgName:"河北省分行",
          time:"2020/3/10",
          number:'15'
        }
      ],
      total: 0,
      currentPage: 1, //初始页
      pagesize: 25, //    每页的数据
    }
  },
  mounted(){
    
  // this.drawLine()
  },
  methods: {
     toggle(i,v){
      this.active=i;
      this.currentView=v;
    },
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(this.pagesize) //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
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
    .pagination {
      width: 700px;
      margin-top: 10px;
      margin-left:30px
    }
  }
</style>