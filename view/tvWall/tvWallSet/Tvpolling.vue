<template>
  <div class="layWrap">
    <div class="search-box"
         v-if="showOrclose">
      <el-input @input="searchPoling"
                v-model="filterText"
                placeholder="请输入轮巡名称查询..."
                maxlength="64"
                suffix-icon="el-icon-search"
                size="mini"></el-input>
    </div>
    <!-- 新建+列表展示 -->
    <div class="newCreated"
         v-if="createdAndchange">
      <div class="tvpolingBigWrap"
           v-if="showOrclose">
        <div class="tvpolingList"
             :class="{ activeStyle: changePage === index }"
             v-for="(item, index) in tvPolingList"
             :key="index"
             @click="changeList(item, index)"
             draggable="true"
             @dragstart="drag(item)">
          <el-tooltip class="item"
                      effect="dark"
                      :content="item.name"
                      placement="top-start">
            <div class="tvpolingListLeft">
              <span>{{ item.name }}</span>
            </div>
          </el-tooltip>

          <div class="tvpolingRigth">
            <i class="el-icon-edit"
               title="编辑"
               v-if="!usePage"
               @click="changeTvpolingMethod(item)"></i>
            <i class="el-icon-delete"
               title="删除"
               v-if="!usePage"
               @click="deletePoling(item, 1)"></i>
          </div>
        </div>
        <div class="tvpolingWrap"
             v-if="!usePage"
             @click="newAddTvpoling">
          <i class="el-icon-circle-plus-outline"></i>
          <span>新建轮巡</span>
        </div>
      </div>
      <div class="newAddTvpoling"
           v-if="!showOrclose">
        <div class="newAdd">
          <div class="title">
            <span>轮巡名称</span>
          </div>
          <div class="const">
            <el-input v-model="formData.name"
                      maxlength="128"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡间隔</span>
          </div>
          <div class="const inputSize">
            <el-input v-model="formData.jgtime"></el-input>
          </div>
          <span style=" margin-left:8px ;">S</span>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡组编号</span>
          </div>
          <div class="const">
            <el-input v-model="formData.bh"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡方式</span>
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
        <div class="newAdd">
          <div class="title">
            <span>开始时间</span>
          </div>
          <div class="const">
            <el-time-picker :disabled="formData.fs === '手动'"
                            v-model="formData.startTime"
                            placeholder="选择时间"
                            format="HH:mm"
                            :picker-options="{selectableRange:`00:00:00-${formData.endTime ? formData.endTime + ':00' : '23:59:59'}`}">
            </el-time-picker>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>结束时间</span>
          </div>
          <div class="const">
            <el-time-picker :disabled="formData.fs === '手动'"
                            v-model="formData.endTime"
                            placeholder="选择时间"
                            format="HH:mm"
                            :picker-options="{selectableRange:`${formData.startTime ? formData.startTime + ':00' : '00:00:00'}-23:59:59`}">
            </el-time-picker>
          </div>
        </div>
        <div class="secondWrap">
          <div class="newAddSecond">
            <div class="titleSecond">
              <span>监控点列表：</span>
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
                 @click="AddListBtn"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectListItem(2)"></i>
            </div>
            <div class="constSecond">
              <el-table :data="detectorList1"
                        @selection-change="handleSelectionChange"
                        border
                        style="width: 100%"
                        height="300"
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
          </div>
          <div class="change_box"
               v-if="dialogTableVisible">
            <div class="contend_change">
              <treeBox :lazyTreeApi="getTreeApi"
                       :lazyTreeCheckApi="lazyTreeCheckApi"
                       :treeType="treeType"
                       :customizeQuery="customizeQuery"
                       iconToggle
                       @checkclick="checkclick"
                       checkboxToggle
                       treeLazyToggle>
              </treeBox>
            </div>
            <div class="footer_change">
              <el-button size="small"
                         @click="dialogTableVisible = false">取 消</el-button>
              <el-button size="small"
                         type="primary"
                         @click="sureSecen('add')">确 定</el-button>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="small"
                     @click="closeBtn(1)">取消</el-button>
          <el-button type="primary"
                     size="small"
                     @click="sucefullMethod('create')">保存</el-button>
        </div>
      </div>
    </div>
    <!-- 修改 -->
    <div class="changeTvpoling"
         v-if="!createdAndchange">
      <div class="newAddTvpoling">
        <div class="newAdd">
          <div class="title">
            <span>轮巡名称</span>
          </div>
          <div class="const">
            <el-input v-model="changeTvpoling.name"
                      maxlength="128"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡间隔</span>
          </div>
          <div class="const inputSize">
            <el-input v-model="changeTvpoling.jgtime"></el-input>
          </div>
          <span style=" margin-left:8px ;">S</span>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡组编号</span>
          </div>
          <div class="const">
            <el-input v-model="changeTvpoling.bh"></el-input>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>轮巡方式</span>
          </div>
          <div class="const">
            <el-select v-model="changeTvpoling.fs">
              <el-option v-for="item in devModelList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>开始时间</span>
          </div>
          <div class="const">
            <el-time-picker :disabled="changeTvpoling.fs === '手动'"
                            v-model="changeTvpoling.startTime"
                            format="HH:mm"
                            placeholder="选择时间"
                            :picker-options="{selectableRange:`00:00:00-${changeTvpoling.endTime ? changeTvpoling.endTime + ':00' : '23:59:59'}`}">
            </el-time-picker>
          </div>
        </div>
        <div class="newAdd">
          <div class="title">
            <span>结束时间</span>
          </div>
          <div class="const">
            <el-time-picker :disabled="changeTvpoling.fs === '手动'"
                            v-model="changeTvpoling.endTime"
                            format="HH:mm"
                            placeholder="选择时间"
                            :picker-options="{selectableRange:`${changeTvpoling.startTime ? changeTvpoling.startTime + ':00' : '00:00:00'}-23:59:59`}">
            </el-time-picker>
          </div>
        </div>
        <div class="secondWrap">
          <div class="newAddSecond">
            <div class="titleSecond">
              <span>监控点列表：</span>
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
                 @click="AddListBtn"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="delectListItem(3)"></i>
            </div>
            <div class="constSecond">
              <el-table :data="detectorList1"
                        @selection-change="handleSelectionChange"
                        border
                        style="width: 100%"
                        height="300"
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
          </div>
          <div class="change_box"
               v-if="dialogTableVisible">
            <div class="contend_change">
              <treeBox :lazyTreeApi="getTreeApi"
                       :lazyTreeCheckApi="lazyTreeCheckApi"
                       :treeType="treeType"
                       :customizeQuery="customizeQuery"
                       @checkclick="checkclick"
                       iconToggle
                       checkboxToggle
                       treeLazyToggle>
              </treeBox>
            </div>
            <div class="footer_change">
              <el-button size="small"
                         @click="dialogTableVisible = false">取 消</el-button>
              <el-button size="small"
                         type="primary"
                         @click="sureSecen('change')">确 定</el-button>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="small"
                     @click="closeBtn(2)">取消</el-button>
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
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '../../../http/tvWall/tvWallmanage.api'
export default {
  components: { treeBox },
  props: ['usePage'],
  data() {
    return {
      value1: new Date('16:29:13'),
      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0',
          channelType: '1'
        }
      },
      treeType: 0,
      formData: {
        // 表单数据
        name: '',
        jgtime: '',
        bh: '',
        fs: '手动',
        startTime: '',
        endTime: '',
        list: []
      },
      changePage: 0, // 选中
      filterText: '',
      tvPolingList: [],
      sceneArr: [], // 轮巡镜头
      showOrclose: true,
      createdAndchange: true, // 新建和修改的切换
      changeTvpoling: {}, // 需要修改的轮循数据
      multipleSelection: [], // 监控列表
      dialogTableVisible: false, // 弹窗
      searchParams: {
        wallId: '',
        name: ''
      },
      devModelList: [
        // 设备型号下拉选项
        { label: '手动', value: '手动' },
        { label: '自动', value: '自动' }
      ],
      detectorList1: [],
      detectorTableColumn1: [{ prop: 'name', label: '监控点名称', width: '' }]
    }
  },
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList // 接受电视墙发送出来的信息
    })
  },
  watch: {
    tvWallData: function (newmess, oldmess) {
      this.getPollingListFun()
    }
  },
  methods: {
    ...mapMutations(['SET_NODEDROP_DATA', 'SET_NODEDROP_STATE', 'SET_NODEDROP_WHERE']),
    ...mapActions(['getPollingListApi', 'createdPollingApi', 'modifPollingApi', 'deletePollingApi']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 懒加载递归机构树接口
    lazyTreeCheckApi(params) {
      return getTreeApi(params)
    },
    // 点击新建轮循
    newAddTvpoling() {
      this.showOrclose = false
    },
    // 删除轮巡
    deletePoling(val, index) {
      if (index === 1) {
        // 删除轮巡列表
        let title = '确定删除' + val.name + '吗?' + ',是否继续?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 发送删除请求，删除该轮巡，刷新轮巡列表页面
            let params = {
              ids: [val.id],
              wallId: this.tvWallData.id
            }
            this.deletePollingApi(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('删除成功')
                  this.getPollingListFun()
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
      } else if (index === 2) {
        // 新建时删除镜头
        let title = '确定删除' + val + '吗?' + ',是否继续?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (let i = 0; i < this.detectorList1.length; i++) {
              for (let j = 0; j < this.multipleSelection.length; j++) {
                if (this.multipleSelection[j].id === this.detectorList1[i].id) {
                  console.log(this.multipleSelection.length)
                  this.detectorList1.splice(i, this.multipleSelection.length)
                  i--
                }
              }
            }
          })
      } else if (index === 3) {
        console.log(this.detectorList1)
        console.log(this.multipleSelection)
        // 修改时删除镜头
        let title = '确定删除' + val + '吗?' + ',是否继续?'
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (let i = 0; i < this.detectorList1.length; i++) {
              for (let j = 0; j < this.multipleSelection.length; j++) {
                if (this.multipleSelection[j].rid === this.detectorList1[i].id) {
                  this.detectorList1.splice(i, this.multipleSelection.length)
                  i--
                }
              }
            }
          })
      }
    },
    // 点击取消按钮
    closeBtn(val) {
      if (val === 1) { // 新建取消(清空表单数据)
        this.formData = {
          // 表单数据
          name: '',
          jgtime: '',
          bh: '',
          fs: '手动',
          startTime: '',
          endTime: '',
          list: []
        }
        this.sceneArr = []
        this.detectorList1 = []
      }
      this.createdAndchange = true // 修改页面关闭
      this.showOrclose = true
    },
    // 点击保存按钮，保存新的轮巡
    sucefullMethod(mode) {
      if ((mode === 'create' && this.formData.name === '') || (mode === 'change' && this.changeTvpoling.name === '')) {
        this.failureMethod('轮巡名称不能为空')
        return
      }
      if ((mode === 'create' && Number(this.formData.jgtime) < 5) || (mode === 'change' && Number(this.changeTvpoling.jgtime) < 5)) {
        this.failureMethod('轮巡间隔必须为5 ~ 3600间的整数')
        return
      }
      if ((mode === 'create' && this.formData.fs === '自动' && this.formData.startTime === '') || (mode === 'change' && this.changeTvpoling.fs === '自动' && this.changeTvpoling.startTime === '')) {
        this.failureMethod('自动轮巡开始时间不能为空')
        return
      }
      if ((mode === 'create' && this.formData.fs === '自动' && this.formData.endTime === '') || (mode === 'change' && this.changeTvpoling.fs === '自动' && this.changeTvpoling.endTime === '')) {
        this.failureMethod('自动轮巡结束时间不能为空')
        return
      }
      // 保存成功，到轮巡列表(刷新轮巡列表)
      let params = {}
      if (mode === 'create') {
        // 新建轮询
        params = {
          name: this.formData.name,
          code: Number(this.formData.bh),
          interval: Number(this.formData.jgtime),
          pollingWay: this.formData.fs === '手动' ? 1 : 2,
          startTime:
            this.$moment(this.formData.startTime).format('HH:mm') === 'Invalid date'
              ? ''
              : this.$moment(this.formData.startTime).format('HH:mm'),
          endTime:
            this.$moment(this.formData.endTime).format('HH:mm') === 'Invalid date'
              ? ''
              : this.$moment(this.formData.endTime).format('HH:mm'),
          rids: [],
          // rids: this.multipleSelection.map(item => item.id),
          wallId: this.tvWallData.id
        }
        this.detectorList1.map(item => {
          let obj = { rid: '', name: '' }
          obj.rid = item.id
          obj.name = item.name
          params.rids.push(obj)
        })
        if (params.rids.length !== 0) { // 没有镜头，禁止添加轮巡
          this.createdPollingApi(params)
            .then(res => {
              this.formData = {
                name: '',
                jgtime: '',
                bh: '',
                fs: '手动',
                startTime: '',
                endTime: '',
                list: []
              }
              if (res.data.message === 'success') {
                // this.$messageSuccess('新建轮询成功')
                this.detectorList1 = [] // 新建成功，清空数组
                this.succefullMethod('新建轮询成功')
                this.getPollingListFun()
                this.showOrclose = true // 新建成功，新建页面关闭
              } else {
                this.failureMethod('新建轮询失败')
                // this.$messageError('新建轮询失败')
              }
            })
            .catch(err => {
              this.failureMethod('新建轮询失败')
              // this.$messageError('新建轮询失败')
              console.log(err)
            })
        } else {
          this.failureMethod('请添加轮巡镜头')
        }
      } else if (mode === 'change') {
        // 修改轮询
        let params = {
          id: this.changeTvpoling.id,
          name: this.changeTvpoling.name,
          code: Number(this.changeTvpoling.bh),
          interval: Number(this.changeTvpoling.jgtime),
          pollingWay: this.changeTvpoling.fs === '手动' ? 1 : 2,
          startTime:
            this.$moment(this.changeTvpoling.startTime).format('HH:mm') === 'Invalid date'
              ? ''
              : this.$moment(this.changeTvpoling.startTime).format('HH:mm'),
          endTime:
            this.$moment(this.changeTvpoling.endTime).format('HH:mm') === 'Invalid date'
              ? ''
              : this.$moment(this.changeTvpoling.endTime).format('HH:mm'),
          rids: [],
          wallId: this.tvWallData.id
        }
        this.detectorList1.map(item => {
          let obj = { rid: '', name: '' }
          obj.rid = item.id
          obj.name = item.name
          params.rids.push(obj)
        })
        if (params.rids.length !== 0) { // 没有镜头，禁止添加轮巡
          this.modifPollingApi(params)
            .then(res => {
              if (res.data.code === 0) {
                this.detectorList1 = [] // 修改成功，清空数组
                this.succefullMethod('修改成功')
                this.getPollingListFun()
                this.showOrclose = true // 新建成功，新建页面关闭
                this.createdAndchange = true // 修改页面关闭
              } else {
                this.failureMethod('请求失败')
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.failureMethod('请添加轮巡镜头')
        }
      }
    },
    // 获取轮询列表数据
    getPollingListFun() {
      this.searchParams.wallId = this.tvWallData.id
      this.getPollingListApi(this.searchParams)
        .then(res => {
          res = res.data.data.results
          this.tvPolingList = []
          if (res && res.length !== 0) {
            res.forEach(item => {
              this.tvPolingList.push({
                id: item.id,
                wallId: item.wallId,
                name: item.name,
                jgtime: item.interval,
                bh: item.code,
                fs: item.pollingWay === 1 ? '手动' : '自动',
                startTime: item.startTime,
                endTime: item.endTime,
                list: item.rids
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 轮巡查询
    searchPoling(val) {
      this.searchParams.name = val
      this.getPollingListFun()
    },
    // 新建和修改的切换
    changeTvpolingMethod(val) {
      let arr = []
      arr = val.list || []
      arr.map(item => {
        item['id'] = item.rid
      })
      this.detectorList1 = arr
      if (val.fs === '自动') {
        let now = this.$moment()
          .locale('zh-cn')
          .format('YYYY-MM-DD')
        this.changeTvpoling = val
        this.changeTvpoling.startTime = new Date(now + ' ' + val.startTime)
        this.changeTvpoling.endTime = new Date(now + ' ' + val.endTime)
      } else {
        this.changeTvpoling = val
        this.changeTvpoling.startTime = ''
        this.changeTvpoling.endTime = ''
      }
      this.createdAndchange = false
      this.showOrclose = false // 搜索隐藏
    },
    // 新增监控中心
    checkclick(node, data, status) {
      console.log(node)
      console.log(status)
      console.log(data)
      let obj = {
        subSystem: '1',
        isRecursion: '1',
        channelType: '1',
        type: 0
      }
      if (node.tierType === 'org') { // 机构
        obj.oId = node.id
        this.failureMethod('勾选机构暂不支持递归查询')
        // this.recursiveSearch(obj)
      } else if (node.tierType === 'loc') { // 重点部位
        obj.kpId = node.id
        this.recursiveSearch(obj)
      } else if (node.tierType === 'equ') { // 设备
        obj.dId = node.id
        this.recursiveSearch1(obj)
      } else if (node.tierType === 'res') { // 资源
        let index = this.sceneArr.findIndex(vl => {
          return node.id === vl.id
        })
        if (index === -1) {
          this.sceneArr.push(node)
        } else {
          this.sceneArr.splice(index, 1)
        }
      }
    },
    // 递归查找镜头(重点部位)
    recursiveSearch(val) {
      getTreeApi(val).then(res => {
        let tree = res.data.data.tree
        if (res.data.code === 0) {
          if (this.sceneArr.length === 0) {
            tree.map(item => {
              item.children && item.children.map(val => {
                this.sceneArr.push(val)
              })
            })
          } else {
            tree.map(item => {
              item.children && item.children.map(val => {
                let index = this.sceneArr.findIndex(vl => {
                  return val.id === vl.id
                })
                if (index === -1) {
                  this.sceneArr.push(val)
                } else {
                  this.sceneArr.splice(index, 1)
                }
              })
            })
          }
        } else {
          this.failureMethod('递归查找镜头失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 递归查找镜头(设备)
    recursiveSearch1(val) {
      getTreeApi(val).then(res => {
        let tree = res.data.data.tree
        if (res.data.code === 0) {
          if (this.sceneArr.length === 0) {
            tree.map(item => {
              this.sceneArr.push(item)
            })
          } else {
            tree.map(item => {
              let index = this.sceneArr.findIndex(vl => {
                return item.id === vl.id
              })
              if (index === -1) {
                this.sceneArr.push(item)
              } else {
                this.sceneArr.splice(index, 1)
              }
            })
          }
        } else {
          this.failureMethod('递归查找镜头失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 确定添加镜头
    sureSecen(val) {
      this.sceneArr.map(item => {
        if (item.tierType === 'res') {
          let obj = { id: '', rid: '', name: '' }
          obj.id = item.id
          obj.name = item.name
          obj.rid = item.id
          this.detectorList1.push(obj)
        }
      })
      console.log(this.detectorList1)
      // debugger
      this.sceneArr = [] // 清空数据
      this.dialogTableVisible = false
    },
    // 监控列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除监控列表中的数据
    delectListItem(val) {
      if (this.multipleSelection.length === 0) {
        this.failureMethod('请选择要删除的数据')
      } else {
        // 调起删除弹框
        this.deletePoling('该监控数据', val)
      }
    },
    // 上移函数
    upMethod() {
      if (this.multipleSelection.length === 0) {
        this.failureMethod('请选择要上移的数据')
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
        this.failureMethod('请选择要下移的数据')
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
    // 新增监控中心列表按钮
    AddListBtn() {
      this.dialogTableVisible = true
    },
    // 拖动
    drag(item) {
      this.SET_NODEDROP_STATE(true)
      this.SET_NODEDROP_DATA(item)
      this.SET_NODEDROP_WHERE('轮巡')
    },
    // 拖动放下
    // dragend() {
    //   this.SET_NODEDROP_STATE(false)
    // },
    // 点击列表，展示其信息
    changeList(val, index) {
      this.changePage = index
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
  },
  created() { },
  mounted() {
    if (this.tvWallData.id) {
      this.getPollingListFun()
    }
  },
  updated() {
  }
}
</script>
<style scoped lang="less">
.change_box {
  width: 272px;
  top: 0;
  background: #fff;
  z-index: 1;
  height: 420px;
  position: absolute;
  border: 1px solid gainsboro;
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;
}
.contend_change {
  overflow: auto;
  flex: 1;
  padding-bottom: 15px;
}
.footer_change {
  text-align: right;
  height: 35px;
  padding-right: 20px;
}
.layWrap {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
}
.search-box {
  width: 300px;
  padding: 20px 15px 10px 15px;
}
.tvpolingWrap {
  padding-left: 15px;
  cursor: pointer;
  padding-top: 15px;
}
.tvpolingWrap i {
  font-size: 13px;
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
  position: relative;
  padding: 10px 43px 0 20px;
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
.footer {
  text-align: right;
  padding: 20px 43px;
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
.activeStyle {
  background: #99a98f !important;
}
.tvpolingListLeft {
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
