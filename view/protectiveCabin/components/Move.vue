<template>
  <div class="main">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
        <el-breadcrumb-item class="active">迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main-content">
      <div class="move-tree">
        <div class="move-box">
          <span class="title">迁移源</span>
          <div class="tree-box">
            <p v-for="item in migrantData"
               :key="item.id"
               style="margin-bottom: 5px;">{{item.name}}</p>
          </div>
        </div>
        <div class="move-box">
          <span class="title">迁移目标</span>
          <div class="tree-box">
            <treeBox :lazyTreeApi="getTreeApi"
                     searchType="search"
                     :lazyTreeSearchApi="getLazyTreeSearchApi"
                     :treeType="treeType"
                     @onceClick="onceClick"
                     treeLazyToggle
                     iconToggle></treeBox>
          </div>
        </div>
      </div>
      <div class="form-footer"
           slot="footer">
        <el-button type="primary"
                   size="mini"
                   style="margin-right:24px;"
                   @click="save">保存</el-button>
        <el-button size="mini"
                   @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { moveHostApi, listInfoApi, orgKeypart } from '@src/http/protectiveCabin/channe.api'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'Move',
  props: {
    type: {
      type: String,
    },
    migrantData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  components: {
    treeBox,
  },
  computed: {},
  data() {
    return {
      treeType: 2,
      checkList: [],
      currentOrg: '',
      keyPartId: '',
      keyPartType: '',
    }
  },
  created() {
    for (let i = 0; i < this.migrantData.length; i++) {
      this.checkList.push(this.migrantData[i].id)
    }
  },
  methods: {
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 5,
        key: params.search,
      }
      return orgKeypart(params)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.$confirm('是否取消迁移?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (this.type === '1') {
            this.$parent.moveShow = false
            this.$parent.getHosts()
            this.$parent.multipleSelection = []
          } else {
            this.$parent.moveShow = true

            // this.$parent.deviceData =
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '成功',
          })
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
    // checkedSource(val) {
    //   this.checkList = this.$lodash.cloneDeep(val)
    // },
    moveSave() {
      let params = {
        ids: this.checkList,
        orgId: this.currentOrg,
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
      moveHostApi(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$messageSuccess('迁移成功')
            if (this.type === '1') {
              this.$parent.moveShow = false
              this.$parent.getHosts()
              this.$parent.multipleSelection = []
            } else {
              this.$parent.getMessage()
              this.$parent.moveShow = true
              // this.$parent.deviceData =
            }
          } else {
            this.$messageError('迁移失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消迁移',
          })
        })
    },
    save() {
      this.migrantData.forEach((item) => {
        if (item.orgId !== this.currentOrg) {
          this.$confirm('不同机构下迁移请确认是否迁移?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.moveSave()
          })
        } else {
          this.moveSave()
        }
      })
      return
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .header {
    padding: 17px 0 21px;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .main-content {
    width: 100%;
    .move-tree {
      width: 100%;
      display: flex;
      .move-box {
        width: 460px;
        margin-bottom: 23px;
        .title {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-left: 7px;
          position: relative;
          margin-bottom: 17px;
          display: inline-block;
          width: 100%;
        }
        .title::before {
          content: '';
          width: 2px;
          height: 12px;
          display: block;
          background: #2d72d3;
          position: absolute;
          left: -7px;
          top: 2.5px;
        }
        .tree-box {
          width: 100%;
          height: 551px;
          background: rgba(245, 245, 245, 0);
          border: 1px solid rgba(225, 225, 225, 1);
          padding: 20px;
          box-sizing: border-box;
          overflow: auto;
          p {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 19px;
          }
        }
      }
      .move-box:first-child {
        margin-right: 36px;
      }
    }
    .form-footer {
      width: 956px;
      text-align: center;
      /deep/ .el-button {
        width: 93px;
        height: 35px;
      }
    }
  }
}
</style>
