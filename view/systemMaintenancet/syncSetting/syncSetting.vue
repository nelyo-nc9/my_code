<template>
  <div class="sync-manage-box">
    <!-- 左侧导航 -->
    <div class="menu-left" :style="{width: isOpenMenu ? '240px' : '28px'}">
      <div class="arrow">
        <i
          :class="isOpenMenu ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
          @click="toggleMenu"
        ></i>
      </div>
      <div v-show="isOpenMenu">
        <el-menu
          :default-active="currentView"
          class="el-menu-vertical-demo"
          :unique-opened="false"
          @select="changeTab"
        >
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="val in item.items">
                  <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
                  <el-submenu v-else :key="val.index" :index="val.index">
                    <template>
                      <span slot="title">{{val.title}}</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                        v-for="v in val.items"
                        :key="v.index"
                        :index="v.index"
                      >{{v.title}}</el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
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
import SyncSetting from './pages/SyncSetting'
import SyncLog from './pages/SyncLog'

export default {
  name: 'syncSetting',
  components: {
    SyncSetting,
    SyncLog
  },
  data() {
    return {
      isOpenMenu: true, // 左侧导航是否显示
      menus: [
        {
          index: 'syncManage',
          label: '同步管理',
          items: [
            {
              index: 'SyncSetting',
              title: '同步设置'
            },
            {
              index: 'SyncLog',
              title: '同步日志'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState({
      currentView: ({ syncSetting }) => syncSetting.currentView,
      currentTitle: ({ syncSetting }) => syncSetting.currentTitle
    })
  },
  created() {
    console.log(this)
  },
  methods: {
    ...mapActions('syncSetting', ['setState']),
    ...mapMutations('syncSetting', ['SET_STATE']),
    changeTab(index, payload) {
      let { menus } = this
      let obj = menus[0].items.filter(item => item.index === payload[1])[0]
      this.setState({ type: 'SET_STATE', key: 'currentView', value: index })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: obj.title })
    },
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu
    }
  }
}
</script>

<style lang="less" scoped>
.sync-manage-box {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    width: 240px;
    height: 100%;
    padding: 5px 10px;
    .arrow {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    /deep/ .el-menu {
      border-right: none;
      background-color: transparent;
    }
    /deep/ .el-submenu {
      .el-menu-item {
        min-width: 170px;
      }
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .content-right {
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
  }
}
</style>
