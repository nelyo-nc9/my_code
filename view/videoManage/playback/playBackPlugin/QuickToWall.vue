<template>
  <div class="wall">
    <div v-if="showWall" class ="quick-wall" :style="{width: boxWidth, height: boxHeight, position: 'relative'}">
      <!-- <div class="monitor" v-for="(info, i) in infos" :key="i" :style="enableController ? {
        position: 'absolute',
        top: info.top,
        left: info.left,
        width: info.width,
        height: info.height} : {}"> -->
      <div class="monitor" v-for="(info, i) in infos" :key="i">
        <div class="channel" :class="{alarm: !info.use, checked: checkedIndex === i + '-' + index}" v-for="index in info.paneCount"
        :style="[styCompute(info.paneCount, index)]" :key="i + '-' + index"
        @click="clickHandler(i + '-' + index, info)">
        </div>
      </div>
    </div>
    <div v-else class="bg-wall">
      请添加电视墙,再进行操作
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { NVR_RECORD_OPEN } from '@src/components/videoPlugin/playback/common/requestFunction'
// import axios from 'axios'
export default {
  props: {
    camera: {
      type: Object
    },
    isPlayback: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedIndex: null,
      infoList: [],
      layout: {},
      row: 0,
      clo: 0
    }
  },
  created() {
    console.log('接收到的值----------', this.camera)
    // let params = { // 后期接口遗留字段
    //     orgId: this.camera.orgId,
    //     keyPartId: this.camera.keyPartId
    // }
    let params = {}
    this.getTvWallMenuList(params).then((res) => {
      console.log('获取电视墙--------', res)
      if (res.data.code === 0) {
        this.dealWallData(res.data.data)
      }
    })
  },
  computed: {
    boxWidth() {
      let oneWidth = 75
      return oneWidth * this.layout.column + 'px'
    },
    boxHeight() {
      let oneHeight = 43
      return oneHeight * this.layout.row + 'px'
    },
    showWall() {
      return this.layout.row > 0
    }
  },
  watch: {
    layout: {
      handler(val) {
        this.infoList = []
        let count = 0
        if (this.layout) {
          count = this.layout.column * this.layout.row
        }
        this.infoList = this.setWallList(count)
        this.infos = this.infoList
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(['openWall', 'getTvWallMenuList']),
    // 设置电视墙所需窗口数组
    setWallList(count) {
      const list = []
      if (count === 0 || !count) {
        return this.infoList
      }
      const key = this.layout.enableController ? 'code' : 'monitor'
      for (let i = 0; i < count; i++) {
        let obj = {
          use: false,
          paneCount: 1
        }
        obj[key] = i + 1
        list.push(obj)
      }
      // console.log('this.layout', this.layout)
      const sc = this.layout.enableController ? this.layout.rtlayout : this.layout.rtscene
      const infoData = sc && this.layout.enableController ? sc.wininfo : sc.sceneInfo
      if (infoData) {
        infoData.forEach((item, index) => {
          const mInfo = this.$lodash.find(list, it => it[key] === item[key])
          if (mInfo) {
            mInfo.paneCount = item.paneCount
            mInfo.use = true
          }
        })
      }
      // console.log('电视墙所需数组---------', list)
      return list
    },
    styCompute(count, index) {
      return this.getLayoutStyle(count)[index - 1]
    },
    clickHandler(index, info) {
      console.log('-------', this.layout)
      if (this.layout.linkWall && this.layout.linkWall === 1) {
        if (index === this.checkedIndex) {
          this.checkedIndex = null
        } else {
          this.checkedIndex = index
          this.$emit('checkWall', index)
          this.addToWall(this.camera, info, index)
        }
      } else {
        this.$message('暂无可用的电视墙')
      }
    },
    async addToWall(resInfo, info, index) { // todo 自己在外部构造调用接口所需的数据
      console.log('-------', resInfo, info, index, this.layout)  // type 为1 monitor  2 code
      const arr = index.split('-')
      // const key = this.layout.enableController ? 'code' : 'monitor'
      const key = this.layout.type === 2 ? 'code' : 'monitor'
      let windowsRect = {
        paneCount: Number(arr[1])
      }
      windowsRect[key] = info[key]
      let share = {
        rid: resInfo.id, // 设备id
        wallId: this.layout.id, // 电视墙id
        devIp: resInfo.devIp, // 设备ip
        devPort: resInfo.devPort, // 设备端口
        channel: resInfo.channel, // 通道
        streamType: resInfo.streamType, // 码流类型，MAIN SUB1 SUB2
        streamConnPort: '',
        deviceType: resInfo.deviceType, // 大于3 是中心回放，123为前端回放
        windowsRect
      }
      let params = {}
      if (resInfo.deviceType <= 3) {
        // 前端回放上墙参数  前端回放分为国标和非国标
        // 请求ts 服务
        if (resInfo.devType === 2) {
          // 前端回放 国标
        } else {
          // 前端回放 非国标
          let {data} = await this.getFrontdevPlayBack()
          console.log('==================', data)
          params = {
            ...share,
            tsIp: data.TsIp, // ts服务ip
            tsPort: data.TsPort, // ts服务端口
            streamId: data.streamId, // //前端历史播
            vendor: '' // 品牌
          }
        }
      } else if (resInfo.deviceType > 3) {
        // 中心回放上墙
        if (resInfo.devType === 3) {
          // 中心非国标
          params = {
            ...share,
            dsIp: resInfo.ip,
            dsPort: resInfo.port,
            dsCmdContent: {
              params: {
                jsonrpc: '2.0',
                id: '1',
                method: 'brest',
                call: 'AV.Record.playopen',
                args: {
                  eventList: {
                    timeInfo: {
                      startTime: resInfo.startTime,
                      endTime: resInfo.endTime
                    }
                  }
                }
              }
            }
          }
        } else {
          // 中心国标
        }
      };
      this.$emit('addToWall', params)
    },
    findResource(index) {
      const arr = index.split('-')
      const monitorcode = +arr[0]
      const pane = +arr[1]
      const info = this.infos[monitorcode]
      return info.resources[pane]
    },
    dealWallData(res) { // 处理上墙的逻辑
      let _this = this
      let wallInfo = res && res.results
      // 改造数据
      wallInfo.forEach(wall => {
        if (wall.linkWall === 1) { // 过滤出默认电视墙
          wall.column = wall.rtlayout.column
          wall.row = wall.rtlayout.row
          wall.enableController = wall.type === 2
          _this.layout = wall
        }
      })
    },
    // 前端回放开流信息
    getFrontdevPlayBack() {
      let objOpen = {
        channel: this.camera.channel,
        devIp: this.camera.devIp,
        devPort: this.camera.devPort,
        endTime: this.camera.endTime,
        startTime: this.camera.startTime,
        streamType: this.camera.streamType
      }
      return NVR_RECORD_OPEN(objOpen)
    },

    getLayoutStyle(paneCount) { // 获取布局信息
      let panes = []
      let width3 = 100 / 3 + '%'
      let width6 = 200 / 3 + '%'
      switch (paneCount) {
        case 1:
          panes = [
            { left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }
          ]
          break
        case 4:
          panes = [
            { left: 0, top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' }
          ]
          break
        case 6:
          panes = [
            { left: 0, top: 0, width: `calc(${width6} - 1px)`, height: `calc(${width6} - 1px)`, position: 'absolute' },
            { left: width6, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' }
          ]
          break
        case 8:
          panes = [
            { left: 0, top: 0, width: '75%', height: '75%', position: 'absolute' },
            { left: '75%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' }
          ]
          break
        case 9:
          panes = [
            { left: 0, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: 0, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width3, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: 0, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width3, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' },
            { left: width6, top: width6, width: `calc(${width3} - 1px)`, height: `calc(${width3} - 1px)`, position: 'absolute' }
          ]
          break
        case 16:
          panes = [
            { left: 0, top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: 0, width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '25%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '50%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: 0, top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '25%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '50%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' },
            { left: '75%', top: '75%', width: 'calc(25% - 1px)', height: 'calc(25% - 1px)', position: 'absolute' }
          ]
          break
        default:
          panes = [
            { left: 0, top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: 0, width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: 0, top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' },
            { left: '50%', top: '50%', width: 'calc(50% - 1px)', height: 'calc(50% - 1px)', position: 'absolute' }
          ]
          break
      }
      return panes
    }
  }
}
</script>
<style scoped lang="less">
.bg-wall {
  width: 170px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.wall {
  text-align: left;
  border: 1px solid #00a5e3;
}
.quick-wall {
  position: relative;
}
.monitor,
.channel {
  display: inline-block;
  vertical-align: middle;
}

.monitor {
  position: relative;
  width: 72px;
  height: 40px;
  margin: 1.5px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  line-height: 0;
}

.channel {
  margin: 0.5px;
  background: rgb(153, 153, 153);
  box-sizing: border-box;
}

.channel.alarm {
  background: #fff;
}

.channel.checked {
  border: 1px solid #ed3f14;
  background: darkslategray !important;
}
</style>
