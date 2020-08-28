<template>
  <div class="org-manage-search-box">
    <!-- 机构管理-查询界面 -->
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>机构管理</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
        <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">机构管理查询</div>
            <!-- <div class="main-box-center">
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td class="box-cell-title">机构编号</td>
                  <td class="box-cell-input"><el-input v-model="serial"></el-input></td>
                  <td class="box-cell-title">机构中文简称</td>
                  <td class="box-cell-input"><el-input v-model="name"></el-input></td>
                </tr>
                <tr>
                  <td class="box-cell-title">机构类别</td>
                  <td class="box-cell-input">
                    <el-select v-model="orgLevel" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in orgLevelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="box-cell-title">固定电话</td>
                  <td class="box-cell-input"><el-input v-model="telephone"></el-input></td>
                </tr>
                <tr>
                  <td class="box-cell-title">机构地址</td>
                  <td class="box-cell-input" colspan="3"><el-input v-model="address"></el-input></td>
                </tr>
                <tr>
                  <td class="box-cell-title">机构状态</td>
                  <td class="box-cell-input">
                    <el-select v-model="status" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in orgStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="box-cell-title">开始营业时间</td>
                  <td class="box-cell-input">
                    <el-date-picker
                      v-model="businessHours"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </td>
                </tr>
                <tr>
                  <td class="box-cell-title">开业日期</td>
                  <td class="box-cell-input">
                    <el-date-picker
                      v-model="startBusiness"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </td>
                  <td class="box-cell-title">关闭日期</td>
                  <td class="box-cell-input">
                    <el-date-picker
                      v-model="closeBusiness"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </td>
                </tr>
                <tr>
                  <td class="box-cell-title">机构负责人名称</td>
                  <td class="box-cell-input"><el-input v-model="functionary"></el-input></td>
                  <td class="box-cell-title">上级机构名称</td>
                  <td class="box-cell-input"><el-input v-model="parentName"></el-input></td>
                </tr>
                <tr>
                  <td class="box-cell-title">上级机构编码</td>
                  <td class="box-cell-input"><el-input v-model="parentSerial"></el-input></td>
                  <td class="box-cell-title">录入人</td>
                  <td class="box-cell-input"><el-input v-model="updatedBy"></el-input></td>
                </tr>
                <tr>
                  <td class="box-cell-title">录入机构</td>
                  <td class="box-cell-input"><el-input v-model="updatedDept"></el-input></td>
                  <td class="box-cell-title">录入时间</td>
                  <td class="box-cell-input">
                    <el-date-picker
                      v-model="orgCreateTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </el-input></td>
                </tr>
              </table>
            </div> -->
            <div class="form-content up-style" style="display: flex;width: 952px;padding: 14px 10px 10px 10px;font-size: 12px;background: #f5f5f5;">
              <div class="left-form" style="width: 442px;margin-right: 24px;">
                <el-form :rules="rules" ref="addForm1" size="mini" :model="formData" label-position="right" label-width="124px">
                  <el-form-item label="机构编号" prop="serial">
                    <el-input v-model="formData.serial"></el-input>
                  </el-form-item>
                  <el-form-item label="机构类别" prop="orgLevel">
                    <el-select v-model="formData.orgLevel" placeholder="请选择" style="width: 318px;">
                      <el-option
                        v-for="item in orgLevelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="移动电话" prop="mobile">
                    <el-input v-model="formData.mobile"></el-input>
                  </el-form-item> -->
                  <el-form-item label="机构地址" prop="address">
                    <el-input v-model="formData.address"></el-input>
                  </el-form-item>
                  <el-form-item label="机构状态" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in orgStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开业日期">
                    <el-date-picker
                      v-model="formData.startBusiness"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="机构负责人名称" prop="functionary">
                    <el-input v-model="formData.functionary"></el-input>
                  </el-form-item>
                  <el-form-item  label="上级机构编码" prop="parentSerial">
                    <el-input v-model="formData.parentSerial"></el-input>
                  </el-form-item>
                  <el-form-item label="录入机构" prop="updatedDept">
                    <el-input v-model="formData.updatedDept"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right-form" style="width: 442px;">
                <el-form :rules="rules" ref="addForm2" size="mini" :model="formData" label-position="right" label-width="110px">
                  <el-form-item label="机构中文简称" prop="name">
                    <el-input v-model="formData.name"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="固定电话" prop="telephone">
                    <el-input v-model="formData.telephone"></el-input>
                  </el-form-item> -->
                  <el-form-item label="电子邮件" prop="email">
                    <el-input v-model="formData.email" type='email'></el-input>
                  </el-form-item>
                  <el-form-item label="开始营业时间" prop="businessHours">
                     <el-date-picker
                        v-model="formData.businessHours"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change='changeDate'
                        :picker-options="startDatePicker"
                        style="width: 100%">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="关闭日期">
                    <el-date-picker
                      v-model="formData.closeBusiness"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="上级机构名称" prop="parentName">
                    <el-input v-model="formData.parentName"></el-input>
                  </el-form-item>
                  <el-form-item label="录入人" prop="updatedBy">
                    <el-input v-model="formData.updatedBy"></el-input>
                  </el-form-item>
                  <el-form-item label="录入时间">
                    <el-date-picker
                      v-model="formData.orgCreateTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" @click="clickSearch">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="clickExport">导出</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table
            stripe
            border
            size="medium"
            :data="tableData"
            @select="select"
            @row-dblclick="rowDbClick"
            height="100%"
            max-height="805"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
            <el-table-column
              v-for="(column, index) in columns" :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable">
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :page-sizes="[25, 50, 100, 200]"
            :page-size.sync="limit"
            :current-page.sync="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryListApi } from '@src/http/basicInfoManage/orgManage.api'
import { download } from '@src/common/download.js'

export default {
  name: 'OrgManageSearch',
  data() {
    return {
      resizable: true, // 对应列是否可以通过拖动改变宽度
      columns: [
        { prop: 'name', sortable: true, label: '机构名称', width: '150' },
        { prop: 'serial', sortable: true, label: '机构编号', width: '100' },
        { prop: 'kindName', sortable: true, label: '机构类别', width: '100' },
        { prop: 'telephone', sortable: true, label: '固定电话', width: '120' },
        { prop: 'functionary', sortable: true, label: '机构负责人', width: '120' },
        { prop: 'mobile', sortable: true, label: '移动电话', width: '100' },
        { prop: 'email', sortable: true, label: '电子邮件', width: '100' },
        { prop: 'address', sortable: true, label: '机构地址', width: '150' },
        { prop: 'status', sortable: true, label: '机构状态', width: '100' },
        { prop: 'businessHours', sortable: true, label: '开始营业时间', width: '150' },
        { prop: 'startBusiness', sortable: true, label: '开业日期', width: '150' },
        { prop: 'closeBusiness', sortable: true, label: '关闭日期', width: '150' },
        { prop: 'pid.name', sortable: true, label: '上级机构名称', width: '120' },
        { prop: 'pid.serial', sortable: true, label: '上级机构编号', width: '120' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      tableData: [],
      total: 0,
      status: 0,
      orgStatusList: [
        {label: '全部', value: 0},
        {label: '正常营业', value: 1},
        {label: '撤销', value: 2},
        {label: '合并', value: 3},
        {label: '临时停业', value: 4}
      ],
      orgLevel: 0,
      orgLevelList: [
        {label: '全部', value: 0},
        {label: '总行', value: 1},
        {label: '一级分行', value: 2},
        {label: '二级分行', value: 3},
        {label: '直管行', value: 4},
        {label: '县级行', value: 5},
        {label: '园区', value: 6}
      ],
      formData: {
        serial: '',
        name: '',
        // telephone: '',
        // mobile: '',
        email: '',
        address: '',
        businessHours: '',
        startBusiness: '',
        closeBusiness: '',
        functionary: '',
        parentName: '',
        parentSerial: '',
        updatedDept: '',
        updatedBy: '',
        orgLevel: 0,
        status: 0
      },
      rules: {
        serial: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        // mobile: [
        //   { type: 'string', min: 0, max: 32, message: '0-32个字符' }
        // ],
        address: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        functionary: [
         {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        name: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        email: [
          { type: 'email', message: '邮箱格式有误' }
        ],
        parentName: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        parentSerial: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        // telephone: [
        //   { type: 'string', min: 0, max: 32, message: '0-32个字符' }
        // ],
        updatedDept: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ],
        updatedBy: [
          {type: 'string', min: 1, max: 64, message: '0-64个字符' }
        ]
      },
      page: 1,
      limit: 100,
      serial: '',
      name: '',
      telephone: '',
      address: '',
      businessHours: '',
      startBusiness: '',
      closeBusiness: '',
      functionary: '',
      parentName: '',
      parentSerial: '',
      updatedBy: '',
      updatedDept: '',
      orgCreateTime: '',
      startDatePicker:{
          disabledDate(time) {
              return time.getTime() < Date.now()- 8.64e7
          }
      },
    }
  },
  created() {
  },
  methods: {
    //开始营业时间改变触发
    changeDate(val){
      console.log(val)
    },
    reset() {
      this.formData.serial = ''
      this.formData.name = ''
      this.formData.orgLevel = 0
      // this.formData.telephone = ''
      // this.formData.mobile = ''
      this.formData.email = ''
      this.formData.address = ''
      this.formData.status = 0
      this.formData.businessHours = []
      this.formData.startBusiness = []
      this.formData.closeBusiness = []
      this.formData.functionary = ''
      this.formData.parentName = ''
      this.formData.parentSerial = ''
      this.formData.page = 1
      this.formData.tableData = []
      this.formData.updatedBy = ''
      this.formData.updatedDept = ''
      this.formData.orgCreateTime = []
    },
    sizeChange() { // 每页条数改变
      this.getTableList()
    },
    currentChange() { // 当前页改变
      this.getTableList()
    },
    clickSearch() {
      this.page = 1
      this.getTableList('查询')
    },
    getTableList(val) { // 请求表格数据方法
      this.$refs['addForm1'].validate((valid1) => {
        this.$refs['addForm2'].validate((valid2) => {
          if (valid1 && valid2) {
            let param = {
              page: this.page,
              limit: this.limit,
              ccbInsId: this.formData.serial,
              name: this.formData.name,
              // mobile: this.formData.mobile,
              email: this.formData.email,
              kind: this.formData.orgLevel, // 机构类别
              // telephone: this.formData.telephone,
              address: this.formData.address,
              status: this.formData.status,
              beginBusinessHours: this.formData.businessHours ? this.formData.businessHours[0] : '',
              overBusinessHours: this.formData.businessHours ? this.formData.businessHours[1] : '',
              beginStartBusiness: this.formData.startBusiness ? this.formData.startBusiness[0] : '',
              overStartBusiness: this.formData.startBusiness ? this.formData.startBusiness[1] : '',
              beginCloseBusiness: this.formData.closeBusiness ? this.formData.closeBusiness[0] : '',
              overCloseBusiness: this.formData.closeBusiness ? this.formData.closeBusiness[1] : '',
              functionary: this.formData.functionary,
              parentName: this.formData.parentName,
              parentSerial: this.formData.parentSerial,
              updatedBy: this.formData.updatedBy,
              updatedDept: this.formData.updatedDept,
              startCreatedAt: this.formData.orgCreateTime ? this.formData.orgCreateTime[0] : '',
              endCreatedAt: this.formData.orgCreateTime ? this.formData.orgCreateTime[1] : ''
            }
            for (let key in param) {
              if (!param[key]) {
                delete param[key]
              }
            }
            console.log(param, 'param666666666')
            getQueryListApi(param).then(res => {
              console.log(res, 'res')
              if (res.data.code === 0) {
                this.tableData = res.data.data.orgList
                this.total = res.data.data.count
                let statusArr = ['', '正常营业', '撤销', '合并', '临时停业']
                let kindArr = ['', '总行', '一级分行', '二级分行', '直管行', '县级行', '园区']
                this.tableData.forEach(item => {
                  item.status = statusArr[item.status]
                  item.kindName = kindArr[item.kind] || ''
                })
                val && this.$messageSuccess(`${val}成功！`, '成功')
              } else {
                console.log(res.message, 'err')
                val && this.$messageError(`${val}失败，请稍后重试！`, '错误')
              }
            }).catch(err => {
              console.log(err, 'err')
              val && this.$messageError(`${val}失败，请稍后重试！`, '错误')
            })
          }
        })
      })
    },
    // 刷新表格
    refresh() {
    },
    select() {
    },
    rowDbClick(row) {
    },
    progressFn(val) { // 导出文件传输进度
      console.log(val.loaded / val.total, '导出文件传输进度')
    },
    clickExport() {
      let paramObj = {
        ccbInsId: this.formData.serial,
        name: this.formData.name,
        kind: this.formData.orgLevel, // 机构类别
        telephone: this.formData.telephone,
        address: this.formData.address,
        status: this.formData.status,
        beginBusinessHours: this.formData.businessHours ? this.formData.businessHours[0] : '',
        overBusinessHours: this.formData.businessHours ? this.formData.businessHours[1] : '',
        beginStartBusiness: this.formData.startBusiness ? this.formData.startBusiness[0] : '',
        overStartBusiness: this.formData.startBusiness ? this.formData.startBusiness[1] : '',
        beginCloseBusiness: this.formData.closeBusiness ? this.formData.closeBusiness[0] : '',
        overCloseBusiness: this.formData.closeBusiness ? this.formData.closeBusiness[1] : '',
        functionary: this.formData.functionary,
        parentName: this.formData.parentName,
        parentSerial: this.formData.parentSerial,
        updatedBy: this.formData.updatedBy,
        updatedDept: this.formData.updatedDept,
        startCreatedAt: this.formData.orgCreateTime ? this.formData.orgCreateTime[0] : '',
        endCreatedAt: this.formData.orgCreateTime ? this.formData.orgCreateTime[1] : ''
      }
      for (let key in paramObj) {
        if (!paramObj[key]) {
          delete paramObj[key]
        }
      }
      let params = {
        type: 3,
        queryCondition: {
          ...paramObj
        }
      }
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/organizational/v1/org/export`
      let name = `机构导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
      download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) }, this.progressFn, 'post', params)
    }
  }
}
</script>

<style lang="less" scoped>
  .org-manage-search-box {
    width: 100%;
    height: 100%;
    display: flex;
    .content {
      width: 100%;
      height: 100%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .top {
        width: 1000px;
        flex-grow: 0;
        .header {
          margin-bottom: 10px;
        }
        .top-main {
          margin: 10px 0;
          width: 100%;
          .form-content {
            /deep/ .el-input--mini .el-input__inner {
              height: 35px;
            }
            /deep/ .el-form-item__label {
              height: 35px;
              line-height: 35px;
              border: 1px solid #fff;
              background: #f7f2f1;
            }
            /deep/ .el-form-item--mini.el-form-item {
              margin-bottom: 14px
            }
            /deep/ .el-range-editor--mini.el-input__inner {
              height: 35px;
            }
          }
          .main-box {
            padding: 0 20px;
            .box-title {
              height: 40px;
              text-align: center;
              line-height: 40px;
              font-size: 18px;
            }
            .main-box-center {
              border: 1px solid #ddd;
              padding: 10px 20px;
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
                    width: 35%;
                    height: 36px;
                    /deep/ .el-input__inner {
                      height: 36px!important;
                    }
                  }
                }
              }
            }
          }
        }
        .button-box {
          text-align: center;
          margin-bottom: 20px;
          .el-button {
            width: 80px;
          }
        }
      }
      .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 100px;
        .list-box-table {
          overflow: auto;
          flex: 1;
        }
        .main-footer{
          height: 40px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
      }
    }
  }
</style>
