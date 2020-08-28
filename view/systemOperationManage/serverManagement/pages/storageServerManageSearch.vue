<!--
 * @Author: your name
 * @Date: 2020-08-03 11:41:07
 * @LastEditTime: 2020-08-03 15:38:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\serverManagement\pages\storageServerManageSearch.vue
-->
<template>
  <div class="storage-server-search-box">
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
                      <el-form-item label="服务器名称">
                        <el-input  v-model="form.serverName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="类型">
                        <el-select v-model="form.serverType" style="width: 100%;">
                          <el-option v-for="(item,index) in typeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="IP地址">
                        <el-input  v-model="form.ipAddr"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="端口">
                        <el-input  v-model="form.port"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="机构">
                        <el-autocomplete class="inline-input" size="mini" v-model="form.orgName" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构" :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="重点部位">
                        <el-autocomplete class="inline-input" size="mini"  v-model="form.keyPart" value-key="name" :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位" :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="总容量(T)">
                        <el-input  v-model="form.totalSize" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=23>
                      <el-form-item label="剩余容量(T)">
                        <el-input  v-model="form.freeSize" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </el-col>
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
import { getSearchOrgApi, queryStoreServerApi } from '@src/http/systemOperationManage/serverManagement.api'
export default {
  components: {
  },
  name: 'ServerManageSearch',
  data() {
    return {
      treeType: 0,
      resizable: false,
      columns: [
        { prop: 'orgName', sortable: true, label: '机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '重点部位', width: '' },
        { prop: 'serverName', sortable: true, label: '服务器名称', width: '' },
        { prop: 'ipAddr', sortable: true, label: 'IP地址', width: '' },
        { prop: 'port', sortable: true, label: '端口', width: '' },
        { prop: 'totalSize', sortable: true, label: '总容量', width: '' },
        { prop: 'freeSize', sortable: true, label: '剩余容量', width: '' },
        { prop: 'isInit', sortable: true, label: '服务器状态', width: '' },
        { prop: 'vedioType', sortable: true, label: '类型', width: '' }
      ],
      typeArray: [
        {value: 0, label: '全部'},
        {value: 1, label: '定时录像'},
        {value: 2, label: '报警录像'}
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      form: {
        port: '',
        serverName: '',
        orgName: '',
        serverType: 0,
        ipAddr: '',
        orgId: '',
        keyPartId: '',
        keyPart: '',
        totalSize: '',
        freeSize: '',
        limit: 10,
        page: 1,
        hostIp: window.location.hostname
      }
    }
  },
  computed: {
  },
  created() {
  },
  watch: {
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
      this.onSubmit()
    },
    // 分页条数
    handleSizeChange(val) {
      this.form.limit = val
      this.onSubmit()
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
      let param = JSON.parse(JSON.stringify(this.form))
      param.port = Number(param.port)
      queryStoreServerApi(param).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list || []
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['机构', '重点部位', '服务器名称', 'IP地址', '端口', '总容量', '剩余容量', '服务器状态', '类型']
      const filterVal = ['orgName', 'keyPart', 'serverName', 'ipAddr', 'port', 'totalSize', 'freeSize', 'isInit', 'vedioType']
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '存储服务器列表')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    reset() {
      this.form = {
        port: '',
        serverName: '',
        orgName: '',
        serverType: 0,
        ipAddr: '',
        orgId: '',
        keyPartId: '',
        keyPart: '',
        totalSize: '',
        freeSize: '',
        limit: 10,
        page: 1,
        hostIp: window.location.hostname
      }
      this.tableData = []
    }
  }
}
</script>

<style lang="less" scoped>
.storage-server-search-box {
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
  .el-input {
    height: 100%;
    input {
      height: 100%;
    }
  }
}
</style>
