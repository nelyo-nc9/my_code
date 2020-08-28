<template>
  <i
    class="icon iconfont"
    :class="[iconPlay , (selectedObj.playStatus)? '' : 'disabled']"
    :title="[selectedObj.isPlay? '暂停': '播放']"
    @click="playStop"
  ></i>
</template>

<script>
export default {
  name: 'Play',
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
    checkedWmode: {
      type: Number
    },
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    iconPlay: {
      type: String
    }
  },
  computed: {
  },
  methods: {
    playStop() {
      this.$emit('iconClick', 'playStop')
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
