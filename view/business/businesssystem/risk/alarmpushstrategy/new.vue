<template>
  <div class="newmain">
    <div id="new">

      <!-- 导航 -->
      <div class="nav">
        <i class="el-icon-location"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
          <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
          <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
          <el-breadcrumb-item>新建</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 顶部按钮 -->
      <div class="newalarmpushstrategy">
        <el-row class="rowbuttons" v-if="isrowbuttons">
          <el-button @click="news">新建</el-button>
          <el-button @click="redact">编辑</el-button>
          <el-button @click="deleteInfo">删除</el-button>
          <el-button @click="print">打印</el-button>
        </el-row>
        <!-- <p>新建报警推送策略</p> -->


      <div id="contentinfo"> 
        <!-- 新建报警推送策略 -->
        <div v-if="isstrategy">
          <p>新建报警推送策略</p>
        <div class="strategy">
          <div>
              <span>报警推送策略名称*</span>
              <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
          <div>
              <span>推送对象*</span>
              <el-form>
                <el-select v-model="form.region" placeholder="RAD" style="width:380px">
                  <el-option label="RAD" value="RAD"></el-option>
                </el-select>
              </el-form>
          </div>
          <div>
              <span>业务事件类型*</span>
              <el-form>
                <el-select v-model="form.transaction" @change="points" placeholder="非工作时间进入营业网点" style="width:380px">
                  <el-option label="非工作时间进入营业网点" value="非工作时间进入营业网点"></el-option>
                  <el-option label="非工作时间进入加钞间" value="非工作时间进入加钞间"></el-option>
                  <el-option label="业务终端拍照行为" value="业务终端拍照行为"></el-option>
                </el-select>
              </el-form>
          </div>
          <div>
              <span>启用*</span>
              <el-form>
                <el-select v-model="form.enabled" placeholder="启用" style="width:380px">
                  <el-option label="启用" value="启用"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form>
          </div>
          <div>
              <span>时间模板*</span>
              <el-form>
                <el-select v-model="form.time" placeholder="非工作时间" style="width:380px">
                  <el-option label="非工作时间" value="非工作时间"></el-option>
                  <el-option label="工作时间" value="工作时间"></el-option>
                </el-select>
              </el-form>
          </div>
          <div>
              <span>资源模式*</span>
              <el-form>
                <el-select v-model="form.resource" @change="point" placeholder="资源点位" style="width:380px">
                  <el-option label="资源点位" value="资源点位"></el-option>
                  <el-option label="重点部位" value="重点部位"></el-option>
                </el-select>
              </el-form>
          </div>
          <div>
            <span>报警合并*</span>
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
          </div>
          <div>
            <span>合并间隔*</span>
            <el-input v-model="inputs" placeholder="20s"></el-input>
          </div>
        </div>
        </div>

        <!-- 报警推送策略 -->
        <div v-if="isalarmpushstrategy">
          <p>报警推送策略</p>
        <div class="alarmpushstrategy">
          <div>
            <span>报警推送策略名称</span>
            <span>XX分行非工作时间进入营业网点</span>
          </div>
          <div>
            <span>推送对象</span>
            <span>RAD</span>
          </div>
          <div>
            <span>业务事件类型</span>
            <span>非工作时间进入营业网点</span>
          </div>
          <div>
            <span>启用</span>
            <span>启用</span>
          </div>
          <div>
            <span>时间模板</span>
            <span>非工作时间</span>
          </div>
          <div>
            <span>资源模式</span>
            <span>按资源点位</span>
          </div>
          <div>
            <span>报警合并</span>
            <span>是</span>
          </div>
          <div>
            <span>合并间隔</span>
            <span>20s</span>
          </div>
        </div>
        </div>
      

      <!-- 报警源 -->
      <div class="cuttingline">
        <p>报警源</p>
        <div></div>
      </div>
      <div class="choice">

        <!-- 选择事件类型 -->
        <div class="choicleft">
          <p>选择事件类型</p>
          <div>
            <!-- <el-input v-model="search" placeholder="请输入内容"></el-input><i class="el-icon-search"></i> -->
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
          </div>
          <div class="data dataleft" v-if="isdata">
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              ref="tree"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="secdata dataleft" v-if="issecdata">
            <el-tree
            class="filter-tree"
              :data="secdata"
              show-checkbox
              node-key="id"
              ref="tree"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="thirdata dataleft" v-if="isthirdata">
            <el-tree
            class="filter-tree"
              :data="thirdata"
              show-checkbox
              node-key="id"
              ref="tree"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>

        <!-- 按资源选择报警源 -->
        <div class="choiceright" v-if="ischoiceright">
          <p>按资源选择报警源</p>
          <div>
            <!-- <el-input v-model="searchs" placeholder="请输入内容"></el-input><i class="el-icon-search"></i> -->
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText1">
            </el-input>
          </div>
          <div class="datas dataright" v-if="isdatas">
            <el-tree
              class="filter-tree"
              :data="datas"
              show-checkbox
              node-key="id"
              ref="tree1"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="datat dataright" v-if="isdatat">
            <el-tree
              class="filter-tree"
              :data="datat"
              show-checkbox
              node-key="id"
              ref="tree1"
              :filter-node-method="filterNode"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
          <div class="secdatas dataright" v-if="issecdatas">
            <el-tree
              class="filter-tree"
              :data="secdatas"
              show-checkbox
              node-key="id"
              ref="tree1"
              :default-expand-all="true"
              :default-expanded-keys="[2, 3]"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>

      <!-- 录入信息 -->
      <div class="footsection">
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
      </div>
    </div>
  </div>

      <!-- 底部按钮 -->
      <div class="buttonsection">
        <el-row class="rowbutton" v-if="isrowbutton">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="close">取消</el-button>
          <el-button @click="reset">重置</el-button>
        </el-row>
      </div>

      <!-- 底部按钮（打印） -->
      <div class="buttonsections" v-if="isbuttonsections">
        <el-row class="rowbutton">
          <el-button v-print="'#contentinfo'">打印</el-button>
          <el-button @click="close">关闭</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
 data() {
      return {
        filterText: '',
        filterText1: '',
        value: '',
        input:'',
        inputs:'20s',
        search:'',
        searchs:'',
        radio:'1',
        isstrategy:true,
        isalarmpushstrategy:false,
        isrowbuttons:false,
        isrowbutton:true,
        isdata:true,
        isdatas:true,
        isdatat:false,
        issecdata:false,
        issecdatas:false,
        isthirdata:false,
        ischoiceright:true,
        isbuttonsections:false,
        form:{
          region:'RAD',
          transaction:'非工作时间进入营业网点',
          enabled:'启用',
          time:'非工作时间',
          resource:'资源点位'
        },
        data: [{
          id: 1,
          label: '事件类型',
          children: [{
            id: 2,
            label: '报警子系统',
            children: [{
              id: 3,
              label: '报警主机',
              children:[{
                id: 4,
                label: '防区报警',
              },
              {
                id: 5,
                label: '红外探测器（入侵）',
              },
              {
                id: 6,
                label: '防拆',
              },
              {
                id: 7,
                label: '撤防',
              },
              {
                id: 8,
                label: '布放',
              }]
            }]
          },
          {
            id: 9,
            label: '门禁子系统',
            children: [{
              id: 10,
              label: '门禁点',
              children:[{
                id: 11,
                label: '开门超时'
              },
              {
                id: 12,
                label: '无效卡'
              },
              {
                id: 13,
                label: '开/关门事件'
              }]
            }]
          },
          {
            id: 14,
            label: '视频子系统',
            children: [{
              id: 15,
              label: '行为分析摄像机',
              children:[{
                id: 16,
                label:'人员倒地'
              },
              {
                id: 17,
                label:'人员徘徊'
              }]
            }]
          }]
        }],
        secdata: [{
          id: 18,
          label: '事件类型',
          children: [{
            id: 19,
            label: '报警子系统',
            children: [{
              id: 20,
              label: '报警主机',
              children:[{
                id: 21,
                label: '防区报警',
              },
              {
                id: 22,
                label: '红外探测器（入侵）',
              },
              {
                id: 23,
                label: '防拆',
              },
              {
                id: 24,
                label: '撤防',
              },
              {
                id: 25,
                label: '布放',
              }]
            }]
          },
          {
            id: 26,
            label: '门禁子系统',
            children: [{
              id: 27,
              label: '门禁点',
              children:[{
                id: 28,
                label: '开门超时'
              },
              {
                id: 29,
                label: '无效卡'
              },
              {
                id: 30,
                label: '开/关门事件'
              }]
            }]
          },
          {
            id: 31,
            label: '视频子系统',
            children: [{
              id: 32,
              label: '行为分析摄像机',
              children:[{
                id: 33,
                label:'人员倒地'
              },
              {
                id: 34,
                label:'人员徘徊'
              },
              {
                id: 35,
                label:'周界报警'
              }]
            }]
          }]
        }],
        datas: [{
          id: 36,
          label: '河北省分行',
          children: [{
            id: 37,
            label: 'xxx金库中心',
          },
          {
            id: 38,
            label: '保定分行',
            children: [{
              id: 39,
              label: 'xxx营业网点',
            },
            {
              id: 40,
              label: '融汇支行',
            },
            {
              id: 41,
              label: '五四西路支行',
            },
            {
              id: 42,
              label: '竞秀支行',
            },
            {
              id: 43,
              label: '五四中路支行',
            }]
          },
          {
            id: 44,
            label: '张家口分行',
            children: [{
              id: 45,
              label: '建国路支行',
            },
            {
              id: 46,
              label: '北环路支行',
              children: [{
                id: 47,
                label: 'xxx营业网点',
                children:[{
                  id: 48,
                  label: 'XXX报警主机',
                  children:[{
                    id: 49,
                    label: 'XXX防区'
                  },
                  {
                    id: 50,
                    label: 'XXX防区'
                  }]
                },
                {
                  id: 51,
                  label: 'XXX门禁平台'
                },
                {
                  id: 52,
                  label: 'XXX监控点',
                  children:[{
                    id: 53,
                    label: 'XXX门'
                  },
                  {
                    id: 54,
                    label: 'XXX门'
                  }]
                }]
              }],
            }]
          }]
        }],
        datat: [{
          id: 55,
          label: '河北省分行',
          children: [{
            id: 56,
            label: 'xxx金库中心',
          },
          {
            id: 57,
            label: '保定分行',
            children: [{
              id: 58,
              label: 'xxx营业网点',
            },
            {
              id: 59,
              label: '融汇支行',
            },
            {
              id: 60,
              label: '五四西路支行',
            },
            {
              id: 61,
              label: '竞秀支行',
            },
            {
              id: 62,
              label: '五四中路支行',
            }]
          },
          {
            id: 63,
            label: '张家口分行',
            children: [{
              id: 64,
              label: '建国路支行',
            },
            {
              id: 65,
              label: '北环路支行',
              children: [{
                id: 66,
                label: 'xxx营业网点',                
              },
              {
                id: 67,
                label: 'xxx营业网点',                
              }],
            }]
          }]
        }],
        secdatas: [{
          id: 68,
          label: '河北省分行',
          children: [{
            id: 69,
            label: 'xxx金库中心',
          },
          {
            id: 70,
            label: '保定分行',
            children: [{
              id: 71,
              label: 'xxx营业网点',
            },
            {
              id: 72,
              label: '融汇支行',
            },
            {
              id: 73,
              label: '五四西路支行',
            },
            {
              id: 74,
              label: '竞秀支行',
            },
            {
              id: 75,
              label: '五四中路支行',
            }]
          },
          {
            id: 76,
            label: '张家口分行',
            children: [{
              id: 77,
              label: '建国路支行',
            },
            {
              id: 78,
              label: '北环路支行',
              children: [{
                id: 79,
                label: 'xxx营业网点',
                children:[{
                  id: 80,
                  label: 'XXX报警主机',
                  children:[{
                    id: 81,
                    label: 'XXX防区',
                  },
                  {
                    id: 82,
                    label: 'XXX防区',
                  }]
                },
                {
                  id: 83,
                  label: 'XXX门禁平台',
                  children:[{
                    id: 84,
                    label: 'XXX互锁门'
                  },
                  {
                    id: 85,
                    label: 'XXX门'
                  }]
                },
                {
                  id: 86,
                  label: 'XXX监控点',
                },
                {
                  id: 87,
                  label: 'XXX自助银行',
                  children:[{
                    id: 88,
                    label:'XXX报警主机',
                    children:[{
                      id: 89,
                      label:'XXX防区'
                    },
                    {
                      id: 90,
                      label:'XXX防区'
                    }]
                  },
                  {
                    id:91,
                    label:'XXX门禁平台',
                    children:[{
                      id: 92,
                      label: 'XXX互锁门'
                    },
                    {
                      id: 93,
                      label: 'XXX门'
                    },
                    {
                      id: 94,
                      label: 'XXX门'
                    }]
                  },
                  {
                    id:95,
                    label:'XXX监控点'
                  }]
                }]
              }],
            }]
          }]
        }],
        thirdata: [{
          id: 96,
          label: '河北省分行',
          children: [{
            id: 97,
            label: 'xxx金库中心',
          },
          {
            id: 98,
            label: '保定分行',
            children: [{
              id: 99,
              label: 'xxx营业网点',
            },
            {
              id: 100,
              label: '融汇支行',
            },
            {
              id: 101,
              label: '五四西路支行',
            },
            {
              id: 102,
              label: '竞秀支行',
            },
            {
              id: 103,
              label: '五四中路支行',
            }]
          },
          {
            id: 104,
            label: '张家口分行',
            children: [{
              id: 105,
              label: 'xxx监控中心',
              children:[{
                id: 106,
                label: 'XXX摄像机'
              },
              {
                id: 107,
                label: 'XXX摄像机'
              }]
            },
            {
              id: 108,
              label: '建国路支行',
            },
            {
              id: 109,
              label: '北环路支行',
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      filterText1(val) {
        this.$refs.tree1.filter(val);
      },
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      point(value){
          if(value=='资源点位'){
            this.isdata=true;
            this.isdatas=true;
            this.isdatat=false;
            this.issecdata=false;
            this.issecdatas=false;
            this.isthirdata=false;
            this.ischoiceright=true;
            this.isbuttonsections=false;
          }
          if(value=='重点部位'){
            this.isdata=true;
            this.isdatas=false;
            this.isdatat=true;
            this.issecdata=false;
            this.issecdatas=false;
            this.isthirdata=false;
            this.ischoiceright=true;
            this.isbuttonsections=false;
          }
      },
      points(value){
        if(value=='非工作时间进入营业网点'){
          this.isdata=true;
          this.isdatas=true;
          this.isdatat=false;
          this.issecdata=false;
          this.issecdatas=false;
          this.isthirdata=false;
          this.ischoiceright=true;
          this.isbuttonsections=false;
        }
        if(value=='非工作时间进入加钞间'){
          this.isdata=false;
          this.isdatas=false;
          this.isdatat=false;
          this.issecdata=true;
          this.issecdatas=true;
          this.isthirdata=false;
          this.ischoiceright=true;
          this.isbuttonsections=false;
        }
        if(value=='业务终端拍照行为'){
          this.isdata=false;
          this.isdatas=false;
          this.isdatat=false;
          this.issecdata=false;
          this.issecdatas=false;
          this.isthirdata=true;
          this.ischoiceright=false;
          this.isbuttonsections=false;
        }
      },
      reset(){
        this.radio='1';
        this.input="";
        this.form.region="RAD";
        this.form.transaction="非工作时间进入营业网点";
        this.form.enabled="启用";
        this.form.time="非工作时间";
        this.form.resource="资源点位";
        this.inputs="20s";
        this.search="";
        this.searchs="";
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree1.setCheckedKeys([]);
      },
      news(){
        this.isstrategy=true;
        this.isalarmpushstrategy=false;
        this.isrowbuttons=false;
        this.isrowbutton=true;
        this.isbuttonsections=false;
      },
      redact(){
        this.isstrategy=true;
        this.isalarmpushstrategy=false;
        this.isrowbuttons=false;
        this.isrowbutton=true;
        this.isbuttonsections=false;
      },
      close(){
        this.isstrategy=false;
        this.isalarmpushstrategy=true;
        this.isrowbuttons=true;
        this.isrowbutton=false;
        this.isbuttonsections=false;
      },
      save(){
        this.isstrategy=false;
        this.isalarmpushstrategy=true;
        this.isrowbuttons=true;
        this.isrowbutton=false;
        this.isbuttonsections=false;
      },
      print(){
        this.isstrategy=false;
        this.isalarmpushstrategy=true;
        this.isrowbuttons=false;
        this.isrowbutton=false;
        this.isbuttonsections=true;
      },
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
      }
    },
}
</script>

<style scoped lang="less">
  .nav{
    // width: 500px;
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
  // .newmain{
  //   text-align: center;
  // }
  #new{
    width: 1027px;
  }
  .newalarmpushstrategy p{
    text-align: center;
    margin: 30px 0;
  }
  .strategy{
    width: 100%;
    height: 180px;
    margin-left: 20px;
    border: 1px solid #cccccc;
  }
  .strategy div{
    display: inline-block;
  }
  .strategy div span:first-child{
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
  .el-radio{
    width: 173px;
  }
  .cuttingline{
    margin:20px 20px;
    overflow: hidden;
  }
  .cuttingline p{
    float: left;
    margin: 0 20px;
 }
 .cuttingline div{
   width: 900px;
   height: 1px;
   border: .5px solid #cccccc;
   float: left;
   margin-top: 8px;
 }
 .choicleft{
   position: relative;
 }
.choicleft .el-icon-search{
  position: absolute;
  top: 40px;
  left: 420px;
}
.choiceright{
   position: relative;
   width: 50%;
   text-align: center;
   float: left;
 }
 .choiceright p{
   margin-bottom: 10px;
 }
 .choiceright .el-icon-search{
   position: absolute;
   top: 40px;
   left: 420px;
 }
 .choice{
   margin-left: 20px;
   margin-top: 30px;
   height: 900px;
 }
 .choicleft{
   width: 50%;
   text-align: center;
   float: left;
   
 }
 .choicleft p{
   margin-bottom: 10px;
 }
 .el-tree{
   margin-left: 50px
 }
 .footsection{
    width: 100%;
    border: black solid 1px;
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
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
  .buttonsection{
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .alarmpushstrategy{
    width: 100%;
    height: 180px;
    margin-left: 20px;
    border: 1px solid #cccccc;
  }
  .alarmpushstrategy div{
    display: inline-block;
  }
  .alarmpushstrategy div span:first-child{
    margin-top: 1px;
    padding: 5px 0;
    width: 120px;
    text-align: center;
    background: #cccccc;
    line-height: 28px;
    display: inline-block;
  }
  .alarmpushstrategy div span:last-child{
    display: inline-block;
    width: 380px;
  }
  .rowbuttons{
    margin-left: 20px;
  }
  .buttonsections{
    text-align: center;
  }
  @media print {
    #contentinfo {
      margin-right: 550px;
      div>p{
        text-align: center;
        margin: 20px 0;
      }
      .dataleft{
        margin-left: 80px;
      }
      .dataright{
        margin-left: 80px;
      }
      .cuttingline{
        margin:20px 20px;
        overflow: hidden;
      }
      .cuttingline p{
        float: left;
        margin: 0 20px;
      }
      .cuttingline div{
        width: 900px;
        height: 1px;
        border: .5px solid #cccccc;
        float: left;
        margin-top: 8px;
      }
    }
  }
</style>