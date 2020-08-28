<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>施工报备</el-breadcrumb-item>
          <el-breadcrumb-item>施工巡查记录</el-breadcrumb-item>
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
                <span>所属机构*</span>
                <section>
                  <el-select v-model="formData.orgName" size="small" clearable>
                    <el-option value="江苏支行"></el-option>
                    <el-option value="北京支行"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>所属重点部位*</span>
                <section>
                  <el-select v-model="formData.keyPartsName" size="small" clearable>
                     <el-option value="重点部位1"></el-option>
                    <el-option value="重点部位2"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>单号</span>
                <section>
                  <el-input v-model="formData.applyNumber" size="small" clearable></el-input>
                </section>
              </li>
             
              <li>
                <span>施工单位</span>
                <section>
                  <el-input v-model="formData.company" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>施工类型</span>
                <section>
                  <el-select v-model="formData.type" size="small" clearable>
                     <el-option value="施工类型1"></el-option>
                    <el-option value="施工类型2"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>巡查日期*</span>
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
                <span>巡查备注信息*</span>
                <section>
                  <el-input v-model="formData.careful" size="small" clearable></el-input>
                </section>
              </li>
              <li>
                <span>巡查人*</span>
                <section>
                  <el-input v-model="formData.careful" size="small" clearable></el-input>
                </section>
              </li>
            </ul>
          </div>

          <div class="footer-button">
            <el-button>查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
            <el-button size="small" @click="exportFile('查询表')">导出</el-button>
          </div>
        </div>
        <div class="query-results">
          <div>
            <div class="top-name">
              <span class="name">查询结果</span>
              <span class="border-span"></span>
            </div>
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
        { prop: 'subsystem', label: '所属机构', sortable: 'true' },
        { prop: 'subsystem', label: '所属重点部位', sortable: 'true' },
        { prop: 'keySite', label: '单号', sortable: 'true' },
        { prop: 'deviceName', label: '施工单位', sortable: 'true' },
        { prop: 'deviceName', label: '施工区域', sortable: 'true' },
        { prop: 'deviceName', label: '施工类型', sortable: 'true' },
        { prop: 'deviceName', label: '巡查时间', sortable: 'true' },
        { prop: 'deviceName', label: '巡查备注信息', sortable: 'true' },
        { prop: 'deviceName', label: '巡查人', sortable: 'true' },
        { prop: 'index', label: '附件', sortable: 'true' }
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
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '所属机构',
        '所属重点部位',
        '单号',
        '施工单位',
        '施工区域',
        '施工类型',
        '巡查时间',
        '巡查备注信息',
        '巡查人',
        '附件'
      ]
      // 字段名
      const filterVal = [
        'subsystem',
        'subsystem',
        'keySite',
        'deviceType',
        'deviceName',
        'deviceName',
        'deviceName',
        'deviceName',
        'deviceName',
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
