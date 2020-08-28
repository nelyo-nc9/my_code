<template>
  <i class="icon iconfont icon-yuntai" :class="{'disable': (!selectedObj.isPlay || (selectedObj.source && selectedObj.source.monitortype < 3))}" title="云台" @click="PTZClick()"></i>
</template>

<script>
export default {
  name: 'YunTai',
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
    }
  },
  methods: {
    PTZClick() {
      this.$emit('iconClick', 'PTZClick')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
