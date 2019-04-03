<template>
<div>
  <el-dialog :visible.sync="Visible" :title="titlename" top="15%" :before-close="closeDialog">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin-top:15px;overflow-y:auto" id="form" method="post">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="form.userName" :disabled="titlename==='编辑用户'" style="width: 385px;" placeholder="请输入账号" @change="" id="name" :autofocus="true"></el-input>
        <el-button type="primary" style="width:120px;margin-left: 10px;" @click="ResetPassword" v-if="titlename==='编辑用户'">重置密码</el-button>
        <span style="display:block;">* 默认密码：[用户登录账号]+[{{pwSuffix}}]</span>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" style="width: 385px;" placeholder="请输入姓名" @change=""></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" style="width: 385px;" placeholder="请输入手机号" @change=""></el-input>
      </el-form-item>
      <!-- <el-form-item label="邮箱">
        <input type="text" style="position: absolute; top: -999px" />
        <el-input v-model="form.email" style="width: 385px;" placeholder="请输入邮箱" @change=""></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="登录密码" v-if="title !== ''">
        <input type="password" style="position: absolute; top: -999px" />
        <el-input v-if="title==='添加用户'" v-model="form.password" show-password name="password" type="password" style="width: 385px;" placeholder="******" @change=""></el-input>
        <el-input v-if="title==='编辑用户'" v-model="form.password" show-password name="password" type="password" style="width: 385px;" placeholder="******" @change=""></el-input>
        <span>* 默认密码为手机号后六位</span>
      </el-form-item> -->
      <el-form-item label="所属部门">
        <el-input v-if="parentName === ''" type="textarea" :rows="4" readonly style="width:385px;" placeholder="请选择部门" v-model="form.parentName"></el-input>
        <el-input v-if="parentName !== ''" type="textarea" :rows="4" readonly style="width:385px;" placeholder="请选择部门" v-model="parentName"></el-input>
        <el-button type="default" style="margin-left: 10px" @click="ChooseDepartment">选择部门</el-button>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" style="width:120px;" @click="OnaddUser">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!--选择部门-->
  <el-dialog :visible.sync="dialogVisible2" :title="titlename2" top="5%" :before-close="closeDialog2">
    <div class="Search">
      <div class="SearchLeft">
        <input v-model="searchTxt" type="text" placeholder="部门名称" style="text-indent: 0.75em;" v-on:input="searchDept">
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
      <el-button style="float:right" type="primary" size="small" @click="closeDialog2">取消</el-button>
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
  updateUser,
  resetPwd
} from '@/api/api';
import NotContent from '@/components/public/NotContent';

export default {
  props: {
    Visible: {
      type: Boolean,
      default: false
    },
    titlename: {
      type: String,
      default: ''
    },
    data: {
      type: Object
    },
    list: {
      type: Array
    }
  },
  data() {
    return {
      searchTxt: '',
      pwSuffix: window.localStorage.saaspwSuffix ? window.localStorage.saaspwSuffix : '',
      parent: '',
      rules: {
        userName: {
          required: true,
          message: '请输入账号',
          trigger: 'change'
        }
      },
      dialogVisible2: false,
      titlename2: '选择部门',
      DepartmentList: [],
      activeNames: ['200'],
      // deptid: window.localStorage.getItem('saasdeptid'),
      checkedIndex: 0,
      checkedDeptList: [],
      submitDeptList: [],
      tempList: [],
      submitUser: [],
      openList: [],
      hackReset: false,
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      keys: [],
      parentName: '', // 黑科技：弹窗加载后默认显示传递的form.parentName，当用户选择部门后显示这个parentName
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

    setTimeout(function() {
      if (document.querySelector('#name input')) document.querySelector('#name input').focus();
    }, 200)
  },
  computed: {
    form() {
      let name = '';
      if (this.list) {
        this.list.forEach(item => {
          name += item.name + ','
          this.submitDeptList.push({
            id: item.id
          });
        })
        name = name.slice(0, name.length - 1);
      }
      return {
        uid: this.data.id || '',
        userName: this.data.userName || '',
        name: this.data.name || '',
        mobile: this.data.mobile || '',
        email: this.data.email || '',
        parentName: name
      }
    }
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
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      });
    },
    ChooseDepartment() {
      this.dialogVisible2 = true;
      this.searchTxt = '';
      // new add
      // if (this.titlename === '添加用户') {
      //   this.DepartmentList.forEach(item => {
      //     item.isCheck = false;
      //     if (item.resList) {
      //       item.resList.forEach(subItem => {
      //         item.isCheck = false;
      //         if (subItem.resList) {
      //           item.isCheck = false;
      //         }
      //       });
      //     }
      //     this.$nextTick(() => {
      //       if (this.deptid !== '') this.$refs.tree.setChecked(this.deptid, true);
      //     });
      //   });
      // }
      if (this.titlename === '编辑用户') {
        this.$nextTick(function() {
          if (this.list) {
            this.list.forEach(item => {
              this.$refs.tree.setChecked(item.id, true, false);
            });
          }
        });
      }
      this.hack();
    },
    confirmDepartment() {
      this.parentName = '', this.submitDeptList = [];
      // this.checkedDeptList = this.$refs.tree.getCheckedKeys();
      this.checkedDeptList = this.$refs.tree.getCheckedNodes();
      console.log(this.checkedDeptList);
      this.checkedDeptList.forEach(item => {
        if (this.parentName !== '') this.parentName += ',' + item.name;
        else this.parentName += item.name;
        console.log(this.parentName);
      });
      this.deptlist = this.checkedDeptList;
      this.checkedDeptList.forEach(item => {
        this.submitDeptList.push({
          id: item.id
        });
      });
      this.dialogVisible2 = false;
    },
    closeDialog() {
      this.$emit('close', false);
    },
    closeDialog2() {
      this.dialogVisible2 = false;
    },
    OnaddUser() {
      console.log(this.form);
      if (!this.form.userName) return this.openError('账号不能为空！');
      if (this.form.userName && this.form.userName.length < 4) return this.openError('账号至少为4位！');
      if (!(/^[a-zA-Z0-9_]+$/.test(this.form.userName))) return this.openError('账号不能包含汉字！');
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
      if (this.form.email && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.form.email))) {
        return this.openError('请输入正确的邮箱！');
      }
      // console.log(this.parentName);
      // if (this.form.parentName === '' || this.parentName === '') {
      //   return this.openError('部门不能为空！');
      // }
      console.log(this.submitDeptList);
      if (this.submitDeptList.length === 0) {
        return this.openError('请选择部门列表！');
      }

      if (this.titlename === '添加用户') {
        addUser(this.form, this.submitDeptList).then(data => {
          if (data.success) {
            this.openSuccess('添加成功');
            this.$emit('close', false);
          } else {
            this.openError(data.resMsg);
          }
        });
      }

      if (this.titlename === '编辑用户') {
        updateUser(this.form, this.submitDeptList).then(data => {
          if (data.success) {
            this.openSuccess('编辑成功');
            this.$emit('close', false);
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
    ResetPassword() {
      console.log(this.form);
      if (!this.form.uid) return this.openError('用户ID不能为空！');
      this.$confirm('当前进行密码重置操作，重置后的密码为[用户登录账号]+[' + this.pwSuffix + ']。', '提示', {
        confirmButtonText: '重置密码',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd(this.form.uid).then(data => {
          if (data.success && data.resCode === 0) {
            this.openSuccess('密码重置成功！');
          } else {
            this.openError(data.resMsg)
          }
        });
      }).catch(() => {});
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
      if (this.searchTxt !== '') {
        for (var i = 0; i < this.DepartmentList.length; i++) {
          var item = this.DepartmentList[i];
          var result = item.name.match(this.searchTxt);
          console.log(result);
          if (result != null) {
            // this.deptid = parseInt(item.id);
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
}
</script>
