<template>
  <div class="equipment-visit-box">
    <!-- 系统运维管理--访问控制--设备访问路数设置 -->
    <div class="content">
      <div class="header">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统运维</el-breadcrumb-item>
          <el-breadcrumb-item>访问控制</el-breadcrumb-item>
          <el-breadcrumb-item>设备访问路数设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main">
        <!-- 机构信息 -->
        <div class="main-box">
          <div class="main-box-button">
            <span>访问路数设置</span>
            <el-button size="small" @click="clickModify()">编辑</el-button>
          </div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">设备名称</td>
                <td class="box-cell-input"><input type="text" v-model="form.deviceName" :readonly="true"></td>
              </tr>
              <tr>
                <td class="box-cell-title">所属重点部位</td>
                <td class="box-cell-input"><input type="text" v-model="form.KeyPart" :readonly="true"></td>
              </tr>
              <tr>
                <td class="box-cell-title">所属机构</td>
                <td class="box-cell-input"><input type="text" v-model="form.OrgName" :readonly="true"></td>
              </tr>
              <tr>
                <td class="box-cell-title">最大视频路数</td>
                <td class="box-cell-input"><input type="text" v-model="form.vedioMaxNum" oninput = "value=value.replace(/[^\d]/g,'')" :readonly="!isEdit"></td>
              </tr>
              <tr>
                <td class="box-cell-title">最大回放路数</td>
                <td class="box-cell-input"><input type="text" v-model="form.replayMaxNum" oninput = "value=value.replace(/[^\d]/g,'')" :readonly="!isEdit"></td>
              </tr>
              <tr v-if="isEdit">
                <td class="box-cell-title"></td>
                <td class="box-cell-radio" style="border-bottom: none"><el-radio v-model="radio" :label=true>仅对当前选择节点生效</el-radio></td>
              </tr>
              <tr v-if="isEdit">
                <td class="box-cell-title"></td>
                <td class="box-cell-radio" style="border-top: none"><el-radio v-model="radio" :label=false>对当前选择节点及子节点生效</el-radio></td>
              </tr>
            </table>
          </div>
          <div class="main-footer-button" v-if="isEdit">
            <el-button size="small" @click="clickSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setDeviceVisitCtrl } from '@src/http/systemOperationManage/visitControl.api'
export default {
  name: 'equipmentVisitPathControl',
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      radio: true,
      isEdit: false,
      form: {
        vedioMaxNum: this.info.vedioMaxNum || '',
        replayMaxNum: this.info.replayMaxNum || '',
        CurNodeValid: 1,
        CurAndSonNodeValid: 1
      }
    }
  },
  watch: {
    'params'(nv) {
      if (nv) {
        if (this.params.isOrg) {
          this.params.KeyPart = ''
          this.params.deviceName = ''
        }
        this.form = Object.assign({}, this.form, this.params)
      }
    },
    'info'(nv, ov) {
      if (nv && Object.keys(nv).length !== 0) {
        console.log(nv)
        this.form = Object.assign({}, this.form, this.info)
      } else {
        this.form.vedioMaxNum = ''
        this.form.replayMaxNum = ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    clickModify() {
      this.isEdit = true
    },
    clickSave() {
      this.setDeviceVisitCtrlFuc()
      this.isEdit = false
      this.form = {
        OrgName: '',
        KeyPart: '',
        deviceName: '',
        vedioMaxNum: '',
        replayMaxNum: '',
        CurNodeValid: 1,
        CurAndSonNodeValid: 1
      }
    },
    setDeviceVisitCtrlFuc() {
      this.form = {
        ...this.params,
        vedioMaxNum: Number(this.form.vedioMaxNum),
        replayMaxNum: Number(this.form.replayMaxNum),
        CurNodeValid: this.radio ? 1 : 2,
        CurAndSonNodeValid: this.radio ? 2 : 1
      }
      setDeviceVisitCtrl({'visitCtrl': this.form}).then(res => {
        console.log(res)
      })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .equipment-visit-box {
    width: 100%;
    height: 100%;
    .content {
      padding: 0 10px;
      width: 600px;
      .header {
        margin-bottom: 10px;
      }
      .main {
        margin: 10px 0;
        width: 100%;
        height: 500px;
        .main-box {
          padding: 20px;
          .main-box-button {
            margin-bottom: 10px;
            .el-button {
              margin-left: 10px;
              width: 80px;
            }
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
                  height: 40px;
                  width: 15%;
                  background: #eee;
                  text-align: center;
                  border: 0.5px solid #ddd;
                }
                .box-cell-input {
                  width: 35%;
                  height: 40px;
                  input {
                    border: 0.5px solid #ddd;
                    width: 100%;
                    height: 100%;
                    line-height: 40p;
                    padding: 0 5px;
                  }
                }
                .box-cell-radio {
                  width: 35%;
                  height: 40px;
                  border: 0.5px solid #ddd;
                  .el-radio {
                    margin-left: 5px;
                  }
                }
              }
            }
          }
          .main-footer-button {
            margin-top: 20px;
            .el-button {
              width: 80px;
            }
          }
        }
      }
    }
  }
</style>
