<template>
  <div class="left-con">
    <div class="foldWrap">
      <div class="foldTop">
        <div class="tabs"
             :class="{ 'active-tab': changPage === index }"
             v-for="(label, index) in tabLabels"
             :key="label"
             @click="changeContenMethod(label, index)">
          {{ label }}
        </div>
      </div>
      <div class="foldContend"
           v-if="contendFlag">
        <div class="tab-pane"
             v-if="changPage === 0">
          <organization v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></organization>
        </div>
        <div class="tab-pane"
             v-if="changPage === 1">
          <favorites v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></favorites>
        </div>
        <div class="tab-pane"
             v-if="changPage === 2">
          <partition v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></partition>
        </div>
        <div class="tab-pane"
             v-if="changPage === 3">
          <polling ref="polling"
                   v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></polling>
        </div>
        <div class="tab-pane"
             v-if="changPage === 4">
          <scene v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></scene>
        </div>
      </div>
      <div class="foldTop">
        <div class="tabs1"
             :class="{ 'active-tab': changPage1 === index }"
             v-for="(label, index) in tabLabels2"
             :key="label"
             @click="changeContenMethod(label, index)">
          {{ label }}
        </div>
      </div>
      <div class="foldContend"
           v-if="!contendFlag">
        <div class="tab-pane"
             v-if="changPage1 === 0">
          <plan v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></plan>
        </div>
        <div class="tab-pane"
             v-if="changPage1 === 1 && tabLabels2.length != 2">
          <localTerminal v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></localTerminal>
        </div>
        <div class="tab-pane"
             v-if="changPage1 === 2 && tabLabels2.length != 2">
          <layout v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></layout>
        </div>
        <div class="tab-pane"
             v-if="changPage1 === 1 && tabLabels2.length == 2">
          <channel v-if="tvWallData.rtlayout&& tvWallData.rtlayout.row&&tvWallData.rtlayout.column"></channel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import favorites from './favorites'
import organization from './organization'
import partition from './partition'
import polling from './Tvpolling'
import scene from './scene'
import plan from './plan'
import layout from './layOut.vue'
import channel from './channel'
import localTerminal from './localTerminal'
import { mapMutations, mapState } from 'vuex'
export default {
  components: {
    favorites,
    organization,
    polling,
    scene,
    plan,
    layout,
    partition,
    channel,
    localTerminal
  },
  data() {
    return {
      key: '1',
      tabLabels: ['机构', '收藏夹', '分区', '轮巡', '场景'],
      tabLabels2: ['预案'],
      changPage: 0,
      changPage1: '',
      contendFlag: true
    }
  },
  computed: {
    ...mapState({
      tvWallData: ({ tvWall }) => tvWall.allTvWallList // 接受电视墙发送出来的信息
    })
  },
  watch: {
    tvWallData: function (newmess, oldmess) {
      if (this.contendFlag) {
        // this.changPage = 0
      } else if (newmess.type === 1) {
        if (newmess.type === oldmess.type) {
          console.log('两次电视墙属性一致')
        } else {
          // 从拼控一体机电视墙切换到普通电视墙时
          this.changPage1 = ''
          this.changPage = 0
          this.contendFlag = true
        }
      }
      this.changeTabels()
    }
  },
  methods: {
    ...mapMutations(['SET_TABLE_INDEX1']),
    changeContenMethod(val, index) {
      // 左侧菜单上下滑动
      if (val === '机构' || val === '分区' || val === '轮巡' || val === '场景' || val === '收藏夹') {
        this.contendFlag = true
        this.changPage1 = ''
        this.changPage = index
        // if (val === '轮巡') {
        //   if (this.tvWallData.rtlayout && this.tvWallData.rtlayout.row && this.tvWallData.rtlayout.column && this.changPage === 3) {
        //     this.$refs.polling.getPollingListFun()
        //   }
        // }
      } else {
        this.contendFlag = false
        this.changPage1 = index
        this.changPage = ''
      }
    },
    /**
   *  判断该电视墙是什么类型的电视墙
   * tvWallData.type === 1(M3) || tvWallData.type === 4(M3+b20) 电视墙没有本地终端输入和布局
   * tvWallData.type === 2(b20) 拼控一体电视墙没有通道关联
   * */
    changeTabels() {
      if (this.tvWallData.type === 1 || this.tvWallData.type === 4) {
        this.tabLabels2 = ['预案']
        this.tabLabels2 = this.tabLabels2.concat(['通道管理'])
      } else if (this.tvWallData.type === 2) {
        this.tabLabels2 = ['预案', '本地终端输入', '布局']
      }
    }
  },
  mounted() {
    this.changeTabels()
  },
  created() {

  }
}
</script>
<style scoped>
.foldWrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.foldTop {
  height: 38px;
  background: #999999;
  border-bottom: 1px solid gainsboro;
}
.foldContend {
  flex: 1;
  overflow: hidden;
}

.left-con .tabs.active-tab {
  color: #fff;
  background: #2d72d3;
}
.left-con .tabs1.active-tab {
  color: #fff;
  background: #2d72d3;
}
.left-con {
  width: 340px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-left: 5px;
}
.fresh-con {
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  color: #fff;
  z-index: 2;
  background-color: #2d72d3;
  width: 34px;
  height: 40px;
  line-height: 38px;
  text-align: center;
}
.left-con .tabs-box {
  height: 38px;
  background-color: #2d72d3;
}
.left-con .tabs {
  width: 67px;
  display: inline-block;
  padding: 11px 10px;
  cursor: pointer;
  text-align: center;
}
.left-con .tabs1 {
  width: 92px;
  display: inline-block;
  padding: 11px 10px;
  cursor: pointer;
  text-align: center;
}

.tab-pane {
  width: 100%;
  height: 100%;
  flex: 1;
}
.tabs:hover {
  color: #4699f9;
}
.tabs1:hover {
  color: #4699f9;
}
</style>
