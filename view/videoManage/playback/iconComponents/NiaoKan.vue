<template>
  <!-- 区分同步异步 -->
  <!-- <i
    class="icon iconfont"
    :class="[selectedObj.lookDown? 'icon-niaokan' : 'icon-nk-close', selectedObj.isPlay && !isSync? '' : 'disable']"
    :title="[selectedObj.lookDown?'关闭鸟瞰':'开启鸟瞰']"
    @click="boost()"
  ></i> -->
  <!-- 不区分同步异步 -->
  <i
    class="icon iconfont"
    :class="[selectedObj.lookDown? 'icon-niaokan' : 'icon-nk-close', selectedObj.isPlay ? '' : 'disable']"
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
      // 判断是同步还是异步 同步true 异步false
      this.isSync = this.isSyncF
    }
  },
  mounted() {
  },
  methods: {
    boost() {
      // 区分同步异步
      // if (this.selectedObj.isPlay && !this.isSync) {
      //   this.$emit('iconClick', 'clickLookDown')
      // }
      // 不区分同步异步
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
