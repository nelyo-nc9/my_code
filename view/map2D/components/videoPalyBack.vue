<template>
  <div class="check-video-box">
    <div class="play-box" style="heigth:414px">
      <playback-plugin
        ref="pluginP"
        :simplenessMode="simplenessMode"
        :configuration="configuration"
        :defaultPane="defaultPane"
        :iconShow="iconShowParams"
      >
        <i
          slot="a"
          class="icon iconfont-ccb ccbshebeiguijihuifang"
          title="开启预览"
          @click="changePageType(palyNum, true)"
        ></i>
      </playback-plugin>
    </div>
    <div class="condition-box">
      <div class="condition">
        <span>&#12288;开始时间</span>
        <el-date-picker
          size="mini"
          v-model="startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <el-button size="small" @click="search">查询</el-button>
      </div>
      <div class="condition">
        <span>&#12288;结束时间</span>
        <el-date-picker
          size="mini"
          v-model="endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
        <el-button size="small" @click="download" :disabled="selectData.length === 0">下载</el-button>
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
        <VideoPagination
          ref="pagination"
          @paginationConfChange="pageChangeResult"
          :showSolt="false"
          :total="paginationTotal"
        ></VideoPagination>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../../videoManage//components/VideoPagination'
import PlaybackPlugin from '../../videoManage/playback/playBackPlugin/playBackPlugin'
import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction'
import {
  byteConversion,
  formatSpendTime,
  formatRecordType,
  downloadDev
} from '../../videoManage/playback/playBackPlugin/playback'
export default {
  name: 'CheckVideo',
  props: {
    showCheck: Boolean,
    videoInfo: Object,
    palyNum: Number
  },
  components: {
    VideoPagination,
    PlaybackPlugin
  },
  data() {
    return {
      columns: [
        { prop: 'startTime', label: '开始时间', width: '100px' },
        { prop: 'timeLang', label: '时长', width: '' },
        { prop: 'fileSize', label: '大小', width: '' },
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
          show: true,
          type: 'totaltime'
        },
        timeline: {
          show: false
        }
      },
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
        { type: 'left', index: 5, slotName: 'a', width: '100px' }, // 开启预览
        {
          type: 'left',
          index: 6,
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
      startTime: '',
      endTime: ''
    }
  },
  mounted() {
    this.resInfo = this.videoInfo.source
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
    search() {
      // 只实现前端非国标
      if (!this.endTime || !this.startTime) {
        this.$messageWarn('请选择时间！')
      }
      if (this.endTime <= this.startTime) {
        this.$messageWarn('开始时间不能大于等于结束时间！')
      }

      let endTime = new Date(this.endTime).getTime() / 1000
      let startTime = new Date(this.startTime).getTime() / 1000
      console.log('this.resInfo', this.resInfo, this.videoInfo)
      let params = {
        devIp: this.videoInfo.source.devIp,
        devPort: this.videoInfo.source.devCport,
        channel: this.videoInfo.source.channel,
        startTime: startTime,
        endTime: endTime,
        streamType: this.videoInfo.source.streamType,
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
        console.log(res)
        this.tableData = res.resourceList
        this.paginationTotal = res.total
      })
    },
    download() {
      // 下载
      let downPath = this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download'
      let strFileDir = downPath + '\\' + 'download.txt'
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
        message: `录像开始下载,下载路径为${downPath}`,
        type: 'warning'
      })
      const time = new Date().getTime()
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
        param.fileSize = byteConversion(item.fileSize)
        param.fileType = formatRecordType(item.fileType)
        downloadDev(param, time + index, downPath)
      })
    },
    select(s, row) {
      this.selectData = s
    },
    pageChangeResult(obj) {
      this.currentPageObj = obj
      this.searchData()
    },
    startPalyback(dataArr) {
      this.$refs.pluginP.openPlayback(dataArr)
    },
    doubleClick(row) {
      // var obj = row.result
      console.log(row, this.videoInfo.source, 'row--this.resInfo')
      let obj11 = {
        1: 'main',
        2: 'sub',
        3: 'sub1'
      }
      // obj.dPort = 8000
      // obj.isCenter = this.isCenter
      let param = {
        ...row,
        ...this.videoInfo.source,
        devPort: this.videoInfo.source.devCport,
        result: this.resInfo
      }
      param.streamType = obj11[param.streamType]
      param.channel = Number(param.channel)
      // 前端回放点击每一层
      console.log('11234', param)
      delete param.sipCode
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
    },
    changePageType() {
      this.$parent.changePageType(this.palyNum, true)
    }
  }
}
</script>
<style lang="less" scoped>
.ccbshebeiguijihuifang {
  font-size: 16px;
  margin-left: 7px;
}
.check-video-box {
  position: relative;
  width: 1061px;
  height: 600px;
  display: flex;
  .play-box {
    flex: 1;
    height: 600px;
    .title {
      width: 100%;
      text-align: center;
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
    background-color: white;
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
      height: calc(~'100% - 150px');
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
</style>
