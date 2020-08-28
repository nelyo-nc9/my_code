/**
地图应用和地图配置共用的一些方法封装
 */
import symbolConfig from 'assets/2DMap/meta/SymbolConfig'
import { geojsonHubei } from './hubei'
import { convertStyleToSymbol, getDefaultStyle } from 'assets/2DMap/feature/edit/area'

function addGeoserverTileToMap(map, ol, url) {
  var projection = ol.proj.get('EPSG:3857')
  var tileSizePixels = 256
  var tileSizeMtrs = ol.extent.getWidth(projection.getExtent()) / tileSizePixels
  var matrixIds = []
  var resolutions = []
  for (var i = 0; i <= 14; i++) {
    matrixIds[i] = i
    resolutions[i] = tileSizeMtrs / Math.pow(2, i)
  }
  var wmtsSource = new ol.source.WMTS({
    url,
    layer: 'SRTM_4_1:SRTM_4_1_flooded_sealevels',
    format: 'image/png',
    matrixSet: 'EPSG:3857',
    tileGrid: new ol.tilegrid.WMTS({
      origin: ol.extent.getTopLeft(projection.getExtent()),
      resolutions: resolutions,
      matrixIds: matrixIds
    }),
    style: 'default',
    dimensions: {
      threshold: 100
    }
  })
  map.addLayer(
    new ol.layer.Tile({
      opacity: 0.5,
      source: wmtsSource
    })
  )
}

function addGeoserverIGNTileToMap(map, ol, url) {
  let resolutions = []
  let matrixIds = []
  let proj3857 = ol.proj.get('EPSG:3857')
  let maxResolution = ol.extent.getWidth(proj3857.getExtent()) / 256

  for (let i = 0; i < 18; i++) {
    matrixIds[i] = i.toString()
    resolutions[i] = maxResolution / Math.pow(2, i)
  }

  let tileGrid = new ol.tilegrid.WMTS({
    origin: [-20037508, 20037508],
    resolutions: resolutions,
    matrixIds: matrixIds
  })
  let ign_source = new ol.source.WMTS({
    url,
    layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
    matrixSet: 'PM',
    format: 'image/jpeg',
    projection: 'EPSG:3857',
    tileGrid: tileGrid,
    style: 'normal'
  })

  let ign = new ol.layer.Tile({
    source: ign_source
  })

  map.addLayer(ign)
}

function $ajax(type, url, sucCalback) {
  return new Promise((resolve, reject) => {
    let xmlhttp = new window.XMLHttpRequest()
    xmlhttp.open(type, url, true)
    xmlhttp.send(null)
    xmlhttp.onreadystatechange = function(res) {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        resolve(res.currentTarget.responseText)
      }
    }
  })
}

function getGongwangTestDataFeatures(code, isRealData, level) {
  if (!isRealData) {
    return new Promise((resolve, reject) => {
      let url_bian = `https://geo.datav.aliyun.com/areas_v2/bound/${code}.json`
      let bianFeatures = []
      $ajax('get', url_bian)
        .then(function(response) {
          let bianJson = JSON.parse(response)
          bianFeatures = new window.$context2D.ol.format.GeoJSON().readFeatures(bianJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
          resolve(bianFeatures)
        })
        .catch(function(error) {
          reject('获取公网数据失败', error, url_bian)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      let url_bian =
        'http://128.192.155.0:6080/arcgis/rest/services/common/china_admin_boundary/MapServer/' +
        (Number(level) - 1) +
        '/query?where= admincode = ' +
        code +
        '&f=pjson'
      url_bian = encodeURI(url_bian)
      console.log('建行提供行政边界转码后网址', url_bian)
      $ajax('get', url_bian)
        .then(function(response) {
          let bianJson = JSON.parse(response)
          console.log('请求成功')
          let bianFeatures = new window.$context2D.ol.format.EsriJSON().readFeatures(bianJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
          console.log('生成地图元素成功')
          resolve(bianFeatures)
        })
        .catch(function(error) {
          reject('获取边界JSON数据失败', error, url_bian)
        })
    })
  }
}

async function loadAdministrativeAreaDataToMap(areaInfo, nowThis, symbol) {
  let areaCode = areaInfo.adcode.toString()
  let textStyle = symbol.textStyle
  if (areaCode.length !== 6) return
  //   console.log('进入方法内部' + areaCode)
  let administrativeAreaFeatures = await getGongwangTestDataFeatures(
    areaCode,
    nowThis.$store.state.map2d.mapIndex.isRealData,
    areaInfo.level
  )
  console.log('进入方法外部')
  if (administrativeAreaFeatures.length === 0) return
  let endArr = []
  let extent
  console.log('开始对feature进行下一步处理')
  administrativeAreaFeatures.forEach(item => {
    extent = extent ? extent : item.getGeometry().getExtent()
    let nowExtent = item.getGeometry().getExtent()
    if (extent) {
      extent[0] = extent[0] < nowExtent[0] ? extent[0] : nowExtent[0]
      extent[1] = extent[1] < nowExtent[1] ? extent[1] : nowExtent[1]
      extent[2] = extent[2] > nowExtent[2] ? extent[2] : nowExtent[2]
      extent[3] = extent[3] > nowExtent[3] ? extent[3] : nowExtent[3]
    }
    let format = new window.$context2D.ol.format.WKT()
    nowThis.setNowSelectWKTAreaInfo(format.writeFeature(item))

    let newStyle = JSON.parse(JSON.stringify(symbolConfig.administrativeAreaSymbol))
    symbol.textStyle = undefined
    symbol.strokeStyle.borderStyle = ''
    let points1 = item.getGeometry().getCoordinates()
    let points2 = []
    if (points1.length > 0) {
      points2 = typeof points1[0][0][0] === 'number' ? [points1] : points1
    }
    endArr.push({
      geom: { type: 'MultiPolygon', points: points2 },
      attributes: { id: '1', name: '高亮区域', type: 'administrativeArea', subType: 'Highlight' },
      symbol: symbol || newStyle
    })
  })
  textStyle.label = areaInfo.name

  let newStyle = {
    fillColor: 'rgba(236, 227, 191, 0)',
    strokeStyle: {
      outLineColor: 'rgba(244,121,120,0)'
    },
    textStyle
  }
  console.log('当前地图范围', extent)

  endArr.push({
    geom: {
      type: 'MultiPolygon',
      points: [
        [
          [
            [extent[0], extent[1]],
            [extent[2], extent[1]],
            [extent[2], extent[3]],
            [extent[0], extent[3]],
            [extent[0], extent[1]]
          ]
        ]
      ]
    },
    attributes: { id: '91', name: '高亮区域', type: 'administrativeArea', subType: 'Highlight' },
    symbol: newStyle
  })

  window.$context2D.map.getView().fit(extent, window.$context2D.map.getSize())
  console.log('最终地图元素')
  nowThis.setFeatures({ type: 'administrativeArea', features: endArr }) // 请求加载要素
  if (nowThis.nowSetTimeout) {
    clearTimeout(nowThis.nowSetTimeout)
  }
  let timeout = setTimeout(function() {
    nowThis.setFeatures({ type: 'administrativeArea', features: [] }) // 请求加载要素
  }, 10000)
  nowThis.setNowSetTimeOut({ timeout: timeout })
}

/**
 *
 * @param {*} selectInfo 当前选中区域信息
 * @param {*} areaInfo  所有区域信息
 * @param {*} nowThis 当前对象
 * @param {*} isInit 是否初始化，false 点击进入，true 初始化天气
 */
async function loadWeatherAreaDataToMap(showArr, nowThis) {
  console.log('加载天气地图图层')
  nowThis.setFeatures({ type: 'weatherArea', features: [] }) // 请求加载要素
  let endArr = []
  let extent
  for (let i = 0; i < showArr.length; i++) {
    let element = showArr[i]
    let administrativeAreaFeatures = await getGongwangTestDataFeatures(
      element.adcode.toString(),
      nowThis.$store.state.map2d.mapIndex.isRealData,
      element.level
    )
    if (administrativeAreaFeatures.length === 0) return
    administrativeAreaFeatures.forEach((item, index) => {
      extent = extent ? extent : item.getGeometry().getExtent()
      let nowExtent = item.getGeometry().getExtent()
      if (extent) {
        extent[0] = extent[0] < nowExtent[0] ? extent[0] : nowExtent[0]
        extent[1] = extent[1] < nowExtent[1] ? extent[1] : nowExtent[1]
        extent[2] = extent[2] > nowExtent[2] ? extent[2] : nowExtent[2]
        extent[3] = extent[3] > nowExtent[3] ? extent[3] : nowExtent[3]
      }
      let center = [(nowExtent[0] + nowExtent[2]) / 2, (nowExtent[1] + nowExtent[3]) / 2]

      let newStyle = JSON.parse(JSON.stringify(symbolConfig.weatherAreaSymbol))
      newStyle = convertStyleToSymbol(getDefaultStyle(), showArr[i].areaStyle)
      let points1 = item.getGeometry().getCoordinates()
      let points2 = []
      if (points1.length > 0) {
        points2 = typeof points1[0][0][0] === 'number' ? [points1] : points1
      }
      endArr.push({
        geom: { type: 'MultiPolygon', points: points2 },
        attributes: {
          id: i + '_' + index + '_area',
          name: '高亮区域',
          type: 'weatherArea',
          subType: 'Highlight',
          areaName: item.name,
          areaInfo: JSON.parse(JSON.stringify(element)),
          center: center
        },
        symbol: newStyle
      })

      let newTextStyle = JSON.parse(JSON.stringify(symbolConfig.weatherAreaTextSymbol))
      let extent1 = [center[0] - 100, center[1] - 100, center[0] + 100, center[1] + 100]
      newTextStyle.textStyle.label = element.name
      let textFeature = {
        geom: {
          type: 'MultiPolygon',
          points: [
            [
              [
                [extent1[0], extent1[1]],
                [extent1[2], extent1[1]],
                [extent1[2], extent1[3]],
                [extent1[0], extent1[3]],
                [extent1[0], extent1[1]]
              ]
            ]
          ]
        },
        attributes: {
          id: i + '_' + index + '_text',
          areaName: item.name,
          name: '高亮区域',
          type: 'weatherArea',
          subType: 'weatherAreaText'
        },
        symbol: newTextStyle
      }
      endArr.push(textFeature)
    })
  }
  window.$context2D.map.getView().fit(extent, window.$context2D.map.getSize())
  if (nowThis.mapToolbarStatus.weatherControl) {
    nowThis.setFeatures({ type: 'weatherArea', features: endArr }) // 请求加载要素
  }
}

export { addGeoserverTileToMap, addGeoserverIGNTileToMap, loadAdministrativeAreaDataToMap, loadWeatherAreaDataToMap }
