<!--  -->
<template>
  <div class="video-config-box">
    <div class="main">
      <!-- 左侧导航 -->
      <div class="menu-left" v-show="isCollapse">
        <el-menu :default-active="combinationName" style="width:200px" class="el-menu-vertical-demo" :unique-opened="true" @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template style="200px">
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
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
        <component v-if="initPages" :is="parentComponent" :childrenComponent="childrenComponent"></component>
      </div>
    </div>
  </div>
</template>
<script>
import System from './page/system/index'
import Assess from './page/assess/index'
import Work from './page/work/index'
import Duty from './page/duty/index'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: '',
  components: {
    System,
    Assess,
    Work,
    Duty
  },
  data() {
    return {
      initPages:true,
      isCollapse: true,
      menus: [
        {
          index: 'System',
          title: '系统统计',
          items: [
            {
              index: 'System-Overall',
              title: '系统整体统计'
            }, {
              index: 'System-General',
              title: '系统概况统计'
            },
          ]
        },
        {
          index: 'Assess',
          title: '考核统计',
          items: [
            {
              index: 'Assess-Grade',
              title: '考核项目评分统计'
            }, {
              index: 'Assess-Synthesize',
              title: '考核综合评分'
            },
          ]
        },
        {
          index: 'Work',
          title: '工作日志统计',
          items: [
            {
              index: 'Work-Category',
              title: '日志按类别统计'
            }, {
              index: 'Work-Orgation',
              title: '日志按机构对比统计'
            },
          ]
        },
        {
          index: 'Duty',
          title: '值班统计',
          items: [
            {
              index: 'Duty-Platfrom',
              title: '值班完成率统计'
            }
          ]
        },
        
      ],
      parentComponent: 'System',
      childrenComponent: 'Overall',
      combinationName: 'System-Overall'
    }
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.changIndex(index);
      this.initPages=false;
      this.$nextTick(()=> {
        this.initPages=true;
      });
      this.combinationName = index
      this.parentComponent = index.split('-')[0]
      this.childrenComponent = index.split('-')[1]
    }
  },
  created() {
     this.setMenu(this.menus);
     this.menus = this.newMenu;
     this.combinationName = this.changComponent
     this.parentComponent = this.changComponent.split('-')[0]
     this.childrenComponent = this.changComponent.split('-')[1]
     console.log(this.menus)
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']), 
     ...mapGetters('login', ['isBtn']),
  },
  watch: {
    
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