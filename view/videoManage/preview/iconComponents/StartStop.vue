<template>
   <i class="icon iconfont" :class="[selectedObj.isPlay? 'icon-preview-stop' : 'icon-preview']" :title="[selectedObj.isPlay?'关闭预览':'预览']" @click="startStopPreview"></i>
</template>

<script>
export default {
  name: 'StartStop',
  inheritAttrs: false,
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    startStopPreview() {
      this.$emit('iconClick', 'stopPreview')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
