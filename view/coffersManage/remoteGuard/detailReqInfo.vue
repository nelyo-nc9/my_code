<!--
 * @Author: yanglei
 * @Date: 2020-06-02 19:05:50
 * @LastEditTime: 2020-08-25 13:36:38
 * @LastEditors: your name
 * @Description:
 * @FilePath: \ccb-client\client\src\view\coffersManage\remoteGuard\detailReqInfo.vue
-->

<template>
  <div class="detail-info-container">
    <div class="video-detail-container">
      <div class="video-container">
        <preview-plugin  :defaultPane="defaultPane" :iconShow="iconShowParams" :pluginIconShow="pluginIconShow" :moduleType="9" ref="preview">
          <!-- <span slot="inspectIcon" title="检查记录" class="iconfont icon-rizhi inspect-icon" @click="handleInspectClick"></span> -->
          <span title="返回总览" slot="leftBackIcon" class="iconfont-ccb ccbguaijiao-youshang left-backicon" @click="backAllReqlist"></span>
          <div slot="rightBtn" class="right-btn">
            <p v-show="talkBackInfo.iconStatus && talkBackInfo.talkStatus">{{ `${talkBackInfo.openParam.channel}正在对讲中...` }}</p>
            <span title="对讲" :class="[talkBackInfo.iconStatus ? 'iconfont-ccb ccbduijiangzhuangtai' : 'iconfont icon-sound-close disable']" @click="openTalkbackFun"></span>
            <span title="报警输出" class="iconfont icon-alarm-output" @click="signalOutput"></span>
            <el-button size="small" type="primary" @click="setGuardBtnHandler">布防</el-button>
            <el-button size="small" type="primary" @click="removeGuardBtnHandler">撤防</el-button>
            <el-button size="small" type="primary" :disabled="ableOperDoor" @click="refuseOpenDoorBtnHandler">拒绝开门</el-button>
            <el-button size="small" type="primary" :disabled="ableOperDoor" @click="openDoorBtnHandler">确认开门</el-button>
          </div>
        </preview-plugin>
      </div>
      <div class="charge-people-list">
        <el-card class="charge-people-item" shadow="never" v-for="(item, index) in personCardList" :key="index">
          <div class="photo">
            <span class="iconfont icon-xingming1" v-if="item.imgSrc === ''"></span>
            <img :src="item.imgSrc" alt="" v-else style="width: 100%; height: 100%;">
          </div>
          <div class="info">
            <p><span>刷卡人姓名</span> {{ item.name }}</p>
            <p><span>性别</span> {{ item.gender }}</p>
            <p><span>卡号</span> {{ item.cardNum }}</p>
            <p><span>身份证号</span> {{ item.identityCard }}</p>
            <p><span>电话号码</span> {{ item.tel }}</p>
            <p><span>所属组</span> {{ item.group }}</p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="charge-people-table">
      <!-- 刷卡人详细信息表格 -->
      <el-table
        :data="chargePeopleTable"
        stripe
        height="100%"
        style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="organization" label="机构" show-overflow-tooltip></el-table-column>
        <el-table-column prop="keySite" label="重点部位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="刷卡人姓名"></el-table-column>
        <el-table-column prop="cardNumber" label="卡号"></el-table-column>
        <el-table-column prop="group" label="组别"></el-table-column>
        <el-table-column prop="entranceGuardChannel" label="门禁通道" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="请求类型"></el-table-column>
        <el-table-column prop="result" label="请求结果"></el-table-column>
        <el-table-column prop="time" label="刷卡时间" width="180"></el-table-column>
      </el-table>
    </div>

    <!-- 检查记录对话框 -->
    <InspectionModal v-if="isShowInsModal" :showInspectDialog="isShowInsModal" @closeDialog="closeInsModal"></InspectionModal>

    <!-- 确认开门对话框 -->
    <el-dialog
      :title="['开门确认', '身份验证', '提示', '报警输出确认'][Number(authentication)]"
      :visible.sync="showConfirmDialog"
      width="450px"
      :before-close="closeConfirmDialog"
      class="confirm-opendoor-dialog">
      <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"></iframe>

      <div v-if="['0', '2', '3'].includes(authentication)">
        <span class="warning-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#ccbjinggao"></use>
          </svg>
        </span>
        <!-- 请确认是否开启金库门？ -->
        <p>{{ confirmationMessage }}</p>
      </div>
      <div v-else>
        <el-input v-model="authenticationInp" placeholder="请选择输入指纹或密码（或其他验证方式）……"></el-input>
        <div class="authentication-icon-box">
          <span class="iconfont-ccb ccb-jianpan"></span>
          <span class="iconfont-ccb ccbzhiwen"></span>
          <span class="iconfont-ccb ccbzhiwen1"></span>
          <span class="iconfont-ccb ccbrenlianshibie"></span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConfirmDialog">取 消</el-button>
        <el-button type="primary" :disabled="lock" @click="reconfirmBtnHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import InspectionModal from './InspectionModal'
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import '@src/assets/ccb_iconfonts/iconfont.js'
import {
  openDoorApi,
  getDoorStatusApi,
  // removeGuardDataApi,
  // setGuardTableDataApi,
  // setEventTableDataApi,
  getVerifyFingerParam,
  answerTalkApi,
  openTalkApi,
  closeTalkApi,
  alarmOutputApi,
  getAlarmhostListApi,
  getGuardStatusApi,
  setGuardApi,
  removeGuardApi
} from '../../../http/coffersManage/remoteGuard.api'
import { getRelevCameraApi } from '../../../http/coffersManage/doorStatus.api.js'
import common from '../components/common'

export default {
  name: 'detailReqInfo',
  mixins: [common],
  components: {
    previewPlugin,
    InspectionModal
  },
  props: {
    personInfoData: {
      type: Array,
      default: function() {
        return []
      }
    },
    talkBackInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    callerInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 视频下方icon配置
      iconShowParams: [
        { type: 'left', index: 0, name: 'ViewPattern' }, // 画面模式
        { type: 'left', index: 1, name: 'Stream' }, // 码流切换
        // { type: 'left', index: 2, slotName: 'inspectIcon' }, // 检查记录
        { type: 'left', index: 2, name: 'checkRecode' },
        { type: 'left', index: 3, name: 'Volume' }, // 音量
        { type: 'left', slotName: 'leftBackIcon', index: 4, width: '36px' },

        { type: 'right', slotName: 'rightBtn', index: 0, width: '600px' }
      ],
      defaultPane: 4, // 默认显示4窗格
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
      // 刷卡人卡片列表数据
      personCardList: this.$lodash.fill(new Array(4), { name: '', gender: '', cardNum: '', identityCard: '', tel: '', group: '', imgSrc: '' }),
      // 刷卡人详细信息表格数据
      chargePeopleTable: [],
      isShowInsModal: false, // 展示检查记录对话框
      showConfirmDialog: false, // 显示确认开门对话框
      confirmationMessage: '',
      authentication: '0', // 身份验证，再次确认是否开门
      authenticationInp: '', // 身份验证输入框
      lock: false,
      ableOperDoor: true, // 拒绝开门和确认开门默认禁用 收到开门请求事件时启用
      alarmHostList: []
    }
  },
  mounted() {
    this.modifyCardList(this.$lodash.cloneDeep(this.personInfoData))
    // this.setDoorBtnStatus(this.$lodash.cloneDeep(this.personInfoData))
    if (this.personInfoData[0].videoInfo.data.length !== 0) {
      this.personInfoData[0].videoInfo.data.forEach(item => {
        let params = {
          channel: Number(item.channelNum),
          devIp: item.ip,
          devCport: item.port,
          // devDport: item.dport,
          streamType: 'main',
          subType: item.subType,
          dId: item.dId
          // channel: 1,
          // devIp: '10.1.2.20',
          // devCport: 37777,
          // devDport: 37777,
          // streamType: 'main'
        }
        this.openPreviewFun(params)
      })
    }

    getAlarmhostListApi({locationId: this.personInfoData[0].keySiteId})
      .then(res => {
        if (res.data && res.data.code === 0) {
          this.alarmHostList = res.data.data.results
          this.getGuardStatusFun()
        }
      })
      .catch(() => {})
  },
  methods: {
    /**
     * @description: 获取报警主机布防状态
     * @param {type} 无
     * @return {type} 无
     */
    getGuardStatusFun() {
      if (this.alarmHostList.length === 0) { return }

      let params = {
        devIp: this.alarmHostList[0].ip,
        devPort: this.alarmHostList[0].port,
        subSystems: [this.alarmHostList[0].subSystem]
      }
      getGuardStatusApi(params)
        .then(res => {
          console.log(res.data)
        })
        .catch(() => {})
    },
    /**
     * @description: 播放预览视频方法
     * @param {type} 无
     * @return: 无
     */
    openPreviewFun(data) {
      // let data = {
      //   channel: 1,
      //   devIp: '10.1.2.20',
      //   devCport: 37777,
      //   devDport: 37777,
      //   streamType: 'main'
      // }
      this.$refs.preview.openPreview(data)
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
        // 挂断
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
      // this.talkBackInfo.talkStatus = !this.talkBackInfo.talkStatus
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
        callerPanelInfo: { // 被叫面板
          // hostIp: this.talkBackInfo.openParam.callerInfo.hostIp,
          // hostPort: this.talkBackInfo.openParam.callerInfo.hostPort,
          // hostId: this.talkBackInfo.openParam.callerInfo.hostId,
          // id: this.talkBackInfo.openParam.callerInfo.id
          ...this.talkBackInfo.openParam.callerInfo
        },
        calledMikeInfo: [ // 主叫
          {
            ip: this.callerInfo.hostIp, // MAC地址获取 hostIp
            port: this.callerInfo.hostPort, // MAC地址获取 hostPort
            id: this.callerInfo.hostUniqueId
          }
        ]
      }
      if (params.serverIp !== params.callerPanelInfo.hostIp) {
        // 判断被叫面板与Mac平台是否是相同的IP  不相同的修改主叫ID (平台ID+设备ID)
        params.calledMikeInfo[0].id = params.callerPanelInfo.hostIp === params.serverIp
          ? this.callerInfo.hostUniqueId
          : this.$lodash.padStart(this.callerInfo.platformUniqueId, 3, '0') + this.callerInfo.hostUniqueId
      }
      console.log('子组件 接听参数 ---------------------- ', params, this.talkBackInfo.openParam.callerInfo)
      answerTalkApi(params)
        .then(res => {
          console.log('对讲接听成功')
          this.talkBackInfo.seqId = res.data.data.seqId
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
      console.log('子组件挂断 ------------------------  ', params)
    },
    /**
     * @description: 修改刷卡人列表信息值和刷卡人表格信息值的方法
     * @param {type} 父组件传递过来的最新的数据
     * @return: 无
     */
    modifyCardList(listData) {
      // if (!listData[0].showPersonInfo) {
      if (listData.every(item => item.showPersonInfo === false)) {
        this.personCardList = this.$lodash.fill(new Array(4), { name: '', gender: '', cardNum: '', identityCard: '', tel: '', group: '', imgSrc: '' })
        this.chargePeopleTable = []
        this.$nextTick(() => {
          this.ableOperDoor = true
        })
        return
      }
      this.chargePeopleTable = []
      this.personCardList = this.$lodash.fill(new Array(4), { name: '', gender: '', cardNum: '', identityCard: '', tel: '', group: '', imgSrc: '' })
      listData = listData.filter(item => item.showPersonInfo !== false)
      listData.forEach((item, index) => {
        // if (!item.showPersonInfo) { return }
        let {name, gender, cardNum, identityCard, tel, group, imgSrc} = {...item.personInfo}
        index < 4
          ? this.personCardList.splice(index, 1, { name, gender, cardNum, identityCard, tel, group, imgSrc })
          : this.personCardList.push({ name, gender, cardNum, identityCard, tel, group, imgSrc })

        this.chargePeopleTable.push({
          organization: item.organization, // 机构
          keySite: item.keySite, // 重点部位
          name: name, // 刷卡人姓名
          cardNumber: cardNum, // 卡号
          group: group, // 组别
          entranceGuardChannel: item.channel, // 门禁通道
          // type: item.type, // 刷卡类型
          type: item.requestType, // 刷卡类型
          result: item.result || '正常', // 请求结果  (这里的请求结果接口未返回，待处理)
          time: item.time // 刷卡时间
        })
      })
    },
    /**
     * @description: 返回总览按钮
     * @param {type} 无
     * @return: 无
     */
    backAllReqlist() {
      this.$emit('backOriginState')
      this.$emit('setEventdata', this.personInfoData[0], 'backAll')
    },
    /**
     * @description: 检查记录弹窗点击事件，显示检查记录弹窗
     * @param {type} 无
     * @return: 无
     */
    handleInspectClick() {
      this.isShowInsModal = true
    },
    closeInsModal() {
      this.isShowInsModal = false
    },
    /**
     * @description: 显示确认开门对话框
     * @param {type} 无
     * @return: 无
     */
    openDoorBtnHandler() {
      if (this.ableOperDoor) {
        return
      }
      this.confirmationMessage = '请确定要执行开启金库门吗？'
      this.showConfirmDialog = true
    },
    /**
     * @description: 身份验证成功，再次确认开门按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    reconfirmBtnHandler() {
      // 判断是否是身份验证成功后的再次确认开门

      if (this.authentication === '3') {
        // this.alarmOutputFun(alarmInfo.outputInfo)
        let alarmInfo = this.personInfoData[0]
        if (alarmInfo.outputInfo.length !== 0) {
          this.signalOutputFun(alarmInfo)
        } else {
          this.$messageError('没有查询到关联报警输出设备')
        }
        this.closeConfirmDialog()
        return
      }

      if (this.authentication === '2') {
        // 拒绝开门确认按钮点击
        this.$emit('setEventdata', this.personInfoData[0])
        this.chargePeopleTable = []
        this.personCardList = this.$lodash.fill(new Array(4), { name: '', gender: '', cardNum: '', identityCard: '', tel: '', group: '', imgSrc: '' })
        this.ableOperDoor = true
        // 预览视频关流
        // this.$refs.preview.openPreview(data)
        this.$refs.preview.stopPreviewALL()
        // 记录操作日志
        this.recordLogFun({
          OperationType: '拒绝开门',
          action: '请求开门', // 开门
          operObject: this.personInfoData[0].channel, // D1门-金库区1道门
          description: `拒绝开启${this.personInfoData[0].channel}通道成功` // 拒绝开启D1门-金库区1道门通道成功
        })
        this.closeConfirmDialog()
        return
      }
      if (this.authentication === '0') {
        // 确认开门点击后显示身份验证
        this.authentication = '1'
        return
      }

      this.lock = true
      this.$message({
        showClose: true,
        type: 'success',
        message: '正在进行指纹（或密码）识别.....请稍等',
        duration: 5000
      })

      // 指纹校验
      let params = {
        userId: JSON.parse(window.sessionStorage.getItem('user')).id
      }
      getVerifyFingerParam(params)
        .then(res => {
          res = res.data
          if (res.code === 1) {
            // this.$messageError('不在正常值守时间范围内', '错误')
            this.$messageError(res.data, '错误')
            this.closeConfirmDialog()
            this.lock = false
            return
          }
          res = res.data
          if (res.id && res.method === '指纹识别') {
            // 指纹识别
            let oAjax = new XMLHttpRequest()
            oAjax.open('POST', 'http://127.0.0.1:49784/api/finger/auth', true)
            oAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            oAjax.onreadystatechange = () => {
              if (oAjax.readyState === 4 && oAjax.status === 200) {
                if (JSON.parse(oAjax.response).score >= 50) {
                  this.$messageSuccess('指纹认证通过！')
                  this.openDoorFun()
                } else {
                  this.$messageError('指纹认证失败，请重试！', '错误')
                }
                this.closeConfirmDialog()
                this.lock = false
              }
            }
            oAjax.send(JSON.stringify({id: Number(res.id)}))
          }
        })
        .catch(() => {
          this.closeConfirmDialog()
          this.lock = false
        })
    },
    // 开门方法
    async openDoorFun() {
      let params = this.personInfoData[0].doorInfo
      delete params.keySite
      delete params.organization
      try {
        await openDoorApi(params)
        let openStatus = await getDoorStatusApi(params)
        openStatus = openStatus.data
        if (openStatus && openStatus.code === 0) {
          // 当前请求处理完成
          let status = openStatus.data[0].status
          status = status === 'close' ? '关闭' : status === 'open' ? '开启' : '未知'
          this.$emit('changeDoor', {channelId: params.channelId, status})
          this.$emit('setEventdata', this.personInfoData[0])
          this.chargePeopleTable = []
          this.personCardList = this.$lodash.fill(new Array(4), { name: '', gender: '', cardNum: '', identityCard: '', tel: '', group: '', imgSrc: '' })
          this.ableOperDoor = true
          // 预览视频关流
          this.$refs.preview.stopPreviewALL()
          this.$messageSuccess('验证通过，门已开启')
        } else {
          this.$messageError('开门失败')
        }
      } catch (err) {
        console.log('失败', err)
      } finally {
        // 记录日志
        this.recordLogFun({OperationType: '远程开门'})
      }
    },
    /**
     * @description: 关闭确认开门对话框
     * @param {type}
     * @return:
     */
    closeConfirmDialog() {
      this.showConfirmDialog = false
      setTimeout(() => {
        this.authentication = '0'
      }, 300)
    },
    /**
     * @description: 拒绝开门按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    refuseOpenDoorBtnHandler() {
      this.authentication = '2'
      this.confirmationMessage = '请确定拒绝执行开启金库门吗？'
      this.showConfirmDialog = true
    },
    /**
     * @description: 报警输出图标点击事件
     * @param {type} 无
     * @return: 无
     */
    signalOutput() {
      this.authentication = '3'
      this.confirmationMessage = '请确定要触发报警输出吗？'
      this.showConfirmDialog = true
    },
    signalOutputFun(alarmInfo) {
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
    },
    /**
     * @description: 布防
     * @param {type} 无
     * @return {type} 无
     */
    setGuardBtnHandler() {
      if (this.alarmHostList.length === 0) {
        this.$messageError('没有获取到报警主机信息')
        return
      }
      let params = {
        devIp: this.alarmHostList[0].ip,
        devPort: this.alarmHostList[0].port,
        subSystem: [this.alarmHostList[0].subSystem]
      }
      setGuardApi(params)
        .then(res => {
          res = res.data
          let status = 0
          if (res && res.code === 0 && res.data.code === 0) {
            status = 1
            this.$messageSuccess('布防操作成功')
          } else {
            this.$messageError('布防操作失败')
          }

          this.recordLogFun({
            OperationType: '布防操作',
            action: '布防',
            operObject: this.alarmHostList[0].name,
            result: status !== 0 ? '成功' : '失败',
            description: `对${this.alarmHostList[0].name}报警主机进行布防${status !== 0 ? '成功' : '失败'}`
          })
        })
        .catch(() => {})
    },
    removeGuardBtnHandler() {
      if (this.alarmHostList.length === 0) {
        this.$messageError('没有获取到报警主机信息')
        return
      }
      let params = {
        devIp: this.alarmHostList[0].ip,
        devPort: this.alarmHostList[0].port,
        subSystem: [this.alarmHostList[0].subSystem]
      }
      removeGuardApi(params)
        .then(res => {
          res = res.data
          let status = 0
          if (res && res.code === 0 && res.data.code === 0) {
            status = 1
            this.$messageSuccess('撤防操作成功')
          } else {
            this.$messageError('撤防操作失败')
          }

          this.recordLogFun({
            OperationType: '撤防操作',
            action: '撤防',
            operObject: this.alarmHostList[0].name,
            result: status !== 0 ? '成功' : '失败',
            description: `对${this.alarmHostList[0].name}报警主机进行撤防${status !== 0 ? '成功' : '失败'}`
          })
        })
        .catch(() => {})
    }
    /**
     * @description: 设置拒绝开门按钮和确认开门按钮状态
     * @param {type} 无
     * @return: 无
     */
    // setDoorBtnStatus(val) {
    //   if (!'刷卡开门'.includes(val[0].type)) {
    //     // 类型不是刷卡的 保持默认禁用状态
    //     this.ableOperDoor = true
    //     return
    //   }
    //   // this.ableOperDoor = val.some(item => item.result === '异常') || val.length < 2
    //   if (val.some(item => item.requestType === '开门') && this.chargePeopleTable.every(item => item.result === '正常')) {
    //     this.ableOperDoor = false
    //   }
    // }
  },
  watch: {
    personInfoData: {
      handler: function(newVal, oldVal) {
        // this.setDoorBtnStatus(newVal)
        this.modifyCardList(this.$lodash.cloneDeep(newVal))
      },
      deep: true
    },
    chargePeopleTable(val) {
      if (val.some(item => this.$moment().unix() - this.$moment(item.time).unix() > 3600)) { // 超时1小时未处理的数据清空
        this.$emit('setEventdata', this.personInfoData[0], 'backAll')
        this.ableOperDoor = true
        this.$messageWarn('超时未处理，请提示重新刷卡！')
      }
      if (!val.some(item => item.type === '开门')) {
        this.ableOperDoor = true
      } else if (val.every(item => item.result === '正常')) {
        this.ableOperDoor = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail-info-container {
  width: 100%;
  height: 100%;
  .video-detail-container {
    width: 100%;
    height: 75%; // 后面引入预览组件后修改为百分比
    display: flex;
    .video-container {
      flex: 66;
      // height: calc(~"100% - 80px");
      height: 100%;
      .video-plugin {
        z-index: 0;
      }
      // .video-box {
      //   height: 100%;
      //   display: flex;
      //   flex-wrap: wrap;
      //   div {
      //     width: 50%;
      //     height: 50%; // 后面引入预览组件后修改为百分比
      //     border: 1px solid #cccccc;
      //     background: skyblue;
      //   }
      // }

      .left-backicon {
        width: 36px;
        padding-left: 8px;
        font-size: 20px;
      }
      .inspect-icon {
        color: #878282;
        font-size: 20px;
        padding: 0 8px;
      }
      .right-btn {
        display: flex;
        align-items: center;
        p {
          color: #2D72D3;
          font-size: 14px;
          line-height: 50px;
          margin-right: 10px;
        }
        span {
          width: 50px;
          height: 58px;
          font-size: 30px;
          line-height: 58px;
        }
      }
    }

    /* 刷卡人信息列表 */
    .charge-people-list {
      // flex: 1;
      flex: 25;
      overflow: auto;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      padding: 0 5px;
      .charge-people-item {
        height: 150px;
        border: 1px solid #cccccc;
        margin-bottom: 4px;
        display: flex;
        flex-direction: row;

        /deep/ .el-card__body {
          width: 100%;
          padding: 10px;
          display: flex;
        }
        .photo {
          width: 110px;
          height: 130px;
          border: 2px solid #ccc;
          background: #F2F2F2;
          span {
            width: 110px;
            font-size: 30px;
            text-align: center;
            line-height: 130px;
            display: inline-block;
          }
        }
        &:hover {
          border: 1px solid #01C2FF;
        }

        .info {
          margin-left: 10px;
          p {
            font-size: 12px;
            line-height: 22px;
            span {
              width: 70px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .charge-people-table {
    margin-top: 10px;
    height: calc(~"25% - 10px");
  }

  .confirm-opendoor-dialog {
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

      .authentication-icon-box {
        width: 240px;
        height: 40px;
        margin: 10px auto 0;
        display: flex;
        justify-content: space-between;
        span {
          width: 40px;
          height: 40px;
          font-size: 40px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
