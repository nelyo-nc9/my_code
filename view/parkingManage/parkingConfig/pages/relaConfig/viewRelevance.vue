<template>
  <div class="view-relevance-box">
    <!-- <div class="tree-container">
      <treeBox :lazyTreeApi="getTreeApi" searchType="filter" :treeType="treeType" :customizeQuery="customizeQuery" treeLazyToggle iconToggle></treeBox>
    </div> -->
    <div class="content"
         id="print-gplot">
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">关联拓扑详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small"
                       @click="goBack">返回列表</el-button>
            <el-button size="small"
                       @click="Toprint">打印</el-button>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="top">
          <div class="top-info">
            <div class="info-item">
              <div class="info-label">所属机构</div>
              <div class="info-value">{{sourceData.orgName}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">所属重点部位</div>
              <div class="info-value">{{sourceData.keyPartName}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">所属设备</div>
              <div class="info-value">{{sourceData.deviceName}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">资源名称</div>
              <div class="info-value">{{sourceData.name}}</div>
            </div>
          </div>
          <div class="gplot-top">
            <gplot :gplotData="gplotData"
                   v-if="gplotData.length > 0"></gplot>
          </div>
        </div>
        <div class="list-box">
          <relevance-list :showVideo="showVideo"
                          :videoTableData="videoTableData"
                          :volumTableData="volumTableData"
                          :doorTableData="doorTableData"
                          :outputTableData="outputTableData"></relevance-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
import { getHostOrResourceApi } from '@src/http/alarm/alarmHostConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
import Gplot from './gplot'
import RelevanceList from './relevanceList'
import { mapActions } from 'vuex'
export default {
  name: 'ViewRelevance',
  components: {
    treeBox,
    Gplot,
    RelevanceList,
  },
  props: {
    isShowTopo: {
      type: Boolean,
    },
    showVideo: {
      type: Boolean,
      default: true,
    },
    hostInfo: {
      type: Object,
    },
    relatedType: {
      type: String,
    },
  },
  data() {
    return {
      isShowGplot: true,
      treeType: 2,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0',
        },
      },
      tempArgs: {},
      sourceData: {},
      gplotData: [],
      videoTableData: [],
      volumTableData: [],
      doorTableData: [],
      outputTableData: [],
    }
  },
  created() {
    this.getHostOrResource()
  },
  methods: {
    ...mapActions(['getAlarmHostBind', 'getDetectorBind']),
    topoData() {
      let gpData = []
      gpData.push({
        id: this.InfoData.id,
        type: 'videoHost',
        center: true,
        name: this.InfoData.name,
      })
      this.InfoData.video.forEach((i) => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon',
        }
        gpData.push(obj)
      })
      this.gplotData = gpData
      this.isShowGplot = false
      this.$nextTick(() => {
        this.isShowGplot = true
      })
    },
    getHostOrResource() {
      let params = {
        ref: this.relatedType === '1' ? 1 : 2,
      }
      getHostOrResourceApi(this.hostInfo.id, params)
        .then((res) => {
          this.InfoData = res.data.data
          this.videoTableData = res.data.data.video
          this.volumTableData = res.data.data.audio
          this.doorTableData = res.data.data.guard
          this.outputTableData = res.data.data.output
          this.topoData()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 打印
    Toprint() {
      printJS('print-gplot', 'html')
    },
    goBack() {
      this.$emit('changeComponent')
    },
  },
}
</script>
<style lang='less' scoped>
.view-relevance-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-container {
    width: 280px;
    height: auto;
  }
  .content {
    width: calc(~'100% - 280px');
    height: 100%;
    padding: 0 0 0 15px;
    .top {
      .header {
        color: #333333;
        margin: 23px 0;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
      .middle {
        width: 100%;
        height: 35px;
        margin: 0 0 10px;
      }
    }
    .main {
      width: 120%;
      height: calc(~'100% - 103px');
      border: 1px #333 dotted;
      overflow: auto;
      .top {
        width: 100%;
        height: auto;
        padding: 10px 0 0 10px;
        display: flex;
        .top-info {
          width: 290px;
          height: 160px;
          .info-item {
            width: calc(~'100% - 2px');
            height: 40px;
            line-height: 40px;
            border: 1px solid #e1e1e1;
            border-top: none;
            display: flex;
            .info-label {
              width: 104px;
              height: 100%;
              background: #f5f5f5;
              text-align: center;
            }
            .info-value {
              flex: 1;
              text-indent: 20px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            &:nth-child(1) {
              border-top: 1px solid #e1e1e1;
            }
          }
        }
        .gplot-top {
          flex: 1;
        }
      }
      .list-box {
        padding: 10px;
      }
    }
  }
}
</style>
