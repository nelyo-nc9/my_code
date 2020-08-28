<template>
  <!-- <i class="icon iconfont icon-stop-all" :class="{'disable': isPlayPluginInfo.length===0}" title="关闭全部" @click="stopALL"></i> -->
  <!-- :class="{'disable': !selectedObj.playStatus }" -->
  <i class="icon iconfont icon-stop-all"  title="关闭全部" @click="stopALL"></i>

</template>

<script>
export default {
  name: 'StopAll',
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
    },
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    isPlayPluginInfo() {
      let sourceList = this.videoStatusArr.filter(item => item.isPlay)
      return sourceList
    }
  },
  methods: {
    stopALL() {
      this.$emit('iconClick', 'stopBackALL')
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
