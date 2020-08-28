<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <!-- 定位图标 -->
      <div class="location-icon float-left">
        <span class="el-icon-location-outline"></span>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
        <el-breadcrumb-item>短信系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>短信平台配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="message-container">
      <!-- 短信平台配置 -->
      <!-- 非编辑状态下 显示编辑按钮 -->
      <div class="message-set-wrap" v-show="!is_edit">
        <el-button @click="edit">编辑</el-button>
      </div>
      <div style="width:80%;margin:0 auto;">
        <p class="message-set-title">短信平台配置</p>
        <!-- 短信平台配置 信息 -->
        <div class="message-set-content">
          <div class="message-set-item">
            <div class="message-set-label">httpURL</div>
            <div class="message-set-main">
              <el-input class="inp" v-model="httpUrl" v-if="is_edit"></el-input>
              <span v-else>{{httpUrl}}</span>
            </div>
          </div>
          <div class="message-set-item">
            <div class="message-set-label">是否启用</div>
            <div class="message-set-main" v-if="is_edit">
              <el-radio v-model="isPush" label="1">是</el-radio>
              <el-radio v-model="isPush" label="2">否</el-radio>
            </div>
            <div class="message-set-main" v-else>
              <span v-if="isPush == 1">是</span>
              <span v-if="isPush == 2">否</span>
            </div>
          </div>
        </div>

        <!-- 录入人 信息 -->
        <div class="userInfo-content">

          <div class="message-set-item" style="width:30%">
            <div class="message-set-label">录入时间</div>
            <div class="message-set-main">
              <span>{{ time }}</span>
            </div>
          </div>
          <div class="message-set-item" style="width:40%">
            <div class="message-set-label">录入机构</div>
            <div class="message-set-main">
              <span>{{ org }}</span>
            </div>
          </div>
          <div class="message-set-item" style="width:30%">
            <div class="message-set-label">录入人</div>
            <div class="message-set-main">
              <span>{{ user }}</span>
            </div>
          </div>

        </div>
      </div>
      <!-- 底部按钮 -->
      <!-- 编辑状态下显示 -->
      <div class="submit-btn-container" v-if="is_edit">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="close">取消</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import {
  getBusinessSysLinkageRssmApi,setBusinessSysLinkageRssmApi
} from '@src/http/businessLinkage/business.api.js'

export default {
  data() {
    return {
      is_edit:false,  // 是否编辑 默认false
      httpUrl:'',   // 推送地址  url
      isPush:'1',  //是否启用 短信 推送 默认为启用1 
      // user:'',  //录入人
      // org:'',  //录入机构
      // time:'',  //录入时间
      time_done:'',  //上次录入时间
    }
  },
  computed:{
    //录入人
    user(){
      return JSON.parse(window.sessionStorage.getItem("user")).name;
    },
    //录入机构
    org(){
      return JSON.parse(window.sessionStorage.getItem("user")).orgName;
    },
    //录入时间
    time(){
      if(this.is_edit){
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        var day = now.getDay();//得到周几
        var hour = now.getHours();//得到小时
        var minu = now.getMinutes();//得到分钟
        var sec = now.getSeconds();//得到秒
        var MS = now.getMilliseconds();//获取毫秒
        var week;
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        // if （MS < 100）MS = "0" + MS;
        // var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
        // week = arr_week[day];
        var time = "";
        time = year + "-" + month + "-" + date + "-" + " " + hour + ":" + minu + ":" + sec + " ";
        
        //设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
        // var timer = setTimeout("writeCurrentDate()", 1000);
        return time;
      }else{
       return  this.time_done;
      }
      
    },

  },
  methods: {
    // 获取配置
    getBusinessSysLinkageRssm(){
      var params = {
        type:'2',
      };
      getBusinessSysLinkageRssmApi(params).then( res => {
        if(res.data.code == 0){
          this.httpUrl = res.data.data.httpUrl;
          this.id = res.data.data.id;
          this.isPush = res.data.data.isPush;
          this.time_done = res.data.data.time;
          // this.$notify({
          //   title: '提示',
          //   message: '查询成功',
          //   type:'success',
          //   position: 'bottom-right'
          // });

        }
      }).catch( error => {

      });
    },

    // 设置配置
    setBusinessSysLinkageRssm(){
      var params = {
        type:'2',
        httpUrl:this.httpUrl,
        isPush:this.isPush,
        org:this.org,
        user:this.user,
        time:this.time,
      };
      setBusinessSysLinkageRssmApi(params).then( res => {
        if(res.data.code == 0){
          this.is_edit=false;
          this.$notify({
            title: '提示',
            message: '短信平台配置成功',
            type:'success',
            position: 'bottom-right'
          });
        }
      }).catch( error => {

      });
    },

    // 编辑
    edit(){
      this.getBusinessSysLinkageRssm();
      this.is_edit=true;
    },

    // 保存
    save(){
      if(this.httpUrl && this.org && this.user && this.time){
        this.setBusinessSysLinkageRssm();
      }else{
        this.$notify({
          title: '警告',
          message: '请填入数据',
          type: 'warning'
        });
      }  
    },
    // 重置
    reset(){
      this.httpUrl = '';
      // this.is_edit=false;
    },

    // 取消
    close(){
      this.is_edit=false;
    }
  },
  
  created(){
    this.getBusinessSysLinkageRssm();
  },
  mounted(){},
  beforeDestroy() {
    
  },
}
</script>

<style scoped lang="less">
    .message-container{
      padding:0 20px;
    }
    .message-set-wrap{
      padding:30px 0 0 0;
    }
    .message-set-title{
      font-size: 14px;
      line-height: 50px;
      text-align: center;
    }
    .message-set-content{
      font-size: 14px;
      color: #303133;
      line-height: 38px;
      margin-top:14px;
      border: 1px solid #DCDFE6;
    }
    .message-set-item{
      width: 100%;
      font-size: 14px;
      color: #303133;
      line-height: 38px;
      display: flex;
      display: -webkit-flex;
      margin: 2px 0;
    }
    .message-set-item .message-set-label{
      width: 100px;
      text-align: center;
      background-color: #eee;
    }
    .message-set-item .message-set-main{
      flex: 1;
      padding-left:15px;
      border: 1px solid #cccccc;
    }

    .userInfo-content{
      width: 100%;
      display: flex;
      display: -webkit-flex;
      border: 1px solid #DCDFE6;
      margin-top:20px;
    }

    .submit-btn-container{
      display: flex;
      display: -webkit-flex;
      justify-content:center;
      padding:15px 0;
    }
    .location-icon{
      font-size: 18px;
      float: left;
      margin-top:-4px;
    }
</style>