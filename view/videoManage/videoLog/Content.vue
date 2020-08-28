<template>
  <div class="content-box">
    <div class="condition-box">
      <div class="query-form">
        <el-form :rules="rules" ref="ruleForm" :model="operationForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="operationForm.name" placeholder="请输入姓名" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="operationForm.userName" placeholder="请输入用户名" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"></el-input>
          </el-form-item>

          <el-form-item label="所属机构" prop="orgName">
            <el-autocomplete class="inline-input" size="mini" v-model="operationForm.orgName" value-key="name" :fetch-suggestions="
                (val, callback) => {querySearch('org', val, callback)}" placeholder="请输入机构" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"
              :trigger-on-focus="false" @select="val => {selectItem('org', val)}"></el-autocomplete>
          </el-form-item>

          <el-form-item label="客户端类型">
            <el-select v-model="operationForm.clientType" placeholder="请选择客户端类型">
              <el-option
                v-for="item in clientTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="operationForm.ip" placeholder="请输入IP地址" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"></el-input>
          </el-form-item>

          <el-form-item label="操作类型">
            <el-select v-model="operationForm.operateTypeLabel">
              <el-option
                v-for="item in operationTypeList"
                :key="item.key"
                :label="item.label"
                @click.native="setOperateType(item)"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="操作对象" prop="object">
            <el-input v-model="operationForm.object" placeholder="请输入操作对象" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"></el-input>
          </el-form-item>

          <el-form-item label="操作描述" prop="description">
            <el-input v-model="operationForm.description" placeholder="请输入操作描述" clearable @clear="_ => this.$refs['ruleForm'].resetFields()"></el-input>
          </el-form-item>

          <el-form-item label="开始时间">
            <el-date-picker v-model="operationForm.startTime" placeholder="请选择开始时间"
              type="datetime" align="center" :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker v-model="operationForm.endTime" placeholder="请选择结束时间"
              type="datetime" align="center" :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>

        </el-form>
      </div>
      <div class="opt-button">
        <el-button type="primary" size="medium" style="margin-right:24px;" @click="optQuery({page: 1, limit: paginationConfig.limit})">查询</el-button>
        <el-button size="medium" style="margin-right:24px;" @click="reset">重置</el-button>
        <el-button size="medium" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="educe">导出</el-button>
      </div>
    </div>
    <div class="result-box">
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            highlight-current-row
            @selection-change="handleSelectionChange"
            ref="Table"
            height="100%"
            style="width: 100%;height: 100%;"
          >
            <el-table-column type="selection" width="50" fixed align="center"></el-table-column>
            <!-- <el-table-column label="序号" type="index" width="80" align="center"></el-table-column> -->
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <PaginationCCB
          :total="paginationConfig.total"
          @paginationConfChange="paginationConfChange"></PaginationCCB>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationCCB from '../components/VideoPagination.vue'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { download } from '@src/common/download.js'
import { mapActions } from 'vuex'
export default {
  name: 'Content',
  components: {
    PaginationCCB
  },
  data() {
    let maxLong = (rule, value, callback) => {
      let leng = 0
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      str.split('').forEach((i) => {
        if (/^[\u4e00-\u9fa5]+$/i.test(i)) {
          leng += 1
        }
      })
      if (str.length + leng > 128) {
        return callback(new Error('输入内容不可超过128个字符'))
      } else {
        callback()
      }
    }
    let ipRule = (rule, value, callback) => {
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
      const ipv6 = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
      if (/(:)/g.test(str)) {
        if (!ipv6.test(str)) {
          return callback(new Error('请输入规范格式的ipv6地址'))
        } else {
          callback()
        }
      } else if (/(.)/g.test(str)) {
        if (!ipv4.test(str)) {
          return callback(new Error('请输入规范格式的ipv4地址'))
        } else {
          callback()
        }
      } else if (!str) {
        callback()
      } else {
        return callback(new Error('请输入规范格式的ip地址'))
      }
    }
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      resizable: true,
      columns: [
        { prop: 'index', label: '序号', width: '80' },
        { prop: 'name', label: '姓名', width: '150', sortable: true },
        { prop: 'userName', label: '用户名', width: '150', sortable: true },
        { prop: 'createdAt', label: '时间', width: '150', sortable: true },
        { prop: 'orgName', label: '所属机构', width: '150', sortable: true },
        { prop: 'clientName', label: '客户端类型', width: '150', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '150', sortable: true },
        { prop: 'operateType', label: '操作类型', width: '150', sortable: true },
        { prop: 'action', label: '动作', width: '150', sortable: true },
        { prop: 'object', label: '操作对象', width: '250', sortable: true },
        { prop: 'result', label: '操作结果', width: '150', sortable: true },
        { prop: 'description', label: '操作描述', width: '200', sortable: true }
      ],
      tableData: [],
      selectData: [],
      obj: {},
      operationForm: {
        moduleType: 1,
        name: '',
        userName: '',
        orgId: '',
        orgName: '',
        clientType: 0,
        ip: '',
        operateTypeLabel: '全部',
        operateType: {NULL3: 0},
        object: '',
        description: '',
        startTime: '',
        endTime: ''
      },
      clientTypeList: [
        { label: '全部', value: 0 },
        { label: 'B/S', value: 1 },
        { label: 'APP', value: 2 }
      ],
      operationTypeList: [
        {key: 'NULL3', value: 0, label: '全部'},
        {key: 'VIDEO_ONE_CLICK_PREVIEW', value: 20000, label: '一键预览/展开'},
        {key: 'VIDEO_PREVIEW', value: 20001, label: '视频预览'},
        {key: 'VIDEO_VIEW_COLLECTION', value: 20002, label: '镜头收藏'},
        {key: 'VIDEO_SCREENSHOT', value: 20003, label: '截图'},
        {key: 'VIDEO_EMERGENCY_VIDEO', value: 20004, label: '紧急录像'},
        {key: 'VIDEO_IP_INTERCOM', value: 20005, label: 'IP对讲'},
        {key: 'VIDEO_BIRDS_EYE_VIEW', value: 20006, label: '鸟瞰'},
        {key: 'VIDEO_LINKAGE_CONTROL', value: 20007, label: '关联控制'},
        {key: 'VIDEO_PTZ_CONTROL', value: 20008, label: '云台控制'},
        {key: 'VIDEO_IMAGE_ADJUSTMENT', value: 20009, label: '图像调节'},
        {key: 'VIDEO_WALL_RUN_QUICKLY', value: 20010, label: '快速上墙'},
        {key: 'VIDEO_PLAYBACK_QUICKLY', value: 20011, label: '快速回放'},
        {key: 'VIDEO_CHECK_RECORD', value: 20012, label: '检查记录'},
        {key: 'VIDEO_EVENT_RECORD', value: 20013, label: '事件记录'},
        {key: 'VIDEO_IMAGE_REVIEW', value: 20014, label: '视频复核'},
        {key: 'VIDEO_LOOP_VIEW', value: 20015, label: '视频轮巡'},
        {key: 'VIDEO_LOOP_WAY', value: 20016, label: '轮巡策略'},
        {key: 'VIDEO_RECORDING_SEARCH', value: 20017, label: '录像检索'},
        {key: 'VIDEO_RECORDING_PLAYBACK', value: 20018, label: '录像回放'},
        {key: 'VIDEO_RECORDING_CUT', value: 20019, label: '录像剪切'},
        {key: 'VIDEO_SYNC_PLAYBACK', value: 20020, label: '同步回放'},
        {key: 'VIDEO_SYNC_ASYNC_SWITCH', value: 20021, label: '同步异步切换'},
        {key: 'VIDEO_SUBSECTION_REPLAY', value: 20022, label: '分时段回放'},
        {key: 'VIDEO_BACKWARD_REPLAY', value: 20023, label: '倒放'},
        {key: 'VIDEO_FAST_SPEED_PLAY', value: 20024, label: '快速播放'},
        {key: 'VIDEO_LOW_SPEED_PLAY', value: 20025, label: '慢速播放'},
        {key: 'VIDEO_FRAME_BY_FRAME_PLAY', value: 20026, label: '逐帧播放'},
        {key: 'VIDEO_RECORDING_WALL_RUN', value: 20027, label: '录像上墙'},
        {key: 'VIDEO_PICTURE_SEARCH', value: 20028, label: '图片检索'},
        {key: 'VIDEO_RECORDING_DOWNLOAD', value: 20029, label: '录像下载'},
        {key: 'VIDEO_HOST_CONFIG', value: 20030, label: '视频主机配置'},
        {key: 'VIDEO_HOST_SEARCH', value: 20031, label: '视频主机查询'},
        {key: 'VIDEO_HOST_CHANNEL', value: 20032, label: '视频主机通道管理'},
        {key: 'VIDEO_HOST_EVENT', value: 20033, label: '视频主机事件管理'},
        {key: 'VIDEO_CAMERA_VIEW_LINKAGE_CONFIG', value: 20034, label: '摄像机关联配置'},
        {key: 'VIDEO_INPUT_CHANNEL_LINKAGE_CONFIG', value: 20035, label: '报警输入关联配置'},
        {key: 'VIDEO_HOST_LINKAGE_CONFIG', value: 20036, label: '视频主机关联配置'},
        {key: 'VIDEO_SHOW_LINKAGE_TOPOLOGY', value: 20037, label: '查看关联拓扑'},
        {key: 'VIDEO_LINKAGE_CONFIG_SEARCH', value: 20038, label: '关联配置查询'},
        {key: 'VIDEO_DEVICE_IMPORT', value: 20039, label: '视频设备导入'},
        {key: 'VIDEO_PLAN_TASK_CONFIG', value: 20040, label: '录像计划配置'},
        {key: 'VIDEO_CHANNEL_STORAGE_CONFIG', value: 20041, label: '存储路径配置'},
        {key: 'VIDEO_PLAN_TASK_SEARCH', value: 20042, label: '录像计划查询'},
        {key: 'VIDEO_LOG_SEARCH', value: 20043, label: '日志查询'},
        {key: 'VIDEO_LOG_EXPORT', value: 20044, label: '日志导出'},
        {key: 'VIDEO_OTHER', value: 20045, label: '其它'}
      ],
      rules: {
        name: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        userName: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        long: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        orgName: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        object: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        description: [
          { required: false, validator: maxLong, trigger: 'blur' }
        ],
        ip: [
          { required: false, validator: ipRule, trigger: 'blur' }
        ],
        date: [
          { type: 'date', message: '请选择日期', trigger: 'change' }
        ]
      },
      paginationConfig: {
        total: 0,
        page: 1,
        limit: 25,
        pageCount: 0
      },
      title: {
        ok: '查询成功',
        no: '未查询到包含条件的日志'
      }
    }
  },
  computed: {
    pagKey() {
      return `${this.paginationConfig.total}`
    }
  },
  created() {
    this.obj = { ...this.operationForm }
  },
  methods: {
    ...mapActions('videoManage/videoConfig', ['setState', 'getVideoOperationLog', 'downVideoOperationLog']),
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      this.operationForm.orgId = String(val.id)
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: 1,
        name: value,
        oId: null
      }
      getSearchOrgApi(params).then(res => {
        if (!res.data.data.code) {
          callback(res.data.data.orgList || [])
        } else {
          throw res.data.data.message
        }
      }).catch(err => {
        console.log(err)
        callback([])
      })
    },
    setOperateType(item) { this.operationForm['operateType'] = {[item.key]: item.value} },
    reset() {
      this.operationForm = { ...this.obj }
      this.$refs['ruleForm'].resetFields()
    },
    optQuery(objs, educe = '') {
      let obj = {}
      let equal = {}
      let like = {}
      for (let i in this.operationForm) {
        if (this.operationForm[i] !== '') {
          obj[i] = this.operationForm[i]
          if (i === 'operateType' && !educe) {
            for (let j in this.operationForm['operateType']) {
              obj[j] = this.operationForm['operateType'][j]
            }
          } else if (i === 'operateType' && educe) {
            for (let j in this.operationForm['operateType']) {
              if (this.operationForm['operateType'][j]) {
                equal[i] = this.operationForm['operateType'][j]
              }
            }
          }
          if (['orgId', 'clienType', 'ip'].includes(i)) {
            equal[i] = this.operationForm[i]
          }
          if (['name', 'userName', 'object', 'description'].includes(i)) {
            like[i] = this.operationForm[i]
          }
          if (i === 'startTime' || i === 'endTime') {
            obj[i] = this.$moment(this.operationForm[i]).format('YYYY-MM-DD HH:mm:ss')
            equal[i] = this.$moment(this.operationForm[i]).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }
      if (!educe) {
        delete obj['operateType']
      }
      delete obj['operateTypeLabel']
      console.log(obj, educe, equal, like)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (educe === 'exportEduce') {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/system/v1/operationlog/download`
            let name = `视频操作日志查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$notify({title: '失败', message: '导出文件下载失败！', type: 'error'}) }, () => {}, 'post', {moduleType: 1, equal, like})
          } else {
            this.getLog({obj, page: {page: objs['page'], limit: objs['limit']}})
          }
        } else {
          return false
        }
      })
    },
    async getLog(obj) {
      let title = ''
      await this.getVideoOperationLog(obj).then(res => {
        let {code, message, data} = res.data
        if (code === 0) {
          let {logs, page} = data && data
          if (logs && logs.length) {
            this.tableData = logs.map((i, j) => {
              i['index'] = (page['page'] - 1) * page['limit'] + 1 + j
              if (typeof (i['operateType']) === 'number') {
                if (this.operationTypeList.some(t => t.value === i['operateType'])) {
                  i['operateType'] = this.operationTypeList.filter(t => t.value === i['operateType'])[0].label
                }
              }
              return i
            })
            title = this.title['ok']
            this.paginationConfig = {total: page['totalNumber'], page: page['page'], limit: page['limit'], pageCount: page['totalPage']}
          } else {
            title = this.title['no']
          }
        } else {
          throw message
        }
      }).then(_ => this.$notify({title: '操作日志', message: title, type: 'success'})).catch(err => this.$notify({title: '操作日志', message: `操作日志查询${err}`, type: 'error'}))
    },
    // 分页
    async paginationConfChange(val) {
      if (val instanceof Object) {
        for (let i in val) {
          this.paginationConfig[i] = val[i]
        }
      }
      await this.optQuery(this.paginationConfig)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      const tHeader = ['序号', '姓名', '用户名', '时间', '所属机构', '客户端类型', 'IP地址', '操作类型', '动作', '操作对象', '操作结果', '操作描述']
      const filterVal = ['index', 'name', 'userName', 'createdAt', 'orgName', 'clientName', 'ip', 'operateType', 'action', 'object', 'result', 'description']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, `视频操作日志查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
        this.optQuery({}, 'exportEduce')
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {sync: 1, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `视频操作日志查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        throw err
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-box {
  width: 100%;
  height: 100%;
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
        .el-form-item {
          margin-right: 23px;
          display: inline-block;
          width: 19.23%;
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
          }
        }
        .el-form-item:first-child {
          width: 17.27%;
          .el-form-item__label {
            width: 60px;
          }
          .el-form-item__content {
            width: calc(~'100% - 60px');
          }
        }
        .el-form-item:nth-child(5n) {
          margin-right: 0px;
        }
        .el-form-item:nth-child(5n + 1) {
          width: 17.27%;
          .el-form-item__label {
            width: 60px;
          }
          .el-form-item__content {
            width: calc(~'100% - 60px');
          }
        }
      }
    }
    .opt-button {
      text-align: center;margin-top: 30px;
    }
  }
  .result-box {
    width: 100%;height: calc(~'100% - 237px');
    padding-top: 30px;
    .main {
      width: 100%;
      height: 100%;
      .list-box-table {
        width: 100%;min-height: 480px;height: calc(~'100% - 40px');
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        /deep/ .el-pager li.active {
          color: #2d72d3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
        }
      }
    }
  }
}
</style>
