<!--
 * @Author: yanglei
 * @Date: 2020-05-29 16:11:36
 * @LastEditTime: 2020-08-24 11:52:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\coffersManage\superuser\superuser.vue
-->

<template>
  <div class="superuser-container">
    <aside :style="{width: isOpenPanel ? '12%' : '1%'}">
      <div class="aside-container">
        <span class="arrow-box" @click="togglePanel"><i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i></span>
        <div v-show="isOpenPanel">
          <h3>金库授权管理</h3>
          <ul>
            <li v-for="(item, index) in asideList" :key="index" :class="[item.isShow ? 'itemActive' : '']" @click="itemClickHandler(item, index)">{{ item.label }}</li>
          </ul>
        </div>
      </div>
    </aside>
    <main :style="{width: isOpenPanel ? '88%' : '99%'}">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-container">
        <!-- <span class="icon-style"><i class="iconfont icon-Location"></i></span> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>金库授权管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentItem === '' ? '授权' : asideList.filter(item => item.name === currentItem)[0].label }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main-container">
        <!-- 操作按钮 -->
        <div class="button-box" v-show="showButtonBox">
          <el-button size="small" v-if="currentItem !== 'authorization' && showFrontBtn" @click="createBtnHandler">新建值班组</el-button>
          <el-button size="small" v-if="currentItem !== 'authorization' && showFrontBtn" @click="editGroupHandler">修改值班组</el-button>
          <el-button size="small" v-if="currentItem !== 'authorization' && showFrontBtn" @click="deleteBtnHandler">删除</el-button>
          <el-button size="small" @click="verifyBtnHandler">授权</el-button>
          <el-button size="small" @click="showInfoCollectHandler">信息采集</el-button>
        </div>
        <!-- 展示内容 -->
        <div class="content-container">
          <!-- 列表--展示表格 -->
          <div class="table-box" v-if="currentItem === 'list'">
            <el-table
              ref="groupTable"
              :data="groupTableData"
              height="100%"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column prop="groupName" label="值班组名称" width="300" show-overflow-tooltip></el-table-column>
              <el-table-column prop="usefulLife" label="有效期" width="200"></el-table-column>
              <el-table-column prop="attendTime" label="值班时间" width="150"></el-table-column>
              <el-table-column prop="member" label="成员"></el-table-column>
              <el-table-column prop="status" label="状态" width="120"></el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <span @click="editGroup(scope.$index, scope.row)"><i class="iconfont icon-edit"></i></span>
                  <span @click="deleteGroup(scope.$index, scope.row)"><i class="iconfont icon-delete"></i></span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 新建--展示新建值班组 -->
          <div class="create-box" v-else-if="currentItem === 'create'">
            <Create :createTitleText="titleText" :groupId="currModGroup.ID" @updataGroup="updataCurrModGroup" @cancle="cancleBtnHandler"></Create>
          </div>

          <!-- 授权--展示值班授权 -->
          <div class="authorization-box" v-else-if="currentItem === 'authorization' && !showInfoCollect">
            <Authorization :groupId="currModGroup.ID" @cancle="cancleBtnHandler" @changeCurrentGroup="changeCurrentGroup"></Authorization>
          </div>

          <!-- 授权--信息采集面板 -->
          <div class="info-collect-box" v-if="currentItem === 'authorization' && showInfoCollect">
            <CollectInfo :groupId="currModGroup.ID"></CollectInfo>
          </div>
        </div>
      </div>
    </main>

    <!-- 确认删除提示框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="showConfirmDialog"
      width="450px"
      :before-close="closeConfirmDialog"
      class="confirm-delete-dialog">

      <span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#ccbjinggao"></use>
        </svg>
      </span>
      <p>请确认是否删除所选值班组？</p>
      <p>删除后该组成员进入值守界面的授权失效</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDeleteFun">确 定</el-button>
        <el-button @click="closeConfirmDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Create from './Create'
import Authorization from './Authorization'
import CollectInfo from './CollectInfo'
import '@src/assets/ccb_iconfonts/iconfont.js'
import { getDutyGroupApi, removeAuthorizeApi } from '../../../http/coffersManage/superuser.api.js'
import common from '../components/common'

export default {
  name: 'superuser',
  mixins: [common],
  components: {
    Create,
    Authorization,
    CollectInfo
  },
  data() {
    return {
      isOpenPanel: true, // 侧边栏显示隐藏状态
      asideList: [ // 侧边栏列表数据
        { name: 'create', label: '新建', isShow: false },
        { name: 'list', label: '列表', isShow: true },
        { name: 'authorization', label: '授权', isShow: false }
      ],
      currentItem: 'list', // 当前展示的列表项，默认展示列表内容
      showButtonBox: true, // 操作按钮显隐性
      showFrontBtn: true, // 显示新建、修改、删除三个按钮
      showInfoCollect: false, // 信息采集显隐

      groupTableData: [], // 授权列表数据
      multipleSelection: [], // 表格选中项
      showConfirmDialog: false, // 显示批量删除确认对话框

      titleText: '新建值班组', // 新建值班组标题文字
      currModGroup: {} // 需要修改的值班组信息
    }
  },
  created() {
    this.getDutyGroup()
  },
  methods: {
    /**
     * @description: 侧边栏显示隐藏切换
     * @param {type} 无
     * @return: 无
     */
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    },
    /**
     * @description: 侧边栏item项点击事件
     * @param {type} (item, index)
     * @return: 无
     */
    itemClickHandler(asideItem, asideIndex) {
      this.currentItem = asideItem.name
      this.asideList.forEach((item, index) => {
        if (asideIndex === index) {
          item.isShow = true
        } else {
          item.isShow = false
        }
      })
      if (asideItem.name === 'list') {
        this.getDutyGroup()
        this.currModGroup = {}
      }
    },
    /**
     * @description: 获取授权值班组下拉框数据
     * @param {type} 无
     * @return: 无
     */
    getDutyGroup() {
      getDutyGroupApi()
        .then((res) => {
          this.groupTableData = []
          let resultData = res.data.data.getDutyGroup
          resultData.forEach(item => {
            // 保存列表表格数据
            this.groupTableData.push({
              groupName: item.groupName,
              usefulLife: item.termOfValidity,
              attendTime: item.dutyTime,
              member: item.dutyMember === undefined ? [] : (item.dutyMember === 'isEmpty' || JSON.parse(item.dutyMember).length === 0) ? [] : JSON.parse(item.dutyMember).map(item => item.name).join(', '),
              status: item.state,
              id: item.id,
              verificationMethod: item.verificationMethod
            })
          })
        })
        .catch((err) => {
          console.log(' getDutyGroup Error ', err)
        })
    },

    createBtnHandler() {
      // 显示新建值班组
      this.currentItem = 'create'
      this.$nextTick(() => {
        this.titleText = '新建值班组'
      })
      this.showButtonBox = false
    },
    editGroupHandler() {
      // 显示修改值班组
      if (this.multipleSelection.length !== 1 && this.currentItem === 'list') {
        this.$messageError('请选择一个要修改的', '错误')
        return
      }
      this.currentItem = 'create'
      this.$nextTick(() => {
        this.titleText = '修改值班组'
      })
      this.showButtonBox = false
      this.currModGroup = this.currModGroup.ID ? this.currModGroup : {
        ID: this.multipleSelection[0].id,
        GroupName: this.multipleSelection[0].groupName,
        TermOfValidity: this.multipleSelection[0].usefulLife,
        DutyTime: this.multipleSelection[0].attendTime,
        dutyMember: this.multipleSelection[0].member,
        verificationMethod: this.multipleSelection[0].verificationMethod,
        state: this.multipleSelection[0].status
      }
    },
    updataCurrModGroup(val) {
      this.currModGroup = val
    },
    cancleBtnHandler() {
      // 新建 - 修改 - 授权 取消按钮点击
      this.currentItem = 'list'
    },
    verifyBtnHandler() {
      if (this.multipleSelection.length > 1) {
        this.$messageError('不支持批量授权', '错误')
        return
      }
      // 授权按钮点击事件 - 切换到授权
      this.currentItem = 'authorization'
      this.showInfoCollect = false
      if (this.multipleSelection.length === 1) {
        // 授权传递数据
        this.currModGroup = {
          ID: this.multipleSelection[0].id,
          GroupName: this.multipleSelection[0].groupName,
          TermOfValidity: this.multipleSelection[0].usefulLife,
          DutyTime: this.multipleSelection[0].attendTime,
          dutyMember: this.multipleSelection[0].member,
          verificationMethod: this.multipleSelection[0].verificationMethod,
          state: this.multipleSelection[0].status
        }
      }
    },
    showInfoCollectHandler() {
      // 显示信息采集
      this.currentItem = 'authorization'
      this.$nextTick(() => {
        this.showInfoCollect = true
      })
    },
    /**
     * @description: 表格操作列编辑图标点击事件；修改值班组信息
     * @param {type} 无
     * @return: 无
     */
    editGroup(index, data) {
      // this.currentItem = 'authorization'
      // this.currModGroup = {
      //   ID: data.id,
      //   GroupName: data.groupName,
      //   TermOfValidity: data.usefulLife,
      //   DutyTime: data.attendTime,
      //   dutyMember: data.member,
      //   verificationMethod: data.verificationMethod,
      //   state: data.status
      // }
      this.currentItem = 'create'
      this.$nextTick(() => {
        this.titleText = '修改值班组'
      })
      this.showButtonBox = false
      this.currModGroup = {
        ID: data.id,
        GroupName: data.groupName,
        TermOfValidity: data.usefulLife,
        DutyTime: data.attendTime,
        dutyMember: data.member,
        verificationMethod: data.verificationMethod,
        state: data.status
      }
    },
    /**
     * @description: 表格操作列删除图标点击事件；删除值班组信息
     * @param {type} 无
     * @return: 无
     */
    deleteGroup(index, data) {
      this.multipleSelection = [{...data}]
      this.showConfirmDialog = true
    },
    /**
     * @description: 全选反选
     * @param {type} 无
     * @return: 无
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description: 批量删除按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    deleteBtnHandler() {
      if (this.currentItem === 'create' && this.titleText === '值班组') {
        this.multipleSelection.push({id: this.currModGroup.ID})
      } else if (this.currentItem !== 'list') {
        return
      }
      if (this.multipleSelection.length === 0) {
        this.$messageError('请至少选择一项！', '错误')
        return
      }
      this.showConfirmDialog = true
    },
    /**
     * @description: 确认批量删除按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    confirmDeleteFun() {
      let params = {
        dutyGroupInfo: []
      }
      this.multipleSelection.forEach(item => {
        params.dutyGroupInfo.push(item.id)
      })
      removeAuthorizeApi(params)
        .then((res) => {
          this.getDutyGroup()
          this.$messageSuccess('删除成功！', '成功')
          this.currentItem = 'list'
          // 记录日志 - 值班组管理
          this.recordLogFun({OperationType: '值班组管理'})
        })
        .catch(() => {
          this.$messageError('删除失败, 请稍后重试！', '错误')
        })

      this.showConfirmDialog = false
    },
    /**
     * @description: 批量删除提示对话框关闭事件
     * @param {type} 无
     * @return: 无
     */
    closeConfirmDialog() {
      this.multipleSelection = []
      this.showConfirmDialog = false
      if (this.currentItem === 'list') {
        this.$refs.groupTable.clearSelection()
      }
    },

    /**
     * @description: 授权返回修改传参
     * @param {type} 无
     * @return: 无
     */
    changeCurrentGroup(val) {
      this.currModGroup = Object.assign(this.currModGroup, val)
    }
  },
  watch: {
    currentItem: {
      handler: function(newVal, oldVal) {
        if (newVal === 'create') {
          this.titleText = '新建值班组'
        }
        let newValIndex = ['create', 'list', 'authorization'].indexOf(newVal)
        this.showButtonBox = newVal !== 'create'
        this.itemClickHandler(this.asideList[newValIndex], newValIndex)
        this.showInfoCollect = false
        this.showFrontBtn = true
        this.multipleSelection = newVal === 'list' ? [] : this.multipleSelection
      }
    }
  }
}
</script>

<style lang="less" scoped>
.superuser-container {
  width: 100%;
  height: 100%;
  display: flex;
  aside {
    // flex: 3;
    // min-width: 250px;
    .aside-container {
      // width: 320px;
      width: 100%;
      height: 100%;
      padding-top: 28px;
      position: relative;
      .arrow-box {
        width: 28px;
        height: 28px;
        color: #2DA3D8;
        font-size: 16px;
        text-align: center;
        line-height: 28px;
        position: absolute;
        top: 0;
        right: 0;
      }

      h3 {
        width: 100%;
        height: 40px;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        padding-left: 10px;
        background: #F2F2F2;
      }
      li {
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        margin-top: 2px;
        background: #F8F8F8;
        &:hover {
          color: #2D72D3;
        }
      }
      .itemActive {
        color: #2D72D3;
        padding-left: 26px;
        border-left: 4px solid #2D72D3;
      }
    }
  }
  main {
    // 面包屑导航样式
    .breadcrumb-container {
      padding: 10px 0 10px 40px;
      position: relative;
      .icon-style {
        left: 20px;
        line-height: 14px;
        position: absolute;
      }
    }

    .main-container {
      height: calc(~"100% - 34px");
      .button-box  {
        padding: 20px;
      }
      .content-container {
        width: 100%;
        height: calc(~"100% - 80px");
        padding: 0 20px;

        // 展示列表
        .table-box {
          height: 100%;

          /deep/ .el-table__body {
            .el-table__row--striped td {
                background: #F2F2F2;
            }
          }
        }
      }
    }
  }

  // 确认删除对话框
  .confirm-delete-dialog {
    .el-dialog__body {
      span {
        position: absolute;
        top: 90px;
        left: 32px;
        .icon {
          width: 30px;
          height: 30px;
          fill: currentColor;
          overflow: hidden;
        }
      }
      p {
        margin: 5px 60px;
        line-height: 36px;
      }
    }
  }
}
</style>
