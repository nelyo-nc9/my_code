<template>
  <div class="org-manage-create-modify-box">
    <div class="header" v-show="isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>制度和安全</el-breadcrumb-item>
        <el-breadcrumb-item>规章制度管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" v-show="isShowInfo==false">
      <div class="main" id="contentinfo">
        <div class="main-box">
          <div class="box-title">制度管理信息表</div>
          <div class="main-box-center">
            <div class="center-li">
              <div class="li-item">
                <span>文件名<b>*</b></span>
                <el-input v-model="formData.name"></el-input>
              </div>
              <div class="li-item">
                <span>文号<b>*</b></span>
                <el-input v-model="formData.number"></el-input>
              </div>
              <div class="li-item">
                <span>文件来源<b>*</b></span>
                <el-select v-model="formData.source " placeholder="请选择">
                    <el-option value="行内"></el-option>
                    <el-option value="行外"></el-option>
                </el-select>
              </div>
            </div>
            <div class="center-li">
              <div class="li-item">
                <span>颁布级别<b>*</b></span>
                <el-select v-model="formData.level" placeholder="请选择">
                    <el-option value="总行"></el-option>
                    <el-option value="一级分行"></el-option>
                    <el-option value="二级分行"></el-option>
                    <el-option value="国家"></el-option>
                    <el-option value="省市"></el-option>
                    <el-option value="地市"></el-option>
                </el-select>
              </div>
              <div class="li-item">
                <span>文件种类<b>*</b></span>
                <el-select v-model="formData.type" placeholder="请选择">
                    <el-option value="制度"></el-option>
                    <el-option value="标准"></el-option>
                    <el-option value="预案"></el-option>
                    <el-option value="方案"></el-option>
                    <el-option value="操作规范"></el-option>
                    <el-option value="通知"></el-option>
                    <el-option value="意见"></el-option>
                    <el-option value="其他"></el-option>
                </el-select>
              </div>
              <div class="li-item">
                <span>发布单位<b>*</b></span>
                <el-input v-model="formData.company"></el-input>
              </div>
            </div>
            <div class="center-li">
              <div class="li-item">
                <span>发布时间<b>*</b></span>
                <el-input v-model="formData.time"></el-input>
              </div>
            </div>
            <div class="center-li2">
              <span class="li2-title">内容分类<b>*</b></span>
              <div class="li2-con">
                <el-checkbox v-for="item of checkboxData" :key="item.title" v-model="item.ischecked">{{item.title}}</el-checkbox>
              </div>
            </div>
            <div class="center-li3">
              <p class="li3-title">附件<b>*</b></p>
              <div class="li3-con">
                <p v-for="(item,index) in formData.enclosure" :key="index">
                  <span>{{item.fileName}}</span>
                  <b @click="delFiles(item, index)">×</b>
                </p>
              </div>
              <p class="li3-button" @click="openFile">浏览</p>
              <input type="file" @change="fileChange()"  style="display: none" ref="file">
            </div>
          </div>
          <div class="main-box-footer">
            <div class="footer-li">
              <span>录入时间</span>
              <el-input v-model="formData.enterTime" disabled></el-input>
            </div>
            <div class="footer-li">
              <span>录入机构</span>
              <el-input v-model="formData.enterMechanism" disabled></el-input>
            </div>
            <div class="footer-li">
              <span>录入人</span>
              <el-input v-model="formData.enterPerson" disabled></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <el-button class="baocun" plain size="small" @click="preservation">保存</el-button>
        <el-button  plain size="small" @click="dialogVisible = true">关闭</el-button>
        <el-button plain size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <!-- 关闭弹框 -->
    <div v-if="dialogVisible">
      <el-dialog title="关闭确认" :visible.sync="dialogVisible" width="30%">
        <span>请确认是否关闭？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogSave">确 定</el-button>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 查看 -->
    <Info v-show="isShowInfo==true" :isShowInfo.sync="isShowInfo" :formData="formData"></Info>
  </div>
</template>

<script>
import Info from './Info'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    addList: {
      type: Object
    }
  },
  components: {
    Info
  },
  data() {
    return {
      //查看显隐
      isShowInfo: false,
      //取消弹框
      dialogVisible: false,
      //表单数据
      formData: {
        name: '', //文件名
        number: '', //文号
        source: '', //文件来源
        level: '', //颁布级别
        type: '', //文件种类
        company: '', //发布单位
        time: '', //发布时间
        contentType : [], //内容分类
        enclosure: [], //附件
        enterTime: '', //录入时间
        enterMechanism: '', //录入机构
        enterPerson: '', //录入人
        validity: '有效' //有效性
      },
      //内容分类
      checkboxData:[
        {
          title: '基础管理',
          ischecked: false
        },
        {
          title: '技防',
          ischecked: false
        },
        {
          title: '消防',
          ischecked: false
        },
        {
          title: '物防',
          ischecked: false
        },
        {
          title: '营业网点',
          ischecked: false
        },
        {
          title: '办公楼',
          ischecked: false
        },
        {
          title: '机房',
          ischecked: false
        },
        {
          title: '金库',
          ischecked: false
        },
        {
          title: '自助服务区',
          ischecked: false
        },
        {
          title: '保管箱库',
          ischecked: false
        },
        {
          title: '装备',
          ischecked: false
        },
        {
          title: '守押',
          ischecked: false
        },
        {
          title: '安全生产',
          ischecked: false
        },
        {
          title: '预警',
          ischecked: false
        },
        {
          title: '维稳',
          ischecked: false
        },
        {
          title: '委外事务',
          ischecked: false
        },
        {
          title: '案件管理',
          ischecked: false
        },
        {
          title: '其他',
          ischecked: false
        },
      ],
      //上传附件单个数据
      files: {
        fileName: '', //文件名
        filesExtension: '', //扩展名
        fileDate: '', //上传时间
        fileSize: '', //上传大小
        fileData: '' //文件数据
      },
    }
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    //浏览附件
    openFile(){
      this.$refs.file.click();
    },
    //选择文件
    fileChange() {
      let myfile = this.$refs.file;
       if (myfile.files[0] == undefined) {
        console.log('未上传任何文件！');
      } else {
        var filevalue = myfile.value;
        var index = filevalue.lastIndexOf('.');
        this.files.fileName = myfile.files[0].name;
        this.files.filesExtension = filevalue.substring(index);
        let date = new Date();
        const Y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        H = H < 10 ? '0' + H : H;
        i = i < 10 ? '0' + i : i;
        s = s < 10 ? '0' + s : s;
        this.files.fileDate = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
        this.files.fileSize = parseFloat(myfile.files[0].size / 1024 / 1024).toPrecision(2);
        let self = this;
        self.getBase64(myfile.files[0]).then(res => {
          let unLoadFileData = res;
          self.files.fileData = res.split(',')[1];
          self.formData.enclosure.push({
            fileName: self.files.fileName, //文件名
            filesExtension: self.files.filesExtension, //扩展名
            fileDate: self.files.fileDate, //上传时间
            fileSize: self.files.fileSize, //上传大小
            fileData: self.files.fileData
          })
        })
        //console.log(self.formData.enclosure);
      }
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let results = '';
        reader.readAsDataURL(file); //读出base64
        reader.onload = function () {
          results = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(results)
        }
      })
    },
    //删除文件
    delFiles(item, index) {
      this.formData.enclosure.splice(index,1);
    },
    //重置按钮
    reset() {
      for (var index in this.formData) {
        if(this.formData[index] instanceof Array){
          this.formData[index] = [];
        }else{
          this.formData[index] = '';
        }
      }
      for (var index in this.checkboxData) {
        this.checkboxData[index].ischecked = false;
      }
    },
    //确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.SET_EQUIPMENT_COMPONENTID('List')
    },
    //保存
    preservation() {
      this.formData.contentType = [];
      for (var index in this.checkboxData) {
        if(this.checkboxData[index].ischecked){
          this.formData.contentType.push(this.checkboxData[index].title);
        }
      }
      this.isShowInfo = true;
    }
  },
  mounted(){
    //接收list组件触发编辑时通过父组件传来的数据并进行相应的赋值
    if(this.addList.name){
      this.formData = this.addList;
      for(var i in this.addList.contentType){
        for(var j in this.checkboxData){
          if(this.addList.contentType[i] === this.checkboxData[j].title){
            this.checkboxData[j].ischecked = true;
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box {
  width: 100%;
  height: 100%;
  .header {
    margin-bottom: 10px;
  }
  .content {
    // padding: 0 10px;
    width: 100%;
    .el-button {
      width: 80px;
    }
    .main {
      margin: 10px 0;
      width: 100%;
      .main-box {
        // padding: 20px;
        .box-title {
          width: 60%;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
        }
        .main-box-center {
          border: 1px solid #ddd;
          padding: 5px 10px 15px;
          width: 60%;
          // margin-left: 20%;
          background: #eee;
          .center-li{
            width: 100%;
            height: 35px;
            margin-top: 10px;
            .li-item{
              width: 33.3333%;
              height:35px;
              float:left;
              span{
                float:left;
                width: 40%;
                line-height: 35px;
                text-align: center;
                b{
                  color: red;
                  font-style: normal;
                }
              }
              .el-input, .el-select{
                float:left;
                width: 60%;
                height: 35px;
              }
            }
          }
          .center-li2{
            width: 100%;
            height: 70px;
            margin-top: 10px;
            .li2-title{
              float: left;
              width: 13.4%;
              line-height: 70px;
              text-align: center;
              b{
                color: red;
                font-style: normal;
              }
            }
            .li2-con{
              float: left;
              width: 86.6%;
              height: 70px;
              padding-left: 20px;
              background: #fff;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              .el-checkbox {
                font-size: 12px;
                margin-right: 0; 
                height: 16px;
                width: 90px;
                /deep/ .el-checkbox__label {
                  padding-left: 5px;
                  line-height: 19px;
                  font-size: 12px;
                }
                /deep/ .el-checkbox__inner{
                  width: 12px;
                  height: 12px;
                }
                /deep/ .el-checkbox__inner::after{
                  left: 3px;
                  top: 0;
                }
              }
            }
          }
          .center-li3{
            width: 100%;
            height: 35px;
            margin-top: 10px;
            .li3-title{
              float:left;
              width: 13.4%;
              line-height: 35px;
              text-align: center;
              b{
                color: red;
                font-style: normal;
              }
            }
            .li3-con{
              width: 78.6%;
              height: 33px;
              float: left;
              line-height: 33px;
              border: 1px solid #E4E7ED;
              padding: 0 15px;
              background: #fff;
              p{
                float: left;
                height: 33px;
                margin-right: 10px;
                span{
                  float: left;
                  height: 33px;
                  line-height: 33px;
                  margin-right: 5px;
                }
                b{
                  float: left;
                  width: 14px;
                  height: 14px;
                  text-align: center;
                  line-height: 12px;
                  background: #ccc;
                  border-radius: 50%;
                  margin-top: 9px;
                  cursor: pointer;
                }
              }
            }
            .li3-button{
              float: right;
              width: 7%;
              height: 33px;
              line-height: 33px;
              text-align: center;
              background: #E7F1FF;
              border: 1px solid #97BAEB;
              color: #2E72D3;
              cursor: pointer;
            }
          }
        }
        .main-box-footer {
          padding: 1px;
          margin: 20px 0;
          width: 60%;
          height: 39px;
          // margin-left: 20%;
          border: 1px solid #ddd;
          background: #eee;
          .footer-li{
            width: 33.3333%;
            height: 35px;
            float: left;
            span{
                float:left;
                width: 30%;
                line-height: 35px;
                text-align: center;
            }
            .el-input{
              float:left;
              width: 70%;
              height: 35px;
              background: none;
            }
          }
        }
      }
    }
    .content-bottom {
      width: 60%;
      text-align: center;
      .baocun{
        background: #2E72D4;
        color: #fff;
        border: 1px solid #2E72D4;
      }
    }
  }
}
</style>
