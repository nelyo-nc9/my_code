<template>
  <div id="accessAlarmHost">
    <div class="leftTrees">
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
          <TabMenu :tabList="tabList" />
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
              <!-- <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
              <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>-->
            </div>
            <!-- <div class="rights"> -->
            <!-- <el-select
                size="small"
                style="float:right;width:100px;margin-right:12px;"
                v-model="status"
                placeholder="请选择活动区域"
              >
                <el-option label="全部" value="全部"></el-option>
                <el-option label="在线" value="在线"></el-option>
                <el-option label="离线" value="离线"></el-option>
            </el-select>-->
            <!-- <el-input
                :clearable="true"
                size="small"
                v-model="searchText"
                suffix-icon="el-icon-search"
                style="float:right;width:200px;"
              ></el-input>
            </div>-->
            <el-input
              @keyup.enter.native.prevent="getSearchKeyWordResult()"
              size="small"
              v-model="searchText"
              style="float:right;width:200px;"
              placeholder="请输入设备名或ID"
            >
              <i @click="getSearchKeyWordResult" slot="suffix" class="el-icon-search" style="line-height: 35px;"></i>
            </el-input>
          </div>
          <div class="tableContent">
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
              :default-sort="{ prop: 'date', order: 'descending' }"
              @row-dblclick="toViewTopology"
              tooltip-effect="dark"
            >
              <el-table-column prop type="selection" width="80"></el-table-column>
              <el-table-column prop width="80" label="序号" type="index" sortable></el-table-column>
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
              <el-table-column show-overflow-tooltip prop="type" width="120" label="门禁主机类型" sortable>
                <template slot-scope="scope">
                  <span v-show="scope.row.type == 1">金库门禁</span>
                  <span v-show="scope.row.type == 2">普通门禁</span>
                  <span v-show="scope.row.type == 3">互锁门门禁</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="brand" width="120" label="品牌" sortable></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="modelNum"
                width="120"
                label="型号"
                sortable
              ></el-table-column>
              <el-table-column show-overflow-tooltip width="120" label="关联摄像头" sortable>
                <template slot-scope="scope">
                  <!-- <span v-if="scope.row.isVideoLink == 2" @click="viewTopology(row)">已关联</span>
                  <span v-else>未关联</span>-->
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
              <el-table-column show-overflow-tooltip prop width="120" label="关联对讲通道" sortable>
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
              <el-table-column show-overflow-tooltip prop width="120" label="关联门禁通道" sortable>
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
              <el-table-column show-overflow-tooltip prop label="关联输出通道" width="200" sortable>
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
                prop="assetCode"
                label="资产编码"
                width="200"
                sortable
              ></el-table-column>
              <el-table-column show-overflow-tooltip label="状态" width="200" sortable prop="status">
                <!-- prop="status" -->
                <!-- <template slot-scope="scope">
                  <span v-show="scope.row.status == 1">离线</span>
                  <span v-show="scope.row.status == 2">在线</span>
                </template>-->
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="updatedBy"
                label="录入人"
                width="200"
                sortable
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="updatedDept"
                label="录入机构"
                width="200"
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
            <div class="block">
              <video-pagination
                ref="listPagination"
                :total="total"
                @paginationConfChange="paginationConfChange"
              ></video-pagination>
            </div>
          </div>
        </div>

        <div class="bbx" style="width:100%; " v-if="!ShowList">
          <component
            @related="RelatedStatus"
            :is="currtCom"
            :childTbaList="tabList"
            @model="childTwoState"
            :tableItem="tableItem"
            :migra="migra"
            :hostInfo="serchDerive[0]"
            :configurationdata="configurationdata"
            relatedType="1"
            :info="Info"
          ></component>
        </div>
      </div>
    </div>
    <!-- viewTopology 弹窗 -->
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

import _ from 'lodash'
import { getHostAssociation, getHostList, getBatchHost } from '@src/http/access/host'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { CreateUplinkage, getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
import { download } from '@src/common/download.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
    TabMenu: () => import('@src/view/accessControl/accessManagement/components/tabMenu'),
    ComTable: () => import('@src/view/accessControl/components/comTable.vue'),
    Related: () => import('@src/view/accessControl/accessManagement/pages/Host/Related'),
    ViewRelated: () => import('@src/view/accessControl/accessManagement/pages/Host/ViewRelated'),
    viewTopology: () => import('@src/view/accessControl/accessManagement/components/viewTopology.vue'),
    VideoPagination,
  },

  data() {
    return {
      viewTopologyFlag: false,
      TopologyId: {},
      total: 0,
      messageEd: {},
      customizeQuery: {
        params: {
          subSystem: '3',
        },
      },
      Info: {},
      configurationdata: {
        video: [],
      },
      treeType: 2,
      serchDerive: [], //导出依赖的数组
      migra: {}, //迁移obj
      tableItem: {},
      pageSize: 25,
      currpage: 1,
      ShowList: true,
      showSubOrg: true,
      searchText: '',
      status: '全部',
      currtCom: '',
      tabList: ['门禁管理', '门禁主机关联配置', '列表'],
      tableData: [],
      isPage: {
        iPage: true,
        page: '',
        num: '',
      },
      TableColumns: [
        { width: '', prop: '', label: '所属子系统' },
        { width: '', prop: '', label: '所属机构' },
        { width: '', prop: '', label: '所属重点部位' },
        { width: '', prop: '', label: '所属门禁平台' },
        { width: '', prop: '', label: '门禁主机名称' },
        { width: '', prop: '', label: '门禁主机ID' },
        { width: '', prop: '', label: '品牌' },
        { width: '', prop: '', label: '型号' },
        { width: '', prop: '', label: '门禁主机类型' },
        { width: '', prop: '', label: '门禁通道数量' },
        { width: '', prop: '', label: '读头数量' },
        { width: '', prop: '', label: '报警输入数量' },
        { width: '', prop: '', label: '资产编码' },
        { width: '', prop: '', label: '在线状态' },
        { width: '', prop: '', label: '录入人' },
        { width: '', prop: '', label: '录入机构' },
        { width: '', prop: '', label: '录入时间' },
      ],
      isViewRelated: false,
      tableHeight: 200,
    }
  },
  methods: {
    getSearchKeyWordResult(){
        this.getHostAss()

    },
    toViewTopology(row, column, event) {
      this.tableItem = [
        // { title: '所属子系统', context: row.subSystemName },
        { title: '所属机构', context: row.orgName },
        { title: '所属重点部位', context: row.keyPartName },
        { title: '所属门禁平台', context: row.platformName },
        // { title: '所属门禁主机', context: row.deviceName },
        { title: '门禁主机名称', context: row.name },
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
    paginationConfChange(data) {
      this.pageSize = data.limit
      this.currpage = data.page
      this.getHostAss()
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
        type: 'host',
      }
      this.viewTopologyFlag = true
    },
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.getHostAss()
      }
    },
    // 获取关联
    getLingks() {
      if (this.serchDerive.length > 0) {
        let params = {
          ref: 1,
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
    // 关联配置之后返回列表需要取消勾选的 item
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    onceClick(val) {
      let { tierType } = val
      if (tierType == 'org') {
        //机构
        let { name, id } = val
        // this.getHostAss(id, false) // 如果是结构 部位id就不传
      } else if (tierType == 'loc') {
        // 重点部位
        let { name, id } = val
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    //门禁主机列表数据获取
    getHostAss(jigouID, buweiID) {

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
        page: this.currpage,
        limit: this.pageSize,
        status: Liststatus,
        rescusive: this.showSubOrg,
        key: this.searchText,
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
      getHostAssociation(params).then((res) => {
        this.total = res.data.data.count.total
        this.tableData = res.data.data.hosts
        this.tableData.forEach((item) => {
          if (item.status == 1) {
            item.status = '离线'
          } else if (item.status == 2) {
            item.status = '在线'
          }
        })
      })
    },
    exportFile() {
      if (this.serchDerive && this.serchDerive.length > 0) {
        const tHeader = [
          '所属机构',
          '所属重点部位',
          '所属门禁平台',
          '门禁主机名称',
          '门禁主机ID',
          '门禁主机类型',
          '品牌',
          '型号',
          '门禁通道数量',
          '读头数量',
          '报警输入数量',
          '资产编码',
          '在线状态',
          '录入人',
          '录入机构',
          '录入时间',
        ]
        const filterVal = [
          'orgName',
          'keyPartName',
          'platformName',
          'name',
          'uniqueId',
          'type',
          'brand',
          'modelNum',
          'guardNumber',
          'readerNumber',
          'inputNumber',
          'assetCode',
          'status',
          'updatedBy',
          'updatedDept',
          'updatedAt',
        ]
        let list = []
        list = this.$lodash.cloneDeep(this.serchDerive)
        list.forEach((item) => {
          if (item.status == 2) {
            item.status = '在线'
            item.status
          } else if (item.status == 1) {
            item.status = '离线'
            item.status
          }
          if (item.type == 1) {
            item.type = '金库门禁'
          }
          if (item.type == 2) {
            item.type = '普通门禁'
          }
          if (item.type == 3) {
            item.type == '互锁门门禁'
          }
        })
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '门禁主机关联配置查询')
      } else {
        if (this.HostTimer) {
          clearTimeout(this.HostTimer)
        }
        this.HostTimer = setTimeout(() => {
          let body = {
            pattern: 'list',
            rescusive: this.showSubOrg,
            key: this.searchText,
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
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/guard/host/linkage/download`
          let name = `门禁主机导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    viewRelatedEvent(val) {
      console.log('Log 查看勾选的数据', this.migra)
      this.ShowList = false
      this.currtCom = val
      this.tabList = ['门禁管理', '报警输入关联配置', '列表', '查看']
    },

    //关联配置 callback
    RelatedEvent(val) {
      this.ShowList = false
      this.currtCom = val
      this.tabList = ['门禁管理', '门禁主机关联配置', '列表', '关联配置']
    },
    //数量发生改变
    handleSizeChange(val) {
      this.pageSize = val
      // this.tableData = []
      this.getHostAss()
    },
    //当前页数发生改改变
    handleCurrentChange(val) {
      // this.tableData = []
      this.currpage = val
      this.getHostAss()
    },
    select(s, row) {
      this.migra = row //迁移obj
      //点击table item 传递给查看关联拓补展示
      // this.tableItem = row
      ;(this.isViewRelated = true),
        (this.tableItem = [
          // { title: '所属子系统', context: row.subSystemName },
          { title: '所属机构', context: row.orgName },
          { title: '所属重点部位', context: row.keyPartName },
          { title: '所属门禁平台', context: row.platformName },
          // { title: '所属门禁主机', context: row.deviceName },
          { title: '门禁主机名称', context: row.name },
        ])

      this.serchDerive = s
      this.Info = {
        updatedAt: row.updatedAt,
        updatedDept: row.orgName,
        updatedBy: row.updatedBy,
      }
      console.log('Log------------------', this.serchDerive)
    },
    tableRowClassName({ row, rowIndex }) {},
    childTwoState(childType) {
      let { ListStatus } = childType
      this.ShowList = ListStatus
      this.tabList = childType.menu
      this.serchDerive = []
      this.toggleSelection()
    },
    refresh() {
      this.tableData = []
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.getHostAss()
        this.$notify({
          title: '成功',
          message: '刷新成功',
          type: 'success',
        })
      }, 300)
    },

    RelatedStatus(typeStatus) {
      // this.configurationdata.video = typeStatus.configurationdata.video
      console.log('Log 查看子组件传过来的 item', typeStatus)
      this.ShowList = true
      this.tabList = ['门禁管理', '门禁主机关联配置', '列表']
      this.serchDerive = [] // 重置数组 防止不勾选进入关联页面
      this.toggleSelection()
    },
    SizeTableHeight() {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 75
        let that = this
        window.onresize = function () {
          that.tableHeight = window.innerHeight - that.$refs.multipleTable.$el.offsetTop - 75
        }
      })
    },
  },
  created() {},
  mounted() {
    this.SizeTableHeight()
  },
  watch: {
    showSubOrg(flag) {
      this.getHostAss()
    },
    status(vA) {
      this.getHostAss()
    },
    searchText(newVal, oldVal) {
      if(!newVal.trim()){
  if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.getHostAss(newVal)
      }, 500)
      }

    },
    serchDerive(newVal) {
      // if (newVal.length > 1) {
      //   this.$messageError('主机关联关系只支持单个主机关联')
      // }
    },
  },
}
</script>
<style lang="less" scoped>
#accessAlarmHost {
  width: 100%;
  height: 100%;
  display: flex;
  .leftTrees {
    width: 290px !important;
    height: 100%;
    /deep/.treeBox .tree {
    }
  }
  .alarmList {
    height: 100%;
    width: calc(~'100% - 290px');
    .right {
      border: 5px solid #eaeef3;
      padding-top: 17px;
      padding-left: 24px;
      padding-right: 24px;
      width: 100%;
      height: 100%;
      .alarmMenu {
      }
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

  /deep/ .el-select--small {
    // margin-right: 10px;
  }
  .text {
    color: #409eff;
    cursor: pointer;
  }
  .bbx {
    height: 100%;
  }
}
</style>
