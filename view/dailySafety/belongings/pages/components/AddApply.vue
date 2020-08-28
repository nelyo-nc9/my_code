<template>
  <div class="org-manage-create-modify-box">
    <!-- 携物管理--新建/编辑弹窗 -->
    <div class="content">
      <div style="margin-top:20px;" v-if="listTitle === '携物申请审批记录单'">
        <el-button size="small" v-print="'#contentinfo'">打印</el-button>
        <el-button size="small" @click="dialogVisible = true">取消</el-button>
      </div>
      <div class="main" id="contentinfo">
        <div class="main-box">
          <div class="box-title">{{ listTitle }}</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>所属机构</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="options.departmentId" disabled></el-input>
                </td>
                <td class="box-cell-title">
                  <span>所属重点部位</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <!-- <el-select
                    v-model="orgLevel"
                    placeholder="请选择"
                    style="width: 100%"
                    :disabled="isListStatus"
                  >
                    <el-option
                      v-for="item in orgLevelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>-->
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    value-key="name"
                    v-model="options.departmentChild"
                    :disabled="isListStatus"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('kp', val, callback)
                      }
                    "
                    placeholder="请选择重点部位"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('kp', val)
                      }
                    "
                  ></el-autocomplete>
                </td>
                <td class="box-cell-title">
                  <span>申请编号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-input
                    disabled
                    maxlength="50"
                    v-model="options.applyNumber"
                    :class="{ 'input-red': ruleResObj['serial'] }"
                    @blur="changeInput('serial')"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">申请部门</td>
                <td class="box-cell-input">
                  <el-input
                    v-model="options.applyMent"
                    :disabled="isListStatus"
                    maxlength="20"
                    :class="{ 'input-red': ruleResObj['name'] }"
                    @blur="changeInput('name')"
                  ></el-input>
                </td>
                <td class="box-cell-title">申请人</td>
                <td class="box-cell-input">
                  <el-input
                    v-model="options.applyPeople"
                    :disabled="isListStatus"
                    maxlength="10"
                    :class="{ 'input-red': ruleResObj['telephone'] }"
                    @blur="changeInput('telephone')"
                  ></el-input>
                </td>
                <td class="box-cell-title">联系电话</td>
                <td class="box-cell-input">
                  <el-input
                    v-model="options.phone"
                    :disabled="isListStatus"
                    maxlength="15"
                    :class="{ 'input-red': ruleResObj['mobile'] }"
                    @blur="changeInput('mobile')"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>申请事由</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input" colspan="5">
                  <el-input
                    v-model="options.applyMsg"
                    :disabled="isListStatus"
                    maxlength="200"
                    :class="{ 'input-red': ruleResObj['address'] }"
                    @blur="changeInput('address')"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" :rowspan="peopleIndex">
                  <span>人员信息</span>
                  <i
                    class="el-icon-plus"
                    v-if="listTitle === '携物申请单' || listTitle === '携物申请单编辑'"
                    @click="addPeople('people', options.peopleInfo)"
                  ></i>
                </td>
                <td class="box-cell-title">
                  <span>人员姓名</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>身份证号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>联系电话</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title" :colspan="isListStatus ? 2 : 1">
                  <span>人员照片</span>
                </td>
                <td class="box-cell-title" v-if="!isListStatus">
                  <span>操作</span>
                </td>
              </tr>
              <tr v-for="(item, index) in options.peopleInfo" :key="index">
                <td class="box-cell-input">
                  <el-input v-model="item.name" :disabled="isListStatus" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.number" :disabled="isListStatus" maxlength="20"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.phone" :disabled="isListStatus" maxlength="15"></el-input>
                </td>
                <td class="box-cell-input" align="center" :colspan="isListStatus ? 2 : 1">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </td>
                <td class="box-cell-input" align="center" style="border-left:1px solid #eee;" v-if="!isListStatus">
                  <el-button style="font-size:12px;" type="text" @click="deleteRow('people', index, options.peopleInfo)"
                    >删除</el-button
                  >
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">携物信息</td>
                <td class="box-cell-title">
                  <span>是否危险品</span>
                </td>
                <td class="box-cell-input" style="border-top:1px solid #eee;font-size:12px;" align="center">
                  <el-radio v-model="options.articlesDenger" label="1" :disabled="isListStatus">
                    <span>否</span>
                  </el-radio>
                  <el-radio v-model="options.articlesDenger" label="2" :disabled="isListStatus">是</el-radio>
                </td>
                <td class="box-cell-title">
                  <span>附件</span>
                </td>
                <td class="box-cell-input" align="center" colspan="2" style="border-top:1px solid #eee;">
                  <el-upload
                    class="upload-demo"
                    v-show="!isListStatus"
                    v-model="options.articlesFile"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                  >
                    <el-button size="samll" style="font-size:12px;" type="text">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" :rowspan="carIndex">
                  <span>车辆信息</span>
                  <i
                    class="el-icon-plus"
                    v-if="listTitle === '携物申请单' || listTitle === '携物申请单编辑'"
                    @click="addPeople('car', options.carInfo)"
                  ></i>
                </td>
                <td class="box-cell-title">
                  <span>车牌号</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title">
                  <span>通行证号</span>
                </td>
                <td class="box-cell-title">
                  <span>驾驶员</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title" :colspan="isListStatus ? 2 : 1">
                  <span>联系方式</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-title" v-if="!isListStatus">
                  <span>操作</span>
                </td>
              </tr>
              <tr v-for="(item, index) in options.carInfo" :key="index">
                <td class="box-cell-input">
                  <el-input v-model="item.carId" :disabled="isListStatus" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carNumber" :disabled="isListStatus" maxlength="20"></el-input>
                </td>
                <td class="box-cell-input">
                  <el-input v-model="item.carDriver" :disabled="isListStatus" maxlength="10"></el-input>
                </td>
                <td class="box-cell-input" align="center" :colspan="isListStatus ? 2 : 1">
                  <el-input v-model="item.carPhone" :disabled="isListStatus" maxlength="15"></el-input>
                </td>
                <td class="box-cell-input" align="center" style="border-left:1px solid #eee;" v-if="!isListStatus">
                  <el-button type="text" style="font-size:12px;" @click="deleteRow('car', index, options.carInfo)"
                    >删除</el-button
                  >
                </td>
              </tr>
            </table>
          </div>
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">录入时间</td>
                <td class="box-cell-input">
                  <el-input v-model="options.enterTime" disabled></el-input>
                </td>
                <td class="box-cell-title">录入机构</td>
                <td class="box-cell-input">
                  <el-input v-model="options.enterMent" disabled></el-input>
                </td>
                <td class="box-cell-title">录入人</td>
                <td class="box-cell-input">
                  <el-input v-model="options.enterPeople" disabled></el-input>
                </td>
              </tr>
            </table>
          </div>
          <div
            class="main-box-center"
            style="margin-top:20px;"
            v-if="listTitle === '携物报备申请单审批' || listTitle === '携物申请审批记录单'"
          >
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">审批意见</td>
                <td class="box-cell-input" colspan="7">
                  <el-input
                    v-model="options.approvalText"
                    :disabled="listTitle === '携物申请审批记录单'"
                    maxlength="200"
                  ></el-input>
                </td>
              </tr>
            </table>
          </div>
          <div
            class="main-box-bottom"
            style="margin-top:20px;"
            align="center"
            v-if="listTitle === '携物报备申请单审批'"
          >
            <el-button size="small" type="primary" @click="approvalSubmit('同意')">同意</el-button>
            <el-button size="small" @click="dialogVisible = true">取消</el-button>
            <el-button size="small" @click="clickReject">驳回</el-button>
          </div>
          <div
            class="main-box-center"
            style="margin-top:20px;"
            v-if="listTitle != '携物申请单编辑' && listTitle != '携物申请单'"
          >
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">审批人修订记录</td>
                <td class="box-cell-input" colspan="7">
                  <el-input v-model="options.reviseInfo" disabled maxlength="200"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title" rowspan="2">审批记录</td>
                <td class="box-cell-title">所属机构</td>
                <td class="box-cell-title">所属部门</td>
                <td class="box-cell-title">姓名</td>
                <td class="box-cell-title">审批时间</td>
                <td class="box-cell-title">审批</td>
                <td class="box-cell-title">审批意见</td>
              </tr>
              <tr v-for="(item, index) in options.reviseList" :key="index">
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="item.reviseMent" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="options.reviseChild" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="10">
                  <el-input v-model="options.reviseName" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center">
                  <el-input v-model="options.reviseTime" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" maxlength="20">
                  <el-input v-model="options.reviseStatus" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
                <td class="box-cell-input" align="center" show-overflow-tooltip maxlength="200">
                  <el-input v-model="options.reviseMsg" :disabled="isListStatus" maxlength="200"></el-input>
                </td>
              </tr>
            </table>
          </div>
          <div
            style="margin-top:20px;width:30%;"
            v-if="listTitle === '携物报备申请单审批' || listTitle === '携物申请审批记录单'"
          >
            <p style="margin-bottom:20px;">审批过程：</p>
            <el-steps :active="1" finish-status="success">
              <el-step title="yyy1"></el-step>
              <el-step title="yyy2"></el-step>
              <el-step title="yyy3"></el-step>
            </el-steps>
          </div>
        </div>
      </div>
      <div class="content-bottom" v-if="listTitle !== '携物报备申请单审批' && listTitle !== '携物申请审批记录单'">
        <el-button size="small" @click="reset" v-show="listTitle !== '携物申请单详情'">重置</el-button>
        <el-button size="small" v-print="'#contentinfo'">打印</el-button>
        <el-button size="small" v-show="listTitle === '携物申请单详情'" @click="handleWithdraw">撤回</el-button>
        <el-button size="small" v-show="listTitle === '携物申请单详情'" @click="isflow = true">查看流程</el-button>
        <el-button size="small" @click="dialogVisible = true">关闭</el-button>
        <el-button size="small" type="primary" @click="clickSubmit('保存')" v-show="listTitle !== '携物申请单详情'"
          >保存</el-button
        >
        <el-button size="small" type="primary" @click="clickSubmit('提交')" v-show="listTitle !== '携物申请单详情'"
          >提交</el-button
        >
      </div>
    </div>
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
    <div v-if="dialogVisible">
      <el-dialog title="关闭确认" :visible.sync="dialogVisible" width="30%">
        <span>请确认是否关闭？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogSave">确 定</el-button>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { read } from '@src/storage/index.js'
// import { orgCreatApi, orgEditApi } from '@src/http/basicInfoManage/orgManage.api'
// import { dataRule } from '../../../../../../../../common/validateRule'
import {
  // getOrganizationalApi, // 机构树-懒加载-纯机构
  getSearchOrgApi // 机构、重点部位模糊查询
} from '@src/http/video/recordConfig.api.js'
export default {
  name: 'AddApply',
  props: {
    componentTitle: {
      type: Object,
      default: () => []
    },
    listType: {
      type: String,
      default: ''
    },
    listTitle: {
      type: String,
      default: ''
    },
    editData: {
      type: Object,
      default: () => {}
    }
    // nodeData: {
    //   // 所属机构信息
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      topTitle: '',
      formTitle: '',
      isDisabled: true,
      isListStatus: false,
      dialogVisible: false, // 取消弹窗
      isflow: false, // 查看流程
      status: 1,
      radio: '1', // 默认否
      peopleIndex: 2,
      carIndex: 2,
      options: {
        // 表单数据
        departmentId: 'departmentId',
        departmentChild: 'departmentChild',
        applyNumber: 'applyNumber',
        applyMent: 'applyMent',
        applyPeople: 'applyPeople',
        phone: 'phone',
        applyMsg: 'applyMsg',
        peopleInfo: [
          {
            name: 'name',
            number: 'number',
            phone: 'phone',
            imgUrl: 'imgUrl'
          }
        ],
        articlesDenger: '1', // 1 否  2 是
        articlesFile: 'articlesFile',
        carInfo: [
          {
            carId: 'carId',
            carNumber: 'carNumber',
            carDriver: 'carDriver',
            carPhone: 'carPhone'
          }
        ],
        enterTime: 'enterTime',
        enterMent: 'enterMent',
        enterPeople: 'enterPeople',
        approvalText: 'approvalText',
        reviseInfo: 'reviseInfo',
        reviseList: [
          {
            reviseMent: 'reviseMent',
            reviseChild: 'reviseChild',
            reviseName: 'reviseName',
            reviseTime: 'reviseTime',
            reviseStatus: 'reviseStatus',
            reviseMsg: 'reviseMsg'
          }
        ]
      },
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
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      statusList: [
        { label: '正常营业', value: 1 },
        { label: '撤销', value: 2 },
        { label: '合并', value: 3 },
        { label: '临时停业', value: 4 }
      ],
      orgLevel: 5,
      orgLevelList: [
        { label: '总行', value: 1 },
        { label: '一级分行', value: 2 },
        { label: '二级分行', value: 3 },
        { label: '直管行', value: 4 },
        { label: '县级行', value: 5 },
        { label: '园区', value: 6 }
      ],
      ruleResObj: {
        // 校验结果
        serial: false,
        name: false,
        telephone: false,
        mobile: false,
        email: false,
        address: false,
        functionary: false
      }
    }
  },
  watch: {
    // 'nodeData.id': {
    //   handler() {
    //     if (this.listTitle === '新建') {
    //       this.parentId = this.nodeData.id
    //       this.parentName = this.nodeData.name
    //       this.parentSerial = this.nodeData.serial
    //     }
    //   },
    //   deep: true
    // }
  },
  created() {
    this.topTitle = this.componentTitle
    this.formTitle = this.listTitle
    this.isListStatus =
      this.listTitle === '携物申请单详情' ||
      this.listTitle === '携物报备申请单审批' ||
      this.listTitle === '携物申请审批记录单'
    // console.log(this.editData, 'editData')
    // this.reset()
    this.ruleWarning = this.$lodash.debounce(this._ruleWarning, 500)
  },
  methods: {
    // 添加行
    addPeople(rowIndex, list) {
      console.log(rowIndex, list)
      if (rowIndex === 'people') {
        list.push({
          name: 'name',
          number: 'number',
          phone: 'phone',
          imgUrl: 'imgUrl'
        })
      } else {
        list.push({
          carId: 'carId',
          carNumber: 'carNumber',
          carDriver: 'carDriver',
          carPhone: 'carPhone'
        })
      }

      rowIndex === 'people' ? ++this.peopleIndex : ++this.carIndex
    },
    // 删除行
    deleteRow(rowIndex, index, rows) {
      console.log(index, rows)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          rows.splice(index, 1)
          rowIndex === 'people' ? --this.peopleIndex : --this.carIndex
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      res.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传文件类型判断
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.options.oId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        // this.options.oId = val.serial
        this.options.oId = val.id
      } else if (type === 'kp') {
        this.options.keyPart = val.id
      }
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keySite', displayName: '所属重点部位' },
          { field: 'Device', displayName: '申请编号' },
          { field: 'code', displayName: '申请部门' },
          { field: 'address', displayName: '申请人' },
          { field: 'state', displayName: '联系电话' },
          { field: 'brand', displayName: '申请事由' },
          { field: 'equipmentModel', displayName: '人员姓名' },
          { field: 'equipmentData', displayName: '录入人' },
          { field: 'yyy', displayName: '审批状态' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 列表撤回
    handleWithdraw(index, row) {
      this.$confirm('是否撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // row.splice(index, 1)
          this.$message({
            type: 'success',
            message: '撤回成功!',
            duration: 1500,
            onClose: () => {
              this.dialogSave()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回',
            duration: 1500
          })
        })
    },
    // changeInput(type) {
    //   // input值校验
    //   let res = dataRule(this[type], type, this.ruleWarning)
    //   if (!res) {
    //     this.ruleResObj[type] = true
    //   } else {
    //     this.ruleResObj[type] = false
    //   }
    // },
    // 校验失败提示信息
    _ruleWarning(val) {
      this.$messageWarn(val)
    },
    // 提交或保存
    clickSubmit(title) {
      this.$message({
        message: `${title}成功！`,
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.dialogSave()
        }
      })
      // let param = {
      //   name: this.name,
      //   telephone: this.telephone,
      //   mobile: this.mobile,
      //   address: this.address,
      //   status: this.status,
      //   businessHours: this.businessHours,
      //   email: this.email,
      //   startBusiness: this.startBusiness,
      //   closeBusiness: this.closeBusiness,
      //   functionary: this.functionary,
      //   serial: this.serial,
      //   kind: this.orgLevel,
      //   parentId: this.parentSerial
      // }
      // let keyNameObj = {
      //   serial: '机构编号',
      //   name: '机构中文简称',
      //   telephone: '固定电话',
      //   mobile: '移动电话',
      //   email: '电子邮件',
      //   address: '机构地址',
      //   functionary: '机构负责人名称'
      // }
      // if (this.listTitle === '编辑') {
      //   let eParam = {
      //     id: this.editData.id,
      //     org: param
      //   }
      //   for (let key in this.ruleResObj) {
      //     if (this.ruleResObj[key]) {
      //       this.ruleWarning(`${keyNameObj[key]}格式错误，请重新输入！`)
      //       return
      //     }
      //   }
      //   orgEditApi(eParam)
      //     .then(res => {
      //       if (res.data.code === 0) {
      //         this.$emit('orgTreeRefresh')
      //         this.$messageSuccess(`${this.componentTitle}成功！`, '成功')
      //         this.dialogSave()
      //       } else {
      //         console.log(res)
      //         this.$messageError(`${this.componentTitle}失败，原因：${res.data.message}`, '错误')
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err)
      //       this.$messageError(`${this.componentTitle}失败，请稍后重试！`, '错误')
      //     })
      // } else {
      //   if (!this.serial) {
      //     this.ruleWarning('机构编号不能为空！')
      //     return
      //   }
      //   if (!/^\d+$/.test(this.serial)) {
      //     this.ruleWarning('机构编号只能输入数字，请重新输入！')
      //     return
      //   }
      //   if (!this.name) {
      //     this.ruleWarning('机构中文简称不能为空！')
      //     return
      //   }
      //   for (let key in this.ruleResObj) {
      //     if (this.ruleResObj[key]) {
      //       this.ruleWarning(`${keyNameObj[key]}错误，请重新输入！`)
      //       return
      //     }
      //   }
      //   orgCreatApi(param)
      //     .then(res => {
      //       if (res.data.code === 0) {
      //         this.$emit('orgTreeRefresh')
      //         this.$messageSuccess(`${this.listTitle}成功！`, '成功')
      //         this.dialogSave()
      //       } else {
      //         console.log(res)
      //         this.$messageError(`${this.listTitle}失败，原因：${res.data.message}`, '错误')
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err)
      //       this.$messageError(`${this.listTitle}失败，请稍后重试！`, '错误')
      //     })
      // }
    },
    // 重置按钮
    reset() {
      if (this.listTitle === '编辑') {
        this.isDisabled = true
        this.getTableItem(this.editData)
      } else {
        this.isDisabled = false
        this.getTableItem()
      }
    },
    // 关闭当前页面按钮
    dialogSave() {
      this.dialogVisible = false
      this.$emit('defaultComponent')
    },
    // 审批驳回
    clickReject() {
      this.$confirm('是否驳回申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // row.splice(index, 1)
          this.$message({
            type: 'success',
            message: '驳回成功!',
            duration: 1500,
            onClose: () => {
              this.dialogSave()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回',
            duration: 1500
          })
        })
    },
    // 审批提交
    approvalSubmit() {
      this.$message({
        message: '审批成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.dialogSave()
        }
      })
    },
    // 获取table项
    getTableItem(cpEditData) {
      // this.options.departmentId = cpEditData ? cpEditData.departmentId : ''
      this.options.departmentChild = cpEditData ? cpEditData.departmentChild : ''
      // this.applyNumber = cpEditData ? cpEditData.applyNumber : ''
      this.options.applyMent = cpEditData ? cpEditData.applyMent : ''
      this.options.applyPeople = cpEditData ? cpEditData.applyPeople : ''
      this.options.phone = cpEditData ? cpEditData.phone : ''
      this.options.applyMsg = cpEditData ? cpEditData.applyMsg : ''
      this.options.peopleInfo = cpEditData
        ? cpEditData.peopleInfo
        : [
            {
              name: '',
              number: '',
              phone: '',
              imgUrl: ''
            }
          ]
      this.options.articlesDenger = cpEditData ? cpEditData.articlesDenger : ''
      this.options.articlesFile = cpEditData ? cpEditData.articlesFile : ''
      this.options.carInfo = cpEditData
        ? cpEditData.carInfo
        : [
            {
              carId: '',
              carNumber: '',
              carDriver: '',
              carPhone: ''
            }
          ]
      if (this.listTitle === '新建') {
        // this.parentId = this.nodeData.id
        // this.parentName = this.nodeData.name
        // this.parentSerial = this.nodeData.serial
        // let userInfo = JSON.parse(read('user')) || ''
        // this.updatedAt = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // this.updatedDept = userInfo.name
        // this.updatedBy = userInfo.orgName
      }
    }
  }
}
</script>

<style lang="less" scoped>
.org-manage-create-modify-box {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .header {
    margin-bottom: 10px;
  }
  .content {
    padding: 0 10px;
    width: 1000px;
    .el-button {
      width: 80px;
    }
    .main {
      margin: 10px 0;
      width: 100%;
      .main-box {
        padding: 20px;
        .box-title {
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
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
                height: 36px;
                width: 15%;
                background: #eee;
                text-align: center;
                border: 0.5px solid #ddd;
              }
              .box-cell-input {
                // width: 35%;
                height: 36px;
                .el-radio__label {
                  font-size: 12px;
                }
                .avatar-uploader {
                  .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    &:hover {
                      border-color: #409eff;
                    }
                  }
                  .avatar-uploader-icon {
                    font-size: 18px;
                    color: #8c939d;
                    width: 58px;
                    height: 58px;
                    line-height: 58px;
                    // text-align: center;
                  }
                  .avatar {
                    width: 58px;
                    height: 58px;
                    display: block;
                  }
                }
                /deep/ .el-input__inner {
                  height: 36px !important;
                  text-align: center;
                  font-size: 12px;
                }
                .input-red {
                  /deep/ .el-input__inner {
                    border-color: red;
                  }
                }
              }
            }
          }
        }
        .main-box-footer {
          padding: 1px;
          margin-top: 10px;
          border: 1px solid #ddd;
          table {
            width: 100%;
            height: 100%;
            tr {
              .box-cell-title {
                height: 36px;
                width: 10%;
                background: #eee;
                text-align: center;
                border: 0.5px solid #ddd;
              }
              .box-cell-input {
                width: 23.3%;
                height: 36px;
                text-align: center;
                /deep/ .el-input__inner {
                  height: 36px !important;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
    .content-bottom {
      text-align: center;
    }
  }
}
</style>
