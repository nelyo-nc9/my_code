<template>
  <div class="content">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>外委公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>外委公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="titleCon">
      <el-form ref="form" :model="form" label-width="100px" size="small">
        <el-row class="people">
          <el-col :span="8" class="people">
            <el-form-item label="外委公司名称">
              <span class="peopleClass">{{form.name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公司业务">
              <el-select :disabled="isStatu" v-model="form.region" placeholder="请选择公司业务" style="width:300px">
                <el-option label="安防" value="安防"></el-option>
                <el-option label="消防" value="消防"></el-option>
                <el-option label="安防+消防" value="安消"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="公司地址">
              <el-input :disabled="isStatu" v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="维保公司法人">
              <el-input :disabled="isStatu" v-model="form.faren"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业资质">
              <el-input :disabled="isStatu" v-model="form.zizhi"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公司电话">
              <el-input :disabled="isStatu" v-model="form.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司邮箱">
              <el-input :disabled="isStatu" v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公司人数">
              <el-input :disabled="isStatu" v-model="form.number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row v-for="(item, index) in form.contract" :key="index + 'list'">
          <el-col :span="7">
            <el-form-item label="合同">
              <!-- <span class="upload">{{item.name=='' ? '请上传' : fileList[index].name}}</span> -->
              <!-- <el-input style="width:85px"></el-input> -->
              <el-upload style="display:inline" class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :before-remove="beforeRemove" multiple :limit="999" :on-exceed="handleExceed" :file-list="fileList">
                <el-button size="mini">浏览</el-button>
                <!-- :show-file-list="false" -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="合同起止日期">
              <el-date-picker :disabled="isStatu" style="width:400px" v-model="item.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务范围">
              <el-input :disabled="isStatu" v-model="item.business"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" v-if="index !==0">
            <i class="el-icon-close" @click="deleteCon(index,form.contract)"></i>
          </el-col>
        </el-row>

        <el-row style="margin-left:100px">
          <el-col :span="8">
            <el-button size="small" @click="addContract(form.contract)">新增合同</el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>

        <el-row class="people" v-for="(item,index) in form.people" :key="index">
          <el-col :span="4">
            <el-form-item label="员工姓名">
              <span class="peopleClass">{{item.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="性别">
              <span class="peopleClass">{{item.sex}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式">
              <span class="peopleClass">{{item.phone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" class="other">
            <el-form-item label="备注">
              <el-input :disabled=isStatu v-model="item.other"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="margin:40px 0 0 425px">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  props:['isStatu'],
  data() {
    return {
      fileList: [],
      form: {
        name: '666',
        region: '安防',
        type: [],
        address: '一个地址',
        faren: '张三',
        zizhi: '有',
        phone: '110119120',
        email: '5165654@fgwr.com',
        number: '50',
        contract: [
          {
            time: '',
            business: '啥都做',
            name: ''
          }
        ],
        people: [
          {
            name: '张三',
            sex: '女',
            phone: '110120119',
            other: '666'
          },
          {
            name: '张三',
            sex: '女',
            phone: '110120119',
            other: '666'
          },
          {
            name: '张三',
            sex: '女',
            phone: '110120119',
            other: '666'
          }
        ],
      }
    }
  },
  methods: {
    addContract(list) {
      list.push({
        sTime: '2020',
        eTime: '2021',
        business: '还是啥都做',
        name: '',
      })
    },
    deleteCon(index, list) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

    },
    //上传前钩子函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'doc' || 'docx';
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isJPG) {
        this.$message.error('上传文档只能是 doc或者docx 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 50MB!');
      }
      return isJPG && isLt2M;
    },
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    onSubmit() {
      this.$parent.handleView()
      console.log('submit!');
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  .titleCon {
    width: 1200px;
    margin-left: 80px;
    margin-top: 40px;
  }
}

.el-form-item {
  margin-bottom: 5px;
}
.el-icon-close {
  font-size: 25px;
  line-height: 35px;
}
.people {
  /deep/.el-form-item__content {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: rgb(234, 239, 245);
    .peopleClass {
      margin-left: 14px;
      font-size: 14px;
      color: #333;
    }
  }
}
.other {
  /deep/.el-form-item__content {
    border: 0px !important;
  }
}
.upload {
  display: inline-block;
  width: 85px !important;
  border: 1px solid #ccc;
  // border-radius: 5px;
  text-align: center;
}
/deep/.el-form-item__content {
  position: relative;
  height: 35px;
  margin: 0;
  .el-upload {
    position: absolute;
    left: 180px;
    .el-button {
      height: 26px;
      padding: 0;
    }
  }
  .el-upload-list {
    position: absolute;
    top: 4px;
    left: 0;
    height: 26px;
    width: 180px;
    // line-height: 35px;
    display: inline-block;
    border: 1px solid #ccc;
    background-color: rgb(234, 239, 245);
    // border-radius: 5px;
    .el-upload-list__item {
      margin-top: 0;
    }
  }
}
</style>