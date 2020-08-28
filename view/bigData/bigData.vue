<template>
  <div class="content bigDataHome">
    <nav>
      <div class="logo">
        <img src="../../../static/bigData/logo.png" alt />
        <span class="line"></span>  <p v-if="true" @click="goHome()">首页</p>
      </div>
      <div class="homeTitle">
        <span>安防物联网平台 {{title}}</span>
      </div>
      <div class="iconRight">
        <i class="el-icon-setting" @click='handleOpen'></i>
      </div>
    </nav>
    <el-dialog title='轮播策略' :visible.sync="dialogVisible" width='500px' @close='handlerClose'>
      <el-form :model='form' label-width="150px" ref='form' :rules='formRule'>
        <el-form-item label="循环播放时间间隔:" prop='time'>
          <el-input v-model.number="form.time" autocomplete="off" class="ipt"></el-input>
          <span>秒(5s~3600s)</span>
        </el-form-item>
        <el-form-item label='是否启用:'>
          <el-switch
            v-model="form.switch"
            >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSure">确 定</el-button>
        <el-button @click="handlerClose">取 消</el-button>
      </div>
    </el-dialog>
    <router-view :title="title"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      dialogVisible:false,
      form:{
        time:sessionStorage.getItem('time')?sessionStorage.getItem('time'): 10,
        switch:sessionStorage.getItem('switch')?JSON.parse(sessionStorage.getItem('switch')) :true
      },
      setRouter:null

    }
  },
  computed:{
    formRule(){
      const validate0 = (rule,value,callback) => {
        const rep =/^[0-9]\d/
        if(!value){
          callback(new Error('请输入时间'))
        }else if(!rep.test(value) || value <5 || value >3600){
          callback(new Error('请输入正确的有效区间内的时间'))
        }else{
          callback()
        }
      };
      return {
        time:[{required:true, validator: validate0, trigger: 'blur'}]
      }
    }
  },
  methods: {
    handlerSure(){
      console.log(this.form)
      this.dialogVisible=false;
      sessionStorage.setItem('time',this.form.time)
      sessionStorage.setItem('switch',this.form.switch);
      location.reload()

    },
    handlerClose(){
      this.dialogVisible=false;
      this.form={
        time:sessionStorage.getItem('time')?sessionStorage.getItem('time'): 10,
        switch:sessionStorage.getItem('switch')?JSON.parse(sessionStorage.getItem('switch')) :true
      }
    },
    handleOpen(){
      this.dialogVisible=true;
    },
    placeholderPic() {
      // 窗口字体自适应
      //  document.documentElement.style.fontSize=document.documentElement.offsetWidth/60+"px";
    },
    goHome() {
      this.$router.go(-1)
    },
    
  },
  mounted() {
    //  document.getElementsByClassName('nav')[0].remove()
    //  修改默认的最小宽度，大数据达到自适应
    document.getElementById('content').style.minWidth = '100%'
    var _this = this
    window.onresize = function () {
      //窗口改变时再次执行一次函数即可
      _this.placeholderPic()
    }
    let array=[
      { name: 'accesscControlData', params: { title: '视频数据' } },
      { name: 'warningData', params: { title: '报警数据' } },
      { name: 'accesscControlData', params: { title: '门禁数据' } },
      {name:'bigDataIndex'},
      { name: 'accesscControlData', params: { title: '对讲数据' } },
    ]
    let item=0;
    if(this.form.switch){
      setInterval(() => {
        this.setRouter=  this.$router.replace(array[item]);
        if(item >3 ) return item=0;
        item+=1
        
      },this.form.time*1000);
    }else{
      this.$router.replace({name:'bigDataIndex'})
    }
  },
  destroyed() {
    this.setRouter=null;
  },
  watch: {
    $route: {
      handler(val, old) {
        console.log('route', val.params.title)
        if (val.params.title) this.title = '-' + val.params.title
        else this.title = ''
      },
    },
  },
}
</script>
<style lang='less' scoped>
#content {
  width: 100% !important;
}
.content {
  margin: 0px;
  color: #fff;
  width: 100vw;
  height: 100%;

  background: sienna;
  background-image: url(../../../static/bigData/home-bg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
 
  nav {
    width: 100vw;
    height: 2.27vw;
 .logo {
      width: 12%;
      position: fixed;
      height: 2.27vw;
      display: flex;
      justify-content: space-around;
      align-items: center;
      left: 1%;
      top: 1%;
      img {
        width: 80%;
        height: 100%;
      }
        p{
        cursor: pointer;
        font-size: 14px;
        padding-left: 4%;
        border-left: 1px solid rgb(117,138,157);
      }
      button {
        border-width: 0px;
        width: 80px;
        height: 34px;
        color: #fff;
        background-color: rgba(45, 114, 211, 1);
        cursor: pointer;
      }
    }
    .homeTitle {
      width: 90%;
      margin: 0 auto;
      background-image: url(../../../static/bigData/nav-bar.png);
      height: 100%;
      box-sizing: border-box;
      display: flex;
      font-size: 18px;
      line-height: 2.27vw;
      font-weight: 700;
      -ms-flex-pack: justify;
      justify-content: center;
      background-size: 100% 100%;
      
      span {
        background: linear-gradient(to right,#3C8ACC,#13F9F6,#3C8ACC);
        -webkit-background-clip: text;
        color: transparent;
        text-fill-color: transparent;
        letter-spacing: 0.2vw;
      }
    }
    .iconRight{
      position:fixed;
      top: 1%;
      right: 1%;
      i{
        color:#069CEA;
        cursor: pointer;
        font-size: 20px;
      }
    }
  }
}
.ipt{
  width: 100px;
}
</style>