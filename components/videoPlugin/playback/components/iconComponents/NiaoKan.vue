<template>
  <i
    class="icon iconfont"
    :class="[selectedObj.lookDown? 'icon-niaokan' : 'icon-nk-close', selectedObj.isPlay && !isSync? '' : 'disable']"
    :title="[selectedObj.lookDown?'关闭鸟瞰':'开启鸟瞰']"
    @click="boost()"
  ></i>
</template>

<script>
export default {
  name: 'NiaoKan',
  inheritAttrs: false,
  data() {
    return {
    isSync:false
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSyncF: {
      type: Boolean
    }
  },
  watch: {
    isSyncF() {
      this.isSync =this.isSyncF
    }
  },
  mounted() {
  },
  methods: {
    boost() {
      if (this.selectedObj.isPlay && !this.isSync) {
        this.$emit('iconClick', 'clickLookDown')
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>
