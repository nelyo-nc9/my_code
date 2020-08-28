<!--  -->
<template>
  <div class="main">
     <div class="mid" v-show="isMid" id="printContent1">
          <div class="form-top">修改媒体网关信息</div>
          <div class="big-box" style="height:178px;"> 
                <div class="form-item">
                      <label>媒体网关名称</label>
                      <el-input v-model="formData.orgName" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>媒体ip地址</label>
                      <el-input v-model="formData.ip" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>转发起始端口</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>转发端口对数</label>
                      <el-input v-model="formData.portNum" placeholder="请输入内容"></el-input>
                </div>
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
          <div class="form-top">修改上级域配置</div>
          <div class="big-box" style="height: 540px;"> 
                <div class="form-item">
                      <label>级联类型*</label>
                      <el-input v-model="formData.orgName" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域名称</label>
                      <el-input v-model="formData.orgName" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域编码</label>
                      <el-input v-model="formData.subCode" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域ip地址</label>
                      <el-input v-model="formData.ip" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域端口</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>级联协议</label>
                      <el-select v-model="formData.cport">
                          <el-option v-for="(item,index) in agreeList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                </div>
                <div class="form-items">
                      <span>是否开启鉴权</span>
                      <el-radio class="radio1" v-model="radio" label="1">是</el-radio>
                      <el-radio class="radio2" v-model="radio" label="2">否</el-radio>
                </div>
                <div class="form-item">
                      <label>用户名</label>
                      <el-input v-model="formData.username" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>密码</label>
                      <el-input v-model="formData.passWord" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>平台厂家类型</label>
                      <el-select v-model="formData.platfrom">
                          <el-option v-for="(item,index) in platfromList"
                                    :key="index"  
                                    :label="item.label"   
                                    :value="item.value"></el-option>
                        </el-select>
                </div>
                <div class="form-item">
                      <label>注册有效期</label>
                      <el-input v-model="formData.passWord" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>心跳周期</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>心跳超时次数</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
          </div>
            <div class="btn-box">
              <el-button type="primary"
                          size="mini" @click="save">保存</el-button>
                <el-button size="mini" @click="rest">重置</el-button>
                <el-button size="mini" v-print="'#printContent2'">打印</el-button>
                <el-button size="mini" @click="close">关闭</el-button>
            </div>
    </div>
    <div class="sub" v-show="isSub" id="printContent3">
          <div class="form-top">修改下级域配置</div>
          <div class="big-box" style="height: 575px;"> 
                <div class="form-item">
                      <label>级联类型</label>
                      <el-input v-model="formData.orgName" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域名称</label>
                      <el-input v-model="formData.orgName" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域编码</label>
                      <el-input v-model="formData.subCode" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域ip地址</label>
                      <el-input v-model="formData.ip" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>上级域端口</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>级联协议</label>
                      <el-select v-model="formData.cport">
                          <el-option v-for="(item,index) in agreeList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                </div>
                <div class="form-items">
                      <span>是否开启鉴权</span>
                      <el-radio class="radio1" v-model="radio" label="1">是</el-radio>
                      <el-radio class="radio2" v-model="radio" label="2">否</el-radio>
                </div>
                <div class="form-item">
                      <label>用户名</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>密码</label>
                      <el-input v-model="formData.passWord" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>平台厂家类型</label>
                      <el-select v-model="formData.platfrom">
                          <el-option v-for="(item,index) in platfromList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                </div>
                <div class="form-item">
                      <label>传输流方式</label>
                      <el-select v-model="formData.node">
                          <el-option v-for="(item,index) in modelList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                </div>
                <div class="form-item">
                      <label>注册有效期</label>
                      <el-input v-model="formData.passWord" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>心跳周期</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
                <div class="form-item">
                      <label>心跳超时次数</label>
                      <el-input v-model="formData.port" placeholder="请输入内容"></el-input>
                </div>
          </div>
            <div class="btn-box">
              <el-button type="primary"
                          size="mini" @click="save">保存</el-button>
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
  props:['talklist','editNum'],
  components: {
    
  },
  data() {
    return {
      formData:{
         orgName:'',
         ip:'',
         port:'',
         agree:'',
         portNum:'',
         manu:'',
         passWord:'',
         username:''
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
      platfromList:[
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
      this.$messageSuccess('保存成功','成功')
      this.$parent.close()
    },
    rest(){
      this.formData = { ...this.obj }
      this.value = []
    },
  },
  created() {
     console.log(this.editNum)
    if(this.editNum===1){
      this.isMid=true,
      this.isPar=false,
      this.isSub=false
    }
    if(this.editNum===2){
      this.isMid=false,
      this.isPar=true,
      this.isSub=false
    }
    if(this.editNum===3){
      this.isMid=false,
      this.isPar=false,
      this.isSub=true
    }
    this.formData=this.talklist
    console.log(this.formData)
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
            border: 1px solid #ccc;
            margin-top:30px;
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
         width: 100%;
         height: 100px;
        .form-top{
           width:200px;
           position: fixed;
           top:10px;
           left:40%;
        }
        .big-box{
            width: 566px;
            border: 1px solid #ccc;
            margin-top:30px;
            margin-left:200px;
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
         .btn-box{
            width: 300px;
            height: 50px;
            margin-left:343px;
            margin-top:30px;
        }
    }
</style>