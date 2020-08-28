<template>
  <div class="layWrap">
    <div class="search-box">
      <el-input v-model="filterText"
                @input="searchLayOut"
                placeholder="请输入布局名称查询..."
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
             @click="useLayout(item, index)"
             @click.stop></i>
          <i class="el-icon-delete"
             title="删除"
             v-if="!usePage"
             @click="deleteLayout(item)"></i>
        </div>
      </div>
      <div class="tvpolingWrap"
           @click="newAddScene">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新建布局</span>
      </div>
    </div>
    <!-- 双击布局列表，弹出可修改布局名的弹框 -->
    <el-dialog title="修改布局名称"
               :visible.sync="dialogFormVisible"
               class="inputWidth">
      <el-form :model="form">
        <el-form-item label="布局名称"
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
export default {
  components: {},
  props: ['usePage'], // 接受父组件传下来的值(tvWallUseLeft.vue)
  data() {
    return {
      filterText: '',
      sceneList: [],
      changePage: 0,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '70px',
      deleteParams: {
        id: '',
        name: '',
        wallId: ''
      },
      searchParams: {
        wallId: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList // 接受电视墙发送出来的信息
    })
  },
  watch: {},
  methods: {
    ...mapMutations(['SET_CREATED_FLOOR']),
    ...mapActions([
      'getTvWallLayoutList',
      'createdTvWallLayout',
      'deleteTvWallLayout',
      'changeTvWallLayout',
      'execLayoutApi'
    ]),
    // 获取当前电视墙布局列表
    getTvWallLayout() {
      this.searchParams.wallId = this.tvWallData.id
      this.getTvWallLayoutList(this.searchParams)
        .then(res => {
          this.sceneList = res.data.data.results || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询布局
    searchLayOut(val) {
      this.searchParams.name = val
      this.getTvWallLayout()
    },
    // 新建布局
    newAddScene() {
      let params = {
        name: '布局' + (this.sceneList.length + 1),
        wallId: this.tvWallData.id
      }
      // 向后台发送当前布局数据，保存当前布局，刷新布局列表
      this.createdTvWallLayout(params)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('布局新建成功')
            this.getTvWallLayout() // 刷新列表
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除布局
    deleteLayout(val) {
      let name = val.name
      let title = '确定删除' + name + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = {}
          let deleteDataId = []
          deleteDataId.push(val.id)
          let params = {
            ids: (obj.ids = deleteDataId),
            wallId: this.tvWallData.id
          }
          this.deleteTvWallLayout(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('删除成功')
                this.getTvWallLayout() // 删除成功，刷新下列表
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
    // 点击列表，展示其信息
    changeList(val, index) {
      this.changePage = index
    },
    // 双击列表，弹出修改布局名的弹框
    changeLayOutName(val) {
      this.deleteParams.id = val.id
      this.deleteParams.wallId = val.wallId
      this.form.name = val.name
      this.dialogFormVisible = true
    },
    // 确定修改当前点中布局名称
    sureChangeLayOutName() {
      this.deleteParams.name = this.form.name
      this.changeTvWallLayout(this.deleteParams)
        .then(res => {
          // 向后台发送修改布局名称的请求
          this.getTvWallLayout() // 修改成功，刷新列表
          this.succefullMethod('修改成功')
          this.dialogFormVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 电视墙应用页面执行布局操作
    useLayout(data, index) {
      // 向后台发送执行布局的请求，内容部分改变为当前要执行的布局
      this.execLayoutApi({ id: data.id, wallId: data.wallId })
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('布局执行成功')
            // 布局执行成功后向电视墙列表组件发送信号让电视墙列表组件重新拉取电视墙列表
            let sendObj = {
              state: true,
              id: this.tvWallData.id
            }
            this.SET_CREATED_FLOOR(sendObj) // 发送布局执行成功信号，重新拉去menu列表
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
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
    this.getTvWallLayout() // 获取当前电视墙布局列表
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
.activeStyle {
  background: #99a98f !important;
}
.tvpolingRigth i {
  font-size: 14px;
  font-weight: bolder;
}
</style>
