<template>
    <div ref="closeArea" class="closeArea" @click="closeBack" @mouseenter="changeOver" @mouseleave="changeOver">
        <div class="closeWrapper" title="关闭" v-if="isOver" >
            <span class="cross"></span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SuspenClose',
  inheritAttrs: true,
  data() {
    return {
      isOver: false // 鼠标移入
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    closeBack() {
      if (this.isOver) {
        this.$emit('iconClose', 'stopBack')
      }
    },
    changeOver() {
      this.isOver = !this.isOver
      // console.log(this.isOver, "====this.isOver")
    }
  }
}
</script>
<style lang='less' scoped>
.closeArea{
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    top:0;
    background: transparent;
    font-size:0;
    cursor: pointer;
}
.closeWrapper{
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.945);
    border-radius: 50%;
    position: absolute;
    left:0;
    bottom:0;
    .cross {
        position: absolute;
        right: 0;
        top: 0px;
        width: 20px;
        height: 20px;
    }
    .cross:before, .cross:after {
        position: absolute;
        left: 10px;
        bottom: 2px;
        content: ' ';
        height: 20px;
        width: 2px;
        background-color: rgba(255, 255, 255, 0.945);
    }
    .cross:before {
        transform: rotate(45deg);
    }
    .cross:after {
        transform: rotate(-45deg);
    }

}
</style>
