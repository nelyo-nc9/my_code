<template>
  <div class="alarm-link-control">
    <el-dialog title="报警关联控制"
               :visible.sync="linkStatus"
               width="60%"
               append-to-body
               @close="close">
      <iframe v-if="linkStatus"
              style="width:100%;height: 100%;position:absolute;top:0;left: 0;z-index: -2;"></iframe>
      <div class="link-dialog">
        <div class="link-left">
          <div class="link-video">
            <preview-plugin :defaultPane="defaultPane"
                            :iconShow="iconShowParams"
                            ref="preview"></preview-plugin>
          </div>
          <div class="link-info">
            <p>{{ linkTitle }}</p>
            <ul>
              <li v-for="(item, index) in linkInfoList"
                  :key="index">
                <i>{{ item.name }}：</i>
                <span>{{ item.info }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="link-right">
          <el-collapse v-model="activeNames"
                       @change="handleChange">
            <el-collapse-item title="视频设备"
                              name="1">
              <div class="link-right-info"
                   v-for="(item, index) in videoDevList"
                   :key="index">
                <span @click="preview(item)">
                  <i class="el-icon-video-camera"></i>{{ item.name }}
                </span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="远程控制"
                              name="2">
              <div class="link-right-info"
                   v-for="(item, index) in doorDevList"
                   :key="index">
                <span> <i class="el-icon-mobile"></i>{{ item.name }} </span>
                <el-button size="small"
                           @click="openDoor(item)">开门</el-button>
                <el-button size="small"
                           @click="closeDoor(item)">关门</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="对讲控制"
                              name="3">
              <div class="link-right-info"
                   v-for="(item, index) in audioList"
                   :key="index">
                <span> <i class="el-icon-mobile"></i>{{ item.name }} </span>
                <el-button size="small"
                           @click="opentalk(item)">开始对讲</el-button>
                <el-button size="small"
                           @click="closetalk(item)">停止对讲</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="输出设备"
                              name="4">
              <div class="link-right-info"
                   v-for="(item, index) in outChannelList"
                   :key="index">
                <span> <i class="el-icon-mobile"></i>{{ item.name }} </span>
                <el-button size="small"
                           @click="openoutput(item)">打开</el-button>
                <el-button size="small"
                           @click="closeoutput(item)">关闭</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="sureLinkClick"
                   size="small">关闭</el-button>
        <el-button @click="sureLinkClick"
                   size="small">确定</el-button>
      </div>
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
      default: false
    },
    associatedControlData: {
      // 当前的报警主机信息
      type: Object,
      default: () => {
        return {}
      }
    },
    ishostZone: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log(this.ishostZone, 'this.ishostZone')
    if (this.ishostZone === true) {
      this.getHostBindFn()
    } else {
      this.getDetectorBindFn()
    }
  },
  data() {
    return {
      linkTitle: '',
      linkStatus: false,
      activeNames: ['1'],
      defaultPane: 4, // 默认显示4窗格
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Recoding' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' } // 检查记录
      ],
      linkInfoList: [
        {
          name: '所属机构',
          mark: 'orgId',
          info: ''
        },
        {
          name: '所属重点部位',
          mark: 'keySiteId',
          info: ''
        },
        {
          name: '所属设备',
          mark: 'deviceType',
          info: ''
        },
        {
          name: '品牌',
          mark: 'brand',
          info: ''
        },
        {
          name: '型号',
          mark: 'model',
          info: ''
        },
        {
          name: '备注',
          mark: 'remark',
          info: ''
        }
      ],
      videoDevList: [],
      doorDevList: [],
      audioList: [],
      outChannelList: []
    }
  },
  watch: {},
  created() {
    this.linkStatus = this.linkControl
    this.linkTitle = this.associatedControlData.deviceName || this.associatedControlData.name
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
      'opentalkFn',
      'closetalkFn',
      'openoutputFn',
      'closeoutputFn',
      'getHostBind',
      'getDetectorBind'
    ]),
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
    // 获取关联配置参数
    getHostBindFn() {
      this.getHostBind({ hostId: this.associatedControlData.id }).then(res => {
        console.log(res.data)
        this.doorDevList = res.data.guard // 门禁
        this.audioList = res.data.audio // 对讲
        this.outChannelList = res.data.outChannel // 输出设备
        this.videoDevList = res.data.video // 视频
      })
    },
    // 获取关联配置参数
    getDetectorBindFn() {
      this.getDetectorBind({ detectorId: this.associatedControlData.id }).then(res => {
        console.log(res.data)
        this.doorDevList = res.data.guard // 门禁
        this.audioList = res.data.audio // 对讲
        this.outChannelList = res.data.outChannel // 输出设备
        this.videoDevList = res.data.video // 视频
      })
    },
    preview(val) {
      console.log(val)
      let data = {
        channel: val.serise,
        devIp: val.ip,
        devCport: val.cport,
        devDport: val.dport,
        streamType: 'sub1'
      }
      this.$refs.preview.openPreview(data)
    },
    // 远程控制开门
    openDoor(item) {
      console.log(item)
      this.openDoorFn({
        devIp: item.ip,
        devPort: item.port,
        hostId: item.id,
        channelId: item.deviceId
      }).then(res => {
        console.log(res)
      })
    },
    // 远程控制开门
    closeDoor(item) {
      this.closeDoorFn({
        devIp: item.ip,
        devPort: item.port,
        hostId: item.id,
        channelId: item.deviceId
      }).then(res => {
        console.log(res)
      })
    },
    // 开始对讲
    opentalk(item) {
      this.opentalkFn({
        serverIp: item.host.platform.ip,
        serverPort: item.host.platform.port,
        callerPanelInfo: {
          hostIp: item.host.ip, // 面板所属主机ip
          hostPort: item.host.port, // 面板所属主机端口
          hostId: item.host.id, // 面板所属主机id
          id: item.id // 面板本身id
        },
        calledMikeInfo: [
          {
            id: '222003',
            ip: '192.168.14.25',
            port: 2046
          }
        ]
      }).then(res => {
        console.log(res, '开始对讲')
      })
    },
    // 关闭对讲
    closetalk(item) {
      this.closetalkFn({
        serverIp: item.host.platform.ip,
        serverPort: item.host.platform.port,
        callerPanelInfo: {
          hostIp: item.host.ip, // 面板所属主机ip
          hostPort: item.host.port, // 面板所属主机端口
          hostId: item.host.id, // 面板所属主机id
          id: item.id // 面板本身id
        },
        calledMikeInfo: [
          {
            id: '222003',
            ip: '192.168.14.25',
            port: 2046
          }
        ]
      }).then(res => {
        console.log(res, '关闭对讲')
      })
    },
    // 输出设备打开
    openoutput(item) {
      console.log(item, '输出设备打开')
      this.openoutputFn({
        devIp: this.associatedControlData.ip,
        devPort: this.associatedControlData.ip,
        outputNo: item.serialNumber // 端子号
      }).then(res => {
        console.log(res, '输出设备打开')
      })
    },
    // 输出设备关闭
    closeoutput(item) {
      this.closeoutputFn({
        devIp: this.associatedControlData.ip,
        devPort: this.associatedControlData.ip,
        outputNo: item.serialNumber // 端子号
      }).then(res => {
        console.log(res, '输出设备关闭')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.link-dialog {
  overflow: hidden;
  .link-left {
    float: left;
    width: 70%;
    border: 1px solid #bcbcbc;
    .link-video {
      overflow: hidden;
      width: 100%;
      height: 500px;
      border: 1px solid #bcbcbc;
      // display: inline-block;
      // float: left;
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
      margin-top: 15px;
      overflow: hidden;
      border: 1px solid #bcbcbc;
      p {
        padding: 20px 0 0 20px;
        font-weight: bold;
      }
      ul {
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
        li {
          float: left;
          width: 50%;
          margin-bottom: 10px;
          i {
            float: left;
            width: 200px;
          }
        }
      }
    }
  }
  .link-right {
    float: right;
    width: 30%;
    padding-left: 15px;
    .link-right-info {
      // height: 30px;
      // line-height: 30px;
      overflow: hidden;
      padding: 2px 0;
      border-bottom: 2px solid #bcbcbc;
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
