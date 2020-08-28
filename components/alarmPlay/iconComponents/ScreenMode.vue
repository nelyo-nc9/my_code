<template>
   <div class="dp-con" :class="[iconPosition]" @mouseenter="selectedObj.isPlay ? showmodeShow=true:''" @mouseleave="showmodeShow=false">
    <ul v-show="showmodeShow" style="z-index: 1;">
      <li v-for="mode in modeArr" :key='mode.value'>
        <span @click="clickCheck(mode)" :class="{active: mode.value===checkedScreenMode}">{{mode.label}}</span>
      </li>
      <i class="rotate"></i>
    </ul>
    <i class="icon iconfont icon-display-scale" :class="{'disable' :!selectedObj.isPlay}" title="画面模式"></i>
  </div>
</template>

<script>
export default {
  name: 'ScreenMode',
  inheritAttrs: false,
  props: {
    useSubStream: {
      type: Boolean
    },
    modeArr: {
      type: Array,
      default: () => [
        { value: 1, label: '原比例' },
        { value: 2, label: '自适应' }
      ]
    },
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    iconPosition: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showmodeShow: false,
      checkedScreenMode: 2
    }
  },
  methods: {
    clickCheck(val) {
      this.checkedScreenMode = val.value
      this.$emit('iconClick', 'clickScreenMode', val)
    }
  }
}
</script>

<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
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
    ul {
      position: absolute;
      width: 120px;
      background-color: #2d72d3;
      list-style: none;
      color: snow;
      text-align: center;
      line-height: 40px;
      padding: 0 6px;
      border-radius: 4px;
      top: 7px;
       i {
            display: block;
            position: absolute;
            background: #2d72d3;
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
</style>
