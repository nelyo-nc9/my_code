<template>
  <i class="icon iconfont" :class="[selectedObj.fullScreen&&selectedObj.isPlay? 'icon-exit-full-screen': 'icon-full-screen']" :title="[selectedObj.fullScreen?'退出全屏':'全屏']" @click="fullScreen"></i>
</template>

<script>
export default {
  name: 'FullScreen',
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
    fullScreen() {
      this.$emit('iconClick', 'fullScreen')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
