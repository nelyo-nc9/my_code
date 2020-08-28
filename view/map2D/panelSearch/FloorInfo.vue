<!--
 * @Author: fengbeibei
 * @Date: 2020-05-25 20:04:48
 * @LastEditTime: 2020-05-25 20:29:54
 * @LastEditors: fengbeibei
 * @Description: 楼层索引
-->
<template>
  <el-card class="info">
    <div slot="header" >
      <span>楼层索引</span>
      <el-button type="text" @click="handleClickCardExtra" class="back">返回</el-button>
    </div>
     <!-- 当前平面图对象是机构 -->
    <el-table :data="tableData" size="mini" border style="width: 100%"  v-if="showOrg">
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column  prop="value"  :formatter="formatterValue" label="值" />
       </el-table-column>
    </el-table>
    <!-- 当前平面图对象是重点部位 -->
      <el-table :data="tableData2" size="mini" border style="width: 100%"  v-if="!showOrg">
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column  prop="value"  :formatter="formatterValue" label="值" />
       </el-table-column>
    </el-table>
    <div class="index">
      <el-tag v-for="item in floorList" :key="item.key" effect="plain" size="small" @click="planeMap(item)">
        {{ item.floorIndex }}
      </el-tag>
      </div>
  </el-card>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      currFloor: null, // 当前楼层
      showList: false,
      showOrg: true,
      // 楼层信息表数据
      tableData: [
        { name: '机构名称', value: 'name' },
        { name: '机构地址', value: 'address' },
        { name: '分管领导', value: 'functionary' },
        { name: '分管领导电话', value: 'mobile' },
        { name: '机构电话', value: 'telephone' },
        { name: '上级机构', value: 'parentName' }
      ],
      // 楼层信息表数据
      tableData2: [
        { name: '重点部位名称', value: 'name' },
        { name: '重点部位地址', value: 'address' },
        { name: '部位电话', value: 'telephone' },
        { name: '重点部位负责人', value: 'principal1' },
        { name: '负责人电话', value: 'principalPhone1' },
        { name: '所属机构', value: 'orgName' }
      ],
      // 楼层列表
      floorList: [
      ],
      formData: null
    }
  },
  watch: {
    listenFloorMap: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          if (newValue.pointObj) {
            this.floorList = cloneDeep(newValue.pointObj.floors)
            if (newValue.pointObj.type === 1) {
              this.showOrg = true
              this.formData = cloneDeep(newValue.pointObj.org)
            } else if (newValue.pointObj.type === 2) {
              this.showOrg = false
              this.formData = cloneDeep(newValue.pointObj.keyPart)
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {
    // ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setPanelInfoFormData', 'setDrawActive']),
    ...mapState({
      floorMap: ({ map2d }) => map2d.mapIndex.floorMap
    }),
    ...mapGetters('map2d/mapIndex', ['isMapOuter', 'mapConfigArr', 'loading', 'showFloorInfo' ]),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack']),

    listenFloorMap() {
      return this.floorMap
    }
  },
  // created() {
  //   let buildingMap = cloneDeep(this.floorMap)
  //   console.log('buildingMap')
  // },
  methods: {
    ...mapMutations('map2d/mapIndex', ['UPDATE_INDOOR_LAYER_CONFIG', 'UPDATE_OUTDOOR_LAYER_CONFIG']),
    ...mapActions('map2d/mapIndex', ['setIsMapOuter', 'setIsFloorMap', 'setShowFloorInfo']),
    // 切换楼内地图  只需改变id  改变地图底图   pointObj  不变
    planeMap(val) {
      this.setIsMapOuter(2)
      let obj = cloneDeep(this.floorMap)
      obj.id = val.id
      this.setIsFloorMap(obj)
      this.UPDATE_INDOOR_LAYER_CONFIG({
        key: 'url',
        value: val.image
      })
      // console.log(this.$store.state.map2d.mapIndex)
    },
    // 处理楼层信息卡片退出按钮
    handleClickCardExtra() {
      let data = {
        pointObj: null,
        envImageData: null,
        floorsImageDate: null,
        // 楼内地图对象
        isFloor: false, // ture 室内 false 环境
        id: '0',
        envId: ''
      }
      this.setIsFloorMap(data)
      this.setIsMapOuter(1)
      this.setShowFloorInfo(false)
    },
    formatterValue(row, column, cellValue, index) {
      return this.formData[cellValue]
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  position: absolute;
  margin-top: 20px;
  margin-bottom: 10px;
  background: #fff;
  width: 100%;
  /deep/ .el-card__header {
    padding: 8px 8px;
    /deep/ .back {
      float: right;
      padding: 3px 0px;
    }
  }
  /deep/ .el-card__body {
    padding: 8px;
  }
  /deep/ .el-card__body > *:not(:last-child) {
    margin-bottom: 8px;
  }
  /deep/ .el-table {
    background-color: initial;
    color: inherit;
    /deep/ thead {
      display: none;
    }
    /deep/ th,
    tr {
      background-color: initial;
    }
    /deep/ tbody tr td:first-child {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
  .index {
    // margin-top: 10px;
    text-align: right;
    width: 100%;
    padding-bottom: 10px;
     display: flex;
    overflow-x: scroll;
      .el-tag{
         float: left;
      }
      > *:not(:last-child) {
        float: left;
      margin-right: 8px;
    }
    /deep/ .el-tag:hover {
      cursor: pointer;
    }
  }
}

</style>
