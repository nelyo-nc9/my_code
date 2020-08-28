<template>
  <div class="relevance-box">
    <div class="collapses">
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('videoStatus')">
            视频通道列表
            <i :class="dropDownStatus.videoStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.videoStatus" style="width:100%;">
          <video-table :selection="selection" :columns="videoColumns" :tableData="videoTableData"> </video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('volumStatus')">
            对讲通道列表
            <i :class="dropDownStatus.volumStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.volumStatus" style="width:100%;">
          <video-table :selection="selection" :columns="comColumns" :tableData="volumTableData"> </video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('doorStatus')">
            门禁通道列表
            <i :class="dropDownStatus.doorStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.doorStatus" style="width:100%;">
          <video-table :selection="selection" :columns="comColumns" :tableData="doorTableData"> </video-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('outputStatus')">
            输出通道列表
            <i :class="dropDownStatus.outputStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.outputStatus" style="width:100%;">
          <video-table :selection="selection" :columns="comColumns" :tableData="outputTableData"> </video-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoTable from './VideoTable'
export default {
  name: 'RelevanceList',
  components: {
    VideoTable
  },
  props: {
    showVideo: {
      type: Boolean,
      default: true
    },
    videoTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    volumTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    doorTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    outputTableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      selection: false,
      dropDownStatus: {
        videoStatus: true,
        doorStatus: true,
        volumStatus: true,
        outputStatus: true
      },
      videoColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keyPartName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      comColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keyPartName', label: '所属重点部位', width: '' }, //  zp   后台让用小写的part   keypartName
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ]
    }
  },
  methods: {
    toggleOpen(type) {
      this.dropDownStatus[type] = !this.dropDownStatus[type]
    },
    paginationConfChange(config, type) {
      if (type === 'video') {
        this.videoPaginationConfig = config
      } else if (type === 'volum') {
        this.volumPaginationConfig = config
      } else if (type === 'door') {
        this.doorPaginationConfig = config
      } else if (type === 'output') {
        this.outputPaginationConfig = config
      }
    }
  }
}
</script>
<style lang="less" scoped>
.collapse-item {
  width: 100%;
  margin-bottom: 10px;
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    i {
      position: absolute;
      top: 50%;
      left: 85px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 100px;
      margin-top: -12px;
    }
  }
}
</style>
