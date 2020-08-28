<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-readonly">
        <table style="border-collapse:collapse;">
          <tr><td>探测器名称</td><td>{{equipmentForm.name}}</td></tr>
          <tr><td>防区序号</td><td>{{equipmentForm.serialNo}}</td></tr>
          <tr><td>设备类型</td><td>{{equipmentForm.type}}</td></tr>
          <tr><td>所属设备</td><td>{{equipmentForm.theirEquipment}}</td></tr>
          <tr><td>品牌</td><td>{{equipmentForm.brand}}</td></tr>
          <tr><td>型号</td><td>{{equipmentForm.model}}</td></tr>
          <tr><td>所属子系统</td><td>{{equipmentForm.subsystem}}</td></tr>
          <tr><td>所属重点部位</td><td>{{equipmentForm.importPart}}</td></tr>
          <tr><td>所属机构</td><td>{{equipmentForm.organization}}</td></tr>
          <tr><td>状态</td><td>{{equipmentForm.status}}</td></tr>
          <tr><td>可见层级</td><td>{{equipmentForm.visibleLevel}}</td></tr>
        </table>
      </div>
      <div class="organize-info-form">
        <tr>
          <td>缩微图形态</td>
          <td>
            <el-select v-model="equipmentForm.miniImg" size="mini" placeholder="请选择" v-if="!isEdit">
              <el-option
                v-for="item in miniImgOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>{{equipmentForm.miniImg}}</span>
          </td>
        </tr>
      </div>
      <div class="panel-info-btn" v-if="!isEdit">
        <el-row>
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitSave">保 存</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      equipmentForm: {
        name: '',
        serialNo: '',
        type: '',
        theirEquipment: '',
        brand: '',
        model: '',
        subsystem: '',
        organization: '',
        importPart: '',
        status: '',
        visibleLevel: '',
        miniImg: ''
      },
      miniImgOptions: [
        {
          value: 'point1',
          label: '点位'
        },
        {
          value: 'line2',
          label: '自定义线'
        },
        {
          value: 'custom3',
          label: '自定义区域'
        }
      ]
    }
  },
  methods: {
    cancel() {

    },
    submitSave() {

    }
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
.panel-info-btn{
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