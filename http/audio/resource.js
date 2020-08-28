import { post, put, get, remove } from '../base'
/**
 * 新增报警主机api
 * @param {*} payload 新增报警主机入参
 */
// export const lsq = payload => {
//     console.log(payload,'123456')
//   const param = {
//     url: '/api/v1/audio/record', // 
//     // body: payload
//     query:payload
//   }
//   return get(param)
// }


// 面板开始对讲请求
export const postBeginTalkbackApi = payload => {
    //console.log(payload,'123456')
    const param = {
        url: '/audio/v1/service/broad/start/talk',
        body: payload
    }
    return post(param)
}

// 关闭对讲请求
export const postCloseTalkbackApi = payload => {
    const param = {
        url: '/audio/v1/service/close/talk',
        body: payload,

    }
    return post(param)
}

// 话筒开启对讲
export const postOpenVoicetubeApi = payload => {
    const param = {
        url: '/audio/v1/service/mike/start/talk',
        body: payload,

    }
    return post(param)
}

// 获取音频平台列表
export const getFrequencyApi = payload => {
    //console.log(payload,'123456')
    const param = {
        url: 'http://192.168.78.101:3002/mock/44/api/resource/v1/access/platform', // 
        // body: payload
        query: payload
    }
    return get(param)
}

// 获取指定平台及所属主机列表
// export const getAppointPlatformApi = payload => {
//         //console.log(payload,'123456')
//       const param = {
//         url: 'http://192.168.78.101:3002/mock/44/api/resource/v1/audio/platform/{id}', // 
//         // body: payload
//         query:payload
//       }
//       return get(param)
//     }

// 点击跳转列表请求分页接口
export const getPagingApi = payload => {
    //console.log(payload,'123456')
    const param = {
        url: '/resource/v1/audio/platform', // 
        // body: payload
        query: payload
    }
    return get(param)
}

// 开门
export const postOpenTheneDoorApi = payload => {
    const param = {
        url: 'guard/v1/service/open',
        body: payload,

    }
    return post(param)
}

// 关门
export const postCloseTheneDoorApi = payload => {
    const param = {
        url: 'guard/v1/service/close',
        body: payload,

    }
    return post(param)
}

// 下载
export const getDownloadApi = payload => {
    //console.log(payload,'123456')
    const param = {
        url: 'http://192.168.78.101:3002/mock/44/api/resource/v1/audio/platform/download', // 
        // body: payload
        query: payload
    }
    return get(param)
}


// 关联设备
export const postRelevanceApi = payload => {
    const param = {
        url: 'aaa/resource/v1/access/linkage/{id}',
        body: payload,

    }
    return post(param)
}

// 获取指定机构/重点部位的音频通道列表


//根据MAC地址获取台麦主机及平台信息
export const postMacGetApi = payload => {
    const param = {
        url: '/resource/v1/audio/host/mac/relation-platform',
        body: payload
    }
    return post(param)
}


// 查询对讲状态 audio/v1/service/getstatue
export const getStatue = payload => {
    const param = {
        url: '/audio/v1/service/getstatue',
        query: payload
    }
    return get(param)
}

// 查询设备状态 
export const getStatueNew = payload => {
    const param = {
        url: '/audio/v1/newservice/getstatue',
        query: payload
    }
    return get(param)
}

// 查询设备 实时 状态 
export const getRuntimeStatue = payload => {
    const param = {
        url: '/resource/v1/audio/channel/runtime/status',
        query: payload
    }
    return get(param)
}

// 获取指定主机/通道联动配置
export const linkageConfiguration = (id, playload) => {
    let param = {
        url: '/resource/v1/audio/linkage/' + id,
        query: playload
    }
    return get(param)
}

 // 开门服务
export const openDoor = playload => {
    let param = {
      url: 'guard/v1/newservice/open', 
      body: playload
    }
    return post(param)
  }
  
  // 关门服务
  export const closeDoor = playload => {
    let param = {
      url: 'guard/v1/newservice/close',
      body: playload
    }
    return post(param)
  }

  //统计指定机构/重点部位音频状态
export const getAccessAudionlStatusApi = payload => {
    const param = {
      url: '/resource/v1/cabin/channel/statistic/status',
      query: payload
    }
    return get(param)
  }

 