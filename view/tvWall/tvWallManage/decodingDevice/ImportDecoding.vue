<template>
  <div class="content">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
        <el-breadcrumb-item>解码设备配置</el-breadcrumb-item>
        <el-breadcrumb-item>导入</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="button-box">
      <el-input size="mini" style="width: 400px;float:left;margin-right:10px;">
        <template slot="prepend">选择导入文件</template>
        <el-upload slot="append" action="">
          <el-button size="small" type="primary">浏览...</el-button>
        </el-upload>
      </el-input>
      <div>
        <el-button size="small" type="primary">导入</el-button>
        <el-button size="small">重置</el-button>
        <el-button size="small">覆盖</el-button>
        <el-button size="small" type="primary">保存</el-button>
      </div>
    </div>
    <div style="position:absolute;width:100%;">
      <div class="box-title">导入设备列表</div>
      <el-table size="mini" border :height="450">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="subsystem" label="所属子系统" width="100"></el-table-column>
        <el-table-column prop="orgName" label="所属机构" width="100"></el-table-column>
        <el-table-column prop="keySite" label="所属重点部位" width="100"></el-table-column>
        <el-table-column prop="deviceName" label="所属电视墙" width="100"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="netModuleBrand" label="IP地址"></el-table-column>
        <el-table-column prop="dk" label="端口"></el-table-column>
        <el-table-column prop="useName" label="用户名"></el-table-column>
        <el-table-column prop="pasWrod" label="密码"></el-table-column>
        <el-table-column prop="code" label="品牌"></el-table-column>
        <el-table-column prop="brand" label="型号"></el-table-column>
        <el-table-column prop="type" label="设备类型"></el-table-column>
        <el-table-column prop="deviceModel" label="接入方式"></el-table-column>
        <el-table-column prop="jmcount" label="解码窗口数量" width="130"></el-table-column>
        <el-table-column prop="bdcount" label="本地终端输入数量" width="150"></el-table-column>
        <el-table-column prop="sccount" label="输出通道数量" width="130"></el-table-column>
        <el-table-column prop="lineState" label="在线状态"></el-table-column>
        <el-table-column prop="bm" label="资源编码"></el-table-column>
        <el-table-column prop="xlNumber" label="序列号"></el-table-column>
        <el-table-column prop="createdBy" label="录入机构"></el-table-column>
        <el-table-column prop="createdDept" label="录入人"></el-table-column>
        <el-table-column prop="createdAt" label="录入时间"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right;"
        :page-sizes="[25, 50, 100, 200]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
      <div class="bottom-box">
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer" @click="toggleOpen('detector')">
              本地终端列表
              <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div v-if="dropdownStatus.detector" style="width:100%;">
            <el-table :data="detectorList" border style="width: 100%" height="185" size="mini" stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer" @click="toggleOpen('output')">
              输出通道列表
              <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div v-if="dropdownStatus.output" style="width:100%;">
            <el-table :data="outputList" border style="width: 100%" height="185" size="mini" stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in outputTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownStatus: {
        detector: false,
        output: false,
        subSystem: false
      },
      detectorTableColumn: [
        // 探测器列表项
        { prop: 'name', label: '探测器名称', width: '' },
        { prop: 'orderNum', label: '防区序号', width: '' },
        { prop: 'devType', label: '设备类型', width: '' },
        { prop: 'number', label: '数量', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'isRelated', label: '是否关联', width: '' }
      ],
      detectorList: [
        // 探测器列表数据
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        }
      ],
      outputTableColumn: [
        // 输出通道表格项
        { prop: 'name', label: '输出通道名称', width: '' },
        { prop: 'orderNum', label: '通道序号', width: '' },
        { prop: 'devType', label: '设备类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      outputList: [
        // 输出通道表格数据
        {
          name: 'O1声闪一体机-大厅',
          orderNum: '1',
          devType: '声闪一体机',
          brand: '国产',
          model: 'XXX',
          assetCode: 'XXX',
          remark: ''
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          brand: '国产',
          model: 'XXX',
          assetCode: 'XXX',
          remark: ''
        }
      ]
    }
  },
  methods: {
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  position: relative;
  font-size: 14px;
  margin: 0 10px;
  .button-box {
    margin: 10px 0;
  }
  .box-title {
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #606266;
    i {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateY(-50%);
    }
    &::after {
      display: block;
      content: '';
      border-top: 1px solid #e1e1e1;
      width: calc(~'100% - 120px');
      margin-left: 120px;
      margin-top: -12px;
    }
  }
  .pointer {
    cursor: pointer;
    display: inline-block;
    width: 120px;
  }
}
</style>
