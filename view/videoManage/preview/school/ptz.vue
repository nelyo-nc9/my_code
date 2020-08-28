<template>
  <div class="ptz-box">
    <div class="PTZbuttonBars"
      @mouseup.stop="controlDome(item.addess,0)"
      @mousedown.stop="controlDome(item.addess)"
      v-for="(item, i) in xy" :key="i"
      :style="{left: item.x, top: item.y}">
      <iframe allowTransparency="true"></iframe>
      <div class="buttonBar-box buttonBar-boxs" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" :title="item.addess"  style="width: 100%; height: 100%" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { YUNNAN_CTRL_SET } from '@src/http/video/videoPreview.api.js'
export default {
  name: 'PTZ',
  props: {
    singleStatus: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      xy: [
        { x: '50%', y: '20%', angle: '0', addess: 'tiltUp', img: '/static/image/yuntai/bottom1.png' },
        { x: '50%', y: '70%', angle: '180', addess: 'tiltDown', img: '/static/image/yuntai/bottom1.png' },
        { x: '11%', y: '45%', angle: '-90', addess: 'panLeft', img: '/static/image/yuntai/bottom1.png' },
        { x: '87%', y: '45%', angle: '90', addess: 'panRight', img: '/static/image/yuntai/bottom1.png' },
        { x: '11%', y: '20%', angle: '-90', addess: 'swayUpLeft', img: '/static/image/yuntai/bottom2.png' },
        { x: '11%', y: '70%', angle: '-180', addess: 'swayDownLeft', img: '/static/image/yuntai/bottom2.png' },
        { x: '87%', y: '20%', angle: '0', addess: 'swayUpRight', img: '/static/image/yuntai/bottom2.png' },
        { x: '87%', y: '70%', angle: '90', addess: 'swayDownRight', img: '/static/image/yuntai/bottom2.png' }
      ],
      showPTZ: true
    }
  },
  methods: {
    controlDome(ctrlCmdEnum, speed = 3, presetIndex = 1, route = 1, stopTime = 5, opt = 1, channel = 1) {
      if (!this.singleStatus.isPlay) {
        return
      }
      const item = this.singleStatus.source
      if (!item) {
        return Promise.reject(new Error(false))
      }
      let devInfo = {}
      if (item.sipCode) {
        // const id = window.serverId[item.shareServer]
        devInfo = {
          gbPlaDevIp: item.devIp,
          gbPlaDevPort: item.devCport,
          gbDevId: item.gbDevId,
          gbPlaNvrId: item.gbPlaNvrId
        }
      } else {
        devInfo = {
          devIp: item.devIp,
          devPort: item.devCport
        }
      }
      const param = {
        devCtl: {
          ctrlCmdEnum: ctrlCmdEnum,
          speed: speed,
          presetIndex: presetIndex,
          route: route,
          stopTime: stopTime,
          opt: opt,
          channel: Number(item.channel) || channel
        },
        devInfo: devInfo
      }
      return new Promise((resolve, reject) => {
        YUNNAN_CTRL_SET(param, item.id, 'video')
          .then(suc => {
            resolve(suc)
          })
          .catch(error => {
            reject(error)
            console.log(`云台控制${ctrlCmdEnum}接口错误码：`, error)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ptz-box {
  position: relative;
  width: 100%;
  height: calc(~'100% - 30px');
  .PTZbuttonBars {
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 2;
    background: #ddddee;
    iframe {
      width: 100%;
      height: 100%;
    }
    .buttonBar-box {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 100;
      bottom: 0;
    }
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>