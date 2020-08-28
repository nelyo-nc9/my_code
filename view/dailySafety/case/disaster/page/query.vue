<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
          <el-breadcrumb-item>自然灾害信息管理</el-breadcrumb-item>
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

        <div class="main-box-center" v-show="isShow">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">
                <span>灾害名称</span>
              </td>
              <td class="box-cell-input" colspan="3">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>事发机构</span>
              </td>
              <td class="box-cell-input" colspan="3">
                <el-select v-model="formData.keyPartsName" placeholder="请选择事发机构" style="width:100%">
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>事发时间</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" style="width: 100%;"></el-input>
              </td>
              <td class="box-cell-title">
                <span>灾害类别</span>
              </td>
              <td class="box-cell-input" colspan="3">
                <el-select v-model="formData.keyPartsName" placeholder="请选择事发机构" style="width:100%">
                  <el-option value="事发机构1"></el-option>
                  <el-option value="事发机构2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>灾害等级</span>
              </td>
              <td class="box-cell-input" colspan="3">
                <el-select v-model="formData.keyPartsName" placeholder="请选择灾害等级" style="width:100%">
                  <el-option value="灾害等级1"></el-option>
                  <el-option value="灾害等级2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title">
                <span>受影响部位数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" style="width: 100%;"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>停业部位数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>受伤人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>死亡人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>损失金额</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>设备损坏数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
               <td class="box-cell-title">
                <span>至</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer-button">
          <el-button size="small">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="exportFile('自然灾害信息管理查询表')">导出</el-button>
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
        { prop: 'orgName', label: '灾害名称', width: '', sortable: 'true' },
        { prop: 'date', label: '事发机构', width: '', sortable: 'true' },
        { prop: 'name', label: '事发时间', width: '', sortable: 'true' },
        { prop: 'name', label: '灾害类别', width: '', sortable: 'true' },
        { prop: 'name', label: '灾害等级', width: '', sortable: 'true' },
        { prop: 'name', label: '受影响部位数', width: '', sortable: 'true' },
        { prop: 'name', label: '停业部位数', width: '', sortable: 'true' },
        { prop: 'name', label: '受伤人数', width: '', sortable: 'true' },
        { prop: 'name', label: '伤亡人数', width: '', sortable: 'true' },
        { prop: 'name', label: '损失金额(万元)', width: '', sortable: 'true' },
        { prop: 'name', label: '损失设备数', width: '', sortable: 'true' }
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
        '灾害名称',
        '事发机构',
        '事发时间',
        '灾害类别',
        '灾害等级',
        '受影响部位',
        '停业部位数',
        '受伤人数',
        '伤亡人数',
        '损失金额(元)',
        '损失设备数'
      ]
      // 字段名
      const filterVal = ['orgName', 'date', 'name', 'date', 'name', 'name', 'name', 'name', 'name', 'name', 'name']
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
              width: 12.4%;
              background: #eee;
              text-align: center;
              border: 0.5px solid #ddd;
            }
            .box-cell-input {
              width: 12.3%;
              height: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
