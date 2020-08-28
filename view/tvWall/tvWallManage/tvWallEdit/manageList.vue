<template>
  <div class="content">
    <div class="left-tree">
      <treeBox ref="tree"
               :lazyTreeApi="getTreeApi"
               :treeType="treeType"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               treeLazyToggle
               @rootId="setRootId"
               @onceClick="onceClick"
               @clickData="clickData"
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
            <el-breadcrumb-item>电视墙配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="small"
                     icon="el-icon-plus"
                     @click="skipTo('AddTvmanage', 1)">新建</el-button>
          <el-button :disabled="multipleSelection.length !== 1"
                     size="small"
                     icon="el-icon-edit-outline"
                     @click="skipTo('ChangeTvwallEidto', 2)">编辑</el-button>
          <el-button :disabled="multipleSelection.length === 0"
                     size="small"
                     icon="el-icon-delete"
                     @click="deleteMethod">删除</el-button>
          <el-button :disabled="multipleSelection.length === 0"
                     size="small"
                     icon="icon iconfont-ccb ccbqianyi el-icon-"
                     @click="skipTo('moveTvWall', 3)">迁移</el-button>
          <el-button :disabled="multipleSelection.length !== 1"
                     size="small"
                     icon="el-icon-sort"
                     @click="skipTo('SortTvWall', 4)">排序</el-button>
          <el-button size="small"
                     icon="icon iconfont-ccb ccbdaochu1 el-icon-"
                     @click="exportMethod">导出</el-button>
          <el-button @click="Toprint"
                     size="small"
                     icon="el-icon-printer">打印</el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-top">
          <el-checkbox @change="change_subOrg"
                       style="margin-right:12px;"
                       v-model="isShowSubOrg">显示子机构</el-checkbox>
          <el-button type="text"
                     icon="el-icon-refresh"
                     @click="handlerRefresh">刷新列表</el-button>
          <el-input v-model="input"
                    @change="searchList"
                    placeholder="请输入电视墙名称 ..."
                    maxlength="64"
                    suffix-icon="el-icon-search"
                    style="float:right;width:200px;"
                    size="mini"></el-input>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    @selection-change="handleSelectionChange"
                    @cell-dblclick="seeMessage"
                    border
                    size="mini"
                    stripe
                    :height="tableHeight">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column min-width="105px"
                             v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination :current-page="pageInfo.page"
                         :page-size="pageInfo.limit"
                         style="text-align:right;"
                         :page-sizes="[10, 20, 30, 50]"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="pageInfo.total"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
            ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, searchTreeApi2 } from '../../../../http/tvWall/tvWallmanage.api'
export default {
  components: {
    treeBox
  },
  data() {
    return {
      rootId: '',
      input: '', // 搜素
      pageInfo: {
        // 页码组件返回参数
        limit: 50,
        page: 1,
        total: 0 // 总页码
      },
      query: {
        page: 1,
        limit: 50,
        rescusive: false,
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        server: '',
        keyword: '',
        linkWall: ''
      },
      currentOrgId: '',
      currentKeyPartId: '',
      treeType: 2,
      filterText: '',
      linkWallName: '', // 默认联动电视墙名称
      status: '全部',
      isShowSubOrg: false,
      tableHeight: 688,
      multipleSelection: [],
      tableData: [], // 列表数据容器
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '所属机构', width: '', sortable: true },
        { prop: 'keyPartName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'name', label: '电视墙名称', width: '140', sortable: true },
        { prop: 'position', label: '电视墙位置', width: '', sortable: true },
        { prop: 'linkWallName', label: '联动默认电视墙', width: '140', sortable: true },
        { prop: 'assetCode', label: '资产编码', width: '', sortable: true },
        { prop: 'updatedBy', label: '录入人', width: '', sortable: true },
        { prop: 'updatedDept', label: '录入机构', width: '', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '', sortable: true }
      ]
    }
  },

  created() { },
  mounted() {
    this.getTvwallList(1)
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2', 'SET_MOVEDATA']),
    ...mapActions(['getTvWallListApi', 'deleteTvWallApi']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    setRootId(id) {
      this.rootId = id
    },
    skipTo(data, index) {
      if (index === 1 || index === 5) {
        this.SET_COMPONENTID1(data)
      } else if (index === 2 || index === 4) {
        this.SET_COMPONENTID2('list')
        this.SET_COMPONENTID1(data)
        this.SET_TVWALL_MESSAGE(this.multipleSelection[0])
      } else if (index === 3) { // 迁移
        this.SET_COMPONENTID1(data)
        this.SET_MOVEDATA(this.multipleSelection)
      }
    },
    seeMessage(val) {
      // 双击查看详细信息
      this.SET_COMPONENTID1('newWallmessage')
      this.SET_COMPONENTID2('list') // 从列表进入查看
      this.SET_TVWALL_MESSAGE(val)
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    // 拿到电视墙列表数据
    async getTvwallList(val) {
      await this.getTreeApi()
      this.query.page = this.pageInfo.page
      this.query.limit = this.pageInfo.limit
      this.query.orgId = this.currentOrgId || this.rootId
      this.query.keyPartId = this.currentKeyPartId
      this.getTvWallListApi(this.query)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 2) {
              this.succefullMethod('刷新成功')
            }
            this.tableData = res.data.data === null ? [] : res.data.data.results
            this.tableData.map(item => {
              item['linkWallName'] = item.linkWall === 1 ? '是' : item.linkWall === 2 ? '否' : ''
            })
            this.pageInfo.total = Number(res.data.data.total)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 列表搜索
    searchList(val) {
      // debugger
      this.query.keyword = val
      this.getTvwallList(1)
    },
    // 是否勾选显示子机构(默认否)
    change_subOrg(val) {
      if (val) {
        this.query.rescusive = true
        this.getTvwallList(1)
      } else {
        this.query.rescusive = false
        this.getTvwallList(1)
      }
    },
    // 点击机构树的节点，对应请求某机构或重点部位的电视墙列表
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.currentOrgId = data.id
      } else {
        this.currentOrgId = node.parent.data.id
        this.currentKeyPartId = data.id
      }
      this.getTvwallList(1)
    },

    clickData(data) { // 机构树加载节点信息
      if (data && data.id) { // 返回机构树加载根节点信息
        this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点
      }
    },
    // 电视墙列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除弹框
    deviceModel(val) {
      let title = '确定删除' + val + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = {}
          let deleteDataId = []
          this.multipleSelection.map(item => {
            deleteDataId.push(item.id)
          })
          obj.ids = deleteDataId
          this.deleteTvWallApi(obj)
            .then(res => {
              this.multipleSelection = []
              this.succefullMethod('删除成功')
              this.getTvwallList(1) // 刷新列表
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除电视墙
    deleteMethod() {
      if (this.multipleSelection.length === 0) {
        this.failureMethod('请选择要删除的电视墙数据')
      } else {
        this.deviceModel('该电视墙')
      }
    },
    // 电视墙列表导出
    exportMethod() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '电视墙名称',
        '电视墙位置',
        '联动默认电视墙',
        '资产编码',
        '录入人',
        '录入机构',
        '录入时间'
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'name',
        'position',
        'linkWallName',
        'assetCode',
        'updatedBy',
        'updatedDept',
        'updatedAt'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '电视墙配置列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'name', displayName: '电视墙名称' },
          { field: 'position', displayName: '电视墙位置' },
          { field: 'linkWallName', displayName: '联动默认电视墙' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedAt', displayName: '录入时间' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">电视墙配置列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    },
    // 刷新
    handlerRefresh() {
      this.pageInfo.page = 1
      this.getTvwallList(2)
    },
    // 分页（修改数量）
    handleSizeChange(val) {
      this.pageInfo.page = 1
      this.pageInfo.limit = val
      this.getTvwallList(1)
    },

    // 分页（修改页码）
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getTvwallList(1)
    }
  },
  // 管道定义
  filters: {
    capitalize: function (value) {
      if (!value) {
        return ''
      }
      return value === 1 ? '是' : value === 2 ? '否' : ''
    }
  }
}
</script>

<style lang="less" scoped>
.transferWrap /deep/ .el-dialog {
  width: 628px;
}
.transferWrap /deep/.el-dialog__header {
  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid #f3f3f3;
}
.transferWrap /deep/ .el-dialog__title {
  font-weight: bolder;
  font-size: 15px;
}
.transferWrap /deep/.el-dialog__headerbtn {
  top: 15px;
}
.transferWrap2 /deep/ .el-dialog__body {
  padding: 16px 20px;
}
.modelContend {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 300px;
}
.modelLeft {
  width: 270px;
  height: 100%;
  border: 1px solid gainsboro;
}
.titleLeft {
  width: 100%;
  line-height: 30px;
  text-align: center;
  height: 30px;
  background: rgba(242, 242, 242, 1);
}
.modelWrap {
  width: 100%;
  height: 100%;
}
.tvWallModelMessage {
  width: 100%;
  display: flex;
  height: 30px;
  line-height: 30px;
}
.titleMessage {
  width: 100px;
  text-align: right;
}
.localTerminal1 {
  height: 270px;
  overflow: auto;
}
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
.main {
  width: 100%;
  height: calc(~'100% - 133px');
}
</style>
