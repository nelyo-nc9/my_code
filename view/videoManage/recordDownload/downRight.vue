<template>
  <div class="down-box">
    <div class="down-right-top">
      <div class="box-title">
        <span class="pointer" @click="toggleOpen('searchCondition')">
          查询结果
          <i
            :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
        </span>
      </div>
      <div
        v-if="dropdownStatus.searchCondition"
        style="max-height:770px"
        :style="{height: dropdownStatus.searchResult? '330px':'770px','margin-bottom': dropdownStatus.searchResult? '50px':'0px'}"
      >
        <el-table
          stripe
          size="medium"
          :data="topTableData"
          @select="selectTableData"
          @select-all="selectALLTable"
          height="100%"
          max-height="715"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="80"></el-table-column>
          <el-table-column
            v-for="(column, index) in columnsTop"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center"
            :resizable="resizable"
          ></el-table-column>
        </el-table>
        <div class="btns">
          <div class="button-box">
            <el-button size="mini" :disabled="selectTableDataList.length == 0" @click="toAddData">下载</el-button>
            <el-button
              size="mini"
              :disabled="selectDownListDataList.length == 0 "
              @click="cancelDown"
            >取消</el-button>
            <el-button
              size="mini"
              :disabled="selectDownListDataList.length == 0 "
              @click="clearDown"
            >清除</el-button>
          </div>
          <video-pagination ref="searchPagination" @paginationConfChange="pageChangeList" :total="downLoadData.length"></video-pagination>
        </div>
      </div>
    </div>
    <div class="down-right-bottom">
      <div class="box-title">
        <span class="pointer" @click="toggleOpen('searchResult')">
          下载列表
          <i :class="dropdownStatus.searchResult ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
        <div
          v-if="dropdownStatus.searchResult"
          :style="{height: dropdownStatus.searchCondition? '330px':'770px'}"
        >
          <el-table
            stripe
            size="medium"
            :data="bottomTableData"
            @select="selectDownListData"
            @select-all="selectAllDownListData"
            @row-dblclick="dbRestart"
            :row-class-name="rowClassName"
            height="100%"
            max-height="715"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="80"></el-table-column>
            <el-table-column
              v-for="(column, index) in columnsBottom"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
          <video-pagination ref="searchPagination" @paginationConfChange="pageChangeResult" :total="downListData.length"></video-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  // getQianDuanList,
  // checkVideoList,
  byteConversion,
  formatRecordType
  // downloadDev
} from '../playback/playBackPlugin/playback.js'
// import axios from 'axios'
import VideoPagination from '../components/VideoPagination'
import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction.js'
import { getDevType, newDownloadDev, getCompleteData } from '@src/components/videoPlugin/playback/common/plginInMethod.js'
export default {
  name: 'downRight',
  components: {
    VideoPagination
  },
  props: {
    // 从index获取的是否是中心状态
    isCenter: {
      type: Boolean,
      default: false
    },
    searchType: { // 查询类型
      type: String,
      default: ''
    }
  },
  computed: {
    topTableData() {
      return this.downLoadData.slice((this.currentPageObjList.page - 1) * this.currentPageObjList.limit, this.currentPageObjList.page * this.currentPageObjList.limit)
    },
    bottomTableData() {
      let a = this.downListData.slice((this.currentPageObjResult.page - 1) * this.currentPageObjResult.limit, this.currentPageObjResult.page * this.currentPageObjResult.limit)
      return a
    }
  },
  mounted() {
    // this.timed = setInterval(() => {
    //   this.downListData.forEach(async(item) => {
    //     let newStatus = await this.getPre(item)
    //     console.log(newStatus, 'newStatus++++++++++++++++++++++++')
    //     // let oldStastus = ''
    //     if (item.downStatus !== ('0%' || '0.0%') && item.downStatus !== '--' && newStatus === ('0%' || '0.0%')) {
    //       newStatus = item.downStatus
    //     }
    //     if (item.state === '下载失败' && item.downStatus === '--') {
    //       newStatus = '下载失败'
    //     }
    //     if (item.downStatus === '100%' || item.downStatus === '100.0%' || item.downStatus === '100.0%') {
    //       item.state = '下载完成'
    //     }
    //     this.updateStatus({
    //       id: item.__id,
    //       downStatus: newStatus || item.downStatus
    //     })
    //   })
    // }, 1000)
    this.timed = setInterval(async() => {
      let completeArr = getCompleteData()
      for (let i = 0; i < this.downListData.length; i++) {
        let item = this.downListData[i]
        let newStatus = await this.getPre(item)
        console.log(newStatus, 'newStatus++++++++++++++++++++++++')
        // let oldStastus = ''
        if (item.downStatus !== ('0%' || '0.0%') && item.downStatus !== '--' && newStatus === ('0%' || '0.0%')) {
          newStatus = item.downStatus
        }
        if (item.state === '下载失败' && item.downStatus === '--') {
          newStatus = '下载失败'
        }
        if (item.downStatus === '100%' || item.downStatus === '100.0%' || item.downStatus === '100.0%') {
          item.state = '下载完成'
          continue
        }
        if (completeArr.includes(item.__id)) {
          newStatus = '100%'
        }
        this.updateStatus({
          id: item.__id,
          downStatus: newStatus || item.downStatus
        })
      }
    }, 1000)
  },
  data() {
    return {
      timed: null, // timed计时器
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      }, // 查询结果的查询条件开关状态
      total: 0, // 页数
      resizable: false, // 文本框是否支持拖拽
      columnsTop: [
        { prop: 'channelName', label: '通道名称', width: '' },
        { prop: 'fileType', label: '文件类型', width: '' },
        { prop: 'startTime', label: '开始时间', width: '' },
        { prop: 'endTime', label: '结束时间', width: '' },
        { prop: 'fileSize', label: '文件大小', width: '' }
        // { prop: 'check', label: '查看', width: '' },
      ], // 查询条件表头类型
      columnsBottom: [
        { prop: 'channelName', label: '通道名称', width: '' },
        { prop: 'fileType', label: '文件类型', width: '' },
        { prop: 'startTime', label: '开始时间', width: '' },
        { prop: 'endTime', label: '结束时间', width: '' },
        { prop: 'fileSize', label: '文件大小', width: '' },
        { prop: 'downStatus', label: '下载进度', width: '' }
      ], // 查询结果的表头类型
      downListData: JSON.parse(window.localStorage.getItem('downListDataArr')) || [], // 查询条件的table数据
      cancleDown: JSON.parse(window.localStorage.getItem('cancleDown')) || [], // 取消下载的列表
      selectTableDataList: [], // 选中要下载的数据
      selectDownListDataList: [], // 选中下载结果的数据
      currentPageObjList: {
        limit: 100,
        page: 1
      },
      currentPageObjResult: {
        limit: 100,
        page: 1
      },
      downLoadData: [], // 加入下载的数据
      startDate: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(), // 开始时间
      endDate: new Date() // 默认结束时间
    }
  },
  methods: {
    async getDataFromIndex(startDate, endDate) {
      this.startDate = startDate
      this.endDate = endDate
      // 录像下载都带复选框，可以使用getCheckedNodes()
      let arr = []
      if (this.$parent.activeName === 'first') {
        arr = this.$parent.$refs.treeDiv.getCheckedNodes(true, true).filter(itm => {
          return itm.tierType === 'res'
        })
      } else {
        arr = this.$parent.$refs.fav.getCheckedNodes(true, true).filter(itm => {
          return itm.tierType === 'res'
        })
      }
      console.log(arr, '--下载arr--')
      if (!arr.length) {
        this.$message('请选择通道！')
        return
      }
      let arrData = []
      arr.forEach(item => {
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
          recordType: this.searchType,
          devPort: item.devCport, // 设备端口，
          channel: Number(item.channel), // 设备通道
          startTime: parseInt(this.startDate.getTime() / 1000),
          endTime: parseInt(this.endDate.getTime() / 1000),
          streamType: streamTypeObj[item.streamType] || 'main' // 码流类型（main,sub）
        }
        obj.devType = getDevType(item)
        // if (obj.devType === 1) { // 前端非国标查询要将对应录像类型转换
        //   let rTypeObj = {
        //     'all': 0,
        //     'timeRecord': 1,
        //     'eventRecord': 2,
        //     'manualRecord': 3,
        //     'intelligentRecord': 4
        //   }
        //   obj.recordType = rTypeObj[this.searchType]
        // }
        // let vTArr = ['manualRecord', 'intelligentRecord']
        // // let vTArr = []
        // if (obj.devType === 1 && vTArr.includes(this.searchType)) { // 前端非国标目前只能查询全部和定时、事件录像
        // } else {
        //   arrData.push(obj)
        // }
        arrData.push(obj)
      })
      this.downLoadData = []
      // let objdata = {} // 去重对象
      // arrData.forEach((vv, i) => {
      //   console.log(vv, this.searchType, '+++++++++++++++++++++++++++++++++++')
      //   var res = Promise.resolve(queryData(vv))
      //   console.log(res, 'vediolist+++++++++++++++++++')
      //   res.then(vB => {
      //     // 返回的查询列表数据
      //     vB.forEach((v) => {
      //       var obj = {
      //         channelName: vv.name,
      //         fileName: vv.name,
      //         fileType: formatRecordType(v.recordType || v.eventType),
      //         startTime: Vue.moment(v.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
      //         endTime: Vue.moment(v.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
      //         fileSize: byteConversion(v.fileSize),
      //         // event: v,
      //         downStatus: 0,
      //         result: vv
      //       }
      //       if (!obj[objdata]) { // 去重
      //         obj[objdata] = objdata
      //         this.downLoadData.push(obj)
      //       }
      //     })
      //   })
      // })
      //
      let qDataArr = []
      arrData.forEach((vItem) => {
        qDataArr.push(queryData(vItem))
      })
      let res = await Promise.all(qDataArr)
      let allList = []
      res.forEach((vvt, vvi) => {
        vvt && vvt.forEach(v => {
          let vv = arrData[vvi]
          let obj = {
            channelName: vv.name,
            fileName: vv.name,
            fileType: formatRecordType(v.recordType || v.eventType),
            startTime: Vue.moment(v.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
            endTime: Vue.moment(v.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
            fileSize: byteConversion(v.fileSize),
            // event: v,
            downStatus: 0,
            result: vv
          }
          allList.push(obj)
        })
      })
      this.downLoadData = allList
      console.log('chaknyibu')
    },
    pageChangeResult(obj) {
      this.currentPageObjResult = obj
      // console.log(this.currentPageObjResult, '下下面查询列表的obj')
    },
    pageChangeList(obj) {
      this.currentPageObjList = obj
      // this.getDataFromIndex(this.startDate, this.endDate)
    },
    // 更新进度
    updateStatus(payload) {
      this.downListData.forEach(item => {
        if (item.__id === payload.id) {
          console.log(item, payload, '==item==')
          console.log(payload.downStatus, '==更新进度==')
          item.downStatus = payload.downStatus
          if (payload.downStatus === '100%' || payload.downStatus === '100.0%' || payload.downStatus === '100.00%') {
            item.state = '下载完成'
          }
        }
      })
    },
    // 查询条件和查询结果的点击开关
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    selectTableData(s, row) {
      this.selectTableDataList = s
    },
    // 选中的下载列表数据
    selectDownListData(s, row) {
      this.selectDownListDataList = s
    },
    // 点击下载按钮
    toAddData() {
      let getLocalConf = JSON.parse(window.localStorage.getItem('confParam')) // 获取localStorage中的参数
      let confPath = getLocalConf ? getLocalConf.downLoadVideoPath : 'D:\\BC8100\\Download'
      // let confPath = 'D:\\BC8100\\Download'
      let strFileDir = confPath ? confPath + '\\download.txt' : 'D:\\BC8100\\Download\\download.txt'
      console.log(strFileDir, 'strFileDir++++++++++++++++++')
      let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
      console.log(creatDir, 'creatDir')
      if (creatDir) {
        this.$message({
          message: '创建目录文件失败',
          type: 'warning'
        })
        return
      }
      // this.path = 'D:\\BC8100\\Download'
      this.path = confPath || 'D:\\BC8100\\Download'
      this.$message({
        message: `录像开始下载,下载路径为${this.path}`,
        type: 'warning'
      })
      const time = new Date().getTime()
      let sTList = JSON.parse(JSON.stringify(this.selectTableDataList))
      sTList.forEach((item, index) => {
        // item.isCenter = this.isCenter
        item.path = this.path
        Promise.resolve(newDownloadDev(item, time + index, item.path)).then(vB => {
          this.downListData = vB
        })
      })
    },
    // 取消下载
    closeDown(data) {
      this.downListData.forEach(val => {
        if (data === val.dumpHandle) {
          this.cancleDown.push(JSON.parse(JSON.stringify(val)))
          val.reDumpHandle = val.dumpHandle
          val.downStatus = '--'
          val.dumpHandle = ''
        }
      })
      window.localStorage.setItem('cancleDown', JSON.stringify(this.cancleDown))
      window.localStorage.setItem('downListDataArr', JSON.stringify(this.downListData))
    },
    // 双击下载列表项中被取消下载的行，可以重新开始下载
    dbRestart(row, column, event) {
      console.log(row, column, event, '双击列表')
      if (row.downStatus === '100%') { return }
      this.cancleDown.forEach((val, index) => {
        if (row.reDumpHandle === val.dumpHandle && (row.downStatus !== '100%' && row.downStatus !== '100.0%' && row.downStatus !== '100.00%')) {
          this.downListData.forEach((item, index) => {
            if (row.index === index) {
              console.log(row.index, item, val, '更改状态和句柄获取行号')
              item.downStatus = val.downStatus
              item.dumpHandle = val.dumpHandle
              item.reDumpHandle = ''
              row.downStatus = val.downStatus
              row.dumpHandle = val.dumpHandle
              // 重新开始下载
              let getLocalConf = JSON.parse(window.localStorage.getItem('confParam')) // 获取localStorage中的参数
              let confPath = getLocalConf ? getLocalConf.downLoadVideoPath : 'D:\\BC8100\\Download'
              let strFileDir = confPath ? confPath + '\\download.txt' : 'D:\\BC8100\\Download\\download.txt'
              let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
              console.log(creatDir, 'creatDir')
              if (creatDir) {
                this.$message({
                  message: '创建目录文件失败',
                  type: 'warning'
                })
                return
              }
              this.path = confPath || 'D:\\BC8100\\Download'
              this.$message({
                message: `录像开始重新下载,下载路径为${this.path}`,
                type: 'warning'
              })
              const time = new Date().getTime()
              console.log(row, '项目')
              // row.result = row.openParam
              // row.streamType="main"
              // item.result = {
              //   channel: item.openParam.channel,
              //   devIp: item.openParam.devIp,
              //   devPort: item.openParam.devPort,
              //   eTime: item.openParam.endTime,
              //   fileName: '',
              //   recordType: item.fileType === '定时录像' ? 1 : 0,
              //   sTime: item.openParam.startTime,
              //   streamType: item.openParam.streamType
              // }
              Promise.resolve(newDownloadDev(item, time + index, this.path)).then(vB => {
                vB[index] = vB[vB.length - 1] // 将新的下载状态更新到列表当前行中，并删除最后一项
                vB.pop()
                this.downListData = vB
                window.localStorage.setItem('downListDataArr', JSON.stringify(this.downListData))
              })
            }
          })
          this.cancleDown.splice(index, 1)
          window.localStorage.setItem('cancleDown', JSON.stringify(this.cancleDown))
        }
      })
    },
    // filesizeConversion(filesize) {
    //   const TB = 1024 * 1024 * 1024
    //   const GB = 1024 * 1024
    //   const MB = 1024
    //   var [unit] = filesize.match(/[a-zA-Z]+/)
    //   var conver = unit === 'Tb' ? TB : unit === 'Gb' ? GB : unit === 'Mb' ? MB : 1
    //   var size = (parseFloat(filesize) * conver).toFixed(2)
    // },
    // 获取行数
    rowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 获取进度
    async getPre(item) {
      if (item.dumpHandle) {
      }
      const handler = parseInt(item.dumpHandle)
      const timeInfo = await JSON.parse(document.getElementById('global-plugin').GetRecordDumpTime(handler))
      if (timeInfo.success) {
        const curInfo = await JSON.parse(document.getElementById('global-plugin').GetRecordDumpCurTime(handler))
        console.log(curInfo, 'curInfo++++++++++++++++')
        if (curInfo.success) {
          const alltime = timeInfo.msEnd - timeInfo.msBegin
          const cur = curInfo.msCur
          let dev = 0
          if (alltime > 600000) {
            dev = 60000
          } else if (alltime > 3600000) {
            dev = 300000
          }
          let res = parseFloat((((cur - timeInfo.msBegin) / (alltime - dev)) * 100).toFixed(2))
          if (res >= 100) {
            res = 100.0
          } else if (res <= 0) {
            res = 0.0
          }
          // GetRecordDumpCurTime返回的当前时间小于视频结束时间，有些许偏差，下载完成也不能获取到100%，一般在99.48%之上
          if (res >= 99) {
            res = 100.0
          }
          // console.log(res,'下载进度百分比')
          return res + '%'
        }
      } else {
        // console.log('句柄为',item.dumpHandle,'的下载获取开始和结束时间失败')
      }
    },
    // 调集取消响应事件
    cancelDown() {
      this.selectDownListDataList.forEach((v, i) => {
        const handler = parseInt(v.dumpHandle)
        document.getElementById('global-plugin').CloseRecordDump(handler)
        this.closeDown(v.dumpHandle)
      })
    },
    // 点击清除响应事件
    clearDown() {
      this.selectDownListDataList.forEach((vS, sI) => {
        this.downListData.forEach((vD, Vi) => {
          if (vS.dumpHandle === vD.dumpHandle) {
            this.downListData.splice(Vi, 1)
            window.localStorage.setItem('downListDataArr', JSON.stringify(this.downListData))
            const handler = parseInt(vD.dumpHandle)
            document.getElementById('global-plugin').CloseRecordDump(handler)
          }
        })
      })
    },
    // 点击表头复选框
    selectALLTable(selection) {
      this.selectTableDataList = selection
    },
    // 点击表头复选框
    selectAllDownListData(selection) {
      this.selectDownListDataList = selection
    }
  },
  beforeDestroy() {
    window.localStorage.setItem('downListDataArr', JSON.stringify(this.downListData))
    clearInterval(this.timed)
    this.timed = null
  }
}
</script>
<style lang='less'>
.down-box {
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #eee;
  }
  .el-table td {
    border: none;
  }
}
</style>
<style lang="less" scoped>
.down-box {
  width: 100%;
  height: 100%;
  .box-title {
    min-height: 35px;
    line-height: 35px;
  }
  .btns {
    height: 45px;
    line-height: 45px;
    width: 100%;
    display: flex;
    .button-box {
      margin-top: 5px;
    }
    .pagination-box {
      flex: 1;
    }
  }
}
</style>
