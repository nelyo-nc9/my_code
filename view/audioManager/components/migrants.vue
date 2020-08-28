<template>
    <el-dialog title="迁移设备" :visible.sync="flag" width="800px" :before-close="cancel" :close-on-click-modal="false">
        <div class="tab-content">
            <div class="left-tree-box">
                <div style="text-align:center;">源</div>
                <div class="tree-box">
                    <div v-for="item in abs" :key="item.id" :title="item.name" class="item">
                    {{item.name}}
                  </div>
                </div>
            </div>
            <div class="left-tree-box">
                <div style="text-align:center;">目标</div>
                <div class="tree-box">
                <treeBox :lazyTreeApi="getAudioTreeApi"
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
import { getAudioTreeApi  } from '../../../http/audioManage/audioTree.api'
import { getMove } from '../../../http/audioManage/talkback.api'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: '',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    abs: {
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
    getAudioTreeApi (params) {
      return getAudioTreeApi (params)
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

    save() {
       let ids = this.abs.map(i => i.id)
      let params = {
        ids,
        orgId: this.currentOrg,
        // keyPartId:this.keyPartId
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
      getMove(params).then(res => {
        if (res.data.code === 0) {
         
          this.currentOrg = ''
          this.keyPartId = ''
          this.keyPartType = ''
          this.$parent.getTalkback()
          this.$emit('cancle')

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
</style>
