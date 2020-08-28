import symbolConfig from 'assets/2DMap/meta/SymbolConfig'

function $ajax(type, url, param) {
  return new Promise((resolve, reject) => {
    let xmlhttp = new window.XMLHttpRequest()
    xmlhttp.open(type, url, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send(param)
    xmlhttp.onreadystatechange = function(res) {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        resolve(res.currentTarget.responseText)
      }
    }
  })
}

function getRouteFeatures(routeArr, areaName, nowThis) {
  return new Promise((resolve, reject) => {
    const param = `f=json&stops=${JSON.stringify(routeArr)}`
    const routeURL =
      'http://128.192.155.0:6080/arcgis/rest/services/network/china_network/NAServer/Route_' + areaName + '/solve'
    console.log('开始建行路网规划请求', param, routeURL)
    $ajax('post', routeURL, param)
      .then(res => {
        let routeRes = JSON.parse(res)
        console.log('线路请求成功')
        let coods = routeRes.routes.features[0].geometry.paths[0]

        let nowRoutePlanInfo = JSON.parse(JSON.stringify(nowThis.routePlanInfo))
        nowRoutePlanInfo.getInfo = routeRes.directions[0].features
        console.log('nowRoutePlanInfo', nowRoutePlanInfo)
        nowThis.setRoutePlanInfo(nowRoutePlanInfo)

        let newCoods = []
        coods.forEach(item => {
          newCoods.push([item[0], item[1]])
        })
        let geojsonObject = {
          type: 'FeatureCollection',
          crs: {
            type: 'name',
            properties: {
              name: 'EPSG:4326'
            }
          },
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'MultiLineString',
                coordinates: [newCoods]
              }
            }
          ]
        }
        console.log('新的数组1', newCoods)
        console.log('新的数组2', routeRes)
        let features = new window.$context2D.ol.format.GeoJSON().readFeatures(geojsonObject, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
        console.log('创建feature成功', features)
        let endFeatures = []

        features.forEach((element, index) => {
          console.log(element.getGeometry())
          console.log(element.getGeometry().getCoordinates())
          console.log(symbolConfig)
          let points1 = element.getGeometry().getCoordinates()
          let points2 = points1.join(',')
          endFeatures.push({
            geom: { type: 'LineString', points: points2 },
            attributes: { id: 'route_' + index, name: 'routePlan', type: 'routePlan', subType: 'routePlan', rType: 0 },
            symbol: symbolConfig.routePlanLineSymbol
          })
        })
        console.log('转化feature成功', endFeatures)
        resolve(endFeatures)
      })
      .catch(function(error) {
        reject('获取建行数据失败', error)
      })
  })
}

async function getRouteFeaturesData(points, nowThis, areaName) {
  console.log('开始调用路径规划接口', points)
  let routeArr = {
    type: 'features',
    features: []
  }
  points.forEach(item => {
    let item4326 = window.$context2D.ol.proj.toLonLat(item)
    routeArr.features.push({
      geometry: {
        x: item4326[0],
        y: item4326[1],
        spatialReference: {
          wkid: '4326'
        }
      },
      attributes: {
        Name: routeArr.features.length ? `途径点${routeArr.features.length}` : '起点'
      }
    })
  })
  console.log('组合完成路径起始点和途径点', routeArr)
  let features = await getRouteFeatures(routeArr, areaName, nowThis)
  console.log('线路规划完成，开始进行图层操作')
  nowThis.setFeatures({ type: `routePlan`, features: features })
  console.log('图层操作完成，结束')
}

export { getRouteFeaturesData }
