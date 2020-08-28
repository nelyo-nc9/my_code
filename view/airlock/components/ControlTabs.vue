<template>
  <div class="footer-table">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="互锁门事件"
                   name="first">
        <el-table :data="eventTable.slice((eventCurrentPage - 1) * eventPagesize, eventCurrentPage * eventPagesize)"
                  style="width: 100%"
                  height="calc(100% - 29px)">
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="channelName"
                           label="门禁通道"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceName"
                           label="所属设备"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="locationName"
                           label="所属重点部位"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="orgName"
                           label="所属机构"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="eventTypeName"
                           label="事件类型"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="occurTime"
                           label="时间"
                           align="center"
                           show-overflow-tooltip
                           sortable>
            <template slot-scope="scope">
              {{ formatTime(scope.row.startTime) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="eventHandleSizeChange"
                       @current-change="eventHandleCurrentChange"
                       :current-page="eventCurrentPage"
                       :page-sizes="[60]"
                       :page-size="eventPagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="eventTotal"
                       style="text-align:right;">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="互锁门报警"
                   name="second">
        <el-table :data="alarmTable.slice((policeCurrentPage - 1) * policePagesize, policeCurrentPage * policePagesize)"
                  style="width: 100%"
                  height="calc(100% - 29px)"
                  @row-dblclick="alarmRouter">
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="channelName"
                           label="门禁通道"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="deviceName"
                           label="所属设备"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="locationName"
                           label="所属重点部位"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="orgName"
                           label="所属机构"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="eventTypeName"
                           label="报警类型"
                           align="center"
                           show-overflow-tooltip
                           sortable></el-table-column>
          <el-table-column prop="startTime"
                           label="时间"
                           align="center"
                           show-overflow-tooltip
                           sortable>
            <template slot-scope="scope">
              {{ formatTime(scope.row.startTime) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="policeHandleSizeChange"
                       @current-change="policeHandleCurrentChange"
                       :current-page="policeCurrentPage"
                       :page-sizes="[60]"
                       :page-size="policePagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="policeTotal"
                       style="text-align:right;">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-dialog title="联动互锁门控制"
               :visible.sync="dialogVisible"
               width="1115px"
               custom-class="dialog-message"
               :before-close="handleClose"
               top="12vh"
               append-to-body
               :close-on-click-modal="false"
               :showClose="false"
               v-dialogDrag>
      <iframe v-if="dialogVisible"
              style="width:100%;height: 100%;position:absolute;top:0;left: 0;z-index: -2;"></iframe>
      <div class="message-content">
        <div class="con-left">
          <div class="video-top">
            <preview-plugin :defaultPane="defaultPane"
                            :iconShow="iconShowParams"
                            ref="preview"></preview-plugin>
          </div>
          <div class="message-footer">
            <div class="message-list">
              <span class="title"> {{ rowData.channelName }}</span>
              <span class="message">
                <span>所属机构：{{ rowData.orgName }}</span>
                <span>型号：{{ rowData.modelNum }}</span>
              </span>
              <span class="message">
                <span>所属重点部位：{{ rowData.locationName }}</span>
                <span>品牌：{{ rowData.brand }}</span>
              </span>
              <span class="message">
                <span>所属门禁主机：{{ rowData.hostName }}</span>
                <span>备注：{{ rowData.remake }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="con-right">
          <div class="tab-top">
            <el-collapse v-model="activeNames"
                         @change="handleChange">
              <el-collapse-item title="视频设备"
                                name="1">
                <div class="isBor"
                     v-for="(item, index) in video"
                     :key="index">
                  <i class="el-icon-video-camera"></i>
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item.name"
                              placement="top-start">
                    <span @click="preview(item)">{{ item.name }}</span>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="互锁门控制"
                                name="2">
                <div v-for="(item, index) in guard"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-refrigerator"></i>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.channelName"
                                placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose"
                        v-if="item.status !== 2"
                        @click="openDoor(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose"
                        v-if="item.status === 2"
                        @click="closeDoor(item, index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲控制"
                                name="3">
                <div v-for="(item, index) in audio"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-microphone"></i>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.name"
                                placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="audo"
                        style="display:flex">
                    <i class="el-icon-microphone"
                       v-if="item.status === 2"
                       @click="startTalking(item, index)"></i>
                    <i class="el-icon-turn-off-microphone"
                       v-else
                       @click="stopTalking(item, index)"></i>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="输出设备"
                                name="4">
                <div v-for="(item, index) in output"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-location-outline"></i>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.name"
                                placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose"
                        v-if="item.status === 1"
                        @click="alarmAccessOpen(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose"
                        v-if="item.status === 2"
                        @click="alarmAccessClose(item, index)">
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
          <div class="footer-close">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  openDoor,
  closeDoor,
  alarmOpen,
  AlarmClose,
  startTalking,
  stopTalking,
  audioLink,
  linkageConfiguration,
  closeAlarmoutputs,
} from '@src/http/InterlockingDoor/linkedAirlockLog.api'
import socket from '@src/socket/alarm'
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
export default {
  name: 'control-tabs',
  components: { previewPlugin },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      activeName: 'first',
      eventTable: [],
      alarmTable: [],
      dialogVisible: false,
      fn: null,
      rowData: [],
      policeTotal: 0,
      policePagesize: 60,
      policeCurrentPage: 1,
      eventTotal: 0,
      eventPagesize: 60,
      eventCurrentPage: 1,
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
        { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      video: [], //视频列表
      audio: [], //音频列表
      guard: [], //门禁列表
      output: [], //输出列表
      seqId: '',
      alarmInfo: {},
      personInfo: {},
      myMikeIdData: '',
      myMikeIdDatas: '',
    }
  },
  mounted() {
    socket.on('alarmGuardAirlock', (data) => {
      let obj = { ...data.alarmInfo, dispose: data.dispose, personInfo: data.personInfo }
      this.alarmTable.push(data.alarmInfo)
      this.policeTotal = this.alarmTable.length
    })
    socket.on('eventGuardAirlock', (data) => {
      let obj = { ...data.alarmInfo, dispose: data.dispose, personInfo: data.personInfo }
      this.eventTable.push(data.alarmInfo)
      this.eventTotal = this.eventTable.length
    })
  },
  destroyed() {
    console.log('销毁')
    socket.remove('alarmGuardAirlock', (data) => {
      console.log(data)
    })
    socket.remove('eventGuardAirlock', (data) => {
      console.log(data)
    })
  },
  computed: {},
  methods: {
    ...mapActions(['channelStartTalk']), //开始对讲
    ...mapActions(['channelCloseTalk']), //关闭对讲
    ...mapActions(['getMac']), //查询指定mac地址的台麦主机
    alarmRouter() {
      this.$router.push({ path: '/intelligentSecurity/warnn/alarmDeal' })
    },
    // 报警开启
    alarmAccessOpen(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          console.log(res)
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        alarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code === 0) {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'open' }).then((res) => {
          if (res.data.data.code === 0) {
            this.$messageSuccess('通道开启!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },
    // 报警关闭
    alarmAccessClose(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: false }] }).then((res) => {
          console.log(res)
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        closeAlarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code === 0) {
            this.$messageSuccess('关闭成功!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'close' }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.code === 0) {
              this.$messageSuccess('通道关闭!')
              this.output[index].status = 1
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        })
      }
    },
    //开门
    openDoor(item, index) {
      let obj = {
        devIp: item.ip,
        devPort: item.port,
        hostId: item.personInfo.hostId,
        channelId: item.personInfo.doorOrChanId,
      }
      openDoor(obj).then((res) => {
        this.guard[index].status = 1
        this.$message({
          message: '门已开启',
          type: 'success',
        })
        //  this.$parent.getAppointHost(item.deviceId).then((res) => {
        //   console.log(res)
        // })
      })
    },
    closeDoor(item, index) {
      let obj = {
        devIp: item.ip,
        devPort: item.port,
        hostId: item.personInfo.hostId,
        channelId: item.personInfo.doorOrChanId,
      }
      closeDoor(obj).then((res) => {
        this.guard[index].status = 2
        this.$message({
          message: '门已关闭',
          type: 'success',
        })
      })
    },
    //开启对讲
    startTalking(item, index) {
      //主叫设备话筒id（设备主键id）
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      console.log(mac)
      this.getMac({ mac }).then((res) => {
        console.log(res)
        this.myMikeIdData = res.data.data.id
        console.log(this.myMikeIdData)
        //开始对讲
        this.channelStartTalk({ myMikeId: this.myMikeIdData, calledpanelIds: item.id }).then((res) => {
          console.log(res)
          this.audio[index].status = 1
          this.seqId = res.data.seqId || '111'
        })
      })
    },
    //关闭对讲
    stopTalking(item, index) {
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      console.log(mac)
      this.getMac({ mac }).then((res) => {
        console.log(res)
        this.myMikeIdDatas = res.data.data.id
        console.log(this.myMikeIdDatas)
        //开始对讲
        this.channelCloseTalk({ seqId: this.seqId, myMikeId: this.myMikeIdDatas }).then((res) => {
          this.audio[index].status = 2
          console.log(res)
        })
      })
    },
    //视频播放
    preview(val) {
      let data = {
        channel: 1,
        ip: val.ip,
        cPort: val.cport,
        dPort: val.dport,
        streamType: 'sub1',
      }
      this.$refs.preview.openPreview(data)
    },
    policeHandleSizeChange(size) {
      this.policePagesize = size
    },
    policeHandleCurrentChange(currentPage) {
      this.policeCurrentPage = currentPage
    },
    eventHandleSizeChange(size) {
      this.eventPagesize = size
    },
    eventHandleCurrentChange(currentPage) {
      this.eventCurrentPage = currentPage
    },
    formatTime(timestamp, separator = '-', timeS = ':', flag = true) {
      let str = ''
      let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + separator
      let M = this.autoChange(date.getMonth() + 1) + separator // 计算机的月份是从0开始滴，需要+1
      let D = this.autoChange(date.getDate())
      str = Y + M + D
      if (flag) {
        let h = this.autoChange(date.getHours()) + timeS
        let m = this.autoChange(date.getMinutes()) + timeS
        let s = this.autoChange(date.getSeconds())
        let timeStr = h + m + s
        str += ' '
        str += timeStr
      }
      return str
    },
    autoChange(num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
    handledbClick(row) {
      this.dialogVisible = true
      this.rowData = row
      this.guard = [row]
      if (row.action_dict.cameraInfo !== '') {
        this.video = row.action_dict.cameraInfo
        console.log(this.video)
      }
      if (row.action_dict.TalkInfo !== '') {
        this.audio = row.action_dict.TalkInfo
      }
      if (row.action_dict.channelInfo !== '') {
        this.output = row.action_dict.channelInfo
      }
      // linkageConfiguration(row.id, { ref: '2' }).then((res) => {
      //   if (res.data.code === 0) {
      //     res.data.data.video.forEach((item) => {
      //       this.video.push(item)
      //     })
      //     res.data.data.audio.forEach((item) => {
      //       this.audio.push(item)
      //     })
      //     res.data.data.output.forEach((item) => {
      //       this.output.push(item)
      //     })
      //   }
      // })
      console.log(row)
    },
    handleChange(val) {
      // console.log(val)
    },
    closeDoor() {
      let obj = {
        doorServerIp: this.rowData.ip,
        doorServerPort: this.rowData.port,
        hostId: this.rowData.alarmTypeId,
        doorId: this.rowData.locationId,
      }
      closeDoor(obj).then((res) => {
        console.log(res)
      })
    },
    openDoor() {
      let obj = {
        devIp: this.rowData.ip,
        devPort: this.rowData.port,
        hostId: this.rowData.alarmTypeId,
        channelId: this.rowData.locationId,
      }
      openDoor(obj).then((res) => {
        console.log(res)
      })
    },
    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
    },
    handleClose(done) {
      this.fn = done
      this.dialogVisible = false
      if (!this.dialogVisible) {
        done()
      }
    },
    /*
     * 切换tabs
     */
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>
<style lang="less" scoped>
.footer-table {
  height: 100%;
  /deep/ .el-pager li:hover.active {
    color: #2d72d3 !important;
  }
  /deep/.el-tabs {
    height: calc(~'100% - 1px');
    .el-tabs__header {
      border-bottom: 1px solid #e1e1e1;
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            border-radius: 0;
            border: none;
            .el-tabs__item {
              border-top-color: #fff;
              border-left: 1px solid #fff;
              border-right: 1px solid #fff;
            }
            .is-active {
              position: relative;
              border-left: 1px solid #e1e1e1;
              border-right: 1px solid #e1e1e1;
            }
            .is-active::after {
              content: '';
              display: block;
              width: 110px;
              height: 2px;
              background: #2d72d3;
              position: absolute;
              left: 0px;
              top: 0px;
            }
          }
        }
      }
    }
    .el-tabs__content {
      height: calc(~'100% - 55px');
      .el-tab-pane {
        height: 100%;
      }
      .el-pagination {
        height: 29px;
      }
    }
  }
  /deep/ .el-table {
    .el-table__header-wrapper {
      font-size: 12px;
    }
    .el-table__body-wrapper {
      font-size: 12px;
      .el-link--inner {
        font-size: 12px;
      }
    }
  }
}
.el-divider--horizontal {
  margin: 0;
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
        width: 828px;
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
                width: 100px;
                margin-right: 50px;
              }
            }
          }
        }
      }
      .con-right {
        width: 223px;
        height: 651px;
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
                      i {
                        line-height: 19px;
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
}
</style>
<style scoped>
.el-tabs >>> .el-tabs__nav-wrap::after {
  background-color: #fff;
}
</style>
