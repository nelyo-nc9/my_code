 
<template>
  <div class="box">
    <div class="outermost lt">
      <!-- 树形导航栏 -->
      <div class="navigation">
        <!-- 机构树 标题栏 -->
        <div class="tree-title">
          <span>机构</span>
          <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
        </div>
        
        <div class="left-tree">
          <orgTree
           ref="tree"
            :lazyTreeApi="getTreeApi"
            searchType="search"
            treeType="1"
            treeLazyToggle
            iconToggle
            @onceClick="organizeTreeClickHandle"
            :lazyTreeSearchApi="getLazyTreeSearchApi"
            @clickData="clickData"
          >
            <template  slot-scope="{data, node}">
              <!-- <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconEqu(data)"></i>
              <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconEqu(data)"></i>
              <i class="iconfont icon-polling" title="开启轮巡" v-if="iconList.includes('poll') && filterIconEqu(data)"></i>
              <i class="iconfont icon-collection" title="快速收藏" v-if="iconList.includes('collection') && filterIconRes(data)"></i> -->
              <i class="iconfont icon-biaoqian" title="详细信息" v-if="iconList.includes('info')" @click.stop="previewInfo(data, node)"></i>
            </template>
          </orgTree>
        </div>
      </div>

      <!-- 设备详情 -->
      <el-dialog title="设备详情" :visible.sync="infoFlag.dev" width="400px" :close-on-click-modal="false">
        <!-- <iframe v-if="infoFlag.dev"></iframe> -->
        <div class="info-box">
          <div class="left">
            <span>所属子系统</span>
            <span>所属机构</span>
            <span>所属重点部位</span>
            <span>所属设备</span>
            <span>设备品牌</span>
            <span>设备类型</span>
            <span>设备型号</span>
            <span>设备名称</span>
            <span>通道号</span>
            <span>IP地址</span>
            <span>设备ID</span>
            <span>资产编码</span>
            <span>备注</span>
          </div>
          <div class="right">
            <span>{{devInfo.subSystemName}}</span>
            <span>{{devInfo.orgName}}</span>
            <span>{{devInfo.keyPartName}}</span>
            <span>---</span>
            <span>{{devInfo.brand}}</span>
            <span>{{devInfo.type}}</span>
            <span>{{devInfo.modelNum}}</span>
            <span>{{devInfo.name}}</span>
            <span>---</span>
            <span>{{devInfo.ip}} <i @click="pingFunc(devInfo.ip)">ping</i> </span>
            <span>{{devInfo.id}}</span>
            <span>{{devInfo.assetCode}}</span>
            <span>{{devInfo.remark}}</span>
          </div>
        </div>
      </el-dialog>
      <!-- 资源详情 -->
      <el-dialog title="资源详情" :visible.sync="infoFlag.res" width="400px" :close-on-click-modal="false">
        <!-- <iframe v-if="infoFlag.res"></iframe> -->
        <div class="info-box">
          <div class="left">
            <span>所属子系统</span>
            <span>所属机构</span>
            <span>所属重点部位</span>
            <span>所属设备</span>
            <span>设备品牌</span>
            <span>设备类型</span>
            <span>设备型号</span>
            <span>资源名称</span>
            <span>通道号</span>
            <span>IP地址</span>
            <span>设备ID</span>
            <span>资产编码</span>
            <span>备注</span>
          </div>
          <div class="right">
            <span>{{resInfo.subSystemName}}</span>
            <span>{{resInfo.orgName}}</span>
            <span>{{resInfo.keyPartName}}</span>
            <span>{{resInfo.deviceName}}</span>
            <span>{{resInfo.brand}}</span>
            <span>{{resInfo.type}}</span>
            <span>{{resInfo.modelNum}}</span>
            <span>{{resInfo.name}}</span>
            <span>{{resInfo.serise}}</span>
            <span>{{resInfo.ip}} <i @click="pingFunc(resInfo.ip)">ping</i> </span>
            <span>{{resInfo.deviceId}}</span>
            <span>{{resInfo.assetCode}}</span>
            <span>{{resInfo.remark}}</span>
          </div>
        </div>
      </el-dialog>
      <!-- 重点部位详情 -->
      <el-dialog title="重点部位详情" :visible.sync="infoFlag.loc" width="600px" :close-on-click-modal="false">
        <!-- <iframe v-if="infoFlag.loc"></iframe> -->
        <div class="info-box">
          <div class="info-item" v-for="(item,index) in locLabels" :key="item.props + '_' + index">
            <div class="info-key">{{item.label}}</div>
            <div class="info-value">{{locInfo[item.prop] || '---'}}</div>
          </div>
        </div>
      </el-dialog>
      <!-- 机构详情 -->
      <el-dialog title="机构详情" :visible.sync="infoFlag.org" width="600px" :close-on-click-modal="false">
        <!-- <iframe v-if="infoFlag.org"></iframe> -->
        <div class="info-box">
          <div class="info-item" v-for="(item,index) in orgLables" :key="item.props + '_' + index">
            <div class="info-key">{{item.label}}</div>
            <div class="info-value">{{orgInfo[item.prop] || '---'}}</div>
          </div>
        </div>
      </el-dialog>

      <!-- 主页面 -->
      <div class="airlockControl-right">
        <div>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲资源</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="airlock-state">
            <div class="title-num">
              <h4 class="title">共计：{{ audioList.length + mydecveInfoarr.length }}</h4> &nbsp;&nbsp;&nbsp;&nbsp;
              <span class="num">对讲中：{{ onlineQuantity }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span class="title">离线：{{ offlineQuantity }}</span>
            </div>

            <div class="title-num abnormal-state">
              <el-checkbox v-model="isCheck">包含下属机构</el-checkbox>
            </div>

            <div class="switch-btn-wrap">
              <div class="icon-size">
                <i class="el-icon-s-fold icon" @click="skip" v-show="conceal" title="页面切换"></i>
                <i class="el-icon-s-grid" v-show="flag" @click="skpi"></i>
              </div>
            </div>
            
          
          </div>
          <div class="divider"></div>
          <!-- <div class="text">
            <span class="groupname">话筒</span>
          </div> -->
        </div>
        
        <!-- <el-divider></el-divider> -->
        <!-- 点击下拉 -->

        <!-- 表格形式 展现 -->
        <list v-show="listbom" :pageListArr="pageListArr"></list>

        <!-- 面板形式 展现 -->
        <panel v-show="listPop" :audioList="audioList" :mydecveInfo="mydecveInfoarr"></panel>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import {
  getTreeApi,
  getAudioApi,
  getAudiozhuApi,
  postMacGetApi,
  getAccessAudionlStatusApi
} from '@src/http/audio/manyIntercom'
import { getResourceInfoApi, getDeviceInfoApi, getLocOrOrgInfoApi, getStatueNew } from '@src/http/video/videoConfig.api.js'
import { getRuntimeStatue } from '@src/http/audio/resource'
import { fuzzySearchTreeApi } from '@src/http/audioManage/audioTree.api.js'

import panel from './panel'

import List from './List' //点击跳转表格栏
//import listBox from './listBox' //查询下拉框
import orgTree from '@src/components/tree/treeBox'

export default {
  components: {
    List,
    orgTree, //导航栏组件
    panel
  },
  data() {
    return {
      noMac:false,  // 本机是否绑定了  台麦设备   true是 false否
      // pageListArr: [],
      typeInfo:['离线', '空闲', '呼出', '响铃', '对讲中', '广播中'],
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      infoFlag: {
        dev: false,
        res: false,
        loc: false,
        org: false
      },
      resInfo: {},
      devInfo: {},
      locInfo: {},
      locLabels: [],
      orgInfo: {},
      orgLables: [
        { prop: 'name', label: '机构名称' },
        { prop: 'serial', label: '机构编号' },
        { prop: 'kindName', label: '机构类别' },
        { prop: 'telephone', label: '固定电话' },
        { prop: 'functionary', label: '机构负责人' },
        { prop: 'mobile', label: '移动电话' },
        { prop: 'email', label: '电子邮件' },
        { prop: 'address', label: '机构地址' },
        { prop: 'statusName', label: '机构状态' },
        { prop: 'businessHours', label: '开始营业时间' },
        { prop: 'startBusiness', label: '开业日期' },
        { prop: 'closeBusiness', label: '关闭日期' },
        { prop: 'parentName', label: '上级机构名称' },
        { prop: 'parentSerial', label: '上级机构编号' }
      ],

      audionState: {
        total: 0,
        unknowStatus: 0,
        unuseStatus: 0,
        useCount: 0
      },
      // 台麦
      isCheck: true,
      checkData: null,
      // onlineQuantity: 0,  //对讲中设备数量
      mydecveInfoarr: [], // 话筒数据
      audioList: [], // 对讲面板数据
      conceal: true,
      flag: false,
      listbom: false,
      listbox: true,

      listPop: true,
      // 下拉菜单内容
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      
      data: [
        // 导航栏数据
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentComponent: 'headOffice',
      childrenComponent: 'ListB',
      combinationName: 'headOffice-ListB',
      ower_microphone:{},  // 本机绑定的设备
      upStatusTimer:null,  // 设置一个定时器 来定时更新 设备的运行状态(组件销毁时 定时器 需要销毁)

    }
  },
  computed:{
    // 对讲设备数量
    onlineQuantity(){
      var list = this.mydecveInfoarr.concat(this.audioList);
      var num = 0;
      console.log(list)
      list.forEach( (item) => {
        console.log(item.runStatus)
        // runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        if(item.runStatus == 5){
          num++;
        }
      })
      return num;
    },

    // 离线 设备数量
    offlineQuantity(){
      var list = this.mydecveInfoarr.concat(this.audioList);
      var num = 0;
      list.forEach( (item) => {
        // runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
        if(item.runStatus == 1){
          console.log(item)
          num++;
        }
      })
      return num;
    },

    // 话筒 和 面板 总数据列表
    pageListArr(){
      var list = this.mydecveInfoarr.concat(this.audioList);
      return list;
    },
    
    // 正在通话中的 话筒 和 面板
    video_list(){
      return this.mydecveInfoarr.filter( (item) => item.runStatus == 1);
    },
    pan_list(){
      return  this.audioList.filter( (item) => item.runStatus == 1);
    },
  },
  watch: {
    parentComponent(val) {
      // console.log('xxxxxxxxxxxxxxxxxxxxx', val)
    },
    isCheck() {
      // console.log(this.checkData)
      if (this.checkData) this.organizeTreeClickHandle(this.checkData)
    },

    // 监控 话筒数据和 面板 数据，如果当前本机 绑定设备的运行状态更新为非对讲中状态，清除 对讲组号，结束对讲状态
    // mydecveInfoarr(){
    //   var flag1 = this.mydecveInfoarr.some((item) => {
    //     return this.ower_microphone.hostUniqueId == item.uniqueId && item.runStatus != 5;
    //   })
    //   console.log(flag1)
    //   if(flag1){
    //     // 判断对讲结束
    //     // 清除 对讲号
    //     localStorage.setItem('seqId','');
    //   }
    // },
  },
  methods: {

    // 根据本机mac 地址 获取跟本机mac地址进行绑定的设备信息
    macGetmacGet() {
      var _this = this
      var macAddress = sessionStorage.getItem('macAddress')
       console.log(macAddress)
      if (macAddress === 'false') {
        return false
      }
      console.log("macAddress")
      var macs = JSON.parse(macAddress).adaptors
      var macStr = []
      macs.forEach((item) => {
        macStr.push(item.mac)
      })
      console.log('macs', macs, macStr)

      postMacGetApi({
        mac: macStr.join(','),
      }).then(
        (res) => {
        if (res.status == 201 && JSON.stringify(res.data.data) != "{}") {
          // 本机绑定的话筒设备
          var ower_obj = {
             name:globalConfig.hostName,
             status:globalConfig.status,
             runStatus : globalConfig.runStatus,
             serverIp:globalConfig.serverIp,
             serverPort:globalConfig.serverPort,
             hostUniqueId:res.data.data.hostUniqueId,
           };
           _this.ower_microphone = ower_obj;
          }
        },
        (rej) => {
        }
      )
    },

    getAudionState() {
      getAccessAudionlStatusApi({}).then(
        res => {
          // console.log('当前音频状态', res)
          if (res.data.data) {
            res.audionState
          }
        },
        rej => {
          // console.log('当前音频状态 失败', res)
        }
      )
    },
    
    // 设备按钮开关
    filterIconEqu(val) {
      return val.tierType === 'equ'
    },
    // 资源按钮开关
    filterIconRes(val) {
      return val.tierType === 'res'
    },

    // 机构资源树 api
    getTreeApi(params) {
      return getTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 获取树机构根节点
    getTreeApis(params) {
      return getTreeApi(params).then(res=>{
        console.log(res.data)
        this.organizeTreeClickHandle(res.data.data.nodes[0])
      })
    },
    previewInfo(data, node) { // 详情
      let _this = this
      if (data.tierType === 'equ') {
        getDeviceInfoApi(data.id).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.dev = true
            this.devInfo = res.data.data.host
          } else {
            this.infoFlag.dev = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'res') {
        getResourceInfoApi(data.id).then(res => {
          if (res.data.code === 0) {
            _this.infoFlag.res = true
            _this.resInfo = res.data.data
            _this.resInfo.deviceType = _this.deviceType.find(i => i.key === _this.resInfo.deviceType).name
          } else {
            _this.infoFlag.res = false
            _this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'loc') {
        this.locLabels = this.initInfo(data.keyPartType)
        getLocOrOrgInfoApi({
          ids: [data.id],
          type: 2
        }).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.loc = true
            this.locInfo = res.data.data.keyParts[0]
            this.locInfo.status = this.statusCh[this.locInfo.status]
          } else {
            this.infoFlag.loc = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'org') {
         getLocOrOrgInfoApi({
          ids: [data.id],
          type: 1
        }).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.org = true
            this.orgInfo = res.data.data.orgs[0]
            this.orgInfo.status = this.statusCh[this.locInfo.status]
          } else {
            this.infoFlag.org = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    initInfo(type) {
      let infoData = [
        {
          key: 1,
          data: [
            { prop: 'name', label: '营业网点名称' },
            { prop: 'address', label: '营业网点地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '营业网点电话' },
            { prop: 'principal1', label: '营业网点负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '营业网点负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '营业网点安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '营业网点安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
          key: 2,
          data: [
            { prop: 'name', label: '金库名称' },
            { prop: 'address', label: '金库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '守护室电话' },
            { prop: 'principal1', label: '金库常务副主任' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '金库副主任' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 3,
          data: [
            { prop: 'name', label: '机房名称' },
            { prop: 'address', label: '机房地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '机房负责人' },
            { prop: 'principalPhone1', label: '负责人电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'telephone', label: '机房值班电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 4,
          data: [
            { prop: 'name', label: '办公楼名称' },
            { prop: 'address', label: '办公楼地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '值班电话' },
            { prop: 'principalPhone2', label: '消防控制室电话' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal1', label: '办公楼联系人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'updatedBy', label: '录入人' },
            { prop: 'updatedDept', label: '录入机构' },
            { prop: 'updatedAt', label: '录入时间' }
          ]
        }, {
          key: 5,
          data: [
            { prop: 'name', label: '自助银行名称' },
            { prop: 'address', label: '自助银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银行负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 6,
          data: [
            { prop: 'name', label: '自助设备名称' },
            { prop: 'address', label: '自助设备地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助设备负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 7,
          data: [
            { prop: 'name', label: '自助银亭名称' },
            { prop: 'address', label: '自助银亭地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银亭负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 8,
          data: [
            { prop: 'name', label: '私人银行名称' },
            { prop: 'address', label: '私人银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '私人银行电话' },
            { prop: 'principal1', label: '私人银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '私人银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '私人银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '私人银行安全员一' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
          key: 9,
          data: [
            { prop: 'name', label: '保管箱库名称' },
            { prop: 'address', label: '保管箱库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '保管箱库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 10,
          data: [
            { prop: 'name', label: '档案库名称' },
            { prop: 'address', label: '档案库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '档案库电话' },
            { prop: 'principal1', label: '档案库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 11,
          data: [
            { prop: 'name', label: '远程监控中心名称' },
            { prop: 'address', label: '远程监控中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '中心值班电话' },
            { prop: 'principal1', label: '远程监控中心负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 12,
          data: [
            { prop: 'name', label: '5G+智能银行名称' },
            { prop: 'address', label: '5G+智能银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '5G+智能银行电话' },
            { prop: 'principal1', label: '5G+智能银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '5G+智能银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '5G+智能银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '5G+智能银行安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
          key: 13,
          data: [
            { prop: 'name', label: '财富中心名称' },
            { prop: 'address', label: '财富中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '财富中心电话' },
            { prop: 'principal1', label: '财富中心负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '财富中心负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '财富中心安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '财富中心安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
          key: 14,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: '', label: '部位类型' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '部位电话' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '部位安全员' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 15,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' }
          ]
        }
      ]
      return infoData.find(item => item.key === type).data
    },
    pingFunc(ip) { // ping功能
      console.log('ping func', ip)
    },

    // 点击资源树
    onceClick(node) {
    },

    // 下拉菜单事件
    handleNodeClick(e) {},

    organizeTreeClickHandle(res) {
      res.show = false
      var _this = this
      // console.log('02 当前点击的 机构树 --------- ', res)
      _this.checkData = res
      var seqId = localStorage.getItem('seqId')
      if (seqId) {
        this.$message({
          message:'请关闭当前对讲',
          type: 'error'
        })
        return
      }
      if (res.tierType == 'org' || res.tierType == 'equ' || res.tierType == 'loc') {
        var paramesHost = { page: 1, limit: 1000,type:2,rescusive: _this.isCheck }
        var paramesChanel={ page: 1, limit: 1000,type:1,rescusive: _this.isCheck }

        switch (res.tierType) {
          case 'org': // 机构
            paramesHost.orgId = res.id
            paramesChanel.orgId = res.id
            break
          case 'equ': // 设备
            paramesHost.deviceId = res.id
            paramesChanel.deviceId = res.id
            break
          case 'loc': // 重点部位
            paramesHost.keyPartId = res.id
            paramesChanel.keyPartId = res.id
            break
          default:
            break
        }

          // host接口--查询话筒面板数据
          getAudiozhuApi(paramesHost).then(
            res => {
              if (res.data.data) {
                this.mydecveInfoarr = [];
                var list = res.data.data.hosts;
                if(list){
                  list.forEach((item, index) => {
                    item.show = false
                    item.tierType = 'equ'
                    _this.mydecveInfoarr.push(item)
                  })
                }
              } else {
              }
            },
            rej => {}
          )
        //   // 获取重点设备
        // } else if (res.tierType == 'loc' && res.type == 1) {

          // 获取对讲面板数据
          getAudioApi(paramesChanel).then(
            res => {
              if (res.data.data) {
                // console.log('res.tierType', res.data.data.channels)
                this.audioList = []
                res.data.data.channels.forEach((item, index) => {
                  item.show = false
                  _this.audioList.push(item)
                })
                // localStorage.setItem('audioList', JSON.stringify(_this.audioList))
                // console.log('this.audioLis', _this.audioList)
              } else {
                // console.log(res.data.message)
              }
            },
            rej => {}
          )
        // }
      }

      //如果audioList 里面包含的项的 id和res.id相等，或者 不属于设备 则不追加
      let listId = []
      this.audioList.forEach(v => {
        listId.push(v.id)
      })
      
    console.log(res.tierType)

      if (listId.includes(res.id) || res.tierType !== 'res') {
        return
      } else {
        var item = JSON.parse(JSON.stringify(res))
        item.show = false
        this.audioList.push(item)
      }
      // 设定话筒设备名称
    },

    clickData(data) { // 机构树加载节点信息
      // console.log('clickData', data)
      if (data && data.id) { // 返回机构树加载根节点信息
        // this.nodeData = data
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },

     // 刷新  机构树
    refresh() { 
      this.$refs.tree.$refs.lazyTree.refresh();
    },

    //  icon跳转
    skip() {
      // listbox话筒页面   listbom组件页面
      ;(this.listbox = false), (this.listbom = true)
      if (this.listbom == true) {
        this.flag = true
        this.conceal = false
        this.listPop = false
      } else {
        this.flag = false
        this.conceal = true
      }
    },

    skpi() {
      ;(this.listbox = true), (this.listbom = false)
      if (this.listbom == false) {
        this.flag = false
        this.conceal = true
        this.listPop = true
      } else {
        this.flag = true
        this.conceal = false
      }
    },

    
    ...mapActions('resource', {})
  },
  created() {
    // 获取机构树的根节点并初始化话筒和对讲面板数据
    this.getTreeApis({type:0})
    this.macGetmacGet();
  },
  mounted() {
    
  },
  beforeDestroy(){

  },
  
}
</script>

<style lang="less" scoped>
.now-state {
  display: flex;
  width: 100%;
  height: 13px;
  align-items: center;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 12px;
  .sign {
     height: 12px;
    width: 2px;
    background: #2d72d3;
    margin-right: 5px;
  }
  .state {
    margin-right: 20px;
    /deep/ .el-checkbox__label {
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
    }
  }
}
.box {
  // width: 1848px;
  .outermost {
    display: flex;
    width: 100%;
    .navigation {
      width:300px;
     background: #FFF; 
     height: 100vh;
     border: 1px solid #DCDFE6; 
     -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04); 
     box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04); 
     min-width: 300px;
     
      .inp {
        margin: 10px;
        width: 85%;
        /deep/ .el-input__inner {
          border-radius: 0px;
        }
      }
      .tree-title{
        display: inline-block;
        width: 100%;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: #f5f5f5;
        color: #333;
        font-size: 14px;
        margin-bottom: 14px;
        font-weight: 400;
        position: relative;
      }
      .refresh{
        position: absolute;
        top: 0px;
        right: 7px;
        z-index: 2;
        cursor: pointer;
      }
    }
    .airlockControl-right {
      // width:  calc(100vh - 100px);、
      flex: 1;
      padding: 23px 20px 32px;
    }
    .airlock-state {
      margin: 20px 0 0 0;
      font-size: 12px;
      display: flex;
      position: relative;
      line-height: 35px;
      .title-num {
        display: flex;
        margin-right: 30px;
        /deep/.el-checkbox__label{
          font-size: 12px;
        }
      }
      .abnormal-state {
        font-weight: 600;
      }
      .switch-btn-wrap{
        position: absolute;
        right:10px;
        bottom:-17px;
        padding:0 15px;
        background-color: #FFF;
      }
      .icon-size {
        font-size: 26px;
        width:37px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        cursor: pointer;
        border: 1px solid #9EADC1;
        border-radius:3px;
      }
      .pop-up {
        font-size: 40px;
        margin-left: 10px;
        margin-top: -20px;
        cursor: pointer;
      }
      .listModule {
        // margin-top: -10px;
        font-size: 25px;
        // margin-left: 10px;
        width:37px;
        height: 35px;
        // text-align: center;
        // line-height: 35px;
        border: 1px solid #9EADC1;
      }
    }
    .title-h2 {
      margin-top: 10px;
    }
  }
}

.lt {
  display: flex;
}
.text {
  height: 35px;
  // margin-top: 34px;
  .groupname {
    height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    border-left: 2px solid #2d72d3;
    padding-left: 3px;
    padding-right: 12px;
    font-size: 12px;
    font-weight: 500;
  }
}
.divider {
  width: 1564px;
  height: 1px;
  background: rgba(225, 225, 225, 1);
  margin-top: 1px;
}

// 设备详情 弹窗
.info-box {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    .left {
      width: 150px;
      height: 100%;
      border-right: 1px solid #ddd;
      span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        color: #ccc;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrapx;
        overflow: hidden;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        color: #333;
        text-indent: 20px;
        text-overflow: ellipsis;
        white-space: nowrapx;
        overflow: hidden;
        i {
          color: #409eff;
          cursor: pointer;
          margin-left: 15px;
        }
      }
    }
    .info-item {
      width: 50%;
      height: 40px;
      line-height: 40px;
      display: flex;
      .info-key {
        width: 120px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space:nowrap;
      }
      .info-value {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space:nowrap;
      }
    }
  }
</style>
