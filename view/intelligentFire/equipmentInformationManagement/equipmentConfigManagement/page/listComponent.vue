<template>
  <div class="content">
    <div class="left-tree">
      <div class="tree-title">
        <span>机构</span>
        <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      </div>
      <orgTree
        ref="tree"
        :lazyTreeApi="getTreeApi"
        :customizeQuery="customizeQuery"
        :treeType="1"
        iconToggle
        treeLazyToggle
        searchType="filter"
        @onceClick="onceClick"
        @rootId="rootId"
      ></orgTree>
    </div>
    <div class="right-content">
      <div v-if="!isShowDetail && !isShowConfig" class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>设备配置管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统部件关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" @click="isShowConfig = true" :disabled="isselect">关联配置</el-button>
          <el-button size="mini" @click="getAlarmHostList(2)">获取关联</el-button>
          <el-button size="mini" @click="isShowDetail = true" :disabled="isselect">查看关联拓扑</el-button>
          <el-button size="mini" @click="exportExcel">导出</el-button>
          <el-button size="mini" @click="Toprint">打印</el-button>
        </div>
      </div>
      <div v-if="!isShowDetail && !isShowConfig" style="flex:1;" ref="tableBox">
        <!-- <div class="table-top">
          <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList">刷新列表</el-button>
        </div> -->
        <div class="flex-between" style="margin-bottom:10px;text-align:right;">
          <el-input
            style="width:200px;"
            placeholder="请输入设备名称"
            size="mini"
            @keyup.enter.native="checkName"
            v-model="name"
          >
            <i slot="suffix" @click="checkName" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-table
          border
          size="mini"
          height="710"
          :data="tableData"
          @row-dblclick="showDetail"
          @selection-change="select"
          style="width: 100%"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            min-width="150"
            show-overflow-tooltip
            sortable
            align="center"
          >
            <template slot-scope="scope">
              <span
                style="color:#409EFF;cursor: pointer;"
                v-if="tbColumn.includes(item.label) === true && scope.row[item.prop] === 2"
                @click="handleEdit1(scope.$index, scope.row)"
                >已关联</span
              >
              <!-- <el-button
                type="text"
                v-if="tbColumn.includes(item.label) === true && scope.row[item.prop] === 2"
                @click="handleEdit(scope.$index, scope.row)"
                >未关联</el-button
              > -->
              <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
              <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
              <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">故障</span>
              <span v-if="scope.row[item.prop] === 4 && item.prop === 'status'">报警</span>
              <span v-if="tbColumn.includes(item.label) === false && item.prop !== 'status'">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="text-align:right;margin:30px 30px 30px 0;">
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :current-page="pageCurrents"
            layout="total, sizes,slot, prev"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
          >
            <el-button class="pageBtn" type="text" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
          </el-pagination>
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :page-count="1"
            :total="total"
            :current-page="pageCurrents"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
            layout="slot"
          >
            <span>{{ pageCurrents }}/{{ pageCounts }}</span>
          </el-pagination>
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :current-page="pageCurrents"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
            layout="next,slot, jumper"
            ><el-button class="pageBtn" type="text" :disabled="pageCurrent === pageCounts" @click="pageNext"
              >末页</el-button
            ></el-pagination
          >
        </div>
      </div>
      <detail
        v-if="isShowDetail"
        :isShowDetail.sync="isShowDetail"
        :selectedData="selectData"
        :configType="configType"
        @changeComponent="changeComponent"
      ></detail>
      <linkConfig
        v-if="isShowConfig"
        :isShowConfig.sync="isShowConfig"
        :selectedData="selectData"
        :configType="configType"
        @changeComponent="changeComponent"
      ></linkConfig>

      <!-- // 已关联 -->
      <el-dialog class="visible" title="关联拓扑图" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-button @click="printVisible">打印</el-button>
        <div class="show-div" id="show-div">
          <div class="top" v-if="selectData.length > 0">
            <div class="top-info">
              <div class="info-item">
                <div class="info-label">所属机构</div>
                <div class="info-value">{{ selectData[0].orgName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">所属重点部位</div>
                <div class="info-value">{{ selectData[0].keyPartName }}</div>
              </div>
              <div class="info-item" v-if="configType != '视频主机关联配置'">
                <div class="info-label">所属设备</div>
                <div class="info-value">{{ selectData[0].hostName }}</div>
              </div>
              <div class="info-item" v-if="configType != '视频主机关联配置'">
                <div class="info-label">通道名称</div>
                <div class="info-value">{{ selectData[0].name }}</div>
              </div>
            </div>
            <div class="gplot-top">
              <gplot :gplotData="gplotData" v-if="gplotData.length > 0"></gplot>
            </div>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="clickCancel">关 闭</el-button>
        </span> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import orgTree from '@src/components/tree/treeBox'
import detail from './components/detail'
import Gplot from './components/gplot'
// import { getDeviceOrResourceApi } from '@src/http/video/videoConfig.api.js'
import linkConfig from './components/linkConfig'
import { fireInterface, fireDeploy } from '@src/http/intelligentFire/equipmentManagement.js'
// import OrgTree from '../../../OrgTree'
export default {
  name: 'fireLinkList',
  components: {
    detail,
    Gplot,
    linkConfig,
    orgTree
  },
  data() {
    return {
      name: '', // 设备名称
      tbColumn: ['关联摄像头', '关联对讲通道', '关联门禁通道', '关联输出通道'], // 判断列表操作列
      // 树
      customizeQuery: {
        keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      currentOrgId: '',
      currentKeyPartId: '',
      deviceId: '',
      tierType: 'org',
      sourceData: '',
      gplotData: '',
      dialogVisible: false, // 已关联
      configType: '系统部件关联配置',
      selectData: [], // 选中数据
      isShowSubOrg: false, // 显示子机构
      isShowDetail: false, // 控制详情页显隐
      isShowConfig: false, // 控制 关联配置页 显隐
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2 // 是否显示子机构， 1-是 2-否
      },
      tableColumn: [
        {
          prop: 'orgName',
          label: '所属机构'
        },
        {
          prop: 'keyPartName',
          label: '所属部位'
        },
        {
          prop: 'name',
          label: '部件名称'
        },
        {
          prop: 'brand',
          label: '部件品牌'
        },
        {
          prop: 'partsModel',
          label: '部件型号'
        },
        {
          prop: 'partsType',
          label: '部件类型'
        },
        {
          prop: 'areaCode',
          label: '部件区号'
        },
        {
          prop: 'loopCode',
          label: '部件回路'
        },
        {
          prop: 'addressCode',
          label: '部件位号'
        },
        {
          prop: 'address',
          label: '安装位置'
        },
        {
          prop: 'status',
          label: '部件状态'
        },
        {
          prop: 'description',
          label: '状态描述'
        },
        {
          prop: 'assetsCode',
          label: '资产编号'
        },
        {
          prop: 'isVideoLink',
          label: '关联摄像头'
        },
        {
          prop: 'isAudioLink',
          label: '关联对讲通道'
        },
        {
          prop: 'isGuardLink',
          label: '关联门禁通道'
        },
        {
          prop: 'isOutputLink',
          label: '关联输出通道'
        },
        {
          prop: 'updatedBy',
          label: '录入人'
        },
        {
          prop: 'updatedDept',
          label: '录入机构'
        },
        {
          prop: 'createdAt',
          label: '录入时间'
        }
      ], // 表头
      tableData: [
        // 列表数据
      ]
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)
    // 初始化列表
    this.defaulTableList()
    if (this.selectData.length > 0) {
      this.sourceData = this.selectData[0]
      let id = this.selectData[0].id
      let param = {
        ref: this.configType === '消防系统关联配置' ? 1 : 2
      }
      fireInterface.getDeviceOrResourceApi(id, param).then(res => {
        if (res.data.code === 0) {
          this.dealData(res.data.data)
        }
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      console.log(this.pageCurrent)
      return this.pageCurrent
    },
    isselect: function() {
      return this.selectData.length === 0
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  watch: {
    // 是否显示子机构
    isShowSubOrg() {
      this.defaultParams.isChildren = this.isShowSubOrg === true ? 1 : 2
      this.getTableList(this.defaultParams)
    },
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.getTableList(this.defaultParams)
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.getTableList(this.defaultParams)
    },
    name: function() {
      this.defaultParams.name = this.name
    }
  },
  methods: {
    // 已关联
    dealData(data) {
      if (!data) {
        return false
      }
      let gpData = []
      gpData.push({
        id: data.id,
        type: 'videoHost',
        center: true,
        name: data.name
      })
      data.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      data.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      data.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      data.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
        }
        gpData.push(obj)
      })
      this.gplotData = gpData
    },
    // 树
    onceClick(data, node) {
      console.log(data, node)
      let params = {
        pageSize: this.pageSize,
        page: this.pageCurrent,
        isChildren: this.isShowSubOrg === false ? 2 : 1
      }
      if (data.tierType === 'org') {
        // 机构
        params.orgId = data.id
        // 记录搜索条件
        this.defaultParams = params
        this.getTableList(params)
      } else if (data.tierType === 'loc') {
        // 重点部位
        let parentNode = node.parent
        if (!parentNode) {
          return
        }

        params.orgId = (parentNode.data && node.parent.data.id) || ''
        params.keyPartId = data.id
        // params.keyPartType = data.id
        // 记录搜索条件
        this.defaultParams = params
        this.getTableList(params)
      } else {
        let params = {
          id: data.id
        }
        fireInterface
          .getHostParts(params)
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data.partsInfo
              this.total = res.data.data.page.totalNumber || 1
            } else {
              // this.$message.error('error')
            }
          })
          .catch(_ => {
            // this.$message.error('数据请求失败')
          })
      }
    },
    rootId(id) {
      this.currentOrgId = id
    },
    // 树
    getTreeApi(params) {
      return fireInterface.getTreeApi(params)
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    // 初始化列表
    defaulTableList() {
      // 查询列表条件
      this.defaultParams.pageSize = this.pageSize
      this.defaultParams.page = this.pageCurrent
      this.defaultParams.isChildren = this.isShowSubOrg === true ? 1 : 2 // 是否显示子机构， 1-是 2-否

      this.getTableList(this.defaultParams)
    },
    // 获取主机列表
    getTableList(params, id) {
      fireInterface.queryHostParts(params).then(res => {
        if (res.data.code === 0) {
          if (id === 2) {
            this.$notify.success({
              message: '获取关联成功',
              title: '成功'
            })
          }
          this.tableData = res.data.data.partsInfo
          this.total = res.data.data.page.totalNumber || 1
        } else {
          // this.$message.error('error')
        }
      })
      // .catch(_ => {
      //   this.$message.error('数据请求失败')
      // })
    },
    // 列表数据变化
    resizeFun() {
      this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 32)
    },
    // 刷新列表
    getAlarmHostList(val) {
      this.getTableList(this.defaultParams, val)
    },
    // 表头input搜索
    checkName() {
      this.defaultParams.page = 1
      this.defaultParams.name = this.name
      this.getTableList(this.defaultParams)
    },
    // 选中数据
    select(val) {
      this.selectData = val
    },
    // 双击详情
    showDetail(row) {
      this.selectData = []
      this.selectData.push(row)
      this.isShowDetail = true
    },
    // 未配置
    handleEdit(index, row) {
      this.selectData = []
      this.isShowConfig = true
      this.selectData.push(row)
    },
    // 已关联
    handleEdit1(index, row) {
      console.log(row)
      this.selectData = []
      this.gplotData = []
      this.dialogVisible = true
      this.selectData.push(row)
      console.log(this.selectData)
      let id = row.id
      let param = {
        ref: 2
      }
      fireDeploy.getDeviceOrResourceApi(id, param).then(res => {
        if (res.data.code === 0) {
          this.dealData(res.data.data)
        }
      })
    },
    clickCancel() {
      this.dialogVisible = false
      this.selectData = []
    },
    // 跳转页面
    changeComponent(value) {
      this.selectData = []
      this.isShowConfig = false
      this.isShowDetail = false
      this.getTableList(this.defaultParams)
    },
    // 改变pageSize
    pageSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      console.log(this.pageCurrent)
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    },
    formatList(list, clomn) {
      let data = []
      list.map((item, index) => {
        let obj = { index: `${++index}` }
        clomn.map((childItem, childIndex) => {
          if (childItem.prop === 'status') {
            switch (item[childItem.prop]) {
              case 1:
                item[childItem.prop] = '离线'
                break
              case 2:
                item[childItem.prop] = '在线'
                break
              case 3:
                item[childItem.prop] = '故障'
                break
              case 4:
                item[childItem.prop] = '报警'
                break
              default:
                item[childItem.prop] = ' '
                break
            }
          }
          if (
            childItem.prop === 'isVideoLink' ||
            childItem.prop === 'isAudioLink' ||
            childItem.prop === 'isOutputLink' ||
            childItem.prop === 'isGuardLink'
          ) {
            item[childItem.prop] = item[childItem.prop] === 2 ? '已关联' : ' '
          }
          obj[childItem.prop] = item[childItem.prop] ? item[childItem.prop] : ' '
        })
        data.push(obj)
      })
      return data
    },
    // 导出excel
    exportExcel() {
      // 有数据走前端导出
      let tHeader = ['序号']
      let filterVal = ['index']
      this.tableColumn.map(n => {
        tHeader.push(n.label)
        filterVal.push(n.prop)
      })
      let filename = '系统部件关联配置列表'
      if (this.selectData.length) {
        let selectData = this.$lodash.cloneDeep(this.selectData)
        selectData.map((item, index) => {
          item.index = index + 1
          switch (item.status) {
            case 1:
              item.status = '离线'
              break
            case 2:
              item.status = '在线'
              break
            case 3:
              item.status = '故障'
              break
            case 4:
              item.status = '报警'
              break
          }
          item.isVideoLink = item.isVideoLink === 2 ? '已关联' : ''
          item.isAudioLink = item.isAudioLink === 2 ? '已关联' : ''
          item.isGuardLink = item.isGuardLink === 2 ? '已关联' : '' // 门禁
          item.isOutputLink = item.isOutputLink === 2 ? '已关联' : ''
        })
        handleExport(
          tHeader,
          filterVal,
          `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`,
          selectData
        )
      } else if (this.tableData.length > 0 && this.selectData.length === 0) {
        // 无数据走接口
        let params = { isChildren: this.defaultParams.isChildren }
        fireInterface
          .createHostPartExcel(params)
          .then(res => {
            if (res.data.code === 0) {
              // zp去掉url中间的/host
              let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/fire/v1/system-manage/downFile?fileName=${res.data.data.fileName}`
              let name = `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
              download(
                url,
                name,
                () => {},
                () => {
                  this.$message({ type: 'info', message: '导出文件下载失败！' })
                },
                () => {},
                'get'
              )
            } else {
              this.$notify.error({
                message: '导出失败',
                title: '失败'
              })
            }
          })
          .catch(_ => {
            this.$notify.error({
              message: '导出接口错误',
              title: '错误'
            })
          })
      } else {
        this.$notify.warning({
          message: '列表暂无数据',
          title: '警告'
        })
      }
    },
    // 打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      let listData = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.$lodash.cloneDeep(this.selectData)
      } else {
        list = this.$lodash.cloneDeep(this.tableData)
      }
      let prints = {
        properties: [{ field: 'index', displayName: '序号' }]
      }
      this.tableColumn.map((n, index) => {
        prints.properties.push({ field: n.prop, displayName: n.label })
      })
      listData = this.formatList(list, this.tableColumn)
      printJS({
        // 表格数据的来源
        printable: listData,
        // field 表格内容  displayName：表头名
        properties: prints.properties,
        type: 'json',
        // 表题
        header: '<p class="custom">系统部件关联配置列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 打印
    printVisible() {
      console.log('yyyy')
      printJS('show-div', 'html')
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
    .tree-title {
      display: inline-block;
      width: 100%;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #f5f5f5;
      color: #333;
      font-size: 14px;
      // margin-bottom: 14px;
      font-weight: 400;
      position: relative;
    }
    .refresh {
      position: absolute;
      top: 0px;
      right: 7px;
      z-index: 2;
      cursor: pointer;
    }
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
    .button-box {
      margin: 12px 0;
    }
  }
  .visible {
    .top {
      width: 100%;
      height: auto;
      padding: 10px 0 0 10px;
      display: flex;
      .top-info {
        min-width: 290px;
        height: 160px;
        .info-item {
          // width: calc(~'100% - 2px');
          height: 40px;
          line-height: 40px;
          border: 1px solid #e1e1e1;
          border-top: none;
          display: flex;
          .info-label {
            width: 104px;
            height: 100%;
            background: #f5f5f5;
            text-align: center;
          }
          .info-value {
            flex: 1;
            text-indent: 20px;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 10px;
            overflow: hidden;
          }
          &:nth-child(1) {
            border-top: 1px solid #e1e1e1;
          }
        }
      }
      .gplot-top {
        flex: 1;
      }
    }
  }
  .pageBtn {
    color: #606266;
    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
