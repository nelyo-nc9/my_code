<template>
  <div class="content">
    <div class="content-left">
        <el-menu :default-active="defaultMenu" class="el-menu-vertical-demo" :unique-opened="false" @select="changeTab">
          <template v-for="item in menus">
            <el-submenu v-if="item.items" :index="item.index" :key="item.index">
              <template>
                <span slot="title">{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="val in item.items">
                  <el-menu-item v-if="!val.items" :key="val.index" :index="val.index">{{val.title}}</el-menu-item>
                  <el-submenu v-else :key="val.index" :index="val.index">
                    <template>
                      <span slot="title">{{val.title}}</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item v-for="v in val.items" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </template>
        </el-menu>
    </div>
    <div :span="20" class="content-right">
        <div class="duty-status-table" v-if="defaultMenu === 'dutyStatus'">
          <div class="directory">
            <div class="directory-item">
              <span class="el-icon-location-outline"></span>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>值班管理</el-breadcrumb-item>
              <el-breadcrumb-item>值班状态</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <p>值班状态列表</p>
          <div  style="margin-left:10px;height:100%;">
            <el-table :data="dutyStatusTableData" height="690" max-height="690" stripe border highlight-current-row style="width: 100%"></el-table-column>
              <el-table-column type="index" label="序号" width="" align="center"></el-table-column>
              <el-table-column prop="userName" label="值班员姓名" width="" align="center"></el-table-column>
              <el-table-column prop="userPhone" label="联系电话" width="" align="center"></el-table-column>
              <el-table-column prop="officeTime" label="接班时间" width="" align="center"></el-table-column>
              <el-table-column prop="alarmEvent" label="报警事件" width="" align="center"></el-table-column>
              <el-table-column prop="failureRecord" label="故障报修" width="" align="center"></el-table-column>
              <el-table-column prop="inspectionRecord" label="检查记录" width="" align="center"></el-table-column>
              <el-table-column prop="eventRecord" label="事件记录" width="" align="center"></el-table-column>
              <el-table-column prop="status" label="登录状态" width="" align="center"></el-table-column>
            </el-table>
            <div class="main-footer">
              <VideoPagination ref="listPagination"
              :total="dutyStatusTotal"
              @paginationConfChange="paginationConfChange"></VideoPagination>
            </div>
          </div>
        </div>
        <div class="duty-content-management-table" v-if="defaultMenu === 'dutyContentManagement'">
          <div class="directory">
            <div class="directory-item">
              <span class="el-icon-location-outline"></span>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>值班管理</el-breadcrumb-item>
              <el-breadcrumb-item>值班内容管理</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <p>值班内容管理</p>
          <div style="margin-left:130px;">
            <div class="dutyInfo">
              <i class="eventItem"></i>
              <span>报警事件<i style="color: rgba(45, 114, 211, 1);" :class="alarmEventStatus ? 'el-icon-lock' : 'el-icon-unlock'" class="alarm-event-status" @click="lockAlarmEvent"></i></span>
            </div>
            <el-table empty-text=" "  height="40" style="width: 100%"></el-table-column>
              <el-table-column type="index" label="序号" width="" align="center"></el-table-column>
              <el-table-column prop="eventNum" label="事件总数" width="" align="center"></el-table-column>
              <el-table-column prop="handled" label="已处理" width="" align="center"></el-table-column>
              <el-table-column prop="unprocessed" label="未处理" width="" align="center"></el-table-column>
              <el-table-column prop="levelOneEvent" label="1级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelTwoEvent" label="2级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelThreeEvent" label="3级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelFourEvent" label="4级事件" width="" align="center"></el-table-column>
              <el-table-column prop="levelFiveEvent" label="5级事件" width="" align="center"></el-table-column>
            </el-table>
          </div>
          <div style="margin:30px 0 0 130px;">
            <div class="dutyInfo">
              <i class="eventItem"></i>
              <span>故障报修<i style="color: rgba(45, 114, 211, 1);" :class="troubleStatus ? 'el-icon-lock' : 'el-icon-unlock'" class="alarm-event-status" @click="lockTroubleTable"></i></span>
            </div>
            <el-table empty-text=" "  height="40" style="width: 100%"></el-table-column>
              <el-table-column type="index" label="序号" width="" align="center"></el-table-column>
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
          <div style="margin:30px 0 0 130px;">
            <div class="dutyInfo">
              <i class="eventItem"></i>
              <span>检查记录<i style="color: rgba(45, 114, 211, 1);" :class="checkLogStatus ? 'el-icon-lock' : 'el-icon-unlock'" class="alarm-event-status" @click="lockCheckLogTable"></i></span>
            </div>
          <div style="margin-top:5px;display: flex;">
          <div style="width:75%;">
            今日检查记录
            <hr style="color:#ccc;position:relative;top:-8px;left:85px;width:90%">
          </div>
          <div style="width:25%;">
            <span>记录处理</span>
            <hr style="color:#ccc;position:relative;top:-8px;right:-65px;width:80%">
          </div>
          </div>
          </div>
          <div style="margin:30px 0 0 130px;">
            <div class="dutyInfo">
              <i class="eventItem"></i>
              <span>事件记录<i style="color: rgba(45, 114, 211, 1);" :class="eventLogStatus ? 'el-icon-lock' : 'el-icon-unlock'" class="alarm-event-status" @click="lockEventLogTable"></i></span>
            </div>
            <el-table empty-text=" "  height="40" style="width: 100%"></el-table-column>
              <el-table-column type="index" label="序号" width="" align="center"></el-table-column>
              <el-table-column prop="recordContents" label="发起人" width="" align="center"></el-table-column>
              <el-table-column prop="chronicler" label="资源信息" width="" align="center"></el-table-column>
              <el-table-column prop="recordTime" label="位置信息" width="" align="center"></el-table-column>
              <el-table-column prop="recordTime" label="事件类型" width="" align="center"></el-table-column>
              <el-table-column prop="recordTime" label="事件描述" width="" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="event-log-table" v-if="defaultMenu === 'checkLogList'">
          <checkLogTable ref="checkLogTable"></checkLogTable>
        </div>
        <div class="event-log-check" v-if="defaultMenu === 'checkLogSearch'">
          <div class="directory">
            <div class="directory-item">
              <span class="el-icon-location-outline"></span>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>值班管理</el-breadcrumb-item>
              <el-breadcrumb-item>检查记录</el-breadcrumb-item>
              <el-breadcrumb-item>查询</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div style="padding-top:30px;">
              <!-- 检查记录搜索组件 -->
              <div>
                <checkLogSearch ref="checkLogSearch" ></checkLogSearch>
              </div>
            </div>
          </div>
        </div>
        <div class="event-log-table" v-if="defaultMenu === 'eventLogList'">
          <eventLogTable ref="eventLogTable" ></eventLogTable>
        </div>
        <div class="event-log-check" v-if="defaultMenu === 'eventLogSearch'">
          <div class="directory">
            <div class="directory-item">
              <span class="el-icon-location-outline"></span>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>值班管理</el-breadcrumb-item>
              <el-breadcrumb-item>事件记录</el-breadcrumb-item>
              <el-breadcrumb-item>查询</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <div style="padding-top:20px;">
            <!-- 事件记录查询组件 -->
            <div>
              <eventLogSearch></eventLogSearch>
            </div>
          </div>
        </div>
        <div class="event-log-check" v-if="defaultMenu === 'shiftLogList'">
          <!-- 交接班信息/日志表组件 -->
          <shiftLogTable ref="shiftLogTable"></shiftLogTable>
        </div>
        <div class="shift-log-check" v-if="defaultMenu === 'shiftLogSearch'">
          <div class="directory">
            <div class="directory-item">
              <span class="el-icon-location-outline"></span>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>值班管理</el-breadcrumb-item>
              <el-breadcrumb-item>交接班日志</el-breadcrumb-item>
              <el-breadcrumb-item>查询</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <div style="margin-top:20px;">
            <div>
              <shiftLogSearch ref="shiftLogSearch"></shiftLogSearch>
            </div>
          </div>
        </div>
        <!-- 检查记录详情弹框 -->
        <checkLogModel   ref="checkLogModel"></checkLogModel>
    </div>
  </div>
</template>

<script>
import { getDutysetupApi, putDutysetupApi, getDutyStatuslistApi } from '@src/http/dutyManagement/dutyManagement.api'
import VideoPagination from '../../videoManage/components/VideoPagination'
import checkLogSearch from './pages/checkLogSearch'
import checkLogModel from './pages/checkLogModel'
import eventLogSearch from './pages/eventLogSearch'
import shiftLogSearch from './pages/shiftLogSearch'
import checkLogTable from './pages/checkLogTable'
import eventLogTable from './pages/eventLogTable'
import shiftLogTable from './pages/shiftLogTable'
export default {
  components: {
    checkLogSearch,
    checkLogModel,
    eventLogSearch,
    shiftLogSearch,
    checkLogTable,
    eventLogTable,
    shiftLogTable,
    VideoPagination
  },
  data() {
    return {
      // 默认导航栏
      defaultMenu: 'dutyStatus',
      menus: [
        {
          index: 'dutyManagement',
          label: '值班管理',
          items: [
            {
              index: 'dutyStatus',
              title: '值班状态'
            },
            {
              index: 'dutyContentManagement',
              title: '值班内容管理'
            },
            {
              index: 'checkLog',
              title: '检查记录',
              items: [
                {
                  index: 'checkLogList',
                  title: '列表'
                },
                {
                  index: 'checkLogSearch',
                  title: '查询'
                }
              ]
            },
            {
              index: 'eventLog',
              title: '事件记录',
              items: [
                {
                  index: 'eventLogList',
                  title: '列表'
                },
                {
                  index: 'eventLogSearch',
                  title: '查询'
                }
              ]
            },
            {
              index: 'shiftLog',
              title: '交接班日志',
              items: [
                {
                  index: 'shiftLogList',
                  title: '列表'
                },
                {
                  index: 'shiftLogSearch',
                  title: '查询'
                }
              ]
            }
          ]
        }
      ],
      // 值班状态列表数据
      dutyStatusTableData: [
      ],
      // 检查记录弹窗表单数据
      recordProcessingForm: {
        dutyOfficer: '',
        checkType: 1,
        checkProjects: 1,
        contentDescription: '',
        fillingUnit: '',
        fillingTime: ''
      },
      // 报警事件列表是否锁定
      alarmEventStatus: false,
      // 报警事件列表是否锁定
      troubleStatus: false,
      checkLogStatus: false,
      // 事件记录列表是否锁定
      eventLogStatus: false,
      // 检查记录查看详情弹窗
      checkLogDialogVisible: false,
      // 检查记录-图片详情弹窗
      checkLogScreenshotDialogVisible: false,
      dutyStatusTotal: 0,
      paginationConfig: {
        limit: 100,
        page: 1
      },
      id: ''
    }
  },
  watch: {},
  computed: {
  },
  created() {
    this.getDutyStatuslistApiFuc()
  },
  mounted() {},
  methods: {
    // 获取值班内容管理状态
    getDutysetupApiFuc() {
      let param = {
        orgId: '45'
      }
      getDutysetupApi(param).then(res => {
        console.log(res, '------值班内容管理状态')
        if (res.data.code === 0) {
          this.eventLogStatus = res.data.data.content.eventEnable === 2
          this.alarmEventStatus = res.data.data.alarmEnable === 2
          // this.troubleStatus = res.data.data.failureRecord === 2
          this.checkLogStatus = res.data.data.checkEnable === 2
          this.id = res.data.data.id
        } else {
          this.$messageError('获取值班内容管理状态失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 设置值班内容管理状态
    putDutysetupApiFuc() {
      let param = {
        orgName: '',
        orgId: '45',
        alarmEnable: this.alarmEventStatus ? 2 : 1,
        faultEnable: this.troubleStatus ? 2 : 1,
        eventEnable: this.eventLogStatus ? 2 : 1,
        checkEnable: this.checkLogStatus ? 2 : 1
      }
      putDutysetupApi(param).then(res => {
        console.log(res, '-----设置值班内容管理状态')
        if (res.data.code === 0) {
          this.getDutysetupApiFuc()
        } else {
          this.$messageError(res.data.message)
          this.getDutysetupApiFuc()
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取值班状态列表
    getDutyStatuslistApiFuc() {
      let param = {
        orgId: '45'
      }
      this.dutyStatusTableData = []
      getDutyStatuslistApi(param).then(res => {
        if (res.data.code === 0) {
          // this.dutyStatusTotal = res.data.page.total
          res.data.data.results.forEach((it, i) => {
            this.dutyStatusTableData.push(it.duty)
            this.dutyStatusTableData[i].id = it.id
          })
          this.dutyStatusTableData = this.handleData(this.dutyStatusTableData)
        } else {
          this.$messageError(res.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 表格数据格式化
    handleData(data) {
      let arr = JSON.parse(JSON.stringify(data))
      arr.forEach((item, index) => {
        if (item.status === 1) {
          item.status = '值班中'
        } else if (item.status === 2) {
          item.status = '挂起'
        } else if (item.status === 3) {
          item.status = '交班'
        }
      })
      return arr
    },
    changeTab(index) {
      this.defaultMenu = index
      if (index === 'dutyContentManagement') {
        this.getDutysetupApiFuc()
      } else if (index === 'dutyStatus') {
        this.getDutyStatuslistApiFuc()
      }
    },
    // 导出
    exportFile(type) {
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getDutyStatuslistApiFuc()
    },
    /**
     * @description:  检查记录查询按钮
     * @param {path}
     * @return: 无
     */
    getCheckLog() {
    },
    /**
     * @description:  报警事件列表点击锁定
     * @param {无}
     * @return: 无
     */
    lockAlarmEvent() {
      this.alarmEventStatus = !this.alarmEventStatus
      this.putDutysetupApiFuc()
    },
    /**
     * @description:  故障报修列表点击锁定
     * @param {无}
     * @return: 无
     */
    lockTroubleTable() {
      this.troubleStatus = !this.troubleStatus
      this.putDutysetupApiFuc()
    },
    /**
     * @description:  事件记录列表点击锁定
     * @param {无}
     * @return: 无
     */
    lockEventLogTable() {
      this.eventLogStatus = !this.eventLogStatus
      this.putDutysetupApiFuc()
    },
    /**
     * @description:  检查记录列表点击锁定
     * @param {无}
     * @return: 无
     */
    lockCheckLogTable() {
      this.checkLogStatus = !this.checkLogStatus
      this.putDutysetupApiFuc()
    },
    /**
     * @description:  检查记录列表查询确定按钮
     * @param {无}
     * @return: 无
     */
    onSubmit() {
      console.log(123)
    },
    /**
     * @description:  事件记录右上角关闭按钮
     * @param {无}
     * @return: 无
     */
    deleteEventRecordHandleClose() {
      this.deleteEventRecordDialogVisible = false
    },
    /**
     * @description:  检查记录弹窗右上角关闭按钮
     * @param {无}
     * @return: 无
     */
    checkLogHandleClose() {
      this.checkLogDialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../assets/elementModify.less';
.content {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px 20px 20px 0;
  justify-content: flex-start;
  .content-left {
    height: 100%;
    padding: 10px 20px 0 10px;
    .el-menu-vertical-demo {
      width: 220px;
    }
    /deep/ .el-menu {
      border-right: none;
      background-color: transparent;
    }
    /deep/ .el-menu-item-group__title {
      padding: 0;
    }
   }
  .content-right{
    width: 87%;
    min-width: 1000px;
    height: 100%;
    display: flex;
    flex: 1;
    margin-left: 20px;
    flex-direction: column;
    justify-content: ;
    p {
      text-align: center;
      padding: 25px 0;
      font-size: 16px;
    }
    .main-footer {
      height: 40px;
      width: 500px;
      margin: 0 auto;
      // display: flex;
      // justify-content: center;
      // align-items: flex-end;
    }
    .alarm-event-status {
      font-size: 16px;
      margin-left: 2px;
      cursor: pointer;
    }
    .directory {
      overflow: hidden;
      margin-top: 10px;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .dutyInfo {
      height: 23px;
      line-height: 23px;
      font-size: 14px;
      margin-bottom:10px;
        span {
          position: relative;
          top: -5px;
          left: 0;
        }
      }
    .eventItem {
      display: inline-block;
      width: 6px;
      height: 23px;
      background: rgba(45, 114, 211, 1);
    }
  }
  /deep/.el-menu-item {
  padding: 0 10px;
  }
  /deep/.el-button--medium {
    min-width: 35px;
  }
}
</style>
