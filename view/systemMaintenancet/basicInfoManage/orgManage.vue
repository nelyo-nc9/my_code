<template>
  <!-- 机构管理 -->
  <div class="org-manage-box">
    <!-- 左侧导航 -->
    <div class="menu-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <el-menu :default-active="defaultMenu" :default-openeds="defaultOpeneds" class="el-menu-vertical-demo" :unique-opened="false" @select="changeTab">
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="val in item.items">
                <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
                <el-submenu v-else :key="val.index" :index="val.index">
                  <template>
                    <p slot="title" @click="changeTab(val.index)">{{val.title}}</p>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-for="v in val.items" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" :key="item.index">
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div @click="isOpenMenu = !isOpenMenu" class="isShow" :style="{left: isOpenMenu? '200px' : '0', transition: 'left .3s'}">
      <i :class="isOpenMenu ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="content-center" v-show="isShowTree">
      <!-- 树组件 -->
      <orgTree ref="tree" :lazyTreeApi="getTreeApi" :lazyTreeSearchApi="getLoadingTreeSearch" searchType="search" @clickData="clickData" treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="content-right">
      <!-- 动态组件 -->
      <component :is="componentId" :statusArr="statusArr" :kindArr="kindArr" :componentTitle="componentTitle" :nodeData="nodeData" :parentData="parentData" :editData="editData" @orgTreeRefresh="orgTreeRefresh" @changeComponent="changeComponent" @defaultComponent="defaultComponents"></component>
    </div>
  </div>
</template>

<script>
import orgTree from '@src/components/tree/treeBox'
import OrgManageList from './orgManage/OrgManageList'
import OrgVindicate from './orgManage/OrgVindicate'
import OrgCreateModify from './orgManage/OrgCreateModify'
import TransferDialog from './orgManage/TransferDialog'
import RankDialog from './orgManage/RankDialog'
import PrintDialog from './orgManage/PrintDialog'
import OrgManageSearch from './orgManage/OrgManageSearch'
import SyncOrg from './orgManage/SyncOrg'
import SyncCreate from './orgManage/SyncCreate'
import SyncRevoke from './orgManage/SyncRevoke'
import SyncMerge from './orgManage/SyncMerge'
import SyncTransfer from './orgManage/SyncTransfer'
import AwaitUpload from './orgManage/AwaitUpload'
import HistoryRecord from './orgManage/HistoryRecord'
import { getTreeApi, getLoadingTreeSearchApi } from '@src/http/basicInfoManage/orgManage.api'
// import { getDataDircColumnListApi } from '@src/http/systemOperationManage/dataDictionary.api.js'
import { queryDataDictBasicInfoApi } from '@src/http/video/videoPlayback.api.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'orgManage',
  components: {
    orgTree,
    OrgManageList,
    OrgVindicate,
    OrgCreateModify,
    TransferDialog,
    RankDialog,
    PrintDialog,
    OrgManageSearch,
    SyncOrg,
    SyncCreate,
    SyncRevoke,
    SyncMerge,
    SyncTransfer,
    AwaitUpload,
    HistoryRecord
  },
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
  },
  data() {
    return {
      isOpenMenu: true, // 左侧导航是否显示
      isShowTree: true, // 中间机构树是否显示
      menus: [
        {
          index: 'OrgManage',
          title: '机构管理',
          items: [
            {
              index: 'OrgVindicate',
              title: '机构维护',
              items: [
                {
                  index: 'SyncCreate',
                  title: '新增机构列表'
                }, {
                  index: 'SyncRevoke',
                  title: '撤销机构列表'
                }, {
                  index: 'SyncMerge',
                  title: '合并机构列表'
                }, {
                  index: 'SyncTransfer',
                  title: '机构迁移列表'
                }, {
                  index: 'AwaitUpload',
                  title: '待上传机构列表'
                }, {
                  index: 'HistoryRecord',
                  title: '历史记录'
                }
              ]
            }, {
              index: 'OrgManageList',
              title: '列表'
            }, {
              index: 'OrgManageSearch',
              title: '查询'
            }
          ]
        }
      ],
      defaultMenu: 'OrgManageList', // 默认导航
      componentId: 'OrgManageList',
      componentKey: '',
      componentTitle: '新建机构',
      nodeData: {}, // 当前树节点信息
      parentData: {}, // 当前树节点的父节点信息
      editData: {}, // 需要编辑的数据
      defaultOpeneds: ['OrgVindicate'],
      kindArr:[],//机构类别
      statusArr:[],//机构状态

    }
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.componentId = this.changComponent
    this.defaultMenu = this.changComponent
    this.getDataDircColumnListApiFn()
  },

  methods: {
     //获取机构状态机构类别列表
    getDataDircColumnListApiFn() {
      let option = {
        queryList:[
          {moduleId: "4", childModuleId: "1", dictId: "1"},
          {moduleId: "4", childModuleId: "1", dictId: "2"},
        ]
      }
      queryDataDictBasicInfoApi(option).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          let { data } = res.data
          data.forEach(item => {
            if (item.dictId === '1') {
              item.attr.forEach(i => {
                this.statusArr.push({
                  label: i.data,
                  value: Number(i.key)
                })
              })
            }else if(item.dictId === '2'){
                item.attr.forEach(i => {
                this.kindArr.push({
                  label: i.data,
                  value: Number(i.key)
                })
              })
            }
          })
        }else{
           if (item.dictId === '1') {
              this.statusArr=[
                {label: '正常营业', value: 1},
                {label: '已撤销', value: 2},
                {label: '已合并', value: 3},
                {label: '临时停业', value: 4}
              ]
            }else if(item.dictId === '2'){
                this.kindArr=[
                  {label: '总行', value: 1},
                  {label: '一级分行', value: 2},
                  {label: '二级分行', value: 3},
                  {label: '县级行', value: 4},
                  {label: '直管行', value: 5},
                ]
            }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.defaultMenu = index
      this.componentId = index
      this.changIndex(index)
      if (index === 'OrgVindicate' || index === 'OrgManageList') {
        this.isShowTree = true
      } else {
        this.isShowTree = false
      }
    },
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu
    },
    changeComponent(index, title, item) {
      this.componentId = index
      this.componentTitle = title
      if (title === '机构管理查询') {
        this.defaultMenu = index
      }
      if (item) {
        this.editData = item
      }
    },
    defaultComponents() {
      this.componentId = this.defaultMenu
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLoadingTreeSearch(params) { // 懒加载树搜索接口
      return getLoadingTreeSearchApi(params)
    },
    onceClick(data, node) {
      console.log(data, 'data')
      console.log(node, 'node')
      this.nodeData = data
      if (node.parent.data) {
        this.parentData.id = node.parent.data.id
        this.parentData.name = node.parent.data.name
        this.parentData.serial = node.parent.data.serial
      }
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
      if (data && data.id && !this.nodeData.id) { // 返回机构树加载根节点信息
        this.nodeData = data
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },
    orgTreeRefresh() { // 机构树刷新
      this.nodeData = {}
      this.parentData = {}
      this.$refs.tree.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 8px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    flex-shrink: 0;
    height: 100%;
    background: #f5f5f5;
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 15px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 9.5px;
    }
  }
  .content-center {
    width: 240px;
    flex-shrink: 0;
    .center-top {
      .el-button {
        width: 100%;
      }
    }
  }
  .content-right {
    flex: 1;
    overflow: hidden;
  }
}
</style>
