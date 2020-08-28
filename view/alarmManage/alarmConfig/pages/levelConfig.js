export default {
  data() {
    return {
      levelSort: [
        {
          deviceModel: '入侵和紧急报警',
          mark: 'devSort',
          typeList: [
            {
              deviceType: '报警主机',
              mark: 'devType',
              eventType: [
                {
                  eventType: '断网报警主机',
                  alarmLevel: '一级',
                  nonkeyTime: '否',
                  isCaution: '否',
                  checked: false,
                  mark: 'eventType',
                  recordAction: '不联动录像'
                },
                {
                  name: '断电',
                  level: '一级',
                  noFocus: '是',
                  eventWarn: '是',
                  checked: false,
                  mark: 'eventType',
                  linkVideo: '不联动录像'
                }
              ]
            },
            {
              name: '所有探测器',
              mark: 'devType',
              eventType: [
                {
                  name: '断网',
                  level: '一级',
                  noFocus: '否',
                  eventWarn: '是',
                  checked: false,
                  mark: 'eventType',
                  linkVideo: '不联动录像'
                },
                {
                  name: '断电',
                  level: '一级',
                  noFocus: '是',
                  eventWarn: '是',
                  checked: false,
                  mark: 'eventType',
                  linkVideo: '不联动录像'
                }
              ]
            }
          ]
        }
      ]
      // remindData: [
      //   {
      //     name: '入侵和紧急报警',
      //     mark: 'devSort',
      //     typeList: [
      //       {
      //         name: '报警主机',
      //         mark: 'devType',
      //         eventType: [
      //           {
      //             name: '断网',
      //             deal: '不启用',
      //             noFocus: '关注',
      //             checked: false,
      //             mark: 'eventType'
      //           },
      //           {
      //             name: '断电',
      //             deal: '不启用',
      //             noFocus: '关注',
      //             checked: false,
      //             mark: 'eventType'
      //           }
      //         ]
      //       },
      //       {
      //         name: '所有探测器',
      //         mark: 'devType',
      //         eventType: [
      //           {
      //             name: '断网',
      //             deal: '不启用',
      //             noFocus: '提示',
      //             checked: false,
      //             mark: 'eventType'
      //           },
      //           {
      //             name: '断电',
      //             deal: '不启用',
      //             noFocus: '提示',
      //             checked: false,
      //             mark: 'eventType'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     name: '电子围栏设备',
      //     mark: 'devSort',
      //     typeList: [
      //       {
      //         name: '电子围栏总线报警主机',
      //         mark: 'devType',
      //         eventType: [
      //           {
      //             name: '断网',
      //             deal: '不启用',
      //             noFocus: '关注',
      //             checked: false,
      //             mark: 'eventType'
      //           },
      //           {
      //             name: '断电',
      //             deal: '不启用',
      //             noFocus: '提示',
      //             checked: false,
      //             mark: 'eventType'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
    }
  },
  created() {
  },
  mounted() {},
  methods: {}
}
