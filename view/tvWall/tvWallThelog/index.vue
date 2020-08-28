
<template>
  <div class="log-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
        <el-breadcrumb-item>操作日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="content-box">
        <div class="condition-box">
          <div class="condition-detail">
            <el-form ref="addForm"
                     size="mini"
                     :rules="rules"
                     :model="formInline"
                     label-position="right"
                     label-width="120px"
                     class="form-contend">
              <el-form-item label="姓名"
                            prop="name">
                <el-input v-model="formInline.name"
                          placeholder=""
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item label="用户"
                            prop="userName">
                <el-input v-model="formInline.userName"
                          placeholder=""
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item label="所属机构">
                <el-autocomplete class="inline-input"
                                 size="mini"
                                 v-model="orgName"
                                 value-key="name"
                                 :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                                 placeholder="请输入机构"
                                 :trigger-on-focus="false"
                                 @select="val=>{selectItemMethod('org', val)}"></el-autocomplete>
                <!-- <el-select v-model="formInline.orgId"
                           size="mini">
                  <el-option :value="formInline.orgId"
                             :label="nameLable"
                             style="height:200px;background:#fff;">
                    <treeBox ref="treeDiv"
                             :lazyTreeApi="getTree"
                             :treeType="treeType"
                             treeLazyToggle
                             iconToggle
                             @clickData="playBackGetData">
                    </treeBox>
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="客户端类型">
                <el-select v-model="formInline.clientType"
                           size="mini">
                  <el-option v-for="(item, index) in clientTypeData"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="IP地址"
                            prop="ip">
                <el-input v-model="formInline.ip"
                          placeholder=""
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item label="操作类型">
                <el-select v-model="formInline.operateType "
                           placeholder="全部"
                           size="mini">
                  <el-option v-for="item in operatorTypeData"
                             :key="item.key"
                             :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作对象"
                            prop="object">
                <el-input v-model="formInline.object"
                          placeholder=""
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item label="操作描述"
                            prop="description">
                <el-input v-model="formInline.description"
                          placeholder=""
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="formInline.startTime"
                                type="datetime"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                align="right"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="formInline.endTime"
                                type="datetime"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                align="right"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="opt-button">
            <el-button type="primary"
                       @click="inquireClick"
                       size="small">查询</el-button>
            <el-button @click="resetClick"
                       type=""
                       size="small">重置</el-button>
            <el-button @click="exportClick"
                       type=""
                       size="small">导出</el-button>
          </div>
        </div>
        <div class="result-box">
          <el-table stripe
                    border
                    size="medium"
                    :data="tableData"
                    @select="select"
                    height="510"
                    max-height="805"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column type="selection"
                             width="55"
                             align="center"></el-table-column>
            <el-table-column label="序号"
                             type="index"
                             width="80"
                             align="center"> </el-table-column>
            <el-table-column v-for="(column, index) in columns"
                             :key="index"
                             :prop="column.prop"
                             :label="column.label"
                             :width="column.width"
                             :sortable="column.sortable"
                             show-overflow-tooltip
                             align="center"
                             :resizable="resizable">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageInfo.page"
                         :page-sizes="[10, 20, 30, 50]"
                         :page-size="50"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="pageInfo.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  components: { treeBox },
  data() {
    return {
      rules: {
        name: [
          { min: 1, max: 128, message: '长度在1到128个字符' }
        ],
        userName: [
          { min: 1, max: 128, message: '长度在1到128个字符' }
        ],
        ip: [
          { min: 1, max: 128, message: '长度在1到128个字符' },
          { pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/, message: '请输入合法的IP' }
        ],
        object: [
          { min: 1, max: 128, message: '长度在1到128个字符' }
        ],
        description: [
          { min: 1, max: 128, message: '长度在1到128个字符' }
        ]
      },
      resizable: false,
      treeType: 3,
      nameLable: '',
      columns: [
        { prop: 'name', sortable: true, label: '姓名', width: '' },
        { prop: 'userName', sortable: true, label: '用户名', width: '' },
        { prop: 'createdAt', sortable: true, label: '时间', width: '' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '' },
        { prop: 'clientName', sortable: true, label: '客户端类型', width: '' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '' },
        { prop: 'operateName', sortable: true, label: '操作类型', width: '' },
        { prop: 'action', sortable: true, label: '动作', width: '' },
        { prop: 'object', sortable: true, label: '操作对象', width: '' },
        { prop: 'result', label: '操作结果', width: '' },
        { prop: 'description', label: '操作描述', width: '' }
      ],
      pageInfo: {
        // 页码组件返回参数
        limit: 50,
        page: 1,
        total: 0 // 总页码
      },
      orgName: '',
      formInline: {
        page: 1,
        limit: 50,
        moduletype: 7,
        operateType: null,
        clientType: null
      },
      // 客户端类型
      clientTypeData: [
        { value: '', label: '全部' },
        { value: '1', label: 'B/S' },
        { value: '2', label: 'APP' }
      ],
      // 操作类型
      operatorTypeData: [
        {
          key: 70000,
          value: 'TV_WALL_SETTING',
          label: '电视墙配置'
        },
        {
          key: 70001,
          value: 'TV_WALL_DECODER_SETTING',
          label: ' 解码设备配置'
        },
        {
          key: 70002,
          value: 'TV_WALL_LED_SETTING',
          label: ' LED设备配置'
        },
        {
          key: 70003,
          value: 'TV_WALL_FAVORITE_MANAGE',
          label: '收藏夹管理'
        },
        {
          key: 70004,
          value: 'TV_WALL_PART_MANAGE',
          label: '分区管理'
        },
        {
          key: 70005,
          value: 'TV_WALL_LAYOUT_MANAGE',
          label: '布局管理'
        },
        {
          key: 70006,
          value: 'TV_WALL_POLLING_MANAGE',
          label: '轮巡组管理'
        },
        {
          key: 70007,
          value: 'TV_WALL_SCENE_MANAGE',
          label: '场景管理'
        },
        {
          key: 70008,
          value: 'TV_WALL_PLAN_MANAGE ',
          label: '预案管理'
        },
        {
          key: 70009,
          value: 'TV_WALL_WND_MANAGE ',
          label: '窗口操作'
        },
        {
          key: 70010,
          value: 'TV_WALL_CHANNEL_CONTROL  ',
          label: '解码通道控制'
        },
        {
          key: 70011,
          value: 'TV_WALL_WALL_CONTROL ',
          label: '电视墙控制'
        }
      ],
      tableData: [],
      multipleSelection: [],
      // 选中id
      isId: []
    }
  },
  created() {
    // this.getqueryDataDictBasicInfo()
  },
  methods: {
    ...mapActions(['queryDataDictBasicInfo', 'getTvWallLogApi']),
    /**
     * 查询按钮
     * @method inquireClick
     */
    inquireClick() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.formInline.page = this.pageInfo.page
          this.formInline.limit = this.pageInfo.limit
          this.getTvWallLogApi(this.formInline)
            .then(res => {
              const result = res.data.data.logs
              console.log(result)
              Array.isArray(result) &&
                result.map(item => {
                  item.snapshotTime = this.$moment(item.snapshotTime).format('YYYY-MM-DD hh:mm:ss')
                })
              this.tableData = result
              this.pageInfo.total = Number(res.data.data.page.totalNumber)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 选中 机构/重点部位 下拉选
    selectItemMethod(type, val) {
      if (type === 'org') {
        this.formInline.orgId = val.id
        this.orgName = val.name
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
    // 数据字典获取
    // getqueryDataDictBasicInfo() {
    //   this.queryDataDictBasicInfo({
    //     queryList: [
    //       {
    //         type: '2',
    //         moduleId: '1',
    //         childModuleId: '8',
    //         dictId: '8'
    //       }
    //     ]
    //   }).then(res => {
    //     console.log(res.data.data, 'res.data[0].attr')
    //     this.operatorTypeData = res.data.data[0].attr
    //   })
    // },
    getTree(params) {
      return getTreeApi(params)
    },
    playBackGetData(data) {
      this.nameLable = data.name
      this.formInline.orgId = data.serial
    },
    /**
     * 重置
     * @method resetClick
     */
    resetClick() {
      this.orgName = ''
      this.formInline = {
        page: 1,
        limit: 50,
        moduletype: 7,
        operateType: null,
        clientType: null
      }
      this.inquireClick()
    },
    // 日志查询列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 导出
     * @method exportClick
     */
    exportClick() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      const tHeader = [
        '姓名',
        '用户名',
        '时间',
        '所属机构',
        '客户端类型',
        'IP地址',
        '操作类型',
        '动作',
        '操作对象',
        '操作结果',
        '操作描述'
      ]
      const filterVal = [
        'name',
        'userName',
        'createdAt',
        'orgName',
        'clientName',
        'ip',
        'operateName',
        'action',
        'object',
        'result',
        'description'
      ]
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '电视墙操作日志')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    select(s, row) {
      this.selectData = s
    },
    /**
     * 查询列表每页显示条数
     * @method handleSizeChange
     */
    handleSizeChange(val) {
      this.pageInfo.page = 1
      this.pageInfo.limit = val
      this.inquireClick()
    },
    /**
     * 查询列表分页
     * @method handleCurrentChange
     */
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.inquireClick()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/elementModify.less';
.log-box {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  .header {
    margin-bottom: 10px;
  }
  .main {
    width: 100%;
    height: calc(~'100% - 24px');
    /deep/ .el-tabs--border-card {
      height: 100%;
    }
    .content-box {
      width: 100%;
      height: 100%;
      .condition-box {
        width: 100%;
        .condition-detail {
          width: 100%;
          margin: 10px auto;
          border: 1px solid #e1e1e1;
          background: #f5f5f5;
          padding: 13px 35px 5px 5px;
          display: flex;
          flex-wrap: wrap;
          .form-contend {
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
            }
          }
        }
        .opt-button {
          text-align: center;
          margin-top: 16px;
        }
      }
      .result-box {
        width: 100%;
        height: calc('100% - 300px');
        margin-top: 30px;
        .el-pagination {
          float: right;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
