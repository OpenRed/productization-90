<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">用户管理</div>
  <div class="TopLine"></div>
  <div class="TopName W95" style="height: 36px">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addPersonnel">添加用户</el-button>
    </span>
    <span class="TopButtonRight6">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="searchPersonInput">
      <el-button type="default" style="padding: 5px 10px;" @click="searchPersonBtn">搜索</el-button>
    </span>
  </div>

  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="userInfo.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
      <el-table-column prop="id" label="序号" width="200">
      </el-table-column>
      <el-table-column prop="userName" label="姓名" width="200">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="200">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200">
      </el-table-column>
      <el-table-column prop="currentStatus" label="所属部门">
        <template slot-scope="scope">
          <span v-for="item in scope.row.deptList">{{item.name}} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="editPersonnel(scope.row)">编辑</el-button>
          <el-button type="text" @click="onDelPersonnel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-pagination style="margin-right:20px;float:right;" :page-size="pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="userInfo.pgTotalCount">
  </el-pagination>

  <!-- 添加部门用户 -->
  <AddPerson :Visible="dialogVisible" :titlename="titlename" :data="user" :list="deptlist" @close="closeDialog"></AddPerson>
</div>
</template>

<script>
import {
  getUserAll,
  delUser,
  delUserFromOrg
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
import NotContent from '@/components/public/NotContent';
import AddPerson from './AddPersonModal';

export default {
  data() {
    return {
      tableData: [],
      data: [],
      mobile: '',
      tof: '',
      Gloading: false,
      NotDis: false,
      searchTxt: '',
      dialogVisible: false,
      titlename: '',
      problem: [],
      userInfo: [],
      user: {},
      deptlist: [],
      deptName: '',
      Page: '',
      pgLimit: 30
    }
  },
  components: {
    NotContent, AddPerson
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    this.GetUserList();
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
    GetUserList(){
      getUserAll({
        pgPageNum: 1,
        pgLimit: this.pgLimit
      }).then(data => {
        if (data.success) {
          if (data.resList) this.userInfo = data;
          else this.NotDis = true;
        } else this.NotDis = true;
      });
    },
    addPersonnel() {
      // window.localStorage.setItem('saasprevious', 'PersonList');
      // window.localStorage.setItem('saastitle', '添加用户');
      // window.localStorage.setItem('saasdeptid', null); // 清空部门管理页面遗留的部门id
      // this.$router.push('/AddPerson');
      this.titlename = '添加用户';
      this.dialogVisible = true;
      this.user = {};
      this.deptlist = [];
    },
    closeDialog(){
      this.dialogVisible = false;
      this.GetUserList();
    },
    searchPersonInput() {
      var params = {
        pgPageNum: 1,
        pgLimit: this.pgLimit
      };
      if (this.searchTxt !== '') params['keyword'] = this.searchTxt;
      getUserAll(params).then(data => {
        this.userInfo = data;
      });
    },
    searchPersonBtn() {
      if (this.searchTxt !== '') {
        var params = {
          keyword: this.searchTxt,
          pgPageNum: 1,
          pgLimit: this.pgLimit
        };
        getUserAll(params).then(data => {
          this.userInfo = data;
        });
      } else {
        this.openError('请输入关键字再搜索！');
      }
    },
    editPersonnel(item) {
      // var Member = JSON.stringify(item);
      // window.localStorage.setItem('saasdata', Member);
      // window.localStorage.setItem('saastitle', '编辑用户');
      // window.localStorage.setItem('saasprevious', 'PersonList');
      // if (item.deptList[0].id) {
      //   window.localStorage.setItem('saasdeptid', item.deptList[0].id);
      // }
      // this.$router.push('/AddPerson');
      this.dialogVisible = true;
      this.user = item;
      this.titlename = '编辑用户';
      this.deptlist = item.deptList;
    },
    onDelPersonnel(item) {
      this.$confirm('确定删除该用户?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delUserFromOrg(item.id).then(data => {
          if (data.success) {
            this.openSuccess('删除成功！');
            if (this.userInfo.resList.length == 1) {
              this.NotDis = true;
            }
            for (var i in this.userInfo.resList) {
              if (this.userInfo.resList[i].id == item.id) {
                this.userInfo.resList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    handleCurrentChange(currentPage) {
      var params = {
        keyword: this.searchTxt,
        pgPageNum: currentPage,
        pgLimit: this.pgLimit
      };
      getUserAll(params).then(data => {
        this.userInfo = data;
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
