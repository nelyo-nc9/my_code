<template>
  <div class="tv-body">
    <div class="tabWrap">
      <div class="tabs"
           :class="{ 'active-tab': tabIndex === index }"
           v-for="(item, index) in moreWall"
           :key="index"
           @click="changeTabIndex(index, item)">
        <el-tooltip class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top-end">
          <div class="titleBox">{{ item.name }}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="contendWrap">
      <tvWallSetTab></tvWallSetTab>
    </div>
  </div>
</template>
<script>
import tvWallSetTab from './tvWallSetTab'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    tvWallSetTab
  },
  data() {
    return {
      moreWall: [],
      tabIndex: 0
    }
  },
  computed: {
    ...mapState({
      createdState: ({ tvWall }) => tvWall.createdTvWallFloor // 接收传出来创建底板成功的状态
    })
  },
  watch: {
    createdState: function (newState, oldState) {
      if (newState) {
        this.refreshTVWallMenu(newState.id)
        // 必须再将当前电视墙信息广播出去
      } else {
      }
    }
  },
  methods: {
    ...mapMutations(['SET_TVWALLDATA1', 'SET_DELECT_STATE', 'SET_CREATED_FLOOR']),
    ...mapActions(['getTvWallMenuList']),
    // * 数据请求回来时，默认发送第一个电视墙的信息(数据请求回来时操作)
    getTvWallMenu() {
      this.getTvWallMenuList()
        .then(res => {
          if (res.data.code === 0) {
            this.moreWall = res.data.data.results
            this.SET_TVWALLDATA1(this.moreWall[0]) // 默认将第一个值传出去
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 刷新时，将当前电视墙信息公布出去
    refreshTVWallMenu(id) {
      this.getTvWallMenuList()
        .then(res => {
          if (res.data.code === 0) {
            this.moreWall = res.data.data.results
            this.moreWall.map((item, index) => {
              if (item.id === id) {
                this.SET_TVWALLDATA1(item) // 将当前电视墙信息传出去
                this.tabIndex = index
              }
            })
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 改变不同电视墙，发送点击电视墙的相关信息
    changeTabIndex(i, item) {
      this.tabIndex = i
      this.SET_TVWALLDATA1(item)
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
  mounted() {
    this.getTvWallMenu() // 页面加载完成，获取电视墙总信息列表
  },
  created() { },
  beforeDestroy() { }
}
</script>
<style lang="less" scoped>
.tv-body {
  // overflow: hidden;
  height: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

.tv-body .tabs {
  display: inline-block;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  border: 1px solid gainsboro;
  margin: 5px 0 5px 3px;
  line-height: 30px;
  height: 30px;
  border-radius: 5%;
  width: 110px;
  padding: 0 5px;
}
.tv-body .tabs .titleBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tv-body .tabs:hover {
  color: #4699f9;
}
.tv-body .tabs.active-tab {
  color: #ffffff;
  background-color: rgba(45, 114, 211, 1);
}
.tabWrap {
  height: 40px;
}
.contendWrap {
  flex: 1;
  overflow: hidden;
}
</style>
