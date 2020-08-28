<!--
 * @Author: your name
 * @Date: 2020-06-12 09:51:38
 * @LastEditTime: 2020-06-12 17:51:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\timeTemplate.vue
-->
<template>
<!-- 时间模板 -->
  <div class="time-template-box">
    <div class="content-right">
      <div class="location">
        <span class="el-icon-location-outline" style="float:left;font-size:16px;"></span>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left;">
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>计划模板管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <Plan @showList="showList" v-if="!isShowList"></Plan>
      <TimeTemplateList @showList="showList"  v-if="isShowList"></TimeTemplateList>
    </div>
  </div>
</template>

<script>
import Plan from './plan/plan'
import TimeTemplateList from './pages/TimeTemplateList'
export default {
  name: 'timeTemplate',
  components: {
    Plan,
    TimeTemplateList
  },
  data() {
    return {
      isShowList: false
    }
  },
  created() {
  },
  methods: {
    showList(val) {
      this.isShowList = val
    }
  }
}
</script>

<style lang="less" scoped>
.time-template-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 30px;
  display: flex;
  justify-content: flex-start;
  .content-right {
    height: 100%;
    width: 100%;
    padding: 5px 0;
  }
}
</style>
