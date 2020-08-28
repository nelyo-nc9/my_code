<!-- 媒体网关 -->
<template>
  <div class="content">
    <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>监管系统对接</el-breadcrumb-item>
            <el-breadcrumb-item>国标互联</el-breadcrumb-item>
            <el-breadcrumb-item>网关配置</el-breadcrumb-item>
            <el-breadcrumb-item>下级域配置</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="main" v-show="isList">
         <div class="button-box">
          <el-button size="mini" @click="create">新建</el-button>
          <el-button size="mini" @click="edit">编辑</el-button>
          <el-button size="mini" @click="del">删除</el-button>
          <el-button size="mini" @click="sort">排序</el-button>
          <el-button size="mini" @click="Toprint">打印</el-button>
        </div>
        <div class="list-box-table">
          <el-table :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px;height:240px;" stripe border height="100%" max-height="345"
              :data="tableData" @select='select' @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="网关编号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column :row-style="{height:'10px'}" 
            :cell-style="{padding:'0px'}" style="font-size: 12px" 
            v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
            :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="pagination"
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length">
          </el-pagination>
      </div>
        <create v-if="isCreate" :back="close" :createNum="number"></create>
        <edit v-if="isEdit" :back='close' :talklist='talklist' :editNum='number'></edit>
        <sort v-if="isSort"></sort>
  </div>
</template>
<script>
import create from "./create"
import edit from "./edit"
import sort from "./sort"
export default {
  name: '',
  components: {
    create,
    edit,
    sort
  },
  data() {
    return {
       isList:true,
       isCreate:false,
       isEdit:false,
       isSort:false,
       title:"列表",
       columns: [
        { prop: 'orgName', sortable: false, label: '下级域名称', width: '130', sortable: true },
        { prop: 'subCode', sortable: false, label: '下级域编号', width: '130', sortable: true },
        { prop: 'ip', sortable: false, label: '下级域ip地址', width: '170', sortable: true },
        { prop: 'port', sortable: false, label: '下级域端口', width: '150', sortable: true },
        { prop: 'platfrom', sortable: false, label: '平台厂家类型', width: '160', sortable: true },
        { prop: 'cport', sortable: false, label: '级联协议', width: '160', sortable: true },
        { prop: 'status', sortable: false, label: '状态', width: '160', sortable: true },
        { prop: 'node', sortable: false, label: '流传输方式', width: '160', sortable: true },
        { prop: 'updatedAt', label: '更新时间', width: '160', sortable: true }
      ],
      tableData:[
        {
          orgName:'宁德分行',
          subCode:'3402000000001897222',
          ip:'192.168.14.208',
          port:1001,
          platfrom:'本家平台',
          status:'在线',
          node:"UDP",
          cport:300,
          updatedAt:'2020-8-1 09:00'
        },
        {
          orgName:'宁德外分行',
          subCode:'3402000000001897222',
          ip:'192.168.14.207',
          port:1001,
          platfrom:'本家平台',
          status:'在线',
          node:"UDP",
          cport:300,
          updatedAt:'2020-8-1 09:00'
        },
       
      ],
      talklist:[],
      delData:[],
      selectData:[],
      number:[],
      arr:[]
    }
  },
  methods: {
    create(){
      this.isList=false
      this.isCreate=true
      this.title='新建'
      this.number=3
    },
    close(){
      this.isList=true
      this.isEdit=false
      this.isSort=false
      this.title='列表'
    },
    edit(){
      if(this.arr.length===0){
           this.$notify.warning({
          title: '警告',
          message: '请选择要修改的下级域'
        })
      }else{
        this.isList=false
        this.isEdit=true
        this.title='修改'
        this.number=3
      }
    },
    sort(){
      this.isSort=true
      this.isList=false
      this.title="排序"
    },
    handleSelectionChange(val){   
      this.arr = [...val]
      console.log(val, '列表勾选')
     },
    select(s,row){
      this.talklist=row
      this.delData=s
      console.log(this.talklist)
    },
     del(){
       if(this.arr.length===0){
         this.$notify.warning({
          title: '警告',
          message: '请选择要删除的报警主机'
        })
       }else{
         this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$messageSuccess('删除成功')
      }).catch(() => {})  
        //  return this.$message("对啦")
        // this.$notify.warning({
        //   title: '警告',
        //   message: '请选择要删除的报警主机'
        // })
       }
      
    },
     Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      list = list.map(item => {
        return {
          orgName: item.orgName || '',
          subCode:item.subCode||'',
          ip: item.ip || '',
          cport:item.cport||'',
          node:item.node||'',
          platfrom:item.platfrom||'',
          port: item.port || '',
          status:item.status||'',
          updatedAt: item.updatedAt || '',
        }
      })
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '下级域名称' },
          { field: 'subCode', displayName: '下级域编号' },
          { field: 'ip', displayName: '下级域ip地址' },
          { field: 'port', displayName: '下级域端口' },
          { field: 'platfrom', displayName: '平台厂家类型' },
          { field: 'cport', displayName: '级联协议' },
          { field: 'status', displayName: '状态' },
          { field: 'node', displayName: '流传输方式' },
          { field: 'updatedAt', displayName: '更新时间' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">下级域列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111;",
        //内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;",
      })
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
   .content{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding:12px;
    .main{
      margin-top:20px;
      width: 100%;
      height: calc(~'100% - 56px');
      position: relative;
      .list-box-table {
        width: 1516px;
        height: calc(~'100% - 40px');
        margin-top:20px;
      }
      .pagination{
        position: absolute;
        top:80%;
        left: 50%;
      }
    }
   }
</style>