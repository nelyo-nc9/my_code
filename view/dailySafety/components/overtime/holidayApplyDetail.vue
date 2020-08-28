<template>
  <div id="holidayApplyDetail">
    <div class="meus">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>加班管理</el-breadcrumb-item>
        <el-breadcrumb-item>节假日加班人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>申请列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btns">
      <template v-if="title === '查看'">
        <el-button size="mini" @click="Toprint" v-print="'#printJS_people'">打印</el-button>
        <el-button size="mini" @click="cancle">撤回</el-button>
        <el-button size="mini" @click="isflow = true">查看流程</el-button>
        <el-button size="mini" @click="cancle">关闭</el-button>
      </template>
      <template v-if="title==='已审批'">
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
                <el-input clearable v-model="formData.mechanism" :disabled="title !== '编辑'"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属重点部位" prop="keyUnits">
                  <el-input clearable v-model="formData.keyUnits" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请编号" prop="applicationId">
                  <el-input clearable v-model="formData.applicationId" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="加班地点" prop="unit">
                  <el-input clearable v-model="formData.unit" :disabled="title !== '编辑'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开始日期" prop="start">
                  <el-date-picker
                    size="small"
                    :disabled="title !== '编辑'"
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
                    :disabled="title !== '编辑'"
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
                <el-form-item label="附件">
                  <el-input size="small" clearable v-model="formData.enclosure"></el-input>
                  <!-- <span>浏览</span> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="加班人员">
                <el-table :data="jumpData" style="width: 100%">
                  <el-table-column prop="index" width="50" label="序号" align="center"></el-table-column>
                  <el-table-column prop="date" label="姓名" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="用户名" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="出生日期" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="身份证号码" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="名族" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="政治面貌" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="学位" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="学历" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="专业" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="所属机构" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="所属部门" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户类别" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户状态" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="职务" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                        </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="用户类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="scope.row.address.length < 4" :content="scope.row.address" placement="top" effect="light">
                          <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
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
              <el-table :data="listData" style="width: 100%">
                <el-table-column prop="address" label="所属机构" align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="所属部门" align="center">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="姓名" align="center">
                  <template slot-scope="scope">
                        <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="审批时间" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                        <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="审批" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                        <el-input v-model="scope.row.address" :disabled="title!=='编辑'"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="审批意见" align="center">
                  <template slot-scope="scope">
                        <el-input v-model="scope.row.date" :disabled="title!=='编辑'"></el-input>
                    </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-if="title !== '查看'"
          style="margin-top:20px;width:80%;"
        >
          <p style="margin-bottom:20px;">审批过程：</p>
          <el-steps :active="1" finish-status="success" style="width:30%;">
            <el-step title="yyy1"></el-step>
            <el-step title="yyy2"></el-step>
            <el-step title="yyy3"></el-step>
          </el-steps>
        </div>
        <!--查看流程-->
        <div v-if="isflow">
          <el-dialog title="流程视图" :visible.sync="isflow" width="50%">
            <el-table :data="flowData" style="width: 100%">
              <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="date" label="操作时间" align="center"></el-table-column>
              <el-table-column prop="address" label="操作内容" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="address" label="操作人" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="address" label="操作记录" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="date" label="发送时间" align="center"></el-table-column>
            </el-table>
          </el-dialog>
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
  name: 'holidayApplyDetail',
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
  computed: {
    // 申请列表查看和编辑 审核列表审批 已审批列表查看
    // isJudgment() {
    //   return this.title
    // }
  },
  data() {
    return {
      isflow: false, // 查看流程
      rules: {},
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
      flowData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      jumpData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
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
        inputAddress: '',
        inputPerson: ''
      }
    }
  },
  methods: {
    // 打印
    Toprint() {},
    handleClose() {
      this.$emit('update:isShowDetail', false)
    },
    // 取消
    cancle() {
      this.handleClose()
    },
    // 保存
    save() {
      this.handleClose()
    },
    // 提交
    submit() {
      this.handleClose()
    },
    // 重置
    reset() {
    }
  }
}
</script>

<style lang="less" scoped>
#holidayApplyDetail {
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
      .create-from {
        border: 1px solid #ddd;
        padding: 5px 10px;
        width: 80%;
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
            .box {
              .imageBox {
                .topBox {
                  width: 123px;
                  height: 147px;
                }
                .peopleX {
                  height: 36px;
                  line-height: 36px;
                  width: 150px;
                  text-align: center;
                  background-color: #f5f5f5;
                  margin-top: 5px;
                }
                .peopleImg {
                  margin-top: 5px;
                  width: 123px;
                }
                float: left;
                margin-right: 20px;
                &:last-child {
                  margin-right: 0;
                }
                .imgBox {
                  width: 123px;
                  height: 147px;
                  border: 1px solid #ccc;
                  margin-right: 20px;
                }
              }
            }
          }
        }
      }
      .p-search-footer {
        // max-width: 1360px;
        padding-top: 10px;
        text-align: center;
      }
      .main-form {
        padding: 20px;
        border: 1px solid #ddd;
        background: #f5f5f5;
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
}
</style>
