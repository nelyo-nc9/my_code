<!--
 * @Description: 机构重点部位树
 * @Author: zuoshaohua
 * @Date: 2020-07-01 11:57:43
 * @LastEditTime: 2020-07-01 11:57:43
 * @LastEditors: zuoshaohua
-->
<template>
  <div class="tree">
    <!-- 机构重点部位设备资源树 -->
    <treeBox
      ref="tree"
      v-if="treeToogle !== 0"
      :lazyTreeApi="getTreeApi"
      :treeType="treeState"
      @onceClick="handleClick"
      :customizeQuery="customizeQuery"
      treeLazyToggle
    >
      <template slot-scope="{ data, node }">
        <i class="iconfont icon-loufangdianwei" v-if="data.hasEnvImage" title="平面图" @click="changeBuildingMap()"></i>
      </template>
    </treeBox>
  </div>
</template>
<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi } from '@src/http/map2D/index.js'
import { GEOMETRYTYPE, KEYPARTTYPE, DEVICETYPE, VIDEOTYPEKEY } from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'PanelSearchTreeBox',
  data() {
    return {
      timer: '',
      treeToogle: 1,
      iconList: ['edit', 'collection', 'info', 'poll', 'expand'],
      customizeQuery: {
        // 机构树传参
        params: {
          type: 0,
          oId: '340000000', // 机构id
          subSystem: this.selectType,
          isRecursion: '0'
        }
      }
    }
  },
  props: {
    selectType: {
      type: String,
      default: ''
    },
    treeState: {
      type: String,
      default: ''
    },
    equipment: {
      type: String,
      default: ''
    }
  },
  watch: {
    selectType: {
      immediate: true,
      handler: function(newValue, oldValue) {
        if (newValue != oldValue) {
          this.treeToogle = 0
          setTimeout(() => {
            this.customizeQuery.params.subSystem = newValue
            console.log(this.customizeQuery)
            this.getTreeApi(this.customizeQuery.params)
            this.treeToogle = 1
          }, 0)
        }
      }
    }
  },
  components: { treeBox },
  computed: {
    ...mapState({
      selectedTreeNode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeNode, // 当前选中的树节点
      importPartResource: ({ map2d }) => map2d.mapPoint.importPartResourceArr, // 重点部位 资源数组

      headLevelResource: ({ map2d }) => map2d.mapPoint.headLevelResourceArr, // 重点部位 总行  资源数组
      oneLevelResource: ({ map2d }) => map2d.mapPoint.oneLevelResourceArr, // 重点部位 一行  资源数组
      twoLevelResource: ({ map2d }) => map2d.mapPoint.twoLevelResourceArr, // 重点部位 二行  资源数组
      countryLevelResource: ({ map2d }) => map2d.mapPoint.countryLevelResourceArr, // 重点部位 县行  资源数组
      directlyLevelResource: ({ map2d }) => map2d.mapPoint.directlyLevelResourceArr, // 重点部位 直属行  资源数组
      resourceTree: ({ map2d }) => map2d.mapPanelSearch.resourceLists // 资源树
    }),
    ...mapState('map2d/mapIndex', ['mapToolbarStatus', 'isMapEdit']),
    ...mapGetters('map2d/mapPanelSearch', ['floorList'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo']),
    ...mapActions('map2d/mapPanelSearch', ['setSelectedTreeNode']),
    ...mapActions('map2d/mapIndex', ['setCheckedEquipments']),
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setPanelInfoStatus', 'setPanelInfoEditStatus']),
    preview(val) {
      let data = {
        channel: val.channel,
        devIp: val.ip,
        devPort: val.cPort,
        dport: val.dPort,
        streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2'
      }
      this.$refs.preview.openPreview(data)
    },
    treeRefresh() {
      // 树刷新
      console.log('112')
      //  this.timer = new Date().getTime()
      this.$refs.tree.refresh()
    },
    handleClick(data) {
      console.log(data)
      let getPointFun = this.getCommonResourceById
      if (data.isRoot) {
        // 如果点击根节点  地图恢复初始状态
        console.log('恢复地图初始状态')
      }
      if (data.point) {
        const loc = data.point.coordinate.split(',').map(item => Number(item))
        window.$context2D.map.getView().setCenter(loc)
        // window.$context2D.map.getView().setZoom(10)
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 设备按钮开关
    filterIconEqu(val) {
      return val.tierType === 'equ'
    },
    // 资源按钮开关
    filterIconRes(val) {
      return val.tierType === 'loc'
    },
    aaa(data, node) {
      // console.log(data, node)
    },
    /**
     * 判断点击机构，重点部位，资源，设备树的类型，返回相应的参数
     * @param {*} maintype 主类
     * @param {*} type 子类型
     * @param {*} monitype RESOURCETYPE中对应的资源类型
     */
    getIconStyleType(type, monitype) {
      // 重点部位点位绘制
      let style = 'importPartDraw' // 设置鼠标样式 对应drawStyle.js文件中的key值
      let key = '1' // 重点部位子类型key值 对应KEYPARTTYPE
      let resourceType = 'importPart' // 设置资源数组类型
      let resource // 需要修改的资源数组
      if (type === DEVICETYPE.org) {
        // 机构
        style = 'importPartDraw'
        key = '1'
        resourceType = 'importPart'
        if (type === KEYPARTTYPE.headLevel) {
          style = 'importPartDraw'
          key = '1'
          resourceType = 'importPart'
        } else if (type === KEYPARTTYPE.oneLevel) {
          style = 'importPartDraw'
          key = '2'
          resourceType = 'importPart'
        } else if (type === KEYPARTTYPE.twoLevel) {
          style = 'importPartDraw'
          key = '3'
          resourceType = 'importPart'
        } else if (type === KEYPARTTYPE.countyLevel) {
          style = 'importPartDraw'
          key = '4'
          resourceType = 'importPart'
        } else if (type === KEYPARTTYPE.directlyLevel) {
          style = 'importPartDraw'
          key = '5'
          resourceType = 'importPart'
        }
      } else if (type === DEVICETYPE.keyPart) {
        // 重点部位
      } else if (type === DEVICETYPE.video) {
        // 视频设备
        key = '1'
        if (monitype === VIDEOTYPEKEY.boltipc) {
          style = resourceType = 'boltipc'
        } else if (monitype === VIDEOTYPEKEY.redBoltipc) {
          style = resourceType = 'redBoltipc'
        } else if (monitype === VIDEOTYPEKEY.halfBallipc) {
          style = resourceType = 'halfBallipc'
        } else if (monitype === VIDEOTYPEKEY.fastBallipc) {
          style = resourceType = 'fastBallipc'
        } else if (monitype === VIDEOTYPEKEY.allViewipc) {
          style = resourceType = 'allViewipc'
        } else if (monitype === VIDEOTYPEKEY.pinholeipc) {
          style = resourceType = 'pinholeipc'
        } else if (monitype === VIDEOTYPEKEY.smartIPC) {
          style = resourceType = 'intelligentipc'
        }
      } else if (type === DEVICETYPE.recorderVideo) {
        style = 'commonAlarm'
        key = '2'
        resourceType = 'recorderVideo'
      } else if (type === DEVICETYPE.commonAlarm) {
        // 报警设备
        if (monitype === ALARMDEVICETYPE.telephoneHost) {
          style = 'commonAlarm'
          key = '3'
          resourceType = 'commonAlarm'
        } else if (monitype === ALARMDEVICETYPE.networkHost) {
          style = 'alarmHost'
          key = '3'
          resourceType = 'commonAlarm'
          resource = this.detectorAlarmResource
        }
      } else if (type === DEVICETYPE.fireAlarm) {
        // 消防设备
        style = 'boltipc'
        key = '4'
      } else if (type === DEVICETYPE.speech) {
        // 对讲主机
        if (monitype === INTERCOMTYPE.speechHost) {
          style = 'speechDraw'
          resourceType = 'speech'
          key = '5'
        } else if (monitype === INTERCOMTYPE.speechChannel) {
          // 对讲通道
          style = 'speechDraw'
          resourceType = 'speechChannel'
          key = '5'
        }
      } else if (type === DEVICETYPE.doubleDoor) {
        // 互锁门
        style = 'doubleDoorDraw'
        key = '7'
        resourceType = 'doubleDoor'
      } else if (type === DEVICETYPE.doorControl) {
        if (monitype === ACCESSDEVICETYPE.doorControlHost) {
          style = 'doorControlDraw'
          key = '6'
          resourceType = 'doorControl'
        } else if (monitype === ACCESSDEVICETYPE.doorControlChannel) {
          style = 'doorControlDraw'
          key = '6'
          resourceType = 'doorControlChannel'
        }
      } else if (type === DEVICETYPE.protectiveTank) {
        if (monitype === CABINTYPE.doorControlHost) {
          style = 'boltipc'
          key = '8'
        } else if (monitype === CABINTYPE.doorControlChannel) {
          style = 'boltipc'
          key = '8'
        }
      }
      resource = resource
        ? JSON.parse(JSON.stringify(resource))
        : JSON.parse(JSON.stringify(this[resourceType + 'Resource']))
      return {
        style,
        key,
        resource: resource,
        type: resourceType
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tree {
  background: transparent;
}
/deep/ .treeBox .treeInfo {
  &[name='equ'] span.treeText {
    max-width: calc(~'100% - 94px');
  }
  &[name='res'] span.treeText {
    max-width: calc(~'100% - 58px');
  }
}
</style>
