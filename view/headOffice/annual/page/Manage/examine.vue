<!--  -->
<template>
  <div class="box">
    <div class="btn">
      <el-button size="mini" icon="el-icon-back" style="width:80px;height:30px;" @click="back">返回</el-button>
    </div>
    <h3>成都开发中心2020年考核项目自评</h3>
    <div class="main">
      <div class="list-box-table">
        <el-table
          :row-style="{height:'10px'}"
          :cell-style="{padding:'0px'}"
          :span-method="objectSpanMethod"
          style="font-size: 12px;"
          stripe
          border
          :data="tableData"
          @cell-dblclick="dbclickTable"
        >
          <el-table-column prop="number" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="project" label="考核项目" width="160" align="center"></el-table-column>
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
          <el-table-column prop="projectRemark" label="考核项目" width="120" align="center">
            <template slot-scope="scope">
              <el-checkbox
                :checked="scope.row.projectRemark==1"
                v-model="scope.row.projectRemark"
                disabled
                v-if="!scope.row.isHeadquarters"
              >
                <p class="checkboxweight">启用</p>
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="dwRemark" label="不参与考核理由" width="160" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.projectRemark==0 && !scope.row.isHeadquarters">
                <div>{{scope.row.dwRemark}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="selfScore" label="自评得分" width="160" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.selfScore}}</div>
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
export default {
  name: '',
  components: {},
  data() {
    return {
      grading: '',
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
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与',
          selfScore: ''
        }
      ]
    }
  },
  methods: {
    // 查看评分依据
    dbclickTable(row, column, cell, event) {
      if (column.property == 'content') {
        this.dialogTableVisible = true
      }
    },

    back() {
      this.$parent.close()
    },

    // 表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 0) {
        if (row.rowspan > 0) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  },
  created() {},
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
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
  margin-top: 20px;
  overflow-y: auto;
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
    // height: calc(~'99% - 112px');
    .list-box-table {
      width: 100%;
      // height: calc(~'150% - 40px');
      margin-top: 20px;
    }
  }
}
</style>