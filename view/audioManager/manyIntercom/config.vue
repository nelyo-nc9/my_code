<!--  -->
<template>
  <div class="config-box">
    <div class="top">
      <p>对讲分组</p>
      <button @click="close">x</button>
    </div>
    <div style="margin: 20px;"></div>
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="分组名称">
        <el-input v-model="formLabelAlign_name" class="inp"></el-input>
      </el-form-item>
    </el-form>
    <div class="box">
      <div v-for="(item,index) in arrlist" :key="index">
        <span>{{item.name}}</span>
      </div>
     
    </div>
    <div class="bottom">
      <el-button size="mini" style="float:right;margin-right:50px" @click="close">关闭</el-button>
      <el-button size="mini" style="float:right;margin-right:50px" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: '',
  components: {},
  props: ['arrlist'],
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign_name: '',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      ary: [],

    }
  },
  methods: {
    close() {
      this.$emit('btn')
    },

    // 保存 分组
    save() {
      
      if (!this.formLabelAlign_name.trim()) {
        this.$message({
          type: 'warning',
          message: '分组名称不能为空'
        })
        return false;
      }

      let video_list = this.arrlist;

      let deviceIds = [];  // 设备id 集合
      let channelIds = [];  // 分组 通道id 集合
      // debugger
      video_list.forEach(function(item) {
        if( item.tierType == 'equ' ){
          // 台麦
          deviceIds.push( item.id);
        } else if(item.tierType == 'res'){
          // 面板
          channelIds.push( item.id)
        }
      })  

      deviceIds = deviceIds.join(',');
      channelIds = channelIds.join(',');

      var parms = {
        name:this.formLabelAlign_name,  // 分组名称
        groupType: "2",  // 分组类型：1：广播分组2：对讲分组
        channelIds: channelIds,
        deviceIds: deviceIds,
        // keyPartId: this.arrlist[0].keyPartId,
        // orgId: this.arrlist[0].orgId,
        // userId: JSON.parse(sessionStorage.getItem('user')).id,
        // timeBroad: ""
      }
      this.postSaveGrouping(parms).then(
        res => {
          if(res.code == 0){
            console.log(res, '保存分组')
            this.$parent.getGroup();
            this.$alert("保存成功",'已完成',{
              confirmButtonText: '确定',
            })
          }
        },
        rej => {
          console.log(res, '保存分组')
        }
      )

      let listArr =  this.arrlist.map( V => V.name )  //return []
      this.$emit('childAddList',{
        title: this.formLabelAlign_name,
        name: listArr
        // [...this.arrlist]
      })
    },
    ...mapActions('manyIntercom', {
      postSaveGrouping: 'postSaveGrouping'
    })
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
.config-box {
  position: relative;
  width: 600px;
  height: 400px;
  border: 1px solid #ccc;
  border-radius:5px;
  z-index: 1001;
  .top {
    width: 100%;
    height: 30px;
    background: #eeeeee;
    display: flex;
    justify-content: space-between;
    p {
      padding: 6px;
    }
    button {
      line-height: 10px;
      height: 15px;
      width: 15px;
      margin: 10px;
      margin-top: 6px;
      border: none;
      background: none;
    }
  }
  /deep/ .el-input__inner {
    width: 193px;
    height: 23px;
    border-radius: 0px;
  }
  .box {
    position: absolute;
    left: 56px;
    top: 106px;
    width: 485px;
    height: 234px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(204, 204, 204, 1);
    border-radius: 0px;
  }
  .bottom {
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin: 259px 10px 10px -13px;
  }
}
</style>    