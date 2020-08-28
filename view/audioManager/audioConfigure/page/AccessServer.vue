<!-- 接入服务器配置 -->
<template>
  <div class="rightbox">
    <el-table
      ref="multipleTable"
      :data="DA_serverList"
      tooltip-effect="dark"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column prop="service" label="接入服务" width="346" align="center"></el-table-column>
      <el-table-column prop="talkBackId" label="对讲托管ID" width="125" align="center"></el-table-column>
      <el-table-column label="托管ID三位1-999" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            round
            @click="handleAdd(scope.$index, scope.row)"
            style="width:80px;height:30px;"
          >{{btnTitle}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 接入服务器配置 弹窗 -->
    <el-dialog :title="modalTitle" :visible.sync="isEditXiu" width="440px" :close-on-click-modal="false">
      <el-form v-model="inputData" size="mini" label-position="right" label-width="140px">
        <el-form-item label="接入服务" required>
          <el-input v-model="inputData.service" disabled></el-input>
        </el-form-item>
        <el-form-item label="对讲托管ID" required>
          <el-input v-model="inputData.talkBackId"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="saveEdit">保存</el-button>
        <el-button size="mini" @click="cancal">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  getServerListallApi,
  addserverList,
  getServerListApi,
  deletServiceListApi
} from '../../../../http/audioManage/talkback.api'
export default {
  name: '',
  components: {},
  data() {
    return {
      isEditXiu: false,
      inputData: {
        service: '',
        talkBackId: '',
        id: ''
      },
      tableData: [],  //接入服务器列表
      arr: [],
      modalTitle: '',
      talklist: [],
      btnTitle: '编辑',

      DA_serverList:[],  // DA 服务
      serverList:[],  // 全部服务数据
    }
  },
  methods: {

    // 获取全部 server
    getServerList(){
      getServerListApi().then(res => {
        console.log(res);
        let severData = res.data.data;
        this.serverList = severData;
        var DA_serverList = this.DA_serverList;
        for(var i=0;i<DA_serverList.length;i++){
          var service = DA_serverList[i].service;
          console.log(service)
          for(var j=0;j<severData.length;j++){
            console.log(severData[j].service)
            if(severData[j].talkBackId && severData[j].service == service){
              DA_serverList[i].talkBackId = severData[j].talkBackId;
              DA_serverList[i].id = severData[j].id;
            }
          }
        }
      })

    },

    // 获取DA服务
    getServerListallApi(){
      getServerListallApi().then(res => {
        console.log(res);
        let list = res.data.map(item => {
          return { service: item, id: '', talkBackId: '' }
        })
        console.log(list)
        this.DA_serverList = list;
        // 调用serverlist 进行对比 赋值talkBackId和id
        this.getServerList();
      })
    },

    // 编辑按钮 触发
    handleAdd(index, row) {
      this.isEditXiu = true;
      this.inputData.service = row.service;
      this.inputData.id = row.id;
      this.inputData.talkBackId = row.talkBackId;
    },

    // 保存配置
    saveEdit() {
      if (
        !Number(this.inputData.talkBackId) ||
        Number(this.inputData.talkBackId) > 999 ||
        Number(this.inputData.talkBackId) <= 0
      ) {
        this.$message({
          message: '托管ID三位1-999',
          type: 'warning'
        });
        return false;
      }

     var talkBackId = this.inputData.talkBackId + '';
      let obj = {
        id: this.inputData.id,
        service: this.inputData.service,
        talkBackId: talkBackId
      }
      console.log(obj)
      addserverList(obj).then(res => {
        console.log(res)
        if(res.data.code===0){
          this.getServerListallApi();
        }
        this.isEditXiu = false
      })
    },

    // 取消
    cancal() {
      this.isEditXiu = false
    },

    // 删除
    del() {
      if (this.arr.length === 0) {
        return this.$message('请勾选编辑项')
      } else {
        
        let ids = this.arr.map(item => {
          let { id } = item
          return id
        })
        console.log(ids)
        deletServiceListApi({ ids }).then(res => {
          if (res.data.code === 0) {
            this.getServerListallApi();
          }
          console.log(res)
        })
      }
    },
    
  },
  created() {
    this.getServerListallApi();
  },
  computed: {},
  watch: {
    inputData(val) {
      console.log(val)
      this.talklist.id = val.id
    }
  }
}
</script>
<style lang="less" scoped>
.rightbox {
  width: 806px;
  height: 500px;
  margin-left: 20px;
}
</style>