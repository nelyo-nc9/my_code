/**
 * author: wangpengcheng
 * describe: security Detail interface
 */
import {get, post, put, remove } from '../base'

//获取分行选择树结构数据

export const getSecurityBranchApi = payload => {
    if (!payload.hasOwnProperty('isRoot')) {
        payload.isRoot = true
    } else {
        payload.isRoot = false
    }
    const params = {
        url: '/fire/v1/system-manage/tree',
        body: payload
    }
    return post(params)
}

//获取每日报警数量
export const getDayDatasApi = payload => {
    const params = {
        url: '/fire/v1/fire-emergency/alarmNumber',
        query: payload
    }
    return get(params)
}

//获取报警数据
export const getAlarmDataApi = payload => {
    const params = {
        url: '/fire/v1/fire-emergency',
        query: payload
    }
    return get(params)
}

// 树形菜单栏
export const getTreeApi = playload => {
    const params = {
        url: '/resource/v1/tree/orgResLazyTree?subSystem=2',
        query: playload
    }
    return get(params)
}

//获取每日每小时报警统计
export const getHourDataApi = payload => {
    const params = {
        url: '/fire/v1/fire-emergency/alarmhoursdaycount',
        query: payload
    }
    return get(params)
}

//获取报警类型

export const alarmTypeApi = payload => {
    const params = {
        url: '/alarm-manage/v1/alarm-log/alarm-type',
        query: payload
    }
    return get(params)
}

// 获取每日设备状态数据
export const getDayDataApi = payload => {
    const params = {
        url: '/fire/v1/system-manage/countFireSystemHours',
        query: payload
    }
    return get(params)
}

// 电气火灾详情
export const countDeviceParameter = payload => {
    const params = {
        url: '/fire/v1/system-manage/countDeviceParameter',
        query: payload
    }
    return get(params)
}