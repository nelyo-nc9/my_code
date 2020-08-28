const poiTypeAll = [
  {
    oneType: '餐饮',
    twoType: '餐馆',
    threeType: '中餐馆',
    poiCode: '110101',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '餐馆',
    threeType: '异国风味',
    poiCode: '110102',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '餐馆',
    threeType: '地方风味与名店',
    poiCode: '110103',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '快餐',
    threeType: '快餐',
    poiCode: '110200',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '休闲餐饮',
    threeType: '酒吧',
    poiCode: '110301',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '休闲餐饮',
    threeType: '冷饮店',
    poiCode: '110302',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '休闲餐饮',
    threeType: '咖啡馆',
    poiCode: '110303',
    beizhu: '',
    value: false
  },
  {
    oneType: '餐饮',
    twoType: '休闲餐饮',
    threeType: '茶楼、茶艺馆',
    poiCode: '110304',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '商业性住宿',
    threeType: '星级宾馆',
    poiCode: '120101',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '商业性住宿',
    threeType: '旅馆、招待所',
    poiCode: '120102',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '商业性住宿',
    threeType: '酒店式公寓',
    poiCode: '120103',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '商业性住宿',
    threeType: '普通出租公寓',
    poiCode: '120104',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '居民住宿',
    threeType: '小区',
    poiCode: '120201',
    beizhu: '',
    value: false
  },
  {
    oneType: '住宿',
    twoType: '居民住宿',
    threeType: '住宅楼',
    poiCode: '120202',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '小商品城',
    poiCode: '130101',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '百货商城、百货商店',
    poiCode: '130102',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '百货商店零售',
    poiCode: '130103',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '日杂店',
    poiCode: '130104',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '便利店',
    poiCode: '130105',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '综合零售',
    threeType: '超市',
    poiCode: '130106',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '烟酒副食、地方特产',
    poiCode: '130200',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '面包房',
    poiCode: '130201',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '农贸市场',
    poiCode: '130202',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '茶叶茶具专卖店',
    poiCode: '130203',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '香烟酒类专卖店',
    poiCode: '130204',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '地方土特产专卖店',
    poiCode: '130205',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '保健品专卖店',
    poiCode: '130206',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '饮料及烟酒制品零售',
    threeType: '主副食品零售',
    poiCode: '130207',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '母婴用品儿童用品零售',
    threeType: '服装、鞋帽店',
    poiCode: '130301',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '母婴用品儿童用品零售',
    threeType: '眼镜店',
    poiCode: '130302',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '母婴用品儿童用品零售',
    threeType: '母婴用品、儿童用品',
    poiCode: '130303',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '母婴用品儿童用品零售',
    threeType: '化妆品专卖店',
    poiCode: '130304',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '体育用品店',
    poiCode: '130401',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '书店',
    poiCode: '130402',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '报刊亭',
    poiCode: '130403',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '音像店',
    poiCode: '130404',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '钟表照相机专卖店',
    poiCode: '130405',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '珠宝首饰店',
    poiCode: '130406',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '工艺礼品',
    poiCode: '130407',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '古玩字画店',
    poiCode: '130408',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '乐器专卖店',
    poiCode: '130409',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '玩具店',
    poiCode: '130410',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '文化体育用品及器材零售',
    threeType: '文化用品店',
    poiCode: '130411',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '医药及医疗器材零售',
    threeType: '药店',
    poiCode: '130501',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '医药及医疗器材零售',
    threeType: '医疗器械',
    poiCode: '130502',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '家用电器及电子产品零售',
    threeType: '电器零售',
    poiCode: '130601',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '家用电器及电子产品零售',
    threeType: '电脑专卖店',
    poiCode: '130602',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '家用电器及电子产品零售',
    threeType: '通信器材',
    poiCode: '130603',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '五金、家具及室内装修材料零售',
    poiCode: '130700',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '五金、机电、仪器仪表',
    poiCode: '130701',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '家具',
    poiCode: '130702',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '家装建材零售',
    poiCode: '130703',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '灯饰',
    poiCode: '130704',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '五金、家具及室内装修材料零售',
    threeType: '家居用品',
    poiCode: '130705',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '其他零售店',
    poiCode: '130800',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '花卉专卖店',
    poiCode: '130801',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '宠物及宠物用品专卖店',
    poiCode: '130803',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '旧货市场',
    poiCode: '130804',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '自行车、电动车、摩托车销售',
    poiCode: '130805',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '丧葬用品',
    poiCode: '130806',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '宗教用品',
    poiCode: '130807',
    beizhu: '',
    value: false
  },
  {
    oneType: '批发零售',
    twoType: '其他零售',
    threeType: '成人用品零售',
    poiCode: '130808',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车及相关产品零售',
    threeType: '厂家推荐汽车零售',
    poiCode: '140101',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车及相关产品零售',
    threeType: '汽车用品、汽车养护',
    poiCode: '140104',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车及相关产品零售',
    threeType: '汽车零配件零售',
    poiCode: '140103',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车维护与保养',
    threeType: '厂家推荐汽车修理',
    poiCode: '140201',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车维护与保养',
    threeType: '机动车检测场',
    poiCode: '140202',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车销售及服务',
    threeType: '厂家推荐汽车零售及修理',
    poiCode: '140301',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车销售及服务',
    threeType: '汽车销售、汽车服务',
    poiCode: '140302',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车销售及服务',
    threeType: '厂家推荐二手车交易',
    poiCode: '140303',
    beizhu: '',
    value: false
  },
  {
    oneType: '汽车销售及服务',
    twoType: '汽车销售及服务',
    threeType: '二手车交易场所',
    poiCode: '140304',
    beizhu: '',
    value: false
  },
  {
    oneType: '金融、保险',
    twoType: '金融服务',
    threeType: '代表',
    poiCode: '150101',
    beizhu: '',
    value: false
  },
  {
    oneType: '金融、保险',
    twoType: '金融服务',
    threeType: 'ATM/自助银行',
    poiCode: '150102',
    beizhu: '',
    value: false
  },
  {
    oneType: '金融、保险',
    twoType: '金融服务',
    threeType: '证券公司｜营业部代表',
    poiCode: '150103',
    beizhu: '',
    value: false
  },
  {
    oneType: '金融、保险',
    twoType: '金融服务',
    threeType: '典当拍卖、贷款担保',
    poiCode: '150104',
    beizhu: '',
    value: false
  },
  {
    oneType: '金融、保险',
    twoType: '保险业',
    threeType: '保险业',
    poiCode: '150200',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '技术培训机构',
    poiCode: '160100',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '幼儿园/托儿所',
    poiCode: '160101',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '小学',
    poiCode: '160102',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '中学',
    poiCode: '160103',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '中专/职高/技校',
    poiCode: '160104',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '大专院校',
    poiCode: '160105',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '教学楼',
    poiCode: '160106',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '院/系',
    poiCode: '160107',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '学校报名处',
    poiCode: '160108',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '驾校',
    poiCode: '160109',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '教育',
    threeType: '考试中心',
    poiCode: '160110',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '报社、出版社、杂志社',
    poiCode: '160201',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '电台、电视台、电影制片厂',
    poiCode: '160202',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '图书馆',
    poiCode: '160203',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '资料馆、档案馆',
    poiCode: '160204',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '博物馆、纪念馆、展览馆、陈列馆',
    poiCode: '160205',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '美术馆',
    poiCode: '160206',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '科技馆',
    poiCode: '160207',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '文化馆、活动中心',
    poiCode: '160208',
    beizhu: '',
    value: false
  },
  {
    oneType: '教育、文化',
    twoType: '文化、媒体',
    threeType: '文工团、歌舞团、艺术团',
    poiCode: '160209',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '医院',
    poiCode: '170100',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '综合医院',
    poiCode: '170101',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '专科医院',
    poiCode: '170102',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '私人诊所',
    poiCode: '170103',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '医院内部医疗设施',
    poiCode: '170104',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '急诊',
    poiCode: '170105',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '社区医疗',
    poiCode: '170106',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '牙科诊所',
    poiCode: '170107',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '防疫站',
    poiCode: '170108',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '体检机构',
    poiCode: '170109',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '医疗机构',
    threeType: '献血屋',
    poiCode: '170110',
    beizhu: '',
    value: false
  },
  {
    oneType: '卫生、社保',
    twoType: '社会保障机构',
    threeType: '福利院、敬老院',
    poiCode: '170201',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '体育场馆',
    poiCode: '180100',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '羽毛球场',
    poiCode: '180101',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '网球场',
    poiCode: '180102',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '保龄球馆',
    poiCode: '180103',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '滑雪场',
    poiCode: '180104',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '高尔夫球场',
    poiCode: '180105',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '高尔夫练习场',
    poiCode: '180106',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '赛马场',
    poiCode: '180107',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '垂钓',
    poiCode: '180109',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '溜冰场',
    poiCode: '180110',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '运动场馆',
    threeType: '游泳馆',
    poiCode: '180111',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '练歌房、KTV',
    poiCode: '180201',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '夜总会、歌舞厅、迪厅',
    poiCode: '180202',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '娱乐、健身',
    poiCode: '180203',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '棋牌室代表',
    poiCode: '180204',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '网吧',
    poiCode: '180205',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '赛马会',
    poiCode: '180206',
    beizhu: '港澳仅有',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '博彩',
    poiCode: '180207',
    beizhu: '港澳仅有',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '彩票销售',
    poiCode: '180208',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '电影院',
    poiCode: '180209',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '剧场、戏院、音乐厅',
    poiCode: '180210',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲娱乐',
    threeType: '赛狗场',
    poiCode: '180211',
    beizhu: '港澳仅有',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '农家乐/民俗游',
    poiCode: '180301',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '非星级渡假村、疗养院',
    poiCode: '180302',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '天然浴场',
    poiCode: '180303',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '公园',
    poiCode: '180304',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '街心公园',
    poiCode: '180305',
    beizhu: '港澳仅有',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '广场',
    poiCode: '180306',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '游乐园',
    poiCode: '180307',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '动物园',
    poiCode: '180308',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '植物园',
    poiCode: '180309',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '休闲度假',
    threeType: '水族馆',
    poiCode: '180310',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '风景名胜',
    threeType: '代表',
    poiCode: '180400',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '风景名胜',
    threeType: '观光游览车站点',
    poiCode: '180401',
    beizhu: '',
    value: false
  },
  {
    oneType: '运动、休闲',
    twoType: '风景名胜',
    threeType: '景区服务点',
    poiCode: '180402',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '普通政府机关',
    poiCode: '190100',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '国家级政府机关',
    poiCode: '190101',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '省级政府机关',
    poiCode: '190102',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '地级市级政府机关',
    poiCode: '190103',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '区级政府机关',
    poiCode: '190104',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '县级政府机关',
    poiCode: '190105',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '区级政府机关（广州市）（大陆仅有）',
    poiCode: '190106',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '省/直辖市/自治区政府',
    poiCode: '190107',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '市县政府',
    poiCode: '190108',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '乡、镇政府',
    poiCode: '190110',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '行政办公大厅',
    poiCode: '190111',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '驻京、驻地方办事处',
    poiCode: '190112',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '村委会/居委会',
    poiCode: '190113',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '政府及管理机构',
    threeType: '边检口岸',
    poiCode: '190114',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '公安机关',
    threeType: '公安机关',
    poiCode: '190200',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '公安机关',
    threeType: '公安局',
    poiCode: '190201',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '公安机关',
    threeType: '派出所',
    poiCode: '190202',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '公安机关',
    threeType: '交警队',
    poiCode: '190203',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '公安机关',
    threeType: '消防',
    poiCode: '190204',
    beizhu: '港澳仅有',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '社会团体、协会',
    threeType: '协会',
    poiCode: '190301',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '社会团体、协会',
    threeType: '行业性团体',
    poiCode: '190302',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '宗教',
    threeType: '宗教',
    poiCode: '190400',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '宗教',
    threeType: '寺庙、道观',
    poiCode: '190401',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '宗教',
    threeType: '天主教',
    poiCode: '190402',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '宗教',
    threeType: '基督教',
    poiCode: '190403',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '宗教',
    threeType: '伊斯兰教',
    poiCode: '190404',
    beizhu: '',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '国际组织',
    threeType: '其他外国办事机构',
    poiCode: '190500',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '国际组织',
    threeType: '外国大使馆/领事馆',
    poiCode: '190501',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '公共设施',
    twoType: '国际组织',
    threeType: '签证处',
    poiCode: '190502',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '商业设施',
    threeType: '会议中心、展览中心',
    poiCode: '200101',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '商业设施',
    threeType: '培训中心',
    poiCode: '200102',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '商业设施',
    threeType: '大厦',
    poiCode: '200103',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '商业设施',
    threeType: '商务中心/会馆',
    poiCode: '200104',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '商业设施',
    threeType: '商业综合体',
    poiCode: '200105',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '租赁服务',
    threeType: '其他租赁服务',
    poiCode: '200200',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '租赁服务',
    threeType: '汽车租赁',
    poiCode: '200201',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '法律、商务服务',
    threeType: '事务所',
    poiCode: '200300',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '法律、商务服务',
    threeType: '商务服务',
    poiCode: '200400',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '法律、商务服务',
    threeType: '人才市场',
    poiCode: '200404',
    beizhu: '',
    value: false
  },
  {
    oneType: '商业设施、商务服务',
    twoType: '法律、商务服务',
    threeType: '旅行社',
    poiCode: '200405',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '居家服务',
    threeType: '家政服务',
    poiCode: '210101',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '居家服务',
    threeType: '摩托车、自行车、电动车维护与保养',
    poiCode: '210102',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '居家服务',
    threeType: '家电维修',
    poiCode: '210103',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '居家服务',
    threeType: '送水站',
    poiCode: '210104',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '居家服务',
    threeType: '宠物医院',
    poiCode: '210105',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '洗衣店/干洗店',
    poiCode: '210201',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '服装定制',
    poiCode: '210202',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '皮草/鞋/包保养',
    poiCode: '210203',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '美容院、理发店',
    poiCode: '210204',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '美甲、纹身',
    poiCode: '210206',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '洗浴中心、SPA、足浴',
    poiCode: '210207',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '婚庆服务',
    poiCode: '210209',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '火葬场、殡仪馆',
    poiCode: '210210',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '陵园、公墓',
    poiCode: '210211',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '邮局',
    poiCode: '210213',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '照相、影楼、彩扩',
    poiCode: '210214',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '公共厕所',
    poiCode: '210215',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '房产中介',
    poiCode: '210216',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '办公服务',
    poiCode: '210217',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '货物自提点',
    poiCode: '210218',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '个人服务',
    threeType: '婚姻介绍所',
    poiCode: '210219',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '票、费服务',
    threeType: '电信',
    poiCode: '210301',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '票、费服务',
    threeType: '票务中心/订票处',
    poiCode: '210302',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '票、费服务',
    threeType: '缴费营业厅',
    poiCode: '210303',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '票、费服务',
    threeType: '风景名胜售票点',
    poiCode: '210304',
    beizhu: '',
    value: false
  },
  {
    oneType: '居民服务',
    twoType: '其他服务',
    threeType: '其他服务',
    poiCode: '210400',
    beizhu: '',
    value: false
  },
  {
    oneType: '公司企业',
    twoType: '公司',
    threeType: '公司',
    poiCode: '220100',
    beizhu: '',
    value: false
  },
  {
    oneType: '公司企业',
    twoType: '厂矿企业',
    threeType: '厂矿企业',
    poiCode: '220200',
    beizhu: '',
    value: false
  },
  {
    oneType: '公司企业',
    twoType: '工业园',
    threeType: '工业园',
    poiCode: '220300',
    beizhu: '',
    value: false
  },
  {
    oneType: '公司企业',
    twoType: '其他单位',
    threeType: '其他单位',
    poiCode: '220400',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '车站',
    poiCode: '230100',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '火车站',
    poiCode: '230103',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '火车站出发到达',
    poiCode: '230105',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '货运火车站',
    poiCode: '230107',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '客运汽车站',
    poiCode: '230108',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '地铁站出入口',
    poiCode: '230111',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '地铁站主点',
    poiCode: '230112',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '磁悬浮出入口',
    poiCode: '230114',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '港口、码头',
    poiCode: '230125',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '机场/候机楼',
    poiCode: '230126',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '到达/出发口',
    poiCode: '230127',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '机场到达/出发门',
    poiCode: '230128',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '机场城市候机楼',
    poiCode: '230129',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '客货运输',
    threeType: '物流、快运',
    poiCode: '230130',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '桥',
    poiCode: '230201',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '立交桥',
    poiCode: '230202',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '高速出口',
    poiCode: '230203',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '高速入口',
    poiCode: '230204',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '高速服务区',
    poiCode: '230206',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '高速停车区',
    poiCode: '230207',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '收费站',
    poiCode: '230209',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '室内停车场',
    poiCode: '230211',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '地上露天停车场',
    poiCode: '230212',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '公交换乘停车场',
    poiCode: '230213',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '货车停车场',
    poiCode: '230214',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '加油站',
    poiCode: '230215',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '加气站',
    poiCode: '230216',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '加油加气站',
    poiCode: '230217',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '电动汽车充电站',
    poiCode: '230218',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '超限超载检测站',
    poiCode: '230219',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '刹车失灵缓冲区',
    poiCode: '230220',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '刹车冷却区',
    poiCode: '230221',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '占道停车场',
    poiCode: '230223',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '加水站',
    poiCode: '230228',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '紧急停车带',
    poiCode: '230229',
    beizhu: '卡车地图专用分类',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '地上非露天停车场',
    poiCode: '230224',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '地下停车场',
    poiCode: '230225',
    beizhu: '转出POI原始名称',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '露营房车营地',
    poiCode: '230226',
    beizhu: '',
    value: false
  },
  {
    oneType: '交通运输、仓储',
    twoType: '道路附属设施',
    threeType: '普通道路服务区/停车区',
    poiCode: '230230',
    beizhu: '',
    value: false
  },
  {
    oneType: '科研及技术服务',
    twoType: '科研机构',
    threeType: '科研机构',
    poiCode: '240100',
    beizhu: '',
    value: false
  },
  {
    oneType: '农林牧渔业',
    twoType: '农林牧渔生产',
    threeType: '农林牧渔生产',
    poiCode: '250100',
    beizhu: '',
    value: false
  },
  {
    oneType: '农林牧渔业',
    twoType: '农林牧渔服务',
    threeType: '农林牧渔服务',
    poiCode: '250200',
    beizhu: '',
    value: false
  },
  {
    oneType: '自然地物\\地名',
    twoType: '乡\\镇',
    threeType: '乡\\镇',
    poiCode: '260000',
    beizhu: '',
    value: false
  },
  {
    oneType: '自然地物\\地名',
    twoType: '村\\屯',
    threeType: '村\\屯',
    poiCode: '260100',
    beizhu: '',
    value: false
  }
]
export function getpoiTypeAll() {
  return poiTypeAll
}
export default getpoiTypeAll
