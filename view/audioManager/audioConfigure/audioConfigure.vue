<!-- 音频配置 -->
<template>
  <div class="parking-config-box">
    <!-- 左侧导航 -->
    <div class="menu-left" v-show="isleftpas">
      <el-menu
        :default-active="combinationName"
        class="el-menu-vertical-demo"
        :unique-opened="true"
        @select="changeTab"
      >
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="val in item.items"
                :key="val.index"
                :index="val.index"
              >{{val.title}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div @click="isleftpas = !isleftpas" class="isShow" :style="{left: isleftpas? '192px' : '0'}">
      <i :class="isleftpas ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right" :style="{width: isleftpas?'calc(100% - 192px)':'100%'}">
      <!-- 动态组件 -->
      <component :is="parentComponent" :childrenComponent="childrenComponent"></component>
    </div>
  </div>
</template>
<script>
import IntercomPlatform from './page/IntercomPlatform'
import IntercomEquipment from './page/IntercomEquipment'
import IntercomRelevance from './page/IntercomRelevance'
import IntercomChannel from './page/IntercomChannel'
import MicrophoneMAC from './page/MicrophoneMAC'
import AccessServer from './page/AccessServer'
import { mapState, mapActions, mapMutations } from 'vuex'
// import { mapState, , mapGetters } from 'vuex'

export default {
  name: 'audioConfigure',
  components: {
    IntercomPlatform,
    IntercomEquipment,
    IntercomRelevance,
    IntercomChannel,
    MicrophoneMAC,
    AccessServer,
  },
  data() {
    return {
      isleftpas: true,
      menus: [
        {
          index: 'IntercomPlatform',
          title: '对讲平台配置',
          items: [
            {
              index: 'IntercomPlatform-Create',
              title: '新建',
            },
            {
              index: 'IntercomPlatform-List',
              title: '列表',
            },
            {
              index: 'IntercomPlatform-Import',
              title: '导入',
            },
            {
              index: 'IntercomPlatform-Search',
              title: '查询',
            },
          ],
        },
        {
          index: 'IntercomEquipment',
          title: '对讲设备配置',
          items: [
            {
              index: 'IntercomEquipment-List',
              title: '列表',
            },
            {
              index: 'IntercomEquipment-Search',
              title: '查询',
            },
          ],
        },
        {
          index: 'IntercomRelevance',
          title: '对讲主机关联配置',
          items: [
            {
              index: 'IntercomRelevance-List',
              title: '列表',
            },
            {
              index: 'IntercomRelevance-Search',
              title: '查询',
            },
          ],
        },
        {
          index: 'IntercomChannel',
          title: '对讲通道关联配置',
          items: [
            {
              index: 'IntercomChannel-List',
              title: '列表',
            },
            {
              index: 'IntercomChannel-Search',
              title: '查询',
            },
          ],
        },
        {
          index: 'MicrophoneMAC',
          title: '话筒MAC地址绑定',
          items: [
            {
              index: 'MicrophoneMAC-List',
              title: '列表',
            },
            {
              index: 'MicrophoneMAC-Search',
              title: '查询',
            },
          ],
        },
        {
          index: 'AccessServer',
          title: '接入服务配置',
        },
      ],
    }
  },
  watch: {},
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapState({
      parentComponent: ({ IntercomPlatform }) => IntercomPlatform.parentComponent,
      childrenComponent: ({ IntercomPlatform }) => IntercomPlatform.childrenComponent,
      combinationName: ({ IntercomPlatform }) => IntercomPlatform.combinationName,
    }),
  },
  created() {
    // 初始化tab列表
    this.setMenu(this.menus)
    // 重新赋值menus
    this.menus = this.newMenu
    // 初始化默认组件
    this.AUDIO_TAB(this.changComponent)
  },
  mounted() {},
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapMutations(['AUDIO_TAB']),
    changeTab(index) {
      console.log(index)
      this.changIndex(index)
      this.AUDIO_TAB(index)
    },
  },
}
</script>
<style scoped lang="less">
.parking-config-box {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    width: 192px;
    height: 100%;
    // padding: 5px 10px;
    background: #f5f5f5;
    transition: all .3s;
    /deep/ .el-menu {
      height: 100%;
    }
    /deep/ .el-submenu {
      // background-color: #f2f6fc;
      // margin: 2px 0;
      // height: 50px;
      // line-height: 50px;
      border-top:1px solid #E4E7ED;
    }
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
        font-size:12px;
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
    // padding: 5px 20px;
  }
}
</style>
