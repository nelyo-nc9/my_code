<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
        searchType="search"
        :treeType="treeType"
        @rootId = 'setRootId'
        @clickData = 'clickData'
        @onceClick="onceClick"
        :customizeQuery="customizeQuery"
        :lazyTreeSearchApi="getLazyTreeSearchApi"
        treeLazyToggle iconToggle></treeBox>
    </div>
    <div class="right-content">
      <div class="top-box" v-show="!sortHostShow && !moveShow && !isShowDetail">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" icon="el-icon-plus" @click="skipTo('AddAlarmHost', 1)">新建</el-button>
          <el-button size="mini" icon="el-icon-edit-outline" @click="skipTo('AddAlarmHost', 2)">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" @click="delAlarmHost">删除</el-button>
          <el-button size="mini" icon="icon iconfont-ccb ccbqianyi el-icon-" :disabled="selectItem.length===0" @click="move">迁移</el-button>
          <!-- <el-button size="mini" icon="el-icon-view" @click="seeSetails">查看</el-button> -->
          <el-button size="mini" class="icon el-icon-sort" @click="sort" :disabled="selectItem.length!==1">排序</el-button>
          <!-- <el-button size="mini" icon="icon iconfont-ccb ccbdaoru el-icon-" @click="skipTo('ImportAlarmHost', 3)">导入</el-button> -->
          <el-button size="mini" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFile">导出</el-button>
          <el-button size="mini" icon="el-icon-printer" @click="Toprint">打印</el-button>
        </div>
      </div>
      <div class="table-box" v-show="!sortHostShow && !moveShow">
        <div v-if="!isShowDetail" class="table-top">
          <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg" @change="changeSuborg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="refreshList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search" placeholder="请输入设备名称或设备IP" v-model="fuzzyQuery" @change="fuzzyQueryChange" style="float:right;width:200px;" size="mini"></el-input>
          <el-select style="float:right;width:85px;margin-right:12px;" v-model="onlineStatus" @change="statusChange" size="mini">
            <el-option label="全部" value=""></el-option>
            <el-option label="在线" value="2"></el-option>
            <el-option label="离线" value="1"></el-option>
          </el-select>
        </div>
        <div v-if="!isShowDetail" style="flex:1;" ref="tableBox">
          <el-table :data="tableData" border size="mini" stripe :height="tableHeight" @row-dblclick="showDetail" @selection-change="handleSelectionChange">
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
            background
            style="text-align:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="pageSize"
            :current-page="page"
            :total="total"
          ></el-pagination> -->
          <video-pagination ref="listAlarmPagination"
                  :total="total"
                  :pageSizes="[10, 25, 50, 100]"
                  :limitDefault="pageSize"
                  @paginationConfChange="eventChange"></video-pagination>
        </div>
        <div v-if="isShowDetail" style="flex:1;width: 900px;text-align:center;overflow: auto;">
          <div class="detail-footer">
            <el-button type="primary" size="mini">打印</el-button>
            <el-button size="mini" @click="closeDetail">取消</el-button>
          </div>
          <div>报警主机信息</div>
          <div class="detail-box">
            <!-- <div class="detail-item">
              <div class="item-left">所属子系统</div>
              <div class="item-right">{{activeData.subsystemId}}</div>
            </div> -->
            <div class="detail-item">
              <div class="item-left">所属机构</div>
              <div class="item-right">{{activeData.orgName}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">所属重点部位</div>
              <div class="item-right">{{activeData.locName}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">设备类型</div>
              <div class="item-right">{{activeData.deviceType}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">设备名称</div>
              <div class="item-right">{{activeData.name}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">资产编码</div>
              <div class="item-right">{{activeData.code}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">设备品牌</div>
              <div class="item-right">{{activeData.brand}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">设备型号</div>
              <div class="item-right">{{activeData.deviceModel}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">网络模块品牌</div>
              <div class="item-right">{{activeData.netModuleBrand}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">网络模块类型</div>
              <div class="item-right">{{activeData.netModuleModel}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">网络模块ID</div>
              <div class="item-right">{{activeData.netModuleID}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">键盘密码</div>
              <div class="item-right">{{activeData.keyboardPassword}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">IP地址</div>
              <div class="item-right">{{activeData.ip}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">网络端口</div>
              <div class="item-right">{{activeData.port}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">所属服务</div>
              <div class="item-right" :title="activeData.service">{{activeData.service}}</div>
            </div>
            <!-- <div class="detail-item">
              <div class="item-left">网域</div>
              <div class="item-right">{{activeData.domain}}</div>
            </div> -->
            <div class="detail-item">
              <div class="item-left">探测器数量</div>
              <div class="item-right">{{activeData.detectorNo}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">输出通道数量</div>
              <div class="item-right">{{activeData.outputNo}}</div>
            </div><div class="detail-item">
              <div class="item-left">子系统数量</div>
              <div class="item-right">{{activeData.subsystemNo}}</div>
            </div>
          </div>
          <div class="detail-bottom">
            <div class="detail-item">
              <div class="item-left">录入时间</div>
              <div class="item-right">{{activeData.updatedAt}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">录入机构</div>
              <div class="item-right">{{activeData.createdDept}}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">录入人</div>
              <div class="item-right">{{activeData.createdBy}}</div>
            </div>
          </div>
          <div class="detail-center">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('detector')">
                探测器列表
                <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.detector" style="width:100%;">
              <el-table :data="detectorList" border style="width: 100%" height="201" size="mini" stripe>
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in detectorTableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
                <!-- <el-table-column label="操作"> -->
                  <!-- <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" disabled>编辑</el-button>
                  </template> -->
                <!-- </el-table-column> -->
              </el-table>
            </div>
          </div>
          <div class="detail-center">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('output')">
                输出通道列表
                <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.output" style="width:100%;">
              <el-table :data="outputList" border style="width: 100%" height="201" size="mini" stripe>
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in outputTableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detail-center">
            <div class="box-title">
              <span class="pointer" @click="toggleOpen('subsystem')">
                子系统列表
                <i :class="dropdownStatus.subsystem ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.subsystem" style="width:100%;">
              <el-table :data="subSystemList" border style="width: 100%" height="201" size="mini" stripe>
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column
                  v-for="item in subSystemColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <SortHost v-show="sortHostShow" ref="srotRef" :sortHostShow.sync="sortHostShow" :locationIdSort="selectItem.length===1 ? selectItem[0] : ''"></SortHost>
      <Move v-show="moveShow" :moveShow.sync="moveShow" :migrantData="selectItem" @aginGetTable="aginGetTable"></Move>
    </div>
    <el-dialog
      title="删除确认"
      :visible.sync="dialogVisible" :close-on-click-modal="false"
      width="30%">
      <span>请确认是否删除所选主机？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confDeleteHost">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="迁移设备"
      :visible.sync="moveEquipmentShow" :close-on-click-modal="false"
      width="30%">
      <div class="dialog-body">
        <div class="dialog-body-left">
          <span>源</span>
          <div class="dialog-body-center">
            <el-checkbox style="margin-right:12px;" v-model="alarmCtrl">报警控制主机-高柜1</el-checkbox>
          </div>
        </div>
        <div class="dialog-body-right">
          <span>目标</span>
          <div class="dialog-body-center">
            <OrgTree></OrgTree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveEquipmentShow = false">取 消</el-button>
        <el-button type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { alarmGetTreeApi, alarmSearchTree } from '@src/http/alarm/alarmHostConfig.api.js' // alarmHostGetTreeApi
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
import OrgTree from '../../../alarmHost/OrgTree'
import treeBox from '@src/components/tree/treeBox'
import SortHost from './SortHost'
import Move from './Move'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    treeBox,
    OrgTree,
    SortHost,
    Move,
    VideoPagination
  },
  data() {
    return {
      // migrantData: [], // 迁移弹窗的源数据
      fuzzyQuery: '',
      treeType: 2,
      rootId: '',
      customizeQuery: {
        params: {
          subSystem: '2',
          isRecursion: '0'
        }
      },
      dropdownStatus: {
        detector: true,
        output: true,
        subsystem: true
      },
      dialogVisible: false,
      moveEquipmentShow: false,
      sortHostShow: false,
      moveShow: false,
      onlineStatus: '',
      isShowSubOrg: true,
      alarmCtrl: false,
      tableHeight: 688,
      pageSize: 25,
      page: 1,
      total: 0,
      tableColumn: [
        // 表格标题行内容
        // { prop: 'subsystem', label: '所属子系统', width: '110', sortable: true },
        { prop: 'orgName', label: '所属机构', width: '100', sortable: true },
        { prop: 'locName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'deviceType', label: '设备类型', width: '120', sortable: true },
        { prop: 'name', label: '设备名称', width: '100', sortable: true },
        { prop: 'code', label: '资产编码', width: '100', sortable: true },
        { prop: 'brand', label: '设备品牌', width: '100', sortable: true },
        { prop: 'deviceModel', label: '设备型号', width: '100', sortable: true },
        { prop: 'netModuleBrand', label: '网络模块品牌', width: '120', sortable: true },
        { prop: 'netModuleModel', label: '网络模块型号', width: '120', sortable: true },
        { prop: 'netModuleID', label: '网络模块ID', width: '110', sortable: true },
        { prop: 'keyboardPassword', label: '键盘密码', width: '100', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '100', sortable: true },
        { prop: 'port', label: '网络端口', width: '100', sortable: true },
        { prop: 'userName', label: '用户名', width: '90', sortable: true },
        { prop: 'password', label: '密码', width: '80', sortable: true },
        { prop: 'service', label: '所属服务', width: '100', sortable: true },
        // { prop: 'domain', label: '网域', width: '100', sortable: true }, 去掉
        { prop: 'detectorNo', label: '探测器数量', width: '110', sortable: true },
        { prop: 'outputNo', label: '输出通道数量', width: '120', sortable: true },
        { prop: 'subsystemNo', label: '子系统数量', width: '110', sortable: true },
        { prop: 'status', label: '状态', width: '80', sortable: true },
        { prop: 'createdBy', label: '录入人', width: '100', sortable: true },
        { prop: 'createdDept', label: '录入机构', width: '100', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '120', sortable: true }
      ],
      tableData: [
        // 列表数据
      ],
      detectorTableColumn: [
        // 探测器列表项
        { prop: 'name', label: '探测器名称', width: '' },
        { prop: 'serialNumber', label: '防区序号', width: '' },
        { prop: 'deviceType', label: '设备类型', width: '' },
        { prop: 'count', label: '数量', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      outputTableColumn: [
        // 输出通道表格项
        { prop: 'name', label: '输出通道名称', width: '' },
        { prop: 'serialNumber', label: '通道序号', width: '' },
        { prop: 'deviceType', label: '设备类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'code', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      subSystemColumn: [
        // 子系统表格项
        { prop: 'name', label: '子系统名称', width: '' },
        { prop: 'serialNumber', label: '子系统序号', width: '' },
        { prop: 'hasDetector', label: '包含探测器', width: '' },
        { prop: 'hasOutput', label: '包含输出通道', width: '' }
      ],
      detectorList: [], // 探测器列表数据
      outputList: [], // 输出通道表格数据
      subSystemList: [], // 子系统列表数据
      activeData: null,
      isShowDetail: false,
      selectionIds: [],
      selectItem: [],
      currentOrgId: '',
      currentKeyPartId: '',
      getHostListArgs: {}
    }
  },
  created() {
    // this.getAlarmHostList()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  watch: {
    rootId() {
      // this.getTableList()
    },
    sortHostShow(value) {
      console.log(value, '排序界面是否显示')
      if (!value) {
        this.getAlarmHostList()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID', 'SET_HOST_INFO', 'SET_SKIP_NUM']),
    ...mapActions(['getAlarmHost', 'deleteAlarmHost', 'getDetector', 'getOutputChan', 'getSubsystem']),
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 2,
        key: params.search
      }
      return alarmSearchTree(params)
    },
    changeSuborg() {
      this.getAlarmHostList()
    },
    refreshList() {
      this.getAlarmHostList()
      this.$notify.success({
        title: '成功',
        message: '刷新成功'
      })
    },
    aginGetTable() {
      this.getAlarmHostList()
    },
    fuzzyQueryChange() {
      this.getAlarmHostList()
    },
    statusChange() {
      this.getAlarmHostList()
    },
    // 打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectItem && this.selectItem.length > 0) {
        list = this.selectItem
      } else {
        list = this.tableData
      }
      let propArr = []
      for (let i = 0; i < this.tableColumn.length; i++) {
        let tempObj = {
          field: this.tableColumn[i].prop,
          displayName: this.tableColumn[i].label
        }
        propArr.push(tempObj)
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: propArr,
        type: 'json',
        // 表题
        header: '<p class="custom">报警主机列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;font-size:12px; text-align:center;'
      })
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
        filterVal.unshift('index')
        tHeader.unshift('序号')
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
        let params = {
          pattern: 'list',
          pageSize: this.pageSize,
          pageNum: this.page,
          key: this.fuzzyQuery,
          recursive: this.isShowSubOrg,
          orgId: this.currentOrgId,
          status: this.onlineStatus
        }
        if (this.currentKeyPartId) {
          params['locationId'] = this.currentKeyPartId
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/alarm-manage/v1/alarm-host/export`
        let name = `报警主机设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          params
        )
      }
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.getAlarmHostList()
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.getAlarmHostList()
    },
    // X条/页
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    getTreeApi(params) {
      return alarmGetTreeApi(params)
    },
    setRootId(id) {
      this.rootId = id
    },
    clickData(data) {
      if (data.isRoot) {
        this.currentOrgId = data.id
        this.currentKeyPartId = ''
        this.getAlarmHostList()
      }
    },
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.currentOrgId = data.id
        this.currentKeyPartId = ''
      } else {
        this.currentOrgId = ''
        this.currentKeyPartId = data.id
      }
      this.getAlarmHostList()
    },
    move() {
      this.moveShow = true
    },
    sort() {
      this.sortHostShow = true
      this.$refs.srotRef.getAlarmHostList()
    },
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
    skipTo(data, num) {
      if (num === 2) {
        if (this.selectItem.length < 1) {
          this.$notify.warning({
            title: '警告',
            message: '请至少选择一条'
          })
          return
        }
        if (this.selectItem.length > 1) {
          this.$notify.warning({
            title: '警告',
            message: '最多只能选择一条'
          })
          return
        }
      }
      this.SET_COMPONENTID(data)
      this.SET_SKIP_NUM(num)
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 56
    },
    getAlarmHostList() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.page,
        key: this.fuzzyQuery,
        recursive: this.isShowSubOrg,
        orgId: this.currentOrgId,
        status: this.onlineStatus
      }
      if (this.currentKeyPartId) {
        params['locationId'] = this.currentKeyPartId
      }
      this.getAlarmHost(params).then(res => {
        this.total = res.page ? res.page.length : 0
        const result = res.results
        Array.isArray(result) && result.forEach((item, index) => {
          item.index = index + 1
          item.netModuleID = item.netModuleID ? item.netModuleID : ''
          item.createdBy = item.createdBy ? item.createdBy : ''
          item.createdDept = item.createdDept ? item.createdDept : ''
          // if (item.updatedAt !== undefined) {
          //   item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
          // }
          if (item.status !== undefined) {
            item.status = item.status === 1 ? '离线' : '在线'
          }
          // this.migrantData.push({
          //   id: item.id,
          //   name: item.name
          // })
        })
        console.log(result, 'result===========')
        this.tableData = result
      }).catch(err => {
        console.log(err)
      })
    },
    delAlarmHost() {
      if (this.selectItem.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的报警主机'
        })
        return
      }
      this.dialogVisible = true
    },
    confDeleteHost() {
      this.deleteAlarmHost(this.selectionIds).then(res => {
        console.log(res, '删除报警主机:deleteAlarmHost')
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.dialogVisible = false
        this.getAlarmHostList()
      }).catch(err => {
        console.log(err)
      })
    },
    seeSetails() {
      if (this.selectItem.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要查看的报警主机'
        })
        return
      }
      if (this.selectItem.length > 1) {
        this.$notify.warning({
          title: '警告',
          message: '最多只能选择一条'
        })
        return
      }
      this.activeData = this.selectItem[0]
      this.isShowDetail = true
      this.getDetectorList(this.activeData.id)
      this.getOutputChanList(this.activeData.id)
      this.getSubsystemList(this.activeData.id)
    },
    showDetail(row) {
      this.activeData = row
      this.isShowDetail = true
      this.getDetectorList(row.id)
      this.getOutputChanList(row.id)
      this.getSubsystemList(row.id)
    },
    getDetectorList(id) {
      this.getDetector({hostId: id, isMain: 'T'}).then(res => {
        const result = res.results
        Array.isArray(result) && result.forEach(item => {
          // item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
        })
        this.detectorList = result
      }).catch(err => {
        console.log(err)
      })
    },
    getOutputChanList(id) {
      this.getOutputChan({hostId: id}).then(res => {
        const result = res.results
        Array.isArray(result) && result.forEach(item => {
          // item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
        })
        this.outputList = result
      }).catch(err => {
        console.log(err)
      })
    },
    getSubsystemList(id) {
      this.getSubsystem({hostId: id}).then(res => {
        const result = res.results
        Array.isArray(result) && result.forEach(item => {
          // item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
        })
        this.subSystemList = result
      }).catch(err => {
        console.log(err)
      })
    },
    closeDetail() {
      this.isShowDetail = false
    },
    /*
     * 列表选中复选框
     * @params selection 选中的数据集合
     */
    handleSelectionChange(selection) {
      this.selectItem = []
      this.selectItem = selection
      this.SET_HOST_INFO(selection)
      this.selectionIds = []
      for (let i = 0; i < selection.length; i++) {
        this.selectionIds.push(selection[i].id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #F2F2F2;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 100px;
        background: #F8F8F8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #F8F8F8;
        border-left: none;
      }
    }
  }
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-center {
    width: 100%;
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      text-align: left;
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
  .detail-footer {
    margin-top: 24px;
    display: flex;
  }
  .dialog-body {
    display: flex;
    .dialog-body-left {
      width: 50%;
      text-align: center;
      margin-right: 20px;
      .dialog-body-center {
        border: 1px solid #ddd;
        height: 400px;
      }
    }
    .dialog-body-right {
      width: 50%;
      text-align: center;
      .dialog-body-center {
        // border: 1px solid #ddd;
        height: 400px;
      }
    }
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
