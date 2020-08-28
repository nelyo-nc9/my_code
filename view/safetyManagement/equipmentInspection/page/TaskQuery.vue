<!-- 设备巡检查询 -->
<template>
  <div class="page-content">
    <div v-if="isGo" class="top-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
        <el-breadcrumb-item>巡检记录查询</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="buttom-content">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <!-- 按设备巡检结果 -->
          <el-tab-pane label="按设备" name="first">
            <div class="box-title">
              <span class="pointer" @click="changeShow">
                &nbsp;&nbsp;查询结果
                <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="isShow">
              <div class="top-inner">
                <div class="btn-left">
                  <el-button size="mini" plain @click="exportFile(1)">导出</el-button>
                  <el-button size="mini" plain @click="Toprint(1)">打印</el-button>
                </div>
                <div class="inner-center">
                  <div class="search-date-container">
                    <span class="search-date">开始时间</span>
                    <el-date-picker
                      v-model="searchDate.startTime"
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyyMMdd">
                    </el-date-picker>

                    <span class="search-date">结束时间</span>
                    <el-date-picker
                      v-model="searchDate.endTime"
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyyMMdd">
                    </el-date-picker>
                  </div>
                  <div class="inner-right">
                    <span>巡查任务</span>
                    <el-input v-model="searchValue1" size="medium"></el-input>
                    <el-button size="mini" plain @click="onScreening">筛选</el-button>
                  </div>
                </div>
              </div>

              <div style="flex:1;" ref="tableBox">
                <el-table
                  :data="equipmentData"
                  stripe
                  :height="'calc(30vh - 29px)'"
                  @row-click="showDetail"
                  @selection-change="handleSelectionChange1"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in equipmentList"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    show-overflow-tooltip
                    :sortable="item.sortable"
                    align="center"
                  ></el-table-column>
                </el-table>
                <el-pagination
                  style="text-align:right;margin-top:20px;"
                  @size-change="resultSizeChangeHandler"
                  @current-change="resultCurrentChangeHandler"
                  :current-page="resultTable.pagenum"
                  :page-size="resultTable.pagesize"
                  :page-sizes="[25, 50, 100, 200]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="equipmentDataTotal"
                ></el-pagination>
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
                  <el-button size="mini" plain @click="exportFile(isCall ? 4: 3)">导出</el-button>
                  <el-button size="mini" plain @click="Toprint(isCall ? 4 : 3)">打印</el-button>
                  <el-checkbox v-model="checked" style="margin-left:20px;">仅显示异常设备</el-checkbox>
                </div>
                <div class="inner-center">
                  <div class="device-detail-select">
                    <div class="select-item">
                      <div class="label">在线状态</div>
                      <el-select size="mini" v-model="value1" placeholder="请选择">
                        <el-option
                          v-for="item in options1"
                          :key="item.value1"
                          :label="item.label"
                          :value="item.value1"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="select-item">
                      <div class="label">硬盘状态</div>
                      <el-select size="mini" v-model="value2" placeholder="请选择">
                        <el-option
                          v-for="item in options2"
                          :key="item.value2"
                          :label="item.label"
                          :value="item.value2"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="select-item">
                      <div class="lable">视频状态</div>
                      <el-select size="mini" v-model="value3" placeholder="请选择">
                        <el-option
                          v-for="item in options3"
                          :key="item.value3"
                          :label="item.label"
                          :value="item.value3"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>

              <div style="flex:1;" ref="tableBox">
                <el-table
                  :data="videotapeData"
                  stripe
                  :height="isShow ?'calc(30vh - 29px)':'calc(67vh - 29px)'"
                  :row-class-name="tableRowClassName"
                  @row-dblclick="showDetail2"
                  @selection-change="`handleSelectionChange${isCall ? 4 : 3}`()"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in (isCall ? callPolice : videotape )"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    show-overflow-tooltip
                    :sortable="item.sortable"
                    align="center"
                  ></el-table-column>
                </el-table>
                <el-pagination
                  style="text-align:right;margin-top:20px;"
                  @size-change="detailSizeChangeHandle"
                  @current-change="detailCurrentChangeHandle"
                  :current-page="detailTable.pagenum"
                  :page-size="detailTable.pagesize"
                  :page-sizes="[25, 50, 100, 200]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="videotapeDataTotal"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- 按通道---------------------------------------------------------------------------------->
          <!-- 按通道巡检结果 -->
          <el-tab-pane label="按通道" name="second">
            <div class="box-title">
              <span class="pointer" @click="changeShow(2)">
                &nbsp;&nbsp;查询结果
                <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="isShow">
              <div class="top-inner">
                <div class="btn-left">
                  <el-button size="mini" plain @click="exportFile(2)">导出</el-button>
                  <el-button size="mini" plain @click="Toprint(2)">打印</el-button>
                </div>
                <div class="inner-center">
                  <div class="search-date-container">
                    <span class="search-date">开始时间</span>
                    <el-date-picker
                      v-model="searchDate.startTime"
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyyMMdd">
                    </el-date-picker>

                    <span class="search-date">结束时间</span>
                    <el-date-picker
                      v-model="searchDate.endTime"
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyyMMdd">
                    </el-date-picker>
                  </div>
                  <div class="inner-right">
                    <span class="from">巡查任务</span>
                    <el-input v-model="searchValue2" size="medium"></el-input>
                    <el-button size="mini" plain @click="onScreening">筛选</el-button>
                  </div>
                </div>
              </div>

              <div style="flex:1;" ref="tableBox">
                <el-table
                  :data="passagewayData"
                  stripe
                  :height="'calc(30vh - 29px)'"
                  @row-click="showDetail"
                  @selection-change="handleSelectionChange2()"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in passagewayList"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :sortable="item.sortable"
                    :width="item.width"
                    show-overflow-tooltip
                    align="center"
                  ></el-table-column>
                </el-table>
                <el-pagination
                  style="text-align:right;margin-top:20px;"
                  @size-change="resultSizeChangeHandler"
                  @current-change="resultCurrentChangeHandler"
                  :current-page="resultTable.pagenum"
                  :page-size="resultTable.pagesize"
                  :page-sizes="[25, 50, 100, 200]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="passagewayDataTotal"
                ></el-pagination>
              </div>
            </div>
            <!-- 按通道结果详情 -->
            <div class="box-title">
              <span class="pointer" @click="changeShow2">
                &nbsp;&nbsp;结果详情
                <i :class="isShow2? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="isShow2">
              <div class="top-inner">
                <div class="btn-left">
                  <el-button size="mini" plain @click="exportFile(5)">导出</el-button>
                  <el-button size="mini" plain @click="Toprint(5)">打印</el-button>
                  <el-checkbox v-model="checked" style="margin-left:20px;">仅显示异常设备</el-checkbox>
                </div>
                <div class="inner-center">
                  <div class="channel-detail-select">
                    <div class="select-item">
                      <div class="label">通道类型</div>
                      <el-select size="mini" v-model="value4" placeholder="请选择">
                        <el-option
                          v-for="item in options4"
                          :key="item.value4"
                          :label="item.label"
                          :value="item.value4"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="select-item">
                      <div class="lable">视频状态</div>
                      <el-select size="mini" v-model="value5" placeholder="请选择">
                        <el-option
                          v-for="item in options5"
                          :key="item.value5"
                          :label="item.label"
                          :value="item.value5"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>

              <div style="flex:1;" ref="tableBox">
                <el-table
                  :data="accessDetailsData"
                  stripe
                  :height="isShow ?'calc(30vh - 29px)':'calc(67vh - 29px)'"
                  :row-class-name="tableRowClassName"
                  @row-dblclick="showDetail2"
                  @selection-change="handleSelectionChange5()"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in accessDetails"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    show-overflow-tooltip
                    :sortable="item.sortable"
                    align="center"
                  ></el-table-column>
                </el-table>
                <el-pagination
                  style="text-align:right;margin-top:20px;"
                  @size-change="detailSizeChangeHandle"
                  @current-change="detailCurrentChangeHandle"
                  :current-page="detailTable.pagenum"
                  :page-size="detailTable.pagesize"
                  :page-sizes="[25, 50, 100, 200]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="accessDetailsDataTotal"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 巡检详情 -->
    <div v-if="!isGo" class="details">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
        <el-breadcrumb-item>巡检记录查询</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 按钮 -->
      <div class="details-btn">
        <el-button size="mini" plain @click="isGo=true">关闭</el-button>
        <el-button size="mini" plain @click="prev">上一页</el-button>
        <el-button size="mini" plain @click="next">下一页</el-button>
        <el-button size="mini" plain v-print="'#printContent2'">打印</el-button>
      </div>
      <!-- 巡检记录详情 -->
      <div class="content-info" id="printContent2">
        <div class="table-content">
          <div class="formTit">
            <div class="title-name">巡检记录详情</div>
            <div>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检计划名称</div>
                    <span>{{details.deviceName}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">子系统</div>
                    <span>{{details.subSystemId }}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">设备类型</div>
                    <span>{{details.deviceType}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检周期</div>
                    <span>{{details.inspectPeriod}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检项</div>
                    <el-checkbox-group size="mini" disabled>
                      <el-checkbox label="在线" name="type" :vlaue="details.isOnline === 'T'"></el-checkbox>
                      <el-checkbox label="硬盘" name="type" :value="details.isInspectDisk === 'T'"></el-checkbox>
                      <el-checkbox label="视频" name="type" :value="details.isInspectVideo === 'T'"></el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检时间</div>
                    <span>{{details.inspectAt}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检日期</div>
                    <span>{{details.updatedAt}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">设备名称</div>
                    <span>{{details.deviceName}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">IP地址</div>
                    <span>{{details.devIp}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">品牌</div>
                    <span>{{details.brand}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">型号</div>
                    <span>{{details.modelNo}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">在线状态</div>
                    <span>{{details.onlineStatus}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">硬盘状态</div>
                    <span>{{details.diskStatus}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">硬盘数量</div>
                    <span>{{details.diskCount}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">硬盘总容量</div>
                    <span>{{details.allDiskCapacity}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">视频通道数量</div>
                    <span>{{details.channelCount}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">视频状态</div>
                    <span>{{details.channelStatus}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 硬盘详情 -->
        <div>
          <div class="table-biaoge">
            <div class="box-title">
              <span class="pointer" @click="changeShow3">
                &nbsp;&nbsp;硬盘详情
                <i :class="isShow5? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
          </div>
          <div ref="tableBox">
            <el-table
              :data="details.inspectDeviceDiskInfoDetail"
              stripe
              style="width:500px;"
              v-if="isShow5"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in hardDisk"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
                :sortable="item.sortable"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 视频通道详情 -->
        <div>
          <div class="table-biaoge">
            <div class="box-title">
              <span class="pointer" @click="changeShow6">
                &nbsp;&nbsp;视频通道详情
                <i :class="isShow6 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
          </div>
          <div ref="tableBox">
            <el-table
              :data="details.inspectDeviceVideoChannelInfoDetail"
              stripe
              style="width:600px;"
              v-if="isShow6"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in seePassageway"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
                :sortable="item.sortable"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  result,
  resultInfos,
  resultAisleInfos
} from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  data() {
    return {
      rowIndex: '',
      // 结果Id
      inspectResultId: '',
      flag: 1, // 1是按设备 2是按通道
      // 切换结果详情表头
      isCall: false,
      checked: true,

      // 时间筛选值
      // timeValue1: [], // 设备
      searchDate: {
        startTime: '',
        endTime: ''
      },
      timeValue2: '', //  通道
      // 搜索筛选值
      searchValue1: '', // 设备
      searchValue2: '', // 通道

      info: {
        query: '',
        pagenum: 1,
        pagesize: 25
      },
      resultTable: { // 巡检结果表格分页参数
        pagenum: 1,
        pagesize: 25
      },
      detailTable: { // 结果详情表格分页参数
        pagenum: 1,
        pagesize: 25
      },

      details: {},
      // 控制是否显示巡检记录详情
      isGo: true,
      isShow: true,
      isShow2: true,
      isShow5: true,
      isShow6: true,

      // 日期
      value1: '0',
      activeName: 'first',
      form: {
        date1: '',
        date2: ''
      },

      // 按设备巡检结果表
      equipmentList: [
        { prop: 'inspectName', label: '巡检计划名称', width: 'auto' },
        { prop: 'execDate', label: '执行日期', width: 'auto' },
        { prop: 'execTime', label: '执行时间', width: 'auto' },
        { prop: 'execResult', label: '执行结果', width: 'auto' },
        { prop: 'deviceCount', label: '巡检设备总数', width: 'auto' },
        { prop: 'abnormalDeviceCount', label: '巡检异常设备数量', width: 'auto' }
      ],
      // 按通道巡检结果表
      passagewayList: [
        { prop: 'inspectName', label: '巡检任务名称', width: 'auto' },
        { prop: 'execDate', label: '执行日期', width: 'auto' },
        { prop: 'execTime', label: '执行时间', width: 'auto' },
        { prop: 'execResult', label: '执行结果', width: 'auto' },
        { prop: 'channelCount', label: '巡检视频通道总数', width: 'auto' },
        { prop: 'abnormalChannelCount', label: '巡检异常数量', width: 'auto' }
      ],
      // 按设备录像结果详情表
      videotape: [
        { prop: 'subSystemId', label: '所属子系统', width: 'auto' },
        { prop: 'orgName', label: '所属机构', width: 'auto' },
        { prop: 'keyPartName', label: '所属重点部位', width: '120' },
        { prop: 'deviceName', label: '设备名称', width: 'auto' },
        { prop: 'deviceType', label: '设备类型', width: 'auto' },
        { prop: 'devIp', label: 'IP地址', width: 'auto' },
        { prop: 'brand', label: '品牌', width: 'auto' },
        { prop: 'modelNo', label: '型号', width: 'auto' },
        { prop: 'softVersion', label: '软件版本', width: 'auto' },
        { prop: 'onlineStatus', label: '在线状态', width: 'auto' },
        { prop: 'diskCount', label: '硬盘数量', width: 'auto' },
        { prop: 'diskStatus', label: '硬盘状态', width: 'auto' },
        { prop: 'allDiskCapacity', label: '硬盘总容量', width: 'auto' },
        { prop: 'channelCount', label: '视频通道数量', width: '120' },
        { prop: 'channelStatus', label: '视频状态', width: 'auto' }
      ],
      // 按设备报警报警主机结果详情表
      callPolice: [
        { prop: 'subSystemId', label: '所属子系统', width: 'auto' },
        { prop: 'orgId', label: '所属机构', width: 'auto' },
        { prop: 'keyPartId', label: '所属重点部位', width: '120' },
        { prop: 'deviceName', label: '设备名称', width: 'auto' },
        { prop: 'deviceType', label: '设备类型', width: 'auto' },
        { prop: 'devIp', label: 'IP地址', width: 'auto' },
        { prop: 'brand', label: '品牌', width: 'auto' },
        { prop: 'modelNo', label: '型号', width: 'auto' },
        { prop: 'softVersion', label: '软件版本', width: 'auto' },
        { prop: 'onlineStatus', label: '在线状态', width: 'auto' }
      ],
      // 通道巡检结果详情
      accessDetails: [
        { prop: 'subSystemId', label: '所属子系统', width: 'auto' },
        { prop: 'orgId', label: '所属机构', width: 'auto' },
        { prop: 'keyPartId', label: '所属重点部位', width: '300' },
        { prop: 'deviceName', label: '所属设备', width: 'auto' },
        { prop: 'deviceType', label: '设备类型', width: 'auto' },
        { prop: 'channelName', label: '通道名称', width: 'auto' },
        { prop: 'channelNum', label: '通道号', width: 'auto' },
        { prop: 'channelType', label: '通道类型', width: 'auto' },
        { prop: 'brand', label: '品牌', width: 'auto' },
        { prop: 'modelNo', label: '型号', width: 'auto' },
        { prop: 'softVersion', label: '软件版本', width: 'auto' },
        { prop: 'channelStat', label: '视频状态', width: 'auto' }
      ],
      // 硬盘详情表格
      hardDisk: [
        // 表格5硬盘详情标题行内容
        { prop: 'diskCapacity', label: '硬盘容量', width: 'auto' },
        { prop: 'diskStat', label: '硬盘状态', width: 'auto' }
      ],

      // 通道详情表格
      seePassageway: [
        { prop: 'channelNum', label: '通道号', width: 'auto' },
        { prop: 'channelName', label: '通道名称', width: 'auto' },
        { prop: 'channelType', label: '通道类型', width: 'auto' },
        { prop: 'channelStat', label: '状态', width: 'auto' }
      ],

      // 按设备巡检结果表
      equipmentData: [],
      passagewayData: [],
      videotapeData: [],
      accessDetailsData: [],

      selectData1: [],
      selectData2: [],
      selectData3: [],
      selectData4: [],
      selectData5: [],

      equipmentDataTotal: 0,
      passagewayDataTotal: 0,
      videotapeDataTotal: 0,
      accessDetailsDataTotal: 0,

      options1: [
        {
          value1: '0',
          label: '全部'
        },
        {
          value1: '2',
          label: '在线'
        },
        {
          value1: '1',
          label: '离线'
        },
        {
          value1: '3',
          label: '未知'
        }
      ],
      options2: [
        {
          value2: '0',
          label: '全部'
        },
        {
          value2: '1',
          label: '正常'
        },
        {
          value2: '2',
          label: '异常'
        },
        {
          value2: '3',
          label: '未知'
        }
      ],
      value2: '0',
      options3: [
        {
          value3: '0',
          label: '全部'
        },
        {
          value3: '1',
          label: '正常'
        },
        {
          value3: '2',
          label: '异常'
        },
        {
          value3: '3',
          label: '未知'
        }
      ],
      value3: '0',
      options4: [
        {
          value4: '选项1',
          label: '全部'
        },
        {
          value4: '选项2',
          label: '数字通道'
        },
        {
          value4: '选项3',
          label: '模拟通道'
        }
      ],
      value4: '选项1',
      options5: [
        {
          value5: '选项1',
          label: '全部'
        },
        {
          value5: '选项2',
          label: '正常'
        },
        {
          value5: '选项3',
          label: '异常'
        },
        {
          value5: '选项4',
          label: '未知'
        }
      ],
      value5: '选项1'
    }
  },
  // watch: {
  //   timeValue1() {
  //     this.getEquipmentList()
  //   }
  // },
  computed: {},
  created() {
    this.searchDate = {
      startTime: this.$moment().subtract(1, 'days').startOf('day').format('YYYYMMDD'),
      endTime: this.$moment().startOf('day').format('YYYYMMDD')
    }
  },
  mounted() {
    this.getEquipmentList()
  },
  methods: {
    handleSelectionChange1(val) {
      this.selectData1 = val
    },
    handleSelectionChange2(val) {
      this.selectData2 = val
    },
    handleSelectionChange3(val) {
      this.selectData3 = val
    },
    handleSelectionChange4(val) {
      this.selectData4 = val
    },
    handleSelectionChange5(val) {
      this.selectData5 = val
    },

    // 导出功能
    exportFile(type) {
      let list = []
      // 表头
      let tHeader = []
      // 字段名
      let filterVal = []
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      switch (type) {
        case 1:
          tHeader = ['巡检计划名称', '执行日期', '执行时间', '执行结果', '巡检设备总数', '巡检异常总数']
          filterVal = ['inspectName', 'execDate', 'execTime', 'execResult', 'deviceCount', 'abnormalDeviceCount']

          if (this.selectData1 && this.selectData1.length > 0) {
            list = this.selectData1
          } else {
            list = this.equipmentData
          }
          break
        case 2:
          tHeader = ['巡检计划名称', '执行日期', '执行时间', '执行结果', '巡检设备总数', '巡检异常总数']
          filterVal = ['inspectName', 'execDate', 'execTime', 'execResult', 'channelCount', 'abnormalChannelCount']
          if (this.selectData2 && this.selectData2.length > 0) {
            list = this.selectData2
          } else {
            list = this.passagewayData
          }
          break
        case 3:
          tHeader = [
            '所属子系统',
            '所属机构',
            '所属重点部位',
            '设备名称',
            '设备类型',
            'IP地址',
            '品牌',
            '型号',
            '软件版本',
            '在线状态',
            '硬盘数量',
            '硬盘状态',
            '硬盘总容量',
            '视频通道数量',
            '视频状态'
          ]
          filterVal = [
            'subSystemId',
            'orgName',
            'keyPartName',
            'deviceName',
            'deviceType',
            'devIp',
            'brand',
            'modelNo',
            'softVersion',
            'onlineStatus',
            'diskCount',
            'diskStatus',
            'allDiskCapacity',
            'channelCount',
            'channelStatus'
          ]
          if (this.selectData3 && this.selectData3.length > 0) {
            list = this.selectData3
          } else {
            list = this.videotapeData
          }
          break
        case 4:
          tHeader = [
            '所属子系统',
            '所属机构',
            '所属重点部位',
            '设备名称',
            '设备类型',
            'IP地址',
            '品牌',
            '型号',
            '软件版本',
            '在线状态'
          ]
          filterVal = [
            'orgId',
            'keySite',
            'Device',
            'deviceName',
            'deviceType',
            'devIp',
            'brand',
            'modelNo',
            'softVersion',
            'onlineStatus'
          ]

          if (this.selectData4 && this.selectData4.length > 0) {
            list = this.selectData4
          } else {
            list = this.videotapeData
          }
          break
        case 5:
          tHeader = [
            '所属子系统',
            '所属机构',
            '所属重点部位',
            '所属设备',
            '设备类型',
            '通道名称',
            '通道号',
            '通道类型',
            '品牌',
            '型号',
            '软件版本',
            '视频状态'
          ]
          filterVal = [
            'orgId',
            'keySite',
            'Device',
            'deviceName',
            'deviceType',
            'channelName',
            'channelNum',
            'channelType',
            'brand',
            'modelNo',
            'softVersion',
            'channelStatus'
          ]
          if (this.selectData5 && this.selectData5.length > 0) {
            list = this.selectData5
          } else {
            list = this.accessDetailsData
          }
          break
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // equipment
    // passageway
    // videotape
    // callPilice
    // accessDetails
    // 按设备结果打印方法
    Toprint(type) {
      let list = []
      let properties = []
      switch (type) {
        case 1:
          properties = [
            { field: 'inspectName', displayName: '巡检计划名称' },
            { field: 'execDate', displayName: '执行日期' },
            { field: 'execTime', displayName: '执行时间' },
            { field: 'execResult', displayName: '执行结果' },
            // { field: 'channelCount', displayName: '巡检设备总数' },
            // { field: 'abnormalChannelCount', displayName: '巡检异常总数' }
            { field: 'deviceCount', displayName: '巡检设备总数' },
            { field: 'abnormalDeviceCount', displayName: '巡检异常总数' }
          ]
          list = this.equipmentData
          if (this.selectData1 && this.selectData1.length > 0) {
            list = this.selectData1
          } else {
            list = this.equipmentData
          }
          break
        case 2:
          properties = [
            { field: 'inspectName', displayName: '巡检计划名称' },
            { field: 'execDate', displayName: '执行日期' },
            { field: 'execTime', displayName: '执行时间' },
            { field: 'execResult', displayName: '执行结果' },
            { field: 'channelCount', displayName: '巡检设备总数' },
            { field: 'abnormalChannelCount', displayName: '巡检异常总数' }
          ]
          if (this.selectData2 && this.selectData2.length > 0) {
            list = this.selectData2
          } else {
            list = this.passagewayData
          }
          break
        case 3:
          properties = [
            { field: 'orgId', displayName: '所属子系统' },
            { field: 'orgName', displayName: '所属机构' },
            { field: 'keyPartName', displayName: '所属重点部位' },
            { field: 'deviceName', displayName: '设备名称' },
            { field: 'deviceType', displayName: '设备类型' },
            { field: 'devIp', displayName: 'IP地址' },
            { field: 'brand', displayName: '品牌' },
            { field: 'modelNo', displayName: '型号' },
            { field: 'softVersion', displayName: '软件版本' },
            { field: 'onlineStatus', displayName: '在线状态' },
            { field: 'diskCount', displayName: '硬盘数量' },
            { field: 'diskStatus', displayName: '硬盘状态' },
            { field: 'allDiskCapacity', displayName: '硬盘总容量' },
            { field: 'channelCount', displayName: '视频通道数量' },
            { field: 'channelStatus', displayName: '视频状态' }
          ]
          if (this.selectData3 && this.selectData3.length > 0) {
            list = this.selectData3
          } else {
            list = this.videotapeData
          }
          break
        case 4:
          properties = [
            { field: 'orgId', displayName: '所属子系统' },
            { field: 'keySite', displayName: '所属机构' },
            { field: 'Device', displayName: '所属重点部位' },
            { field: 'deviceName', displayName: '设备名称' },
            { field: 'deviceType', displayName: '设备类型' },
            { field: 'devIp', displayName: 'IP地址' },
            { field: 'brand', displayName: '品牌' },
            { field: 'modelNo', displayName: '型号' },
            { field: 'softVersion', displayName: '软件版本' },
            { field: 'onlineStatus', displayName: '在线状态' }
          ]
          if (this.selectData4 && this.selectData4.length > 0) {
            list = this.selectData4
          } else {
            list = this.videotapeData
          }
          break
        case 5:
          properties = [
            { field: 'orgId', displayName: '所属子系统' },
            { field: 'keySite', displayName: '所属机构' },
            { field: 'Device', displayName: '所属重点部位' },
            { field: 'deviceName', displayName: '所属设备' },
            { field: 'deviceType', displayName: '设备类型' },
            { field: 'channelName', displayName: '通道名称' },
            { field: 'channelNum', displayName: '通道号' },
            { field: 'channelType', displayName: '通道类型' },
            { field: 'brand', displayName: '品牌' },
            { field: 'modelNo', displayName: '型号' },
            { field: 'softVersion', displayName: '软件版本' },
            { field: 'channelStatus', displayName: '视频状态' }
          ]
          if (this.selectData5 && this.selectData5.length > 0) {
            list = this.selectData5
          } else {
            list = this.accessDetailsData
          }
          break
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties,
        type: 'json',
        // 表题
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
      })
    },
    // 获取巡检结果
    getEquipmentList() {
      let params = {
        page: this.info.pagenum,
        limit: this.info.pagesize,
        flag: this.flag
      }
      if (this.searchDate.startTime !== '' && this.searchDate.startTime !== null) {
        params['beginTime'] = this.searchDate.startTime
      }
      if (this.searchDate.endTime !== '' && this.searchDate.endTime !== null) {
        params['endTime'] = this.searchDate.endTime
      }
      if (this.searchValue1) {
        params['taskName'] = this.searchValue1
      }

      result(params).then((res) => {
        let result = res.data
        if (this.flag === 1) {
          // 按设备查找表格数据
          this.equipmentData = result.data.taskResults || []
          this.equipmentDataTotal = result.data.count.total || 0
          this.$messageSuccess('获取列表成功')
        } else {
          // 按通道查找表格数据
          this.passagewayData = result.data.taskResults || []
          this.passagewayDataTotal = result.data.count.total || 0
          this.$messageSuccess('获取列表成功')
        }
      })
    },

    handleClick(tab, event) {
      // console.log(tab,666)
      if (tab.index === '0') {
        this.flag = 1
        this.getEquipmentList()
      } else {
        this.flag = 2
        this.getEquipmentList()
      }
    },
    // 按设备与按通道查询查询结果显示隐藏
    changeShow(num) {
      this.isShow = !this.isShow
    },
    // 按设备与按通道查询结果详情显示隐藏
    changeShow2() {
      this.isShow2 = !this.isShow2
    },
    // 硬盘详情表格显示隐藏
    changeShow3() {
      this.isShow5 = !this.isShow5
    },
    // 视频通道详情表格显示隐藏
    changeShow6() {
      this.isShow6 = !this.isShow6
    },
    // 筛选按钮点击事件
    onScreening() {
      this.getEquipmentList()
    },
    showDetail(row, column, event) {
      this.inspectResultId = String(row.id)
      let params = {
        // limit: this.info.pagesize,
        // page: this.info.pagenum,
        limit: this.detailTable.pagesize,
        page: this.detailTable.pagenum,
        isException: this.checked ? 1 : 0,
        // onlineStatus: '',
        inspectResultId: this.inspectResultId
      }
      if (this.value1 !== '0') {
        params.onlineStatus = this.value1
      }
      if (this.value2 !== '0') {
        params.diskStatus = this.value2
      }
      if (this.value3 !== '0') {
        params.channelStatus = this.value3
      }

      if (this.flag === 1) {
        resultInfos(params).then((res) => {
          let result = res.data
          if (this.flag === 1) {
            if (result.data && result.data.infos && result.data.infos.subSystemId === 1 && result.data.infos.deviceType !== 4) {
              this.isCall = false
            } else {
              this.isCall = true
            }
            result.data.infos.forEach(item => {
              item.onlineStatus = ['', '离线', '在线', '未知'][Number(item.onlineStatus)]
              item.diskStatus = ['', '正常', '异常', '未知'][Number(item.diskStatus)]
              item.channelStatus = ['', '正常', '异常', '未知'][Number(item.channelStatus)]
            })
            this.videotapeData = result.data.infos
            this.videotapeDataTotal = result.count.total
          } else {
            this.accessDetailsData = result.data.infos
            this.accessDetailsDataTotal = result.count.total
            this.$messageSuccess('获取列表成功')
          }

          // this.details.deviceDiskInfoDetail = result.data.infos.deviceDiskInfoDetail
          // this.details.deviceVideoChannelInfoDetail = result.data.infos.deviceVideoChannelInfoDetail
          // console.log(this.details, '==================================')
          // this.$messageSuccess('获取列表成功')
        })
      } else {
        resultAisleInfos(params).then((res) => {
          let result = res.data
          this.accessDetailsData = result.data.channelInfos
          this.$messageSuccess('获取列表成功')
        })
      }
    },
    tableRowClassName({row, rowIndex}) {
      row.row_index = rowIndex
    },
    showDetail2(row, column, event) {
      this.rowIndex = row.row_index + 1
      let params = {
        page: this.rowIndex,
        limit: 1,
        inspectResultId: this.inspectResultId
      }
      resultInfos(params).then(res => {
        let result = res.data.data
        this.details = result.infos[0]
      }).catch(err => {
        this.$messageError(err.msg)
      })

      // this.details = row
      this.isGo = false
    },

    resultSizeChangeHandler(size) {
      this.info.pagesize = size
      this.getEquipmentList()
    },
    resultCurrentChangeHandler(page) {
      this.info.pagenum = page
      this.getEquipmentList()
    },
    detailSizeChangeHandle(size) {
      this.info.pagesize = size
      // 结果详情接口
    },
    detailCurrentChangeHandle(page) {
      this.info.pagenum = page
      // 结果详情接口
    },

    prev() {
      this.rowIndex = this.rowIndex - 1
      let params = {
        page: this.rowIndex,
        limit: 1,
        inspectResultId: this.inspectResultId
      }
      resultInfos(params).then(res => {
        let result = res.data.data
        this.details = result.infos[0]
      }).catch(err => {
        this.$messageError(err.msg)
      })
    },
    next() {
      this.rowIndex = this.rowIndex + 1
      let params = {
        page: this.rowIndex,
        limit: 1,
        inspectResultId: this.inspectResultId
      }
      resultInfos(params).then(res => {
        let result = res.data.data
        this.details = result.infos[0]
      }).catch(err => {
        this.$messageError(err.msg)
      })
    }
    // handleSelectionChange() {},
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

          .search-date-container {
            .search-date {
              width: 50px;
              margin: 0 5px 0 15px;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
              width: 130px;
            }
          }
          .device-detail-select {
            width: 500px;
            display: flex;
            justify-content: space-between;
            .select-item {
              width: 150px;
              display: flex;
              justify-content: space-between;
              line-height: 40px;
            }
            .el-select--mini {
              width: 87px;
            }
          }
          .channel-detail-select {
            width: 350px;
            display: flex;
            justify-content: space-between;
            .select-item {
              width: 160px;
              display: flex;
              justify-content: space-between;
              line-height: 40px;
            }
            .el-select--mini {
              width: 100px;
            }
          }
          .inner-right {
            span {
              width: 60px;
            }
            .el-input {
              width: 120px;
              margin-right: 8px;
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
</style>
