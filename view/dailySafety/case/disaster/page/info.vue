<template>
  <div class="org-manage-create-modify-box">
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
        <el-breadcrumb-item>自然灾害信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-bottom">
      <el-button size="small" v-print="'#printJS_people'" icon="el-icon-printer">打印</el-button>
      <el-button size="small" @click="download">下载</el-button>
      <el-button size="small" @click="dialogVisible = true">取消</el-button>
    </div>
    <div class="content">
      <div class="main" id="contentinfo">
        <div class="main-box" ref="printJS_people" id="printJS_people">
           <div class="box-title">自然灾害信息管理信息表</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
             <tr>
                <td class="box-cell-title">
                  <span>灾害名称</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>事发机构</span>
                </td>
                <td class="box-cell-input">
                   <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择事发机构"
                  style="width: 100%;"
                   disabled
                >
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
                </td>
                <td class="box-cell-title">
                  <span>事发时间</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>灾害类别</span>
                </td>
                <td class="box-cell-input">
                   <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择灾害类别"
                  style="width: 100%;"
                   disabled
                >
                  <el-option value="灾害类别1"></el-option>
                  <el-option value="灾害类别2"></el-option>
                </el-select>
                </td>
                <td class="box-cell-title">
                  <span>灾害级别</span>
                </td>
                <td class="box-cell-input">
                  <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择灾害级别"
                  style="width: 100%;"
                   disabled
                >
                  <el-option value="灾害级别1"></el-option>
                  <el-option value="灾害级别2"></el-option>
                </el-select>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>受影响部位数</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>停业部位数</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>受伤人数</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>死亡人数</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>损失金额(万元)</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>设备损坏数</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="formData.orgName" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>处置措施</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input type="textarea" v-model="formData.careful" maxlength="500" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" rowspan="2">
                  <span>附件</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful" disabled></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-input" colspan="3">
                  <el-input type="text" v-model="formData.careful" disabled></el-input>
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
    addList: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false, // 取消弹窗
      formData: {
        orgName: '',
        keyPartsName: ''
      }
    }
  },
  computed: {
    ...mapState({
      componentId: ({ protectiveCabin }) => protectiveCabin.componentId
    })
  },
  created() {
    console.log(this.addList)
  },
  methods: {
    ...mapMutations(['SET_EQUIPMENT_COMPONENTID']),
    // 确定关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowInfo', false)
      this.$emit('update:infoTitle', '')
    },
    //下载
    download() {
      this.SET_EQUIPMENT_COMPONENTID('Add')
      this.$emit('update:isShowInfo', false)
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
  }
}
</style>
