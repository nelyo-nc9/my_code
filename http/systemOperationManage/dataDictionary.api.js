import { get, post } from '../base'

// 查询数据字典信息
export const queryDataDictApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDict',
    body: payload
  }
  return post(param)
}

// 懒加载获取字典树
export const getLoadingTreeDataDictionary = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/GetLoadingTreeDataDictionary',
    query: payload
  }
  return get(param)
}

// 获取数据字典列表-获取数据字典数据库列的不同信息，用于懒加载时使用
export const getDataDircColumnListApi = (payload) => {
  let param = {
    url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfoById',
    body: payload
  }
  return post(param)
}
