<template>
  <div class="org-manage-create-modify-box2">
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>制度和安全</el-breadcrumb-item>
        <el-breadcrumb-item>规章制度管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-bottom">
      <el-button plain size="small" v-print="printObj" icon="el-icon-printer">打印</el-button>
      <!-- <el-button plain icon="el-icon-download" size="small" @click="download">下载</el-button> -->
      <el-button plain size="small" icon="el-icon-circle-close" @click="dialogVisible = true">取消</el-button>
    </div>
    <div class="content">
      <div class="main" id="contentinfo">
        <div class="main-box" ref="printJS_people" id="printJS_people">
          <div class="box-title">制度管理信息表</div>
          <div class="main-box-center">
            <div class="center-li">
              <div class="li-item">
                <span>文件名</span>
                <el-input v-model="formData.name" disabled></el-input>
              </div>
              <div class="li-item">
                <span>文号</span>
                <el-input v-model="formData.number" disabled></el-input>
              </div>
              <div class="li-item">
                <span>文件来源</span>
                <el-select v-model="formData.source" disabled placeholder="请选择">
                    <el-option value="行内"></el-option>
                    <el-option value="行外"></el-option>
                </el-select>
              </div>
            </div>
            <div class="center-li">
              <div class="li-item">
                <span>颁布级别</span>
                <el-select v-model="formData.level" disabled placeholder="请选择">
                    <el-option value="总行"></el-option>
                    <el-option value="一级分行"></el-option>
                    <el-option value="二级分行"></el-option>
                    <el-option value="国家"></el-option>
                    <el-option value="省市"></el-option>
                    <el-option value="地市"></el-option>
                </el-select>
              </div>
              <div class="li-item">
                <span>文件种类</span>
                <el-select v-model="formData.type" disabled placeholder="请选择">
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
                <span>发布单位</span>
                <el-input v-model="formData.company" disabled></el-input>
              </div>
            </div>
            <div class="center-li">
              <div class="li-item">
                <span>发布时间</span>
                <el-input v-model="formData.time" disabled></el-input>
              </div>
              <div class="li-item">
                <span>有效性</span>
                <el-input v-model="formData.validity" disabled></el-input>
              </div>
            </div>
            <div class="center-li2">
              <span class="li2-title">内容分类</span>
              <div class="li2-con">
                <p v-for="(item, index) of formData.contentType" :key="index">{{item}}</p>
              </div>
            </div>
            <div class="center-li3">
              <p class="li3-title">附件</p>
              <div class="li3-con">
                <p v-for="(item,index) in formData.enclosure" :key="index">
                  <span>{{item.fileName}}</span>
                </p>
              </div>
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
    </div>
    <div v-if="dialogVisible">
      <el-dialog title="关闭确认" :visible.sync="dialogVisible" width="30%">
        <span>请确认是否关闭？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogSave">确 定</el-button>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    isShowInfo: {
      type: Boolean
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false, // 取消弹窗
      //打印设置
      printObj: {
        id: 'printJS_people',
        popTitle: ''
      }
    }
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  created() {
    //console.log(this.formData)
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowInfo', false)
      this.$emit('update:infoTitle', '')
      this.SET_EQUIPMENT_COMPONENTID('List')
    },
    //下载
    // download() {
    //   this.SET_EQUIPMENT_COMPONENTID('Add')
    //   this.$emit('update:isShowInfo', false)
    // }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box2 {
  width: 100%;
  height: 100%;
  .header {
    margin-bottom: 20px;
  }
  .content {
    width: 100%;
    .el-button {
      width: 80px;
    }
    .main {
      margin: 10px 0;
      width: 100%;
      .main-box {
        /deep/ .el-input.is-disabled .el-input__inner{
          background: #fff;
        }
        /deep/ .el-input.is-disabled .el-input__icon {
          display: none;
        }
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
            }
            .li2-con{
              float: left;
              width: 86.6%;
              height: 70px;
              border: 1px solid #E4E7ED;
              padding-left: 20px;
              background: #fff;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              p{
                font-size: 12px;
                height: 16px;
                line-height: 16px;
                width: 73px;
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
          margin-top: 20px;
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
  }
}
@media print{
  .main-box {
    /deep/ .el-input.is-disabled .el-input__inner{
      background: #fff;
    }
    /deep/ .el-input.is-disabled .el-input__icon {
      display: none;
    }
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
        }
        .li2-con{
          float: left;
          width: 86.6%;
          height: 70px;
          border: 1px solid #E4E7ED;
          padding-left: 20px;
          background: #fff;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          p{
            font-size: 12px;
            height: 16px;
            line-height: 16px;
            width: 73px;
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
      margin-top: 20px;
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
</style>
