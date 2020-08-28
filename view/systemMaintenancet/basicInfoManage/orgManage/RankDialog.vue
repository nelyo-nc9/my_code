<template>
  <div class="rank-dialog">
    <!-- 机构管理-机构维护-排序弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>排序</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="content-top">
        <el-button size="small" @click="moveUp">上移</el-button>
        <el-button size="small" @click="moveDown">下移</el-button>
        <el-button size="small" @click="moveTop">置顶</el-button>
        <el-button size="small" @click="moveBottom">置底</el-button>
      </div>
      <div class="content-table">
        <el-table
          ref="singleTable"
          stripe
          border
          size="medium"
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="tableData"
          height="100%"
          max-height="805"
          style="width: 100%; ">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="机构名称" prop="name" width="180" align="center"></el-table-column>
          <el-table-column label="机构编号" prop="serial" width="280" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="content-footer">
        <el-button size="small" @click="clickSave()">保存</el-button>
        <el-button size="small" @click="clickClose()">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi, orgOrderApi } from '@src/http/basicInfoManage/orgManage.api'
export default {
  name: 'RankDialog',
  props: {
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      currentIndex: 0 // 选中行的tableData索引
    }
  },
  watch: {
    'nodeData.serial': {
      handler() {
        this.getTreeData()
      },
      deep: true
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    moveUp() { // 上移
      if (this.currentIndex === 0) { return }
      let tmp1 = this.tableData[this.currentIndex - 1]
      let tmp2 = this.tableData[this.currentIndex]
      this.$set(this.tableData, this.currentIndex - 1, tmp2)
      this.$set(this.tableData, this.currentIndex, tmp1)
      this.currentIndex = this.currentIndex - 1
    },
    moveDown() { // 下移
      if (this.currentIndex === (this.tableData.length - 1)) { return }
      let tmp1 = this.tableData[this.currentIndex + 1]
      let tmp2 = this.tableData[this.currentIndex]
      this.$set(this.tableData, this.currentIndex + 1, tmp2)
      this.$set(this.tableData, this.currentIndex, tmp1)
      this.currentIndex = this.currentIndex + 1
    },
    moveTop() { // 置顶
      if (this.currentIndex === 0) { return }
      let tmp1 = this.tableData[0]
      let tmp2 = this.tableData[this.currentIndex]
      this.$set(this.tableData, 0, tmp2)
      this.$set(this.tableData, this.currentIndex, tmp1)
      this.currentIndex = 0
    },
    moveBottom() { // 置底
      if (this.currentIndex === (this.tableData.length - 1)) { return }
      let tmp1 = this.tableData[this.tableData.length - 1]
      let tmp2 = this.tableData[this.currentIndex]
      this.$set(this.tableData, this.tableData.length - 1, tmp2)
      this.$set(this.tableData, this.currentIndex, tmp1)
      this.currentIndex = this.tableData.length - 1
    },
    clickSave() {
      if (this.tableData.length < 2) {
        this.clickClose()
        return
      }
      let idsArr = []
      this.tableData.forEach(item => {
        idsArr.push(item.id)
      })
      let param = {
        ids: idsArr,
        type: 1
      }
      orgOrderApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('机构排序成功！', '成功')
          this.$emit('orgTreeRefresh')
          this.clickClose()
        } else {
          console.log(res, '机构排序失败')
          this.$messageError(`机构排序失败，原因：${res.data.message}`, '错误')
        }
      }).catch(err => {
        console.log(err, '机构排序失败')
        this.$messageError('机构排序失败，请稍后重试！', '错误')
      })
    },
    clickClose() {
      this.$emit('defaultComponent')
    },
    getTreeData() { // 获取机构列表
      this.tableData = []
      let param = {
        type: 0,
        oId: this.nodeData.serial
      }
      getTreeApi(param).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.nodes
          this.setCurrent(this.tableData[0])
        } else {
          console.log(res, '获取机构失败')
        }
      }).catch(err => {
        console.log(err, '获取机构失败')
      })
    },
    setCurrent(row) { // 选择第几行
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) { // 选中行对应的索引
      this.tableData.forEach((item, index) => {
        if (item.id === val.id) {
          this.currentIndex = index
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rank-dialog {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-bottom: 10px;
  }
  .content {
    width: 700px;
    border: 1px solid #ddd;
    margin: 20px;
    height: 700px;
    .el-button {
      width: 80px;
    }
    .content-top {
      text-align: center;
      margin: 20px 0;
    }
    .content-table {
      width: 543px;
      height: calc(~'100% - 146px');
      border: 1px solid #ddd;
      margin: 0 auto;
    }
    .content-footer {
      padding: 20px 0;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
