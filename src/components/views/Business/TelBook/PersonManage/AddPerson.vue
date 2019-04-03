<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="goBack"></i>{{title}}</div>
  <div class="TopLine"></div>
  <div class="TopContent" style="height: 100%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin-top:15px;overflow-y:auto" id="form" method="post">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" style="width: 385px;" placeholder="请输入账号" @change="" id="name" autofocus></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" style="width: 385px;" placeholder="请输入姓名" @change="" autofocus></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" style="width: 385px;" placeholder="请输入手机号" @change="" autofocus></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <input type="text" style="position: absolute; top: -999px"/>
        <el-input v-model="form.email" style="width: 385px;" placeholder="请输入邮箱" @change="" autofocus></el-input>
      </el-form-item>
      <!-- <el-form-item label="登录密码" v-if="title !== ''">
        <input type="password" style="position: absolute; top: -999px"/>
        <el-input v-if="title==='添加用户'" v-model="form.password" show-password name="password" type="password" style="width: 385px;" placeholder="******" @change=""></el-input>
        <el-input v-if="title==='编辑用户'" v-model="form.password" show-password name="password" type="password" style="width: 385px;" placeholder="******" @change=""></el-input>
        <span>* 默认密码为手机号后六位</span>
      </el-form-item> -->
      <el-form-item label="所属部门" prop="parentName">
        <el-input type="textarea" :rows="4" readonly style="width:385px;" placeholder="请选择部门" v-model="form.parentName"></el-input>
        <el-button type="default" @click="ChooseDepartment">选择部门</el-button>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" style="width:120px" @click="OnaddUser">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--选择部门-->
  <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" :before-close="closeDialog">
    <div class="Search">
      <div class="SearchLeft">
        <input v-model="searchTxt" type="text" placeholder="部门名称" style="text-indent: 0.75em;" @keyup.enter="searchDept">
        <el-button type="default" style="padding: 5px 10px;" @click="searchDept">搜索</el-button>
      </div>
    </div>
    <div style="clear: both"></div>
    <br>

    <div style="width:100%;height:auto;border:1px solid #cdcdcd">
      <div class="AddDepartment" id="DeptTopLength_2" v-show="hackReset">
        <el-tree ref="tree" :data="DepartmentList" node-key="id" :default-checked-keys="checkedDeptList" empty-text="暂无数据" show-checkbox accordion check-strictly auto-expand-parent highlight-current :indent="20" :props="defaultProps"
          :default-expanded-keys="keys">
        </el-tree>
      </div>
    </div>
    <div style="height:1px; margin: 10px auto;">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmDepartment">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  UploadFile,
  getDepartmentAll,
  getDepartmentById,
  addUser,
  updateUser
} from '@/api/api';
import NotContent from '@/components/public/NotContent';

export default {
  data() {
    return {
      searchTxt: '',
      title: window.localStorage.saastitle ? window.localStorage.saastitle : '',
      parent: '',
      form: {
        uid: '',
        username: '',
        name: '',
        mobile: '',
        email: '',
        password: '',
        parent: '',
        parentName: '',
        isActive: true
      },
      rules: {
        username: {
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        },
        parentName: {
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }
      },
      titlename: '选择部门',
      DepartmentList: [],
      activeNames: ['200'],
      deptid: window.localStorage.getItem('saasdeptid'),
      checkedIndex: 0,
      checkedDeptList: [],
      submitDeptList: [],
      tempList: [],
      submitUser: [],
      openList: [],
      dialogVisible: false,
      hackReset: false,
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      Member: JSON.parse(window.localStorage.getItem('saasdata')),
      keys: [],
      tofIE9: navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) <= 9
    }
  },
  components: {
    NotContent
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  async mounted() {
    this.hack();
    await getDepartmentAll().then(data => {
      if (data.resCode == 0) {
        this.DepartmentList = data.resList;
      } else {
        this.DepartmentList = [];
        this.openError(data.resMsg);
      }
    });

    // await getDepartmentById(window.localStorage.getItem('saasdeptid')).then(data => {
    //   this.form.parentName = data.name;
    // });

    if (this.title === '编辑用户') {
      this.form.parent = window.localStorage.getItem('saasmemberDept');
      this.form.uid = this.Member.id;
      this.form.name = this.Member.name;
      this.form.mobile = this.Member.mobile;
      if (this.Member.deptList) {
        this.Member.deptList.forEach(item => {
          if (item != this.Member.deptList[this.Member.deptList.length - 1]) {
            this.form.parentName += item.name + ' ';
          } else {
            this.form.parentName += item.name;
          }
        });
      }
    }
    if (this.deptid != '') {
      this.submitDeptList.push({
        id: this.deptid
      });
    }
    setTimeout(function() {
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
    goBack() {
      if (window.localStorage.getItem('saasprevious') === 'PersonList') {
        this.$router.push('/PersonList');
      } else this.$router.push('/DepartList');
    },
    hack() {
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      });
    },
    ChooseDepartment() {
      this.dialogVisible = true;

      // new add
      if (this.title === '添加用户') {
        this.DepartmentList.forEach(item => {
          item.isCheck = false;
          if (item.resList) {
            item.resList.forEach(subItem => {
              item.isCheck = false;
              if (subItem.resList) {
                item.isCheck = false;
              }
            });
          }
          this.$nextTick(() => {
            if (this.deptid != '') this.$refs.tree.setChecked(this.deptid, true);
          });
        });
      }

      if (this.title === '编辑用户') {
        this.$nextTick(function() {
          if (this.Member.deptList) {
            this.Member.deptList.forEach(item => {
              this.$refs.tree.setChecked(item.id, true, false);
            });
          }
        });
      }
      this.hack();
    },
    confirmDepartment() {
      this.form.parentName = '', this.submitDeptList = [];
      this.checkedDeptList = this.$refs.tree.getCheckedKeys();
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (this.form.parentName != '') this.form.parentName += ',' + item.name;
        else this.form.parentName += item.name;
      });
      this.checkedDeptList.forEach(item => {
        this.submitDeptList.push({
          id: item
        });
      });
      this.dialogVisible = false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    OnaddUser() {
      if (!this.form.username) {
        return this.openError('账号不能为空！');
      }
      // if(/\s/.test(this.form.name)){ return this.openError('姓名不能包含空格！');}
      // if (this.form.name.trim().length === 0) {
      //   return this.openError('姓名不能全是空格！');
      // }
      // if (!this.form.mobile) {
      //   return this.openError('手机号不能为空！');
      // }
      if (this.form.mobile && !(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.form.mobile))) {
        return this.openError('请输入正确的手机号！');
      }
      if (!this.form.parentName) {
        return this.openError('部门不能为空！');
      }
      if (this.submitDeptList == '') {
        return this.openError('提交的部门列表为空，请联系管理员！');
      }

      if (this.title === '添加用户' && this.form.name.trim().length != 0 && this.form.mobile && this.form.name && this.form.parentName) {
        addUser(this.form, this.submitDeptList).then(data => {
          if (data.success) {
            this.openSuccess('添加成功');
            if (window.localStorage.saasprevious === 'PersonList') {
              this.$router.push('/PersonList');
            } else if (window.localStorage.saasprevious === 'DepartList') {
              this.$router.push('/DepartList');
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }

      if (this.title === '编辑用户' && !(/\s/.test(this.form.name)) && this.form.name.trim().length != 0 && this.form.mobile && this.form.name && this.form.parentName) {
        updateUser(this.form, this.submitDeptList).then(data => {
          if (data.success) {
            this.openSuccess('编辑成功');
            if (window.localStorage.getItem('saasprevious') == 'DepartList') {
              this.$router.push('/DepartList');
            } else this.$router.push('/PersonList');
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
    setCheck(id, flag1, flag2) {
      this.$refs.tree.setChecked(id, flag1, flag2);
    },
    recursiveDept(data) {
      if (data.resList != '') {
        for (var i = 0; i < data.resList.length; i++) {
          var item = data.resList[i];
          var result = item.name.match(this.searchTxt);
          if (result != null) {
            this.deptid = parseInt(item.id);
            if (this.$refs.tree.getCheckedKeys().indexOf(parseInt(item.id)) < 0) {
              this.setCheck(item.id, true, false);
              this.keys.push(item.id);
              return;
            }
          } else {
            this.recursiveDept(item);
          }
        };
      } else {
        return;
      }
    },
    searchDept() {
      for (var i = 0; i < this.DepartmentList.length; i++) {
        var item = this.DepartmentList[i];
        var result = item.name.match(this.searchTxt);
        if (result != null) {
          this.deptid = parseInt(item.id);
          if (this.$refs.tree.getCheckedKeys().indexOf(parseInt(item.id)) < 0) {
            this.setCheck(item.id, true, false);
            this.keys.push(item.id);
            return;
          }
        } else {
          this.recursiveDept(item);
        }
      };
    }
  }
}
</script>
