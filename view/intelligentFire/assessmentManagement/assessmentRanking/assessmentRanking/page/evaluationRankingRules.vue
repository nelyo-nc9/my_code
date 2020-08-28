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
            <el-breadcrumb-item>消防评估</el-breadcrumb-item>
            <el-breadcrumb-item>评估排行</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="flex-between">
          <div class="button-box">
            <el-button size="mini">打印</el-button>
            <el-button size="mini">导出</el-button>
            <el-button size="mini" @click="downloadDialog = true">下载</el-button>
          </div>
          <div class="seachbox flex-row">
            <el-button size="mini" type="primary">按年</el-button>
            <el-button size="mini" class="mar20">按月</el-button>
            <div class="label mar10">组织机构</div>
            <el-select class="wth120 mar20 pad0" v-model="status" size="mini">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="融汇支行" value="融汇支行"></el-option>
              <el-option label="城建支行" value="城建支行"></el-option>
              <el-option label="东风路支行" value="东风路支行"></el-option>
            </el-select>
            <div class="label mar10">自定义时间</div>
            <el-date-picker v-model="value1" type="date" class="wth240 mar20" placeholder="选择日期"> </el-date-picker>
            <el-date-picker v-model="value2" type="date" class="wth240 mar20" placeholder="选择日期"> </el-date-picker>
            <el-input suffix-icon="el-icon-search" class="wth240" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="table-box">
        <div class="table-top mab20">
          <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
          <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList">刷新列表</el-button>
        </div>
        <div ref="tableBox">
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
    <el-dialog title="下载存储路劲" :visible.sync="downloadDialog" width="30%" center>
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
export default {
  components: {
    OrgTree,
    downloadComponents
  },
  data() {
    return {
      isShowSubOrg: true,
      value1: '',
      value2: '',
      status: '',
      downloadDialog: false,
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
          label: '设备分类',
          width: '120'
        },
        {
          prop: 'deviceName',
          label: '关联系统',
          width: '100'
        },
        {
          prop: 'deviceDepar',
          label: '关联部门',
          width: '100'
        },
        {
          prop: 'code',
          label: '资产编码',
          width: '100'
        },
        {
          prop: 'brand',
          label: '设备品牌',
          width: '100'
        },
        {
          prop: 'deviceModel',
          label: '设备型号',
          width: '100'
        },
        {
          prop: 'netModuleBrand',
          label: '网络模块品牌',
          width: '100'
        },
        {
          prop: 'netModuleModel',
          label: '网络模块类型',
          width: '100'
        },
        {
          prop: 'netModuleID',
          label: '网络模块ID',
          width: '100'
        },
        {
          prop: 'keyboardPassword',
          label: '键盘密码',
          width: '100'
        },
        {
          prop: 'ip',
          label: 'IP地址',
          width: '100'
        },
        {
          prop: 'port',
          label: '网络端口',
          width: '80'
        },
        {
          prop: 'userName',
          label: '用户名',
          width: '80'
        },
        {
          prop: 'password',
          label: '密码',
          width: '80'
        },
        {
          prop: 'service',
          label: '所属服务',
          width: '100'
        },
        {
          prop: 'domain',
          label: '网域',
          width: '100'
        },
        {
          prop: 'detectorNo',
          label: '探测器数量',
          width: '60'
        },
        {
          prop: 'outputNo',
          label: '输出通道数量',
          width: '60'
        },
        {
          prop: 'subsystemNo',
          label: '子系统数量',
          width: '60'
        },
        {
          prop: 'state',
          label: '状态',
          width: '80'
        },
        {
          prop: 'createdBy',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'createdDept',
          label: '录入机构',
          width: '100'
        },
        {
          prop: 'createdAt',
          label: '录入时间',
          width: '120'
        }
      ],
      tableData: [
        {
          orgName: '123'
        }
      ]
    }
  },
  methods: {
    getAlarmHostList() {},
    changeFolder(e) {
      const file = e.target.files[0]
      if (file) {
        this.setState({
          folderPath: file.path
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
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
    .rules {
      width: 100%;
      height: calc(~'100% - 66px');
      display: flex;
      flex-direction: column;
      .rules-title {
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        font-weight: 600;
      }
      .rules-box {
      }
    }
  }
}
</style>
