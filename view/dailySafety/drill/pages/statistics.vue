<template>
  <div class="content-page">
    <div class="top-box">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item>演练管理</el-breadcrumb-item>
        <el-breadcrumb-item>统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="create-from">
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td class="box-cell-title">
            <span>演练机构</span>
            <span style="color: red">*</span>
          </td>
          <td class="box-cell-input" colspan="5">
            <el-input v-model="formData.orgName"></el-input>
          </td>
        </tr>
        <tr>
          <td class="box-cell-title">
            <span>演练时间</span>
          </td>
          <td class="box-cell-input">
            <el-input v-model="formData.startTime"></el-input>
          </td>

          <td class="box-cell-title">
            <span>至</span>
          </td>
          <td class="box-cell-input">
            <el-input v-model="formData.overTime"></el-input>
          </td>
        </tr>
      </table>
    </div>

    <div class="footer-button">
      <el-button size="small">统计</el-button>
      <el-button size="small" @click="reset">重置</el-button>
      <el-button size="small" @click="exportFile('演练管理统计表格')">导出</el-button>
    </div>

    <div class="box-title">
      <span class="pointer">演练统计</span>
      <ul>
        <li style="background: #eee;">演练次数</li>
        <li>50</li>
        <li></li>
        <li></li>
      </ul>
    </div>

    <div class="box-title">
      <span class="pointer">演练分类统计</span>
      <ul>
        <li style="background: #eee;"></li>
        <li style="background: #eee;">总计</li>
        <li style="background: #eee;">形式案件</li>
        <li style="background: #eee;">安全生产</li>
        <li style="background: #eee;">自然灾害</li>
        <li style="background: #eee;">综合</li>
      </ul>
      <ul>
        <li style="background: #eee;">数量</li>
        <li>50</li>
        <li>10</li>
        <li>20</li>
        <li>10</li>
        <li>10</li>
      </ul>
      <ul>
        <li style="background: #eee;">占比</li>
        <li>100%</li>
        <li>20%</li>
        <li>40%</li>
        <li>20%</li>
        <li>20%</li>
      </ul>
    </div>

    <div class="box-title">
      <span class="pointer">演练人数分布</span>
      <ul>
        <li style="background: #eee;"></li>
        <li style="background: #eee;">总计</li>
        <li style="background: #eee;">0-500</li>
        <li style="background: #eee;">500-1000</li>
        <li style="background: #eee;">1000-5000</li>
        <li style="background: #eee;">
          5000
          <i class="el-icon-arrow-left"></i>
        </li>
      </ul>
      <ul>
        <li style="background: #eee;">数量</li>
        <li>50</li>
        <li>10</li>
        <li>20</li>
        <li>10</li>
        <li>10</li>
      </ul>
      <ul>
        <li style="background: #eee;">占比</li>
        <li>100%</li>
        <li>20%</li>
        <li>40%</li>
        <li>20%</li>
        <li>20%</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //统计表单
      formData: {
        orgName: '',
        startTime: '',
        overTime: ''
      }
    }
  },
  mounted() {},
  methods: {
    // 重置按钮
    reset() {
      for (var index in this.formData) {
        this.formData[index] = ''
      }
    },
    // 导出
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = ['..','总计', '形式案件', '安全生产', '自然灾害', '综合']
      // 字段名
      const filterVal = ['..','subsystem', 'subsystem', 'keySite', 'index', 'subsystem']
      let list = []

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
  padding: 5px 20px 0 20px;
  display: flex;
  flex-direction: column;
  .create-from {
    border: 1px solid #ddd;
    padding: 5px 10px;
    width: 80%;
    max-width: 1360px;
    margin-top: 30px;
    position: relative;
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
          height: 36px;

          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
  .footer-button {
    margin-top: 20px;
    margin-left: 600px;
  }
  .box-title {
    width: 100%;
    .pointer {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 100px;
        margin-top: -12px;
      }
    }
    ul {
      padding: 0 80px;
      width: 100%;
      height: 36px;
      display: flex;
      li {
        flex: 1;
        text-align: center;
        line-height: 36px;
        border: 1px solid #fff;
      }
    }
  }
}
</style>
