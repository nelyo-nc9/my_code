// 创建 / 更新 主机 / 通道联动配置

/* 
必传参数 
id : 主机 / 通道 id
type :  类型 (1 主机  || 2 通道)
*/
import { get, post, remove, put } from '../base'

// 获取主机 / 通道关联配置

export const getHostOrControlLinkages = (url, payload) => {
  let param = {
    url,
    query: payload
  }
  return get(param)
}

// 创建 主机 / 通道 关联配置
export const CreateUplinkage = payload => {
  let param = {
    url: '/resource/v1/guard/linkage',
    body: payload
  }
  return put(param)
}
