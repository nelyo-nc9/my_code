<template>
<!-- :class="{'disable': !selectedObj.isPlay}" 倒放功能没有-->
  <i
    class="icon iconfont icon-play disable"
    title="倒放"
    @click="Rewind"
  ></i>
</template>

<script>
export default {
  name: 'Rewind',
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
    Rewind() {
      console.log('Rewind')
    }
  }
}
</script>
<style lang='less' scoped>
.icon {
  display: inline-block;
  line-height: 55px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  padding: 0 8px;
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
</style>
