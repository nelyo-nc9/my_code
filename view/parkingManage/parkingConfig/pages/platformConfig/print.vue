<template>
  <div class="main">
    <div class="heads">
      <el-button size="samll"
                 v-if="dayinxianshi"
                 @click="createListBtn('create')">新建</el-button>
      <el-button size="samll"
                 v-if="dayinxianshi"
                 @click="createListBtn('edit')">编辑</el-button>
      <el-button size="samll"
                 v-if="dayinxianshi"
                 @click="dialogVisibleBtn">删除</el-button>
      <el-button size="samll"
                 v-if="dayinxianshi"
                 @click="hostExprot">获取</el-button>
      <el-button size="samll"
                 v-if="dayinxianshi"
                 @click="printBtn">打印</el-button>
      <el-button size="samll"
                 v-if="!dayinxianshi"
                 @click="Toprint">打印</el-button>
      <el-button size="samll"
                 v-if="!dayinxianshi"
                 @click="closePrint">取消</el-button>
    </div>
    <div class="content-box"
         v-if="isPrintShow">
      <div>{{titleTop}}</div>
      <div class="detail-box">
        <div class="detail-item">
          <div class="item-left">所属机构</div>
          <div class="item-right">{{formData.nameLable}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属重点单位</div>
          <div class="item-right">{{formData.locationLable}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">停车平台名称</div>
          <div class="item-right">{{formData.name}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">停车平台ID</div>
          <div class="item-right">{{formData.uniqueId}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">品牌</div>
          <div class="item-right">{{formData.brand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">版本</div>
          <div class="item-right">{{formData.version}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">IP地址</div>
          <div class="item-right">{{formData.ip}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">端口</div>
          <div class="item-right">{{formData.port}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">资产编码</div>
          <div class="item-right">{{formData.assetCode}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">接入服务器</div>
          <div class="item-right">{{formData.accessService}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">备注</div>
          <div class="item-right">{{formData.remark}}</div>
        </div>
      </div>
      <div class="first">
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{formData.updatedAt}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{formData.updatedDept}}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{formData.updatedBy}}</div>
          </div>
        </div>
        <div class="bottom-box">
          <div style="width:70%;margin-left: 120px;">
            <div class="box-title">
              <span class="pointer"
                    @click="toggleOpen('detector')">
                停车主机列表
                <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
            <div v-if="dropdownStatus.detector"
                 style="width:100%;margin-left: 4%;">
              <div class="list-header">
                <!-- <i class="iconfont lead"
                   @click="hostSave"
                   title="保存"
                   style="font-size:12px">&#xe60b;</i> -->
                <i class="el-icon-download"
                   title="导入"
                   @click="hostExprot"></i>
                <i class="el-icon-circle-plus-outline"
                   title="新增"
                   @click="openAddModal('create')"></i>
                <i class="el-icon-edit"
                   title="编辑"
                   @click="openAddModal('edit')"></i>
                <i class="el-icon-delete"
                   title="删除"
                   @click="deleteModal"></i>
                <i class="el-icon-refresh-right"
                   title="刷新"
                   @click="refresh"></i>
              </div>
              <el-table :data="parkHostList"
                        border
                        style="width: 100%"
                        height="201"
                        size="mini"
                        stripe
                        @selection-change="hostSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index"
                                 label="序号"></el-table-column>
                <el-table-column v-for="item in parkTableColumn"
                                 :key="item.label"
                                 :prop="item.prop"
                                 :label="item.label"
                                 show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="btn"
             v-if="hostBtn">
          <el-button @click="hostSave"
                     type="primary"
                     size="samll">保存</el-button>
          <el-button @click="skip"
                     size="samll">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 停车主机 新增or编辑 -->
    <el-dialog :title="modalTitle"
               :visible.sync="isDialogDetector"
               :append-to-body="true"
               width="400px">
      <el-form size="mini"
               label-position="right"
               label-width="120px">
        <el-form-item label="车场">
          <el-input v-model="detectorData.parking"></el-input>
        </el-form-item>
        <el-form-item label="主机名称"
                      required>
          <el-input v-model="detectorData.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌"
                      required>
          <el-select v-model="detectorData.brand">
            <el-option v-for="item in brandList"
                       :key="item.value"
                       :label="item.data"
                       :value="item.serialNum"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号"
                      required>
          <el-input v-model="detectorData.modelNum"> </el-input>
        </el-form-item>
        <el-form-item label="IP地址"
                      required>
          <el-input v-model="detectorData.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="detectorData.port"></el-input>
        </el-form-item>

      </el-form>
      <el-row>
        <el-button @click="dialogSave">保存</el-button>
        <el-button @click="skipToList">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="20%">
      <span>确定要删除所选设备吗?</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteBtn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    platformInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      first: true,
      second: false,
      dayinxianshi: true,
      dialogVisible: false,
      dropdownStatus: {
        detector: true,
      },
      paginationConfig: {
        limit: 100,
        page: 1,
      },
      brandList: [],
      isPrintShowBtn: false,
      formData: {},
      // 停车主机列表
      parkHostList: [],
      parkTableColumn: [
        // 停车主机列表项
        { prop: 'name', label: '停车主机名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'ip', label: 'IP地址', width: '' },
        { prop: 'port', label: '端口', width: '' },
        { prop: 'status', label: '在线状态', width: '' },
        { prop: 'parking', label: '车场', width: '' },
      ],
      titleTop: '停车平台信息',
      modalTitle: '新增停车主机',
      isDialogDetector: false, // 新增or修改
      // 弹窗新数据收集
      detectorData: {},
      btnShow: false,
      isPrintShow: true,
      isShowMove: false,

      // 将要修改的弹窗数据
      editData: {},
      flag: false,
      hostBtn: false,
    }
  },
  created() {
    this.formData = this.platformInfo
    switch (this.formData.brand) {
         case '0':
        this.formData.brand = '捷顺'
        break
      case '1':
        this.formData.brand = '海康'
        break
      case '2':
        this.formData.brand = '大华'
        break
      case '3':
        this.formData.brand = '达实'
        break
      case '4':
        this.formData.brand = '广日车库'
        break
      case '5':
        this.formData.brand = '百胜'
        break
      case '6':
        this.formData.brand = '科拓'
        break
      case '7':
        this.formData.brand = '披克'
        break
      case '8':
        this.formData.brand = '富士智能'
        break
      case '9':
        this.formData.brand = '东升安防'
        break
      case '10':
        this.formData.brand = '丽泽'
        break
      case '11':
        this.formData.brand = '西沃'
        break
      case '12':
        this.formData.brand = '建安顺'
        break
      case '13':
        this.formData.brand = '天翔'
        break
      case '14':
        this.formData.brand = '南泽'
        break
      case '15':
        this.formData.brand = '安道'
        break
      case '16':
        this.formData.brand = '浙江正元'
        break
      case '17':
        this.formData.brand = '大手'
        break
      case '18':
        this.formData.brand = '蓝卡'
        break
    }
    this.getqueryDataDictBasicInfo()
    this.login() // 登录
  },
  computed: {
    ...mapState({
      isCreateBtnShow: ({ parkingManage }) => parkingManage.isCreateBtnShow,
    }),
  },
  watch: {
    flag: {
      handler(newValue) {
        console.log(newValue, '===')
        if (newValue) {
          this.hostBtn = true
        }
      },
    },
  },
  methods: {
    ...mapMutations(['CHANGE_TAB']),
    ...mapActions([
      'getParkHost',
      'deleteParkPlatform',
      'getPlatformHostList',
      'queryDataDictBasicInfo',
      'batchSaveParkHost',
      'getLogininfo',
    ]),
    // 登录
    login() {
      this.getLogininfo({
        devIp: '10.1.1.98',
        devPort: 8090,
      })
    },
    // 主机导入
    hostExprot() {
      this.flag = true
      // obj为获取平台下主机的参数
      let obj = {
        devIp: this.formData.ip,
        devPort: this.platformInfo.port,
      }
      //   devIp: '10.1.1.98',
      //   devPort: '8090'
      console.log('123')
      this.getPlatformHostList(obj).then((res) => {
        
        //  res.data&&res.data.data
        if (res.data.code === 0 && res.data.data && res.data.data.length > 0 ) {
          if (this.parkHostList && this.parkHostList.length&& this.parkHostList.length > 0) {
            this.parkHostList = this.parkHostList.concat(res.data.data)
            this.$notify.success({
              title: '成功',
              message: '导入成功',
            })
              console.log(res, '111')
           
              this.parkHostList = []
              this.parkHostList = res.data.data
              this.$notify.success({
                title: '成功',
                message: '导入成功',
              })
          }
        }
      })
    },
    // 主机批量保存
    hostSave() {
      this.parkHostList.map((item) => {
        item.orgId = this.formData.orgId
        item.keyPartId = this.formData.keyPartId
        item.platformId = this.formData.uniqueId
      })
      //
      this.batchSaveParkHost({ hosts: this.parkHostList }).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.hostBtn = false
          this.flag = false
          this.$notify.success({
            title: '成功',
            message: '保存成功',
          })
        }
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
        ],
      }).then((res) => {
        this.brandList = res.data.data[0].attr
      })
    },
    printBtn() {
      this.dayinxianshi = false
    },
    closePrint() {
      this.dayinxianshi = true
    },
    skip() {
      this.hostBtn = false
      this.flag = false
    },
    Toprint() {
      printJS({
        // 表格数据的来源
        printable: [this.formData],
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'Number', displayName: '序号' },
          { field: 'orgId', displayName: '所属机构' },
          { field: 'keyPartId', displayName: '所属重点部位' },
          { field: 'name', displayName: '平台名称' },
          { field: 'id', displayName: '平台ID' },
          { field: 'ip', displayName: 'IP地址' },
          { field: 'prot', displayName: '端口' },
          { field: 'updatedDept', displayName: '录入机构' },
          { field: 'updatedBy', displayName: '录入人' },
          { field: 'updatedAt', displayName: '录入时间' },
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">巡检任务列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle:
          'border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;',
      })
    },
    refresh() {},
    // 删除
    deleteBtn() {
      this.deleteParkPlatform([this.platformInfo.id])
        .then((res) => {
          console.log(res, '删除成功')
          this.$notify.success({
            title: '成功',
            message: '删除成功',
          })
          this.CHANGE_TAB('platformConfig-List')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    skipToList() {
      // this.$emit('closePrint')
      this.isDialogDetector = false
    },
    // 新建按钮
    createListBtn(val) {
      if (val === 'create') {
        this.$emit('isCreateShow')
      } else if (val === 'edit') {
        this.$emit('isEditShow', this.formData, this.parkHostList)
      }
    },
    dialogVisibleBtn() {
      this.dialogVisible = true
    },
    // 停车主机新增/编辑按钮
    openAddModal(val) {
      if (val === 'create') {
        this.modalTitle = '新增停车主机'
        this.isDialogDetector = true
      } else {
        if (this.editData.length !== 1) {
          this.$notify.warning({
            title: '警告',
            message: '请选择一条',
          })
          return
        }
        this.modalTitle = '修改停车主机'
        this.isDialogDetector = true
        this.detectorData = this.editData[0]
      }
    },
    // 停车主机选中
    hostSelectionChange(val) {
      console.log(val)
      this.editData = val
    },
    // 新增/编辑主机(弹窗)的保存按钮
    dialogSave(val) {
      console.log(val)
      if (this.detectorData.port !== undefined) {
        this.detectorData.port = Number(this.detectorData.port)
      }
      if (this.modalTitle === '新增停车主机') {
              switch(this.detectorData.brand){
                case '1': this.detectorData.brand='海康'; break;
                case '2': this.detectorData.brand='大华'; break;
                case '3': this.detectorData.brand='达实'; break;
                case '4': this.detectorData.brand='广日车库'; break;
                case '5': this.detectorData.brand='百胜'; break;
                case '6': this.detectorData.brand='科拓'; break;
                case '7': this.detectorData.brand='披克'; break;
                case '8': this.detectorData.brand='富士智能'; break;
                case '9': this.detectorData.brand='东升安防'; break;
                case '10': this.detectorData.brand='丽泽'; break;
                case '11': this.detectorData.brand='西沃'; break;
                case '12': this.detectorData.brand='建安顺'; break;
                case '13': this.detectorData.brand='天翔'; break;
                case '14': this.detectorData.brand='南泽'; break;
                case '15': this.detectorData.brand='安道'; break;
                case '16': this.detectorData.brand='浙江正元'; break;
                case '17': this.detectorData.brand='大手'; break;
                case '18': this.detectorData.brand='蓝卡'; break;
                case '19': this.detectorData.brand='捷顺'; break;
            }
        this.parkHostList.push(this.detectorData)
        this.flag = true
        this.$notify.success({
          title: '成功',
          message: '添加成功',
        })
      } else {
        this.flag = true
        this.editData[0] = this.detectorData
      }
      this.isDialogDetector = false
      this.detectorData = {}
    },

    deleteModal() {
      if (this.editData.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的主机',
        })
      } else {
        this.flag = true
        var temp
        this.parkHostList.map((item) => {
          if (this.editData.length) {
            this.editData.map((val) => {
              if (val === item) {
                temp = this.parkHostList.indexOf(item)
                console.log(this.parkHostList.indexOf(item))
              }
            })
          }
          this.parkHostList.splice(this.parkHostList.indexOf(temp), 1)
        })
        this.$notify.success({
          title: '成功',
          message: '删除成功',
        })
      }
    },
    // 迁移
    moveBtn() {
      this.isPrintShow = false
      this.isShowMove = true
    },
    excloseBtn(val) {
      this.isPrintShow = true
      this.isShowMove = false
    },
    closeBtn() {
      this.$emit('excloseBtn')
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  padding: 0 10px;
}
.heads {
  margin-left: 48px;
}
.button-box {
  margin: 12px 0;
}
.content-box {
  width: 1200px;
  margin-top: 20px;
  text-align: center;
}
.table-box {
  width: 100%;
  text-align: left;
  margin-top: 24px;
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 150px;
}
.detail-box,
.detail-bottom {
  color: #666;
  width: 100%;
  padding: 8px;
  border: 1px solid #f2f2f2;
  display: flex;
  flex-wrap: wrap;
  margin: 48px;
  .detail-item {
    display: flex;
    width: 50%;
    height: 32px;
    line-height: 32px;
    .item-left {
      width: 200px;
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
.bottom-box {
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    margin-left: 30px;
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
      width: calc(~'100% - 80px');
      margin-left: 120px;
      margin-top: -12px;
    }
  }
  .pointer {
    cursor: pointer;
    display: inline-block;
    width: 120px;
    position: absolute;
    top: -12px;
    left: 0px;
  }
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
  }
}
.detail-bottom {
  .detail-item {
    width: 33.33%;
  }
}
.bottom-btn {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>
