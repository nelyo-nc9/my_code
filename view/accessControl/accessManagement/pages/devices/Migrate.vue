<template>
  <div id="mer">
    <TabMenu :tabList="tabList" />
    <div class="merGe">
      <div class="merInfo">
        <p class="mergeInfoTitle">迁移源信息</p>
        <ul class="mergeCon">
          <!-- 注释 防止报错无法显示页面 -->
          <li class="mergeItem">
            <i>门禁平台名称 :</i>
            <span>{{updataItem.name}}</span>
          </li>
          <li class="mergeItem">
            <i>所属重点部位 :</i>
            <span>{{updataItem.keyPartName}}</span>
          </li>
          <li class="mergeItem">
            <i>所属机构 :</i>
            <span>{{updataItem.orgName}}</span>
          </li>
        </ul>
        <el-checkbox-group v-model="checkList" @change="checkedSource">
          <el-checkbox
            v-for="(item,index) in migra"
            :key="item.id"
            :label="index"
            style="display: block;margin: 10px 5px;"
          >
            <span>{{item.orgId}}</span>
            <span>{{item.keyPartId}}</span>
            <span>{{item.keyPartType}}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="tree">
        <p class="treeTitle">选择迁移目标</p>
        <treeBox
          :lazyTreeApi="getTreeApi"
          searchType="filter"
          :treeType="treeType"
          @onceClick="onceClick"
          treeLazyToggle
          iconToggle
        ></treeBox>
      </div>
    </div>
    <div class="viewVBtnss">
      <el-button @click="chageType('create')" size="mini">保存</el-button>
      <el-button @click="chageType(true)" size="mini">关闭</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { terraceMigrate } from '@src/http/access/accessMan'
import { getTreeApi } from '@src/http/access/accessMan'
export default {
  components: {
    TabMenu: () => import('../../components/tabMenu'),
    treeBox: () => import('@src/components/tree/treeBox')
  },
  data() {
    return {
      checkList: [],
      treeType: 2,

      filterText: '',
      isCreate: '',
      tabList: ['基础信息', '门禁平台管理', '列表', '迁移'],
      data: [
        {
          label: '河北省分行',
          children: [
            {
              label: '石家庄分行',
              children: [
                {
                  label: '创业路支行',
                  children: [
                    {
                      label: '创业路营业网点',
                      children: [
                        {
                          label: '报警控制主机'
                        }
                      ]
                    }
                  ]
                },
                {
                  label: '丰收路支行',
                  children: [
                    {
                      label: '丰收路办公楼',
                      children: [
                        {
                          label: '振动光纤报警主机'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              label: '保定分行',
              children: [
                {
                  label: '融汇支行'
                },
                {
                  label: '五四西路支行'
                },
                {
                  label: '五四中路支行'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  props: ['isView', 'deviceModel', 'tableDatas', 'qianyi', 'migra', 'listRow', 'updataItem'],
  methods: {
    checkedSource(val) {
      let res
      val.forEach((item, index) => {
        this.migra.map((items, index) => {
          if (item == index) {
            return items
          }
        })
      })
      this.checkList = this.$lodash.cloneDeep(val)

      console.log('Log 查看被选中的数组???', res)
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick() {},

    //tree filter
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    //table 多选
    tableSelect() {},
    collapseChange(chageItem) {},

    chageType(a) {
      if (a == 'create') {
        let ids = []
        this.listRow.forEach(item => {
          ids.push({
            keyPartType: item.keyPartType,
            orgId: '',
            keyPartId: ''
          })
        })
      }
      this.$emit(
        'modelChange',
        {
          ParerntFlag: a,
          CurrtTitle: '列表'
        },
        'Create'
      )
      this.saveMig()
    },
    saveMig() {
      let { id, keyPartName, subSystemName } = this.qianyi
      let ids = [{ orgId: id, keyPartId: keyPartName, keyPartType: subSystemName * 1 }]
      terraceMigrate('/resource/v1/guard/platform/transfer', ids).then(res => {})
    },

    handleSizeChange() {},
    handleCurrentChange() {}
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.merGe {
  margin: 30px 0;
  width: 710px;
  height: 600px;
  // border: 10px solid #e6e6e6;
  border: 1px solid #e6e6e6;
  margin-left: 10px;
  display: flex;
  .merInfo {
    flex: 1;
    height: 100%;
    text-align: center;
    margin-right: 1px;
    p {
      font-size: 14px;
      font-weight: 700;
      padding: 10px 0;
      background: #e6e6e6;
    }
    ul {
      li {
        line-height: 20px;
        text-align: left;
        padding: 5px;
        &:first-child {
          margin-top: 10px;
          span {
            text-align: left;
          }
        }
      }
    }
    /deep/ .el-checkbox {
      text-align: left;
    }
  }
  .tree {
    // border: 10px solid blue;
    border-left: 1px solid #e6e6e6;
    flex: 1;
    height: 100%;
    // overflow: auto;
    text-align: center;
    p {
      padding: 10px 0;
      font-size: 14px;
      font-weight: 700;
      background: #e6e6e6;
    }
  }
}
.viewVBtnss {
  margin-top: 20px;
}
#mer {
  height: 100%;
  width: 450px;
}
</style>
