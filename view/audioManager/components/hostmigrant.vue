<template>
    <el-dialog title="迁移设备" :visible.sync="flag" width="800px" :before-close="cancel" :close-on-click-modal="false">
        <div class="tab-content">
            <div class="left-tree-box">
                <div style="text-align:center;">源</div>
                <div class="tree-box">
                    <el-checkbox-group v-model="checkList" @change="checkedSource">
                        <el-checkbox v-for="item in migrantData" :key="item.id"
                        :label="item.id" style="display: block;margin: 10px 5px;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="left-tree-box">
                <div style="text-align:center;">目标</div>
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
    </el-dialog>
</template>

<script>
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import { gethostMove } from '../../../http/audioManage/talkback.api'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'Migrant',
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
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.$emit('cancle')
    },
    onceClick(data) {
      if (data.tierType === 'org') {
        this.currentOrg = data.id.toString()
        this.keyPartId = ''
      } else {
        this.currentOrg = data.orgId
        this.keyPartId = data.id.toString()
        this.keyPartType = data.keyPartType
      }
    },
    checkedSource(val) {
      this.checkList = this.$lodash.cloneDeep(val)
    },
    save() {
      let params = {
        ids: this.checkList,
        orgId: this.currentOrg,
        keyPartId:this.keyPartId
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
      gethostMove(params).then(res => {
        if (res.data.code === 0) {
          this.checkList = []
          this.currentOrg = ''
          this.keyPartId = ''
          this.keyPartType = ''
          this.$emit('cancle')
          this.$parent.getTalkbackHost()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
    border: 1px solid #E1E1E1;
  }
}
</style>
