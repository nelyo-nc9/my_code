
<template>
  <div class="log-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>停车管理</el-breadcrumb-item>
        <el-breadcrumb-item>停车日志管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="content-box">
        <div class="condition-box">
          <div class="condition-detail">
            <div class="condition-detail-item">
              <div class="condition-item-label">姓名</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.name"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">用户</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.userId"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">所属机构</div>
              <div class="condition-item-value">
                <el-select v-model="formInline.orgId"
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
                </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">客户端类型</div>
              <div class="condition-item-value">
                <el-select v-model="formInline.clientType"
                           size="mini">
                  <el-option v-for="(item, index) in clientTypeData"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">IP地址</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.ip"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">操作类型</div>
              <div class="condition-item-value">
                <el-select v-model="formInline.operatorType"
                           placeholder="全部"
                           size="mini">
                  <el-option v-for="(item, index) in operatorTypeData"
                             :key="index"
                             :label="item.data"
                             :value="item.sortSerialNum"></el-option>
                </el-select>
              </div>
            </div>
             <div class="condition-detail-item">
              <div class="condition-item-label">操作对象</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.operatorObj"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
             <div class="condition-detail-item">
              <div class="condition-item-label">操作描述</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.operatorText"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">开始时间</div>
              <div class="condition-item-value">
                <el-date-picker v-model="formInline.startTime"
                                type="datetime"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                align="right"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">结束时间</div>
              <div class="condition-item-value">
                <el-date-picker v-model="formInline.endTime"
                                type="datetime"
                                align="right"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </div>
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
                    height="550"
                    max-height="805"
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
                         :current-page="hostCurrentPage"
                         :page-sizes="[100, 140, 300, 400]"
                         :page-size="100"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="hostTotal">
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
export default {
  components: { treeBox },
  data() {
    return {
      resizable: false,
      treeType: 3,
      nameLable: '',
      columns: [
        { prop: 'name', sortable: true, label: '姓名', width: '' },
        { prop: 'userId', sortable: true, label: '用户名', width: '' },
        { prop: 'startTime', sortable: true, label: '时间', width: '' },
        { prop: 'orgId', sortable: true, label: '所属机构', width: '' },
        { prop: 'clientType', sortable: true, label: '客户端类型', width: '' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '' },
        { prop: 'operatorType', sortable: true, label: '操作类型', width: '' },
        { prop: 'action', sortable: true, label: '动作', width: '' },
        { prop: 'operatorObj', sortable: true, label: '操作对象', width: '' },
        { prop: 'operatorRes', label: '操作结果', width: '' },
        { prop: 'operatorDis', label: '操作描述', width: '' }
      ],
      formInline: {
        // orgId: 111,
        // keyPartId: 222,
        // platformId: 333,
        // hostName: 'qwer',
        // startTime: '2020-07-02 17:27:38',
        // endTime: '2020-07-04 17:27:38'
        operatorType: '1',
        clientType: '1'
      },
      // 所属重点部位
      positionData: [
        { value: 'xxx金库', label: 'xxx金库' },
        { value: '全部', label: '全部' },
        { value: 'xxx计算机机房', label: 'xxx计算机机房' },
        { value: 'xxx私人银行', label: 'xxx私人银行' },
        { value: 'xxx财富中心', label: 'xxx财富中心' }
      ],
      // 停车平台
      platformIdData: [
        { value: '主机A', label: '主机A' },
        { value: '主机B', label: '主机B' },
        { value: '主机C', label: '主机C' },
        { value: '主机D', label: '主机D' }
      ],
      // 主机品牌
      hostBrandData: [
        { value: '全部', label: '全部' },
        { value: '海康', label: '海康' },
        { value: '大华', label: '大华' },
        { value: '达实', label: '达实' },
        { value: '广日车库', label: '广日车库' },
        { value: '百胜', label: '百胜' },
        { value: '科拓', label: '科拓' },
        { value: '富士智能', label: '富士智能' }
      ],
      // 日志类型
      logTypeData: [
        { value: '全部', label: '全部' },
        { value: '操作日志', label: '操作日志' }
      ],
      // 客户端类型
      clientTypeData: [
        { value: '1', label: '全部' },
        { value: '2', label: 'B/S' },
        { value: '3', label: 'APP' }
      ],
      // 操作类型
      operatorTypeData: [

      ],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      multipleSelection: [],
      // 选中id
      isId: []
    }
  },
  created() {
    this.getqueryDataDictBasicInfo()
  },
  methods: {
    ...mapActions(['getParkingLogList', 'queryDataDictBasicInfo']),
    /**
     * 查询按钮
     * @method inquireClick
     */
    inquireClick() {
      this.getParkingLogList(this.formInline)
        .then(res => {
          const result = res.data.data.parkLogs
          console.log(result)
          Array.isArray(result) &&
            result.map(item => {
              item.snapshotTime = this.$moment(item.snapshotTime).format('YYYY-MM-DD hh:mm:ss')
            })
          this.tableData = result
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 数据字典获取
    getqueryDataDictBasicInfo() {
      this.queryDataDictBasicInfo({
        queryList: [
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '8'
          }
        ]
      }).then(res => {
        console.log(res.data.data, 'res.data[0].attr')
        this.operatorTypeData = res.data.data[0].attr
      })
    },
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
      this.formInline = {}
    },
    /**
     * 导出
     * @method exportClick
     */
    exportClick() {
      console.log(22)
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
        'userId',
        'startTime',
        'orgId',
        'clientType',
        'ip',
        'operatorType',
        'action',
        'operatorObj',
        'operatorRes',
        'operatorDis'
      ]
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
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
      this.multipleSelection = val
      this.multipleSelection.forEach(v => {
        this.isId.push(v.orgId)
      })
      console.log(`每页 ${val} 条`)
    },
    /**
     * 查询列表分页
     * @method handleCurrentChange
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
          width: 95%;
          margin: 10px auto;
          border: 1px solid #bcbcbc;
          background: #fff;
          padding: 5px;
          display: flex;
          flex-wrap: wrap;
          .condition-detail-item {
            width: 25%;
            height: 36px;
            line-height: 30px;
            display: flex;
            .condition-item-label {
              width: 135px;
              height: 100%;
              text-align: center;
              background: #f7f2f1;
              border: 1px solid #fff;
            }
            .condition-item-value {
              flex: 1;
              border: 1px solid #f7f2f1;
              * {
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
