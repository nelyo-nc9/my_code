<!-- 对讲通道关联配置 列表 -->
<template>
  <div class="list-box">
    <!-- 中间树 -->
    <orgTree  ref="tree" style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi" treeType='0' treeLazyToggle iconToggle @onceClick="onceClick"  @clickData="clickData"></orgTree>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top" v-if="activerelevance">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲通道关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box">
          <el-button size="mini" :disabled="selectItem.length !== 1" @click="relevancebtn">关联配置</el-button>
          <el-button size="mini" @click="gettalkbackChanneltList(1)">获取关联</el-button>
          <el-button size="mini" :disabled="selectItem.length !== 1" @click="examinebtn">查看关联拓扑</el-button>
          <el-button size="mini" @click="exportFile">导出</el-button>
        </div>
      </div>
      <div class="main" v-if="activerelevance">
        <div class="opt-box">
          <!-- <el-checkbox style="margin-right:12px;" v-model="showSubOrg" @change="keyPartId=''; gettalkbackChanneltList(1)">显示子机构</el-checkbox> -->
          <!-- <el-button type="text" icon="el-icon-refresh" @click="gettalkbackChanneltList">刷新列表</el-button> -->
          <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="small" @change="gettalkbackChanneltList(1)" placeholder="名称或者ip" v-model="search_text" ></el-input>
          <!-- <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small" @change="gettalkbackChanneltList(1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="2"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select> -->
        </div>
        <div class="list-box-table">
          <el-table :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
            style="font-size: 12px"
              stripe
              border
              height="calc(100% - 55px)"
              @selection-change="handleSelectionChange"
              :data="tableData"
              @select="select"
              @row-dblclick="dbEvent"
              >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="序号" prop="index" width="80" align="center"> </el-table-column>
          <el-table-column :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
            style="font-size: 12px"
              v-for="(column, index) in columns" :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              :formatter="formatterTable"
              show-overflow-tooltip
              align="center"
              >
              </el-table-column>
          </el-table>
          <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>

          <!-- 平台列表分页 -->
          <!-- <el-pagination class="pagination" 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length">
          </el-pagination> -->

        </div>
      </div>
      <!-- 关联配置 -->
      <relevance v-if="activelist" @clonelist="golist" :hostInfo="checkedData" @clearSelect="clearSelect" relatedType='1'></relevance>

      <!-- 查看关联拓扑 -->
      <examine v-if="activeExamine" @cloneExamine="goexamine" :hostInfo="checkedData"></examine>
    </div>
  </div>

</template>
<script>
import CenterTree from "../../../components/CenterTree"
import AudioPaination from "../../../components/AudioPagination"
import relevance from "./relevance"
import { getTalkbackLookListApi ,getChannelListApi} from '@src/http/audioManage/talkback.api.js'
import examine from "./examine"
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi,fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { mapActions } from 'vuex'
export default {
  name: '',
  components: {
    CenterTree,
    AudioPaination,
    relevance,
    examine,
    orgTree
  },
  data() {
    return {
      status: '',  // 查询条件 是否在线  
      search_text:'', // 查询条件 字段text
      // showSubOrg: true,  // 查询条件 是否显示子节点
      // orgId: [],  // 查询条件 组织机构主键id
      // keyPartId:'',  // 查询条件 重点部位主键id

      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '110' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '130' },
        { prop: 'platformName', sortable: true, label: '所属对讲平台', width: '130' },
        { prop: 'deviceName', sortable: true, label: '所属对讲主机', width: '120' },
        { prop: 'brand', sortable: true, label: '品牌', width: '110' },
        { prop: 'modelNum', sortable: true, label: '型号', width: '110' },
        { prop: 'serise', sortable: true, label: '通道号', width: '110' },
        { prop: 'name', sortable: true, label: '对讲通道名称', width: '120' },
        { prop: 'uniqueId', sortable: true, label: '对讲平台唯一ID', width: '130' },
        { prop: 'class', sortable: true, label: '应用类型', width: '110' },
        { prop: 'isVideoLink', sortable: true, label: '关联视频通道', width: '120' },
        { prop: 'isAudioLink', sortable: true, label: '关联对讲通道', width: '130' },
        { prop: 'isGuardLink', sortable: true, label: '关联门禁通道', width: '130' },
        { prop: 'isOutputLink', sortable: true, label: '关联输出通道', width: '130' },
        { prop: 'assetCode', sortable: true, label: '资产编码', width: '110' },
        { prop: 'status', label: '在线状态', width: '110' },
        // { prop: 'runStatus', label: '运行状态', width: '110' },
        { prop: 'updatedDept', label: '录入机构', width: '110' },
        { prop: 'updatedBy', label: '录入人', width: '110' },
        { prop: 'updatedAt', label: '录入时间', width: '110' }
      ],
      total: 0,
      limit: 25,
      activerelevance: true,
      activelist: false,
      activeExamine: false,
      tableData: [],
      
     checkedData:{}, // 单选 的对象
     selectItem:[],  // 多选的数组
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    // 机构树 api
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

    // 点击资源树
    onceClick(node) {
      console.log(node, 'node')
      if (node.tierType == "org") {
        this.orgId = node.id;
        this.keyPartId = '';
      } else if (node.tierType == "loc") {
        this.keyPartId = node.id;
        this.orgId = '';
      }
      this.gettalkbackChanneltList();
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

    // 获取列表
    gettalkbackChanneltList(page=1, limit=25) {
      let obj = {
        page: page,
        limit: limit,
        // rescusive:this.showSubOrg
      }
      
      // if(this.status){
      //   obj.status = this.status
      // }
      if(this.search_text){
        obj.key = this.search_text
      }
      if(this.orgId){
        obj.orgId = this.orgId
      }
      if(this.keyPartId){
        obj.keyPartId = this.keyPartId
      }

      getChannelListApi(obj).then(res => {
        if(res.data.code == 0){
          this.tableData = res.data.data.channels;
          this.tableData.forEach( (item,index) => {
            item.index = index+1;
          })
          this.total = res.data.data.count.total;
          this.$notify({
            title: '提示',
            message: '查询成功',
            position: 'top-right',
            type: 'success'
          });
        }
        
      } )
    },

    // 处理表格数据
    formatterTable(row, column, cellValue, index) {
      let params = ''
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
        // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
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
        //   }else if(cellValue == 6){
        //     params = '广播中';
        //   }else{
        //     params = '未知';
        //   }
        //   break
        // case 'class':
        //   params = callValue === 2 ? '业务' : "--"
        //   break
        case 'isVideoLink':
        case 'isAudioLink':
        case 'isGuardLink':
        case 'isOutputLink':
          params = cellValue === 2 ? '已关联' : ' '
          break
        case 'class':
          // 类型。1|客户，2|业务，3|金库
          if(cellValue == 1){
            params = '客户';
          }else if(cellValue == 2){
            params = '业务';
          }else if(cellValue == 3){
            params = '金库';
          }
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    clearSelect() {
      this.selectItem = []
    },

    // 依据数组对象某一个属性进行排序
    compare(prop){
      return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return value1 - value2;
      }
    },
   
    // 选中事件
    handleSelectionChange(selection) {
      var list = [...selection];
      list.sort(this.compare('index'));
      this.selectItem = list;
    },
    select(s, row) {
      this.checkedData = row
    },

    // 关联配置
    relevancebtn() {
      this.activerelevance = false,
      this.activelist = true
    },
    
    golist() {
      this.activerelevance = true;
      this.activelist = false;
      this.selectItem = [];
      this.gettalkbackChanneltList();
    },

    
    goexamine() {
      this.activeExamine = false,
      this.activerelevance = true
      this.selectItem = [];
      this.gettalkbackChanneltList();
    },

    // 查看关联拓扑
    examinebtn() {
      this.activerelevance = false,
      this.activeExamine = true
    },

    // 分页组件触发事件
    paginationConfChange(obj) {
      let {page, limit} = obj
      this.gettalkbackChanneltList(page, limit)
    },

    // 表格单元行 双击查看
    dbEvent(row){
      console.log(row)
      this.checkedData = row; 
      // this.id = row.id;
      this.activerelevance = false,
      this.activeExamine = true
    },

    //导出 
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['序号','所属机构', '所属重点部位', '所属对讲平台', '所属对讲主机', '品牌', '型号', '通道号', '对讲通道名称', '对讲平台唯一ID', '应用类型', '关联视频通道', '关联对讲通道 ', '关联门禁通道', '关联输出通道', '资产编码', '在线状态', '录入机构','录入人','录入时间',]
      // 字段名
      const filterVal = ['index','orgName', 'keyPartName', 'platformName', 'deviceName', 'brand', 'modelNum', 'serise', 'name', 'uniqueId', 'class', 'isVideoLink','isAudioLink', 'isGuardLink', 'isOutputLink', 'assetCode', 'status','updatedDept','updatedBy','updatedAt',]
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

        item.isVideoLink = item.isVideoLink == 1 ? ' ' : '已关联';
        item.isAudioLink = item.isAudioLink == 1 ? ' ' : '已关联';
        item.isGuardLink = item.isGuardLink == 1 ? ' ' : '已关联';
        item.isOutputLink = item.isOutputLink == 1 ? ' ' : '已关联';

        // 类型。1|客户，2|业务，3|金库
        if (item.class == 1) {
          item.class = '客户'
        } else if (item.class == 2) {
          item.class = '业务'
        } else if (item.class == 3) {
          item.class = '金库'
        }else{
          item.class = '未知'
        }

      })
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '对讲通道关联配置列表')
    },
    // 导出第二步
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    //新建按钮
    isCreatebtn() {
      console.log(111)
      this.CHANGE_TAB('IntercomPlatform-Create')
    },
    ...mapActions('talkback', {
      getChannelList: 'getChannelList'
    }),

    
  },
  created() {
    this.getRootNode();
    // this.gettalkbackChanneltList();
  },
  mounted(){
    this.$refs.listPagination.setTotal(this.limit)
  },
  beforeDestroy(){},
  
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
    .opt-box {
      height: 36px;
      margin: 10px 0;
      .el-checkbox{
        margin-top: 16px
      }
    }
    .top {
      .header {
        margin-top: 10px;
        margin-bottom: 20px;
      }
      .button-box{
        margin-top: 10px;
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 84px');
      position: relative;
      .list-box-table {
        width: 100%;
        height: calc(~'100% - 40px');
      }
    }
  }
}
</style>