import _ from 'lodash'
export default {
  data () {
    return {
      linkage: {
        guard: {
          icon: 'icon-close-door',
          btns:
            [
              {
                id: '1',
                tit: '打开',
                type: 'primary',
                callback: (param) => {
                  // return this.postOpenDoorFuc(param)
                  return this.getchannelinfoDoorStatusFuc(param, 'open')
                },
                params:
                {
                  // 'devIp': '10.1.1.91',
                  // 'devPort': 9708,
                  // 'hostId': '228e86910a2349e9a7f17dab97cb8054',
                  // 'channelId': '228e86910a2349e9a7f17dab97cb8054_1'
                  guardId: ''
                },
                show: true

              },
              {
                id: '1',
                tit: '关闭',
                type: 'primary',
                callback: (param) => {
                  // return this.postCloseDoorFuc(param)
                  return this.getchannelinfoDoorStatusFuc(param, 'close')

                },
                params: {
                  // doorServerIp: '', // 门禁平台IP
                  // doorServerPort: '', // 门禁平台端口
                  // hostId: '', // 门禁主机ID
                  // channelId: '' // 门ID或者通道ID
                  guardId: ''
                },
                show: true
              }
            ]
          // type: 'door'
        },
        audio: {
          icon: 'icon-intercom',
          btns:
            [
              {
                tit: '呼叫',
                type: 'primary',
                callback: (param, index, btnIndex) => {
                  return this.postStartinTalkFuc(param, index, btnIndex)
                },
                params: {
                  //   login: {
                  //     loginerId: '', // 登录着服务id
                  //     heart: '',
                  //     serverIp: '',
                  //     serverPort: 8090,
                  //     serverId: ''
                  //   },
                  calld: {
                    myMikeId: '',
                    calledMikeIds: '',
                    calledpanelIds: ''
                  },
                  talk: {
                    serverId: '111',
                    serverIp: '192.168.14.208',
                    serverPort: 2048,
                    callerPanelInfo:
                    {
                      hostIp: '192.168.14.204', // 面板所属主机ip
                      hostPort: 2046, // 面板所属主机端口
                      hostId: '004', // 面板所属主机id
                      id: 1 // 面板本身id
                    },
                    calledMikeInfo: [
                      {
                        id: '222003',
                        ip: '192.168.14.25',
                        port: 2046
                      }]
                  },
                  disabled: true
                },
                show: true
              },
              {
                tit: '挂断',
                type: 'default',
                callback: (param, index, btnIndex) => {
                  return this.postCloseTalkFuc(param, index, btnIndex)
                },
                params: {
                  // seqId: '', // 对讲组唯一编号
                  // serverIp: '192.168.14.208', // 服务器ip
                  // serverPort: 2048// 服务器端口
                  calld: {
                    myMikeId: '',
                    seqId: this.seqId
                  }
                },
                disabled: true,
                show: true
              }

            ]
          // type: 'intercomPanel'
        },
        // 报警主机
        alarm: {
          icon: 'icon-baojing',
          btns:
            [
              {
                tit: '布防',
                type: 'primary',
                callback: (param, index, btnIndex) => {
                  return this.postAlarmArmLoginFuc(param, index, btnIndex)
                  // return this.postAlarmArmFuc(param.operation)
                },
                params: {
                  operation: {
                    devIp: '10.1.7.10',
                    devPort: 8000,
                    subSystem: [0, 1, 2]
                  },
                  getStatus: {},
                  login: {
                    'devIp': '10.1.7.10',
                    'devPort': 8000,
                    'username': 'admin',
                    'passwd': 'test-123',
                    'vendor': 'HIKVISION', // 厂商
                    'devType': 'AlarmHost', // 设备类型
                    'devBaseType': 'AlarmHost', // 设备类型
                    'connMode': 'active', //
                    'version': '1',
                    'daServerId': 'DAPYTHON:192.168.14.10:12000:E3060500FFFBAB1F' //
                  }
                },
                show: true
              },
              {
                tit: '撤防',
                type: 'default',
                callback: (param) => {
                  return this.postAlarmDisarmLoginFuc(param)
                  //return this.postAlarmdisarmFuc(param.operation)
                },
                params: {
                  operation: {
                    devIp: '10.1.7.10',
                    devPort: 8000,
                    subSystem: [0, 1, 2]
                  },
                  getStatus: {},
                  login: {
                    'devIp': '10.1.7.10',
                    'devPort': 8000,
                    'username': 'admin',
                    'passwd': 'test-123',
                    'vendor': 'HIKVISION',
                    'devType': 'AlarmHost',
                    'devBaseType': 'AlarmHost',
                    'connMode': 'active',
                    'version': '1',
                    'daServerId': 'DAPYTHON:192.168.14.10:12000:E3060500FFFBAB1F'
                  }
                },
                show: true
              },
              {
                tit: '消警',
                type: 'danger',
                callback: (param) => {
                  return this.postAlarmcleanLoginFuc(param)
                },
                params: {
                  operation: {
                    'devIp': '10.1.7.10',
                    'devPort': 8000,
                    'subSystem': 1,
                    'zoneList': [1, 2, 3]
                  },

                  login: {
                    'devIp': '10.1.7.10',
                    'devPort': 8000,
                    'username': 'admin',
                    'passwd': 'test-123',
                    'vendor': 'HIKVISION',
                    'devType': 'AlarmHost',
                    'devBaseType': 'AlarmHost',
                    'connMode': 'active',
                    'version': '1',
                    'daServerId': 'DAPYTHON:192.168.14.10:12000:E3060500FFFBAB1F'
                  }

                },
                show: true
              }
            ]
          // type: 'alarm'
        },
        // 报警声闪
        output: {
          icon: 'icon-alarm-input',
          btns:
            [
              {
                tit: '打开',
                type: 'primary',
                callback: (param) => {
                  // return this.postSetDevAlarmOutPuOpenFuc(param)
                  return this.getOutputStatusFuc(param, 'open')
                },
                params: {
                  // hostId: ''
                },
                show: true
              },
              {
                tit: '关闭',
                type: 'default',
                callback: (param) => {
                  // return this.postSetDevAlarmOutPuCloseFuc(param)
                  return this.getOutputStatusFuc(param, 'close')
                },
                params: {
                  // hostId: ''
                },
                show: true
              }
            ]
          // type: 'alarmSoundFlash'
        },
        talkId: '' // 保存正在接听对讲的id
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    // 远程开门
    postOpenDoorFuc (params) {
      this.postOpenDoor(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.$message({
              message: '开门成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          //  if(res.data)
        }
      })
    },
    // 远程关门
    postCloseDoorFuc (params) {
      this.postCloseDoor(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.$message({
              message: '关门成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          //  if(res.data)
        }
      })
    },
    // 登录对讲设备
    postTalkDeviceLoginFuc (params) {
      this.postTalkDeviceLogin(params).then(res => {
        if (res) {
          this.postBeginTalkFuc()
        }
      })
    },
    // 开始对讲
    postBeginTalkFuc (params) {
      this.postBeginTalk(params.talk).then(res => {
        if (res) {
          console.log(res)
          if (res.code === 0) {
            if (parseInt(res.data.code) === 0) {
              this.talkId = res.data.seqId
              this.$message({
                message: '打开成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
            //  if(res.data)
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 开始对讲(主动拨打)
    postStartinTalkFuc (params) {
      if (!params.calld.myMikeId) {
        this.$message({
          message: '您的终端未绑定台麦',
          type: 'error'
        })
        return
      }
      this.postStartinTalk(params.calld).then(res => {
        if (res) {
          console.log(res)
          if (res.code === 0) {
            if (parseInt(res.data.code) === 0) {
              this.talkId = res.data.seqId
              this.$message({
                message: '打开成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
            //  if(res.data)
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 挂断
    postCloseTalkFuc (param) {
      this.postCloseTalk(param.calld).then(res => {
        if (res && res.data) {

        }
      })
    },
    // 结束对讲
    postEndTalkFuc (params) {
      console.log(this.talkId)
      params.seqId = this.talkId
      this.postEndTalk(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.$message({
              message: '挂断成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          //  if(res.data)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 警笛打开
    postSetDevAlarmOutPuOpenFuc (params) {
      this.postSetDevAlarmOutPuOpen(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.$message({
              message: '打开成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data,
              type: 'error'
            })
          }
          //  if(res.data)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 警笛关闭
    postSetDevAlarmOutPuCloseFuc (params) {
      this.postSetDevAlarmOutPuClose(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.$message({
              message: '关闭成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          //  if(res.data)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    // 布防登录
    postAlarmArmLoginFuc (params, index, btnIndex) {
      // this.postAlarmArmLogin(params.login).then(res => {
      //   if (res.code === 0) {
      //     if (parseInt(res.data.code) === 0) {
      //       this.postAlarmArmFuc(params.operation)
      //     } else {
      //       this.$message({
      //         message: res.data.message,
      //         type: 'error'
      //       })
      //     }
      //   } else {
      //     this.$message({
      //       message: '登录失败',
      //       type: 'error'
      //     })
      //   }
      // })
      this.getstatus(params.getStatus).then(res => {
        if (res && res.code === 0) {
          if (res.data.code === 10005) {
            this.$message({
              message: '设备未登录',
              type: 'info'
            })
          } else {
            let subStatus = res.data && res.data.results && res.data.results.subSystemList[0].subStatus
            if (subStatus === 'disarm') {
              this.postAlarmArmFuc(params.operation)
            } else if (subStatus === 'arm') {
              this.$message({
                message: '该报警主机目前处于布防状态',
                type: 'info'
              })
            }
          }


        }
      })
    },
    postAlarmDisarmLoginFuc (params, index, btnIndex) {
      // this.postAlarmArmLogin(params.login).then(res => {
      //   if (res.code === 0) {
      //     if (parseInt(res.data.code) === 0) {
      //       this.postAlarmdisarmFuc(params.operation)
      //     } else {
      //       this.$message({
      //         message: res.data.message,
      //         type: 'error'
      //       })
      //     }
      //   } else {
      //     this.$message({
      //       message: '登录失败',
      //       type: 'error'
      //     })s
      //   }
      // })
      this.getstatus(params.getStatus).then(res => {
        if (res && res.code === 0) {
          if (res.data.code === 10005) {
            this.$message({
              message: '设备未登录',
              type: 'info'
            })
          } else {
            let subStatus = res.data && res.data.results && res.data.results.subSystemList[0].subStatus
            if (subStatus === 'disarm') {
              this.$message({
                message: '该报警主机目前处于撤防状态',
                type: 'info'
              })
            } else if (subStatus === 'arm') {
              this.postAlarmdisarmFuc(params.operation)
            }
          }
        }
      })
    },
    // 布防 postAlarmArmLogin
    postAlarmArmFuc (params) {
      this.postAlarmArm(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.linkData.map(item => {
              if (item.typeName === 'alarm') {
                item.btns[0].show = false
                item.btns[1].show = true
              }
            })
            this.linkData = _.assign([], this.linkData)
            console.log(this.linkData)
            this.$message({
              message: '布防成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 撤防
    postAlarmdisarmFuc (params) {
      this.postAlarmdisarm(params).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.linkData.map(item => {
              if (item.typeName === 'alarm') {
                item.btns[0].show = true
                item.btns[1].show = false
              }
            })
            this.linkData = _.assign([], this.linkData)
            this.$message({
              message: '撤防成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 消警登录
    postAlarmcleanLoginFuc (params) {
      this.postAlarmArmLogin(params.login).then(res => {
        if (res.code === 0) {
          if (parseInt(res.data.code) === 0) {
            this.postAlarmcleanFuc(params.operation)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
        }
      })
    },
    // 消警
    postAlarmcleanFuc (params) {
      this.postAlarmclean(params).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '消警成功',
            type: ' '
          })
        }
      })
    },
    // 获取警铃的当前状态
    getOutputStatusFuc (params, type) {
      let obj = {
        channelList: [params.outputNo],
        devIp: params.devIp,
        devPort: params.devPort
      }
      this.getOutputStatus(obj).then(res => {

        if (res && res.code === 0) {
          if (res.data.code === 10005) {
            this.$message({
              type: 'error',
              message: '设备未登录'
            })
          } else if (res.data.code === '0') {
            if (res.data.results && res.data.results && res.data.results.channelList.length > 0) {
              let status = res.data.results.channelList[0].status
              if (type === 'open') {
                if (status === 'close') {
                  this.postSetDevAlarmOutPuOpenFuc(params)
                } else {
                  this.$message({
                    type: 'error',
                    message: '当前状态已开启'
                  })
                }
              } else {
                if (status === 'close') {
                  this.$message({
                    type: 'error',
                    message: '当前状态已关闭'
                  })
                } else {
                  this.postSetDevAlarmOutPuCloseFuc(params)
                }
              }

            } else {
              this.$message({
                type: 'error',
                message: '设备状态异常'
              })
            }
          }
        }

      })
    },
    // 获取门的状态
    getchannelinfoDoorStatusFuc (params, type) {

      this.getchannelinfoDoorStatus(params).then(res => {
        if (res && res.code === 0) {
          if (res.data.code === 10005) {
            this.$message({
              type: 'error',
              message: '设备未登录'
            })
          } else if (res.data.code === '0') {
            if (res.data.results && res.data.results && res.data.results.length > 0) {
              let status = res.data.results[0].status
              if (type === 'open') {
                if (status === 'close') {
                  this.postOpenDoorFuc(params)
                } else {
                  this.$message({
                    type: 'error',
                    message: '该门已是打开状态'
                  })
                }
              } else {
                if (status === 'close') {
                  this.$message({
                    type: 'error',
                    message: '该门已是关闭状态'
                  })
                } else {
                  this.postCloseDoorFuc(params)
                }
              }

            } else {
              this.$message({
                type: 'error',
                message: '设备状态异常'
              })
            }
          }
        }
      })
    },
    //
    getMacMessageFuc () {
      let macData = JSON.parse(sessionStorage.getItem('macAddress'))
      let macStrArray = macData && macData.adaptors && macData.adaptors
      let macStr = ''
      console.log(macData)
      if (macStrArray.length > 0) {
        macStrArray.map(item => {
          macStr += item.mac + ','
        })
      }

      if (!macStr) { return }
      let param = {
        mac: macStr
      }
      this.getMacMessage(param).then(res => {
        if (res && res.data) {
          this.linkage.audio.btns[0].params.calld.myMikeId = res.data.hostUniqueId
          this.linkage.audio.btns[1].params.calld.myMikeId = res.data.hostUniqueId
        }
      })
    },
    // 获取门禁相关关联关系
    getGuardLinkFuc (param) {
      return this.getGuardLink(param).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
        }
      })
    },
    // 获取防护舱相关关联关系
    getCabinLinkFuc (param) {
      return this.getCabinLink(param).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
        }
      })
    },
    // 获取视频相关关联关系
    findVideoLinkFuc (param) {
      return this.findVideoLink(param).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
        }
      })
    },
    // 获取报警主机下探测器关联关系
    findHostBindDetectorFuc (payload) {
      return this.findHostBindDetector({ id: payload.id, ref: payload.ref }).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
        }
      })
    },
    // 获取对讲关联关系
    findAudioLinkFuc (param) {
      this.findAudioLink(param).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
        }
      })
    }

  }
}
