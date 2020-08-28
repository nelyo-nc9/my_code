<template>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;" size="mini">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>-->
        <div class="assistant-event">协查事件</div>
        <el-menu :default-active="active" @select="handleSelect">
          <el-menu-item index="list">
            <!-- 图标 -->
            <span slot="title">列表</span>
          </el-menu-item>
          <el-menu-item index="search">
            <!-- 图标 -->
            <span slot="title">查询</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view @cancel="handleSelect"></router-view>
      </el-main>
    </el-container>
</template>

<script>
export default {
  name: 'search',
  data() {
    return {
      isCollapse: false,
      active: 'list', // 默认选中列表
    }
  },
  watch: {
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ path: key })
      this.active = key
    }
  },
  created() {
    // 初始化页面默认将列表页面展示给
    this.$router.push({ name: 'list' })
  }
}
</script>

<style lang="less" scoped>
.el-container{
  height: 100%;
  .el-main{
    height: 100%;
    padding: 15px 15px 0px;
  }
}
.aside {
  padding: 15px 0 0 20px;
  /deep/ .is-active {
    border-left: 2px solid rgb(45, 114, 211);
  }
}
.assistant-event {
  background-color: rgba(242, 242, 242, 242);
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 20px;
}
</style>
