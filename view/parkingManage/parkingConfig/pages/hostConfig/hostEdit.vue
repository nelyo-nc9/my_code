<template>
  <div class="main">
    <div class="form-box">
      <div class="form-top">停车平台信息</div>
      <div class="form-content">
        <div class="left-form">
          <el-form ref="addForm"
                  :rules="rules"
                   size="mini"
                   :model="formData"
                   label-position="right"
                   label-width="120px">
            <el-form-item label="所属机构"
            prop="orgName"
                          required>
              <el-input disabled
                        v-model="formData.orgName"></el-input>
            </el-form-item>
            <el-form-item label="所属停车平台" prop="platform">
              <el-input v-model="formData.platform"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="车场"
            prop="parking"
                          required>
              <el-select v-model="formData.parking"  disabled>
                <el-option v-for="item in parkList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="品牌"
            prop="brand"
                          required  >
              <el-select v-model="formData.brand" disabled>
                <el-option v-for="item in carBrandData"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备ID"
            prop="id"
                           >
              <el-input v-model="formData.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="端口"
            prop="port"
                           >
              <el-input v-model="formData.port"  disabled></el-input>
            </el-form-item>
            <el-form-item label="通道号" prop="aisleNum1">
              <el-input v-model="formData.aisleNum1"></el-input>
            </el-form-item>
            <el-form-item label="通道号" prop="aisleNum2">
              <el-input v-model="formData.aisleNum2"></el-input>
            </el-form-item>
            <!-- <el-form-item label="通道号">
              <el-input v-model="formData.aisleNum3"></el-input>
            </el-form-item>
            <el-form-item label="通道号">
              <el-input v-model="formData.aisleNum4"></el-input>
            </el-form-item> -->

          </el-form>
        </div>
        <div class="right-form">
          <el-form size="mini"
                   :model="formData"
                   label-position="right"
                   label-width="120px"
                    ref="addForms"
                  :rules="rules">
            <el-form-item label="所属重点部位"
            prop="keyPartName"
                          required>
              <el-input v-model="formData.keyPartName"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="停车平台ID" prop="platformId">
              <el-input v-model="formData.platformId"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="主机名称"
            prop="name"
                          required>
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="modelNum">
              <el-input v-model="formData.modelNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip" disabled>
              <el-input v-model="formData.ip"></el-input>
            </el-form-item>
            <el-form-item label="资产编码*" prop="assetCode">
              <el-input v-model="formData.assetCode"></el-input>
            </el-form-item>
            <el-form-item label="通道名称" prop="wayNum1">
              <el-input v-model="formData.wayNum1"></el-input>
            </el-form-item>
            <!-- <el-form-item label="通道名称">
              <el-input v-model="formData.wayNum2"></el-input>
            </el-form-item>
            <el-form-item label="通道名称">
              <el-input v-model="formData.wayNum3"></el-input>
            </el-form-item>
            <el-form-item label="通道名称">
              <el-input v-model="formData.wayNum4"></el-input>
            </el-form-item> -->

          </el-form>
        </div>
      </div>
      <div class="form-footer">
        <el-button type="primary"
                   size="mini"
                   @click="savePlatform">保存</el-button>
        <el-button size="mini"
                   style="margin:0 24px"
                   @click="reset">重置</el-button>
        <el-button size="mini"
                   @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import parkingManage from '@src/assets/rules/validation/security/parkingManage.js'
export default {
  components: {},
  props: {
    hostEditInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    this.formData = this.hostEditInfo
    this.getqueryDataDictBasicInfo()
  },
  data() {
    return {
      formData: {},
      parkList: [],
      // 车辆品牌
      carBrandData: [],
      aisleList: [
        { label: '通道1', value: '通道1' },
        { label: '通道2', value: '通道2' }
      ],
      keyPart: [
        { label: '通道1', value: '通道1' },
        { label: '通道2', value: '通道2' }
      ],
      rules: parkingManage.editRules
    }
  },
  methods: {
    ...mapActions(['updateParkHost', 'queryDataDictBasicInfo']),
    close() {
      this.$emit('closeEdit')
    },
    savePlatform() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log(this.formData, '编辑数据')
          let obj = {
            name: this.formData.name,
            brand: this.formData.brand,
            modelNum: this.formData.modelNum,
            assetCode: this.formData.assetCode
          }
          this.formData.orgId = Number(this.formData.orgId)
          this.formData.keyPartId = Number(this.formData.keyPartId)
          this.formData.platformId = Number(this.formData.platformId)
          this.updateParkHost(obj)
            .then((res) => {
              console.log(res, '修改成功')
              if (res.data.code === 0) {
                this.$notify.warning({
                  title: '警告',
                  message: '未查到数据'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })

          this.$emit('closeEdit')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset() {
      this.formData.oid = ''
      this.formData.platform = ''
      this.formData.parking = ''
      this.formData.name = ''
      this.formData.brand = ''
      this.formData.aisleNum = ''
      this.formData.keyPart = ''
      this.formData.platformId = ''
      this.formData.ip = ''
      this.formData.modelNum = ''
      this.formData.assetCode = ''
      this.formData.wayNum = ''
    },
    skipToList() {},
    // 数据字典获取
    getqueryDataDictBasicInfo() {
      this.queryDataDictBasicInfo({
        queryList: [
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '6'
          }
        ]
      }).then((res) => {
        this.carBrandData = res.data.data[0].attr
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .content-btn {
    margin: 10px 0;
  }
  .form-box {
    padding-top: 20px;
    .form-top {
      width: 846px;
      text-align: center;
      padding: 30px 0;
    }
    .form-content {
      // display: flex;
      width: 846px;
      height: 260px;
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
    .form-footer {
      margin-top: 80px;
      width: 846px;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
.main {
  .form-box {
    .left-form,
    .right-form {
      // .el-form-item--mini.el-form-item {
      //   margin-bottom: 0;
      // }
      .el-form-item__label {
        border: 1px solid #fff;
        background: #f7f2f1;
      }
    }
  }
}
</style>
