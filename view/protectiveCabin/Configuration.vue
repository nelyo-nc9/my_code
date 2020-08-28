<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left"
           v-show="isCollapse">
        <el-menu :default-active="combinationName"
                 class="el-menu-vertical-demo"
                 :unique-opened="false"
                 @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items"
                        :index="item.index"
                        :key="item.index">
              <template>
                <span slot="title">{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items"
                              :key="val.index"
                              :index="val.index">
                  <span class="iconfont-ccb"
                        :class="val.icon"></span>
                  <!-- <i class="icon-daorushouquan"></i> -->
                  <span>{{val.title}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else
                          :index="item.index"
                          :key="item.index">
              <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div @click="isCollapse = !isCollapse"
           class="isShow"
           :style="{left: isCollapse? '195px' : '0'}">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right"
           :style="{width: isCollapse?'calc(100% - 195px)':'100%'}">
        <!-- 动态组件 -->
        <component v-if="initPages"
                   :is="parentComponent"
                   :childrenComponent="childrenComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import ControllHost from './pages/controllerConfiguration/index'
import ChannnelLink from './pages/channelConfiguration/index'
import InputLink from './pages/inputConfiguration/index'
import HostLink from './pages/hostConfiguration/index'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
export default {
  components: {
    ControllHost,
    ChannnelLink,
    InputLink,
    HostLink,
  },
  data() {
    return {
      initPages: true,
      isCollapse: true,
      menus: [
        {
          index: 'ControllHost',
          label: '防护舱设备配置',
          items: [
            { index: 'ControllHost-AddEquipment', title: '新建', icon: 'ccbxinjian' },
            { index: 'ControllHost-EquipmentList', title: '列表', icon: 'ccbliebiao1' },
            { index: 'ControllHost-SearchEquipment', title: '查询', icon: 'ccbchaxun' },
            { index: 'ControllHost-ImportEquipment', title: '导入', icon: 'ccbdaoru1' },
          ],
        },
        {
          index: 'HostLink',
          label: '防护舱主机关联配置',
          isSubShow: false,
          items: [
            { index: 'HostLink-List', title: '列表', icon: 'ccbliebiao1' },
            { index: 'HostLink-SearchHostList', title: '查询', icon: 'ccbchaxun' },
          ],
        },
        {
          index: 'ChannnelLink',
          label: '防护舱通道关联配置',
          isSubShow: false,
          items: [
            { index: 'ChannnelLink-List', title: '列表', icon: 'ccbliebiao1' },
            { index: 'ChannnelLink-SearchChannel', title: '查询', icon: 'ccbchaxun' },
          ],
        },
        {
          index: 'InputLink',
          label: '报警输入关联配置',
          isSubShow: false,
          items: [
            { index: 'InputLink-List', title: '列表', icon: 'ccbliebiao1' },
            { index: 'InputLink-SearchInput', title: '查询', icon: 'ccbchaxun' },
          ],
        },
      ],
      parentComponent: 'ControllHost',
      childrenComponent: 'EquipmentList',
      combinationName: 'ControllHost-EquipmentList',
    }
  },
  watch: {},
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    // ...mapGetters('login', ['isBtn']),
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.combinationName = this.changComponent
    this.parentComponent = this.changComponent.split('-')[0]
    this.childrenComponent = this.changComponent.split('-')[1]
  },
  mounted() {},
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.changIndex(index)
      this.initPages = false
      this.$nextTick(() => {
        this.initPages = true
      })
      this.combinationName = index
      this.parentComponent = index.split('-')[0]
      this.childrenComponent = index.split('-')[1]
    },
  },
}
</script>

<style lang="less" scoped>
.video-config-box {
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
      width: 195px;
      height: 100%;
      padding-top: 8px;
      background: #f5f5f5;
      /deep/ .el-menu-vertical-demo {
        .el-submenu {
          .el-menu {
            .el-menu-item-group {
              .el-menu-item {
                min-width: 195px;
                padding-left: 21px !important;
                .iconfont-ccb {
                  color: #333;
                  font-size: 18px;
                  margin-right: 5px;
                }
                span {
                  font-size: 12px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                }
              }
            }
          }
        }
      }
      /deep/ .el-menu {
        height: 100%;
        .el-menu-item-group__title {
          display: none;
        }
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #e1e1e1;
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
      .el-icon-arrow-left {
        position: absolute;
        left: -15px;
        top: 9px;
      }
      .el-icon-arrow-right {
        position: absolute;
        left: -15px;
        top: 9px;
      }
      .iconfont-ccb {
        color: #666;
        position: absolute;
        left: -15px;
        top: 6px;
      }
    }
    .content-right {
      width: calc(~'100% - 202px');
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
