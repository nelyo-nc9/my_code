// 异步回放
import { postFrontdevSearch } from '../../../../http/video/videoPlayback.api.js'
export default {
  methods: {
    // 异步回放 获取数据
    async asyncPlayback(data, time = {}) {
      console.log('asyncPlayback', data, time)
      /**
       * 1、整理数据
       * 2、校验权限 - 暂时未考虑
       * 3、剔除多余通道
       * 4、调北京请求查询通道
       * 5、校验-通知请求结果
       * 6、调北京请求开流
       * 7、校验-通知请求结果
       * 8、调插件方法
       * 9、通知开流完成
       */
      let { data: verifyRes, errNum } = await this.verifyPrower(data) // 校验权限
      if (!errNum) { // 无权限提示
        this.$messageWarn(`有${errNum}个资源无权限`)
      }
      if (!verifyRes) { return }
      let resourceList = await this.queryResourceList(verifyRes, time) // 请求资源信息
      console.log('resourceList', resourceList)
      //
    },
    // 权限过滤
    async verifyPrower(data) {
      // 权限校验
      return { data, errNum: 0 }
    },
    // 请求资源信息
    async queryResourceList(data, time = {}) {
      // 判断是否为中心回放
      // 前端回放录像查询
      let frontdevSearch = []
      data.forEach(e => {
        if (e.type === 1) { // 前端回放
          const searchParams = {
            devIp: e.devIp,
            devPort: e.devPort,
            channel: +e.channel,
            sTime: time.startTime || e.startTime,
            eTime: time.endTime || e.endTime,
            streamType: e.streamType || 'main',
            recordtype: e.recordType,
            rowCount: 1000,
            rowId: 1
          }
          frontdevSearch.push(postFrontdevSearch(searchParams))
        } else { // 中心回放
        }
      })
      let resourceList = {} // 查询的结果 key-id value-返回的结果
      return Promise.all(frontdevSearch.map(e => e.catch(e => null)))
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].data.hasOwnProperty('rowCount') && res[i].data.rowCount) {
              resourceList[data[i].id] = {
                params: this.$lodash.cloneDeep(data[i]),
                resource: this.$lodash.cloneDeep(res[i].data.recordList.sort((a, b) => a.startTime - b.startTime).filter(f => f.startTime !== f.endTime))
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          return resourceList
        })
    },
    // 北京开流
    async openPlay(data) {

    }
  }
}
