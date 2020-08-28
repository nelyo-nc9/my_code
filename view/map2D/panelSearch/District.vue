<!--
 * @Author: fengbeibei
 * @Date: 2020-05-25 18:59:48
 * @LastEditTime: 2020-05-25 20:03:46
 * @LastEditors: fengbeibei
 * @Description: 行政区划树
-->
<template>
  <div>
    <div>
      <el-input v-model="keywords" size="mini" class="search" placeholder="请输入内容">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="hendleSearch(keywords)" />
      </el-input>
    </div>
    <div class="treeBox" v-if="searchResult">
      <ul :span="6" v-for="item in DisTreeList" :key="item.id">
        <li class="findLi" :type="item.value ? 'primary' : 'info'" size="mini" @click="handleNodeClick(item)">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="treeBox" v-if="!searchResult">
      <el-tree :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick" accordion />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { toTree } from '../utils'
export default {
  data() {
    return {
      searchResult: false,
      defaultSeachProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      keywords: '',
      ShowSearch: false,
      noLazy: false,
      list: [],
      nowSearchStr: '',
      nowSearchStrOld: '',
      DisTreeList: []
    }
  },
  // props: { keywords: String, select: String },
  computed: {
    ...mapState({
      drawFeatureStyle: ({ map2d }) => map2d.mapIndex.drawFeatureStyle.val
    }),
    ...mapGetters('map2d/mapIndex', [
      'administrativeAreaInfo',
      'getAlarmSetting',
      'addAlarmSetting',
      'updateAlarmSetting',
      'isMapEdit'
    ]),
    treeList() {
      return toTree(this.list)
    }
  },
  watch: {
    administrativeAreaInfo() {
      if (this.list.length === 0) {
        this.updateDivToList(this.administrativeAreaInfo)
      }
    },
    keywords: {
      immediate: true,
      handler: function(newValue, oldValue) {
        this.nowSearchStr = newValue
        if (this.nowSearchStr !== '') {
          // this.searchResult = true
        } else {
          this.searchResult = false
          this.updateDivToList()
        }
      }
    }
  },
  mounted() {
    if (this.list.length === 0 && this.administrativeAreaInfo && this.administrativeAreaInfo.length > 0) {
      this.updateDivToList(this.administrativeAreaInfo)
    }
  },
  methods: {
    ...mapActions('map2d/mapIndex', [
      'getAllTreeApiData',
      'updateMapId',
      'setNowSelectAreaInfo',
      'getTreeApiSubaAreaInfo',
      'setAdministrativeAreaInfo',
      'setCurrPanelToolComponent',
      'setPanelInfoStatus',
      'getDistrictSetting',
      'saveDistrictSetting',
      'getVagueTreeApiSubaAreaByUrl'
    ]),
    loadNode(node, resolve) {
      // 如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.loadfirstnode(resolve)
      } else if (node.level === 1) {
        if (
          node.data.adcode == '110000' ||
          node.data.adcode == '120000' ||
          node.data.adcode == '310000' ||
          node.data.adcode == '500000'
        ) {
          this.loadchildLeafnode(node, resolve)
        } else {
          this.loadchildnode(node, resolve)
        }
      } else if (node.level === 2) {
        this.loadchildLeafnode(node, resolve)
      }
      // this.handleNodeClick({ data: node })
    },
    // 加载第一级节点
    loadfirstnode(resolve) {
      this.getAllTreeApiData().then(data => {
        if (data.data.areas) {
          data.data.areas.forEach(item => {
            if (item.adcode == '810000' || item.adcode == '820000') {
              item.leaf = true
            }
          })
          return resolve(data.data.areas)
        } else {
          return resolve([])
        }
      })
      // debugger
    }, // 加载节点的子节点集合
    loadchildnode(node, resolve) {
      this.getTreeApiSubaAreaInfo({ adcode: node.data.adcode }).then(data => {
        if (data.data.areas) {
          return resolve(data.data.areas)
        } else {
          return resolve([])
        }
      })
    },
    loadchildLeafnode(node, resolve) {
      this.getTreeApiSubaAreaInfo({ adcode: node.data.adcode }).then(data => {
        if (data.data.areas) {
          data.data.areas.forEach(item => {
            item.leaf = true
          })
          return resolve(data.data.areas)
        } else {
          return resolve([])
        }
      })
    },
    // 处理树节点点击事件
    handleNodeClick(areaData) {
      // 1显示右侧面板 设置为样式console.log()设置页面板
      this.updateMapId(areaData.adcode.toString())
      this.setNowSelectAreaInfo(JSON.parse(JSON.stringify(areaData)))
    },
    updateDivToList() {
      this.list.length = 0
      this.administrativeAreaInfo.forEach((item1, index1) => {
        this.list.push({
          id: (index1 + 1).toString(),
          label: item1.name,
          pid: '',
          icon: '',
          data: JSON.parse(JSON.stringify(item1))
          // isLeaf: item1.adcode.toString().substr(2, 4) === '0000' ? true : true
        })
        if (item1.childData) {
          item1.childData.forEach((item2, index2) => {
            this.list.push({
              id: (index2 + 1).toString() + '-' + (index1 + 1).toString(),
              label: item2.name,
              pid: (index1 + 1).toString(),
              icon: '',
              data: JSON.parse(JSON.stringify(item2))
            })

            if (item2.childData) {
              item2.childData.forEach((item3, index3) => {
                this.list.push({
                  id: (index3 + 1).toString() + '-' + (index2 + 1).toString() + '-' + (index1 + 1).toString(),
                  label: item3.name,
                  pid: (index2 + 1).toString() + '-' + (index1 + 1).toString(),
                  icon: '',
                  data: JSON.parse(JSON.stringify(item3))
                })
              })
            }
          })
        }
      })
      console.log(this.list)
    },
    updateListByVagueData() {
      // 获取所有行政区划子信息
      this.getVagueTreeApiSubaAreaByUrl({ keyword: this.nowSearchStr })
        .then(res => {
          if (res.code !== 0) {
            this.$notify({
              type: '失败',
              type: 'error',
              message: res.message
            })
          } else if (res.data && res.data.areas) {
            let areas = JSON.parse(JSON.stringify(res.data.areas))
            this.list.length = 0
            areas.forEach(item => {
              this.list.push({
                id: item.adcode,
                label: item.name,
                pid: '',
                icon: '',
                data: JSON.parse(JSON.stringify(item))
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理输入框搜索按钮点击
    hendleSearch(val) {
      if (val !== '') {
        this.searchResult = true
        let nowThis = this
        this.DisTreeList = []
        nowThis.ShowSearch = true
        // 获取所有行政区划子信息
        this.getVagueTreeApiSubaAreaByUrl({ keyword: val })
          .then(res => {
            if (res.code !== 0) {
              this.$notify({
                title: '失败',
                type: 'error',
                message: res.message
              })
            } else if (res.data && res.data.areas) {
              console.log('请求成功', res.data)
              let areas = JSON.parse(JSON.stringify(res.data.areas))
              this.DisTreeList = areas
              this.list.length = 0
              areas.forEach((item, index) => {
                if (index < 100) {
                  this.list.push({
                    id: item.adcode,
                    label: item.name,
                    pid: '',
                    icon: '',
                    data: JSON.parse(JSON.stringify(item))
                    // isLeaf: item.adcode.toString().substr(2, 4) === '0000' ? true : true
                  })
                }
              })
              // this.DisTreeList = areas
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.searchResult = false
        this.$notify({
          type: 'warning',
          title: '警告',
          message: '请输入关键字'})
      }
      this.updateDivToList()
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  /deep/ .el-select .el-input {
    width: 80px;
  }
  /deep/ .el-select input {
    padding-left: 8px;
  }
}
.treeBox {
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0);
  /deep/ .el-tree {
    background-color: rgba(0, 0, 0, 0);
  }
}

.findLi {
  padding-left: 12px;
  font-size: 14px;
  width: calc(100% - 24px);
  height: 100%;
  line-height: 40px;
  position: relative;
}
.findLi:hover{
cursor:pointer;
color: #4887be;
}
</style>
