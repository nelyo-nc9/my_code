<template>
 <div class="video-hierachy" @mousedown="clickHierachy($event)" :style="{width: width, height: height, 'z-index': zIndex}">
   <iframe ref="videoHierachyIframe" class="video-hierachy-uniqueness-dfk" :style="{width: iframeWidth, height: iframeHeight, 'z-index': zIndex, left: left, top: top  }"></iframe>
   <div ref="videoHierachyDiv" :style="{position: 'absolute',left: 0,top: 0,width: '100%',height: '100%','z-index': zIndex + 1}">
    <slot></slot>
   </div>
 </div>
</template>
<script>
export default {
  name: 'video-hierarchy',
  data() {
    return {
      width: this.hierachyWidth, // 组件宽度
      height: this.hierachyHeight // 组件高度
    }
  },
  props: {
    zIndex: {
      // iframe标签层级
      type: Number,
      default: 9
    },
    hierachyWidth: {
      type: String,
      default: '100%'
    },
    hierachyHeight: {
      type: String,
      default: '100%'
    },
    iframeWidth: {
      type: String,
      default: '100%'
    },
    iframeHeight: {
      type: String,
      default: '100%'
    },
    left: {
      type: String,
      default: '0'
    },
    top: {
      type: String,
      default: '0'
    }
  },
  methods: {
    clickHierachy() {
      let dom = window.document.querySelectorAll('.video-hierachy-uniqueness-dfk')
      dom.forEach((item, index) => {
        item.style.zIndex = this.zIndex + index
        item.style.display = 'none'
      })
      this.$refs.videoHierachyIframe.style.zIndex = this.zIndex + 2 + dom.length + 1
      this.$refs.videoHierachyIframe.style.display = 'block'
      this.$refs.videoHierachyDiv.style.zIndex = this.zIndex + 3 + dom.length + 1
    },
    sethierachySize(width, height) {
      this.width = width
      this.height = height
    }
  },
  mounted() {
    this.clickHierachy()
  }
}
</script>
<style lang="less" scoped>
  .video-hierachy {
    position: relative;
    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0px;
    }
  }
</style>
