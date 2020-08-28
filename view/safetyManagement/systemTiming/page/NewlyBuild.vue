<template>
<!-- ==========================================================新建页面========================================== -->
  <div>

    <div v-if="isView">
      <div>
        <!-- 进度条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
          <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
          <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{titleDa?titleDa:'新建'}}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 表单组 -->
        <div id="printContent" class="formTit">
          <!-- ============================新建巡检任务===================================-->
          <div class="title-name">{{titleDa ? titleDa:'新建' }}校时任务</div>
          <div>
            <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px" border>
              <!-- 头 -->

              <div class="form-content">
                <div class="form-left-container">
                  <el-form-item label="校时任务名称" prop="timingName">
                    <el-input size=" mini" v-model="form.timingName" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="子系统" prop="subSystemId">
                    <el-select size="mini" v-model="form.subSystemId" placeholder="请选择">
                      <el-option v-for="item in subSystemOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                  
                </div>
                <div class="form-right-container">
                  <el-form-item label="校时周期" prop="timingPeriod">
                    <el-select size="mini" v-model="form.timingPeriod" placeholder="请选择">
                      <el-option label="每一天" :value="1"></el-option>
                      <el-option label="每二天" :value="2"></el-option>
                      <el-option label="每三天" :value="3"></el-option>
                      <el-option label="每四天" :value="4"></el-option>
                      <el-option label="每五天" :value="5"></el-option>
                      <el-option label="每六天" :value="6"></el-option>
                      <el-option label="每七天" :value="7"></el-option>
                    </el-select>
                  </el-form-item>
                   <el-form-item label="校时时间" prop="timingTime">
                    <el-time-picker value-format="HH:mm:ss" size="mini" v-model="form.timingTime" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择">
                    </el-time-picker>
                  </el-form-item>
                </div>
              </div>


              <!-- 双树 -->
              <div class="box-title">
                <span class="pointer" @click="changeShow">
                  校时对象
                  <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div class="tree-two" v-if="isShow">
                <!-- <tree-transfer class="tree-content" :from_data='getTreeApi' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' filter openAll>
                </tree-transfer>-->
                <div class="left">
                  <!-- :lazyTreeApi="getTreeApi" -->
                  <treeBox @getCheckedNodes="getCheckedNodes" ref="tree" :treeType="1" show-checkbox :lazyTreeCheckApi="getTreeApi" checkRecursionToggle :checkboxToggle="true" :lazyTreeApi="getTreeApi" searchType="filter" @checkclick="checkclick1" :customizeQuery="customizeQuery" treeLazyToggle iconToggle></treeBox>
                </div>
                <div class="content">
                  <div>
                    <i class="el-icon-back" @click="handleBack"></i>
                  </div>
                  <div>
                    <i class="el-icon-right" @click="handleRihgh"></i>
                  </div>
                </div>
                <div class="right">
                  <el-table
                    :data="tableData3"
                    @select="handleSelectionChange"
                    @select-all="handleSelectionChange"
                  >
                    <el-table-column align="center" type="selection" width="55" prop="isRoot"></el-table-column>
                    <el-table-column align="center" prop="name" label="设备名称" width="auto" ></el-table-column>
                  </el-table>
                  <!-- <treeBox :checkRecursionToggle="true" :checkboxToggle="true" :lazyTreeApi="toData"  searchType="toData"  treeLazyToggle iconToggle></treeBox> -->
                  <!-- <el-tree :data="toData" show-checkbox node-key="id" style="overflow:auto;"></el-tree> -->
                </div>
              </div>
              
            </el-form>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <!-- <span class="num">{{ null }}</span>       修改录入人，录入机构，录入时间的span为input输入框          -->
                <input type="text" :disabled='disabled' v-model="inpValue.valOne" style="cursor: not-allowed">
              </div>
              <div>
                <span class="title">录入机构</span>
                <!-- <span class="num">{{ null }}</span> -->
                <input type="text" :disabled='disabled' v-model="inpValue.valTwo" style="cursor: not-allowed">
              </div>
              <div>
                <span class="title">录入人</span>
                <!-- <span class="num">{{ null }}</span> -->
                <input type="text" :disabled='disabled' v-model="inpValue.valThree" style="cursor: not-allowed" >
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮组1 -->
        <div class="top-button">
          <!-- <el-button size="mini" @click="handleSave('form')" >保 存</el-button> -->
          <el-button size="mini" @click="savaBtnHandler('form')" >保 存</el-button>
          <el-button size="mini" @click="handleReset('form')">重 置</el-button>
          <el-button size="mini" v-print="'#printContent'">打 印</el-button>
          <el-button size="mini" @click="handleGuan">关 闭</el-button>
        </div>
      </div>
    </div>

    <!-- ====================================================查看巡检任务=================================================================== -->
    <div v-if="!isView">
      <!-- 进度条 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
        <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
        <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <!-- 表单组 -->
        <div class="formTit" id="printContent2">
          <div class="title-name">查看校时任务</div>
          <div>
            <el-form ref="form" :model="form" size="mini" label-width="100px" border>
              <!-- 头 -->
              <div class="form-content">
                <div class="form-inner">
                  <span class="form-item">
                    <div class="bg-c">校时任务名称</div>
                    <span>{{form.timingName}}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">校时周期</div>
                    <span>{{form.timingPeriod}}</span>
                  </span>
                </div>
                <div class="form-inner">
                  <span class="form-item">

                    <div class="bg-c">子系统</div>

                    <span>{{form.subSystemId }}</span>
                  </span>
                  <span class="form-item">
                    <div class="bg-c">校时时间</div>
                    <span>{{form.timingTime}}</span>
                  </span>
                </div>
              </div>
              <!-- 显示隐藏 -->
              <div class="box-title">
                <span class="pointer" @click="changeShow">
                  校时对象
                  <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
            </el-form>
            <!-- 表格  -->
            <div class="table-sty" v-if="isShow">
              <el-table :data="tableData3" border size="mini" stripe :height="'37vh'">
                <el-table-column type="index" label="序号" align="center" ></el-table-column>
                <el-table-column
                  v-for="item in tableColumn"
                  :key="item.label"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  show-overflow-tooltip
                  align="center"
                  @select="handleSelectionChange"
                ></el-table-column>
              </el-table>
            </div>

            <div class="people-infor">
              <div>
                <span class="title">录入时间</span>
                <span class="num">{{ this.form.updatedAt }}</span>
              </div>
              <div>
                <span class="title">录入机构</span>
                <span class="num">{{ this.form.updatedDept }}</span>
              </div>
              <div>
                <span class="title">录入人</span>
                <span class="num">{{ this.form.updatedBy }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮组1 -->
        <div class="top-button">
          <el-button size="mini" @click="switchPage">新 建</el-button>
          <el-button size="mini" @click="handleEditor">编 辑</el-button>
          <el-button size="mini" @click="handleDel">删 除</el-button>
          <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'

import {
  newCorrectingTask,
  putCorrectingTask,
  getLazyTreeCheckApi,
  getTreeApi,
  delCorrectingTask,
  getCorrectingTaskList,
  getCorrectiongTask
} from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
// import treeTransfer from 'el-tree-transfer'
// import taskView from './taskView'
export default {
  components: { treeBox },
  props: {
    titleDa: {
      type: String,
      default: '新建'
    },
    isViews: {
      type: Boolean,
      default: false
    },
    isData: {
      type: Object
    },
  },
  created() {
    console.log(this.titleDa)
    // =================================================选中列表中的数据之后进行详情按钮的点击，但是后台返回的值是successs，没数据=================
    if(this.titleDa == '修改'){
      // 点击的编辑按钮
      console.log('编辑按钮')
      this.isView = this.isViews
      console.log(this.isData, 'index.vue传过来的值')
        let ids = this.isData.id
        // let _ids = this.isData.inspectTimingObject.map(item => {return item.deviceId.toString() })
        if(this.isData.inspectTimingObject){
            var _ids = this.isData.inspectTimingObject.map(item => {return item.deviceId.toString() })
        }else{
          return false
        }
        let params = 
          {
            "timingName": this.isData.timingName,
            "timingTime":this.isData.timingTime,
            "timingPeriod":this.isData.timingPeriod,
            "subSystemId": this.isData.subSystemId,
              "dIds": _ids
         }
        putCorrectingTask(ids,params).then(res => {
            console.log(res)
            // 编辑按钮之后的接口调用成功没返回值。需处理，没做页面的渲染
           if(res.data.code == 0){
              this.form.timingName = this.isData.timingName
              this.form.timingTime = this.isData.timingTime
              this.form.timingPeriod = this.isData.timingPeriod
              this.form.subSystemId = this.isData.subSystemId
              this.tableData3 = this.isData.inspectTimingObject
             console.log(this.tableData3)
           }else{
             return false
           }
        })
    }else{
      // 点击的是详情按钮
      console.log("详情按钮")
    console.log(this.isData, '详情按钮index.vue传过来的值')
    this.isView = this.isViews//切换显示的页面
    console.log(this.isData)    
    let ids = this.isData.id
    console.log(ids)
    let params = { 
      page : 1,
      limit : 25
    }
    getCorrectiongTask(ids,params).then(res => {
        console.log(res)
        // 详情按钮之后的接口调用成功没返回值。需处理，没做页面的渲染
        let result = res.data.data.task
        console.log(result)
        this.tableData3 = result.inspectTimingObject
        this.form = result
    })
    }
  },
  data() {
     const inspectNameValidator = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('巡检计划名称不能为空'))
      } else {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          value.charCodeAt(i) > 255 ? len += 2 : len++
        }
        return len > 128 ? callback(new Error('不能超过128个字符或64个汉字')) : callback()
      }
    }
    return {
      inpValue : {
        valOne : '',
        valTwo : '',
        valThree : ''
      },
      disabled : true,

      subSystemOptions: [
        {
          label: '视频子系统',
          key: 1
        },
        {
          label: '报警子系统',
          key: 2
        },
        {
          label: '对讲子系统',
          key: 3
        },
        {
          label: '门禁子系统',
          key: 4
        },
        {
          label: '防护舱子系统',
          key: 5
        },
        {
          label: '停车场子系统',
          key: 6
        },
        {
          label: '电视子系统',
          key: 7
        }
      ],
      // 树的数据
      mode: 'transfer',
      fromData: [
        {
        }
      ],
      toData: [
      ],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // 表头数据
       rules: {
        timingName: [{ required: true, validator: inspectNameValidator, trigger: 'blur' }],
        subSystemId: [{ required: true, message: '请选择子系统', trigger: 'blur' }],
        timingPeriod: [{ required: true, message: '请选择巡检周期', trigger: 'blur' }],
        timingTime: [{ required: true, message: '请选择巡检时间', trigger: 'blur' }]
      },
      tableColumn: [
        { prop: 'orgId', label: '所属机构', width: 'auto' },
        { prop: 'keyPartId', label: '所属重点部位', width: 'auto' },
        { prop: 'deviceName', label: '设备名称', width: 'auto' },
        { prop: 'brand', label: '品牌', width: 'auto' },
        { prop: 'modeINo', label: '型号', width: 'auto' },
        { prop: 'assetCode', label: '资产编码', width: 'auto' }
      ],
      // 选中项：
      selectData: [],
      isId: [],
      tableData2: [],
      tableData3: [
      ],
      // 控制显示于隐藏
      isShow: true,
      isView: false,
      //保存后删除按钮的id
      save_ids: '',

      form: {
          timingName: '',
          subSystemId: '',
          timingPeriod: '',
          timingTime: '',
          updatedAt : '',
          updatedBy : '',
          updatedDept : ''
      },
      customizeQuery: { // 机构数参数
        keywords: [], // 关键字
        params: {
          subSystem: '',
          hostType: 1
        }
      }
    }
  },
  computed: {
    subsystemIdChange() {
      return this.form.subSystemId || 1
    }
  },

  watch: {
    subsystemIdChange: {
      immediate: true,
      handler(val, old) {
        this.tableData3 = []
        setTimeout(() => {
            switch (val) {
          case 1 :
            // this.options = this.optionList.list1
            this.customizeQuery.params.subSystem = '1'
            this.$refs.tree.refresh()
            break
          case 2 :
            // this.options = this.optionList.list2
            this.customizeQuery.params.subSystem = '2'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
          case 3 :
            // this.options = this.optionList.list3
            this.customizeQuery.params.subSystem = '3'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
          case 4 :
            // this.options = this.optionList.list4
            this.customizeQuery.params.subSystem = '4'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
          case 5 :
            // this.options = this.optionList.list5
            this.customizeQuery.params.subSystem = '5'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
          case 6 :
            // this.options = this.optionList.list6
            this.customizeQuery.params.subSystem = '6'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
          case 7 :
            // this.options = this.optionList.list7
            this.customizeQuery.params.subSystem = '7'
            // this.customizeQuery.params.hostType = this.treeHostType
            this.$refs.tree.refresh()
            break
        }
        },0)
      }
    }
  },
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)  
    },
    //结构树的接口方法
    getLazyTreeCheckApi(params) {
      return getLazyTreeCheckApi(params)
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    // 双树事件
    checkclick1(data, node, status) {
      
      console.log(data)
      console.log(node)
      console.log(status)
      console.log(this.$refs.tree.getCheckedNodes(true))
      let data1 = this.$refs.tree.getCheckedNodes(true)
      data1.forEach((v) => {
        if (v.tierType === 'equ') {
          // || v.tierType === 'org'
          this.tableData2.push(v)
          
        }else{
          this.tableData2.pop(v)
        }
      })
    },
    handleRihgh() {
      this.tableData3 = this.tableData2
      this.tableData2 = []
      console.log(this.tableData3)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
      this.isId = this.selectData.map((item) => item.id)
      console.log(this.isId)
    },
    handleBack() {
      this.tableData3 = this.tableData3.filter((v) => {
        return !this.isId.includes(v.id)
      })
      console.log(this.tableData3)
    },
    getCheckedNodes(val) {
      console.log(val)
    },
    savaBtnHandler(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
              this.handleSave()
          }else{
              return false;
          }
        });
    },
    // 保存
    handleSave() {
      if (this.titleDa === '修改') {
        if(this.isData.inspectTimingObject){
            var _ids = this.isData.inspectTimingObject.map(item => {return item.deviceId.toString() })
        }else{
          return false
        }
        let params = {
          "timingName": this.form.timingName,
          "subSystemId": this.form.subSystemId,
          "timingPeriod": this.form.timingPeriod,
          "timingTime": this.form.timingTime,
          "dIds": _ids
        }
        // params['dIds'] = this.tableData3 && this.tableData3.map(item => {
        //   return item.id
        // })
        
        console.log(params.dIds)
        putCorrectingTask(this.isData.id, params).then((res) => {
          let result = res.data
          console.log(result)
          if (result.message) {
            this.$messageSuccess('修改成功')
            //修改成功之后从新渲染列表页
          } else {
            this.$messageError('修改失败')
          }
          console.log(res)
        })
        this.isView = !this.isView
      } else {
        this.form.timingTime = this.form.timingTime.split('-').join(':')//后台对传参的要求的修改，格式的纠正！
        let params = {
          timingName: this.form.timingName,
          subSystemId: this.form.subSystemId,
          timingPeriod: this.form.timingPeriod,
          timingTime: this.form.timingTime
        }
        params['dIds'] = this.tableData3 && this.tableData3.map(item => {
          return item.id
        })
        // ======================================新建按钮============================
        newCorrectingTask(params).then((res) => {
          let result = res.data
          console.log(result)
          result.data.id ? this.save_ids = result.data.id : this.save_ids = ''
          console.log(result)
          if (result.message) {
            this.$messageSuccess('新建成功')
            let _params = {
              page : 1,
              limit : 25
            }
            getCorrectingTaskList(_params).then(res => {
              let result = res.data.data.tasks[0]
              console.log(result)
              this.form.updatedAt = result.updatedAt
              this.form.updatedBy = result.updatedBy
              this.form.updatedDept = result.updatedDept
            })
          } else {
            this.$messageError('新建失败')
          }
        })
        this.isView = !this.isView
      }
    },
    // 关闭
    handleGuan() {
    this.$parent.changeList('TaskList')
    },
    // 重置
    handleReset(formName) {
      this.$refs[formName].resetFields();
      this.form = {
        name: '',
        system: '',
        genre: '',
        cycle: '',
        times: '',
        isInspectResolutionRatio: false,
        isInspectCodeRatio: false,
        isInspectFPs: false,
        isInspectVideotape: false,
        status: '',
      }
      ;(this.tableData3 = []), (this.tableData2 = []), (this.selectData = [])
       
    },
    // 新建
    switchPage() {
      // this.handleReset()
      this.isView = !this.isView
      this.tableData3 = []
      this.tableData2 = []
      this.selectData = []
      this.titleDa = '新建'
    },
    // 编辑
    handleEditor() {
      this.titleDa = '修改'
      this.isView = !this.isView
    },
    // 删除
    handleDel() {
      console.log("=======================删除按钮=========================")
      let save_Id =  this.save_ids //点击新建保存后的id
      let Is_ID = this.isData.id //点击详情后的id
      let params = {}
      save_Id == '' ? params['ids'] = [ Is_ID ] : params['ids'] = [ save_Id ]
      delCorrectingTask(params).then(res => {
        console.log(res)
          if (res.data.code == 0) {
            this.$messageSuccess('删除成功')
            
            this.$parent.changeList('TaskList')
          } else {
            this.$messageError('删除失败')
          }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin: 10px;
}
.top-button {
  margin: 50px 0 10px 450px;
}
.title-name {
  margin: 0 0 10px 560px;
  font-size: 14px;
  font-weight: 600;
}
.form-content {
  border: 1px solid #e1e1e1;
  width: 800px;
  height: 70px;
  margin-left: 200px;
  box-sizing: border-box;
  padding: 2px;
  .form-inner {
    width: 100%;
    height: 50%;
    .form-item {
      width: 50%;
      height: 100%;

      // span {
      //   box-sizing: border-box;
      //   height: 26px;
      //   line-height: 26px;
      // }
      .bg-c {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #e1e1e1;
        margin-bottom: 20px;
      }
      span {
        display: inline-block;
        width: 265px;
        height: 30px;
        line-height: 30px;;
        text-align: center;
        font-size: 12px;
        background: #ffffff;
        
      }
      .el-input {
        width: 270px;
        height: 30px;
      }
      .el-select {
        width: 270px;
        height: 30px;
      }
      .el-checkbox-group {
        display: inline-block;
        width: 260px;
        height: 30px;
      }
    }
  }
}

.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;

  i {
    position: absolute;
    top: 50%;
    left: 85px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 120px');
    margin-left: 100px;
    margin-top: -12px;
  }
}
.tree-two {
  width: 800px;
  height: 500px;
  margin: 0 0 50px 300px;
  position: relative;
  .left {
    width: 300px;
    height: 100%;
    display: inline-block;
    .tree {
      height: 100%;
      width: 100%;
      .treeLazy {
        height: 100%;
      }
    }
  }
  .content {
    width: 80px;
    height: 100%;
    display: inline-block;
    position: relative;
    i {
      position: absolute;
      font-size: 35px;
      cursor: pointer;
      left: 20px;
    }
    .el-icon-back {
      top: 230px;
    }
    .el-icon-right {
      top: 270px;
    }
  }
  .right {
    position: absolute;
    width: 300px;
    height: 100%;
    display: inline-block;
    .el-table {
      height: 100%;
      width: 100%;
      overflow: auto;
      text-align: center;
    }
  }
  .tree-content {
    margin: 10px 0 0 200px;
    /deep/.transfer-center {
      .transfer-center-item {
        .el-button {
          width: 100px;
          border-radius: 20px;
          background-color: #2d71d3;
          i {
            font-style: 14px;
          }
        }
      }
    }
  }
}
.el-tree-node__label {
  font-size: 12px;
}
.people-infor {
  width: 800px;
  height: 30px;
  margin: 0px 0 10px 200px;
  font-size: 12px;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  div {
    float: left;
    width: 33.33%;
    height: 100%;
    display: flex;
    .title {
      flex: 3;
      background-color: #e1e1e1;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ffffff;
    }
    .num {
      flex: 7;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
}
.table-sty {
  margin: 0 0 12px 200px;
  width: 800px;
}
@media print {
  .formTit {
    width: 1040px;
    // background-color: pink;
    // height: 1000px;
    margin-left: -80px;
    .title-name {
      margin: 0 0 10px 560px;
      font-size: 14px;
      font-weight: 600;
    }
    .form-content {
      border: 1px solid #e1e1e1;
      width: 800px;
      height: 140px;
      margin-left: 200px;
      box-sizing: border-box;
      padding: 2px;
      .form-inner {
        width: 100%;
        height: 25%;
        .form-item {
          width: 50%;
          height: 100%;
          .bg-c {
            display: inline-block;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #e1e1e1;
          }
          span {
            display: inline-block;
            width: 270px;
            text-align: center;
            font-size: 12px;
          }
          .el-input {
            width: 270px;
            height: 30px;
          }
          .el-select {
            width: 270px;
            height: 30px;
          }
          .el-checkbox-group {
            display: inline-block;
            width: 270px;
            height: 30px;
          }
        }
      }
    }

    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      color: #606266;
      margin-left: 150px;

      i {
        position: absolute;
        top: 50%;
        left: 85px;
        transform: translateY(-50%);
      }
      &::after {
        display: block;
        content: '';
        border-top: 1px solid #e1e1e1;
        width: calc(~'100% - 120px');
        margin-left: 100px;
        margin-top: -12px;
      }
    }
    .tree-two {
      width: 800px;
      height: 350px;
      .tree-content {
        margin: 10px 0 0 200px;
      }
    }
    .el-tree-node__label {
      font-size: 12px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0px 0 10px 200px;
      font-size: 12px;
      border: 1px solid #e1e1e1;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
  }
}
.xiang {
  width: 265px;
  display: inline-block;
  /deep/.el-checkbox {
    margin-right: 10px;
    .el-checkbox__label {
      padding: 0;
    }
  }
}
.form-content {
  border: 1px solid #e1e1e1;
  width: 800px;
  // height: 140px;
  height: 125px;
  margin-left: 200px;
  padding: 15px 15px 10px 0;
  background: #f5f5f5;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  display: flex;
  .form-left-container {
    width: 50%;
    /deep/ .el-form-item__content {
      line-height: 35px;
    }
  }
  .form-right-container {
    width: 50%;
  }
  .el-select, .el-date-editor {
    width: 100%;
  }
}
// 修改的placeholder的文字大小不统一的问题
 /deep/ input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 12px;
    color:#cccccc;    
}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: 12px;
    color:#cccccc;
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
   font-size: 12px;
    color:#cccccc;
}
input:-ms-input-placeholder { /* Internet Explorer 10+ */
   font-size: 12px;
    color:#cccccc;
}
</style>
