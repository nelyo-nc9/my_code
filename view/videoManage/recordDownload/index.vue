<template>
  <div class="record-download">
    <div class="down-left">
      <div class="down-left-top">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="机构" name="first">
            <treeBox
              ref="treeDiv"
              :lazyTreeApi="getLazyTree"
              :lazyTreeCheckApi="lazyTreeCheckApi"
              :customizeQuery="customizeQuery"
              :lazyTreeSearchApi="getLazyTreeSearchApi"
              searchType="search"
              treeLazyToggle
              iconToggle
              :checkboxToggle="true"
            >
              <template  slot-scope="{data}">
                <i class="iconfont icon-collection" title="快速收藏" v-if="data.tierType === 'res'"></i>
              </template>
            </treeBox>
          </el-tab-pane>
          <el-tab-pane label="收藏夹" name="second">
            <collectTree :getDataApi="getCollectApi" :postDataApi="postCollectApi" ref="fav" :showCreate="false" :checkboxToggle="true">
            <!-- <template  slot-scope="{data, node}">
              <i class="iconfont icon-delete" title="删除" v-if="iconList.includes('collection')" @click.stop="collectDelete(data,node)"></i>
            </template> -->
          </collectTree>
          </el-tab-pane>
        </el-tabs>
        <span class="refresh icon iconfont-ccb ccbicon" @click="refresh"></span>
      </div>
      <div class="down-left-bottom">
        <p>查询条件</p>
        <div class="leftBottom">
          <div class="checkBox">
            <el-radio v-model="selectRadio" :label="'vedio'">录像</el-radio>
            <el-radio v-model="selectRadio" :label="'picture'">图片</el-radio>
          </div>
          <div class="condition">
            <span>文件类型</span>
            <el-select v-model="value" placeholder="请选择" style="width:170px;" size="mini">
              <el-option
                v-for="item in videoTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="condition">
            <span>开始时间</span>
            <BSdateRange
              @timeChange="startTimeChange"
              :upside="true"
              :datetime="startDate"
              :width="170"
              :height="26"
            ></BSdateRange>
          </div>
          <div class="condition">
            <span>结束时间</span>
            <BSdateRange
              @timeChange="endTimeChange"
              :upside="true"
              :datetime="endDate"
              :width="170"
              :height="26"
            ></BSdateRange>
          </div>
          <el-button
            class="search-click"
            type="primary"
            size="mini"
            width="70px"
            @click="searchClick"
          >检索</el-button>
        </div>
      </div>
    </div>
    <div class="down-right">
      <DownRight :isCenter="isCenter" :searchType="value"  ref="dR"></DownRight>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import BSdateRange from './compoents/BSdateRange.vue'
import DownRight from './downRight.vue'
import treeBox from '@src/components/tree/treeBox'
import collectTree from '@src/components/collectTree'
import { getTreeApi, getLazyTreeApi, searchTree, getCollectList, postCollect } from '@src/http/video/videoPreview.api.js'
// import {
//   getQianDuanList,
//   checkVideoList,
//   byteConversion,
//   formatRecordType
// } from '../playback/playBackPlugin/playback.js'
export default {
  name: 'recordDownload',
  components: {
    DownRight,
    BSdateRange,
    treeBox,
    collectTree
  },
  data() {
    return {
      customizeQuery: {
        params: {
          subSystem: 1,
          isRecursion: 0, // 懒加载和递归树都设成1
          channelType: 1
        }
      },
      selectRadio: 'vedio', // picture：选中图片   vedio：选中录像  默认选中录像  给record/frontdevSearch中streamType传值，现在接口只支持查询录像，不支持查图片
      // picSelect: false, // 选中图片
      // recSelect: false, // 选中录像
      startDate: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(), // 开始时间
      endDate: new Date(), // 默认结束时间
      value: 'all', // 选中值
      videoTypeList: [
        { value: 'all', label: '全部' },
        { value: 'manualRecord', label: '手动录像' },
        { value: 'timeRecord', label: '定时录像' },
        { value: 'eventRecord', label: '事件录像' },
        { value: 'intelligentRecord', label: '智能录像' }
      ], // 文件类型
      isCenter: false, // 是中心还是前端回放
      activeName: 'first' // 默认选中的tab
      // searchType: ''
    }
  },
  created() {},
  methods: {
    // 机构树的刷新函数
    async refresh() {
      let status = await this.$refs.treeDiv.refresh()
      if (status === 1) {
        this.$message('刷新成功')
      } else {
        this.$message('列表刷新失败')
      }
    },
    // 获取机构树的函数
    lazyTreeCheckApi(pObj) {
      let params = {
        ...pObj,
        isRecursion: 1
      }
      return getTreeApi(params)
    },
    getLazyTree(params) {
      return getTreeApi(params)
    },
    // 获取收藏夹
    getCollectApi(params) {
      return getCollectList(params)
    },
    postCollectApi(params) {
      return postCollect(params)
    },
    // tab切换
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 开始时间发生改变函数
    startTimeChange(val) {
      this.startDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.endDate = this.startDate
      }
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 1,
        key: params.search
      }
      return searchTree(params)
    },
    // 结束时间发生改变函数
    endTimeChange(val) {
      this.endDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.startDate = this.endDate
      }
    },
    // 点击搜索
    searchClick() {
      // this.searchType = this.selectRadio===''vedio''? 'main':'pic';
      if (this.selectRadio === 'picture') {
        // 此处弹窗
        this.$message('目前尚未支持查询图片，请查询录像！')
        return
      }
      // if (this.value !== 'all' && this.value !== 'timeRecord') {
      //   this.$message('目前前端录像仅支持查询定时和全部录像')
      //   return
      // }
      // this.searchType = this.value // 查询录像类型
      this.$refs.dR.getDataFromIndex(this.startDate, this.endDate)
    }
  }
}
</script>
<style  lang="less">
</style>
<style lang="less" scoped>
.record-download {
  display: flex;
  height: 100%;
  .down-left {
    width: 300px;
    min-width: 292px;
    height: 100%;
    box-sizing: border-box;
    padding: 0px 10px 0px 0px;
    position: relative;
    .refresh {
      position: absolute;
      top: 13px;
      right: 30px;
      z-index: 2;
    }
    .down-left-top {
      height: calc(~'100% - 280px');
      /deep/ .el-tabs.el-tabs--card.el-tabs--top {
        height: 100%;
        .el-tabs__content {
          height: calc(~"100% - 56px");
          .el-tab-pane {
            height: 100%;
          }
        }
      }
      /deep/ .treeBox .treeInfo {
        width: calc(~"100% - 50px");
        &[name='res'] span.treeText {
          max-width: calc(~'100% - 35px');
        }
      }
    }
    .down-left-bottom {
      height: 280px;
      min-height: 280px;
      .leftBottom {
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        .checkBox {
          margin-left: 38px;
        }
      }
      .search-click {
        margin-top: 25px;
      }
      p {
        text-align: center;
        color: #333;
        height: 30px;
        line-height: 30px;
        background: #eee;
      }
      .condition {
        height: 24px;
        margin: 10px 0;
        width: 100%;
      }
      .condition > * {
        display: inline-block;
      }
      .condition > span {
        width: 65px;
        line-height: 24px;
        color: #333;
      }
    }
  }
  .down-right {
    flex: 1;
    overflow: hidden;
  }
}
</style>
