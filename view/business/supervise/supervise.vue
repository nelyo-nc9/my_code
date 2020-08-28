<!-- 国标互联 -->
<template>
  <div class="parking-config-box">
    <!-- 左侧导航 -->
    <div class="menu-left" v-show="isleftpas"> 
      <el-menu :default-active="combinationName"
               class="el-menu-vertical-demo"
               :unique-opened="true"
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
                            :index="val.index">{{val.title}}</el-menu-item>
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
    <div @click="isleftpas = !isleftpas" class="isShow" :style="{left: isleftpas? '200px' : '0'}">
        <i :class="isleftpas ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 动态组件 -->
      <component :is="parentComponent"
                 :childrenComponent="childrenComponent">
      </component>
    </div>
  </div>
</template>
<script>
import gatewayManage from './page/gatewayManage'
import ownReshare from './page/ownReshare'
import subateResources from './page/subateResources'
import shareManagement from './page/shareManagement'
import log from  './page/log'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'supervise',
  components: {
    gatewayManage,
    ownReshare,
    subateResources,
    shareManagement,
    log
  },
  data() {
    return {
       isleftpas: true,
        menus: [
        {
          index: 'gatewayManage',
          label: '网关配置',
          items: [
            {
              index: 'gatewayManage-OwnresManage',
              title: '本级域配置'
            }, {
              index: 'gatewayManage-MiderTire',
              title: '网关配置'
            }, {
              index: 'gatewayManage-ParentManage',
              title: '上级域配置'
            }, {
              index: 'gatewayManage-SubateManage',
              title: '下级域配置'
            }
          ]
        },
        {
          index: 'ownReshare',
          label: '本级资源共享',
        },
        {
          index: 'subateResources',
          label: '下级资源检索',
        },
        {
          index:'shareManagement',
          label:'共享管理'
        },
        {
          index: 'log',
          label: '日志',
        }
      ],
    }      
  },
 watch: {},
  computed: {
    ...mapState({
      parentComponent: ({ supervise }) => supervise.parentComponent,
      childrenComponent: ({ supervise }) => supervise.childrenComponent,
      combinationName: ({ supervise }) => supervise.combinationName
    })
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['SUPER_TAB']),
    changeTab(index) {
      this.SUPER_TAB(index)
    }
  }
}
</script>
<style scoped lang="less">
.parking-config-box {
  width: 100%;
  height: 100%;
  padding: 0px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    width: 212px;
    height: 100%;
    padding: 5px 10px;
    /deep/ .el-menu {
      height: 100%;
    }
    // /deep/ .el-submenu .el-menu-item {
    //   background-color: #f2f6fc;
    //   margin: 2px 0;
    //   height: 50px;
    //   line-height: 50px;
    // }
    /deep/ .el-menu-item.is-active {
      border-left: 2px solid blue;
    }
    /deep/ .el-collapse-item__header {
      background: #eee;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 1px;
    }
    /deep/ .el-submenu {
      .el-menu-item {
        min-width: 170px;
      }
    }
    .menu-nav {
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      background: #f5f4f4;
      border-bottom: 1px solid #fff;
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
      border-left: 18px solid #E6E6E6;
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
</style>
