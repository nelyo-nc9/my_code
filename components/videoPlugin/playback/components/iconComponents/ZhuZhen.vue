<template>
  <i class="icon iconfont icon-frame-forward" :class="{'disable': !selectedObj.playStatus}" title="逐帧进" @click="clickByFrame"></i>
</template>

<script>
export default {
  name: 'ZhuZhen',
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
  computed: {},
  methods: {
    clickByFrame() {
      this.$emit('iconClick', 'clickByFrame')
    }
  }
}
</script>
<style lang='less' scoped>
</style>
