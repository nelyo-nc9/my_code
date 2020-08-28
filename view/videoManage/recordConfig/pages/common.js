// @ts-nocheck
import { mapGetters, mapState, mapMutations } from 'vuex'
import { download } from '@src/common/download.js'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  data() {
    return {}
  },
  created() {},
  computed: {
    ...mapGetters('videoManage', {
      channelClass: 'channelClass'
    }),
    ...mapState('videoManage', {
      commRecordPlanOption: ({ recordConfig }) => recordConfig.recordPlanOption,
      commpatternOption: ({ recordConfig }) => recordConfig.patternOption,
      commStorageServerOption: ({ recordConfig }) => recordConfig.storageServerOption,
      commModelOption: ({ recordConfig }) => recordConfig.modelOption,
      commBrandOption: ({ recordConfig }) => recordConfig.brandOption,
      storageLocOption: ({ recordConfig }) => recordConfig.storageLocOption,
      changeComponent: ({ recordConfig }) => recordConfig.changeComponent // 变更模板data
    })
  },
  methods: {
    ...mapMutations('videoManage', [
      'CLEAR_CHANGE_COMPONENT_DATA', // 清空 变更模板
      'SET_CHANGE_COMPONENT_DATA', // 设置 变更模板
      'SET_CURRENT_BRAND' // 设置当前 设备品牌
    ]),
    // 对ip地址进行排序
    sortMethodIp(obj1, obj2) {
      let val1 = ''
      let val2 = ''
      obj1.ip.split('.').forEach(e => (val1 += this.$lodash.padStart(e, 3, '0')))
      obj2.ip.split('.').forEach(e => (val2 += this.$lodash.padStart(e, 3, '0')))
      if (val1 > val2) {
        return 1
      } else if (val1 < val2) {
        return -1
      } else {
        return 0
      }
    },
    // 序号函数
    indexMethod(index) {
      return (this.pageInfo.page - 1) * this.pageInfo.limit + index + 1
    },
    // 获取批处理ids
    getIds(select, all, key = 'id') {
      const ids = []
      if (select.length) {
        select.forEach(e => {
          ids.push(e[key])
        })
      } else {
        all.forEach(e => {
          ids.push(e[key])
        })
      }
      return ids
    },
    // 过滤时间
    formatterTable(row, column, cellValue, index) {
      let params = ''
      switch (column.property) {
        case 'updatedAt':
          params = cellValue
          break
        case 'createdAt':
          if (isNaN(Number(cellValue))) {
            params = column['updatedAt'] || cellValue
          } else {
            params = this.$moment(cellValue * 1e3).format('YYYY-MM-DD HH:mm:ss')
          }
          break
        case 'timeArea':
          params = `${this.$moment(cellValue.startTime * 1e3).format('YYYY-MM-DD')}-${this.$moment(
            cellValue.endTime * 1e3
          ).format('YYYY-MM-DD')}`
          break
        case 'planTaskType':
          params = cellValue - 1 ? '事件录像' : '录像'
          break
        // case 'storageServerId':
        // params = cellValue - 1 ? '计算中心存储服务' : '营业网点存储服务'
        // break
        case 'storageServerId':
          // params = this.storageLocOption&&this.storageLocOption.filter(e => e.value == cellValue)[0]
          // params = params ? params.label : ''
          if (cellValue instanceof Array) {
            console.log(this.storageLocOption)
            params = this.storageLocOption.filter(e => cellValue.indexOf(e.value.toString()) > -1)
            params = params.length ? params.map(v => v.label || v.value).join() : '' //多个存储位置
          } else {
            params = this.storageLocOption.filter(e => e.value == cellValue)[0]
            params = params ? params.label : cellValue
          }
          break
        // case 'configType':
        // params = cellValue - 1 ? '按组织' : '按资源'
        // break
        case 'status':
          params = cellValue - 1 ? '停用' : '启用'
          break
        case 'streamType':
          params = cellValue - 1 ? (cellValue - 2 ? '第三码流' : '子码流') : '主码流'
          break
        case 'keyPart':
          params = this.commKeyPartOption.filter(e => e.value == cellValue)[0]
          params = params ? params.label : cellValue
          break
        case 'storageServer':
          params = this.commStorageServerOption.filter(e => e.value == cellValue)[0]
          params = params ? params.label : cellValue
          break
        // case 'brand':
        //   params = this.commBrandOption.filter(e => e.value === cellValue)[0]
        //   params = params ? params.label : cellValue
        //   break
        // case 'model':
        //   params = this.commModelOption.filter(e => e.value === cellValue)[0]
        //   params = params ? params.label : ''
        //   break
        case 'planTemplateId':
          params = this.commRecordPlanOption.filter(e => e.value == cellValue)[0]
          params = params ? params.label : ''
          break
        case 'configType':
          params = this.commpatternOption.filter(e => e.value == cellValue)[0]
          params = params ? params.label : '-'
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    // 过滤数据
    filterData(type, val) {
      let params = ''
      switch (type) {
        case 'planTemplateId':
          params = this.commRecordPlanOption.filter(e => e.value == val)[0]
          params = params ? params.label : val
          break
        case 'class':
          params = this.channelClass.video.filter(e => e.value == val)[0]
          params = params ? params.label : val
          break
        case 'storageServer':
          params = this.commStorageServerOption.filter(e => e.value == val)[0]
          params = params ? params.label : val
          break
        case 'storageServerId':
          if (val instanceof Array) {
            console.log(this.storageLocOption)
            params = this.storageLocOption.filter(e => val.indexOf(e.value.toString()) > -1)
            params = params.length ? params.map(v => v.label || v.value).join() : '' //多个存储位置
          } else {
            params = this.storageLocOption.filter(e => e.value == val)[0]
            params = params ? params.label : val
          }
          break
        case 'status': // 过滤录像状态
          params = val === 1 ? '启用' : '停用'
          break
        case 'streamType': // 过滤码流类型
          params = val === 1 ? '主码流' : val === 2 ? '子码流' : '第三码流'
          break
        case 'configType': // 配置类型 按组织 按资源
          params = this.commpatternOption.filter(e => e.value == val)[0]
          params = params ? params.label : '-'
          break
        default:
          break
      }
      return params
    },
    // 过滤时间
    formatTime(date, type, format = 'YYYY-MM-DD HH:mm:ss') {
      let t = date
      if (type === 's') {
        t = t * 1e3
      }
      return this.$moment(t).format(format)
    },
    // 跳转
    skipModal(to, from, data = '') {
      const params = {
        to,
        from,
        data: this.$lodash.cloneDeep(data)
      }
      this.SET_CHANGE_COMPONENT_DATA(params)
      this.$emit('modelChange')
    },
    /**
     * 导出
     * @param {*} title 标题
     * @param {*} key 表头字段
     * @param {*} select 选中项
     * @param {*} all 全部
     * @param {*} fileName 文件名
     */
    exportExcel(title = [], key = [], select = [], all = [], fileName, searchCriteria, page) {
      // @ts-ignore
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      let list = select.length ? select : []
      // 筛选过滤
      if (list.length) {
        const data = list.map(e => {
          return key.map(f => {
            if (['status', 'configType', 'storageServerId', 'planTemplateId', 'streamType'].includes(f)) {
              return this.filterData(f, e[f])
            } else {
              return e[f]
            }
          })
        })
        export_json_to_excel(title, data, fileName)
      } else {
        if (page && page == 'list') {
          let params = {
            pattern: 'list',
            ...searchCriteria
          }
          // zp去掉url中间的/host
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/video/v1/plan/download`
          let name = `录像计划列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(
            url,
            name,
            () => {},
            () => {
              this.$notify({
                title: NOTIFY.TITLE.ERROR,
                message: '导出文件下载失败',
                type: NOTIFY.TYPE.ERROR
              })
            },
            () => {},
            'post',
            params
          )
        } else if (page && page == 'inquery') {
          let params = { pattern: 'inquery' }
          for (let k in searchCriteria) {
            if (searchCriteria[k]) {
              switch (k) {
                case 'updatedAt':
                  params['updatedAtStart'] = this.formatTime(searchCriteria[k][0])
                  params['updatedAtEnd'] = this.formatTime(searchCriteria[k][1])
                  break
                case 'orgId':
                  params[k] = searchCriteria[k] + ''
                  break
                case 'keyPartId':
                  params[k] = searchCriteria[k] + ''
                  break
                case 'channelName':
                  params[k] = searchCriteria[k] + ''
                  break
                case 'ip':
                  params[k] = searchCriteria[k] + ''
                  break
                default:
                  // if (k !== 'orgName') {
                  //   params[k] = this.options[k]
                  // }
                  break
              }
            }
          }
          params.like = {
            name: searchCriteria.name, // 录像计划名称
            updatedDept: searchCriteria.updatedDept, // 录入机构
            updatedBy: searchCriteria.updatedBy // 录入人
          }
          params.equal = {
            storageServerId: searchCriteria.storageServerId, // 存储位置
            planTemplateId: searchCriteria.planTemplateId, // 计划模板id
            status: searchCriteria.status, // 1启用，2停用
            streamType: searchCriteria.streamType, // 录像码流类型 1主码流，2子码流，3.第三码流
            planTaskType: 1 // 1定时，2事件
          }
          // zp
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/video/v1/plan/download`
          let name = `录像计划查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(
            url,
            name,
            () => {},
            () => {
              this.$notify({
                title: NOTIFY.TITLE.ERROR,
                message: '导出文件下载失败',
                type: NOTIFY.TYPE.ERROR
              })
            },
            () => {},
            'post',
            params
          )
        }
      }
    },
    /**
     * 打印
     * @param { string } title 标题
     * @param { array } properties 表头字段
     * @param { array } printable 内容
     */
    printFun(title = '', properties = [], printable = []) {
      // eslint-disable-next-line no-undef
      printJS({
        printable, // 表格数据的来源
        properties, // field 表格内容  displayName：表头名
        type: 'json',
        header: `<p class="custom">${title}</p>`, // 标题
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ', // 表题样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ', // 表头样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;' // 内容样式
      })
    },
    // IPV4/IPV6校验
    judgeIPAdd(val) {
      let ipv4 = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/
      let ipv6 = /^(([\da-fA-F]{1,4}):){8}$/
      return ipv4.test(val + '.') ? 4 : ipv6.test(val + ':') ? 6 : 0
    },
    testFunction() {
      // this.options.name = '录像计划名称测试'
      // this.options.recordPlan = '录像计划测试'
      this.options.name = ''
      this.options.recordPlan = ''
      this.options.status = 2
      this.options.streamType = 2
      this.options.storagePath = '存储位置测试'
      this.options.updatedAt = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.options.updatedBy = '录入人测试'
      this.options.updatedDept = '录入机构测试'
      for (let i = 1; i <= 10; i++) {
        this.tableData.push({
          orgName: `所属机构${i}`,
          keyPartName: `所属重点部位${i}`,
          equName: `所属设备${i}`,
          resName: `所属资源${i}`,
          ip: `127.0.0.${i}`,
          resType: `${i % 2 ? '枪机' : '球机'}`
        })
      }
    }
  }
}
