<template>
<!-- 重点部位 -->
  <div class="emphasis-part-box">
    <!-- 左侧导航 -->
    <div class="menu-left" :style="{width: isOpenMenu ? '200px !important' : '0px', transition: 'width .3s', overflow: 'hidden'}">
      <el-menu :default-active="defaultMenu" class="menu-left-main" :unique-opened="true">
        <template v-for="item in menus">
          <el-submenu v-if="item.items" :index="item.index" :key="item.index">
            <template>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="val in item.items">
                <el-submenu :key="val.index" :index="val.index" v-if="val.type">
                  <template>
                    <span slot="title">{{val.title}}</span>
                  </template>
                  <el-menu-item-group v-if="val.type">
                    <el-menu-item :index="val.index + 'Create'" @click="clickMenu('Create', val)">新建</el-menu-item>
                    <el-menu-item :index="val.index + 'Import'" @click="clickMenu('Import', val)">导入</el-menu-item>
                    <el-menu-item :index="val.index + 'List'" @click="clickMenu('List', val)">列表</el-menu-item>
                    <el-menu-item :index="val.index + 'Search'" @click="clickMenu('Search', val)">查询</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item :key="val.index" :index="val.index" @click="clickMenu(val.index, val)" v-else>{{val.title}}</el-menu-item>
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
    <!-- 中间内容 -->
    <div class="content-center" v-show="isShowTree">
      <!-- 动态组件 -->
      <orgTree ref="tree" :showSlotIcon="showSlotIcon"  :lazyTreeApi="getTreeApi" :lazyTreeSearchApi="getLoadingTreeSearch" @clickData="clickData" searchType="search" treeLazyToggle iconToggle  @rootId="rootId" @onceClick="onceClick">
        <template slot-scope="{data}" v-if="componentId==='AwaitTransferPart' || componentId==='AwaitUploadPart'">
          <el-badge :value="treeKeyPartNum[data.nodeKey]" :max="99" class="tree-badge" v-show="treeKeyPartNum[data.nodeKey]"></el-badge>
        </template>
      </orgTree>
    </div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 动态组件 -->
      <component :is="componentId" :statusList="statusList"  :componentTitle="componentTitle" :nodeData="nodeData" :orgRootId="orgRootId" :key="keyPartType" :keyPartType="keyPartType" :KeyPartDetailsTitle="KeyPartDetailsTitle" :columns="columns" :editData="editData" @orgTreeRefresh="orgTreeRefresh" @changeComponent="changeComponent" @defaultComponent="defaultComponents" ></component>
    </div>
  </div>
</template>

<script>
import orgTree from '@src/components/tree/treeBox'
import Edit from './emphasisPart/Edit'
import Create from './emphasisPart/Create'
import Details from './emphasisPart/Details'
import Import from './emphasisPart/Import'
import List from './emphasisPart/List'
import Search from './emphasisPart/Search'
import RankDialog from './emphasisPart/RankDialog'
import TransferDialog from './emphasisPart/TransferDialog'
import AwaitTransferPart from './emphasisPart/AwaitTransferPart'
import AwaitUploadPart from './emphasisPart/AwaitUploadPart'
import BatchTransferDialog from './emphasisPart/BatchTransferDialog'
import KeyPartDetails from './emphasisPart/KeyPartDetails'
import { getTreeApi, getLoadingTreeSearchApi, getStateListApi } from '@src/http/basicInfoManage/orgManage.api'
// import { getDataDircColumnListApi } from '@src/http/systemOperationManage/dataDictionary.api.js'
import { queryDataDictBasicInfoApi } from '@src/http/video/videoPlayback.api.js'
import { getUploadingOrgApi } from '@src/http/basicInfoManage/keyPart.api'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'emphasisPart',
  components: {
    orgTree,
    Edit,
    Details,
    Create,
    Import,
    List,
    Search,
    RankDialog,
    TransferDialog,
    AwaitTransferPart,
    AwaitUploadPart,
    KeyPartDetails, // 重点部位概览
    BatchTransferDialog // 批量迁移重点部位弹窗
  },
  computed:{
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
  },
  data() {
    return {
      isOpenMenu: true, // 左侧导航是否显示
      isShowTree: true, // 中间机构树是否显示
      menus: [
        {
          index: 'EmphasisPartManage',
          title: '重点部位管理',
          items: [
            {
              index: 'KeyPartDetails',
              title: '重点部位概览'
            }, {
              index: 'SalesNetwork',
              type: 1,
              title: '营业网点'
            }, {
              index: 'CoffersManage',
              type: 2,
              title: '金库管理'
            }, {
              index: 'ComputerManage',
              type: 3,
              title: '计算机房管理'
            }, {
              index: 'OfficeManage',
              type: 4,
              title: '办公楼管理'
            }, {
              index: 'SelfBankManage',
              type: 5,
              title: '自助银行管理'
            }, {
              index: 'SelfEquipmentManage',
              type: 6,
              title: '自助设备管理'
            }, {
              index: 'SelfKioskBank',
              type: 7,
              title: '自助银亭'
            }, {
              index: 'PrivateBankManage',
              type: 8,
              title: '私人银行管理'
            }, {
              index: 'SafekeepingManage',
              type: 9,
              title: '保管箱库管理'
            }, {
              index: 'ArchivesManage',
              type: 10,
              title: '档案库管理'
            }, {
              index: 'RemoteMonitoring',
              type: 11,
              title: '远程监控中心'
            }, {
              index: 'SmartBank',
              type: 12,
              title: '5G+智能银行'
            }, {
              index: 'FortuneCenter',
              type: 13,
              title: '财富中心'
            }, {
              index: 'OtherEmphasisParts',
              type: 14,
              title: '其他重点部位'
            }, {
              index: 'VirtualPart',
              type: 15,
              title: '虚拟部位'
            }, {
              index: 'AwaitTransferPart',
              title: '待迁移部位'
            }, {
              index: 'AwaitUploadPart',
              title: '待上传部位'
            }
          ]
        }
      ],
      defaultMenu: 'KeyPartDetails', // 默认导航
      actionMenu: 'KeyPartDetails', // 当前重点部位类型
      // oid: '1', // 当前树节点的id
      // owerOrgName: '', // 当前树节点名称
      keyPartType: 1, // 重点部位类型
      orgRootId: 0, // 根机构id
      componentId: 'List',
      componentTitle: '营业网点',
      columns: [ // 列表的项
        { prop: 'name', sortable: true, label: '营业网点名称', width: '150', required: true },
        { prop: 'address', sortable: true, label: '营业网点地址', width: '150', required: true },
        { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
        { prop: 'telephone', sortable: true, label: '营业网点电话', width: '120', required: true },
        { prop: 'principal1', sortable: true, label: '营业网点负责人一', width: '150' },
        { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
        { prop: 'principal2', sortable: true, label: '营业网点负责人二', width: '150' },
        { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
        { prop: 'principal3', sortable: true, label: '营业网点安全员一', width: '150' },
        { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
        { prop: 'principal4', sortable: true, label: '营业网点安全员二', width: '150' },
        { prop: 'principalPhone4', sortable: true, label: '移动电话', width: '100' },
        { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
        { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
        { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
        { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
        { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
        { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
        { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
        { prop: 'remark', sortable: true, label: '备注', width: '100' },
        { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
        { prop: 'nearbyKeyPartTypeName', sortable: true, label: '附近自助银行/自助设备', width: '170' },
        { prop: 'nearbyKeyPartName', sortable: true, label: '附近自助银行名称', width: '150' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      nodeData: {}, // 当前树节点信息
      editData: {}, // 需要编辑的数据
      showSlotIcon: true,
      treeKeyPartNum: {}, // 构树上对应nodeKey的重点部位数量
      KeyPartDetailsTitle: '营业网点', // KeyPartDetails组件标题
      statusList:[],
    }
  },
  watch: {
    componentId(oldVal, newVal) {
      if (this.componentId === 'AwaitTransferPart' || this.componentId === 'AwaitUploadPart') {
        this.getTreeKeyPartNum()
      }
    },
    actionMenu(oldVal, newVal) {
      if (oldVal === 'KeyPartDetails' || newVal === 'KeyPartDetails') {
        this.orgTreeRefresh()
      }
    }
  },
  created() {
    this.setMenu(this.menus)
    this.menus = this.newMenu
    this.componentId = this.changComponent
    this.getDataDircColumnListApiFn()
  },
  mounted(){ 
    
  },
  methods: {
     // 获取部位状态列表
    getDataDircColumnListApiFn() {
      let option = {
        queryList:[
          {moduleId: "4", childModuleId: "1", dictId: "3"}
        ]
      }
      queryDataDictBasicInfoApi(option).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          let { data } = res.data
          data.forEach(item => {
            if (item.dictId === '3') {
              item.attr.forEach(i => {
                this.statusList.push({
                  label: i.data,
                  value: Number(i.key)
                })
              })
            }
          })
        }else{
           this.statusList=[
              {label: '正常营业', value: 1},
              {label: '已撤销', value: 2},
              {label: '已合并', value: 3},
              {label: '临时停业', value: 4}
           ]
        }
      }).catch(err => {
        console.log(err)
      })
    },
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index, indexPath) {
      console.log(index, indexPath, 'index--indexPath666666666666666')
      this.defaultMenu = index
    },
    getTreeKeyPartNum() { // 获取机构树上对应nodeKey的重点部位数量
      if (this.componentId === 'AwaitTransferPart') { // 待迁移部位
        let param = {
          type: 5
        }
        getStateListApi(param).then(res => {
          if (res.data.code === 0) {
            this.treeKeyPartNum = {}
            res.data.data.orgList.forEach(item => {
              this.treeKeyPartNum[item.nodeKey] = item.keyPartsCount
            })
          } else {
            console.log(res, '获取机构树上对应nodeKey的重点部位数量失败')
          }
        }).catch(err => {
          console.log(err, '获取机构树上对应nodeKey的重点部位数量失败')
        })
      } else if (this.componentId === 'AwaitUploadPart') { // 待上传部位
        getUploadingOrgApi().then(res => {
          if (res.data.code === 0) {
            this.treeKeyPartNum = {}
            res.data.data.orgList.forEach(item => {
              this.treeKeyPartNum[item.nodeKey] = item.keyPartsCount
            })
          } else {
            console.log(res, '获取机构树上对应nodeKey的重点部位数量失败')
          }
        }).catch(err => {
          console.log(err, '获取机构树上对应nodeKey的重点部位数量失败')
        })
      }
    },
    rootId(val) {
      console.log(val, '根机构id')
      this.orgRootId = val
    },
    clickMenu(val, item) {
      console.log(val, item, 'val--item777777777777777')
      let title = item.title
      this.componentId = val
      this.actionMenu = item.index
      this.componentTitle = title
      this.keyPartType = item.type
      if (val === 'Create' || val === 'Import' || val === 'List' || val === 'Search') {
        this.defaultMenu = item.index + val
      }
      if (val === 'AwaitTransferPart' || val === 'AwaitUploadPart' || val === 'KeyPartDetails') {
        this.isShowTree = true
      } else if (val === 'Create' || val === 'List') {
        this.isShowTree = true
      } else {
        this.isShowTree = false
      }
      this.columns = this.getcolumns(item.type)
    },
    getcolumns(type) {
      let columnsArr = []
      if (type === 2) { // 金库管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '金库名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '金库地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '守护室电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '金库常务副主任', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '金库副主任', width: '150' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 3) { // 计算机房管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '机房名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '机房地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'principal1', sortable: true, label: '机房负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '负责人电话', width: '150' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'telephone', sortable: true, label: '机房值班电话', width: '150', required: true },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 4) { // 办公楼管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '办公楼名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '办公楼地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '值班电话', width: '150', required: true },
          { prop: 'principalPhone2', sortable: true, label: '消防控制室电话', width: '150' },
          { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal1', sortable: true, label: '办公楼联系人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 5) { // 自助银行管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '自助银行名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '自助银行地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '自助银行电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '自助银行负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 6) { // 自助设备管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '自助设备名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '自助设备地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '自助设备电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '自助设备负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 7) { // 自助银亭
        columnsArr = [
          { prop: 'name', sortable: true, label: '自助银亭名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '自助银亭地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '自助银亭电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '自助银亭负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 8) { // 私人银行管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '私人银行名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '私人银行地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '私人银行电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '私人银行负责人一', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '私人银行负责人二', width: '150' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal3', sortable: true, label: '私人银行安全员一', width: '150' },
          { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal4', sortable: true, label: '私人银行安全员一', width: '150' },
          { prop: 'principalPhone4', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'nearbyKeyPartTypeName', sortable: true, label: '附近自助银行/自助设备', width: '170' },
          { prop: 'nearbyKeyPartName', sortable: true, label: '附近自助银行名称', width: '150' },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 9) { // 保管箱库管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '保管箱库名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '保管箱库地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '保管箱库电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '保管箱库负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 10) { // 档案库管理
        columnsArr = [
          { prop: 'name', sortable: true, label: '档案库名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '档案库地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '档案库电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '档案库负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 11) { // 远程监控中心
        columnsArr = [
          { prop: 'name', sortable: true, label: '远程监控中心名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '远程监控中心地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '中心值班电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '远程监控中心负责人', width: '160' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 12) { // 5G+智能银行
        columnsArr = [
          { prop: 'name', sortable: true, label: '5G+智能银行名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '5G+智能银行地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '5G+智能银行电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '5G+智能银行负责人一', width: '170' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '5G+智能银行负责人二', width: '170' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal3', sortable: true, label: '5G+智能银行安全员一', width: '170' },
          { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal4', sortable: true, label: '5G+智能银行安全员二', width: '170' },
          { prop: 'principalPhone4', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'nearbyKeyPartTypeName', sortable: true, label: '附近自助银行/自助设备', width: '170' },
          { prop: 'nearbyKeyPartName', sortable: true, label: '附近自助银行名称', width: '150' },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 13) { // 财富中心
        columnsArr = [
          { prop: 'name', sortable: true, label: '财富中心名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '财富中心地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '财富中心电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '财富中心负责人一', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '财富中心负责人二', width: '150' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal3', sortable: true, label: '财富中心安全员一', width: '150' },
          { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal4', sortable: true, label: '财富中心安全员二', width: '150' },
          { prop: 'principalPhone4', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'nearbyKeyPartTypeName', sortable: true, label: '附近自助银行/自助设备', width: '170' },
          { prop: 'nearbyKeyPartName', sortable: true, label: '附近自助银行名称', width: '150' },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 14) { // 其他重点部位
        columnsArr = [
          { prop: 'name', sortable: true, label: '部位名称', width: '150', required: true },
          { prop: 'type', sortable: true, label: '部位类型', width: '150' },
          { prop: 'address', sortable: true, label: '部位地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '部位电话', width: '150' },
          { prop: 'principal1', sortable: true, label: '部位负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '部位安全员', width: '150' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else if (type === 15) { // 虚拟部位
        columnsArr = [
          { prop: 'name', sortable: true, label: '部位名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '部位地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '部位电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '部位负责人', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      } else { // type === 1营业网点
        columnsArr = [
          { prop: 'name', sortable: true, label: '营业网点名称', width: '150', required: true },
          { prop: 'address', sortable: true, label: '营业网点地址', width: '150', required: true },
          { prop: 'oidName', sortable: true, label: '所属机构', width: '100', required: true },
          { prop: 'telephone', sortable: true, label: '营业网点电话', width: '150', required: true },
          { prop: 'principal1', sortable: true, label: '营业网点负责人一', width: '150' },
          { prop: 'principalPhone1', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal2', sortable: true, label: '营业网点负责人二', width: '150' },
          { prop: 'principalPhone2', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal3', sortable: true, label: '营业网点安全员一', width: '150' },
          { prop: 'principalPhone3', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal4', sortable: true, label: '营业网点安全员二', width: '150' },
          { prop: 'principalPhone4', sortable: true, label: '移动电话', width: '100' },
          { prop: 'principal5', sortable: true, label: '所属机构安保联系人', width: '160' },
          { prop: 'principalPhone5', sortable: true, label: '移动电话', width: '100' },
          { prop: 'policeStation', sortable: true, label: '属地派出所名称', width: '150' },
          { prop: 'policeTelephone', sortable: true, label: '属地派出所电话', width: '130' },
          { prop: 'police', sortable: true, label: '辖区民警姓名', width: '120' },
          { prop: 'policeMobilePhone', sortable: true, label: '移动电话', width: '100' },
          { prop: 'serial', sortable: true, label: '部位代码', width: '100', required: true },
          { prop: 'remark', sortable: true, label: '备注', width: '100' },
          { prop: 'statusName', sortable: true, label: '部位状态', width: '100', required: true },
          { prop: 'nearbyKeyPartTypeName', sortable: true, label: '附近自助银行/自助设备', width: '170' },
          { prop: 'nearbyKeyPartName', sortable: true, label: '附近自助银行名称', width: '150' },
          { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
          { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
          { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
        ]
      }
      return columnsArr
    },
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu
    },
    changeComponent(index, title, item) {
      //切换组件修改title
      this.KeyPartDetailsTitle=title
      console.log(index, title, item, this.defaultMenu, this.actionMenu, 'index--title--item--this.defaultMenu--this.actionMenu--6666666666666666666')
      this.componentId = index
      this.componentTitle = title
      if (index === 'Create' || index === 'Import' || index === 'List' || index === 'Search' || index === 'Details') {
        this.defaultMenu = this.actionMenu + index
      }
      if (item) {
        this.editData = item
      }
    },
    getLocInfo(data, node) { // 从机构树获取重点部位信息
      if (data.tierType === 'loc') {
        // this.columns = this.getcolumns(data.type)
        let typeNameArr = ['', '营业网点', '金库管理', '计算机房管理', '办公楼管理', '自助银行管理', '自助设备管理', '自助银亭', '私人银行管理', '保管箱库管理', '档案库管理', '远程监控中心', '5G+智能银行', '财富中心', '其他重点部位', '虚拟部位']
        this.KeyPartDetailsTitle = typeNameArr[data.type]
        // console.log(this.KeyPartDetailsTitle,3333)
        let cpdata = JSON.parse(JSON.stringify(data))
        let statusArr = ['', '正常', '已撤销', '已合并', '临时停业']
        cpdata.oidName = node.parent.data.name
        cpdata.oidId = node.parent.data.id
        cpdata.oidSerial = node.parent.data.serial
        cpdata.statusName = statusArr[cpdata.status]
        this.editData = cpdata
      } else {
        // console.log(2222)
        // this.columns = this.getcolumns(1)
        this.editData = {}
        this.KeyPartDetailsTitle = '营业网点'
      }
    },
    defaultComponents() {
      this.componentId = this.defaultMenu
    },
    getTreeApi(params) {
      if (this.componentId === 'KeyPartDetails') {
        params.type = 2
      }
      return getTreeApi(params)
    },
    getLoadingTreeSearch(params) { // 懒加载树搜索接口
      params.type=2
      return getLoadingTreeSearchApi(params)
    },
    onceClick(data, node) { // 点击机构树节点
      console.log(node, 'node')
      // this.oid = node.id
      // this.owerOrgName = node.name
      this.nodeData = data
      this.getLocInfo(data, node)
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
      this.editData = {}
      this.KeyPartDetailsTitle = '营业网点'
      this.$refs.tree.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.emphasis-part-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px 8px 0;
  display: flex;
  justify-content: flex-start;
  .menu-left {
    height: 100%;
    flex-shrink: 0;
    background: #F5F5F5;
    .menu-left-main {
      width: 200px;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
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
    border-left: 18px solid #E6E6E6;
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
    flex-shrink: 0;
    width: 240px;
    .tree-badge {
      margin-top: 3px;
    }
  }
  .content-right {
    flex: 1;
    overflow: hidden;
  }
}
</style>
