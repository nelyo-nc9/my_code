import { downloadDev } from '../../playback/playBackPlugin/playback'
import { pluginPlayBackOpen } from '@src/components/videoPlugin/playback/common/plginInMethod.js'
// import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction.js'
import { screenShootApi } from '@src/http/video/videoPreview.api.js'


export default {
  data() {
    return {
      playBackObj: {},
      isNeedStream: false
    }
  },
  methods: {
    async getBase64Capture() { // Base64截图,上传服务器
      if (!this.singleStatus.isPlay) {
        return
      }
      let Base64Data = await this.getCoverPic()
      let param = {
        base64Img: Base64Data,
        channelId: this.singleStatus.source.id
      }
      screenShootApi(param).then(res => {
        console.log(res, '截图-res')
        this.$messageSuccess('截图上传成功！', '成功')
      }).catch(err => {
        console.log(err, '截图-err')
        this.$messageError('截图上传失败，请稍后重试！', '错误')
      })
    },
    getCoverPic() { // 视频截图
      return new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.$refs.object.GetRealPicturebyBase64(1, 50)
        }
        resolve(src)
      })
    },
    sliderChange(val) { // 拖动进度条
      // console.log('拖动进度条的值', val)
      let resInfo = this.singleStatus.source
      if (!resInfo) { return }
      // console.log('计算拖动的值', Math.floor(120 * val / 100))
      let newStartTime = this.playBackObj.startTime + Math.floor(40 * val / 100)
      // let newStartTime = this.playBackObj.startTime + Math.floor(120 * val / 100)
      if (resInfo.deviceType === 1 || resInfo.deviceType === 2 || resInfo.deviceType === 3) {
        resInfo.devType = resInfo.sipCode ? 2 : 1
      } else {
        resInfo.devType = resInfo.sipCode ? 4 : 3
      }
      resInfo.newStartTime = newStartTime
      resInfo.endTime = this.playBackObj.endTime
      this.$nextTick(async () => {
        const state = await pluginPlayBackOpen(this.$refs.object, resInfo, '', true)
        if (state === 0) {
          // this.$emit('updateStatus', this.paneMark, { isPlay: true, source: resInfo})
          this.isNeedStream = false
          this.$refs.playbackbtn.timer()
          // 给回放设置回调
          this.$refs.object.SetStateCallback(() => {
            this.stopPlayback()
          })
        } else {
          this.$messageError('查询无录像')
        }
      })
    },
    stopRecordPlay() { // 快速回放播放和暂停
      if (this.singleStatus.isPlay) {
        this.$refs.object.StopRecordPlay()
        this.$emit('updateStatus', this.paneMark, { isPlay: false  })
        this.$refs.playbackbtn.clearTimer()
      } else {
        // 播放需要判断是否再次开流
        if (this.isNeedStream) {
          this.openPlayback(this.singleStatus.source)
        } else {
          this.$refs.object.StartRecordPlay()
        }
        this.$emit('updateStatus', this.paneMark, { isPlay: true  })
        this.$refs.playbackbtn.timer()
      }
    },
    async openPlayback(data) { // 回放开流
      let resInfo = this.singleStatus.source || data
      if (!resInfo) { return }
      if (!this.playBackObj.startTime) {
        this.playBackObj.startTime = Math.round(new Date() / 1000) - 40 // 默认是当前时间往前40s的录像
        // this.playBackObj.startTime = Math.round(new Date() / 1000) - 120
        this.playBackObj.endTime = Math.round(new Date() / 1000)
      }
      if (resInfo.deviceType === 1 || resInfo.deviceType === 2 || resInfo.deviceType === 3) {
        resInfo.devType = resInfo.sipCode ? 2 : 1
      } else {
        resInfo.devType = resInfo.sipCode ? 4 : 3
      }
      resInfo.startTime = this.playBackObj.startTime
      resInfo.endTime = this.playBackObj.endTime
      // let res = await queryData(resInfo)
      // if (resInfo.devType === 3) { // 中心非国标特殊
      //   resInfo.ip = res[0].dsIp
      //   resInfo.port = res[0].dsPort
      // }
      this.$emit('updateStatus', this.paneMark, { playStatus: true, source: resInfo})
      this.$nextTick(async () => {
        const state = await pluginPlayBackOpen(this.$refs.object, resInfo)
        // console.log('插件', state, resInfo.deviceType)
        if (state === 0) {
          this.$emit('updateStatus', this.paneMark, { isPlay: true, source: resInfo})
          this.isNeedStream = false
          this.$refs.playbackbtn.timer()
          // 给回放设置回调
          this.$refs.object.SetStateCallback(() => {
            // console.log('huidiao zhixing ')
            this.stopPlayback()
          })
        } else {
          this.$messageError('查询无录像')
        }
      })
    },
    goBack() { // 返回预览
      this.$refs.object.StopRecordPlay()
      this.$emit('updateStatus', this.paneMark, { isPlayback: false, isPlay: false, playStatus: false  })
      this.$emit('openPreview', this.singleStatus.source, this.paneMark)
    },
    download() {
      let params = {}
      downloadDev(params, new Date().getTime() + this.$parent.defaultPane, this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download')
    },
    stopPlayback() {
      // console.log('stopPlayback出发了')
      this.$emit('updateStatus', this.paneMark, { isPlay: false })
      this.isNeedStream = true
      this.$refs.object.CloseRecordPlay()
      this.$refs.playbackbtn.clearTimer()
      this.progress = 0
      this.playTime = this.playBackObj.startTime || ''
    }
  } 
}