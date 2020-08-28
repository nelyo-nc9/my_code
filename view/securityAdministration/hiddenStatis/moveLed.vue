<template>
  <div class="main">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               :treeType="treeType"
               searchType="filter"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
          <el-breadcrumb-item>LED设备配置</el-breadcrumb-item>
          <el-breadcrumb-item>迁移</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="main-content">
        <div class="tab-content">
          <div class="left-tree-box">
            <div style="text-align:center;">迁移源</div>
            <div class="tree-box"
                 style="padding: 10px;">
              <p v-for="(item,index) in moveData"
                 :key="index"
                 style="margin-bottom: 5px;">{{item.name}}</p>
            </div>
          </div>
          <div class="left-tree-box">
            <div style="text-align:center;">迁移目标</div>
            <div class="tree-box">
              <treeBox :lazyTreeApi="getTreeApi"
                       searchType="filter"
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
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'Move',
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      moveData: ({ tvWall }) => tvWall.moveData
    })
  },
  data() {
    return {
      treeType: 2,
      removelParams: {
        orgId: '',
        keyPartId: '',
        ids: {}
      }
    }
  },
  created() {
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE']),
    ...mapActions(['removalDecodingDevice']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.SET_COMPONENTID1('LedEditList')
    },
    onceClick(data, node) {
      // 迁移机构数点击
      if (data.tierType === 'org') {
        this.removelParams.orgId = data.id
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.removelParams.orgId = (parentNode.data && node.parent.data.id) || ''
        this.removelParams.keyPartId = data.id
      }
    },
    save() {
      // 发送迁移请求
      let removeId = []
      this.moveData.map(item => {
        removeId.push(item.id)
      })
      this.removelParams.ids = removeId
      if (this.removelParams.orgId && this.removelParams.keyPartId) {
        this.removalDecodingDevice(this.removelParams)
          .then(res => {
            if (res.data.code === 0) {
              this.SET_COMPONENTID1('LedEditList')
              this.succefullMethod('迁移成功')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.failureMethod('请选择要迁移的机构和重点部位')
      }
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
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
    .main-content {
      width: 800px;
      margin-top: 20px;
      text-align: center;
      .form-footer {
        margin-top: 20px;
      }
      .tab-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .left-tree-box {
          width: 48%;
          height: auto;
          margin-left: 10px;
        }
        .tree-box {
          height: 500px;
          text-align: left;
          border: 1px solid #e1e1e1;
        }
      }
    }
  }
}
</style>
