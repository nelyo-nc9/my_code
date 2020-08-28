<template>
  <div class="single-most-outer" @click.stop="clickEvent(null,1)" @dblclick="clickEvent(null,2)">
    <div class="single-outer">
      <!-- 插件 -->
      <div class="plugin-video" :class="{'small-button': paneMark!==0 && defaultPane===5 && !isMaximize, 'top': appendTopButtons.toggle}" :style="singleStatus.isSyncPlay ? 'position: fixed;top: -9999px;': ''" v-if="singleStatus.isPlugin&&singleStatus.playStatus">
        <object ref="object" type="application/x-webplayercontrol"></object>
        <iframe v-if="singleStatus.isPlay && (singleStatus.isButton && (pluginIconShow.showBottomIcon || singleStatus.fullScreen) || appendTopButtons.toggle)"></iframe>
        <div class="plugin-button" v-if="(singleStatus.isButton && singleStatus.isPlay) || singleStatus.fullScreen" @dblclick.stop>
          <div class="plugin-button-box">
            <!-- <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow" v-if="pluginIconShow.hidemenuIcon || singleStatus.fullScreen"></i>
            <div class="div-null"></div>
            <div class="dp-con" @mouseenter="showVideotape = true" @mouseleave="showVideotape = false" v-if="pluginIconShow.isRecordingIcon || singleStatus.fullScreen">
              <i class="icon iconfont icon-recplayback" :class="{'disable': !singleStatus.isPlay}" title="录像"></i>
              <ul v-show="showVideotape && singleStatus.isPlay">
                <li v-for="(item, i) in videotapeList" @click="openRecording(item)" :key="i">{{item.label}}</li>
                <i></i>
              </ul>
            </div>
            <div class="dp-con" @mouseenter="showSetStream=true" @mouseleave="showSetStream=false" v-if="pluginIconShow.streamChangeIcon || singleStatus.fullScreen">
              <ul v-show="showSetStream && singleStatus.isPlay">
                <li v-for="mode in streamArr" :key='mode.value' @click="changeStream(mode.value)" :class="{active: mode.value===(singleStatus.source && singleStatus.source.streamType)}">{{mode.label}}</li>
                <i></i>
              </ul>
              <i class="icon iconfont icon-stream-set" :class="{'disable': !singleStatus.isPlay}" title="码流切换"></i>
            </div>
            <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()" v-if="pluginIconShow.previewStopIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.showVolume&&singleStatus.isPlay? 'icon-volume': 'icon-mute']" title="开启伴音" @click="changeSound()" v-if="pluginIconShow.muteIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont icon-screenshot" :class="{'disable': !singleStatus.isPlay}" title="截图" @click="getCapture" v-if="pluginIconShow.screenshot || singleStatus.fullScreen"></i>
            <i class="icon iconfont icon-yuntai" :class="{disable: !(singleStatus.source.monitortype >= 2)}" title="云台" @click="PTZClick()" v-if="pluginIconShow.yuntaiIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.isSpeech? 'icon-shipinlei-duijiang': 'icon-shipinleiduijiangjinyong', !singleStatus.isPlay? 'disable': '']" :title="[singleStatus.isSpeech?'关闭对讲':'对讲']" @click="clickSpeech()" v-if="pluginIconShow.speechIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.isBoost? 'icon-nk-close' : 'icon-niaokan']" :title="[singleStatus.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()" v-if="pluginIconShow.niaokanIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont icon-tv-wall" title="快速上墙" @click="toWallBtn()" v-if="pluginIconShow.tvwallIcon || singleStatus.fullScreen"></i>
            <i class="icon iconfont" :class="[singleStatus.fullScreen&&singleStatus.isPlay? 'icon-exit-full-screen': 'icon-quanpingfangda']" :title="[singleStatus.fullScreen?'退出全屏':'全屏']" @click="fullScreen" v-if="pluginIconShow.quanpingfangdaIcon || singleStatus.fullScreen"></i> -->
          </div>
        </div>
        <!-- 上方的按钮条 -->
        <div class="plugin-button top" v-if="appendTopButtons.toggle && singleStatus.isPlay" @dblclick.stop>
          <div class="plugin-button-box">
            <!-- <i class="iconfont icon-pingtaihulian" title="窗口切换" @click.stop="changeScreen" v-if="appendTopButtons.buttons.includes('change')"></i> -->
          </div>
        </div>
      </div>
      <!-- 视频遮盖 -->
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && !singleStatus.img"></div>
      <img class="sync-play-img" v-if="singleStatus.isSyncPlay && singleStatus.img" :src="singleStatus.img">
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && singleStatus.isMiddlePlay">
        <span @click="$emit('middlePlay', paneMark)" class="icon iconfont icon-play"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    return {}
  },
  computed: {},
  mounted() {
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
      console.log('clickEvent', index, clickType, this.paneMark)
      this.$emit('updateStatus', this.paneMark, { isButton: this.singleStatus.isPlay }, 'isButton')
      this.$emit('clickEvent', index, clickType, this.paneMark)
    },
    changeScreen() {
      // 大小窗口切换
      this.$emit('changeScreen', this.paneMark)
    }
  },
  beforeDestroy() { }
}
</script>

<style lang="less" scoped>
.single-most-outer {
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
    position: relative;
    object {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    iframe {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      background: #333;
      border: 0px;
    }
    .plugin-button {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      .plugin-button-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
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
