<template>
  <div class="main">
    <div class="main-content">
      <!-- <div class="con-title">对讲设备</div> -->
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
      <el-table :data="tableData" border height="450" size="mini" stripe @select="selectionChange"   @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="对讲主机名称"></el-table-column>
        <el-table-column prop="assetCode" label="设备编码"></el-table-column>
      </el-table>
      <div class="submit-btn-container">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancel">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getHostListApi,  sortSequenceApi } from "@src/http/audioManage/talkback.api.js"

export default {
  props: ['detailData'],
  data() {
    return {
      tableData: [],  // 数据集合
      serialCode_list:[], //
      arrIndex: '',
      selectData:[], //列表选中的数据 集合
    }
  },
  methods: {
    // 获取 当前机构，重点部位下 对讲设备列表
    getTalkbackHost() {
     let obj = {
        page: 1,
        limit: 100,
        orgId:this.detailData.orgId,
        keyPartId: this.detailData.keyPartId,
      }

      getHostListApi(obj).then(res => {
        if(res.data.code == 0){
          var list = res.data.data.hosts
          this.tableData = list;
          var serialCode_list = [];
          list.forEach(item => {
            serialCode_list.push(item.serialCode);
          });
          this.serialCode_list = serialCode_list;
        }
      })
    },

     // 选中(单选)
    selectionChange(selection, row) {
      this.arrIndex = (this.tableData || []).findIndex((profile) => profile.id === row.id)
    },

    // 选中 多选
    handleSelectionChange(val) {
      this.selectData = [...val];
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
        return
      }
      this.swapItems(this.tableData, index, 0, 'up')
      this.arrIndex = 0
    },

    // 上移
    up(index) {
      if (index === 0) {
        return
      }
      this.swapItems(this.tableData, index, index - 1)
      this.arrIndex--
    },

    // 下移
    down(index) {
      console.log(index, 'index down')
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, index + 1)
      this.arrIndex++
    },

    // 置底
    downIndex(index) {
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, 0, 'down')
      this.arrIndex = this.tableData.length - 1
    },

    // 保存
    save() {
      let sequences = []
      for (let i = 0; i < this.tableData.length; i++) {
        // this.tableData[i].orderId = i + 1
        let tempObj = {
          id: this.tableData[i].id,
          serialCode: this.tableData[i].serialCode
        }
        sequences.push(tempObj)
      }
      var params = {
        sequences:sequences
      }
      sortSequenceApi(params).then(res => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          position: 'top-right',
          type: 'success'
        })
        this.$emit('closeSort');
        
      }).catch(err => {
        console.log(err)
      })
    },

    // 取消
    cancel() {
      this.$emit('closeSort')
    },

  },
  created() {
    this.getTalkbackHost()
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
    margin:0px 0 20px;
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
