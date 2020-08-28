<template>
  <i
    class="icon iconfont icon-stop"
    title="停止"
    :class="{'disable': !selectedObj.playStatus}"
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
      if (this.selectedObj.playStatus) {
        this.$emit('iconClick', 'stopBack')
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
