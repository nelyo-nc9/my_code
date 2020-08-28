<template>
  <div>门禁平台配置新建页</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    deviceModel: {
      type: Object,
      defalut: () => {
        return {
          keyPart: 0,
          type: 'ipc',
          name: '124432333',
          brand: 'ceshi',
          model: 'ceshi',
          protocol: 'ceshi',
          serial: 'ceshi',
          host: 'ceshi',
          ip: 'ceshi',
          cport: 11,
          dport: 10,
          userName: 'ceshi',
          passWord: 'ceshi',
          transportProtocols: 'ceshi',
          digital: 10,
          simulate: 18,
          alarmIn: 11,
          alarmOut: 12,
          audio: 21,
          assetCode: '08936-2318578963',
          inputPeople: '张三',
          inputOrg: '张家沟分行',
          remark: '无'
        }
      }
    },
    optType: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="less" scope>
</style>