<!--
 * @Author: fengbeibei
 * @Date: 2020-05-22 16:37:39
 * @LastEditTime: 2020-05-25 18:58:13
 * @LastEditors: liuxiaoting
 * @Description: 左侧面板导航-兴趣点(POI)
-->
<template>
  <div class="panel-poi">
    <el-input v-model="keywords" size="mini" class="search" placeholder="请输入内容">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch(keywords)" />
    </el-input>
    <div v-if="!searchResult">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="key">
          <div slot="title">
            机构与部位<i
              :class="['tltle-icon', activeName === 'key' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
            />
          </div>
          <el-row :gutter="8">
            <el-col :span="8" v-for="(item, index) in pointState.importPart" :key="item.id">
              <el-button
                plain
                :type="item.value ? 'primary' : ''"
                size="small"
                   :title=' item.label'
                @click="handleClickItem(item, index, $event)"
                >{{ item.label }}</el-button
              >
            </el-col>
            <el-col :span="8" v-for="(item, index) in pointState.keyParts" :key="item.id">
              <el-button
                plain
                   :title=' item.label'
                :type="item.value ? 'primary' : ''"
                size="small"
                @click="handleClickItem(item, index, $event)"
                >{{ item.label }}</el-button
              >
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="poi">
          <div slot="title">
            兴趣点<i
              :class="['tltle-icon', activeName == 'poi' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'].join(' ')"
            />
          </div>
          <el-tree
            :data="treeList"
            ref="tree"
            :props="defaultProps"
            node-key="id"
            show-checkbox
            accordion
            :default-checked-keys="checkPoi"
            @check-change="handleCheckChange"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div claas="searchRes" v-if="searchResult">
      <el-row :gutter="8">
        <el-col :span="12" v-for="(item, index) in importPartSearch" :key="item.id">
          <el-button
            plain
            :type="item.value ? 'primary' : ''"
            size="small"
            :title=' item.label'
            @click="handleClickItemSearch(item, index, $event)"
            >{{ item.label }}</el-button
          >
        </el-col>
        <el-col :span="12" v-for="(item, index) in keyPartsSearch" :key="item.id">
          <el-button
            plain
            :type="item.value ? 'primary' : ''"
            size="small"
               :title=' item.label'
            @click="handleClickItemSearch(item, index, $event)"
            >{{ item.label }}</el-button
          >
        </el-col>
        <el-col :span="12" v-for="(item, index) in checkPoiArr" :key="item.id">
          <el-button
            plain
            :type="item.value ? 'primary' : ''"
               :title=' item.label'
            size="small"
            @click="handleClickItemPoiSearch(item, index, $event)"
            >{{ item.label }}</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { map, cloneDeep } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { toTree } from '../utils'
// import { POITYPEALL } from 'src/assets/2DMap/meta/common'
import { getpoiTypeAll } from '@src/assets/2DMap/meta/poiTypeAll'
import { updateSetPoiInfoByLocalStorage } from '@src/store/modules/map2D/indexObj'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkPoi: [],
      keywords: '',
      searchResult: false,
      searchArr: null,
      activeName: 'key',
      pointState: {
        importPart: {
          // 重点部位
          headOffice: { label: '总行', value: true },
          tierOneBranch: { label: '一级分行', value: true },
          secondLevelBranch: { label: '二级分行', value: true },
          countyLevel: { label: '县级行', value: true },
          directlyBranch: { label: '直属支行', value: true }
        },
        keyParts: {
          // 重点部位
          businessOutlets: { label: '营业网点', value: false },
          vault: { label: '金库', value: false },
          computerRoom: { label: '计算机房', value: false },
          officeBuilding: { label: '办公楼', value: false },
          selfServiceBank: { label: '自助银行', value: false },
          selfServiceEquipment: { label: '自助设备', value: false },
          selfServiceSilver: { label: '自助银亭', value: false },
          privateBank: { label: '私人银行', value: false },
          safeDeposit: { label: '保险箱库', value: false },
          archivesCenter: { label: '档案室', value: false },
          remoteControlCenter: { label: '远程监控中心', value: false },
          fiveGSmartBanking: { label: '5G + 智能银行', value: false },
          fortuneCenter: { label: '财富中心', value: false },
          otherKeyParts: { label: '其他重点部位', value: false }
        }
      },
      importPartSearch: {},
      keyPartsSearch: {},
      checkPoiArr: []
    }
  },
  computed: {
    ...mapGetters('map2d/mapIndex', [
      'isMapOuter',
      'mapConfigArr',
      'loading',
      'administrativeAreaInfo',
      'selectPoiPoint',
      'checkedEquipmentsApply',
      'nowSelectAreaInfo'
    ]),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack']),
    treeList() {
      return toTree(this.TreeList(getpoiTypeAll()))
    },
    poiPointType() {
      return this.TreeList(getpoiTypeAll())
    },
    setCheckBox() {
      return this.selectPoiPoint
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler: function(newValue, oldValue) {
        this.nowSearchStr = newValue
        if (this.nowSearchStr !== '') {
          // this.searchResult = true
        } else {
          this.searchResult = false
        }
      }
    },
    checkedEquipmentsApply(newValue) {
      this.pointState = cloneDeep(newValue)
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setIsMapOuter',
      'setIsFloorMap',
      'setShowFloorInfo',
      'setSelectPoiPoint',
      'setCheckedEquipmentsApply'
    ]),
    // 点位类型点击事件
    handleClickItem(item, index) {
      item.value = !item.value
      let pointState = cloneDeep(this.checkedEquipmentsApply)
      pointState.keyParts = this.pointState.keyParts
      pointState.importPart = this.pointState.importPart
      // pointState.keyParts = this.keyParts
      this.setCheckedEquipmentsApply(pointState)
    },
    // 搜索结果出的机构与部位类型点击事件
    handleClickItemSearch(item, index) {
      item.value = !item.value
      let pointState = cloneDeep(this.checkedEquipmentsApply)
      if (pointState.importPart[`${item.key}`]) {
        pointState.importPart[`${item.key}`].value = item.value
      } else if (pointState.keyParts[`${item.key}`]) {
        pointState.keyParts[`${item.key}`].value = item.value
      }
      this.setCheckedEquipmentsApply(pointState)
    },
    // 页面加载选中之前的兴趣点勾选
    setDefaultChecked() {
      //  const checkIds = []
      // const checkPoi = this.selectPoiPoint.filter(item => {
      //   return item.value === true
      // }) //
      // checkPoi.forEach(item => {
      //   this.checkPoi.push(item.id)
      // })
      let userInfo = JSON.parse(sessionStorage.getItem('user'))
      const pageType = sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice' ? 'fireDevice' : 'allDevice'
      let poiPoint = localStorage.getItem(userInfo.id + '*selectPoiPoint*' + pageType)
      if (poiPoint) {
        this.checkPoi = poiPoint.split(',')
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkPoi) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
        })
      }
    },
    // 兴趣点选中值改变
    handleCheckChange() {
      let res = this.$refs.tree.getCheckedNodes()
      let pointSel = this.TreeList(getpoiTypeAll())
      res.forEach(item => {
        item.value = true
        pointSel.forEach(i => {
          if (i.id === item.id) {
            i.value = true
          }
        })
      })
      this.setSelectPoiPoint(pointSel)
    },
    // 兴趣点搜索出点击事件
    handleClickItemPoiSearch(item, index) {
      let pointSel = this.TreeList(getpoiTypeAll())
      item.value = !item.value
      pointSel.forEach(i => {
        if (i.id === item.id) {
          i.value = item.value
        }
      })
      this.setSelectPoiPoint(pointSel)
    },
    handleSearch(val) {
      if (val !== '') {
        this.searchResult = true
        this.handleClickInputSearch()
      } else {
        this.searchResult = false
        this.$notify({
          type: 'warning',
          title: '警告',
          message: '请输入关键字'})
      }
    },

    // 模糊检索
    handleClickInputSearch() {
      console.log(this.keywords)
      const importPartArray = map(this.importPart || {}, (o, k) => ({ key: k, ...o })) // 转换为数组
      const keyPartsArray = map(this.keyParts || {}, (o, k) => ({ key: k, ...o })) // 转换为数组
      const poiPointArr = this.TreeList(getpoiTypeAll())
      this.importPartSearch = importPartArray.filter(item => {
        return item.label.indexOf(this.keywords) !== -1
      }) //
      this.keyPartsSearch = keyPartsArray.filter(item => {
        return item.label.indexOf(this.keywords) !== -1
      })
      this.checkPoiArr = poiPointArr.filter(item => {
        return item.label.indexOf(this.keywords) !== -1 && item.id.length == '6'
      }) //
      console.log(this.checkPoiArr)
      this.$forceUpdate()
    },
    TreeList(arr) {
      let oneLevelArr = []
      let twoLevelArr = []
      let threeLevelArr = []
      for (let i = 0; i < arr.length; i++) {
        let element = arr[i]

        let oneArr = oneLevelArr.filter(item => {
          return element.poiCode.substr(0, 2) === item.id
        })
        // console.log(oneArr)
        if (oneArr && oneArr.length > 0) {
        } else {
          oneLevelArr.push({
            id: element.poiCode.substr(0, 2),
            level: 1,
            pid: '',
            label: element.oneType,
            value: false
          })
        }

        let twoArr = twoLevelArr.filter(item => {
          return element.poiCode.substr(0, 4) === item.id
        })
        if (twoArr && twoArr.length > 0) {
        } else {
          twoLevelArr.push({
            id: element.poiCode.substr(0, 4),
            level: 2,
            pid: element.poiCode.substr(0, 2),
            label: element.twoType,
            value: false
          })
        }

        threeLevelArr.push({
          id: element.poiCode,
          level: 3,
          pid: element.poiCode.substr(0, 4),
          label: element.threeType,
          poiCode: element.poiCode,
          value: false
        })
      }
      let NewArray = oneLevelArr.concat(twoLevelArr, threeLevelArr)
      return NewArray
    }
  },
  created() {
    this.pointState = cloneDeep(this.checkedEquipmentsApply)
    this.setDefaultChecked()
    this.$forceUpdate()

    // console.log('getpoiTypeAll', getpoiTypeAll())
  }
}
</script>

<style lang="less" scoped>
.panel-poi {
  .search {
    margin-bottom: 10px;
    /deep/ .el-select .el-input {
      width: 80px;
    }
    /deep/ .el-select input {
      padding-left: 8px;
    }
  }
  .el-button--primary {
    height: 35px;
  }
  .el-tree {
    background: transparent;
  }
  /deep/ .el-collapse-item__header .tltle-icon {
    margin-left: 8px;
  }
  /deep/ .el-collapse-item__header {
    height: 36px;
    line-height: inherit;
    background-color: inherit;
  }
  /deep/ .el-collapse-item__wrap {
    background-color: inherit;
  }
  /deep/ .el-button {
    height: 25px;
    width: 100%;
    margin: 4px 0px;
    padding: 4px 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /deep/ .el-button:active {
    height: 25px;
    width: 100%;
    margin: 4px 0px;
    padding: 4px 2px;
  }
}
/deep/.el-tree-node__content {
  border-left: 0;
}
</style>
