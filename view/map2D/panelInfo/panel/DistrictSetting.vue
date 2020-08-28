<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-form">
        <el-form ref="spaceForm" :model="spaceForm" label-width="90px">
          <el-form-item label="行政区名称">
            <span>{{nowSelectAreaInfo.name}}</span>
          </el-form-item>
          <!-- <el-form-item label="行政编码">
            <span>{{spaceForm.adcode}}</span>
          </el-form-item>-->
          <el-form-item label="边框类型">
            <el-select v-model="spaceForm.borderStyle" size="mini" placeholder="请选择">
              <el-option
                v-for="item in borderTypeOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框宽度">
            <el-select v-model="spaceForm.borderWidth" size="mini" placeholder="请选择">
              <el-option
                v-for="item in borderWidthOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-select v-model="spaceForm.borderColor" size="mini">
              <el-option key="borderColorDefault" :value="spaceForm.borderColor">
                <el-color-picker class="input-select-color" v-model="spaceForm.borderColor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框透明度">
            <el-slider v-model="spaceForm.borderTransparency"></el-slider>
          </el-form-item>
          <el-form-item label="颜色填充">
            <el-select v-model="spaceForm.fillColor" size="mini">
              <el-option key="colorFilldefault" :value="spaceForm.fillColor">
                <el-color-picker class="input-select-color" v-model="spaceForm.fillColor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="填充透明度">
            <el-slider v-model="spaceForm.fillTransparency"></el-slider>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-select v-model="spaceForm.fontColor" size="mini">
              <el-option key="fontColorDefault" :value="spaceForm.fontColor">
                <el-color-picker class="input-select-color" v-model="spaceForm.fontColor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-select v-model="spaceForm.fontSize" size="mini" placeholder="请选择">
              <el-option
                v-for="item in fontSizeOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="panel-info-btn">
      <el-row>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveSubmit">保 存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapState } from 'vuex'
import { getDistrictSettingApi, saveDistrictSettingAPi } from '@src/http/map2D/index'
export default {
  name: 'district-setting',
  data() {
    return {
      currPanelToolComponent: '',
      spaceForm: {
        administrative: '海淀区', // 行政区名称
        borderStyle: 'solid', // 边框类型
        borderWidth: '1', // 边框宽度
        borderColor: '#ff0000', // 边框颜色
        // boderTransparency: 100, // 边框透明度
        fillColor: '#ff0000', // 颜色填充
        // fillTransparency: 50, // 填充透明度
        fontColor: '#ff0000', // 字体颜色
        fontSize: '12' // 字体大小
      },
      borderTypeOps: [
        {
          value: '1',
          label: '实线'
        },
        {
          value: '2',
          label: '虚线'
        },
        {
          value: '3',
          label: '点线'
        }
      ],
      borderWidthOps: [
        {
          value: '1',
          label: '1px'
        },
        {
          value: '2',
          label: '2px'
        },
        {
          value: '3',
          label: '3px'
        }
      ],
      fontSizeOps: [
        {
          value: '12',
          label: '12px'
        },
        {
          value: '14',
          label: '14px'
        },
        {
          value: '16',
          label: '16px'
        }
      ]
    }
  },
  watch: {
    spaceForm: {
      handler(newVal) {
        this.styleChange(newVal)
      },
      deep: true
    }
    // nowSelectAreaInfo: {
    //   handler(newVal) {
    //     this.spaceForm = cloneDeep(this.drawDistrictStyle)
    //   }
    // }
  },
  computed: {
    ...mapState({
      drawDistrictStyle: ({ map2d }) => map2d.mapIndex.drawDistrictStyle,
      // currPanelToolComponent: ({ map2d }) => map2d.mapIndex.currPanelToolComponent,
      nowSelectAreaInfo: ({ map2d }) => map2d.mapIndex.nowSelectAreaInfo // 当前选中区域信息
    })
  },
  created() {
    this.spaceForm = cloneDeep(this.drawDistrictStyle)
    this.styleChange(this.spaceForm)
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setDrawFeatureStyle',
      'setPanelInfoStatus',
      'getDistrictSetting',
      'saveDistrictSetting',
      'setDrawDistrictStyle'
    ]),
    styleChange(val) {
      let style = JSON.parse(JSON.stringify(val))
      if (style.bordercolor === '') {
        style.bordercolor = '#FF0000'
      }
      if (style.fontcolor === '') {
        style.fontcolor = '#FF0000'
      }
      if (style.fillcolor === '') {
        style.fillcolor = '#FF0000'
      }
      this.setDrawDistrictStyle(style)
    },
    saveSubmit() {
      let data = {
        adcode: this.nowSelectAreaInfo.adcode
          .toString()
          .substr(0, this.nowSelectAreaInfo.level === 1 ? 2 : this.nowSelectAreaInfo.level === 2 ? 4 : 6),
        areaStyle: this.spaceForm
      }
      this.saveDistrictSetting(data)
      this.setPanelInfoStatus(false)
      this.styleChange(this.spaceForm)
      // this.$emit('closeSetting', false)
    },
    cancel() {
      this.setPanelInfoStatus(false)
      // this.$emit('closeSetting', false)
    }
  }
}
</script>

<style lang="less" scoped>
.organize-info-form {
  margin-top: 6px;
  box-sizing: border-box;
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
<style scoped>
.input-select-color {
  width: 100%;
}
.input-select-color >>> .el-color-picker__trigger {
  width: 100%;
  height: 34px;
}
.organize-info-form >>> .el-form-item {
  margin-bottom: 0;
}
</style>
