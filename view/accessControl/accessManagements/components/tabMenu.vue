<template>
  <div class="meunHost">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item v-for="(item, index) in tabList" :key="index">
          {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb> 
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
    tabList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      
    }
  },
  mounted() {
  },
}
</script>

<style lang="less" scope>
.meunHost{
  padding: 10px 0px;
}
</style>
