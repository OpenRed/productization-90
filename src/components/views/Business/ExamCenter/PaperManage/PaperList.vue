<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">试卷管理</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="AddPaper" style="width:100px">添加试卷</el-button>
    </span>
    <div class="TopButtonRight4">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="试卷名称" @input="searchPaper1" @keyup.enter="searchPaper2" />
      <el-button type="default" style="padding: 5px 10px;" @click="searchPaper2">搜索</el-button>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="PaperList.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
      <el-table-column prop="name" label="试卷名称">
      </el-table-column>
      <el-table-column prop="duration" label="考试时长(分)" width="200">
      </el-table-column>
      <el-table-column prop="total" label="总分值" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="EditPaper(scope.row)">编辑</el-button>
          <el-button type="text" @click="DelPaper(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination style="margin-right:20px;float:right;" :page-size="PaperList.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="PaperList.pgTotalCount">
  </el-pagination>
</div>
</template>

<script>
import {
  getPaperList,
  delPaper
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
import NotContent from '@/components/public/NotContent';

export default {
  components: {
    NotContent
  },
  data() {
    return {
      NotDis: false,
      tableData: [],
      data: [],
      mobile: '',
      Page: '',
      tof: '',
      searchTxt: '',
      Gloading: true,
      dialogVisible: false,
      dialogVisible1: false,
      changTestid: '',
      changTestname: '',
      name: '',
      PaperList: {}
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  async mounted() {
    this.getPaper({
      pgPageNum: 1
    });
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
    getPaper(params) {
      getPaperList(params).then(data => {
        // console.log(data);
        if (data.success && data.resList) {
          this.PaperList = data;
        } else {
          this.PaperList = {};
          this.NotDis = true;
        }
        this.Gloading = false;
      });
    },
    AddPaper() {
      window.localStorage.saastitle = '添加试卷';
      this.$router.push('AddPaper');
    },
    EditPaper(item) {
      window.localStorage.saastitle = '编辑试卷';
      window.localStorage.setItem("saasPaperid", item.id);
      this.$router.push('UpdPaper');
    },
    DelPaper(item) {
      this.$confirm('确定该试卷?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delPaper(item.id).then(data => {
          if (data.success) {
            this.openSuccess('删除成功！');

            if (this.PaperList.resList.length == 1) {
              this.NotDis = true;
            }
            for (var i in this.PaperList.resList) {
              if (this.PaperList.resList[i].id == item.id) {
                this.PaperList.resList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    searchPaper1() {
      this.getPaper({
        name: this.searchTxt,
        pgPageNum: 1
      })
    },
    searchPaper2() {
      if (this.searchTxt != '') this.getPaper({
        name: this.searchTxt,
        pgPageNum: 1
      });
      else this.openError('请先输入试卷名称再进行搜索');
    },
    handleCurrentChange(currentPage) {
      if (this.PaperList.resList) {
        this.getPaper({
          pgPageNum: currentPage
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
