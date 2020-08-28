<template>
  <div class="content">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>设备信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警日志</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="box-title" @click="toggleOpen('detector')">
          查询条件
          <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div class="form-content" v-if="dropdownStatus.detector">
          <div class="left-form">
            <el-form
              ref="addForm"
              size="mini"
              :model="formData"
              label-position="right"
              :inline="true"
              label-width="120px"
              :rules="rules"
            >
              <div class="flex-div">
                <el-form-item label="所属机构" prop="orgName">
                  <!-- <el-select v-model="formData.orgId" class="w-input">
                    <el-option
                      v-for="item in positionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select> -->
                  <el-autocomplete
                    class="w-input"
                    v-model="formData.orgName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('org', val, callback)
                      }
                    "
                    placeholder="请输入机构"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('org', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <!-- <el-select v-model="formData.locationId" class="w-input">
                    <el-option
                      v-for="item in positionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select> -->
                  <el-autocomplete
                    class="w-input"
                    :disabled="!formData.orgId"
                    v-model="formData.keyPartName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('kp', val, callback)
                      }
                    "
                    placeholder="请输入重点部位"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('kp', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属主机">
                  <el-input placeholder="输入所属主机" v-model="formData.deviceName" class="w-input"></el-input>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="设备位置">
                  <el-input v-model="formData.alarmLocation" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="报警分类">
                  <el-input v-model="formData.alarmTypeName" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="事件类型">
                  <el-input v-model="formData.eventTypeName" class="w-input"></el-input>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="报警等级">
                  <el-select v-model="formData.level" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="item in devBrandList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发生时间">
                  <el-date-picker
                    class="w-input"
                    v-model="startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    class="w-input"
                    v-model="endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="接警时间">
                  <el-date-picker
                    class="w-input"
                    v-model="receiveTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="处警时间">
                  <el-date-picker
                    class="w-input"
                    v-model="dealTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="处理类型">
                  <el-select v-model="formData.dealType" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="item in serverList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="处理意见">
                  <el-input v-model="formData.dealOpinion" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="接警人">
                  <el-input v-model="formData.receivePerson" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="是否升级">
                  <el-select v-model="formData.isUpgrade" class="w-input">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="是" value="T"></el-option>
                    <el-option key="2" label="否" value="F"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="small" @click="saveAlarmHost(1)">查询</el-button>
          <el-button size="small" @click="clickReset">重置</el-button>
          <el-button size="small" @click="exportExcel">导出</el-button>
        </div>
      </div>
      <div class="bottom-box">
        <div>
          <div class="box-title">
            <span class="pointer">
              查询结果
            </span>
          </div>
          <div>
            <el-table
              :data="detectorList"
              border
              style="width: 100%"
              height="600"
              size="mini"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                align="center"
                :width="item.width"
                show-overflow-tooltip
                sortable
              >
                <template slot-scope="scope">
                  <span v-if="item.prop === 'isUpgrade' && scope.row[item.prop] === 'T'">是</span>
                  <span v-if="item.prop === 'isUpgrade' && scope.row[item.prop] === 'F'">否</span>
                  <span v-if="item.prop === 'level' && scope.row[item.prop] === 1">一级</span>
                  <span v-if="item.prop === 'level' && scope.row[item.prop] === 2">二级</span>
                  <span v-if="item.prop !== 'level' && item.prop !== 'isUpgrade'">{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="查看录像" width="120" align="center" show-overflow-tooltip sortable>
                <template slot-scope="scope">
                  <el-button @click.native.prevent="viewVideoBtn(scope.$index, scope.row)" type="text"
                    >查看录像</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作日志" width="150" align="center" show-overflow-tooltip sortable>
                <template slot-scope="scope">
                  <el-button @click.native.prevent="viewLogBtn(scope.$index, scope.row)" type="text"
                    >查看操作日志</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                prop="remark"
                width="180"
                align="center"
                show-overflow-tooltip
                sortable
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="text-align:right;margin:30px 30px 30px 0;">
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                layout="total, sizes,slot, prev"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
              >
                <el-button type="text" @click="pagePrev">首页</el-button>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :page-count="1"
                :total="total"
                :current-page="pageCurrents"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="slot"
              >
                <span>{{ pageCurrents }}/{{ pageCounts }}</span>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="next,slot, jumper"
                ><el-button type="text" @click="pageNext">末页</el-button></el-pagination
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看录像和操作日志 -->
    <div class="alarm-model">
      <AlarmVideo
        :videoControl="alarmVideo.videoStatus"
        :alarmModelData="alarmVideo.alarmData"
        @sureClick="sureVideoClick"
        v-if="alarmVideo.videoStatus"
      ></AlarmVideo>
      <AlarmOperationLog
        :logControl="operLog.logStatus"
        :optLogData="operLog.alarmData"
        @sureClick="sureLogClick"
        v-if="operLog.logStatus"
      ></AlarmOperationLog>
    </div>
  </div>
</template>

<script>
import AlarmVideo from './AlarmVideo'
import AlarmOperationLog from './AlarmOperationLog'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { mapActions, mapMutations } from 'vuex'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import equipmentInformationManagement from '@src/assets/rules/validation/fire/equipmentInformationManagement.js'
export default {
  name: 'fireFightingSubsystemManagement',
  components: { AlarmVideo, AlarmOperationLog, VideoPagination },
  data() {
    return {
      fireSelection: '', // 选中数据
      total: 0, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      startTime: '', // 发生时间 开始和结束中间以逗号可开
      endTime: '', // 结束时间 开始和结束中间以逗号可开
      receiveTime: '', // 接警时间 开始和结束中间以逗号可开
      dealTime: '', // 处警时间 开始和结束中间以逗号可开
      // 查询表单
      formData: {
        // 表单数据
        orgId: '', // 所属机构
        locationId: '', // 所属重点部位
        deviceName: '', // 所属主机
        alarmLocation: '', // 设备位置
        alarmTypeName: '', // 报警分类
        eventTypeName: '', // 事件类型
        level: '', // 报警等级
        startTime: '', // 发生时间 开始和结束中间以逗号可开
        endTime: '', // 结束时间 开始和结束中间以逗号可开
        receiveTime: '', // 接警时间 开始和结束中间以逗号可开
        dealTime: '', // 处警时间 开始和结束中间以逗号可开
        dealType: '', // 处理类型
        dealOpinion: '', // 处理意见
        receivePerson: '', // 接警人
        isUpgrade: '' // 是否升级
      },
      positionList: [
        // 重点部位下拉选项
      ],
      devBrandList: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        }
        // 报警等级下拉选项
      ],
      serverList: [
        // 处理类型下拉选项
        {
          label: '故障',
          value: '故障'
        },
        {
          label: '正常报警',
          value: '正常报警'
        },
        {
          label: '误报',
          value: '误报'
        }
      ],
      dropdownStatus: {
        detector: true
      },
      // 表头
      detectorTableColumn: [
        // 探测器列表项
        {
          prop: 'orgName',
          label: '所属机构',
          width: '180'
        },
        {
          prop: 'locationName',
          label: '所属重点部位',
          width: '180'
        },
        {
          prop: 'deviceName',
          label: '所属主机',
          width: '150'
        },
        {
          prop: 'alarmTypeName',
          label: '报警分类',
          width: '130'
        },
        {
          prop: 'alarmLocation',
          label: '设备位置',
          width: '150'
        },
        {
          prop: 'level',
          label: '报警等级',
          width: '100'
        },
        {
          prop: 'startTime',
          label: '发生时间',
          width: '150'
        },
        {
          prop: 'endTime',
          label: '结束时间',
          width: '150'
        },
        {
          prop: 'receiveTime',
          label: '接警时间',
          width: '150'
        },
        {
          prop: 'dealTime',
          label: '处警时间',
          width: '150'
        },
        {
          prop: 'receivePerson',
          label: '接警人',
          width: '130'
        },
        {
          prop: 'dealType',
          label: '处理类型',
          width: '130'
        },
        {
          prop: 'dealOpinion',
          label: '处理意见',
          width: '180'
        },
        {
          prop: 'isUpgrade',
          label: '是否升级',
          width: '100'
        }
        // {
        //   prop: 'isRelated',
        //   label: '查看录像',
        //   width: ''
        // },
        // {
        //   prop: 'isRelated',
        //   label: '操作日志',
        //   width: ''
        // },
        // {
        //   prop: 'isRelated',
        //   label: '备注',
        //   width: ''
        // }
      ],
      // 表格数据
      detectorList: [
        // 探测器列表数据
      ],
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
      defaultParams: {
        pageSize: 10, // 一页多少条数据
        pageNum: 1 // 第几页
      },
      rules: equipmentInformationManagement.fireFightingSubsystemManagementRules
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)
    this.defaultParams.pageSize = this.pageSize
    this.defaultParams.pageNum = this.pageCurrent
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      console.log(this.pageCurrent)
      return this.pageCurrent
    }
  },
  watch: {
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.saveAlarmHost()
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.pageNum = this.pageCurrents
      this.saveAlarmHost()
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID']),
    ...mapActions(['addAlarmHost']),
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
      }
    },
    // 查询
    saveAlarmHost(val) {
      console.log(this.dealTime)
      if (val) {
        this.defaultParams.pageNum = 1
      }
      this.formData.dealTime = this.dealTime ? this.dealTime[0] + ',' + this.dealTime[1] : ''
      this.formData.startTime = this.startTime ? this.startTime[0] + ',' + this.startTime[1] : ''
      this.formData.endTime = this.endTime ? this.endTime[0] + ',' + this.endTime[1] : ''
      this.formData.receiveTime = this.receiveTime ? this.receiveTime[0] + ',' + this.receiveTime[1] : ''
      let params = this.$lodash.cloneDeep(this.defaultParams)
      for (var key in this.formData) {
        if (this.formData[key]) {
          // if (key === 'level') {
          //   params[key] = Number(this.formData[key])
          // } else {
          params[key] = this.formData[key]
          // }
        }
      }
      fireInterface.firelog(params).then(res => {
        if (res.data.code === 0) {
          if (val) {
            this.$notify.success({
              title: '成功',
              message: '查询成功'
            })
          }
          this.detectorList = res.data.data.results
          this.total = res.data.data.page.sum
          this.pageCurrent = res.data.data.page.pageNum
        } else {
          this.$notify.error({
            title: '失败',
            message: '查询失败'
          })
        }
      })
      // .catch(_ => {
      //   this.$notify.error({
      //     title: '失败',
      //     message: '查询失败'
      //   })
      // })
    },
    // 重置
    clickReset() {
      this.startTime = ''
      this.endTime = ''
      this.receiveTime = ''
      this.dealTime = ''
      for (var key in this.formData) {
        this.formData[key] = ''
      }
    },
    // 选中数据
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 查看录像
    viewVideoBtn(index, row) {
      console.log(row)
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
    // 改变pageSize
    pageSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      console.log(this.pageCurrent)
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    },
    // 导出excel
    exportExcel() {
      let tHeader = [] // 表头
      let filterVal = [] // 数据
      let filename = '消防设备信息管理报警日志查询列表'
      this.detectorTableColumn.map(n => {
        tHeader.push(n.label)
        filterVal.push(n.prop)
      })
      if (this.fireSelection.length) {
        // 有数据走前端导出
        handleExport(tHeader, filterVal, filename, this.fireSelection)
      } else if (this.detectorList.length > 0 && this.fireSelection.length === 0) {
        // 无数据走接口
        // let params = this.$lodash.cloneDeep(this.formData)
        let params = {}
        params.logType = 'fire'
        fireInterface.downLog(params).then(res => {})
        // fireInterface
        //   .createHostExcel(this.defaultParams)
        //   .then(res => {
        //     if (res.data.code === 0) {
        //       // zp去掉url中间的/host
        //       let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/fire/v1/log/excel?logType=fire`
        //       let name = `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        //       download(
        //         url,
        //         name,
        //         () => {},
        //         () => {
        //           this.$message({ type: 'info', message: '导出文件下载失败！' })
        //         },
        //         () => {},
        //         'get'
        //       )
        //     } else {
        //       this.$notify.error({
        //         message: '导出失败',
        //         title: '失败'
        //       })
        //     }
        //   })
        //   .catch(_ => {
        //     this.$notify.error({
        //       message: '导出接口错误',
        //       title: '错误'
        //     })
        //   })
      } else {
        this.$notify.warning({
          message: '列表暂无数据',
          title: '警告'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 240px;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px;
    flex: 1;
    display: flex;
    width: 100%;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-content {
        display: flex;
        /* width: 644px; */
        padding: 10px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        .left-form {
          width: 85%;
        }
        // .right-form {
        //   /* width: 300px; */
        // }
      }
      .form-footer {
        margin-top: 12px;
        width: 100%;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
    }
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      i {
        position: absolute;
        top: 50%;
        left: 100px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 120px;
        margin-top: -12px;
      }
    }
    .pointer {
      cursor: pointer;
      display: inline-block;
      width: 120px;
    }
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
  }
}

.m-input {
  margin-right: 14px;
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
<style lang="less" scoped>
.content {
  .right-content {
    .form-box {
      .left-form {
        margin: 0 auto;
        background: #f5f5f5;
        padding: 34px 20px 20px 0;
      }
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          border: 1px solid #fff;
          background: #f2f2f2;
        }
      }
    }
  }
}
.form-box {
  margin-top: 20px;
}

.flex-div {
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
  margin-bottom: 14px;
  .el-form-item--mini,
  .el-form-item {
    width: 33%;
    display: flex;
    /deep/.el-form-item__label {
      background: #f5f5f5 !important;
      height: 35px !important;
      line-height: 35px !important;
      text-align: center;
    }
    /deep/.el-form-item__content {
      flex: 1;
      max-width: 356px;
    }
  }
  .w-input {
    width: 100%;
    max-width: 356px;
    height: 35px;
  }
  .w-time {
    width: 47.9%;
    max-width: 172px;
    height: 35px;
  }
}
</style>
