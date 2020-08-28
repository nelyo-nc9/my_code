<template>
  <div class="sort-container">
    <!-- 面包屑 -->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
        <el-breadcrumb-item class="active">排序</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main">
      <div class="button-box">
        <el-button size="small" icon="el-icon-sort-up" @click="up">上移</el-button>
        <el-button size="small" icon="el-icon-sort-down" @click="down">下移</el-button>
        <el-button size="small" icon="el-icon-arrow-up" @click="setUp">置顶</el-button>
        <el-button size="small" icon="el-icon-arrow-down" @click="setDown">置底</el-button>
      </div>
      <div class="sort-box">
        <div class="table-container">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @select-all="select"
            height="calc(100% - 50px)"
            max-height="540"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="index" label="序号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column prop='name' label="设备名称" align="center"> </el-table-column>
            <el-table-column prop='assetCode' label="资产编码" align="center"> </el-table-column>
          </el-table>
        </div>
        <div class="oper-btn-box">
          <el-button size="small" type="primary" @click="saveBtnHandler">保存</el-button>
          <el-button size="small" @click="cancleBtnHandler">取消</el-button>
        </div>
      </div>
      <!-- <div class="table-container">
        <el-table
          stripe
          border
          size="medium"
          :data="tableData"
          @select="select"
          @select-all="select"
          height="calc(100% - 50px)"
          max-height="805"
          style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="index" label="序号" type="index" width="80" align="center"> </el-table-column>
          <el-table-column prop='name' label="设备名称" align="center"> </el-table-column>
          <el-table-column prop='assetCode' label="资产编码" align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="oper-btn-box">
        <el-button size="small" type="primary" @click="saveBtnHandler">保存</el-button>
        <el-button size="small" @click="cancleBtnHandler">取消</el-button>
      </div> -->
    </div>

    <!-- 确认框 -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="showConfirmDialog"
      width="450px"
      class="confirm-opendoor-dialog">

      <p style="marginLeft: 20px; fontSize: 16px;">请确定放弃保存正在编辑的内容吗？</p>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancleBtnHandler">确 定</el-button>
        <el-button @click="showConfirmDialog = false">取 消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { setSortHostSerialApi } from '@src/http/video/videoConfig.api.js'
import {Msg} from '@src/http/messageOnce'

export default {
  props: {
    sortData: {
      type: Array,
      default: function() {
        return []
      }
    },
    come: {
      type: String
    }
  },
  components: {
  },
  data() {
    return {
      tableData: [],
      selectData: [],
      showConfirmDialog: false
    }
  },
  created() {
    this.tableData = this.$lodash.cloneDeep(this.sortData)
  },
  methods: {
    // 上移
    up() {
      if (this.selectData.length !== 1) {
        Msg({ t: 'w', mg: '请勾选(仅可)一条进行排序', tit: '', set: 50 })
        return false
      }
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === 0) {
        return
      }
      [this.tableData[findInd].serialCode, this.tableData[findInd - 1].serialCode] = [this.tableData[findInd - 1].serialCode, this.tableData[findInd].serialCode]
      let spliceItem = this.tableData.splice(findInd, 1)
      this.tableData.splice(--findInd, 0, ...spliceItem)
    },
    // 下移
    down() {
      if (this.selectData.length !== 1) {
        Msg({ t: 'w', mg: '请勾选(仅可)一条进行排序', tit: '', set: 50 })
        return false
      }
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === this.tableData.length - 1 || this.tableData.length === 1) {
        return
      }
      [this.tableData[findInd].serialCode, this.tableData[findInd + 1].serialCode] = [this.tableData[findInd + 1].serialCode, this.tableData[findInd].serialCode]
      let spliceItem = this.tableData.splice(findInd, 1)
      this.tableData.splice(++findInd, 0, ...spliceItem)
    },
    // 置顶
    setUp() {
      if (this.selectData.length !== 1) {
        Msg({ t: 'w', mg: '请勾选(仅可)一条进行排序', tit: '', set: 50 })
        return false
      }
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === 0) {
        return
      }
      let temp = this.tableData[0].serialCode
      for (let i = 0; i < findInd; i++) {
        [this.tableData[i].serialCode, this.tableData[i + 1].serialCode] = [this.tableData[i + 1].serialCode, this.tableData[i].serialCode]
      }
      let spliceItem = this.tableData.splice(findInd, 1)
      spliceItem[0].serialCode = temp
      this.tableData.unshift(...spliceItem)
    },
    // 置底
    setDown() {
      if (this.selectData.length !== 1) {
        Msg({ t: 'w', mg: '请勾选(仅可)一条进行排序', tit: '', set: 50 })
        return false
      }
      let findInd = this.tableData.findIndex(item => item.id === this.selectData[0].id)
      if (findInd === this.tableData.length - 1 || this.tableData.length === 1) {
        return
      }
      let temp = this.tableData[this.tableData.length - 1].serialCode
      for (let i = this.tableData.length - 1; i > findInd; i--) {
        [this.tableData[i].serialCode, this.tableData[i - 1].serialCode] = [this.tableData[i - 1].serialCode, this.tableData[i].serialCode]
      }
      let spliceItem = this.tableData.splice(findInd, 1)
      spliceItem[0].serialCode = temp
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
      let params = this.tableData.map(item => ({id: item.id, serialCode: item.serialCode}))
      setSortHostSerialApi({sequences: params})
        .then(res => {
          if (res.data && res.data.code === 0) {
          } else {
            throw res.data.message
          }
        }).then(_ => {
          Msg({ t: 's', mg: '排序成功', tit: '', st: 1200, set: 50 })
          let timer = setTimeout(_ => {
            if (this.come === 'create') {
            } else {
              // this.$parent.getTableList()
            }
            this.$parent.migrant = false
            this.$parent.showContent = ''
          }, 1500)
          this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
        }).catch(err => {
          Msg({ t: 'e', mg: err, tit: '', st: 1200, set: 50 })
        })
    },
    /**
     * @description: 取消按钮点击事件
     * @param {type} 无
     * @return {type} 无
     */
    cancleBtnHandler() {
      this.$confirm('请确定放弃正在编辑的内容吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        type: 'warning'
      }).then(() => {}).catch(() => {
        this.$parent.migrant = false
        this.$parent.showContent = ''
      })
      // this.$parent.selectData = []
    }
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
.sort-container {
  width: 100%;
  height: 100%;
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  .header {
    color: #333333;
    margin: 23px 0;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2D72D3;
        }
      }
    }
  }
  .main {
    flex: 1;
    width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    overflow: auto;
    .button-box {
      width: 360px;
      height: 75px;
      display: flex;align-items: center;
      justify-content: space-around;
      overflow: hidden;
    }
    .sort-box{
      flex: 1;
      width: 100%;
      overflow: auto;
      .table-container {
        width: 100%;
        overflow: hidden;
      }
      .oper-btn-box {
        width: 180px;
        height: 75px;
        margin: 0 auto;
        display: flex;align-items: center;
        justify-content: space-around;
        overflow: hidden;
      }
    }
  }
}
</style>
