<template>
  <div class="single-most-outer" @click.stop="clickEvent(null,1)" @dblclick="clickEvent(null,2)">
    <div class="single-outer">
      <!-- 插件 -->
      <div
        class="plugin-video"
        :class="{'small-button': paneMark!==0 && defaultPane===5 && !isMaximize, 'top': appendTopButtons.toggle}"
        :style="singleStatus.isSyncPlay ? 'position: fixed;top: -9999px;': ''"
        v-if="singleStatus.isPlugin&&singleStatus.playStatus"
      >
        <object ref="object" type="application/x-webplayercontrol"></object>
        <!-- <iframe v-if="false" class="bottom-iframe"></iframe>
        <div class="plugin-button" v-if="false" @dblclick.stop>
          <div class="plugin-button-box">
            <i class="icon iconfont icon-screenshot" :class="{'disable': !singleStatus.isPlay}" title="截图" @click="getCapture" v-if="pluginIconShow.screenshot || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.isBoost? 'icon-nk-close' : 'icon-niaokan']" :title="[singleStatus.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()" v-if="pluginIconShow.niaokanIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont icon-tv-wall" title="快速上墙" @click="toWallBtn()" v-if="pluginIconShow.tvwallIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont-ccb ccbliebiao" title="详情" v-if="pluginIconShow.yuntaiIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.showVolume&&singleStatus.isPlay? 'icon-volume': 'icon-mute']" title="开启伴音" @click="changeSound()" v-if="pluginIconShow.muteIcon || singleStatus.fullScreen"></i>
            <div class="div-null"></div>
            <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()" v-if="pluginIconShow.previewStopIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.fullScreen&&singleStatus.isPlay? 'icon-exit-full-screen': 'icon-quanpingfangda']" :title="[singleStatus.fullScreen?'退出全屏':'全屏']" @click="fullScreen" v-if="pluginIconShow.quanpingfangdaIcon || singleStatus.fullScreen"></i>
          </div>
        </div> -->
        <div class="plugin-button-top" v-if="flag" @dblclick.stop>
          <iframe v-if="flag" class="top-iframe"></iframe>
          <div class="plugin-button-box">
            <slot ref="slot" class="slot" :paneMark="paneMark" name="close"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- <slot ref="slot" class="slot" name="close" :paneMark="paneMark"></slot> -->
  </div>
</template>
<script>
import { screenShootApi } from '@src/http/video/videoPreview.api.js'
export default {
  props: {
    flag: {
      type: Boolean,
      default: true
    },
    singleStatus: {
      type: Object,
      default: () => {
        return {
          isPlugin: true, // 插件播放还是h5
          playStatus: false, // 画面是否在使用
          isButton: false, // 是否显示插件悬浮条
          isPlay: false, // 是否播放
          img: '' // 图片遮盖的base64
        }
      }
    },
    appendTopButtons: {
      // 视频窗口上方的按钮
      type: Object,
      default: () => {
        return {
          toggle: false, // 是否显示
          buttons: [] // 显示那些按钮 change
        }
      }
    },
    paneMark: {
      // 当前窗格号
      type: Number,
      default: 0
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 25
    },
    isMaximize: {
      // 单画面(双击)
      type: Boolean,
      default: false
    },
    pluginIconShow: {
      // 单个插件内图标是否显示
      type: Object,
      default: () => {
        return {
          showBottomIcon: true, // 图标按钮条
          hidemenuIcon: true, // 隐藏
          previewStopIcon: true, // 关闭预览
          isRecordingIcon: true, // 录像类型
          streamChangeIcon: true, // 码流切换
          screenshot: true, // 截图
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          speechIcon: true, // 对讲
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quanpingfangdaIcon: true // 全屏
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {},

  mounted() {
    // let iframeEle = document.getElementsByTagName('iframe')
    // iframeEle[this.checkedPane].style.width = '10%';
    // iframeEle[this.checkedPane].style.minWidth = '20px';
    this.$nextTick(function() {
      setTimeout(() => {
        if (this.$refs.object) {
          this.$refs.object.SetMouseStatusCallback(this.clickEvent)
          this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
          this.$refs.object.SetNotifyCallback(this.notifyCallback)
        }
      }, 100)
    })
  },
  watch: {
    'singleStatus.playStatus': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(this.clickEvent)
              this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
              this.$refs.object.SetNotifyCallback(this.notifyCallback)
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(null)
              this.$refs.object.SetKeyboardCallback(null)
              this.$refs.object.SetNotifyCallback(null)
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    clickEvent(index, clickType) {
      console.log('触发双击事件',clickType)
      this.$emit('updateStatus', this.paneMark, { isButton: this.singleStatus.isPlay }, 'isButton')
      this.$emit('clickEvent', index, clickType, this.paneMark)
    },
    changeScreen() {
      // 大小窗口切换
      this.$emit('changeScreen', this.paneMark)
    },
    boost() {
      // 鸟瞰
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$refs.object.SetPlayLocalBoost()
      this.$emit('updateStatus', this.paneMark, { isBoost: !this.singleStatus.isBoost })
    },
    fullScreen() {
      // 全屏
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$parent.fullScreen()
    },
    toWallBtn() {
      // 上墙
      this.$parent.toWallBtn()
    },
    getCapture() {
      // 截图
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let cameraName = this.singleStatus.source ? this.singleStatus.source.cameraName : this.singleStatus.result.name // 回放预览公用 数据兼荣
      let picName = cameraName + '_' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = this.$refs.object.GetPlayerPicture(path, picType)
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    async getBase64Capture() { // Base64截图,上传服务器
      if (!this.singleStatus.isPlay) {
        return
      }
      let Base64Data = await this.getCoverPic()
      let param = {
        base64Img: Base64Data,
        channelId: this.singleStatus.result.id || this.singleStatus.queryInformation.id
      }
      screenShootApi(param).then(res => {
        console.log(res, '截图-res')
        if (res.data.code === 0) {
          this.$messageSuccess('截图上传成功！', '成功')
        } else {
          this.$messageError(`截图上传失败,失败原因${res.data.message}！`)
        }
      }).catch(err => {
        console.log(err, '截图-err')
        this.$messageError('截图上传失败，请稍后重试！', '错误')
      })
    },
    getCoverPic() {
      // 视频截图
      return new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.$refs.object.GetRealPicturebyBase64(1, 50)
        }
        resolve(src)
      })
    },
    changeSound() {
      // 音量开关
      if (!this.singleStatus.isPlay) {
        return
      }
      if (this.singleStatus.showVolume) {
        this.closeSound()
      } else {
        this.openSound()
        this.setSoundValue(50)
      }
    }
  },
  beforeDestroy() {}
}
</script>
<style lang="less" scoped>
.single-most-outer {
  // background-color: #dedede;
  background-color: #404040;
  position: relative;
  z-index: 99;
  display: inline-block;
  width: 100%;
  height: 100%;
  border: 2px solid #fff;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.single-outer {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  .sync-play-shade {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #000;
    span {
      font-size: 100px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
  }
  .sync-play-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    vertical-align: middle;
    width: 100%;
    z-index: 2;
  }
  .plugin-video,
  .label-video {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  .plugin-video {
    z-index:1;
    position: relative;
    object {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    // /deep/ .top-iframe {
    //   width: 3%;
    //   height: 20px;
    //   position: absolute;
    //   //bottom: 0px;
    //   top: 0px;
    //   right: 0px;
    //   // background: #333;
    //   border: 0px;
    //   min-width: 20px;
    //   z-index: 1;
    // }
    /*.plugin-button,*/.plugin-button-top {
      // width: 100%;
      // height: 20px;
      position: absolute;
      top: 0px;
      right: 0px;
      text-align: right;
      z-index: 2;
      .top-iframe {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        right: 0px;
        background: transparent;
        border: 0px;
        z-index: 1;
      }
      .plugin-button-box {
        position: relative;
        z-index: 100;
        // display: flex;
        // justify-content: flex-end;
        // align-items: center;
        .disable,
        .disable:hover {
          color: #878282;
        }
        .dp-con {
          position: relative;
          display: inline-block;
          ul {
            position: absolute;
            background-color: #2d72d3;
            list-style: none;
            color: snow;
            text-align: center;
            line-height: 25px;
            padding: 0 6px;
            border-radius: 4px;
            top: 3px;
            right: 37px;
            i {
              display: block;
              position: absolute;
              background: #2d72d3;
              width: 10px;
              height: 10px;
              transform: rotate(45deg);
              top: 7px;
              right: -13px;
            }
            li {
              display: inline;
              white-space: nowrap;
              line-height: 25px;
              padding: 0 8px;
              border-right: 1px solid hsla(0, 0%, 100%, 0.1);
            }
            .active {
              color: #fda54b;
            }
          }
          li:hover {
            color: #fda54b;
            cursor: pointer;
            margin: 2px 0;
          }
        }
        .div-null {
          display: flex;
          flex: 1;
        }
        i {
          font-size: 1.7em;
          margin: 0 8px;
          line-height: 30px;
          cursor: pointer;
        }
      }
      &.top {
        top: 0;
        .plugin-button-box {
          justify-content: flex-end;
          i:hover {
            color: #00a5e3;
          }
        }
      }
    }
    // .plugin-button-top{
    //   top: 0px;
    //   right: 0px;
    //   width: 10%;
    //   height: 20px;
    // }
  }
  .plugin-video.top {
    iframe {
      top: 0;
      height: 30px;
    }
  }
  .small-button {
    iframe {
      height: 30px;
    }
    .plugin-button {
      height: 30px;
      .plugin-button-box {
        i {
          font-size: 12px;
          margin: 0 3px;
        }
      }
    }
  }
}
.slot{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}
.PTZbuttonBars {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  background: #ddddee;
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
</style>
