<template>
  <div
    class="dp-con"
    @mouseenter.stop="selectedObj.isPlay ? showSpeed=true:showSpeed=false"
    @mouseleave="showSpeed=false"
  >
    <i
      class="icon iconfont"
      :class="[!selectedObj.isPlay?'disabled':'',selectedObj.pitchSpeed.icon]"
      title="播放速度"
    ></i>
    <ul v-show="showSpeed">
      <li v-for="(speed, i) in speedList" :key="i">
        <span
          @click="clickSpeed(speed)"
          :class="{active: selectedObj.pitchSpeed.icon===speed.icon}"
        >{{speed.label}}</span>
      </li>
      <i class="rotate"></i>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PlaySpeed',
  inheritAttrs: false,
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showSpeed: false,
      speedList: [
        // 新加流控协议字段 1：暂停，2：停止，3 一倍速 4 二倍速 5 四倍速 6 八倍速 7 16倍速 8 1/2倍速 9 1/4倍速  10 1/8倍速 11 1/16倍速
        { value: { nRate: 1, nScale: 16 }, label: '1/16', icon: 'icon-1-16', control: 11 },
        { value: { nRate: 1, nScale: 8 }, label: '1/8', icon: 'icon-1-8', control: 10 },
        { value: { nRate: 1, nScale: 4 }, label: '1/4', icon: 'icon-1-4', control: 9 },
        { value: { nRate: 1, nScale: 2 }, label: '1/2', icon: 'icon-1-2', control: 8 },
        { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 },
        { value: { nRate: 2, nScale: 1 }, label: '2', icon: 'icon-2', control: 4 },
        { value: { nRate: 4, nScale: 1 }, label: '4', icon: 'icon-4', control: 5 },
        { value: { nRate: 8, nScale: 1 }, label: '8', icon: 'icon-8', control: 6 },
        { value: { nRate: 16, nScale: 1 }, label: '16', icon: 'icon-16', control: 7 }
      ]
    }
  },
  methods: {
    clickSpeed(speed) {
      this.$emit('iconClick', 'clickSpeed', speed)
    }
  }
}
</script>

<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
  ul {
    z-index: 999;
    position: absolute;
    background-color: #2d72d3;
    list-style: none;
    color: snow;
    text-align: center;
    line-height: 40px;
    border-radius: 4px;
    top: 7px;
    left: 36px;
    width: 450px;
    i {
      display: block;
      position: absolute;
      background: #2d72d3;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      top: 13px;
      left: -7px;
    }
    li {
      display: inline;
      white-space: nowrap;
      line-height: 40px;
      span {
        padding: 0 8px;
      }
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
