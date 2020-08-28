<!--
 * @Author: your name
 * @Date: 2020-06-05 17:18:35
 * @LastEditTime: 2020-06-17 11:37:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\platformConfig\list.vue
-->
<template>
  <div class="platform-list-box">
    <div class="tree-content">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle></treeBox>
    </div>
    <div class="right-content"
         v-if="isEditShow">
      <!-- 顶部操作栏 -->
      <div class="top-box">
        <!-- 面包屑 -->
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车配置</el-breadcrumb-item>
            <el-breadcrumb-item>关联配置</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <!-- 操作按钮 -->
        <div class="button-box"
             v-if="isListShow">
          <el-button size="mini"
                     @click="relaConfugBtn" :disabled="selectData.length!==1">关联配置</el-button>
          <el-button size="mini"
                     @click="viewRelevanceBtn" :disabled="selectData.length!==1">查看关联拓扑</el-button>
          <el-button size="mini"
                     @click="exportPlatform">导出</el-button>
        </div>
      </div>
      <div class="table-box"
           v-if="isListShow">
        <div class="table-top">
          <el-button type="text"
                     icon="el-icon-refresh"
                     @click="getAlarmHostList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search"
                    style="float:right;width:200px;"
                    size="mini"
                    v-model="changeNum"
                    @input="searchEnterFun"></el-input>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    @selection-change="handleSelectionChange"
                    stripe
                    @cell-click="cellClick"
                    height="670">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             prop="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip
                             align="center"
                             :resizable="resizable"></el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <el-pagination @size-change="handleSizeChange"
                         style="float:right"
                         @current-change="handleCurrentChange"
                         :page-sizes="[10, 25, 50, 100]"
                         :page-size="pageSize"
                         :current-page="page"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>

    </div>
    <rela-config v-if="relaConfig"
                 @changeComponent='changeComponent'
                 configType='停车配置' :selectedData="selectData"></rela-config>
    <view-relevance v-if="viewRelevance" :isShowTopo.sync="viewRelevance" :hostInfo="selectData[0]" relatedType='1'
                    @changeComponent='changeComponent'></view-relevance>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import relaConfig from './relatedConfig'
import viewRelevance from './viewRelevance'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api.js'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'list',
  components: {
    treeBox,
    relaConfig,
    viewRelevance,
  },
  data() {
    return {
      orgId: '',
      treeType: 2,
      pageSize: 25,
      page: 1,
      changeNum: '',
      resizable: false,
      isEditShow: true,
      // tableHeight: 700,
      isListShow: true,
      isPrintShow: false,
      isShowMove: false,
      tableColumn: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'park', sortable: true, label: '所属平台名称', width: '' },
        { prop: 'brand', brand: true, label: '品牌', width: '' },
        { prop: 'parking', parking: true, label: '所属车场', width: '' },
        { prop: 'name', label: '所属主机', width: '' },
        { prop: 'barriersNo', label: '通道号', width: '' },
        { prop: 'barriersName', label: '通道名称', width: '' },
        { prop: 'cameraAssociated', label: '关联摄像机', width: '' },
      ],
      tableData: [],
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1,
      },
      selectData: [],
      dialogVisible: false,
      relaConfig: false,
      viewRelevance: false,
    }
  },
  created() {
    this.getHostLinkage({ page: 1, limit: 25, rescusive: true })
  },
  mounted() {},
  methods: {
    ...mapActions(['getHostLinkageList', 'exportParkPlatform']),
    getTableList() {},
    refresh() {},
    // 关联配置列表
    getHostLinkage(obj) {
      this.getHostLinkageList(obj).then((res) => {
        this.tableData = res.data.data.hosts
      })
    },
    cellClick(row, column) {
      console.log(row, column)
      //  if ((column.label === '关联摄像头' && row.cameraAssociated === '未配置'){

      //  }
    },
    changeComponent(val) {
      console.log(val)
      this.isEditShow = true
      this.relaConfig = false
      this.viewRelevance = false
    },
    relaConfugBtn() {
      this.isEditShow = false
      this.relaConfig = true
    },
    viewRelevanceBtn() {
      this.isEditShow = false
      this.viewRelevance = true
    },
    // 平台搜索
    searchEnterFun() {
      console.log(this.orgId)
      this.getParkPlatformListQuery({ name: this.changeNum })
      this.getParkPlatformListQuery({ ip: this.changeNum })
      //   getParkPlatformApi({name:this.changeNum})
      //     .then(res => {
      //       console.log('查询停车平台', res.data.data.platforms)
      //       // this.formData.id = res.data.data.id
      //       let result = res.data.data.platforms
      //       console.log(result)
      //       this.tableData = result
      //     })
      //     .catch(err => {
      //       this.Error(err)
      //     })
    },
    // 导出
    exportPlatform() {
      this.exportParkPlatform()
        .then((res) => {
          console.log(res, '导出成功')
        })
        .catch((err) => {
          console.log(err)
        })
      // 前端导出
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '平台名称',
        '平台ID',
        'IP地址',
        '端口',
        '录入机构',
        '录入人',
        '录入时间',
      ]
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'name',
        'id',
        'ip',
        'port',
        'updatedDept',
        'updatedBy',
        'updatedAt',
      ]
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    excloseBtn() {
      this.isListShow = true
      this.isPrintShow = false
      this.isShowMove = false
    },
    // 迁移
    isShowMoveBtn() {
      this.isShowMove = true
      this.isListShow = false
    },
    // 打印
    printBtn() {
      window.open('www.baidu.com')
    },
    // 列表每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    // 列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.zoneArr = []
      this.getAlarmHostManageList({ deviceType: '电话报警主机,网络报警主机', pageSize: this.pageSize, pageNum: val })
    },
    // 刷新列表
    getAlarmHostList() {
      this.getParkPlatformListQuery()
    },
    // 表格选中触发的事件
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
    },
    resizeFun() {
      //   this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    // 机构数
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      console.log(data, '****')
      if (data.tierType === 'org') {
        let obj = {
          orgId: data.id,
          //   pageSize: this.pageSize,
          //   pageNum: this.page
        }
        this.getParkPlatform(obj).then((res) => {
          console.log(res)
          let result = res.data.data.platforms
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
            this.tableData = []
          }
        })
      } else if (data.tierType === 'loc') {
        this.getParkPlatform({ keyPartId: data.id }).then((res) => {
          console.log(res)
          let result = res.data.data.platforms
          if (result && result.length > 0) {
            this.tableData = result
          } else {
            this.$notify.warning({
              title: '警告',
              message: '未查到数据',
            })
            this.tableData = []
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.platform-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 280px;
    border: 1px solid #e1e1e1;
    .treeBox {
      padding: 10px 10px;
    }
  }
  .right-content {
    font-size: 12px;
    padding-top: 10px;
    width: calc(~'100% - 280px');
    padding-left: 10px;
    box-shadow: 0 0 10px #ccc inset;
    .top-box {
      .el-breadcrumb {
        margin-bottom: 12px;
      }
      .button-box {
        margin-bottom: 12px;
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
}
</style>
