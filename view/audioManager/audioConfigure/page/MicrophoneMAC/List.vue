<!--mac 地址 绑定  -->
<template>
  <div class="list-box">
    <!-- 中间树 -->
    <orgTree ref="tree" style="width:290px" :lazyTreeApi="getAudioTreeApi" :treeType="0" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi" treeLazyToggle iconToggle @onceClick="onceClick" @clickData="clickData"></orgTree>
    <div class="content" v-if="activeEdit">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>话筒MAC地址绑定</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box">
          <el-button size="mini" @click="editbtn">绑定</el-button>
          <el-button size="mini" @click="exam">查看</el-button>
          <el-button size="mini" @click="exportFile">导出</el-button>
        </div>
      </div>
      <div class="main">
        <div class="opt-box">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg" @change="keyPartId=''; getlist(1)">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="getlist(1)">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="small" placeholder="资源名称或ip地址" v-model="search_text" @change="getlist(1)"></el-input>
          <!-- <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small" @change="getlist(1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="2"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select> -->
        </div>
        <div class="list-box-table">
          <el-table :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px" stripe border height="calc(100% - 55px)" :data="tableData" @select="select" @selection-change="handleSelectionChange" @row-dblclick="dbEvent">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" prop="index" width="80" align="center"> </el-table-column>
            <el-table-column :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" :formatter="formatterTable" style="font-size: 12px" v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
          <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>
        </div>
      </div>
    </div>

    <!-- 编辑 -->
    <Edit v-if="activeList" @closeList="clone" :talklist="talklist"></Edit>
    <!-- 查看 -->
    <examine v-if="activeExam" @closeList="clone" :talklist="talklist"></examine>

  </div>
</template>
<script>
import CenterTree from "../../../components/CenterTree"
import AudioPaination from "../../../components/AudioPagination"
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { getMacListApi, getHostListApi } from "@src/http/audioManage/talkback.api.js"
import Edit from "./Edit"
import examine from "./examine"
export default {
  name: '',
  components: {
    CenterTree,
    AudioPaination,
    Edit,
    orgTree,
    examine,
  },
  data() {
    return {
      status: '',  // 查询条件 是否在线  
      search_text:'', // 查询条件 字段text
      showSubOrg: true,  // 查询条件 是否显示子节点
      orgId: [],  // 查询条件 组织机构主键id
      keyPartId:'',  // 查询条件 重点部位主键id
      limit: 25,

      columns: [
        { prop: 'orgName', sortable: false, label: '所属机构', width: '110',sortable: true },
        { prop: 'keyPartName', sortable: false, label: '所属重点部位', width: '140',sortable: true },
        { prop: 'platformName', sortable: false, label: '所属对讲平台', width: '130',sortable: true },
        { prop: 'name', sortable: false, label: '资源名称', width: '110',sortable: true },
        { prop: 'uniqueId', sortable: false, label: '唯一ID', width: '120',sortable: true },
        { prop: 'ip', sortable: false, label: 'IP地址', width: '110',sortable: true },
        { prop: 'mac', sortable: false, label: '绑定mac地址', width: '130',sortable: true },
        { prop: 'assetCode', label: '资产编码', width: '110',sortable: true },
        { prop: 'status', label: '在线状态', width: '110',sortable: true},
        // { prop: 'runStatus', label: '运行状态', width: '110',sortable: true},
        { prop: 'updatedDept', label: '录入机构', width: '110',sortable: true },
        { prop: 'updatedBy', label: '录入人', width: '110',sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '150',sortable: true }
      ],
      total: 0,
      activeEdit:true,
      activeList:false,
      activeExam:false,
      tableData:[
        
      ],
      talklist: [],
      selectItem: [],  // 选中的项 （多选）  
    }
  },
  methods: {

    // 机构资源树 api
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 获取根节点
    getRootNode(){
      var params = {type:0};
      getAudioTreeApi(params).then(res=>{
        console.log(res.data)
        this.onceClick(res.data.data.nodes[0])
      })
    },

    clickData(data) { // 机构树加载节点信息
      // console.log('clickData', data)
      if (data && data.id) { // 返回机构树加载根节点信息
        // this.nodeData = data
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },

    onceClick(node) {
      console.log(node, 'node')
      this.oid = node.id
      this.owerOrgName = node.name
      this.orgId = this.oid;
      if (node.tierType == "org") {
        this.orgId = node.id;
        this.keyPartId = ''
      } else if (node.tierType == "loc") {
        this.keyPartId = node.id;
        this.orgId = '';
      }
      this.getlist();
    },

    // 获取列表数据
    getlist(page=1, limit=25) {
      let obj = {
        page: page,
        limit: limit,
        type: 2,  // 主机主类型。可以选 空、1、2。空或者不传：所有. 1: 对讲主机,2:台麦
        // status:this.status,
        // key:this.search_text,
        // rescusive:this.showSubOrg,
        // orgId:this.orgId,
        // keyPartId:this.keyPartId,
      }
      
      if(this.status){
        obj.status = this.status
      }
      if(this.orgId){
        obj.orgId = this.orgId
      }
      if(this.keyPartId){
        obj.keyPartId = this.keyPartId
      }
      if(this.search_text){
        obj.key = this.search_text
      }
      if(this.showSubOrg){
        obj.rescusive = this.showSubOrg
      }
      
      // let obj = {
      //   page: 1,
      //   limit: 100,
      //   type: 2,
      // }
      getHostListApi(obj).then(res => {
        if(res.data.code == 0){
          this.tableData = res.data.data.hosts;
          this.tableData.forEach( (item,index) => {
            item.index = index+1;
          })
          this.$notify({
            title: '提示',
            message: '查询成功',
            position: 'top-right',
            type: 'success'
          });
        }
      })
    },

    // 处理表格数据
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          if(cellValue == 2){
            params = '在线';
          }else if(cellValue == 1){
            params = '离线';
          }else{
            params = '未知';
          }
          break
        // case 'runStatus':
        //   if(cellValue == 1){
        //     params = '离线';
        //   }else if(cellValue == 2){
        //     params = '空闲';
        //   }else if(cellValue == 3){
        //     params = '呼出';
        //   }else if(cellValue == 4){
        //     params = '响铃';
        //   }else if(cellValue == 5){
        //     params = '对讲中';
        //   }else{
        //     params = '广播中';
        //   }
        //   break
          
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
          break
        case 'type':
          obj = {
            1: 'NVR',
            2: 'HDVR',
            3: 'DVR',
            4: 'IPC'
          }
          params = obj[cellValue] || ''
          break
        case 'protocol':
          obj = {
            1: 'TCP',
            2: 'UDP'
          }
          params = obj[cellValue] || ''
          break
        case '':
          params = cellValue === '' ? '未配置' : cellValue
          break
        default:
          params = cellValue
          break
      }
      return params
    },

    paginationConfChange(obj) {
      this.getlist(obj.page, obj.limit)
    },

    // 分页组件触发事件
    handleSelectionChange(selection) {
      var list = [...selection];
      list.sort(this.compare('index'));
      this.selectItem = list;
    },

    // 依据数组对象某一个属性进行排序
    compare(prop){
      return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return value1 - value2;
      }
    },

    // 编辑
    editbtn() {
      if (this.selectItem.length === 0) {
        this.$message("请勾选配置项")
      } else {
        this.activeEdit = false
        this.activeList = true
      }
    },

    // 编辑close emit 方法
    clone() {
      this.activeEdit = true;
      this.activeList = false;
      this.activeExam = false;
      this.selectItem = [];
    },

    // 查看按钮触发 查看
    exam() {
      if (this.selectItem.length === 0) {
        this.$message("请勾选配置项")
      } else {
        this.activeEdit = false;
        this.activeExam = true;
      }
    },

    // 双击 查看
    dbEvent(row){
      console.log(row)
      this.talklist = row
      this.id = row.id

      this.activeEdit = false;
      this.activeExam = true;
    },
    
    
    // 单选
    select(s, row) {
      this.talklist = row;
      this.id = row.id;
    },
    
    //导出 
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['序号','所属机构', '所属重点部位', '对讲平台名称', '资源名称', '唯一ID', 'IP地址', '绑定mac地址', '资产编码', '在线状态', '运行状态','录入机构', '录入人', '录入时间']
      // 字段名
      const filterVal = ['index','orgName', 'keyPartName', 'platformName', 'name', 'uniqueId', 'ip', 'mac', 'assetCode', 'status', 'runStatus','updatedDept', 'updatedBy', 'updatedAt']
      let list = []
      // 导出全部或导出选中
      if (this.selectItem && this.selectItem.length > 0) {
        list = this.$lodash.cloneDeep(this.selectItem)
      } else {
        list = this.$lodash.cloneDeep(this.tableData)
      }

      list.forEach((item,index) => {
        // item.index = index+1;

        if (item.status == 2) {
          item.status = '在线'
        } else if (item.status == 1) {
          item.status = '离线'
        }else{
          item.status = '未知'
        }

        // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        // if (item.runStatus == 1) {
        //   item.runStatus = '离线'
        // } else if (item.runStatus == 2) {
        //   item.runStatus = '空闲'
        // }else if (item.runStatus == 3) {
        //   item.runStatus = '呼出'
        // }else if (item.runStatus == 4) {
        //   item.runStatus = '响铃'
        // }else if (item.runStatus == 5) {
        //   item.runStatus = '对讲中'
        // }else if (item.runStatus == 6) {
        //   item.runStatus = '广播中'
        // }else{
        //   item.runStatus = '未知'
        // }

      })

      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '话筒MAC地址绑定列表')
    },
    // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  },
  created() {
    // this.getlist()
    this.getRootNode();
  },
  mounted(){
    this.$refs.listPagination.setTotal(this.limit)
  }
}
</script>
<style lang="less" scoped>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: calc(~'100% - 290px');
    padding: 0 20px;
    .top {
      .header {
        margin-top: 10px;
        margin-bottom: 20px;
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 84px');
      position: relative;
      .opt-box{
        height: 36px;
        margin: 8px 0 10px;
      }
      .list-box-table {
        width: 100%;
        height: calc(~'100% - 40px');
      }
    }
    .pagination {
      // position: absolute;
      // bottom: -30px;
      // right: 500px;
    }
  }
}
</style>