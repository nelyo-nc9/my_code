<template>
  <div class="main">
    <div class="left-tree">
      <orgTree style="width:290px" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="sort-wrap">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
          <el-breadcrumb-item>音频管理</el-breadcrumb-item>
          <el-breadcrumb-item>对讲平台管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="create_look">新建</el-breadcrumb-item>
          <el-breadcrumb-item v-else>列表</el-breadcrumb-item>
          <el-breadcrumb-item>排序</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="main-content">
        <!-- <div class="con-title">对讲平台信息</div> -->
        <div class="btn-wrap">
          <el-button size="mini" @click="up(arrIndex)" :disabled="selectData.length==0">
            <i class="el-icon-top"></i>
            <span>上移</span>
          </el-button>
          <el-button size="mini" @click="down(arrIndex)" :disabled="selectData.length==0">
            <i class="el-icon-bottom"></i>
            <span>下移</span>
          </el-button>
          <el-button size="mini" @click="upIndex(arrIndex)" :disabled="selectData.length==0">
            <i class="el-icon-upload2"></i>
            <span>置顶</span>
          </el-button>
          <el-button size="mini" @click="downIndex(arrIndex)" :disabled="selectData.length==0">
            <i class="el-icon-download"></i>
            <span>置尾</span>
          </el-button>
        </div>
        <el-table :data="tableData" border height="450" size="mini" stripe @select="selectionChange"  @selection-change="handleSelectionChange" >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="对讲主机名称"></el-table-column>
          <el-table-column prop="serialCode" label="设备编码"></el-table-column>
        </el-table>
        <div class="submit-btn-container">
          <el-button size="mini" type="primary" @click="save">保存</el-button>
          <el-button size="mini" @click="cancel">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions,mapMutations } from 'vuex'
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { talkbackListApi,sortTalkbackListApi } from "@src/http/audioManage/talkback.api.js"

export default {
  components: {
   orgTree
  },
  props : [ 'detailData','pagetype' ],
  data() {
    return {
      treeType:2,
      tableData: [],   // 当前机构下重点部位下的 对讲平台列表
      serialCode_list:[], //
      arrIndex: '',
      selectData:[], //列表选中的数据 集合

      create_look:false,  // 当新建-查看页面跳转过来的时候为true
    }
  },
  methods: {
    
    // 机构资源树api
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    onceClick(data, node) { // 点击机构返回重点部位的下拉，记录当前节点的信息
    },

    // 获取对讲平台列表
    getTalkback() {
      let obj = {
        page: 1,
        limit: 100,
        orgId:this.detailData.orgId,
        keyPartId: this.detailData.keyPartId,
      }

      talkbackListApi(obj).then( res => {
          if(res.data.code == 0){
            let { data } = res.data;
            this.tableData = data.platforms;
            var serialCode_list = [];
            data.platforms.forEach(item => {
              serialCode_list.push(item.serialCode);
            });
            this.serialCode_list = serialCode_list;
          }
          
          // this.total = data.count.total;
        })
      rej => {
      }
    },

    // 选中 多选
    handleSelectionChange(val) {
      this.selectData = [...val];
    },

    // 选中(单选)
    selectionChange(selection, row) {
      this.arrIndex = (this.tableData || []).findIndex((profile) => profile.id === row.id)
    },

    /**
     * arr是要操作的数组
     * index1 是准备移动的元素
     * index2 是准备移动到的位置 往下移就是 index2=index+1
     * 往上移动就是 index2=index+1
     */
    swapItems(arr, index1, index2, direction) {
      
      if (direction === 'up') { // 置顶
        arr.unshift(arr[index1]);  // 添加到数组第一个
        arr.splice(index1 + 1, 1);   //删除 原来的项
      }else if (direction === 'down') { // 置底
        arr.push(arr[index1]);  // 添加到数组最后一个
        arr.splice(index1, 1);  //删除 原来的项
      }else{
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      }
      console.log(arr, '排序后要返回的数组');
      arr.forEach((item,index) => {
        item.serialCode = this.serialCode_list[index]
      })
      return arr;
    },

    // 置顶
    upIndex(index) {
      if (index === 0) {
        return false;
      }
      this.swapItems(this.tableData, index, 0, 'up')
      this.arrIndex = 0
    },

    // 上移
    up(index) {
      if (index === 0) {
        return false;
      }
      this.swapItems(this.tableData, index, index - 1)
      this.arrIndex--
    },

    // 下移
    down(index) {
      console.log(index, 'index down')
      if (index === this.tableData.length - 1) {
        return false;
      }
      this.swapItems(this.tableData, index, index + 1)
      this.arrIndex++
    },

    // 置底
    downIndex(index) {
      if (index === this.tableData.length - 1) {
        return false;
      }
      this.swapItems(this.tableData, index, 0, 'down')
      this.arrIndex = this.tableData.length - 1
    },

    // 保存 对讲平台 排序
    save() {
      let sequences = []
      for (let i = 0; i < this.tableData.length; i++) {
        // this.tableData[i].orderId = i + 1
        console.log(this.tableData[i])
        let tempObj = {
          id: this.tableData[i].id,
          serialCode: this.tableData[i].serialCode
        }
        sequences.push(tempObj)
      }
      var params = {
        sequences:sequences
      }

      sortTalkbackListApi (params).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          position: 'top-right',
          type: 'success'
        })
        // 返回 列表
        // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
        if(this.create_look){
          this.$emit('modelChange','examinelook',this.detailData)
        }else{
          this.$emit('modelChange','List')
        }

      }).catch(err => {
        console.log(err)
      })
    },

    // 取消保存
    cancel() {
      // 返回 列表
      // 判断 如果是 新建-查看 跳转过来的 需要 跳转回去
      if(this.create_look){
        this.$emit('modelChange','examinelook',this.detailData)
      }else{
        this.$emit('modelChange','List')
      }
    },

  },
  created() {
    // 判断如果是 新建-查看 页面 跳转过来 的 需要 在页头 显示新建
    if(this.pagetype && this.pagetype == 'examinelook'){
      this.create_look = true;
    }
    console.log(this.detailData);
    this.getTalkback();
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  display: flex;
  display: -webkit-flex;
  .left-tree {
    width: 290px;
    border-right: 1px solid #e1e1e1;
  }
  .sort-wrap{
    flex: 1;
    padding:10px 20px;
  }
  .main-content {
    width: 578px;
    text-align: center;
  }
  .con-title{
    font-size: 12px;
    line-height: 35px;
    text-align: center;
  }
  .btn-wrap{
    margin: 20px 0;
    text-align: left;
    i{
      font-size: 16px;
      margin-right:-5px;
    }
    /deep/.el-button--mini{
      width:80px;
    }
  }
  .submit-btn-container{
    margin:20px 0;
    /deep/.el-button--mini{
      width:93px;
    }
  }
}
</style>
