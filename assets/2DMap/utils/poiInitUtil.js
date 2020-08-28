import symbolConfig from 'assets/2DMap/meta/SymbolConfig'

const porvinceArr = [
  { name: 'anhui', code: 0, adcode: 34 },
  { name: 'beijing', code: 1, adcode: 11 },
  { name: 'chongqing', code: 2, adcode: 50 },
  { name: 'fujian', code: 3, adcode: 35 },
  { name: 'gansu', code: 4, adcode: 62 },
  { name: 'guangdong', code: 5, adcode: 44 },
  { name: 'guangxi', code: 6, adcode: 45 },
  { name: 'guizhou', code: 7, adcode: 52 },
  { name: 'hainan', code: 8, adcode: 46 },
  { name: 'hebei', code: 9, adcode: 13 },
  { name: 'heilongjiang', code: 10, adcode: 23 },
  { name: 'henan', code: 11, adcode: 41 },
  { name: 'hubei', code: 12, adcode: 42 },
  { name: 'hunan', code: 13, adcode: 43 },
  { name: 'jiangsu', code: 14, adcode: 32 },
  { name: 'jiangxi', code: 15, adcode: 36 },
  { name: 'jilin', code: 16, adcode: 22 },
  { name: 'liaoning', code: 17, adcode: 21 },
  { name: 'neimenggu', code: 18, adcode: 15 },
  { name: 'ningxia', code: 19, adcode: 64 },
  { name: 'qinghai', code: 20, adcode: 63 },
  { name: 'shan3xi', code: 21, adcode: 61 },
  { name: 'shandong', code: 22, adcode: 37 },
  { name: 'shanghai', code: 23, adcode: 31 },
  { name: 'shanxi', code: 24, adcode: 14 },
  { name: 'sichuan', code: 25, adcode: 51 },
  { name: 'tianjin', code: 26, adcode: 12 },
  { name: 'xinjiang', code: 27, adcode: 65 },
  { name: 'xizang', code: 28, adcode: 54 },
  { name: 'yunnan', code: 29, adcode: 53 },
  { name: 'zhejiang', code: 30, adcode: 33 }
]

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
/**
 * 根据编码获取兴趣点数组信息
 * @param {*} adcode 行政区划代码
 * @param {*} code 兴趣点编码
 */
function getPoiPointsDataByCode(adcode, poiArr, nowThis) {
  console.log('根据编码获取兴趣点数组信息')
  let pois = porvinceArr.filter(item => {
    return item.adcode.toString() === adcode.substr(0, 2).toString()
  })
  let poisCode = pois.length === 1 ? pois[0].code : 1
  console.log('根据编码获取兴趣点数组信息1')
  let endFeatures = []
  return new Promise((resolve, reject) => {
    //let adcodeStr = `admincode = '${nowThis.nowSelectAreaInfo.adcode}' and `
    const extent = window.$context2D.map.getView().calculateExtent(window.$context2D.map.getSize())
    const code = '100101'
    let poiTypeStr = poiArr.length > 0 ? `kind_new = '${poiArr.join("' or kind_new = '")}'` : '1=1'
    let poiUrl = `http://128.192.155.0:6080/arcgis/rest/services/pos/pos_poi/MapServer/${poisCode}/query?where=${poiTypeStr}&geometry={"xmin":'${extent[0]}',"ymin":${extent[1]},"xmax":${extent[2]},"ymax":${extent[3]},"spatialReference":{"wkid":3857,"latestWkid":3857}}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=pjson`
    console.log('建行提供兴趣点数据链接', poiUrl)
    poiUrl = encodeURI(poiUrl)
    console.log('建行提供兴趣点数据链接', poiUrl)
    $ajax('get', poiUrl)
      .then(function(response) {
        console.log('建行提供兴趣点请求成功0')
        let poiJson = JSON.parse(response)
        console.log('建行提供兴趣点请求成功1')
        let features = new window.$context2D.ol.format.EsriJSON().readFeatures(poiJson, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
        console.log('创建feature1成功')
        features.forEach((element, index) => {
          let id = adcode + '_' + code + '_point_' + new Date().getTime() + '_' + index
          endFeatures.push({
            geom: {
              type: 'Point',
              points: element
                .getGeometry()
                .getCoordinates()
                .join(',')
            },
            attributes: {
              id,
              name: element.N.NAME,
              type: 'poi_cy_' + code.substr(0, 2),
              subType: code,
              rType: code,
              adcode: nowThis.nowSelectAreaInfo.adcode.toString().substr(0, 2) + '0000'
            },
            symbol: symbolConfig.renderPoiFeatureStyle(code)
          })
        })
        console.log('创建feature2成功')
        resolve(endFeatures)
      })
      .catch(function(error) {
        reject('获取公网数据失败', error, poiUrl)
      })
  })
}

async function addPoiPointsDataByCode(adcode, poiArr, nowThis, callback) {
  let poiFeatures = await getPoiPointsDataByCode(adcode, poiArr, nowThis)
  console.log('获取兴趣点成功')
  nowThis.setFeatures({ type: `poi_cy_11`, features: poiFeatures })
  console.log('兴趣点加载完成-end')
  callback()
}

function getTestDataFeatures(poiArr, nowThis) {
  let features = []
  for (let i = 0; i < poiArr.length; i++) {
    for (let k = 0; k < 10; k++) {
      let point =
        12848875.338142732 +
        Math.random() * (13081663.540343883 - 12848875.338142732).toString() +
        ',' +
        (4785292.759869763 + Math.random() * (5021313.790468693 - 4785292.759869763).toString())
      features.push({
        geom: { type: 'Point', points: point },
        attributes: {
          id: i + '_' + k + new Date().getTime(),
          name: poiArr[i].threeType,
          type: 'poi_cy_' + poiArr[i].poiCode.substr(0, 2),
          subType: poiArr[i].poiCode,
          rType: poiArr[i].poiCode,
          adcode: nowThis.nowSelectAreaInfo.adcode.toString().substr(0, 2) + '0000'
        },
        symbol: symbolConfig.renderPoiFeatureStyle({})
      })
    }
  }
  let obj = {}
  features.forEach(item => {
    if (obj[item.attributes.type]) {
      obj[item.attributes.type].push(item)
    } else {
      obj[item.attributes.type] = [item]
    }
  })
  return obj
}

export { getPoiPointsDataByCode, getTestDataFeatures, addPoiPointsDataByCode }
