<template>
  <div class="alarm-link-control">
    <el-dialog title="报警关联控制"
               :visible.sync="linkStatus"
               :close-on-click-modal='false'
               :close-on-press-escape="false"
                custom-class="dialog-message"
               width="1115px"
               append-to-body
               v-dialogDrag
               @close="close">
      <div class="line"></div>
        <span slot="title" class="dialog-footer">
        <span>关联控制</span>
      </span>
     
      <div class="link-dialog">
        <div class="link-left">
          <div class="link-video">
            <preview-plugin :defaultPane="defaultPane"
                            :iconShow="iconShowParams"
                            :pluginIconShow="pluginIconShow"
                            :moduleType="moduleType"
                            :isNeedModal='isNeedModal'
                            @changeDefaultPane="changeDefaultPane"
                            ref="preview"></preview-plugin>
          </div>
          <div class="link-info">
            <div class="bottomT">
              <span class="titleL"></span>
              <p>{{ linkTitle }}</p>
            </div>
            <ul>
              <li v-for="(item, index) in linkInfoList"
                  :key="index">
                <i>{{ item.name }}：</i>
                <span :title='item.info'>{{ item.info }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="link-right">
          <el-collapse v-model="activeNames"
                       @change="handleChange">
            <el-collapse-item title="视频通道"
                              name="1">
              <div class="link-right-info"
                   v-for="(item, index) in videoDevList"
                   :key="index">
                <span @dblclick="preview(item)"
                      class="titleLi"
                      :title="item.name">
                  <i class="el-icon-video-camera"></i>{{ item.name }}
                </span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="门禁通道"
                              name="2">
              <div class="link-right-info"
                   v-for="(item, index) in doorDevList"
                   :key="index">
                <div v-if="item.status === 1">
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"><i class="iconfont-ccb">&#xe614;
                    </i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="openDoor(item,index)">
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                    <span>
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <div v-else-if="item.status === 2">
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"> <i class="iconfont-ccb">&#xe614;
                    </i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="closeDoor(item,index)">
                    <span>
                      <span class="size">关</span>
                    </span>
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <div v-else>
                  <span style="float:left;margin-top:10px;"
                        class="titleLi disable"
                        :title="item.name"> <i class="iconfont-ccb">&#xe614;
                    </i>{{ item.name }} </span>
                  <span class="opClose disable lixian">不可用
                  </span>
                  <!-- <span class="opClose"
                        @click="closeDoor(item,index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="size">
                      <span class="size">关</span>
                    </span>
                  </span> -->
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="对讲通道"
                              name="3">
              <div class="link-right-info"
                   v-for="(item, index) in audioList"
                   :key="index">
                <div v-if="item.status === 2">
                  <span style="float:left;margin-top:10px;"
                        :title="item.name"
                        class="titleLi"><i class="iconfont-ccb">&#xe64d;</i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="opentalk(item,index)">
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                    <span>
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <div v-else-if="item.status === 0">
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"> <i class="iconfont-ccb">&#xe64d;</i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="closetalk(item,index)">
                    <span>
                      <span class="size">关</span>
                    </span>
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <div v-else>
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"> <i class="iconfont-ccb">&#xe64d;</i>{{ item.name }} </span>
                  <span class="opClose disable lixian">不可用
                  </span>
                </div>
                <!-- <span> <i class="el-icon-mobile"></i>{{ item.name }} </span> -->
                <!-- <el-button size="small"
                           @click="opentalk(item)">开始对讲</el-button>
                <el-button size="small"
                           @click="closetalk(item)">停止对讲</el-button> -->
              </div>
            </el-collapse-item>
            <el-collapse-item title="输出通道"
                              name="4">
              <div class="link-right-info"
                   v-for="(item, index) in outChannelList"
                   :key="index">
                <div v-if="item.status === 1">
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"><i class="iconfont-ccb">&#xe687;</i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="openoutput(item,index)">
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                    <span>
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <div v-if="item.status === 2">
                  <span style="float:left;margin-top:10px;"
                        class="titleLi"
                        :title="item.name"> <i class="iconfont-ccb">&#xe687;</i>{{ item.name }} </span>
                  <span class="opClose"
                        @click="closeoutput(item,index)">
                    <span>
                      <span class="size">关</span>
                    </span>
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                  </span>
                </div>
                <!-- <el-button size="small"
                           @click="openoutput(item)">打开</el-button>
                <el-button size="small"
                           @click="closeoutput(item)">关闭</el-button> -->
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button @click="sureLinkClick"
                   size="small">关闭</el-button>
        <el-button @click="sureLinkClick"
                   size="small">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
export default {
  name: 'linkControl',
  components: { previewPlugin },
  props: {
    linkControl: {
      type: Boolean,
      default: false,
    },
    listMode: {
      type: Boolean,
      default: false,
    },
    controlStatus: {
      type: Boolean,
      default: false,
    },
    associatedControlData: {
      // 当前的报警主机信息
      type: Object,
      default: () => {
        return {}
      },
    },
    thisRela: {
      type: Object,
      default: () => {
        return {}
      },
    },
    hostInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    ishostZone: '',
  },
  mounted() {
    console.log(this.hostInfo, 'this.hostInfo')
    if (this.ishostZone === true) {
      this.getHostBindFn()
    } else {
      this.getDetectorBindFn()
    }
    this.timer = setInterval(() => {
      // 获取门的实时状态
      this.doorDevList.map((item) => {
        this.runtimeGuardStatus({ deviceId: item.deviceId, channelUnique: item.uniqueId }).then((res) => {
          console.log(res, '门的实时状态')
          item.status = res.status
        })
      })
      // 获取对讲音频实时状态
      this.audioList.map((item) => {
        this.runtimeAudioStatus({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
          console.log(res, '音频的实时状态')
          item.status = res.status
        })
      })
    }, 3000)
  },
  data() {
    return {
      linkTitle: '',
      linkStatus: false,

      activeNames: ['1','2','3','4'],
      defaultPane: 4, // 默认显示4窗格
      pluginIconShow: {
        showBottomIcon: true,
        previewStopIcon: true, // 关闭预览1
        centreRecordIcon: true, // 紧急录像1
        screenshot: true, // 截图1
        streamChangeIcon: true, // 码流切换
        muteIcon: true, // 开启伴音1
        yuntaiIcon: true, // 云台1
        speechIcon: true, // 对讲1
        niaokanIcon: true, // 开启鸟瞰1
        tvwallIcon: true, // 快速上墙1
        quickRecodeIcon: true, // 快速回放1
        quanpingfangdaIcon: true, // 全屏1
      },

      iconShowParams: [
        { type: 'left', index: 4, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 0, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 1, name: 'Videotape' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 2, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音
        { type: 'right', name: 'StopAll', index: 3 }, //关闭全部预览
        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', name: 'MultiScreen', index: 4 }, //画面切割
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        // { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      linkInfoList: [
        {
          name: '所属机构',
          mark: 'orgName',
          info: '',
        },
        {
          name: '所属重点部位',
          mark: 'keyPartName',
          info: '',
        },
        {
          name: '所属设备',
          mark: 'deviceType',
          info: '',
        },
        {
          name: '品牌',
          mark: 'brand',
          info: '',
        },
        {
          name: '型号',
          mark: 'deviceModel',
          info: '',
        },
        {
          name: '备注',
          mark: 'remark',
          info: '',
        },
      ],
      videoDevList: [],
      doorDevList: [],
      audioList: [],
      outChannelList: [],
      myMikeIdData: '',
      myMikeIdDatas: '',
      seqId: '', //关闭对讲
      isNeedModal: false,
      moduleType: 2,
    }
  },
  watch: {},
  created() {
    console.log(this.associatedControlData, '当前设备')
    this.linkStatus = this.linkControl
    this.linkTitle = this.associatedControlData.deviceName || this.associatedControlData.name
    if (this.listMode) {
      // 列表页面探测器的关联配置
      this.associatedControlData.orgName = this.thisRela.orgName
      this.associatedControlData.keyPartName = this.thisRela.keyPartName
      this.associatedControlData.deviceModel = this.associatedControlData.model
      this.associatedControlData.ip = this.thisRela.ip
      this.associatedControlData.port = this.thisRela.port
    }
    if (!this.controlStatus) {
      // 回控页面探测器的关联配置
      this.associatedControlData.orgName = this.hostInfo.orgName
      this.associatedControlData.keyPartName = this.hostInfo.keyPartName
      this.associatedControlData.deviceModel = this.associatedControlData.model
      this.associatedControlData.ip = this.hostInfo.ip
      this.associatedControlData.port = this.hostInfo.port
    }
    this.linkInfoList.map((item, index) => {
      for (let i in this.associatedControlData) {
        if (item.mark === i) {
          item.info = this.associatedControlData[i]
        }
      }
    })
  },
  methods: {
    ...mapActions([
      'openDoorFn',
      'closeDoorFn',
      'opentalkFn', // 暂时废弃-开启对讲
      'closetalkFn', // 暂时废弃-关闭对讲
      'openoutputFn',
      'closeoutputFn',
      'getHostBind',
      'getDetectorBind',
      'startTalk', // 开始对讲
      'closeTalk', // 关闭对讲
      'getHostMac', // 查询指定mac地址的台麦主机
      'runtimeGuardStatus', // 获取远程控制门的实时状态
      'runtimeAudioStatus', //获取对讲实时状态
      'getFindHostBind',
      'getFindHostBindDetector',
    ]),
    changeDefaultPane(val) {
      this.defaultPane = val
    },
    // 确认关联控制
    sureLinkClick() {
      this.linkStatus = false
      this.$emit('sureClick', false)
    },
    handleChange(val) {
      console.log(val)
    },
    close() {
      this.$emit('sureClick', false)
    },
    // 获取主机关联配置参数
    getHostBindFn() {
      this.getFindHostBind({ id: this.associatedControlData.id, ref: 1 }).then((res) => {
        this.doorDevList = res.data.guard||[] // 门禁
        this.audioList = res.data.audio ||[]// 对讲
        this.outChannelList = res.data.output||[] // 输出设备
        this.videoDevList = res.data.video ||[]// 视频
          /* 双击进入弹窗获取数据 默认将四个视频打开 */
        if (this.videoDevList.length > 0) {
          this.videoDevList.forEach((item, index) => {
            // 默认只打开四个视频
            index < 4 && this.preview(item)
          })
        }
        // 获取门的实时状态
        this.doorDevList.map((item) => {
          this.runtimeGuardStatus({ deviceId: item.deviceId, channelUnique: item.uniqueId }).then((res) => {
            console.log(res, '门的实时状态')
            item.status = res.status
          })
        })
        // 获取对讲音频实时状态
        this.audioList.map((item) => {
          this.runtimeAudioStatus({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            console.log(res, '音频的实时状态')
            item.status = res.status
          })
        })
      })
    },
    // 获取探测器关联配置参数
    getDetectorBindFn() {
      this.getFindHostBindDetector({ id: this.associatedControlData.id, ref: 2 }).then((res) => {
        this.doorDevList = res.data.guard||[] // 门禁
        this.audioList = res.data.audio ||[]// 对讲
        this.outChannelList = res.data.output||[] // 输出设备
        this.videoDevList = res.data.video ||[]// 视频
            /* 双击进入弹窗获取数据 默认将四个视频打开 */
        if (this.videoDevList.length > 0) {
          this.videoDevList.forEach((item, index) => {
            // 默认只打开四个视频
            index < 4 && this.preview(item)
          })
        }
        // 获取门的实时状态
        this.doorDevList.map((item) => {
          this.runtimeGuardStatus({ deviceId: item.deviceId, channelUnique: item.uniqueId }).then((res) => {
            console.log(res, '门的实时状态')
            item.status = res.status
          })
        })
        // 获取对讲音频实时状态
        this.audioList.map((item) => {
          this.runtimeAudioStatus({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            console.log(res, '音频的实时状态')
            item.status = res.status
          })
        })
      })
    },
    preview(val) {
      console.log(val, 'val')
      let data = {
        channel: Number(val.serise) || Number(val.channelNum),
        devIp: val.type === 4 ? val.ip : val.hostIp,
        devCport: val.type === 4 ? val.cport : val.hostPort,
        devDport: val.type === 4 ? val.dport : val.hostDport,
        // streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2',
        streamType: val.stream === 1 ? 'main' : val.stream === 2 ? 'sub1' : 'sub2',
        id: Number(val.id),
        deviceName: val.deviceName,
        dId: val.deviceId,
        devIp: val.deviceIp,
        deviceType: val.deviceType,
        keyPartId: val.keyPartId,
        keyPartName: val.keyPartName,
        subType:val.type,
        name: val.name,
      }
      this.$refs.preview.openPreview(data)
    },
    // 远程控制开门
    openDoor(item, index) {
      this.openDoorFn({
        guardId: item.id,
      }).then((res) => {
        console.log(res)
        if (res.data.code === '0') {
          this.$messageSuccess('开启成功!')
          this.doorDevList[index].status = 2
        } else {
          this.$messageError('开启失败')
        }
      })
    },
    // 远程控制关门
    closeDoor(item, index) {
      this.closeDoorFn({
        // devIp: item.platformIp,
        // devPort: String(item.platformPort),
        // hostId: item.hostUniq,
        // channelId: item.uniqueId,
        guardId: item.id,
      }).then((res) => {
        if (res.data.code === '0') {
          this.$messageSuccess('关闭成功!')
          this.doorDevList[index].status = 1
        } else {
          this.$messageError('关闭失败')
        }
      })
    },
    // 开始对讲
    opentalk(item, index) {
      //主叫设备话筒id（设备主键id）
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      this.getHostMac({ mac }).then((res) => {
        if (res.data.code === 0) {
          this.myMikeIdData = res.data.data.id
          //开始对讲
          this.audioList[index].status = 0
          this.startTalk({ myMikeId: this.myMikeIdData, calledpanelIds: item.id }).then((res) => {
            if (res.code === 0) {
              this.audioList[index].status = 0
              this.seqId = res.data.seqId || '111'
              this.$notify.success({
                title: '成功',
                message: '开启成功',
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
              })
            }
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '未获取到本机MikeID',
          })
        }
      })
      //   this.opentalkFn({
      //     serverIp: item.host.platform.ip,
      //     serverPort: item.host.platform.port,
      //     callerPanelInfo: {
      //       hostIp: item.host.ip, // 面板所属主机ip
      //       hostPort: item.host.port, // 面板所属主机端口
      //       hostId: item.host.id, // 面板所属主机id
      //       id: item.id, // 面板本身id
      //     },
      //     calledMikeInfo: [
      //       {
      //         id: '222003',
      //         ip: '192.168.14.25',
      //         port: 2046,
      //       },
      //     ],
      //   }).then((res) => {
      //     if (res.data.code === 0) {
      //       this.$messageSuccess('开启成功!')
      //       this.audioList[index].status = 2
      //     } else {
      //       this.$messageError('开启失败')
      //     }
      //   })
    },
    // 关闭对讲
    closetalk(item, index) {
      console.log('关闭')
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      this.getHostMac({ mac }).then((res) => {
        this.myMikeIdDatas = res.data.data.id
        console.log(this.myMikeIdDatas)
        //开始对讲
        this.closeTalk({ seqId: this.seqId, myMikeId: this.myMikeIdDatas }).then((res) => {
          this.audioList[index].status = 2
        })
      })
      //   this.closetalkFn({
      //     serverIp: item.host.platform.ip,
      //     serverPort: item.host.platform.port,
      //     callerPanelInfo: {
      //       hostIp: item.host.ip, // 面板所属主机ip
      //       hostPort: item.host.port, // 面板所属主机端口
      //       hostId: item.host.id, // 面板所属主机id
      //       id: item.id, // 面板本身id
      //     },
      //     calledMikeInfo: [
      //       {
      //         id: '222003',
      //         ip: '192.168.14.25',
      //         port: 2046,
      //       },
      //     ],
      //   }).then((res) => {
      //     if (res.data.code === 0) {
      //       this.$messageSuccess('关闭成功!')
      //       this.audioList[index].status = 1
      //     } else {
      //       this.$messageError('关闭失败')
      //     }
      //   })
    },
    // 输出设备打开
    openoutput(item, index) {
      console.log(item, '输出设备打开')
      this.openoutputFn({
        devIp: this.associatedControlData.ip,
        devPort: this.associatedControlData.port,
        outputNo: item.serialNumber, // 端子号
      }).then((res) => {
        console.log(res)
        if (res.data.code === '0') {
          this.$messageSuccess('开启成功!')
          this.outChannelList[index].status = 2
        } else {
          this.$messageError('开启失败')
        }
      })
    },
    // 输出设备关闭
    closeoutput(item, index) {
      this.closeoutputFn({
        devIp: this.associatedControlData.ip,
        devPort: this.associatedControlData.port,
        outputNo: item.serialNumber, // 端子号
      }).then((res) => {
        if (res.data.code === '0') {
          this.$messageSuccess('关闭成功!')
          this.outChannelList[index].status = 1
        } else {
          this.$messageError('关闭失败')
        }
      })
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.06);
}
/deep/ .el-dialog__header {
  padding: 20px;
}
/deep/ .el-dialog__body {
  padding: 0 20px;
}
/deep/ .dialog-message {
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 687px;
  .el-dialog__header {
    height: 54px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;
    padding: 0;
    line-height: 54px;
    display: flex;
    align-items: center;
    .el-dialog__title {
      font-size: 14px;
      color: #333;
    }
  }
  .el-dialog__body {
    height: calc(~'100% - 54px');
    padding: 0;
    .message-content {
      display: flex;
      justify-content: space-between;
      height: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      .con-left {
        width: 75%;
        height: 100%;
        border-right: 1px solid #e1e1e1;
        .video-top {
          height: 516px;
          width: 100%;
          /deep/ .video-plugin {
            .plugin-video {
              iframe {
                z-index: -2;
              }
            }
          }
        }
        .InfoBox {
          display: flex;
          .message-footer {
            flex: 1;
            width: 100%;
            border-top: 1px solid #e1e1e1;
            min-height: 95px;
            padding-top: 11px;
            box-sizing: border-box;
            display: flex;
            padding-bottom: 10px;
            justify-content: space-between;
            .message-list {
              padding-left: 10px;
              display: flex;
              flex-direction: column;
              .title {
                margin-bottom: 13px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                position: relative;
              }
              .title::after {
                content: '';
                display: block;
                width: 2px;
                height: 12px;
                background: #2d72d3;
                position: absolute;
                left: -10px;
                top: 2px;
              }
              .message {
                span {
                  display: inline-block;
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                  line-height: 24px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-all;
                }
                span:nth-child(1) {
                  width: 180px;
                  margin-right: 50px;
                }
                span:nth-child(2) {
                  width: 268px;
                  margin-right: 50px;
                }
              }
            }
          }
          .personInfo {
            // margin-top: 10px;
            flex: 1;
            border-top: 1px solid #e1e1e1;
            display: flex;
            padding: 10px 0;
            .user {
              width: 30%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .msg {
              flex: 1;
              margin-left: 10px;
              p {
                line-height: 20px;
              }
            }
          }
        }
      }
      .con-right {
        flex: 1;
        height: 651px;
        padding: 0 20px;
        .tab-top {
          width: 100%;
          height: 490px;
          overflow: auto;
          /deep/ .el-collapse {
            border-top: none;
            border-bottom: none;
            .el-collapse-item {
              .el-collapse-item__header {
                height: 24px;
                font-size: 12px;
                padding-bottom: 10px;
                box-sizing: border-box;
                border-bottom: 1px solid #e1e1e1;
                margin-bottom: 5px;
              }
              .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                  padding: 0;
                  .isBor {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 13px;
                    cursor: pointer;
                    display: flex;
                    i {
                      margin-right: 8px;
                    }
                    span {
                      width: 181px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                  }
                  .name {
                    display: flex;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 19px;
                    cursor: pointer;
                    justify-content: space-between;
                    .name-title {
                      display: flex;
                      .icon-background {
                        width: 18px;
                        height: 18px;
                        display: inline-block;
                        border-radius: 50%;
                        text-align: center;
                        margin-right: 6px;
                      }
                      i {
                        line-height: 19px;
                        color: #fff;
                      }
                      span {
                        width: 140px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                    }
                    .opClose {
                      width: 49px;
                      height: 19px;
                      display: flex;
                      border: 1px solid rgba(45, 114, 211, 1);
                      border-radius: 9px;
                      color: #666;
                      background: #fff;
                      .size {
                        display: block;
                        font-size: 10px;
                        transform: scale(0.83);
                        width: 100%;
                        height: 100%;
                        text-align: center;
                      }
                      span {
                        width: 50%;
                        text-align: center;
                        line-height: 19px;
                        font-size: 10px;
                      }
                      span:nth-child(1) {
                        border-top-left-radius: 9px;
                        border-bottom-left-radius: 9px;
                      }
                      span:nth-child(2) {
                        border-top-right-radius: 9px;
                        border-bottom-right-radius: 9px;
                      }
                      .active {
                        background: #2d72d3;
                        color: #fff;
                      }
                    }
                    .audo {
                      font-size: 16px;
                    }
                  }
                }
              }
            }
          }
        }
        .footer-close {
          width: 100%;
          height: calc(~'100% - 490px');
          border-top: 1px solid #e1e1e1;
          display: flex;
          align-items: center;
          justify-content: center;
          /deep/ .el-button {
            font-size: 12px;
          }
        }
      }
    }
  }
  .dialog-footer {
    width: calc(~'100% - 16px');
  }
}
.line {
  width: 1075px;
  height: 1px;
  border-bottom: 1px solid rgba(225, 225, 225, 1);
  // background: rgba(225, 225, 225, 1);
  margin-bottom: 20px;
}
.link-dialog {
  overflow: hidden;
  .link-left {
    float: left;
    width: 814px;
    border-right: 1px solid #bcbcbc;
    .link-video {
      overflow: hidden;
      width: 100%;
      height: 500px;
      border-bottom: 1px solid #bcbcbc;
      margin-right: 20px;
      .videoContent {
        text-align: center;
        line-height: 250px;
        height: 250px;
        // background: violet;
      }
      .iconList {
        text-align: center;
        // height: 50px;
        // line-height: 50px;
        padding: 10px 0;
        .iconBox {
          .iconItem {
            display: inline-block;
            margin: 0 10px;
          }
        }
      }
      .videoItem {
        float: left;
        width: 450px;
        height: 290px;
        // border: 1px solid turquoise;
        margin: 5px;
        background: #fff;
      }
    }
    .link-info {
      overflow: hidden;
      .bottomT {
        height: 14px;
        .titleL {
          display: inline-block;
          width: 2px;
          height: 12px;
          background: rgba(45, 114, 211, 1);
          margin-left: 10px;
        }
        p {
          display: inline-block;
          padding: 10px 0 0 3px;
          font-size: 13px;
        }
      }

      ul {
        margin-top: 10px;
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
        li {
          float: left;
          width: 170px;
          margin-bottom: 10px;
          margin-right: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        :nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
  .link-right {
    .disable {
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.6;
    }
    .lixian {
      display: inline-block;
      width: 50px;
      border-radius: 25px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      padding-left: 4px;
    }
    /deep/ .el-collapse-item__header {
      background-color: #fff;
      border-bottom: 1px solid rgba(225, 225, 225, 1);
      padding: 20px 0;
    }
    /deep/ .el-collapse-item__content {
      padding: 0;
    }
    float: right;
    width: 261px;
    padding-left: 15px;
    .link-right-info {
      // height: 30px;
      // line-height: 30px;
      overflow: hidden;
      padding: 2px 0;
      position: relative;
      .titleLi {
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      .iconfont-ccb {
        font-size: 24px;
        color: red;
        margin-top: -9px;
      }
      .opClose {
        float: right;
        margin-top: 10px;
        width: 49px;
        height: 19px;
        display: flex;
        border: 1px solid rgba(45, 114, 211, 1);
        border-radius: 9px;
        color: #666;
        background: #fff;
        cursor: pointer;
        .size {
          display: block;
          font-size: 10px;
          transform: scale(0.83);
          width: 100%;
          height: 100%;
          text-align: center;
        }
        span {
          width: 50%;
          text-align: center;
          line-height: 19px;
          font-size: 10px;
          margin-bottom: 0;
        }
        span:nth-child(1) {
          border-top-left-radius: 9px;
          border-bottom-left-radius: 9px;
          margin-bottom: 0;
        }
        span:nth-child(2) {
          border-top-right-radius: 9px;
          border-bottom-right-radius: 9px;
          margin-bottom: 0;
        }
        .active {
          background: #2d72d3;
          color: #fff;
        }
      }
      i {
        float: left;
        font-size: 22px;
        margin-right: 10px;
      }
      span {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
