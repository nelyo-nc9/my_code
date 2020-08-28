<template>
  <div class="migtate-container">
    <div class="left-tree">
      <treeBox style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick2"></treeBox>
    </div>
    <div class="mer-container" id="mer">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>音频管理</el-breadcrumb-item>
        <el-breadcrumb-item>对讲平台管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="create_look">新建</el-breadcrumb-item>
        <el-breadcrumb-item v-else>列表</el-breadcrumb-item>
        <el-breadcrumb-item>迁移</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="merGe">
        <!-- 迁移源 -->
        <div class="merInfo">
          <p class="mergeInfoTitle">迁移源</p>
          <div class="left-tree-box">
            <div class="tree-box">
              <ul v-for="item in selectAllData" :key="item.id" :title="item.name"> 
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

        <!-- 迁移目标 -->
        <div class="tree">
          <p  class="mergeInfoTitle">迁移目标</p>
          <div class="tree-container">
            <treeBox
              :lazyTreeApi="getAudioTreeApi"
              searchType="search"
              :lazyTreeSearchApi="getLazyTreeSearchApi"
              :treeType="treeType"
              @onceClick="onceClick"
              treeLazyToggle
              iconToggle></treeBox>
          </div>
        </div>

      </div>

      <div class="viewVBtnss">
        <el-button @click="save" type="primary" size="mini">保存</el-button>
        <el-button @click="closure" size="mini">关闭</el-button>
      </div>
    </div>
  </div>
  
</template>

<script type="text/ecmascript-6">
import { getMove } from '../../../../../http/audioManage/talkback.api'
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import treeBox from '@src/components/tree/treeBox'
export default {
  components: {
    // TabMenu: () => import('../../components/tabMenu'),
    treeBox
  },
  data() {
    return {
      treeType: 2,
      currentOrg: '',
      keyPartId: '',
      keyPartType: '',

      create_look:false,  // 当新建-查看页面跳转过来的时候为true
    }
  },
  props: {
    selectAllData: {
      type: Array,
      default: () => {
        return []
      },
    },
    pagetype: {
      type: String
    },
  },
  methods: {

    // 机构资源树
    getAudioTreeApi (params) {
      return getAudioTreeApi (params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },
    
    closure() {
       // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
      if(this.create_look){
        this.$emit('modelChange','examinelook',this.selectAllData[0])
      }else{
        this.$emit('modelChange','List')
      }
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
    onceClick2(data, node) { 
    },

    // 迁移 保存
    save() {
       if(!this.currentOrg){
        this.$message({
          message: '请选择迁移目标',
          type: 'warning'
        });
        return false;
      }
      let ids = this.selectAllData.map((i) => i.id)
      let params = {
        ids,
        orgId: this.currentOrg,
      }
      if (this.keyPartId) {
        params['keyPartId'] = this.keyPartId
        params['keyPartType'] = this.keyPartType
      }
        getMove(params).then((res) => {
          if (res.data.code === 0) {
            // this.selectAllData = []
            // this.currentOrg = ''
            // this.keyPartId = ''
            // this.keyPartType = ''
            this.$notify({
              title: '成功',
              message: '迁移成功',
              type: 'success',
              position: 'top-right',
            })
            
            // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
            if(this.create_look){
              this.$emit('modelChange','examinelook',this.selectAllData[0]);
            }else{
              this.$emit('modelChange','List')
            }

          }else{
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
        })
    },

    checkedSource(val) {
      this.checkList = this.$lodash.cloneDeep(val)
    },

  },
  created(){
    // 判断如果是 新建-查看 页面 跳转过来 的 需要 在页头 显示新建
    if(this.pagetype && this.pagetype == 'examinelook'){
      this.create_look = true;
    }

  },
  mounted() {
  },
}
</script>

<style lang="less" scoped>
.migtate-container{
  width: 100%;
  display: flex;
  display: -webkit-flex;
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
  margin-top:30px;
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
