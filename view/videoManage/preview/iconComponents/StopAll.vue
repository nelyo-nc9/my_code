<template>
  <i class="icon iconfont icon-preview-stopall" :class="{'disable': isPollingCopy || isPlayPluginInfo.length===0}" title="关闭全部预览" @click="stopPreviewALL"></i>
</template>

<script>
export default {
  name: 'StopAll',
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
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
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
  computed: {
    isPlayPluginInfo() {
      let sourceList = this.videoStatusArr.filter(item => item.isPlay)
      return sourceList
    }
  },
  methods: {
    stopPreviewALL() {
      if (!this.isPollingCopy) {
        this.$emit('iconClick', 'stopPreviewALL')
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
