/*
 * @Author: yanglei
 * @Date: 2020-07-04 15:17:18
 * @LastEditTime: 2020-08-19 22:14:16
 * @LastEditors: your name
 * @Description:
 * @FilePath: \ccb-client\client\src\view\coffersManage\components\common.js
 */
import { recordLogApi } from '../../../http/coffersManage/coffersLog.api'

export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('user')) || {}
    }
  },
  created() {},
  methods: {
    /**
     * @description: 记录日志公共方法
     * @param {type} 无
     * @return: 无
     */
    recordLogFun(data, type = 'operation') {
      let params = {
        Mechanism: this.userInfo.orgName || '',
        KeyPart: '',
        AccessEquipment: '门禁设备',
        Access: '门禁通道',
        IntercomPanel: '对讲面板',
        Type: type,
        OperationType: '',
        EventType: '',
        IpAddr: JSON.parse(window.sessionStorage.getItem('macAddress')).adaptors.filter(item => item.ip !== '0.0.0.0')[0].ip,
        UserName: this.userInfo.userName || '',
        Time: this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (type === 'operation') {
        Object.assign(params, {
          name: this.userInfo.name || '',
          clientType: 'B/S',
          action: '', // 开门
          operObject: '', // D1门-金库区1道门
          result: '成功',
          description: '' // 远程授权开启D1门-金库区1道门
        })
      }
      // 记录日志
      recordLogApi({cofferLog: Object.assign(params, data)})
    }
  }
}
