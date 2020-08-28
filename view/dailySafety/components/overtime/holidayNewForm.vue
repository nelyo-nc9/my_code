<template>
  <div class="role-manage-import-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>节假日加班人员管理</el-breadcrumb-item>
          <el-breadcrumb-item>申请列表</el-breadcrumb-item>
          <el-breadcrumb-item>新建</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-box">
        <div class="box-title">节假日加班人员申请单</div>
        <el-form class="main-form" :rules="rules" ref="mainForm1" size="mini" :model="formData" label-position="right" label-width="145px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属机构" prop="mechanism">
              <el-input clearable v-model="formData.mechanism"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属重点部位" prop="keyUnits">
                <el-input clearable v-model="formData.keyUnits"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请编号" prop="applicationId">
                <el-input clearable v-model="formData.applicationId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="加班地点" prop="unit">
                <el-input clearable v-model="formData.unit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始日期" prop="start">
                <el-date-picker
                  size="small"
                  v-model="formData.start"
                  type="date"
                  style="width:100%"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间" prop="end">
                <el-date-picker
                  size="small"
                  v-model="formData.end"
                  type="date"
                  style="width:100%"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="加班事项">
                <el-input type="textarea" v-model="formData.inputPerson"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="附件">
                <el-input size="small" clearable v-model="formData.enclosure" class="lookFa"></el-input>
                <span class="look">浏览</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="加班人员">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="primary" @click="handleDelete">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-table :data="flowData" style="width: 100%">
                  <el-table-column prop="index" width="50" label="序号" align="center"></el-table-column>
                  <el-table-column prop="date" label="姓名" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="用户名" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="出生日期" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="身份证号码" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="名族" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="政治面貌" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="学位" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="学历" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="专业" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="所属机构" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.address"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="所属部门" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户类别" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户状态" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="职务" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="录入时间" prop="inputTime">
                <el-input clearable v-model="formData.inputTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入机构" prop="inputAddress">
                <el-input clearable v-model="formData.inputAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入人" prop="inputPerson">
                <el-input clearable v-model="formData.inputPerson"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="p-search-footer">
        <el-button type="primary" @click="handleSave('保存')" size="small">保存</el-button>
        <el-button type="primary" @click="handleSubmit('提交')" size="small">提交</el-button>
        <el-button @click="close" size="small">取消</el-button>
        <el-button @click="reset" size="small">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newForm',
  data() {
    return {
      limitCount: 1,
      labelPosition: 'right',
      fileList: [],
      rules: {
        mechanism: [
          { required: true, message: '请输入所属机构', trigger: 'blur' }
        ],
        keyUnits: [
          { required: true, message: '请输入所属重点部位', trigger: 'blur' }
        ],
        applicationId: [
          { required: true, message: '请输入申请编号', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入施工单位', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入施工区域', trigger: 'blur' }
        ],
        start: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        end: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      },
      formData: {
        mechanism: '',
        keyUnits: '',
        applicationId: '',
        unit: '',
        address: '',
        careful: '',
        start: '',
        end: '',
        enclosure: '',
        inputTime: '',
        inputAddress: '',
        inputPerson: ''
      },
      flowData: [
        {
          index: 1,
          date: '',
          name: '',
          address: ''
        }
      ]
    }
  },
  methods: {
    // 取消新增
    close() {
      this.$emit('addItem', false)
    },
    handleSave(title) {
      console.log(this.formData, 'formData')
      this.$message({
        message: `${title}成功！`,
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.$emit('addItem', false)
        }
      })
    },
    handleSubmit(title) {
      this.$message({
        message: `${title}成功！`,
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.$emit('addItem', false)
        }
      })
    },
    reset() {
      this.$refs.mainForm1.resetFields()
    },
    handleAdd() {
      // eslint-disable-next-line no-unused-vars
      let conts = this.flowData.length
      conts++
      this.flowData.push({
        index: conts,
        date: '',
        name: '',
        address: ''
      })
    },
    handleDelete(index) {
      this.flowData.splice(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.role-manage-import-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      height: 30px;
      color: #333333;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
    .main-box {
      width: 80%;
      margin: 0 auto;
      height: calc(~'100%-30px');
      .box-title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      .create-from {
        border: 1px solid #ddd;
        padding: 5px 10px;
        // width: 80%;
        max-width: 1360px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          width: 100%;
          height: 96%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: calc(100% / 3);
            height: 36px;
            display: flex;
            span {
              width: 150px;
              height: 96%;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            section {
              flex: 1;
              height: 100%;
              padding: 0px 10px;
              display: flex;
              align-items: center;
              .el-select {
                width: 100%;
              }
              .el-cascader {
                width: 100%;
              }
            }
          }
          .last {
            width: 100%;
          }
        }
      }
      .transfer {
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        max-width: 1360px;
        height: 580px;
        margin: 15px auto;
        display: flex;
        justify-content: space-around;
        section {
          width: 40%;
          height: 100%;
          h3 {
            text-align: center;
            background: #ebebeb;
            padding: 10px 0px;
          }
          .section {
            width: 100%;
            height: 520px;
            border: 1px solid #ededed;
            margin-top: 5px;
            overflow: auto;
          }
        }
      }
      .main-form {
        padding: 20px;
        border: 1px solid #ddd;
        background: #f5f5f5;
      }
    }
  }
  .p-search-footer {
    width: 80%;
    margin: 30px auto;
    text-align: center;
  }
  /deep/ .hide {
    .el-upload,.el-upload--text {
      display: none!important;
    }
    .el-upload-list__item,is-success {
      margin-top: 0;
    }
  }
  /deep/ .el-table {
    .el-input {
      .el-input__inner {
        // padding: 0!important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .cell {
      padding: 0;
    }
  }
  .lookFa {
    position: relative;
  }
  .look {
    display: inline-block;
    position:absolute;
    height: 35px;
    width: 50px;
    border: 1px solid #ccc;
    top: 0;
    right: 0;
    text-align: center;
  }
}
</style>
