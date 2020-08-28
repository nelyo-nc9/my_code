<!--
 * @Author: yanglei
 * @Date: 2020-05-29 16:10:35
 * @LastEditTime: 2020-08-25 13:36:27
 * @LastEditors: your name
 * @Description:file content
 * @FilePath: \ccb-client\client\src\view\coffersManage\remoteGuard\remoteGuard.vue
-->

<template>
  <div class="remote-guard-container">
    <div class="remote-row">
      <div class="remote-col video-container">
        <div class="grid-content" v-if="!showProcessingReq">
          <preview-plugin :defaultPane="defaultPane" :iconShow="iconShowParams" :pluginIconShow="pluginIconShow" @changeDefaultPane="changeDefaultPane" :moduleType="9" ref="preview">
            <!-- <span slot="inspectIcon" title="检查记录" class="iconfont icon-rizhi inspect-icon" @click="handleInspectClick"></span> -->
            <div slot="rightBtn" class="right-btn">
              <p v-show="talkBackInfo.iconStatus && talkBackInfo.talkStatus">{{ `${talkBackInfo.openParam.channel}正在对讲中...` }}</p>
              <span title="对讲" :class="[talkBackInfo.iconStatus ? 'iconfont-ccb ccbduijiangzhuangtai' : 'iconfont icon-sound-close disable']" @click="openTalkbackFun"></span>
              <span title="报警输出" class="iconfont icon-alarm-output" @click="signalOutput"></span>
            </div>
          </preview-plugin>
        </div>
        <div class="grid-content" v-else>
          <detailReqInfo :personInfoData="detailInfoData" :talkBackInfo="talkBackInfo" :callerInfo="callerInfo" @backOriginState="backAllReqlist" @changeDoor="changeDoorStatus" @setEventdata="setEventdata"></detailReqInfo>
        </div>
      </div>
      <div class="remote-col info-container">
        <div class="grid-content bg-purple-light">
          <div style="height: 100%;">
            <div class="table-container" ref="tableContainer">
              <!-- 当前请求信息卡片 -->
              <el-card shadow="never">
                <!-- <p>当前请求事件来源： 保定分行</p> -->
                <p class="source-text">{{ showProcessingReq ? '当前正在处理的事件来源' : '当前请求事件来源' }}： {{ showProcessingReq ? `${currentDoorStatus.organization} / ${currentDoorStatus.keySite}` : requestSource }}</p> <span title="查看重点部位信息" class="iconfont-ccb  ccbtishi" @click="showLocationInfoFun(currentDoorStatus.keySiteId || [...coffersGuardTable].pop().keySiteId, true)"></span>
                <br>
                <p>负责人： {{ LocationInfo.manager1 }} ｜ 电话：{{ LocationInfo.guardRoomPhone }} ｜ 地址：{{ LocationInfo.cofferAdd }}</p>
              </el-card>
              <!-- 金库值守 && 金库事件表格 -->
              <el-tabs type="border-card" v-model="tabsActiveName" @tab-click="tabsHandleClick">
                <el-tab-pane label="金库值守" name="guardTab">
                  <!-- 金库值守表格展示 -->
                  <el-table
                    :data="coffersGuardTable"
                    stripe
                    height="100%"
                    style="width: 100%"
                    @row-click="checkTalkback"
                    @row-dblclick="showProcessingPage"
                    :cell-style="guardTableCellStyle">
                    <el-table-column prop="organization" label="机构" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="keySite" label="重点部位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="channel" label="通道" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="状态" width="70" sortable
                      :sort-method="(prev, next) => prev.status.localeCompare(next.status)"></el-table-column>

                    <el-table-column prop="requestType" label="请求类型" width="100" sortable
                      :sort-method="(prev, next) => prev.requestType.localeCompare(next.requestType)"></el-table-column>

                    <el-table-column prop="time" label="时间" width="150" sortable
                      :sort-method="(prev, next) => $moment(prev.time).valueOf() - $moment(next.time).valueOf()"></el-table-column>

                    <el-table-column prop="progress" label="进度" width="70" sortable
                      :sort-method="(prev, next) => prev.progress.localeCompare(next.progress)"></el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="金库事件" name="eventTab">
                  <!-- 金库事件表格展示 -->
                  <el-table
                    :data="coffersEventTable"
                    stripe
                    height="100%"
                    style="width: 100%">
                    <el-table-column type="index" label="No" width="45"></el-table-column>
                    <el-table-column prop="organization" label="机构" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="keySite" label="重点部位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="entranceGuard" label="门禁" width="100" show-overflow-tooltip sortable
                      :sort-method="(prev, next) => prev.entranceGuard.localeCompare(next.entranceGuard)"></el-table-column>

                    <el-table-column prop="channel" label="通道" show-overflow-tooltip sortable
                      :sort-method="(prev, next) => prev.channel.localeCompare(next.channel)"></el-table-column>

                    <el-table-column prop="type" label="事件类型" width="100" sortable
                      :sort-method="(prev, next) => prev.type.localeCompare(next.type)"></el-table-column>

                    <el-table-column prop="time" label="发生时间" width="140" sortable
                      :sort-method="(prev, next) => $moment(prev.time).valueOf() - $moment(next.time).valueOf()"></el-table-column>

                    <el-table-column label="操作" width="60px" align="center">
                      <template slot-scope="scope">
                        <span class="iconfont-ccb ccbshebeiguijihuifang" @click="playbackBtnHandler(scope.$index, scope.row)"></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
              <span class="back-button iconfont-ccb ccbxiazuojiantou" v-if="showProcessingReq" @click="backAllReqlist()"></span>
            </div>

            <!-- 金库门状态列表 -->
            <div class="status-door-list">
              <doorStatusList :doorListData="doorListData" :currentDoorStatus="currentDoorStatus" :showProcessingReq="showProcessingReq" @setEventData="setEventdata"></doorStatusList>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看重点部位信息对话框 -->
    <el-dialog
      title="重点部位信息"
      :visible.sync="showLocationInfo"
      width="900px">
      <h2 class="location-info-title">金库信息</h2>
      <div class="location-info-container">
        <div class="form-item">
          <div class="item-label">金库名称</div>
          <div class="item-value">{{ LocationInfo.cofferName }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">金库地址</div>
          <div class="item-value">{{ LocationInfo.cofferAdd }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">所属机构</div>
          <div class="item-value">{{ LocationInfo.organize }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">守护室电话</div>
          <div class="item-value">{{ LocationInfo.guardRoomPhone }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">金库常务副主任</div>
          <div class="item-value">{{ LocationInfo.manager1 }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">移动电话</div>
          <div class="item-value">{{ LocationInfo.phone1 }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">金库副主任</div>
          <div class="item-value">{{ LocationInfo.manager2 }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">移动电话</div>
          <div class="item-value">{{ LocationInfo.phone2 }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">本级安保部门联系人</div>
          <div class="item-value">{{ LocationInfo.addident }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">移动电话</div>
          <div class="item-value">{{ LocationInfo.phone3 }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">属地派出所名称</div>
          <div class="item-value">{{ LocationInfo.localPolice }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">属地派出所电话</div>
          <div class="item-value">{{ LocationInfo.localPhone }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">辖区民警姓名</div>
          <div class="item-value">{{ LocationInfo.policeName }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">移动电话</div>
          <div class="item-value">{{ LocationInfo.policePhone }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">机构代码</div>
          <div class="item-value">{{ LocationInfo.organizeCode }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">备注</div>
          <div class="item-value">{{ LocationInfo.mark }}</div>
        </div>
        <div class="form-item">
          <div class="item-label">部位状态</div>
          <div class="item-value">{{ LocationInfo.localStatus }}</div>
        </div>
        <div class="form-item">
          <div class="item-label"></div>
          <div class="item-value"></div>
        </div>
      </div>
    </el-dialog>

    <!-- 报警输出确认框 -->
    <el-dialog
      title="报警输出确认"
      :visible.sync="showConfirmDialog"
      width="450px"
      :before-close="closeModal"
      class="confirm-opendoor-dialog">

      <span class="warning-icon">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#ccbjinggao"></use>
        </svg>
      </span>
      <!-- 请确认是否开启金库门？ -->
      <p>{{ "请确定要触发报警输出吗？" }}</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="showConfirmDialog = false">确 定</el-button> -->
        <el-button type="primary" @click="alarmOutputFun">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 检查记录对话框 -->
    <InspectionModal v-if="isShowInsModal" :showInspectDialog="isShowInsModal" @closeDialog="closeModal"></InspectionModal>

    <PlaybackVideo v-if="showPlaybackVideoModal" :showPlaybackVideo="showPlaybackVideoModal" :playbackParams="playbackParams" @closePlayback="closeModal"></PlaybackVideo>
  </div>
</template>

<script>
import doorStatusList from './doorStatusList'
import detailReqInfo from './detailReqInfo'
import InspectionModal from './InspectionModal'
import PlaybackVideo from '../components/PlaybackVideoModal'
import previewPlugin from '../../videoManage/preview/school/previewPlugin'

import {
  getGuardTableDataApi,
  getEventTableDataApi,
  // sendInspectDataApi,
  setGuardTableDataApi,
  setEventTableDataApi,
  getDoorStatusApi,
  answerTalkApi,
  openTalkApi,
  closeTalkApi,
  getAudioPlatformApi,
  getOrgInfoApi,
  alarmOutputApi } from '../../../http/coffersManage/remoteGuard.api.js'
import { getRelevCameraApi } from '../../../http/coffersManage/doorStatus.api.js'
import socket from '../../../socket/alarm'
import common from '../components/common'

export default {
  name: 'remoteGuard',
  mixins: [common],
  components: {
    doorStatusList,
    detailReqInfo,
    InspectionModal,
    PlaybackVideo,
    previewPlugin
  },
  data() {
    return {
      tabsActiveName: 'guardTab',
      // 视频下方icon配置
      iconShowParams: [
        { type: 'left', index: 0, name: 'MultiScreen' }, // 画面分割
        { type: 'left', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'left', index: 2, name: 'Stream' }, // 码流切换
        // { type: 'left', index: 3, slotName: 'inspectIcon' }, // 检查记录
        { type: 'left', index: 3, name: 'checkRecode' },
        { type: 'left', index: 4, name: 'Volume' }, // 音量

        { type: 'right', slotName: 'rightBtn', index: 0, width: '260px' }
      ],
      defaultPane: 9, // 默认显示9窗格
      pluginIconShow: {
        showBottomIcon: true, // 图标按钮条
        hidemenuIcon: true, // 隐藏
        previewStopIcon: true, // 关闭预览
        centreRecordIcon: true, // 紧急录像
        isRecordingIcon: true, // 录像类型
        streamChangeIcon: true, // 码流切换
        screenshot: true, // 截图
        muteIcon: true, // 开启伴音
        yuntaiIcon: true, // 云台
        speechIcon: true, // 对讲
        niaokanIcon: true, // 开启鸟瞰
        tvwallIcon: false, // 快速上墙
        quickRecodeIcon: true, // 快速回放
        videoCheckIcon: false, // 视频复核
        detailsIcon: true, // 详情
        quanpingfangdaIcon: true // 全屏
      },
      // 金库值守表格数据
      coffersGuardTable: [],
      // 金库事件表格数据
      coffersEventTable: [],
      // 处理后的所有刷卡人人员列表信息 (二维数组)
      reqStaffListData: [],
      // 点击值守表格行 传递给子组件的刷卡人信息列表
      detailInfoData: [],
      showProcessingReq: false, // 展示当前正在处理的请求事件界面
      isShowInsModal: false, // 展示检查记录对话框
      showPlaybackVideoModal: false, // 回放事件对话框
      requestSource: '', // 当前请求来源

      doorListData: [], // 传递给子组件的门禁状态列表数据
      currentDoorStatus: {}, // 传递给子组件的当前正在处理的门状态数据
      talkBackInfo: {
        iconStatus: false,
        openParam: {},
        talkStatus: false,
        seqId: '',

        mikeId: '',
        calledId: ''
      },
      callerInfo: {}, // MAC 关联台麦信息
      showConfirmDialog: false, // 显示报警输出确认框
      showLocationInfo: false,
      LocationInfo: {
        cofferName: '',
        cofferAdd: '',
        organize: '',
        guardRoomPhone: '', // 守护室电话
        manager1: '', // 金库常任副主任
        phone1: '',
        manager2: '', // 金库副主任
        phone2: '',
        addident: '', // 安保部门联系人
        phone3: '',
        localPolice: '', // 属地派出所名称
        localPhone: '',
        policeName: '', // 辖区民警姓名
        policePhone: '',
        organizeCode: '',
        mark: '', // 备注
        localStatus: '' // 状态
      },
      playbackParams: {}, // 回放组件传参
      guardCellChecked: {}
    }
  },
  mounted() {
    this.getRequestEventData()
    this.setTableContainerHeight()
    // 获取关联台麦信息
    getAudioPlatformApi({mac: JSON.parse(window.sessionStorage.getItem('macAddress')).adaptors.filter(item => item.ip !== '0.0.0.0')[0].mac})
      .then(res => {
        res = res.data.data
        this.callerInfo = res
        this.talkBackInfo.mikeId = res.id
      })
      .catch(() => {})
    window.addEventListener('resize', this.setTableContainerHeight)
  },
  methods: {
    /**
     * @description: 画面分割
     * @param {type} 无
     * @return {type} 无
     */
    changeDefaultPane(val) {
      this.defaultPane = val
    },
    /**
     * @description: 获取请求事件数据
     * @param {type} 无
     * @return: 无
     */
    async getRequestEventData() {
      try {
        this.coffersGuardTable = []
        this.reqStaffListData = []

        // **********************************************************************************************************
        let serverData = await getGuardTableDataApi({
          querys: [],
          page: {'page': 1, 'pageSize': 2000}
        })
        serverData = serverData.data.data

        let markData = {CommonPutRequestList: []}
        for (let i = 0; i < serverData.length; i++) {
          let item = serverData[i]
          if (item.startTime < this.$moment().startOf('day').unix()) { continue }
          if ([3000, 3005, 3014, 3031, 3033, 3035, 3039].includes(item.eventType)) {
            let personInfo = JSON.parse(item.personInfo.replace(/'/g, '"'))
            let params = {
              //! 基础信息
              id: item.id,
              // 值守表格数据
              organization: item.orgName,
              keySite: item.locationName,
              keySiteId: item.locationId, // 重点部位
              // channel: item.deviceName,
              channel: item.resourceName,
              status: '刷卡完成',
              type: '刷卡',
              // requestType: '刷卡', // 列表请求类型
              requestType: [3014, 3039].includes(item.eventType) ? '开门' : '刷卡', // 列表请求类型
              time: this.$moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
              progress: item.progress ? item.progress : '待处理',

              //! 刷卡人信息
              showPersonInfo: true,
              // 刷卡人卡片信息数据
              personInfo: {
                name: personInfo.personName, // 刷卡人姓名
                gender: personInfo.Gender, // 性别
                cardNum: personInfo.cardId, // 卡号
                identityCard: personInfo.dentityNo, // 身份证号
                tel: personInfo.Tel, // 电话号码
                group: personInfo.Group, // 组别
                // imgSrc: personInfo.picBuffer ? 'data:image/jpg;base64,' + personInfo.picBuffer : item.doorImage, // 图片
                imgSrc: item.doorImage, // 图片
                result: personInfo.result // 请求结果
              },
              // cameraInfo: item.action_dict ? item.action_dict.cameraInfo : {}, // 门禁通道关联镜头信息
              //! 门禁信息
              doorInfo: {
                deviceName: item.deviceName, // 设备名称
                // deviceId: item.deviceId, //! 设备ID 查询门禁关联接口需要
                deviceId: item.resourceId,
                devIp: personInfo.ip,
                devPort: personInfo.port,
                hostId: personInfo.hostId,
                channelId: personInfo.doorOrChanId
              },
              //! 关联视频信息
              videoInfo: {
                data: item.action_dict ? item.action_dict.cameraInfo : []
              },
              //! 关联对讲信息
              audioInfo: {
                data: item.action_dict ? item.action_dict.TalkInfo : []
              }
            }

            if ([3014, 3039].includes(item.eventType) && this.coffersGuardTable.length !== 0) { // 开门请求
              this.coffersGuardTable.find(item => item.keySiteId === params.keySiteId && item.doorInfo.channelId === params.doorInfo.channelId).requestType = '开门'
            }

            await this.disposeReqStaffData(params)
          } else {
            markData.CommonPutRequestList.push({
              putList: [{key: 'cofferAlarmState', value: '已处理'},
                {key: 'id', value: item.id}]
            })
          }
        }
        if (markData.CommonPutRequestList.length !== 0) {
          setGuardTableDataApi(markData)
            .then(res => {
              console.log(res.data.data.reply.msg)
            })
            .catch(() => {})
        }
        // **********************************************************************************************************
        // setTimeout(() => {
        //   // debugger
        //   this.eventGuardDispose({
        //     alarmInfo: {
        //       alarmName: 'F1静脉识别设备-二道门外远程关门请求',
        //       alarmSource: '本级报警',
        //       alarmState: 2,
        //       alarmType: 8,
        //       alarmTypeName: '门禁事件',
        //       cofferAlarmState: '待处理',
        //       dealState: 1,
        //       deviceId: 22,
        //       deviceName: '门禁控制器-一道门和二道门',
        //       doorImage: '/image/door/2020-08-11/TDXFWGXZWT20200811123946.jpg',
        //       eventType: 3039,
        //       eventTypeName: '远程关门请求',
        //       id: '8111120000385813',
        //       isAlarm: 2,
        //       isUpgrade: 'F',
        //       locationId: 7,
        //       locationName: '开发调测',
        //       orgName: '建行安徽省分行',
        //       resourceId: 82,
        //       resourceName: 'F1静脉识别设备-二道门外',
        //       startTime: 1597239403,
        //       subsystem: 3,
        //       subsystemName: '门禁子系统',
        //       talkRequest: 'F',
        //       type: '1'
        //     },
        //     personInfo: {hostId: '4414705a873f4aa3ab22e80a0ea1e344', doorOrChanId: '4414705a873f4aa3ab22e80a0ea1e344_1', doorNo: 1, cardId: '', personName: '张三', dentityNo: '1101', deptName: '', jobName: '', ip: '10.1.1.92', port: 9708, picBuffer: ''}
        //   })
        // }, 10000)
        // setTimeout(() => {
        //   this.eventGuardDispose({
        //     alarmInfo: {
        //       alarmName: 'F1静脉识别设备-二道门外远程关门请求',
        //       alarmSource: '本级报警',
        //       alarmState: 2,
        //       alarmType: 8,
        //       alarmTypeName: '门禁事件',
        //       cofferAlarmState: '待处理',
        //       dealState: 1,
        //       deviceId: 22,
        //       deviceName: '一级行监控中心金库防尾随门2进',
        //       channelName: '门禁控制器-一道门和二道门',
        //       doorImage: '/image/door/2020-08-11/TDXFWGXZWT20200811123946.jpg',
        //       eventType: 3039,
        //       eventTypeName: '远程关门请求',
        //       id: '8111120000385813',
        //       isAlarm: 2,
        //       isUpgrade: 'F',
        //       locationId: 7,
        //       locationName: '合肥天鹅湖支行',
        //       orgName: '中国建设银行股份有限公司安徽省分行',
        //       resourceId: 159,
        //       resourceName: 'F1静脉识别设备-二道门外',
        //       startTime: 1598996028,
        //       subsystem: 3,
        //       subsystemName: '门禁子系统',
        //       talkRequest: 'F',
        //       type: '1'
        //     },
        //     personInfo: {hostId: '4414705a873f4aa3ab22e80a0ea1e344', doorOrChanId: '4414705a873f4aa3ab22e80a0ea1e344_1', doorNo: 1, cardId: '', personName: '周', dentityNo: '', deptName: '', jobName: '', ip: '10.1.1.92', port: 9708}
        //   })
        // }, 5000)

        // setTimeout(() => {
        //   this.eventIntercomDispose({
        //     alarmInfo: {
        //       alarmName: 'T1台麦-办公区环境2请求对讲',
        //       alarmSource: '本级报警',
        //       alarmState: 2,
        //       alarmType: 8,
        //       alarmTypeName: '对讲事件',
        //       dealState: 1,
        //       deviceId: '37',
        //       deviceName: 'T1台麦-办公区环境2',
        //       channelName: 'T1台麦-办公区环境2',
        //       eventType: 2010,
        //       eventTypeName: '业务呼叫',
        //       id: '8111120000380010',
        //       ip: '10.2.1.71',
        //       locationId: 3,
        //       locationName: '省分行大楼',
        //       orgName: '建行安徽省分行',
        //       resourceId: 0,
        //       startTime: 1597220986,
        //       type: '3',
        //       talkHostId: '003',
        //       talk_host_ip: '10.2.1.91',
        //       talk_host_port: 2046,
        //       faceplateId: '110'
        //     }
        //   })
        // }, 5000)
        // setTimeout(() => {
        //   this.eventIntercomDispose({
        //     alarmInfo: {
        //       alarmName: 'T1IP网络对讲面板-应急指挥室内中心呼叫',
        //       alarmSource: '本级报警',
        //       alarmState: 2,
        //       alarmType: 8,
        //       alarmTypeName: '对讲事件',
        //       dealState: 1,
        //       deviceId: '45',
        //       deviceName: 'IP网络对讲终端主机1-办公区域',
        //       channelName: 'T1台麦-办公区环境2',
        //       eventType: 2009,
        //       eventTypeName: '客户呼叫',
        //       id: '8111120000380012',
        //       ip: '10.2.1.71',
        //       locationId: 4,
        //       locationName: '合肥监控指挥中心',
        //       orgName: '建行安徽省分行',
        //       resourceId: 0,
        //       startTime: 1597220986,
        //       type: '1',
        //       talkHostId: '005',
        //       talk_host_ip: '10.2.2.50',
        //       talk_host_port: 2046,
        //       faceplateId: 1
        //     }
        //   })
        // }, 6000)

        socket.on('eventGuardVault', data => {
          this.eventGuardDispose(data)
          console.log('门禁事件', data)
        })

        socket.on('alarmGuardVault', data => {
          this.eventGuardDispose(data)
          console.log('门禁报警', data)
        })

        socket.on('alarmIntercom', data => {
          // 对讲报警 - (对讲请求, 面板呼叫)
          this.eventIntercomDispose(data)
        })
        socket.on('eventIntercom', data => {
          this.eventIntercomDispose(data)
        })
      } catch (error) {
        console.log('websocket 连接失败', error)
      }
    },
    /**
     * @description: 门禁事件数据处理
     * @param {type} 门禁事件socket数据
     * @return: 无
     */
    eventGuardDispose(data) {
      // 3000：单卡刷卡 3005：多卡刷卡  3014：开门请求  3031：指纹验证通过  3033：静脉验证通过  3035：人脸验证  3039：开门请求
      if (![3000, 3005, 3014, 3031, 3033, 3035, 3039].includes(data.alarmInfo.eventType)) { return }
      let params = {
        //! 基础信息
        id: data.alarmInfo.id,
        // 值守表格数据
        organization: data.alarmInfo.orgName, // 机构
        keySite: data.alarmInfo.locationName, // 重点部位
        keySiteId: data.alarmInfo.locationId, // 重点部位
        channel: data.alarmInfo.channelName, // 通道
        status: '刷卡完成',
        type: '刷卡',
        requestType: [3014, 3039].includes(data.alarmInfo.eventType) ? '开门' : '刷卡', // 列表请求类型
        // requestType: '刷卡', // 列表请求类型
        time: this.$moment(data.alarmInfo.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') || this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        progress: data.alarmInfo.progress ? data.alarmInfo.progress : '待处理',

        //! 刷卡人信息
        showPersonInfo: true,
        // 刷卡人卡片信息数据
        personInfo: {
          name: data.personInfo.personName, // 刷卡人姓名
          gender: data.personInfo.gender, // 性别
          cardNum: data.personInfo.cardNum, // 卡号
          identityCard: data.personInfo.identityCard, // 身份证号
          tel: data.personInfo.tel, // 电话号码
          group: data.personInfo.group, // 组别
          imgSrc: 'data:image/jpg;base64,' + data.personInfo.picBuffer, // 图片
          result: data.personInfo.stast || '未知' // 请求结果  (这里的请求结果接口未返回，待处理)
        },
        //! 门禁信息
        doorInfo: {
          deviceName: data.alarmInfo.deviceName, // 设备名称
          // deviceId: data.alarmInfo.deviceId, //! 设备ID 查询门禁关联接口需要
          // resourceId
          deviceId: data.alarmInfo.resourceId, //! 设备ID 查询门禁关联接口需要
          devIp: data.alarmInfo.ip,
          devPort: data.alarmInfo.port,
          hostId: data.personInfo.hostId,
          channelId: data.personInfo.doorOrChanId
        },
        //! 关联视频信息
        // videoInfo: data.alarmInfo.action_dict ? data.alarmInfo.action_dict.cameraInfo : [],
        videoInfo: {
          data: data.alarmInfo.action_dict ? data.alarmInfo.action_dict.cameraInfo : []
        },
        //! 关联对讲信息
        audioInfo: {
          data: data.alarmInfo.action_dict ? data.alarmInfo.action_dict.TalkInfo : []
        },
        outputInfo: []
      }

      if ([3014, 3039].includes(data.alarmInfo.eventType) && this.coffersGuardTable.length !== 0) {
        // 开门请求
        this.coffersGuardTable.find(item => item.keySiteId === params.keySiteId && item.doorInfo.channelId === params.doorInfo.channelId).requestType = '开门'
      }

      this.disposeReqStaffData(params)

      // // 记录事件日志
      // this.recordLogFun({
      //   Mechanism: params.organization || '',
      //   KeyPart: params.keySite || '',
      //   AccessEquipment: params.deviceName || '',
      //   Access: params.channel || '',
      //   IntercomPanel: params.audioInfo.data.length !== 0 ? params.audioInfo.data[0].name : '',
      //   EventType: `${params.requestType}事件`,
      //   IpAddr: params.doorInfo.devIp || '',
      //   video: JSON.stringify({videoList: params.videoInfo.data, startTime: params.time}),
      //   UserName: params.personInfo.name || '',
      //   Time: params.time
      // }, 'event')
      // // 添加金库事件记录数据
      // setEventTableDataApi({
      //   CofferEventInfo: {
      //     // id: 1, // 事件id
      //     mechanism: params.organization, // 机构
      //     keyPart: params.keySite, // 重点部位
      //     ccessControl: params.doorInfo.deviceName, // 门禁
      //     passaGeway: params.channel, // 通道
      //     eventType: params.requestType, // 事件类型
      //     occurrenceTime: params.time, // 发生时间
      //     video: JSON.stringify({videoList: params.videoInfo.data, startTime: params.time})
      //   }
      // }).then(res => {
      //   // this.getEventTableDataFun()
      //   console.log(res)
      // })
      //   .catch(() => {})
    },
    /**
     * @description: 对讲事件数据处理
     * @param {type} 对讲事件socket数据
     * @return: 无
     */
    eventIntercomDispose(data) {
      if (data.alarmInfo.type !== '3') { return } // 判断是否是金库类型对讲请求

      let params = {
        id: data.alarmInfo.id,
        organization: data.alarmInfo.orgName, // 机构
        keySite: data.alarmInfo.locationName, // 重点部位
        keySiteId: data.alarmInfo.locationId, // 重点部位
        channel: data.alarmInfo.channelName, // 通道
        // deviceName: data.alarmInfo.deviceName || '', // 设备名称
        deviceId: data.alarmInfo.deviceId,
        status: this.coffersGuardTable.some(item => item.status === '请求开门') ? '排队' : '请求开门',
        type: '对讲',
        requestType: '对讲',
        time: this.$moment(data.alarmInfo.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') || this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        progress: data.alarmInfo.progress ? data.alarmInfo.progress : '待处理',

        // 刷卡人信息
        showPersonInfo: false,
        personInfo: {
          name: '', // 刷卡人姓名
          gender: '', // 性别
          cardNum: '', // 卡号
          identityCard: '', // 身份证号
          tel: '', // 电话号码
          group: '', // 组别
          imgSrc: '', // 图片
          result: ''
        },
        doorInfo: {
          deviceName: '',
          deviceId: '',
          devIp: '',
          devPort: '',
          hostId: '',
          channelId: ''
        },
        // 关联视频信息
        videoInfo: {
          data: data.alarmInfo.action_dict ? data.alarmInfo.action_dict.cameraInfo : []
        },
        // 关联对讲信息
        audioInfo: {
          data: data.alarmInfo.action_dict ? data.alarmInfo.action_dict.TalkInfo : []
        },
        callerInfo: {
          hostIp: data.alarmInfo.talk_host_ip,
          hostPort: data.alarmInfo.talk_host_port,
          hostId: data.alarmInfo.talkHostId,
          id: data.alarmInfo.faceplateId
        }
      }

      if (data.eventType === 2011) {
        // 接受对讲
        let findSameInd = this.coffersGuardTable.findIndex(item => item.keySiteId === params.keySiteId && item.type === params.type)
        this.coffersGuardTable[findSameInd].status = '请求开门'
        this.talkBackInfo.iconStatus = true
        this.talkBackInfo.talkStatus = true
        this.talkBackInfo.openParam = this.coffersGuardTable[findSameInd]
        return
      }

      if (data.eventType === 2012) {
        // 结束对讲推送
        // 结束对讲 数据清空 删除列表数据
        this.setEventdata(params)
        this.talkBackInfo = {
          iconStatus: false,
          talkStatus: false,
          openParam: {},
          seqId: '',
          mikeId: '',
          calledId: ''
        }
        return
      }
      this.disposeReqStaffData(params)
    },
    /**
     * @description: 处理刷卡人列表数据
     * @param {type} 无
     * @return: 无
     */
    async disposeReqStaffData(param) {
      // 值守列表没有数据 - 添加 - 播放预览
      if (this.coffersGuardTable.length === 0) {
        await this.findInfoFun(param) // 查找关联关系及门状态
        return
      }

      // 先判断是否存在具有相同属性的人员
      // 有-查找相同的添加  没有-添加一条新的并且值守列表中添加一条
      // organization: 机构  keySite: 重点部位  channel: 通道  type: 请求类型
      // let findSameInd = this.reqStaffListData.findIndex(item => item[0].keySiteId === param.keySiteId && item[0].type === param.type)
      let findSameInd = this.reqStaffListData.findIndex(item => item[0].keySiteId === param.keySiteId && item[0].doorInfo.channelId === param.doorInfo.channelId)
      if (param.type === '对讲') {
        findSameInd = this.reqStaffListData.findIndex(item => item[0].keySiteId === param.keySiteId && item[0].type === param.type)
      }

      if (findSameInd !== -1) {
        // 存在相同的 - 查找相同的添加
        let findSameItem = this.reqStaffListData[findSameInd][0]
        param.channel = findSameItem.channel
        param.doorInfo = findSameItem.doorInfo
        param.videoInfo = findSameItem.videoInfo
        param.audioInfo = findSameItem.audioInfo
        param.outputInfo = findSameItem.outputInfo

        this.reqStaffListData[findSameInd].push(param)
        this.recordEventDataFun(param)
      } else {
        // 不存在 - 直接添加 - 值守列表添加
        await this.findInfoFun(param)
      }
    },
    /**
     * @description: 查找缺少关联关系数据方法
     * @param {type} 无
     * @return {type} 无
     */
    async findInfoFun(param) {
      try {
        let randomId = `${Math.random()}_${param.id}` // 随机ID 查找用
        if (param.videoInfo.data.length === 0 || param.audioInfo.data.length === 0 || param.outputInfo.length === 0) {
          param.randomId = randomId
          let queryParam = param.type === '对讲' ? `${param.deviceId}?ref=2` : `${param.doorInfo.deviceId}?ref=2` // 主机ref=1 通道ref=2
          let relevant = await this.queryDoorCamera({queryParam, mode: param.type === '对讲' ? 1 : 2}) // 查询关联音视频、报警输出关系
          // param.channel = relevant.channel
          param.videoInfo.data = relevant.videoInfo
          param.videoInfo.randomId = randomId
          relevant.videoInfo.length === 0 ? this.$messageError('没有获取到关联镜头信息') : this.openPreviewFun(param.videoInfo.data[0])
          param.audioInfo.data = relevant.audioInfo
          param.audioInfo.randomId = randomId

          // param.outputInfo = relevant.output.map(item => ({deviceId: item.deviceId, deviceName: item.deviceName}))
          param.outputInfo = relevant.outputInfo
        }

        if (param.type !== '对讲') {
          // 非对讲请求 查询门状态
          let doorStatus = await this.queryDoorStatus({ // 查询门禁通道状态
            devIp: param.doorInfo.devIp,
            devPort: param.doorInfo.devPort,
            hostId: param.doorInfo.hostId
          })
          Object.assign(param.doorInfo, doorStatus, {randomId})

          this.doorListData.push({
            id: param.id,
            organization: param.organization,
            keySite: param.keySite,
            first: param.doorInfo.first,
            second: param.doorInfo.second
            // 门禁id
          })
        }

        // this.coffersGuardTable.push(param)
        // this.reqStaffListData.push([param])
        this.coffersGuardTable.push(this.$lodash.cloneDeep(param))
        this.reqStaffListData.push(this.$lodash.cloneDeep([param]))

        this.recordEventDataFun(param)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @description: 查询门状态
     * @param {type} 无
     * @return: 无
     */
    async queryDoorStatus(data) {
      try {
        let res = await getDoorStatusApi({...data})
        if (res.data.code === 0 && res.data.data !== undefined) {
          res = res.data.data
          return {
            first: Array.isArray(res) ? res[0].status === 'close' ? '关闭' : res[0].status === 'open' ? '开启' : '异常' : '未知',
            second: Array.isArray(res) ? res[1].status === 'close' ? '关闭' : res[1].status === 'open' ? '开启' : '异常' : '未知'
          }
        }
        return {first: '未知', second: '未知'}
      } catch (error) {
        console.log(error)
        return {first: '未知', second: '未知'}
      }
    },
    /**
     * @description: 查询门禁主机关联镜头
     * @param {type} 无
     * @return: 关联镜头信息
     */
    async queryDoorCamera(data) {
      try {
        let res = await getRelevCameraApi(data)
        res = res.data.data
        if (res !== null) {
          let videoInfo = res.video.map(item => ({
            channelName: item.deviceName,
            channelNum: item.serise,
            ip: item.deviceIp,
            port: item.devicePort,
            subType: item.class,
            dId: item.deviceId})) || []
          let audioInfo = res.audio.map(item => ({calledpanelIds: item.id, name: item.name})) || []
          let outputInfo = res.output.map(item => ({
            devIp: item.deviceIp,
            devPort: item.devicePort,
            outputNo: item.serise,
            deviceName: item.deviceName})) || []
          let channel = res.name
          return {videoInfo, audioInfo, outputInfo, channel}
        }

        return {videoInfo: [], audioInfo: [], outputInfo: [], channel: ''}
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @description: 播放预览视频方法
     * @param {type} 无
     * @return: 无
     */
    openPreviewFun(params) {
      if (params && params.length !== 0) {
        let param = {
          channel: Number(params.channelNum),
          devIp: params.ip,
          devCport: params.port,
          // devDport: params.port,
          streamType: 'main',
          subType: params.subType,
          dId: params.dId
        }
        // 在事件处理页面的情况 这里不用开流
        if (!this.showProcessingReq) {
          this.$refs.preview.openPreview(param)
        }
      }
    },
    /**
     * @description: 记录金库事件与请求事件日志方法
     * @param {type} 请求事件信息
     * @return {type} 无
     */
    recordEventDataFun(params) {
      // 记录事件日志
      this.recordLogFun({
        Mechanism: params.organization || '',
        KeyPart: params.keySite || '',
        AccessEquipment: params.doorInfo.deviceName || '',
        Access: params.channel || '',
        IntercomPanel: params.audioInfo.data.length !== 0 ? params.audioInfo.data[0].name : '',
        EventType: `${params.requestType}事件`,
        IpAddr: params.doorInfo.devIp || '',
        video: JSON.stringify({videoList: params.videoInfo.data, startTime: params.time}),
        UserName: params.personInfo.name || '',
        Time: params.time
      }, 'event')
      // 添加金库事件记录数据
      setEventTableDataApi({
        CofferEventInfo: {
          // id: 1, // 事件id
          mechanism: params.organization, // 机构
          keyPart: params.keySite, // 重点部位
          ccessControl: params.doorInfo.deviceName, // 门禁
          passaGeway: params.channel, // 通道
          eventType: params.requestType, // 事件类型
          occurrenceTime: params.time, // 发生时间
          video: JSON.stringify({videoList: params.videoInfo.data, startTime: params.time})
        }
      }).then(res => {
        // this.getEventTableDataFun()
      })
        .catch(() => {})
    },
    /**
     * @description: 金库值守表格单元格样式
     * @param {type} 无
     * @return: 无
     */
    guardTableCellStyle({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 6) {
        return row.progress === '处理中' ? 'color: #33CC66;' : row.progress === '待处理' ? 'color: #FF0000;' : ''
      }
    },
    /**
     * @description: 标签页切换事件
     * @param {type} 无
     * @return: 无
     */
    tabsHandleClick() {
      if (this.tabsActiveName === 'eventTab') {
        this.getEventTableDataFun()
      }
    },
    /**
     * @description: 获取金库事件表格数据
     * @param {type} 无
     * @return: 无
     */
    getEventTableDataFun() {
      getEventTableDataApi()
        .then(res => {
          this.coffersEventTable = []
          let resData = res.data.data.cofferEvent
          resData.forEach(item => {
            this.coffersEventTable.push({
              organization: item.mechanism,
              keySite: item.keyPart,
              entranceGuard: item.ccessControl,
              channel: item.passaGeway,
              type: item.eventType,
              time: item.occurrenceTime,
              id: item.id,
              video: item.video
            })
          })
        })
        .catch(() => {})
    },
    /**
     * @description: 双击金库值守表格行展示详情页面
     * @param {type} 无
     * @return: 无
     */
    showProcessingPage(row, column, event) {
      this.coffersGuardTable.forEach(item => {
        item.progress = '待处理'
      })
      row.progress = '处理中'
      // 给子组件传递当前行的刷卡人员信息列表
      this.detailInfoData = this.reqStaffListData.find(item => item[0].randomId === row.randomId)
      this.currentDoorStatus = {
        first: { status: this.detailInfoData[0].doorInfo.first },
        second: { status: this.detailInfoData[0].doorInfo.second }
      }
      getDoorStatusApi({
        devIp: this.detailInfoData[0].doorInfo.devIp,
        devPort: this.detailInfoData[0].doorInfo.devPort,
        hostId: this.detailInfoData[0].doorInfo.hostId
      })
        .then(res => {
          res = res.data.data
          this.currentDoorStatus = {
            organization: this.detailInfoData[0].organization,
            keySiteId: this.detailInfoData[0].keySiteId,
            keySite: this.detailInfoData[0].keySite,
            deviceName: this.detailInfoData[0].channel,
            first: {
              status: Array.isArray(res) ? res[0].status === 'close' ? '关闭' : res[0].status === 'open' ? '开启' : '异常' : '未知',
              channelId: res[0].chanelId
            },
            second: {
              status: Array.isArray(res) ? res[1].status === 'close' ? '关闭' : res[1].status === 'open' ? '开启' : '异常' : '未知',
              channelId: res[1].chanelId
            }
          }
        })
        .catch(() => {})
      // 更新重点部位信息
      this.showLocationInfoFun(row.keySiteId)
      this.showProcessingReq = true
    },
    changeDoorStatus(data) {
      this.currentDoorStatus.first.status = this.currentDoorStatus.first.channelId === data.channelId ? data.status : this.currentDoorStatus.first.status
      this.currentDoorStatus.second.status = this.currentDoorStatus.second.channelId === data.channelId ? data.status : this.currentDoorStatus.second.status
    },
    // 事件处理完成
    setEventdata(val, mode) {
      let guardIndex = this.coffersGuardTable.findIndex(item => item.randomId === val.randomId)

      if (mode === 'backAll') {
        // 标记已处理数据
        let markData = {CommonPutRequestList: []}
        let markDataArr = this.reqStaffListData.find(item => item[0].randomId === val.randomId)
        if (markDataArr && markDataArr.length !== 0) {
          markDataArr.forEach(item => {
            item.showPersonInfo = false
            markData.CommonPutRequestList.push({
              putList: [{key: 'cofferAlarmState', value: '已处理'},
                {key: 'id', value: item.id}]
            })
          })
        }
        setGuardTableDataApi(markData)
          .then(res => {
            console.log(res.data.data.reply.msg)
          })
          .catch(() => {})

        return
        // let markDataArr = this.reqStaffListData.find(item => item[0].randomId === val.randomId)
        // if (markDataArr && markDataArr.length !== 0) {
        //   markDataArr.forEach(item => {
        //     item.showPersonInfo = false
        //   })
        // }
        // return
      }

      let spliceItem = this.coffersGuardTable.splice(guardIndex, 1)[0]
      // 事件处理完成 开关流操作
      this.$refs.preview.stopPreviewALL()
      if (this.coffersGuardTable.length !== 0) {
        this.coffersGuardTable.forEach(item => {
          if (item.videoInfo.data.length !== 0) {
            this.openPreviewFun(item.videoInfo.data[0])
          }
        })
      }

      // 标记已处理数据
      let markData = {CommonPutRequestList: []}
      let markDataArr = this.reqStaffListData.find(item => item[0].randomId === spliceItem.randomId)
      if (markDataArr && markDataArr.length !== 0) {
        markDataArr.forEach(item => {
          markData.CommonPutRequestList.push({
            putList: [{key: 'cofferAlarmState', value: '已处理'},
              {key: 'id', value: item.id}]
          })
        })
      }
      //! 标记已处理接口调用
      setGuardTableDataApi(markData)
        .then(res => {
          console.log(res.data.data.reply.msg)
        })
        .catch(() => {})
      this.reqStaffListData.splice(this.reqStaffListData.findIndex(item => item[0].randomId === spliceItem.randomId))
      this.doorListData.splice(this.doorListData.findIndex(item => item.id === spliceItem.id), 1)

      // 添加金库事件数据
      // let params = {
      //   CofferEventInfo: {
      //     // id: 1, // 事件id
      //     mechanism: spliceItem.organization, // 机构
      //     keyPart: spliceItem.keySite, // 重点部位
      //     ccessControl: spliceItem.entranceGuardChannel, // 门禁
      //     passaGeway: spliceItem.channel, // 通道
      //     eventType: '开门', // 事件类型
      //     occurrenceTime: this.$moment().format('YYYY-MM-DD HH:mm:ss') // 发生时间
      //   }
      // }
      // setEventTableDataApi(params)
      //   .then(res => {
      //     this.getEventTableDataFun()
      //   })
      //   .catch(() => {})
    },
    /**
     * @description: 判断点击行是否是是对讲请求
     * @param {type} 无
     * @return: 无
     */
    async checkTalkback(row, column, event) {
      this.guardCellChecked = row
      // 正在对讲状态  不支持选择列表其他项  对讲结束时状态改为false
      if (this.talkBackInfo.talkStatus) {
        return
      }
      // 不是对讲的 修改为可点击状态  查找关联对讲面板信息
      if (row.type !== '对讲') {
        this.talkBackInfo.iconStatus = true
        this.talkBackInfo.openParam = row
        return
      }

      this.talkBackInfo.iconStatus = true
      // this.talkBackInfo.calledId = row.talkHostId
      this.talkBackInfo.openParam = row
    },
    /**
     * @description: 开始对讲
     * @param {type} 无
     * @return: 无
     */
    async openTalkbackFun() {
      if (!this.talkBackInfo.iconStatus) {
        return
      }
      if (this.talkBackInfo.talkStatus && this.talkBackInfo.seqId !== '') {
        // 正在通话中 挂断
        this.closeTalkbackFun()
        return
      }

      if (!this.talkBackInfo.talkStatus && this.talkBackInfo.seqId === '' && this.talkBackInfo.openParam.requestType === '对讲') {
        //! 接听
        this.answerTalkFun()
      }
      if (!this.talkBackInfo.talkStatus && this.talkBackInfo.seqId === '' && '刷卡开门'.includes(this.talkBackInfo.openParam.requestType)) {
        //! 呼叫
        let params = {
          myMikeId: this.talkBackInfo.mikeId
          // calledpanelIds: this.talkBackInfo.calledId // 测试数据
        }
        if (params.myMikeId === '') {
          this.$messageError('没有获取到台麦信息')
          return
        }
        let talkInfo = await getRelevCameraApi({mode: 2, queryParam: this.talkBackInfo.openParam.doorInfo.deviceId + '?ref=2'})
        talkInfo = talkInfo.data.data
        if (talkInfo && talkInfo.audio && talkInfo.audio.length !== 0) {
          // params.calledpanelIds = talkInfo.audio[0].uniqueId
          params.calledpanelIds = talkInfo.audio[0].id
        } else {
          this.$messageError('没有获取到关联对讲面板信息')
          return
        }
        openTalkApi(params)
          .then(res => {
            res = res.data
            if (res && res.code === 0) {
              this.talkBackInfo.seqId = res.data.seqId
              this.talkBackInfo.talkStatus = true
              this.talkBackInfo.iconStatus = true
            } else {
              this.talkBackInfo.talkStatus = false
              this.talkBackInfo.iconStatus = false
              this.$messageError('呼叫失败!', '错误')
            }
            let audioName = this.talkBackInfo.openParam.audioInfo.data[0].name
            this.recordLogFun({
              OperationType: '对讲开启',
              action: '开始对讲',
              operObject: audioName,
              result: res && res.code === 0 ? '成功' : '失败',
              description: `打开与${audioName}通话${res && res.code === 0 ? '成功' : '失败'}`
            })
          })
          .catch(() => {})
      }
    },
    /**
     * @description: 对讲接听
     * @param {type} 无
     * @return: 无
     */
    answerTalkFun() {
      let params = {
        serverIp: this.callerInfo.platformIp, // MAC地址获取 platformIp
        serverPort: this.callerInfo.platformPort, // MAC地址获取 platformPort
        serverId: this.callerInfo.platformUniqueId, // MAC地址获取 platformUniqueId
        callerPanelInfo: { // 面板
          // hostIp: this.talkBackInfo.openParam.callerInfo.hostIp,
          // hostPort: this.talkBackInfo.openParam.callerInfo.hostPort,
          // hostId: this.talkBackInfo.openParam.callerInfo.hostId,
          // id: this.talkBackInfo.openParam.callerInfo.id
          ...this.talkBackInfo.openParam.callerInfo
        },
        calledMikeInfo: [ // 台麦
          {
            ip: this.callerInfo.hostIp, // MAC地址获取 hostIp
            port: this.callerInfo.hostPort, // MAC地址获取 hostPort
            id: this.callerInfo.hostUniqueId
          }
        ]
      }
      if (params.serverIp !== params.callerPanelInfo.hostIp) {
        // 判断面板与Mac平台是否是相同的IP  不相同的修改台麦ID (平台ID+设备ID)
        params.calledMikeInfo[0].id = params.callerPanelInfo.hostIp === params.serverIp
          ? this.callerInfo.hostUniqueId
          : this.$lodash.padStart(this.callerInfo.platformUniqueId, 3, '0') + this.callerInfo.hostUniqueId
      }
      answerTalkApi(params)
        .then(res => {
          res = res.data
          // this.talkBackInfo.seqId = '101010101010101010101'
          this.talkBackInfo.seqId = res.data.seqId
          this.talkBackInfo.talkStatus = true

          let audioName = this.talkBackInfo.openParam
          audioName = audioName.type === '对讲' ? audioName.channel : audioName.audioInfo.data[0].name
          this.recordLogFun({
            OperationType: '对讲开启',
            action: '开始对讲',
            operObject: audioName,
            result: res && res.code === 0 ? '成功' : '失败',
            description: `打开与${audioName}通话${res && res.code === 0 ? '成功' : '失败'}`
          })
        })
        .catch(() => {})
    },
    /**
     * @description: 关闭对讲
     * @param {type} 无
     * @return: 无
     */
    closeTalkbackFun() {
      let params = {
        myMikeId: this.talkBackInfo.mikeId,
        seqId: this.talkBackInfo.seqId
      }
      //! 挂断
      closeTalkApi(params)
        .then(res => {
          res = res.data
          this.talkBackInfo.seqId = ''
          this.talkBackInfo.talkStatus = false
          this.talkBackInfo.iconStatus = false
          if (this.talkBackInfo.openParam.requestType === '对讲') {
            this.setEventdata(this.talkBackInfo.openParam)
          }
          let audioName = this.talkBackInfo.openParam
          audioName = audioName.type === '对讲' ? audioName.channel : audioName.audioInfo.data[0].name
          this.recordLogFun({
            OperationType: '对讲挂断',
            action: '结束对讲',
            operObject: audioName,
            result: res && res.code === 0 ? '成功' : '失败',
            description: `关闭与${audioName}通话${res && res.code === 0 ? '成功' : '失败'}`
          })
        })
        .catch(() => {})
    },
    /**
     * @description: 报警输出图标点击事件
     * @param {type} 无
     * @return: 无
     */
    signalOutput() {
      if (Object.keys(this.guardCellChecked).length === 0) {
        this.$messageError('请选择需要报警输出的位置')
        return
      }
      this.showConfirmDialog = true
    },
    /**
     * @description: 报警输出接口调用
     * @param {type} 无
     * @return {type} 无
     */
    alarmOutputFun() {
      // 接口调用
      let alarmInfo = this.guardCellChecked
      if (alarmInfo.outputInfo.length !== 0) {
        for (let i = 0; i < alarmInfo.outputInfo.length; i++) {
          let {devIp, devPort, outputNo} = {...alarmInfo.outputInfo[i]}
          alarmOutputApi({devIp, devPort, outputNo: Number(outputNo)})
            .then(res => {
              let promptInfo = `${alarmInfo.organization} / ${alarmInfo.keySite}触发声光报警失败`
              if (res.data && res.data.code === 0 && res.data.data.code === '0') {
                promptInfo = `${alarmInfo.organization} / ${alarmInfo.keySite}已成功触发声光报警`
                this.$messageSuccess(promptInfo)
              } else {
                this.$messageError(promptInfo)
              }
              this.recordLogFun({
                OperationType: '报警输出',
                action: '报警输出', // 动作
                result: promptInfo.includes('成功') ? '成功' : '失败',
                operObject: alarmInfo.outputInfo[0].deviceName, // 操作对象
                description: promptInfo // 操作描述
              })
            })
            .catch(() => {})
        }
      } else {
        this.$messageError('没有查询到关联报警输出设备')
      }
      this.showConfirmDialog = false
    },
    /**
     * @description: 返回总览按钮
     * @param {type} 无
     * @return: 无
     */
    backAllReqlist() {
      this.showProcessingReq = false
      let findInd = this.coffersGuardTable.findIndex(item => item.randomId === this.detailInfoData[0].randomId)
      if (findInd !== -1) {
        this.coffersGuardTable[findInd].progress = '待处理'
      }
      // 返回总览 - 标记事件 - 不显示刷卡人列表
      this.setEventdata(this.detailInfoData[0], 'backAll')
    },
    /**
     * @description: 检查记录弹窗点击事件，显示检查记录弹窗
     * @param {type} 无
     * @return: 无
     */
    handleInspectClick() {
      this.isShowInsModal = true
    },
    closeModal() {
      this.isShowInsModal = false
      this.showPlaybackVideoModal = false
      this.showConfirmDialog = false
    },
    /**
     * @description: 金库事件表格操作列回放按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    playbackBtnHandler(index, data) {
      // 打开回放弹框
      let video = JSON.parse(data.video)
      if (!video.videoList || video.videoList.length === 0) {
        this.$messageError('没有录像段')
        video.videoList = [{channel: '', devIp: '', devPort: ''}]
        // return
      }
      this.playbackParams = {
        channel: video.videoList[0].channelNum,
        // dPort: 8000,
        devIp: video.videoList[0].ip,
        devPort: video.videoList[0].port,
        // startTime: 1596384000
        startTime: this.$moment(video.startTime).unix(),
        endTime: this.$moment(video.startTime).unix() + 1000
      }
      this.showPlaybackVideoModal = true
    },
    /**
     * @description: 设置表格容器高度
     * @param {type} 无
     * @return: 无
     */
    setTableContainerHeight() {
      // 获取类名为.body的元素的高度
      let bodyClassHeight = window.getComputedStyle(document.querySelector('.body')).height
      bodyClassHeight = Number(bodyClassHeight.slice(0, -2))
      this.$refs.tableContainer.style.height = Math.floor((bodyClassHeight - 60) / 2) + 'px'
    },
    /**
     * @description: 显示重点部位详细信息
     * @param {type} 无
     * @return: 无
     */
    showLocationInfoFun(params, clicked) {
      getOrgInfoApi({ids: [params], type: 2})
        .then(res => {
          res = res.data.data.keyParts
          if (!res) {
            return
          }
          res = res[0]
          this.LocationInfo = {
            cofferName: res.name,
            cofferAdd: res.address,
            organize: this.requestSource.split(' / ')[0],
            guardRoomPhone: res.telephone, // 守护室电话
            manager1: res.principal1, // 金库常任副主任
            phone1: res.principalPhone1,
            manager2: res.principal2, // 金库副主任
            phone2: res.principalPhone2,
            addident: res.principal5, // 安保部门联系人
            phone3: res.principalPhone5,
            localPolice: res.policeStation, // 属地派出所名称
            localPhone: res.policeTelephone,
            policeName: res.police, // 辖区民警姓名
            policePhone: res.policeMobilePhone,
            organizeCode: res.serial,
            mark: res.remark, // 备注
            localStatus: ['', '正常', '已撤销', '已合并', '临时停业'][res.status] // 状态
          }
        })
        .catch(() => {})
      if (clicked) {
        this.showLocationInfo = true
      }
    }
  },
  watch: {
    coffersGuardTable: {
      handler: function(newVal, oldVal) {
        let guardLastItem = [...newVal].pop()
        if (!guardLastItem) { return }
        this.showLocationInfoFun(guardLastItem.keySiteId)
        this.requestSource = `${guardLastItem.organization} / ${guardLastItem.keySite}`
      },
      deep: true
    },
    showProcessingReq(val) {
      this.$nextTick(() => {
        if (!val && this.coffersGuardTable.length !== 0) {
          this.coffersGuardTable.forEach(item => {
            if (item.videoInfo.data.length !== 0) {
              this.openPreviewFun(item.videoInfo.data[0])
            }
          })
        }
      })

      if (val) {
        this.$refs.preview.stopPreviewALL()
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableContainerHeight)
    socket.remove('eventGuardVault', data => {})
    socket.remove('alarmGuardVault', data => {})
    socket.remove('alarmIntercom', data => {})
    socket.remove('eventIntercom', data => {})

    // 关流
    this.$refs.preview.stopPreviewALL()
  }
}
</script>

<style lang="less" scoped>
.remote-guard-container {
  padding: 20px 0 0 10px;
  width: 100%;
  height: 100%;

  .remote-row {
    height: 100%;
    display: flex;
    .remote-col {
      width: 100%;
      height: 100%;
    }
    .video-container {
      flex: 16;
      overflow: scroll;

      /deep/ .video-bottom {
        .dp-con iframe {
          left: 30px;
          border: 0px;
        }
      }
      /deep/ .single-video-plugin {
        height: calc(~"100% - 60px") !important;
      }
    }
    .info-container {
      flex: 8;
    }
  }

  .grid-content {
    border-radius: 4px;
    height: 100%;
    .video-plugin {
      z-index: 0;
    }

    .inspect-icon {
      color: #878282;
      font-size: 20px;
      padding: 0 8px;
    }
    .right-btn {
      height: 50px;
      padding-left: 20px;
      display: flex;
      p {
        color: #2D72D3;
        font-size: 14px;
        line-height: 50px;
        margin-right: 10px;
      }
      span {
        width: 50px;
        font-size: 30px;
        line-height: 50px;
        display: inline-block;
      }
    }
  }

  .table-container {
    width: 100%;
    height: 50%;
    background: #ffffff;
    overflow: auto;
    .el-card__body {
      .source-text {
        display: inline-block;
        line-height: 30px;
        margin-right: 30px;
      }
    }
    // tabs
    .el-tabs--border-card {
      height: calc(~"100% - 90px");
      /deep/ .el-tabs__content {
        height: calc(~"100% - 69px");
        .el-tab-pane {
          height: 100%;
        }
      }
    }

    // 返回总览按钮
    .back-button {
      width: 39px;
      height: 39px;
      font-size: 16px;
      line-height: 39px;
      text-align: center;
      position: absolute;
      // top: 90px;
      top: 188px;
      right: 35px;
    }
  }

  // 报警输出确认框
  .el-dialog__body {
    .warning-icon {
      position: absolute;
      top: 90px;
      left: 32px;
      .icon {
        width: 30px;
        height: 30px;
        fill: currentColor;
        overflow: hidden;
      }
    }
    p {
      margin: 5px 60px;
      line-height: 36px;
    }
  }

  // 金库门状态列表样式
  .status-door-list {
    width: 100%;
    height: 50%;
    background: #FFFFFF;
  }

  /deep/ .el-table__body {
    .el-table__row--striped td {
        background: #F2F2F2;
    }
  }

  .location-info-title {
    text-align: center;
    font-weight: 400;
    margin-bottom: 30px;
  }
  .location-info-container {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .form-item {
      width: 49.5%;
      height: 30px;
      margin-bottom: 2px;
      font-size: 14px;
      line-height: 30px;
      display: flex;
      .item-label {
        width: 150px;
        text-align: center;
        margin-right: 5px;
        border-radius: 3px;
        background: #f8f8f8;
        display: inline-block;
      }
      .item-value {
        width: calc(~"100% - 155px");
        height: 30px;
        padding-left: 5px;
        display: inline-block;
      }
    }
  }
}
</style>
