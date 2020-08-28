<template>
  <div class="create-tab-box">
    <el-tabs v-model="activeTabName" @tab-click="tabChange">
      <el-tab-pane label="通道管理" name="chan">
        <table-result
          v-if="reloadChanelInfo"
          :id="id"
          :devInfo="devInfo"
          :deviceName="deviceName"
          :deviceData="deviceData"
          :jumpType="jumpType"
        ></table-result>
      </el-tab-pane>
      <el-tab-pane label="事件管理" name="event">
        <div class="button-box">
          <el-button
            :type="activeEventName === 'alarm' ? 'primary' : ''"
            @click="activeEventName = 'alarm'"
            size="small"
            >报警输入</el-button
          >
          <el-button
            :type="activeEventName === 'device' ? 'primary' : ''"
            @click="activeEventName = 'device'"
            size="small"
            >设备异常</el-button
          >
           <el-button
            :type="activeEventName === 'lose' ? 'primary' : ''"
            @click="activeEventName = 'lose'"
            size="small"
            >视频丢失</el-button
          >
          <el-button
            :type="activeEventName === 'mobile' ? 'primary' : ''"
            @click="activeEventName = 'mobile'"
            size="small"
            >移动侦测</el-button
          >
          <el-button
            :type="activeEventName === 'video' ? 'primary' : ''"
            @click="activeEventName = 'video'"
            size="small"
            >视频诊断</el-button
          >
        </div>

        <el-form label-width="80px" ref="formData" :model="formData" >
          <!-- :rules="eventManageRule" -->
          <el-form-item label="报警输入" v-if="activeEventName === 'alarm'" prop="alarmtErrorValue">
            <el-select v-model="formData.alarmtErrorValue" multiple placeholder="请选择" @change="deviceChange">
              <el-option v-for="item in deviceErrors" :key="item.value" :label="item.label" :value="item.value" >
              </el-option>
            </el-select>
            <el-checkbox v-model="formData.alarmInputChecked">启用</el-checkbox>
          </el-form-item>
          <el-form-item label="异常类型" v-if="activeEventName === 'device'" prop="deviceErrorValue">
            <el-select v-model="formData.deviceErrorValue" multiple placeholder="请选择" >
              <el-option v-for="item in deviceErrors" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-checkbox v-model="formData.deviceExceptionChecked">启用</el-checkbox>
          </el-form-item>
           <el-form-item label="视频丢失" v-if="activeEventName === 'lose'" prop="loseValue" >
            <el-select v-model="formData.loseValue" multiple placeholder="请选择" @change = "loseChange" >
              <el-option v-for="item in loseList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-checkbox v-model="formData.loseChecked">启用</el-checkbox>
          </el-form-item>
          <!-- <el-form-item label="移动侦测" v-if="activeEventName === 'mobile'" prop="moveSenseValue"  > -->
            <div v-if="activeEventName === 'mobile'" class="filter-box"> 
             <div prop="channelNumbers">
                通道号：<el-select v-model="formData.channelNumbers" multiple placeholder="请选择" @change="mobileChange">
                 <!--   channelNumberList-->
                  <el-option
                    v-for="item in loseList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div prop="moveSenseValue">
                移动侦测:<el-select v-model="formData.moveSenseValue" multiple placeholder="请选择" @change="moveSenseChange">
                 <!--   channelNumberList-->
                  <el-option
                    v-for="item in moveSenses"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            <!-- <el-select v-model="formData.moveSenseValue" multiple placeholder="请选择" @change = "moveSenseChange">
              <el-option v-for="item in moveSenses" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
            <el-checkbox v-model="formData.mobileDetectionChecked">启用</el-checkbox>
          <!-- </el-form-item> -->
          </div>
          <div v-if="activeEventName === 'video'" >
            <div class="filter-box">
              <div prop="channelNumber">
                通道号：<el-select v-model="formData.channelNumber" multiple placeholder="请选择" @change="videoChange">
                 <!--   channelNumberList-->
                  <el-option
                    v-for="item in loseList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div prop="judgeType">
                诊断类型：<el-select v-model="formData.judgeType" multiple placeholder="请选择"  @change="videoChanges">
                  <el-option v-for="item in judgeTypeAList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div>
                <el-checkbox v-model="formData.videoChecked">启用</el-checkbox>
              </div>
            </div>
          </div>
          <!-- <div>
            新组件table测试  
          </div> -->
          <video-table
            v-if="activeEventName === 'alarm'"
            :selection="false"
            :sequence="false"
            :columns="videoDiagnoseColumns"
            :tableData="deviceErrorTable" 
          >
          </video-table>
           <video-table
            v-if="activeEventName === 'equipment'"
            :selection="false"
            :sequence="false"
            :columns="equipmentList"
            :tableData="equipmentTable" 
          >
          </video-table>
          <video-table
                v-if="activeEventName === 'lose'"
                :selection="false"
                :sequence="false"
                :columns='videoLoseTable'
                :tableData='videoLoseTableData'
                >
              </video-table>
          <video-table
                 v-if="activeEventName === 'mobile'"
                :selection="false"
                :sequence="false"
                :columns='movementDetectionTable'
                :tableData='moveSensesTable'>
              </video-table>
          <video-table
                 v-if="activeEventName === 'video'"
                :selection="false"
                :sequence="false"
                :columns='videoDiagnosisTable'
                :tableData='videoDiagnosisList'>
              </video-table>
           <!-- <el-form-item>
            <el-button type="primary" @click="saveEventManageData()">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        
          <div style=" width:154px;margin:0 auto">
           <el-button type="primary" @click="saveEventManageData()">保存</el-button>
           <el-button>取消</el-button>
          </div>
         
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoTable from '../../../components/eventTable'
import TableResult from './TableResult'
import { DEVICEERROR, MOVESENSE, VIDEOSENSE } from '../../../components/selectConf'
import create from '@src/assets/rules/validation/security/video_eventmanage.js'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'CreateResult',
  props: {
    id: {
      type: String,
      required: true
    },
    reloadChanelInfo: {
      type: Boolean
    },
    devInfo: {
      type: Object
    },
    deviceName: {
      required: true
    },
    jumpType: {
      type: String
    },
    deviceData: {
      type: Object,
      require: true
    }
  },
  components: {
    TableResult,
    VideoTable
  },
  created() {
   this.videoDiagnosisList = this.addlist(this.loseList,this.videoDiagnosisTable,this.videoDiagnosisList)
    this.moveSensesTable=this.loseList.slice().splice(1)
     this.moveSensesTable.forEach(item=>{
     item["type"]="图像监测"
   })
   this.deviceChange(["全部"])
   this.loseChange(["全部"])
  },
  data() {
    return {
      // eventManageRule: create.eventManage, // 表单校验
      formData: {
        alarmtErrorValue:['全部'],
        alarmInputChecked: true, //报警输入
        deviceErrorValue: '',
        deviceExceptionChecked: false,
        moveSenseValue: '',
        mobileDetectionChecked: false,
        channelNumber: '',
        channelNumbers: '',
        judgeType: '', //视频检测
        videoChecked: false,
        loseValue: ['全部'], //视频丢失
        loseChecked: true
      },
      deviceErrorTable: DEVICEERROR.slice().splice(1),
      activeTabName: 'chan',
      // alarmInputChecked: false,
      // deviceExceptionChecked: false,
      // mobileDetectionChecked: false,
      // videoDiagnoseChecked: false,
      // activeEventName: 'alarm',
      activeEventName: 'alarm',
      deviceErrorValue: '',
      loseValue: '', //视频丢失
      deviceErrors: DEVICEERROR,
      // moveSenseValue: '',
      //移动侦测
      moveSenses: MOVESENSE.slice().splice(1),
      moveSensesTable: [],
      videoSenseValue: '',
      videoSenses: VIDEOSENSE,
      //数据默认数据
      videoDiagnoseTableData: [{ label: '快鱼' }, { label: '通道2' }],
      //视频诊断table
      videoDiagnosisList: [],
      //侦测
      mobileTable:[],
      //视频诊断-通道号 下拉数组
      channelNumberList: [],
      channelNumber: '',
      //视频丢失 下拉框
      //videoLoseTable:DEVICEERROR,
      videoLoseTable: [
        { prop: 'value', label: '通道号', width: '200' },
        { prop: 'decStatus', label: '状态', width: '100' }
      ],
      loseList: [
        { label: '全部', value: '全部' },
        { label: '通道1', value: '通道1' },
        { label: '通道2', value: '通道2' },
        { label: '通道3', value: '通道3' },
        { label: '通道4', value: '通道4' }
      ],
      videoLoseTableData: [
        // { label: '全部', value: '全部' },
        { label: '通道1', value: '通道1' },
        { label: '通道2', value: '通道2' },
        { label: '通道3', value: '通道3' },
        { label: '通道4', value: '通道4' }
      ],
      //this.loseList.slice().splice(1),
      judgeTypeAList: [
        { label: '全部', value: '全部' },
        { label: '镜头移位', value: '镜头移位' },
        { label: '视频遮挡', value: '视频遮挡' },
        { label: '清晰度异常', value: '清晰度异常' },
        { label: '亮度异常', value: '亮度异常' }
      ],
      //报警table
      videoDiagnoseColumns: [
        { prop: 'value', label: '报警输入端子', width: '200' },
        { prop: 'decStatus', label: '状态', width: '100' }
      ],
      movementDetectionTable: [
        { prop: 'value', label: '通道号', width: '150' },
        { prop: 'type', label: '侦测类型', width: '100' },
        { prop: 'decStatus', label: '状态', width: '100' }
      ],

      videoDiagnosisTable: [
        { prop: 'name', label: '通道号', width: '100' },
        { prop: 'jingtou', label: '镜头移位', width: '100' },
        { prop: 'name1', label: '视频遮挡', width: '100' },
        { prop: 'name2', label: '清晰度异常', width: '100' },
        { prop: 'class1', label: '亮度异常', width: '100' }
        // { prop: 'name3', label: '信号缺失', width: '100' },
        // { prop: 'name4', label: '画面冻结', width: '100' },
        // { prop: 'class2', label: '噪声检测', width: '100' },
        // { prop: 'name5', label: '偏色检测', width: '100' }
      ],
      passageway: [],
      passageways: [],
      diagnosis: [],
      mobile: []
    }
  },
  mounted() {},
  computed: {
    //  deviceError(){
    //     return  this.deviceErrors
    //   }
  },
  watch: {},
  methods: {
    //通道号数据获取
    videoChange(columns) {
     
      this.passageway = columns
      this.videoDiagnosisList = this.videoDiagnosisChange(this.passageway, this.diagnosis, this.videoDiagnosisList)
    },
    //视频诊断数据获取
    videoChanges(columns) {
      this.diagnosis = columns

      this.videoDiagnosisList = this.videoDiagnosisChange(this.passageway, this.diagnosis, this.videoDiagnosisList)
    },
    //移动侦测通道
    mobileChange(columns) {
      this.passageways = columns
      if(this.mobile.length){
        this.moveSensesTable=this.setTableData(this.passageways,this.moveSensesTable)
      }else{
      this.$notify.success({
        message: '请选择侦测类型',
        // title: '成功'
      })
      }
      // this.videoDiagnosisList = this.videoDiagnosisChange(this.passageways, this.mobile, this.videoDiagnosisList)
    },
    //移动侦测数据获取
    moveSenseChange(columns) {
     this.mobile = columns
     this.moveSensesTable=this.setTableData(this.passageways,this.moveSensesTable)
    },
    //处理video数据
    setVideoList() {
      this.videoDiagnosisList.forEach(() => {})
    },
    //videoListTable
    addlist(data, table, newTable) {
      data.forEach((item, index) => {
        var obj = {}
        table.forEach(key => {
          obj[String(key.prop)] = ''
        })
        obj['name'] = item.label
        newTable.push(obj)
      })
      return newTable
    },

    //视频诊断Table数据处理
    videoDiagnosisChange(rows, cols, table) {
      table.forEach(item => {
        for (let key in item) {
          if (key !== 'name') {
            item[String(key)] = ''
          }
        }
      })
      if (rows.length && cols.length) {
        var diagnosisList = this.videoDiagnosisTable
        table.forEach(item => {
          rows.forEach(eleRow => {
            if (eleRow == '全部') {
              cols.forEach(eleCol => {
                diagnosisList.forEach(ditem => {
                  if (eleCol == '全部') {
                    if (ditem.prop !== 'name') {
                      item[String(ditem.prop)] = '√'
                    }
                  } else {
                    if (eleCol == ditem.label) {
                      item[String(ditem.prop)] = '√'
                    }
                  }
                })
              })
            } else {
              if (item.name == eleRow) {
                cols.forEach(eleCol => {
                  diagnosisList.forEach(ditem => {
                    if (eleCol == '全部') {
                      if (ditem.prop !== 'name') {
                        item[String(ditem.prop)] = '√'
                      }
                    } else {
                      if (eleCol == ditem.label) {
                        item[String(ditem.prop)] = '√'
                      }
                    }
                  })
                })
              }
            }
          })
        })
      }
      console.log(table, '11111111111111111111')
      return table
    },

    //表格状态处理
    // setTableData(data){
    //     data.forEach
    // },

    //选中处理
    deviceChange(columns) {
      console.log(this.deviceErrors)
      var arr = []
      arr = JSON.parse(JSON.stringify(this.deviceErrors))
      arr.forEach(item => {
        item['decStatus'] = ''
      })
      arr.forEach(item => {
        columns.forEach(key => {
          if (key == '全部') {
            item['decStatus'] = '√'
          } else if (key == item['value']) {
            item['decStatus'] = '√'
          }
        })
      })
      this.deviceErrorTable = arr.splice(1)
    },
    // moveSenseChange(columns) {
    //   this.moveSensesTable = this.setTableData(columns, this.moveSensesTable)
    // },
    loseChange(columns) {
       console.log(this.formData.loseValue,this.loseValue,"+++++++++++++++++++++++++++++")
      this.videoLoseTableData = this.setTableData(columns, this.videoLoseTableData)
    },
    //状态判断加对号
    setTableData(columns, data) {
      var arr = JSON.parse(JSON.stringify(data))
      arr.forEach(item => {
        item['decStatus'] = ''
      })
      arr.forEach(item => {
        columns.forEach(key => {
            if (key == '全部') {
            item['decStatus'] = '√'
          } else{
            if (key == item['value']) {
            item['decStatus'] = '√'
          }
          }
        
        })
      })
      return arr
    },
    tabChange(value) {
      console.log(value)
    },
    saveEventManageData() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '功能还没实现',
            type: NOTIFY.TYPE.ERROR
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.create-tab-box {
  
  /deep/ .el-select__tags {
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .button-box {
    margin-bottom: 15px;
  }
  .filter-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0 20px;
    div {
      margin-right: 20px;
    }
  }
}
</style>
