<template>
  <div class="alarm-main">
    <div class="left-tabs"
         :style="{width: isOpenPanel ? '240px' : '28px'}">
      <div class="arrow"><i :class="isOpenPanel ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
           @click="togglePanel"></i></div>
      <div class="menu-content"
           v-show="isOpenPanel">
        <dl v-for="item in tabs"
            :key="item.index">
          <div>
            <dt @click="changeTab(item.index)">{{item.label}}</dt>
            <dd v-for="val in item.items"
                :key="val.index"
                :class="{active: componentId === val.index}"
                @click="changeTab(val.index)">{{val.label}}</dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="right-content">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script>
import fireFightingSubsystemManagement from './page/assessmentRanking'
import evaluationRankingRules from './page/evaluationRankingRules'
import fireFightingList from './page/fireFightingList'
import comprehensiveQuery from './page/comprehensiveQuery'
import assessmentReports from './page/assessmentReports'
import assessmentReport from './page/assessmentReport'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  components: {
    fireFightingSubsystemManagement,
    fireFightingList,
    evaluationRankingRules,
    comprehensiveQuery,
    assessmentReports,
    assessmentReport
  },
  data() {
    return {
      tabs: [{
        index: 'evaluationRankingRules',
        label: '消防评估',
        items: [{
          index: 'evaluationRankingRules',
          label: '评估排名'
        }, {
          index: 'fireFightingList',
          label: '手动生成评估报告'
        }, {
          index: 'comprehensiveQuery',
          label: '综合查询'
        }]
      }],
      isOpenPanel: true
    }
  },
  watch: {
    isNewFile: function(newVale, oldValue) {
      if (newVale) {
        this.SET_COMPONENT_ID(newVale)
      }
    }
  },
  computed: {
    ...mapState('assessment', {
      componentId: 'componentId',
      isNewFile: 'isNewFile'
    })
  },
  methods: {
    ...mapMutations('assessment', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    changeTab(index) {
      // console.log(this.SET_COMPONENT_ID)
      this.SET_COMPONENT_ID(index)
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    }
  }
}
</script>

<style lang="less" scoped>
    .alarm-main {
        width: 100%;
        height: 100%;
        padding: 10px 0;
        display: flex;
        .left-tabs {
            height: 100%;
            .arrow {
                height: 32px;
                line-height: 32px;
                font-size: 16px;
                text-align: right;
                i {
                    cursor: pointer;
                    &:hover {
                        color: #538bda;
                    }
                }
            }
            .menu-content {
                font-size: 14px;
                dt {
                    background: #f2f2f2;
                    height: 32px;
                    line-height: 32px;
                    padding-left: 10px;
                    cursor: pointer;
                    &:hover {
                        background: #dff5fc;
                    }
                }
                dd {
                    background: #f8f8f8;
                    height: 32px;
                    line-height: 32px;
                    padding-left: 20px;
                    margin-inline-start: 0px;
                    border-top: 1px solid #ffffff;
                    cursor: pointer;
                    &:hover {
                        color: #538bda;
                    }
                }
                .active {
                    color: #538bda;
                    border-left: 2px solid #2d72d3;
                }
            }
        }
        .right-content {
            flex: 1;
            height: 100%;
            background: #fff;
        }
        .el-menu {
            background-color: #eee;
        }
    }
</style>