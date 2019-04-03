<template>
  <div style="width:100%;height:100%;">
    <div style="background: #F5F5F5">
      <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOBack"></i>{{title}}</div>
    </div>
    <div class="TopLine"></div>
    <br/>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="height:calc(100% - 120px);overflow-y:auto" id="form" method="post" >
      <el-form-item label="试卷名称" prop="name">
        <el-input v-model="form.name" style="width: 385px;" autofocus ></el-input>
      </el-form-item>
      <el-form-item label="考试时长" prop="duration">
        <el-input v-model="form.duration" style="width: 100px;" autofocus ></el-input> 分钟
      </el-form-item>
      <el-form-item label="考试题目">
        <span class="span409EFF" @click="ImportSubject">从题库中导入</span>
      </el-form-item>
      <el-form-item label="考试总分" v-if="confirmSubjectList.length!=0">
        <span style="margin-left:-10px;color: #48576a;">：{{totalScore}}分</span> <span style="margin-left:10px;color: #48576a;">及格分数：{{Math.floor(totalScore * form.passrate)||0}}</span>
      </el-form-item>

      <el-form-item label="及格线" style="margin-left: -14px" prop="passrate" v-if="confirmSubjectList.length!=0">
        <span style="margin-left:14px"></span>
        <el-input v-model.number="form.passrate" style="width: 100px;" placeholder="范围 0-1.0" value="0" @change=""></el-input>
        <span v-if="/\b0(\.\d{1})\b/.test(form.passrate)">
          总分（{{totalScore}}）X 及格线（{{form.passrate||0}}） = 及格分数（{{Math.floor(totalScore * form.passrate)||0}}）
        </span>
        <span v-else>
            总分（100）X 及格线（0.6） = 及格分数（60）
        </span>
      </el-form-item>
      <div id="TableDiv0" class="W93 Paper_List_Table" v-if="confirmSubjectList.length!=0">
        <div style="width: calc(100% - 3px);overflow-y: auto;" class="no_bottom"
             v-loading="Gloading"
             element-loading-text="加载中。。。"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <div style="width:100%;height:40px;line-height:40px;text-align: center">
            <div class="table_header" style="float:left;width:calc(25% - 5px);height:100%;border-bottom:1px solid #cdcdcd;">描述</div>
            <div class='ListBorder'></div>
            <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
              单选题({{checkedSubject.filter(function(e){return e.type==1;}).length}})
            </div>
            <div class='ListBorder'></div>
            <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
              多选题({{checkedSubject.filter(function(e){return e.type==3;}).length}})
            </div>
            <div class='ListBorder'></div>
            <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
              判断题({{checkedSubject.filter(function(e){return e.type==2;}).length}})
            </div>
            <div class='ListBorder'></div>
            <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
              填空题(开发中)
            </div>
            <div class='ListBorder'></div>
            <div class="table_header" style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
              问答题(开发中)
            </div>

            <span v-for="">
              <div style="float:left;width:calc(25% - 5px);height:100%;border-bottom:1px solid #cdcdcd;">每题(空)分</div>
              <div class='ListBorder'></div>
              <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
                <input v-model="subjectType1" @change="setScoreEvery('score1',1)" type="text" placeholder="设置分值" onkeyup="value=value.replace(/[^\d]/g,'')" id="score1" class="like_excel">
              </div>
              <div class='ListBorder'></div>
              <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
                <input v-model="subjectType3" @change="setScoreEvery('score3',3)" type="text" placeholder="设置分值" onkeyup="value=value.replace(/[^\d]/g,'')" id="score3" class="like_excel">
              </div>
              <div class='ListBorder'></div>
              <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
                <input v-model="subjectType2" @change="setScoreEvery('score2',2)" type="text" placeholder="设置分值" onkeyup="value=value.replace(/[^\d]/g,'')" id="score2" class="like_excel">
              </div>
              <div class='ListBorder'></div>
              <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
                <input v-model="subjectType4" @change="setScoreEvery('score4',4)" type="text" placeholder="设置分值" onkeyup="value=value.replace(/[^\d]/g,'')" id="score4" class="like_excel">
              </div>
              <div class='ListBorder'></div>
              <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">
                <input v-model="subjectType5" @change="setScoreEvery('score5',5)" type="text" placeholder="设置分值" onkeyup="value=value.replace(/[^\d]/g,'')" id="score5" class="like_excel">
              </div>
            </span>

            <div style="float:left;width:calc(25% - 5px);height:100%;border-bottom:1px solid #cdcdcd;">总分</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{totalType1||0}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{totalType3||0}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{totalType2||0}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{totalType4||0}}</div>
            <div class='ListBorder'></div>
            <div style="float:left;width:15%;height:100%;border-bottom:1px solid #cdcdcd;">{{totalType5||0}}</div>
          </div>
          <not-content v-if="NotDis"></not-content>
        </div>
      </div>

      <div class="W93" v-if="confirmSubjectList.length!=0">题目指定分数</div>
      <br>
      <div v-if="confirmSubjectList.length!=0" id="TableDiv3" class="W93 Paper_List_Table" style="max-height:400px;min-height:150px;overflow-y:auto;">
        <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
          <tr style="background: rgb(220, 220, 220)">
            <th style="width: calc(55% - 2px)">题目名称</th>
            <th style="width: 15%">题目类型</th>
            <th style="width: 15%">分值</th>
            <th style="width: 15%">操作</th>
          </tr>
          <tr v-for="item in confirmSubjectList">
            <td style="padding: 0 5px;">{{item.content}}</td>
            <td>{{item.typeName}}</td>
            <td>
              <input :id="item.id" type="text" value="" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="设置分值" @change="setScore(item)" class="like_excel2">
            </td>
            <td>
              <el-button type="text" :disabled="item.disabledPre" @click="up(item)">上移</el-button>
              <el-button type="text" :disabled="item.disabledNext" @click="down(item)">下移</el-button>
            </td>
          </tr>
        </table>
      </div>
      <el-form-item label="" style="margin-left:-70px">
        <el-button type="primary" style="width:120px" @click="OnAddPaper">提交</el-button>
      </el-form-item>
    </el-form>

    <!--选择题目-->
    <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" :before-close="closeDialog">
      <div style="width:100%; margin-top: -20px; padding: 8px 0;">
        <span>已选择 {{checkedSubject.filter(function(e){return e.status==12||e.status==11;}).length}} 题</span>
        <span style="margin-left: 15px;"><a href="javascript:;" @click="showMore">查看更多</a></span>
      </div>

      <div class="Search">
        <div class="SearchLeft">
          <input v-model="searchTxt1" type="text" placeholder="题库名称" @keyup.enter="">
          <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
        </div>
        <div class="SearchRight">
          <input v-model="searchTxt2" type="text" placeholder="题目名称" @keyup.enter="">
          <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
        </div>
      </div>
      <div style="clear: both"></div>
      <br>

      <div style="width:100%;border:1px solid #cdcdcd">
        <div id="TableDiv" class="Teacher_List_Table">
          <div style="width: 100%;height:calc(100% - 30px);overflow-y: auto;border:1px solid #cdcdcd;"
               v-loading="Gloading"
               element-loading-text="加载中。。。"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
            <div class="SubjectList">
              <div class="TopContentLeft MemberListLeft AddDepartment" id="DeptTopLength_4">
                <ul v-for="item in List">
                  <li @click="checkIndex(item)" :class="{'activeLi':currentIndex==item.id}">{{item.name}}</li>
                </ul>
              </div>
              <div class="MemberListRight">
                <table border="1" bordercolor="#cdcdcd" style="border-collapse:collapse;">
                  <tr>
                    <!--<th>id</th>-->
                    <th>题目名称</th>
                    <th>操作</th>
                  </tr>
                  <tr v-for="item in subjectList" v-if="hackReset">
                    <!--<td>{{item.id}} {{item.status}}</td>-->
                    <td style="width: 80%">{{item.content}}</td>
                    <td style="width: 20%">
                      <input type="checkbox" v-if="item.isCheck" checked @click="checkSubject(item)">
                      <input type="checkbox" v-else @click="checkSubject(item)">
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height:1px; margin: 10px auto;">
        <el-button style="float:right" type="primary" size="small" @click="closeDialog">取消</el-button>
        <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmSubject">确定</el-button>
      </div>
    </el-dialog>

    <!--查看题目-->
    <el-dialog :visible.sync="dialogVisible2" :title="titlename2" top="5%" @close="closeDialog2">
      <div class="Search">
        <div class="SearchRight4">
          <el-radio v-model="radio" label="0">变动题目</el-radio>
        </div>
        <div class="SearchRight5">
          <input v-model="searchTxt3" type="text" placeholder="题目名称" style="text-indent: 0.75em;"@keyup.enter="">
          <el-button type="default" style="padding: 5px 10px;" @click="">搜索</el-button>
        </div>
      </div>
      <div style="clear: both"></div>
      <br>

      <div style="width: 100%;height: 416px;overflow-x: hidden;border: 1px solid #cdcdcd;">
        <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
          <tr style="background: rgb(220, 220, 220)">
            <th style="width: 20%">id</th>
            <th style="width: 20%">题目名称</th>
            <th style="width: 20%">变动状态</th>
            <th style="width: 20%">操作</th>
          </tr>
          <tr v-for="item in checkedSubject.filter(function(e){return e.status==12||e.status==11;})" v-if="hackReset">
            <td>{{item.id}}</td>
            <td>{{item.content}}</td>
            <td>{{item.statusName}}</td>
            <td><img @click="clearSubject(item)" src="@/static/img/close.png" style="cursor: pointer" alt=""></td>
          </tr>
        </table>
      </div>

      <div style="height:1px; margin: 10px auto;clear: both">
        <el-button style="float:right" type="primary" size="small" @click="closeDialog2">取消</el-button>
        <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmShow">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getexample,getproblems,addPaper,getPaperById } from '@/api/api';

  export default {
    data () {
      var checkDuration = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('考试时长不能为空'));
        }
        setTimeout(() => {
          if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (!/^[1-9]\d*$/.test(value)) {
              callback(new Error('请输入大于0的整数值'));
            } else {
              callback();
            }
          }
        }, 100);
      };
      var checkPassrate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('及格线不能为空'));
        }
        setTimeout(() => {
          if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value<=0 || value>=1) {
              callback(new Error('请输入0-1之间的数字'));
            } else {
              if(!(/\b0(\.\d{1})\b/.test(value))){
                this.form.passrate = parseFloat(value).toFixed(1).toString();
                callback();
              }
              else callback();
            }
          }
        }, 300);
      };
      return {
        loading:false,
        Gloading: false,
        NotDis:false,
        title: window.localStorage.saastitle ? window.localStorage.saastitle : '',
        dialogVisible: false,
        dialogVisible2: false,
        form: {
          name: '',
          duration: '',
          passrate: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入考试名称', trigger: 'blur' }
          ],
          passrate: [
            // { required: true, message: '请输入及格线', trigger: 'blur' },
            { validator: checkPassrate, trigger: 'blur' }
          ],
          duration: [
            { required: true, message: '请设置考试时长' },
            { validator: checkDuration, trigger: 'blur' }
          ]
        },
        plist: [],
        titlename: '选择题目',
        titlename2: '查看题目',
        searchTxt1: '',
        searchTxt2: '',
        searchTxt3: '',
        currentIndex: '0',
        radio: '0',
        List: [],
        subjectList: [],
        confirmSubjectList: [],
        checkedSubject: [],
        hackReset: false,
        subjectType1: '',
        subjectType2: '',
        subjectType3: '',
        subjectType4: '',
        subjectType5: '',
        singleScore: 0,
        totalType1: 0,
        totalType2: 0,
        totalType3: 0,
        totalType4: 0,
        totalType5: 0
      }
    },
    beforeCreate:function(){
      if(window.localStorage.getItem('saasLoginTrueOrFalse')==='false' || window.localStorage.getItem('saasLoginTrueOrFalse')===null){
        this.$router.push('/Login');
      }
    },
    beforeDestroy(){
      window.localStorage.removeItem('saastitle')
    },
    mounted(){
      getexample({pgPageNum:0}).then(data=>{
        if(data.resList) this.List = data.resList;
      })
    },
    computed:{
      totalScore(){ return this.totalType1 + this.totalType2 + this.totalType3 + this.totalType4 + this.totalType5; },
      total(){
        var sum;
        this.confirmSubjectList.forEach(item=>{
          sum += parseInt(item.score);
        });
        return sum||0;
      }
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
      GOBack(){
        this.$router.push('Paper_List');
      },
      hack(){
        this.hackReset = false; // hack方法强制刷新组件
        this.$nextTick(() => {
          this.hackReset = true;
        })
      },
      OnAddPaper(){
        // console.log(this.form);
        this.plist = [];
        if(this.form.name=='') return this.openError('试卷名称不能为空');
        if(this.form.duration=='') return this.openError('考试时长不能为空');
        if(this.confirmSubjectList.length==0) return this.openError('考试题目不能为空，请从题库中导入相关题目');
        if(this.form.passrate=='') return this.openError('考试及格线不能为空');
        if(this.subjectType1==''){ if(this.checkedSubject.filter(function(e){return e.type==1;}).length!=0) return this.openError('请设置单选题每题分值'); }
        if(this.subjectType3==''){ if(this.checkedSubject.filter(function(e){return e.type==3;}).length!=0) return this.openError('请设置多选题每题分值'); }
        if(this.subjectType2==''){ if(this.checkedSubject.filter(function(e){return e.type==2;}).length!=0) return this.openError('请设置判断题每题分值'); }
        if(this.subjectType4==''){ if(this.checkedSubject.filter(function(e){return e.type==4;}).length!=0) return this.openError('请设置填空题每题分值'); }
        if(this.subjectType5==''){ if(this.checkedSubject.filter(function(e){return e.type==5;}).length!=0) return this.openError('请设置问答题每题分值'); }
        // if(this.subjectType5==''&&this.checkedSubject.filter(function(e){return e.type==5;}).length!=0){ this.openError('请设置问答题每题分值'); }
        this.confirmSubjectList.forEach(item=>{
          if(item.type==1&&this.subjectType1!=''){ this.plist.push({id:parseInt(item.id), score:parseInt(this.subjectType1)}); }
          if(item.type==2&&this.subjectType2!=''){ this.plist.push({id:parseInt(item.id), score:parseInt(this.subjectType2)}); }
          if(item.type==3&&this.subjectType3!=''){ this.plist.push({id:parseInt(item.id), score:parseInt(this.subjectType3)}); }
          if(item.type==4&&this.subjectType4!=''){ this.plist.push({id:parseInt(item.id), score:parseInt(this.subjectType4)}); }
          if(item.type==5&&this.subjectType5!=''){ this.plist.push({id:parseInt(item.id), score:parseInt(this.subjectType5)}); }
        });
        this.confirmSubjectList.forEach(item=>{
          if(item.score && item.score!=0){
            this.plist.forEach(i=>{ if(i.id==item.id){ i.score = item.score; } });
          }
          else return this.openError('请设置 “'+item.content.slice(0,20)+'” 的分值');
        });
        // console.log('this.plist');
        // console.log(JSON.stringify(this.plist));
        if(this.plist==[]) return this.openError('考试题目不能为空，请从题库中导入相关题目');

        addPaper(this.form, this.plist).then(data=>{
          if(data.success){
            this.openSuccess(data.resMsg);
            this.$router.push('Paper_List');
          }
          else{ this.openError(data.resMsg); }
        });
      },
      getCurrentSub(){
        if(this.currentIndex){
          window.sessionStorage.setItem('saasTestid',this.currentIndex);
          var params = { content: '',pgPageNum:0 };
          getproblems(params).then(data=>{
            this.subjectList = data.resList;
            if(this.checkedSubject.length!=0 && this.subjectList){
              this.subjectList.forEach(item=>{
                item.isCheck = false;
                if(this.checkedSubject!=''){
                  this.checkedSubject.forEach(i=>{
                    if(i.id==item.id){
                      if(i.status==11||i.status==12) item.isCheck = true;
                    }
                  });
                }
              });
            }
          });
        }
        this.hack();
      },
      ImportSubject(){
        this.dialogVisible = true;
        this.getCurrentSub();
        this.hack();
      },
      confirmSubject(){
        var index = 0;
        this.checkedSubject.forEach(item=>{
          item.index = index;
          index++;

          this.setDisabled();
          if(item.type==1&&this.subjectType1!=''&&item.score==0){
            item.score=this.subjectType1; document.getElementById(item.id.toString()).value = this.subjectType1;
          }
          if(item.type==2&&this.subjectType2!=''&&item.score==0){
            item.score=this.subjectType2; document.getElementById(item.id.toString()).value = this.subjectType2;
          }
          if(item.type==3&&this.subjectType3!=''&&item.score==0){
            item.score=this.subjectType3; document.getElementById(item.id.toString()).value = this.subjectType3;
          }
          if(item.type==4&&this.subjectType4!=''&&item.score==0){
            item.score=this.subjectType4; document.getElementById(item.id.toString()).value = this.subjectType4;
          }
          if(item.type==5&&this.subjectType5!=''&&item.score==0){
            item.score=this.subjectType5; document.getElementById(item.id.toString()).value = this.subjectType5;
          }

          if(item.status == 12) item.status = 11;
          if(item.status == 13) {
            this.checkedSubject.splice(this.checkedSubject.indexOf(item),1);
            // console.log('删除');
          }
        });
        this.confirmSubjectList = this.checkedSubject;

        // 重新计算题目总分
        this.totalType1=0, this.totalType2=0, this.totalType3=0, this.totalType4=0, this.totalType5=0;
        this.confirmSubjectList.forEach(item=>{
          // this.totalScore += parseInt(item.score);
          if(item.type==1){ this.totalType1 += parseInt(item.score); }
          if(item.type==2){ this.totalType2 += parseInt(item.score); }
          if(item.type==3){ this.totalType3 += parseInt(item.score); }
          if(item.type==4){ this.totalType4 += parseInt(item.score); }
          if(item.type==5){ this.totalType5 += parseInt(item.score); }

          // 设置题目是否可以上移/下移
          if(this.checkedSubject.indexOf(item)==0){ item.disabledPre = true; }
          else { item.disabledPre = false; }
          if(this.checkedSubject.indexOf(item)==this.checkedSubject.length-1) item.disabledNext = true;
          else { item.disabledNext = false; }
        });
        this.dialogVisible = false;
      },
      setScore(item){
        var id = item.id.toString();
        if(item.score==0) this.singleScore += parseInt(document.getElementById(id).value);
        else{
          this.singleScore += parseInt(document.getElementById(id).value) - parseInt(item.score);
        }
        item.score = document.getElementById(id).value;

        this.totalType1=0, this.totalType2=0, this.totalType3=0, this.totalType4=0, this.totalType5=0;
        this.confirmSubjectList.forEach(item=>{
          // this.totalScore += parseInt(item.score);
          if(item.type==1){ this.totalType1 += parseInt(item.score); }
          if(item.type==2){ this.totalType2 += parseInt(item.score); }
          if(item.type==3){ this.totalType3 += parseInt(item.score); }
          if(item.type==4){ this.totalType4 += parseInt(item.score); }
          if(item.type==5){ this.totalType5 += parseInt(item.score); }
        });
      },
      setScoreEvery(index,type){
        // this.totalScore = 0;
        if(type==1){ this.totalType1 = 0; }
        if(type==2){ this.totalType2 = 0; }
        if(type==3){ this.totalType3 = 0; }
        if(type==4){ this.totalType4 = 0; }
        if(type==5){ this.totalType5 = 0; }
        this.confirmSubjectList.forEach(item=>{
          if(item.type==type){
            item.score = parseInt(document.getElementById(index).value);
            var id = item.id.toString();
            document.getElementById(id).value = document.getElementById(index).value;
          }
          if(item.type==1&&type==1){ this.totalType1 += item.score; }
          if(item.type==2&&type==2){ this.totalType2 += item.score; }
          if(item.type==3&&type==3){ this.totalType3 += item.score; }
          if(item.type==4&&type==4){ this.totalType4 += item.score; }
          if(item.type==5&&type==5){ this.totalType5 += item.score; }
          // this.totalScore += parseInt(item.score);
        });
      },
      setDisabled(){
        // 设置第一个item上移按钮和最后一个item下移按钮为禁用状态
        this.checkedSubject.forEach(item=>{
          if(this.checkedSubject.indexOf(item)==0){ item.disabledPre = true; }
          else { item.disabledPre = false; }
          if(this.checkedSubject.indexOf(item)==this.checkedSubject.length-1) item.disabledNext = true;
          else { item.disabledNext = false; }
        });
      },
      sortByIndex(a,b){
        return a.index-b.index;
      },  // result.sort(sortId);
      up(item){
        if(this.checkedSubject.indexOf(item)>-1){
          if(this.checkedSubject.indexOf(item)!=0){
            var itemPre = this.checkedSubject[this.checkedSubject.indexOf(item) - 1];
            var temp = itemPre.index;
            itemPre.index = item.index;
            item.index = temp;

            var id1 = itemPre.id.toString();
            var id2 = item.id.toString();
            document.getElementById(id1).value = '';
            document.getElementById(id2).value = '';
            document.getElementById(id1).value = item.score;
            document.getElementById(id2).value = itemPre.score;
          }
        }
        this.confirmSubjectList.sort(this.sortByIndex);
        this.setDisabled();
      },
      down(item){
        if(this.checkedSubject.indexOf(item)>-1){
          if(this.checkedSubject.indexOf(item)!=this.checkedSubject.length-1){
            var itemNext = this.checkedSubject[this.checkedSubject.indexOf(item) + 1];
            var temp = itemNext.index;
            itemNext.index = item.index;
            item.index = temp;

            var id1 = itemNext.id.toString();
            var id2 = item.id.toString();
            document.getElementById(id1).value = '';
            document.getElementById(id2).value = '';
            document.getElementById(id1).value = item.score;
            document.getElementById(id2).value = itemNext.score;
          }
        }
        this.confirmSubjectList.sort(this.sortByIndex);
        this.setDisabled();
      },
      showMore(){
        // console.log(this.checkedSubject);
        this.checkedSubject.forEach(item=>{
          if(item.status==10){ item.statusName = '原有';}
          if(item.status==11 || item.status==12){ item.statusName = '新添加';}
        });
        this.dialogVisible2 = true;
      },
      confirmShow(){
        for(var i=0; i<this.checkedSubject.length; i++){
          var item = this.checkedSubject[i];
          if(item.status==120||item.status==110||item.status==130) {
            this.checkedSubject.splice(i,1);
            i--;
          }
        }
        this.getCurrentSub();
        this.dialogVisible2 = false;
      },
      closeDialog(){
        for(var i=0; i<this.checkedSubject.length; i++){
          var item = this.checkedSubject[i];
          if(item.status == 12) {
            this.checkedSubject.splice(i,1);
            i--;
          }
          if(item.status == 13) {
            item.status = 11;
          }
        }
        this.dialogVisible = false;
      },
      closeDialog2(){
        for(var i=0; i<this.checkedSubject.length; i++){
          var item = this.checkedSubject[i];
          if(item.status == 120) { item.status = 12; }
          if(item.status == 110) { item.status = 11; }
          if(item.status == 130) { item.status = 13; }
        }
        this.getCurrentSub();
        this.dialogVisible2 = false;
      },
      checkIndex(item){
        // 11：新添加, 110：新添加待删除
        // 12：新添加未确定, 120：新添加未确定待删除
        // 13：新添加待取消, 130：新添加待取消待删除
        this.subjectList = [];
        this.currentIndex = item.id;
        this.getCurrentSub();
      },
      checkSubject(item){
        item.score = 0;
        if(item.type==1){ item.typeName='单选题'; }
        if(item.type==2){ item.typeName='是非题'; }
        if(item.type==3){ item.typeName='多选题'; }
        if(item.type==4){ item.typeName='填空题'; }
        if(item.type==5){ item.typeName='问答题'; }
        if(!item.isCheck){
          item.isCheck = true;
          item.status = 12;
          if(this.checkedSubject.indexOf(item)<0) this.checkedSubject.push(item);
        }
        else{
          item.isCheck = false;
          this.checkedSubject.forEach(i=>{
            if(i.id==item.id){
              i.status = 13;
            }
          });
        }
      },
      clearSubject(item){
        if(item.status==12) item.status = 120;
        if(item.status==11) item.status = 110;
        if(item.status==13) item.status = 130;
        this.hack();
      }
    }
  }
</script>
<style>
.asd{
  cursor: pointer;
}
</style>
