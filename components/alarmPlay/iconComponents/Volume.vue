<!--
 * @Author: dfk
 * @Date: 2020-08-08 22:19:21
 * @LastEditTime: 2020-08-22 19:02:18
 * @LastEditors: zhangcg
 * @Description:
-->
<template>
  <div>
    <i
      class="icon iconfont"
      :class="[selectedObj.showVolume&&selectedObj.isPlay? 'icon-volume': 'icon-mute', selectedObj.isPlay && !isSync? '': 'disable']"
      title="音量调节"
      @click="volumeSwitch"
      ></i>
    <div
      v-if="selectedObj.showVolume"
      class="div-slider"
    >
      <el-slider v-model="selectedObj.volumeValue" @change="changeVolume"></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Volume',
  inheritAttrs: false,
  data() {
    return {
      isSync: false
    }
  },
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
  },
  // components: { Slider },
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
  methods: {
    volumeSwitch() {
      if (!this.isSync && this.selectedObj.isPlay) {
        this.$emit('iconClick', 'volumeSwitch')
      }
    },
    changeVolume(v) {
      this.$emit('iconClick', 'changeVolume', v)
    }
  }
}
</script>
<style lang='less' scoped>
.el-slider__runway {
  margin: 25px 0;
}
.icon {
  padding: 0 8px;
  cursor: pointer;
  font-size: 20px;
  color: #333333;
}
.disable {
  cursor: not-allowed;
  color: #ccc;
}
.div-slider {
  width:94px;
  position: absolute;
  left: 40px;
  top: 8px;
}
</style>
