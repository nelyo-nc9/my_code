<template>
  <div class="playBackPage">
    <div class="left" v-show='!isFullScreen'>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="机构" name="first">
          <el-checkbox v-model="isSync" @click.stop>同步回放</el-checkbox>
          <treeBox
            ref="treeDiv"
            :lazyTreeApi="getTree"
            :lazyTreeCheckApi="lazyTreeCheckApi"
            :customizeQuery="customizeQuery"
            searchType="search"
            treeLazyToggle
            iconToggle
            :checkboxToggle="isShowCheckBox"
            :lazyTreeSearchApi="getLazyTreeSearchApi"
            @checkclick="checkclick"
            @onceClick="playBackGetData"
            @dblclick="doubleOpenplayBack"
          >
            <template  slot-scope="{data}">
              <i class="iconfont icon-collection" title="快速收藏" v-if="data.tierType === 'res'" @click="collectIconHandler(data)"></i>
              <i class="iconfont icon-biaoqian" title="详细信息" @click.stop="clickInfo(data)"></i>
            </template>
          </treeBox>
        </el-tab-pane>
        <el-tab-pane label="收藏夹" name="second">
          <!-- isSyncCollect isShowCheckBoxCollect -->
          <el-checkbox v-model="isSync" @click.stop>同步回放</el-checkbox>
          <collectTree :getDataApi="getCollectApi" :postDataApi="postCollectApi" ref="fav" :showCreate="false" :checkboxToggle="isShowCheckBox"  @nodeClick="playBackGetData" @dblclick="doubleOpenplayBack">
            <template  slot-scope="{data, node}">
              <i class="iconfont icon-delete" title="删除" v-if="iconList.includes('collection')" @click.stop="collectDelete(data,node)"></i>
            </template>
          </collectTree>
        </el-tab-pane>
      </el-tabs>
      <span class="refresh icon iconfont-ccb ccbicon" @click="refresh"></span>
    </div>
    <div class="middle">
      <playBackPlugin
        ref="pluginP"
        :iconShow="iconShowParams"
        :defaultPane="4"
        :isCenterP="isCenter"
        :channelName="currentSelectObj.name"
        @transforFull='transforFull'
      >
        <template v-slot:close="{paneMark}">
          <SuspenClose slot="close" @iconClose="stopBack(paneMark)"></SuspenClose>
        </template>
      </playBackPlugin>
    </div>
    <div class="right" v-show='!isFullScreen' :style="{width:rightWidth+'px'}">
      <div class="timeDiv" v-if="rightWidth != 0">
        <p>回放条件</p>
        <div class="middleTime">
          <Calendar
            width="260"
            @clicktest="clicktest"
            @range="daterange"
            style="margin:0 auto;"
            ref="calender"
            :daterange="!isSync"
            :curNode="calenderObj"
          ></Calendar>
          <!--  -->
          <div class="condition">
            <span style="vertical-align:top;">精确时间</span>
            <BStimePicker :datetime="timeVal" @timeChange="timeChange" :width="160" :height="32"></BStimePicker>
          </div>
          <div class="condition">
            <span>文件类型</span>
            <el-select v-model="value" placeholder="请选择" style="width:160px;" size="small">
              <el-option
                v-for="item in videoTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="searchbtn">
            <el-button type="primary" style="width:160px" size="small" @click="searchData()">检索</el-button>
          </div>
        </div>
        <div class="bottomList" v-if="showList">
          <!-- 前端录像列表 -->
          <div id="tableVideo" class="table filterList">
            <div class="tbody">
              <!-- <div v-if="tableData.length === 0">暂无数据</div> -->
              <el-table
                stripe
                size="medium"
                :data="qianDuanList"
                height="100%"
                style="width: 100%"
                @row-dblclick="doubleClick"
              >
                <el-table-column label="操作" :width="45">
                  <template slot-scope="scope">
                    <i
                      @click.stop="handleEdit(scope.$index, scope.row)"
                      class="icon iconfont icon-xiazai"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(column, index) in columnsBottom"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                  :width="column.width"
                  :sortable="column.sortable"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="pageNum">
            <VideoPagination ref="pagination" @paginationConfChange="pageChangeResult" :showSolt="false" :total="paginationTotal"></VideoPagination>
          </div>
        </div>
      </div>
      <span class="specialOne close" v-if="rightWidth != 0" @click="backRightTime(0)">
        <i class="el-icon-arrow-right" style="color:#666666;font-weight:700"></i>
      </span>
      <span class="specialOne open" v-if="rightWidth == 0" @click="backRightTime(1)">
        <i class="el-icon-arrow-left" style="color:#666666;font-weight:700"></i>
      </span>
    </div>

    <!-- 收藏夹对话框 -->
    <!-- <favorite-dialog :openselectFav="openselectFav" @closeselectFav="closeselectFav"></favorite-dialog> -->
    <!-- 快速收藏 -->
    <fastCollect v-if="openselectFav" :videoStatusArr="videoStatusArr" :pushFavData="pushFavData" sourceType="tree" :openselectFav="openselectFav" @cancel="openselectFav = false;pushFavData= {}"></fastCollect>
    <!-- 机构树节点详细信息 -->
    <dialog-info v-if="showDialogInfo" :showDialogInfo="showDialogInfo" :nodeData="orgData" @closeDialogInfo="closeDialogInfo"></dialog-info>
  </div>
</template>
<script>
// import Vue from 'vue'
// import axios from 'axios'
import SuspenClose from './iconComponents/SuspenClose'
import playBackPlugin from './playBackPlugin/playBackPlugin'
import Calendar from './playBackPlugin/BScalendar'
import BStimePicker from './playBackPlugin/BStimePicker'
import VideoPagination from '../components/VideoPagination'
import treeBox from '@src/components/tree/treeBox'
// import favoriteDialog from '../components/favoriteDialog'
import fastCollect from '../preview/iconComponents/fastCollect'
import DialogInfo from '../components/DialogInfo'
import collectTree from '@src/components/collectTree'
import { getTreeApi, getLazyTreeApi, getCollectList, postCollect, deleteCollect, updataCollect, searchTree } from '@src/http/video/videoPreview.api.js'
import { queryData } from '../../../components/videoPlugin/playback/common/requestFunction'
import { newDownloadDev } from '@src/components/videoPlugin/playback/common/plginInMethod.js'
import {
  getQianDuanList,
  byteConversion,
  formatRecordType,
  formatSpendTime
  // downloadDev
} from './playBackPlugin/playback.js'

export default {
  name: 'plugin',
  components: {
    playBackPlugin,
    Calendar,
    BStimePicker,
    VideoPagination,
    treeBox,
    // favoriteDialog,
    fastCollect,
    DialogInfo,
    collectTree,
    SuspenClose // 回放小窗口里的关闭按钮
  },
  data() {
    return {
      path: this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download',
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      isFullScreen: false,
      // nodeKeysList:[],
      customizeQuery: {
        params: {
          isRecursion: 0,
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
        { value: 'manualRecord', label: '手动录像' },
        { value: 'timeRecord', label: '定时录像' },
        { value: 'eventRecord', label: '事件录像' },
        { value: 'intelligentRecord', label: '智能录像' }
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
          name: 'CheckRecode'
        },
        {
          type: 'left',
          index: 8,
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
        {
          type: 'right',
          index: 7,
          name: 'SplitMode'
        },
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
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1
        },
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
      // isSyncCollect: false, // 收藏夹  true:同步  false:异步
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
      // isShowCheckBoxCollect: false, // 是否显示收藏夹机构数的复选框
      currentPageObj: {
        limit: 20,
        page: 1
      },
      downListData: JSON.parse(window.localStorage.getItem('downListDataArr')) || [], // 查询条件的table数据
      openselectFav: false, // 显示收藏夹对话框
      currentParentNode: {},
      currentSelectObj: {
        name: ''
      },
      rTypeObj: { // 前端查询录像类型转换对象
        'all': 0,
        'timeRecord': 1,
        'eventRecord': 2,
        'manualRecord': 3,
        'intelligentRecord': 4
      },
      vTArr: ['manualRecord', 'intelligentRecord'], // 前端查询录像不支持的类型
      pushFavData: {},
      paginationTotal: 0, // 列表项总数
      showDialogInfo: false, // 展示机构节点信息弹窗
      orgData: {}, // 机构节点信息
      videoStatusArr: [] // 快速收藏数组
    }
  },
  watch: {
    isSync() {
      this.isShowCheckBox = this.isSync
      this.changecalendarDate()
    },
    activeName(val) {
      if (val === 'second') {
        this.refresh()
      }
    }
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.changecalendarDate()
    })
  },
  methods: {
    changecalendarDate() { // 改变日历时间
      let cpDate = new Date(this.dateVal)
      if (!this.isSync) {
        this.$refs.calender.startDate = cpDate
        this.$refs.calender.endDate = cpDate
      } else {
        this.$refs.calender.startDate = null
        this.$refs.calender.endDate = null
      }
      this.rangeTime.startDate = cpDate
      this.rangeTime.endDate = cpDate
    },
    isSameType() { // 判断勾选的资源是同一类型（前端/中心）
      let countCenter = 0
      let countQianduan = 0
      let parr = this.activeName === 'first' ? this.$refs.treeDiv.getCheckedNodes(true, true) : this.$refs.fav.getCheckedNodes(true, true)
      let arr = parr.filter(itm => {
        return itm.tierType === 'res'
      })
      console.log(arr, 'arr')
      arr.forEach(item => {
        // 中心设备
        if (item.deviceType > 3) {
          countCenter++
        } else {
          // 前端设备
          countQianduan++
        }
      })
      // 如果前端和中心设备都选中了，同步情况下不能同时开流
      if (countCenter && countQianduan) {
        return false
      }
      return true
    },
    stopBack(index) {
      console.log(index, '++++++++++++++++++++++++++')
      this.$refs.pluginP.stopBack()
    },
    clickInfo(data) { // 机构树详细信息
      this.orgData = data
      this.showDialogInfo = true
    },
    closeDialogInfo() {
      this.showDialogInfo = false
    },
    transforFull(isFullScreen) {
      this.isFullScreen = isFullScreen
    },
    getCollectApi(params) {
      return getCollectList(params)
    },
    postCollectApi(params) {
      return postCollect(params)
    },
    pageChangeResult(obj) {
      console.log(obj, 'ooooooo22')
      this.currentPageObj = obj
      this.searchData(true)
    },
    // 机构和收藏夹切换响应事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 机构树 懒加载获取
    getTree(params) {
      return getTreeApi(params)
    },
    // 机构树 递归获取
    lazyTreeCheckApi(pObj) {
      let params = {
        ...pObj,
        isRecursion: 1
      }
      return getTreeApi(params)
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 1,
        key: params.search
      }
      return searchTree(params)
    },
    // 刷新树
    async refresh() {
      if (this.activeName === 'first') {
        let status = await this.$refs.treeDiv.refresh()
        if (status === 1) {
          this.$message('刷新成功')
        } else {
          this.$message('列表刷新失败')
        }
      } else if (this.activeName === 'second') {
        this.$refs.fav.refresh()
      }
    },
    collectDelete(data, node) { // 删除
      // console.log('删除的data---------', data)
      if (data.tierType === 'node') {
        this.deleteCol(data)
      } else if (data.tierType === 'res') {
        this.deleteRes(data, node)
      }
    },
    deleteCol(data) { // 收藏夹删除
      this.$confirm(`此操作将删除该收藏夹组,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCollect({
          ids: [data.id]
        }).then(res => {
          if (res.data.code === 0) {
            this.refresh()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    deleteRes(data, node) { // 资源删除
      let colName = node.parent.data.name || ''
      this.$confirm(`此操作将从收藏夹组${colName}删除该资源,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parentData = node.parent.data
        let rIds = parentData.children.splice(parentData.children.findIndex(i => i.id === data.id), 1).map(i => i.id)
        updataCollect({
          id: parentData.id,
          name: parentData.name,
          isPolling: parentData.isPolling,
          pollingTime: parentData.pollingTime,
          rIds
        }).then(res => {
          if (res.data.code === 0) {
            this.refresh()
          } else {
            this.$messageError(res.data.message)
          }
        })
      })
    },
    // 设备收藏图标点击事件
    collectIconHandler(data) {
      // TODO 收藏设备
      // this.videoStatusArr = [{
      //   isPlay: true,
      //   source: data
      // }]
      this.pushFavData = data
      this.openselectFav = true
      console.log('收藏设备 -------------- ', data)
    },
    // 关闭收藏设备对话框
    // closeselectFav() {
    //   this.openselectFav = false
    // },
    // 点击获取节点信息
    playBackGetData(data, node) {
      console.log(data, node, '--my curNode data--')
      console.log(data)
      let streamTypeObj = {
        'main': 'main',
        'sub': 'sub1',
        'sub2': 'sub2',
        1: 'main',
        2: 'sub1',
        3: 'sub2'
      }
      this.currentSelectObj = {
        ...data,
        channel: Number(data.channel), // 设备通道
        devPort: data.devCport,
        streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
      }
      this.currentSelectObj.devType = this.getDevType(data)
      console.log(this.currentSelectObj, 'this.current')
      if (data.tierType === 'res') {
        let parentData = node.parent.data
        this.currentParentNode = {
          devIp: parentData.ip,
          devPort: parentData.cPort,
          type: parentData.type
        }
        console.log('--currentParentNode--')
        console.log(this.currentParentNode)
        // this.isCenter = parentData.type !== 1
        this.isCenter = data.deviceType !== 1
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
          channel: data.channel, // 通道号
          ip: data.devIp // 通道ip
        }
        this.calenderObj = temoP
      }
    },
    getDevType(data) { // 获取镜头类型
      if (data.sipCode) {
        if (data.deviceType > 3) {
          return 4
        } else {
          return 2
        }
      } else {
        if (data.deviceType > 3) {
          return 3
        } else {
          return 1
        }
      }
    },
    // 双击节点开流
    async doubleOpenplayBack(data, node) {
      console.log(data, node, '===双击数据==')
      // this.currentSelectObj = data
      let streamTypeObj = {
        'main': 'main',
        'sub': 'sub1',
        'sub2': 'sub2',
        1: 'main',
        2: 'sub1',
        3: 'sub2'
      }
      this.currentSelectObj = {
        ...data,
        channel: Number(data.channel), // 设备通道
        devPort: data.devCport,
        streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
      }
      this.$refs.pluginP.getSyncStatus(false)// 点击检索时候获取同步异步状态
      this.currentSelectObj.devType = this.getDevType(data)
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      if (data.tierType === 'res') {
        // var womod = this.checkedPane //如果需求改成需要在焦点窗口开流，就加这一条
        let parentData = node.parent.data
        this.currentParentNode = {
          devIp: parentData.ip,
          devPort: parentData.cPort,
          type: parentData.type
        }

        let param = {
          ...this.currentSelectObj,
          // recordType: 'eventRecord',
          // devPort: data.devCport, // 设备端口，
          // channel: Number(data.channel), // 设备通道
          startTime: parseInt((new Date().setHours(0, 0, 0) - 60 * 60 * 12 * 1000) / 1000), // 开始时间是当前日期0点
          endTime: parseInt(Date.parse(new Date()) / 1000), // 结束时间
          newStartTime: parseInt(new Date().setHours(0, 0, 0) / 1000)
          // streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
        }
        // param.devType = this.getDevType(data)
        console.log(param, 'param36363636++++++')
        this.$refs.pluginP.openBackVideo(param)// 进行回放录像
      }
      // this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
    },
    // 机构树复选框勾选
    checkclick(data, node, status) {
      let isSt = this.isSameType()
      if (!isSt) {
        this.$message({
          message: '同步播放时中心回放或前端回放不能共存,请重新勾选',
          type: 'warning'
        })
      }
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
      console.log(this.rangeTime, '时间范围')
    },
    // 中心回放时候的单击选择
    clicktest(date) {
      this.dateVal = date
      if (this.isSync) {
        let cpDate = new Date(this.dateVal)
        this.rangeTime.startDate = cpDate
        this.rangeTime.endDate = cpDate
      }
      // var curColor = this.$refs.calender.getShowClass(date)
      // if (!curColor) {
      //   console.log('暂无录像段')
      // } else {
      // }
    },
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

    /**
     * @description: 寻找录像段的最小时间
     * @param {type} eventList 录像段数组
     * @return:
     * @author: dfk
     */
    findVideoTimeMin(evnetList = []) {
      let minTime = 0
      let maxTime = 0
      let minTimeIndex = 0
      for (let index = 0; index < evnetList.length; index++) {
        const element = evnetList[index]
        for (const iterator of element) {
          if (!minTime || iterator.startTime < minTime) {
            minTime = iterator.startTime
            minTimeIndex = index
            continue
          }
          if (!maxTime || iterator.endTime > maxTime) {
            maxTime = iterator.endTime
          }
        }
      }
      return {
        minTime,
        maxTime,
        minTimeIndex
      }
    },
    // 点击检索按钮
    async searchData(vBl) { // vBl为true时，是分页查询，不需要还原page为1
      // 异步时，不出现复选框，机构树有焦点
      // 同步时，勾选复训框，机构树无焦点
      // TODO: 异步ipc设备
      if (this.activeName === 'first') {
        if (
          (!this.isShowCheckBox && (!this.currentSelectObj || this.currentSelectObj.tierType !== 'res')) ||
          (this.isShowCheckBox && (this.$refs.treeDiv.getCheckedNodes(true, true).some(item => item.tierType === 'res')) === false)
        ) {
          this.$messageError('请选择一个通道')
          return
        }
      } else {
        if (
          (!this.isShowCheckBox && (!this.currentSelectObj || this.currentSelectObj.tierType !== 'res')) ||
          (this.isShowCheckBox && (this.$refs.fav.getCheckedNodes(true, true).some(item => item.tierType === 'res')) === false)
        ) {
          this.$messageError('请选择一个通道')
          return
        }
      }
      // if (!this.isCenter) {
      //   this.$refs.pluginP.stopBackALL()
      // }
      // 如果是同步回放，只允许同一回放流程（中心回放或前端回放）
      if (this.isSync) {
        let isSome = this.isSameType()
        if (!isSome) { // 如果不是同一类型
          console.log('!this.isSameType')
          this.$message({
            message: '同步播放时中心回放或前端回放不能共存,请重新勾选',
            type: 'warning'
          })
          // this.$refs.treeDiv.refresh()
          // thid.$refs.treeDiv.setCheckedNodes(this.nodeKeysList)
          return
        }
      }
      // let _this = this
      // setTimeout(() => {
      // if (!this.isShowCheckBox) {
      //   this.showList = true
      // } else {
      //   this.showList = false
      // }
      this.showList = false
      this.qianDuanList = []
      // var arr = this.$refs.treeDiv.getCheckedNodes(true, true)
      // console.log('--叶子节点--')
      // console.log(arr)

      if (!this.rangeTime.startDate || !this.rangeTime.endDate) {
        this.$message('请选择日期范围')
        return
      }
      // var qianduanEtime = this.rangeTime.startDate === this.rangeTime.endDate ? parseInt(new Date(this.rangeTime.endDate).setHours(23, 59, 59) / 1000) : parseInt(this.rangeTime.endDate.getTime() / 1000)
      let qianduanEtime = ''
      let qianduanStimeVal = ''
      let qStimeVal = new Date(this.rangeTime.startDate)
      qStimeVal.setHours(this.timeVal.getHours(), this.timeVal.getMinutes(), this.timeVal.getSeconds())
      qianduanStimeVal = parseInt(qStimeVal / 1000)
      if (new Date(this.rangeTime.endDate).toDateString() === new Date().toDateString()) { // 结束时间是今天
        qianduanEtime = parseInt(this.rangeTime.endDate.getTime() / 1000)
      } else {
        qianduanEtime = parseInt(new Date(this.rangeTime.endDate).setHours(23, 59, 59) / 1000)
      }
      if (!qianduanEtime || !qianduanStimeVal) { return }

      // 同步回放
      if (this.isShowCheckBox) {
        // 出现复选框时，getCheckedNodes()才可选择到节点信息
        let arrData = []
        let parr = this.activeName === 'first' ? this.$refs.treeDiv.getCheckedNodes(true, true) : this.$refs.fav.getCheckedNodes(true, true)
        let arr = parr.filter(itm => {
          return itm.tierType === 'res'
        })
        if (arr.length > 4) {
          this.$message('最多选择4个通道进行回放')
          return
        }
        console.log(arr, '--叶子节点--')
        arr.forEach(item => {
          // let curNode = this.$refs.treeDiv.getNode(item.nodeKey)
          let streamTypeObj = {
            'main': 'main',
            'sub': 'sub1',
            'sub2': 'sub2',
            1: 'main',
            2: 'sub1',
            3: 'sub2'
          }
          let obj = {
            ...item,
            devPort: item.devCport, // 设备端口，
            channel: Number(item.channel), // 设备通道
            startTime: qianduanStimeVal, // 开始时间是当前日期0点
            endTime: qianduanEtime, // 结束时间
            streamType: streamTypeObj[item.streamType] || 'main' // 码流类型（main,sub）
          }
          obj.devType = this.getDevType(item)
          arrData.push(obj)
        })

        let queryVideoEvent = []
        let queryList = []
        for (const iterator of arrData) {
          let query = {
            ...iterator,
            recordType: this.value // 查询全部
          }
          // if (iterator.devType === 1) { // 前端非国标查询要将对应录像类型转换
          //   query.recordType = this.rTypeObj[this.value]
          // }
          if (iterator.devType === 1 && this.vTArr.includes(this.value)) {
            this.$message('目前前端录像仅支持查询定时和事件录像')
            return
          }
          queryList.push(query)
          queryVideoEvent.push(
            queryData(query)
          )
        }
        let frontVideo = await Promise.all(queryVideoEvent)
        const { minTime, minTimeIndex } = this.findVideoTimeMin(frontVideo)
        if (!minTime) {
          return
        }
        // 把录像播放时间改成查询录像段的范围
        queryList = queryList.map((item, index) => {
          item.endTime = frontVideo[index][frontVideo[index].length - 1].endTime
          item.startTime = frontVideo[index][0].startTime
          return item
        })
        this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
        this.$refs.pluginP.syncPlayback(queryList, minTime, minTimeIndex, frontVideo)
        // }
      } else {
        // 异步回放
        let isSomeDay = false // 判断开始时间和结束时间是否是同一天,同一天不用显示列表
        if (new Date(this.rangeTime.startDate).toDateString() === new Date(this.rangeTime.endDate).toDateString()) {
          isSomeDay = true
        } else {
          isSomeDay = false
        }
        const param = {
          ...this.currentSelectObj,
          startTime: qianduanStimeVal - 3600 * 12,
          endTime: qianduanEtime,
          recordType: this.value,
          newStartTime: qianduanStimeVal
        }
        param.devType = this.getDevType(this.currentSelectObj)
        // if (param.devType === 1) { // 前端非国标查询要将对应录像类型转换
        //   param.recordType = this.rTypeObj[this.value]
        // }
        if (param.devType === 1 && this.vTArr.includes(this.value)) {
          this.$message('目前前端录像仅支持查询定时和事件录像')
          return
        }
        if (isSomeDay) { // 不显示列表，直接开流
          console.log(param)
          this.$refs.pluginP.openBackVideo(param)
        } else {
          this.showList = true
          if (!vBl) {
            this.currentPageObj.page = 1
            let pageObj = {
              page: 1,
              limit: 20
            }
            this.$nextTick(() => {
              this.$refs.pagination.setPaginationConfig(pageObj)
            })
          }
          const cParam = {
            ...param,
            page: this.currentPageObj.page,
            rows: this.currentPageObj.limit
          }
          console.log(cParam)
          // let res = Promise.resolve(queryData(cParam, true))
          let Vb = await queryData(cParam, true)
          console.log(Vb, '6666666666666666666666')
          // res.then(Vb => {
          console.log(Vb, 'Vb 列表 res')
          if (Vb.resourceList && Vb.resourceList.length !== 0) {
            this.paginationTotal = Vb.total
            this.$refs.pagination.setTotal(20)
            Vb.resourceList.forEach((v, i) => {
              let obj = {
                ...v,
                fileType: formatRecordType(v.recordType || v.eventType), // 录像类型，智能录像等
                timeLang: formatSpendTime(v.startTime, v.endTime),
                startTime: this.$moment(v.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                endTime: this.$moment(v.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                fileSize: byteConversion(v.fileSize), // 录像文件大小
                result: this.currentSelectObj,
                fileName: this.currentSelectObj.name
              }
              this.qianDuanList.push(obj)
            })
          } else {
            this.$messageWarn('查询无录像！')
          }
          // })
          this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
        }
      }
      // this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
      // this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      // }, 500)
    },
    // 获取前端数据
    // async getAsyncData(arr) {
    //   console.log(arr, 'getAsyncData 入参')
    //   var theNodeArr = []
    //   let eventList = []
    //   for (const vA of arr) {
    //     eventList.push(getQianDuanList(vA))
    //   }
    //   const results = await Promise.all(eventList)
    //   for (let index = 0; index < results.length; index++) {
    //     const Vb = results[index]
    //     if (!Vb.recordInfo) {
    //       this.$messageError('查询无录像')
    //       return
    //     }
    //     if (Vb.recordInfo.length !== 0) {
    //       theNodeArr.push({
    //         result: Vb.recordInfo,
    //         channelName: arr[index].name
    //       })
    //       Vb.recordInfo.forEach((v, i) => {
    //         var obj = {
    //           fileType: formatRecordType(v.recordType),
    //           timeLang: formatSpendTime(v.startTime, v.endTime),
    //           startTime: this.$moment(v.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
    //           endTime: this.$moment(v.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
    //           fileSize: byteConversion(v.filesize),
    //           result: v
    //         }
    //         this.qianDuanList.push(obj)
    //       })
    //     } else {
    //       theNodeArr.push({
    //         result: []
    //       })
    //     }
    //   }
    //   // arr.forEach(async(vA, i) => {
    //   //   // 是前段回放先获取数据列表
    //   //   console.log(vA, 'arr每一项vA')
    //   //   let Vb = await getQianDuanList(vA)
    //   //   var res = await Promise.resolve(getQianDuanList(vA))
    //   //   var final = res.then(Vb => {
    //   //     console.log(Vb, 'getQianDuanList(vA)返回值')
    //   //     if (!Vb.recordInfo) {
    //   //       this.$messageError('查询无录像')
    //   //       return
    //   //     }
    //   //     if (Vb.recordInfo.length !== 0) {
    //   //       theNodeArr.push({
    //   //         result: Vb.recordInfo,
    //   //         channelName: vA.name
    //   //       })
    //   //       Vb.recordInfo.forEach((v, i) => {
    //   //         var obj = {
    //   //           fileType: formatRecordType(v.recordType),
    //   //           timeLang: formatSpendTime(v.sTime, v.eTime),
    //   //           startTime: Vue.moment(v.sTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
    //   //           endTime: Vue.moment(v.eTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
    //   //           fileSize: byteConversion(v.filesize),
    //   //           result: v
    //   //         }
    //   //         this.qianDuanList.push(obj)
    //   //       })
    //   //     } else {
    //   //       theNodeArr.push({
    //   //         result: []
    //   //       })
    //   //     }
    //   //   })
    //   // })
    //   return theNodeArr
    // },
    // 获取时间的最大值和最小值
    // getTheMinAndMax(arr) {
    //   var minOne = ''
    //   var maxOne = ''
    //   for (let i = 0; i < arr.length; i++) {
    //     let result = arr[i].result
    //     if ($.isEmptyObject(result)) {
    //       continue
    //     }
    //     if (minOne === '') {
    //       minOne = result.sTime
    //       continue
    //     }
    //     if (maxOne === '') {
    //       maxOne = result.eTime
    //       continue
    //     }
    //     if (minOne > result.sTime) {
    //       minOne = result.sTime
    //     }
    //     if (maxOne < result.eTime) {
    //       maxOne = result.eTime
    //     }
    //   }
    //   return {
    //     minOne,
    //     maxOne
    //   }
    // },
    // 单击前端播放列表的下载按钮
    handleEdit(index, row) {
      // console.log(this.$store.state.sysParametersCof.downLoadVideoPath,'下载地址')
      let strFileDir = this.path + '\\' + 'download.txt'
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
      // row.dPort = 8000
      // row.path = 'D:\\BC8100\\Download'
      row.path = this.path
      row.channelName = this.currentSelectObj.name
      row.isCenter = row.result.devType > 2
      row.result.streamType = row.result.streamType === 'main' ? 1 : 2
      row.result.startTime = parseInt(new Date(row.startTime).getTime() / 1000)
      row.result.endTime = parseInt(new Date(row.endTime).getTime() / 1000)
      console.log('==下载传参==')
      console.log(row)
      newDownloadDev(row, time + index, this.path)
    },
    // 双击前端播放列表某一行
    doubleClick(row) {
      var obj = row.result
      console.log(row, 'row')
      // obj.dPort = 8000
      // obj.isCenter = this.isCenter
      let cTObj = { // 前端查询录像类型转换对象
        '定时录像': 'timeRecord',
        '事件录像': 'eventRecord',
        '手动录像': 'manualRecord',
        '智能录像': 'intelligentRecord'
      }
      let param = {
        ...obj,
        recordType: cTObj[row.fileType],
        startTime: parseInt(new Date(row.startTime).getTime() / 1000), // 开始时间是当前日期0点
        endTime: parseInt(new Date(row.endTime).getTime() / 1000) // 结束时间
      }
      param.devType = this.getDevType(obj)
      if (param.devType === 1) { // 前端非国标查询要将对应录像类型转换
        param.recordType = this.rTypeObj[this.value]
      }
      console.log(param, 'param36363636++++++')
      this.$refs.pluginP.openBackVideo(param)
      // 前端回放点击每一层
      // this.$refs.pluginP.openPlayback([obj])
      this.$refs.pluginP.setPlayType('file', row)
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
    }
  }
}
</script>
<style  lang="less">
.playBackPage {
  min-width: 1800px;
  // .el-tabs__header {
  //   margin-top: 5px;
  // }
  .el-checkbox__label {
    padding-left: 5px;
    font-size: 12px;
  }
  // .el-tabs--card {
  //   height: 99%;
  //   .el-tabs__content {
  //     height: 93%;
  //     .el-tab-pane {
  //       height: 100%;
  //     }
  //   }
  // }
  // .el-tabs--card > .el-tabs__header .el-tabs__nav {
  //   border: none;
  // }
  // .el-tabs__item {
  //   background-color: #f5f5f5;
  //   height: 38px;
  //   line-height: 35px;
  //   text-align: center;
  //   box-sizing: border-box;
  // }
  // #tab-first {
  //   width: 114px;
  //   border: none;
  //   border-top: 3px solid transparent;
  // }
  // #tab-second {
  //   width: 165px;
  //   border: none;
  //   border-top: 3px solid transparent;
  // }
  // .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  //   border-top: 3px solid #2d72d3 !important;
  //   background-color: #fff;
  // }
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
    overflow: hidden;
    /deep/ .treeBox .treeInfo {
      &[name='res'] span.treeText {
        max-width: calc(~'100% - 58px');
      }
    }
    .theTree {
      max-height: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .refresh {
      position: absolute;
      top: 13px;
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
      right: 13px;
      z-index: 1;
    }
    /deep/.el-tree {
      // top: 23px;
      padding-top: 23px;
    }
  }
  .middle {
    padding: 0px 10px;
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
