<template>
  <div>
    <!-- 区分同步异步 -->
    <!-- <i
      class="icon iconfont"
      :class="[selectedObj.showVolume&&selectedObj.isPlay? 'icon-volume': 'icon-mute', selectedObj.isPlay && !isSync? '': 'disable']"
      title="音量"
      @click="volumeSwitch"
      ></i> -->
    <!-- 不区分同步异步 -->
    <i
      class="icon iconfont"
      :class="[selectedObj.showVolume&&selectedObj.isPlay? 'icon-volume': 'icon-mute', selectedObj.isPlay ? '': 'disable']"
      title="音量"
      @click="volumeSwitch"
      ></i>
    <div
      style="width:120px;display:inline-block;vertical-align:middle;line-height:45px"
      v-if="selectedObj.showVolume"
    >
      <el-slider v-model="selectedObj.volumeValue" @change="changeVolume"></el-slider>
    </div>
  </div>
</template>

<script>
// import Slider from '../playBackPlugin/Slider'
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
      // 区分同步异步
      // if (!this.isSync && this.selectedObj.isPlay) {
      //   this.$emit('iconClick', 'volumeSwitch')
      // }
      // 不区分同步异步
      if (this.selectedObj.isPlay) {
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
</style>
