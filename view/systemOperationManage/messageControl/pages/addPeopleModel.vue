<template>
  <div class="relevance-common">
    <el-dialog :visible.sync="addDialogVisible" width="45%" :before-close="close" :close-on-click-modal="false">
      <div class="transfer-box">
      <div class="tab-content">
        <div class="left-tree-box">
          <div style="text-align:center;">选择短信接收人</div>
          <div class="tree-box">
            <treeBox ref="treebox"
              :lazyTreeApi="getTreeApi"
              searchType="filter" :verifyLastNode="verifyLastNode" @checkclick="checkclick"
              :disabledTreeItem="disabledTreeItem"
              treeLazyToggle  checkboxToggle>
            </treeBox>
          </div>
        </div>
        <div class="icon-box">
          <i class="el-icon-right" @click="addLinks"></i>
          <i class="el-icon-back" @click="reduceLinks"></i>
        </div>
        <div style="flex:1">
          <div style="text-align:center;">已选短信接收人</div>
          <div class="tree-box-left">
            <ul>
              <li class="treeInfo" :class="[index%2===0 ? 'odd' : '']"  v-for="(item,index) in targetData" :key="index">
                <div class="treeText" :title="item.name">{{ item.name }}</div>
                <div class="treeText" :title="item.mobilePhone">{{ item.mobilePhone }}</div>
                <div class="treeText" :title="item.orgName">{{ item.orgName }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:24px">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserLoadingTree } from '@src/http/systemOperationManage/messageControl.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  name: 'addPeopleModel',
  props: {
    addDialogVisible: {
      type: Boolean,
      default: false
    },
    alreadyPeo: {
      type: Array,
      default: () => []
    }
  },
  components: {
    treeBox
  },
  data() {
    return {
      // 自定义懒加载树最终节点
      verifyLastNode: {
        tierType: 'user'
      },
      addPeopleArray: [],
      targetData: [
      ]
    }
  },
  computed: {
  },
  created() {
    this.targetData = JSON.parse(JSON.stringify(this.alreadyPeo))
  },
  methods: {
    getTreeApi(params) {
      params.isRoot = true
      if (params.hasOwnProperty('oId')) {
        params.isRoot = false
        params.orgId = params.oId
      }
      delete params.type
      delete params.oId
      return getUserLoadingTree(params)
    },
    checkclick(node, data, status) {
      console.log(node, data)
      this.addPeopleArray = []
      if (data.length) {
        data.forEach(item => {
          this.addPeopleArray.push(item)
        })
      }
    },
    disabledTreeItem(data) { // 默认复选框禁用
      let tierTypeData = ['loc', 'org', 'equ']
      return tierTypeData.includes(data['tierType'])
    },
    save() {
      if (this.targetData.length !== 0) {
        this.$emit('dialogVisible')
        this.$emit('addPeople', this.targetData)
      } else {
        return this.$messageError('请选择要添加的人员')
      }
    },
    cancel() {
      this.$emit('dialogVisible')
    },
    close() {
      this.$emit('dialogVisible')
    },
    addLinks() { // 右移
      if (this.addPeopleArray.length === 0) {
        return this.$messageError('请选择要添加的人员')
      }
      if (this.targetData.length === 0) {
        this.targetData = this.addPeopleArray
      } else {
        this.addPeopleArray.forEach((item, index) => {
          this.targetData.forEach((it, i) => {
            if (this.addPeopleArray[index].id !== this.targetData[i].id) {
              this.targetData.push(this.addPeopleArray[index])
            } else {
              return false
            }
          })
        })
      }
      let newobj = {} // 对象去重   防止重复添加
      this.targetData = this.targetData.reduce((preVal, curVal) => {
        newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal)
        return preVal
      }, [])
    },
    reduceLinks() { // 左移
      this.targetData = []
    }
  }
}

</script>
<style lang='less' scoped>
.relevance-common {
  width: 100%;
  height: 100%;
  display: flex;
  .transfer-box {
    width: 821px;
    height: 100%;
    padding: 10px 5px;
    border: 1px solid #333;
    .tab-content {
      width: 100%;
      height: 100%;
      display: flex;
      .left-tree-box {
        flex: 1;
      }
      .tree-box {
        width: 276px;
        height: 500px;
        margin: 0 auto;
        overflow-y: auto;
        border: 1px solid #E1E1E1;
      }
      .tree-box-left {
        width: 380px;
        height: 500px;
        overflow-y: auto;
        .odd {
            background: #F1F1F1;
          }
        .treeInfo {
          display: flex;
          width: calc(~'100% - 2px');
          .treeText {
            width: 100%;
            height: 30px;
            border-right: 1px solid #fff;
            line-height: 30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
          }
        }
      }
      .icon-box {
        width: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        i {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
