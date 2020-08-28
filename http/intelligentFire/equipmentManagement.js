import {get, post, put, remove } from '../base'

/**
 * 消防系统管理主机和部件
 * @param {*}
 */
export const fireInterface = {
    // 消防系统管理查询主机列表
    comBustibleQueryHost: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/queryHost',
            body: playload
        }
        return post(param)
    },

    // 消防系统管理新建主机
    comBustibleHost: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/createdHost',
            body: playload
        }
        console.log(param)
        return post(param)
    },

    // 消防系统管理编辑主机
    comBustibleUpDateHost: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/updataHost',
            body: playload
        }
        return post(param)
    },

    // 消防系统管理删除主机
    comBustibleDeleteHost: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/deleteHost'
        }
        return remove(param, { data: { ids: playload } })
    },

    // 消防系统管理根据id查询主机
    comBustibleGetDetailsHost: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/getDetailsHost',
            body: playload
        }
        return post(param)
    },
    // 消防系统管理添加主机部件
    addHostParts: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/addHostParts',
            body: playload
        }
        return post(param)
    },
    // 消防系统管理编辑主机部件
    updataHostParts: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/updataHostParts',
            body: playload
        }
        return post(param)
    },
    // 消防系统管理删除主机部件
    deleteHostParts: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/deleteHostParts'
        }
        return remove(param, { data: { ids: playload } })
    },

    // 消防系统管理根据条件分页搜索主机部件
    queryHostParts: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/queryHostParts',
            body: playload
        }
        return post(param)
    },
    // 消防系统管理根据主机id查询主机部件列表
    getHostParts: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/getHostParts',
            body: playload
        }
        return post(param)
    },
    // 根据条件生成消防主机EXCEL文件
    createHostExcel: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/createHostExcel',
            body: playload
        }
        return post(param)
    },
    // 根据条件生成部件excel文件
    createHostPartExcel: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/createHostPartExcel',
            body: playload
        }
        return post(param)
    },
    // 根据文件名称下载excel文件
    downFile: function(playload) {
        console.log(playload)
        let params = {
            url: '/fire/v1/system-manage/downFile',
            query: playload
        }
        return get(params)
    },
    // 获取机构树递归
    getTreeApi: function(playload) {
        if (!playload.hasOwnProperty('isRoot')) {
            playload.isRoot = true
        } else {
            playload.isRoot = false
        }
        const params = {
            url: '/fire/v1/system-manage/tree',
            body: playload
        }
        return post(params)
    },
    // 获取用户操作日志  /fire/v1/log/operation-log
    queryOperationLog: function(playload) {
        let params = {
            url: `/systemOpsManager/v1/systemOpsManager/queryOperationLog?page=${playload.query.page}&limit=${playload.query.limit}`,
            body: playload.body
        }
        return post(params)
    },
    // 获取报警日志
    firelog: function(playload) {
        let params = {
            url: '/fire/v1/log/fire-log',
            query: playload
        }
        return get(params)
    },
    downLog: function(playload) {
        let params = {
            url: '/fire/v1/log/excel',
            query: playload
        }
        return get(params)
    }
}

/**
 * 关联配置
 * @param {*}
 */
export const fireDeploy = {
    // 获取指定视频主机/通道联动配置
    getMoreLinks: function(playload) {
        let params = {
            url: '/fire/v1/device-config/bind',
            body: playload
        }
        return post(params)
    },
    // 获取指定视频主机/通道联动配置
    setMoreLinks: function(playload) {
        let params = {
            url: '/fire/v1/device-config/bind',
            body: playload
        }
        return put(params)
    },
    // 获取指定视频主机/通道联动配置
    getDeviceOrResourceApi: function(id, playload) {
        let params = {
            url: `/fire/v1/device-config/bind/${id}`,
            query: playload
        }
        return get(params)
    },
    // 设备搜索
    serarchDeviceListApi: function(playload) {
        let params = {
            url: 'resource/v1/video/hosts',
            body: playload
        }
        return post(params)
    }
}

// 下拉框请求
// export const selectQuery = {

export const selectQuety = {
    //获取视频主机设备品牌
    queryDataDictBasicInfo: function(playload, id) {
        let params = {
            moduleId: '2' // 消防
        }
        if (!id) {
            params.childModuleId = '1' // 报警应急处置id
        } else {
            params.childModuleId = id // 设备信息管理
        }
        for (var key in playload) {
            params[key] = playload[key]
        }
        let param = {
            url: '/systemOpsManager/v1/systemOpsManager/queryDataDictBasicInfo',
            body: { queryList: [params] }
        }
        return post(param)
    },

    // 获取所属
    serviceList: function(playload) {
        let param = {
            url: '/fire/v1/system-manage/serviceList'
        }
        return get(param)
    }
}