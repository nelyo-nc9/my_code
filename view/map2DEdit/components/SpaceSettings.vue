<template>
  <div>
    <div class="panel-info-btn">
      <el-row style="margin-left:10px;">
        <i class="icon iconfont-ccb ccbfanhui back-btn-style" @click="cancel" title="返回"></i>
      </el-row>
    </div>
    <div class="organization-info">
      <div class="organize-info-form">
        <el-form ref="spaceForm" :model="spaceForm" label-width="90px">
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
          <el-form-item label="颜色填充" v-if="isPolygon">
            <el-select v-model="spaceForm.fillcolor" size="mini">
              <el-option key="colorFilldefault" :value="spaceForm.fillcolor">
                <el-color-picker class="input-select-color" v-model="spaceForm.fillcolor"></el-color-picker>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="填充透明度" v-if="isPolygon">
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
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      spaceForm: {
        borderstyle: 'solid', // 边框类型
        borderwidth: '3', // 边框宽度 //开发期间用大值，太细鼠标不能拾取 方便开发-shen
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
        // {
        //   value: '1',
        //   label: '1px'
        // },
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
  props: {
    isPolygon: {
      type: Boolean,
      required: true
    }
  },
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
      nowSelectAreaInfo: ({ map2d }) => map2d.mapIndex.nowSelectAreaInfo, // 当前选中区域信息
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint
    }),
    ...mapState('map2d/mapIndex', ['drawActive'])
  },
  created() {
    if (this.curSelectResourcePoint) {
      let obj = this.curSelectResourcePoint
      console.log(obj)
      let borderStyleObj = { '1': 'solid', '2': 'dashed', '3': 'dotted' }
      let style = {
        borderstyle: obj.borderStyle ? borderStyleObj[obj.borderStyle.toString()] : 'solid', // 边框类型
        borderwidth: obj.borderWidth || '1', // 边框宽度
        bordercolor: obj.borderColor || '#ff0000', // 边框颜色
        bodertransparency: obj.borderTransparency || 100, // 边框透明度
        fillcolor: obj.fillColor || '#ff0000', // 颜色填充
        fillcolortransparency: obj.fillTransparency || 50, // 填充透明度
        fontcolor: obj.fontColor || '#ff0000', // 字体颜色
        fontsize: obj.fontSize || '12' // 字体大小
      }
      this.spaceForm = { administrative: '', ...style }
      console.log(this.spaceForm, obj)
    } else if (this.drawFeatureStyle) {
      this.spaceForm = cloneDeep(this.drawFeatureStyle)
    }
  },
  methods: {
    ...mapActions('map2d/mapPoint', ['setCurrentSelectResource']),
    styleChange(val) {
      let styleInfo = cloneDeep(this.spaceForm)
      delete styleInfo.administrative
      let curSelectResourcePoint = cloneDeep(this.curSelectResourcePoint)
      let obj = {
        borderstyle: 'borderStyle', // 边框类型
        borderwidth: 'borderWidth', // 边框宽度
        bordercolor: 'borderColor', // 边框颜色
        bodertransparency: 'borderTransparency', // 边框透明度
        fillcolor: 'fillColor', // 颜色填充
        fillcolortransparency: 'fillTransparency', // 填充透明度
        fontcolor: 'fontColor', // 字体颜色
        fontsize: 'fontSize' // 字体大小
      }
      let borderStyleObj = { solid: 1, dashed: 2, dotted: 3 }
      for (let name in styleInfo) {
        curSelectResourcePoint[obj[name]] =
          obj[name].split('Color').length === 1 && name !== 'borderstyle' ? Number(styleInfo[name]) : styleInfo[name]
      }
      curSelectResourcePoint.borderStyle = borderStyleObj[curSelectResourcePoint.borderStyle]
      // console.log('样式改变', curSelectResourcePoint)
      this.setCurrentSelectResource(curSelectResourcePoint)
    },
    cancel() {
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
  width: 280px;
  height: 40px;
  line-height: 40px;
  bottom: 0;
  right: 0;
  background-color: rgba(51, 51, 51, 0.4);
}
</style>
<style scoped>
.back-btn-style {
  cursor: pointer;
  font-size: 28px;
}
.back-btn-style:hover {
  background-color: gray;
}
.input-select-color {
  width: 100%;
}
.input-select-color >>> .el-color-picker__trigger {
  width: 100%;
  height: 34px;
}
.organize-info-form >>> .el-form-item {
  margin-bottom: 0;
  width: 285px;
}
</style>
