
import { get, post, put, remove } from '../base'

const baseUrl = '/resource/v1/bigdata/device/'

//设备接入情况统计
export const deviceDataApi = payload => {
    const params = {
        url: `${baseUrl}statistics`,
        query: payload
    }
    return get(params)
}

//设备按照年限统计
export const deviceYearApi = payload => {
    const params = {
        url: `${baseUrl}year`,
        query: payload
    }
    return get(params)
}

//监控中心重点部位统计
export const deviceCountApi = payload => {
    const params = {
        url: `/organizational/v1/org/statistics`,
        query: payload
    }
    return get(params)
}