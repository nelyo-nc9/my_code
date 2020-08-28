<!--  -->
<template>
  <div class="content">
     <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>监管系统对接</el-breadcrumb-item>
            <el-breadcrumb-item>共享管理</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="main">
         <div class="button-box">
          <el-button size="mini">断开连接</el-button>
          <el-button size="mini">停止共享</el-button>
          <el-button size="mini" @click="exportFile">导出</el-button>
          <el-button size="mini" @click="Toprint">打印</el-button>
        </div>
        <div class="list-box-table">
         <el-table :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px;" stripe border height="100%" max-height="345"
              :data="tableData">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column :row-style="{height:'10px'}" 
            :cell-style="{padding:'0px'}" style="font-size: 12px" 
            v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
            :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  data() {    
    return {
      title:'列表',
      columns: [
        { prop: 'nameNum', sortable: false, label: '平台类型', width: '110', sortable: true },
        { prop: 'name', sortable: false, label: '平台名称', width: '110', sortable: true },
        { prop: 'nameCode', sortable: false, label: '平台型号', width: '110', sortable: true },
        { prop: 'nameChannl', sortable: false, label: '厂家', width: '110', sortable: true },
        { prop: 'ip', sortable: false, label: 'ip地址', width: '180', sortable: true },
        { prop: 'code', sortable: false, label: '国标编号', width: '180', sortable: true },
        { prop: 'status', sortable: false, label: '状态', width: '110', sortable: true },
        { prop: 'lookType', sortable: false, label: '资源调阅类型', width: '180', sortable: true },
        { prop: 'lookBack', sortable: false, label: '调阅资源记录', width: '230', sortable: true },
        { prop: 'updatedAt',sortable: false,label: '开始时间', width: '180', sortable: true },
        { prop: 'updatedAt',sortable: false,label: '结束时间', width: '180', sortable: true }
      ],
      tableData:[
        {
           nameNum:'公安110平台',
           name:'保定市公安局',
           nameCode:'IVMS8000',
           nameChannl:'海康威视',
           ip:'192.168.14.208',
           code:'123456789012',
           status:'在线',
           lookType:'预览视屏',
           lookBack:'保定分行/正北路营业网点/视屏监控主机tc500',
           updatedAt:'2020-8-4 05:59',
        },
        {
           nameNum:'公安110平台',
           name:'保定市公安局',
           nameCode:'IVMS8000',
           nameChannl:'海康威视',
           ip:'192.168.14.208',
           code:'123456789012',
           status:'在线',
           lookType:'预览视屏',
           lookBack:'保定分行/正北路营业网点/视屏监控主机tc500',
           updatedAt:'2020-8-4 05:59',
        },
        {
           nameNum:'公安110平台',
           name:'保定市公安局',
           nameCode:'IVMS8000',
           nameChannl:'海康威视',
           ip:'192.168.14.208',
           code:'123456789012',
           status:'在线',
           lookType:'预览视屏',
           lookBack:'保定分行/正北路营业网点/视屏监控主机tc500',
           updatedAt:'2020-8-4 05:59',
        },
      ]
    }
  },
  methods: {
    //导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['平台类型', '平台名称', '平台型号', '厂家', 'ip地址', '国标编号', '状态', '资源调阅类型', '调阅资源记录', '开始时间', '结束时间',]
      // 字段名
      const filterVal = ['nameNum', 'name', 'nameCode', 'nameChannl', 'ip', 'code', 'status', 'lookType', 'lookBack', 'updatedAt', 'updatedAt', ]
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '共享管理列表')
    },
    // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //打印
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
          nameNum: item.nameNum || '',
          name: item.name || '',
          nameCode: item.nameCode || '',
          nameChannl: item.nameChannl || '',
          ip: item.ip || '',
          code: item.code || '',
          status: item.status || '',
          lookType: item.lookType || '',
          lookBack: item.lookBack || '',
          updatedAt: item.updatedAt || '',
        }
      })
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'nameNum', displayName: '平台类型' },
          { field: 'name', displayName: '平台名称' },
          { field: 'nameCode', displayName: '平台型号' },
          { field: 'nameChannl', displayName: '厂家' },
          { field: 'ip', displayName: 'ip地址' },
          { field: 'code', displayName: '国标编号' },
          { field: 'status', displayName: '状态' },
          { field: 'lookType', displayName: '资源调阅类型' },
          { field: 'lookBack', displayName: '调阅资源记录' },
          { field: 'updatedAt', displayName: '开始时间' },
          { field: 'updatedAt', displayName: '结束时间' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">媒体网关列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ",
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
    .main {
      margin-top:20px;
      width: 100%;
      height: calc(~'100% - 56px');
      position: relative;
      .list-box-table {
        margin-top:20px;
        width: 99%;
        height: calc(~'100% - 40px');
      }
    }
   }
</style>