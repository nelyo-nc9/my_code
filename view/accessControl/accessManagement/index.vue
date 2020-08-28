<template>
  <div class="video-config-box">
    <div class="menu-left" v-show="isCollapse">
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
              <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">
                <i :class="val.icon"></i>
                {{val.title}}
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
      :style="{left: isCollapse ? '195px' : '0'}"
    >
      <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content-right" :class="{'addWidth' : !isCollapse}">
      <div class="content" :style="{'padding-left' : isCollapse ? '0px' : '10px'}">
        <component
          :createHost="createHost"
          :is="parentComponent"
          :childrenComponent="childrenComponent"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'videoConfig',
  components: {
    accessPlatform: () => import('./pages/videoHost/index'),
    Device: () => import('./pages/devices/index'),
    Host: () => import('./pages/Host/index'),
    aisle: () => import('./pages/aisle/index'),
    alarm: () => import('./pages/alarm/index'),
  },
  data() {
    return {
      createHost: {},
      isCollapse: true,
      treeType: 0,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      menus: [
        {
          index: 'accessPlatform',
          title: '门禁平台配置',
          items: [
            {
              index: 'accessPlatform-Create',
              title: '新建',
              icon: 'el-icon-folder-add',
            },
            {
              index: 'accessPlatform-List',
              title: '列表',
              icon: 'el-icon-tickets',
            },
            {
              index: 'accessPlatform-Import',
              title: '导入',
              title: '导入',
              icon: 'el-icon-document',
            },
          ],
        },
        {
          index: 'Device',
          title: '门禁主机配置',
          items: [
            {
              index: 'Device-List',
              title: '列表',
              icon: 'el-icon-tickets',
            },
            {
              index: 'Device-Search',
              title: '查询',
              icon: 'el-icon-news',
            },
          ],
        },
        {
          index: 'Host',
          title: '门禁主机关联配置',
          items: [
            {
              index: 'Host-List',
              title: '列表',
              icon: 'el-icon-tickets',
            },
            {
              index: 'Host-Search',
              title: '查询',
              icon: 'el-icon-news',
            },
          ],
        },
        {
          index: 'aisle',
          title: '门禁通道关联配置',
          items: [
            {
              index: 'aisle-List',
              title: '列表',
              icon: 'el-icon-tickets',
            },
            {
              index: 'aisle-Search',
              title: '查询',
              icon: 'el-icon-news',
            },
          ],
        },
        {
          index: 'alarm',
          title: '报警输入关联配置',
          items: [
            {
              index: 'alarm-List',
              title: '列表',
              icon: 'el-icon-tickets',
            },
            {
              index: 'alarm-Search',
              title: '查询',
              icon: 'el-icon-news',
            },
          ],
        },
      ],
      // filterText: '',
      data: [
        {
          label: '河北省分行',
          children: [
            {
              label: '石家庄分行',
              children: [
                {
                  label: '创业路支行',
                  children: [
                    {
                      label: '创业路营业网点',
                      children: [
                        {
                          label: '报警控制主机',
                        },
                      ],
                    },
                  ],
                },
                {
                  label: '丰收路支行',
                  children: [
                    {
                      label: '丰收路办公楼',
                      children: [
                        {
                          label: '振动光纤报警主机',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: '保定分行',
              children: [
                {
                  label: '融汇支行',
                },
                {
                  label: '五四西路支行',
                },
                {
                  label: '五四中路支行',
                },
              ],
            },
          ],
        },
      ],
      parentComponent: 'accessPlatform',
      childrenComponent: 'List',
      combinationName: 'accessPlatform-List',
    }
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.combinationName = this.changComponent
    this.parentComponent = this.changComponent.split('-')[0]
    this.childrenComponent = this.changComponent.split('-')[1]
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.combinationName = index
      this.parentComponent = index.split('-')[0]
      this.childrenComponent = index.split('-')[1]

      this.changIndex(index) // 调用vuex传递Index
    },

    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name } = val
        this.createHost.jigou = name
      } else if (tierType == 'loc') {
        // 重点部位
        let { name } = val
        this.createHost.buwei = name
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
  },
}
</script>

<style lang="less" scoped>
.video-config-box {
  background: #fff;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  height: 100%;
  .menu-left {
    // width: 200px;
    width: 196px;
    /deep/ .el-menu {
      height: 100%;
    }
    /deep/ .el-collapse-item__header {
      background: #eee;
    }
    /deep/ .el-collapse-item__content {
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
    width: calc(~'100% - 195px');
    .content {
      display: flex;
      padding: 0 10px;
      height: 100%;
      overflow: hidden;
    }
  }
  .addWidth {
    width: 100%;
  }

  /deep/ .el-menu {
  }
}
</style>
