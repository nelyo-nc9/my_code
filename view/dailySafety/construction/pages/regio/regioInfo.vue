<template>
  <div class="org-manage-create-modify-box">
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>施工报备</el-breadcrumb-item>
        <el-breadcrumb-item>施工区域管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="button-top">
      <el-button size="small" @click="dialogVisible = true">取消</el-button>
      <el-button size="small" v-print="'#printJS_people'" icon="el-icon-printer">打印</el-button>
    </div>
    <div class="content" ref="printJS_people" id="printJS_people">
      <div class="main" id="contentinfo">
        <div class="main-box">
          <div class="box-title">施工报备申请单</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>所属机构</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>所属重点部位</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-autocomplete
                    class="inline-input"
                    v-model="formData.keyPartsName"
                    size="mini"
                    placeholder="请选择重点部位"
                     disabled
                  ></el-autocomplete>
                </td>
                <td class="box-cell-title">
                  <span>申请编号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyNumber" maxlength="50" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">申请人</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyPeople" maxlength="10" disabled></el-input>
                </td>
                <td class="box-cell-title">申请部门</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyDepartment" maxlength="20" disabled></el-input>
                </td>
                <td class="box-cell-title">联系方式</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.phone" maxlength="15" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">施工单位</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.company" maxlength="15" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>施工区域</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input v-model="formData.region" maxlength="200" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">施工类型</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.type" maxlength="10" disabled></el-input>
                </td>
                <td class="box-cell-title">开始时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.startTime" maxlength="20" disabled></el-input>
                </td>
                <td class="box-cell-title">结束时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.overTime" maxlength="15" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>施工事项</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>附件</span>
                </td>
                <td
                  class="box-cell-input"
                  align="center"
                  colspan="2"
                  style="border-top:1px solid #eee;"
                >
                  
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">携物信息</td>
                <td class="box-cell-title">
                  <span>物品名称</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.goodsName" maxlength="20" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>附件</span>
                </td>
                <td
                  class="box-cell-input"
                  align="center"
                  colspan="2"
                  style="border-top:1px solid #eee;"
                >
                  
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" :rowspan="peopleList.length+1">
                  <span>施工人员</span>
                </td>
                <td class="box-cell-title">
                  <span>人员姓名</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>身份证号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>联系电话</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title" colspan="2">
                  <span>人员照片</span>
                </td>
              </tr>
              <tr v-for="(item,index) in peopleList" :key="index">
                <td class="box-cell-input">
                  <el-input v-model="item.peopleName" maxlength="10" disabled></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.peopleId" maxlength="20" disabled></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.peoplePhone" maxlength="15" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" colspan="2">
                  <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
                </td>
              </tr>

              <tr>
                <td class="box-cell-title" :rowspan="carList.length+3">
                  <span>车辆信息</span>
                </td>
                <td class="box-cell-title">
                  <span>车牌号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>通行证号</span>
                </td>
                <td class="box-cell-title">
                  <span>驾驶员</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title" colspan="2">
                  <span>联系方式</span>
                  <span style="color: red">*</span>
                </td>
              </tr>
              <tr v-for="(item,index) in carList" :key="index-3">
                <td class="box-cell-input">
                  <el-input v-model="item.carCode" maxlength="10" disabled></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carId" maxlength="20" disabled></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carName" maxlength="10" disabled></el-input>
                </td>
                <td class="box-cell-input" align="center" colspan="2">
                  <el-input v-model="item.carPhone" maxlength="15" disabled></el-input>
                </td>
              </tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">审批人修订记录</td>
                <td class="box-cell-input" colspan="7">
                  <el-input disabled maxlength="200"></el-input>
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
              <tr v-for="(item,index) in reviseList" :key="index+2">
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
          </div>
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
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
            </table>
          </div>
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
    isShowRegioInfo: {
      type: Boolean
    },
    infoObj: {
      type: Object
    }
  },
  data() {
    return {
      isListStatus: false,
      dialogVisible: false, // 取消弹窗
      carList: [
        // 车辆信息
        {
          carCode: '',
          carId: '',
          carName: '',
          carPhone: ''
        },
         {
          carCode: '',
          carId: '',
          carName: '',
          carPhone: ''
        }
      ],
      peopleList: [
        // 人员信息
        {
          peopleName: '',
          peopleId: '',
          peoplePhone: ''
        },
        {
          peopleName: '',
          peopleId: '',
          peoplePhone: ''
        }
      ],
      reviseList: [
        {
          reviseMent: 'reviseMent',
          reviseChild: 'reviseChild',
          reviseName: 'reviseName',
          reviseTime: 'reviseTime',
          reviseStatus: 'reviseStatus',
          reviseMsg: 'reviseMsg'
        }
      ],
      formData: {
        orgName: '',
        keyPartsName: '',
        applyNumber: '',
        applyPeople: '',
        applyDepartment: '',
        phone: '',
        company: '', //单位
        region: '', //区域
        type: '', //类型
        startTime: '',
        overTime: '',
        careful: '', //注意事项
        goodsName: '' //物品名称
      }
    }
  },
  created() {
    this.infos()
  },
  methods: {
    infos() {
      this.formData.orgName = this.infoObj.orgName
      this.formData.applyNumber = this.infoObj.data
      this.formData.applyPeople = this.infoObj.name
      console.log(this.infoObj)
    },

    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowRegioInfo', false)
    }
  }
}
</script>

<style lang="less" scoped>
.button-top {
  margin-top: 20px;
  margin-left: 20px;
}
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
          border: 1px solid #ddd;
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
        .main-box-footer {
          padding: 1px;
          margin-top: 10px;
          border: 1px solid #ddd;
          table {
            width: 100%;
            height: 100%;
            tr {
              .box-cell-title {
                height: 36px;
                width: 10%;
                background: #eee;
                text-align: center;
                border: 0.5px solid #ddd;
              }
              .box-cell-input {
                width: 23.3%;
                height: 36px;
                text-align: center;
                /deep/ .el-input__inner {
                  height: 36px !important;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}
@media print {
  .content-box {
    width: 1200px;
    text-align: center;
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin: 48px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 200px;
        background: #f8f8f8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
}
</style>
