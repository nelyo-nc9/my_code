/**
 * 获取节点图标
 * icon分类：
 *          ORG(机构)(1-9)：总行-1；一级-2；二级-3；二+级机构（支行/分理处）-4；
 *          LOC(重点部位)(10-19;LOC_10-LOC_19)：营业网点-10；金库-11;计算机房-12;办公楼-13;自助银行-14;自助设备-15;自助银亭-16;私人银行-17;保险箱库-18;档案室-19;远程监控中心-'LOC_10';5G智能银行-'LOC_11'；财富中心-'LOC_12';其他重点部位-'LOC_13'
 *          录像机(20-29)：NVR-20；HNVR-21；DVR-22；VNVR-23；
 *          摄像头(30-39)：枪机-30；红外枪击-31；半球-32；快球-33；全景-34;球机-35；针孔-36；智能IPC-37; 视频主机设备-38;
 *          报警(40-49)：40-49；报警主机-40； 报警输入-41； 报警输出-42; 探测器-43;门磁-44;紧急按钮-45;
 *          门禁(50-59)：50-59；门禁主机设备50；门禁通道-51；读头-52，输入-53;闸机-54；
 *          文件夹(60-69)：60-69；默认60
 *          对讲主机设备(70-79)：对讲主机设备-70；对讲通道-71;
 *          防护舱主机设备(80-89): 防护舱主机设备-80; 防护舱通道-81;
 *          停车场(90-99):停车场-90; 出入口通道-91;
 *          拼控解码一体机(100-109):拼控解码一体机-100;解码器通道-101;本地电视输入通道-102
 *          火灾报警主机(110-119):火灾报警主机-110;手动报警按钮-111;感烟探测器-112;感温探测器-113;总线隔离模块-114;
 *          喷淋泵(120-129):喷淋泵-120;末端排水装置-121;末端试水装置-122;湿式报警阀组-123;
 *          室内消火栓(130-139):室内消火栓-130;消防水池-131;高位水箱-132;稳压泵-133;消火栓泵-134;
 *          防排烟系统(140-149):防排烟系统-140
 *          固定消防炮灭火系统(150-159):固定消防炮灭火系统-150
 *          系统主机(160-169):系统主机-160
 *          防火分隔设施(170-179):防火分隔设施-170
 *          电气火灾监测系统(180-189):电气火灾监测系统-180
 *          NB独立探测器(190-199):NB独立探测器-190
 *
 *   
 * 后台配置：
 *          录像机`(20-29)`：NVR- `video_host_1`；HNVR（HDVR？？？）- `video_host_2`；DVR-`video_host_3`；VNVR-`video_host_5`；

            摄像头`(30-39)`：枪机-`video_channel_1_1`；红外枪击-`video_channel_1_5`；半球-`video_channel_1_2`；快球-???；全景-`video_channel_1_7`；球机-`video_channel_1_3`；针孔-`video_channel_1_4`；智能IPC-`video_channel_1_6`； 视频主机设备-`???`

            文件夹`(60-69)`：视频收藏夹 - `video_favorite`；

            电视墙：m3解码器-`tvwall_host_1`(没有找到图标)；B20解码拼控一体机-`tvwall_host_2`；LED - `tvwall_host_3`（没有找到） ,海康解码器 - `tvwall_host_4`(没有找到),本地电视输入通道 - `tvwall_channel_2` 本地电视输出通道 - `tvwall_channel_1`(没有找到)

 */
const iconList = {
  organise: {
    class: 'icon-loufangdianwei',
    title: '机构'
  },
  1: {
    class: 'icon iconfont-ccb ccbzonghang',
    title: '总行'
  },
  2: {
    class: 'icon iconfont-ccb ccbyijifenhang',
    title: '一级分行'
  },
  3: {
    class: 'icon iconfont-ccb ccberjifenhang',
    title: '二级分行'
  },
  4: {
    class: 'icon iconfont-ccb ccbzhihang_fenlichu',
    title: '支行/分理处'
  },
  10: {
    class: 'icon iconfont-ccb ccbyingyewangdian',
    title: '营业网点'
  },
  11: {
    class: 'icon iconfont-ccb ccbjinku',
    title: '金库'
  },
  12: {
    class: 'icon iconfont-ccb ccbjisuanjifang',
    title: '计算机房'
  },
  13: {
    class: 'icon iconfont-ccb ccbbangonglou',
    title: '办公楼'
  },
  14: {
    class: 'icon iconfont-ccb ccbzizhuyinhang',
    title: '自助银行'
  },
  15: {
    class: 'icon iconfont-ccb ccbzizhushebei',
    title: '自助设备'
  },
  16: {
    class: 'icon iconfont-ccb ccbzizhuyinting',
    title: '自助银亭'
  },
  17: {
    class: 'icon iconfont-ccb ccbsirenyinhang',
    title: '私人银行'
  },
  18: {
    class: 'icon iconfont-ccb ccbbaoxianxiangku',
    title: '保险箱库'
  },
  19: {
    class: 'icon iconfont-ccb ccbdanganshi',
    title: '档案室'
  },
  'LOC_10': {
    class: 'icon iconfont-ccb ccbyuanchengjiankongzhongxin',
    title: '远程监控中心'
  },
  'LOC_11': {
    class: 'icon iconfont-ccb ccb5gzhinengyinhang',
    title: '5G智能银行'
  },
  'LOC_12': {
    class: 'icon iconfont-ccb ccbcaifuzhongxin',
    title: '财富中心'
  },
  'LOC_13': {
    class: 'icon iconfont-ccb ccbqitazhongdianbuwei',
    title: '其他重点部位'
  },
  keyPart: {
    class: 'icon-zhuye',
    title: '重点部位'
  },
  equipment: {
    class: 'icon-equipment',
    title: '设备'
  },
  alarmMainframe: {
    class: 'icon-baojingzhuji',
    title: '报警主机报警'
  },
  fireAlarm: {
    class: 'icon-xiaofangcailiao',
    title: '消防报警'
  },
  alarmIn: {
    class: 'icon-alarm-input',
    title: '报警输入'
  },
  alarmEid: {
    class: 'icon-qiangji1',
    title: '报警通道'
  },
  laneNumber: {
    class: 'icon-intersection',
    title: '路口'
  },
  direction: {
    class: 'icon-roadway',
    title: '车道'
  },
  powerType: {
    class: 'icon-jurisdiction',
    title: '权限'
  },
  entranceGuard: {
    class: 'icon-menjin1',
    title: '门禁'
  },
  alarmBox: {
    class: 'icon-baojingxiang2',
    title: '报警箱'
  },
  alarmPillar: {
    class: 'icon-baojingzhu1',
    title: '报警柱'
  },
  nvr: {
    class: 'icon-Tree-DVR-CH',
    title: 'NVR'
  },
  grid: {
    class: 'icon-grid',
    title: '网格'
  },
  building: {
    class: 'icon-loufangdianwei',
    title: '楼宇'
  },
  storey: {
    class: 'icon-tuceng',
    title: '楼层'
  },
  patrol: {
    class: 'icon-dianzixungeng',
    title: '巡更点位'
  },
  20: {
    class: 'icon iconfont icon-equipment',
    title: 'NVR'
  },
  'video_host_1': {
    class: 'icon iconfont icon-equipment',
    title: 'NVR'
  },
  'video_host_2': {
    class: 'icon iconfont icon-equipment',
    title: 'HDVR'
  },
  'video_host_3': {
    class: 'icon iconfont icon-equipment',
    title: 'DVR'
  },
  'video_host_5': {
    class: 'icon iconfont icon-equipment',
    title: 'VNVR'
  },
  30: {
    // class: 'icon-qiangji', // 2019-06-17，改为实心图标
    // class: 'icon-video-gun',
    class: 'icon iconfont-ccb ccbqiangji',
    title: '枪机'
  },
  'video_channel_1_1': {
    // class: 'icon-qiangji', // 2019-06-17，改为实心图标
    // class: 'icon-video-gun',
    class: 'icon iconfont-ccb ccbqiangji',
    title: '枪机'
  },
  31: {
    // class: 'icon-hongwaiqiangji', // 2019-06-17，改为实心图标
    // class: 'icon-video-gun1',
    class: 'icon iconfont-ccb ccbhongwaiqiangji',
    title: '红外枪机'
  },
  'video_channel_1_5': {
    // class: 'icon-hongwaiqiangji', // 2019-06-17，改为实心图标
    // class: 'icon-video-gun1',
    class: 'icon iconfont-ccb ccbhongwaiqiangji',
    title: '红外枪机'
  },
  32: {
    // class: 'icon-banqiu',
    class: 'icon iconfont-ccb ccbbanqiu',
    title: '半球'
  },
  'video_channel_1_2': {
    // class: 'icon-banqiu',
    class: 'icon iconfont-ccb ccbbanqiu',
    title: '半球'
  },
  33: {
    // class: 'icon-kuaiqiu', // 2019-06-17，改为实心图标
    class: 'icon-video-ball',
    title: '快球'
  },
  34: {
    // class: 'icon-quanjing',
    class: 'icon iconfont-ccb ccbquanjing',
    title: '全景'
  },
  'video_channel_1_7': {
    // class: 'icon-quanjing',
    class: 'icon iconfont-ccb ccbquanjing',
    title: '全景'
  },
  35: {
    class: 'icon iconfont-ccb ccbqiuji',
    title: '球机'
  },
  'video_channel_1_3': {
    class: 'icon iconfont-ccb ccbqiuji',
    title: '球机'
  },
  36: {
    class: 'icon iconfont-ccb ccbzhenkong',
    title: '针孔'
  },
  'video_channel_1_4': {
    class: 'icon iconfont-ccb ccbzhenkong',
    title: '针孔'
  },
  37: {
    class: 'icon iconfont-ccb ccbzhinengIPC',
    title: '智能IPC'
  },
  'video_channel_1_6': {
    class: 'icon iconfont-ccb ccbzhinengIPC',
    title: '智能IPC'
  },
  38: {
    class: 'icon iconfont-ccb ccbshipinzhuji1',
    title: '视频主机设备'
  },
  40: {
    class: 'icon iconfont-ccb ccbbaojingzhuji1',
    title: '报警主机'
  },
  41: {
    class: 'icon iconfont icon-alarm-input',
    title: '报警输入'
  },
  42: {
    class: 'icon iconfont icon-alarm-output',
    title: '报警输出'
  },
  43: {
    class: 'icon iconfont-ccb ccbtanceqi',
    title: '探测器'
  },
  44: {
    class: 'icon iconfont-ccb ccbmenci',
    title: '门磁'
  },
  45: {
    class: 'icon iconfont-ccb ccbjinjianniu',
    title: '紧急按钮'
  },
  50: {
    class: 'icon iconfont-ccb ccbmenjinzhuji1',
    title: '门禁主机'
  },
  51: {
    class: 'icon iconfont-ccb ccbmenjintongdao',
    title: '门禁通道'
  },
  52: {
    class: 'icon iconfont icon-menjin1',
    title: '门禁读头'
  },
  53: {
    class: 'icon iconfont icon-menjinxitong',
    title: '门禁输入'
  },
  54: {
    class: 'icon iconfont-ccb ccbzhaji',
    title: '闸机'
  },
  60: {
    class: 'icon iconfont icon-yewuguanli',
    title: '文件夹'
  },
  'video_favorite': {
    class: 'icon iconfont-ccb ccbwenjian',
    title: '视频收藏夹'
  },
  70: {
    class: 'icon iconfont-ccb ccbduijiangzhuji',
    title: '对讲主机'
  },
  71: {
    class: 'icon iconfont-ccb ccbduijiangtongdao',
    title: '对讲通道'
  },
  80: {
    class: 'icon iconfont-ccb ccbfanghucangzhuji',
    title: '防护舱主机'
  },
  81: {
    class: 'icon iconfont-ccb ccbfanghucangtongdao',
    title: '防护舱通道'
  },
  90: {
    class: 'icon iconfont-ccb ccbtingchechang',
    title: '停车场'
  },
  91: {
    class: 'icon iconfont-ccb ccbchurukoutongdao',
    title: '出入口通道'
  },
  100: {
    class: 'icon iconfont-ccb ccbpinkongjiemayitiji',
    title: '拼控解码一体机'
  },
  101: {
    class: 'icon iconfont-ccb ccbjiemaqitongdao',
    title: '解码器通道'
  },
  102: {
    class: 'icon iconfont-ccb ccbbendidianshishurutongdao',
    title: '本地电视输入通道'
  },
  110: {
    class: 'icon iconfont-ccb ccbhuozaibaojingzhuji',
    title: '火灾报警主机'
  },
  111: {
    class: 'icon iconfont-ccb ccbbendidianshishurutongdao',
    title: '手动报警按钮'
  },
  112: {
    class: 'icon iconfont-ccb ccbshoudongbaojinganniu',
    title: '感烟探测器'
  },
  113: {
    class: 'icon iconfont-ccb ccbganwentanceqi',
    title: '感温探测器'
  },
  114: {
    class: 'icon iconfont-ccb ccbzongxiangelimokuai',
    title: '总线隔离模块'
  },
  120: {
    class: 'icon iconfont-ccb ccbpenlinbeng',
    title: '喷淋泵'
  },
  121: {
    class: 'icon iconfont-ccb ccbmoduanpaishuizhuangzhi',
    title: '末端排水装置'
  },
  122: {
    class: 'icon iconfont-ccb ccbzongxiangelimokuai',
    title: '末端试水装置'
  },
  123: {
    class: 'icon iconfont-ccb ccbmoduanshishuizhuangzhi',
    title: '湿式报警阀组'
  },
  130: {
    class: 'icon iconfont-ccb ccbshineixiaohuoshuan',
    title: '室内消火栓'
  },
  131: {
    class: 'icon iconfont-ccb ccbxiaofangshuichi',
    title: '消防水池'
  },
  132: {
    class: 'icon iconfont-ccb ccbgaoweishuixiang',
    title: '高位水箱'
  },
  133: {
    class: 'icon iconfont-ccb ccbwenyabeng',
    title: '稳压泵'
  },
  134: {
    class: 'icon iconfont-ccb ccbxiaohuoshuanbeng',
    title: '消火栓泵'
  },
  140: {
    class: 'icon iconfont-ccb ccbfangpaiyanxitong',
    title: '防排烟系统'
  },
  150: {
    class: 'icon iconfont-ccb ccbgudingxiaofangpaomiehuoxitong',
    title: '固定消防炮灭火系统'
  },
  160: {
    class: 'icon iconfont-ccb ccbxitongzhuji',
    title: '系统主机'
  },
  170: {
    class: 'icon iconfont-ccb ccbfanghuofengesheshi',
    title: '防火分隔设施'
  },
  180: {
    class: 'icon iconfont-ccb ccbdianqihuozaijiancexitong',
    title: '电气火灾监测系统'
  },
  190: {
    class: 'icon iconfont-ccb ccbNBdulitanceqi',
    title: 'NB独立探测器'
  },
  renxiangshibie: {
    class: 'icon-renxiangshibie',
    title: '人脸抓拍'
  },
  jiaotongshibie: {
    class: 'icon-jiaotongshibie',
    title: '交通抓拍'
  },
  defaultDev: {
    class: 'icon-video-gun',
    title: '枪机'
  },
  'tvwall_host_1': {
    class: 'icon iconfont-ccb ccbNBdulitanceqi',
    title: 'm3解码器'
  },
  'tvwall_host_2': {
    class: 'icon iconfont-ccb ccbpinkongjiemayitiji',
    title: 'B20解码拼控一体机'
  },
  'tvwall_host_3': {
    class: 'icon iconfont-ccb ccbpinkongjiemayitiji',
    title: 'LED'
  },
  'tvwall_host_4': {
    class: 'icon iconfont-ccb ccbjiemaqitongdao',
    title: '海康解码器'
  },
  'tvwall_channel_2': {
    class: 'icon iconfont-ccb ccbbendidianshishurutongdao',
    title: '本地电视输入通道'
  },
  'tvwall_channel_1': {
    class: 'icon iconfont-ccb ccbjiemaqitongdao',
    title: '本地电视输出通道'
  }
}
// 懒加载树的图标
export const getNodeIcon = (item) => {
  if (item.icon && iconList[item.icon]) {
    return iconList[item.icon]
  } else if (item.tierType === 'org') {
    return iconList.organise
  } else if (item.tierType === 'loc') {
    return iconList.keyPart
  } else if (item.tierType === 'equ') {
    return iconList.equipment
  } else if (item.tierType === 'res') {
    return iconList.defaultDev
  } else {
    return iconList.defaultDev
  }
}
