<template>
  <div id="upFile">
    <div style="margin:10px 0">
      <!-- <TabMenu :tabList="tabList" /> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁平台配置</el-breadcrumb-item>
        <el-breadcrumb-item>导入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="top-opt-box" style="overflow:hidden">
      <div class="file-box" style="width:500px;float:left">
        <el-input size="mini" style="margin-top:5px">
          <template slot="prepend">选择导入文件</template>
          <el-upload slot="append" action>
            <el-button size="mini" type="primary">浏览...</el-button>
          </el-upload>
        </el-input>
      </div>
      <div class="buttons" style="float:left;margin-left:10px">
        <el-button size="mini">导入</el-button>
        <el-button size="mini">重置</el-button>
        <el-button size="mini">覆盖</el-button>
        <el-button size="mini">保存</el-button>
      </div>
    </div>

    <div class="table" v-show="isShowTable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="门禁平台1" name="first">
          <h3>门禁平台列表</h3>

          <Table
            v-show="isShowTable"
            :columns="platformOneColumns"
            :tableData="platformOneData"
            :tabHeight="200"
          />
        </el-tab-pane>
        <el-tab-pane label="门禁平台2" name="second">
          <h3>门禁平台列表</h3>
          <Table :tabHeight="200" :columns="platformTwoColumns" :tableData="platformTwoData" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tableBottom" v-show="isShowTable">
      <el-collapse v-model="activeNames" @change="collEvent">
        <el-collapse-item title="门禁通道列表" name="1">
          <Table
            v-show="isShowTable"
            :columns="outputChanColumns"
            :tableData="outputChanTableData"
            :tabHeight="200"
          />
        </el-collapse-item>
        <el-collapse-item title="门锁通道列表" name="2">
          <Table
            v-show="isShowTable"
            :columns="outputChanColumns"
            :tableData="outputChanTableData"
            :tabHeight="200"
          />
        </el-collapse-item>
        <el-collapse-item title="读头通道列表" name="3">
          <Table
            v-show="isShowTable"
            :columns="outputChanColumns"
            :tableData="outputChanTableData"
            :tabHeight="200"
          />
        </el-collapse-item>
        <el-collapse-item title="报警输入列表" name="4">
          <Table
            v-show="isShowTable"
            :columns="outputChanColumns"
            :tableData="outputChanTableData"
            :tabHeight="200"
          />
        </el-collapse-item>
      </el-collapse>
      <!-- <Table
        v-show="isShowTable"
        :tabHeight="'100%'"
        :columns="outputChanColumns"
        :tableData="outputChanTableData"
      />-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
    Table: () => import('../../../components/comTable'),
    TabMenu: () => import('../../components/tabMenu'),
  },
  data() {
    return {
      tabHeight: 222,
      tabList: ['基础信息', '门禁平台管理', '导入'],
      isShowTable: true,
      activeName: 'first',
      activeNames: ['1'],
      Save: false,
      doUpload: '',
      pppss: {
        srid: '',
      },
      platformOneData: [{}, {}],
      platformOneColumns: [
        { prop: '', label: '所属子系统', width: '' },
        { prop: '', label: '所属机构', width: '' },
        { prop: '', label: '所属重点部位', width: '' },
        { prop: '', label: '所属门禁平台', width: '' },
        { prop: '', label: '门禁主机名称', width: '' },
        { prop: '', label: '门禁主机IP', width: '' },
        { prop: '', label: '端口', width: '' },
        { prop: '', label: '型号', width: '' },
        { prop: '', label: '门禁主机类型', width: '' },
        { prop: '', label: '门禁主机ID', width: '' },
        { prop: '', label: '门禁通道数量', width: '' },
        { prop: '', label: '读头通道数量', width: '' },
        { prop: '', label: '报警输入', width: '' },
        { prop: '', label: '资产编码', width: '' },
        { prop: '', label: '在线状态', width: '' },
        { prop: '', label: '录入人', width: '' },
        { prop: '', label: '录入机构', width: '' },
        { prop: '', label: '录入时间', width: '' },
      ],
      platformTwoData: [{}, {}],
      platformTwoColumns: [
        { prop: '', label: '所属子系统', width: '' },
        { prop: '', label: '所属机构', width: '' },
        { prop: '', label: '所属重点部位', width: '' },
        { prop: '', label: '所属门禁平台', width: '' },
        { prop: '', label: '门禁主机名称', width: '' },
        { prop: '', label: '门禁主机IP', width: '' },
        { prop: '', label: '端口', width: '' },
        { prop: '', label: '型号', width: '' },
        { prop: '', label: '门禁主机类型', width: '' },
        { prop: '', label: '门禁主机ID', width: '' },
        { prop: '', label: '门禁通道数量', width: '' },
        { prop: '', label: '读头通道数量', width: '' },
        { prop: '', label: '报警输入', width: '' },
        { prop: '', label: '资产编码', width: '' },
        { prop: '', label: '在线状态', width: '' },
        { prop: '', label: '录入人', width: '' },
        { prop: '', label: '录入机构', width: '' },
        { prop: '', label: '录入时间', width: '' },
      ],
      outputChanTableData: [{}, {}, {}],
      outputChanColumns: [
        { prop: '', label: '门禁通道名称', width: '' },
        { prop: '', label: '门禁通道号', width: '' },
        { prop: '', label: '门ID', width: '' },
        { prop: '', label: '门禁通道类型', width: '' },
        { prop: '', label: '状态', width: '' },
        { prop: '', label: '品牌', width: '' },
        { prop: '', label: '型号', width: '' },
        { prop: '', label: '资产编码', width: '' },
      ],
    }
  },
  methods: {
    //导入
    // prot() {
    //   this.Save = false
    //   this.isShowTable = true
    // },
    //重置
    // reset() {
    //   this.isShowTable = false
    // },
    //是否保存
    isSave() {
      this.Save = true
    },
    handleClick(val) {},
    //折叠面板 fn
    collEvent(val) {},
  },
}
</script>
<style lang="less" scoped>
#upFile {
  display: block;
  padding: 0 10px;
  .top-opt-box {
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    align-items: center;
    .file-box {
      width: 500px;
      height: 100%;
      margin-right: 10px;
    }
    .buttons {
      flex: 1;
    }
  }

  .table {
    height: 300px;
    // border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
    h3 {
      margin: 10px 0;
    }
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: none;
  }
  .tableBottom {
    // height: 600px;
    height: 460px;
    overflow-y: auto;
  }
}
</style>
