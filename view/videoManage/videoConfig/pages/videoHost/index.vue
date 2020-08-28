<template>
 <component :is="childrenComponent" :deviceData="deviceModel" :optType="optType" @modelChange="modelChange" :key="childrenComponent"></component>
</template>

<script>
import Create from './Create'
import List from './List'
import Import from './Import'
import Search from './Search'
import Info from './Info'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'VideoHost',
  components: {
    Create,
    List,
    Import,
    Search,
    Info
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List'
    },
    changeTab: {
      type: Function
    }
  },
  watch: {
    childrenComponent() {
      this.$forceUpdate()
    }
  },
  data() {
    return {
      // currentComponent: 'List',
      deviceModel: {
        orgId: '',
        keyPartId: '',
        keyPartName: '',
        keyPartType: '',
        subSystem: '1',
        assetCode: '',
        uniqueId: '',
        name: '',
        type: '',
        brand: '',
        modelNum: '',
        accessService: '',
        username: '',
        password: '',
        ip: '',
        dport: '',
        cport: '',
        accessProtocol: 'SDK',
        protocol: 1,
        inputNumber: 0,
        outputNumber: 0,
        analogNumber: 0,
        digitalNumber: 0,
        audioNumber: 0,
        // updatedBy: this.personInfo.name,
        // updatedDept: this.personInfo.orgName,
        // updatedAt: this.personInfo.createdAt
        updatedBy: '',
        updatedDept: '',
        updatedAt: ''
      },
      optType: 'Create' // 区分新建和删除
    }
  },
  methods: {
    modelChange(obj, type) {
      if (type === 'Update') {
        this.filterNum(obj)
      } else if (type === 'List' || type === 'Create') {
        console.log('111', obj, type)
        this.$emit('changeTab', `VideoHost-${type}`)
      }
      this.deviceModel = obj
      this.optType = type
    },
    filterNum(oldModel) {
      // 过滤通道数量为空字符串时默认是0
      if (oldModel.analogNumber === '') {
        oldModel.analogNumber = 0
      }
      if (oldModel.audioNumber === '') {
        oldModel.audioNumber = 0
      }
      if (oldModel.digitalNumber === '') {
        oldModel.digitalNumber = 0
      }
      if (oldModel.inputNumber === '') {
        oldModel.inputNumber = 0
      }
      if (oldModel.outputNumber === '') {
        oldModel.outputNumber = 0
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
