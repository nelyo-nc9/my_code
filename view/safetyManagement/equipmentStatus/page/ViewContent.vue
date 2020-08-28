<template>
  <div class="content-page">
    <div class="right-content">
      <div class="table-box">
        <div class="table-top">
          <!-- 头部左 -->
          <div class="button-box">
            <el-button size="mini">ping检测</el-button>
            <!-- <el-button size="mini" @click="centerDialogVisible=true">报修</el-button> -->
            <el-button size="mini">刷新</el-button>
            <el-button size="mini">导出</el-button>
            <el-button size="mini">打印</el-button>
            <el-checkbox v-model="isShowSubOrg">显示子机构</el-checkbox>
            <div class="count">
              <span>统计:</span>
              <span @click="statistics(2)">{{inLine}}</span>
              <span>|</span>
              <span @click="statistics(1)">{{onLine}}</span>
            </div>
          </div>
          <!-- 头部右 -->
          <div>
            <span class="from">在线状态</span>
            <el-select v-model="from"></el-select>
            <el-input suffix-icon="el-icon-search" size="mini"></el-input>
            <el-button size="mini">搜索</el-button>
          </div>
        </div>
        <div style="flex:1;" ref="tableBox">
          <el-table :data="tableData" border size="mini" stripe :height="'calc(80vh - 29px)'" @row-dblclick="showDetail" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" :sortable="item.sortable" show-overflow-tooltip align="center"></el-table-column>
          </el-table>
          <el-pagination style="text-align:center;" :page-sizes="[25, 50, 100, 200]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="故障催单处理" :visible.sync="centerDialogVisible" center>
      <div class="form-content">
        <div class="form-content-left">
          <el-form ref="form" :model="form" size="mini" label-width="68px">
            <el-form-item label="故障设备">
              <el-input :disabled="true" v-model="form.badEquipment" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属机构">
              <el-input :disabled="true" v-model="form.orgId" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属平台">
              <el-input :disabled="true" v-model="form.platformId" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="发现人">
              <el-input :disabled="true" v-model="form.findName" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="申报类型">
              <el-select v-model="form.chooseType">
                <el-option label="网络故障" value="1"></el-option>
                <el-option label="设备故障" value="2"></el-option>
                <el-option label="软件故障" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-content-right">
          <el-form ref="form" :model="form" size="mini" label-width="100px">
            <el-form-item label="故障单号">
              <el-input :disabled="true" v-model="form.faultNumber" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属重点部位">
              <el-input :disabled="true" v-model="form.keyParts" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="所属设备">
              <el-input :disabled="true" v-model="form.equipmentId" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="发现时间">
              <el-input :disabled="true" v-model="form.findTime" style="width:193px;"></el-input>
            </el-form-item>
            <el-form-item label="申报原因">
              <el-input v-model="form.declareReasons" style="width:193px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">保 存</el-button>
        <el-button @click="cleanForm">重 置</el-button>
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { interactiveDoorRecord } from '../../../../http/InterlockingDoor/linkedAirlockLog.api'
export default {
  data() {
    return {
      from: '',
      // 对话框显示与否
      centerDialogVisible: false,
      isShowSubOrg: true,
      form: {
        // 表单数据数据
        badEquipment: 'a',
        orgId: 'a',
        platformId: 's',
        findName: 's',
        chooseType: 'd',
        faultNumber: 'f',
        keyParts: 'g',
        equipmentId: 'h',
        findTime: 'j',
        declareReasons: 'k'
      },
      tableColumn: [
        // 表格标题行内容
        { prop: 'orgId', label: '所属机构', width: 'auto', sortable: true },
        { prop: 'keySite', label: '所属重点部位', width: '200', sortable: true },
        { prop: 'Device', label: '设备类型', width: '200', sortable: true },
        { prop: 'code', label: '设备名称', width: '200', sortable: true },
        { prop: 'address', label: 'IP地址', width: '200', sortable: true },
        { prop: 'state', label: '在线状态', width: '150', sortable: true },
        { prop: 'brand', label: '品牌', width: '150', sortable: true },
        { prop: 'equipmentModel', label: '-型号', width: '150', sortable: true },
      ],
      tableData: [
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: '在线',
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        },
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: '在线',
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        }, {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: '在线',
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        }, {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: '在线',
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        }
      ],
      selectItem: []
    }
  },
  mounted() {
    this.seachEvent()
  },
  methods: {
    handleSelectionChange() { },
    showDetail() { },
    cleanForm() {
      this.form = {
        badEquipment: '',
        orgId: '',
        platformId: '',
        findName: '',
        chooseType: '',
        faultNumber: '',
        keyParts: '',
        equipmentId: '',
        findTime: '',
        declareReasons: ''
      }
    },
    seachEvent() {
      interactiveDoorRecord(this.form).then(res => {
        if (res.data.code === 0) {
          res.data.data.list.forEach(item => {
            if (item.logType === '1') {
              item.logType = '事件'
            } else if (item.logType === '2') {
              item.logType = '报警'
            }
          })
          this.tableData = res.data.data.list
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-page {
  width: 100%;
  height: 100%;
  position: relative;
  .right-content {
    height: 100%;
    width: 100%;
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
        box-sizing: border-box;
        .button-box {
          display: flex;
          align-items: center;
          .el-checkbox {
            margin-left: 10px;
          }
          .count {
            margin-left: 200px;
            display: flex;
            span {
              margin: 0 10px;
              display: flex;
              align-items: center;
            }
            span:nth-child(1) {
              font-weight: 700;
            }
            span:nth-child(2) {
              color: green;
            }
            span:nth-child(4) {
              color: red;
            }
          }
        }
        div {
          display: flex;
          align-items: center;
          .from {
            width: 100px;
            margin-right: 10px;
            font-size: 13px;
          }
          .el-input {
            margin-right: 8px;
          }
          /deep/ .el-select {
            margin-right: 8px;
            .el-input {
              // height: 28px;
              .el-input__inner {
                height: 28px;
              }
              .el-input__suffix {
                height: 28px;
                .el-select__caret {
                  line-height: 28px;
                }
              }
            }
          }
        }
      }
    }
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


</style>
