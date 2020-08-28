<template>
  <!-- 区分同步异步 -->
  <!-- <i
    class="icon iconfont icon-screenshot"
    :class="[selectedObj.isPlay && !isSync ? '':'disable']"
    title="截图"
    @click="getCapture"
  ></i> -->
  <!-- 不区分同步异步 -->
  <i
    class="icon iconfont icon-screenshot"
    :class="[selectedObj.isPlay ? '':'disable']"
    title="截图"
    @click="getCapture"
  ></i>
</template>

<script>
export default {
  name: 'ScreenShot',
  inheritAttrs: false,
  data() {
    return {
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
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
  },
  methods: {
    getCapture() {
      // 区分同步异步
      // if (this.selectedObj.isPlay && !this.isSync) {
      //   this.$emit('iconClick', 'getBase64Capture')
      // }
      // 不区分同步异步
      if (this.selectedObj.isPlay) {
        this.$emit('iconClick', 'getBase64Capture')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.icon {
  padding: 0 8px;
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
</style>
