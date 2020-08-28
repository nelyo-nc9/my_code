<template>
  <div class="content">
    <div class="left-tree">
      <OrgTree></OrgTree>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>评估管理</el-breadcrumb-item>
            <el-breadcrumb-item>评估报告排名</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini">打印</el-button>
          <el-button size="mini">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-top">
          <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList">刷新列表</el-button>
          <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="mini"></el-input>
          <el-select style="float:right;width:170px;margin-right:12px;" v-model="status" size="mini">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in selcetData" :key="index"></el-option>
          </el-select>
        </div>
        <div style="flex:1;" ref="tableBox">
          <el-table :data="tableData" border size="mini" stripe :height="tableHeight" @row-click="showDetail">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-link :underline="false" @click="toUserAssistantChild(scope, 'assessmentReports')"
                    >查看报告</el-link
                  >
                  <el-link :underline="false" @click="toUserAssistantChild(scope, 'assessmentReport')"
                    >评估详细得分</el-link
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align:right;"
            :page-sizes="[25, 50, 100, 200]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加部件弹窗 -->
    <el-dialog title="下载存储路劲" :visible.sync="downloadDialog" width="30%" center :before-close="handleClose">
      <downloadComponents></downloadComponents>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preserveParts()">下载</el-button>
        <el-button @click="downloadDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from '../../../../OrgTree'
import downloadComponents from './downloadComponents'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'fireFightingList',
  components: {
    OrgTree,
    downloadComponents
  },
  data() {
    return {
      downloadDialog: false,
      status: '全部',
      isShowSubOrg: true,
      tableHeight: 688,
      tableColumn: [
        // 表格标题行内容
        { prop: 'subsystem', label: '所属机构' },
        { prop: 'orgName', label: '机构单位名称' },
        { prop: 'keySite', label: '评估时间' },
        { prop: 'deviceType', label: '排名' }
      ],
      tableData: [
        // 列表数据
      ],
      activeData: null,
      isShowDetail: false,
      selcetData: [
        { name: '融汇支行', id: 0 },
        { name: '城建支行', id: 1 },
        { name: '东分路支行', id: 2 },
        { name: '定州支行', id: 3 },
        { name: '涿州物探支行', id: 4 },
        { name: '徐水坛行', id: 5 }
      ]
    }
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
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    ...mapActions(['getAlarmHost']),
    skipTo(data) {
      if (data === 'Add') {
        this.SET_IS_NEW_FILE('fireFightingSubsystemManagement')
      }
    },
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    getAlarmHostList() {},
    showDetail(row) {
      this.activeData = row
      this.isShowDetail = true
    },
    closeDetail() {
      this.isShowDetail = false
    },
    toUserAssistantChild(data, url) {
      this.SET_COMPONENT_ID(url)
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
</style>
