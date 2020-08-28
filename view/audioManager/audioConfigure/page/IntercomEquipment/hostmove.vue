<template>
  <div id="mer" class="migtate-container">
    <!-- <div class="container-title">对讲设备迁移</div> -->
    <div class="merGe">
      <div class="merInfo">
        <p class="mergeInfoTitle">迁移源</p>
        <div class="left-tree-box">
          <div class="tree-box">
            <ul v-for="item in migrantData" :key="item.id" :title="item.name"> 
              <li>
                <i>对讲平台名称</i>
                <span>{{item.name}}</span>
              </li>
              <li>
                <i>设备编码</i>
                <span>{{item.assetCode}}</span>
              </li>
              <li>
                <i>所属重点部位</i>
                <span>{{item.keyPartName}}</span>
              </li>
              <li>
                <i>所属机构</i>
                <span>{{item.orgName}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="tree">
        <p  class="mergeInfoTitle">迁移目标</p>
        <div class="tree-container">
          <treeBox
            :lazyTreeApi="getAudioTreeApi"
            searchType="filter"
            :treeType="treeType"
            @onceClick="onceClick"
            treeLazyToggle
            iconToggle></treeBox>
        </div>
      </div>
    </div>
    <div class="viewVBtnss">
      <el-button @click="save" size="mini">保存</el-button>
      <el-button @click="closure" size="mini">关闭</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { gethostMove } from '../../../../../http/audioManage/talkback.api'
import { getAudioTreeApi } from '../../../../../http/audioManage/audioTree.api'
import treeBox from '@src/components/tree/treeBox'
export default {
  components: {
    treeBox: () => import('@src/components/tree/treeBox'),
  },
  data() {
    return {
      treeType: 2,
      currentOrg: '',
      keyPartId: '',
      keyPartType: '',
    }
  },
  props: {
    migrantData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  methods: {
    // 机构树 api
    getAudioTreeApi (params) {
      return getAudioTreeApi (params)
    },
    
    // 机构树 点击
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

    // 保存
    save() {
      if(!this.currentOrg){
        this.$message({
          message: '请选择迁移目标',
          type: 'warning'
        });
        return false;
      }
      let ids = this.migrantData.map((i) => i.id)
      let params = {
        ids,
        orgId: this.currentOrg,
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
       gethostMove(params).then((res) => {
          if (res.data.code === 0) {
            // this.migrantData = []
            this.currentOrg = ''
            this.keyPartId = ''
            this.keyPartType = ''
            this.$notify({
              title: '成功',
              message: '迁移成功',
              position: 'top-right',
              type: 'success',
            })
            this.$emit(
              'closeMove'
            )
            this.$parent.getTalkbackHost()
          }
        })
    },

    // 取消
    closure() {
      this.$emit('closeMove')
    },

  },
  created(){
    console.log(this.migrantData);
  },
  mounted() {
    // this.migrantData = []
  },
}
</script>

<style lang="less" scoped>
.migtate-container{
  // width: 100%;
  // display: flex;
  // display: -webkit-flex;
}
.left-tree {
  width: 290px;
  border-right: 1px solid #e1e1e1;
}
.mer-container {
  height: 100%;
  padding:6px 20px;
  flex:1;
}
.merGe {
  width:955px;
  font-size: 12px;
  // margin-top:30px;
  // border: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  .merInfo {
    width:460px;
    .mergeInfoTitle {
      line-height: 12px;
      border-left: 2px solid #2D71D3;
      padding-left:10px;
      margin:15px 0;
    }
    
    .tree-box{
      height:551px;
      padding: 5px;
      border: 1px solid #e6e6e6;
      ul {
        li {
          text-align: center;
          display: flex;
          line-height: 31px;
          border-bottom: 1px solid #e6e6e6;
          &:nth-child(1) {
            border-bottom: 1px solid #e6e6e6;
          }
          &:last-child {
            border: none;
          }
          i {
            width: 40%;
            height: 30px;
            background: #e6e6e6;
          }
          span {
            text-align: left;
            flex:1;
            padding-left:34px;
          }
        }
      }
    }
  }

  // 迁移目标
  .tree {
    width:460px;
    height: 598px;
    overflow: hidden;
    text-align: left;
    .mergeInfoTitle {
      line-height: 12px;
      border-left: 2px solid #2D71D3;
      padding-left:10px;
      margin:15px 0;
    }
    .tree-container{
      height:551px;
      padding: 5px;
      border: 1px solid #e6e6e6;
    }
  }
}
.viewVBtnss {
  width:955px;
  margin:20px 0;
  text-align: center;
  /deep/.el-button--mini{
    width:93px;
  }
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
    &:hover {
      background-color: #e5f0ff;
      border-left: 3px solid #2d72d3;
    }
  }
}
</style>
