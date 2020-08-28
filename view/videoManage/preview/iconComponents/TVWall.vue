<template>
   <i class="icon iconfont icon-tv-wall" :class="{'disable': !selectedObj.isPlay}" title="快速上墙" @click="toWallBtn()"></i>
</template>

<script>
export default {
  name: 'TVWall',
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
    }
  },
  methods: {
    toWallBtn() {
      this.$emit('iconClick', 'toWallBtn')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
