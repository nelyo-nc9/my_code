<!--
 * @Author: your name
 * @Date: 2020-06-22 08:27:32
 * @LastEditTime: 2020-06-22 09:30:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\ServerManageSearch.vue
-->
<template>
  <div class="server-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form size="mini" label-position="right" label-width="100px" ref="searchForm" :model="form">
                <el-row>
                  <el-col :span=12>
                    <el-col :span=24>
                      <el-form-item label="服务器名称" prop="serverName">
                        <el-input  v-model="form.serverName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=24>
                      <el-form-item label="操作系统" prop="system">
                        <el-select v-model="form.system" style="width:100%">
                          <el-option v-for="(item,index) in systemArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-form-item label="IP地址" prop="ipAddr">
                      <el-col :span=24>
                        <el-input  v-model="form.ipAddr"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span=12>
                    <el-form-item label="端口" prop="port">
                      <el-col :span=24>
                        <el-input  v-model="form.port"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-form-item label="机构" prop="orgName">
                      <el-col :span=24>
                        <el-autocomplete class="inline-input" size="mini" v-model="form.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span=12>
                    <el-form-item label="重点部位" prop="keyPart">
                      <el-col :span=24>
                        <el-autocomplete class="inline-input" size="mini"  v-model="form.keyPart" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-footer">
              <el-button  icon="el-icon-search" size="small" @click="onSubmit">查询</el-button>
              <el-button  size="small"  @click="reset">重置</el-button>
              <el-button  size="small" style="font-size:12px;" :disabled="tableData.length === 0" @click="educe">
              <i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="480" style="width: 100%">
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
            :page-size="form.limit"
            :current-page="form.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSearchOrgApi, queryServerInfoApi } from '@src/http/systemOperationManage/serverManagement.api'
export default {
  components: {
  },
  name: 'ServerManageSearch',
  data() {
    return {
      orgName: '',
      treeType: 0,
      resizable: false,
      columns: [
        { prop: 'orgName', sortable: true, label: '机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '重点部位', width: '' },
        { prop: 'serverName', sortable: true, label: '服务器名称', width: '' },
        { prop: 'system', sortable: true, label: '系统', width: '' },
        { prop: 'serverType', sortable: true, label: '类型', width: '' },
        { prop: 'onlineStatus', sortable: true, label: '状态', width: '' },
        { prop: 'ipAddr', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'username', sortable: true, label: '用户名', width: '' }
        // { prop: 'password', sortable: true, label: '密码', width: '' }
      ],
      systemArray: [
        {value: 0, label: '全部'},
        {value: 1, label: 'Liunx'},
        {value: 2, label: 'Windows'}
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      form: {
        hostIp: window.location.hostname,
        port: '',
        serverName: '',
        orgName: '',
        system: 0,
        ipAddr: '',
        orgId: '',
        keyPartId: '',
        username: '',
        password: '',
        keyPart: '',
        limit: 10,
        page: 1
      }
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
      this.form.page = val
    },
    // 分页条数
    handleSizeChange(val) {
      this.form.limit = val
      this.handleCurrentPageNum(1)
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
    // 查询预置
    onSubmit() {
      let param = this.$lodash.cloneDeep(this.form)
      param.port = Number(param.port)
      queryServerInfoApi({'server': param}).then(res => {
        if (res.data.code === 0) {
          if (!Object.keys(res.data.data).length) {
            this.tableData = []
            return this.$messageError('未查询到数据')
          }
          this.tableData = res.data.data.list || []
          this.total = res.data.data.pageData.totalNumber || 0
          this.$messageSuccess(res.data.message)
        } else {
          this.$messageError(res.data.message)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 重置
    reset() {
      this.form = {
        port: '',
        serverName: '',
        orgName: '',
        system: 0,
        ipAddr: '',
        orgId: '',
        keyPartId: '',
        username: '',
        password: '',
        keyPart: ''
      }
      this.tableData = []
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['机构', '重点部位', '服务器名称', '系统', '类型', '状态', 'IP地址', '端口', '用户名', '密码']
      const filterVal = ['orgName', 'keyPart', 'serverName', 'system', 'serverType', 'onlineStatus', 'ipAddr', 'port', 'username', 'password']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, `服务器列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
    // 打印
    // print() {
    //   // 判断打印全部还是选中
    //   let list = []
    //   if (this.selectData && this.selectData.length > 0) {
    //     list = this.selectData
    //   } else {
    //     list = this.tableData
    //   }
    //   printJS({
    //     // 表格数据的来源
    //     printable: list,
    //     // field 表格内容  displayName：表头名
    //     properties: [
    //       { field: 'orgName', displayName: '机构' },
    //       { field: 'keyPart', displayName: '重点部位' },
    //       { field: 'serverName', displayName: '服务器名称' },
    //       { field: 'system', displayName: '系统' },
    //       { field: 'serverType', displayName: '类型' },
    //       { field: 'onlineStatus', displayName: '状态' },
    //       { field: 'ipAddr', displayName: 'IP地址' },
    //       { field: 'port', displayName: '端口' },
    //       { field: 'username', displayName: '用户名' },
    //       { field: 'password', displayName: '密码' }
    //     ],
    //     type: 'json',
    //     // 表题
    //     header: '<p class="custom">查询服务器列表</p>',
    //     // 表题样式
    //     style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
    //     // 表头样式
    //     gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
    //     // 内容样式
    //     gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.server-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 15px 20px 20px 0;
          .p-search-from {
            border: 1px solid #ddd;
            background:#F5F5F5;
            padding: 10px;
            margin: 0 auto;
            width: 65%;
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
      height: calc(~'100% - 325px');
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
  line-height: 28px;
  .el-input {
    height: 100%;
    input {
      height: 100%;
    }
  }
}
</style>
