<template>
  <div style="width:100%;height:100%;">
    <div>
      <div class="TopName W95">人员统计</div>
    </div>
    <div class="TopLine"></div>
    <div class="TopButtonT W95">
      <div class="TopButtonRight2">
        <input class="TopButtonRightInput" v-model="searchTxt" v-on:input ="" @keydown="" type="text" placeholder="考试名称"/>
        <label class="el-icon-search TopButtonRightSearch" @click=""></label>
        <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
      </div>
    </div>
    <div id="TableDiv" class="W95 Teacher_List_Table" >
      <div style="width: 100%;height:calc(100% - 20px);overflow-y: auto;border:1px solid #cdcdcd;"
           v-loading="Gloading"
           element-loading-text="加载中。。。"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <div style="width:100%;height:40px;line-height:40px;text-align: center">
          <div class="table_header" style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">参与人员</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:calc(40% - 3px);height:100%;border-bottom:1px solid #cdcdcd;">参与培训{{ThemeName}}</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">参与考试</div>
          <div class='ListBorder'></div>
          <div class="table_header" style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">考试总分</div>
          <div class='ListBorder'></div>

          <span v-for="item in StatisticList">
            <div style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.userName}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:calc(40% - 4px);height:100%;border-bottom:1px solid #cdcdcd;">相关{{ThemeName}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">
              <span class="span409EFF" @click="Exam_Person(item)">{{item.total}}</span>
            </div>
            <div class='ListBorder'></div>
            <div style="float:left;width:20%;height:100%;border-bottom:1px solid #cdcdcd;">{{item.score}}</div>
            <div class='ListBorder'></div>
          </span>
        </div>
      </div>
    </div>

    <el-pagination
      style="margin-right:20px;float:right"
      :page-size="Page.pgLimit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="Page.pgTotalCount">
    </el-pagination>
  </div>
</template>

<script>
  import { getStatistic } from '@/api/api';
  import { formatDate } from '@/util/util';

  export default {
    data() {
      return {
        Gloading: true,
        searchTxt: '',
        Page: '',
        StatisticList: [],
        ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
      }
    },
    beforeCreate:function(){
      if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
        this.$router.push('/Login');
      }else{

      }
    },
    mounted(){
      getStatistic({}).then(data=>{
        if(data.resCode==0){
          this.StatisticList = data.resList;
        }
        else this.openError(data.resMsg);
        this.Gloading = false;
      });
    },
    methods:{
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
      Exam_Person(item){
        window.localStorage.setItem('sassuid', item.uid);
        window.localStorage.setItem('sassusername', item.userName);
        this.$router.push('Exam_Person');
      },
      handleCurrentChange(currentPage){

      },
      show(ev){
        if(ev.keyCode===13){

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
