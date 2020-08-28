<!--
 * @Author: your name
 * @Date: 2020-06-01 21:18:14
 * @LastEditTime: 2020-06-10 15:14:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\index.vue
-->
<template>
  <div class="duty-management">
    <div class="duty-management-menu">
      <div class="home">
        <i class="el-icon-s-home"></i>
        <router-link to="/home">首页</router-link>
      </div>
    </div>
    <div class="duty-management-body">
      <!-- <router-view :name="authority"></router-view> -->
      <admin></admin>
      <!-- <user></user> -->
    </div>
  </div>
</template>

<script>
import admin from './admin/index'
import user from './user/index'
export default {
  components: {
    admin,
    user
  },
  name: 'dutyManagement',
  data() {
    return {
      authority: 'dutyManagementAdmin'
    }
  },
  created() {
    // 获取账户权限
    this.authority = 'dutyManagementUser'
    this.$router.push({ name: this.authority })
  }
}
</script>

<style scoped lang="less">
.duty-management {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  .duty-management-menu {
    width: 100%;
    height: 35px;
    background: rgba(45, 114, 211, 1);
    .home {
      width: 300px;
      height: 35px;
      line-height: 35px;
      color: #fff;
      font-size: 14px;
      margin-left: 15px;
      a {
        text-decoration: none;
        color: #ffffff;
      }
    }
  }
  .duty-management-body {
    display: flex;
    flex: auto;
  }
}
</style>
