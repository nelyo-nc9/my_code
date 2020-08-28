<template>
  <div id="fs_">
    <div class="fs">
      <div class="treeLeft">
        <treeBox
          :lazyTreeApi="getTreeApi"
          searchType="filter"
          :treeType="treeType"
          @onceClick="onceClick"
          treeLazyToggle
          iconToggle
          @clickData="playBackGetData"
          :customizeQuery="customizeQuery"
        ></treeBox>
      </div>
      <div class="rightList">
        <div class="menus" v-if="isView">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
            <el-breadcrumb-item>门禁平台管理</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>{{optType == 'Create' ? '新建' : '修改'}}</el-breadcrumb-item> -->
          </el-breadcrumb>
        </div>
        <div v-if="isView">
          <div class="listBtn" style="padding:10px 0px">
            <el-button size="mini" @click="chageType('Create')">
              <i class="el-icon-plus"></i>
              新建
            </el-button>
            <el-button size="mini" :disabled="serchDerive.length != 1" @click="chageType('Update', qianyiItem)">
              <i class="el-icon-edit-outline"></i>
              编辑
            </el-button>
            <el-button size="mini" :disabled="serchDerive.length < 1" @click="delPlatformList($event, listRow)">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
            <el-button :disabled="serchDerive.length < 1" size="mini" @click="migrate('Migrate')">
              <i class="icon el-icon-rank"></i>
              迁移
            </el-button>
            <!-- <el-button size="mini" :disabled="serchDerive.length < 1" @click="view('ListView')">查看</el-button> -->
            <el-button size="mini" :disabled="serchDerive.length != 1" @click="tableSort('ListSort', delList)">
              <i class="icon el-icon-sort"></i>
              排序
            </el-button>
            <el-button @click="getHosts" size="mini" :disabled="serchDerive.length < 1">
              <i class="icon el-icon-circle-check"></i>
              获取
            </el-button>
            <!-- <el-button size="mini">
              导入
              <i class="icon iconfont-ccb ccbdaoru el-icon-"></i>
            </el-button>-->
            <el-button size="mini" @click="exportFile">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>
              导出
            </el-button>
            <el-button size="mini" @click="print">
              <i class="el-icon-printer"></i>
              打印
            </el-button>
          </div>
          <div class="tableEvent" style="margin-bottom:10px">
            <div class="opt-box">
              <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
              <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
              <el-input
                @keyup.enter.native.prevent="getSearchKeyWordResult()"
                v-model="searchKeyWord"
                size="small"
                style="float:right;width:200px;"
                placeholder="请输入设备名或IP"
              >
                <i @click="getSearchKeyWordResult" slot="suffix" class="el-icon-search" style="line-height: 35px;"></i>
              </el-input>
              <el-select style="float:right;width:100px;margin-right:12px;" v-model="status" size="small">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="在线" value="在线"></el-option>
                <el-option label="离线 " value="离线"></el-option>
              </el-select>
            </div>
            <!-- .slice((currpage - 1) * pageSize,currentPage4 * pageSize) -->
          </div>
          <div class="tableCon" id="tableCon" ref="tableBox">
            <el-table
              :stripe="true"
              :data="tableDatas"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              @row-click="handleclick"
              @row-dblclick="handledbClick"
              @selection-change="handleSelectionChange"
              @select="select"
              :default-sort="{ prop: 'date', order: 'descending' }"
              ref="multipleTable"
              border
              :height="tableHeight"
              tooltip-effect="dark"
            >
              > >
              <el-table-column prop type="selection" width="80"></el-table-column>
              <el-table-column prop width="80" label="序号" sortable type="index"></el-table-column>
              <!-- <el-table-column prop="subSystemName" width="120" sortable label="所属子系统"></el-table-column> -->
              <el-table-column prop="orgName" sortable width="140" label="所属机构"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="keyPartName"
                width="120"
                sortable
                label="所属重点部位"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                sortable
                width="120"
                label="门禁平台名称"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="brand" sortable width="140" label="品牌">
                <!-- <template slot-scope="scope">
                  <span v-show="scope.row.brand == 'NeaTech'">丽泽</span>
                  <span v-show="scope.row.status == 'DDS'">DDS</span>
                  <span v-show="scope.row.status == 'HIK'">海康</span>
                </template>-->
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="modelNum" label="型号" sortable></el-table-column>
              <el-table-column show-overflow-tooltip prop="ip" label="IP地址" sortable></el-table-column>
              <el-table-column show-overflow-tooltip prop="port" label="端口" sortable></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="username"
                label="用户名"
                width="120"
                sortable
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="在线状态" width="120" sortable prop="status">
                <!-- <template slot-scope="scope">
                  <span v-show="scope.row.status == 1">离线</span>
                  <span v-show="scope.row.status == 2">在线</span>
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
                width="200"
                sortable
              ></el-table-column>
            </el-table>
            <div class="block" style="text-align:right;margin:20px 0">
              <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>-->

              <video-pagination
                ref="listPagination"
                :total="total"
                @paginationConfChange="paginationConfChange"
              ></video-pagination>
            </div>
          </div>
        </div>
        <div v-if="!isView" style="height:100%">
          <component
            id="aaaa"
            :tableDatas="tableDatas"
            :is="currtCom"
            :deviceModel="deviceModel"
            @modelChange="childStatus"
            :planPop="createPlatform"
            :listRow="listRow"
            :migra="tableData"
            :optType="optType"
            :updataItem="qianyiItem"
            :serveArr="serveArr"
            :viewPsData="viewPsData"
            :migrantData="migrantData"
            :HostOrPlorm="'NoHost'"
            :orgId="orgId"
            :currtNode="currtNode"
            :aisleTableData="tableDatas"
            :listflag="isView"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTreeApi } from '@src/http/access/accessMan'
import {
  manCreate,
  getAccessList,
  del,
  platformSort,
  downPtList,
  AccessmModify,
  getPlatformList,
  getDetal,
  getHosts,
  getBatchPlatform,
} from '@src/http/access/accessMan'
import { getZhiDhosts } from '@src/http/access/control'
import { getServeId } from '@src/http/access/getId.js'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { mapState, mapMutations, mapActions } from 'vuex'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
import { RESOURCETYPE } from '../../../../../assets/2DMap/meta/common'
export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    TabMenu: () => import('../../components/tabMenu'),
    ListView: () => import('@src/view/accessControl/accessManagement/pages/videoHost/ListView'),
    ListSort: () => import('@src/view/accessControl/accessManagement/pages/videoHost/TableSort'),
    Create: () => import('@src/view/accessControl/accessManagement/pages/videoHost/Create'),
    Migrate: () => import('@src/view/accessControl/accessManagement/pages/videoHost/Migrate.vue'),
    VideoPagination,
  },
  props: ['updataItem', 'planPop'],
  data() {
    return {
      isCreate:false,
      currtNode:'',
      tableHeight: 200,
      getHostDataObj: {
        page: 1,
        limit: 100,
        rescusive: true,
        key: '',
      }, //获取列表参数
      customizeQuery: {
        params: {
          subSystem: '3',
        },
      },
      total: 0,
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      migrantData: [], // 迁移弹窗的源数据
      flag: false,
      isCreateOrUpdata: '',
      viewPsData: {}, //双击list进入查看
      kkk: 'qeq',
      serveArr: [], //接入服务器arr
      hostInfo: {},
      createPlatform: {
        orgName: '',
        orgId: '',
        keyPartName: '',
        keyPartId: '',
      },
      treeType: 2,
      optType: '',
      serchDerive: [], //导出依赖的数组
      qianyiItem: {}, //迁移页面的obj
      listRow: [], //查看页面传递的数据
      status: '全部',
      statusType: '',
      searchKeyWord: '',
      form: {
        region: '',
      },
      info: {
        orgId: '12',
        keyPartId: '13',
        keyPartIdType: '0',
        subSystem: 3,
      },
      currtCom: '',
      deviceModel: 'xxx',
      isView: true,
      NeedUpdate: [],
      currpage: 1,
      pageSize: 10,
      total: 1,
      showSubOrg: true,
      tabList: ['基础信息', '门禁平台管理', '列表'],
      tableDatas: [],
      delList: [],
      Table: [],
      tableData: [],
      userInfo: {},
      updata: '',
      up: false,
      currentOrgId: '',
      currentserial: '',
      currentKeyPartId: '',
      messageEd: {},
      orgId: '', //机构id
    }
  },

  computed: {
    ...mapState('access', {
      treeInfo: 'treeInfo',
    }),
    ...mapState('access', {
      treeInfo: 'treeInfo',
      brand: 'brand',
      modelNum: 'modelNum',
    }),
  },
  methods: {
    paginationConfChange(data) {
      this.pagesize = data.limit
      this.handleCurrentChange = data.page
      this.dbGetList()
    },
    /**
     * @description:批量获取平台下主机 设备在在线时才会成功
     * @param {type}: ids string []
     * @return: code status
     */
    getHosts() {
      if (!this.serchDerive.length) {
        this.$messageError('请勾选列表')
        return
      } else {
        let ids = this.$lodash.cloneDeep(this.serchDerive)
        ids
          .map((item) => item.id)
          .join()
          .split(',')

        getBatchPlatform({ ids })
          .then((res) => {
            if (res.data.code != 0) {
              this.$messageError('获取失败')
              return
            }
            if (res.data.data.length) {
              this.$messageSuccess(
                `获取成功${this.serchDerive.length - res.data.data.length}个,失败${res.data.data.length}个`
              )
              this.$refs.multipleTable.clearSelection()
            }
          })
          .catch((err) => {
              this.$refs.multipleTable.clearSelection()
          })
      }
    },
    SizeTableHeight() {},
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.dbGetList()
      }
    },
    // paginationConfChange(data) {
    //   this.getHostDataObj.limit = data.limit
    //   this.getHostDataObj.page = data.page
    //   this.dbGetList()
    // },
    clickData(data) {
      if (data.isRoot) {
        this.currentOrgId = data.id
        this.currentserial = data.serial
        this.currentKeyPartId = ''
        this.dbGetList()
      }
    },
    ...mapActions('access', {
      getBrand: 'getBrand',
    }),
    // ...mapMutations(['GETINFO']),
    ...mapMutations('access', {
      GETINFO: 'getinfo',
    }),
    // 点击机构数的某一项 可以获取到该项的类型
    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name, id } = val
        this.createPlatform.orgName = name
        this.createPlatform.orgId = id
        this.dbGetList(id, false) // 如果是结构 部位id就不传
      } else if (tierType == 'loc') {
        let locID = val.id
        // 重点部位
        let { name, id, keyPartType } = val
        // keyPartName:'',
        // keyPartId:''
        this.createPlatform.locName = name
        this.createPlatform.keyPartId = id
        this.createPlatform.keyPartType = keyPartType
        // this.dbGetList(false, id)
      }
      this.$emit('modelChange', this.createPlatform)
      //VUEX 传递tree点击的obj
      this.GETINFO(JSON.parse(JSON.stringify(this.createPlatform)))
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },

    // 获取门禁平台列表
    dbGetList() {
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
      let params = {
        page: this.currentPage,
        limit: this.pagesize,
        rescusive: this.showSubOrg, //是否递归子节点
        status: Liststatus, //状态
        key: this.searchKeyWord, // 关键字搜索
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
      getAccessList(params).then((res) => {
        this.tableDatas = res.data.data.platforms
        this.total = res.data.data.count.total
        let result = res.data.data.platforms
        this.tableDatas.forEach((item) => {
          if (item.status == 1) {
            item.status = '离线'
          } else {
            item.status = '在线'
          }
        })
      })
    },
    print() {
      let list = []
      if (this.serchDerive && this.serchDerive.length > 0) {
        list = this.serchDerive
      } else {
        let result = this.$lodash.cloneDeep(this.tableDatas)
        list = result
      }
      list = list.map((item) => {
        return {
          orgName: item.orgName || '',
          keyPartName: item.keyPartName || '',
          name: item.name || '',
          brand: item.brand || '',
          modelNum: item.modelNum || '',
          ip: item.ip || '',
          port: item.port || '',
          password: item.password || '',
          status: item.status == 1 ? '离线' : '在线',
          username: item.username || '',
          orgName: item.orgName || '',
          updatedAt: item.updatedAt || '',
        }
      })
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '门禁主机名称' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'port', displayName: '端口' },
          { field: 'password', displayName: '密码' },
          { field: 'status', displayName: '在线状态' },
          { field: 'username', displayName: '录入人' },
          { field: 'orgName', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' },
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
        gridStyle: 'border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;',
      })
    },
    iSimplement(callBackApi, item) {
      if (item.length < 1) {
        this.$message({
          message: '请选择要删除的列表项',
          type: 'warning',
        })
      } else {
        this.$confirm('此操作将删除指定项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let idsArr = this.delList.map((item) => item.id) //return 过滤后的id组成一个新的arr 传值调用del接口
            callBackApi({ ids: idsArr })
              .then((res) => {
                // console.log('Log ids已经传 是否删除?', res)
                if (true) {
                  this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                  })
                }
              })
              .catch((res) => console.log('Log del接口 error', res))
          })
          .catch(() => {
            // this.$notify({
            //   title: '成功',
            //   message: '取消删除',
            //   type: 'success',
            // })
          })
      }
    },
    //删除列表
    delPlatformList(e, isDel) {
      if (isDel.length < 1) {
        this.$message({
          message: '请选择要删除的列表项',
          type: 'warning',
        })
      } else {
        this.$confirm('此操作将删除指定项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let idsArr = isDel
              .map((item) => item.id)
              .join()
              .split(',')
            let ids = idsArr
            del({ ids: idsArr }).then((res) => {
              this.$messageSuccess('删除成功')
              this.dbGetList()
            })
          })
          .catch(() => {
            this.$messageSuccess('取消删除成功')
          })
      }
    },
    //迁移 fn
    migrate(com) {
      this.flag = true
      this.currtCom = com
      this.isView = false
    },
    tableSort(com, iSsort) {
      this.currtCom = com
      this.isView = false
    },
    childStatus(a) {
      this.isView = a.ParerntFlag
      this.migrantData = []
      this.serchDerive = []
    },
    //新建修改方法 动态组件切换新建component
    chageType(comType, data) {
      if (comType == 'Create') {
        this.isCreateOrUpdata = 'create'
        this.isView = false
        //新建按钮
        this.currtCom = 'Create'
        this.comType = 'Create'
        // this.$emit('modelChange', this.qianyiItem, 'Create')
        // debugger
        this.$parent.childrenComponent = 'Create'
        // comType = comType
      } else if (comType === 'Update') {
        this.isCreateOrUpdata = 'update'
        this.$emit('modelChange', data, 'Update')
        comType = 'Update'
        this.optType = 'Update'
        this.currtCom = 'plormUpdata'
      }
      this.$parent.$parent.childrenComponent = comType
    },
    refresh() {
      this.tableDatas = []
      this.dbGetList()
      this.$notify({
        title: '成功',
        message: '刷新成功',
        type: 'success',
      })
    },
    //单击row 需要传递index 做sort
    handleclick(tab, index) {
      this.NeedUpdate.push(tab)
    },
    //当前 table 多选框选中的 数据

    select(s, row) {
            // debugger
      console.log('xxxx',row);
      this.hostInfo = row
      this.qianyiItem = s[0]
      this.listRow = s
      this.serchDerive = s
      this.migrantData = s
    },
    handleSelectionChange(selection) {
      this.delList = selection
      this.migrantData = selection
      this.serchDerive = selection
      // this.qianyiItem = selection
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    //双击事件
    handledbClick(row, column, event) {
      // alert('xxxxxxxxxx')
      this.$refs.multipleTable.toggleRowSelection(row)
      this.qianyiItem = row
      this.currtCom = 'ListView'
      this.isView = false
      this.viewPsData = row
      this.dialogVisible = true
      this.$refs.multipleTable.clearSelection()
    },
    //
    handleClick(tab, event) {},
    // 当前 table  row的row信息和下表
    tableRowClassName({ row, rowIndex }) {},
    // table 分页器
    handleSizeChange(val) {
      this.tableDatas = []
      this.pagesize = val
      this.dbGetList()
    },
    // table 当前页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.tableDatas = []
      this.dbGetList()
    },
    /**
     * @description:  门禁平台导出 (禁止用户频繁点击 button处理)
     * @param {type}:
     * @type:  post
     * @return: 无
     */
    exportFile() {
      if (this.serchDerive && this.serchDerive.length > 0) {
        const tHeader = [
          '所属子系统',
          '所属机构',
          '所属重点部位',
          '门禁平台名称',
          '品牌',
          '型号',
          'IP地址',
          '端口',
          '用户名',
          // '密码',
          '在线状态',
          '录入人',
          '录入机构',
          '录入时间',
        ]
        const filterVal = [
          'subSystemName',
          'orgName',
          'keyPartName',
          'name',
          'brand',
          'modelNum',
          'ip',
          'port',
          'username',
          // 'password',
          'status',
          'createdBy',
          'createdDept',
          'createdAt',
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)
        list.forEach((item) => {
          // console.log('Log   s', item)
          if (item.status == 1) {
            item.status = '离线'
          } else if (item.status == 2) {
            item.status = '在线'
          } else {
            return
          }
          return item.status
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁平台列表')
      } else {
        if (this.downLoadTimer) {
          clearTimeout(this.downLoadTimer)
        }
        this.downLoadTimer = setTimeout(() => {
          let body = {
            key: this.searchKeyWord,
            rescusive: this.showSubOrg,
            pattern: 'list',
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
          if (this.status) {
            body['status'] = Liststatus
          }
          if (this.messageEd.tierType === 'loc') {
            body.keyPartId = this.messageEd.id
          } else if (this.messageEd.tierType === 'org') {
            body.orgId = this.messageEd.id
          }
          // zp去掉url中间的/host
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/platform/download`
          let name = `门禁平台导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          download(
            url,
            name,
            () => {
              // this.$messageSuccess('导出成功')
            },
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
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    getTableHigeht() {
      if(this.$refs.multipleTable.$el){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 70
            let that = this
            window.onresize = function () {
              that.tableHeight = window.innerHeight - that.$refs.multipleTable.$el.offsetTop - 60
            }
        })
      }
    },
    /**
     * @description: 关键字搜索列表
     * @param {type}: Object
     * @type: get
     * @return:list
     */
    getSearchKeyWordResult() {
      this.dbGetList()
    },
  },

  created() {},
  mounted() {
    if(!this.currtCom.trim()){
      this.getTableHigeht()
    }
  },
  beforeDestroy() {},
  watch: {
    treeInfo(newval, old) {},
    showSubOrg() {
      this.dbGetList()
    },
    searchKeyWord(newVal, oldVal) {
      if (!newVal.trim()) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.dbGetList()
        }, 500)
      }
    },
    status(vA) {
      this.dbGetList()
    },
    createHost(n, o) {},
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeFun)
  },
}
</script>

<style lang="less" scoped>
.fs {
  display: flex;
  height: calc(~'100% - 10px');
  width: 100%;
  .treeLeft {
    height: 100%;
    border-right: 1px solid #e6e6e6;
    width: 290px;
    .treeBox {
      width: 290px;
      .tree {
        width: 290px;
      }
    }
  }
  .rightList {
    height: 100%;
    width: calc(~'100% - 290px');
    border: 5px solid #eaeef3;
    padding-top: 17px;
    padding-left: 24px;
    padding-right: 24px;
    overflow: hidden;
    #aaaa {
      height: 100%;
      width: 100%;
      padding: 0 10px;
    }
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
    .listBtn {
      /deep/ .el-button {
        // margin-right:10px;
        width: 80px;
      }
    }
  }
  .tableCon {
    // margin: 0 10px;
  }
}
</style>
