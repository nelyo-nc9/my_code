<template>
  <div id="warningData">
    <div class="select">
      <div class="select-count">
        <el-cascader clearable :props="selectProp"></el-cascader>
      </div>
    </div>

    <div class="list-item">
      <div class="item">
        <p>监控中心重点部位统计</p>
        <div class="zdtj">
          <ul>
            <li v-for="(item,index) in ulData" :key="index">
              <div class="left">{{item.name}}</div>
              <div class="right">{{item.value}}个</div>
            </li>
          </ul>
          <div id="pie">
            <Pie :options="options" :index="0" ref="options_pie"></Pie>
          </div>
        </div>
      </div>
      <div class="item">
        <p>全国机构数量分布图</p>
        <Map :mapData="citycount"></Map>
      </div>
      <div class="item">
        <p>监控中心机构统计</p>
        <Pie :options="sanjiao" :index="1" ref="branch_count"></Pie>
      </div>
      <div class="item">
        <p>设备资产年限统计</p>
        <hostList :item="zhu1" :index="0"></hostList>
      </div>
      <div class="item">
        <p>设备分布情况统计</p>
        <hostList :item="zhu2" :index="1"></hostList>
        <div @click="moveLeft" class="left_btn" v-show="btn1>0">
          <i class="el-icon-d-arrow-left"></i>
        </div>
        <div class="right_btn" @click="moveRight" v-show="btn1<changeData.length - 6">
          <i class="el-icon-d-arrow-right"></i>
        </div>
      </div>
      <div class="item">
        <p>设备接入情况统计</p>
        <Pie :options="options2" :index="2" ref="device_pie"></Pie>
      </div>
    </div>
  </div>
</template>
<script>
import hostList from '../subgroup/leftList.vue'
import Pie from '../subgroup/pie.vue'
import Map from '../subgroup/mapMin.vue'

import { getTreeApi } from '@src/http/alarmBigData/bigDataDetail.api'
import { deviceDataApi, deviceYearApi, deviceCountApi } from '../../../http/alarmBigData/deviceData.api'

// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

function fontSize(res) {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) {
    return
  }
  let fontSize = 100 * (clientWidth / 1920)
  return res * fontSize
}

export default {
  name: 'VideoTree',
  components: {
    hostList,
    Pie,
    Map
  },
  data() {
    return {
      selectProp: {
        lazy: true,
        // checkStrictly: true,
        lazyLoad: this.getSelect
      },
      data: [
        {
          label: '河北省分行',
          children: [
            {
              label: '1保定分行'
            },
            {
              label: '2保定分行'
            },
            {
              label: '3保定分行'
            },
            {
              label: '4保定分行'
            },
            {
              label: '5保定分行'
            },
            {
              label: '6保定分行'
            },
            {
              label: '7保定分行'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      keyWord: '',

      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        graphic: [
          {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '43%',
            style: {
              text: '总数',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.2),
              fontFamily: 'Microsoft YaHei'
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: '0',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.3),
              fontWeight: 800,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],

        series: [
          {
            type: 'pie',
            radius: ['30%', '40%'],
            label: {
              color: 'white',
              fontSize: fontSize(0.14),
              fontFamily: 'Microsoft YaHei',
              formatter: ' {b} {c}'
            },
            labelLine: {
              lineStyle: {
                color: 'white'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            data: [
              { value: 335, name: '直达' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]
          }
        ]
      },
      sanjiao: {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{b} ({d}%)',
        //   textStyle: {
        //     fontSize: fontSize(0.14),
        //     color: 'white',
        //     fontFamily: 'Microsoft YaHei'
        //   }
        // },
        calculable: true,
        color: ['#f0cc2c', '#c6ee35', '#315ca0'],
        series: [
          {
            top: '10%',
            type: 'funnel',
            width: '60%',
            height: '70%',
            left: '16%',
            sort: 'ascending',
            label: {
              color: 'white',
              formatter: function(params) {
                return params.name + ' ' + params.value[1] + '个'
              },
              fontFamily: 'Microsoft YaHei',
              fontSize: fontSize(0.14)
            },
            labelLine: {
              lineStyle: {
                color: 'white'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            data: [
              { value: 20, name: '一级分行' },
              { value: 40, name: '二级分行' },
              { value: 60, name: '基层行' }
            ]
          }
        ]
      },
      zhu1: {
        width: '98%',
        grid: {
          left: '1%',
          right: '1%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        legend: {
          icon: 'rect',
          orient: 'vertical',
          selectedMode: false,
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 3,
          top: 0,
          borderRadius: 0,
          right: 10,
          axisLabel: {
            interval: 1
          },
          textStyle: {
            color: 'white',
            fontSize: fontSize(0.12),
            fontFamily: 'Microsoft YaHei'
          }
        },
        tooltip: {
          trigger: 'axis',
          fontSize: fontSize(0.12),
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'none', // 默认为直线，可选为：'line' | 'shadow',
            color: 'red'
          }
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: 'category',
          minInterval: 0,
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei',
              fontSize: fontSize(0.12)
            }
          },
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(228,230,241,0.46)'],
              width: 0.2,
              type: 'solid',
              fontSize: 1
            }
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barGap: 0,
            barWidth: '8%'
          },
          {
            type: 'bar',
            barWidth: '8%'
          },
          {
            type: 'bar',
            barWidth: '8%'
          },
          {
            type: 'bar',
            barWidth: '8%'
          },
          {
            type: 'bar',
            barWidth: '8%'
          }
        ]
      },
      zhu2: {
        width: '90%',
        grid: {
          left: '3%',
          right: '3%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        legend: {
          icon: 'rect',
          orient: 'vertical',
          selectedMode: false,
          itemHeight: 10,
          itemWidth: 10,
          itemGap: 3,
          top: 0,
          borderRadius: 0,
          right: 10,
          axisLabel: {
            interval: 1
          },
          textStyle: {
            color: 'white',
            fontSize: fontSize(0.12),
            fontFamily: 'Microsoft YaHei'
          },
          data: ['报警设备', '视频设备', '门禁设备', '对讲设备', '防护舱设备']
        },
        tooltip: {
          trigger: 'axis',
          fontSize: fontSize(0.12),
          textStyle: {
            fontFamily: 'Microsoft YaHei'
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'none', // 默认为直线，可选为：'line' | 'shadow',
            color: 'red'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei',
              fontSize: fontSize(0.12)
            }
          },
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: 'rgba(222, 241, 255, 1)',
              fontFamily: 'Microsoft YaHei'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#2F5682', // 左边线的颜色
              width: '1', // 坐标线的宽度
              fontSize: 1
            }
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(228,230,241,0.46)'],
              width: 0.2,
              type: 'solid',
              fontSize: 1
            }
          }
        },
        dataset: {
          source: []
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barGap: 0,
            barWidth: 10
          },
          {
            type: 'bar',
            barWidth: 10
          },
          {
            type: 'bar',
            barWidth: 10
          },
          {
            type: 'bar',
            barWidth: 10
          },
          {
            type: 'bar',
            barWidth: 10
          }
        ]
      },
      options2: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        graphic: [
          {
            // 图形中间文字
            type: 'text',
            left: 'center',
            top: '43%',
            style: {
              text: '总数',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.2),
              fontFamily: 'Microsoft YaHei'
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: '886',
              textAlign: 'center',
              fill: '#fff',
              fontSize: fontSize(0.3),
              fontWeight: 800,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],

        series: [
          {
            type: 'pie',
            radius: ['30%', '40%'],
            clickable: false,
            label: {
              color: 'white',
              fontSize: fontSize(0.14),
              fontFamily: 'Microsoft YaHei',
              formatter: ' {b} {c} 台'
            },
            labelLine: {
              lineStyle: {
                color: 'white'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            data: [
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]
          }
        ]
      },
      value: '',
      btn1: 0,
      nameObjs: {
        cabin: '防护舱设备',
        video: '视频设备',
        audio: '对讲设备',
        guard: '门禁设备',
        alarm: '报警设备'
      },
      staticName: {
        type1: '营业网点',
        type2: '金库管理',
        type3: '计算机房管理',
        type4: '办公楼管理',
        type5: '自助银行管理',
        type6: '自助设备管理',
        type7: '自助银亭',
        type8: '私人银行管理',
        type9: '保管箱管理',
        type10: '档案室管理',
        type11: '远程监控中心',
        type12: '5G+智能银行',
        type13: '财富中心',
        type14: '其他重点部位',
        type15: '虚拟重点部位'
      },
      treeType: 3,
      // subSystem: 2,
      ulData: [],
      changeData: [],
      citycount: [{ name: '四川', count: 40 }]
    }
  },
  async created() {
    await this.getDeviceCount()
    await this.getDeviceYearCount()
    await this.getImportantCount()
  },
  mounted() {},
  methods: {
    getSelect(node, resolve) {
      const payload = {
        type: this.treeType
        // subSystem: this.subSystem
      }
      if (node.data) {
        payload.oId = node.data.value
      }
      getTreeApi(payload).then(res => {
        // console.log(res)
        const nodes = res.data.data.nodes
        const resObj = nodes.map(item => ({
          value: item.id,
          label: item.name
        }))
        resolve(resObj)
      })
    },
    getDeviceCount() {
      deviceDataApi().then(res => {
        // console.log('设备接入：', res)
        if (res.data.data) {
          const obj = res.data.data
          const arrs = [['keyworderd']]
          this.options2.graphic[1].style.text = obj.sum
          let arr = []
          Object.keys(obj.info[0].device).forEach(item => {
            arr.push({
              name: this.nameObjs[item],
              value: obj.info[0].device[item]
            })
          })

          obj.info.forEach((item, index) => {
            arrs[index + 1] = []
            arrs[index + 1].push(item.orgName)
            // arrs[index + 2] = []
            // arrs[index + 2].push(item.orgName + 2)
            // arrs[index + 3] = []
            // arrs[index + 3].push(item.orgName + 3)
            // arrs[index + 4] = []
            // arrs[index + 4].push(item.orgName + 4)
            // arrs[index + 5] = []
            // arrs[index + 5].push(item.orgName + 5)
            // arrs[index + 6] = []
            // arrs[index + 6].push(item.orgName + 6)
            Object.keys(item.device).forEach(value => {
              arrs[0].push(this.nameObjs[value])
              arrs[index + 1].push(item.device[value])

              // arrs[index + 2].push(item.device[value])
              // arrs[index + 3].push(item.device[value])
              // arrs[index + 4].push(item.device[value])
              // arrs[index + 5].push(item.device[value])
              // arrs[index + 6].push(item.device[value])
            })
          })
          // console.log(arrs)
          this.options2.series[0].data = arr
          this.changeData = arrs
          this.zhu2.dataset.source = arrs.slice(0, 6)
          this.$refs.device_pie.drawLine(this.options2)
        }
      })
    },
    getDeviceYearCount() {
      deviceYearApi().then(res => {
        // console.log('设备年限统计：', res)
        if (res.data.data) {
          const obj = res.data.data
          const arr = [
            ['keyworderd'],
            ['一年设备'],
            ['两年设备'],
            ['三年设备'],
            ['四年设备'],
            ['五年设备'],
            ['五年以上设备']
          ]
          let pushArr = (value, num) => {
            Object.keys(value).forEach(item => {
              if (arr[0].indexOf(this.nameObjs[item]) === -1) {
                arr[0].push(this.nameObjs[item])
              }
              arr[num].push(value[item])
            })
          }
          Object.keys(obj).forEach(item => {
            pushArr(obj[item], item)
          })
          // console.log(arr)
          this.zhu1.dataset.source = arr
        }
      })
    },
    getImportantCount() {
      deviceCountApi().then(res => {
        // console.log('监控中心重点部位统计：', res)
        if (res.data.code === 0) {
          const resData = res.data.data
          this.options.graphic[1].style.text = resData.keyPart.count
          Object.keys(resData.keyPart).forEach(item => {
            if (item !== 'count') {
              this.ulData.push({
                name: this.staticName[item],
                value: resData.keyPart[item].count
              })
            }
          })
          this.options.series[0].data = this.ulData

          this.$refs.options_pie.drawLine(this.options)
          const objArr = []
          let nameObj = {}
          Object.keys(resData.orgCont).forEach(item => {
            if (item === 'LevelOne') {
              objArr.push({
                value: [20, resData.orgCont[item].count],
                name: '一级分行'
              })
            } else if (item === 'LevelTwo') {
              objArr.push({
                value: [40, resData.orgCont[item].count],
                name: '二级分行'
              })
            } else if (item === 'LevelThree') {
              objArr.push({
                value: [60, resData.orgCont[item].count],
                name: '基层行'
              })
            }
            nameObj = {
              name: resData.orgCont.name || '安徽',
              count: resData.orgCont.count
            }
          })
          // console.log(objArr)
          this.sanjiao.series[0].data = objArr
          this.$refs.branch_count.drawLine(this.sanjiao)

          setTimeout(() => {
            this.citycount = [nameObj]
          }, 1000)
        }
      })
    },
    sliceArr(arr, start, value) {
      const Xdata = []
      arr.forEach((item, index) => {
        if (index < start + value && index >= start) {
          Xdata.push(item)
        }
      })
      return Xdata
    },
    moveLeft() {
      // const arrlength = this.changeData.length
      const nameArr = this.changeData[0]
      if (this.btn1 !== 0) {
        this.btn1--
        const changeArr = this.changeData.slice(1)
        const newArr = this.sliceArr(changeArr, this.btn1, 5)
        newArr.unshift(nameArr)
        this.zhu2.dataset.source = newArr
      }
    },
    moveRight() {
      const arrlength = this.changeData.length
      const nameArr = this.changeData[0]
      if (arrlength > 6 + this.btn1) {
        this.btn1++
        const changeArr = this.changeData.slice(1)
        const newArr = this.sliceArr(changeArr, this.btn1, 5)
        newArr.unshift(nameArr)
        this.zhu2.dataset.source = newArr
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ * {
  font-family: '微软雅黑';
}
.select {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 0.5rem;
  background: none;
  display: flex;
  justify-content: flex-end;
  .select-count {
    // width: 24%;
    float: right;
    display: flex;
    margin-right: 0.4vw;
    justify-content: space-between;
    /deep/.el-select .el-input .el-select__caret {
      color: #68a7fd;
    }
  }
  /deep/.el-input__inner {
    background: none;
    border-radius: 0;
    height: 2vw;
    border: 1px solid rgba(105, 169, 255, 1);

    font-size: 0.9vw;
    font-weight: 400;
    color: #ffffff;
    &::placeholder {
      font-style: italic;
      color: #68a7fd;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers 适配谷歌 */
      font-style: italic;
      color: #68a7fd;
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 适配火狐 */
      font-style: italic;
      color: #68a7fd;
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ 适配火狐 */
      font-style: italic;
      color: #68a7fd;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+  适配ie*/
      font-style: italic;
      color: #68a7fd;
    }
  }
}

#warningData {
  width: 100%;
  height: calc(~'100% - 70px');
  padding: 0 2rem;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  flex-direction: column;
  p {
    font-size: 0.9vw;
    text-align: center;
    line-height: 2.4vw;
  }
  .grey {
    font-size: 1.5vw;
    font-weight: 700;
    color: #a8a1b4;
    span {
      font-size: 1.2vw;
    }
    .big-red {
      font-size: 2vw;
    }
  }
  .list-item {
    width: 100%;
    height: 95%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .item {
      width: 36%;
      height: 49%;
      box-sizing: border-box;
      padding: 1%;
      border: 1px solid rgb(56, 93, 125);
      position: relative;
      .zdtj {
        #pie {
          width: 59%;
          height: 100%;
          float: right;
        }
        height: 100%;
        ul {
          float: left;
          width: 38%;
          height: 90%;
          list-style: none;
          font-size: 0.9vw;
          margin-left: 2%;
          margin-top: 5%;
          text-align: center;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          overflow-y: scroll;
          // border: solid 1px red;
          li {
            width: 100%;
            border: 1px solid rgb(56, 93, 125);
            display: flex;
            height: 3vh;
            line-height: 100%;
            font-weight: 700;
            margin-bottom: 0.5vh;
          }
          div {
            height: 100%;
            line-height: 3vh;
          }
          .left {
            width: 45%;
            background: #3766b4;
            overflow: hidden;
            color: rgba(255, 255, 255, 1);
            font-size: 0.2vw;
          }
          .right {
            width: 55%;
            color: #fff;
            overflow: hidden;
            font-size: 0.2vw;
          }
          @media screen and (min-width: 4000px) {
            .left,
            .right {
              font-size: 0.34vw;
            }
          }
        }
        /*滚动条样式*/
        ul::-webkit-scrollbar {
          width: 4px;
          background: transparent;
        }
        ul::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(56, 93, 125, 0.7);
          background: transparent;
        }
        ul::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(56, 93, 125, 0.7);
          border-radius: 0;
          background: transparent;
        }
      }
      p {
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        font-size: 0.34vw;
        display: block;
        line-height: 100%;
      }
      @media screen and (min-width: 4000px) {
        p {
          font-size: 0.68vw;
        }
      }
    }
    .item:nth-child(3) {
      width: 26%;
    }
    .item:nth-child(6) {
      width: 26%;
    }
    .left_btn {
      width: 2.15vw;
      max-width: 46px;
      height: 1.5vh;
      line-height: 1.5vh;
      font-size: 1.5vh;
      background: rgba(255, 255, 255, 0);
      border: 1px solid rgba(105, 169, 255, 1);
      border-radius: 2px;
      position: absolute;
      z-index: 99;
      bottom: 2.6vh;
      left: 1%;
      color: rgba(105, 169, 255, 1);
      text-align: center;
      cursor: pointer;
    }
    .right_btn {
      width: 2.15vw;
      max-width: 46px;
      height: 1.5vh;
      line-height: 1.5vh;
      font-size: 1.5vh;
      background: rgba(255, 255, 255, 0);
      border: 1px solid rgba(105, 169, 255, 1);
      border-radius: 2px;
      position: absolute;
      z-index: 99;
      bottom: 2.6vh;
      right: 1%;
      color: rgba(105, 169, 255, 1);
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
