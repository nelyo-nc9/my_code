<template>
  <!-- 语音配置 -->
  <div class="voice-box">
    <!-- 机构树 -->
    <div class="left-tree">
        <orgTree :lazyTreeApi="getTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi" treeType="1" treeLazyToggle iconToggle @onceClick="onceTreeClick"></orgTree>
    </div>
    <div class="content-right">
      <div class="main">
              <!-- 筛选条件 -->
              <div class="fliter-box">
                <el-button size="small" @click="gobtn">配置</el-button>

                <el-button size="small" class="float-right" @click="search">查询</el-button>

                <el-select v-model="upStatus" size="small" placeholder="请选择" class="inp1 float-right" >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未更新" value="1"></el-option>
                  <el-option label="已更新" value="2"></el-option>
                </el-select>
                <span class="float-right label">更新状态</span>

                <el-date-picker
                  v-model="time"
                  size="small"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" 
                  class="inp2 float-right"
                  value-format="yyyy-MM-dd hh:mm:ss">
                </el-date-picker>
                <span class="float-right label">更新时间</span>

                <el-input v-model="name" size="small" class="inp1 float-right" placeholder="设备名字"></el-input>
                <span class="float-right label">设备名称</span>
              </div>

              <!-- 语音配置 列表 -->
              <div class="list-box-table">
                <el-table :row-style="{height:'10px'}"
                  :cell-style="{padding:'0px'}"
                  style="font-size: 12px"
                    stripe
                    border
                    height="calc(100% - 66px)"
                    :data="autoConfList"
                    @select="select"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
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
                        align="center">
                    </el-table-column>
                </el-table>
                 <!-- <el-pagination class="pagination"
                  :page-sizes="[10, 25,50,100]"
                  :page-size="pagesize"
                  :current-page="currentPage"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination> -->
                <audio-Paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-Paination>
              </div>
      </div>

      <!-- 语音配置 弹窗 -->
      <config class="config" v-if="isGoon" @closebtn="closebtn" :talklist="checkData"></config>

    </div>
  </div>
</template>
<script>
import orgTree from "@src/components/tree/treeBox"
import AudioPaination from "../components/AudioPagination"
// import {getAudioTreeApi} from "@src/http/audioManage/audioTree.api.js"
import { getTreeApi } from '../../../http/audio/manyIntercom'
import { fuzzySearchTreeApi } from '@src/http/audioManage/audioTree.api.js'
import { getVoiceListApi,deletChannelListApi,getAudioListApi } from "../../../http/audioManage/talkback.api"
import config from "./config"
import {mapActions} from "vuex"
export default {
  name: '',
  components: {
    orgTree,
    config,
    AudioPaination
  },
  data() {
    return {
      orgId:'',  // 当前所选的 机构id
      keyPartId:'',  //
      name:'',  // 设备名称
      time:'',  // 更新时间
      upStatus:'',  // 更新状态 1未更新   2已更新
      autoConfList:[],  // 音频配置数据列表
      columns: [
        { prop: 'orgName', sortable: false, label: '所属机构', width: '260' },
        { prop: 'keyPartName', sortable: false, label: '所属重点部位', width: '170' },
        { prop: 'deviceName', sortable: false, label: '所属设备', width: '150' },
        { prop: 'name', sortable: false, label: '设备名称', width: '150' },
        { prop: 'entryName', sortable: false, label: '进门语音', width: '150' },
        { prop: 'exitName', sortable: false, label: '出门语音', width: '150' },
        // { prop: 'updatedAt', label: '更新时间', width: '150' },
        { prop: 'upStatus', label: '更新状态', width: '150' },
        { prop: 'status', label: '在线状态', width: '150' },
        { prop: 'updatedAt', label: '时间', width: '200' }
      ],  // 音频配置数据表格字段

      // 音频配置数据分页
      page: 1,
      limit: 25,
      total: 0,

      checkData:[],  // 通道单选数据
      selectDataList:[],    // 通道 总选数据

      isGoon:false,   // 语音配置弹窗显示隐藏  
    }
  },
  computed: {
    startTime(){
      if(this.time){
        return this.time[0];
      }else{
        return "";
      }
      
    },
    endTime(){
      if(this.time){
        return this.time[1];
      }else{
        return "";
      }
    },
  },
  watch: {},
  methods: {
    // 获取tree 资源 api
    getTreeApi(params) {
      return getTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 机构-资源树点击树节点
    onceTreeClick(node) {
      console.log(node, 'node')
      if (node.tierType=="org"){
        // 机构节点
        this.orgId=node.id;
        this.keyPartId = '';

      } else if(node.tierType=="loc"){
        this.keyPartId=node.id
        this.orgId = '';
      }
      // 获取当前节点下的 语音配置
      this.getAudioConfigList();
    },

    search () {
      // 将分页子组件置为第一页
      this.$refs.listPagination.page = 1
      this.getAudioConfigList()
    },

    // 获取语音配置数据列表
    getAudioConfigList(page=1, limit=25){
      var params  = {
        page: page,
        limit: limit,
        name:this.name,
        startTime:this.startTime,
        endTime:this.endTime,
        upStatus:this.upStatus,
        orgId:this.orgId,
        keyPartId:this.keyPartId,
      };
      getAudioListApi(params).then( res => {
        console.log(res);
        if(res.data.code == 0){
          this.autoConfList = res.data.data.channels || [];
          this.total = 0
          if (res.data.data.count) {
            this.total = res.data.data.count.total;
          }
        }
      }).catch( error => {

      });
    },

    // 分页组件触发事件
    paginationConfChange(obj) {
      this.getAudioConfigList(obj.page, obj.limit)
    },

    // 已选
    handleSelectionChange(val){   
      this.selectDataList = [...val]
      console.log(val, '列表勾选')
    },
    //勾选列表  单选
    select(s,row){
      this.checkData = row
      this.id=row.uniqueId
      console.log(this.id)
    },

    //删除 通道
    del(){
      if(this.selectDataList.length===0){
         return this.$message('请勾选编辑项')
       }else{
        
        let ids=this.selectDataList.map(item=>{
          let {id}=item
          return id
        })
        console.log(ids)
        deletChannelListApi({ids}).then(res=>{
           if(res.data.code===0){
            this.getVoiceListaa();
           }
         console.log(res)
        })
      }
      
    },

    // 触发配置按钮
    gobtn(){
      if(this.checkData != ''){
        this.isGoon=true;
      }else{
        this.$message({
          message: '请选择一个设备信息',
          type: 'warning'
        });
      }
    },
    // 触发关闭 语音配置弹窗
    closebtn(bool){
      if (bool) {
        this.getAudioConfigList()
      }
      this.isGoon=false
      // this.getVoiceZhaoList()
    },

    // 表格字段 格式化规则函数
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          if(cellValue == 1){
            params = '在线';
          }else if(cellValue == 2){
            params = '离线';
          }else{
            params = '未知';
          }
          break

        case 'upStatus':
          if(cellValue == 1){
            params = '未更新';
          }else if(cellValue == 2){
            params = '已更新';
          }else{
            params = '未知';
          }
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

    // 时间格式化 工具方法
    dateFormat(row, column, cellValue) {
      return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD') : '';
    },

  },
  beforeCreate(){
    
  },
  created() {
    this.getAudioConfigList();
  },

  mounted(){
    this.$refs.listPagination.setTotal(this.limit)
  },

  
}
</script>
<style lang="less" scoped>
   .voice-box {
      width: 100%;
      height: 100%;
      padding: 6px 0;
      display: flex;
      justify-content: flex-start;
      .left-tree {
        width:300px;
        height: 100%;
        padding: 5px 10px;
        .menu-nav {
          height: 30px;
          line-height: 30px;
          text-indent: 10px;
          background: #f5f4f4;
          border-bottom: 1px solid #fff;
        }
      }
      .content-right {
        width: calc(~'95% - 202px');
        height: 100%;
        padding: 5px 0;
         .main {
            width: 100%;
            height: 100%;
            .list-box-table {
              width: 100%;
              height: calc(~'100% - 40px');
              margin-top:10px;
              padding: 0 20px;
            }
          }
          .config{
             position: absolute;
             top:28%;
             left:600px;
             background: white !important;
          }
          // .config-box{
          //   width: 600px;
          //   height: 400px;
          //   border: 1px solid #000;
          //   position: absolute;
          //   top:28%;
          //   left:30%;
          //   background: red;
          //   .top{
          //      width: 100%;
          //      height: 30px;
          //      background: #eee;
          //   }
          // }
      }
      .fliter-box{
        overflow: hidden;
        padding:0 20px;
        .inp1{
          width:200px;
          float:right;
          margin-left:10px;
        }
        .inp2{
          width:370px;
          float:right;
          margin-left:10px;
        }
        .label{
          line-height: 30px;
          margin-left:20px;
        }
        .float-right{
          float:right;
        }
      }
      .pagination{
                  margin-top:30px;
          text-align: center;
      }
    }
</style>