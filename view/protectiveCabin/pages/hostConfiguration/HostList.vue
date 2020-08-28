<template>
  <div class="list-box">
    <div class="tree-content">
      <treeBox ref="treeDiv"
               :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               treeLazyToggle
               iconToggle
               @clickData="playBackGetData">
      </treeBox>
      </treeBox>
    </div>
    <div class="content">
      <div class="content-box">
        <div class="header"
             v-if="!isShowTopo && !isShowConfig">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱主机关联配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box"
             v-if="!isShowTopo && !isShowConfig">
          <el-button size="mini"
                     @click="getLinkHost"
                     :disabled="selectItem.length<1">关联配置</el-button>
          <el-button size="mini"
                     @click="relevanceList('refresh')">获取关联</el-button>
          <el-button size="mini"
                     @click="isShowTopo = true"
                     :disabled="selectItem.length<1">查看关联拓补</el-button>
          <el-button size="mini"
                     @click="explod">导出</el-button>
        </div>
        <div class="query"
             v-if="!isShowTopo && !isShowConfig">
          <div>
            <!-- <el-checkbox v-model="relevanceHostDataObj.rescusive"
                         @change="relevanceList">显示子机构</el-checkbox>
            <span @click="relevanceList"
                  class="refresh">
              <i class="el-icon-refresh-right"></i>
              <span>刷新列表</span>
            </span> -->
          </div>
          <div class="right-header-search">
            <span class="title-status">在线状态</span>
            <el-select v-model="relevanceHostDataObj.ststus"
                       @change='changeValue'>
              <el-option v-for="(item, index) in optionData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <div class="search">
              <el-input v-model="relevanceHostDataObj.key"
                        suffix-icon="el-icon-search"
                        @change="relevanceList"></el-input>
            </div>
          </div>
        </div>
        <div class="right-table"
             ref="tableBox"
             v-if="!isShowTopo && !isShowConfig">
          <el-table :data="aisleTableData"
                    style="width: 100%;"
                    size="mini"
                    tooltip-effect="dark"
                    stripe
                    height="627px"
                    @select="selectChange"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in aisleTableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             show-overflow-tooltip
                             sortable>
              <template slot-scope="scope">
                <span v-if="item.prop==='isVideoLink'|| item.prop==='isAudioLink' || item.prop==='isCabinLink' ||item.prop==='isOutputLink'">
                  <el-link type="primary"
                           v-if="scope.row[item.prop] === 2"
                           :underline="false"
                           @click="clickRelevance(item.prop,scope.row)">已关联</el-link>
                  <!-- <el-link type="info"
                           v-if="scope.row[item.prop] === 1"
                           disabled
                           :underline="false">未关联</el-link> -->
                </span>
                <span v-else>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <video-pagination ref="listPagination"
                            :total="total"
                            @paginationConfChange="paginationConfChange"></video-pagination>
        </div>
        <HostListInfo v-if="isShowTopo"
                      :isShowTopo.sync="isShowTopo"
                      :hostInfo="selectItem[0]"
                      relatedType="1"></HostListInfo>

        <RelatedConfig v-if="isShowConfig"
                       :isShowConfig.sync="isShowConfig"
                       :selectedData="selectItem"
                       @clearSelect="clearSelect"
                       :configType='"防护舱主机关联配置"'
                       relatedType="1"></RelatedConfig>
        <velevance-info v-if="showVelevanceInfo"
                        :InfoData="InfoData"
                        :navTitle="navTitle"
                        :flag="relevaceFlag"
                        @cancle="cancle"></velevance-info>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
import HostListInfo from './HostListInfo'
import RelatedConfig from '../../components/RelatedConfig'
import {
  getTreeApi,
  linkHostApi,
  relevanceHostApi,
  getRelationChannelApi,
} from '../../../../http/protectiveCabin/channe.api'
import treeBox from '@src/components/tree/treeBox'
import { postDownLoadFile } from '@src/view/protectiveCabin/download.js'
import VelevanceInfo from '../../components/relevanceInfo'
export default {
  components: {
    HostListInfo,
    treeBox,
    RelatedConfig,
    VideoPagination,
    VelevanceInfo,
  },
  data() {
    return {
      showVelevanceInfo: false,
      InfoData: {},
      navTitle: '防护舱主机关联配置',
      relevaceFlag: false,
      searchData: '',
      selectItem: [],
      tableHeight: 624,
      orgChecked: false, // 机构
      isShowTopo: false, // 详情
      isShowConfig: false, // 关联配置
      aisleTableData: [], //列表数据
      aisleTableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '140px', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '140px', sortable: 'true' },
        { prop: 'name', label: '防护舱主机名称', width: '160px', sortable: 'true' },
        { prop: 'deviceSerise', label: '设备序列号', width: '140px', sortable: 'true' },
        { prop: 'ip', label: '防护舱主机IP', width: '140', sortable: 'true' },
        { prop: 'isVideoLink', label: '关联视频通道', width: '130px', sortable: 'true' },
        { prop: 'isAudioLink', label: '关联对讲通道', width: '130px', sortable: 'true' },
        { prop: 'isCabinLink', label: '关联防护舱通道', width: '130px', sortable: 'true' },
        { prop: 'isOutputLink', label: '关联输出通道', width: '140px', sortable: 'true' },
        { prop: 'assetCode', label: '资产编码', width: '130px', sortable: 'true' },
        { prop: 'status', label: '在线状态', width: '130px', sortable: 'true' },
        { prop: 'updatedBy', label: '录入人', width: '110px', sortable: 'true' },
        { prop: 'updatedDept', label: '录入机构', width: '120px', sortable: 'true' },
        { prop: 'updatedAt', label: '录入时间', width: '120px', sortable: 'true' },
      ],
      relevanceHostDataObj: {
        page: 1,
        limit: 25,
        rescusive: true,
        key: '',
        ststus: '',
      },
      total: 0,
      dataList: {},
      hostInfo: {}, //查看传参,关联配置勾选传参
      explodArr: [], //导出
      messageEd: {},
      treeType: 2,
      optionData: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '1',
          label: '在线',
        },
        {
          value: '2',
          label: '离线',
        },
      ],
    }
  },
  watch: {},
  computed: {},
  created() {
    this.relevanceList()
  },
  watch: {
    isShowConfig: {
      // 这监听对象值的改变 和上面的不一样。
      handler(curVal, oldVal) {
        if (!curVal) {
          this.relevanceList()
        }
      },
      deep: true,
    },
  },
  methods: {
    cancle() {
      this.showVelevanceInfo = false
      this.relevaceFlag = false
    },
    clickRelevance(type, row) {
      getRelationChannelApi({ id: row.id, type: { ref: 1 } }).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }
      })
    },
    changeValue(value) {
      this.relevanceHostDataObj.status = value
      this.relevanceList()
    },
    paginationConfChange(data) {
      this.relevanceHostDataObj.limit = data.limit
      this.relevanceHostDataObj.page = data.page
      this.relevanceList()
    },
    //树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    //树  点击事件
    // 点击获取节点信息
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.relevanceList()
      }
    },
    handleSelectionChange(selection) {
      this.selectItem = selection
    },
    //目标获取
    getLinkHost() {
      linkHostApi({ id: this.hostInfo.id, type: { ref: 1 } }).then((res) => {
        this.dataList = res.data.data
      })
      this.isShowConfig = true
    },

    // 列表勾选
    selectChange(select, row) {
      this.hostInfo = row //查看
      this.explodArr = select //导出赋值
    },

    relevanceList(type) {
      // 防护舱主机-关联
      let obj = {
        rescusive: this.relevanceHostDataObj.rescusive,
        key: this.relevanceHostDataObj.key,
        page: this.relevanceHostDataObj.page,
        limit: this.relevanceHostDataObj.limit,
        type: this.relevanceHostDataObj.type,
      }
      if (this.relevanceHostDataObj.status !== '') {
        obj.status = this.relevanceHostDataObj.status
      }
      if (this.messageEd.tierType === 'loc') {
        obj.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        obj.orgId = this.messageEd.id
      }
      relevanceHostApi(obj).then((res) => {
        res.data.data.hosts.forEach((item, index) => {
          item.index = index + 1
          if (item.status === 1) {
            item.status = '离线'
          } else {
            item.status = '在线'
          }
        })
        this.aisleTableData = res.data.data.hosts
        this.total = res.data.data.count.total
        if (type === 'refresh') {
          this.$messageSuccess('获取成功')
        }
      })
    },

    //导出
    explod() {
      if (this.explodArr && this.explodArr.length > 0) {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        let tHeader = this.aisleTableColumn.map((item) => item.label)
        let filterVal = this.aisleTableColumn.map((item) => item.prop)
        filterVal.unshift('index')
        tHeader.unshift('序号')
        let list = this.explodArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(
          tHeader,
          data,
          `防护舱主机关联设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else {
        let body = {
          pattern: 'list', // {string} pattern 模式。 必输， list:列表模式，inquery: 查询模式
          key: this.relevanceHostDataObj.key, // {string} key 查询关键字，可以为空、任意值。 空位不模糊检索，任意值代表在ip与名称中模糊搜索
          rescusive: this.relevanceHostDataObj.rescusive, // {boolean}   rescusive
        }
        if (this.relevanceHostDataObj.status !== '') {
          body.status = this.relevanceHostDataObj.status
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/cabin/host/linkage/download`
        let name = `防护舱主机关联设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    clearSelect() {
      this.selectItem = []
    },
  },
}
</script>

<style scoped lang='less'>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 290px;
    height: auto;
    background: #fff;
    padding: 17px 9px 0px 9px;
    box-sizing: border-box;
  }
  .content {
    width: calc(~'100% - 290px');
    height: 100%;
    background: #eaeef3;
    padding: 6px 7px 0px 8px;
    .content-box {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 0px 25px 0px 24px;
      box-sizing: border-box;
      .header {
        padding: 17px 0 21px;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
      .query {
        margin: 23px 0px 17px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right-header-search {
          .title-status {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-right: 12px;
          }
          /deep/ .el-select {
            margin-right: 15px;
            .el-input {
              .el-input__inner {
                width: 87px;
                height: 35px;
                background: rgba(51, 51, 51, 0);
                border: 1px solid rgba(225, 225, 225, 1);
                border-radius: 2px;
              }
              .el-input__suffix {
                .el-input__suffix-inner {
                  .el-input__icon {
                    line-height: 25px;
                  }
                }
              }
            }
          }
          .search {
            display: inline-block;
            /deep/ .el-input--suffix {
              display: inline-block;
              width: 100%;
              .el-input__inner {
                width: 230px;
                height: 35px;
                border: 1px solid rgba(225, 225, 225, 1);
                border-radius: 2px;
              }
            }
          }
        }
        /deep/ .el-checkbox {
          margin-right: 25px;
          .el-checkbox__label {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
        }
        .refresh {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          cursor: pointer;
          i {
            font-size: 15px;
            margin-right: 6px;
          }
        }
      }
      /deep/ .el-link {
        .el-link--inner {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
