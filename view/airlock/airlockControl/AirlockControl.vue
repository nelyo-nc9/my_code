<template>
  <div class="airlockControl">
    <!-- 左侧 -->
    <section class="airlockControl-left">
      <span class="tree-type">机构
        <span class="refresh icon iconfont-ccb ccbicon"
              @click="refresh"></span>
      </span>
      <div class="tree-box">
        <treeBox ref="treeDiv"
                 :lazyTreeApi="getTree"
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
    <!-- 右侧 -->
    <div class="airlockControl-right">
      <div class="airlock-content">
        <span class="now-position">
          <span>智慧安防 ></span>
          <span>互锁门管理 ></span>
          <span class="now-span">互锁门控制</span>
        </span>
        <span class="now-state">
          <span class="sign"></span>
          <span class="state"
                @click="getTableList(1)">
            联动互锁门：<span>{{ doorTotal }}</span>
          </span>
          <span class="state"
                @click="getTableList(2)">
            正常：<span>{{ normal }}</span>
          </span>
          <span class="state"
                @click="getTableList(3)">
            异常：<span>{{ abnormal }}</span>
          </span>
          <span class="state"
                @click="getTableList(4)">
            未知：<span>{{ offLine }}</span>
          </span>
          <span class="state">
            <el-checkbox-group v-model="type"
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
                         @click="exportFile">下载</el-button>
            </div>
            <!-- 表格 -->
            <el-table :data="dataTable"
                      style="width: 100%"
                      height="393px"
                      :default-sort="{ prop: 'date', order: 'descending' }"
                      align="left"
                      @selection-change="selectChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"
                               align="left"
                               width="120px"></el-table-column>
              <el-table-column prop="ChannelA"
                               label="门禁通道A"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="stateA"
                               label="状态"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="ChannelB"
                               label="门禁通道B"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="stateB"
                               label="状态"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="deviceName"
                               label="所属门禁主机"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="keyPartName"
                               label="所属重点部位"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="orgName"
                               label="所属机构"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
              <el-table-column prop="isGuardLink"
                               label="门禁通道状态"
                               align="left"
                               show-overflow-tooltip
                               sortable></el-table-column>
            </el-table>
            <video-pagination ref="listPagination"
                              :total="total"
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
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item[0].name"
                              placement="top-start">
                    <span>{{ item[0].name }}</span>
                  </el-tooltip>
                  <!-- <tooltip-over :content="item[0].name"
                                class="wid190"
                                refName="tooltipOver"></tooltip-over> -->
                  <span>{{ item[0].status === 1 ? '关门' : item[0].status === 2 ? '开门' : '未知' }}</span>
                </span>
              </span>
              <span class="door">
                <span class="door-img">
                  <i class="icon iconfont-ccb ccbmenjiachaojian"></i>
                </span>
                <span class="message-door">
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item[1].name"
                              placement="top-start">
                    <span>{{ item[1].name }}</span>
                  </el-tooltip>
                  <span>{{ item[1].status === 1 ? '关门' : item[1].status === 2 ? '开门' : '未知' }}</span>
                </span>
              </span>
              <span class="message">{{ item[0].deviceName }}</span>
              <span class="message">{{ item[1].keyPartName }}</span>
              <span class="message">状态：{{
                  item[0].status === 3 || item[1].status === 3
                    ? '未知'
                    : item[0].status === item[1].status && item[0].status === 2
                    ? '异常'
                    : '正常'
                }}</span>
              <!-- <span class="link-button"
                    @click="linkEquipment(item)">关联控制</span> -->
            </div>
          </div>
        </div>
        <div class="footer">
          <ControlTabs class="control-tabs"></ControlTabs>
        </div>
      </div>
    </div>
    <!-- <el-dialog title="联动互锁门控制"
               :visible.sync="dialogVisible"
               width="1115px"
               custom-class="dialog-message"
               :before-close="handleClose"
               top="12vh"
               append-to-body
               v-if="dialogVisible"
               @close="closeDialog"
               :close-on-click-modal="false"
               :showClose="false"
               >
      <iframe v-if="dialogVisible"
              style="width:100%;height: 100%;position:absolute;top:0;left: 0;z-index: -2;"></iframe>
      <div class="message-content">
        <div class="con-left">
          <div class="video-top">
            <preview-plugin :defaultPane="defaultPane"
                            :iconShow="iconShowParams"
                            ref="preview"></preview-plugin>
          </div>
          <div class="message-footer">
            <div class="message-list"
                 v-for="(item, index) in isMessage"
                 :key="index">
              <span class="title"> {{ item.name }}</span>
              <span class="message">
                <span>所属机构：{{ item.orgName }}</span>
                <span>型号：{{ item.modelNum }}</span>
              </span>
              <span class="message">
                <span>所属重点部位：{{ item.keyPartName }}</span>
                <span>品牌：{{ item.brand }}</span>
              </span>
              <span class="message">
                <span>所属门禁主机：{{ item.deviceName }}</span>
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
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item.name"
                              placement="top-start">
                    <span @click="preview(item)">{{ item.name }}</span>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="互锁门控制"
                                name="2">
                <div v-for="(item, index) in guard"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-refrigerator"></i>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.name"
                                placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose"
                        v-if="item.status !== 2"
                        @click="openDoor(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose"
                        v-if="item.status === 2"
                        @click="closeDoor(item, index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲控制"
                                name="3">
                <div v-for="(item, index) in audio"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-microphone"></i>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.name"
                                placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="audo"
                        style="display:flex">
                    <i class="el-icon-microphone"
                       v-if="item.status === 2"
                       @click="startTalking(item, index)"></i>
                    <i class="el-icon-turn-off-microphone"
                       v-else
                       @click="stopTalking(item, index)"></i>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="输出设备"
                                name="4">
                <div v-for="(item, index) in output"
                     :key="index"
                     class="name">
                  <span class="name-title">
                    <i class="el-icon-location-outline"></i>
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
          <div class="footer-close">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->
    <dialog-info v-if="showDialogInfo"
                 :showDialogInfo="showDialogInfo"
                 :nodeData="orgData"
                 @closeDialogInfo="closeDialogInfo"></dialog-info>
  </div>
</template>
<script>
import ControlTabs from '../components/ControlTabs'
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
import { mapState, mapActions, mapMutations } from 'vuex'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
import DialogInfo from '@src/view/videoManage/components/DialogInfo'
import {
  getChannelList,
  linkageConfiguration,
  openDoor,
  closeDoor,
  startTalking,
  stopTalking,
  getTreeApi,
  alarmOpen,
  AlarmClose,
  audioLink,
  getPlatform,
  getStatus,
  getAppointHost,
  alarmoutput,
  ctlalarmoutput,
  alarmoutputs,
  closeAlarmoutputs,
  getPing,
  mistsSearch,
} from '@src/http/InterlockingDoor/linkedAirlockLog.api'
import { getResourceInfoApi, getDeviceInfoApi, getLocOrOrgInfoApi } from '@src/http/video/videoConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'airlock-control',
  components: { ControlTabs, treeBox, previewPlugin, VideoPagination, DialogInfo },
  data() {
    return {
      showDialogInfo: false, // 展示机构节点信息弹窗
      orgData: {}, // 机构节点信息
      isNeedModal: false,
      timer: null,
      status: '',
      dialogVisible: false,
      treeType: 1,
      activeNames: ['1', '2', '3', '4'],
      fn: null,
      isShowCheckBox: false, // 是否显示机构树的复选框
      type: true,
      doorImg: '../../../static/protectiveCabin/u38.png',
      aisleTableData: [],
      isShowTable: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      defaultPane: 4, // 默认显示4窗格
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
      isMessage: [],
      doorTotal: 0,
      normal: 0,
      offLine: 0,
      abnormal: 0,
      dataTable: [],
      total: 0,
      page: 1,
      limit: 25,
      messageEd: {},
      video: [], //视频列表
      audio: [], //音频列表
      guard: [], //门禁列表
      output: [], //输出列表
      seqId: '',
      myMikeIdData: '',
      myMikeIdDatas: '',
      downloadObject: [],
      treeDataMessage: {},
    }
  },
  created() {
    // 实现轮询
    this.timer = window.setInterval(() => {
      setTimeout(this.getTableList(), 0)
    }, 10000)
  },
  mounted() {},
  methods: {
    ...mapActions(['channelStartTalk']), //开始对讲
    ...mapActions(['channelCloseTalk']), //关闭对讲
    ...mapActions(['getMac']), //查询指定mac地址的台麦主机
    // 列表勾选
    selectChange(select, row) {
      this.downloadObject = select //导出赋值
    },
    clickInfo(data) {
      // 机构树详细信息
      this.orgData = data
      this.showDialogInfo = true
    },
    closeDialogInfo() {
      this.showDialogInfo = false
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 3,
        key: params.search,
        hostType: 3,
      }
      return mistsSearch(params)
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

    //关闭弹框的事件
    closeDialog() {
      this.getTableList(1)
    },

    // 报警开启
    alarmAccessOpen(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          console.log(res)
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        alarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code === 0) {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'open' }).then((res) => {
          if (res.data.data.code === 0) {
            this.$messageSuccess('通道开启!')
            this.output[index].status = 1
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
          console.log(res)
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        closeAlarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code === 0) {
            this.$messageSuccess('关闭成功!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'close' }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.code === 0) {
              this.$messageSuccess('通道关闭!')
              this.output[index].status = 1
            } else {
              this.$messageError(res.data.data.message)
            }
          }
        })
      }
    },

    preview(val) {
      let data = {
        channel: val.serise,
        devIp: val.ip,
        devCport: val.cport,
        devDport: val.dport,
        streamType: 'sub1',
      }
      this.$refs.preview.openPreview(data)
    },

    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '序号',
        '防护舱通道A',
        '状态',
        '防护舱通道B',
        '状态',
        '所属门禁主机',
        '所属重点部位',
        '所属机构',
        '门禁通道状态',
      ]
      // 字段名
      const filterVal = [
        'index',
        'ChannelA',
        'stateA',
        'ChannelB',
        'stateB',
        'deviceName',
        'keyPartName',
        'orgName',
        'isGuardLink',
      ]
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '互锁门通道管理列表')
      } else if (this.downloadObject.length == 0) {
        let body = {
          rescusive: this.type,
          category: 3,
        }
        if (this.status) {
          body['status'] = this.status
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/channel/download`
        let name = `互锁门管理导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
      }
    },

    onceClick(data, node) {
      if (data.tierType === 'equ') {
        this.treeDataMessage = data
        getAppointHost(data.id).then((res) => {
          if (res.data.data) {
            let item = []
            for (let i = 0; i < res.data.data.passes.length; i++) {
              if (res.data.data.passes[i].subSystem === 3) {
                item.push(res.data.data.passes[i])
              }
            }
            if (item.length === 2) {
              this.dataTable = []
              let arrDoor = []
              let obj = {
                index: '1',
                ChannelA: item[0].name,
                stateA: item[0].status === 1 ? '关门' : item[0].status === 2 ? '开门' : '未知',
                ChannelB: item[1].name,
                stateB: item[1].status === 1 ? '关门' : item[1].status === 2 ? '开门' : '未知',
                deviceName: item[0].deviceName,
                keyPartName: item[0].keyPartName,
                orgName: item[0].orgName,
                isGuardLink:
                  item[0].status === 3 || item[1].status === 3
                    ? '未知'
                    : item[0].status === item[1].status && item[0].status === 2
                    ? '异常'
                    : '正常',
                idA: item[0].id,
                idB: item[1].id,
              }
              arrDoor.push(item)
              this.dataTable.push(obj)
              this.total = this.dataTable.length
              this.aisleTableData = arrDoor
            }
          }
        })
      }
    },

    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    paginationConfChange(data) {
      this.limit = data.limit
      this.page = data.page
      this.getTableList(1)
    },

    checkChange(type) {
      this.getTableList(1)
    },
    //开启对讲
    startTalking(item, index) {
      //主叫设备话筒id（设备主键id）
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      this.getMac({ mac }).then((res) => {
        this.myMikeIdData = res.data.data.id
        //开始对讲
        this.channelStartTalk({ myMikeId: this.myMikeIdData, calledpanelIds: item.id }).then((res) => {
          this.audio[index].status = 1
          this.seqId = res.data.seqId || '111'
        })
      })
    },

    //关闭对讲
    stopTalking(item, index) {
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      this.getMac({ mac }).then((res) => {
        this.myMikeIdDatas = res.data.data.id
        //开始对讲
        this.channelCloseTalk({ seqId: this.seqId, myMikeId: this.myMikeIdDatas }).then((res) => {
          this.audio[index].status = 2
        })
      })
    },

    //开门
    openDoor(item, index) {
      let obj = {
        devIp: this.isMessage[0].platformIp,
        devPort: this.isMessage[0].platformPort,
        hostId: item.hostUniq,
        channelId: item.uniqueId,
      }
      openDoor(obj).then((res) => {
        if (res.data.data && res.data.data.code === '0') {
          this.guard[index].status = 2
          this.$message({
            message: '门已开启',
            type: 'success',
          })
          this.getTableList(1)
        } else {
          this.$messageError(res.data.data.message)
        }
      })
    },

    //关门
    closeDoor(item, index) {
      let obj = {
        devIp: this.isMessage[0].platformIp,
        devPort: this.isMessage[0].platformPort,
        hostId: item.deviceId,
        channelId: item.uniqueId,
      }
      closeDoor(obj).then((res) => {
        this.guard[index].status = 1
        this.$message({
          message: '门已关闭',
          type: 'success',
        })
      })
    },

    // 点击获取节点信息
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getTableList(1)
      }
    },

    getTree(params) {
      return getTreeApi(params)
    },

    linkEquipment(item) {
      this.dialogVisible = true
      this.isMessage = item
      this.video = []
      this.audio = []
      this.output = []
      this.guard = item
      linkageConfiguration(item[0].id, { ref: '2' }).then((res) => {
        if (res.data.code === 0 && res.data.data) {
          res.data.data.video.forEach((item) => {
            this.video.push(item)
          })
          res.data.data.audio.forEach((item) => {
            this.audio.push(item)
          })
          res.data.data.output.forEach((item) => {
            if (!item.status || item.status === 3) {
              item.status = 1
            }
            this.output.push(item)
          })
        }
      })
      linkageConfiguration(item[1].id, { ref: '2' }).then((res) => {
        if (res.data.code === 0 && res.data.data) {
          res.data.data.video.forEach((item) => {
            this.video.push(item)
          })
          res.data.data.audio.forEach((item) => {
            this.audio.push(item)
          })
          res.data.data.output.forEach((item) => {
            this.output.push(item)
          })
        }
      })
    },

    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },

    getTableList(num) {
      let obj = {
        page: this.page,
        limit: this.limit,
        rescusive: this.type,
      }
      if (num === 1) {
      } else if (num === 2) {
        obj.status = '1'
        this.ststus = '1'
      } else if (num === 3) {
        obj.status = 2
        this.ststus = '2'
      } else if (num === 4) {
        obj.status = '3'
        this.ststus = '3'
      }
      let stateObj = {
        rescusive: this.type,
      }
      if (this.messageEd.tierType === 'loc') {
        obj.keyPartId = this.messageEd.id
        stateObj.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        obj.orgId = this.messageEd.id
        stateObj.orgId = this.messageEd.id
      } else {
        this.onceClick(this.treeDataMessage)
        return
      }
      getChannelList(obj).then((res) => {
        if (res.status === 200) {
          this.dataTable = []
          let arrDoor = []
          if (res.data.data) {
            res.data.data.channels.forEach((item, index) => {
              if (item.length === 2) {
                let obj = {
                  index: index + 1,
                  ChannelA: item[0].name,
                  stateA: item[0].status === 1 ? '关门' : item[0].status === 2 ? '开门' : '未知',
                  ChannelB: item[1].name,
                  stateB: item[1].status === 1 ? '关门' : item[1].status === 2 ? '开门' : '未知',
                  deviceName: item[0].deviceName,
                  keyPartName: item[0].keyPartName,
                  orgName: item[0].orgName,
                  isGuardLink:
                    item[0].status === 3 || item[1].status === 3
                      ? '未知'
                      : item[0].status === item[1].status && item[0].status === 2
                      ? '异常'
                      : '正常',
                  idA: item[0].id,
                  idB: item[1].id,
                  index: index + 1,
                }
                arrDoor.push(item)
                this.dataTable.push(obj)
              }
            })
            this.total = this.dataTable.length
            this.aisleTableData = arrDoor
          }
        }
      })
      getStatus(stateObj).then((res) => {
        if (res.data.data) {
          this.doorTotal = res.data.data.total
          this.normal = res.data.data.normal
          this.abnormal = res.data.data.exception
          this.offLine = res.data.data.unknow
        }
      })
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

    handleClose(done) {
      this.fn = done
      this.dialogVisible = false
      if (!this.dialogVisible) {
        done()
      }
    },

    isShowAisleTable() {
      this.isShowTable = !this.isShowTable
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>
<style lang="less" scoped>
.el-el-card__body {
  border: none;
}
.box-card {
  width: 250px;
  height: 100%;
}
.el-icon-delete {
  float: right;
  padding: 3px 0;
  color: rgb(45, 114, 211);
}
.airlockControl {
  width: 100%;
  height: 100%;
  display: flex;
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
          height: 197px;
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
            .door-img {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 5px;
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
              span:first-child {
                margin: 3px 0px 5px 0px;
                width: 132px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .door:first-child {
            background: #d8f8f9;
            margin-bottom: 6px;
            .door-img {
              background: #38bbbe;
            }
          }
          .door:nth-child(2) {
            background: #fff3de;
            .door-img {
              background: #ffba00;
            }
          }
          .message {
            width: 140px;
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
    }
  }
}
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
      height: calc(~'100% - 8px');
    }
  }
}
.el-breadcrumb {
  display: inline-block;
}
.airlock-state {
  margin: 20px 0;
  font-size: 14px;
  display: flex;
  .title-num {
    display: flex;
    margin-right: 30px;
  }
  .abnormal-state {
    font-weight: 600;
  }
}
.center {
  height: 525px;
}
.el-button--small {
  margin: 5px;
}
.el-table__row {
  height: 10px;
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
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
      i {
        color: #409eff;
        cursor: pointer;
        margin-left: 15px;
      }
    }
  }
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  .left {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ddd;
    span {
      width: 100%;
      height: 36px;
      line-height: 36px;
      display: inline-block;
      color: #000000;
      text-align: center;
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
      i {
        color: #409eff;
        cursor: pointer;
        margin-left: 15px;
      }
    }
  }
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
    .el-dialog__headerbtn {
      width: 25px;
      height: 25px;
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
                width: 100px;
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
                    .name-title {
                      display: flex;
                      i {
                        line-height: 19px;
                      }
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
  z-index: -2;
  top: 0;
  left: 0;
}
</style>
