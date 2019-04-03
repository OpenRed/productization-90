<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">题库管理</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addhomeclick" style="width:100px">添加题库</el-button>
    </span>
    <div class="TopButtonRight4">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="题库名称" v-on:input="getexamplenull" @keydown="show($event)" /><label class="el-icon-search TopButtonRightSearch" @click="Ongetexample(searchTxt,0)"></label>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="TestList.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
      <el-table-column prop="id" label="id" width="200">
      </el-table-column>
      <el-table-column prop="name" label="题库名称">
      </el-table-column>
      <el-table-column prop="numberProblems" label="题目数量" width="200">
      </el-table-column>
      <el-table-column prop="updatetime" label="最后操作时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog1(scope.row.id, scope.row.name)">编辑</el-button>
          <el-button type="text" @click="GoTestDetail(scope.row.id, scope.row.name)">管理试题</el-button>
          <el-button type="text" @click="Ondeleteexample(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination style="margin-right:20px;float:right;" :page-size="TestList.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="TestList.pgTotalCount">
  </el-pagination>
  <el-dialog :visible.sync="dialogVisible" title="添加题库" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="题库名称">
          <el-input v-model="name" style="width:90%;" @keyup.enter.native="Onaddexample" id="homename"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="Onaddexample" :disabled="name===''">提 交</el-button>
    </span>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible1" title="修改题库名称" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="题库名称">
          <el-input v-model="changTestname" style="width:90%;" @keyup.enter.native="OnUpdExample" id="Chomename"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="OnUpdExample" :disabled="changTestname===''">提 交</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getOneexample,
  delexample,
  addexample,
  getexample,
  changeexample
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      NotDis: false,
      data: [],
      mobile: '',
      TestList: {},
      tof: '',
      searchTxt: '',
      Gloading: true,
      dialogVisible: false,
      dialogVisible1: false,
      changTestid: '',
      changTestname: '',
      name: '',
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
    await this.Ongetexample('', 0)
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
    show(ev) {
      if (ev.keyCode === 13) {
        this.Ongetexample(this.searchTxt, 0);
      }
    },
    handleCurrentChange(currentPage) {
      this.Ongetexample(this.searchTxt, currentPage);
    },
    getexamplenull() {
      this.Ongetexample(this.searchTxt, 0);
    },
    Ongetexample(txt, num) {
      getexample({
        name: txt,
        pgPageNum: num
      }).then(data => {
        // console.log(data);
        if (data.success && data.resList) {
          this.NotDis = false;
          this.TestList = data;
          for (var i = 0; i < this.TestList.resList.length; i++) {
            var date = new Date(this.TestList.resList[i].updateTime);
            this.TestList.resList[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
          }
        } else {
          this.TestList = {};
          this.NotDis = true;
        }
        this.Gloading = false;
      })
    },
    GoTestDetail(id, name) {
      window.sessionStorage.setItem('saasTestid', id);
      window.sessionStorage.setItem('saasTestname', name);
      this.$router.push('/Test_Detail');
    },
    addhomeclick() {
      this.dialogVisible = true;
      this.name = '';
      setTimeout(function() {
        document.querySelector('#homename input').focus();
      }, 20);
    },
    Onaddexample() {
      var loginParams = {
        name: this.name
      };
      addexample(loginParams).then(data => {
        // console.log(data);
        if (data.success) {
          this.dialogVisible = false;
          this.Ongetexample();
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    showDialog1(id, name) {
      this.changTestid = id;
      this.changTestname = name;
      this.dialogVisible1 = true;
      setTimeout(function() {
        document.querySelector('#Chomename input').focus();
      }, 20);
    },
    OnUpdExample() {
      var loginParams = {
        name: this.changTestname,
        id: this.changTestid
      };
      changeexample(loginParams).then(data => {
        if (data.success) {
          this.dialogVisible1 = false;
          for (var i in this.TestList.resList) {
            if (this.TestList.resList[i].id === this.changTestid) {
              this.TestList.resList[i].name = this.changTestname;
            }
          }
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    Ondeleteexample(id) {
      this.$confirm('确定删除该试题?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delexample(id).then(data => {
          if (data.success) {
            for (var i in this.TestList.resList) {
              if (this.TestList.resList[i].id === id) {
                this.TestList.resList.splice(i, 1);
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
