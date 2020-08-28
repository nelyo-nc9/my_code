<template>
  <div class="parking-log">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>停车管理</el-breadcrumb-item>
        <el-breadcrumb-item>过车查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="parking-log-top">
      <div class="box-title">
        <span class="pointer"
              @click="toggleOpen('searchCondition')">
          查询条件
          <i :class="dropdownStatus.searchCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
      <div class="parking-log-inquire"
           v-if="dropdownStatus.searchCondition">
        <div class="parking-log-select">
          <ul>
            <li>
              <i>所属机构</i>
              <!-- <el-input v-model="formInline.orgId"
                        placeholder=""
                        size="mini"></el-input> -->
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
            </li>
            <li>
              <i>所属重点部位</i>
              <el-select v-model="formInline.keyPartId"
                         size="mini"
                         @change="changeData">
                <el-option :label="item.name"
                           :value="item.id"
                           v-for="(item, index) in partData"
                           :key="index"></el-option>
              </el-select>
            </li>
            <li>
              <i>停车平台</i>
              <el-select v-model="formInline.platformId"
                         @change="changeSelect()"
                         size="mini">
                <el-option v-for="(item, index) in getAccessArr"
                           :key="index"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </li>
            <li>
              <i>品牌</i>
              <el-select v-model="formInline.brand"
                         size="mini">
                <el-option v-for="(item, index) in carBrandData"
                           :key="index"
                           :label="item.data"
                           :value="item.serialNum"></el-option>
              </el-select>
            </li>
            <li>
              <i>车场</i>
              <el-input v-model="formInline.yard"
                        placeholder=""
                        size="mini"></el-input>
            </li>
            <li>
              <i>车牌号</i>
              <el-input v-model="formInline.licensePlate"
                        placeholder=""
                        size="mini"></el-input>
            </li>
            <li>
              <i>车辆品牌</i>
              <el-input v-model="formInline.carBrand"
                        placeholder=""
                        size="mini"></el-input>
            </li>
            <li>
              <i>车身颜色</i>
              <el-input v-model="formInline.carColor"
                        placeholder=""
                        size="mini"></el-input>
            </li>

            <li>
              <i>通道名称</i>
              <el-input v-model="formInline.channelName"
                        placeholder=""
                        size="mini"></el-input>
            </li>
            <li>
              <i>出入方向</i>
              <el-select v-model="formInline.direction"
                         placeholder="全部"
                         size="mini">
                <el-option v-for="(item, index) in directionData"
                           :key="index"
                           :label="item.data"
                           :value="item.sortSerialNum"></el-option>
              </el-select>
            </li>
            <li>
              <i>过车类型</i>
              <el-select v-model="formInline.recordType"
                         placeholder="全部"
                         size="mini">
                <el-option v-for="(item, index) in recordTypeData"
                           :key="index"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li>
              <i>过车时间</i>
              <el-date-picker v-model="formInline.snapshotTime"
                              type="daterange"
                              width='330'                            
                              value-format="yyyy-MM-dd hh:mm:ss"
                              align="right"
                              format="yyyy-MM-dd HH:mm:ss"
                              size="mini"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </li>
          </ul>
        </div>
        <div class="parking-log-btn">
          <el-button type="primary"
                     @click="inquireClick"
                     size="small">查询</el-button>
          <el-button @click="resetClick"
                     size="small">重置</el-button>
          <el-button @click="exportClick"
                     size="small">导出</el-button>
        </div>
      </div>
    </div>
    <div class="parking-log-bottom">
      <div class="zone-header">
        <i>查询结果</i>
        <div class="zone-header-line"></div>
      </div>
      <div class="parking-log-result">
        <div class="log-result-table">
          <el-table ref="multipleTable"
                    border
                    :data="tableData"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    height="480"
                    show-summary>
            <el-table-column type="selection"
                             width="50"></el-table-column>
            <el-table-column prop="Number"
                             type="index"
                             label="序号"
                             width="50"></el-table-column>
            <el-table-column v-for="(item,index) in tableColumn"
                             :key="index"
                             :prop="item.mark"
                             :label="item.label"
                             :width="item.width"
                             show-overflow-tooltip
                             align="center"
                             sortable></el-table-column>
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
      formInline: {
        // orgId: 27
        // keyPartId: 222,
        // carType: 2,
        // carBrand: 'qwer',
        // carColor: 3,
        // recordType: 1,
        // recordType: '1',
         // direction: '1',
        // startTime: '2020-06-02 17:27:38',
        // endTime: '2020-08-04 17:27:38',
      },
      dropdownStatus: {
        searchCondition: true,
        searchResult: true,
      },
      nameLable: '',
      partData: [],
      getAccessArr: [],
      treeType: 3,

      // 车辆类型
      carTypeData: [],
      // 车辆品牌
      carBrandData: [],
      // 车身颜色
      carColorData: [],
      // 过车类型
      recordTypeData: [
        { value: '1', label: '全部' },
        { value: '2', label: '重点关注' },
        { value: '3', label: '布控车辆' },
        { value: '4', label: '黑名单' },
        { value: '5', label: '其他' },
      ],
      // 出入方向
      directionData: [],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      multipleSelection: [],
      tableColumn: [
        {
          mark: 'orgName',
          label: '所属机构',
          width: '140',
        },
        {
          mark: 'keyPartName',
          label: '所属重点部位',
          width: '140',
        },
        {
          mark: 'platformId',
          label: '停车平台',
          width: '140',
        },
        {
          mark: 'brand',
          label: '品牌',
          width: '140',
        },
        {
          mark: 'yard',
          label: '车场',
          width: '140',
        },
        {
          mark: 'licensePlate',
          label: '车牌号',
          width: '140',
        },
        {
          mark: 'carBrand',
          label: '车辆品牌',
          width: '140',
        },
        {
          mark: 'carColor',
          label: '车身颜色',
          width: '140',
        },
        {
          mark: 'channelName',
          label: '通道名称',
          width: '140',
        },
        {
          mark: 'direction',
          label: '出入方向',
          width: '120',
        },
        {
          mark: 'recordType',
          label: '过车类型',
          width: '120',
        },
        {
          mark: 'snapshotTime',
          label: '时间',
          width: '180',
        },
        {
          mark: 'dealView',
          label: '操作',
          width: '120',
        },
      ],
    }
  },
  created() {
    // let startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    // let endTime = new Date()
    // this.occurTime.push(startTime, endTime)
    this.getqueryDataDictBasicInfo()
  },
  methods: {
    ...mapActions(['getParkingRecordList', 'getParkPlatform', 'queryDataDictBasicInfo']),
    // 查询按钮
    inquireClick() {
      if(this.formInline.recordType==1){
          this.formInline.recordType=null
      }
      if(this.formInline.keyPartId=null){
          delete this.formInline.keyPartId 
      }
      if(this.formInline.platformId=null){
          delete this.formInline.platformId 
      }
      this.tableData=[]
      this.getParkingRecordList(this.formInline)
        .then((res) => {
          if (res.data.data && res.data.data.parkRecords) {
            const result = res.data.data.parkRecords
            console.log(res)
            Array.isArray(result) &&
              result.map((item) => {
                item.snapshotTime = this.$moment(item.snapshotTime).format('YYYY-MM-DD hh:mm:ss')
                switch(item.carColor){
                    case '1':item.carColor='全部';  break;
                    case '2':item.carColor='黑色';  break;
                    case '3':item.carColor='白色';  break;
                    case '4':item.carColor='红色';  break;
                    case '5':item.carColor='蓝色';  break;
                    case '6':item.carColor='其他';  break;
                }
                   switch(item.recordType){
                    case 1:item.recordType='全部';  break;
                    case 2:item.recordType='重点关注';  break;
                    case 3:item.recordType='布控车辆';  break;
                    case 4:item.recordType='黑名单';  break;
                    case 5:item.recordType='其他';  break;
                }
              })
              console.log(result,'======')
            this.tableData = result
          }
        })
        .catch((err) => {
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
            dictId: '6',
          },
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '5',
          },
        ],
      }).then((res) => {
        this.carBrandData = res.data.data[0].attr
        this.directionData = res.data.data[1].attr
      })
    },

    // 重置
    resetClick() {
      this.formInline = {}
    },
    // 导出
    exportClick() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      const tHeader = [
        '序号',
        '所属机构',
        '所属重点部位',
        '停车平台',
        '品牌',
        '车场',
        '车牌号',
        '车辆品牌',
        '车身颜色',
        '通道名称',
        '出入方向',
        '过车类型',
        '时间',
      ]
      const filterVal = [
        'index',
        'orgName',
        'keyPartName',
        'platformId',
        'brand',
        'yard',
        'licensePlate',
        'carBrand',
        'carColor',
        'channelName',
        'direction',
        'recordType',
        'snapshotTime',
      ]
      let list = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      list.map((item, index) => {
        item.index = index + 1
      })
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    toggleOpen(type) {
      this.dropdownStatus[type] = !this.dropdownStatus[type]
    },
    /**
     * 行选中信息
     * @method handleSelectionChange
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选中信息', val)
    },
    /**
     * 查询列表每页显示条数
     * @method handleSizeChange
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    getTree(params) {
      return getTreeApi(params)
    },
    playBackGetData(data) {
      this.nameLable = data.name
      this.formInline.orgId = data.id
      let obj = {
        type: 2,
        oId: data.serial,
      }
      this.partData = []
      this.getAccessArr = []
      this.formInline.keyPartId = ''
      this.formInline.platformId = ''
      getTreeApi(obj).then((res) => {
        if (res.data.data.nodes) {
          res.data.data.nodes.forEach((item) => {
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
        keyPartId: id,
      }
      this.getParkPlatform(obj).then((res) => {
        if (res.status === 200) {
          console.log(res.data.data.platforms, '111 ')
          this.getAccessArr = res.data.data.platforms
        }
      })
    },
    // 查询列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    changeSelect() {
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped lang="less">
@import '../../../assets/elementModify.less';
.parking-log {
  padding: 20px;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  .host-header {
    margin-bottom: 15px;
  }
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
  .parking-log-inquire {
    margin: 10px 0;
    .parking-log-select {
      width: 100%;
      overflow: hidden;
      border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
        margin: 10px;
        li {
          float: left;
          width: 460px;
          margin: 0 2px 2px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 120px;
            line-height: 32px;
            text-align: center;
            background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-date-editor--datetimerange.el-input,
          .el-date-editor--datetimerange.el-input__inner {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-select {
            width: 330px !important;
            margin-top: 2px;
          }
        }
      }
      .parking-time {
        width: 520px;
      }
    }
    .parking-log-btn {
      width: 100%;
      text-align: center;
      margin: 20px 0 30px;
    }
  }
  .parking-log-bottom {
    height: calc(100% - 300px);
    .parking-log-result {
      .log-result-table {
        overflow: hidden;
        .el-pagination {
          float: right;
          margin: 10px 0;
        }
      }
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 20px;

    i {
      float: left;
      width: 4%;
      font-size: 12px;
    }
    .zone-header-line {
      float: right;
      width: 96%;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
.parking-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.parking-log .el-form--inline .el-form-item__content {
  width: 140px !important;
}
.el-date-editor.el-range-editor.el-input__inner.el-date-editor--daterange.el-range-editor--mini {
  width: 330px;
}
</style>
