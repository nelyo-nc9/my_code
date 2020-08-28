<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>电视墙配置</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="form-title">新建电视墙</div>
        <div class="form-content">
          <div class="left-form">
            <el-form ref="addForm"
                     :rules="rules"
                     size="mini"
                     :model="formData"
                     label-position="right"
                     label-width="120px">
              <el-form-item label="电视墙名称"
                            required
                            class="maBottom"
                            prop="name">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="所属机构"
                            required
                            class="maBottom"
                            prop="orgName">
                <el-input disabled
                          v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="电视墙地址"
                            class="maBottom">
                <el-input v-model="formData.position"
                          maxlength="128"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-form">
            <el-form ref="addForm2"
                     :rules="rules"
                     size="mini"
                     :model="formData"
                     label-position="right"
                     label-width="130px">
              <el-form-item label="资产编码"
                            class="maBottom"
                            prop="assetCode">
                <el-input v-model="formData.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="所属重点部位"
                            required
                            class="maBottom"
                            prop="keyPartName">
                <el-input disabled
                          v-model="formData.keyPartName"></el-input>
              </el-form-item>
              <el-form-item label="联动默认电视墙"
                            required
                            class="maBottom"
                            prop="linkWallName">
                <el-select v-model="formData.linkWallName"
                           @change="selectData">
                  <el-option v-for="item in devBrandList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="bottom-box">
          <div class="footer">
            <ul>
              <li>
                <div class="title">
                  <span>录入时间</span>
                </div>
                <div class="const"></div>
              </li>
              <li>
                <div class="title">
                  <span>录入机构</span>
                </div>
                <div class="const"></div>
              </li>
              <li>
                <div class="title">
                  <span>录入人</span>
                </div>
                <div class="const"></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary"
                     size="small"
                     @click="succfulMethod">保存</el-button>
          <el-button size="small"
                     @click="skipToList">取消</el-button>
          <el-button size="small"
                     @click="resetMethod">重置</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData_copy: ({ tvWall }) => tvWall.copy_data
    })
  },
  watch: {
    'formData_copy': {
      handler(newVal, oldVal) {
        // debugger
      },
      deep: true,
      immediate: true // 初次也监听
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '电视墙名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        keyPartName: [
          { required: true, message: '重点部位不能为空' }
        ],
        orgName: [
          { required: true, message: '所属机构不能为空' }
        ],
        linkWallName: [
          { required: true, message: '联动默认电视墙不能为空' }
        ]
      },
      treeType: 2, // 机构，重点部位树
      multipleSelection: [],
      formData: {
        // 表单数据
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        linkWall: '',
        linkWallName: '',
        assetCode: null,
        type: '',
        updatedBy: '',
        updatedDept: '',
        orgName: '', // 机构名称
        keyPartName: '' // 所属重点部位名称

      },
      devBrandList: [
        // 设备品牌下拉选项
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      dropdownStatus: {
        detector: false,
        output: false
      }
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2', 'SET_TVWALL_COPYDATA']),
    ...mapActions(['addTvWallApi']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 点击机构树的节点
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.formData.orgName = data.name
        this.formData.orgId = data.id
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.formData.orgId = (parentNode.data && node.parent.data.id) || ''
        this.formData.orgName = (parentNode.data && node.parent.data.name) || ''
        this.formData.keyPartId = data.id
        this.formData.keyPartName = data.name
      }
    },

    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    },
    selectData(val) {
      if (val === '是') {
        this.formData.linkWallName = '是'
        this.formData.linkWall = 1
      } else {
        this.formData.linkWallName = '否'
        this.formData.linkWall = 2
      }
    },
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('ManageList')
    },
    // 添加电视墙配置 添加成功跳转到详细信息页面
    succfulMethod() {
      this.$refs['addForm'].validate(valid => {
        this.$refs['addForm2'].validate(valid2 => {
          if (valid && valid2) {
            let SendTvWallData = JSON.parse(JSON.stringify(this.formData))
            // delete this.formData.orgName
            // delete this.formData.keyPartName
            // delete this.formData.linkWallName
            this.addTvWallApi(this.formData).then((res) => {
              if (res.data.code === 0) {
                let userData = JSON.parse(sessionStorage.getItem('user')) // 从session中获取当前登录用户信息
                if (userData) {
                  SendTvWallData.updatedBy = userData.name
                  SendTvWallData.updatedDept = userData.orgName
                }
                SendTvWallData.id = res.data.data.id
                SendTvWallData.updatedAt = res.data.data.createdAt
                this.succefullMethod('电视墙新增成功')
                this.SET_TVWALL_MESSAGE(SendTvWallData) // 将信息传递到详情页面
                this.SET_COMPONENTID2('add') // 从新建进入查看
                this.SET_COMPONENTID1('newWallmessage') // 添加成功,跳转到查看页面
                let change_vuex = { // 清除复制的数据
                  orgId: '',
                  keyPartId: '',
                  name: '',
                  position: '',
                  linkWall: '',
                  assetCode: '',
                  orgName: '',
                  keyPartName: '',
                  linkWallName: ''
                }
                this.SET_TVWALL_COPYDATA(change_vuex)
              } else {
                this.failureMethod(res.data.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      })
    },
    // 重置
    resetMethod() {
      this.formData = {}
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
    },
    // 处理复制数据
    getcopy_data() {
      if (this.formData_copy.orgId) {
        this.formData.orgId = this.formData_copy.orgId
        this.formData.keyPartId = this.formData_copy.keyPartId
        this.formData.name = this.formData_copy.name
        this.formData.position = this.formData_copy.position
        this.formData.linkWall = this.formData_copy.linkWall
        this.formData.assetCode = this.formData_copy.assetCode
        this.formData.orgName = this.formData_copy.orgName
        this.formData.keyPartName = this.formData_copy.keyPartName
        this.formData.linkWallName = this.formData_copy.linkWallName
      }
    }
  },
  mounted() {
    this.getcopy_data()
  }
}
</script>
<style lang="less" scoped>
.form-content /deep/.el-input--mini {
  margin-left: 5px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 260px;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left-tree {
    width: 240px;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-title {
        width: 830px;
        font-weight: 600;
        text-align: center;
        padding: 20px 0;
        color: #606266;
      }
      .form-content {
        display: flex;
        width: 830px;
        padding: 15px;
        font-size: 12px;
        background: #f5f5f5;
        .left-form {
          width: 380px;
          margin-right: 24px;
        }
        .right-form {
          width: 380px;
        }
      }
      .form-footer {
        margin-top: 18px;
        width: 830px;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
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
  .list-header {
    text-align: right;
    i {
      cursor: pointer;
      margin-right: 6px;
    }
  }
  .maBottom {
    margin-bottom: 14px !important;
  }
  .footer {
    margin-top: 20px;
    width: 830px;
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
}
</style>
<style lang="less">
.content {
  .right-content {
    .form-box {
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          // background: #f2f2f2;
        }
      }
    }
  }
}
