<!--
 * @Author: your name
 * @Date: 2020-06-12 09:51:38
 * @LastEditTime: 2020-06-17 09:43:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\systemParameters.vue
-->
<template>
<!-- 系统参数 -->
  <div class="system-parameters-box">
    <div class="menu-left">
      <el-menu :default-active="defaultMenu" class="el-menu-vertical-demo" :unique-opened="false" @select="changeTab">
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.label}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="val in item.items">
                <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
                <el-submenu v-else :key="val.index" :index="val.index">
                  <template>
                    <span slot="title">{{val.title}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-for="v in val.items" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="content-right">
      <div style="margin-left:30px;" v-if="defaultMenu === 'versionInformation'">
        <!-- 版本信息 -->
        <VersionInformation ref="versionInformation"></VersionInformation>
      </div>
      <div style="margin-left:5px;" v-if="defaultMenu === 'basicConfiguration'">
        <!-- 基本配置页面 -->
        <BasicConfiguration ref="BasicConfiguration"></BasicConfiguration>
      </div>
    </div>
  </div>
</template>

<script>
// import VersionInformation from './pages/VersionInformation.vue'// 页面暂时取消
import BasicConfiguration from './pages/BasicConfiguration.vue'
export default {
  name: 'systemParameters',
  components: {
    // VersionInformation,
    BasicConfiguration
  },
  data() {
    return {
      // 默认导航栏
      defaultMenu: 'basicConfiguration',
      menus: [
        {
          index: 'systemParameters',
          label: '系统参数',
          items: [
            // 页面暂时取消
            // {
            //   index: 'versionInformation',
            //   title: '版本信息'
            // },
            {
              index: 'basicConfiguration',
              title: '基本配置'
            }
          ]
        }
      ]
    }
  },
  created() {
  },
  methods: {
    changeTab(index) {
      this.defaultMenu = index
    }
  }
}
</script>

<style lang="less" scoped>
.system-parameters-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    height: 100%;
    padding: 5px 10px;
    background: #F5F5F5;
    .arrow {
      font-size: 14px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    .el-menu-vertical-demo {
      width: 200px;
    }
    /deep/ .el-menu {
      border-right: none;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .content-right {
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
  }
}
</style>
