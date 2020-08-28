<template>
  <i class="icon iconfont" :class="[selectedObj.isBoost? 'icon-nk-close' : 'icon-niaokan', isPollingCopy || !selectedObj.isPlay? 'disable' : '']" :title="[selectedObj.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()"></i>
</template>

<script>
export default {
  name: 'NiaoKan',
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
    boost() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.$emit('iconClick', 'boost')
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
