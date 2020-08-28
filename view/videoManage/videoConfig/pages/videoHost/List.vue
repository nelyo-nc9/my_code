<template>
  <div class="list-box">
    <!-- 中间树 -->
    <div class="tree-container">
      <treeBox
        :lazyTreeApi="getLazyTreeApi"
        ref="tree"
        searchType="filter"
        :treeType="treeType"
        @clickData="clickData"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
      ></treeBox>
    </div>
    <div class="content" v-if="showContent === 'list'">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>视频管理</el-breadcrumb-item>
            <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 排序 -->
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-button size="small" icon="el-icon-plus" @click="changComponent('Create')">新建</el-button>
            <el-button size="small" icon="el-icon-edit-outline" @click="changComponent('Update')">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="deleteDevice">删除</el-button>
            <el-button size="small" icon="el-icon-refresh-right" @click="getNvrChannelsInfoApis">获取</el-button>
            <el-button size="small" icon="icon iconfont-ccb ccbqianyi el-icon-" @click="moveLoc">迁移</el-button>
            <el-button size="small" icon="el-icon-sort" @click="storTble">排序</el-button>
            <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFile">导出</el-button>
            <el-button size="small" icon="el-icon-printer" @click="Toprint">打印</el-button>
          </div>
          <!-- 表格过滤条件 -->
          <div class="opt-box">
            <div>
              <!-- <div class="div-inline">第一个div盒子</div> -->
              <div class="div-inline">
                <el-form size="mini" label-position="right" label-width="0px" ref="searchForm" :model="searchForm" :rules="rulesCheck" @submit.native.prevent>
                  <el-form-item label="" prop="keyword">
                    <el-input style="float:right;width:230px;" size="small" v-model="searchForm.keyword" placeholder="请输入设备名称或设备IP" @keyup.enter.native="getTableList">
                      <i slot="suffix" @click="getTableList" class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="div-inline">
                <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small">
                  <el-option value="" label="全部"></el-option>
                  <el-option value="1" label="离线"></el-option>
                  <el-option value="2" label="在线"></el-option>
                </el-select>
              </div>
            </div>
            <!-- <el-input
              style="float:right;width:230px;"
              size="small"
              v-model="keyword"
              placeholder="请输入设备名称或设备IP"
            >
              <i slot="suffix" @click="getTableList" class="el-input__icon el-icon-search"></i>
            </el-input> -->
            <!-- <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="离线"></el-option>
              <el-option value="2" label="在线"></el-option>
            </el-select> -->
          </div>
        </div>
        <div class="foot">
          <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <el-table
          v-loading="loading"
          id="print-table"
          stripe
          border
          size="medium"
          :data="tableData"
          @selection-change="handleSelectionChange"
          @row-dblclick="rowDbClick"
          height="calc(100% - 50px)"
          max-height="805"
          style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <!-- <el-table-column label="序号" type="index" fixed :index="indexMethod" width="80" align="center"> </el-table-column> -->
          <el-table-column
            v-for="(column, index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center">
          </el-table-column>
        </el-table>
        <video-pagination
          ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"
        ></video-pagination>
      </div>
    </div>

    <!-- <migrant :flag="migrant" :migrantData="selectData" @cancle="migrant=false"></migrant> -->
    <!-- <sort v-else-if="showContent === 'sort'" :sortData="sortData"></sort>
    <migrant v-else-if="showContent === 'migrant'" :migrantData="selectData"></migrant> -->
    <div class="content" v-else-if="showContent === 'sort'"><sort :come="'list'" :sortData="sortData"></sort></div>
    <div class="content" v-else-if="showContent === 'migrant'"><migrant :come="'list'" :migrantData="selectData"></migrant></div>
    <div class="content" v-else-if="showContent === 'see'" >
      <Info v-if="selectData.length" :come="'list'" :deviceData="selectData"></Info>
    </div>
  </div>
</template>

<script>
import VideoPagination from '../../../components/VideoPagination'
// import Migrant from '../../../components/migrant'
import Migrant from './Migrant'
import Sort from './Sort'
import { getDeviceListApi, deleteDeviceApi, getNvrChannelsInfoApis } from '@src/http/video/videoConfig.api.js'
import { getLazyTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { DEVICETYPE, BRANDS, TRANSPORTPROTOCOLS } from '../../../components/selectConf'
import { download } from '@src/common/download.js'
import create from '@src/assets/rules/validation/security/video/video_search.js'
import Info from './Info'
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
  name: 'List',
  components: {
    VideoPagination,
    treeBox,
    Migrant,
    Sort,
    Info
  },
  props: {
    currentComponent: {
      type: String
    }
  },
  data() {
    return {
      //
      rulesCheck: create.searchCheck, // 表单校验
      //
      loading: false,
      // keyword: '',
      treeType: 2,
      status: '',
      columns: [
        { prop: 'index', label: '序号', width: '80' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '100' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '160' },
        { prop: 'name', sortable: true, label: '设备名称', width: '100' },
        { prop: 'type', sortable: true, label: '设备类型', width: '100' },
        { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'modelNum', sortable: true, label: '型号', width: '80' },
        { prop: 'uniqueId', sortable: true, label: '序列号', width: '90' },
        { prop: 'assetCode', sortable: true, label: '资产编码', width: '100' },
        { prop: 'ip', sortable: true, label: 'IP', width: '60' },
        { prop: 'cport', sortable: true, label: '控制端口', width: '100' },
        { prop: 'dport', sortable: true, label: '数据端口', width: '100' },
        { prop: 'accessService', sortable: true, label: '接入服务器', width: '120' },
        { prop: 'accessProtocol', sortable: true, label: '接入协议', width: '100' },
        { prop: 'protocol', sortable: true, label: '传输协议', width: '100' },
        { prop: 'analogNumber', label: '模拟通道数', width: '160' },
        { prop: 'digitalNumber', label: '数字通道数', width: '160' },
        { prop: 'audioNumber', label: '音频通道数', width: '160' },
        { prop: 'inputNumber', label: '报警输入数', width: '160' },
        { prop: 'outputNumber', label: '报警输出数', width: '160' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' }
      ],
      tableData: [],
      total: 0,
      currentOrgId: '',
      currentserial: '',
      currentKeyPartId: '',
      showSubOrg: false,
      paginationConfig: {
        limit: 25,
        page: 1
      },
      selectData: [],
      migrant: false, // 迁移弹窗显示隐藏变量
      personInfo: {},
      showContent: 'list',
      sortData: [], // 视频主机排序数据
      searchForm: {
        keyword: ''
      }
    }
  },
  created() {
    let userInfo = window.localStorage.getItem('user')
    userInfo = JSON.parse(userInfo)
    this.personInfo = this.$lodash.cloneDeep(userInfo)
  },
  watch: {
    showSubOrg() {
      this.getTableList()
    },
    status() {
      this.getTableList()
    }
  },
  methods: {
    storTble() {
      if (this.selectData.length != 1) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请勾选排序项(仅限一项)',
          type: NOTIFY.TYPE.WARNING
        })
        return false
      }
      getDeviceListApi({
        limit: 1000,
        page: 1,
        keyPartId: this.selectData[0].keyPartId
      })
        .then(res => {
          res = res.data.data
          this.sortData = []
          if (res.hosts && res.hosts.length !== 0) {
            this.sortData = res.hosts
          }
          this.showContent = 'sort'
        })
        .catch(() => {})
    },
    getLazyTreeApi(params) {
      return getLazyTreeApi(params)
    },
    clickData(data) {
      if (data && data.nodeKey && data.isRoot) {
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
        this.currentOrgId = data.id
        this.currentserial = data.serial
        this.currentKeyPartId = ''
        this.getTableList()
      }
    },
    onceClick(data, node) {
      if (!data.isRoot) {
        if (data.tierType === 'org') {
          this.currentOrgId = data.id
          this.currentserial = data.serial
          // zp
          this.currentKeyPartId = ''
          // zp
        } else {
          // this.currentOrgId = node.parent.data.id   //zp 注掉
          // zp新增
          this.currentOrgId = ''
          // zp新增
          this.currentKeyPartId = data.id
        }
        this.getTableList()
      }
    },
    getTableList() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          //
          // 请求表格数据方法
          let params = {
            limit: this.paginationConfig.limit,
            page: this.paginationConfig.page,
            rescusive: this.showSubOrg,
            orgId: this.currentOrgId
          }
          if (this.status !== '') {
            params.status = this.status
          }
          if (this.currentKeyPartId) {
            params['keyPartId'] = this.currentKeyPartId
          }
          // if (this.keyword) {
          //   params['key'] = this.keyword
          // }
          if (this.searchForm.keyword) {
            params['key'] = this.searchForm.keyword
          }
          this.tableData = []
          getDeviceListApi(params).then(res => {
            let { code, message, data } = res.data
            if (code === 0) {
              this.$notify({
                title: NOTIFY.TITLE.SUCCESS,
                message: '获取设备列表成功',
                type: NOTIFY.TYPE.SUCCESS
              })
              this.total = data.count && (data.count.total || 0)
              let hosts = this.$lodash.cloneDeep(data.hosts)
              hosts = hosts && hosts.map((item, index) => {
                for (let i in item) {
                  if (i === 'type') {
                    // console.log(i, item[i], DEVICETYPE)
                    if (DEVICETYPE.some(j => j.value === item[i])) {
                      item[i] = DEVICETYPE.filter(j => j.value === item[i])[0].label
                    }
                  } else if (i === 'brand') {
                    // console.log(i, item[i], BRANDS)
                    if (BRANDS.some(j => j.value === item[i])) {
                      item[i] = BRANDS.filter(j => j.value === item[i])[0].label
                    }
                  } else if (i === 'protocol') {
                    // console.log(i, item[i], TRANSPORTPROTOCOLS)
                    if (TRANSPORTPROTOCOLS.some(j => j.value === item[i])) {
                      item[i] = TRANSPORTPROTOCOLS.filter(j => j.value === item[i])[0].label
                    }
                  } else if (i === 'status') {
                    // console.log(i, item[i])
                    if (item[i] === 1) {
                      item[i] = '离线'
                    } else if (item[i] === 2) {
                      item[i] = '在线'
                    }
                  }
                }
                item['index'] = this.indexMethod(index)
                return item
              })
              this.tableData = hosts || []
            }
          })
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
    // 刷新表格
    refresh() {
      this.paginationConfig.page = 1
      this.paginationConfig.limit = 100
      this.$refs.listPagination.setPaginationConfig(this.paginationConfig)
      this.getTableList()
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.selectData = [...val]
    },
    // 组件更新
    changComponent(componentName) {
      if (componentName === 'Update') {
        if (this.selectData.length != 1) {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '请勾选编辑项(仅限一项)',
            type: NOTIFY.TYPE.WARNING
          })
          return false
        }
        this.$emit('modelChange', this.selectData[0], 'Update')
        componentName = 'Create'
      } else if (componentName === 'Create') {
        this.$emit(
          'modelChange',
          {
            orgId: '',
            keyPartId: '',
            keyPartType: '',
            subSystem: 1,
            assetCode: '',
            uniqueId: '',
            name: '',
            type: '',
            brand: '',
            modelNum: '',
            accessService: '',
            username: '',
            password: '',
            ip: '',
            dport: '',
            cport: '',
            accessProtocol: 'SDK',
            protocol: 1,
            inputNumber: 0,
            outputNumber: 0,
            analogNumber: 0,
            digitalNumber: 0,
            audioNumber: 0,
            // updatedBy: this.personInfo.name,
            // updatedDept: this.personInfo.orgName,
            // updatedAt: this.personInfo.createdAt
            updatedBy: '',
            updatedDept: '',
            updatedAt: ''
          },
          'Create'
        )
      }
      this.$parent.$parent.childrenComponent = componentName
    },
    rowDbClick(row) {
      this.selectData = [row]
      console.log(arguments, row, this.selectData)
      this.showContent = 'see'
      // this.$emit('modelChange', row)
      // this.$parent.$parent.childrenComponent = 'Info'
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    deleteDevice() {
      if (!this.selectData.length) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请勾选删除项',
          type: NOTIFY.TYPE.WARNING
        })
        return false
      }
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          // this.$notify({
          //   title: NOTIFY.TITLE.WARNING,
          //   message: '已取消删除',
          //   type: NOTIFY.TYPE.WARNING
          // })
        })
        .catch(() => {
          let sendData = this.selectData.map(item => {
            return item.id
          })
          deleteDeviceApi({
            ids: sendData
          }).then(res => {
            if (res.data.code === 0) {
              this.getTableList()
            }
          })
          // this.$notify({
          //   title: NOTIFY.TITLE.SUCCESS,
          //   message: '删除成功',
          //   type: NOTIFY.TYPE.SUCCESS
          // })
        })
    },
    moveLoc() {
      // 迁移
      if (!this.selectData.length) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请勾选迁移项',
          type: NOTIFY.TYPE.WARNING
        })
        return false
      }
      this.showContent = 'migrant'
    },
    getNvrChannelsInfoApis() {
      // 顶部获取按钮
      if (!this.selectData.length) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请勾选获取项',
          type: NOTIFY.TYPE.WARNING
        })
        return false
      }
      // 选中的设备Id
      let selectedDevIds = this.selectData.map(item => item.id)
      console.log(selectedDevIds)
      this.loading = true
      setTimeout(() => {
        if (this.loading != false) {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '请一次性选择少量的设备获取！',
            type: NOTIFY.TYPE.WARNING
          })
        }
      }, 60000)
      getNvrChannelsInfoApis(selectedDevIds)
        .then(res => {
          this.loading = false
          if (res.data.code == 0) {
            this.getTableList()
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: res.data.message,
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$notify({
            title: NOTIFY.TITLE.ERROR,
            message: '未知错误' + err,
            type: NOTIFY.TYPE.ERROR
          })
        })
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'status':
          params = cellValue === 2 ? '在线' : '离线'
          break
        case 'inputNumber':
        case 'outputNumber':
        case 'analogNumber':
        case 'audioNumber':
        case 'digitalNumber':
          params = cellValue === '' ? '0' : cellValue
          break
        case 'type':
          // obj = {
          //   1: 'NVR',
          //   2: 'HDVR',
          //   3: 'DVR',
          //   4: 'IPC',
          //   165: 'Vnvr'
          // }
          // params = obj[cellValue] || ''

          DEVICETYPE.map(item => {
            obj[item.value] = item.label || ''
          })
          params = obj[cellValue] || ''
          break
        case 'protocol':
          TRANSPORTPROTOCOLS.map(item => {
            obj[item.value] = item.label || ''
          })
          params = obj[cellValue] || ''
          break
        case 'brand':
          params = (() => {
            let label = BRANDS.find(item => {
              return item.value == cellValue
            })
            return label ? label.label : ''
          })()
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
      // 导出
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = ['序号', '所属机构', '所属重点部位', '设备名称', '设备类型', '品牌', '型号', '序列号', '资产编码', 'IP', '控制端口', '数据端口', '接入服务器', '接入协议', '传输协议', '模拟通道数', '数字通道数', '音频通道数', '报警输入数', '报警输出数', '状态', '录入机构', '录入人', '录入时间']
      const filterVal = ['index', 'orgName', 'keyPartName', 'name', 'type', 'brand', 'modelNum', 'uniqueId', 'assetCode', 'ip', 'cport', 'dport', 'accessService', 'accessProtocol', 'protocol', 'analogNumber', 'digitalNumber', 'audioNumber', 'inputNumber', 'outputNumber', 'status', 'updatedDept', 'updatedBy', 'updatedAt']
      if (this.selectData && this.selectData.length > 0) {
        let list = this.selectData
        let data = list.map(v => filterVal.map(j => v[j]))
        // data = data.map(item => this.formatt(item))
        export_json_to_excel(tHeader, data, `视频主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
        let params = {
          pattern: 'list',
          status: this.status,
          orgId: this.currentOrgId,
          keyPartId: this.currentKeyPartId || '',
          rescusive: this.showSubOrg,
          // key: this.keyword
          key: this.searchForm.keyword
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/video/download/host`
        let name = `视频主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '导出文件下载失败！',
              type: NOTIFY.TYPE.ERROR
            })
          },
          () => {},
          'post',
          params
        )
      }
    },
    Toprint() {
      // 打印
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // list = list.map(item => this.formatt(item))
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'index', displayName: '序号' },
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '设备名称' },
          { field: 'type', displayName: '设备类型' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'uniqueId', displayName: '序列号' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'ip', displayName: 'IP' },
          { field: 'cport', displayName: '控制端口' },
          { field: 'dport', displayName: '数据端口' },
          { field: 'accessService', displayName: '接入服务器' },
          { field: 'accessProtocol', displayName: '接入协议' },
          { field: 'protocol', displayName: '传输协议' },
          { field: 'analogNumber', displayName: '模拟通道数' },
          { field: 'digitalNumber', displayName: '数字通道数' },
          { field: 'audioNumber', displayName: '音频通道数' },
          { field: 'inputNumber', displayName: '报警输入数' },
          { field: 'outputNumber', displayName: '报警输出数' },
          { field: 'status', displayName: '状态' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">视频主机列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:10px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:8px; text-align:center;'
      })
    },
    formatt(row) {
      let obj = {}
      for (let i in row) {
        if (i == 'status') {
          obj[i] = row[i] === 2 ? '在线' : '离线'
        }
        if (i == ('inputNumber' || 'outputNumber' || 'analogNumber' || 'audioNumber' || 'digitalNumber')) {
          obj[i] = row[i] === '' ? '0' : row[i]
        }
        if (i == 'type') {
          obj[i] = DEVICETYPE.filter(item => item.value === row[i])[0]
            ? DEVICETYPE.filter(item => item.value === row[i])[0].label
            : '  '
        }
        if (i == 'protocol') {
          obj[i] = TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0]
            ? TRANSPORTPROTOCOLS.filter(item => item.value === row[i])[0].label
            : '  '
        }
        if (i == 'brand') {
          obj[i] = BRANDS.filter(item => item.value === row[i])[0]
            ? BRANDS.filter(item => item.value === row[i])[0].label
            : '  '
        }
      }
      return Object.assign(row, obj)
      // let params = ''
      // let obj = {}
      // switch (column.property) {
      //   case 'status':
      //     params = cellValue === 2 ? '在线' : '离线'
      //     break
      //   case 'inputNumber':
      //   case 'outputNumber':
      //   case 'analogNumber':
      //   case 'audioNumber':
      //   case 'digitalNumber':
      //     params = cellValue === '' ? '0' : cellValue
      //     break
      //   case 'type':
      //     // obj = {
      //     //   1: 'NVR',
      //     //   2: 'HDVR',
      //     //   3: 'DVR',
      //     //   4: 'IPC',
      //     //   165: 'Vnvr'
      //     // }
      //     // params = obj[cellValue] || ''

      //     DEVICETYPE.map((item)=> {
      //           obj[item.value]=item.label ||''
      //       });
      //       params = obj[cellValue] || ''
      //     break
      //   case 'protocol':
      //     obj = {
      //       1: 'TCP',
      //       2: 'UDP'
      //     }
      //     params = obj[cellValue] || ''
      //     break
      //   case 'brand':
      //     params = (() => {
      //       let label = BRANDS.find((item) => {
      //         return item.value == cellValue
      //       })
      //       return label?label.label:''
      //     })()
      //     break
      //   default:
      //     params = cellValue
      //     break
      // }
      // return params
    }
  }
}
</script>

<style lang="less" scoped>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-container {
    width: 280px;
    height: 100%;
    overflow: auto;
  }
  .content {
    width: calc(~'100% - 280px');
    padding-left: 22px;
    box-shadow: 0 0 10px #ccc inset;
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
          width: 830px;
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
  }
}
.div-inline {
  float: right;
}
</style>
