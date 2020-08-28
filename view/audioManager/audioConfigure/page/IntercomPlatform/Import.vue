<!--  -->
<template>
  <div class="import-box">
    <div class="top">
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
          <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
          <el-breadcrumb-item>导入</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-opt-box">
        <div class="file-box">
          <el-input size="mini">
            <template slot="prepend">选择导入文件</template>
            <el-upload slot="append" action="">
              <el-button size="mini" type="primary">浏览...</el-button>
            </el-upload>
          </el-input>
        </div>
        <div class="buttons">
          <el-button size="mini">导入</el-button>
          <el-button size="mini">重置</el-button>
          <el-button size="mini">覆盖</el-button>
          <el-button size="mini">保存</el-button>
        </div>
      </div>
     </div>
    <div class="import-result-box">
      <div class="box-title">
        <span class="pointer">对讲主机列表</span>
      </div>
      <div class="list-box-table">
        <el-table :row-style="{height:'300px'}" :cell-style="{padding:'0px'}" style="font-size: 12px" stripe border height="300" max-height="400"
            :data="tableData" @select="select" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
          <el-table-column :row-style="{height:'10px'}" 
          :cell-style="{padding:'0px'}" style="font-size: 12px" 
          v-for="(column) in columns" :key="column.id" :prop="column.prop" :label="column.label" :width="column.width" 
          :sortable="column.sortable" show-overflow-tooltip align="center">
          </el-table-column>
        </el-table>
        <audio-paination ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange"></audio-paination>
        <!-- <el-pagination class="pagination" 
            style="text-align:center;"
            :page-sizes="[25, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
        </el-pagination> -->
      </div>
    </div>
    <div class="box">
      <div class="box-title">
          <span class="pointer"  @click="toggleOpen('detector')">
            对讲通道列表
            <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
      </div>
      <div class="bottom-box" style="margin-top:0px;">
        <div style="width:100%;">
            <div v-if="dropdownStatus.detector" style="width:100%;">
                <div class="list-header">
                      <i class="el-icon-download" title="获取通道信息"></i>
                      <i  class="el-icon-circle-plus-outline" title="新增" ></i>
                      <i class="el-icon-edit" title="编辑"></i>
                      <i class="el-icon-delete" title="删除"></i>
                      <i class="el-icon-refresh-right" title="刷新"></i>
                </div>
                <el-table 
                  border
                  style="width: 100%"
                  size="mini"
                  :data="tableDatat"
                  stripe>
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column v-for="item in taimaiColumn"
                      :key="item.label"
                      :prop="item.prop"
                      :label="item.label"
                      show-overflow-tooltip
                      align="center">
                    </el-table-column>
                </el-table>
            </div>
        </div>
      </div>
      <div class="box-title">
        <span class="pointer"  @click="toggleOpen('detector')">
          <span>输出通道列表</span>
          <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div class="bottom-box" style="margin-top:0px;">
        <div style="width:100%;">
          <div v-if="dropdownStatus.detector"
              style="width:100%;">
              <div class="list-header">
                    <i class="el-icon-download" title="获取通道信息"></i>
                    <i class="el-icon-circle-plus-outline" title="新增"></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除"></i>
                    <i class="el-icon-refresh-right" title="刷新"></i>
              </div>
              <el-table border style="width: 100%" size="mini" :data='tableDatas' stripe>
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column v-for="item in goColumn" :key="item.label" :prop="item.prop" :label="item.label" show-overflow-tooltip align="center"></el-table-column>
              </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPaination from '../../../components/AudioPagination'
import {getVoiceListApi} from "../../../../../http/audioManage/talkback.api"
export default {
  name: 'Import',
  components: {
    AudioPaination,
    
  },
  data() {
    return {
      dropdownStatus: {
        detector: true
      },
      resizable: false,
      columns: [
        { prop: 'orgName', label: '所属机构',width: '120',sortable: true },
        { prop: 'keyPartName', label: '所属重点部位', width: '130',sortable: true },
        { prop: 'name', label: '所属对讲平台名称', width: '150',sortable: true },
        { prop: 'name', label: '主机名称', width: '120',sortable: true },
        { prop: 'name', label: '对讲主机唯一ID', width: '130',sortable: true },
        { prop: 'brand', label: '品牌', width: '',sortable: true },
        { prop: 'model', label: '型号', width: '',sortable: true },
        { prop: 'name', label: 'ip地址', width: '',sortable: true },
        { prop: 'name', label: '对讲通道数', width: '120',sortable: true },
        { prop: 'name', label: '输出通道数', width: '120',sortable: true },
        { prop: 'assetCode', label: '资产编码', width: '100',sortable: true },
        { prop: 'status', label: '在线状态', width: '100',sortable: true },
        // { prop: 'status', label: '运行状态', width: '100',sortable: true },
        { prop: 'inputOrg', label: '录入机构', width: '100',sortable: true },
        { prop: 'inputPeople', label: '录入人', width: '100',sortable: true },
        { prop: 'createdAt', label: '录入时间', width: '100',sortable: true }
      ],
      tableData: [
        
      ],
      tableDatas:[],
      tableDatat:[],
      total: 0,
      limit: 25,
      paginationConfig: {},
      selectData: [],
      taimaiColumn: [
        { prop: 'orgName', label: '所属对讲主机',width: '120',sortable: true },
        { prop: 'keyPartName', label: '对讲通道号', width: '130',sortable: true },
        { prop: 'name', label: '对讲通道号唯一ID', width: '150',sortable: true },
        { prop: 'name', label: '应用类型', width: '120',sortable: true },
        { prop: 'name', label: '品牌', width: '130',sortable: true },
        { prop: 'brand', label: '型号', width: '',sortable: true },
        { prop: 'model', label: '资产编码', width: '',sortable: true },
        { prop: 'name', label: '在线状态', width: '',sortable: true },
        { prop: 'name', label: '运行状态', width: '120',sortable: true }
      ],
      goColumn: [
        { prop: 'orgName', label: '所属机构',width: '120',sortable: true },
        { prop: 'keyPartName', label: '重点部位', width: '130',sortable: true },
        { prop: 'name', label: '所属对讲平台', width: '150',sortable: true },
        { prop: 'name', label: '所属对讲主机', width: '120',sortable: true },
        { prop: 'name', label: '输出通道名称', width: '130',sortable: true },
        { prop: 'brand', label: '输出通道号', width: '',sortable: true },
        { prop: 'model', label: '输出通道唯一ID', width: '',sortable: true },
        { prop: 'name', label: '输出设备品牌', width: '',sortable: true },
        { prop: 'name', label: '输出设备型号', width: '120',sortable: true },
        { prop: 'name', label: '资产编码', width: '120',sortable: true },
        { prop: 'status', label: '在线状态', width: '100',sortable: true },
        // { prop: 'status', label: '运行状态', width: '100',sortable: true },
        { prop: 'inputOrg', label: '录入机构', width: '100',sortable: true },
        { prop: 'inputPeople', label: '录入人', width: '100',sortable: true },
        { prop: 'createdAt', label: '录入时间', width: '100',sortable: true }
      ],
    }
  },
  methods: {
    getlist(){
      let obj={
        page:1,
        limit:100,
        type:1
      }
        getVoiceListApi(obj).then(res=>{
        console.log(res)
        // this.tableDatat=res.data.data.channels
      })
    },
    getlists(page=1, limit=25){
      let obj={
        page:page,
        limit:limit,
        type:2
      }
      getVoiceListApi(obj).then(res=>{
        console.log(res)
        // this.tableDatas=res.data.data.channels
      })
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    toggleOpens(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    select(s, row) {
      this.selectData = s
    },
    paginationConfChange(obj) {
      this.getlists(obj.page, obj.limit)
    }
  }, 
  created(){
    // this.getlist()
    // this.getlists()
  },
  mounted () {
    this.$refs.listPagination.setTotal(this.limit)
  }
}
</script>

<style lang="less" scoped>
.import-box {
  width: 100%;
  height: 100%;
  padding:10px 20px;
  .list-header{
    text-align: right;
    margin-bottom: 10px;
  }
  .top {
    width: 100%;
    height: 85px;
    .header {
      margin-bottom: 10px;
    }
    .top-opt-box {
      width: 100%;
      height: 60px;
      line-height: 60px;
      display: flex;
      align-items: center;
      .file-box {
        width: 500px;
        height: 100%;
        margin-right: 10px;
      }
      .buttons {
        flex: 1;
      }
    }
  }
  
  .list-box-table {
        width: 100%;
        height: calc(~'100% - 40px');
      }
  .import-result-box {
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-bottom: 10px;
      .pointer {
        font-weight: 500;
        font-size: 16px;
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 90px');
        margin-left: 90px;
        margin-top: -12px;
      }
    }
  }
  .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-top: 10px;

      i {
          position: absolute;
          top: 50%;
          left: 100px;
          transform: translateY(-50%);
      }
      &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 120px;
          margin-top: -12px;
      }
    }
    .bottom-box{
        padding-bottom: 20px
    }
}
</style>
