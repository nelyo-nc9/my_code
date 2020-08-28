<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-readonly">
        <table style="border-collapse:collapse;">
          <tr><td>对讲通道名称</td><td>   <span class="value" v-if="curSelectResourcePoint.name">{{ curSelectResourcePoint.name }}</span></td></tr>
          <tr><td>通道号</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.serise">{{ curSelectResourcePoint.resource.serise }}</span></td></tr>
          <tr><td>通道类型</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.type">{{ curSelectResourcePoint.resource.type }}</span></td></tr>
          <tr><td>所属主机</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.deviceName">{{ curSelectResourcePoint.resource.deviceName }}</span></td></tr>
          <tr><td>所属平台</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.platformName">{{ curSelectResourcePoint.resource.platformName }}</span></td></tr>
          <tr><td>所属子系统</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.name">{{ curSelectResourcePoint.resource.name }}</span></td></tr>
          <tr><td>所属机构</td><td>  <span class="value" v-if=" curSelectResourcePoint.resource.orgName">{{ curSelectResourcePoint.resource.orgName }}</span></td></tr>
          <tr><td>所属重点部位</td><td>  <span class="value" v-if="curSelectResourcePoint.resource.keyPartName ">{{ curSelectResourcePoint.resource.keyPartName }}</span></td></tr>
          <tr><td>状态</td><td>  <span class="value" v-if="curSelectResourcePoint.resource.status">{{ curSelectResourcePoint.resource.status }}</span></td></tr>
          <tr><td>可见层级</td><td>  <span class="value" v-if="curSelectResourcePoint.level ">{{ curSelectResourcePoint.level }}</span></td></tr>
        </table>
      </div>
    </div>
      <!-- <div class="panel-info-btn">
        <el-row>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitSave">保 存</el-button>
        </el-row>
      </div> -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  /* mixins: [AttrInfo, seatListFun], */
  data() {
    return {
      isFinder: false,
      tempName: '',
      isLayout: true,
      tempId: ''
      //   visibleLevel: ''

    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      curSelectResourcePoint: ({ map2d }) =>
        map2d.mapPoint.curSelectResourcePoint
          ? map2d.mapPoint.curSelectResourcePoint
          : { name: '',
            level: '',
            resource: {
              brand: '',
              serise: '',
              type: '',
              deviceName: '',
              modelNum: '',
              platformName: '',
              orgName: '',
              keyPartName: ''

            }
          }
    }),
    visibleLevel() {
      return window.$context2D.map.getView().getZoom()
    }
  },
  watch: {

  },
  methods: {
    ...mapMutations('map2d/pointMapShow', ['CLOSE_MAP_RESOURCE_ATTRIBUTES'])

  }
}
</script>

<style lang="less" scoped>
.organize-info-readonly,.organize-info-form,.organize-info-add{
      margin-top: 6px;
      box-sizing: border-box;
      table{
        width: 100%;
        td{
          &:first-child{
            background-color: #f8f8f8;
          }
          border: 1px solid #f2f2f2;
          background-color: #fff;
        }
      }
      td{
        &:first-child{
          width: 90px;
          text-align: center;
        }
        height: 33px;
        padding: 0 6px;
        line-height: 32px;
        box-sizing: border-box;
      }
    }
    .panel-info-btn {
    width: 300px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: rgba(51, 51, 51, 0.4);
  }

</style>
