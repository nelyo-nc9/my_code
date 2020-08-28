<template>
  <div class="equipment-select">
    <div class="equipment-select-left">
      <div><el-button class="inp-btn" size="small" :type="Boolean(equipmentType=='importPart')? 'primary': ''  " value="importPart" @click="changeType('importPart')">机构</el-button></div>
      <div><el-button class="inp-btn" size="small" :type="Boolean(equipmentType=='keyParts')? 'primary': ''  " value="keyParts" @click="changeType('keyParts')">重点部位</el-button></div>

     <div><el-button class="inp-btn" size="small" :type="Boolean(equipmentType=='camera')? 'primary': ''  " value="camera"    @click="changeType('camera')">摄像机</el-button></div>
      <div><el-button class="inp-btn"  size="small"   :type="Boolean(equipmentType=='recorder')? 'primary': ''  "  value="recorder" @click="changeType('recorder')">录像机</el-button></div>
      <div><el-button class="inp-btn" size="small"  :type="Boolean(equipmentType=='alarm')? 'primary': ''  "  value="alarm" @click="changeType('alarm')">报警设备</el-button></div>
      <div><el-button class="inp-btn" size="small"  :type="Boolean(equipmentType=='fireFighting')? 'primary': ''  "  value="fireFighting" @click="changeType('fireFighting')">消防设备</el-button></div>
      <div><el-button class="inp-btn"  size="small" :type="Boolean(equipmentType=='intercom')? 'primary': ''  "  value="intercom" @click="changeType('intercom')">对讲设备</el-button></div>
      <div><el-button class="inp-btn" size="small"  :type="Boolean(equipmentType=='access')? 'primary': ''  "  value="access" @click="changeType('access')">门禁设备</el-button></div>
      <div><el-button class="inp-btn" size="small"  :type="Boolean(equipmentType=='protectedCabin')? 'primary': ''  "  value="protectedCabin" @click="changeType('protectedCabin')">防护舱</el-button></div>
    </div>
    <div class="equipment-select-right">
      <el-checkbox :label="allSelectLabel" :key="allSelectKey" v-model="allSelectModel"></el-checkbox>
      <el-checkbox
        v-for="(item, key) in pointState[equipmentType]"
        :label="item.label"
        :key="key"
        v-model="item.value"
        @change="changeEquipment"
      ></el-checkbox>
    </div>
  </div>
</template>

<script>
import Bus from 'assets/2DMap/Bus'
import { cloneDeep } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      equipmentType: 'importPart',
      allSelectLabel: '全选',
      allSelectKey: 199,
      allSelectModel: false,
      pointState: {
        importPart: {
          // 机构
          headOffice: { label: '总行', value: true },
          tierOneBranch: { label: '一级分行', value: true },
          secondLevelBranch: { label: '二级分行', value: true },
          countyLevel: { label: '县级行', value: true },
          directlyBranch: { label: '直属支行', value: true }
        },
        keyParts: {
          // 重点部位
          businessOutlets: { label: '营业网点', value: false },
          vault: { label: '金库', value: false },
          computerRoom: { label: '计算机房', value: false },
          officeBuilding: { label: '办公楼', value: false },
          selfServiceBank: { label: '自助银行', value: false },
          selfServiceEquipment: { label: '自助设备', value: false },
          selfServiceSilver: { label: '自助银亭', value: false },
          privateBank: { label: '私人银行', value: false },
          safeDeposit: { label: '保险箱库', value: false },
          archivesCenter: { label: '档案室', value: false },
          remoteControlCenter: { label: '远程监控中心', value: false },
          fiveGSmartBanking: { label: '5G + 智能银行', value: false },
          fortuneCenter: { label: '财富中心', value: false },
          otherKeyParts: { label: '其他重点部位', value: false }
        },
        camera: {
          // 摄像机
          boltipc: { label: '枪机', value: false },
          halfBallipc: { label: '半球', value: false },
          fastBallipc: { label: '球机', value: false },
          redBoltipc: { label: '红外枪机', value: false },
          allViewipc: { label: '全景', value: false },
          pinhole: { label: '针孔', value: false },
          smartIPC: { label: '智能IPC', value: false },
          sector: { label: '可视域', value: false }
        },
        recorder: {
          // 录像机
          videoHost: { label: '视频主机', value: false }
        },
        alarm: {
          // 报警设备
          telAlarmHost: { label: '电话报警主机', value: false },
          networkAlarmHost: { label: '网络报警主机', value: false },
          fenceAlarmHost: { label: '电子围栏总线报警主机', value: false },
          shakeAlarmHost: { label: '震动光纤报警主机', value: false },
          wallDetector: { label: '壁挂双鉴探测器', value: false },
          ceilingDetector: { label: '吸顶双鉴探测器', value: false },
          atmShakeDetector: { label: 'ATM震动探测器', value: false },
          vaultShakeDetector: { label: '金库震动探测器', value: false },
          doorMagneticDetector: { label: '门磁探测器', value: false },
          glassBrokenDetector: { label: '玻璃破碎探测器', value: false },
          smokeDetector: { label: '光电感烟探测器', value: false },
          pirCurtainDetector: { label: '红外幕帘探测器(入侵)', value: false },
          temperatureDetector: { label: '温度探测器', value: false },
          leakDetector: { label: '漏水探测器', value: false },
          voicedDangerButton: { label: '紧急按钮(有声)', value: false },
          silentDangerButton: { label: '紧急按钮(无声)', value: false },
          correlationDetector: { label: '红外对射探测器', value: false },
          offsetDetector: { label: '位移探测器', value: false },
          shakeOptical: { label: '振动光纤', value: false },
          electronicFence: { label: '电子围栏', value: false }
        },
        fireFighting: {
          // 消防设备
          // Fighting: { label: '消防设备', value: false }
          // 消防设备
          // Fighting: { label: '消防设备', value: false }
          userInfoTransmissionDevice: { label: '用户信息传输装置', value: false },
          firePumpMonitor: { label: '消防泵监测仪', value: false },
          smokePreventionMonitor: { label: '防排烟监测仪', value: false },
          gasMonitor: { label: '气体监测仪', value: false },
          fireSeparationMonitor: { label: '防火分隔监测仪', value: false },
          electricalFireDetector: { label: '电气火灾探测器', value: false },
          independentSmokeDetector: { label: '独立烟感探测器', value: false },
          independentTemperatureSensor: { label: '独立温感探测器', value: false },
          independentCombustibleGasDetector: { label: '独立可燃气体探测器', value: false },
          hydraulicSensor: { label: '液压传感器', value: false },
          liquidLevelSensor: { label: '液位传感器', value: false }
        },
        intercom: {
          // 对讲设备
          intercomHost: { label: '对讲主机', value: false },
          intercomChannel: { label: '对讲通道', value: false }
        },
        access: {
          // 门禁设备
          accessHost: { label: '门禁主机', value: false },
          accessChannel: { label: '门禁通道', value: false },
          lockDoorChannel: { label: '互锁门主机', value: false },
          lockDoor: { label: '互锁门通道', value: false }
          // gate: { label: '闸机', value: false }
        },
        protectedCabin: {
          // 防护舱
          protectedCabinHost: { label: '防护舱主机', value: false },
          protectedCabinChannel: { label: '防护舱通道', value: false }
        }
      }
    }
  },
  watch: {
    // '$store.state.map2d.mapIndex.checkedEquipmentsApply'(newObj, oldObj) {
    //   this.pointState = cloneDeep(this.checkedEquipmentsApply)
    // },
    allSelectModel(newValue, oldValue) {
      for (let name in this.pointState[this.equipmentType]) {
        this.pointState[this.equipmentType][name].value = newValue
      }
      this.changeEquipment()
    },
    pointState(newValue) {
      this.updateAllSelectStatus()
    }
  },
  mounted() {
    const _this = this
    if (sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice') {
      _this.equipmentType = 'fireFighting'

      let userInfo = JSON.parse(sessionStorage.getItem('user'))
      let setLocal = localStorage.getItem(userInfo.id + '*checkedEquipments*fireDevice')
      if (!setLocal) { _this.allSelectModel = true }
    } else {
      _this.equipmentType = 'importPart'

      _this.allSelectModel = false
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', ['checkedEquipments'])
  },
  created() {
    this.pointState = cloneDeep(this.checkedEquipments)
    this.$forceUpdate()
    this.updateAllSelectStatus()
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments']),
    changeType(val) {
      this.equipmentType = val
      this.updateAllSelectStatus()
    },
    changeEquipment() {
      this.setCheckedEquipments(this.pointState)
    },
    updateAllSelectStatus() {
      let status = 1
      for (let name in this.pointState[this.equipmentType]) {
        if (status === 1) {
          status = this.pointState[this.equipmentType][name].value
        } else if (status !== this.pointState[this.equipmentType][name].value) {
          return
        }
      }
      if (status !== this.allSelectModel) { this.allSelectModel = status }
    }
  }
}
</script>

<style lang="less" scoped>
.equipment-select {
  width: 330px;
  height: 380px;
  border-radius: 2px;
  box-sizing: border-box;
  background: rgba(255,255,255,0.95);
  box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.26);
  padding: 15px;
  position: absolute;
  top: 50px;
  right: 0;
  .equipment-select-left {
    width: 40%;
    margin-right: 5%;
    margin-top: -6px;
    float: left;
    div {
      line-height: 40px;
    }
    .inp-btn {
      width: 100%;
      // font-size: 12px;
      // height:30px;
      // border: 1px solid #B5B5B5;
      // border-radius: 2px;
      // background: none;
      // color: #333333;
      // outline: none;
      // &:hover {
      //   background-color: rgba(255, 255, 255, 0.2);
      // }
    }
  }
  .equipment-select-right {
    width: 55%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    text-align: left;
    line-height: 20px;
    float: left;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 0.95);
    border-left: 1px solid #B5B5B5;
    p {
      text-align: center;
      color: #333333;
      line-height: 250px;
    }
  }
}
</style>
<style scoped>
.equipment-select-right >>> .el-checkbox,
.equipment-select-right >>> .el-checkbox__label {
  color: #333;
  font-size: 12px;
}
</style>
