<template>
  <div class="dp-con" :class="[iconPosition]">
    <ul v-show="shearDownload">
      <li v-for="mode in cutArr" :key="mode.value">
        <span @click="cutDown(mode)" :class="{active: mode.value===cutValue}">{{mode.label}}</span>
      </li>
      <i class="rotate"></i>
    </ul>
    <i
      class="icon iconfont icon-jianqiexiazai"
      :class="[selectedObj.isPlay && !isSync ? '':'disable']"
      @click="cutDownload"
      title="剪切"
    ></i>
  </div>
</template>

<script>
export default {
  name: 'CutDownload',
  props: {
    selectedObj: {
      type: Object
    },
    cutArr: {
      type: Array,
      default: () => [
        { value: 1, label: '确认' },
        { value: 2, label: '放弃' }
      ]
    },
    iconPosition: {
      type: String,
      required: true
    },
    shearDownload: {
      type: Boolean,
      default: false
    },
    isSyncF: {
      type: Boolean
    }
  },
  watch: {
    isSyncF() {
      this.isSync = this.isSyncF
    }
  },
  data() {
    return {
      cutValue: 1,
      isSync: false
    }
  },
  methods: {
    cutDownload() {
      if (this.selectedObj.isPlay && !this.isSync) {
        this.$emit('iconClick', 'cutDownload')
      }
    },
    cutDown(obj) {
      this.cutValue = obj.value
      if (obj.value === 1) {
        this.$emit('iconClick', 'cutDownloadSave')
      } else {
        this.$emit('iconClick', 'cutDownloadCancel')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.dp-con {
  position: relative;
  display: inline-block;
  padding: 0 8px;
  i {
    cursor: pointer;
    font-size: 20px;
  }
  .disable {
    cursor: not-allowed;
    color: #ccc;
  }
  ul {
    width: 100px;
    position: absolute;
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
