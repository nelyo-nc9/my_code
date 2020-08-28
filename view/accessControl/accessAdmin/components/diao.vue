<template>
  <div id="diaLog">
    <el-dialog
      title="门禁控制"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="diao"
      :before-close="handleClose"
      top="1vh"
    >
      <div class="videoCon">
        <div class="videoLeft">
          <div v-for="(item, index) in 4" :key="index" class="videoItem">
            <div class="videoContent">
              <p>视频预览</p>
            </div>
            
            <div class="iconList">
              <ul class="iconBox">
                <li class="iconItem" v-for="(item, index) in 7" :key="index">
                  <i class="el-icon-camera"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="videoRight">
          <div class="rightContent">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频设备" name="1">
                <div class="isBor">
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
                <div class="isBor">
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
                <div>
                  <i class="el-icon-video-camera"></i>
                  <span>摄像机</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="远程控制" name="2">
                <div>
                  <div>
                    <i class="el-icon-refrigerator"></i>
                    <span>D1门-加钞间</span>
                  </div>
                  <div class="btns">
                    <el-button size="mini" @click="open">开门</el-button>
                    <el-button size="mini" @click="closeFlor">关门</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲控制" name="3">
                <div>
                  <i class="el-icon-microphone"></i>
                  <span>对讲设备1</span>
                </div>
                <div>
                  <el-button size="mini">
                    <span @click="openIntercom">开启</span>
                  </el-button>
                  <el-button size="mini">
                    <span @click="offIntercom">关闭</span>
                  </el-button>
                </div>
              </el-collapse-item>

              <el-collapse-item title="输出设备" name="4">
                <div>
                  <div>
                    <i class="el-icon-location-outline"></i>
                    <span>报警设备1</span>
                  </div>
                  <div>
                    <el-button size="mini">
                      <span @click="alarmAccessOpen">开启</span>
                    </el-button>
                    <el-button size="mini">
                      <span @click="alarmAccessClose">关闭</span>
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="videoFooter">
          <!-- <h3>{{currtItem[1].name}}</h3> -->
          <div>
            <ul>
              <h3 style="text-align:left">D1门-加钞间</h3>
              <li v-for="(item, index) in currtItem" :key="index">
                <i>{{item.title}}</i>
                <i>{{item.text}}</i>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button v-if="fn" type="primary" size="mini" @click="close(fn)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:['footerItem',],
  data() {
    return {
      dialogVisible: false,
      activeNames: ['1', '2', '3', '4']
    }
  },
  methods: {
    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
    },
    handleChange(val) {
      console.log(val)
    },
    open() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1'
      }
      openAccess(body).then(res => {
        console.log('Log 查看开门数据', res)
        /* 调用成功后返回msaage 根据mseeage判定开关门按钮可用状态
        调用开门接口 如果message为 `success` 则开门按钮不可用 
        */
      })
    },
    closeFlor() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1'
      }
      closeTheflor(body).then(res => {
        console.log('Log 查看关门数据', res)
        /* 
        调用关门按钮的基础建立在 点击开门后 返回的message 为 success 
        点击关门后 如果成功则关门按钮不可使用
        */
      })
    },
    //开启对讲
    openIntercom() {
      let callerInfo = {
        id: '111',
        ip: '192.168.14.208',
        port: 2048
      }

      //面板
      let calledInfo = [
        {
          hostIp: '192.168.14.202',
          hostPort: 2046,
          hostId: '003',
          id: 1
        }
        // {
        //   hostIp: '192.168.14.202',
        //   hostPort: 2046,
        //   hostId: '003',
        //   id: 2
        // },
        // {
        //   hostIp: '192.168.14.204',
        //   hostPort: 2046,
        //   hostId: '004',
        //   id: 1
        // }
      ]

      //麦克
      let mikeInfo = [
        {
          hostIp: '192.168.14.203',
          hostPort: 2046,
          hostId: '',
          id: '002'
        }
      ]
      callerInfo = JSON.stringify(callerInfo)
      calledInfo = JSON.stringify(calledInfo)
      mikeInfo = JSON.stringify(mikeInfo)
      let body = {
        serverId: '002',
        serverIp: '192.168.14.203',
        serverPort: '2046',
        callerInfo: callerInfo,
        calledInfo: calledInfo
        // callerInfo,
        // calledInfo,
        // mikeInfo
      }
      openVideo(body).then(res => {
        this.seqId = res.data.data.seqId
        console.log('Log 查看id为?', this.seqId)
      })
    },
    //关闭对讲
    offIntercom() {
      if (!this.seqId.trim()) return
      let params = {
        seqId: this.seqId,
        serverIp: '002',
        serverPort: '2046'
      }
      offVideo(params).then(res => {
        console.log('Log 关闭对讲成功?', res)
      })
    },
    //报警开启
    alarmAccessOpen() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1'
      }
      alarmOpen(body).then(res => {
        console.log('Log 报警开启?', res)
      })
    },
    //报警关闭
    alarmAccessClose() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1'
      }
      AlarmClose(body).then(res => {
        console.log('Log 报警关闭?', res)
      })
    }
  },
  mounted() {
    // console.log('Log 查看分割后的数组', res)
    this.handleClose(() => {})
    // 第一次调用展示初始化状态 呈现开门或者是关门
    getPassageway({
      devIp: '10.1.1.91',
      devPort: 9708,
      hostId: '228e86910a2349e9a7f17dab97cb8054',
      channelId: '228e86910a2349e9a7f17dab97cb8054_1'
    }).then(res => {
      console.log('Log 查看res?的数据为?', res.data.data)
    })
  }
}
</script>

<style lang="less" scoped>
</style>


