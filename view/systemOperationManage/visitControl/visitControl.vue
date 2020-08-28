<!--
 * @Author: your name
 * @Date: 2020-06-12 11:17:37
 * @LastEditTime: 2020-06-13 14:34:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement.vue
-->
<template>
  <!-- 访问控制 -->
  <div class="visit-control-box">
    <div class="menu-left">
      <el-menu
        :default-active="defaultMenu"
        class="el-menu-vertical-demo"
        :unique-opened="false"
        @select="changeTab"
      >
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
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <!-- 中间内容 -->
    <div class="content-center">
      <!-- 动态组件 -->
      <treeBox :lazyTreeApi="getTreeApi" :customizeQuery="customizeQuery" :treeType="treeType" @clickNode="clickNode"   searchType="filter" treeLazyToggle iconToggle></treeBox>
    </div>
    <div class="content-right">
      <component :is="defaultMenu" @clear="clearForm" :info="queryInfo" :params="cParams"></component>
    </div>
  </div>
</template>
<script>
import treeBox from '@src/components/tree/treeBox'
import { orgResourceTree, queryVisitCtrlInfoApi } from '../../../http/systemOperationManage/visitControl.api'
import equipmentVisitPathControl from './pages/equipmentVisitPathControl.vue'
export default {
  name: 'visitControl',
  components: {
    treeBox,
    equipmentVisitPathControl
  },
  data() {
    return {
      queryInfo: {},
      cParams: {},
      params: {
        orgId: '',
        OrgName: '',
        keyPartId: '',
        KeyPart: '',
        deviceName: '',
        deviceId: ''
      },
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      orgId: '',
      treeType: 1, // 树类型
      // 默认导航栏
      defaultMenu: 'equipmentVisitPathControl',
      menus: [
        {
          index: 'visitPathControl',
          title: '访问控制',
          items: [
            {
              index: 'equipmentVisitPathControl',
              title: '设备访问路数设置'
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
    },
    queryVisitCtrlInfoApiFuc(params, type) {
      console.log(params)
      let param = {
      }
      if (type === 'org') {
        param = {
          orgId: this.orgId
        }
      } else if (type === 'loc') {
        param = {
          orgId: this.orgId,
          keyPartId: params.data.id
        }
      } else if (type === 'equ') {
        param = {
          orgId: this.orgId,
          keyPartId: params.parent.data.id,
          deviceId: params.data.id
        }
      }
      queryVisitCtrlInfoApi(param).then(res => {
        if (res.data.code === 0) {
          this.queryInfo = JSON.parse(JSON.stringify(res.data.data))
        } else {
          this.queryInfo = {}
        }
      })
        .catch(err => {
          this.queryInfo = {}
          console.log(err)
        })
    },
    getTreeApi(params) {
      return orgResourceTree(params)
    },
    clickNode(node) {
      if (node && node.data && node.data.serial && node.data.tierType === 'org') {
        this.params = {}
        this.orgId = node.data.id
        this.params = {
          orgId: this.orgId,
          OrgName: node.data.name,
          isOrg: true
        }
        this.cParams = JSON.parse(JSON.stringify(this.params))
        this.queryVisitCtrlInfoApiFuc(node, 'org')
      }
      if (node && node.data && node.data.tierType === 'loc') {
        this.orgId = node.parent.data.id
        this.params = {
          isOrg: false,
          orgId: this.orgId,
          OrgName: node.parent.data.name,
          keyPartId: node.data.id,
          KeyPart: node.data.name
        }
        this.cParams = JSON.parse(JSON.stringify(this.params))
        this.queryVisitCtrlInfoApiFuc(node, 'loc')
      } else if (node && node.data && node.data.tierType === 'equ') {
        this.orgId = node.parent.parent.data.id
        this.params = {
          isOrg: false,
          orgId: this.orgId = node.parent.parent.data.id,
          OrgName: node.parent.parent.data.name,
          keyPartId: node.parent.data.id,
          KeyPart: node.parent.data.name,
          deviceName: node.data.name,
          deviceId: node.data.id
        }
        this.cParams = JSON.parse(JSON.stringify(this.params))
        this.queryVisitCtrlInfoApiFuc(node, 'equ')
      }
    },
    clearForm() {
      this.params = {
        orgId: '',
        OrgName: '',
        keyPartId: '',
        KeyPart: '',
        deviceName: '',
        deviceId: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.visit-control-box {
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
  .content-center {
    width: 280px;
    height: 100%;
  }
  .content-right {
    min-width: 1400px;
    height: 100%;
    padding: 5px 0;
  }
}
</style>
