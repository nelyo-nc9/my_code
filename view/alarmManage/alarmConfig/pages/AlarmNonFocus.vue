<template>
  <div class="alarm-level">
    <div class="alarm-level-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警非重点时段配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="alarm-level-btn-header">
      <el-button size="mini"
                 @click="editClick">编辑</el-button>
      <el-button size="mini"
                 @click="print">打印</el-button>
    </div>
    <div class="alarm-level-content"
         ref="printDom"
         id="printDom">
      <p class="tactics-content-title">报警非重点时段配置</p>
      <div class="content">
        <div class="alarm-level-main">
          <div class="alarm-level-back">
            <div class="alarm-level-title">
              <span v-for="(item, index) in levelTitle"
                    :key="index"
                    :style="{width: item.width+'px'}"
                    :class="{'title-last': (index === levelTitle.length - 1)}">
                {{item.name}}
                <p>
                  <i v-for="(val, index) in item.subTitle"
                     :key="index"
                     :style="{width: val.width+'px'}">
                    {{val.name}}
                  </i>
                </p>
              </span>
            </div>
            <div class="alarm-level-row"
                 v-for="(item, index) in remindData"
                 :key="index">
              <span class="alarm-level-default">
                {{item.deviceClass}}
              </span>
              <div v-for="(val, index) in item.typeList"
                   :key="index"
                   class="alarm-level-type"
                   :class="{'alarm-level-line' : item.typeList.length > 1  && index === item.typeList.length-1}">
                <span>{{val.deviceType}}</span>
                <ul>
                  <li v-for="(data, index) in val.eventType"
                      :key="index">
                    <i>{{data.eventTypeDesc}}</i>
                    <i v-if="editStatus">{{data.timeTemplateName}}</i>
                    <i v-if="!editStatus"
                       class="edit-select">
                      <el-select v-model="data.timeTemplate"
                                 style="width:160px">
                        <el-option v-for="select in templateSelect"
                                   :key="select.id"
                                   :label="select.templateName"
                                   :value="parseInt(select.id)"></el-option>
                      </el-select>
                    </i>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.businessOutlet"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.treasury"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.officeBuilding"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.machineRoom"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.ATM"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.selfServiceEquip"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.selfServicePavilion"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.privateBank"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.fortuneCenter"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.safetyBox"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.archives"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                    <span v-if="isStatus!==2">
                      <el-checkbox v-model="data.remoteCenter"
                                   :disabled="editStatus">启用</el-checkbox>
                    </span>
                     <span v-if="isStatus!==2"><el-checkbox v-model="data.otherKeyloca" :disabled="editStatus">启用</el-checkbox></span>

                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.businessOutlet"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.businessOutlet"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.treasury"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.treasury"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.officeBuilding"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.officeBuilding"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.machineRoom"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.machineRoom"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.ATM"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.ATM"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.selfServiceEquip"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.selfServiceEquip"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.selfServicePavilion"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.selfServicePavilion"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.privateBank"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.privateBank"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.fortuneCenter"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.fortuneCenter"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.safetyBox"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.safetyBox"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.archives"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.archives"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"
                          style="font-size: 12px">
                      <a v-if="data.remoteCenter"
                         style="font-size: 14px">☑</a>
                      <a v-if="!data.remoteCenter"
                         style="font-size: 18px">□</a>
                      <a>启用</a>
                    </span>
                    <span v-if="isStatus===2"> {{data.treasury?'☑启用':'□启用'}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alarm-level-btn">
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
import levelConfig from './levelConfig.js'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      isStatus: 0,
      // 表头部
      levelTitle: [
        {
          name: '设备分类',
          width: '166'
        },
        {
          name: '设备类型',
          width: '166'
        },
        {
          name: '事件类型',
          width: '175'
        },
        {
          name: '时间模板',
          width: '175'
        },
        {
          name: '重点部位',
          subTitle: [
            {
              name: '营业网点',
              width: '72'
            },
            {
              name: '金库',
              width: '72'
            },
            {
              name: '办公楼',
              width: '72'
            },
            {
              name: '计算机机房',
              width: '72'
            },
            {
              name: '自助银行',
              width: '72'
            },
            {
              name: '自助设备',
              width: '72'
            },
            {
              name: '自助银亭',
              width: '72'
            },
            {
              name: '私人银行',
              width: '72'
            },
            {
              name: '财富中心',
              width: '72'
            },
            {
              name: '保管箱库',
              width: '72'
            },
            {
              name: '档案库',
              width: '90'
            },
            {
              name: '远程监控中心',
              width: '91'
            },
            {
              name: '其他重点部位',
              width: '91'
            }
          ]
        }
      ],
      templateSelect: [
        {
          label: '撤防(非重点时段)',
          value: 1
        }
      ],
      editStatus: true,
      middleList: [],
      num: 0,
      remindData: [],
      checkedData: {
        branchCheck: false,
        burseCheck: false,
        buildCheck: false,
        ATMCheck: false,
        deviceCheck: false,
        silverCheck: false,
        bankCheck: false,
        centerCheck: false,
        boxCheck: false,
        archiveCheck: false,
        monitorCheck: false,
        otherCheck: false
      },
      btnInfo: '保存'
    }
  },
  // mixins: [levelConfig],
  created() {
    this.getTimeTemplateFuc()
  },
  watch: {
    dailogList: {
      deep: true,
      handler(newValue) {}
    }
  },
  methods: {
    ...mapActions(['getAlarmNonFocus', 'putAlarmNonFocus', 'getTimeTemplate']),
    // 获取时间模板
    getTimeTemplateFuc() {
      this.getTimeTemplate().then(res => {
        this.getAlarmNonFocusFuc() // 时间模板获取完毕再获取列表
        if (res.code === 0) {
          this.templateSelect = res.data
        }
      })
    },
    // 编辑
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
      //   document.body.innerHTML = `<div id="printDom-alarm-nonfocus">${template}</div>`
      //   window.print()
      //   document.body.innerHTML = body
      this.do_print(`<div id="printDom-alarm-nonfocus">${template}</div>`)
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('iframe')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left: 0;top: 0;background:#fff')
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/AlarmNonFocus.less')
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
      this.editStatus = true
      let da = JSON.parse(JSON.stringify(this.remindData))
      let saveData = this.saveTransData(da)

      this.putAlarmNonFocusFuc(saveData)
    },
    // 取消编辑
    cancel() {
      this.editStatus = true
      this.btnInfo = '保存'
      this.isStatus = ""
    },
    // 获取列表
    getAlarmNonFocusFuc() {
      this.getAlarmNonFocus().then(res => {
        if (res && res.data && res.data.results) {
          res.data.results.map(item => {
            this.templateSelect.map(val => {
              if (parseInt(val.id) === parseInt(item.timeTemplate)) {
                console.log(val.templateName)
                item['timeTemplateName'] = val.templateName
              }
            })
          })
          let data = this.dataDeDuplicationFuc(res.data.results)
          this.remindData = data
        }
      })
    },
    // 更新列表
    putAlarmNonFocusFuc(data) {
      this.putAlarmNonFocus(data).then(res => {
        if (res) {
          this.getAlarmNonFocusFuc()
          this.isStatus = ""
        }
      })
    },
    // 保存转换数据
    saveTransData(levelData) {
      let data = []
      let transFT = function(val) {
        if (val) {
          return 'T'
        } else {
          return 'F'
        }
      }
      Object.keys(levelData).map(key => {
        let item = levelData[key]
        item.typeList.map(val => {
          val.eventType.map(xx => {
            let obj = {
              deviceClass: item.deviceClass,
              ATM: transFT(xx.ATM),
              archives: transFT(xx.archives),
              businessOutlet: transFT(xx.businessOutlet),
              deviceType: xx.deviceType,
              eventType: xx.eventType,
              fortuneCenter: transFT(xx.fortuneCenter),
              id: xx.id,
              machineRoom: transFT(xx.machineRoom),
              officeBuilding: transFT(xx.officeBuilding),
              otherKeyloca: transFT(xx.otherKeyloca),
              privateBank: transFT(xx.privateBank),
              remoteCenter: transFT(xx.remoteCenter),
              safetyBox: transFT(xx.safetyBox),
              selfServiceEquip: transFT(xx.selfServiceEquip),
              selfServicePavilion: transFT(xx.selfServicePavilion),
              timeTemplate: xx.timeTemplate,
              treasury: transFT(xx.treasury),
              eventTypeDesc: xx.eventTypeDesc
            }
            data.push(obj)
          })
        })
      })
      return data
    },
    // 数据去重
    dataDeDuplicationFuc(arr) {
      let obj = {}
      let transBoolean = function(val) {
        if (val === 'T') {
          return true
        } else if (val === 'F') {
          return false
        }
      }
      arr.map(item => {
        if (obj[item.deviceClass]) {
          let filter = obj[item.deviceClass].typeList.some(valsom => {
            return valsom.deviceType === item.deviceType
          })
          if (filter) {
            obj[item.deviceClass].typeList.map(objap => {
              if (objap.deviceType === item.deviceType) {
                let oj = {
                  deviceClass: item.deviceClass,
                  ATM: transBoolean(item.ATM),
                  archives: transBoolean(item.archives),
                  businessOutlet: transBoolean(item.businessOutlet),
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  fortuneCenter: transBoolean(item.fortuneCenter),
                  id: item.id,
                  machineRoom: transBoolean(item.machineRoom),
                  officeBuilding: transBoolean(item.officeBuilding),
                  otherKeyloca: transBoolean(item.otherKeyloca),
                  privateBank: transBoolean(item.privateBank),
                  remoteCenter: transBoolean(item.remoteCenter),
                  safetyBox: transBoolean(item.safetyBox),
                  selfServiceEquip: transBoolean(item.selfServiceEquip),
                  selfServicePavilion: transBoolean(item.selfServicePavilion),
                  timeTemplate: Number(item.timeTemplate),
                  timeTemplateName: item.timeTemplateName,
                  eventTypeDesc: item.eventTypeDesc,
                  treasury: transBoolean(item.treasury)
                }
                objap.eventType.push(oj)
              }
            })
          } else {
            let aa = {
              deviceType: item.deviceType,
              mark: 'devType',
              eventType: [
                {
                  deviceClass: item.deviceClass,
                  ATM: transBoolean(item.ATM),
                  archives: transBoolean(item.archives),
                  businessOutlet: transBoolean(item.businessOutlet),
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  fortuneCenter: transBoolean(item.fortuneCenter),
                  id: item.id,
                  machineRoom: transBoolean(item.machineRoom),
                  officeBuilding: transBoolean(item.officeBuilding),
                  otherKeyloca: transBoolean(item.otherKeyloca),
                  privateBank: transBoolean(item.privateBank),
                  remoteCenter: transBoolean(item.remoteCenter),
                  safetyBox: transBoolean(item.safetyBox),
                  selfServiceEquip: transBoolean(item.selfServiceEquip),
                  selfServicePavilion: transBoolean(item.selfServicePavilion),
                  timeTemplate: Number(item.timeTemplate),
                  timeTemplateName: item.timeTemplateName,
                  eventTypeDesc: item.eventTypeDesc,
                  treasury: transBoolean(item.treasury)
                }
              ]
            }
            obj[item.deviceClass].typeList.push(aa)
          }
        } else {
          obj[item.deviceClass] = {}
          obj[item.deviceClass].deviceClass = item.deviceClass
          obj[item.deviceClass].mark = 'devSort'
          obj[item.deviceClass].typeList = [
            {
              deviceType: item.deviceType,
              mark: 'devType',
              eventType: [
                {
                  deviceClass: item.deviceClass,
                  ATM: transBoolean(item.ATM),
                  archives: transBoolean(item.archives),
                  businessOutlet: transBoolean(item.businessOutlet),
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  fortuneCenter: transBoolean(item.fortuneCenter),
                  id: item.id,
                  machineRoom: transBoolean(item.machineRoom),
                  officeBuilding: transBoolean(item.officeBuilding),
                  otherKeyloca: transBoolean(item.otherKeyloca),
                  privateBank: transBoolean(item.privateBank),
                  remoteCenter: transBoolean(item.remoteCenter),
                  safetyBox: transBoolean(item.safetyBox),
                  selfServiceEquip: transBoolean(item.selfServiceEquip),
                  selfServicePavilion: transBoolean(item.selfServicePavilion),
                  timeTemplate: item.timeTemplate,
                  timeTemplateName: item.timeTemplateName,
                  eventTypeDesc: item.eventTypeDesc,
                  treasury: transBoolean(item.treasury)
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
  .checkbox {
    vertical-align: text-bottom;
    margin-right: 5px;
  }
  &-btn {
    overflow: hidden;
    margin: 10px 0;
    button {
      margin-left: 20px;
    }
  }
  .alarm-level-btn {
    margin: 20px 0;
    text-align: center;
  }
  .alarm-level-btn-header {
    margin: 20px 0;
  }
  &-content {
    /*overflow: hidden;*/
    margin-left: 20px;
    .tactics-content-title {
      text-align: center;
      padding: 20px 0;
    }
    .content {
      /*border: 1px solid #cccccc;*/

      .alarm-level-main {
        border-bottom: 1px solid #e1e1e1;
        margin: 10px;
        height: 600px;
        overflow: auto;
        width: 1676px;
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
            .title-last {
              padding: 0;
              p {
                border-top: 1px solid #e1e1e1;
                i {
                  float: left;
                  border-right: 1px solid #e1e1e1;
                  &:last-child {
                    border-right: none;
                  }
                }
              }
            }
          }
          .alarm-level-row {
            border-bottom: 1px solid #e1e1e1;
            position: relative;
            .alarm-level-default {
              float: left;
              width: 165px;
              height: 20px;
              text-align: center;
              position: absolute;
              top: 50%;
              margin-top: -10px;
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
              margin-left: 165px;
              position: relative;
              border-top: 1px solid #e1e1e1;
              & > span {
                width: 165px;
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
                padding-left: 165px;
                li {
                  overflow: hidden;
                  height: 26px;
                  box-sizing: border-box;
                  text-align: center;
                  border-bottom: 1px solid #e1e1e1;
                  border-left: 1px solid #e1e1e1;
                  i {
                    width: 175px;
                    float: left;
                    border-right: 1px solid #e1e1e1;
                    padding: 4px 0;
                    cursor: pointer;
                    height: 100%;
                    display: inline-block;
                  }
                  span {
                    width: 72px;
                    float: left;
                    border-right: 1px solid #e1e1e1;
                    // padding: 4px 0;
                    height: 26px;
                    &:last-child {
                      width: 92px;
                    }
                    &:nth-child(14) {
                      width: 91px;
                    }
                    &:nth-child(13) {
                      width: 90px;
                    }
                  }
                  &:last-child {
                    border-bottom: none;
                  }
                  .edit-select {
                    padding-top: 1px;
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
.alarm-level-type .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #333333;
}
</style>
<!-- 打印时的样式-->
<style lang="less">
</style>
