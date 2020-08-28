<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left" v-show="isCollapse">
        <el-menu
          :default-active="combinationName"
          style="width:220px"
          class="el-menu-vertical-demo"
          :unique-opened="false"
          @select="changeTab"
        >
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template style="220px">
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group class="ukl">
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">
                  <span>{{val.title}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div
        @click="isCollapse = !isCollapse"
        class="isShow"
        :style="{left: isCollapse? '220px' : '0'}"
      >
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right" :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
        <!-- 动态组件 -->
        <component
          v-if="initPages"
          :is="parentComponent"
          :childrenComponent="childrenComponent"
          @ChangeRoute="changeTab"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import Manage from './page/Manage/index'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'annual',
  components: {
    Manage
  },
  data() {
    return {
      isOpenPanel: true,
      initPages: true,
      isCollapse: true,
      menus: [
        {
          index: 'Manage',
          title: '考核管理',
          isSubShow: true,
          items: [
            {
              index: 'Manage-Check',
              title: '考核项目'
            },
            {
              index: 'Manage-Self',
              title: '考核自评'
            },
            {
              index: 'Manage-Matter',
              title: '待审批考核事项'
            },
            {
              index: 'Manage-Security',
              title: '总行安保部待复批考核事项'
            },
            {
              index: 'Manage-Schedule',
              title: '考核进度'
            }
          ]
        }
      ],
      parentComponent: 'Manage',
      childrenComponent: 'Self',
      combinationName: 'Manage-Self'
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn'])
  },
  created() {
    this.setMenu(this.menus)

    this.menus = this.newMenu

    this.combinationName = this.changComponent
    this.parentComponent = this.changComponent.split('-')[0]
    this.childrenComponent = this.changComponent.split('-')[1]
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    },
    changeTab(index) {
      this.changIndex(index)
      this.initPages = false
      this.$nextTick(() => {
        this.initPages = true
      })
      this.combinationName = index
      this.parentComponent = index.split('-')[0]
      this.childrenComponent = index.split('-')[1]
    }
  }
}
</script>

<style lang="less" scoped>
.el-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2d72d3 !important;
}
.el-table .el-checkbox__inner::after {
  border: 1px solid #fff !important;
  border-top: none;
  border-left: none;
}
.ukl .is-active {
  color: #538bda;
}
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
    .content-left {
      width: 220px;
      height: 1000px;
      background: rgba(245, 245, 245, 1);
      position: relative;
      .arrow {
        width: 18px;
        height: 62px;
        background: rgba(230, 230, 230, 1);
        box-shadow: 0px 0px 6px 0px rgba(44, 44, 44, 0.1);
        position: absolute;
        right: 0;
        top: 50%;
        bottom: 50%;
        line-height: 62px;
        text-align: center;
      }
      width: 220px;
      height: 1000px;
      background: rgba(245, 245, 245, 1);
      .oneMenu {
        width: 220px;
        height: 40px;
        background: rgba(225, 225, 225, 1);
        padding: 0 20px;
        line-height: 40px;
        display: block;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        &:hover {
          background-color: #d7ebf2;
        }
      }
      .icon {
        float: right;
        cursor: pointer;
        width: 11px;
        height: 6px;
        line-height: 40px;
      }
      .oneMenuChild {
        width: 220px;
        height: 40px;
        padding: 0 20px;
        display: block;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        line-height: 46px;
        &:hover {
          color: #538bda;
        }
      }
      .active {
        color: #538bda;
        border-left: 4px #538bda solid;
        span {
          margin-left: -4px;
        }
      }
    }
    .menu-left {
      width: 220px;
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
