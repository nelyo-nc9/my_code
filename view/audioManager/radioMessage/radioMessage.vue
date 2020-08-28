<template>
  <!-- 广播 -->
  <div class="boxContent" id="boxContent">
    <!-- 左边 -->
    <div class="leftMenu">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="资源" name="first">
          <treeBox
            ref="org" 
            :lazyTreeApi="getTreeApi"
            searchType="search"
            :treeType="treeType"
            @onceClick="organizeTreeClickHandle"
            @rootId="setRootId"
            treeLazyToggle
            iconToggle
            :lazyTreeSearchApi="getLazyTreeSearchApi"
            :customizeQuery="customizeQuery"
          >
            <template  slot-scope="{data, node}">
              <!-- <i class="iconfont icon-bukong" title="一键展开" v-if="iconList.includes('expand') && filterIconEqu(data)"></i>
              <i class="iconfont icon-edit" title="编辑" v-if="iconList.includes('edit') && filterIconEqu(data)"></i>
              <i class="iconfont icon-polling" title="开启轮巡" v-if="iconList.includes('poll') && filterIconEqu(data)"></i>
              <i class="iconfont icon-collection" title="快速收藏" v-if="iconList.includes('collection') && filterIconRes(data)"></i> -->
              <i class="iconfont icon-biaoqian" title="详细信息" v-if="iconList.includes('info')" @click.stop="previewInfo(data, node)"></i>
            </template>
          </treeBox>
        </el-tab-pane>
        <el-tab-pane class="taneOne" label="广播组 " name="second">
          <div class="group-fliter-contaienr">
            <!-- 分组 搜索框 -->
            <el-input
              class="fliter-inp"
              placeholder=""
              size="small"
              suffix-icon="el-icon-search"
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

          <!-- 广播组列表 -->
          <div class="groupList-container">
            <div :class="{'groupList-item':true,'active':group_activeIndex == index}" v-for="(item,index) in groupList" :key="item.id">
              <div class="group-title" @click="handleChange(item.id,''); group_activeIndex=index;">
                <span>{{ item.name }}</span>
                <span v-if="item.show" class="el-icon-arrow-down icon-btn" @click.stop="handleChange(item.id,'hide'); group_activeIndex=index;"></span>
                <span v-else class="el-icon-arrow-right icon-btn" @click.stop="handleChange(item.id,'show'); group_activeIndex=index;"></span>
                
              </div>
              <el-collapse-transition>
              <div class="group-main" v-show="item.show">
                <div class="group-main-item" v-for="(items,i) in audioList" :key="i">{{items.name}}</div>
              </div>
              </el-collapse-transition>
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
      <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
    </div>
    <!-- 面包屑导航 -->
    <div id="offside" class="rightContent">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>音频管理</el-breadcrumb-item>
        <el-breadcrumb-item>广播喊话</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="right">
        <div class="text">
          <span class="groupname">{{groupName}}</span>
          <el-button size="mini" @click="dialogVisibletwo = true"  v-if="audioList.length>0">保存分组</el-button>
          
          <!-- 保存分组弹框 -->
          <el-dialog
            title="广播分组"
            :visible.sync="dialogVisibletwo"
            width="30%"
            :before-close="handleClose" :close-on-click-modal="false">
            <span>分组名称：</span>
            <el-input v-model="group_name"></el-input>
            <div class="equiInfo">
              <div v-for="item in audioList" :key="item.id">{{item.name}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="createGroup">确 定</el-button>
              <el-button @click="dialogVisibletwo = false">取 消</el-button>
            </span>
          </el-dialog>

        </div>
        <!-- 分割线 -->
        <div class="divider"></div>
        <!-- 广播功能 -->
        <div class="broadcast-style">
          <ul class="list">
            <li>本机话筒</li>
            <div class="stateLine">
              <span :style="{backgroundColor: own_equipment.runStatus == 2 ? '#2DD3AA' : '#FF8E20' }" class="el-icon-microphone"></span>
              <!-- runStatus  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中 -->
              <span v-if="own_equipment.runStatus == 1">离线</span>
              <span v-else-if="own_equipment.runStatus == 2">空闲</span>
              <span v-else-if="own_equipment.runStatus == 3">呼出</span>
              <span v-else-if="own_equipment.runStatus == 4">响铃</span>
              <span v-else-if="own_equipment.runStatus == 5">对讲中</span>
              <span v-else-if="own_equipment.runStatus == 6">广播中</span>
              <!-- <span v-else>未知状态</span> -->
            </div>
            <li>
              <Time :time="time" ref="headerChild"></Time>
            </li>
          </ul>

          <!-- 广播操作按钮 -->
          <div class="btn">
            <el-row>
              <el-button :disabled="noMac" size="mini" @click.stop="hanleOpenradio">{{isSwitch?'开启':'关闭'}}语音广播</el-button>
              <el-button
                size="mini"
                @click="handleOpen"
                v-if="isluyin"
                :disabled="isOpen"
              >{{isFile?'开启':'关闭'}}录音广播</el-button>
              <el-button size="mini" @click="dialogVisible = true" v-if="isluyin" :disabled="noMac">录音文件配置</el-button>
              <el-dialog
                title="广播配置"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
                 :close-on-click-modal="false"
              >
                <span style="font-size=16px; margin-bottom:12px;">广播录音文件</span>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :limit="1"
                  :headers="headers"
                  name="broadfile"
                  :file-list="fileList"
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                  :on-remove="onRemove"
                  action="/api/audio/v1/service/upload"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传wav文件，且不超过10M</div>
                </el-upload>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="uploadFile">保 存</el-button>
                  <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
              </el-dialog>
            </el-row>
          </div>

          <div class="spans" v-if="ispeizhi">请配置录音文件</div>
        </div>

        <div class="divider"></div>
        <!-- 广播设备 列表 -->
        <div class="addition">
          <h3 class="texts" v-if="audioList.length==0">添加左侧对讲资源至广播</h3>
          <div
            class="box-content"
            v-for="item in audioList"
            :key="item.id"
            @mouseover.self="delShow($event)"
            @mouseleave.self="delHide($event)">
            <div class="box-top">
              <div class="box-text">{{item.name}}</div>
              <span id="deleId" class="icon iconfont active1" @click="deleteEqui(item.id)">&#xe638;</span>
            </div>
            <div class="box-buttom">
              <span class="icon iconfont audiok">&#xe65e;</span>
              <el-tooltip class="item" effect="light" :content="item.orgName+'>'+item.keyPartName+'>'+item.name"
                placement="bottom">
                <span class="box-font">{{item.orgName || '无数据'}}>{{item.keyPartName ||'无数据'}}>{{item.name ||'无数据'}}</span>
              </el-tooltip>
            </div>
          </div>
        </div>
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
import treeBox from '@src/components/tree/treeBox'
import Time from './theTimer'
import {
  postMacGetApi,
  getStateApi,
  getAudiotreeApi,
  postDownradiofileApi,
  getGroupListApi,
  postAudiouploadApi,
  postCreategroupApi,
  getAudiougrouplistApi,
  removeAudiougrouplistApi,
  putAddequipmentApi,
  postRadiofileApi,
  postOpenradiofileApi,
  postOpenradioApi,
  postDwonradioApi,
} from '../../../http/audio/audiogb'
import { getTreeApi } from '../../../http/audio/manyIntercom'
import { getResourceInfoApi, getDeviceInfoApi, getLocOrOrgInfoApi } from '@src/http/video/videoConfig.api.js'

import { getStatueNew,getRuntimeStatue } from '../../../http/audio/resource'

import { fuzzySearchTreeApi } from '@src/http/audioManage/audioTree.api.js'

export default {
  name: 'Preview',
  components: {
    treeBox,
    Time,
  },

  data() {
    return {
      customizeQuery: {
        params: {
          hostType: '1',
        },
      },

      // 上传请求头
      headers:{
        'Authorization' : JSON.parse(sessionStorage.getItem('user')).token
      },

      noMac:false,  // 本机是否绑定了  台麦设备   true是 false否
      own_equipment:{},  // 本机mac 地址 绑定的 设备信息

      oprate_type:1,  // 当前 操作类型 1语音广播 2录音广播
      
      //判断 录音广播提示语 是否显示
      ispeizhi: false,
      //判断录音功能是否开启
      isluyin: false,
      //判断是否开启关闭广播
      isSwitch: true,
      //判断是否开启关闭广播文件
      isFile: true,
      //判断播放录音按钮是否可用
      isOpen: true,
      // //判断保存按钮是否可用
      // isGroup: false,
      // //判断title是否显示
      // isTitle: true,
      //判断播放状态
      isState: true,
      //判断面板状态
      state: '',
      
      group_name: '',  //新分组名字
      //上传的文件
      fileList: [],
      // 设备状态显示名称
      stutaName: '空闲',
      //时间
      time: 0,
      //广播组名字
      groupName: '临时广播',
      // 折叠选中
      activeNameze: '',
      // 删除分组ID:
      deleteIds: '',
      // 广播组
      groupList: [],
      group_activeIndex:-1,  // 分组 选中项
      group_fliter_text:'',  // 分组 搜索字段

      // 面板组
      audioList: [],
      // 话筒id
      markid: '',
      // 话筒设备名称
      // audioTitle: '',
      //对讲服务器ip
      serverIps: '',
      //对讲服务器port
      serverPorts: null,
      //对讲服务器id
      serverIds: '',
      // 选中标签页
      activeName: 'first',
      // 上传文件的路径名称
      fileName: '',
      // 树相关
      treeType: 0,
      //弹窗1-2状态
      dialogVisible: false,
      dialogVisibletwo: false,
      //点击折叠面板groupList的下标
      // xiabiao: null

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
    // audioList: {
    //   handler(old, newData) {
    //     localStorage.setItem('audioList7', JSON.stringify(this.audioList))
    //   },
    //   deep: true
    // },
    // groupName: {
    //   handler(old, newData) {
    //     localStorage.setItem('groupName7', JSON.stringify(this.groupName))
    //   },
    //   deep: true
    // },
  },
  methods: {
    // 机构树 api
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

    // 点击 机构树
    organizeTreeClickHandle(node) {
      console.log('02 当前点击的 机构树 --------- ', node, node.id, node.subType)
      // 设定话筒设备名称
      // if (res.tierType == "equ") {
      //   this.audioTitle = res.name
      // }
      //如果audioList 里面包含的项的 id和res.id相等，或者 不属于设备 或者 当前设备正在对讲中  则不追加
      let listId = []
      this.audioList.forEach((v) => {
        listId.push(v.id)
      })
      if (!listId.includes(node.id) && node.tierType == 'res') {
        // 获取设备最新状态 然后 添加进数组
        // 主机 面板
        var params = {
          deviceId:node.dId,  // 对讲主机主键id
          channelSerise:node.channel,  // 通道号
        };
        getRuntimeStatue(params).then(res => {
          if(res.data.code == 0){
            // 获取成功
            // 更新 设备的 运行状态
            var runStatus = res.data.data.status;
            // data.runStatus = runStatus;
            console.log(runStatus);
            // 判断 当前设备的状态 ，如果存在非空闲状态，弹窗提示
            // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
            if( runStatus == 1){
              this.$message({
                message: '当前设备已离线',
                type: 'warning'
              });
            }else if( runStatus == 2 ){
              this.audioList.push(node);
              this.groupName = '临时广播';
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

      console.log(this.audioList.length)
      // if (this.audioList.length) {
      //   this.isGroup = true
      //   this.isTitle = false
      // } else {
      //   this.isGroup = false
      //   this.isTitle = true
      // }
    },

    // 弹框1开启关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },

    // 开启关闭录音广播
    handleOpen() {
      this.oprate_type = 2;

      if (this.audioList.length == 0) {
        this.$messageError('请先添加对讲资源')
        return
      }

      let list = []
      var calledName = [];  //被叫 的设备名称集合
      this.audioList.forEach((v) => {
        list.push({
          //被广播方设备主机ID
          calledId: v.hostUniq,
          //被广播方面板ID
          calledPanel: parseInt(v.uniqueId),
        })
        calledName.push(v.name);
      })
      const list2 = JSON.stringify(list)

      if(calledName){
        console.log()
        calledName = calledName.join(',');
      }

      if (this.isFile) {
        //开启
        postOpenradiofileApi({
          serverIp: this.serverIps,
          serverPort: this.serverPorts,
          // serverIp: this.audioList[0].platformIp,
          // serverPort: this.audioList[0].platformPort,
          ftpPath: this.fileName,
          deviceInfo: list2,
          calledName:calledName,
          callerName:this.audioTitle
        })
          .then((res) => {
            if (res.data.message == 'success') {
              console.log(res.data)
              // this.isFile = !this.isFile
              // this.isState = !this.isState
              this.$messageSuccess('已开启')
              // this.$refs.headerChild.start()
            } else {
              this.$messageError('未开启')
            }
          })
          .catch((err) => {
            this.$messageError(err)
          })
      } else {
        //关闭
        postDownradiofileApi({
          serverIp: this.serverIps,
          serverPort: this.serverPorts,
          // serverIp: this.audioList[0].platformIp,
          // serverPort: this.audioList[0].platformPort,
          deviceInfo: list2,
        })
          .then((res) => {
            if (res.data.message == 'success') {
              console.log(res.data)
              this.$refs.headerChild.stop()
              this.isFile = !this.isFile
              this.isState = !this.isState
              this.$refs.headerChild.stop()
              this.$messageSuccess('已关闭')
            } else {
              this.$messageError('未关闭')
            }
          })
          .catch((err) => {
            this.$messageError(err)
          })
      }
    },

    // 开启关闭语音广播
    hanleOpenradio() {
      this.oprate_type = 1;

      let list = []
      var calledName = [];  //被叫 的设备名称集合
      
      this.audioList.forEach((v) => {
        list.push({
          calledId: v.hostUniq,
          calledPanel: parseInt(v.uniqueId),
          // calledId: '003',
          // calledPanel: 1
        })
        calledName.push(v.name);
      })
      let list2 = JSON.stringify(list)
      if (this.audioList.length == 0) {
        this.$messageError('请先添加对讲资源')
        return
      }

      if(calledName){
        calledName = calledName.join(',');
      }

      if (!this.isSwitch) {
        //关闭
        postDwonradioApi({
          serverIp: this.serverIps,
          serverPort: this.serverPorts,
          serverId: this.serverIds,
          callerId: this.markid,
          // serverIp: this.audioList[0].platformIp,
          // serverPort: this.audioList[0].platformPort,
          // serverId: this.audioList[0].platformUniq,
          // callerId: this.markid,
        })
          .then((res) => {
            if (res.data.message == 'success') {
              console.log(res.data)
              // 结束计时
              this.$refs.headerChild.stop();

              this.isSwitch = !this.isSwitch
              this.isState = !this.isState
              this.$messageSuccess('已关闭')
            } else {
              this.$messageError('未关闭')
            }
          })
          .catch((err) => {
            this.$messageError(err)
          })
      } else {
        // 发起对讲之前 需要 查询 本 对讲组中是否 有非空闲状态的 设备
        var status_flag = this.audioList.some( (item) => {
          return item.runStatus != 2;
        });
        if(status_flag){
          this.$message({
              message: '该广播组中有设备处在非空闲状态',
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
        
        //开启
        postOpenradioApi({
          serverIp: this.serverIps,
          serverPort: this.serverPorts,
          serverId: this.serverIds,
          callerId: this.markid,
          // serverIp: this.audioList[0].platformIp,
          // serverPort: this.audioList[0].platformPort,
          // serverId: this.audioList[0].platformUniq,
          // callerId: this.markid,
          deviceInfo: list2,
          calledName:calledName,
          callerName:this.audioTitle
        })
          .then((res) => {
            if (res.data.message == 'success') {
              console.log(res.data)
              // 开启计时
              this.$refs.headerChild.start()

              this.isSwitch = !this.isSwitch
              this.isState = !this.isState
              this.$messageSuccess('已开启')
            } else {
              this.$messageError('未开启')
            }
          })
          .catch((err) => {})
      }
    },

    //上传前
    beforeUpload(file) {
      const extension = file.name.split('.')[1] === 'wav'
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message.warning('上传模板只能是wav格式!')
      }
      if (!isLt5M) {
        this.$message.warning('上传模板大小不能超过 10MB!')
      }
      return extension && isLt5M
    },

    // 文件上传成功时触发的钩子函数
    onSuccess(response, file, fileList) {
      console.log(response)
      if (response.message == 'success') {
        this.fileName = 'B' + response.data.split('/B')[1]
        this.isOpen = false
        this.ispeizhi = false
        console.log(this.fileName)
        this.$message({
          message: '上传成功',
          type: 'success',
        })
      } else {
        this.$message.error('上传失败，请从新上传')
      }
    },

    //文件取消的钩子函数
    onRemove(file, fileList) {
      this.isOpen = true
      this.ispeizhi = true
    },

    // 上传
    uploadFile() {
      this.dialogVisible = false
    },

    // 折叠面板点击
    handleChange(val,type) {
      console.log(type)
      let listt = [];
      listt = this.groupList.filter((v) => v.id == val)
      console.log(listt);
      this.groupName = listt[0].name;
      this.audioList = listt[0].channelInfo;
      // 点击面板的数组下标
      // console.log(this.groupList);
      // this.xiabiao = this.groupList.findIndex(v => v.id == val)
      // console.log(this.xiabiao);
      // 获取数组内所有面板的状态
      // let statuList1 =this.audioList.forEach(v => {
      //   getStateApi({
      //     serverIp: this.serverIps,
      //      serverPort: this.serverPorts,
      //     calledId: v.hostUniq,
      //     calledPanel: v.uniqueId
      //   })
      //     .then(res => {
      //       console.log(res.config.data);
      //     })
      //     .catch(err => {
      //       this.$messageError(err)
      //     })
      // })
      // console.log(statuList1);
      // this.isTitle = false
      // this.isGroup = false
      this.deleteIds = val;
      this.activeNameze = val;

      // 展开隐藏
      if(type && type == 'show'){
        for(var i=0;i<this.groupList.length;i++){
          if(val == this.groupList[i].id){
            this.groupList[i].show = true;
          }else{
            this.groupList[i].show = false;
          }
          
        }
      }else  if(type && type == 'hide'){
        for(var i=0;i<this.groupList.length;i++){
          if(val == this.groupList[i].id){
            this.groupList[i].show = false;
          }
        }
      }

    },

    //创建分组
    createGroup() {
      // let deviceIds = [];  // 分组 设备id 集合
      let channelIds = [];  // 分组 通道id 集合

      this.audioList.forEach((v) => {
        // deviceIds.push(v.deviceId || v.dId);
        channelIds.push(v.id);
      })
      // deviceIds = deviceIds.join(',');
      channelIds = channelIds.join(',');

      if(this.group_name == ''){
        this.$message({
          message: '分组名称不能为空',
          type: 'warning'
        });
        return false;
      }
      postCreategroupApi({
        name: this.group_name,  // 分组名称
        timeBroad: this.fileName,  // 广播文件
        groupType: '1',  // 分组类型 1广播 2对讲
        // keyPartId: this.audioList[0].keyPartId,
        // orgId: this.audioList[0].orgId,
        channelIds: channelIds,
        // deviceIds: deviceIds,
        // userId: JSON.parse(sessionStorage.getItem('user')).id,
      })
        .then((res) => {
          console.log(res)
          this.$messageSuccess('成功创建' + this.group_name + '广播组')
          this.group_name = '';
          this.getGroup();
          this.dialogVisibletwo = false
        })
        .catch((err) => {
          this.$messageError(err)
        })
      
    },

    //获取分组
    getGroup() {
      getGroupListApi({
        groupType: '1',
        userId: JSON.parse(sessionStorage.getItem('user')).id,
      }) .then((res) => {
        console.log(res)
        if(res.data.code == 0){
          if(res.data.data.list){
            var list = res.data.data.list;
            for(var i=0;i<list.length;i++){
              list[i].show = false;
            }
            this.groupList = list;
          }else{

            this.groupList = [];
            
          }
          
        }
      })
      .catch((err) => {
        this.$messageError('无法获取广播组列表')
      })
    },

    setRootId(data) {
      this.rootId = data
    },

    //切换标签页
    handleClick(val) {
      this.activeName = val.name
      console.log(val)
      if (val.index == 0) {
        this.audioList = []
        this.groupName = '临时广播'
        // this.isTitle = true
        this.isluyin = false
        this.ispeizhi = false
      } else if (val.index == 1) {
        this.isluyin = true
        this.ispeizhi = true
        // 获取分组
        this.getGroup();
      }
    },

    getTreeApi(params) {
      return getTreeApi(params)
    },

    //进入显示删除按钮
    delShow(event) {
      event.target.firstElementChild.lastElementChild.style.display = 'block'
    },

    //移出隐藏删除按钮
    delHide(event) {
      event.target.firstElementChild.lastElementChild.style.display = 'none'
    },

    //删除设备
    deleteEqui(id) {
      this.audioList.some((item, i) => {
        if (item.id == id) {
          this.audioList.splice(i, 1)
        }
      })
      console.log(this.groupList)

      if (this.deleteIds) {
        let ids = []
        this.audioList.forEach((v) => {
          ids.push(v.id)
        })
        console.log(this.audioList)
        ids = ids.toString()
        if (ids.length) {
          putAddequipmentApi({
            id: this.deleteIds,
            channelIds: ids,
          })
            .then((res) => {
              // this.$messageError(res.data.msg)
              console.log(res.data)
            })
            .catch((err) => {
              this.$messageError(err)
            })
        } else {
          this.deleteGroup()
        }
      }
    },

    //删除分组
    deleteGroup() {
      const delIds = this.deleteIds
      removeAudiougrouplistApi({ ids: delIds })
        .then((res) => {
          if(res.data.code == 0){
            this.getGroup();
          }
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
      console.log(group_fliter_text)
      if(group_fliter_text == ''){
        this.getGroup();
      }else{
        var list = groupList.filter((item) => {
          return item.name.indexOf(group_fliter_text)>-1
        })
        this.groupList = list;
      }
      
    },

    // 根据mac获取信息
    macGet() {
      let mac = []
      let macs = JSON.parse(sessionStorage.getItem('macAddress')).adaptors
      macs.forEach((v) => v.mac)
      macs.forEach((v) => mac.push(v.mac))
      mac = mac.toString()
      // mac = JSON.stringify(mac)
      console.log(JSON.parse(sessionStorage.getItem('macAddress')).adaptors)
      console.log('mac地址-----------：' + macs)
      console.log(mac)
      postMacGetApi({
        mac: mac,
      })
        .then((res) => {
          if (res.status == 201  && JSON.stringify(res.data.data) != "{}") {
            this.markid = res.data.data.hostUniqueId
            this.audioTitle = res.data.data.hostName
            this.serverIps = res.data.data.platformIp
            this.serverPorts = res.data.data.platformPort
            this.serverIds = res.data.data.platformUniqueId

            // 本机绑定的话筒设备
          var ower_obj = {
             name : res.data.data.hostName,
             status : res.data.data.hostSatus,
             runStatus : res.data.data.hostRunStatus,
             serverIp : res.data.data.platformIp,
             serverPort : res.data.data.platformPort,
             hostUniqueId : res.data.data.hostUniqueId,
             id:res.data.data.id,  // 本机绑定 设备 主键 id
           };
           this.own_equipment = ower_obj;

          } else {
            this.$alert('您的终端未绑定台麦', '提示', {
              confirmButtonText: '确定',
              type:"warning"
            });
            this.noMac=true;
          }
          console.log('调mac接口返回的数据')
          console.log(res.data.data)
        })
        .catch((err) => {
          this.$messageError(err)
        })
    },
   
    // 刷新  机构树
    refresh() { 
      if (this.activeName === 'first') {
        this.$refs.org.$refs.lazyTree.refresh()
      } else if (this.activeName === 'second') {
        this.getGroup();
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

    // 设置一个定时器 来定时更新 设备的运行状态(组件销毁时 定时器 需要销毁)
    runUpStatusTimer(){
      var timer = setInterval( () => {
        // 判断 是否开始 (语音/录音)广播
        //  isSwitch false 语音广播 开启状态
        //  isFile false 录音广播 开启状态
        // if(this.audioList && (!this.isSwitch || !this.isFile))
        if(this.audioList){
          // 如果当前界面存在 设备 并且正在广播中、
          var audioList = this.audioList;
          
          for(let i=0;i<audioList.length;i++){
            // 循环判断当前设备是否在 广播中 是：执行状态更新
            // if(audioList[i].runStatus == 6){
              // 获取 需要轮训 状态的 设备列表（话筒），即 设备的 运行状态是对讲中的设备
              var params = {
                deviceId:audioList[i].deviceId || audioList[i].dId,  // 对讲主机主键id
                channelSerise:audioList[i].serise || audioList[i].channel,  // 通道号
              };
              getRuntimeStatue(params).then(res => {
                if(res.data.code == 0){
                  // 获取成功
                  // 更新 设备的 运行状态
                  audioList[i].runStatus = res.data.data.status;
                }
              }).catch( error => {
                console.log(error);
              });
            // } 
          }
          
          // 语音广播 和 录音广播 判断条件 存在 差异 
          // 语音广播 需要以判断本机绑定的台麦 运行状态 来判定 当前是否广播中
          // 录音广播 需要以判断 参加广播组 的面板 运行状态 是否广播中来判断是否在广播中
          
          if(this.oprate_type == 1){
            // 默认状态或者 语音广播状态
            // 获取本机绑定设备的运行状态
            var params = {
              deviceId : this.own_equipment.id
            };
            getRuntimeStatue(params).then(res => {
              if(res.data.code == 0){
                // 获取成功
                // 更新 本机 设备的 运行状态
                this.own_equipment.runStatus = res.data.data.status;
                if(res.data.data.status != 6){
                  // 当前 广播已经结束
                  // 结束计时
                  this.$refs.headerChild.stop();
                  this.own_equipment.runStatus = 2; 

                  // 更新UI
                  this.isSwitch = true;
                }
              }
            }).catch( error => {
              console.log(error);
            });
          }else{
            // 录音广播状态
            var status_flag =audioList.some( (item) => {
              return item.runStatus == 6;
            })
            console.log(status_flag)
            if(!status_flag){
              // 录音广播已结束
              this.$refs.headerChild.stop();

              // 更新UI
              this.isFile = true;
            }else{
              this.$refs.headerChild.start();

              // 更新UI
              this.isFile = false;
            }
          }
        }
        
      },3000);
      this.upStatusTimer = timer;
    },

    // 销毁定时任务
    clearUpStatusTimer(){
      clearInterval(this.upStatusTimer);
    },

  },

  created() {
    this.getGroup()
    this.macGet()
  },
  mounted() {
    this.runUpStatusTimer();
  },
  beforeDestroy(){
    this.clearUpStatusTimer();   // 销毁定时任务

    // 如果当前 存在广播 关闭
    if(!this.isFile){
      this.handleOpen();
    }

    if (!this.isSwitch){
      this.hanleOpenradio();
    }


  },
}
</script>

<style lang="less" scoped>
#boxContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  .leftMenu {
    width: 300px;
    height: 100%;
    position: relative;
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

    // 广播组样式
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
  .rightContent {
    width: calc(~'100% - 300px');
    .el-breadcrumb {
      margin: 23px 0 0 25px;
    }
    .right {
      margin: 32px 0 0 24px;
      .text {
        height: 35px;
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
        .el-button {
        }
        .equiInfo {
          box-sizing: border-box;
          padding: 8px;
          margin-top: 20px;
          width: 535px;
          height: 250px;
          border: 1px solid #ccc;
          border-radius: 3px;
          overflow: auto;
        }
      }
      .divider {
        width: 1564px;
        height: 1px;
        background: rgba(225, 225, 225, 1);
        margin-top: 13px;
      }
      .broadcast-style {
        box-sizing: border-box;
        width: 344px;
        height: 175px;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
        margin-top: 23px;
        margin-bottom: 34px;
        padding: 14px;
        font-size: 12px;
        color: #333333;
        .list {
          li {
            margin-bottom: 10px;
          }
          .stateLine {
            margin-bottom: 10px;
            display: flex;
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
        }
        .btn {
          .el-dialog {
            .el-button {
              margin-top: 15px;
            }
          }
          .el-button {
            padding: 7px 10px;
          }
        }
        .spans {
          margin: 6px 0 0 0;
          width: 312px;
          text-align: center;
        }
      }
      .addition {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        width: 1560px;
        .texts {
          margin: 40px 0 0 0px;
          font-size: 16px;
          font-weight: 700;
        }
        .box-content {
          width: 240px;
          height: 82px;
          color: #333333;
          box-sizing: border-box;
          padding: 15px;
          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
          font-size: 12px;
          margin: 26px 20px 0 0;
          z-index: 10;
          .box-top {
            display: flex;
            justify-content: space-between;
            .box-text {
              width: 190px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .active1 {
              width: 14px;
              height: 14px;
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
            display: flex;
            margin: 16px 0 0 0;
            // span {
            //   font-size: 12px;
            // }
            .audiok {
              width: 20px;
              height: 20px;
              font-size: 14px;
              text-align: center;
              line-height: 20px;
              background-color: #2d72d3;
              border-radius: 50%;
              color: #fff;
              font-size: 12px;
              flex: 2;
            }
            .box-font {
              flex: 19;
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
    }
  }
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
