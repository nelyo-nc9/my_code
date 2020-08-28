export default {
  data() {
    return {
      // 防区信息表头
      zoneInfoColumn: [{
        mark: 'name',
        label: '探测器名称'
      }, {
        mark: 'serialNumber',
        label: '防区序号'
      }, {
        mark: 'deviceType',
        label: '设备类型'
      }, {
        mark: 'count',
        label: '数量'
      }, {
        mark: 'status',
        label: '状态'
      }, {
        mark: 'bypassState',
        label: '旁路状态'
      }],
      // 重点信息
      importInfoList: [{
        name: '营业网点名称',
        mark: 'name1',
        info: ''
      }, {
        name: '营业网点地址',
        mark: 'address',
        info: ''
      }, {
        name: '所属机构',
        mark: 'orgName',
        info: ''
      }, {
        name: '营业网点电话',
        mark: 'policeTelephone',
        info: ''
      }, {
        name: '营业网点负责人一',
        mark: 'principal1',
        info: ''
      }, {
        name: '移动电话',
        mark: 'policeMobilePhone',
        info: ''
      }, {
        name: '营业网点负责人二',
        mark: 'principal2',
        info: ''
      }, {
        name: '移动电话',
        mark: 'principalPhone1',
        info: ''
      }, {
        name: '营业网点安全员一',
        mark: 'principal3',
        info: ''
      }, {
        name: '移动电话',
        mark: 'principalPhone2',
        info: ''
      }, {
        name: '营业网点安全员二',
        mark: 'principal4',
        info: ''
      }, {
        name: '移动电话',
        mark: 'principalPhone5',
        info: ''
      }, {
        name: '所属机构安保联系人',
        mark: 'principal5',
        info: ''
      }, {
        name: '移动电话',
        mark: 'principalPhone4',
        info: ''
      },
      {
        name: '所属派出所名称',
        mark: 'policeStation',
        info: ''
      }, {
        name: '属地派出所电话',
        mark: 'policeTelephone',
        info: ''
      }, {
        name: '辖区民警姓名',
        mark: 'police',
        info: ''
      },
      {
        name: '移动电话',
        mark: 'principalPhone5',
        info: ''
      }, {
        name: '部位状态',
        mark: 'status',
        info: ''
      }, {
        name: '附近自助银行/自助设备',
        mark: 'serial',
        info: ''
      }, {
        name: '备注',
        mark: 'remark',
        info: ''
      }, {
        name: '营业网点信息',
        mark: '',
        info: ''
      }
      ],
      // 报警主机列表表头
      tableHeader: [{
        mark: 'orgName',
        label: '所属机构'
      }, {
        mark: 'locName',
        label: '所属部位'
      }, {
        mark: 'name',
        label: '设备名称'
      }, {
        mark: 'ip',
        label: '设备IP'
      }, {
        mark: 'subsystemNo',
        label: '子系统数'
      }, {
        mark: 'detectorNo',
        label: '防区数'
      }, {
        mark: 'defenseState',
        label: '布撤防状态'
      }, {
        mark: 'status',
        label: '在线状态'
      }, {
        mark: 'electricState',
        label: '市电状态'
      }]
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
