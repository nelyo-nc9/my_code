// 业务联动  -- 业务系统联动 api
import { post, put, get, remove } from '../base'

//获取RAD配置信息，短信系统对接--95533平台配置，信访识别预警--RSSM设置
// 三个模块共用一个接口  用type进行区分  type==1 RAD配置信息; type==2 短信系统对接--95533平台配置;  type==3 信访识别预警--RSSM设置
export const getBusinessSysLinkageRssmApi = (payload) => {
    let param = {
        url: '/businessSysLinkage/v1/rssm',
        body: payload
    }
    return post(param)
}

//获取RAD配置信息，短信系统对接--95533平台配置，信访识别预警--RSSM设置
// 三个模块共用一个接口  用type进行区分  type==1 RAD配置信息; type==2 短信系统对接--95533平台配置;  type==3 信访识别预警--RSSM设置
export const setBusinessSysLinkageRssmApi = (payload) => {
        let param = {
            url: '/businessSysLinkage/v1/rssm',
            body: payload
        }
        return put(param)
    }
    // 获取机构树
export const getTreeApi = playload => {
        const params = {
            url: 'resource/v1/tree/orgResourceTree',
            query: playload
        }
        return get(params)
    }
    // 获取时间模板列表
export const getTimeTemplateListApi = (payload) => {
        let params = {
            url: '/systemOpsManager/v1/systemOpsManager/getTimeTemplateList',
            query: payload
        }
        return get(params)
    }
    // 获取抓拍机（保存）
export const setpetitionStrategyApi = (payload) => {
        let params = {
            url: '/businessSysLinkage/v1/petitionStrategy',
            body: payload
        }
        return put(params)
    }
    // 获取推送策略列表
export const getstrategyInfoListApi = (payload) => {
        let params = {
            url: '/businessSysLinkage/v1/strategyInfo',
            body: payload
        }
        return post(params)
    }
    // 删除推送策略列表
export const delstrategyInfoListApi = id => {
        let params = {
            url: '/businessSysLinkage/v1/petitionStrategy',
        }
        return remove(params, { data: { id } })
    }
    // 编辑推送策略
export const updatepetitionStrategyApi = (payload) => {
        let params = {
            url: '/businessSysLinkage/v1/petitionStrategy',
            body: payload
        }
        return post(params)
    }
    //导出功能
export const setstrategyApi = (payload) => {
        let params = {
            url: '/businessSysLinkage/v1/strategy',
            body: payload
        }
        return post(params)
    }
    //推送日志--列表（查询）
export const getPetitionLogApi = (payload) => {
        let params = {
            url: '/businessSysLinkage/v1/petitionLog',
            body: payload
        }
        return post(params)
    }
    //导出日志
export const setlogApi = (payload) => {
    let params = {
        url: '/businessSysLinkage/v1/Log',
        body: payload
    }
    return post(params)
}