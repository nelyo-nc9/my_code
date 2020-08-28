<!--
 * @Author: your name
 * @Date: 2020-06-22 08:27:32
 * @LastEditTime: 2020-06-22 09:30:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\ServerManageSearch.vue
-->
<template>
  <div class="prevent-drowsy-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <p style="text-align:center;width:70%;font-size:16px;">防瞌睡日志查询</p>
            <div class="p-search-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="searchForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="所属机构">
                        <el-autocomplete class="inline-input" size="mini" v-model="org" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="IP/MAC地址">
                        <el-input size="mini" v-model="form.addr"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="瞌睡时间起">
                        <el-date-picker
                          v-model="form.startTime"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="瞌睡时间止">
                        <el-date-picker
                          v-model="form.endTime"
                          value-format="timestamp"
                          type="datetime"
                          placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="用户">
                        <!-- <el-select v-model="form.user" style="width: 100%;">
                          <el-option v-for="(item,index) in userArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                        <el-input size="mini" v-model="form.user"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="瞌睡原因">
                        <el-select v-model="form.reason" style="width: 100%;">
                          <el-option v-for="(item,index) in drowsyCause" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-footer">
              <el-button  size="small" @click="onSubmit" icon="el-icon-search">查询</el-button>
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
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="465" style="width: 100%">
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
          <VideoPagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"></VideoPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSearchOrgApi } from '@src/http/systemOperationManage/serverManagement.api'
import { queryPreventSleepyInfoApi } from '@src/http/systemOperationManage/preventDrowsy.api'
import VideoPagination from '../../../videoManage/components/VideoPagination'
export default {
  name: 'PreventDrowsyLogSearch',
  components: {
    VideoPagination
  },
  data() {
    return {
      showOrgTree: false,
      resizable: false,
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'addr', sortable: true, label: 'IP/MAC地址', width: '' },
        { prop: 'name', sortable: true, label: '姓名', width: '' },
        { prop: 'time', sortable: true, label: '瞌睡时间', width: '' },
        { prop: 'reason', sortable: true, label: '瞌睡原因', width: '' }
      ],
      userArray: [
        {value: '全部', label: '全部'}
      ],
      drowsyCause: [
        {value: '1', label: '未输入验证码'},
        {value: '2', label: '错误输入验证码'}
      ],
      tableData: [
      ],
      total: 0,
      paginationConfig: {
        limit: 100,
        page: 1
      },
      org: '',
      orgId: '',
      selectData: [],
      form: {
        user: '',
        orgName: '',
        reason: '1',
        addr: '',
        startTime: '',
        endTime: ''
      }
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
        oId: undefined
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
      this.orgId = val.id
      this.form.orgName = val.name
    },
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = val
      console.log(val, '列表勾选')
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.onSubmit()
    },
    // 查询预置
    onSubmit() {
      let param = {
        ...this.paginationConfig,
        orgName: this.form.orgName,
        addr: this.form.addr,
        startTime: (this.form.startTime === null || this.form.startTime.length === 0) ? '' : String(this.form.startTime / 1000),
        endTime: (this.form.endTime === null || this.form.endTime.length === 0) ? '' : String(this.form.endTime / 1000),
        name: this.form.user,
        reason: this.form.reason
      }
      queryPreventSleepyInfoApi(param).then(res => {
        if (res.data.code === 0) {
          this.total = res.data.data.page.totalNumber || 0
          this.tableData = res.data.data.list || []
        }
      })
        .catch(err => {
          this.$messageError('查询失败')
          console.log(err)
        })
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['所属机构', 'IP/MAC地址', '姓名', '瞌睡时间', '瞌睡原因']
      const filterVal = ['orgName', 'addr', 'name', 'time', 'reason']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '查询防瞌睡日志结果')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 重置
    reset() {
      this.form = {
        user: '',
        orgName: '',
        reason: '',
        keyPart: '',
        startTime: '',
        endTime: ''
      }
      this.oId = ''
      this.org = ''
      this.tableData = []
    }
  }
}
</script>

<style lang="less" scoped>
.prevent-drowsy-search-box {
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
          padding: 0px 20px 5px 0;
          .p-search-from {
            border: 1px solid #ddd;
            background: #F5F5F5;
            padding: 10px;
            margin: 15px 0;
            width: 70%;
            .item {
              height: 40px;
              line-height: 40px;
              margin-right: 3px;
              text-align: center;
              background: #f2f2f2;
            }
            .details {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
          }
          .p-search-footer {
            width: 70%;
            padding-top: 10px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 335px');
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
