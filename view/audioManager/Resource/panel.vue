<template>
  <div>
    <div class="text">
      <span class="groupname">话筒</span>
    </div>
    <!-- 话筒列表 -->
    <div class="block">
      <el-carousel height="220px" :autoplay="false">
        <el-carousel-item v-for="num in  Math.ceil(microphone_list.length/6) || 1 " :key="num">
          <div class="right-aisle-box" v-show="!isShowTable">
            <!-- index == 0 本机话筒 其他话筒 -->
            <div class="box-content" v-for="(item, index) in microphone_list.slice((num-1)*6,6*num)" :key="index">
              <div class="box-msg">
                <div class="equipment-name">{{item.name}}</div>

                <!-- 本机通话状态 -->
                <div v-if="num==1 && index == 0" style="height:45px;">
                  <div class="stateLine">
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
                    <Time v-show="item.runStatus == 5" :time="time" ref="headerChildHT" style="margin-left:10px;"></Time>
                  </div>
                </div>
                <div v-else>
                  <div class="stateLine" style="height:30px;">
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
                    <Time v-show="item.runStatus == 5" :time="time" ref="headerChildHT" style="margin-left:10px;"></Time>
                  </div>
                </div>

                <div class="stateLine" v-if="num==1 && index == 0">
                  <p style="font-size:12px;font-weight:blod;">本机话筒</p>
                </div>
                <div class="stateLine" v-else></div>
                
                <div v-if="num==1 && index == 0"></div>
                <div v-else>
                  <el-button
                    v-if="item.runStatus == 2 || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus || !seqId"
                    :disabled="noMac || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus"
                    size="mini"
                    @click="voiceTalkback(item,index)"
                    class="btn"
                  >语音对讲</el-button>

                  <el-button
                    v-else
                    :disabled="noMac || item.runStatus == 1"
                    size="mini"
                    @click="stopTalkback(item,index)"
                    class="btn"
                  >关闭对讲</el-button>

                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- <div class="underline"></div> -->
    <div class="text">
      <span class="groupname">对讲面板</span>
    </div>
    <!-- 对讲面板 列表 -->
    <div class="addition">
      <div
        class="box-content"
        v-for="(item,index) in audioList"
        :key="item.id"
        @mouseover.self="delShow($event)"
        @mouseleave.self="delHide($event)"
      >
        <div class="box-top">
          <div class="box-text">{{item.name}}</div>
          <div class="item" content placement="top-end" v-show="false">
            <span id="deleId" v-show="false">&#xe638;</span>
          </div>
        </div>
        <div class="box-buttom">
          <!-- <span class="icon iconfont audiok">&#xe65e;</span> -->
          <i></i>

          <span class="box-font">{{item.orgName || '无数据'}}>{{item.keyPartName ||'无数据'}}>设备</span>
        </div>
        <div div class="stateLine">
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
          <span>&#8195;&#8195;</span>
          <Time v-show="item.runStatus == 5" :time="time" ref="headerChild"></Time>
        </div>
        <span class="begin">
          <el-button
            class="btn"
            :disabled="noMac || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus"
            v-if="item.runStatus == 2 || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus  || !seqId"
            size="mini"
            style="margin:4px -5px 0px 2px;"
            @click="beginTalkback(item,index)"
          >开始对讲</el-button>
          <el-button
            class="btn"
            :disabled="noMac || item.runStatus == 1 || item.runStatus == 7 || !item.runStatus"
            v-else
            size="mini"
            style="margin:4px -5px 0px 2px;"
            @click="stopTalkback(item,index)"
          >停止对讲</el-button>
          <el-button class="btn" size="mini" @click="linkEquipment(item,index)">关联控制</el-button>
        </span>
      </div>
    </div>

    <!-- 关联控制  弹框 -->
    <el-dialog
      :title="titleName"
      :visible.sync="dialogVisible"
      width="1115px"
      custom-class="dialog-message"
      :before-close="handleClose"
      top="12vh"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-dialogDrag>
      <span slot="title" class="dialog-footer">
        <span>关联控制</span>
      </span>
      <iframe v-if="dialogVisible"
        style="width:100%;height: 100%;position:absolute;top:0;left: 0;z-index: -2;border: none;"
      ></iframe>

      <div class="videoCon" v-if="dialogVisible">
        <div class="videoLeft">
          <preview-plugin :defaultPane="defaultPane"
                          :iconShow="iconShowParams"
                          @changeDefaultPane="changeDefaultPane"
                          :pluginIconShow="pluginIconShow"
                          :moduleType="4"
                          :isNeedModal="false"
                          ref="preview"></preview-plugin>
        </div>
        <div class="videoRight">
          <div class="rightContent">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="视频通道" name="1">
                <div class="isBor" v-for="(item, index) in video" :key="index">
                  <i class="el-icon-video-camera"></i>
                  <span @click="preview(item)">{{ item.name }}</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="门禁通道" name="2">
                <div v-for="(item, index) in guard" :key="index" class="name">
                  <div>
                    <i class="el-icon-refrigerator"></i>
                    <span>{{item.name}}</span>
                  </div>
                  <div class="btns">
                    <el-button size="mini" @click="openDoor(item,index)" :disabled="item.status==1">开门</el-button>
                    <el-button size="mini" @click="closeDoor(item,index)" :disabled="item.status==2">关门</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="对讲通道" name="3">
                <div v-for="(item, index) in audio" :key="index" class="name">
                  <div>
                    <i class="el-icon-microphone"></i>
                    <span>{{item.name}}</span>
                  </div>
                  <div>
                     <!-- :disabled="noMac || item.runStatus == 1 || !item.runStatus" -->
                    <el-button size="mini" @click="startTalking(item,index)" :disabled="noMac || item.runStatus != 2">
                      <span v-if="item.runStatus == 5">对讲中</span>
                      <span v-else>开始对讲</span>
                    </el-button>
                    <el-button size="mini">
                      <span @click="stopTalking(item,index)" :disabled="noMac">停止对讲</span>
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>

              <el-collapse-item title="输出通道" name="4">
                <div v-for="(item, index) in output" :key="index" class="name">
                  <div>
                    <i class="el-icon-location-outline"></i>
                    <span>{{item.name}}</span>
                  </div>
                  <div>
                    <el-button size="mini" :disabled="item.status==2">
                      <span @click="alarmAccessOpen(item,index)">开启</span>
                    </el-button>
                    <el-button size="mini" :disabled="item.status==1">
                      <span @click="alarmAccessClose(item,index)">关闭</span>
                    </el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="equipment-details-wrap">
          <!-- 此设备详细信息 -->
          <div class="equipment-details">
            <div class="equipment-title">
              <span>{{ guanlianData.data.name }}</span>
                <el-button
                  class="btn"
                  size="mini"
                  :disabled="noMac || guanlianData.data.runStatus == 1 || !guanlianData.data.runStatus"
                  style="float:right;height: 25px;line-height: 0px;margin-left:8px;"
                  plain
                  @click="stopTalkback(guanlianData.data,guanlianData.index)"
                >停止对讲</el-button>

                <el-button
                  class="btn"
                  size="mini"
                  :disabled="noMac || guanlianData.data.runStatus == 1 || !guanlianData.data.runStatus"
                  style="float:right;height: 25px;line-height: 0px;"
                >
                  <span v-if="guanlianData.data.runStatus == 1">离线</span>
                  <span v-else-if="guanlianData.data.runStatus == 2" @click="beginTalkback(guanlianData.data,guanlianData.index)">开始对讲</span>
                  <span v-else-if="guanlianData.data.runStatus == 3">呼出</span>
                  <span v-else-if="guanlianData.data.runStatus == 4">响铃</span>
                  <span v-else-if="guanlianData.data.runStatus == 5">对讲中</span>
                  <span v-else-if="guanlianData.data.runStatus == 6">广播中</span>
                  <span v-else>未知状态</span>
                </el-button>

            </div>
            <div class="equipment-content">
              <div class="equipment-content-item">
                所属机构：{{ guanlianData.data.orgName }}
              </div>
              <div class="equipment-content-item">
                所属重点部位：{{ guanlianData.data.keyPartName }}
              </div>
              <div class="equipment-content-item">
                所属设备：{{ guanlianData.data.deviceName }}
              </div>
              <div class="equipment-content-item">
                资源名称：{{ guanlianData.data.name }}
              </div>
              <div class="equipment-content-item">
                品牌：{{ guanlianData.data.brand }}       
              </div>
              <div class="equipment-content-item">  
                型号：{{ guanlianData.data.modelNum }}     
              </div>
            </div>
          </div>
          <!-- <el-button size="mini" type="primary" class="close-btn" @click="dialogVisible=false">关闭</el-button> -->
        </div>
        <!-- 对讲按钮 -->
        <!-- <div class="dui-jiang">
          <div class>
            <span class="begin">
              <el-button
                class="btn"
                size="mini"
                style="margin:4px -5px 0px 2px;"
                @click="guanlianpeizhi($event)"
              >
                <span v-if="guanlianData.data">{{!guanlianData.data.show?"开始对讲":'对讲中'}}</span>
              </el-button>
              <el-button
                class="btn"
                size="mini"
                style="margin:4px -5px 0px 2px;"
                plain
                @click="guanlianStop($event)"
              >停止对讲</el-button>
            </span>
          </div>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import {
  getGainInstitutionApi,
  postMacGetApi,
  getStatue,
  getStatueNew,
  getNowStatus,
  getRuntimeStatue,
  linkageConfiguration,
  openDoor,
  closeDoor,
} from '../../../http/audio/resource'
import { updateaudiologApi } from '../../../http/audioManage/audiolog.api'
import { audioLink, stopTalking } from '@src/http/InterlockingDoor/linkedAirlockLog.api'
import { openVideo, offVideo, alarmoutput, ctlalarmoutput, alarmoutputs, closeAlarmoutputs  } from '@src/http/access/event'

import { getAlarmoutputs } from '@src/http/protectiveCabin/channe.api'

import { mapActions, mapState, mapMutations } from 'vuex'

import previewPlugin from '@src/view/videoManage/preview/school/previewPlugin'
// import previewPlugin from "./AirlockControl"
import Time from './../radioMessage/theNewTimer'
export default {
  props: ['audioList', 'mydecveInfo'],
  components: {
    // equipment
    previewPlugin,
    Time,
  },
  data() {
    return {
      noMac:false,// 未绑定mac地址
      isMessage: [],
      guanlianData: {
        data: null,
        index: 0,
      },
      //时间
      time: 0,
      titleName: '',
      video: [], //视频列表
      audio: [], //音频列表
      guard: [], //门禁列表
      output: [], //输出列表
      dialogVisible: false,
      defaultPane: 4, // 默认显示4窗格
      iconShowParams: [
        { type: 'left', index: 0, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 1, name: 'Videotape' }, // 录像
        { type: 'left', index: 2, name: 'Speech' }, // 对讲
        { type: 'left', index: 3, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 4, name: 'Volume' }, // 声音
        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        {
          type: 'right',
          name: 'MultiScreen',
          index: 1
        }, // 画面分割
        { type: 'right', index: 2, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 3, name: 'Stream' }, // 码流切换
        {
          type: 'right',
          name: 'StopAll',
          index: 4
        }, {
          type: 'right',
          name: 'Stop',
          index: 5
        } // 关闭预览
      ],
      pluginIconShow: {
        showBottomIcon: true, // 图标按钮条
        // hidemenuIcon: true, // 隐藏
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
        // videoCheckIcon: true, // 视频复核
        detailsIcon: true, // 详情
        quanpingfangdaIcon: true // 全屏
      },
      mydecveInfo1: [ ], // 本机话筒数据
      returned: '', //返回的值
      obj: null,
      // 弹框
      isShowControl: false,
      seqId: '',
      this_item:{},  //当前正在对讲中的对讲设备
      this_index:'', // 当前正在对讲中的 设备 索引值

      stops: true,
      stop: false,
      record: true,
      records: false,
      activeNames: ['1', '2', '3', '4'],
      fn: null,
      dialogVisible: false,

      Index: 0,
      dialogFormVisible: false,
      voiceImg: '../../../static/protectiveCabin/u20.png',
      doorImg: '../../../static/protectiveCabin/u21.png',
      isShowTable: false,
      protectiveCabinNum: 6,
      someOne: 1,
      noOne: 1,
      offline: 1,

      aisleTableData: [],
      panel: [],
      gridData: [],
    }
  },
  computed:{
    microphone_list(){
       // 将本机话筒从 话筒列表中删掉
        var ower_obj = this.mydecveInfo1;
        var mydecveInfo = this.mydecveInfo;
        var list = [];
        mydecveInfo.forEach( (item) => {
          if(ower_obj.hostUniqueId == item.uniqueId){
            ower_obj.runStatus = item.runStatus;
          }else{
            list.push(item);
          }
        })
        // var list = this.mydecveInfo.filter( (item) => {
        //   return ower_obj.hostUniqueId != item.uniqueId
        // });

        // 将本机话筒 添加到 话筒列表第一位
        list.unshift(ower_obj);
        return list;
    }
  },

  methods: {
    // 切换画面
    changeDefaultPane(val) {
      this.defaultPane = val
    },

    // 关联控制 - 点击视频 播放
    preview(val) {
      console.log(val)
      let data = {
        channle: val.serise,
        devIp: val.deviceIp,
        devCport: val.devicePort,
        // devDport: val.port,
        // streamType: 'sub1',
      }
      this.$refs.preview.openPreview(data)
    },

    //开启对讲 (关联 对讲 控制)
    startTalking(item, index) {
      console.log(item)
      const h = this.$createElement;
      if (this.seqId) {
        _this.$notify({
          title: '',
          message: h('i', { style: 'color: teal' }, '对讲中~~~'),
        })
        return false;
      };
      console.log(globalConfig)

      // 获取当前设备的运行状态 ，根据状态 进行下边的业务操作
      // 如果 非空闲 则 提示相对应 的消息 停止发起对讲
      var params ={
        deviceId:item.deviceId,  // 对讲主机主键id
        channleSerise:item.serise,  // 通道号
      };
      getRuntimeStatue(params).then(statusRes => {
        console.log(statusRes)
        if(statusRes.data.code == 0){
          // 获取成功
          // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
          var status = statusRes.data.data.status;
          item.runStatus =status;
          if(status == 1){
            this.$message({
              message: '设备已经离线',
              type: 'warning'
            });
            return false;
          }else if(status == 2){
            var params = {
              myMikeId : JSON.parse(globalConfig.callerInfo).k_id,  // 本机绑定台麦 主键 id
              calledpanelIds : item.id,  //  被叫面板id（通道主键id）可以传多个
            }
            openVideo(params).then( res => {
              if(res.data.code == 0){
                console.log(res)
                // this.audio[index].status = 1
                item.runStatus = 5;
                this.seqId = res.data.data.seqId;
                localStorage.setItem('seqId',seqId);
              }
            }).catch( error => {

            })
          }else if(status == 3){
            this.$message({
              message: '设备正在呼出中',
              type: 'warning'
            });
            return false;
          }else if(status == 4){
            this.$message({
              message: '设备正在响铃中',
              type: 'warning'
            });
            return false;
          }else if(status == 5){
            this.$message({
              message: '设备正在对讲中',
              type: 'warning'
            });
            return false;
          }else if(status == 6){
            this.$message({
              message: '设备正在广播中',
              type: 'warning'
            });
            return false;
          }

        }
      }).catch( error => {
        console.log(error);
      });
      
    },

    //关闭对讲 (关联 对讲 控制)
    stopTalking(item, index) {
      var params = {
        myMikeId : JSON.parse(globalConfig.callerInfo).k_id,  // 本机绑定台麦 主键 id
        // calledpanelIds : item.id,  //  被叫面板id（通道主键id）可以传多个
        seqId:this.seqId,  //对讲id（当对讲开启的时候会有返回）
      }
      
      offVideo(params).then( res => {
        if(res.data.code == 0){
          // item.status = 2;
          // this.$set(this.audio,index,item);
          // this.audio[index].status = 2
          item.runStatus = 2;
          this.seqId = '';
          localStorage.setItem('seqId','');
        }
      }).catch( error => {

      })
      
    },

    //开门 (关联 门禁 控制)
    openDoor(item, index) {
      var obj = {
        guardId: item.id,
        // resClass:2
      }
      // console.log(item, 'openDoor')
      openDoor(obj).then((res) => {
        if (res.data.data.code == 0) {
          this.guard[index].status = 1;
          this.$message({
            message: '开门成功',
            type: 'success',
          });
        } else {
          this.$message(res.data.data.message);
        }
      })
    },

    //关门 (关联 门禁 控制)
    closeDoor(item, index) {
      // console.log(item, 'closeDoor')
      var obj = {
        guardId: item.id,
      }
      closeDoor(obj).then((res) => {
        if (res.data.data.code == 0) {
          this.guard[index].status = 2;
          this.$message({
            message: '关门成功',
            type: 'success',
          })
        } else {
          this.$message(res.data.data.message)
        }
      })
    },

    //报警开启 (关联 输出通道 控制)
    alarmAccessOpen(item, index) {
      if (item.subSystem == 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: true }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('开启成功!')
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem == 2) {
        // 获取警铃实时状态
        getAlarmoutputs({
          devIp: item.deviceIp,
          devPort: item.devicePort,
          channelList: [Number(item.serise)],
        }).then((res) => {
          var status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
          item.status = status;
          this.$set(this.output,index,item);
        })
        //报警输出通道
        alarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then((res) => {
          if (res.data.code == 0) {
            this.$messageSuccess('开启成功!')
            item.status = 2;
            this.$set(this.output,index,item);
            // this.output[index].status = 2
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
            this.output[index].status = 1
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },

    //报警关闭 (关联 输出通道 控制)
    alarmAccessClose(item, index) {
      if (item.subSystem === 1) {
        //视频输出通道
        alarmoutput({ deviceId: item.id, outputs: [{ serise: item.serise, isOpen: false }] }).then((res) => {
          if (res.data.code == '0') {
            this.$messageSuccess('关闭成功!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      } else if (item.subSystem === 2) {
        //报警输出通道
        closeAlarmoutputs({ devIp: item.deviceIp, devPort: item.devicePort, outputNo: Number(item.serise) }).then((res) => {
          if (res.data.code == 0) {
            this.$messageSuccess('关闭成功!')
            // this.output[index].status = 2
            getAlarmoutputs({
              devIp: item.deviceIp,
              devPort: item.devicePort,
              channelList: [Number(item.serise)],
            }).then((res) => {
              var status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
              item.status = status;
              this.$set(this.output,index,item);
            })
            
            // this.output[index].status = res.data.data.results.channelList[0].status === 'close' ? 1 : 2
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
            this.$messageSuccess('通道关闭!')
            this.output[index].status = 2
          } else {
            this.$messageError(res.data.data.message)
          }
        })
      }
    },
    
    // 获取关联设备信息
    linkEquipment(item, index) {
      var _this = this
      _this.dialogVisible = true
      // _this.titleName = item.name
      _this.titleName = '关联控制';
      // debugger
      _this.guanlianData = {
        data: item,
        index: index
      }
      // this.isMessage = item.list
      // console.log(this.isMessage)
      // $.getJSON('/api/resource/v1/guard/linkage/85?ref=1',function(data){
      //   console.log('getJson',data)
      // })
      linkageConfiguration(item.id, { ref: '2' }).then((res) => {
        // debugger
        if (res.data.code === 0) {
          // 关联摄像头
          var videoList = res.data.data.video;
          _this.video = videoList;

          // 关联门禁通道
          var guardList = res.data.data.guard;
          _this.guard = guardList;
          
          // 关联对讲通道 
          var audioList = res.data.data.audio;
          audioList.forEach( (item) => {
            item.runStatus = 2;
          })
          _this.audio = audioList;

          // 关联输出通道
          var outputList = res.data.data.output;
          _this.output = outputList;
          if(outputList && outputList != ''){
            outputList.forEach( (item,index) => {
              if (item.subSystem === 2) {
                getAlarmoutputs({
                  devIp: item.deviceIp,
                  devPort: item.devicePort,
                  channelList: [Number(item.serise)],
                }).then((res) => {
                  if (res.data.data.code === '0') {
                    var status = res.data.data.results.channelList[0]
                    .status === 'close' ? 1 : 2;
                    item.status = status;
                    this.$set(_this.output,index,item);
                    // _this.output[index].status = status
                  }
                })
              }
            })
          }

          // 打开关联控制 弹窗 ，如果 设备有 关联的摄像机 自动播放 摄像机
          if(res.data.data.video && res.data.data.video != ''){
            // 如果此设备有关联摄像头,加载关联信息弹窗之后 轮训开始自动播放
            videoList.forEach( (item) => {
              this.preview(item);
            })
          }
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

    handleChange(val) {
      // console.log(val)
    },

    handleNodeClick(data) {
      console.log(data)
    },

    // 查询对讲状态 state 为true 查询台麦信息
    getAudionStatue(item, state) {
      console.log(item)
      var callerData = JSON.stringify(globalConfig.calledInfo)
      var req = {
        serverPort: item.platformPort,
        serverIp: item.platformIp,
        callerPanel: state ? 0 : parseInt(item.uniqueId), // 台麦 0
        callerId: state ? item.uniqueId : item.hostUniq,
      }
      //1：离线2：空闲3：呼出4：响铃5：对讲中6广播中
      return getStatue(req)
    },

    // 根据本机mac 地址 获取跟本机mac地址进行绑定的设备信息
    macGetmacGet() {
      var _this = this
      var macAddress = sessionStorage.getItem('macAddress')
       console.log(macAddress)
      if (macAddress === 'false') {
        return false
      }
      console.log("macAddress")
      var macs = JSON.parse(macAddress).adaptors
      var macStr = []
      macs.forEach((item) => {
        macStr.push(item.mac)
      })
      console.log('macs', macs, macStr)

      postMacGetApi({
        mac: macStr.join(','),
      }).then(
        (res) => {
        if (res.status == 201 && JSON.stringify(res.data.data) != "{}") {
          console.log(res.data.data)
          globalConfig.serverIp = res.data.data.platformIp
          globalConfig.serverPort = res.data.data.platformPort
          globalConfig.serverId = res.data.data.platformUniqueId
          globalConfig.hostName = res.data.data.hostName
          globalConfig.status=res.data.data.hostSatus;    // 主机状态 是否在线 1 在线 2离线 3 未知
          globalConfig.runStatus=res.data.data.hostRunStatus;    // runStatus运行状态  1离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中

          globalConfig.callerInfo = JSON.stringify({
            k_id:res.data.data.id,   // 主键id
            id: res.data.data.hostUniqueId,
            ip: res.data.data.hostIp,
            port: res.data.data.hostPort,
          })

          // 本机绑定的话筒设备
          var ower_obj = {
             name:globalConfig.hostName,
             status:globalConfig.status,
             runStatus : globalConfig.runStatus,
             serverIp:globalConfig.serverIp,
             serverPort:globalConfig.serverPort,
             hostUniqueId:res.data.data.hostUniqueId,
             id:res.data.data.id,
           };
           _this.mydecveInfo1 = ower_obj;
          console.log('globalConfig111111111111', globalConfig, res.data.data);
          } else {
            this.$alert('您的终端未绑定台麦', '提示', {
              confirmButtonText: '确定',
              type:"warning"
            });
           _this.noMac=true
          
          }
        },
        (rej) => {
        }
      )
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
    deleteEqui(data) {
      if (!data.show) {
        this.audioList.some((item, i) => {
          if (item.id == data.id) {
            this.audioList.splice(i, 1)
            if (this.audioList.length) {
              this.isGroup = true
              this.isTitle = false
            } else {
              this.isGroup = false
              this.isTitle = true
            }
            return true
          }
        })
      }
    },

    isShowAisleTable() {
      this.isShowTable = !this.isShowTable
    },

    loadStart() {},
    // 话筒语音对讲事件
    // 关闭台麦
    closeVociie(item) {
      item.show = !item.show
    }, 
    
    //台麦开启
    voiceTalkback(item, index) {
      // 开启话筒对讲接口
      var _this = this
      
      // 根据组号 判断是否在对讲中
      if (_this.seqId) {
        // alert('对讲中')
        const h = this.$createElement;
        _this.$notify({
          title: '',
          message: h('i', { style: 'color: teal' }, '对讲中~~~'),
        })
        return false;
      }

      this.this_item = item;
      this.this_index = index;

      // 获取当前设备的运行状态 ，根据状态 进行下边的业务操作
      // 如果 非空闲 则 提示相对应 的消息 停止发起对讲
      var params ={
        deviceId:item.id,  // 对讲主机主键id
      };
      getRuntimeStatue(params).then(statusRes => {
        console.log(statusRes)
        if(statusRes.data.code == 0){
          // 获取成功
          // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
          var status = statusRes.data.data.status;
          item.runStatus =status;
          if(status == 1){
            this.$message({
              message: '设备已经离线',
              type: 'warning'
            });
            return false;
          }else if(status == 2){
            var req = {
              serverId: globalConfig.serverId,
              serverIp: globalConfig.serverIp,
              serverPort: globalConfig.serverPort,
              callerInfo: globalConfig.callerInfo,
              callerName: globalConfig.hostName,
              calledName:item.name
            }
            req.mikeInfo = JSON.stringify([
              {
                id: item.uniqueId, //        //对讲设备id
                ip: item.ip, //对讲设备ip
                port: item.port,
              },
            ])
            
            var statusInfo = ['离线', '空闲', '呼出', '响铃', '对讲中', '广播中']
            //台麦
            _this.postOpenVoicetube(req).then(
              (res) => {
                if (!res.data.data) {
                  return
                } else {
                  // 开启台麦对讲成功
                  
                  _this.seqId = res.data.data.seqId;
                  localStorage.setItem('seqId', _this.seqId);

                  // 更新界面 设备状态
                  // 更新单个 开启对讲设备的 运行状态
                  // item.show = !item.show
                  item.runStatus = 4;

                  //  更新 本机mac地址绑定的 设备 运行状态
                  _this.mydecveInfo1.runStatus = 4;

                  // _this.$refs['headerChildHT'][index-1].start() //time
                }
              },
              (rej) => {
              }
            )
          }else if(status == 3){
            this.$message({
              message: '设备正在呼出中',
              type: 'warning'
            });
            return false;
          }else if(status == 4){
            this.$message({
              message: '设备正在响铃中',
              type: 'warning'
            });
            return false;
          }else if(status == 5){
            this.$message({
              message: '设备正在对讲中',
              type: 'warning'
            });
            return false;
          }else if(status == 6){
            this.$message({
              message: '设备正在广播中',
              type: 'warning'
            });
            return false;
          }

        }
      }).catch( error => {
        console.log(error);
      });
      
    },

    // 对讲面板点击事件
    // 开始对讲
    beginTalkback(item, index) {
      // type 为1 关联控制 对讲开启
      const h = this.$createElement
      let _this = this
      var statusInfo = ['离线', '空闲', '呼出', '响铃', '对讲中', '广播中']

      if (_this.seqId) {
        const h = this.$createElement;
        _this.$notify({
          title: '',
          message: h('i', { style: 'color: teal' }, '对讲中~~~'),
        })
        return false;
      }

      this.this_item = item;
      this.this_index = index;

      // 获取当前设备的运行状态 ，根据状态 进行下边的业务操作
      // 如果 非空闲 则 提示相对应 的消息 停止发起对讲
      var params ={
        deviceId:item.deviceId,  // 对讲主机主键id
        channleSerise:item.serise,  // 通道号
      };
      getRuntimeStatue(params).then(statusRes => {
        console.log(statusRes)
        if(statusRes.data.code == 0){
          // 获取成功
          // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
          var status = statusRes.data.data.status;
          item.runStatus =status;
          if(status == 1){
            this.$message({
              message: '设备已经离线',
              type: 'warning'
            });
            return false;
          }else if(status == 2){
            let callObj = {
              hostIp: item.hostIp,
              hostPort: parseInt(item.hostPort),
              hostId: item.hostUniq,
              id: parseInt(item.uniqueId),
            }

            var obj = {
              serverId: globalConfig.serverId,
              serverIp: globalConfig.serverIp,
              serverPort: globalConfig.serverPort,
              callerInfo: globalConfig.callerInfo,
              calledInfo: JSON.stringify([callObj]),
              callerName: globalConfig.hostName,
              calledName:item.name
            }
            _this.postOpenVoicetube(obj).then(
              (res) => {
                if (!res.data.data) {
                  // 开启对讲失败
                  _this.$notify({
                    title: '',
                    message: h('i', { style: 'color: teal' }, res.data.message + '开启对讲失败'),
                  })
                  return
                } else {
                  // debugger
                  console.log('开启对讲成功')
                  // console.log('kaiqi-start', item)
                  _this.obj = { seqId: res.data.data.seqId }
                  _this.seqId = res.data.data.seqId
                  localStorage.setItem('seqId', _this.seqId)
                  // 更新界面 设备状态

                  // 更新单个 开启对讲设备的 运行状态
                  // console.log(item.show)
                  // item.show = !item.show
                  // item.runStatus = 4;
                  this.audioList[index].runStatus = 4;

                  //  更新 本机mac地址绑定的 设备 运行状态
                  this.microphone_list[0].runStatus = 3;
                  // _this.mydecveInfo1.runStatus = 4;

                  item.show = true
                  _this.audioList[index].show = true
                  _this.$set(_this.audioList, _this.audioList)
                  // _this.$refs['headerChild'][index].start() //time
                }
              },
              (rej) => {
                _this.$notify({
                  title: '',
                  message: h('i', { style: 'color: teal' }, JSON.stringify(rej)),
                })
              }
            )
            
            
          }else if(status == 3){
            this.$message({
              message: '设备正在呼出中',
              type: 'warning'
            });
            return false;
          }else if(status == 4){
            this.$message({
              message: '设备正在响铃中',
              type: 'warning'
            });
            return false;
          }else if(status == 5){
            this.$message({
              message: '设备正在对讲中',
              type: 'warning'
            });
            return false;
          }else if(status == 6){
            this.$message({
              message: '设备正在广播中',
              type: 'warning'
            });
            return false;
          }

        }
      }).catch( error => {
        console.log(error);
      });

    },

    // 关闭  对讲面板/台麦 正在进行的 对讲
    stopTalkback(item, val) {
      console.log(item,val)
      const h = this.$createElement
      let _this = this
      var seqId = localStorage.getItem('seqId')

      this.this_item = {};
      this.this_index = '';

      console.log(seqId)
      if (!_this.seqId) {
        // this.$notify({
        //   title: '',
        //   message: h('i', { style: 'color: teal' }, '请打开对讲后操作,error:缺少seqId参数'),
        // })
        return false;
      }
      var obj = {
        seqId: seqId,
        serverIp: globalConfig.serverIp,
        serverPort: globalConfig.serverPort,
      }
      console.log(obj)
      console.log(item.tierType)
      if (item.tierType == 'equ') {
        // 关闭台麦
        // _this.$refs['headerChildHT'][val-1].stop() //time
        // let timeInfo = _this.$refs['headerChildHT'][val].getTimeInfo()
        // var timeInfo = '';
        // obj.mikeInfo = JSON.stringify([
        //   {
        //     ip: item.ip,
        //     port: item.port,
        //     id: item.id,
        //   },
        // ])
        _this.postCloseTalkbac(obj).then(
          (res) => {
            console.log(res, '关闭台麦')

            if (!res.data.data) {
              _this.$notify({
                title: '',
                message: h('i', { style: 'color: teal' }, res.data.message),
              })
              return
            } else {
              _this.seqId = ''
              localStorage.setItem('seqId', '')
              // 更新界面 设备状态

              // 更新单个 开启对讲设备的 运行状态
              console.log(item.show)
              // item.show = !item.show
              item.runStatus = 2;

              //  更新 本机mac地址绑定的 设备 运行状态
              this.microphone_list[0].runStatus = 2;

              //  更新 本机mac地址绑定的 设备 运行状态
              // _this.mydecveInfo1.runStatus = 2;
              // _this.macGetmacGet();

              // item.show = !item.show
            }
          },
          (rej) => {
          }
        )
      } else {
        // 关闭面板
        //
        // _this.$refs['headerChild'][val].stop() //time
        // let timeInfo = _this.$refs['headerChild'][val].getTimeInfo()
        // var timeInfo = '';
        // console.log(timeInfo)
        this.postCloseTalkbac(obj).then(
          (res) => {
            // console.log(res, '关闭对讲')
            if (!res.data.data) {
              // 关闭失败
              this.$notify({
                title: '',
                message: h('i', { style: 'color: teal' }, res.data.message),
                position: 'top-right',
              })
              return
            } else {
              // 关闭成功
              _this.obj = ''
              _this.seqId = ''
              // debugger
              localStorage.setItem('seqId', '')
              // 更新界面 设备状态

              // 更新单个 开启对讲设备的 运行状态
              console.log(item.show)
              // item.show = !item.show
              item.runStatus = 2;

              //  更新 本机mac地址绑定的 设备 运行状态
              this.microphone_list[0].runStatus = 2;

              //  更新 本机mac地址绑定的 设备 运行状态
              // _this.mydecveInfo1.runStatus = 2;
              // _this.macGetmacGet();

              // item.show = false
              // _this.audioList[val].show = false
              // _this.$set(_this.audioList, _this.audioList)
              // _this.$emit("update:changlist",{index:val,state:false})

              if (_this.guanlianData.data) _this.guanlianData.data.show = false
            }
          },
          (rej) => {
            // console.log(res, 215454545)
          }
        )
      }

      // console.log('_this.audioList[index].show', item)
      // item.show = false;jh h ukh j jkhjhjkvhjkhjjkhsdkjhgjkdfh vhsdvk bkhd jk
      // console.log(obj)

      // if (!this.seqId) {
      //   console.log('没有获取对讲id')
      //   return ''
      // }
    },

    guanlianpeizhi(e) {
      var item = this.guanlianData.data
      var index = this.guanlianData.index
      this.beginTalkback(e, item, index)
    },
    guanlianStop(e) {
      var item = this.guanlianData.data
      var index = this.guanlianData.index
      this.stopTalkback(item, index)
    },

    close(callBack) {
      this.dialogVisible = false
      this.handleClose(callBack)
    },

    // 接入 websoket 
    // 接到 设备关闭的推送消息 然后查询页面中 对讲中的设备 ，如果推送中的设备已经关闭 ，更新对讲中的设备状态为空闲
    // getSoket(){
    //   socket.on('alarmGuardAirlock', (data) => {
    //     let obj = { ...data.alarmInfo, dispose: data.dispose, personInfo: data.personInfo }
    //     // this.alarmTable.push(data.alarmInfo)
    //     // this.policeTotal = this.alarmTable.length
    //   })
    //   socket.on('eventGuardAirlock', (data) => {
    //     let obj = { ...data.alarmInfo, dispose: data.dispose, personInfo: data.personInfo }
    //     // this.eventTable.push(data.alarmInfo)
    //     // this.eventTotal = this.eventTable.length
    //   })
    // },

    //关弹框
    ShowControl() {
      this.isShowControl = false
    },
    handleClose(done) {
      this.fn = done
      // console.log(done)
      this.dialogVisible = false
      if (!this.dialogVisible) done()
    },
    ...mapActions('resource', {
      postBeginTalkback: 'postBeginTalkback',
      postCloseTalkbac: 'postCloseTalkbac',
      postOpenVoicetube: 'postOpenVoicetube',
      getFrequency: 'getFrequency',
      getAppointPlatform: 'getAppointPlatform',
      postOpenTheneDoor: 'postOpenTheneDoor',
      postCloseTheneDoor: 'postCloseTheneDoor',
      postRelevance: 'postRelevance',
    }),

    // 设置一个定时器 来定时更新 设备的运行状态(组件销毁时 定时器 需要销毁)
    runUpStatusTimer(){
      var timer = setInterval( () => {
        // 判断 是否开始对讲 如果开始对讲
        var seqId = localStorage.getItem('seqId');  // 对讲组号， 如果存在，则说明正在对讲中
        // console.log(seqId)  
        // if((this.microphone_list || this.audioList) && seqId != '')
        if(this.microphone_list || this.audioList){
          // 如果当前界面存在 设备 并且存在对讲组、
          console.log('设备状态轮训')
          var video_list = this.microphone_list;
          var pan_list = this.audioList;
          
          // 循环话筒
          for(let i=0;i<video_list.length;i++){
            // 循环判断当前设备是否在 对讲中 是：执行状态更新
            // if(video_list[i].runStatus == 4 || video_list[i].runStatus == 5){
              // 获取 需要轮训 状态的 设备列表（话筒），即 设备的 运行状态是对讲中的设备
              var params = {
                deviceId:video_list[i].id
              };
              getRuntimeStatue(params).then(res => {
                // console.log(res)
                if(res.data.code == 0){
                  // 获取成功
                  var status = res.data.data.status;

                  // 判断当前话筒是否是本机话筒
                  if(video_list[i].hostUniqueId && status != 4 && status != 5){
                    // 本机
                    // 证明本机已经挂断
                    // 判断对讲结束
                    // 清除 对讲号
                    localStorage.setItem('seqId','');
                    this.seqId = "";
                    // 关闭设备的时间
                    video_list.forEach( (item,index) => {
                      if(item.runStatus == 5){
                        console.log(index)
                        this.$refs['headerChildHT'][index].stop();
                      }
                    })
                    // if(Array.isArray(this.$refs['headerChild'])){
                    //   this.$refs['headerChildHT'].forEach((item) => {
                    //     item.stop()
                    //   })
                    // }else{
                    //   this.$refs['headerChildHT'].stop();
                    // }
                  }

                  // 开启(关闭) 本设备的时间
                  if(video_list[i].runStatus != 5 && status == 5 && seqId != ''){
                    this.$refs['headerChildHT'][i].start();
                  }else if(video_list[i].runStatus != 5 && status != 5){
                    this.$refs['headerChildHT'][i].stop();
                  }

                  // 更新 设备的 运行状态
                  video_list[i].runStatus = status;
                  
                  // this.microphone_list[i].runStatus = res.data.data.status;
                }
              }).catch( error => {
                console.log(error);
              });
            // } 
          }

          // 循环面板
          for(let i=0;i<pan_list.length;i++){
            // 循环判断当前设备是否在 对讲中 是：执行状态更新
            // if(pan_list[i].runStatus == 4 || pan_list[i].runStatus == 5){
              // 获取 需要轮训 状态的 设备列表（面板），即 设备的 运行状态是对讲中的设备
              var params = {
                deviceId:pan_list[i].deviceId,  // 对讲主机主键id
                channleSerise:pan_list[i].serise,  // 通道号
              };
              getRuntimeStatue(params).then(res => {
                // console.log(res)
                if(res.data.code == 0){
                  // 获取成功
                  // 更新 设备的 运行状态
                  var status = res.data.data.status;
                  // 开启(关闭) 本设备的时间
                  if(pan_list[i].runStatus != 5 && status == 5 && seqId != ''){
                    this.$refs['headerChild'][i].start();
                  }else if(pan_list[i].runStatus != 5 && status != 5){
                    this.$refs['headerChild'][i].stop();
                  }

                  // 更新 面板 设备的 运行状态
                  pan_list[i].runStatus = status;

                }
              }).catch( error => {
                console.log(error);
              });
            // }
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
    var _this = this
    _this.macGetmacGet()
    // 获取音频平台列表
    _this.seqId = localStorage.getItem('seqId')
    // console.log( _this.seqId)
    this.getFrequency({ type: 4 }).then(
      (res) => {
        // console.log(res, '获取音频平台')
        let ary = []
        // console.log('获取音频平台列表', res)
        // this.panel=ary
        _this.loadStart()
      },
      (rej) => {
        // console.log(res, '获取音频平台')
      }
    )
    
  },

  
  mounted() {
    this.handleClose(() => {})
    // this.getSoket();
    this.runUpStatusTimer();
  },

  beforeDestroy(){
    // console.log('销毁组件')
    this.clearUpStatusTimer();   // 销毁定时任务

    this.$refs['headerChildHT'].forEach((item,index) => {
      item.stop();
    })

    this.$refs['headerChild'].forEach((item,index) => {
      item.stop();
    })

    // 如果当前 存在 对讲组 关闭对讲组
    if (this.seqId) {
     
      // this.$refs['headerChildHT'][i].stop();
      var this_item = this.this_item;
      var this_index = this.this_index;
      this.stopTalkback(this_item,this_index);
    }
  },
  destroyed(){},

  
}
</script>

<style lang="less" scoped>
.isBor span {
  cursor: pointer;
}
.timer {
  margin-top: 2px;
}
.dui-jiang {
  position: absolute;
  width: 200px;
  height: 45px;
  bottom: -43px;
}
.videoCon {
  // border: 1px solid red;
  overflow: hidden;
  font-family: fantasy;

  .videoLeft {
    position: relative;
    z-index: 199;
    overflow: hidden;
    // width: 80%;
    width: 829px;
    height: 600px;
    // border: 1px solid yellow;
    // display: inline-block;
    float: left;
    margin-right: 20px;
    .videoContent {
      text-align: center;
      line-height: 250px;
      height: 250px;
      // background: violet;
    }
    .iconList {
      text-align: center;
      // height: 50px;
      // line-height: 50px;
      padding: 10px 0;
      .iconBox {
        .iconItem {
          display: inline-block;
          margin: 0 10px;
        }
      }
    }
    .videoItem {
      float: left;
      width: 450px;
      height: 290px;
      // border: 1px solid turquoise;
      margin: 5px;
      background: #fff;
    }
  }
  .videoFooter {
    margin-top: 20px;
    float: left;
    height: 130px;
    width: 100%;
    background: #fff;
    // width: 700px;
    div {
      margin: 10px;
      height: 100px;
      list-style: none;
      overflow: hidden;
      text-align: center;
      ul {
        width: 800px;
        height: 100px;
        margin-left: 50px;
        li {
          width: 50%;
          float: left;
          text-align: left;
          line-height: 20px;
        }
      }
    }
  }
  .videoRight {
    overflow: auto;
    // width: 18%;
    width: 225px;
    // overflow: hidden;
    height: 600px;
    background: #fff;
    float: left;
    // padding: 0 10px;
    /deep/ .el-collapse-item__content .isBor {
      border-bottom: 1px solid #e6e6e6;
    }
    /deep/ .el-collapse-item__content .isBor:last-child {
      border-bottom: none;
    }
    /deep/ .el-collapse-item__content div {
      // padding-left: 10px;
      padding: 5px 10px;
    }
    /deep/ .el-collapse-item__header {
      padding-left: 10px;
      border-bottom: 2px solid #e6e6e6;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 0 !important;
    }
    .rightContent {
      // overflow-y: auto;
    }
    .btns {
      border-bottom: 1px solid #e6e6e6;
    }
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.stateLine {
  padding: 0 0 0 10px;
  margin: 10px 0;
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
.addition {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  // width: 1560px;
  margin-top:5px;
  .texts {
    margin: 40px 0 0 0px;
    font-size: 20px;
    font-weight: 700;
  }
  .stateLine {
    padding: 0 0 0 10px;
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
  .box-content {
    width: 240px;
    // height: 82px;
    color: #333333;
    box-sizing: border-box;
    padding: 15px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
    font-size: 12px;
    margin: 0px 20px 26px 0;
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
.right-aisle-box {
  display: flex;
  flex: 1 1 360px;
  flex-wrap: wrap;
  overflow-y: auto;
  height: 200px;
  padding-left:1px;
  padding-top:5px;
  .box-content {
    width: 230px;
    min-height: 153px;
    max-height: 153px;
    color: #333333;
    box-sizing: border-box;
    padding: 15px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
    font-size: 12px;
    margin: 0px 20px 0 0;
    z-index: 10;
    .imgs {
      width: 40px;
    }
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
      .btn {
        margin: 30px -8px 1px 20px;
        width: 77px;
        height: 27px;
      }
    }
  }
  .box-content2{
    border-bottom:5px solid #2D72D3;
  }
}
.equipment-name{
  width:100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.underline {
  margin: 20px 0 20px;
  left: 0px;
  top: 0px;
  width: 1499px;
  height: 3px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(204, 204, 204, 1);
  border-radius: 0px;
}
.right-aisle-talkback {
  height: 180px;
  display: flex;
  flex: 1 1 360px;
  flex-wrap: wrap;
  overflow-y: auto;
  .box-content {
    border-radius: 5px 5px 5px 5px;
    margin: 2px 10px;
    width: 175px;
    height: 109px;
    border: 1px solid #bcbcbc;
    display: flex;
    justify-content: space-around;
    .box-msg {
      div {
        .text {
          width: 55px;
          height: 40px;
          margin: -38px 34px -5px 42px;
        }
      }
      span {
        text-align: center;
        display: block;
        /deep/ .btn {
          width: 76px;
          height: 26px;
        }
      }
    }
  }
}
.record {
  width: 169px;
  height: 20px;
  border: 1px solid black;
  margin-top: 4px;

  .recordStyle {
    width: 145px;
    height: 10px;
    margin-left: 25px;
    margin-top: 5px;
  }
}

//弹框
#blockView {
  width: 1100px;
  height: 700px;
  border: 3px solid #cccccc;
  background: #fff;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  .top {
    font-size: 24px;
    width: 100%;
    height: 60px;
    display: inline-block;
    line-height: 60px;
    border-bottom: 1px solid #000;
    text-align: center;
    font-weight: 800;
    position: relative;
    .dialog-footer {
      display: inline-block;
      width: 50px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border: 1px solid #ccc;
      border-radius: 35px;
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 18px;
    }
  }
  .videoCon {
    width: 100%;
    .videoLeft {
      width: 80%;
      height: 635px;
      float: left;
      margin-right: 20px;
      .videoContent {
        text-align: center;
        line-height: 200px;
        height: 200px;
        // background: violet;
      }
      .iconList {
        text-align: center;
        padding: 10px 0;
        .iconBox {
          .iconItem {
            display: inline-block;
            margin: 0 10px;
          }
        }
      }
      .videoItem {
        float: left;
        width: 50%;
        height: 250px;
        border-bottom: 1px solid turquoise;
        padding: 10px;
        background: #fff;
      }
      .videoFooter {
        margin-top: 10px;
        width: 100%;
        height: 125px;
        background: #fff;
        h3 {
          margin: 30px 80px;
        }
        .detailed {
          display: flex;
          margin-left: 80px;
          .detailedLeft {
            font-size: 14px;
            line-height: 20px;
          }
          .detailedRight {
            margin-left: 200px;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }

    .videoRight {
      border-left: 2px solid green;
      overflow: auto;
      width: 18%;
      height: 630px;
      background: #fff;
      float: left;
      /deep/ .el-collapse-item__content .isBor {
        border-bottom: 1px solid #e6e6e6;
      }
      /deep/ .el-collapse-item__content .isBor:last-child {
        border-bottom: none;
      }
      /deep/ .el-collapse-item__content div {
        // padding-left: 10px;
        padding: 5px 10px;
      }
      /deep/ .el-collapse-item__header {
        padding-left: 10px;
        border-bottom: 2px solid #e6e6e6;
      }
      /deep/ .el-collapse-item__content {
        padding-bottom: 0 !important;
      }

      .btns {
        border-bottom: 1px solid #e6e6e6;
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
    .dialog-footer {
      width: calc(~'100% - 16px');
    }
  }
  .el-dialog__body {
    position: relative;
    z-index: 99;
    height: calc(~'100% - 54px');
    padding: 0;
    margin-top: -10px;
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

/deep/ .el-carousel__button {
  background: #d3dce6;
}

/deep/ .el-carousel__item {
  background: white !important;
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
  .text {
    // height: 35px;
    // margin-top: 10px;
    .groupname {
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      border-left: 2px solid #2d72d3;
      padding-left: 3px;
      padding-right: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.equipment-details-wrap{
  clear: both;
  position: relative;
  .close-btn{
    position: absolute;
    right: 30px;
    bottom:30px;
  }
}
.equipment-details{
  
  width: 829px;
  font-size: 12px;
  color: #333333;
  border-top:1px solid #E4E7ED;
  padding-bottom: 30px;
}
.equipment-details .equipment-title{
  line-height: 14px;
  margin:10px 0;
  padding:0 10px ;
  border-left:2px solid #2D72D3;
  line-height: 25px;
  overflow: hidden;
}

.equipment-details .equipment-content{
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
}
.equipment-details .equipment-content-item{
  width:25%;
  line-height: 20px;
}
</style>


