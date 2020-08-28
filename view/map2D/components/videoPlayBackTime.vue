<template>
  <div class="right">
    <div class="timeDiv">
      <p>&#12288;历史录像</p>
      <div class="middleTime">
        <!-- <Calendar
          width="260"
          @range="daterange"
          style="margin:0 auto;"
          ref="calender"
          :daterange="!isCenter"
          :curNode="calenderObj"
        ></Calendar> -->
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
          <el-button type="primary" style="width:160px" size="small" @click="searchData">检索</el-button>
        </div>
      </div>
      <div class="bottomList" v-if="!isCenter && showList">
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
                  <i @click.stop="handleEdit(scope.$index, scope.row)" class="icon iconfont icon-xiazai"></i>
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
          <VideoPagination
            ref="pagination"
            @paginationConfChange="pageChangeResult"
            :showSolt="false"
            :total="paginationTotal"
          ></VideoPagination>
        </div>
      </div>
    </div>
    <span class="specialOne close" @click="backRightTime(0)">
      <i class="el-icon-arrow-right" style="color:#666666;font-weight:700"></i>
    </span>
    <span class="specialOne open" @click="backRightTime(1)">
      <i class="el-icon-arrow-left" style="color:#666666;font-weight:700"></i>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Calendar from '../../videoManage/playback//playBackPlugin/BScalendar'
import BStimePicker from '../../videoManage/playback/playBackPlugin/BStimePicker'
import VideoPagination from '../../videoManage/components/VideoPagination'
export default {
  name: 'videoPlayBackTime',
  components: { Calendar, BStimePicker, VideoPagination },
  data() {
    return {
      isCenter: false, //   false：前端回放   true：中心回放,
      calenderObj: {}, // 日历请求的对象
      showList: true, // 是否显示前端时间列表
      paginationTotal: 0, // 列表项总数
      qianDuanList: [
        {
          channel: 2,
          fileName: '',
          startTime: 1596297600,
          endTime: 1596340860,
          fileSize: 16065997,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596340860,
          endTime: 1596380400,
          fileSize: 9159969,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596384000,
          endTime: 1596427260,
          fileSize: 11214630,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596427260,
          endTime: 1596466800,
          fileSize: 11435099,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596470400,
          endTime: 1596513660,
          fileSize: 15106781,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596513660,
          endTime: 1596553200,
          fileSize: 11429197,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596556800,
          endTime: 1596600060,
          fileSize: 14494552,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596600060,
          endTime: 1596639600,
          fileSize: 11697582,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596643200,
          endTime: 1596686460,
          fileSize: 13797309,
          streamType: 1,
          recordType: 1
        },
        {
          channel: 2,
          fileName: '',
          startTime: 1596686460,
          endTime: 1596723026,
          fileSize: 11243590,
          streamType: 1,
          recordType: 1
        }
      ], // 前端列表
      // 右侧开关
      backRightTime(n) {
        this.$refs.pluginP.clickResize()
        if (n === 0) {
          this.rightWidth = 0
        } else {
          this.rightWidth = 300
        }
      },
      columnsBottom: [
        { prop: 'startTime', label: '开始时间', width: '100px' },
        { prop: 'timeLang', label: '时长', width: '' },
        { prop: 'fileSize', label: '大小', width: '' },
        { prop: 'fileType', label: '类型', width: '' }
      ], // 前端数据获取的数据列表类型
      videoTypeList: [
        { value: 'all', label: '全部' },
        { value: 'manualRecord', label: '手工录像' },
        { value: 'timeRecord', label: '定时录像' },
        { value: 'event', label: '事件录像' },
        { value: 'recordFlag', label: '智能录像' }
      ] // 录像可选择的类型
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['nowWeatherListInfo'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['getWeatherApiSubInfoByUrl']),
    // 前端播放时候时间插件范围选择
    daterange(range) {
      // 时间插件前端回放时候的范围选择
      this.rangeTime = range
      console.log(this.rangeTime, '时间范围')
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
    },
    pageChangeResult(obj) {
      console.log(obj, 'ooooooo22')
      this.currentPageObj = obj
      this.searchData()
    },
    // 单击前端播放列表的下载按钮
    handleEdit(index, row) {
      // console.log(this.$store.state.sysParametersCof.downLoadVideoPath,'下载地址')
      let strFileDir = this.path + '\\' + 'download.txt'
      console.log(strFileDir, 'strFileDir')
      let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
      console.log(creatDir, 'creatDir')
      if (creatDir) {
        this.$notify({
          title: '警告',
          message: '创建目录文件失败',
          type: 'warning'
        })
        return
      }
      this.$notify({
        title: '警告',
        message: `录像开始下载,下载路径为${this.path}`,
        type: 'warning'
      })
      const time = new Date().getTime()
      row.dPort = 8000
      // row.path = 'D:\\BC8100\\Download'
      row.path = this.path
      row.channelName = this.currentSelectObj.name
      console.log('==下载传参==')
      console.log(row)
      downloadDev(row, time + index, this.path)
    },
    // 点击检索按钮
    async searchData() {
      // 异步时，不出现复选框，机构树有焦点
      // 同步时，勾选复训框，机构树无焦点
      // TODO: 异步ipc设备
      if (
        (!this.isShowCheckBox && (!this.currentSelectObj || this.currentSelectObj.tierType !== 'res')) ||
        (this.isShowCheckBox &&
          this.$refs.treeDiv.getCheckedNodes(true, true).some(item => item.tierType === 'res') === false)
      ) {
        this.$notify({
          title: '警告',
          message: '请选择一个通道',
          type: 'warning'
        })
        return
      }
      // if (!this.isCenter) {
      //   this.$refs.pluginP.stopBackALL()
      // }
      // 如果是同步回放，只允许同一回放流程（中心回放或前端回放）
      if (this.isSync) {
        if (!this.isSameType) {
          console.log('!this.isSameType')
          // this.$refs.treeDiv.refresh()
          // thid.$refs.treeDiv.setCheckedNodes(this.nodeKeysList)
          return
        }
      }
      let _this = this
      // setTimeout(() => {
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
      // 同步回放
      if (this.isShowCheckBox) {
        // 出现复选框时，getCheckedNodes()才可选择到节点信息
        var arr = this.$refs.treeDiv.getCheckedNodes(true, true)
        console.log(arr, '--叶子节点--')
        arr.forEach(item => {
          let curNode = this.$refs.treeDiv.getNode(item.nodeKey)
          if (curNode.parent.data.type === 1) {
            // 前端设备
            let obj = {
              ...item,
              recordType: 'all',
              rowId: 1,
              rowCount: 5,
              startTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
              endTime: parseInt(this.rangeTime.endDate.getTime() / 1000),
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
          } else {
            // 中心设备
            let obj = {
              ...item,
              recordType: 'all',
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
              isCenter: true
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
            this.$notify({ title: '警告',
              message: '精确时间不能超过当前时间！',
              type: 'warning'})
            return
          }
          let newEndTime
          const _date = new Date(this.dateVal)
          _date.setHours(23)
          _date.setMinutes(59)
          _date.setSeconds(59)
          newEndTime = parseInt(_date.getTime() / 1000)
          let sendArr = []
          arrCenter.forEach((v, i) => {
            var param = v
            param.startTime = Date.parse(this.dateVal) / 1000
            param.endTime = newEndTime
            sendArr.push(param)
          })
          console.log(sendArr, '同步中心参数')
          this.$refs.pluginP.openPlayback(sendArr)
        } else {
          // 新写前端同步回放逻辑

          // 前端录像查询
          let queryVideoEvent = []
          let queryList = []
          for (const iterator of arrNotCenter) {
            const query = {
              ...iterator,
              name: iterator.name,
              devIp: iterator.devIp,
              devPort: iterator.devPort,
              cPort: iterator.cPort,
              channel: iterator.channel,
              recordType: 0, // 查询全部
              startTime: iterator.startTime,
              endTime: iterator.endTime,
              streamType: 'all',
              devType: 1 // 查询前端回放
            }
            queryList.push(query)
            queryVideoEvent.push(queryData(query))
          }
          let frontVideo = await Promise.all(queryVideoEvent)
          const { minTime, minTimeIndex } = this.findVideoTimeMin(frontVideo)
          // 把录像播放时间改成查询录像段的范围
          queryList = queryList.map((item, index) => {
            item.endTime = frontVideo[index][frontVideo[index].length - 1].endTime
            item.startTime = frontVideo[index][0].startTime
            return item
          })
          this.$refs.pluginP.syncPlayback(queryList, minTime, minTimeIndex, frontVideo)
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
            this.$notify({ title: '警告',
              message: '精确时间不能超过当前时间！',
              type: 'warning'})
            return
          }
          let newEndTime
          const _date = new Date(this.dateVal)
          _date.setHours(23)
          _date.setMinutes(59)
          _date.setSeconds(59)
          newEndTime = parseInt(_date.getTime() / 1000)
          const param = {
            ...this.currentSelectObj,
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
            this.$notify({ title: '警告',
              message: '请选择日期范围',
              type: 'warning'})
            return
          }
          var qianduanEtime =
            this.rangeTime.startDate === this.rangeTime.endDate
              ? parseInt(new Date(this.rangeTime.endDate).setHours(23, 59, 59) / 1000)
              : parseInt(this.rangeTime.endDate.getTime() / 1000)
          var qianduanStimeVal = new Date(this.rangeTime.startDate)
          qianduanStimeVal.setHours(this.timeVal.getHours())
          qianduanStimeVal.setMinutes(this.timeVal.getMinutes())
          qianduanStimeVal.setSeconds(this.timeVal.getSeconds())
          qianduanStimeVal = parseInt(qianduanStimeVal / 1000)
          if (this.dateVal.getTime() > new Date().getTime()) {
            this.$notify({ title: '警告',
              message: '精确时间不能超过当前时间！',
              type: 'warning'})
            return
          }
          if (_this.value !== 'all' && _this.value !== 'timeRecord') {
            console.log(_this.value, '====_this.value')
            this.$notify({ title: '警告',
              message: '目前仅支持筛选定时和全部录像，请重新选择！',
              type: 'warning'})
            return
          }
          const param = {
            ...this.currentSelectObj,
            // recordType: 'all',
            rowId: this.currentPageObj.page,
            rowCount: this.currentPageObj.limit,
            // sTime: parseInt(this.rangeTime.startDate.getTime() / 1000),
            startTime: qianduanStimeVal,
            endTime: qianduanEtime,
            streamType: this.currentSelectObj.streamType,
            channel: Number(this.currentSelectObj.channel),
            devIp: this.currentParentNode.devIp,
            devPort: this.currentParentNode.devPort,
            isCenter: this.isCenter,
            recordType: _this.value === 'all' ? 0 : 1 // 0:全部 1:定时 目前接口仅支持全部和定时
          }
          console.log('--异步前端--')
          console.log(param)
          // 是前端回放先获取数据列表
          var res = Promise.resolve(getQianDuanList(param))
          res.then(Vb => {
            // if(!Vb || !Vb.recordInfo || Vb.recordInfo.length === 0){
            //   this.$refs.pagination.setPaginationConfig({page:1,limit:20})
            // }
            console.log(Vb, 'Vb qianduan res')
            if (Vb.recordInfo.length !== 0) {
              this.paginationTotal = Vb.recordInfo.length
              this.$refs.pagination.setTotal(20)
              Vb.recordInfo.forEach((v, i) => {
                var obj = {
                  fileType: formatRecordType(v.recordType), // 录像类型，智能录像等
                  timeLang: formatSpendTime(v.startTime, v.endTime),
                  startTime: Vue.moment(v.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  endTime: Vue.moment(v.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  fileSize: byteConversion(v.filesize), // 录像文件大小
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
      // this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      // }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.right {
  position: absolute;
  width: 546px;
  height: 509px;
  top: 0px;
  left: 680px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(174, 174, 174);
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
    text-align: left;
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
</style>
