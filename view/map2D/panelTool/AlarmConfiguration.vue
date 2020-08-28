<template>
  <div class="distance">
    <div class="query-form">
      <span class="from-lable">报警接收</span>
      <el-checkbox-group v-model="form.isReceive">
        <el-checkbox label="开启" @change="openAlarm(form.isReceive)" name="alarmAccept"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="query-form">
      <span class="from-lable">报警统计</span>
      <el-switch
        :disabled="Boolean(!form.isReceive)"
        @change="openStatistic($event, form.isCount)"
        v-model="form.isCount"
        active-value="1"
        inactive-value="0"
      ></el-switch>
    </div>
    <div class="query-form">
      <span class="from-lable">自动定位</span>
      <el-checkbox-group v-model="form.isLocation">
        <el-checkbox
          label="开启"
          @change="AlarmLocation"
          :disabled="Boolean(!form.isReceive)"
          name="autoLocation"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="statistics-box" v-if="form.isCount == 1">
      <span class="title">报警统计</span>
      <div class="center">
        <div class="number-alarms">
          <div class="number">
            <span class="num-box">{{ AlarmCount.toDo }}</span>
            <span class="num-stats">待处理</span>
          </div>
          <div class="number">
            <!-- 安防 -->
            <span class="num-box">{{ AlarmCount.alarmInfoTotal }}</span>
            <!-- 消防 -->
            <span class="num-stats">报警总数</span>
          </div>
        </div>
        <div class="classification">
          <span class="classification-box" v-for="(item, index) in colorData" :key="index">
            <span class="color-box" :style="{ background: item.color }"></span>
            <span class="name-box">{{ item.name }}</span>
            <span class="num-left">{{ AlarmCount[`level${index + 1}ToDo`] }}</span>
            <span class="num-right">{{ AlarmCount[`level${index + 1}`] }}</span>
          </span>
        </div>
      </div>
      <transition name="el-zoom-in-bottom">
        <div class="footer" v-show="drawer">
          <span class="new-title">最新报警</span>
          <div class="new-type">
            <span class="hot-message"  :style="{background:alarmTypeColor }">{{ staticData.alarmTypeName }}</span>
            <span class="message-name">{{ staticData.startTime }}</span>
          </div>
          <div class="new-message">
            <span class="message-name">报警名称:</span>
            <span class="message">{{ staticData.alarmName }}</span>
          </div>
          <div class="new-message">
            <span class="message-name">所属设备:</span>
            <span class="message">{{ staticData.deviceName }}</span>
          </div>
          <div class="new-message">
            <span class="message-name">所属部位:</span>
            <span class="message">{{ staticData.locationName }}</span>
          </div>
          <div class="new-message">
            <span class="message-name">所属机构:</span>
            <span class="message">{{ staticData.orgName }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import moment from 'moment'
import socket from '../../../socket/alarm'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import areaUtil from 'assets/2DMap/areaUtil'

export default {
  data() {
    return {
      alarmTypeColor: 'red',
      direction: 'rtl',
      drawer: true,
      form: {
        isReceive: false,
        isCount: '0',
        isLocation: false
      },

      staticData: {
        // 默认假消息
        alarmTypeName: '',
        startTime: '',
        alarmName: '',
        deviceName: '',
        locationName: '',
        orgName: ''
      },
      colorData: [
        { color: '#ff6600', name: '一级' },
        { color: '#ffcc33', name: '二级' },
        { color: '#ffff00', name: '三级' },
        { color: '#fff', name: '四级' },
        { color: '#fff', name: '五级' }
      ],
      AlarmCount: {},

      numData: [
        { total: '201', pending: '155' },
        { total: '251', pending: '135' },
        { total: '231', pending: '165' },
        { total: '121', pending: '100' },
        { total: '351', pending: '145' }
      ]
    }
  },
  created() {
    this.clearAlarmSetInfo(true)
    if (this.alarmSetting.isCount === '1') {
      this.alarmStastic()
    } // 开启报警统计
    this.openAlarm(this.alarmSetting.isReceive) // 开启报警接收
  },
  mounted() {
    this.testFunction()
  },
  destroyed() {
    // 关闭
    socket.remove('alarmDeal', data => {
      console.log('duan')
    })
    if (this.alarmSetting.featureInterval) {
      window.clearInterval(this.alarmSetting.featureInterval)
    }
  },
  computed: {
    ...mapState({
      alarmSetting: ({ map2d }) => map2d.mapIndex.alarmSetting,
      mapToolbarStatus: ({ map2d }) => map2d.mapIndex.mapToolbarStatus,
      showAllPoint: ({ map2d }) => map2d.mapPoint.showAllPoint
    })
  },
  watch: {
    alarmSetting: {
      handler(val) {
        let isReceiveEnd = this.form.isReceive !== val.isReceive
        let isCountEnd = this.form.isCount !== val.isCount

        this.form.isReceive = val.isReceive
        this.form.isCount = val.isCount
        this.form.isLocation = val.isLocation

        if (isReceiveEnd) {
          this.openAlarm(this.alarmSetting.isReceive)
        } // 开启报警接收
        if (isCountEnd) {
          this.alarmStastic()
        } // 开启报警统计
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('map2d/mapIndex', ['SET_ALARM_SETTING']),
    ...mapActions('map2d/mapIndex', [
      'setAlarmSetting',
      'getAlarmColor',
      'getAlarmSetting',
      'addAlarmSetting',
      'updateAlarmSetting',
      'getAlarmCount',
      'findCount'
    ]),
    // 底部轮播推送消息
    bannerFn() {},
    clearAlarmSetInfo(isKeepStatus) {
      let arr1 = [this.alarmSetting.isReceive, this.alarmSetting.isCount, this.alarmSetting.isLocation]
      let changeStatus = isKeepStatus ? arr1 : [false, '0', false]
      if (this.alarmSetting.featureInterval) {
        window.clearInterval(this.alarmSetting.featureInterval)
      }
      let obj = {
        isXiaoFang: false,
        isReceive: changeStatus[0], // 是否接收报警
        isCount: changeStatus[1], // 是否统计报警    //1 开启  0 关闭
        isLocation: changeStatus[2], // 是否定位报警
        nowAlarmStatus: 0, // 当前报警状态 0:初始态，1：报警中，2：鼠标选中
        nowSelectFeatureId: '', // 当前鼠标选中feature的id
        featureInterval: null, // feature闪烁时间定时器
        isKwinKel: false, // 报警点位是否闪烁
        alarmFeatureIds: {
          pointIds: [],
          keyPartIds: [],
          orgIds: []
        }, // 报警feature的主键数组
        alarmPushInfo: [],
        alarmInfo: []
      }
      this.setAlarmSetting(cloneDeep(obj))
      this.form = cloneDeep(this.alarmSetting)
    },
    // 开启动画
    animateFun() {
      if (this.alarmSetting.featureInterval) {
        window.clearInterval(this.alarmSetting.featureInterval)
      }
      let nowThis = this
      let num = 0
      let Time = setInterval(function() {
        let obj = cloneDeep(nowThis.alarmSetting)
        num++
        obj.isKwinKel = num % 2 !== 0
        let resultObj = cloneDeep(obj)
        nowThis.SET_ALARM_SETTING(resultObj)
      }, 400)
      let Setting = cloneDeep(this.alarmSetting)
      Setting.featureInterval = Time
      this.setAlarmSetting(Setting)
    },
    // 报警统计
    alarmStaticByTime() {
      // let param={}
      //  通过接口获取统计信息
      //   安防 统计
      const pageType = sessionStorage.getItem('sessionStorage_fromPage') === 'fireDevice' ? 'fireDevice' : 'allDevice'
      if (pageType === 'fireDevice') {
        let params = {
          startTime: moment()
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          type: '1'
        }
        this.findCount(params).then(suc => {
          if (suc.code === 0 && suc.data && suc.data.count) {
            this.AlarmCount = JSON.parse(suc.data.count)
            if (!this.AlarmCount.alarmInfoTotal) {
              this.AlarmCount.alarmInfoTotal = this.AlarmCount.total
            }
          }
        })
      } else {
        let param = {
          startTime: moment()
            .startOf('day')
            .format('X'),
          endTime: moment().format('X'),
          type: '1'
        }
        this.getAlarmCount(param).then(suc => {
          if (suc.code === 0 && suc.data && suc.data.count) {
            this.AlarmCount = JSON.parse(suc.data.count)
          }
        })
      }
    },
    alarmStastic() {
      this.getAlarmColor().then(suc => {
        this.colorData[0].color = suc.data.results[0].color1
        this.colorData[1].color = suc.data.results[0].color2
        this.colorData[2].color = suc.data.results[0].color3
        this.colorData[3].color = suc.data.results[0].color4
        this.colorData[4].color = suc.data.results[0].color5
      })
      this.alarmStaticByTime()
      //  this.$forceUpdate()
    },
    // 报警接收
    openAlarm(data) {
      let alarmType = sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice' ? 'fireAlarm' : 'alarmDeal'
      if (!data) {
        // 关闭
        socket.remove(alarmType, data => {
          console.log('duan')
        })
        this.clearAlarmSetInfo(false)
      } else {
        this.animateFun()
        // 接收推送
        console.log('开启接收推送', alarmType)
        socket.on(alarmType, data => {
          console.log('接收一条报警', data)
          this.alarmStaticByTime()
          let Setting = cloneDeep(this.alarmSetting)
          if (data.alarmInfo.point && data.alarmInfo.point.length > 0) {
            data.alarmInfo.point.forEach(item => {
              let obj = {
                id: data.alarmInfo.id,
                pointId: item.id,
                keyPartId: item.keyPartId,
                orgId: item.orgId,
                alarmTypeName: data.alarmInfo.alarmTypeName,
                alarmName: data.alarmInfo.alarmName,
                startTime: data.alarmInfo.startTime,
                locationId: data.alarmInfo.locationId,
                deviceName: data.alarmInfo.deviceName,
                orgName: data.alarmInfo.orgName,
                floorId: item.floorId
              }
              Setting.alarmPushInfo.push(obj)
              this.updatePointIds(Setting.alarmFeatureIds, obj)
              console.log('处理报警数据完成', Setting)
            })
          }

          let resul = cloneDeep(Setting)
          this.setAlarmSetting(resul)
          this.drawer = false
          this.staticData = data.alarmInfo
          this.alarmTypeColor = this.colorData[data.alarmInfo.level - 1].color
          this.staticData.startTime = moment(data.alarmInfo.startTime * 1000).format('yyyy-MM-DD HH:mm')
          setTimeout(() => {
            this.drawer = true
          }, 200)
        })
        let Setting = JSON.parse(JSON.stringify(this.alarmSetting))
        Setting.isReceive = this.form.isReceive
        Setting.isCount = this.form.isCount
        Setting.isLocation = this.form.isLocation
        this.setAlarmSetting(Setting)
      }
    },
    automaticPositioning(obj) {
      let points = obj.coordinate
      let center = points.split(',').length > 2 ? areaUtil.getMultiPExtentAndCenter(points).center : points
      let pointsArr = center.split(',')
      window.$context2D.map.getView().setCenter([parseFloat(pointsArr[0]), parseFloat(pointsArr[1])])
      window.$context2D.map.getView().setZoom(10)
    },
    // 报警统计
    openStatistic(data) {
      console.log(data)
      if (data == '1') {
        this.alarmStastic()
      } else if (data == '0') {
      }
      let Setting = JSON.parse(JSON.stringify(this.alarmSetting))
      Setting.isReceive = this.form.isReceive
      Setting.isCount = this.form.isCount
      Setting.isLocation = this.form.isLocation
      this.setAlarmSetting(Setting)
    },
    updatePointIds(alarmFeatureIds, item) {
      if (item.pointId && !alarmFeatureIds.pointIds.includes(item.pointId)) {
        alarmFeatureIds.pointIds.push(item.pointId)
      }
      if (item.keyPartId && !alarmFeatureIds.keyPartIds.includes(item.keyPartId)) {
        alarmFeatureIds.keyPartIds.push(item.keyPartId)
      }
      if (item.orgId && !alarmFeatureIds.orgIds.includes(item.orgId)) {
        alarmFeatureIds.orgIds.push(item.orgId)
      }
    },
    // 接受到的最新消息处理
    socketFuc(data) {
      data.alarmInfo.mergeNo = 1
      data.alarmInfo.alarmTypeName = data.alarmInfo.alarmType
      data.alarmInfo.alarmStateName = '未结束'
      data.alarmInfo.dealStateName = '未处理'
      data.alarmInfo.talkRequestName = '否'
      data.alarmInfo.isMerge = true
      data.alarmInfo.channelId = data.alarmInfo.actionList[0].channelId
      data.alarmInfo.startTime = moment(data.alarmInfo.startTime * 1000).format('yyyy-MM-DD HH:mm')
      // 判断此条socket 是否接受
      // let isConbine = _.filter(this.filterForm.type, data.alarmInfo.alarmType)
      if (this.actHeaderBtn && this.actHeaderBtn === data.alarmInfo.level) {
        this.homologousMerging(
          data.alarmInfo.actionList && data.alarmInfo.actionList[0].channelId,
          this.ids,
          data.alarmInfo
        )
      } else if (!this.actHeaderBtn) {
        this.homologousMerging(
          data.alarmInfo.actionList && data.alarmInfo.actionList[0].channelId,
          this.ids,
          data.alarmInfo
        )
      }
    },
    // 自动定位
    AlarmLocation() {
      if (this.form.isLocation) {
        console.log('开启自动定位')
      }
      let Setting = JSON.parse(JSON.stringify(this.alarmSetting))
      Setting.isReceive = this.form.isReceive
      Setting.isCount = this.form.isCount
      Setting.isLocation = this.form.isLocation
      this.setAlarmSetting(Setting)
    },
    testFunction() {
      let obj = {
        sendStrategy: 1,
        type: 'alarmInfo',
        alarmInfo: {
          id: '246565',
          deviceId: '2',
          ip: '10.1.3.40',
          port: 8000,
          channel: 0,
          talkRequest: 'F',
          eventTypeName: '布防',
          type: '',
          resourceId: 0,
          deviceName: '报警控制主机4-地上楼层',
          eventType: 2005,
          locationId: 242,
          alarmSource: '本级报警',
          alarmState: '已结束',
          startTime: 1597627350000,
          orgName: '建行安徽省分行',
          level: 3,
          locationName: '财富',
          alarmClassEn: 'alarmIntrusion',
          alarmTypeName: '入侵报警',
          point: [
            {
              id: '1881',
              name: '数据库没有这个值',
              type: 5,
              subType: '电话报警主机',
              level: 8,
              coordinate: '12819319.557818847,4960107.958513868',
              isouter: true,
              resourceId: '0',
              floorId: '76',
              keyPartId: '7',
              shapeType: 1,
              orgId: '5',
              deviceId: '2'
            }
          ],
          alarmName: '报警控制主机4-地上楼层布防',
          action_dict: {
            cameraInfo: [
              {
                ip: '10.1.2.20',
                port: 37777,
                name: '硬盘录像机1-理财业务区',
                channelName: 'CH2枪机-理财业务区1客户等候区',
                channelNum: 2,
                dport: 37777,
                stream: 1
              },
              {
                ip: '192.168.60.10',
                port: 3721,
                name: '测试-192.168.60.10',
                channelName: '总行监控中心机柜前',
                channelNum: 1,
                dport: 3720,
                stream: 1
              },
              {
                ip: '192.168.60.10',
                port: 3721,
                name: '测试-192.168.60.10',
                channelName: '大会议室',
                channelNum: 2,
                dport: 3720,
                stream: 1
              }
            ],
            TalkInfo: '',
            doorInfo: '',
            channelInfo: ''
          }
        },
        dispose: {}
      }
      let _this = this
      setTimeout(function() {
        let data = obj
        console.log('接收一条报警', data, cloneDeep(_this.alarmSetting))
        let Setting = cloneDeep(_this.alarmSetting)
        if (data.alarmInfo.point && data.alarmInfo.point.length > 0) {
          data.alarmInfo.point.forEach(item => {
            let obj = {
              id: data.alarmInfo.id,
              pointId: item.id,
              keyPartId: item.keyPartId,
              orgId: item.orgId,
              alarmTypeName: data.alarmInfo.alarmTypeName,
              alarmName: data.alarmInfo.alarmName,
              startTime: data.alarmInfo.startTime,
              locationId: data.alarmInfo.locationId,
              deviceName: data.alarmInfo.deviceName,
              orgName: data.alarmInfo.orgName,
              floorId: item.floorId
            }
            Setting.alarmPushInfo.push(obj)
            _this.updatePointIds(Setting.alarmFeatureIds, obj)
            console.log('处理报警数据完成', Setting)
          })
        }

        let resul = cloneDeep(Setting)
        _this.setAlarmSetting(resul)
        _this.drawer = false
        _this.staticData = data.alarmInfo
        _this.staticData.startTime = moment(data.alarmInfo.startTime).format('yyyy-MM-DD HH:mm')
        setTimeout(() => {
          _this.drawer = true
        }, 100)
      }, 10000)
    }
  }
}
</script>
<style lang="less" scoped>
.distance {
  margin-top: 10px;
  width: 240px;
  height: 140px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: -1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .query-form {
    width: 100%;
    height: 100%;
    display: flex;
    .from-lable {
      margin: 0 20px 0 30px;
      color: #333;
      font-size: 12px;
    }
    /deep/ .el-checkbox-group {
      .el-checkbox {
        .el-checkbox__label {
          color: #333;
        }
      }
    }
  }
  .statistics-box {
    height: 363px;
    width: 270px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 150px;
    left: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    .title {
      background: rgba(242, 242, 242, 0.8);
      color: #000;
      font-size: 13px;
      line-height: 30px;
      height: 30px;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .center {
      width: 100%;
      height: calc(~'100% - 130px');
      padding: 0 20px;
      .number-alarms {
        height: 80px;
        width: 100%;
        border-bottom: 1px dashed #ccc;
        display: flex;
        .number:first-child ::after {
          content: '';
          display: block;
          width: 5px;
          height: 40px;
          background: skyblue;
          position: absolute;
          right: -4px;
          top: 21px;
        }
        .number {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          .num-box {
            margin-bottom: 8px;
            font-size: 18px;
            color: #000;
            font-weight: 600;
          }
          .num-stats {
            color: #6b6b6b;
            font-size: 13px;
          }
        }
      }
      .classification {
        width: 100%;
        height: calc(~'100% - 80px');
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .classification-box {
          width: 100%;
          height: 15px;
          color: #333333;
          line-height: 15px;
          display: flex;
          .color-box {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .num-left {
            margin: 0 0 0 50px;
            border-right: 1px solid skyblue;
            padding-right: 5px;
          }
          .num-right {
            border-left: 1px solid skyblue;
            padding-left: 5px;
          }
        }
      }
    }
    .footer {
      width: 100%;
      // height: 100px;
      display: flex;
      flex-direction: column;
      .new-title {
        line-height: 12px;
        font-size: 13px;
        padding-left: 20px;
        margin-bottom: 5px;
        color: #000;
      }
      .new-message {
        padding-left: 20px;
        line-height:20px;
      }
      .new-type {
        padding-left: 20px;
        .hot-message {
          text-align: center;
          min-width: 60px;
         height: 22px;
         line-height: 22px;
          display: inline-block;
          transform: skewX(-10deg);
          background: red;
          color:#060606;
        }
      }
      .message-name {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
