<template>
  <div class="icon-box">
    <i class="realbtn iconfont icon-collection" :class="{'disable' : isPollingCopy || !selectedObj.isPlay}" @click="quickCollection" title="组合收藏"></i>
    <fastCollect v-if="openselectFav" :videoStatusArr="videoStatusArr" :isNeedModal="isNeedModal" :openselectFav="openselectFav" @cancel="openselectFav = false"></fastCollect>
  </div>
</template>

<script>
import fastCollect from './fastCollect'
export default {
  name: 'Collect',
  inheritAttrs: false,
  components: {
    fastCollect
  },
  data() {
    return {
      openselectFav: false,
      isPollingCopy: this.isPolling
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    videoStatusArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    isPolling: {
      type: Boolean
    },
    isNeedModal: {
      type: Boolean
    }
  },
  watch: {
    isPolling(nv) {
      this.isPollingCopy = nv
    }
  },
  methods: {
    quickCollection() {
      if (!this.isPollingCopy) {
        if (this.selectedObj.isPlay) {
          this.openselectFav = true
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
  }
</style>
