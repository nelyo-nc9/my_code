<template>
  <i
    class="icon iconfont icon-screenshot"
    :class="[selectedObj.isPlay && !isSync ? '':'disable']"
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
      if (this.selectedObj.isPlay && !this.isSync) {
        this.$emit('iconClick', 'getPic')
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
