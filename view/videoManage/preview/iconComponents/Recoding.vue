<template>
  <div class="dp-con left" @mouseenter="showVideotape = true" @mouseleave="showVideotape = false">
    <i class="icon iconfont icon-recplayback" :class="{'disable': !selectedObj.isPlay}" title="录像" ></i>
    <ul v-show="showVideotape && selectedObj.isPlay">
      <i></i>
      <li v-for="(item, i) in videotapeList" @click="openRecording(item)" :key="i">{{item.label}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Recoding',
  inheritAttrs: false,
  data() {
    return {
      showVideotape: false
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
  computed: {
    videotapeList() {
      return [
        { value: '本地录像', label: this.localPlayer },
        { value: '中心录像', label: this.centrePlayer }
      ]
    },
    localPlayer() {
      return this.selectedObj.isRecording ? '关闭本地录像' : '本地录像'
    },
    centrePlayer() {
      return this.selectedObj.isCentreRecording ? '关闭中心录像' : '中心录像'
    }
  },
  methods: {
    openRecording(val) {
      this.$emit('iconClick', 'openRecording', val)
    }
  }
}

</script>
<style lang='less' scoped>
</style>
