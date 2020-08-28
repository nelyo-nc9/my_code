<template>
  <div class="tvWallSetWrap">
    <div class="setWrapTop"
         v-if="tvWallMessage.type === 2">
      <ul class="ulStyle">
        <li class="liStyle"
            v-for="(label, index) in tabLabels"
            :key="label"
            @click="ActionMethod(index, label)">
          {{ label }}
        </li>
      </ul>
      <div class="resouse">
        <div class="tatolNumder">
          <div class="title">
            <span>解码窗口总资源：</span>
          </div>
          <div class="const">
            <span>{{ totalCount }}个</span>
          </div>
        </div>
        <div class="tatolNumder">
          <div class="title">
            <span>已使用：</span>
          </div>
          <div class="const">
            <span>{{ useNum }}个</span>
          </div>
        </div>
        <div class="tatolNumder">
          <div class="title">
            <span>未使用：</span>
          </div>
          <div class="const">
            <span>{{ unUseNum }}个</span>
          </div>
        </div>
      </div>
    </div>
    <div class="setWrapContend">
      <div class="tvWallUsetitle"
           v-if="!showOrclose">
        <div class="usetitleWrap "
             style="margin-left:30px">
          <div class="useTitle">
            <span>当前预案：</span>
          </div>
          <div class="titleConst">
            <span>未执行</span>
          </div>
        </div>
        <div class="usetitleWrap marginStyle">
          <div class="useTitle">
            <span>当前场景：</span>
          </div>
          <div class="titleConst">
            <span>{{ tvWallMessage.rtscene.name }}</span>
          </div>
        </div>
      </div>
      <div class="titMess"
           v-if="showOrclose">
        <p>请到电视墙配置模块创建电视墙</p>
      </div>
      <div class="titMessSecond"
           v-if="!showOrclose">
        <table>
          <tr v-for="(tr, trIndex) in netTable"
              :key="trIndex">
            <td v-for="(td, tdIndex) in tr.children"
                v-show="td.isNet"
                :key="tdIndex"
                :rowspan="td.rowspan"
                :colspan="td.colspan"
                @mouseover="downResources(td)"
                @click="everyBody(td.netIndex, td)"
                :class="{ isactive1: td.netIndex === changePage }">
              <div :class="{ active_tv: td.isToWall === true || td.isTowallLocal === true }"
                   style="width:100%;height:100%;background: #999999;display: flex;flex-direction: column;"
                   v-if="td.isOpen && !td.isDivision"
                   @dblclick="showPreviewHandler(td.isToWall, td.isTowallLocal)">
                <div class="windowTop">
                  <div class="windowTopLeft">
                    <div class="leftTitle">
                      <span>窗口：</span>
                    </div>
                    <div class="leftConst">
                      <span>{{ td.windowIndex }}</span>
                    </div>
                    <div class="checkWrap">
                      <el-checkbox v-if="tvWallMessage.type === 2"
                                   v-model="td.checked"
                                   @change="sendWindowIndex(td.netIndex, td.checked, td)"></el-checkbox>
                    </div>
                  </div>
                  <div class="windowTopRight">
                    <i class="el-icon-close"
                       @click="delectOpenMethod(td)"
                       v-if="tvWallMessage.type === 2"></i>
                  </div>
                </div>
                <div class="alarmWrap">
                  <div style="width:100%;height:100%;display:flex;color:#fff;justify-content: center;align-items: center;position: relative;">
                    <div class="alarm_wrap"
                         v-if="td.alarmIconShowOrclose">
                      <i class="el-icon-message-solid"></i>
                    </div>
                    <span v-if="td.isToWall">{{ td.resourcesName }}</span>
                    <span v-if="td.isTowallLocal">{{ td.resourcesName }}</span>
                    <span v-if="td.pollingName !== ''">{{ td.pollingName }}</span>
                    <div v-if="(td.yuntaiFlag && td.isToWall) || (td.yuntaiFlag && td.isTowallLocal)"
                         style="position:absolute;width:100%;height:100%">
                      <ptz :singleStatus="singleStatus"></ptz>
                    </div>
                    <div class="numberWrap"
                         v-if="(td.showNumber !== 0 && td.isToWall && tvWallMessage.type !== 1) || (td.showNumber !== 0 && td.isTowallLocal && tvWallMessage.type !== 1)">
                      <div class="title">
                        <span>窗口编号：</span>
                      </div>
                      <div class="const">
                        <span>{{ td.showNumber }}</span>
                      </div>
                    </div>
                    <div class="numberWrap1"
                         v-if="(td.showNumber !== 0  && tvWallMessage.type === 1) || (td.showNumber !== 0  && tvWallMessage.type === 1)">
                      <div class="title">
                        <span>窗口编号：</span>
                      </div>
                      <div class="const">
                        <span>{{ td.showNumber }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="width: 100%;height: 100%;background: #999999;position:relative;"
                   v-if="td.isDivision">
                <div class="windowTop"
                     @mouseover="downResources3(td)">
                  <div class="windowTopLeft">
                    <div class="leftTitle">
                      <span>窗口：</span>
                    </div>
                    <div class="leftConst">
                      <span>{{ td.windowIndex }}</span>
                    </div>
                    <div class="checkWrap">
                      <el-checkbox v-if="tvWallMessage.type === 2"
                                   v-model="td.checked"
                                   @change="sendWindowIndex(td.netIndex, td.checked, td)"></el-checkbox>
                    </div>
                  </div>
                  <div class="windowTopRight">
                    <i class="el-icon-close"
                       @click="delectOpenMethod(td)"
                       v-if="tvWallMessage.type === 2"></i>
                  </div>
                </div>
                <div class="numberWrap2"
                     v-if="(td.showNumber !== 0 && tvWallMessage.type === 1) || (td.showNumber !== 0  && tvWallMessage.type === 1)">
                  <div class="title">
                    <span>窗口编号：</span>
                  </div>
                  <div class="const">
                    <span>{{ td.showNumber }}</span>
                  </div>
                </div>
                <table style="height:calc(100% - 30px);">
                  <tr v-for="(ttr, index) in td.isTableArr[td.isDivisionConunt]"
                      :key="index">
                    <td v-for="(ttd, index1) in ttr.children"
                        :key="index1"
                        :rowspan="ttd.rowspan"
                        :colspan="ttd.colspan"
                        @click.stop="everyBody_children(ttd.windowIndex, ttd, td)">
                      <div :class="{
                          active_tv:
                            ttd.division_isToWall === true ||
                            (ttd.division_isTowallLocal === true &&
                              !(ttd.windowIndex === changePage_children && td.netIndex === changePage)),
                          isactive2: ttd.windowIndex === changePage_children && td.netIndex === changePage
                        }"
                           style="width:100%;height:100%;display: flex;justify-content: center;align-items: center; position:relative"
                           @dblclick="showPreviewHandler(ttd.division_isToWall, ttd.division_isTowallLocal)"
                           @mouseover="downResources2(ttd, td)">
                        <div v-if="
                            (ttd.division_yuntaiFlag && ttd.division_isToWall) ||
                              (ttd.division_yuntaiFlag && ttd.division_isTowallLocal)
                          "
                             style="position:absolute;width:100%;height:100%">
                          <ptz :singleStatus="singleStatus"></ptz>
                        </div>
                        <div v-if="!ttd.division_isToWall && !ttd.division_isTowallLocal">{{ ttd.windowIndex }}</div>
                        <div style="color:#ffffff;">
                          <span v-if="ttd.division_isToWall">{{ ttd.divosion_resourcesName }}</span>
                          <span v-if="ttd.division_isTowallLocal">{{ ttd.divosion_resourcesName }}</span>
                          <span v-if="ttd.division_pollingName !== ''">{{ ttd.division_pollingName }}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="tvWallUseBottom"
         v-if="!showOrclose">
      <ul class="bottomUlstyle">
        <li class="bottomListyle"
            @click="closeTv(1)">
          <span>停止解码</span>
        </li>
        <li class="bottomListyle"
            @click="closeTv(2)">
          <span>全部停止解码</span>
        </li>
        <li class="bottomListyle"
            @click="yuntaiMethod">
          <span>云台控制</span>
        </li>
        <li class="bottomListyle"
            @click="openaudio">
          <span>打开音频</span>
        </li>
        <li class="bottomListyle">
          <div class="dp-con"
               @mouseenter=";(showscreenShow = true) && (hoverShowscreen = selectedShowscreen)"
               @mouseleave="showscreenShow = false">
            <span>窗口分割</span>
            <ul v-show="showscreenShow">
              <i></i>
              <li v-for="screen in showScreenList"
                  :key="screen.value"
                  @mouseenter="hoverShowscreen = screen.value"
                  @click="setShowscreen(screen.value)"
                  :class="{ active: screen.value === hoverShowscreen }">
                {{ screen.label + '画面' }}
              </li>
            </ul>
          </div>
        </li>
        <li @click="showNumber('显示编号')"
            v-if="!showNumber1"
            class="bottomListyle">
          <span>显示编号</span>
        </li>
        <li @click="showNumber('隐藏编号')"
            v-if="showNumber1"
            class="bottomListyle">
          <span>隐藏编号</span>
        </li>
        <li class="bottomListyle"
            @click="setalarm">
          <span>配置为报警屏</span>
        </li>
      </ul>
    </div>
    <!-- 双击已经上流的窗口，弹出弹框，播放视频 -->
    <PreviewVideoModal v-if="showPreviewModal"
                       :showPreviewVideo="showPreviewModal"
                       @closePreview="closeModal"></PreviewVideoModal>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import PreviewVideoModal from '../components/PreviewTvModal'
import { getTvWallWebSocket } from '../../../socket/socket'
import ptz from '../../videoManage/preview/school/ptz'
export default {
  components: {
    PreviewVideoModal,
    ptz
  },
  data() {
    return {
      netTable: [], // 网格
      input: '',
      inputTwo: '',
      changePage: '', // 未分割窗口选中
      changePage_children: '', // 已分割窗口选中
      dialogVisible: false, // 弹框
      showOrclose: true,
      showNumber1: false, // 是否显示编号
      tabLabels: ['开窗', '拼接', '拆分'],
      column: 0,
      row: 0,
      newArr: [],
      openWindowIndex: false, // 窗口是否开满，开满不能继续开窗
      changeWindowData: {}, // 选中的某个窗格单独的信息
      changeWindowData_child: {}, // 选中的已分割窗格的小窗格信息
      showscreenShow: false, // 窗口分割鼠标移上去的示和隐藏
      hoverShowscreen: 4, // 窗口分割的相关变量显
      showScreenList: [
        {
          value: 1,
          label: '单'
        },
        {
          value: 4,
          label: '四'
        },
        {
          value: 6,
          label: '六'
        },
        {
          value: 9,
          label: '九'
        },
        {
          value: 16,
          label: '十六'
        }
      ],
      showAll: [],
      openWindowparams: {
        // 开窗参数
        wallId: '',
        layoutId: '',
        wh: [],
        windowsRect: {}
      },
      resourcesToTvWallparams: {
        // 资源上墙参数
        wallId: '',
        devCtl: []
      },
      resourcesToTvWallparams2: {
        // 资源上墙参数(M3)
        wallId: '',
        devCtl: [{ channel: '', monitor: 0, paneCount: 1, rids: [{ rid: '' }] }]
      },
      resourcesToTvWallparams4: {
        // 资源上墙参数(解码器+拼控)
        wallId: '',
        devCtl: [{ rid: '', code: 0, paneCount: 1, right: '', left: '', top: '', bottom: '' }]
      },
      resourcesToTvWallparams3: {
        // 资源上墙参数(本地终端上墙)
        wallId: '',
        devCtl: {
          windowsRect: { left: '', bottom: '', right: '', top: '', paneCount: 1 },
          localSignalInfo: { serise: '', id: '', name: '' }
        }
      },
      TvpolingTowall: {
        // 轮巡上墙参数(b20)
        wallId: '',
        left: '',
        top: '',
        right: '',
        bottom: '',
        id: '',
        type: 2, // 默认大窗口轮巡
        paneCount: 1
      },
      TvpolingTowall_m3: {
        // 轮巡上墙参数(M3)
        wallId: '',
        monitor: '',
        channel: '',
        id: '',
        type: 2, // 默认大窗口轮巡
        paneCount: 1
      },
      TvpolingTowallM3AndB20: {
        // 轮巡上墙参数(解码器+拼控)
        left: '',
        right: '',
        top: '',
        bottom: '',
        id: '',
        type: 2, // 默认大窗口轮巡
        paneCount: 1,
        wallId: '',
        code: ''
      },
      WindowVideoParams: {
        // 点击上墙的窗格(大窗格和已经分割的窗格)，获取播放信息
        // wallId: '',
        // left: '',
        // top: '',
        // right: '',
        // bottom: '',
        // paneCount: 1
      },
      mergeWindowState: false, // 是否是拼接之后的窗格再拼接
      windowmergewnd: {
        // 窗口拼接参数(b20)
        wallId: '',
        beforewnd: [],
        afterwnd: { left: '', top: '', bottom: '', right: '' }
      },
      windowSplit: {
        // 窗口拆分(b20)
        wallId: '',
        splitwnd: { left: '', top: '', bottom: '', right: '' }
      },
      setalarmParams: {
        // 设置为报警屏参数
        wallId: '',
        left: '',
        top: '',
        right: '',
        bottom: '',
        code: '',
        monitor: '',
        paneCount: 1,
        type: 1 // 1设置报警屏，0取消报警屏
      },
      totalCount: 0, // 解码窗口总资源
      useNum: 0, // 已使用
      unUseNum: 0, // 未使用
      showPreviewModal: false, // 双击播放视频
      macAderss: '', // 本机mac地址
      limitsArr: [], // 分区权限判定(用于拼接)
      videoData: {}, // 开流需要参数
      // 云台所需参数
      singleStatus: {
        isPlay: true,
        source: {
          devIp: '',
          devCport: ''
        }
      }
    }
  },
  computed: {
    ...mapState({
      tvWallMessage: ({ tvWall }) => tvWall.allTvWallList, // 接受传出来的电视墙信息
      resourcesData: ({ tvWall }) => tvWall.nodeDropData, // 接收双击时，传过来的资源信息
      nodeDropState: ({ tvWall }) => tvWall.nodeDropState, // 接收资源上墙的状态
      nodeDropWhere: ({ tvWall }) => tvWall.nodeDropWhere // 判断拖拽的什么东西上墙:资源还是轮巡等
    })
  },
  watch: {
    tvWallMessage: function (newmess, oldmess) {
      this.changePage = '' // 未分割窗口选中
      this.changePage_children = '' // 已分割窗口选中
      this.changeWindowData = {} // 选中的某个窗格单独的信息
      this.changeWindowData_child = {} // 选中的已分割窗格的小窗格信息
      this.createdMethod() // 当电视墙发生改变时候，看当前墙有无行数和列数，没有重新绘制，有直接画底板(页面初始化也会调用一次)
      this.InitializeMethod()
      this.getWindowCount_fuc() // 获取总解码窗口与已经解码窗口的数量
      this.newArr = [] // 清空选中数组
    }
  },
  methods: {
    ...mapMutations([
      'SET_DELECT_STATE',
      'SET_TVWALLDATA2',
      'SET_TVWALL_CHANGE_DATA',
      'SET_CREATED_FLOOR',
      'SET_NODEDROP_DATA',
      'SET_NODEDROP_STATE',
      'SET_VIDEO_PARAMS'
    ]),
    ...mapActions([
      'createdTvWallFloor',
      'deleteTvWallFloor',
      'openWindowTvWall',
      'resourcesToTvWall',
      'closeresourcesToTvWall',
      'divisionTvWall',
      'closeopendecoder',
      'opendecoder',
      'getWindowCount',
      'm3divisionApi',
      'deletewnd',
      'TvWallsetwnd',
      'mergewndTvWall',
      'splitwndTvWall',
      'resourcesToTvWallLocal',
      'closeresourcesToTvWallLocal',
      'executePolling',
      'getcurstatus',
      'showOrcloseNumber',
      'showOrcloseNumberM3Api',
      'executePollingM3',
      'getPartmanagerelationMethod',
      'SetAlarmApi',
      'm3AndB20divisionApi',
      'opendecoderM3AndB20Api',
      'executePollingM3AndB20Api',
      'closeopendecoderM3AndB20Api',
      'openaudioApi',
      'TvWallWindowStatusApi'
    ]),
    // 初始化数据
    createdMethod() {
      let tvWallData = JSON.parse(JSON.stringify(this.tvWallMessage)) // 复制
      this.netTable = []
      if (tvWallData.rtlayout.row && tvWallData.rtlayout.column) {
        console.log('row...............' + tvWallData.rtlayout.row)
        console.log('col...............' + tvWallData.rtlayout.column)
        for (let i = 0; i < tvWallData.rtlayout.row; i++) {
          let tr = {}
          for (let j = 0; j < tvWallData.rtlayout.column; j++) {
            let tdObj = {
              type: tvWallData.type, // 电视墙类型(M3 type: 1;解码拼控一体机 type 2)
              wallId: tvWallData.id, // 当前电视墙id
              openIndex: null, // 开窗的序号
              netIndex: j + '-' + i,
              windowsRect: [{ code: 0, left: 0, right: 0, top: 0, bottom: 0 }], // 相对坐标(开窗参数)
              devCtl: [{ rid: 0, paneCount: 1, left: 0, right: 0, top: 0, bottom: 0 }], // 资源上墙参数
              wh: [tvWallData.rtlayout.row, tvWallData.rtlayout.column],
              isOpen: false, // 是否开窗
              isNet: true, // 窗格显示/隐藏
              windowIndex: 0, // 窗格编号
              alarmIconShowOrclose: false, // 是否为报警屏幕
              resourcesName: '', // 资源信息(资源和本地终端输入)
              pollingName: '', // 轮巡名称
              associatedChannel: '', // 关联通道
              yuntaiFlag: false, // 云台控制，默认隐藏
              showNumber: 0, // 显示编号
              checked: false, // 是否选中
              rowspan: 1,
              colspan: 1,
              isToWall: false, // 是否上墙
              openaudio: false, // 是否打开音频
              isMergeArr: [],
              isTowallLocal: false, // 是否是本地终端输入上墙
              isDivision: false, // 分割
              isDivisionConunt: 1, // 几分割
              isJoin: false, // 是否拼接
              jointCoordinates: [{ left: '', top: '', bottom: '', right: '' }], // 合并之后的坐标
              /**
               * 分割数组
               * paneCount:几分割
               * windowIndex:窗口号
               * coordinates:相对坐标(相对于本身窗格的坐标)
               * divSubwnd:绝对坐标(相对于整个大窗口的坐标)
               */
              isTableArr: {
                one: [
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 1,
                        windowIndex: 1,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0, top: 0, bottom: 0 }
                      }
                    ]
                  }
                ],
                four: [
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 4,
                        windowIndex: 1,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.5, top: 0, bottom: 0.5 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 4,
                        windowIndex: 2,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0, top: 0, bottom: 0.5 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 4,
                        windowIndex: 3,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.5, top: 0.5, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 4,
                        windowIndex: 4,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0, top: 0.5, bottom: 0 }
                      }
                    ]
                  }
                ],
                six: [
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 1,
                        rowspan: 2,
                        colspan: 2,
                        coordinates: { left: 0, right: 0.6666, top: 0, bottom: 0.6666 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 2,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0, bottom: 0.3333 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 3,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0.3333, bottom: 0.6666 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 4,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.3333, top: 0.6666, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 5,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.3333, right: 0.6666, top: 0.6666, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 6,
                        windowIndex: 6,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0.6666, bottom: 0 }
                      }
                    ]
                  }
                ],
                nine: [
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 1,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.3333, top: 0, bottom: 0.3333 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 2,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.3333, right: 0.6666, top: 0, bottom: 0.3333 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 3,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0, bottom: 0.3333 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 4,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.3333, top: 0.3333, bottom: 0.6666 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 5,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.3333, right: 0.6666, top: 0.3333, bottom: 0.6666 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 6,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0.3333, bottom: 0.6666 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 7,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.3333, top: 0.6666, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 8,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.3333, right: 0.6666, top: 0.6666, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 9,
                        windowIndex: 9,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.6666, right: 0, top: 0.6666, bottom: 0 }
                      }
                    ]
                  }
                ],
                sixteen: [
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 1,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.25, top: 0, bottom: 0.25 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 2,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.25, right: 0.5, top: 0, bottom: 0.25 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 3,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0.75, top: 0, bottom: 0.25 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 4,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.75, right: 0, top: 0, bottom: 0.25 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 5,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.25, top: 0.25, bottom: 0.5 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 6,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.25, right: 0.5, top: 0.25, bottom: 0.5 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 7,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0.75, top: 0.25, bottom: 0.5 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 8,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.75, right: 0, top: 0.25, bottom: 0.5 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 9,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.25, top: 0.5, bottom: 0.75 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 10,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.25, right: 0.5, top: 0.5, bottom: 0.75 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 11,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0.75, top: 0.5, bottom: 0.75 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 12,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.75, right: 0, top: 0.5, bottom: 0.75 }
                      }
                    ]
                  },
                  {
                    children: [
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 13,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0, right: 0.25, top: 0.75, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 14,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.25, right: 0.5, top: 0.75, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 15,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.5, right: 0.75, top: 0.75, bottom: 0 }
                      },
                      {
                        division_pollingName: '', // 轮巡名称
                        division_openaudio: false, // 是否打开音频
                        division_yuntaiFlag: false, // 分割窗口云台控制
                        divosion_resourcesName: '', // 资源信息(资源和本地终端输入)
                        division_isTowallLocal: false, // 分割之后是否是本地终端输入上墙
                        division_isToWall: false, // 分割之后是否上墙
                        paneCount: 16,
                        windowIndex: 16,
                        rowspan: 1,
                        colspan: 1,
                        coordinates: { left: 0.75, right: 0, top: 0.75, bottom: 0 }
                      }
                    ]
                  }
                ]
              }
            }
            console.log(i)
            console.log(j)
            tdObj.windowIndex = i * tvWallData.rtlayout.row + (j + 1) // 窗格编号赋值
            if (tr.children) {
              tr.children.push(tdObj)
            } else {
              tr.children = []
              tr.children.push(tdObj)
            }
            tdObj.windowsRect.map(item => {
              // 为开窗参数做准备
              item.top =
                Number((i / tvWallData.rtlayout.row).toFixed(4)) === 1.0
                  ? 0
                  : Number((i / tvWallData.rtlayout.row).toFixed(4))
              item.bottom =
                Number(((i + 1) / tvWallData.rtlayout.row).toFixed(4)) === 1.0
                  ? 0
                  : Number(((i + 1) / tvWallData.rtlayout.row).toFixed(4))
              item.left =
                Number((j / tvWallData.rtlayout.column).toFixed(4)) === 1.0
                  ? 0
                  : Number((j / tvWallData.rtlayout.column).toFixed(4))
              item.right =
                Number(((j + 1) / tvWallData.rtlayout.column).toFixed(4)) === 1.0
                  ? 0
                  : Number(((j + 1) / tvWallData.rtlayout.column).toFixed(4))
              item.code = Number(tdObj.windowIndex)
            })
            tdObj.devCtl.map(item => {
              // 为资源上墙参数做准备
              item.top =
                Number((i / tvWallData.rtlayout.row).toFixed(4)) === 1.0
                  ? 0
                  : Number((i / tvWallData.rtlayout.row).toFixed(4))
              item.bottom =
                Number(((i + 1) / tvWallData.rtlayout.row).toFixed(4)) === 1.0
                  ? 0
                  : Number(((i + 1) / tvWallData.rtlayout.row).toFixed(4))
              item.left =
                Number((j / tvWallData.rtlayout.column).toFixed(4)) === 1.0
                  ? 0
                  : Number((j / tvWallData.rtlayout.column).toFixed(4))
              item.right =
                Number(((j + 1) / tvWallData.rtlayout.column).toFixed(4)) === 1.0
                  ? 0
                  : Number(((j + 1) / tvWallData.rtlayout.column).toFixed(4))
              // item.code = Number(tdObj.windowIndex)
            })
          }
          this.netTable.push(tr)
        }
        console.log(this.netTable)
        this.SET_TVWALL_CHANGE_DATA(JSON.parse(JSON.stringify(this.netTable))) // 主页面将改变好数据格式的数据发送出去 (普通电视墙)
        this.showOrclose = false
      } else {
        this.showOrclose = true
      }
    },
    // 页面初始化(看哪个窗口具体有哪些操作，给他添加进去)
    InitializeMethod() {
      if (this.tvWallMessage.type === 1) {
        // 解码器  解码器+拼控
        this.nomal_function(this.tvWallMessage.rtscene.sceneInfo)
      } else if (this.tvWallMessage.type === 2) {
        // 拼控解码一体机
        this.nomal2_function(this.tvWallMessage.rtlayout.wininfo)
      } else if (this.tvWallMessage.type === 4) {
        // 解码器+拼控
        this.nomal3_function(this.tvWallMessage.rtlayout.wininfo)
      }
    },
    // 点击头部按钮，所作出对应操作
    ActionMethod(index, val) {
      switch (index) {
        case 0:
          this.openWindow()
          break
        case 1:
          this.JoiningTogether(1)
          break
        case 2:
          this.BreakUp(val)
          break
        default:
      }
    },
    //  删除底板、设置报警屏幕、取消报警屏幕
    delectMethod(val, num) {
      console.log(val)
      console.log(num)
      console.log(this.tvWallMessage)
      if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
        this.$confirm(val, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (num === 1) {
              let params = {
                wallId: this.tvWallMessage.id
              }
              // 删除底板
              this.deleteTvWallFloor(params)
                .then(res => {
                  this.succefullMethod('底板删除成功')
                  // 删除成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                  let sendObj = {
                    state: true,
                    id: this.tvWallMessage.id
                  }
                  this.SET_CREATED_FLOOR(sendObj)
                })
                .catch(err => {
                  console.log(err)
                })
              // *********************************************************************
            } else if (num === 2) {
              this.setalarmParams.wallId = this.changeWindowData.wallId
              // 取消设置报警屏幕(向后台发送请求)
              if (this.changeWindowData.type === 1 && !this.changeWindowData.isDivision) {
                // m3未分割窗口取消设置为报警屏幕
                this.setalarmParams.code = this.changeWindowData.windowsRect[0].code
                this.setalarmParams.monitor = this.changeWindowData.windowsRect[0].code
                this.setalarmParams.type = 0
                this.sendSetalarm(0)
              } else if (
                (this.changeWindowData.type === 2 && !this.changeWindowData.isDivision) ||
                (this.changeWindowData.type === 4 && !this.changeWindowData.isDivision)
              ) {
                // b20/解码器+拼控未分割窗口取消设置为报警屏幕
                this.setalarmParams.left = this.changeWindowData.windowsRect[0].left
                this.setalarmParams.right = this.changeWindowData.windowsRect[0].right
                this.setalarmParams.top = this.changeWindowData.windowsRect[0].top
                this.setalarmParams.bottom = this.changeWindowData.windowsRect[0].bottom
                this.setalarmParams.code = this.changeWindowData.windowsRect[0].code
                this.setalarmParams.type = 0
                this.sendSetalarm(0)
              }
            } else if (num === 3) {
              this.setalarmParams.wallId = this.changeWindowData.wallId
              // 确定设置报警屏幕(向后台发送请求)
              if (this.changeWindowData.type === 1 && !this.changeWindowData.isDivision) {
                // m3未分割窗口设置为报警屏幕
                this.setalarmParams.type = 1
                this.setalarmParams.code = this.changeWindowData.windowsRect[0].code
                this.setalarmParams.monitor = this.changeWindowData.windowsRect[0].code
                this.sendSetalarm(1)
              } else if (this.changeWindowData.type === 1 && this.changeWindowData.isDivision) {
                // m3已分割窗口设置为报警屏幕
                this.failureMethod('已分割屏幕不可设置为报警屏幕')
              } else if (
                (this.changeWindowData.type === 2 && !this.changeWindowData.isDivision) ||
                (this.changeWindowData.type === 4 && !this.changeWindowData.isDivision)
              ) {
                // b20/解码器+拼控未分割窗口设置为报警屏幕
                this.setalarmParams.type = 1
                this.setalarmParams.left = this.changeWindowData.windowsRect[0].left
                this.setalarmParams.right = this.changeWindowData.windowsRect[0].right
                this.setalarmParams.top = this.changeWindowData.windowsRect[0].top
                this.setalarmParams.bottom = this.changeWindowData.windowsRect[0].bottom
                this.setalarmParams.code = this.changeWindowData.windowsRect[0].code
                this.sendSetalarm(1)
              } else if (
                (this.changeWindowData.type === 2 && this.changeWindowData.isDivision) ||
                (this.changeWindowData.type === 4 && this.changeWindowData.isDivision)
              ) {
                // b20/解码器+拼控已分割窗口设置为报警屏幕
                this.failureMethod('已分割屏幕不可设置为报警屏幕')
              }
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.warningMethod('该电视墙没有底板，无法删除')
      }
    },
    // 删除已开窗电视墙窗格提示(点击X)
    async delectOpenMethod(val) {
      let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
      let relationArr
      let windowCodeArr = [] // 权限中的窗格号
      if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
        relationArr = relationData.data.data
        relationArr.map(item => {
          if (item.mac === this.macAderss) {
            windowCodeArr.push(item.code)
          }
        })
      }
      if (this.macAderss !== '' && windowCodeArr.length !== 0) {
        // 拥有部分屏幕权限
        if (val) {
          this.$confirm('此操作将删除该窗格, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (windowCodeArr.includes(val.windowIndex)) {
                val.windowsRect.map(item => {
                  delete item.code
                })
                let params = {
                  wallId: val.wallId,
                  windowsRect: val.windowsRect
                }
                this.deletewnd(params)
                  .then(res => {
                    if (res.data.code === 0) {
                      this.changePage = '' // X窗成功，清除选中状态
                      this.succefullMethod('删除成功')
                      // 删除成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                      let sendObj = {
                        state: true,
                        id: this.tvWallMessage.id
                      }
                      this.SET_CREATED_FLOOR(sendObj)
                    } else {
                      this.failureMethod('请求失败')
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                this.failureMethod('不在权限之内')
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          this.warningMethod('删除失败')
        }
      } else {
        // 拥有全部屏幕的权限
        if (val) {
          this.$confirm('此操作将删除该窗格, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              val.windowsRect.map(item => {
                delete item.code
              })
              let params = {
                wallId: val.wallId,
                windowsRect: val.windowsRect
              }
              this.deletewnd(params)
                .then(res => {
                  if (res.data.code === 0) {
                    this.changePage = '' // X窗成功，清除选中状态
                    this.succefullMethod('删除成功')
                    // 删除成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                    let sendObj = {
                      state: true,
                      id: this.tvWallMessage.id
                    }
                    this.SET_CREATED_FLOOR(sendObj)
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          this.warningMethod('删除失败')
        }
      }
    },
    // 获取总解码窗口与已经解码窗口的数量(解码总资源，已使用，未使用)
    getWindowCount_fuc() {
      let params = {
        wallId: this.tvWallMessage.id,
        type: this.tvWallMessage.type
      }
      this.getWindowCount(params)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data) {
              this.totalCount = res.data.data.total
              this.useNum = res.data.data.useNum
              this.unUseNum = res.data.data.unuseNum
            } else {
              this.totalCount = 0
              this.useNum = 0
              this.unUseNum = 0
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 拼控一体电视墙开窗
    async openWindow() {
      let openWindowIndex = false
      let obj = JSON.parse(JSON.stringify(this.tvWallMessage)) // 复制
      let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
      let relationArr
      let windowCodeArr = [] // 权限中的窗格号
      if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
        relationArr = relationData.data.data
        relationArr.map(item => {
          if (item.mac === this.macAderss) {
            windowCodeArr.push(item.code)
          }
        })
      }
      console.log(windowCodeArr)
      console.log(relationArr)
      console.log(this.macAderss)
      // debugger
      if (this.macAderss !== '' && windowCodeArr.length !== 0) {
        // 拥有部分屏幕权限
        if (obj.rtlayout.row && obj.rtlayout.column) {
          if (this.changePage) {
            // 直接选中某个窗格开窗
            if (this.changeWindowData.isOpen) {
              this.failureMethod('已开窗')
            } else {
              let flag = false // 为了将提示写在循环外
              this.netTable.map(item => {
                item.children &&
                  item.children.map(val => {
                    if (val.netIndex === this.changePage && windowCodeArr.includes(val.windowIndex)) {
                      flag = true
                      this.openWindowparams.wh = val.wh // 为开窗参数赋值
                      this.openWindowparams.windowsRect = val.windowsRect // 为开窗参数赋值
                      this.sendOpenWindowCommand() // 调用开窗函数
                      this.changePage = ''
                    }
                  })
              })
              if (!flag) {
                this.failureMethod('不在权限之内')
              }
            }
          } else {
            // debugger
            // 按顺序开窗
            let flag1 = false // 为了将提示写在循环外
            for (let i = 0; i < this.netTable.length; i++) {
              let item = this.netTable[i].children
              let isBreak = false
              for (let j = 0; j < item.length; j++) {
                let val = item[j]
                if (windowCodeArr.includes(val.windowIndex)) {
                  flag1 = true
                  this.openWindowparams.wh = val.wh // 为开窗参数赋值
                  this.openWindowparams.windowsRect = val.windowsRect // 为开窗参数赋值
                  if (!val.isOpen) {
                    this.sendOpenWindowCommand() // 调用开窗函数
                    isBreak = true
                    openWindowIndex = val.isOpen
                    break
                  }
                } else {
                  flag1 = false
                }
              }
              if (isBreak) {
                break
              }
            }
            if (!flag1) {
              this.failureMethod('不在权限之内')
            }
            if (openWindowIndex) {
              this.warningMethod('窗口已满，无法开窗')
            }
          }
        } else {
          this.warningMethod('该电视墙没有底板，无法开窗')
        }
      } else {
        // 拥有全部屏幕的权限
        if (obj.rtlayout.row && obj.rtlayout.column) {
          if (this.changePage) {
            // 直接选中某个窗格开窗
            if (this.changeWindowData.isOpen) {
              this.failureMethod('已开窗')
            } else {
              this.netTable.map(item => {
                item.children &&
                  item.children.map(val => {
                    if (val.netIndex === this.changePage) {
                      this.openWindowparams.wh = val.wh // 为开窗参数赋值
                      this.openWindowparams.windowsRect = val.windowsRect // 为开窗参数赋值
                      this.sendOpenWindowCommand() // 调用开窗函数
                      this.changePage = ''
                    }
                  })
              })
            }
          } else {
            // 按顺序开窗
            for (let i = 0; i < this.netTable.length; i++) {
              let item = this.netTable[i].children
              let isBreak = false
              for (let j = 0; j < item.length; j++) {
                let val = item[j]
                this.openWindowparams.wh = val.wh // 为开窗参数赋值
                this.openWindowparams.windowsRect = val.windowsRect // 为开窗参数赋值
                if (!val.isOpen) {
                  this.sendOpenWindowCommand() // 调用开窗函数
                  isBreak = true
                  openWindowIndex = val.isOpen
                  break
                }
              }
              if (isBreak) {
                break
              }
            }
            if (openWindowIndex) {
              this.warningMethod('窗口已满，无法开窗')
            }
          }
        } else {
          this.warningMethod('该电视墙没有底板，无法开窗')
        }
      }
    },
    // 发送开窗请求
    sendOpenWindowCommand() {
      this.openWindowparams.wallId = this.tvWallMessage.id
      this.openWindowparams.layoutId = this.tvWallMessage.rtlayout.id
      this.openWindowTvWall(this.openWindowparams)
        .then(res => {
          if (res.data.code === 0) {
            this.getWindowCount_fuc() // 开窗成功，重新计算窗口总数，已使用和未使用数
            this.succefullMethod('开窗成功')
            // 开窗成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj) // 发送开窗成功信号，重新拉去menu列表
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 资源放下事件(资源上墙)
     *1.目前有三种属性电视墙
     1.1 解码器(M3) type === 1
     1.2 拼控解码一体  type === 2
     1.3 本地终端输入上墙 资源resourcesData === 2
     1.4 轮巡拖拽放下事件 downResources3（窗口已经分割，放到窗口白条上，整个窗口轮巡）
     1.5 解码器+拼控 type === 4
     2.未分割 downResources
     3.已分割 downResources2
     * */
    async downResources(val) {
      console.log(val)
      console.log(this.nodeDropState)
      console.log(this.resourcesData)
      console.log(this.nodeDropWhere)
      // debugger
      let state = false
      if (val.isDivision) {
        // 如果分割，走downResources2
        return
      }
      if (!this.nodeDropState) {
      } else {
        if (!val.isOpen) {
          this.failureMethod('未开窗，无法上墙')
          this.SET_NODEDROP_STATE(state)
        } else {
          let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
          let relationArr
          let windowCodeArr = [] // 权限中的窗格号
          if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
            relationArr = relationData.data.data
            relationArr.map(item => {
              if (item.mac === this.macAderss) {
                windowCodeArr.push(item.code)
              }
            })
          }
          if (this.macAderss !== '' && windowCodeArr.length !== 0) {
            // 拥有部分屏幕权限
            if (windowCodeArr.includes(val.windowIndex)) {
              if (
                this.resourcesData.tierType === 'res' &&
                this.resourcesData.type === 1 &&
                this.nodeDropWhere === '资源'
              ) {
                // 资源上墙(机构和收藏夹)
                if (this.tvWallMessage.type === 1) {
                  // 该电视墙是普通电视墙(解码器-M3)
                  this.resourcesToTvWallparams2.devCtl.map(item => {
                    item.paneCount = 1
                    item.channel = val.associatedChannel
                    item.monitor = val.windowIndex
                    item.rids.map(item => {
                      item.rid = this.resourcesData.id
                    })
                  })
                  this.resourcesToTvWallparams2.wallId = this.tvWallMessage.id
                  this.sendresourcesToTvWall()
                  this.SET_NODEDROP_STATE(state)
                } else if (this.tvWallMessage.type === 2) {
                  // 该电视墙是解码拼控一体机电视墙
                  val.devCtl.map(item => {
                    item.rid = this.resourcesData.id
                  })
                  this.resourcesToTvWallparams.devCtl = val.devCtl // 为资源上墙参数赋值
                  this.sendresourcesToTvWall() // 资源上墙
                  this.SET_NODEDROP_STATE(state)
                } else if (this.tvWallMessage.type === 4) {
                  // 解码器 + 拼控
                  this.resourcesToTvWallparams4.wallId = this.tvWallMessage.id
                  this.resourcesToTvWallparams4.devCtl[0].rid = this.resourcesData.id
                  this.resourcesToTvWallparams4.devCtl[0].code = val.windowIndex
                  this.resourcesToTvWallparams4.devCtl[0].paneCount = 1
                  this.resourcesToTvWallparams4.devCtl[0].right = val.windowsRect[0].right
                  this.resourcesToTvWallparams4.devCtl[0].left = val.windowsRect[0].left
                  this.resourcesToTvWallparams4.devCtl[0].top = val.windowsRect[0].top
                  this.resourcesToTvWallparams4.devCtl[0].bottom = val.windowsRect[0].bottom
                  this.sendresourcesToTvWall()
                  this.SET_NODEDROP_STATE(state)
                }
              } else if (
                this.resourcesData.tierType === 'res' &&
                this.resourcesData.type === 2 &&
                this.nodeDropWhere === '资源'
              ) {
                // 本地终端上墙(b20)
                this.resourcesToTvWallparams3.wallId = this.tvWallMessage.id
                this.resourcesToTvWallparams3.devCtl.windowsRect.left = val.devCtl[0].left
                this.resourcesToTvWallparams3.devCtl.windowsRect.right = val.devCtl[0].right
                this.resourcesToTvWallparams3.devCtl.windowsRect.top = val.devCtl[0].top
                this.resourcesToTvWallparams3.devCtl.windowsRect.bottom = val.devCtl[0].bottom
                this.resourcesToTvWallparams3.devCtl.localSignalInfo.serise = this.resourcesData.channel
                this.resourcesToTvWallparams3.devCtl.localSignalInfo.id = this.resourcesData.id
                this.resourcesToTvWallparams3.devCtl.localSignalInfo.name = this.resourcesData.name
                this.sendresourcesToTvWall_local() // 本地终端输入上墙
                this.SET_NODEDROP_STATE(state)
              } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
                // 拖拽轮巡上墙(b20)
                this.TvpolingTowall.wallId = this.tvWallMessage.id
                this.TvpolingTowall.left = val.devCtl[0].left
                this.TvpolingTowall.right = val.devCtl[0].right
                this.TvpolingTowall.top = val.devCtl[0].top
                this.TvpolingTowall.bottom = val.devCtl[0].bottom
                this.TvpolingTowall.id = this.resourcesData.id
                this.sendPolingToTvWall()
                this.SET_NODEDROP_STATE(state)
              } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
                // 拖拽轮巡上墙(m3)
                this.TvpolingTowall_m3.channel = val.associatedChannel
                this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
                this.TvpolingTowall_m3.monitor = val.windowIndex
                this.TvpolingTowall_m3.id = this.resourcesData.id
                this.sendPolingToTvWall_m3()
                this.SET_NODEDROP_STATE(state)
              } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
                // 拖拽轮巡上墙(解码器+拼控)
                this.TvpolingTowallM3AndB20.left = val.windowsRect[0].left
                this.TvpolingTowallM3AndB20.right = val.windowsRect[0].right
                this.TvpolingTowallM3AndB20.top = val.windowsRect[0].top
                this.TvpolingTowallM3AndB20.bottom = val.windowsRect[0].bottom
                this.TvpolingTowallM3AndB20.id = this.resourcesData.id
                this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
                this.TvpolingTowallM3AndB20.code = val.windowIndex
                this.sendPolingToTvWallM3AndB20()
                this.SET_NODEDROP_STATE(state)
              } else {
                this.failureMethod('请选择资源上墙')
                this.SET_NODEDROP_STATE(state)
              }
            } else {
              this.failureMethod('不在权限之内')
              this.SET_NODEDROP_STATE(state)
            }
          } else {
            // 拥有全部屏幕的权限
            if (
              this.resourcesData.tierType === 'res' &&
              this.resourcesData.type === 1 &&
              this.nodeDropWhere === '资源'
            ) {
              // 资源上墙(机构和收藏夹)
              if (this.tvWallMessage.type === 1) {
                // 该电视墙是普通电视墙(解码器-M3)
                this.resourcesToTvWallparams2.devCtl.map(item => {
                  item.paneCount = 1
                  item.channel = val.associatedChannel
                  item.monitor = val.windowIndex
                  item.rids.map(item => {
                    item.rid = this.resourcesData.id
                  })
                })
                this.resourcesToTvWallparams2.wallId = this.tvWallMessage.id
                this.sendresourcesToTvWall()
                this.SET_NODEDROP_STATE(state)
              } else if (this.tvWallMessage.type === 2) {
                // 该电视墙是解码拼控一体机电视墙
                val.devCtl.map(item => {
                  item.rid = this.resourcesData.id
                })
                this.resourcesToTvWallparams.devCtl = val.devCtl // 为资源上墙参数赋值
                this.sendresourcesToTvWall() // 资源上墙
                this.SET_NODEDROP_STATE(state)
              } else if (this.tvWallMessage.type === 4) {
                // 解码器 + 拼控
                this.resourcesToTvWallparams4.wallId = this.tvWallMessage.id
                this.resourcesToTvWallparams4.devCtl[0].rid = this.resourcesData.id
                this.resourcesToTvWallparams4.devCtl[0].code = val.windowIndex
                this.resourcesToTvWallparams4.devCtl[0].paneCount = 1
                this.resourcesToTvWallparams4.devCtl[0].right = val.windowsRect[0].right
                this.resourcesToTvWallparams4.devCtl[0].left = val.windowsRect[0].left
                this.resourcesToTvWallparams4.devCtl[0].top = val.windowsRect[0].top
                this.resourcesToTvWallparams4.devCtl[0].bottom = val.windowsRect[0].bottom
                this.sendresourcesToTvWall()
                this.SET_NODEDROP_STATE(state)
              }
            } else if (
              this.resourcesData.tierType === 'res' &&
              this.resourcesData.type === 2 &&
              this.nodeDropWhere === '资源'
            ) {
              // 本地终端上墙(b20)
              this.resourcesToTvWallparams3.wallId = this.tvWallMessage.id
              this.resourcesToTvWallparams3.devCtl.windowsRect.left = val.devCtl[0].left
              this.resourcesToTvWallparams3.devCtl.windowsRect.right = val.devCtl[0].right
              this.resourcesToTvWallparams3.devCtl.windowsRect.top = val.devCtl[0].top
              this.resourcesToTvWallparams3.devCtl.windowsRect.bottom = val.devCtl[0].bottom
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.serise = this.resourcesData.channel
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.id = this.resourcesData.id
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.name = this.resourcesData.name
              this.sendresourcesToTvWall_local() // 本地终端输入上墙
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
              // 拖拽轮巡上墙(b20)
              this.TvpolingTowall.wallId = this.tvWallMessage.id
              this.TvpolingTowall.left = val.devCtl[0].left
              this.TvpolingTowall.right = val.devCtl[0].right
              this.TvpolingTowall.top = val.devCtl[0].top
              this.TvpolingTowall.bottom = val.devCtl[0].bottom
              this.TvpolingTowall.id = this.resourcesData.id
              this.sendPolingToTvWall()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
              // 拖拽轮巡上墙(m3)
              this.TvpolingTowall_m3.channel = val.associatedChannel
              this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
              this.TvpolingTowall_m3.monitor = val.windowIndex
              this.TvpolingTowall_m3.id = this.resourcesData.id
              this.sendPolingToTvWall_m3()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
              // 拖拽轮巡上墙(解码器+拼控)
              this.TvpolingTowallM3AndB20.left = val.windowsRect[0].left
              this.TvpolingTowallM3AndB20.right = val.windowsRect[0].right
              this.TvpolingTowallM3AndB20.top = val.windowsRect[0].top
              this.TvpolingTowallM3AndB20.bottom = val.windowsRect[0].bottom
              this.TvpolingTowallM3AndB20.id = this.resourcesData.id
              this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
              this.TvpolingTowallM3AndB20.code = val.windowIndex
              this.sendPolingToTvWallM3AndB20()
              this.SET_NODEDROP_STATE(state)
            } else {
              this.failureMethod('请选择资源上墙')
              this.SET_NODEDROP_STATE(state)
            }
          }
        }
      }
    },
    async downResources2(val, td) {
      console.log(val)
      console.log(td)
      // debugger
      if (!this.nodeDropState) {
      } else {
        let state = false
        let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
        let relationArr
        let windowCodeArr = [] // 权限中的窗格号
        if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
          relationArr = relationData.data.data
          relationArr.map(item => {
            if (item.mac === this.macAderss) {
              windowCodeArr.push(item.code)
            }
          })
        }
        if (this.macAderss !== '' && windowCodeArr.length !== 0) {
          // 拥有部分屏幕权限
          if (windowCodeArr.includes(td.windowIndex)) {
            if (
              this.resourcesData.tierType === 'res' &&
              this.resourcesData.type === 1 &&
              this.nodeDropWhere === '资源'
            ) {
              if (this.tvWallMessage.type === 1) {
                // debugger
                // 该电视墙是普通电视墙(解码器-M3)
                this.resourcesToTvWallparams2.devCtl.map(item => {
                  item.paneCount = val.windowIndex
                  item.channel = td.associatedChannel
                  item.monitor = td.windowIndex
                  item.rids.map(item => {
                    // item.code = val.windowIndex
                    item.rid = this.resourcesData.id
                  })
                })
                this.resourcesToTvWallparams2.wallId = this.tvWallMessage.id
                this.sendresourcesToTvWall()
                this.SET_NODEDROP_STATE(state)
              } else if (this.tvWallMessage.type === 2) {
                // 该电视墙是解码拼控一体机电视墙
                td.devCtl.map(item => {
                  item.rid = this.resourcesData.id
                  item.paneCount = val.windowIndex
                })
                this.resourcesToTvWallparams.devCtl = td.devCtl // 为资源上墙参数赋值
                this.sendresourcesToTvWall() // 资源上墙
                this.SET_NODEDROP_STATE(state)
              } else if (this.tvWallMessage.type === 4) {
                // 解码器+拼控
                this.resourcesToTvWallparams4.wallId = this.tvWallMessage.id
                this.resourcesToTvWallparams4.devCtl[0].rid = this.resourcesData.id
                this.resourcesToTvWallparams4.devCtl[0].code = td.windowIndex
                this.resourcesToTvWallparams4.devCtl[0].paneCount = val.windowIndex
                this.resourcesToTvWallparams4.devCtl[0].right = td.windowsRect[0].right
                this.resourcesToTvWallparams4.devCtl[0].left = td.windowsRect[0].left
                this.resourcesToTvWallparams4.devCtl[0].top = td.windowsRect[0].top
                this.resourcesToTvWallparams4.devCtl[0].bottom = td.windowsRect[0].bottom
                this.sendresourcesToTvWall() // 资源上墙
                this.SET_NODEDROP_STATE(state)
              }
            } else if (
              this.resourcesData.tierType === 'res' &&
              this.resourcesData.type === 2 &&
              this.nodeDropWhere === '资源'
            ) {
              // 本地终端上墙(b20窗口分割)
              this.resourcesToTvWallparams3.wallId = this.tvWallMessage.id
              this.resourcesToTvWallparams3.devCtl.windowsRect.paneCount = val.windowIndex
              this.resourcesToTvWallparams3.devCtl.windowsRect.left = td.devCtl[0].left
              this.resourcesToTvWallparams3.devCtl.windowsRect.right = td.devCtl[0].right
              this.resourcesToTvWallparams3.devCtl.windowsRect.top = td.devCtl[0].top
              this.resourcesToTvWallparams3.devCtl.windowsRect.bottom = td.devCtl[0].bottom
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.serise = this.resourcesData.channel
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.id = this.resourcesData.id
              this.resourcesToTvWallparams3.devCtl.localSignalInfo.name = this.resourcesData.name
              this.sendresourcesToTvWall_local() // 本地终端输入上墙
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
              // 拖拽轮巡上墙(b20)
              this.TvpolingTowall.wallId = this.tvWallMessage.id
              this.TvpolingTowall.left = td.devCtl[0].left
              this.TvpolingTowall.right = td.devCtl[0].right
              this.TvpolingTowall.top = td.devCtl[0].top
              this.TvpolingTowall.bottom = td.devCtl[0].bottom
              this.TvpolingTowall.id = this.resourcesData.id
              this.TvpolingTowall.type = 1
              this.TvpolingTowall.paneCount = val.windowIndex
              this.sendPolingToTvWall()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
              // 拖拽轮巡上墙(m3)
              this.TvpolingTowall_m3.channel = td.associatedChannel
              this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
              this.TvpolingTowall_m3.monitor = td.windowIndex
              this.TvpolingTowall_m3.id = this.resourcesData.id
              this.TvpolingTowall_m3.type = 1
              this.TvpolingTowall_m3.paneCount = val.windowIndex
              this.sendPolingToTvWall_m3()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
              // 拖拽轮巡上墙(解码器+拼控)
              this.TvpolingTowallM3AndB20.type = 1
              this.TvpolingTowallM3AndB20.paneCount = val.windowIndex
              this.TvpolingTowallM3AndB20.left = td.windowsRect[0].left
              this.TvpolingTowallM3AndB20.right = td.windowsRect[0].right
              this.TvpolingTowallM3AndB20.top = td.windowsRect[0].top
              this.TvpolingTowallM3AndB20.bottom = td.windowsRect[0].bottom
              this.TvpolingTowallM3AndB20.id = this.resourcesData.id
              this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
              this.TvpolingTowallM3AndB20.code = td.windowIndex
              this.sendPolingToTvWallM3AndB20()
              this.SET_NODEDROP_STATE(state)
            } else {
              this.failureMethod('请选择资源上墙')
              this.SET_NODEDROP_STATE(state)
            }
          } else {
            this.failureMethod('不在权限之内')
            this.SET_NODEDROP_STATE(state)
          }
        } else {
          // 拥有全部屏幕的权限
          if (this.resourcesData.tierType === 'res' && this.resourcesData.type === 1 && this.nodeDropWhere === '资源') {
            if (this.tvWallMessage.type === 1) {
              // debugger
              // 该电视墙是普通电视墙(解码器-M3)
              this.resourcesToTvWallparams2.devCtl.map(item => {
                item.paneCount = val.windowIndex
                item.channel = td.associatedChannel
                item.monitor = td.windowIndex
                item.rids.map(item => {
                  // item.code = val.windowIndex
                  item.rid = this.resourcesData.id
                })
              })
              this.resourcesToTvWallparams2.wallId = this.tvWallMessage.id
              this.sendresourcesToTvWall()
              this.SET_NODEDROP_STATE(state)
            } else if (this.tvWallMessage.type === 2) {
              // 该电视墙是解码拼控一体机电视墙
              td.devCtl.map(item => {
                item.rid = this.resourcesData.id
                item.paneCount = val.windowIndex
              })
              this.resourcesToTvWallparams.devCtl = td.devCtl // 为资源上墙参数赋值
              this.sendresourcesToTvWall() // 资源上墙
              this.SET_NODEDROP_STATE(state)
            } else if (this.tvWallMessage.type === 4) {
              // 解码器+拼控
              this.resourcesToTvWallparams4.wallId = this.tvWallMessage.id
              this.resourcesToTvWallparams4.devCtl[0].rid = this.resourcesData.id
              this.resourcesToTvWallparams4.devCtl[0].code = td.windowIndex
              this.resourcesToTvWallparams4.devCtl[0].paneCount = val.windowIndex
              this.resourcesToTvWallparams4.devCtl[0].right = td.windowsRect[0].right
              this.resourcesToTvWallparams4.devCtl[0].left = td.windowsRect[0].left
              this.resourcesToTvWallparams4.devCtl[0].top = td.windowsRect[0].top
              this.resourcesToTvWallparams4.devCtl[0].bottom = td.windowsRect[0].bottom
              this.sendresourcesToTvWall() // 资源上墙
              this.SET_NODEDROP_STATE(state)
            }
          } else if (
            this.resourcesData.tierType === 'res' &&
            this.resourcesData.type === 2 &&
            this.nodeDropWhere === '资源'
          ) {
            // 本地终端上墙(b20窗口分割)
            this.resourcesToTvWallparams3.wallId = this.tvWallMessage.id
            this.resourcesToTvWallparams3.devCtl.windowsRect.paneCount = val.windowIndex
            this.resourcesToTvWallparams3.devCtl.windowsRect.left = td.devCtl[0].left
            this.resourcesToTvWallparams3.devCtl.windowsRect.right = td.devCtl[0].right
            this.resourcesToTvWallparams3.devCtl.windowsRect.top = td.devCtl[0].top
            this.resourcesToTvWallparams3.devCtl.windowsRect.bottom = td.devCtl[0].bottom
            this.resourcesToTvWallparams3.devCtl.localSignalInfo.serise = this.resourcesData.channel
            this.resourcesToTvWallparams3.devCtl.localSignalInfo.id = this.resourcesData.id
            this.resourcesToTvWallparams3.devCtl.localSignalInfo.name = this.resourcesData.name
            this.sendresourcesToTvWall_local() // 本地终端输入上墙
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
            // 拖拽轮巡上墙(b20)
            this.TvpolingTowall.wallId = this.tvWallMessage.id
            this.TvpolingTowall.left = td.devCtl[0].left
            this.TvpolingTowall.right = td.devCtl[0].right
            this.TvpolingTowall.top = td.devCtl[0].top
            this.TvpolingTowall.bottom = td.devCtl[0].bottom
            this.TvpolingTowall.id = this.resourcesData.id
            this.TvpolingTowall.type = 1
            this.TvpolingTowall.paneCount = val.windowIndex
            this.sendPolingToTvWall()
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
            // 拖拽轮巡上墙(m3)
            this.TvpolingTowall_m3.channel = td.associatedChannel
            this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
            this.TvpolingTowall_m3.monitor = td.windowIndex
            this.TvpolingTowall_m3.id = this.resourcesData.id
            this.TvpolingTowall_m3.type = 1
            this.TvpolingTowall_m3.paneCount = val.windowIndex
            this.sendPolingToTvWall_m3()
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
            // 拖拽轮巡上墙(解码器+拼控)
            this.TvpolingTowallM3AndB20.type = 1
            this.TvpolingTowallM3AndB20.paneCount = val.windowIndex
            this.TvpolingTowallM3AndB20.left = td.windowsRect[0].left
            this.TvpolingTowallM3AndB20.right = td.windowsRect[0].right
            this.TvpolingTowallM3AndB20.top = td.windowsRect[0].top
            this.TvpolingTowallM3AndB20.bottom = td.windowsRect[0].bottom
            this.TvpolingTowallM3AndB20.id = this.resourcesData.id
            this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
            this.TvpolingTowallM3AndB20.code = td.windowIndex
            this.sendPolingToTvWallM3AndB20()
            this.SET_NODEDROP_STATE(state)
          } else {
            this.failureMethod('请选择资源上墙')
            this.SET_NODEDROP_STATE(state)
          }
        }
      }
    },
    async downResources3(val) {
      let state = false
      if (!this.nodeDropState) {
      } else {
        let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
        let relationArr
        let windowCodeArr = [] // 权限中的窗格号
        if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
          relationArr = relationData.data.data
          relationArr.map(item => {
            if (item.mac === this.macAderss) {
              windowCodeArr.push(item.code)
            }
          })
        }
        if (this.macAderss !== '' && windowCodeArr.length !== 0) {
          // 拥有部分屏幕权限
          if (windowCodeArr.includes(val.windowIndex)) {
            if (this.resourcesData.tierType === 'res' && this.nodeDropWhere === '资源') {
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
              // 拖拽轮巡上墙(b20)
              this.TvpolingTowall.wallId = this.tvWallMessage.id
              this.TvpolingTowall.left = val.devCtl[0].left
              this.TvpolingTowall.right = val.devCtl[0].right
              this.TvpolingTowall.top = val.devCtl[0].top
              this.TvpolingTowall.bottom = val.devCtl[0].bottom
              this.TvpolingTowall.id = this.resourcesData.id
              this.sendPolingToTvWall()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
              // 拖拽轮巡上墙(m3)
              this.TvpolingTowall_m3.channel = val.associatedChannel
              this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
              this.TvpolingTowall_m3.monitor = val.windowIndex
              this.TvpolingTowall_m3.id = this.resourcesData.id
              this.sendPolingToTvWall_m3()
              this.SET_NODEDROP_STATE(state)
            } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
              // 拖拽轮巡上墙(解码器+拼控)
              this.TvpolingTowallM3AndB20.left = val.windowsRect[0].left
              this.TvpolingTowallM3AndB20.right = val.windowsRect[0].right
              this.TvpolingTowallM3AndB20.top = val.windowsRect[0].top
              this.TvpolingTowallM3AndB20.bottom = val.windowsRect[0].bottom
              this.TvpolingTowallM3AndB20.id = this.resourcesData.id
              this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
              this.TvpolingTowallM3AndB20.code = val.windowIndex
              this.sendPolingToTvWallM3AndB20()
              this.SET_NODEDROP_STATE(state)
            }
          } else {
            this.failureMethod('不在权限之内')
            this.SET_NODEDROP_STATE(state)
          }
        } else {
          // 拥有全部屏幕的权限
          if (this.resourcesData.tierType === 'res' && this.nodeDropWhere === '资源') {
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 2) {
            // 拖拽轮巡上墙(b20)
            this.TvpolingTowall.wallId = this.tvWallMessage.id
            this.TvpolingTowall.left = val.devCtl[0].left
            this.TvpolingTowall.right = val.devCtl[0].right
            this.TvpolingTowall.top = val.devCtl[0].top
            this.TvpolingTowall.bottom = val.devCtl[0].bottom
            this.TvpolingTowall.id = this.resourcesData.id
            this.sendPolingToTvWall()
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 1) {
            // 拖拽轮巡上墙(m3)
            this.TvpolingTowall_m3.channel = val.associatedChannel
            this.TvpolingTowall_m3.wallId = this.tvWallMessage.id
            this.TvpolingTowall_m3.monitor = val.windowIndex
            this.TvpolingTowall_m3.id = this.resourcesData.id
            this.sendPolingToTvWall_m3()
            this.SET_NODEDROP_STATE(state)
          } else if (this.nodeDropWhere === '轮巡' && this.tvWallMessage.type === 4) {
            // 拖拽轮巡上墙(解码器+拼控)
            this.TvpolingTowallM3AndB20.left = val.windowsRect[0].left
            this.TvpolingTowallM3AndB20.right = val.windowsRect[0].right
            this.TvpolingTowallM3AndB20.top = val.windowsRect[0].top
            this.TvpolingTowallM3AndB20.bottom = val.windowsRect[0].bottom
            this.TvpolingTowallM3AndB20.id = this.resourcesData.id
            this.TvpolingTowallM3AndB20.wallId = this.tvWallMessage.id
            this.TvpolingTowallM3AndB20.code = val.windowIndex
            this.sendPolingToTvWallM3AndB20()
            this.SET_NODEDROP_STATE(state)
          }
        }
      }
    },
    /**
     * 发送资源上墙请求
     * 1.目前有三种属性电视墙
     * 1.1 解码器(M3) type === 1 sendresourcesToTvWall
     * 1.2 拼控解码一体  type === 2 sendresourcesToTvWall
     * 1.3 本地终端输入上墙 资源type === 2 sendresourcesToTvWall_local
     * 1.4 轮巡上墙 sendPolingToTvWall
     * 1.5 轮巡上墙(m3)   sendPolingToTvWall_m3
     * 1.6 解码器 + 拼控 type === 4 sendresourcesToTvWall
     * 1.7 轮巡上墙(解码器+拼控) sendPolingToTvWallM3AndB20
     * */
    sendresourcesToTvWall() {
      if (this.tvWallMessage.type === 1) {
        // 解码器(M3)属性电视墙
        this.opendecoder(this.resourcesToTvWallparams2)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('资源上墙成功')
              // 开窗成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj)
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.tvWallMessage.type === 2) {
        // 解码拼控一体机属性电视墙
        this.resourcesToTvWallparams.wallId = this.tvWallMessage.id
        this.resourcesToTvWall(this.resourcesToTvWallparams)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('资源上墙成功')
              // 开窗成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj)
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.tvWallMessage.type === 4) {
        // 解码器+拼控
        this.opendecoderM3AndB20Api(this.resourcesToTvWallparams4)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('资源上墙成功')
              // 资源上墙成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj)
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    sendresourcesToTvWall_local() {
      this.resourcesToTvWallLocal(this.resourcesToTvWallparams3)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('本地终端上墙成功')
            // 本地终端输入上墙成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendPolingToTvWall() {
      this.executePolling(this.TvpolingTowall)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('轮巡上墙成功')
            // 轮巡上墙成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendPolingToTvWall_m3() {
      this.executePollingM3(this.TvpolingTowall_m3)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('轮巡上墙成功')
            // 轮巡上墙成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendPolingToTvWallM3AndB20() {
      this.executePollingM3AndB20Api(this.TvpolingTowallM3AndB20)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('轮巡上墙成功')
            // 轮巡上墙成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 资源下墙请求(停止解码)
    async closeTv(val) {
      if (val === 1) {
        // m3/b20指定停止解码
        if (
          (this.changeWindowData.isToWall === false && this.changeWindowData.isTowallLocal === false) ||
          (this.changeWindowData_child.division_isToWall === false &&
            this.changeWindowData_child.division_isTowallLocal === false)
        ) {
          this.failureMethod('资源未上墙')
        } else {
          let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
          let relationArr
          let windowCodeArr = [] // 权限中的窗格号
          if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
            relationArr = relationData.data.data
            relationArr.map(item => {
              if (item.mac === this.macAderss) {
                windowCodeArr.push(item.code)
              }
            })
          }
          if (this.macAderss !== '' && windowCodeArr.length !== 0) {
            // 拥有部分屏幕权限
            if (this.tvWallMessage.type === 1) {
              if (windowCodeArr.includes(this.changeWindowData.windowIndex)) {
                // M3指定窗口停止解码
                console.log(this.changeWindowData_child)
                console.log(this.changeWindowData)
                // debugger
                let obj = { channel: '', monitor: '', paneCount: 1 }
                obj.channel = this.changeWindowData.associatedChannel
                obj.monitor = this.changeWindowData.windowIndex
                if (this.changeWindowData.isDivision) {
                  obj.paneCount = this.changeWindowData_child.windowIndex
                }
                let params = {
                  windowsRect: [obj],
                  wallId: this.changeWindowData.wallId,
                  status: 1
                }
                this.closeopendecoder(params)
                  .then(res => {
                    if (res.data.code === 0) {
                      this.succefullMethod('停止解码成功')
                      // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                      let sendObj = {
                        state: true,
                        id: this.tvWallMessage.id
                      }
                      this.SET_CREATED_FLOOR(sendObj)
                    } else {
                      this.failureMethod('请求失败')
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                this.failureMethod('不在权限之内')
              }
            } else if (this.tvWallMessage.type === 2) {
              if (windowCodeArr.includes(this.changeWindowData.windowIndex)) {
                // 拼控一体指定窗口停止解码
                this.changeWindowData.windowsRect.map(item => {
                  delete item.code
                  item.paneCount = 1
                })
                if (this.changeWindowData.isDivision) {
                  this.changeWindowData.windowsRect.map(item => {
                    delete item.code
                    item.paneCount = this.changeWindowData_child.windowIndex
                  })
                }
                let params = {
                  wallId: this.changeWindowData.wallId,
                  status: 1,
                  windowsRect: this.changeWindowData.windowsRect
                }
                this.closeresourcesToTvWall(params)
                  .then(res => {
                    if (res.data.code === 0) {
                      this.succefullMethod('停止解码成功')
                      // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                      let sendObj = {
                        state: true,
                        id: this.tvWallMessage.id
                      }
                      this.SET_CREATED_FLOOR(sendObj)
                    } else {
                      this.failureMethod('请求失败')
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                this.failureMethod('不在权限之内')
              }
            } else if (this.tvWallMessage.type === 4) {
              if (windowCodeArr.includes(this.changeWindowData.windowIndex)) {
                let obj = { code: '', left: '', right: '', top: '', bottom: '', paneCount: 1 }
                obj.code = this.changeWindowData.windowsRect[0].code
                obj.left = this.changeWindowData.windowsRect[0].left
                obj.right = this.changeWindowData.windowsRect[0].right
                obj.top = this.changeWindowData.windowsRect[0].top
                obj.bottom = this.changeWindowData.windowsRect[0].bottom
                if (this.changeWindowData.isDivision) {
                  obj.paneCount = this.changeWindowData_child.windowIndex
                }
                let params = {
                  windowsRect: [obj],
                  wallId: this.changeWindowData.wallId,
                  status: 1
                }
                this.closeopendecoderM3AndB20Api(params)
                  .then(res => {
                    if (res.data.code === 0) {
                      this.succefullMethod('停止解码成功')
                      // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                      let sendObj = {
                        state: true,
                        id: this.tvWallMessage.id
                      }
                      this.SET_CREATED_FLOOR(sendObj)
                    } else {
                      this.failureMethod('请求失败')
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                this.failureMethod('不在权限之内')
              }
            }
          } else {
            // 拥有全部屏幕的权限
            if (this.tvWallMessage.type === 1) {
              // M3指定窗口停止解码
              console.log(this.changeWindowData_child)
              console.log(this.changeWindowData)
              let obj = { channel: '', monitor: '', paneCount: 1 }
              obj.channel = this.changeWindowData.associatedChannel
              obj.monitor = this.changeWindowData.windowIndex
              if (this.changeWindowData.isDivision) {
                obj.paneCount = this.changeWindowData_child.windowIndex
              }
              let params = {
                windowsRect: [obj],
                wallId: this.changeWindowData.wallId,
                status: 1
              }
              this.closeopendecoder(params)
                .then(res => {
                  if (res.data.code === 0) {
                    this.succefullMethod('停止解码成功')
                    // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                    let sendObj = {
                      state: true,
                      id: this.tvWallMessage.id
                    }
                    this.SET_CREATED_FLOOR(sendObj)
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (this.tvWallMessage.type === 2) {
              // 拼控一体指定窗口停止解码
              this.changeWindowData.windowsRect.map(item => {
                delete item.code
                item.paneCount = 1
              })
              if (this.changeWindowData.isDivision) {
                this.changeWindowData.windowsRect.map(item => {
                  delete item.code
                  item.paneCount = this.changeWindowData_child.windowIndex
                })
              }
              let params = {
                wallId: this.changeWindowData.wallId,
                status: 1,
                windowsRect: this.changeWindowData.windowsRect
              }
              this.closeresourcesToTvWall(params)
                .then(res => {
                  if (res.data.code === 0) {
                    this.succefullMethod('停止解码成功')
                    // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                    let sendObj = {
                      state: true,
                      id: this.tvWallMessage.id
                    }
                    this.SET_CREATED_FLOOR(sendObj)
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (this.tvWallMessage.type === 4) {
              // 解码器+拼控 指定窗口停止解码
              let obj = { code: '', left: '', right: '', top: '', bottom: '', paneCount: 1 }
              obj.code = this.changeWindowData.windowsRect[0].code
              obj.left = this.changeWindowData.windowsRect[0].left
              obj.right = this.changeWindowData.windowsRect[0].right
              obj.top = this.changeWindowData.windowsRect[0].top
              obj.bottom = this.changeWindowData.windowsRect[0].bottom
              if (this.changeWindowData.isDivision) {
                obj.paneCount = this.changeWindowData_child.windowIndex
              }
              let params = {
                windowsRect: [obj],
                wallId: this.changeWindowData.wallId,
                status: 1
              }
              this.closeopendecoderM3AndB20Api(params)
                .then(res => {
                  if (res.data.code === 0) {
                    this.succefullMethod('停止解码成功')
                    // 停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                    let sendObj = {
                      state: true,
                      id: this.tvWallMessage.id
                    }
                    this.SET_CREATED_FLOOR(sendObj)
                  } else {
                    this.failureMethod('请求失败')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }
      } else {
        // 全部停止解码
        let params = {
          wallId: this.tvWallMessage.id,
          status: 2
        }
        if (this.tvWallMessage.type === 1) {
          // M3全部停止解码
          this.closeopendecoder(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('全部停止解码成功')
                // 全部停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
              } else {
                this.failureMethod('请求失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else if (this.tvWallMessage.type === 2) {
          // 拼控一体全部停止解码
          this.closeresourcesToTvWall(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('全部停止解码成功')
                // 全部停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
              } else {
                this.failureMethod('请求失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else if (this.tvWallMessage.type === 4) {
          // 解码器+拼控 全部停止解码
          this.closeopendecoderM3AndB20Api(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('全部停止解码成功')
                // 全部停止解码成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
              } else {
                this.failureMethod('请求失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 点击任意窗口(未分割)
    everyBody(index, data) {
      this.changeWindowData = data // 单独选中的窗格信息赋值
      this.changePage = index
      if (this.tvWallMessage.type === 2 && data.isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.paneCount = 1
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.left = data.devCtl[0].left
        this.WindowVideoParams.right = data.devCtl[0].right
        this.WindowVideoParams.top = data.devCtl[0].top
        this.WindowVideoParams.bottom = data.devCtl[0].bottom
        this.getWindowVideo()
      } else if (this.tvWallMessage.type === 1 && data.isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.paneCount = 1
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.monitor = data.windowIndex
        this.getWindowVideo()
      } else if (this.tvWallMessage.type === 4 && data.isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.paneCount = 1
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.left = data.devCtl[0].left
        this.WindowVideoParams.right = data.devCtl[0].right
        this.WindowVideoParams.top = data.devCtl[0].top
        this.WindowVideoParams.bottom = data.devCtl[0].bottom
        this.WindowVideoParams.code = data.windowIndex
        this.getWindowVideo()
      }
    },
    // 点击任意窗口已分割
    everyBody_children(index, data, td) {
      // 给它添加了阻止冒泡事件(禁止点击它，触发everyBody函数，并且给了this.changePage = td.netIndex    this.changeWindowData = td)
      this.changePage_children = index
      this.changePage = td.netIndex
      this.changeWindowData = td // 单独选中的窗格信息赋值
      this.changeWindowData_child = data
      if (this.tvWallMessage.type === 2 && data.division_isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.left = td.devCtl[0].left
        this.WindowVideoParams.right = td.devCtl[0].right
        this.WindowVideoParams.top = td.devCtl[0].top
        this.WindowVideoParams.bottom = td.devCtl[0].bottom
        this.WindowVideoParams.paneCount = data.windowIndex
        this.getWindowVideo()
      } else if (this.tvWallMessage.type === 1 && data.division_isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.paneCount = data.windowIndex
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.monitor = td.windowIndex
        this.getWindowVideo()
      } else if (this.tvWallMessage.type === 4 && data.division_isToWall) {
        this.WindowVideoParams = {}
        this.WindowVideoParams.wallId = this.tvWallMessage.id
        this.WindowVideoParams.left = td.devCtl[0].left
        this.WindowVideoParams.right = td.devCtl[0].right
        this.WindowVideoParams.top = td.devCtl[0].top
        this.WindowVideoParams.bottom = td.devCtl[0].bottom
        this.WindowVideoParams.code = td.windowIndex
        this.WindowVideoParams.paneCount = data.windowIndex
        this.getWindowVideo()
      }
    },
    // 点击任意窗口，获取播放信息请求
    getWindowVideo() {
      this.getcurstatus(this.WindowVideoParams)
        .then(res => {
          if (res.data.code === 0) {
            this.videoData = res.data.data
            this.SET_VIDEO_PARAMS(this.videoData) // 将播放需要的信息发到vuex中
          } else {
            let params = {}
            this.SET_VIDEO_PARAMS(params)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 拼接
    async JoiningTogether(index) {
      /**
       * index = 1 点击拼接时，拼接
       * index = 2 页面刷新时，自动调用拼接函数，恢复以前拼接好的屏幕
       * */
      console.log(this.tvWallMessage)
      console.log(this.newArr)
      console.log(this.limitsArr)
      console.log(index)
      // debugger
      let relationData = []
      let relationArr = []
      let windowCodeArr = [] // 权限中的窗格号
      if (index === 1) {
        relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
        if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
          relationArr = relationData.data.data
          relationArr.map(item => {
            if (item.mac === this.macAderss) {
              windowCodeArr.push(item.code)
            }
          })
        }
      }
      if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
        if (this.macAderss !== '' && windowCodeArr.length !== 0 && index === 1) {
          // 拥有部分屏幕权限
          let codeArr = this.limitsArr.filter(item => !windowCodeArr.includes(item)) // 过滤(选中的屏幕是否在权限之内)
          if (codeArr.length === 0) {
            if (this.tvWallMessage.rtlayout.wininfo && this.mergeWindowState) {
              // 判断是否符合拼接的要求(取出后台缓存的坐标:大于1次的拼接)
              this.tvWallMessage.rtlayout.wininfo.map(item => {
                if (item.originwnd) {
                  item.originwnd.map(item => {
                    this.newArr.push(item.netIndex)
                  })
                }
              })
              let b = this.unique(this.newArr)
              this.newArr = b
            }
            if (this.newArr.length !== 0) {
              let xArr = []
              let yArr = []
              this.newArr.map(item => {
                xArr.push(item.split('-')[0])
                yArr.push(item.split('-')[1])
              })
              const wid = 1 // 模拟宽,假设值
              const hig = 1 // 模拟高，假设值
              let xMin = Math.min.apply(null, xArr)
              let yMin = Math.min.apply(null, yArr)
              let xMax = Math.max.apply(null, xArr) + 1
              let yMax = Math.max.apply(null, yArr) + 1
              let xLong = xMax - xMin
              let yLong = yMax - yMin
              let changeAre = xLong * yLong * wid * hig // 所选择构成的最大面积
              let sjAre = this.newArr.length * wid * hig // 实际勾选面积
              if (changeAre === sjAre) {
                this.netTable.map(item => {
                  item.children &&
                    item.children.map(val => {
                      val.checked = false // 将选中状态去掉
                      let minAxio = xMin + '-' + yMin
                      if (val.netIndex === minAxio) {
                        val.rowspan = yMax - yMin
                        val.colspan = xMax - xMin
                        val.isMergeArr = Object.assign([], this.newArr)
                        val.windowsRect.map(item => {
                          this.windowmergewnd.afterwnd.left = item.left
                          this.windowmergewnd.afterwnd.top = item.top
                          this.windowmergewnd.afterwnd.right =
                            item.right * val.colspan === 1 ? 0 : item.right * val.colspan
                          this.windowmergewnd.afterwnd.bottom =
                            item.bottom * val.rowspan === 1 ? 0 : item.bottom * val.rowspan
                        })
                        this.sendWindowTogether()
                      }
                    })
                })
                this.newArr = [] // 拼接成功，将选中数组清空
              } else {
                this.warningMethod('不符合拼接要求')
              }
            } else {
              this.warningMethod('请选择所需拼接的电视墙')
            }
          } else {
            this.failureMethod('不在权限之内')
          }
        } else {
          // 拥有全部屏幕的权限
          if (this.tvWallMessage.rtlayout.wininfo && index === 1 && this.mergeWindowState) {
            // 判断是否符合拼接的要求(取出后台缓存的坐标:大于1次的拼接)
            this.tvWallMessage.rtlayout.wininfo.map(item => {
              if (item.originwnd) {
                item.originwnd.map(item => {
                  this.newArr.push(item.netIndex)
                })
              }
            })
            let b = this.unique(this.newArr)
            this.newArr = b
          }
          if (this.newArr.length !== 0) {
            let xArr = []
            let yArr = []
            this.newArr.map(item => {
              xArr.push(item.split('-')[0])
              yArr.push(item.split('-')[1])
            })
            const wid = 1 // 模拟宽,假设值
            const hig = 1 // 模拟高，假设值
            let xMin = Math.min.apply(null, xArr)
            let yMin = Math.min.apply(null, yArr)
            let xMax = Math.max.apply(null, xArr) + 1
            let yMax = Math.max.apply(null, yArr) + 1
            let xLong = xMax - xMin
            let yLong = yMax - yMin
            let changeAre = xLong * yLong * wid * hig // 所选择构成的最大面积
            let sjAre = this.newArr.length * wid * hig // 实际勾选面积
            if (changeAre === sjAre) {
              this.netTable.map(item => {
                item.children &&
                  item.children.map(val => {
                    val.checked = false // 将选中状态去掉
                    let minAxio = xMin + '-' + yMin
                    if (val.netIndex === minAxio) {
                      val.rowspan = yMax - yMin
                      val.colspan = xMax - xMin
                      val.isMergeArr = Object.assign([], this.newArr)
                      val.windowsRect.map(item => {
                        this.windowmergewnd.afterwnd.left = item.left
                        this.windowmergewnd.afterwnd.top = item.top
                        this.windowmergewnd.afterwnd.right =
                          item.right * val.colspan === 1 ? 0 : item.right * val.colspan
                        this.windowmergewnd.afterwnd.bottom =
                          item.bottom * val.rowspan === 1 ? 0 : item.bottom * val.rowspan
                      })
                      if (index === 1) {
                        this.sendWindowTogether()
                      } else if (index === 2) {
                        console.log()
                        // val['jointCoordinates'] = this.windowmergewnd.afterwnd // 为当前数据赋值(合拼之后的坐标)
                        val.jointCoordinates.map(item => {
                          item.top = this.windowmergewnd.afterwnd.top
                          item.right = this.windowmergewnd.afterwnd.right
                          item.bottom = this.windowmergewnd.afterwnd.bottom
                          item.left = this.windowmergewnd.afterwnd.left
                        })
                        val.devCtl.map(item => {
                          // 合拼成功，为它附上合拼之后的坐标
                          item.top = this.windowmergewnd.afterwnd.top
                          item.right = this.windowmergewnd.afterwnd.right
                          item.bottom = this.windowmergewnd.afterwnd.bottom
                          item.left = this.windowmergewnd.afterwnd.left
                        })
                        val.windowsRect.map(item => {
                          item.top = this.windowmergewnd.afterwnd.top
                          item.right = this.windowmergewnd.afterwnd.right
                          item.bottom = this.windowmergewnd.afterwnd.bottom
                          item.left = this.windowmergewnd.afterwnd.left
                        })
                      }
                    }
                    if (index === 2) {
                      if (this.newArr.includes(val.netIndex) && val.netIndex !== minAxio) {
                        val.isNet = false
                        // val.isOpen = false
                      }
                    }
                  })
              })
              this.newArr = [] // 拼接成功，将选中数组清空
            } else {
              this.warningMethod('不符合拼接要求')
            }
          } else {
            this.warningMethod('请选择所需拼接的电视墙')
          }
        }
      } else {
        this.warningMethod('该电视墙没有底板，无法拼接')
      }
    },
    // 发送拼接请求
    sendWindowTogether() {
      this.mergewndTvWall(this.windowmergewnd)
        .then(res => {
          if (res.data.code === 0) {
            this.mergeWindowState = false // 拼接成功，将值置为false
            this.newArr = [] // 拼接成功，清空选择数据
            this.windowmergewnd.beforewnd = [] // 拼接成功，清空所要拼接的坐标
            this.succefullMethod('拼接成功')
            // 拼接成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj) // 发送拼接成功信号，重新拉去menu列表
          } else {
            this.failureMethod('请求失败')
            // 拼接失败后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表(恢复到当前界面)
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 拆分
    async BreakUp() {
      let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
      let relationArr
      let windowCodeArr = [] // 权限中的窗格号
      if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
        relationArr = relationData.data.data
        relationArr.map(item => {
          if (item.mac === this.macAderss) {
            windowCodeArr.push(item.code)
          }
        })
      }
      if (this.macAderss !== '' && windowCodeArr.length !== 0) {
        // 拥有部分屏幕权限
        let objFalg = JSON.stringify(this.changeWindowData)
        if (objFalg !== '{}') {
          if (windowCodeArr.includes(this.changeWindowData.windowIndex)) {
            if (this.changeWindowData.isOpen && this.changeWindowData.isJoin) {
              this.sendWindowSplit() // 发送拆分请求
            } else {
              if (!this.changeWindowData.isOpen) {
                this.warningMethod('未开窗，无法拆分')
              }
            }
          } else {
            this.failureMethod('不在权限之内')
          }
        } else {
          this.warningMethod('请选择要拆分的窗格')
        }
      } else {
        // 拥有全部屏幕的权限
        let objFalg = JSON.stringify(this.changeWindowData)
        if (objFalg !== '{}') {
          if (this.changeWindowData.isOpen && this.changeWindowData.isJoin) {
            this.sendWindowSplit() // 发送拆分请求
          } else {
            if (!this.changeWindowData.isOpen) {
              this.warningMethod('未开窗，无法拆分')
            }
          }
        } else {
          this.warningMethod('请选择要拆分的窗格')
        }
      }
    },
    // 发送拆分请求
    sendWindowSplit() {
      this.windowSplit.wallId = this.tvWallMessage.id
      this.windowSplit.splitwnd = this.changeWindowData.jointCoordinates[0]
      this.windowSplit.splitwnd['code'] = this.changeWindowData.windowIndex
      this.splitwndTvWall(this.windowSplit)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('拆分成功')
            // 拆分成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj) // 发送拆分成功信号，重新拉去menu列表
            this.changePage = '' // 拆分完成后，去掉选中状态
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 窗口分割
    async windowDivision(data) {
      let relationData = await this.getpartManageRelation() // 获取分区管理的窗口权限配置
      let relationArr
      let windowCodeArr = [] // 权限中的窗格号
      if (relationData.data.code === 0 && relationData.data.data.length !== 0) {
        relationArr = relationData.data.data
        relationArr.map(item => {
          if (item.mac === this.macAderss) {
            windowCodeArr.push(item.code)
          }
        })
      }
      if (this.macAderss !== '' && windowCodeArr.length !== 0) {
        // 拥有部分屏幕权限
        if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
          if (this.changeWindowData.isOpen && !this.changeWindowData.alarmIconShowOrclose) {
            if (windowCodeArr.includes(this.changeWindowData.windowIndex)) {
              this.divisionTv(data) // 调用分割函数
            } else {
              this.failureMethod('不在权限之内')
            }
          } else {
            if (!this.changeWindowData.isOpen) {
              this.warningMethod('未开窗，无法分割')
            } else if (this.changeWindowData.alarmIconShowOrclose) {
              this.warningMethod('报警屏幕，无法分割')
            }
          }
        } else {
          this.warningMethod('该电视墙没有底板，无法分割')
        }
      } else {
        // 拥有全部屏幕的权限
        if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
          if (this.changeWindowData.isOpen && !this.changeWindowData.alarmIconShowOrclose) {
            console.log(this.netTable)
            console.log(this.changeWindowData.isDivision)
            this.divisionTv(data) // 调用分割函数
          } else {
            if (!this.changeWindowData.isOpen) {
              this.warningMethod('未开窗，无法分割')
            } else if (this.changeWindowData.alarmIconShowOrclose) {
              this.warningMethod('报警屏幕，无法分割')
            }
          }
        } else {
          this.warningMethod('该电视墙没有底板，无法分割')
        }
      }
    },
    /**
     * 窗口分割发送请求
     *  解码器(M3) type === 1
     * 拼控解码一体  type === 2
     * 解码器+拼控  type === 4
     * */
    divisionTv(val) {
      console.log(this.changeWindowData)
      console.log(val)
      // debugger
      let transform_count = {
        one: 1,
        four: 4,
        six: 6,
        nine: 9,
        sixteen: 16
      }
      if (this.changeWindowData.type === 1) {
        // M3
        let params = {
          wallId: this.changeWindowData.wallId,
          windowsRect: {
            paneCount: transform_count[val],
            monitor: this.changeWindowData.windowIndex,
            channel: this.changeWindowData.associatedChannel
          }
        }
        this.m3divisionApi(params)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('分割成功')
              // 分割成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj) // 发送分割成功信号，重新拉去menu列表
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.changeWindowData.type === 2) {
        // 解码拼控一体机
        let params = {
          wallId: this.changeWindowData.wallId,
          windowsRect: { wndInfo: { left: '', top: '', bottom: '', right: '' }, paneCount: transform_count[val] }
        }
        this.changeWindowData.windowsRect.map(item => {
          params.windowsRect.wndInfo.left = item.left
          params.windowsRect.wndInfo.top = item.top
          params.windowsRect.wndInfo.bottom = item.bottom
          params.windowsRect.wndInfo.right = item.right
        })
        this.TvWallsetwnd(params)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('分割成功')
              // 分割成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj) // 发送分割成功信号，重新拉去menu列表
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.changeWindowData.type === 4) {
        let params = {
          wallId: this.changeWindowData.wallId,
          windowsRect: {
            wndInfo: { left: '', top: '', bottom: '', right: '', code: '' },
            paneCount: transform_count[val]
          }
        }
        this.changeWindowData.windowsRect.map(item => {
          params.windowsRect.wndInfo.left = item.left
          params.windowsRect.wndInfo.top = item.top
          params.windowsRect.wndInfo.bottom = item.bottom
          params.windowsRect.wndInfo.right = item.right
          params.windowsRect.wndInfo.code = item.code
        })
        this.m3AndB20divisionApi(params)
          .then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('分割成功')
              // 分割成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
              let sendObj = {
                state: true,
                id: this.tvWallMessage.id
              }
              this.SET_CREATED_FLOOR(sendObj) // 发送分割成功信号，重新拉去menu列表
            } else {
              this.failureMethod('请求失败')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 显示/隐藏编号
    showNumber(val) {
      if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
        if (this.tvWallMessage.type === 1) {
          // M3显示编号
          if (val === '显示编号') {
            let params = {
              wallId: this.tvWallMessage.id,
              wndCmd: 2
            }
            this.sendShowOrcloseNumberM3(params)
          } else if (val === '隐藏编号') {
            let params2 = {
              wallId: this.tvWallMessage.id,
              wndCmd: 0
            }
            this.sendShowOrcloseNumberM3(params2)
          }
        } else if (this.tvWallMessage.type === 2 || this.tvWallMessage.type === 4) {
          // 拼控解码一体机显示编号
          if (val === '显示编号') {
            let params = {
              wallId: this.tvWallMessage.id,
              wndCmd: 2
            }
            this.sendShowOrcloseNumber(params)
          } else if (val === '隐藏编号') {
            let params2 = {
              wallId: this.tvWallMessage.id,
              wndCmd: 0
            }
            this.sendShowOrcloseNumber(params2)
          }
        }
      } else {
        this.warningMethod('该电视墙没有底板，无法显示编号')
      }
    },
    // 发送显示/隐藏编号请求(b20)
    sendShowOrcloseNumber(val) {
      this.showOrcloseNumber(val)
        .then(res => {
          if (res.data.code === 0) {
            if (val.wndCmd === 2) {
              this.succefullMethod('编号显示成功')
            } else if (val.wndCmd === 0) {
              this.succefullMethod('编号隐藏成功')
            }
            // 显示/隐藏编号成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 发送显示/隐藏编号请求(M3)
    sendShowOrcloseNumberM3(val) {
      this.showOrcloseNumberM3Api(val)
        .then(res => {
          if (res.data.code === 0) {
            if (val.wndCmd === 2) {
              this.succefullMethod('编号显示成功')
            } else if (val.wndCmd === 0) {
              this.succefullMethod('编号隐藏成功')
            }
            // 显示/隐藏编号成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设置为报警屏幕
    setalarm() {
      if (this.tvWallMessage.rtlayout.row && this.tvWallMessage.rtlayout.column) {
        let objFalg = JSON.stringify(this.changeWindowData)
        if (objFalg !== '{}') {
          if (this.changeWindowData.isOpen) {
            if (this.changeWindowData.alarmIconShowOrclose) {
              this.delectMethod('是否取消设置报警屏幕?', 2)
            } else {
              this.delectMethod('确定设置为报警屏幕?', 3)
            }
          } else {
            this.warningMethod('未开窗，无法设置为报警屏幕')
          }
        } else {
          this.failureMethod('请选择要设为报警屏幕的窗口')
        }
      } else {
        this.warningMethod('该电视墙没有底板，无法设置为报警屏幕')
      }
    },
    // 发送设置/取消报警屏幕请求
    sendSetalarm(val) {
      this.SetAlarmApi(this.setalarmParams)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 0) {
              this.succefullMethod('报警屏幕取消成功')
            } else {
              this.succefullMethod('报警屏幕设置成功')
            }
            // 报警屏幕设置/取消成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallMessage.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 点击选中(要当前窗口坐标:窗口的拼接check的选中)
    sendWindowIndex(val, checkedState, td) {
      // ---- this.newArr 拼接坐标--------
      if (this.newArr.length === 0) {
        this.newArr.push(val)
      } else {
        let b = this.newArr.indexOf(val)
        if (b === -1) {
          this.newArr.push(val)
        } else {
          this.newArr.splice(b, 1)
        }
      }
      // ----- this.windowmergewnd.beforewnd拼接参数赋值 --------
      // ---- mergeWindowState用于拼接(判定是否是第二次或更多次的拼接)---
      if (td.isJoin && td.checked) {
        // 用来判断是否是拼接的窗口再拼接
        this.mergeWindowState = true
      } else if (td.isJoin && !td.checked) {
        this.mergeWindowState = false
      }
      this.windowmergewnd.wallId = this.tvWallMessage.id
      if (this.windowmergewnd.beforewnd.length === 0) {
        if (td.isJoin === false) {
          td.windowsRect[0]['netIndex'] = td.netIndex
          this.windowmergewnd.beforewnd.push(td.windowsRect[0])
        } else if (td.isJoin === true) {
          // 已拼接的窗口，要选择拼接完成的坐标
          td.jointCoordinates[0]['netIndex'] = td.netIndex
          td.jointCoordinates[0]['code'] = td.windowIndex
          this.windowmergewnd.beforewnd.push(td.jointCoordinates[0])
        }
      } else {
        let index = this.windowmergewnd.beforewnd.findIndex(vl => {
          return td.windowIndex === vl.code
        })
        if (index === -1) {
          if (td.isJoin === false) {
            td.windowsRect[0]['netIndex'] = td.netIndex
            this.windowmergewnd.beforewnd.push(td.windowsRect[0])
          } else if (td.isJoin === true) {
            td.jointCoordinates[0]['netIndex'] = td.netIndex
            td.jointCoordinates[0]['code'] = td.windowIndex
            this.windowmergewnd.beforewnd.push(td.jointCoordinates[0])
          }
        } else {
          this.windowmergewnd.beforewnd.splice(index, 1)
        }
      }
      let sortcode = (a, b) => {
        // 排序
        return a.code - b.code
      }
      this.windowmergewnd.beforewnd.sort(sortcode) // 排序
      // --- limitsArr参数用于判定拼接时是否在分区权限之内 ----
      if (this.limitsArr.length === 0) {
        this.limitsArr.push(td.windowIndex) // 用于拼接判定分区权限
      } else {
        let e = this.limitsArr.indexOf(td.windowIndex)
        if (e === -1) {
          this.limitsArr.push(td.windowIndex)
        } else {
          this.limitsArr.splice(e, 1)
        }
      }
    },
    // 选中的几分割
    selectedShowscreen() {
      return this.state.showscreen
    },
    // 窗口分割相关函数
    setShowscreen(num, isMouse = false) {
      switch (num) {
        case 1:
          this.windowDivision('one')
          break
        case 4:
          this.windowDivision('four')
          break
        case 6:
          this.windowDivision('six')
          break
        case 9:
          this.windowDivision('nine')
          break
        case 16:
          this.windowDivision('sixteen')
          break
        default:
      }
    },
    // 双击播放视频
    showPreviewHandler(val, vl) {
      if (val) {
        console.log('实时预览画面 -------')
        this.showPreviewModal = true
      } else if (vl) {
        this.failureMethod('本地终端输入，不能播放')
      } else {
        this.failureMethod('资源未上墙，不能播放')
      }
    },
    // 关闭视频播放
    closeModal() {
      this.showPreviewModal = false
    },
    // 云台控制
    yuntaiMethod() {
      let objFalg = JSON.stringify(this.changeWindowData)
      let objFalg1 = JSON.stringify(this.changeWindowData_child)
      if (objFalg !== '{}' || objFalg1 !== '{}') {
        if (this.changeWindowData.isDivision === false) {
          if (this.changeWindowData.yuntaiFlag) {
            this.changeWindowData.yuntaiFlag = false
          } else {
            this.singleStatus.source.devIp = this.videoData.ip
            this.singleStatus.source.devCport = Number(this.videoData.cport)
            this.changeWindowData.yuntaiFlag = true
          }
        } else {
          if (this.changeWindowData_child.division_yuntaiFlag) {
            this.changeWindowData_child.division_yuntaiFlag = false
          } else {
            this.singleStatus.source.devIp = this.videoData.ip
            this.singleStatus.source.devCport = Number(this.videoData.cport)
            this.changeWindowData_child.division_yuntaiFlag = true
          }
        }
      } else {
        this.failureMethod('请选择要云台控制的窗口')
      }
    },
    // 打开音频
    openaudio() {
      let objFalg = JSON.stringify(this.changeWindowData)
      let objFalg1 = JSON.stringify(this.changeWindowData_child)
      if (objFalg !== '{}' || objFalg1 !== '{}') {
        if (
          (!this.changeWindowData.isDivision && this.changeWindowData.isToWall) ||
          (this.changeWindowData.isDivision && this.changeWindowData_child.division_isToWall)
        ) {
          let params = {
            wallId: this.tvWallMessage.id,
            devCtl: {
              cmd: 1, // 0关闭 1打开
              windowsRect: {
                paneCount: 1,
                left: this.changeWindowData.windowsRect[0].left,
                top: this.changeWindowData.windowsRect[0].top,
                bottom: this.changeWindowData.windowsRect[0].bottom,
                right: this.changeWindowData.windowsRect[0].right
              }
            }
          }
          if (!this.changeWindowData.isDivision) {
            // 未分割
            if (!this.changeWindowData.openaudio) {
              // 未打开音频
              this.sendopenaudio(params)
            } else {
              // 未分割，已打开音频
              params.devCtl.cmd = 0
              this.sendopenaudio(params)
            }
          } else {
            // 已分割
            params.devCtl.windowsRect.paneCount = this.changeWindowData_child.windowIndex
            if (!this.changeWindowData.openaudio) {
              // 未打开音频
              this.sendopenaudio(params)
            } else {
              // 未分割，已打开音频
              params.devCtl.cmd = 0
              this.sendopenaudio(params)
            }
          }
        } else {
          this.failureMethod('未上流,不可打开音频')
        }
      } else {
        this.failureMethod('请选择要打开音频的窗口')
      }
    },
    // 发送打开音频请求
    sendopenaudio(val) {
      this.openaudioApi(val)
        .then(res => {
          if (res.data.code === 0) {
            if (val.devCtl.cmd === 0) {
              this.succefullMethod('音频关闭成功')
              if (!this.changeWindowData.isDivision) {
                this.changeWindowData.openaudio = false
              } else {
                this.changeWindowData_child.division_openaudio = false
              }
            } else if (val.devCtl.cmd === 1) {
              this.succefullMethod('音频打开成功')
              if (!this.changeWindowData.isDivision) {
                this.changeWindowData.openaudio = true
              } else {
                this.changeWindowData_child.division_openaudio = true
              }
            }
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 警告提示
    warningMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        type: 'warning',
        duration: 2500
      })
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    },
    // 去重方法
    unique(arr) {
      return Array.from(new Set(arr))
    },
    // 获取分区管理的窗口权限配置
    getpartManageRelation(val) {
      let params = {
        wallId: this.tvWallMessage.id
      }
      return this.getPartmanagerelationMethod(params)
    },
    // 接受socket
    connectTvWall() {
      // 接收socket
      const websocket = getTvWallWebSocket()
      websocket.onmessage = msgEvent => {
        const data = JSON.parse(msgEvent.data)
        if (data.messageType === 'LOOP') {
          let params = {
            devIp: data.devIp,
            pollingName: data.result.loopName,
            paneCount: data.result.windowsRect.paneCount,
            bottom: data.result.windowsRect.bottom,
            left: data.result.windowsRect.left,
            right: data.result.windowsRect.right,
            top: data.result.windowsRect.top
          }
          this.TvWallWindowStatusApi(params)
            .then(res => {
              if (res.data.code === 0) {
                // soket返回值成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
                let sendObj = {
                  state: true,
                  id: this.tvWallMessage.id
                }
                this.SET_CREATED_FLOOR(sendObj)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('未知websocket消息:', data)
        }
      }
    },
    /**
     * 处理数据格式的三套方法
     * 1.解码器: type = 1 nomal_function
     * 2.解码拼控一体机: type = 2 nomal2_function
     * 3.解码器+拼控: type = 3  nomal3_function
     * */
    nomal_function(emit_data) {
      if (emit_data) {
        for (let i = 0; i < this.netTable.length; i++) {
          let item = this.netTable[i].children
          for (let j = 0; j < item.length; j++) {
            let val = item[j]
            emit_data.map(item => {
              if (item.monitor === val.windowIndex) {
                val.isOpen = true // 开窗
                val.associatedChannel = item.channel // 通道绑定(通道号)
                val.associatedChannelName = item.name // 通道绑定(通道名称)
                console.log(val)
                console.log(item)
                if (item.wndType && item.wndType === 1) {
                  // 报警屏
                  val.alarmIconShowOrclose = true
                }
                if (item.status) {
                  // 显示编号
                  val.showNumber = item.status
                  this.showNumber1 = true
                } else {
                  this.showNumber1 = false
                }
                if (val.isOpen && item.paneCount > 1) {
                  // 分割
                  let count_obj = {
                    1: 'one',
                    4: 'four',
                    6: 'six',
                    9: 'nine',
                    16: 'sixteen'
                  }
                  val.isDivisionConunt = count_obj[item.paneCount]
                  val.isDivision = true
                  console.log(val)
                  console.log(val.isTableArr[val.isDivisionConunt])
                  for (let b = 0; b < val.isTableArr[val.isDivisionConunt].length; b++) {
                    let val_item = val.isTableArr[val.isDivisionConunt][b].children
                    for (let c = 0; c < val_item.length; c++) {
                      let val_item1 = val_item[c]
                      console.log(val_item1)
                      console.log(item.rids)
                      item.rids.map(it => {
                        if (it.rid && it.code === val_item1.windowIndex) {
                          val_item1.division_isToWall = true //  分割窗口上墙
                          if (item.name) {
                            val_item1.divosion_resourcesName = item.name
                          }
                        } else if (it.pollingName && it.code === val_item1.windowIndex) {
                          val_item1.division_isToWall = true //  分割窗口上墙
                          val_item1.division_pollingName = it.pollingName
                        }
                      })
                    }
                  }
                }
                if (val.isOpen && item.rids && item.rids.length !== 0) {
                  // 未分割资源上墙
                  item.rids.map(item1 => {
                    if (item1.rid) {
                      val.isToWall = true //  上墙
                      if (item.name) {
                        val.resourcesName = item.name
                      }
                    } else if (item1.pollingName) {
                      val.isToWall = true //  上墙
                      val.pollingName = item1.pollingName
                    }
                  })
                }
              }
            })
          }
        }
        this.SET_TVWALL_CHANGE_DATA(JSON.parse(JSON.stringify(this.netTable)))
      }
    },
    nomal2_function(emit_data) {
      if (emit_data) {
        for (let i = 0; i < this.netTable.length; i++) {
          let item = this.netTable[i].children
          for (let j = 0; j < item.length; j++) {
            let val = item[j]
            emit_data.map(item => {
              if (item.code === val.windowIndex) {
                console.log(item)
                console.log(val)
                // debugger
                // 开窗
                val.isOpen = true
                if (item.wndType && item.wndType === 1) {
                  // 报警屏
                  val.alarmIconShowOrclose = true
                }
                if (item.status) {
                  // 显示编号
                  val.showNumber = item.status
                  this.showNumber1 = true
                } else {
                  this.showNumber1 = false
                }
              }
              if (val.isOpen && item.paneCount > 1 && item.code === val.windowIndex) {
                // 状态：开窗窗口的分割
                // 分割
                let count_obj = {
                  1: 'one',
                  4: 'four',
                  6: 'six',
                  9: 'nine',
                  16: 'sixteen'
                }
                val.isDivisionConunt = count_obj[item.paneCount]
                val.isDivision = true
                console.log(val)
                console.log(val.isTableArr[val.isDivisionConunt])
                for (let b = 0; b < val.isTableArr[val.isDivisionConunt].length; b++) {
                  let val_item = val.isTableArr[val.isDivisionConunt][b].children
                  for (let c = 0; c < val_item.length; c++) {
                    let val_item1 = val_item[c]
                    console.log(val_item1)
                    console.log(item.rids)
                    item.rids.map(it => {
                      if (it.rid && it.code === val_item1.windowIndex) {
                        val_item1.division_isToWall = true //  分割窗口上墙
                        if (it.name) {
                          val_item1.divosion_resourcesName = it.name
                        }
                      } else if (it.timId && it.code === val_item1.windowIndex) {
                        val_item1.division_isTowallLocal = true //  分割窗口本地终端输入上墙
                        if (it.name) {
                          val_item1.divosion_resourcesName = it.name
                        }
                      } else if (it.pollingName && it.code === val_item1.windowIndex) {
                        // 分割窗口轮巡上墙
                        val_item1.division_isToWall = true //  分割窗口上墙
                        val_item1.division_pollingName = it.pollingName
                      }
                    })
                  }
                }
              }
              if (val.isOpen && item.rids && item.rids.length !== 0) {
                // 初始化窗口的上墙
                item.rids.map(item1 => {
                  if (item.code === val.windowIndex) {
                    if (item1.rid) {
                      val.isToWall = true
                      val.resourcesName = item1.name
                    } else if (item1.timId) {
                      // 初始化窗口本地终端输入的上墙
                      val.isTowallLocal = true
                      val.resourcesName = item1.name
                    } else if (item1.pollingName) {
                      // 初始化窗口轮巡上墙
                      val.isToWall = true
                      val.pollingName = item1.pollingName
                    }
                  }
                })
              }
              if (item.originwnd) {
                // 页面初始化，将拼接好的复原
                if (item.code === val.windowIndex) {
                  // 拼接
                  val.isJoin = true
                  item.originwnd.map(item_pj => {
                    this.newArr.push(item_pj.netIndex)
                  })
                  this.JoiningTogether(2)
                }
              }
            })
          }
        }
      }
    },
    nomal3_function(emit_data) {
      if (emit_data) {
        for (let i = 0; i < this.netTable.length; i++) {
          let item = this.netTable[i].children
          for (let j = 0; j < item.length; j++) {
            let val = item[j]
            emit_data.map(item => {
              if (item.code === val.windowIndex) {
                val.isOpen = true // 开窗
                val.associatedChannel = item.channel // 通道绑定(通道号)
                val.associatedChannelName = item.name // 通道绑定(通道名称)
                console.log(val)
                console.log(item)
                if (item.wndType && item.wndType === 1) {
                  // 报警屏
                  val.alarmIconShowOrclose = true
                }
                if (item.status) {
                  // 显示编号
                  val.showNumber = item.status
                  this.showNumber1 = true
                } else {
                  this.showNumber1 = false
                }
                if (val.isOpen && item.paneCount > 1) {
                  // 分割
                  let count_obj = {
                    1: 'one',
                    4: 'four',
                    6: 'six',
                    9: 'nine',
                    16: 'sixteen'
                  }
                  val.isDivisionConunt = count_obj[item.paneCount]
                  val.isDivision = true
                  console.log(val)
                  console.log(val.isTableArr[val.isDivisionConunt])
                  for (let b = 0; b < val.isTableArr[val.isDivisionConunt].length; b++) {
                    let val_item = val.isTableArr[val.isDivisionConunt][b].children
                    for (let c = 0; c < val_item.length; c++) {
                      let val_item1 = val_item[c]
                      console.log(val_item1)
                      console.log(item.rids)
                      item.rids.map(it => {
                        if (it.rid && it.code === val_item1.windowIndex) {
                          val_item1.division_isToWall = true //  分割窗口上墙
                          if (item.name) {
                            val_item1.divosion_resourcesName = item.name
                          }
                        } else if (it.pollingName && it.code === val_item1.windowIndex) {
                          val_item1.division_isToWall = true //  分割窗口上墙
                          val_item1.division_pollingName = it.pollingName
                        }
                      })
                    }
                  }
                }
                if (val.isOpen && item.rids && item.rids.length !== 0) {
                  // 未分割资源上墙
                  item.rids.map(item1 => {
                    if (item1.rid) {
                      val.isToWall = true //  上墙
                      if (item.name) {
                        val.resourcesName = item.name
                      }
                    } else if (item1.pollingName) {
                      val.isToWall = true //  上墙
                      val.pollingName = item1.pollingName
                    }
                  })
                }
              }
            })
          }
        }
        this.SET_TVWALL_CHANGE_DATA(JSON.parse(JSON.stringify(this.netTable)))
      }
    }
  },
  created() {
    this.connectTvWall() // 获取socket
  },
  mounted() {
    // 获取本机mac地址
    let macAndipData = JSON.parse(sessionStorage.getItem('macAddress'))
    if (macAndipData) {
      this.macAderss = macAndipData.adaptors[0].mac
    }
    if (JSON.stringify(this.tvWallMessage) !== '{}') {
      this.createdMethod()
      this.InitializeMethod()
    }
  }
}
</script>
<style lang="less" scoped>
table,
tr,
td {
  border: 1px solid #ddd;
  border-collapse: collapse;
  overflow: hidden;
}

table {
  width: 100%;
  height: 100%;
  table-layout: fixed;

  tr {
    /*width: 100%;*/
    td {
      position: relative;
      overflow: hidden;
      border-collapse: collapse;
      .windowTop {
        width: 100%;
        line-height: 30px;
        padding: 0 12px;
        height: 30px;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
      .windowTopLeft {
        display: flex;
      }
      .checkWrap {
        margin-left: 10px;
      }
      .checkWrap /deep/ .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
      .windowTopRight {
        font-size: 14px;
      }
    }
  }
}
.alarmWrap {
  flex: 1;
}
.active_tv {
  background: black !important;
}
// 云台
.titMessSecond /deep/.ptz-box {
  height: 100%;
}
</style>
<style scoped lang="less">
.Setactive-tab {
  color: #fff;
  background: #1b3153;
}
.tvWallSetWrap {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.setWrapTop {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  // height: 42px;
  align-items: baseline;
}
.ulStyle {
  display: flex;
}
.liStyle {
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  width: 100px;
  position: relative;
  border: 1px solid gainsboro;
  margin: 0 5px 0 0;
  line-height: 30px;
  height: 30px;
  border-radius: 5%;
}
.liStyle:hover {
  color: #4699f9;
}
.setWrapContend {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.titMess {
  justify-content: center;
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid #ebeef5;
}
.titMessSecond {
  flex: 1;
}
.titMess p {
  letter-spacing: 1px;
  font-size: 14px;
  color: grey;
}
.setWrapContend /deep/.el-dialog__header {
  background-color: rgba(242, 242, 242, 1);
}
.setWrapContend /deep/.el-dialog__title {
  font-size: 13px;
}
.setWrapContend /deep/ .el-dialog {
  min-width: 280px;
  width: 18% !important;
}
.setWrapContend /deep/.el-dialog__header {
  padding: 6px 13px 6px;
}
.setWrapContend /deep/.el-dialog__headerbtn {
  top: 11px;
}
.setWrapContend /deep/ .el-dialog__body {
  padding: 20px 20px;
}
.setWrapContend /deep/ .el-dialog__footer {
  padding: 0px 20px 14px;
}
.canvansCount li {
  display: flex;
  align-items: center;
}
.count {
  margin-left: 20px;
}
.count /deep/.el-input {
  font-size: 12px;
}
.count /deep/.el-input__inner {
  height: 32px;
}
.resouse {
  display: flex;
}
.tatolNumder {
  display: flex;
  margin-left: 20px;
}
.canvasWrap {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.rowWrap {
  flex: 1;
  width: 100%;
  border-bottom: 1px solid gainsboro;
  display: flex;
}
.columnWrap {
  cursor: pointer;
  background: #f2f2f2;
  flex: 1;
  height: 100%;
  border-left: 1px solid gainsboro;
}
.numberWrap {
  position: absolute;
  top: 4px;
  left: 16px;
  display: flex;
  font-size: 12px;
  color: red;
}
.numberWrap1 {
  position: absolute;
  display: flex;
  background: #fff;
  font-size: 12px;
  color: red;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
}
.numberWrap1 .title {
  padding-left: 10px;
}
.numberWrap1 .const {
  padding-right: 10px;
}
.numberWrap2 {
  position: absolute;
  left: 50%;
  background: #fff;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  z-index: 10;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  font-size: 12px;
  color: red;
}
.numberWrap2 .title {
  padding-left: 10px;
}
.numberWrap2 .const {
  padding-right: 10px;
}
.isactive {
  background: #999999;
  position: relative;
  //  z-index: 10000;
}
.isactive1 {
  border: 2px solid blue;
}
.isactive2 {
  background: darkslategray !important;
}
.windowTop {
  width: 100%;
  line-height: 30px;
  padding: 0 12px;
  height: 30px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background: #fff;
}
.windowTopLeft {
  display: flex;
}
.checkWrap {
  margin-left: 10px;
}
.checkWrap /deep/ .el-checkbox__inner {
  width: 12px;
  height: 12px;
}
.windowTopRight {
  font-size: 14px;
}
.test {
  display: flex;
  padding: 5px;
  justify-content: space-between;
}
.tvWallUseBottom {
  height: 30px;
  margin-top: 10px;
}
.bottomUlstyle {
  display: flex;
}
.bottomListyle {
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  width: 100px;
  border: 1px solid gainsboro;
  // margin: 22px 5px 5px 0;
  line-height: 30px;
  height: 30px;
  border-radius: 5%;
  margin-right: 10px;
}
.dp-con {
  ul {
    width: 348px;
    position: relative;
    height: 40px;
    line-height: 43px;
    background: #2d72d3;
    bottom: 36px;
    left: 100px;
    margin-left: -1px;
    border-radius: 4px;
    margin: 0 !important;
    li {
      color: #fff;
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      position: relative;
      display: inline-block;
      padding: 0 15px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    li:last-child {
      border-right: 0;
    }

    i {
      display: block;
      position: absolute;
      background: #2d72d3;
      width: 14px;
      height: 14px;
      z-index: 0;
      transform: rotate(45deg);
      top: 12px;
      left: -7px;
    }

    .active {
      color: #c47019;
    }
  }
}
.tvWallUsetitle {
  display: flex;
  width: 100%;
  height: 30px;
  background: #999999;
  line-height: 30px;
}
.usetitleWrap {
  display: flex;
}
.marginStyle {
  margin-left: 80px;
}

.alarm_wrap {
  font-size: 18px;
  position: absolute;
  right: 5px;
  top: 5px;
  color: red;
}
</style>
