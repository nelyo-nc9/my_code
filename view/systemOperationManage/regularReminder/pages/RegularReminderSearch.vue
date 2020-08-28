<!--
 * @Author: your name
 * @Date: 2020-07-05 14:23:12
 * @LastEditTime: 2020-07-05 17:44:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\regularReminder\pages\RegularReminderSearch.vue
-->
<template>
  <div class="regular-reminder-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form size="mini" label-position="right" label-width="110px" ref="serverForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-row>
                      <el-col :span=23>
                        <el-form-item label="所属机构">
                          <el-autocomplete class="inline-input" size="mini" v-model="form.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span=12>
                    <el-row>
                      <el-col :span=23>
                        <el-form-item label="提醒时间">
                          <el-date-picker
                            style="width:100%;"
                            v-model="form.remindEndHours"
                            type="daterange"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-row>
                      <el-col :span=23>
                        <el-form-item label="用户">
                          <el-input  v-model="form.user"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span=12>
                    <el-row>
                      <el-col :span=23>
                        <el-form-item label="IP/MAC地址">
                          <el-input  v-model="form.addr"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-footer">
              <el-button  size="small" icon="el-icon-search" @click="onSubmit">查询</el-button>
              <el-button  size="small" @click="reset">重置</el-button>
              <el-button  size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="585" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
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
  </div>
</template>

<script>
import { getSearchOrgApi } from '@src/http/systemOperationManage/serverManagement.api'
import { queryRegularlyRemindedInfoApi } from '@src/http/systemOperationManage/regularReminder.api'
export default {
  name: 'RegularReminderSearch',
  data() {
    return {
      resizable: false,
      columns: [
        { prop: 'org', sortable: true, label: '所属机构', width: '' },
        { prop: 'Addr', sortable: true, label: 'IP/MAC地址', width: '' },
        { prop: 'name', sortable: true, label: '姓名', width: '' },
        { prop: 'time', sortable: true, label: '提醒时间', width: '' }
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      form: {
        orgName: '',
        orgId: '',
        addr: '',
        user: '',
        remindEndHours: []
      },
      pageSize: 10,
      page: 1
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: 1,
        name: value,
        oId: type === 'org' ? this.form.orgId : this.form.inputOrgId
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
        this.form.orgId = val.id
        this.form.orgName = val.name
      } else if (type === 'inputOrg') {
        this.form.inputOrg = val.id
        this.form.inputOrgName = val.name
      }
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询预置
    onSubmit() {
      let param = {
        orgId: String(this.form.orgId),
        startTime: this.form.remindEndHours.length ? String(this.form.remindEndHours[0]) : '',
        endTime: this.form.remindEndHours.length ? String(this.form.remindEndHours[1]) : '',
        name: this.form.user,
        page: this.page,
        limit: this.pageSize
      }
      queryRegularlyRemindedInfoApi({'query': param}).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
        }
      })
    },
    // 重置
    reset() {
      this.form = {
        orgName: '',
        orgId: '',
        addr: '',
        user: '',
        remindEndHours: []
      }
      this.tableData = []
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['所属机构', 'IP/MAC地址', '姓名', '提醒时间']
      const filterVal = ['org', 'Addr', 'name', 'time']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '定时提醒查询列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
.regular-reminder-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 10px 20px 10px 0;
          .p-search-from {
            border: 1px solid #ddd;
            background: #F5F5F5;
            padding: 13px 10px 0 10px;
            margin: 0 auto;
            width: 60%;
          }
          .p-search-footer {
            width: 70%;
            padding-top: 20px;
            margin: 0 auto;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 245px');
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
}
/deep/ .el-autocomplete {
  width: 100%;
  height: 28px;
  .el-input {
    height: 100%;
    input {
      height: 100%;
    }
  }
}
</style>
