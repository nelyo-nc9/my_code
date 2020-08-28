<template>
  <div class="dp-con" :class="[iconPosition]" @mouseenter="showmodeShow=true" @mouseleave="showmodeShow=false">
    <i class="icon iconfont icon-multi-screen" title="画面分割"></i>
    <iframe v-if="showmodeShow"></iframe>
    <ul v-show="showmodeShow">
      <li v-for="mode in panesArr" :key='mode.value'>
        <span @click="clickCheckedWmode(mode)" :class="{active: mode.value===checkedWmode}">{{mode.label}}</span>
      </li>
      <li style="padding: 0px;border-right:none">
        <el-checkbox class="sub-stream-check" v-model="flag" @change="setuseSubStream">9画面(含)以上按子码流预览</el-checkbox>
      </li>
      <i></i>
    </ul>
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
        { value: 4, label: '4画面' },
        { value: 6, label: '6画面' },
        { value: 8, label: '8画面' },
        { value: 9, label: '9画面' },
        { value: 10, label: '10画面' },
        { value: 13, label: '13画面' },
        { value: 14, label: '14画面' },
        { value: 16, label: '16画面' },
        { value: 17, label: '17画面' },
        { value: 22, label: '22画面' },
        { value: 25, label: '25画面' }
      ]
    },
    iconPosition: {
      type: String,
      required: true
    },
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showmodeShow: false,
      flag: true
    }
  },
  mounted() {
    this.flag = this.useSubStream || true
  },
  methods: {
    clickCheckedWmode(val) {
      this.$emit('iconClick', 'clickCheckedWmode', val)
    },
    setuseSubStream() {
      this.$emit('iconClick', 'setuseSubStream', this.flag)
    }
  }
}
</script>

<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
  iframe {
    position: absolute;
    width: 250px;
    bottom: 60px;
    left: -177px;
    z-index: 1;
    height: 160px;
  }
  ul {
    position: absolute;
    width: 250px;
    bottom: 60px;
    left: -177px;
    z-index: 10;
    background-color: #335589;
    list-style: none;
    color: snow;
    text-align: center;
    padding: 0 6px;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    i {
      display: block;
      position: absolute;
      background: #335589;
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      bottom: -7px;
      left: 188px;
    }
    li {
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      height: 40px;
      line-height: 40px;
      padding: 0 8px;
      .sub-stream-check {
        color: snow;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        /deep/ .el-checkbox__input + .el-checkbox__label, .el-checkbox__input.is-checked + .el-checkbox__label {
          color: snow
        }
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
    right: 30px;
    i {
      right: -7px;
    }
  }
}
.left {
  ul {
    left: 30px;
    i {
      left: -7px;
    }
  }
}
</style>
