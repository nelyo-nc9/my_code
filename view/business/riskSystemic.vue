<template>
  <div>
    <div class="navmenu">
      <el-row class="tac">
        <el-col :span="25">
          <el-menu
            default-active="ridkMenu"
            :default-openeds="openeds"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            @open="handleOpen"
            @close="handleClose">
            <el-submenu index="1">
              <template slot="title">
                <span>风险RAD系统对接</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="riskform('riskSystemic')">RAD配置</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-2">
                <template slot="title">报警推送策略</template>
                <el-menu-item index="1-2-1">新建</el-menu-item>
                <el-menu-item index="1-2-2">列表</el-menu-item>
                <el-menu-item index="1-2-3">查询</el-menu-item>
              </el-submenu>
              <el-submenu index="1-3">
                <template slot="title">AI任务管理</template>
                <el-menu-item index="1-3-1">新建</el-menu-item>
                <el-menu-item index="1-3-2">列表</el-menu-item>
                <el-menu-item index="1-3-3">查询</el-menu-item>
              </el-submenu>
              <el-submenu index="1-4">
                <template slot="title">报警推送日志</template>
                <el-menu-item index="1-4-2">列表</el-menu-item>
                <el-menu-item index="1-4-3">查询</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  <div id="riskSystemic">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>RAD配置</el-breadcrumb-item>
      <el-breadcrumb-item>配置</el-breadcrumb-item>
    </el-breadcrumb>    
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
        <div class="footsection">
          <div>
            <span>录入时间</span>
            <span>2020-02-20  15:00:00</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>xxxxxxxx机构名称</span>
          </div>
          <div>
            <span>录入人</span>
            <span>张三</span>
          </div>
        </div>
      </div>
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
        <div class="footsection">
          <div>
            <span>录入时间</span>
            <span>2020-02-20  15:00:00</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>xxxxxxxx机构名称</span>
          </div>
          <div>
            <span>录入人</span>
            <span>张三</span>
          </div>
        </div>
        <div class="buttonsection">
          <el-row class="rowbutton">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="close">关闭</el-button>
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
        openeds: ['1','2'],
        ridkMenu: 'RiskSystemic'
      };
    },
    methods:{
       riskform(componentName) {
        this.ridkMenu = RiskSystemic
      },
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
  #riskSystemic{
    position: absolute;
    top: 80px;
    left: 200px;
  }
  // 菜单收缩栏样式(关闭时)
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>