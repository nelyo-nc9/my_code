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
          <video-table
            :selection="selection"
            :columns='videoColumns'
            :tableData='videoTableData'>
          </video-table>
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
        { prop: 'subSystem', label: '所属子系统', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keypartName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      comColumns: [
        { prop: 'subSystem', label: '所属子系统', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keypartName', label: '所属重点部位', width: '' },  //  zp   后台让用小写的part   keypartName
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
<style lang='less' scoped>
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
