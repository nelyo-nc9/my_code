<!--  -->
<template>
  <div class="box">
    <div class="btn" v-if="ishaha&&gradingRecords">
      <el-button size="mini" style="width:70px;" icon="el-icon-printer" v-print="printdata">打印</el-button>
      <el-button size="mini" style="width:70px;" @click="back">取消</el-button>
    </div>
    <div class="big-box" v-if="ishaha&&gradingRecords" id="big-box">
      <h3>{{this.title}}</h3>
      <div class="from-list">
        <div class="form-item-div">
          <div class="form-item">
            <label class="label">申请编号</label>
            <div>{{formData.serialnumber}}</div>
          </div>
          <div class="form-item">
            <label>所属机构</label>
            <div>{{formData.institutions}}</div>
          </div>
        </div>

        <div class="form-item-div">
          <div class="form-item">
            <label>所属部门</label>
            <div>{{formData.department}}</div>
          </div>
          <div class="form-item">
            <label>申请日期</label>
            <div>{{formData.applicationDate}}</div>
          </div>
        </div>

        <div class="form-item-div">
          <div class="form-item">
            <label>申请人</label>
            <div>{{formData.applicant}}</div>
          </div>
          <div class="form-item">
            <label>考核自评分数</label>
            <div>
              {{formData.score}}
              <el-button type="primary" @click="checkDetails" v-if="typedata=='dpskh'">查看详情</el-button>
              <el-button type="primary" @click="checkDetails" v-if="typedata=='zhbab'">复批评分</el-button>
              <el-button type="primary" @click="checkDetails" v-if="typedata=='khjd'">复批评分</el-button>
            </div>
          </div>
        </div>

        <div class="form-item-div">
          <div class="form-item">
            <label>考核开始时间</label>
            <div>{{formData.startTime}}</div>
          </div>
          <div class="form-item">
            <label>考核结束时间</label>
            <div>{{formData.endTime}}</div>
          </div>
        </div>

        <div class="form-item-div">
          <div class="form-item">
            <label>上一级审批人</label>
            <div>{{formData.approver}}</div>
          </div>
          <div class="form-item">
            <label>状态</label>
            <div>{{formData.status}}</div>
          </div>
        </div>

        <div class="form-item-div">
          <div class="form-items">
            <label>审批记录</label>
            <div v-html="formData.record"></div>
          </div>
        </div>
        <div class="form-item-div">
          <div class="form-itemt">
            <label class="label">审批</label>
            <div class="form-itemt-btn">
              <el-button size="mini" style="height:30px" type="primary" @click="good">同意</el-button>
              <el-button size="mini" style="height:30px" type="danger">驳回</el-button>
            </div>
          </div>
          <div class="form-itemt">
            <label class="label">审批意见</label>
            <el-input type="textarea" v-model="formData.name" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div class="list-buttom">
        <div class="form-item">
          <label>录入时间</label>
          <div>{{formData.updateAt}}</div>
        </div>
        <div class="form-item">
          <label>录入机构</label>
          <div>{{formData.updateOrg}}</div>
        </div>
        <div class="form-item" :name="typedata">
          <label>录入人</label>
          <div>{{formData.updatePe}}</div>
        </div>
      </div>
    </div>
    <examine v-if="!ishaha"></examine>
    <hq-edit v-if="!gradingRecords"></hq-edit>
  </div>
</template>
<script>
import examine from './examine'
import hqEdit from './hqEdit'
export default {
  name: '',
  components: {
    examine,
    hqEdit
  },
  props: {
    typedata: {
      type: String,
      default: 'dpskh'
    }
  },
  data() {
    return {
      ishaha: true,
      ispipi: false,
      gradingRecords: true,
      title: '考核自评审批',
      printdata: { id: 'big-box', popTitle: '' },
      formData: {
        name: '',
        serialnumber: '20200823',
        institutions: '西安研发中心',
        department: 'xxxx部门',
        applicationDate: '2020-08-23',
        applicant: '王小虎',
        score: '99',
        startTime: '2019-01-01',
        endTime: '2020-01-01',
        approver: 'XXXX',
        status: '机构自评',
        record:
          '申请人：张明 于2019.02.26 11:30 提交  <br/>申请部门负责人：李经理  于2019.02.26 14:30  审批：通过  审批意见：无',
        port: '',
        portNum: '',
        updateAt: '2020-02-20 17:15',
        updateOrg: 'xxx机构',
        updatePe: '三哥'
      }
    }
  },
  methods: {
    close() {
      if (this.typedata == 'dpskh') {
        this.ishaha = true
      } else if (this.typedata == 'zhbab') {
        this.gradingRecords = true
      } else if (this.typedata == 'khjd') {
        this.gradingRecords = true
      }
    },

    checkDetails() {
      if (this.typedata == 'dpskh') {
        this.ishaha = false
      } else if (this.typedata == 'zhbab') {
        this.gradingRecords = false
      } else if (this.typedata == 'khjd') {
        this.gradingRecords = false
      }
    },

    back() {
      this.$parent.close()
    },

    good() {
      this.$parent.close()
      this.$notify.warning({
        title: '提示',
        message: '审批成功！'
      })
    }
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
@media print {
  .big-box {
    width: 900px;
    height: 515px;
    border: 1px solid #ccc;
    margin: 0 auto;
    // margin-left: 40px;
    h3 {
      margin-top: 35px;
      margin-left: 400px;
    }
    .from-list {
      width: 817.2px;
      height: 332px;
      border: 1px solid #ccc;
      margin: 0 auto;
      margin-top: 30px;
      .form-item-div {
        display: flex;
        .form-item {
          flex: 1;
          display: flex;
          // float: left;
          /deep/ .box .big-box .from-list .form-item-div .form-item label {
            background: #f1f1f1;
          }
          label {
            width: 130px;
            padding-left: 36px;
            background: #f1f1f1;
            display: inline-block;
            height: 35px;
            font-size: 13px;
            line-height: 35px;
            text-align: left;
            border-bottom: 1px solid #e1e1e1;
          }
          .lable {
            background: #f1f1f1;
          }
          div {
            // width: 278px;
            width: 278px;
            overflow: hidden;
            height: 35px;
            line-height: 35px;
            padding-left: 36px;
            border-bottom: 1px solid #e1e1e1;
            /deep/ .el-button--primary {
              display: none;
              height: 32px;
              margin-right: 5px;
              margin-top: 1px;
              line-height: 9px;
              float: right;
              font-size: 12px;
            }
          }
        }
        .form-itemt {
          flex: 1;
          display: flex;
          // float: left;
          label {
            width: 130px;
            background: #f1f1f1;
            height: 55px;
            font-size: 13px;
            line-height: 55px;
            text-align: center;
            float: left;
          }
          .form-itemt-btn {
            width: 278px;
            height: 55px;
            //   border-bottom: 1px solid #e1e1e1;
            float: left;
            line-height: 55px;
            text-align: center;
          }
          /deep/.el-textarea {
            width: 277px;
            height: 55px;
          }
          /deep/.el-textarea__inner {
            width: 277px;
            height: 55px;
            border-radius: 0px;
            border: none;
            //   border-bottom: 1px solid #e1e1e1;
          }
        }
        .form-items {
          flex: 1;
          display: flex;
          // float: left;
          label {
            width: 130px;
            padding-left: 36px;
            background: #f1f1f1;
            display: inline-block;
            height: 100px;
            font-size: 13px;
            line-height: 100px;
            text-align: left;
            border-bottom: 1px solid #e1e1e1;
          }
          div {
            flex: 1;
            height: 100px;
            border-bottom: 1px solid #e1e1e1;
            padding-top: 10px;
            padding-left: 36px;
            overflow: hidden;
          }
        }
      }
    }
    .list-buttom {
      width: 770px;
      height: 37px;
      border: 1px solid #e1e1e1;
      //  margin-left: 52px;
      margin: 0 auto;
      margin-top: 30px;
      display: flex;
      .form-item {
        flex: 1;
        display: flex;
        // width:150px;
        label {
          width: 101px;
          background: #f1f1f1;
          display: inline-block;
          height: 35px;
          font-size: 13px;
          line-height: 37px;
          text-align: center;
        }
        div {
          width: 155px;
          height: 35px;
          line-height: 35px;
          padding-left: 35px;
        }
      }
    }
  }
}
.box {
  width: 100%;
  height: 100%;
  .btn {
    width: 500px;
    height: 50px;
    margin-top: 30px;
    margin-left: 40px;
  }
  .big-box {
    width: 900px;
    height: 515px;
    border: 1px solid #ccc;
    margin-left: 40px;
    h3 {
      margin-top: 35px;
      margin-left: 400px;
    }
    .from-list {
      width: 817.2px;
      height: 332px;
      border: 1px solid #ccc;
      margin: 0 auto;
      margin-top: 30px;
      .form-item-div {
        display: flex;
        .form-item {
          flex: 1;
          display: flex;
          // float: left;
          label {
            width: 130px;
            padding-left: 36px;
            background: #f1f1f1;
            display: inline-block;
            height: 35px;
            font-size: 13px;
            line-height: 35px;
            text-align: left;
            border-bottom: 1px solid #e1e1e1;
          }
          div {
            // width: 278px;
            width: 278px;
            overflow: hidden;
            height: 35px;
            line-height: 35px;
            padding-left: 36px;
            border-bottom: 1px solid #e1e1e1;
            /deep/ .el-button--primary {
              height: 32px;
              margin-right: 5px;
              margin-top: 1px;
              line-height: 9px;
              float: right;
              font-size: 12px;
            }
          }
        }
        .form-itemt {
          flex: 1;
          display: flex;
          // float: left;
          label {
            width: 130px;
            background: #f1f1f1;
            height: 55px;
            font-size: 13px;
            line-height: 55px;
            text-align: center;
            float: left;
          }
          .form-itemt-btn {
            width: 278px;
            height: 55px;
            //   border-bottom: 1px solid #e1e1e1;
            float: left;
            line-height: 55px;
            text-align: center;
          }
          /deep/.el-textarea {
            width: 277px;
            height: 55px;
          }
          /deep/.el-textarea__inner {
            width: 277px;
            height: 55px;
            border-radius: 0px;
            border: none;
            //   border-bottom: 1px solid #e1e1e1;
          }
        }
        .form-items {
          flex: 1;
          display: flex;
          // float: left;
          label {
            width: 130px;
            padding-left: 36px;
            background: #f1f1f1;
            display: inline-block;
            height: 100px;
            font-size: 13px;
            line-height: 100px;
            text-align: left;
            border-bottom: 1px solid #e1e1e1;
          }
          div {
            flex: 1;
            height: 100px;
            border-bottom: 1px solid #e1e1e1;
            padding-top: 10px;
            padding-left: 36px;
            overflow: hidden;
          }
        }
      }
    }
    .list-buttom {
      width: 770px;
      height: 37px;
      border: 1px solid #e1e1e1;
      //  margin-left: 52px;
      margin: 0 auto;
      margin-top: 30px;
      display: flex;
      .form-item {
        flex: 1;
        display: flex;
        // width:150px;
        label {
          width: 101px;
          background: #f1f1f1;
          display: inline-block;
          height: 35px;
          font-size: 13px;
          line-height: 37px;
          text-align: center;
        }
        div {
          width: 155px;
          height: 35px;
          line-height: 35px;
          padding-left: 35px;
        }
      }
    }
  }
}
</style>
