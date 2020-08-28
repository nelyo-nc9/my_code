<template>
  <div class="layWrap">
    <div v-if="showOrclose"
         class="search-box">
      <el-input @input="searchPlan"
                v-model="filterText"
                placeholder="请输入预案名称查询..."
                maxlength="64"
                suffix-icon="el-icon-search"
                size="mini"></el-input>
    </div>
    <!-- 新建预案 -->
    <div class="createdPlan"
         v-if="createdAndchange">
      <div class="tvpolingBigWrap"
           v-if="showOrclose">
        <div class="tvpolingList"
             :class="{ activeStyle: changePage === index }"
             v-for="(item, index) in sceneListArr"
             :key="index"
             @click="changeList(item, index)">
          <el-tooltip class="item"
                      effect="dark"
                      :content="item.name"
                      placement="top-start">
            <div class="tvpolingListLeft">
              <span>{{ item.name }}</span>
            </div>
          </el-tooltip>
          <div class="tvpolingRigth">
            <i class="el-icon-video-pause"
               title="暂停"
               v-if="usePage"
               @click="stopPlan"
               @click.stop></i>
            <i class="el-icon-video-play"
               title="执行"
               v-if="usePage"
               @click="usePlan(item)"
               @click.stop></i>
            <i class="el-icon-edit"
               title="编辑"
               @click="changeTvpolingMethod(item)"
               v-if="!usePage"></i>
            <i class="el-icon-delete"
               title="删除"
               v-if="!usePage"
               @click="deletePlan(item,1)"></i>
          </div>
        </div>
        <div class="tvpolingWrap"
             @click="newAddplan"
             v-if="!usePage">
          <i class="el-icon-circle-plus-outline"></i>
          <span>新建预案</span>
        </div>
        <!-- 当前预案详细信息 -->
        <div class="sceneDetail"
             v-if="secondList && sceneListArr.length !== 0">
          <div class="sceneDetailTitle">
            <span>预案详细信息</span>
          </div>
          <div class="sceneList">
            <div class="title">
              <span>预案名称：</span>
            </div>
            <div class="const">
              <span>{{ secondList.name }}</span>
            </div>
          </div>
          <div v-for="(item, index) in thirdList"
               :key="index">
            <div class="sceneList padLeft">
              <ul>
                <li>
                  <span>{{ item.name }}</span>
                </li>
                <li class="timeLeft">
                  <span>{{ item.startTime }} - {{item.endTime}}</span>
                </li>
              </ul>
            </div>
            <div class="sceneList padRight">
              <div class="title">
                <span>场景名称：</span>
              </div>
              <div class="const">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="sceneList padRight">
              <div class="title">
                <span>布局名称：</span>
              </div>
              <div class="const">
                <span>{{ item.layoutName }}</span>
              </div>
            </div>
            <div class="windowState padRight"
                 v-if="item.listTate.length !== 0">
              <div class="titleState">
                <span>窗口状态：</span>
              </div>
              <div class="constState"
                   v-for="(item, index) in item.listTate"
                   :key="index">
                <ul>
                  <li>
                    <span>{{ item.wnd }}</span>
                  </li>
                  <li>
                    <span>{{ item.code }}</span>
                  </li>
                  <li>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.status"
                                placement="top-start">
                      <div class="pollingName">
                        <span>{{ item.status }}</span>
                      </div>
                    </el-tooltip>
                  </li>
                  <li>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="item.pollingName"
                                placement="top-start">
                      <div class="pollingName">
                        <span>{{ item.pollingName }}</span>
                      </div>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="newAddTvpoling"
           v-if="!showOrclose">
        <div class="newAdd">
          <div class="title">
            <span>预案名称</span>
          </div>
          <div class="const">
            <el-input v-model="formData.name"
                      maxlength="128"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>预案编号</span>
          </div>
          <div class="const">
            <el-input v-model="formData.bh"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>执行方式</span>
          </div>
          <div class="const">
            <el-select v-model="formData.fs">
              <el-option v-for="item in devModelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="secondWrap">
          <div class="newAddSecond">
            <div class="titleSecond">
              <span>场景列表：</span>
            </div>
            <div class="newAddIcon">
              <i class="el-icon-top"
                 title="上移"
                 @click="upMethod()"></i>
              <i class="el-icon-bottom"
                 title="下移"
                 @click="downMethod()"></i>
              <i class="el-icon-circle-plus-outline"
                 title="新增"
                 @click="AddSenceList"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectListItem(2)"></i>
            </div>
            <div class="constSecond"
                 v-if="AddSceneListFlag">
              <el-table :data="detectorList1"
                        @selection-change="handleSelectionChange"
                        border
                        style="width: 100%"
                        height="400"
                        size="mini"
                        stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index"
                                 label="序号"></el-table-column>
                <el-table-column v-for="item in detectorTableColumn1"
                                 :key="item.label"
                                 :prop="item.prop"
                                 :width="item.width"
                                 :label="item.label"
                                 show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
            <div class="constSecondList"
                 v-if="!AddSceneListFlag">
              <div class="listTitle">
                <span>添加场景</span>
              </div>
              <div class="listContend">
                <div class="list">
                  <div class="titleStyle">
                    <span>场景名称*</span>
                  </div>
                  <div class="constStyle">
                    <el-select @change="changeMethod"
                               v-model="formData2.sceneId">
                      <el-option v-for="item in devModelList1"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="list">
                  <div class="titleStyle">
                    <span>开始时间*</span>
                  </div>
                  <div class="constStyle">
                    <el-time-picker v-model="formData2.startTime"
                                    placeholder="选择时间"
                                    :picker-options="{selectableRange:`00:00:00-${formData2.endTime ? formData2.endTime + ':00' : '23:59:59'}`}"
                                    format="HH:mm">
                    </el-time-picker>
                  </div>
                </div>
                <div class="list">
                  <div class="titleStyle">
                    <span>结束时间*</span>
                  </div>
                  <div class="constStyle">
                    <el-time-picker v-model="formData2.endTime"
                                    type="datetime"
                                    placeholder="选择时间"
                                    :picker-options="{selectableRange:`${formData2.startTime ? formData2.startTime + ':00' : '00:00:00'}-23:59:59`}"
                                    format="HH:mm">
                    </el-time-picker>
                  </div>
                </div>
              </div>
              <div class="listFooter">
                <el-button size="small"
                           @click="cancelMethod">取消</el-button>
                <el-button type="primary"
                           size="small"
                           @click="listSucefullMethod">保存</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="small"
                     @click="closeBtn">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="sucefullMethod('create')">保存</el-button>
        </div>
      </div>
    </div>
    <!-- 修改预案 -->
    <div class="changePlan"
         v-if="!createdAndchange">
      <div class="newAddTvpoling">
        <div class="newAdd">
          <div class="title">
            <span>预案名称</span>
          </div>
          <div class="const">
            <el-input v-model="changePlanData.name"
                      maxlength="128"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>预案编号</span>
          </div>
          <div class="const">
            <el-input v-model="changePlanData.bh"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>执行方式</span>
          </div>
          <div class="const">
            <el-select v-model="changePlanData.fs">
              <el-option v-for="item in devModelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="secondWrap">
          <div class="newAddSecond">
            <div class="titleSecond">
              <span>场景列表：</span>
            </div>
            <div class="newAddIcon">
              <i class="el-icon-top"
                 title="上移"
                 @click="upMethod()"></i>
              <i class="el-icon-bottom"
                 title="下移"
                 @click="downMethod()"></i>
              <i class="el-icon-circle-plus-outline"
                 title="新增"
                 @click="AddSenceList"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectListItem(3)"></i>
            </div>
            <div class="constSecond"
                 v-if="AddSceneListFlag">
              <el-table :data="detectorList1"
                        @selection-change="handleSelectionChange"
                        border
                        style="width: 100%"
                        height="200"
                        size="mini"
                        stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index"
                                 label="序号"></el-table-column>
                <el-table-column v-for="item in detectorTableColumn1"
                                 :key="item.label"
                                 :prop="item.prop"
                                 :width="item.width"
                                 :label="item.label"
                                 show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
            <div class="constSecondList"
                 v-if="!AddSceneListFlag">
              <div class="listTitle">
                <span>添加场景</span>
              </div>
              <div class="listContend">
                <div class="list">
                  <div class="titleStyle">
                    <span>场景名称*</span>
                  </div>
                  <div class="constStyle">
                    <el-select @change="changeMethod"
                               v-model="formData2.sceneId">
                      <el-option v-for="item in devModelList1"
                                 :key="item.label"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="list">
                  <div class="titleStyle">
                    <span>开始时间*</span>
                  </div>
                  <div class="constStyle">
                    <el-time-picker v-model="formData2.startTime"
                                    placeholder="选择时间"
                                    :picker-options="{selectableRange:`00:00:00-${formData2.endTime ? formData2.endTime + ':00' : '23:59:59'}`}"
                                    format="HH:mm">
                    </el-time-picker>
                  </div>
                </div>
                <div class="list">
                  <div class="titleStyle">
                    <span>结束时间*</span>
                  </div>
                  <div class="constStyle">
                    <el-time-picker v-model="formData2.endTime"
                                    placeholder="选择时间"
                                    :picker-options="{selectableRange:`${formData2.startTime ? formData2.startTime + ':00' : '00:00:00'}-23:59:59`}"
                                    format="HH:mm">
                    </el-time-picker>
                  </div>
                </div>
              </div>
              <div class="listFooter">
                <el-button size="small"
                           @click="cancelMethod">取消</el-button>
                <el-button type="primary"
                           size="small"
                           @click="listSucefullMethod">保存</el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <el-button size="small"
                     @click="closeBtn">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="sucefullMethod('change')">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { debounce } from '../utils/common'
export default {
  components: {},
  props: ['usePage'],
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList // 接受电视墙发送出来的信息
    })
  },
  watch: {
    tvWallData: {
      // 监听对象时要deep:true
      handler(newVal, oldVal) {
        this.getPlanListFun()
      },
      deep: true
    }
  },
  data() {
    return {
      formData: {
        // 表单数据
        name: '',
        jgtime: '',
        bh: '',
        fs: '手动'
      },
      formData2: {
        startTime: '',
        endTime: '',
        sceneId: '',
        name: ''
      },
      filterText: '',
      createdAndchange: true, // 新建和修改的切换
      changePlanData: {}, // 需要修改的数据
      multipleSelection: [], // 场景列表选中数据
      AddSceneListFlag: true, // 新增场景列表按钮开关
      sceneListArr: [],
      secondList: '',
      thirdList: [],
      changePage: 0,
      showOrclose: true,
      devModelList: [
        // 设备型号下拉选项
        { label: '手动', value: '手动' },
        { label: '自动', value: '自动' }
      ],
      searchParams: {
        wallId: '',
        name: ''
      },
      // 场景下拉选项
      devModelList1: [],
      detectorList1: [],
      detectorTableColumn1: [
        { prop: 'name', label: '监控点名称', width: '110' },
        { prop: 'startTime', label: '开始时间', width: '' },
        { prop: 'endTime', label: '结束时间', width: '' }
      ]
    }
  },
  methods: {
    ...mapMutations(['SET_CREATED_FLOOR']),
    ...mapActions([
      'createdTvWallPlan',
      'deleteTvWallPlan',
      'changeTvWallPlan',
      'getTvWallPlanList',
      'executePlan',
      'getTvWallSceneList'
    ]),

    // 新建预案
    newAddplan() {
      // 向后台发送当前预案数据，保存当前预案，刷新预案列表
      this.showOrclose = false
    },
    // 删除预案
    deletePlan(val, index) {
      if (index === 1) { // 删除预案列表
        let title = '确定删除' + val.name + '吗?' + ',是否继续?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 发送删除请求，删除该预案，刷新预案列表页面
            let params = {
              ids: [val.id],
              wallId: this.tvWallData.id
            }
            this.deleteTvWallPlan(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('删除成功')
                  this.getPlanListFun()
                } else {
                  this.failureMethod(res.data.message)
                }
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
      } else if (index === 2 || index === 3) { // 新建时，删除场景列表
        let title = '确定删除' + val + '吗?' + ',是否继续?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (let i = 0; i < this.detectorList1.length; i++) {
              for (let j = 0; j < this.multipleSelection.length; j++) {
                if (this.multipleSelection[j].sceneId === this.detectorList1[i].sceneId) {
                  this.detectorList1.splice(i, 1)
                  i--
                }
              }
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 点击列表，展示其信息
    changeList(val, index) {
      this.changePage = index
      this.secondList = val
      this.thirdList = val.list
    },
    // 点击取消按钮
    closeBtn() {
      this.createdAndchange = true // 修改页面关闭
      this.showOrclose = true
    },
    // 点击保存按钮，保存新的预案
    sucefullMethod(mode) {
      console.log(mode)
      if ((mode === 'create' && this.formData.name === '') || (mode === 'change' && this.changePlanData.name === '')) {
        this.failureMethod('预案名称不能为空')
        return
      }
      let params = {}
      if (mode === 'create') { // 新建预案
        params = {
          wallId: this.tvWallData.id,
          name: this.formData.name,
          code: Number(this.formData.bh),
          execWay: this.formData.fs === '手动' ? 1 : 2,
          info: []
        }
        this.detectorList1.map(item => {
          let obj = { startTime: '', endTime: '', sceneId: '' }
          obj.startTime = item.startTime.substr(0, item.startTime.lastIndexOf(':'))
          obj.endTime = item.endTime.substr(0, item.endTime.lastIndexOf(':'))
          obj.sceneId = item.sceneId
          params.info.push(obj)
        })
        if (params.info.length !== 0) {
          this.createdTvWallPlan(params).then(res => {
            if (res.data.code === 0) {
              this.getPlanListFun() // 新建成功，刷新列表
              this.succefullMethod('预案新建成功')
              this.detectorList1 = [] // 新建成功，清除数据
              this.showOrclose = true // 新建成功，关闭新建页面
              this.formData = { // 新建成功，清空数据
                // 表单数据
                name: '',
                jgtime: '',
                bh: '',
                fs: '手动'
              }
            } else {
              this.failureMethod('新建预案失败')
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.failureMethod('请添加场景')
        }
      } else if (mode === 'change') { // 修改预案
        let params = {
          wallId: this.tvWallData.id,
          id: this.changePlanData.id,
          name: this.changePlanData.name,
          code: Number(this.changePlanData.bh),
          execWay: this.changePlanData.fs === '手动' ? 1 : 2,
          info: []
        }
        this.detectorList1.map(item => {
          let obj = { startTime: '', endTime: '', sceneId: '' }
          obj.startTime = item.startTime
          obj.endTime = item.endTime
          obj.sceneId = item.sceneId
          params.info.push(obj)
        })
        if (params.info.length !== 0) {
          this.changeTvWallPlan(params).then(res => {
            if (res.data.code === 0) {
              this.detectorList1 = [] // 修改成功，清除数据
              this.succefullMethod('修改成功')
              this.getPlanListFun() // 刷新预案列表
              this.showOrclose = true
              this.createdAndchange = true // 修改页面关闭
            } else {
              this.failureMethod('修改预案失败')
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.failureMethod('请添加场景')
        }
      }
    },
    // 获取预案列表数据
    getPlanListFun() {
      this.searchParams.wallId = this.tvWallData.id
      this.getTvWallPlanList(this.searchParams)
        .then(res => {
          res = res.data.data.planList
          this.sceneListArr = []
          if (res && res.length !== 0) {
            res.forEach(item => {
              this.sceneListArr.push({
                id: item.id,
                wallId: item.wallId,
                name: item.name,
                bh: item.code,
                fs: item.execWay === 1 ? '手动' : '自动',
                list: item.sceneList
              })
            })
            this.secondList = this.sceneListArr[0] // 默认展示第一个预案信息
            this.thirdList = this.sceneListArr[0].list
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询预案
    searchPlan(val) {
      this.searchParams.name = val
      this.getPlanListFun()
    },
    // 新建和修改的切换
    changeTvpolingMethod(val) {
      if (val.list.length !== 0) {
        val.list.map(item => {
          item['sceneId'] = item.id
        })
      }
      this.detectorList1 = val.list || []
      this.changePlanData = val
      this.showOrclose = false // 搜索隐藏
      this.createdAndchange = false
    },
    // 监控列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 删除监控列表中的数据
    delectListItem(val) {
      if (this.multipleSelection.length === 0) {
        this.warningMethod('请选择要删除的数据')
      } else {
        // 调起删除弹框
        this.deletePlan('该场景数据', val)
      }
    },
    // 上移函数
    upMethod() {
      if (this.multipleSelection.length === 0) {
        this.warningMethod('请选择要上移的数据')
      } else {
        const list = []
        this.detectorList1.forEach((item, index) => {
          this.multipleSelection.forEach((itemChange, indexChange) => {
            if (item.id === itemChange.id) {
              list.push(index)
            }
          })
        })
        list.forEach(index => {
          this._upChannel(index)
        })
      }
    },
    _upChannel(index) {
      const nodes = this.detectorList1
      if (index !== 0) {
        const item1 = nodes[index - 1]
        const item2 = nodes[index]
        nodes.splice(index - 1, 2, item2, item1)
      }
    },
    // 下移函数
    downMethod() {
      if (this.multipleSelection.length === 0) {
        this.warningMethod('请选择要下移的数据')
      } else {
        const list = []
        this.detectorList1.forEach((item, index) => {
          this.multipleSelection.forEach((itemChange, indexChange) => {
            if (item.id === itemChange.id) {
              list.push(index)
            }
          })
        })
        list.forEach(index => {
          this._downChannel(index)
        })
      }
    },
    _downChannel(index) {
      const nodes = this.detectorList1
      if (index !== nodes.length - 1) {
        const item1 = nodes[index]
        const item2 = nodes[index + 1]
        nodes.splice(index, 2, item2, item1)
      }
    },
    // 获取当前电视墙场景列表
    getTvWallScene() {
      let params = {
        wallId: this.tvWallData.id,
        name: ''
      }
      this.getTvWallSceneList(params)
        .then(res => {
          if (res.data.code === 0) {
            res.data.data.sceneList.map(item => {
              let obj = { label: '', value: '' }
              obj.label = item.name
              obj.value = item.id
              this.devModelList1.push(obj)
            })
          } else {
            this.failureMethod('场景列表获取失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增场景列表
    AddSenceList() {
      this.getTvWallScene() // 获取当前电视墙场景列表
      this.AddSceneListFlag = false
    },
    changeMethod(val) {
      this.devModelList1.map(item => {
        if (item.value === val) {
          this.formData2.name = item.label
        }
      })
    },
    // 保存新建的场景，刷新列表
    listSucefullMethod() {
      if (this.formData2.sceneId === '' || this.formData2.sceneName === '') {
        this.failureMethod('请选择场景')
      } else if (this.formData2.startTime === '' || this.formData2.endTime === '') {
        this.failureMethod('请选择时间')
      } else {
        this.formData2.startTime = this.$moment(this.formData2.startTime).format('HH:mm:ss')
        this.formData2.endTime = this.$moment(this.formData2.endTime).format('HH:mm:ss')
        this.detectorList1.push(JSON.parse(JSON.stringify(this.formData2))) // push时需要克隆
        this.AddSceneListFlag = true
        this.devModelList1 = [] // 清空场景
        this.formData2 = {
          startTime: '',
          endTime: '',
          sceneId: '',
          name: ''
        }
      }
    },
    // 点击取消，关闭场景列表展示
    cancelMethod() {
      this.AddSceneListFlag = true
      this.devModelList1 = [] // 清空场景
    },
    // 电视墙应用页面执行预案操作
    usePlan: debounce(function (data) {
      // 向后台发送执行预案的请求，内容部分改变为当前要执行的布局
      this.executePlan({ id: data.id, wallId: this.tvWallData.id })
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('预案执行成功')
            // 预案执行成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallData.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('预案执行失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }, 2000),
    // usePlan(data) {
    //   // 向后台发送执行预案的请求，内容部分改变为当前要执行的布局
    //   this.executePlan({ id: data.id, wallId: this.tvWallData.id })
    //     .then(res => {
    //       if (res.data.code === 0) {
    //         this.succefullMethod('预案执行成功')
    //         // 预案执行成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
    //         let sendObj = {
    //           state: true,
    //           id: this.tvWallData.id
    //         }
    //         this.SET_CREATED_FLOOR(sendObj)
    //       } else {
    //         this.failureMethod('预案执行失败')
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // 电视墙应用页面暂停执行预案操作
    stopPlan() {
      this.succefullMethod('预案暂停成功') // 请求成功之后，调成功提示函数
      console.log('停止执行预案')
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
    // 警告提示
    warningMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        type: 'warning',
        duration: 2500
      })
    }
  },
  created() {
    if (this.tvWallData.id) {
      this.getPlanListFun() // 获取场景列表
    }
  }
}
</script>
<style scoped lang="less">
.listTitle {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.listContend {
  padding: 15px 12px;
}
.list {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}
.titleStyle {
  width: 58px;
}
.constStyle {
  width: 192px;
}
.constStyle /deep/ .el-input__inner {
  width: 192px !important;
  height: 30px;
}
.constStyle /deep/ .el-input__icon {
  line-height: 30px;
}
.constStyle /deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 192px;
}
.listFooter {
  width: 100%;
  text-align: center;
}
.layWrap {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
}
.search-box {
  width: 300px;
  padding: 20px 15px 10px 15px;
  // height: 58px;
}
.createdPlan {
  flex: 1;
  overflow: auto;
}
.tvpolingList {
  cursor: pointer;
  width: 300px;
  border: 1px solid gainsboro;
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin: 0 15px 8px 15px;
  padding: 0 15px;
  line-height: 30px;
  border-radius: 5%;
}
.tvpolingList:hover {
  background: #d3dce6;
}
.tvpolingList i {
  margin-right: 3px;
  cursor: pointer;
}
.tvpolingWrap {
  padding-left: 15px;
  cursor: pointer;
  padding-top: 15px;
}
.tvpolingWrap i {
  font-size: 13px;
}
.sceneDetail {
  background: #ffff;
  margin: 15px 15px 0 15px;
  padding-bottom: 15px;
}
.sceneDetailTitle {
  width: 100%;
  text-align: center;
  padding: 10px 0 0 0;
}
.sceneList {
  display: flex;
  padding: 10px 10px 0px 10px;
}
.windowState {
  padding: 10px;
}
.constState {
  margin-top: 10px;
}
.constState ul {
  display: flex;
}
.constState ul li {
  margin-right: 10px;
}
.activeStyle {
  background: #99a98f !important;
}
.padRight {
  padding-left: 25px !important;
}
.padLeft {
  padding-left: 15px !important;
}
.sceneList ul {
  display: flex;
}
.timeLeft {
  margin-left: 10px;
}

.newAdd {
  display: flex;
  padding: 5px 20px;
  align-items: center;
}
.title {
  width: 70px;
}
.const /deep/.el-input__inner {
  height: 30px;
}
.secondWrap {
  padding: 43px 43px 0 20px;
}
.newAddIcon {
  text-align: right;
  margin-bottom: 2px;
  i {
    cursor: pointer;
    margin-right: 6px;
    font-size: 14px;
  }
}

.titleSecond {
  width: 74px;
}
.constSecond {
  width: 100%;
  border: 1px solid gainsboro;
}
.constSecondList {
  width: 100%;
  height: 270px;
  border: 1px solid gainsboro;
}
.footer {
  text-align: right;
  padding: 43px;
}
.const /deep/ .el-input__inner {
  width: 202px;
}
.const /deep/ .el-input__icon {
  line-height: 30px;
}
.inputSize /deep/ .el-input__inner {
  width: 100px;
}
.tvpolingList {
  width: 300px;
  border: 1px solid gainsboro;
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin: 0 15px 8px 15px;
  padding: 0 15px;
  line-height: 30px;
  border-radius: 5%;
}
.tvpolingList i {
  margin-right: 3px;
  cursor: pointer;
}
.tvpolingRigth i {
  font-size: 14px;
  font-weight: bolder;
}
.tvpolingListLeft {
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pollingName {
  cursor: pointer;
  width: 75px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
