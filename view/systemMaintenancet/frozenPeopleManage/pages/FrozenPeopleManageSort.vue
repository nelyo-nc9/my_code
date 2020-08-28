<template>
  <div class="frozen-manage-search-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <!-- 操作按钮 -->
            <div class="button-box">
              <el-button @click="shiftUp">上移</el-button>
              <el-button @click="shiftDown">下移</el-button>
              <el-button @click="top">置顶</el-button>
              <el-button @click="bottom">置底</el-button>
            </div>
            <div class="p-serach-from">
              <ul>
                <li>
                  <span>序号</span>
                  <section>用户姓名</section>
                </li>
                <li
                  v-for="(item,index) in tableData"
                  :key="index"
                  class="bl"
                  :class="currentIndex==index?'active':''"
                  @click="changeLi(index)"
                >
                  <span>{{index+1}}</span>
                  <section>{{item.name}}</section>
                </li>
              </ul>
            </div>
            <div class="p-search-footer">
              <el-button type="primary" @click="keep">保存</el-button>
              <el-button @click="cancel">关闭</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FozenPeopleManageSort',
  data() {
    return {
      tableData: [
        {
          name: '张翰1',
          pinyin: 'zhanghan',
          userName: 'zhanghan',
          uid: '0123689',
          sex: '男',
          birthday: '1990-06-25',
          degree: '学士',
          schooling: '本科',
          professional: '金融',
          school: '河北大学',
          schoolType: 'XXX',
          learningType: 'XXX',
          graduationDate: '2020-06-25',
          org: '定州支行',
          units: 'XXX',
          type: 'XXX'
        },
        {
          name: '张翰2',
          pinyin: 'zhanghan',
          userName: 'zhanghan',
          uid: '0123689',
          sex: '男',
          birthday: '1990-06-25',
          degree: '学士',
          schooling: '本科',
          professional: '金融',
          school: '河北大学',
          schoolType: 'XXX',
          learningType: 'XXX',
          graduationDate: '2020-06-25',
          org: '定州支行',
          units: 'XXX',
          type: 'XXX'
        },
        {
          name: '张翰3',
          pinyin: 'zhanghan',
          userName: 'zhanghan',
          uid: '0123689',
          sex: '男',
          birthday: '1990-06-25',
          degree: '学士',
          schooling: '本科',
          professional: '金融',
          school: '河北大学',
          schoolType: 'XXX',
          learningType: 'XXX',
          graduationDate: '2020-06-25',
          org: '定州支行',
          units: 'XXX',
          type: 'XXX'
        },
        {
          name: '张翰4',
          pinyin: 'zhanghan',
          userName: 'zhanghan',
          uid: '0123689',
          sex: '男',
          birthday: '1990-06-25',
          degree: '学士',
          schooling: '本科',
          professional: '金融',
          school: '河北大学',
          schoolType: 'XXX',
          learningType: 'XXX',
          graduationDate: '2020-06-25',
          org: '定州支行',
          units: 'XXX',
          type: 'XXX'
        }
      ],
      currentIndex: null
    }
  },
  created() {
    this.tableData = JSON.parse(localStorage.sortArr)
  },
  methods: {
    // 当前索引
    changeLi(index) {
      this.currentIndex = index
    },
    // 上移
    shiftUp() {
      let { tableData, currentIndex } = this
      let arr = [...tableData]
      if (currentIndex <= 0) {
        this.$message('当前项已排列至第一位')
      } else {
        let item = arr[currentIndex]
        arr[currentIndex] = arr[currentIndex - 1]
        arr[currentIndex - 1] = item
        this.currentIndex = currentIndex - 1
        this.tableData = [...arr]
      }
    },
    // 下移
    shiftDown() {
      let { tableData, currentIndex } = this
      let arr = [...tableData]
      if (currentIndex >= tableData.length - 1) {
        this.$message('当前项已排列至最后一位')
      } else {
        let item = arr[currentIndex]
        arr[currentIndex] = arr[currentIndex + 1]
        arr[currentIndex + 1] = item
        this.currentIndex = currentIndex + 1
        this.tableData = [...arr]
      }
    },
    // 置顶
    top() {
      let { tableData, currentIndex } = this
      let arr = [...tableData]
      if (currentIndex === 0) {
        this.$message('当前项已置顶')
      } else {
        let arr1 = arr.filter((item, index) => currentIndex === index)
        let arr2 = arr.filter((item, index) => currentIndex !== index)
        this.currentIndex = 0
        this.tableData = [...arr1, ...arr2]
      }
    },
    // 置底
    bottom() {
      let { tableData, currentIndex } = this
      let arr = [...tableData]
      if (currentIndex === 0) {
        this.$message('当前项已置底')
      } else {
        let arr1 = arr.filter((item, index) => currentIndex === index)
        let arr2 = arr.filter((item, index) => currentIndex !== index)
        this.currentIndex = tableData.length - 1
        this.tableData = [...arr2, ...arr1]
      }
    },
    // 保存
    keep() {
      localStorage.sortArr = JSON.stringify(this.tableData)
      this.cancel()
    },
    // 关闭
    cancel() {
      this.$emit('changeComponent', localStorage.peoplecont, localStorage.index)
    }
  }
}
</script>

<style lang="less" scoped>
.frozen-manage-search-box {
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
        width: 80%;
        .main-box {
          padding: 20px;
          border: 1px solid #ddd;
          .button-box {
            width: 80%;
            margin: 10px auto;
            display: flex;
            justify-content: space-around;
            button {
              padding: 10px 40px;
            }
          }
          .p-serach-from {
            border: 1px solid #f5f5f5;
            padding: 10px;
            width: 80%;
            height: 510px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            ul {
              width: 68%;
              height: 96%;
              overflow: auto;
              li {
                width: 100%;
                height: 30px;
                display: flex;
                span {
                  width: 150px;
                  height: 96%;
                  background: #f5f5f5;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-right: 3px solid white;
                }
                section {
                  flex: 1;
                  height: 96%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }
              li:nth-child(even) {
                span {
                  background: #f5f5f5;
                }
                section {
                  background: #f5f5f5;
                }
              }
              li:nth-child(odd) {
                span {
                  background: #ddd;
                }
                section {
                  background: #ddd;
                }
              }
              .bl:hover {
                background: rgba(163, 229, 255, 0.4);
                cursor: pointer;
                span {
                  border: none;
                  background: rgba(163, 229, 255, 0.4);
                }
                section {
                  background: rgba(163, 229, 255, 0.4);
                }
              }
              .active {
                background: rgba(163, 229, 255, 0.4);
                cursor: pointer;
                span {
                  border: none;
                  background: rgba(163, 229, 255, 0.4) !important;
                }
                section {
                  background: rgba(163, 229, 255, 0.4) !important;
                }
              }
            }
          }
          .p-search-footer {
            // border: 1px solid #ddd;
            margin: 10px 0px;
            width: 80%;
            height: 40px;
            margin: 20px auto;
            display: flex;
            justify-content: center;
          }
        }
      }
    }
    .main {
      width: 100%;
      // min-width: 800px;
      // height: calc(~'100% - 75px');
      .list-box-table {
        width: 100%;
        // height: 300px;
        overflow: auto;
        height: calc(~'100% - 543px');
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
