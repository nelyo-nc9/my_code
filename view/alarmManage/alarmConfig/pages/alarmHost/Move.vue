<template>
  <div class="main">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="main-content">
      <div class="tab-content">
        <div class="left-tree-box">
          <div style="text-align:center;">迁移源</div>
          <div class="tree-box" style="padding: 10px;">
            <p v-for="item in migrantData" :key="item.id" style="margin-bottom: 5px;">{{item.name}}</p>
          </div>
        </div>
        <div class="left-tree-box">
          <div style="text-align:center;">迁移目标</div>
          <div class="tree-box">
            <treeBox :lazyTreeApi="getTreeApi"
                searchType="filter"
                :treeType="treeType"
                @onceClick="onceClick"
                treeLazyToggle iconToggle></treeBox>
          </div>
        </div>
      </div>
      <div class="form-footer" slot="footer">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { putHostTransferApi } from '@src/http/video/videoConfig.api.js'
import treeBox from '@src/components/tree/treeBox'
import { mapActions } from 'vuex'
export default {
  name: 'Move',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    migrantData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    treeBox
  },
  computed: {},
  data() {
    return {
      treeType: 2,
      checkList: [],
      currentOrg: '',
      keyPartId: '',
      keyPartType: ''
    }
  },
  created() {
  },
  methods: {
    ...mapActions(['moveAlarmHost']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.$emit('update:moveShow', false)
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
      for (let i = 0; i < this.migrantData.length; i++) {
        this.checkList.push(this.migrantData[i].id)
      }
      let params = {
        ids: this.checkList,
        orgId: this.currentOrg
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
        this.moveAlarmHost(params).then(res => {
          this.$notify.success({
            title: '成功',
            message: '迁移成功'
          })
          this.checkList = []
          this.currentOrg = ''
          this.keyPartId = ''
          this.keyPartType = ''
          this.cancel()
          this.$emit('aginGetTable')
          this.$emit('aginGetSingleHost', this.migrantData[0].id)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$notify({ title: '警告', message: '请选择要迁移的重点部位', type: 'warning' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  .main-content {
    width: 800px;
    margin-top: 20px;
    text-align: center;
    .form-footer {
      margin-top: 20px;
    }
    .tab-content {
      width: 100%;
      height: 100%;
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
        border: 1px solid #E1E1E1;
      }
    }
  }
}
</style>
