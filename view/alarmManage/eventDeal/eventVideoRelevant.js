export default {
  data () {
    return {

    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    preview (row, column, event) {
      this.postAlarmdisposeFuc(row.id) //  接警给北京发通知
      this.postReceiveAlarmFuc(row.id)//接警
      // this.linkData = []
      // if (row.alarmTypeName === '门禁报警') {
      //   if (row.resourceId) {
      //     this.getGuardLinkFuc({ id: row.resourceId, ref: 2 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   } else {
      //     this.getGuardLinkFuc({ id: row.deviceId, ref: 1 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   }
      // } else if (row.alarmTypeName === '入侵报警') {
      //   if (row.resourceId) {
      //     this.findHostBindDetectorFuc({ id: row.resourceId, ref: 2 }).then(res => {
      //       if (res) {
      //         this.previewPlay(res, row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   } else {
      //     this.findHostBindFuc({ id: row.deviceId, ref: 1 }).then(res => {
      //       if (res) {
      //         this.previewPlay(res, row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   }
      // } else if (row.alarmTypeName === '防护舱报警') {
      //   if (row.resources) {
      //     this.getCabinLinkFuc({ id: row.resourceId, ref: 2 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   } else {
      //     this.getCabinLinkFuc({ id: row.deviceId, ref: 1 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   }
      // } else if (row.alarmTypeName === '视频报警') {
      //   if (row.resources) {
      //     this.findVideoLinkFuc(row.resourceId, { ref: 2 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   } else {
      //     this.findVideoLinkFuc(row.deviceId, { ref: 1 }).then(res => {
      //       if (res && res.length > 0) {
      //         this.previewPlay(res[0], row)
      //       } else {
      //         this.$message({
      //           message: '无关联视频',
      //           type: 'success'
      //         })
      //       }
      //     })
      //   }
      // }
    },
    // 播放视频
    previewPlay (val, detail) {
      detail.stateName = '关注'
      detail.phoneComing = '接听'
      detail.phoneOver = '挂断'
      detail.talkRequest = "T"
      let data = {
        channel: Number(val.channelNum) || Number(val.serise),
        devIp: val.type === 4 ? val.ip : val.deviceIp || val.hostIp,
        devCport: val.type === 4 ? val.cport : val.devicePort || val.hostPort,
        devDport: val.type === 4 ? val.dport : val.deviceDport || val.hostDport,
        streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2'),
        // channel: 1,
        // devIp: '10.2.2.20',
        // devCport: 3721,
        // devDport: 3720,
        // streamType: 'main',
        detail: detail
      }
      // this.$refs.preview.openPreview(data)
      this.$refs.preview.alarmPreview(data)
    },
    // 报警推送视频弹出
    socketPreview (data) {
      let val = data.action_dict && data.action_dict.cameraInfo.length > 0 && data.action_dict.cameraInfo[0]
      let detail = data
      // detail.stateName = '关注'
      detail.phoneComing = '接听'
      detail.phoneOver = '挂断'
      detail.eventTypeName = data.eventTypeName
      let datax = {}
      if (val) {
        datax = {
          channel: Number(val.channelNum),
          devIp: val.ip,
          devCport: val.port,
          devDport: val.dport,
          streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2'),
          // channel: 1,
          // devIp: '10.2.2.20',
          // devCport: 3721,
          // devDport: 3720,
          // streamType: 'main',
          detail: detail,
          subType: data.subType,
          eid: detail.id,  // 排序id
          id: data.channelId,
          dId: data.deviceId,
          type: data.type,
          deviceName: data.deviceName,
        }
      } else {
        datax = {
          // channel:null,
          // devIp: '',
          // devCport: '',
          // devDport: '',
          // streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2'),
          channel: 1,
          devIp: '10.2.2.20',
          devCport: 3721,
          devDport: 3720,
          streamType: 'main',
          detail: detail,
          eid: detail.id,  // 排序id
          id: data.channelId,
          subType: data.subType,

          dId: data.deviceId,
          type: data.type,
          deviceName: data.deviceName,
        }
      }
      console.log(datax)
      // 记录视频总数
      this.socketTableArray_.push(datax)
      this.socketTableArray = this.alarmSortFuc(this.socketTableArray_)
      // console.log(this.socketTableArray_)
      console.log(this.socketTableArray)
      console.log(datax)
      this.$refs.preview.sortArrIndex(this.socketTableArray, datax)
      // this.$refs.preview.openPreview(datax)
    },
    // 视频插槽回调
    followFuc (paneMark, paneMarkInfo) {
    },
    alarmDataFuc (data, type, allData) {
      console.log(data)
      console.log(type)
      if (type === 1) {
        console.log(data.detail.id)
        this.locationIdObj.locationId = data.detail && data.detail.locationId
        this.locationIdObj.deviceId = data.detail && data.detail.deviceId
        this.locationIdObj.channelId = data.detail && data.detail.id

        let index = this.tableData.findIndex(xx => xx.id === data.detail.id)
        this.$refs.singleTable.setCurrentRow(this.tableData[index]) //
      }
    }
  }
}
