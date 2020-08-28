<template>
  <div class="layWrap">
    <div class="search-box">
      <el-input v-model="filterText"
                @input="searchScene"
                placeholder="请输入场景名称查询..."
                suffix-icon="el-icon-search"
                maxlength="64"
                size="mini"></el-input>
    </div>
    <div class="tvpolingBigWrap">
      <div class="tvpolingList"
           :class="{ activeStyle: changePage === index }"
           v-for="(item, index) in sceneList"
           :key="index"
           @click="changeList(item, index)"
           @dblclick="changeLayOutName(item)">
        <div class="tvpolingListLeft">
          <span>{{ item.name }}</span>
        </div>
        <div class="tvpolingRigth">
          <i class="el-icon-video-play"
             title="执行"
             v-if="usePage"
             @click="useScene(item, index)"
             @click.stop></i>
          <i class="el-icon-delete"
             title="删除"
             v-if="!usePage"
             @click="deleteScene(item)"></i>
        </div>
      </div>
      <div class="tvpolingWrap"
           @click="newAddScene">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新建场景</span>
      </div>
      <!-- 当前场景详细信息 -->
      <div class="sceneDetail"
           v-if="secondList.length !== 0&& sceneList.length !== 0">
        <div class="sceneDetailTitle">
          <span>场景详细信息</span>
        </div>
        <div class="sceneList">
          <div class="title">
            <span>场景名称：</span>
          </div>
          <div class="const">
            <span>{{ secondList.name }}</span>
          </div>
        </div>
        <div class="sceneList">
          <div class="title">
            <span>布局名称：</span>
          </div>
          <div class="const">
            <span>{{ secondList.layoutName }}</span>
          </div>
        </div>
        <div class="windowState"
             v-if="secondList.listTate&&secondList.listTate.length !== 0">
          <div class="titleState">
            <span>窗口状态：</span>
          </div>
          <div class="constState"
               v-for="(item, index) in secondList.listTate"
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
    <!-- 双击场景列表，弹出可修改布局名的弹框 -->
    <el-dialog title="修改场景名称"
               :visible.sync="dialogFormVisible"
               class="inputWidth">
      <el-form :model="form">
        <el-form-item label="场景名称"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="sureChangeLayOutName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { debounce } from '../utils/common'
export default {
  components: {},
  props: ['usePage'],
  data() {
    return {
      filterText: '',
      sceneList: [],
      secondList: [],
      changePage: 0,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '70px',
      searchParams: {
        // 查询参数
        wallId: '',
        name: ''
      },
      changeParams: {
        id: '',
        name: '',
        wallId: ''
      }
    }
  },
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList // 接受电视墙发送出来的信息
    })
  },
  watch: {
    tvWallData: {
      // 监听对象时要deep:true
      handler(newVal, oldVal) {
        this.getTvWallScene()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_CREATED_FLOOR']),
    ...mapActions([
      'createdTvWallScene',
      'deleteTvWallScene',
      'changeTvWallScene',
      'getTvWallSceneList',
      'executeScene'
    ]),
    // 获取当前电视墙场景列表
    getTvWallScene() {
      this.searchParams.wallId = this.tvWallData.id
      this.getTvWallSceneList(this.searchParams)
        .then(res => {
          if (res.data.code === 0) {
            this.sceneList = res.data.data.sceneList || []
            if (this.sceneList.length !== 0) {
              this.secondList = this.sceneList[0] // 默认展示第一个场景信息
              this.changePage = 0
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新建场景
    newAddScene() {
      // 向后台发送当前场景数据，保存当前场景，刷新场景列表
      let params = {
        name: '场景' + (this.sceneList.length + 1),
        wallId: this.tvWallData.id
      }
      this.createdTvWallScene(params)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('场景新建成功')
            this.getTvWallScene() // 刷新场景列表
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除场景
    deleteScene(val) {
      let name = val.name
      let title = '确定删除' + name + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送删除请求，删除轮巡列表，刷新轮巡列表页面
          let params = {
            ids: [val.id],
            wallId: this.tvWallData.id
          }
          this.deleteTvWallScene(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('删除成功')
                this.changePage = 0
                this.getTvWallScene()
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
    },
    // 查询场景
    searchScene(val) {
      this.searchParams.name = val
      this.getTvWallScene()
    },
    // 点击列表，展示其信息
    changeList(val, index) {
      this.changePage = index
      this.secondList = val
    },
    // 双击列表，弹出修改场景名的弹框
    changeLayOutName(val) {
      this.changeParams.id = val.id
      this.changeParams.wallId = this.tvWallData.id
      this.form.name = val.name
      this.dialogFormVisible = true
    },
    // 确定修改当前点中场景名称
    sureChangeLayOutName() {
      this.changeParams.name = this.form.name
      this.changeTvWallScene(this.changeParams)
        .then(res => {
          // 向后台发送修改场景名称的请求
          this.getTvWallScene() // 修改成功，刷新列表
          this.succefullMethod('修改成功')
          this.dialogFormVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 电视墙应用页面执行场景操作
    useScene: debounce(function (data, index) {
      this.executeScene({ id: data.id, wallId: this.tvWallData.id })
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('场景执行成功')
            // 场景执行成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallData.id
            }
            this.SET_CREATED_FLOOR(sendObj)
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }, 1000),
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
  created() {
    if (this.tvWallData.id) {
      this.getTvWallScene() // 获取场景列表
    }
  }
}
</script>
<style scoped lang="less">
.layWrap {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
}
.layWrap /deep/ .el-dialog {
  width: 400px;
}
.layWrap /deep/ .el-dialog__body {
  padding: 20px 20px 0 20px;
}
.layWrap /deep/.el-dialog__footer {
  padding: 0px 20px 20px 0;
}
.inputWidth /deep/ .el-input__inner {
  height: 35px;
  width: 220px;
}
.search-box {
  width: 300px;
  padding: 20px 15px 10px 15px;
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
  overflow: auto;
  max-height: 250px;
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
.tvpolingRigth i {
  font-size: 14px;
  font-weight: bolder;
}
.pollingName {
  cursor: pointer;
  width: 75px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
