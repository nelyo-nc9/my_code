<template>
  <i class="realbtn iconfont" :class="[selectedObj.isCentreRecording? 'icon-recplayback' : 'icon-videotape-stop', isPollingCopy || !selectedObj.isPlay ? 'disable': '']" @click="openRecording" :title="selectedObj.isCentreRecording ? '关闭紧急录像' : '紧急录像'"></i>
</template>

<script>
export default {
  name: 'VideoTape',
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
    openRecording() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.$emit('iconClick', 'openRecording')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
