<template>
   <i class="icon iconfont icon-view-quick" title="录像回放" @click="changeToBack"></i>
</template>

<script>
export default {
  name: 'VideoBack',
  inheritAttrs: false,
  data() {
    return {
    }
  },
  methods: {
    changeToBack() {
      this.$emit('iconClick', 'changeToBack')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
