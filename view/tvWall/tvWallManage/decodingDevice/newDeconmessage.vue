<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTvWallTreeApi"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               treeLazyToggle
               iconToggle> </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
            <el-breadcrumb-item>解码设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="skipTo('AddDecoding')">新建</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="skipTo1('ChangeDecod', formDataCopy)">编辑</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="deleteMethod">删除</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'">获取</el-button>
          <el-button @click="copyMethod"
                     size="small"
                     v-if="formIndex === 'add'">复制</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="removalMethod">迁移</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="sortMethod">排序</el-button>
          <el-button size="small"
                     v-print="'#decoding_print'">打印</el-button>
          <el-button size="small"
                     v-if="formIndex === 'list'"
                     @click="skipTo('decodingList')">关闭</el-button>
        </div>
        <div class="messageWrap"
             id="decoding_print">
          <div class="messagetitle">
            <span>解码设备信息</span>
          </div>
          <div class="messageTable">
            <div class="form-content">
              <div class="left-form">
                <el-form ref="addForm"
                         size="mini"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="110px">
                  <el-form-item label="设备名称"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.name"></el-input>
                  </el-form-item>
                  <el-form-item label="所属机构"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.orgName"></el-input>
                  </el-form-item>
                  <el-form-item label="所属重点部位"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.keyPartName"></el-input>
                  </el-form-item>
                  <el-form-item label="接入服务器"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.accessService"></el-input>
                  </el-form-item>
                  <el-form-item label="IP地址"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="品牌"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.brand"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.username"></el-input>
                  </el-form-item>
                  <el-form-item label="设备序列号"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.serialCode"></el-input>
                  </el-form-item>
                  <el-form-item label="解码窗口数量"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.decoderNumber"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right-form">
                <el-form size="mini"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="124px">
                  <el-form-item label="资源编码"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.assetCode"></el-input>
                  </el-form-item>
                  <el-form-item label="所属电视墙"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.wallName"></el-input>
                  </el-form-item>
                  <el-form-item label="型号"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.modelNum"></el-input>
                  </el-form-item>
                  <el-form-item label="设备类型"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.typeName"></el-input>
                  </el-form-item>
                  <el-form-item label="端口"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.port"></el-input>
                  </el-form-item>
                  <el-form-item label="密码"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.password"
                              show-password></el-input>
                  </el-form-item>
                  <el-form-item label="本地终端输入数量"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.inputNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="输出通道数量"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.outputNumber"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="tableWrap">
            <div class="decodingWrap"
                 v-if="formDataCopy.type === 2">
              <div class="box-title"
                   @click="toggleOpen('detector')">
                <span class="pointer">
                  本地终端输入列表
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                     class="maLeft"></i>
                </span>
              </div>
              <div class="list"
                   v-if="dropdownStatus.detector">
                <el-table ref="multipleTable"
                          border
                          :data="tableData"
                          style="width: 100%;font-size:12px">
                  <el-table-column type="index"
                                   label="序号"
                                   width="50"></el-table-column>
                  <el-table-column v-for="(item, index) in tableColumn"
                                   :key="index"
                                   :prop="item.mark"
                                   :label="item.label"
                                   :width="item.width"
                                   show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
            <div class="LedWap">
              <div class="box-title"
                   @click="toggleOpen('output')">
                <span class="pointer">
                  输出通道列表
                  <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                     class="maLeft"></i>
                </span>
              </div>
              <div class="list"
                   v-if="dropdownStatus.output">
                <el-table ref="multipleTable"
                          border
                          :data="LedtableData"
                          style="width: 100%;font-size:12px">
                  <el-table-column type="index"
                                   label="序号"
                                   width="50"></el-table-column>
                  <el-table-column v-for="(item, index) in LedtableColumn"
                                   :key="index"
                                   :prop="item.mark"
                                   :label="item.label"
                                   :width="item.width"
                                   show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="footer">
            <ul>
              <li>
                <div class="title">
                  <span>录入时间</span>
                </div>
                <div class="const">{{ formDataCopy.updatedAt }}</div>
              </li>
              <li>
                <div class="title">
                  <span>录入机构</span>
                </div>
                <div class="const">{{ formDataCopy.updatedDept }}</div>
              </li>
              <li>
                <div class="title">
                  <span>录入人</span>
                </div>
                <div class="const">{{ formDataCopy.updatedBy }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, getTvWallTreeApi, searchTreeToWallApi } from '../../../../http/tvWall/tvWallmanage.api'

import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData,
      formIndex: ({ tvWall }) => tvWall.whocomponentIndex
    })
  },
  data() {
    return {
      formDataCopy: {},
      treeType: 2, // 机构，重点部位树
      filterText: '',
      tableData: [],
      LedtableData: [],
      tableColumn: [
        {
          mark: 'name',
          label: '本地终端输入名称',
          width: '140'
        },
        {
          mark: 'serise',
          label: '本地终端输入号',
          width: '140'
        },
        {
          mark: 'extend2',
          label: '位置',
          width: ''
        },
        {
          mark: 'inputTypeName',
          label: '输入类型',
          width: ''
        },
        {
          mark: 'ratio',
          label: '分辨率',
          width: ''
        },
        {
          mark: 'brand',
          label: '品牌',
          width: ''
        },
        {
          mark: 'modelNum',
          label: '型号',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资源编码',
          width: ''
        }
      ],
      LedtableColumn: [
        {
          mark: 'name',
          label: '输出通道名称',
          width: '140'
        },
        {
          mark: 'serise',
          label: '输出通道号',
          width: ''
        },
        {
          mark: 'ratio',
          label: '分辨率',
          width: ''
        },
        {
          mark: 'brand',
          label: '品牌',
          width: ''
        },
        {
          mark: 'modelNum',
          label: '型号',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资源编码',
          width: ''
        }
      ],
      dropdownStatus: {
        detector: true,
        output: true
      }
    }
  },
  created() { },
  mounted() {
    this.initializationMethod() // 页面初始化函数
  },
  beforeDestroy() { },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_TVWALL_COPYDATA', 'SET_MOVEDATA']),
    ...mapActions([
      'deleteDecodingDevice',
      'getOneDecodingDevice',
      'getDecodingLocalCannalList'
    ]),
    // 页面初始化函数
    initializationMethod() {
      this.getOneDecoding()
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getTvWallTreeApi(params) {
      return getTvWallTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeToWallApi(params)
    },
    skipTo(data) {
      this.SET_COMPONENTID1(data)
    },
    // 复制
    copyMethod() {
      let obj = {
        name: this.formDataCopy.name,
        orgName: this.formDataCopy.orgName,
        orgId: this.formDataCopy.orgId,
        keyPartName: this.formDataCopy.keyPartName,
        keyPartId: this.formDataCopy.keyPartId,
        accessService: this.formDataCopy.accessService,
        ip: this.formDataCopy.ip,
        brand: this.formDataCopy.brand,
        username: this.formDataCopy.username,
        serialCode: this.formDataCopy.serialCode,
        decoderNumber: this.formDataCopy.decoderNumber,
        assetCode: this.formDataCopy.assetCode,
        wallName: this.formDataCopy.wallName,
        wallId: this.formDataCopy.wallId,
        modelNum: this.formDataCopy.modelNum,
        typeName: this.formDataCopy.typeName,
        type: this.formDataCopy.type,
        port: this.formDataCopy.port,
        password: this.formDataCopy.password,
        inputNumber: this.formDataCopy.inputNumber,
        outputNumber: this.formDataCopy.outputNumber
      }
      this.SET_COMPONENTID1('AddDecoding')
      this.SET_TVWALL_COPYDATA(obj)
    },
    // 点击修改按钮，将解码设备信息传到修改页面
    skipTo1(data, val) {
      // val是数组对象形式的
      this.SET_COMPONENTID1(data)
      this.SET_TVWALL_MESSAGE(val)
    },
    // 控制本地终端输入列表和输出通道列表的打开和关闭
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = true
          }
        })
      }
    },
    // 删除
    deleteMethod() {
      if (this.formDataCopy) {
        this.$confirm('确定删除该解码设备吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteDecodingDevice({ ids: [this.formDataCopy.id] })
              .then(res => {
                this.succefullMethod('删除成功')
                this.SET_COMPONENTID1('decodingList') // 删除成功,返回列表，刷新列表数据
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 解码器设备迁移
    removalMethod() {
      let arrRenove = []
      arrRenove.push(JSON.parse(JSON.stringify(this.formDataCopy)))
      this.SET_COMPONENTID1('moveDecod')
      this.SET_MOVEDATA(arrRenove)
    },
    // 获取指定解码设备
    getOneDecoding() {
      let params = {
        id: this.formData.id
      }
      this.getOneDecodingDevice(params)
        .then(res => {
          if (res.data.code === 0) {
            this.formDataCopy = res.data.data.host
            this.formDataCopy.typeName =
              this.formDataCopy.type === 1 ? '解码器' : this.formDataCopy.type === 2 ? '解码拼控一体机' : ''
            this.getCannalList() // 根据设备id获取设备本地终端输入列表
            this.getCannalOutList() // 根据设备id获取输出列表
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据设备id获取设备本地终端输入列表
    getCannalList() {
      let params = {
        page: 1,
        limit: 200,
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        type: 2,
        deviceId: this.formDataCopy.id
      }
      this.getDecodingLocalCannalList(params)
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.channels
            this.tableData.map(item => {
              item['inputTypeName'] =
                item.inputType === 1 ? 'HDMI' : item.inputType === 2 ? 'DVI' : item.inputType === 3 ? 'VGA' : ''
            })
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  根据设备id获取输出通道列表
    getCannalOutList() {
      let params = {
        page: 1,
        limit: 200,
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        type: 1,
        deviceId: this.formDataCopy.id
      }
      this.getDecodingLocalCannalList(params)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.channels) {
              this.LedtableData = res.data.data.channels
            }
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 排序
    sortMethod() {
      this.SET_COMPONENTID1('SortDecoding')
      this.SET_TVWALL_MESSAGE(JSON.parse(JSON.stringify(this.formDataCopy)))
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
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
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.messageWrap {
  width: 860px;
}
.messagetitle {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.form-content {
  display: flex;
  width: 100%;
  padding: 15px 15px 0 15px;
  font-size: 12px;
  justify-content: center;
  border: 1px solid #f2f2f2;
  .left-form {
    width: 380px;
    margin-right: 24px;
  }
  .right-form {
    width: 380px;
  }
}
.tableWrap {
  margin-top: 15px;
}
.tableWrap .title {
  cursor: pointer;
  font-size: 12px;
  padding: 15px 5px;
  display: inline-block;
  width: 156px;
}
.tableWrap .title i {
  font-size: 14px;
  margin-left: 15px;
}
.maLeft {
  margin-left: 10px !important;
}
.footer {
  margin-top: 30px;
  width: 100%;
  border: 1px solid #f2f2f2;
  height: 40px;
}
.footer ul {
  font-size: 12px;
  display: flex;
}
.footer ul li {
  display: flex;
  justify-content: space-between;
}
.footer .title {
  text-align: center;
  width: 110px;
  height: 40px;
  background: #f5f5f5;
  line-height: 40px;
}
.footer .const {
  width: 176px;
  height: 100%;
  text-align: center;
  line-height: 40px;
}
.maBottom {
  margin-bottom: 10px !important;
}
// 迁移弹窗
.transferWrap /deep/ .el-dialog {
  width: 628px;
}
.transferWrap /deep/.el-dialog__header {
  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid #f3f3f3;
}
.transferWrap /deep/ .el-dialog__title {
  font-weight: bolder;
  font-size: 15px;
}
.transferWrap /deep/.el-dialog__headerbtn {
  top: 15px;
}
.transferWrap2 /deep/ .el-dialog__body {
  padding: 16px 20px;
}
.modelContend {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 300px;
}
.modelLeft {
  width: 270px;
  height: 100%;
  border: 1px solid gainsboro;
}
.titleLeft {
  width: 100%;
  line-height: 30px;
  text-align: center;
  height: 30px;
  background: rgba(242, 242, 242, 1);
}
.modelWrap {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.tvWallModelMessage {
  width: 100%;
  display: flex;
  margin-bottom: 12px;
}
.titleMessage {
  width: 100px;
  text-align: right;
}
.localTerminal1 {
  height: 220px;
  overflow: auto;
}
.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;
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
    margin-left: 130px;
    margin-top: -12px;
  }
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 130px;
  font-size: 12px;
}
</style>
