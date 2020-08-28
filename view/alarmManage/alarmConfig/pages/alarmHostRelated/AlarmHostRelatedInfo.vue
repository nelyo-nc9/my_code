<template>
  <div class="main">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>报警管理</el-breadcrumb-item>
          <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="button-box">
        <el-button size="mini">打印</el-button>
        <el-button size="mini" @click="closeDetail">关闭</el-button>
      </div>
    </div>
    <div class="content-box">
      <div v-if="relatedType === '1'">报警主机详情</div>
      <div v-if="relatedType === '2'">探测器详情</div>
      <div class="detail-box">
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">所属子系统</div>
          <div class="item-right">{{activeData.subsystem}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属机构</div>
          <div class="item-right">{{activeData.orgName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属重点部位</div>
          <div class="item-right">{{activeData.locName}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">所属设备</div>
          <div class="item-right">{{activeData.deviceName}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">报警防区名称</div>
          <div class="item-right">{{activeData.name}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">防区序号</div>
          <div class="item-right">{{activeData.serialNumber}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">设备类型</div>
          <div class="item-right">{{activeData.deviceType}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">数量</div>
          <div class="item-right">{{activeData.count}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">品牌</div>
          <div class="item-right">{{activeData.brand}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">型号</div>
          <div class="item-right">{{activeData.model}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">状态</div>
          <div class="item-right">{{activeData.deviceType}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '2'">
          <div class="item-left">资产编码</div>
          <div class="item-right">{{activeData.code}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">设备名称</div>
          <div class="item-right">{{activeData.name}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">资产编码</div>
          <div class="item-right">{{activeData.code}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">设备品牌</div>
          <div class="item-right">{{activeData.brand}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">设备型号</div>
          <div class="item-right">{{activeData.deviceModel}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">网络模块品牌</div>
          <div class="item-right">{{activeData.netModuleBrand}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">网络模块类型</div>
          <div class="item-right">{{activeData.netModuleModel}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">网络模块ID</div>
          <div class="item-right">{{activeData.netModuleID}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">键盘密码</div>
          <div class="item-right">{{activeData.keyboardPassword}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">IP地址</div>
          <div class="item-right">{{activeData.ip}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">网络端口</div>
          <div class="item-right">{{activeData.port}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">所属服务</div>
          <div class="item-right">{{activeData.service}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">网域</div>
          <div class="item-right">{{activeData.domain}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">探测器数量</div>
          <div class="item-right">{{activeData.detectorNo}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">输出通道数量</div>
          <div class="item-right">{{activeData.outputNo}}</div>
        </div>
        <div class="detail-item" v-if="relatedType === '1'">
          <div class="item-left">子系统数量</div>
          <div class="item-right">{{activeData.subsystemNo}}</div>
        </div>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('videoChannel')">
            关联视频通道列表
            <i :class="dropdownStatus.videoChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table :data="videoTableData" v-if="dropdownStatus.videoChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
                v-for="item in videoComColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('talkChannel')">
            关联对讲通道列表
            <i :class="dropdownStatus.talkChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table :data="volumTableData" v-if="dropdownStatus.talkChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
                v-for="item in talkComColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
        </el-table>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('doorChannel')">
            关联门禁通道列表
            <i :class="dropdownStatus.doorChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table :data="doorTableData" v-if="dropdownStatus.doorChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
                v-for="item in doorComColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('outputChannel')">
            关联输出通道列表
            <i :class="dropdownStatus.outputChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table :data="outputTableData" v-if="dropdownStatus.outputChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
                v-for="item in outComColumns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
        </el-table>
      </div>
      <div class="gplot">
        <div style="text-align:center;">
          <Gplot :gplotData="gplotData" v-if="isShowGplot"></Gplot>
        </div>
      </div>
      <div class="detail-bottom">
        <div class="detail-item">
          <div class="item-left">录入时间</div>
          <div class="item-right">{{activeData.updatedAt}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">录入机构</div>
          <div class="item-right">{{activeData.createdDept}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">录入人</div>
          <div class="item-right">{{activeData.createdBy}}</div>
        </div>
      </div>
      <div class="detail-footer">
        <el-button type="primary" size="mini">保存</el-button>
        <el-button size="mini" @click="closeDetail">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getHostOrResourceApi } from '@src/http/alarm/alarmHostConfig.api.js'
import Gplot from '../../../../videoManage/components/gplot'
export default {
  components: {
    Gplot
  },
  props: {
    isShowDetail: {
      type: Boolean,
      default: false
    },
    activeData: {
      type: Object
    },
    relatedType: {
      type: String
    }
  },
  data() {
    return {
      isShowGplot: true,
      gplotData: [],
      dropdownStatus: {
        videoChannel: true,
        talkChannel: true,
        doorChannel: true,
        outputChannel: true
      },
      videoComColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'locName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '视频通道名称', width: '' },
        { prop: 'serise', label: '视频通道号', width: '' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'class', label: '门禁通道类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      talkComColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'locName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '对讲通道名称', width: '' },
        { prop: 'serise', label: '对讲通道号', width: '' },
        { prop: 'id', label: '对讲通道ID', width: '' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      doorComColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'locName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '门禁通道名称', width: '' },
        { prop: 'serise', label: '门禁通道号', width: '' },
        { prop: 'id', label: '门禁通道ID', width: '' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      outComColumns: [
        { prop: 'orgName', label: '所属机构', width: '' },
        { prop: 'locName', label: '所属重点部位', width: '' },
        { prop: 'name', label: '报警输出名称', width: '' },
        { prop: 'serise', label: '报警输入号', width: '' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ]
    }
  },
  methods: {
    // 展开 收起
    toggleDisplayStatus(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    closeDetail() {
      this.$emit('update:isShowDetail', false)
    },
    topoData() {
      let gpData = []
      gpData.push({
        id: this.InfoData.id,
        type: this.relatedType === '1' ? 'videoHost' : (this.relatedType === '2' ? 'videoHost' : 'alarm'),
        center: true,
        name: this.InfoData.name
      })
      this.InfoData.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      this.InfoData.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      this.InfoData.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      this.InfoData.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
        }
        gpData.push(obj)
      })
      this.gplotData = gpData
      this.isShowGplot = false
      this.$nextTick(() => {
        this.isShowGplot = true
      })
    },
    getHostOrResource() {
      let params = {
        ref: this.relatedType === '1' ? 1 : 2
      }
      getHostOrResourceApi(this.activeData.id, params).then(res => {
        this.InfoData = res.data.data
        Array.isArray(res.data.data.video) && res.data.data.video.forEach(item => {
          if (item.status !== undefined) {
            item.status = item.status === 1 ? '离线' : '在线'
          }
        })
        Array.isArray(res.data.data.audio) && res.data.data.audio.forEach(item => {
          if (item.status !== undefined) {
            item.status = item.status === 1 ? '离线' : '在线'
          }
        })
        Array.isArray(res.data.data.guard) && res.data.data.guard.forEach(item => {
          if (item.status !== undefined) {
            item.status = item.status === 1 ? '离线' : '在线'
          }
        })
        Array.isArray(res.data.data.output) && res.data.data.output.forEach(item => {
          if (item.status !== undefined) {
            item.status = item.status === 1 ? '离线' : '在线'
          }
        })
        this.videoTableData = res.data.data.video
        this.volumTableData = res.data.data.audio
        this.doorTableData = res.data.data.guard
        this.outputTableData = res.data.data.output
        this.topoData()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getHostOrResource()
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.button-box {
  margin: 12px 0;
}
.content-box {
  width: 1200px;
  text-align: center;
}
.table-box {
  width: 100%;
  text-align: left;
  margin-top: 24px;
}
.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;
  margin-bottom: 12px;
  i {
    position: absolute;
    top: 50%;
    left: 120px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 150px');
    margin-left: 150px;
    margin-top: -12px;
  }
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 150px;
}
.detail-box,
.detail-bottom {
  color: #666;
  width: 100%;
  padding: 8px;
  border: 1px solid #F2F2F2;
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
  .detail-item {
    display: flex;
    width: 50%;
    height: 32px;
    line-height: 32px;
    .item-left {
      width: 200px;
      background: #F8F8F8;
      border: 1px solid #fff;
    }
    .item-right {
      flex: 1;
      border: 1px solid #F8F8F8;
      border-left: none;
    }
  }
}
.detail-bottom {
  .detail-item {
    width: 33.33%;
  }
}
.detail-footer {
  margin-top: 24px;
}
</style>