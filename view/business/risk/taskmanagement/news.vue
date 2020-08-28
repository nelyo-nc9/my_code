<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>AI任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查看部分 -->
    <div class="view" v-if="isview">
      <!-- 顶部按钮 -->
      <div>
        <el-row class="rowbutton">
          <el-button @click="news">新建</el-button>
          <el-button @click="redact">编辑</el-button>
          <el-button>删除</el-button>
          <el-button @click="print">打印</el-button>
        </el-row>
        <div>
          <p>查看</p>
          <div class="views">
            <div>
              <span>摄像机</span>
              <span>XX摄像机</span>
            </div>
            <div>
              <span>所属重点部位</span>
              <span>XX监控中心</span>
            </div>
            <div>
              <span>所属机构</span>
              <span>XX分行</span>
            </div>
            <div>
              <span>所属设备</span>
              <span>XXXNVR</span>
            </div>
            <div>
              <span>分析模块</span>
              <span>手机拍照</span>
            </div>
            <div>
              <span>AI设备</span>
              <span>3800HW</span>
            </div>
            <div>
              <span>启用</span>
              <span>启用</span>
            </div>
            <div>
              <span>时间模板</span>
              <span>休息时间</span>
            </div>
            <div>
              <span>分析频率</span>
              <span>20s/次</span>
            </div>

            <!-- 录入信息 -->
            <section class="footsection">
              <div>
                <span>录入时间</span>
                <span>2020-02-20  15:00:00</span>
              </div>
              <div>
                <span>录入机构</span>
                <span>xxxxxxxx机构名称</span>
              </div>
              <div>
                <span>录入人</span>
                <span>张三</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建AI任务 -->
    <div class="mission" v-if="ismission">
      <p>新建AI任务</p>
      <div class="missions">
        <div>
          <span>摄像机*</span>
          <div>
             <el-select
              v-model="saveForm.upResId"
              clearable
              placeholder="请选择"
              @clear="handleClear"
              ref="selectUpResId"
              style="width:380px"
            >
              <el-option hidden key="upResId" :value="saveForm.upResId" :label="upResName">
              </el-option> 
              <el-tree
                :data="data"
                :props="defaultProps"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </el-select>
          </div>
        </div>
        <div>
          <span>所属重点部位*</span>
          <el-input v-model="input" placeholder="XX监控中心"></el-input>
        </div>
        <div>
          <span>所属机构*</span>
          <el-input v-model="inputs" placeholder="中国建设银行/河北省分行"></el-input>
        </div>
        <div>
          <span>所属设备*</span>
          <el-input v-model="inputt" placeholder="XXXDVR/XXX通道"></el-input>
        </div>
        <div>
          <span>分析模块*</span>
          <el-form>
            <el-select v-model="form.analyze" placeholder="请选择" style="width:380px">
              <el-option label="业务终端拍照" value="业务终端拍照"></el-option>
            </el-select>
          </el-form>
        </div>
        <div>
          <span>AI设备*</span>
          <el-form>
            <el-select v-model="form.device" placeholder="请选择" style="width:380px">
              <el-option label="总行智能分析云平台" value="总行智能分析云平台"></el-option>
            </el-select>
          </el-form>
        </div>
        <div>
          <span>启用*</span>
          <el-form>
            <el-select v-model="form.enabled" placeholder="请选择" style="width:380px">
              <el-option label="启用" value="启用"></el-option>
              <el-option label="禁用" value="禁用"></el-option>
            </el-select>
          </el-form>
        </div>
        <div>
          <span>时间模板*</span>
          <el-select v-model="form.time" placeholder="请选择" style="width:380px">
            <el-option label="24小时" value="24小时"></el-option>
          </el-select>
        </div>
        <div>
          <span>分析频率*</span>
          <el-input v-model="inputf" placeholder="请输入"></el-input>
        </div>
        <!-- 录入信息 -->
        <section class="footsection">
          <div>
            <span>录入时间</span>
            <span>2020-02-20  15:00:00</span>
          </div>
          <div>
            <span>录入机构</span>
            <span>xxxxxxxx机构名称</span>
          </div>
          <div>
            <span>录入人</span>
            <span>张三</span>
          </div>
        </section> 
      </div> 
      
      <!-- 底部信息 -->
      <div>
        <el-row class="rowbuttons">
          <el-button @click="save">保存</el-button>
          <el-button>重置</el-button>
          <el-button @click="close">关闭</el-button>
        </el-row>
      </div>
    </div>

    <!-- 打印表单 -->
    <div class="print" v-if="isprint">
      <div>
        <p>打印表单</p>
        <div class="views">
          <div>
            <span>摄像机</span>
            <span>XX摄像机</span>
          </div>
          <div>
            <span>所属重点部位</span>
            <span>XX监控中心</span>
          </div>
          <div>
            <span>所属机构</span>
            <span>XX分行</span>
          </div>
          <div>
            <span>所属设备</span>
            <span>XXXNVR</span>
          </div>
          <div>
            <span>分析模块</span>
            <span>手机拍照</span>
          </div>
          <div>
            <span>AI设备</span>
            <span>3800HW</span>
          </div>
          <div>
            <span>启用</span>
            <span>启用</span>
          </div>
          <div>
            <span>时间模板</span>
            <span>休息时间</span>
          </div>
          <div>
            <span>分析频率</span>
            <span>20s/次</span>
          </div>

          <!-- 录入信息 -->
          <section class="footsection">
            <div>
              <span>录入时间</span>
              <span>2020-02-20  15:00:00</span>
            </div>
            <div>
              <span>录入机构</span>
              <span>xxxxxxxx机构名称</span>
            </div>
            <div>
              <span>录入人</span>
              <span>张三</span>
            </div>
          </section>
        </div>
      </div>

      <!-- 底部信息 -->
      <div>
        <el-row class="rowbuttont">
          <el-button @click="close">关闭</el-button>
          <el-button @click="prints">打印</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      input:'',
      inputs:'',
      inputt:'',
      inputf:'10s',
      upResName:'',
      isview:true,
      ismission:false,
      isprint:false,
      form:{
        analyze:'业务终端拍照',
        device:'总行智能分析云平台',
        enabled:'启用'
      },
      saveForm:{
        upResId:''        
      },
      data: [{
        resId: 1,
        name: '河北省分行',
        children: [{
          resId: 2,
          name: 'xxx金库中心'
        },{
          resId:3,
          name: '保定分行',
          children:[{
            resId:5,
            name: 'xxx营业网点'
          },
          {
            resId:6,
            name: '融汇支行'
          },
          {
            resId:7,
            name: '五四西路支行'
          },
          {
            resId:8,
            name: '竞秀支行'
          },
          {
            resId:9,
            name: '五四中路支行'
          }]
        },{
          resId:4,
          name: '张家口分行',
          children:[{
            resId: 10,
            name: 'xxx监控中心',
            children:[{
              resId: 13,
              name: 'XXX摄像机',
              children:[{
                resId: 15,
                name: '终端拍照'
              }]
            },
            {
              resId: 14,
              name: 'XXX摄像机',
              children:[{
                resId: 16,
                name: '终端拍照'
              }]
            }]
          },
          {
            resId: 11,
            name: '建国路支行'
          },
          {
            resId: 12,
            name: '北环路支行'
          },]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    news(){
      this.isview=false;
      this.ismission=true;
      this.isprint=false;
    },
    redact(){
      this.isview=false;
      this.ismission=true;
      this.isprint=false;
    },
    print(){
      this.isview=false;
      this.ismission=false;
      this.isprint=true;
    },
    save(){
      this.isview=true;
      this.ismission=false;
      this.isprint=false;
    },
    close(){
      this.isview=true;
      this.ismission=false;
      this.isprint=false;
    },
    prints(){
      this.isview=true;
      this.ismission=false;
      this.isprint=false;
    },
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.upResName = data.name
      this.saveForm.upResId = data.resId
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectUpResId.blur()
    },
    // 选择器配置可以清空选项，用户点击清空按钮时触发
    handleClear() {
      // 将选择器的值置空
      this.upResName = ''
      this.saveForm.upResId = ''
    }
  },
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    padding-left: 20px;
    margin: 10px 0;
  }
  .rowbutton{  
    margin: 20px 0 20px 20px;
  }
  .rowbuttons{
    margin: 20px 0;
    text-align: center;
  }
  .view{
    width: 1026px;
  }
  .view P{
    text-align: center;
    margin: 20PX 0;
  }
  .views{
    width: 100%;
    height: 300px;
    margin-left: 20px;
    border: 1px solid #cccccc;
  }
  .views div{
    display: inline-block;
  }
  .views div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 120px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .views div span:last-child{
    display: inline-block;
    width: 380px;
  }
  .footsection{
    width: 1000PX;
    border: black solid 1px;
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-left: 10PX;
  }
 .footsection div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 100px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .footsection div span:last-child{
    display: inline-block;
    width: 220px;
    text-align: center;
  }
  .mission{
    width: 1026px;;
  }
  .missions{
    width: 100%;
    height: 300px;
    margin-left: 20px;
    border: 1px solid #cccccc;
  }
  .mission p{
    text-align: center;
    margin: 20px 0;
  }
  .missions div{
    display: inline-block;
  }
  .missions>div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 120px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .el-input{
    width: 380px;
    display: inline-block;
  }
  .el-form{
    display: inline-block;
  }
  .print{
    width: 1026px;
  }
  .print P{
    text-align: center;
    margin: 20PX 0;
  }
  .rowbuttont{
    text-align: center;
    margin: 20PX 0;
  }
</style>