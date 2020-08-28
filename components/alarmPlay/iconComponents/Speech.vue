<template>
  <i class="icon iconfont" :class="[selectedObj.isSpeech? 'icon-shipinlei-duijiang': 'icon-shipinleiduijiangjinyong', !selectedObj.isPlay? 'disable': '']" :title="[selectedObj.isSpeech?'关闭对讲':'对讲']" @click="clickSpeech()"></i>
</template>

<script>
export default {
  name: 'Speech',
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
    clickSpeech() {
      this.$emit('iconClick', 'clickSpeech')
    }
  }
}

</script>
<style lang='less' scoped>
</style>
