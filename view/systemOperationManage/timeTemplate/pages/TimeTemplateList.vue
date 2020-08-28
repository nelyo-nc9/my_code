<!--
 * @Author: your name
 * @Date: 2020-06-17 15:49:39
 * @LastEditTime: 2020-06-17 16:26:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\timeTemplate\pages\TimeTemplateList.vue
-->
<template>
  <div class="time-template-list-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 操作按钮 -->
        <div class="button-box">
          <el-button size="small" icon="el-icon-tickets" @click="planTemplate">计划模板</el-button>
          <el-button size="small" icon="el-icon-plus" @click="creatHolidayList">新建</el-button>
          <el-button size="small" icon="el-icon-edit-outline" :disabled="this.selectData.length === 0" @click="edit">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" @click="deleteHolidayList" :disabled="this.selectData.length === 0">删除</el-button>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table  stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange" ref="Table" height="100%" max-height="695" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="操作" width="" align="center">
              <template slot-scope="scope">
                <el-button @click="editHolidayPlan(scope.row)" type="text" style="font-size:18px;" icon="el-icon-edit-outline"></el-button>
                <el-button @click="deleteHolidayPlan(scope.row)" type="text" style="font-size:18px;" icon="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="formTitle" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form" ref="holidayForm" :label-width="formLabelWidth" label-position="left">
        <el-form-item label="节假日名称">
          <el-input v-model="form.holidayName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            size="small"
            v-model="form.holidayDate"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="form.isEnable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <span style="margin-left:10px;">({{form.isEnable ? '启用' : '未启用'}})</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="submitHolidayPlan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTimeTemplateHolidayApi,
  addTimeTemplateHolidayApi,
  modifyHolidayTemplateApi,
  deleteHolidayInfoApi
} from '@src/http/systemOperationManage/timeTemplate.api.js'
export default {
  props: {
  },
  name: 'TimeTemplateList',
  data() {
    return {
      formTitle: '',
      formLabelWidth: '85px',
      dialogFormVisible: false,
      submitDisabled: false,
      form: {
        isEnable: false,
        holidayName: '',
        holidayDate: []
      },
      columns: [
        { prop: 'holidayName', sortable: true, label: '节假日名称', width: '' },
        { prop: 'dataRange', sortable: true, label: '日期范围', width: '' },
        { prop: 'isStart', sortable: true, label: '状态', width: '' }
      ],
      resizable: true,
      tableData: [
      ],
      total: 0,
      selectData: [],
      pageSize: 10,
      page: 1
    }
  },
  computed: {
  },
  created() {
    this.getTimeTemplateHolidayApiFuc()
  },
  methods: {
    // 获取节假日模板列表
    getTimeTemplateHolidayApiFuc() {
      let param = {
        page: this.page,
        limit: this.pageSize
      }
      getTimeTemplateHolidayApi(param).then(res => {
        if (res.data.code === 0) {
          this.total = res.data.data.pageData.totalNumber
          this.tableData = res.data.data.holidayList && this.handelData(res.data.data.holidayList)
        } else {
          this.$messageError('获取节假日计划失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理返回数据
    handelData(list) {
      let arr = JSON.parse(JSON.stringify(list))
      arr.forEach((item, index) => {
        if (item.isStart === 1) {
          item.isStart = '启用'
        } else if (item.isStart === 2) {
          item.isStart = '停用'
        }
        arr[index].startDate = this.$moment(Number(arr[index].startDate)).format('YYYY-MM-DD')
        arr[index].endDate = this.$moment(Number(arr[index].endDate)).format('YYYY-MM-DD')
        arr[index].dataRange = arr[index].startDate + '-' + arr[index].endDate
      })
      return arr
    },
    editHolidayPlan(row) {
      this.dialogFormVisible = true
      this.submitDisabled = false
      this.formTitle = '节假日编辑'
      this.form = {
        id: row.id,
        isEnable: row.isStart === '启用',
        holidayName: row.holidayName,
        holidayDate: [new Date(row.startDate).getTime(), new Date(row.endDate).getTime()]
      }
    },
    // 单个删除
    deleteHolidayPlan(row) {
      let param = {
        'ids': [row.id]
      }
      this.$confirm('确认删除节假日模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTimeTemplateHolidayeApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 列表删除按钮（可批量删除）
    deleteHolidayList() {
      let param = {
        'ids': []
      }
      this.selectData.forEach(item => {
        param.ids.push(item.id)
      })
      this.$confirm('确认删除节假日模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTimeTemplateHolidayeApiFuc(param)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delTimeTemplateHolidayeApiFuc(param) {
      deleteHolidayInfoApi(param).then(res => {
        if (res.data.code === 0) {
          this.page = 1
          this.getTimeTemplateHolidayApiFuc()
          this.$messageSuccess(res.data.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 新建/编辑确定按钮
    submitHolidayPlan() {
      if (this.form.holidayName === '' || typeof this.form.holidayDate === 'string') {
        this.$messageWarn('模板名称和时间段不能为空', '警告')
        return
      }
      this.submitDisabled = true
      if (this.formTitle === '节假日新建') { // 新建
        let param = {
          holidayName: this.form.holidayName,
          startDate: this.form.holidayDate[0],
          endDate: this.form.holidayDate[1],
          isStart: this.form.isEnable ? 1 : 2
        }
        this.dialogFormVisible = false
        addTimeTemplateHolidayApi(param).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.getTimeTemplateHolidayApiFuc()
          } else {
            this.$messageError('新建失败')
          }
        })
          .catch(err => {
            this.$messageError('新建失败')
            console.log(err)
          })
      } else {
        let param = {
          holidayName: this.form.holidayName,
          startDate: this.form.holidayDate[0],
          endDate: this.form.holidayDate[1],
          isStart: this.form.isEnable ? 1 : 2,
          id: this.form.id
        }
        this.dialogFormVisible = false
        modifyHolidayTemplateApi(param).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$messageSuccess('编辑成功')
            this.getTimeTemplateHolidayApiFuc()
          } else {
            this.$messageError('编辑失败')
          }
        })
          .catch(err => {
            this.$messageError('编辑失败')
            console.log(err)
          })
      }
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(this.selectData, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      this.getTimeTemplateHolidayApiFuc()
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.getTimeTemplateHolidayApiFuc()
    },
    // 新建
    creatHolidayList() {
      this.dialogFormVisible = true
      this.submitDisabled = false
      this.formTitle = '节假日新建'
      this.initForm()
    },
    // 编辑
    edit() {
      if (this.selectData.length > 1) {
        return this.$messageError('请选择一个模版进行编辑')
      }
      this.submitDisabled = false
      this.dialogFormVisible = true
      this.formTitle = '节假日编辑'
      this.form = {
        id: this.selectData[0].id,
        isEnable: this.selectData[0].isStart === '启用',
        holidayName: this.selectData[0].holidayName,
        holidayDate: [new Date(this.selectData[0].startDate).getTime(), new Date(this.selectData[0].endDate).getTime()]
      }
    },
    initForm() {
      this.form = {
        isEnable: false,
        holidayName: '',
        holidayDate: ''
      }
    },
    // 计划模板
    planTemplate() {
      this.$emit('showList', false)
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
.time-template-list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      height: 50px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main {
      width: 100%;
      height: calc(~'100% - 110px');
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
 /deep/.el-dialog__body {
    padding: 30px 15px;
  }
 /deep/.el-dialog__header {
    padding: 10px 20px 10px;
    background:rgba(242, 242, 242, 1) ;
  }
 /deep/.el-dialog__headerbtn {
    top: 14px;
  }
 /deep/.el-range-editor--small.el-input__inner {
    width: 364px;
  }
}
</style>
