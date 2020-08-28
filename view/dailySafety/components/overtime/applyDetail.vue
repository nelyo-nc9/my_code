<template>
  <div id="applyDetail">
    <div class="meus">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>加班管理</el-breadcrumb-item>
        <el-breadcrumb-item>施工加班管理</el-breadcrumb-item>
        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btns">
      <template v-if="title === '查看' || title === '已审批'">
        <el-button size="mini" @click="Toprint" v-print="'#printJS_people'">打印</el-button>
        <el-button size="mini" @click="cancle">取消</el-button>
      </template>
    </div>
    <div class="main-box" ref="printJS_people" id="printJS_people">
        <div class="box-title">施工加班申请单详情</div>
        <div class="main-form">
          <el-form :rules="rules" ref=" " size="mini" :model="formData" label-position="right" label-width="145px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="所属机构" prop="mechanism">
                <el-input size="small" clearable v-model="formData.mechanism" :disabled="title !== '编辑'"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属重点部位" prop="keyUnits">
                  <el-input size="small" clearable v-model="formData.keyUnits" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请编号" prop="applicationId">
                  <el-input size="small" clearable v-model="formData.applicationId" :disabled="title !=='编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="施工区域" prop="unit">
                <el-input size="small" clearable v-model="formData.unit" :disabled="title !== '编辑'"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="施工区域" prop="address">
                  <el-input size="small" clearable v-model="formData.address" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="施工时间" prop="constructionTime">
                  <el-input size="small" clearable v-model="formData.constructionTime" :disabled="title !=='编辑'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="施工事项" prop="careful">
                  <el-input type="textarea" v-model="formData.careful" :disabled="title !=='编辑'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="附件">
                  <el-input size="small" clearable v-model="formData.enclosure" :disabled="title !=='编辑'"></el-input>
                  <!-- <span>浏览</span> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="施工人员 ">
                  <el-button type="primary" @click="handleAdd" v-if="title === '编辑'">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-for="(item, index) in formData.personnalInform">
              <el-form class="reForm" :key="index" :rules="formRules" ref="mainForm1" size="mini" :model="item" label-position="right" label-width="145px">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="人员姓名" prop="name">
                      <el-input size="small" clearable v-model="item.name" :disabled="title !=='编辑'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="身份证号" prop="number">
                      <el-input size="small" clearable v-model="item.number" :disabled="title !=='编辑'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="联系电话" prop="phone">
                      <el-input size="small" clearable v-model="item.phone" :disabled="title !=='编辑'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="col-up">
                    <el-form-item label="人员照片">
                      <el-upload
                        :disabled="title !=='编辑'"
                        :class="{ hide: item.hideUpload }"
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="personPreview"
                        :on-remove="function(file, fileList) { return personRemove(file, fileList, index)}"
                        :before-remove="personBeforeRemove"
                        :on-exceed="handleExceed"
                        :on-change="function(file, fileList) { return onChange(file, fileList, index)}"
                        :file-list="item.fileList">
                        <el-button size="mini" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <!-- <span class="deleteIcon" v-if="index === formData.personnalInform.length - 1" @click="handleDelete(index)"></span> -->
                  </el-col>
                </el-row>
                <span class="rightDelIcon" v-if="index > 0 && title === '编辑'" @click="handleDelete(index)">
                  <i class="iconfont icon-delete"></i>
                </span>
              </el-form>
            </template>
            <el-row>
              <el-col :span="8">
                <el-form-item label="录入时间" prop="inputTime">
                  <el-input clearable v-model="formData.inputTime" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="录入机构" prop="inputAddress">
                  <el-input clearable v-model="formData.inputAddress" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="录入人" prop="inputPerson">
                  <el-input clearable v-model="formData.inputPerson" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="审批意见" prop="inputPerson" :disabled="title !== '编辑'">
                  <el-input type="textarea" v-model="formData.inputPerson"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="operationBtns" v-if="title === '审批'">
          <template>
            <el-button size="small" type="primary">同意</el-button>
            <el-button size="small" @click="cancle">取消</el-button>
            <el-button size="small">驳回</el-button>
          </template>
        </div>
        <div class="main-form">
          <el-form size="mini" :model="operationData" label-position="right" label-width="145px">
            <el-form-item label="审批人修订记录">
              <el-input type="textarea" v-model="operationData.inputPerson" :disabled="title !== '编辑'"></el-input>
            </el-form-item>
            <el-form-item label="审批记录">
              <el-table :data="listData" style="width: 100%" border>
                <el-table-column prop="address" label="所属机构" align="center">
                  <template slot-scope="scope">
                      <el-tooltip :disabled="scope.row.address.length < 12" :content="scope.row.address" placement="top" effect="light">
                        <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                      </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="所属部门" align="center">
                  <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.date.length < 12" :content="scope.row.date" placement="top" effect="light">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="姓名" align="center">
                  <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.date.length < 12" :content="scope.row.date" placement="top" effect="light">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="审批时间" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.date.length < 12" :content="scope.row.date" placement="top" effect="light">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="审批" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.date.length < 12" :content="scope.row.date" placement="top" effect="light">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="审批意见" align="center">
                  <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.date.length < 12" :content="scope.row.date" placement="top" effect="light">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <div
          style="margin-top:20px;width:80%;"
        >
          <p style="margin-bottom:20px;">审批过程：</p>
          <el-steps :active="1" finish-status="success" style="width:30%;">
            <el-step title="yyy1"></el-step>
            <el-step title="yyy2"></el-step>
            <el-step title="yyy3"></el-step>
          </el-steps>
        </div>
        <div class="p-search-footer" v-show="title === '编辑'">
          <el-button type="primary" @click="save" size="small">保存</el-button>
          <el-button type="primary" @click="submit" size="small">提交</el-button>
          <el-button @click="cancle" size="small">取消</el-button>
          <el-button @click="reset" size="small">重置</el-button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'applyDetail',
  props: {
    isShowDetail: {
      type: Boolean,
      default: false
    },
    detailList: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formRules: {},
      formData: {
        mechanism: '',
        keyUnits: '',
        applicationId: '',
        unit: '',
        address: '',
        constructionTime: '',
        careful: '',
        enclosure: '',
        inputTime: '',
        inputInstitution: '',
        inputPeople: '',
        personnalInform: [
          {
            name: '',
            number: '',
            phone: '',
            fileList: [
              {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
            ],
            hideUpload: false
          },
          {
            name: '',
            number: '',
            phone: '',
            fileList: [],
            hideUpload: false
          }
        ]
      },
      operationData: {
      },
      listData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      rules: {},
      limitCount: 1
    }
  },
  mounted() {
    // 在存在默认图片时展示图片列表，隐藏上传组件
    this.formData.personnalInform.forEach((element, index) => {
      this.$set(element, 'hideUpload', element.fileList.length > 0)
    })
  },
  methods: {
    personPreview() {},
    personRemove(file, fileList, index) {
      this.$set(this.formData.personnalInform[index], 'hideUpload', fileList.length >= this.limitCount)
    },
    onChange(file, fileList, index) {
      // 为点击上传的组件增加hideUpload,控制上传组件
      this.$set(this.formData.personnalInform[index], 'hideUpload', fileList.length >= this.limitCount)
    },
    personBeforeRemove() {},
    handleExceed() {},
    // 打印
    Toprint() {},
    // 取消
    cancle() {
      this.$emit('update:isShowDetail', false)
    },
    // 保存
    save() {
      this.$emit('update:isShowDetail', false)
    },
    // 提交
    submit() {
      this.$emit('update:isShowDetail', false)
    },
    // 重置
    reset() {
    },
    handleAdd() {
      this.formData.personnalInform.push({
        name: '',
        number: '',
        phone: '',
        fileList: [],
        hideUpload: false
      })
    },
    handleDelete(index) {
      // if (this.formData.personnalInform.length <= 1) { return }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.formData.personnalInform.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
#applyDetail {
  height: 100%;
  .btns {
    margin: 10px;
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
      .p-search-footer {
        // max-width: 1360px;
        padding-top: 10px;
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
      .main-form {
        padding: 30px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        .reForm {
          position: relative;
          .rightDelIcon {
            display: inline-block;
            height: 35px;
            line-height: 35px;
            top: 0;
            right: -20px;
            position: absolute;
            cursor: pointer;
          }
        }
      }
      .operationBtns {
        text-align: center;
        margin: 30px 0;
      }
    }
    /deep/ .el-table {
      .el-input {
        .el-input__inner {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .cell {
        padding: 0;
      }
    }
    // /deep/ .el-table__row:hover > td {
    //   background-color: #ffffff !important;
    // }
    // /deep/ .el-table__row--striped:hover > td {
    //   background-color: #fafafa !important;
    // }
    .col-up {
      position: relative;
      .deleteIcon {
        display: inline-block;
        height: 35px;
        line-height: 35px;
        text-align: center;
        position:absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        font-size: 18px;
      }
      .deleteIcon::before {
        content: 'x';
      }
    }
}
</style>
