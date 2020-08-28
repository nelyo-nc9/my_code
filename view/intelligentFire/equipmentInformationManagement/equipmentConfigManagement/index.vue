<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '200px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs" :style="{ width: isOpenPanel ? '200px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <!-- <dl v-for="item in tabs" :key="item.index">
          <dt v-if="!item.items" :class="{ active: componentId === item.index }" @click="changeTab(item.index)">
            {{ item.label }}
          </dt>
          <div v-else>
            <dt>{{ item.label }}</dt>
            <dd
              v-for="val in item.items"
              :key="val.index"
              :class="{ active: componentId === val.index }"
              @click="changeTab(val.index)"
            >
              {{ val.label }}
            </dd>
          </div>
        </dl> -->
        <el-menu
          :default-active="combinationName"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          @select="changeTab"
        >
          <template v-for="item in tabs">
            <el-submenu v-if="item.items" :index="item.index" :key="item.id">
              <template>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{
                  val.title
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="right-content" style="max-width:89%">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import newlyBuild from './page/newlyBuild'
import listComponent from './page/listComponent'
import loadingIn from './page/loadingIn'
import queryComponent from './page/queryComponent'
import fireLinkList from './page/fireLinkList'
import fireLinkQuery from './page/fireLinkQuery'
import policyConfig from './page/policyConfig'
import linkFirstConfig from './page/linkFirstConfig'
import linkSecendConfig from './page/linkSecendConfig'
import levelConfig from './page/levelConfig'
// import levelConfig from './page/levelConfig'
export default {
  components: {
    newlyBuild,
    listComponent,
    loadingIn,
    queryComponent,
    fireLinkList,
    fireLinkQuery,
    policyConfig,
    linkSecendConfig,
    linkFirstConfig,
    levelConfig
  },
  data() {
    return {
      combinationName: 'fireLinkList',
      tabs: [
        {
          index: 'fireLinkList',
          title: '消防系统设备关联配置',
          items: [
            // {index: 'newlyBuild', label: '新建'},
            {
              index: 'fireLinkList',
              title: '列表'
            },
            // {index: 'loadingIn', label: '导入'},
            {
              index: 'queryComponent',
              title: '查询'
            }
          ]
        },
        {
          index: 'AlarmHostRelated',
          title: '系统部件关联配置',
          items: [
            {
              index: 'listComponent',
              title: '列表'
            },
            {
              index: 'fireLinkQuery',
              title: '查询'
            }
          ]
        },
        {
          index: 'policyConfig',
          title: '消防报警策略配置'
        },
        {
          index: 'levelConfig',
          title: '消防报警等级及联动录像配置'
        },
        {
          index: 'AlarmLevel',
          title: '消防报警联动配置',
          items: [
            {
              index: 'linkFirstConfig',
              title: '一级报警'
            },
            {
              index: 'linkSecendConfig',
              title: '二级报警'
            }
          ]
        }
      ],
      isOpenPanel: true
    }
  },
  watch: {
    isNewFile: function(val) {
      this.SET_COMPONENT_ID(val)
    }
  },
  created() {
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    // this.SET_IS_NEW_FILE(this.defaultComponent.index)
    this.SET_COMPONENT_ID(this.defaultComponent.index)
    this.combinationName = this.defaultComponent.index
    // console.log(this.newMenu, this.defaultComponent.index, this.componentId)
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapState('equipmentManagement', {
      componentId: 'componentId',
      isNewFile: 'isNewFile'
    })
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    changeTab(index) {
      this.SET_IS_NEW_FILE(index)
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-main {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  .left-tabs {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
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
    .menu-content {
      height: 100%;
      font-size: 14px;
      .el-menu {
        height: 100%;
        .el-menu-item {
          max-width: 200px;
        }
      }
      dt {
        background: #f2f2f2;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background: #dff5fc;
        }
      }
      dd {
        background: #f8f8f8;
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        margin-inline-start: 0px;
        border-top: 1px solid #ffffff;
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
      .active {
        color: #538bda;
        border-left: 2px solid #2d72d3;
      }
    }
  }
  .right-content {
    flex: 1;
    height: 100%;
    background: #fff;
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 6px;
    }
  }
  .el-menu {
    background-color: #eee;
  }
}
</style>
