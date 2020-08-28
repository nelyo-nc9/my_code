<template>
  <!-- 多方对讲 -->
  <div class="manyIntercom">
    <!-- 导航栏 -->
    <div class="leftMenu">
       <!-- :stretch="true" -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="资源" name="first">
          <section class="airlockControl-left">
            <treeBox
              ref="org"
              :lazyTreeApi="getTreeApi"
              searchType="search"
              @onceClick="organizeTreeClickHandle"
              treeLazyToggle
              iconToggle
              :lazyTreeSearchApi="getLazyTreeSearchApi"
            >
            <template  slot-scope="{data, node}">
              <!-- <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconEqu(data)"></i>
              <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconEqu(data)"></i>
              <i class="iconfont icon-polling" title="开启轮巡" v-if="iconList.includes('poll') && filterIconEqu(data)"></i>
              <i class="iconfont icon-collection" title="快速收藏" v-if="iconList.includes('collection') && filterIconRes(data)"></i> -->
              <i class="iconfont icon-biaoqian" title="详细信息" v-if="iconList.includes('info')" @click.stop="previewInfo(data, node)"></i>
            </template>
            </treeBox>
          </section>
        </el-tab-pane>
        <el-tab-pane class="taneOne" label="对讲组 " name="second">
          <div class="group-fliter-contaienr">
            <!-- 分组 搜索框 -->
            <el-input
              class="fliter-inp"
              placeholder=""
              suffix-icon="el-icon-search"
              size="small"
              v-model="group_fliter_text"
              @change="groupFliterChange">
            </el-input>
            <!-- 上移 -->
            <span class="el-icon-top fliter-icon" @click="moveUp"></span>
            <!-- 下移 -->
            <span class="el-icon-bottom fliter-icon" @click="moveDown"></span>
            <!-- 删除分组 -->
            <!-- &#xe638; -->
            <span class="el-icon-delete fliter-icon" @click="deleteGroup"></span>
          </div>
          
          <div class="groupList-container">
            <div :class="{'groupList-item':true,'active':group_activeIndex == index}" v-for="(item,index) in groupList" :key="item.id" >
              <div class="group-title" @click="handleChange(item,''); group_activeIndex=index;">
                <span>{{ item.name }}</span>
                <span v-if="item.show" class="el-icon-arrow-down icon-btn" @click.stop="handleChange(item,'hide'); group_activeIndex=index;"></span>
                <span v-else class="el-icon-arrow-right icon-btn" @click.stop="handleChange(item,'show'); group_activeIndex=index;"></span>
              </div>
              <el-collapse-transition>
              <div class="group-main" v-show="item.show">
                <div class="group-main-item" v-for="(subItem,i) in item.channelInfo" :key="i">{{subItem.name}}</div>
              </div>
              </el-collapse-transition>
            </div>
          </div>


        </el-tab-pane>

        <!-- <el-tab-pane key="addButton">
          <span slot="label" style="padding: 8px">
            +
          </span>
        </el-tab-pane> -->
      </el-tabs>
      <!-- 刷新按钮 -->
      <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
    </div>

    <div class="box">
      <div style="margin: 23px 0 0 25px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <!-- :to="{ path: '/intelligentSecurity/audioManager/Resource' }" -->
          <el-breadcrumb-item>音频管理</el-breadcrumb-item>
          <el-breadcrumb-item>多方对讲</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="divider"></div> -->
      </div>
      <div class="addition">
        <div class="groupChat">

          <!-- 本机 话筒-->
          <div class="box-content" style="margin-left:0px;" v-show="own_equipment.runStatus == 2">
            <div class="max-width text-center"><span :style="{backgroundColor: own_equipment.runStatus == 2?'#2DD3AA':'#FF8E20'}" class="el-icon-microphone microphone-icon"></span></div>
            <p>本机话筒</p>
          </div>

          <!-- 本机 对讲中 -->
          <div class="box-content" style="margin-left:0px;" v-show="own_equipment.runStatus != 2">
            <div class="max-width"><p>本机话筒</p></div>
            <div class="stateLine max-width">
              <span :style="{backgroundColor: own_equipment.runStatus == 2 ? '#2DD3AA' : '#FF8E20' }" class="el-icon-microphone"></span>
              <!-- runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中 -->
              <span v-if="own_equipment.runStatus == 1">离线</span>
              <span v-else-if="own_equipment.runStatus == 2">空闲</span>
              <span v-else-if="own_equipment.runStatus == 3">呼出</span>
              <span v-else-if="own_equipment.runStatus == 4">响铃</span>
              <span v-else-if="own_equipment.runStatus == 5">对讲中</span>
              <span v-else-if="own_equipment.runStatus == 6">广播中</span>
              <!-- <span v-else>未知状态</span> -->
              <timer v-show="own_equipment.runStatus == 5" :time="time" ref="ownTime" style="margin-top:2px;margin-left:10px;"></timer>
            </div>
            <!-- <div class="max-width btn-wrap">
              <el-button class="btn" size="mini">静音</el-button>
              <el-button class="btn" size="mini">取消静音</el-button>
            </div> -->

          </div>
          <!-- 已经添加的 多方对讲 设备 -->
          <div v-for="item in autoList" :key="item.id" class="box-content">
            <div class="box-top max-width">
              <div class="box-text">
                <b v-if="item.tierType =='equ'">台麦:&nbsp;&nbsp;&nbsp;</b>
                <b v-else>面板:&nbsp;&nbsp;&nbsp;</b>
                {{item.name}}
              </div>
              <span id="deleId" class="icon iconfont active1" @click="undock(item)">&#xe638;</span>
            </div>

            <!-- 设备对讲状态 -->
            <div class="stateLine max-width">
              <span :style="{backgroundColor: item.runStatus == 2 ? '#2DD3AA' : '#FF8E20' }"
            class="el-icon-microphone"></span>
              <!-- runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中 -->
              <span v-if="item.runStatus == 1">离线</span>
              <span v-else-if="item.runStatus == 2">空闲</span>
              <span v-else-if="item.runStatus == 3">呼出</span>
              <span v-else-if="item.runStatus == 4">响铃</span>
              <span v-else-if="item.runStatus == 5">对讲中</span>
              <span v-else-if="item.runStatus == 6">广播中</span>
              <span v-else>未知状态</span>

              <span>&#8195;</span>
              <!-- 对讲时间 -->
              <timer :time="time" ref="headerChild" style="margin-top:2px"  v-show="item.runStatus == 5"></timer>
            </div>

            <!-- 操作按钮 -->
            <div class="max-width btn-wrap" v-if="item.runStatus == 2 || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus || !seqId">
              <el-button class="btn" size="mini" @click="undock(item)">移除</el-button>
            </div>
            <div class="max-width btn-wrap  btn-wrap2" v-else>
              <!-- <el-button class="btn" size="mini">停止静音</el-button>
              <el-button class="btn" size="mini">静音其他成员</el-button> -->
              <el-button class="btn" size="mini" @click="undock(item)">挂断</el-button>
            </div>

            <div class="max-width box-buttom">
              <span class="box-font">{{item.orgName || '无数据'}}>{{item.keyPartName ||'无数据'}}>设备</span>
            </div>
          </div>

          <!-- 右侧 提示添加模块 -->
          <div class="box-content">
            <div><span class="el-icon-plus microphone-icon" style="background-color:#2D72D3;margin-right:5px;"></span></div>
            <span class="spanText">添加左侧设备至对讲组</span>
          </div>
        </div>
      </div>
      <!-- 底部操作按钮 -->
      <div class="function-btn">
        <el-row>
          <el-button size="mini" @click="speak()" v-if="own_equipment.runStatus == 2" :disabled="noMac || own_equipment.runStatus == 1 || own_equipment.runStatus == 7">开始对讲</el-button>
          <el-button size="mini" @click="hang" v-else :disabled="noMac || own_equipment.runStatus == 1 || own_equipment.runStatus == 7">关闭对讲</el-button>
          <el-button size="mini" @click="allRemove" :disabled="noMac || own_equipment.runStatus == 1 || own_equipment.runStatus == 7">全部移除</el-button>
          <el-button size="mini" @click="dialogFormVisibleS()">保存分组</el-button>
        </el-row>

        <config
          v-show="flag"
          class="grouping"
          @btn="cbtn"
          :arrlist="autoList"
          @childAddList="viewChildList"
        ></config>

        <div class="audio-tape"></div>

      </div>
    </div>

    <!-- 对讲日志 提交 弹框 -->
    <div class="config-box" v-show="talkback">
      <div class="top">
        <p>多方对讲通话标记</p>
        <button @click="cancel">x</button>
      </div>
      <div style="margin: 20px;"></div>

      <ul>
        <li>
          <b>发起者:&nbsp;</b> {{ globalConfig.callerInfo.platformName }}>{{ globalConfig.callerInfo.hostName }}
        </li>
        <br />

        <li>
          <b>多方对讲参与者:&nbsp;</b>
          {{participantName(autoList)}}
        </li>
        <br />
      </ul>
      <ul>
        <li>
          <b>对讲开始时间:&nbsp;</b><span style="margin-left:15px;">{{ startSpeakTime }}</span>
        </li>
        <br />
        <li>
          <b>对讲时长:</b><span style="margin-left:15px;">{{ call_duration }}</span>
        </li>
        <br />
        <li>
          <b>通话标记:</b>&nbsp;
        </li>
        <br />
      </ul>
      <div class="box">
        <textarea v-model="callTag" name id width="100%" height="100% " resize="none"></textarea>
      </div>
      <div class="bottom">
        <el-button size="mini" style="float:right;margin-right:50px" @click="cancel">取消</el-button>
        <el-button size="mini" style="float:right;margin-right:50px" @click="submit">提交</el-button>
      </div>
    </div>

    <!-- 设备详情 -->
    <el-dialog title="设备详情" :visible.sync="infoFlag.dev" width="400px" :close-on-click-modal="false">
      <!-- <iframe v-if="infoFlag.dev"></iframe> -->
      <div class="info-box">
        <div class="left">
          <span>所属子系统</span>
          <span>所属机构</span>
          <span>所属重点部位</span>
          <span>所属设备</span>
          <span>设备品牌</span>
          <span>设备类型</span>
          <span>设备型号</span>
          <span>设备名称</span>
          <span>通道号</span>
          <span>IP地址</span>
          <span>设备ID</span>
          <span>资产编码</span>
          <span>备注</span>
        </div>
        <div class="right">
          <span>{{devInfo.subSystemName}}</span>
          <span>{{devInfo.orgName}}</span>
          <span>{{devInfo.keyPartName}}</span>
          <span>---</span>
          <span>{{devInfo.brand}}</span>
          <span>{{devInfo.type}}</span>
          <span>{{devInfo.modelNum}}</span>
          <span>{{devInfo.name}}</span>
          <span>---</span>
          <span>{{devInfo.ip}} <i @click="pingFunc(devInfo.ip)">ping</i> </span>
          <span>{{devInfo.id}}</span>
          <span>{{devInfo.assetCode}}</span>
          <span>{{devInfo.remark}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 资源详情 -->
    <el-dialog title="资源详情" :visible.sync="infoFlag.res" width="400px" :close-on-click-modal="false">
      <!-- <iframe v-if="infoFlag.res"></iframe> -->
      <div class="info-box">
        <div class="left">
          <span>所属子系统</span>
          <span>所属机构</span>
          <span>所属重点部位</span>
          <span>所属设备</span>
          <span>设备品牌</span>
          <span>设备类型</span>
          <span>设备型号</span>
          <span>资源名称</span>
          <span>通道号</span>
          <span>IP地址</span>
          <span>设备ID</span>
          <span>资产编码</span>
          <span>备注</span>
        </div>
        <div class="right">
          <span>{{resInfo.subSystemName}}</span>
          <span>{{resInfo.orgName}}</span>
          <span>{{resInfo.keyPartName}}</span>
          <span>{{resInfo.deviceName}}</span>
          <span>{{resInfo.brand}}</span>
          <span>{{resInfo.type}}</span>
          <span>{{resInfo.modelNum}}</span>
          <span>{{resInfo.name}}</span>
          <span>{{resInfo.serise}}</span>
          <span>{{resInfo.ip}} <i @click="pingFunc(resInfo.ip)">ping</i> </span>
          <span>{{resInfo.deviceId}}</span>
          <span>{{resInfo.assetCode}}</span>
          <span>{{resInfo.remark}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 重点部位详情 -->
    <el-dialog title="重点部位详情" :visible.sync="infoFlag.loc" width="600px" :close-on-click-modal="false">
      <!-- <iframe v-if="infoFlag.loc"></iframe> -->
      <div class="info-box">
        <div class="info-item" v-for="(item,index) in locLabels" :key="item.props + '_' + index">
          <div class="info-key">{{item.label}}</div>
          <div class="info-value">{{locInfo[item.prop] || '---'}}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 机构详情 -->
    <el-dialog title="机构详情" :visible.sync="infoFlag.org" width="600px" :close-on-click-modal="false">
      <!-- <iframe v-if="infoFlag.org"></iframe> -->
      <div class="info-box">
        <div class="info-item" v-for="(item,index) in orgLables" :key="item.props + '_' + index">
          <div class="info-key">{{item.label}}</div>
          <div class="info-value">{{orgInfo[item.prop] || '---'}}</div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import {
  getTreeApi,
  getGroupingApi,
  postAddMemberApi,
  postMacGetApi,
  getStatue,
  getAccessAudionlStatusApi,
} from '../../../http/audio/manyIntercom'
import { removeAudiougrouplistApi } from '../../../http/audio/audiogb'
import { postCloseTalkbackApi,getRuntimeStatue } from '../../../http/audio/resource'
import { getResourceInfoApi, getDeviceInfoApi, getLocOrOrgInfoApi,getStatueNew } from '@src/http/video/videoConfig.api.js'
import { fuzzySearchTreeApi } from '@src/http/audioManage/audioTree.api.js'

import treeBox from '@src/components/tree/treeBox'
// import dialogbox from './dialogBox'
import config from './config'
import timer from './theTimer'
export default {
  props: {},
  name: 'preview',
  components: {
    // dialogbox,
    treeBox,
    config,
    timer,
  },
  data() {
    return {
      noMac:false,  // 本机是否绑定了  台麦设备   true是 false否
      own_equipment:{},  // 本机mac 地址 绑定的 设备信息

      globalConfig:{},  // 关于本机（发起对讲者的数据）
      //菜单栏数据
      activeNameze: '',
      //通话标记
      callTag: '',
      deleteIds: '',
      menu: '',
      seqId: '', //挂断判断
      han: false,
      // 关闭对讲判断
      talkback: false,
      //移除
      rem: true,  // 是否空闲 true空闲 false 对讲中

      //挂断返回的值
      returned: '',

      flag: true,
      fal: true,

      startSpeakTime:'',  // 开始对讲时间
      endSpeakTime:'',  // 结束对讲时间
      call_duration:'',  //通话时长

      time: 0,  //时间
      // 时间显示隐藏
      tim: false,
      tabListItem: [],
      text: '本机话筒',
      treeType: 0,
      rootId: '',
      currentCheckedTreeNode: '',
      activeName: 'first',

      arrlist: [],
      autoList: [], // 添加的多方对讲设备 列表数据
      dialogTableVisible: false,
      dialogFormVisible: false,
      flag: false,

      // 对讲组
      activeNames: ['1'],
      groupList: [], //广播组名称
      group_activeIndex:-1,  // 默认选中组成员
      group_fliter_text:'',  // 分组 搜索字段

      panelArr: [],

      // 机构资源树 详情功能
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      infoFlag: {
        dev: false,
        res: false,
        loc: false,
        org: false
      },
      resInfo: {},
      devInfo: {},
      locInfo: {},
      locLabels: [],
      orgInfo: {},
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
        { prop: 'parentSerial', label: '上级机构编号' }
      ],

      upStatusTimer:null,  // 设置一个定时器 来定时更新 设备的运行状态(组件销毁时 定时器 需要销毁)

    }
  },
  
  watch: {
    rootId(val) {
      console.log('监听 ------------ 获取到了根节点', val)
    },

  },
  methods: {
    // 查询对讲状态 state 为true 查询台麦信息
    getAudionStatue(data, state) {
      console.log(data)
      var callerData = JSON.stringify(this.globalConfig.calledInfo)
      var req = {
        serverPort: data.platformPort,
        serverIp: data.platformIp,
        callerPanel: state ? 0 : parseInt(data.uniqueId), // 台麦 0
        callerId: state ? data.uniqueId : data.hostUniq,
      }
      //1：离线2：空闲3：呼出4：响铃5：对讲中6广播中
      return getStatue(req)
    },

    // 根据mac获取信息
    macGet() {
      var _this = this
      var macAddress = sessionStorage.getItem('macAddress')

      if (!macAddress) {
        alert('mike信息读取失败，请使用360极速浏览器')
        return
      }
      let macs = JSON.parse(macAddress).adaptors
      var macStr = []
      macs.forEach((item) => {
        macStr.push(item.mac)
      })
      console.log('macs', macs, macStr)

      postMacGetApi({
        mac: macStr.join(','),
      })
        .then((res) => {
          if (res.status == 201 && JSON.stringify(res.data.data) != "{}") {
            this.globalConfig.serverIp = res.data.data.platformIp
            this.globalConfig.serverPort = res.data.data.platformPort
            this.globalConfig.serverId = res.data.data.platformUniqueId
            this.globalConfig.hostName = res.data.data.hostName
            this.globalConfig.orgId = res.data.data.orgId
            this.globalConfig.keyId = res.data.data.id
            
            this.globalConfig.callerInfo = {
              organization:res.data.data.orgName,  //所属机构名称
              keyPartName:res.data.data.keyPartName,  //所属部位名称
              // deviceName:res.data.data.deviceName,  //所属设备名称(对于主机，无所属设备)
              hostName:res.data.data.hostName,  // 主机名称
              platformName:res.data.data.platformName,  //所属平台名称
              hostRunStatus:res.data.data.hostRunStatus,  // 主机 运行状态  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
              id: res.data.data.hostUniqueId,
              ownId:res.data.data.id,
              ip: res.data.data.hostIp,
              port: res.data.data.hostPort,
            }

            // 本机绑定的话筒设备（用于更新 本机设备的运行状态）
            var ower_obj = {
              name : res.data.data.hostName,
              status : res.data.data.hostSatus,
              runStatus : res.data.data.hostRunStatus,
              serverIp : res.data.data.platformIp,
              serverPort : res.data.data.platformPort,
              hostUniqueId : res.data.data.hostUniqueId,
              id:res.data.data.id,
            };
            this.own_equipment = ower_obj;

            console.log('globalConfig', this.globalConfig, res.data.data)
            console.log(res.data.data)
          } else {
            this.$alert('您的终端未绑定台麦', '提示', {
              confirmButtonText: '确定',
              type:"warning"
            });
            this.noMac=true;
          }
        })
        .catch((err) => {
          // debugger
          this.$messageError(err)
        })
    },

    // 开启对讲追加接口
    addpanel(data) {
      if (!data.uniqueId) {
        alert('添加失败,uniqueId 为null')
        return
      }
      var _this = this
      var isStatus = false
      var req = {
        //10.1.1.111  2046   003
        seqId: this.seqId,
        serverIp: this.globalConfig.serverIp,
        serverPort: this.globalConfig.serverPort,

        // mikeInfo:""
      }
      if (data.tierType == 'equ') {
        //台麦
        isStatus = true
        req.mikeInfo = JSON.stringify([
          {
            id: data.uniqueId, //        //对讲设备id
            ip: data.ip, //对讲设备ip
            port: data.port,
          },
        ])
      } else {
        //面板
        req.boardInfo = JSON.stringify([
          {
            hostIp: data.hostIp,
            hostPort: data.hostPort,
            id: parseInt(data.uniqueId), //
            hostId: data.hostId,
          },
        ])
      }

      var statusInfo = ['离线', '空闲', '呼出', '响铃', '对讲中', '广播中']
      console.log('addData', data)
      // _this.getAudionStatue(data, isStatus).then(
      //   resdata => {
      // if(resdata.data.data){
      //       if (resdata.data.data.status != "2") {
      //       alert(statusInfo[resdata.data.data.status-1])
      //       return
      //     }
      //    }else{

      //      alert('对讲状态查询失败')
      //    }
      postAddMemberApi(req)
        .then((res) => {
          console.log('res', res.data.message, data)
          if (!res.data.data) {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log('追加接口失败')
        })
      //   },
      //   rej => {}
      // )
    },

    // tab 栏 切换
    handleClick(val) {
      this.activeName = val.name;
       if (val.index == 0) {

       } else if (val.index == 1) {
        // 获取分组
        this.getGroup();
      }
    },

     // 保存分组 弹窗 
    dialogFormVisibleS() {
      if (!this.autoList.length) {
        alert('请添加面板')
        return
      }
      this.flag = !this.flag;
      this.arrlist = this.autoList;
    },

    // 获取分组
    getGroup() {
      console.log(sessionStorage.getItem("user"));
      let obj = {
        groupType: '2',  //分组方式 1：广播 2：对讲
        userId: JSON.parse(sessionStorage.getItem("user")).id,  // 用户id
        // keyPartId: '2',
        // orgId: '9'
      }

      getGroupingApi(obj)
        .then((res) => {
          // debugger
          console.log(res)
          if(res.data.code == 0){
            this.groupList = res.data.data.list
            console.log(this.groupList)
            this.flag = false
          }else{
            this.groupList = [];
          }
          
        })
        .catch((err) => {
          this.$messageError(err)
        })
    },

    //删除分组
    deleteGroup() {
      // debugger
      if(this.own_equipment && (this.own_equipment.runStatus == 4 || this.own_equipment.runStatus == 5)){
        this.$message({
          message: '当前正在对讲中，请先结束对讲',
          type: 'warning'
        });

        return false;
      }
      const delIds = this.deleteIds
      removeAudiougrouplistApi({ ids: delIds })
        .then((res) => {
          // console.log(res.data)
          // console.log(delIds)
          this.autoList = []
          this.rem = true
          
          this.getGroup()
        })
        .catch((err) => {
          this.$messageError(err)
        })
    },

    // 分组 上移 单项
    moveUp(){
      var group_activeIndex = this.group_activeIndex; //当前选中项index
      var groupList = JSON.parse(JSON.stringify(this.groupList));  //分组数据
      var data = groupList[group_activeIndex];  // 当前项
      if(group_activeIndex == 0){
        // 已经移动到第一个
        return false;
      }
      var data_last = groupList[group_activeIndex-1];  // 当前项 上一项
      groupList[group_activeIndex-1] = data;
      groupList[group_activeIndex] = data_last;
      this.groupList = groupList;
      this.group_activeIndex = group_activeIndex-1;

    },

    // 分组 下移 单项
    moveDown(){
      var group_activeIndex = this.group_activeIndex; //当前选中项index
      var groupList = JSON.parse(JSON.stringify(this.groupList));  //分组数据
      var data = groupList[group_activeIndex];  // 当前项
      if(group_activeIndex == groupList.length-1){
        // 已经移动到最后一个
        return false;
      }
      var data_next = groupList[group_activeIndex+1];  // 当前项 下一项
      groupList[group_activeIndex+1] = data;
      groupList[group_activeIndex] = data_next;
      this.groupList = groupList;
      this.group_activeIndex = group_activeIndex+1;
    },

    // 分组 搜索框 触发搜索
    groupFliterChange(){
      var group_fliter_text = this.group_fliter_text;
      var groupList = JSON.parse(JSON.stringify(this.groupList));  //分组数据 
      if(group_fliter_text == ''){
        this.getGroup();
      }else{
        var list = groupList.filter((item) => {
          return item.name.indexOf(group_fliter_text)>-1
        })
        this.groupList = list;
      }
      
    },

    viewChildList(val) {
      console.log('保存分组')
      this.tabListItem.push(val)
      console.log('查看数据', val)
    },

     // 弹框关闭
    cbtn() {
      this.flag = !this.flag
    },

    // 对讲组 改变位置
    changeGroupIndex(){
      var groupList = this.groupList;  // 分组 列表

    }, 

    // 对讲组 选中
    handleChange(val,type) {
      // val  当前对讲组中 台麦 和 面板
      console.log(val)
      this.autoList = [];  // 清空当前 设备组成员
      var channelInfo = val.channelInfo;  // 当前对讲组中的 面板
      var deviceInfo = val.deviceInfo;  // 当前对讲组中的 台麦
      if( val.channelInfo && channelInfo != '' ){
        // 如果当前 存在 面板
        channelInfo.forEach( (item) => {
          item.tierType = 'res';
          this.autoList.push(item);
        })
      }
      if( val.deviceInfo && deviceInfo != '' ){
        // 如果当前 存在 台麦
        deviceInfo.forEach( (item) => {
          item.tierType = 'equ';
          this.autoList.push(item);
        })
      }
      
      // val.channelInfo.forEach((data) => {
      //   this.autoList.push(data);
      //   // this.autoList.push({
      //   //   name: data.name,
      //   //   serverId: data.id,
      //   //   serverPort: data.platformPort,
      //   //   serverIp: data.ip,
      //   //   ip: data.ip,
      //   //   port: parseInt(data.port),
      //   //   id: data.id,
      //   //   panelId: '',
      //   //   uniqueId: data.uniqueId,
      //   //   hostIp: data.hostIp,
      //   //   orgName: data.orgName,
      //   //   keyPartName: data.keyPartName,
      //   //   hostPort: parseInt(data.hostPort),
      //   //   hostId: data.hostUniq, //
      //   //   type: 2, //1话筒，2面板,
      //   //   platformPort: data.platformPort,
      //   //   platformIp: data.platformIp,
      //   //   hostUniq: data.hostUniq,
      //   //   runStatus:data.runStatus,  // 运行状态   runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
      //   // })
      // })
      this.deleteIds = val.id

      // 展开隐藏
      if(type && type == 'show'){
        for(var i=0;i<this.groupList.length;i++){
          if(val.id == this.groupList[i].id){
            this.groupList[i].show = true;
          }else{
            this.groupList[i].show = false;
          }
          
        }
      }else  if(type && type == 'hide'){
        for(var i=0;i<this.groupList.length;i++){
          if(val.id == this.groupList[i].id){
            this.groupList[i].show = false;
          }
        }
      }

    },
    
    // 设备按钮开关
    filterIconEqu(val) {
      return val.tierType === 'equ'
    },

    // 资源按钮开关
    filterIconRes(val) {
      return val.tierType === 'res'
    },

    previewInfo(data, node) { // 详情
      let _this = this
      if (data.tierType === 'equ') {
        getDeviceInfoApi(data.id).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.dev = true
            this.devInfo = res.data.data.host
          } else {
            this.infoFlag.dev = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'res') {
        getResourceInfoApi(data.id).then(res => {
          if (res.data.code === 0) {
            _this.infoFlag.res = true
            _this.resInfo = res.data.data
            _this.resInfo.deviceType = _this.deviceType.find(i => i.key === _this.resInfo.deviceType).name
          } else {
            _this.infoFlag.res = false
            _this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'loc') {
        this.locLabels = this.initInfo(data.keyPartType)
        getLocOrOrgInfoApi({
          ids: [data.id],
          type: 2
        }).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.loc = true
            this.locInfo = res.data.data.keyParts[0]
            this.locInfo.status = this.statusCh[this.locInfo.status]
          } else {
            this.infoFlag.loc = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (data.tierType === 'org') {
         getLocOrOrgInfoApi({
          ids: [data.id],
          type: 1
        }).then(res => {
          if (res.data.code === 0) {
            this.infoFlag.org = true
            this.orgInfo = res.data.data.orgs[0]
            this.orgInfo.status = this.statusCh[this.locInfo.status]
          } else {
            this.infoFlag.org = false
            this.$messageError(res.data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },

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
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'updatedAt', label: '录入时间' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
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
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
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
            { prop: 'nearbyKeyPartName', label: '附近自助银行名称' }
          ]
        }, {
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
            { prop: 'status', label: '部位状态' }
          ]
        }, {
          key: 15,
          data: [
            { prop: 'name', label: '部位名称' },
            { prop: 'address', label: '部位地址' },
            { prop: 'oidName', label: '所属机构' },
            { prop: 'principal1', label: '部位负责人' },
            { prop: 'principalPhone1', label: '移动电话' }
          ]
        }
      ]
      return infoData.find(item => item.key === type).data
    },

    pingFunc(ip) { // ping功能
      console.log('ping func', ip)
    },
    //
    participantName(autoList) {
      var names = []
      autoList.forEach((item) => {
        names.push(item.name)
      })
      return names.join(',')
    },

    preview(val) {
      let data = {
        channel: val.channel,
        devIp: val.ip,
        devPort: val.cPort,
        dport: val.dPort,
        streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2',
      }
      this.$refs.preview.openPreview(data)
    },

    // 机构资源树  api
    getTreeApi(params) {
      return getTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 点击左侧资源树 添加到右侧 时  需要筛选 此设备  是否已经在右侧列表
    filterClick(data, arr) {
      console.log(data)
      var _this = this

      // 验证所选 设备 是否是 本机绑定的主机
      var host_id = this.globalConfig.callerInfo.ownId;  //本机绑定设备的 主键id
      console.log(host_id)
      console.log(data.id)
      var hostAdd = true;
      if(host_id && host_id == data.id){
        this.$message({
          message: '不可添加本机话筒',
          type: 'warning'
        });
        hostAdd = false;
      }

      var isadd = arr.find((item) => {
        return item.id == data.id
      })
      if (!isadd && hostAdd) {
        // 获取设备最新状态 然后 添加进数组
        if(data.tierType == 'equ'){
          // 台麦
          var params = {
            deviceId:data.id,  // 对讲主机主键id
          };
        } else if(data.tierType == 'res'){
          // 面板
          var params = {
            deviceId:data.dId,  // 对讲主机主键id
            channelSerise:data.channel,  // 通道号
          };
        }
        getRuntimeStatue(params).then(res => {
          if(res.data.code == 0){
            // 获取成功
            // 更新 设备的 运行状态
            var runStatus = res.data.data.status;
            data.runStatus = runStatus;
            console.log(runStatus);
            // 判断 当前设备的状态 ，如果存在非空闲状态，弹窗提示
            // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
            if( runStatus == 1){
              this.$message({
                message: '当前设备已离线',
                type: 'warning'
              });
            }else if( runStatus == 2 ){
              arr.push(data);
            }else if( runStatus == 3 ){
              this.$message({
                message: '当前设备正在呼出',
                type: 'warning'
              });
            }else if( runStatus == 4 ){
              this.$message({
                message: '当前设备正在响铃',
                type: 'warning'
              });
            }else if( runStatus == 5 ){
              this.$message({
                message: '当前设备正在对讲中',
                type: 'warning'
              });
            }else if( runStatus == 6 ){
              this.$message({
                message: '当前设备正在广播中',
                type: 'warning'
              });
            }
          }
        }).catch( error => {
          console.log(error);
        });
      }
    },

    //  树形菜单栏，添加对讲组成员
    organizeTreeClickHandle(data) {
      // var more_seqId = localStorage.getItem('more_seqId')
      // if (seqId) {
      //   this.$message({
      //     message:'请关闭当前对讲',
      //     type: 'error'
      //   })
      //   return
      // }
      // debugger
      console.log(data)
      var _this = this
      var mike = data;
      // mike = {
      //   name: data.name,
      //   serverId: data.id,
      //   serverPort: 2048,
      //   serverIp: data.ip,
      //   ip: data.ip,
      //   port: parseInt(data.port),

      //   id: data.id,
      //   panelId: '',
      //   uniqueId: data.uniqueId,
      //   hostIp: data.hostIp,
      //   hostPort: parseInt(data.hostPort),
      //   hostId: data.hostUniq, //
      //   orgName: data.orgName,
      //   keyPartName: data.keyPartName,
      //   type: 2, //1话筒，2面板,
      //   tierType: data.tierType,
      //   platformPort: data.platformPort,
      //   hostUniq: data.hostUniq,
      //   platformIp: data.platformIp,
      // }
      console.log('当前点击组织', data)
      switch (data.tierType) {
        case 'res': //面板
          // debugger
          _this.filterClick(mike, _this.autoList)
          if (this.own_equipment.runStatus == 5) {
            _this.addpanel(mike)
          }
          break
        case 'equ': //台麦
          // debugger
          if (data.type == 2) {
            _this.filterClick(mike, _this.autoList)
            if (this.own_equipment.runStatus == 5) {
              _this.addpanel(mike)
            }
          }

          break
        default:
          break
      }

      // this.queryDoorStatus()
      // 开着对讲追加面板,调用追加接口
    },

    setRootId(data) {
      console.log(data)
      this.rootId = data
    },

    // 开始对讲
    speak() {
      // this.macGet()
      var isStatus = false
      var _this = this
      if (!this.autoList.length) {
        alert('请添加面板')
        return
      };

     // 发起对讲之前 需要 查询 本 对讲组中是否 有非空闲状态的 设备
     var status_flag = this.autoList.some( (item) => {
       return item.runStatus != 2;
     });
     if(status_flag){
       this.$message({
          message: '该对讲组中有设备处在非空闲状态',
          type: 'warning'
        });

        // this.$confirm('该对讲组中有设备处在非空闲状态, 是否继续开启对讲?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
          
        // }).catch(() => {
                
        // });

     }

      var calledInfo = []
      var mikeInfo = []
      var calledName = [];  //被叫 的设备名称集合
      // 被调面板
      this.autoList.forEach((item) => {
        console.log(item)
        if (item.tierType == 'equ') {
          mikeInfo.push({
            id: item.uniqueId, //        //对讲设备id
            ip: item.ip, //对讲设备ip
            port: item.port,
          })
          console.log(item, '台麦')
        } else {
          calledInfo.push({
            hostIp: item.hostIp,
            hostPort: item.hostPort,
            id: parseInt(item.uniqueId), //
            hostId: item.hostUniq,
          })
        }
        calledName.push(item.name);
      })
      if(calledName){
        calledName = calledName.join(',');
      }
      let obj = {
        serverId: this.globalConfig.serverId,
        serverIp: this.globalConfig.serverIp,
        serverPort: this.globalConfig.serverPort,
        callerInfo: JSON.stringify(this.globalConfig.callerInfo), // JSON.stringify({ id: '003', ip: '10.1.1.111', port: 2046 }),
        callerName: globalConfig.hostName,
        calledName:calledName,
      }
      if (mikeInfo.length > 0) {
        obj.mikeInfo = JSON.stringify(mikeInfo)
        isStatus = true
      }
      if (calledInfo.length > 0) {
        obj.calledInfo = JSON.stringify(calledInfo)
      }
      console.log('this.autoList 当前面板', this.autoList)
      _this.postMicrophone(obj).then(
        (res) => {
          // debugger
          if (res.data) {

            // 开启对讲成功
            // 改变 本机 绑定的 设备 运行状态
            _this.rem = false
            _this.own_equipment.runStatus  = 4; // 将本机置为 对讲状态
             
            // this.$nextTick(() => {
            //   _this.$refs['ownTime'].start();
            // })
            // _this.$refs['ownTime'].start();
             
            // 将 添加的设备列表中每个设备 的状态设置为对讲中
            _this.autoList.forEach( (item) => {
              // （首先要判断当前设备是否是空闲的运行状态）
              if(item.runStatus == 2){
                item.runStatus = 4
              }
            })
            console.log(res, '开始对讲', _this.seqId);

            // 记录开始时间
            // this.startSpeakTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            _this.seqId = res.data.seqId;
            localStorage.setItem('more_seqId',res.data.seqId);

            // if(Array.isArray(_this.$refs['headerChild'])){
            //   _this.$refs['headerChild'].forEach((item) => {
            //     item.start()
            //   })
            // }else{
            //   _this.$refs['headerChild'].start();
            // }
            
            
          } else {
            // alert('开启对讲失败，请稍后重试')
            this.$message({
              message: '请绑定话筒',
              type: 'warning'
            });
          }
        },
        (rej) => {
          console.log(res, '开始对讲')
        }
      )
    },

    //关闭对讲
    hang() {
      
      // debugger
      var seqId = this.seqId
      var _this = this

      postCloseTalkbackApi({ seqId: seqId, serverIp: this.globalConfig.serverIp, serverPort: this.globalConfig.serverPort }).then(
        (res) => {
          console.log(res, '挂断成功')
          //  this.$refs.headerChild.stop()
          // this.returned = res.data.data.seqId
          // this.$refs.headerChild.stop()
          if (res.data) {
            // 挂断对讲成功
            // 改变 本机 绑定的 设备 运行状态
            // _this.rem = true
            _this.own_equipment.runStatus  = 2; // 将本机置为 空闲状态
            // 将 添加的设备列表中每个设备 的状态设置为空闲状态
            _this.autoList.forEach( (item) => {
              // （首先要判断当前设备是否是对讲中的运行状态）
              if(item.runStatus == 5 || item.runStatus == 4){
                item.runStatus = 2
              }
            })

            // if(Array.isArray(_this.$refs['headerChild'])){
            //   _this.$refs['headerChild'].forEach((item) => {
            //     item.stop()
            //   })
            // }else{
            //   _this.$refs['headerChild'].stop();
            // }

            // 计算并记录 通话时长
            // this.endSpeakTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            // this.call_duration = this.timeConvert(new Date()-new Date(this.startSpeakTime));
            this.seqId = '';
            localStorage.setItem('more_seqId','');
          } else {
            alert('关闭对讲失败')
          }
        },
        (rej) => {
          console.log(res, '挂断失败')
        }
      )
      // this.talkback = !this.talkback
    },

    // 提交多方对讲日志 弹框数据
    submit() {
      let obj = {
        organization: this.globalConfig.callerInfo.organization,
        keyPartName: this.globalConfig.callerInfo.keyPartName,
        deviceName: this.globalConfig.callerInfo.hostName,
        type: '对讲',
        sponsor: this.globalConfig.callerInfo.platformName+'-'+this.globalConfig.callerInfo.hostName,
        participant: this.participantName(this.autoList),
        startTime: this.startSpeakTime,
        endTime: this.endSpeakTime,
        duration:this.call_duration,
        channelId: this.globalConfig.keyId,
        deviceId: this.globalConfig.keyId,
        orgId: this.globalConfig.callerInfo.orgId,
        serverIp: this.globalConfig.serverIp,
        serverPort: this.globalConfig.serverPort,
        remarks: this.callTag,
      }

      this.postEstablish(obj)
        .then((res) => {
          console.log(res, '提交成功')
          this.talkback = false
          this.$message({
            message: '提交成功',
            type: 'success'
          });
        })
        .catch((err) => {
          this.$messageError(err)
        })
    },

    // 弹框中取消按钮事件
    cancel() {
      this.talkback = false
    },

    // 移除单个对讲组成员
    undock(val) {
      console.log(val)
      // debugger
      var _this = this
      
      var obj = {
        seqId: this.seqId,
        serverIp: this.globalConfig.serverIp,
        serverPort: this.globalConfig.serverPort,
      }

      if (val.tierType == 'equ') {
        obj.mikeInfo = JSON.stringify([
          {
            ip: val.ip,
            port: val.port,
            id: val.uniqueId,
          },
        ])
      } else {
        obj.boardInfo = JSON.stringify([
          {
            hostIp: val.hostIp,
            hostPort: parseInt(val.hostPort),
            hostId: val.hostId || val.hostUniq,
            id: parseInt(val.uniqueId),
          },
        ])
      }
      // 对讲打开中，请求接口删除单个对讲
      if (val.runStatus == 4 || val.runStatus == 5) {
        // 判断 当剩下最后一个对讲者的时候，不能单人挂断
        if(_this.autoList.length == 1  && this.own_equipment.runStatus == 5  ){
          this.$message({
            message: '当前对讲组还剩下两个人，请点击关闭对讲结束通话',
            type: 'warning'
          });
          return false;
        }
        if(!this.seqId){
          return false;
        }
        this.postDeleteMember(obj).then(
          (res) => {
            if (res.data) {
              console.log(res, '删除对讲成功')
              _this.autoList.splice(
                _this.autoList.findIndex((item) => item.id === val.id),
                1
              )
              // 判断
              console.log(!_this.autoList.length)
              if (!_this.autoList.length) _this.rem = true
              // this.rem = true
            } else {
              alert('删除对失败')
            }
          },
          (rej) => {
            console.log(res, '保存分组')
          }
        )
      } else {
        //页面上移除选中面板
        this.autoList.splice(
          this.autoList.findIndex((item) => item.id === val.id),
          1
        )
      }
      console.log(!this.autoList[0], this.autoList.length, this.autoList, this.autoList[0])
      if (!this.autoList[0]) {
        this.rem = true
      }
    },

    //全部删除对讲组成员
    allRemove() {
      if (!this.autoList.length) {
        alert('请添加面板')
        return
      }
      var mikeArr = []
      var boardArr = []
      var obj = {
        seqId: this.seqId,
        serverIp: this.globalConfig.serverIp,
        serverPort: this.globalConfig.serverPort,

        // mikeInfo: JSON.stringify(mikeArr), //[{"ip": "", //台麦ip,"port": 0, //台麦端口,"id": "	//台id},{}],
      }
      this.autoList.forEach((item) => {
        if (item.tierType == 'equ') {
          mikeArr.push({
            ip: item.ip,
            port: item.port,
            id: item.id,
          })
          obj.mikeInfo = JSON.stringify(mikeArr)
        } else {
          boardArr.push({
            hostIp: item.hostIp,
            hostPort: parseInt(item.hostPort),
            hostId: item.hostId || item.dId,
            id: parseInt(item.uniqueId),
          })
          obj.boardInfo = JSON.stringify(boardArr)
        }
      })

      // 开启对讲后，请求接口移除全部对讲
      if (this.own_equipment.runStatus == 5) {
        this.postDeleteMember(obj).then(
          (res) => {
            if (res.data) {
              console.log(res, '删除对讲组成功')
             
              this.own_equipment.runStatus  = 2; // 将本机置为 空闲状态
              this.seqId = '';
              localStorage.setItem('more_seqId','');
              this.autoList.forEach( (item,i) => {
                // （首先要判断当前设备是否是对讲中的运行状态）
                if(item.runStatus == 5 || item.runStatus == 4){
                  item.runStatus = 2
                  this.$refs['headerChild'][i].stop();
                }
              })
              this.autoList = []
              // this.rem = true
            } else {
              alert('删除对讲组失败')
            }
          },
          (rej) => {
            console.log(res, '保存分组')
          }
        )
      } else {
        this.autoList = []
      }
    },

    // 刷新  机构树
    refresh() { 
      if (this.activeName === 'first') {
        this.$refs.org.$refs.lazyTree.refresh()
      } else if (this.activeName === 'second') {
        this.getGroup();
      }
    },

    // 时间格式化 工具函数(时间对象转时间字符串)
    format(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        'H+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    },

    // 时间转换工具 （时间戳转时间）
    timeConvert(timestamp){
     var timestamp = parseInt(timestamp/1000);  // 毫秒转换成秒
      // 大于一天
      if(timestamp >60*60*24){
          return  '大于一天';
      }else{
          // 小于一天
          var h = 0,m=0,s=0;
          // 计算小时
          h = Math.floor(timestamp/(60*60));
          m = Math.floor((timestamp-(60*60)*h)/60);
          s = timestamp-60*60*h - 60*m;
          h<10?h='0'+h:h;
          m<10?m='0'+m:m;
          s<10?s='0'+s:s;
          return  h +':'+ m +':' + s; 
      }
    },

    // 设置一个定时器 来定时更新 设备的运行状态(组件销毁时 定时器 需要销毁)
    runUpStatusTimer(){
      var timer = setInterval( () => {
        // 判断 是否开始对讲 如果开始对讲
        var seqId = localStorage.getItem('more_seqId');  // 对讲组号， 如果存在，则说明正在对讲中
        console.log(seqId)
        // if(this.autoList && seqId != '')
        if(this.autoList){
          // 如果当前界面存在 设备 并且存在对讲组
          var video_list = this.autoList;
          
          for(let i=0;i<video_list.length;i++){
            // 循环判断当前设备是否在 对讲中 是：执行状态更新
            // 获取 需要轮训 状态的 设备列表（话筒/面板），即 设备的 运行状态是对讲中的设备
            if(video_list[i].tierType == 'equ'){
              // 台麦
              var params = {
                deviceId:video_list[i].id
              };
            } else if(video_list[i].tierType == 'res'){
              // 面板
              var params = {
                deviceId:video_list[i].deviceId || video_list[i].dId,  // 对讲主机主键id
                channelSerise:video_list[i].serise || video_list[i].channel,  // 通道号
              };
            }
            getRuntimeStatue(params).then(res => {
              if(res.data.code == 0){
                // 获取成功
                // 更新 设备的 运行状态
                var status = res.data.data.status;

                // 开启(关闭) 本设备的时间
                if(video_list[i].runStatus != 5 && status == 5 && seqId != ''){
                  console.log('starttimer')
                  this.$refs['headerChild'][i].start();
                  
                }else if(video_list[i].runStatus != 5 && status != 5){
                  console.log('closetimer')
                  if(this.$refs['headerChild'][i]){
                    this.$refs['headerChild'][i].stop();
                  }
                  
                }

                var obj = video_list[i];
                obj.runStatus = status;
                this.$set(this.autoList, i, obj)

              }
            }).catch( error => {
              console.log(error);
            });
          }

          // 获取本机绑定设备的运行状态
          var params = {
            deviceId : this.own_equipment.id
          };
          getRuntimeStatue(params).then(res => {
            if(res.data.code == 0){
              // 获取成功
              // 更新 本机 设备的 运行状态
              console.log(res.data.data.status)
              if( this.own_equipment.runStatus != 5 && res.data.data.status == 5 && seqId != '' ){
                this.$refs['ownTime'].start();
              }else if( this.own_equipment.runStatus != 5 && res.data.data.status != 5 ){
                // 当前 对讲已经结束
                localStorage.setItem('more_seqId','');
                this.seqId = "";
                
                // 关闭本机设备的 计时
                // if(this.$refs['ownTime']){
                  
                // }
                this.$refs['ownTime'].stop();
                

                // 关闭设备的时间
                // video_list.forEach( (item,index) => {
                //   if(item.runStatus == 5){
                //     this.$refs['headerChild'][index].stop();
                //   }
                // })

                // if(Array.isArray(this.$refs['headerChild'])){
                //   this.$refs['headerChild'].forEach((item) => {
                //     item.stop()
                //   })
                // }else{
                //   this.$refs['headerChild'].stop();
                // }

              }

              this.own_equipment.runStatus = res.data.data.status;
            }
          }).catch( error => {
            console.log(error);
          });
        }
        
      },3000);
      this.upStatusTimer = timer;
    },

    // 销毁定时任务
    clearUpStatusTimer(){
      clearInterval(this.upStatusTimer);
    },


    confirm() {},
    queryDoorStatus() {},
    ...mapActions('manyIntercom', {
      postAddMember: 'postAddMember',
      postMicrophone: 'postMicrophone',
      postDeleteMember: 'postDeleteMember',
      postSaveGrouping: 'postSaveGrouping',
      postAddMember: 'postAddMember',
      postEstablish: 'postEstablish',
    }),
  },
  created() {
    this.seqId = localStorage.getItem('more_seqId')
    // 获取对讲组列表 数据
    this.getGroup()
    console.log('globalConfig', this.globalConfig)
    // 初始化数据
    this.globalConfig.serverIp = '';
    this.globalConfig.serverPort = '';
    this.globalConfig.serverId = '';
    this.globalConfig.hostName = '';
    this.globalConfig.callerInfo = {};

    // 获取 本机mac地址绑定的 设备信息
    this.macGet();
  },

  mounted() {
    this.runUpStatusTimer();
  },
  beforeDestroy(){
    this.clearUpStatusTimer();   // 销毁定时任务

    // 页面销毁时 如果当前 存在 对讲 关闭对讲
    if(this.seqId){
      this.hang();
    }
  },

}
</script>

<style lang="less" scoped>
.manyIntercom {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

  .box {
    // width: 1000px;
    // height: 550px;
    z-index: 1000;
    flex:1;
    //   flex-wrap: wrap;
    //   align-content: flex-start;
     .addition {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        height: 750px;
        // width: 1560px;
        .texts {
          margin: 40px 0 0 0px;
          font-size: 20px;
          font-weight: 700;
        }
        .stateLine {
          // padding: 0 0 0 10px;
          padding: 8px 0;
          display: flex;
          // justify-content: center;
          span:nth-child(1) {
            width: 20px;
            height: 20px;
            color: #fff;
            background-color: #2dd3aa;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          span:nth-child(2) {
            line-height: 20px;
            margin-left: 3px;
          }
        }
        .box-content {
          width: 295px;
          height: 134px;
          font-size: 12px;
          color: #333333;
          box-sizing: border-box;
          padding: 15px;
          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
          margin: 0px 20px 26px 0px;
          
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap:wrap;
          align-content:center;
          .max-width{
            width: 100%;
          }
          .text-center{
            text-align: center;
          }
          .btn-wrap{
          // margin-top:10px;
            .btn{
              // margin-right: 10px;
            }
          }
          .btn-wrap2{
          margin-top:2px;
          margin-bottom:-5px;
            .btn{
              margin-left:2px;
            }
          }
          .box-top {
            display: flex;
            justify-content: space-between;
            .box-text {
              width: 100%;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
              word-break: break-all;
            }
            .active1 {
              display: none;
              font-size: 14px;
              color: #666666;
              // display: block;
            }
            span {
              color: #000;
              cursor: pointer;
            }
          }
          .box-buttom {
            // display: flex;
            // justify-content: center;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            margin: 5px 0 0 0;
            span {
              font-size: 12px;
            }
            .audiok {
              width: 20px;
              height: 20px;
              font-size: 14px;
              text-align: center;
              line-height: 20px;
              background-color: #2d72d3;
              border-radius: 50%;
              color: #fff;
            }
            .box-font {
              margin-left: 5px;
              font-size: 12px;
              line-height: 20px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
        }
      }
    .microphone-icon{
      width: 20px;
      height: 20px;
      color: #fff;
      background-color: #FF8E20;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
    }
    .groupChat {
      padding: 30px 0px 0 20px;
      // width: 1400px;
      display: flex;
      // flex: 1 1 360px;
      flex-wrap: wrap;
      // justify-content:space-between;
      overflow-y: auto;
      .right-box {
        position: relative;
        margin: 2px 10px;
        width: 240px;
        height: 153px;
        border: 1px solid #bcbcbc;
        display: flex;
        // justify-content: space-around;
        flex-direction: column;
        .tim {
          width: 50px;
          height: 50px;
          margin: 65px 1px 1px 102px;
        }
        .facilityName {
          width: 200px;

          text-align: center;
        }
        .stateLine {
          // padding: 0 0 0 10px;
          padding: 8px 0;
          display: flex;
          justify-content: center;
          span:nth-child(1) {
            width: 20px;
            height: 20px;
            color: #fff;
            background-color: #2dd3aa;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          span:nth-child(2) {
            line-height: 20px;
            margin-left: 3px;
          }
        }
        .btn {
          width: 200px;
          margin: 0 auto;
          text-align: center;
        }
        .spanName {
          width: 260px;
          margin: 15px 0 0 7px;
        }
        .spanText {
          text-align: center;
          line-height: 88px;
          margin-left: -21px;
        }

        /deep/ h3 {
          position: absolute;
          text-align: center;
          top: 40px;
          left: 100px;
          //margin: 65px -9px 0px 32px;
        }
      }
    }
  }

  // 对讲组样式
  .groupList-container{
    // margin-left: 5px;
    .active{
      background-color: #F2F6FC;
    }
  }
  .groupList-item{
    padding-left:5px;
    border-bottom: 1px solid #EBEEF5;
  }
  .group-title{
    height: 48px;
    font-size: 13px;
    display: flex;
    display: -webkit-flex;
    justify-content:space-between;
    align-items: center;
    padding-right:10px;
    cursor: pointer;
  }
  .group-title .icon-btn{
    cursor: pointer;
  }

  .group-main{
    padding:10px 20px;
    // transition:all 2s;
    // -webkit-transition:all 2s; /* Safari */
  }
  .group-main-item{
    line-height: 30px;
  }

  .function-btn {
    // position: absolute;
    // top: 750px;
    // display: flex;
    // margin: 20px 10px 10px 380px;
    margin-left:30px;
    /deep/ .el-button--default {
      margin-right: 13px;
    }
    /deep/ .el-dialog {
      height: 450px !important;
    }
    .grouping {
      position: absolute;
      top:0;
      left:0;
      bottom:0;
      right: 0;
      margin:auto;
      background-color: white;
    }
    .audio-tape {
      flex: 1;
      margin: 13px 0 0 35px;
    }
  }

  .leftMenu {
    width: 300px;
    height: 100%;
    position: relative;
    border: 1px solid #dcdfe6;
    .shuaxin {
      position: absolute;
      left: 266px;
      top: 11px;
      z-index: 1000;
      font-size: 14px;
      line-height: 25px;
      cursor: pointer;
    }

    .refresh {
      position: absolute;
      top: 13px;
      right: 10px;
      z-index: 2;
      cursor: pointer;
    }

  }
  /deep/.el-tabs {
    width: 300px;
    height: 100%;
    position: relative;
    .taneOne {
      .group-fliter-contaienr{
        padding:10px 0px;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        .fliter-inp{
          // width:220px;
          flex: 1;
        }
        .fliter-icon{
          font-size: 18px;
          color: #606266;
          display: block;
          width:25px;
          height: 35px;
          text-align: center;
          line-height: 35px;
          cursor: pointer;
        }
        .fliter-icon:hover{
          font-size: 20px;
          color: #000;
        }
      }
      .groupList {
        margin-left: 5px;
        .el-collapse-item__content {
          margin-left: 20px;
        }
      }
    }
    .el-tabs__header {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      height: 40px;
      .el-tabs__item {
        width: 114px;
        text-align: center;
      }
      .is-active {
        border-top: 2px solid #2d72d3;
      }
    }
    .el-tabs__content {
      overflow: auto;
      position: absolute;
      left: 0;
      top: 40px;
      width: 100%;
      height: 95%;
      padding: 2px;
    }
  }
}

// 关闭对讲弹框
.config-box {
  position: absolute;
  width: 600px;

  border: 1px solid #000;
  z-index: 1001;
  background: #fff;
  left: 334px;
  top: 87px;
  padding: 10px;
  .top {
    width: 100%;
    height: 30px;
    background: #eeeeee;
    display: flex;
    justify-content: space-between;
    p {
      padding: 6px;
    }
    button {
      line-height: 10px;
      height: 15px;
      width: 15px;
      margin: 10px;
      margin-top: 6px;
      border: none;
      background: none;
    }
  }
  /deep/ .el-input__inner {
    width: 193px;
    height: 23px;
    border-radius: 0px;
  }
  .box {
    position: absolute;
    left: 48px;
    top: 207px;
    width: 509px;
    height: 129px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(204, 204, 204, 1);
    border-radius: 0px;
    textarea {
      resize: none;
      width: 100%;
      height: 100%;
    }
  }
  .bottom {
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin: 187px 10px 10px -13px;
  }
}

.text {
  height: 35px;
  margin-top: 34px;
  .groupname {
    height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    border-left: 2px solid #2d72d3;
    padding-left: 3px;
    padding-right: 12px;
    font-size: 12px;
    font-weight: 500;
  }
}
.divider {
  width: 1564px;
  height: 1px;
  background: rgba(225, 225, 225, 1);
  margin-top: 13px;
}

// 设备详情 弹窗
.info-box {
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
      white-space:nowrap;
    }
    .info-value {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
    }
  }
}


</style>
