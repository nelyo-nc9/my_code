<template>
  <!-- treeLazyToggle -->
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
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>设备信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>设备数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ tableColumn.title }}数据表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" @click="exportExcel">导出</el-button>
          <el-button size="mini" @click="Toprint">打印</el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-top">{{ tableColumn.title }}数据表</div>
        <div ref="tableBox">
          <el-table :data="tableData" border size="mini" stripe height="745" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column
              v-for="item in tableColumn.header"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              sortable
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                <span v-if="scope.row[item.prop] === 3 && tableColumn.id !== 2 && item.prop === 'status'">故障</span>
                <span v-if="scope.row[item.prop] === 4 && tableColumn.id !== 2 && item.prop === 'status'">报警</span>
                <span v-if="scope.row[item.prop] === 3 && tableColumn.id === 2 && item.prop === 'status'">异常</span>
                <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
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
              <el-button type="text" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
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
              ><el-button type="text" :disabled="pageCurrent === pageCounts" @click="pageNext"
                >末页</el-button
              ></el-pagination
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import orgTree from '@src/components/tree/treeBox'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
export default {
  props: {
    tableColumn: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  name: 'equipmentDatasTable',
  components: {
    orgTree
  },
  data() {
    return {
      customizeQuery: {
        keywords: ['isRoot', 'orgId', 'keyPartId']
      },
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      // lastPageNum: Math.ceil(this.listTotal / this.pageSize), //
      tableData: [
        // 列表数据
      ],
      fireSelection: [],
      hostType: '', // 主机类型
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1 // 第几页
      }
    }
  },
  created() {
    // 初始化列表数据
    // this.defaultParams.type = this.tableColumn.id
    this.defaultParams.pageSize = this.pageSize
    this.defaultParams.page = this.pageCurrent
    this.seachCond()

    // this.getAlarmHostList(this.defaultParams)
    this.pageCount = Math.ceil(this.total / this.pageSize)
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    }
  },
  watch: {
    tableColumn: function() {
      this.$set(this.tableColumn, 'title', this.tableColumn.title)
      this.$set(this.tableColumn, 'id', this.tableColumn.id)
      this.seachCond()
    },
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.getAlarmHostList(this.defaultParams)
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.getAlarmHostList(this.defaultParams)
    }
  },
  // mounted() {
  //   window.addEventListener('resize', this.resizeFun)
  //   this.$nextTick(() => {
  //     this.resizeFun()
  //   })
  // },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  methods: {
    // 树
    getTreeApi(params) {
      return fireInterface.getTreeApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      // this.defaultParams.orgId = data.orgId
      // this.defaultParams.keyPartId = data.keyPartId
      if (data.tierType === 'org') {
        this.defaultParams.orgId = data.id
        this.defaultParams.keyPartId = ''
        this.defaultParams.hostType = ''
      } else if (data.tierType === 'loc') {
        this.defaultParams.orgId = node.parent.data.id
        this.defaultParams.keyPartId = data.id
        this.defaultParams.hostType = ''
      } else {
        this.defaultParams.hostType = []
        this.defaultParams.hostType.push(data.type)
      }
      this.getAlarmHostList(this.defaultParams)
      // console.log(this.defaultParams)
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    rootId(id) {
      this.currentOrgId = id
    },
    seachCond() {
      switch (this.tableColumn.id) {
        case 1: // 用户信息传输装置
          this.defaultParams.partsType = ['手动报警按钮', '感烟探测器', '感温探测器', '总线隔离模块', '燃气切断阀']
          this.defaultParams.hostType = []
          break
        case 2: // NB烟感
          this.defaultParams.partsType = ''
          // this.defaultParams.type = [12]
          break
        case 3: // 液压--消防水池、高位水箱，液位--末端排水装置、末端试水装置、湿式报警阀组
          this.defaultParams.partsType = ['末端排水装置', '末端试水装置', '湿式报警阀组', '消防水池', '高位水箱']
          this.defaultParams.hostType = []
          break
        case 4: // 电器火灾
          this.defaultParams.partsType = ['剩余电流互感器', '电流互感器', '温度传感器', '故障电弧探测器']
          this.defaultParams.hostType = []
          break
        default:
          break
      }
      this.getAlarmHostList(this.defaultParams)
    },
    clickData(data) {
      // 机构树加载节点信息
      // console.log('clickData', data)
      if (data && data.id) {
        // 返回机构树加载根节点信息
        // this.nodeData = data
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },
    // 获取列表数据
    getAlarmHostList(params) {
      let param = {}
      for (var key in params) {
        if (params[key]) {
          param[key] = params[key]
        }
      }
      // console.log(param)
      // partsType 部件类型 tableData
      if (this.tableColumn.id === 2) {
        param.isChildren = 2
        param.type = [12]
        fireInterface
          .comBustibleQueryHost(param)
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data.alarmHostInfo
              this.total = res.data.data.page.totalNumber || 0
              this.pageSize = res.data.data.page.pageSize
              this.pageCurrent = res.data.data.page.page
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fireInterface
          .queryHostParts(param)
          .then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data.partsInfo
              this.total = res.data.data.page.totalNumber || 1
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 选中数据
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 改变pageSize
    pageSizeChange(val) {
      // console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      // console.log(this.pageCurrent)
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
                item[childItem.prop] = this.tableColumn.id === 2 ? '异常' : '故障'
                break
              case 4:
                item[childItem.prop] = '报警'
                break
              default:
                item[childItem.prop] = ' '
                break
            }
          }
          obj[childItem.prop] = item[childItem.prop] ? item[childItem.prop] : ' '
        })
        data.push(obj)
      })
      // console.log(data)
      return data
    },
    // 导出excel
    exportExcel() {
      let tHeader = ['序号'] // 表头
      let filterVal = ['index'] // 数据
      let filename = this.tableColumn.title + '数据表'
      this.tableColumn.header.map(n => {
        tHeader.push(n.label)
        filterVal.push(n.prop)
      })

      if (this.fireSelection.length) {
        // 有数据走前端导出
        let fireSelection = this.$lodash.cloneDeep(this.fireSelection)
        fireSelection.map((item, index) => {
          item.index = index + 1
          switch (item.status) {
            case 1:
              item.status = '离线'
              break
            case 2:
              item.status = '在线'
              break
            case 3:
              item.status = this.tableColumn.id === 2 ? '异常' : '故障'
              break
            case 4:
              item.status = '报警'
              break
          }
        })
        handleExport(
          tHeader,
          filterVal,
          `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`,
          fireSelection
        )
      } else if (this.tableData.length > 0 && this.fireSelection.length === 0) {
        // 无数据走接口
        let params = {}
        // params.hostType = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        params.isChildren = 2
        params.partsType = this.defaultParams.partsType
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
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      let listData = []
      if (this.fireSelection && this.fireSelection.length > 0) {
        list = this.$lodash.cloneDeep(this.fireSelection)
      } else {
        list = this.$lodash.cloneDeep(this.tableData)
      }
      let prints = {
        properties: [{ field: 'index', displayName: '序号' }]
      }
      this.tableColumn.header.map((n, index) => {
        prints.properties.push({ field: n.prop, displayName: n.label })
      })

      listData = this.formatList(list, this.tableColumn.header)
      printJS({
        // 表格数据的来源
        printable: listData,
        // field 表格内容  displayName：表头名
        properties: prints.properties,
        type: 'json',
        // 表题
        header: '<p class="custom">' + this.tableColumn.title + '数据表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
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
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    /deep/.table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      /deep/.table-top {
        padding: 12px;
      }
    }
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #f2f2f2;
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
        background: #f8f8f8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-footer {
    margin-top: 24px;
  }
}

.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
  /deep/.el-table__body-wrapper {
    height: 704px !important;
  }
}
</style>
