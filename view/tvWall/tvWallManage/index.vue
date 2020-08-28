<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left"
           v-show="isCollapse">
        <el-menu :default-active="combinationName"
                 class="el-menu-vertical-demo"
                 :unique-opened="true"
                 @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items"
                        :index="item.index"
                        :key="item.index">
              <template>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items"
                              :key="val.index"
                              :index="val.index">{{
                  val.title
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else
                          :index="item.index"
                          :key="item.index">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div @click="isCollapse = !isCollapse"
           class="isShow"
           :style="{ left: isCollapse ? '200px' : '0' }">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right"
           :style="{ width: isCollapse ? 'calc(100% - 202px)' : '100%' }">
        <!-- 动态组件 -->
        <component :is="whocomponentId"
                   v-bind="{ sortProp }"
                   :key="whocomponentId"></component>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ManageList from './tvWallEdit/manageList'
import ImportTvWall from './tvWallEdit/ImportTvWall'
import SortTvWall from './tvWallEdit/SortTvWall'
import AddTvmanage from './tvWallEdit/AddTvmanage'
import SearchTvmanage from './tvWallEdit/SearchTvmanage'
import AddDecoding from './decodingDevice/AddDecoding'
import decodingList from './decodingDevice/decodingList'
import SearchDecoding from './decodingDevice/SearchDecoding'
import AddLedEdit from './LedEdit/AddLedEdit'
import LedEditList from './LedEdit/LedEditList'
import SearchLedEdit from './LedEdit/SearchLedEdit'
import newWallmessage from './tvWallEdit/newWallmessage'
import newDeconmessage from './decodingDevice/newDeconmessage'
import newLedMessage from './LedEdit/newLededitMessage'
import ChangeTvwallEidto from './tvWallEdit/ChangeTvwallEidto'
import ChangeLedEdit from './LedEdit/ChangeLedEdit'
import ChangeDecod from './decodingDevice/ChangeDecod'
import SortDecoding from './decodingDevice/SortDecoding'
import ImportDecoding from './decodingDevice/ImportDecoding'
import SortLed from './LedEdit/SortLed'
import ImportLed from './LedEdit/ImportLed'
import moveTvWall from './tvWallEdit/moveTvWall'
import moveDecod from './decodingDevice/moveDecod'
import moveLed from './LedEdit/moveLed'
export default {
  name: '',
  components: {
    AddTvmanage,
    ManageList,
    SearchTvmanage,
    AddDecoding,
    decodingList,
    SearchDecoding,
    AddLedEdit,
    LedEditList,
    SearchLedEdit,
    newWallmessage,
    newDeconmessage,
    newLedMessage,
    ChangeTvwallEidto,
    ChangeLedEdit,
    ChangeDecod,
    ImportTvWall,
    SortTvWall,
    SortDecoding,
    ImportDecoding,
    SortLed,
    ImportLed,
    moveTvWall,
    moveDecod,
    moveLed
  },
  data() {
    return {
      isCollapse: true,
      menus: [
        {
          index: 'ManageList',
          title: '电视墙配置',
          items: [
            {
              index: 'AddTvmanage',
              title: '新建'
            },
            {
              index: 'ManageList',
              title: '列表'
            },
            {
              index: 'SearchTvmanage',
              title: '查询'
            }
          ]
        },
        {
          index: 'decodingList',
          title: '解码设备配置',
          items: [
            {
              index: 'AddDecoding',
              title: '新建'
            },
            {
              index: 'decodingList',
              title: '列表'
            },
            {
              index: 'SearchDecoding',
              title: '查询'
            }
          ]
        },
        {
          index: 'LedEditList',
          title: 'LED设备配置',
          items: [
            {
              index: 'AddLedEdit',
              title: '新建'
            },
            {
              index: 'LedEditList',
              title: '列表'
            },
            {
              index: 'SearchLedEdit',
              title: '查询'
            }
          ]
        }
      ],
      combinationName: 'ManageList',
      sortProp: ''
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      whocomponentId: ({ tvWall }) => tvWall.whocomponentId
    })
  },
  created() {
    this.setMenu(this.menus) // 重新赋值menus
    this.menus = this.newMenu
    this.SET_COMPONENTID1(this.defaultComponent.index)
    this.combinationName = this.defaultComponent.index
    // this.SET_COMPONENTID1('ManageList')
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapMutations(['SET_COMPONENTID1', 'SET_SKIP_NUM']),
    changeTab(index) {
      // this.SET_COMPONENTID1(index)
      // 组件切换传参
      this.changIndex(index)

      if (index === 'AddTvmanage') {
        this.SET_SKIP_NUM(1)
      }
      this.SET_COMPONENTID1(index)
    }
  }
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
    }
  }
}
// .managebox {
//   width: 100%;
//   height: 100%;
//   padding: 10px 0;
//   display: flex;
//   .left-tabs {
//     height: 100%;
//     .arrow {
//       height: 32px;
//       line-height: 32px;
//       font-size: 16px;
//       text-align: right;
//       i {
//         cursor: pointer;
//         &:hover {
//           color: #538bda;
//         }
//       }
//     }
//     .menu-content {
//       font-size: 14px;
//       dt {
//         background: #f2f2f2;
//         height: 32px;
//         line-height: 32px;
//         padding-left: 10px;
//         cursor: pointer;
//         &:hover {
//           background: #dff5fc;
//         }
//       }
//       dd {
//         background: #f8f8f8;
//         height: 32px;
//         line-height: 32px;
//         padding-left: 20px;
//         margin-inline-start: 0px;
//         border-top: 1px solid #ffffff;
//         cursor: pointer;
//         &:hover {
//           color: #538bda;
//         }
//       }
//       .active {
//         color: #538bda;
//         border-left: 2px solid #2d72d3;
//       }
//     }
//   }
//   .right-content {
//     flex: 1;
//     height: 100%;
//     background: #fff;
//   }
//   .el-menu {
//     background-color: #eee;
//   }
// }
</style>
