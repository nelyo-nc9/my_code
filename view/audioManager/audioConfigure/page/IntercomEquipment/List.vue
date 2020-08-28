<!--对讲设备配置管理  -->
<template>
  <div class="list-box">
    <!-- 中间树 -->
    <orgTree ref="tree" style="width:290px" :lazyTreeApi="getAudioTreeApi" :treeType="treeType" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi" treeLazyToggle iconToggle @onceClick="onceClick" @clickData="clickData"></orgTree>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲设备配置</el-breadcrumb-item>
            <el-breadcrumb-item>{{topTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main" v-if="hostConfigShow">
        <div class="button-box">
          <el-button size="mini" @click="hostConfigEditBtn">
            <i class="el-icon-edit"></i>
            <span>编辑</span>
          </el-button>
          <el-button size="mini" @click="del">
            <i class="el-icon-delete"></i>
            <span>删除</span>
          </el-button>
          <el-button size="mini" @click="move">
            <i class="icon el-icon-rank"></i>
            <span>迁移</span>
          </el-button>
          <el-button size="mini" @click="examinebtn">
            <i class="el-icon-view"></i>
            <span>查看</span>
          </el-button>
          <el-button size="mini" @click="sort">
            <i class="icon el-icon-sort"></i>
            <span>排序</span>
          </el-button>
          <!-- <el-button size="small" disabled>导入</el-button> -->
          <el-button size="mini" @click="exportFile">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>
            <span>导出</span>
          </el-button>
          <el-button size="mini" @click="Toprint">
            <i class="el-icon-printer"></i>
            <span>打印</span>
          </el-button>
        </div>
        <div class="opt-box">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg" @change="keyPartId=''; getTalkbackHost(1)">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="getTalkbackHost(1)">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="small" v-model="search_text" @change="getTalkbackHost(1)" placeholder="名称或者ip"></el-input>
          <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small" @change="getTalkbackHost(1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="2"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select>
        </div>
        <div class="list-box-table">
          <el-table  :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px" stripe border height="calc(100% - 55px)" @selection-change="handleSelectionChange" :data="tableData" @select="select" @row-dblclick="dbEvent">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" prop="index" width="80" align="center"> </el-table-column>
            <el-table-column :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px" v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" :formatter="formatterTable" show-overflow-tooltip align="center">
            </el-table-column>
          </el-table>
          <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>
        </div>
      </div>

      <!-- 编辑 -->
      <edit v-if="hostEditShow" @closeEdit='guanbiBtn' @examine='examine' :talklist="checkedData"></edit>

      <!-- 查看 -->
      <examine v-if="examineShow" @closeEdit='guanbiBtn' :talklist="checkedData"></examine>

      <!-- 迁移 -->
      <hostmove v-if="hostMoveShow" @closeMove="closea" :migrantData="moveData"></hostmove>

      <!-- 排序 -->
      <hostsort v-if="hostSortShow" @closeSort="closeb" :detailData="checkedData"></hostsort>

    </div>
  </div>
</template>
<script>
import CenterTree from "../../../components/CenterTree"
import AudioPaination from "../../../components/AudioPagination"
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { getHostListApi, deletHoststListApi } from "@src/http/audioManage/talkback.api.js"
import Edit from "./Edit"
import examine from "./examine"
import hostmove from "./hostmove"
import hostsort from "./hostsort"
import { mapActions, mapMutations } from "vuex"
export default {
  name: '',
  components: {
    CenterTree,
    AudioPaination,
    Edit,
    examine,
    hostmove,
    hostsort,
    orgTree,

  },
  data() {
    return {
      orgId:'',  // 组织机构主键id
      keyPartId:'',  // 查询条件 重点部位主键id
      status: '',  // 查询条件 是否在线  
      search_text:'', // 查询条件 字段text
      showSubOrg: true,  // 查询条件 是否显示子节点

      treeType: 0,  // 机构树 类型
      topTitle: '列表',
      tableData: [],   // 表格列表数据
      columns: [
        { prop: 'orgName', sortable: false, label: '所属机构', width: '110',sortable: true  },
        { prop: 'keyPartName', sortable: false, label: '所属重点部位',  width: '150',sortable: true },
        { prop: 'platformName', sortable: false, label: '所属对讲平台名称',  width: '160',sortable: true },
        { prop: 'name', sortable: false, label: '主机名称',  width: '110',sortable: true },
        { prop: 'uniqueId', sortable: false, label: '对讲主机唯一ID',  width: '130',sortable: true },
        { prop: 'brand', sortable: false, label: '品牌',  width: '110',sortable: true },
        { prop: 'modelNum', sortable: false, label: '型号',  width: '110',sortable: true },
        { prop: 'ip', sortable: false, label: 'IP地址',  width: '110',sortable: true },
        { prop: 'intercomNumber', sortable: false, label: '对讲通道数量',  width: '130',sortable: true },
        { prop: 'outputNumber', sortable: false, label: '输出通道数量',  width: '130',sortable: true },
        { prop: 'assetCode', sortable: false, label: '资产编码',  width: '110',sortable: true },
        { prop: 'status', label: '在线状态',  width: '110',sortable: true},
        // { prop: 'runStatus', label: '运行状态',  width: '110',sortable: true },
        { prop: 'updatedDept', label: '录入机构',  width: '110',sortable: true },
        { prop: 'updatedBy', label: '录入人',  width: '110',sortable: true },
        { prop: 'updatedAt', label: '录入时间',  width: '150',sortable: true }
      ],
      total: 0,
      limit: 25,
      checkedData: [],  //选中的列表数据(单选)
      selectData:[],  // 选中的列表数据(多选)
      
      hostConfigShow: true,
      hostEditShow: false,
      examineShow: false,
      activeCreate: true,
      hostMoveShow: false,
      hostSortShow: false,
      moveData:[],
    }
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

    // 点击机构树
    onceClick(node) {
      console.log(node, 'node')
    
      if (node.tierType == "org") {
        this.orgId = node.id;
        this.keyPartId = '';
      } else if (node.tierType == "loc") {
        this.keyPartId = node.id;
        this.orgId = '';
      }
      this.getTalkbackHost();
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

    // 获取 对讲设备列表
    getTalkbackHost(page=1, limit=25) {
     let obj = {
        page: page,
        limit: limit,
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

      getHostListApi(obj).then(res => {
        
        if(res.data.code == 0){
          this.tableData = res.data.data.hosts;
          this.tableData.forEach( (item,index) => {
            item.index = index+1;
          })
          this.total = res.data.data.count.total || 0;
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
          if(cellValue === 2){
            params = '在线';
          }else if(cellValue === 1){
            params = '离线';
          }else{
            params = "未知";
          }
          break
        
        // case 'runStatus':
        //   // runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        //   if(cellValue === 1){
        //     params = '离线';
        //   }else if(cellValue === 2){
        //     params = '空闲';
        //   }else if(cellValue === 3){
        //     params = '呼出';
        //   }else if(cellValue === 4){
        //     params = '响铃';
        //   }else if(cellValue === 5){
        //     params = '对讲中';
        //   }else if(cellValue === 6){
        //     params = '广播中';
        //   }else{
        //     params = "未知";
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
        default:
          params = cellValue
          break
      }
      return params
    },

    // 依据数组对象某一个属性进行排序
    compare(prop){
      return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return value1 - value2;
      }
    },

    // 列表选中事件 单选
    select(s, row) {
      this.checkedData = this.$lodash.cloneDeep(row)
      this.id = row.id
      console.log(this.id)
      this.moveData=s
      console.log(this.moveData)
    },

    // 列表选中事件 多选
    handleSelectionChange(val) {
      // this.selectData = val;
      var list = [...val];
      list.sort(this.compare('index'));
      this.selectData = list;
    },

    // 排序
    sort() {
      if (this.selectData.length === 0) {
        return this.$message("请勾选列表");
      }if (this.selectData.length >1 ) {
        return this.$message('只能勾选一项');
      } else {
        this.hostConfigShow = false
        this.hostSortShow = true
        this.topTitle = "排序"
      }

    },

    closeb() {
      this.hostConfigShow = true
      this.hostSortShow = false
      this.topTitle = "列表"
      this.selectData = [];
      this.getTalkbackHost();
    },

    // 迁移
    move() {
      if (this.selectData.length === 0) {
        return this.$message("请勾选列表");
      }else{
        this.hostConfigShow = false
        this.hostMoveShow = true
        this.topTitle = "迁移"
      }
    },

    closea() {
      this.hostConfigShow = true
      this.hostMoveShow = false
      this.topTitle = "列表"
      this.selectData = [];
      this.getTalkbackHost();
    },

    // 分页
    paginationConfChange(obj) {
      let {page, limit} = obj
      this.getTalkbackHost(page, limit)
    },

    //修改
    hostConfigEditBtn() {
      console.log('编辑啦')
      if (this.selectData.length === 0) {
        return this.$message("请勾选列表")
      } else if(this.selectData.length>1){
        this.$message('只能勾选一项')
      }else {
        this.hostConfigShow = false, this.hostEditShow = true
        if (this.topTitle = "列表") {
          this.topTitle = '编辑'
        } else if (this.topTitle = "编辑") {
          this.topTitle = '列表'
        }
      }
    },

    // 查看
    examinebtn() {
      if (this.selectData.length === 0) {
        return this.$message("请勾选列表");
      }if (this.selectData.length >1 ) {
        return this.$message('只能勾选一项');
      } else {
        this.examineShow = true;
        this.hostConfigShow = false
      }
    },

    // 表格单元行 双击查看
    dbEvent(row){
      console.log(row)
      this.checkedData = row;
      this.id = row.id;
      // this.$emit('modelChange','examine',this.checkedData)
      this.examineShow = true;
      this.hostConfigShow = false;
    },


    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['序号','所属机构', '所属重点部位', '所属对讲平台名称', '主机名称', '对讲主机唯一ID', '品牌', '型号', 'IP地址', '对讲通道数量', '输出通道数量', '资产编码', '在线状态', '录入机构', '录入人', '录入时间']
      // 字段名
      const filterVal = ['index','orgName', 'keyPartName', 'platformName', 'name', 'uniqueId', 'brand', 'modelNum', 'ip', 'intercomNumber', 'outputNumber', 'assetCode', 'status', 'updatedDept', 'updatedBy','updatedAt']
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectData)
      } else {
        list = this.$lodash.cloneDeep(this.tableData)
      }

      list.forEach((item,index) => {

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

      console.log(list)

      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '对讲设备配置列表')
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
        list = this.$lodash.cloneDeep(this.selectData)
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

        // 做空字符验证处理
        item.orgName = item.orgName ? item.orgName : '';
        item.keyPartName = item.keyPartName ? item.keyPartName : '';
        item.platformName = item.platformName ? item.platformName : '';
        item.name = item.name ? item.name : '';
        item.uniqueId = item.uniqueId ? item.uniqueId : '';
        item.brand = item.brand ? item.brand : '';
        item.modelNum = item.modelNum ? item.modelNum : '';
        item.ip = item.ip ? item.ip : '';

        item.intercomNumber = item.intercomNumber ? item.intercomNumber : '';
        item.outputNumber = item.outputNumber ? item.outputNumber : '';
        item.assetCode = item.assetCode ? item.assetCode : '';
        item.status = item.status ? item.status : '';
        item.updatedDept = item.updatedDept ? item.updatedDept : '';
        item.updatedBy = item.updatedBy ? item.updatedBy : '';
        item.updatedAt = item.updatedAt ? item.updatedAt : '';

      })
      console.log(list)

      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'index', displayName: '序号' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'platformName', displayName: '所属对讲平台名称' },
          { field: 'name', displayName: '主机名称' },
          { field: 'uniqueId', displayName: '对讲主机唯一ID' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'intercomNumber', displayName: '对讲通道数量' },
          { field: 'outputNumber', displayName: '输出通道数量' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'status', displayName: '在线状态' },
          // { field: 'status', displayName: '运行状态' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' },

        ],
  
        type: 'json',
        // 表题 
        header: '<p class="custom">对讲设备配置列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ",
        //内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;",
      })
    },

    //删除主机
    del() {
      if (this.selectData.length === 0) {
        return this.$message('请勾选编辑项')
      }
      this.$confirm('确认删除选择项么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.selectData.map(item => {
          let { id } = item
          return id
        })
        console.log(ids)
        deletHoststListApi({ ids }).then(res => {
          if (res.data.code === 0) {
            this.getTalkbackHost();
          }
          console.log(res)
        })
      })
    },
    
    examine() {
      this.hostEditShow = false
      this.hostConfigShow = false
      this.examineShow = true
    },
    guanbiBtn() {
      this.hostConfigShow = true
      this.hostEditShow = false
      this.examineShow = false
      if (this.topTitle = "编辑") {
        this.topTitle = "列表"
      }
      this.selectData = [];
      this.getTalkbackHost();
    },
    ...mapActions('talkback', {
      talkbackHostList: 'talkbackHostList',
    }),

    
  },
  created() {
    // this.getTalkbackHost()
    this.getRootNode();
  },
  mounted () {
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
      height: calc(~'100% - 58px');
      position: relative;
      .opt-box{
        height: 36px;
        margin-bottom: 10px;
        margin-top: 8px;
      }
      .list-box-table {
        width: 100%;
        height: calc(~'100% - 66px');
      }
    }
  }
}
</style>