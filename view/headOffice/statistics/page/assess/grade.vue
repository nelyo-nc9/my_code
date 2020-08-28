<!--  -->
<template>
  <div class="content">
     <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>总行本级安全管理</el-breadcrumb-item>
            <el-breadcrumb-item>统计分析</el-breadcrumb-item>
            <el-breadcrumb-item>考核统计</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.topTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
   </div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  data() {
    return {
      topTitle:'考核项目评分统计'
    }
  },
  methods: {
    
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
  .content{
    width: 100%;
    height: 100%;
    padding:12px;
  }
</style>