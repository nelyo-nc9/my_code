/*
 * @Author: dongqiang
 * @Date: 2020-06-20 14:59:27
 * @LastEditors: dongqiang
 * @LastEditTime: 2020-06-21 14:28:01
 * @Description: file content
 * @FilePath: \建行CCB\ccb-client\client\src\http\basicInfoManage\orgManage.api.js
 */
import { get, post, remove } from '../base'

const uroPrefix = '/organizational/v1/org/'
// 机构树接口。 visible: 0-获取所有机构, 1-获取同步到本级平台的机构，  不传默认只获取本级平台机构。type：2 - 机构重点部位树， 其他为机构树
export const getTreeApi = (playload) => {
  let params = {
    url: uroPrefix + 'loading-tree',
    query: playload
  }
  return get(params)
}

// 获取机构列表
export const getOrgListApi = (playload) => {
  let params = {
    url: uroPrefix + 'list',
    query: playload
  }
  return get(params)
}

// 懒加载树搜索接口
export const getLoadingTreeSearchApi = (playload) => {
  let params = {
    url: uroPrefix + 'loading-tree/search',
    query: playload
  }
  return get(params)
}

// 获取机构状态变更列表 1-新增机构，2-撤销机构，3-合并机构，4-迁移机构，5-撤销、合并、迁移机构（全部，忽略分页）
export const getStateListApi = (playload) => {
  let params = {
    url: uroPrefix + 'sync-state-list',
    query: playload
  }
  return get(params)
}

// 获取待上传机构列表
export const getUploadListApi = (playload) => {
  let params = {
    url: uroPrefix + 'uploading-list',
    query: playload
  }
  return get(params)
}

// 机构上传
export const orgUploadApi = (playload) => {
  let params = {
    url: uroPrefix + 'uploading',
    body: playload
  }
  return post(params)
}

// 条件查询机构列表
export const getQueryListApi = (playload) => {
  let params = {
    url: uroPrefix + 'query',
    query: playload
  }
  return get(params)
}

// 条件查询机构列表同步历史记录
export const getSyncLogListApi = (playload) => {
  let params = {
    url: uroPrefix + 'query-sync-log',
    query: playload
  }
  return get(params)
}

// 机构同步 oids:机构id; type:1-机构同步，2-取消同步，3-撤销机构状态同步，4-合并机构状态同步，5-机构迁移状态同步
export const orgSyncApi = (playload) => {
  let params = {
    url: uroPrefix + 'sync',
    body: playload
  }
  return post(params)
}

// 机构排序 ids:按机构id 从前到后； type：1-机构排序， 2- 重点部位排序
export const orgOrderApi = (playload) => {
  let params = {
    url: uroPrefix + 'order',
    body: playload
  }
  return post(params)
}

// 机构迁移 id:机构id;  parentId:目标机构id
export const orgMoveApi = (playload) => {
  let params = {
    url: uroPrefix + 'move',
    body: playload
  }
  return post(params)
}

// 安防机构新增
export const orgCreatApi = (playload) => {
  let params = {
    url: uroPrefix + 'security-created',
    body: playload
  }
  return post(params)
}

// 安防机构编辑
export const orgEditApi = (playload) => {
  let params = {
    url: uroPrefix + 'security-updated',
    body: playload
  }
  return post(params)
}

// 安防机构删除
export const orgDeleteApi = (playload) => {
  let params = {
    url: uroPrefix + 'security-delete'
  }
  return remove(params, {data: playload})
}

// 建行机构树获取
export const getSyncTreeApi = (playload) => {
  let params = {
    url: uroPrefix + 'sync-tree',
    query: playload
  }
  return get(params)
}

// 获取建行已同步机构  type: 0-获取已同步接口， 1-获取未同步接口，  不传默认0
export const getSynchronizedApi = (playload) => {
  let params = {
    url: uroPrefix + 'synchronized',
    query: playload
  }
  return get(params)
}

// 建行机构树获取递归获取子节点， 复选框使用 oId
export const getSyncTreeChildApi = (playload) => {
  let params = {
    url: uroPrefix + 'sync-tree-child',
    query: playload
  }
  return get(params)
}

// 建行机构树模糊查询
export const getSyncTreeSearchApi = (playload) => {
  let params = {
    url: uroPrefix + 'sync-tree-search',
    query: playload
  }
  return get(params)
}

// 按机构id 获取 机构重点部位 详情  type:1-获取机构，2-获取重点部位
export const getOrgKeyPartInfoApi = (playload) => {
  let params = {
    url: uroPrefix + 'information',
    body: playload
  }
  return post(params)
}
