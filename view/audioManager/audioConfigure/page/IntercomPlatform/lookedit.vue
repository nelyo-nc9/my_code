<template>
  <div class="main">
    <div class="form-box" v-if="activeCreate">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>音频管理</el-breadcrumb-item>
            <el-breadcrumb-item>对讲管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
            <el-breadcrumb-item>修改</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-top">对讲设备信息</div>
        <div class="form-content">
              <div class="left-form">
                <el-form ref="addForm"
                        size="mini"
                        :model="formData"
                        label-position="right"
                        label-width="120px">
                 <el-form-item label="所属机构">
                  <el-input disabled
                            v-model="formData.orgName"></el-input>
                </el-form-item>
                <el-form-item label="对讲平台名称*">
                  <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="品牌*">
                  <el-select v-model="formData.brand">
                    <el-option v-for="item in brandList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="接入协议*">
                  <el-select v-model="formData.accessProtocol">
                    <el-option v-for="item in protocolList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="对讲平台IP地址*">
                  <el-input placeholder=""
                            v-model="formData.ip"></el-input>
                </el-form-item>
                <el-form-item label="服务器接收端口">
                  <el-input placeholder=""
                            v-model="formData.port"></el-input>
                </el-form-item>
                <el-form-item label="对讲平台用户名*">
                  <el-input placeholder=""
                            v-model="formData.username"></el-input>
                </el-form-item>
                <el-form-item label="资产编码">
                  <el-input placeholder=""
                            v-model="formData.assetCode"></el-input>
                </el-form-item>
                <el-form-item label="在线状态">
                  <el-input disabled
                            v-model="formData.status"></el-input>
                </el-form-item>
                </el-form>
              </div>
              <div class="right-form">
                <el-form size="mini"
                        :model="formData"
                        label-position="right"
                        label-width="120px">
                  <el-form-item label="所属重点部位">
                  <el-input disabled
                              v-model="formData.keyPartName"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <input type="text" style="visibility:hidden;">
                </el-form-item>
                <el-form-item label="型号*">
                  <el-select v-model="formData.modelNum">
                    <el-option v-for="item in modelList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="对讲平台唯一ID*">
                  <el-input v-model="formData.uniqueId"></el-input>
                </el-form-item>
                <el-form-item label="终端接收端口"
                              >
                  <el-input v-model="formData.dprot"></el-input>
                </el-form-item>
                <el-form-item label="级联音频端口"
                              >
                  <el-input v-model="formData.cprot"></el-input>
                </el-form-item>
                <el-form-item label="对讲平台密码"
                              >
                  <el-input type="password" v-model="formData.password" autocomplete="new-password"></el-input>
                </el-form-item>
                 <el-form-item label="接入服务器">
                  <el-select v-model="formData.accessServer">
                    <el-option v-for="item in serverList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="运行状态">
                  <el-input disabled v-model="formData.status"></el-input>
                </el-form-item> -->
                </el-form>
              </div>
        </div>
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer"
                      @click="toggleOpen('detector')">
                  台麦列表
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div v-if="dropdownStatus.detector"
                  style="width:100%;">
                   <div class="list-header">
                    <i class="el-icon-download" title="获取通道信息"></i>
                    <i
                      class="el-icon-circle-plus-outline"
                      title="新增"
                      @click="dialogStatus.videoChanModal = true"
                    ></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除"></i>
                    <i class="el-icon-refresh-right" title="刷新"></i>
                  </div>
                <el-table 
                          border
                          style="width: 100%"
                          height="145"
                          size="mini"
                          stripe>
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index"
                                  label="序号">
                  </el-table-column>
                  <el-table-column v-for="item in tableData"
                                  :key="item.label"
                                  :prop="item.prop"
                                  :label="item.label"
                                  show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>
        <div class="bottom-box">
            <div style="width:100%;">
              <div class="box-title">
                <span class="pointer"
                      @click="talkbackbtn('detector')">
                  对讲主机列表
                  <i :class="talkback.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div v-if="talkback.detector"
                  style="width:100%;">
                  <div class="list-header">
                    <i class="el-icon-download" title="获取通道信息"></i>
                    <i
                      class="el-icon-circle-plus-outline"
                      title="新增"
                      @click="dialogStatus.videoChanModal = true"
                    ></i>
                    <i class="el-icon-edit" title="编辑"></i>
                    <i class="el-icon-delete" title="删除"></i>
                    <i class="el-icon-refresh-right" title="刷新"></i>
                  </div>
                <el-table 
                          border
                          style="width: 100%"
                          height="145"
                          size="mini"
                          stripe>
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index"
                                  label="序号">
                  </el-table-column>
                  <el-table-column v-for="item in tableData"
                                  :key="item.label"
                                  :prop="item.prop"
                                  :label="item.label"
                                  show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </div>
        <div class="bottom-btn">
          <el-button type="primary"
                     size="mini"
                     @click="savePlatform">保存</el-button>
          <el-button size="mini"
                     @click="skipToList">取消</el-button>
          <el-button size="mini"
                     @click="reset">重置</el-button>
        </div>
     </div>
  </div>
</template>
<script>
import {mapMutations} from "vuex"
export default {
  components: {
   
  },
  props:["formDatas"],
  data() {
    return {
      activeCreate: true,
      activePrint: false,
      formData: {
        // 表单数据
        orgName: '',
        // subSystemName:"",//所属子系统
        brand:"",//品牌
        accessProtocol:'',//接入协议
        ip:"",//对讲IP地址
        port:'',//服务器接收端口
        userName:'',//对讲用户名
        assetCode:'',//资产编码
        status:"",//在线状态
        keyPartName:'',//所属重点单位
        name:"",//
        modelNum:'',//型号
        uniqueId:"",//对讲平台唯一ID
        dport:"",//终端接收端口
        cport:'',//级联音频端口
        password:"",//对讲平台密码
        server:'',//接入服务器
        // status:'',//运行状态
      },
       protocol:[
        { label: '北京分行', value: '北京分行' },
           
      ],
      brandList: [
        // 品牌
        { label: '全部', value: '全部' },
        { label: '海康', value: '海康' },
        { label: '大华', value: '大华' }
      ],
      protocolList:[
         { label: '建行协议', value: '建行协议' },
         { label: '私有协议', value: '私有协议' }
      ],
      modelList:[
        
      ],
      serverList:[
         { label: '接入服务器1', value: '接入服务器1' },
         { label: '接入服务器2', value: '接入服务器2' }
      ],
      dropdownStatus: {
        detector: true
      },
      talkback:{
        detector: true
      },
      tableData: [
        { prop: 'name', label: '对讲主机名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'IP', label: 'IP地址', width: '' },
        { prop: 'port', label: '端口', width: '' },
        { prop: 'state', label: '在线状态', width: '' },
        { prop: 'parking', label: '车场', width: '' }
      ],
    }
  },
  methods: {
    //点击关闭回到列表
    savePlatform(){},
    reset(){},
    skipToList(){
       this.$emit("close")
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    talkbackbtn(key){
      this.talkback[key] = !this.talkback[key]
    },
    // 新增/编辑主机(弹窗)的保存按钮
    dialogSave(val) {
      console.log(val)
      if (val == '新增停车主机') {
        this.parkHostList.push(this.detectorData)
      } else {
        this.editData = this.detectorData
      }
      this.isEditDetector = false
      this.detectorData = {}
    },
    
  },
  mounted(){
    console.log(this.formDatas)
    this.formData =this.formDatas
    // this.formData=this.formDatas
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  margin-left:20px;
  .content-btn {
    margin: 10px 0;
  }
  .form-box {
    width:1000px;
    padding-top: 3px;
    .button-box{
      margin-top:10px;
    }
    .form-top {
      width: 846px;
      text-align: center;
      padding: 10px 0;
      font-size: 15px;
    }
    .form-content {
        // display: flex;
        width: 846px;
        height: 300px;
        padding: 10px;
        font-size: 12px;
        border: 1px solid #f7f2f1;
        /deep/.el-select > .el-input {
          width: 280px;
        }
        .left-form {
          float: left;
          width: 400px;
          margin-right: 24px;
        }
        .right-form {
          float: left;
          width: 400px;
        }
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
    .list-header {
        text-align: right;
        i {
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
          height: 20px;
          line-height: 20px;
        }
      }
    .buttom-box{
        height:300px;
        margin-top:20px;
      }
    .bottom-btn {
      margin-top: 12px;
      width: 846px;
      text-align: center;
    }
}
</style>
<style lang="less">
.main {
  .form-box {
    .left-form,
    .right-form {
      .el-form-item--mini.el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        border: 1px solid #fff;
      }
    }
  }
}
</style>
