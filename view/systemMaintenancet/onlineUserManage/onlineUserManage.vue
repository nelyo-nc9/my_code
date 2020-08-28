<template>
  <div class="onlineUser-manage-box">
    <!-- 左侧导航 -->
    <div class="menu-content-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <el-menu :default-active="currentView" class="el-menu-vertical-demo" :unique-opened="false" @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
      </el-menu>
    </div>
    <div @click="isOpenMenu = !isOpenMenu" class="isShow" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 动态组件 -->
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import OnlineUserManageList from './pages/OnlineUserManageList'
import OnlineUserManageSearch from './pages/OnlineUserManageSearch'

export default {
  name: 'OnlineUserManage',
  components: {
    OnlineUserManageList,
    OnlineUserManageSearch
  },
  data() {
    return {
      isOpenMenu: true, // 左侧导航是否显示
      menus: [
        {
          index: 'OnlineUserManage',
          title: '在线用户管理',
          items: [
            {
              index: 'OnlineUserManageList',
              title: '列表'
            },
            {
              index: 'OnlineUserManageSearch',
              title: '查询'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapState({
      currentView: ({ onlineUserManage }) => onlineUserManage.currentView,
      currentTitle: ({ onlineUserManage }) => onlineUserManage.currentTitle
    })
  },
  created() {
    // 初始化tab列表
    this.setMenu(this.menus)
    console.log(this.newMenu)
    this.menus = this.newMenu
    this.setState({ type: 'SET_STATE', key: 'currentView', value: this.defaultComponent.index })
    this.setState({ type: 'SET_STATE', key: 'currentTitle', value: this.defaultComponent.title })
  },
  methods: {
    ...mapActions('onlineUserManage', ['setState']),
    ...mapMutations('onlineUserManage', ['SET_STATE']),
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index, payload) {
      this.changIndex(index)
      let { menus } = this
      let obj = menus[0].items.filter(item => item.index === payload[1])[0]
      this.setState({ type: 'SET_STATE', key: 'currentView', value: index })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: obj.title })
    }
  }
}
</script>

<style lang="less" scoped>
.onlineUser-manage-box {
  width: 100%;
  height: 100%;
  padding: 5px 0px;
  box-shadow:inset 0 0 10px 3px #ececec;
  display: flex;
  justify-content: flex-start;
  position: relative;
  .menu-content-left {
    flex-shrink: 0;
    height: 100%;
    padding: 5px 0px;
    background: #F5F5F5;
    .el-menu-vertical-demo {
      width: 200px;
    }
    /deep/ .el-menu {
      border-right: none;
      background-color: transparent;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 15px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 18px solid #E6E6E6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 9.5px;
    }
  }
  .content-right {
    flex: 1;
    // min-width: 1440px;
    overflow: hidden;
    height: 100%;padding: 10px 20px 20px 20px;
    box-shadow:inset 0 0 10px 1px #ececec;
  }
}
</style>
