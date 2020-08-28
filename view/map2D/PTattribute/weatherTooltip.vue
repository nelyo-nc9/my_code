<template>
  <div>
    <section class="weather">
      <div class="tooltip">
        <div class="weathers">
          <div class="weatherimg">
            <img :src="nowWeatherInfo.weatherTypeSrc" />
          </div>
          <div>{{nowWeatherInfo.temperature}}℃</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'weather-tooltip',
  data() {
    return {
      nowWeatherInfo: {
        areaName: '',
        temperature: '',
        weatherTypeSrc: ''
      }
    }
  },
  computed: {
    ...mapState('map2d/mapIndex', ['nowWeatherListInfo'])
  },
  methods: {
    ...mapActions('map2d/mapIndex', ['getWeatherApiSubInfoByUrl'])
  },
  watch: {
    '$store.state.map2d.mapIndex.nowPointerWeatherAreaInfo'(newValue, oldValue) {
      console.log('地图悬停天气区域改变', newValue, this.nowWeatherListInfo)
      this.areaname = newValue.name
      for (let i = 0; i < this.nowWeatherListInfo.length; i++) {
        if (newValue.adcode.toString() === this.nowWeatherListInfo[i].adcode.toString()) {
          this.nowWeatherInfo = JSON.parse(JSON.stringify(this.nowWeatherListInfo[i]))
          break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tooltip {
  width: 80px;
  height: 50px;
  background: rgba(255, 255, 255, 0.6);
}
.tooltip div {
  text-align: center;
}
.weatherimg img {
  width: 30px;
  height: 30px;
}
</style>