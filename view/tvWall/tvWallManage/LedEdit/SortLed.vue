<!--
 * @Author: your name
 * @Date: 2020-06-23 16:53:02
 * @LastEditTime: 2020-07-18 19:36:05
 * @Description: In User Settings Edit
 * @FilePath: \CCB\client\src\view\tvWall\tvWallManage\decodingDevice\SortDecoding.vue
-->
<template>
  <div class="main">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               :treeType="treeType"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
          <el-breadcrumb-item>解码设备配置</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
          <el-breadcrumb-item>排序</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <div class="main-content">
        <div style="margin: 10px 0;">解码设备列表信息</div>
        <div style="margin: 10px 0;">
          <el-button size="small"
                     @click="up(arrIndex)">上移</el-button>
          <el-button size="small"
                     @click="down(arrIndex)">下移</el-button>
          <el-button size="small"
                     @click="upIndex(arrIndex)">置顶</el-button>
          <el-button size="small"
                     @click="downIndex(arrIndex)">置尾</el-button>
        </div>
        <el-table :data="tableData"
                  border
                  height="450"
                  size="mini"
                  stripe
                  @select="selectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="name"
                           label="解码设备名称"></el-table-column>
          <el-table-column prop="assetCode"
                           label="资产编码"></el-table-column>
        </el-table>
        <div style="margin-top: 24px;">
          <el-button size="small"
                     type="primary"
                     @click="save">保存</el-button>
          <el-button size="small"
                     @click="cancel">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, searchTreeApi2 } from '../../../../http/tvWall/tvWallmanage.api'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData
    })
  },
  data() {
    return {
      tableData: [],
      arrIndex: 0,
      currentOrgId: '',
      currentKeyPartId: '',
      treeType: 2
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE']),
    ...mapActions(['DecodingSort', 'getDecodingDevice']),
    cancel() {
      this.SET_COMPONENTID1('LedEditList')
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    // 点击机构树的节点，对应请求某机构或重点部位的电视墙列表
    // onceClick(data, node) {
    //   if (data.tierType === 'org') {
    //     this.currentOrgId = data.id
    //   } else {
    //     this.currentOrgId = node.parent.data.id
    //     this.currentKeyPartId = data.id
    //   }
    //   this.getTvwallList(1)
    // },
    /**
     * arr是要操作的数组
     * index1 是准备移动的元素
     * index2 是准备移动到的位置 往下移就是 index2=index+1
     * 往上移动就是 index2=index+1
     */
    swapItems(arr, index1, index2, direction) {
      if (direction === 'up') {
        // 置顶
        arr.unshift(arr[index1])
        arr.splice(index1 + 1, 1)
        return arr
      }
      if (direction === 'down') {
        // 置底
        arr.push(arr[index1])
        arr.splice(index1, 1)
        return arr
      }
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      console.log(arr, '排序后要返回的数组')
      return arr
    },
    upIndex(index) {
      if (index === 0) {
        return
      }
      this.swapItems(this.tableData, index, 0, 'up')
      this.arrIndex = 0
    },
    up(index) {
      if (index === 0) {
        return
      }
      this.swapItems(this.tableData, index, index - 1)
      this.arrIndex--
    },
    down(index) {
      console.log(index, 'index down')
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, index + 1)
      this.arrIndex++
    },
    downIndex(index) {
      if (index === this.tableData.length - 1) {
        return
      }
      this.swapItems(this.tableData, index, 0, 'down')
      this.arrIndex = this.tableData.length - 1
    },
    selectionChange(selection, row) {
      console.log(row, '================')
      console.log((this.tableData || []).findIndex(profile => profile.id === row.id))
      this.arrIndex = (this.tableData || []).findIndex(profile => profile.id === row.id)
      console.log(this.arrIndex, 'this.arrIndex================')
    },
    save() {
      let params = {
        sequences: []
      }
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].orderId = i + 1
        let tempObj = {
          id: this.tableData[i].id,
          orderId: this.tableData[i].orderId
        }
        params.sequences.push(tempObj)
      }
      console.log(params, ' params.sequences=====')
      this.DecodingSort(params)
        .then(res => {
          if (res.data.code === 0) {
            this.succefullMethod('排序成功')
            this.SET_COMPONENTID1('LedEditList')
          } else {
            this.failureMethod('排序失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  },
  created() {
    this.getDecodingDevice({
      page: 1,
      limit: 100,
      orgId: this.formData.orgId,
      keyPartId: this.formData.keyPartId,
      type: '3'
    })
      .then(res => {
        const result = res.data.data.hosts
        Array.isArray(result) &&
          result.forEach(item => {
            if (item.updatedAt !== undefined) {
              item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
            }
          })
        this.tableData = result
      })
      .catch(() => { })
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .main-content {
      width: 600px;
      text-align: center;
      margin-left: 20px;
    }
  }
}
</style>
