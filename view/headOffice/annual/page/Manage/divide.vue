<!--  -->
<template>
  <div class="box">
    <div class="btn" v-show="IsEditor">
      <el-button size="mini" icon="el-icon-s-check" @click="examinationApproval">提交上级审批</el-button>
      <el-button size="mini" icon="el-icon-edit-outline" @click="changeIsEdit">编辑自评得分</el-button>
      <el-button size="mini" icon="el-icon-printer" v-print="printdata">打印</el-button>
      <el-button size="mini" icon="el-icon-back" @click="back">返回</el-button>
    </div>
    <div class="btn" v-show="!IsEditor">
      <el-button size="mini" icon="el-icon-folder-checked" @click="seveScore">保存</el-button>
      <el-button size="mini" icon="el-icon-close" @click="changeIsEdit">关闭</el-button>
    </div>
    <h3>成都开发中心2020年考核项目自评</h3>
    <div class="main" id="big-box">
      <div class="list-box-table">
        <el-table
          :row-style="{height:'10px'}"
          :cell-style="{padding:'0px'}"
          style="font-size: 12px;height:1045px;"
          :span-method="objectSpanMethod"
          stripe
          border
          height="100%"
          max-height="1045"
          :data="tableData"
          @cell-dblclick="dbclickTable"
        >
          <el-table-column prop="number" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="project" label="考核项目" align="center"></el-table-column>
          <el-table-column prop="serialNumber" label="编号" width="60" align="center">
            <template slot-scope="scope">
              <p class="serialNumberColor">{{scope.row.serialNumber}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="考核内容" width="350" align="center"></el-table-column>
          <el-table-column prop="score" label="分数" width="80" align="center"></el-table-column>
          <el-table-column prop="scoringCriteria" label="评定标准" width="110" align="center"></el-table-column>
          <el-table-column prop="scoreModel" label="评分模式" width="120" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" width="180" align="center"></el-table-column>
          <el-table-column prop="projectRemark" label="考核项目" align="center">
            <template slot-scope="scope">
              <el-checkbox
                :checked="scope.row.projectRemark==1"
                v-model="scope.row.projectRemark"
                :disabled="IsEditor"
                v-if="!scope.row.isHeadquarters"
                @change="checkboxChange(scope.row)"
              >
                <p class="checkboxweight">启用</p>
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="dwRemark" label="不参与考核理由" width="160" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectRemark==0 && !scope.row.isHeadquarters">
                <el-input
                  v-model="scope.row.dwRemark"
                  :disabled="IsEditor"
                  class="elInputBorder"
                  placeholder="请输入理由"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="selfScore" label="自评得分" width="160" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectRemark && !scope.row.isHeadquarters">
                <el-input
                  v-model="scope.row.selfScore"
                  :disabled="IsEditor"
                  class="elInputBorder"
                  placeholder="请输入自评分"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="日志参考及评分依据" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column label="序号" type="index" width="80" align="center" sortable></el-table-column>
        <el-table-column property="date" label="记录日期" width="150"></el-table-column>
        <el-table-column property="name" label="对应考核项" width="200"></el-table-column>
        <el-table-column property="address" label="工作内容" width="200"></el-table-column>
        <el-table-column property="name" label="相关责任人" width="200"></el-table-column>
        <el-table-column property="name" label="备注" width="200"></el-table-column>
        <el-table-column property="name" label="附件" width="200"></el-table-column>
      </el-table>

      <p class="el-table-p">请填写评分依据,100字内(必填)</p>
      <el-input type="textarea" placeholder="请输入评分依据" v-model="grading" row="4"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { headOfficeMixin } from '../../../commonjs/headOfficeMixin'
export default {
  name: '',
  components: {},
  mixins: [headOfficeMixin],
  data() {
    return {
      grading: '',
      IsEditor: true, //编辑自评得分
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      dialogTableVisible: false,
      printdata: { id: 'big-box', popTitle: '成都开发中心2020年考核项目自评' },
      properties: [
        { field: 'project', displayName: '考核项目' },
        { field: 'serialNumber', displayName: '编号' },
        { field: 'content', displayName: '考核内容' },
        { field: 'score', displayName: '分数' },
        { field: 'scoringCriteria', displayName: '评定标准' },
        { field: 'scoreModel', displayName: '评分模式' },
        { field: 'remark', displayName: '备注' },
        { field: 'projectRemark', displayName: '考核项目' },
        { field: 'dwRemark', displayName: '不参与考核理由' },
        { field: 'selfScore', displayName: '自评得分' }
      ], // 打印的表头和字段
      tableData: [
        {
          isHeadquarters: false,
          project: '组织领导',
          serialNumber: 1,
          number: 1,
          content: '部门主要领导重视安全管理工作，纳入议事日程，时常跟踪问效。',
          score: 10,
          rowspan: 3,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: true,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: false,
          project: '组织领导',
          serialNumber: 2,
          number: 1,
          rowspan: 0,
          content: '分管领导认真履行职责，经常检查指导，督促抓好落实。',
          score: 10,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: true,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: false,
          project: '组织领导',
          serialNumber: 3,
          number: 1,
          rowspan: 0,
          content: '年度安全保卫工作目标明确，方案合理，措施有效，总结客观。',
          score: 10,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: true,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: false,
          project: '管理机构',
          serialNumber: 4,
          number: 2,
          content: '部门主要领导重视安全管理工作，纳入议事日程，时常跟踪问效。',
          score: 10,
          rowspan: 3,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: false,
          project: '管理机构',
          serialNumber: 5,
          number: 2,
          rowspan: 0,
          content: '分管领导认真履行职责，经常检查指导，督促抓好落实。',
          score: 10,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: true,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: false,
          project: '管理机构',
          serialNumber: 6,
          rowspan: 0,
          number: 2,
          content: '年度安全保卫工作目标明确，方案合理，措施有效，总结客观。',
          score: 10,
          scoringCriteria: 'werqewr',
          scoreModel: '自评估',
          isScoreModel: true,
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与',
          selfScore: ''
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 3,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          isScoreModel: false,
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与',
          selfScore: ''
        }
      ],
      tableDataCopy: []
    }
  },
  methods: {
    // 计算自评分数 未启用项均摊给启用项
    initCalculate() {
      let data = this.tableData
      let isChecked = {
        checked: {
          length: 0,
          score: 0
        },
        nochcked: {
          length: 0,
          score: 0
        }
      }

      // 计算已启用和未启用的分数和个数
      for (let i = 0; i < data.length; i++) {
        if (data[i].isScoreModel && data[i].projectRemark) {
          isChecked.checked.length++
          isChecked.checked.score += Number(this.tableDataCopy[i].score)
        } else if (data[i].isScoreModel && !data[i].projectRemark) {
          isChecked.nochcked.length++
          isChecked.nochcked.score += Number(this.tableDataCopy[i].score)
        }
      }

      //赋值 保留俩位小数
      let mean = Math.floor((isChecked.nochcked.score / isChecked.checked.length) * 100) / 100

      for (let i = 0; i < data.length; i++) {
        if (data[i].isScoreModel && data[i].projectRemark) {
          data[i].score = this.tableDataCopy[i].score + mean
        } else {
          data[i].score = this.tableDataCopy[i].score
        }
      }
    },

    // 复选框改变事件
    checkboxChange(a) {
      if (!a.projectRemark) {
        a.dwRemark = ''
      } else {
        a.dwRemark = ''
      }
      this.initCalculate()
    },

    // 查看评分依据
    dbclickTable(row, column, cell, event) {
      if (column.property == 'content') {
        this.dialogTableVisible = true
      }
    },

    back() {
      this.$parent.close()
    },

    //  是否编辑
    changeIsEdit() {
      this.IsEditor = !this.IsEditor
    },

    //  提交上级审批
    examinationApproval() {
      this.$notify.success({
        title: '提示',
        message: '模拟提交成功'
      })
    },

    // 模拟保存
    seveScore() {
      this.$notify.success({
        title: '提示',
        message: '模拟保存成功'
      })
      this.IsEditor = true
    }
  },
  created() {
    // 保存表格原始值
    let a = JSON.stringify(this.tableData)
    this.tableDataCopy = JSON.parse(a)

    // 初始化分数
    this.initCalculate()
  },
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
/deep/.elInputBorder input {
  border: none !important;
}

/deep/.el-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2d72d3 !important;
  border-color: #2d72d3 !important;
}

/deep/.el-table .el-checkbox__inner::after {
  border: 1px solid #fff !important;
  border-top: none !important;
  border-left: none !important;
}
.jgpp {
  margin-right: 10px;
  // width: 58px !important;
  margin-top: 8px !important;
}
.checkboxweight {
  font-weight: 350;
}
.serialNumberColor {
  color: #94163c;
}
.el-table-p {
  line-height: 40px;
  text-align: center;
}
.box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin-top: 20px;
  .btn {
    width: 500px;
    height: 50px;
    margin-top: 30px;
    margin-left: 20px;
  }
  h3 {
    margin-left: 600px;
  }
  .main {
    width: 100%;
    // height: calc(~'100% - 112px');
    .list-box-table {
      width: 100%;
      // height: calc(~'150% - 40px');
      margin-top: 20px;
    }
  }
}
@media print {
  .main {
    width: 100%;
    .list-box-table {
      width: calc(~'100% - 152px');
      margin-top: 20px;
      .el-table .el-checkbox__input.is-checked {
        width: 14px;
        height: 14px;
        background: #646464;
        border-color: #646464 !important;
      }
      /deep/.el-table .el-checkbox__input.is-checked .el-checkbox__inner {
        width: 14px;
        height: 14px;
        background-color: #646464;
        border-color: #646464 !important;
      }

      /deep/.el-table .el-checkbox__inner::after {
        border: 1px solid #000 !important;
        border-top: none !important;
        border-left: none !important;
      }
    }
  }
}
</style>