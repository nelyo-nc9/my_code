<template>
  <div class="switch" :style="{height: `${height}px`,opacity: disabledToggle?1:0.6}">
    <div ref="core" class="item" :style="{width: `${coreWidth}px` }" :class="[switchStatus ? 'active' : 'inactive']" @click.prevent="changeSwitch">
      <span class="text inactiveItem">{{inactiveText}}</span>
      <span class="switchBtn" @click.stop="changeSwitch"></span>
      <span class="text activeItem">{{activeText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'switchBox',
  props: {
    disabledToggle:{
      type:Boolean,
      default:true
    },
    // switch 整体高度
    height: {
      type: [String, Number],
      default: '30'
    },
    // switch 整体宽度
    width: {
      type: [String, Number],
      default: ''
    },
    // 打开时所显示的文字信息
    activeText: {
      type: String,
      default: ''
    },
    // 关闭时所显示的文字信息
    inactiveText: {
      type: String,
      default: ''
    },
    // 打开时所显示的颜色
    activeColor: {
      type: String,
      default: ''
    },
    // 关闭时所显示的颜色
    inactiveColor: {
      type: String,
      default: ''
    },
    // 初始参数
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    // switch 打开时的参数
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    // switch 关闭时的参数
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  data() {
    return {
      switchStatus: false,
      coreWidth: ''
    }
  },
  mounted() {
    this.switchStatus = this.value === this.activeValue
    this.coreWidth = this.width || 168
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
  },
  methods: {
    changeSwitch() {
      if(!this.disabledToggle){
        return;
      }
      this.switchStatus = !this.switchStatus
      this.$emit('change', this.switchStatus ? this.activeValue : this.inactiveValue)
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
    },
    setBackgroundColor() {
      let newColor = this.switchStatus ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    }
  }
}
</script>

<style lang="less" scoped>
.switch {
  width: 100%;
  // height: 30px;
  .item {
    width: 60%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    border-radius: 8px;
    transition: all 0.3s linear 0s;
    span {
      transition: all 0.3s linear 0s;
      display: inline-block;
      height: 100%;
      position: absolute;
      user-select: none;
    }
    .switchBtn {
      cursor: pointer;
      width: 50px;
      margin: 3px;
      height: calc(~'100% - 6px');
      background-color: white;
      border-radius: 6px;
      z-index: 1;
    }
    .text {
      line-height: 30px;
      overflow: hidden;
      margin: 0 14px;
      width: auto;
    }
    .activeItem {
      right: 0;
    }
    .inactiveItem {
      left: 0;
    }
    &.active {
      background-color: #409eff;
      border-color: #409eff;
      .switchBtn {
        left: 0;
      }
      .inactiveItem {
        width: 0;
      }
    }
    &.inactive {
      background-color: #c0ccda;
      border-color: #c0ccda;
      .switchBtn {
        left: calc(~'100% - 56px');
      }
      .activeItem {
        width: 0;
      }
    }
  }
}
</style>
