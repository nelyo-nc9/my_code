<template>
  <div>
    <!-- 进度条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="margin:10px;">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
      <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
      <el-breadcrumb-item>巡检任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{titleNa}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <!-- 按钮组1 -->
      <div class="top-button">
        <el-button size="mini" @click="handleSave">新 建</el-button>
        <el-button size="mini" @click="handleEditor">编 辑</el-button>
        <el-button size="mini">删 除</el-button>
        <el-button size="mini">打印</el-button>
      </div>
      <!-- 表单组 -->
      <div>
        <div class="title-name">巡检任务查看</div>
        <div>
          <el-form ref="form" :model="form" size="mini" label-width="100px" border>
            <!-- 头 -->
            <div class="form-content">
              <div class="form-inner">
                <span class="form-item">
                  <div class="bg-c">巡检计划名称</div>
                  <span>录像机巡检计划</span>
                </span>
              </div>
              <div class="form-inner">
                <span class="form-item">
                  <div class="bg-c">子系统</div>
                  <span>视频子系统</span>
                </span>
                <span class="form-item">
                  <div class="bg-c">设备类型</div>
                  <span>录像机</span>
                </span>
              </div>

              <div class="form-inner">
                <span class="form-item">
                  <div class="bg-c">巡检周期</div>
                  <span>每一天</span>
                </span>
                <span class="form-item">
                  <div class="bg-c">巡检项</div>
                  <el-checkbox-group size="mini" v-model="form.type" disabled>
                    <el-checkbox label="在线" name="type"></el-checkbox>
                    <el-checkbox label="硬盘" name="type"></el-checkbox>
                    <el-checkbox label="视频" name="type"></el-checkbox>
                  </el-checkbox-group>
                </span>
              </div>
              <div class="form-inner">
                <span class="form-item">
                  <div class="bg-c">巡检时间</div>
                  <span>00：00：00</span>
                </span>
              </div>
            </div>
            <!-- 显示隐藏 -->
            <div class="box-title">
              <span class="pointer" @click="changeShow">
                巡检对象
                <i :class="isShow? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
            </div>
          </el-form>
          <!-- 表格  -->
          <div class="table-sty" v-if="isShow">
            <el-table :data="tableData" border size="mini" stripe :height="'37vh'" @row-dblclick="showDetail" @selection-change="handleSelectionChange">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column v-for="item in tableColumn" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
            </el-table>
          </div>

          <div class="people-infor">
            <div>
              <span class="title">录入时间</span>
              <span class="num">2020-02-20 15:00:00</span>
            </div>
            <div>
              <span class="title">录入机构</span>
              <span class="num">xxxxxxxx机构名称</span>
            </div>
            <div>
              <span class="title">录入人</span>
              <span class="num">张三</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import treeTransfer from 'el-tree-transfer'
import taskView from './taskView'
import NewTaskVue from './NewTask.vue'
export default {
  components: { treeTransfer, taskView },
  props: {
    titleNa: String
  },
  data() {
    return {
      // 树的数据 
      mode: "transfer",
      fromData: [
        {
          id: "1",
          pid: 0,
          label: "河北省分行",
          children: [
            {
              id: "1-1",
              pid: "1",
              label: "石家庄分行",
              children: []
            },
            {
              id: "1-2",
              pid: "1",
              label: "保定分行",
              children: [
                {
                  id: "1-2-1",
                  pid: "1-2",
                  children: [],
                  label: "xxx重点部位"
                },
                {
                  id: "1-2-2",
                  pid: "1-2",
                  children: [],
                  label: "创业路支行"
                }
              ]
            }
          ],
        },
      ],
      toData: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // 控制显示于隐藏 
      isShow: true,
      // 表头数据
      // 表格数据
      // 表单数据数据
      form: {
        value: 1,
        type: ['在线']
      },
      // 表头数据
      tableColumn: [
        { prop: 'orgId', label: '所属机构', width: 'auto', sortable: true },
        { prop: 'keySite', label: '所属重点部位', width: 'auto', sortable: true },
        { prop: 'Device', label: '设备名称', width: 'auto', sortable: true },
        { prop: 'code', label: '品牌', width: 'auto', sortable: true },
        { prop: 'address', label: '型号', width: 'auto', sortable: true },
        { prop: 'state', label: '资产编码', width: 'auto', sortable: true },
      ],
      // 表格数据
      tableData: [
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: 1,
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        },
        {
          orgId: '保定分行',
          keySite: 'xx营业网点',
          Device: '硬盘录像机',
          code: '硬盘录像机1-高柜区',
          address: '192.168.1.2',
          state: 1,
          brand: 'xxxxxxx',
          equipmentModel: 'xxxxxx'
        }
      ],

    }

  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    changeShow() {
      this.isShow = !this.isShow
    },
    handleSave() {
      this.$parent.$parent.changeList(NewTaskVue)
    },
    //编辑
    handleEditor() {
      this.$emit("giveValue", "修改")
      this.$parent.$parent.changeList(NewTaskVue)
    }
  },
  // 树的事件 
  changeMode() {
    if (this.mode == "transfer") {
      this.mode = "addressList";
    } else {
      this.mode = "transfer";
    }
  },
  // 监听穿梭框组件添加
  add(fromData, toData, obj) {
    // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
    // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
    console.log("fromData:", fromData);
    console.log("toData:", toData);
    console.log("obj:", obj);
  },
  // 监听穿梭框组件移除
  remove(fromData, toData, obj) {
    // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
    // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
    console.log("fromData:", fromData);
    console.log("toData:", toData);
    console.log("obj:", obj);
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin: 10px;
}
.top-button {
  margin: 10px 0 10px 10px;
}
.title-name {
  margin: 0 0 10px 560px;
  font-size: 14px;
  font-weight: 600;
}
.form-content {
  border: 1px solid #ccc;
  width: 800px;
  height: 140px;
  margin-left: 200px;
  box-sizing: border-box;
  padding: 2px;
  .form-inner {
    width: 100%;
    height: 25%;
    .form-item {
      width: 50%;
      height: 100%;
      .bg-c {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #ccc;
      }
      span {
        display: inline-block;
        width: 270px;
        text-align: center;
        font-size: 13px;
      }
      .el-input {
        width: 270px;
        height: 30px;
      }
      .el-select {
        width: 270px;
        height: 30px;
      }
      .el-checkbox-group {
        display: inline-block;
        width: 270px;
        height: 30px;
      }
    }
  }
}

.box-title {
  position: relative;
  height: 24px;
  line-height: 24px;
  color: #606266;

  i {
    position: absolute;
    top: 50%;
    left: 85px;
    transform: translateY(-50%);
  }
  &::after {
    display: block;
    content: '';
    border-top: 1px solid #e1e1e1;
    width: calc(~'100% - 120px');
    margin-left: 100px;
    margin-top: -12px;
  }
}
.tree-two {
  width: 800px;
  height: 350px;
  .tree-content {
    margin: 10px 0 0 200px;
  }
}
.el-tree-node__label {
  font-size: 12px;
}
.people-infor {
  width: 800px;
  height: 30px;
  margin: 0px 0 10px 200px;
  font-size: 12px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  div {
    float: left;
    width: 33.33%;
    height: 100%;
    display: flex;
    .title {
      flex: 3;
      background-color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ffffff;
    }
    .num {
      flex: 7;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
}
.table-sty {
  margin: 0 0 12px 200px;
  width: 800px;
}
</style>

