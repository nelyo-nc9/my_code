<!--  -->
<!--  -->
<!-- 查询 -->
<template>
  <div class="edit-box">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>音频管理</el-breadcrumb-item>
        <el-breadcrumb-item>话筒MAC地址绑定</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="top-box">
      <el-form ref="form" size="mini" :model="formData" label-position="right" label-width="120px">
        <el-form-item label="所属机构" class="form-group">
          <el-input disabled v-model="formData.orgName"></el-input>
        </el-form-item>
        <el-form-item label="所属重点部位" class="form-group">
          <el-input v-model="formData.keyPartName" disabled></el-input>
        </el-form-item>

        <el-form-item label="所属对讲平台" class="form-group">
          <el-input v-model="formData.platformName" disabled></el-input>
        </el-form-item>

        <el-form-item label="对讲设备名称" class="form-group">
          <el-input v-model="formData.name" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="品牌" class="form-group">
          <el-input v-model="formData.brand" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型" class="form-group">
          <el-input value="主机" disabled></el-input>
        </el-form-item>
        <el-form-item label="型号" class="form-group">
          <el-input v-model="formData.modelNum" disabled></el-input>
        </el-form-item>

        <el-form-item label="话筒地址" class="form-group">
            <el-input v-model="formData.ip" disabled></el-input>
        </el-form-item>
        <el-form-item label="话筒唯一ID" class="form-group">
            <el-input v-model="formData.uniqueId" disabled></el-input>
        </el-form-item>

        <el-form-item label="话筒绑定MAC地址" class="form-group">
          <el-input v-model="formData.mac"></el-input>
        </el-form-item>

        <el-form-item label="资产编码" class="form-group">
          <el-input v-model="formData.assetCode" disabled></el-input>
        </el-form-item>

        <el-form-item label="在线状态" class="form-group">
            <el-select v-model="formData.status" disabled>
              <el-option label="在线" :value="2"></el-option>
              <el-option label="离线" :value="1"></el-option>
              <el-option label="未知" :value="3"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <!-- 录入人，机构 时间 -->
      <div class="creat-messages">
        <span>录入时间</span>
        <span>{{formData.updatedAt}}</span>
        <span>录入机构</span>
        <span>{{formData.updatedDept}}</span>
        <span>录入人</span>
        <span>{{formData.updatedBy}}</span>
      </div>
      <div class="form-footer">
        <el-button type="primary" size="mini" @click="save">保存</el-button>
        <el-button size="mini" @click="clonelists">取消</el-button>
        <el-button size="mini" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import AudioPaination from "../../../components/AudioPagination"
  import { bindMacAddressApi, getTaimaisList, getHostListApi } from "../../../../../http/audioManage/talkback.api"
  export default {
    name: '',
    components: {
      AudioPaination
    },
    props:["talklist"],
    data() {
      return {
        total: 0,
        formData: {
          // 表单数据
          orgName: '',
          keyPartName: '',
          brand: '',
          modelNum:"",
          name:'',
          ip: '',
          mac:'',
          keyPart: '', //所属重点部位
          uniqueId: '',
          type:"话筒"
        },
        activeCreate: true,
        activePrint: false,
        dropdownStatus: {
          detector: true
        },
        maclist:[],
        total: 0,
        status: '全部',
        success:1
      }
    },
    created() {
      this.formData=this.talklist
      console.log(this.talklist)
      if(this.formData.type===2){
        this.formData.type="话筒"
      }
      this.getlist()
      
    },
    methods: {
        getlist() {
          let obj = {
            page: 1,
            limit: 100,
            type: 2,
          }
          getHostListApi(obj).then(res => {
            console.log(res)
            this.maclist=res.data.data.hosts;
          })
      },
        
      sizeChange(value) {},
      select(s, row) {
        console.log(s, row, '单选')
      },

      // 取消
      clonelists(){
        this.$parent.getlist()
        this.$emit("closeList")
      },
      
      // 保存
      save(){
        var macAddress = this.formData.mac;
        // 验证是否是mac 地址
        if(!this.checkMacAddress(macAddress)){
          this.$message({
            message: '您输入的MAC地址不合法，请重新输入',
            type: 'warning'
          });
          return false;
        }

        // 验证mac地址重复
        let arr=this.maclist.map((item,index)=>{
          return item.mac
        })
        for(let item of arr){
          if( item === macAddress ){
            alert('您输入的MIC地址重复，请重新输入')
            return
          }else{
            this.success=2
          }
        }
        if(this.success=2){
          let {mac}=this.formData
          let obj={
            id:this.formData.id,
            mac:mac
          }
          bindMacAddressApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '绑定成功',
                type: 'success'
              });
              this.$emit('closeList')
            }
          })
        }
      },
      
      // 打印
      print(){
        console.log('打印');
      },

      // 重置
      reset(){
        this.formData.mac = "";
      },

      // 验证MAC地址
      checkMacAddress( macAddress ) {
        var regex = "([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}";
        //var regex = "(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})"; // 含冒号
        var regexp = new RegExp(regex);
        if (!regexp.test(macAddress)) {
          console.log("Mac地址格式不正确，请检查")
          return false;
        }
        return true;
      },

    },
    computed: {
      
    },
    watch: {
    
    }
  }
</script>
<style lang="less" scoped>
.edit-box{
  width: 970px;
  padding-left: 20px;
  header {
    color: #333333;
    margin: 23px 0;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2d72d3;
        }
      }
    }
  }
  .top-box{
    padding-bottom: 20px;
    .el-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background: #F5F5F5;
      padding: 10px 12px 20px 0;
      .el-select{
        width: 100%;
      }
      .el-form-item{
        width: 450px;
        margin-bottom: 10px;
      }
    }
    .creat-messages {
      width: 950px;
      height: 35px;
      border: 1px solid rgba(225, 225, 225, 1);
      display: flex;
      margin-bottom: 30px;
      margin-top: 30px;
      span:nth-child(odd) {
        width: 155px;
        height: 100%;
        background: rgba(245, 245, 245, 1);
        text-align: center;
        line-height: 35px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
      }
      span:nth-child(even) {
        width: 170px;
        height: 100%;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        line-height: 35px;
        text-align: center;
      }
    }
    .form-footer{
      text-align: center;
      .el-button{
        width: 93px;
      }
    }
  }
}
</style>
