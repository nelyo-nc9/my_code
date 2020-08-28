<template>
  <div id="event">
    <div class="eventCon">
      <el-tabs v-model="activeName" @tab-click="tabsClick" type="card">
        <el-tab-pane label="门禁事件" name="first">
          <div class="incident">
            <div class="tableLeft" :style="{'width':EventList.length == 0 ? '100%' : '75%'}">
              <el-table
                :stripe="true"
                :data="EventList .slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                @row-click="currtRow"
                @row-dblclick="dbCurrtClick"
                ref="multipleTable"
                border
                height="220"
                tooltip-effect="dark"
              >
                >
                <el-table-column width="80" type="selection"></el-table-column>
                <el-table-column width="80" label="序号" type="index"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="channelName" width="120" label="门禁通道"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="deviceName" width="120" label="所属设备"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="locationName" width="120" label="所属重点部位"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="orgName" width="120" label="所属机构"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="eventTypeName" width="120" label="事件类型"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="personName" label="对象"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop width="150" label="时间">
                  <!-- startTime -->
                  <template slot-scope="scope">
                    <span>{{scope.row.startTime | toTiME}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="aaa" v-if="EventList.length > 0">
              <div class="user">
                <img :src="picBuffer" alt />
              </div>
              <div class="info">
                <ul>
                  <li v-for="(item, index) in userInfo" :key="index">
                    <span>{{item.title}} :</span>
                    <span>{{item.content}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="block">
              <video-pagination
                ref="listPagination"
                :total="EventList.length"
                @paginationConfChange="eventpaginationConfChange"
              ></video-pagination>
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 25, 50, 100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="EventList.length"
            ></el-pagination> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="门禁报警" name="second">
          <div class="alarm">
            <el-table
              :stripe="true"
              :data="alarmEvent.slice((currentPageAlarm - 1) * AlarmPagesize, currentPageAlarm * AlarmPagesize)"
              border
              style="width: 100%"
              :row-class-name="tableRowClassName"
              @row-click="clickRow"
              @row-dblclick="handledbClick"
              height="220"
              tooltip-effect="dark"
            >
              >
              <el-table-column prop="date" width="80" type="selection"></el-table-column>
              <el-table-column prop="id" width="80" label="序号" type="index"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="channelName" width="120" label="门禁通道"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="deviceName" width="140" label="所属设备"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="locationName" width="120" label="所属重点部位"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="orgName" width="120" label="所属机构"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="eventTypeName" label="报警类型"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop="personName" label="对象"></el-table-column>
              <el-table-column sortable show-overflow-tooltip prop width="150" label="时间">
                <template slot-scope="scope">
                  <span>{{scope.row.startTime | toTiME}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPageAlarm"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="AlarmPagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="alarmEvent.length"
              ></el-pagination> -->
                 <video-pagination
                ref="listPagination"
                :total="alarmEvent.length"
                @paginationConfChange="alarmpaginationConfChange"
              ></video-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="门禁控制"
      :visible.sync="dialogVisible"
      width="1115px"
      custom-class="dialog-message"
      :before-close="handleClose"
      top="12vh"
      append-to-body
      v-if="dialogVisible"
      @close="closeDialog"
    >
      <iframe
        v-if="dialogVisible"
        style="width:100%;height: 100%;position:absolute;top:0;left: 0;z-index: -2;"
      ></iframe>
      <div class="message-content">
        <div class="con-left">
          <div class="video-top">
            <preview-plugin :defaultPane="defaultPane" :iconShow="iconShowParams" ref="preview"></preview-plugin>
          </div>
          <div class="message-footer">
            <div class="message-list" v-for="(item, index) in isMessage" :key="index">
              <span class="title">{{ item.name }}</span>
              <span class="message">
                <span>所属机构：{{ item.orgName }}</span>
                <span>型号：{{ item.modelNum }}</span>
              </span>
              <span class="message">
                <span>所属重点部位：{{ item.keyPartName }}</span>
                <span>品牌：{{ item.brand }}</span>
              </span>
              <span class="message">
                <span>所属门禁主机：{{ item.deviceName }}</span>
                <span>备注：</span>
              </span>
            </div>
          </div>
        </div>
        <div class="con-right">
          <div class="tab-top">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频设备" name="1">
                <div class="isBor" v-for="(item, index) in video" :key="index">
                  <i class="el-icon-video-camera"></i>
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                    <span @click="preview(item)">{{ item.name }}</span>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="门禁控制" name="2">
                <!-- guardItem -->
                <!-- v-for="(item, index) in guard" :key="index"  -->
                <div class="name">
                  <span class="name-title">
                    <i class="el-icon-refrigerator"></i>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="guardItem.name"
                      placement="top-start"
                    >
                      <span>{{ guardItem.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose" v-if="guardItem.status !== 2" @click="openDoor(guardItem)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose" v-if="guardItem.status === 2" @click="closeDoor(guardItem)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲控制" name="3">
                <div v-for="(item, index) in audio" :key="index" class="name">
                  <span class="name-title">
                    <i class="el-icon-microphone"></i>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.name"
                      placement="top-start"
                    >
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="audo" style="display:flex">
                    <i
                      class="el-icon-microphone"
                      v-if="item.status === 2"
                      @click="startTalking(item, index)"
                    ></i>
                    <i class="el-icon-turn-off-microphone" v-else @click="stopTalking(item, index)"></i>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="输出设备" name="4">
                <div v-for="(item, index) in output" :key="index" class="name">
                  <span class="name-title">
                    <i class="el-icon-location-outline"></i>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.name"
                      placement="top-start"
                    >
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span
                    class="opClose"
                    v-if="item.status === 2"
                    @click="alarmAccessOpen(item, index)"
                  >
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span
                    class="opClose"
                    v-if="item.status === 1"
                    @click="alarmAccessClose(item, index)"
                  >
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="footer-close">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  openAccess,
  closeTheflor,
  getPassageway,
  openVideo,
  offVideo,
  alarmOpen,
  AlarmClose,
  getMac,
  accessEventAlarm,
  accessAlarm,
  // getPassageway
} from '@src/http/access/event'
// import {  } from '../../../../http/access/event'
import socket from '@src/socket/alarm'
import { time } from '@src/view/accessControl/components/formData.js'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  filters: {
    toTiME: function (value) {
      if (!value) return ''
      let val
      val = (value + '000') * 1
      return time(val)
    },
  },
  components: {
    previewPlugin: () => import('@src/view/videoManage/preview/school/previewPlugin'),
    popUps: () => import('@src/view/accessControl/accessAdmin/components/event.vue'),
    VideoPagination
  },
  data() {
    return {
      currentPageAlarm: 1,
      AlarmPagesize: 25,
      currentPage: 1, //初始页
      pagesize: 25, //
      tableHeight: 200,
      video: [], //视频列表
      audio: [], //音频列表
      guard: [], //门禁列表
      output: [], //输出列表
      isMessage: [],
      picBuffer: '', // base64流IMG
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Videotape' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音
        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      defaultPane: 4,
      currtItem: [],
      alarmEvent: [], //报警事件
      EventList: [], //事件
      activeNames: ['1', '2', '3', '4'],
      fn: null,
      dialogVisible: false,
      activeName: 'first',
      tableData: [],
      tableDatas: [],
      userInfo: [
        { title: '卡号', content: '--' },
        { title: '姓名', content: '--' },
        { title: '性别', content: '--' },
        { title: '身份证', content: '--' },
        { title: '部门', content: '--' },
        { title: '职务', content: '--' },
      ],
      currtRows: {},
      isMessage: [],
      videoDevList: [],
      doorDevList: [],
      audioList: [],
      outChannelList: [],
      myMikeIdData: '',
      seqId: '',
      currtItem: [],
      names: '',
      openBody: {},
    }
  },
  methods: {
    alarmpaginationConfChange(data){
      this.currentPageAlarm = data.page
      this.AlarmPagesize = data.limit
    },
    eventpaginationConfChange(data){
      this.currentPage = data.page
      this.pagesize = data.limit
    },
    closeDialog() {
      // this.getTableList(1)
    },
    /**
     * @description: 视频开流
     * @param: Object
     * @return:  无
     */
    preview(val) {
      let data = {
        channel: val.serise,
        devIp: val.ip,
        devCport: val.cport,
        devDport: val.dport,
        streamType: 'sub1',
      }
      this.$refs.preview.openPreview(data)
    },

    //报警开启
    alarmAccessOpen() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1',
      }
      alarmOpen(body).then((res) => {
        console.log('Log 报警开启?', res)
      })
    },
    //报警关闭
    alarmAccessClose() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1',
      }
      AlarmClose(body).then((res) => {
        console.log('Log 报警关闭?', res)
      })
    },
    //开启对讲
    openIntercom(item) {
      openVideo({ myMikeId: this.myMikeIdData.id, calledpanelIds: item.id }).then((res) => {
        this.seqId = res.data.data.seqId
      })
      return
      let callerInfo = {
        id: '111',
        ip: '192.168.14.208',
        port: 2048,
      }
      //面板
      let calledInfo = [
        {
          hostIp: '192.168.14.202',
          hostPort: 2046,
          hostId: '003',
          id: 1,
        },
      ]
      //麦克
      let mikeInfo = [
        {
          hostIp: '192.168.14.203',
          hostPort: 2046,
          hostId: '',
          id: '002',
        },
      ]
      callerInfo = JSON.stringify(callerInfo)
      calledInfo = JSON.stringify(calledInfo)
      mikeInfo = JSON.stringify(mikeInfo)
      let body = {
        serverId: '002',
        serverIp: '192.168.14.203',
        serverPort: '2046',
        callerInfo: callerInfo,
        calledInfo: calledInfo,
        // callerInfo,
        // calledInfo,
        // mikeInfo
      }
      openVideo(body).then((res) => {
        this.seqId = res.data.data.seqId
      })
    },
    //关闭对讲
    offIntercom() {
      // if (!this.seqId.trim()) return
      // let params = {
      //   seqId: this.seqId,
      //   serverIp: '002',
      //   serverPort: '2046',
      // }
      offVideo({ seqId: this.seqId, myMikeId: this.myMikeIdData.id }).then((res) => {
        console.log('Log 关闭对讲成功?', res)
      })
    },
    // 如何状态为关门 则调用开门
    open() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1',
      }
      /*  开门接口 */
      openAccess(body).then((res) => {
        /* 获取设备实时状态 */
      })
    },
    closeFlor() {
      let body = {
        devIp: '10.1.1.91',
        devPort: 9708,
        hostId: '228e86910a2349e9a7f17dab97cb8054',
        channelId: '228e86910a2349e9a7f17dab97cb8054_1',
      }
      closeTheflor(body).then((res) => {})
    },
    /* base 64 解码 fn */
    b64EncodeUnicode(str) {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode('0x' + p1)
        })
      )
    },

    /* 后期可能修改 接收事件报警后双击后自动启动视频 音频 报警等设备
    双击条件判断 
    */
    getEventList() {
      // debugger
      socket.on('eventGuardOrdinary', (data) => {
        console.log('Log ----------------------??门禁事件', data)
        this.EventList.push(Object.assign(data.alarmInfo, data.personInfo))
        let res = 'data:image/jpg;base64,' + this.EventList[0].picBuffer || ''
        this.picBuffer = res // 默认取值第一个buffer
      })
      /* 事件默认展示 obj */
      let firstObj = {}
      firstObj = this.EventList[0]
      if (firstObj) {
        let { personName, gender, cardId, group, deptName, dentityNo } = firstObj
        this.userInfo = [
          { title: '卡号', content: cardId || '--' },
          { title: '姓名', content: personName || '--' },
          { title: '性别', content: gender || '--' },
          { title: '身份证', content: cardId || '--' },
          { title: '部门', content: dentityNo || '--' },
          { title: '职务', content: deptName || '--' },
        ]
      }
    },
    /* 后期可能修改 接收事件报警后双击后自动启动视频 音频 报警等设备 */
    getAlarmList() {
      socket.on('alarmGuardOrdinary', (data) => {
        console.log('Log --------------------查看socket 数据', data)
        this.alarmEvent.push(Object.assign(data.alarmInfo, data.personInfo))
      })
    },

    handleChange(val) {
      // console.log(val)
    },
    clickRow(val) {
      // console.log(val)
    },
    handledbClick() {},
    tabsClick(val) {
      console.log(val)
    },
    // 双击进入弹窗下方左侧显示的内容
    /**
     * @description: 双击事件打开弹窗
     * @param {type}: boolean
     * @return:  无
     */
    dbCurrtClick(row, column, event) {
      this.$emit('diaoOpen', row)
      let { personName, gender, cardId, deptName, dentityNo, jobName } = row
      this.userInfo = [
        { title: '卡号', content: cardId || '--' },
        { title: '姓名', content: personName || '--' },
        { title: '性别', content: gender || '--' },
        { title: '身份证', content: dentityNo || '--' },
        { title: '部门', content: deptName || '--' },
        { title: '职务', content: jobName || '--' },
      ]
      // 弹窗左侧内容
      let list = [
        { title: '门禁通道', content: row.channelName },
        { title: '所属设备', content: row.deviceName },
        { title: '类型', content: row.eventTypeName },
        { title: '所属重点部位', content: row.locationName },
        { title: '所属机构', content: row.orgName },
        { title: '报警类型', content: row.eventTypeName },
      ]
      this.picBuffer = 'data:image/jpg;base64,' + row.picBuffer
      this.userInfo.picBuffer = 'data:image/jpg;base64,' + row.picBuffer
      // this.dialogVisible = true
      /* -------------------------------------------------------------------- */
      this.isMessage = [row]
      this.video = []
      this.audio = []
      this.output = []
      this.guard = [row]
      // this.dialogVisible = true
      // 当前点击的门信息
      this.guardItem = row
      let params = {
        ref: 2,
      }
      // 获取门禁关联的主机和设备展示
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${row.id}`, params).then((res) => {
        console.log('Log-------------=========================', res)
        this.guard = res.data.data.guard // 门禁
        this.audio = res.data.data.audio // 对讲
        this.output = res.data.data.output // 输出设备
        this.video = res.data.data.video // 视频
      })
    },

    /**
     * @description: 门禁事件单机 获取当前点击row的信息展示
     * @param {type}: Object
     * @return: 无
     */
    currtRow(tab, event) {
      /* 门禁事件右侧userInfo arr */
      let { personName, gender, cardId, deptName, dentityNo, jobName } = tab
      this.userInfo = [
        { title: '卡号', content: cardId || '--' },
        { title: '姓名', content: personName || '--' },
        { title: '性别', content: gender || '--' },
        { title: '身份证', content: dentityNo || '--' },
        { title: '部门', content: deptName || '--' },
        { title: '职务', content: jobName || '--' },
      ]
      // 弹窗左侧内容
      let list = [
        { title: '门禁通道', content: tab.channelName },
        { title: '所属设备', content: tab.deviceName },
        { title: '类型', content: tab.eventTypeName },
        { title: '所属重点部位', content: tab.locationName },
        { title: '所属机构', content: tab.orgName },
        { title: '报警类型', content: tab.eventTypeName },
      ]
      // base64单独赋值
      this.picBuffer = 'data:image/jpg;base64,' + tab.picBuffer
      this.userInfo.picBuffer = 'data:image/jpg;base64,' + tab.picBuffer
    },
    tableRowClassName({ row, rowIndex }) {},
    handleSizeChange(val) {
      this.pagesize = val
      this.AlarmPagesize = val
    },
    handleCurrentChange(val) {
      this.currentPageAlarm = val
      this.currentPage = val
    },
    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
    },
    isDiao(va) {
      this.currtItem = [
        { title: '所属机构:', text: va.orgName },
        { title: '所属设备：', text: va.name },
        { title: '型号:', text: va.modelNum || '--' },
        { title: '所属重点部位:', text: va.keyPartName },
        { title: '品牌:', text: va.brand || '--' },
        { title: '备注:', text: 'xxx' },
      ]
      this.dialogVisible = true
    },
    handleClose(done) {
      this.fn = done
      this.dialogVisible = false
      if (!this.dialogVisible) done()
    },
  },
  created() {
    let mac = []
    let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
    macs.forEach((v) => mac.push(v.mac))
    getMac({ mac: mac.join(',') }).then((res) => {
      this.myMikeIdData = res.data.data
    })
  },
  mounted() {
    this.getEventList()
    this.getAlarmList()
    getPassageway({
      devIp: '10.1.1.91',
      devPort: 9708,
      hostId: '228e86910a2349e9a7f17dab97cb8054',
      channelId: '228e86910a2349e9a7f17dab97cb8054_1',
    }).then((res) => {})
    this.handleClose(() => {})
    // this.$nextTick(function () {
    //   this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 350
    //   let that = this
    //   window.onresize = function () {
    //     that.tableHeight = window.innerHeight - that.$refs.multipleTable.$el.offsetTop - 350
    //   }
    // })
  },
  beforeDestroy() {
    socket.remove('eventGuardOrdinary', (data) => {})
    socket.remove('alarmGuardOrdinary', (data) => {})
  },
  watch: {},
}
</script>

<style lang="less" scoped>
#event {
  margin-top: 30px;
  .eventCon {
    width: 100%;
    padding: 10px;
    box-shadow: 0 0 10px #ccc inset;
    .incident {
      display: flex;
      .tableLeft {
        width: 75%;
      }
      .aaa {
        box-shadow: 0 0 10px #ccc inset;
        right: 0px;
        top: 1px;
        flex: 1;
        display: flex;
        border-radius: 5px;
        padding: 30px;
        .user {
          width: 40%;
          float: left;
          width: 40%;
          height: 150px;
          border: 1px solid #e6e6e6;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          flex: 1;
          height: 100%;
          border-left: 1px solid #e6e6e6;
          ul {
            width: 60%;
            float: left;
            padding: 20px 20px;
            li {
              // height
              height: 30%;
              list-style: none;
              line-height: 20px;
            }
          }
        }
      }
    }

    .block {
      text-align: right;
      margin: 20px 0;
      margin-left: -190px;
    }

    .alarm {
      // width: 100%;
      .block {
        text-align: right;
        margin: 20px 0;
        margin-left: -190px;
      }
    }
    /deep/ .is-active {
      border-top: 2px solid #2d72d3;
    }
  }
  /deep/ .el-dialog__header {
    text-align: center;
    font-weight: 700;
  }
  /deep/ .el-dialog__body {
    background: #e6e6e6;
  }
  .diao {
    width: 1200px;
    overflow: hidden;
    background: #d7d7d7;

    .videoCon {
      // border: 1px solid red;
      overflow: hidden;
      font-family: fantasy;

      .videoLeft {
        overflow: hidden;
        width: 80%;
        height: 600px;
        // border: 1px solid yellow;
        // display: inline-block;
        float: left;
        margin-right: 20px;
        .videoContent {
          text-align: center;
          line-height: 250px;
          height: 250px;
          // background: violet;
        }
        .iconList {
          text-align: center;
          // height: 50px;
          // line-height: 50px;
          padding: 10px 0;
          .iconBox {
            .iconItem {
              display: inline-block;
              margin: 0 10px;
            }
          }
        }
        .videoItem {
          float: left;
          width: 450px;
          height: 290px;
          // border: 1px solid turquoise;
          margin: 5px;
          background: #fff;
        }
      }
      .videoFooter {
        margin-top: 50px;
        float: left;
        height: 130px;
        width: 100%;
        background: #fff;
        // width: 700px;
        div {
          margin: 10px;
          height: 100px;
          list-style: none;
          overflow: hidden;
          text-align: center;
          ul {
            width: 800px;
            height: 100px;
            margin-left: 50px;
            li {
              width: 50%;
              float: left;
              text-align: left;
              line-height: 20px;
            }
          }
        }
      }
      .videoRight {
        overflow: auto;
        width: 18%;
        // overflow: hidden;
        height: 600px;
        background: #fff;
        float: left;
        // padding: 0 10px;
        /deep/ .el-collapse-item__content .isBor {
          border-bottom: 1px solid #e6e6e6;
        }
        /deep/ .el-collapse-item__content .isBor:last-child {
          border-bottom: none;
        }
        /deep/ .el-collapse-item__content div {
          // padding-left: 10px;
          padding: 5px 10px;
        }
        /deep/ .el-collapse-item__header {
          padding-left: 10px;
          border-bottom: 2px solid #e6e6e6;
        }
        /deep/ .el-collapse-item__content {
          padding-bottom: 0 !important;
        }
        .rightContent {
          // overflow-y: auto;
        }
        .btns {
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
  }
}
/deep/ .dialog-message {
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 687px;
  .el-dialog__header {
    height: 54px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;
    padding: 0;
    line-height: 54px;
    display: flex;
    align-items: center;
    .el-dialog__title {
      font-size: 14px;
      color: #333;
    }
  }
  .el-dialog__body {
    height: calc(~'100% - 54px');
    padding: 0;
    .message-content {
      display: flex;
      justify-content: space-between;
      height: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      .con-left {
        width: 828px;
        height: 100%;
        border-right: 1px solid #e1e1e1;
        .video-top {
          height: 516px;
          width: 100%;
        }
        .message-footer {
          width: 100%;
          border-top: 1px solid #e1e1e1;
          min-height: 95px;
          padding-top: 11px;
          box-sizing: border-box;
          display: flex;
          padding-bottom: 10px;
          justify-content: space-between;
          .message-list {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            .title {
              margin-bottom: 13px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              position: relative;
            }
            .title::after {
              content: '';
              display: block;
              width: 2px;
              height: 12px;
              background: #2d72d3;
              position: absolute;
              left: -10px;
              top: 2px;
            }
            .message {
              span {
                display: inline-block;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 24px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
              span:nth-child(1) {
                width: 180px;
                margin-right: 50px;
              }
              span:nth-child(2) {
                width: 100px;
                margin-right: 50px;
              }
            }
          }
        }
      }
      .con-right {
        width: 223px;
        height: 651px;
        .tab-top {
          width: 100%;
          height: 490px;
          overflow: auto;
          /deep/ .el-collapse {
            border-top: none;
            border-bottom: none;
            .el-collapse-item {
              .el-collapse-item__header {
                height: 24px;
                font-size: 12px;
                padding-bottom: 10px;
                box-sizing: border-box;
                border-bottom: 1px solid #e1e1e1;
                margin-bottom: 5px;
              }
              .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                  padding: 0;
                  .isBor {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 13px;
                    cursor: pointer;
                    display: flex;
                    i {
                      margin-right: 8px;
                    }
                    span {
                      width: 181px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                  }
                  .name {
                    display: flex;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 19px;
                    cursor: pointer;
                    justify-content: space-between;
                    .name-title {
                      display: flex;
                      i {
                        line-height: 19px;
                      }
                      span {
                        width: 140px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                    }
                    .opClose {
                      width: 49px;
                      height: 19px;
                      display: flex;
                      border: 1px solid rgba(45, 114, 211, 1);
                      border-radius: 9px;
                      color: #666;
                      background: #fff;
                      .size {
                        display: block;
                        font-size: 10px;
                        transform: scale(0.83);
                        width: 100%;
                        height: 100%;
                        text-align: center;
                      }
                      span {
                        width: 50%;
                        text-align: center;
                        line-height: 19px;
                        font-size: 10px;
                      }
                      span:nth-child(1) {
                        border-top-left-radius: 9px;
                        border-bottom-left-radius: 9px;
                      }
                      span:nth-child(2) {
                        border-top-right-radius: 9px;
                        border-bottom-right-radius: 9px;
                      }
                      .active {
                        background: #2d72d3;
                        color: #fff;
                      }
                    }
                    .audo {
                      font-size: 16px;
                    }
                  }
                }
              }
            }
          }
        }
        .footer-close {
          width: 100%;
          height: calc(~'100% - 490px');
          border-top: 1px solid #e1e1e1;
          display: flex;
          align-items: center;
          justify-content: center;
          /deep/ .el-button {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>