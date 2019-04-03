<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">管理员管理</div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="AddAdmin">添加管理员</el-button>
    </span>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="tableData" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto" v-if="hackReset">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200">
      </el-table-column>
      <!-- <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column> -->
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.openOrClose" active-color="#13ce66" inactive-color="#ff4949" @change="changestatus(scope.row.id, scope.row.status)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="最后操作时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="OndeleteAdmin(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog :visible.sync="dialogVisible" title="添加管理员" size="tiny" width="30%">
    <div style="height: 40px; line-height: 40px; margin-bottom: 20px;">
      <el-input v-model="form.username" id="name" placeholder="请输入用户账号/手机号"></el-input>
    </div>
    <div>
      <el-button type="primary" @click="OnAddAdmin">添 加</el-button>
      <el-button type="primary" @click="CancleAddAdmin">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getaccess,
  updaccess,
  addaccess,
  delaccess
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      tableData: [],
      data: [],
      tof: '',
      Gloading: true,
      hackReset: false,
      dialogVisible: false,
      form: {
        username: ''
      }
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      getaccess().then(data => {
        // console.log(data);
        this.tableData = data.resList;
        for (var i = 0; i < this.tableData.length; i++) {
          var date = new Date(this.tableData[i].updateTime);
          if (this.tableData[i].status === 0) {
            this.tableData[i].openOrClose = true;
          } else {
            this.tableData[i].openOrClose = false;
          }
          this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
        }
        this.Gloading = false;
        this.hack();
      })
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
      })
    },
    changestatus(id, status) {
      if (status === 1) {
        status = 0;
      } else {
        status = 1;
      }
      var loginParams = {
        id: id,
        status: status
      };
      updaccess(loginParams).then(data => {
        getaccess().then(data => {
          this.tableData = data.resList;
          for (var i = 0; i < this.tableData.length; i++) {
            var date = new Date(this.tableData[i].updateTime);
            if (this.tableData[i].status === 0) {
              this.tableData[i].openOrClose = true;
            } else {
              this.tableData[i].openOrClose = false;
            }
            this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
          }
          this.Gloading = false;
        })
      })
    },
    AddAdmin() {
      this.dialogVisible = true;
      this.form.username = '';
      setTimeout(function() {
        document.querySelector('#name input').focus();
      }, 20)
    },
    CancleAddAdmin() {
      this.form.username = '';
      this.dialogVisible = false;
    },
    OnAddAdmin() {
      if (this.form.username == '') return this.openError('请输入手机号码');
      // if(!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(this.mobile)) retun this.openError('请输入正确的手机号');
      addaccess(this.form.username).then(data => {
        if (data.success) {
          this.openSuccess('添加成功');
          this.dialogVisible = false;
          getaccess().then(data => {
            this.tableData = data.resList;
            for (var i = 0; i < this.tableData.length; i++) {
              var date = new Date(this.tableData[i].updateTime);
              if (this.tableData[i].status === 0) {
                this.tableData[i].openOrClose = true;
              } else {
                this.tableData[i].openOrClose = false;
              }
              this.tableData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
            this.Gloading = false;
          })
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    OndeleteAdmin(id) {
      this.$confirm('确定删除该管理员?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delaccess(id).then(data => {
          if (data.success) {
            for (var i in this.tableData) {
              if (this.tableData[i].id === id) {
                this.tableData.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
