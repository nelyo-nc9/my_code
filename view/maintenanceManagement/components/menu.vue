
<template>
    <div class="menuBox">
        <div class="menuList" v-show="isCollapse">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :unique-opened='true' @open="handleOpen" @close="handleClose">
            <el-submenu index="1" v-if="isMenuShow">
                <template slot="title">
                  <span>维保任务单</span>
                </template>
                <el-menu-item-group>
                <el-menu-item index="1-1" @click="gotoDetailForm">新建</el-menu-item>
                <el-menu-item index="1-2" @click="gotoList">列表</el-menu-item>
                <el-menu-item index="1-3" @click="gotoSearch">查询</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2" v-if="!isMenuShow">
                <template slot="title">
                  <span>工单申报</span>
                </template>
                <el-menu-item-group>
                <el-menu-item index="2-1" @click="gotoDetailForm">新建</el-menu-item>
                <el-menu-item index="2-2" @click="gotoList">列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3" v-if="!isMenuShow">
                <template slot="title">
                  <span>工单处理</span>
                </template>
                <el-menu-item-group>
                <el-menu-item index="3-1" @click="gotoDetailForm">新建</el-menu-item>
                <el-menu-item index="3-2" @click="gotoList">未确认故障列表</el-menu-item>
                <el-menu-item index="3-3" @click="gotoSearch">已确认故障列表</el-menu-item>
                <el-menu-item index="3-3" @click="gotoSearch">屏蔽报警列表</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4" v-if="!isMenuShow">
                <template slot="title">
                  <span>工单查询</span>
                </template>
                <el-menu-item-group>
                <el-menu-item index="4-3" @click="gotoSearch">查询</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
        <div @click="isCollapse = !isCollapse" class="isShow" :style="{left: isCollapse? '200px' : '0px'}">
            <i :class="isCollapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
        </div>
    </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: ['activeMenu', 'isMenuShow'],
  data() {
    return {
      status: 'addNew',
      isCollapse: true,
      openeds: [2],
      titleDa: '',
      isView: true
    }
  },
  methods: {
    gotoSearch() {
      this.$router.push({name: 'searchList'})
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    gotoDetailForm() {
      this.$emit('addNew', this.status)
      this.$router.push({name: 'detailForm'})
    },
    gotoList() {
      this.$router.push({name: 'taskManagement'})
    }
  },
  created() {
    console.log(this.isMenuShow)
  }

}
</script>

<style lang="less" scoped>
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
    .menuBox{
      position: relative;
    }
    .isShow {
      position: absolute;
      top: 300px;
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
</style>
