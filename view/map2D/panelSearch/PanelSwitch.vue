<!--
 * @Author: fengbeibei
 * @Date: 2020-05-27 09:35:17
 * @LastEditTime: 2020-05-29 19:48:12
 * @LastEditors: fengbeibei
 * @Description: 可收缩面板控件
-->
<template>
  <div class="panel-switch">
    <div class="switch-bth" @click="handleClick">
      <i :class="isClose ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isClose: false
    }
  },
  methods: {
    handleClick() {
      this.isClose = !this.isClose
      this.$emit('change', this.isClose)
    }
  }
}
</script>

<style lang="less">
// 面板收缩开关
.panel-switch {

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
  top: 50%;
  width: 0px;
  height: 0px;
  .switch-bth {
    position: absolute;
    top: calc(50% - 31px);
    width: 36px;
    height: 62px;
    border-top: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
i{
  color: #666;
    position: absolute;
    left: -15px;
    top: 6px;
}
  }
}
</style>
