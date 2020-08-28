// 2D配置模块 要素构造

import { GEOMETRYTYPE } from '../../meta/common'
import SymbolConfig from '../../meta/SymbolConfig'

function getLocateFeature(id, loc, isMorePoint) {
  let feature = null
  if (id) {
    feature = {
      geom: {
        type: GEOMETRYTYPE.POINT,
        points: loc
      },
      attributes: { id, loc },
      symbol: isMorePoint ? SymbolConfig.hightLightMorePointSymbol : SymbolConfig.hightLightSymbol
    }
  }
  return feature
}

export default {
  getLocateFeature
}
