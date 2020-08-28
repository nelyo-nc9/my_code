<template>
  <div class="content alarm-cont">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>探测器关联配置</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div style="width:100%;">
      <div class="box-title">
        <span class="pointer" @click="toggle">
          查询条件
          <i :class="isDropdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div v-show="isDropdown" class="form-box">
        <el-form :model="formData" ref="addForm1" :rules="detectRules" label-position="right" label-width="100px" size="mini">
          <el-form-item label="所属机构">
            <el-autocomplete class="inline-input" size="mini" v-model="orgName" value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构"
                          :trigger-on-focus="false" @select="val=>{selectItemMethod('org', val)}"></el-autocomplete>
          </el-form-item>
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input v-model="formData.count"></el-input>
          </el-form-item>
          <el-form-item label="资产编码" prop="code">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="录入机构" prop="createdDept">
            <el-input v-model="formData.createdDept"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="formData" ref="addForm3" :rules="detectRules" label-position="right" label-width="100px" size="mini">
          <el-form-item label="所属重点部位">
            <el-autocomplete class="inline-input" size="mini" :disabled="!formData.orgId" v-model="locationName" value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位"
                          :trigger-on-focus="false" @select="val=>{selectItemMethod('kp', val)}"></el-autocomplete>
          </el-form-item>
          <el-form-item label="防区序号" prop="serialNumber">
            <el-input v-model="formData.serialNumber"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="formData.brand">
              <el-option
                v-for="item in detectorBrandList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录入人" prop="createdBy">
            <el-input v-model="formData.createdBy"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="formData" ref="addForm2" :rules="detectRules" label-position="right" label-width="100px" size="mini">
          <el-form-item label="所属设备">
            <el-input v-model="formData.deviceName"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="formData.deviceType">
              <el-option
                v-for="item in detectorTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="型号">
            <el-select v-model="formData.model">
              <el-option
                v-for="item in detectorModelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录入时间">
            <el-date-picker
              v-model="createdAt"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div style="width:1306px;text-align:center;margin-top: 20px;">
        <el-button size="mini" type="primary" @click="searchAlarmHost">查询</el-button>
        <el-button size="mini" @click="reSetForm">重置</el-button>
        <el-button size="mini" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div class="table-box" ref="tableBox">
      <div class="box-title">查询结果</div>
      <div style="position:absolute;top:40px;width:100%;">
        <el-table :data="detectorList" size="mini" border :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              ></el-table-column>
        </el-table>
        <!-- <el-pagination
          style="text-align:right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageNum"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination> -->
        <video-pagination ref="listAlarmPagination"
                  :total="total"
                  :pageSizes="[10, 25, 50, 100]"
                  :limitDefault="pageSize"
                  @paginationConfChange="eventChange"></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { download } from '@src/common/download.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { mapActions } from 'vuex'
export default {
  components: {
    treeBox,
    VideoPagination
  },
  data() {
    return {
      detectRules: {
        name: [{ min: 0, max: 128, message: '最多可输入128个字符' } ],
        serialNumber: [
          { pattern: '^[0-9]*$', message: '请输入正确的防区序号'}
        ],
        count: [
          { pattern: '^[0-9]*$', message: '请输入正确的数量'}
        ],
        code: [ { min: 0, max: 128, message: '最多可输入128个字符' } ],
        createdDept: [{ min: 0, max: 128, message: '最多可输入128个字符' }],
        createdBy: [{ min: 0, max: 128, message: '最多可输入128个字符' }]
      },
      nameLable: '',
      treeType: 3,
      isDropdown: true,
      tableHeight: 200,
      createdAt: [],
      detectorTypeList: [],
      detectorBrandList: [],
      detectorModelList: [],
      locationName: '',
      orgName: '',
      formData: {
        // 查询条件字段
        orgId: '',
        locationId: '',
        deviceName: '',
        name: '',
        serialNumber: '',
        deviceType: '',
        count: '',
        brand: '',
        model: '',
        code: '',
        createdBy: '',
        createdDept: '',
        createStartTime: '',
        createEndTime: ''
      },
      positionList: [
        // 重点部位下拉选项
        { label: '营业网点', value: '营业网点' },
        { label: '自助银行', value: '自助银行' }
      ],
      pageSize: 25,
      page: 1,
      total: 0,
      detectorList: [], // 探测器列表数据
      detectorTableColumn: [
        // 主探测器列表项
        { prop: 'orgName', label: '所属机构', width: '120', sortable: true },
        { prop: 'locName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'deviceName', label: '所属设备', width: '120', sortable: true },
        { prop: 'name', label: '探测器名称', width: '120' },
        { prop: 'serialNumber', label: '防区序号', width: '' },
        { prop: 'deviceType', label: '设备类型', width: '120' },
        { prop: 'count', label: '数量', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' },
        { prop: 'state', label: '状态', width: '80', sortable: true },
        { prop: 'cameraAssociated', label: '关联摄像头', width: '130', sortable: true },
        { prop: 'talkAssociated', label: '关联对讲通道', width: '130', sortable: true },
        { prop: 'doorAssociated', label: '关联门禁通道', width: '130', sortable: true },
        { prop: 'outputAssociated', label: '关联输出通道', width: '130', sortable: true },
        { prop: 'createdBy', label: '录入人', width: '100', sortable: true },
        { prop: 'createdDept', label: '录入机构', width: '100', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '120', sortable: true }
      ]
    }
  },
  created() {
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '7' } // dictId:主机是2  探测器是7
    ], 4)
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '8' } // dictId:主机是2  探测器是7
    ], 5)
    this.getTypeMethod([
      { type: '2', moduleId: '1', childModuleId: '1', dictId: '9' } // dictId:主机是2  探测器是7
    ], 6)
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  methods: {
    ...mapActions(['getDetectors', 'getDataDictBasicInfo']),
    // 选中 机构/重点部位 下拉选
    selectItemMethod(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.locationId = val.id
        this.locationName = val.name
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
    getTypeMethod(args, num) {
      this.getDataDictBasicInfo({queryList: args}).then(res => {
        if (num === 4) {
          this.detectorTypeList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorTypeList.push(tempData)
          }
        }
        if (num === 5) {
          this.detectorBrandList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorBrandList.push(tempData)
          }
        }
        if (num === 6) {
          this.detectorModelList = []
          for (let i = 0; i < res.data[0].attr.length; i++) {
            let tempData = {
              label: res.data[0].attr[i].data, value: res.data[0].attr[i].data
            }
            this.detectorModelList.push(tempData)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeTableHeight() {
      this.$nextTick(() => {
        this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 117)
      })
    },
    handleSelectionChange(selection) {
      this.selectItem = selection
    },
    exportFile() {
      if (this.selectItem && this.selectItem.length > 0) {
        const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
        // 表头
        const tHeader = []
        // 字段名
        const filterVal = []
        for (let i = 0; i < this.detectorTableColumn.length; i++) {
          tHeader.push(this.detectorTableColumn[i].label)
          filterVal.push(this.detectorTableColumn[i].prop)
        }
        let list = []
        // 导出全部或导出选中
        if (this.selectItem && this.selectItem.length > 0) {
          list = this.selectItem
        } else {
          list = this.detectorList
        }
        // 筛选过滤
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, 'fileName')
      } else {
        this.formData.createStartTime = this.createdAt[0] !== undefined ? this.$moment(this.createdAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formData.createEndTime = this.createdAt[1] !== undefined ? this.$moment(this.createdAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formData.pageSize = this.pageSize
        this.formData.pageNum = this.page
        this.formData.pattern = 'inquery'
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/alarm-manage/v1/alarm-host/detectorlink-export`
        let name = `探测器关联配置查询导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          this.formData
        )
      }
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    reSetForm() {
      // this.$refs.addForm1.resetFields()
      // this.$refs.addForm2.resetFields()
      this.formData.orgId = '',
      this.formData.locationId = '',
      this.formData.deviceName = '',
      this.formData.name = '',
      this.formData.serialNumber = '',
      this.formData.deviceType = '',
      this.formData.count = '',
      this.formData.brand = '',
      this.formData.model = '',
      this.formData.code = '',
      this.formData.createdBy = '',
      this.formData.createdDept = '',
      this.formData.createStartTime = '',
      this.formData.createEndTime = '',
      this.locationName = '',
      this.orgName = '',
      this.createdAt = []
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
    },
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.searchAlarmHost()
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.searchAlarmHost()
    },
    // X条/页
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    searchAlarmHost() {
      this.$refs.addForm1.validate(valid1 => {
        this.$refs.addForm2.validate(valid2 => {
          this.$refs.addForm3.validate(valid3 => {
            if (valid1 && valid2 && valid3) {
              this.formData.createStartTime = this.createdAt[0] !== undefined ? this.$moment(this.createdAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
              this.formData.createEndTime = this.createdAt[1] !== undefined ? this.$moment(this.createdAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
              this.formData.pageSize = this.pageSize
              this.formData.pageNum = this.page
              this.getDetectors(this.formData).then(res => {
                this.detectorList = []
                const result = res.results
                this.total = res.page.length
                Array.isArray(result) && result.forEach(item => {
                  // item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
                  if (item.cameraAssociated !== undefined) {
                    item.cameraAssociated = item.cameraAssociated === 'T' ? '已关联' : '未配置'
                  }
                  if (item.talkAssociated !== undefined) {
                    item.talkAssociated = item.talkAssociated === 'T' ? '已关联' : '未配置'
                  }
                  if (item.doorAssociated !== undefined) {
                    item.doorAssociated = item.doorAssociated === 'T' ? '已关联' : '未配置'
                  }
                  if (item.outputAssociated !== undefined) {
                    item.outputAssociated = item.outputAssociated === 'T' ? '已关联' : '未配置'
                  }
                })
                this.detectorList = result
              }).catch(err => {
                console.log(err)
              })
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    height: 100%;
    position: relative;
    font-size: 14px;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    .box-title {
      position: relative;
      height: 24px;
			line-height: 24px;
      color: #606266;
      margin: 10px 0;
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
    .form-box {
      width: 1306px;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 10px 10px 26px;
      background:rgba(245,245,245,1);
      // border: 1px solid #E1E1E1;
      .el-input {
        width: 266px !important;
      }
      .el-select {
        width: 266px !important;
      }
      .el-date-editor--datetimerange.el-input,
      .el-date-editor--datetimerange.el-input__inner {
        width: 266px !important;
        margin-top: 2px;
      }
      .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
        margin-bottom: 14px !important;
      }
      .el-autocomplete {
        width: 266px !important;
      }
    }
    .table-box {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
</style>
<style lang="less">
  .alarm-cont {
    .form-box {
      .el-form-item--mini.el-form-item {
        margin-bottom: 14px;
      }
      .el-form-item__label {
        height: 35px;
        line-height: 35px;
      }
      .el-input--mini .el-input__inner {
        height: 35px;
      }
      .el-range-editor--mini.el-input__inner {
        height: 35px;
        line-height: 35px;
      }
      .el-date-editor .el-range-separator {
        width: 10%;
        line-height: 26px;
      }
    }
  }
</style>
