<template>
  <div class="pageContent">
    <div class="menuList" v-show="isCollapse">
      <el-menu :default-active="activeMenu" :default-openeds='openeds' class="el-menu-vertical-demo" :unique-opened='true' @open="handleOpen" @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <span @click="changeList('EquipmentTiming')">外委公司管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="list" @click="changeList('list')">列表</el-menu-item>
            <el-menu-item index="query" @click="changeList('query')">查询</el-menu-item>
            <el-menu-item index="assessment" @click="changeList('assessment')">考核</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div @click="isCollapse = !isCollapse" class="isShow" :style="{left: isCollapse? '200px' : '0px'}">
      <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content" :style="{width: isCollapse?'calc(100% - 202px)':'100%'}">
      <component :is="activeMenu" @giveValue="giveValue" :titleDa="titleDa" :isView="isView"></component>
    </div>
  </div>
</template>
<script>
import list from './list'
import query from './query'
import assessment from './assessment'
export default {
  components: {
    query,
    list,
    assessment
  },
  data() {
    return {
      isCollapse: true,
      openeds: ['1'],
      activeMenu: 'list',
      titleDa: '',
      isView: true
    }
  },
  methods: {
    changeList(componentName) {
      this.activeMenu = componentName
      if (componentName === 'NewTask') {
        this.titleDa = ''
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    giveValue(data, val) {
      console.log(data, val);
      this.titleDa = data
      this.isView = val
    },
  }
}
</script>
<style lang="less" scoped>
.pageContent {
  width: 100%;
  height: 100%;
  display: flex;
  .menuList {
    width: 200px;
    height: 100%;
    .el-menu {
      height: 100%;
      width: 100%;
      .el-submenu {
        .el-submenu__title {
          span {
            font-size: 14px;
            color: #000;
          }
        }
        .el-menu {
          .el-menu-item-group {
            .el-menu-item {
              font-size: 13px;
            }
          }
        }
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
  .content {
    width: calc(~'100% - 202px');
    // height: 100%;
    overflow: auto;
    padding: 5px 0;
    // overflow: hidden;
  }
}
</style>
