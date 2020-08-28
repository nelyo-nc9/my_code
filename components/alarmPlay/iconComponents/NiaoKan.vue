<!--
 * @Author: dfk
 * @Date: 2020-08-08 22:19:21
 * @LastEditTime: 2020-08-13 17:24:25
 * @LastEditors: dfk
 * @Description:
-->
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
      isSync: false
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
      this.isSync = this.isSyncF
    }
  },
  mounted() {
  },
  methods: {
    boost() {
      if (this.selectedObj.isPlay) {
        this.$emit('iconClick', 'clickLookDown')
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
