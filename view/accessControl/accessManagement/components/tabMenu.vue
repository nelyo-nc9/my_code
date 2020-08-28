<template>
  <div class="meunHost">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item v-for="(item, index) in tabList" :key="index">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: ['tabList'],
  data() {
    return {}
  },
  mounted() {
    // console.log('menu  组件')
    // console.log('tabMenu组件接受的Props',this.tabList)
  }
}
</script>

<style lang="less" scoped>

</style>
