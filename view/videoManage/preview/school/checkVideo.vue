<template>
  <el-dialog  class="quickTowall" title="视频复核" :visible.sync="copyFlag" width="1100px" :destroy-on-close="true"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :modal="isNeedModal"
      append-to-body>
    <iframe v-if="copyFlag" style="z-index:-2;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
    <div class="check-video-box">
      <div class="play-box">
        <div class="title">{{resInfo.orgName + '-' + resInfo.keyPartName}}  | {{resInfo.deviceName + '-' + resInfo.name}}</div>
        <div class="plugin-box">
          <playBackPlugin
            ref="pluginP"
            :iconShow="iconShowParams"
            :defaultPane="defaultPane"
            :previewData="previewData"
            :configuration="configuration" >
          </playBackPlugin>
        </div>
      </div>
      <div class="condition-box">
         <div class="condition">
          <span>开始时间</span>
          <el-date-picker
              size="mini"
              v-model="startTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          <el-button size="small"  @click="search">查询</el-button>
        </div>
        <div class="condition">
          <span>结束时间</span>
          <el-date-picker
              size="mini"
              v-model="endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
          <el-button size="small"  @click="download" :disabled="selectData.length === 0">下载</el-button>
        </div>
        <!-- 前端录像列表 -->
        <div id="tableVideo" class="table filterList">
          <div class="tbody">
            <el-table
              stripe
              size="medium"
              :data="tableData"
              height="100%"
              style="width: 100%"
              @select="select"
              @select-all="select"
              @row-dblclick="doubleClick"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column
                v-for="(column, index) in columns"
                :key="index"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :sortable="column.sortable"
                show-overflow-tooltip
                align="center"
                :formatter="formatterTable"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="pageNum">
          <VideoPagination ref="pagination" @paginationConfChange="pageChangeResult" :showSolt="false" :total="paginationTotal"></VideoPagination>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import VideoPagination from '../../components/VideoPagination'
// import PlaybackPlugin from '../../playback/playBackPlugin/playBackPlugin'
import playBackPlugin from '@src/components/alarmPlay/playBackPlugin/playBackPlugin'
import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction'
import { byteConversion, formatSpendTime, formatRecordType, downloadDev } from '../../playback/playBackPlugin/playback'
import { newDownloadDev } from '@src/components/videoPlugin/playback/common/plginInMethod'
export default {
  name: 'CheckVideo',
  props: {
    showCheck: Boolean,
    videoInfo: Object,
    isNeedModal: Boolean
  },
  components: {
    VideoPagination,
    // PlaybackPlugin,
    playBackPlugin
  },
  data() {
    return {
      columns: [
        { prop: 'startTime', label: '开始时间', width: '100px' },
        { prop: 'timeLang', label: '时长', width: '80px' },
        { prop: 'fileSize', label: '大小', width: '80px' },
        { prop: 'fileType', label: '类型', width: '' }
      ],
      tableData: [],
      selectData: [],
      paginationTotal: 0,
      currentPageObj: {
        limit: 100,
        page: 1
      },
      simplenessMode: true,
      configuration: {
        progressBar: {
          show: false
        },
        timeline: {
          show: true,
          passageName: false, // 是否配置通道名称功能
          step: 7 // 当前时间周期
        }
      },
      previewData: [], // 视频开流的入参数据
      defaultPane: 1,
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'Play'
        },
        {
          type: 'left',
          index: 1,
          name: 'Stop'
        },
        {
          type: 'left',
          index: 2,
          name: 'ZhuZhen'
        },
        {
          type: 'left',
          index: 3,
          name: 'PlaySpeed'
        },
        {
          type: 'left',
          index: 4,
          name: 'Download'
        },
        {
          type: 'left',
          index: 5,
          name: 'Volume'
        },
        {
          type: 'right',
          index: 0,
          name: 'FullScreen'
        }
      ],
      resInfo: {},
      startDate: '',
      endDate: '',
      startTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      endTime: new Date()
    }
  },
  mounted() {
    this.resInfo = this.videoInfo.source
    this.doubleOpenplayBack()
  },
  computed: {
    copyFlag: {
      get() {
        return this.showCheck
      },
      set() {}
    }
  },
  methods: {
    // 打开的时候直接执行插件的回放
    doubleOpenplayBack() {
      console.log(this.resInfo, this.videoInfo, '======================')
      let data = this.resInfo
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
        devCport: data.devCport,
        devDport: data.devDport,
        // channelId: '',
        streamType: streamTypeObj[data.streamType] || 'main', // 码流类型（main,sub）
        // alarmTime: '',
        // name: '',
        subType: data.subType,
        id: data.id,
        dId: data.dId,
        type: data.type,
        deviceName: data.deviceName,
        detail: data
      }
      this.previewData = [this.currentSelectObj]
      this.$nextTick(() => {
        this.$refs.pluginP.openPreviewData()
      })
      // this.currentSelectObj.devType = this.getDevType(data)
      // if (data.tierType === 'res') {
      //   // var womod = this.checkedPane //如果需求改成需要在焦点窗口开流，就加这一条
      //   this.currentParentNode = {
      //     devIp: data.devIp,
      //     devPort: data.devPort,
      //     type: data.type
      //   }

      //   // let param = {
      //   //   ...this.currentSelectObj,
      //   //   // recordType: 'eventRecord',
      //   //   // devPort: data.devCport, // 设备端口，
      //   //   // channel: Number(data.channel), // 设备通道
      //   //   startTime: parseInt((new Date().setHours(0, 0, 0) - 60 * 60 * 12 * 1000) / 1000), // 开始时间是当前日期0点
      //   //   endTime: parseInt(Date.parse(new Date()) / 1000), // 结束时间
      //   //   newStartTime: parseInt(new Date().setHours(0, 0, 0) / 1000)
      //   //   // streamType: streamTypeObj[data.streamType] || 'main' // 码流类型（main,sub）
      //   // }
      //   // param.devType = this.getDevType(data)
      //   // console.log(param, 'param36363636++++++')
      //   // this.$nextTick(() => {
      //   //   this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      //   //   this.$refs.pluginP.openBackVideo(param) // 进行回放录像
      //   //   // this.$refs.pluginP.openPlayback([param]) // 进行回放录像
      //   // })
      // }
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
    search() { // 只实现前端非国标
      if (!this.endTime || !this.startTime) {
        this.$messageWarn('请选择时间范围！')
        return
      }
      if (new Date(this.endTime).getTime() <= new Date(this.startTime).getTime()) {
        this.$messageWarn('开始时间不能大于等于结束时间！')
        return
      }
      let obj = {
        'main': 1,
        'sub': 2,
        'sub1': 3
      }
      let endTime = parseInt(new Date(this.endTime).getTime() / 1000)
      let startTime = parseInt(new Date(this.startTime).getTime() / 1000)
      let params = {
        devIp: this.resInfo.devIp,
        devPort: this.resInfo.devCport,
        channel: +this.resInfo.channel,
        startTime: startTime,
        endTime: endTime,
        streamType: obj[this.resInfo.streamType],
        page: this.currentPageObj.page,
        rows: this.currentPageObj.limit
      }

      if (this.resInfo.deviceType === 1 || this.resInfo.deviceType === 2) {
        params.devType = this.resInfo.sipCode ? 2 : 1
      } else {
        params.devType = this.resInfo.sipCode ? 4 : 3
      }
      params.devType = 1
      queryData(params, true).then(res => {
        this.tableData = res.resourceList
        this.paginationTotal = res.total
      })
    },
    download() { // 下载
      let downPath = this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download'
      let strFileDir = downPath + '\\' + 'download.txt'
      let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
      if (creatDir) {
        this.$message({
          message: '创建目录文件失败',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: `录像开始下载,下载路径为${downPath}`,
        type: 'warning'
      })
      const time = new Date().getTime()
      // console.log('------------', this.selectData)
      this.selectData.forEach((item, index) => {
        let param = {
          ...item,
          result: {
            ...this.resInfo,
            ...item
          },
          path: downPath,
          channelName: this.resInfo.name,
          startTime: this.$moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
          endTime: this.$moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        param.result.devPort = this.resInfo.devCport
        param.fileName = this.resInfo.name || this.resInfo.fileName
        param.fileSize = byteConversion(item.fileSize)
        param.fileType = formatRecordType(item.fileType)
        newDownloadDev(param, time + index, downPath)
      })
    },
    select(s, row) {
      this.selectData = s
    },
    pageChangeResult(obj) {
      this.currentPageObj = obj
      this.searchData()
    },
    doubleClick(row) {
      // var obj = row.result
      // console.log(row, this.resInfo, 'row--this.resInfo')
      // obj.dPort = 8000
      // obj.isCenter = this.isCenter
      let param = {
        ...row,
        ...this.resInfo,
        devPort: this.resInfo.devCport,
        result: this.resInfo
      }
      // 前端回放点击每一层
      this.$refs.pluginP.openPlayback([param])
      this.$refs.pluginP.setPlayType('file', row)
      // this.$refs.pluginP.setChannelName(this.resInfo.name)
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      switch (column.property) {
        case 'startTime':
          params = this.$moment(row.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
          break
        case 'endTime':
          params = this.$moment(row.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')
          break
        case 'fileSize':
          params = byteConversion(cellValue)
          break
        case 'timeLang':
          params = formatSpendTime(row.startTime, row.endTime)
          break
        case 'fileType':
          params = formatRecordType(cellValue)
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    handleClose() {
      this.copyFlag = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
  .check-video-box {
    position: relative;
    width: 100%;
    height: 600px;
    display: flex;
    .play-box {
      flex: 1;
      .title {
        width: 100%;
        text-align: center;
        height: 36px;
        line-height: 36px;
      }
      .plugin-box {
        width: 100%;
        height: calc(~'100% - 36px');
      }
    }
    .condition-box {
      width: 380px;
      height: 100%;
      padding: 26px 0 0 10px;
      .condition {
        height: 35px;
        margin: 10px 0;
        width: 100%;
      }
      .condition > span {
        width: 65px;
        line-height: 24px;
        color: #333;
      }
      .condition > * {
        display: inline-block;
      }
      .el-date-editor.el-input {
        width: 210px;
      }
      .pageNum {
        width: 100%;
        padding: 2px;
        overflow: hidden;
      }
      .bottomList {
        padding: 10px 10px 0px 20px;
        box-sizing: border-box;
      }
      .filterList {
        overflow-x: auto;
        height: calc(~'100% - 150px')
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
        height: 100%;
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
    }
  }
  .plugin-video{
    object{
      z-index: 100;
    }
  }
}
</style>
