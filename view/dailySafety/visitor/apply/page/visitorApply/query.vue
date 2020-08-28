<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>访客管理</el-breadcrumb-item>
          <el-breadcrumb-item>访客入园申请</el-breadcrumb-item>
          <el-breadcrumb-item>查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            查询条件
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="query-criteria" v-if="isShow">
          <div class="create-from">
            <ul>
              <li>
                <span>部门*</span>
                <section>
                  <el-select v-model="formData.orgName" size="small" clearable>
                    <el-option value="江苏支行"></el-option>
                    <el-option value="北京支行"></el-option>
                  </el-select>
                </section>
              </li>
              <li></li>
              <li>
                <span>申请缘由*</span>
                <section>
                  <el-input v-model="formData.keyPartsName" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>申请人</span>
                <section>
                  <el-input v-model="formData.applyNumber" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>申请编号</span>
                <section>
                  <el-input v-model="formData.applyPeople" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>被访区域</span>
                <section>
                  <el-input v-model="formData.applyDepartment" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>访客姓名</span>
                <section>
                  <el-input v-model="formData.phone" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>审批状态</span>
                <section>
                  <el-select v-model="formData.type" size="small" clearable>
                    <el-option value="全部"></el-option>
                    <el-option value="待审批"></el-option>
                    <el-option value="已审批"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>申请时间*</span>
                <section>
                  <el-date-picker
                    v-model="formData.startTime"
                    size="small"
                    type="date"
                    style="width:100%"
                    placeholder="选择日期"
                  ></el-date-picker>
                </section>
              </li>
              <li>
                <span>至*</span>
                <section>
                  <el-date-picker
                    v-model="formData.overTime"
                    size="small"
                    type="date"
                    style="width:100%"
                    placeholder="选择日期"
                  ></el-date-picker>
                </section>
              </li>
              <li>
                <span>申请入园时间*</span>
                <section>
                  <el-date-picker
                    v-model="formData.startTime"
                    size="small"
                    type="date"
                    style="width:100%"
                    placeholder="选择日期"
                  ></el-date-picker>
                </section>
              </li>
              <li>
                <span>至*</span>
                <section>
                  <el-date-picker
                    v-model="formData.overTime"
                    size="small"
                    type="date"
                    style="width:100%"
                    placeholder="选择日期"
                  ></el-date-picker>
                </section>
              </li>
            </ul>
          </div>

          <div class="footer-button">
            <el-button>查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>
        <div class="query-results">
          <div>
            <div class="top-name">
              <span class="name">查询结果</span>
              <span class="border-span"></span>
            </div>
          </div>
          <div>
            <el-button size="small" @click="exportFile('访客入园申请查询表')">导出</el-button>
            <el-button @click="Toprint('访客入园申请查询表')">打印</el-button>
            <el-button style="font-size:12px;" plain @click="rem('确认删除已选中列表')">删除</el-button>
          </div>
          <div class="table-content">
            <el-table
              :data="tableData"
              border
              size="mini"
              stripe
              :height="isShow ?'520px':'710px'"
              :default-sort="{prop: 'date', order: 'descending'}"
              @selection-change="handleSelectionChange"
              @sort-change="sortChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in tableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <el-pagination
              style="text-align:center;"
              :page-sizes="[25, 50, 100, 200]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      downloadObject: [], //打印/导出数据
      remArr: [],//删除
      isShow: true, // 查询条件显隐
      isShowSubOrg: true,
      formData: {
        orgName: '',
        keyPartsName: '',
        applyNumber: '',
        applyPeople: '',
        applyDepartment: '',
        phone: '',
        company: '', //单位
        region: '', //区域
        type: '', //类型
        startTime: '',
        overTime: '',
        careful: '' //注意事项
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'subsystem', label: '申请人', sortable: 'true' },
        { prop: 'subsystem', label: '申请编号', sortable: 'true' },
        { prop: 'keySite', label: '所属部门', sortable: 'true' },
        { prop: 'keySite', label: '申请缘由', sortable: 'true' },
        { prop: 'deviceName', label: '访客信息', sortable: 'true' },
        { prop: 'deviceName', label: '入园时间', sortable: 'true' },
        { prop: 'deviceName', label: '结束时间', sortable: 'true' },
        { prop: 'deviceName', label: '被访区域', sortable: 'true' },
        { prop: 'index', label: '审批状态', sortable: 'true' }
      ],
      tableData: [
        // 列表数据
        {
          index: 1,
          subsystem: '2016-05-02',
          deviceName: '王小虎',
          id: 1,
          keySite: '北京'
        },
        {
          index: 1,
          subsystem: '2016-05-02',
          deviceName: '王小虎',
          id: 1,
          keySite: '北京'
        },
        {
          index: 1,
          subsystem: '2016-05-02',
          deviceName: '王小虎',
          id: 1,
          keySite: '北京'
        },
        {
          index: 1,
          subsystem: '2016-05-02',
          deviceName: '王小虎',
          id: 1,
          keySite: '北京'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    //排序
    sortChange(val) {
      console.log(val)
    },

    handleSelectionChange(val) {
      this.downloadObject = val
      this.remArr = val
    },
    //查询条件显隐
    changeShow() {
      this.isShow = !this.isShow
      console.log(123)
    },
    // 重置按钮
    reset() {
      for (var index in this.formData) {
        this.formData[index] = ''
      }
    },
     //删除
    rem(title) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remArr.map(item => {
            let indexs = this.tableData.indexOf(item)
            this.tableData.splice(indexs, 1)
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'keySite', displayName: '申请人' },
          { field: 'subsystem', displayName: '申请编号' },
          { field: 'subsystem', displayName: '所属部门' },
          { field: 'keySite', displayName: '申请缘由' },
          { field: 'subsystem', displayName: '访客信息' },
          { field: 'keySite', displayName: '入园时间' },
          { field: 'subsystem', displayName: '结束时间' },
          { field: 'subsystem', displayName: '被访区域' },
          { field: 'subsystem', displayName: '审批状态' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '申请人',
        '申请编号',
        '所属部门',
        '申请缘由',
        '访客信息',
        '入园时间',
        '结束时间',
        '被防区域',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'subsystem',
        'subsystem',
        'keySite',
        'index',
        'subsystem',
        'index',
        'subsystem',
        'subsystem',
        'index'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.downloadObject && this.downloadObject.length > 0) {
        list = this.downloadObject
      } else if (this.downloadObject.length == 0) {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, title)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  /deep/ .el-button {
    width: 70px;
    padding: 7px 20px;
    font-size: 13px;
  }
  .right-content {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0px;
    font-size: 14px;
    padding: 5px 20px 0 20px;
    display: flex;
    flex-direction: column;
    .table-box {
      width: 100%;
      height: calc(~'100% - 34px');
      display: flex;
      flex-direction: column;
      .box-title {
        position: relative;
        height: 24px;
        line-height: 24px;
        color: #606266;

        i {
          position: absolute;
          top: 50%;
          left: 85px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 120px');
          margin-left: 100px;
          margin-top: -12px;
        }
      }
      .top-name {
        display: flex;
        width: 100%;
        align-content: center;
        height: 19px;
        .name {
          color: #606266;
          font-size: 14px;
          width: 75px;
        }
        .border-span {
          height: 1px;
          width: calc(~'100% - 75px');
          background: #ccc;
          margin-top: 10px;
        }
      }
      .query-criteria {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .create-from {
          border: 1px solid #ddd;
          padding: 5px 10px;
          width: 80%;
          max-width: 1360px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          ul {
            width: 100%;
            height: 96%;
            display: flex;
            flex-wrap: wrap;
            li {
              width: calc(100% / 2);
              height: 36px;
              display: flex;
              span {
                width: 150px;
                height: 96%;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              section {
                flex: 1;
                height: 100%;
                padding: 0px 10px;
                display: flex;
                align-items: center;
                .el-select {
                  width: 100%;
                }
                .el-cascader {
                  width: 100%;
                }
              }
            }
            .last {
              width: 100%;
            }
          }
        }
        .footer-button {
          margin-top: 10px;
        }
      }
      .query-results {
        flex: 1;
        .table-content {
          height: calc(~'100% - 19px');
        }
      }
    }
  }
}
</style>
