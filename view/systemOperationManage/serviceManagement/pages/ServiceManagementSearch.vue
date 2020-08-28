<!--
 * @Author: your name
 * @Date: 2020-06-24 08:23:12
 * @LastEditTime: 2020-06-24 22:02:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serviceManagement\pages\ServiceManagementSearch.vue
-->
<template>
  <div class="service-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="serverForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="服务名称">
                        <el-input  v-model="form.serviceName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="服务类型">
                        <el-select v-model="form.serviceType" style="width: 100%;">
                          <el-option v-for="(item,index) in serviceArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="状态">
                        <el-select v-model="form.status" style="width: 100%;">
                          <el-option v-for="(item,index) in statusArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="备注">
                        <el-input  v-model="form.notes"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入人">
                        <el-input  v-model="form.updatedBy"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入机构">
                        <el-autocomplete class="inline-input" size="mini" v-model="form.updatedDept" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="录入时间">
                        <el-date-picker
                          style="width:100%;"
                          v-model="form.updateTime"
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
              <el-button  size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="560" style="width: 100%">
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
import { queryServiceManagerApi } from '@src/http/systemOperationManage/serviceManagement.api'
import { getSearchOrgApi } from '@src/http/systemOperationManage/serverManagement.api'
export default {
  name: 'ServiceManageSearch',
  data() {
    return {
      resizable: false,
      columns: [
        { prop: 'abbreviation', sortable: true, label: '简称', width: '' },
        { prop: 'serviceName', sortable: true, label: '服务名称', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'colony', sortable: true, label: '集群', width: '' },
        { prop: 'status', sortable: true, label: '状态', width: '' },
        { prop: 'serviceType', sortable: true, label: '服务类型', width: '' },
        { prop: 'serviceExplain', sortable: true, label: '服务说明', width: '' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '' }
      ],
      serviceArray: [
        {value: '全部', label: '全部'},
        {value: 'Http', label: 'Http'},
        {value: '设备接入', label: '设备接入'},
        {value: '视频转发', label: '视频转发'},
        {value: '控制命令', label: '控制命令'},
        {value: 'RTSP', label: 'RTSP'},
        {value: '级联服务', label: '级联服务'}
      ],
      statusArray: [
        {value: 0, label: '全部'},
        {value: 1, label: '正常'},
        {value: 2, label: '停用'}
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      form: {
        status: 0,
        serviceName: '',
        serviceType: '全部',
        notes: '',
        updatedBy: '',
        updatedDept: '',
        updateTime: []
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
      this.queryServiceManagerApiFuc()
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.queryServiceManagerApiFuc()
    },
    // 查询预置
    onSubmit() {
      this.queryServiceManagerApiFuc()
    },
    // 服务查询
    queryServiceManagerApiFuc() {
      let param = {
        page: this.page,
        limit: this.pageSize,
        hostIp: window.location.hostname, // 测试IP
        serviceName: this.form.serviceName,
        serviceType: this.form.serviceType === '全部' ? '' : this.form.serviceType,
        status: this.form.status,
        updatedBy: this.form.updatedBy,
        updatedDept: this.form.updatedDept,
        startUpTime: this.form.updateTime.length === 0 ? '' : String(this.form.updateTime[0]),
        endUpTime: this.form.updateTime.length === 0 ? '' : String(this.form.updateTime[1])
      }
      queryServiceManagerApi(param).then(res => {
        if (res.data.code === 0) {
          if (res.data.data.list === null) {
            this.tableData = []
            return this.$messageError('未查询到数据')
          }
          this.tableData = res.data.data.list || []
          this.total = res.data.data.pageData.totalNumber
          this.$messageSuccess('查询成功')
        } else {
          this.$messageError('查询失败')
        }
      })
        .catch(err => {
          this.$messageError('查询失败')
          console.log(err)
        })
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.form.orgId : undefined
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
      } else if (type === 'kp') {
        this.form.keyPartId = val.id
        this.form.keyPart = val.name
      }
    },
    // 重置
    reset() {
      this.form = {
        ...this.form,
        status: 0,
        serviceName: '',
        serviceType: '全部',
        notes: '',
        updatedBy: '',
        updatedDept: '',
        updateTime: []
      }
      this.tableData = []
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['简称', '服务名称', '端口', '集群', '状态', '服务类型', '服务说明', '录入人', '录入机构', '录入时间']
      const filterVal = ['abbreviation', 'serviceName', 'port', 'colony', 'status', 'serviceType', 'serviceExplain', 'updatedBy', 'updatedDept', 'updateTime']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '服务列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
.service-manage-search-box {
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
            padding: 10px;
            margin: 0 auto;
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
            padding-top: 20px;
            margin: 0 auto;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 270px');
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
  /deep/.el-date-editor {
    width: 400px;
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
}
</style>
