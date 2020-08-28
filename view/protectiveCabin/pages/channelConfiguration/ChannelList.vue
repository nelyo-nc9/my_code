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
    </div>
    <div class="content">
      <div class="content-box">
        <div class="header"
             v-if="!isShowTopo && !isShowConfig">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱通道关联配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box"
             v-if="!isShowTopo && !isShowConfig">
          <el-button size="mini"
                     @click="isShowConfig = true"
                     :disabled="selectItem.length<1">关联配置</el-button>
          <el-button size="mini"
                     @click="relevanceChannelList('refresh')">获取关联</el-button>
          <el-button size="mini"
                     @click="isShowTopo = true"
                     :disabled="selectItem.length<1">查看关联拓补</el-button>
          <el-button size="mini"
                     @click="explod">导出</el-button>
        </div>
        <div class="query"
             v-if="!isShowTopo && !isShowConfig">
          <div>
            <!-- <el-checkbox v-model="relevanceChannelDataObj.rescusive"
                         @change="relevanceChannelList">显示子机构</el-checkbox>
            <span @click="relevanceChannelList"
                  class="refresh">
              <i class="el-icon-refresh-right"></i>
              <span>刷新列表</span>
            </span> -->
          </div>
          <div class="right-header-search">
            <div class="search">
              <el-input v-model="relevanceChannelDataObj.key"
                        suffix-icon="el-icon-search"
                        @change='relevanceChannelList'
                        placeholder="请输入IP或防护舱通道名称"></el-input>
            </div>
          </div>
        </div>
        <div class="right-table"
             ref="tableBox"
             v-if="!isShowTopo && !isShowConfig">
          <el-table :data="channelTableData"
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
            <el-table-column v-for="item in channelTableColumn"
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
        <ChannelInfo v-if="isShowTopo"
                     :isShowTopo.sync="isShowTopo"
                     :hostInfo="selectItem[0]"
                     relatedType="1"></ChannelInfo>

        <RelatedConfig v-if="isShowConfig"
                       :isShowConfig.sync="isShowConfig"
                       :selectedData="selectItem"
                       @clearSelect="clearSelect"
                       relatedType="1"
                       :configType='"防护舱通道关联配置"'></RelatedConfig>
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
import ChannelInfo from './ChannelInfo'
import RelatedConfig from '../../components/RelatedConfig'
import { getTreeApi, relevanceChannelApi, getRelationChannelApi } from '../../../../http/protectiveCabin/channe.api'
import treeBox from '@src/components/tree/treeBox'
import { postDownLoadFile } from '@src/view/protectiveCabin/download.js'
import { download } from '@src/common/download.js'
import VelevanceInfo from '../../components/relevanceInfo'
export default {
  components: {
    ChannelInfo,
    treeBox,
    RelatedConfig,
    VideoPagination,
    VelevanceInfo,
  },
  data() {
    return {
      showVelevanceInfo: false,
      InfoData: {},
      navTitle: '防护舱通道关联配置',
      relevaceFlag: false,
      optionValue: '',
      searchData: '',
      tableHeight: 624,
      orgChecked: false, // 机构
      isShowTopo: false, // 详情
      isShowConfig: false, // 关联配置
      channelTableData: [
        //列表数据
      ],
      channelTableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '140px', sortable: 'true' },
        { prop: 'keyPartName', label: '所属重点部位', width: '160px', sortable: 'true' },
        { prop: 'deviceName', label: '所属防护舱主机', width: '160px', sortable: 'true' },
        { prop: 'name', label: '防护舱通道名称', width: '160', sortable: 'true' },
        { prop: 'serise', label: '防护舱通道号', width: '140px', sortable: 'true' },
        { prop: 'isVideoLink', label: '关联视频通道', width: '140px', sortable: 'true' },
        { prop: 'isAudioLink', label: '关联对讲通道', width: '140px', sortable: 'true' },
        { prop: 'isCabinLink', label: '关联防护舱通道', width: '140px', sortable: 'true' },
        { prop: 'isOutputLink', label: '关联输出通道', width: '140px', sortable: 'true' },
        { prop: 'assetCode', label: '资产编码', width: '120px', sortable: 'true' },
        { prop: 'updatedBy', label: '录入人', width: '110px', sortable: 'true' },
        { prop: 'updatedDept', label: '录入机构', width: '110px', sortable: 'true' },
        { prop: 'updatedAt', label: '录入时间', width: '110px', sortable: 'true' },
      ],
      relevanceChannelDataObj: {
        page: 1,
        limit: 25,
        type: 1,
        rescusive: true,
        key: '',
        status: '',
      },
      hostInfo: {}, //查看传参
      explodArr: [], //导出
      selectItem: [],
      messageEd: {},
      total: 0,
      treeType: 1,
    }
  },
  watch: {},
  computed: {},

  created() {
    // this.relevanceChannelList()
  },
  watch: {
    isShowConfig: {
      // 这监听对象值的改变 和上面的不一样。
      handler(curVal, oldVal) {
        console.log(curVal, oldVal)
        if (!curVal) {
          this.relevanceChannelList()
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
      getRelationChannelApi({ id: row.id, type: { ref: 2 } }).then((res) => {
        if (res.data.code === 0) {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }
      })
    },
    paginationConfChange(data) {
      this.relevanceHostDataObj.limit = data.limit
      this.relevanceHostDataObj.page = data.page
      this.relevanceChannelList()
    },
    changeValue(value) {
      this.relevanceChannelDataObj.status = value
      this.relevanceChannelList()
    },
    handleSelectionChange(selection) {
      this.selectItem = selection
    },
    clearSelect() {
      this.selectItem = []
    },
    //树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 点击获取节点信息
    playBackGetData(data) {
      if (JSON.stringify(data) !== '{}') {
        this.messageEd = data
        this.relevanceChannelList()
      }
    },
    // 防护舱通道关联配置列表
    ...mapActions(['relevanceChannel']),

    relevanceChannelList(type) {
      let obj = {
        rescusive: this.relevanceChannelDataObj.rescusive,
        key: this.relevanceChannelDataObj.key,
        page: this.relevanceChannelDataObj.page,
        limit: this.relevanceChannelDataObj.limit,
        type: this.relevanceChannelDataObj.type,
      }
      if (this.relevanceChannelDataObj.status !== '') {
        obj.status = this.relevanceChannelDataObj.status
      }
      if (this.messageEd.tierType === 'loc') {
        obj.keyPartId = this.messageEd.id
      } else if (this.messageEd.tierType === 'org') {
        obj.orgId = this.messageEd.id
      }
      relevanceChannelApi(obj).then((res) => {
        if (res.data.data) {
          res.data.data.channels.forEach((item, index) => {
            item.index = index + 1
          })
        }
        this.channelTableData = res.data.data.channels
        this.total = res.data.data.count.total
        if (type === 'refresh') {
          this.$messageSuccess('获取成功')
        }
      })
    },

    // 列表勾选
    selectChange(select, row) {
      this.hostInfo = row //查看
      this.explodArr = select //导出赋值
    },

    //导出
    explod() {
      if (this.explodArr && this.explodArr.length > 0) {
        const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
        let tHeader = this.channelTableColumn.map((item) => item.label)
        let filterVal = this.channelTableColumn.map((item) => item.prop)
        filterVal.unshift('index')
        tHeader.unshift('序号')
        let list = this.explodArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(
          tHeader,
          data,
          `防护舱通道关联设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
        )
      } else {
        let body = {
          pattern: 'list', // {string} pattern 模式。 必输， list:列表模式，inquery: 查询模式
          key: this.relevanceChannelDataObj.key, // {string} key 查询关键字，可以为空、任意值。 空位不模糊检索，任意值代表在ip与名称中模糊搜索
          rescusive: this.relevanceChannelDataObj.rescusive, // {boolean}   rescusive
        }
        if (this.relevanceChannelDataObj.status !== '') {
          body.status = this.relevanceChannelDataObj.status
        }
        if (this.messageEd.tierType === 'loc') {
          body.keyPartId = this.messageEd.id
        } else if (this.messageEd.tierType === 'org') {
          body.orgId = this.messageEd.id
        }
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/resource/v1/cabin/channel/linkage/download`
        let name = `防护舱通道关联设备导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
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
