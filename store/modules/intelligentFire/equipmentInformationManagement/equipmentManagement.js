const state = {
    isNewFile: 'FireAlarm', // 当前路由
    componentId: '',
    sidebarActive: '火警报警系统', // 页面title
    sidebarActiveId: 1, // 页面类型
    sidebarActiveField: 'FireAlarm', // 页面类型字段(查询数据字典用)
    isShowContent: 'list',
    // 数据字典
    dataDic: {
        //火警报警系统
        FireAlarm: {
            brand: '3', // 设备品牌
            modelNumber: '4', // 设备型号
            label: '5', // 设备标签
            childType: '36', // 部件类型
            childBrand: '37', // 部件品牌
            childModel: '38', // 部件型号
            transDev: {
                // 传输设备
                id: '75', // 传输设备分类
                用户信息传输装置: {
                    id: '76', // 传输设备品牌
                    modelNumber: '77' // 传输设备型号
                }
            }
        },
        //可燃气体报警系统
        CombustibleGasAlarm: {
            brand: '6', // 品牌
            modelNumber: '7', // 型号
            label: '8', // 设备标签
            childType: '39', // 部件类型
            childBrand: '40', // 部件品牌
            childModel: '41', // 部件型号
            transDev: {
                // 传输设备
                id: '78', // 传输设备分类
                用户信息传输装置: {
                    id: '79', // 传输设备品牌
                    modelNumber: '80' // 传输设备型号
                }
            }
        },
        //自动喷水灭火系统
        AutomaticSprinkler: {
            brand: '9', // 品牌
            modelNumber: '10', // 型号
            label: '11', // 设备标签
            childType: '45', // 部件类型
            childBrand: '46', // 部件品牌
            childModel: '47', // 部件型号
            // 传输设备
            transDev: {
                id: '81', // 传输设备分类
                消防泵监测仪: {
                    id: '82', // 传输设备品牌
                    modelNumber: '83' // 传输设备型号
                }
            },
            // 系统部件设备
            childTransDev: {
                id: '84', // 设备分类
                液压传感器: {
                    id: '85', // 设备品牌
                    modelNumber: '86' // 设备型号
                },
                液位传感器: {
                    id: '87', // 设备品牌
                    modelNumber: '88' // 设备型号
                }
            }
        },
        //水喷雾灭火系统
        WaterSprayFireExtinguishing: {
            brand: '15', // 品牌
            modelNumber: '16', // 型号
            label: '17', // 设备标签
            childType: '51', // 部件类型
            childBrand: '52', // 部件品牌
            childModel: '53', // 部件型号
            transDev: {
                // 传输设备
                id: '89', // 传输设备分类
                消防泵监测仪: {
                    id: '90', // 传输设备品牌
                    modelNumber: '91' // 传输设备型号
                }
            },
            // 系统部件设备
            childTransDev: {
                id: '92', // 设备分类
                液压传感器: {
                    id: '93', // 设备品牌
                    modelNumber: '94' // 设备型号
                },
                液位传感器: {
                    id: '95', // 设备品牌
                    modelNumber: '96' // 设备型号
                }
            }
        },
        //细水雾灭火系统
        WaterMistFireFighting: {
            brand: '18', // 品牌
            modelNumber: '19', // 型号
            label: '20', // 设备标签
            childType: '54', // 部件类型
            childBrand: '55', // 部件品牌
            childModel: '56', // 部件型号
            transDev: {
                // 传输设备
                id: '97', // 传输设备分类
                消防泵监测仪: {
                    id: '98', // 传输设备品牌
                    modelNumber: '99' // 传输设备型号
                }
            },
            // 系统部件设备
            childTransDev: {
                id: '100', // 设备分类
                液压传感器: {
                    id: '101', // 设备品牌
                    modelNumber: '102' // 设备型号
                },
                液位传感器: {
                    id: '103', // 设备品牌
                    modelNumber: '104' // 设备型号
                }
            }
        },
        //消防给水及消防栓系统
        FireWaterSupplyAndHydrant: {
            brand: '12', // 品牌
            modelNumber: '13', // 型号
            label: '14', // 设备标签
            childType: '48', // 部件类型
            childBrand: '49', // 部件品牌
            childModel: '50', // 部件型号
            transDev: {
                // 传输设备
                id: '105', // 传输设备分类
                消防泵监测仪: {
                    id: '106', // 传输设备品牌
                    modelNumber: '107' // 传输设备型号
                }
            },
            // 系统部件设备
            childTransDev: {
                id: '108', // 设备分类
                液压传感器: {
                    id: '109', // 设备品牌
                    modelNumber: '110' // 设备型号
                },
                液位传感器: {
                    id: '111', // 设备品牌
                    modelNumber: '112' // 设备型号
                }
            }
        },
        //电气火灾监测系统
        ElectricalFireMonitoring: {
            brand: '33', // 品牌
            modelNumber: '34', // 型号
            label: '35', // 设备标签
            childType: '69', // 部件类型
            childBrand: '70', // 部件品牌
            childModel: '71', // 部件型号
            transDev: {
                // 传输设备
                id: '116', // 传输设备分类
                电气火灾探测器: {
                    id: '117', // 传输设备品牌
                    modelNumber: '118' // 传输设备型号
                }
            }
        },
        //固定消防炮灭火系统
        FixedFireMonitorForFireFighting: {
            brand: '24', // 品牌
            modelNumber: '25', // 型号
            label: '26', // 设备标签
            childType: '60', // 部件类型
            childBrand: '61', // 部件品牌
            childModel: '62', // 部件型号
            transDev: {
                // 传输设备
                id: '81', // 传输设备分类
                消防泵监测仪: {
                    id: '82', // 传输设备品牌
                    modelNumber: '83' // 传输设备型号
                }
            }
        },
        //防排烟系统
        SmokeControl: {
            brand: '21', // 品牌
            modelNumber: '22', // 型号
            label: '23', // 设备标签
            childType: '57', // 部件类型
            childBrand: '58', // 部件品牌
            childModel: '59', // 部件型号
            transDev: {
                // 传输设备
                id: '119', // 传输设备分类
                防排烟监测仪: {
                    id: '120', // 传输设备品牌
                    modelNumber: '121' // 传输设备型号
                }
            }
        },
        //气体灭火系统
        GasExtinguishing: {
            brand: '27', // 品牌
            modelNumber: '28', // 型号
            label: '29', // 设备标签
            childType: '63', // 部件类型
            childBrand: '64', // 部件品牌
            childModel: '65', // 部件型号
            transDev: {
                // 传输设备
                id: '122', // 传输设备分类
                气体监测仪: {
                    id: '123', // 传输设备品牌
                    modelNumber: '124' // 传输设备型号
                }
            }
        },
        //防火分隔设施系统
        FireSeparationFacilities: {
            brand: '30', // 品牌
            modelNumber: '31', // 型号
            label: '32', // 设备标签
            childType: '66', // 部件类型
            childBrand: '67', // 部件品牌
            childModel: '68', // 部件型号
            transDev: {
                // 传输设备
                id: '125', // 传输设备分类
                防火分隔监测仪: {
                    id: '126', // 传输设备品牌
                    modelNumber: '127' // 传输设备型号
                }
            }
        },
        //NB独立探测器
        autonomousDevice: {
            label: '32', // 设备标签
            transDev: {
                // 传输设备
                id: '132', // 传输设备分类
                独立烟感探测器: {
                    id: '128', // 传输设备品牌
                    modelNumber: '129' // 传输设备型号
                },
                独立可燃气体探测器: {
                    id: '130', // 传输设备品牌
                    modelNumber: '131' // 传输设备型号
                }
            }
        }
    },
    dataDicChild: '', // 记录每页的数据字典参数
    typeList: [{
            index: 'FireAlarm-1',
            label: '火灾自动报警系统',
            id: 1
        },
        {
            index: 'CombustibleGasAlarm-2',
            label: '可燃气体报警系统',
            id: 2
        },
        {
            index: 'AutomaticSprinkler-3',
            label: '自动喷水灭火系统',
            id: 3
        },
        {
            index: 'WaterSprayFireExtinguishing-5',
            label: '水喷雾灭火系统',
            id: 5
        },
        {
            index: 'WaterMistFireFighting-6',
            label: '细水雾灭火系统',
            id: 6
        },
        {
            index: 'FireWaterSupplyAndHydrant-4',
            label: '消防给水及消防栓系统',
            id: 4
        },
        {
            index: 'FixedFireMonitorForFireFighting-7',
            label: '固定消防炮灭火系统',
            id: 7
        },
        {
            index: 'ElectricalFireMonitoring-11',
            label: '电气火灾监测系统',
            id: 11
        },
        {
            index: 'SmokeControl-8',
            label: '防排烟系统',
            id: 8
        },

        {
            index: 'GasExtinguishing-9',
            label: '气体灭火系统',
            id: 9
        },
        {
            index: 'FireSeparationFacilities-10',
            label: '防火分隔设施系统',
            id: 10
        },
        {
            index: 'autonomousDevice-12',
            label: 'NB独立设备',
            id: 12
        }
    ]
}
const getters = {}
const mutations = {
    // 设置点击新建
    SET_IS_NEW_FILE({ commit }, payload) {
        state.isNewFile = payload
    },
    // 调用组件的id
    SET_COMPONENT_ID({ commit }, payload) {
        state.componentId = payload
    },
    // tab组件active
    SET_SIDEBAR_ACTIVE({ commit }, payload) {
        state.sidebarActive = payload
    },
    // 设置显示内容
    SET_SHOW_CONTENT({ commit }, payload) {
        state.isShowContent = payload
    },
    // 页面类型
    SET_SIDEBAR_ACTIVE_ID({ commit }, payload) {
        state.sidebarActiveId = payload
    },
    // 页面类型字段(查询数据字典用)
    SET_SIDEBAR_ACTIVE_FIELD({ commit }, payload) {
        state.sidebarActiveField = payload
    },
    SET_DATA_DIC_CHILD({ commit }, payload) {
        state.dataDicChild = payload
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}