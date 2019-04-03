<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95" v-if="pagename==='' || pagename === null">题目管理</div>
    <div class="TopName W95" v-else><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GoTestList"></i>{{pagename}}</div>
  </div>
  <div class="TopLine">
    <div style="display:none">{{qwe}}</div>
  </div>
  <div class="TopButtonT W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addproblemsclick()" style="width:100px" v-if="pagename==='' || pagename === null">添加题目</el-button>
      <el-button type="primary" @click="RelevanceProblemsClick()" style="width:100px" v-else>关联题目</el-button>
    </span>
    <div class="TopButtonRight4">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="题目名称" @input="getproblemsnull" @keydown="show($event)" />
      <label class="el-icon-search TopButtonRightSearch" @click="Ongetproblems(searchTxt,0)"></label>
    </div>
  </div>
  <div id="TableDiv" class="W95 Teacher_List_Table">
    <el-table :data="Page.resList" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
      <el-table-column prop="id" label="id" width="200">
      </el-table-column>
      <el-table-column prop="content" label="题目名称">
      </el-table-column>
      <el-table-column prop="updatetime" label="最后操作时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="addproblemsclick2(scope.row.id)">编辑</el-button>
          <el-button type="text" v-if="pagename===''|| pagename === null" @click="Ondelproblems(scope.row.id)">删除</el-button>
          <el-button type="text" v-else @click="OndelwarehouseStorage(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination style="margin-right:20px;float:right;" :page-size="10" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="Page.pgTotalCount">
  </el-pagination>

  <el-dialog :visible.sync="dialogVisible" :title="titlename" top="5%" @close="closeDialog">
    <div style="width:100%;border:1px solid #cdcdcd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-top:10px;" label-width="12px">
        <el-form-item style="width:100%;">
          <el-radio-group v-model="radio1">
            <el-radio-button label="1" :disabled="disable1"><template>
                <div @click="cleanRuleForm('1')" style="width:98px;height:20px;line-height:20px">单选题</div>
              </template></el-radio-button>
            <el-radio-button label="2" :disabled="disable2"><template>
                <div @click="cleanRuleForm('2')" style="width:98px;height:20px;line-height:20px">是非题</div>
              </template></el-radio-button>
            <el-radio-button label="3" :disabled="disable3"><template>
                <div @click="cleanRuleForm('3')" style="width:98px;height:20px;line-height:20px">多选题</div>
              </template></el-radio-button>
            <el-radio-button label="4" :disabled="true"><template>
                <div style="width:98px;height:20px;line-height:20px">填空题</div>
              </template></el-radio-button>
            <el-radio-button label="5" :disabled="true"><template>
                <div style="width:98px;height:20px;line-height:20px">问答题</div>
              </template></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div style="margin-left:12px;margin-top:0px">题目内容</div>
        <el-form-item style="width:calc(100% - 12px);margin-top:20px" prop="inputName">
          <el-input type="textarea" :rows="2" v-model="ruleForm.inputName" placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <div style="margin-left:12px;margin-top:0px">题目选项</div>
        <el-form-item id="ChoeseItem" style="width:calc(100% - 12px);margin-top:2px" prop="inputAll">
          <el-input placeholder="请输入内容" v-for="(iA,index) in ruleForm.inputAll" :key="index" :disabled="radio1 === '2'" v-model="iA.content" style="width:calc(100% - 40px);margin-top:10px;">
            <template slot="prepend">{{iA.inputItem}}</template>
          </el-input>
          <el-button type="text" style="margin-left:10px" :disabled="ruleForm.inputAll.length === 2 || radio1 === '2'" @click="DelItem">删除</el-button>
        </el-form-item>
        <el-form-item style="width:calc(100% - 12px);" v-if="radio1 !== '2'">
          <img src="@/static/img/add.png" style="margin-left:calc(50% - 16px);cursor: pointer;" @click="AddItem" />
        </el-form-item>
        <div style="margin-left:12px;">题目答案</div>
        <el-form-item style="width:calc(100% - 12px);margin-top:10px" v-if="radio1==='1'||radio1==='2'" prop="redioChoese">
          <el-radio-group v-model="ruleForm.redioChoese">
            <el-radio v-for="(iA,index) in ruleForm.inputAll" :label="iA.inputItem" :key="index">{{iA.inputItem}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="width:calc(100% - 12px);margin-top:10px" v-if="radio1==='3'" prop="checkboxChoese">
          <el-checkbox-group v-model="ruleForm.checkboxChoese">
            <el-checkbox v-for="(iA,index) in ruleForm.inputAll" :label="iA.inputItem" :key="index">{{iA.inputItem}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div style="margin-left:12px;margin-top:0px">答案解析</div>
        <el-form-item style="width:calc(100% - 12px);margin-top:20px">
          <el-input type="textarea" :rows="2" v-model="ruleForm.inputDetails" placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item style="width:calc(100% - 12px);margin-top:10px">
          <el-button v-if="AddOrUpd" style="margin-left:calc(50% - 70px);width:140px" @click="Onaddproblems('ruleForm')">保存并提交</el-button>
          <el-button v-else style="margin-left:calc(50% - 70px);width:140px" @click="Onupdproblems('ruleForm')">保存并提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible2" size="small" title="题目选择" @close="closeDialog2">
    <div style="width:100%;height:350px;border:1px solid #cdcdcd;">
      <div class="TopButton2 W95" style="padding-top:10px">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" placeholder="请输入关键字" v-model="searchTxt2" v-on:input="getwarehouseproblemsnull" @keydown="show($event)" /><label class="el-icon-search TopButtonRightSearch" @click="Ongetwarehouseproblems(searchTxt2,0)"></label>
          <el-button type="primary" size="small" @click="addproblemsclick()">添加题目</el-button>
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 98px);margin-top:10px;margin-left:2%">

        <div style="width:100%;height:100%;border:1px solid #cdcdcd;overflow-y: auto">
          <div style="width:70%;height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc;border-right:1px solid #cdcdcd;">题目内容</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc;border-right:1px solid #cdcdcd;" v-for="data in Page2.resList" class="Over">{{data.content}}</div>
          </div>
          <div style="width:calc(30% - 1px);height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc">选择</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc" v-for="data in Page2.resList">
              <input name="Fruit" type="CheckBox" :value="data.id" :id="'checkbox'+data.id" :checked="data.whStorage!==undefined" @change="ChangeCheck(data.id,data.whStorage)" />
            </div>
          </div>
        </div>
      </div>
      <!-- <not-content v-if="NotDis2"></not-content> -->
      <el-pagination style="margin-right:20px;float:right;margin-top:6px" :page-size="Page2.pgLimit" @current-change="handleCurrentChange2" layout="prev, pager, next, jumper" :total="Page2.pgTotalCount">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible2 = false">完成</el-button>
      <!-- <el-button type="primary" @click="">提 交</el-button> -->
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getOneproblems,
  delproblems,
  delwarehouseStorage,
  addproblems,
  getproblems,
  updproblems,
  getwarehouseproblems,
  addwarehouseproblems
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
import {
  formatDate
} from '@/util/util';
export default {
  data() {
    var validateIT = (rule, value, callback) => {
      for (var i = 0; i < value.length; i++) {
        if (value[i].content === '') {
          return callback(new Error('选项不能为空'));
        }
      }
      return callback();
    };
    var validateCC = (rule, value, callback) => {
      // console.log(value);
      if (value.length !== 0) {
        return callback();
      } else {}
    };
    return {
      StorageID: '',
      StoragepaList: [],
      titlename: '添加题目',
      AddOrUpd: true,
      NotDis: false,
      data: [],
      pagename: window.sessionStorage.getItem('saasTestname'),
      mobile: '',
      tof: '',
      Gloading: true,
      dialogVisible: false,
      dialogVisible2: false,
      radio1: '1',
      disable1: false,
      disable2: false,
      disable3: false,
      searchTxt: '',
      searchTxt2: '',
      Page: '',
      Page2: '',
      qwe: 0,
      ruleForm: {
        updateId: '',
        inputName: '',
        inputAll: [{
            inputItem: 'A',
            content: ''
          },
          {
            inputItem: 'B',
            content: ''
          }
        ],
        redioChoese: '',
        inputDetails: '',
        checkboxChoese: []
      },

      rules: {
        inputName: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }],
        inputAll: [{
          validator: validateIT,
          trigger: 'blur'
        }],
        redioChoese: [{
          required: true,
          message: '请选择正确答案',
          trigger: 'click'
        }],
        checkboxChoese: [{
          validator: validateCC,
          trigger: 'click'
        }]
      }
    }
  },
  components: {
    NotContent
  },
  watch: {
    '$route': function(route) {
      window.sessionStorage.removeItem("saasTestid");
      window.sessionStorage.removeItem("saasTestname");
      this.pagename = '';
      this.searchTxt = '';
      if (route.fullPath === '/Topic_List') {
        if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
          this.$router.push('/Login');
        } else {
          var loginParams = {
            content: '',
            pgPageNum: 0
          };
          getproblems(loginParams).then(data => {
            this.Page = data;
            // console.log(data);
            if (data.resList !== undefined) {
              this.NotDis = false;
              for (var i = 0; i < this.Page.resList.length; i++) {
                var date = new Date(this.Page.resList[i].updateTime);
                this.Page.resList[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            } else {
              this.Page = {};
              this.NotDis = true;
            }
            this.Gloading = false;
          })
        }
      }
    },
  },
  beforeDestroy: function() {
    window.sessionStorage.removeItem("saasTestid");
    window.sessionStorage.removeItem("saasTestname");
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false') {
      this.$router.push('/Login');
    }
  },
  async mounted() {
    await this.Ongetproblems('', 0)
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
    GoTestList() {
      window.sessionStorage.removeItem("saasTestid");
      window.sessionStorage.removeItem("saasTestname");
      this.pagename = '';
      this.searchTxt = '';
      this.qwe++;
      this.$router.push('/Test_List');
    },
    Onupdproblems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.radio1 === '1' || this.radio1 === '2') {
            for (var i = 0; i < this.ruleForm.inputAll.length; i++) {
              this.ruleForm.inputAll[i].status = 0;
              this.ruleForm.inputAll[i].istrue = 0;
              if (this.ruleForm.redioChoese === this.ruleForm.inputAll[i].inputItem) {
                this.ruleForm.inputAll[i].istrue = 1;
              }
            }
            // var array1 = [ {"Num": "A "  },{"Num": "B" }];
            // var array2 = [ {"Num": "A ","Name": "t1 " }, {"Num": "B","Name": "t2"}, {"Num": "C " ,"Name": "t3 "}];
            var result = [];
            for (var i = 0; i < this.StoragepaList.length; i++) {
              var obj = this.StoragepaList[i];
              var id = obj.id;
              var isExist = false;
              for (var j = 0; j < this.ruleForm.inputAll.length; j++) {
                var aj = this.ruleForm.inputAll[j];
                var n = aj.id;
                if (n == id) {
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                result.push(obj);
              }
            }
            for (var k = 0; k < result.length; k++) {
              this.ruleForm.inputAll[this.ruleForm.inputAll.length + k] = {
                id: result[k].id
              };
            }
            // console.log(this.ruleForm.inputAll);
          } else if (this.radio1 === '3') {
            for (var i = 0; i < this.ruleForm.inputAll.length; i++) {
              this.ruleForm.inputAll[i].status = 0;
              this.ruleForm.inputAll[i].istrue = 0;
              for (var j = 0; j < this.ruleForm.checkboxChoese.length; j++) {
                if (this.ruleForm.checkboxChoese[j] === this.ruleForm.inputAll[i].inputItem) {
                  this.ruleForm.inputAll[i].istrue = 1;
                }
              }
            }
          }
          var loginParams = {
            id: this.ruleForm.updateId,
            content: this.ruleForm.inputName,
            contentType: 1,
            type: this.radio1,
            answerParsing: this.ruleForm.inputDetails,
            status: 0,
            paList: this.ruleForm.inputAll
          };
          // console.log(loginParams);
          updproblems(loginParams).then(data => {
            // console.log(data);
            if (data.success) {
              this.dialogVisible = false;
              this.Ongetproblems();
            } else {
              this.openError(data.resMsg);
            }
          })
          // console.log(this.ruleForm.inputAll);
        } else {
          return false;
        }
      });
    },
    Onaddproblems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.radio1 === '1' || this.radio1 === '2') {
            for (var i = 0; i < this.ruleForm.inputAll.length; i++) {
              this.ruleForm.inputAll[i].status = 0;
              this.ruleForm.inputAll[i].istrue = 0;
              if (this.ruleForm.redioChoese === this.ruleForm.inputAll[i].inputItem) {
                this.ruleForm.inputAll[i].istrue = 1;
              }
            }
          } else if (this.radio1 === '3') {
            for (var i = 0; i < this.ruleForm.inputAll.length; i++) {
              this.ruleForm.inputAll[i].status = 0;
              this.ruleForm.inputAll[i].istrue = 0;
              for (var j = 0; j < this.ruleForm.checkboxChoese.length; j++) {
                if (this.ruleForm.checkboxChoese[j] === this.ruleForm.inputAll[i].inputItem) {
                  this.ruleForm.inputAll[i].istrue = 1;
                }
              }
            }
          }
          var loginParams = {
            content: this.ruleForm.inputName,
            contentType: 1,
            type: this.radio1,
            answerParsing: this.ruleForm.inputDetails,
            status: 0,
            paList: this.ruleForm.inputAll
          };
          // console.log(loginParams);
          addproblems(loginParams).then(data => {
            // console.log(data);
            if (data.success) {
              this.dialogVisible = false;
              this.Ongetproblems();
            } else {
              this.openError(data.resMsg);
            }
          })
          // console.log(this.ruleForm.inputAll);
        } else {
          return false;
        }
      });
    },
    AddItem() {
      var Textitem = '';
      switch (this.ruleForm.inputAll.length) {
        case undefined:
          {
            Textitem = 'A'
          };
        case 1:
          {
            Textitem = 'B'
          }
          break;
        case 2:
          {
            Textitem = 'C'
          }
          break;
        case 3:
          {
            Textitem = 'D'
          }
          break;
        case 4:
          {
            Textitem = 'E'
          }
          break;
        case 5:
          {
            Textitem = 'F'
          }
          break;
        case 6:
          {
            Textitem = 'G'
          }
          break;
        case 7:
          {
            Textitem = 'H'
          }
          break;
        case 8:
          {
            Textitem = 'I'
          }
          break;
        case 9:
          {
            Textitem = 'J'
          }
          break;
        default:
          this.openError('最多只能有十个选项');
      }
      if (Textitem !== '') {
        this.ruleForm.inputAll.push({
          eqid: this.StorageID,
          inputItem: Textitem,
          content: ''
        });
      }
    },
    DelItem() {
      this.ruleForm.inputAll.pop();
    },
    ChangeTitle() {
      this.cleanRuleForm(this.radio1);
    },
    cleanRuleForm(type) {
      var count = 0;
      if (this.disable1) {
        count++;
      }
      if (this.disable2) {
        count++;
      }
      if (this.disable3) {
        count++;
      }
      if (count < 2) {
        if (type === '1') {
          this.ruleForm.inputAll = [{
              inputItem: 'A',
              content: ''
            },
            {
              inputItem: 'B',
              content: ''
            }
          ];
        } else if (type === '2') {
          this.ruleForm.inputAll = [{
              inputItem: 'A',
              content: '正确'
            },
            {
              inputItem: 'B',
              content: '错误'
            }
          ];
        } else if (type === '3') {
          this.ruleForm.inputAll = [{
              inputItem: 'A',
              content: ''
            },
            {
              inputItem: 'B',
              content: ''
            }
          ];
        }
        this.radio1 = type;
        this.ruleForm.inputName = '';
        this.ruleForm.redioChoese = '';
        this.ruleForm.inputDetails = '';
        this.ruleForm.checkboxChoese = [];
      }
      // console.log(this.ruleForm);
    },
    RelevanceProblemsClick() {
      getwarehouseproblems({
        content: '',
        pgPageNum: 0
      }).then(data => {
        this.Page2 = data;
        // console.log(data);
        if (data.resList !== undefined) {
          this.Page2.resList = data.resList;
        } else {
          this.openError(data.resMsg);
        }
      })
      this.dialogVisible2 = true;
    },
    addproblemsclick() {
      this.disable1 = false;
      this.disable2 = false;
      this.disable3 = false;
      this.cleanRuleForm('1');
      this.titlename = '添加题目';
      this.AddOrUpd = true;
      this.dialogVisible = true;
    },
    addproblemsclick2(id) {
      this.ruleForm.inputAll = []; // add, 清空编辑前一道题目时可能存在的选项和答案遗留问题
      this.StorageID = id;
      this.StoragepaList = [];
      this.cleanRuleForm('1');
      this.titlename = '修改题目';
      this.AddOrUpd = false;
      this.dialogVisible = true;
      getOneproblems(id).then(data => {
        this.StoragepaList = data.paList;
        this.ruleForm.checkboxChoese = [];
        for (var i = 0; i < data.paList.length; i++) {
          switch (i) {
            case 0:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'A',
                  content: '',
                  id: ''
                }
              }
              break;
            case 1:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'B',
                  content: '',
                  id: ''
                }
              }
              break;
            case 2:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'C',
                  content: '',
                  id: ''
                }
              }
              break;
            case 3:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'D',
                  content: '',
                  id: ''
                }
              }
              break;
            case 4:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'E',
                  content: '',
                  id: ''
                }
              }
              break;
            case 5:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'F',
                  content: '',
                  id: ''
                }
              }
              break;
            case 6:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'G',
                  content: '',
                  id: ''
                }
              }
              break;
            case 7:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'H',
                  content: '',
                  id: ''
                }
              }
              break;
            case 8:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'I',
                  content: '',
                  id: ''
                }
              }
              break;
            case 9:
              {
                this.ruleForm.inputAll[i] = {
                  inputItem: 'J',
                  content: '',
                  id: ''
                }
              }
              break;
            default:
              this.openError('最多只能有十个选项');
          }
          this.ruleForm.inputAll[i].content = data.paList[i].content;
          this.ruleForm.inputAll[i].id = data.paList[i].id;
          if (data.type === 1 && data.paList[i].istrue === 1) {
            this.ruleForm.redioChoese = this.ruleForm.inputAll[i].inputItem;
          } else if (data.type === 2 && data.paList[i].istrue === 1) {
            this.ruleForm.redioChoese = this.ruleForm.inputAll[i].inputItem;
          } else if (data.type === 3 && data.paList[i].istrue === 1) {
            this.ruleForm.checkboxChoese[this.ruleForm.checkboxChoese.length] = this.ruleForm.inputAll[i].inputItem;
            // console.log(this.ruleForm.checkboxChoese);
          }
        }
        this.ruleForm.updateId = data.id;
        this.ruleForm.inputName = data.content + '';
        this.ruleForm.inputDetails = data.answerParsing == undefined ? '' : data.answerParsing;
        this.radio1 = data.type + '';
        if (this.radio1 === '1') {
          this.disable1 = false;
          this.disable2 = true;
          this.disable3 = true;
        } else if (this.radio1 === '2') {
          this.disable1 = true;
          this.disable2 = false;
          this.disable3 = true;
        } else if (this.radio1 === '3') {
          this.disable1 = true;
          this.disable2 = true;
          this.disable3 = false;
        }
      })
    },
    Ondelproblems(id) {
      this.$confirm('确定删除该题目?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delproblems(id).then(data => {
          if (data.success) {
            for (var i in this.Page.resList) {
              if (this.Page.resList[i].id === id) {
                this.Page.resList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});
    },
    OndelwarehouseStorage(id) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var loginParams = {
          problems: id
        };
        delwarehouseStorage(loginParams).then(data => {
          if (data.success) {
            for (var i in this.Page.resList) {
              if (this.Page.resList[i].id === id) {
                this.Page.resList.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});
    },
    closeDialog() {
      // this.ruleForm.inputName = '';
      // this.ruleForm.redioChoese = '';
      // this.ruleForm.inputDetails = '';
      // this.ruleForm.checkboxChoese = [];
      if (this.dialogVisible2) {
        this.Ongetwarehouseproblems();
      }
    },
    closeDialog2() {
      this.Ongetproblems();
    },
    Ongetproblems(txt, num) {
      getproblems({
        content: txt,
        pgPageNum: num
      }).then(data => {
        // console.log(data);
        if (data.success && data.resList) {
          this.Page = data;
          this.NotDis = false;
          this.Page.resList = data.resList.filter(function(e) {
            return e != null;
          });
          for (var i = 0; i < this.Page.resList.length; i++) {
            let item = this.Page.resList[i];
            if (item != null) {
              var date = new Date(item.updateTime);
              item.updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.Page = {}
          this.NotDis = true;
        }
        this.Gloading = false;
      });
    },
    Ongetwarehouseproblems(txt, num) {
      getwarehouseproblems({
        content: txt,
        pgPageNum: num
      }).then(data => {
        // console.log(data);
        if (data.success && data.resList) {
          this.Page2 = data;
          this.Page2.resList = data.resList;
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    ChangeCheck(id, whStorage) {
      document.getElementById('checkbox' + id).disabled = true;
      if (whStorage === undefined) {
        var loginParams = {
          problems: id
        };
        addwarehouseproblems(loginParams).then(data => {
          // console.log(data);
          document.getElementById('checkbox' + id).disabled = false;
          if (data.success) {
            for (var i = 0; i < this.Page2.resList.length; i++) {
              if (this.Page2.resList[i].id === id) {
                this.Page2.resList[i].whStorage = '';
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      } else {
        var loginParams = {
          problems: id
        };
        delwarehouseStorage(loginParams).then(data => {
          // console.log(data);
          document.getElementById('checkbox' + id).disabled = false;
          if (data.success) {
            document.getElementById('checkbox' + id).disabled = false;
            for (var i = 0; i < this.Page2.resList.length; i++) {
              if (this.Page2.resList[i].id === id) {
                this.Page2.resList[i].whStorage = undefined;
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    getwarehouseproblemsnull() {
      if (this.searchTxt2 === '') {
        this.Ongetwarehouseproblems('', 0);
      }
    },
    getproblemsnull() {
      this.Ongetproblems(this.searchTxt, 0);
    },
    show(ev) {
      if (ev.keyCode === 13) {
        if (this.dialogVisible2) {
          this.Ongetwarehouseproblems(this.searchTxt2, 0);
        } else {
          this.Ongetproblems(this.searchTxt, 0);
        }
      }
    },
    handleCurrentChange(currentPage) {
      if (this.Page.resList) {
        this.Ongetproblems(this.searchTxt, currentPage);
      }
    },
    handleCurrentChange2(currentPage) {
      this.Ongetwarehouseproblems(this.searchTxt2, currentPage);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.asd {
  cursor: pointer;
}
</style>
