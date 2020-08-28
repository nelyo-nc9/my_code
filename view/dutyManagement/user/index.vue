<template>
  <div class="dutyManagementUser">
    <div class="content" v-if="!shiftStatus">
      <div class="content-left">
        <div class="header">
          <div class="location">
             <div class="directory-item">
                <span class="el-icon-location-outline"></span>
              </div>
              <div class="breadcrumb" v-if="!keyConcernsShow">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班状态</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <div class="breadcrumb" v-if="keyConcernsShow">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>交接班</el-breadcrumb-item>
                <el-breadcrumb-item>开始交班</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </div>
          </div>
      </div>
      <div class="content-right">
        <div class="main">
        <div class="main-left">
          <div class="dutyInfo" v-if="keyConcernsShow">
            <i class="eventItem"></i>
            <span>值班时间:</span>
            <span>2020-03-05 09:57:50至2020-03-05 13:38:00</span>
          </div>
        <!-- 交接班信息表 -->
        <el-table :data="shiftChangeData" height="150" stripe style="width: 100%" v-if="keyConcernsShow"></el-table-column>
          <el-table-column prop="date" label="日期时间" width="" align="center"></el-table-column>
          <el-table-column prop="handOff" label="交班人姓名" width="" align="center"></el-table-column>
          <el-table-column prop="handOffPhone" label="联系电话" width="" align="center"></el-table-column>
          <el-table-column label="接班人" width="" align="center">
            <template>
              <el-select v-model="form.value" @change="change" ref="select">
                <el-option
                  v-for="(item,index) in peopleArray"
                  :key="index"
                  :value="item.label"
                  :label="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="successorPhone" label="联系电话" width="" align="center"></el-table-column>
        </el-table>
        <div class="dutyInfo" v-if="!keyConcernsShow">
          <i class="eventItem"></i>
          <span>当前值班人：{{user}}</span>
          <span style="margin-left:80px;">接班时间：{{officeTime}}</span>
        </div>
        <div v-if="alarmTableShow">
          <div class="dutyInfo">
            <i class="eventItem"></i>
            <span>报警事件</span>
          </div>
          <!-- 报警事件列表 -->
          <el-table :data="alarmTableData" height="75" stripe style="width: 100%" @cell-click="alarmEventClick"></el-table-column>
            <el-table-column prop="alarmInfoTotal" label="事件总数" width="" align="center"></el-table-column>
            <el-table-column prop="done" label="已处理" width="" align="center"></el-table-column>
            <el-table-column prop="toDo" label="未处理" width="" align="center"></el-table-column>
            <el-table-column prop="level1" label="1级事件" width="" align="center"></el-table-column>
            <el-table-column prop="level2" label="2级事件" width="" align="center"></el-table-column>
            <el-table-column prop="level3" label="3级事件" width="" align="center"></el-table-column>
            <el-table-column prop="level4" label="4级事件" width="" align="center"></el-table-column>
            <el-table-column prop="level5" label="5级事件" width="" align="center"></el-table-column>
          </el-table>
        </div>
        <div v-if="faultTableShow">
          <div class="dutyInfo">
            <i class="eventItem"></i>
            <span>故障报修</span>
          </div>
          <!-- 故障报修列表 -->
          <el-table :data="troubleTableData" :height="troubleTableHeight" stripe style="width: 100%"></el-table-column>
            <el-table-column label="序号" width="" type="index" align="center"></el-table-column>
            <el-table-column prop="keyPart" label="所属重点部位" width="" align="center"></el-table-column>
            <el-table-column prop="org" label="所属机构" width="" align="center"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" width="" align="center"></el-table-column>
            <el-table-column prop="engineeringContractor" label="工程商" width="" align="center"></el-table-column>
            <el-table-column prop="maintenanceMan" label="维修人" width="" align="center"></el-table-column>
            <el-table-column prop="phone" label="维修电话" width="" align="center"></el-table-column>
            <el-table-column prop="address" label="安装地点" width="" align="center"></el-table-column>
            <el-table-column prop="time" label="填表时间" width="" align="center"></el-table-column>
          </el-table>
          <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('trouble')">
            <i :class="expandTroubleTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="troubleTableData.length > 5"></i>
          </div>
        </div>
        <div v-if="checkLogShow">
          <div class="dutyInfo">
          <i class="eventItem"></i>
          <span>检查记录</span>
        </div>
        <div style="margin-top:5px;display: flex;">
          <div style="width:75%;">
            今日检查记录
            <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:92%">
          </div>
          <div style="width:25%;">
            <span>记录处理</span>
            <hr style="color:#ccc;position:relative;top:-8px;right:-65px;width:85%">
          </div>
        </div>
        <!-- 检查记录列表 -->
        <el-row>
          <el-col :span="18">
            <div>
              <el-table :data="checkLogTableData" :height="checkLogTableHeight" stripe style="width: 100%" @cell-click="checkLogModel"> </el-table-column>
                <el-table-column label="机构" width="" prop="orgName" align="center"></el-table-column>
                <el-table-column prop="keyPartName" label="重点部位" width="" align="center"></el-table-column>
                <el-table-column prop="channelName" label="镜头" width="" align="center"></el-table-column>
                <el-table-column prop="action" label="检查动作" width="" align="center"></el-table-column>
                <el-table-column prop="time" label="记录时间" width="265" align="center"></el-table-column>
                <el-table-column prop="operation" label="操作" width="" align="center">
                  <template slot-scope="scope">
                      <i @click.stop="checkLogClick(scope.row)" title="查看" style="font-size:18px;cursor: pointer;margin-right:10px;"
                       :class="[scope.row.event === '抓图' ? 'el-icon-picture-outline' : 'el-icon-video-camera']"></i>
                      <i @click.stop="deleteCheckLog(scope.row)" title="删除记录" style="font-size:18px;cursor: pointer;" class="el-icon-delete"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('checkLog')">
                <i :class="expandCheckLogTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="checkLogTableData.length > 5"></i>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-form ref="form" :model="checkLogForm" labelPosition="center" label-width="100px">
                <el-form-item label="值班员">
                  <el-input v-model="checkLogForm.username" readonly></el-input>
                </el-form-item>
                <el-form-item label="检查类型">
                  <el-input v-model="checkLogForm.event" readonly></el-input>
                </el-form-item>
                <el-form-item label="检查项目">
                  <el-input v-model="checkLogForm.project" readonly></el-input>
                </el-form-item>
                <el-form-item label="内容描述">
                  <el-input v-model="checkLogForm.desc" type="textarea" :rows="2" readonly></el-input>
                </el-form-item>
                <el-form-item label="填写单位">
                  <el-input v-model="checkLogForm.updatedDept" readonly></el-input>
                </el-form-item>
                <el-form-item label="填写时间">
                  <el-input v-model="checkLogForm.CreatedAt" readonly></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
        </div>
        <div class="eventRecord" v-if="eventTableShow">
          <div class="dutyInfo">
            <i class="eventItem"></i>
            <span>事件记录</span>
          </div>
          <!-- 事件记录列表 -->
          <el-table :data="eventRecordTableData" :height="eventRecordTableHeight" stripe style="width: 100%"></el-table-column>
            <el-table-column label="序号" width="" type="index" align="center"></el-table-column>
            <el-table-column prop="username" label="发起人" width="" align="center"></el-table-column>
            <el-table-column prop="channelName" label="资源信息" width="" align="center"></el-table-column>
            <el-table-column prop="location" label="位置信息" width="" align="center"></el-table-column>
            <el-table-column prop="event" label="事件类型" width="" align="center"></el-table-column>
            <el-table-column prop="desc" label="事件描述" width="" align="center"></el-table-column>
            <el-table-column label="操作" width="" align="center">
              <template slot-scope="scope">
                <i @click="eventRecordHandleClick(scope.row)" style="color:#409EFF;cursor:pointer;">查看</i>
                <i @click="deleteEventRecordBtn(scope.row)" style="color:#409EFF;cursor:pointer;">删除</i>
              </template>
            </el-table-column>
          </el-table>
          <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('eventRecord')">
            <i :class="expandEventRecordTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="eventRecordTableData.length > 5"></i>
          </div>
        </div>
        <div class="keyConcerns" v-if="keyConcernsShow">
          <div class="dutyInfo">
            <i class="eventItem"></i>
            <span>重点关注事项</span>
          </div>
          <!-- 事件记录列表 -->
          <el-input type="textarea" :rows="4"></el-input>
          <div style="float:right;margin-top:10px;">
            <el-button size="small" @click="goBack">返回</el-button>
            <el-button @click="startShift" size="small" type="primary">开始交班</el-button>
          </div>
        </div>
      </div>
        <alarmEventModel @alarmModelVisible="alarmModelClick" :alarmModelVisible="alarmModelVisible"></alarmEventModel>
        <eventRecordModel @closeEventVisibel="closeEventVisibel" :eventRecordForm="eventRecordForm" :eventVisibel="eventVisibel"></eventRecordModel>
        <div v-if="screenShotVisible">
          <el-dialog title="查看截图" :visible.sync="screenShotVisible" width="30%" :before-close="screenshotHandleClose">
              <div style="height:300px;">这是一张截图</div>
          </el-dialog>
        </div>
      </div>
      </div>
    </div>
    <div v-if="shiftStatus" class="duty-info">
      <div style="margin-top:5px;">
        <div style="float:left;font-size:18px;margin-top:-5px;">
          <span class="el-icon-location-outline"></span>
        </div>
        <div style="float:left;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>值班管理</el-breadcrumb-item>
          <el-breadcrumb-item>交接班</el-breadcrumb-item>
          <el-breadcrumb-item>交接班信息表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 交班信息表 -->
      <div style="margin-top:50px;">
        <p style="font-size:18px;text-align:center;">交接班信息表</p>
        <dutyInfoTable @dutyStart="dutyStart"  ref="dutyInfoTable"></dutyInfoTable>
      </div>
    </div>
  </div>
</template>

<script>
import { checklogApi,
  deleteChecklogApi,
  eventlogApi,
  deleteEventlogApi,
  getPermissionApi,
  getMyInfoApi,
  startShiftApi,
  alarmlistApi } from '@src/http/dutyManagement/dutyManagement.api'
import alarmEventModel from './model/alarmEventModel'
import eventRecordModel from './model/eventRecordModel'
import dutyInfoTable from './model/dutyInfoTable'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'dutyManagementUser',
  components: {
    alarmEventModel,
    eventRecordModel,
    dutyInfoTable
  },
  data() {
    return {
      dutyId: '', // 当前值班员值班ID 交班用
      user: '', // 当前值班用户
      officeTime: '', // 当前值班用户接班时间
      logId: '1', // 当前交接班日志的ID
      troubleTableHeight: 230, // 故障报修表格高度
      expandTroubleTableStatus: false, // 故障报修表格是否展开
      checkLogTableHeight: 216, // 检查记录表格高度
      expandCheckLogTableStatus: false, // 检查记录表格是否展开
      eventRecordTableHeight: 225, // 事件记录表格高度
      expandEventRecordTableStatus: false, // 事件记录表格是否展开
      alarmTableShow: false, // 报警事件列表是否可查看
      faultTableShow: false, // 故障报修列表是否可查看
      checkLogShow: false, // 检查记录列表是否可查看
      eventTableShow: false, // 事件记录列表是否可查看
      alarmModelVisible: false, // 报警事件详情弹窗
      // 测试数据
      form: {
        value: ''
      },
      eventVisibel: false,
      eventRecordForm: {},
      peopleArray: [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'}
      ],
      // 报警事件列表
      alarmTableData: [
      ],
      // 故障报修列表数据
      troubleTableData: [
      ],
      // 检查记录列表数据
      checkLogTableData: [
      ],
      // 事件记录列表数据
      eventRecordTableData: [],
      // 交接班信息表
      shiftChangeData: [{
        date: '2020-05-20 13:14:00',
        handOff: '张三',
        handOffPhone: 13666666666,
        successor: 'xxx',
        successorPhone: 13555555555
      }],
      // 检查记录表单
      checkLogForm: {
      },
      // 查看事件记录截图弹窗
      screenShotVisible: false
    }
  },
  computed: {
    ...mapState({
      keyConcernsShow: ({ dutyManagement }) => dutyManagement.keyConcernsShow,
      shiftStatus: ({ dutyManagement }) => dutyManagement.shiftStatus
    })
  },
  watch: {
    'keyConcernsShow'(newName, oldName) {
      if (newName) {
      }
    }
  },
  created() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log(user)
    this.getPermissionApiFuc()
    this.eventlogApiFuc()
    this.checklogApiFuc()
    this.getMyInfoApiFuc()
    // this.alarminfocountApiFuc()
  },
  methods: {
    ...mapMutations('dutyManagement', ['SET_KEY_CONCERNS_SHOW']),
    ...mapActions('dutyManagement', ['editShiftInfoApi', 'getDutyInfoApi']),
    // 获取自己的值班信息
    getMyInfoApiFuc() {
      getMyInfoApi().then(res => {
        if (res.data.code === 0) {
          this.dutyId = res.data.data.results[0].id || ''
          this.user = res.data.data.results[0].duty.userName || ''
          this.officeTime = this.$moment(Number(res.data.data.results[0].duty.officeTime)).format('YYYY-MM-DD HH:mm:ss') || ''
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 开始值班
    dutyStart() {
      this.getPermissionApiFuc()
      this.getMyInfoApiFuc()
    },
    // // 获取报警相关的数据
    // alarminfocountApiFuc() {
    //   let param = {
    //     startTime: '1595606400',
    //     endTime: '1595646748'
    //   }
    //   this.alarmTableData = []
    //   alarminfocountApi(param).then(res => {
    //     if (res.data.code === 0) {
    //       this.alarmTableData.push(this.handelAlarmData(res.data.data.count))
    //     }
    //   })
    // },
    alarmModelClick(flag) {
      this.alarmModelVisible = flag
    },
    // 获取当前值班员登录可查看的权限
    getPermissionApiFuc() {
      let param = {
        orgId: '45',
        startTime: '1595606400',
        endTime: '1595646748'
      }
      getPermissionApi(param).then(res => {
        if (res.data.code === 0) {
          this.alarmTableData.push(this.handelAlarmData(res.data.data.alarmList))
          this.alarmTableShow = res.data.data.alarmEnable === 1
          this.checkLogShow = res.data.data.checkEnable === 1
          this.eventTableShow = res.data.data.eventEnable === 1
          this.faultTableShow = res.data.data.faultEnable === 1
        }
      })
    },
    // 处理报警返回的数据
    handelAlarmData(list) {
      let arr = JSON.parse(JSON.stringify(list))
      arr.level1 = arr.level1ToDo + '/' + arr.level1
      arr.level2 = arr.level2ToDo + '/' + arr.level2
      arr.level3 = arr.level3ToDo + '/' + arr.level3
      arr.level4 = arr.level4ToDo + '/' + arr.level4
      arr.level5 = arr.level5ToDo + '/' + arr.level5
      return arr
    },
    change(val) {
      this.$refs.select.selected.currentLabel = val
    },
    // 点击查看报警详细数据
    alarmEventClick(row, column, cell, event) {
      if (column.label === '事件总数' || column.label === '已处理' || column.label === '未处理') { return false }
      this.alarmModelVisible = true
      let param = {
        startTime: '',
        endTime: String(new Date().getTime()),
        level: ''
      }
      if (column.label === '1级事件') {
        param.level = '1'
      } else if (column.label === '2级事件') {
        param.level = '2'
      } else if (column.label === '3级事件') {
        param.level = '3'
      } else if (column.label === '4级事件') {
        param.level = '4'
      } else if (column.label === '5级事件') {
        param.level = '5'
      }
      alarmlistApi(param).then(res => {
        console.log(res)
      })
    },
    // 检查记录获取
    checklogApiFuc() {
      // let param = {
      //   userId: '45'
      // }
      checklogApi().then(res => {
        if (res.data.code === 0) {
          this.checkLogTableData = this.handelData(res.data.data.logs) || []
          this.checkLogForm = this.checkLogTableData && JSON.parse(JSON.stringify(this.checkLogTableData[0]))
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    handelData(list) {
      let arr = JSON.parse(JSON.stringify(list)) || []
      arr.forEach(item => {
        if (item.event === 'MANUALRECORD') {
          item.event = '紧急录像'
          item.time = this.$moment(Number(item.startTime)).format('YYYY-MM-DD HH:mm:ss') + '-' + this.$moment(Number(item.endTime)).format('YYYY-MM-DD HH:mm:ss')
        } else if (item.event === 'SCREENSHOT') {
          item.event = '抓图'
          item.time = item.createAt
        }
      })
      return arr
    },
    // 事件记录获取
    eventlogApiFuc() {
      // let param = {
      //   userId: '1'
      // }
      eventlogApi().then(res => {
        if (res.data.code === 0) {
          this.eventRecordTableData = res.data.data.logs || []
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 检查详情详细数据弹窗
    checkLogModel(row, column, cell, event) {
      this.checkLogForm = JSON.parse(JSON.stringify(row))
    },
    // 检查记录表格删除按钮
    deleteCheckLog(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          ids: row.id
        }
        this.deleteChecklogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteChecklogApiFuc(ids) {
      deleteChecklogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.checklogApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看事件记录详情弹窗
    eventRecordHandleClick(row) {
      this.eventVisibel = true
      this.eventRecordForm = JSON.parse(JSON.stringify(row))
    },
    closeEventVisibel() {
      this.eventVisibel = false
    },
    // 事件记录删除按钮
    deleteEventRecordBtn(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          ids: row.id
        }
        this.deleteEventlogApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 事件记录表格删除
    deleteEventlogApiFuc(ids) {
      deleteEventlogApi(ids).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('删除成功')
          this.eventlogApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 检查记录详情查看
    checkLogClick(row) {
      if (row.event === '截图') {
        this.screenShotVisible = true
      } else if (row.event === '紧急录像') {
        console.log('视频组件')
      }
    },
    // 交班返回
    goBack() {
      this.SET_KEY_CONCERNS_SHOW(false)
    },
    // 关闭检查记录截图弹窗
    screenshotHandleClose(row) {
      this.screenShotVisible = false
    },
    // 开始交班按钮
    startShift() {
      this.$confirm('确认开始交接班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.startShiftApiFuc()
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消交接班'
        })
      })
    },
    startShiftApiFuc() {
      startShiftApi().then(res => {
        console.log(res)
      })
    },
    // 展开列表
    expandTable(tableName) {
      if (tableName === 'trouble') {
        this.expandTroubleTableStatus = !this.expandTroubleTableStatus
        if (this.expandTroubleTableStatus) {
          this.troubleTableHeight = ''
        } else {
          this.troubleTableHeight = 227
        }
      } else if (tableName === 'checkLog') {
        this.expandCheckLogTableStatus = !this.expandCheckLogTableStatus
        if (this.expandCheckLogTableStatus) {
          this.checkLogTableHeight = ''
        } else {
          this.checkLogTableHeight = 216
        }
      } else {
        this.expandEventRecordTableStatus = !this.expandEventRecordTableStatus
        if (this.expandEventRecordTableStatus) {
          this.eventRecordTableHeight = ''
        } else {
          this.eventRecordTableHeight = 225
        }
      }
    }
  }
}
</script>

<style scoped  lang="less">
.dutyManagementUser {
  display: flex;
  // flex: auto;
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
  // align-items: row;
  // justify-content:space-between;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: row;
    justify-content:space-between;
  }
  .content-left {
    width: 280px;
    height: 100%;
  }
  .content-right {
    margin: 20px 30px 0px 0px;
    width: calc(~'100% - 280px');
  }
  .eventItem {
    display: inline-block;
    width: 6px;
    height: 23px;
    background: rgba(45, 114, 211, 1);
  }
  .header {
    height: 100%;
    width: 300px;
    .location {
      width: 100%;
      height: 100%;
      padding: 15px 0;
      float: left;
      .directory-item {
        float: left;
        font-size: 18px;
      }
      .breadcrumb {
        float: left;
        margin: 4px 0 0 2px;
      }
    }
  }
  .main {
    width: 100%;
    height: 100%;
    padding: 15px 0;
    .main-left {
      .dutyInfo {
        height: 23px;
        line-height: 23px;
        font-size: 14px;
        margin-bottom: 10px;
        span {
          position: relative;
          top: -5px;
          left: 0;
        }
      }
    }
  }
  .duty-info {
    min-width:1400px;
    display: flex;
    padding-bottom: 15px;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  /deep/.el-input {
    width: 302px;
  }
  /deep/.el-dialog__header {
    padding: 5px 20px 5px;
    background: rgba(242, 242, 242, 1);
  }
  /deep/.el-dialog__headerbtn {
    top: 10px;
  }
  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: hidden;
  }
}
</style>
