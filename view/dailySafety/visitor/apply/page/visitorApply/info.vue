<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>访客入园申请</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

       <el-button size="small" v-print="'#printJS_people'" icon="el-icon-printer">打印</el-button>
    <el-button size="small" @click="dialogVisible = true">取消</el-button>

    <div class="content">
      <div class="main" id="contentinfo">
        <div class="main-box" ref="printJS_people" id="printJS_people">
          <div class="box-title">访客入园申请{{infoTitle}}</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">部门</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.company" disabled></el-input>
                </td>
                <td class="box-cell-title">申请编号</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.code" disabled></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">
                  <span>申请缘由</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.articlesFile" disabled></el-input>
                </td>
              </tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <tr style="height:100px">
                <td class="box-cell-title" rowspan="7">
                  <span>访客信息</span>
                </td>
                <td class="box-cell-title">
                  <span>访客照片</span>
                </td>
                <td
                  class="box-cell-title"
                  v-for="(item,i) in peopleList"
                  :key="i"
                  style="border:.5px solid #ccc"
                >
                  <span>{{item.peopleUrl}}</span>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>访客姓名</span>
                </td>
                <td class="box-cell-title" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peopleName" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>身份证号</span>
                </td>
                <td class="box-cell-title" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peopleId" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>联系电话</span>
                </td>
                <td class="box-cell-title" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peoplePhone" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>访客身份</span>
                </td>
                <td class="box-cell-title" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peopleIdTtpe" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>访客单位</span>
                </td>
                <td class="box-cell-input" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peopleForm" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>风险等级</span>
                </td>
                <td class="box-cell-title" v-for="(item,i) in peopleList" :key="i">
                  <el-input v-model="item.peopleType" disabled></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">入园时间</td>
                <td class="box-cell-input" colspan="2">
                  <el-input v-model="formData.startTime" disabled></el-input>
                </td>
                <td class="box-cell-title">结束时间</td>
                <td class="box-cell-input" colspan="2">
                  <el-input v-model="formData.overTime" disabled></el-input>
                </td>
              </tr>
              <tr>
                 <td class="box-cell-title">被访区域</td>
                <td class="box-cell-input" colspan="5">
                  <el-input v-model="formData.applyPeople" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">附件</td>
                <td class="box-cell-input" align="center" colspan="5">
                  <el-input disabled></el-input>
                </td>
              </tr>
              <tr v-show="this.infoTitle">
                <td class="box-cell-title">
                  <span>备注</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input
                    type="textarea"
                    v-model="formData.articlesFile"
                    maxlength="500"
                    disabled
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">录入时间</td>
                <td class="box-cell-input">
                  <el-input disabled></el-input>
                </td>
                <td class="box-cell-title">录入机构</td>
                <td class="box-cell-input">
                  <el-input disabled></el-input>
                </td>
                <td class="box-cell-title">录入人</td>
                <td class="box-cell-input">
                  <el-input disabled></el-input>
                </td>
              </tr>
              <tr v-show="!this.infoTitle">
                <td class="box-cell-title">
                  <span>审批意见</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input
                    type="textarea"
                    v-model="formData.articlesFile"
                    maxlength="500"
                    disabled
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" rowspan="2">审批记录</td>
                <td class="box-cell-title">所属机构</td>
                <td class="box-cell-title">所属部门</td>
                <td class="box-cell-title">姓名</td>
                <td class="box-cell-title">审批时间</td>
                <td class="box-cell-title">审批</td>
                <td class="box-cell-title">审批意见</td>
              </tr>
              <tr v-for="(item,index) in reviseList" :key="index">
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseMent" maxlength="200" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseChild" maxlength="200" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="10">
                  <el-input v-model="item.reviseName" maxlength="200" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center">
                  <el-input v-model="item.reviseTime" maxlength="200" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseStatus" maxlength="200" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" show-overflow-tooltip maxlength="200">
                  <el-input v-model="item.reviseMsg" maxlength="200" disabled></el-input>
                </td>
              </tr>
            </table>
            <div style="margin-top:20px;width:30%;">
              <p style="margin-bottom:20px;">审批过程：</p>
              <el-steps :active="1" finish-status="success">
                <el-step title="yyy1"></el-step>
                <el-step title="yyy2"></el-step>
                <el-step title="yyy3"></el-step>
              </el-steps>
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
export default {
  props: {
    //显隐
    isShowInfo: {
      type: Boolean
    },
    infoTitle:{
      type:String
    }
  },
  data() {
    return {
      dialogVisible: false, // 取消弹窗
      peopleList: [
        // 人员信息
        {
          peopleUrl: '照片1',
          peopleName: '张三',
          peopleId: '123',
          peoplePhone: '112233',
          peopleIdTtpe: '张三',
          peopleForm: '江苏分行',
          peopleType: '三级'
        },
        {
          peopleUrl: '照片2',
          peopleName: '李四',
          peopleId: '456',
          peoplePhone: '445566',
          peopleIdTtpe: '张三',
          peopleForm: '北京分行',
          peopleType: '三级'
        }
      ],
      formData: {
        code: '',
        phone: '',
        company: '', //单位
        region: '', //区域
        type: '', //类型
        startTime: '',
        overTime: '',
        careful: '', //注意事项
        articlesFile: ''
      },
      reviseList: [
        {
          reviseMent: 'reviseMent',
          reviseChild: 'reviseChild',
          reviseName: 'reviseName',
          reviseTime: 'reviseTime',
          reviseStatus: 'reviseStatus',
          reviseMsg: 'reviseMsg'
        }
      ]
    }
  },
  created() {},
  methods: {
    //编辑带参数据

    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowInfo', false)
      this.$emit('update:infoTitle', '')
      
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-bottom: 10px;
  }
  .content {
    padding: 0 10px;
    width: 1000px;
    .el-button {
      width: 80px;
    }
    .main {
      margin: 10px 0;
      width: 100%;
      .main-box {
        padding: 20px;
        .box-title {
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
        }
        .main-box-center {
          padding: 1px;
          width: 100%;
          table {
            width: 100%;
            height: 100%;
            tr {
              .box-cell-title {
                height: 36px;
                width: 15%;
                background: #eee;
                text-align: center;
                border: 0.5px solid #ddd;
              }
              .box-cell-input {
                // width: 35%;
                height: 36px;
                .avatar-uploader {
                  .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    &:hover {
                      border-color: #409eff;
                    }
                  }
                  .avatar-uploader-icon {
                    font-size: 18px;
                    color: #8c939d;
                    width: 58px;
                    height: 58px;
                    line-height: 58px;
                    // text-align: center;
                  }
                  .avatar {
                    width: 58px;
                    height: 58px;
                    display: block;
                  }
                }
                /deep/ .el-input__inner {
                  height: 36px !important;
                  text-align: center;
                  font-size: 12px;
                }
                .input-red {
                  /deep/ .el-input__inner {
                    border-color: red;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
