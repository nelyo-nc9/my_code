import { post, get,} from '../base'

export const getAudioTreeApi = payload => { 
      const param = {
        url: '/resource/v1/tree/orgResLazyTree',  
        query:payload
       }
      return get(param)
  }
  export const getTreeApi = payload => { 
      const param = {
        url: '/organizational/v1/org/loading-tree',  
        query:payload
       }
      return get(param)
  }

  // 机构树搜索(机构-重点部位-设备-通道)
  export const fuzzySearchTreeApi = (playload) => {
    const params = {
      url: '/resource/v1/tree/mists/search',
      query: playload
    }
    return get(params)
  }
