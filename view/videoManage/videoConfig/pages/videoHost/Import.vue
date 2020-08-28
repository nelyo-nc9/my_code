<template>
  <div class="content">
    <header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
        <el-breadcrumb-item>导入</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <div class="button-box flex-row">
      <div class="voice-upload">
        <label>请选择文件：</label>
        <el-upload
          action=''
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarSuccess"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-input
            v-model="voiceValue.name"
            placeholder="未选择任何文件"
            size="mini"
          ></el-input>
        </el-upload>
      </div>
      <div class='upload-btn'>
        <el-button type="primary" size="mini" @click="importData">导入</el-button>
        <el-button type="primary" size="mini" @click="clickSave('保存')">保存</el-button>
        <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">覆盖重复项</el-checkbox>
      </div>
    </div>

    <div style="position:absolute;width:100%;">
      <div class="box-title">  
        <span class="pointer" @click="toggleOpen('host')">
              主机设备列表
              <i :class="dropdownStatus.host ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </div>
      <div v-if="dropdownStatus.host" style="width:100%;">
        <el-table size="mini" border :height="450">
				<el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
			      <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
								show-overflow-tooltip
              ></el-table-column>
			</el-table>
      <el-pagination
        style="text-align:right;"
        :page-sizes="[25, 50, 100, 200]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      </div>
      <div class="bottom-box">
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer" @click="toggleOpen('detector')">
              视频通道列表
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
							音频通道列表
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
        <div style="width:100%;">
					<div class="box-title">
						<span class="pointer" @click="toggleOpen('warning')">
							报警输入列表
							<i :class="dropdownStatus.warning ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
						</span>
					</div>
					<div v-if="dropdownStatus.warning" style="width:100%;">
            <el-table :data="warningList" border style="width: 100%" height="185" size="mini" stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in warningTableColumn"
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
						<span class="pointer" @click="toggleOpen('warningOutput')">
							报警输出列表
							<i :class="dropdownStatus.warningOutput ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
						</span>
					</div>
					<div v-if="dropdownStatus.warningOutput" style="width:100%;">
            <el-table :data="warningOutputList" border style="width: 100%" height="185" size="mini" stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                v-for="item in warningOutputTableColumn"
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
import { handleImport } from '@src/common/excel'

export default {
  data() {
    return {
      dropdownStatus: {
        host:true,
        detector: false,
        output: false,
        subSystem: false,
        warning:false,
        warningOutput:false,
      },
      columns: [
        { prop: 'orgName', sortable: true, label: '所属机构', width: '100' },
        { prop: 'keyPartName', sortable: true, label: '所属重点部位', width: '200' },
        { prop: 'name', sortable: true, label: '设备名称', width: '100' },
        { prop: 'type', sortable: true, label: '设备类型', width: '80' },
        { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'model', sortable: true, label: '型号', width: '80' },
        { prop: 'assetCode', sortable: true, label: '资产编码', width: '100' },
        { prop: 'ip', sortable: true, label: 'IP', width: '60' },
        { prop: 'serial', naikname:true, label: '用户名', width: '90' },
        { prop: 'serial', password:true, label: '密码', width: '90' },
        { prop: 'cPort', sortable: true, label: '控制端口', width: '100' },
        { prop: 'dPort', sortable: true, label: '数据端口', width: '100' },
        { prop: 'storageServerName', sortable: true, label: '接入服务器', width: '150' },
        { prop: 'protocol', sortable: true, label: '接入协议', width: '100' },
        { prop: 'transportProtocol', sortable: true, label: '传输协议', width: '100' },
        { prop: 'simulate', label: '模拟通道数', width: '150' },
        { prop: 'digital', label: '数字通道数', width: '150' },
        { prop: 'audio', label: '音频通道数', width: '150' },
        { prop: 'alarmIn', label: '报警输入数', width: '150' },
        { prop: 'alarmOut', label: '报警输出数', width: '150' },
        { prop: 'inputOrg', label: '录入机构', width: '' },
        { prop: 'inputPeople', label: '录入人', width: '' },
        { prop: 'createdAt', label: '录入时间', width: '' }
      ],
			detectorTableColumn: [
				// 探测器列表项
				{ prop: 'name', label: '所属设备', width: '' },
				{ prop: 'orderNum', label: '资源名称', width: '' },
				{ prop: 'devType', label: '资源类型', width: '' },
				{ prop: 'number', label: '通道号', width: '' },
				{ prop: 'brand', label: 'IP', width: '' },
				{ prop: 'model', label: '控制端口', width: '' },
				{ prop: 'assetCode', label: '数据端口', width: '' },
        { prop: 'isRelated', label: '码流', width: '' },
        { prop: 'model', label: '资产编码', width: '' },
			 { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'model', sortable: true, label: '型号', width: '80' },
			],
			detectorList: [
				// 探测器列表数据
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
			],
			outputTableColumn: [
				// 输出通道表格项
			{ prop: 'name', label: '所属设备', width: '' },
				{ prop: 'orderNum', label: '资源名称', width: '' },
				{ prop: 'devType', label: '资源类型', width: '' },
				{ prop: 'number', label: '通道号', width: '' },
				{ prop: 'brand', label: 'IP', width: '' },
        { prop: 'model', label: '资产编码', width: '' },
			 { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'model', sortable: true, label: '型号', width: '80' },
			],
			outputList: [
				// 输出通道表格数据
				{name: 'O1声闪一体机-大厅', orderNum: '1', devType: '声闪一体机', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
      ],
      warningList:[
        {name: 'O1声闪一体机-大厅', orderNum: '1', devType: '声闪一体机', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
				{name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
      ],
      warningOutputList:[
         {name: 'O1声闪一体机-大厅', orderNum: '1', devType: '声闪一体机', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
				 {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
      ],
      //报警输入列表
      warningTableColumn: [
	    	{ prop: 'name', label: '所属设备', width: '' },
				{ prop: 'orderNum', label: '资源名称', width: '' },
				{ prop: 'devType', label: '资源类型', width: '' },
				{ prop: 'number', label: '通道号', width: '' },
				{ prop: 'brand', label: 'IP', width: '' },
        { prop: 'model', label: '资产编码', width: '' },
			  { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'model', sortable: true, label: '型号', width: '80' },
      ],
       //报警输出列表
      warningOutputTableColumn: [
	    	{ prop: 'name', label: '所属设备', width: '' },
				{ prop: 'orderNum', label: '资源名称', width: '' },
				{ prop: 'devType', label: '资源类型', width: '' },
				{ prop: 'number', label: '通道号', width: '' },
				{ prop: 'brand', label: 'IP', width: '' },
        { prop: 'model', label: '资产编码', width: '' },
			  { prop: 'brand', sortable: true, label: '品牌', width: '80' },
        { prop: 'model', sortable: true, label: '型号', width: '80' },
      ],
      //上传
      tableColumn:[],
      voiceValue: {},
      isShowSubOrg: false,
      tableData:[],
      newData:[],
      total:0
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
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
      const isWav =
        file.type === '.csv' ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        'application/vnd.ms-excel'
      if (!isWav) {
        this.$notify.warning({
          message: '上传文件格式只能是xlsx格式!',
          title: '警告'
        })
      }
      return isWav
    },
    // 上传成功
    handleAvatarSuccess(file, fileList) {
      let obj = {}
      // debugger
      if (this.sidebarActiveId !== 12) {
        this.tableColumn.map(n => {
          Object.assign(obj, { [n.label]: n.prop })
        })
      } else {
        this.tableColumns.map(n => {
          Object.assign(obj, { [n.label]: n.prop })
        })
      }
 
      handleImport(file, obj, data => {
        this.newData = data
      })
      this.voiceValue = file
    },
    // 导入数据
    importData(event) {
      this.tableData = [...this.newData, ...this.tableData]
      // this.$notify.success({
      //   message: '导入成功',
      //   title: '成功'
      // })
      this.total = this.tableData.length || 1
    },
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
      display: flex;
      align-items: center;
      .voice-upload{
        display: flex;
        align-items: center;
      }
      .upload-btn{
        margin-left: 20px;
      }
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