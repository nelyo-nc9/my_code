<template>
  <div class="alarm-main">
    <div @click="isOpenPanel = !isOpenPanel" class="isShow" :style="{ left: isOpenPanel ? '200px' : '0' }">
      <i :class="isOpenPanel ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
    </div>
    <div class="left-tabs" :style="{ width: isOpenPanel ? '200px' : '28px' }">
      <div class="menu-content" v-show="isOpenPanel">
        <el-menu
          :default-active="combinationName"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          @select="changeTab"
        >
          <template v-for="item in tabs">
            <el-submenu v-if="item.items" :index="item.index" :key="item.id">
              <template>
                <span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="val in item.items" :key="val.index" :index="val.index">{{
                  val.title
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="right-content">
      <equipmentDatasTable :tableColumn="tableData[componentId]"></equipmentDatasTable>
    </div>
  </div>
</template>

<script>
import equipmentDatasTable from './page/equipmentDatasTable'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    equipmentDatasTable
  },
  data() {
    return {
      tabs: [
        {
          index: 'deviceData',
          title: '设备数据管理',
          items: [
            {
              index: 'userMessageTrans',
              title: '用户信息传输装置'
            },
            {
              index: 'NB',
              title: 'NB烟感'
            },
            {
              index: 'pressure',
              title: '液压，液位'
            },
            {
              index: 'electric',
              title: '电气火灾'
            }
          ]
        }
      ],
      isOpenPanel: true,
      combinationName: 'userMessageTrans', // 默认菜单
      componentId: 'userMessageTrans',
      tableData: {
        userMessageTrans: {
          header: [
            // 表格标题行内容
            {
              prop: 'hostName',
              label: '设备名称'
            },
            {
              prop: 'name',
              label: '部件名称'
            },
            {
              prop: 'partsModel',
              label: '部件型号'
            },
            {
              prop: 'loopCode',
              label: '部件回路'
            },
            {
              prop: 'addressCode',
              label: '部件位号'
            },
            {
              prop: 'status',
              label: '部件状态'
            }
          ],
          data: [],
          title: '用户信息传输装置',
          id: 1
        },
        NB: {
          header: [
            // 表格标题行内容
            {
              prop: 'name',
              label: '设备名称'
            },
            {
              prop: 'address',
              label: '安装位置'
            },
            {
              prop: 'modelNum',
              label: '设备型号'
            },
            {
              prop: 'production',
              label: '时间'
            },
            {
              prop: 'status',
              label: '状态'
            }
          ],
          data: [],
          title: 'NB烟感设备',
          id: 2
        },
        pressure: {
          header: [
            // 表格标题行内容
            {
              prop: 'name',
              label: '名称'
            },
            {
              prop: 'address',
              label: '位置'
            },
            {
              prop: 'partsModel',
              label: '部件型号'
            },
            {
              prop: 'production',
              label: '时间'
            },
            {
              prop: 'numerical',
              label: '数值'
            }
          ],
          data: [],
          title: '液压、液位设备',
          id: 3
        },
        electric: {
          header: [
            // 表格标题行内容
            {
              prop: 'name',
              label: '名称',
              width: '120'
            },
            {
              prop: 'address',
              label: '位置',
              width: '120'
            },
            {
              prop: 'partsModel',
              label: '部件型号',
              width: '150'
            },
            {
              prop: 'ma',
              label: '剩余电流',
              width: '120'
            },
            {
              prop: 'at',
              label: 'A相温度',
              width: '120'
            },
            {
              prop: 'bt',
              label: 'B相温度',
              width: '120'
            },
            {
              prop: 'ct',
              label: 'C相温度',
              width: '120'
            },
            {
              prop: 'zerot',
              label: '零线温度',
              width: '100'
            },
            {
              prop: 'ia',
              label: 'A相电流',
              width: '100'
            },
            {
              prop: 'ib',
              label: 'B相电流',
              width: '100'
            },
            {
              prop: 'ic',
              label: 'C相电流',
              width: '100'
            },
            {
              prop: 'va',
              label: 'A相电压',
              width: '100'
            },
            {
              prop: 'vb',
              label: 'B相电压',
              width: '100'
            },
            {
              prop: 'vc',
              label: 'C相电压',
              width: '100'
            },
            {
              prop: 'q',
              label: '总电量KW·h',
              width: '120'
            },
            {
              prop: 'p',
              label: '总有功率KW',
              width: '120'
            }
          ],
          data: [],
          title: '电气火灾设备',
          id: 4
        }
      }
    }
  },
  created() {
    this.setMenu(this.tabs) // 重新赋值menus
    this.tabs = this.newMenu
    this.componentId = this.defaultComponent.index
    this.combinationName = this.defaultComponent.index
    // console.log(this.newMenu, this.defaultComponent.index)
  },
  watch: {},
  computed: {
    ...mapState('login', ['newMenu', 'defaultComponent', 'changComponent']),
    ...mapGetters('login', ['isBtn'])
  },
  methods: {
    ...mapActions('login', ['setMenu', 'changIndex']),
    changeTab(index) {
      this.$nextTick(function() {
        this.componentId = index
      })
    },
    togglePanel() {
      this.isOpenPanel = !this.isOpenPanel
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-main {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  .left-tabs {
    height: 100%;
    overflow-y: auto;
    .arrow {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: right;
      i {
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
    }
    .menu-content {
      height: 100%;
      font-size: 14px;
      .el-menu {
        height: 100%;
        .el-menu-item {
          max-width: 200px;
        }
      }
      dt {
        background: #f2f2f2;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background: #dff5fc;
        }
      }
      dd {
        background: #f8f8f8;
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        margin-inline-start: 0px;
        border-top: 1px solid #ffffff;
        cursor: pointer;
        &:hover {
          color: #538bda;
        }
      }
      .active {
        color: #538bda;
        border-left: 2px solid #2d72d3;
      }
    }
  }
  .right-content {
    flex: 1;
    height: 100%;
    background: #fff;
  }
  .isShow {
    position: absolute;
    top: calc(~'50% - 31px');
    width: 36px;
    height: 62px;
    border-top: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #e6e6e6;
    z-index: 10;
    cursor: pointer;
    i {
      color: #666;
      position: absolute;
      left: -15px;
      top: 6px;
    }
  }
  .el-menu {
    background-color: #eee;
  }
}
</style>
