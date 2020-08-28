<!--
 * @Author: zhangteng
 * @Date: 2020-05-28 14:38:49
 * @LastEditors: zhangteng
 * @LastEditTime: 2020-05-28 16:37:45
 * @Description: file content
 * @FilePath: \建行CCB\ccb-client\client\src\view\videoManage\videoLog\index.vue
-->
<template>
  <div class="log-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="事件日志" name="first">
          <EventLog></EventLog>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <Content></Content>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Content from './Content'
import EventLog from './eventLog'
export default {
  name: 'VideoLog',
  components: {
    Content,
    EventLog
  },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style lang="less" scoped>
.log-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  .header {
    margin-bottom: 10px;
  }
  .main {
    flex: 1;width: 100%;overflow: hidden;
    /deep/ .el-tabs {height: 100%;
      /deep/ .el-tabs__content{
        width: 100%;height: calc(~'100% - 63px');
        /deep/ .el-tab-pane{
          width: 100%;height: 100%;overflow: auto;
        }
      }
    }
  }
}
</style>
