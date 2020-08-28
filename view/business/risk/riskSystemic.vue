<template>
  <div>
  <div id="riskSystemic">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>RAD配置</el-breadcrumb-item>
      <el-breadcrumb-item>配置</el-breadcrumb-item>
    </el-breadcrumb>

      <!-- 目标RSSM设置（确定）     -->
      <div class="configuration" v-if="iscentersection">
        <div class="headstart">
          <el-row class="rowbutton">
            <el-button @click="redact">编辑</el-button>
          </el-row>
          <p>目标RSSM设置</p>
        </div>
        <div class="centersection" >
          <div>
            <span>httpURL</span>
            <span>http://127.0.0.1/rad/up</span>
          </div>
          <div>
            <span>启用推送配置</span>
            <span><el-radio v-model="radio" label="1">是</el-radio></span>
          </div>
        </div>

        <!-- 录入信息 -->
        <div class="footsection">
          <div>
            <span>录入时间</span>
            <span>{{foot.time}}</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>{{foot.institution}}</span>
          </div>
          <div>
            <span>录入人</span>
            <span>{{foot.name}}</span>
          </div>
        </div>
      </div>

      <!-- 目标RSSM设置（选择） -->
      <div class="setting" v-if="issetting">
        <div class="headstart">
          <p>目标RSSM设置</p>
        </div>
        <div class="centerportion">
          <div>
            <span>httpURL*</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
          <div>
            <span>启用推送配置*</span>
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
          </div>
        </div>

        <!-- 录入信息 -->
        <div class="footsection">
          <div>
            <span>录入时间</span>
            <span>{{foot.time}}</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>{{foot.institution}}</span>
          </div>
          <div>
            <span>录入人</span>
            <span>{{foot.name}}</span>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="buttonsection">
          <el-row class="rowbutton">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="close">取消</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
      return {
        radio: '1',
        input: '',
        iscentersection:true,
        issetting:false,
        foot:{
          time:'2020-02-20  15:00:00',
          institution:'xxxxxxxx机构名称',
          name:'张三'
        }
      };
    },
    methods:{
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      redact(){
        this.iscentersection =false;
        this.issetting=true;
      },
      close(){
        this.iscentersection=true;
        this.issetting=false;
      },
      reset(){
        this.input="";
        this.radio="1";
      },
      save(){
        this.iscentersection=true;
        this.issetting=false;
      }
    }
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    padding-left: 40px;
    margin: 10px 0;
  }
  .rowbutton{
    margin-left: 40px;
    margin-top: 20px;
    float: left;
  }
  .configuration{
    width: 1027px;
  }
  .headstart p{
    text-align: center;
    font-size: 16px;
    line-height: 80px;
  }
  .centersection{
    width: 100%;
    height: 100px;
    margin-left: 20px;
    border: 1px solid black;
  }
  .centersection div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 100px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .footsection{
    width: 100%;
    border: black solid 1px;
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
  }
  .footsection div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 100px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .footsection div span:last-child{
    display: inline-block;
    width: 220px;
    text-align: center;
  }
  .setting{
    width: 1027px;
  }
  .centerportion{
    width: 100%;
    height: 100px;
    margin-left: 20px;
    border: 1px solid black;
  }
  .centerportion div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 100px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .el-input{
    width: 910px;
    margin-right: 5px;
    display: inline-block;
  }
  .buttonsection{
    display: flex;
    justify-content: center;
  }
  // 菜单收缩栏样式(关闭时)
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>