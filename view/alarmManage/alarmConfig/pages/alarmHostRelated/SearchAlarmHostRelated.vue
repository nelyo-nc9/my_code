<template>
  <div class="content alarm-cont">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
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
        <el-form :model="formData" :rules="rules" ref="addForm1" label-position="right" label-width="100px" size="mini">
          <el-form-item label="所属机构">
            <el-autocomplete class="inline-input" size="mini" v-model="orgName" value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构"
                          :trigger-on-focus="false" @select="val=>{selectItemMethod('org', val)}"></el-autocomplete>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="网络模块品牌">
            <el-select v-model="formData.netModuleBrand" @change="changenetBrandList">
              <el-option
                v-for="item in netBrandList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="formData.ip"></el-input>
          </el-form-item>
          <el-form-item label="录入机构" prop="createdDept">
            <el-input v-model="formData.createdDept"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="formData" :rules="rules" ref="addForm2" label-position="right" label-width="100px" size="mini">
          <el-form-item label="所属重点部位">
            <el-autocomplete class="inline-input" size="mini" :disabled="!formData.orgId" v-model="locationName" value-key="name"
                          :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位"
                          :trigger-on-focus="false" @select="val=>{selectItemMethod('kp', val)}"></el-autocomplete>
          </el-form-item>
          <el-form-item label="设备品牌">
            <el-select v-model="formData.brand" @change="changeBrand">
              <el-option
                v-for="item in devBrandList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网络模块型号">
            <el-select v-model="formData.netModuleModel">
              <el-option
                v-for="item in netTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网络端口">
            <el-input v-model="formData.port"></el-input>
          </el-form-item>
          <el-form-item label="录入人" prop="createdBy">
            <el-input v-model="formData.createdBy"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="formData" :rules="rules" ref="addForm3" label-position="right" label-width="100px" size="mini">
          <el-form-item label="设备类型">
            <el-select v-model="formData.deviceType" @change="changeType">
              <el-option
                v-for="item in devTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-select v-model="formData.deviceModel">
              <el-option
                v-for="item in devModelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网络模块ID" prop="netModuleID">
            <el-input v-model="formData.netModuleID"></el-input>
          </el-form-item>
          <el-form-item label="资产编码" prop="code">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="录入时间">
            <el-date-picker
              v-model="inputCreatedAt"
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
        <el-button size="mini" @click="reset">重置</el-button>
        <el-button size="mini" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div class="table-box" ref="tableBox">
      <div class="box-title">查询结果</div>
      <div style="position:absolute;top:40px;width:100%;">
        <el-table :data="tableData" size="mini" border :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :sortable="item.sortable"
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
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
export default {
  components: {
    treeBox,
    VideoPagination
  },
  data() {
    return {
      rules: {
        netModuleID: [{ min: 0, max: 128, message: '最多可输入128个字符' }],
        name: [{ min: 0, max: 128, message: '最多可输入128个字符' }],
        code: [{ min: 0, max: 128, message: '最多可输入128个字符' }],
        // port: [{ type: 'number', min: 0, max: 65535, message: '请填写0~65535范围端口' }],
        createdDept: [{ min: 0, max: 128, message: '最多可输入128个字符' }],
        createdBy: [{ min: 0, max: 128, message: '最多可输入128个字符' }]
      },
      inputCreatedAt: [],
      treeType: 3,
      nameLable: '',
      pageSize: 25,
      page: 1,
      total: 0,
      isDropdown: true,
      tableHeight: 200,
      tableData: [],
      orgName: '',
      locationName: '',
      formData: {
        orgId: '',
        locationId: '',
        deviceType: '',
        name: '',
        brand: '',
        deviceModel: '',
        netModuleBrand: '',
        netModuleModel: '',
        netModuleID: '',
        ip: '',
        port: '',
        code: '',
        createdDept: '',
        createdBy: '',
        createStartTime: '',
        createEndTime: ''
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '100', sortable: true },
        { prop: 'locName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'deviceType', label: '设备类型', width: '120', sortable: true },
        { prop: 'name', label: '设备名称', width: '100', sortable: true },
        { prop: 'code', label: '资产编码', width: '100', sortable: true },
        { prop: 'brand', label: '设备品牌', width: '100', sortable: true },
        { prop: 'deviceModel', label: '设备型号', width: '100', sortable: true },
        { prop: 'netModuleBrand', label: '网络模块品牌', width: '120', sortable: true },
        { prop: 'netModuleModel', label: '网络模块类型', width: '120', sortable: true },
        { prop: 'netModuleID', label: '网络模块ID', width: '110', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '100', sortable: true },
        { prop: 'port', label: '网络端口', width: '100', sortable: true },
        { prop: 'cameraAssociated', label: '关联摄像头', width: '130', sortable: true },
        { prop: 'talkAssociated', label: '关联对讲通道', width: '130', sortable: true },
        { prop: 'doorAssociated', label: '关联门禁通道', width: '130', sortable: true },
        { prop: 'outputAssociated', label: '关联输出通道', width: '130', sortable: true },
        { prop: 'createdBy', label: '录入人', width: '100', sortable: true },
        { prop: 'createdDept', label: '录入机构', width: '100', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '120', sortable: true }
      ],
      devModelList: [
        // 设备型号下拉选项
      ],
      mapleLeafModel: [
        { label: 'PA-728', value: 'PA-728' },
        { label: 'PA-738', value: 'PA-738' },
        { label: 'PA-748', value: 'PA-748' },
        { label: 'SP4000', value: 'SP4000' },
        { label: 'SP5500', value: 'SP5500' },
        { label: 'SP6000', value: 'SP6000' }
      ],
      boschModel: [
        { label: 'CC408', value: 'CC408' },
        { label: 'CC880', value: 'CC880' },
        { label: 'CMS40', value: 'CMS40' },
        { label: 'CMS8', value: 'CMS8' },
        { label: 'DS7240', value: 'DS7240' },
        { label: 'DS7400', value: 'DS7400' }
      ],
      HoneywellModel: [
        { label: 'CK-236', value: 'CK-236' },
        { label: 'CK-238', value: 'CK-238' },
        { label: 'CK-2316', value: 'CK-2316' },
        { label: '236PLUS', value: '236PLUS' },
        { label: '238PLUS', value: '238PLUS' },
        { label: '2316PLUS', value: '2316PLUS' },
        { label: '236SUPER', value: '236SUPER' },
        { label: '238SUPER', value: '238SUPER' },
        { label: '2316SUPER', value: '2316SUPER' },
        { label: 'Vista-20P', value: 'Vista-20P' },
        { label: 'Vista-120', value: 'Vista-120' },
        { label: 'Vista-128', value: 'Vista-128' }
      ],
      DSCModel: [
        { label: 'PC-585', value: 'PC-585' },
        { label: 'PC-1832', value: 'PC-1832' },
        { label: 'PC-1864', value: 'PC-1864' }
      ],
      timeModel: [
        { label: 'SK-216G', value: 'SK-216G' },
        { label: 'SK-239C', value: 'SK-239C' },
        { label: 'SK-239G', value: 'SK-239G' },
        { label: 'SK-3110G', value: 'SK-3110G' }
      ],
      shengXunModel: [
        { label: 'TS1106', value: 'TS1106' },
        { label: 'TS2313', value: 'TS2313' }
      ],
      hikvisionModel: [
        { label: 'DS-19A08-BN', value: 'DS-19A08-BN' },
        { label: 'DS-19A16-BN', value: 'DS-19A16-BN' }
      ],
      inantModel: [
        { label: 'AW-BM1600-16AJD', value: 'AW-BM1600-16AJD' },
        { label: 'AW-BM16008A-V36', value: 'AW-BM16008A-V36' },
        { label: 'NT316PLUS-TJK-XD', value: 'NT316PLUS-TJK-XD' }
      ],
      netTypeList: [
        // 网络模块类型下拉选项
      ],
      HoneywellNetType: [
        { label: 'IPM-23', value: 'IPM-23' },
        { label: 'IPM-VISTA', value: 'IPM-VISTA' }
      ],
      boschNetType: [
        { label: 'B426-CN', value: 'B426-CN' }
      ],
      hikvisionNetType: [
        { label: 'DS-19M00-MN/K（2300）', value: 'DS-19M00-MN/K（2300）' },
        { label: 'DS-19M00-MN/K（120）', value: 'DS-19M00-MN/K（120）' },
        { label: 'DS-19M00-MN/K（7400）', value: 'DS-19M00-MN/K（7400）' }
      ],
      bstarNetType: [
        { label: 'BSR-ALT0816N Plus', value: 'BSR-ALT0816N Plus' }
      ],
      timeNetType: [
        { label: 'SK-811', value: 'SK-811' }
      ],
      netBrandList: [
        // 网络模块品牌下拉选项
        { label: '霍尼韦尔', value: '霍尼韦尔' },
        { label: '博世', value: '博世' },
        { label: '海康威视', value: '海康威视' },
        { label: '蓝色星际', value: '蓝色星际' },
        { label: '时刻', value: '时刻' },
        { label: '汇防', value: '汇防' }
      ],
      devTypeList: [
        // 设备类型下拉选项
        { label: '电话报警主机', value: '电话报警主机' },
        { label: '网络报警主机', value: '网络报警主机' },
        { label: '电子围栏总线报警主机', value: '电子围栏总线报警主机' },
        { label: '振动光纤报警主机', value: '振动光纤报警主机' }
      ],
      positionList: [
        // 重点部位下拉选项
        { label: '营业网点', value: '营业网点' },
        { label: '自助银行', value: '自助银行' }
      ],
      devBrandList: [
        // 设备品牌下拉选项
      ],
      phoneHostBrand: [
        { label: '枫叶', value: '枫叶' },
        { label: '博世', value: '博世' },
        { label: '霍尼韦尔', value: '霍尼韦尔' },
        { label: 'DSC', value: 'DSC' },
        { label: '时刻', value: '时刻' },
        { label: '声迅', value: '声迅' }
      ],
      netHostBrand: [
        { label: '海康威视', value: '海康威视' },
        { label: '英安特', value: '英安特' },
        { label: '大华', value: '大华' }
      ],
      elecfenceHostBrand: [
        { label: '上海广拓', value: '上海广拓' },
        { label: '上海长城', value: '上海长城' }
      ],
      vibratingFiberHostBrand: [
        { label: '上海广拓', value: '上海广拓' },
        { label: '润光泰力', value: '润光泰力' }
      ],
      selectItem: []
    }
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  methods: {
    ...mapActions(['searchHost']),
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
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.searchAlarmHost()
    },
    // X条/页
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.formData.pageSize = this.pageSize
      this.formData.pageNum = this.val
      this.searchAlarmHost()
    },
    changeType(val) {
      this.formData.brand = ''
      if (val === '电话报警主机') {
        this.devBrandList = this.phoneHostBrand
      }
      if (val === '网络报警主机') {
        this.devBrandList = this.netHostBrand
      }
      if (val === '电子围栏总线报警主机') {
        this.devBrandList = this.elecfenceHostBrand
      }
      if (val === '振动光纤报警主机') {
        this.devBrandList = this.vibratingFiberHostBrand
      }
    },
    changeBrand(val) {
      this.formData.deviceModel = ''
      if (val === '枫叶') {
        this.devModelList = this.mapleLeafModel
      }
      if (val === '博世') {
        this.devModelList = this.boschModel
      }
      if (val === '霍尼韦尔') {
        this.devModelList = this.HoneywellModel
      }
      if (val === 'DSC') {
        this.devModelList = this.DSCModel
      }
      if (val === '时刻') {
        this.devModelList = this.timeModel
      }
      if (val === '声迅') {
        this.devModelList = this.shengXunModel
      }
      if (val === '海康威视') {
        this.devModelList = this.hikvisionModel
      }
      if (val === '英安特') {
        this.devModelList = this.inantModel
      }
    },
    changenetBrandList(val) {
      this.formData.netModuleModel = ''
      if (val === '霍尼韦尔') {
        this.netTypeList = this.HoneywellNetType
      }
      if (val === '博世') {
        this.netTypeList = this.boschNetType
      }
      if (val === '海康威视') {
        this.netTypeList = this.hikvisionNetType
      }
      if (val === '蓝色星际') {
        this.netTypeList = this.bstarNetType
      }
      if (val === '时刻') {
        this.netTypeList = this.timeNetType
      }
    },
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 114
      })
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
    },
    searchAlarmHost() {
      this.$refs.addForm1.validate(valid1 => {
        this.$refs.addForm2.validate(valid2 => {
          this.$refs.addForm3.validate(valid3 => {
            if (valid1 && valid2 && valid3) {
              this.formData.createStartTime = this.inputCreatedAt[0] !== undefined ? this.$moment(this.inputCreatedAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
              this.formData.createEndTime = this.inputCreatedAt[1] !== undefined ? this.$moment(this.inputCreatedAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
              this.formData.pageSize = this.pageSize
              this.formData.pageNum = this.page
              this.searchHost(this.formData).then(res => {
                this.tableData = []
                const result = res.results
                this.total = res.page.length
                Array.isArray(result) && result.forEach(item => {
                  item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
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
                this.tableData = result
              }).catch(err => {
                console.log(err)
              })
            }
          })
        })
      })
    },
    reset() {
      this.formData.orgId = ''
      this.formData.deviceType = ''
      this.formData.code = ''
      this.formData.deviceModel = ''
      this.formData.netModuleModel = ''
      this.formData.ip = ''
      this.formData.createdDept = ''
      this.formData.createdBy = ''
      this.formData.locationId = ''
      this.formData.name = ''
      this.formData.brand = ''
      this.formData.netModuleBrand = ''
      this.formData.netModuleID = ''
      this.formData.port = ''
      this.orgName = '',
      this.locationName = ''
      this.inputCreatedAt = []
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
        for (let i = 0; i < this.tableColumn.length; i++) {
          tHeader.push(this.tableColumn[i].label)
          filterVal.push(this.tableColumn[i].prop)
        }
        let list = []
        // 导出全部或导出选中
        if (this.selectItem && this.selectItem.length > 0) {
          list = this.selectItem
        } else {
          list = this.tableData
        }
        // 筛选过滤
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, 'fileName')
      } else {
        this.formData.createStartTime = this.inputCreatedAt[0] !== undefined ? this.$moment(this.inputCreatedAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formData.createEndTime = this.inputCreatedAt[1] !== undefined ? this.$moment(this.inputCreatedAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        this.formData.pageSize = this.pageSize
        this.formData.pageNum = this.page
        this.formData.pattern = 'inquery'
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/alarm-manage/v1/alarm-host/hostlink-export`
        let name = `报警主机关联配置导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
