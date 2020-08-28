<!--
 * @Author: your name
 * @Date: 2020-06-12 11:17:37
 * @LastEditTime: 2020-06-24 08:45:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement.vue
-->
<template>
<!-- 服务管理 -->
  <div class="service-management-box">
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
    <div class="content-center" v-if="isTreeShow" >
      <!-- 动态组件 -->
      <treeBox  :lazyTreeApi="getTreeApi" @onceClick="onceClick"  searchType="filter" :verifyLastNode="verifyLastNode"  :customizeQuery="keywords" treeLazyToggle iconToggle></treeBox>
    </div>
    <div class="content-right">
      <div class="list" v-if="defaultMenu === 'serviceList'">
        <ServiceManagementList :isSearch="isSearch" :listParam="listParam"></ServiceManagementList>
      </div>
      <div class="search" v-if="defaultMenu === 'serviceSearch'">
        <ServiceManagementSearch></ServiceManagementSearch>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from './Bus'
import treeBox from '@src/components/tree/treeBox'
import ServiceManagementList from './pages/ServiceManagementList.vue'
import ServiceManagementSearch from './pages/ServiceManagementSearch.vue'
import { getServerTreeApi } from '@src/http/systemOperationManage/serviceManagement.api'
export default {
  name: 'serviceManagement',
  components: {
    treeBox,
    ServiceManagementList,
    ServiceManagementSearch
  },
  data() {
    return {
      // 默认导航栏
      isSearch: false,
      defaultMenu: 'serviceList',
      isTreeShow: true,
      listParam: {}, // 服务列表请求参数
      menus: [
        {
          index: 'serviceManagement',
          label: '服务管理',
          items: [
            {
              index: 'serviceList',
              title: '服务列表'
            },
            {
              index: 'serviceSearch',
              title: '服务查询'
            }
          ]
        }
      ],
      // // 自定义懒加载树动态入参
      keywords: {
        keywords: ['oId', 'kId', 'sId']
      },
      // 自定义懒加载树最终节点
      verifyLastNode: {
        endMark: 1
      }
    }
  },
  created() {
  },
  methods: {
    getTreeApi(param) {
      delete param.type
      return getServerTreeApi(param)
    },
    onceClick(data) {
      if (data.hasOwnProperty('endMark')) {
        this.listParam = {
          serverIp: data.ipAddr,
          serverId: data.sId
        }
        this.$nextTick(() => {
          Bus.$emit('isSearch', true)
        })
      } else {
        this.$nextTick(() => {
          Bus.$emit('isSearch', false)
        })
      }
    },
    changeTab(index) {
      this.isTreeShow = index === 'serviceList'
      this.defaultMenu = index
    }
  },
  beforeDestroy() {
    Bus.$off()
  }
}
</script>

<style lang="less" scoped>
.service-management-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    height: calc(~'100% - 21px');
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
    min-width: 280px;
    padding: 4px;
    height: calc(~'100% - 21px');
  }
  .content-right {
    width: 100%;
    min-width: 1380px;
    height: 100%;
    padding: 5px 0;
    .search,
    .list {
      height: 100%;
    }
  }
}
</style>
