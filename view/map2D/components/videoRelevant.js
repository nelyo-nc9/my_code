export default {
  data () {
    return {
      videoallData: [],
      locationId: null
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    preview (row, column, event) {
      if(!this.isVideoCheckFuc(row)){
        return
      }
      this.linkData = []
      if (row.alarmTypeName === '门禁报警') {
        if (row.resourceId) {
          this.getGuardLinkFuc({ id: row.resourceId, ref: 2 }).then(res => {
            if (res && res.length>0) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        } else {
          this.getGuardLinkFuc({ id: row.deviceId, ref: 1 }).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        }
      } else if (row.alarmTypeName === '入侵报警') {
        if (row.resourceId) {
          this.findHostBindDetectorFuc(row.resourceId).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        } else {
          this.findHostBindFuc(row.deviceId).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        }
      } else if (row.alarmTypeName === '防护舱报警') {
        if (row.resources) {
          this.getCabinLinkFuc({ id: row.resourceId, ref: 2 }).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        } else {
          this.getCabinLinkFuc({ id: row.deviceId, ref: 1 }).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        }
      } else if (row.alarmTypeName === '视频报警') {
        if (row.resources) {
          this.findVideoLinkFuc(row.resourceId, { ref: 2 }).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        } else {
          this.findVideoLinkFuc(row.deviceId, { ref: 1 }).then(res => {
            if (res) {
              this.previewPlay(res, row)
            } else {
              this.$notify({
                message: '无关联视频',
                type: 'success'
              })
            }
          })
        }
      }
    },
    // 报警推送视频弹出
    // 推送的数据通道字段和数据获取 的不一样，注意注意
    socketPreview (val, detail) {
      let data = {
        // channel: 9,
        // devIp: '10.1.4.20',
        // devCport: 8000,
        // devDport: 8000,
        // streamType: 'main'
        channel: Number(val.channelNum) || Number(val.serise),
        devIp: val.ip,
        devCport: val.port,
        devDport: val.dport,
        streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2'),
        detail: detail
      }
      console.log(data)
      console.log('测试0000000000000000000')

      this.$refs.preview.openPreview(data)
    },
    openBack (data, index) {
      console.log(data)
      this.tableData.map(item => {
        if (item.id === data.id) {
          item.delete = index
        }
      })
    },
    closeVideo (indexs) {
      if (indexs instanceof Array) {
        indexs.map(item => {
          if (item.delete !== undefined && item.delete !== null) {
            this.$refs.preview.stopPreview(item.delete, false)
          }
        })
      } else {
        this.$refs.preview.stopPreview(indexs.delete, false)
      }
    },
    // 播放视频
    previewPlay(item, detail) {
      this.isBackVideo = true
      let videoArr = []
      item.map(val => {
        let data = {
          channel: Number(val.serise) || Number(val.channelNum),
          devIp: val.type === 4 ? val.ip : val.hostIp,
          devCport: val.type === 4 ? val.cport : val.hostPort,
          devDport: val.type === 4 ? val.dport : val.hostDport,
          streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2'),
          // channel: 1,
          // devIp: '10.2.2.20',
          // devCport: 3721,
          // devDport: 3720,
          // streamType: 'main',
          alarmTime: new Date(detail.startTime).getTime() / 1000,
          name: detail.alarmName,
          detail: detail
        }
        videoArr.push(data)
      })

      this.previewData = videoArr.slice(0, 6)
      console.log(this.previewData)

      // debugger
      this.$nextTick(() => {
        this.$refs.pluginP.openPreviewData()
      })
      this.locationId = detail.locationId
      // this.$refs.pluginP.openPreviewData(videoArr)
    },
    alarmDataFuc (data, type, allData) {
      console.log(data)
      console.log(type)
      if (type === 1) {
        console.log(data.detail.id)
        this.locationIdObj.locationId = data.detail && data.detail.locationId
        this.locationIdObj.deviceId = data.detail && data.detail.deviceId
        this.locationIdObj.channelId = data.detail && data.detail.id

        let index = this.tableData.findIndex(xx=>xx.id===data.detail.id)
        this.$refs.singleTable.setCurrentRow(this.tableData[index]) //
      } else if (type === 2) {
        console.log(type)
        this.isBackVideo = true
        this.videoallData = allData
        // 如果没有配置，则不弹出视频复核
        if (!this.isVideoCheckFuc(data.detail)) {
          return
        }
        this.previewPlay(data.detail && data.detail.action_dict && data.detail.action_dict.cameraInfo, data.detail)
      }
    },
    // 查看重点部位视频
    print_schedule () {
      const { href } = this.$router.resolve({
        name: `LinkVideo`,
        query:  this.locationIdObj
      })

      if (this.locationIdObj.locationId) {
        window.open(href, '_blank')
      } else {
        this.$notify({
          message: '该报警重点部位为空',
          type: 'error'
        })
      }
    },
    backOrderVideo () {
      this.isBackVideo = false
      this.$nextTick(() => {
        this.$refs.preview.openAll(this.videoallData)
      })
    },
  }
}
