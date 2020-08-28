
<template>
  <!-- 服务器监控 -->
  
  <div class="serverMonitoring-container">
    <!-- 面包屑导航 -->
    <div class="location">
      <!-- 定位图标 -->
      <div class="location-icon float-left">
        <span class="el-icon-location-outline"></span>
      </div>
      <div class="crumbs-container float-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
          <el-breadcrumb-item>系统状态监控</el-breadcrumb-item>
          <el-breadcrumb-item>{{ componentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="serverMonitoring-content">
      <!-- 动态组件 -->
      <component :is="componentId" @changeComponent="changeComponent" :componentTitle="componentTitle" :ipAddr="ipAddr"></component>
    </div>
      
  </div>

</template>

<script>

import Index from './pages/index.vue'  // 服务监控首页
import ServerInfo from  './pages/ServerInfo.vue'  // 服务器运行状态详情
import ThresholdConfig from  './pages/ThresholdConfig.vue'  // 异常阈值设置

export default {
  data(){
    return {
      componentId:'Index',
      componentTitle:'服务器监控',
      ipAddr:'', // 服务器地址
    }
  },
  components:{
    Index,ServerInfo,ThresholdConfig
  },
  computed:{},
  methods:{

    changeComponent(index, title, ipAddr) {
      this.componentId = index;
      this.componentTitle = title;
      this.ipAddr = ipAddr;
    },
    // defaultComponent() {
    //   this.componentId = this.defaultMenu
    // },
  },
  
  created(){
    
  },
  mounted(){},
  destroyed(){},
}
</script>

<style lang="less" scoped>
  .serverMonitoring-container{
    padding: 10px 15px;
  }

  .location{
    overflow: hidden;
  }
  .location-icon{
    font-size: 18px;
  }
  .crumbs-container{
    margin-top: 4px;
  }

  .serverMonitoring-content{
    padding: 0px 30px;
  }

  .float-left{
    float: left;
  }
 

</style>
