
<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GoCourseSort"></i>编辑分类</div>
  </div>
  <div class="TopLine"></div>
  <br />
  <br />
  <br />
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="分类名称">
      <el-input v-model="form.name" style="width: 400px;"></el-input>
    </el-form-item>
    <el-form-item label="分类描述" style="width: 550px;">
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc"></el-input>
    </el-form-item>
    <!-- <el-form-item label="分类下的ThemeName" style="height:40px;">
      <el-input style="width:295px;height:28px;" :disabled="true" v-model="this.form.coursename"></el-input>
      <el-button style="width:100px;height:35px;" @click="ChoeseL">添加{{ThemeName}}</el-button>
    </el-form-item> -->
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="Onaddcategory">提交</el-button>
    </el-form-item>
  </el-form>

  <el-dialog :visible.sync="dialogVisible2" size="small" :title="ThemeName+'选择'">
    <div style="width:100%;height:300px;border:1px solid #cdcdcd">
      <div class="TopButton2 W95">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" @keydown="show($event)" v-on:input="getcourses" /><label class="el-icon-search TopButtonRightSearch" @click="getsearchTxt"></label>
          <template>
            <label><input name="Fruits" type="radio" value="1" checked @click="getcc(1)" />已有分类{{ThemeName}}</label>
            <label><input name="Fruits" type="radio" value="" @click="getcc(0)" />未分类{{ThemeName}}</label>
          </template>
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 70px);margin-top:10px;margin-left:2%">
        <el-table :data="dataL" height="250" border style="width: 100%">
          <el-table-column prop="name" :label="ThemeName+'名称'">
          </el-table-column>
          <el-table-column label="操作" width="200" v-if="hackReset">
            <template slot-scope="scope">
              <input type="checkbox" :checked="scope.row.checked" @click="CheckCourse(scope.row)"></input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-pagination style="margin-right:20px;float:right;float:left" :page-size="page.pgLimit" layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :total="page.pgTotalCount">
      </el-pagination>
      <el-button @click="dialogVisible2 = false">取 消</el-button>
      <el-button type="primary" @click="choeseTrueL">提 交</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getcategory,
  getcourseCategory,
  addcategory,
  getOnecategory,
  getOnecourse,
  changecategory,
  updcourse
} from '@/api/api';
export default {
  data() {
    return {
      searchTxt: '',
      page: '',
      form: {
        cateid: '',
        name: '',
        desc: '',
        courseid: '',
        coursename: ''
      },
      radio: '1',
      dialogVisible: false,
      dialogVisible2: false,
      Lid: '',
      Lname: '',
      LidBlock: '',
      LnameBlock: '',
      LidGet: '',
      data: [],
      dataL: [],
      qwe: 0,
      hackReset: false,
      sort: window.localStorage.saasdata ? JSON.parse(window.localStorage.saasdata) : {},
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  beforeDestory() {
    window.localStorage.remove(saasdata);
  },
  mounted() {
    if (this.sort.id) this.form.cateid = this.sort.id;
    if (this.sort.name) this.form.name = this.sort.name;
    if (this.sort.desc) this.form.desc = this.sort.desc;
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
    hack() {
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    GoCourseSort() {
      this.$router.push('/CourseSortList');
    },
    ChoeseL() {
      this.dialogVisible2 = true;
      if (this.dataL.length === 0) {
        this.TofID = '';
        var loginParams = {
          name: '',
          pgPageNum: 1,
          category: this.TofID
        };
        getcourseCategory(loginParams).then(data => {
          // console.log(data);
          this.page = data;
          this.dataL = data.resList;
          this.hack();
        });
      }
    },
    getcc(id) {
      if (id === 0) {
        this.TofID = 0;
        var loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          category: this.TofID
        };
        getcourseCategory(loginParams).then(data => {
          // console.log(data);
          this.page = data;
          this.dataL = data.resList;
        });
      } else {
        this.TofID = '';
        var loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          category: this.TofID
        };
        getcourseCategory(loginParams).then(data => {
          // console.log(data);
          this.page = data;
          this.dataL = data.resList;
        });
      }
    },
    CheckCourse(course){
      this.form.courseid = course.id;
      this.form.coursename = course.name;
      this.dataL.forEach(item=>{
        if(item.id === course.id) item.checked = true;
        else item.checked = false;
      });
      this.hack();
    },
    handleCurrentChange(currentPage) {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: currentPage,
        category: this.TofID
      };
      getcourseCategory(loginParams).then(data => {
        // console.log(data);
        this.page = data;
        this.dataL = data.resList;
      });
    },
    show(ev) {
      if (ev.keyCode === 13) {
        var loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          category: this.TofID
        };
        getcourseCategory(loginParams).then(data => {
          // console.log(data);
          this.page = data;
          this.dataL = data.resList;
        });
      }
    },
    getcourses() {
      if (this.searchTxt === '') {
        var loginParams = {
          name: this.searchTxt,
          pgPageNum: 1,
          category: this.TofID
        };
        getcourseCategory(loginParams).then(data => {
          // console.log(data);
          this.page = data;
          this.dataL = data.resList;
        });
      }
    },
    getsearchTxt() {
      var loginParams = {
        name: this.searchTxt,
        pgPageNum: 1,
        category: this.TofID
      };
      getcourseCategory(loginParams).then(data => {
        // console.log(data);
        this.page = data;
        this.dataL = data.resList;
      });
    },
    choeseTrueL() {
      this.dialogVisible2 = false;
    },
    Onaddcategory() {
      var loginParams = {
        id: this.form.cateid,
        name: this.form.name,
        desc: this.form.desc,
        course: this.form.courseid,
        type: '',
        status: '',
        sort: ''
      };
      changecategory(loginParams).then(data => {
        // console.log(data);
        if (data.success) {
          this.openSuccess('修改成功！');
          this.$router.push('/CourseSortList');
        } else {
          this.openError(data.resMsg);
        }
      });
    }
  }
}
</script>
<style>
.asd {
  background: #dcdcdc;
}
</style>
