import Vue from 'vue'
import Vuex from 'vuex'
import { read, save } from '../storage'
import map2d from './modules/map2d'
import airlock from './modules/airlock'
import alarm from './modules/alarm'
import tvWall from './modules/tvWall/tvWallConfig'
import routerArray from './modules/auth/router'
import assistantManageMenu from './modules/assistantManageMenu'
import alarmReceive from './modules/alarm/alarmReceive'
import eventDeal from './modules/alarm/eventDeal'
import dutyManagement from './modules/dutyManagement/dutyManagement'
import protectiveCabin from './modules/protectiveCabin'
import fire from './modules/fire'
import equipmentManagement from './modules/intelligentFire/equipmentInformationManagement/equipmentManagement'
import fireOperationManagement from './modules/intelligentFire/fireOperationManagement'
import assessment from './modules/intelligentFire/assessment/assessment'
import frozenPeopleManage from './modules/systemMaintenancet/frozenPeopleManage'
import peopleManage from './modules/systemMaintenancet/peopleManage'
import powerManage from './modules/systemMaintenancet/powerManage'
import parkingManage from './modules/parkingManage/parkingManage'
import videoManage from './modules/videoManager'
import roleManage from './modules/systemMaintenancet/roleManage'
import IntercomPlatform from './modules/audioManagr/IntercomPlatform'
import talkback from './modules/audioManagr/talkback'
import modularization from './modules/audio/modularization'
import resource from './modules/audio/resource'
import manyIntercom from './modules/audio/manyIntercom'
import onlineUserManage from './modules/systemMaintenancet/onlineUserManage'
import audioLog from './modules/audioManagr/audioLog'
import cascadeUserManage from './modules/systemMaintenancet/cascadeUserManage'
import serverManagement from './modules/systemOperationManage/serverManagement'
import businessParameterConfig from './modules/systemOperationManage/businessParameterConfig'
import sysParametersCof from './modules/systemOperationManage/sysParametersCof'
import login from './modules/login/login'
import access from './modules/Access/Host'
import personnel from './modules/personnel/personnel'
import supervise from './modules/supervise/supervise'
import equipmentConfigManagement from './modules/intelligentFire/equipmentInformationManagement/equipmentConfigManagement'
import alarmEmergencyResponse from './modules/intelligentFire/alarmEmergencyResponse'
import fireCount from './modules/security/fireCount'
import alarmBigData from './modules/bigData/BigData'
import bigAlarmData from './modules/bigData/AlarmData'

Vue.use(Vuex)
Vue.config.devtools = true
let plugin = null
let modules = {
  map2d,
  airlock,
  routerArray,
  alarm,
  tvWall,
  assistantManageMenu,
  alarmReceive,
  eventDeal,
  dutyManagement,
  protectiveCabin,
  equipmentManagement,
  fire,
  fireOperationManagement,
  assessment,
  frozenPeopleManage,
  peopleManage,
  powerManage,
  parkingManage,
  videoManage,
  roleManage,
  IntercomPlatform,
  talkback,
  modularization,
  resource,
  manyIntercom,
  onlineUserManage,
  audioLog,
  cascadeUserManage,
  serverManagement,
  businessParameterConfig,
  login,
  sysParametersCof,
  access,
  personnel,
  supervise,
  equipmentConfigManagement,
  alarmEmergencyResponse,
  fireCount,
  alarmBigData,
  bigAlarmData
}
// 刷新页面后把保存到stroage的数据还原到store中
let state = read('state') || '{}'
state = JSON.parse(state)
for (const key in state) {
  const obj = state[key] || modules[key].state
  modules[key].state = { ...obj }
}
save('state', '{}')
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: modules,
  getters: {
    plugin() {
      return plugin
    }
  },
  mutations: {
    SET_PLUGIN(state, pl) {
      plugin = pl
    }
  }
})

export default store
