<!--
 * @Description: 用来检测某个全局变量，不用调试，界面显示
 * @Author: anli
 * @Date: 2020-05-25 17:01:30
 * @LastEditTime: 2020-05-25 17:07:11
 * @LastEditors: anli
-->
<template>
  <div class="">
    <div class="organization-info globalvartable" v-if="isVisible">
      <div class="organize-info-readonly">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="必须字段" name="1">
            <table style="border-collapse:collapse;">
              <tr v-for="item in mustTable" v-bind:key="item.id">
                <td>{{ item.key }}</td>
                <td v-if="item.value != 'null'">{{ item.value }}</td>
                <td style="color:red;" v-if="item.value == 'null'">{{ item.value }}</td>
              </tr>
            </table>
          </el-collapse-item>
          <el-collapse-item title="返回字段" name="2">
            <table style="border-collapse:collapse;">
              <tr v-for="item in returnTable" v-bind:key="item.id">
                <td>{{ item.key }}</td>
                <td v-if="item.value != 'null'">{{ item.value }}</td>
                <td style="color:red;" v-if="item.value == 'null'">{{ item.value }}</td>
              </tr>
            </table>
          </el-collapse-item>

          <!-- <el-collapse-item title="可控 Controllability" name="4">
    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
  </el-collapse-item> -->
        </el-collapse>

        <!-- <table style="border-collapse:collapse;">
          <tr>
            <td>ID</td>
            <td>{{ equipmentForm.id }}</td>
          </tr>
        </table> -->
      </div>
    </div>
    <div class="organization-info globalvartable2" v-if="isVisible2">
      <div class="organize-info-readonly">
        <el-collapse v-model="activeNames2" @change="handleChange2">
          <el-collapse-item title="必须字段" name="1">
            <table style="border-collapse:collapse;">
              <tr v-for="item in mustTable2" v-bind:key="item.id">
                <td>{{ item.key }}</td>
                <td v-if="item.value != 'null'">{{ item.value }}</td>
                <td style="color:red;" v-if="item.value == 'null'">{{ item.value }}</td>
              </tr>
            </table>
          </el-collapse-item>
          <el-collapse-item title="返回字段" name="2">
            <table style="border-collapse:collapse;">
              <tr v-for="item in returnTable2" v-bind:key="item.id">
                <td>{{ item.key }}</td>
                <td v-if="item.value != 'null'">{{ item.value }}</td>
                <td style="color:red;" v-if="item.value == 'null'">{{ item.value }}</td>
              </tr>
            </table>
          </el-collapse-item>

          <!-- <el-collapse-item title="可控 Controllability" name="4">
    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
  </el-collapse-item> -->
        </el-collapse>

        <!-- <table style="border-collapse:collapse;">
          <tr>
            <td>ID</td>
            <td>{{ equipmentForm.id }}</td>
          </tr>
        </table> -->
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      isVisible: false,
      isVisible2: false,
      activeNames: ['1'],
      activeNames2: ['1'],
      equipmentForm: {
        name: ''
      },
      //左侧树
      mustTable: [], //树节点全局变量-想看字段
      returnTable: [], //树节点全局变量-返回字段
      stringLength: 10, //字符长度限制
      //地图点位信息
      mustTable2: [], // -想看字段
      returnTable2: [], // -返回字段
      stringLength2: 10 //字符长度限制
    }
  },
  watch: {
    selectedTreeCode() {
      this.initCurrentResource()
    },
    curSelectResourcePoint() {
      this.initClickedPoint()
    }
  },
  mounted() {
    this.initCurrentResource()
    this.initClickedPoint()
  },
  computed: {
    ...mapState({
      selectedTreeCode: ({ map2d }) => map2d.mapPanelSearch.selectedTreeCode,
      curSelectResourcePoint: ({ map2d }) => map2d.mapPoint.curSelectResourcePoint
    })
  },
  methods: {
    // ...mapActions('map2d/mapIndex', ['setPanelInfoStatus', 'setPanelInfoEditStatus', 'setDrawActive']),
    // 可视域复选框选中状态
    // checkboxChange(val) {
    //   this.disabled = !val

    //   this.updateCurrentSector()
    // },
    /**
     * 初始化参数
     */
    handleChange(val) {
      console.log(val)
    },
    handleChange2(val) {
      console.log(val)
    },
    initCurrentResource() {
      let data = JSON.parse(JSON.stringify(this.selectedTreeCode))
      if (data == undefined || data == null) {
        data = {}
      }
      const mustAttr = [
        'id',
        'name',
        'type',
        'subType',
        'pointType',
        'pointSubType',

        'isPoint',
        'point',
         'orgId',
        'keyPartId',
        'deviceId',
        'resourceId'
      ] //想监听的字段
      let mustTable = []
      let returnTable = []

      mustAttr.forEach(item => {
        if (data[item] !== undefined) {
          mustTable.push({ key: item, value: data[item].toString().substr(0, this.stringLength) })
        } else {
          mustTable.push({ key: item, value: 'null' })
        }
      })
      for (let key in data) {
        if (!mustAttr.includes(key)) {
          if (data[key] != '') {
            returnTable.push({ key: key, value: data[key].toString().substr(0, this.stringLength) })
          } else {
            returnTable.push({ key: key, value: 'null' })
          }
        }
      }

      this.mustTable = mustTable
      this.returnTable = returnTable

      // 赋值表单必须-shen

      // this.equipmentForm = this.selectedTreeCode
    },
    initClickedPoint() {
      let data = JSON.parse(JSON.stringify(this.curSelectResourcePoint))
      if (data == undefined || data == null) {
        data = {}
      }
      const mustAttr = ['id', 'name','type','subType'] //想监听的字段
      let mustTable = []
      let returnTable = []

      mustAttr.forEach(item => {
        if (data[item] !== undefined) {
          mustTable.push({ key: item, value: data[item].toString().substr(0, this.stringLength) })
        } else {
          mustTable.push({ key: item, value: 'null' })
        }
      })
      for (let key in data) {
        if (!mustAttr.includes(key)) {
          if (data[key] != '') {
            returnTable.push({ key: key, value: data[key].toString().substr(0, this.stringLength) })
          } else {
            returnTable.push({ key: key, value: 'null' })
          }
        }
      }

      this.mustTable2 = mustTable
      this.returnTable2 = returnTable

      // 赋值表单必须-shen

      // this.equipmentForm = this.selectedTreeCode
    }
  }
}
</script>

<style lang="less" scoped>
.globalvartable {
  position: fixed;
  z-index: 1000;
  top: 100px;
  left: 450px;
  background-color: green;
}
.globalvartable2 {
  position: fixed;
  z-index: 1000;
  top: 100px;
  left: 700px;
  background-color: green;
}
.organize-info-readonly,
.organize-info-form,
.organize-info-add {
  box-sizing: border-box;
  table {
    width: 100%;
    td {
      &:first-child {
        background-color: #f8f8f8;
      }
      border: 1px solid #f2f2f2;
      background-color: #fff;
    }
  }
  td {
    &:first-child {
      width: 90px;
      text-align: center;
    }
    height: 20px;
    padding: 0 6px;
    line-height: 20px;
    box-sizing: border-box;
  }
}
//

//
</style>
