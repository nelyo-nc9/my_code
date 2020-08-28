<template>
  <div class="content">
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>设备信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>操作日志</el-breadcrumb-item>
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
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formData.name" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="formData.userName" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="所属机构" prop="orgName">
                  <!-- <el-input placeholder="输入所属机构" v-model="formData.orgName" class="w-input"></el-input> -->
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
              </div>

              <div class="flex-div">
                <el-form-item label="客户端类型">
                  <el-select v-model="formData.clientType" class="w-input">
                    <el-option label="全部 " value="0"></el-option>
                    <el-option label="B/S " value="1"></el-option>
                    <el-option label="APP " value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                  <el-input v-model="formData.ip" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="操作类型">
                  <el-select v-model="formData.operateType" class="w-input">
                    <el-option
                      v-for="item in positionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="操作对象" prop="object">
                  <el-input v-model="formData.object" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="操作描述" prop="description">
                  <el-input v-model="formData.description" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="动作" prop="action">
                  <el-input v-model="formData.action" class="w-input"></el-input>
                </el-form-item>
              </div>

              <div class="flex-div">
                <el-form-item label="开始时间">
                  <el-date-picker
                    v-model="formData.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    class="w-input"
                  >
                  </el-date-picker
                ></el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="formData.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    class="w-input"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item> </el-form-item>
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
        <div style="width:100%;">
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
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                align="center"
                show-overflow-tooltip
                sortable
              >
                <template slot-scope="scope">
                  <span v-if="item.prop === 'operateType'">{{ operateType[scope.row[item.prop]] }}</span>
                  <span v-if="scope.row[item.prop] === 0 && item.prop === 'clientType'">全部</span>
                  <span v-if="scope.row[item.prop] === 1 && item.prop === 'clientType'">B/S</span>
                  <span v-if="scope.row[item.prop] === 2 && item.prop === 'clientType'">APP</span>
                  <span v-if="item.prop !== 'clientType' && item.prop !== 'operateType'">{{
                    scope.row[item.prop]
                  }}</span>
                </template>
              </el-table-column>
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
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import equipmentInformationManagement from '@src/assets/rules/validation/fire/equipmentInformationManagement.js'
export default {
  name: 'fireFightingSubsystemManagement',
  components: {},
  data() {
    return {
      fireSelection: '', // 选中数据
      total: 0, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      // 查询表单
      formData: {
        // 表单数据
        name: '', // 姓名
        userName: '', // 用户名
        orgName: '', // 所属机构
        clientType: '', // 客户端类型 0-BS 1-APP 查询全部时，该字段不传
        ip: '', // IP地址
        operateType: '', // 操作类型
        object: '', // 操作对象
        description: '', // 操作描述
        action: '', // 动作
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      positionList: [
        // 重点部位下拉选项
        {
          label: '消防系统配置',
          value: 100000
        },
        {
          label: '系统部件管理',
          value: 100001
        },
        {
          label: '消防系统关联配置',
          value: 100002
        },
        {
          label: '系统部件关联配置',
          value: 100003
        },
        {
          label: '消防报警策略配置',
          value: 100004
        },
        {
          label: '消防报警等级及联动录像配置',
          value: 100005
        },
        {
          label: '消防报警联动配置的修改',
          value: 100006
        },
        {
          label: '报警紧急处置',
          value: 100007
        },
        {
          label: '视频复核',
          value: 100008
        },
        {
          label: '发送短信',
          value: 100009
        },
        {
          label: '拒绝开门',
          value: 1000010
        },
        {
          label: '对讲开启',
          value: 1000011
        },
        {
          label: '对讲挂断',
          value: 1000012
        },
        {
          label: '报警输出',
          value: 1000013
        }
      ],
      dropdownStatus: {
        detector: true
      },
      operateType: {
        100000: '消防系统配置',
        100001: '系统部件管理',
        100002: '消防系统关联配置',
        100003: '系统部件关联配置',
        100004: '消防报警策略配置',
        100005: '消防报警等级及联动录像配置',
        100006: '消防报警联动配置的修改',
        100007: '报警紧急处置',
        100008: '视频复核',
        100009: '发送短信',
        1000010: '拒绝开门',
        1000011: '对讲开启',
        1000012: '对讲挂断',
        1000013: '报警输出'
      },
      // 表头
      detectorTableColumn: [
        // 探测器列表项
        {
          prop: 'name',
          label: '姓名',
          width: '100'
        },
        {
          prop: 'userName',
          label: '用户名',
          width: '120'
        },
        {
          prop: 'createdAt',
          label: '时间',
          width: '150'
        },
        {
          prop: 'orgName',
          label: '所属机构',
          width: '180'
        },
        {
          prop: 'clientType',
          label: '客户端类型',
          width: '130'
        },
        {
          prop: 'ip',
          label: 'IP地址',
          width: '150'
        },
        {
          prop: 'operateType',
          label: '操作类型',
          width: '150'
        },
        {
          prop: 'action',
          label: '动作',
          width: '130'
        },
        {
          prop: 'object',
          label: '操作对象',
          width: '150'
        },
        {
          prop: 'result',
          label: '操作结果',
          width: '100'
        },
        {
          prop: 'description',
          label: '操作描述',
          width: '180'
        }
      ],
      // 表格数据
      detectorList: [
        // 探测器列表数据
      ],
      defaultParams: {
        query: {
          limit: 25, // 一页多少条数据
          page: 1 // 第几页
        },
        body: {
          moduleType: 8 // 日志类型  8是消防
        }
        // operateType: 10
      },
      rules: equipmentInformationManagement.fireFightingListRules
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)
    // 查询列表条件
    // this.defaultParams.pageSize = this.pageSize
    // this.defaultParams.page = this.pageCurrent
    // this.getQueryData(this.defaultParams)
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      // console.log(this.pageCurrent)
      return this.pageCurrent
    }
  },
  watch: {
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.query.limit = this.pageSize
      this.saveAlarmHost()
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.query.page = this.pageCurrents
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
          // console.log(err)
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
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID('AlarmList')
    },
    // 查询
    saveAlarmHost(val) {
      if (val) {
        this.defaultParams.query.page = 1
        // this.pageCurrent = 1
      }
      let params = this.$lodash.cloneDeep(this.defaultParams)
      for (var key in this.formData) {
        if (this.formData[key]) {
          if (key === 'clientType' || key === 'operateType') {
            params.body[key] = Number(this.formData[key])
          } else {
            params.body[key] = this.formData[key]
          }
        }
      }
      console.log(params)
      fireInterface.queryOperationLog(params).then(res => {
        if (res.data.code === 0) {
          if (val) {
            this.$notify.success({
              title: '成功',
              message: '查询成功'
            })
          }
          this.detectorList = res.data.data.logs
          this.total = res.data.data.page.totalNumber || 0
          this.pageCurrent = res.data.data.page.page
        } else {
          this.$notify.error({
            title: '失败',
            message: '查询失败'
          })
        }
      })
    },
    // 重置
    clickReset() {
      this.$refs.addForm.clearValidate()
      for (var key in this.formData) {
        this.formData[key] = ''
      }
    },
    // 选中数据
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 改变pageSize
    pageSizeChange(val) {
      // console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      // console.log(this.pageCurrent)
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
        params.logType = 'operation'
        fireInterface.downLog(params).then(res => {})
        // fireInterface
        //   .createHostExcel(this.defaultParams)
        //   .then(res => {
        //     if (res.data.code === 0) {
        //       // zp去掉url中间的/host
        //       let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/fire/v1/system-manage/downFile?fileName=${res.data.data.fileName}`
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
        // .left-form {
        //   /* width: 300px; */
        //   /* margin-right: 24px; */
        // }
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
        width: 85%;
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
          text-align: center;
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
