<template>
  <div class="main">
    <div class="top-box">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>报警管理</el-breadcrumb-item>
          <el-breadcrumb-item>探测器关联配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="button-box">
        <el-button size="mini">打印</el-button>
      </div>
    </div>
    <div class="content-box">
      <div>探测器详情</div>
      <div class="detail-box">
        <div class="detail-item">
          <div class="item-left">所属子系统</div>
          <div class="item-right">{{activeData.subsystem}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属机构</div>
          <div class="item-right">{{activeData.orgName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属重点部位</div>
          <div class="item-right">{{activeData.keySite}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">所属设备</div>
          <div class="item-right">{{activeData.deviceType}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">探测器名称</div>
          <div class="item-right">{{activeData.deviceName}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">防区序号</div>
          <div class="item-right">{{activeData.code}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">设备类型</div>
          <div class="item-right">{{activeData.brand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">数量</div>
          <div class="item-right">{{activeData.deviceModel}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">品牌</div>
          <div class="item-right">{{activeData.netModuleBrand}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">型号</div>
          <div class="item-right">{{activeData.netModuleModel}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">资产编码</div>
          <div class="item-right">{{activeData.netModuleID}}</div>
        </div>
        <div class="detail-item">
          <div class="item-left">状态</div>
          <div class="item-right">{{activeData.keyboardPassword}}</div>
        </div>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('videoChannel')">
            关联视频通道列表
            <i :class="dropdownStatus.videoChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table v-if="dropdownStatus.videoChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="orgName" label="所属机构"></el-table-column>
          <el-table-column prop="keySite" label="所属重点部位"></el-table-column>
          <el-table-column prop="index" label="视频通道名称"></el-table-column>
          <el-table-column prop="index" label="视频通道号"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="index" label="门禁通道类型"></el-table-column>
          <el-table-column prop="index" label="品牌"></el-table-column>
          <el-table-column prop="index" label="型号"></el-table-column>
          <el-table-column prop="code" label="资产编码"></el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('talkChannel')">
            关联对讲通道列表
            <i :class="dropdownStatus.talkChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table v-if="dropdownStatus.talkChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="orgName" label="所属机构"></el-table-column>
          <el-table-column prop="keySite" label="所属重点部位"></el-table-column>
          <el-table-column prop="index" label="对讲通道名称"></el-table-column>
          <el-table-column prop="index" label="对讲通道号"></el-table-column>
          <el-table-column prop="state" label="对讲通道ID"></el-table-column>
          <el-table-column prop="index" label="状态"></el-table-column>
          <el-table-column prop="index" label="品牌"></el-table-column>
          <el-table-column prop="index" label="型号"></el-table-column>
          <el-table-column prop="code" label="资产编码"></el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('doorChannel')">
            关联门禁通道列表
            <i :class="dropdownStatus.doorChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table v-if="dropdownStatus.doorChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="orgName" label="所属机构"></el-table-column>
          <el-table-column prop="keySite" label="所属重点部位"></el-table-column>
          <el-table-column prop="index" label="门禁通道名称"></el-table-column>
          <el-table-column prop="index" label="门禁通道号"></el-table-column>
          <el-table-column prop="state" label="门禁通道ID"></el-table-column>
          <el-table-column prop="index" label="状态"></el-table-column>
          <el-table-column prop="index" label="品牌"></el-table-column>
          <el-table-column prop="index" label="型号"></el-table-column>
          <el-table-column prop="code" label="资产编码"></el-table-column>
        </el-table>
      </div>
      <div class="table-box">
        <div class="box-title">
          <span class="pointer" @click="toggleDisplayStatus('outputChannel')">
            关联输出通道列表
            <i :class="dropdownStatus.outputChannel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
        <el-table v-if="dropdownStatus.outputChannel" border height="111" size="mini" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="orgName" label="所属机构"></el-table-column>
          <el-table-column prop="keySite" label="所属重点部位"></el-table-column>
          <el-table-column prop="index" label="报警输出名称"></el-table-column>
          <el-table-column prop="index" label="报警输入号"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="index" label="品牌"></el-table-column>
          <el-table-column prop="index" label="型号"></el-table-column>
          <el-table-column prop="code" label="资产编码"></el-table-column>
        </el-table>
      </div>
      <div>放置拓扑图</div>
      <div class="detail-bottom">
        <div class="detail-item">
          <div class="item-left">录入时间</div>
          <div class="item-right">{{activeData.createdAt}}</div>
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
export default {
  props: {
    isShowDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeData: {},
      dropdownStatus: {
        videoChannel: true,
        talkChannel: true,
        doorChannel: true,
        outputChannel: true
      }
    }
  },
  methods: {
    // 展开 收起
    toggleDisplayStatus(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },
    closeDetail() {
      this.$emit('update:isShowDetail', false)
    }
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