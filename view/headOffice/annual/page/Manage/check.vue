<!--  -->
<template>
  <div class="content">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>总行本级安全管理</el-breadcrumb-item>
          <el-breadcrumb-item>年度考核</el-breadcrumb-item>
          <el-breadcrumb-item>考核管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.topTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
    </div>
    <div class="button-top-div">
      <div class="button-top">
        <div class="button-left">
          <p class="jgpp">所属机构</p>
          <el-input v-model="institutions" disabled></el-input>
          <p class="jgpp">所属部门</p>
          <el-input v-model="department" disabled></el-input>
        </div>
        <p class="pp">考核年度</p>
        <el-select v-model="formData.agree">
          <el-option
            v-for="(item,index) in agreeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <p class="p2">考核标准</p>
        <el-select v-model="formData.agrees" class="select">
          <el-option
            v-for="(item,index) in agreesList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" class="btn-all" @click="show">生成年度考核项目</el-button>
        <p class="ps">总行下发考核时间范围</p>
        <el-date-picker
          style="height:38px;width:130px;margin-left:10px;"
          v-model="formData.startTime"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
        <p style="margin-left:10px;margin-top:6px;">至</p>
        <el-date-picker
          style="height:38px;width:130px;margin-left:10px;"
          v-model="formData.endTime"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
        <el-button
          type="primary"
          style="margin-left:10px;
            height:30px;font-size: 
            12px;line-height:5px;margin-top: 3px"
          @click="selfBtn"
        >考核自评</el-button>
      </div>
    </div>
    <div class="box" v-if="isDiv">
      <div class="btn" v-if="IsEditor">
        <el-button @click="changeIsEditor" icon="el-icon-edit-outline">编辑</el-button>
        <!-- @click="Toprint('考核项目表')" -->
        <el-button icon="el-icon-printer" v-print="printdata">打印</el-button>
      </div>
      <div class="btn" v-if="!IsEditor">
        <el-button icon="el-icon-folder-checked" @click="SaveAssessmentItems">保存</el-button>
        <el-button @click="changeIsEditor">取消</el-button>
      </div>
      <h3>成都开发中心2020年考核项目自评</h3>
      <div class="main" id="big-box">
        <div class="list-box-table">
          <el-table
            :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
            style="font-size: 12px;"
            :span-method="objectSpanMethod"
            stripe
            border
            :data="tableData"
          >
            <el-table-column prop="number" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="project" label="考核项目" align="center"></el-table-column>
            <el-table-column prop="serialNumber" label="编号" width="60" align="center">
              <template slot-scope="scope">
                <p class="serialNumberColor">{{scope.row.serialNumber}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="考核内容" width="350" align="center"></el-table-column>
            <el-table-column prop="score" label="分数" align="center"></el-table-column>
            <el-table-column prop="scoringCriteria" label="评定标准" align="center"></el-table-column>
            <el-table-column prop="scoreModel" label="评分模式" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column prop="projectRemark" label="考核项目" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  :checked="scope.row.projectRemark==1"
                  v-model="scope.row.projectRemark"
                  :disabled="IsEditor"
                  v-if="!scope.row.isHeadquarters"
                >
                  <p class="checkboxweight">启用</p>
                </el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="dwRemark" label="不参与考核理由" align="center">
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
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import divide from './divide'
let rowspan = 0
export default {
  name: '',
  components: {
    divide
  },
  data() {
    return {
      institutions: '自动填充',
      department: '自动填充',
      isDiv: false,
      printdata: { id: 'big-box', popTitle: '成都开发中心2020年考核项目自评' },
      formData: {
        agree: '2019',
        agrees: '2019年度考核',
        startTime: '',
        endTime: ''
      },
      agreeList: [
        { label: '2019', value: '2019' },
        { label: '2018', value: '2018' }
      ],
      agreesList: [
        { label: '2019年度考核', value: '2019年度考核' },
        { label: '2018年度考核', value: '2018年度考核' }
      ],
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
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
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 4,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 5,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 6,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 7,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 8,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 9,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 10,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 11,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 12,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 13,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 14,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 15,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 16,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 17,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 18,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 19,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 20,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 21,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 22,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 23,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        },
        {
          isHeadquarters: true,
          project: '惩罚扣分',
          serialNumber: 7,
          rowspan: 1,
          number: 24,
          content:
            '1.考核标准中所列内容缺项或未达到要求的按相应标准扣分；2.部门出现违法违规行为、刑事治安案件、安全责任事故，每发生一起视情扣3-5分，情节严重的按第四条执行。3.总行所属中心所管直属机构被评定为“不合格”的，每出现1个单位扣上级中心3分。',
          score: '-',
          scoringCriteria: '',
          scoreModel: '总行评分 \n (惩罚扣分)',
          remark: '略略略',
          projectRemark: false,
          dwRemark: '不想参与'
        }
      ],
      topTitle: '考核项目',
      downloadObject: [], //打印/导出数据
      IsEditor: true
    }
  },
  methods: {
    selfBtn() {
      this.$emit('modelChange', {}, '', 'Manage-Self')
    },

    show() {
      this.isDiv = true
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
    },

    // 是否启用编辑
    changeIsEditor() {
      this.IsEditor = !this.IsEditor
    },

    // 保存考核项
    SaveAssessmentItems() {
      this.$notify.success({
        title: '提示',
        message: '提交成功'
      })
      this.IsEditor = !this.IsEditor
    }
  },
  created() {},
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
.button-top-div {
  width: 100%;
  overflow-x: scroll;
}
.content {
  width: 100%;
  height: 100%;
  // overflow-y: auto;
  padding: 12px;
  .button-top {
    width: 1600px;
    height: 50px;
    margin-top: 30px;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    .button-left {
      display: flex;
      flex-direction: row;
      width: 445px;
      height: 100%;
      p {
        width: 150px;
        height: 30px;
        margin-top: 5px;
      }
      /deep/.el-input__inner {
        width: 124px;
        height: 30px;
      }
    }
    .pp {
      width: 58px;
      height: 30px;
      margin-top: 8px;
      margin-right: 10px;
    }
    .p2 {
      width: 58px;
      height: 30px;
      margin-top: 8px;
      margin-right: 10px;
      margin-left: 10px;
    }
    /deep/ .el-select {
      .el-input {
        .el-input__inner {
          height: 30px;
          width: 150px;
          border-radius: 5px;
        }
        .el-input__suffix {
          .el-input__suffix-inner {
            i {
              line-height: 30px;
            }
          }
        }
      }
    }
    .btn-all {
      margin-left: 10px;
      // width: 136px;
      height: 32px;
      line-height: 8px;
      font-size: 12px;
      margin-top: 2px;
      span {
        margin-left: -3px;
      }
    }
    .ps {
      margin-left: 20px;
      margin-top: 6px;
      width: 150px;
    }
    /deep/.el-input__inner {
      height: 30px;
    }
    /deep/.el-input__prefix {
      height: 38px;
    }
    /deep/.el-input__icon {
      line-height: 30px;
    }
  }
  .box {
    width: 100%;
    height: calc(~'100% - 112px');
    overflow-y: auto;
    margin-left: 20px;
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
      height: calc(~'100% - 112px');
      .list-box-table {
        width: calc(~'100% - 10px');
        height: calc(~'100% - 50px');
        margin-top: 20px;
      }
    }
  }
}
@media print {
  .main {
    width: calc(~'100% - 259px');
    margin: 0 auto;
    .list-box-table {
      width: 100%;
      margin-top: 20px;
      pointer-events: none;
    }
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
</style>