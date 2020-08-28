<template>
  <div class="playBackPage">
    <div class="middle">
      <playBackPlugin
        ref="pluginP"
        :iconShow="iconShowParams"
        :defaultPane="defaultPane"
        :isCenterP="isCenter"
        :channelName="currentSelectObj.name"
      ></playBackPlugin>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import playBackPlugin from './playBackPlugin/playBackPlugin'
import Calendar from './playBackPlugin/BScalendar'
import BStimePicker from './playBackPlugin/BStimePicker'
import VideoPagination from './components/VideoPagination'
import treeBox from '@src/components/tree/treeBox'
import favoriteDialog from './components/favoriteDialog'
import collectTree from '@src/components/collectTree'
import { getTreeApi, getLazyTreeApi, getCollectList, postCollect } from '@src/http/video/videoPreview.api.js'
import {
  getQianDuanList,
  byteConversion,
  formatRecordType,
  formatSpendTime,
  downloadDev
} from './playBackPlugin/playback.js'

export default {
  name: 'plugin',
  components: {
    playBackPlugin,
    Calendar,
    BStimePicker,
    VideoPagination,
    treeBox,
    favoriteDialog,
    collectTree
  },
  data() {
    return {
      path:this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download',
      defaultPane:6,
      //nodeKeysList:[],
      customizeQuery: {
        params: {
          isRecursion: 1,
          subSystem: 1,
          channelType: 1
        }
      },
      timeVal: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(), // 默认的时间
      value: 'all', // 默认录像的选择类型
      videoTypeList: [
        { value: 'all', label: '全部' },
        { value: 'manualRecord', label: '手工录像' },
        { value: 'timeRecord', label: '定时录像' },
        { value: 'event', label: '事件录像' },
        { value: 'recordFlag', label: '智能录像' }
      ], // 录像可选择的类型
      iconShowParams: [
        {
          type: 'left',
          index: 4,
          name: 'PlaySpeed'
        },
        {
          type: 'left',
          index: 3,
          name: 'ZhuZhen'
        },
        { type: 'left', index: 6, name: 'Attention' },
        {
          type: 'left',
          index: 0,
          name: 'Play'
        },
        {
          type: 'left',
          index: 7,
          name: 'Volume'
        },
        {
          type: 'left',
          index: 1,
          name: 'Stop'
        },
        {
          type: 'left',
          index: 2,
          name: 'StopAll'
        },
        // {
        //   type: 'left',
        //   index: 0,
        //   slotName: 'Screen01',
        //   width: 0
        // },
        // {
        //   type: 'right',
        //   index: 7,
        //   name: 'SplitMode'
        // },
        {
          type: 'right',
          index: 6,
          name: 'CutDownload'
        },
        {
          type: 'right',
          index: 4,
          name: 'NiaoKan'
        },
        {
          type: 'right',
          index: 3,
          name: 'TVWall'
        },
        {
          type: 'right',
          index: 5,
          name: 'ScreenShot'
        },
        // {
        //   type: 'right',
        //   index: 5,
        //   name: 'Download'
        // },
        // {
        //   type: 'right',
        //   slotName: 'Screen01',
        //   width: 0,
        //   index: 3
        // },
        {
          type: 'right',
          name: 'ScreenMode',
          index: 2
        },
        // {
        //   type: 'right',
        //   name: 'MultiScreen',
        //   index: 1
        // },
        {
          type: 'right',
          index: 0,
          name: 'FullScreen'
        },
        {
          type: 'left',
          index: 5,
          name: 'Rewind'
        }
      ], // 需要配置的底部按钮数组
      isSync: false, // 是同步还是异步   true:同步  false:异步
      activeName: 'first', // 默认选中的tab
      rightWidth: 300, // 右侧的布局的宽度
      columnsBottom: [
        { prop: 'startTime', label: '开始时间', width: '100px' },
        { prop: 'timeLang', label: '时长', width: '' },
        { prop: 'fileSize', label: '大小', width: '' },
        { prop: 'fileType', label: '类型', width: '' }
      ], // 前端数据获取的数据列表类型
      dateVal: new Date(), // 选中的日期时间
      isCenter: false, //   false：前端回放   true：中心回放
      qianDuanList: [], // 前端列表
      rangeTime: {
        startDate: new Date(),
        endDate: new Date()
      }, // 当为前端设备时，选择的时间范围
      showList: false, // 是否显示前端时间列表
      calenderObj: {}, // 日历请求的对象
      isShowCheckBox: false, // 是否显示机构树的复选框
      currentPageObj: {
        limit: 100,
        page: 1
      },
      downListData: JSON.parse(window.localStorage.getItem('downListDataArr')) || [], // 查询条件的table数据
      openselectFav: false, // 显示收藏夹对话框
      currentParentNode: {},
      currentSelectObj:{
        name:''
      },
      paginationTotal: 0, //列表项总数
    }
  },
  watch: {
    isSync() {
      this.isShowCheckBox = this.isSync
    }
  },
  computed: {
    isSameType() {
      let countCenter = 0
      let countQianduan = 0
      //let curnodeKey = this.currentSelectObj.nodekey
      var arr = this.$refs.treeDiv.getCheckedNodes(true, true)
      console.log(arr,'arr')
      arr.forEach(item => {
        //this.nodeKeysList.push(item.nodeKey)
        let curNode = this.$refs.treeDiv.getNode(item.nodeKey)
        //前端设备
        if (curNode.parent.type == 1) {
          countQianduan++
        }else{
          //中心设备
          countCenter++
        }
      })
      console.log(countQianduan," ||| ",countCenter)
      //如果前端和中心设备都选中了，同步情况下不能同时开流
      if(countCenter&&countQianduan){
        this.$message({
          message: '同步播放时中心回放或前端回放不能共存,请重新勾选',
          type: 'warning'
        })
        //this.nodeKeysList.splice(this.nodeKeysList.indexOf(curnodeKey),1)
        return false
      } 
      return true
    }
  },
  methods: {
    getCollectApi(params) {
      return getCollectList(params)
    },
    postCollectApi(params) {
      return postCollect(params)
    },
    pageChangeResult(obj) {
      console.log(obj, 'ooooooo22')
      this.currentPageObj = obj
      this.searchData()
    },
    // 机构和收藏夹切换响应事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 机构树 懒加载获取
    getTree(params) {
      return getLazyTreeApi(params)
    },
    // 机构树 递归获取
    lazyTreeCheckApi(params) {
      return getTreeApi(params)
    },
    // 刷新树
    async refresh() {
      let status = await this.$refs.treeDiv.refresh()
      if (status === 1) {
        this.$message('刷新成功')
      } else {
        this.$message('列表刷新失败')
      }
    },
    // 设备收藏图标点击事件
    collectIconHandler(data) {
      // TODO 收藏设备
      this.openselectFav = true

      console.log('收藏设备 -------------- ', data)
    },
    // 关闭收藏设备对话框
    closeselectFav() {
      this.openselectFav = false
    },
    // 点击获取节点信息
    playBackGetData(data, node) {
      console.log(data,'--my curNode data--')
      console.log(data)
      this.currentSelectObj = data
      if (data.tierType === 'res') {
        let parentData = node.parent.data
        this.currentParentNode = {
          devIp: parentData.ip,
          devPort: parentData.cPort,
          type: parentData.type
        }
        console.log('--currentParentNode--')
        console.log(this.currentParentNode)
        this.isCenter = parentData.type !== 1
      }
      if (data.tierType === 'equ' || data.tierType === 'res') {
        // let temoP = {
        //   chan: 1,
        //   eid: {
        //     ip: '192.168.7.111',
        //     cport: 34567
        //   }
        // }
        let temoP = {
          channel: data.channel, //通道号
          ip: data.ip, //通道ip
        }
        this.calenderObj = temoP
      }
    },
    //双击节点开流
    async doubleOpenplayBack(data, node){
      console.log(data,'===双击数据==')
      this.currentSelectObj = data
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      if (data.tierType === 'res') {
        //var womod = this.checkedPane //如果需求改成需要在焦点窗口开流，就加这一条
        let parentData = node.parent.data
        let objOpen = {
          channel: Number(data.channel),
          devIp: parentData.ip,
          devPort: parentData.cPort,
          endTime: parseInt(Date.parse(new Date()) / 1000),
          startTime: parseInt(new Date().setHours(0,0,0) / 1000),
          streamConnPort: data.dPort,
          streamType: data.streamType || 'main'
        }
        let resOpen
        try {
          resOpen = await axios.post('/record/frontdevPlayBack', objOpen) // 回放录像查询
        } catch (error) {
          return {}
        }
        var getD = resOpen.data
        let obj = {
          TsIp: getD.TsIp,
          TsPort: getD.TsPort,
          streamId: getD.streamId
        }
        //中心设备
        if(parentData.type !== 1){
          // let obj = {
          //   TsIp: "192.168.110.107",
          //   TsPort: 6051,
          //   streamId: "1978081343043"
          // }
          let param = {
            recordType:'all',
            devIp: parentData.ip, // VMR通道
            devPort: parentData.cPort,//设备端口，
            channel: Number(data.channel),//设备通道
            eventType:['all'],
            startTime: parseInt(new Date().setHours(0,0,0) / 1000),//开始时间是当前日期0点
            endTime: parseInt(Date.parse(new Date()) / 1000),//结束时间
            streamType:data.streamType,//码流类型（main,sub,）
            rows: this.currentPageObj.limit,
            page: this.currentPageObj.page,
            result: obj,
            isCenter: true,
            channelName: data.name
          }
          console.log(param, 'centerparam')
          this.$refs.pluginP.openPlayback([param])
        }else{
          //前端设备
          console.log(obj,'==我的前端设备==')
          // let obj = {
          //   TsIp: "192.168.110.107",
          //   TsPort: 6051,
          //   streamId: "1978081343043"
          // }
          obj.result = {TsIp:obj.TsIp}
          let param = {
            channel: Number(data.channel),
            dPort: parentData.dPort,
            devIp: parentData.ip,
            devPort: parentData.cPort,
            eTime: parseInt(Date.parse(new Date()) / 1000),
            isCenter: false,
            recordType: ['all'],
            result: obj,
            sTime: parseInt(new Date().setHours(0,0,0) / 1000),
            streamType: data.streamType,
            channelName: data.name
          }
          console.log(param, 'qianduanparam')
          this.$refs.pluginP.openPlayback([param])
        }
      }
      //this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
    },
    // 机构树复选框勾选
    checkclick(data, node, status) {
    },
    // 右侧开关
    backRightTime(n) {
      this.$refs.pluginP.clickResize()
      if (n === 0) {
        this.rightWidth = 0
      } else {
        this.rightWidth = 300
      }
    },
    // 前端播放时候时间插件范围选择
    daterange(range) {
      // 时间插件前端回放时候的范围选择
      this.rangeTime = range
      console.log(this.rangeTime,'时间范围')
    },
    // 中心回放时候的单击选择
    // clicktest(date) {
    //   this.dateVal = date
    //   var curColor = this.$refs.calender.getShowClass(date)
    //   if (!curColor) {
    //     console.log('暂无录像段') 
    //   } else {
    //   }
    // },
    // 时间组件时间改变
    timeChange(val) {
      if (typeof val === 'object') {
        this.timeVal = val
      } else {
        const t = val.split(':')
        const date = new Date()
        date.setHours(t[0] || 0)
        date.setMinutes(t[1] || 0)
        date.setSeconds(t[2] || 0)
        this.timeVal = date
      }
    },
    // 点击检索按钮
    searchData() {
      //异步时，不出现复选框，机构树有焦点
      //同步时，勾选复训框，机构树无焦点
      //TODO: 异步ipc设备
      if (
        (!this.isShowCheckBox && (!this.currentSelectObj || this.currentSelectObj.tierType !== 'res'))
        ||
        (this.isShowCheckBox && (this.$refs.treeDiv.getCheckedNodes(true, true).some(item => item.tierType === 'res')) === false)
      ) {
        this.$messageError('请选择一个通道')
        return
      }
      // if (!this.isCenter) {
      //   this.$refs.pluginP.stopBackALL()
      // }
      //如果是同步回放，只允许同一回放流程（中心回放或前端回放）
      if(this.isSync){
        if(!this.isSameType){
          console.log('!this.isSameType')
          // this.$refs.treeDiv.refresh()
          // thid.$refs.treeDiv.setCheckedNodes(this.nodeKeysList)
          return
        }
      }
      let _this = this
      setTimeout(() => {
        if (!this.isShowCheckBox) {
          this.showList = true
        } else {
          this.showList = false
        }
        this.qianDuanList = []
        // var arr = this.$refs.treeDiv.getCheckedNodes(true, true)
        // console.log('--叶子节点--')
        // console.log(arr)
        var arrNotCenter = []
        var arrCenter = []
        // arr.forEach(item => {
        //   let curNode = this.$refs.treeDiv.getNode(item.nodeKey)
        //   if (item.type == 1) {
        //     //前端设备
        //     let obj = {
        //       // recordType: 'all',
        //       rowId: 1,
        //       rowCount: 5,
        //       sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
        //       eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
        //       streamType: item.streamType,
        //       channel: item.channel,
        //       devIp: curNode.parent.data.ip,
        //       devPort: curNode.parent.data.cPort,
        //       rows: this.currentPageObj.limit,
        //       page: this.currentPageObj.page,
        //       isCenter: false
        //     }
        //     arrNotCenter.push(obj)
        //   } else {
        //     //中心设备
        //     let obj = {
        //       name: item.name,
        //       channel: item.channel,
        //       devIp: curNode.parent.data.ip,
        //       eventType: ['all'],
        //       streamType: item.streamType,
        //       devPort: curNode.parent.data.cPort,
        //       typeName: '',
        //       typeContent: '',
        //       startTime: Date.parse(this.dateVal) / 1000,
        //       endTime: Date.parse(this.dateVal) / 1000,
        //       rows: this.currentPageObj.limit,
        //       page: this.currentPageObj.page,
        //       isCenter: true
        //     }
        //     arrCenter.push(obj)
        //   }
        // })
        // console.log('--前端--')
        // console.log(arrNotCenter)
        // console.log('--中心--')
        // console.log(arrCenter)
        // var arrNotCenter = [
        // {
        //   recordType: 'all',
        //   rowId: 1,
        //   rowCount: 5,
        //   sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
        //   eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
        //   streamType: 'main',
        //   channel: 1,
        //   devIp: '192.168.14.190',
        //   devPort: 8000,
        //   isCenter: this.isCenter
        // },
        // {
        //   recordType: 'all',
        //   rowId: 1,
        //   rowCount: 5,
        //   sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
        //   eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
        //   streamType: 'main',
        //   channel: 1,
        //   devIp: '192.168.14.190',
        //   devPort: 8000,
        //   isCenter: this.isCenter
        // }
        // ]
        // var arrCenter = [
        //   {
        //     name: '711',
        //     channel: 1,
        //     devIp: '192.168.14.147',
        //     eventType: ['all'],
        //     streamType: 'all',
        //     devPort: 8000,
        //     typeName: '',
        //     typeContent: '',
        //     startTime: Date.parse(this.dateVal) / 1000,
        //     endTime: Date.parse(this.dateVal) / 1000,
        //     rows: this.currentPageObj.limit,
        //     page: this.currentPageObj.page
        //   },
        //   {
        //     name: '711',
        //     channel: 1,
        //     streamType: 'all',
        //     devIp: '192.168.7.111',
        //     eventType: ['all'],
        //     devPort: 34567,
        //     typeName: '',
        //     typeContent: '',
        //     startTime: Date.parse(this.dateVal) / 1000,
        //     endTime: Date.parse(this.dateVal) / 1000,
        //     rows: this.currentPageObj.limit,
        //     page: this.currentPageObj.page
        //   }
        // ]
        //同步回放
        if (this.isShowCheckBox) {
          // 出现复选框时，getCheckedNodes()才可选择到节点信息
          var arr = this.$refs.treeDiv.getCheckedNodes(true, true)
          console.log(arr,'--叶子节点--')
          var arrNotCenter = []
          var arrCenter = []
          arr.forEach(item => {
            let curNode = this.$refs.treeDiv.getNode(item.nodeKey)
            if (curNode.parent.data.type == 1) {
              // 前端设备
              //console.log()
              let obj = {
                recordType: 'all',
                rowId: 1,
                rowCount: 5,
                sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
                eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
                streamType: item.streamType,
                channel: Number(item.channel),
                devIp: curNode.parent.data.ip,
                devPort: curNode.parent.data.cPort,
                rows: this.currentPageObj.limit,
                page: this.currentPageObj.page,
                isCenter: false,
                name: item.name
              }
              arrNotCenter.push(obj)
              console.log(arrNotCenter,'arrNotCenter111')
            } else {
              // 中心设备
              let obj = {
                recordType:'all',
                name: item.name,
                channel: Number(item.channel),
                devIp: curNode.parent.data.ip,
                eventType: ['all'],
                streamType: item.streamType,
                devPort: curNode.parent.data.cPort,
                typeName: '',
                typeContent: '',
                startTime: Date.parse(this.dateVal) / 1000,
                endTime: Date.parse(this.dateVal) / 1000,
                rows: this.currentPageObj.limit,
                page: this.currentPageObj.page,
                isCenter: true,
                name: item.name
              }
              arrCenter.push(obj)
            }
          })

          if (this.isCenter) {
            console.log('index 111 center')
            // 同步中心回放
            // if (this.currentSelectObj.tierType == 'equ' || this.currentSelectObj.tierType == 'res') {
            // 中心需要查询有没有录像段
            this.dateVal.setHours(this.timeVal.getHours())
            this.dateVal.setMinutes(this.timeVal.getMinutes())
            this.dateVal.setSeconds(this.timeVal.getSeconds())
            if (this.dateVal.getTime() > new Date().getTime()) {
              this.$message('精确时间不能超过当前时间！')
              return
            }
            let newEndTime
            const _date = new Date(this.dateVal)
            _date.setHours(23)
            _date.setMinutes(59)
            _date.setSeconds(59)
            newEndTime = parseInt(_date.getTime() / 1000)
            var sendArr = []
            arrCenter.forEach((v, i) => {
              var param = v
              param.startTime = Date.parse(this.dateVal) / 1000
              param.endTime = newEndTime
              sendArr.push(param)
            })
            console.log(sendArr,'同步中心参数') 
            this.$refs.pluginP.openPlayback(sendArr)
          } else {
            // 同步前端回放不需要查询录像段
            if (!this.rangeTime.startDate || !this.rangeTime.endDate) {
              this.$message('请选择日期范围')
              return
            }
            var sendArr = []
            var qianduanEtime = this.rangeTime.startDate === this.rangeTime.endDate ? parseInt(new Date(this.rangeTime.endDate).setHours(23,59,59) / 1000) : parseInt(this.rangeTime.endDate.getTime() / 1000)
            console.log(arrNotCenter,'arrNotCenter')
            arrNotCenter.forEach((v, i) => {
              var param = v
              param.recordType = 'all',  //国标设备
              param.sTime = parseInt(this.rangeTime.startDate.getTime() / 1000)
              param.eTime = qianduanEtime
              // param.eTime = parseInt(this.rangeTime.endDate.getTime() / 1000)
              sendArr.push(param)
            })
            var curChanArr = this.getAsyncData(sendArr)
            console.log(curChanArr,'curChanArr')
            setTimeout(() => {
              var minMaxObj = this.getTheMinAndMax(this.qianDuanList) //this.getAsyncData()取到this.qianDuanList
              curChanArr.forEach((vChan, iChan) => {
                var openObj = {
                  channel: vChan.result[0].channel,
                  devIp: vChan.result[0].devIp,
                  devPort: vChan.result[0].devPort,
                  eTime: minMaxObj.maxOne,
                  fileName: vChan.result[0].fileName,
                  filesize: vChan.result[0].filesize,
                  recordType: vChan.result[0].recordType,
                  sTime: minMaxObj.minOne,
                  streamType: vChan.result[0].streamType,
                  dPort: 8000,
                  channelName: vChan.channelName
                }
                openObj.isCenter = this.isCenter
                console.log([openObj],'同步前端参数')
                this.$refs.pluginP.openPlayback([openObj])
              })
            }, 300)
          }
        } else {
          // 异步回放
          // 异步回放不可多选，此时用this.currentSelectObj获取选中节点信息
          if (this.isCenter) {
            // 中心回放
            // 中心需要查询有没有录像段
            this.dateVal.setHours(this.timeVal.getHours())
            this.dateVal.setMinutes(this.timeVal.getMinutes())
            this.dateVal.setSeconds(this.timeVal.getSeconds())
            if (this.dateVal.getTime() > new Date().getTime()) {
              this.$message('精确时间不能超过当前时间！')
              return
            }
            let newEndTime
            const _date = new Date(this.dateVal)
            _date.setHours(23)
            _date.setMinutes(59)
            _date.setSeconds(59)
            newEndTime = parseInt(_date.getTime() / 1000)
            const param = {
              name: this.currentSelectObj.name,
              channel: Number(this.currentSelectObj.channel),
              streamType: this.currentSelectObj.streamType,
              eventType: this.currentSelectObj.eventType,
              typeName: '',
              typeContent: '',
              devIp: this.currentParentNode.devIp,
              devPort: this.currentParentNode.devPort,
              startTime: Date.parse(this.dateVal) / 1000,
              endTime: newEndTime,
              rows: this.currentPageObj.limit,
              page: this.currentPageObj.page,
              time: Date.parse(this.dateVal) / 1000
            }
            param.isCenter = this.isCenter
            console.log('--异步中心--')
            console.log(param)
            this.$refs.pluginP.openPlayback([param])
          } else {
            // 前端回放不需要查询录像段
            if (!this.rangeTime.startDate || !this.rangeTime.endDate) {
              this.$message('请选择日期范围')
              return
            }
            //   /*   测试参数   */
            //   // let param = {
            //   //   recordType: 'all',
            //   //   rowId: this.currentPageObj.page,
            //   //   rowCount: this.currentPageObj.limit,
            //   //   sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
            //   //   eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
            //   //   streamType: 'main',
            //   //   channel: 1,
            //   //   devIp: '192.168.7.248',
            //   //   devPort: 37777,
            //   //   isCenter: this.isCenter
            //   // }
            //   let param = {
            //     recordType: 'all',
            //     rowId: this.currentPageObj.page,
            //     rowCount: this.currentPageObj.limit,
            //     sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
            //     eTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
            //     streamType: 'main',
            //     channel: Number(this.currentSelectObj.channel),
            //     devIp: this.currentSelectObj.ip,
            //     devPort: this.currentSelectObj.dPort,
            //     isCenter: this.isCenter
            //   }
            // var sendArr = []
            // arrNotCenter.forEach((v, i) => {
            //   var param = v
            //   param.sTime = parseInt(this.rangeTime.startDate.getTime() / 1000)
            //   param.eTime = parseInt(this.rangeTime.endDate.getTime() / 1000)
            //   sendArr.push(param)
            // })
            
            var qianduanEtime = this.rangeTime.startDate === this.rangeTime.endDate ? parseInt(new Date(this.rangeTime.endDate).setHours(23,59,59) / 1000) : parseInt(this.rangeTime.endDate.getTime() / 1000)
            var qianduanStimeVal = new Date(this.rangeTime.startDate)
            qianduanStimeVal.setHours(this.timeVal.getHours())
            qianduanStimeVal.setMinutes(this.timeVal.getMinutes())
            qianduanStimeVal.setSeconds(this.timeVal.getSeconds())
            qianduanStimeVal = parseInt(qianduanStimeVal / 1000)
            if (this.dateVal.getTime() > new Date().getTime()) {
              this.$message('精确时间不能超过当前时间！')
              return
            }
            if(_this.value!=='all' && _this.value!=='timeRecord'){
              console.log(_this.value, '====_this.value')
              this.$message('目前仅支持筛选定时和全部录像，请重新选择')
              return
            }
            const param = {
              //recordType: 'all',
              rowId: this.currentPageObj.page,
              rowCount: this.currentPageObj.limit,
              //sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
              sTime: qianduanStimeVal,
              eTime: qianduanEtime,
              streamType: this.currentSelectObj.streamType,
              channel: Number(this.currentSelectObj.channel),
              devIp: this.currentParentNode.devIp,
              devPort: this.currentParentNode.devPort,
              isCenter: this.isCenter,
              recordType: _this.value === 'all' ? 0 : 1  //0:全部 1:定时 目前接口仅支持全部和定时
            }
            console.log('--异步前端--')
            console.log(param)
            // 是前端回放先获取数据列表
            var res = Promise.resolve(getQianDuanList(param))
            var final = res.then(Vb => {
              // if(!Vb || !Vb.recordInfo || Vb.recordInfo.length === 0){
              //   this.$refs.pagination.setPaginationConfig({page:1,limit:20})
              // }
              console.log(Vb,'Vb qianduan res')
              if (Vb.recordInfo.length !== 0) {
                this.paginationTotal = Vb.recordInfo.length
                this.$refs.pagination.setTotal(20)
                Vb.recordInfo.forEach((v, i) => {
                  var obj = {
                    fileType: formatRecordType(v.recordType), //录像类型，智能录像等
                    timeLang: formatSpendTime(v.sTime, v.eTime),
                    startTime: Vue.moment(v.sTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                    endTime: Vue.moment(v.eTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                    fileSize: byteConversion(v.filesize), //录像文件大小
                    result: v,
                    fileName: v.fileName
                  }
                  this.qianDuanList.push(obj)
                })
              }
            })
          }
        }
        this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
        //this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      }, 500)
    },
    // 获取前端数据
    getAsyncData(arr) {
      console.log(arr, 'getAsyncData 入参')
      var theNodeArr = []
      arr.forEach((vA, i) => {
        // 是前段回放先获取数据列表
        console.log(vA,'arr每一项vA')
        var res = Promise.resolve(getQianDuanList(vA))
        var final = res.then(Vb => {
          console.log(Vb,'getQianDuanList(vA)返回值')
          if (!Vb.recordInfo) {
            this.$messageError('查询无录像')
            return
          }
          if (Vb.recordInfo.length !== 0) {
            theNodeArr.push({
              result: Vb.recordInfo,
              channelName: vA.name
            })
            Vb.recordInfo.forEach((v, i) => {
              var obj = {
                fileType: formatRecordType(v.recordType),
                timeLang: formatSpendTime(v.sTime, v.eTime),
                startTime: Vue.moment(v.sTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                endTime: Vue.moment(v.eTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                fileSize: byteConversion(v.filesize),
                result: v
              }
              this.qianDuanList.push(obj)
            })
          } else {
            theNodeArr.push({
              result: []
            })
          }
        })
      })
      return theNodeArr
    },
    // 获取时间的最大值和最小值
    getTheMinAndMax(arr) {
      var minOne = ''
      var maxOne = ''
      for (let i = 0; i < arr.length; i++) {
        let result = arr[i].result
        if ($.isEmptyObject(result)) {
          continue
        }
        if (minOne === '') {
          minOne = result.sTime
          continue
        }
        if (maxOne === '') {
          maxOne = result.eTime
          continue
        }
        if (minOne > result.sTime) {
          minOne = result.sTime
        }
        if (maxOne < result.eTime) {
          maxOne = result.eTime
        }
      }
      return {
        minOne,
        maxOne
      }
    },
    // 单击前端播放列表的下载按钮
    handleEdit(index, row) {
      //console.log(this.$store.state.sysParametersCof.downLoadVideoPath,'下载地址')
      let strFileDir = this.path + "\\" +"download.txt"
      console.log(strFileDir, 'strFileDir')
      let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
      console.log(creatDir, 'creatDir')
      if (creatDir) {
        this.$message({
          message: '创建目录文件失败',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: `录像开始下载,下载路径为${this.path}`,
        type: 'warning'
      })
      const time = new Date().getTime()
      row.dPort = 8000
      //row.path = 'D:\\BC8100\\Download'
      row.path = this.path
      row.channelName = this.currentSelectObj.name
      console.log('==下载传参==')
      console.log(row)
      downloadDev(row, time + index, this.path)
    },
    // 双击前端播放列表某一行
    doubleClick(row) {
      var obj = row.result
      console.log(row, 'row')
      obj.dPort = 8000
      obj.isCenter = this.isCenter
      // 前端回放点击每一层
      this.$refs.pluginP.openPlayback([obj])
      this.$refs.pluginP.setPlayType('file', row)
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
    }
  }
}
</script>
<style  lang="less">
.playBackPage {
  min-width: 1800px;
  .el-tabs__header {
    margin-top: 5px;
  }
  .el-checkbox__label {
    padding-left: 5px;
    font-size: 12px;
  }
  .el-tabs--card {
    height: 99%;
    .el-tabs__content {
      height: 93%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs__item {
    background-color: #f5f5f5;
    height: 38px;
    line-height: 35px;
    text-align: center;
    box-sizing: border-box;
  }
  #tab-first {
    width: 114px;
    border: none;
    border-top: 3px solid transparent;
  }
  #tab-second {
    width: 165px;
    border: none;
    border-top: 3px solid transparent;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-top: 3px solid #2d72d3 !important;
    background-color: #fff;
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    border: none !important;
  }
  .el-pagination__total {
    margin-right: 0;
  }
  .el-pagination__jump {
    margin-left: 0px;
    margin-right: 10px;
  }
  .el-pagination .btn-next {
    padding-left: 0;
  }
  .el-pagination .btn-prev {
    padding-right: 0;
  }
  .el-pagination__editor.el-input {
    width: 35px;
    height: 20px;
  }
  .el-pagination .el-input .el-input__inner {
    height: 20px !important;
    line-height: 20px !important;
  }
}
</style>
<style lang="less" scoped>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
.playBackPage {
  background-color: #eee;
  height: 100%;
  display: flex;
  .left {
    background: #fff;
    width: 280px;
    position: relative;
    height: 100%;
    /deep/ .treeBox .treeInfo {
      &[name='res'] span.treeText {
        max-width: calc(~'100% - 35px');
      }
    }
    .theTree {
      max-height: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .refresh {
      position: absolute;
      top: 18px;
      right: 15px;
      z-index: 2;
    }
    /deep/ .el-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(~'100% - 56px');
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    .el-checkbox {
      position: absolute;
      top: 40px;
      right: 10px;
      z-index: 1;
    }
  }
  .middle {
    background: #fff;
    flex: 1;
  }
  .right {
    position: relative;
    width: 300px;
    margin-left: 9px;
    background: #fff;
    .middleTime {
      margin-top: 7px;
    }
    .pageNum {
      width: 100%;
      padding: 2px;
      overflow: hidden;
    }
    p {
      height: 38px;
      line-height: 38px;
      text-align: center;
      background-color: #f5f5f5;
    }
    .condition {
      height: 32px;
      margin: 10px 0px;
      width: 100%;
      padding: 0px 0px 0px 35px;
    }
    .condition > * {
      display: inline-block;
    }
    .condition > span {
      width: 70px;
      line-height: 30px;
      color: #333;
    }
    .searchbtn {
      text-align: right;
      padding-right: 30px;
      box-sizing: border-box;
    }
    .bottomList {
      padding: 10px 10px 0px 20px;
      box-sizing: border-box;
    }
    .filterList {
      overflow-x: auto;
    }
    .filterList::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: #d3dce6;
    }
    .filterList::-webkit-scrollbar-button {
      display: block !important;
    }
    .filterList::-webkit-scrollbar-track {
      display: none !important;
    }
    .filterList::-webkit-scrollbar-button:horizontal:start:increment {
      //横向 开始端 增量按钮
      display: none !important;
    }
    .filterList::-webkit-scrollbar-button:horizontal:end:decrement {
      //横向 末尾端 减量按钮
      display: none !important;
    }
    .filterList::-webkit-scrollbar-button:horizontal:single-button:start {
      width: 4px;
      height: 4px;
      background-color: #eee;
    }
    .filterList::-webkit-scrollbar-button:horizontal:single-button:end {
      width: 4px;
      height: 4px;
      background-color: #eee;
    }
    .filterList table {
      width: 300px;
    }
    .filterList table thead {
      width: 100%;
      background: #f5f7fa;
      height: 32px;
    }
    .filterList table thead td {
      text-align: center;
    }
    .filterList table td {
      padding: 12px 0;
      text-align: center;
    }
    .filterList .tbody {
      height: 310px;
      min-height: 310px;
      background: #fff;
      border: 1px solid #fff;
    }
    .filterList .tbody div {
      text-align: center;
    }
    .filterList .tbody tr:hover {
      background: #f5f7fa;
    }
    .filterList .tbody tbody td {
      text-align: center;
      border-bottom: 1px solid #e1e1e1;
    }
    .tTableBody {
      overflow-y: auto;
    }
    @media (max-width: 1800px) {
      .searchbtn {
        margin-top: 10px;
      }
      .filterList table td {
        padding: 4px 0;
      }
      .filterList .tbody tbody td {
        line-height: 1;
      }
      #tableVideo {
        margin-top: 10px;
      }
    }
  }
  .specialOne {
    position: absolute;
    top: 0;
    right: 0;
    width: 15px;
    text-align: center;
    height: 40px;
    line-height: 40px;

    color: #333;
    z-index: 9;
    top: 50%;
    transform: translate(0, -50%);
  }
  .open {
    right: 9px;
    background-color: #fff;
  }
  .close {
    right: 286px;
    background-color: #e6e6e6;
  }
}
</style>
