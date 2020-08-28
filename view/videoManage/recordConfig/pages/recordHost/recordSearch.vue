<template>
  <div class="recordSearch">
    <breadcrumb :breadcrumbItem="['视频管理', '录像计划配置', '录像计划查询']"></breadcrumb>
    <div class="main">
      <!-- 搜索项 -->
      <div class="searchBox">
        <el-divider content-position="left">
          <span class="pointer" @click="toggleOpen">
            查询条件
            <i :class="searchToggle ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </el-divider>
        <div v-show="searchToggle">
          <!--  -->
          <div class="condition-box">
            <div class="query-form">
              <el-form :rules="checkForm" ref="options" :model="options">
                <el-form-item label="所属机构" prop="orgName">
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    v-model="options.orgName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('org', val, callback)
                      }
                    "
                    placeholder="请输入所属机构"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('org', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位" prop="keyPartName">
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    v-model="options.keyPartName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('kp', val, callback)
                      }
                    "
                    placeholder="请输入所属重点部位"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('kp', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="存储位置" prop="storageServerId">
                  <el-select v-model="options.storageServerId" size="mini">
                    <el-option
                      v-for="(e, i) of storageLocOption"
                      :label="e.label"
                      :value="e.value"
                      :key="i"
                    ></el-option> </el-select
                ></el-form-item>
                <el-form-item label="录像计划名称" prop="name">
                  <el-input v-model="options.name" placeholder="请输入录像计划名称" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="资源名称" prop="channelName">
                  <el-input v-model="options.channelName" placeholder="请输入资源名称" size="mini"></el-input
                ></el-form-item>
                <el-form-item label="IP地址" prop="ip">
                  <el-input
                    v-model="options.ip"
                    placeholder="请输入IP地址"
                    size="mini"
                    :class="{ ipVerify: !ipVerify }"
                  ></el-input
                ></el-form-item>
                <el-form-item label="录像计划" prop="planTemplateId">
                  <el-select v-model="options.planTemplateId" size="mini">
                    <el-option
                      v-for="(e, i) of recordPlanOption"
                      :label="e.label"
                      :value="e.value"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="录像状态" prop="status">
                  <el-select v-model="options.status" size="mini">
                    <el-option
                      v-for="(e, i) of deviceTypeOption"
                      :label="e.label"
                      :value="e.value"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="录像码流" prop="streamType">
                  <el-select v-model="options.streamType" size="mini">
                    <el-option
                      v-for="(e, i) of recordCodeOption"
                      :label="e.label"
                      :value="e.value"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="录入机构" prop="updatedDept">
                  <el-input v-model="options.updatedDept" placeholder="请输入录入机构" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="录入人" prop="updatedBy">
                  <el-input v-model="options.updatedBy" placeholder="请输入录入人" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="录入时间" prop="">
                  <el-date-picker
                    v-model="options.updatedAt"
                    type="datetimerange"
                    :editable="false"
                    :clearable="false"
                    size="mini"
                    format="yyyy-MM-dd HH:mm:ss"
                    align="center"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker
                ></el-form-item>
              </el-form>
            </div>
            <div class="opt-button">
              <el-button @click="search" size="small" type="primary">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
              <el-button icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFun" size="small">导出</el-button>
            </div>
          </div>
          <!--  -->
          <!-- <div class="search" v-if="false">
            <div class="item">
              <span>所属机构</span>
              <el-autocomplete
                class="inline-input"
                size="mini"
                v-model="options.orgName"
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
            </div>
            <div class="item">
              <span>所属重点部位</span>
              <el-autocomplete
                class="inline-input"
                size="mini"
                v-model="options.keyPartName"
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
            </div>
            <div class="item">
              <span>存储位置</span>
              <el-select v-model="options.storageServerId" size="mini">
                <el-option v-for="(e, i) of storageLocOption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>录像计划名称</span>
              <el-input v-model="options.name" placeholder="请输入录像计划名称" size="mini"></el-input>
            </div>
            <div class="item">
              <span>资源名称</span>
              <el-input v-model="options.channelName" placeholder="请输入资源名称" size="mini"></el-input>
            </div>
            <div class="item">
              <span>IP地址</span>
              <el-input
                v-model="options.ip"
                placeholder="请输入IP地址"
                size="mini"
                :class="{ ipVerify: !ipVerify }"
              ></el-input>
            </div>
            <div class="item">
              <span>录像计划</span>
              <el-select v-model="options.planTemplateId" size="mini">
                <el-option v-for="(e, i) of recordPlanOption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>录像状态</span>
              <el-select v-model="options.status" size="mini">
                <el-option v-for="(e, i) of deviceTypeOption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>录像码流</span>
              <el-select v-model="options.streamType" size="mini">
                <el-option v-for="(e, i) of recordCodeOption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>录入机构</span>
              <el-input v-model="options.updatedDept" placeholder="请输入机构名称" size="mini"></el-input>
            </div>
            <div class="item">
              <span>录入人</span>
              <el-input v-model="options.updatedBy" placeholder="请输入录入人姓名" size="mini"></el-input>
            </div>
            <div class="item">
              <span>录入时间</span>
              <el-date-picker
                v-model="options.updatedAt"
                type="datetimerange"
                :editable="false"
                :clearable="false"
                size="mini"
                format="yyyy-MM-dd HH:mm:ss"
                align="center"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div> -->
          <!-- <div class="btn" v-if="false">
            <el-button @click="search" size="small" type="primary">查询</el-button>
            <el-button @click="reset" size="small">重置</el-button>
            <el-button @click="exportFun" size="small">导出</el-button>
          </div> -->
        </div>
      </div>
      <!-- 查询结果 -->
      <div class="table" :class="[searchToggle ? 'smallHight' : 'bigHight']">
        <el-divider content-position="left">
          <span class="pointer" @click="tableToggle = !tableToggle">查询结果</span>
          <i :class="tableToggle ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </el-divider>
        <div class="list-box" v-show="tableToggle">
          <el-table
            v-loading="loading"
            stripe
            border
            size="small"
            :data="tableData"
            @select="select"
            @select-all="select"
            height="100%"
            style="width: 100%;height: 100%;"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            empty-text
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" prop="index" type="index" :index="indexMethod" width="60" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) of columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="false"
              :formatter="formatterTable"
            ></el-table-column>
          </el-table>
        </div>
        <video-pagination
          v-show="tableToggle"
          ref="listPagination"
          :total="pageInfo.total"
          @paginationConfChange="paginationConfChange"
        ></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable standard/no-callback-literal */

import breadcrumb from '../common/breadcrumb.vue'
import VideoPagination from '../../../components/VideoPagination'
import {
  getSearchRecordPlanApi, // 获取录像计划列表（定时/事件）
  getOrganizationalApi, // 机构树-懒加载-纯机构
  getSearchOrgApi // 机构、重点部位模糊查询
} from '@src/http/video/recordConfig.api.js'
import { mapGetters } from 'vuex'
import common from '../common'
import create from '@src/assets/rules/validation/security/video/video_searchmany.js'
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
  name: 'recordSearch',
  mixins: [common],
  components: {
    VideoPagination,
    breadcrumb
  },
  created() {
    // this.pageInfo.limit = this.$PageInfo.limit
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '220' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '130' },
        { prop: 'channelName', sortable: true, label: '资源名称', width: '130' },
        { prop: 'storageServerId', sortable: false, label: '存储位置', width: '220' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '120' },
        { prop: 'name', sortable: true, label: '录像计划名称', width: '130' },
        { prop: 'planTemplateId', sortable: true, label: '录像计划', width: '100' },
        { prop: 'status', label: '录像状态', width: '100' },
        { prop: 'streamType', label: '录像码流', width: '120' },
        { prop: 'updatedDept', label: '录入机构', width: '220' },
        { prop: 'updatedBy', label: '录入人', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      searchToggle: true,
      tableToggle: true,
      options: {
        orgId: '', // 所属机构Id
        orgName: '', // 机构名称
        keyPartId: '', // 所属重点部位Id
        keyPartName: '', // 所属重点部位名称
        channelName: '', // 资源名称(资源名称)
        storageServerId: '', // 存储位置
        name: '', // 录像计划名称
        ip: '', // IP地址
        planTemplateId: '', // 计划模板id
        status: '', // 1启用，2停用
        streamType: '', // 录像码流类型 1主码流，2子码流，3.第三码流
        updatedDept: '', // 录入机构
        updatedBy: '', // 录入人
        updatedAt: '', // 录入时间
        planTaskType: 1 // 1定时，2事件
      },
      pageInfo: {
        // 页码组件返回参数
        limit: 25,
        page: 1,
        total: 0 // 总页码
      },
      selectData: [], // 选中项
      treeRoot: { oId: '', orgName: '' }, // 树根数据
      checkForm: create.searchCheck_recordHost_recordSearch // 表单校验
    }
  },
  computed: {
    ...mapGetters('videoManage', {
      storageLocOption: 'storageLocAllOption', // 存储位置
      deviceTypeOption: 'deviceTypeAllOption', // 启用停用备选项
      recordCodeOption: 'recordCodeAllOption', // 录像码流
      recordPlanOption: 'recordPlanAllOption' // 时间模板
    }),
    ipVerify: function() {
      // 是否为ip格式，true/false
      if (this.options.ip) {
        return Boolean(this.judgeIPAdd(this.options.ip))
      }
      return true
    }
  },
  methods: {
    // 获取列表信息
    getTableList(page) {
      let params = {
        page,
        limit: this.pageInfo.limit
      }
      for (let k in this.options) {
        if (this.options[k]) {
          switch (k) {
            case 'updatedAt':
              params['updatedAtStart'] = this.formatTime(this.options[k][0])
              params['updatedAtEnd'] = this.formatTime(this.options[k][1])
              break
            case 'orgId':
              params[k] = this.options[k] + ''
              break
            case 'keyPartId':
              params[k] = this.options[k] + ''
              break
            case 'channelName':
              params[k] = this.options[k] + ''
              break
            case 'ip':
              params[k] = this.options[k] + ''
              break
            default:
              // if (k !== 'orgName') {
              //   params[k] = this.options[k]
              // }
              break
          }
        }
      }
      params.like = {
        name: this.options.name, // 录像计划名称
        updatedDept: this.options.updatedDept, // 录入机构
        updatedBy: this.options.updatedBy // 录入人
      }
      params.equal = {
        storageServerId: this.options.storageServerId, // 存储位置
        planTemplateId: this.options.planTemplateId, // 计划模板id
        status: this.options.status, // 1启用，2停用
        streamType: this.options.streamType, // 录像码流类型 1主码流，2子码流，3.第三码流
        planTaskType: 1 // 1定时，2事件
      }
      if (!this.ipVerify) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请输入正确格式的IP地址',
          type: NOTIFY.TYPE.WARNING
        })
        return
      }
      this.tableData = []
      this.loading = true
      getSearchRecordPlanApi(params)
        .then(res => {
          this.loading = false
          if (!res.data.code) {
            if (!res.data.data || !res.data.data.hasOwnProperty('plans')) {
              this.pageInfo.total = 0
            } else {
              let param = []
              res.data.data.plans.forEach(e => {
                param.push({
                  id: e.id, // string 录像计划id
                  // oId: e.oId, // string 所属机构id
                  orgName: e.orgName, // string 所属机构名称
                  // kpId: e.keyPartId, // string 所属重点部位id
                  keyPartName: e.keyPartName, // string 所属重点部位名称
                  // resId: e.rId, // string 资源id
                  channelName: e.channelName, // string 资源名称
                  status: e.status, // integer 录像状态  1启用，2停用
                  streamType: e.streamType, // integer 录像码流类型 1主码流，2子码流，3.第三码流
                  planTemplateId: e.planTemplateId, // integer 录像计划模板id
                  name: e.name, // string 录像计划模板名称
                  // storageServer: e.storageServerId, // string 存储设备名称Id
                  storageServerId: e.storageServerId, // string 存储设备名称名称
                  ip: e.ip, // string ip地址
                  storagePath: e.storagePath, // integer 存储路径
                  // planTaskType: e.planTaskType, // integer 录像类型 1定时，2事件
                  updatedBy: e.updatedBy, // string 录入人
                  updatedDept: e.updatedDept, // string 录入机构
                  updatedAt: e.updatedAt // string 修改时
                })
              })
              let paginationConfig = {}
              paginationConfig['limit'] = param.length
              paginationConfig['page'] = (this.pageInfo.page) - 1
              param.forEach((item, index) => {
                item['index'] = (index + 1) + paginationConfig.page * paginationConfig.limit
              })
              this.tableData = param
              this.pageInfo.total = res.data.data.total
              if (this.pageInfo.page === 1) {
                this.$notify({
                  title: NOTIFY.TITLE.SUCCESS,
                  message: '录像计划查询成功',
                  type: NOTIFY.TYPE.SUCCESS
                })
              }
            }
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '录像计划查询失败，请稍后重试',
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 搜索栏显隐性
    toggleOpen() {
      this.searchToggle = !this.searchToggle
    },
    select(s, row) {
      this.selectData = s
    },
    // 查询
    search() {
      this.$refs['options'].validate(valid => {
        if (valid) {
          this.setPageInfo()
          this.getTableList(1)
        }
      })
    },
    // 导出
    exportFun() {
      const key = [
        'index',
        'orgName',
        'keyPartName',
        'channelName',
        'storageServerId',
        'ip',
        'name',
        'planTemplateId',
        'status',
        'streamType',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      const title = [
        '序号',
        '所属机构',
        '所属重点部位',
        '资源名称',
        '存储位置',
        'IP地址',
        '录像计划名称',
        '录像计划',
        '录像状态',
        '录像码流',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      this.exportExcel(
        title,
        key,
        this.selectData,
        this.tableData,
        `录像计划查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`,
        { ...this.options },
        'inquery'
      )
    },
    // 重置
    reset() {
      this.options.orgId = '' // 所属机构Id
      this.options.orgName = '' // 所属机构Id
      this.options.keyPartId = '' // 所属重点部位Id
      this.options.keyPartName = '' // 所属重点部位名称
      this.options.channelName = '' // 资源名称(资源名称)
      this.options.storageServerId = '' // 存储位置
      this.options.name = '' // 录像计划名称
      this.options.ip = '' // IP地址
      this.options.planTemplateId = '' // 计划模板id
      this.options.status = '' // 1启用，2停用
      this.options.streamType = '' // 录像码流类型 1主码流，2子码流，3.第三码流
      this.options.updatedDept = '' // 录入机构
      this.options.updatedBy = '' // 录入人
      this.options.updatedAt = '' // 录入时间
    },
    // 页码控件返回参数
    paginationConfChange(obj) {
      this.pageInfo.page = obj.page
      this.pageInfo.limit = obj.limit
    },
    // 设置页码
    setPageInfo(page = 1) {
      this.pageInfo.page = page
      this.$refs.listPagination.setPaginationConfig({ page: this.pageInfo.page, limit: this.pageInfo.limit })
    },
    // 机构树接口
    lazyTreeApi(param) {
      return getOrganizationalApi(param)
    },
    // 监听机构树
    // clickData(data) { :disabled="!options.orgId"
    //   if (JSON.parse(JSON.stringify(data)) !== '{}') {
    //     this.options.oId = data.id
    //     this.options.orgName = data.name
    //     if (data.isRoot) {
    //       this.treeRoot = { oId: data.id, orgName: data.name }
    //     }
    //   }
    // },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.options.orgId : undefined
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
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        // this.options.oId = val.serial
        this.options.orgId = val.id
      } else if (type === 'kp') {
        this.options.keyPartId = val.id
      }
    }
  }
}
</script>

<style lang="less" scoped>
.recordSearch {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .main {
    margin: 16px 16px 0;
    height: calc(~'100% - 40px');
    min-height: 720px;overflow: auto;
    display: flex;
    flex-direction: column;
    /deep/ .el-divider__text.is-left {
      left: 0;
    }
    .searchBox {
      width: 100%;height: 340px;
      & > div:nth-child(2) {
        margin: 16px;
        transition-property: height;
        transition-duration: 500ms;
        transition-timing-function: linear;
        overflow: hidden;
      }
      .pointer {
        cursor: pointer;
        user-select: none;
      }
      .condition-box {
        width: 100%;
        .query-form {
          width: 100%;
          background: rgba(245, 245, 245, 1);
          padding: 16px 16px 2px 16px;
          box-sizing: border-box;
          /deep/ .el-form {
            display: flex;
            flex-wrap: wrap;
          /deep/ .el-form-item {
              // flex:1;
              // flex-wrap: wrap;
              margin-right: 10px;
              display: inline-block;
              width: 19.23%;
              // width: 24%;
              .el-form-item__label {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                width: 96px;
              }
              .el-form-item__content {
                display: inline-block;
                width: calc(~'100% - 96px');
                .el-select {
                  width: 100%;
                  .el-input__inner {
                    width: 100%;
                    height: 35px;
                    border-radius: 0px;
                  }
                }
                .el-autocomplete {
                  width: 100%;
                  .el-input__inner {
                    width: 100%;
                    height: 35px;
                    border-radius: 0px;
                  }
                }
                .el-input {
                  width: 100%;
                  .el-input__inner {
                    width: 100%;
                    height: 35px;
                    border-radius: 0px;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                  }
                }
                .el-range-editor {
                  width: 100%;
                }
              }
            }
            // .el-form-item:first-child {
            //   // width: 17.27%;
            //   width: 23%;
            //   .el-form-item__label {
            //     width: 60px;
            //   }
            //   .el-form-item__content {
            //     width: calc(~'100% - 60px');
            //   }
            // }
            // .el-form-item:nth-child(4n) {
            //   margin-right: 0px;
            // }
            // .el-form-item:nth-child(4n + 1) {
            //   // width: 17.27%;
            //   width: 23%;
            //   .el-form-item__label {
            //     width: 60px;
            //   }
              // .el-form-item__content {
              //   width: calc(~'100% - 60px');
              // }
            // }
          }
        }
        .opt-button {
          text-align: center;
          margin-top: 30px;
        }
      }
      // .search {
      //   background: rgba(245, 245, 245, 1);
      //   padding: 15px 10px 5px 0px;
      //   display: flex;
      //   flex-wrap: wrap;
      //   justify-content: space-between;
      //   max-width: 1712px;
      //   min-width: 1408px;
      //   .item {
      //     width: 25%;
      //     height: 60px;
      //     margin-bottom: 1px;
      //     display: flex;
      //     > span {
      //       display: inline-block;
      //       width: 140px;
      //       text-align: center;
      //       height: 30px;
      //       margin-right: 10px;
      //       background-color: #f8f8f8;
      //       line-height: 30px;
      //     }
      //     > div {
      //       width: calc(~'100% - 116px');
      //       max-width: 240px;
      //       height: 30px;
      //       display: inline-block;
      //     }
      //     // ip格式校验警告色
      //     .ipVerify.el-input /deep/ .el-input__inner {
      //       border-color: #f56c6c;
      //     }
      //     &:last-child {
      //       display: flex;
      //       > div {
      //         display: flex;
      //         left: 3px;
      //         /deep/ .el-input__icon.el-range__close-icon {
      //           display: none;
      //         }
      //       }
      //     }
      //   }
      //   // 修改机构树高度，适配下拉弹窗
      //   /deep/ .treeBox {
      //     & .treeInfo,
      //     & .treeIcon,
      //     & .treeText {
      //       height: 24px;
      //       line-height: 24px;
      //     }
      //   }
      // }
      .btn {
        margin-top: 32px;
        text-align: center;
      }
    }
    .table {
      flex: 1;display: flex;
      flex-direction: column;
      width: 100%;
      .list-box{
        width: 100%;
        height: calc(~'100% - 90px');
      }
      // /deep/ table tr th.is-sortable > .cell {
      //   top: 2px;
      // }
      // &.smallHight {
      //   height: calc(~'100% - 234px');
      // }
      // &.bigHight {
      //   height: calc(~'100% - 50px');
      // }
      // & > div:nth-child(2) {
      //   overflow: hidden;
      //   height: calc(~'100% - 70px');
      //   max-width: 1728px;
      // }
    }
  }
}
//
//
//
</style>
