
<template>
  <div id="videoHost">
    <component
      class="aaaa"
      :class="{isFlex : flag}"
      :is="childrenComponent"
      :deviceModel="deviceModel"
      :optType="optType"
      @modelChange="modelChange"
      :updataItem="deviceModel"
      :planPop="createPlatform"
      @propsUpdate="propsUpdate"
      :updataToViewPageId="updataToViewPageId"
    ></component>
  </div>
</template>

<script>
// import { getTreeApi } from '@src/http/access/accessMan'
// import { mapMutations } from 'vuex'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Host',
  computed: {
    ...mapState('access', {
      // treeInfo: 'treeInfo'
    }),
    ...mapState('access', {
      // treeInfo: 'treeInfo',
      brand: 'brand',
      modelNum: 'modelNum',
    }),
  },
  components: {
    // treeBox: () => import('@src/components/tree/treeBox'),
    Create: () => import('./Create'),
    List: () => import('./List'),
    Import: () => import('./Import'),
    ViewPage: () => import('./ViewPage'),
    Update: () => import('./Update'),
  },
  props: {
    childrenComponent: {
      type: String,
      default: 'List',
    },
  },
  data() {
    return {
      updataToViewPageId: '',
      flag: false,
      type: '',
      childrenComponents: '',
      createPlatform: {
        orgName: '',
        orgId: '',
        locName: '',
        keyPartId: '',
      },
      jigouId: '',
      buweiId: '',
      createHost: {},
      id: '',
      deviceModel: {},
      optType: '', // 区分新建和修改
    }
  },
  methods: {
    ...mapActions('access', {
      getBrand: 'getBrand',
      getMol: 'getMol',
    }),
    // ...mapMutations('dutyManagement', ['GETINFO']),
    // 点击机构数的某一项 可以获取到该项的类型
    // onceClick(val) {
    //   let { tierType } = val
    //   if (tierType == 'org') {
    //     //机构
    //     let { name, id } = val
    //     this.createHost.jigou = name
    //     this.createHost.jigouId = id
    //     this.$refs.hh.dbGetList(id, ' ') // 如果是结构 部位id就不传
    //   } else if (tierType == 'loc') {
    //     // 重点部位
    //     let { name, id } = val
    //     this.createHost.buwei = name
    //     this.createHost.buweiId = id
    //     this.$refs.hh.dbGetList(' ', id)
    //   }
    //   // console.log('Log asd ', val)
    // },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    //子组件传参
    modelChange(obj, type) {
      this.createPlatform = obj
      let { id } = obj
      this.id = id
      this.deviceModel = obj
      if (type == true) {
        this.deviceModel = {}
      }
      this.optType = type
      this.type = type
      console.log('Log---------------------', obj)
      if (obj.path == 'ViewPage') {
        this.updataToViewPageId = obj.id
      }
    },
    propsUpdate(type) {
      // this.childrenComponent = type
    },
  },
  watch: {
    createPlatform(newVal, oldval) {
      this.createPlatform = newVal
      this.$store.commit('GETINFO', this.createPlatform)
    },
    childrenComponent: {
      handler(newVal, oldVal) {
        console.log('Log  -------------00 ', newVal)
        if (this.type == 'Update') {
          this.flag = true
          if (newVal == 'Import') {
            this.flag = false
          }
        } else {
          this.flag = false
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
#videoHost {
  height: 100%;
  width: 100%;
  .isFlex {
    display: flex;
  }
  .aaaa {
    width: 100%;
    height: 100%;
    // overflow: hidden;
    // overflow: auto;
  }
  .right {
    // flex: 1;
    // width: calc(~'100% - 240px');
    height: 100%;
  }
}
</style>
