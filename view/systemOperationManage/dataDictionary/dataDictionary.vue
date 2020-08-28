<!--
 * @Author: your name
 * @Date: 2020-06-12 11:08:20
 * @LastEditTime: 2020-06-23 08:45:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\dataDictionary.vue
-->
<template>
<!-- 数据字典 -->
  <div class="data-dictionary-box">
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
    <div class="content-center">
      <treeBox :lazyTreeApi="getTreeApi"  treeId="id" treeType="1" @clickNode="clickNode"  :verifyLastNode="verifyLastNode" searchType="filter" treeLazyToggle iconToggle :customizeQuery='keywords'></treeBox>
    </div>
    <div class="content-right">
      <div class="list" v-if="defaultMenu === 'dataDictionaryList'">
        <DataDictionaryList ref="List"></DataDictionaryList>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from './pages/Bus'
import treeBox from '@src/components/tree/treeBox'
import { getLoadingTreeDataDictionary } from '@src/http/systemOperationManage/dataDictionary.api.js'
import DataDictionaryList from './pages/DataDictionaryList.vue'
export default {
  name: 'dataDictionary',
  components: {
    treeBox,
    DataDictionaryList
  },
  data() {
    return {
      paramsData: {},
      // 默认导航栏
      defaultMenu: 'dataDictionaryList',
      menus: [
        {
          index: 'dataDictionary',
          label: '数据字典',
          items: [
            {
              index: 'dataDictionaryList',
              title: '列表'
            }
          ]
        }
      ],
      isTreeShow: true,
      // 自定义懒加载树动态入参
      keywords: {
        keywords: ['id', 'type', 'dictId', 'formPid']
      },
      // 自定义懒加载树最终节点
      verifyLastNode: {
        engMark: 1
      }
    }
  },
  created() {
  },
  methods: {
    changeTab(index) {
      this.isTreeShow = index === 'dataDictionaryList'
      this.defaultMenu = index
    },
    getTreeApi(params) {
      return getLoadingTreeDataDictionary(params)
    },
    clickNode(node) {
      let k = Object.keys(node)
      if (k.length && node.data.isDict === '1') { // 判断是否到了字典节点
        let params = {
          'id': node.data.id,
          'dictId': node.data.dictId,
          'type': '1'
        }
        Bus.$emit('busData', params)
      }
    }
  },
  beforeDestroy() {

  }
}
</script>

<style lang="less" scoped>
.data-dictionary-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    height: calc(~'100% - 24px');
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
    padding-left: 8px;
    height: calc(~'100% - 30px');
  }
  .content-right {
    width:100%;
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
    .list,
    .search {
      height: 100%;
    }
  }
}
</style>
