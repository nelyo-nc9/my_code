<template>
  <div class="content-box">
    <div class="condition-box">
      <div class="condition-detail">
        <div class="condition-detail-item">
          <div class="condition-item-label">所属机构</div>
          <div class="condition-item-value">
            <el-autocomplete class="inline-input" size="mini" v-model="orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">所属重点部位</div>
          <div class="condition-item-value">
            <el-autocomplete class="inline-input" size="mini" :disabled="!logModel.orgId" v-model="keyPartName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">设备名称</div>
          <div class="condition-item-value">
            <el-input size="mini" v-model="logModel.deviceName"></el-input>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">设备类型</div>
          <div class="condition-item-value">
            <el-select size="mini" v-model="logModel.deviceType">
              <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">品牌</div>
          <div class="condition-item-value">
             <!-- <el-input size="mini" v-model="logModel.brand"></el-input> -->
            <el-select size="mini" v-model="logModel.brand">
              <el-option
                v-for="item in brands"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">型号</div>
          <div class="condition-item-value">
            <el-select size="mini" v-model="logModel.model">
              <el-option
                v-for="item in models"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">资源名称</div>
          <div class="condition-item-value">
            <el-input size="mini" v-model="logModel.resourcesName"></el-input>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">资源类型</div>
           <div class="condition-item-value">
            <el-select size="mini" v-model="logModel.resourcesType" @change="resourcesTypeChange">
              <el-option
                v-for="item in resourcesTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">通道号</div>
          <div class="condition-item-value">
            <el-input size="mini" v-model="logModel.channelNum"></el-input>
          </div>
         
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">事件类型</div>
          <div class="condition-item-value">
            <el-select size="mini" v-model="logModel.optType" @change="optTypeChange">
              <el-option
                v-for="item in optTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="condition-item-value">
            <el-input size="mini" v-model="logModel.username"></el-input>
          </div> -->
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">开始时间</div>
          <div class="condition-item-value">
            <el-date-picker
              size="mini"
              v-model="logModel.beginTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
        <div class="condition-detail-item">
          <div class="condition-item-label">结束时间</div>
          <div class="condition-item-value">
            <el-date-picker
              size="mini"
              v-model="logModel.endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="opt-button">
        <el-button type="primary" size="medium" style="margin-right:24px;" @click="search">查询</el-button>
        <el-button size="medium" style="margin-right:24px;" @click="reset">重置</el-button>
        <el-button size="medium" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div class="result-box">
      <el-table
        stripe
        border
        size="medium"
        :data="tableData"
        @select="select"
        height="100%"
        max-height="654"
        style="width: 100%">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" prop="index" type="index" width="80" align="center"> </el-table-column>
        <el-table-column
          v-for="(column, index) in columns" :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :sortable="column.sortable"
          show-overflow-tooltip
          align="center"
          :resizable="resizable">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <!--  @click="handleView('详情',scope.row)" -->
          <template slot-scope="scope">
            <!-- 视频图标 -->
            <el-button
              size="samll"
              type="text"           
              style="font-size:12px;margin-left:0;"
            >查看</el-button>
          </template>
      </el-table-column>
      </el-table>
      <video-pagination ref="listPagination"
        :total="total"
        @paginationConfChange="paginationConfChange"
      ></video-pagination>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../components/VideoPagination'
import { postLogApi } from '@src/http/video/videoConfig.api.js'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { BRANDS, MODELS, DEVICETYPE, OPTTYPE,RESOURCETYPEVIDEO} from '../components/selectConf'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  name: 'Content',
  components: {
    VideoPagination,
    treeBox
  },
  props: {
    // type: {
    //   type: String,
    //   required: true
    // }
  },
  data() {
    return {
      selectedData: [],
      resizable: true,
      columns: [
        // { prop: 'index', sortable: true, label: '序号', width: '' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartName',  label: '所属重点部位', width: '' },
        { prop: 'deviceName', sortable: true, label: '设备名称', width: '' },
        { prop: 'deviceType', sortable: true, label: '设备类型', width: '' },
        { prop: 'brand', sortable: true, label: '品牌', width: '' },
        { prop: 'model', sortable: true, label: '型号', width: '' },
        { prop: 'resourcesName', sortable: true, label: '资源名称', width: '' },
        { prop: 'resourcesType', sortable: true, label: '资源类型', width: '' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '' },
        { prop: 'channelNum', sortable: true, label: '通道号', width: '' },
        { prop: 'operType', sortable: true, label: '事件类型', width: '' },
        { prop: 'updatedAt', label: '时间', width: '' }
      ],
      tableData: [],
      total: 0,
      paginationConfig: {
        page: 1,
        limit: 25
      },
      //事件类型内容
      // optTypes: OPTTYPE,
      optTypes:[
        { label: '全部', value: 0 },
        { label: '设备异常', value: 1 },
        { label: '视频诊断', value: 2 },
        { label: '视频侦测', value: 3 },
        { label: '报警事件', value: 4 },
        { label: '手工事件', value: 5 },
        { label: '智能事件', value: 6 },
      ],
      //资源类型内容 resources
      resourcesTypes:RESOURCETYPEVIDEO,
      // resourcesTypes: [
      //   { label: '全部', value: 0 },
      //   { label: '枪机', value: 1 },
      //   { label: '半球', value: 2 },
      //   { label: '球机', value: 3 },
      //   { label: '针孔', value: 4 },
      //   { label: '红外枪击', value: 5 },
      //   { label: '全景', value: 6 },
      //   { label: '智能IPC', value:7 }
      // ],
      brands: BRANDS,
      //设备类型
      deviceTypes: DEVICETYPE,
      // deviceTypes:[
      //   { label: '全部', value: 0 },
      //   { label: 'NVR', value: 1 },
      //   { label: 'HDVR', value: 2 },
      //   { label: 'DVR', value: 3 },
      //   { label: 'Vnvr', value: 4 },
      //   { label: 'IPC', value: 5 },
      //   { label: 'IVS', value: 6 },
      //   { label: 'SDC', value: 7 },
      // ],
      //form 表单
      logModel: {
        // orgName:"",
        // orgId: '',
        keyPartId: '', //重点部位Id
        deviceName: '', //设备名称
        deviceType: '', //设备类型
        brand: '', //品牌
        model: '', //型号
        resourcesName: '', //资源名称
        resourcesType: '', //资源类型
        operType: '', //事件类型
        channelNum: '', //通道号
        beginTime: '', //开始时间
        endTime: '' //结束时间
      },
      orgName: '', //机构
      keyPartName: '', //所属重点部位
      keyParts: [],
      treeType: 3
    }
  },
  computed: {
    //处理设备型号
    models() {
      let curType = this.brands.find(i => i.value === this.logModel.brand)
      let type = curType && curType.label
      return MODELS[type] || []
    }
  },
  methods: {
    // getTreeApi(params) { // 机构树接口
    //   return getTreeApi(params)
    // },
    // onceClick(node) { // 机构树点击
    //   this.logModel.orgId = node.id
    //   this.getKeyPartSelect(node.id)
    //   this.orgName = node.name
    // },
    //导出
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      const tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '设备名称',
        '设备类型',
        '品牌',
        '型号',
        '资源名称',
        '资源类型',
        'IP地址',
        '事件类型',
        '时间'
      ]
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'deviceName',
        'deviceType',
        'brand',
        'model',
        'resourcesName',
        'resourcesType',
        'ip',
        'operType',
        'updatedAt'
      ]
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(
          tHeader,
          data,
          `视频事件日志查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        )
      } else {
        // let obj = Object.assign({sync: 1}, this.handleForm(this.form))
        // let obj = Object.assign({}, this.form)
        // obj.roleName = obj.name
        // if (obj.authorityAssignType === '1' || obj.authorityAssignType === '2') {
        //   obj.authorityAssignType = obj.authorityAssignType * 1
        // } else {
        //   delete obj.authorityAssignType
        // }
        // if (obj.type === '1' || obj.type === '2') {
        //   obj.roleType = obj.type * 1
        // }
        // if (obj.description.length <= 0 || obj.description === '') {
        //   delete obj.description
        // }
        // if (obj.name.length <= 0 || obj.name === '') {
        //   delete obj.roleName
        // }
        // delete obj.type
        // delete obj.name
        // this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getKeyPartSelect(oId) {
      // 获取机构下的重点部位
      this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: '1',
        isRecursion: '0'
      }
      this.getTreeApi(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data.nodes
          data.forEach(item => {
            if (item.tierType === 'loc') {
              this.keyParts.push({
                label: item.name,
                value: item.id
              })
            }
          })
        }
      })
    },
    // paginationConfChange(obj) {
    //   this.paginationConfig = obj
    // },
    select(s, row) {
      this.selectData = s
    },
    //事件类型
    optTypeChange(val) {
      this.logModel.optType = val
    },
    //资源类型
    resourcesTypeChange(val) {
      debugger
      this.logModel.resourcesType = val
    },
    //查询(处理form数据)
    optQuery(objs) {
      //
      let obj = {}
      for (let i in this.logModel) {
        if (this.logModel[i] !== '') {
          obj[i] = this.logModel[i]
          //处理type类型数据
          if (i === 'operateType') {
            for (let j in this.logModel['operateType']) {
              obj[j] = this.logModel['operateType'][j]
            }
          }
          if (i === 'startTime' || i === 'endTime') {
            obj[i] = this.$moment(this.operationForm[i]).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }
      delete obj['operateType']
      // delete obj['operateTypeLabel']
      // this.$refs['ruleForm'].validate(valid => {
      //   if (valid) {
      //     this.getLog({ obj, page: { page: objs['page'], limit: objs['limit'] } })
      //   } else {
      //     return false
      //   }
      // })
    },
    //获取数据
    async getLog(obj) {
      let title = ''
      //获取数据的方法 api
      await this.getVideoOperationLog(obj)
        .then(res => {
          let { code, message, data } = res.data
          if (code === 0) {
            let { logs, page } = data && data
            if (logs && logs.length) {
              this.tableData = logs.map((i, j) => {
                i['index'] = (page['page'] - 1) * page['limit'] + 1 + j
                if (typeof i['operateType'] === 'number') {
                  if (this.operationTypeList.some(t => t.value === i['operateType'])) {
                    i['operateType'] = this.operationTypeList.filter(t => t.value === i['operateType'])[0].label
                  }
                }
                return i
              })
              title = this.title['ok']
              this.paginationConfig = {
                total: page['totalNumber'],
                page: page['page'],
                limit: page['limit'],
                pageCount: page['totalPage']
              }
            } else {
              title = this.title['no']
            }
          } else {
            throw message
          }
        })
        .then(_ => this.$notify({ title: '操作日志', message: title, type: 'success' }))
        .catch(err => this.$notify({ title: '操作日志', message: `操作日志查询${err}`, type: 'error' }))
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
    search() {
      let params = {
        page: this.paginationConfig.page,
        limit: this.paginationConfig.limit
      }
      let equal = {
        orgName: this.orgName,
        keyPartName: this.keyPartName,
        // orgId: this.logModel.orgId,
        keyPartId: this.logModel.keyPartId,
        deviceType: this.logModel.deviceType,
        brand: this.logModel.brand,
        model: this.logModel.model,
        operType: this.logModel.optType,
        resourcesType: this.logModel.resourcesType,
        beginTime: this.logModel.beginTime,
        endTime: this.logModel.endTime
      }
      debugger
      let like = {
        deviceName: this.logModel.deviceName,
        resourcesName: this.logModel.resourcesName,
        ip: this.logModel.ip,
        username: this.logModel.username
      }
      params['equal'] = equal
      params['like'] = like
      postLogApi(params).then(res => {
        if (res.data.code === 0) {
          let arr = res.data.data.logs
          let parms = {}
          let length = res.data.data.logs.length
          parms['limit'] = length
          parms['page'] = this.paginationConfig.page - 1
          // parms['page']= parseInt(parms.total/length)+1;
          console.log(res.data)
          arr.forEach((item, index) => {
            item['index'] = index + 1 + parms.page * parms.limit
          })
          this.tableData = arr
          this.total = res.data.data.total
          this.tableData = res.data.data.logs
        } else {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '查询条件不规范',
            type: NOTIFY.TYPE.WARNING
          })
        }
      })
    },
    reset() {
      this.logModel = {
        orgId: '',
        keyPartId: '',
        deviceName: '',
        deviceType: '',
        brand: '',
        model: '',
        resourcesName: '',
        ip: '',
        operType: '',
        username: '',
        beginTime: '',
        endTime: ''
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.logModel.orgId : undefined
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
        this.logModel.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.logModel.keyPartId = val.id
        this.keyPartName = val.name
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  .condition-box {
    width: 100%;
    .condition-detail {
      width: 95%;
      margin: 10px auto;
      background: rgba(245, 245, 245, 1);
      padding: 15px 20px 5px 0px;
      display: flex;
      flex-wrap: wrap;
      .condition-detail-item {
        width: 25%;
        height: 60px;
        display: flex;
        .condition-item-label {
          width: 135px;
          height: 100%;
          line-height: 40px;
          text-align: center;
        }
        .condition-item-value {
          flex: 1;
          border: 1px solid #f7f2f1;
          position: relative;
          * {
            width: 100%;
          }
          .org-tree-box {
            border: 1px solid #ddd;
            position: absolute;
            left: 0px;
            top: 40px;
            z-index: 99;
            height: 300px;
            width: 100%;
            background: #fff;
          }
          /deep/ .el-autocomplete {
            width: 100%;
            height: 28px;
            .el-input {
              height: 100%;
              input {
                height: 100%;
              }
            }
          }
        }
      }
    }
    .opt-button {
      text-align: center;
    }
  }
  .result-box {
    width: 100%;
    height: calc(~'100% - 215px');
    margin-top: 30px;
  }
}
</style>
