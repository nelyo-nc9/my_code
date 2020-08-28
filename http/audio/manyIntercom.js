import  {  post,  put,  get,  remove  }  from  '../base'
/**
 * 新增报警主机api
 * @param {*} payload 新增报警主机入参
 */



// 话筒开始对讲请求
export  const  postMicrophoneApi  =  payload  =>  {     //console.log(payload,'123456')
      
    const  param  =   {     url:   '/audio/v1/service/mike/start/talk',     body:  payload   }  
    return  post(param)
}

// 删除对讲组成员
export  const  postDeleteMemberApi  =  payload  =>  {     //console.log(payload,'123456')
      
    const  param  =   {     url:   '/audio/v1/service/delgroup',     body:  payload   }  
    return  post(param)
}

// 保存分组
export  const  postSaveGroupingApi  =  payload  =>  {     //console.log(payload,'123456')
      
    const  param  =   {     url:   '/audio/v1/broadcast',     body:  payload   }  
    return  post(param)
}

// 分组列表
export const getGroupingApi = playload => {
        const params = {
            url: '/audio/v1/broadcast',

            query: playload
        }
        return get(params)
    }
    //统计指定机构/重点部位音频状态
export const getAccessAudionlStatusApi = payload => {
    const param = {
        url: '/resource/v1/audio/intercom/statistic/status',
        query: payload
    }
    return get(param)
}


// 树形菜单栏
export const getTreeApi = playload => {
    const params = {
        url: '/resource/v1/tree/orgResLazyTree?subSystem=4',
        query: playload
    }
    return get(params)
}

// 添加对讲组成员
export  const  postAddMemberApi  =  payload  =>  {

      
    const  param  =   {     url:   '/audio/v1/service/addtogroup',     body:  payload   }  
    return  post(param)
}

// 创建音频日志记录
export  const  postEstablishApi  =  payload  =>  {     //console.log(payload,'123456')
      
    const  param  =   {     url:   '/audio/v1/record',     body:  payload   }  
    return  post(param)
}



// 获取对讲面板数据
export const getAudioApi = (payload) => {
    let params = {
        url: '/resource/v1/audio/channel',
        query: payload
    }
    return get(params)
}

// // 获取指定音频主机及所属通道信息
export const getAudiozhuApi = (payload) => {
        let params = {
            url: '/resource/v1/audio/host',
            query: payload
        }
        return get(params)
    }
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