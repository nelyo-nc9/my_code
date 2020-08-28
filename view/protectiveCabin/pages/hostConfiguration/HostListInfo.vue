<template>
  <div class="view-relevance-box">
    <div class="content"
         id="print-gplot">
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱主机关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small"
                       @click="Toprint">打印</el-button>
            <el-button size="small"
                       @click="cancel">关闭</el-button>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="top">
          <div class="top-info">
            <div class="info-item">
              <div class="info-label">所属机构</div>
              <div class="info-value"
                   :title="hostInfo.orgName">{{ hostInfo.orgName }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">所属重点部位</div>
              <div class="info-value"
                   :title="hostInfo.keyPartName">{{ hostInfo.keyPartName }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">防护舱主机名称</div>
              <div class="info-value"
                   :title="hostInfo.name">{{ hostInfo.name }}</div>
            </div>
          </div>
          <div class="gplot">
            <div style="text-align:center;">
              <Gplot :gplotData="gplotData"
                     v-if="isShowGplot"></Gplot>
            </div>
          </div>
        </div>
        <div class="list-box">
          <RelevanceTopoList :showVideo="showVideo"
                             :videoTableData="videoTableData"
                             :volumTableData="volumTableData"
                             :doorTableData="doorTableData"
                             :outputTableData="outputTableData"
                             :creatAt='creatAt'></RelevanceTopoList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
// import treeBox from '@src/components/tree/treeBox'
import Gplot from '../../../../view/videoManage/components/gplot'
import RelevanceTopoList from './RelevanceTopoList'
export default {
  name: 'AssociationTopo',
  components: {
    // treeBox
    Gplot,
    RelevanceTopoList,
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
      gplotData: [
        // 关联拓扑假数据
      ],
      videoTableData: [],
      volumTableData: [],
      doorTableData: [],
      outputTableData: [],
      creatAt: {
        updatedAt: this.hostInfo.updatedAt,
        updatedBy: this.hostInfo.updatedBy,
        updatedDept: this.hostInfo.updatedDept,
      },
    }
  },
  methods: {
    ...mapActions(['linkHost', 'getDetectorBind']),
    clickRelevance(row) {
      let params = {
        ref: this.navTitle === '视频主机关联配置' ? 1 : 2,
      }
      getDeviceOrResourceApi(row.id, params).then((res) => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }
      })
    },
    getHostTopoCommon() {
      this.linkHost({ id: this.hostInfo.id, type: { ref: 1 } }).then((res) => {
        if (res.data.data) {
          this.videoTableData = res.data.data.video
          this.volumTableData = res.data.data.audio
          this.doorTableData = res.data.data.cabin
          this.outputTableData = res.data.data.output
          this.gplotData = []
          let result = res.data.data.video.concat(res.data.data.cabin, res.data.data.audio, res.data.data.output)
          let center = {
            name: this.hostInfo.name,
            type: 'alarmHost',
            id: '1',
            center: true, // 用来标识中心元素
          }
          this.gplotData.push(center)
          for (let i = 0; i < result.length; i++) {
            let temp = {
              name: result[i].name,
              type:
                result[i].type === 1
                  ? 'vidicon'
                  : result[i].type === 4
                  ? 'alarmHost'
                  : result[i].type === 2
                  ? 'talkback'
                  : 'guardHost',
              id: String(i + 2),
            }
            this.gplotData.push(temp)
          }
          this.isShowGplot = false
          this.$nextTick(() => {
            this.isShowGplot = true
          })
        } else {
          this.gplotData.push({
            name: this.hostInfo.name,
            type: 'alarmHost',
            id: '1',
            center: true,
          })
          this.isShowGplot = false
          this.$nextTick(() => {
            this.isShowGplot = true
          })
        }
      })
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 打印
    Toprint() {
      printJS('print-gplot', 'html')
    },
    cancel() {
      this.$parent.selectItem = []
      this.$emit('update:isShowTopo', false)
    },
  },
  created() {
    console.log(this.hostInfo, this.relatedType, 'this.hostInfo=====')
    if (this.relatedType === '1') {
      this.tempArgs = {
        hostId: this.hostInfo.id,
      }
      this.getHostTopoCommon()
    }
  },
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
              text-indent: 20px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &:nth-child(1) {
              border-top: 1px solid #e1e1e1;
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
      border: 1px solid #e1e1e1;
      padding: 10px;
    }
  }
}
</style>
