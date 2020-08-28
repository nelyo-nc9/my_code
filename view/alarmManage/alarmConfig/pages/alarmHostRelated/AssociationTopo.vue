<template>
  <div class="view-relevance-box">
    <div class="content" id="print-gplot">
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>关联拓扑图</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small" @click="cancel">返回列表</el-button>
            <el-button size="small" @click="Toprint">打印</el-button>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="top">
          <div class="top-info">
            <div class="info-item">
              <div class="info-label">所属机构</div>
              <div class="info-value" :title="hostInfo.orgName">{{hostInfo.orgName}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">所属重点部位</div>
              <div class="info-value" :title="hostInfo.locName">{{hostInfo.locName}}</div>
            </div>
            <div class="info-item" v-if="relatedType === '2'">
              <div class="info-label">所属设备</div>
              <div class="info-value" :title="hostInfo.name">{{hostInfo.name}}</div>
            </div>
            <div class="info-item" v-if="relatedType === '2'">
              <div class="info-label">探测器名称</div>
              <div class="info-value" :title="hostInfo.name">{{hostInfo.name}}</div>
            </div>
            <div class="info-item" v-if="relatedType === '1'">
              <div class="info-label">设备名称</div>
              <div class="info-value" :title="hostInfo.name">{{hostInfo.name}}</div>
            </div>
          </div>
          <div class="gplot">
            <div style="text-align:center;">
              <Gplot :gplotData="gplotData" v-if="isShowGplot"></Gplot>
            </div>
          </div>
        </div>
        <div class="list-box">
          <RelevanceTopoList :showVideo="showVideo" :videoTableData="videoTableData" :volumTableData="volumTableData" :doorTableData="doorTableData" :outputTableData="outputTableData"></RelevanceTopoList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import Gplot from '../../../../videoManage/components/gplot'
import { getHostOrResourceApi } from '@src/http/alarm/alarmHostConfig.api.js'
import RelevanceTopoList from './RelevanceTopoList'
export default {
  name: 'AssociationTopo',
  components: {
    Gplot,
    RelevanceTopoList
  },
  props: {
    isShowTopo: {
      type: Boolean
    },
    showVideo: {
      type: Boolean,
      default: true
    },
    hostInfo: {
      type: Object
    },
    relatedType: {
      type: String
    }
  },
  data() {
    return {
      isShowGplot: true,
      treeType: 2,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      tempArgs: {},
      gplotData: [],
      videoTableData: [],
      volumTableData: [],
      doorTableData: [],
      outputTableData: []
    }
  },
  methods: {
    ...mapActions(['getAlarmHostBind', 'getDetectorBind']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 打印
    Toprint() {
      printJS('print-gplot', 'html')
    },
    cancel() {
      this.$emit('update:isShowTopo', false)
    },
    topoData() {
      let gpData = []
      gpData.push({
        id: this.InfoData.id,
        type: this.relatedType === '1' ? 'videoHost' : (this.relatedType === '2' ? 'vidicon' : 'alarm'),
        center: true,
        name: this.InfoData.name
      })
      this.InfoData.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      this.InfoData.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      this.InfoData.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      this.InfoData.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
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
        ref: this.relatedType === '1' ? 1 : 2
      }
      getHostOrResourceApi(this.hostInfo.id, params).then(res => {
        this.InfoData = res.data.data
        this.videoTableData = res.data.data.video
        this.volumTableData = res.data.data.audio
        this.doorTableData = res.data.data.guard
        this.outputTableData = res.data.data.output
        this.topoData()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getHostOrResource()
  }
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
      width: 100%;
      height: calc(~'100% - 103px');
      // border: 1px #333 dotted;
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
            width: 100%;
            height: 40px;
            line-height: 40px;
            border: 1px solid #E1E1E1;
            border-top: none;
            display: flex;
            .info-label {
              width: 104px;
              height: 100%;
              background: #F5F5F5;
              text-align: center;
            }
            .info-value {
              text-indent: 20px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &:nth-child(1) {
              border-top: 1px solid #E1E1E1;
            }
          }
        }
      }
      .list-box {
        padding: 10px;
      }
    }
    .gplot {
      width: calc(~'100% - 510px');
      margin-left: 10px;
      border: 1px solid #E1E1E1;
      padding: 10px;
    }
  }
}
</style>
