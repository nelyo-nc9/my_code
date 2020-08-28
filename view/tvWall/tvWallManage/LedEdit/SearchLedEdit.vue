<template>
  <div class="content">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
        <el-breadcrumb-item>解码设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div style="width:100%;">
      <div class="box-title">
        <span class="pointer"
              @click="toggle">
          查询条件
          <i :class="isDropdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div v-show="isDropdown"
           class="form-box">
        <div class="condition-detail">
          <el-form ref="addForm"
                   size="mini"
                   :rules="rules"
                   :model="formData"
                   label-position="right"
                   label-width="120px"
                   class="form-contendTvWall">
            <el-form-item label="所属机构">
              <el-autocomplete class="inline-input"
                               size="mini"
                               v-model="orgName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                               placeholder="请输入机构"
                               :trigger-on-focus="false"
                               @select="val=>{selectItemMethod('org', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属重点部位">
              <el-autocomplete class="inline-input"
                               size="mini"
                               :disabled="!formData.orgId"
                               v-model="keyPartName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                               placeholder="请输入重点部位"
                               :trigger-on-focus="false"
                               @select="val=>{selectItemMethod('kp', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属电视墙">
              <el-select v-model="formData.wallId"
                         size="mini">
                <el-option v-for="(item, index) in getAccessArr"
                           :key="index"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称"
                          prop="name">
              <el-input v-model="formData.name"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="资产编码"
                          prop="assetCode">
              <el-input v-model="formData.assetCode"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select size="mini"
                         v-model="formData.brand"
                         @change="changeBrand">
                <el-option v-for="item in devBrandList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="型号">
              <el-select size="mini"
                         v-model="formData.modelNum">
                <el-option v-for="item in devModelList1"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接入服务器">
              <el-select v-model="formData.accessService"
                         size="mini">
                <el-option v-for="item in devModelList4"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址"
                          prop="ip">
              <el-input v-model="formData.ip"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="端口"
                          prop="port">
              <el-input v-model="formData.port"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="录入人"
                          prop="updatedBy">
              <el-input v-model="formData.updatedBy"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="录入机构"
                          prop="updatedDept">
              <el-input v-model="formData.updatedDept"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="录入时间">
              <el-date-picker v-model="inputCreatedAt"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div style="width:100%;text-align:center;">
          <el-button size="small"
                     type="primary"
                     @click="seachEvent">查询</el-button>
          <el-button size="small"
                     @click="cleanForm">重置</el-button>
          <el-button @click="exportMethod"
                     size="small">导出</el-button>
        </div>
      </div>
    </div>
    <div class="table-box"
         ref="tableBox">
      <div class="box-title">查询结果</div>
      <div style="position:absolute;top:40px;width:100%;">
        <el-table size="mini"
                  border
                  @selection-change="handleSelectionChange"
                  :data="tableData"
                  :height="tableHeight">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="orgName"
                           label="所属机构"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="keyPartName"
                           label="所属重点部位"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="wallName"
                           label="所属电视墙"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="accessService"
                           label="接入服务器"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="ip"
                           label="IP地址"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="port"
                           label="端口"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="statusName"
                           label="状态"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="brand"
                           label="品牌"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="modelNum"
                           label="型号"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="assetCode"
                           label="资源编码"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedDept"
                           label="录入机构"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy"
                           label="录入人"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt"
                           label="录入时间"
                           show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination style="text-align:right;"
                       :current-page="pageInfo.page"
                       :page-size="pageInfo.limit"
                       :page-sizes="[10, 20, 30, 50]"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageInfo.total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/access/accessMan'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  components: { treeBox },
  data() {
    let validatePort = (rule, vaule, callback) => {
      let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (vaule === '') {
        return callback()
      } else if (reg.test(vaule) === false) {
        callback(new Error('请填写0~65535范围端口'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        ip: [
          { pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/, message: '请输入合法的IP' }
        ],
        port: [
          { validator: validatePort }
        ],
        updatedBy: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        updatedDept: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ]
      },
      pageInfo: {
        // 页码组件返回参数
        limit: 50,
        page: 1,
        total: 0 // 总页码
      },
      nameLable: '',
      treeType: 3,
      getAccessArr: [],
      isDropdown: true,
      tableData: [],
      tableHeight: 200,
      // 接入服务器
      devModelList4: [],
      // 设备品牌下拉选项
      devBrandList: [],
      // 型号下拉选项
      devModelList1: [],
      inputCreatedAt: [],
      orgName: '',
      keyPartName: '',
      formData: {
        // 查询条件字段
        type: '3',
        orgId: '',
        orgName: '',
        keyPartId: '',
        keyPartName: '',
        wallName: '',
        wallId: '',
        name: '',
        assetCode: '',
        brand: '',
        modelNum: '',
        ip: '',
        port: '',
        decoderNumber: '',
        inputNumber: '',
        outputNumber: '',
        accessService: '',
        updatedBy: '',
        updatedDept: '',
        updatedAt: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted() {
    this.TvWallData()
    let queryList = [
      { type: '1', moduleId: '1', childModuleId: '8', dictId: '1' } // dictId:品牌是1  型号是2
    ]
    this.getTypeMethod(queryList, 1)
    this.getservicelist()
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  methods: {
    ...mapActions(['getTvWallListApi', 'getDecodingDevice', 'getdictionariesdata', 'getservice']),
    // LED设备查询列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 设备查询列表导出
    exportMethod() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '所属电视墙',
        '设备名称',
        '接入服务器',
        'IP地址',
        '端口',
        '状态',
        '品牌',
        '型号',
        '资源编码',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'wallName',
        'name',
        'accessService',
        'ip',
        'port',
        'statusName',
        'brand',
        'modelNum',
        'assetCode',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'LED设备配置')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    TvWallData() {
      let obj = {
        limit: 1000,
        page: 1
      }
      this.getTvWallListApi(obj).then(res => {
        if (res.data.code === 0) {
          this.getAccessArr = res.data.data.results
        }
      })
    },
    getTree(params) {
      return getTreeApi(params)
    },
    // 选中 机构/重点部位 下拉选
    selectItemMethod(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
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
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 79
      })
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
    },
    seachEvent() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.formData.startTime = this.inputCreatedAt[0] !== undefined ? this.$moment(this.inputCreatedAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
          this.formData.endTime = this.inputCreatedAt[1] !== undefined ? this.$moment(this.inputCreatedAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
          let obj = {}
          Object.assign(obj, this.formData, { page: this.pageInfo.page, pageSize: this.pageInfo.limit })
          this.getDecodingDevice(obj).then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data.hosts || []
              this.tableData.map(item => {
                item['typeName'] = item.type === 3 ? 'LED设备' : ''
                item['statusName'] = item.status === 1 ? '在线' : item.status === 2 ? '离线' : ''
              })
              this.pageInfo.total = Number(res.data.data.count.total)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    cleanForm() { // 重置
      this.inputCreatedAt = []
      this.orgName = ''
      this.keyPartName = ''
      this.formData = {
        // 查询条件字段
        type: '3',
        orgId: '',
        orgName: '',
        keyPartId: '',
        keyPartName: '',
        wallName: '',
        wallId: '',
        name: '',
        assetCode: '',
        brand: '',
        modelNum: '',
        ip: '',
        port: '',
        decoderNumber: '',
        inputNumber: '',
        outputNumber: '',
        updatedBy: '',
        updatedDept: '',
        updatedAt: '',
        startTime: '',
        endTime: ''
      }
      this.seachEvent()
    },
    // 分页（修改数量）
    handleSizeChange(val) {
      this.pageInfo.page = 1
      this.pageInfo.limit = val
      this.seachEvent()
    },

    // 分页（修改页码）
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.seachEvent()
    },
    changeBrand(val) {
      this.formData.modelNum = ''
      for (let i = 0; i < this.devBrandList.length; i++) {
        if (this.devBrandList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '8', dictId: '2', homeClass: this.devBrandList[i].label } // dictId:品牌是1  型号是2
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    // 获取字典数据
    getTypeMethod(args, num) {
      this.getdictionariesdata({ queryList: args })
        .then(res => {
          console.log(res, 'res============================')
          console.log(res.data.data[0].attr, '数据字典接口返回=========')
          if (num === 1) {
            this.devBrandList = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devBrandList.push(tempData)
            }
            console.log(this.devBrandList, 'this.devBrandList=====')
          }
          if (num === 2) {
            this.devModelList1 = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devModelList1.push(tempData)
            }
            console.log(this.devModelList1, 'this.devModelList1=====')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取接入服务器
    getservicelist() {
      // 接入服务器
      this.getservice()
        .then(res => {
          this.devModelList4 = []
          for (let i = 0; i < res.data.length; i++) {
            let tempData = {
              label: res.data[i],
              value: res.data[i]
            }
            this.devModelList4.push(tempData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeTableHeight)
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
    width: 100%;
    .condition-detail {
      width: 100%;
      margin: 10px auto;
      border: 1px solid #e1e1e1;
      background: #f5f5f5;
      padding: 13px 35px 5px 5px;
      display: flex;
      flex-wrap: wrap;
      .form-contendTvWall {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        /deep/ .el-form-item--mini.el-form-item {
          margin-bottom: 14px;
          width: 25%;
          height: 35px;
          line-height: 35px;
          /deep/.el-date-editor.el-input {
            width: 100%;
          }
          /deep/.el-select {
            width: 100%;
          }
          /deep/ .el-autocomplete {
            width: 100%;
          }
          /deep/ .el-range-editor--mini.el-input__inner {
            width: 100%;
          }
          /deep/ .el-range-editor--mini .el-range-separator {
            line-height: 26px;
            width: 10%;
            padding: 0;
          }
        }
      }
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
