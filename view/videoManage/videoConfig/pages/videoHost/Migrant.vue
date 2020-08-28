<template>
  <div class="migrant-container">
    <!-- 面包屑 -->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item class="active">迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="migrant-box">
        <div class="left-tree-box">
          <div style="text-align:center; fontSize: 16px; marginBottom: 20px;">迁移源</div>
          <div class="tree-box">
            <div v-for="item in migrantData" :key="item.id" :title="item.name" class="item">
                {{item.name}}
            </div>
          </div>
        </div>
        <div class="left-tree-box">
          <div style="text-align:center; fontSize: 16px; marginBottom: 20px;">迁移目标</div>
          <div class="tree-box" style="overflow: hidden;">
            <treeBox :lazyTreeApi="getTreeApi"
                searchType="filter" ref="tree"
                :treeType="treeType"
                @onceClick="onceClick" @clickData="clickData"
                treeLazyToggle iconToggle></treeBox>
          </div>
        </div>
      </div>
      <div class="oper-btn-box">
        <el-button size="small" type="primary" @click="save">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
    <!-- 确认框 -->
    <!-- <el-dialogshowConfirmDialog = true
      title="提示"
      :visible.sync="showConfirmDialog"
      width="450px"
      class="confirm-opendoor-dialog">

      <p style="marginLeft: 20px; fontSize: 16px;">请确定放弃保存正在编辑的内容吗？</p>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="showConfirmDialog = false">取 消</el-button>
      </span>
    </el-dialogshowConfirmDialog> -->
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { putHostTransferApi } from '@src/http/video/videoConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'Migrant',
  props: {
    migrantData: {
      type: Array,
      default: () => {
        return []
      }
    },
    come: {
      type: String
    }
  },
  components: {
    treeBox
  },
  computed: {},
  data() {
    return {
      treeType: 2,
      currentOrg: '',
      keyPartId: '',
      keyPartType: '',
      showConfirmDialog: false
    }
  },
  created() {
  },
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      // this.$emit('cancle')
      this.$confirm('请确定放弃正在编辑的内容吗?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '取消',
        cancelButtonText: '确定',
        type: 'warning'
      }).then(() => {}).catch(() => {
        if (this.come === 'create') {
          this.$parent.migrant = false
        } else {
          this.$parent.selectData = []
        }
        this.$parent.showContent = this.come
      })
    },
    onceClick(data) {
      if (data.tierType === 'org') {
        this.currentOrg = data.id.toString()
      } else {
        this.currentOrg = data.orgId
        this.keyPartId = data.id.toString()
        this.keyPartType = data.keyPartType
      }
    },
    save() {
      let params = {
        orgId: this.currentOrg,
        keyPartId: this.keyPartId,
        keyPartType: this.keyPartType
      }
      for (let i in params) {
        if (i === 'orgId' && !params['orgId'].length) {
          this.$notify({
            title: '',
            message: '请选择迁移部位',
            type: 'warning'
          })
          return false
        } else if (i === 'keyPartId' && params['keyPartId'] === '') {
          this.$notify({
            title: '',
            message: '请选择迁移部位',
            type: 'warning'
          })
          return false
        }
      }
      params['ids'] = this.migrantData.map(i => i.id)
      putHostTransferApi(params).then(res => {
        if (res.data.code === 0) {
          this.currentOrg = ''
          this.keyPartId = ''
          this.keyPartType = ''
          // this.$emit('cancle')
        } else {
          throw res.data.message
        }
      }).then(_ => {
        this.$notify({
          title: '成功',
          message: '迁移成功',
          type: 'success'
        })
        let timer = setTimeout(_ => {
          if (this.come === 'create') {
            this.$parent.migrant = false
          } else {
            this.$emit('getTableList')
            this.$parent.selectData = []
          }
          this.$parent.showContent = this.come
        }, 1500)
        this.$once('hook:beforeDestroy', _ => clearTimeout(timer))
      }).catch(err => {
        this.$notify({
          title: '错误',
          message: err,
          type: 'error'
        })
      })
    },
    clickData(data) {
      // console.log(data)
      // if (data && data.nodeKey && data.isRoot) {
      //   this.$refs.tree.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
      // }
      // this.currentOrg = data.serial || data.serial
    }
  }
}
</script>

<style lang="less" scoped>
.migrant-container {
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
          color: #2D72D3;
        }
      }
    }
  }

  .main {
    width: 800px;
    height: 680px;
    padding-top: 10px;
    .migrant-box {
      width: 100%;
      height: 100%;
      display: flex;
      .left-tree-box {
        width: 46%;
        height: auto;
        margin-left: 10px;
      }
      .tree-box {
        height: 600px;
        border: 1px solid #E1E1E1;
        overflow-y: auto;
        padding: 0 5px;
        .item {
          width: 100%;
          height: 36px;
          line-height: 36px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            background-color: #E5F0FF;
            border-left: 3px solid #2D72D3;
          }
        }
      }
    }

    .oper-btn-box {
      width: 180px;
      margin: 20px auto;
    }
  }
}
</style>
