<!--
 * @Author: your name
 * @Date: 2020-07-05 15:01:23
 * @LastEditTime: 2020-07-05 15:49:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\cascadeManagement/cascadeManagement.vue
-->
<template>
<!-- 数据字典 -->
  <div class="cascade-management-box">
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
     <!-- 中间内容 -->
    <div class="content-center" v-if="isTreeShow">
      <treeBox  searchType="filter" treeLazyToggle iconToggle ></treeBox>
    </div>
    <div class="content-right">
      <div class="list" v-if="defaultMenu === 'subordinateCenterList'">
        <SubordinateCenterList></SubordinateCenterList>
      </div>
      <div class="search" v-if="defaultMenu === 'subordinateCenterSearch'">
        <SubordinateCenterSearch></SubordinateCenterSearch>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import SubordinateCenterList from './pages/SubordinateCenterList.vue'
import SubordinateCenterSearch from './pages/SubordinateCenterSearch'
export default {
  name: 'cascadeManagement',
  components: {
    treeBox,
    SubordinateCenterList,
    SubordinateCenterSearch
  },
  data() {
    return {
      paramsData: {},
      // 默认导航栏
      defaultMenu: 'subordinateCenterList',
      menus: [
        {
          index: 'cascadeManagement',
          label: '级联管理',
          items: [
            {
              index: 'subordinateCenterCreat',
              title: '新建下级中心'
            },
            {
              index: 'subordinateCenterList',
              title: '下级中心列表'
            },
            {
              index: 'subordinateCenterSearch',
              title: '下级中心查询'
            }
          ]
        }
      ],
      isTreeShow: true
    }
  },
  created() {
  },
  methods: {
    changeTab(index) {
      this.isTreeShow = index === 'subordinateCenterList'
      this.defaultMenu = index
    }
  },
  beforeDestroy() {

  }
}
</script>

<style lang="less" scoped>
.cascade-management-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    height: calc(~'100% - 25px');
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
  .content-center {
    min-width: 290px;
    margin: 3px 8px;
    border: 1px solid #ccc;
    height: calc(~'100% - 30px');
  }
  .content-right {
    width:100%;
    min-width: 1350px;
    height: 100%;
    padding: 5px 0;
    .list,
    .search {
      height: 100%;
    }
  }
}
</style>
