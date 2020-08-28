/*
 * @Author: mahuichun
 * @Date: 2020-05-18 21:23:06
 * @Last Modified by: dfk
 * @Last Modified time: 2020-08-03 19:19:10
 */
import secendRouterView from '../components/SecendRouterView'
import thirdRouterView from '../components/ThirdRouterView'
export default [
    // 智慧安防
    {
        path: '/intelligentSecurity',
        component: secendRouterView,
        children: [
            // 报警管理
            {
                path: '/intelligentSecurity/warnn',
                name: 'warnn',
                redirect: '/intelligentSecurity/warnn/alarmDeal',
                component: thirdRouterView,
                children: [{
                        path: '/intelligentSecurity/warnn/alarmDeal',
                        name: 'alarmHandling',
                        component: resolve => require(['../view/alarmManage/alarmReceive/AlarmDeal'], resolve),
                        menuName: '接警处置'
                    },
                    {
                        path: '/intelligentSecurity/warnn/eventHandling',
                        name: 'eventHandling',
                        component: resolve => require(['../view/alarmManage/eventDeal/EventDeal'], resolve),
                        menuName: '事件提醒'
                    },
                    {
                        path: '/intelligentSecurity/warnn/alarmHost',
                        name: 'alarmHost',
                        component: resolve => {
                            require(['../view/alarmManage/alarmHost/AlarmHostManage.vue'], resolve)
                        },
                        menuName: '报警主机管理'
                    },
                    {
                        path: '/intelligentSecurity/warnn/alarmConfig',
                        name: 'alarmConfig',
                        component: resolve => {
                            require(['../view/alarmManage/alarmConfig/AlarmConfig.vue'], resolve)
                        },
                        menuName: '报警配置管理'
                    },
                    {
                        path: '/intelligentSecurity/warnn/alarmLog',
                        name: 'alarmLog',
                        component: resolve => {
                            require(['../view/alarmManage/alarmLog/AlarmLog.vue'], resolve)
                        },
                        menuName: '报警日志'
                    }
                ],
                menuName: '报警管理'
            },
            // 视频管理
            {
                path: '/intelligentSecurity/video',
                redirect: '/intelligentSecurity/video/preview',
                component: thirdRouterView,
                name: 'video',
                children: [{
                        path: '/intelligentSecurity/video/preview',
                        name: 'preview',
                        component: resolve => require(['../view/videoManage/preview/index'], resolve),
                        menuName: '实时预览'
                    },
                    {
                        path: '/intelligentSecurity/video/playback',
                        name: 'playback',
                        component: resolve => require(['../view/videoManage/playback/index'], resolve),
                        menuName: '录像回放'
                    },
                    {
                        path: '/intelligentSecurity/video/download',
                        name: 'recordDownload',
                        component: resolve => require(['../view/videoManage/recordDownload/index'], resolve),
                        menuName: '录像下载'
                    },
                    {
                        path: '/intelligentSecurity/video/config',
                        name: 'videoConfig',
                        component: resolve => require(['../view/videoManage/videoConfig/index'], resolve),
                        menuName: '视频配置'
                    },
                    {
                        path: '/intelligentSecurity/video/recordConfig',
                        name: 'recordConfig',
                        component: resolve => require(['../view/videoManage/recordConfig/index'], resolve),
                        menuName: '录像配置'
                    },
                    {
                        path: '/intelligentSecurity/video/log',
                        name: 'videoLog',
                        component: resolve => require(['../view/videoManage/videoLog/index'], resolve),
                        menuName: '视频日志'
                    }
                ],
                menuName: '视频管理'
            },
            {
                path: '/intelligentSecurity/audioManager',
                name: 'audioManager',
                redirect: '/intelligentSecurity/audioManager/Resource',
                component: thirdRouterView,
                menuName: '音频管理',
                children: [{
                        path: '/intelligentSecurity/audioManager/Resource',
                        name: 'Resource',
                        component: resolve => require(['../view/audioManager/Resource/Resource.vue'], resolve),
                        menuName: '对讲资源'
                    },
                    {
                        path: '/intelligentSecurity/audioManager/radioMessage',
                        name: 'radioMessage',
                        component: resolve => require(['../view/audioManager/radioMessage/radioMessage.vue'], resolve),
                        menuName: '广播喊话'
                    },
                    {
                        path: '/intelligentSecurity/audioManager/manyIntercom',
                        name: 'manyIntercom',
                        component: resolve => require(['../view/audioManager/manyIntercom/manyIntercom.vue'], resolve),
                        menuName: '多方对讲'
                    },
                    {
                        path: '/intelligentSecurity/audioManager/voiceConfigure',
                        name: 'voiceConfigure',
                        component: resolve => require(['../view/audioManager/voiceConfigure/voiceConfigure.vue'], resolve),
                        menuName: '语音配置'
                    },
                    {
                        path: '/intelligentSecurity/audioManager/audioConfigure',
                        name: 'audioConfigure',
                        component: resolve => require(['../view/audioManager/audioConfigure/audioConfigure.vue'], resolve),
                        menuName: '音频配置'
                    },
                    {
                        path: '/intelligentSecurity/audioManager/logQuery',
                        name: 'logQuery',
                        component: resolve => require(['../view/audioManager/logQuery/logQuery.vue'], resolve),
                        menuName: '日志查询'
                    }
                ]
            },
            {
                path: '/intelligentSecurity/accessControl',
                name: 'accessControl',
                component: thirdRouterView,
                redirect: '/intelligentSecurity/accessControl/accessAdmin',

                //  component: resolve => require(['../view/accessControl/access'], resolve),
                menuName: '门禁管理',
                children: [{
                        path: '/intelligentSecurity/accessControl/accessAdmin',
                        name: 'accessAdmin',
                        component: () =>
                            import ('../view/accessControl/accessAdmin/adminIndex'),
                        menuName: '门禁管理',

                        meta: {
                            menu: '门禁管理'
                        }
                    },
                    {
                        path: '/intelligentSecurity/accessControl/accessManagement',
                        name: 'accessMan',
                        component: () =>
                            import ('../view/accessControl/accessManagement/index.vue'),
                        menuName: '门禁配置',
                        meta: {
                            menu: '门禁平台管理'
                        }
                    },
                    {
                        path: '/intelligentSecurity/accessControl/accessLog',
                        name: 'accessLog',
                        component: () =>
                            import ('../view/accessControl/accessLog/accessLog'),
                        menuName: '门禁日志'
                    }
                ]
            },

            {
                // 联动互锁门
                path: '/intelligentSecurity/airlock',
                name: 'airlock',
                component: thirdRouterView,
                menuName: '联动互锁门管理',
                redirect: '/intelligentSecurity/airlock/airlockControl',
                children: [{
                        path: '/intelligentSecurity/airlock/airlockControl',
                        name: 'airlockControl',
                        component: resolve => require(['../view/airlock/airlockControl/AirlockControl.vue'], resolve),
                        menuName: '互锁门控制'
                    },
                    {
                        path: '/intelligentSecurity/airlock/airlockLogs',
                        name: 'airlockLogs',
                        component: resolve => require(['../view/airlock/airlockLogs/AirlockLogs.vue'], resolve),
                        menuName: '日志查询'
                    }
                ]
            },
            {
                // 防护舱管理
                path: '/intelligentSecurity/protectiveCabin',
                component: thirdRouterView,
                name: 'protectiveCabin',
                menuName: '防护舱管理',
                children: [{
                        path: '/intelligentSecurity/protectiveCabin/management',
                        name: 'protectiveCabinManagement',
                        component: resolve => require(['../view/protectiveCabin/Management.vue'], resolve),
                        menuName: '防护舱管理'
                    },
                    {
                        path: '/intelligentSecurity/protectiveCabin/configuration',
                        name: 'protectiveCabinLConfiguration',
                        component: resolve => require(['../view/protectiveCabin/Configuration.vue'], resolve),
                        menuName: '防护舱配置'
                    },
                    {
                        path: '/intelligentSecurity/protectiveCabin/logs',
                        name: 'protectiveCabinLogs',
                        component: resolve => require(['../view/protectiveCabin/Logs.vue'], resolve),
                        menuName: '防护舱日志'
                    }
                ]
            },
            {
                // 停车管理
                path: '/intelligentSecurity/parkingManage',
                component: thirdRouterView,
                name: 'parkingManage',
                redirect: '/intelligentSecurity/parkingManage/realTime',
                menuName: '停车管理',
                children: [{
                        path: '/intelligentSecurity/parkingManage/realTime',
                        name: 'realTime',
                        component: resolve => require(['../view/parkingManage/realTime/realTime.vue'], resolve),
                        menuName: '实时过车'
                    },
                    {
                        path: '/intelligentSecurity/parkingManage/parkingRecord',
                        name: 'parkingRecord',
                        component: resolve => require(['../view/parkingManage/parkingRecord/parkingRecord.vue'], resolve),
                        menuName: '过车记录'
                    },
                    {
                        path: '/intelligentSecurity/parkingManage/parkingConfig',
                        name: 'parkingConfig',
                        component: resolve => require(['../view/parkingManage/parkingConfig/parkingConfig.vue'], resolve),
                        menuName: '停车配置'
                    },
                    {
                        path: '/intelligentSecurity/parkingManage/parkingLog',
                        name: 'parkingLog',
                        component: resolve => require(['../view/parkingManage/parkingLog/parkingLog.vue'], resolve),
                        menuName: '日志管理'
                    }
                ]
            },
            {
                // 金库远程管理
                path: '/intelligentSecurity/coffersManage',
                redirect: '/intelligentSecurity/coffersManage/remoteGuard',
                component: thirdRouterView,
                name: 'coffersManage',
                menuName: '金库远程管理',
                children: [{
                        path: '/intelligentSecurity/coffersManage/remoteGuard',
                        name: 'remoteGuard',
                        component: resolve => require(['../view/coffersManage/remoteGuard/remoteGuard'], resolve),
                        menuName: '金库远程值守'
                    },
                    {
                        path: '/intelligentSecurity/coffersManage/doorStatus',
                        name: 'doorStatus',
                        component: resolve => require(['../view/coffersManage/doorStatus/doorStatus'], resolve),
                        menuName: '金库门状态'
                    },
                    {
                        path: '/intelligentSecurity/coffersManage/superuser',
                        name: 'superuser',
                        component: resolve => require(['../view/coffersManage/superuser/superuser'], resolve),
                        menuName: '金库授权管理'
                    },
                    {
                        path: '/intelligentSecurity/coffersManage/log',
                        name: 'coffersLog',
                        component: resolve => require(['../view/coffersManage/coffersLog/coffersLog'], resolve),
                        menuName: '金库日志'
                    }
                ]
            },
            {
                // 安防设备管控
                path: '/intelligentSecurity/safetyManagement',
                redirect: '/intelligentSecurity/safetyManagement/equipmentInspection',
                component: thirdRouterView,
                name: 'safetyManagement',
                menuName: '安防设备管控',
                children: [
                  // {
                  //       path: '/intelligentSecurity/safetyManagement/equipmentStatus',
                  //       name: 'equipmentStatus',
                  //       component: resolve => require(['../view/safetyManagement/equipmentStatus/index.vue'], resolve),
                  //       menuName: '设备状态'
                  //   },
                    {
                        path: '/intelligentSecurity/safetyManagement/equipmentInspection',
                        name: 'equipmentInspection',
                        component: resolve => require(['../view/safetyManagement/equipmentInspection/index.vue'], resolve),
                        menuName: '设备巡检'
                    },
                    // {
                    //     path: '/intelligentSecurity/safetyManagement/videoInspection',
                    //     name: 'videoInspection',
                    //     component: resolve => require(['../view/safetyManagement/videoInspection/index.vue'], resolve),
                    //     menuName: '视频参数巡检'
                    // },
                    // {
                    //     path: '/intelligentSecurity/safetyManagement/videoFrequency',
                    //     name: 'videoFrequency',
                    //     component: resolve => require(['../view/safetyManagement/videoFrequency/index.vue'], resolve),
                    //     menuName: '录像时长巡检'
                    // },
                    {
                        path: '/intelligentSecurity/safetyManagement/systemTiming',
                        name: 'systemTiming',
                        component: resolve => require(['../view/safetyManagement/systemTiming/index.vue'], resolve),
                        menuName: '系统校时'
                    }
                    // {
                    //   path: '/intelligentSecurity/safetyManagement/faultManagement',
                    //   name: 'faultManagement',
                    //   component: resolve => require(['../view/safetyManagement/faultManagement/index.vue'], resolve),
                    //   menuName: '故障管理'
                    // }
                ]
            }
        ]
    },
    // 智慧消防
    {
        path: '/intelligentFire',
        component: secendRouterView,
        children: [{
                path: '/intelligentFire/alarmEmergencyResponse',
                name: 'alarmEmergencyResponse',
                redirect: '/intelligentFire/alarmEmergencyResponse/index',
                component: thirdRouterView,
                menuName: '报警应急处置',
                children: [{
                    path: '/intelligentFire/alarmEmergencyResponse/index',
                    name: 'alarmEmergencyResponseIndex',
                    component: resolve => require(['../view/intelligentFire/alarmEmergencyResponse.vue'], resolve)
                }]
            },
            {
                path: '/intelligentFire/onePicturePlatform',
                name: 'onePicturePlatform',
                // component: resolve => require(['../view/intelligentFire/onePicturePlatform.vue'], resolve),
                component: thirdRouterView,
                menuName: '一张图展示平台',
                children: [{
                        path: '/intelligentFire/onePicturePlatform/index',
                        name: 'map_fireDevice1',
                        component: resolve => require(['../view/map2D/Map2D.vue'], resolve),
                        menuName: '地图应用'
                    },

                    {
                        path: '/intelligentFire/onePicturePlatform/mapEdit',
                        name: 'map_fireDevice2',
                        component: resolve => require(['../view/map2DEdit/Map2DEdit.vue'], resolve),
                        menuName: '地图配置'
                    }
                ]
            },
            {
                path: '/intelligentFire/fireVisualization',
                name: 'fireVisualization',
                component: resolve => require(['../view/fireVisualization/bigData.vue'], resolve),
                menuName: '消防可视化展示',
                children: [{
                        path: '/intelligentFire/fireVisualization/index',
                        name: 'fireVisualizationfireVisualizationIndex',
                        component: resolve => require(['../view/fireVisualization/index.vue'], resolve)
                    },
                    {
                        path: '/intelligentFire/fireVisualization/reamTime',
                        name: 'fireVisualizationreamTime',
                        component: resolve => require(['../view/fireVisualization/pages/reamTime.vue'], resolve)
                    },
                    {
                        path: '/intelligentFire/fireVisualization/accesscControlData',
                        name: 'accesscControlDataaccesscControlData',
                        component: resolve => require(['../view/fireVisualization/pages/accesscControlData.vue'], resolve),
                        children: [{
                            path: '/intelligentFire/fireVisualization/accesscControlData/detail',
                            name: 'fireVisualizationdetailsList',
                            component: resolve => require(['../view/fireVisualization/fireViewList.vue'], resolve)
                        }]
                    },
                    {
                        path: '/intelligentFire/fireVisualization/electricalFire',
                        name: 'fireVisualizationwarningData',
                        component: resolve => require(['../view/fireVisualization/pages/electricalFire.vue'], resolve)
                    },
                    {
                        path: '/intelligentFire/fireVisualization/basicData',
                        name: 'fireVisualizationbasicData',
                        component: resolve => require(['../view/fireVisualization/pages/basicData.vue'], resolve)
                    }
                ]
            },
            {
                path: '/intelligentFire/equipmentInformationManagement',
                name: 'equipmentInformationManagement',
                component: thirdRouterView,
                menuName: '设备信息管理',
                redirect: '/intelligentFire/equipmentInformationManagement/systemManagement',
                children: [{
                        // 消防系统管理
                        path: '/intelligentFire/equipmentInformationManagement/systemManagement',
                        name: 'systemManagement',
                        component: resolve =>
                            require(['../view/intelligentFire/equipmentInformationManagement/systemManagement/index.vue'], resolve),
                        menuName: '消防系统管理'
                    },
                    // {
                    //     // 消防设备管理
                    //     path: '/intelligentFire/equipmentInformationManagement/equipmentManagement',
                    //     name: 'equipmentManagement',
                    //     component: resolve =>
                    //         require([
                    //             '../view/intelligentFire/equipmentInformationManagement/equipmentManagement/index.vue'
                    //         ], resolve),
                    //     menuName: '消防设备管理'
                    // },
                    {
                        // 设备数据管理
                        path: '/intelligentFire/equipmentInformationManagement/equipmentDatasManagement',
                        name: 'equipmentDatasManagement',
                        component: resolve =>
                            require([
                                '../view/intelligentFire/equipmentInformationManagement/equipmentDatasManagement/index.vue'
                            ], resolve),
                        menuName: '设备数据管理'
                    },
                    {
                        // 设备配置管理
                        path: '/intelligentFire/equipmentInformationManagement/equipmentConfigManagement',
                        name: 'equipmentConfigManagement',
                        component: resolve =>
                            require([
                                '../view/intelligentFire/equipmentInformationManagement/equipmentConfigManagement/index.vue'
                            ], resolve),
                        menuName: '设备配置管理'
                    },
                    {
                        // 消防日志
                        path: '/intelligentFire/equipmentInformationManagement/fireControlLog',
                        name: 'fireControlLog',
                        component: resolve =>
                            require(['../view/intelligentFire/equipmentInformationManagement/fireControlLog/index.vue'], resolve),
                        menuName: '消防日志'
                    }
                ]
            },
            {
                path: '/intelligentFire/fireOperationManagement',
                name: 'fireOperationManagement',
                redirect: '/intelligentFire/fireOperationManagement/hotWorkApproval',
                component: thirdRouterView,
                menuName: '消防运行管理',
                children: [{
                        // 动火审批
                        path: '/intelligentFire/fireOperationManagement/hotWorkApproval',
                        name: 'hotWorkApproval',
                        component: resolve =>
                            require(['../view/intelligentFire/fireOperationManagement/hotWorkApproval/index.vue'], resolve),
                        menuName: '动火审批'
                    },
                    {
                        // 巡检管理
                        path: '/intelligentFire/fireOperationManagement/patrolInspectionManagement',
                        name: 'patrolInspectionManagement',
                        component: resolve =>
                            require([
                                '../view/intelligentFire/fireOperationManagement/patrolInspectionManagement/index.vue'
                            ], resolve),
                        menuName: '巡检管理'
                    },
                    {
                        // 维保管理
                        path: '/intelligentFire/fireOperationManagement/maintenanceManagement',
                        name: 'maintenanceManagement',
                        component: resolve =>
                            require(['../view/intelligentFire/fireOperationManagement/maintenanceManagement/index.vue'], resolve),
                        menuName: '维保管理'
                    },
                    {
                        // 消防档案
                        path: '/intelligentFire/fireOperationManagement/fireFightingArchives',
                        name: 'fireFightingArchives',
                        component: resolve =>
                            require(['../view/intelligentFire/fireOperationManagement/fireFightingArchives/index.vue'], resolve),
                        menuName: '消防档案'
                    }
                ]
            },
            {
                path: '/intelligentFire/fireOperationManagement/assessmentRanking',
                name: 'assessmentManagement',
                component: thirdRouterView,
                menuName: '评估管理',
                children: [{
                        // 动火审批
                        path: '/intelligentFire/fireOperationManagement/assessmentRanking/assessmentRanking',
                        name: 'assessmentRanking',
                        component: resolve =>
                            require([
                                '../view/intelligentFire/assessmentManagement/assessmentRanking/assessmentRanking/index.vue'
                            ], resolve),
                        menuName: '评估排名'
                    },
                    {
                        // 巡检管理
                        path: '/intelligentFire/fireOperationManagement/assessmentReport',
                        name: 'assessmentReport',
                        component: resolve =>
                            require(['../view/intelligentFire/assessmentManagement/assessmentReport/index.vue'], resolve),
                        menuName: '消防评估配置'
                    }
                ]
            }
        ]
    },
    // AI智能应用
    {
        path: '/B',
        component: secendRouterView
    },
    // 中心值班管理
    {
        path: '/centerDutyManagement',
        component: secendRouterView,
        children: [{
                // 电视墙
                path: '/centerDutyManagement/tvWall',
                component: thirdRouterView,
                name: 'tvWall',
                menuName: '电视墙',
                children: [{
                        // 电视墙应用
                        path: '/centerDutyManagement/tvWall/tvWallUse',
                        name: 'tvWall',
                        component: resolve => require(['../view/tvWall/tvWallUse/index.vue'], resolve),
                        menuName: '电视墙应用'
                    },
                    {
                        // 电视墙配置
                        path: '/centerDutyManagement/tvWall/tvWallSet',
                        name: 'tvWallSet',
                        component: resolve => require(['../view/tvWall/tvWallSet/index.vue'], resolve),
                        menuName: '电视墙配置'
                    },
                    {
                        // 电视墙管理
                        path: '/centerDutyManagement/tvWall/tvWallManage',
                        name: 'tvWallManage',
                        component: resolve => require(['../view/tvWall/tvWallManage/index.vue'], resolve),
                        menuName: '电视墙管理'
                    },
                    {
                        // 日志查询
                        path: '/centerDutyManagement/tvWall/tvWallThelog',
                        name: 'tvWallThelog',
                        component: resolve => require(['../view/tvWall/tvWallThelog/index.vue'], resolve),
                        menuName: '日志查询'
                    }
                ]
            },
            {
                // 值班管理
                path: '/centerDutyManagement/dutyManagement',
                component: resolve => require(['../view/dutyManagement'], resolve),
                // component: thirdRouterView,
                name: 'dutyManagement',
                menuName: '值班管理',
                children: [{
                        name: 'dutyManagementAdmin',
                        path: '/centerDutyManagement/dutyManagement/dutyManagementAdmin',
                        component: resolve => require(['../view/dutyManagement/admin'], resolve)
                    },
                    {
                        name: 'dutyManagementUser',
                        path: '/centerDutyManagement/dutyManagement/dutyManagementUser',
                        component: resolve => require(['../view/dutyManagement/user'], resolve)
                    }
                ]
            },
            {
                // 协查管理 /centerDutyManagement/assistantManage/:id/startAssistant/:startAssistant
                path: '/centerDutyManagement/assistantManage',
                component: resolve => require(['../view/assistantManage'], resolve),
                name: 'assistantManage',
                menuName: '协查管理',
                children: [{
                    name: 'assistantManageAuthority',
                    path: ':id', //  /centerDutyManagement/assistantManage/:id
                    components: {
                        assistantManageAdmin: resolve => require(['../view/assistantManage/admin'], resolve),
                        assistantManageUser: resolve => require(['../view/assistantManage/user'], resolve)
                    },
                    children: [{
                            // 协查列表
                            path: 'list',
                            name: 'list',
                            component: resolve => require(['../view/assistantManage/admin/list.vue'], resolve),
                            menuName: '协查列表'
                        },
                        {
                            // 协查搜索
                            path: 'search',
                            name: 'search',
                            component: resolve => require(['../view/assistantManage/admin/search.vue'], resolve),
                            menuName: '协查搜索'
                        },
                        {
                            // 协查表单内数据
                            path: 'formData',
                            name: 'formData',
                            component: resolve => require(['../view/assistantManage/admin/formData.vue'], resolve),
                            menuName: '协查数据'
                        },
                        {
                            // 协查进展
                            name: 'assistantPropress',
                            path: 'assistantPropress/:assistantPropress',
                            component: resolve => require(['../view/assistantManage/user/child/assistantProgress'], resolve)
                        },
                        {
                            // 开始协查
                            name: 'startAssistant',
                            path: 'startAssistant/:startAssistant',
                            component: resolve => require(['../view/assistantManage/user/child/startAssistant'], resolve)
                        }
                    ]
                }]
            },
            {
                // 电子地图
                path: '/centerDutyManagement/map',
                name: 'map2D',
                component: thirdRouterView,
                menuName: '电子地图',
                children: [{
                        // 地图应用
                        path: '/centerDutyManagement/map',
                        name: 'map',
                        component: resolve => require(['../view/map2D/Map2D.vue'], resolve),
                        menuName: '地图应用'
                    },
                    {
                        // 地图配置
                        path: '/centerDutyManagement/map/mapEdit',
                        name: 'mapEdit',
                        component: resolve => require(['../view/map2DEdit/Map2DEdit.vue'], resolve),
                        menuName: '地图配置'
                    }
                ]
            }
        ]
    },
    // 系统维护
    {
        path: '/systemMaintenancet',
        component: secendRouterView,
        children: [
            // 基础信息
            {
                path: '/systemMaintenancet/basicInfo',
                name: 'basicInfo',
                component: thirdRouterView,
                menuName: '基础信息管理',
                children: [{
                        path: '/systemMaintenancet/basicInfo/orgManage',
                        name: 'orgManage',
                        component: resolve => require(['../view/systemMaintenancet/basicInfoManage/orgManage.vue'], resolve),
                        menuName: '机构管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/emphasisPart',
                        name: 'emphasisPart',
                        component: resolve => require(['../view/systemMaintenancet/basicInfoManage/emphasisPart.vue'], resolve),
                        menuName: '重点部位'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/peopleManage',
                        name: 'peopleManage',
                        component: resolve => require(['../view/systemMaintenancet/peopleManage/peopleManage.vue'], resolve),
                        menuName: '人员管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/roleManage',
                        name: 'roleManage',
                        component: resolve => require(['../view/systemMaintenancet/roleManage/roleManage.vue'], resolve),
                        menuName: '角色管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/powerManage',
                        name: 'powerManage',
                        component: resolve => require(['../view/systemMaintenancet/powerManage/powerManage.vue'], resolve),
                        menuName: '权限管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/onlineUserManage',
                        name: 'onlineUserManage',
                        component: resolve =>
                            require(['../view/systemMaintenancet/onlineUserManage/onlineUserManage.vue'], resolve),
                        menuName: '在线用户管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/cascadeUserManage',
                        name: 'cascadeUserManage',
                        component: resolve =>
                            require(['../view/systemMaintenancet/cascadeUserManage/cascadeUserManage.vue'], resolve),
                        menuName: '级联用户管理'
                    },
                    {
                        path: '/systemMaintenancet/basicInfo/frozenPeopleManage',
                        name: 'frozenPeopleManage',
                        component: resolve =>
                            require(['../view/systemMaintenancet/frozenPeopleManage/frozenPeopleManage.vue'], resolve),
                        menuName: '冻结用户管理'
                    }
                ]
            },
            //系统状态
            {
                path: '/systemMaintenancet/systemstate/anomaly',
                name: 'systemstate',
                component: thirdRouterView,
                menuName: '系统状态监控',
                children: [{
                        path: '/systemMaintenancet/systemstate/anomaly',
                        name: 'anomaly',
                        component: resolve => require(['../view/systemstate/anomaly/anomaly.vue'], resolve),
                        menuName: '系统状态异常'
                    },
                    {
                        path: '/systemMaintenancet/systemstate/monitoring',
                        name: 'monitoring',
                        component: resolve => require(['../view/systemstate/monitoring/monitoring.vue'], resolve),
                        menuName: '服务器监控'
                    },
                    {
                        path: '/systemMaintenancet/systemstate/anomalylog',
                        name: 'anomalylog',
                        component: resolve => require(['../view/systemstate/anomalylog/anomalylog.vue'], resolve),
                        menuName: '异常日志'
                    }
                ]
            },
            // 系统运维
            {
                path: '/systemMaintenancet/systemOperationManage/systemParameters',
                name: 'systemOperationManage',
                component: thirdRouterView,
                menuName: '系统运维管理',
                children: [{
                        path: '/systemMaintenancet/systemOperationManage/systemParameters',
                        name: 'systemParameters',
                        component: resolve =>
                            require(['../view/systemOperationManage/systemParameters/systemParameters.vue'], resolve),
                        menuName: '系统参数'
                    },
                    // {
                    //     path: '/systemMaintenancet/systemOperationManage/dataDictionary',
                    //     name: 'dataDictionary',
                    //     component: resolve => require(['../view/systemOperationManage/dataDictionary/dataDictionary.vue'], resolve),
                    //     menuName: '数据字典'
                    // },
                    {
                        path: '/systemMaintenancet/systemOperationManage/businessParameterConfig',
                        name: 'businessParameterConfig',
                        component: resolve =>
                            require(['../view/systemOperationManage/businessParameterConfig/businessParameterSet.vue'], resolve),
                        menuName: '业务参数配置'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/serverManagement',
                        name: 'serverManagement',
                        component: resolve =>
                            require(['../view/systemOperationManage/serverManagement/serverManagement.vue'], resolve),
                        menuName: '服务器管理'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/serviceManagement',
                        name: 'serviceManagement',
                        component: resolve =>
                            require(['../view/systemOperationManage/serviceManagement/serviceManagement.vue'], resolve),
                        menuName: '服务管理'
                    },
                    // {
                    //     path: '/systemMaintenancet/systemOperationManage/cascadeManagement',
                    //     name: 'cascadeManagement',
                    //     component: resolve =>
                    //         require(['../view/systemOperationManage/cascadeManagement/cascadeManagement.vue'], resolve),
                    //     menuName: '级联管理'
                    // },
                    {
                        path: '/systemMaintenancet/systemOperationManage/timeTemplate',
                        name: 'timeTemplate',
                        component: resolve => require(['../view/systemOperationManage/timeTemplate/timeTemplate.vue'], resolve),
                        menuName: '时间模板'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/preventDrowsy',
                        name: 'preventDrowsy',
                        component: resolve => require(['../view/systemOperationManage/preventDrowsy/preventDrowsy.vue'], resolve),
                        menuName: '防瞌睡'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/visitControl',
                        name: 'visitControl',
                        component: resolve => require(['../view/systemOperationManage/visitControl/visitControl.vue'], resolve),
                        menuName: '访问控制'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/messageControl',
                        name: 'messageControl',
                        component: resolve => require(['../view/systemOperationManage/messageControl/messageControl.vue'], resolve),
                        menuName: '短信管理'
                    },
                    {
                        path: '/systemMaintenancet/systemOperationManage/regularReminder',
                        name: 'regularReminder',
                        component: resolve =>
                            require(['../view/systemOperationManage/regularReminder/regularReminder.vue'], resolve),
                        menuName: '定时提醒'
                    }
                ]
            }
        ]
    },
    //业务联动
    {
        path: '/business',
        component: secendRouterView,
        children: [
            //业务系统联动
            {
                path: '/business/navmenu',
                name: 'navmenu',
                component: thirdRouterView,
                redirect: '/business/navmenu/navmenu',
                menuName: '业务系统联动',
                children: [{
                        path: '/business/navmenu/navmenu',
                        name: 'navmenu',
                        component: resolve => require(['../view/business/navmenu.vue'], resolve),
                        menuName: '风险RAD系统对接'
                    },
                    {
                        path: '/business/navmenu/messages',
                        name: 'messages',
                        component: resolve => require(['../view/business/businesssystem/messagesystem/messages.vue'], resolve),
                        menuName: '短信系统对接'
                    },
                    {
                        path: '/business/navmenu/recognitionsystem',
                        name: 'recognitionsystem',
                        component: resolve => require(['../view/business/businesssystem/recognitionsystem/warning.vue'], resolve),
                        menuName: '信访识别预警'
                    }
                ]
            },
            //  监管系统对接
            {
                path: '/business/supervise',
                name: 'supervise',
                component: thirdRouterView,
                menuName: '监管系统对接',
                children: [{
                    path: '/business/supervise/supervise',
                    name: 'supervise',
                    component: resolve => require(['../view/business/supervise/supervise.vue'], resolve),
                    menuName: '国标互联'
                }]
            }
        ]
    },
    // 大数据
    {
        path: '/bigData',
        component: resolve => require(['../view/bigData/bigData.vue'], resolve),

        children: [{
                path: '/bigData/index',
                name: 'bigDataIndex',
                component: resolve => require(['../view/bigData/index.vue'], resolve)
            },
            {
                path: '/bigData/accesscControlData',
                name: 'accesscControlData',
                component: resolve => require(['../view/bigData/pages/accesscControlData.vue'], resolve)
            },
            {
                path: '/bigData/warningData',
                name: 'warningData',
                component: resolve => require(['../view/bigData/pages/warningData.vue'], resolve)
            },
            {
                path: '/bigData/basicData',
                name: 'basicData',
                component: resolve => require(['../view/bigData/pages/basicData.vue'], resolve)
            }
        ]
    },

    // 日常安全管理
    {
        path: '/dailySafety',
        component: secendRouterView,
        children: [{
                path: '/dailySafety/personnelManage/AccessData/index',
                name: 'personnelManage',
                component: thirdRouterView,
                redirect: '/dailySafety/personnelManage/personnel/AccessData/index',
                menuName: '人员出入管控',
                children: [{
                    path: '/dailySafety/personnelManage/personnel/AccessData/index',
                    name: 'personnel',
                    component: resolve => require(['../view/personnelManage/personnel/AccessData/index.vue'], resolve),
                    menuName: '人员出入管控'
                }]
            },
            {
                path: '/dailySafety/visitor/apply/index',
                name: 'visitor',
                component: thirdRouterView,
                children: [{
                        path: '/dailySafety/visitor/apply/index',
                        name: 'apply',
                        component: resolve => require(['../view/dailySafety/visitor/apply/index.vue'], resolve),
                        menuName: '访客申请'
                    },
                    {
                        path: '/dailySafety/visitor/statistics/index',
                        name: 'statistics',
                        component: resolve => require(['../view/dailySafety/visitor/statistics/index.vue'], resolve),
                        menuName: '访客统计'
                    },
                    {
                        path: '/dailySafety/visitor/configure/index',
                        name: 'configure',
                        component: resolve => require(['../view/dailySafety/visitor/configure/index.vue'], resolve),
                        menuName: '审批配置'
                    }
                ],
                menuName: '访客管理'
            },
            {
                path: '/dailySafety/overtime/index',
                name: 'overtime',
                component: thirdRouterView,
                children: [{
                        path: '/dailySafety/overtime/index',
                        name: 'construction',
                        component: resolve => require(['../view/dailySafety/overtime/index.vue'], resolve),
                        menuName: '施工加班管理'
                    },
                    {
                        path: '/dailySafety/overtime/holiday',
                        name: 'Holiday',
                        component: resolve => require(['../view/dailySafety/overtime/holiday.vue'], resolve),
                        menuName: '节假日加班人员管理'
                    }
                ],
                menuName: '加班管理'
            },
            {
                path: '/dailySafety/outsourcing/index',
                name: 'management',
                component: thirdRouterView,
                children: [{
                    path: '/dailySafety/outsourcing/index',
                    name: 'management',
                    component: resolve => require(['../view/dailySafety/outsourcing/index.vue'], resolve),
                    menuName: '外委公司管理'
                }],
                menuName: '外委公司管理'
            },
            {
                path: '/dailySafety/construction/construction',
                name: 'construction',
                component: thirdRouterView,
                children: [{
                    path: '/dailySafety/construction/construction',
                    name: 'construction',
                    component: resolve => require(['../view/dailySafety/construction/construction.vue'], resolve),
                    menuName: '施工报备'
                }],
                menuName: '施工报备'
            },
            {
                path: '/dailySafety/belongings/belongings',
                name: 'belongings',
                component: thirdRouterView,
                children: [{
                        path: '/dailySafety/belongings/belongings',
                        name: 'belongings',
                        component: resolve => require(['../view/dailySafety/belongings/belongings.vue'], resolve),
                        menuName: '携物管理'
                    },
                    {
                        path: '/dailySafety/belongings/belongings',
                        name: 'Dangerous',
                        component: resolve => require(['../view/dailySafety/belongings/belongings.vue'], resolve),
                        menuName: '危险品核查记录'
                    }
                ],
                menuName: '携物管理'
            },
            {
                path: '/dailySafety/drill/drillIndex',
                name: 'drill',
                component: thirdRouterView,
                children: [{
                    path: '/dailySafety/drill/drillIndex',
                    name: 'drill',
                    component: resolve => require(['../view/dailySafety/drill/drillIndex.vue'], resolve),
                    menuName: '演练管理'
                }],
                menuName: '演练管理'
            },
            {
                path: '/dailySafety/case/risk',
                name: 'case',
                component: thirdRouterView,
                children: [{
                        path: '/dailySafety/case/risk',
                        name: 'risk',
                        component: resolve => require(['../view/dailySafety/case/risk/index.vue'], resolve),
                        menuName: '案件及风险事件管理'
                    },
                    {
                        path: '/dailySafety/case/group',
                        name: 'group',
                        component: resolve => require(['../view/dailySafety/case/group/index.vue'], resolve),
                        menuName: '群体性事件管理'
                    },
                    {
                        path: '/dailySafety/case/accident',
                        name: 'accident',
                        component: resolve => require(['../view/dailySafety/case/accident/index.vue'], resolve),
                        menuName: '安全事故信息管理'
                    },
                    {
                        path: '/dailySafety/case/disaster',
                        name: 'disaster',
                        component: resolve => require(['../view/dailySafety/case/disaster/index.vue'], resolve),
                        menuName: '自然灾害信息管理'
                    },
                    {
                        path: '/dailySafety/case/interception',
                        name: 'interception',
                        component: resolve => require(['../view/dailySafety/case/Interception/index.vue'], resolve),
                        menuName: '成功堵截案例事件'
                    }
                ],
                menuName: '案件事件管理'
            },
            {
                path: '/dailySafety/headOffice',
                name: 'headOffice',
                component: thirdRouterView,
                menuName: '总行本级安全管理',
                children: [{
                        path: '/dailySafety/headOffice/annual',
                        name: 'annual',
                        component: resolve => require(['../view/headOffice/annual/annual.vue'], resolve),
                        menuName: '年度考核'
                    },
                    {
                        path: '/dailySafety/headOffice/dailyManage',
                        name: 'dailyManage',
                        component: resolve => require(['../view/headOffice/dailyManage/dailyManage.vue'], resolve),
                        menuName: '日常管理'
                    },
                    {
                        path: '/dailySafety/headOffice/dutyManage',
                        name: 'dutyManage',
                        component: resolve => require(['../view/headOffice/dutyManage/dutyManage.vue'], resolve),
                        menuName: '值班管理'
                    },
                    {
                        path: '/dailySafety/headOffice/workPlan',
                        name: 'workPlan',
                        component: resolve => require(['../view/headOffice/workPlan/workPlan.vue'], resolve),
                        menuName: '工作计划'
                    },
                    {
                        path: '/dailySafety/headOffice/emergencyManage',
                        name: 'emergencyManage',
                        component: resolve => require(['../view/headOffice/emergencyManage/emergency.vue'], resolve),
                        menuName: '应急管理'
                    },
                    {
                        path: '/dailySafety/headOffice/suggest',
                        name: 'suggest',
                        component: resolve => require(['../view/headOffice/suggest/suggest.vue'], resolve),
                        menuName: '建议反馈'
                    },
                    {
                        path: '/dailySafety/headOffice/organManage',
                        name: 'organManage',
                        component: resolve => require(['../view/headOffice/organManage/organManage.vue'], resolve),
                        menuName: '机构管理'
                    },
                    {
                        path: '/dailySafety/headOffice/configManage',
                        name: 'configManage',
                        component: resolve => require(['../view//headOffice/configManage/configManage.vue'], resolve),
                        menuName: '配置管理'
                    },
                    {
                        path: '/dailySafety/headOffice/statistics',
                        name: 'statistics',
                        component: resolve => require(['../view/headOffice/statistics/statistics.vue'], resolve),
                        menuName: '统计分析'
                    }
                ]
            },
            // {
            //     path: '/securityCeck/index',
            //     name: 'securityHome',
            //     component: thirdRouterView,
            //     menuName: '安全检查',
            //     children: [{
            //         path: '/securityCeck/hiddenManage/manage',
            //         name: 'manage',
            //         component: resolve => require(['../view/securityAdministration/index.vue'], resolve),
            //         menuName: '隐患检查'
            //     }]
            // },
            {
                path: '/dailySafety/systemManagement',
                name: 'systemManagement',
                component: thirdRouterView,
                menuName: '制度和安全',
                children: [{
                        path: '/dailySafety/systemManagement/system',
                        name: 'system',
                        component: resolve => require(['../view/systemManagement/system/System.vue'], resolve),
                        menuName: '规章制度管理'
                    },
                    {
                        path: '/dailySafety/systemManagement/emergency',
                        name: 'emergency',
                        component: resolve => require(['../view/systemManagement/emergency/Emergency.vue'], resolve),
                        menuName: '应急预案管理'
                    }
                ]
            },
            {
                path: '/maintenanceManagement/maintenanceManagement',
                name: 'maintenanceManagement',
                component: thirdRouterView,
                menuName: '维保管理',
                children: [{
                        path: '/maintenanceManagement/maintenanceManagement/taskManagement',
                        name: 'taskManagement',
                        component: resolve => require(['../view/maintenanceManagement/taskManagement.vue'], resolve),
                        menuName: '维保任务管理'
                    },
                    {
                        path: '/maintenanceManagement/maintenanceManagement/taskTotal',
                        name: 'taskTotal',
                        component: resolve => require(['../view/maintenanceManagement/taskTotal.vue'], resolve),
                        menuName: '维保任务统计'
                    },
                    {
                        path: '/maintenanceManagement/maintenanceManagement/orderManagement',
                        name: 'orderManagement',
                        component: resolve => require(['../view/maintenanceManagement/orderManagement.vue'], resolve),
                        menuName: '工单管理'
                    },
                    {
                        path: '/maintenanceManagement/maintenanceManagement/orderTotal',
                        name: 'orderTotal',
                        component: resolve => require(['../view/maintenanceManagement/orderTotal.vue'], resolve),
                        menuName: '工单统计'
                    },
                    {
                        path: '/maintenanceManagement/maintenanceManagement/detailForm',
                        name: 'detailForm',
                        component: resolve => require(['../view/maintenanceManagement/detailForm.vue'], resolve)
                    },
                    {
                        path: '/maintenanceManagement/maintenanceManagement/searchList',
                        name: 'searchList',
                        component: resolve => require(['../view/maintenanceManagement/searchList.vue'], resolve)
                    }
                ]
            }
        ]
    }
]
/*





*/