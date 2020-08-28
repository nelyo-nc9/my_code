<!--  -->
<template>
  <div class="main">
    <div class="mid" v-show="isMid" id="printContent1">
          <div class="form-top">新增媒体网关信息</div>
          <div class="big-box" style="height:178px;"> 
             <el-form
                  ref='addFrom'
                  size="mini"
                  :model="formData"
                  label-width="140px"
                  :rules="rules">
              <el-form-item label="媒体网关名称" prop="name">
                <el-input  v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体ip地址" prop="ip">
                <el-input  v-model="formData.ip"></el-input>
              </el-form-item>
              <el-form-item label="转发起始端口" prop="port">
                <el-input  v-model="formData.port"></el-input>
              </el-form-item>
              <el-form-item label="转发端口对数" prop="portNum">
                <el-input  v-model="formData.portNum"></el-input>
              </el-form-item>
             </el-form>
          </div>
            <div class="btn-box">
              <el-button type="primary"
                          size="mini" @click="save">保存</el-button>
                <el-button size="mini" @click="rest">重置</el-button>
                <el-button size="mini" v-print="'#printContent1'">打印</el-button>
                <el-button size="mini" @click="close">关闭</el-button>
            </div>
    </div>
    <div class="parent" v-show="isPar" id="printContent2">
          <div class="form-top">新增上级域配置</div>
          <div class="big-box" style="height: 540px;">
                <el-form
                        size="mini"
                        :model="formDatap"
                        label-width="140px"
                        ref="addFromp"
                        :rules="rulespan">
                  <el-form-item label="级联类型" prop="name">
                     <el-input  v-model="formDatap.name"></el-input>
                  </el-form-item>
                  <el-form-item label="上级域名称" prop="ip">
                     <el-input  v-model="formDatap.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="上级域编码" prop="ip">
                     <el-input  v-model="formDatap.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="上级域ip地址" prop="portNum">
                     <el-input  v-model="formDatap.portNum"></el-input>
                  </el-form-item>
                  <el-form-item label="上级域端口" prop="portNum">
                     <el-input  v-model="formDatap.portNum"></el-input>
                  </el-form-item>
                  <el-form-item label="上级域ip地址">
                    <el-select v-model="formDatap.agree">
                        <el-option v-for="(item,index) in agreeList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="是否开启鉴权">
                     <el-radio class="radio1" v-model="radio" label="1">是</el-radio>
                     <el-radio class="radio2" v-model="radio" label="2">否</el-radio>
                  </el-form-item>
                  <el-form-item label="用户名" prop="port">
                     <el-input  v-model="formDatap.port"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="passWord">
                     <el-input  v-model="formDatap.passWord"></el-input>
                  </el-form-item>
                  <el-form-item label="平台厂家类型">
                     <el-select v-model="formDatap.manu">
                          <el-option v-for="(item,index) in manuList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="注册有效期" prop="passWord">
                     <el-input  v-model="formDatap.passWord"></el-input>
                  </el-form-item>
                  <el-form-item label="心跳周期" prop="port">
                     <el-input  v-model="formDatap.port"></el-input>
                  </el-form-item>
                  <el-form-item label="心跳超时次数" prop="port">
                     <el-input  v-model="formDatap.port"></el-input>
                  </el-form-item>
                </el-form> 
          </div>
            <div class="btn-box">
              <el-button type="primary"
                          size="mini" @click="savepan">保存</el-button>
                <el-button size="mini" @click="rest">重置</el-button>
                <el-button size="mini" v-print="'#printContent2'">打印</el-button>
                <el-button size="mini" @click="close">关闭</el-button>
            </div>
    </div>
    <div class="sub" v-show="isSub" id="printContent3">
          <div class="form-top">新增下级域配置</div>
          <div class="big-box" style="height: 575px;"> 
               <el-form 
                        ref="addFroms"
                        size="mini"
                        :model="formDatas"
                        label-width="140px"
                        :rules="srules">
                  <el-form-item label="级联类型" prop="name">
                     <el-input  v-model="formDatas.name"></el-input>
                  </el-form-item>
                  <el-form-item label="下级域名称" prop="ip">
                     <el-input  v-model="formDatas.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="下级域编码" prop="ip">
                     <el-input  v-model="formDatas.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="下级域ip地址" prop="portNum">
                     <el-input  v-model="formDatas.portNum"></el-input>
                  </el-form-item>
                  <el-form-item label="下级域端口" prop="portNum">
                     <el-input  v-model="formDatas.portNum"></el-input>
                  </el-form-item>
                  <el-form-item label="下级域ip地址">
                    <el-select v-model="formDatas.agree">
                          <el-option v-for="(item,index) in agreeList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="是否开启鉴权">
                     <el-radio class="radio1" v-model="radio" label="1">是</el-radio>
                     <el-radio class="radio2" v-model="radio" label="2">否</el-radio>
                  </el-form-item>
                  <el-form-item label="用户名" prop="port">
                     <el-input  v-model="formDatas.port"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="passWord">
                     <el-input  v-model="formDatas.passWord"></el-input>
                  </el-form-item>
                  <el-form-item label="平台厂家类型">
                     <el-select v-model="formDatas.manu">
                          <el-option v-for="(item,index) in manuList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="传输流方式">
                     <el-select v-model="formDatas.manu">
                          <el-option v-for="(item,index) in manuList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="注册有效期" prop="passWord">
                     <el-input  v-model="formDatas.passWord"></el-input>
                  </el-form-item>
                  <el-form-item label="心跳周期" prop="port">
                     <el-input  v-model="formDatas.port"></el-input>
                  </el-form-item>
                  <el-form-item label="心跳超时次数" prop="port">
                     <el-input  v-model="formDatas.port"></el-input>
                  </el-form-item>
                </el-form> 
          </div>
            <div class="btn-box">
              <el-button type="primary"
                          size="mini" @click="savesub">保存</el-button>
                <el-button size="mini" @click="rest">重置</el-button>
                <el-button size="mini" v-print="'#printContent3'">打印</el-button>
                <el-button size="mini" @click="close">关闭</el-button>
            </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    
  },
  props:['createNum'],
  data() {
    return {
      formData:{
         name:'',
         ip:'',
         port:'',
         agree:'',
         portNum:'',
         manu:'',
         passWord:''
      },
      formDatas:{
         name:'',
         ip:'',
         port:'',
         agree:'',
         portNum:'',
         manu:'',
         passWord:''
      },
       formDatap:{
         name:'',
         ip:'',
         port:'',
         agree:'',
         portNum:'',
         manu:'',
         passWord:''
      },
      rules:{
         name:[
           { required: true, message: '请输入网关名称', trigger: 'blur' },
         ],
         ip:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         port:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         portNum:[
           {required: true, message: '请输入端口对数', trigger: 'blur'}
         ]
      },
      srules:{
         name:[
           { required: true, message: '请输入网关名称', trigger: 'blur' },
         ],
         ip:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         port:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         portNum:[
           {required: true, message: '请输入端口对数', trigger: 'blur'}
         ]
      },
      rulespan:{
         name:[
           { required: true, message: '请输入网关名称', trigger: 'blur' },
         ],
         ip:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         port:[
           {required: true, message: '请输入网关名称', trigger: 'blur'}
         ],
         portNum:[
           {required: true, message: '请输入端口对数', trigger: 'blur'}
         ]
      },
      modelList:[
        {label:'UDP',value:'UDP'},
        {label:'TCP',value:'TCP'}
      ],
      agreeList:[
        {label:'GB/T 28181 2020',value:'GB/T 28181 2020'},
        {label:'GB/T 28181 2200',value:'GB/T 28181 2200'}
      ],
      manuList:[
        {label:'本家平台',value:'本家平台'},
        {label:'其他厂家平台',value:'其他厂家平台'}
      ],
      radio: '1',
      isMid:true,
      isPar:false,
      isSub:false,
    }
  },
  methods: {
    close(){
      this.$parent.close()
    },
    save(){
          this.$refs.addFrom.validate((valid)=>{
             if(valid){
                this.$messageSuccess('保存成功','成功')      
                this.$parent.close()   
             }else{
                this.$messageSuccess('保存失败','失败')   
             }
          })
    },
    savesub(){
          this.$refs.addFroms.validate((valid)=>{
             if(valid){
                this.$messageSuccess('保存成功','成功')      
                this.$parent.close()   
             }else{
                this.$messageSuccess('保存失败','失败')   
             }
          })
    },
    savepan(){
         this.$refs.addFromp.validate((valid)=>{
             if(valid){
                this.$messageSuccess('保存成功','成功')      
                this.$parent.close()   
             }else{
                this.$messageSuccess('保存失败','失败')   
             }
          })
    },
    rest(){
      this.formData = { ...this.obj }
      this.value = []
    },
  },
  created() {
    console.log(this.createNum)
    if(this.createNum===1){
      this.isMid=true,
      this.isPar=false,
      this.isSub=false
    }
    if(this.createNum===2){
      this.isMid=false,
      this.isPar=true,
      this.isSub=false
    }
    if(this.createNum===3){
      this.isMid=false,
      this.isPar=false,
      this.isSub=true
    }
  },
  computed: {
   
  },
  watch: {
    
  }
}
</script>
<style lang="less" scoped>
   .main{
      width: 100%;
      height: 100px;
        .form-top{
           margin-left:643px;
           margin-top:50px;
           font-size: 13px;
        }
        .big-box{
            width: 566px;
            margin-top:30px;
            margin-left:400px;
            padding: 10px;
            background: #f5f5f5;
            /deep/.el-form{
                width: 90%;
            /deep/.el-form-item{
                margin-bottom: 10px
            }
            /deep/.el-form-item__label{
                background: #f5f5f5;  
                
            }
            /deep/ .el-select {
                        .el-input {
                        .el-input__inner {
                            height: 30px;
                            width: 350px;
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
            
            }
            /deep/.el-form-item__content{
                  margin-left:153px;
            }
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
            }
        }
        .btn-box{
            width: 300px;
            height: 50px;
            margin-left:543px;
            margin-top:30px;
        }
    }
    @media print {
         .big-box{
            width: 566px;
            margin-top:30px;
            margin-left:260px;
            padding: 10px;
            background: #f5f5f5;
            /deep/.el-form{
                width: 90%;
            /deep/.el-form-item{
                margin-bottom: 10px
            }
            /deep/.el-form-item__label{
                background: #f5f5f5;  
                
            }
            /deep/ .el-select {
                        .el-input {
                        .el-input__inner {
                            height: 30px;
                            width: 350px;
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
            
            }
            /deep/.el-form-item__content{
                  margin-left:153px;
            }
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
            }
        }
        .btn-box{
            width: 300px;
            height: 50px;
            margin-left:443px;
            margin-top:30px;
        }
    }
</style>