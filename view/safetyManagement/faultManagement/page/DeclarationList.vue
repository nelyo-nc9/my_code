<template>
  <div class="content-page">
    <div class="left-tree">
      <OrgTree></OrgTree>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
            <el-breadcrumb-item>故障管理</el-breadcrumb-item>
            <el-breadcrumb-item>故障申报</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="table-box">
        <div class="table-top">
          <div class="button-box">
            <el-button size="mini">新建</el-button>
            <el-button size="mini">编辑</el-button>
            <el-button size="mini">详情</el-button>
            <el-button size="mini"
                       @click="centerDialogVisible=true">处理</el-button>
            <el-button size="mini">导出</el-button>
            <el-button size="mini">打印</el-button>
            <el-checkbox v-model="isShowSubOrg">显示子机构</el-checkbox>
          </div>
          <div>
            <el-input suffix-icon="el-icon-search"
                      size="mini"></el-input>
            <el-button size="mini">搜索</el-button>
          </div>
        </div>
        <div style="flex:1;"
             ref="tableBox">
          <el-table :data="tableData"
                    border
                    size="mini"
                    stripe
                    :height="'calc(100% - 29px)'">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"
                             label="序号"></el-table-column>
            <el-table-column v-for="item in tableColumn"
                             :key="item.label"
                             :prop="item.prop"
                             :label="item.label"
                             :width="item.width"
                             :sortable="item.sortable"
                             show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination style="text-align:right;"
                         :page-sizes="[25, 50, 100, 200]"
                         :page-size="100"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="400"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="故障申报处理"
               :visible.sync="centerDialogVisible"
               :before-close="handleClose"
               center>
      <div class="form-content">
        <div class="form-content-left">
          <el-form ref="form"
                   :model="form"
                   size="mini"
                   label-width="68px">
            <el-form-item label="故障设备">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属机构">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属平台">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="发现人">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="申报类型">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-content-right">
          <el-form ref="form"
                   :model="form"
                   size="mini"
                   label-width="100px">
            <el-form-item label="故障单号">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属重点部位">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属设备">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="发现时间">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="申报原因">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="opinion">
        <div class='left-form'>
          <el-form ref="form"
                   :model="form"
                   size="mini"
                   label-width="160px">
            <el-form-item label="处理方式">
              <el-select v-model="form.handlingMethod">
                <el-option label="误报"
                           value="1">
                </el-option>
                <el-option label="保修"
                           value="2">
                </el-option>
                <el-option label="其他"
                           value="3">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌"
                          v-if="form.handlingMethod!=='1'">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="工程商"
                          v-if="form.handlingMethod==='2'">
              <el-select v-model="form.orgId">
                <el-option label="全部"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="维修人"
                          v-if="form.handlingMethod==='2'">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="处理时限"
                          v-if="form.handlingMethod==='2'">
              <el-select v-model="form.orgId">
                <el-option label="误报"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=""
                          v-if="form.handlingMethod!=='1'">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="屏蔽报警"
                             name="type"></el-checkbox>
                <el-checkbox label="短信通知维修人"
                             name="type"
                             v-if="form.handlingMethod!=='3'"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="屏蔽时限"
                          v-if="form.handlingMethod==='3'">
              <el-select v-model="form.orgId">
                <el-option label="误报"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处理意见">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class='right-form'>
          <el-form ref="form"
                   :model="form"
                   size="mini"
                   label-width="160px">
            <el-form-item label="型号"
                          v-if="form.handlingMethod!=='1'">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="维保商"
                          v-if="form.handlingMethod==='2'">
              <el-select v-model="form.orgId">
                <el-option label="误报"
                           value="1">
                </el-option>
                <el-option label="保修"
                           value="1">
                </el-option>
                <el-option label="其他"
                           value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="维修人电话"
                          v-if="form.handlingMethod==='2'">
              <el-input v-model="form.guardName"
                        style="width:193px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="centerDialogVisible = false">创建故障单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OrgTree from '../../components/OrgTree'
export default {
  components: {
    OrgTree
  },
  data() {
    return {
      centerDialogVisible: false,
      isShowSubOrg: true,
      tableColumn: [
        // 表格标题行内容
        { prop: 'subsystem', label: '故障单号', width: '110', sortable: true },
        { prop: 'orgId', label: '所属机构', width: '100', sortable: true },
        { prop: 'keySite', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'deviceType', label: '所属平台', width: '120', sortable: true },
        { prop: 'deviceName', label: '所属设备', width: '100', sortable: true },
        { prop: 'code', label: '设备名称', width: '100', sortable: true },
        { prop: 'brand', label: '发现时间', width: '100', sortable: true },
        { prop: 'deviceModel', label: '发现人', width: '100', sortable: true },
        { prop: 'netModuleBrand', label: '申报类型', width: '120', sortable: true },
        { prop: 'netModuleModel', label: '申报原因', width: '120', sortable: true },
        { prop: 'netModuleID', label: '处理状态', width: '110', sortable: true },
        { prop: 'keyboardPassword', label: '处理意见', width: '100', sortable: true },
        { prop: 'ip', label: '处理人', width: '100', sortable: true },
        { prop: 'port', label: '处理时间', width: '100', sortable: true },
        { prop: 'userName', label: '录入机构', width: '100', sortable: true },
        { prop: 'password', label: '录入人', width: '100', sortable: true },
        { prop: 'service', label: '录入时间', width: '100', sortable: true }
      ],
      tableData: [
        // 列表数据
      ],
      form: {
        // 表单数据数据
        handlingMethod: '1',
        type: [],
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
    }
  },
  mounted() {},
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="less" scoped>
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
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      .table-top {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 10px 0px;
        box-sizing: border-box;
        .button-box {
          display: flex;
          align-items: center;
          .el-checkbox {
            margin-left: 10px;
          }
        }
        div {
          display: flex;
          .el-input {
            margin-right: 8px;
          }
        }
      }
    }
  }
  .detail-box,
  .detail-bottom {
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
        width: 100px;
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
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-center {
    width: 100%;
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      text-align: left;
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
  }
  .detail-footer {
    margin-top: 24px;
    display: flex;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.form-content {
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  /* justify-content: space-between; */
  border: 1px solid #e1e1e1;
  /* margin-left: 60px; */
  justify-content: space-around;
  padding-top: 20px;
}
.opinion {
  margin-top: 15px;
  display: flex;
}
.el-dialog--center .el-dialog__footer {
  .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 13px;
    border-radius: 4px;
  }
}
</style>
