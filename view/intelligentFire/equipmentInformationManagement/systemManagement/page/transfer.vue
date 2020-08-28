<template>
  <div class="sort-container">
    <!-- 面包屑 -->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item class="active">排序</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main">
      <div class="button-box">
        <el-button size="small" :disabled="selectData.length !== 1" @click="up">上移</el-button>
        <el-button size="small" :disabled="selectData.length !== 1" @click="down">下移</el-button>
        <el-button size="small" :disabled="selectData.length !== 1" @click="setUp">置顶</el-button>
        <el-button size="small" :disabled="selectData.length !== 1" @click="setDown">置底</el-button>
      </div>
      <div class="table-container">
        <el-table
          stripe
          border
          size="medium"
          :data="tableData"
          @select="select"
          @select-all="select"
          height="400"
          max-height="805"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="index" label="序号" type="index" width="80" align="center"> </el-table-column>
          <el-table-column prop="name" label="设备名称" align="center"> </el-table-column>
          <el-table-column prop="assetCode" label="资产编码" align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="oper-btn-box">
        <el-button size="small" type="primary" @click="saveBtnHandler">保存</el-button>
        <el-button size="small" @click="showConfirmDialog = true">取消</el-button>
      </div>
    </div>

    <!-- 确认框 -->
    <el-dialog title="提示" :visible.sync="showConfirmDialog" width="450px" class="confirm-opendoor-dialog">
      <p style="marginLeft: 20px; fontSize: 16px;">请确定放弃保存正在编辑的内容吗？</p>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancleBtnHandler">确 定</el-button>
        <el-button @click="showConfirmDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'

import { mapState } from 'vuex'

export default {
  props: {
    sortData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
      tableData: [],
      selectData: [],
      showConfirmDialog: false
    }
  },
  created() {
    let _this = this
    console.log(this.sortData)
    let params = {
      pageSize: 1000,
      page: 1,
      isChildren: 2,
      orgId: this.sortData[0].orgId,
      keyPartId: this.sortData[0].keyPartId,
      type: [this.sortData[0].type],
      isOrder: true // 是否根据序号进行排序 true-是 false-否
    }
    fireInterface.comBustibleQueryHost(params).then(res => {
      if (res.data.code === 0) {
        this.tableData = _this.$lodash.cloneDeep(res.data.data.alarmHostInfo)
      }
    })
    console.log(this.tableData)
    // this.tableData = this.$lodash.cloneDeep(this.sortData)
  },
  methods: {
    // 上移
    up() {
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === 0) {
        return
      }
      ;[this.tableData[findInd].serialNum, this.tableData[findInd - 1].serialNum] = [
        this.tableData[findInd - 1].serialNum,
        this.tableData[findInd].serialNum
      ]
      let spliceItem = this.tableData.splice(findInd, 1)
      this.tableData.splice(--findInd, 0, ...spliceItem)
    },
    // 下移
    down() {
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === this.tableData.length - 1 || this.tableData.length === 1) {
        return
      }
      ;[this.tableData[findInd].serialNum, this.tableData[findInd + 1].serialNum] = [
        this.tableData[findInd + 1].serialNum,
        this.tableData[findInd].serialNum
      ]
      let spliceItem = this.tableData.splice(findInd, 1)
      this.tableData.splice(++findInd, 0, ...spliceItem)
    },
    // 置顶
    setUp() {
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === 0) {
        return
      }
      let temp = this.tableData[0].serialNum
      for (let i = 0; i < findInd; i++) {
        ;[this.tableData[i].serialNum, this.tableData[i + 1].serialNum] = [
          this.tableData[i + 1].serialNum,
          this.tableData[i].serialNum
        ]
      }
      let spliceItem = this.tableData.splice(findInd, 1)
      spliceItem[0].serialNum = temp
      this.tableData.unshift(...spliceItem)
    },
    // 置底
    setDown() {
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === this.tableData.length - 1 || this.tableData.length === 1) {
        return
      }
      let temp = this.tableData[this.tableData.length - 1].serialNum
      for (let i = this.tableData.length - 1; i > findInd; i--) {
        ;[this.tableData[i].serialNum, this.tableData[i - 1].serialNum] = [
          this.tableData[i - 1].serialNum,
          this.tableData[i].serialNum
        ]
      }
      let spliceItem = this.tableData.splice(findInd, 1)
      spliceItem[0].serialNum = temp
      this.tableData.push(...spliceItem)
    },

    select(s, row) {
      this.selectData = s
    },
    /**
     * @description: 保存按钮点击事件
     * @param {type} 无
     * @return {type} 无
     */
    saveBtnHandler() {
      let funPromise = []
      this.tableData.map(item => {
        let params = { id: item.id, serialNum: item.serialNum }
        console.log(params)
        let funChild = fireInterface.comBustibleUpDateHost(params)
        funPromise.push(funChild)
      })
      Promise.all(funPromise)
        .then(_ => {
          this.$notify.success({
            message: '排序成功',
            title: '成功'
          })
          this.cancleBtnHandler()
        })
        .catch(() => {
          this.$notify.error({
            message: '排序失败',
            title: '失败'
          })
        })
    },
    /**
     * @description: 取消按钮点击事件
     * @param {type} 无
     * @return {type} 无
     */
    cancleBtnHandler() {
      this.$parent.getQueryData(this.$parent.defaultParams)
      this.$parent.isShowDetail = 'list'
      this.$parent.fireSelection = []
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive', // 页面title
      sidebarActiveId: 'sidebarActiveId' // 页面类型id
    })
  }
}
</script>

<style lang="less" scoped>
.sort-container {
  width: 100%;
  height: 100%;
  padding-left: 22px;

  .header {
    color: #333333;
    margin: 23px 0;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .main {
    width: 800px;
    height: 800px;
    padding-top: 10px;
    .button-box {
      width: 360px;
      margin: 20px auto;
      display: flex;
      justify-content: space-around;
    }
    .table-container {
      width: 100%;
    }
    .oper-btn-box {
      width: 180px;
      margin: 20px auto;
    }
  }
}
</style>
