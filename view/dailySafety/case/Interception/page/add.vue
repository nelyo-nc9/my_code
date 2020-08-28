<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header" v-show="isShowInfo==false">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
        <el-breadcrumb-item>成功堵截案例管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" v-show="isShowInfo==false">
      <div class="main" id="contentinfo">
        <div class="main-box" ref="printJS_people" id="printJS_people">
          <div class="box-title">成功堵截案例管理信息表</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>堵截案件名称</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful" maxlength="500"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>堵截案件单位</span>
                </td>
                <td class="box-cell-input">
                   <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择堵截案件单位"
                  style="width: 100%;"
                >
                  <el-option value="堵截案件单位1"></el-option>
                  <el-option value="堵截案件单位2"></el-option>
                </el-select>
                </td>
                <td class="box-cell-title">
                  <span>堵截时间</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>堵截案件分类</span>
                </td>
                <td class="box-cell-input">
                   <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择堵截案件分类"
                  style="width: 100%;"
                >
                  <el-option value="堵截案件分类1"></el-option>
                  <el-option value="堵截案件分类2"></el-option>
                </el-select>
                </td>
                <td class="box-cell-title">
                  <span>涉案事项</span>
                </td>
                <td class="box-cell-input">
                  <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择涉案事项"
                  style="width: 100%;"
                >
                  <el-option value="涉案事项1"></el-option>
                  <el-option value="涉案事项2"></el-option>
                </el-select>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>渡劫案件级别</span>
                </td>
                <td class="box-cell-input">
                   <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选渡劫案件级别"
                  style="width: 100%;"
                >
                  <el-option value="渡劫案件级别1"></el-option>
                  <el-option value="渡劫案件级别2"></el-option>
                </el-select>
                </td>
                <td class="box-cell-title">
                  <span>堵截金额</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>基本案情</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>处置措施</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" rowspan="2">
                  <span>附件</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful"></el-input>
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
        <el-button size="small" @click="preservation">保存</el-button>
        <el-button size="small" @click="dialogVisible = true">关闭</el-button>
        <el-button size="small" @click="reset">重置</el-button>
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
    <Info v-show="isShowInfo==true" :isShowInfo.sync="isShowInfo"></Info>
  </div>
</template>

<script>
import Info from './info'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Info
  },
  data() {
    return {
      isShowInfo: false, //查看显隐
      dialogVisible: false, //取消弹框
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
        articlesFile: ''
      }
    }
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
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
    // 重置按钮
    reset() {
      for (var index in this.formData) {
        this.formData[index] = ''
      }
    },
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.SET_EQUIPMENT_COMPONENTID('List')
    },
    //保存
    preservation() {
      this.isShowInfo = true
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
    width: 100%;
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
          width: 60%;
          margin-left: 20%;
          table {
            width: 100%;
            height: 100%;
            tr {
              .box-cell-title {
                height: 36px;
                width: 16.3%;
                background: #eee;
                text-align: center;
                border: 0.5px solid #ddd;
              }
              .box-cell-input {
                width: 16.3%;
                height: 36px;
              }
            }
          }
        }
        .main-box-footer {
          padding: 1px;
          margin-top: 10px;
          width: 60%;
          margin-left: 20%;
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
                font-size: 12px;
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
</style>
