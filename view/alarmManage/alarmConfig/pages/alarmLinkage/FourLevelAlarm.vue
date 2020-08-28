<template>
  <div class="alarm-tactics">
    <div class="alarm-tactics-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警联动配置</el-breadcrumb-item>
        <el-breadcrumb-item>一级报警</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="alarm-tactics-btn">
      <el-button size="mini"
                 @click="editClick">
        <span class="iconfont">&#xe633;</span>
        编辑
      </el-button>
      <el-button size="mini"
                 @click="print">打印</el-button>
    </div>
    <div class="alarm-tactics-content"
         ref="printDom">
      <p class="tactics-content-title">报警策略配置</p>
      <div class="alarm-tactics-main">
        <div class="tactics-main-row">
          <p>报警名称</p>
          <div class="tactics-main-right">
            <span v-if="editStatus">报警源名称 + 报警类型</span>
            <el-select v-model="alarmNameValue"
                       placeholder="请选择"
                       size="mini"
                       v-if="!editStatus">
              <el-option v-for="item in alarmName"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <el-select v-model="alarmTypeValue"
                       placeholder="请选择"
                       size="mini"
                       v-if="!editStatus">
              <el-option v-for="item in alarmTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>处置流程</p>
          <div class="tactics-main-right textarea">
            <el-input v-if="isStatus!==2"
                      type="textarea"
                      class="textareaStyle"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容"
                      v-model="linkData.process"
                      resize="none"
                      :disabled="editStatus"></el-input>
            <div v-if="isStatus===2"
                 style="min-height: 100px;width: 270px;border-radius: 4px;border: 1px solid #ddddee">{{linkData.process}}</div>
          </div>
        </div>
        <div class="tactics-main-row">
          <p>四级联动配置</p>
          <div class="tactics-main-right level-link-set">
            <div class="row-info">
              <span v-if="isStatus!==2"><i>
                  <el-checkbox v-model="linkData.centerCheck"
                               :disabled="editStatus">中心输出联动</el-checkbox>
                </i></span>
              <span v-if="isStatus===2"
                    style="font-size: 12px">
                <a v-if="linkData.centerCheck"
                   style="font-size: 14px">☑</a>
                <a v-if="!linkData.centerCheck"
                   style="font-size: 18px">□</a>
                <a>中心输出联动</a>
              </span>
<!--              <div class="info-right">-->
<!--                <el-input placeholder="请输入内容"-->
<!--                          v-if="isStatus!==2"-->
<!--                          v-model="textarea2"-->
<!--                          size="mini"-->
<!--                          :disabled="editStatus"></el-input>-->
<!--                <span v-if="isStatus===2">{{textarea2}}</span>-->
<!--              </div>-->
            </div>
            <div class="row-info">
              <span class="row-header"
                    v-if="isStatus!==2"><i>
                  <el-checkbox v-model="linkData.receiveCheck"
                               :disabled="editStatus">接警处置联动</el-checkbox>
                </i></span>
              <span v-if="isStatus===2"
                    style="font-size: 12px">
                <a v-if="linkData.receiveCheck"
                   style="font-size: 14px">☑</a>
                <a v-if="!linkData.receiveCheck"
                   style="font-size: 18px">□</a>
                <a>接警处置联动</a>
              </span>
              <ul>
                <li>
                  <span v-if="isStatus!==2">
                    <el-checkbox v-model="linkData.videoCheck"
                                 :disabled="editStatus">视频复核</el-checkbox>
                  </span>
                  <span v-if="isStatus===2"
                        style="font-size: 12px">
                    <a v-if="linkData.videoCheck"
                       style="font-size: 14px">☑</a>
                    <a v-if="!linkData.videoCheck"
                       style="font-size: 18px">□</a>
                    <a>视频复核</a>
                  </span>
                  <div class="video-set">
                    <div class="info">
                      <i v-if="editStatus">关联摄像机</i>
                      <el-select v-model="linkData.videoCheckTarget"
                                 placeholder="请选择"
                                 size="mini"
                                 v-if="!editStatus">
                        <el-option key="关联摄像机"
                                   label="关联摄像机"
                                   value="关联摄像机"></el-option>
                      </el-select>
                    </div>
                    <el-checkbox v-model="linkData.upVideoCheck"
                                 :disabled="editStatus"
                                 v-if="isStatus!==2">弹出视频复核</el-checkbox>
                    <a v-if="isStatus===2"
                       style="font-size: 12px">
                      <a v-if="linkData.upVideoCheck"
                         style="font-size: 14px">☑</a>
                      <a v-if="!linkData.upVideoCheck"
                         style="font-size: 18px">□</a>
                      <a>视频复核</a>
                    </a>
                  </div>
                </li>
                <li>
                  <span v-if="isStatus!==2">
                    <el-checkbox v-model="linkData.wallAction"
                                 :disabled="editStatus">联动上墙</el-checkbox>
                  </span>
                  <span v-if="isStatus===2"
                        style="font-size: 12px">
                    <a v-if="linkData.wallAction"
                       style="font-size: 14px">☑</a>
                    <a v-if="!linkData.wallAction"
                       style="font-size: 18px">□</a>
                    <a>联动上墙</a>
                  </span>
                  <div class="video-set">
                    <div class="info">
                      <el-select v-model="linkData.wallActionTarget"
                                 placeholder="请选择"
                                 size="mini"
                                 v-if="!editStatus">
                        <el-option key="关联摄像机"
                                   label="关联摄像机"
                                   value="关联摄像机"></el-option>
                      </el-select>
                    </div>
                    <i v-if="editStatus">关联摄像机</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <i v-if="editStatus">{{wallName}}</i>
                    <!-- <el-checkbox v-model="linkData.upVideoCheck" :disabled="editStatus">弹出视频复核</el-checkbox> -->
                    <el-select v-model="linkData.wall"
                               placeholder="请选择"
                               size="mini"
                               v-if="!editStatus">
                      <el-option v-for="item in wallList"
                                 :key="item.id"
                                 :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <span v-if="isStatus!==2">
                    <el-checkbox v-model="linkData.LEDCheck"
                                 :disabled="editStatus">联动LED</el-checkbox>
                  </span>
                  <span v-if="isStatus===2"
                        style="font-size: 12px">
                    <a v-if="linkData.LEDCheck"
                       style="font-size: 14px">☑</a>
                    <a v-if="!linkData.LEDCheck"
                       style="font-size: 18px">□</a>
                    <a>联动LED</a>
                  </span>
                  <div class="video-set">
                    <div v-if="editStatus">{{LED.time}}-{{LED.video}}</div>
                    <div class="info"
                         style="display: flex">
                      <el-select v-model="LED.time"
                                 placeholder="请选择"
                                 size="mini"
                                 v-if="!editStatus">
                        <el-option key="时间"
                                   label="时间"
                                   value="时间"></el-option>
                      </el-select>
                      <el-select v-model="LED.video"
                                 placeholder="请选择"
                                 size="mini"
                                 v-if="!editStatus">
                        <el-option key="关联摄像机"
                                   label="关联摄像机"
                                   value="关联摄像机"></el-option>
                      </el-select>
                    </div>
                  </div>
                </li>
                <li>
                  <span v-if="isStatus!==2">
                    <el-checkbox v-model="linkData.tts"
                                 :disabled="editStatus">TTS播报</el-checkbox>
                  </span>
                  <span v-if="isStatus===2"
                        style="font-size: 12px">
                    <a v-if="linkData.tts"
                       style="font-size: 14px">☑</a>
                    <a v-if="!linkData.tts"
                       style="font-size: 18px">□</a>
                    <a>TTS播报</a>
                  </span>
                  <div class="video-set">
                    <div v-if="editStatus">报警名称</div>
                    <div class="info">
                      <el-select v-model="saveData.ttsContent"
                                 placeholder="请选择"
                                 size="mini"
                                 v-if="!editStatus">
                        <el-option key="报警名称"
                                   label="报警名称"
                                   value="报警名称"></el-option>
                      </el-select>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!--                    <div class="row-info">-->
            <!--                      <span class="row-header"><i><el-checkbox v-model="linkData.receiveCheck" :disabled="editStatus">联动手机app</el-checkbox></i></span>-->
            <!--                      <ul>-->
            <!--                        <li style="width: 100%">-->
            <!--                          <span><el-checkbox v-model="linkData.videoCheck" :disabled="editStatus">视频复核</el-checkbox></span>-->
            <!--                          <div class="video-set">-->
            <!--                            <div class="info"><i>%关联摄像机%</i></div>-->
            <!--                          </div>-->
            <!--                        </li>-->
            <!--                      </ul>-->
            <!--                    </div>-->
          </div>
        </div>
      </div>
    </div>
    <div class=""
         style="text-align: center;width:1000px;">
      <el-button size="mini"
                 type="primary"
                 @click="saveClick"
                 v-show="isStatus===1">保存</el-button>
      <el-button size="mini"
                 type="primary"
                 @click="printClick"
                 v-show="isStatus===2">打印</el-button>
      <el-button size="mini"
                 @click="cancel"
                 v-show="isStatus===1||isStatus===2">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      isStatus: 0,
      textarea2: '',
      editStatus: true,
      alarmNameValue: '报警名称',
      // 报警名称列表
      alarmName: [
        {
          label: '报警名称',
          value: '报警名称'
        }
      ],
      alarmTypeValue: '报警类型',
      // 报警类型列表
      alarmTypeList: [
        {
          label: '报警类型',
          value: '报警类型'
        }
      ],
      // 电视墙列表
      wallList: [
        {
          label: '电视墙1',
          value: 1
        },
        {
          label: '电视墙2',
          value: 2
        }
      ],
      fileList: [],
      voiceValue: '',
      promptTimeValue: '',
      promptTimeStatus: false,
      customizeTime: '',
      promptTimeCheck: false,
      dealInfo: {
        addBtn: false,
        dealList: []
      },
      linkData: {
        centerCheck: true,
        receiveCheck: true,
        videoCheck: true,
        upVideoCheck: true,
        LEDCheck: true,
        voiceCheck: true,
        process: '',
        videoCheckTarget: '关联摄像机',
        tts: '',
        wallAction: false,
        wallActionTarget: '关联摄像机',
        wall: 1,
        id: ''
      },
      btnInfo: '保存',
      LED: {
        time: '时间',
        video: '报警名称'
      },
      saveData: {
        alarmName: '',
        alarmProAction: '',
        appAction: '',
        appContent: '',
        appVideoAction: '',
        id: '',
        ledAction: '',
        ledContent: '报警名称',
        level: 4,
        outputAction: '',
        process: '',
        tts: '',
        ttsContent: '报警名称',
        videoCheck: '',
        videoCheckPopup: '',
        videoCheckTarget: '关联摄像机',
        wall: '',
        wallAction: '',
        wallActionTarget: '关联摄像机'
      }
    }
  },
  watch: {},
  created() {
    this.getAlarmlinkFuc()
    this.getWallFuc()
  },
  computed: {
    wallName: function() {
      let result = this.wallList.filter(item => {
        return item.id === this.linkData.wall
      })
      return (result && result[0] && result[0].name) || ''
    }
  },
  filters: {
    wallName(val) {
      console.log(this)
    }
  },
  methods: {
    ...mapActions(['getAlarmlink', 'putAlarmlink', 'getWall']),
    // 编辑事件
    editClick() {
      this.editStatus = false
      this.isStatus = 1
    },
    // 打印
    print() {
      this.isStatus = 2
      this.editStatus = true
    },
    printClick() {
      // let body = window.document.body.innerHTML
      let template = this.$refs.printDom.innerHTML
      //   document.body.innerHTML = `<div id="printDom-alarm-first">${template}</div>`
      //   window.print()
      //   document.body.innerHTML = body
      this.do_print(`<div id="printDom-alarm-first">${template}</div>`)
    },
    getWallFuc(){
      this.getWall().then(res=>{
        if(res&&res.code ===0){
          this.wallList = res.data.results

        }

      })
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('IFRAME')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;left: -1000px;top: -1000px;background:#fff')
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/levelAlarm.less')
      document.body.appendChild(iframe)
      doc = iframe.contentWindow.document
      doc.head.appendChild(link)
      doc.body.innerHTML = template
      doc.close()
      iframe.contentWindow.focus()
      setTimeout(() => {
        iframe.contentWindow.print()
        document.body.removeChild(iframe)
      }, 600)
    },
    // 保存相应信息
    saveClick() {
      this.putAlarmlinkFuc()
    },
    // 取消保存
    cancel() {
      this.editStatus = true
      this.isStatus = 0
    },
    // 获取参数配置
    getAlarmlinkFuc() {
      let param = {
        level: '4'
      }
      this.getAlarmlink(param).then(res => {
        if (res) {
          this.setConfigData(res.data.results[0])
        }
      })
    },
    // 给参数赋值
    setConfigData(resData) {
      let transBoolean = function(val) {
        if (val === 'T') {
          return true
        } else if (val === 'F') {
          return false
        }
      }
      // this.alarmNameValue = resData.alarmName.split('-')[0]
      // this.alarmTypeValue = resData.alarmName.split('-')[1]
      this.linkData.process = resData.process
      this.linkData.centerCheck = transBoolean(resData.outputAction) // 中心
      this.linkData.receiveCheck = transBoolean(resData.alarmProAction) // 接警处置
      this.linkData.videoCheck = transBoolean(resData.videoCheck) //  视频复核
      this.linkData.upVideoCheck = transBoolean(resData.videoCheckPopup) // 弹出视频复核
      this.linkData.wallAction = transBoolean(resData.wallAction) // 联动上墙
      this.linkData.wallActionTarget = resData.wallActionTarget // 联动上墙
      this.linkData.wall = resData.wall // 联动上墙
      this.linkData.LEDCheck = transBoolean(resData.ledAction) // 联动LET
      this.linkData.tts = transBoolean(resData.tts) // 联动LET
      this.linkData.id = resData.id // 联动LET
    },
    // 保存报警联动
    putAlarmlinkFuc() {
      let transFT = function(val) {
        if (val) {
          return 'T'
        } else {
          return 'F'
        }
      }
      this.saveData.alarmName = this.alarmNameValue + '-' + this.alarmTypeValue
      this.saveData.outputAction = transFT(this.linkData.centerCheck)
      this.saveData.alarmProAction = transFT(this.linkData.receiveCheck)
      this.saveData.process = this.linkData.process
      this.saveData.videoCheck = transFT(this.linkData.videoCheck)
      this.saveData.videoCheckTarget = this.linkData.videoCheckTarget
      this.saveData.videoCheckPopup = transFT(this.linkData.upVideoCheck)
      this.saveData.wallAction = transFT(this.linkData.wallAction)
      this.saveData.wallActionTarget = this.linkData.wallActionTarget
      this.saveData.wall = this.linkData.wall
      this.saveData.ledAction = transFT(this.linkData.LEDCheck)
      this.saveData.ledContent = this.LED.time + '-' + this.LED.video
      this.saveData.tts = transFT(this.linkData.tts)
      this.saveData.ttsContent = this.linkData.ttsContent
      this.saveData.id = this.linkData.id
      this.putAlarmlink(this.saveData).then(res => {
        if (res) {
          this.editStatus = true
          this.getAlarmlinkFuc()
          this.isStatus = 0
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-tactics {
  height: 100%;
  position: relative;
  font-size: 14px;
  margin: 0 10px;
  &-btn {
    overflow: hidden;
    margin: 10px 0;
    button {
      margin-left: 20px;
    }
  }
  &-content {
    width: 1000px;
    overflow: hidden;
    margin-left: 20px;
    .tactics-content-title {
      text-align: center;
      padding: 20px 0;
    }
    .alarm-tactics-main {
      height: 600px;
      overflow: auto;
      .tactics-main-row {
        overflow: hidden;
        background: #f5f7fa;
        position: relative;
        p {
          float: left;
          width: 240px;
          height: 20px;
          text-align: center;
          position: absolute;
          top: 50%;
          margin-top: -10px;
        }
        .tactics-main-right {
          float: left;
          margin: 0 0 0 240px;
          line-height: 28px;
          width: calc(~'100% - 240px');
          border-left: 1px solid #ffffff;
          padding: 5px 0 5px 10px;
          .el-textarea {
            width: 400px;
          }
          .row-info {
            width: 100%;
            overflow: hidden;
            span {
              float: left;
              width: 120px;
              padding: 5px 0 5px 10px;
              /*border-right: 1px solid #d7d7d7;*/
              i {
                float: left;
                width: 120px;
                height: 100%;
                text-align: left;
              }
            }
            .info-right {
              float: left;
              padding: 5px;
            }
            .row-header {
              width: 100%;
              display: block;
              /*background: #d7d7d7;*/
            }
            ul {
              width: 100%;
              overflow: hidden;
              li {
                float: left;
                width: 50%;
                span {
                  /*border-right: 1px solid #d7d7d7;*/
                  text-align: left;
                  padding: 5px 0 5px 10px;
                }
                .video-set {
                  padding: 5px 0 5px 10px;
                  /*border-right: 1px solid #d7d7d7;*/
                  // width: calc(~'100% - 120px');
                  overflow: hidden;
                  .info {
                    float: left;
                    width: 110px;
                  }
                }
              }
            }
          }
        }
      }
      .tactics-back {
        background: #fff;
        border-top: 1px solid #ffffff;
        border-bottom: 1px solid #ffffff;
        /deep/.el-textarea.is-disabled .el-textarea__inner {
          background: #fff;
        }
      }
      .level-link-set {
        background: #f5f7fa;
        padding: 0 !important;
      }
    }
    .alarm-tactics-btn {
      margin: 20px 0;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
.tactics-main-row .textarea .el-textarea__inner {
  height: 200px !important;
  min-height: 200px;
}
.video-set .el-input {
  width: 100px;
}
.tactics-main-row .row-info .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #333333;
}
</style>
<style lang="less">
</style>
<style>
.textareaStyle .el-textarea__inner{
      color: #333333 !important;
      font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Tahoma, 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', '\5FAE\8F6F\96C5\9ED1', 'WenQuanYi Micro Hei', Arial, sans-serif;
    }
</style>