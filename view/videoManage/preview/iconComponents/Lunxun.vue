<template>
  <i class="icon iconfont-ccb" :class="[isPolling? 'ccblunxunzhong' : 'ccbweilunxun', isActiveEqu || isPolling? '' : 'disable']" :title="[isPolling?'关闭轮巡':'开启轮巡']" @click="polling()"></i>
</template>

<script>
export default {
  name: 'Lunxun',
  inheritAttrs: false,
  props: {
    isActiveEqu: {
      type: Boolean
    },
    isPolling: {
      type: Boolean
    }
  },
  methods: {
    polling() {
      if (this.isActiveEqu || this.isPolling) {
        this.$emit('iconClick', 'polling', !this.isPolling)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
