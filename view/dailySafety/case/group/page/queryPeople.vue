<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
          <el-breadcrumb-item>群体性事件管理</el-breadcrumb-item>
          <el-breadcrumb-item>按人员所属区域查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            查询条件
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>

        <div class="main-box-center" v-show="isShow">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">
                <span>事故名称</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>发生机构</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-select v-model="formData.keyPartsName" placeholder="请选择事发机构" style="width:100%">
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>发生地点</span>
              </td>
              <td class="box-cell-input" colspan="5">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>事件类型</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-select v-model="formData.keyPartsName" placeholder="请选择事发机构" style="width:100%">
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title">
                <span>所属区域</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-select v-model="formData.keyPartsName" placeholder="请选择事发机构" style="width:100%">
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>参与总人数</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>及时劝返总人数</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>有过激行为总人数</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>缠访总人数</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer-button">
          <el-button size="small">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="exportFile('群体性事件管理按人员所属区域查询表')">导出</el-button>
        </div>

        <div class="query-results">
          <div class="box-title">
            <span class="pointer">查询结果</span>
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
              style="text-align:right;"
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
      formData: {
        orgName: '',
        keyPartsName: ''
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgName', label: '事故名称', width: '', sortable: 'true' },
        { prop: 'date', label: '发生时间', width: '', sortable: 'true' },
        { prop: 'name', label: '发生机构', width: '', sortable: 'true' },
        { prop: 'name', label: '发生地点', width: '', sortable: 'true' },
        { prop: 'name', label: '时间种类', width: '', sortable: 'true' },
        { prop: 'name', label: '总人数', width: '', sortable: 'true' },
        { prop: 'name', label: '及时劝返总人数', width: '', sortable: 'true' },
        { prop: 'name', label: '由过激行为总人数', width: '', sortable: 'true' },
        { prop: 'name', label: '缠访总人数', width: '', sortable: 'true' },
        { prop: 'name', label: '录入机构', width: '', sortable: 'true' },
        { prop: 'name', label: '录入人', width: '', sortable: 'true' },
        { prop: 'name', label: '录入时间', width: '', sortable: 'true' }
      ],
      tableData: [
        // 列表数据
        {
          index: 1,
          orgName: '2016-05-02',
          name: '王小虎',
          id: 1,
          date: '北京'
        },
        {
          index: 1,
          orgName: '2016-05-02',
          name: '王小虎',
          id: 1,
          date: '北京'
        },
        {
          index: 1,
          orgName: '2016-05-02',
          name: '王小虎',
          id: 1,
          date: '北京'
        },
        {
          index: 1,
          orgName: '2016-05-02',
          name: '王小虎',
          id: 1,
          date: '北京'
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
         '事故名称',
         '发生时间',
         '发生机构',
         '发生地点',
         '时间种类',
         '总人数',
         '及时劝返总人数',
         '由过激行为总人数',
         '缠访总人数',
         '录入机构',
         '录入人',
         '录入时间',
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'date',
        'name',
        'date',
        'name',
        'name',
        'name',
        'name',
        'name',
        'name',
        'name',
        'name'
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
  .el-button {
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
        margin-bottom: 10px;
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
      .footer-button {
        margin-top: 10px;
        text-align: center;
      }
      .query-results {
        flex: 1;
        .table-content {
          height: calc(~'100% - 19px');
        }
      }
      .main-box-center {
        border: 1px solid #ddd;
        padding: 1px;
        width: 60%;
        margin-left: 20%;
        table {
          width: 100%;
          height: 100%;
          tr {
            .box-cell-title {
              height: 36px;
              width: 16%;
              background: #eee;
              text-align: center;
              border: 0.5px solid #ddd;
            }
            .box-cell-input {
              // width: 16%;
              height: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
