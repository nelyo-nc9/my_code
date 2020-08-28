<template>
  <div class="airlockControl">
    <section class="airlockControl-left">
      <span class="tree-type">机构
        <span class="refresh icon iconfont-ccb ccbicon"
              @click="refresh"></span>
      </span>
      <div class="tree-box">
        <treeBox ref="treeDiv"
                 :lazyTreeApi="getTreeApi"
                 searchType="search"
                 :lazyTreeSearchApi="getLazyTreeSearchApi"
                 :treeType="treeType"
                 treeLazyToggle
                 iconToggle
                 @clickData="playBackGetData"
                 @onceClick="onceClick">
          <template slot-scope="{data}">
            <i class="iconfont icon-biaoqian"
               title="详细信息"
               @click.stop="clickInfo(data)"></i>
          </template>
        </treeBox>
      </div>
    </section>
    <section class="airlockControl-right">
      <div class="airlock-content">
        <span class="now-position">
          <span>智慧安防 ></span>
          <span class="now-span">防护舱管理</span>
        </span>
        <span class="now-state">
          <span class="sign"></span>
          <span class="state"
                @click="getAccessChannelData()">
            防护舱通道：<span>{{ protectiveCabinNum }}</span>
          </span>
          <span class="state"
                @click="getAccessChannelData(2)">
            有人：<span>{{ someOne }}</span>
          </span>
          <span class="state"
                @click="getAccessChannelData(1)">
            无人：<span>{{ noOne }}</span>
          </span>
          <span class="state"
                @click="getAccessChannelData(3)">
            未知：<span>{{ offline }}</span>
          </span>
          <span class="state">
            <el-checkbox-group v-model="checked"
                               @change="checkChange">
              <el-checkbox label="包含下属机构"
                           name="type"></el-checkbox>
            </el-checkbox-group>
          </span>
        </span>
        <span class="header-change">
          <span class="line-change"></span>
          <span class="change-icon"
                @click="isShowAisleTable">
            <i class="icon iconfont-ccb ccbliebiao"></i>
          </span>
        </span>
        <div class="table-list">
          <div class="center-table query-data-table"
               v-if="isShowTable">
            <!-- query查询 -->
            <div class="query">
              <el-button size="small"
                         @click="getTabList">下载</el-button>
            </div>
            <!-- 表格 -->
            <el-table :data="aisleTableData"
                      style="width: 100%"
                      height="393px"
                      :default-sort="{ prop: 'date', order: 'descending' }"
                      align="left"
                      @row-dblclick="handledbClick"
                      @selection-change="selectChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in aisleTableColumn"
                               :key="item.label"
                               :prop="item.prop"
                               :label="item.label"
                               sortable></el-table-column>
            </el-table>
            <video-pagination ref="listPagination"
                              :total="protectiveCabinNum"
                              @paginationConfChange="paginationConfChange"></video-pagination>
          </div>
          <div class="list-box"
               v-else>
            <div class="door-box"
                 v-for="(item, index) in aisleTableData"
                 :key="index">
              <span class="door">
                <span class="door-img">
                  <i class="icon iconfont-ccb ccbmenjiachaojian"></i>
                </span>
                <span class="message-door">
                  <span>{{item.name}}</span>
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item.deviceName"
                              placement="top-start">
                    <span>{{item.deviceName}}</span>
                  </el-tooltip>
                </span>
              </span>
              <span class="message">{{item.keyPartName}}</span>
              <span class="message">状态：{{item.status}}</span>
              <span class="link-button"
                    @click="isShowAisleControl(item)">关联控制</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-table">
            <el-tabs v-model="activeName"
                     type="card">
              <el-tab-pane label="防护舱事件"
                           name="first">
                <el-table :data="managementTableData.slice((eventCurrentPage - 1) * eventPagesize, eventCurrentPage * eventPagesize)"
                          style="width: 100%"
                          height="calc(100% - 29px)"
                          @row-dblclick="isShowAlarm">
                  <el-table-column type="index"
                                   label="序号"></el-table-column>
                  <el-table-column v-for="item in managementTableColumn"
                                   :key="item.label"
                                   :prop="item.prop"
                                   :label="item.label"
                                   sortable></el-table-column>
                  <el-table-column prop
                                   label="时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.startTime | toTiME}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination @size-change="eventHandleSizeChange"
                               @current-change="eventHandleCurrentChange"
                               :current-page="eventCurrentPage"
                               :page-sizes="[60]"
                               :page-size="eventPagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="eventTotal"
                               style="text-align:right;">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane label="防护舱报警"
                           name="second">
                <el-table :data="alarmTableData.slice((policeCurrentPage - 1) * policePagesize, policeCurrentPage * policePagesize)"
                          style="width:100%"
                          height="calc(100% - 29px)"
                          @row-dblclick="alarmRouter">
                  <el-table-column type="index"
                                   label="序号"></el-table-column>
                  <el-table-column v-for="item in alarmTableColumn"
                                   :key="item.label"
                                   :prop="item.prop"
                                   :label="item.label"
                                   sortable></el-table-column>
                  <el-table-column prop
                                   label="时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.startTime | toTiME}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination @size-change="policeHandleSizeChange"
                               @current-change="policeHandleCurrentChange"
                               :current-page="policeCurrentPage"
                               :page-sizes="[60]"
                               :page-size="policePagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="policeTotal"
                               style="text-align:right;">
                </el-pagination>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </section>
    <div class="preview-container">
      <el-dialog title="防护舱控制"
                 :visible.sync="isShowControl"
                 width="1115px"
                 top="12vh"
                 custom-class="dialog-message"
                 append-to-body
                 :before-close="handleClose"
                 @close="closeDialog"
                 v-if="isShowControl"
                 :close-on-click-modal="false"
                 v-dialogDrag>
        <span slot="title"
              class="dialog-footer">
          <span>关联控制</span>
        </span>
        <div class="message-content">
          <div class="con-left">
            <div class="video-top">
              <preview-plugin :defaultPane="defaultPane"
                              :iconShow="iconShowParams"
                              :pluginIconShow="pluginIconShow"
                              ref="preview"
                              @changeDefaultPane="changeDefaultPane"
                              :moduleType="moduleType"
                              :isNeedModal="isNeedModal"></preview-plugin>
            </div>
            <div class="message-footer">
              <div class="message-list">
                <span class="title">{{item.name}}</span>
                <span class="message">
                  <span>所属机构：{{item.orgName}}</span>
                  <span>型号：{{item.modelNum}}</span>
                  <span>所属重点部位：{{item.keyPartName}}</span>
                </span>
                <span class="message">
                  <span>品牌：{{item.brand}}</span>
                  <span>所属门禁主机：{{item.deviceName}}</span>
                  <span>备注：</span>
                </span>
              </div>
            </div>
          </div>
          <div class="con-right">
            <div class="tab-top">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="视频设备"
                                  name="1">
                  <div class="isBor"
                       v-for="(item, index) in video"
                       :key="index">
                    <i class="el-icon-video-camera"></i>
                    <span @click="preview(item)">{{item.name}}</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="远程控制"
                                  name="2">
                  <div class="name"
                       style="flex-direction: column;"
                       v-for="(i,index) in cabin">
                    <span class="name-title">
                      <span class='icon-background'
                            style="background:#FFBA00">
                        <span class="iconfont-ccb ccbfanghucangtongdao"></span>
                      </span>
                      <el-tooltip class="item"
                                  effect="dark"
                                  :content="i.name || i.resourceName"
                                  placement="top-start">
                        <span>{{ i.name || i.resourceName }}</span>
                      </el-tooltip>
                    </span>
                    <span class="span-button">
                      <el-button @click="unlock(index)"
                                 :disabled="i.types">远程开门</el-button>
                      <el-button @click="forceLock(index)"
                                 :disabled="i.types">强制锁闭</el-button>
                      <el-button @click="forceUnlock(index)"
                                 :disabled="i.types">解除锁闭</el-button>
                    </span>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="对讲控制"
                                  name="3">
                  <div v-for="(item, index) in audio"
                       :key="index"
                       class="name">
                    <span class="name-title">
                      <span class='icon-background'
                            :style="talkStatus?'background:#38BBBE':'background:#C5C5C5'">
                        <span class="iconfont-ccb ccbIPduijiangzhong"
                              v-if="talkStatus"></span>
                        <span class="iconfont-ccb ccbIPweiduijiang"
                              v-else></span>
                      </span>
                      <el-tooltip class="item"
                                  effect="dark"
                                  :content="item.name"
                                  placement="top-start">
                        <span>{{ item.name }}</span>
                      </el-tooltip>
                    </span>
                    <span class="opClose"
                          v-if="item.status === 2 && talkStatus"
                          @click="startTalking(item, index)">
                      <span class="active">
                        <span class="size">开</span>
                      </span>
                      <span>
                        <span class="size">关</span>
                      </span>
                    </span>
                    <span class="opClose"
                          v-if="item.status === 5 && talkStatus"
                          @click="stopTalking(item, index)">
                      <span>
                        <span class="size">开</span>
                      </span>
                      <span class="active">
                        <span class="size">关</span>
                      </span>
                    </span>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="输出设备"
                                  name="4">
                  <div v-for="(item, index) in output"
                       :key="index"
                       class="name">
                    <span class="name-title">
                      <span class='icon-background'
                            style="background:#FF0000">
                        <span class="iconfont-ccb ccbbaojingjibie"
                              style="padding-left:1px"></span>
                      </span>
                      <el-tooltip class="item"
                                  effect="dark"
                                  :content="item.name"
                                  placement="top-start">
                        <span>{{ item.name }}</span>
                      </el-tooltip>
                    </span>
                    <span class="opClose"
                          v-if="item.status === 1"
                          @click="alarmAccessOpen(item, index)">
                      <span class="active">
                        <span class="size">开</span>
                      </span>
                      <span>
                        <span class="size">关</span>
                      </span>
                    </span>
                    <span class="opClose"
                          v-if="item.status === 2"
                          @click="alarmAccessClose(item, index)">
                      <span>
                        <span class="size">开</span>
                      </span>
                      <span class="active">
                        <span class="size">关</span>
                      </span>
                    </span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <dialog-info v-if="showDialogInfo"
                 :showDialogInfo="showDialogInfo"
                 :nodeData="orgData"
                 @closeDialogInfo="closeDialogInfo"></dialog-info>
  </div>
</template>
<script>
import socket from '../../socket/alarm'
import {
  getTreeApi,
  listInfoApi,
  downloadChanne,
  ctldoorChannelApi,
  getPing,
  getMacApi,
  channelStartTalkApi,
  channelCloseTalkApi,
  getAccessChannelApi,
  getRelationChannelApi,
  getAccessChannelStatusApi,
  openAlarmoutputs,
  closeAlarmoutputs,
  getAlarmoutputs,
  addHostChannelGetApi,
  getTalk,
  mistsSearch,
} from '../../http/protectiveCabin/channe.api'
import { time } from '@src/view/accessControl/components/formData.js'
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import treeBox from '@src/components/tree/treeBox'
import { download } from '@src/common/download.js'
import DialogInfo from './components/DialogInfo'
// import DialogInfo from '@src/view/videoManage/components/DialogInfo'
import {
  audioLink,
  startTalking,
  stopTalking,
  ctlalarmoutput,
  alarmoutputs,
} from '@src/http/InterlockingDoor/linkedAirlockLog.api'
export default {
  components: {
    previewPlugin,
    VideoPagination,
    treeBox,
    DialogInfo,
  },

  //转换推送报警时间戳
  filters: {
    toTiME: function (value) {
      if (!value) return ''
      let val
      val = (value + '000') * 1
      return time(val)
    },
  },
  data() {
    return {
      isEqu: false, //当前点击是否为主机点击
      equData: {}, //主机信息
      showDialogInfo: false, // 展示机构节点信息弹窗
      orgData: {}, // 机构节点信息
      isNeedModal: false,
      moduleType: 5,
      messageEd: {},
      activeName: 'first',
      page: 1,
      limit: 25,
      activeNames: ['1', '2', '3', '4'],
      isShowTable: false,
      isShowControl: false, //弹框
      fn: null,
      defaultPane: 4, // 默认显示4窗格
      protectiveCabinNum: 0,
      someOne: 0,
      noOne: 0,
      offline: 0,
      aisleTableData: [], //获取列表数据
      downloadObject: [], //导出列表数据
      cityDataObj: {
        //获取列表参数
        type: 1,
      },
      treeType: 1,
      aisleTableColumn: [
        // 表格标题行内容
        { prop: 'name', label: '防护舱通道', width: '', sortable: 'true' },
        { prop: 'deviceName', label: '所属防护舱主机', width: '', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '', sortable: 'true' },
        { prop: 'orgName', label: '所属机构', width: '', sortable: 'true' },
        { prop: 'status', label: '防护舱通道状态', width: '', sortable: 'true' },
      ],
      managementTableData: [],
      managementTableColumn: [
        // 表格标题行内容
        { prop: 'resourceName', label: '防护舱通道', width: '' },
        { prop: 'deviceName', label: '所属设备', width: '' },
        { prop: 'locationName', label: '所属重点部位', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'eventTypeName', label: '事件类型', width: '' },
      ],
      alarmTableData: [],
      alarmTableColumn: [
        // 表格标题行内容
        { prop: 'resourceName', label: '防护舱通道', width: '' },
        { prop: 'deviceName', label: '所属设备', width: '' },
        { prop: 'locationName', label: '所属重点部位', width: '' },
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'eventTypeName', label: '报警类型', width: '' },
      ],
      managementTitle: 0, //事件总条数
      alarmTitle: 0, //警告总条数
      item: {}, //每一项参数
      video: [], //视频列表
      audio: [], //音频列表
      cabin: [], //防护舱列表
      output: [], //输出列表
      getChannelIdDoorList: [], //获取指定防护舱通道关联主机【开门、关门等操作】
      checked: true, //包含下属机构
      seqId: '', //关闭对讲
      myMikeIdData: '', //本机Mike
      policeTotal: 0, //报警分页总数
      policePagesize: 60, //报警分页
      policeCurrentPage: 1, //报警分页
      eventTotal: 0, //事件分页
      eventPagesize: 60, //时间发分页
      eventCurrentPage: 1, //事件分页
      message: {}, //当前页信息
      showControl: true,
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Videotape' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' }, // 检查记录
      ],
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'ScreenShot',
        },
        {
          type: 'left',
          index: 1,
          name: 'Videotape',
        },
        {
          type: 'left',
          index: 2,
          name: 'Speech',
        },
        {
          type: 'left',
          name: 'NiaoKan',
          index: 3,
        },
        {
          type: 'left',
          index: 4,
          name: 'Lunxun',
        },
        {
          type: 'left',
          name: 'Attention',
          index: 5,
        },
        {
          type: 'left',
          name: 'checkRecode',
          index: 6,
        },
        {
          type: 'left',
          index: 7,
          name: 'Collect',
        },
        {
          type: 'left',
          name: 'Volume',
          index: 8,
        },
        {
          type: 'right',
          name: 'FullScreen',
          index: 0,
        },
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1,
        },
        {
          type: 'right',
          name: 'ViewPattern',
          index: 2,
        },
        {
          type: 'right',
          name: 'Stream',
          index: 3,
        },
        {
          type: 'right',
          name: 'StopAll',
          index: 4,
        },
        {
          type: 'right',
          name: 'Stop',
          index: 5,
        },
        { type: 'right', slotName: 'rightBtn', index: 0, width: '260px' },
      ],
      pluginIconShow: {
        showBottomIcon: true, // 图标按钮条
        hidemenuIcon: true, // 隐藏
        previewStopIcon: true, // 关闭预览
        centreRecordIcon: true, // 紧急录像
        isRecordingIcon: true, // 录像类型
        streamChangeIcon: true, // 码流切换
        screenshot: true, // 截图
        muteIcon: true, // 开启伴音
        yuntaiIcon: true, // 云台
        speechIcon: true, // 对讲
        niaokanIcon: true, // 开启鸟瞰
        tvwallIcon: true, // 快速上墙
        quickRecodeIcon: true, // 快速回放
        videoCheckIcon: true, // 视频复核
        // detailsIcon: true, // 详情
        quanpingfangdaIcon: true, // 全屏
      },
      defaultPane: 4,
      selectRes: '',
      deviceType: [],
      status: '',
      ststusDis: false,
      timer: null,
      talkStatus: false, //对讲可用与否
    }
  },
  created() {
    this.getTableColumn(), // 获取事件/报警列表  websocked
      this.useState() //统计指定机构/重点部位防护舱通道状态
    // 实现轮询
    this.timer = window.setInterval(() => {
      setTimeout(this.getststsusData(), 0)
    }, 10000)
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      if (this.seqId) {
        channelCloseTalkApi({ seqId: this.seqId, myMikeId: this.myMikeIdData }).then((res) => {
          getTalk({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            this.audio[index].status = res.data.data.status
          })
        })
      }
      // ...
    },
    clickInfo(data) {
      // 机构树详细信息
      this.orgData = data
      this.showDialogInfo = true
    },

    closeDialogInfo() {
      this.showDialogInfo = false
    },

    // 刷新树
    async refresh() {
      let status = await this.$refs.treeDiv.refresh()
      if (status === 1) {
        this.$message('刷新成功')
      } else {
        this.$message('列表刷新失败')
      }
    },

    //轮询刷新状态
    getststsusData() {
      if (this.isEqu) {
        listInfoApi(this.equData.id).then((res) => {
          res.data.data.cabinChannels.forEach((item, index) => {
            item.index = index + 1
            if (item.status === 1) {
              item.status = '无人'
            } else if (item.status === 2) {
              item.status = '有人'
            } else {
              item.status = '未知'
            }
          })
          this.aisleTableData = res.data.data.cabinChannels
        })
      } else {
        this.getAccessChannelData(this.status)
      }
      this.useState()
    },

    changeDefaultPane(val) {
      this.defaultPane = val
    },

    //点击查询主机
    onceClick(data, node) {
      if (data.tierType === 'equ') {
        this.isEqu = true
        this.equData = data
        listInfoApi(data.id).then((res) => {
          res.data.data.cabinChannels.forEach((item, index) => {
            item.index = index + 1
            if (item.status === 1) {
              item.status = '无人'
            } else if (item.status === 2) {
              item.status = '有人'
            } else {
              item.status = '未知'
            }
          })
          this.aisleTableData = res.data.data.cabinChannels
        })
        this.useState()
      } else {
        this.isEqu = false
      }
    },

    //ping功能
    pingFunc(ip) {
      // ping功能
      getPing({ ipAddr: ip }).then((res) => {
        if (res.data.data && res.data.data.status === 1) {
          this.$messageSuccess('成功!')
        } else {
          this.$messageError('失败!')
        }
      })
    },

    //报警跳转至报警界面
    alarmRouter() {
      this.$router.push({ path: '/intelligentSecurity/warnn/alarmDeal' })
    },

    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 5,
        key: params.search,
      }
      return mistsSearch(params)
    },

    //列表类展开弹框
    handledbClick(row) {
      let length = row.index
      this.isShowAisleControl(this.aisleTableData[length - 1])
    },

    // 报警开启
    alarmAccessOpen(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          if (res.data.code === '0') {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        openAlarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then(
          (res) => {
            if (res.data.data.code === '0') {
              this.$messageSuccess('开启成功!')
              getAlarmoutputs({
                devIp: item.deviceIp,
                devPort: item.devicePort,
                channelList: [Number(item.serise)],
              }).then((res) => {
                this.output[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
              })
              // this.output[index].status = 2
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        )
      } else if (item.subSystem === 4) {
        this.$messageError('音频输出通道暂无')
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'open' }).then((res) => {
          if (res.data.data.code === '0') {
            this.$messageSuccess('通道开启!')
            // addHostChannelGetApi({ id: this.item.id, type: 3 }).then((res) => {
            //   console.log(res.data)
            // })
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },

    // 报警关闭
    alarmAccessClose(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: false }] }).then((res) => {
          if (res.data.code === '0') {
            this.$messageSuccess('关闭成功!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        closeAlarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then(
          (res) => {
            if (res.data.data.code === '0') {
              this.$messageSuccess('关闭成功!')
              getAlarmoutputs({
                devIp: item.deviceIp,
                devPort: item.devicePort,
                channelList: [Number(item.serise)],
              }).then((res) => {
                this.output[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
              })
              this.output[index].status = 1
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        )
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'close' }).then((res) => {
          if (res.data.data.code === '0') {
            this.$messageSuccess('通道关闭!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },

    //防护舱报警分页
    policeHandleSizeChange(size) {
      this.policePagesize = size
    },

    //防护舱报警分页
    policeHandleCurrentChange(currentPage) {
      this.policeCurrentPage = currentPage
    },

    //防护舱事件分页
    eventHandleSizeChange(size) {
      this.eventPagesize = size
    },

    //防护舱事件分页
    eventHandleCurrentChange(currentPage) {
      this.eventCurrentPage = currentPage
    },

    //防护舱列表分页
    paginationConfChange(data) {
      this.limit = data.limit
      this.page = data.page
      this.getAccessChannelData()
    },

    //弹框关闭
    handleClose(done) {
      this.fn = done
      this.isShowControl = false
      //关闭对讲
      if (this.seqId) {
        channelCloseTalkApi({ seqId: this.seqId, myMikeId: this.myMikeIdData }).then((res) => {
          getTalk({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            this.audio[index].status = res.data.data.status
          })
        })
      } else {
        this.$messageError('对讲正在使用，无法关闭')
      }
      if (!this.isShowControl) {
        done()
      }
    },

    //视频开流
    preview(val) {
      let data = {}
      if (val.deviceType === 5) {
        data = {
          channel: val.serise,
          devIp: val.ip,
          devCport: val.cport,
          devDport: val.dport,
          streamType: val.subSystem === 1 ? 'main' : val.subSystem === 2 ? 'sub1' : 'sub2',
          subType: val.class,
          dId: val.id,
          id: val.id,
          orgName: val.orgName,
          keypartName: val.keyPartName,
          deviceName: val.deviceName,
          name: val.name,
        }
      } else {
        data = {
          channel: val.serise,
          devIp: val.deviceIp,
          devCport: val.deviceCport || val.devicePort,
          devDport: val.deviceDport,
          streamType: val.subSystem === 1 ? 'main' : val.subSystem === 2 ? 'sub1' : 'sub2',
          subType: val.class,
          dId: val.id,
          id: val.id,
          orgName: val.orgName,
          keypartName: val.keyPartName,
          deviceName: val.deviceName,
          name: val.name,
        }
      }
      this.$refs.preview.openPreview(data)
    },

    //关闭弹框的事件
    closeDialog() {
      this.video = [] //视频列表
      this.audio = [] //音频列表
      this.guard = [] //门禁列表
      this.output = [] //输出列表
      this.getAccessChannelData()
    },

    //包含下属机构
    checkChange(checked) {
      this.getAccessChannelData()
    },

    //树
    getTreeApi(params) {
      return getTreeApi(params)
    },

    //树  点击事件
    playBackGetData(node) {
      if (JSON.stringify(node) !== '{}') {
        this.messageEd = node
      }
      if (node.tierType == 'org') {
        this.cityDataObj.orgId = node.id
        delete this.cityDataObj.keyPartId
        this.getAccessChannelData()
        this.useState()
      } else if (node.tierType == 'loc') {
        this.cityDataObj.keyPartId = node.id
        delete this.cityDataObj.orgId
        this.getAccessChannelData()
        this.useState()
      }
    },

    //获取重点部位列表
    getAccessChannelData(num) {
      let body = {
        page: this.page,
        limit: this.limit,
        rescusive: this.checked,
        ...this.cityDataObj,
      }
      if (num) {
        this.status = num
        body.status = num
      }
      getAccessChannelApi(body).then((res) => {
        if (res.data.data) {
          res.data.data.channels.forEach((item, index) => {
            item.index = index + 1
            if (item.status === 1) {
              item.status = '无人'
            } else if (item.status === 2) {
              item.status = '有人'
            } else {
              item.status = '未知'
            }
          })
          this.aisleTableData = res.data.data.channels
        }
      })
    },

    //统计指定机构/重点部位防护舱通道状态
    useState() {
      let obj = {
        rescusive: this.checked,
        orgId: this.cityDataObj.orgId,
        keyPartId: this.cityDataObj.keyPartId,
      }
      getAccessChannelStatusApi(obj).then((res) => {
        this.protectiveCabinNum = res.data.data.total
        this.someOne = res.data.data.useCount
        this.noOne = res.data.data.unuseStatus
        this.offline = res.data.data.unknowStatus
      })
      // 防护仓通道:protectiveCabinNum 有人：someOne   无人:noOne  离线：offline
    },

    //页面切换
    isShowAisleTable() {
      this.isShowTable = !this.isShowTable
    },

    // 列表勾选
    selectChange(select, row) {
      this.downloadObject = select //导出赋值
    },

    //列表模式下载
    getTabList() {
      const { export_json_to_excel } = require('../../common/vendor/Export2Excel')
      const tHeader = ['序号', '防护舱通道', '所属防护舱主机', '所属重点部位', '所属机构', '防护舱通道状态']
      const filterVal = ['index', 'name', 'deviceName', 'keyPartName', 'orgName', 'status']
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(
          tHeader,
          data,
          `防护舱通道列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else if (this.downloadObject.length == 0) {
        let body = {
          rescusive: this.checked,
          ...this.cityDataObj,
        }
        if (this.status) {
          body.status = this.ststus
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/cabin/channel/download`
        let name = `防护舱通道列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          body
        )
        // list = this.aisleTableData
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    //开弹框
    isShowAisleControl(item) {
      this.isShowControl = true
      this.video = []
      this.item = item
      this.audio = []
      this.output = []
      //获取指定防护舱主机/通道联动配置
      getRelationChannelApi({ id: item.id, type: { ref: '2' } }).then((res) => {
        if (res.data.data) {
          //视频通道
          this.video = res.data.data.video
          //默认开流前四个
          if (this.video.length > 0) {
            this.video.forEach((item, index) => {
              if (index < 4) {
                this.preview(item)
              }
            })
          }

          //防护舱通道
          res.data.data.cabin.splice(0, 0, { name: item.name || item.resourceName, id: item.id || item.resourceId })
          // //防护舱开关门赋值状态
          res.data.data.cabin.forEach((item) => {
            item.types = false
          })
          this.cabin = res.data.data.cabin

          //音频通道
          res.data.data.audio.forEach((item) => {
            getTalk({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
              item.status = res.data.data.status
            })
          })
          this.audio = res.data.data.audio

          //输出通道
          this.output = res.data.data.output
          if (this.output.length > 0) {
            this.output.forEach((item, index) => {
              if (item.subSystem === 2) {
                getAlarmoutputs({
                  devIp: item.deviceIp,
                  devPort: item.devicePort,
                  channelList: [Number(item.serise)],
                }).then((res) => {
                  if (res.data.data.code === '0') {
                    this.output[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
                  }
                })
              }
            })
          }
        }
      })

      //获取本地mac地址
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      getMacApi({ mac }).then((res) => {
        if (res.data.code === 0) {
          if (JSON.stringify(res.data.data) !== JSON.stringify({})) {
            this.talkStatus = true
            this.myMikeIdData = res.data.data.id
          } else {
            this.talkStatus = false
          }
        }
      })
    },

    //报警弹框
    isShowAlarm(row) {
      this.message = row
      this.isShowControl = true
      // //id详情
      // this.$store.dispatch('getAccessChannelId', { id: row.resourceId })
      //获取指定防护舱通道关联主机【开门、关门等操作】
      // this.getChannelIdDoor({ id: row.resourceId }).then((res) => {
      //   this.getChannelIdDoorList = res.data.data
      // })
      // //获取指定防护舱主机/通道联动配置
      getRelationChannelApi({ id: row.resourceId, type: { ref: '2' } }).then((res) => {
        if (res.data.data) {
          this.video = res.data.data.video
          this.guard = res.data.data.guard
          this.audio = res.data.data.audio
          this.output = res.data.data.output
        }
      })
    },

    //关弹框
    ShowControl() {
      this.getChannelIdDoorList = {}
      this.item = {}
      this.video = []
      this.guard = []
      this.audio = []
      this.output = []
      this.isShowControl = false
    },

    //远程开门
    unlock(index) {
      console.log(this.cabin[index].types)
      this.cabin[index].types = true
      console.log(this.cabin)
      window.setTimeout(() => {
        this.cabin[index].types = false
      }, '5000')
      ctldoorChannelApi({
        cabinId: this.cabin[index].id || this.message.resourceId,
        cabinType: 'unlock',
      }).then((res) => {
        if (res.data.data.code === '0') {
          this.$messageSuccess('远程开门成功')
        } else {
          this.$messageError(res.data.data.message)
        }
      })
    },

    //强制闭锁
    forceLock(index) {
      this.cabin[index].types = true
      window.setTimeout(() => {
        this.cabin[index].types = false
      }, '5000')
      ctldoorChannelApi({
        cabinId: this.cabin[index].id || this.message.resourceId,
        cabinType: 'forceLock',
      }).then((res) => {
        if (res.data.data.code === '0') {
          this.$messageSuccess('强制闭锁成功')
        } else {
          this.$messageError(res.data.data.message)
        }
      })
    },

    //解除闭锁
    forceUnlock(index) {
      this.cabin[index].types = true
      window.setTimeout(() => {
        this.cabin[index].types = false
      }, '5000')
      ctldoorChannelApi({
        cabinId: this.cabin[index].id || this.message.resourceId,
        cabinType: 'forceUnlock',
      }).then((res) => {
        if (res.data.data.code === '0') {
          this.$messageSuccess('解除闭锁成功')
        } else {
          this.$messageError(res.data.data.message)
        }
      })
    },

    //开始对讲
    startTalking(item, index) {
      //开始对讲
      channelStartTalkApi({ myMikeId: this.myMikeIdData, calledpanelIds: item.id }).then((res) => {
        if (res.data.data.ret_code === 0) {
          // this.audio[index].status = 1
          this.seqId = res.data.data.seqId
          getTalk({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            this.audio[index].status = res.data.data.status
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          })
        }
      })
    },

    //关闭对讲
    stopTalking(item, index) {
      //关闭对讲
      if (this.seqId) {
        channelCloseTalkApi({ seqId: this.seqId, myMikeId: this.myMikeIdData }).then((res) => {
          getTalk({ deviceId: item.deviceId, channelSerise: item.serise }).then((res) => {
            this.audio[index].status = res.data.data.status
          })
        })
      } else {
        this.$messageError('对讲正在使用，无法关闭')
      }
    },

    // 获取事件/报警列表  websocked
    getTableColumn() {
      socket.on('alarmProtectionCabin', (data) => {
        this.alarmTableData.push(data.alarmInfo)
        this.policeTotal = this.alarmTableData.length
      }),
        socket.on('eventProtectionCabin', (data) => {
          this.managementTableData.push(data.alarmInfo)
          this.eventTotal = this.managementTableData.length
        })
    },
  },
  //websocked销毁
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
    socket.remove('alarmProtectionCabin', (data) => {
      // console.log(data)
    })
    socket.remove('eventProtectionCabin', (data) => {
      // console.log(data)
    })
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>
<style lang="less" scoped>
.airlockControl {
  width: 100%;
  height: 100%;
  display: flex;
  .airlockControl-left {
    width: 290px;
    height: 100%;
    background: #fff;
    z-index: 1;
    padding-top: 10px;
    box-sizing: border-box;
    .tree-type {
      display: inline-block;
      width: 100%;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: rgba(245, 245, 245, 1);
      color: #333;
      font-size: 14px;
      margin-bottom: 14px;
      font-weight: 400;
      position: relative;
      .refresh {
        position: absolute;
        right: 15px;
        cursor: pointer;
      }
    }
    .tree-box {
      height: calc(~'100% - 52px');
      width: 100%;
      overflow: auto;
      padding: 0 9px;
      box-sizing: border-box;
      .treeBox {
        height: calc(~'100% - 4px');
      }
    }
  }
  .airlockControl-right {
    background: #eaeef3;
    width: calc(~'100% - 290px');
    height: 100%;
    padding: 6px 6px 3px 7px;
    box-sizing: border-box;
    .airlock-content {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 0 23px 0 29px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .now-position {
        margin: 17px 0px 35px 0px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        display: inline-block;
        .now-span {
          color: #2d72d3;
        }
      }
      .now-state {
        display: flex;
        width: 100%;
        height: 13px;
        align-items: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 12px;
        .sign {
          height: 12px;
          width: 2px;
          background: #2d72d3;
          margin-right: 5px;
        }
        .state {
          margin-right: 20px;
          cursor: pointer;
          /deep/ .el-checkbox__label {
            font-size: 12px;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
      .header-change {
        display: inline-block;
        width: 100%;
        position: relative;
        .line-change {
          display: inline-block;
          width: 1508px;
          height: 1px;
          background: #e1e1e1;
        }
        .change-icon {
          display: inline-block;
          width: 37px;
          height: 35px;
          position: absolute;
          border: 1px solid rgba(158, 173, 193, 1);
          border-radius: 2px;
          right: 0;
          top: -6px;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            color: #333;
            font-size: 23px;
            font-weight: 600;
            cursor: pointer;
          }
        }
      }
      .table-list {
        height: 484px;
        width: 100%;
        .query {
          margin-bottom: 5px;
        }
        .list-box {
          padding-top: 28px;
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          overflow: auto;
          display: flex;
          flex-wrap: wrap;
          .door-box {
            width: 209px;
            height: 110px;
            box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
            padding: 5px;
            box-sizing: border-box;
            margin-left: 2px;
            position: relative;
            margin-right: 12.6px;
            margin-bottom: 30px;
            .door {
              width: 100%;
              height: 50px;
              display: inline-block;
              padding: 7px 0px 7px 11px;
              box-sizing: border-box;
              display: flex;
              background: #d1f1fc;
              .door-img {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 5px;
                background: #33acd6;
                i {
                  font-size: 30px;
                  color: #fff;
                }
              }
              .message-door {
                display: flex;
                flex-direction: column;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 13px;
                span {
                  width: 110px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                span:first-child {
                  margin: 3px 0px 5px 0px;
                }
              }
            }
            .message {
              width: 119px;
              padding-left: 14px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              display: block;
              margin: 8px 0;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
            }
            .link-button {
              position: absolute;
              width: 75px;
              height: 25px;
              border: 1px solid rgba(158, 173, 193, 1);
              border-radius: 2px;
              bottom: 11px;
              right: 11px;
              text-align: center;
              line-height: 25px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              cursor: pointer;
            }
          }
          .door-box:nth-child(7n + 0) {
            margin-right: 0px;
          }
        }
      }
      .footer {
        height: calc(~'100% - 593px');
        width: 100%;
        .footer-table {
          height: 100%;
          /deep/.el-tabs {
            height: calc(~'100% - 1px');
            .el-tabs__header {
              border-bottom: 1px solid #e1e1e1;
              .el-tabs__nav-wrap {
                .el-tabs__nav-scroll {
                  .el-tabs__nav {
                    border-radius: 0;
                    border: none;
                    .el-tabs__item {
                      border-top-color: #fff;
                      border-left: 1px solid #fff;
                      border-right: 1px solid #fff;
                    }
                    .is-active {
                      position: relative;
                      border-left: 1px solid #e1e1e1;
                      border-right: 1px solid #e1e1e1;
                    }
                    .is-active::after {
                      content: '';
                      display: block;
                      width: 110px;
                      height: 2px;
                      background: #2d72d3;
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    }
                  }
                }
              }
            }
            .el-tabs__content {
              height: calc(~'100% - 55px');
              .el-tab-pane {
                height: 100%;
              }
              .el-pagination {
                height: 29px;
              }
            }
          }
          /deep/ .el-table {
            .el-table__header-wrapper {
              font-size: 12px;
            }
            .el-table__body-wrapper {
              font-size: 12px;
              .el-link--inner {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
/deep/ .v-modal {
  z-index: 90 !important;
}
/deep/ .el-dialog__wrapper {
  z-index: 100 !important;
}
/deep/ .dialog-message {
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 687px;
  .el-dialog__header {
    height: 54px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e1e1e1;
    padding: 0;
    line-height: 54px;
    display: flex;
    align-items: center;
    .el-dialog__title {
      font-size: 14px;
      color: #333;
    }
    .dialog-footer {
      width: calc(~'100% - 16px');
    }
  }
  .el-dialog__body {
    height: calc(~'100% - 54px');
    padding: 0;

    .message-content {
      display: flex;
      justify-content: space-between;
      height: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      .con-left {
        width: 828px;
        height: 100%;
        border-right: 1px solid #e1e1e1;
        .video-top {
          height: 516px;
          width: 100%;
        }
        .message-footer {
          width: 100%;
          border-top: 1px solid #e1e1e1;
          min-height: 95px;
          padding-top: 11px;
          box-sizing: border-box;
          display: flex;
          padding-bottom: 10px;
          justify-content: space-between;
          .message-list {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            .title {
              margin-bottom: 13px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              position: relative;
            }
            .title::after {
              content: '';
              display: block;
              width: 2px;
              height: 12px;
              background: #2d72d3;
              position: absolute;
              left: -10px;
              top: 2px;
            }
            .message {
              span {
                display: inline-block;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 24px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
              span:nth-child(1) {
                width: 180px;
                margin-right: 50px;
              }
              span:nth-child(2) {
                width: 268px;
                margin-right: 50px;
              }
            }
          }
        }
      }
      .con-right {
        width: 223px;
        height: 651px;
        .tab-top {
          width: 100%;
          height: 490px;
          overflow: auto;
          /deep/ .el-collapse {
            border-top: none;
            border-bottom: none;
            .el-collapse-item {
              .el-collapse-item__header {
                height: 24px;
                font-size: 12px;
                padding-bottom: 10px;
                box-sizing: border-box;
                border-bottom: 1px solid #e1e1e1;
                margin-bottom: 5px;
              }
              .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                  padding: 0;
                  .isBor {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 13px;
                    cursor: pointer;
                    display: flex;
                    i {
                      margin-right: 8px;
                    }
                    span {
                      width: 181px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                  }
                  .name {
                    display: flex;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin: 9px 0px 16px 0;
                    line-height: 19px;
                    cursor: pointer;
                    justify-content: space-between;
                    .span-button {
                      margin-top: 10px;
                      display: flex;
                      /deep/ .el-button {
                        width: 67px;
                        height: 12px;
                        font-size: 13px;
                        display: flex;
                        padding: 12px;
                        justify-content: center;
                        align-items: center;
                        line-height: 2px;
                      }
                    }
                    .name-title {
                      display: flex;
                      .icon-background {
                        width: 18px;
                        height: 18px;
                        display: inline-block;
                        border-radius: 50%;
                        text-align: center;
                        margin-right: 6px;
                        .iconfont-ccb {
                          font-size: 12px;
                          color: #fff;
                          padding-left: 2px;
                        }
                      }
                      // i {
                      //   line-height: 19px;
                      //   color: #fff;
                      // }
                      span {
                        width: 140px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                    }
                    .opClose {
                      width: 49px;
                      height: 19px;
                      display: flex;
                      border: 1px solid rgba(45, 114, 211, 1);
                      border-radius: 9px;
                      color: #666;
                      background: #fff;
                      .size {
                        display: block;
                        font-size: 10px;
                        transform: scale(0.83);
                        width: 100%;
                        height: 100%;
                        text-align: center;
                      }
                      span {
                        width: 50%;
                        text-align: center;
                        line-height: 19px;
                        font-size: 10px;
                      }
                      span:nth-child(1) {
                        border-top-left-radius: 9px;
                        border-bottom-left-radius: 9px;
                      }
                      span:nth-child(2) {
                        border-top-right-radius: 9px;
                        border-bottom-right-radius: 9px;
                      }
                      .active {
                        background: #2d72d3;
                        color: #fff;
                      }
                    }
                    .audo {
                      font-size: 16px;
                    }
                  }
                }
              }
            }
          }
        }
        .footer-close {
          width: 100%;
          height: calc(~'100% - 490px');
          border-top: 1px solid #e1e1e1;
          display: flex;
          align-items: center;
          justify-content: center;
          /deep/ .el-button {
            font-size: 12px;
          }
        }
      }
    }
  }
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  .left {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ddd;
    span {
      width: 100%;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #ccc;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrapx;
      overflow: hidden;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    span {
      width: 100%;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #333;
      text-indent: 20px;
      text-overflow: ellipsis;
      white-space: nowrapx;
      overflow: hidden;
      i {
        color: #409eff;
        cursor: pointer;
        margin-left: 15px;
      }
    }
  }
  .info-item {
    width: 50%;
    height: 40px;
    line-height: 40px;
    display: flex;
    .info-key {
      width: 120px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .info-value {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  // z-index: -2;
  top: 0;
  left: 0;
}
</style>