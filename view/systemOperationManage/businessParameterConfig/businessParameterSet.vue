<!--
 * @Author: your name
 * @Date: 2020-07-09 09:17:44
 * @LastEditTime: 2020-07-09 15:45:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\businessParameterConfig\businessParameterSet.vue
-->
<template>
<!-- 业务参数配置 -->
  <div class="business-parameter-box">
    <!-- <div class="menu-left">
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
    </div> -->
     <!-- 中间内容 -->
    <div class="content-center">
      <treeBox :lazyTreeApi="getTreeApi"  treeId="id" @clickNode="clickNode"  :verifyLastNode="verifyLastNode" searchType="filter" treeLazyToggle iconToggle :customizeQuery='keywords'></treeBox>
    </div>
    <div class="content-right">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统维护</el-breadcrumb-item>
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>业务参数配置</el-breadcrumb-item>
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="list" v-show="defaultMenu === 'list'">
        <BusinessParameterSetList @changeMenu="changeMenu" :disabled="disabled" ref="List"></BusinessParameterSetList>
      </div>
      <div class="list" v-show="defaultMenu === 'creat'">
        <BusinessParameterCreat :isSdkShow="isSdkShow" :sdkId="sdkId" :nodeName="nodeName" @changeMenu="changeMenu" ref="creat"></BusinessParameterCreat>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from './pages/Bus'
import treeBox from '@src/components/tree/treeBox'
import { getLoadingTreeDataDictionary } from '@src/http/systemOperationManage/dataDictionary.api.js'
import BusinessParameterSetList from './pages/BusinessParameterSetList.vue'
import BusinessParameterCreat from './pages/BusinessParameterCreat.vue'
export default {
  name: 'businessParameterSet',
  components: {
    treeBox,
    BusinessParameterSetList,
    BusinessParameterCreat
  },
  data() {
    return {
      title: '列表',
      defaultMenu: 'list',
      disabled: true, // 列表页是否可操作
      // 自定义懒加载树动态入参
      keywords: {
        keywords: ['id']
      },
      // 自定义懒加载树最终节点
      verifyLastNode: {
        engMark: '1'
      },
      nodeName: '',
      isSdkShow: false,
      sdkId: ''
    }
  },
  created() {
  },
  methods: {
    getTreeApi(params) {
      if (params.hasOwnProperty('type')) {
        delete params.type
      }
      return getLoadingTreeDataDictionary(params)
    },
    clickNode(node) {
      let k = Object.keys(node)
      if (k.length && node.data.isDict === '1') {
        let params = {
          'id': node.data.id,
          'dictId': node.data.dictId,
          'type': '2'
        }
        this.disabled = false
        this.defaultMenu = 'list'
        Bus.$emit('busData', params)
        this.nodeName = node.data.name
      } else {
        this.disabled = true
      }
      if (k.length && node.data.isSdkHtml === '1') {
        this.sdkId = node.data.id
        this.isSdkShow = true
      } else {
        this.isSdkShow = false
      }
    },
    changeMenu(menu) {
      if (menu === 'edit') {
        this.title = '编辑'
        this.defaultMenu = 'creat'
        return
      } else if (menu === 'creat') {
        this.title = '新建'
      } else {
        this.title = '列表'
      }
      this.defaultMenu = menu
    }
  },
  beforeDestroy() {

  }
}
</script>

<style lang="less" scoped>
.business-parameter-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  // .menu-left {
  //   height: 100%;
  //   width: 200px;
  //   padding: 5px 0px 0px 5px;
  //   .arrow {
  //     font-size: 14px;
  //     text-align: right;
  //     i {
  //       cursor: pointer;
  //       &:hover {
  //         color: #538bda;
  //       }
  //     }
  //   }
  //   .el-menu-vertical-demo {
  //     width: 200px;
  //   }
  //   /deep/ .el-menu {
  //     border-right: none;
  //     background-color: transparent;
  //   }
  //   /deep/ .el-menu-item-group__title {
  //     padding: 0;
  //   }
  // }
  .content-center {
    min-width: 280px;
    padding-left: 8px;
    height: calc(~'100% - 30px');
  }
  .content-right {
    width:100%;
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
    .directory {
      padding-bottom: 5px;
      overflow: hidden;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .list,
    .search {
      height: 100%;
    }
  }
}
</style>
