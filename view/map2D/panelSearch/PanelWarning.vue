<!--
 * @Author: fengbeibei
 * @Date: 2020-05-19 14:56:13
 * @LastEditTime: 2020-06-04 18:17:26
 * @LastEditors: fengbeibei
 * @Description: 左侧导航面板组件  fjosdjosjdosijdo
-->
<template>
  <div class="navigation"  v-if="showAlarmFloors" >
    <div class="Building">
           <i
      class="icon iconfont icon-loufangdianwei " ></i>
        {{floorsData.keyPartName}}
    </div>
     <ul class="fools">
       <li v-for="(item,index ) in floors" :key ="index" @click="setFloorMap(item)">
       {{item.floorIndex}}
       <span class="wake"  v-if="Boolean(checkFloorWake(item.id))" ></span>
       </li>
     </ul>
  </div>
</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { map, filter, cloneDeep, clone } from 'lodash'
export default {
  name: 'panel-warning',
  computed: {
    ...mapState({
      alarmSetting: ({ map2d }) => map2d.mapIndex.alarmSetting, // 接警相关信息
      isMapOuter: ({ map2d }) => map2d.mapIndex.isMapOuter, // 1:动态地图，2：静态地图
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap, // 楼内地图对象
      floorsPanelObj: ({ map2d }) => map2d.mapIndex.floorsPanelObj, // 报警楼层索引对象           //调api  设置 setFloorsPanelObj           //  直接设置空 SET_FLOORS_PANEL_OBJ
      showLeftFloorInfo: ({ map2d }) => map2d.mapIndex.showLeftFloorInfo // 报警楼层索引面板是否显示     //  对应设置方法 UPDATE_SHOW_LEFT_FLOOR_INFO

    }),
    ...mapGetters('map2d/mapIndex', ['isShowPanelTools', 'currPanelToolComponent', 'setIsMapEdit']),
    listencurrPanelToolComponent() {
      return this.currPanelToolComponent
    }
  },
  data() {
    return {
      showAlarmFloors: false,
      floorsData: {
        keyPartName: '',
        orgName: '',
        floors: []
      },
      floors: [{
        formIndex: '1'
      }]
    }
  },
  watch: {
    floorsPanelObj: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          // console.log('新的面板数据', newValue)
          const data = cloneDeep(this.floorsPanelObj)
          this.floorsData = data
          this.floors = data.floors
          this.showAlarmFloors = true
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['updateShowLeftFloorInfo', 'setPanelInfoStatus', 'setFloorsPanelObj', 'setIsMapOuter', 'setIsFloorMap']),
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']),
    setFloorMap(item) {
      if (item.id !== this.floorMap.id) {
        this.UPDATE_INDOOR_LAYER_CONFIG({
          key: 'url',
          value: item.image
        })

        let data = {
          envImageData: null,
          floorsImageDate: item,
          id: item.id,
          isFloor: true,
          envId: ''
        }
        this.setIsMapOuter(2)
        this.setIsFloorMap(data)
      }
    },
    // 判断是否闪烁
    checkFloorWake(id) {
      if (this.alarmSetting.isReceive) {
        let arr = cloneDeep(this.alarmSetting.alarmPushInfo)
        let res = filter(arr, v => id === v.floorId)
        if (res.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 左侧导航及菜单
.navigation {
  display: inline-block;
  height: 100%;
  width: 260px;
  position: relative;
  padding: 8px;
  top: 0px;
  overflow-y: scroll;
  background: rgba(255,255,255,0.85);
  > *:not(:last-child) {
    margin-top: 8px;
  }
.Building{
  padding-left: 10px;
  .icon-loufangdianwei{
    color: #2d72d3;
    font-size: 16px;
  }
}
.fools{
padding-left: 50px;
li {
  height: 30px;
  line-height: 30px;
  position: relative;
}
}
}
</style>
<style>

@keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0;
    }
    to {
        opacity: 1.0;
    }
}

@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0;
    }
    to {
        opacity: 1.0;
    }
}
.wake {
    background: #ff0000;
   display: inline-block;
    position: absolute;
    right: 40px;
    top:10px;
    width: 12px;
    height:12px;
    border-radius: 50%;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}

</style>
