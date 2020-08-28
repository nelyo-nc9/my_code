<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator="separator" :separator-class="separatorClass">
      <span class="iconfont" :class="icon"></span>
      <el-breadcrumb-item v-for="(e, i) of breadcrumbItem" :key="i">{{e}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
/**
 * 面包屑组件
 * 支持分隔符、内容、图标自定义
 */
export default {
  name: 'breadcrumb',
  props: {
    // 字符串式分隔符
    separator: {
      type: String,
      default: ''
    },
    // class式分隔符
    separatorClass: {
      type: String,
      default: 'el-icon-arrow-right'
    },
    // 面包屑项
    breadcrumbItem: {
      type: Array,
      default: () => []
    },
    // 图标
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.breadcrumb {
  margin: 10px;
  height: 16px;
  .iconfont {
    float: left;
    margin-right: 5px;
  }
}
</style>
