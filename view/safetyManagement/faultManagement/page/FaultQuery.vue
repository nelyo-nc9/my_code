<template>
  <div class="query-content">
    <div class="bread">
      <i class="el-icon-location-outline"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>故障管理</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="top-content">
      <div class="form-title">
        <span>查询条件</span>
        <i :class="{'el-icon-arrow-up': isshow, 'el-icon-arrow-down': !isshow}"
           class="icon"
           @click="isShowForm"></i>
        <p></p>
      </div>
      <div class="form-box"
           v-show="isshow">
        <div class="form-content">
          <div class="form-content-left">
            <el-form ref="form"
                     :model="form"
                     size="mini"
                     label-width="160px">
              <el-form-item label="所属机构">
                <el-select v-model="form.orgId"></el-select>
              </el-form-item>
              <el-form-item label="所属平台">
                <el-select v-model="form.platformId"></el-select>
              </el-form-item>
              <el-form-item label="设备名称">
                <el-input v-model="form.guardName"
                          style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="品牌">
                <el-select v-model="form.logType">
                  <el-option label="全部"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工程商">
                <el-select v-model="form.logType">
                  <el-option label="全部"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申报原因">
                <el-input v-model="form.guardName"
                          style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="故障类型">
                <el-select v-model="form.logType">
                  <el-option label="设备故障"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="故障处理时长（大于）">
                <el-input v-model="form.guardName"
                          style="width:193px;"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="form.startTime"
                                type="datetime"
                                style="width:193px;">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="form-content-right">
            <el-form ref="form"
                     :model="form"
                     size="mini"
                     label-width="160px">
              <el-form-item label="所属重点部位">
                <el-select v-model="form.keyPartId"></el-select>
              </el-form-item>
              <el-form-item label="所属设备">
                <el-select v-model="form.subLogType"></el-select>
              </el-form-item>
              <el-form-item label="设备类型">
                <el-select v-model="form.logType">
                  <el-option label="全部"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="型号">
                <el-select v-model="form.logType">
                  <el-option label="全部"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="维保商">
                <el-select v-model="form.logType">
                  <el-option label="全部"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="故障来源">
                <el-select v-model="form.logType">
                  <el-option label="前端"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="故障状态">
                <el-select v-model="form.logType">
                  <el-option label="处理中"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <p style="height:29px;"></p>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="form.endTime"
                                type="datetime"
                                style="width:193px;">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button size="mini"
                     @click="seachEvent">查询</el-button>
          <el-button size="mini"
                     @click="cleanForm">重置</el-button>
          <el-button size="mini">导出</el-button>
        </div>
      </div>
    </div>
    <div class="table-content"
         ref="tableBox"
         v-show="isShowTable">
      <div class="table-title">
        <span>查询结果</span>
        <p></p>
      </div>
      <el-table :data="tableData"
                border
                style="width: 100%;"
                size="mini"
                tooltip-effect="dark"
                stripe
                :height="tableHeight"
                @row-dblclick="clickTableRow">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index"
                         label="序号"></el-table-column>
        <el-table-column v-for="item in tableColumn"
                         :key="item.label"
                         :prop="item.prop"
                         :label="item.label"></el-table-column>
      </el-table>
      <el-pagination style="text-align:center;"
                     :page-sizes="[25, 50, 100, 200]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="312"></el-pagination>
    </div>
    <el-dialog title="查询结果"
               :visible.sync="isShowTableModal"
               width="40%"
               center>
      <div class="detail-box">
        <div class="detail-item">
          <div class="item-left">所属子系统</div>
          <div class="item-right">{{rowTableMsg.subsystem}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属机构</div>
          <div class="item-right">{{rowTableMsg.orgName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属重点部位</div>
          <div class="item-right">{{rowTableMsg.keySite}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属防护舱主机</div>
          <div class="item-right">{{rowTableMsg.deviceType}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">防护舱通道名称</div>
          <div class="item-right">{{rowTableMsg.deviceName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">日志类型</div>
          <div class="item-right">{{rowTableMsg.code}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">日志子类型</div>
          <div class="item-right">{{rowTableMsg.netModuleBrand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">时间</div>
          <div class="item-right">{{rowTableMsg.netModuleModel}}</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="isShowTableModal = false">取 消</el-button>
        <el-button type="primary"
                   @click="isShowTableModal = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isShowTableModal: false,
      rowTableMsg: {},
      isShowTable: true,
      nowHeight: 0,
      tableHeight: 250,
      isshow: true,
      form: {
        // 表单数据数据
        orgId: '',
        platformId: '',
        logType: '',
        guardName: '',
        keyPartId: '',
        subLogType: '',
        guardChannelName: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      tableColumn: [
        // 表格标题行内容
        { prop: 'organization', label: '所属机构', width: '' },
        { prop: 'keyPartName', label: '重点部位', width: '' },
        { prop: 'device', label: '门禁主机', width: '' },
        { prop: 'logType', label: '记录类型', width: '' },
        { prop: 'subLogType', label: '事件类型/报警类型', width: '' },
        { prop: 'occurTime', label: '时间', width: '' }
      ]
    }
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.changeTableHeight()
  },
  methods: {
    cleanForm() {
      this.form = {
        orgId: '',
        platformId: '',
        logType: '',
        guardName: '',
        keyPartId: '',
        subLogType: '',
        guardChannelName: '',
        startTime: '',
        endTime: ''
      }
    },
    seachEvent() {},
    changeTableHeight() {
      this.nowHeight = this.$refs.tableBox.offsetHeight
      this.$nextTick(() => {
        this.tableHeight = this.$refs.tableBox.offsetHeight - 150
      })
    },
    isShowForm() {
      this.isshow = !this.isshow
      if (this.isshow) {
        this.tableHeight = this.nowHeight - 150
      }
      this.changeTableHeight()
    },
    clickTableRow(row) {
      this.isShowTableModal = true
      console.log(row)
    }
  }
}
</script>

<style scoped lang='less'>
.query-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  /deep/ .el-form {
    .el-form-item__content {
      .el-select {
        .el-input {
          .el-input__inner {
            width: 200px;
          }
        }
      }
      .el-input {
        .el-input__inner {
          width: 200px;
        }
      }
    }
  }
  .bread {
    height: 34px;
    i {
      margin-right: 5px;
    }
    display: flex;
    align-items: c;
    align-items: center;
    padding: 10px 0px 10px 25px;
  }
  .top-content {
    height: 514px;
    .form-title {
      display: flex;
      height: 32px;
      line-height: 32px;
      margin-left: 32px;
      .icon {
        margin: 10px 18px 0px 6px;
      }
      .icon:hover {
        cursor: pointer;
      }
      p {
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-top: 16px;
      }
    }
    .form-content {
      width: 828px;
      display: flex;
      justify-content: space-between;
      border: 1px solid #e1e1e1;
      padding: 10px 50px 0px;
      margin-left: 60px;
    }
    .form-footer {
      width: 800px;
      margin-top: 20px;
      text-align: center;
    }
  }
  .table-content {
    // display: flex;
    flex: 1;
    // flex-direction: column;
    .table-title {
      display: flex;
      height: 32px;
      line-height: 32px;
      margin: 32px 0px 0px 32px;
      p {
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin: 16px 36px;
      }
    }
    .table-btn {
      margin: 12px 0px 12px 32px;
    }
  }
  .detail-box {
    color: #666;
    width: 100%;
    padding: 8px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 128px;
        text-align: center;
        background: #f8f8f8;
        border: 1px solid #fff;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
}
</style>
