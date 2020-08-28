<template>
  <div id="blockView">
    <el-carousel trigger="click" indicator-position="outside" :interval="0">
      <el-carousel-item class="box" v-for="(item, page) in tableDatas" :key="page">
        <div class="right-aisle-box">
          <div
            class="box-content"
            :class="{ active: index == Index }"
            @click="active(index)"
            v-for="(items, index) in item"
            :key="index"
          >
            <div>
              <p class="status">
                状态 :
                <span v-show="items.status == 1">关门</span>
                <span v-show="items.status == 2">开门</span>
                <span v-show="items.status == 3">未知</span>
              </p>
            </div>
            <div class="box-msg">
              <div class="read">
                <i class="icon iconfont-ccb ccbmenjiachaojian"></i>
              </div>
              <p>{{ items.name }}</p>
            </div>
            <div class="bottom" style="display:flex">
              <p>{{ items.deviceName }}</p>
              <el-button class="btn" size="mini" @click="isDiao(items, page, index)">
                <span style="text-align:center">关联控制</span>
              </el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-dialog
      title="门禁控制"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="dialog-message"
      :before-close="handleClose"
      top="12vh"
      append-to-body
      v-if="dialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <span slot="title" class="dialog-footer">
        <span>关联控制</span>
      </span>
      <div class="message-content">
        <div class="con-left">
          <div class="video-top">
            <previewPlugin
              @changeDefaultPane="changeDefaultPane"
              :defaultPane="defaultPane"
              :iconShow="iconShowParams"
              :pluginIconShow="pluginIconShow"
              ref="preview"
              :moduleType="moduleType"
              :isNeedModal="isNeedModal"
            ></previewPlugin>
          </div>
          <div class="message-footer">
            <div class="message-list" v-for="(item, index) in isMessage" :key="index">
              <span class="title">{{ item.name }}</span>
              <span class="message">
                <span>所属机构：{{ item.orgName }}</span>
                <span>型号：{{ item.modelNum }}</span>
                <span>所属重点部位：{{ item.keyPartName }}</span>
              </span>
              <span class="message">
                <span>品牌：{{ item.brand }}</span>
                <span>所属门禁主机：{{ item.deviceName }}</span>
                <span>备注：</span>
              </span>
            </div>
          </div>
        </div>
        <div class="con-right">
          <div class="tab-top">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频通道" name="1">
                <div class="isBor" v-for="(item, index) in videoDevList" :key="index">
                  <i class="el-icon-video-camera"></i>
                  <span @click="preview(item)">{{ item.name }}</span>
                </div>
              </el-collapse-item>

              <el-collapse-item title="门禁通道" name="2">
                <div style="flex-direction: column;" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#FFBA00">
                      <i class="el-icon-refrigerator"></i>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="openBody.name" placement="top-start"></el-tooltip>
                    <span>{{ openBody.name }}</span>
                  </span>

                  <div class="btns" style="margin-top:10px; cursor: pointer;">
                    <el-button size="mini" @click="open(openBody, doorIndex)">开门</el-button>
                    <el-button size="mini" @click="closeFlor(openBody, doorIndex)">关门</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲通道" name="3">
                <div v-for="(item, index) in audioList" :key="index" style="display:flex" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#38BBBE">
                      <i class="el-icon-microphone"></i>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>

                  <span class="opClose" v-if="item.status === 2" @click="openIntercom(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose" v-if="item.status === 1" @click="offIntercom(item, index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>

                  <!-- <span style="font-size:16px">
                    <i
                      style="float:right;line-height:23px"
                      class="el-icon-microphone"
                      v-if="item.status === 2"
                      @click="openIntercom(item, index)"
                    ></i>
                    <i class="el-icon-turn-off-microphone" v-else @click="offIntercom(item, index)"></i>
                  </span>-->
                </div>
              </el-collapse-item>
              <el-collapse-item title="输出通道" name="4">
                <div v-for="(item, index) in outChannelList" :key="index" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#FF0000">
                      <i class="el-icon-location-outline"></i>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose" v-if="item.status === 1" @click="alarmAccessOpen(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose" v-if="item.status === 2" @click="alarmAccessClose(item, index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="fn" type="primary" size="mini" @click="close(fn)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
import {
  openAccess,
  closeTheflor,
  getPassageway,
  openVideo,
  offVideo,
  alarmOpen,
  AlarmClose,
  getMac,
  alarmoutput,
  ctlalarmoutput,
  alarmoutputs,
  closeAlarmoutputs,

} from '@src/http/access/event'
import { getControlList, getDoorStatus } from '@src/http/access/control'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
import { getAlarmoutputs } from '@src/http/protectiveCabin/channe.api'
export default {
  components: {
    previewPlugin: () => import('@src/view/videoManage/preview/school/previewPlugin'),
    AssociationControl: () => import('@src/view/accessControl/accessAdmin/components/AssociationControl'),
  },
  props: ['tableData', 'item'],
  data() {
    return {
      isNeedModal:false,
      moduleType:3,
      doorStatus: '',
      Index: 0,
      myMikeIdData: '',
      names: '',
      openBody: {},
      hostOrChannel: {},
      defaultPane: 4, // 视频组件需要的参数
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Videotape' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'ScreenShot',
        },
        {
          type: 'left',
          index: 1,
          name: 'Videotape',
        },
        {
          type: 'left',
          index: 2,
          name: 'Speech',
        },
        {
          type: 'left',
          name: 'NiaoKan',
          index: 3,
        },
        {
          type: 'left',
          index: 4,
          name: 'Lunxun',
        },
        {
          type: 'left',
          name: 'Attention',
          index: 5,
        },
        {
          type: 'left',
          name: 'checkRecode',
          index: 6,
        },
        {
          type: 'left',
          index: 7,
          name: 'Collect',
        },
        {
          type: 'left',
          name: 'Volume',
          index: 8,
        },
        {
          type: 'right',
          name: 'FullScreen',
          index: 0,
        },
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1,
        },
        {
          type: 'right',
          name: 'ViewPattern',
          index: 2,
        },
        {
          type: 'right',
          name: 'Stream',
          index: 3,
        },
        {
          type: 'right',
          name: 'StopAll',
          index: 4,
        },
        {
          type: 'right',
          name: 'Stop',
          index: 5,
        },
        { type: 'right', slotName: 'rightBtn', index: 0, width: '260px' }
      ],
       pluginIconShow: {
        showBottomIcon: true, // 图标按钮条
        hidemenuIcon: true, // 隐藏
        previewStopIcon: true, // 关闭预览
        centreRecordIcon: true, // 紧急录像
        isRecordingIcon: true, // 录像类型
        streamChangeIcon: true, // 码流切换
        screenshot: true, // 截图
        muteIcon: true, // 开启伴音
        yuntaiIcon: true, // 云台
        speechIcon: true, // 对讲
        niaokanIcon: true, // 开启鸟瞰
        tvwallIcon: true, // 快速上墙
        quickRecodeIcon: true, // 快速回放
        videoCheckIcon: true, // 视频复核
        detailsIcon: true, // 详情
        quanpingfangdaIcon: true // 全屏
      },
      seqId: '',
      activeNames: ['1', '2', '3', '4'],
      fn: null,
      dialogVisible: false,
      doorImg: '../../../static/protectiveCabin/u38.png',
      list: [1, 2, 123, 12, 312, 3, 123, 12, 3, 123, 12, 3, 123, 12, 3, 123, 1, 31, 23, 12, 312, 31],
      tableDatas: [],
      currtItem: [],
      videoDevList: [],
      doorDevList: [],
      audioList: [],
      outChannelList: [],
      isMessage: [],
      doorIndex: '',
      ArrPage: '',
    }
  },
  methods: {
    changeDefaultPane(val) {
      this.defaultPane = val
    },
    closeDialog() {
      this.$parent.getList()
    },
    /**
     * @description: Block list 样式
     * @param {type}: Number
     * @return: 无
     */
    active(Index) {
      this.Index = Index
    },
    /**
     * @description:video 开流
     * @param {type}: Object {}
     * @return: 无
     */
    preview(val) {
      let data = {}
      if (val.deviceType === 5) {
        data = {
          channel: val.serise,
          devIp: val.ip,
          devCport: val.cport,
          devDport: val.dport,
          streamType: val.subSystem === 1 ? 'main' : val.subSystem === 2 ? 'sub1' : 'sub2',
          subType: val.class,
          dId: val.id,
          id:val.id,
          orgName:val.orgName,
          keypartName:val.keyPartName,
          deviceName:val.deviceName,
          name:val.name

        }
      } else {
        data = {
          channel: val.serise,
          devIp: val.deviceIp,
          devCport: val.deviceCport,
          devDport: val.deviceDport,
          streamType: val.subSystem === 1 ? 'main' : val.subSystem === 2 ? 'sub1' : 'sub2',
          subType: val.class,
          dId: val.id,
          id:val.id,
          orgName:val.orgName,
          keypartName:val.keyPartName,
          deviceName:val.deviceName,
          name:val.name
        }
      }
      this.$refs.preview.openPreview(data)
    },
    /**
     * @description: 打开输出设备 有些设备数据暂未返回statu字段 目前判断开关接口状态赋值status 后期有变动
     * @param {type}: Object
     * @type: get || post
     * @return: 无
     */
    alarmAccessOpen(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        alarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('开启成功!')
            // 获取警铃实时状态
            getAlarmoutputs({
              devIp: item.deviceIp,
              devPort: item.devicePort,
              channelList: [Number(item.serise)],
            }).then((res) => {
              this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
            })
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'open' }).then((res) => {
          if (res.data.data.code == '0') {
            this.$messageSuccess('通道开启!')
            this.outChannelList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },
    /**
     * @description: 输出关闭 status通过接口状态自定义 后期可能会变动
     * @param {type}: Object
     * @type: get || post
     * @return: 无
     */
    alarmAccessClose(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: false }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('关闭成功!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem == '2') {
        //报警输出通道
        // let alarmParams = {
        //   devIp: item.deviceIp,
        //   devPort: item.devicePort,
        //   outputNo: item.serise,
        // }
        //报警输出通道
        closeAlarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then(
          (res) => {
            if (res.data.code === 0) {
              this.$messageSuccess('关闭成功!')
              getAlarmoutputs({
                devIp: item.deviceIp,
                devPort: item.devicePort,
                channelList: [Number(item.serise)],
              }).then((res) => {
                this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
              })
              // this.outChannelList[index].status = 1
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        )
      } else if (item.subSystem === 4) {
        //音频输出通道 暂未提供接口
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'close' }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.code == '0') {
              this.$messageSuccess('通道关闭!')
              this.outChannelList[index].status = 1
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        })
      }
    },
    /**
     * @description: 开启对讲
     * @param {type}:  Object
     * @type: get
     * @return: 无
     */
    openIntercom(item, index) {
      openVideo({ myMikeId: this.myMikeIdData.id, calledpanelIds: item.id }).then((res) => {
        this.audioList[index].status = 1
        this.seqId = res.data.data.seqId || '111'
      })
    },
    /**
     * @description: 关闭对讲
     * @param {type}: Object 依赖开启接口返回的 seqId字段
     * @type: get
     * @return: 无
     */
    offIntercom(item, index) {
      offVideo({ seqId: this.seqId, myMikeId: this.myMikeIdData.id }).then((res) => {
        this.audioList[index].status = 2
      })
    },
    /**
     * @description: 开门后调用获取实时状态接口
     * @param {type}: Object {guardId : 通道id}
     * @return: code
     */
    open(item, index) {
      console.log('Log-=----', item)
      let body = {
        // devIp: item.platformIp,
        // devPort: String(item.platformPort),
        // hostId: item.hostUniq,
        // channelId: item.uniqueId,
        guardId: item.id,
      }
      openAccess(body).then((res) => {
        /* 获取设备实时状态 */
        let params = {
          deviceId: item.deviceId,
          channelUnique: item.uniqueId,
        }
        getDoorStatus(params).then((res) => {
          if (res.data.code == 0) {
            this.tableDatas[this.ArrPage][this.doorIndex].status = res.data.data.status
          }
        })
      })
    },
    /**
     * @description: 关门后调用获取实时状态接口
     * @param {type}: Object {guardId : 通道id }
     * @return: code
     */
    closeFlor(item, index) {
      let body = {
        // devIp: item.platformIp,
        // devPort: String(item.platformPort),
        // hostId: item.hostUniq,
        // channelId: item.uniqueId,
        guardId: item.id,
      }

      closeTheflor(body).then((res) => {
        let params = {
          deviceId: item.deviceId,
          channelUnique: item.uniqueId,
        }
        // this.$parent.getList()
        getDoorStatus(params).then((res) => {
          if (res.data.code == 0) {
            this.tableDatas[this.ArrPage][this.doorIndex].status = res.data.data.status
          }
        })
      })
    },

    handleChange(val) {
      console.log(val)
    },
    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
      this.$parent.getList()
    },
    /* 数组为二维数组 page为子数组 [INDEX] index为当前选中的item */
    /**
     * @description: 点击控制打开弹窗 操作设备
     * @param {type}: 当前设备信息及关联设备
     * @return: 无
     */
    isDiao(va, page, Index) {
      this.ArrPage = page
      this.doorIndex = Index

      this.openBody = va

      this.dialogVisible = true
      this.doorDevList = []
      this.audioList = []
      this.outChannelList = [];
      this.videoDevList = []
      this.doorDevList = va
      this.isMessage = [va]
      this.names = va.name

      let params = {
        ref: 2,
      }
      // 获取门禁关联的主机和设备展示
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${va.id}`, params).then((res) => {
        console.log('Log-------------=========================', res)
        this.doorDevList = res.data.data.guard || [] // 门禁
        this.audioList = res.data.data.audio // 对讲
        this.videoDevList = res.data.data.video // 视频

        // 全部关联视频打开
        if (this.videoDevList.length > 0) {
          this.videoDevList.forEach((item, index) => {
            // 默认只打开四个视频
            index < 4 && this.preview(item)
          })
        }
        /*  状态取值 判断开关 */

        res.data.data.output.forEach((item) => {
          if (!item.status || item.status === 3) {
            item.status = 1
          }
          this.outChannelList.push(item)
        })
        if (res.data.data.output.length > 0) {
          res.data.data.output.forEach((item, index) => {
            if (item.subSystem === 2) {
              getAlarmoutputs({
                devIp: item.deviceIp,
                devPort: item.devicePort,
                channelList: [Number(item.serise)],
              }).then((res) => {
                if (res.data.data.code === '0') {
                  this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
                }
              })
            }
          })
        }
      })

      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      getMac({ mac }).then((res) => {
        if (res.data.code === 0) {
          this.myMikeIdData = res.data.data
        }
      })

      let { hostUniq, platformPort, platformIp, uniqueId } = va
      this.hostOrChannel = {
        devIp: platformIp,
        devPort: platformPort,
        hostId: hostUniq,
        channelId: uniqueId,
      }
      this.hostOrchannel = this.currtItem = [
        { title: '所属机构:', text: va.orgName },
        { title: '所属设备：', text: va.name },
        { title: '型号:', text: va.modelNum || '---' },
        { title: '所属重点部位:', text: va.keyPartName || '---' },
        { title: '品牌:', text: va.brand || '---' },
        { title: '备注:', text: '---  ' },
      ]
    },

    /**
     * @description:弹窗关闭 callback
     * @param {type}: Function
     * @return: 无
     */
    handleClose(done) {
      this.fn = done
      this.dialogVisible = false
      if (!this.dialogVisible) done()
    },
  },
  created() {},
  mounted() {
    // chunk Aaaary为二维数组 满足展示效果
    this.tableDatas = _.chunk(this.tableData, 12)
    this.handleClose(() => {})
  },
  watch: {
    tableData(val) {
      this.tableDatas = _.chunk(this.tableData, 12)
    },
  },
}
</script>

<style lang="less" scoped>
#blockView {
  height: 450px;
  .right-aisle-box {
    display: flex;
    flex: 1 1 360px;
    flex-wrap: wrap;
    // overflow-y: auto;
    margin-top: 10px;
    .box-content {
      margin-bottom: 10px;
      margin-left: 10px;
      width: 255px;
      // flex: 1;
      border: 1px solid #bcbcbc;
      justify-content: space-around;
      align-content: center;
      padding: 10px;
      cursor: pointer;
      .box-msg {
        display: flex;
        width: 100%;
        margin: 10px 0;
        height: 30px;
        white-space: nowrap;
        .read {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #2d72d3;
          position: relative;
          i {
            position: absolute;
            color: #fff;
            font-size: 20px;
            line-height: 30px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        p {
          width: 80%;
          white-space: nowrap;
          // line-height: 40px;
          margin-left: 5px;
          vertical-align: middle;
          line-height: 30px;
        }
      }
      .bottom {
        display: flex;
        height: 35px;
        p {
          width: 80%;
          line-height: 35px;
        }
      }
    }
  }
  .active {
    border: 1px solid rgba(45, 114, 211, 1);
    box-shadow: 0px 0px 5px 0px rgba(63, 109, 226, 0.63);
  }
}

iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  top: 0;
  left: 0;
}
// .name {
//   span {
//     flex: 1;
//   }
// }
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
        }
        .message-footer {
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
      }
      .con-right {
        flex:1;
        height: 651px;
        padding: 0px 20px;
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
                    .titleMenu {
                      border-left: 3px solid blue;
                    }
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

/deep/ .el-dialog__body {
  padding: 5px;
  .video-top {
    height: 600px;
    /deep/ .video-plugin {
      .plugin-video {
        iframe {
          // z-index: -2;
        }
      }
    }
  }
}
</style>
