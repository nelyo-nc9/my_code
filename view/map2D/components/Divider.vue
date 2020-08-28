<!--
 * @Author: fengbeibei
 * @Date: 2020-05-21 09:08:10
 * @LastEditTime: 2020-05-21 10:06:12
 * @LastEditors: fengbeibei
 * @Description: 自定义横向分割线组件
-->
<template>
  <div class="diy-divider">
    <div v-if="left" class="hr-left" :style="leftStyle" />
    <span class="hr-title">
      <slot></slot>
    </span>
    <div class="hr-right" />
  </div>
</template>

<script>
export default {
  props: {
    left: { type: Number, default: 0 }
  },
  computed: {
    leftStyle: v => ({ width: `${v.left}px` })
  }
}
</script>

<style lang="less" scoped>
.diy-divider {
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 8px 0px;
  :not(:last-child) {
    margin-right: 8px;
  }
  .hr-title {
    background: inherit;
    /deep/ i[class^=el-icon-] {
      margin-right: 4px;
    }
  }
  .hr-left, .hr-right {
    height: 1px;
    background: #DCDFE6;
  }
  div:last-child {
    flex: auto;
  }
}

</style>
