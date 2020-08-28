<!--
 * @Author: your name
 * @Date: 2020-07-10 14:06:07
 * @LastEditTime: 2020-07-10 17:21:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\businessParameterConfig\pages\BusinessParameterCreat.vue
-->
<template>
  <div class="business-parameter-creat-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">{{isEdit ? '编辑' + nodeName : '新建' + nodeName}}</div>
            <div class="p-creat-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="businessForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="显示名称" prop="data"
                      :rules="[{ required: true, message: '必填', trigger: 'change' },{ min: 0, max: 128, message: '最多可输入128个字符' }]">
                        <el-input  v-model="form.data"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="归属类别" prop="homeClass" :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-select v-model="form.homeClass" style="width: 100%;">
                          <el-option v-for="(item,index) in categorisation" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="排列序号" prop="sortSerialNum"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' },{ type: 'number', message: '排列序号必须为数值'}]">
                        <el-input  v-model.number="form.sortSerialNum"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="状态" prop="dictState" :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                        <el-select v-model="form.dictState" style="width: 100%;">
                          <el-option v-for="(item,index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;" v-if="isSdkShow">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="SDK" prop="sdkName">
                        <el-select v-model="form.sdkName" style="width: 100%;" @change="changeSdk" ref="selectSdk">
                          <el-option v-for="(item,index) in sdkArr" :key="index" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-creat-from" style="margin-top:15px;">
              <el-row>
                <el-col :span=3>
                  <div class="item">
                    录入时间
                  </div>
                </el-col>
                <el-col :span=5>
                  <el-input v-model="form.entryTime" disabled></el-input>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入机构
                  </div>
                </el-col>
                <el-col :span=5>
                  <el-input v-model="form.entryOrganization" disabled></el-input>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入人
                  </div>
                </el-col>
                <el-col :span=5>
                  <el-input v-model="form.entryName" disabled></el-input>
                </el-col>
              </el-row>
            </div>
            <div class="p-creat-footer">
              <el-button type="primary" @click="onSubmit" size="small">保存</el-button>
              <el-button  size="small"  @click="cancel">取消</el-button>
              <el-button  size="small" @click="reset">重置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from './Bus'
import { mapState } from 'vuex'
import { newCreateDataDictionary, updateDataDictionary, getBindSdkListApi } from '../../../../http/systemOperationManage/businessParameterConfig.api'
export default {
  props: {
    nodeName: {
      type: String
    },
    isSdkShow: {
      type: Boolean
    },
    sdkId: {
      type: String
    }
  },
  name: 'BusinessParameterCreat',
  data() {
    return {
      editModel: false,
      statusArray: [
        {value: 1, label: '启用'},
        {value: 2, label: '禁用'}
      ],
      sdkArr: [],
      obj: {},
      form: {
        sdkName: '',
        data: '',
        sortSerialNum: '',
        dictState: 1,
        homeClass: '',
        createdAt: '',
        entryName: '',
        entryTime: '',
        entryOrganization: ''
      },
      isEdit: false,
      categorisation: [], // 归属类别
      id: ''
    }
  },
  computed: {
    ...mapState({
      businessParameterConfigParam: ({ businessParameterConfig }) => businessParameterConfig.businessParameterConfigParam
    })
  },
  watch: {
    'isSdkShow'(nv) {
      if (nv) {
        let param = {
          id: this.sdkId
        }
        this.getBindSdkListApiFuc(param)
      }
    }
  },
  mounted() {
    Bus.$on('edit', (data, id, flag) => {
      this.id = id
      this.form = JSON.parse(JSON.stringify(data[0]))
      this.form.sortSerialNum = Number(this.form.sortSerialNum)
      this.isEdit = flag
      if (this.isSdkShow) {
        let param = {
          id: this.sdkId,
          homeClass: this.form.homeClass
        }
        this.getBindSdkListApiFuc(param)
      }
      this.$refs['businessForm'].resetFields()
      this.getState()
    })
    Bus.$on('creat', (param, flag) => {
      this.id = param.id
      this.isEdit = flag
      this.form = { ...this.obj }
      let params = {
        id: this.sdkId,
        homeClass: this.form.homeClass
      }
      this.getBindSdkListApiFuc(params)
      this.$refs['businessForm'].resetFields()
      this.getState()
    })
    Bus.$on('data', (data) => {
      this.categorisation = JSON.parse(JSON.stringify(data))
      this.categorisation.forEach((item, index) => {
        this.categorisation[index] = {
          label: item,
          value: item
        }
      })
      this.form.homeClass = ''
    })
  },
  created() {
    this.getState()
  },
  methods: {
    select(val) {
      console.log(val)
    },
    changeSdk(val) {
      // this.$refs['selectSdk'].selected.currentLabel = val
    },
    // 获取已绑定的sdk
    getBindSdkListApiFuc(param) {
      this.sdkArr = []
      getBindSdkListApi(param).then(res => {
        if (res.data.code === 0) {
          res.data.data.sdkName && res.data.data.sdkName.forEach((item, index) => {
            this.sdkArr.push(
              {value: index, label: item}
            )
          })
        } else {
          this.$messageError('获取SDK失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getState() {
      this.form.entryOrganization = JSON.parse(sessionStorage.user).orgName
      this.form.entryName = JSON.parse(sessionStorage.user).name
      this.form.entryTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 保存
    onSubmit() {
      let param = {
        type: '2',
        id: this.id,
        sortSerialNum: String(this.form.sortSerialNum),
        dictState: this.form.dictState,
        homeClass: this.form.homeClass,
        data: this.form.data,
        sdkName: this.form.sdkName || '',
        updatedAt: '1',
        updatedBy: '1',
        updatedDept: '1',
        updatedById: '1',
        updatedDeptId: '1'
      }
      this.$refs['businessForm'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            delete param.updatedAt
            delete param.updatedBy
            delete param.updatedDept
            delete param.updatedById
            delete param.updatedDeptId
            param.dataId = this.form.dataId
            param.dictState = param.dictState === '启用' ? 1 : 2
            updateDataDictionary(param).then(res => { // 编辑
              if (res.data.code === 0) {
                this.$messageSuccess(res.data.message)
                this.$emit('changeMenu', 'list')
              } else {
                this.$messageError('编辑失败')
              }
              this.$parent.$refs.List.getDataDircColumnListFuc(this.businessParameterConfigParam)
            })
              .catch(err => {
                this.$messageError('编辑失败')
                console.log(err)
              })
          } else {
            newCreateDataDictionary(param).then(res => { // 新建
              if (res.data.code === 0) {
                this.$messageSuccess('新建成功')
                this.$emit('changeMenu', 'list')
              } else {
                this.$messageError('新建失败')
              }
              this.$parent.$refs.List.getDataDircColumnListFuc(this.businessParameterConfigParam)
            })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    // 重置
    reset() {
      this.form = {
        sdkName: '',
        data: '',
        sortSerialNum: '',
        dictState: '',
        homeClass: ''
      }
      this.isEdit = false
    },
    // 关闭
    cancel() {
      this.$confirm('确认退出当前操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('changeMenu', 'list')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.business-parameter-creat-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 0 20px 20px 0;
          .box-title {
            width: 70%;
            height: 40px;
            margin: 0 auto;
            text-align: center;
            line-height: 40px;
            font-size: 18px;
          }
          .p-creat-from {
            border: 1px solid #ddd;
            margin: 0 auto;
            padding: 10px 10px 10px 10px;
            width: 70%;
            .item {
              text-align: center;
              line-height: 40px;
            }
            .details {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
          }
          .p-creat-footer {
            width: 70%;
            padding-top: 20px;
            margin: 0 auto;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 465px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
