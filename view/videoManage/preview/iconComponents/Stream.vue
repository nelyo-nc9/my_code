<template>
  <div class="dp-con" :class="[iconPosition,isPollingCopy || !selectedObj.isPlay ? 'disable' : '']" @mouseenter="showSetStream=true" @mouseleave="showSetStream=false">
    <ul v-show="showSetStream && selectedObj.isPlay">
      <i></i>
      <li v-for="mode in streamArr" :key='mode.value' @click="changeStream(mode.value)" :class="{active: mode.value===(selectedObj.source && selectedObj.source.streamType)}">{{mode.label}}</li>
    </ul>
    <i class="icon iconfont icon-stream-set" title="码流切换"></i>
  </div>
</template>

<script>
export default {
  name: 'Stream',
  inheritAttrs: false,
  data() {
    return {
      showSetStream: false,
      streamArr: [
        { value: "main", label: '主码流' },
        { value: "sub1", label: '子码流' },
        { value: "sub2", label: '第三码流' }
      ],
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
    changeStream(val) {
      this.$emit('iconClick', 'changeStream', val)
    }
  }
}

</script>
<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
  ul {
    position: absolute;
    background-color: #335589;
    list-style: none;
    color: snow;
    text-align: center;
    line-height: 40px;
    padding: 0 6px;
    border-radius: 4px;
    top: 7px;
    display: flex;
    z-index: 10;
    i {
      display: block;
      position: absolute;
      background: #335589;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      top: 13px;
    }
    li {
      display: inline;
      white-space: nowrap;
      line-height: 40px;
      padding: 0 8px;
      border-right: 1px solid hsla(0, 0%, 100%, 0.1);
      cursor: pointer;
      .sub-stream-check {
        position: absolute;
        left: -100px;
        width: 100px;
        height: 40px;
        line-height: 40px;
      }
    }
    .active {
      color: #fda54b;
    }
  }
  i {
    padding: 0 8px;
    font-size: 20px;
  }
}
.right {
  ul {
    right: 38px;
    i {
      right: -7px;
    }
  }
}
.left {
  ul {
    left: 38px;
    i {
      left: -7px;
    }
  }
}
/deep/.el-input__inner {
  overflow: hidden;
  text-overflow: ellipsis;
  
}
</style>
