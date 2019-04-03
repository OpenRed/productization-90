<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="goBack"></i>{{title}}</div>
  <div class="TopLine"></div>
  <div style="height: 100%">
    <el-form ref="form" :model="form" label-width="100px" style="margin-top:15px;overflow-y:auto" id="form" method="post">
      <el-form-item label="部门名称">
        <el-input v-model="form.name" id="name" style="width: 385px;" placeholder="请输入内容" @change="" autofocus></el-input>
      </el-form-item>
      <el-form-item label="部门简介" style="width: 485px;">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" @change="" v-model="form.desc">
        </el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-input v-model="form.parentName" readonly style="width: 263px;"></el-input>
        <el-button type="default" @click="ChooseDepartment">选择上级部门</el-button>
        <span> * 不选部门默认为一级部门</span>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" style="width:120px" @click="onAddDepartment">提交</el-button>
      </el-form-item>
    </el-form>

    <!--选择部门-->
    <el-dialog :visible.sync="dialogVisible2" :title="titlename2" top="5%" @close="closeDialog2">
      <div class="Search">
        <div class="SearchLeft">
          <input v-model="searchTxt" type="text" placeholder="部门名称" style="text-indent: 0.75em;" @input="searchDeptInput">
          <el-button type="default" style="padding: 5px 10px;" @click="searchDeptBtn">搜索</el-button>
        </div>
      </div>
      <div style="clear: both"></div>
      <br>

      <div style="width:100%;height:auto;border:1px solid #cdcdcd">
        <div class="AddDepartment" id="DeptTopLength_1">
          <el-tree :data="DepartmentList" ref="tree" node-key="id" empty-text="暂无数据" accordion :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys" @node-click="handleNodeClick"></el-tree>
        </div>
      </div>
      <div style="height:1px; margin: 10px auto;">
        <el-button style="float:right" type="primary" size="small" @click="closeDialog2">取消</el-button>
        <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="chooseDept">确定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {
  UploadFile,
  addDepartment,
  updateDepartment,
  getDepartmentAll,
  getDepartmentById,
  getUserBy
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      title: window.localStorage.saastitle ? window.localStorage.saastitle : '',
      searchTxt: '',
      filepath: [{
        parent: 0,
        fileName: '全部文件'
      }],
      form: {
        id: '',
        name: '',
        desc: '',
        parent: '',
        parentName: ''
      },
      AddOrUpd: true,
      titlename2: '选择部门',
      dialogVisible2: false,
      DepartmentList: [],
      activeNames: ['200'],
      activeNames2: ['200'],
      activeNames3: ['200'],
      currentIndex: '',
      currentDept: '',
      currentIndex2: '',
      currentDept2: '',
      checkedIndex: '',
      checkedDept: '',
      checkedIndex2: '',
      checkedDept2: '',
      userList: [],
      openList: [],
      // saasdeptType:window.localStorage.getItem('saasdeptType'),
      ruleForm: {
        updateId: '',
        inputName: ''
      },

      rules: {
        inputName: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }]
      },
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      highlightkeys: 0,
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
  mounted() {
    getDepartmentAll().then(data => {
      if (data.resCode == 0) {
        this.DepartmentList = data.resList;
      } else {
        this.DepartmentList = [];
        // console.log(data.resMsg);
      }
    });

    if (this.title === '添加部门') {
      this.form.parent = window.localStorage.getItem('saasDeptidPre');
      getDepartmentById(window.localStorage.getItem('saasDeptidPre')).then(data => {
        this.form.parentName = data.name;
      }); // 设置部门的上级部门名称
    }
    if (this.title === '编辑部门') {
      getDepartmentById(window.localStorage.getItem('saasdataid')).then(data => {
        // console.log(data);
        if (data.success) {
          this.form.id = data.id;
          this.form.name = data.name;
          this.form.desc = data.desc;
          this.form.parent = data.parent;
          getDepartmentById(data.parent).then(data => {
            this.form.parentName = data.name;
          }); // 设置部门的上级部门名称
        }
      });
    }
    setTimeout(function() {
      document.querySelector('#name input').focus();
    }, 20)
  },
  methods: {
    getuser(deptid) {
      getUserBy(deptid).then(data => {
        this.userList = data.resList;
      });
    },
    goBack() {
      this.$router.push('/DepartList');
    },
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
    closeDialog2() {
      this.dialogVisible2 = false;
      this.currentIndex = 0;
    },
    ChooseDepartment() {
      if (!this.dialogVisible2) {
        this.dialogVisible2 = true;
      }
    },
    onAddDepartment() {
      if (this.form.name == '') {
        return this.openError('部门名称不能为空！');
      }
      if (this.form.name.trim().length === 0) {
        return this.openError('部门名称不能全是空格！');
      }
      // console.log(this.form);

      if (this.title === '添加部门') {
        addDepartment(this.form).then(data => {
          if (data.success) {
            this.openSuccess('添加成功！');
            this.$router.push('/DepartList');
          } else {
            this.openError(data.resMsg);
          }
        });
      }

      if (this.title === '编辑部门') {
        updateDepartment(this.form).then(data => {
          if (data.success) {
            this.openSuccess('编辑成功！');
            this.$router.push('/DepartList');
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
    handleNodeClick(item) {
      this.currentIndex2 = parseInt(item.id);
      this.currentDept2 = item.name;
    },
    checkIndex(item) {
      this.getuser(item.id);
      this.currentIndex = parseInt(item.id);
      this.currentDept = item.name;
      // console.log(this.currentDept,this.currentIndex);
    },
    checkIndex2(item) {
      this.currentIndex2 = parseInt(item.id);
      this.currentDept2 = item.name;
      // console.log(this.currentDept2,this.currentIndex2);
    },
    chooseDept() {
      if (this.currentIndex2 != '') {
        this.form.parent = this.currentIndex2;
        this.form.parentName = this.currentDept2;
      }
      this.dialogVisible2 = false;
    },
    reverseDept(item) {
      if (this.$refs.tree.store.nodesMap[item.parent] != undefined) {
        this.$refs.tree.store.nodesMap[item.parent].expanded = true;
        if (this.$refs.tree.store.nodesMap[item.parent].data.parent != 0) {
          this.reverseDept(this.$refs.tree.store.nodesMap[item.parent].data);
        } else {
          return;
        }
      }
    },
    recursiveDept(data) {
      if (data.resList != '') {
        for (var i = 0; i < data.resList.length; i++) {
          var item = data.resList[i];
          var result = item.name.match(this.searchTxt);
          if (result != null) {
            this.highlightkeys = item.id;
            this.reverseDept(item); // 循环展开上级部门
            this.currentIndex2 = parseInt(item.id);
            this.currentDept2 = item.name;
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
          this.highlightkeys = item.id;
          this.$refs.tree.store.nodesMap[item.id].expanded = true;
          this.currentIndex2 = parseInt(item.id);
          this.currentDept2 = item.name;
        } else {
          this.recursiveDept(item);
        }
      };
    },
    searchDeptInput() {
      if (this.searchTxt != '') {
        this.searchDept();
      }
    },
    searchDeptBtn() {
      if (this.searchTxt != '') {
        this.searchDept();
      } else {
        this.openError('请先输入部门关键字再搜索！');
      }
    }
  }
}
</script>
