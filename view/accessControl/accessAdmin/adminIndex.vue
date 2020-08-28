<template>
  <div id="treeSearch">
    <div class="treeLeft">
      <div class="refreshTree">
        <span>机构</span>
        <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      </div>
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
        @rootId="setRootId"
        :customizeQuery="customizeQuery"
        @clickData="playBackGetData"
        ref="tree"
      >
        <template slot-scope="{ data, node }">
          <i
            class="iconfont icon-biaoqian"
            title="详细信息"
            v-if="iconList.includes('info')"
            @click.stop="previewInfo(data, node)"
          ></i>
        </template>
      </treeBox>
    </div>
    <!-- table -->

    <div class="tabRight" ref="getHeight">
      <div class="meunHost">
        <div class="host-header" style="padding:10px 0">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>智慧安防</el-breadcrumb-item>
            <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 通道详情个数 -->
      <div class="typeNumbers">
        <ul class="typeBox" @click="typeFilter()">
          <li class="menuLine">
            <!-- <span class="line"></span> -->
            <i>门禁通道 :</i>
            <span @click="searchAll">{{ nums }}</span>
            <!-- <span @click="searchAll">{{closeAccessNum + addNum}}</span>cc -->
          </li>
          <li>
            <i>开门 :</i>
            <span @click="searchOpen">{{ openAccessNum }}</span>
          </li>
          <li>
            <i>关门 :</i>
            <span @click="searachClose">{{ closeAccessNum }}</span>
          </li>
          <li>
            <i>未知 :</i>
            <span @click="unknown">{{ weizhiNum }}</span>
          </li>
          <li>
            <el-checkbox v-model="showSubOrg">包含下属机构</el-checkbox>
          </li>
        </ul>
        <div class="icon-size">
          <span class="header-change">
            <span class="line-change"></span>
            <span class="change-icon" @click="isShowAisleTable">
              <i class="icon iconfont-ccb ccbliebiao"></i>
            </span>
          </span>
          <!-- <i class="el-icon-s-tools icon"></i> -->
        </div>
      </div>
      <!-- table -->

      <div class="typeSearch" v-show="isType">
        <el-button size="mini" style="float:right;margin:10px 0" @click="downLoad">下载</el-button>
        <div class="tables">
          <el-table
            :stripe="true"
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @select="select"
            height="358"
            :default-sort="{ prop: 'date', order: 'descending' }"
            @row-dblclick="dbCurrtClick"
            tooltip-effect="dark"
            border
          >
            <el-table-column prop type="selection" sortable></el-table-column>>
            <el-table-column prop label="序号" type="index" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="门禁通道" width="180" sortable></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="deviceName"
              label="所属门禁主机"
              width="180"
              sortable
            ></el-table-column>
            <el-table-column show-overflow-tooltip prop="keyPartName" label="所属重点部位" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="orgName" label="所属机构" sortable></el-table-column>
            <el-table-column show-overflow-tooltip label="门禁通道状态" sortable :formatter="formatter">
              >
              <template slot-scope="scope">
                <span v-show="scope.row.status == 1">关门</span>
                <span v-show="scope.row.status == 2">开门</span>
                <span v-show="scope.row.status == 3">未知</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 25, 50, 100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination> -->

            <video-pagination
              ref="listPagination"
              :total="total"
              @paginationConfChange="paginationConfChange"
            ></video-pagination>
          </div>
        </div>
      </div>
      <BlockView v-if="!isType" :tableData="tableData" :item="item" />
      <div>
        <Events @diaoOpen="eventDiao" />
      </div>
    </div>
    <!-- 机构详情 -->
    <el-dialog title="机构详情" :visible.sync="infoFlag.org" width="600px">
      <div class="box">
        <div class="info-item" v-for="(item, index) in orgLables" :key="item.props + '_' + index">
          <div class="info-key">{{ item.label }}</div>
          <div class="info-value">{{ orgInfo[item.prop] || '---' }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 重点部位 -->
    <el-dialog title="重点部位详情" :visible.sync="infoFlag.loc" width="600px">
      <div class="box">
        <div class="info-item" v-for="(item, index) in locLabels" :key="item.props + '_' + index">
          <div class="info-key">{{ item.label }}</div>
          <div class="info-value">{{ locInfo[item.prop] || '---' }}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="设备详情" :visible.sync="infoFlag.dev" width="400px">
      <div class="box">
        <div class="left">
          <span>所属机构</span>
          <span>所属重点部位</span>
          <span>设备品牌</span>
          <span>设备型号</span>
          <span>设备名称</span>
          <!-- <span>IP地址</span> -->
          <span>设备ID</span>
          <span>资产编码</span>
          <span>备注</span>
        </div>
        <div class="right">
          <span>{{ devInfo.orgName }}</span>
          <span>{{ devInfo.keyPartName }}</span>
          <span>{{ devInfo.brand }}</span>
          <span>{{ devInfo.modelNum }}</span>
          <span>{{ devInfo.name }}</span>
          <!-- <span>{{ devInfo.ip }}</span> -->
          <span>{{ devInfo.id }}</span>
          <span>{{ devInfo.assetCode }}</span>
          <span>{{ devInfo.remark }}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      title="门禁控制"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="dialog-message"
      :before-close="handleClose"
      top="12vh"
      append-to-body
      v-if="dialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <span slot="title" class="dialog-footer">
        <span>关联控制</span>
      </span>
      <div class="message-content">
        <div class="con-left">
          <div class="video-top">
            <previewPlugin
              @changeDefaultPane="changeDefaultPane"
              :defaultPane="defaultPane"
              :iconShow="iconShowParams"
              :pluginIconShow="pluginIconShow"
              :moduleType="moduleType"
              ref="preview"
              :isNeedModal="isNeedModal"
            ></previewPlugin>
          </div>
          <div class="InfoBox">
            <div class="message-footer">
              <div class="message-list" v-for="(item, index) in isMessage" :key="index">
                <span class="title">{{ item.name }}</span>
                <span class="message">
                  <span>所属机构：{{ item.orgName }}</span>
                  <span>型号：{{ item.modelNum }}</span>
                  <span>所属重点部位：{{ item.keyPartName }}</span>
                </span>
                <span class="message">
                  <span>品牌：{{ item.brand }}</span>
                  <span>所属门禁主机：{{ item.deviceName }}</span>
                  <span>备注：</span>
                </span>
              </div>
            </div>
            <div v-if="isShowPersonInfo" class="personInfo">
              <div class="user">
                <img :src="perosonInfoArr[0].picBuffer" alt />
              </div>
              <div v-for="(item, index) in perosonInfoArr" :key="index" class="msg">
                <p class="title">{{ item.name }}</p>
                <p>卡号 :{{ item.cardId || '--' }}</p>
                <p>姓名 ：{{ item.personName || '--' }}</p>
                <p>性别 ：{{ item.gender || '--' }}</p>
                <p>身份证 ：{{ item.cardId || '--' }}</p>
                <p>部门 ：{{ item.dentityNo || '--' }}</p>
                <p>职务 ：{{ item.deptName || '--' }}</p>
                <p>事件类型 ：{{ item.eventTypeName || '--' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="con-right">
          <div class="tab-top">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频通道" name="1">
                <div class="isBor" v-for="(item, index) in videoDevList" :key="index">
                  <i class="el-icon-video-camera"></i>
                  <span @click="preview(item)">{{ item.name }}</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="门禁通道" name="2">
                <div style="flex-direction: column;" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#FFBA00">
                      <i class="el-icon-refrigerator"></i>
                    </span>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="openBody.name || openBody.channelName"
                      placement="top-start"
                    ></el-tooltip>
                    <span>{{ openBody.name || openBody.channelName }}</span>
                  </span>
                  <div class="btns" style="margin-top:10px; cursor: pointer;">
                    <el-button size="mini" @click="open(openBody)">开门</el-button>
                    <el-button size="mini" @click="closeFlor(openBody)">关门</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲通道" name="3">
                <div v-for="(item, index) in audioList" :key="index" style="display:flex" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#38BBBE">
                      <i class="el-icon-microphone"></i>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>

                  <span class="opClose" v-if="item.status === 2" @click="openIntercom(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose" v-if="item.status === 1" @click="offIntercom(item, index)">
                    <span>
                      <span class="size">开</span>
                    </span>
                    <span class="active">
                      <span class="size">关</span>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="输出通道" name="4">
                <div v-for="(item, index) in outChannelList" :key="index" class="name">
                  <span class="name-title">
                    <span class="icon-background" style="background:#FF0000">
                      <i class="el-icon-location-outline"></i>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </span>
                  <span class="opClose" v-if="item.status === 1" @click="alarmAccessOpen(item, index)">
                    <span class="active">
                      <span class="size">开</span>
                    </span>
                    <span>
                      <span class="size">关</span>
                    </span>
                  </span>
                  <span class="opClose" v-if="item.status === 2" @click="alarmAccessClose(item, index)">
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="close(fn)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import socket from '@src/socket/alarm'
import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
import { getTreeApi, getAccessList } from '@src/http/access/accessMan'
import { accessEventAlarm } from '@src/http/access/accessAlarm.js'
import {
  getControlList,
  getGlList,
  getCpntrolStatus,
  getDoorStatus,
  getHostControlList,
} from '@src/http/access/control'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
import {
  openAccess,
  closeTheflor,
  getPassageway,
  openVideo,
  offVideo,
  alarmOpen,
  AlarmClose,
  getMac,
  alarmoutput,
  ctlalarmoutput,
  alarmoutputs,
  closeAlarmoutputs,
  exportChannelList,
} from '@src/http/access/event'
import { getAlarmoutputs } from '@src/http/protectiveCabin/channe.api'
import { download } from '@src/common/download.js'
import { getResourceInfoApi, getDeviceInfoApi, getLocOrOrgInfoApi } from '@src/http/video/videoConfig.api.js'
import {
  getDesignated,
} from '@src/http/access/host'
export default {
  data() {
    return {
      id:'', // 视频组件 截图 录像 快速上墙 组合收藏 依赖的props
      dId:'', // 视频组件 依赖的props
      subType:'' , //视频组件 云台功能 依赖的props
      myMikeIdData: '',
      seqId: '',
      currentPage: 1,
      pagesize: 25,
      total: 0,
      fn: null,
      videoDevList: [],
      doorDevList: [],
      audioList: [],
      outChannelList: [],
      isMessage: [],
      activeNames: ['1', '2', '3', '4'],
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
          detailsIcon: true, // 详情
          quanpingfangdaIcon: true // 全屏
      },
      dialogVisible: false, // 双击弹窗
      customizeQuery: {
        params: {
          subSystem: '3',
          hostType: '2',
          channelType: '1',
          // resClass: '2',
        },
      },
      messageEd: {},
      currentOrgNode: '',
      currentLocNode: '',
      currentCheckedTreeNode: '', // 当前选中的机构数节点
      currentEquNode: '',
      rootId: '', //机构树根节点
      countNums: 0,
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      infoFlag: {
        dev: false,
        res: false,
        loc: false,
        org: false,
        equ: false,
      },
        orgLables: [
        { prop: 'name', label: '机构名称' },
        { prop: 'serial', label: '机构编号' },
        { prop: 'kindName', label: '机构类别' },
        { prop: 'telephone', label: '固定电话' },
        { prop: 'functionary', label: '机构负责人' },
        { prop: 'mobile', label: '移动电话' },
        { prop: 'email', label: '电子邮件' },
        { prop: 'address', label: '机构地址' },
        { prop: 'statusName', label: '机构状态' },
        { prop: 'businessHours', label: '开始营业时间' },
        { prop: 'startBusiness', label: '开业日期' },
        { prop: 'closeBusiness', label: '关闭日期' },
        { prop: 'parentName', label: '上级机构名称' },
        { prop: 'parentSerial', label: '上级机构编号' },
      ],
      locLabels:[],
      equInfo: {},
      resInfo: {},
      devInfo: {},
      locInfo: {},
      orgInfo: {},
      item: {},
      jigou: '',
      isTypes: '',
      serchDerive: [],
      status: '',
      openAccessNum: 0,
      closeAccessNum: 0,
      nums: '',
      weizhiNum: 0,
      showSubOrg: true,
      // alarmEvent: [], //报警事件
      // EventList: [{},{}], //事件
      treeType: 1,
      isType: false,
      // filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      menuLists: ['智慧安防'],
      typeNumbers: ['门禁通道', '开门', '关门', '离线', '包含下属机构'],
      typeList: [
        //门禁通道详情
        {
          title: '门禁通道',
          num: 2,
        },
        {
          title: '开门',
          num: 3,
        },
        {
          title: '关门',
          num: 4,
        },
        {
          title: '离线',
          num: 6,
        },
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      das: [],
      tableData: [],
      guardItem: {},
      openBody: {},
      deviceId: '', //下载接口需要的id\
      isShowPersonInfo: false,
      perosonInfoArr: [],
    }
  },
  components: {
    previewPlugin: () => import('@src/view/videoManage/preview/school/previewPlugin'),
    Events: () => import('./components/event'),
    BlockView: () => import('./components/BlockView'),
    treeBox: () => import('@src/components/tree/treeBox'),
    previewPlugin,
    VideoPagination
  },

  methods: {

    paginationConfChange(data) {
      this.pagesize = data.limit
      this.currentPage = data.page
      this.getList()
    },
    changeDefaultPane(val) {
      this.defaultPane = val
    },
    /**
     * @description: 10s 刷新通道列表数据 更新status 此处后期可能优化
     * @param {type}: 无
     * @return: data
     */
    RefreshStatus() {
      if (this.IntervalTimer) {
        clearInterval(this.IntervalTimer)
      } else {
        this.IntervalTimer = setInterval(() => {
          this.getList()
        }, 10000)
      }
    },
    DoorStatus() {
      let statusParams = {
        rescusive: this.showSubOrg,
        device: this.currentEquNode, //主机id
      }
      if (this.messageEd.tierType === 'loc') {
        statusParams.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        statusParams.orgId = this.messageEd.id
      }
      // 获取状态
      getCpntrolStatus(statusParams).then((res) => {
        if (res.data.code == 0) {
          this.closeAccessNum = res.data.data.closeStatus
          this.openAccessNum = res.data.data.openStatus
          this.weizhiNum = res.data.data.unknowStatus
          this.nums = res.data.data.total
        }
      })
    },

    /**
     * @description: 子组件 event 双击触发弹窗
     * @param {type}: row INFO
     * @return: 无
     */
    eventDiao(isOpen) {
      let obj = {
        personName: isOpen.personName,
        cardId: isOpen.cardId,
        gender: isOpen.gender,
        dentityNo: isOpen.dentityNo,
        deptName: isOpen.deptName,
        jobName: isOpen.jobName,
        eventTypeName: isOpen.eventTypeName,
        picBuffer: 'data:image/jpg;base64,' + isOpen.picBuffer,
      }
      // base 64处理
      this.perosonInfoArr = [obj]
      if (isOpen) {
        this.isShowPersonInfo = true
      }
      // base64单独赋值

      this.openBody = isOpen
      this.isMessage = [isOpen]
      this.videoDevList = []
      this.doorDevList = []
      this.audioList = []
      this.outChannelList = [isOpen]
      // 当前点击的门信息
      this.guardItem = isOpen
      let params = {
        ref: 2,
      }
      // 获取门禁关联的主机和设备展示
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${isOpen.resourceId || ''}`, params).then((res) => {
        this.doorDevList = res.data.data.guard || [] // 门禁
        this.audioList = res.data.data.audio || [] // 对讲
        this.videoDevList = res.data.data.video || [] // 视频
        /* 双击进入弹窗获取数据 默认将四个视频打开 */
        if (this.videoDevList.length > 0) {
          this.videoDevList.forEach((item, index) => {
            // 默认只打开四个视频
            index < 4 && this.preview(item)
          })
        }

        res.data.data.output.forEach((item) => {
          if (!item.status || item.status === 3) {
            item.status = 1
          }
          this.outChannelList.push(item)
        })
        this.outChannelList = res.data.data.output // 输出设备
      })

      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      getMac({ mac }).then((res) => {
        if (res.data.code === 0) {
          this.myMikeIdData = res.data.data
        }
      })
      this.dialogVisible = true
    },

    closeDialog() {
      // 刷新列表获取状态
      this.getList()
    },
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getList()
      }
    },
    /*  视频 */
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
          id:val.id,
          orgName:val.orgName,
          keypartName:val.keyPartName,
          deviceName:val.deviceName,
          name:val.name
        }
      } else {
        data = {
          channel: val.serise,
          devIp: val.deviceIp,
          devCport: val.deviceCport,
          devDport: val.deviceDport,
          streamType: val.subSystem === 1 ? 'main' : val.subSystem === 2 ? 'sub1' : 'sub2',
          subType: val.class,
          dId: val.id,
          id:val.id,
          orgName:val.orgName,
          keypartName:val.keyPartName,
          deviceName:val.deviceName,
          name:val.name
        }
      }
      this.$refs.preview.openPreview(data)
    },
    //报警开启
    alarmAccessOpen(item, index) {
      if (item.subSystem == 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('开启成功!')
            this.audioList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem == 2) {
        //报警输出通道
        alarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code == 0) {
            this.$messageSuccess('开启成功!')
            getAlarmoutputs({
              devIp: item.deviceIp,
              devPort: item.devicePort,
              channelList: [Number(item.serise)],
            }).then((res) => {
              this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
            })
            // this.outChannelList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem == 4) {
        //音频输出通道
      } else if (item.subSystem == 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'open' }).then((res) => {
          if (res.data.data.code == 0) {
            this.$messageSuccess('通道开启!')
            this.outChannelList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },
    //报警关闭
    alarmAccessClose(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: false }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        closeAlarmoutputs({ hostId: item.deviceId }).then((res) => {
          if (res.data.code == 0) {
            this.$messageSuccess('开启成功!')
            getAlarmoutputs({
              devIp: item.deviceIp,
              devPort: item.devicePort,
              channelList: [Number(item.serise)],
            }).then((res) => {
              this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
            })
            // this.outChannelList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 4) {
        //音频输出通道
      } else if (item.subSystem === 5) {
        //防护舱输出通道
        ctlalarmoutput({ cabinId: item.id, ctr: 'close' }).then((res) => {
          if (res.data.data.code == 0) {
            this.$messageSuccess('通道开启!')
            this.outChannelList[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },
    //开启对讲
    openIntercom(item, index) {
      openVideo({ myMikeId: this.myMikeIdData.id, calledpanelIds: item.id }).then((res) => {
        this.audioList[index].status = 1
        this.seqId = res.data.data.seqId || '111'
      })
    },
    //关闭对讲
    offIntercom(item, index) {
      offVideo({ seqId: this.seqId, myMikeId: this.myMikeIdData.id }).then((res) => {
        this.audioList[index].status = 2
      })
    },
    //开门
    open(item) {
      let body = {
        guardId: item.id,
      }
      openAccess(body).then((res) => {
        let params = {
          deviceId: item.deviceId,
          channelUnique: item.uniqueId,
        }
        getDoorStatus(params).then((res) => {
          if (res.data.code == 0) {
            this.tableDatas[this.doorIndex].status = res.data.data.status
          }
        })
      })
    },
    //关门
    closeFlor(item) {
      let body = {
        guardId: item.id,
      }
      closeTheflor(body).then((res) => {
        let params = {
          deviceId: item.deviceId,
          channelUnique: item.uniqueId,
        }
        // this.$parent.getList()
        getDoorStatus(params).then((res) => {
          if (res.data.code == 0) {
            this.tableDatas[this.doorIndex].status = res.data.data.status
          }
        })
      })
    },
    /*  列表list 双击开启弹窗 */
    dbCurrtClick(row, column, event) {
      this.dialogVisible = true
      this.openBody = row // 开关门必要参数
      this.isMessage = [row] // 弹窗内显示的通道info
      this.videoDevList = []
      this.doorDevList = []
      this.audioList = []
      this.outChannelList = [row]
      // 当前点击的门信息
      this.guardItem = row
      let params = {
        ref: 2,
      }
      // 获取门禁关联的主机和设备展示
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${row.id}`, params).then((res) => {
        this.doorDevList = res.data.data.guard // 门禁
        this.audioList = res.data.data.audio // 对讲
        this.videoDevList = res.data.data.video // 视频

        /* 弹窗开启视频默认四个播放 */
        if (this.videoDevList.length > 0) {
          this.videoDevList.forEach((item, index) => {
            index < 4 && this.preview(item)
          })
        }
        /* 处理输出设备的status */
        res.data.data.output.forEach((item) => {
          if (!item.status || item.status === 3) {
            item.status = 1
          }
          this.outChannelList.push(item)
        })
        if (res.data.data.output.length > 0) {
          if (item.subSystem === 2) {
            getAlarmoutputs({
              devIp: item.deviceIp,
              devPort: item.devicePort,
              channelList: [Number(item.serise)],
            }).then((res) => {
              if (res.data.data.code === '0') {
                this.outChannelList[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
              }
            })
          }
        }
        // this.outChannelList = res.data.data.output // 输出设备
      })

      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      getMac({ mac }).then((res) => {
        if (res.data.code === 0) {
          this.myMikeIdData = res.data.data
        }
      })
    },
    handleChange(val) {
      console.log(val)
    },
        close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
      this.$parent.getList()
    },
    handleClose(done) {
      this.fn = done
      this.dialogVisible = false
      if (!this.dialogVisible) {
        done()
      }
    },
    setRootId(data) {
      this.rootId = data
    },
     /**
    * @description: 获取机构 || 重点部位详情
    * @param {type}: Object
    * @type: Data
    * @return: wu
    */
    previewInfo(data, node) {
      if(data.tierType == 'org'){
        getLocOrOrgInfoApi({
          ids:[data.id],
          type:1
        }).then(res => {
          if(res.data.code == 0){
            this.orgInfo = res.data.data.orgs[0]
            this.infoFlag.org = true
          }else{
            this.$messageError(res.data.data)
          }
        }).then( err => {

        })
      }
      else if (data.tierType == 'loc') {
        this.locLabels = this.initInfo(data.keyPartType)
        getLocOrOrgInfoApi({
          ids:[data.id],
          type:2
        }).then(res => {
          if(res.data.code == 0){
            this.infoFlag.loc = true
              this.locInfo = res.data.data.keyParts[0]
          }
        }).then( err => {

        })
        this.orgInfo = data
      } else if (data.tierType == 'res') {
        this.infoFlag.res = true
      } else if (data.tierType == 'equ') {
        getDesignated({id:data.id}).then(res => {
          if(res.data.code == 0){
            console.log('ssssssssss',res);
            this.devInfo = res.data.data.host
            console.log('xxxxxxxxx',this.devInfo);
          }
        })
        this.infoFlag.dev = true
      }
    },
    formatter(row, column) {
      return row.address
    },
    select(s, row) {
      this.serchDerive = s
      this.deviceId = row.deviceId
    },
    // 获取全部通道
    searchAll() {
      this.status = ' '
      this.getList()
    },
    //未知门状态
    unknown() {
      this.status = '3'
      this.getList()
    },
    // 查找开门的列表
    searchOpen() {
      this.status = '2'
      this.getList()
    },
    // 查找关门的列表
    searachClose() {
      this.status = '1'
      this.getList()
    },
    onceClick(data, node) {
      if (data.tierType === 'equ') {

        getHostControlList(`/resource/v1/guard/host/${data.id}/channel`, { type: 1 }).then((res) => {
          this.tableData = res.data.data
        })
      }
    },
    //获取门禁管理列表页面
    getList() {
      let params = {
        page: this.currentPage,
        limit: this.pagesize,
        rescusive: this.showSubOrg,
        type: '1',
        category: '2',
      }
      if (this.status.trim()) {
        params.status = this.status
      }

      if (this.messageEd.tierType === 'loc') {
        params.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        params.orgId = this.messageEd.id
      }
      getGlList(params).then((res) => {
        this.tableData = res.data.data.channels || []
        this.total = res.data.data.count.total
        // 获取列表顶部统计status
        this.DoorStatus()
      })
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 下载列表信息
    downLoad() {
      if (this.serchDerive.length > 1 && this.serchDerive) {
        const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
        const tHeader = ['序号', '门禁通道', '所属门禁主机', '所属重点部位', '所属机构', '门禁通道状态']
        const filterVal = ['index', 'name', 'deviceName', 'keyPartName', 'orgName', 'status']
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)
        list.forEach((item, index) => {
          if (item.status) {
            if (item.status == 1) {
              item.status = '关门'
            }
            if (item.status == 2) {
              item.status = '开门'
            }
            if (item.status == 3) {
              item.status = '未知'
            }
          }
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁通道管理列表')
      } else {
        let body = {
          page: this.page,
          limit: this.limit,
          rescusive: this.showSubOrg,
          category: 2,
        }
        if (this.deviceId) {
          body['deviceId'] = this.deviceId
        }
        if (this.status.trim()) {
          body['status'] = this.status
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/channel/download`
        let name = `门禁管理${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    handleNodeClick(data) {
      console.log(data)
    },
    //门禁管理显示Type切换
    isShowAisleTable() {
      this.isType = !this.isType
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row'
      }
    },
    //   筛选
    fit(val) {},
    onSubmit() {
      // console.log('submit!')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //门禁通道类型筛选
    typeFilter() {},
    handleSizeChange(val) {
      this.pagesize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
       /**
  * @description: 刷新机构数
  * @param {type}:
  * @type:
  * @return:
  */
  refresh() {
      this.$refs.tree.$refs.lazyTree.refresh();
    },
       //机构树初始化
    initInfo(type) {
      let infoData = [
        {
          key: 1,
          data: [
            { prop: 'name', label: '营业网点名称' },
            { prop: 'address', label: '营业网点地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '营业网点电话' },
            { prop: 'principal1', label: '营业网点负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '营业网点负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '营业网点安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '营业网点安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 2,
          data: [
            { prop: 'name', label: '金库名称' },
            { prop: 'address', label: '金库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '守护室电话' },
            { prop: 'principal1', label: '金库常务副主任' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '金库副主任' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 3,
          data: [
            { prop: 'name', label: '机房名称' },
            { prop: 'address', label: '机房地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '机房负责人' },
            { prop: 'principalPhone1', label: '负责人电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'telephone', label: '机房值班电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 4,
          data: [
            { prop: 'name', label: '办公楼名称' },
            { prop: 'address', label: '办公楼地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '值班电话' },
            { prop: 'principalPhone2', label: '消防控制室电话' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal1', label: '办公楼联系人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'updatedBy', label: '录入人' },
            { prop: 'updatedDept', label: '录入机构' },
            { prop: 'updatedAt', label: '录入时间' },
          ],
        },
        {
          key: 5,
          data: [
            { prop: 'name', label: '自助银行名称' },
            { prop: 'address', label: '自助银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银行负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 6,
          data: [
            { prop: 'name', label: '自助设备名称' },
            { prop: 'address', label: '自助设备地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助设备负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 7,
          data: [
            { prop: 'name', label: '自助银亭名称' },
            { prop: 'address', label: '自助银亭地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '自助银亭负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 8,
          data: [
            { prop: 'name', label: '私人银行名称' },
            { prop: 'address', label: '私人银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '私人银行电话' },
            { prop: 'principal1', label: '私人银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '私人银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '私人银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '私人银行安全员一' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 9,
          data: [
            { prop: 'name', label: '保管箱库名称' },
            { prop: 'address', label: '保管箱库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '保管箱库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 10,
          data: [
            { prop: 'name', label: '档案库名称' },
            { prop: 'address', label: '档案库地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '档案库电话' },
            { prop: 'principal1', label: '档案库负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 11,
          data: [
            { prop: 'name', label: '远程监控中心名称' },
            { prop: 'address', label: '远程监控中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '中心值班电话' },
            { prop: 'principal1', label: '远程监控中心负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 12,
          data: [
            { prop: 'name', label: '5G+智能银行名称' },
            { prop: 'address', label: '5G+智能银行地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '5G+智能银行电话' },
            { prop: 'principal1', label: '5G+智能银行负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '5G+智能银行负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '5G+智能银行安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '5G+智能银行安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 13,
          data: [
            { prop: 'name', label: '财富中心名称' },
            { prop: 'address', label: '财富中心地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '财富中心电话' },
            { prop: 'principal1', label: '财富中心负责人一' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '财富中心负责人二' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal3', label: '财富中心安全员一' },
            { prop: 'principalPhone3', label: '移动电话' },
            { prop: 'principal4', label: '财富中心安全员二' },
            { prop: 'principalPhone4', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
            { prop: 'nearbyKeyPartTypeName', label: '附近自助银行/自助设备' },
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' },
          ],
        },
        {
          key: 14,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: '', label: '部位类型' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'telephone', label: '部位电话' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
            { prop: 'principal2', label: '部位安全员' },
            { prop: 'principalPhone2', label: '移动电话' },
            { prop: 'principal5', label: '所属机构安保联系人' },
            { prop: 'principalPhone5', label: '移动电话' },
            { prop: 'policeStation', label: '属地派出所名称' },
            { prop: 'policeTelephone', label: '属地派出所电话' },
            { prop: 'police', label: '辖区民警姓名' },
            { prop: 'policeMobilePhone', label: '移动电话' },
            { prop: 'serial', label: '机构代码' },
            { prop: 'remark', label: '备注' },
            { prop: 'status', label: '部位状态' },
          ],
        },
        {
          key: 15,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' },
          ],
        },
      ]
      return infoData.find((item) => item.key === type).data
    },
  },
  computed: {},
  watch: {
    filterText(searchVal) {
      this.$refs.tree.filter(searchVal)
    },
    showSubOrg(flag) {
      this.getList()
    },
    tableData: {
      handler: function (newValue, oldValue) {},
      deep: true,
    },
  },
  mounted() {
    this.menuLists.push(this.$route.meta.menu)
    this.handleClose(() => {}) // 弹窗自定义回调
    let res = document.querySelectorAll('.menuList span')
    this.RefreshStatus()
  },
  created() {
    this.form.region = '全部'
  },
  beforeDestroy() {
    /* 移除定时器*/
    clearInterval(this.IntervalTimer)
    this.RefreshStatus = null
  },
}
</script>

<style lang="less" scoped>
#treeSearch {
  background: #fff;
  height: 100%;
  display: flex;
  height: 100%;
  overflow: hidden;
  .treeLeft {
    width: 290px;
    border-right: 1px solid #e6e6e6;
    .refreshTree {
      display: inline-block;
      width: 100%;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #f5f5f5;
      color: #333;
      font-size: 14px;
      margin-bottom: 14px;
      font-weight: 400;
      position: relative;
    }
    .refresh {
      position: absolute;
      top: 0px;
      right: 7px;
      z-index: 2;
      cursor: pointer;
    }
  }

  .tabRight {
    flex: 1;
    height: 100%;
    width: calc(100% - 250px);
    padding-right: 10px;
    .meunHost {
      margin-left: 10px;
    }
    .typeNumbers {
      overflow: hidden;
      border-bottom: 1px solid #ebebeb;
      margin-left: 10px;
      .typeBox {
        li {
          float: left;
          padding-right: 10px;
          span {
            cursor: pointer;
            padding: 0 5px;
          }
          .line {
            display: inline-block;
            width: 2px;
            height: 10px;
            background: #2d72d3;
            padding: 0;
          }
        }
        .menuLine {
          position: relative;
          padding-left: 7px;
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 22px;
            height: 12px;
            top: 50%;
            left: -20px;
            transform: translateY(-40%);
            background: #2d72d3;
          }
        }
      }
      .icon-size {
        float: right;
        font-size: 26px;
        margin-right: 20px;
        .header-change {
          display: inline-block;
          width: 100%;
          position: relative;
          .line-change {
            display: inline-block;
            width: 1508px;
            height: 1px;
          }
          .change-icon {
            display: inline-block;
            width: 37px;
            height: 35px;
            position: absolute;
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
      }
    }
    .typeSearch {
      margin-top: 10px;
      /deep/ .el-form-item {
        display: inline-block !important;
        margin: 0 15px !important;
      }
      .tables {
        margin: 10px 0;
        height: 430px;
        box-sizing: border-box;
        .block {
          text-align: right;
          margin-top: 10px;
        }
      }
    }
  }

  .tabRight {
    margin: 10px 0;
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
        width: 75%;
        height: 100%;
        border-right: 1px solid #e1e1e1;
        .video-top {
          height: 516px;
          width: 100%;
          /deep/ .video-plugin {
            .plugin-video {
              iframe {
                z-index: -2;
              }
            }
          }
        }
        .InfoBox {
          display: flex;
          .message-footer {
            flex: 1;
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
          .personInfo {
            // margin-top: 10px;
            flex: 1;
            border-top: 1px solid #e1e1e1;
            display: flex;
            padding: 10px 0;
            .user {
              width: 30%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .msg {
              flex: 1;
              margin-left: 10px;
              p {
                line-height: 20px;
              }
            }
          }
        }
      }
      .con-right {
        flex: 1;
        height: 651px;
        padding: 0 20px;
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
                      .icon-background {
                        width: 18px;
                        height: 18px;
                        display: inline-block;
                        border-radius: 50%;
                        text-align: center;
                        margin-right: 6px;
                      }
                      i {
                        line-height: 19px;
                        color: #fff;
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
  .dialog-footer {
    width: calc(~'100% - 16px');
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
</style>
