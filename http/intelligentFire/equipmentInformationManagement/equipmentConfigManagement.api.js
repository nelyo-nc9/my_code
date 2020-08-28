import { get, post, remove, put } from '../../base'

/**
 * 获取报警策略配置api
 * @param {*}
 */
export const getPolicyConfigurationApi = () => {
  const param = {
    url: '/fire/v1/device-config/strategy'
  }
  return get(param)
}

/**
 * 更新报警策略配置api
 * @param {*}
 */
export const putPolicyConfigurationApi = (payload) => {
  const param = {
    url: '/fire/v1/device-config/strategy',
    body: payload
  }
  return put(param)
}

export const getAlarmLogListApi = (payload) => {
  let param = {
    url: 'alarm-manage/v1/alarm-log/log',
    query: payload
  }
  return get(param)
}

/**
 * 报警等级及联动录像配置获取api
 * @param {*}
 */
export const getAlarmLevelLinkVideoApi = () => {
  const param = {
    url: '/fire/v1/device-config/level'
  }
  return get(param)
}

/**
 * 报警等级及联动录像配置更新api
 * @param {*}
 */
export const putAlarmLevelLinkVideoApi = (payload) => {
  const param = {
    url: '/fire/v1/device-config/level',
    body: payload
  }
  return put(param)
}

/**
 * 报警联动配置更新
 * @param {*}
 */
export const putAlarmLinkApi = (payload) => {
  const param = {
    url: 'fire/v1/device-config/action',
    body: payload
  }
  return put(param)
}

/**
 * 报警联动获取
 * @param {*}
 */
export const getAlarmlinkApi = (payload) => {
  const param = {
    url: '/fire/v1/device-config/action',
    query: payload
  }
  return get(param)
}
