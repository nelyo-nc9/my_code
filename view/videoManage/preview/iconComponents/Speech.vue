<template>
  <i class="icon iconfont" :class="[selectedObj.isSpeech? 'icon-shipinlei-duijiang': 'icon-shipinleiduijiangjinyong', isPollingCopy || !selectedObj.isPlay? 'disable': '']" :title="[selectedObj.isSpeech?'关闭对讲':'对讲']" @click="clickSpeech()"></i>
</template>

<script>
export default {
  name: 'Speech',
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
    clickSpeech() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
           this.$emit('iconClick', 'clickSpeech')
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
