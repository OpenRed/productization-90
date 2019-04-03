<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95">考试管理</div>
  </div>
  <div class="TopLine"></div>
  <div class="TopButtonT W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="AddExam" style="width:100px">创建考试</el-button>
    </span>
    <div class="TopButtonRight4">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="考试名称" @input="searchExam1" @keyup.enter="searchExam2" />
      <el-button type="default" style="padding: 5px 10px;" @click="searchExam2">搜索</el-button>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="ExamList.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto" v-if="hackReset">
      <el-table-column prop="name" label="考试名称">
      </el-table-column>
      <el-table-column prop="begintime" label="考试开始时间" width="200">
      </el-table-column>
      <el-table-column prop="endtime" label="考试结束时间" width="200">
      </el-table-column>
      <el-table-column prop="statusBoolean" label="是否开放" width="200">
        <template slot-scope="scope">
          <el-switch @change="OpenExamStatus(scope.row)" v-model="scope.row.statusBoolean" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="currentStatus" label="当前状态" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="EditExam(scope.row)">编辑</el-button>
          <el-button type="text" @click="DelExam(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination style="margin-right:20px;float:right;" :page-size="ExamList.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="ExamList.pgTotalCount">
  </el-pagination>
</div>
</template>

<script>
import {
  getExamList,
  openExam,
  delExam
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    return {
      NotDis: false,
      searchTxt: '',
      Gloading: true,
      value: true,
      ExamList: {},
      hackReset: false,
      Page: '',
      pgLimit: 30
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
    this.getExam({
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
    getExam(params) {
      getExamList(params).then(data => {
        if (data.success && data.resList) {
          this.ExamList = data;
          this.ExamList.resList.forEach(item => {
            if (item.status == 0) item.statusBoolean = true;
            else item.statusBoolean = false;
            // item.begintime = formatDate( new Date(item.beginTime),'yyyy-MM-dd hh:mm');
            item.begintime = formatDate(new Date(item.beginTime), 'yyyy-MM-dd');
            item.endtime = formatDate(new Date(item.endTime), 'yyyy-MM-dd');

            var now = new Date().getTime();
            if (now < item.beginTime) item.currentStatus = '未开始';
            if (item.beginTime < now && now < item.endTime) item.currentStatus = '正在进行';
            if (now > item.endTime) item.currentStatus = '已结束';
            this.hack();
          });
          this.Gloading = false;
        } else {
          this.ExamList = {};
          this.Gloading = false;
          this.NotDis = true;
        }
      });
    },
    hack() {
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };

      // 遍历这个对象
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          // console.log(`${k}`)
          // console.log(RegExp.$1)
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
      }
      return fmt;
    },
    OpenExamStatus(item) {
      openExam({
        id: item.id,
        status: item.status ? 0 : 1
      }).then(data => {
        // console.log(data);
        if (data.success) {
          this.openSuccess('开启成功');
        } else this.openError(data.resMsg);
        this.hack();
      });
    },
    AddExam() {
      this.$router.push('AddExam');
    },
    EditExam(item) {
      window.localStorage.setItem("saasExamid", item.id);
      window.localStorage.setItem("saascover", item.cover);
      this.$router.push('UpdExam');
    },
    DelExam(item) {
      this.$confirm('确定删除该考试?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delExam(item.id).then(data => {
          if (data.success) {
            this.openSuccess('删除成功！');

            if (this.ExamList.resList.length == 1) {
              this.NotDis = true;
            }
            for (var i in this.ExamList.resList) {
              if (this.ExamList.resList[i].id == item.id) {
                this.ExamList.resList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    searchExam1() {
      this.getExam({
        name: this.searchTxt,
        pgPageNum: 1
      });
    },
    searchExam2() {
      if (this.searchTxt != '') this.getExam({
        name: this.searchTxt
      });
      else this.openError('请先输入考试名称再进行搜索');
    },
    handleCurrentChange(currentPage) {
      if (this.ExamList.resList) {
        this.getExam({
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
