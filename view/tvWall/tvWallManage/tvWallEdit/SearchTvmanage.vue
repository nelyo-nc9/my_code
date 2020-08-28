<template>
  <div class="content">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
        <el-breadcrumb-item>电视墙配置</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div style="width:100%;">
      <div class="box-title">
        <span class="pointer"
              @click="toggle">
          查询条件
          <i :class="isDropdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div v-show="isDropdown"
           class="form-box">
        <div class="condition-detail">
          <el-form ref="addForm"
                   size="mini"
                   :rules="rules"
                   :model="formData"
                   label-position="right"
                   label-width="120px"
                   class="form-contendTvWall">
            <el-form-item label="所属机构">
              <el-autocomplete class="inline-input"
                               size="mini"
                               v-model="orgName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                               placeholder="请输入机构"
                               :trigger-on-focus="false"
                               @select="val=>{selectItemMethod('org', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属重点部位">
              <el-autocomplete class="inline-input"
                               size="mini"
                               :disabled="!formData.orgId"
                               v-model="keyPartName"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                               placeholder="请输入重点部位"
                               :trigger-on-focus="false"
                               @select="val=>{selectItemMethod('kp', val)}"></el-autocomplete>
            </el-form-item>
            <el-form-item label="电视墙名称"
                          prop="name">
              <el-input v-model="formData.name"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="电视墙位置"
                          prop="position">
              <el-input v-model="formData.position"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="资产编码"
                          prop="assetCode">
              <el-input v-model="formData.assetCode"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="联动默认电视墙">
              <el-select size="mini"
                         v-model="formData.linkWallName"
                         @change="selectData(formData.linkWallName)">
                <el-option v-for="item in devBrandList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="录入机构"
                          prop="updatedDept">
              <el-input v-model="formData.updatedDept"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="录入人"
                          prop="updatedBy">
              <el-input v-model="formData.updatedBy"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="录入时间">
              <el-date-picker v-model="inputCreatedAt"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div style="width:100%;text-align:center;">
          <el-button size="small"
                     type="primary"
                     @click="theQuery">查询</el-button>
          <el-button size="small"
                     @click="resetMethod">重置</el-button>
          <el-button size="small"
                     @click="exportMethod">导出</el-button>
        </div>
      </div>
    </div>
    <div class="table-box"
         ref="tableBox">
      <div class="box-title">查询结果</div>
      <div style="position:absolute;top:40px;width:100%;">
        <el-table :data="tableData"
                  size="mini"
                  border
                  @selection-change="handleSelectionChange"
                  :height="tableHeight">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="orgName"
                           label="所属机构"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="keyPartName"
                           label="所属重点部位"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="name"
                           label="电视墙名称"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="position"
                           label="电视墙位置"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="linkWallName"
                           label="联动默认电视墙"
                           width="140"></el-table-column>
          <el-table-column prop="assetCode"
                           label="资产编码"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy"
                           label="录入人"></el-table-column>
          <el-table-column prop="updatedDept"
                           label="录入机构"></el-table-column>
          <el-table-column prop="updatedAt"
                           label="录入时间"></el-table-column>
        </el-table>
        <el-pagination style="text-align:right;"
                       :current-page="pageInfo.page"
                       :page-size="pageInfo.limit"
                       :page-sizes="[10, 20, 30, 50]"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageInfo.total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/access/accessMan'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  components: { treeBox },
  data() {
    return {
      rules: {
        name: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        position: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        updatedDept: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        updatedBy: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ]
      },
      multipleSelection: [],
      pageInfo: {
        // 页码组件返回参数
        limit: 50,
        page: 1,
        total: 0 // 总页码
      },
      treeType: 3,
      nameLable: '',
      isDropdown: true,
      tableHeight: 200,
      tableData: [],
      inputCreatedAt: [],
      orgName: '',
      keyPartName: '',
      formData: {
        // 查询条件字段
        page: 1,
        limit: 50,
        never: '',
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        linkWall: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: '',
        assetCode: '',
        linkWallName: '',
        startTime: '',
        endTime: ''
      },
      devBrandList: [
        // 默认联动电视墙下拉选项
        { label: '全部', value: '全部' },
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      devModelList: [
        // ip下拉选项
        { label: '全部', value: '全部' },
        { label: '192.168.101.70', value: '192.168.101.70' },
        { label: '192.168.20.7', value: '192.168.20.7' }
      ]
    }
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  methods: {
    ...mapActions(['getTvWallListApi']),
    getTree(params) {
      return getTreeApi(params)
    },
    // 选中 机构/重点部位 下拉选
    selectItemMethod(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 电视墙查询列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 电视墙查询列表导出
    exportMethod() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '电视墙名称',
        '电视墙位置',
        '联动默认电视墙',
        '资产编码',
        '录入人',
        '录入机构',
        '录入时间'
      ]
      // 字段名
      const filterVal = [
        'orgName',
        'keyPartName',
        'name',
        'position',
        'linkWallName',
        'assetCode',
        'updatedBy',
        'updatedDept',
        'updatedAt'
      ]
      let list = []
      // 导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 79
      })
    },
    toggle() {
      this.isDropdown = !this.isDropdown
      this.changeTableHeight()
    },
    selectData(val) {
      if (val === '是') {
        this.formData.linkWall = 1
      } else if (val === '否') {
        this.formData.linkWall = 2
      } else {
        this.formData.linkWall = ''
      }
    },
    selectData1(val) {
      if (val === '全部') {
        this.formData.server = ''
      }
    },
    resetMethod() { // 重置
      this.inputCreatedAt = []
      this.orgName = ''
      this.keyPartName = ''
      this.formData = {
        page: 1,
        limit: 50,
        never: '',
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        linkWall: '',
        updatedDept: '',
        updatedBy: '',
        updatedAt: '',
        assetCode: '',
        linkWallName: '',
        startTime: '',
        endTime: ''
      }
      this.theQuery()
    },
    theQuery() { // 确认查询
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.formData.startTime = this.inputCreatedAt[0] !== undefined ? this.$moment(this.inputCreatedAt[0]).format('YYYY-MM-DD HH:mm:ss') : ''
          this.formData.endTime = this.inputCreatedAt[1] !== undefined ? this.$moment(this.inputCreatedAt[1]).format('YYYY-MM-DD HH:mm:ss') : ''
          this.formData.page = this.pageInfo.page
          this.formData.limit = this.pageInfo.limit
          this.getTvWallListApi(this.formData)
            .then(res => {
              if (res.data.code === 0) {
                this.tableData = res.data.data.results
                this.tableData.map(item => {
                  item['linkWallName'] =
                    item.linkWall === 1 ? '是' : item.linkWall === 2 ? '否' : ''
                })
                this.pageInfo.total = Number(res.data.data.total)
              } else {
                this.tableData = []
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 分页（修改数量）
    handleSizeChange(val) {
      this.pageInfo.page = 1
      this.pageInfo.limit = val
      this.getTvwallList(1)
    },

    // 分页（修改页码）
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.getTvwallList(1)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeTableHeight)
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  position: relative;
  font-size: 14px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    margin: 10px 0;
    i {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 120px;
      margin-top: -12px;
    }
  }
  .pointer {
    cursor: pointer;
    display: inline-block;
    width: 120px;
  }
  .form-box {
    width: 100%;
    .condition-detail {
      width: 100%;
      margin: 10px auto;
      border: 1px solid #e1e1e1;
      background: #f5f5f5;
      padding: 13px 35px 5px 5px;
      display: flex;
      flex-wrap: wrap;
      .form-contendTvWall {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        /deep/ .el-form-item--mini.el-form-item {
          margin-bottom: 14px;
          width: 25%;
          height: 35px;
          line-height: 35px;
          /deep/.el-date-editor.el-input {
            width: 100%;
          }
          /deep/.el-select {
            width: 100%;
          }
          /deep/ .el-autocomplete {
            width: 100%;
          }
          /deep/ .el-range-editor--mini.el-input__inner {
            width: 100%;
          }
          /deep/ .el-range-editor--mini .el-range-separator {
            line-height: 26px;
            width: 10%;
            padding: 0;
          }
        }
      }
    }
  }
  .table-box {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
