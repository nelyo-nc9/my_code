<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>访客管理</el-breadcrumb-item>
        <el-breadcrumb-item>访客入园申请</el-breadcrumb-item>
        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.addTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="main" id="contentinfo">
        <div class="main-box" ref="printJS_people" id="printJS_people">
          <div class="box-title">{{this.addTitle}}访客入园申请单</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">部门</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.company"></el-input>
                </td>
                <td class="box-cell-title">申请编号</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.code"></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">
                  <span>申请缘由</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.articlesFile" maxlength="500"></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">
                  <span>访客信息</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-button type="text" style="border:1px solid #ccc;" @click="addPeople">新增</el-button>
                </td>
              </tr>
            </table>

            <div v-for="(item,index) in peopleList" :key="index" class="center-people">
              <ul style="display:flex">
                <li>人员姓名</li>
                <li>
                  <el-input v-model="item.peopleName"></el-input>
                </li>
                <li>
                  <el-button size="samll" type="text" v-model="item.peopleUrl">上传访客照片</el-button>
                </li>
                <li>
                  <el-select v-model="item.peopleIdTtpe">
                    <el-option value="身份证">身份证</el-option>
                    <el-option value="护照">护照</el-option>
                    <el-option value="军人证">军人证</el-option>
                  </el-select>
                </li>
                <li>
                  <el-input v-model="item.peopleId"></el-input>
                </li>
                <li>联系电话</li>
                <li>
                  <el-input v-model="item.peoplePhone"></el-input>
                </li>
                <li>访客单位</li>
                <li>
                  <el-input v-model="item.peopleForm"></el-input>
                </li>
                <li>访客类别</li>
                <li>
                  <el-select v-model="item.peopleType">
                    <el-option value="外来施工人员">外来施工人员</el-option>
                    <el-option value="客户">客户</el-option>
                    <el-option value="分行人员">分行人员</el-option>
                    <el-option value="驻园人员">驻园人员</el-option>
                    <el-option value="其他人员">其他人员</el-option>
                  </el-select>
                </li>
                <li>一级风险</li>
                <li>
                  <i class="el-icon-delete" @click="deleteRow(item,index)"></i>
                </li>
              </ul>
            </div>
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">入园时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.startTime"></el-input>
                </td>
                <td class="box-cell-title">结束时间</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.overTime"></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">被访区域</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyPeople"></el-input>
                </td>
                <td class="box-cell-input" colspan="2">
                  <el-input v-model="formData.applyDepartment"></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">附件</td>
                <td class="box-cell-input" align="center" style="border:1px solid #eee;">
                  <el-button size="samll" type="text">浏览</el-button>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">
                  <span>备注</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500"></el-input>
                </td>
              </tr>

              <tr>
                <td class="box-cell-title">审批流程</td>
                <td class="box-cell-input">
                  <el-input v-model="formData.applyPeople"></el-input>
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
        </div>
      </div>
      <div class="content-bottom">
        <el-button size="small" @click="reset">重置</el-button>
        <el-button size="small" v-print="'#printJS_people'" icon="el-icon-printer">打印</el-button>
        <el-button size="small" @click="dialogVisible = true">返回</el-button>
        <el-button
          size="small"
          @click="deposit"
        >保存</el-button>
        <el-button size="small" @click="submit">提交</el-button>
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
    isShowAdd: {
      type: Boolean
    },
    //标题
    addTitle: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false, // 取消弹窗
      peopleList: [
        // 人员信息
        {
          peopleName: '',
          peopleId: '',
          peopleIdTtpe: '',
          peoplePhone: '',
          peopleForm: '',
          peopleType: '',
          peopleUrl: ''
        },
        {
          peopleName: '',
          peopleId: '',
          peopleIdTtpe: '',
          peoplePhone: '',
          peopleForm: '',
          peopleType: '',
          peopleUrl: ''
        },
        {
          peopleName: '',
          peopleId: '',
          peopleIdTtpe: '',

          peoplePhone: '',
          peopleForm: '',
          peopleType: '',
          peopleUrl: ''
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
      }
    }
  },
  created() {},
  methods: {
    //编辑带参数据

    // 添加行
    addPeople() {
      this.peopleList.push({
        peopleName: '',
        peopleId: '',
        peopleIdTtpe: '',
        peoplePhone: '',
        peopleForm: '',
        peopleType: '',
        peopleUrl: ''
      })
    },
    // 删除行
    deleteRow(item, index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.peopleList.splice(index, 1)
          console.log(index)
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

    // 重置按钮
    reset() {
      for (var index in this.formData) {
        this.formData[index] = ''
      }
      this.carList.map(item => {
        for (var index in item) {
          item[index] = ''
        }
      })
      this.peopleList.map(item => {
        for (var index in item) {
          item[index] = ''
        }
      })
    },
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowAdd', false)
    },
    //保存
    deposit() {
      this.$emit('update:isShowAdd', false)
    },
    //提交
    submit() {
      this.$emit('update:isShowAdd', false)
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
                margin-top: 15px;
                height: 36px;
                width: 15%;
                text-align: center;
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
    .content-bottom {
      text-align: center;
    }
  }
}
.center-people {
  width: 1500px;
  margin: 20px;
  ul {
    width: 100%;
    display: flex;
    li {
      flex: 1;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
