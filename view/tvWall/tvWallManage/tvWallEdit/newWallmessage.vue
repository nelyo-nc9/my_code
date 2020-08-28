<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               :treeType="treeType"
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
            <el-breadcrumb-item>电视墙配置</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="skipTo('AddTvmanage')">新建</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="skipTo1('ChangeTvwallEidto', formDataCopy)">编辑</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="deleteMethod">删除</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="copy_data">复制</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="removalMethod">迁移</el-button>
          <el-button size="small"
                     v-if="formIndex === 'add'"
                     @click="sortMethod">排序</el-button>
          <el-button size="small"
                     v-print="'#messageWrapid'">打印</el-button>
          <el-button size="small"
                     v-if="formIndex === 'list'"
                     @click="skipTo('ManageList')">关闭</el-button>
        </div>
        <div class="messageWrap"
             id="messageWrapid">
          <div class="messagetitle">
            <span>电视墙信息</span>
          </div>
          <div class="messageTable">
            <div class="form-content">
              <div class="left-form">
                <el-form ref="addForm"
                         size="mini"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="110px">
                  <el-form-item label="电视墙名称"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.name"></el-input>
                  </el-form-item>
                  <el-form-item label="所属机构"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.orgName"></el-input>
                  </el-form-item>
                  <el-form-item label="电视墙地址"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.position"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right-form">
                <el-form size="mini"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="110px">
                  <el-form-item label="设备编码"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.assetCode"></el-input>
                  </el-form-item>
                  <el-form-item label="所属重点部位"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.keyPartName"></el-input>
                  </el-form-item>
                  <el-form-item label="联动默认电视墙"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.linkWallName"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="tableWrap">
            <div class="decodingWrap">
              <div class="title">
                <span>解码设备列表</span>
              </div>
              <div class="list">
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
              <div class="title">
                <span>LED设备列表</span>
              </div>
              <div class="list">
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
import { getTreeApi, searchTreeApi2 } from '../../../../http/tvWall/tvWallmanage.api'
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
          label: '名称',
          width: ''
        },
        {
          mark: 'typeName',
          label: '设备类型',
          width: '110'
        },
        {
          mark: 'ip',
          label: 'IP地址',
          width: ''
        },
        {
          mark: 'port',
          label: '控制端口',
          width: '70'
        },
        {
          mark: 'outputNumber',
          label: '解码窗口数量',
          width: ''
        },
        {
          mark: 'inputNumber',
          label: '本地终端输入数量',
          width: '120'
        },
        {
          mark: 'outputNumber',
          label: '输出通道数量',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资产编码',
          width: '90'
        }
      ],
      LedtableColumn: [
        {
          mark: 'name',
          label: '名称',
          width: ''
        },
        {
          mark: 'ip',
          label: 'IP地址',
          width: ''
        },
        {
          mark: 'port',
          label: '控制端口',
          width: ''
        },
        {
          mark: 'assetCode',
          label: '资产编码',
          width: ''
        }
      ]
    }
  },
  created() { },
  mounted() {
    this.formDataCopy = JSON.parse(JSON.stringify(this.formData)) // 复制
    this.getDecodingDeviceList()
  },
  beforeDestroy() { },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_TVWALL_COPYDATA', 'SET_MOVEDATA']),
    ...mapActions(['deleteTvWallApi', 'getDecodingDevice']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    skipTo(data, val) {
      this.SET_COMPONENTID1(data)
    },
    // 点击修改按钮，将电视墙信息传到修改页面
    skipTo1(data, val) {
      this.SET_COMPONENTID1(data)
      this.SET_TVWALL_MESSAGE(val)
    },
    // 删除
    deleteMethod() {
      if (this.formDataCopy) {
        this.$confirm('确定删除该电视墙吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteTvWallApi({ ids: [this.formDataCopy.id] })
              .then(res => {
                this.succefullMethod('删除成功')
                this.SET_COMPONENTID1('ManageList') // 删除成功,返回列表，刷新列表数据
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
    // 复制
    copy_data() {
      let obj = {
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        name: this.formDataCopy.name,
        position: this.formDataCopy.position,
        linkWall: this.formDataCopy.linkWall,
        assetCode: this.formDataCopy.assetCode,
        orgName: this.formDataCopy.orgName,
        keyPartName: this.formDataCopy.keyPartName,
        linkWallName: this.formDataCopy.linkWallName
      }
      this.SET_TVWALL_COPYDATA(obj)
      this.SET_COMPONENTID1('AddTvmanage')
    },
    // 电视墙迁移
    removalMethod() {
      let arrRenove = []
      arrRenove.push(JSON.parse(JSON.stringify(this.formDataCopy)))
      this.SET_COMPONENTID1('moveTvWall')
      this.SET_MOVEDATA(arrRenove)
    },
    // 查看时解码设备列表，和LED列表
    getDecodingDeviceList(val) {
      let params = {
        limit: 200,
        page: 1,
        orgId: '',
        keyPartId: '',
        type: '',
        wallId: this.formDataCopy.id
      }
      this.getDecodingDevice(params)
        .then(res => {
          if (res.data.code === 0) {
            let Arr = []
            Arr = res.data.data.hosts
            Arr.map(item => {
              item['typeName'] =
                item.type === 1 ? '解码器' : item.type === 2 ? '解码拼控一体机' : item.type === 3 ? 'LED设备' : ''
              if (item.type === 3) {
                this.LedtableData.push(item)
              } else {
                this.tableData.push(item)
              }
            })
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
      this.SET_COMPONENTID1('SortTvWall')
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
  font-size: 12px;
  padding: 15px 5px;
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
  width: 166px;
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
</style>
