<!--
 * @Author: dfk
 * @Date: 2020-08-08 22:19:21
 * @LastEditTime: 2020-08-14 19:44:12
 * @LastEditors: dfk
 * @Description:
-->
<template>
  <div class="full-screen-box">
    <i
      class="icon iconfont icon-full-screen"
      v-if="!isFullScreen"
      :class="[selectedObj.isPlay && !isSync ? '':'disable']"
      title="全屏"
      @click="fullScreen"
    ></i>
    <i
      class="icon iconfont icon-exit-full-screen"
      v-if="isFullScreen"
      title="退出全屏"
      @click="escScreen"
    ></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'FullScreen',
  inheritAttrs: false,
  data() {
    return {
      isFullScreen: false,
      isSync: false
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSyncF: {
      type: Boolean
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizefun)
  },
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
  },
  methods: {
    // 窗口改变调用函数
    resizefun() {
      screenfull.on('change', () => {
        if (!screenfull.isFullscreen) {
          this.isFullScreen = false
        } else {
          // 进入全屏
          this.isFullScreen = true
        }
      })
    },
    fullScreen() {
      if (this.selectedObj.isPlay && !this.isSync) {
        this.isFullScreen = true
        this.$emit('iconClick', 'requestFull')
      }
    },
    escScreen() {
      this.$emit('iconClick', 'escScreenFull')
      this.isFullScreen = false
    }
  }
}
</script>
<style lang='less' scoped>
.full-screen-box {
  padding: 0px 8px;
}
i {
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
.disable {
  cursor: not-allowed;
  color: #ccc;
}
</style>
