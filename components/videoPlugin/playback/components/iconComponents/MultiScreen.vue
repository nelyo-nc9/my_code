<template>
   <div class="dp-con" :class="[iconPosition]" @mouseenter="showmodeShow=true" @mouseleave="showmodeShow=false">
    <ul v-show="showmodeShow">
      <li v-for="mode in panesArr" :key='mode.value'>
        <span @click="clickCheckedWmode(mode)" :class="{active: mode.value===checkedWmode}">{{mode.label}}</span>
      </li>
      <i class="rotate"></i>
    </ul>
    <i class="icon iconfont icon-multi-screen" title="画面分割"></i>
  </div>
</template>

<script>
export default {
  name: 'MultiScreen',
  inheritAttrs: false,
  props: {
    checkedWmode: {
      type: Number
    },
    useSubStream: {
      type: Boolean
    },
    panesArr: {
      type: Array,
      default: () => [
        { value: 1, label: '单画面' },
        { value: 4, label: '四画面' },
        { value: 9, label: '九画面' },
        { value: 16, label: '十六画面' },
      ]
    },
    iconPosition: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showSubChek: false,
      showmodeShow: false
    }
  },
  methods: {
    clickCheckedWmode(val) {
      this.$emit('iconClick', 'clickCheckedWmode', val)
    },
    setuseSubStream() {
      this.$emit('iconClik', 'setuseSubStream')
    }
  }
}
</script>

<style lang='less' scoped>
@basecolor:#1b3153;
.dp-con {
  position: relative;
  display: inline-block;
    ul {
      position: absolute;
      width: 220px;
      background-color: @basecolor;
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
            background: @basecolor;
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
