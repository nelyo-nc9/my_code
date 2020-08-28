
<template>
  <div class="log-box">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>停车管理</el-breadcrumb-item>
        <el-breadcrumb-item>停车配置</el-breadcrumb-item>
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
              <div class="condition-item-label">所属停车平台</div>
              <div class="condition-item-value">
               <el-select v-model="formInline.platformId"
                         @change="changeSelect()"
                         size="mini">
                <el-option v-for="(item, index) in getAccessArr"
                           :key="index"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">所属车场</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.site"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">主机品牌</div>
              <div class="condition-item-value">
                <el-select v-model="formInline.hostBrand"
                           placeholder="全部"
                           size="mini">
                  <el-option v-for="(item, index) in carBrandData"
                             :key="index"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">主机名称</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.name"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">主机ip</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.ip"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>

            <div class="condition-detail-item">
              <div class="condition-item-label">道闸数量</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.wayNum"
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
                <el-input v-model="formInline.enterOrgan"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">录入人</div>
              <div class="condition-item-value">
                <el-input v-model="formInline.enterPerson"
                          placeholder=""
                          size="mini"></el-input>
              </div>
            </div>
            <div class="condition-detail-item">
              <div class="condition-item-label">录入时间</div>
              <div class="condition-item-value">
                <el-date-picker v-model="formInline.enterTime"
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
                       @click="serchHostList">查询</el-button>
            <el-button size="medium"
                       style="margin-right:24px;"
                       @click="reset">重置</el-button>
            <el-button size="medium" @click="exportHost">导出</el-button>
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
                      height="510"
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
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api'
import { getParkHostListApi } from '@src/http/parkingManage/parkingRecord.api.js'
export default {
  components: { treeBox },
  data() {
    return {
      dropdownStatus: {
        searchCondition: true,
        searchResult: true
      },
      resizable: false,
      nameLable: '',
      treeType: 2,
      partData: [],
      getAccessArr: [],
      columns: [
        { prop: 'orgId', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPartId', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'orgName', sortable: true, label: '所属停车平台', width: '' },
        { prop: 'name', label: '主机名称', width: '' },
        { prop: 'brand', sortable: true, label: '主机品牌', width: '' },
        { prop: 'model', label: '主机型号', width: '' },
        { prop: 'site', label: '车场', width: '' },
        { prop: 'wayNum', label: '道闸数量', width: '' },
        { prop: 'updatedDept', label: '录入机构', width: '' },
        { prop: 'updatedBy', label: '录入人', width: '' },
        { prop: 'updatedAt', label: '录入时间', width: '' }
      ],
      formInline: {},
      // 所属重点部位
      positionData: [
        { value: 'a', label: 'xxx金库' },
        { value: 'b', label: '全部' },
        { value: 'c', label: 'xxx计算机机房' },
        { value: 'd', label: 'xxx私人银行' },
        { value: 'e', label: 'xxx财富中心' }
      ],
      // 所属停车平台
      parkPlatformData: [
        { value: '全部', label: '全部' },
        { value: '停车平台1', label: '停车平台1' },
        { value: '停车平台2', label: '停车平台2' }
      ],
      // 主机品牌
      hostBrandData: [
        { value: '全部', label: '全部' },
        { value: '海康', label: '海康' },
        { value: '大华', label: '大华' }
      ],
      // occurTime: [],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      carBrandData: []
    }
  },
  created() {
    this.getqueryDataDictBasicInfo()
  },
  methods: {
    ...mapActions(['getParkHost', 'exportParkPlatform', 'queryDataDictBasicInfo', 'getParkPlatform']),
    // 查询列表
    serchHostList() {
      if (!this.formInline.orgId && !this.formInline.keyPartId && !this.formInline.orgName && !this.formInline.site && !this.formInline.hostBrand && !this.formInline.name && !this.formInline.ip && !this.formInline.orgwayNum && !this.formInline.assetCode && !this.formInline.enterOrgan && !this.formInline.enterPerson && !this.formInline.enterTime) {
        alert('请输入内容')
      } else {
        getParkHostListApi(this.formInline).then((res) => {
          console.log('查询停车平台', res.data.data.hosts)
          // this.formData.id = res.data.data.id
          let result = res.data.data.hosts
          console.log(result)
          this.tableData = result
        }).catch((err) => {
          this.Error(err)
        })
      }

      // this.getParkHost().then(res => {
      //   console.log(res, '查询停车主机')
      //   let result = res.data.data.host
      //   this.tableData = result
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
    // 重置
    reset() {
      this.formInline.orgId = ''
      this.formInline.keyPartId = ''
      this.formInline.orgName = ''
      this.formInline.name = ''
      this.formInline.site = ''
      this.formInline.hostBrand = ''
      this.formInline.model = ''
      this.formInline.ip = ''
      this.formInline.assetCode = ''
      this.formInline.enterOrgan = ''
      this.formInline.enterPerson = ''
      this.formInline.enterTime = ''
      this.formInline.wayNum = ''
    },
    // 导出列表
    exportHost() {
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
        '所属停车平台',
        '主机名称',
        '主机品牌',
        '主机型号',
        '车场',
        '道闸数量',
        '录入机构',
        '录入时间',
        '录入人'
      ]
      const filterVal = [
        'orgId',
        'keyPartId',
        'orgName',
        'name',
        'brand',
        'model',
        'site',
        'wayNum',
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
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
      this.formInline.platformId = ''
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
      this.formInline.platformId = ''
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
