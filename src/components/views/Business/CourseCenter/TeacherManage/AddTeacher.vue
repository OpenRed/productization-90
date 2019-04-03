<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="Back"></i>{{title}}</div>
  </div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" label-width="100px" style="height:calc(100% - 80px);overflow-y: auto;" id="form" method="post">
    <el-form-item label="讲师姓名">
      <el-input v-model="form.name" id="name" style="width: 25%;"></el-input>
    </el-form-item>
    <!-- <el-form-item label="手机号">
      <el-input v-model="form.mobile" style="width: 25%;" :disabled="this.title==='编辑讲师'"></el-input>
    </el-form-item> -->
    <el-form-item label="讲师头像">
      <div class="show" style="width:150px;height:150px;float: left;">
        <img class="picture" :src="form.cover" :onerror="errorImg" width="100%" height="100%" />
      </div>
      <div class="choose upload" style="float:left;margin-left:10px;">
        <label title="选择图片" class="choose-btn">
          <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" style="display:none" @change="choosefile">
          <span class="choose-file">选择图片</span>
        </label>
      </div>
    </el-form-item>
    <el-form-item label="讲师简介" style="width: 485px;">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.desc">
      </el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="Submit">提交</el-button>
    </el-form-item>
  </el-form>

  <uppicture :aspectRatio="aspectRatio" :file="uploadfile" :position="position" @upload="upload" v-if="showBox"></uppicture>
</div>
</template>

<script>
import {
  addlecturer,
  uploadImg,
  updLecturerInfo,
  getOneUserInfo
} from '@/api/api';
import uppicture from '@/components/public/picture'

export default {
  components: {
    uppicture
  },
  data() {
    return {
      files: '',
      form: {
        name: '',
        mobile: '',
        desc: '',
        cover: window.localStorage.getItem('saasdata') ? JSON.parse(window.localStorage.getItem('saasdata')).cover : ''
      },
      title: window.localStorage.saastitle ? window.localStorage.saastitle : '',
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      uploadfile: '',
      position: '',
      showBox: false,
      aspectRatio: 1
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    if (window.localStorage.saastitle === '编辑讲师') {
      if(window.localStorage.saasdata){
        var Lecturer = JSON.parse(window.localStorage.getItem('saasdata'));
        // console.log(Lecturer);
        this.form.name = Lecturer.name ? Lecturer.name : '';
        this.form.mobile = Lecturer.mobile ? Lecturer.mobile : '';
        this.form.desc = Lecturer.desc ? Lecturer.desc : '';
        this.form.cover = Lecturer.cover ? Lecturer.cover : '';
      } else{
        this.$router.push('/TeacherList')
      }
    } else {
      window.localStorage.saastitle = '添加讲师';
      window.localStorage.removeItem('saasdata');
    }
    setTimeout(function () {
      document.querySelector('#name input').focus();
    }, 20)
  },
  methods: {
    openSuccess(text) {
      this.$message({
        message: text,
        type: 'success'
      });
    },
    openError(text) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error'
      });
    },
    Back() {
      this.$router.push('/TeacherList');
    },
    choosefile(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      this.aspectRatio = 1;
      this.position = 'teachercover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    upload(data) {
      if (data.position === 'teachercover') this.form.cover = data.url;
      this.showBox = false;
    },
    Submit() {
      if (this.form.name === '') return this.openError('讲师姓名不能为空！')
      // if (this.form.mobile === '') return this.openError('手机号不能为空！')
      // if (!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.form.mobile)) && this.form.mobile !== '') {
      //   return this.openError('请输入正确的手机号！');
      // }
      if (this.form.cover === '') return this.openError('讲师头像不能为空！')

      if(window.localStorage.saastitle === '添加讲师'){
        addlecturer({
          // mobile: this.form.mobile,
          cover: this.form.cover,
          name: this.form.name,
          desc: this.form.desc
        }).then(data => {
          // console.log(data);
          if (data.success) {
            this.files = '';
            this.$router.push('/TeacherList');
          } else {
            this.openError(data.resMsg)
          }
        })
      } else if (window.localStorage.saastitle === '编辑讲师'){
        var Lecturer = JSON.parse(window.localStorage.getItem('saasdata'));
        updLecturerInfo({
          id: Lecturer.id,
          desc: this.form.desc,
          name: this.form.name,
          mobile: this.form.mobile,
          cover: this.form.cover
        }).then(data => {
          if (data.success) {
            this.$router.push('/TeacherList');
            this.openSuccess('信息修改成功');
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    }
  }
}
</script>
