import { post, put, get, remove } from '../base'

//获取系统状态异常
export const getsysabstateApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/sysabstate',
        body: payload
    }
    return post(param)
}

//异常处置
export const getsysablogApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/sysablog',
        body: payload
    }
    return post(param)
}

//获取异常（查询）
export const getlogApi = (payload) => {
        let param = {
            url: '/sysStatusMonitor/v1/log',
            body: payload
        }
        return post(param)
    }
    // 获取服务器详情信息
export const getSysServerListinfoApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/serverinfo',
        body: payload
    }
    return post(param)
}

// 获取单个服务器详情信息
export const getSysServerinfoApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/serverdetail',
        body: payload
    }
    return post(param)
}

// 获取异常阈值配置
export const getThresholdcfgApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/threshold',
        query: payload
    }
    return get(param)
}

// 创建/修改异常阈值信息
export const setSysServerinfoApi = (payload) => {
    let param = {
        url: '/sysStatusMonitor/v1/thresholdcfg',
        body: payload
    }
    return post(param)
}

// 上传文件
export const uploadFileApi = (payload) => {
    // let param = {
    //     url: '/sysStatusMonitor/v1/upload',
    //     body: payload
    // }
    // return post(param)
    return '/sysStatusMonitor/v1/upload';
}

