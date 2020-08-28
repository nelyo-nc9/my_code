<template>
  <i class="icon iconfont icon-preview-stop" :class="{'disable': isPollingCopy || !selectedObj.isPlay}" title="关闭预览" @click="stopPreview"></i>
</template>

<script>
export default {
  name: 'Stop',
  inheritAttrs: false,
  data() {
    return {
      isPollingCopy: this.isPolling
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPolling: {
      type: Boolean
    }
  },
  watch: {
    isPolling(nv) {
      this.isPollingCopy = nv
    }
  },
  methods: {
    stopPreview() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.$emit('iconClick', 'stopPreview', undefined, true)
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
