<template>
  <div class="alarm-level">
    <div class="alarm-level-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件提醒配置</el-breadcrumb-item>
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
      <p class="tactics-content-title">事件提醒配置</p>
      <div class="content">
        <div class="alarm-level-main">
          <div class="alarm-level-back">
            <div class="alarm-level-title">
              <span v-for="(item, index) in levelTitle"
                    :key="index"
                    :style="{width: item.width+'px'}">{{item.name}}</span>
            </div>
            <div class="alarm-level-row"
                 v-for="(item, index) in remindData"
                 :key="index">
              <span class="alarm-level-default">{{item.deviceClass}}</span>
              <div v-for="(val, index) in item.typeList"
                   :key="index"
                   class="alarm-level-type"
                   :class="{'alarm-level-line' : item.typeList.length > 1  && index === item.typeList.length-1}">
                <span>{{val.deviceType}}</span>
                <ul>
                  <li v-for="(data, index) in val.eventType"
                      :key="index">
                    <i>{{data. eventTypeDesc}}</i>
                    <span v-if="editStatus">{{data.remind}}</span>
                    <!--                    <span v-if="editStatus">{{data.autoProcessName}}</span>-->
                    <span v-if="!editStatus"
                          class="edit-select">
                      <el-select v-model="data.remind"
                                 style="width:125px">
                        <el-option label="关注"
                                   value="关注"></el-option>
                        <el-option label="提示"
                                   value="提示"></el-option>
                      </el-select>
                    </span>
                    <span v-if="!editStatus"
                          class="edit-select">
                      <el-checkbox v-model="data.autoProcess">启用</el-checkbox>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alarm-level-btn">
      <!--        <el-button size="mini" type="primary" @click="saveClick">{{btnInfo}}</el-button>-->
      <!--        <el-button size="mini" @click="cancel">取消</el-button>-->
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
      levelTitle: [
        {
          name: '所属子系统',
          width: '202'
        },
        {
          name: '设备类型',
          width: '202'
        },
        {
          name: '事件类型',
          width: '200'
        },
        {
          name: '事件提醒',
          width: '132'
        }
        // {
        //   name: '自动处理',
        //   width: '132'
        // }
      ],
      editStatus: true,
      middleList: [],
      num: 0,
      remindData: [],
      btnInfo: '保存'
    }
  },
  mixins: [levelConfig],
  created() {
    // this.deepTraversal(this.levelSort, '', '')
    this.getAlarmEventRemindFuc()
  },
  watch: {
    dailogList: {
      deep: true,
      handler(newValue) {}
    }
  },
  methods: {
    ...mapActions(['getAlarmEventRemind', 'putAlarmEventRemind']),
    // 编辑
    editClick() {
      this.editStatus = false
      this.isStatus = 1
      this.btnInfo = '保存'
    },
    // 打印
    print() {
      this.btnInfo = '打印'
      this.isStatus = 2
    },
    printClick() {
      let template = this.$refs.printDom.innerHTML
      //   document.body.innerHTML = `<div id="printDom-alarm-evnet">${template}</div>`
      this.do_print(`<div id="printDom-alarm-evnet">${template}</div>`)
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('iframe')
      var doc = null
      iframe.setAttribute(
        'style',
        'position:absolute;width:758px;height:800px;left: 1000px;top: 1000px;background:#fff'
      )
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/eventReminder.less')
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
      console.log(this.remindData)
      let saveData = this.saveTransData(this.remindData)
      this.putAlarmEventRemindFuc(saveData)
    },
    // 取消编辑
    cancel() {
      this.editStatus = true
      this.isStatus = "";
    },
    // 获取列表
    getAlarmEventRemindFuc() {
      this.getAlarmEventRemind().then(res => {
        if (res) {
          res.data.results.map(item => {
            item['remindName'] = item.remind === 'T' ? '关注' : '提示'
            item['autoProcessName'] = item.autoProcess === 'T' ? '启用' : '不启用'
          })
          let data = this.dataDeDuplicationFuc(res.data.results)

          this.remindData = data
        }
      })
    },
    // 更新列表
    putAlarmEventRemindFuc(data) {
      this.putAlarmEventRemind(data).then(res => {
        if (res) {
          this.getAlarmEventRemindFuc()
          this.isStatus = ""
        }
      })
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
                  autoProcess: transBoolean(item.autoProcess),
                  // autoProcessName: item.autoProcessName,
                  deviceClass: item.deviceClass,
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  eventTypeDesc: item.eventTypeDesc,
                  id: item.id,
                  remind: item.remind,
                  remindName: item.remindName
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
                  autoProcess: transBoolean(item.autoProcess),
                  // autoProcessName: item.autoProcessName,
                  deviceClass: item.deviceClass,
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  eventTypeDesc: item.eventTypeDesc,
                  id: item.id,
                  remind: item.remind,
                  remindName: item.remindName
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
                  autoProcess: transBoolean(item.autoProcess),
                  // autoProcessName: item.autoProcessName,
                  deviceClass: item.deviceClass,
                  deviceType: item.deviceType,
                  eventType: item.eventType,
                  eventTypeDesc: item.eventTypeDesc,
                  id: item.id,
                  remind: item.remind,
                  remindName: item.remindName
                }
              ]
            }
          ]
        }
      })
      return obj
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
              autoProcess: transFT(xx.autoProcess),
              deviceClass: xx.deviceClass,
              deviceType: xx.deviceType,
              eventType: xx.eventType,
              eventTypeDesc: xx.eventTypeDesc,
              id: xx.id,
              remind: xx.remind
            }
            data.push(obj)
          })
        })
      })
      return data
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
    width: 758px;
    overflow: hidden;
    margin-left: 20px;
    .tactics-content-title {
      text-align: center;
      padding: 20px 0;
    }
    .content {
      .alarm-level-main {
        border-bottom: 1px solid #e1e1e1;
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
                  i {
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
  .alarm-level-btn {
    margin: 20px 0;
    text-align: center;
    width: 900px;
  }
  .alarm-level-btn-header {
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
<!-- 打印时的样式-->
<style lang="less">
#printDom-alarm-evnet {
  width: 870px;
  .tactics-content-title {
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
  }
  .content {
    .alarm-level-main {
      border: 1px solid #e1e1e1;
      .alarm-level-back {
        background: rgba(245, 247, 250, 1);
        width: 870px;
        margin: auto;
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
                i {
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
</style>
