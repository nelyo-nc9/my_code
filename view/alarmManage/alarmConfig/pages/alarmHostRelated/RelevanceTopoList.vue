<template>
  <div class="relevance-box">
    <div class="collapses">
      <div class="collapse-item" v-if="showVideo">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('videoStatus')">
            视频通道列表
            <i :class="dropDownStatus.videoStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.videoStatus" style="width:100%;">
          <!-- <video-table
            :selection="selection"
            :columns='comColumns'
            :tableData='videoTableData'>
          </video-table>
          <video-pagination ref="videoPagination"
            :total="videoTotal"
            type="video"
            @paginationConfChange="paginationConfChange"></video-pagination> -->
            <el-table :data="videoTableData" border style="width: 100%" height="201" size="mini" stripe>
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in comColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
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
          <!-- <video-table
            :selection="selection"
            :columns='comColumns'
            :tableData='volumTableData'>
          </video-table>
          <video-pagination ref="audioPagination"
            :total="volumTotal"
            type="volum"
            @paginationConfChange="paginationConfChange"></video-pagination> -->
            <el-table :data="volumTableData" border style="width: 100%" height="201" size="mini" stripe>
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in comColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
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
          <!-- <video-table
            :selection="selection"
            :columns='comColumns'
            :tableData='doorTableData'>
          </video-table>
          <video-pagination ref="inputPagination"
            :total="doorTotal"
            type="door"
            @paginationConfChange="paginationConfChange"></video-pagination> -->
            <el-table :data="doorTableData" border style="width: 100%" height="201" size="mini" stripe>
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in comColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
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
          <!-- <video-table
            :selection="selection"
            :columns='comColumns'
            :tableData='outputTableData'>
          </video-table>
          <video-pagination ref="outputPagination"
            :total="outputTotal"
            type="output"
            @paginationConfChange="paginationConfChange"></video-pagination> -->
            <el-table :data="outputTableData" border style="width: 100%" height="201" size="mini" stripe>
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in comColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VideoTable from './VideoTable'
// import VideoPagination from './VideoPagination'
export default {
  name: 'RelevanceList',
  components: {
    // VideoTable,
    // VideoPagination
  },
  props: {
    showVideo: {
      type: Boolean,
      default: true
    },
    videoTableData: {
      type: Array,
      default: () => []
    },
    volumTableData: {
      type: Array,
      default: () => []
    },
    doorTableData: {
      type: Array,
      default: () => []
    },
    outputTableData: {
      type: Array,
      default: () => []
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
        // { prop: 'subSystem', label: '所属子系统', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keyPartName', label: '所属重点部位', width: '' },
        { prop: 'resName', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
        // { prop: 'remark', label: '备注', width: '' }
      ],
      videoTotal: 0,
      videoPaginationConfig: {
        limit: 100,
        page: 1
      },
      volumTotal: 0,
      volumPaginationConfig: {
        limit: 100,
        page: 1
      },
      doorTotal: 0,
      doorPaginationConfig: {
        limit: 100,
        page: 1
      },
      comColumns: [
        // { prop: 'refSubsystem', label: '所属子系统', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'locName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
        // { prop: 'ramark', label: '备注', width: '' }
      ],
      outputTotal: 0,
      outputPaginationConfig: {
        limit: 100,
        page: 1
      }
    }
  },
  methods: {
    toggleOpen(type) {
      this.dropDownStatus[type] = !this.dropDownStatus[type]
    }
    // paginationConfChange(config, type) {
    //   if (type === 'video') {
    //     this.videoPaginationConfig = config
    //   } else if (type === 'volum') {
    //     this.volumPaginationConfig = config
    //   } else if (type === 'door') {
    //     this.doorPaginationConfig = config
    //   } else if (type === 'output') {
    //     this.outputPaginationConfig = config
    //   }
    // }
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
