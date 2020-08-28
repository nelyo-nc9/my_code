<template>
  <div id="lisddd">
    <div class="fsddd">
      <div class="treeleft">
        <treeBox
          :lazyTreeApi="getTreeApi"
          searchType="filter"
          :treeType="treeType"
          @onceClick="onceClick"
          treeLazyToggle
          iconToggle
          :customizeQuery="customizeQuery"
          @clickData="playBackGetData"
        ></treeBox>
      </div>
      <div class="right">
        <div class="menus" v-show="isView">
          <TabMenu :tabList="tabList" />
        </div>
        <div v-if="isView">
          <div class="listBtn">
            <el-button size="mini" @click="chageType('Create')" :disabled="listRow.length != 1">
              <i class="el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button size="mini" @click="del" :disabled="listRow.length < 1">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
            <el-button size="mini" @click="getAisle" :disabled="listRow.length < 1">
              <i class="icon el-icon-circle-check"></i>
              获取
            </el-button>
            <el-button size="mini" @click="migrateFn('Migrate')" :disabled="listRow.length < 1">
              <i class="icon el-icon-rank"></i>
              迁移
            </el-button>
            <!-- <el-button size="mini" @click="view('ListView')" :disabled="listRow.length < 1">查看</el-button> -->
            <el-button size="mini" @click="tableSort('ListSort')" :disabled="listRow.length != 1">
              <i class="icon el-icon-sort"></i>
              排序
            </el-button>
            <!-- <el-button size="mini">导入</el-button> -->
            <el-button size="mini" @click="exportFile">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>
              导出
            </el-button>
            <el-button size="mini" @click="print">
              <i class="el-icon-printer"></i>
              打印
            </el-button>
          </div>
          <div class="tableEvent">
            <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
            <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
            <el-input
              @keyup.enter.native.prevent="getSearchKeyWordResult()"
              v-model="searchKeyWord"
              style="float:right;width:200px;"
              size="small"
              placeholder="请输入设备名或ID"
            >
              <i @click="getSearchKeyWordResult" slot="suffix" class="el-icon-search" style="line-height: 35px;"></i>
            </el-input>
            <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="在线" value="在线"></el-option>
              <el-option label="离线" value="离线"></el-option>
            </el-select>
          </div>
          <div class="tableCon" id="tableCon">
            <el-table
              :stripe="true"
              :data="tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              ref="multipleTable"
              @select="select"
              border
              fit
              :height="tableHeight"
              @row-dblclick="handledbClick"
              :default-sort="{ prop: 'date', order: 'descending' }"
              tooltip-effect="dark"
            >
              <el-table-column prop type="selection" width="80"></el-table-column>
              <el-table-column prop width="120" label="序号" type="index" sortable></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="orgName"
                width="120"
                label="所属机构"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="keyPartName"
                width="120"
                label="所属重点部位"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="platformName"
                width="120"
                label="所属门禁平台"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                width="120"
                label="门禁主机名称"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="uniqueId"
                width="120"
                label="门禁主机ID"
                sortable
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="brand" label="品牌" sortable></el-table-column>
              <el-table-column show-overflow-tooltip prop="modelNum" label="型号" sortable></el-table-column>
              <el-table-column show-overflow-tooltip prop="type" label="门禁主机类型" width="120" sortable>
                <!-- prop="type"  1|金库门禁,2|普通门禁,3|互锁门门禁 -->
                <!-- <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">金库门禁</span>
                  <span v-if="scope.row.type == 2">普通门禁</span>
                  <span v-if="scope.row.type == 3">互锁门门禁</span>
                </template>-->
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="guardNumber"
                width="120"
                label="门禁通道数量"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="readerNumber"
                width="120"
                label="读头数量"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="inputNumber"
                width="120"
                label="报警输入数量"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="assetCode"
                width="120"
                label="资产编码"
                sortable
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="在线状态" sortable width="120" prop="status">
                <!-- prop="status" -->
                <!-- <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">离线</span>
                  <span v-if="scope.row.status == 2">在线</span>
                </template>-->
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="updatedBy"
                label="录入人"
                width="120"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="updatedDept"
                label="录入机构"
                width="120"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="updatedAt"
                label="录入时间"
                width="120"
                sortable
              ></el-table-column>
            </el-table>
            <div class="block">
              <video-pagination
                ref="listPagination"
                :total="total"
                @paginationConfChange="paginationConfChange"
              ></video-pagination>
              <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>-->
            </div>
          </div>
        </div>
        <div v-if="!isView">
          <component
            id="bb"
            :tableDatas="tableData"
            :is="currtCom"
            :deviceModel="deviceModel"
            @modelChange="childStatus"
            :listRow="updatedRow"
            :qianyi="listRow"
            :createHost="createHost"
            :updataItem="qianyiItem"
            :userInfo="userInfo"
            :viewPsData="viewPsData"
            :abs="id"
            :migrantData="migrantData"
            :HostOrPlorm="'Host'"
            :orgId="orgId"
            :aisleTableData="tableData"
          ></component>
          <!--   :updataItem="" -->
        </div>
      </div>
    </div>
    <!-- <migrant :flag="flag" @cancle="flag=false" :migrantData="migrantData" /> -->
  </div>
</template>
<script>
import {
  getHostList,
  getDesignated,
  delHostList,
  AccessMigrateHost,
  removeHost,
  getBatchHost
} from '@src/http/access/host'
import { getHostAllControl } from '@src/http/access/control'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { getTreeApi, HostSort } from '@src/http/access/accessMan'
import { download } from '@src/common/download.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    TabMenu: () => import('../../components/tabMenu'),
    ListView: () => import('@src/view/accessControl/accessManagement/pages/devices/ListView'),
    ListSort: () => import('@src/view/accessControl/accessManagement/pages/devices/TableSort'),
    Create: () => import('@src/view/accessControl/accessManagement/pages/devices/Create'),
    Migrate: () => import('@src/view/accessControl/accessManagement/pages/videoHost/Migrate.vue'),
    VideoPagination
  },
  props: ['createHost'],
  data() {
    return {
      id: {},
      total: 0,
      migrantData: [], // 迁移弹窗的源数据
      customizeQuery: {
        params: {
          subSystem: '3',
          hostType: '2'
        }
      },
      viewPsData: {},
      migrantData: [], //迁移弹窗的源数据
      flag: false,
      userInfo: {},
      treeType: 2,
      listHost: {},
      serchDerive: [],
      qianyiItem: {},
      listRow: [], //查看条件
      cuurtList: [], //要删除的 arr
      id: '', // 平台主键id
      status: '全部',
      searchKeyWord: '',
      currtCom: '',
      deviceModel: 'xxx',
      isView: true,
      NeedUpdate: [],
      currentPage: 1,
      pagesize: 25, //    每页的数据
      showSubOrg: false,
      tabList: ['门禁管理', '门禁主机配置', '列表'],
      tableDatas: [],
      tableData: [],
      updatedRow: {}, //修改的某一项
      messageEd: {},
      orgId: '',
      tableHeight: 200
    }
  },
  methods: {
    paginationConfChange(data) {
      this.pagesize = data.limit
      this.currentPage = data.page
      this.getList()
    },
    /** 需要提供新接口
     * @description: 批量获取主机下通道 符合条件才会成功
     * @param {type}:ids String[]
     * @return: code status
     */
    getAisle() {
      if (!this.listRow.length) {
        this.$messageError('请勾选列表')
        return
      } else {
        let ids = this.listRow
          .map(item => item.id)
          .join()
          .split(',')
        getBatchHost({ ids }).then(res => {
          if (res.data.code != 0) {
            this.$messageError('获取失败')
            return
          }
          if (res.data.data.length) {
            this.$messageSuccess(
              `获取主机成功${this.listRow.length - res.data.data.length}个,失败${res.data.data.length}个`
            )
            this.listRow = []
          }
        })
        this.$refs.multipleTable.clearSelection()
      }
    },
    /**
     * @description: 动态获取table高度
     * @param {type}:
     * @type:
     * @return:
     */
    SizeTableHeight() {
      this.$nextTick(function() {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 75
        let that = this
        window.onresize = function() {
          that.tableHeight = window.innerHeight - that.$refs.multipleTable.$el.offsetTop - 75
        }
      })
    },
    /* 主机双击 事件 */
    handledbClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
      this.currtCom = 'ListView'
      this.isView = false
      this.viewPsData = row
      this.$refs.multipleTable.clearSelection()
    },

    /**
     * @description: 打印 后期可能提供新接口
     * @param {type}: Object
     * @type:
     * @return:无
     */
    print() {
      let list = []
      if (this.serchDerive && this.serchDerive.length > 0) {
        list = this.serchDerive
      } else {
        let result = this.$lodash.cloneDeep(this.tableData)
        list = result
      }
      list = list.map(item => {
        return {
          subSystemName: item.subSystemName || '',
          orgName: item.orgName || '',
          keyPartName: item.keyPartName || '',
          platformName: item.platformName || '',
          name: item.name || '',
          uniqueId: item.uniqueId || '',
          brand: item.brand || '',
          modelNum: item.modelNum || '',
          type: item.type || '',
          guardNumber: item.guardNumber || '',
          readerNumber: item.readerNumber || '',
          inputNumber: item.inputNumber || '',
          assetCode: item.assetCode || '',
          updatedBy: item.updatedBy || '',
          updatedDept: item.updatedDept || '',
          updatedAt: item.updatedAt || '',
          status: item.status == 1 ? '在线' : '离线' || ''
        }
      })
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'platformName', displayName: '所属门禁平台' },
          { field: 'name', displayName: '门禁主机名称' },
          { field: 'uniqueId', displayName: '门禁主机ID' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'type', displayName: '门禁主机类型' },
          { field: 'guardNumber', displayName: '门禁通道数量' },
          { field: 'readerNumber', displayName: '读头数量' },
          { field: 'inputNumber', displayName: '报警输入数量' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'status', displayName: '在线状态' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">对讲管理配置列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        //表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ',
        //内容样式
        gridStyle: 'border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;'
      })
    },
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getList()
      }
    },
    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name, id } = val
        this.createHost.jigou = name
        this.createHost.jigouId = id
      } else if (tierType == 'loc') {
        // 重点部位
        let { name, id } = val
        this.createHost.buwei = name
        this.createHost.buweiId = id
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    /**
     * @description: 获取门禁主机列表
     * @param {type}: Object
     * @type: get
     * @return: 无
     */
    getList(jigouID, buweiID) {
      let Liststatus
      switch (this.status) {
        case '全部':
          Liststatus = ' '
          break
        case '在线':
          Liststatus = '2'
          break
        case '离线':
          Liststatus = '1'
          break
        default:
          break
      }
      let params = {
        page: this.currentPage,
        limit: this.pagesize,
        rescusive: this.showSubOrg,
        status: Liststatus,
        key: this.searchKeyWord // 关键字搜索
        // type:'2'
      }
      if (!params.status.trim()) {
        delete params.status
      }
      if (!params.key.trim()) {
        delete params.key
      }
      if (this.messageEd.tierType === 'loc') {
        params.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        params.orgId = this.messageEd.id
        this.orgId = this.messageEd.id
      }

      this.migrantData = []
      getHostList(params)
        .then(res => {
          this.tableData = res.data.data.hosts
          this.total = res.data.data.count.total

          let result = res.data.data.hosts
          this.tableData.forEach(item => {
            if (item.status == 1) {
              item.status = '离线'
            }
            if (item.status == 2) {
              item.status = '在线'
            }
            if (item.type == 1) {
              item.type = '金库门禁'
            } else if (item.type == 2) {
              item.type = '普通门禁'
            } else if (item.type == 3) {
              item.type = '互锁门门禁'
            }
          })
        })
        .catch(res => console.log('Log error', res))
    },
    /**
     * @description: 前端导出及接口导出
     * @param {type}: Array || Object
     * @type: get || post (api)
     * @return: 无
     */
    exportFile() {
      if (this.serchDerive && this.serchDerive.length > 0) {
        const tHeader = [
          '所属机构',
          '所属重点部位',
          '所属门禁平台',
          '门禁主机名称',
          '门禁主机ID',
          '品牌',
          '型号',
          '门禁主机类型',
          '门禁通道数量',
          '读头数量',
          '报警输入数量',
          '资产编码',
          '在线状态',
          '录入人',
          '录入机构',
          '录入时间'
        ]
        const filterVal = [
          'orgName',
          'keyPartName',
          'platformName',
          'name',
          'uniqueId',
          'brand',
          'modelNum',
          'type',
          'guardNumber',
          'readerNumber',
          'inputNumber',
          'assetCode',
          'status',
          'updatedBy',
          'updatedDept',
          'updatedAt'
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)
        list.forEach(item => {
          if (item.status == 1) {
            item.status = '离线'
          } else if (item.status == 2) {
            item.status = '在线'
          }
          if (item.type == 1) {
            item.type = '金库门禁'
          } else if (item.type == 2) {
            item.type = '普通门禁'
          } else if (item.type == 3) {
            item.type == '互锁门门禁'
          }
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁主机配置列表')
      } else {
        if (this.hostTimer) {
          clearTimeout(this.hostTimer)
        }
        this.hostTimer = setTimeout(() => {
          let body = {
            pattern: 'list',
            rescusive: this.showSubOrg,
            key: this.searchKeyWord
          }

          let Liststatus
          switch (this.status) {
            case '全部':
              Liststatus = ''
              break
            case '在线':
              Liststatus = '2'
              break
            case '离线':
              Liststatus = '1'
              break
            default:
              break
          }

          body['status'] = Liststatus

          if (this.messageEd.tierType === 'loc') {
            body.keyPartId = this.messageEd.id
          } else if (this.messageEd.tierType === 'org') {
            body.orgId = this.messageEd.id
          }
          // zp去掉url中间的/host
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/host/download`
          let name = `门禁主机关联配置列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(
            url,
            name,
            () => {},
            () => {
              this.$message({ type: 'info', message: '导出文件下载失败！' })
            },
            () => {},
            'post',
            body
          )
        }, 500)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    /**
     * @description: 批量门禁主机
     * @param {type}: String Array
     * @type:  del
     * @return: 无
     */
    del() {
      this.$confirm('此操作将删除主机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          /*  */
          let listIds = this.cuurtList
            .map(item => item.id)
            .join()
            .split(',') //[111,233,4412] ==   111,233,4412
          if (this.cuurtList.length < 1) {
            this.$message({
              type: 'error',
              message: '请选择要删除的某一项!'
            })
          } else {
            /* { ids: listIds } */
            delHostList({ ids: listIds }).then(res => {
              console.log('Log 主机是否删除成功??', res)
              if (res.data.code == 0) {
                this.$notify({
                  title: '成功',
                  message: '主机删除成功',
                  type: 'success'
                })
                this.getList()
              } else {
                this.$messageError(res.data.message)
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    select(s, row) {
      this.cuurtList = s //[{},...]
      this.listRow = s
      this.updatedRow = s[0] //勾选  to 修改页面展示的object
      this.qianyiItem = row
      this.serchDerive = s // 导出依赖数据
      this.migrantData = s
    },
    //迁移 fn
    migrateFn(com) {
      this.flag = true
      this.currtCom = com
      this.isView = false
    },
    //tableItem sort
    tableSort(com) {
      this.currtCom = com
      this.isView = false
    },
    childStatus(a) {
      if (a.currtCom == '列表' || a.currtCom == '新建' || a.CurrtTitle == '列表') {
        this.isView = true
      } else if (a.currtCom == '查看') {
        this.userInfo = a.user
        this.isView = false
        this.currtCom = a.status
        this.id = a.id
      }
      this.migrantData = []
      this.listRow = []
    },

    //新建修改方法 动态组件切换新建component
    chageType(comType, data) {
      console.log('Log 查看要修改的主机id', this.updatedRow)
      let { id } = this.updatedRow
      let body = {}
      this.isView = false
      this.currtCom = comType
    },
    refresh() {
      this.tableData = []
      this.getList()
      this.$notify({
        title: '成功',
        message: '刷新成功',
        type: 'success'
      })
    },
    //单击row 需要传递index 做sort
    handleclick(tab, index) {
      this.NeedUpdate.push(tab)
      // console.log('更新的数据是', this.NeedUpdate, Array.isArray(this.NeedUpdate))
    },

    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 当前 table  row的row信息和下表
    tableRowClassName({ row, rowIndex }) {},
    // handleSizeChange(val) {
    //   this.tableData = []
    //   this.pagesize = val
    //   this.getList()
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val
    //   this.tableData = []
    //   this.getList()
    // },
    // view(v) {
    //   this.isView = false
    //   this.currtCom = v
    // },
    getSearchKeyWordResult() {
      this.getList()
    }
  },
  created() {},
  mounted() {
    this.SizeTableHeight()
  },
  watch: {
    createHost(val) {},
    showSubOrg(flag) {
      this.getList()
    },
    status(vA) {
      this.getList()
    },
    searchKeyWord(newVal, oldVal) {
      if (!newVal.trim()) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.getList()
        }, 500)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#lisddd {
  height: 100%;
}
.listBtn {
  margin: 10px 0px;
  /deep/ .el-button {
    width: 80px;
  }
}
.tableEvent {
  margin: 10px 0px;
}
.fsddd {
  display: flex;
  width: 100%;
  height: 100%;
  .treeleft {
    height: 100%;
    border-right: 1px solid #e6e6e6;
    width: 290px;
    overflow: hidden;
    .treeBox {
      width: 290px;
      .tree {
        width: 290px;
      }
    }
  }
  .right {
    width: calc(~'100% - 290px');
    border: 5px solid #eaeef3;
    height: calc(~'100% - 10px');
    padding-top: 17px;
    padding-left: 24px;
    padding-right: 24px;
    .tableCon {
      height: 100%;
      .block {
        text-align: right;
        margin: 10px 0;
        margin-left: -190px;
      }
    }
    #bb {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
