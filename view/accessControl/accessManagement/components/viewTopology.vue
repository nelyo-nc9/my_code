<template>
  <div id="TopologyBox">
    <el-dialog
      :title="hostOrAisleName ? hostOrAisleName : '查看关联'"
      :visible.sync="dialogFlag"
      :before-close="handleClose"
      custom-class="Topology"
    >
      <!-- <div class="INFO">
        <ul>
          <li>
            <span>所属机构</span>
            <span></span>
          </li>
          <li>
            <span>所属重点部位</span>
            <span></span>
          </li>
          <li>
            <span>所属设备</span>
            <span></span>
          </li>
          <li>
            <span>资源名称</span>
            <span></span>
          </li>
        </ul>
      </div> -->
      <div class="TopologyView">
        <Gplot :gplotData="gplotData" v-if="isShowGplot"></Gplot>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Gplot from '@src/view/videoManage/components/gplot'
import { getHostOrControlLinkages } from '@src/http/access/CreateOrUpdataLinkage'
export default {
  components: {
    Gplot,
  },
  props: {
    TopologyStatus: {
      type: Boolean,
      required: true,
    },
    TopologyData: {
      type: Array,
      default: () => [],
    },
    TopologyID: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogFlag: '',
      gplotData: [],
      isShowGplot: true,
      hostOrAisleName: '',
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('changeStatus')
      done()
      this.getTopology = null
    },
    getTopology() {
      this.hostOrAisleName = this.TopologyID.name + ' 关联关系'
      let id = this.TopologyID.id
      let ref = this.TopologyID.type == 'host' ? 1 : 2
      let params = {
        ref,
      }
      getHostOrControlLinkages(`/resource/v1/guard/linkage/${id}`, params).then((res) => {
        try {
          this.gplotData = []
          let result = res.data.data.video.concat(res.data.data.guard, res.data.data.audio, res.data.data.output)
          let center = {
            name: this.TopologyID.name,
            type: 'alarmHost',
            id: '1',
            center: true, // 用来标识中心元素
          }
          this.gplotData.push(center)
          for (let i = 0; i < result.length; i++) {
            let temp = {
              name: result[i].name,
              type:
                result[i].type === 1
                  ? 'vidicon'
                  : result[i].type === 4
                  ? 'alarmHost'
                  : result[i].type === 2
                  ? 'talkback'
                  : 'guardHost',
              id: String(i + 2),
            }
            this.gplotData.push(temp)
          }
          this.isShowGplot = false
          this.$nextTick(() => {
            this.isShowGplot = true
          })
        } catch (error) {}
      })
    },
  },
  mounted() {
    this.dialogFlag = this.TopologyStatus
    this.getTopology()
  },
}
</script>

<style lang="less" scoped>
#TopologyBox {
  .Topology {
    width: 800px;
    height: 800px;

    .TopologyView {
      position: relative;
      margin-left: 10px;
      padding: 10px;
      height: 600px;
      width: 800px;
    }
  }
}
</style>
