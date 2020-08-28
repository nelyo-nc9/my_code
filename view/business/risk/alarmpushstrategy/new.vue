<template>
  <div id="new">

    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>业务系统联动 </el-breadcrumb-item>
      <el-breadcrumb-item>风险RAD系统对接</el-breadcrumb-item>
      <el-breadcrumb-item>报警推送策略配置</el-breadcrumb-item>
      <el-breadcrumb-item>新建</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部按钮 -->
    <div class="newalarmpushstrategy">
      <el-row class="rowbuttons" v-if="isrowbuttons">
        <el-button @click="news">新建</el-button>
        <el-button @click="redact">编辑</el-button>
        <el-button>删除</el-button>
        <el-button @click="print">打印</el-button>
      </el-row>
      <p>新建报警推送策略</p>

      <!-- 新建报警推送策略（选择）-->
      <div class="strategy" v-if="isstrategy">
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

      <!-- 报警推送策略名称（确定） -->
      <div class="alarmpushstrategy" v-if="isalarmpushstrategy">
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
          <span>非工作时间</span>
          <span>按资源点位</span>
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
        <div><el-input v-model="search" placeholder="请输入内容"></el-input><i class="el-icon-search"></i></div>
        <div class="data" v-if="isdata">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="secdata" v-if="issecdata">
          <el-tree
            :data="secdata"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="thirdata" v-if="isthirdata">
          <el-tree
            :data="thirdata"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
      </div>

      <!-- 按资源选择报警源 -->
      <div class="choiceright" v-if="ischoiceright">
        <p>按资源选择报警源</p>
        <div><el-input v-model="searchs" placeholder="请输入内容"></el-input><i class="el-icon-search"></i></div>
        <div class="datas" v-if="isdatas">
          <el-tree
            :data="datas"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="datat" v-if="isdatat">
          <el-tree
            :data="datat"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="secdatas" v-if="issecdatas">
          <el-tree
            :data="secdatas"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
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

    <!-- 底部按钮 -->
    <div class="buttonsection">
      <el-row class="rowbutton" v-if="isrowbutton">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="print">打印</el-button>
        <el-button @click="close">关闭</el-button>
      </el-row>
    </div>

    <!-- 底部按钮（打印） -->
    <div class="buttonsections" v-if="isbuttonsections">
      <el-row class="rowbutton">
        <el-button @click="print">打印</el-button>
        <el-button @click="close">关闭</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
 data() {
      return {
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
              id: 5,
              label: '报警主机',
              children:[{
                id: 6,
                label: '防区报警',
              },
              {
                id: 7,
                label: '红外探测器（入侵）',
              },
              {
                id: 8,
                label: '防拆',
              },
              {
                id: 9,
                label: '撤防',
              },
              {
                id: 10,
                label: '布放',
              }]
            }]
          },
          {
            id: 3,
            label: '门禁子系统',
            children: [{
              id: 6,
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
            id: 4,
            label: '视频子系统',
            children: [{
              id: 7,
              label: '行为分析摄像机',
              children:[{
                id: 14,
                label:'人员倒地'
              },
              {
                id: 15,
                label:'人员徘徊'
              }]
            }]
          }]
        }],
        secdata: [{
          id: 1,
          label: '事件类型',
          children: [{
            id: 2,
            label: '报警子系统',
            children: [{
              id: 5,
              label: '报警主机',
              children:[{
                id: 6,
                label: '防区报警',
              },
              {
                id: 7,
                label: '红外探测器（入侵）',
              },
              {
                id: 8,
                label: '防拆',
              },
              {
                id: 9,
                label: '撤防',
              },
              {
                id: 10,
                label: '布放',
              }]
            }]
          },
          {
            id: 3,
            label: '门禁子系统',
            children: [{
              id: 6,
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
            id: 4,
            label: '视频子系统',
            children: [{
              id: 7,
              label: '行为分析摄像机',
              children:[{
                id: 14,
                label:'人员倒地'
              },
              {
                id: 15,
                label:'人员徘徊'
              },
              {
                id: 16,
                label:'周界报警'
              }]
            }]
          }]
        }],
        datas: [{
          id: 1,
          label: '河北省分行',
          children: [{
            id: 2,
            label: 'xxx金库中心',
          },
          {
            id: 3,
            label: '保定分行',
            children: [{
              id: 6,
              label: 'xxx营业网点',
            },
            {
              id: 7,
              label: '融汇支行',
            },
            {
              id: 8,
              label: '五四西路支行',
            },
            {
              id: 9,
              label: '竞秀支行',
            },
            {
              id: 10,
              label: '五四中路支行',
            }]
          },
          {
            id: 4,
            label: '张家口分行',
            children: [{
              id: 11,
              label: '建国路支行',
            },
            {
              id: 12,
              label: '北环路支行',
              children: [{
                id: 13,
                label: 'xxx营业网点',
                children:[{
                  id: 14,
                  label: 'XXX报警主机',
                  children:[{
                    id: 17,
                    label: 'XXX防区'
                  },
                  {
                    id: 18,
                    label: 'XXX防区'
                  }]
                },
                {
                  id: 15,
                  label: 'XXX门禁平台'
                },
                {
                  id: 16,
                  label: 'XXX监控点',
                  children:[{
                    id: 19,
                    label: 'XXX门'
                  },
                  {
                    id: 20,
                    label: 'XXX门'
                  }]
                }]
              }],
            }]
          }]
        }],
        datat: [{
          id: 1,
          label: '河北省分行',
          children: [{
            id: 2,
            label: 'xxx金库中心',
          },
          {
            id: 3,
            label: '保定分行',
            children: [{
              id: 6,
              label: 'xxx营业网点',
            },
            {
              id: 7,
              label: '融汇支行',
            },
            {
              id: 8,
              label: '五四西路支行',
            },
            {
              id: 9,
              label: '竞秀支行',
            },
            {
              id: 10,
              label: '五四中路支行',
            }]
          },
          {
            id: 4,
            label: '张家口分行',
            children: [{
              id: 11,
              label: '建国路支行',
            },
            {
              id: 12,
              label: '北环路支行',
              children: [{
                id: 13,
                label: 'xxx营业网点',                
              },
              {
                id: 14,
                label: 'xxx营业网点',                
              }],
            }]
          }]
        }],
        secdatas: [{
          id: 1,
          label: '河北省分行',
          children: [{
            id: 2,
            label: 'xxx金库中心',
          },
          {
            id: 3,
            label: '保定分行',
            children: [{
              id: 6,
              label: 'xxx营业网点',
            },
            {
              id: 7,
              label: '融汇支行',
            },
            {
              id: 8,
              label: '五四西路支行',
            },
            {
              id: 9,
              label: '竞秀支行',
            },
            {
              id: 10,
              label: '五四中路支行',
            }]
          },
          {
            id: 4,
            label: '张家口分行',
            children: [{
              id: 11,
              label: '建国路支行',
            },
            {
              id: 12,
              label: '北环路支行',
              children: [{
                id: 13,
                label: 'xxx营业网点',
                children:[{
                  id: 14,
                  label: 'XXX报警主机',
                  children:[{
                    id: 17,
                    label: 'XXX防区',
                  },
                  {
                    id: 18,
                    label: 'XXX防区',
                  }]
                },
                {
                  id: 15,
                  label: 'XXX门禁平台',
                  children:[{
                    id: 19,
                    label: 'XXX互锁门'
                  },
                  {
                    id: 20,
                    label: 'XXX门'
                  }]
                },
                {
                  id: 16,
                  label: 'XXX监控点',
                },
                {
                  id: 21,
                  label: 'XXX自助银行',
                  children:[{
                    id: 22,
                    label:'XXX报警主机',
                    children:[{
                      id: 25,
                      label:'XXX防区'
                    },
                    {
                      id: 26,
                      label:'XXX防区'
                    }]
                  },
                  {
                    id:23,
                    label:'XXX门禁平台',
                    children:[{
                      id: 27,
                      label: 'XXX互锁门'
                    },
                    {
                      id: 28,
                      label: 'XXX门'
                    },
                    {
                      id: 29,
                      label: 'XXX门'
                    }]
                  },
                  {
                    id:24,
                    label:'XXX监控点'
                  }]
                }]
              }],
            }]
          }]
        }],
        thirdata: [{
          id: 1,
          label: '河北省分行',
          children: [{
            id: 2,
            label: 'xxx金库中心',
          },
          {
            id: 3,
            label: '保定分行',
            children: [{
              id: 6,
              label: 'xxx营业网点',
            },
            {
              id: 7,
              label: '融汇支行',
            },
            {
              id: 8,
              label: '五四西路支行',
            },
            {
              id: 9,
              label: '竞秀支行',
            },
            {
              id: 10,
              label: '五四中路支行',
            }]
          },
          {
            id: 4,
            label: '张家口分行',
            children: [{
              id: 13,
              label: 'xxx监控中心',
              children:[{
                id: 14,
                label: 'XXX摄像机'
              },
              {
                id: 15,
                label: 'XXX摄像机'
              }]
            },
            {
              id: 11,
              label: '建国路支行',
            },
            {
              id: 12,
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
    methods: {
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
      }
    },
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    padding-left: 40px;
    margin: 10px 0;
  }
  #new{
    width: 1027px;
  }
  .newalarmpushstrategy>p{
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
</style>