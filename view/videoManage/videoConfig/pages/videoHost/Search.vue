<template>
  <div class="search-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
        <el-breadcrumb-item class="active">查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-container">
      <div class="conditions-box">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('searchCondition')">
            查询条件
            <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.searchCondition">
          <div class="form-box">
            <!--  -->
            <div class="condition-box">
              <div class="query-form">
                <el-form :rules="checkForm" ref="searchModel" :model="searchModel">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      v-model="orgName"
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
                      :disabled="!searchModel.orgId"
                      v-model="keyPartName"
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
                  <el-form-item label="设备名称" prop="name">
                    <el-input type="text" v-model="searchModel.name" placeholder="请输入设备名称"></el-input
                  ></el-form-item>
                  <el-form-item label="设备类型" prop="type">
                    <el-select v-model="searchModel.type">
                      <el-option v-for="item in deviceTypes" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="品牌" prop="brand">
                    <el-select v-model="searchModel.brand">
                      <el-option
                        v-for="item in brands"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value || item.label"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备型号" prop="modelNum">
                    <el-select v-model="searchModel.modelNum">
                      <el-option v-for="item in models" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="序列号" prop="uniqueId">
                    <el-input v-model="searchModel.uniqueId" placeholder="请输入序列号"></el-input>
                  </el-form-item>
                  <el-form-item label="资产编码" prop="assetCode">
                    <el-input type="text" v-model="searchModel.assetCode" placeholder="请输入资产编码"></el-input
                  ></el-form-item>
                  <el-form-item label="状态" prop="status">
                    <el-select v-model="searchModel.status">
                      <el-option value="" label="全部"></el-option>
                      <el-option value="1" label="离线"></el-option>
                      <el-option value="2" label="在线"></el-option> </el-select
                  ></el-form-item>
                  <el-form-item label="录入机构" prop="updatedDept">
                    <el-input type="text" v-model="searchModel.updatedDept" placeholder="请输入录入机构"></el-input
                  ></el-form-item>
                  <el-form-item label="录入人" prop="updatedBy"
                    ><el-input type="text" v-model="searchModel.updatedBy" placeholder="请输入录入人"></el-input>
                  </el-form-item>
                  <el-form-item label="录入时间" prop="">
                    <el-date-picker
                      v-model="searchModel.updatedAt"
                      type="datetimerange"
                      :editable="false"
                      :clearable="false"
                      size="mini"
                      format="yyyy-MM-dd HH:mm:ss"
                      align="center"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <div class="opt-button">
                <el-button type="primary" size="samll" @click="search">查询</el-button>
                <el-button size="samll" @click="reset">重置</el-button>
                <el-button icon="icon iconfont-ccb ccbdaochu1 el-icon-" size="samll" @click="exportFile">导出</el-button>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
      <div class="result-box">
        <div class="box-title">
          <span class="pointer" @click="toggleOpen('searchResult')">
            查询结果
            <i :class="dropdownStatus.searchResult ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="dropdownStatus.searchResult" :style="{ height: dropdownStatus.searchCondition ? '460px' : '770px' }">
          <el-table
            v-loading="loading"
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @select-all="select"
            height="100%"
            max-height="805"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="80"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <video-pagination
            ref="searchPagination"
            :total="total"
            @paginationConfChange="paginationConfChange"
          ></video-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../../../components/VideoPagination'
import { serarchDeviceListApi } from '@src/http/video/videoConfig.api.js'
import { BRANDS, MODELS, DEVICETYPE } from '../../../components/selectConf'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { download } from '@src/common/download.js'
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
  name: 'Search',
  components: {
    VideoPagination
  },
  data() {
    return {
      loading: false,
      brands: BRANDS,
      deviceTypes: DEVICETYPE,
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      },
      total: 0,
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '100' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '120' },
        { prop: 'type', sortable: true, label: '设备类型', width: '100' },
        { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'modelNum', sortable: true, label: '型号', width: '80' },
        { prop: 'name', sortable: true, label: '设备名称', width: '100' },
        { prop: 'ip', sortable: true, label: 'IP', width: '60' },
        { prop: 'protocol', sortable: true, label: '传输协议', width: '100' },
        { prop: 'accessProtocol', sortable: true, label: '接入协议', width: '100' },
        { prop: 'accessService', sortable: true, label: '接入服务器', width: '120' },
        // { prop: 'cport', sortable: true, label: '控制端口', width: '100' },
        // { prop: 'dport', sortable: true, label: '数据端口', width: '100' },
        { prop: 'digitalNumber', label: '数字通道数', width: '120' },
        { prop: 'analogNumber', label: '模拟通道数', width: '120' },
        // { prop: 'audioNumber', label: '音频通道数', width: '120' },
        { prop: 'inputNumber', label: '报警输入数', width: '120' },
        { prop: 'outputNumber', label: '报警输出数', width: '120' },
        { prop: 'assetCode', sortable: true, label: '资产编码', width: '100' },
        { prop: 'uniqueId', sortable: true, label: '序列号', width: '90' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' }
      ],
      paginationConfig: {
        limit: 25,
        page: 1
      },
      tableData: [],
      selectedData: [],
      searchModel: {
        orgId: '',
        keyPartId: '',
        name: '',
        modelNum: '',
        brand: '',
        type: '',
        uniqueId: '',
        assetCode: '',
        status: '',
        updatedBy: '',
        updatedDept: '',
        updatedAt: ''
      },
      orgName: '',
      keyPartName: '',
      keyParts: [],
      checkForm: create.searchCheck_videoHost_Search // 表单校验
    }
  },
  created() {},
  computed: {
    models() {
      let curType = this.brands.find(i => (i.value || i.label) === this.searchModel.brand)
      let type = curType && curType.label
      return MODELS[type] || []
    }
  },
  watch: {
    'searchModel.brand'() {
      this.searchModel.modelNum = ''
    }
  },
  methods: {
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    reset() {
      this.searchModel = {
        orgId: '',
        keyPartId: '',
        name: '',
        modelNum: '',
        brand: '',
        type: '',
        uniqueId: '',
        assetCode: '',
        status: '',
        updatedBy: '',
        updatedDept: '',
        updatedAt: ''
      }
      this.orgName = ''
      this.keyPartName = ''
    },
    search() {
      this.$refs['searchModel'].validate(valid => {
        if (valid) {
          this.searchModel.orgId = this.searchModel.orgId.toString()
          this.searchModel.keyPartId = this.searchModel.keyPartId.toString()
          let params = {
            ...this.paginationConfig,
            ...this.searchModel
          }
          this.loading = true
          serarchDeviceListApi(params)
            .then(res => {
              this.loading = false
              if (res.data.code === 0) {
                this.tableData = res.data.data.hosts || []
                this.total = res.data.data.total || 0
              }
            })
            .catch(err => {
              this.loading = false
            })
        } else {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '查询条件不规范',
            type: NOTIFY.TYPE.WARNING
          })
        }
      })
    },
    select(s, row) {
      this.selectedData = s
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
    },
    exportFile() {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '设备类型',
        '品牌',
        '型号',
        '设备名称',
        'IP',
        '传输协议',
        '接入协议',
        '接入服务器',
        '数字通道数',
        '模拟通道数',
        '报警输入数',
        '报警输出数',
        '资产编码',
        '序列号',
        '状态',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      const filterVal = [
        'orgName',
        'keyPartName',
        'type',
        'brand',
        'modelNum',
        'name',
        'ip',
        'protocol',
        'accessProtocol',
        'accessService',
        'digitalNumber',
        'analogNumber',
        'inputNumber',
        'outputNumber',
        'assetCode',
        'uniqueId',
        'status',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      let list = []
      if (this.selectedData && this.selectedData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectedData)
        list.forEach(n => {
          if (n.status) {
            if (n.status == '1') {
              n.status = '离线'
            } else if (n.status == '2') {
              n.status = '在线'
            }
          }
        })
        const data = list.map(v => filterVal.map(j => v[j]))
        export_json_to_excel(
          tHeader,
          data,
          `视频主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        )
      } else {
        let params = {
          pattern: 'inquery',
          equal: {
            orgId: this.searchModel.orgId.toString(),
            keyPartId: this.searchModel.keyPartId.toString(),
            modelNum: this.searchModel.modelNum,
            brand: this.searchModel.brand,
            type: this.searchModel.type,
            status: this.searchModel.status,
            updatedAt: this.searchModel.updatedAt
          }, // {object} equal 查询条件中等值条件集合
          like: {
            name: this.searchModel.name,
            uniqueId: this.searchModel.uniqueId,
            assetCode: this.searchModel.assetCode,
            updatedBy: this.searchModel.updatedBy,
            updatedDept: this.searchModel.updatedDept
          } // {object} like 查询条件中模糊条件集合
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/download/host`
        let name = `视频主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '导出文件下载失败',
              type: NOTIFY.TYPE.ERROR
            })
          },
          () => {},
          'post',
          params
        )
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.searchModel.orgId : undefined
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
        this.searchModel.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.searchModel.keyPartId = val.id
        this.keyPartName = val.name
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  width: 100%;
  height: 100%;
  padding: 0 0 0 15px;
  .header {
    color: #333333;
    margin: 23px 0;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .search-container {
    width: 100%;
    height: calc(~'100% - 60px');
    overflow: auto;
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-bottom: 20px;
      i {
        position: absolute;
        top: 50%;
        left: 85px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 100px;
        margin-top: -12px;
      }
    }
    .conditions-box {
      margin: 10px 0;
      .form-box {
        height: auto;
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        padding: 15px 10px 5px 0px;
        border-radius: 5px;
        width: 100%;
        margin: 0 auto;
        .condition-box {
            width: 100%;
            // max-width: 1360px;
            margin-bottom: 10px;
            .query-form {
              width: 100%;
              background: rgba(245, 245, 245, 1);
              padding: 16px 16px 2px 16px;
              box-sizing: border-box;
              /deep/ .el-form {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .el-form-item {
                  width: 25%;
                  display: flex;
                  // margin-left: 3%;
                  /deep/ .el-form-item__label {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    width: 150px;
                  }
                  .el-form-item__content {
                    width: 100%;
                    .el-autocomplete {
                      width: 100%;
                    }
                    .el-select {
                      width: 100%;
                    }
                    .el-range-editor--mini{
                      width: 100%;
                    }
                  }
                }
              }
            }
            .opt-button {
              text-align: center;
              margin-top: 20px;
            }
        }
        .form-footer {
          width: 100%;
          margin-top: 10px;
          text-align: center;
        }
      }
      // /deep/ .el-autocomplete {
      //   width: 100%;
      //   height: 40px;
      //   .el-input {
      //     height: 100%;
      //     input {
      //       height: 100%;
      //     }
      //   }
      // }
    }
    .result-box {
      width: 100%;
      .button-box {
        margin: 10px 0;
      }
    }
  }
}
//
//
//
</style>
