<template>
  <div class="assistantManage">
    <div class="assistantManageMenu">
      <div class="home">
        <i class="el-icon-s-home"></i>
        <router-link to="/home">首页</router-link>
      </div>
    </div>
    <div class="assistantManage-body">
      <router-view :name="getUserData.userRole"></router-view>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
export default {
  name: 'assistantManage',
  created() {
    console.log(...mapMutations)
    // 获取账户权限，控制刷新
    if (this.$route.name === 'assistantPropress' || this.$route.name === 'startAssistant') {
      this.SET_USER_LIST_SHOW_STATUS(false)
    } else {
      this.$router.replace({name: 'assistantManageAuthority',
        params: {
          id: this.getUserData.userRole
        }})
    }
  },
  methods: {
    ...mapMutations('assistantManageMenu/user', ['SET_USER_LIST_SHOW_STATUS'])
  },
  computed: {
    ...mapGetters('assistantManageMenu/admin', ['getUserData'])
  }
}
</script>

<style scoped lang="less">
  .assistantManage{
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .assistantManageMenu{
      width: 100%;
      display: flex;
      height: 30px;
      background: rgba(45, 114, 211, 1);
      .home {
        width: 300px;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
        margin-left: 15px;
        a {
          text-decoration: none;
          color: #ffffff;
        }
      }
    };
    .assistantManage-body{
      // display: flex;
      height: calc(~"100% - 30px");
      padding: 0 20px;
      flex: auto;
    };
  }
</style>
