<!--
 * @Author: your name
 * @Date: 2020-06-06 10:03:57
 * @LastEditTime: 2020-06-15 19:50:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\dutyManagement\admin\pages\dutuInfoTable.vue
-->
<template>
    <div class="dutyManagementUser">
      <div class="main">
        <div class="main-left">
          <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" style="height:75px;text-align:center;line-height:75px;">
              基本信息
            </div>
          </el-col>
          <el-col :span="22">
            <!-- 基本信息 -->
            <el-table :data="basicInfoTableData" height="75" stripe style="width: 100%"></el-table-column>
              <el-table-column prop="shiftTime" label="交班时间" width="" align="center"></el-table-column>
              <el-table-column prop="dutyTime" label="值班时间" width="" align="center"></el-table-column>
              <el-table-column prop="handOff" label="交班人" width="" align="center"></el-table-column>
              <el-table-column prop="handOffPhone" label="联系电话" width="" align="center"></el-table-column>
              <el-table-column prop="successor" label="接班人" width="" align="center"></el-table-column>
              <el-table-column prop="successorPhone" label="联系电话" width="" align="center"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" style="height:75px;text-align:center;line-height:75px;">
              报警事件
            </div>
          </el-col>
          <el-col :span="22">
            <!-- 报警事件列表 -->
            <el-table :data="alarmTableData" height="75" stripe style="width: 100%"  @cell-click="alarmEventClick"></el-table-column>
              <el-table-column prop="eventNum" label="事件总数" width="" align="center"></el-table-column>
              <el-table-column prop="handled" label="已处理" width="" align="center"></el-table-column>
              <el-table-column prop="unProcessed" label="未处理" width="" align="center"></el-table-column>
              <el-table-column prop="levelOneEvent" label="1级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelTwoEvent" label="2级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelThreeEvent" label="3级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelFourEvent" label="4级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelFiveEvent" label="5级事件" width="" align="center"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" :style="{height:troubleTitleHeight + 'px','line-height':troubleTitleHeight + 'px','text-align':'center'}">
              故障报修
            </div>
          </el-col>
          <el-col :span="22">
            <!-- 故障报修列表 -->
            <div ref="tableBox1">
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
            </div>
            <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('trouble')">
              <i :class="expandTroubleTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="troubleTableData.length > 5"></i>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" :style="{height:checkLogTitleHeight  +  'px','line-height':checkLogTitleHeight + 'px','text-align':'center'}">
              检查记录
            </div>
          </el-col>
        <!-- 检查记录列表 -->
          <el-col :span="22">
              <el-row>
                <el-col :span="19">
                  <el-row style="margin-bottom:5px;box-sizing: border-box;">
                    <el-col :span="2">
                      <div>今日检查记录</div>
                    </el-col>
                    <el-col :span="22">
                      <hr style="margin:6px 5px 0 0;color:#333;"></hr>
                    </el-col>
                  </el-row>
                  <div>
                    <div ref="tableBox2">
                      <el-table :data="checkLogTableData" :height="checkLogTableHeight" stripe style="width: 100%" @cell-click="checkLogModel"> </el-table-column>
                        <el-table-column label="机构" width="" prop="orgName" align="center"></el-table-column>
                        <el-table-column prop="keyPartName" label="重点部位" width="" align="center"></el-table-column>
                        <el-table-column prop="channelName" label="镜头" width="" align="center"></el-table-column>
                        <el-table-column prop="action" label="检查动作" width="" align="center"></el-table-column>
                        <el-table-column prop="recordTime" label="记录时间" width="" align="center"></el-table-column>
                        <el-table-column prop="operation" label="操作" width="" align="center">
                          <template slot-scope="scope">
                            <i @click.stop="checkLogClick(scope.row)" title="查看" style="font-size:18px;cursor: pointer;margin-right:10px;" class="el-icon-picture-outline"></i>
                          </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('checkLog')">
                      <i :class="expandCheckLogTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="checkLogTableData.length > 5"></i>
                    </div>
                  </div>
                </el-col>
                 <el-col :span="5">
                   <el-row style="margin-left:5px;">
                     <el-col :span="6">
                       <div>记录处理</div>
                     </el-col>
                     <el-col :span="18">
                       <hr style="margin-top:6px;color:#333;"></hr>
                     </el-col>
                   </el-row>
                   <div>
                     <el-form ref="form" :model="checkLogForm" labelPosition="center" label-width="80px" class="check-form">
                       <el-form-item label="值班员">
                         <el-input v-model="checkLogForm.username" readonly></el-input>
                       </el-form-item>
                       <el-form-item label="检查类型">
                         <el-input v-model="checkLogForm.checktype" readonly></el-input>
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
                         <el-input v-model="checkLogForm.createdAt" readonly></el-input>
                       </el-form-item>
                     </el-form>
                  </div>
                 </el-col>
              </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" :style="{height:eventRecordTitleHeight + 'px','line-height':eventRecordTitleHeight + 'px','text-align':'center'}">
              事件记录
            </div>
          </el-col>
          <el-col :span="22">
            <!-- 事件记录列表 -->
              <div ref="tableBox">
                <el-table :data="eventRecordTableData" :height="eventRecordTableHeight"  stripe style="width: 100%"></el-table-column>
                <el-table-column label="序号" width="" type="index" align="center"></el-table-column>
                <el-table-column prop="userName" label="发起人" width="" align="center"></el-table-column>
                <el-table-column prop="deviceName" label="资源信息" width="" align="center"></el-table-column>
                <el-table-column prop="location" label="位置信息" width="" align="center"></el-table-column>
                <el-table-column prop="eventType" label="事件类型" width="" align="center"></el-table-column>
                <el-table-column prop="desc" label="事件描述" width="" align="center"></el-table-column>
                <el-table-column label="操作" width="" align="center">
                  <template slot-scope="scope">
                    <i @click="eventRecordHandleClick(scope.row)" style="color:#409EFF;cursor:pointer;">查看</i>
                  </template>
                </el-table-column>
                </el-table>
              </div>
              <div style="width:20px;font-size:18px;margin:0 auto;cursor:pointer;" @click="expandTable('eventRecord')">
                <i :class="expandEventRecordTableStatus ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" v-if="eventRecordTableData.length > 5"></i>
              </div>
           </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="content-item">
            <div class="dutyInfo" style="height:150px;text-align:center;line-height:150px;">
              重点关注事项
            </div>
          </el-col>
          <el-col :span="22">
            <!-- 重点关注事项 -->
            <span>重点关注事项</span>
          </el-col>
        </el-row>
        <div class="shiftBtn">
          <div>
            <el-button style="margin-right:50px;" @click="refuseShift">拒绝</el-button>
            <el-button type="primary" @click="acceptShift">接班</el-button>
          </div>
        </div>
      <div v-if="checkRecordScreenshotDialogVisible">
        <el-dialog title="查看截图" :visible.sync="checkRecordScreenshotDialogVisible" width="30%" :before-close="checkRecordScreenshotHandleClose">
            <div style="height:300px;">这是一张截图</div>
        </el-dialog>
      </div>
      </div>
    </div>
      <!-- 事件记录查看弹窗 -->
      <el-dialog :visible.sync="eventRecordDialogVisible" :before-close="eventRecordhandleClose" width="20%">
        <div slot="title" class="dialog-title" style="height:35px;line-height:35px;font-size:16px;">
          <div style="float:left">
              <span>事件记录</span>
          </div>
          <div style="float:right;margin-right:30px;font-size:16px;cursor: pointer;" @click="shiftInfoEventRecordPrint">
              <span title="打印" class="el-icon-printer"></span>
          </div>
        </div>
          <el-form :model="eventRecordForm" label-position="left" class="event-form">
            <el-form-item label="发起人" label-width="80px">
              <el-input v-model="eventRecordForm.userName" readonly></el-input>
            </el-form-item>
            <el-form-item label="资源信息" label-width="80px">
              <el-input v-model="eventRecordForm.deviceName" readonly></el-input>
            </el-form-item>
            <el-form-item label="位置信息" label-width="80px">
              <el-input v-model="eventRecordForm.location" readonly></el-input>
            </el-form-item>
            <el-form-item label="事件类型" label-width="80px">
              <el-input v-model="eventRecordForm.eventType" readonly></el-input>
            </el-form-item>
            <el-form-item label="事件描述" label-width="80px">
              <el-input v-model="eventRecordForm.desc" type="textarea" readonly></el-input>
            </el-form-item>
          </el-form>
      </el-dialog>
      <!-- 报警事件弹窗 -->
      <el-dialog title="报警事件" :visible.sync="alarmEventDialogVisible" :before-close="alarmEventialoghandleClose" width="85%">
        <el-table :data="alarmEventTableData" height="250" stripe style="width: 100%"></el-table-column>
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="numberMergers" label="合并数量" width="80" align="center"></el-table-column>
          <el-table-column prop="parentAgency" label="所属机构" width="120" align="center"></el-table-column>
          <el-table-column prop="parts" label="所属部位" width="120" align="center"></el-table-column>
          <el-table-column prop="device" label="所属设备" width="120" align="center"></el-table-column>
          <el-table-column prop="alarmType" label="报警分类" width="120" align="center"></el-table-column>
          <el-table-column prop="alarmName" label="报警名称" width="120" align="center"></el-table-column>
          <el-table-column prop="eventTime" label="发生时间" width="160" align="center"></el-table-column>
          <el-table-column prop="alarmRank" label="报警等级" width="120" align="center"></el-table-column>
          <el-table-column prop="processingState" label="处理状态" width="100" align="center"></el-table-column>
          <el-table-column prop="intercomRequest" label="对讲请求" width="120" align="center"></el-table-column>
          <el-table-column prop="alarmSource" label="报警来源" width="120" align="center"></el-table-column>
          <el-table-column prop="processingType" label="处理类型" width="100" align="center"></el-table-column>
          <el-table-column prop="handlingComments" label="处理意见" width="100" align="center"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAlarmEventDialog">取 消</el-button>
          <el-button type="primary" @click="confirmedAlarmEventDialog">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { startDutyApi, getDutyInfoApi, confirmofferApi, alarmlistApi, refuseofferApi } from '@src/http/dutyManagement/dutyManagement.api'
export default {
  name: 'dutyInfoTable',
  components: {
  },
  data() {
    return {
      checkLogTitleHeight: 216,
      eventRecordTitleHeight: 225,
      troubleTitleHeight: 220,
      troubleTableHeight: 220, // 故障报修表格高度
      checkLogTableHeight: 216, // 检查记录表格高度
      expandTroubleTableStatus: false, // 故障报修表格是否展开
      expandCheckLogTableStatus: false, // 检查记录表格是否展开
      eventRecordTableHeight: 225, // 事件记录表格高度
      expandEventRecordTableStatus: false, // 事件记录表格是否展开
      // 基本信息列表数据
      basicInfoTableData: [
      ],
      alarmEventDialogVisible: false, // 报警事件弹窗
      alarmEventTableData: [ // 报警事件弹窗表格信息
        {
          numberMergers: 20,
          parentAgency: 'XXX',
          parts: 'XXX',
          device: 'XXX',
          alarmType: 'XXX',
          alarmName: 'XXX',
          eventTime: 'XXX',
          alarmRank: 'XXX',
          processingState: 'XXX',
          intercomRequest: 'XXX',
          alarmSource: 'XXX',
          processingType: 'XXX',
          handlingComments: 'XXX'
        }
      ],
      alarmTableData: [ // 报警事件列表
        {
          eventNum: 'xxx',
          handled: 'xxx',
          unProcessed: 'xx',
          levelOneEvent: 'xx',
          levelTwoEvent: 'xx'
        }
      ],
      troubleTableData: [ // 故障报修列表数据
      ],
      checkLogTableData: [ // 检查记录列表数据
      ],
      eventRecordTableData: [ // 事件记录列表数据
      ],
      shiftChangeData: [ // 交接班信息表
        {
          date: '2020-05-20 13:14:00',
          handOff: '张三',
          handOffPhone: 13666666666,
          successor: '李四',
          successorPhone: 13555555555
        }
      ],
      checkLogForm: { // 检查记录表单
        name: '张三',
        checkType: 1,
        checkProjects: 1,
        content: '',
        unit: 'XXXXX单位',
        time: '2020-05-20 : 13:14:00'
      },
      eventRecordForm: { // 事件记录表单内容
        name: '张三',
        resourcesInfo: 'XXX',
        positionInfo: 'XXX',
        eventType: 1,
        eventDescription: ''
      },
      checkRecordScreenshotDialogVisible: false, // 查看检查记录截图弹窗
      eventRecordDialogVisible: false // 查看事件记录详情弹窗
    }
  },
  computed: {
    ...mapState({
      id: ({dutyManagement}) => dutyManagement.id // 用来查询交接班日志详情的主键ID
    })
  },
  created() {
    this.getDutyInfoApiFuc()
  },
  methods: {
    ...mapMutations('dutyManagement', ['SET_KEY_CONCERNS_SHOW', 'SET_DUTY_STATUS']),
    ...mapActions('login', ['userOut', 'removeUserInfo']),
    getDutyInfoApiFuc() {
      getDutyInfoApi(this.id).then(res => {
        if (res.data.code === 0) {
          this.handelData(res.data.data.details[0])
          this.$messageSuccess('日志详情获取成功')
        } else {
          this.$messageError('日志详情获取失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理数据
    handelData(data) {
      let info = JSON.parse(JSON.stringify(data))
      this.basicInfoTableData = []
      this.alarmTableData = []
      this.eventRecordTableData = []
      this.checkLogTableData = []
      this.basicInfoTableData.push({
        shiftTime: info.duty.closeTime,
        dutyTime: info.duty.officeTime,
        handOff: info.duty.userName,
        handOffPhone: info.duty.userPhone,
        successor: info.duty.nextUserName,
        successorPhone: info.duty.nextUserPhone
      })
      this.alarmTableData.push(info.alarm)
      // this.troubleTableData = info.failureList
      info.checks.forEach((item, index) => {
        this.checkLogTableData.push(item.check)
        this.checkLogTableData[index].id = item.id
      })
      this.checkLogForm = JSON.parse(JSON.stringify(this.checkLogTableData[0]))
      info.events.forEach((item, index) => {
        this.eventRecordTableData.push(item.event)
        this.eventRecordTableData[index].id = item.id
      })
    },
    // 点击查看报警详情
    alarmEventClick(row, column, cell, event) {
      if (column.label === '事件总数' || column.label === '已处理' || column.label === '未处理') { return false }
      this.alarmEventDialogVisible = true
      let param = {
        startTime: String(new Date().getTime()),
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
        console.log(res) // 接口暂无数据
      })
    },
    /**
     * @description:  点击关闭报警详细数据
     * @param {无}
     * @return: 无
     */
    alarmEventialoghandleClose() {
      this.alarmEventDialogVisible = false
    },
    /**
     * @description:  报警详细数据取消按钮
     * @param {无}
     * @return: 无
     */
    cancelAlarmEventDialog() {
      this.alarmEventDialogVisible = false
    },
    /**
     * @description:  报警详细数据确定按钮
     * @param {无}
     * @return: 无
     */
    confirmedAlarmEventDialog() {
      this.alarmEventDialogVisible = false
    },
    /**
     * @description:  检查详情详细数据弹窗
     * @param {无}
     * @return: 无
     */
    checkLogModel(row, column, cell, event) {
      this.checkLogForm = JSON.parse(JSON.stringify(row))
    },
    /**
     * @description:  看事件记录详情弹窗
     * @param {无}
     * @return: 无
     */
    eventRecordHandleClick(row) {
      this.eventRecordDialogVisible = true
      this.eventRecordForm = JSON.parse(JSON.stringify(row))
    },
    /**
     * @description:  事件记录详情关闭按钮
     * @param {无}
     * @return: 无
     */
    eventRecordhandleClose() {
      this.eventRecordDialogVisible = false
    },
    /**
     * @description:  事件记录详情打印
     * @param {无}
     * @return: 无
     */
    shiftInfoEventRecordPrint() {
      printJS({
        printable: 'printJS-info',
        type: 'html',
        targetStyles: ['*']
      })
    },
    /**
     * @description:  检查记录详情查看
     * @param {无}
     * @return: 无
     */
    checkLogClick(row) {
      this.checkRecordScreenshotDialogVisible = true
    },
    /**
     * @description:  关闭检查记录截图弹窗
     * @param {无}
     * @return: 无
     */
    checkRecordScreenshotHandleClose() {
      this.checkRecordScreenshotDialogVisible = false
    },
    /**
     * @description:  拒绝接班按钮
     * @param {无}
     * @return: 无
     */
    refuseShift() {
      this.$confirm('确认拒绝交接班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.userOut()
        // this.removeUserInfo()
        this.refuseofferApiFuc()
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    refuseofferApiFuc() {
      let param = {
        id: this.id,
        refuseReason: ''
      }
      refuseofferApi(param).then(res => {
        console.log(res)
      })
    },
    /**
     * @description:   接班按钮
     * @param {无}
     * @return: 无
     */
    acceptShift() {
      this.SET_DUTY_STATUS(false)
      this.SET_KEY_CONCERNS_SHOW(false)
      // let param = {
      //   officeTime: String(new Date().getTime()),
      //   noticeInfo: ''
      // }
      // startDutyApi(param).then(res => {
      //   console.log(res)
      // })
      let param = {
        id: this.id
      }
      confirmofferApi(param).then(res => {
        console.log(res)
      })
      this.$emit('dutyStart')
    },
    // 展开列表
    expandTable(tableName) {
      if (tableName === 'trouble') {
        this.expandTroubleTableStatus = !this.expandTroubleTableStatus
        this.tableTitleHeight()
        if (this.expandTroubleTableStatus) {
          this.troubleTableHeight = ''
        } else {
          this.troubleTableHeight = 220
        }
      } else if (tableName === 'checkLog') {
        this.expandCheckLogTableStatus = !this.expandCheckLogTableStatus
        this.tableTitleHeight()
        if (this.expandCheckLogTableStatus) {
          this.checkLogTableHeight = ''
        } else {
          this.checkLogTableHeight = 216
        }
      } else {
        this.expandEventRecordTableStatus = !this.expandEventRecordTableStatus
        this.tableTitleHeight()
        if (this.expandEventRecordTableStatus) {
          this.eventRecordTableHeight = ''
        } else {
          this.eventRecordTableHeight = 225
        }
      }
    },
    tableTitleHeight() {
      this.$nextTick(() => {
        this.eventRecordTitleHeight = this.$refs.tableBox.offsetHeight + 30
        this.troubleTitleHeight = this.$refs.tableBox1.offsetHeight + 20
        this.checkLogTitleHeight = this.$refs.tableBox2.offsetHeight + 75
        console.log(this.$refs.tableBox1.offsetHeight)
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.tableTitleHeight)
    this.$nextTick(() => {
      this.tableTitleHeight()
    })
  }
}
</script>

<style scoped  lang="less">
  .dutyManagementUser{
    display: flex;
    flex: auto;
    flex-direction: row;
    padding-top: 20px;
    min-width: 1400px;
    .location{
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
    .main {
      width: 100%;
      height: 100%;
      .main-left {
        .content-item{
          padding: 0 3px 3px 30px;
          .dutyInfo {
          font-size: 14px;
          color: #fff;
          background-color:rgba(45, 114, 211, 1);
        }
        }
      }
    }
    .el-form-item {
      margin-bottom: 4px;
    }
    /deep/.el-dialog__header {
      padding: 5px 20px 5px;
      background:rgba(242, 242, 242, 1);
    }
    /deep/.el-dialog__headerbtn {
        top: 10px;
      }
    .check-form /deep/.el-input {
      width: 187px!important;
    }
    .shiftBtn {
      width: 100%;
      padding: 40px 0;
      div {
        width: 300px;
        margin: 0 auto;
      }
    }
    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
.event-form /deep/.el-input {
  width: 264px;
}
</style>
