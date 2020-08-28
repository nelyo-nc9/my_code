<template>
  <div class="page-content">
    <div v-if="isGo" class="top-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>视频参数巡检</el-breadcrumb-item>
        <el-breadcrumb-item>视频参数巡检记录查询</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="buttom-content">
        <div class="box-title">
          <span class="pointer" @click="changeShow">
            &nbsp;&nbsp;巡检结果
            <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <div v-if="isShow">
          <div class="top-inner">
            <div class="btn-left">
              <el-button size="mini" plain @click="exportFile">导出</el-button>
              <el-button size="mini" plain @click="Toprint">打印</el-button>
            </div>
            <div class="inner-center">
              <div class="block">
                <span class="demonstration">选择日期</span>
                <el-date-picker value-format="yyyy-MM-dd" size="medium" v-model="timeValue1" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <!-- <el-date-picker size="medium" v-model="timeValue1" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker> -->
              </div>
              <div class="inner-right">
                <span class="from" style="width:100px">巡查任务</span>
                <el-input v-model="searchValue1" size="medium"></el-input>
                <el-button size="mini" plain @click="onScreening">筛选</el-button>
              </div>
            </div>
          </div>
          <div ref="tableBox">
            <el-table :data="tableData" border size="mini" stripe :height="'calc(30vh - 29px)'" @row-dblclick="showDetail" @selection-change="handleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column :formatter="formatterTable" v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip :sortable="item.sortable" align="center"></el-table-column>
            </el-table>
            <el-pagination style="text-align:right;margin-top:20px;" :page-sizes="[25, 50, 100, 200]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
        <!--按设备 结果详情  -->
        <div class="box-title">
          <span class="pointer" @click="changeShow2">
            &nbsp;&nbsp;结果详情
            <i :class="isShow2? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>

        <div v-if="isShow2">
          <div class="top-inner">
            <div class="btn-left">
              <el-button :disabled="tableData2.length == 0" size="mini" plain @click="exportFile2">导出</el-button>
              <el-button :disabled="tableData2.length == 0" size="mini" plain @click="Toprint2">打印</el-button>
              <el-checkbox :disabled="tableData2.length == 0" v-model="checked" style="margin-left:20px;">仅显示异常设备</el-checkbox>
            </div>
            <div class="inner-center">
              <div class="block">
                视频参数巡检结果
                <!-- <el-select size="medium" v-model="value2" placeholder="请选择">
                  <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.value2">
                  </el-option>
                </el-select> -->
                <el-select :disabled="tableData2.length == 0" v-model="value2" size="small">
                  <el-option value="" label="全部"></el-option>
                  <el-option value="1" label="正常"></el-option>
                  <el-option value="2" label="异常"></el-option>
                  <el-option value="3" label="未知"></el-option>
                </el-select>
                录像计划巡检结果
                <el-select :disabled="tableData2.length == 0" v-model="value3" size="small">
                  <el-option value="" label="全部"></el-option>
                  <el-option value="1" label="正常"></el-option>
                  <el-option value="2" label="异常"></el-option>
                  <el-option value="3" label="未知"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div>
            <el-table :data="tableData2" border size="mini" stripe :height="isShow ?'calc(30vh - 29px)':'calc(67vh - 29px)'" @row-dblclick="showDetail2" @selection-change="handleSelectionChange2">
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column v-for="item in tableColumn2" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip :sortable="item.sortable" align="center" :formatter="formatterTable2"></el-table-column>
            </el-table>
            <el-pagination style="text-align:right;margin-top:20px;" :page-sizes="[25, 50, 100, 200]" :page-size="pagesize2" layout="total, sizes, prev, pager, next, jumper" :total="total2"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-if='!isGo' class="details">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>视频参数巡检</el-breadcrumb-item>
        <el-breadcrumb-item>视频参数巡检记录查询</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 按钮 -->
      <div class="details-btn">
        <el-button size="mini" plain @click="isGo=true">关闭</el-button>
        <el-button size="mini" plain>上一页</el-button>
        <el-button size="mini" plain>下一页</el-button>
        <el-button size="mini" plain>打印</el-button>
      </div>
      <div class="content-info">
        <!-- 巡检记录详情 -->
        <div class="table-content">
          <div class="formTit">
            <div class="title-name">巡检记录详情</div>
            <div>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检计划名称</div>
                    <span>{{form2.name}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检周期</div>
                    <span>{{form.cycle}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检项</div>
                    <el-checkbox-group style="width:266px;" size="mini" v-model="form.type" disabled>
                      <el-checkbox label="分辨率" name="type"></el-checkbox>
                      <el-checkbox label="码率" name="type"></el-checkbox>
                      <el-checkbox label="帧率" name="type"></el-checkbox>
                      <el-checkbox label="录像计划" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检时间</div>
                    <span>{{form.times}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">所属机构</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">所属重点部位</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">所属设备</div>
                    <span>{{form.times}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">通道名称</div>
                    <span>{{form2.channelName}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">通道类型</div>
                    <span>{{form2.channelType}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">品牌</div>
                    <span>{{form2.brand}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">型号</div>
                    <span>{{form2.modelNo}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">视频参数巡检结果</div>
                    <span>{{form2.videoResult}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">录像计划巡检结果</div>
                    <span>{{form2.videotapeResult}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 视频频参数巡检详情 -->
        <div>
          <div class="table-biaoge">
            <div class="box-title">
              <span class="pointer" @click="changeShow3">
                &nbsp;&nbsp;视频参数巡检详情
                <i :class="isShow5? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
          </div>
          <div ref="tableBox">
            <el-table :data="tableData5" border size="mini" stripe style="width:1050px;" v-if="isShow5">
              <el-table-column v-for="item in tableColumn5" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip :sortable="item.sortable" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 录像计划巡检详情 -->
        <div>
          <div class="table-biaoge">
            <div class="box-title">
              <span class="pointer" @click="changeShow6">
                &nbsp;&nbsp;录像计划巡检详情
                <i :class="isShow6? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
          </div>
          <div ref="tableBox" v-if="isShow6">
            <OnlineDetail class="online-detail" :basicColor='basicColor' :timeData='timeData' :detailData='detailData' :modalShow='modalShow' :offlineColor='offlineColor' :onlineColor='onlineColor'></OnlineDetail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import aa from '../../../../common/cryptoAES.js'
import OnlineDetail from '../components/onlineDetail'
import { getTasksVideoListResults, getTasksVideoListInfo } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  components: {
    OnlineDetail
  },
  data() {
    return {
      // 时间选择值
      timeValue1: [],
      //搜索筛选值
      searchValue1: '',
      // 控制是否显示巡检记录详情
      isGo: true,
      isShow: true,
      isShow2: true,
      isShow5: true,
      isShow6: true,
      // 日期 
      value1: '',
      form: {

      },
      form2: {

      },
      onlineColor: '#62c370',
      basicColor: '#ccc',
      offlineColor: '#c42847',
      modalShow: true,

      sucTime: [], // 详情弹窗获取成功的时间
      sucData: [], // 详情弹窗获取成功的数据
      detailData: [], // 详情数据
      timeData: [], // 详情界面时间数据
      suc: [
        {
          "t": "上次录像计划详情",
          "record": {
            "g": [],
            "s": []
          },
          "online": {
            "g": [
              "2020-07-22 00:00:00",
              "2020-07-22 11:21:10"
            ],
            "s": [
              "online",
              ""
            ]
          }
        },
        {
          "t": "本次录像计划详情",
          "record": {
            "g": [],
            "s": []
          },
          "online": {
            "g": [
              "2020-07-21 00:00:00",
              "2020-07-21 10:51:12",
              "2020-07-21 10:51:12",
              "2020-07-21 19:03:57",
              "2020-07-21 19:04:12",
              "2020-07-21 19:04:12",
              "2020-07-21 21:04:12",
              "2020-07-21 23:04:12"
            ],
            "s": [
              "offline",
              "online",
              "offline",
              "online",
              "offline",
              "online",

            ]
          }
        },
      ],
      tableColumn: [
        // 表格1标题行内容
        { sortable: true, prop: 'inspectName', label: '巡检计划名称', width: 'auto' },
        { sortable: true, prop: 'execDate', label: '执行日期', width: 'auto' },
        { sortable: true, prop: 'execTime', label: '执行时间', width: 'auto' },
        { sortable: true, prop: 'execResult', label: '执行结果', width: 'auto' },
        { sortable: true, prop: 'channelCount', label: '巡检设备总数', width: 'auto' },
        { sortable: true, prop: 'abnormalChannelCount', label: '巡检异常总数', width: 'auto' },
      ],
      tableColumn2: [
        // 表格2标题行内容
        { sortable: true, prop: 'orgId', label: '所属机构', width: 'auto' },
        { sortable: true, prop: 'keyPartId', label: '所属重点部位', width: '120' },
        { sortable: true, prop: 'inspectResultId', label: '所属设备', width: 'auto' },
        { sortable: true, prop: 'channelName', label: '通道名称', width: 'auto' },
        { sortable: true, prop: 'channelNum', label: '通道号', width: 'auto' },
        { sortable: true, prop: 'channelType', label: '通道类型', width: 'auto' },
        { sortable: true, prop: 'brand', label: '品牌', width: 'auto' },
        { sortable: true, prop: 'modelNo', label: '型号', width: 'auto' },
        { sortable: true, prop: 'resolutionRatio', label: '分辨率', width: 'auto' },
        { sortable: true, prop: 'codeRatio', label: '码率', width: 'auto' },
        { sortable: true, prop: 'FPs', label: '帧率', width: 'auto' },
        { sortable: true, prop: 'videoResult', label: '视频参数巡检结果', width: 'auto' },
        { sortable: true, prop: 'videotapeResult', label: '录像计划巡检结果', width: '120' },
      ],
      tableColumn5: [
        // 表格5硬盘详情标题行内容
        { prop: 'videoResultObject', label: '巡检详情', width: 'auto' },
        { prop: 'resolutionRatio', label: '分辨率', width: 'auto' },
        { prop: 'codeRatio', label: '码率（kps）', width: 'auto' },
        { prop: 'FPs', label: '帧率', width: 'auto' },
      ],
      tableData: [],
      tableData2: [],
      tableData5: [
        {
          orgId: '上次巡检详情',
          keySite1: '1080P',
          keySite2: '2048',
          keySite3: '25',
        },
        {
          orgId: '本次巡检详情',
          keySite1: '1080P',
          keySite2: '2048',
          keySite3: '25',
        },
      ],
      selectData: [],
      selectData2: [],
      selectData5: [],
      //分页项
      pagenum: 1,
      pagesize: 50,
      total: 400,
      pagenum2: 1,
      pagesize2: 50,
      total2: 400,
      //是否显示异常设备
      checked: false,
      //下拉列表项
      value2: '',
      value3: '',
    }
  },
  watch: {
    timeValue1() {
      this.tasksList()
    },
    value2() {
      this.tasksList2()
    },
    value3() {
      this.tasksList2()
    },
    checked() {
      this.tasksList2()
    },
  },
  computed: {},
  created() {
    this.tasksList()
    this.chulishuju()
    console.log(this.timeData);
    console.log(this.detailData);
    console.log(this.suc);
  },
  mounted() {
    // console.log('11',aa.encrypt('123456'));
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    changeShow2() {
      this.isShow2 = !this.isShow2
    },
    changeShow3() {
      this.isShow5 = !this.isShow5
    },
    changeShow6() {
      this.isShow6 = !this.isShow6
    },
    onScreening() {
      this.tasksList()
    },
    showDetail(row, column, event) {
      this.tasksList2(row.id)
      console.log(row);
      console.log(column);
      console.log(event);
      console.log('双击1');
    },
    showDetail2(row, column, event) {
      this.form2 = row
      this.tableData5 = row.videoInspectInfoDetail
      console.log(row);
      console.log(column);
      console.log(event);
      this.isGo = false
      console.log('双击2');
    },
    //获取列表
    tasksList() {
      let params = {
        page: this.pagenum,
        limit: this.pagesize
      }
      console.log(this.timeValue1);
      if (this.timeValue1) {
        params['beginTime'] = this.timeValue1[0]
        params['endTime'] = this.timeValue1[1]
      }

      if (this.searchValue1) {
        params['taskName'] = this.searchValue1
      }
      getTasksVideoListResults(params).then(res => {
        let result = res.data
        console.log(result);
        if (result.message) {
          this.tableData = result.data.taskResults
          this.total = result.data.count.total
          console.log(this.tableData);
          this.$messageSuccess('获取列表成功')
        } else {
          this.$messageError('获取列表失败')
        }
      })
    },
    //获取列表2
    tasksList2(id) {
      let params = {
        page: this.pagenum2,
        limit: this.pagesize2,
        inspectResultId: id,
        isException: this.checked
      }
      console.log(this.value2);
      console.log(this.value3);
      if (this.value2 !== '') {
        params['videoResult'] = this.value2
      }
      if (this.value3 !== '') {
        params['videotapeResult'] = this.value3
      }
      getTasksVideoListInfo(params).then(res => {
        let result = res.data
        console.log(result);
        if (result.message) {
          this.tableData2 = result.data.infos
          this.total2 = result.data.count.total
          this.$messageSuccess('获取列表成功')
        } else {
          this.$messageError('获取列表失败')
        }
      })
    },
    // 选中的和选中的id 
    handleSelectionChange(val) {
      console.log(val);
      this.selectData = val;
      this.isId = this.selectData.map(item => item.id);
      this.isStatus = this.selectData.map(item => item.status)[0];
    },
    handleSelectionChange2(val) {
      console.log(val);
      this.selectData2 = val;
      // this.isId = this.selectData2.map(item => item.id);
      // this.isStatus = this.selectData2.map(item => item.status)[0];
    },
    //导出功能
    exportFile() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = ['巡检计划名称', '执行日期', '执行时间', '执行结果', '巡检设备总数', '巡检异常总数']
      // 字段名
      const filterVal = ['inspectName', 'execDate', 'execTime', 'execResult', 'channelCount', 'abnormalChannelCount']
      let list = []
      // 导出全部或导出选中
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
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

    //打印方法
    Toprint() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'inspectName', displayName: '巡检计划名称' },
          { field: 'execDate', displayName: '执行日期' },
          { field: 'execTime', displayName: '执行时间' },
          { field: 'execResult', displayName: '执行结果' },
          { field: 'channelCount', displayName: '巡检设备总数' },
          { field: 'abnormalChannelCount', displayName: '巡检异常总数' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle: "border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ",
        //内容样式
        gridStyle: "border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;",
      })
    },
    //导出2功能
    exportFile2() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = [
        '所属机构',
        '所属重点部位',
        '所属设备',
        '通道名称',
        '通道号',
        '通道类型',
        '品牌',
        '型号',
        '分辨率',
        '码率',
        '帧率',
        '视频参数巡检结果',
        '录像计划巡检结果',]
      // 字段名
      const filterVal = [
        'orgId',
        'keyPartId',
        'inspectResultId',
        'channelName',
        'channelNum',
        'channelType',
        'brand',
        'modelNo',
        'resolutionRatio',
        'codeRatio',
        'FPs',
        'videoResult',
        'videotapeResult',]
      let list = []
      // 导出全部或导出选中
      if (this.selectData2 && this.selectData2.length > 0) {
        list = this.selectData2
      } else {
        list = this.tableData2
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    //打印2方法
    Toprint2() {
      // 判断打印全部还是选中
      let list = []
      if (this.selectData2 && this.selectData2.length > 0) {
        list = this.selectData2
      } else {
        list = this.tableData2
      }
      printJS({
        //表格数据的来源
        printable: list,
        //field 表格内容  displayName：表头名
        properties: [
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'inspectResultId', displayName: '所属设备' },
          { field: 'channelName', displayName: '通道名称' },
          { field: 'channelNum', displayName: '通道号' },
          { field: 'channelType', displayName: '通道类型' },
          { field: 'brand', displayName: '品牌' },
          { field: 'modelNo', displayName: '型号' },
          { field: 'resolutionRatio', displayName: '分辨率' },
          { field: 'codeRatio', displayName: '码率' },
          { field: 'FPs', displayName: '帧率' },
          { field: 'videoResult', displayName: '视频参数巡检结果' },
          { field: 'videotapeResult', displayName: '录像计划巡检结果' },
        ],
        type: 'json',
        // 表题 
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式 
        style: ".custom { color: red; text-align:center ; font-weight:600; color:#000} ",
        //表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle: "border: 1px solid  lightgray;font-size:14px; text-align:center;color:#333 ",
        //内容样式
        gridStyle: "border: 1px solid lightgray; font-size:12px; text-align:center;",
      })
    },
    formatterTable(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'abnormalChannelCount':
          params = cellValue ? 0 : cellValue
          break
          params = obj[cellValue] || ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    formatterTable2(row, column, cellValue, index) {
      let params = ''
      let obj = {}
      switch (column.property) {
        case 'digitalNumber':
          params = cellValue === '' ? 0 : cellValue
          break
        case 'videoResult':
          obj = {
            1: '正常',
            2: '异常',
            3: '未知',
          }
          params = obj[cellValue] || ''
          break
        case 'videotapeResult':
          obj = {
            1: '正常',
            2: '异常',
            3: '未知',
          }
          params = obj[cellValue] || ''
          break
        default:
          params = cellValue
          break
      }
      return params
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.tasksList()
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.tasksList()
    },
    //处理数据
    chulishuju() {
      let dateProp = []
      let dateDetailsProp = []
      this.suc.forEach((item, index) => {
        dateProp.push(item.t)
        dateDetailsProp[index] = []
        item.online.g.forEach((squre, sdex) => {
          let itemType
          if (item.online.s[sdex] === 'online') {
            itemType = 1
          } else if (item.online.s[sdex] === 'offline') {
            itemType = 2
          } else {
            itemType = null
          }
          if (item.online.g[sdex + 1]) {
            dateDetailsProp[index].push({
              // startTime: new Date(squre).getTime(), // ie11不兼容new Date('2019-06-21')格式转换
              startTime: this.$moment(squre).valueOf(),
              // endTime: new Date(item.online.g[sdex + 1]).getTime(),
              endTime: this.$moment(item.online.g[sdex + 1]).valueOf(),
              type: itemType
            })
          } else {
            dateDetailsProp[index].push({
              // startTime: new Date(squre).getTime(),
              startTime: this.$moment(squre).valueOf(),
              // endTime: new Date(item.t).getTime() + 1000 * 3600 * 16 - 1,
              endTime: this.$moment(item.t).valueOf() + 1000 * 3600 * 24 - 1,
              type: itemType
            })
          }
        })
      })
      this.timeData = dateProp
      this.detailData = dateDetailsProp
      // if (!this.DetailsOnlineRate) {
      //   this.detailData = dateDetailsProp
      // } else {
      //   this.sucTime = dateProp
      //   this.sucData = dateDetailsProp
      //   this.filterData()
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.page-content {
  height: calc(100% - 10px);
  width: 100%;
  .top-content {
    height: 100%;
    width: 100%;
    .el-breadcrumb {
      margin-top: 10px;
      margin-left: 10px;
    }
    .buttom-content {
      // margin-left: 10px;
      margin: 10px 24px 0 24px;
      .top-inner {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .btn-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .inner-center {
          display: flex;
          align-items: center;
          justify-content: center;
          .inner-right {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 0 0 50px;
            span {
              width: 80px;
            }
          }
        }
      }
    }
  }
  .details {
    margin-top: 10px;
    margin-left: 10px;
    .el-breadcrumb {
    }
    .details-btn {
      margin: 10px 0 0 0;
    }
    .content-info {
      margin-left: 200px;
      .table-content {
        .title-name {
          margin-left: 360px;
        }
        .form-content {
          border: 1px solid #e1e1e1;
          width: 800px;
          box-sizing: border-box;
          margin-left: 120px;
          .form-inner {
            width: 100%;
            height: 30px;
            margin: 2px;
            .form-item {
              width: 50%;
              height: 100%;
              // span {
              //   box-sizing: border-box;
              //   height: 26px;
              //   line-height: 26px;
              // }
              .bg-c {
                display: inline-block;
                width: 120px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: #e1e1e1;
              }
              span {
                display: inline-block;
                width: 270px;
                text-align: center;
                font-size: 12px;
              }
              .el-input {
                width: 270px;
                height: 30px;
              }
              .el-select {
                width: 270px;
                height: 30px;
              }
              .el-checkbox-group {
                display: inline-block;
                width: 270px;
                height: 30px;
              }
            }
          }
        }
      }
    }
  }
}
.el-divider--horizontal {
  margin: 18px 0;
}
.box-title {
  margin: 0 0 8px 0;
  .pointer {
    border-left: 3px solid #2d72d3;
  }
}
/deep/.el-tabs {
  box-sizing: border-box;
  .is-active {
    border-top: 2px solid #2d72d3;
  }
}
/deep/.el-checkbox-group {
  margin-left: 6px;
  .el-checkbox {
    margin-right: 10px;
    .el-checkbox__label {
      padding-left: 4px;
    }
  }
}
.online-detail {
  width: 70%;
}
</style>
