/*
 * @Author: dongqiang
 * @Date: 2020-06-20 14:59:27
 * @LastEditors: dongqiang
 * @LastEditTime: 2020-06-21 14:28:01
 * @Description: file content
 * @FilePath: \建行CCB\ccb-client\client\src\http\basicInfoManage\keyPart.api.js
 */
import { get, post, put, remove } from '../base'

const uroPrefix = '/organizational/v1/key-part'

// 获取重点部位列表
export const getKeyPartListApi = (playload) => {
  let params = {
    url: uroPrefix + '/list',
    query: playload
  }
  return get(params)
}

// 查询重点部位
export const queryKeyPartListApi = (playload) => {
  let params = {
    url: uroPrefix + '/query',
    query: playload
  }
  return get(params)
}

// 修改重点部位
export const editKeyPartApi = (playload) => {
  let params = {
    url: uroPrefix,
    body: playload
  }
  return post(params)
}

// 重点部位上传
export const uploadingKeyPartApi = (playload) => {
  let params = {
    url: uroPrefix + '/uploading',
    body: playload
  }
  return post(params)
}

// 新增重点部位
export const addKeyPartApi = (playload) => {
  let params = {
    url: uroPrefix,
    body: playload
  }
  return put(params)
}

// 删除重点部位
export const deleteKeyPartApi = (playload) => {
  let params = {
    url: uroPrefix
  }
  return remove(params, {data: playload})
}

// 获取待上传部位列表
export const getUploadPartListApi = (playload) => {
  let params = {
    url: uroPrefix + '/uploading-list',
    query: playload
  }
  return get(params)
}

// 获取待迁移重点部位列表
export const getMoveListApi = (playload) => {
  let params = {
    url: uroPrefix + '/move-list',
    query: playload
  }
  return get(params)
}

// 获取所属机构下上传部位的数量
export const getUploadingOrgApi = (playload) => {
  let params = {
    url: uroPrefix + '/uploading-org',
    query: playload
  }
  return get(params)
}
