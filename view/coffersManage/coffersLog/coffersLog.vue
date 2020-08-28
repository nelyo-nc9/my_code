<!--
 * @Author: @_@
 * @Date: 2020-05-29 16:00:41
 * @LastEditTime: 2020-08-25 10:17:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\coffersManage\coffersLog\coffersLog.vue
-->

<template>
  <div class="coffers-log-container">
    <div class="breadcrumb-container">
      <!-- <span class="icon-style"><i class="iconfont icon-Location"></i></span> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金库远程管理</el-breadcrumb-item>
        <el-breadcrumb-item>金库日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabs-container">
      <el-tabs type="border-card" v-model="tabsActiveName" @tab-click="tabsHandleClick">
        <el-tab-pane label="事件日志" name="event"></el-tab-pane>
        <el-tab-pane label="操作日志" name="operation"></el-tab-pane>
      </el-tabs>
      <div class="shrink-container">
        <div :class="showSearchBox ? 'iconfont icon-arrow-down shrink-div' : 'iconfont icon-arrow-up shrink-div'" @click="showSearchBox = !showSearchBox"></div>
      </div>
    </div>
    <el-collapse-transition>
      <div class="search-container" v-show="showSearchBox">
          <div class="search-box">
            <!-- 事件查询框 -->
            <div class="search-border" v-if="tabsActiveName === 'event'">
              <el-form label-position="right" label-width="100px" :model="eventLogForm" :rules="eventFormRules" key="eventLogForm" ref="eventLogForm">
                <div class="form-item-div">
                  <el-form-item label="机构" prop="orgName">
                    <el-autocomplete class="inline-input" v-model="eventLogForm.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="事件类型" prop="eventTypeSelected">
                    <el-select v-model="eventLogForm.eventTypeSelected" placeholder="请选择">
                      <el-option
                        v-for="item in eventTypeSelectData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="重点部位" prop="keySiteName">
                    <el-autocomplete class="inline-input" v-model="eventLogForm.keySiteName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="用户" prop="userInp">
                    <el-input v-model="eventLogForm.userInp"></el-input>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="门禁设备" prop="deviceInp">
                    <el-input v-model="eventLogForm.deviceInp"></el-input>
                  </el-form-item>
                  <el-form-item label="IP地址" prop="ipAddrInp">
                    <el-input v-model="eventLogForm.ipAddrInp"></el-input>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="门禁通道" prop="channelInp">
                    <el-input v-model="eventLogForm.channelInp"></el-input>
                  </el-form-item>

                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                          v-model="eventLogForm.startTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="对讲面板" prop="talkbackInp">
                    <el-input v-model="eventLogForm.talkbackInp"></el-input>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                          v-model="eventLogForm.endTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-form>
            </div>

            <!-- 操作查询框 -->
            <div class="search-border" v-else>
              <el-form label-position="right" label-width="100px" :model="operationForm" :rules="operationFormRules" key="operationForm"  ref="operationForm">
                <div class="form-item-div">
                  <el-form-item label="姓名" prop="nameInp">
                    <el-input v-model="operationForm.nameInp"></el-input>
                  </el-form-item>
                  <el-form-item label="操作类型" prop="operationTypeSelected">
                    <el-select v-model="operationForm.operationTypeSelected" placeholder="请选择">
                      <el-option
                        v-for="item in operationTypeSelectData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="用户" prop="userInp">
                    <el-input v-model="operationForm.userInp"></el-input>
                  </el-form-item>
                  <el-form-item label="操作对象" prop="operationObjInp">
                    <el-input v-model="operationForm.operationObjInp"></el-input>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-autocomplete class="inline-input" v-model="operationForm.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="操作描述" prop="operationDesInp">
                    <el-input v-model="operationForm.operationDesInp"></el-input>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="客户端类型" prop="eventTypeSelected">
                    <el-select v-model="operationForm.clientTypeSelected" placeholder="请选择">
                      <el-option
                        v-for="item in clientTypeSelectData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                          v-model="operationForm.startTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="form-item-div">
                  <el-form-item label="IP地址" prop="ipAddrInp">
                    <el-input v-model="operationForm.ipAddrInp"></el-input>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                          v-model="operationForm.endTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <div class="button-container">
            <div class="button-box">
              <el-button type="primary" size="medium" @click="queryBtnClickHandler">查询</el-button>
              <el-button size="medium" @click="resetBtnClickHandler">重置</el-button>
              <el-button size="medium" @click="exportBtnClickHandler">导出</el-button>
            </div>
          </div>
      </div>
    </el-collapse-transition>

    <!-- 事件日志表格 -->
    <div class="table-container" v-if="tabsActiveName === 'event'">
      <el-table
        :data="coffersLogTableData"
        stripe
        height="100%"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          v-for="(column, index) in eventColumns" :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="iconfont-ccb ccbshebeiguijihuifang" @click="playbackBtnHandle(scope.$index, scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 操作日志表格 -->
    <div class="table-container" v-else>
      <el-table
        :data="operationLogTableData"
        stripe
        height="100%"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          v-for="(column, index) in operColumns" :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          show-overflow-tooltip
          align="center">
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-box">
      <CoffersPagination ref="listPagination" :total="total" @paginationConfChange="paginationConfChange"></CoffersPagination>
    </div>

    <!-- 回放组件 -->
    <PlaybackVideo v-if="showPlaybackVideoModal" :showPlaybackVideo="showPlaybackVideoModal" :playbackParams="playbackParams" @closePlayback="closeSubDialog"></PlaybackVideo>
  </div>
</template>

<script>
import PlaybackVideo from '../components/PlaybackVideoModal'
import CoffersPagination from '../components/CoffersPagination'
import { queryCoffersLogApi, getSearchOrgApi } from '@src/http/coffersManage/coffersLog.api.js'
import common from '../components/common'

export default {
  name: 'coffersLog1',
  mixins: [common],
  components: {
    PlaybackVideo,
    CoffersPagination
  },
  data() {
    const inputLengthValidator = (rule, value, callback) => {
      if (value && value.length) {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          value.charCodeAt(i) > 255 ? len += 2 : len++
        }
        return len > 128 ? callback(new Error('不能超过128个字符或64个汉字')) : callback()
      } else {
        return callback()
      }
    }
    const ipAddrValidator = (rule, value, callback) => {
      if (value && value.length) {
        return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value) ? callback() : callback(new Error('请输入正确格式的IP地址'))
      } else {
        return callback()
      }
    }

    return {
      showSearchBox: true, // 搜索输入框显隐性
      tabsActiveName: 'event', // 选项卡当前选中项
      visible: false,
      // treeType: 3, // 0: 机构-重点部位-设备-资源树、1: 机构-重点部位-设备树、2: 机构-重点部位树、3: 机构树
      rootId: '',
      channelSelected: 'all', // 门禁通道下拉框选中项
      talkbackSelected: 'all', // 对讲面板下拉框选中项
      operationTypeSelectData: [ // 操作类型下拉框数据
        { value: 'all', label: '全部' },
        { value: '远程开门', label: '远程开门' },
        { value: '布防操作', label: '布防操作' },
        { value: '撤防操作', label: '撤防操作' },
        { value: '报警输出', label: '报警输出' },
        { value: '一键报警', label: '一键报警' },
        { value: '拒绝开门', label: '拒绝开门' },
        { value: '截图', label: '截图' },
        { value: '录像', label: '录像' },
        { value: '检查记录', label: '检查记录' },
        { value: '事件回放', label: '事件回放' },
        { value: '对讲开启', label: '对讲开启' },
        { value: '对讲挂断', label: '对讲挂断' },
        { value: '值班组管理', label: '值班组管理' },
        { value: '金库授权', label: '金库授权' },
        { value: '信息采集', label: '信息采集' },
        // { value: '日志查询', label: '日志查询' },
        { value: '日志导出', label: '日志导出' }
      ],
      eventTypeSelectData: [ // 事件类型下拉框数据
        { value: 'all', label: '全部' },
        { value: '对讲事件', label: '对讲事件' },
        { value: '刷卡事件', label: '刷卡事件' },
        { value: '开门事件', label: '开门事件' }
      ],
      // eventTypeSelected: 'all', // 事件类型下拉框选中项
      clientTypeSelectData: [
        { value: 'all', label: '全部' },
        { value: 'B/S', label: 'B/S' },
        { value: 'APP', label: 'APP' }
      ],

      eventLogForm: { // 事件日志表单
        orgName: '',
        keySiteName: '',
        deviceInp: '',
        channelInp: '',
        talkbackInp: '',
        eventTypeSelected: 'all',
        userInp: '',
        ipAddrInp: '',
        startTime: '',
        endTime: ''
      },
      eventFormRules: {
        orgName: [{ validator: inputLengthValidator, trigger: 'blur' }],
        keySiteName: [{ validator: inputLengthValidator, trigger: 'blur' }],
        deviceInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        channelInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        talkbackInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        // eventTypeSelected: '',
        userInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        ipAddrInp: [{ validator: ipAddrValidator, trigger: 'blur' }]
        // startTime: '',
        // endTime: ''
      },
      operationForm: { // 操作日志表单
        nameInp: '',
        ipAddrInp: '',
        userInp: '',
        operationTypeSelected: 'all',
        orgName: '',
        operationObjInp: '',
        clientTypeSelected: 'all',
        operationDesInp: '',
        startTime: '',
        endTime: ''
      },
      operationFormRules: {
        nameInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        ipAddrInp: [{ validator: ipAddrValidator, trigger: 'blur' }],
        userInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        // operationTypeSelected: '',
        orgName: [{ validator: inputLengthValidator, trigger: 'blur' }],
        operationObjInp: [{ validator: inputLengthValidator, trigger: 'blur' }],
        // clientTypeSelected: '',
        operationDesInp: [{ validator: inputLengthValidator, trigger: 'blur' }]
        // startTime: '',
        // endTime: ''
      },

      eventColumns: [
        {prop: 'organize', label: '所属机构', width: ''},
        {prop: 'keySite', label: '所属重点部位', width: ''},
        {prop: 'device', label: '门禁设备', width: ''},
        {prop: 'channel', label: '门禁通道', width: ''},
        {prop: 'talkback', label: '对讲面板', width: ''},
        {prop: 'operation', label: '事件类型', width: ''},
        {prop: 'ipAddr', label: 'IP', width: ''},
        {prop: 'user', label: '用户', width: ''},
        {prop: 'time', label: '时间', width: ''}
      ],
      coffersLogTableData: [], // 事件表格数据
      operColumns: [
        {prop: 'name', label: '姓名', width: ''},
        {prop: 'user', label: '用户名', width: ''},
        {prop: 'time', label: '时间', width: ''},
        {prop: 'organize', label: '所属机构', width: ''},
        {prop: 'clientType', label: '客户端类型', width: ''},
        {prop: 'ipAddr', label: 'IP地址', width: ''},
        {prop: 'operation', label: '操作类型', width: ''},
        {prop: 'action', label: '动作', width: ''},
        {prop: 'operObj', label: '操作对象', width: ''},
        {prop: 'operRes', label: '操作结果', width: ''},
        {prop: 'operDes', label: '操作描述', width: ''}
      ],
      operationLogTableData: [], // 操作表格数据
      multipleSelection: [], // 表格数据选中项
      showPlaybackVideoModal: false, // 显示视频回放对话框
      total: 0,
      paginationConfig: {},

      playbackParams: {} // 回放组件传参
    }
  },
  created() {
    this.resetBtnClickHandler()
    this.getTableDataFun()
  },
  methods: {
    /**
     * @description: 选项卡切换事件
     * @param {type} 无
     * @return: 无
     */
    tabsHandleClick() {
      this.resetBtnClickHandler()
      this.getTableDataFun()
    },
    /**
     * @description: 查询按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    queryBtnClickHandler() {
      this.paginationConfig.currentPage = 1
      this.paginationConfig.pageSize = 25
      this.$refs.listPagination.setPaginationConfig(this.paginationConfig)

      this.$refs[this.tabsActiveName === 'event' ? 'eventLogForm' : 'operationForm'].validate((valid) => {
        if (valid) {
          this.getTableDataFun(true)
        } else {
          return false
        }
      })
    },
    /**
     * @description: 获取查询参数
     * @param {type} 无
     * @return: 调用查询和导出接口所需要的查询条件参数
     */
    getQueryParams() {
      let params = {
        conditions: [
          {'key': 'type', 'value': this.tabsActiveName === 'event' ? 'event' : 'operation', 'operator': 1}
        ]
      }

      // 拼接事件日志查询参数
      if (this.tabsActiveName === 'event') {
        let { orgName, keySiteName, deviceInp, channelInp, talkbackInp, eventTypeSelected, userInp, ipAddrInp, startTime, endTime } = {...this.eventLogForm}
        if (orgName !== '') {
          params.conditions.push({'key': 'mechanism', 'value': orgName, 'operator': 1})
        }
        if (keySiteName !== '') {
          params.conditions.push({'key': 'keyPart', 'value': keySiteName, 'operator': 4})
        }
        if (deviceInp !== '') {
          params.conditions.push({'key': 'accessEquipment', 'value': deviceInp, 'operator': 1})
        }
        if (channelInp !== '') {
          params.conditions.push({'key': 'access', 'value': channelInp, 'operator': 1})
        }
        if (talkbackInp !== '') {
          params.conditions.push({'key': 'intercomPanel', 'value': talkbackInp, 'operator': 1})
        }
        if (eventTypeSelected !== 'all') {
          params.conditions.push({'key': 'eventType', 'value': eventTypeSelected, 'operator': 1})
        }
        if (userInp !== '') {
          params.conditions.push({'key': 'userName', 'value': userInp, 'operator': 4})
        }
        if (ipAddrInp !== '') {
          params.conditions.push({'key': 'ipAddr', 'value': ipAddrInp, 'operator': 1})
        }
        if (startTime !== '' && startTime !== null) {
          params.conditions.push({'key': 'time', 'value': startTime, 'operator': 0})
        }
        if (endTime !== '' && endTime !== null) {
          if (startTime !== '' && startTime !== null && this.$moment(endTime).valueOf() - this.$moment(startTime).valueOf() <= 0) {
            this.$messageError('结束时间不能小于开始时间', '错误')
            return
          }
          params.conditions.push({'key': 'time', 'value': endTime, 'operator': 2})
        }
      }

      // 拼接操作日志查询参数
      if (this.tabsActiveName === 'operation') {
        let {nameInp, ipAddrInp, userInp, operationTypeSelected, orgName, operationObjInp, clientTypeSelected, operationDesInp, startTime, endTime} = {...this.operationForm}
        if (nameInp !== '') {
          params.conditions.push({'key': 'name', 'value': nameInp, 'operator': 1})
        }
        if (ipAddrInp !== '') {
          params.conditions.push({'key': 'ipAddr', 'value': ipAddrInp, 'operator': 1})
        }
        if (userInp !== '') {
          params.conditions.push({'key': 'userName', 'value': userInp, 'operator': 4})
        }
        if (operationTypeSelected !== 'all') {
          params.conditions.push({'key': 'operationType', 'value': operationTypeSelected, 'operator': 1})
        }
        if (orgName !== '') {
          params.conditions.push({'key': 'mechanism', 'value': orgName, 'operator': 1})
        }
        if (operationObjInp !== '') {
          params.conditions.push({'key': 'operObject', 'value': operationObjInp, 'operator': 1})
        }
        if (clientTypeSelected !== 'all') {
          params.conditions.push({'key': 'clientType', 'value': clientTypeSelected, 'operator': 1})
        }
        if (operationDesInp !== '') {
          params.conditions.push({'key': 'description', 'value': operationDesInp, 'operator': 1})
        }
        if (startTime !== '' && startTime !== null) {
          params.conditions.push({'key': 'time', 'value': startTime, 'operator': 0})
        }
        if (endTime !== '' && endTime !== null) {
          if (startTime !== '' && startTime !== null && this.$moment(endTime).valueOf() - this.$moment(startTime).valueOf() <= 0) {
            this.$messageError('结束时间不能小于开始时间', '错误')
            return
          }
          params.conditions.push({'key': 'time', 'value': endTime, 'operator': 2})
        }
      }

      return params
    },
    /**
     * @description: 获取列表数据方法
     * @param {type} 无
     * @return: 无
     */
    async getTableDataFun(isQueryBtn) {
      try {
        let params = this.getQueryParams()
        params.page = {
          page: this.paginationConfig.currentPage || 1,
          pageSize: this.paginationConfig.pageSize || 25
        }

        let cofferLogData = await queryCoffersLogApi(params)
        cofferLogData = cofferLogData.data.data
        if (!cofferLogData.cofferLog) {
          this.$messageWarn('查询无数据！')
          this.coffersLogTableData = []
          this.operationLogTableData = []
          this.total = 0
          return
        }
        if (this.tabsActiveName === 'event') {
          this.coffersLogTableData = []
          cofferLogData.cofferLog.forEach(item => { // TODO待调测
            this.coffersLogTableData.push({
              organize: item.mechanism,
              keySite: item.keyPart,
              device: item.accessEquipment,
              channel: item.access,
              talkback: item.intercomPanel,
              // operation: item.type === 'event' ? item.eventType : item.operationType,
              operation: item.eventType,
              ipAddr: item.ipAddr,
              user: item.userName,
              time: item.time,
              index: item.index,
              id: item.id,
              video: item.video
            })
          })
        } else {
          this.operationLogTableData = []
          cofferLogData.cofferLog.forEach(item => {
            this.operationLogTableData.push({
              id: item.id,
              index: item.index,
              name: item.name,
              user: item.userName,
              time: item.time,
              organize: item.mechanism,
              clientType: item.clientType,
              ipAddr: item.ipAddr,
              operation: item.operationType,
              action: item.action,
              operObj: item.operObject,
              operRes: item.result,
              operDes: item.description
            })
          })
        }
        this.total = cofferLogData.page.totalNumber
      } catch (err) {
        console.log('获取参数失败', err)
      } finally {
        // if (isQueryBtn) {
        //   // 记录日志
        //   this.recordLogFun({
        //     OperationType: '日志查询',
        //     action: '查询', // 动作
        //     description: `${JSON.parse(window.sessionStorage.getItem('user')).name}查询金库日志` // 描述
        //   })
        // }
      }
    },
    /**
     * @description: 重置按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    resetBtnClickHandler() {
      this.eventLogForm = { // 事件日志表单
        orgName: '',
        keySiteName: '',
        deviceInp: '',
        channelInp: '',
        talkbackInp: '',
        eventTypeSelected: 'all',
        userInp: '',
        ipAddrInp: '',
        startTime: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      this.operationForm = { // 操作日志表单
        nameInp: '',
        ipAddrInp: '',
        userInp: '',
        operationTypeSelected: 'all',
        orgName: '',
        operationObjInp: '',
        clientTypeSelected: 'all',
        operationDesInp: '',
        startTime: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }

      this.$nextTick(() => {
        this.$refs[this.tabsActiveName === 'event' ? 'eventLogForm' : 'operationForm'].resetFields()
      })
    },
    /**
     * @description: 导出按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    exportBtnClickHandler() {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      let tHeader = []
      let filterVal = []
      if (this.tabsActiveName === 'event') {
        tHeader = ['所属机构', '所属重点部位', '门禁设备', '门禁通道', '对讲面板', '事件类型', 'IP', '用户', '时间']
        filterVal = ['organize', 'keySite', 'device', 'channel', 'talkback', 'operation', 'ipAddr', 'user', 'time']
      } else {
        tHeader = ['姓名', '用户名', '时间', '所属机构', '客户端类型', 'IP地址', '操作类型', '动作', '操作对象', '操作结果', '操作描述']
        filterVal = ['name', 'user', 'time', 'organize', 'clientType', 'ipAddr', 'operation', 'action', 'operObj', 'operRes', 'operDes']
      }
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        // operationLogTableData
        list = this.tabsActiveName === 'event' ? this.coffersLogTableData : this.operationLogTableData
      }
      const data = list.map(v => filterVal.map(j => v[j]))
      export_json_to_excel(tHeader, data, `${this.tabsActiveName === 'event' ? '金库事件' : '金库操作'}日志导出-${this.$moment().format('YYYYMMDDHHmmss')}`)

      // 记录日志
      this.recordLogFun({
        OperationType: '日志导出',
        action: '导出', // 动作
        description: `${JSON.parse(window.sessionStorage.getItem('user')).name}导出金库日志` // 描述
      })
    },
    /**
     * @description: 表格多选框变化事件
     * @param {type} 无
     * @return: 无
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description: 表格操作列回放按钮点击事件
     * @param {type} 点击行索引 点击行数据
     * @return:无
     */
    playbackBtnHandle(index, data) {
      let video = JSON.parse(data.video)
      if (!video.videoList || video.videoList.length === 0) {
        this.$messageError('没有录像段')
        video.videoList = [{channel: '', devIp: '', devPort: ''}]
        // return
      }
      this.playbackParams = {
        channel: video.videoList[0].channelNum,
        // dPort: 8000,
        devIp: video.videoList[0].ip,
        devPort: video.videoList[0].port,
        // startTime: 1596384000
        startTime: this.$moment(video.startTime).unix(),
        endTime: this.$moment(video.startTime).unix() + 1000
      }
      this.showPlaybackVideoModal = true
    },
    /**
     * @description: 关闭子组件
     * @param {type} 无
     * @return: 无
     */
    closeSubDialog() {
      this.showPlaybackVideoModal = false
    },
    /**
     * @description: 分页
     * @param {type} 无
     * @return: 无
     */
    paginationConfChange(obj) {
      console.log(obj)
      this.paginationConfig = obj
      this.getTableDataFun()
    },

    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        // oId: type === 'kp' ? this.options.oId : undefined
        oId: type === 'kp' ? this.rootId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.rootId = val.id
      } else if (type === 'kp') {
        this.keySiteSelected = val.name
      }
    }
  },
  watch: {
    rootId: {
      handler: 'rootIdChangeHandler'
    },
    showSearchBox(val) {
      // document.querySelector('.table-container').style.height = `calc(100% - ${val ? '412px' : '157px'})`
      if (val) {
        document.querySelector('.table-container').style.height = 'calc(100% - 402px)'
      } else {
        setTimeout(() => {
          document.querySelector('.table-container').style.height = 'calc(100% - 157px)'
        }, 300)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.coffers-log-container {
  width: 100%;
  height: 100%;

  // 面包屑导航样式
  .breadcrumb-container {
    padding: 10px 0 10px 20px;
    position: relative;
    .icon-style {
      left: 20px;
      line-height: 14px;
      position: absolute;
    }
  }

  .tabs-container {
    padding: 0 20px;
    position: relative;
    .el-tabs--border-card {
      background: #ffffff;
      border: 0px;
      box-shadow: 0 0 0 0 #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header {
      background-color: #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      &::after {
        content: '';
        display: block;
        width: 98px;
        height: 2px;
        background: #409eff;
        position: absolute;
        left: 0px;
        top: 0px;
      }
    }
    /deep/ .el-tabs__content {
      padding: 0;
    }
    .shrink-container {
      width: 46px;
      height: 36px;
      padding-left: 16px;
      position: absolute;
      top: 20px;
      right: 26px;
      background: #ffffff;
      .shrink-div {
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        font-size: 20px;
        border: 1px solid #9EADC1;
        border-radius: 2px;
        &:hover {
          border: 1px solid #3482F0;
        }
      }
    }
  }
  .search-container {
    padding: 0 20px;
    // 搜索输入框
    .search-box {
      width: 100%;
      height: 125px;
      padding: 0 20px;
      // background: #ffffff;
      background: #F8F8F8;
      .search-border {
        padding: 5px 0 0 5px;
        margin: 20px 0;

        /deep/ .el-form {
          display: flex;
          .form-item-div {
            width: 100%;
            padding: 0 20px;
            .el-form-item {
              margin: 10px 0 15px 0;
              .el-form-item__error {
                padding-top: 0px;
              }
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner,
            .el-autocomplete,
            .el-select {
              width: 100%;
            }
          }
        }

        // .search-row {
        //   width: 100%;
        //   margin: 15px 0;
        //   display: flex;
        //   .search-item {
        //     flex: 1;
        //     min-width: 300px;
        //     .search-label {
        //       width: 30%;
        //       min-width: 100px;
        //       font-size: 14px;
        //       line-height: 40px;
        //       text-align: center;
        //       display: inline-block;
        //       background: #F8F8F8;
        //     }
        //     .el-select,.el-input,.el-range-editor.el-input__inner,.el-autocomplete {
        //       width: 65%;
        //       min-width: 200px;
        //     }
        //   }
        // }
      }
    }
    // 按钮框
    .button-container {
      width: 100%;
      height: 60px;
      margin-top: 40px;
      .button-box {
        width: 360px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
      }
    }
  }

  // 表格
  .table-container {
    width: 100%;
    margin-top: 20px;
    height: calc(~"100% - 412px");
    padding: 0 20px;
    /deep/ .el-table__row {
      height: 40px;
      font-size: 14px;
    }
  }

  // 分页
  .pagination-box {
    width: 100%;
    height: 45px;
    padding-right: 20px;
  }
}
</style>
