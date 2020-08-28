<template>
  <div class="info-box">
    <!-- 中间树 -->
    <!-- <div class="info-tree">
      <treeBox :lazyTreeApi="getTreeApi"
          searchType="filter"
          :treeType="treeType"
          @onceClick="onceClick"
          treeLazyToggle iconToggle></treeBox>
    </div> -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>视频管理</el-breadcrumb-item>
            <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-printer" v-print="'#printJS_people'">打印</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>
      <div class="main" ref="printJS_people" id="printJS_people">
        <!-- 信息展示 -->
        <div class="info-container">
          <div class="info-title">视频主机信息</div>
          <div class="info-detail">
            <div class="info-detail-item">
              <div class="info-item-label">所属子系统</div>
              <div class="info-item-value">{{deviceModel.subSystemName}}</div>
            </div>
            <div class="info-detail-item">
              <div class="info-item-label">所属机构</div>
              <div class="info-item-value">{{deviceModel.orgName}}</div>
            </div>
            <div class="info-detail-item">
              <div class="info-item-label">所属重点部位</div>
              <div class="info-item-value">{{deviceModel.keyPartName}}</div>
            </div>
            <div class="info-detail-item">
              <div class="info-item-label">设备类型</div>
              <div class="info-item-value">{{deviceModel.type}}</div>
            </div>
            <div class="info-detail-item">
              <div class="info-item-label">设备名称</div>
              <div class="info-item-value">{{deviceModel.name}}</div>
            </div>
            <template v-if="!vnvrs">
              <div class="info-detail-item">
                <div class="info-item-label">设备品牌</div>
                <div class="info-item-value">{{deviceModel.brand}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">设备型号</div>
                <div class="info-item-value">{{deviceModel.modelNum}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">序列号</div>
                <div class="info-item-value">{{deviceModel.uniqueId}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">接入协议</div>
                <div class="info-item-value">{{deviceModel.accessProtocol}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">接入服务器</div>
                <div class="info-item-value">{{deviceModel.accessService}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">IP地址</div>
                <div class="info-item-value">{{deviceModel.ip}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">传输协议</div>
                <div class="info-item-value">{{deviceModel.protocol}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">控制端口</div>
                <div class="info-item-value">{{deviceModel.cport}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">数据端口</div>
                <div class="info-item-value">{{deviceModel.dport}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">数字通道数量</div>
                <div class="info-item-value">{{deviceModel.digitalNumber}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">模拟通道数量</div>
                <div class="info-item-value">{{deviceModel.analogNumber}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">报警输入数量</div>
                <div class="info-item-value">{{deviceModel.inputNumber}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">报警输出数量</div>
                <div class="info-item-value">{{deviceModel.outputNumber}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">音频通道数量</div>
                <div class="info-item-value">{{deviceModel.audioNumber}}</div>
              </div>
              <div class="info-detail-item">
                <div class="info-item-label">资产编码</div>
                <div class="info-item-value">{{deviceModel.assetCode}}</div>
              </div>
             </template>
          </div>
        </div>
        <table-result :showOptIcon="showOptIcon" :deviceData="deviceModel" :devInfo="deviceModel" :id="deviceModel.id" :deviceName="deviceModel.name" source="info"></table-result>
      </div>
    </div>
  </div>
</template>

<script>
import TableResult from './TableResult'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
// import { getDeviceInfoApi } from '@src/http/video/videoConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
import { DEVICETYPE, TRANSPORTPROTOCOLS } from '../../../components/selectConf'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'Info',
  components: {
    TableResult,
    treeBox
  },
  filters: {
    dealShowType(val) {
      if (!val) { return '' }
      return DEVICETYPE.filter(item => item.value === val)[0] && DEVICETYPE.filter(item => item.value === val)[0].label || val
    },
    dealShowTrans(val) {
      if (!val) { return '' }
      return TRANSPORTPROTOCOLS.filter(item => item.value === val)[0].label || val
    }
  },
  props: {
    deviceData: {
      type: Array
    },
    come: {
      type: String
    }
  },
  computed: {
    vnvrs() {
      if (typeof (this.deviceModel.type) === 'number') {
        if ([5].some(i => i === this.deviceModel.type)) {
          console.log(this.deviceModel)
          return true
        } else {
          return false
        }
      } else {
        if (['Vnvr'].some(i => i === this.deviceModel.type)) {
          console.log(this.deviceModel)
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted() {
    console.log(this.deviceData)
  },
  data() {
    return {
      deviceModel: this.deviceData[0],
      showOptIcon: false,
      treeType: 2
    }
  },
  created() {
    // this.getDeviceInfo(this.deviceModel.id)
  },
  methods: {
    // getDeviceInfo(dId, next) { // 获取单个设备的信息
    //   getDeviceInfoApi(dId).then((res) => {
    //     if (res.data.code === 0) {
    //       let info = this.$lodash.cloneDeep(res.data.data.host)
    //       console.log(this.doubleMeaning(info, 'toLabel'), res.data)
    //       info = this.doubleMeaning(info, 'toLabel')
    //       console.log(info)
    //       this.devInfo = info
    //       this.deviceModel = this.$lodash.cloneDeep(info)
    //       next()
    //     } else {
    //       throw res.data.message
    //     }
    //   }).then(_ => {
    //     this.$notify({
    //       title: NOTIFY.TITLE.SUCCESS,
    //       message: '获取设备信息成功',
    //       type: NOTIFY.TYPE.SUCCESS
    //     })
    //   }).catch(err => {
    //     this.$notify({
    //       title: NOTIFY.TITLE.ERROR,
    //       message: err,
    //       type: NOTIFY.TYPE.ERROR
    //     })
    //   })
    // },
    goBack() {
      this.$parent.showContent = 'list'
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick() {}
  }
}
</script>

<style lang="less" scoped>
.info-box {
  width: 100%;
  height: 100%;
  display: flex;
  .info-tree {
    width: 280px;
    height: 100%;
  }
  .content {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    overflow: hidden;
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
    }
    .main {
      margin-top: 10px;
      height: calc(~'100% - 103px');
      overflow: auto;
      .info-container {
        width: 80%;
        margin: 10px 0px 10px 0px;
        padding: 5px 0px 10px 0px;
        .info-title {
          width: 100%;
          height: 45px;
          line-height: 45px;
          text-align: center;
        }
        .info-detail {
          width: 100%;
          display: flex;
          flex-wrap: wrap;box-sizing: border-box;
          border: 1px solid rgba(225, 225, 225, 1);
          .info-detail-item {
            width: 50%;
            height: 30px;
            line-height: 30px;
            display: flex;
            .info-item-label {
              width: 135px;
              height: 100%;
              text-align: center;background:rgba(245,245,245,1);
              border: 1px solid rgba(225, 225, 225, 1);
            }
            .info-item-value {
              flex: 1;
              text-indent: 10px;
              border: 1px solid  rgba(225, 225, 225, 1);
            }
          }
        }
      }
    }
  }
}

@media print {
  .main {
    max-width: 1423px;
    margin: 10px;
     .info-container {
        width: 80%;
        margin: 10px 0px 10px 0px;
        padding: 5px 0px 10px 0px;
        .info-title {
          width: 100%;
          height: 45px;
          line-height: 45px;
          text-align: center;
        }
        .info-detail {
          width: 100%;
          display: flex;
          flex-wrap: wrap;box-sizing: border-box;
          border: 1px solid rgb(66, 66, 66);
          .info-detail-item {
            width: 50%;
            height: 30px;
            line-height: 30px;
            display: flex;
            .info-item-label {
              width: 135px;
              height: 100%;
              text-align: center;background:rgba(245,245,245,1);
              border: 1px solid rgb(63, 63, 63);
            }
            .info-item-value {
              flex: 1;
              text-indent: 10px;
              border: 1px solid  rgb(66, 66, 66);
            }
          }
        }
      }
  }
}
</style>
