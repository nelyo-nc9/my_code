<!--
 * @Author: shikai
 * @Date: 2020-07-10 01:05:10
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-16 19:22:21
-->
<template>
  <div class="content">
    <div class="left-tree">
      <div class="tree-title">
        <span>机构</span>
        <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      </div>
      <treeBox
        ref="tree"
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
        :customizeQuery="customizeQuery"
      ></treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>导入</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box flex-row">
          <div class="voice-upload" style="margin-top:20px;">
            <label>请选择文件：</label>
            <el-upload
              action
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :on-change="handleAvatarSuccess"
              :limit="1"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-input
                v-model="voiceValue.name"
                placeholder="未选择任何文件"
                size="mini"
                style="margin-right:20px;margin-top:20px;"
              ></el-input>
            </el-upload>
          </div>
          <div style="margin-top:20px;">
            <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">覆盖重复项</el-checkbox>
            <el-button type="primary" size="mini" @click="importData">导入</el-button>
            <el-button type="primary" size="mini" @click="clickSave('保存')">保存</el-button>
            <el-button size="mini" @click="skipToList">关闭</el-button>
          </div>
        </div>
      </div>
      <div class="table-box">
        <div class="box-title mab20">导入设备列表</div>
        <div style="flex:1;" ref="tableBox">
          <el-table
            ref="fireList"
            :data="tableData"
            border
            size="mini"
            :stripe="true"
            height="688"
            @row-click="showDetail"
            @selection-change="handleSelectionChange"
            v-if="sidebarActiveId !== 12"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              width="150"
              sortable
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <el-table
            ref="fireList"
            :data="tableData"
            border
            size="mini"
            :stripe="true"
            height="688"
            @row-click="showDetail"
            @selection-change="handleSelectionChange"
            v-if="sidebarActiveId === 12"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column
              v-for="item in tableColumns"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              align="center"
              width="150"
              sortable
              show-overflow-tooltip
            ></el-table-column>
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
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { handleImport } from '@src/common/excel'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  name: 'fireFightingList',
  components: {
    treeBox
  },
  data() {
    return {
      status: '全部',
      isShowSubOrg: false,
      tableHeight: 'auto',
      moveDialog: false,
      voiceValue: '',
      total: 1, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      treeType: 2, // 树
      customizeQuery: {
        // 树
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      tableColumn: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '100'
        },
        {
          prop: 'keySite',
          label: '所属部位',
          width: '100'
        },
        {
          prop: 'deviceType',
          label: '设备名称',
          width: '120'
        },
        {
          prop: 'deviceName',
          label: '设备品牌',
          width: '100'
        },
        {
          prop: 'deviceDepar',
          label: '设备型号',
          width: '100'
        },
        {
          prop: 'code',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'brand',
          label: '标签编码',
          width: '100'
        },
        {
          prop: 'deviceModel',
          label: '设备有效期',
          width: '100'
        },
        {
          prop: 'netModuleBrand',
          label: '设备位置',
          width: '100'
        },
        {
          prop: 'netModuleModel',
          label: '资产编码',
          width: '100'
        },
        {
          prop: 'netModuleID',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'keyboardPassword',
          label: '状态',
          width: '100'
        },
        {
          prop: 'ip',
          label: '传输设备分类',
          width: '100'
        },
        {
          prop: 'port',
          label: '传输设备名称',
          width: '80'
        },
        {
          prop: 'userName',
          label: '传输设备品牌',
          width: '80'
        },
        {
          prop: 'ip',
          label: '传输设备型号',
          width: '100'
        },
        {
          prop: 'port',
          label: '传输通讯类型',
          width: '80'
        },
        {
          prop: 'userName',
          label: '传输设备IMEI',
          width: '80'
        },
        {
          prop: 'ip',
          label: '传输设备IP地址',
          width: '100'
        },
        {
          prop: 'port',
          label: '传输设备网络端口',
          width: '80'
        },
        {
          prop: 'userName',
          label: '所属服务',
          width: '80'
        },
        {
          prop: 'ip',
          label: '传输设备设备标签',
          width: '100'
        },
        {
          prop: 'port',
          label: '传输设备标签编码',
          width: '80'
        },
        {
          prop: 'userName',
          label: '传输设备生产日期',
          width: '80'
        },
        {
          prop: 'ip',
          label: '传输设备有效期',
          width: '100'
        },
        {
          prop: 'port',
          label: '传输设备位置',
          width: '80'
        },
        {
          prop: 'userName',
          label: '传输设备资产编码',
          width: '80'
        },
        {
          prop: 'ip',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'port',
          label: '录入机构',
          width: '80'
        },
        {
          prop: 'userName',
          label: '录入时间',
          width: '80'
        }
      ],
      tableColumns: [
        // 表格标题行内容
        {
          prop: 'orgName',
          label: '所属机构',
          width: '100'
        },
        {
          prop: 'keySite',
          label: '所属部位',
          width: '100'
        },
        {
          prop: 'deviceType',
          label: '设备名称',
          width: '120'
        },
        {
          prop: 'deviceName',
          label: '设备品牌',
          width: '100'
        },
        {
          prop: 'deviceDepar',
          label: '设备型号',
          width: '100'
        },
        {
          prop: 'code',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'brand',
          label: '标签编码',
          width: '100'
        },
        {
          prop: 'deviceModel',
          label: '设备有效期',
          width: '100'
        },
        {
          prop: 'netModuleBrand',
          label: '设备位置',
          width: '100'
        },
        {
          prop: 'netModuleModel',
          label: '资产编码',
          width: '100'
        },
        {
          prop: 'netModuleID',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'ip',
          label: '设备分类',
          width: '100'
        },

        {
          prop: 'port',
          label: '通讯类型',
          width: '80'
        },
        {
          prop: 'userName',
          label: '设备IMEI',
          width: '80'
        },

        {
          prop: 'userName',
          label: '所属服务',
          width: '80'
        },

        {
          prop: 'ip',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'port',
          label: '录入机构',
          width: '80'
        },
        {
          prop: 'userName',
          label: '录入时间',
          width: '80'
        }
      ],
      tableData: [],
      activeData: null,
      isShowDetail: 'list',
      fireSelection: [],
      newData: [],
      defaultParams: {
        pageSize: 10, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2, // 是否显示子机构， 1-是 2-否
        type: 1 // 主机类型(页面类型--sidebarActiveId)
      }
    }
  },
  created() {
    this.closeDetail()
    this.getAlarmHostList()
    this.pageCount = Math.ceil(this.total / this.pageSize)
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  watch: {
    sidebarActive: function(newVale, oldValue) {
      if (newVale) {
        this.closeDetail()
      }
    },
    tableData: function() {
      this.total = this.tableData.length
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive',
      sidebarActiveId: 'sidebarActiveId'
    }),
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE'
    }),
    ...mapActions(['getAlarmHost']),
    // 树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 左侧树
    onceClick(data, node) {
      // this.defaultParams.orgId = data.orgId
      // this.defaultParams.keyPartId = data.keyPartId
      if (data.tierType === 'org') {
        this.defaultParams.orgId = data.id
      } else {
        this.defaultParams.orgId = node.parent.data.id
        this.defaultParams.keyPartId = data.id
      }
      this.getQueryData(this.defaultParams)
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    skipTo(data) {
      if (data === 'Add') {
        this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      } else if (data === 'edit') {
        this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      }
    },

    // 跳转到列表页
    skipToList() {
      this.SET_IS_NEW_FILE('FireAlarm')
    },
    resizeFun() {
      // this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    getAlarmHostList() {
      // this.getAlarmHost().then(res => {
      //   const result = res.data.data.results
      //   Array.isArray(result) && result.forEach(item => {
      //     item.createdAt = this.$moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
      //   })
      //   this.tableData = result
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    showDetail(row) {
      this.activeData = row
      this.isShowDetail = 'detail'
    },
    closeDetail() {
      this.isShowDetail = 'list'
    },
    handleSelectionChange(val) {
      this.fireSelection = val
    },
    // 保存
    clickSave(val) {
      this.$notify.success({
        message: `${val}成功`,
        title: '成功'
      })
    },
    // 改变pageSize
    pageSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
      const isWav =
        file.type === '.csv' ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        'application/vnd.ms-excel'
      if (!isWav) {
        this.$notify.warning({
          message: '上传文件格式只能是xlsx格式!',
          title: '警告'
        })
      }
      return isWav
    },
    // 上传成功
    handleAvatarSuccess(file, fileList) {
      let obj = {}
      if (this.sidebarActiveId !== 12) {
        this.tableColumn.map(n => {
          Object.assign(obj, { [n.label]: n.prop })
        })
      } else {
        this.tableColumns.map(n => {
          Object.assign(obj, { [n.label]: n.prop })
        })
      }

      handleImport(file, obj, data => {
        this.newData = data
      })
      this.voiceValue = file
    },
    // 导入数据
    importData(event) {
      this.$notify.success({
        message: '导入成功',
        title: '成功'
      })
      this.tableData = [...this.newData, ...this.tableData]
      this.total = this.tableData.length || 1
    },
    // 打印
    async printing() {
      await this.$nextTick(() => {
        this.$print(this.$refs.prints)
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
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    i {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 120px;
      margin-top: -12px;
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
