<template>
  <div class="other-list-box">
    <!-- 顶部操作栏 -->
    <div class="top">
      <!-- 面包屑 -->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{navTitle}}</el-breadcrumb-item>
          <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="middle">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="selectData.length === 0" @click="relevanceConf">关联配置</el-button>
          <el-button size="small" @click="getTableList()">获取关联</el-button>
          <el-button size="small" :disabled="selectData.length !== 1" @click="viewLink">查看关联拓扑</el-button>
          <el-button size="small" @click="exportFile">导出</el-button>
        </div>
        <div class="opt-box">
          <el-input v-model="keyword" placeholder="请输入设备名称或设备IP" style="float:right;width:200px;" size="small">
            <i slot="suffix" @click="getTableList()" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <div class="foot">
        <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
      </div>
    </div>
    <div class="main">
      <!-- 表格 -->
      <el-table
        stripe
        border
        size="medium"
        :data="tableData"
        @selection-change="select"
        height="calc(100% - 50px)"
        max-height="805"
        style="width: 100%">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" type="index" :index="indexMethod" width="60" align="center"></el-table-column>
        <el-table-column prop="orgName" :sortable="true" label="所属机构" width="220" align="center"></el-table-column>
        <el-table-column prop="keyPartName" :sortable="true" label="所属重点部位" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" :sortable="true" :label="navTitle != '视频主机关联配置'?'所属设备':'设备名称'" width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand" label="品牌" width="130" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modelNum" label="型号" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" v-if="navTitle!='视频主机关联配置'" label="资源名称" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" label="IP" width="120" align="center" :sortable="true" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetCode" label="资产编码" width="220" align="center"></el-table-column>
        <el-table-column v-if="navTitle === '摄像机关联配置' || navTitle === '视频主机关联配置'" prop="status" label="状态" :sortable="true" width="130" align="center" show-overflow-tooltip :formatter="formatterTable"></el-table-column>
        <el-table-column prop="isVideoLink" label="关联视频通道" width="130" align="center" show-overflow-tooltip :formatter="formatterTable">
          <template slot-scope="scope">
            <a class="text" type="text" size="small" @click="clickRelevance(scope.row)" v-if="scope.row.isVideoLink === 2">已关联</a>
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="isAudioLink" label="关联对讲通道" width="100" align="center" show-overflow-tooltip :formatter="formatterTable">
          <template slot-scope="scope">
            <a class="text" type="text" size="small" @click="clickRelevance(scope.row)" v-if="scope.row.isAudioLink === 2">已关联</a>
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="isGuardLink" label="关联门禁通道" width="130" align="center" show-overflow-tooltip :formatter="formatterTable">
          <template slot-scope="scope">
            <a class="text" type="text" size="small" @click="clickRelevance(scope.row)" v-if="scope.row.isGuardLink === 2">已关联</a>
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="isOutputLink" label="关联输出通道" width="120" align="center" show-overflow-tooltip :formatter="formatterTable">
          <template slot-scope="scope">
            <a class="text" type="text" size="small" @click="clickRelevance(scope.row)" v-if="scope.row.isOutputLink === 2">已关联</a>
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="updatedDept" label="录入机构" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updatedBy" label="录入人" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updatedAt" label="录入时间" width="120" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <video-pagination ref="listPagination"
        :total="total"
        @paginationConfChange="paginationConfChange"></video-pagination>
    </div>
    <velevance-info v-if="showVelevanceInfo" :InfoData="InfoData" :navTitle="navTitle" :flag="relevaceFlag" @cancle="cancle"></velevance-info>
  </div>
</template>

<script>
import VideoPagination from './VideoPagination'
import VelevanceInfo from './relevanceInfo'
import { postVideoRelateListApi, getRelateListApi, getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
export default {
  name: 'OtherList',
  components: {
    VideoPagination,
    VelevanceInfo
  },
  props: {
    navTitle: {
      type: String,
      default: '视频主机关联配置'
    },
    orgId: {
      type: String
    },
    keyPartId: {
      type: String
    },
    deviceId: {
      type: String
    },
    tierType:{
       type: String,
       default:'org'
    }
  },
  computed: {},
  watch: {
    orgId(nv) { // todo 获取机构详情
      this.$emit('changeOrgId', nv)
      this.getTableList('org')
    },
    keyPartId() {
      // this.getTableList('keyPart')
    },
    deviceId() {
      // this.getTableList('dev')
    },
    selectData: {
      handler(nv) {
        this.$emit('changeSelect', nv)
      },
      immediate: true
    }
  },
  data() {
    return {
      relevaceFlag: false,
      showVelevanceInfo: false,
      keyword: '',
      tableData: [],
      total: 0,
      paginationConfig: {
        page: 1,
        limit: 100
      },
      selectData: [],
      InfoData: {}
    }
  },
  created() {},
  methods: {
    getTableList(type=this.tierType) {
      let params = {
        page: this.paginationConfig.page,
        limit: this.paginationConfig.limit
      }
      if (type === 'org') {
        params.orgId = this.orgId
      } else if (type === 'keyPart') {
        params.keyPartId = this.keyPartId
      } else if (type === 'dev') {
        // zp调整   视频主机关联配置中的机构树点击设备时需要传的属性是id,摄像机关联配置和报警输入关联配置中点击机构树的设备级时要传deviceId
        params[this.navTitle === '视频主机关联配置'?'id':'deviceId'] = this.deviceId
      }
      if (this.navTitle === '视频主机关联配置') {
        // params.orgId = this.orgId
        // params.keyPartId = this.keyPartId
        // params.id = this.deviceId
        postVideoRelateListApi(params).then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.hosts
            this.total = res.data.data.count.total
          }
        })
      } else if (this.navTitle === '摄像机关联配置' || this.navTitle === '报警输入关联配置') {
        params.type = this.navTitle === '摄像机关联配置' ? 1 : 3
        // params.orgId = this.orgId
        // params.keyPartId = this.keyPartId
        // params.id = this.deviceId
        getRelateListApi(params).then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.channels
            this.total = res.data.data.count.total
          }
        })
      }
    },
    getLinks(id) {
      let params = {
        ref: this.navTitle === '视频主机关联配置' ? 1 : 2
      }
      getDeviceOrResourceApi(id, params).then(res => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
        }
      })
    },
    refresh() {
      this.getTableList()
    },
    select(s, row) {
      this.selectData = s
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    relevanceConf() {
      this.$emit('changeComponent', 'RelevanceConf')
    },
    viewLink() {
      this.$emit('changeComponent', 'viewLink')
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      switch (column.property) {
        case 'status':
          params = cellValue === 2 ? '在线' : '离线'
          break
        case 'isVideoLink':
        case 'isAudioLink':
        case 'isGuardLink':
        case 'isOutputLink':
          params = cellValue === 2 ? '已关联' : ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    indexMethod(index) {
      return (this.paginationConfig.page - 1) * this.paginationConfig.limit + index + 1
    },
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      let tHeader = []
      let filterVal = []
      if (this.navTitle === '摄像机关联配置') {
        tHeader = ['所属机构', '所属重点部位', '所属设备', '品牌', '型号', '通道名称', 'IP', '资产编码', '状态', '关联对讲通道', '关联门禁通道', '关联输出通道', '录入机构', '录入人', '录入时间']
        filterVal = ['orgName', 'keyPartName', 'deviceName', 'brand', 'modelNum', 'resName', 'ip', 'assetCode', 'status', 'isAudioLink', 'isGuardLink', 'isOutputLink', 'updatedDept', 'updatedBy', 'updatedAt']
      } else if (this.navTitle === '报警输入关联配置') {
        tHeader = ['所属机构', '所属重点部位', '所属设备', '品牌', '型号', '通道名称', 'IP', '资产编码', '状态', '关联镜头', '关联对讲通道', '关联门禁通道', '关联输出通道', '录入机构', '录入人', '录入时间']
        filterVal = ['orgName', 'keyPartName', 'deviceName', 'brand', 'modelNum', 'resName', 'ip', 'assetCode', 'status', 'isVideoLink', 'isAudioLink', 'isGuardLink', 'isOutputLink', 'updatedDept', 'updatedBy', 'updatedAt']
      } else {
        tHeader = ['所属机构', '所属重点部位', '设备名称', '品牌', '型号', 'IP', '资产编码', '状态', '关联镜头', '关联对讲通道', '关联门禁通道', '关联输出通道', '录入机构', '录入人', '录入时间']
        filterVal = ['orgName', 'keyPartName', 'deviceName', 'brand', 'modelNum', 'ip', 'assetCode', 'status', 'isVideoLink', 'isAudioLink', 'isGuardLink', 'isOutputLink', 'updatedDept', 'updatedBy', 'updatedAt']
      }
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = list.map(v => filterVal.map(j => v[j]))
      export_json_to_excel(tHeader, data, 'fileName')
    },
    clickRelevance(row) {
      let params = {
        ref: this.navTitle === '视频主机关联配置' ? 1 : 2
      }
      getDeviceOrResourceApi(row.id, params).then(res => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }
      })
    },
    cancle() {
      this.showVelevanceInfo = false
      this.relevaceFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
.other-list-box {
  width: 100%;
  height:100%;
  padding-left: 12px;
  .top {
    .header {
      color: #333333;
      margin: 23px 0;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2D72D3;
          }
        }
      }
    }
    .middle {
      width: 100%;
      height: 35px;
      margin: 0 0 10px;
      display: flex;
      justify-content: space-between;
      .button-box {
        width: 780px;
      }
      .opt-box {
        margin-right: 61px;
      }
    }
    .foot {
      margin-bottom: 10px;
      /deep/ .el-button {
        padding: 0;
      }
    }
  }
  .main {
    width: 100%;
    height: calc(~'100% - 133px');
  }
  .text {
    color: #409EFF;
    cursor: pointer;
  }
}
</style>
