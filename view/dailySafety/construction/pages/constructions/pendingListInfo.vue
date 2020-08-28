<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>施工报备</el-breadcrumb-item>
        <el-breadcrumb-item>待审批列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
        <el-breadcrumb-item>审批</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content" ref="printJS_people" id="printJS_people">
      <div class="main" id="contentinfo">
        <div class="main-box">
          <div class="box-title">施工报备申请单审批</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>所属机构</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName"></el-input>
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
                  ></el-autocomplete>
                </td>
                <td class="box-cell-title">
                  <span>申请编号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyNumber" maxlength="50"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">申请人</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyPeople" maxlength="10"></el-input>
                </td>
                <td class="box-cell-title">申请部门</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyDepartment" maxlength="20"></el-input>
                </td>
                <td class="box-cell-title">联系方式</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.phone" maxlength="15"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">施工单位</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.company" maxlength="15"></el-input>
                </td>
                <td class="box-cell-title">
                  <span>施工区域</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input v-model="formData.region" maxlength="200"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">施工类型</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.type" maxlength="10"></el-input>
                </td>
                <td class="box-cell-title">开始时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.startTime" maxlength="20"></el-input>
                </td>
                <td class="box-cell-title">结束时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.overTime" maxlength="15"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>施工事项</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500"></el-input>
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
                  <!-- <el-upload>
                  <el-button size="samll" type="text">点击上传</el-button>-->
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  <!-- </el-upload> -->
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">携物信息</td>
                <td class="box-cell-title">
                  <span>物品名称</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.goodsName" maxlength="20"></el-input>
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
                  <!-- <el-upload class="upload-demo">
                  <el-button size="samll" type="text">点击上传</el-button>-->
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  <!-- </el-upload> -->
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" :rowspan="peopleIndex">
                  <span>施工人员</span>
                  <i class="el-icon-plus" @click="addPeople('people',peopleList)"></i>
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
                <td class="box-cell-title">
                  <span>人员照片</span>
                </td>
                <td class="box-cell-title">
                  <span>操作</span>
                </td>
              </tr>
              <tr v-for="(item,index) in peopleList" :key="index">
                <td class="box-cell-input">
                  <el-input v-model="item.peopleName" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.peopleId" maxlength="20"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.peoplePhone" maxlength="15"></el-input>
                </td>
                <td class="box-cell-input" align="center">
                  <!-- <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >-->
                  <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <!-- </el-upload> -->
                </td>
                <td class="box-cell-input" align="center" style="border-left:1px solid #eee;">
                  <el-button type="text" @click="deleteRow('people', index, peopleList)">删除</el-button>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title" :rowspan="carIndex">
                  <span>车辆信息</span>
                  <i class="el-icon-plus" @click="addPeople('car',carList)"></i>
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
                <td class="box-cell-title">
                  <span>联系方式</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>操作</span>
                </td>
              </tr>
              <tr v-for="(item,index) in carList" :key="index+1">
                <td class="box-cell-input">
                  <el-input v-model="item.carCode" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carId" maxlength="20"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carName" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input" align="center">
                  <el-input v-model="item.carPhone" maxlength="15"></el-input>
                </td>
                <td class="box-cell-input" align="center" style="border-left:1px solid #eee;">
                  <el-button type="text" @click="deleteRow('car', index, carList)">删除</el-button>
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
              <tr>
                <td class="box-cell-title">审批意见</td>
                <td class="box-cell-input" colspan="7">
                  <el-input disabled maxlength="200"></el-input>
                </td>
              </tr>
            </table>

            <div class="button-top">
              <el-button size="small" @click="yesPending">同意</el-button>
              <el-button size="small" @click="dialogVisible = true">取消</el-button>
              <el-button size="small" @click="noPending">驳回</el-button>
            </div>
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
              <tr v-for="(item,index) in reviseList" :key="index">
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseMent" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseChild" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="10">
                  <el-input v-model="item.reviseName" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center">
                  <el-input v-model="item.reviseTime" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" show-overflow-tooltip maxlength="200">
                  <el-input v-model="item.reviseMsg" maxlength="200"></el-input>
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
    isShowPendingListInfo: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false, // 取消弹窗
      peopleIndex: 2, //添加施工人员
      carIndex: 2, //添加车辆信息
      carList: [
        // 车辆信息
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
  methods: {
    // 添加行
    addPeople(rowIndex, list) {
      console.log(rowIndex, list)
      if (rowIndex === 'people') {
        list.push({
          peopleName: '',
          peopleId: '',
          peoplePhone: ''
        })
      } else {
        list.push({
          carCode: '',
          carId: '',
          carName: '',
          carPhone: ''
        })
      }
      rowIndex === 'people' ? ++this.peopleIndex : ++this.carIndex
    },
    // 删除行
    deleteRow(rowIndex, index, rows) {
      console.log(index, rows)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          rows.splice(index, 1)
          rowIndex === 'people' ? --this.peopleIndex : --this.carIndex
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      res.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传文件类型判断
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //同意
    yesPending() {
      this.$emit('update:isShowPendingListInfo', false)
    },
    //驳回
    noPending() {
      this.$emit('update:isShowPendingListInfo', false)
    },
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowPendingListInfo', false)
    }
  }
}
</script>

<style lang="less" scoped>
.button-top {
  margin: 15px 0;
  text-align: center;
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
      }
    }
  }
}
</style>
