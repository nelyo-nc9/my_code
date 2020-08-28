<template>
  <div class="container">
    <div class='topIScre'
         :class='{isAllScrell:isAllScrell}'>

      <div class="video-top">
        <div class="left-box">
          <preview-plugin ref="preview"
                          :isButton="false"
                          :topEndSlot='true'
                          :moduleType='2'
                          @alarmData='alarmDataFuc'
                          @changeDefaultPane="changeDefaultPane"
                          :defaultPane='checkedWmode'>
            <template v-slot:topEnd="{paneMark,paneMarkInfo}">
              <el-button @click="interComingFuc(paneMark,paneMarkInfo)"
                         size="mini"
                         style="height:24px;margin-right:5px;min-width:50px;line-height:10px;"
                         v-if='paneMarkInfo.source.detail&&paneMarkInfo.source.detail.talkRequest==="T"'>{{paneMarkInfo.source.detail&&paneMarkInfo.source.detail.phoneComing}}</el-button>
              <!-- <el-button @click="interOverFuc(paneMark,paneMarkInfo)"
                         size="mini"
                         style="height:24px;margin-right:5px;min-width:50px;line-height:10px;"
                         v-if='paneMarkInfo.source.detail&&paneMarkInfo.source.detail.talkRequest==="T"'>{{paneMarkInfo.source.detail&&paneMarkInfo.source.detail.phoneOver}}</el-button> -->
              <el-button @click="followFuc(paneMark,paneMarkInfo)"
                         size="mini"
                         v-if='paneMarkInfo.source.detail&&paneMarkInfo.source.detail.event_remind'
                         style="height:24px;margin-right:5px;min-width:50px;line-height:10px;"
                         :type="
                         paneMarkInfo.source.detail && paneMarkInfo.source.detail.event_remind === '关注'?'danger':'primary'">{{paneMarkInfo.source.detail&&paneMarkInfo.source.detail.event_remind}}
              </el-button>
              <el-button size="mini"
                         style="height:24px;margin-right:5px;min-width:50px;line-height:10px;"
                         v-if="paneMarkInfo.source.detail&&paneMarkInfo.source.detail.eventTypeName"
                         @click="followFuc(paneMark,paneMarkInfo)">
                {{paneMarkInfo.source.detail&&paneMarkInfo.source.detail.eventTypeName}}</el-button>
            </template>
            <template v-slot:bottomEnd="{paneMark,paneMarkInfo}">
              <el-button size="mini"
                         @click="DealFucFalse(paneMark,paneMarkInfo)"
                         style="height:24px;margin-right:5px;min-width:50px;">异常</el-button>
              <el-button size="mini"
                         @click="DealFucTrue(paneMark,paneMarkInfo)"
                         style="height:24px;margin-right:5px;min-width:50px;">正常</el-button>
            </template>
          </preview-plugin>
        </div>
        <div class="right-box"
             v-show='!isAllScrell'>
          <el-tabs type="border-card">
            <el-tab-pane label="部位详情">
              <div class="tabs-body">
                <div class="part-detail">
                  <div class="row-label">
                    <div class="label">所属机构</div>
                    <div class="label">重点部位名称</div>
                    <div class="label">重点部位地址</div>
                    <div class="label">重点部位电话</div>
                    <div class="label">重点部位负责人</div>
                    <div class="label">移动电话</div>

                    <div class="label">机构安保联系人</div>
                    <div class="label">移动电话</div>
                    <div class="label">属地派出所名称</div>
                    <div class="label">属地派出所电话</div>
                    <div class="label">辖区民警姓名</div>
                    <div class="label">移动电话</div>
                  </div>
                  <div class="row-value">
                    <div class="label">{{importantPart.orgId}}</div>
                    <div class="label">{{importantPart.name}}</div>
                    <div class="label">{{importantPart.address}}</div>
                    <div class="label">{{importantPart.telephone}}</div>
                    <div class="label">{{importantPart.principal1 }}</div>
                    <div class="label">{{importantPart.principalPhone1}}</div>

                    <div class="label">{{importantPart.principal5 }}</div>
                    <div class="label">{{importantPart.principalPhone5}}</div>
                    <div class="label">{{importantPart.policeStation }}</div>
                    <div class="label">{{importantPart.policeTelephone }}</div>
                    <div class="label">{{importantPart.police}}</div>
                    <div class="label">{{importantPart.policeMobilePhone }}</div>
                  </div>

                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="联动控制">
              <div class="tabs-body">
                <div class="link-modal"
                     v-for="(item,index) in linkData"
                     :key="index">
                  <div class="left-icon">
                    <span class="iconfont"
                          :class="item.icon"></span>
                  </div>
                  <div class="right-btns">
                    <div class="title">{{item.name}}</div>
                    <div class="btns">
                      <el-button size="mini"
                                 v-for="(btn, btnIndex) in item.btns"
                                 :key="btnIndex"
                                 :type="btn.type"
                                 @click="btn.callback(btn.params,index,btnIndex)">
                        {{btn.tit}}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="btns-middle">
        <div class="tips">
          <div class="tip">
            <span>已处理：</span>
            <span>{{Statistics_.dealCount}}</span>
          </div>
          <div class="tip">
            <span>未处理：</span>
            <span>{{Statistics_.nodealCount}}</span>
          </div>
          <div class="tip">
            <!--            <el-checkbox v-model="videoChecked">复选</el-checkbox>-->
          </div>
        </div>
        <div class="btns-box">
          <el-button size="mini"
                     @click="print_schedule"
                     :disabled="selectionTableData.length>1">查看关联视频</el-button>
          <el-button size="mini"
                     type="primary"
                     @click="batchDealFucTrue">批处理为异常</el-button>
          <el-button size="mini"
                     type="primary"
                     @click="batchDealFucFalse">批处理为正常</el-button>
        </div>
        <div class="stop">
          <el-button size="mini"
                     @click="stopResiveAlarm">
            <span class="icon iconfont-ccb"
                  v-show="!stopResiveStatas">&#xe75d;</span>
            <span class="iconfont"
                  style='font-size:14px;'
                  v-show="stopResiveStatas">&#xe64d;</span>
            <span v-show="stopResiveStatas">暂停</span>
            <span v-show="!stopResiveStatas">恢复</span>
          </el-button>
        </div>
        <div class="page">
          <div style="display: flex;align-items: center">
            <a href="#"
               @click="handleCurrentChange(1)">首页</a>
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           layout="prev, pager, next"
                           :current-page="page.pageNum"
                           :page-size="page.pageSize"
                           :total="page.total">
            </el-pagination>
            <a href="#"
               @click="handleCurrentChange(Math.ceil(page.total/page.pageSize))">末页</a>
          </div>

          <p class='dp-con'>
            <span class="iconfont"
                  @click='showmodeShow=!showmodeShow'>&#xe653;</span>
            <ul v-show="showmodeShow"
                @mouseleave='showmodeShow=false'>
              <li v-for="mode in panesArr"
                  :key='mode.value'>
                <div @click="clickCheckedWmode(mode)"
                     :class="{active: mode.value===checkedWmode}">{{mode.label}}</div>
              </li>
              <li style="padding: 0px;border-right:none">
                <!-- <el-checkbox v-show="checkedWmode > 8"
                           class="sub-stream-check"
                           v-model="useSubStream"
                           @change="setuseSubStream">9画面(含)以上按子码流预览</el-checkbox> -->
              </li>
              <i></i>
            </ul>
          </p>
          <iframe v-if="showmodeShow"
                  style="z-index:2;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
          <p @click='isAllScrellFuc'
             v-if='!isAllScrell'>
            <span class="icon iconfont-ccb">&#xe69a;</span>
          </p>
          <p @click='isCloseAllScrellFuc'
             v-if='isAllScrell'>
            <span class="icon iconfont-ccb">&#xe712;</span>
          </p>

        </div>
      </div>
    </div>

    <div class="table-bottom"
         ref="tableDom"
         v-show='!isAllScrell'>
      <!-- @row-dblclick='preview' -->
      <el-table ref="multipleTable"
                :data="tableData"
                style="width: 100%"
                border
                stripe
                resizable="false"
                :height="tableHeight"
                v-loading="loading"
                highlight-current-row
                @current-change="rowClick"
                @selection-change="handleSelectionChange">

        <el-table-column type="selection"
                         center
                         width="45">
        </el-table-column>
        <el-table-column prop="order"
                         label="序号"
                         width="45"
                         center></el-table-column>
        <el-table-column prop="mergeNo"
                         label="合并数量"
                         width="70"></el-table-column>
        <el-table-column label="报警等级"
                         width="120">
          <template slot-scope="scope">
            <div>
              <span :style="{background: colorBox[scope.row.level-1]}"
                    style="display: inline-block;width: 10px;height: 10px;"></span>
              <span>{{levelName[scope.row.level-1]}}</span>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="orgName"
                         label="所属机构"
                         width="160"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="locationName"
                         show-overflow-tooltip
                         label="所属部位"
                         width="180"></el-table-column>
        <el-table-column prop="deviceName"
                         show-overflow-tooltip
                         label="所属设备"
                         width="250"></el-table-column>
        <el-table-column prop="dealStateName"
                         label="处理状态"
                         width="120"></el-table-column>

        <el-table-column prop="alarmName"
                         show-overflow-tooltip
                         label="报警名称"
                         width="250"></el-table-column>
        <el-table-column prop="startTime"
                         label="发生时间"
                         width="140"></el-table-column>

        <!-- <el-table-column prop="alarmStateName"
                         label="报警状态"
                         width="120"></el-table-column> -->
        <el-table-column prop="alarmTypeName"
                         label="报警分类"
                         width="120"></el-table-column>
        <!--                    <el-table-column prop="zip" label="对讲等级" width="120"></el-table-column>-->
        <el-table-column prop="alarmSource"
                         label="报警来源"
                         width="120"></el-table-column>
        <el-table-column prop="talkRequestName"
                         label="对讲请求"></el-table-column>
      </el-table>
    </div>
    <!--      批处理异常弹窗-->
    <div>
      <el-dialog title="处理类型"
                 :visible.sync="bulkDealdialogVisible"
                 width="20%"
                 :before-close="bulkDealHandleClose">
        <div class="form">
          <form action="">
            <div class="from-group">
              <div class="label">处理类型</div>
              <div class="input">
                <el-select placeholder=""
                           size="mini"
                           v-model="dealSubmit.dealType">
                  <el-option :label="item.data"
                             :value="item.key"
                             v-for="(item ,index) in dealList"
                             :key="index"></el-option>
                </el-select>
              </div>
            </div>
            <div class="from-group">
              <div class="label">处理意见</div>
              <div class="input">
                <el-input type="textarea"
                          v-model="dealSubmit.dealOpinion"></el-input>
              </div>
            </div>
            <div class="from-group">
              <div class="btns">
                <el-button size="mini"
                           type="primary"
                           @click="dealAlarmSubmit">提交</el-button>
                <el-button size="mini"
                           @click="bulkDealHandleClose">取消</el-button>
              </div>
            </div>
          </form>

        </div>
      </el-dialog>
    </div>
    <!--        批处理为正常-->
    <div>
      <el-dialog title="事件提醒批处理"
                 :visible.sync="bulkDealdialogVisibleNormal"
                 width="20%"
                 center
                 :before-close="deletebulkDealHandleCloseNormal">
        <span>{{normalTitle}}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="bulkDealdialogVisibleNormal = false">取 消</el-button>
          <el-button type="primary"
                     @click="bulkDealdialogNormalFuc">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="intercomVisible">
      <intercom @close="interOverFuc"
                @closeOver='closeOver'
                ref="intercom"
                v-show='!minimize'
                :callerPanelInfoProp='callerPanelInfoProp'></intercom>
    </div>
    <!-- v-show='minimize' -->
    <div id='minimizeRef'
         v-show='minimize'
         class='minimizeRef'>对讲</div>

  </div>
</template>

<script>
import _ from 'lodash'
import linkageConfig from '../alarmReceive/linkage_config'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import socket from '../../../socket/alarm'
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import eventVideoRelevant from './eventVideoRelevant'
import intercom from './intercom/index'
export default {
  name: 'eventDeal',
  components: {
    previewPlugin,
    intercom
  },
  data() {
    return {
      minimize: false,
      remindData: null,
      normalTitle: '是否确认 所有报警 为正常？',
      scrollParam: {}, // 滚动的参数
      scrollStatus: true, // 滚动状态
      callerPanelInfoProp: {},
      isAllScrell: false,
      checkedWmode: 12,
      showmodeShow: false,
      panesArr: [
        { value: 1, label: '单画面' },
        { value: 4, label: '4画面' },
        { value: 6, label: '6画面' },
        { value: 8, label: '8画面' },
        { value: 9, label: '9画面' },
        { value: 10, label: '10画面' },
        { value: 12, label: '12画面' },
        { value: 14, label: '14画面' },
        { value: 16, label: '16画面' },
        { value: 17, label: '17画面' },
        { value: 22, label: '22画面' },
        { value: 25, label: '25画面' }
      ],
      intercomVisible: false,
      rowClickParam: {},
      videoChecked: false,
      loading: false,
      tableHeight: 0,
      currentPage4: 4,
      tableData: [],
      linkData: [],
      bulkDealdialogVisible: false, // 批处理为异常
      bulkDealdialogVisibleNormal: false, // 批处理正常,
      dealList_: [],
      dealList: [],
      dealSubmit: {
        // 处置接口
        dealType: null,
        dealOpinion: ''
      },
      selectionTableData: [],
      page: {
        pageSize: 9,
        pageNum: 1,
        total: 0
      },
      colorBox: [],
      setIntervalObj: null,
      setTimeoutObj: null,
      ids: [], // 报警推送时，保存时间内相同通道id
      importantPart: {
        orgId: '', // 机构
        name: '', // 属地派出所名称
        address: '', // 重点部位地址
        telephone: '', // 重点部位电话
        principal1: '', // 重点部位负责人
        principalPhone1: '', // 移动电话
        // 所属机构安保联系人
        // 移动电话
        policeStation: '', // 属地派出所名称
        policeTelephone: '', // 属地派出所电话
        police: '', // 辖区民警姓名
        policeMobilePhone: '' // 移动电话
      },
      countParam: {},
      Statistics_: {
        dealCount: 0,
        nodealCount: 0
      },
      levelName: ['一级', '二级', '三级', '四级', '五级'],
      socketTableArray: [
        // 推送上来进行排序，开流的报警总和
      ],
      socketTableArray_: [
        // 推送上来进行排序，开流的报警总和
      ],
      videoCamer: [], // 传递给视频组件的分页开流数据
      locationIdObj: {
        locationId: '',
        deviceId: '',
        channelId: ''
      },
      dictBasicInfoEvent: []
    }
  },
  mixins: [linkageConfig, eventVideoRelevant],
  watch: {},
  computed: {
    ...mapGetters('eventDeal', ['stopResiveStatas'])
  },
  created() {
    this.getEventDealListFuc()
    this.getPolicyConfigurationFuc()
    this.findCountFuc()
    this.getAlarmEventRemindFuc()
    this.getDataDictBasicInfoFuc()
  },
  mounted() {
    let self = this
    let scrollDom = document.getElementsByClassName('el-table__body-wrapper')[0]
    this.calculationHeight()
    // 页面初始化成功后，接听socket
    let timeInterval = 1000 * 60 * 5 // 合并数量的报警接受时间区间
    this.setIntervalObj = setInterval(() => {
      let newTime = new Date().getTime()
      for (let i = 0; i < this.ids.length; i++) {
        let item = this.ids[i]
        if (newTime - item.currentTime > timeInterval) {
          for (let j = 0; j < this.tableData.length; j++) {
            let val = this.tableData[j]
            if (val.isMerge && val.channelId === item.id) {
              // console.log(value.channelId)
              val.isMerge = false
              break
            }
          }
          this.ids.splice(i, 1)
          i--
        }
      }
    }, 10000)
    if (this.stopResiveStatas) {
      this.setTimeoutObj = setTimeout(() => {
        socket.on('alarmDeal', data => {
          if (this.isPalyConfig(data)) {
            this.socketFuc(data)
          }
          //this.socketFuc(data)
        })
      }, 1000)
    }

    // 监听键盘按键事件
    this.$nextTick(function() {
      document.addEventListener('keyup', function(e) {
        // 此处填写你的业务逻辑即可
        if (e.keyCode === 27) {
          self.isCloseAllScrellFuc()
        }
      })
    }),
      (this.scrollTableHeight = scrollDom.clientHeight)
    scrollDom.addEventListener('scroll', () => {
      let scrollDistance = scrollDom.scrollHeight - scrollDom.scrollTop - this.scrollTableHeight - 85
      console.log(scrollDistance)

      if (scrollDistance <= 0) {
        if (!this.scrollStatus) {
          return
        }
        this.scrollParam.pageNum++
        this.scrollStatus = false
        console.log(this.scrollParam)
        this.loading = true
        this.getEventDealList(this.scrollParam).then(res => {
          let length = this.tableData.length
          if (res.code === 0 && res.data && res.data.results) {
            this.scrollStatus = true
            res.data.results.map((item, index) => {
              item.order = index + 1 + length
              item.mergeNo = item.mergeNo ? item.mergeNo : 1
              item.startTime = moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              item.dealStateName = this.transName(item.dealState, { 1: '未处理', 2: '已处理', 3: '已升级' })
              item.alarmStateName = this.transName(item.alarmState, { '1': '未结束', '2': '已结束' })
              item.talkRequestName = this.transName(item.talkRequest, { T: '是', F: '否' })
            })
            this.tableData = this.tableData.concat(res.data.results)
          }

          this.loading = false
        })
      }
    })
    this.minimizeRefMove()
    // 视频组件的分屏，默认显示12
    this.clickCheckedWmode()
  },
  methods: {
    ...mapMutations('eventDeal', {
      STOP_RESIVE_STATAS: 'STOP_RESIVE_STATAS'
    }),
    ...mapActions('eventDeal', {
      getEventDealList: 'getEventDealList',
      checkAudioStatus: 'checkAudioStatus',
      postCloseTalk: 'postCloseTalk'
    }),
    ...mapActions('alarmReceive', {
      postOpenDoor: 'postOpenDoor', // 开门
      postCloseDoor: 'postCloseDoor', // 关门
      postBeginTalk: 'postBeginTalk', // 开始对讲
      postEndTalk: 'postEndTalk', // 结束对讲
      postSetDevAlarmOutPuOpen: 'postSetDevAlarmOutPuOpen', // 警铃打开
      postSetDevAlarmOutPuClose: 'postSetDevAlarmOutPuClose', // 警铃打开
      postAlarmArmLogin: 'postAlarmArmLogin', // 布防登录
      postAlarmArm: 'postAlarmArm', // 布防
      postAlarmdisarm: 'postAlarmdisarm', // 撤防
      postAlarmclean: 'postAlarmclean', // 消警
      findLocationDetail: 'findLocationDetail',
      getAlarmReceiveList: 'getAlarmReceiveList',
      findHostBind: 'findHostBind', // 获取关联关系
      findorgHostTree: 'findorgHostTree', // 重点关注资源
      getstatus: 'getstatus', // 获取布撤防状态
      alarmDealSubmit: 'alarmDealSubmit', // 批量处理
      getMacMessage: 'getMacMessage',
      findCount: 'findCount',
      getGuardLink: 'getGuardLink',
      findHostBindDetector: 'findHostBindDetector',
      getCabinLink: 'getCabinLink',
      findVideoLink: 'findVideoLink',
      findAudioLink: 'findAudioLink',
      findVideo: 'findVideo',
      postStartinTalk: 'postStartinTalk',
      postCloseTalk: 'postCloseTalk',
      postDelgroup: 'postDelgroup',
      getOutputStatus: 'getOutputStatus',
      getchannelinfoDoorStatus: 'getchannelinfoDoorStatus',
      postAlarmdisposeend: 'postAlarmdisposeend',
      postAlarmdispose: 'postAlarmdispose',
      postReceiveAlarm: 'postReceiveAlarm'
    }),
    ...mapActions(['getPolicyConfiguration', 'getAlarmEventRemind', 'getDataDictBasicInfo']),
    getDataDictBasicInfoFuc() {
      let args = [
        { type: '1', moduleId: '1', childModuleId: '1', dictId: '1' } // dictId:主机是2  探测器是7
      ]
      this.getDataDictBasicInfo({ queryList: args }).then(res => {
        this.dictBasicInfoEvent = res.data
        this.dealList = res.data && res.data.length > 0 && res.data[0].attr
      })
    },

    // 最小化移动
    minimizeRefMove() {
      let el = document.getElementById('minimizeRef')
      let flag = false
      let disX
      let disY
      let startTime
      let endTime
      el.onmousedown = e => {
        e.stopPropagation()
        e.preventDefault()
        //算出鼠标相对元素的位置
        flag = true
        disX = e.clientX - el.offsetLeft
        disY = e.clientY - el.offsetTop
        startTime = new Date().getTime()
      }
      el.onclick = e => {
        if (endTime - startTime <= 180) {
          this.minimize = false
        }
      }
      document.onmousemove = e => {
        if (flag) {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY

          // 设置按钮移动的边界
          if (top < 0) {
            top = 0
          } else if (top > document.body.clientHeight - el.offsetHeight) {
            top = document.body.clientHeight - el.offsetHeight
          }
          if (left < 0) {
            left = 0
          } else if (left > document.body.clientWidth - el.offsetWidth) {
            left = document.body.clientWidth - el.offsetWidth
          }
          // 移动当前元素
          el.style.left = left + 'px'
          el.style.top = top + 'px'
        }
      }
      document.onmouseup = e => {
        endTime = new Date().getTime()
        flag = false
        return false
      }
    },

    // 获取列表
    getAlarmEventRemindFuc() {
      this.getAlarmEventRemind().then(res => {
        if (res) {
          res.data.results.map(item => {
            item['remindName'] = item.remind === 'T' ? '关注' : '提示'
            item['autoProcessName'] = item.autoProcess === 'T' ? '启用' : '不启用'
          })
          this.remindData = res.data.results
        }
      })
    },

    isPalyConfig(data) {
      return data.alarmInfo.event_remind === '提示' || data.alarmInfo.event_remind === '关注'
    },
    isAllScrellFuc() {
      this.isAllScrell = true
      this.requestFullscreen()
    },
    isCloseAllScrellFuc() {
      this.isAllScrell = false
      this.exitFullscreen()
    },
    clickCheckedWmode(mode) {
      if (mode) {
        this.checkedWmode = mode.value
        this.page.pageSize = mode.value
        this.$refs.preview.clickCheckedWmode(mode)
      }
    },
    changeDefaultPane(val) {
      this.checkedWmode = val
    },
    interComingFuc(data, detail) {
      let param = {}
      // 如果是有面板id ,这条报警就是面板上的报警
      if (detail.source.detail.faceplateId) {
        param['panelId'] = detail.source.detail.resourceId
      } else {
        param['mikId'] = detail.source.detail.deviceId
      }
      this.checkAudioStatusFuc(param, detail)
    },
    // 查看对讲状态
    checkAudioStatusFuc(param, detail) {
      this.checkAudioStatus(param).then(res => {
        if (res && res.code === 0) {
          // 3为呼出状态
          if (res.data.status === 3) {
            this.callerPanelInfoProp = detail
            this.intercomVisible = true
            // 状态是5的话，已在通话中
          } else if (res.data.status === 5) {
            this.$message({
              type: 'info',
              message: '该设备已在对讲中'
            })
          } else {
            this.$message({
              type: 'info',
              message: '对讲状态有误，不能接听'
            })
          }
        }
      })
    },
    interOverFuc() {
      //this.intercomVisible = false
      this.minimize = true
      //this.$refs.intercom.postCloseTalkFuc() // 方法2挂断
    },
    closeOver() {
      this.intercomVisible = false
      this.minimize = false
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      //this.getEventDealListFuc()
      console.log(`每页 ${val} 条`)
    },

    handleCurrentChange(val) {
      if (val != 1 && val != 0) {
        this.$refs.preview.pageChange(val)
      }
    },

    // 联动控制中转换参数
    linkTransParams(host) {
      this.linkData.map(item => {
        _.merge(item, this.linkage[item.typeName])

        // 门禁参数赋值
        if (item.typeName === 'guard') {
          // item.btns[0].params.hostId = item.hostUniq
          // item.btns[0].params.devIp = item.platformIp
          // item.btns[0].params.devPort = item.platformPort
          // item.btns[0].params.channelId = item.uniqueId
          // item.btns[1].params.hostId = item.hostUniq
          // item.btns[1].params.devIp = item.platformIp
          // item.btns[1].params.devPort = item.platformPort
          // item.btns[1].params.channelId = item.uniqueId
          item.btns[0].params.guardId = item.id
          item.btns[1].params.guardId = item.id
        } else if (item.typeName === 'audio') {
          // 对讲
          if (item && item.type === 1) {
            item.btns[0].params.calld.calledpanelIds = item.id
            delete item.btns[0].params.calld.calledMikeIds
          } else if (item && item.type === 2) {
            item.btns[0].params.calld.calledMikeIds = item.id
            delete item.btns[0].params.calld.calledpanelIds
          }
          // item.btns[0].params.talk.serverId = item.host && item.host.platform && item.host.platform.id
          // item.btns[0].params.talk.serverIp = item.host && item.host.platform && item.host.platform.ip
          // item.btns[0].params.talk.serverPort = item.host && item.host.platform && item.host.platform.port
          // item.btns[0].params.talk.callerPanelInfo.hostIp = item.host && item.host.ip
          // item.btns[0].params.talk.callerPanelInfo.hostPort = item.host && item.host.port
          // item.btns[0].params.talk.callerPanelInfo.hostId = (item.host && item.host.id) || item.deviceId // 这两个应该是同一个id
          // item.btns[0].params.talk.callerPanelInfo.id = item.id
        } else if (item.typeName === 'output') {
          if (host) {
            item.btns[0].params.devIp = host && host.ip
            item.btns[0].params.devPort = host && host.port
            item.btns[0].params.outputNo = host && item.serialNumber
            item.btns[1].params.devIp = host && host.ip
            item.btns[1].params.devPort = host && host.port
            item.btns[1].params.outputNo = item.serialNumber
          }

          // item.btns[0].params.hostId = item.alarmHostId || item.deviceId
          // item.btns[1].params.hostId = item.alarmHostId || item.deviceId
        }
      })
      console.log(this.linkData)
      // 获取布撤防状态
      if (host) {
        this.getstatusFuc(host)
      }
    },
    // 获取布撤防状态
    // 获取布撤防状态
    getstatusFuc(host) {
      if (!host) {
        return
      }
      let param = {
        devIp: host.ip,
        devPort: host.port,
        subSystems: []
        //  subSystems:_.map(host.subSystem,_.pick())
      }
      let cleanParam = {
        devIp: host.ip,
        devPort: host.port
        // subSystems: []
      }
      let paramArm = {
        devIp: host.ip,
        devPort: host.port,
        subSystem: []
      }
      let paramLogin = {
        devIp: host.ip,
        devPort: host.port,
        username: host.userName,
        passwd: String(host.password),
        vendor: 'HIKVISION',
        devType: host.deviceType,
        devBaseType: host.deviceType,
        connMode: 'active',
        version: '1',
        daServerId: host.service
      }

      host.subSystemList &&
        host.subSystemList.map(item => {
          let zoneList = []
          let obj = {
            subSystem: item.serialNumber,
            zoneList
          }
          paramArm.subSystem.push(item.serialNumber)
          item.detector &&
            item.detector.map(res => {
              zoneList.push(res.serialNumber)
            })
          param.subSystems.push(obj)
        })
      this.linkData.map(item => {
        if (item.typeName === 'alarm') {
          item.btns[0].params.operation = paramArm
          item.btns[0].params.login = paramLogin
          item.btns[0].params.getStatus = param
          item.btns[1].params.login = paramLogin
          item.btns[1].params.operation = paramArm
          item.btns[1].params.getStatus = param
          item.btns[2].params.login = paramLogin
          item.btns[2].params.operation = cleanParam
          item.btns[2].params.getStatus = param
        }
      })
    },
    DealFucFalse(data, detail) {
      this.selectionTableData.push(detail.source && detail.source.detail)
      //
      this.bulkDealdialogVisible = true
    },
    DealFucTrue(data, detail) {
      this.normalTitle = '是否确认 ' + detail.source && detail.source.detail.alarmName + ' 为正常报警？'
      this.selectionTableData.push(detail.source && detail.source.detail)
      this.bulkDealdialogVisibleNormal = true
    },
    calculationHeight() {
      let tableDom = this.$refs.tableDom
      //  减去tableDom padding的宽度
      setTimeout(() => {
        this.tableHeight = tableDom.clientHeight - 10
      }, 30)
    },
    // 批量报警处置，报警处置提交
    dealAlarmSubmit(type) {
      let ids = []
      if (this.selectionTableData.length === 0) {
        this.$message({
          message: '请先选择数据',
          type: 'success'
        })
        return
      }
      this.selectionTableData.map(item => {
        if (item.id) {
          ids.push(item.id)
        }
      })
      let param = {
        ids,
        dealType: this.dealSubmit.dealType,
        dealOpinion: this.dealSubmit.dealOpinion,
        dealState: 2
      }
      if (type === 'nomal') {
        delete param.dealType
        delete param.dealOpinion
      }
      this.alarmDealSubmit(param).then(res => {
        this.postAlarmdisposeendFuc(ids) // 处理完给北京通知
        console.log(this.selectionTableData)
        this.$refs.preview.alarmStopPreview(this.selectionTableData) // 关流
        this.bulkDealdialogVisible = false
        this.bulkDealdialogVisibleNormal = false
        this.selectionTableData = []
        this.getEventDealListFuc()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    },
    // 批量处理回调
    bulkDealHandleClose() {
      this.bulkDealdialogVisible = false
    },
    batchDealFucTrue() {
      if (this.selectionTableData.length > 0) {
        this.bulkDealdialogVisible = true
        // this.dealList = this.dealList_
      } else {
        this.$message({
          message: '请先选择数据',
          type: 'success'
        })
      }
    },
    batchDealFucFalse() {
      this.normalTitle = '是否确认 所有报警 为正常？'
      if (this.selectionTableData.length > 0) {
        this.bulkDealdialogVisibleNormal = true
      } else {
        this.$message({
          message: '请先选择数据',
          type: 'success'
        })
      }
    },
    // 批处理为正常取消
    deletebulkDealHandleCloseNormal() {
      this.bulkDealdialogVisibleNormal = false
    },
    // 批处理为正常确定按钮
    bulkDealdialogNormalFuc() {
      this.dealAlarmSubmit('nomal')
    },
    print_schedule() {
      const { href } = this.$router.resolve({
        name: `LinkVideo`,
        query: this.locationIdObj
      })
      console.log(this.locationIdObj)
      if (this.locationIdObj.locationId) {
        window.open(href, '_blank')
      } else {
        this.$message({
          message: '该报警重点部位为空',
          type: 'error'
        })
      }
    },
    // 获取策略配置列表
    getPolicyConfigurationFuc() {
      this.getPolicyConfiguration().then(res => {
        if (res) {
          let data = res.data.results && res.data.results[0]
          // this.dealList = JSON.parse(data.processType)
          // this.dealList_ = JSON.parse(data.processType)
          this.colorBox.push(data.color1)
          this.colorBox.push(data.color2)
          this.colorBox.push(data.color3)
          this.colorBox.push(data.color4)
          this.colorBox.push(data.color5)
        }
      })
    },
    // 获取报警处置列表
    getEventDealListFuc(lev) {
      console.log(lev)
      let param = {
        startTime: moment()
          .startOf('day')
          .format('X'),
        endTime: moment().format('X'),
        level: '3,4,5',
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        whichPage: 'event'
      }
      this.loading = true
      this.scrollStatus = true // 可滚动
      this.scrollParam = param
      this.getEventDealList(param).then(res => {
        console.log(res)
        this.loading = false
        if (res.code === 0 && res.data) {
          // this.page.total = res.data.page.length
          res.data.results &&
            res.data.results.map((item, index) => {
              item.order = index + 1
              item.mergeNo = item.mergeNo ? item.mergeNo : 1
              item.startTime = moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              item.dealStateName = this.transName(item.dealState, { '1': '未处理', '2': '已处理', '3': '已升级' })
              item.alarmStateName = this.transName(item.alarmState, { '1': '未结束', '2': '已结束' })
              item.talkRequestName = this.transName(item.talkRequest, { T: '是', F: '否' })
            })
          this.tableData = res.data.results
          if (res.data.results.length > 0) {
            this.rowClickParam = res.data.results[0]
            this.$refs.multipleTable.setCurrentRow(this.rowClickParam) // 默認选择第一行
          }
        }
      })
    },
    transName(key, obj) {
      return obj[key]
    },
    findCountFuc(level) {
      let param = {
        startTime: moment()
          .startOf('day')
          .format('X'),
        endTime: moment().format('X'),
        type: '1'
      }
      this.findCount(param).then(res => {
        this.countParam = JSON.parse(res.data.count)
        console.log(this.countParam)
        this.Statistics_.dealCount =
          this.countParam.level3Done + this.countParam.level4Done + this.countParam.level5Done
        console.log(this.Statistics_.dealCount)
        // debugger
        this.Statistics_.nodealCount =
          this.countParam.level3ToDo + this.countParam.level4ToDo + this.countParam.level5ToDo
      })
    },
    // 暂停接警
    stopResiveAlarm() {
      this.STOP_RESIVE_STATAS(!this.stopResiveStatas)
      if (!this.stopResiveStatas) {
        socket.remove('alarmDeal', data => {
          console.log(data)
        })
      } else {
        socket.on('alarmDeal', data => {
          if (this.isPalyConfig(data)) {
            this.socketFuc(data)
          }
        })
      }
    },
    //
    handleSelectionChange(row) {
      console.log(row)
      this.selectionTableData = row
    },
    // socket消息处理函数
    socketFuc(data) {
      // if (
      //   parseInt(data.alarmInfo.level) === 3 ||
      //   parseInt(data.alarmInfo.level) === 4 ||
      //   parseInt(data.alarmInfo.level) === 5
      // ) {

      // }
      data.alarmInfo.mergeNo = 1
      data.alarmInfo.alarmStateName = '已结束'
      data.alarmInfo.dealStateName = '未处理'
      data.alarmInfo.talkRequestName = '否'
      data.alarmInfo.phoneComing = '接听'
      data.alarmInfo.phoneOver = '挂断'
      data.alarmInfo.isMerge = true

      data.alarmInfo.startTime = moment(data.alarmInfo.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      // 判断此条socket 是否接受
      // let isConbine = _.filter(this.filterForm.type, data.alarmInfo.alarmType)

      if (this.actHeaderBtn && this.actHeaderBtn === data.alarmInfo.level) {
        this.homologousMerging(
          data.alarmInfo.deviceId + data.alarmInfo.channel + data.alarmInfo.eventTypeName,
          this.ids,
          data.alarmInfo
        )
      } else if (!this.actHeaderBtn) {
        this.homologousMerging(
          data.alarmInfo.deviceId + data.alarmInfo.channel + data.alarmInfo.eventTypeName,
          this.ids,
          data.alarmInfo
        )
      }
    },
    // 推送的报警同源数量合并
    homologousMerging(id, ids, data) {
      // 记录探测器id
      // 如果1min内收到的是一个探测器发出的报警，那么只显示一条
      let length = ids.filter(item => {
        return item.id === id
      }).length
      console.log(length)
      if (length) {
        this.tableData.map(item => {
          let str = item.deviceId + item.channel + item.eventTypeName
          if (item.isMerge && str === id) {
            console.log('合并')
            let count = item.mergeNo
            _.assign(item, _.pickBy(data, _.identity))

            // item.startTime = data.startTime
            item.mergeNo = count
            item.mergeNo && item.mergeNo++
          }
        })
      } else {
        // 视频弹出,数量合并后默认开一个视频
        if (data.action_dict) {
          console.log(data)
          // 对视频进行排序
          this.page.total++
          this.socketPreview(data)
        }

        this.ids.push({
          id: data.deviceId + data.channel + data.eventTypeName,
          currentTime: new Date().getTime() // 获取当前时间
        })
        data['order'] = this.tableData.length + 1
        this.tableData.unshift(data)
        this.tableData.map((item, index) => {
          item.order = index + 1
        })
        // this.tableData = _.assign([], this.this.tableData)
        console.log(this.tableData)
      }
    },
    // 点击莫一行
    rowClick(row) {
      this.locationIdObj.locationId = row.locationId
      this.locationIdObj.deviceId = row.deviceId
      this.locationIdObj.channelId = row.id
      this.$refs.preview.syncChangeCheckedPane(row)
      if (row) {
        this.rowClickParam = row
        // this.getLevelDealProcess(row.level)
        this.$refs.preview.syncChangeCheckedPane(row)
        this.findLocationDetailFuc(row.locationId)
        if (row.alarmTypeName === '门禁报警') {
          if (row.resourceId) {
            this.getGuardLinkFuc({ id: row.resourceId, ref: 2 })
          } else {
            this.getGuardLinkFuc({ id: row.deviceId, ref: 1 })
          }
        } else if (row.alarmTypeName === '入侵报警') {
          if (row.resourceId) {
            this.findHostBindDetectorFuc({ id: row.resourceId, ref: 2 })
          } else {
            this.findHostBindFuc({ id: row.deviceId, ref: 1 })
          }
        } else if (row.alarmTypeName === '防护舱报警') {
          if (row.resources) {
            this.getCabinLinkFuc({ id: row.resourceId, ref: 2 })
          } else {
            this.getCabinLinkFuc({ id: row.deviceId, ref: 1 })
          }
        } else if (row.alarmTypeName === '视频报警') {
          if (row.resources) {
            this.findVideoLinkFuc(row.resourceId, { ref: 2 }).then(res => {
              this.previewPlay(res[0], row)
            })
          } else {
            this.findVideoLinkFuc(row.deviceId, { ref: 1 }).then(res => {
              this.previewPlay(res[0], row)
            })
          }
        } else if (row.alarmTypeName === '对讲报警') {
          if (row.resources) {
            this.findAudioLinkFuc(row.resourceId, { ref: 2 }).then(res => {
              this.previewPlay(res[0], row)
            })
          } else {
            this.findVideoLinkFuc(row.deviceId, { ref: 1 }).then(res => {
              this.previewPlay(res[0], row)
            })
          }
        }
      }
      this.linkData = []
    },
    findHostBindFuc(payload) {
      this.linkData = []
      return this.findHostBind(payload).then(res => {
        if (res && res.data) {
          return this.combineFuc(res.data)
          // debugger
        }
      })
    },
    combineFuc(data) {
      data.audio &&
        data.audio.map(item => {
          return (item['typeName'] = 'audio')
        })
      data.guard &&
        data.guard.map(item => {
          return (item['typeName'] = 'guard')
        })
      data.outChannel &&
        data.outChannel.map(item => {
          return (item['typeName'] = 'output')
        })
      data.output &&
        data.output.map(item => {
          return (item['typeName'] = 'output')
        })
      this.linkData = this.linkData
        .concat(data.audio)
        .concat(data.guard)
        .concat(data.outChannel)
        .concat(data.output)
      this.linkData = _.compact(this.linkData)
      if (data.subSystemList && data.subSystemList.length > 0) {
        if (data.alarmHostInfo) {
          data.alarmHostInfo['typeName'] = 'alarm'
          data.alarmHostInfo['subSystemList'] = data.subSystemList
          this.linkData = this.linkData.concat([data.alarmHostInfo])
          this.linkTransParams(data.alarmHostInfo)
        } else {
          data['typeName'] = 'alarm'
          this.linkData = this.linkData.concat([data])
          this.linkTransParams(data)
        }
      } else {
        this.linkTransParams()
      }

      return new Promise((resolve, reject) => {
        resolve(data.video)
      })
    },
    // 获取部位详情
    findLocationDetailFuc(id) {
      this.findLocationDetail({ locationId: id }).then(res => {
        if (res) {
          this.importantPart = res.data
        }
      })
    },
    // 对现有的报警进行排序，开流
    alarmSortFuc(alarmArray) {
      // 规则：1.对讲>关注>提示
      //      2.中心对讲>业务对讲>客户对讲
      //      3.新上的报警>刚才的报警
      let tolk1 = []
      let tolk2 = []
      let tolk3 = []
      let follow = []
      let remind = []
      let normal = []

      alarmArray.map(val => {
        let item = val.detail
        if (item.talkRequest === 'T') {
          // 如果是话筒上来的呼叫，全是中心呼叫
          if (!item.resourceId) {
            item.callType = '中心呼叫'
            tolk1.push(val)
            // 面板类型  2.业务对讲
          } else if (parseInt(item.type) === 2) {
            item.callType = '业务呼叫'
            tolk2.push(val)
            // 面板类型  2.客户对讲
          } else if (parseInt(item.type) === 1) {
            item.callType = '客户呼叫'
            tolk3.push(val)
          }
        } else if (item.event_remind === '关注') {
          // 关注
          follow.push(val)
          // 提示
        } else if (item.event_remind === '提示') {
          remind.push(val)
        } else {
          normal.push(val)
        }
      })

      let sortTime = (a, b) => {
        return new Date(b.detail.startTime).getTime() - new Date(a.detail.startTime).getTime()
      }
      console.log(normal)
      alarmArray = []
        .concat(tolk1.sort(sortTime))
        .concat(tolk2.sort(sortTime))
        .concat(tolk3.sort(sortTime))
        .concat(follow.sort(sortTime))
        .concat(remind.sort(sortTime))
        .concat(normal.sort(sortTime))
      return alarmArray
    },
    // 处理完毕通知北京
    postAlarmdisposeendFuc(param) {
      let obj = { alarmIds: JSON.stringify(param) }
      this.postAlarmdisposeend(obj).then(res => {})
    },
    // 开始处理通知北京
    postAlarmdisposeFuc(param) {
      let obj = { alarmId: param }
      this.postAlarmdispose(obj).then(res => {})
    },
    // 开始接警
    postReceiveAlarmFuc(id) {
      let obj = { id: id }
      this.postReceiveAlarm(obj).then(res => {})
    }
  },
  destroyed() {
    console.log('销毁')
    clearInterval(this.setIntervalObj) // 清除定时器
    clearTimeout(this.setTimeoutObj) // 清除定时器
    socket.remove('alarmDeal', data => {
      console.log(data)
    })
  }
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .minimizeRef {
    z-index: 100000;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    line-height: 50px;
    cursor: pointer;
    text-align: center;
    font-size: 16px;
    position: fixed;
    top: 100px;
    right: 100px;
  }
  .topIScre {
    width: 100%;
    height: 645px;
    display: flex;
    flex-direction: column;
    .video-top {
      flex: 1;
      width: 100%;
      border: 1px solid #ddd;
      display: flex;
      .left-box {
        flex: 1;
        overflow: hidden;
        /deep/.el-button + .el-button {
          margin: 0;
          /*height: 24px;*/
        }
      }
      .right-box {
        width: 320px;
        /*border-left: 1px solid #ddd;*/
        height: 100%;
        .tabs-body {
          height: 520px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          /*padding: 5px 9px;*/
          box-sizing: border-box;
          overflow-y: auto;
          /*flex-wrap: wrap;*/
          flex-direction: column;
          .link-modal {
            width: 270px;
            min-width: 250px;
            height: 80px;
            min-height: 80px;
            display: flex;
            margin: 10px;
            border: 1px solid #ddd;
            font-size: 12px;
            .left-icon {
              width: 50px;
              height: 60px;
              margin-top: 8px;
              line-height: 60px;
              text-align: center;
              .iconfont {
                font-size: 46px;
              }
            }
            .right-btns {
              width: 200px;
              margin-left: 10px;
              .title {
                height: 30px;
                line-height: 30px;
              }
              .btns {
                margin-top: 5px;
              }
            }
          }
          .part-detail {
            flex: 1;
            height: 100%;
            display: flex;
            border: 1px solid #e1e1e1;
            color: #222222;
            .row-label {
              width: 100px;
              height: 100%;
              border-right: 1px solid #fff;
              .label {
                border-bottom: 1px solid #e1e1e1;
                background: rgba(245, 245, 245, 1);
                width: 100%;
                height: 30px;
                line-height: 30px;
                padding: 0 6px 0 6px;
              }
            }
            .row-value {
              flex: 1;
              .label {
                background: #fff;
                border-bottom: 1px solid #e1e1e1;
                width: 100%;
                height: 30px;
                line-height: 30px;
                padding: 0 6px 0 6px;
              }
            }
          }
        }
      }
    }
    .btns-middle {
      font-size: 12px;
      height: 45px;
      width: 100%;
      border-bottom: 1px solid #dddddd;
      display: flex;
      justify-content: space-between;
      /deep/.el-button--mini {
        height: 30px;
      }
      .tips {
        display: flex;
        width: 320px;
        height: 45px;
        .tip {
          height: 45px;
          line-height: 45px;
          margin: 0 15px;
          /deep/.el-checkbox__label {
            font-size: 12px;
          }
        }
      }
      .btns-box {
        width: 340px;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        padding: 9px 0;
      }
      .stop {
        padding: 9px 0;
        span {
          font-size: 14px;
        }
      }

      .page {
        display: flex;
        width: 800px;
        padding: 8px 0;
        p {
          line-height: 36px;
          margin-left: 50px;
          padding: 0 5px;
          span:first-child {
            font-size: 24px;
            cursor: pointer;
          }
          span:hover {
            color: rgba(45, 114, 211, 1);
          }
        }
        p:last-child {
          line-height: 36px;
          padding: 0 5px;
          span:first-child {
            font-size: 24px;
            cursor: pointer;
          }
          span:hover {
            color: rgba(45, 114, 211, 1);
          }
        }
      }
    }
  }
  .isAllScrell {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 9999;
  }
  .table-bottom {
    flex: 1;
    width: 100%;
    .el-table {
      font-size: 12px;
    }
  }
  .form {
    width: 100%;
    height: 100%;
    .from-group {
      width: 100%;
      padding: 0 15px;
      .label {
        width: 100%;
        height: 30px;
        line-height: 30px;
      }

      .input {
        width: 100%;

        .el-select {
          width: 100%;
        }

        .el-input {
          width: 100%;
        }
      }

      .btns {
        margin-top: 8px;
      }
    }
  }
  .dp-con {
    position: relative;
    display: inline-block;
    iframe {
      position: absolute;
      width: 250px;
      bottom: 60px;
      left: -177px;
      z-index: 1;
    }
    ul {
      position: absolute;
      width: 250px;
      bottom: 40px;
      left: -177px;
      z-index: 10;
      background-color: #335589;
      list-style: none;
      color: snow;
      text-align: center;
      padding: 0 6px;
      border-radius: 4px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      i {
        display: block;
        position: absolute;
        background: #335589;
        width: 14px;
        height: 14px;
        transform: rotate(45deg);
        bottom: -7px;
        left: 188px;
      }
      li {
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        height: 40px;
        line-height: 40px;
        padding: 0 8px;
        .sub-stream-check {
          font-size: 12px !important;
          color: snow;
          padding: 0 10px;
          height: 40px;
          line-height: 40px;
          /deep/ .el-checkbox__input + .el-checkbox__label,
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: snow;
          }
        }
      }
      .active {
        color: #fda54b;
      }
    }
    i {
      padding: 0 8px;
      font-size: 20px;
    }
  }
}
</style>
