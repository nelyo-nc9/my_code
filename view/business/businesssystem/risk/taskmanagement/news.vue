<template>
  <div>
    <!-- 导航 -->
    <div class="nav">
      <i class="el-icon-location"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
        <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
        <el-breadcrumb-item>AI任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建</el-breadcrumb-item>
      </el-breadcrumb>
    </div>  

    <!-- 查看部分 -->
    <div class="view" v-if="isview">
      <!-- 顶部按钮 -->
      <div>
        <el-row class="rowbutton">
          <el-button @click="news">新建</el-button>
          <el-button @click="redact">编辑</el-button>
          <el-button @click="deleteInfo">删除</el-button>
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
            <div class="footsection">
              <div>
                <span>录入时间</span>
                <span>{{foot.time}}</span>
              </div>
              <div>
                <span>录入机构</span>
                <span>{{foot.institution}}</span>
              </div>
              <div>
                <span>录入人</span>
                <span>{{foot.name}}</span>
              </div>
            </div>
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
              v-model="form.upResId"
              placeholder=""
              ref="selectUpResId"
              style="width:380px"
            >
              <el-option hidden key="upResId" :value="form.upResId" :label="upResName">
              </el-option> 
                <!-- <el-tree
                  node-key="id"
                  :data="data"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :check-on-click-node="true"
                  :default-expanded-keys="[1, 3]"
                  @node-click="handleNodeClick"
                >
                </el-tree> -->
                <treeBox :lazyTreeApi="getTreeApi"
                :data=this.selectRes
                :props="defaultProps"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle></treeBox>
            </el-select>
          </div>
        </div>
        <div>
          <span>所属重点部位*</span>
          <el-input v-model="input" :value="form.inputId" :label="input" placeholder="" disabled></el-input>
        </div>
        <div>
          <span>所属机构*</span>
          <el-input v-model="inputs" :value="form.inputsId" :label="inputs" placeholder="" disabled></el-input>
        </div>
        <div>
          <span>所属设备*</span>
          <el-input v-model="inputt" :value="form.inputtId" :label="inputt" placeholder="" disabled></el-input>
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
          <el-button @click="reset">重置</el-button>
          <el-button @click="close">关闭</el-button>
        </el-row>
      </div>
    </div>

    <!-- 打印表单 -->
    <div class="print" v-if="isprint">
      <div id="contentinfo">
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
          <el-button v-print="'#contentinfo'">打印</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeApi } from '@src/http/parkingManage/parkingRecord.api.js'
import treeBox from '@src/components/tree/treeBox'
export default {
  components:{
    treeBox
  },
  data(){
    return{
      input:'',
      inputs:'',
      inputt:'',
      inputf:'10s',
      upResName:'',
      isview:false,
      ismission:true,
      isprint:false,
      treeType:1,
      foot:{
        time:'2020-02-20  15:00:00',
        institution:'xxxxxxxx机构名称',
        name:'张三'
      },
      form:{
        input:'',
        inputs:'',
        inputt:'',
        analyze:'业务终端拍照',
        device:'总行智能分析云平台',
        enabled:'启用',
        time: '24小时',
        upResId:'' 
      },
      selectRes:[],
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
    // handleNodeClick(data) {
    //   // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
    //   this.upResName = 123
    //   this.saveForm.upResId = data.resId
    //   // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
    //   this.$refs.selectUpResId.blur()
    // },
      // 选择器配置可以清空选项，用户点击清空按钮时触发
    // handleClear() {
    //   // 将选择器的值置空
    //   this.upResName = ''
    //   this.form.upResId = ''
    // },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      console.log(data,data.name,data.id)
      this.$refs.selectUpResId.blur()
      this.upResName=data.name
      this.form.upResId = data.id
      this.input = data.name
      this.form.inputId=data.keyPartId
      // if (data.tierType === 'res') {
      //   this.selectRes = data
        
      // }
    },
    //删除
    deleteInfo(){
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //重置
    reset(){
      this.input = ''
      this.inputs = ''
      this.inputt = ''
      this.inputf = '10s'
      this.upResName = ''
      this.form.upResId = ''
      this.form.analyze = '业务终端拍照'
      this.form.device = '总行智能分析云平台'
      this.form.enabled = '启用'
      this.form.time = '24小时'
    }
  },
}
</script>

<style scoped lang="less">
  .nav{
    width: 500px;
    padding-left: 20px;
    margin: 10px 0;
    i{
      float: left;
      margin-right: 5px;
    }
    el-breadcrumb{
      float: left;
    }
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
  @media print {
  #contentinfo {
    width: 1026px;
    p{
      text-align: center;
      margin: 20px 0;
    }
  }
  }
</style>