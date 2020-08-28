<template>
  <div class="alarm-tactics">
    <div class="alarm-tactics-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警策略配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="alarm-tactics-btn-header">
      <el-button size="mini"
                 @click="editClick">编辑</el-button>
      <el-button size="mini"
                 @click="print">打印</el-button>
    </div>
    <div class="alarm-tactics-content"
         ref="printDom"
         v-if="isStatus===2">
      <p class="tactics-content-title">报警策略配置</p>
      <div class="alarm-tactics-main">
        <div class="tactics-main-row">
          <p>发送策略</p>
          <div class="tactics-main-right">
            <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px">{{sendValue | sendValueFiler}}</div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警颜色</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in colorList"
                 :key="index"
                 class="alarm-voice"
                 style="height: 30px">
              <i>{{item.name}}：</i>
              <div style="width: 240px;height: 24px;margin-left:80px;-webkit-print-color-adjust: exact;border: 1px solid "
                   :style="{background:item.color,borderColor:item.color}"></div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row">
          <p>报警提示声音</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in voiceList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <span style="font-size: 12px">
                <a v-if="item.checked"
                   style="font-size: 14px">☑</a>
                <a v-if="!item.checked"
                   style="font-size: 18px">□</a>
                <a>启用</a>
              </span>
              <div class="voice-upload"
                   style="position: relative;float:left">
                <!--                <el-input v-model="item.voiceValue" :disabled="true" size="mini"></el-input>-->
                <div style="width: 210px;height: 24px;border: 1px solid #ddddee;
                border-radius: 4px;padding: 0 10px;line-height: 24px;display: inline-block;float: left;margin:0 15px">{{item.autioUrl | autioUrl}}</div>

                <!-- controls="controls" -->
                <div style="position: absolute;top:0;z-index: 1;width: 25px;height: 25px;right:93px;overflow: hidden"
                     v-if="isStatus!==2">
                  <audio :src="item.autioUrl"
                         autoplay
                         controls
                         style="position: absolute;left: -15px;top: -12px"></audio>
                </div>
                <el-button size="small"
                           v-if="isStatus===2"
                           type="primary"
                           @click="getImageTypeIndex(index)"
                           :disabled="editStatus">选择文件</el-button>
                <el-upload action="/api/v1/alarm-manage/upload"
                           v-if="isStatus!==2"
                           :on-preview="handlePreview"
                           :on-exceed="handleExceed"
                           :headers="uploadParam"
                           :before-upload="beforeAvatarUpload"
                           :on-success="handleAvatarSuccess"
                           :limit="1"
                           accept
                           :show-file-list="false"
                           style="float:left">
                  <el-button size="small"
                             type="primary"
                             :disabled="editStatus">选择文件</el-button>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警未处理升级时间（秒）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in upgradeList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span style="font-size: 12px">
                  <a v-if="item.checked"
                     style="font-size: 14px">☑</a>
                  <a v-if="!item.checked"
                     style="font-size: 18px">□</a>
                  <a>启用</a>
                </span>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;margin-left: 55px;padding: 0 10px;line-height: 24px">{{item.upgradeTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警处理超时升级时间（分）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in preupgradeList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span style="font-size: 12px">
                  <a v-if="item.checked"
                     style="font-size: 14px">☑</a>
                  <a v-if="!item.checked"
                     style="font-size: 18px">□</a>
                  <a>启用</a>
                </span>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;margin-left: 55px;padding: 0 10px;line-height: 24px">{{item.preupgradeTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="tactics-main-row tactics-back">
          <p>事件提醒提示类自动处理时间</p>
          <div class="tactics-main-right">
            <span style="font-size: 12px">
              <a v-if="promptTimeCheck"
                 style="font-size: 14px">☑</a>
              <a v-if="!promptTimeCheck"
                 style="font-size: 18px">□</a>
              <a>启用</a>
            </span>
            <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px">{{promptTimeValue}}</div>
          </div>
        </div> -->
        <div class="tactics-main-row">
          <p>报警后录像和预录时间（秒）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in videoList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span style="font-size: 12px">
                  <a v-if="item.videoChecked"
                     style="font-size: 14px">☑</a>
                  <a v-if="!item.videoChecked"
                     style="font-size: 18px">□</a>
                  <a>启用</a>
                </span>
                <div style="width: 200px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 55px;" class="printStyle">{{item.videoTime}}</div>
              </div>
              <div class="voice-upload">
                <span style="font-size: 12px">
                  <a v-if="item.checked"
                     style="font-size: 14px">☑</a>
                  <a v-if="!item.checked"
                     style="font-size: 18px">□</a>
                  <a>启用</a>
                </span>
                <div style="width: 200px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 55px;" class="printStyle">{{item.preVideoTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>处理类型</p>
          <div class="tactics-main-right">
            <span>
              <!-- <span style="font-size: 12px">
                <a v-if="armReason.reasonCheck"
                   style="font-size: 14px">☑</a>
                <a v-if="!armReason.reasonCheck"
                   style="font-size: 18px">□</a>
                <a>启用</a>
              </span> -->
              <el-button size="mini"
                         @click="addReasonClick"
                         :disabled="armReason.addBtn || editStatus">添加预设原因</el-button>
            </span>
            <div class="add-row">
              <div v-for="(item, index) in armReason.reasonList"
                   :key="index"
                   class="add-row-input">
                <i>{{item.name}}</i>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 5px;display: inline-block">{{item.dealTypeValue}}</div>
                 <i>批量处理</i>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 5px;display: inline-block">{{item.dealStatus}}</div>

              </div>
            </div>
          </div>
        </div>
        <!-- 需求新加 -->
        <div class="tactics-main-row">
          <p>工单类型</p>
          <div class="tactics-main-right">
            <span>
              <!-- <span style="font-size: 12px">
                <a v-if="bypassReason.reasonCheck"
                   style="font-size: 14px">☑</a>
                <a v-if="!bypassReason.reasonCheck"
                   style="font-size: 18px">□</a>
                <a>启用</a>
              </span> -->
              <el-button size="mini"
                         @click="addBypassClick"
                         :disabled="bypassReason.addBtn || editStatus">添加预设原因</el-button>
            </span>
            <div class="add-row">
              <div v-for="(item, index) in bypassReason.reasonList"
                   :key="index"
                   class="add-row-input">
                <i>{{item.name}}</i>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 5px;display: inline-block">{{item.dealTypeValue}}</div>
                 <i>批量处理</i>
                <div style="width: 240px;height: 24px;border: 1px solid #ddddee;border-radius: 4px;padding: 0 10px;line-height: 24px;margin-left: 5px;display: inline-block">{{item.dealStatus}}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="alarm-tactics-content"
         ref="printDom"
         v-if="isStatus!==2">
      <p class="tactics-content-title">报警策略配置</p>
      <div class="alarm-tactics-main">
        <div class="tactics-main-row">
          <p>发送策略</p>
          <div class="tactics-main-right">
            <el-select v-model="sendValue"
                       placeholder="请选择"
                       size="mini"
                       :disabled="editStatus">
              <el-option v-for="item in sendList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警颜色</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in colorList"
                 :key="index"
                 class="alarm-voice"
                 style="height: 30px">
              <i>{{item.name}}：</i>
              <el-color-picker v-model="item.color"
                               size="small"
                               :disabled="editStatus"
                               v-if="isStatus!==2"></el-color-picker>
              <div v-if="isStatus===2"
                   style="width: 240px;height: 24px;margin-left:60px;border: 1px solid "
                   :style="{background:item.color,borderColor:item.color}"></div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row">
          <p>报警提示声音</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in voiceList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <span>
                <el-checkbox v-model="item.checked"
                             v-if="isStatus!==2"
                             :disabled="editStatus">启用</el-checkbox>
              </span>
              <span v-if="isStatus===2"> <input type="checkbox"
                       :checked="item.checked"
                       class="checkbox"
                       disabled>启用</span>
              <div class="voice-upload"
                   @click="getImageTypeIndex(index)"
                   style="position: relative">
                <el-input v-model="item.autioUrl"
                          :disabled="true"
                          size="mini"></el-input>
                <!-- controls="controls" -->
                <div style="position: absolute;top:0;z-index: 1;width: 25px;height: 25px;right:93px;overflow: hidden">
                  <audio :src="item.autioUrl"
                         autoplay
                         controls
                         style="position: absolute;left: -15px;top: -12px"></audio>
                </div>
                <el-upload action="/api/alarm-manage/v1/upload"
                           :on-preview="handlePreview"
                           :on-exceed="handleExceed"
                           :headers="uploadParam"
                           :before-upload="beforeAvatarUpload"
                           :on-success="handleAvatarSuccess"
                           :limit="1"
                           accept
                           :show-file-list="false"
                           style="float:left">
                  <el-button size="small"
                             type="primary"
                             :disabled="editStatus">选择文件</el-button>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警未处理升级时间（秒）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in upgradeList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span>
                  <el-checkbox v-model="item.checked"
                               v-if="isStatus!==2"
                               :disabled="editStatus">启用</el-checkbox>
                </span>
                <span v-if="isStatus===2"> <input type="checkbox"
                         :checked="item.checked"
                         class="checkbox"
                         disabled>启用</span>
                <el-input v-model="item.upgradeTime"
                          size="mini"
                          :disabled="editStatus"
                          type="number"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>报警处理超时升级时间（分）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in preupgradeList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span>
                  <el-checkbox v-model="item.checked"
                               v-if="isStatus!==2"
                               :disabled="editStatus">启用</el-checkbox>
                </span>
                <span v-if="isStatus===2"> <input type="checkbox"
                         :checked="item.checked"
                         class="checkbox"
                         disabled>启用</span>
                <el-input v-model="item.preupgradeTime"
                          size="mini"
                          :disabled="editStatus"
                          type="number"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row">
          <p>报警后录像和预录时间（秒）</p>
          <div class="tactics-main-right">
            <div v-for="(item, index) in videoList"
                 :key="index"
                 class="alarm-voice">
              <i>{{item.name}}：</i>
              <div class="voice-upload">
                <span>
                  <el-checkbox v-model="item.videoChecked"
                               v-if="isStatus!==2"
                               :disabled="editStatus">启用</el-checkbox>
                </span>
                <span v-if="isStatus===2"> <input type="checkbox"
                         :checked="item.videoChecked"
                         class="checkbox">启用</span>
                <el-input v-model="item.videoTime"
                          size="mini"
                          :disabled="editStatus"
                          type="number"></el-input>
              </div>
              <div class="voice-upload">
                <span>
                  <el-checkbox v-model="item.checked"
                               v-if="isStatus!==2"
                               :disabled="editStatus">启用</el-checkbox>
                </span>
                <span v-if="isStatus===2"> <input type="checkbox"
                         :checked="item.checked"
                         class="checkbox">启用</span>
                <el-input v-model="item.preVideoTime"
                          size="mini"
                          :disabled="editStatus"
                          type="number"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="tactics-main-row tactics-back">
          <p>处理类型</p>
          <div class="tactics-main-right">
            <span>
              <!-- <el-checkbox v-model="armReason.reasonCheck"
                           v-if="isStatus!==2"
                           :disabled="editStatus">启用</el-checkbox>
              <span v-if="isStatus===2"> <input type="checkbox"
                       :checked="armReason.reasonCheck"
                       class="checkbox">启用</span> -->
              <el-button size="mini"
                         @click="addReasonClick"
                         :disabled="armReason.addBtn || editStatus">增加处理类型</el-button>
            </span>
            <div class="add-row">
              <div v-for="(item, index) in armReason.reasonList"
                   :key="index"
                   class="add-row-input">
                <i>{{item.name}}</i>
                <el-input v-model="item.dealTypeValue"
                          size="mini"
                          style="width: 200px;margin-left: 10px"
                          clearable
                          @change="change($event)"
                          :disabled="editStatus"></el-input>
                 <i>批量处理</i>
                <el-select v-model="item.dealStatus"
                       placeholder="请选择"
                       size="mini"
                       :disabled="editStatus">
                  <el-option label="是" value="T"></el-option>
                  <el-option label="否" value="F"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <!-- 需求新加 -->
        <div class="tactics-main-row">
          <p>工单类型</p>
          <div class="tactics-main-right">
            <span>
              <!-- <el-checkbox v-model="bypassReason.workOrderType"
                           v-if="isStatus!==2"
                           :disabled="editStatus">启用</el-checkbox>
              <span v-if="isStatus===2"> <input type="checkbox"
                       :checked="bypassReason.reasonCheck"
                       class="checkbox"
                       disabled>启用</span> -->
              <el-button size="mini"
                         @click="addBypassClick"
                         :disabled="bypassReason.addBtn || editStatus">增加工单类型</el-button>
            </span>
            <div class="add-row">
              <div v-for="(item, index) in bypassReason.reasonList"
                   :key="index"
                   class="add-row-input">
                <i>{{item.name}}</i>
                <el-input v-model="item.dealTypeValue"
                          size="mini"
                          style="width: 200px;margin-left: 10px"
                          clearable
                          @change="change($event)"
                          :disabled="editStatus"></el-input>
                <i>批量处理</i>
                <el-select v-model="item.dealStatus"
                       placeholder="请选择"
                       size="mini"
                       :disabled="editStatus">
                  <el-option label="是" value="T"></el-option>
                  <el-option label="否" value="F"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div style="width: 1000px; height: 32px;display:flex;margin-top:10px;margin-left:20px;"
         v-if="!editStatus">
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入时间：</div>
        <div style='flex:1;line-height:32px;text-align:center'>{{saveObj.time}}</div>
      </div>
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入机构：</div>
        <div style='flex:1;line-height:32px;text-align:center'>{{saveObj.org}}</div>
      </div>
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入人：</div>
        <div style='flex:1;line-height:32px;text-align:center'>{{saveObj.person}}</div>
      </div>
    </div>
    <div class="alarm-tactics-btn">
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
import moment from 'moment'
export default {
  data() {
    return {
      uploadParam: {},
      saveObj: {
        time: moment().format('YYYY-MM-DD HH:mm'),
        org: '保定分行',
        person: '张三'
      },
      uploadImageType: 0,
      isStatus: 0, // 在何种状态下
      configId: '',
      editStatus: true,
      sendValue: 1,
      deviceremindTime: 20,
      sendList: [
        {
          label: '群发',
          value: 1
        },
        {
          label: '循环',
          value: 2
        }
      ],
      colorList: [
        {
          name: '一级报警',
          color: '#409EFF'
        },
        {
          name: '二级报警',
          color: '#409EFF'
        }
      ],
      voiceList: [
        {
          name: '一级报警',
          checked: false,
          upgradeTime: '',
          voiceValue: '',
          autioUrl: ''
        },
        {
          name: '二级报警',
          checked: false,
          upgradeTime: '',
          voiceValue: '',
          autioUrl: ''
        }
      ],
      fileList: [],
      voiceValue: '',
      autioUrl: '',
      preupgradeList: [
        {
          name: '一级报警',
          checked: false,
          preupgradeTime: ''
        },
        {
          name: '二级报警',
          checked: false,
          preupgradeTime: ''
        }
      ],
      upgradeList: [
        {
          name: '一级报警',
          checked: false,
          upgradeTime: ''
        },
        {
          name: '二级报警',
          checked: false,
          upgradeTime: ''
        }
      ],

      // 事件提醒提示类自动处理时间
      // 5分钟、10分钟、20分钟、30分钟、40分钟、50分钟、60分钟
      promptTimeList: [
        {
          value: 5,
          label: '5s'
        },
        {
          value: 10,
          label: '10s'
        },
        {
          value: 20,
          label: '20s'
        },
        {
          value: 30,
          label: '30s'
        },
        {
          value: 100,
          label: '100s'
        },
        {
          value: '自定义',
          label: '自定义'
        }
      ],
      promptTimeValue: 5,
      promptTimeStatus: false,
      customizeTime: '',
      promptTimeCheck: true,
      videoList: [
        {
          name: '一级报警',
          checked: true,
          videoChecked: true,
          videoTime: '120',
          preVideoTime: '10'
        },
        {
          name: '二级报警',
          checked: true,
          videoChecked: true,
          videoTime: '120',
          preVideoTime: '10'
        }
      ],
      // 布撤防原因
      armReason: {
        reasonCheck: true,
        addBtn: false,
        reasonList: []
      },
      // 旁路原因
      bypassReason: {
        reasonCheck: true,
        addBtn: false,
        reasonList: []
      }
    }
  },
  watch: {},
  created() {
    this.getPolicyConfigurationFuc()
    this.uploadParam.Authorization = JSON.parse(sessionStorage.getItem('user')).token
  },
  filters:{
    sendValueFiler(val){
      if (val === 1) {
        return "群发"
      } else {
        return "循环"
      }
    },
    autioUrl(val){
      return val.split("/")[val.split("/").length - 1]
    }
  },
  methods: {
    ...mapActions('equipmentConfigManagement', {
      getPolicyConfiguration: 'getPolicyConfiguration',
      putPolicyConfiguration: 'putPolicyConfiguration'
    }),
    getImageTypeIndex(index) {
      this.uploadImageType = index
    }, // 先在data里定义下，此处省略定义},
    print() {
      this.isStatus = 2
      this.editStatus = true
    },
    printClick() {
      let template = this.$refs.printDom.innerHTML
      //   document.body.innerHTML = `<div id="printDom-alarm-tactics">${template}</div>`
      //   window.print()
      //   document.body.innerHTML = body
      this.do_print(`<div id="printDom-alarm-tactics">${template}</div>`)
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('iframe')
      var doc = null
      iframe.setAttribute(
        'style',
        'position:absolute;width:1000px;height:800px;left: 1000px;top: 1000px;background:#fff'
      )
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/alarmTacics.less')
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
    // 编辑事件
    editClick() {
      this.isStatus = 1
      this.editStatus = false
      this.promptTimeStatus = false
    },
    change(e) {
      this.$forceUpdate()
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
      const isWav = file.type === 'audio/wav' || file.type === 'audio/WAV'
      if (!isWav) {
        this.$message.error('上传文件格式只能是WAV格式!')
      }
      return isWav
    },
    // 上传成功
    handleAvatarSuccess(res, file, fileList) {
      if (!res) {
        return
      }

      this.voiceList[this.uploadImageType].autioUrl = res.data && res.data.path
      console.log(this.voiceList)
      //   console.log('上传成功', res, file, fileList)
      // this.voiceValue = file.name
    },
    // 事件提醒提示类自动处理时间选择
    promptTimeSelect(val) {
      if (val === '自定义') {
        this.promptTimeStatus = true
      } else {
        this.promptTimeStatus = false
      }
    },
    // 添加处理类型
    addReasonClick() {
      let data = '处理类型' + (this.armReason.reasonList.length + 1)
      this.armReason.reasonList.push({
        name: data,
        reason: ''
      })
    },
    // 添加工单类型
    addBypassClick() {
      let data = '工单类型' + (this.bypassReason.reasonList.length + 1)
      this.bypassReason.reasonList.push({
        name: data,
        reason: ''
      })
    },

    // 保存相应信息
    saveClick() {
      this.editStatus = true
      let data = this.setPolicyConfigurationDataSave()
      if (this.configId) {
        data.id = this.configId
      }
      this.putPolicyConfiguration(data).then(res => {
        if (res) {
          this.getPolicyConfigurationFuc()
          this.isStatus = "";
        }
      })
    },
    cancel() {
      this.editStatus = true
      this.isStatus = "";
    },
    // 获取策略配置列表
    getPolicyConfigurationFuc() {
      this.getPolicyConfiguration().then(res => {
        if (res) {
          this.setPolicyConfigurationData(res.data.results[0])
        }
      })
    },
    // 获取列表数据后赋值
    setPolicyConfigurationData(resData) {
      let transBoolean = function(val) {
        if (val === 'T') {
          return true
        } else if (val === 'F') {
          return false
        }
      }
      this.configId = resData.id
      this.sendValue = Number(resData.sendStrategy)
      // 颜色
      this.colorList[0].color = resData.color1
      this.colorList[1].color = resData.color2

      // 提示声音
      this.voiceList[0].autioUrl = resData.soundFile1
      this.voiceList[0].checked = transBoolean(resData.sound1)
      this.voiceList[1].autioUrl = resData.soundFile2
      this.voiceList[1].checked = transBoolean(resData.sound2)

      // 报警未处理升级时间
      this.upgradeList[0].upgradeTime = Number(resData.unproUpTime1)
      this.upgradeList[0].checked = transBoolean(resData.unproUp1)
      this.upgradeList[1].upgradeTime = Number(resData.unproUpTime2)
      this.upgradeList[1].checked =transBoolean(resData.unproUp2)

      // 报警处理超时升级时间
      this.preupgradeList[0].preupgradeTime = Number(resData.proTimeoutUp1)
      this.preupgradeList[0].checked = transBoolean(resData.proUpTime1)
      this.preupgradeList[1].preupgradeTime = Number(resData.proTimeoutUp2)
      this.preupgradeList[1].checked = transBoolean(resData.proUpTime2)

      // 事件提醒提示类自动处理时间
      this.promptTimeCheck = Boolean(parseInt(resData.eventAutoPro))
      this.promptTimeValue = parseInt(resData.eventAutoProTime)
      this.customizeTime = parseInt(resData.eventAutoProTime)
      // 报警后录像和预录时间（秒）
      this.videoList[0].videoChecked = transBoolean(resData.record1)
      this.videoList[0].videoTime = Number(resData.recordTime1) || ''
      this.videoList[0].checked = transBoolean(resData.prerecord1)
      this.videoList[0].preVideoTime = Number(resData.prerecordTime1)
      this.videoList[1].videoChecked = transBoolean(resData.record2)
      this.videoList[1].videoTime = Number(resData.recordTime2) || ''
      this.videoList[1].checked = transBoolean(resData.prerecord2)
      this.videoList[1].preVideoTime = Number(resData.prerecordTime2)
      // 远程布撤防
      // this.armReason.reasonCheck = transBoolean(resData.armReasonOn)
      this.armReason.reasonList = JSON.parse(resData.alarmType)
      // this.dealInfo.dealList = JSON.parse(resData.processType)
      this.bypassReason.reasonList = (resData.workOrderType && JSON.parse(resData.workOrderType)) || []
      // this.bypassReason.reasonCheck = transBoolean(resData.bypassReasonOn)
      console.log(this.videoList)
    },
    // 更新保存修改后的数据
    setPolicyConfigurationDataSave() {
      let transFT = function(val) {
        if (val) {
          return 'T'
        } else {
          return 'F'
        }
      }
      let resData = {}
      resData.sendStrategy = this.sendValue
      // 颜色
      resData.color1 = this.colorList[0].color
      resData.color2 = this.colorList[1].color

      // 提示声音
      resData.soundFile1 = this.voiceList[0].autioUrl
      resData.sound1 = transFT(this.voiceList[0].checked)
      resData.soundFile2 = this.voiceList[1].autioUrl
      resData.sound2 = transFT(this.voiceList[1].checked)

      // 报警未处理升级时间
      resData.unproUpTime1 = Number(this.upgradeList[0].upgradeTime)
      resData.unproUp1 = transFT(this.upgradeList[0].checked)
      resData.unproUpTime2 = Number(this.upgradeList[1].upgradeTime)
      resData.unproUp2 = transFT(this.upgradeList[1].checked)

      // // 报警处理超时升级时间 proTimeoutUp1
      // this.preupgradeList[0].preupgradeTime = Number(resData.proTimeoutUp1)
      // this.preupgradeList[0].checked = Boolean(parseInt(resData.ProUpTime1))
      // this.preupgradeList[1].preupgradeTime = Number(resData.proTimeoutUp2)
      // this.preupgradeList[1].checked = Boolean(parseInt(resData.ProUpTime2))

      // 报警处理超时升级时间
      resData.proTimeoutUp1 = Number(this.preupgradeList[0].preupgradeTime)
      resData.ProUpTime1 = transFT(this.preupgradeList[0].checked)
      resData.proTimeoutUp2 = Number(this.preupgradeList[1].preupgradeTime)
      resData.ProUpTime2 = transFT(this.preupgradeList[1].checked)
      // 报警后录像和预录时间（秒）
      resData.record1 = transFT(this.videoList[0].videoChecked)
      resData.recordTime1 = Number(this.videoList[0].videoTime)
      resData.prerecord1 = transFT(this.videoList[0].checked)
      resData.prerecordTime1 = Number(this.videoList[0].preVideoTime)
      resData.record2 = transFT(this.videoList[1].videoChecked)
      resData.recordTime2 = Number(this.videoList[1].videoTime)
      resData.prerecord2 = transFT(this.videoList[1].checked)
      resData.prerecordTime2 = Number(this.videoList[1].preVideoTime)
      // 事件提醒提示类自动处理时间
      // resData.eventAutoPro = Number(this.promptTimeCheck)
      // resData.eventAutoProTime = [5, 10, 20, 30].includes(parseInt(this.promptTimeValue))
      //   ? parseInt(this.promptTimeValue)
      //   : parseInt(this.customizeTime)

      // // 远程布撤防
      // resData.armReasonOn = transFT(this.armReason.reasonCheck)
      resData.alarmType = JSON.stringify(this.armReason.reasonList)
      // resData.processType = JSON.stringify(this.dealInfo.dealList)
      resData.workOrderType = JSON.stringify(this.bypassReason.reasonList)

      // resData.bypassReasonOn = transFT(this.bypassReason.reasonCheck)
      return resData
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-tactics {
  height: 100%;
  position: relative;
  font-size: 12px;
  margin: 0 10px;
  .alarm-tactics-btn-header {
    margin: 20px 0;
  }
  .alarm-tactics-btn {
    width: 1000px;
    margin: 20px 0;
    text-align: center;
  }
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
      /*padding: 20px 0;*/
    }
    /deep/.el-checkbox__label {
      font-size: 12px;
    }
    .alarm-tactics-main {
      height: 650px;
      overflow: auto;
      .tactics-main-row {
        overflow: hidden;
        background: rgba(245, 247, 250, 1);
        position: relative;
        padding: 5px;
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
          width: calc(~'100% - 240px');
          margin: 5px 0 5px 240px;
          line-height: 28px;
          .alarm-voice {
            overflow: hidden;
            margin: 4px;
            padding: 5px;
            i {
              float: left;
            }
            span {
              float: left;
            }
            .voice-upload {
              float: left;
              .el-input {
                float: left;
                width: 200px;
                margin: 0 10px;
              }
            }
          }
          .add-row {
            width: 100%;
            /*height: 116px;*/
            /*overflow: auto;*/
            margin-top: 5px;
            .add-row-input {
              padding: 3px 0;
            }
          }
        }
      }
      .tactics-back {
        background: #fff;
      }
    }
    .checkbox {
      vertical-align: text-bottom;
      margin-right: 5px;
    }
  }
}
</style>
<style lang="less">
.tactics-main-right .el-color-picker__icon {
  display: none;
}
.tactics-main-right .el-color-picker__trigger {
  border: none !important;
}
.tactics-main-right .el-color-picker--small .el-color-picker__trigger {
  width: 160px;
}
.tactics-main-right .el-color-picker__mask {
  height: 0px;
  width: 0px;
}
</style>
<!-- 打印时的样式-->
<style lang="less">
#printDom-alarm-tactics {
  width: 840px;
  .tactics-content-title {
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
  }
  .alarm-tactics-btn {
    overflow: hidden;
    margin: 10px 0;
    button {
      margin-left: 20px;
    }
  }
  /deep/.el-checkbox__label {
    font-size: 12px;
  }
  .alarm-tactics-main {
    .tactics-main-row {
      overflow: hidden;
      background: rgba(245, 247, 250, 1);
      position: relative;
      padding: 5px;
      p {
        float: left;
        width: 240px;
        height: 20px;
        text-align: left;
        padding-left: 30px;
        position: absolute;
        top: 50%;
        margin-top: -10px;
      }
      .tactics-main-right {
        width: calc(~'100% - 240px');
        margin: 5px 0 5px 240px;
        line-height: 28px;
        .alarm-voice {
          overflow: hidden;
          margin: 4px;
          padding: 5px;
          i {
            float: left;
          }
          span {
            float: left;
          }
          .voice-upload {
            float: left;
            .el-input {
              float: left;
              width: 200px;
              margin: 0 10px;
            }
          }
        }
        .add-row {
          width: 100%;
          /*height: 116px;*/
          /*overflow: auto;*/
          margin-top: 5px;
          .add-row-input {
            padding: 3px 0;
          }
        }
      }
    }
    .tactics-back {
      background: #fff;
    }
  }
}
</style>
