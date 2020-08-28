/**
 * author: wangpengcheng
 * describe: Big data Detail interface
 */
import { get, post, put, remove } from '../base'

//获取分行选择树结构数据

export const getBranchApi = payload => {
  const params = {
    url: '',
    query: payload
  }
  return get(params);
}

export const deleteBranchApi = payload => {
  const params = {
    url:'',
  }

  return remove(params,{data: payload})
}
