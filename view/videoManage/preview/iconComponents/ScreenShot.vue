<template>
  <i class="icon iconfont icon-screenshot" :class="{'disable': !selectedObj.isPlay}" title="抓图" @click="getCapture"></i>
</template>

<script>
export default {
  name: 'ScreenShot',
  inheritAttrs: false,
  data() {
    return {
    }
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
    getCapture() {
      this.$emit('iconClick', 'getCapture')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
