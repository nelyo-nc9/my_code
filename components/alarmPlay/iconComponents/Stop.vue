<!--
 * @Author: dfk
 * @Date: 2020-08-02 11:59:50
 * @LastEditTime: 2020-08-14 17:07:48
 * @LastEditors: dfk
 * @Description:
-->
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
    },
    isPreview: {
      type: Boolean,
      default: false
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
