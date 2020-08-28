<!--
 * @Author: your name
 * @Date: 2020-06-23 09:27:32
 * @LastEditTime: 2020-06-23 20:22:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\dataDictionary\pages\DataDictionarySearch.vue
-->
<template>
  <div class="data-dictionary-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="p-search-from">
              <el-row>
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">名称</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input  v-model="form.name"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">类别</div>
                    </el-col>
                    <el-col :span=18>
                      <el-select v-model="form.type" style="width: 100%;">
                        <el-option v-for="(item,index) in typeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row style="margin-top:1px;">
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">显示名</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input  v-model="form.showName"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">排列序号</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input  v-model="form.permutationsNum"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row style="margin-top:1px;">
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">状态</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input  v-model="form.status"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span=12>
                  <el-row>
                    <el-col :span=6>
                      <div class="item">创建时间</div>
                    </el-col>
                    <el-col :span=18>
                      <el-input v-model="form.creatTime"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="p-search-footer">
              <el-button  size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <div class="list-box-table">
          <el-table stripe border size="medium" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" @sort-change="sortChange"  ref="Table" height="100%" max-height="550" style="width: 100%">
            <el-table-column type="selection" width="" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="" align="center"></el-table-column>
            <el-table-column
              v-for="(column, index) in columns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :sortable="column.sortable"
              show-overflow-tooltip
              align="center"
              :resizable="resizable"
            ></el-table-column>
          </el-table>
        </div>
        <div class="main-footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25,50,100]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { queryDataDictApi } from '../../../../http/systemOperationManage/dataDictionary.api'
export default {
  name: 'DataDictionarySearch',
  data() {
    return {
      resizable: false,
      columns: [
        { prop: 'name', sortable: true, label: '名字', width: '' },
        { prop: 'showName', sortable: true, label: '显示名', width: '' },
        { prop: 'type', sortable: true, label: '类别', width: '' },
        { prop: 'permutationsNum', sortable: true, label: '排列序号', width: '' },
        { prop: 'status', sortable: true, label: '状态', width: '' },
        { prop: 'creatTime', sortable: true, label: '创建时间', width: '' }
      ],
      typeArray: [
        {value: 1, label: '全部'}
      ],
      tableData: [
        {
          name: 'XXX',
          showName: 'XXX',
          type: 'XXX',
          permutationsNum: 'XXX',
          status: 'XXX',
          creatTime: 'XXX'
        },
        {
          name: 'XXX',
          showName: 'XXX',
          type: 'XXX',
          permutationsNum: 'XXX',
          status: 'XXX',
          creatTime: 'XXX'
        },
        {
          name: 'XXX',
          showName: 'XXX',
          type: 'XXX',
          permutationsNum: 'XXX',
          status: 'XXX',
          creatTime: 'XXX'
        }
      ],
      total: 0,
      selectData: [],
      obj: {},
      form: {
        showName: '',
        name: '',
        type: 1,
        status: '',
        creatTime: '',
        permutationsNum: ''
      },
      pageSize: 10,
      page: 1
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 排序信息
    sortChange(a) {
      console.log(a)
    },
    // 列表勾选
    handleSelectionChange(val) {
      this.selectData = [...val]
      console.log(val, '列表勾选')
    },
    // 分页码
    handleCurrentPageNum(val) {
      this.page = val
    },
    // 分页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    // 查询预置
    onSubmit() {
      return this.$message('查询')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/elementModify.less';
.data-dictionary-search-box {
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    width: 100%;
    padding-left: 10px;
    .top {
      width: 100%;
      .header {
        margin-bottom: 10px;
      }
      .top-main {
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 20px 20px 20px 0;
          .p-search-from {
            border: 1px solid #ddd;
            padding: 2px;
            margin: 0 auto;
            width: 70%;
            .item {
              height: 40px;
              line-height: 40px;
              margin-right: 3px;
              text-align: center;
              background: #f2f2f2;
            }
            .details {
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
          }
          .p-search-footer {
            width: 70%;
            padding-top: 20px;
            margin: 0 auto;
            text-align: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 265px');
      .list-box-table {
        width: 100%;
        overflow: auto;
        height: 100%;
      }
      .main-footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
      }
    }
  }
}
</style>
