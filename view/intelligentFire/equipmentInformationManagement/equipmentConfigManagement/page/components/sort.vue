<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备配置管理</el-breadcrumb-item>
        <el-breadcrumb-item>消防系统关联配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div style="margin: 10px 0;">报警主机信息</div>
      <div style="margin: 10px 0;">
        <el-button size="mini">上移</el-button>
        <el-button size="mini">下移</el-button>
        <el-button size="mini">置顶</el-button>
        <el-button size="mini">置尾</el-button>
      </div>
      <el-table :data="tableData" border height="450" size="mini" stripe>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="deviceName" label="报警主机名称"></el-table-column>
        <el-table-column prop="code" label="资产编码"></el-table-column>
      </el-table>
      <div style="margin-top: 24px;">
        <el-button size="mini" type="primary">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sort',
  props: {
    isShowSort: Boolean
  },
  data() {
    return {
      tableData: [
        { deviceName: '报警主机-营业区', code: '1234556353' },
        { deviceName: '报警主机-加钞区', code: '6568353555' }
      ]
    }
  },
  methods: {
    cancel() {
      this.$emit('update:isShowSort', false)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .main-content {
    width: 600px;
    text-align: center;
  }
}
</style>
