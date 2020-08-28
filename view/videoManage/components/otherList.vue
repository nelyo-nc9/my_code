<template>
  <div class="other-list-box">
    <!-- 顶部操作栏 -->
    <div class="top">
      <!-- 面包屑 -->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
          <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="middle">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" :disabled="selectData.length === 0" @click="relevanceConf">关联配置</el-button>
          <el-button size="small" @click="getTableList()">获取关联</el-button>
          <el-button size="small" :disabled="selectData.length !== 1" @click="viewLink">查看关联拓扑</el-button>
          <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFile">导出</el-button>
        </div>
        <div class="opt-box">
          <div class="div-inline">
            <el-form
              size="mini"
              label-position="right"
              label-width="0px"
              ref="searchForm"
              :model="searchForm"
              :rules="rulesCheck"
              @submit.native.prevent
            >
              <el-form-item label="" prop="keyword">
                <el-input
                  style="float:right;width:200px;"
                  size="small"
                  v-model="searchForm.keyword"
                  placeholder="请输入设备名称或设备IP"
                  @keyup.enter.native="getTableList"
                >
                  <i slot="suffix" @click="getTableList" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- <el-input v-model="keyword" placeholder="请输入设备名称或设备IP" style="float:right;width:200px;" size="small">
            <i slot="suffix" @click="getTableList()" class="el-input__icon el-icon-search"></i>
          </el-input> -->
        </div>
      </div>
      <div class="foot">
        <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
      </div>
    </div>
    <!-- <div  @dblclick="fn"> 双击事件</div> -->
    <div class="main" >
      <!-- 表格 -->
      <el-table
        stripe
        border
        size="medium"
        :data="tableData"
        @selection-change="select"
        height="calc(100% - 50px)"
        max-height="805"
        style="width: 100%"
        @row-dblclick="rowDblclick"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号"  prop="index" type="index" :index="indexMethod" width="60" align="center"></el-table-column>
        <el-table-column prop="orgName" :sortable="true" label="所属机构" width="220" align="center"></el-table-column>
        <el-table-column
          prop="keyPartName"
          :sortable="true"
          label="所属重点部位"
          width="130"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :prop="navTitle != '视频主机关联配置' ? 'deviceName' : 'name'"
          :sortable="true"
          :label="navTitle != '视频主机关联配置' ? '所属设备' : '设备名称'"
          width="100"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="brand"
          label="品牌"
          width="130"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        ></el-table-column>
        <el-table-column
          prop="modelNum"
          label="型号"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          v-if="navTitle != '视频主机关联配置'"
          label="资源名称"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          width="120"
          align="center"
          :sortable="true"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="assetCode" label="资产编码" width="220" align="center"></el-table-column>
        <el-table-column
          v-if="navTitle === '摄像机关联配置' || navTitle === '视频主机关联配置'"
          prop="status"
          label="状态"
          :sortable="true"
          width="130"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        ></el-table-column>
        <el-table-column
          prop="isVideoLink"
          label="关联视频通道"
          width="130"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        >
          <template slot-scope="scope">
            <a
              class="text"
              type="text"
              size="small"
              @click="clickRelevance(scope.row)"
              v-if="scope.row.isVideoLink === 2"
              >已关联</a
            >
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="isAudioLink"
          label="关联对讲通道"
          width="100"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        >
          <template slot-scope="scope">
            <a
              class="text"
              type="text"
              size="small"
              @click="clickRelevance(scope.row)"
              v-if="scope.row.isAudioLink === 2"
              >已关联</a
            >
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="isGuardLink"
          label="关联门禁通道"
          width="130"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        >
          <template slot-scope="scope">
            <a
              class="text"
              type="text"
              size="small"
              @click="clickRelevance(scope.row)"
              v-if="scope.row.isGuardLink === 2"
              >已关联</a
            >
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="isOutputLink"
          label="关联输出通道"
          width="120"
          align="center"
          show-overflow-tooltip
          :formatter="formatterTable"
        >
          <template slot-scope="scope">
            <a
              class="text"
              type="text"
              size="small"
              @click="clickRelevance(scope.row)"
              v-if="scope.row.isOutputLink === 2"
              >已关联</a
            >
            <a class="text" type="text" size="small" v-else></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedDept"
          label="录入机构"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updatedBy"
          label="录入人"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updatedAt"
          label="录入时间"
          width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <video-pagination
        ref="listPagination"
        :total="total"
        @paginationConfChange="paginationConfChange"
      ></video-pagination>
    </div>
    <velevance-info
      v-if="showVelevanceInfo"
      :InfoData="InfoData"
      :navTitle="navTitle"
      :flag="relevaceFlag"
      @cancle="cancle"
    ></velevance-info>
  </div>
</template>

<script>
import VideoPagination from './VideoPagination'
import VelevanceInfo from './relevanceInfo'
import { postVideoRelateListApi, getRelateListApi, getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
import { download } from '@src/common/download.js'
import { RESOURCEBRANDSVIDEO, RESOURCEBRANDSINPUT, BRANDS } from './selectConf'
import create from '@src/assets/rules/validation/security/video/video_search.js'
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
  name: 'OtherList',
  components: {
    VideoPagination,
    VelevanceInfo
  },
  props: {
    navTitle: {
      type: String,
      default: '视频主机关联配置'
    },
    orgId: {
      // 这里的orgId在外层只有点击了机构才被更新
      type: String
    },
    keyPartId: {
      // 这里的keyPartId在外层只有点击了重点部位才被更新
      type: String
    },
    deviceId: {
      // 这里的deviceId在外层只有点击了设备才被更新
      type: String
    },
    tierType: {
      type: String,
      default: 'org'
    }
  },
  computed: {},
  watch: {
    orgId(nv) {
      // todo 获取机构详情
      this.$emit('changeOrgId', nv)
      this.getTableList('org')
    },
    keyPartId() {
      // this.getTableList('keyPart')
    },
    deviceId() {
      // this.getTableList('dev')
    },
    selectData: {
      handler(nv) {
        this.$emit('changeSelect', nv)
      },
      immediate: true
    }
  },
  data() {
    return {
      //
      rulesCheck: create.searchCheck, // 表单校验
      //
      relevaceFlag: false,
      showVelevanceInfo: false,
      // keyword: '',
      tableData: [],
      total: 0,
      paginationConfig: {
        page: 1,
        limit: 25
      },
      selectData: [],
      InfoData: {},
      searchForm: {
        keyword: ''
      }
    }
  },
  created() {},
  methods: {
    // 获取列表时只用树当前点击元素的orgId或者keyPartId或者deviceId
    getTableList(type = this.tierType) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          //
          let params = {
            page: this.paginationConfig.page,
            limit: this.paginationConfig.limit
          }
          if (type === 'org') {
            params.orgId = this.orgId
          } else if (type === 'keyPart') {
            params.keyPartId = this.keyPartId
          } else if (type === 'dev') {
            // zp调整   视频主机关联配置中的机构树点击设备时需要传的属性是id,摄像机关联配置和报警输入关联配置中点击机构树的设备级时要传deviceId
            params[this.navTitle === '视频主机关联配置' ? 'id' : 'deviceId'] = this.deviceId
          }
          if (this.navTitle === '视频主机关联配置') {
            // params.orgId = this.orgId
            // params.keyPartId = this.keyPartId
            // params.id = this.deviceId
            console.log(params)
            postVideoRelateListApi(params).then(res => {
              if (res.data.code === 0) {
                let arr = res.data.data.hosts
                let parms = res.data.data.count
                let length = res.data.data.hosts.length
                parms['limit'] = length
                parms['page'] = this.paginationConfig.page - 1
                // parms['page']= parseInt(parms.total/length)+1;
                console.log(res.data)
                arr.forEach((item, index) => {
                  item['index'] = index + 1 + parms.page * parms.limit
                })
                this.tableData = arr
                // this.tableData = res.data.data.hosts
                this.total = res.data.data.count.total
              }
            })
          } else if (this.navTitle === '摄像机关联配置' || this.navTitle === '报警输入关联配置') {
            params.type = this.navTitle === '摄像机关联配置' ? 1 : 3
            // params.orgId = this.orgId
            // params.keyPartId = this.keyPartId
            // params.id = this.deviceId
            console.log(params)
            getRelateListApi(params).then(res => {
              if (res.data.code === 0) {
                let arr = res.data.data.channels
                let parms = res.data.data.count
                let length = res.data.data.channels.length
                parms['limit'] = length
                parms['page'] = this.paginationConfig.page - 1
                // parms['page']= parseInt(parms.total/length)+1;
                console.log(res.data)
                arr.forEach((item, index) => {
                  item['index'] = index + 1 + parms.page * parms.limit
                })
                this.tableData = arr
                // this.tableData = res.data.data.channels
                this.total = res.data.data.count.total
              }
            })
          }
          //
        } else {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '设备名称或设备IP不规范',
            type: NOTIFY.TYPE.WARNING
          })
        }
      })
    },
    getLinks(id) {
      let params = {
        ref: this.navTitle === '视频主机关联配置' ? 1 : 2
      }
      getDeviceOrResourceApi(id, params).then(res => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
        }
      })
    },
    refresh() {
      this.getTableList()
    },
    select(s, row) {
      this.selectData = s
    },
    // 双击拓联
    rowDblclick(row, column) {
      this.selectData.push(row)
      this.viewLink()
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    relevanceConf() {
      this.$emit('changeComponent', 'RelevanceConf')
    },
    viewLink() {
      this.$emit('changeComponent', 'viewLink')
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      switch (column.property) {
        case 'brand':
          if (this.navTitle == '摄像机关联配置') {
            let brand = RESOURCEBRANDSVIDEO.filter(i => i.value == row.brand)[0]
            params = brand ? brand.label : row.brand
          } else if (this.navTitle == '报警输入关联配置') {
            let brand = RESOURCEBRANDSINPUT.filter(i => i.value == row.brand)[0]
            params = brand ? brand.label : row.brand
          } else if (this.navTitle == '视频主机关联配置') {
            let brand = BRANDS.filter(i => i.value == row.brand)[0]
            params = brand ? brand.label : row.brand
          }
          break
        case 'status':
          params = cellValue === 2 ? '在线' : '离线'
          break
        case 'isVideoLink':
        case 'isAudioLink':
        case 'isGuardLink':
        case 'isOutputLink':
          params = cellValue === 2 ? '已关联' : ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    indexMethod(index) {
      return (this.paginationConfig.page - 1) * this.paginationConfig.limit + index + 1
    },
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      let tHeader = []
      let filterVal = []
      if (this.navTitle === '摄像机关联配置') {
        tHeader = [
          '序号',
          '所属机构',
          '所属重点部位',
          '所属设备',
          '品牌',
          '型号',
          '资源名称',
          'IP',
          '资产编码',
          '状态',
          '关联视频通道',
          '关联对讲通道',
          '关联门禁通道',
          '关联输出通道',
          '录入机构',
          '录入人',
          '录入时间'
        ]
        filterVal = [
          'index',
          'orgName',
          'keyPartName',
          'deviceName',
          'brand',
          'modelNum',
          'name',
          'ip',
          'assetCode',
          'status',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'updatedDept',
          'updatedBy',
          'updatedAt'
        ]
      } else if (this.navTitle === '报警输入关联配置') {
        tHeader = [
          '序号',
          '所属机构',
          '所属重点部位',
          '所属设备',
          '品牌',
          '型号',
          '资源名称',
          'IP',
          '资产编码',
          '关联视频通道',
          '关联对讲通道',
          '关联门禁通道',
          '关联输出通道',
          '录入机构',
          '录入人',
          '录入时间'
        ]
        filterVal = [
          'index',
          'orgName',
          'keyPartName',
          'deviceName',
          'brand',
          'modelNum',
          'name',
          'ip',
          'assetCode',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'updatedDept',
          'updatedBy',
          'updatedAt'
        ]
      } else {
        tHeader = [
          '序号',
          '所属机构',
          '所属重点部位',
          '设备名称',
          '品牌',
          '型号',
          'IP',
          '资产编码',
          '状态',
          '关联视频通道',
          '关联对讲通道',
          '关联门禁通道',
          '关联输出通道',
          '录入机构',
          '录入人',
          '录入时间'
        ]
        filterVal = [
          'index',
          'orgName',
          'keyPartName',
          'name',
          'brand',
          'modelNum',
          'ip',
          'assetCode',
          'status',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'updatedDept',
          'updatedBy',
          'updatedAt'
        ]
      }
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectData)
        list.forEach(n => {
          if (n.status) {
            if (n.status == '1') {
              n.status = '离线'
            } else if (n.status == '2') {
              n.status = '在线'
            }
          }
          // isVideoLink"isAudioLink"isGuardLink"isOutputLink"
          if (n.isVideoLink) {
            if (n.isVideoLink == '1') {
              n.isVideoLink = ''
            } else if (n.isVideoLink == '2') {
              n.isVideoLink = '已关联'
            }
          }
          if (n.isAudioLink) {
            if (n.isAudioLink == '1') {
              n.isAudioLink = ''
            } else if (n.isAudioLink == '2') {
              n.isAudioLink = '已关联'
            }
          }
          if (n.isGuardLink) {
            if (n.isGuardLink == '1') {
              n.isGuardLink = ''
            } else if (n.isGuardLink == '2') {
              n.isGuardLink = '已关联'
            }
          }
          if (n.isOutputLink) {
            if (n.isOutputLink == '1') {
              n.isOutputLink = ''
            } else if (n.isOutputLink == '2') {
              n.isOutputLink = '已关联'
            }
          }
        })
        console.log(list)
        list = list.map(item => this.formatt(item))
        const data = list.map(v => filterVal.map(j => v[j]))
        if (this.navTitle === '摄像机关联配置' || this.navTitle === '报警输入关联配置') {
          let name = `${this.navTitle === '摄像机关联配置' ? '摄像机关联导出' : '报警输入关联导出'}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
          export_json_to_excel(tHeader, data, name)
          // 'fileName'
        }
        if (this.navTitle === '视频主机关联配置') {
          let name = `视频主机关联导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
          export_json_to_excel(tHeader, data, name)
        }
      } else {
        if (this.navTitle === '摄像机关联配置' || this.navTitle === '报警输入关联配置') {
          let params = {
            pattern: 'list',
            type: this.navTitle === '摄像机关联配置' ? 1 : 3,
            deviceId: this.deviceId || '',
            orgId: this.orgId || '',
            keyPartId: this.keyPartId || '',
            // key: this.keyword
            key: this.searchForm.keyword
          }
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/channel/linkage/download`
          let name = `${this.navTitle === '摄像机关联配置' ? '摄像机关联导出' : '报警输入关联导出'}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(url, name, () => {}, () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          }, () => {}, 'post', params)
        }
        if (this.navTitle === '视频主机关联配置') {
          let params = {
            pattern: 'list',
            id: this.deviceId || '',
            orgId: this.orgId || '',
            keyPartId: this.keyPartId || '',
            // key: this.keyword
            key: this.searchForm.keyword
          }
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/host/linkage/download`
          let name = `视频主机关联导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(url, name, () => {}, () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          }, () => {}, 'post', params)
        }
        // list = this.tableData
      }
    },
    formatt(row) {
      let obj = {}
      for (let i in row) {
        if (i == 'status') {
          obj[i] = row[i] === 2 ? '在线' : '离线'
        }
        //  if(i==('inputNumber'||'outputNumber'||'analogNumber'||'audioNumber'||'digitalNumber')) {
        //    obj[i]= row[i] === '' ? '0' : row[i]
        //  }
        //  if(i=='type'){
        //   obj[i] = DEVICETYPE.filter(item => item.value === row[i])[0] ? DEVICETYPE.filter(item => item.value === row[i])[0].label : '  '
        //  }
        //  if(i=='protocol'){
        //   obj[i] = TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0] ? TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0].label : '  '
        //  }
        if (i == 'brand') {
          if (this.navTitle == '摄像机关联配置') {
            let brand = RESOURCEBRANDSVIDEO.filter(i => i.value == row.brand)[0]
            obj[i] = brand ? brand.label : row.brand
          } else if (this.navTitle == '报警输入关联配置') {
            let brand = RESOURCEBRANDSINPUT.filter(i => i.value == row.brand)[0]
            obj[i] = brand ? brand.label : row.brand
          } else if (this.navTitle == '视频主机关联配置') {
            let brand = BRANDS.filter(i => i.value == row.brand)[0]
            obj[i] = brand ? brand.label : row.brand
          }
          // obj[i] = BRANDS.filter(item => item.value === row[i])[0] ? BRANDS.filter(item => item.value === row[i])[0].label : '  '
        }
      }
      return Object.assign(row, obj)
    },
    clickRelevance(row) {
      let params = {
        ref: this.navTitle === '视频主机关联配置' ? 1 : 2
      }
      getDeviceOrResourceApi(row.id, params).then(res => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }
      })
    },
    cancle() {
      this.showVelevanceInfo = false
      this.relevaceFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
.other-list-box {
  width: 100%;
  height: 100%;
  padding-left: 12px;
  .top {
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
    .middle {
      width: 100%;
      height: 35px;
      margin: 0 0 10px;
      display: flex;
      justify-content: space-between;
      .button-box {
        width: 780px;
      }
      .opt-box {
        margin-right: 61px;
      }
    }
    .foot {
      margin-bottom: 10px;
      /deep/ .el-button {
        padding: 0;
      }
    }
  }
  .main {
    width: 100%;
    height: calc(~'100% - 133px');
  }
  .text {
    color: #409eff;
    cursor: pointer;
  }
}
.div-inline {
  float: right;
}
</style>
