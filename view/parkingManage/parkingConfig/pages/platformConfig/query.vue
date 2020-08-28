
<template>
  <div class="log-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>停车管理</el-breadcrumb-item>
        <el-breadcrumb-item>停车平台配置</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="content-box">
        <div class="box-title">
          <span class="pointer"
                @click="toggleOpen('searchCondition')">
            查询条件
            <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div class="condition-box"
             v-if="dropdownStatus.searchCondition">
          <div class="condition-detail">
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
              <div class="condition-item-label">所属重点部位</div>
              <div class="condition-item-value">
                  <el-select v-model="formInline.keyPartId"
                         size="mini"
                         @change="changeData">
                <el-option :label="item.name"
                           :value="item.id"
                           v-for="(item, index) in partData"
                           :key="index"></el-option>
              </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">停车平台</div>
              <div class="condition-item-value">
                 <el-select v-model="formInline.name"
                         @change="changeSelect()"
                         size="mini">
                <el-option v-for="(item, index) in getAccessArr"
                           :key="index"
                           :label="item.name"
                           :value="item.name"></el-option>
              </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">版本</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.version"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">品牌</div>
              <div class="condition-item-value">
                <el-select v-model="formInline.brand"
                           placeholder="全部"
                           size="mini">
                  <el-option v-for="(item, index) in carBrandData"
                             :key="index"
                             :label="item.data"
                             :value="item.serialNum"></el-option>
                </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">车场</div>
              <div class="condition-item-value">
                 <el-input v-model="formInline.carParking"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">主机名称</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.HostName"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">ip地址</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.ip"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">资产编码</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.assetCode"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">录入机构</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.updatedDept"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">录入人</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.updatedBy"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
             <div class="condition-detail-item">
              <div class="condition-item-label">录入时间</div>
               <div class="condition-item-value">
                 <el-date-picker
                v-model="formInline.updatedAt"
                type="datetime"
                size="mini"
                placeholder="选择日期时间">
              </el-date-picker>
              </div>
            </div>
          </div>
          <div class="opt-button">
            <el-button type="primary"
                       size="medium"
                       style="margin-right:24px;"
                       @click="searchPaltform">查询</el-button>
            <el-button size="medium"
                       style="margin-right:24px;"
                       @click="resetPlatform">重置</el-button>
            <el-button size="medium"
            @click="exportPlarform">导出</el-button>
          </div>
        </div>
        <div class="result-box">
          <div class="box-title">
            <span class="pointer"
                  @click="toggleOpen('searchResult')">
              查询结果
              <i :class="dropdownStatus.searchResult ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div v-if="dropdownStatus.searchResult">
            <el-table stripe
                      border
                      size="medium"
                      :data="tableData"
                      @select="select"
                      height="520"
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
          </div>
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
import { getParkPlatformApi } from '@src/http/parkingManage/parkingRecord.api.js'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api'
import { mapActions } from 'vuex'
export default {
  components: { treeBox },
  data() {
    return {
      partData: [],
      getAccessArr: [],
      nameLable: '',
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      },
      selectData: [],
      resizable: false,
      columns: [
        { prop: 'orgId', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartId', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'name', sortable: true, label: '停车平台', width: '' },
        { prop: 'brand', sortable: true, label: '品牌', width: '' },
        { prop: 'version', sortable: true, label: '版本', width: '' },
        { prop: 'ip', sortable: true, label: 'IP地址', width: '' },
        { prop: 'hostNo', sortable: true, label: '主机数量', width: '' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' }
      ],
      formInline: {},
      // 所属重点部位
      parkNameData: [
        { value: 'b', label: '全部' },
        { value: 'c', label: '停车平台1' },
        { value: 'd', label: '停车平台2' },
        { value: 'e', label: '停车平台3' }
      ],
      // 车辆品牌
      carBrandData: [],
      // occurTime: [],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      treeType: 2
    }
  },
  created() {
    this.getqueryDataDictBasicInfo()
  },
  methods: {
    ...mapActions(['getParkPlatform', 'exportParkPlatform', 'queryDataDictBasicInfo']),
    // 查询主机列表
    searchPaltform() {
      this.tableData = []
      getParkPlatformApi(this.formInline).then((res) => {
        console.log('查询停车平台', res.data.data.platforms)
        // this.formData.id = res.data.data.id
        let result = res.data.data.platforms
        if (result && result.length > 0) {
          result.map(item => {
            item.orgId = item.orgName
            item.keyPartId = item.keyPartName
            switch(item.brand){
                case '1': item.brand='海康'; break;
                case '2': item.brand='大华'; break;
                case '3': item.brand='达实'; break;
                case '4': item.brand='广日车库'; break;
                case '5': item.brand='百胜'; break;
                case '6': item.brand='科拓'; break;
                case '7': item.brand='披克'; break;
                case '8': item.brand='富士智能'; break;
                case '9': item.brand='东升安防'; break;
                case '10': item.brand='丽泽'; break;
                case '11': item.brand='西沃'; break;
                case '12': item.brand='建安顺'; break;
                case '13': item.brand='天翔'; break;
                case '14': item.brand='南泽'; break;
                case '15': item.brand='安道'; break;
                case '16': item.brand='浙江正元'; break;
                case '17': item.brand='大手'; break;
                case '18': item.brand='蓝卡'; break;
                case '19': item.brand='捷顺'; break;
            }
          })
          this.tableData = result
        } else {
          this.$notify.warning({
            title: '警告',
            message: '未查到数据'
          })
        }
      }).catch((err) => {
        this.Error(err)
      })

      // this.getParkPlatform().then(res => {
      //   console.log(res.data, '查询停车平台列表')
      //   let reslut = res.data.data.platforms
      //   this.tableData = reslut
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    // 数据字典获取
    getqueryDataDictBasicInfo() {
      this.queryDataDictBasicInfo({
        queryList: [
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '6'
          }
        ]
      }).then(res => {
        this.carBrandData = res.data.data[0].attr
      })
    },
    // 导出
    exportPlarform() {
      this.exportParkPlatform().then(res => {
        console.log(res, '导出成功')
      }).catch(err => {
        console.log(err)
      })
      // 前端导出
      const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '停车平台',
        '品牌',
        '版本',
        'IP地址',
        '主机数量',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      const filterVal = [
        'orgId',
        'keyPartId',
        'name',
        'brand',
        'version',
        'ip',
        'extend1',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '未命名')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 重置
    resetPlatform() {
      this.formInline = {}
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    paginationConfChange() {},
    select(s, row) {
      this.selectData = s
    },
    /**
     * 查询列表每页显示条数
     * @method handleSizeChange
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    /**
     * 查询列表分页
     * @method handleCurrentChange
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 表格选中触发的事件
    handleSelectionChange(val) {
      this.selectData = val
    },
    getTree(params) {
      return getTreeApi(params)
    },
    playBackGetData(data) {
      this.nameLable = data.name
      this.formInline.orgId = data.id
      let obj = {
        type: 2,
        oId: data.serial
      }
      this.partData = []
      this.getAccessArr = []
      this.formInline.keyPartId = ''
      // this.formInline.platformId = ''
      getTreeApi(obj).then(res => {
        if (res.data.data.nodes) {
          res.data.data.nodes.forEach(item => {
            if (item.tierType === 'loc') {
              this.partData.push(item)
            }
          })
        }
      })
    },
    changeData(id) {
      this.getAccessArr = []
      // this.formInline.platformId = ''
      let obj = {
        keyPartId: id
      }
      this.getParkPlatform(obj).then(res => {
        if (res.status === 200) {
          console.log(res.data.data.platforms, '111 ')
          this.getAccessArr = res.data.data.platforms
        }
      })
    },
    changeSelect() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
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
            height: 30px;
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
