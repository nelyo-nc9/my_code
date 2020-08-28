<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <!-- 定位图标 -->
      <div class="location-icon float-left">
        <span class="el-icon-location-outline"></span>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动</el-breadcrumb-item>
        <el-breadcrumb-item>信访识别预警</el-breadcrumb-item>
        <el-breadcrumb-item>推送策略配置</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="new">
      <!-- 标题 -->
      <div class="head" v-show="ishead">
        <p>{{ fourMuen }}</p>
      </div>
      <div class="headd" v-show="isrows">
        <el-row>
          <el-button v-print="'#contentinfo'">打印</el-button>
          <el-button @click="closebtn">取消</el-button>
        </el-row>
        <p>推送策略查看</p>
      </div>
      <div class="heads" v-show="isrow">
        <el-row>
          <el-button type="primary" @click="news">新建</el-button>
          <el-button @click="redact">编辑</el-button>
          <el-button @click="del">删除</el-button>
          <el-button @click="print">打印</el-button>
        </el-row>
        <p>推送策略查看</p>
      </div>

      <!-- 选择内容 -->
      <div class="newcontent" v-show="isnewcontent">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="推送策略名称" class="form-group" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="推送对象" class="form-group" prop="objects">
            <el-select v-model="form.objects" placeholder="请选择">
              <el-option v-for="item in objects" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间模板" class="form-group" prop="times">
            <el-select v-model="form.times" placeholder="请选择">
              <el-option
                v-for="(item, index) in dateing"
                :key="index"
                :label="item.templateName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源模式" class="form-group" prop="resources">
            <el-select v-model="form.resources" placeholder="请选择" @change="selects">
              <el-option
                v-for="item in resources"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用推送策略" class="form-group" prop="radio">
            <el-radio v-model="radio" label="1">启用</el-radio>
            <el-radio v-model="radio" label="2">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>

      <div id="contentinfo">
        <div class="headt" v-show="isheadt">
          <p>推送策略打印</p>
        </div>

        <!-- 确定内容 -->
        <div class="newcontents" v-show="isnewcontents">
          <div>
            <span>推送策略名称</span>
            <span>{{ ensure.pushStrategyName }}</span>
          </div>
          <div>
            <span>推送对象</span>
            <span>{{ ensure.pushObject }}</span>
          </div>
          <div>
            <span>时间模板</span>
            <span>{{ ensure.timeTemplate }}</span>
          </div>
          <div>
            <span>资源模式</span>
            <span>{{ ensure.resourceModel }}</span>
          </div>
          <div>
            <span>启用推送策略</span>
            <span>{{ ensure.isPush }}</span>
          </div>
        </div>

        <!-- 树形 -->
        <div class="tree">
          <!-- 重点部位 -->
          <div v-show="isdata">
            <p>选择需要推送的抓拍机</p>
            <div class="thirtree">
              <treeBox
                :lazyTreeApi="getTree"
                ref="tree"
                :customizeQuery="customizeQuery"
                searchType="filter"
                @checkclick="onceClick"
                treeLazyToggle
                :checkboxToggle="true"
                :checkRecursionToggle="false"
                iconToggle
              ></treeBox>
            </div>
          </div>

          <!-- 资源点位 -->
          <div v-show="isdatas">
            <p>选择需要推送的抓拍机</p>
            <div class="thirtree">
              <Thirtree ref="tree2" @clickdata="clickdata"></Thirtree>
            </div>
          </div>
        </div>

        <!-- 录入信息 -->
        <div class="footsection">
          <div>
            <span>录入时间</span>
            <span>{{ time }}</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>{{ user_institutions }}</span>
          </div>
          <div>
            <span>录入人</span>
            <span>{{ user_name }}</span>
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="buttonsection" v-show="isbuttonsection">
        <el-row class="rowbutton">
          <el-button type="primary" @click="save('form')">保存</el-button>
          <el-button @click="closebtn">取消</el-button>
          <el-button @click="reset">重置</el-button>
        </el-row>
      </div>

      <!-- 打印按钮 -->
      <div class="buttonsection" v-show="isbuttonsections">
        <el-row>
          <el-button v-print="'#contentinfo'">打印</el-button>
          <el-button @click="close">取消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Thirtree from './thirtree'
import treeBox from '@src/components/tree/treeBox'
import {
  getTreeApi,
  getTimeTemplateListApi,
  setpetitionStrategyApi,
  delstrategyInfoListApi,
  updatepetitionStrategyApi
} from '@src/http/businessLinkage/business.api.js'
export default {
  components: {
    treeBox,
    Thirtree
  },
  props: ['isData', 'titleDa', 'isrowda', 'rowdata'],
  created() {
    this.dates()
    this.edit()
    console.log(this.isData)
    if (this.isrowda == '推送策略查看') {
      this.strategycheck()
    }
  },
  data() {
    return {
      treetype: 2,
      filterText: '',
      value: '',
      radio: '1',
      // treeType: 0,
      newtime: '',
      remove: '',
      fourMuen: '新建推送策略',
      isrows: false,
      isdata: true,
      isdatas: false,
      ishead: true,
      isheadt: false,
      isrow: false,
      isnewcontent: true,
      isnewcontents: false,
      isbuttonsection: true,
      isbuttonsections: false,
      customizeQuery: {
        // params: {
        //   subSystem: '1',
        //   isRecursion: '0',
        //   resClass: 206
        // },
      },
      ensure: {
        name: '总行信访推送策略',
        objects: '信访平台',
        times: '',
        resources: '重点部位',
        radio: '是'
      },
      form: {
        name: '',
        objects: '信访平台',
        times: '',
        resources: '重点部位'
      },
      objects: [
        {
          value: '信访平台',
          label: '信访平台'
        }
      ],
      resources: [
        {
          value: '重点部位',
          label: '重点部位'
        },
        {
          value: '资源点位',
          label: '资源点位'
        }
      ],
      rules: {
        name: [{ required: true, message: '推送策略名称不能为空' }],
        objects: [{ required: true, message: '推送对象不能为空' }],
        times: [{ required: true, message: '时间模板不能为空' }],
        resources: [{ required: true, message: '资源模式不能为空' }]
        // radio: [{ required: true, message: '启用推送策略不能为空' }]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      captureMachine: [],
      dateing: [],
      result: '',
      checkeds: [],
      aaa111: {},
      clickdatas: [],
      onClickdata: []
    }
  },

  computed: {
    //录入人
    user_name() {
      if (this.fourMuen == '推送策略编辑' && this.titleDa) {
        JSON.parse(sessionStorage.getItem('user')).name = this.titleDa[0].entryPerson
      } else if (this.fourMuen == '推送策略查看') {
        JSON.parse(sessionStorage.getItem('user')).name = this.rowdata[0].entryPerson
      } else {
        return JSON.parse(sessionStorage.getItem('user')).name
      }
      return JSON.parse(sessionStorage.getItem('user')).name
    },
    //录入机构
    user_institutions() {
      if (this.fourMuen == '推送策略编辑' && this.titleDa) {
        JSON.parse(sessionStorage.getItem('user')).orgName = this.titleDa[0].orgName
      } else if (this.fourMuen == '推送策略查看') {
        JSON.parse(sessionStorage.getItem('user')).orgName = this.rowdata[0].orgName
      } else {
        return JSON.parse(sessionStorage.getItem('user')).orgName
      }
      return JSON.parse(sessionStorage.getItem('user')).orgName
    },
    //录入时间
    time() {
      var now = new Date()
      var year = now.getFullYear() //得到年份
      var month = now.getMonth() //得到月份
      var date = now.getDate() //得到日期
      var day = now.getDay() //得到周几
      var hour = now.getHours() //得到小时
      var minu = now.getMinutes() //得到分钟
      var sec = now.getSeconds() //得到秒
      var MS = now.getMilliseconds() //获取毫秒
      var week
      month = month + 1
      if (month < 10) month = '0' + month
      if (date < 10) date = '0' + date
      if (hour < 10) hour = '0' + hour
      if (minu < 10) minu = '0' + minu
      if (sec < 10) sec = '0' + sec
      // if （MS < 100）MS = "0" + MS;
      // var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      // week = arr_week[day];
      var time = ''
      time = year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec + ' '
      var tim = time

      this.newtime = tim
      if (this.fourMuen == '推送策略编辑' && this.titleDa) {
        time = this.titleDa[0].entryTime
      } else if (this.fourMuen == '推送策略查看') {
        time = this.rowdata[0].entryTime
        console.log('时间', time)
      } else {
        return time
      }
      // console.log(this.newtime)
      //设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
      // var timer = setTimeout("writeCurrentDate()", 1000);
      return time
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    clickdata(val) {
      this.clickdatas = val
      console.log('资源', this.clickdatas)
    },
    // 机构数
    getTree(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      // console.log(node)
      this.onClickdata = node
      console.log(this.onClickdata)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 重点部位，资源点位切换
    selects(value) {
      if (value == '重点部位') {
        this.isdata = true
        this.isdatas = false
        this.$refs.tree.setCheckedKeys([])
      }
      if (value == '资源点位') {
        this.isdata = false
        this.isdatas = true
        this.$refs.tree2.$refs.tree.setCheckedKeys([])
      }
    },
    // 时间模板
    dates() {
      getTimeTemplateListApi().then(res => {
        let result = res.data.data
        // console.log(result)
        this.dateing = result
        // console.log('时间模板', this.dateing)
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.onClickdata.length !== 0) {
            this.captureMachine = this.onClickdata
          } else {
            this.captureMachine = this.clickdatas
          }
          if (this.captureMachine.length === 0) {
            this.$notify.warning({
              title: '警告',
              message: '请选择抓拍机'
            })
            return false
          }
          // console.log(this.captureMachine)
          let myName = JSON.parse(sessionStorage.getItem('user'))
          let params = {
            pushStrategyName: this.form.name,
            pushObject: this.form.objects,
            // timeTemplate: this.form.times,
            resourceModel: this.form.resources,
            isPush: this.radio,
            timeTemplate: this.dateing[this.form.times - 1],
            OrgId: myName.org,
            orgName: myName.orgName,
            entryPerson: myName.name,
            entryTime: this.newtime,
            captureMachine: this.captureMachine
          }
          this.ensure = params
          // console.log('11111111', params)
          if (this.fourMuen === '新建推送策略') {
            setpetitionStrategyApi(params)
              .then(res => {
                console.log('返回值', res.data.data)
                this.result = res.data.data.result
                this.remove = this.result
                // console.log('11111111', params)

                if (this.ensure.isPush === '1') {
                  this.ensure.isPush = '启用'
                }
                if (this.ensure.isPush === '2') {
                  this.ensure.isPush = '禁止'
                }
                this.ensure.timeTemplate = this.ensure.timeTemplate.templateName
                this.ishead = false
                this.isrow = true
                this.isheadt = false
                this.isnewcontent = false
                this.isnewcontents = true
                this.isbuttonsection = false
                this.isbuttonsections = false
                console.log(this.ensure.captureMachine)
                let nodeKeys = []
                for (var i = 0; i < this.ensure.captureMachine.length; i++) {
                  nodeKeys.push(this.ensure.captureMachine[i].nodeKey)
                }
                this.checkeds = nodeKeys
                this.$refs.tree.setCheckedKeys(this.checkeds)
                console.log(this.checkeds)
                this.$notify.success({
                  title: '成功',
                  message: '保存成功'
                })
                this.$emit('changComponent', 'Pushlist')
              })
              .catch(_ => {
                this.$notify.warning({
                  title: '警告',
                  message: '保存失败'
                })
              })
          }

          // 编辑功能
          // console.log(this.remove)
          let updat = {
            pushStrategyName: this.form.name,
            pushObject: this.form.objects,
            // timeTemplate: this.form.times,
            resourceModel: this.form.resources,
            isPush: this.radio,
            timeTemplate: this.dateing[this.form.times - 1],
            OrgId: myName.org,
            orgName: myName.orgName,
            entryPerson: myName.name,
            entryTime: this.newtime,
            id: this.remove,
            captureMachine: this.captureMachine
          }
          if (updat.captureMachine.length === 0) {
            updat.captureMachine = this.titleDa[0].captureMachine
          }
          if (!updat.timeTemplate) {
            updat.timeTemplate = this.titleDa[0].timeTemplate
          }
          console.log('123456', params)
          if (this.fourMuen === '推送策略编辑') {
            updatepetitionStrategyApi(updat).then(res => {
              this.result = res.data.data.result
              console.log('11111111', result)

              if (this.ensure.isPush === '1') {
                this.ensure.isPush = '启用'
              }
              if (this.ensure.isPush === '2') {
                this.ensure.isPush = '禁止'
              }
              this.ensure.timeTemplate = this.ensure.timeTemplate.templateName
              console.log(this.ensure.captureMachine)
              let nodeKeys = []
              for (var i = 0; i < this.ensure.captureMachine.length; i++) {
                nodeKeys.push(this.ensure.captureMachine[i].nodeKey)
              }
              this.checkeds = nodeKeys
              this.$refs.tree.setCheckedKeys(this.checkeds)
              console.log(this.checkeds)
              this.$notify.success({
                title: '成功',
                message: '编辑成功'
              })
              // this.$emit('changeComponent', 'Pushlist')
            })
            // .catch((err) => {
            //   this.$notify.warning({
            //     title: '警告',
            //     message: '编辑失败',
            //   })
            // })
            this.$emit('changComponent', 'Pushlist')
          }
        } else {
          return false
        }
      })
    },
    //重置
    reset() {
      ;(this.form.name = ''), (this.form.objects = '信访平台')
      this.form.times = ''
      this.form.resources = '重点部位'
      this.radio = '1'

      if (this.form.resources == '重点部位') {
        this.$refs.tree.setCheckedKeys([])
        this.isdata = true
        this.isdatas = false
      }
      if (this.form.resources == '资源点位') {
        this.$refs.tree2.$refs.tree.setCheckedKeys([])
        this.isdata = false
        this.isdatas = true
      }
    },
    //删除
    del() {
      let remove = []
      remove.push(this.remove)
      delstrategyInfoListApi(remove)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('changComponent', 'Pushlist')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //取消
    closebtn() {
      this.$emit('changComponent', 'Pushlist')
    },
    //取消
    close() {
      this.ishead = false
      this.isrow = true
      this.isheadt = false
      this.isnewcontent = false
      this.isnewcontents = true
      this.isbuttonsection = false
      this.isbuttonsections = false
    },
    //列表点击编辑（渲染页面）
    edit() {
      this.fourMuen = this.isData
      if (this.fourMuen == '推送策略编辑') {
        this.form.name = this.titleDa[0].pushStrategyName
        this.form.objects = this.titleDa[0].pushObject
        this.form.times = this.titleDa[0].timeTemplate.templateName
        this.form.resources = this.titleDa[0].resourceModel

        if (this.titleDa[0].isPush == '启用') {
          this.titleDa[0].isPush = '1'
        } else {
          this.titleDa[0].isPush = '2'
        }
        this.radio = this.titleDa[0].isPush
        this.remove = this.titleDa[0].id
        // this.checkeds.push(this.titleDa[0].captureMachine.nodeKey)
        // this.newtime=this.titleDa[0].entryTime
        // console.log(this.form)
        if (this.form.resources == '重点部位') {
          this.isdata = true
          this.isdatas = false
          let arr = []
          for (var i = 0; i < this.titleDa[0].captureMachine.length; i++) {
            arr.push(this.titleDa[0].captureMachine[i].nodeKey)
          }
          console.log(arr)
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(arr)
          })
          console.log(this.titleDa[0])
        }
        if (this.form.resources == '资源点位') {
          this.isdata = false
          this.isdatas = true
          let arr = []
          for (var i = 0; i < this.titleDa[0].captureMachine.length; i++) {
            arr.push(this.titleDa[0].captureMachine[i].nodeKey)
          }
          console.log(arr)
          this.$nextTick(() => {
            // console.log(this.$refs.tree2.$refs.tree.setCheckedKeys)
            this.$refs.tree2.$refs.tree.setCheckedKeys(arr)
          })
          console.log(this.titleDa[0])
        }

        // this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.fourMuen = '新建推送策略'
      }
      console.log(this.titleDa)
    },
    //双击查看
    strategycheck() {
      this.fourMuen = this.isrowda
      if (this.fourMuen == '推送策略查看') {
        this.isrows = true
        this.ishead = false
        this.isrow = false
        this.isheadt = false
        this.isnewcontent = false
        this.isnewcontents = true
        this.isbuttonsection = false
        this.isbuttonsections = false
        this.ensure = this.rowdata[0]
        this.ensure.timeTemplate = this.rowdata[0].timeTemplate.templateName
        this.remove = this.rowdata[0].id
        if (this.ensure.resourceModel == '重点部位') {
          this.isdata = true
          this.isdatas = false
          let arr = []
          for (var i = 0; i < this.rowdata[0].captureMachine.length; i++) {
            arr.push(this.rowdata[0].captureMachine[i].nodeKey)
          }
          console.log(arr)
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(arr)
          })
          console.log(this.rowdata[0])
        }
        if (this.ensure.resourceModel == '资源点位') {
          this.isdata = false
          this.isdatas = true
          let arr = []
          for (var i = 0; i < this.rowdata[0].captureMachine.length; i++) {
            arr.push(this.rowdata[0].captureMachine[i].nodeKey)
          }
          console.log(arr)
          this.$nextTick(() => {
            // console.log(this.$refs.tree2.$refs.tree.setCheckedKeys)
            this.$refs.tree2.$refs.tree.setCheckedKeys(arr)
          })
          console.log(this.rowdata[0])
        }
        // this.checkeds.push(this.rowdata[0].captureMachine.nodeKey)
      }
      //   console.log(this.isrowda);
      // console.log(this.rowdata);
    },
    //新建
    news() {
      this.ishead = true
      this.isrow = false
      this.isheadt = false
      this.isnewcontent = true
      this.isnewcontents = false
      this.isbuttonsection = true
      this.isbuttonsections = false
      this.reset()
      this.$refs.tree.setCheckedKeys([])
      this.fourMuen = '新建推送策略'
    },

    //编辑
    redact() {
      this.ishead = true
      this.isrow = false
      this.isheadt = false
      this.isnewcontent = true
      this.isnewcontents = false
      this.isbuttonsection = true
      this.isbuttonsections = false
      this.fourMuen = '推送策略编辑'
      if (this.fourMuen == '推送策略编辑' && this.titleDa) {
        console.log(this.titleDa)
        this.form.name = this.titleDa[0].pushStrategyName
        this.form.objects = this.titleDa[0].pushObject
        this.form.times = this.titleDa[0].timeTemplate
        this.form.resources = this.titleDa[0].resourceModel
        if (this.titleDa[0].isPush == '启用') {
          this.titleDa[0].isPush = '1'
        } else {
          this.titleDa[0].isPush = '2'
        }
        this.radio = this.titleDa[0].isPush
        this.remove = this.titleDa[0].id
      }
    },

    //打印
    print() {
      this.ishead = false
      this.isrow = false
      this.isheadt = true
      this.isnewcontent = false
      this.isnewcontents = true
      this.isbuttonsection = false
      this.isbuttonsections = true
    }
  },

  mounted() {},
  beforeDestroy() {}
}
</script>

<style scoped lang="less">
.nav {
  width: 500px;
  padding-left: 20px;
  margin: 10px 0;
  i {
    float: left;
    margin-right: 5px;
  }
  el-breadcrumb {
    float: left;
  }
}
.new {
  // width: 1038px;
  width: 80%;
  margin: 0 auto;
  padding: 0 20px;
}
.head {
  // width: 1038px;
  font-size: 16px;
  color: #333;
  line-height: 50px;
  text-align: center;
}
.headt {
  // width: 1038px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.heads {
  margin-top: 20px;
  .el-row {
    float: left;
    margin-left: 20px;
    margin: -10px 0px 20px 20px;
  }
  p {
    text-align: center;
    margin-right: 340px;
  }
}
.headd {
  margin-top: 20px;
  .el-row {
    float: left;
    margin-left: 20px;
    margin: -10px 0px 20px 20px;
  }
  p {
    text-align: center;
    margin-right: 340px;
  }
}
.newcontent {
  // width: 1038px;
  margin-bottom: 20px;
  // /deep/ .el-input__inner{
  //   width: 380px;
  // }
}
/deep/ .el-form-item__label {
  margin-top: 1px;
  // padding: 5px 0;
  text-align: center;
  background: #cccccc;
  line-height: 28px;
  display: inline-block;
}
/deep/.el-form-item {
  height: 35px;
  line-height: 35px;
  margin: 0;
  display: inline-block;
  margin-bottom: 14px;
  /deep/.el-form-item__error {
    padding-top: 0;
  }
}
.el-form {
  // display: inline-block;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.form-group {
  width: 49.8%;
}
.el-radio {
  // width: 200px;
  margin: 0 35px 0 15px;
}
.el-select {
  // width: 380px;
  width: 100%;
}
.tree {
  // width: 1038px;
  display: flex;
  justify-content: center;
}
.tree > div {
  width: 400px;
  height: 500px;
  border: 1px solid #cccccc;
  overflow: auto;
}
.tree > div > p {
  margin: 20px 0 20px 20px;
}
.trsearch {
  margin: 0 20px;
  position: relative;
}
.trsearch i {
  position: absolute;
  top: 15px;
  left: 290px;
}
// .thirtree{
//   margin-left: 50px;
// }
.footsection {
  // width: 1038px;
  border: 1px solid #cccccc;
  // margin-left: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.footsection div span:first-child {
  margin-top: 1px;
  padding: 5px 0;
  width: 100px;
  text-align: center;
  background: #cccccc;
  line-height: 28px;
  display: inline-block;
}
.footsection div span:last-child {
  display: inline-block;
  width: 180px;
  text-align: center;
}
.buttonsection {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.newcontents {
  width: 1038px;
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
.newcontents div {
  width: 506px;
  float: left;
  border: 1px solid #cccccc;
}
.newcontents div span:first-child {
  margin-top: 1px;
  padding: 5px 0;
  width: 120px;
  text-align: center;
  background: #cccccc;
  line-height: 28px;
  display: inline-block;
}
.newcontents div span:last-child {
  display: inline-block;
  width: 350px;
}

@media print {
  #contentinfo {
    width: 1038px;
  }
}
.location-icon {
  font-size: 18px;
  float: left;
  margin-top: -4px;
}
</style>
