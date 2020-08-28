<template>
  <div class="role-manage-import-box" id="holidayInquire">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>加班管理</el-breadcrumb-item>
          <el-breadcrumb-item>节假日加班人员管理</el-breadcrumb-item>
          <el-breadcrumb-item>查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <span @click="changeShow">
          查询条件
          <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
        <span class="rightLine"></span>
      </div>
      <div class="main-box" v-show="isShow">
        <div class="box-title">节假日加班人员申请查询</div>
        <div class="create-from">
          <ul>
            <li>
              <span>所属机构</span>
              <section>
                <el-select v-model="formData.favSelected" placeholder="请选择">
                  <el-option
                    v-for="item in favSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </section>
            </li>
            <li>
              <span>所属重点部位</span>
              <section>
                <el-select v-model="formData.favSelected" placeholder="请选择">
                  <el-option
                    v-for="item in favSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </section>
            </li>
            <li>
              <span>申请编号</span>
              <section>
                <el-input size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>加班地点</span>
              <section>
                <el-input size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>开始时间</span>
              <section>
                <el-date-picker size="small" type="date" style="width:100%" placeholder="选择时间"></el-date-picker>
              </section>
            </li>
            <li>
              <span>结束时间</span>
              <section>
                <el-date-picker size="small" type="date" style="width:100%" placeholder="选择时间"></el-date-picker>
              </section>
            </li>
            <li class="last">
              <span>加班事项</span>
              <section>
                <el-input size="small" v-model="formData.area" clearable></el-input>
              </section>
            </li>
            <li>
              <span>录入时间</span>
              <section>
                <el-input size="small" clearable></el-input>
              </section>
            </li>
            <li>
              <span>录入机构</span>
              <section>
                <el-select v-model="formData.favSelected" placeholder="请选择">
                  <el-option
                    v-for="item in favSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </section>
            </li>
            <li>
              <span>录入人</span>
              <section>
                <el-input size="small" clearable></el-input>
              </section>
            </li>
          </ul>
        </div>
        <div class="p-search-footer">
          <el-button type="primary" size="small" @click="query">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <el-button size="small" @click="exportFile">导出</el-button>
        </div>
      </div>
      <div>查询结果</div>
      <!-- 表格 -->
      <div class="table-box">
        <el-table
          stripe
          border
          size="medium"
          :data="tableData"
          @select="select"
          height="100%"
          max-height="770"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column
            v-for="(column, index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center"
            :resizable="true"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newForm',
  data() {
    return {
      isShow: true,
      formData: {
        favSelected: '',
        name: '',
        age: ''
      },
      tableData: [{
        mechanism: '12345',
        applicationId: '12345',
        key: '12345',
        keyUnits: '12345',
        location: '12345',
        startTime: '12345',
        endTime: '1234',
        peopleName: '12345',
        peopleques: '1234444',
        status: '已审批'
      }, {
        mechanism: '12345',
        applicationId: '12345',
        key: '12345',
        keyUnits: '12345',
        location: '12345',
        startTime: '12345',
        endTime: '1234',
        peopleName: '12345',
        peopleques: '1234444',
        status: '已审批'
      }],
      columns: [
        { prop: 'mechanism', sortable: true, label: '申请人', width: '' },
        { prop: 'applicationId', sortable: true, label: '申请编号', width: '' },
        { prop: 'key', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyUnits', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'location', sortable: true, label: '加班地点', width: '' },
        { prop: 'startTime', sortable: true, label: '开始时间', width: '' },
        { prop: 'endTime', sortable: true, label: '结束时间', width: '' },
        { prop: 'peopleName', sortable: true, label: '加班人员', width: '' },
        { prop: 'peopleques', sortable: true, label: '加班事项', width: '' },
        { prop: 'status', sortable: true, label: '审批状态', width: '' }
      ],
      favSelectData: [
        {
          value: '选项1',
          label: '自定义收藏夹'
        },
        {
          value: '选项2',
          label: 'aaaaaaa'
        },
        {
          value: '选项3',
          label: '新建收藏夹'
        }
      ]
    }
  },
  methods: {
    changeShow() {
      this.isShow = !this.isShow
    },
    select() {},
    query() {},
    reset() {
      this.formData = {
        favSelected: '',
        name: '',
        age: ''
      }
      // 重新查询
    },
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      let tHeader = [
        '申请人',
        '申请编号',
        '所属机构',
        '所属重点部位',
        '加班地点',
        '开始时间',
        '结束时间',
        '加班人员',
        '加班事项',
        '审批状态'
      ]
      // 字段名
      const filterVal = [
        'mechanism',
        'applicationId',
        'key',
        'keyUnits',
        'location',
        'startTime',
        'endTime',
        'peopleName',
        'peopleques',
        'status'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.tableData.length > 0) {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '查询列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="less" scoped>
#holidayInquire {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      height: 30px;
      color: #333333;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
    .main-box {
      width: 100%;
      height: calc(~'100%-30px');
      .box-title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
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
      .transfer {
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        max-width: 1360px;
        height: 580px;
        margin: 15px auto;
        display: flex;
        justify-content: space-around;
        section {
          width: 40%;
          height: 100%;
          h3 {
            text-align: center;
            background: #ebebeb;
            padding: 10px 0px;
          }
          .section {
            width: 100%;
            height: 520px;
            border: 1px solid #ededed;
            margin-top: 5px;
            overflow: auto;
          }
        }
      }
      .p-search-footer {
        // max-width: 1360px;
        padding-top: 10px;
        text-align: center;
      }
    }
    .table-box {
      width: 80%;
      margin: 0 auto;
    }
    .rightLine {
      display: inline-block;
      height: 1px;
      width: 90%;
      background-color: #000;
    }
  }
}
</style>
