<template>
  <div class="main">
    <header>
     <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline"
            style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>音频管理</el-breadcrumb-item>
        <el-breadcrumb-item>对讲管理配置</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
     </el-breadcrumb>
    </header>
    <div class="main-content">
      <div style="margin: 30px 0;">对讲平台迁移</div>
      <div class="content-box">
        <div style="flex:1;margin-right:1px;height:500px;">
          <div class="title">迁移源信息</div>
          <div class="content-bottom">
            <!-- <div class="row">
              <div class="row-left">对讲子系统名称</div>
              <div class="row-right">{{formData.name}}</div>
            </div> -->
            <div class="row">
              <div class="row-left">设备编码</div>
              <div class="row-right">{{formData.assetCode}}</div>
            </div>
            <div class="row">
              <div class="row-left">所属机构</div>
              <div class="row-right">{{formData.orgName}}</div>
            </div>
            <div class="row">
              <div class="row-left">所属重点部位</div>
              <div class="row-right">{{formData.keyPartName}}</div>
            </div>
          </div>
        </div>
        <div style="flex:1">
          <div class="title">选择迁移目标</div>
          <div class="content-bottom">
              <orgTree style="width:254px" :lazyTreeApi="getTreeApi" searchType="filter" treeType='0' treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
          </div>
        </div>
      </div>
      <div style="margin-top: 24px;">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import orgTree from "@src/components/tree/treeBox"
import {getTreeApi} from "@src/http/audioManage/audioTree.api.js"
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    orgTree
  },
  data(){
     return{
       formData:{
         name:"",
         assetCode:"",
         orgName:"",
         keyPartName:""
       }
     }
  },
  props:["talklist"],
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(node) {
      console.log(node, 'node')
      this.oid = node.id
      this.owerOrgName = node.name
    },
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    save() {
      this.$emit('update:isShowMove', false)
      // this.$emit('isShowMoveClick', false)
    },
    cancel() {
      this.$emit('update:isShowMove', false)
    },
    cancel(){
      this.$emit("close")
    }
  },
   mounted(){
    console.log(this.talklist)

    this.formData =  this.talklist
    console.log(this.formData)
  },
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  flex: 1;
  margin-top:15px;
  margin-left: 20px;
  .main-content {
    width: 600px;
    text-align: center;
    .content-box {
      width: 100%;
      display: flex;
      .title {
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #F2F2F2;
      }
      .content-bottom {
        height: 468px;
        padding: 12px;
        color: #666;
        overflow: auto;
        .row {
          display: flex;
          height: 32px;
          line-height: 32px;
          .row-left {
            width: 100px;
            background: #F8F8F8;
            border: 1px solid #fff;
          }
          .row-right {
            flex: 1;
            border: 1px solid #F8F8F8;
            border-left: none;
          }
        }
      }
    }
  }
}
</style>
