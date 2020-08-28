<template>
  <div class="distance">
    <div class="query-form">
      <div class="from-box">
        <div class="form-name" :title="form.start">
          <span class="lable-name">起点</span>
          <el-input v-model="form.start"></el-input>
          <i
            class="el-icon-edit-btn"
            title="点选起点"
            :style="{backgroundColor:bColor1}"
            @click="handleClickBoxSelect('Point1')"
          ></i>
        </div>
        <div class="form-name" :title="form.channel">
          <span class="lable-name">途经点</span>
          <el-input v-model="form.channel"></el-input>
          <i
            class="el-icon-edit-btn"
            title="点选途径点"
            :style="{backgroundColor:bColor2}"
            @click="handleClickBoxSelect('Point2')"
          ></i>
        </div>
        <div class="form-name" :title="form.end">
          <span class="lable-name">终点</span>
          <el-input v-model="form.end"></el-input>
          <i
            class="el-icon-edit-btn"
            title="点选终点"
            :style="{backgroundColor:bColor3}"
            @click="handleClickBoxSelect('Point3')"
          ></i>
        </div>
      </div>
      <div class="icon-button" @click="save()">
        <div>
          <i class="el-icon-finished"></i>
        </div>
      </div>
    </div>
    <div class="result-table">
      <el-table
        :data="tableData"
        stripe
        height="200px"
        style="width: 90%;background-color:'rgba(0,0,0,0)'"
      >
        <el-table-column prop="text" label="途径" width="170px"></el-table-column>
        <el-table-column prop="length" label="距离(米)"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { getRouteFeaturesData } from './../../../assets/2DMap/utils/routePlan'
import { getPorvinceInfoByAdcode } from './../../../assets/2DMap/utils/porvinceInfo'

export default {
  data() {
    return {
      bColor1: 'rgba(0,0,0,0)',
      bColor2: 'rgba(0,0,0,0)',
      bColor3: 'rgba(0,0,0,0)',
      form: {
        start: '',
        channel: '',
        end: ''
      },
      tableData: []
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['drawActive', 'currDrawType', 'routePlanInfo', 'isRealData']),
    ...mapGetters('map2d/mapIndex', ['mapToolbarStatus', 'nowSelectAreaInfo'])
  },
  mounted() {
    console.log('组件消耗')
    this.bColor1 = 'rgba(0,0,0,0)'
    this.bColor2 = 'rgba(0,0,0,0)'
    this.bColor3 = 'rgba(0,0,0,0)'
    this.setRoutePlanInfo({})
  },
  destroyed() {
    this.bColor1 = 'rgba(0,0,0,0)'
    this.bColor2 = 'rgba(0,0,0,0)'
    this.bColor3 = 'rgba(0,0,0,0)'
    this.setRoutePlanInfo({})
    this.setFeatures({ type: `routePlan`, features: [] })
  },
  watch: {
    routePlanInfo(newValue, oldVlaue) {
      console.log('routePlanInfo改变', newValue, oldVlaue)
      let ol = window.$context2D.ol
      let nowSelect = newValue.nowSelect
      if (newValue[nowSelect] && newValue[nowSelect].poiInfo) {
        let point = ol.proj.toLonLat(newValue[nowSelect].points)
        let pointStr = [point[0].toFixed(3), point[1].toFixed(3)].join(',')
        let endStr = nowSelect === 'selectStartPoint' ? 'start' : nowSelect === 'selectChannelPoint' ? 'channel' : 'end'
        this.form[endStr] = newValue[nowSelect].attributes.name + ` [${pointStr}]`
      }
      if (!newValue.selectStartPoint) {
        this.form.start = ''
      }
      if (!newValue.selectChannelPoint) {
        this.form.channel = ''
      }
      if (!newValue.selectEndPoint) {
        this.form.end = ''
      }
      if (newValue.getInfo) {
        let routeInfo = newValue.getInfo
        this.tableData.length = 0
        routeInfo.forEach((element) => {
          this.tableData.push({
            text: element.attributes.text,
            time: element.attributes.time,
            length: parseInt(element.attributes.length)
          })
        })
      }
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['setDrawActive', 'setRoutePlanInfo']),
    ...mapActions('map2d/pointMapShow', ['setFeatures']),
    // 处理点选类型按钮点击事件
    handleClickBoxSelect(type) {
      const styleTypeMap = { Point1: 'selectStartPoint', Point2: 'selectChannelPoint', Point3: 'selectEndPoint' }
      const active = type === this.currDrawType ? !this.drawActive : true
      const styleType = styleTypeMap[type]
      let nowRoutePlanInfo = JSON.parse(JSON.stringify(this.routePlanInfo))
      this.bColor1 = 'rgba(0,0,0,0)'
      this.bColor2 = 'rgba(0,0,0,0)'
      this.bColor3 = 'rgba(0,0,0,0)'
      if (nowRoutePlanInfo.nowSelect === styleType) {
        nowRoutePlanInfo.nowSelect = ''
        delete nowRoutePlanInfo[styleType]
      } else {
        nowRoutePlanInfo.nowSelect = styleType
        delete nowRoutePlanInfo[styleType]
        this['bColor' + type.split('Point')[1]] = '#f2f6fc'
      }
      console.log(styleType, nowRoutePlanInfo)
      this.setRoutePlanInfo(nowRoutePlanInfo)
    },
    save() {
      if (!this.routePlanInfo.selectStartPoint || !this.routePlanInfo.selectStartPoint.points) {
        this.$notify({ title: '警告',
          message: '未配置起始点！',
          type: 'warning'})
        return
      } else if (!this.routePlanInfo.selectEndPoint || !this.routePlanInfo.selectEndPoint.points) {
        this.$notify({ title: '警告',
          message: '未配置结束点！',
          type: 'warning'})
        return
      }
      let routeArr = []
      if (this.routePlanInfo.selectStartPoint && this.routePlanInfo.selectStartPoint.points) {
        routeArr.push(JSON.parse(JSON.stringify(this.routePlanInfo.selectStartPoint.points)))
      }
      if (this.routePlanInfo.selectChannelPoint && this.routePlanInfo.selectChannelPoint.points) {
        routeArr.push(JSON.parse(JSON.stringify(this.routePlanInfo.selectChannelPoint.points)))
      }
      if (this.routePlanInfo.selectEndPoint && this.routePlanInfo.selectEndPoint.points) {
        routeArr.push(JSON.parse(JSON.stringify(this.routePlanInfo.selectEndPoint.points)))
      }
      console.log(routeArr, this.routePlanInfo)
      if (this.isRealData) {
        getRouteFeaturesData(
          routeArr,
          this,
          getPorvinceInfoByAdcode(this.nowSelectAreaInfo.adcode.toString().substr(0, 2)).name
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
.distance {
  margin-top: 10px;
  width: 280px;
  height: 340px;
   background: rgba(255,255,255,0.95);
  box-shadow:-1px 0px 18px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  .query-form {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    .from-box {
      width: 210px;
      height: 100%;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .form-name {
        display: flex;
        justify-content: space-around;
        .lable-name {
          font-size: 12px;
          line-height: 25px;
          color: #333;
          width: 40px;
        }
        /deep/.el-input {
          margin-left: 0px;
          width: auto;
          .el-input__inner {
            width: 135px;
            height: 25px;
            line-height: 25px;
          }
        }
        .el-icon-edit-btn {
          height: 16px;
          width: 16px;
          margin-top: 5px;
          cursor: pointer;
          background: url('./../../../../static/map2d/routePlan/button.png');
        }
      }
    }

    .icon-button {
      margin-left: 10px;
      width: 35px;
      height: 45px;
      border:1px solid #999;
      // background-color: rgba(51, 51, 51, 0.498039215686275);
      text-align: center;
      line-height: 45px;
      color: #333;
      font-size: 25px;
      cursor: pointer;
    }
    .icon-button :hover {
      background-color: rgba(51, 51, 51, 0.698039215686275);
    }
    .icon-button i:hover {
      background-color: rgba(51, 51, 51, 0);
    }
  }
  .result-table {
    width: 100%;
    height: 220;
    display: flex;
    align-items: center;
    overflow: scroll;
  }
}
.el-table,
.el-table_header-wrapper {
  background-color: transparent;
}
.el-table__expanded-cell {
  background-color: transparent;
}
.el-table th,
.el-table tr {
  background-color: transparent;
}
</style>
