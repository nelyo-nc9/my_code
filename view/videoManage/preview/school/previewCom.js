import { getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
import { openTalkApi } from '@src/http/coffersManage/remoteGuard.api.js'
import { getAudioPlatformApi, closeTalkApi } from '@src/http/coffersManage/remoteGuard.api.js'
import { getRuntimeStatue } from '@src/http/audio/resource'

export default {
  computed: {
    pluginSize() {
      let panes = []
      let width3 = 100 / 3 + '%'
      let width6 = 200 / 3 + '%'
      switch (this.defaultPane) {
        case 1:
          panes = [
            { left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }
          ]
          break
        case 4:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
        case 6:
          panes = [
            { left: 0, top: 0, width: width6, height: width6, position: 'absolute' },
            { left: width6, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width6, width: width3, height: width3, position: 'absolute' }
          ]
          break
        case 8:
          panes = [
            { left: 0, top: 0, width: '75%', height: '75%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 9:
          panes = [
            { left: 0, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width6, width: width3, height: width3, position: 'absolute' }
          ]
          break
        case 10:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 12:
          panes = [
            { left: 0, top: 0, width: '25%', height: width3, position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: width3, position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: width3, position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: width3, position: 'absolute' },
            { left: 0, top: width3, width: '25%', height: width3, position: 'absolute' },
            { left: '25%', top: width3, width: '25%', height: width3, position: 'absolute' },
            { left: '50%', top: width3, width: '25%', height: width3, position: 'absolute' },
            { left: '75%', top: width3, width: '25%', height: width3, position: 'absolute' },
            { left: 0, top: width6, width: '25%', height: width3, position: 'absolute' },
            { left: '25%', top: width6, width: '25%', height: width3, position: 'absolute' },
            { left: '50%', top: width6, width: '25%', height: width3, position: 'absolute' },
            { left: '75%', top: width6, width: '25%', height: width3, position: 'absolute' }
          ]
          break
        case 13:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '50%', height: '50%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 14:
          panes = [
            { left: 0, top: 0, width: '25%', height: '75%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 16:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 17:
          panes = [
            { left: 0, top: 0, width: '60%', height: '40%', position: 'absolute' },
            { left: '60%', top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 22:
          panes = [
            { left: 0, top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 25:
          panes = [
            { left: 0, top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        default:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
      }
      return panes
    }
  },
  data() {
    return {
      pollingTimer: null,
      pollingSourceData: [],
      seqId: ''
    }
  },
  methods: {
    initBtn() { // 初始化按钮的位置
      let leftArr = []
      let rightArr = []
      let offsetL = 0
      let offsetR = 0
      this.iconShow.forEach((v) => {
        v.normalPx = 0
        v.type === 'left' ? leftArr[v.index] = v : rightArr[v.index] = v
      })
      leftArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = offsetL + (Number(v.width) || 36)
          offsetL = v.normalPx
        }
      })
      rightArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = offsetR + (Number(v.width) || 36)
          offsetR = v.normalPx
        }
      })
    },
    boost() { // 鸟瞰
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].boost()
    },
    getCapture() { // 截图
      if (!this.selectedObj.isPlay && !this.selectedObj.isPlayback) {
        return
      }
      this.$refs.plugin[this.checkedPane].getBase64Capture()
    },
    openRecording(val) { // 紧急录像
      // 判断如果正在进行中心录像就将其关闭
      if (this.selectedObj.isCentreRecording) {
        this.$refs.plugin[this.checkedPane].stopCentreRecord()
        return
      }
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].openCentreRecord()
    },
    clickSpeech() { // 对讲
      if (this.selectedObj.isSpeech) {
        this.closeSpeech()
      } else {
        if (this.seqId) {
          this.$messageWarn('正在对讲中...')
          return
        } else {
          // 每次先获取台麦信息
          if (!this.callerInfo) {
            let macs = JSON.parse(window.sessionStorage.getItem('macAddress')).adaptors.filter(item => item.ip !== '0.0.0.0').map(i => i.mac)
            getAudioPlatformApi({mac: macs})
            .then(res => {
              if (res.data.code === 0) {
                res = res.data.data
                this.callerInfo = res
              } else {
                this.$messageError(res.data.message || '获取太麦信息失败！')
              }
            })
            .catch(() => {})
          }
            // 先查询视频通道（拿的是设备）的关联关系
          getDeviceOrResourceApi(this.selectedObj.source.dId, {
            ref: 1
          }).then(res => {
            if (res.data.code === 0) {
              // 获取关联关系的音频数据
              this.audioData = res.data.data && res.data.data.audio
              this.selectAudio = this.audioData[0] && this.audioData[0].rcId || ''
              if (this.audioData.length > 0) {
                this.showSpeech = true
              } else {
                this.$messageWarn('没有关联对讲设备！')
              }
            } else {
              this.$messageError(res.data.message || '获取关联关系失败！')
            }
          })
        }
      }
    },
    startSpeech() { // 对讲实现
      let params = {
        myMikeId: this.callerInfo.id, // 主叫的太麦ID
        calledpanelIds: this.selectAudio // 呼叫的面板ID
      }
      // 先查询面板的实时状态
      let paneInfo = this.audioData.filter(i => {
        return i.rcId === this.selectAudio
      })[0]

      let _this = this
      getRuntimeStatue({
        deviceId: paneInfo.deviceId,
        channelSerise: paneInfo.serise
      }).then(res => {
        if (res.data.code === 0) {
          let status = res.data.data.status
          if (status === 2 ) {
            openTalkApi(params).then(res => {
              if (res.data.code === 0) {
                console.log(res.data.data.seqId)
                this.seqId = res.data.data.seqId
                this.updateStatus(this.checkedPane, { isSpeech: true})
              } else {
                this.$messageError(res.data.error || '呼叫失败！')
              }
            })
          } else {
            _this.$messageWarn('被叫面板正被占用，请稍后重试')
          }
        }
      })
    },
    closeSpeech() {
      closeTalkApi({
        myMikeId: this.callerInfo.id,
        seqId: this.seqId
      }).then(res => {
        if (res.data.code === 0) {
          this.seqId = ''
          this.updateStatus(this.checkedPane, { isSpeech: false})
        }
      })
    },
    volumeSwitch() { // 音量开关
      if (!this.selectedObj.isPlay) {
        return
      }
      if (this.selectedObj.showVolume) {
        this.$refs.plugin[this.checkedPane].closeSound()
      } else {
        for (let index = 0; index < this.defaultTotalPane; index++) {
          // 关闭所有音量
          if (this.videoStatusArr[index].showVolume) {
            this.$refs.plugin[index].closeSound()
          }
        }
        this.$refs.plugin[this.checkedPane].openSound()
        this.$refs.plugin[this.checkedPane].setSoundValue(50)
        let soundStatue = this.$refs.plugin[this.checkedPane].getSoundValue()
        if (soundStatue.success) {
          let objVolumeValue = { volumeValue: soundStatue.Volume }
          this.updateStatus(this.checkedPane, objVolumeValue)
        } else {
          this.$Notice.warning({ title: '警告', desc: '音量获取失败！' })
        }
      }
    },
    changeVolume(v) { // 设置音量
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].setSoundValue(v)
    },
    async stopPreviewALL(isDom) { // 关闭全部预览
      // isDom 是true 就不销毁 object 标签
      this.videoPageData = []
      for (let index = 0; index < this.videoStatusArr.length; index++) {
        await this.stopPreview(index, isDom)
        this.$refs.plugin[index].clearTOpen()
      }
      this.curPage = 1
      this.checkedPane = 0
    },
    async alarmStopPreview(alarmData) { // 报警数据批量处理
      if (Object.isArray(alarmData)) {
        alarmData.forEach(async(item) => {
          let index = this.videoPageData.findeIndex(kk => kk.source.id === item.id)
          if (index !== -1) {
            await this.stopPreview(index, true)
            this.$refs.plugin[index].clearTOpen()
          }
        })
      }
    },
    async stopPreview(index, isDom) { // isDom为true是，将数据清空
      console.log('停止。。。。')
      index = index === undefined ? this.checkedPane : index
      const element = this.videoStatusArr[index]
      if (!element.source) {
        return
      }
      let elementSource = JSON.parse(JSON.stringify(element.source))
      let obj = { isPlay: false, playStatus: false, isBoost: false, source: '' }
      if (element.isPlay) {
        // 有播放在关闭
        if (element.isCentreRecording) {
          this.$refs.plugin[index].stopCentreRecord()
        }
        if (element.isSpeech) { // 关闭对讲
          // this.$refs.plugin[index].stopSpeech()
          // this.$refs.plugin[index].closeSpeech()
          this.closeSpeech()
        }
        if (element.showVolume) { // 关闭伴音
          this.$refs.plugin[index].closeSound()
        }
        if (isDom) {
          obj.playStatus = true
        }
        let dom = this.pluginDom(index)
        dom && dom.CloseRealStream()
        this.$refs.plugin[index].showPTZ = false
        this.updateStatus(index, obj)
      }
      if (elementSource) {
        this.$emit('stopBack', elementSource)
      }
      if (isDom) {
        this.videoPageData.splice(index, 1)
      }
    },
    PTZClick() { // 云台
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].PTZClick()
    },
    async changeStream(val, index = this.checkedPane) { // 码流切换
      let element = this.videoStatusArr[index]
      if (!element.isPlay) { return }
      if (val === element.source.streamType) { return }
      this.$refs.plugin[index].closeRecord() // 停止录像
      if (element.isSpeech) { // 停止对讲
        // this.$refs.plugin[index].stopSpeech()
        // this.$refs.plugin[index].closeSpeech()
        this.closeSpeech()
      }
      let videoData = JSON.parse(JSON.stringify(element.source))
      videoData.streamType = val
      try {
        let pStatus = await this.openIndexPreview(videoData, index, true)
        if (pStatus !== 0) { // 切换失败，重开之前码流
          this.openIndexPreview(element.source, index)
        }
      } catch(err) {
        this.$messageError('码流切换失败', '提示')
      }
    },
    async clickCheckedWmode(mode) { // 画面切换将选中项及是否单画面置为初始值
      if (this.checkedWmode === mode.value) {
        return
      }
      this.$emit('changeDefaultPane', mode.value)
      this.checkedWmode = mode.value
      this.isMaximize = false
      this.checkedPane = 0
      this.curPage = 1
      if (this.pollingTimer) {
        this.pollingTimer && clearInterval(this.pollingTimer)
        this.pollingFunc(this.pollingSourceData)
      } else {
        for (let index = 0; index < this.defaultTotalPane; index++) {
          await this.stopPreview(index)
        }
        let obj = document.querySelector('.single-video-plugin')
        obj.style.opacity = '0'
        setTimeout(() => {
          obj.style.opacity = '1'
        }, 0)
        for (let index = 0; index < this.checkedWmode; index++) {
          if (this.videoPageData[index]) {
            await this.openPreview(this.videoPageData[index], index)
          }
        }
      }
    },
    startStopPreview() { // 用于单窗口的打开或者关闭预览
      if (!this.selectedObj.isPlay) {
        this.openPreview(this.savePreviewData)
      } else {
        this.stopPreview(this.checkedPane)
      }
    },
    setScale(val) {
      // 模式  todo轮巡判断
      if (!this.selectedObj.isPlay) {
        return
      }
      this.updateStatus(this.checkedPane, { scale: val.label })
      this.$refs.plugin[this.checkedPane].setScale(val.value)
    },
    polling(val) {
      this.$emit('polling', val)
    },
    pollingFunc(pollingData) {
      this.pollingSourceData = pollingData
      // 获取轮巡时间
      let time = localStorage.getItem('pollingTime') || 10
      let dealData = []
      // 处理成[[],[]]
      if (Array.isArray(pollingData)) {
        let page = Math.ceil(pollingData.length / this.checkedWmode)
        for (let i = 0; i < page; i++) {
          let data = pollingData.slice(i * this.checkedWmode, (i + 1) * this.checkedWmode)
          dealData.push(data)
        }
        // console.log(dealData, dealData.length, i%dealData.length)
        let i = 0
        this.pollPreview(dealData[i%dealData.length]) // 先调用一次
        this.pollingTimer = setInterval(() => {
          i++
          let len = dealData.length
          let data = dealData[i%len]
          // console.log(i%len)
          this.pollPreview(data)
        }, time * 1000)
      }
    },
    async pollPreview(data) { // 轮巡开流方法
       // 先关闭全部
      this.stopPreviewALL(true)
      this.curPage = 1
      this.checkedPane = 0
      this.videoPageData = this.videoPageData.concat(data)
      for (let index = 0; index < this.checkedWmode; index++) {
        if (data[index]) {
          await this.openIndexPreview(data[index], index)
        }
      }
    },
    pollingStopFunc() {
      this.pollingTimer && clearInterval(this.pollingTimer)
      this.pollingTimer = null
      this.stopPreviewALL(true)
      this.pollingSourceData = []
    }
  },
  beforeDestroy() {
    this.pollingTimer && clearInterval(this.pollingTimer)
    this.pollingTimer = null
    this.pollingSourceData = []
    this.callerInfo = null
    if (this.seqId) {
      this.closeSpeech()
      this.seqId = ''
    }
    if (this.selectedObj.isCentreRecording) {
      this.$refs.plugin[this.checkedPane].stopCentreRecord()
    }
  }
}
