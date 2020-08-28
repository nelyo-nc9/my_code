<template>
  <div class="dp-con" :class="[iconPosition,!selectedObj.isPlay ? 'disable' : '']" @mouseenter="(showPattern = true)" @mouseleave="showPattern = false">
    <ul v-show="showPattern&&selectedObj.isPlay">
      <i></i>
      <li v-for="(item, i) in patternList" :key='i' :class="{active: selectedObj.scale == item.label}"  @click="setScale(item)">{{item.label}}</li>
    </ul>
    <i class="icon iconfont icon-display-scale" title="画面模式"></i>
  </div>
</template>

<script>
export default {
  name: 'ViewPattern',
  inheritAttrs: false,
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
    }
  },
  data() {
    return {
      showPattern: false,
      patternList: [
        { label: '自适应', value: { w: 0, h: 0, auto: false } },
        { label: '原比例', value: { w: 1, h: 1, auto: true } }
      ]
    }
  },
  methods: {
    setScale(value) {
      this.$emit('iconClick', 'setScale', value)
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
