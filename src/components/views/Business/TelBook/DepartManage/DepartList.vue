<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">部门管理</div>
  <div class="TopLine"></div>
  <div>
    <div class="TopName W95">
      <span>
        <el-button type="primary" @click="addDepartOne">添加同级部门</el-button>
      </span>
      <span class="TopButtonLeft_1">
        <el-button type="primary" @click="addDepart" :disabled="btnDisabledChild">添加子部门</el-button>
      </span>
      <span class="TopButtonLeft_1">
        <el-button type="primary" @click="EditDepartment" :disabled="btnDisabled">编辑部门</el-button>
      </span>
      <span class="TopButtonLeft_1">
        <el-button type="primary" @click="onDelDepartment" :disabled="btnDisabled">删除部门</el-button>
      </span>

      <span class="SearchDept TopButtonRight6">
        <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="searchDeptInput">
        <el-button type="default" style="padding: 5px 10px;" @click="searchDeptBtn">搜索</el-button>
      </span>
    </div>
  </div>

  <div class="TopContent W95" style="border: 1px solid #cdcdcd;">
    <div class="TopContentLeft" id="DeptTopLength_1">
      <el-tree :data="DepartmentList" ref="tree" node-key="id" empty-text="暂无数据" accordion :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys" @node-click="handleNodeClick"></el-tree>
    </div>

    <div class="TopContentRight">
      <div class="TopContentRight1">
        <span v-if="DeptUsersNum">{{currentDept||'部门名称'}}({{DeptUsersNum}}人)</span>
        <span v-else>{{currentDept||'部门名称'}}(0人)</span>
        <el-button size="small" @click="addDeptMember" :disabled="btnDisabled" style="width:100px;height:30px;margin-left:15px;">添加部门用户</el-button>
      </div>
      <div class="TopContentRight2">
        <div class="Department_List_Table">
          <el-table :data="userInfo.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
            <el-table-column prop="id" label="序号" width="200">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="200">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" width="200">
            </el-table-column>
            <el-table-column prop="currentStatus" label="部门">
              <template slot-scope="scope">
                {{currentDept||'一级部门'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="editPersonnel(scope.row)">编辑</el-button>
                <el-button type="text" @click="onDelPersonnel(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="TopContentRight3">
        <el-pagination style="float:right;" :page-size="pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="userInfo.pgTotalCount">
        </el-pagination>
      </div>
    </div>
  </div>

  <!-- 添加部门用户 -->
  <AddPerson :Visible="dialogVisible" :titlename="titlename" :data="user" :list="deptlist" @close="closeDialog"></AddPerson>
</div>
</template>

<script>
import {
  getDepartmentAll,
  getDepartmentById,
  getUserBy,
  delDepartment,
  delUser
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import AddPerson from '../PersonManage/AddPersonModal';

export default {
  data() {
    return {
      DepartmentList: [],
      item: [],
      userInfo: [],
      tof: '',
      NotDis: true,
      searchTxt: '',
      currentIndex: '',
      currentParent: '',
      currentDept: '部门名称',
      currentDeptParent: '',
      hackReset: false,
      btnDisabled: true,
      btnDisabledChild: true,
      pgLimit: 12,
      DeptUsersNum: 0,
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      highlightkeys: 0,
      dialogVisible: false,
      titlename: '',
      user: {},
      deptlist: []
    }
  },
  components: {
    NotContent,
    AddPerson
  },
  beforeCreate() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    this.GetDeptlist();
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
    GetDeptlist() {
      this.$nextTick(() => {
        getDepartmentAll().then(data => {
          if (data.resCode == 0) {
            this.DepartmentList = data.resList;
          } else {
            this.DepartmentList = [];
            this.openError(data.resMsg);
          }
          this.hack();
        });
      })
    },
    getuser(params) {
      this.userInfo = [];
      getUserBy(params).then(data => {
        // console.log(data);
        if (data.resList) {
          this.userInfo = data;
          this.DeptUsersNum = data.resList.length;
        } else this.DeptUsersNum = 0;
      });
    },
    handleNodeClick(item) {
      this.searchTxt = '';
      this.deptlist = [];
      var params = {
        deptid: item.id,
        keyword: this.searchTxt,
        pgPageNum: 1
      };
      this.getuser(params);
      this.currentIndex = parseInt(item.id);
      this.currentParent = parseInt(item.parent);

      getDepartmentById(this.currentIndex).then(data => {
        if (data.success) {
          window.localStorage.setItem('saasDeptidPre', data.parent);
        }
      });

      this.currentDept = item.name;
      this.btnDisabled = false;
      this.btnDisabledChild = false;
      this.deptlist.push(item);

      this.hack();
    },
    addDepartOne() {
      window.localStorage.saastitle = '添加部门';
      getDepartmentById(this.currentIndex).then(data => {
        if (data.success) {
          window.localStorage.setItem('saasDeptidPre', data.parent);
        }
      });
      if (this.currentIndex != '') {
        window.localStorage.setItem('saasdeptType', '1');
      }
      this.$router.push('/AddDepart');
    },
    addDepart() {
      window.localStorage.saastitle = '添加部门';
      window.localStorage.saasDeptidPre = this.currentIndex;
      if (this.currentIndex != '') {
        window.localStorage.setItem('saasdeptType', '1');
      }
      this.$router.push('/AddDepart');
    },
    EditDepartment() {
      window.localStorage.saastitle = '编辑部门';
      window.localStorage.saasdataid = this.currentIndex;
      this.$router.push('/AddDepart');
    },
    addDeptMember() {
      this.dialogVisible = true;
      this.user = {};
      this.titlename = '添加用户';
    },
    editPersonnel(item) {
      console.log(item);
      this.dialogVisible = true;
      this.user = item;
      this.titlename = '编辑用户';
    },
    closeDialog() {
      this.dialogVisible = false;
      this.getuser({
        deptid: this.currentIndex,
        pgPageNum: 1
      });
    },
    onDelDepartment() {
      this.$confirm('确定删除该部门?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delDepartment(this.currentIndex).then(data => {
          if (data.success) {
            this.openSuccess('删除成功！');
            this.btnDisabled = true;
            this.btnDisabledChild = true;
            this.currentDept = '部门名称';
            this.userInfo.resList = [];
            this.GetDeptlist();
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    onDelPersonnel(item) {
      this.$confirm('确定移除该用户?', '提示', {
        confirmButtonText: '移除',
        cancelButtonText: '不移除',
        type: 'warning'
      }).then(() => {
        delUser(this.currentIndex, item.id).then(data => {
          if (data.success) {
            this.openSuccess(item.name + '已经从' + this.currentDept + '移除！');

            if (this.userInfo.resList.length == 1) {
              this.NotDis = true;
            }
            for (var i in this.userInfo.resList) {
              if (this.userInfo.resList[i].id == item.id) {
                this.userInfo.resList.splice(i, 1);
              }
            }
            this.DeptUsersNum--;
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    // 递归操作循环展开上级部门
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
            this.getuser({
              deptid: item.id
            });
            this.currentIndex = parseInt(item.id);
            this.currentParent = parseInt(item.parent);
            console.log(item, 2);

            getDepartmentById(item.id).then(data => {
              if (data.success) {
                window.localStorage.setItem('saasDeptidPre', data.parent);
              }
            });

            this.currentDept = item.name;
            this.btnDisabled = false;
            this.btnDisabledChild = false;
            this.hack();
            break;
          } else {
            this.recursiveDept(item);
          }
        };
      } else {
        this.currentIndex = '';
        this.currentParent = '';
        this.btnDisabled = true;
        this.btnDisabledChild = true;
        this.userInfo = {};
        this.DeptUsersNum = 0;
        this.highlightkeys = '';
        return;
      }
    },
    searchDeptInput() {
      if (this.searchTxt !== '') {
        for (var i = 0; i < this.DepartmentList.length; i++) {
          var item = this.DepartmentList[i];
          var result = item.name.match(this.searchTxt);
          if (result != null) {
            this.highlightkeys = item.id;
            // this.$refs.tree.store.nodesMap[item.id].expanded = true;
            this.getuser({
              deptid: item.id
            });
            this.currentIndex = parseInt(item.id);
            this.currentParent = parseInt(item.parent);
            console.log(item);

            getDepartmentById(this.currentIndex).then(data => {
              if (data.success) {
                window.localStorage.setItem('saasDeptidPre', data.parent);
              }
            });

            this.currentDept = item.name;
            this.btnDisabled = false;
            this.btnDisabledChild = false;
            this.hack();
            break;
          } else {
            this.recursiveDept(item);
          }
        };
      } else {
        this.highlightkeys = '';
        this.currentIndex = '';
        this.currentDept = '';
        this.currentParent = '';
        this.btnDisabled = true;
        this.btnDisabledChild = true;
        this.userInfo = {};
        this.DeptUsersNum = 0;
        this.highlightkeys = '';
        this.GetDeptlist();
      }
    },
    searchDeptBtn() {
      if (this.searchTxt !== '') {
        this.searchDeptInput();
      } else {
        this.openError('请先输入部门关键字再搜索！');
      }
    },
    searchDept() {
      for (var i = 0; i < this.DepartmentList.length; i++) {
        var item = this.DepartmentList[i];
        var result = item.name.match(this.searchTxt);
        if (result != null && result[0] != '') {
          this.getuser({
            deptid: item.id
          });
          this.currentIndex = parseInt(item.id);
          this.currentParent = parseInt(item.parent);

          getDepartmentById(this.currentIndex).then(data => {
            if (data.success) {
              window.localStorage.setItem('saasDeptidPre', data.parent);
            }
          });

          this.currentDept = item.name;
          this.btnDisabled = false;
          this.btnDisabledChild = false;

          this.$refs.tree.setCheckedNodes([{
            id: item.id,
            label: item.name
          }]);

          this.currentDept = item.name;
          document.getElementById('DeptTopLength_1').scrollTop = 50 * i;
          this.hack();
          return;
        }
      };
    },
    show(ev) {
      if (ev.keyCode === 13) {
        this.searchDept();
      }
    },
    handleCurrentChange(currentPage) {
      var params = {
        deptid: this.currentIndex,
        pgPageNum: currentPage,
        pgLimit: this.pgLimit,
        keyword: this.searchTxt
      };
      getUserBy(params).then(data => {
        this.userInfo = data;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
