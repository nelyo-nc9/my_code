<!--
 * @Author: tuozhaoping
 * @Date: 2020-06-28 10:06:07
 * @LastEditTime: 2020-06-28 11:18:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\systemOperationManage\dataDictionary\pages\DataDictionaryCreat.vue
-->
<template>
  <div class="data-dictionary-creat-box">
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <div class="top-main">
          <!-- 机构信息 -->
          <div class="main-box">
            <div class="box-title">新建厂家</div>
            <div class="p-creat-from">
              <el-row>
                <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">名字</div>
                  </el-col>
                  <el-col :span=17>
                    <el-input  v-model="form.serverName"></el-input>
                  </el-col>
                </el-col>
                <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">显示名</div>
                  </el-col>
                  <el-col :span=17>
                    <el-input  v-model="form.displayName"></el-input>
                  </el-col>
                </el-col>
              </el-row>
              <el-row style="margin-top:1px;">
                <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">类别</div>
                  </el-col>
                  <el-col :span=17>
                    <el-input  v-model="form.type"></el-input>
                  </el-col>
                </el-col>
                <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">排列序号</div>
                  </el-col>
                  <el-col :span=17>
                    <el-input  v-model="form.sequenceNumber"></el-input>
                  </el-col>
                </el-col>
              </el-row>
              <el-row style="margin-top:1px;">
                <el-col :span=12>
                  <el-col :span=6>
                    <div class="item">状态</div>
                  </el-col>
                  <el-col :span=17>
                    <el-input  v-model="form.status"></el-input>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div class="p-creat-from" style="margin-top:15px;">
              <el-row>
                <el-col :span=3>
                  <div class="item">
                    录入时间
                  </div>
                </el-col>
                <el-col :span=5>
                  <div class="details">2020-02-20  15:00:00</div>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入机构
                  </div>
                </el-col>
                <el-col :span=5>
                  <div class="details">河北省分行/保定分行</div>
                </el-col>
                <el-col :span=3>
                  <div class="item">
                    录入人
                  </div>
                </el-col>
                <el-col :span=5>
                  <div class="details">张三</div>
                </el-col>
              </el-row>
            </div>
            <div class="p-creat-footer">
              <el-button type="primary" @click="onSubmit" size="small">保存</el-button>
              <el-button @click="reset" size="small">重置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  defaultMenu: {
    type: Boolean
  },
  name: 'DataDictionaryCreat',
  data() {
    return {
      form: {
        name: '',
        type: '',
        sequenceNumber: '',
        status: '',
        displayName: ''
      },
      obj: {}
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 查询预置
    onSubmit() {
      console.log('子组件触发了')
      this.$emit('changeMenu', false)
    },
    // 重置
    reset() {
      this.form = { ...this.obj }
    }
  }
}
</script>

<style lang="less" scoped>
.data-dictionary-creat-box {
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
          .box-title {
            width: 70%;
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
          }
          .p-creat-from {
            border: 1px solid #ddd;
            padding: 10px;
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
          .p-creat-footer {
            width: 70%;
            padding-top: 20px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
