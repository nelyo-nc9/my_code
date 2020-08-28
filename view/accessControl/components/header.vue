<template>
  <div id="accessHeader">
    <div class="accessHeaderTabs">
      <ul class="tabsCon">
        <li
          class="tabsItem"
          v-for="(item, index) in tabList"
          :key="index"
          @click="currt({ Index: index, path: item.tarPath })"
        >
          <p :class="{ tabsItemActive: index == mark }">{{ item.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      mark: 1,
      tabList: [
        {
          tarPath: '/',
          title: '首页'
        },
        {
          tarPath: '/intelligentSecurity/accessControl/accessAdmin',
          title: '门禁管理'
        },
        {
          tarPath: '/intelligentSecurity/accessControl/accessManagement',
          title: '门禁配置'
        },
        {
          tarPath: '/intelligentSecurity/accessControl/accessLog',
          title: '门禁日志'
        }
      ]
    }
  },
  methods: {
    currt(data) {
      let { Index, path } = data
      this.mark = Index
      if(path == this.$route.path) return
      this.$router.push({
        path
      })
    },
    // defaultRouter(){
    //   this.$router.push({
    //       path:this.tabList[1].tarPath
    //   })
    // }
  },
  created() {
      this.defaultRouter()
    
  },
  mounted(){
      // this.defaultRouter()
  }
}
</script>

<style lang="less" scope>
#accessHeader {
  margin-bottom: 10px;
  .accessHeaderTabs {
    height: 40px;
    background: #fff;
    box-shadow: 0px 0px 6px 0px rgba(133, 133, 133, 0.19);
    .tabsCon {
      list-style: none;
      overflow: hidden;
      color: #000;
      font-weight: 400;
      font-size: 14px;
      .tabsItem {
        float: left;
        line-height: 40px;
        cursor: pointer;
        padding: 0 30px;
        p{
            height:40px;
        }
      }
      .tabsItem:hover{
          color: #2d72d3;
      }
      .tabsItem:nth-child(2) {
        margin-left: 430px;
      }
      .tabsItemActive {
        border-bottom: 3px solid #2d72d3;
      }
    }
  }
}
</style>
