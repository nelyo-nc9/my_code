<template>
  <div class="people-manage-search-box">
    <!-- 面包屑 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员{{currentTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item class="active">{{currentTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 顶部操作栏 -->
    <div class="content">
      <div class="main-box">
        <div class="top-header" @click="style.search=!style.search">
          查询条件
          <i :class="style.search ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </div>
        <div class="wrap-body" :style="{height: style.search ? '282px' : '0px', transition: 'height .8s', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}">
          <div class="wrap-main">
            <ul>
              <li>
                <span>姓名</span>
                <section :class="[rules.name ? 'blur-rule' : '']">
                  <el-input v-model="form.name" size="small" clearable @clear="rules.name=false" @blur="regExp(form.name, 'name', ['long'])"></el-input>
                  <p v-if="rules.name">{{ruleTitle.name}}</p>
                </section>
              </li>
              <li>
                <span>姓名拼音全称</span>
                <section :class="[rules.pinyin ? 'blur-rule' : '']">
                  <el-input v-model="form.pinyin" size="small" clearable @clear="rules.pinyin=false" @blur="regExp(form.pinyin, 'pinyin', ['long'])"></el-input>
                  <p v-if="rules.pinyin">{{ruleTitle.pinyin}}</p>
                </section>
              </li>
              <li>
                <span>员工识别登录名</span>
                <section :class="[rules.userName ? 'blur-rule' : '']">
                  <el-input v-model="form.userName" size="small" clearable @clear="rules.userName=false" @blur="regExp(form.userName, 'userName', ['long'])"></el-input>
                  <p v-if="rules.userName">{{ruleTitle.userName}}</p>
                </section>
              </li>
              <li>
                <span>员工编号</span>
                <section :class="[rules.uid ? 'blur-rule' : '']">
                  <el-input v-model="form.uid" size="small" clearable @clear="rules.uid=false" @blur="regExp(form.uid, 'uid', ['long'])"></el-input>
                  <p v-if="rules.uid">{{ruleTitle.uid}}</p>
                </section>
              </li>
              <li>
                <span>出生日期</span>
                <section>
                  <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" style="width: 100%;" size="small"></el-date-picker>
                  <!-- <el-date-picker v-model="form.birthday" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;" size="small"></el-date-picker> -->
                </section>
              </li>
              <li>
                <span>性别</span>
                <section>
                  <el-radio-group v-model="form.sex" size="small" style="margin-top: 9px;">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </section>
              </li>
              <li>
                <span>学位</span>
                <section :class="[rules.degree ? 'blur-rule' : '']">
                  <el-input v-model="form.degree" size="small" clearable @clear="rules.degree=false" @blur="regExp(form.degree, 'degree', ['long'])"></el-input>
                  <p v-if="rules.degree">{{ruleTitle.degree}}</p>
                </section>
              </li>
              <li>
                <span>学历</span>
                <section>
                  <el-select v-model="form.schooling" placeholder="请选择" size="small">
                    <el-option label="高中" value="高中"></el-option>
                    <el-option label="大专" value="大专"></el-option>
                    <el-option label="本科" value="本科"></el-option>
                    <el-option label="硕士" value="硕士"></el-option>
                    <el-option label="博士及以上" value="博士及以上"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>专业</span>
                <section>
                  <el-select v-model="form.professional" placeholder="请选择专业" size="small">
                    <el-option label="金融" value="金融"></el-option>
                    <el-option label="管理" value="管理"></el-option>
                    <el-option label="财管" value="财管"></el-option>
                    <el-option label="投资" value="投资"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>毕业院校</span>
                <section :class="[rules.school ? 'blur-rule' : '']">
                  <el-input v-model="form.school" size="small" clearable @clear="rules.school=false" @blur="regExp(form.school, 'school', ['long'])"></el-input>
                  <p v-if="rules.school">{{ruleTitle.school}}</p>
                </section>
              </li>
              <li>
                <span>学校性质</span>
                <section>
                  <el-select v-model="form.schoolType" placeholder="请选择" size="small">
                    <el-option label="公办" value="公办"></el-option>
                    <el-option label="民办" value="民办"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>学习形式</span>
                <section>
                  <el-select v-model="form.learningType" placeholder="请选择" size="small">
                    <el-option label="全日制" value="全日制"></el-option>
                    <el-option label="成人自考" value="成人自考"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>毕业日期</span>
                <section>
                  <el-date-picker v-model="form.graduationDate" type="date" placeholder="选择日期" style="width: 100%;" size="small"></el-date-picker>
                  <!-- <el-date-picker v-model="form.graduationDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%;" size="small"></el-date-picker> -->
                </section>
              </li>
              <li>
                <span>所属机构</span>
                <section>
                  <el-select v-model="form.orgName" placeholder="请选择所属机构" size="small" clearable  ref="selectTree">
                  <el-option hidden value="tree"></el-option>
                  <Tree ref="tree" :lazyTreeApi="getTree" @clickData="clickData" treeLazyToggle></Tree>
                  </el-select>
                </section>
              </li>
              <li>
                <span>工作单位</span>
                <section :class="[rules.units ? 'blur-rule' : '']">
                  <el-input v-model="form.units" size="small" clearable @clear="rules.units=false" @blur="regExp(form.units, 'units', ['long'])"></el-input>
                  <p v-if="rules.units">{{ruleTitle.units}}</p>
                </section>
              </li>
              <li>
                <span>用户类型</span>
                <section>
                  <el-select v-model="form.type" placeholder="请选择用户类型" size="small">
                    <el-option label="用户一" value="1"></el-option>
                    <el-option label="用户二" value="2"></el-option>
                  </el-select>
                </section>
              </li>
              <li>
                <span>用户状态</span>
                <section>
                  <el-select v-model="form.status" placeholder="请选择用户状态" size="small">
                    <el-option label="冻结" value="1"></el-option>
                    <el-option label="非冻结" value="2"></el-option>
                  </el-select>
                </section>
              </li>
            </ul>
          </div>
          <div class="p-search-footer">
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              <el-button @click="reset" size="small">重置</el-button>
              <el-button size="small" @click="educe" icon="icon iconfont-ccb ccbdaochu1 el-icon-">导出</el-button>
          </div>
        </div>
      </div>
      <div class="main-box">
        <div class="top-header" @click="style.table=!style.table">
          查询结果
          <i :class="style.table ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </div>
        <div class="wrap-body" :style="{height: style.table ? '500px' : '0px', transition: 'height .8s', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}">
          <div class="wrap-main">
            <!-- 表格和分页 -->
            <div class="list-box-table">
              <el-table
                stripe
                border
                size="medium"
                :data="tableData"
                highlight-current-row
                @selection-change="handleSelectionChange"
                @cell-dblclick="dblclick"
                ref="Table"
                height="100%"
                style="width: 100%;height: 100%;"
              >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                <el-table-column label="员工照片" type="picture" width="120" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.picture" height="36" />
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(column, index) in columns"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                  :width="column.width"
                  :sortable="column.sortable"
                  show-overflow-tooltip
                  align="center"
                  :resizable="resizable"
                ></el-table-column>
              </el-table>
            </div>
            <div class="main-footer">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageNum"
                :page-sizes="[25,50,100,200]"
                :page-size="pageSize"
                :current-page="page"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Tree from '@src/components/tree/treeBox'
import { orgTreeApi } from '@src/http/systemMaintain/roleManage.api.js'
import { download } from '@src/common/download.js'

export default {
  name: 'PeopleManageSearch',
  components: { Tree },
  data() {
    return {
      style: {
        search: true,
        table: true
      },
      columns: [
        // { prop: 'picture', label: '照片', width: '150' },
        { prop: 'name', sortable: true, label: '姓名', width: '100' },
        { prop: 'pinyin', sortable: true, label: '用户姓名拼音全称', width: '200' },
        { prop: 'userName', sortable: true, label: '员工识别登录名', width: '200' },
        { prop: 'uid', sortable: true, label: '员工编号', width: '120' },
        { prop: 'sex', sortable: true, label: '性别', width: '100' },
        { prop: 'birthday', sortable: true, label: '出生日期', width: '120' },
        { prop: 'degree', sortable: true, label: '学位', width: '100' },
        { prop: 'schooling', sortable: true, label: '学历', width: '100' },
        { prop: 'professional', sortable: true, label: '专业', width: '100' },
        { prop: 'school', sortable: true, label: '毕业院校', width: '120' },
        { prop: 'schoolType', sortable: true, label: '学校性质', width: '120' },
        { prop: 'learningType', sortable: true, label: '学习形式', width: '120' },
        { prop: 'graduationDate', sortable: true, label: '毕业日期', width: '120' },
        { prop: 'orgName', sortable: true, label: '所属机构', width: '200' },
        { prop: 'units', sortable: true, label: '工作单位', width: '200' },
        { prop: 'type', sortable: true, label: '用户类型', width: '200' },
        { prop: 'status', sortable: true, label: '用户状态', width: '200' },
        { prop: 'officePhone', sortable: true, label: '办公电话', width: '200' },
        { prop: 'mobilePhone', sortable: true, label: '移动电话', width: '200' },
        { prop: 'alternatePhone', sortable: true, label: '备用电话', width: '200' },
        { prop: 'email', sortable: true, label: '电子邮箱', width: '200' },
        { prop: 'createdUserName', sortable: true, label: '录入人', width: '200' },
        { prop: 'createdOrgName', sortable: true, label: '录入机构', width: '200' },
        { prop: 'createdAt', sortable: true, label: '录入时间', width: '200' }
      ],
      resizable: true,
      tableData: [],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        tilte: '',
        name: '',
        pinyin: '',
        userName: '',
        uid: '',
        sex: '',
        birthday: '',
        degree: '',
        schooling: '',
        professional: '',
        school: '',
        schoolType: '',
        learningType: '',
        graduationDate: '',
        orgName: '',
        org: '',
        units: '',
        type: '',
        status: ''
      },
      ruleTitle: {
        tilte: '',
        name: '',
        pinyin: '',
        userName: '',
        uid: '',
        sex: '',
        birthday: '',
        degree: '',
        schooling: '',
        professional: '',
        school: '',
        schoolType: '',
        learningType: '',
        graduationDate: '',
        orgName: '',
        org: '',
        units: '',
        type: '',
        status: ''
      },
      rules: {
        title: '',
        name: false,
        pinyin: false,
        userName: false,
        uid: false,
        sex: false,
        birthday: false,
        degree: false,
        schooling: false,
        professional: false,
        school: false,
        schoolType: false,
        learningType: false,
        graduationDate: false,
        orgName: false,
        org: false,
        units: false,
        type: false,
        status: false
      },
      storeArr: [],
      pageSize: 25,
      page: 1
    }
  },
  computed: {
    ...mapState({
      currentTitle: ({ peopleManage }) => peopleManage.currentTitle,
      orgName: ({ peopleManage }) => peopleManage.orgName,
      currentView: ({peopleManage}) => peopleManage.currentView
    }),
    ...mapState({vstate: ({ peopleManage }) => peopleManage})
  },
  created() {
    this.obj = { ...this.form }
  },
  methods: {
    ...mapActions('peopleManage', ['setState', 'getList', 'exportManage']),
    ...mapMutations('peopleManage', ['SET_STATE']),
    getTree(params) {
      return orgTreeApi(params)
    },
    clickData(data) { // 机构树加载节点信息
      console.log('clickData', data)
      if (data && data instanceof Object) {
        this.form.org = data.serial
        this.form.orgName = data.name
        this.$refs.selectTree.blur()
      }
    },
    // 请求表格数据方法
    getTableList(obj = { pageSize: 25, page: 1, sync: 1 }) {
      this.getList(obj).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          this.total = data.page.totalNumber
          if (data.user.length > 0) {
            this.$messageSuccess('列表获取成功')
          } else {
            this.$notify({ type: 'info', message: '无数据', position: 'bottom-right', offset: 100 })
          }
          this.tableData = this.handleData(data.user)
        }
      })
    },
    // 渲染键值处理
    handleData(data) {
      let arr = this.$lodash.cloneDeep(data)
      arr.forEach(item => {
        if (item.sex === 1) {
          item.sex = '男'
        } else if (item.sex === 2) {
          item.sex = '女'
        } else if (item.sex === 3) {
          item.sex = '未知'
        }
        if (item.status === 1) {
          item.status = '冻结'
        } else if (item.status === 2) {
          item.status = '激活'
        }
        if (item.type === 1) {
          item.type = '用户一'
        } else if (item.type === 2) {
          item.type = '用户二'
        }
        if (!item.orgName) {
          item.orgName = this.orgName
        }
      })
      return arr
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.storeArr = [...val]
      console.log(val, '列表勾选')
    },
    // 双击查看
    dblclick(val) {
      this.storeArr = [val]
      this.setState({ type: 'SET_STATE', key: 'detailData', value: val })
      this.setState({ type: 'SET_STATE', key: 'fromView', value: this.currentView })
      this.setState({ type: 'SET_STATE', key: 'fromTitle', value: this.currentTitle })
      this.setState({ type: 'SET_STATE', key: 'currentView', value: 'PeopleManageDetail' })
      this.setState({ type: 'SET_STATE', key: 'currentTitle', value: '查看' })
      let people = JSON.stringify(this.vstate)
      this.$router.push({path: '/systemMaintenancet/basicInfo/peopleManage', query: {people: this.$CryptoAES.encrypt(people)}})
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
      // let obj = { pageSize: this.pageSize, page: val, sync: 1 }
      let obj = Object.assign({ pageSize: this.pageSize, page: val, sync: 1 }, this.handleForm(this.form))
      this.getTableList(Object.assign(obj, this.handleForm(this.form)))
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询键值处理
    handleForm(form) {
      let arr = this.$lodash.cloneDeep([form])
      arr = arr.map(item => {
        // console.log(item.birthday, item.graduationDate)
        item.birthday = this.$moment(item.birthday).format('YYYY-MM-DD')
        item.graduationDate = this.$moment(item.graduationDate).format('YYYY-MM-DD')
        item.status = item.status * 1
        if (item.type === '1' || item.type === '2') {
          item.type = item.type * 1
        } else {
          delete item.type
        }
        if (item.sex === '女') {
          item.sex = 2
        }
        if (item.sex === '男') {
          item.sex = 1
        }
        if (item.sex === '') {
          delete item.sex
        }
        if (item.status === 0) {
          delete item.status
        }
        if (item.birthday === 'Invalid date') {
        //   item.birthday[0] = this.$moment(item.birthday[0]).format('YYYY-MM-DD HH:mm') instanceof Array
        //   item.birthday[1] = this.$moment(item.birthday[1]).format('YYYY-MM-DD HH:mm')
        // } else {
          delete item.birthday
        }
        if (item.graduationDate === 'Invalid date') {
        //   item.graduationDate[0] = this.$moment(item.graduationDate[0]).format('YYYY-MM-DD HH:mm') instanceof Array
        //   item.graduationDate[1] = this.$moment(item.graduationDate[1]).format('YYYY-MM-DD HH:mm')
        // } else {
          delete item.graduationDate
        }
        delete item.orgName
        return item
      })
      return arr[0]
    },
    // 查询
    onSubmit() {
      // console.log(this.form)
      let obj = Object.assign({ pageSize: this.pageSize, page: this.page, sync: 1 }, this.handleForm(this.form))
      console.log(obj)
      this.getTableList(obj)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
      // this.tableData = []
      this.total = 0
      this.pageSize = 25
      this.page = 1
    },
    // 导出
    educe() {
      const { export_json_to_excel } = require('../../../../common/vendor/Export2Excel')
      const tHeader = ['姓名', '用户姓名拼音全称', '员工识别登录名', '员工编号', '性别', '出生日期', '学位', '学历', '专业', '毕业院校', '学校性质', '学习形式', '毕业日期', '所属机构', '工作单位', '用户类型', '用户状态', '办公电话', '移动电话', '备用电话', '电子邮箱', '录入人', '录入机构', '录入时间']
      const filterVal = ['name', 'pinyin', 'userName', 'uid', 'sex', 'birthday', 'degree', 'schooling', 'professional', 'school', 'schoolType', 'learningType', 'graduationDate', 'orgName', 'units', 'type', 'status', 'officePhone', 'mobilePhone', 'alternatePhone', 'email', 'createdUserName', 'createdOrgName', 'createdAt']
      let list = []
      if (this.storeArr && this.storeArr.length > 0) {
        list = this.storeArr
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, `人员查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`)
      } else {
        let obj = Object.assign({sync: 1}, this.handleForm(this.form))
        console.log(obj)
        this.exportEduce(obj)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async exportEduce(obj = {sync: 1, isChildren: this.showSubOrg ? 1 : 2, org: this.orgId}) {
      await this.exportManage(obj).then(res => {
        // console.log(res)
        let {code, data} = res.data
        if (code === 0) {
          let fileName = data.fileName && data.fileName
          if (fileName) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/user/v1/operation/downFile?fileName=${fileName}`
            let name = `人员查询列表${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(url, name, () => {}, () => { this.$message({type: 'info', message: '导出文件下载失败！'}) })
          }
        } else {
          throw res.data.message
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打印
    // print() {
    //   return this.$message('打印')
    // },
    // 校验
    regExp(value, key, arr) {
      // console.log(value, key, arr)//
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      // console.log(str)
      arr.forEach(item => {
        if (item === 'null') {
          if (str === '') {
            this.rules[key] = true
            this.ruleTitle[key] = '内容不能为空'
          } else if (str.length > 64) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出64个字符'
          } else {
            this.rules[key] = false
          }
        } else if (item === 'long') {
          if (str.length > 128) {
            this.rules[key] = true
            this.ruleTitle[key] = '内容长度不能超出128个字符'
          } else {
            this.rules[key] = false
          }
        } else {
          this.rules[key] = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.people-manage-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    color: #333333;
    /deep/ .el-breadcrumb {
      font-size: 12px;
      .active {
        .el-breadcrumb__inner {
          color: #2D72D3;
        }
      }
    }
  }
  .content {
    flex: 1;
    width: 100%;
    overflow: auto;
    .main-box{
      padding: 20px 0px 0px 0px;
      overflow: hidden;
      .top-header{
        width: 100%;
        height: 16px;
        padding-left: 5px;
        margin-left: 5px;
        line-height: 16px;
        position: relative;
        color: #606266;cursor: pointer;
        border-left: 3px solid rgba(45,113,211,1);
        i {
          position: absolute;
          top: 55%;
          left: 60px;
          transform: translateY(-50%);
        }
        &::after {
          display: block;
          content: '';
          border-top: 1px solid #e1e1e1;
          width: calc(~'100% - 100px');
          margin-left: 78px;
          margin-top: -8px;
        }
      }
      .top-header:hover{
        color: rgba(45,113,211,1);
        i{color: rgba(45,113,211,1);}
        &::after{border-color: rgba(45,113,211,1);}
      }
      .wrap-body{
        width: 100%;
        .wrap-main{
          width: 100%;
          padding: 15px 10px 5px 5px;
          ul {
            width: 100%;
            display: flex;
            padding: 15px 10px 10px 10px;
            background:rgba(245,245,245,1);
            flex-wrap: wrap;
            li {
              width: 20%;
              height: 48px;
              display: flex;
              span {
                width: 90px;
                height: 32px;
                line-height: 32px;
                text-align: right;
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
                p{
                  color: red;font-size: 12px;
                }
              }
              .blur-rule{
                .el-input {
                  /deep/ input{border-color: red;}
                }
              }
            }
            .last {
              width: 100%;
            }
          }
          .list-box-table {
            width: 100%;
            height: 440px;
            /deep/ .cell{
              height: 40px;
              vertical-align:middle;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .main-footer {
            height: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            /deep/ .el-pager li.active {
              color: #2d72d3!important;cursor: pointer;background: rgba(255, 236, 236, 0.1);
            }
          }
        }
        .p-search-footer {
          padding-top: 10px;
          text-align: center;
        }
      }
    }
  }
}
</style>
