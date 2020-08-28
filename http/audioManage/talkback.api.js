import { post, put, get, remove,} from '../base'
import { Header } from 'element-ui'
import { pad } from 'lodash'
   //所有列表的接口
   //对讲平台列表
   export const talkbackListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/platform',
        // body: payload
        query:payload
      }
      return get(param)
  }

  //对讲平台列表（用于下拉）
  export const platformListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/platform/distinct',
        // body: payload
        query:payload
      }
      return get(param)
  }

  //新建平台列表
 export const createTalkbackListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/platform',
      body:payload
    }
    return post(param)
 }
 //修改平台
 export const editTalkbackListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/platform/${payload.id}`,
      body:payload
    }
    return put(param)
 }

 //排序 平台
 export const sortTalkbackListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/platform/sequence`,
      body:payload
    }
    return put(param)
 }


 //修改主机
 export const editHostListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/${payload.id}`,
      body:payload
    }
    return put(param)
 }

//  绑定mac地址
export const bindMacAddressApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/${payload.id}/mac`,
      body:payload
    }
    return put(param)
 }


 export const editChannelListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/channel/${payload.id}`,
      body:payload
    }
    return put(param)
 }
  //对讲主机列表
  export const getHostListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/host',
        // body: payload
        query:payload
      }
      return get(param)
  }

  //对讲主机 排序
 export const sortSequenceApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/sequence`,
      body:payload
    }
    return put(param)
 }

  //获取对讲主机关联列表
  export const talkbackHostListApi = payload => { 
     const param = {
       url: '/resource/v1/audio/host/linkage',
       query:payload
     }
     return get(param)
  }
  //获取通道关联配置列表
  export const getChannelListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/channel/linkage',
        query:payload
      }
      return get(param)
   }

 //创建音频通道
 export const createAudioChannelApi = payload => { 
    const param = {
      url: '/resource/v1/audio/channel',
      body:payload
    }
    return post(param)
}
//获取指定音频主机及所属通道
export const getHostListChannelApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/${ payload.id }`,
      body:payload
    }
    return get(param)
 }
 //创建音频主机
 export const createHostApi = payload => { 
    const param = {
      url: '/resource/v1/audio/host',
      body:payload
    }
    return post(param)
 }
 //获取音频平台下及所属主机信息
 export const getAudioHostlistApi = payload => { 
    const param = {
      url: `/resource/v1/audio/platform/${payload.id}`,
      body:payload
    }
    return get(param)
 }
 //获取远程主机 
 export const getAudioSyncHostlistApi = payload => { 
    const param = {
      url: `/resource/v1/audio/sync/host/resource`,
      query:payload
    }
    return get(param)
 }
 //查询对讲平台列表
 export const searchTalkbackListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/platform`,
      query:payload
    }
    return get(param)
}
//  获取查看列表
 export const getTalkbackListApi = payload => { 
    const param = {
      url: `/resource/v1/audio/platform/${ payload.id }`,
      
    }
    return get(param)
 }
 //获取指定主机的特定通道信息
 export const getAudioHostApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/${payload.id}/channel`,
      query:payload
    }
    return get(param)
 }
 export const getAudioChannelApi = payload => { 
    const param = {
      url: `/resource/v1/audio/channel/${ payload.id }`,
      body:payload
    }
    return get(param)
 }
 //删除平台列表
 export const deletTalkbackListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/platform',
    }
    return remove(param, { data: { ... payload  } })
 }
 //删除主机列表
 export const deletHoststListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/host',
    }
    return remove(param, { data: { ... payload  } })
 }
 //删除通道
 export const deletChannelListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/channel',
    }
    return remove(param, { data: { ... payload  } })
 }
 export const deletServiceListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/access-service',
      }
      return remove(param, { data: { ... payload  } })
   }
 //获取指定主机/通道联动配置
 export const getTalkbackLookListApi = payload => { 
    const param = {
      url: `/resource/v1/access/linkage/${payload.id}`,
      body:payload
    }
    return post(param)
 }
 //语音配置列表
 export const getVoiceListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/channel',
      query:payload
    }
    return get(param)
 }
 //获取主机查看通道列表
 export const getHostLookApi = payload => { 
    const param = {
      url: `/resource/v1/audio/host/${payload.id}`,
      body:payload
    }
    return get(param)
 }
 //mac
 export const getMacListApi = payload => { 
      const param = {
        url: '/resource/v1/audio/host/mac/relation-platform',
        body:payload
      }
      return post(param)
   }

 //上传文件
 export const getUploadApi = payload => { 
    const param = {
      url: '/audio/v1/service/upload',
      body:payload,
    //   headers:{"Content-Type":"multipart/encrypted"}
    }
    return post(param)
 }
 //保存上传数据
 export const saveAudioApi = payload => { 
    const param = {
      url: '/audio/v1/voice',
      body:payload,
    //   headers:{"Content-Type":"multipart/encrypted"}
    }
    return post(param)
 }
 //上传文件返回数据
 export const getAudioListApi = payload => { 
    const param = {
      url: '/audio/v1/voice',
      query:payload
    }
    return get(param)
 }

 //接入服务列表
 export const getServerListallApi = payload => { 
    const param = {
      url: '/service/list?servername=DA',
      // body:payload,
    //   headers:{"Content-Type":"multipart/encrypted"}
    }
    return get(param)
 }
 export const addserverList = payload => { 
    const param = {
      url: '/resource/v1/audio/access-service',
      body:payload,
    //   headers:{"Content-Type":"multipart/encrypted"}
    }
  console.log( param ,"555555555555555555555");
    return post(param)
 }
 //获取接入服务数据
 export const getServerListApi = payload => { 
    const param = {
      url: '/resource/v1/audio/access-service',
      body:payload,
    }
  console.log( param ,"555555555555555555555");
    return get(param)
 }
  export const getBrandModuleApi = payload => { 
      const param = {
        url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
        body:payload,
      }
      return post(param)
  }
  export const getTaimaisList = payload => { 
      const param = {
        url: '/resource/v1/audio/host/mac/relation-platform',
        body:payload,
      }
      return post(param)
  }
  export const gethostlinkageApi = payload => { 
      const param = {
        url: '/resource/v1/audio/linkage',
        body:payload,
      }
      return put(param)
  }
  export const searchApi = payload => { 
      const param = {
        url: '/resource/v1/audio/inquery',
        body:payload,
      }
      return post(param)
  }


  export const getlinks =  (id,payload)  => {
    let param = {
        url:`/resource/v1/audio/linkage/${id}`,
        query: payload 
    }
    return get(param)
  }
  export const getMove =  payload  => {
    let param = {
        url:"/resource/v1/audio/platform/transfer",
        body:payload
    }
    return put(param)
  }
  export const gethostMove =  payload  => {
    let param = {
        url:"/resource/v1/audio/host/transfer",
        body:payload
    }
    return put(param)
  }

  ///api/resource/v1/audio/linkage/{id}