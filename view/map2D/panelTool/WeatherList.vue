<template>
  <div class="weather">
    <section class="weatherlist">
      <div class="weather-top">
        <span @click="updateWeatherSelect">←</span>
        <span>{{ this.nowSelectWeatherAreaInfo.name }}天气</span>
      </div>
      <div class="weatherlists">
        <div
          v-for="(item, index) in weatherInfo"
          :key="index"
          :class="{ active: index === isActive }"
          @mouseover="mouseOver(item, index)"
          @mouseleave="mouseLeave(item, index)"
          @click="mouseClick(item, index)"
          style="height:36px;border-top:1px solid white;"
          :style="{ borderBottom: index === weatherInfo.length - 1 ? '1px solid white' : '' }"
        >
          <span class="nameBox">{{ item.areaName }}</span>
          <div class="imgBox">
              <img  :src="item.weatherTypeSrc" alt="未知" />
            </div>
          <span class="numberBox">{{ item.temperature }}℃</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { map, filter, cloneDeep } from 'lodash'
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import wheatherConfig from 'assets/2DMap/meta/weatherConfig'
import { convertStyleToSymbol, getDefaultStyle } from 'assets/2DMap/feature/edit/area'
export default {
  name: 'weather-list',
  data() {
    return {
      weatherInfo: [],
      isActive: false,
      active: ''
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', [
      'administrativeAreaInfo',
      'nowSelectWeatherAreaInfo',
      'isRealData',
      'nowPointerWeatherAreaInfo'
    ]),
    ...mapState('map2d/pointMapShow', ['weatherAreaFeatures']),
    listennowSelectWeatherAreaInfo() {
      return this.nowSelectWeatherAreaInfo
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'getTreeApiSubaAreaInfo',
      'getWeatherApiSubInfoByUrl',
      'setNowSelectWeatherAreaInfo',
      'setNowPointerWeatherAreaInfo',
      'setCurrPanelToolComponent',
      'setPanelInfoStatus'
    ]),
    ...mapMutations('map2d/mapIndex', ['SET_NOW_WEATHER_LIST_INFO']),
    ...mapActions('map2d/pointMapShow', ['setFeatures']),
    updatePonter(item, index) {
      let attributes
      this.weatherAreaFeatures.forEach(element => {
        if (element.attributes.areaInfo && element.attributes.areaInfo.adcode.toString() === item.adcode) {
          attributes = cloneDeep(element.attributes)
        }
      })
      if (!attributes) { return }
      if (!this.nowPointerWeatherAreaInfo) {
        this.setNowPointerWeatherAreaInfo(cloneDeep(attributes.areaInfo))
      } else if (this.nowPointerWeatherAreaInfo.adcode !== attributes.areaInfo.adcode) {
        this.setNowPointerWeatherAreaInfo(cloneDeep(attributes.areaInfo))
      }
      // 天气区域改变颜色
      let newFeatures = cloneDeep(this.weatherAreaFeatures)
      for (let i = 0; i < newFeatures.length; i++) {
        // fillTransparency
        if (newFeatures[i].attributes.id === attributes.id && newFeatures[i].attributes.id.split('text').length === 1) {
          newFeatures[i].symbol = symbolConfig.weatherAreaHeightSymbol
        } else if (newFeatures[i].attributes.id.split('text').length === 1) {
          newFeatures[i].symbol = convertStyleToSymbol(getDefaultStyle(), newFeatures[i].attributes.areaInfo.areaStyle) // symbolConfig.weatherAreaSymbol
        }
      }
      this.setFeatures({ type: 'weatherArea', features: newFeatures })

      // 鼠标移入添加overlay
      if (
        !window.$context2D.nowOverlayWeather ||
        window.$context2D.nowOverlayWeather.id.split('overlay_') !== attributes.center.join(',')
      ) {
        window.$context2D.nowOverlayWeather.setPosition(attributes.center)
      }
    },
    mouseOver: function(item, index) {
      this.isActive = index
      console.log('.weatherAreaFeatures', item, this.weatherAreaFeatures)
      this.updatePonter(item, index)
    },
    mouseLeave: function(item, index) {
      this.active = ''
    },
    mouseClick: function(item, index) {
      let areaInfo
      this.weatherAreaFeatures.forEach(element => {
        if (element.attributes.areaInfo && element.attributes.areaInfo.adcode.toString() === item.adcode) {
          areaInfo = cloneDeep(element.attributes.areaInfo)
        }
      })
      if (areaInfo && areaInfo.adcode !== this.nowSelectWeatherAreaInfo.adcode && areaInfo.level !== 3) { this.setNowSelectWeatherAreaInfo(areaInfo) } // 点击区域不同
      this.setCurrPanelToolComponent('WeatherList') // 显示天气右侧面板
      this.setPanelInfoStatus(true) // 显示右侧面板
    },
    updateWeatherSelect() {
      this.administrativeAreaInfo.forEach(item => {
        if (item.adcode.toString().substr(0, 2) === this.nowSelectWeatherAreaInfo.adcode.toString().substr(0, 2)) {
          console.log('开启地图下钻功能')
          this.setNowSelectWeatherAreaInfo(JSON.parse(JSON.stringify(item)))
        }
      })
    },
    loadWeatherInfo(areas) {
      console.log('天气模块2', areas)
      let areaIds = []
      areas.forEach(item => {
        areaIds.push(item.adcode)
      })
      if (areaIds.length === 0) {
        this.weatherInfo = []
        return
      }

      Date.prototype.format = function(fmt) {
        var o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
          'H+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          S: this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)) }
        }
        return fmt
      }
      let time1 = new Date().format('yyyy-MM-dd HH:mm:ss')
      time1 = time1.substr(0, 14) + '00:00'
      console.log('time1', time1)
      this.getWeatherApiSubInfoByUrl({
        time: this.isRealData ? time1 : '2019-12-21 06:00:00',
        adcodes: areaIds.join(',')
      })
        .then(res => {
          console.log('获取地图信息成功', res)
          if (res.data && res.data.weathers) {
            this.weatherInfo = res.data.weathers
            this.weatherInfo.forEach(item => {
              let areaArr = filter(areas, v => {
                return v.adcode.toString() === item.adcode.toString()
              })
              item.areaName = areaArr.length ? areaArr[0].name : item.wbtCntyAndDstcNm
              item.weatherTypeSrc =
                '../../../../static/map2d/weather/' + wheatherConfig.getWeatherPngByType(item.wthrPhnmDsc)
              return item
            })
            console.log(this.weatherInfo)
            this.SET_NOW_WEATHER_LIST_INFO(JSON.parse(JSON.stringify(this.weatherInfo)))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    listennowSelectWeatherAreaInfo() {
      console.log('天气模块3')
      if (
        this.nowSelectWeatherAreaInfo.level === 3 ||
        this.nowSelectWeatherAreaInfo.adcode === 810000 ||
        this.nowSelectWeatherAreaInfo.adcode === 820000
      ) {
        this.loadWeatherInfo([this.nowSelectWeatherAreaInfo])
        return
      }
      this.getTreeApiSubaAreaInfo({ adcode: this.nowSelectWeatherAreaInfo.adcode })
        .then(res => {
          console.log(res)
          this.loadWeatherInfo(res.data.areas)
        })
        .catch(err => {
          console.log(err)
        })
    },
    '$store.state.map2d.mapIndex.nowPointerWeatherAreaInfo'(newValue, oldValue) {
      this.weatherInfo.forEach((item, index) => {
        if (item.adcode.toString() === newValue.adcode.toString()) {
          this.isActive = index
        }
      })
    }
  },
  mounted() {
    console.log('天气模块0', this.nowSelectWeatherAreaInfo)
    if (
      this.nowSelectWeatherAreaInfo.level === 3 ||
      this.nowSelectWeatherAreaInfo.adcode === 810000 ||
      this.nowSelectWeatherAreaInfo.adcode === 820000
    ) {
      this.loadWeatherInfo([this.nowSelectWeatherAreaInfo])
      return
    }
    this.getTreeApiSubaAreaInfo({ adcode: this.nowSelectWeatherAreaInfo.adcode })
      .then(res => {
        console.log('天气模块1', res)
        this.loadWeatherInfo(res.data.areas)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped lang="less">
.weatherlist {
  // width: 300px;
  height: 85%;
  // background: rgba(200, 200, 200, 0.35);
  overflow: scroll;
}
.active {
  height: 50px;
  background-color: #4d94f8;
}
.weather-top {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  padding-left: 10px;
}
.weather-top span:first-child {
  cursor: pointer;
}
.weatherlists {
  text-align: center;
}
.weatherlists div {
  margin-top: 0px;
  line-height: 30px;;
  .nameBox {
    float: left;
    width:50%;
  }
  .imgBox{
     width: 25%;
     height: 30px;
     float: left;
       img{
      width: 30px;
       height: 30px;
     display: inline-block;
     vertical-align: top;
       }
  }
.numberBox{
  width: 25%;
     float: left;

}
}
</style>
