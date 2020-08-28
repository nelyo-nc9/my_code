const state = {
  listData: [
    {
      name: '异常协查',
      card: '202002100001',
      type: '审计',
      requers: '行内协查',
      starTime: '2020-02-08 09:00:00',
      endTime: '2020-02-10 18:00:00',
      pers: '张三',
      logsPer: '系统管理员',
      time: '0',
      plan: '协查中'
    },
    {
      name: '异常协查',
      card: '202002100001',
      type: '审计',
      requers: '行内协查',
      starTime: '2020-02-08 09:00:00',
      endTime: '2020-02-10 18:00:00',
      pers: '张三',
      logsPer: '系统管理员',
      time: '0',
      plan: '协查中'
    },
    {
      name: '异常协查',
      card: '202002100001',
      type: '审计',
      requers: '行内协查',
      starTime: '2020-02-08 09:00:00',
      endTime: '2020-02-10 18:00:00',
      pers: '张三',
      logsPer: '系统管理员',
      time: '0',
      plan: '协查中'
    },
    {
      name: '异常协查',
      card: '202002100001',
      type: '审计',
      requers: '行内协查',
      starTime: '2020-02-08 09:00:00',
      endTime: '2020-02-10 18:00:00',
      pers: '张三',
      logsPer: '系统管理员',
      time: '0',
      plan: '协查中'
    },
    {
      name: '异常协查',
      card: '202002100001',
      type: '审计',
      requers: '行内协查',
      starTime: '2020-02-08 09:00:00',
      endTime: '2020-02-10 18:00:00',
      pers: '张三',
      logsPer: '系统管理员',
      time: '0',
      plan: '协查中'
    }
  ],
  hardDiskStatus: '2',
  formData: {
    name: '11',
    card: '22',
    type: '33',
    reqest: '44',
    items: '55',
    start: '66',
    end: '66',
    upLoadList: [
      {
        name: 'food1.jpeg'
      },
      {
        name: 'food2.jpeg'
      }
    ],
    tableData1: [
      {
        name: '张三',
        account: 'zhangsan',
        phone: '15601066778',
        job: '行内职工',
        section: '审计组',
        organization: '行内用户',
        validity: '2020-02-21至2020-02-26',
        operation: '删除'
      },
      {
        name: '张三',
        account: 'zhangsan',
        phone: '15601066778',
        job: '行内职工',
        section: '审计组',
        organization: '行内用户',
        validity: '2020-02-21至2020-02-26',
        operation: '删除'
      }
    ],
    tableData2: [
      {
        name: '张三',
        account: 'zhangsan',
        phone: '15601066778',
        job: '行内职工',
        section: '审计组',
        organization: '行内用户',
        validity1: '2020-02-21至2020-02-26',
        validity2: '2020-02-21至2020-02-26',
        operation: '删除'
      }
    ]
  },
  userData: {
    // userRole: 'assistantManageAdmin', // 管理员角色
    userRole: 'assistantManageUser', // 用户角色
    userId: '123456' // 用户Id
  },
  formStatus: true // 表单展示的状态,新增页面和查看页面所展示内容不一样由此而定
}
const getters = {
  getUserData: state => state.userData,
  getFormStatus: state => state.formStatus,
  getFormData: state => state.formData
}
const mutations = {
  SET_FORM_STATUS(state, data) {
    state.formStatus = data
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
