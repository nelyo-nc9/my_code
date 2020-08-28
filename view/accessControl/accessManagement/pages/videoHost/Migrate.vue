<template>
  <div id="mer">
    <!-- <TabMenu :tabList="tabList" /> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
      <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
      <el-breadcrumb-item>门禁平台配置</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
      <el-breadcrumb-item>迁移</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="merGe">
      <div class="floatBox">
        <div class="left">
          <p>迁移源</p>
          <div class="merInfo">
            <div class="left-tree-box">
              <div class="tree-box">
                <div
                  v-for="(item, index) in migrantData"
                  :key="item.id"
                  :title="item.name"
                  class="item"
                  @click="SelectedNode(index)"
                  :class="{ SelectedNode: Index == index }"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <p>迁移目标</p>
          <div class="tree">
            <treeBox
              :lazyTreeApi="getTreeApi"
              :treeType="treeType"
              @onceClick="onceClick"
              treeLazyToggle
              iconToggle
            
            ></treeBox>
              
            <!--  checkboxToggle :disabledTreeItem="disabledTreeItem" -->
          </div>
        </div>
      </div>
      <div class="viewVBtnss">
        <el-button @click="save" size="mini" type="primary">保存</el-button>
        <el-button @click="closure" size="mini">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { terraceMigrate, HostTerraceMigrate } from '@src/http/access/accessMan'
import { getTreeApi, getAccessList } from '@src/http/access/accessMan'
import treeBox from '@src/components/tree/treeBox'
export default {
  components: {
    TabMenu: () => import('../../components/tabMenu'),
    treeBox: () => import('@src/components/tree/treeBox'),
  },
  data() {
    return {
      treeType: 2,
      currentOrg: '',
      keyPartId: '',
      keyPartType: '',
      datas: [],
      Index: null,
      keyPartName:'',
      filterText:'',
    }
  },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    migrantData: {
      type: Array,
      default: () => {
        return []
      },
    },
    HostOrPlorm: {
      type: String,
      default: () => 'default',
    },
    toList: {
      type: Boolean,
      default: () => true,
    },
  },
  methods: {
     /**
    * @description: 迁移机构数复选框
    * @param {type}:
    * @type:
    * @return:
    */
    disabledTreeItem(data){
      // let name = data.name
    //  console.log('aaaaaaaaaaaa',data);
      // return  data['tierType'] === 'org'

    },
    /**
     * @description: 选中节点 style处理
     * @param {type}: index
     * @type: 无
     * @return: 无
     */
    SelectedNode(Index) {
      this.Index = Index
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    cancel() {
      this.$emit('cancle')
      this.datas = []
    },
    onceClick(data) {
      if (data.tierType === 'org') {
        this.currentOrg = data.id.toString()
      } else {
        this.disabledTreeItem(data.name)
        this.currentOrg = data.orgId
        this.keyPartId = data.id.toString()
        this.keyPartType = data.keyPartType
        this.keyPartName = data.name


      }
    },
    save() {
      let ids = this.migrantData.map((i) => i.id)
      let params = {
        ids,
        orgId: this.currentOrg,
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
      if (this.HostOrPlorm == 'Host') {
           this.$confirm(`是否确认迁移至${this.keyPartName}？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
             HostTerraceMigrate(params).then((res) => {
          if (res.data.code === 0) {
            // this.migrantData = []
            this.currentOrg = ''
            this.keyPartId = ''
            this.keyPartType = ''
            this.$notify({
              title: '成功',
              message: '迁移成功',
              type: 'success',
            })
            this.$emit(
              'modelChange',
              {
                ParerntFlag: true,
                CurrtTitle: '列表',
              },
              'Create'
            )
            if (this.toList) {
              this.$parent.getList()
            }
            this.datas = []
          }
        })
          })
          .catch(() => {
            this.$messageSuccess('取消成功')
          })

      } else {
                 this.$confirm(`是否确认迁移至${this.keyPartName}？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
          terraceMigrate(params).then((res) => {
          if (res.data.code === 0) {
            // this.migrantData = []
            this.currentOrg = ''
            this.keyPartId = ''
            this.keyPartType = ''
            this.$notify({
              title: '成功',
              message: '迁移成功',
              type: 'success',
            })
            this.$emit(
              'modelChange',
              {
                ParerntFlag: true,
                CurrtTitle: '列表',
              },
              'Create'
            )
            if (this.toList) {
              this.$parent.dbGetList()
            }
            this.datas = []
          }
        })
          })
          .catch(() => {
            this.$messageSuccess('取消成功')
          })

      }
    },
    checkedSource(val) {
      this.checkList = this.$lodash.cloneDeep(val)
    },
    closure(a) {
      this.$emit(
        'modelChange',
        {
          ParerntFlag: true,
          CurrtTitle: '列表',
          closeMer: true,
        },
        'Create'
      )
    },
  },
  mounted() {
    this.datas = this.migrantData
  },
}
</script>

<style lang="less" scoped>
.merGe {
  margin: 30px 19px;
  .floatBox {
    overflow: hidden;
    .left {
      float: left;
      p {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 7px;
        margin-left: 7px;
        position: relative;

        &::after {
          position: absolute;
          width: 2px;
          height: 12px;
          background: #2d72d3;
          content: '';
          display: block;
          left: -4px;
          top: 50%;
          transform: translateY(-40%);
        }
      }
      .merInfo {
        margin-top: 20px;
        padding: 20px;
        padding-bottom: 0px;
        width: 460px;
        height: 551px;
        text-align: center;
        margin-right: 1px;
        background: rgba(245, 245, 245, 0);
        border: 1px solid rgba(225, 225, 225, 1);
        ul {
          li {
            line-height: 20px;
            text-align: left;
            padding: 5px;
            &:first-child {
              margin-top: 10px;
              span {
                text-align: left;
              }
            }
          }
        }
        /deep/ .el-checkbox {
          text-align: left;
        }
      }
    }
    .right {
      float: left;
      margin-left: 36px;
      p {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 17px;
        margin-left: 7px;
        padding-left: 7px;
        position: relative;
        &::after {
          position: absolute;
          width: 2px;
          height: 12px;
          background: #2d72d3;
          content: '';
          display: block;
          left: -4px;
          top: 50%;
          transform: translateY(-40%);
        }
      }
      .tree {
        width: 460px;
        height: 551px;
        overflow: hidden;
        text-align: left;
        background: rgba(245, 245, 245, 0);
        border: 1px solid rgba(225, 225, 225, 1);
        padding: 20px;
        padding-bottom: 0px;
      }
    }
  }
  .viewVBtnss {
    margin-top: 20px;
  }
}

#mer {
  height: 100%;
  // width: 450px;
}
.left-tree-box {
}
.tree-box {
  overflow-y: auto;
  padding: 0 5px;
  .item {
    text-align: left;
    width: 100%;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 10px;

    &:hover {
      background-color: #e5f0ff;
      border-left: 3px solid #2d72d3;
    }
  }
  .SelectedNode {
    color: #2d72d3;
  }
}
</style>
