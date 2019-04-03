<template>
<div style="width:100%;height:100%;">
  <div class="TopButton W95">
    <span class="TopButtonLeft">
      <el-button type="primary" @click="addhomeclick">添加板块</el-button>
    </span>
    <div class="TopButtonRight">
      <!-- <input class="TopButtonRightInput" type="text" placeholder="请输入关键字" /><label class="el-icon-search TopButtonRightSearch"></label> -->
    </div>
  </div>
  <div class="W95" style="height:calc(100% - 80px);margin-top:10px;overflow:auto;">
    <div style="width:calc(100% - 8px);" v-for="data in tableData">
      <div v-bind:class="{ checkcolor: data.tofclass }" :id="data.id" style="width:calc(100% - 8px);height:40px;line-height:40px;text-indent:10px;position: relative;cursor: pointer;">
        <div style="float:left;width:calc(100% - 300px);" @click="changedis(data.id)">
          <i v-if="data.tof" class="el-icon-arrow-down" style="text-align: center;padding-right:10px;cursor: pointer;"></i>
          <i v-else class="el-icon-arrow-right" style="text-align: center;padding-right:10px;cursor: pointer;"></i>
          <span>
            <span v-if="data.templet===1">【视频】 </span>
            <!-- <span v-if="data.templet===2">【列表】 </span>
                <span v-if="data.templet===3">【专辑】 </span>
                <span v-if="data.templet===4">【书籍】 </span>
                <span v-if="data.templet===5">【宽横幅 - 不带文字】 </span>
                <span v-if="data.templet===6">【宽横幅 - 自带文字】 </span>
                <span v-if="data.templet===7">【窄横幅 - 不带文字】 </span>
                <span v-if="data.templet===8">【窄横幅 - 自带文字】 </span> -->
            <!-- 模板：1，视频、2，列表、3.专辑、4.书籍、5.宽横幅（不带文字、6.宽横幅（自带文字、7.窄横幅（不带文字）、8.窄横幅（自带文字 -->
            {{data.name}}
          </span>
          <div style="display:none">{{qwe}}</div>
        </div>
        <div style="position: absolute;top:0px;right:10px;">
          <span v-if="data.tofclass" style="z-index:10;position: relative;">
            <i class="el-icon-plus" style="margin-right:10px" @click="choeseCarousel(data)"></i>
            <i class="el-icon-edit" style="margin-right:50px" @click="updatehc(data.id,data.name,data.type)"></i>
            <img src="../../../../../static/img/sort-up.png" style="position: absolute;top:1px;left:80px;" @click="changesort(data.id,1)" title="上移" />
            <img src="../../../../../static/img/sort-down.png" style="position: absolute;top:1px;left:95px;" @click="changesort(data.id,2)" title="下移" />
            <i class="el-icon-delete" style="margin-right:10px" @click="deletehc(data.id)"></i>
          </span>
          <span>状态</span>
          <el-switch v-model="data.status" active-color="#13ce66" inactive-color="#ff4949" @change="ChangeStatus(data.id)"></el-switch>
        </div>
      </div>

      <div :id="data.id" v-for="fd in data.forData" v-if="data.tof">
        <div style="width:calc(100% - 58px);height:40px;line-height:40px;text-indent:40px;">{{fd.name}}</div>
        <div style="width:50px;line-height:40px;float:right;margin-top:-40px;height:40px;text-align: center;cursor: pointer;" @click="deletec(data.id,fd.id)">
          <i class="el-icon-delete" style="margin-right:10px;"></i>
        </div>
      </div>
    </div>
    <not-content v-if="NotDis"></not-content>
  </div>

  <el-dialog :visible.sync="dialogVisible" :title="ChangePlate" size="tiny">
    <div style="width:100%;height:200px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="版块名称">
          <el-input v-model="form.name" style="width:90%;" @keyup.enter.native="onaddhome" id="homename"></el-input>
        </el-form-item>
        <el-form-item label="版块类型">
          <el-radio v-model="radio" label="1">视频</el-radio>
          <!-- <el-radio v-model="radio" label="2">列表</el-radio>
                    <el-radio v-model="radio" label="3">专辑</el-radio>
                    <el-radio v-model="radio" label="4">书籍</el-radio>
                    <br/>
                    <el-radio v-model="radio" label="5">宽横幅(不带文字)</el-radio>
                    <el-radio v-model="radio" label="6">宽横幅(自带文字)</el-radio>
                    <br/>
                    <el-radio v-model="radio" label="7">窄横幅(不带文字)</el-radio>
                    <el-radio v-model="radio" label="8">窄横幅(自带文字)</el-radio> -->
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onaddhome">提 交</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogVisible2" size="small" :title="ThemeName+'选择'">
    <div style="width:100%;height:350px;border:1px solid #cdcdcd;">
      <div class="TopButton2 W95" style="padding-top:10px">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="getSearchInput">
          <el-button type="default" style="padding: 5px 10px;" @click="getSearchBtn">搜索</el-button>
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 100px);margin-top:10px;margin-left:2%">
        <el-table :data="ResourceData" border style="width: 100%" v-if="hackReset">
          <el-table-column prop="name" :label="ThemeName+'名称'">
          </el-table-column>
          <el-table-column prop="address" label="选择" width="200">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" @change="ChangeCheck(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="width:100%;height:100%;border:1px solid #cdcdcd;overflow-y: auto">
          <div style="width:70%;height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc;border-right:1px solid #000;">{{ThemeName}}名称</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc;border-right:1px solid #cdcdcd;" v-for="data in ResourceData">{{data.name}}</div>
          </div>
          <div style="width:calc(30% - 1px);height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc">选择</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc" v-for="data in ResourceData">
              <input name="Fruit" type="CheckBox" :value="data.id" :id="'checkbox'+data.id" :checked="data.hcid!==undefined" @change="ChangeCheck(data.id,data.hcid)" />
            </div>
          </div>
        </div> -->
      </div>
      <el-pagination style="margin-right:20px;float:right;margin-top:6px" :page-size="Page.pgLimit" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="Page.pgTotalCount">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible2 = false">完 成</el-button>
      <!-- <el-button type="primary" @click="choeseC">提 交</el-button> -->
    </span>
  </el-dialog>

</div>
</template>

<script>
import {
  gethome,
  addhome,
  gethomecourse,
  changehome,
  getHomeCourseAll,
  addhomecourse,
  delhome,
  delhomeCourse,
  changehomesort
} from '@/api/api';
import NotContent from '@/components/public/NotContent';
let id = 1000;
export default {
  data() {
    return {
      searchTxt: '',
      updtxt: '', //修改板块名时的板块名
      operateid: '', //选中板块时的id
      checkid: '', //添加ThemeName时选中的ThemeName.id
      checkname: '', //添加ThemeName时选中的ThemeName.name
      changeid: '', //修改ThemeName时所选择的ThemeName.id
      qwe: 1, //用于渲染页面的值
      ChangePlate: '',
      stateswitch: true,
      dialogVisible: false,
      dialogVisible2: false,
      tableData: [],
      ResourceData: [],
      Page: '',
      forData: [],
      form: [{
        id: '',
        name: ''
      }],
      NotDis: false,
      hackReset: true,
      radio: '1',
      datacourseList: [],
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    }
  },
  components: {
    NotContent
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      gethome().then(data => {
        this.NotDis = false;
        if (data.resCode === 0) {
          if (data.resList) {
            this.tableData = data.resList;
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].tof = false;
              this.tableData[i].tofclass = false;
              this.tableData[i].forData = [];
              if (this.tableData[i].status === 0) {
                this.tableData[i].status = true;
              } else {
                this.tableData[i].status = false;
              }
            }
          } else {
            this.NotDis = true;
          }
        } else {
          this.openError(data.resMsg);
          this.NotDis = true;
        }
        // console.log(this.tableData);
      });
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
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    //显示出添加板块的模态框
    addhomeclick() {
      this.ChangePlate = '添加板块'
      this.dialogVisible = true;
      this.form.name = '';
      setTimeout(function() {
        document.querySelector('#homename input').focus();
      }, 20);
    },
    //添加板块
    onaddhome: function() {
      if (this.ChangePlate === '添加板块') {
        var loginParams = {
          name: this.form.name,
          templet: this.radio
        };
        addhome(loginParams).then(data => {
          if (data.success) {
            this.dialogVisible = false;
            gethome().then(data => {
              if (data.resList !== undefined) {
                this.NotDis = false;
                // this.tableData = data.resList;
                this.tableData[this.tableData.length] = {
                  id: ''
                }
                for (var i = 0; i < data.resList.length; i++) {
                  if (data.resList[i].id !== this.tableData[i].id) {
                    this.tableData[i] = data.resList[i];
                    this.tableData[i].tof = false;
                    this.tableData[i].tofclass = false;
                    this.tableData[i].forData = [];
                    if (this.tableData[i].status === 0) {
                      this.tableData[i].status = true;
                    } else {
                      this.tableData[i].status = false;
                    }
                    this.qwe++;
                  }
                }
              } else {
                this.NotDis = true;
              }
            });
          } else {
            this.openError(data.resMsg);
          }
        });
      } else {
        if (this.form.name !== '') {
          var loginParams = {
            id: this.form.id,
            name: this.form.name,
            type: '',
            status: '',
            sort: '',
            templet: this.radio
          };
          changehome(loginParams).then(data => {
            if (data.success) {
              this.dialogVisible = false;
              for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id === this.form.id) {
                  this.tableData[i].name = this.form.name;
                  this.tableData[i].templet = parseInt(this.radio);
                }
              }
            } else {
              this.openError(data.resMsg);
            }
            // console.log(data);
            this.qwe++;
          })
        }
      }
    },
    //切换板块状态(是否展开)
    changedis(id) {
      this.operateid = id;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id) {
          this.tableData[i].tofclass = true;
          if (this.tableData[i].tof) {
            this.tableData[i].tof = false;
          } else {
            this.tableData[i].tof = true;
            gethomecourse(id).then(data => {
              if (data.success) {
                for (var i = 0; i < this.tableData.length; i++) {
                  if (this.tableData[i].id === id) {
                    this.tableData[i].forData = data.resList;
                  }
                }
                // console.log(this.tableData);
                this.qwe++;
              }
            })
          }
          this.qwe++;
          // handle.$forceUpdate()
        } else {
          this.tableData[i].tofclass = false;
        }
      }
    },
    //切换板块状态(是否打开)
    ChangeStatus(hid) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === hid) {
          if (this.tableData[i].status) {
            this.qwe = 0;
          } else {
            this.qwe = 1;
          }
          var loginParams = {
            id: hid,
            name: '',
            type: '',
            status: this.qwe,
            sort: ''
          };
          changehome(loginParams).then(data => {
            // console.log(data);
          })
        }
      }
    },
    //显示选择ThemeName的模态框
    choeseCarousel(data) {
      this.dialogVisible2 = true;
      this.datacourseList = data.forData;
      this.OngetHomeCourseAll('', 0);
    },
    //删除板块
    deletehc(id) {
      var that = this;
      this.$confirm('确定删除该板块?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delhome(id).then(data => {
          // console.log(data);
          if (data.success) {
            if (that.tableData.length === 1) {
              that.NotDis = true;
              that.tableData = [];
            } else {
              that.NotDis = false;
              for (var i in that.tableData) {
                if (that.tableData[i].id === id) {
                  that.tableData.splice(i, 1);
                }
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});

    },
    //显示修改板块的模态框
    updatehc(id, name, type) {
      this.ChangePlate = '修改板块'
      this.form = {
        id: id,
        name: name
      }
      this.radio = type + '';
      this.dialogVisible = true;
      setTimeout(function() {
        document.querySelector('#homename input').focus();
      }, 20);
    },
    //修改板块
    updname() {
      if (this.form.name !== '') {
        var loginParams = {
          id: this.form.id,
          name: this.form.name,
          type: this.radio,
          status: '',
          sort: ''
        };
        changehome(loginParams).then(data => {
          if (data.success) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id === this.form.id) {
                this.tableData[i].name = this.form.name;
                this.tableData[i].type = this.radio;
              }
            }
          } else {
            this.openError(data.resMsg);
          }
          // console.log(data);
          this.qwe++;
        })
      } else {
        this.openError('板块名不能为空');
      }
    },
    //删除板块
    deletec(hcid, course) {
      this.$confirm('确定删除该板块下的' + this.ThemeName + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var loginParams = {
          hcid: hcid,
          course: course
        };
        delhomeCourse(loginParams).then(data => {
          if (data.success) {
            for (var i in this.tableData) {
              if (this.tableData[i].id === hcid) {
                for (var j in this.tableData[i].forData) {
                  if (this.tableData[i].forData[j].id === course) {
                    this.tableData[i].forData.splice(j, 1);
                    // console.log(this.tableData);
                    this.qwe++;
                  }
                }
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        })
      }).catch(() => {});

    },
    //切换模态框中ThemeName的状态
    ChangeCheck(item) {
      let id = item.id;
      let hcid = item.hcid;
      // document.getElementById('checkbox' + id).disabled = true;
      // console.log(hcid);
      if (hcid === undefined) {
        var loginParams = {
          hcid: this.operateid,
          course: id
        };
        addhomecourse(loginParams).then(data => {
          // console.log(data);
          if (data.success) {
            for (var i = 0; i < this.ResourceData.length; i++) {
              if (this.ResourceData[i].id === id) {
                this.ResourceData[i].hcid = '';
                this.ResourceData[i].checked = true;
              }
            }
            gethomecourse(this.operateid).then(data => {
              for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id === this.operateid) {
                  if (data.success) {
                    this.tableData[i].forData = data.resList;
                    this.qwe++;
                  } else {
                    this.tableData[i].forData = [];
                  }
                }
              }
              this.hack();
            })
          } else {
            this.openError(data.resMsg);
          }
        })
      } else {
        var loginParams = {
          hcid: this.operateid,
          course: id
        };
        delhomeCourse(loginParams).then(data => {
          // console.log(data);
          // document.getElementById('checkbox' + id).disabled = false;
          if (data.success) {
            console.log(id);
            console.log(this.ResourceData);
            for (var i = 0; i < this.ResourceData.length; i++) {
              if (this.ResourceData[i].id === id) {
                this.ResourceData[i].hcid = undefined;
                this.ResourceData[i].checked = false;
              }
            }
            console.log(this.ResourceData);
            gethomecourse(this.operateid).then(data => {
              for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id === this.operateid) {
                  if (data.success) {
                    this.tableData[i].forData = data.resList;
                    this.qwe++;
                  } else {
                    this.tableData[i].forData = [];
                  }
                }
              }
              this.hack();
            })
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    //查询模态框中的ThemeName
    OngetHomeCourseAll(txt, num) {
      var loginParams = {
        keyword: txt,
        hcid: this.operateid,
        pgPageNum: num
      };
      getHomeCourseAll(loginParams).then(data => {
        // console.log(data);
        if (data.success) {
          this.Page = data;
          this.ResourceData = data.resList;
          if (this.datacourseList.length > 0) {
            this.ResourceData.forEach(item => {
              this.datacourseList.forEach(item2 => {
                if (item.id === item2.id) item.checked = true;
              })
            })
          }
          console.log(this.ResourceData);
          console.log(this.datacourseList);
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    //模态框中的ThemeName分页页码切换
    handleCurrentChange(currentPage) {
      this.OngetHomeCourseAll(this.searchTxt, currentPage);
    },
    //模糊查询模态框中的ThemeName
    getsearchTxt() {
      this.OngetHomeCourseAll(this.searchTxt, 0);
    },
    //模态框中的模糊查询输入框清空时
    getSearchInput() {
      if (this.searchTxt === '') {
        this.OngetHomeCourseAll('', 0);
      } else {
        this.OngetHomeCourseAll(this.searchTxt, 0);
      }
    },
    getSearchBtn() {
      if (this.searchTxt === '') {
        this.openError('请输入关键字后再进行搜索！')
      } else {
        this.OngetHomeCourseAll(this.searchTxt, 0);
      }
    },
    //模态框中按下回车模糊查询ThemeName
    show(ev) {
      if (ev.keyCode === 13) {
        this.getsearchTxt();
      }
    },
    //模块的排序
    changesort(id, shift) {
      var loginParams = {
        id: id,
        shift: shift
      };
      changehomesort(loginParams).then(data => {
        if (data.success) {
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === id) {
              var temp = '';
              if (shift === 1) {
                temp = this.tableData[i - 1];
                this.tableData[i - 1] = this.tableData[i];
                this.tableData[i] = temp;
                this.qwe++;
              } else {
                var temp = this.tableData[i + 1];
                this.tableData[i + 1] = this.tableData[i];
                this.tableData[i] = temp;
                this.qwe++;
              }
              break;
            }
          }
        } else {
          // console.log(data.resMsg);
          this.openError(data.resMsg);
        }
      })
    }
  }
}
</script>
