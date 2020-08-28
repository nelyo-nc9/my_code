<!--对讲平台  列表 -->
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
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲管理配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="mini" @click="isCreatebtn">
            <i class="el-icon-plus"></i>
            <span>新建</span>
          </el-button>
          <el-button size="mini" @click="edit">
            <i class="el-icon-edit"></i>
            <span>编辑</span>
          </el-button>
          <el-button size="mini" @click="del">
            <i class="el-icon-delete"></i>
            <span>删除</span>
          </el-button>
          <el-button size="mini" @click="getSourceEquipment">
            <i class="icon el-icon-circle-check"></i>
            <span>获取</span>
          </el-button>
          <el-button size="mini" @click='move'>
            <i class="icon el-icon-rank"></i>
            <span>迁移</span>
          </el-button>
          <el-button size="mini" @click="look">
            <i class="el-icon-view"></i>
            <span>查看</span>
          </el-button>
          <el-button size="mini" @click="sort">
            <i class="icon el-icon-sort"></i>
            <span>排序</span>
          </el-button>
          <el-button size="mini" @click="exportFile">
            <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>
            <span>导出</span>
          </el-button>
          <el-button size="mini" @click="Toprint">
            <i class="el-icon-printer"></i>
            <span>打印</span>
          </el-button>
        </div>
      </div>

      <div class="main">
        <!-- 查询条件 -->
        <div class="opt-box">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg" @change="getTalkback(1)">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="small" placeholder="名称或者ip" v-model="search_text" @change="getTalkback(1)"></el-input>
          <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small" @change="getTalkback(1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="2"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select>
        </div>

        <div class="list-box-table">
          <!-- 平台列表表格 -->
          <el-table :row-style="{height:'10px'}" :cell-style="{padding:'0px'}" style="font-size: 12px;" stripe border height="calc(100% - 50px)"
              :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" @select="selectsss"  @selection-change="handleSelectionChange" @row-dblclick="dbEvent">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" prop="index" width="80" align="center"></el-table-column>
            <el-table-column :row-style="{height:'10px'}" 
            :cell-style="{padding:'0px'}" style="font-size: 12px" 
            v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
            :sortable="column.sortable" show-overflow-tooltip align="center" :formatter="formatterTable">
            </el-table-column>
          </el-table>

          <!-- 平台列表分页 -->
          <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

import AudioPaination from "../../../components/AudioPagination"
import { getTalkbackListApi,getAudioHostlistApi } from '@src/http/audioManage/talkback.api.js'
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: '',
  components: {
    orgTree,
    AudioPaination,
  },
  data() {
    return {
      treeType: 2,

      status: '',  // 查询条件 是否在线  
      search_text:'', // 查询条件 字段text
      showSubOrg: true,  // 查询条件 是否显示子节点
      orgId: [],  // 查询条件 组织机构主键id
      keyPartId:'',  // 查询条件 重点部位主键id

      tableData: [], // 对讲平台列表
      columns: [
        { prop: 'orgName', sortable: false, label: '所属机构', width: '110', sortable: true },
        { prop: 'keyPartName', sortable: false, label: '所属重点部位', width: '150', sortable: true },
        { prop: 'name', sortable: false, label: '对讲平台名称', width: '120', sortable: true },
        { prop: 'brand', sortable: false, label: '品牌', width: '110', sortable: true },
        { prop: 'modelNum', sortable: false, label: '型号', width: '110', sortable: true },
        { prop: 'accessProtocol', sortable: false, label: '接入协议', width: '110', sortable: true },
        { prop: 'uniqueId', sortable: false, label: '对讲平台唯一ID', width: '130', sortable: true },
        { prop: 'ip', sortable: false, label: 'IP地址', width: '110', sortable: true },
        { prop: 'port', sortable: false, label: '终端接收端口', width: '130', sortable: true },
        { prop: 'cport', sortable: false, label: '服务器接收端口', width: '130', sortable: true },
        { prop: 'dport', sortable: false, label: '级联音频端口', width: '130', sortable: true },
        { prop: 'username', label: '用户名', width: '110', sortable: true },
        // { prop: 'password', label: '密码', width: '110', sortable: true },
        { prop: 'assetCode', sortable: false, label: '资产编码', width: '110', sortable: true },
        { prop: 'status', label: '在线状态', width: '110', sortable: true },
        { prop: 'updatedDept', label: '录入机构', width: '110', sortable: true },
        { prop: 'updatedBy', label: '录入人', width: '110', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '110', sortable: true }
      ],
      
      total: 0,
      currentPage: 1, //初始页
      pagesize: 25, //    每页的数据
      
      selectData: [],  //列表勾选数据数组
      checkedData: [],  // 单选 内容
      
    }
  },
  watch:{ },
  methods: {

    // 机构资源树
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

    // 资源树 点击
    onceClick(node) {
      console.log(node, 'node')
      if (node.tierType == "org") {
        this.orgId = node.id;
        this.keyPartId = '';
      } else if (node.tierType == "loc") {
        this.keyPartId = node.id;
        this.orgId = '';
      }
      console.log(457877854)
      this.getTalkback();
    },

    // 获取对讲平台列表
    getTalkback(page=1, limit=25) {
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

      this.talkbackList(obj).then( res => {
        console.log(res);
        let { data } = res.data;
        this.tableData = data.platforms;
        this.tableData.forEach( (item,index) => {
          item.index = index+1;
        })
        this.total = data.count.total || 0;
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

    // 获取 平台下 已经配置的 设备（需要世邦提供底层接口，暂不支持）
    getSourceEquipment(){
      this.$message.error('获取失败');
    },

    // 刷新
    refresh() {
      this.getTalkback();
      this.$notify({
        title: '提示',
        message: '查询成功',
        position: 'top-right',
        type: 'success'
      });
    },

    //新建按钮
    isCreatebtn() {
      // this.AUDIO_TAB('IntercomPlatform-Create')
      this.$emit('modelChange','Create',this.detailData,[],'list');
    },
    
    // 表格单元行 双击查看
    dbEvent(row){
      console.log(row)
      this.checkedData = row; 
      this.id = row.id;
      this.$emit('modelChange','examine',this.checkedData)
    },

    //按钮查看
    look() {
      if (this.selectData.length === 0) {
        return this.$message('请勾选编辑项', '失败');
      } else if (this.selectData.length > 1) {
        this.$message('只能勾选一项', '失败');
      } else {
        this.$emit('modelChange','examine',this.checkedData)
      }
    },

    //修改
    edit(){
      if(this.selectData.length===0){
        return this.$message('请勾选编辑项')
       }else if(this.selectData.length>1){
         this.$message('只能勾选一项')
       }else{
          this.$emit('modelChange','edit',this.checkedData)
       }
    },

    // 排序
    sort() {
      if(this.selectData.length===0){
        return this.$message('请勾选编辑项')
      }else if(this.selectData.length>1){
         this.$message('只能勾选一项')
       }else{
        this.$emit('modelChange','sort',this.checkedData)
      }
    },

    // 迁移
    move() {
      if(this.selectData.length===0){
        return this.$message('请勾选编辑项')
      }else{
        this.$emit('modelChange','migtate',{},this.selectData)
      }
    },

    // 删除
    del() {
      if (this.selectData.length === 0) {
        return this.$message('请勾选编辑项')
      } else {
        
        let ids = this.selectData.map(item => {
          let { id } = item
          return id
        })
        let id=ids
        getAudioHostlistApi({id}).then(res=>{
          if(res.data.data.taimaies.length>0||res.data.data.intercomes.length>0){
            alert('删除平台失败,平台下有主机和台麦,不能直接删除')
          }else{

            this.$confirm('确定删除该对讲平台？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.deletTalkbackList({ ids }).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

                  let obj={
                    limit:100,
                    page:1,
                  
                    // keyPartId:this.checkedData.keyPartId
                  }
                  this.talkbackList(obj).then(res=>{
                    console.log(res)
                    this.tableData=res.data.data.platforms
                  })
                }
            
                console.log(res)
              })
              
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
            
          }
          this.selectData.length===0
        })
      }
    },

    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['序号','所属机构', '所属重点部位', '对讲平台名称', '品牌', '型号', '接入协议',  '对讲平台唯一ID', 'IP地址', '终端接收端口', '服务器接收端口', '级联音频端口', '用户名','资产编码', '在线状态', '录入机构', '录入人', '录入时间']
      // 字段名
      const filterVal = ['index','orgName', 'keyPartName', 'name', 'brand', 'modelNum', 'accessProtocol', 'uniqueId', 'ip', 'port', 'cport', 'dport', 'username', 'assetCode', 'status',  'updatedDept', 'updatedBy', 'updatedAt']
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
      })

      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '对讲平台配置')
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
        item.name = item.name ? item.name : '';
        item.brand = item.brand ? item.brand : '';
        item.modelNum = item.modelNum ? item.modelNum : '';
        item.accessProtocol = item.accessProtocol ? item.accessProtocol : '';
        item.assetCode = item.assetCode ? item.assetCode : '';
        item.uniqueId = item.uniqueId ? item.uniqueId : '';
        item.ip = item.ip ? item.ip : '';
        item.port = item.port ? item.port : '';
        item.cport = item.cport ? item.cport : '';
        item.dport = item.dport ? item.dport : '';
        item.username = item.username ? item.username : '';
        item.password = item.password ? item.password : '';
        item.status = item.status ? item.status : '';
        item.updatedDeptId = item.updatedDeptId ? item.updatedDeptId : '';
        item.updatedById = item.updatedById ? item.updatedById : '';
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
          // { field: 'subSystemName', displayName: '所属子系统' },
          { field: 'name', displayName: '对讲平台名称' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'accessProtocol', displayName: '接入协议' },
          { field: 'uniqueId', displayName: '对讲平台唯一ID' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'port', displayName: '终端接收端口' },
          { field: 'cport', displayName: '服务器接收端口' },
          { field: 'dport', displayName: '级联音频端口' },
          { field: 'username', displayName: '用户名' },
          // { field: 'password', displayName: '密码' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'status', displayName: '在线状态' },
          // { field: 'runStatus', displayName: '运行状态' },
          { field: 'updatedDeptId', displayName: '录入机构' },
          { field: 'updatedById', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">对讲平台配置</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ",
        //内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;",
      })
    },

    // 依据数组对象某一个属性进行排序
    compare(prop){
      return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return value1 - value2;
      }
    },
    
    // 选中 多选
    handleSelectionChange(val) {
      console.log(val)
      var list = [...val];
      list.sort(this.compare('index'));
      this.selectData = list;
      console.log(list, '列表勾选')
    },

    // 选中 单选（一个）
    selectsss(s, row) {
      this.checkedData = row 
      this.id = row.id
    },
    
    // 分页组件触发事件
    paginationConfChange(obj) {
      this.getTalkback(obj.page, obj.limit)
    },
    
    ...mapMutations(["AUDIO_TAB"]),

    ...mapActions('talkback', {
      talkbackList: 'talkbackList',
      deletTalkbackList: "deletTalkbackList"
    }),
    
  },


  computed: {

  },
  created() {
    this.getRootNode();
    // this.getTalkback()
      
  },
  mounted() {
    this.$refs.listPagination.setTotal(this.pagesize)
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
      height: calc(~'100% - 98px');
      position: relative;
      .opt-box{
        height: 36px;
        margin-bottom: 10px;
        margin-top: 8px
      }
      .list-box-table {
        width: 100%;
        height: calc(~'100% - 40px');
      }
    }
  }
}
</style>