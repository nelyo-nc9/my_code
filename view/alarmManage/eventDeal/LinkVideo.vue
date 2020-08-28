<template>
  <div class="content">
    <div class="tree-left">
      <el-tree :data="data"
               @node-click="nodeClick"
               node-key="id"
               accordion
               :default-expanded-keys="defaultExpandedKeys"
               :default-checked-keys="[5]"
               :props="defaultProps">
      </el-tree>

    </div>
    <div class="video-right">
      <preview-plugin ref="preview"
                      :iconShow="iconShowParams"
                      :isButton="true"
                      :defaultPane='defaultPane'>
      </preview-plugin>
    </div>
  </div>
</template>

<script>
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import { mapActions } from 'vuex'
export default {
  name: 'LinkVideo',
  components: {
    previewPlugin
  },
  data() {
    return {
      defaultPane: 4,
      defaultExpandedKeys: [],
      iconShowParams: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {},
  computed: {},
  created() {
    let inPageType = this.$route.query.type //从哪个页面进入
    switch (inPageType) {
      case 'eventDeal':
        this.iconShowParams = [
          {
            type: 'left',
            index: 0,
            name: 'ScreenShot'
          },
          {
            type: 'left',
            index: 1,
            name: 'Videotape'
          },
          {
            type: 'left',
            index: 2,
            name: 'Speech'
          },
          {
            type: 'left',
            name: 'NiaoKan',
            index: 3
          },
          {
            type: 'left',
            name: 'Volume',
            index: 4
          },
          {
            type: 'right',
            name: 'FullScreen',
            index: 0
          },
          {
            type: 'right',
            name: 'MultiScreen',
            index: 1
          },
          {
            type: 'right',
            name: 'ViewPattern',
            index: 2
          },
          {
            type: 'right',
            name: 'Stream',
            index: 3
          },
          {
            type: 'right',
            name: 'StopAll',
            index: 4
          },
          {
            type: 'right',
            name: 'Stop',
            index: 5
          },
          {
            type: 'right',
            name: 'Page',
            index: 6
          }
        ]
        break
      case 'alarmDeal':
        this.iconShowParams = [
          {
            type: 'left',
            index: 0,
            name: 'ScreenShot'
          },
          {
            type: 'left',
            index: 1,
            name: 'Videotape'
          },
          {
            type: 'left',
            index: 2,
            name: 'Speech'
          },
          {
            type: 'left',
            name: 'NiaoKan',
            index: 3
          },
          {
            type: 'left',
            name: 'Volume',
            index: 4
          }
        ]
        break
      default:
        break
    }
  },
  mounted() {
    let id = this.$route.query.locationId
    let deviceId = this.$route.query.deviceId
    let channId = this.$route.query.channelId
    this.defaultExpandedKeys = [deviceId, channId]
    console.log(this.defaultExpandedKeys)
    console.log('id++' + id)
    if (id) {
      this.getKeyPartVideoTreeFuc(id)
    }
  },
  methods: {
    ...mapActions('eventDeal', {
      getKeyPartVideoTree: 'getKeyPartVideoTree'
    }),
    nodeClick(node) {
      if (node.tierType === 'res') {
        this.Preview(node)
      }
    },
    getKeyPartVideoTreeFuc(id) {
      this.getKeyPartVideoTree({ locationId: id }).then(res => {
        if (res && res.code === 0) {
          ;[res.data].map(item => {
            gr(item)
          })
          this.data = [res.data]
          // console.log(data)
        }
      })
      let gr = obj => {
        obj['label'] = obj.name
        if (obj.children && obj.children.length > 0) {
          obj.children.map(item => {
            item['label'] = item.name
            gr(item)
          })
        }
      }
    },
    Preview(val) {
      let data = {
        moduleType: 2,
        subType: val.subType,
        id: val.id,
        dId: val.deviceId,
        type: val.type,
        deviceName: val.deviceName,
        channel: Number(val.serise) || Number(val.channelNum),
        devIp: val.type === 4 ? val.ip : val.hostIp,
        devCport: val.type === 4 ? val.cport : val.hostPort,
        devDport: val.type === 4 ? val.dport : val.hostDport,
        streamType: val.streamType === 1 ? 'main' : val.streamType === 2 ? 'sub1' : 'sub2',
        detail: val
      }
      console.log(data)
      this.$refs.preview.openPreview(data)
    }
  }
}
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  .tree-left {
    width: 300px;
    border: 1px solid #ddd;
    overflow: auto;
  }
  .video-right {
    flex: 1;
    height: 100%;
    border: 1px solid #ddd;
  }
}
</style>
