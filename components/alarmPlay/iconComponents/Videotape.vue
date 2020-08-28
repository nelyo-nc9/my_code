<template>
  <i class="realbtn iconfont" :class="[selectedObj.isCentreRecording? 'icon-recplayback' : 'icon-videotape-stop', !selectedObj.isPlay ? 'disable': '']" @click="openRecording" :title="selectedObj.isCentreRecording ? '关闭紧急录像' : '紧急录像'"></i>
</template>

<script>
export default {
  name: 'VideoTape',
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
    openRecording() {
      this.$emit('iconClick', 'openRecording')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
