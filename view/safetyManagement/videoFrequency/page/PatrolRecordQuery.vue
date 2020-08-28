<template>
  <div class="content-page">
    <div class="right-content" v-if="isGo">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>录像时长巡检</el-breadcrumb-item>
            <el-breadcrumb-item>录像时长巡检记录查询</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <span class="title">巡检结果</span>
        <span class="border-span"></span>
        <div class="table-top">
          <div class="left">
            <el-button size="mini">导出</el-button>
            <el-button size="mini">打印</el-button>
          </div>
          <div class="right">
            <span class="demonstration">选择日期</span>
            <el-date-picker size="medium" v-model="timeValue1" type="datetimerange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>
            <span class="from">巡查任务</span>
            <el-input v-model="input" placeholder="请输入内容" style="width:230px" size="medium" ></el-input>
            <el-button size="mini" plain @click="onScreening">筛选</el-button>
          </div>
        </div>
        <el-table :data="tableData"
                  border
                  size="mini"
                  stripe
                  height='calc(100% - 78px)'>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column v-for="item in tableColumnTop"
                           :key="item.label"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :sortable="item.sortable"
                           show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination style="text-align:center;"
                       :page-sizes="[25, 50, 100, 200]"
                       :page-size="100"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="400"></el-pagination>
        <span class="title">结果详情</span>
        <span class="border-span"></span>
        <span class="table-top">
          <span>
            <el-button size="mini">导出</el-button>
            <el-button size="mini">打印</el-button>
          </span>
          <span>
            <span>检测结果</span>
            <el-select v-model="form.value"
                       placeholder="请选择">
              <el-option label="全部"
                         value="1"></el-option>
              <el-option label="符合"
                         value="2"></el-option>
              <el-option label="不符合"
                         value="3"></el-option>
            </el-select>
          </span>
        </span>
        <el-table :data="tableData1"
                  border
                  size="mini"
                  stripe
                  height='calc(100% - 78px)'
                  @row-dblclick="showView">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column v-for="item in tableColumnBottom"
                           :key="item.label"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :sortable="item.sortable"
                           show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination style="text-align:center;"
                       :page-sizes="[25, 50, 100, 200]"
                       :page-size="100"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="400"></el-pagination>
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
        <el-button size="mini" plain>上一页</el-button>
        <el-button size="mini" plain>下一页</el-button>
        <el-button size="mini" plain>打印</el-button>
      </div>
      <!-- 巡检记录详情 -->
      <div class="content-info">
        <div class="table-content">
          <div class="formTit">
            <div class="title-name">巡检记录详情</div>
            <div>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检计划名称</div>
                    <span>{{details.name}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">子系统</div>
                    <span>{{details.system}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">设备类型</div>
                    <span>{{details.deviceType}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检周期</div>
                    <span>{{form.cycle}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检项</div>
                    <el-checkbox-group size="mini" v-model="form.type" disabled>
                      <el-checkbox label="在线" name="type"></el-checkbox>
                      <el-checkbox label="硬盘" name="type"></el-checkbox>
                      <el-checkbox label="视频" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">巡检时间</div>
                    <span>{{details.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">巡检日期</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">设备名称</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">IP地址</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">品牌</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">型号</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">在线状态</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">硬盘状态</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">硬盘数量</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">硬盘总容量</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">视频通道数量</div>
                    <span>{{form.times}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">视频状态</div>
                    <span>{{form.cycle}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 月历详情 -->
        <div>
          <div class="table-biaoge">
            <div class="box-title">
              <span class="pointer">
                &nbsp;&nbsp;录像月历详情
                <!-- <i :class="isShow5? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i> -->
              </span>
            </div>
          </div>
          <div class="calender">
            <el-calendar v-model="val">
              <template
                slot="dateCell"
                slot-scope="{date, data}"
              >
                <!-- <div v-if ="data.type === 'current-month'">{{ flags(data.day.split('-').slice(2)[0]) === 1 }}</div> -->
                <div :class="{ 'red': flags(data.day.split('-').slice(2)[0]) === 1 && data.type === 'current-month' }">{{data.day.split('-').slice(2)[0] }} {{ data.isSelected ? '✔️' : ''}}</div>
              </template>
            </el-calendar>
            <div class="reference">
              <span>无录像</span>
              <span>有录像</span>
              <span>未知</span>
            </div>
          </div>
          
        </div>
    
      </div>
    </div>
    <!-- <template v-else> 
      
    </template> -->
  </div>
</template>

<script>
export default {
  data() {
    return {

      isGo:true,
      timeValue1: '',
      input: '',
      isShow: true,
      val: new Date(),
      datas: [
        {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1}, {type: 1},
        {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2}, {type: 2},
        {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}, {type: 3}
      ],
      selectTime: '',
      form: {
        value: '1',
        input: ''
      },
      tableColumnTop: [
        // 表格标题行内容
        { prop: 'subsystem', label: '巡检任务名称', sortable: true },
        { prop: 'orgId', label: '计划录像保存天数', sortable: true },
        { prop: 'keySite', label: '执行日期', sortable: true },
        { prop: 'deviceType', label: '执行时间', sortable: true },
        { prop: 'deviceName', label: '执行结果', sortable: true },
        { prop: 'deviceName', label: '检测通道总数', sortable: true },
        { prop: 'deviceName', label: '检测异常数量', sortable: true }
      ],
      tableColumnBottom: [
        // 表格标题行内容
        { prop: 'orgId', label: '所属机构', sortable: true },
        { prop: 'keySite', label: '所属重点部位', sortable: true },
        { prop: 'deviceType', label: '所属设备', sortable: true },
        { prop: 'deviceName', label: '通道名称', sortable: true },
        { prop: 'code', label: '通道号', sortable: true },
        { prop: 'brand', label: '通道类型', sortable: true },
        { prop: 'deviceModel', label: '品牌', sortable: true },
        { prop: 'netModuleBrand', label: '型号', sortable: true },
        { prop: 'netModuleModel', label: '在线状态', sortable: true },
        { prop: 'netModuleModel', label: '已录天数', sortable: true },
        { prop: 'netModuleModel', label: '计划录像保存天数', sortable: true },
        { prop: 'netModuleModel', label: '检测结果', sortable: true }
      ],
      tableData: [
        // 列表数据
        {
          deviceName: 666
        },
        {
          deviceName: 666
        },
        {
          deviceName: 666
        },
        {
          deviceName: 666
        }
      ],
      tableData1: [
        {netModuleModel: '成功'}, {netModuleModel: '成功'}, {netModuleModel: '成功'}, {netModuleModel: '成功'}, {netModuleModel: '成功'},
      ],
            details: {
        inspectId: 'culpa laboris exercitation',
        inspectResultId: 'labore',
        orgId: 'consectetur',
        subSystemId: 'ipsum ea dolore sed',
        KeyPartId: 'ullamco est nostrud proident',
        deviceName: 'aliquip veniam',
        deviceId: 'sint minim ullamco esse tempor',
        deviceType: 'ullamco aliquip voluptate',
        channelType: 'enim velit irure',
        channelNum: 'fugiat ex sunt ullamco',
        channelName: 'Duis',
        modelNo: 'irure nostrud Duis dolor',
        brand: 'irure cupidatat enim magna',
        devIp: 'labore sunt do quis',
        diskCount: 'nulla Ut nostrud',
        onlineStatus: 'nulla sint magna est minim',
        softVersion: 'cupidatat officia',
        deviceVideoChannelInfoDetail: [
          {
            resultDetailId: -26250972,
            channelId: -92801351,
            channelName: 'fugiat nisi',
            channelType: -18068197,
            channelStat: 'minim ad',
            id: 'in tempor in irure',
            channelNum: 'irure eiusmod',
          },
          {
            resultDetailId: 76442410,
            channelId: 42656586,
            channelName: 'nulla eiusmod nostrud ipsum',
            channelType: -22006017,
            channelStat: 'ipsum',
            id: 'exercitation amet',
            channelNum: 'et consequat enim',
          },
        ],
        channelStatus: 'amet fugiat laboris',
        channelCount: 'aute est culpa voluptate in',
        allDiskCapacity: 'sint sunt deserunt consectetur laborum',
        diskStatus: 'minim anim tempor Lorem cillum',
        deviceDiskInfoDetail: [
          { resultDetailId: 44128022, diskCapacity: 'ea', diskStat: 'irure anim Lorem nostrud eu', id: 'mollit in' },
          {
            resultDetailId: -76850489,
            diskCapacity: 'dolore veniam reprehenderit',
            diskStat: 'labore aliquip mollit',
            id: 'cillum ipsum minim proident nisi',
          },
        ],
      },
    }
  },
  watch: {
    val(news, olds) {
      console.log(news.toLocaleString(), olds.toLocaleString())
    }
  },
  mounted() {},
  methods: {
    flags(dayNum) {
      // console.log(this.datas[dayNum - 1])
      return this.datas[dayNum - 1]['type']
    },
    showView() {
      this.isGo = !this.isGo
    },
    onScreening(){

    }
  }
}
</script>

<style lang="less" scoped>
.calender{
  width: 800px;
  display: flex;
}
.reference {
  display: flex;
  flex-direction: column;
  span{
    display: inline-block;
    width: 100px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 12px;
    color: #fff;
    &:first-of-type{
      background: #F56C6C;
    }
    &:nth-of-type(2){
      background: #67C23A;
    }
    &:last-of-type{
      background: #e1e1e1;
    }
  }
}
/deep/.el-calendar{
  width: 500px;
}
.red{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #F56C6C;
}
.green{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #67C23A;
}
/deep/.el-calendar-day{
  height: 35px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

}

.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  .el-breadcrumb {
    i {
      margin-right: 5px;
    }
    display: flex;
    align-items: c;
    align-items: center;
    padding: 10px 0px 10px 3px;
  }
  .right-content {
    height: 100%;
    width: 100%;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .table-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .table-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        /deep/ .el-select {
          margin-left: 5px;
          .el-input {
            .el-input__inner {
              height: 25px;
              width: 81px;
              border-radius: 0px;
            }
            .el-input__suffix {
              .el-input__suffix-inner {
                i {
                  line-height: 25px;
                }
              }
            }
          }
        }
      }
      .title {
        font-size: 13px;
        margin-top: 10px;
      }
      .border-span {
        width: 100%;
        height: 1px;
        background: #ccc;
        margin-bottom: 15px;
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
</style>
