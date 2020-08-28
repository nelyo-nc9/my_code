<!-- 本级域配置 -->
<template>
  <div class="content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>监管系统对接</el-breadcrumb-item>
            <el-breadcrumb-item>国标互联</el-breadcrumb-item>
            <el-breadcrumb-item>网关配置</el-breadcrumb-item>
            <el-breadcrumb-item>本级域配置</el-breadcrumb-item>
  
          </el-breadcrumb>
        </header>
      </div>
      <el-button class="button" @click="edit">编辑</el-button>
      <div class="big-box" id="printContent2"> 
          <div class="form-item">
                <label>域标识</label>
                <el-input v-model="formData.name" placeholder="请输入内容"></el-input>
          </div>
          <div class="form-item">
                <label>ip地址</label>
                <el-input v-model="formData.ip" placeholder="请输入内容"></el-input>
          </div>
          <div class="form-item">
                <label>sip端口</label>
                <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
          </div>
          <div class="form-item">
                <label>推送方式</label>
                <el-select v-model="formData.modelNum">
                    <el-option v-for="(item,index) in modelList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
          </div>
          <div class="form-items">
                <span>启用推送配置</span>
                <el-radio class="radio1" v-model="radio" label="1">是</el-radio>
                <el-radio class="radio2" v-model="radio" label="2">否</el-radio>
          </div>
      </div>
      <div class="btn-box">
        <el-button type="primary"
                     size="mini"  :disabled = "openIsDisabled" @click="save">保存</el-button>
          <el-button size="mini"  :disabled = "openIsDisabled" @click="rest">重置</el-button>
          <el-button size="mini" v-print="'#printContent2'">打印</el-button>
      </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  data() {
    return {
      openIsDisabled: true , closeIsDisabled: true ,
      formData:{
         name:'',
         ip:'',
         port:'',
         modelNum:''
      },
      modelList:[
        {label:'UDP',value:'UDP'},
        {label:'TCP',value:'TCP'}
      ],
      radio: '1'
    }
  },
  methods: {
    rest(){
      this.formData = { ...this.obj }
      this.value = []
    },
    edit(){
      this.openIsDisabled=false
    },
    save(){
      this.openIsDisabled=true
     this.$messageSuccess('保存成功','成功')
    },
     Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      list = list.map(item => {
        return {
          orgName: item.orgName || '',
          keyPartName: item.keyPartName || '',
          subSystemName: item.subSystemName || '',
          name: item.name || '',
          brand: item.brand || '',
          modelNum: item.modelNum || '',
          accessProtocol: item.accessProtocol || '',
          assetCode: item.assetCode || '',
          uniqueId: item.uniqueId || '',
          ip: item.ip || '',
          port: item.port || '',
          cport: item.cport || '',
          dport: item.dport || '',
          username: item.username || '',
          password: item.password || '',
          status: item.status || '',
          status: item.status || '',
          updatedDeptId: item.updatedDeptId || '',
          updatedById: item.updatedById || '',
          updatedAt: item.updatedAt || '',
        }
      })
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '所属机构' },
          { field: 'keyPartName', displayName: '所属重点部位' },
          { field: 'subSystemName', displayName: '所属子系统' },
          { field: 'name', displayName: '对讲平台名称' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNum', displayName: '型号' },
          { field: 'accessProtocol', displayName: '接入协议' },
          { field: 'assetCode', displayName: '资产编码' },
          { field: 'uniqueId', displayName: '对讲平台唯一ID' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'port', displayName: '终端接收端口' },
          { field: 'cport', displayName: '服务器接收端口' },
          { field: 'dport', displayName: '级联音频端口' },
          { field: 'username', displayName: '用户名' },
          { field: 'password', displayName: '密码' },
          { field: 'status', displayName: '在线状态' },
          { field: 'status', displayName: '运行状态' },
          { field: 'updatedDeptId', displayName: '录入机构' },
          { field: 'updatedById', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">对讲管理配置列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#111; ",
        //内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;color:#222;",
      })
    },
  },
  created() {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
   .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding:12px;
    position: relative;
    .button{
      position: absolute;
      top:50px;
      left:50px;
    }
    .big-box{
      width: 600px;
      height: 220px;
      border: 1px solid #ccc;
      margin-top:100px;
      margin-left:400px;
      padding: 10px;
      .form-item {
         margin-bottom: 10px;
              label {
                width: 170px;
                margin-left: 5px;
                background: #f1f1f1;
                display: inline-block;
                height: 30px;
                font-size: 13px;
                line-height: 30px;
                text-align: center;
              }
              /deep/ .el-select {
                .el-input {
                  .el-input__inner {
                    height: 30px;
                    width: 360px;
                     border-radius: 5px;
                  }
                  .el-input__suffix {
                    .el-input__suffix-inner {
                      i {
                        line-height: 30px;
                      }
                    }
                  }
                }
              }
              /deep/ .el-input {
                width: 360px;
                .el-input__inner {
                  height: 30px;
                  width: 360px;
                  border-radius: 5px;
                }
              }
            }
            .form-items{
              width:600px;
              height:38px;
              margin-left:5px;
             
             span{
              margin-top: 1px;
              // padding: 5px 0;
              width: 169px;
              height: 30px;
              text-align: center;
              background: #f1f1f1;
              line-height: 28px;
              display: inline-block;
            }
            /deep/.el-radio radio is-checked{
              margin-left: 10px;
            }
            }
    }
    .btn-box{
      width: 300px;
      height: 50px;
      margin-left:600px;
      margin-top:30px;
    
    }
  }
</style>
<style lang="less">
.content {
  .right-content {
    .form-box {
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 12px;
        }
        .el-form-item__label {
          border: 1px solid #fff;
        }
      }
    }
  }
}@media print { 
   width: 100%;
    height: 100%;
    overflow-y: auto;
    padding:12px;
    position: relative;
    .button{
      position: absolute;
      top:50px;
      left:50px;
    }
    .big-box{
      width: 600px;
      height: 220px;
      border: 1px solid #ccc;
      margin-top:100px;
      margin-left:300px;
      padding: 10px;
      .form-item {
         margin-bottom: 10px;
              label {
                width: 170px;
                margin-left: 5px;
                background: #f1f1f1;
                display: inline-block;
                height: 30px;
                font-size: 13px;
                line-height: 30px;
                text-align: center;
              }
              /deep/ .el-select {
                .el-input {
                  .el-input__inner {
                    height: 30px;
                    width: 360px;
                     border-radius: 5px;
                  }
                  .el-input__suffix {
                    .el-input__suffix-inner {
                      i {
                        line-height: 30px;
                      }
                    }
                  }
                }
              }
              /deep/ .el-input {
                width: 360px;
                .el-input__inner {
                  height: 30px;
                
                  border-radius: 5px;
                }
              }
            }
    }
     .form-items{
              width:1300px;
              height:38px;
              margin-left:5px;
              position: relative;
             
             span{
              margin-top: 1px;
              // padding: 5px 0;
              width: 169px;
              height: 30px;
              text-align: center;
              background: #f1f1f1;
              line-height: 28px;
              display: inline-block;
            }
           
            .radio1{
              /deep/.el-radio__inner{
                width: 10px;
                height: 10px;
                position: absolute;
                top:8px;
                left:20px;
              }
              /deep/.el-radio__label{
                width: 10px;
                height: 10px;
                position: absolute;
                left:30px;

              }
              
            }
            .radio2{
              /deep/.el-radio__inner{
                width: 10px;
                height: 10px;
                position: absolute;
                top:8px;
                left:10px;
              
              }
              /deep/.el-radio__label{
                width: 10px;
                height: 10px;
                position: absolute;
                left:30px;

              }
            }
            }
}

</style>