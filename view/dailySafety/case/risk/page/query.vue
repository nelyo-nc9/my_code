<template>
  <div class="content-page">
    <div class="right-content">
      <div class="top-box">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item>案(事)件管理</el-breadcrumb-item>
          <el-breadcrumb-item>案(事)件及风险事件管理</el-breadcrumb-item>
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
                <span>案(事)件名称</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title">
                <span>案(事)发机构</span>
              </td>
              <td class="box-cell-input" colspan="2">
                <el-select
                  v-model="formData.keyPartsName"
                  placeholder="请选择演练种类"
                  style="width: 435px;"
                >
                  <el-option value="演练种类1"></el-option>
                  <el-option value="演练种类2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>案(事)发时间</span>
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
                <span>案(事)件类别</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="请选择案(事)件类别">
                  <el-option value="案(事)件类别1"></el-option>
                  <el-option value="案(事)件类别2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>案(事)件级别</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="案(事)件级别">
                  <el-option value="案(事)件级别1"></el-option>
                  <el-option value="案(事)件级别2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title">
                <span>案(事)件分类</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="案(事)件分类">
                  <el-option value="案(事)件分类1"></el-option>
                  <el-option value="案(事)件分类2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title">
                <span>涉案事项</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="涉案事项">
                  <el-option value="涉案事项1"></el-option>
                  <el-option value="涉案事项2"></el-option>
                </el-select>
              </td>
            </tr>

            <tr>
              <td class="box-cell-title">
                <span>涉案金额(万元)</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
              <td class="box-cell-title">
                <span>挽回损失(万元)</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>风险金额(万元)</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
              <td class="box-cell-title">
                <span>死亡人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>行内死亡人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
              <td class="box-cell-title">
                <span>行外死亡人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>受伤人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
              <td class="box-cell-title">
                <span>行内受伤人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>行外受伤人数</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最少"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName" placeholder="最多"></el-input>
              </td>
            </tr>

            <tr>
              <td class="box-cell-title" colspan="2">
                <span>是否被媒体报道</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="是否被媒体报道">
                  <el-option value="是否被媒体报道1"></el-option>
                  <el-option value="是否被媒体报道2"></el-option>
                </el-select>
              </td>
              <td class="box-cell-title" colspan="2">
                <span>监管部门是否知情</span>
              </td>
              <td class="box-cell-input">
                <el-select v-model="formData.keyPartsName" placeholder="监管部门是否知情">
                  <el-option value="监管部门是否知情1"></el-option>
                  <el-option value="监管部门是否知情2"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title" colspan="2">
                <span>基本案情</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
              <td class="box-cell-title" colspan="2">
                <span>处置措施</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="formData.orgName"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title" colspan="2">
                <span>处置结果</span>
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
          <el-button size="small" @click="exportFile('案(事)件及风险事件管理查询表')">导出</el-button>
        </div>

        <div class="query-results">
          <div class="box-title">
            <span class="pointer">查询结果</span>
          </div>
          <div class="table-content">
            <el-table
              :data="tableData"
              border
              stripe
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
                sortable
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
        { prop: 'orgName', label: '案(事)件名称', width: '', sortable: 'true' },
        { prop: 'name', label: '案(事)发机构', width: '', sortable: 'true' },
        { prop: 'name', label: '案(事)发时间', width: '', sortable: 'true' },
        { prop: 'date', label: '案(事)件类别', width: '', sortable: 'true' },
        { prop: 'date', label: '案(事)件级别', width: '', sortable: 'true' },
        { prop: 'name', label: '案(事)件分类', width: '', sortable: 'true' },
        { prop: 'name', label: '涉案事项', width: '', sortable: 'true' },
        { prop: 'name', label: '涉案金额(万元)', width: '', sortable: 'true' },
        { prop: 'name', label: '挽回损失(万元)', width: '', sortable: 'true' },
        { prop: 'name', label: '风险金额(万元)', width: '', sortable: 'true' },
        { prop: 'name', label: '死亡人数', width: '', sortable: 'true' },
        { prop: 'name', label: '行内死亡人数', width: '', sortable: 'true' },
        { prop: 'name', label: '行外死亡人数', width: '', sortable: 'true' },
        { prop: 'name', label: '受伤人数', width: '', sortable: 'true' },
        { prop: 'name', label: '行内受伤人数', width: '', sortable: 'true' },
        { prop: 'name', label: '行外受伤人数', width: '', sortable: 'true' },
        { prop: 'name', label: '是否被媒体报道', width: '', sortable: 'true' },
        { prop: 'name', label: '监管部门是否知情', width: '', sortable: 'true' }
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
        '案(事)件名称',
        '案(事)发机构',
        '案(事)发时间',
        '案(事)件类别',
        '案(事)件级别',
        '案(事)件分类',
        '涉案事项',
        '涉案金额(万元)',
        '挽回损失(万元)',
        '风险金额(万元)',
        '死亡人数',
        '行内死亡人数',
        '行外死亡人数',
        '受伤人数',
        '行内受伤人数',
        '行外受伤人数',
        '是否被媒体报道',
        '监管部门是否知情'
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
        margin-bottom: 20px;
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
    }
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
        width: 16.3%;
        background: #eee;
        text-align: center;
        border: 0.5px solid #ddd;
      }
      .box-cell-input {
        width: 16.3%;
        height: 36px;
      }
    }
  }
}
</style>
