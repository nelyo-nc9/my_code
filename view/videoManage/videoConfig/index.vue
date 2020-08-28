<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left" v-show="isCollapse">
        <el-menu :default-active="combinationName" class="el-menu-vertical-demo" :unique-opened="true" @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index"><i :class="val.icon"></i>{{val.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div @click="isCollapse = !isCollapse" class="isShow" :style="{left: isCollapse? '200px' : '0'}">
        <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
      <!-- 右侧内容 -->
      <div class="content-right" :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
        <!-- 动态组件 -->
        <component v-if="initPages" :is="parentComponent" :childrenComponent="childrenComponent" @changeTab="changeTab"></component>
      </div>
    </div>
  </div>
</template>

<script>
import VideoHost from './pages/videoHost/index'
import VideoHostIO from './pages/videoHostIO/index'
import VideoHostRelate from './pages/videoHostRelate/index'
import CameraRelate from './pages/cameraRelate/index'
import { getDeviceSelectConf } from '../components/selectConf' // 获取服务器下拉
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'videoConfig',
  components: {
    VideoHost,
    VideoHostIO,
    VideoHostRelate,
    CameraRelate
  },
  data() {
    return {
      initPages: true,
      isCollapse: true,
      menus: [
        {
          index: 'VideoHost',
          title: '视频主机配置',
          items: [
            {
              index: 'VideoHost-Import',
              title: '导入',
              icon: 'el-icon-document'
            }, {
              index: 'VideoHost-Create',
              title: '新建',
              icon: 'el-icon-folder-add'
            }, {
              index: 'VideoHost-List',
              title: '列表',
              icon: 'el-icon-tickets'
            }, {
              index: 'VideoHost-Search',
              title: '查询',
              icon: 'el-icon-news'
            }
          ]
        },
        {
          index: 'CameraRelate',
          title: '摄像机关联配置',
          items: [
            {
              index: 'CameraRelate-List',
              title: '列表',
              icon: 'el-icon-tickets'
            }, {
              index: 'CameraRelate-Search',
              title: '查询',
              icon: 'el-icon-news'
            }
          ]
        },
        {
          index: 'VideoHostIO',
          title: '报警输入关联配置',
          items: [
            {
              index: 'VideoHostIO-List',
              title: '列表',
              icon: 'el-icon-tickets'
            }, {
              index: 'VideoHostIO-Search',
              title: '查询',
              icon: 'el-icon-news'
            }
          ]
        },
        {
          index: 'VideoHostRelate',
          title: '视频主机关联配置',
          items: [
            {
              index: 'VideoHostRelate-List',
              title: '列表',
              icon: 'el-icon-tickets'
            }, {
              index: 'VideoHostRelate-Search',
              title: '查询',
              icon: 'el-icon-news'
            }
          ]
        }
      ],
      parentComponent: 'VideoHost',
      childrenComponent: 'List',
      combinationName: 'VideoHost-List'
    }
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn']),
    ...mapState({
      objs: ({ videoManage }) => videoManage.videoConfig.objs
    })
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.combinationName = this.changComponent
    this.parentComponent = this.changComponent.split('-')[0]
    this.childrenComponent = this.changComponent.split('-')[1]
    getDeviceSelectConf() // 获取下拉填充
    this.getDataInfos(this.objs)
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    ...mapActions('videoManage/videoConfig', ['getDataInfo']),
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
    // 获取数据字典请求 封装
    async getDataInfos(param) {
      await this.getDataInfo(param).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          let params = this.$lodash.cloneDeep(data)
          console.log(params)
        } else {
          throw res.data.message
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.video-config-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
      background: #F5F5F5;
      /deep/ .el-menu {
        height: 100%;
        .el-menu-item-group__title {
          display: none;
        }
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
        }
        .el-submenu {
          border-bottom: 1px solid #dbdce0;
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
      overflow: hidden;
    }
  }
}
</style>
