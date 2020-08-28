<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
          <el-breadcrumb-item>群体性事件管理</el-breadcrumb-item>
          <el-breadcrumb-item>统计</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            统计条件
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>

        <div class="main-box-center" v-show="isShow">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">
                <span>发生机构</span>
              </td>
              <td class="box-cell-input" style="width:500px">
                <el-select v-model="formData.keyPartsName" placeholder="请选择发生机构" style="width:100%">
                  <el-option value="发生机构1"></el-option>
                  <el-option value="发生机构2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title">
                <span>发生时间</span>
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
          <el-button size="small">统计</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="exportFile('安全事故信息管理统计表')">导出</el-button>
        </div>

        <div class="query-results">
          <div class="box-title">
            <span class="pointer">统计结果</span>
          </div>
          <div class="table-content">
            <p style="text-align: center;margin-bottom: 15px;">群体性事件上访人次统计表</p>
            <el-table :data="tableData" show-summary="true" sum-text="合计" align="center">
              <el-table-column prop="name" label="序号" width="120" align="center"></el-table-column>
              <el-table-column prop="name" label="发生机构" width="120" align="center"></el-table-column>
              <el-table-column label="批次" align="center">
                <el-table-column prop="province" label="0-4人" align="center"></el-table-column>
                <el-table-column prop="city" label="5-49人" align="center"></el-table-column>
                <el-table-column prop="address" label="50-99人" align="center"></el-table-column>
                <el-table-column prop="zip" label="100人" align="center"></el-table-column>
              </el-table-column>
              <el-table-column prop="province" label="参与人数" width="120" align="center"></el-table-column>
              <el-table-column prop="city" label="及时劝返人数" width="120" align="center"></el-table-column>
              <el-table-column prop="address" label="有过激行为人数" width="120" align="center"></el-table-column>
              <el-table-column prop="zip" label="缠访人数" width="120" align="center"></el-table-column>
            </el-table>
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
      isShow: true, // 查询条件显隐
      formData: {
        orgName: '',
        keyPartsName: ''
      },
      tableData: [
        {
          name: '王小虎',
          province: '1',
          city: '1',
          address: '1',
          zip: 1
        },
        {
          name: '王小虎',
          province: '2',
          city: '2',
          address: '2',
          zip: 2
        },
        {
          name: '王小虎',
          province: '2',
          city: '3',
          address: '3',
          zip: 3
        }
      ]
    }
  },
  mounted() {},
  methods: {
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
        '发生机构',
        '0-4人',
        '5-49人',
        '50-99人',
        '100人',
        '参与人数',
        '及时劝返总人数',
        '由过激行为总人数',
        '缠访总人数'
      ]
      // 字段名
      const filterVal = ['name', 'province', 'city', 'address', 'zip', 'province', 'city', 'address', 'zip']
      let list = []
      list = this.tableData
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
          border: none;
          width: 60%;
          margin-left: 20%;
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
              height: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
