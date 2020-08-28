<template>
  <div id="accessAlarmsb">
    <div class="leftTreess">
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
    <div class="alarmList">
      <div class="right">
        <div class="alarmMenu" v-if="ShowList">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警输入关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <TabMenu :tabList="tabList" /> -->
        </div>
        <div class="alarmBtns" style="margin:10px 0" v-if="ShowList">
          <el-button size="mini" @click="RelatedEvent('Related')" :disabled="serchDerive.length != 1"
            >关联配置</el-button
          >
          <el-button size="mini" @click="getLingks">获取关联</el-button>
          <el-button size="mini" @click="viewRelatedEvent('ViewRelated')" :disabled="serchDerive.length < 1"
            >查看关联拓补</el-button
          >
          <el-button size="mini" @click="exportFile">导出</el-button>
        </div>
        <div class="alarmTable" v-if="ShowList">
          <div class="tableEvent">
            <div class="left">
              <!-- <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox> -->
              <!-- <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button> -->
            </div>

            <!-- <div class="rights"> -->
            <!-- <el-select
                style="float:right;width:100px;margin-right:12px;"
                size="small"
                v-model="status"
                placeholder="请选择活动区域"
              >
                <el-option label="全部" value="全部"></el-option>
                <el-option label="在线" value="在线"></el-option>
                <el-option label="离线" value="离线"></el-option>
            </el-select>-->
            <el-input
              size="small"
              v-model="searchText"
              style="float:right;width:200px;"
              @keyup.enter.native.prevent="getSearchKeyWordResult()"
              placeholder="请输入设备名或ID"
            >
              <i @click="getSearchKeyWordResult" slot="suffix" class="el-icon-search" style="line-height: 35px;"></i>
            </el-input>
            <!-- </div> -->
          </div>
          <div class="tableContent" ref="box">
            <el-table
              :stripe="true"
              :data="tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              @select="select"
              fit
              border
              :height="tableHeight"
              ref="multipleTable"
              @row-dblclick="toViewTopology"
              tooltip-effect="dark"
            >
              <el-table-column prop type="selection" width="80"></el-table-column>
              <el-table-column sortable prop width="80" label="序号" type="index"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="orgName"
                label="所属机构"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="keyPartName"
                label="所属重点部位"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="platformName"
                label="所属门禁平台"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="deviceName"
                label="所属门禁主机"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="name"
                label="报警输入名称"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="uniqueId"
                label="报警输入ID"
              ></el-table-column>
              <el-table-column show-overflow-tooltip width="120" sortable prop="brand" label="品牌"></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="120"
                sortable
                prop="modelNum"
                label="型号"
              ></el-table-column>
              <el-table-column show-overflow-tooltip width="120" sortable prop="isVideoLink" label="关联摄像头">
                <template slot-scope="scope">
                  <el-link
                    @click="viewTopology(scope.row)"
                    v-if="scope.row.isVideoLink == 2"
                    class="text"
                    :underline="false"
                  >
                    已关联
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                  <!-- <el-link v-if="scope.row.isVideoLink == 1" :underline="false" disabled>未关联</el-link> -->
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip width="120" sortable prop="isAudioLink" label="关联对讲通道">
                <template slot-scope="scope">
                  <el-link
                    @click="viewTopology(scope.row)"
                    v-if="scope.row.isAudioLink == 2"
                    class="text"
                    :underline="false"
                  >
                    已关联
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                  <!-- <el-link v-if="scope.row.isAudioLink == 1" :underline="false" disabled>未关联</el-link> -->
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip width="120" sortable prop="isGuardLink" label="关联门禁通道">
                <template slot-scope="scope">
                  <el-link
                    @click="viewTopology(scope.row)"
                    v-if="scope.row.isGuardLink == 2"
                    class="text"
                    :underline="false"
                  >
                    已关联
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                  <!-- <el-link v-if="scope.row.isGuardLink == 1" :underline="false" disabled>未关联</el-link> -->
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip sortable prop="isOutputLink" label="关联输出通道" width="200">
                <template slot-scope="scope">
                  <el-link
                    @click="viewTopology(scope.row)"
                    v-if="scope.row.isOutputLink == 2"
                    class="text"
                    :underline="false"
                  >
                    已关联
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                  <!-- <el-link v-if="scope.row.isOutputLink == 1" :underline="false" disabled>未关联</el-link> -->
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                prop="assetCode"
                label="资产编码"
                width="200"
              ></el-table-column>
              <el-table-column show-overflow-tooltip sortable label="状态" width="200" prop="status">
                <!-- <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">关闭</span>
                  <span v-if="scope.row.status == 2">开启</span>
                  <span v-if="scope.row.status == 3">未知</span>
                </template>-->
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                prop="updatedBy"
                label="录入人"
                width="200"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                prop="updatedDept"
                label="录入机构"
                width="200"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                sortable
                prop="updatedAt"
                label="录入时间"
                width="200"
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

        <div style="width:100%;height:100%" v-if="!ShowList">
          <component
            ref="hh"
            @related="RelatedStatus"
            :is="currtCom"
            :childTbaList="tabList"
            @model="childTwoState"
            :tableItem="tableItem"
            :migra="migra"
            :peiZhi="serchDerive[0]"
            :allGlpz="serchDerive"
            :configurationdata="configurationdata"
            :hostInfo="serchDerive[0]"
            relatedType="1"
            :Info="Info"
          ></component>
        </div>
      </div>
    </div>

    <viewTopology
      v-if="viewTopologyFlag"
      :TopologyID="TopologyId"
      :TopologyStatus="viewTopologyFlag"
      @changeStatus="viewTopologyFlag = false"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { getTreeApi } from '@src/http/access/accessMan'
import { getAisleAssociation,getDesignated } from '@src/http/access/host'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
import { download } from '@src/common/download.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    TabMenu: () => import('@src/view/accessControl/accessManagement/components/tabMenu'),
    ComTable: () => import('@src/view/accessControl/components/comTable.vue'),
    Related: () => import('@src/view/accessControl/accessManagement/pages/alarm/Related'),
    ViewRelated: () => import('@src/view/accessControl/accessManagement/pages/alarm/ViewRelated'),
    viewTopology: () => import('@src/view/accessControl/accessManagement/components/viewTopology.vue'),
    VideoPagination,
  },

  data() {
    return {
      viewTopologyFlag: false,
      TopologyId: {},
      currentPage: 1, //初始页
      pagesize: 25, //
      total: 0,
      customizeQuery: {
        params: {
          subSystem: '3',
        },
      },
      configurationdata: {
        video: [],
      },
      treeType: 1,
      serchDerive: [],
      tableItem: {},
      ShowList: true,
      showSubOrg: false,
      searchText: '',
      status: '全部',
      currtCom: '',
      tabList: ['门禁管理', '报警输入关联配置', '列表'],
      tableData: [],
      isPage: {
        iPage: true,
        page: '',
        num: '',
      },
      messageEd: {},
      tableHeight: 200,
    }
  },
  methods: {
    getSearchKeyWordResult(){
        this.getAisleList()
    },
    /**
     * @description: 双击查看拓补及关联
     * @param {type}:
     * @type:
     * @return:
     */
    toViewTopology(row, column, event) {
      this.tableItem = [
        { title: '所属机构', context: row.orgName },
        { title: '所属重点部位', context: row.keyPartName },
        { title: '所属门禁平台', context: row.platformName },
        { title: '所属门禁主机', context: row.deviceName },
        { title: '门禁通道名称', context: row.name },
      ]
      this.Info = {
        updatedAt: row.updatedAt,
        updatedDept: row.orgName,
        updatedBy: row.updatedBy,
      }
      this.currtCom = 'ViewRelated'
      this.ShowList = false
      this.serchDerive.push(row)
    },
    /**
     * @description: 分页器
     * @param {type}: 无
     * @type:
     * @return: Object
     */
    paginationConfChange(data) {
      this.pagesize = data.limit
      this.currentPage = data.page
      this.getAisleList()
    },
    /**
     * @description: table click view Topology
     * @param {type}: Object {id,ref}
     * @return: Topology
     */
    viewTopology(row) {
      this.TopologyId = {
        id: row.id,
        name: row.name,
        type: 'Aisle',
      }
      this.viewTopologyFlag = true
    },
    SizeTableHeight() {
      // this.$nextTick(function () {
      //   that.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 80
      //   let that = this
      //   window.onresize = function () {
      //     that.tableHeight = window.innerHeight = that.$refs.multipleTable.$el.offsetHeight - 80
      //   }
      // })
    },
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getAisleList()
      }
    },
    // 获取关联
    getLingks() {
      if (this.serchDerive.length > 0) {
        let params = {
          ref: 2,
        }
        getHostOrControlLinkages(`/resource/v1/guard/linkage/${this.migra.id}`, params).then((res) => {
          console.log('Log ----------', res.data.code)
          if (res.data.code != 0) {
            this.$notify({
              title: '失败',
              message: '获取关联失败',
              type: 'error',
            })
          } else {
            this.$notify({
              title: '成功',
              message: '获取关联成功',
              type: 'success',
            })
            this.serchDerive = []
          }
          this.toggleSelection()
        })
      }
    },
    /**
     * @description: 清除列表勾选
     * @param {type}: row
     * @type: no
     * @return:no
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    /**
     * @description:  区分机构和重点部位 暂时无用
     * @param {type}: Object
     * @type:
     * @return: data
     */
    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name, id } = val
      } else if (tierType == 'loc') {
        // 重点部位
        let { name, id } = val
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    /**
     * @description: 请求报警列表
     * @param {type}: Object
     * @type: get
     * @return: data
     */
    getAisleList(jigouID, buweiID) {
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
        rescusive: this.showSubOrg,
        status: Liststatus,
        key: this.searchText, // 关键字搜索
        type: 3,
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
      }
       else{
         let obj = {
           id:this.messageEd.id,
           type:3
         }
        getDesignated(obj).then(res => {
          if(res.data.code == 0){
            this.tableData = res.data.data.inputs
            this.total = this.tableData.length
          }
        })
          return
      }
      // 请求通道列表接口
      getAisleAssociation(params).then((res) => {
        this.tableData = res.data.data.channels
        this.total = res.data.data.count.total

        this.tableData.forEach((item) => {
          if (item.status == 1) {
            item.status = '关闭'
          } else if (item.status == 2) {
            item.status = '开启'
          } else if (item.status == 3) {
            item.status = '未知'
          }
        })
      })
    },
    /**
     * @description: 前端及后端导出
     * @param {type}: Object
     * @type: Post
     * @return: exs
     */
    exportFile() {
      if (this.serchDerive && this.serchDerive.length > 0) {
        const tHeader = [
          '所属机构',
          '所属重点部位',
          '所属门禁平台',
          '所属门禁主机',
          '报警输入名称',
          '报警输入ID',
          '品牌',
          '型号',
          '关联摄像头',
          '关联对讲通道',
          '关联门禁通道',
          '关联输出通道',
          '资产编码',
          '状态',
          '录入人',
          '录入机构',
          '录入时间',
        ]
        const filterVal = [
          'orgName',
          'keyPartName',
          'platformName',
          'deviceName',
          'name',
          'uniqueId',
          'brand',
          'modelNum',
          'isVideoLink',
          'isAudioLink',
          'isGuardLink',
          'isOutputLink',
          'assetCode',
          'status',
          'updatedBy',
          'updatedDept',
          'updatedAt',
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)

        list.forEach((item) => {
          if (item.status == 1) {
            item.status = '关闭'
          } else if (item.status == 2) {
            item.status = '开启'
          } else if (item.status == 3) {
            item.status = '未知'
          }
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁报警输入列表')
      } else {
        if (this.AlarmTimer) {
          clearTimeout(this.AlarmTimer)
        }
        this.AlarmTimer = setTimeout(() => {
          let body = {
            pattern: 'list',
            rescusive: this.showSubOrg,
            key: this.searchKeyWord,
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
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/input/linkage/download`
          let name = `门禁通道导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
    /**
     * @description: 前端导出方法
     * @param {type}: Array
     * @type:
     * @return: exs
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getAisleList()
    },

    handleSizeChange(val) {
      this.pagesize = val
      this.getAisleList()
    },
    select(s, row) {
      this.migra = row
      this.tableItem = [
        { title: '所属机构', context: row.orgName },
        { title: '所属重点部位', context: row.keyPartName },
        { title: '所属门禁平台', context: row.platformName },
        { title: '所属门禁主机', context: row.deviceName },
        { title: '门禁通道名称', context: row.name },
      ]
      this.Info = {
        updatedAt: row.updatedAt,
        updatedDept: row.updatedDept,
        updatedBy: row.updatedBy || row.username,
      }
      this.serchDerive = s
    },
    tableRowClassName({ row, rowIndex }) {},

    childTwoState(childType) {
      let { ListStatus } = childType
      this.ShowList = ListStatus
      this.tabList = childType.menu
      this.serchDerive = []
      this.toggleSelection()
    },
    /**
     * @description: 列表刷新
     * @param {type}: 无
     * @type: get
     * @return:
     */
    refresh() {
      this.tableData = []
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.refreshtimer = setTimeout(() => {
        this.getAisleList()
        this.$notify({
          title: '成功',
          message: '刷新成功',
          type: 'success',
        })
        clearTimeout(this.refreshtimer)
      }, 300)
    },
    viewRelatedEvent(val) {
      this.ShowList = false
      this.currtCom = val
      this.tabList = ['门禁管理', '门禁通道关联配置', '列表', '查看']
    },

    //关联配置 callback
    RelatedEvent(val) {
      this.ShowList = false
      this.currtCom = val
      this.tabList = ['门禁管理', '门禁通道关联配置', '列表', '关联配置']
    },
    RelatedStatus(typeStatus) {
      // this.configurationdata.video = typeStatus.configurationdata.video
      this.ShowList = true
      this.tabList = typeStatus.menu
      this.serchDerive = []
      this.toggleSelection()
    },
    getTableHeight(){
      this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 60
      let that = this
      window.onresize = function () {
        that.tableHeight = window.innerHeight - that.$refs.multipleTable.$el.offsetTop - 60
      }
    })
  }
  },
  created() {},
  mounted() {
    this.getTableHeight()
  },
  watch: {
    searchText(newVal, oldVal) {
      if(!newVal.trim()){
        if (this.timer) {
              clearTimeout(this.timer)
            }
        this.timer = setTimeout(() => {
          this.getAisleList(newVal)
        }, 500)
      }

    },
    showSubOrg(flag) {
      this.getAisleList()
    },
    status(vA) {
      this.getAisleList()
    },
    serchDerive(newVal) {
      // if (newVal.length > 1) {
      //   this.$messageError('通道关联关系只支持单个通道关联')
      // }
    },
  },
}
</script>
<style lang="less" scoped>
#accessAlarmsb {
  width: 100%;
  height: 100%;
  display: flex;
  .leftTreess {
    width: 290px;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    /deep/.treeBox .tree {
    }
  }
  .alarmList {
    height: 100%;
    width: calc(~'100% - 290px');
    display: flex;
    .right {
      border: 5px solid #eaeef3;
      padding-top: 17px;
      padding-left: 24px;
      padding-right: 24px;
      width: 100%;
      height: 100%;
      .alarmTable {
        width: 100%;
        .tableEvent {
          width: 100%;
          overflow: hidden;
          margin: 10px 0;
          div {
            float: left;
          }
          .rights {
            height: 30px;
            float: right;
            display: flex;
          }
        }
        .tableContent {
          .block {
            margin: 10px 0;
            text-align: right;
          }
        }
      }
    }
  }
  .text {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
