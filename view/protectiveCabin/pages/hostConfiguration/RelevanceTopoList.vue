<template>
  <div class="relevance-box">
    <div class="collapses">
      <div class="collapse-item"
           v-if="showVideo">
        <div class="box-title">
          <span class="pointer"
                @click="toggleOpen('videoStatus')">
            关联视频通道列表
            <i :class="dropDownStatus.videoStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.videoStatus"
             style="width:100%;">
          <el-table :data="videoTableData"
                    border
                    style="width: 100%"
                    height="201"
                    size="mini"
                    stripe>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in comColumns"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer"
                @click="toggleOpen('volumStatus')">
            关联对讲通道列表
            <i :class="dropDownStatus.volumStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.volumStatus"
             style="width:100%;">
          <el-table :data="volumTableData"
                    border
                    style="width: 100%"
                    height="201"
                    size="mini"
                    stripe>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in comColumns"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer"
                @click="toggleOpen('doorStatus')">
            关联防护舱通道列表
            <i :class="dropDownStatus.doorStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.doorStatus"
             style="width:100%;">
          <el-table :data="doorTableData"
                    border
                    style="width: 100%"
                    height="201"
                    size="mini"
                    stripe>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in comColumns"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="collapse-item">
        <div class="box-title">
          <span class="pointer"
                @click="toggleOpen('outputStatus')">
            关联输出通道列表
            <i :class="dropDownStatus.outputStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropDownStatus.outputStatus"
             style="width:100%;">
          <el-table :data="outputTableData"
                    border
                    style="width: 100%"
                    height="201"
                    size="mini"
                    stripe>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in comColumns"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="creat-message">
        <span>录入时间</span>
        <span>{{creatAt.updatedAt}}</span>
        <span>录入机构</span>
        <span>{{creatAt.updatedDept}}</span>
        <span>录入人</span>
        <span>{{creatAt.updatedBy}}</span>
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
      default: true,
    },
    videoTableData: {
      type: Array,
      default: () => [],
    },
    volumTableData: {
      type: Array,
      default: () => [],
    },
    doorTableData: {
      type: Array,
      default: () => [],
    },
    outputTableData: {
      type: Array,
      default: () => [],
    },
    creatAt: {
      type: Object,
    },
  },
  data() {
    return {
      selection: false,
      dropDownStatus: {
        videoStatus: true,
        doorStatus: true,
        volumStatus: true,
        outputStatus: true,
      },
      videoColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keypartName', label: '所属重点部位', width: '' },
        { prop: 'resName', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
      ],
      videoTotal: 0,
      videoPaginationConfig: {
        limit: 25,
        page: 1,
      },
      volumTotal: 0,
      volumPaginationConfig: {
        limit: 25,
        page: 1,
      },
      doorTotal: 0,
      doorPaginationConfig: {
        limit: 25,
        page: 1,
      },
      comColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'keypartName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '资源名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'serise', label: '通道号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
      ],
      outputTotal: 0,
      outputPaginationConfig: {
        limit: 25,
        page: 1,
      },
    }
  },
  methods: {
    toggleOpen(type) {
      this.dropDownStatus[type] = !this.dropDownStatus[type]
    },
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
  },
}
</script>
<style lang="less" scoped>
.creat-message {
  width: 975px;
  height: 35px;
  border: 1px solid rgba(225, 225, 225, 1);
  display: flex;
  margin-bottom: 30px;
  span:nth-child(odd) {
    width: 155px;
    height: 100%;
    background: rgba(245, 245, 245, 1);
    text-align: center;
    line-height: 35px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
  }
  span:nth-child(even) {
    width: 170px;
    height: 100%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
    line-height: 35px;
    text-align: center;
  }
}
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
