<template>
  <div class="plan-box bs-main main-page-bg">
    <div class="custom-button">
      <el-button type="default" size="small" @click="selfDefine">自定义</el-button>
      <el-button type="default" size="small" @click="showList">节假日</el-button>
    </div>
    <div class="left-box">
      <div class="left-content">
        <bs-scroll>
          <div class="selet-model" :class="{'check-color':currentIndex === index}" @click="checkModel(index)" v-for="(item, index) in plans" :key="index">
            <div class="edit-box">
              <div class="iconfont query-style  edit-child" @click="delectMould(index)">
                &#xe638;
              </div>
              <div class="iconfont query-style edit-child" @click="editMould(index)">
                &#xe633;
              </div>
            </div>
            <span v-show="!item.isAct">{{item.name}}</span>
            <input @blur="done(index)" ref="Input" v-show="item.isAct" :maxlength="14" v-model="item.name" style="width: 100px" :key="item.index"></input>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="right-box">
      <PlanTimeTable ref="PlanTimeTable" :buttonWidth="642.5" @clickEdit="clickEdit" :isPermissionEdit="isPermissionEdit" :isNewPlan="isNewPlan"  :planTitle="planTitle" :timetable="datas"></PlanTimeTable>
    </div>
  </div>
</template>
<script>
import PlanTimeTable from '../plan/timePick/PlanTimeTable'
import { getTimeTemplateListApi, addTimeTemplateApi, delTimeTemplateApi, modifyTimeTemplateApi } from '@src/http/systemOperationManage/timeTemplate.api.js'
export default {
  name: 'timeTemplate',
  components: {
    PlanTimeTable
  },
  data() {
    return {
      planTitle: '',
      customNum: 0,
      isNewPlan: false,
      currentIndex: 0,
      plans: [
      ],
      datas: [],
      middle: [],
      isPermissionEdit: false
    }
  },
  computed: {
  },
  methods: {
    showList() {
      this.$emit('showList', true)
    },
    clickEdit(flag) {
      this.isPermissionEdit = flag
    },
    // 点击删除模板图标
    delectMould(index) {
      this.delIndex = index
      this.$confirm('您确认要删除此模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.okDelect()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // }
    },
    // 确认删除模板
    okDelect() {
      if (this.plans[this.currentIndex].id) {
        delTimeTemplateApi({ id: this.plans[this.currentIndex].id })
          .then(res => {
            console.log(res, '删除时间模板')
            if (res.data.code === 0) {
              this.plans.splice(this.currentIndex, 1)
              this.currentIndex = 0
              this.datas = this.plans[0].dates
              this.$messageSuccess(res.data.message)
              this.initGetPlanByUser()
            }
          })
          .catch(err => {
            console.log('delect temeplate err:' + err)
          })
      } else {
        this.plans.splice(this.currentIndex, 1)
        this.currentIndex = 0
        this.datas = this.plans[0].dates
      }
    },
    // 点击编辑文本框
    editMould(index) {
      this.$set(this.plans[index], 'isAct', true)
      setTimeout(() => {
        this.$refs.Input[index].focus()
      }, 0)
    },
    // 失焦之后
    done(index) {
      this.$set(this.plans[index], 'isAct', false)
      if (this.plans[index].name === '') {
        this.$messageWarn('计划模板名称不能为空')
      }
    },
    // 选择模板
    checkModel(index) {
      // if (index !== this.currentIndex) {
      //   this.isPermissionEdit = false
      // }
      if (this.isPermissionEdit && index !== this.currentIndex) {
        this.$confirm('是否保存当前编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['PlanTimeTable'].savePlan()
        }).catch(() => {
          this.currentIndex = index
          this.isPermissionEdit = false
          this.changePlan(index)
          this.$message({
            type: 'info',
            message: '已取消编辑'
          })
        })
      } else {
        this.currentIndex = index
        this.changePlan(index)
      }
    },
    changePlan(index) {
      if (this.middle[index]) {
        this.planTitle = this.middle[index].name
        this.isNewPlan = this.middle[index].isNewPlan
        this.plans[index].dates = JSON.parse(JSON.stringify(this.middle[index].dates))
      } else {
        this.plans[index].dates = [
          { week: 1, timeList: [] },
          { week: 2, timeList: [] },
          { week: 3, timeList: [] },
          { week: 4, timeList: [] },
          { week: 5, timeList: [] },
          { week: 6, timeList: [] },
          { week: 7, timeList: [] },
          { week: 8, timeList: [] }
        ]
        this.planTitle = this.plans[index].name
        this.isNewPlan = this.plans[index].isNewPlan
      }
      this.datas = []
      this.datas = this.plans[index].dates
    },
    // 添加模板
    selfDefine() {
      this.customNum++
      this.plans.push({
        name: '自定义' + this.customNum,
        isAct: true,
        isNewPlan: true,
        dates: [
          { week: 1, timeList: [] },
          { week: 2, timeList: [] },
          { week: 3, timeList: [] },
          { week: 4, timeList: [] },
          { week: 5, timeList: [] },
          { week: 6, timeList: [] },
          { week: 7, timeList: [] },
          { week: 8, timeList: [] }
        ]
      })
      this.currentIndex = this.plans.length - 1
      this.editMould(this.currentIndex)
      this.planTitle = this.plans[this.currentIndex].name
      this.datas = this.plans[this.currentIndex].dates
      this.isNewPlan = this.plans[this.currentIndex].isNewPlan
      this.isPermissionEdit = false
    },
    // 应用模板
    savePlans() {
      for (let i = 0; i < this.plans.length; i++) {
        for (let j = i + 1; j < this.plans.length; j++) {
          if (i !== j && this.plans[i].name === this.plans[j].name) {
            this.$messageError('添加的模板名称不能重复', '警告')
            return
          }
        }
      }
      var addPlanList = []
      for (let i = 0; i < this.plans.length; i++) {
        if (this.plans[i].isNewPlan) {
          addPlanList.push(this.plans[this.currentIndex])
          break // 只应用当前选中的计划模板
        }
      }
      let params = {
        templateName: addPlanList[0].name
      }
      const week = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
        8: 'holidayTime'
      }
      addPlanList[0].dates.forEach(e => {
        params[week[e.week]] = { timeInterval: [] }
        e.timeList.forEach(f => {
          params[week[e.week]].timeInterval.push({
            startTime: f.startHouer * 60 ** 2 + f.startMin * 60,
            endTime: f.endHouer * 60 ** 2 + f.endMin * 60
          })
        })
      })
      addTimeTemplateApi(params)
        .then(res => {
          if (res.data.code === 0) {
            this.initGetPlanByUser()
            this.isPermissionEdit = false
          } else {
            this.$messageError('添加失败')
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 编辑模板
    editPlans() {
      for (let i = 0; i < this.plans.length; i++) {
        for (let j = i + 1; j < this.plans.length; j++) {
          if (i !== j && this.plans[i].name === this.plans[j].name) {
            this.$messageError('模板名称不能重复', '警告')
            return
          }
        }
      }
      var editPlanList = []
      for (let i = 0; i < this.plans.length; i++) {
        if (!this.plans[i].isNewPlan) {
          editPlanList.push(this.plans[this.currentIndex])
          break // 只应用当前选中的计划模板
        }
      }
      let params = {
        templateName: editPlanList[0].name,
        id: editPlanList[0].id
      }
      const week = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
        8: 'holidayTime'
      }
      editPlanList[0].dates.forEach((e, index) => {
        params[week[index + 1]] = { timeInterval: [] }
        e.timeList.forEach(f => {
          params[week[index + 1]].timeInterval.push({
            startTime: f.startHouer * 60 ** 2 + f.startMin * 60,
            endTime: f.endHouer * 60 ** 2 + f.endMin * 60
          })
        })
      })
      modifyTimeTemplateApi(params)
        .then(res => {
          if (res.data.code === 0) {
            this.initGetPlanByUser()
          } else {
            this.$messageError('编辑失败')
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 格式化返回的数据
    formatPlans(reciveList) {
      const planLists = []
      reciveList.map(item => {
        const arr = [
          { timeList: [] }, // 1
          { timeList: [] }, // 2
          { timeList: [] }, // 3
          { timeList: [] }, // 4
          { timeList: [] }, // 5
          { timeList: [] }, // 6
          { timeList: [] }, // 7
          { timeList: [] } // 8
        ]
        let map = {
          'monday': 0,
          'tuesday': 1,
          'wednesday': 2,
          'thursday': 3,
          'friday': 4,
          'saturday': 5,
          'sunday': 6,
          'holidayTime': 7
        }
        try {
          for (const key in item) {
            if (!['id', 'templateName'].includes(key) && item[key].hasOwnProperty('timeInterval') && Array.isArray(item[key].timeInterval)) {
              item[key].timeInterval.forEach(e => {
                arr[map[key]].timeList.push({
                  startHouer: parseInt(e.startTime / 3600),
                  startMin: parseInt((e.startTime % 3600) / 60),
                  endHouer: parseInt(e.endTime / 3600),
                  endMin: parseInt((e.endTime % 3600) / 60),
                  isAct: false
                })
              })
            }
          }
        } catch (err) {
          console.log(err)
        }
        planLists.push({
          name: item.templateName,
          id: item.id,
          dates: arr,
          isNewPlan: false
        })
      })
      return planLists
    },
    // 提交数据时将数据格式化为服务器需要的格式
    formatSubmit(reciveList) {
      const planSubmit = []
      reciveList.map(item => {
        const arr = [
          { timeList: [] }, // 1
          { timeList: [] }, // 2
          { timeList: [] }, // 3
          { timeList: [] }, // 4
          { timeList: [] }, // 5
          { timeList: [] }, // 6
          { timeList: [] }, // 7
          { timeList: [] } // 8
        ]
        try {
          item.dates.map((v, i) => {
            arr[i] = {
              timeList: v.timeList.map((value, index) => {
                return {
                  beginTime: parseInt(value.startHouer * 3600 + value.startMin * 60),
                  endTime: parseInt(value.endHouer * 3600 + value.endMin * 60)
                }
              })
            }
          })
        } catch (err) {
          console.log(err)
        }
        planSubmit.push({
          templateName: item.name,
          // id: item.id,
          elements: arr
        })
      })
      return planSubmit
    },
    initGetPlanByUser() {
      getTimeTemplateListApi().then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.middle = this.formatPlans(JSON.parse(JSON.stringify(res.data.data)))
          this.plans = this.formatPlans(JSON.parse(JSON.stringify(res.data.data)))
          this.datas = this.plans[0].dates
          this.isNewPlan = this.plans[0].isNewPlan
          this.planTitle = res.data.data[0].templateName
          this.currentIndex = 0
        } else {
          this.$messageError('获取模板失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.initGetPlanByUser()
  }
}
</script>
<style scoped lang="less">
.selet-model .edit-box {
  display: none;
}

.selet-model:hover .edit-box {
  display: block;
  color: #000;
}

.plan-box {
  height: 100%;
  padding: 15px 10px;
  min-height: 600px;
  width: 100%;
}

.left-box {
  border: 1px solid #ccc;
  margin-left: 10px;
  width: 290px;
  height: 100%;
  float: left;
}

.right-box {
  height: 100%;
  min-width: 1000px;
  border: 1px solid #ccc;
  float: left;
  margin-left: 10px;
  padding: 15px;
}

.left-title {
  text-align: center;
  margin-bottom: 10px;
}

.list-height {
  height: 500px;
}

.left-content {
  width: 290px;
  height: calc(~'100% - 296px');
}

.plan {
  width: 100%;
  height: 40px;
}
.plan:hover {
  color: #20a0ff;
}

.plan > div {
  height: 40px;
  line-height: 40px;
}

.custom-button {
  margin: 20px 0 10px 10px;
}
.check-color {
  border-bottom:2px solid #20a0ff;
  background-color: rgba(242, 242, 242, 1);
}

.plan-box .selet-model {
  height: 40px;
  line-height: 40px;
  width: 99%;
  padding: 0 30px;
  cursor: pointer;
}

.plan-box .selet-model:hover {
  color: #20a0ff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-box .edit-child {
  width: 40px;
  text-align: center;
  cursor: pointer;
  float: right;
}

.save-box {
  padding: 20px 0px;
  clear: both;
}
</style>
