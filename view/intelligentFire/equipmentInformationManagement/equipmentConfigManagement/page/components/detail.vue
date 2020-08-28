<template>
  <div class="view-relevance-box">
    <div class="content">
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ configType }}</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item class="active">关联拓扑图</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small" @click="goBack">返回列表</el-button>
          </div>
        </div>
      </div>
      <div class="main" id="print-gplot">
        <div class="top">
          <div class="top-info">
            <div class="info-item">
              <div class="info-label">所属机构</div>
              <div class="info-value">{{ sourceData.orgName }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">所属重点部位</div>
              <div class="info-value">{{ sourceData.keyPartName }}</div>
            </div>
            <div class="info-item" v-if="configType === '系统部件关联配置'">
              <div class="info-label">所属设备</div>
              <div class="info-value">{{ sourceData.hostName }}</div>
            </div>
            <div class="info-item" v-if="configType === '系统部件关联配置'">
              <div class="info-label">部件名称</div>
              <div class="info-value">{{ sourceData.name }}</div>
            </div>
            <div class="info-item" v-if="configType === '消防系统关联配置'">
              <div class="info-label">设备名称</div>
              <div class="info-value">{{ sourceData.name }}</div>
            </div>
          </div>
          <div class="gplot-top">
            <gplot :gplotData="gplotData" v-if="gplotData.length > 0"></gplot>
          </div>
        </div>
        <div class="list-box">
          <relevance-list
            :showVideo="showVideo"
            :videoTableData="videoTableData"
            :volumTableData="volumTableData"
            :doorTableData="doorTableData"
            :outputTableData="outputTableData"
          ></relevance-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getTreeApi } from '@src/http/video/videoPreview.api.js'
// import { getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
import { fireDeploy } from '@src/http/intelligentFire/equipmentManagement.js'
// import treeBox from '@src/components/tree/treeBox'
import Gplot from './gplot'
import RelevanceList from './relevanceList'
export default {
  name: 'ViewRelevance',
  components: {
    // treeBox,
    Gplot,
    RelevanceList
  },
  props: {
    showVideo: {
      type: Boolean,
      default: true
    },
    configType: {
      type: String,
      required: true
    },
    selectedData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      treeType: 2,
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      sourceData: '',
      gplotData: [],
      videoTableData: [],
      volumTableData: [],
      doorTableData: [],
      outputTableData: []
    }
  },
  created() {
    console.log(this.selectedData)
    this.sourceData = this.selectedData[0]
    let id = this.selectedData[0].id
    let param = {
      ref: this.configType === '消防系统关联配置' ? 1 : 2
    }
    fireDeploy.getDeviceOrResourceApi(id, param).then(res => {
      if (res.data.code === 0) {
        this.dealData(res.data.data)
      }
    })
  },
  methods: {
    dealData(data) {
      if (!data) {
        return
      }
      let gpData = []
      gpData.push({
        id: data.id,
        type:
          this.configType === '消防系统关联配置'
            ? 'videoHost'
            : this.configType === '系统部件关联配置'
            ? 'videoHost'
            : 'alarm',
        center: true,
        name: data.name
      })
      data.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      data.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      data.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      data.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
        }
        gpData.push(obj)
      })
      this.gplotData = gpData
      console.log(this.gplotData)
      this.videoTableData = data.video
      this.volumTableData = data.audio
      this.doorTableData = data.guard
      this.outputTableData = data.output
    },
    // 打印
    Toprint() {
      printJS('print-gplot', 'html')
    },
    goBack() {
      this.$emit('changeComponent', 'List')
    }
  }
}
</script>
<style lang="less" scoped>
.view-relevance-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-container {
    width: 280px;
    height: auto;
  }
  .content {
    width: 100%;
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
      border: 1px #333 dotted;
      overflow: auto;
      .top {
        width: 100%;
        height: auto;
        padding: 10px 0 0 10px;
        display: flex;
        .top-info {
          // width: 290px;
          height: 160px;
          .info-item {
            // width: calc(~'100% - 2px');
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
              padding-right: 10px;
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
