import { post, put, get, remove } from '../base'
// 报警配置管理机构树
export const alarmGetTreeApi = playload => {
    let params = {
        url: 'resource/v1/tree/orgResourceTree',
        query: playload
    }
    return get(params)
}

// 机构树搜索
export const alarmSearchTree = (playload) => {
        const params = {
            url: 'resource/v1/tree/mists/search',
            query: playload
        }
        return get(params)
    }
    // 获取指定视频主机/通道联动配置
export const getAlarmLoglinkTree = (playload) => {
    let params = {
        url: 'alarm-manage/v1/alarm-log/link-tree',
        body: playload
    }
    return post(params)
}

// 获取指定视频主机/通道联动配置
export const getHostMoreLinks = (playload) => {
    let params = {
        url: 'alarm-manage/v1/alarm-host/bind',
        body: playload
    }
    return post(params)
}

// 获取事件日志
export const getAlarmEventLog = (playload) => {
    let params = {
        url: 'alarm-manage/v1/alarm-log/event-log',
        query: playload
    }
    return get(params)
}

// 获取操作类型
export const getOperationType = () => {
    let params = {
        url: 'alarm-manage/v1/alarm-log/operation-type'
    }
    return get(params)
}

// 获取操作日志
export const getAlarmOperationLog = (playload, page) => {
    let params = {
        url: `systemOpsManager/v1/systemOpsManager/queryOperationLog/?page=${page.page}&limit=${page.limit}`,
        body: playload
    }
    return post(params)
}

// 获取指定视频主机/通道联动配置
export const setHostMoreLinks = (playload) => {
    let params = {
        url: 'alarm-manage/v1/alarm-host/bind',
        body: playload
    }
    return put(params)
}

// 获取指定视频主机/通道联动配置
export const getHostOrResourceApi = (id, playload) => {
    let params = {
        url: `alarm-manage/v1/alarm-host/bind/${id}`,
        query: playload
    }
    return get(params)
}

/**
 * 新增报警主机api
 * @param {*} payload 新增报警主机入参
 */
export const addAlarmHostApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host',
        body: payload
    }
    return post(param)
}

/**
 * 修改报警主机api
 * @param {*} payload 修改报警主机入参
 */
export const updateAlarmHostApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host',
        body: payload
    }
    return put(param)
}

/**
 * 迁移api
 * @param {*} payload 修改报警主机入参
 */
export const moveAlarmHostApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host/move',
        body: payload
    }
    return put(param)
}

/**
 * 查询报警主机api
 * @param {*} payload 查询报警主机入参
 */
export const getAlarmHostApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host',
        query: payload
    }
    return get(param)
}

/**
 * 排序获取api
 * @param {*} payload 查询报警主机入参
 */
export const getAlarmHostOrderApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/order',
        query: payload
    }
    return get(param)
}

/**
 * 获取服务器列表
 * @param {*} payload 查询报警主机入参
 */
export const getServerListApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-bstar/server'
    }
    return get(param)
}

/**
 * 获取日志报警类型列表
 * @param {*} payload 查询报警主机入参
 */
export const getAlarmTypeApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-log/alarm-type'
    }
    return get(param)
}

/**
 * 获取子系统列表
 * @param {*} payload 查询报警主机入参
 */
export const getLogSubsystemApi = payload => {
    const param = {
        url: '/resource/v1/guard/system'
    }
    return get(param)
}

/**
 * 查询报警主机按照各个条件查询api
 * @param {*} payload 查询报警主机入参
 */
export const getSearchAlarmHostApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host',
        query: payload
    }
    return get(param)
}

/**
 * 查询报警主机按照各个条件查询api
 * @param {*} payload 查询报警主机入参
 */
export const searchHostApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/hosts',
        query: payload
    }
    return get(param)
}

/**
 * 查询单个报警主机api
 * @param {*} payload 查询报警主机入参
 */
export const getSingleAlarmHostApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/single',
        query: payload
    }
    return get(param)
}

/**
 * 删除报警主机api
 * @param {*} ids 删除主机数组
 */
export const deleteAlarmHostApi = ids => {
    const param = {
        url: 'alarm-manage/v1/alarm-host'
    }
    return remove(param, { data: { ids } })
}

/**
 * 报警主机排序api
 * @param {*} ids
 */
export const sortAlarmHostApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host',
        body: payload
    }
    return put(param)
}

/**
 * 新增探测器api
 * @param {*} payload 新增探测器入参
 */
export const addDetectorApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detector',
        body: payload
    }
    return post(param)
}

/**
 * 获取数据字典api
 * @param {*} payload 新增探测器入参
 */
export const getDataDictBasicInfoApi = payload => {
    const param = {
        url: 'systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
        body: payload
    }
    return post(param)
}

/**
 * 修改探测器api
 * @param {*} payload 修改探测器入参
 */
export const updateDetectorApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host/detector',
        body: payload
    }
    return put(param)
}

/**
 * 查询探测器api
 * @param {*} payload 查询探测器入参
 */
export const getDetectorApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detector',
        query: payload
    }
    return get(param)
}

/**
 * 查询探测器api
 * @param {*} payload 查询探测器入参
 */
export const getDetectorsApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detectors',
        query: payload
    }
    return get(param)
}

/**
 * 删除探测器api
 * @param {*} ids 删除探测器数组
 */
export const deleteDetectorApi = ids => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detector'
    }
    return remove(param, { data: { ids } })
}

/**
 * 新增输出通道api
 * @param {*} payload 新增输出通道入参
 */
export const addOutputChanApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/output-chan',
        body: payload
    }
    return post(param)
}

/**
 * 修改输出通道api
 * @param {*} payload 修改输出通道入参
 */
export const updateOutputChanApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host/output-chan',
        body: payload
    }
    return put(param)
}

/**
 * 查询输出通道api
 * @param {*} payload 查询输出通道入参
 */
export const getOutputChanApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/output-chan',
        query: payload
    }
    return get(param)
}

/**
 * 删除输出通道api
 * @param {*} ids 删除输出通道数组
 */
export const deleteOutputChanApi = ids => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/output-chan'
    }
    return remove(param, { data: { ids } })
}

/**
 * 新增子系统api
 * @param {*} payload 新增子系统入参
 */
export const addSubsystemApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/subsystem',
        body: payload
    }
    return post(param)
}

/**
 * 修改子系统api
 * @param {*} payload 修改子系统入参
 */
export const updateSubsystemApi = (payload) => {
    let param = {
        url: 'alarm-manage/v1/alarm-host/subsystem',
        body: payload
    }
    return put(param)
}

/**
 * 查询子系统api
 * @param {*} payload 查询子系统入参
 */
export const getSubsystemApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/subsystem',
        query: payload
    }
    return get(param)
}

/**
 * 删除子系统api
 * @param {*} ids 删除子系统数组
 */
export const deleteSubsystemApi = ids => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/subsystem'
    }
    return remove(param, { data: { ids } })
}

/**
 * 报警主机关联配置新增api
 * @param {*} payload 新增报警主机入参
 */
export const addAlarmHostBindApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/host-bind',
        body: payload
    }
    return post(param)
}

/**
 * 报警主机关联配置修改api
 * @param {*}
 */
export const updataAlarmHostBindApi = (payload) => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/host-bind',
        body: payload
    }
    return put(param)
}

/**
 * 报警主机关联配置新增api
 * @param {*} payload 新增报警主机入参
 */
export const addDetectorBindApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detector-bind',
        body: payload
    }
    return post(param)
}

/**
 * 报警主机关联配置查询api
 * @param {*} payload 查询报警主机入参
 */
export const getAlarmHostBindApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/host-bind',
        query: payload
    }
    return get(param)
}

/**
 * 报警主机关联配置查询api
 * @param {*} payload 查询报警主机入参
 */
export const getDetectorBindApi = payload => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/detector-bind',
        query: payload
    }
    return get(param)
}

/**
 * 获取报警主机管理配置列表机构树api
 * @param {*} ids 删除子系统数组
 */
export const alarmHostGetTreeApi = playload => {
    const params = {
        url: 'alarm-manage/v1/alarm-host/orgHostTree',
        query: playload
    }
    return get(params)
}

/**
 * 获取报警策略配置api
 * @param {*}
 */
export const getPolicyConfigurationApi = () => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/strategy'
    }
    return get(param)
}

/**
 * 更新报警策略配置api
 * @param {*}
 */
export const putPolicyConfigurationApi = (payload) => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/strategy',
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
        url: 'alarm-manage/v1/alarm-host/level-record'
    }
    return get(param)
}

/**
 * 报警等级及联动录像配置更新api
 * @param {*}
 */
export const putAlarmLevelLinkVideoApi = (payload) => {
        const param = {
            url: 'alarm-manage/v1/alarm-host/level-record',
            body: payload
        }
        return put(param)
    }
    /**
     * 报警非重点时段配置更新
     * @param {*}
     */
export const putAlarmNonFocusApi = (payload) => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/time',
        body: payload
    }
    return put(param)
}

/**
 * 报警非重点时段获取
 * @param {*}
 */
export const getAlarmNonFocusApi = () => {
        const param = {
            url: 'alarm-manage/v1/alarm-host/time'
        }
        return get(param)
    }
    /**
     * 时间模板获取
     * @param {*}
     */
export const getTimeTemplateApi = () => {
    const param = {
        url: '/systemOpsManager/v1/systemOpsManager/getTimeTemplateList'
    }
    return get(param)
}

/**
 * 事件提醒配置更新
 * @param {*}
 */
export const putAlarmEventRemindApi = (payload) => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/remind',
        body: payload
    }
    return put(param)
}

/**
 * 事件提醒获取
 * @param {*}
 */
export const getAlarmEventRemindApi = () => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/remind'
    }
    return get(param)
}

/**
 * 报警联动配置更新
 * @param {*}
 */
export const putAlarmLinkApi = (payload) => {
    const param = {
        url: 'alarm-manage/v1/alarm-host/level',
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
        url: 'alarm-manage/v1/alarm-host/level',
        query: payload
    }
    return get(param)
}
/**
 * 获取电视墙列表
 * @param {*}
 */
export const getWallApi = (payload) => {
  const param = {
    url: 'tvwall/v1/wall/conf',
    query: payload
  }
  return get(param)
}

