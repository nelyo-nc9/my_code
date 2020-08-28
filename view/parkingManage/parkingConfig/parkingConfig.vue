
<template>
  <div class="parking-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left"
           v-show="isCollapse">
        <el-menu :default-active="combinationName"
                 v-show="naveMenu"
                 class="el-menu-vertical-demo"
                 :unique-opened="true"
                 @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items"
                        :index="item.index"
                        :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items"
                              :key="val.index"
                              :index="val.index">{{val.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else
                          :index="item.index"
                          :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div @click="isCollapse = !isCollapse"
           class="isShow"
           :style="{left: isCollapse? '200px' : '0'}">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right"
           :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
        <!-- 动态组件 -->
        <component :is="parentComponent"
                   :childrenComponent="childrenComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import platformConfig from './pages/platformConfig/index'
import hostConfig from './pages/hostConfig/idnex'
import carConfig from './pages/carConfig/index'
import relaConfig from './pages/relaConfig/index'
import { mapState, mapActions, mapGetters, mapMutations} from 'vuex'
export default {
  name: 'parkingConfig',
  components: {
    platformConfig,
    hostConfig,
    carConfig,
    relaConfig,
  },
  data() {
    return {
      isCollapse: true,
      naveMenu: true,
      menus: [
        {
          index: 'platformConfig',
          title: '平台配置',
          items: [
            {
              index: 'platformConfig-Create',
              title: '新建',
            },
            {
              index: 'platformConfig-List',
              title: '列表',
            },
            {
              index: 'platformConfig-Query',
              title: '查询',
            },
          ],
        },
        {
          index: 'hostConfig',
          title: '主机配置',
          items: [
            {
              index: 'hostConfig-List',
              title: '列表',
            },
            {
              index: 'hostConfig-Query',
              title: '查询',
            },
          ],
        },
        {
          index: 'relaConfig',
          title: '关联配置',
          items: [
            {
              index: 'relaConfig-List',
              title: '列表',
            },
            {
              index: 'relaConfig-Query',
              title: '查询',
            },
          ],
        },
        {
          index: 'carConfig',
          title: '车辆配置',
          items: [
            {
              index: 'carConfig-emphasis',
              title: '重点关注',
            },
            {
              index: 'carConfig-blacklist',
              title: '黑名单',
            },
            {
              index: 'carConfig-control',
              title: '布控车辆',
            },
          ],
        },
      ],
    }
  },
  watch: {},
  computed: {
    ...mapState({
      parentComponent: ({ parkingManage }) => parkingManage.parentComponent,
      childrenComponent: ({ parkingManage }) => parkingManage.childrenComponent,
      combinationName: ({ parkingManage }) => parkingManage.combinationName,
    }),
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.CHANGE_TAB(this.changComponent)
    console.log(this.defaultComponent, this.changComponent)
  },
  mounted() {},
  methods: {
    ...mapMutations(['CHANGE_TAB']),
     ...mapActions('login', ['setMenu', 'changIndex']), 
    changeTab(index) {
      this.CHANGE_TAB(index)
      this.changIndex(index) 
    },
  },
}
</script>

<style scoped lang="less">
.parking-config-box {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    .menu-left {
      width: 200px;
      height: 100%;
      padding: 8px 0;
      background: #f5f5f5;
      /deep/ .el-menu {
        height: 100%;
        .el-menu-item-group__title {
          display: none;
        }
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
        }
      }
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
    .content-right {
      width: calc(~'100% - 202px');
      height: 100%;
      padding: 5px 0;
      overflow: hidden;
    }
  }
}
</style>
