<template>
  <div class="org-manage-create-modify-box">
    <!-- 携物管理--新建/编辑弹窗 -->
    <div class="content">
      <div class="cut-div">
        <span>查询条件</span>
        <div class="cut-rule"></div>
      </div>
      <div class="main">
        <div class="main-box">
          <div class="box-title">携物申请查询</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>所属机构</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-select v-model="form.departmentId" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in formData.fatherMent"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </td>
                <td class="box-cell-title">
                  <span>所属重点部位</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    value-key="name"
                    v-model="form.departmentChild"
                    style="width: 100%"
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
              </tr>
              <tr>
                <td class="box-cell-title">申请编号</td>
                <td class="box-cell-input">
                  <el-input v-model="form.applyNumber"></el-input>
                </td>
                <td class="box-cell-title">申请部门</td>
                <td class="box-cell-input">
                  <el-input v-model="form.applyMent"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">申请人</td>
                <td class="box-cell-input">
                  <el-input v-model="form.applyPeople"></el-input>
                </td>
                <td class="box-cell-title">联系电话</td>
                <td class="box-cell-input">
                  <el-input v-model="form.phone"></el-input>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">申请事由</td>
                <td class="box-cell-input">
                  <el-input v-model="form.applyMsg"></el-input>
                </td>
                <td class="box-cell-title">录入时间</td>
                <td class="box-cell-input">
                  <el-date-picker v-model="form.enterTime" type="date" style="width: 100%" placeholder="选择日期">
                  </el-date-picker>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">录入机构</td>
                <td class="box-cell-input">
                  <el-select v-model="form.enterMent" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in formData.denger" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </td>
                <td class="box-cell-title">录入人</td>
                <td class="box-cell-input">
                  <el-input v-model="form.enterPeople"></el-input>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <el-button size="small" type="primary" @click="clickSubmit">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <el-button style="font-size:12px;" plain @click="exportFile('携物申请查询统计表')"
          ><i class="icon iconfont-ccb ccbdaoru el-icon-"></i>导出</el-button
        >
      </div>
      <div class="cut-div">
        <span>查询结果</span>
        <div class="cut-rule"></div>
      </div>
      <div class="main" style="width:100%;">
        <div class="main-box">
          <div class="box-title">携物申请查询统计表</div>
          <div style="min-height:400px;">
            <el-table
              :data="tableData"
              style="width:100%"
              height="400"
              :default-sort="{ prop: 'date', order: 'descending' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="30"></el-table-column>
              <el-table-column type="index" label="序号" min-width="30"></el-table-column>
              <el-table-column
                prop="date"
                label="所属机构"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="name"
                label="所属重点部位"
                min-width="90"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="申请编号"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="申请部门"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="申请人"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="联系电话"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="申请事由"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="人员姓名"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="录入人"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="审批状态"
                min-width="70"
                sortable="custom"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 分页 -->
        <div style="text-align:right;margin:30px 30px 30px 0;">
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :current-page="pageCurrents"
            layout="total, sizes,slot, prev"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
          >
            <el-button type="text" @click="pagePrev">首页</el-button>
          </el-pagination>
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :page-count="1"
            :total="total"
            :current-page="pageCurrents"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
            layout="slot"
          >
            <span>{{ pageCurrents }}/{{ pageCounts }}</span>
          </el-pagination>
          <el-pagination
            style="text-align:right;display:inline-block;"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            :current-page="pageCurrents"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="pageSizeCurrent"
            layout="next,slot, jumper"
            ><el-button type="text" @click="pageNext">末页</el-button></el-pagination
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 0, // 数据总条数
      pageSize: 10, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      isfirstPage: true,
      islastPage: true,
      lastPageNum: Math.ceil(this.listTotal / this.pageSize),
      formData: {
        fatherMent: [
          {
            value: '1',
            name: '1'
          },
          {
            value: '2',
            name: '2'
          }
        ],
        childMent: [
          {
            value: '1',
            name: '1'
          },
          {
            value: '2',
            name: '2'
          }
        ],
        time: [
          {
            value: '1',
            name: '1'
          },
          {
            value: '2',
            name: '2'
          }
        ],
        status: [
          {
            value: '1',
            name: '1'
          },
          {
            value: '2',
            name: '2'
          }
        ],
        denger: [
          {
            value: '1',
            name: '1'
          },
          {
            value: '2',
            name: '2'
          }
        ]
      },
      form: {
        // 表单数据
        departmentId: 'departmentId',
        departmentChild: 'departmentChild',
        applyNumber: 'applyNumber',
        applyMent: 'applyMent',
        applyPeople: 'applyPeople',
        phone: 'phone',
        applyMsg: 'applyMsg',
        enterTime: 'enterTime',
        enterMent: 'enterMent',
        enterPeople: 'enterPeople'
      },
      tableData: [
        // 列表数据
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
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      selectData: '' // 列表选中数据
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)
    this.total = this.tableData.length
  },
  computed: {
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      console.log(this.pageCurrent)
      return this.pageCurrent
    }
  },
  methods: {
    // 查询
    clickSubmit() {
      console.log('submit!')
    },
    // 重置
    reset() {
      for (var key in this.form) {
        this.form[key] = ''
      }
    },
    // 改变pageSize
    pageSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      console.log(this.pageCurrent)
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCount
    },
    // 选中数据
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '申请编号',
        '申请部门',
        '申请人',
        '联系电话',
        '申请事由',
        '人员姓名',
        '录入人',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'index',
        'date',
        'name',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address',
        'address'
      ]
      let list = []
      // 导出全部或导出选中
      // 导出全部或导出选中
      if (this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
    width: 100%;
    .cut-div {
      position: relative;
      margin-top: 30px;
      .cut-rule {
        position: absolute;
        display: inline-block;
        width: 95%;
        top: 8px;
        right: 0;
        border-bottom: 2px solid #eee;
      }
    }

    // .el-button {
    //   width: 80px;
    // }
    .main {
      margin: 0 auto;
      width: 1000px;
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
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
