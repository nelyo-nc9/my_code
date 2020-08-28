<template>
  <div class="alarm-level">
    <div class="alarm-level-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>设备配置管理</el-breadcrumb-item>
        <el-breadcrumb-item>消防报警等级配置</el-breadcrumb-item>
        <el-breadcrumb-item v-if="issueModelBool">下发状态</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="alarm-level-btn">
      <el-button size="mini"
                 @click="editClick">编辑</el-button>
      <el-button size="mini"
                 @click="sendClick">下发全行</el-button>
      <el-button size="mini"
                 @click="print">打印</el-button>
    </div>
    <div :class="{ 'alarm-level-content-fire': !printStatus, 'alarm-level-print-fire': printStatus }"
         style="width: 1097px"
         ref="printDom"
         id="printDom">
      <p class="tactics-content-title">消防报警等级及联动录像配置</p>
      <div class="content">
        <div class="alarm-level-main">
          <div class="alarm-level-back">
            <div class="alarm-level-title">
              <span v-for="(item, index) in titleList"
                    :key="index"
                    :style="{ width: item.width + 'px' }">{{
                item.name
              }}</span>
            </div>
            <div class="alarm-level-row"
                 v-for="(item, index) in levelSort"
                 :key="index">
              <span :class="{ 'alarm-level-default': editStatus, 'alarm-level-sort': !editStatus }">
                {{ item.alarmType }}
                <!--                <i class="el-icon-plus" v-if="!editStatus" @click="addInfoClick(item)"></i>-->
              </span>
              <div v-for="(val, index) in item.typeList"
                   :key="index"
                   class="alarm-level-type"
                   :class="{ 'alarm-level-line': item.typeList.length > 1 && index === item.typeList.length - 1 }">
                <span>{{ val.subSystemName }}</span>
                <ul>
                  <li v-for="(data, index) in val.eventType"
                      :key="index">
                    <span>
                      <i>{{ data.alarmName }}</i>
                      <!--                      <i @click="devTypeClick(item,val, 'event', data)">{{data.alarmName}}</i>-->
                      <i class="el-icon-plus"
                         v-if="!editStatus"
                         @click="addEventType(item, data, val)"></i>
                    </span>
                    <span>
                      <i>{{ data.condition }}</i>
                    </span>
                    <span v-if="editStatus">{{ data.alarmLevelName }}</span>
                    <span v-if="editStatus">{{ data.videoActionName }}</span>
                    <span v-if="!editStatus"
                          class="edit-select">
                      <el-checkbox v-model="data.useLevel">启用</el-checkbox>
                      <el-select v-model="data.level"
                                 style="width:76px">
                        <el-option v-for="select in levelSelect"
                                   :key="select.value"
                                   :label="select.label"
                                   :value="select.value"></el-option>
                      </el-select>
                    </span>

                    <span v-if="!editStatus"
                          class="edit-select">
                      <el-select v-model="data.recordAction"
                                 style="width:126px">
                        <el-option :label="item.label"
                                   :value="item.value"
                                   v-for="item in videoLinkDict"
                                   :key="item.value"></el-option>
                      </el-select>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 1156px; height: 32px;display:flex;margin-top:10px;margin-left:20px;"
         v-if="!editStatus">
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入时间：</div>
        <div style="flex:1;line-height:32px;text-align:center">{{ saveObj.time }}</div>
      </div>
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入机构：</div>
        <div style="flex:1;line-height:32px;text-align:center">{{ saveObj.org }}</div>
      </div>
      <div style="flex:1;display:flex">
        <div style="width:120px;line-height:32px;background:#f5f7fa;text-align:center">录入人：</div>
        <div style="flex:1;line-height:32px;text-align:center">{{ saveObj.person }}</div>
      </div>
    </div>
    <div class="alarm-level-btn-bottom"
         style="text-align:center;">
      <el-button size="mini"
                 type="primary"
                 @click="saveClick"
                 v-show="isStatus === 1">保存</el-button>
      <el-button size="mini"
                 type="primary"
                 @click="printClick"
                 v-show="isStatus === 2">打印</el-button>
      <el-button size="mini"
                 @click="cancel"
                 v-show="isStatus === 1 || isStatus === 2">取消</el-button>
    </div>
    <div>
      <!-- 修改设备类型或事件类型 -->
      <el-dialog :title="eDialog.title"
                 :visible.sync="eDialog.editWord"
                 width="20%">
        <el-form :model="form">
          <el-form-item :label="eDialog.label">
            <el-input v-model="saveData.alarmName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="eDialog.editWord = false"
                     size="small">关闭</el-button>
          <el-button type="primary"
                     @click="editDevNameSure"
                     size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加信息 -->
      <el-dialog title="添加"
                 :visible.sync="setAdd"
                 width="34%">
        <div class="dialog-title">
          <span>设备分类</span>
          <span>设备类型</span>
          <span>事件类型</span>
        </div>
        <div class="dialog-back">
          <div class="dialog-row">
            <span class="dialog-sort">{{ addRowData.name }}</span>
            <!-- 需求每次只能添加一条数据 -->
            <div v-for="(val, index) in addRowData.addRowList"
                 :key="index"
                 class="dialog-type">
              <span>
                <el-input v-model="val.dialogDevType"
                          placeholder="请输入内容"></el-input>
              </span>
              <span>
                <el-input v-model="val.dialogEventType"
                          placeholder="请输入内容"></el-input>
              </span>
            </div>
          </div>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <!-- <span>操作员：张三</span> -->
          <el-button @click="setAdd = false"
                     size="small">关闭</el-button>
          <el-button type="primary"
                     @click="setAreaSure"
                     size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加信息 -->
      <el-dialog title="事件类型添加"
                 :visible.sync="eventEdit"
                 width="12%">
        <div class="dialog-title">
          <span>事件类型</span>
        </div>
        <div class="dialog-row">
          <el-input v-model="saveData.alarmName"
                    placeholder="请输入内容"></el-input>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <!-- <span>操作员：张三</span> -->
          <el-button @click="eventEdit = false"
                     size="small">关闭</el-button>
          <el-button type="primary"
                     @click="eventEditSure"
                     size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 下发全行 -->
      <el-dialog title="报警等级下发全行"
                 :visible.sync="sendStatus"
                 width="20%">
        <span>是否将报警等级下发全行？</span>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="primary"
                     @click="sendBankSure"
                     size="small">确 定</el-button>
          <el-button @click="sendStatus = false"
                     size="small">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="issueState" v-if="issueModelBool">
      <el-button size="mini"
                 @click="anewIssue">重新下发</el-button>
      <el-button size="mini"
                 @click="closeIssueModel">关闭</el-button>
      <div class="tableChangeSelect">
        <el-button size="mini" icon="el-icon-refresh-right" @click="anewIssue">刷新列表</el-button>
        <div>
          <span>筛选</span>
          <el-select v-model="issueSearchState" size="mini">
            <el-option label="全部" value=""></el-option>
            <el-option label="下发成功" value="1"></el-option>
            <el-option label="下发失败" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <el-table
          border
          size="mini"
          height="610"
          :data="tableData"
          @selection-change="select"
          style="width: 100%"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="organizationName" label="机构名称" align="center"></el-table-column>
          <el-table-column prop="parentBody" label="上级机构" align="center"></el-table-column>
          <el-table-column prop="organizationLevel" label="机构级别" align="center"></el-table-column>
          <el-table-column prop="issueState" label="下发状态" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.issueState==1">下发成功</span>
                <span v-if="scope.row.issueState==2">下发失败</span>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import levelConfigData from './levelConfigData.js'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      saveObj: {
        time: moment().format('YYYY-MM-DD HH:mm'),
        org: '保定分行',
        person: '张三'
      },
      isStatus: 0,
      tableData:[{
        organizationName:"河北省分行",
        parentBody:"总行",
        organizationLevel:"一级分行",
        issueState:1
      },{
        organizationName:"河北省分行",
        parentBody:"总行",
        organizationLevel:"一级分行",
        issueState:2
      }],
      issueSearchState:"",
      selectData:[],
      issueModelBool:false,
      videoLinkDict: [
        {
          label: '联动录像',
          value: 'T'
        },
        {
          label: '不联动录像',
          value: 'F'
        }
      ],
      titleList: [],
      levelTitle: [
        {
          name: '类型',
          width: '202'
        },
        {
          name: '所属子系统',
          width: '202'
        },
        {
          name: '报警名称（细分类）',
          width: '200'
        },
        {
          name: '告警条件',
          width: '200'
        },
        {
          name: '报警等级',
          width: '132'
        },
        {
          name: '联动录像',
          width: '132'
        }
      ],
      levelSelect: [
        {
          label: '一级',
          value: 1
        },
        {
          label: '二级',
          value: 2
        }
      ],
      addRowData: {
        name: '',
        addRowList: [
          {
            dialogDevType: '',
            dialogEventType: ''
          }
        ]
      },
      dailogList: [],
      editStatus: true,
      setAdd: false,
      form: {
        editInfo: ''
      },
      eDialog: {
        editWord: false,
        label: '设备类型',
        title: '设备类型修改',
        editBata: ''
      },
      sendStatus: false, // 下发全行状态
      printStatus: false, // 打印
      btnInfo: '保存',
      eventEdit: false,
      eventEditValue: '',
      eventEditData: '',
      eventEditList: '',
      saveData: {
        level: 1,
        alarmType: 1,
        subSystemName: 1,
        eventType: 1,
        eventUse: 1,
        isCaution: 'T',
        nonkeyTime: 'T',
        videoAction: 1,
        alarmName: ''
      }
    }
  },
  mixins: [levelConfigData],
  created() {
    this.titleList = this.levelTitle
    this.getAlarmLevelLinkVideoFuc()
  },
  watch: {},
  methods: {
    ...mapActions('equipmentConfigManagement', {
      getAlarmLevelLinkVideo: 'getAlarmLevelLinkVideo',
      putAlarmLevelLinkVideo: 'putAlarmLevelLinkVideo'
    }),
    // 编辑
    editClick() {
      this.isStatus = 1
      this.editStatus = false
      this.printStatus = false
      this.titleList = this.levelTitle
      this.btnInfo = '保存'
    },
    // 下发全行
    sendClick() {
      this.sendStatus = true
      this.printStatus = false
      this.titleList = this.levelTitle
      this.btnInfo = '打印'
    },
     // 选中数据
    select(val) {
      console.log(val)
      this.selectData = val
    },
    //重新下发
    anewIssue(){

    },
    //关闭下发状态列表
    closeIssueModel(){
      this.issueModelBool = false;
    },
    //刷新列表
    anewIssue(){

    },
    // 下发全行确认信息
    sendBankSure() {
      this.sendStatus = false;
      this.issueModelBool = true;
    },
    // printClick() {
    //   let template = this.$refs.printDom.innerHTML
    //   this.do_print(`<div id="printDom-alarm-lev-video-fire">${template}</div>`)
    // },
    // do_print(
    //   template // id-str 打印区域的id
    // ) {
    //   //   var el = document.getElementById(id_str)
    //   var iframe = document.createElement('iframe')
    //   var doc = null
    //   iframe.setAttribute('style', 'position:absolute;width:0;height:0;left: 0;top: 0;background:#fff')
    //   let link = document.createElement('LINK')
    //   link.setAttribute('rel', 'stylesheet')
    //   link.setAttribute('type', 'text/css')
    //   link.setAttribute('href', '../../../../../../static/printCss/level.less')
    //   document.body.appendChild(iframe)
    //   doc = iframe.contentWindow.document
    //   doc.head.appendChild(link)
    //   doc.body.innerHTML = template
    //   doc.close()
    //   iframe.contentWindow.focus()
    //   setTimeout(() => {
    //     iframe.contentWindow.print()
    //     document.body.removeChild(iframe)
    //   }, 600)
    // },

     printClick() {
      let template = this.$refs.printDom.innerHTML
      this.do_print(`<div id="printDom-alarm-lev-video">${template}</div>`)
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('iframe')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;left: 0;top: 0;background:#fff')
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/AlarmLevel.less')
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
    // 打印
    print() {
      this.editStatus = true
      this.isStatus = 2
    },
    // 保存相应信息
    saveClick() {
      this.editStatus = true
      console.log(this.levelSort)
      let da = JSON.parse(JSON.stringify(this.levelSort))
      let saveData = this.saveTransData(da)
      this.putAlarmLevelLinkVideoFuc(saveData)
    },
    // 保存转换数据
    saveTransData(levelData) {
      let data = []
      Object.keys(levelData).map(key => {
        let item = levelData[key]
        item.typeList.map(val => {
          val.eventType.map(xx => {
            let obj = {
              level: Number(xx.level),
              alarmType: xx.alarmType,
              subSystemName: xx.subSystemName,
              subSystem: xx.subSystem,
              condition: xx.condition,
              recordAction: xx.recordAction,
              alarmName: xx.alarmName,
              //isEnable: val.isEnable,
              // eventType: Number(xx.eventType),
              // alarmName: xx.alarmName,
              // eventUse: xx.eventUse,
              isEnable: xx.useLevel ? 'T' : 'F',
              id: xx.id
              // isCaution: xx.isCaution,
              // nonkeyTime: xx.nonkeyTime,
              // videoAction: xx.videoAction
            }
            data.push(obj)
          })
        })
      })
      return data
    },
    // 取消编辑
    cancel() {
      this.editStatus = true
      this.printStatus = false
      this.isStatus = ""
    },
    // 添加信息
    addInfoClick(data) {
      // this.setAdd = true
      this.addRowData.name = data.name
      this.dailogList = data.typeList
    },
    // 添加信息确认
    setAreaSure() {
      let num = 0
      let dType, eType
      this.dailogList.forEach(item => {
        for (let i = 0; i < this.addRowData.addRowList.length; i++) {
          dType = this.addRowData.addRowList[i].dialogDevType
          eType = this.addRowData.addRowList[i].dialogEventType
          if (dType && eType && item.name === this.addRowData.addRowList[i].dialogDevType) {
            num += 1
            eType = this.addRowData.addRowList[i].dialogEventType
            item.eventType.push({
              checked: false,
              eventWarn: '是',
              level: '一级',
              mark: 'eventType',
              name: eType,
              noFocus: '否',
              linkVideo: '不联动录像'
            })
          }
        }
      })
      if (dType && eType) {
        if (!num) {
          this.dailogList.push({
            name: dType,
            mark: 'devSort',
            eventType: [
              {
                checked: false,
                eventWarn: '是',
                level: '一级',
                mark: 'eventType',
                name: eType,
                noFocus: '否',
                linkVideo: '不联动录像'
              }
            ]
          })
        }
        this.setAdd = false
        this.addRowData = {
          name: '',
          addRowList: [
            {
              dialogDevType: '',
              dialogEventType: ''
            }
          ]
        }
      }
    },
    // 弹框添加
    addDialogClick() {},

    // 事件类型添加
    addEventType(item, data, list) {
      this.saveData.level = data.level
      this.saveData.alarmType = item.alarmType
      this.saveData.subSystemName = list.subSystemName
      this.saveData.eventType = data.eventType
      this.saveData.alarmName = data.alarmName + '(非重点时段)'
      this.saveData.eventUse = data.eventUse
      this.saveData.nonkeyTime = data.nonkeyTime
      this.saveData.videoAction = data.videoAction
      // this.saveData.level = data.level,
      this.eventEdit = true
      // this.eventEditData = data
      // this.eventEditList = list
    },
    eventEditSure() {
      console.log(this.saveData)
      this.saveData.videoAction = 'F'
      this.saveData.level = 1
      delete this.saveData.id
      this.putAlarmLevelLinkVideoFuc(this.saveData)
    },
    // 设备类型修改确认
    editDevNameSure() {
      this.eDialog.editWord = false
      // this.eDialog.editBata.name = this.form.editInfo
      this.putAlarmLevelLinkVideoFuc([this.saveData])
    },
    // 获取设备列表
    getAlarmLevelLinkVideoFuc() {
      this.getAlarmLevelLinkVideo().then(res => {
        if (res) {
          res.data.results.map(item => {
            this.levelSelect.map(val => {
              if (val.value === Number(item.level)) {
                item['alarmLevelName'] = val.label
              }
            })

            this.videoLinkDict.map(val => {
              if (val.value === item.recordAction) {
                item['videoActionName'] = val.label
              }
            })

            item['nonkeyTimeName'] = item.nonkeyTime === 'T' ? '是' : '否'
            item['isCautionName'] = item.isCaution === 'T' ? '是' : '否'
          })
          let data = this.dataDeDuplicationFuc(res.data.results)
          this.levelSort = data
          this.eventEdit = false
          this.editStatus = true
        }
      })
    },
    // 更新列表
    putAlarmLevelLinkVideoFuc(data) {
      this.putAlarmLevelLinkVideo(data).then(res => {
        if (res) {
          this.getAlarmLevelLinkVideoFuc()
          this.isStatus = 0
        }
      })
    },
    // 数据去重
    dataDeDuplicationFuc(arr) {
      let obj = {}
      arr.map(item => {
        if (obj[item.alarmType]) {
          let filter = obj[item.alarmType].typeList.some(valsom => {
            return valsom.subSystemName === item.subSystemName
          })
          if (filter) {
            obj[item.alarmType].typeList.map(objap => {
              if (objap.subSystemName === item.subSystemName) {
                let oj = {
                  // eventType: item.eventType,
                  // level: item.level,
                  // nonkeyTime: item.nonkeyTime,
                  // isCaution: item.isCaution,
                  // checked: false,
                  useLevel: item.isEnable === 'T' ? true : 'false',
                  // mark: 'eventType',
                  // videoAction: item.videoAction,
                  // id: item.id,
                  // eventUse: item.eventUse,
                  alarmLevelName: item.alarmLevelName,
                  videoActionName: item.videoActionName,
                  //recordAction: item.recordAction,

                  // nonkeyTimeName: item.nonkeyTimeName,
                  // isCautionName: item.isCautionName,
                  // alarmName: item.alarmName

                  alarmName: item.alarmName,
                  alarmType: item.alarmType,
                  className: item.className,
                  condition: item.condition,
                  id: item.id,
                  isEnable: item.isEnable,
                  level: item.level,
                  recordAction: item.recordAction,
                  subSystemName: item.subSystemName
                }
                objap.eventType.push(oj)
              }
            })
          } else {
            let aa = {
              subSystemName: item.subSystemName,
              mark: 'devType',
              eventType: [
                {
                  alarmName: item.alarmName,
                  alarmType: item.alarmType,
                  className: item.className,
                  condition: item.condition,
                  id: item.id,
                  isEnable: item.isEnable,
                  level: item.level,
                  recordAction: item.recordAction,
                  subSystemName: item.subSystemName
                }
              ]
            }
            obj[item.alarmType].typeList.push(aa)
          }
        } else {
          obj[item.alarmType] = {}
          obj[item.alarmType].alarmType = item.alarmType
          obj[item.alarmType].mark = 'devSort'
          obj[item.alarmType].typeList = [
            {
              subSystemName: item.subSystemName,
              mark: 'devType',
              eventType: [
                {
                  alarmName: item.alarmName,
                  alarmType: item.alarmType,
                  className: item.className,
                  condition: item.condition,
                  id: item.id,
                  isEnable: item.isEnable,
                  level: item.level,
                  recordAction: item.recordAction,
                  subSystemName: item.subSystemName
                }
              ]
            }
          ]
        }
      })
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-level {
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
    width: 1156px;
    overflow: hidden;
    margin-left: 20px;
  }
  .alarm-level-print {
    width: 758px;
    overflow: hidden;
    margin-left: 20px;
  }
  .tactics-content-title {
    text-align: center;
    padding: 20px 0;
  }
  .content {
    .alarm-level-main {
      /*border-bottom: 1px solid #e1e1e1;*/
      margin: 10px;
      height: 600px;
      overflow: auto;
      .alarm-level-back {
        .alarm-level-title {
          overflow: hidden;
          background: rgba(245, 247, 250, 1);
          span {
            float: left;
            text-align: center;
            border-right: 1px solid #e1e1e1;
            padding: 10px 0;
          }
        }
        .alarm-level-row {
          border-bottom: 1px solid #e1e1e1;
          position: relative;
          .alarm-level-default {
            float: left;
            width: 200px;
            height: 20px;
            text-align: center;
            position: absolute;
            top: 50%;
            margin-top: -10px;
            word-wrap: break-word;
            word-break: break-all;
          }
          .alarm-level-sort {
            float: left;
            width: 200px;
            height: 40px;
            text-align: center;
            position: absolute;
            top: 50%;
            margin-top: -20px;
            z-index: 10;
            i {
              width: 200px;
              padding-top: 4px;
              cursor: pointer;
            }
          }
          .alarm-level-type {
            overflow: hidden;
            margin-left: 201px;
            position: relative;
            border-top: 1px solid #e1e1e1;
            & > span {
              width: 200px;
              float: left;
              height: 20px;
              text-align: center;
              position: absolute;
              top: 50%;
              margin-top: -10px;
              cursor: pointer;
            }
            ul {
              overflow: hidden;
              float: left;
              border-left: 1px solid #e1e1e1;
              padding-left: 201px;
              li {
                overflow: hidden;
                height: 26px;
                box-sizing: border-box;
                text-align: center;
                border-bottom: 1px solid #e1e1e1;
                border-left: 1px solid #e1e1e1;
                span:first-child,span:nth-child(2) {
                  width: 200px;
                  float: left;
                  border-right: 1px solid #e1e1e1;
                  padding: 4px 0;
                  cursor: pointer;
                }
                span {
                  width: 132px;
                  float: left;
                  border-right: 1px solid #e1e1e1;
                  // padding: 4px 0;
                  height: 26px;
                }
                &:last-child {
                  border-bottom: none;
                }
                .edit-select {
                  .el-checkbox {
                    float: left;
                    line-height: 26px;
                    margin-left: 2px;
                  }
                }
              }
            }
          }
          .alarm-level-type:nth-child(2) {
            border-top: none;
          }
          .alarm-level-line {
            border-top: 1px solid #e1e1e1;
            // margin-left: 200px;
          }
        }
      }
    }

  }
  .alarm-level-btn {
    margin: 20px 0;
  }
  .dialog-title {
    overflow: hidden;
    background: #d7d7d7;
    // display: flex;
    span {
      // flex: 1;
      width: 204px;
      float: left;
      text-align: center;
      border-right: 1px solid #e1e1e1;
      padding: 10px 0;
    }
  }
  .dialog-back {
    background: #f2f2f2;
    .dialog-row {
      border-bottom: 1px solid #e1e1e1;
      position: relative;
      .dialog-sort {
        float: left;
        width: 202px;
        height: 20px;
        text-align: center;
        position: absolute;
        top: 50%;
        margin-top: -10px;
        z-index: 10;
        i {
          width: 200px;
          padding-top: 4px;
          cursor: pointer;
        }
      }
      .dialog-type {
        border-left: 1px solid #e1e1e1;
        overflow: hidden;
        margin-left: 202px;
        position: relative;
        & > span {
          width: 204px;
          float: left;
          height: 36px;
          border-right: 1px solid #e1e1e1;
          // text-align: center;
          // position: absolute;
          // top: 50%;
          // margin-top: -10px;
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
  .issueState{
    width: 70%;
    height: 85vh;
    position: absolute;
    background: #fff;
    top: 30px;
    left: 0;
    z-index: 333;
  }
  .tableChangeSelect{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .tableChangeSelect div span{
    margin-right: 8px;
  }
}

</style>
<style lang="less">
.alarm-level-type .el-input__inner {
  height: 24px;
  line-height: 24px;
}
.alarm-level-type .el-input__icon {
  line-height: 24px;
}
.alarm-level-type .el-select .el-input .el-select__caret {
  font-size: 12px;
}
.alarm-level-type .el-checkbox__label {
  padding-left: 3px;
}
.dialog-type .el-input__inner {
  height: 32px !important;
  line-break: 32px !important;
  width: 180px;
  margin: 2px 0 0 10px;
}
</style>
<style lang="less"></style>
