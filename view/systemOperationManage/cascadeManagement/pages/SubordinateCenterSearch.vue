<!--
 * @Author: your name
 * @Date: 2020-07-09 16:47:11
 * @LastEditTime: 2020-07-09 17:32:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\cascadeManagement\pages\SubordinateCenterSearch.vue
-->
<template>
  <div class="subordinate-center-search-box">
    <div class="content">
      <div class="location">
        <div style="float:left;font-size:18px;">
          <span class="el-icon-location-outline"></span>
        </div>
        <div style="float:left;margin-top:4px;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统维护</el-breadcrumb-item>
            <el-breadcrumb-item>系统运维</el-breadcrumb-item>
            <el-breadcrumb-item>级联管理</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-form :model="form" ref="ruleForm">
                <el-row>
                  <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">下级中心名称</div>
                  </el-col>
                  <el-col :span=17>
                    <el-form-item prop="serverName">
                      <el-input  v-model="form.serverName"></el-input>
                    </el-form-item>
                  </el-col>
                  </el-col>
                  <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">所属机构</div>
                  </el-col>
                  <el-col :span=18>
                    <el-input v-model="form.orgName"></el-input>
                  </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">下级中心地址</div>
                    </el-col>
                    <el-col :span=17>
                      <el-input  v-model="form.ipAddr"></el-input>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">控制端口</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input  v-model="form.port"></el-input>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">固定数据端口</div>
                    </el-col>
                    <el-col :span=17>
                      <div style="margin-top:12px;">
                        <el-radio v-model="isFixedDataPort" label="1">固定</el-radio>
                        <el-radio v-model="isFixedDataPort" label="2">随机</el-radio>
                      </div>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">端口范围</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">用户名</div>
                    </el-col>
                    <el-col :span=17>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">密码</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">录入人</div>
                    </el-col>
                    <el-col :span=17>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">录入机构</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                </el-row>
                <el-row style="margin-top:1px;">
                  <el-col :span=12>
                    <el-col :span=6>
                      <div class="item">录入时间</div>
                    </el-col>
                    <el-col :span=17>
                      <el-input v-model="form.orgName"></el-input>
                    </el-col>
                  </el-col>
                  <el-col :span=12>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" icon="el-icon-search" size="small" @click="onSubmit">查询</el-button>
              <el-button  size="small" @click="reset">重置</el-button>
              <el-button  size="small" @click="educe">导出</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="380" style="width: 100%">
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
export default {
  components: {
  },
  name: 'SubordinateCenterSearch',
  data() {
    return {
      isFixedDataPort: '1',
      orgName: '',
      resizable: false,
      columns: [
        { prop: '', sortable: true, label: '下级中心名称', width: '' },
        { prop: '', sortable: true, label: '所属机构', width: '' },
        { prop: '', sortable: true, label: '状态', width: '' },
        { prop: '', sortable: true, label: '下级中心地址', width: '' },
        { prop: '', sortable: true, label: '控制端口', width: '' },
        { prop: '', sortable: true, label: '数据端口', width: '' },
        { prop: '', sortable: true, label: '用户名', width: '' },
        { prop: '', sortable: true, label: '密码', width: '' },
        { prop: '', sortable: true, label: '录入人', width: '' },
        { prop: '', sortable: true, label: '录入机构', width: '' },
        { prop: '', sortable: true, label: '录入时间', width: '' }
      ],
      systemArray: [
        {value: 1, label: 'Liunx'},
        {value: 2, label: 'Windows'}
      ],
      tableData: [
      ],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        port: '',
        serverName: '',
        orgName: '',
        system: 1,
        ipAddr: '',
        username: '',
        password: '',
        orgId: ''
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
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询预置
    onSubmit() {
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      this.tableData = []
    },
    // 导出
    educe() {
      if (this.selectData.length <= 0) {
        return this.$message('请勾选导出项')
      } else {
        return this.$message('导出')
      }
    },
    // 打印
    print() {
      return this.$message('打印')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/elementModify.less';
.subordinate-center-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    .location {
      overflow: hidden;
    }
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
      height: calc(~'100% - 425px');
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
/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
