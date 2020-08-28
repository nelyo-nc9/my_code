<template>
  <div class="content">
    <div class="left-tree">
      <orgTree style="width:290" :lazyTreeApi="getAudioTreeApi" searchType="search" :lazyTreeSearchApi="getLazyTreeSearchApi"  :treeType="treeType"  treeLazyToggle iconToggle @onceClick="onceClick"></orgTree>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲平台管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{topTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-container">
        <div class="form-box">
          <div class="form-top">对讲平台信息</div>
          <div class="wrap-inp" style="position: absolute;z-index: -100; opacity: 0">
            <input type="text" name="">
            <input type="password" name="">
          </div>
          <div class="form-content">
            <el-form ref="addForm"
                size="mini"
                :model="formData"
                label-position="right"
                :rules="rules"
                label-width="115px">
              <el-form-item label="所属机构" class="form-group">
                <el-input disabled v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="所属重点部位" prop="keyPartId" class="form-group">
                <el-select v-model="formData.keyPartId" @change="keyPartChange">
                    <el-option
                      v-for="(item,index) in keyParts"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="对讲平台名称" prop='name' class="form-group">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="" class="form-group" style="height:35px;">
                <!-- <input type="text" style="visibility:hidden;"> -->
              </el-form-item>
              
              <el-form-item label="品牌" prop="brand" class="form-group">
                <el-select v-model="formData.brand">
                  <el-option v-for="(item,index) in brandList"
                    :key="index"
                    :label="item.data"
                    :value="item.data"
                    @click.native="getModelNumList(index)"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelNum" class="form-group">
                <el-select v-model="formData.modelNum" @change="changeModelNums">
                  <el-option v-for="(item,index) in modelList"
                    :key="index"
                    :label="item.data"
                    :value="item.data"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接入协议" prop="accessProtocol" class="form-group">
                <el-select v-model="formData.accessProtocol">
                  <el-option v-for="(item,index) in protocolList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="对讲平台唯一ID" prop="uniqueId" class="form-group">
                <el-input type="number" v-model="formData.uniqueId"></el-input>
              </el-form-item>
              <el-form-item label="对讲平台IP地址*" prop="ip" class="form-group">
                <el-input placeholder=""
                          v-model="formData.ip"></el-input>
              </el-form-item>
              <el-form-item label="终端接收端口" prop="port" class="form-group">
                <el-input type="number" v-model="formData.port"></el-input>
              </el-form-item>
              <el-form-item label="服务器接收端口" class="form-group" prop="cport">
                <el-input type="number" placeholder=""
                          v-model="formData.cport"></el-input>
              </el-form-item>
              <el-form-item label="级联音频端口" class="form-group" prop="dport">
                <el-input type="number" v-model="formData.dport"></el-input>
              </el-form-item>

              <el-form-item label="对讲平台用户名" prop='username' class="form-group">
                <el-input placeholder=""
                          v-model="formData.username"></el-input>
              </el-form-item>
              <el-form-item label="对讲平台密码" prop='password' class="form-group">
                <el-input type="password" v-model="formData.password" autocomplete="new-password"></el-input>
              </el-form-item>

              <el-form-item label="资产编码" class="form-group">
                <el-input placeholder=""
                          v-model="formData.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="接入服务器" prop="accessService" class="form-group">
                <el-select v-model="formData.accessService" value-key="service">
                  <el-option v-for="(item,index) in DA_serverList"
                              :key="index"
                              :label="item.service"
                              :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right"></div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right"></div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right"></div>
          </div>
        </div>
        <div class="bottom-btn">
          <el-button type="primary" size="mini" @click="savePlatform">保存</el-button>
          <el-button size="mini" @click="skipToList">取消</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import CenterTree from '../../../components/CenterTree'
import { createTalkbackListApi, getTalkbackListApi,getBrandModuleApi,getAudioHostlistApi,getServerListallApi,getServerListApi } from '@src/http/audioManage/talkback.api.js'
import orgTree from "@src/components/tree/treeBox"
import { getAudioTreeApi, fuzzySearchTreeApi } from "@src/http/audioManage/audioTree.api.js"
import { mapMutations , mapActions, mapState } from 'vuex'
import audioRules from 'assets/rules/validation/security/audio'

export default {
  components: {
     CenterTree,
     orgTree
  },
  props: {
    // 新建查看页面 可以 带着数据 跳转至 新建页面
    detailData: {
      type: Object,
      require: true
    },
    // 来源界面
    pagetype:{
      type:String,
    }
  },
  data() {
    return {
      treeType:2,
      formData: {
        // 表单数据
        orgName:"",
        // subsystem:"对讲子系统",//所属子系统
        brand:"",//品牌
        accessProtocol:'',//接入协议
        ip:"",//对讲IP地址
        cport:'',//服务器接收端口
        username:'',//对讲用户名
        assetCode:'',//资产编码
        status:"",//在线状态
        keyPartName:'',//所属重点单位
        name:"",//
        modelNum:'',//型号
        sdk:'',
        uniqueId:"",//对讲平台唯一ID
        port:"",//终端接收端口
        dport:'',//级联音频端口
        password:"",//对讲平台密码
        accessService:'',//接入服务器
        // runStatus:'',//运行状态
        orgId:"",
        keyPartId:"",
        subSystem:4,
        keyPartIdType:"1",
        updatedBy: this.updatedBy,
        updatedDept:  this.updatedDept,
        updatedAt:  this.updatedAt,
        // id: this.formData.orgId || '',
        // name: this.formData.orgName || ''
      },
      rules: audioRules.intercomPlatformRules,
      keyParts:[],
      keyPartName:[],
      tableData:[],
      tableDatas:[],
      protocol:[],
      brandList: [],  // 品牌 列表
      stlist:[
        { label:'在线',value:"2"},
        { label:'离线',value:'1'},
        { label:'未知',value:'3'}
      ],
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],
      modelList:[
        // { label: '型号A', value: '型号A' },
        // { label: '型号B', value: '型号B' }
      ],
      serverList:[],  // 全部服务数据
      dropdownStatus: {
        detector: true
      },
      talkback:{
        detector: true
      },
      maiTableColumn: [
        //台麦
        { prop: 'name', label: '台麦名称', width: '' },
        { prop: 'uniqueId', label: '台麦唯一ID', width: '' },
        { prop: 'ip', label: '台麦IP', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'online', label: '在线状态', width: '' },
        // { prop: 'operationPlatform', label: '运行状态', width: '' }
      ],
      hostTableColumn: [
        //对讲主机
        { prop: 'name', label: '对讲主机名称', width: '100' },
        { prop: 'uniqueId', label: '对讲主机唯一ID', width: '100' },
        { prop: 'ip', label: '对讲主机IP', width: '1100' },
        { prop: 'brand', label: '品牌', width: '50px' },
        { prop: 'modelNum', label: '型号', width: '50' },
        { prop: 'inputNumber	', label: '对讲通道数量', width: '' },
        { prop: 'outputNumber', label: '输出通道数量', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'status', label: '在线状态', width: '' },
        // { prop: 'status', label: '运行状态', width: '' }
      ],
      isEditDetector: false, // 新增or修改
      // 弹窗新数据收集
      detectorData: {},
      //将要修改的弹窗数据
      editData: {},
      topTitle: '新建',
      // orgObj: {
      //   id: this.formData.orgId || '',
      //   name: this.formData.orgName || ''
      // },
    }
  },
  watch:{
   
  },
  computed:{
    ...mapState({
      // detailData: ({ powerManage }) => powerManage.detailData[0]
    }),

    DA_serverList(){
      var list = JSON.parse(JSON.stringify(this.serverList));
      var list2 = [];
      list.forEach( (item) => {
        if(item.talkBackId && item.talkBackId != ''){
          list2.push(item);
        }
      })
      return list2;
    },

    // 录入时间
    updatedAt(){
      return this.getNow();
    },

    // 录入机构
    updatedDept(){
      return JSON.parse(sessionStorage.getItem('user')).orgName;
    },

    // 录入人
    updatedBy(){
      return JSON.parse(sessionStorage.getItem('user')).name;
    },
    
  },
  methods: {
     ...mapActions('talkback',{
      getTalkbackList:'getTalkbackList'
    }),

    // 获取服务器列表
     getserver(){
        let _this = this
        getServerListallApi().then(res => {
          let tabData = res.data.map(item => {
            return { service: item, id: '', talkBackId: '' }
          })
          getServerListApi().then(res => {
            let seveData = res.data.data
            // seveData.reverse()
            for (let v of tabData) {
              let index = seveData.findIndex(value => value.service == v.service)
              if (index > -1) {
                if(seveData[index].talkBackId && seveData[index].talkBackId != ''){
                  v.service = seveData[index].service
                  v.id = seveData[index].id
                  v.talkBackId = seveData[index].talkBackId
                }
              }
            }
            _this.serverList = tabData;
          })
        })
     },

     keyPartChange(data) {
      let selectData = this.keyParts.filter(i => i.value === data)[0]
       this.$forceUpdate()
      this.formData.keyPartType = selectData.type
    },

    // 机构资源树
    getAudioTreeApi(params) {
      return getAudioTreeApi(params)
    },

    // 机构资源树 模糊搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem : 4,     //子系统【1:视频,2.报警,3.门禁,4.音频,5.防护舱,6.停车场,7.电视墙,8.消防】
        key: params.search
      }
      return fuzzySearchTreeApi(params)
    },

    // 获取品牌列表
    getBrand(){
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '1' }];
       getBrandModuleApi({queryList}).then(res=>{
        this.brandList=res.data.data[0].attr;
       })
    },

    // 根据品牌 获取相应的型号
    getModelNumList(index) {
      let queryList = [{ type: '1', moduleId: '1', childModuleId: '3', dictId: '2' }]
       getBrandModuleApi({queryList}).then(res=>{
          this.modelList=res.data.data[0].attr
          let brand=this.brandList;
          this.AllmodelList=this.modelList
          let modelList= this.modelList;
          let data1=brand[index].data;
            
            let arr=[]
            modelList.filter((v)=>{
            if(v.homeClass==data1){  
              arr.push(v);
            }
          this.modelList=arr;
         })
       })
    },

    // 根据型号获取相应的 sdk
    changeModelNums(index) {
      this.modelList.forEach(item => {
        if (index == item.data) {
          this.formData.sdk = item.sdkName || ''
        }
      })
    },

    // 点击机构返回重点部位的下拉，记录当前节点的信息
    onceClick(data, node) { 
      if (data.tierType === 'org') {
        this.formData.orgId = data.id;
        this.formData.orgName = data.name;
        this.formData.keyPartId = '';

        this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚修改后对配置的影响
      } else {
        let parentNode = node.parent
        if (!parentNode) { return }
        this.formData.orgId = (parentNode.data && node.parent.data.id) || '';
        this.formData.orgName = (parentNode.data && node.parent.data.name) || '';
        this.getKeyPartSelect(parentNode.data.serial, data.id)
      }
    },
    getKeyPartSelect(oId, kId) { // 获取机构下的重点部位
      this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: "4",
        isRecursion:"0"
      }
      this.getAudioTreeApi(params).then((res) => {
        if (res.data.code === 0) {
          if (kId) {
            this.formData.keyPartId = kId
          }
          let data = res.data.data.nodes
          if(data){
            data.forEach((item) => {
              if (item.tierType === 'loc') {
                this.keyParts.push({
                  label: item.name,
                  value: item.id,
                  type: item.keyPartType
                })
              }
            })

            // 判断当前重点部位是否有已选的部位（可能已被删除）
            var is_exist = this.keyParts.some(item=>{
              return item.value == kId;
            })
            if(!is_exist){
              this.keyParts.push({
                label: this.formData.keyPartName,
                value: this.formData.keyPartId,
              })
            }
          }else{
            this.keyParts.push({
              label: this.formData.keyPartName,
              value: this.formData.keyPartId,
            })
          }
          
        }
      })
    },
    getKeyPartName(id) { // 通过重点部位id，得到重点部位的名称
      let keyPartId = ''
      this.keyParts.forEach((item) => {
        if (item.value === id) {
          keyPartName = item.label
          this.formData.keyPartType = item.type
        }
      })
      return name
    },
    ...mapMutations(['AUDIO_TAB']),
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    talkbackbtn(key){
      this.talkback[key] = !this.talkback[key]
    },
    // 取消跳转到列表页
    skipToList() {
      // this.AUDIO_TAB('IntercomPlatform-List')
      this.$emit('modelChange','list', 'cancel');
    },
    // 重置
    reset() {
      this.formData = { ...this.obj }
      this.value = []
    },
    deleteModal() {
      console.log(this.editData[0])
      //this.parkHostList.remove(this.editData[0])
    },
   
    // 保存
    // ...mapActions(["createTalkbackList"]),
    savePlatform(){
      // console.log(this.formData);
      // var obj = {
      //   accessProtocol: "建行协议",
      //   assetCode: "123456",
      //   brand: "世邦",
      //   cport: "100",
      //   dport: "100",
      //   ip: "14.12.12.12",
      //   keyPartId: "13",
      //   modelNum: "世邦平台",
      //   name: "对讲平台测试",
      //   orgId: "7",
      //   orgName: "建行芜湖市分行（汇总）",
      //   password: "100",
      //   port: "100",
      //   uniqueId: "1245",
      //   username: "10",
      //   id: "293"
      // }
      
      // this.$emit('modelChange','examinelook',obj);
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let {brand,username,orgId,keyPartId,orgName,name,keyPartName,accessProtocol,ip,cport,assetCode,modelNum,sdk,uniqueId,port,dport,password,accessService} =this.formData;
          console.log(name.length)
          // 对讲平台修改非必填项（服务器接收端口）超过65535验证
          if(cport>65535){
            this.$message.error('服务器接收端口不能大于65535');
            return false;
          }
          // 对讲平台修改非必填项（终端接收端口）超过65535验证
          if(port>65535){
            this.$message.error('终端接收端口不能大于65535');
            return false;
          }

          // 对讲平台修改非必填项（级联音频端口）超过65535验证
          if(dport>65535){
            this.$message.error('级联音频端口不能大于65535');
            return false;
          }

          // 验证ip地址是否正确
          if(!this.isValidIP(ip)){
            this.$message.error('ip地址不合法，请重新填写');
            return false;
          }

          let obj={
            orgId:orgId,
            orgName:orgName,
            keyPartId:keyPartId,
            keyPartIdType:"1",
            brand:brand,//品牌
            accessProtocol:accessProtocol,//接入协议
            ip:ip,//对讲IP地址
            cport:cport,//服务器接收端口
            username:username,//对讲用户名
            keyPartName:keyPartName,
            assetCode:assetCode,//资产编码
            status:status,//在线状态
            // keyUnit:'监控中心',//所属重点单位
            name:name,//
            modelNum:modelNum,//型号
            sdk:sdk,  // 型号所对应的 sdk
            uniqueId:uniqueId,//对讲平台唯一ID
            accessServiceId:this.formData.accessService.talkBackId,
            port:port,//终端接收端口
            dport:dport,//级联音频端口
            password:password,//对讲平台密码
            accessService:this.formData.accessService.service,
          }
          console.log(obj)
          createTalkbackListApi(obj).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '新建成功',
                type: 'success'
              });
              this.formData.id = res.data.data.id;
              console.log(this.formData)
              // 跳转 新建查看 页面
              this.$emit('modelChange','examinelook',this.formData);
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },

    // 验证ip地址
    isValidIP(ip) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip);
    }, 
    // 获取当前时间
    getNow(){
      var date=new Date();
      var year=date.getFullYear();  //年
      var month=date.getMonth()+1;  //月
      month = month<10 ? '0'+month : month;
      var day=date.getDate();  //日
      day = day<10 ? '0'+day : day;
      var hh=date.getHours();  //时
      hh = hh<10 ? '0'+hh : hh;
      var mm=date.getMinutes();  //分
      mm = mm<10 ? '0'+mm : mm;
      var ss=date.getSeconds();  //秒
      ss = ss<10 ? '0'+ss : ss;
      var rq=year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss;
      return rq;
    },

  },
  created() {
    this.reset();
    this.getBrand();
    this.getserver();

    // 新建查看页面 点击 复制 即可以带着数据来 新建页面
    if(this.pagetype == 'examinelook' && this.detailData && this.detailData != ''){
      this.formData = this.detailData;
      this.formData.id = '';
      console.log(this.detailData.orgId)
      console.log(this.detailData.keyPartId)
      this.getKeyPartSelect(this.detailData.updatedDeptId,this.detailData.keyPartId)
    }
  },
  beforeDestroy(){
  },
}
</script>


<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 290px;
    // border-right: 1px solid #e1e1e1;
  }
  .right-content {
    font-size: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 6px 20px;
    // margin-left:30px;
    .form-container{
      width: 952px;
      padding-top: 15px;
      .form-box {
        .form-top {
          font-size: 12px;
          line-height: 35px;
          text-align: center;
        }
        
        .form-content {
          overflow: hidden;
          padding: 12px 12px 5px;
          font-size: 12px;
          // border: 1px solid #f7f2f1;
          background:rgba(245,245,245,1);
          /deep/.el-select {
            width: 100%;
          }
          /deep/.el-select > .el-input {
            width: 100%;
          }
          .form-group{
            width: 50%;
            float:left;
            margin-bottom: 14px;
          }
        }
        .buttom-box{
          height:300px;
          margin-top:20px;
        }
      }
    }
    
    .bottom-btn {
      // width: 846px;
      text-align: center;
      margin-left:12px;
      margin-top:20px;
      padding:20px 0;
      /deep/.el-button--mini{
        width:93px;
      }
    }
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-top: 20px;
      i {
        position: absolute;
        top: 50%;
        left: 100px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 120px;
        margin-top: -12px;
      }
    }
    .pointer {
      cursor: pointer;
      display: inline-block;
      width: 120px;
    }
  }
  .detail-bottom {
      height: 35px;
      color: #212121;
      line-height: 33px;
      border: 1px solid #E1E1E1;
      display: flex;
      flex-wrap: wrap;
      margin-top: 30px;
      .detail-item {
        display: flex;
        width: 33.3%;
        .item-left {
          width: 111px;
          background: #F5F5F5;
          text-align: center;
        }
        .item-right {
          flex: 1;
          border-left: none;
          text-align: center;
        }
      }
    }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
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
}
</style>