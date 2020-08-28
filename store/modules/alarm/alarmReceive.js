/*
 * @Author: mahuichun
 * @Date: 2020-05-25 14:56:13
 * @LastEditTime: 2020-05-25 18:11:38
 * @LastEditors: mahuichun
 * @Description: 报警配置相关
 */
import {
  getAlarmReceiveListApi,
  alarmDealSubmitApi,
  alarmDealDeleteApi,
  shortMessageApi,
  sendSMSApi,
  postOpenDoorApi,
  postCloseDoorApi,
  postTalkDeviceLoginApi,
  postEndTalkApi,
  postBeginTalkApi,
  postAlarmArmApi,
  postAlarmarmLoginApi,
  findLocationDetailApi,
  findCountApi,
  findHostBindApi,
  findorgHostTreeApi,
  getstatusApi,
  getMacMessageApi,
  getFocusApi,
  postFocusApi,
  putFocusApi,
  getGuardLinkApi,
  findHostBindDetectorApi,
  getCabinLinkApi,
  findAssigncenteranswerApi,
  findorgTolkTreeApi,
  findAudioLinkApi,
  postStartinTalkApi,
  postCloseTalkApi,
  getSmsIpApi,
  findVideoApi,
  findVideoLinkApi,
  getOutputStatusApi,
  getchannelinfoDoorStatusApi,
  postAlarmdisposeApi,
  postAlarmdisposeendApi,
  postReceiveAlarmApi,
  postSetDevAlarmOutPuOpenApi, postSetDevAlarmOutPuCloseApi, postAlarmcleanApi, postAlarmdisarmApi, superiorPushApi
} from '../../../http/alarm/alarmReceive.api'

// 报警相关
const state = {
  // 报警处置页面接收报警数据
  alarmDealTableData: [],
  stopResiveStatas: false,
}
const getters = {
  stopResiveStatas () {
    return state.stopResiveStatas
  }
}

const mutations = {
  SET_ALARM_DEAL_TABLE_DATA ({ commit }, payload) {
    this.alarmDealTableData = payload.data.results
  },
  // 接受sockct推送的报警信息
  PUSH_ALARM_DEAL_TABLE_DATA ({ commit }, payload) {
    this.alarmDealTableData.push(payload)
  },
  // 改变接警的状态
  STOP_RESIVE_STATAS (state, payload) {
    console.log(arguments, state, payload)
    state.stopResiveStatas = payload
  }
}

const actions = {
  // 获取报警配置列表
  getAlarmReceiveList ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmReceiveListApi(payload).then(res => {
        // this.SET_ALARM_DEAL_TABLE_DATA(res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取详情
  findLocationDetail ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findLocationDetailApi(payload).then(res => {
        // this.SET_ALARM_DEAL_TABLE_DATA(res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取统计
  findCount ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findCountApi(payload).then(res => {
        // this.SET_ALARM_DEAL_TABLE_DATA(res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 报警处置提交（单个报警提交，批量提交）
  alarmDealSubmit ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      alarmDealSubmitApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 移除
  alarmDealRemove ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      alarmDealDeleteApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取短信
  getShortMessage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      shortMessageApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 发送短信
  postSendSMS ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      sendSMSApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 北京接口门的打开
  postOpenDoor ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postOpenDoorApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 北京接口门的关闭
  postCloseDoor ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postCloseDoorApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 登录对讲设备
  postTalkDeviceLogin ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postTalkDeviceLoginApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 开始对讲
  postBeginTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postBeginTalkApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 开始对讲
  postStartinTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postStartinTalkApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 开始对讲主动挂断
  postCloseTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postCloseTalkApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 结束对讲
  postEndTalk ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postEndTalkApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 警笛打开
  postSetDevAlarmOutPuOpen ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postSetDevAlarmOutPuOpenApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取警铃的当前状态
  getOutputStatus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getOutputStatusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取警铃的当前状态
  getchannelinfoDoorStatus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getchannelinfoDoorStatusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 警笛关闭
  postSetDevAlarmOutPuClose ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postSetDevAlarmOutPuCloseApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 布防登录
  postAlarmArmLogin ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmarmLoginApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 布防
  postAlarmArm ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmArmApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 撤防
  postAlarmdisarm ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmdisarmApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 消警
  postAlarmclean ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmcleanApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 向上級推送
  superiorPush ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      superiorPushApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取关联关系
  findHostBind ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findHostBindApi(payload.id, { ref: payload.ref, whichPage: 'deal' }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取重点资源树
  findorgHostTree ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findorgHostTreeApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取布撤防状态
  getstatus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getstatusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // getMacMessageApi
  getMacMessage ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getMacMessageApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取重点关注资源
  getFocus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getFocusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 保存重点关注资源
  postFocus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postFocusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 更新重点关注资源
  putFocus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      putFocusApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取门禁通道，主机关联信息
  getGuardLink ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getGuardLinkApi(payload.id, { ref: payload.ref }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取报警主机下探测器关联信息
  findHostBindDetector ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findHostBindDetectorApi(payload.id, { ref: payload.ref, whichPage: 'deal' }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取防护舱关联信息
  getCabinLink ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getCabinLinkApi(payload.id, { ref: payload.ref }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取视频关联信息
  findVideoLink ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findVideoLinkApi(payload.id, { ref: payload.ref }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取视频关联信息
  findAudioLink ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findAudioLinkApi(payload.id, { ref: payload.ref }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取视频关联信息
  findVideo ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findVideoApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取报警分组信息
  findAssigncenteranswer ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findAssigncenteranswerApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取报警分组信息
  findorgTolkTree ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      findorgTolkTreeApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取短信ip
  getSmsIp ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getSmsIpApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 完成报警消息给es通知
  postAlarmdisposeend ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmdisposeendApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 开始处理报警消息给es通知
  postAlarmdispose ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postAlarmdisposeApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 开始处理报警 
  postReceiveAlarm ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      postReceiveAlarmApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
