<template>
  <div class="org-manage-create-modify-box">
    <!-- 携物管理--新建/编辑弹窗 -->
    <div class="content">
      <div class="cut-div">
        <span>统计条件</span>
        <div class="cut-rule"></div>
      </div>
      <div class="main">
        <div class="main-box">
          <div class="box-title">携物数据统计</div>
          <div class="main-box-center">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>所属机构</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-select v-model="form.fatherMent" placeholder="请选择" style="width: 100%">
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
                    v-model="form.childMent"
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
                <td class="box-cell-title">
                  <span>时间</span>
                  <span style="color: red">*</span>
                </td>
                <td class="box-cell-input">
                  <el-date-picker v-model="form.time" style="width: 100%" type="date" placeholder="选择日期">
                  </el-date-picker>
                </td>
                <td class="box-cell-title">状态</td>
                <td class="box-cell-input">
                  <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in formData.status" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">是否危险品</td>
                <td class="box-cell-input">
                  <el-select v-model="form.denger" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in formData.denger" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <el-button size="small" type="primary" @click="clickSubmit('提交')">统计</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <el-button style="font-size:12px;" plain @click="exportFile('携物数据统计表')"
          ><i class="icon iconfont-ccb ccbdaoru el-icon-"></i>导出</el-button
        >
      </div>
      <div class="cut-div">
        <span>统计结果</span>
        <div class="cut-rule"></div>
      </div>
      <div class="main">
        <div class="main-box">
          <div class="box-title">携物数据统计表</div>
          <el-table :data="tableData" style="width: 100%" height="400">
            <el-table-column type="index" label="序号" min-width="50"></el-table-column>
            <el-table-column prop="fatherMent" label="所属机构" min-width="70" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="childMent"
              label="所属重点部位"
              min-width="90"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="time" label="时间" min-width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="denger" label="是否危险品" min-width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" min-width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="count" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
          </el-table>
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
      isfirstPage: false,
      islastPage: false,
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
        fatherMent: '',
        childMent: '',
        time: '',
        status: '',
        denger: ''
      },
      tableData: [
        {
          index: '1',
          fatherMent: 'fatherMent',
          childMent: 'childMent',
          time: 'time',
          status: 'status',
          denger: 'denger',
          count: 'count'
        },
        {
          index: '2',
          fatherMent: 'fatherMent',
          childMent: 'childMent',
          time: 'time',
          status: 'status',
          denger: 'denger',
          count: 'count'
        },
        {
          index: '3',
          fatherMent: 'fatherMent',
          childMent: 'childMent',
          time: 'time',
          status: 'status',
          denger: 'denger',
          count: 'count'
        },
        {
          index: '4',
          fatherMent: 'fatherMent',
          childMent: 'childMent',
          time: 'time',
          status: 'status',
          denger: 'denger',
          count: 'count'
        }
      ]
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
    // 同意
    onSubmit() {
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
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = ['序号', '所属机构', '所属重点部位', '时间', '是否危险品', '状态', '数量']
      // 字段名
      const filterVal = ['index', 'fatherMent', 'childMent', 'time', 'status', 'denger', 'count']
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
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
