<!--
 * @Author: yanglei
 * @Date: 2020-06-30 09:44:51
 * @LastEditTime: 2020-08-24 11:56:03
 * @LastEditors: your name
 * @Description: 授权管理 - 授权
 * @FilePath: \ccb-client\client\src\view\coffersManage\superuser\Authorization.vue
-->

<template>
  <div class="authorization-container">
    <!-- 授权--展示值班授权 -->
    <div class="authorization-box">
      <h3>值班授权</h3>
      <div class="content-box">
        <div class="inp-item">
          <span class="inp-label">值班组</span>
          <el-select v-model="groupNameSelected" @change="groupNameSelectChangeHandler" placeholder="请选择">
            <el-option
              v-for="item in groupNameSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="iconfont icon-edit edit-group-btn" @click="editGroupHandler"></span>
        </div>
        <div class="inp-item">
          <span class="inp-label">机构</span>
          <el-popover popper-class="tree-select" placement="bottom-start" transition="fade-in-linear" v-model="visible" disabled width="380" trigger="click">
            <treeBox :lazyTreeApi="getTreeApi" :treeType="treeType" @onceClick="organizeTreeClickHandle" @rootId="setRootId" treeLazyToggle iconToggle></treeBox>
            <el-input v-model="organizeSelected" disabled class="organize-select" @clear="clear" slot="reference" clearable placeholder="本级监控中心" :suffix-icon="!visible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'">
            </el-input>
          </el-popover>
        </div>
        <div class="inp-item">
          <div class="inp-label">选择值班员</div>
          <div class="select-group-box">
            <el-input v-model="searchWatchman" placeholder="请输入内容" suffix-icon="el-icon-search" @change="filterMenber"></el-input>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedMembers" @change="handleCheckedMemberChange">
              <el-checkbox v-for="member in memberOptions" :label="member.name" :key="member.id">
                {{member.name}}
                <span title="查看重点部位权限" class="iconfont icon-rizhi checkbox-icon" v-on:click="showKeySiteLimits($event, member)"></span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="key-site-tree" v-if="showKeySiteTree">
            <!-- <el-tree :data="keySiteTreeData"></el-tree> -->
            <treeBox :lazyTreeApi="getPowerTree" :treeType="treeType" treeLazyToggle iconToggle></treeBox>
          </div>
        </div>
        <div class="inp-item">
          <div class="inp-label">是否启用</div>
          <el-radio v-model="initiates" label="1">启用</el-radio>
          <el-radio v-model="initiates" label="2">停用</el-radio>
        </div>
        <div class="inp-item">
          <div class="inp-label">验证方式</div>
          <el-radio v-model="verifyMode" label="1">指纹识别</el-radio>
          <el-radio v-model="verifyMode" label="2">密码</el-radio>
          <el-radio v-model="verifyMode" label="3">刷卡</el-radio>
          <el-radio v-model="verifyMode" label="4">指纹+密码</el-radio>
          <el-radio v-model="verifyMode" label="5">人脸识别</el-radio>
          <el-radio v-model="verifyMode" label="6">其他</el-radio>
        </div>
      </div>
      <div class="bottom-btn-box">
        <el-button size="small" type="primary" @click="groupAuthorizeHandler">保存</el-button>
        <el-button size="small" @click="groupAuthorizeCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import '@src/assets/ccb_iconfonts/iconfont.js'
import { getDutyGroupApi, setAuthorizeApi, getPowerTree, getOrgListApi } from '../../../http/coffersManage/superuser.api.js'
import { getTreeApi } from '../../../http/coffersManage/doorStatus.api'
import { getUserApi, getOrgInfoApi } from '../../../http/coffersManage/coffersLog.api.js'
import common from '../components/common'

let allMemberOptions = []
let verifyModeArr = ['指纹识别', '密码', '刷卡', '指纹+密码', '人脸识别', '其他']
let groupData = []
let rootOrgName = ''
export default {
  name: 'superuser',
  mixins: [common],
  components: {
    treeBox
  },
  props: {
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      groupNameSelect: [],
      groupNameSelected: '',
      organizeSelect: [
        {
          value: '选项1',
          label: '北京监控中心'
        },
        {
          value: '选项2',
          label: '西安监控中心'
        }
      ],
      organizeSelected: '选项1',
      visible: false,
      rootId: '',
      treeType: 3, // 0: 机构-重点部位-设备-资源树、1: 机构-重点部位-设备树、2: 机构-重点部位树、3: 机构树

      initiates: '1', // 是否启用单选框   1: '启用'   2: '停用'
      verifyMode: '1', // 授权页面 - 验证方式单选框   1: '指纹识别'   2: '密码'  3: '刷卡'  4: '指纹+密码'  5: '人脸识别'  6: '其他'
      searchWatchman: '', // 选择值班员搜索框
      checkAll: false,
      checkedMembers: [], // 选中的值班组成员
      memberOptions: [], // 所有的值班组成员
      isIndeterminate: false,
      showKeySiteTree: false, // 显示重点部位机构树
      keySiteTreeData: [ // 重点部位机构树数据
        {
          label: '保定分行',
          children: [{
            label: 'XXX金库中心'
          }, {
            label: '定州支行',
            children: [{
              label: 'XXX金库'
            }]
          }]
        }
      ],

      currentDisposeGroup: {}, // 当前正在处理的值班组
      memberId: '' // 当前选中的要查看权限树的用户ID
    }
  },
  created() {
    this.getDutyGroup()
  },
  methods: {
    // 机构树懒加载数据接口
    getTreeApi(params) {
      return getTreeApi(params)
    },
    setRootId(id) {
      this.rootId = id // 根节点id
    },
    organizeTreeClickHandle(data, node) {
      this.organizeSelected = data.name
      this.getUserApiFun({orgId: [data.id]})
    },
    getUserApiFun(id) {
      getUserApi(id)
        .then(res => {
          let data = res.data.data
          if (data && data[0].user.length !== 0) {
            this.memberOptions = []
            data[0].user.forEach(item => {
              this.memberOptions.push({id: item.id, name: item.name})
            })
          }
        })
        .catch(() => {})
    },
    clear() {
      this.organizeSelected = '保定分行' // 根机构
    },
    /**
     * @description: 获取授权值班组下拉框数据
     * @param {type} 无
     * @return: 无
     */
    getDutyGroup() {
      getDutyGroupApi()
        .then((res) => {
          this.groupNameSelect = []
          let resultData = res.data.data.getDutyGroup
          groupData = resultData
          resultData.forEach(item => {
            this.groupNameSelect.push({
              value: item.id,
              label: item.groupName,
              termOfValidity: item.termOfValidity,
              dutyTime: item.dutyTime,
              verificationMethod: item.verificationMethod || '',
              state: item.state || '',
              dutyMember: item.dutyMember ? item.dutyMember === 'isEmpty' ? '' : item.dutyMember : ''
            })
          })
          this.groupNameSelected = this.groupId === '' ? this.groupNameSelect[0].value : this.groupId
          this.currentDisposeGroup = this.groupId === '' ? this.groupNameSelect[0] : this.groupNameSelect.find(item => item.value === this.groupId)
          this.updataAuthoFormFun()
        })
        .catch((err) => { console.log(err) })
    },
    /**
     * @description: 值班组下拉框值变化事件
     * @param {type} 无
     * @return: 无
     */
    groupNameSelectChangeHandler(data) {
      this.currentDisposeGroup = this.groupNameSelect.find(item => item.value === data)
      this.updataAuthoFormFun()
    },
    /**
     * @description: 更新表单方法
     * @param {type} 无
     * @return: 无
     */
    updataAuthoFormFun() {
      this.checkedMembers = (this.currentDisposeGroup.dutyMember === '' || this.currentDisposeGroup.dutyMember === 'isEmpty' || this.currentDisposeGroup.dutyMember.length === 0) ? [] : JSON.parse(this.currentDisposeGroup.dutyMember).map(item => item.name)
      this.initiates = this.currentDisposeGroup.state === '停用' ? '2' : '1' // 是否启用单选框   1: '启用'   2: '停用'
      this.verifyMode = this.currentDisposeGroup.verificationMethod === '' ? '1' : (verifyModeArr.indexOf(this.currentDisposeGroup.verificationMethod) + 1).toString() // 授权页面 - 验证方式单选框   1: '指纹识别'   2: '密码'  3: '刷卡'  4: '指纹+密码'  5: '人脸识别'  6: '其他'
    },
    /**
     * @description: 值班授权--值班组--编辑值班组图标按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    editGroupHandler() {
      this.$parent.currentItem = 'create'
      this.$nextTick(() => {
        this.$parent.titleText = '修改值班组'
        this.$parent.showButtonBox = true
        this.$parent.showFrontBtn = false
      })
      let findGroup = groupData.filter(item => item.id === this.groupNameSelected)[0]
      let params = {
        ID: findGroup.id,
        GroupName: findGroup.groupName,
        TermOfValidity: findGroup.termOfValidity,
        DutyTime: findGroup.dutyTime,
        dutyMember: findGroup.dutyMember,
        verificationMethod: findGroup.verificationMethod,
        state: findGroup.state
      }
      this.$emit('changeCurrentGroup', params)
    },

    /**
     * @description: 值班授权 - 选择值班员输入框值变化事件
     * @param {type} 无
     * @return: 无
     */
    filterMenber() {
      getUserApi({orgId: [rootOrgName.serial]})
        .then(res => {
          // 过滤成员
          let data = res.data.data
          if (this.searchWatchman.trim() === '') {
            this.memberOptions = data[0].user.map(item => ({id: item.id, name: item.name}))
          } else {
            let filterData = data[0].user.filter(item => item.name.includes(this.searchWatchman))
            this.memberOptions = filterData.map(item => ({id: item.id, name: item.name}))
          }
        })
        .catch(() => {})
      // 过滤成员
      // this.memberOptions = this.searchWatchman.trim() === '' ? this.memberOptions : this.memberOptions.filter(item => item.name.includes(this.searchWatchman))
      // let currentChecked = []
      // this.memberOptions.forEach(item => {
      //   if (this.checkedMembers.includes(item)) {
      //     currentChecked.push(item)
      //   }
      // })
      // this.checkedMembers = currentChecked
      // this.checkAll = this.checkedMembers.length === this.memberOptions.length
      // this.isIndeterminate = this.checkedMembers.length > 0 && this.checkedMembers.length < this.memberOptions.length
    },
    /**
     * @description: 值班授权--选择值班员--全选
     * @param {type} 无
     * @return: 无
     */
    handleCheckAllChange(val) {
      this.checkedMembers = val ? this.memberOptions.map(item => item.name) : []
      this.isIndeterminate = false
    },
    handleCheckedMemberChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.memberOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.memberOptions.length
    },
    /**
     * @description: 选择值班员--查看重点部位权限图标点击事件-显示机构树
     * @param {type} 无
     * @return: 无
     */
    showKeySiteLimits(e, member) {
      e.preventDefault()
      // 显示权限机构树
      this.memberId = member.id
      this.showKeySiteTree = !this.showKeySiteTree
      console.log('点击icon 图标', member)
    },
    getPowerTree(params) {
      let param = {
        userId: this.memberId,
        ...params
      }
      return getPowerTree(param)
    },
    /**
     * @description: 值班授权保存按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    groupAuthorizeHandler() {
      let currentSelectGroup = this.groupNameSelect.filter(item => item.value === this.groupNameSelected)
      // let jointDutyMember = []
      let jointDutyMember = this.searchWatchman.trim() === '' || currentSelectGroup[0].dutyMember === '' || currentSelectGroup[0].dutyMember.dutyMember === 'isEmpty' ? [] : JSON.parse(currentSelectGroup[0].dutyMember)
      if (this.checkedMembers.length !== 0) {
        this.checkedMembers.forEach(item => {
          // if (this.memberOptions.find(m => m.name === item)) {
          //   jointDutyMember.push(this.memberOptions.find(m => m.name === item))
          // }
          let findMember = this.memberOptions.find(m => m.name === item)
          if (!findMember) {
            return
          }
          if (findMember && !jointDutyMember.find(j => j.id === findMember.id)) {
            jointDutyMember.push(findMember)
          }
          if (this.searchWatchman.trim() !== '') {
            // 查询删除没有勾选项
            this.memberOptions.forEach(i => {
              if (!this.checkedMembers.includes(i.name)) {
                jointDutyMember = jointDutyMember.filter(fil => fil.id !== i.id)
              }
            })
          }
        })
      }
      let params = {
        AuthorityDutyGroup: {
          ID: currentSelectGroup[0].value,
          GroupName: currentSelectGroup[0].label,
          TermOfValidity: currentSelectGroup[0].termOfValidity,
          DutyTime: currentSelectGroup[0].dutyTime,
          dutyMember: this.checkedMembers.length === 0 ? 'isEmpty' : JSON.stringify(jointDutyMember),
          verificationMethod: verifyModeArr[Number(this.verifyMode) - 1],
          state: this.initiates === '1' ? '启用' : '停用'
        }
      }

      setAuthorizeApi(params)
        .then((res) => {
          this.$messageSuccess('值班组授权成功', '成功')
          this.groupNameSelected = ''
          this.checkedMembers = []
          this.isIndeterminate = false
          this.initiates = '1'
          this.verifyMode = '1'
          // 记录日志 - 金库授权
          this.recordLogFun({OperationType: '金库授权'})
        })
        .catch(() => {
          this.$messageError('保存设置失败, 请稍后重试！', '错误')
        })
    },
    /**
     * @description: 值班授权取消按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    groupAuthorizeCancel() {
      this.groupNameSelected = ''
      this.organizeSelected = '选项1'
      this.checkedMembers = []
      this.isIndeterminate = false
      this.initiates = '1'
      this.verifyMode = '1'
      // 跳转列表页面
      this.$emit('cancle')
    },
    /**
     * @description: rootId 变化事件
     * @param {type} 无
     * @return: 无
     */
    async rootIdChangeHandler(val) {
      rootOrgName = await getOrgInfoApi({ids: [val], type: 1})
      rootOrgName = rootOrgName.data.data.orgs[0]
      this.organizeSelected = rootOrgName.name
      // 获取用户下拉框数据
      this.getUserApiFun({orgId: [rootOrgName.serial]})
    }
  },
  watch: {
    rootId: {
      handler: 'rootIdChangeHandler'
    },
    memberOptions(val) {
      allMemberOptions = val
    }
  }
}
</script>

<style lang="less" scoped>
.authorization-container {
  width: 100%;
  height: 100%;

  // 展示值班授权
  .authorization-box {
    width: 800px;
    height: 800px;
    padding: 20px;
    h3 {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
    }
    .content-box {
      width: 100%;
      height: 600px;
      padding: 40px;
      margin: 20px 0;
      border: 1px solid #cccccc;
      .inp-item {
        display: flex;
        margin: 10px 0;
        .inp-label {
          font-size: 14px;
          width: 100px;
          line-height: 40px;
          display: inline-block;
        }
        .select-group-box {
          width: 350px;
          height: 300px;
          padding: 20px;
          border: 1px solid #cccccc;
          .el-checkbox-group {
            height: 190px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .el-checkbox {
              display: block;
              margin: 10px 0 0 0;
              /deep/ .el-checkbox__label {
                width: 100%;
              }
              .checkbox-icon {
                width: 60px;
                text-align: center;
                float: right;
              }
            }
        }
        .key-site-tree {
          width: 220px;
          height: 300px;
        }
        .el-select {
          width: 350px;
        }
        /deep/ .el-input.organize-select .el-input__inner {
          width: 350px;
        }
        .el-radio {
          line-height: 40px;
        }
        .edit-group-btn {
          font-size: 20px;
          margin-left: 20px;
          line-height: 40px;
        }
      }
    }
    .bottom-btn-box {
      display: flex;
      justify-content: center;
    }
  }

}
</style>
