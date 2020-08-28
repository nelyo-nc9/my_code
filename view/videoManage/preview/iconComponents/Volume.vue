<template>
<div class="icon-box" :class="[iconPosition]">
   <i class="icon iconfont" :class="[selectedObj.showVolume&&selectedObj.isPlay? 'icon-volume': 'icon-mute', isPollingCopy || !selectedObj.isPlay? 'disable': '']" title="音量" @click="volumeSwitch"></i>
   <div style="width:120px;display:inline-block;vertical-align:top;line-height:45px" v-if="selectedObj.showVolume">
      <slider color="#20a1ff" :range="true" :size="100" :minValue='0' v-model="volumeValue" @change="changeVolume"></slider>
    </div>
</div>
</template>

<script>
import Slider from '../yuntai/Slider'
export default {
  name: 'Volume',
  inheritAttrs: false,
  data() {
    return {
      volumeValue: 50,
      isPollingCopy: this.isPolling
    }
  },
  components: { Slider },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    iconPosition: {
      type: String,
      required: true
    },
    isPolling: {
      type: Boolean
    }
  },
  watch: {
    isPolling(nv) {
      this.isPollingCopy = nv
    }
  },
  methods: {
    volumeSwitch() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.$emit('iconClick', 'volumeSwitch')
        }
      }
    },
    changeVolume(val) {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.$emit('iconClick', 'changeVolume', val)
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
  .icon-box {
    position: relative;
    display: inline-block;
    i {
      padding: 0 8px;
      font-size: 20px;
    }
    .disable {
      color: #878282;
      cursor: not-allowed;
    }
    .slide {
      width: 120px;
      display: inline-block;
      vertical-align: top;
      line-height: 53px;
    }
  }
  .right {
    .slide {
      right: 30px;
    }
  }
  .left {
    .slide {
      left: 30px;
    }
  }
</style>
