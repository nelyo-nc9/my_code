<template>
  <div class="alarm-log">
   
    <div class="alarm-log-top">
      <div class="zone-header">

      </div>
      <div class="alarm-log-inquire" v-if="collapseStatus.inquireInfo">
        <div class="alarm-log-select">
          <ul>
            <li>
              <i>门禁平台名称</i>
              <el-select v-model="formInline.orgName" size="mini">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </li>
            <li>
              <i>所属重点部位</i>
              <span>监控中心</span>
            </li>
            <li>
              <i>所属机构</i>
              <el-input v-model="formInline.devName" size="mini"></el-input>
            </li>
            <li>
              <i>资源名称</i>
              <el-input v-model="formInline.resourceName" size="mini"></el-input>
            </li>
            <li>
              <i>日志类型</i>
              <el-input v-model="formInline.alarmSort" size="mini"></el-input>
            </li>
            <li>
              <i>日志子类型</i>
              <el-input v-model="formInline.eventType" size="mini"></el-input>
            </li>
            <li>
              <i>门禁主机名称</i>
              <el-select v-model="formInline.subsystemName" size="mini">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </li>
            <li>
              <i>门禁通道名称</i>
              <el-select v-model="formInline.level" size="mini">
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <i>卡号</i>
              <el-input v-model="formInline.nums" size="mini"></el-input>
            </li>
            <li>
              <i>姓名</i>
              <el-input v-model="formInline.name" size="mini"></el-input>
            </li>
            <li>
              <i>性别</i>
              <el-select v-model="formInline.subsystemName" size="mini">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </li>
            <li>
              <i>身份证</i>
              <el-input type="number" v-model="formInline.card" size="mini"></el-input>
            </li>
            <li>
              <i>部门</i>
              <el-select v-model="formInline.dealType" size="mini">
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </li>
            <li>
              <i>职务</i>
              <el-input v-model="formInline.opinion" size="mini"></el-input>
            </li>
            <li>
              <i>开始时间</i>
              <el-date-picker
                v-model="formInline.occurTime"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                range-separator="至"
              ></el-date-picker>
            </li>
            <li>
              <i>结束时间</i>
              <el-date-picker
                v-model="formInline.endTime"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                range-separator="至"
              ></el-date-picker>
            </li>
          </ul>
        </div>
        <div class="alarm-log-btn">
          <el-button type="primary" @click="inquireClick" size="mini">查询</el-button>
          <el-button type="primary" @click="resetClick" size="mini">重置</el-button>
          <el-button @click="exportClick" size="mini">导出</el-button>
        </div>
      </div>
    </div>
    <div class="alarm-log-bottom">
      <div class="zone-header">
  
      </div>
      <div class="alarm-log-result">
        <div class="log-result-btn" v-if="printStatus">
          <el-button class="part-info-btn" size="small" @click="printClick">打印</el-button>
          <el-button size="small" @click="closePrint">关闭</el-button>
        </div>
        <div class="log-result-table" v-if="!printStatus">
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @row-click="rowDataClick"
            height="460"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column
              v-for="(item,index) in tableColumn"
              :key="index"
              :prop="item.mark"
              :label="item.label"
              :width="item.width"
            ></el-table-column>
            <el-table-column label="查看录像" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="viewVideoBtn(scope.$index, scope.row)"
                  size="mini"
                >查看录像</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作日志" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="viewLogBtn(scope.$index, scope.row)"
                  size="mini"
                >查看操作日志</el-button>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="120"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="hostCurrentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="hostTotal"
          ></el-pagination>
        </div>
        <div class="log-info" v-if="printStatus">
          <ul>
            <li v-for="(item, index) in printColumn" :key="index">
              <span>{{item.label}}</span>
              <div class="info">{{item.info ? item.info : ''}}</div>
            </li>
            <li>
              <span>查看录像</span>
              <div class="info">
                <el-button @click.native.prevent="viewLogBtn('', printData)" size="mini">查看录像</el-button>
              </div>
            </li>
            <li>
              <span>操作日志</span>
              <div class="info">
                <el-button @click.native.prevent="viewLogBtn('', printData)" size="mini">查看操作日志</el-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 查看录像和操作日志 -->
    <!-- <div class="alarm-model">
      <AlarmVideo
        :videoControl="alarmVideo.videoStatus"
        :alarmModelData="alarmVideo.alarmData"
        @sureClick="sureVideoClick"
        v-if="alarmVideo.videoStatus"
      ></AlarmVideo>
      <AlarmOperationLog
        :logControl="operLog.logStatus"
        :alarmModelData="operLog.alarmData"
        @sureClick="sureLogClick"
        v-if="operLog.logStatus"
      ></AlarmOperationLog>
    </div> -->
  </div>
</template>

<script>
export default {
  components: {
    // AlarmVideo: () => import('./components/AlarmVideo'),
    // AlarmOperationLog: () => import('./components/AlarmOperationLog')
  },
  data() {
    return {
      formInline: {
        card: 1231231321321313,
        name: 'key',
        nums: '140221',
        orgName: '',
        keyPart: '',
        devName: '',
        resourceName: '',
        alarmSort: '',
        eventType: '',
        subsystemName: '',
        level: 'all',
        occurTime: [],
        endTime: [],
        receiveTime: [],
        dealTime: [],
        dealType: '',
        opinion: '',
        upgrade: 'all' // 是否升级
      },
      upgradeList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'yes',
          label: '是'
        },
        {
          value: 'no',
          label: '否'
        }
      ],
      levelList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '1级'
        },
        {
          value: '2',
          label: '2级'
        },
        {
          value: '3',
          label: '3级'
        },
        {
          value: '4',
          label: '4级'
        },
        {
          value: '5',
          label: '5级'
        }
      ],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      multipleSelection: [],
      tableColumn: [
        {
          mark: 'subsystem',
          label: '所属子系统',
          width: '120'
        },
        {
          mark: 'orgName',
          label: '所属机构',
          width: '120'
        },
        {
          mark: 'keySite',
          label: '所属重点部位',
          width: '120'
        },
        {
          mark: 'device',
          label: '所属门禁主机',
          width: '120'
        },
        {
          mark: 'alarmSort',
          label: '门禁通道名称',
          width: '120'
        },
        {
          mark: 'eventType',
          label: '日志类型',
          width: '120'
        },
        {
          mark: 'systemNum',
          label: '日志子类型',
          width: '120'
        },
        {
          mark: 'resource',
          label: '时间',
          width: '120'
        },
        {
          mark: 'alarmLevel',
          label: '卡号',
          width: '120'
        },
        {
          mark: 'occurTime',
          label: '姓名',
          width: '120'
        },
        {
          mark: 'endTime',
          label: '性别',
          width: '120'
        },
        {
          mark: 'callAlarmTime',
          label: '身份证',
          width: '120'
        },
        {
          mark: 'policeAlarmTime',
          label: '部门',
          width: '120'
        },
        {
          mark: 'callAlarmPeople',
          label: '职务',
          width: '120'
        },
        {
          mark: 'dealType',
          label: '照片',
          width: '120'
        }
      ],
      collapseStatus: {
        inquireInfo: true
        // inquireList: true
      },
      // 视频弹框状态
      alarmVideo: {
        videoStatus: false,
        alarmData: ''
      },
      // 操作日志状态
      operLog: {
        logStatus: false,
        alarmData: ''
      },
      printStatus: false,
      printColumn: [],
      printData: ''
    }
  },
  created() {
    let startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    let endTime = new Date()
    this.formInline.occurTime.push(startTime, endTime) //发生时间
    this.formInline.endTime.push(startTime, endTime) //结束时间
    this.formInline.receiveTime.push(startTime, endTime) //接警时间
    this.formInline.dealTime.push(startTime, endTime) //处警时间
  },
  methods: {
    // 折叠面板
    collapseClick(key) {
      this.collapseStatus[key] = !this.collapseStatus[key] //true || false
      if (this.collapseStatus[key]) {
        Object.keys(this.collapseStatus).forEach(item => {
          if (item !== key) {
            this.collapseStatus[item] = false
          }
        })
      }
    },
    // 查询按钮
    inquireClick() {
      this.tableData.push({
        subsystem: '办公区',
        orgName: '大楼',
        keySite: '会议室'
      })
    },
    // 重置
    resetClick() {
      //重新调用接口将筛选数据重置
    },
    // 导出
    exportClick() {},
    // 查看录像
    viewVideoBtn(index, row) {
      console.log('~~查看录像~~', index, row)
      this.alarmVideo.videoStatus = true
      this.alarmVideo.alarmData = row
    },
    // 查看录像弹框关闭事件
    sureVideoClick(data) {
      this.alarmVideo.videoStatus = data
    },
    // 查看操作日志
    viewLogBtn(index, row) {
      this.operLog.logStatus = true
      this.operLog.alarmData = row
    },
    // 操作日志弹框关闭事件
    sureLogClick(data) {
      this.operLog.logStatus = data
    },
    // 行选中信息
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选中信息', val)
    },
    // 行点击
    rowDataClick(row) {
      this.printData = row
      this.printStatus = true
      this.printColumn = this.tableColumn.slice(1, this.tableColumn.length)
      this.printColumn.forEach(item => {
        if (item.mark !== 'subsystem') {
          item.info = row[item.mark]
        }
      })
    },
    // 报警主机列表每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 报警主机列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 打印
    printClick() {},
    // 关闭打印
    closePrint() {
      this.printStatus = false
    }
  }
}
</script>

<style scoped lang="less">
.alarm-log {
  padding: 20px;
  height: 100%;
  overflow: hidden;
  .host-header {
    margin-bottom: 15px;
  }
  .alarm-log-inquire {
    margin: 10px 0;
    .alarm-log-select {
      overflow: hidden;
      border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
        margin: 10px;
        width: 1200px;
        li {
          float: left;
          width: 40%;
          margin: 0 2px 2px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 136px;
            line-height: 32px;
            text-align: center;
            background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-date-editor--datetimerange.el-input,
          .el-date-editor--datetimerange.el-input__inner {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-select {
            width: 330px !important;
            margin-top: 2px;
          }
        }
      }
      .alarm-time {
        width: 520px;
      }
    }
    .alarm-log-btn {
      width: 1438px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .alarm-log-bottom {
    height: calc(100% - 300px);
    .alarm-log-result {
      .log-result-btn {
        margin: 10px 0;
      }
      .log-result-table {
        overflow: hidden;
        .el-pagination {
          float: right;
          margin: 10px 0;
        }
      }
      .log-info {
        width: 800px;
        overflow: hidden;
        border: 1px solid #bcbcbc;
        ul {
          padding: 10px;
          overflow: hidden;
          li {
            width: 50%;
            float: left;
            height: 36px;
            line-height: 36px;
            background: #f2f2f2;
            span {
              float: left;
              width: 120px;
              border-right: 1px solid #fff;
              padding-left: 10px;
            }
            .info {
              float: left;
              overflow: hidden;
              padding-left: 20px;
            }
          }
          li:nth-child(4n + 3) {
            background: #fff;
          }
          li:nth-child(4n + 4) {
            background: #fff;
          }
        }
      }
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;


  }
}
</style>
<style lang="less">
.alarm-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.alarm-log .el-form--inline .el-form-item__content {
  width: 200px !important;
}
</style>

