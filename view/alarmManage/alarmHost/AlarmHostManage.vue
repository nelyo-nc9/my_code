<template>
  <div class="host-container">
    <div class="main">
      <div class="host-menu"
           v-show="isCollapse">
        <div class="menu-content">
          <el-menu :default-active="combinationName"
                   :unique-opened="true"
                   class="el-menu-vertical-demo"
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
            </template>
          </el-menu>
        </div>
      </div>
      <div @click="isCollapse = !isCollapse"
           class="isShow"
           :style="{left: isCollapse? '200px' : '0'}">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <div class="host-main"
           :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
        <el-row style="height: 100%">
          <div class="host-tree">
            <treeBox :lazyTreeApi="getTreeApi"
                     ref="tree"
                     searchType="search"
                     :treeType="treeType"
                     @rootId='setRootId'
                     @onceClick="onceClick"
                     @clickData="clickData"
                     :lazyTreeSearchApi="getLazyTreeSearchApi"
                     treeLazyToggle
                     iconToggle
                     :customizeQuery="customizeQuery">
              <template slot-scope="{data}">
                <i class="iconfont icon-biaoqian"
                   title="详细信息"
                   v-if="iconList.includes('info')"
                   @click.stop="clickInfo(data)"></i>
              </template></treeBox>
          </div>
          <div class="host-content">
            <!-- 动态组件 -->
            <component :is="parentComponent"
                       :ref='combinationName'
                       :initId='initId'
                       v-if="initPages"></component>
            <!-- <HostListMode v-if="menus[0].items[0].active"
                          ref="HostListMode"></HostListMode>
            <ElectricListMode v-if="menus[0].items[1].active"
                              ref="ElectricListMode"></ElectricListMode>
            <VibrationListMode v-if="menus[0].items[2].active"
                               ref="VibrationListMode"></VibrationListMode> -->
          </div>
        </el-row>
      </div>
      <!-- 机构树节点详细信息 -->
      <dialog-info v-if="showDialogInfo"
                   :showDialogInfo="showDialogInfo"
                   :nodeData="orgData"
                   @closeDialogInfo="closeDialogInfo"></dialog-info>
    </div>
  </div>
</template>

<script>
import HostListMode from './hostPage/HostListMode'
import ElectricListMode from './electricPage/ElectricListMode'
import VibrationListMode from './vibrationPage/VibrationListMode'
import treeBox from '@src/components/tree/treeBox'
import { getAlarmHostTreeApi, AlarmHostSearchTreeApi } from '@src/http/alarm/alarmHostManage.api'
import DialogInfo from './DialogInfo'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'alarmHost',
  components: {
    HostListMode,
    ElectricListMode,
    VibrationListMode,
    treeBox,
    DialogInfo,
  },
  data() {
    return {
      initPages: true,
      treeType: 1,
      isCollapse: true,
      rootId: '',
      customizeQuery: {
        params: {
          subSystem: '2',
          isRecursion: '0',
        },
      },
      menus: [
        {
          index: 'HostListMode',
          title: '报警主机管理',
          items: [
            {
              index: 'HostListMode',
              title: '报警控制主机',
              //   icon: '&#xe752;',
            },
            {
              index: 'ElectricListMode',
              title: '电子围栏总线报警主机',
              //   icon: '&#&#xe71e;',
            },
            {
              index: 'VibrationListMode',
              title: '振动光纤报警主机',
              //   icon: '&#xe639;',
            },
          ],
        },
      ],
      parentComponent: 'HostListMode',
      combinationName: 'HostListMode',
      orgId: '',
      locationId: '',
      numNav: 0,
      initId: '', // 根节点id
      iconList: ['info'],
      showDialogInfo: false, // 展示机构节点信息弹窗
      orgData: {}, // 机构节点信息
    }
  },
  watch: {
    rootId(id) {
      this.initId = id
    },
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.combinationName = this.changComponent
    this.parentComponent = this.changComponent
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
      this.parentComponent = index
    },
    getTreeApi(params) {
      return getAlarmHostTreeApi(params)
    },
    // 机构资源树模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 2,
        key: params.search,
      }
      return AlarmHostSearchTreeApi(params)
    },
    // 高亮根节点
    clickData(data) {
      if (data && data.id) {
        this.$refs.tree.setCurrentKey(data.nodeKey)
      }
    },
    onceClick(data, node) {
      console.log(data, node)
      let obj = {}
      if (data.tierType === 'org') {
        obj.orgId = data.id
        this.$refs.HostListMode.treeFn(obj)
      } else if (data.tierType === 'loc') {
        obj.locationId = data.id
        this.$refs.HostListMode.treeFn(obj)
      } else if (data.tierType === 'equ') {
        obj.hostId = data.id
        this.$refs.HostListMode.backControlStatus(true, data)
      }
      if (data.tierType !== 'equ') {
        this.$refs.HostListMode.orgChange(obj)
      }
    },
    setRootId(id) {
      this.rootId = id
    },
    clickInfo(data) {
      // 机构树详细信息
      this.orgData = data
      this.showDialogInfo = true
    },
    closeDialogInfo() {
      this.showDialogInfo = false
    },
  },
}
</script>

<style scoped lang='less'>
.host-container {
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

    .host-menu {
      width: 200px;
      height: 100%;
      padding: 8px 0;
      background: rgba(245, 245, 245, 1);
      .menu-content {
        font-family: Microsoft YaHei;
        font-weight: 400;
        /deep/ .el-menu {
          height: 100%;
          .el-menu-item-group__title {
            display: none;
          }
          .el-submenu .el-menu-item {
            height: 40px;
            line-height: 40px;
            background: rgba(245, 245, 245, 1);
            min-width: 195px;
            margin-top: 2px;
            &:hover {
              background: rgba(235, 235, 235, 1);
            }
          }
          .el-submenu .active {
            background: rgba(235, 235, 235, 1);
          }
          .el-submenu__title {
            height: 40px;
            width: 195px;
            line-height: 40px;
            padding-left: 20px;
            color: rgba(0, 0, 0, 1);
            font-size: 14px;

            &:hover {
              background: rgba(225, 225, 225, 1);
            }
          }
        }
      }
    }
    .host-main {
      width: calc(~'100% - 202px');
      height: 100%;
      padding: 5px 0;
      overflow: hidden;
      .host-tree {
        width: 240px;
        height: 100%;
        position: absolute;
        border-right: 1px solid #e1e1e1;
      }
      .host-content {
        height: 100%;
        width: calc(~'100% - 240px');
        box-shadow: 0 0 10px #ccc inset;
        position: absolute;
        left: 240px;
        font-size: 14px;
        padding: 10px;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
