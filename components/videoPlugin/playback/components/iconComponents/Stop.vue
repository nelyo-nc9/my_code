<template>
  <i
    class="icon iconfont icon-stop"
    :class="{'disable': !selectedObj.isPlay}"
    title="停止"
    @click="stopBack"
  ></i>
</template>

<script>
export default {
  name: 'Stop',
  inheritAttrs: false,
  data() {
    return {}
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    stopBack() {
      if (this.selectedObj.isPlay) {
        this.$emit('iconClick', 'stopBack')
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
