<!--
 * @Author: your name
 * @Date: 2020-07-01 21:23:12
 * @LastEditTime: 2020-07-01 21:45:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\messageControl\pages\MessageControlSearch.vue
-->
<template>
  <div class="message-control-search-box">
    <div class="content">
      <div class="directory">
        <div class="directory-item">
          <span class="el-icon-location-outline"></span>
        </div>
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统运维管理</el-breadcrumb-item>
          <el-breadcrumb-item>短信管理</el-breadcrumb-item>
          <el-breadcrumb-item>短信查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- <p>短信查询</p> -->
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="messageForm" :model="form">
                <el-row>
                  <el-col :span=12>
                  <el-col :span=23>
                    <el-form-item label="接收者" prop="receiver">
                      <el-input  v-model="form.receiver"></el-input>
                    </el-form-item>
                  </el-col>
                  </el-col>
                  <el-col :span=12>
                  <el-col :span=23>
                    <el-form-item label="短信内容" prop="content">
                      <el-input  v-model="form.content"></el-input>
                    </el-form-item>
                  </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                    <el-form-item label="发送方式" prop="mode">
                      <el-select v-model="form.mode" style="width: 100%;">
                        <el-option v-for="(item,index) in sendModeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="发送时间" prop="sendTime">
                        <el-date-picker
                        style="width:100%;"
                        v-model="sendTime"
                        type="daterange"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始"
                        end-placeholder="结束">
                       </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="发送状态" prop="status">
                        <el-select v-model="form.status" style="width: 100%;">
                          <el-option v-for="(item,index) in sendStatusArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入人" prop="updatedBy">
                        <el-input  v-model="form.updatedBy"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入机构" prop="updatedDept">
                        <el-autocomplete class="inline-input" size="mini" v-model="form.updatedDept" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入时间" prop="updateTime">
                        <el-date-picker
                          style="width:100%;"
                          v-model="updateTime"
                          type="daterange"
                          value-format="timestamp"
                          range-separator="至"
                          start-placeholder="开始"
                          end-placeholder="结束">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-footer">
              <el-button  size="small" icon="el-icon-search" @click="onSubmit">查询</el-button>
              <el-button  size="small" @click="reset">重置</el-button>
              <el-button  size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="exportMessage">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="490" style="width: 100%">
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
import VideoPagination from '../../../videoManage/components/VideoPagination'
import { getSearchOrgApi } from '@src/http/systemOperationManage/serverManagement.api'
import { queryShortMessageApi } from '@src/http/systemOperationManage/messageControl.api'
export default {
  name: 'MessageControlSearch',
  components: {
    VideoPagination
  },
  data() {
    return {
      resizable: false,
      columns: [
        { prop: 'receiver', sortable: true, label: '收件人', width: '' },
        { prop: 'content', sortable: true, label: '短信内容', width: '' },
        { prop: 'mode', sortable: true, label: '发送方式', width: '' },
        { prop: 'time', sortable: true, label: '发送时间', width: '' },
        { prop: 'status', sortable: true, label: '发送状态', width: '' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '' }
      ],
      sendModeArray: [
        {value: 0, label: '全部'},
        {value: 1, label: '即时发送'},
        {value: 2, label: '定时发送'}
      ],
      sendStatusArray: [
        {value: 0, label: '全部'},
        {value: 1, label: '新建'},
        {value: 2, label: '已发送'}
        // {value: 4, label: '等待发送'}
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      form: {
        orgId: '',
        updatedDept: '',
        receiver: '',
        mode: 0,
        content: '',
        startTime: '',
        endTime: '',
        status: 0,
        updatedBy: '',
        startEntryTime: '',
        endEntryTime: '',
        page: {
          pageSize: 10,
          page: 1
        }
      },
      sendTime: [], // 发送时间
      updateTime: [], // 录入时间
      paginationConfig: {
        limit: 100,
        page: 1
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
      this.form.orgId = val.id
      this.form.updatedDept = val.name
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
    // 查询预置
    onSubmit() {
      this.queryShortMessageApiFuc()
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.queryShortMessageApiFuc()
    },
    // 短信查询
    queryShortMessageApiFuc() {
      this.form = {
        ...this.form,
        page: this.paginationConfig.page,
        pageSize: this.paginationConfig.limit,
        startTime: this.sendTime.length ? this.sendTime[0] : 0,
        endTime: this.sendTime.length ? this.sendTime[1] : 0,
        startEntryTime: this.updateTime.length ? this.updateTime[0] : 0,
        endEntryTime: this.updateTime.length ? this.updateTime[1] : 0
      }
      queryShortMessageApi(this.form).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.smsList || []
          this.total = res.data.data.page.totalNumber || 0
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 重置
    reset() {
      this.form = {
        orgId: '',
        updatedDept: '',
        receiver: '',
        mode: 0,
        content: '',
        startTime: '',
        endTime: '',
        status: 0,
        updatedBy: '',
        startEntryTime: '',
        endEntryTime: '',
        pageSize: 10,
        page: 1
      }
      this.sendTime = []
      this.updateTime = []
      this.tableData = []
    },
    // 导出
    exportMessage() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['收件人', '短信内容', '发送方式', '发送时间', '发送状态', '录入人', '录入机构', '录入时间']
      const filterVal = ['receiver', 'content', 'mode', 'time', 'status', 'updatedBy', 'updatedDept', 'createdAt']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '服务器列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
.message-control-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .directory {
      overflow: hidden;
      .directory-item {
        float: left;
        font-size: 18px;
        margin-right: 3px;
      }
    }
    .breadcrumb {
      float:left;
      margin-top:4px;
    }
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        width: 100%;
        .main-box {
          padding: 10px 20px 10px 0;
          .p-search-from {
            border: 1px solid #ddd;
            background: #F5F5F5;
            padding: 10px;
            margin: 0 auto;
            width: 70%;
          }
          .p-search-footer {
            width: 70%;
            margin: 0 auto;
            padding-top: 20px;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 310px');
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
.el-input__inner {
  width: 424px;
}
</style>
