<template>
  <div>
    <div class="organization-info">
      <div class="organize-info-form">
        <el-form ref="spaceForm" :model="spaceForm" label-width="90px">
          <el-form-item v-if="!isEditPolygon" label="行政区名称">
            <span>{{ spaceForm.administrative }}</span>
          </el-form-item>
          <el-form-item label="边框类型">
            <el-select v-model="spaceForm.borderstyle" size="mini" placeholder="请选择">
              <el-option v-for="item in borderTypeOps" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框宽度">
            <el-select v-model="spaceForm.borderwidth" size="mini" placeholder="请选择">
              <el-option v-for="item in borderWidthOps" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-select v-model="spaceForm.bordercolor" size="mini">
              <el-option key="borderColorDefault" :value="spaceForm.bordercolor">
                <el-color-picker class="input-select-color" v-model="spaceForm.bordercolor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="边框透明度">
            <el-slider v-model="spaceForm.bodertransparency"></el-slider>
          </el-form-item>
          <el-form-item label="颜色填充">
            <el-select v-model="spaceForm.fillcolor" size="mini">
              <el-option key="colorFilldefault" :value="spaceForm.fillcolor">
                <el-color-picker class="input-select-color" v-model="spaceForm.fillcolor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="填充透明度">
            <el-slider v-model="spaceForm.fillcolortransparency"></el-slider>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-select v-model="spaceForm.fontcolor" size="mini">
              <el-option key="fontColorDefault" :value="spaceForm.fontcolor">
                <el-color-picker class="input-select-color" v-model="spaceForm.fontcolor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-select v-model="spaceForm.fontsize" size="mini" placeholder="请选择">
              <el-option v-for="item in fontSizeOps" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
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
import { mapActions, mapState, mapMutations } from 'vuex'
import { updateMapCommonResourcePointApi } from 'http/map2D/point'
export default {
  data() {
    return {
      currPanelToolComponent: '',
      spaceForm: {
        administrative: '海淀区', // 行政区名称
        borderstyle: 'solid', // 边框类型
        borderwidth: '1', // 边框宽度
        bordercolor: '#ff0000', // 边框颜色
        bodertransparency: 100, // 边框透明度
        fillcolor: '#ff0000', // 颜色填充
        fillcolortransparency: 50, // 填充透明度
        fontcolor: '#ff0000', // 字体颜色
        fontsize: '12' // 字体大小
      },
      borderTypeOps: [
        {
          value: 'solid',
          label: '实线'
        },
        {
          value: 'dashed',
          label: '虚线'
        },
        {
          value: 'dotted',
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
  props: ['isEditPolygon'],
  watch: {
    spaceForm: {
      handler(newVal) {
        this.styleChange(newVal)
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      isMapEdit: ({ map2d }) => map2d.mapIndex.isMapEdit,
      drawFeatureStyle: ({ map2d }) => map2d.mapIndex.drawFeatureStyle,
      currPanelToolComponent: ({ map2d }) => map2d.mapIndex.currPanelToolComponent,
      nowSelectAreaInfo: ({ map2d }) => map2d.mapIndex.nowSelectAreaInfo // 当前选中区域信息
    }),
    ...mapState('map2d/mapIndex', ['drawActive']),
    ...mapState('map2d/mapPoint', ['curSelectResourcePoint'])
  },
  created() {
    console.log('hashhashsa', this.isEditPolygon)
    if (this.drawFeatureStyle) {
      this.spaceForm = cloneDeep(this.drawFeatureStyle)
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'setDrawFeatureStyle',
      'setPanelInfoStatus',
      'getDistrictSetting',
      'saveDistrictSetting'
    ]),
    ...mapActions('map2d/mapPoint', ['updateMapCommonResourcePoint']),
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
      this.setDrawFeatureStyle(style)
    },
    // 如果是右侧是行政区样式设置 保存和取消 关闭右侧面板
    saveSubmit() {
      // this.setPanelInfoStatus(false)
      if (this.isEditPolygon) {
        let styleInfo = cloneDeep(this.spaceForm)
        delete styleInfo.administrative
        console.log(styleInfo, this.curSelectResourcePoint)
        let updatePointInfo = cloneDeep(this.curSelectResourcePoint)
        for (let name in styleInfo) {
          updatePointInfo[name] = styleInfo[name]
        }
        console.log('updatePointInfo', updatePointInfo)
        updateMapCommonResourcePointApi(updatePointInfo)
          .then(res => {
            console.log(res)
            this.$notify({
              title: '成功',
              message: '修改完成',
              type: 'success'
            })
          })
          .catch(err => {
            console.log(err)
            this.$notify({
              title: '失败',
              message: '修改失败',
              type: 'error'
            })
          })
      } else if (!this.isEditPolygon) {
        this.styleChange(this.spaceForm)
      } else {
        this.$notify({
          tle: '失败',
          message: '绘制未完成',
          type: 'error'
        })
        return
      }
      this.$emit('closeSetting', false)
    },
    cancel() {
      // this.setPanelInfoStatus(false)
      this.$emit('closeSetting', false)
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
