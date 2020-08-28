<template>
  <div class="role-manage-import-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <i class="el-icon-location-outline" style="float: left; margin-right: 6px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>基础信息</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item class="active">{{ roleTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-box">
        <div class="box-title">{{ roleTitle }}角色</div>
        <div class="create-from">
          <ul>
            <li>
              <span>角色名称</span>
              <section :class="[rules.name ? 'blur-rule' : '']">
                <el-input
                  v-model="form.name"
                  size="small"
                  clearable
                  @clear="rules.name = false"
                  @blur="regExp(form.name, 'name', ['null'])"
                ></el-input>
                <p v-if="rules.name">{{ ruleTitle.name }}</p>
              </section>
            </li>
            <li>
              <span>角色类型</span>
              <section>
                <el-select v-model="form.type" placeholder="请选择类型" size="small">
                  <el-option
                    v-for="item in roleTypeData"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </section>
            </li>
            <li>
              <span>权限分配方式</span>
              <section>
                <el-select v-model="form.authorityAssignType" placeholder="请选择分配方式" size="small">
                  <el-option
                    v-for="item in authorityTypeData"
                    :label="item.label"
                    :value="item.value"
                    @click.native="setPoint(item)"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </section>
            </li>
            <li>
              <span>资源类型</span>
              <section>
                <el-select v-model="form.pointType" placeholder="请选择类型" size="small" :disabled="point">
                  <el-option
                    v-for="item in alow"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                    @click.native="setPoints(item)"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </section>
            </li>
            <li class="last">
              <span>备注</span>
              <section :class="[rules.description ? 'blur-rule' : '']">
                <el-input
                  v-model="form.description"
                  size="small"
                  clearable
                  @clear="rules.description = false"
                  @blur="regExp(form.description, 'description', ['long'])"
                ></el-input>
                <p v-if="rules.description">{{ ruleTitle.description }}</p>
              </section>
            </li>
          </ul>
        </div>
        <div class="transfer">
          <section>
            <h3>按{{ authorityTitle }}位授权</h3>
            <div class="section" style="overflow: hidden;">
              <Tree :key="currentId" :defaultExpandedKeys="defaultExpandedKeys" ref="leftTree"></Tree>
            </div>
          </section>
          <section>
            <h3>功能权限</h3>
            <div class="section">
              <el-tree
                :data="powerObj.data"
                show-checkbox
                node-key="id"
                ref="tree"
                :default-expanded-keys="[...powerObj.open]"
                :default-checked-keys="[...powerObj.check]"
                :props="defaultProps"
              ></el-tree>
            </div>
          </section>
        </div>
        <div class="p-search-footer">
          <el-button type="primary" @click="submit" size="small">保存</el-button>
          <el-button @click="reset" size="small">重置</el-button>
          <el-button @click="close" v-show="show" size="small">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Tree from './PowerTree'
export default {
  name: 'RoleManageCreate',
  components: { Tree },
  data() {
    return {
      save: true,
      flag: false,
      obj: {},
      form: {
        name: '',
        type: '1',
        authorityAssignType: '1',
        pointType: '',
        description: ''
      },
      ruleTitle: {
        name: '',
        type: '',
        authorityAssignType: '',
        pointType: '',
        description: ''
      },
      rules: {
        name: false,
        type: false,
        authorityAssignType: false,
        pointType: false,
        description: false
      },
      roleTypeData: [
        { value: '1', label: '正常授权' },
        { value: '2', label: '排除授权' }
      ],
      authorityTypeData: [
        { value: '1', label: '按部位授权' },
        { value: '2', label: '按点位授权' }
      ],
      alow: [
        {
          value: '2-1',
          label: '视频设备',
          disabled: false
        },
        {
          value: '2-2',
          label: '报警设备',
          disabled: false
        },
        {
          value: '2-3',
          label: '门禁系统',
          disabled: false
        },
        {
          value: '2-4',
          label: '音频设备',
          disabled: false
        },
        {
          value: '2-5',
          label: '防护舱',
          disabled: false
        },
        {
          value: '2-6',
          label: '停车系统',
          disabled: false
        },
        {
          value: '2-7',
          label: '电视墙',
          disabled: false
        }
        // {
        //   value: '2-8',
        //   label: '互锁门',
        //   disabled: false
        // },
        // {
        //   value: '2-9',
        //   label: '消防设备',
        //   disabled: true
        // },
        // {
        //   value: '2-10',
        //   label: 'AI训练平台',
        //   disabled: true
        // },
        // {
        //   value: '2-11',
        //   label: '金库远程',
        //   disabled: true
        // },
      ],
      data: [],
      powerObj: {
        data: [],
        open: [],
        check: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      resets: {}
    }
  },
  computed: {
    ...mapState({
      currentView: ({ roleManage }) => roleManage.currentView,
      currentTitle: ({ roleManage }) => roleManage.currentTitle,
      fromView: ({ roleManage }) => roleManage.fromView,
      fromTitle: ({ roleManage }) => roleManage.fromTitle,
      roleTitle: ({ roleManage }) => roleManage.roleTitle,
      lastTitle: ({ roleManage }) => roleManage.lastTitle,
      resourceData: ({ roleManage }) => roleManage.resourceData,
      rigthTree: ({ roleManage }) => roleManage.rigthTree,
      detailData: ({ roleManage }) => roleManage.detailData[0],
      currentId: ({ roleManage }) => roleManage.currentId,
      checkedKeys: ({ roleManage }) => roleManage.checkedKeys,
      checkRigth: ({ roleManage }) => roleManage.checkRigth,
      halfCheckedKeys: ({ roleManage }) => roleManage.halfCheckedKeys,
      rootNodeKey: ({ roleManage }) => roleManage.rootNodeKey,
      checkNode: ({ roleManage }) => roleManage.checkNode,
      lastCheckOver: ({ roleManage }) => roleManage.lastCheckOver,
      setLeft: ({ roleManage }) => roleManage.setLeft,
      openKey: ({ roleManage }) => roleManage.openKey
    }),
    show() {
      if (this.fromTitle === '列表') {
        return true
      } else {
        return false
      }
    },
    point() {
      if (this.form.authorityAssignType !== '2') {
        return true
      } else {
        return false
      }
    },
    authorityTitle() {
      if (this.form.authorityAssignType === '1') {
        return '机构部'
      } else if (this.form.authorityAssignType === '2') {
        return '资源点'
      } else {
        return ''
      }
    },
    defaultExpandedKeys() {
      if (this.roleTitle === '编辑') {
        if (this.currentId === this.openKey) {
          return [...this.setLeft[1]]
        } else {
          return []
        }
      } else {
        return []
      }
    }
  },
  created() {
    this.powerTree()
    this.obj = { ...this.form }
    if (this.currentId === '1') {
      this.form.authorityAssignType = '1'
    } else {
      this.form.authorityAssignType = '2'
    }
    if (this.roleTitle === '编辑') {
      // let arr = this.$lodash.cloneDeep(this.alow)
      // arr.forEach(item => {
      //   item.disabled = true
      // })
      // this.alow = arr
      let { id } = this.detailData
      this.roleDetail({ roleId: [id] })
      // this.roleOperation({roleId: [id]})
      this.roleResource({ roleId: [id] })
    }
  },
  mounted() {
    // console.log(this.$lodash.cloneDeep(this.getNode(this.rootNodeKey)), this.getNode(this.rootNodeKey))
  },
  methods: {
    ...mapActions('roleManage', [
      'setState',
      'setRole',
      'updateRole',
      'getPowerTree',
      'getRoleDetail',
      'getRoleOperation',
      'getRoleResource'
    ]),
    ...mapMutations('roleManage', ['SET_STATE']),
    // 获取角色详情
    async roleDetail(obj) {
      await this.getRoleDetail(obj).then((res) => {
        let { code, data } = res.data
        if (code === 0) {
          let obj = { ...data.role[0] }
          obj.authorityAssignType = `${obj.authorityAssignType}`
          obj.type = `${obj.type}`
          console.log(obj)
          if (obj.authorityAssignType === 1) {
            this.setState({ type: 'SET_STATE', key: 'currentId', value: '1' })
          } else if (obj.authorityAssignType === 2) {
            this.setState({ type: 'SET_STATE', key: 'currentId', value: '2-1' })
          }
          this.form = Object.assign(this.form, obj)
        }
      })
    },
    // 获取角色关联的操作权限right
    roleOperation(obj) {
      this.getRoleOperation(obj).then((res) => {
        let { code, data } = res.data
        if (code === 0) {
          if (!(data.roleRelations || data.roleRelations[0].operation)) {
            return this.$message('获取权限失败')
          }
          let obj = data.roleRelations && data.roleRelations[0].operation
          let arr = this.recursion(obj)
          arr = this.idArr(arr)
          let checkarr = this.setRightCheck(this.$lodash.cloneDeep(this.rigthTree), arr)
          this.$refs.tree.defaultExpandedKeys = [...arr]
          this.$refs.tree.setCheckedKeys([...checkarr])
          this.setState({ type: 'SET_STATE', key: 'checkRigth', value: arr })
        }
      })
    },
    setRightCheck(data, arr, obj = []) {
      data.forEach((item) => {
        let flag = arr.some((atm) => atm === item.id)
        if (flag) {
          if (item.children) {
            this.setRightCheck(item.children, arr, obj)
          } else {
            obj.push(item.id)
          }
        }
      })
      return obj
    },
    // 获取关联的资源信息left
    roleResource(obj) {
      this.getRoleResource(obj).then((res) => {
        let { code, data } = res.data
        if (code === 0) {
          if (!data.roleResource) {
            return this.$message('获取资源失败')
          }
          let arr = []
          arr = data.roleResource && this.$lodash.cloneDeep(data.roleResource[0].deviceData)
          let pointType = ''
          if (arr.some((item) => !item.deviceType)) {
            pointType = ''
            this.setState({ type: 'SET_STATE', key: 'currentId', value: '1' })
            this.setState({ type: 'SET_STATE', key: 'openKey', value: '1' })
          } else {
            pointType = '2' + '-' + arr[0].deviceType
            this.setState({ type: 'SET_STATE', key: 'currentId', value: pointType })
            this.setState({ type: 'SET_STATE', key: 'openKey', value: pointType })
          }
          this.form.pointType = pointType
          arr.forEach((item) => {
            item.pointType = item.pointType.split('_')
          })
          let data1 = []
          let arr1 = arr && arr.filter((item) => item.pointType[0] === '1')
          arr1.forEach((item) => data1.push(item.pointType[1]))
          let data2 = []
          let arr2 = arr && arr.filter((item) => item.pointType[0] === '2')
          arr2.forEach((item) => data2.push(item.pointType[1]))
          console.log(arr, pointType, data1, data2)
          if (data2 && data2.length > 0) {
            // this.$refs.leftTree.defaultExpandedKeys(data2)
          }
          if (data1 && data1.length > 0) {
            this.$refs.leftTree.setCheckedKeys(data1)
          }
          this.setState({ type: 'SET_STATE', key: 'lastCheckOver', value: arr })
          this.setState({ type: 'SET_STATE', key: 'setLeft', value: [data1, data2] })
        }
      })
    },
    // allArr
    checkArr(data, arr = []) {
      data.forEach((item) => {
        if (!item.checked) {
          if (item.childNodes && item.childNodes.length > 0) {
            this.checkArr(item.childNodes, arr)
          }
        } else {
          if (item.childNodes && item.childNodes.length > 0) {
            this.checkArr(item.childNodes, arr)
          }
          arr.push(item.data)
        }
      })
      return arr
    },
    checkDeal(arr1 = [], arr2 = []) {
      let data1 = []
      arr1.forEach((item) => {
        let obj = {}
        if (item.nodeKey && item.nodeKey.includes('org')) {
          obj.orgId = item.id * 1
          obj.pointType = ['1', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('loc')) {
          obj.keypartId = item.id * 1
          obj.pointType = ['1', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('equ')) {
          obj.deviceId = item.id * 1
          obj.pointType = ['1', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('res')) {
          obj.deviceId = item.dId * 1
          obj.resourceId = item.id
          obj.pointType = ['1', item.nodeKey]
        }
        data1.push(obj)
      })
      let data2 = []
      arr2.forEach((item) => {
        console.log(item)
        let obj = {}
        if (item.nodeKey && item.nodeKey.includes('org')) {
          obj.orgId = item.id * 1
          obj.pointType = ['2', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('loc')) {
          obj.keypartId = item.id * 1
          obj.pointType = ['2', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('equ')) {
          obj.deviceId = item.id * 1
          obj.pointType = ['2', item.nodeKey]
        }
        if (item.nodeKey && item.nodeKey.includes('res')) {
          obj.deviceId = item.dId * 1
          obj.resourceId = item.id
          obj.pointType = ['2', item.nodeKey]
        }
        data2.push(obj)
      })
      return [...data1, ...data2]
    },
    // 保存
    submit() {
      if (!this.save) {
        this.$notify({title: '', message: `请不要重复保存！`, type: 'error'})
        return false
      }
      this.save = false
      console.log('1111')
      // console.log(this.$lodash.cloneDeep(this.getNode(this.rootNodeKey)), this.getNode(this.rootNodeKey))
      let userObj = {
        createUserId: JSON.parse(sessionStorage.user).id,
        createOrgId: JSON.parse(sessionStorage.user).org ? JSON.parse(sessionStorage.user).org : '123',
        roleResource: [],
        roleOperation: []
      }
      let form = { ...this.form, ...userObj }
      if (this.ruleExp(form).some((i) => i)) {
        return false
      }
      let { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes } = this.checkNode
      let allArr = this.$lodash.cloneDeep(this.getNode(this.rootNodeKey))
      let arrObj = this.checkArr([allArr])
      arrObj = arrObj.filter((item) => {
        if (checkedKeys && checkedKeys.length > 0) {
          if (!checkedKeys.some((i) => i === item.nodeKey)) {
            return item
          }
        }
      })
      let data = []
      if (checkedNodes && halfCheckedNodes) {
        data = this.checkDeal([...checkedNodes, ...arrObj], halfCheckedNodes)
      }
      let lastCheckOver = this.$lodash.cloneDeep(this.lastCheckOver)
      let deleteCheck = lastCheckOver.filter((item) => {
        if (data.length) {
          if (!data.some((i) => i.pointType[1] === item.pointType[1])) {
            item.status = 2
            item.pointType = JSON.stringify(item.pointType)
              .replace(/\[|\]|\"/gi, '')
              .replace(/,/gi, '_')
            return item
          }
        } else {
          item.status = 1
          item.pointType = JSON.stringify(item.pointType)
            .replace(/\[|\]|\"/gi, '')
            .replace(/,/gi, '_')
          return item
        }
      })
      console.log(deleteCheck)
      data && data.forEach((item) => {
        let obj = lastCheckOver.filter((i) => i.pointType[1] === item.pointType[1])[0]
        if (obj && obj.id) {
          item.id = obj.id
        }
        item.status = 1
        item.deviceType = form.pointType.slice(2)
        item.pointType = JSON.stringify(item.pointType)
          .replace(/\[|\]|\"/gi, '')
          .replace(/,/gi, '_')
      })
      data && data.push(...deleteCheck)
      form.authorityAssignType = form.authorityAssignType * 1
      form.type = form.type * 1
      let arr = Array.from(new Set([...this.$refs.tree.getCheckedNodes(false, true)]))
      form.roleOperation = arr.map((item) => {
        item = { operationId: item.id, status: 1 }
        return item
      })
      form.roleResource = data
      let { checkRigth } = this
      let { roleOperation } = form
      checkRigth = checkRigth.map((item) => {
        item = { operationId: item, status: 2 }
        return item
      })
      let arr1 = []
      checkRigth.forEach((item) => {
        let flag = roleOperation.some((atm) => atm.operationId === item.operationId)
        if (!flag) {
          arr1.push(item)
        }
      })
      form.roleOperation = [...roleOperation, ...arr1]
      delete form.pointType
      console.log('1111', form)
      if (this.roleTitle === '新建') {
        this.setRole(form).then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            this.$message('新建成功')
            setTimeout(() => this.close(), 500)
          } else {
            return this.$message('新建失败')
          }
        })
      }
      if (this.roleTitle === '编辑') {
        form.id = this.form.id
        this.updateRole(form).then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            this.$message('编辑修改成功')
            setTimeout(() => this.close(), 500)
          } else {
            return this.$message('编辑修改失败')
          }
        })
      }
    },
    ruleExp(obj) {
      for (let i in obj) {
        if (i === 'name') {
          this.regExp(obj[i], `${i}`, ['null'])
        }
        if (i === 'description') {
          this.regExp(obj[i], `${i}`, ['long'])
        }
      }
      let arr = []
      for (let i in this.rules) {
        arr.push(this.rules[i])
      }
      return arr
    },
    // 重置
    reset() {
      if (this.roleTitle === '编辑') {
        this.form = this.resets.form
        this.powerObj = this.resets.powerObj
      } else {
        this.form = { ...this.obj }
      }
    },
    // 关闭
    close() {
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'RoleManageList' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '列表' })
      this.reset()
    },
    // 功能权限树
    async powerTree() {
      await this.getPowerTree()
        .then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            let arr = this.recursion(data)
            this.powerObj.data = arr
            // console.log(data)
            this.setState({ type: 'SET_STATE', key: 'rigthTree', value: arr })
          }
        })
        .then((_) => {
          if (this.roleTitle === '编辑') {
            let { id } = this.detailData
            this.roleOperation({ roleId: [id] })
          }
        })
    },
    // 功能权限树数据处理
    recursion(data = []) {
      let arr = data.map((item) => {
        let { code, name, isRoot, type, children } = item
        let obj = {}
        obj.id = code
        obj.label = name
        obj.isRoot = isRoot
        obj.type = type
        if (children) {
          obj.children = this.recursion(children)
        }
        return obj
      })
      return arr
    },
    // id过滤
    idArr(data, arr = []) {
      data.forEach((item) => {
        if (item.children) {
          arr.push(item.id)
          this.idArr(item.children, arr)
        } else {
          arr.push(item.id)
        }
      })
      return arr
    },
    setPoint(item) {
      if (item.value === '1') {
        this.setState({ type: 'SET_STATE', key: 'currentId', value: '1' })
      } else if (item.value === '2') {
        this.form.pointType = '2-1'
        this.setState({ type: 'SET_STATE', key: 'currentId', value: this.form.pointType })
      }
    },
    setPoints(item) {
      this.form.pointType = item.value
      this.setState({ type: 'SET_STATE', key: 'currentId', value: item.value })
    },
    // 获取当前节点node
    getNode(id) {
      return this.$refs.leftTree.getNode(id)
    },
    // 校验
    regExp(value, key, arr) {
      let leng = 0
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      str.split('').forEach((i) => {
        if (/^[\u4e00-\u9fa5]+$/i.test(i)) {
          leng += 1
        }
      })
      arr.forEach((item) => {
        if (item === 'null') {
          if (str === '') {
            this.rules[key] = true
            this.ruleTitle[key] = '内容不能为空'
          } else if (str.length + leng > 128) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出128个字符(中文占两位)'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'long') {
          if (str.length + leng > 128) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出128个字符(中文占两位)'
          } else {
            this.rules[key] = false
          }
        } else {
          this.rules[key] = false
        }
      })
      // let phone = /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i // 电话格式
      // let tel = /^0\d{2,3}-?\d{7,8}$/ // 固定电话格式
      // let email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ // 电子邮箱格式
      // if (key === 'phone') {
      //   if (!phone.test(value)) {
      //     return this.$message('电话格式不对')
      //   }
      // }
      // if (key === 'tel') {
      //   if (!tel.test(value)) {
      //     return this.$message('固定电话格式不对')
      //   }
      // }
      // if (key === 'email') {
      //   if (!email.test(value)) {
      //     return this.$message('电子邮箱格式不对')
      //   }
      // }
    }
  },
  watch: {
    'form.authorityAssignType'() {
      if (this.form.authorityAssignType === '1') {
        this.form.pointType = ''
        this.setState({ type: 'SET_STATE', key: 'currentId', value: '1' })
      } else if (this.form.authorityAssignType === '2') {
        this.form.pointType = '2-1'
        this.setState({ type: 'SET_STATE', key: 'currentId', value: this.form.pointType })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.role-manage-import-box {
  width: 100%;
  height: 100%;overflow: hidden;
  display: flex;
  .content {
    flex: 1;
    width: 100%;
    padding: 5px 0px 5px 10px;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      height: 30px;
      color: #333333;
      /deep/ .el-breadcrumb {
        font-size: 12px;
        .active {
          .el-breadcrumb__inner {
            color: #2d72d3;
          }
        }
      }
    }
    .main-box {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
      // height: calc(~'100%-30px');
      .box-title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      .create-from {
        border: 1px solid #ddd;
        padding: 15px 10px 5px 20px;
        width: 80%;
        max-width: 1360px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        ul {
          width: 100%;
          height: 96%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 50%;
            height: 48px;
            display: flex;
            span {
              width: 150px;
              height: 32px;
              background: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            section {
              flex: 1;
              height: 100%;
              padding: 0px 10px;
              display: flex;
              flex-direction: column;
              // align-items: center;
              .el-select {
                width: 100%;
              }
              /deep/ .el-date-editor {
                width: 100%;
              }
              .el-cascader {
                width: 100%;
              }
              p {
                color: red;
                font-size: 12px;
              }
            }
            .blur-rule {
              .el-input {
                /deep/ input {
                  border-color: red;
                }
              }
            }
          }
          .last {
            width: 100%;
          }
        }
      }
      .transfer {
        flex: 1;
        border: 1px solid #ddd;
        padding: 2px;
        width: 80%;
        max-width: 1360px;
        min-height: 480px;
        margin: 15px auto;
        display: flex;
        justify-content: space-around;
        section {
          width: 40%;
          height: 100%;
          display: flex;
          flex-direction: column;
          h3 {
            text-align: center;
            background: #ebebeb;
            padding: 10px 0px;
          }
          .section {
            flex: 1;
            width: 100%;
            border: 1px solid #ededed;
            margin-top: 5px;
            overflow: auto;
          }
        }
      }
      .p-search-footer {
        // max-width: 1360px;
        padding-top: 10px;
        text-align: center;
      }
    }
  }
}
</style>
