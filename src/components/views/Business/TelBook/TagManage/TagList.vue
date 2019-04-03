<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95">标签管理</div>
  <div class="TopLine"></div>
  <div class="TopName W95">
    <span>
      <el-button type="primary" @click="addTagOne">添加标签</el-button>
      <el-button type="primary" :disabled="btnDisabled" @click="editTag">编辑标签</el-button>
      <el-button type="primary" :disabled="btnDisabled" @click="onDelTag">删除标签</el-button>
    </span>

    <span class="SearchDept TopButtonRight6">
      <input class="TopButtonRightInput" type="text" v-model="searchTxt" placeholder="请输入关键字" v-on:input="searchTagInput">
      <el-button type="default" style="padding: 5px 10px;" @click="searchTagBtn">搜索</el-button>
    </span>
  </div>

  <div class="TopContent W95" style="border: 1px solid #cdcdcd;">
    <div class="TopContentLeft" id="DeptTopLength_1">
      <el-tree :data="TagList" ref="tree1" node-key="id" empty-text="暂无数据" accordion :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys" @node-click="handleNodeClick1"></el-tree>
    </div>

    <div class="TopContentRight">
      <div class="TopContentRight1">
        <span>{{currentTag}}({{userInfo.length}}人)</span>
        <el-button size="small" @click="onAddTagUser" :disabled="btnDisabled" style="width:100px;height:30px;margin-left:15px;">添加标签成员</el-button>
      </div>
      <div class="TopContentRight2">
        <div class="Department_List_Table">
          <el-table :data="userInfo" height="calc(100% - 10px)" border style="width: 100%; height: calc(100% - 10px); overflow: auto">
            <el-table-column prop="id" label="序号" width="200">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="200">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" width="200">
            </el-table-column>
            <el-table-column prop="currentStatus" label="标签">
              <template slot-scope="scope">
                {{currentTag}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="onEditTag(scope.row)">编辑</el-button>
                <el-button type="text" @click="onDelUser(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="TopContentRight3">
        <el-pagination style="float:right;" :page-size="10" @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :total="userInfo.length">
        </el-pagination>
      </div>
    </div>
  </div>

  <!--选择标签用户-->
  <el-dialog :visible.sync="dialogVisible1" :title="titlename1" top="5%" :before-close="closeDialog1">
    <div style="width:100%; margin-top: -20px; padding: 8px 0;" v-if="hackReset">
      <span>已选择 {{checkedUserList.filter(function(e){return e.status==10||e.status==11||e.status==12}).length}} 人</span>
      <span style="margin-left: 15px;"><a href="javascript:;" @click="moreMember">查看更多</a></span>
    </div>

    <!-- <div class="Search">
      <div class="SearchLeft">
        <input v-model="searchTxt3" type="text" placeholder="部门名称" @keyup.enter="searchDept">
        <el-button type="default" style="padding: 5px 10px;" @click="searchDept">搜索</el-button>
      </div>
      <div class="SearchRight">
        <input v-model="searchTxt4" type="text" placeholder="用户姓名" @keyup.enter="searchMember">
        <el-button type="default" style="padding: 5px 10px;" @click="searchMember">搜索</el-button>
      </div>
    </div> -->
    <div style="clear: both"></div>
    <br>

    <div style="width:100%;border:1px solid #cdcdcd">
      <div id="TableDiv" class="Teacher_List_Table">
        <div style="width: 100%;height:calc(100% - 30px);overflow-y: auto;" v-loading="Gloading" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <div class="MemberList">
            <div class="TopContentLeft MemberListLeft AddDepartment">
              <el-tree :data="DepartmentList" node-key="id" ref="tree2" empty-text="暂无数据" accordion check-strictly show-checkbox :indent="20" :highlight-current="true" :props="defaultProps2" :current-node-key="highlightkeys2" @node-click="handleNodeClick2"
                @check-change="handleCheckChange2">
              </el-tree>
            </div>
            <div class="MemberListRight" v-if="hackReset">
              <table border="1" bordercolor="#cdcdcd" style="border-collapse:collapse;">
                <tr>
                  <th>姓名</th>
                  <th>手机号</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in userInfo2" v-if="!isSearchMem">
                  <td>{{item.name}}</td>
                  <td>{{item.mobile}}</td>
                  <td>
                    <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                    <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                  </td>
                </tr>
                <tr v-for="item in userInfo2" v-if="isSearchMem">
                  <td>{{item.name}}</td>
                  <td>{{item.mobile}}</td>
                  <td>
                    <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                    <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                  </td>
                </tr>
                <tr v-if="userInfo2==''" style="height:366px;text-align: center;">
                  <td colspan="3">当前部门暂无用户</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="height:1px; margin: 10px auto;">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog1">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="submitUserList">确定</el-button>
    </div>
  </el-dialog>

  <!--查看标签用户-->
  <el-dialog :visible.sync="dialogVisible2" :title="titlename2" top="5%" @close="closeDialog2">
    <!-- <div class="Search">
      <div class="SearchRight5">
        <input v-model="searchTxt1" type="text" placeholder="用户、部门名称" style="text-indent: 0.75em;" @keyup.enter="searchMember2">
        <el-button type="default" style="padding: 5px 10px;" @click="searchMember2">搜索</el-button>
      </div>
    </div> -->
    <div style="clear: both"></div>
    <br>

    <div style="width: 100%;height: 415px;overflow-x: hidden;border: 1px solid #cdcdcd;">
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 20%">姓名</th>
          <th style="width: 20%">部门</th>
          <th style="width: 20%">手机号</th>
          <th style="width: 20%">变动状态</th>
          <th style="width: 20%">选择</th>
        </tr>
        <tr v-for="item in currentUser" v-if="hackReset">
          <td>{{item.name}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.mobile}}</td>
          <td v-if="item.status==10">原有</td>
          <td v-else>新添加</td>
          <td><img @click="clearUser(item)" src="../../../../../static/img/close.png" style="cursor: pointer" alt=""></td>
        </tr>
      </table>
    </div>

    <div style="height:1px; margin: 10px auto;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog2">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmMember">确定</el-button>
    </div>
  </el-dialog>

  <!--编辑标签用户-->
  <el-dialog :visible.sync="dialogVisible3" :title="titlename3" top="5%" :before-close="closeDialog3">
    <div class="Search">
      <div class="SearchLeft">
        <input v-model="searchTxt" type="text" placeholder="标签名称" style="text-indent: 0.75em;" @keyup.enter="searchDept">
        <el-button type="default" style="padding: 5px 10px;" @click="searchDept">搜索</el-button>
      </div>
    </div>
    <div style="clear: both"></div>
    <br>

    <div style="width:100%;height:auto;border:1px solid #cdcdcd">
      <div class="AddDepartment" id="DeptTopLength_2" v-show="hackReset">
        <el-tree ref="tree3" :data="TagList" node-key="id" :default-checked-keys="checkedDeptList" empty-text="暂无数据" show-checkbox accordion check-strictly auto-expand-parent highlight-current :indent="20" :props="defaultProps">
        </el-tree>
      </div>
    </div>
    <div style="height:1px; margin: 10px auto;">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog3">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="onUpdUserTag">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getDepartmentAll,
  addTagUser,
  addUserTag,
  getTagUser,
  getUserTag,
  delTagUser,
  getTagList,
  getTag,
  delTag,
  getUserBy,
  getDepartmentById
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
import NotContent from '@/components/public/NotContent';

export default {
  data() {
    return {
      mobile: '',
      tof: '',
      Gloading: true,
      NotDis: false,
      searchTxt: '',
      searchTxt1: '',
      searchTxt2: '',
      searchTxt3: '',
      searchTxt4: '',
      searchDept: '',
      searchMember: '',
      searchMember2: '',
      currentUser: '',
      currentIndex: '',
      currentIndex2: '',
      currentParent: '',
      currentTag: '标签名称',
      currentTagParent: '',
      hackReset: false,
      btnDisabled: true,
      pgLimit: 12,
      userInfo: [],
      userInfo2: [],
      checkedDeptList: [],
      checkedUserList: [],
      TagUsersNum: 0,
      DepartmentList: [],
      TagList: [],
      defaultProps: {
        children: 'id',
        label: 'name'
      },
      defaultProps2: {
        children: 'resList',
        label: 'name'
      },
      highlightkeys: '0',
      highlightkeys2: '0',
      hackReset: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      titlename1: '选择标签用户',
      titlename2: '查看标签用户',
      titlename3: '编辑标签用户',
      deptid: '',
      tagid: '',
      userid: '',
      canRun: true,
      isFirst: true,
      isSearchMem: false,
      recursiveList: [],
      tlist: []
    }
  },
  components: {
    NotContent
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      getDepartmentAll().then(data => {
        if (data.resCode == 0) {
          this.DepartmentList = data.resList;
        } else {
          this.DepartmentList = [];
          this.openError(data.resMsg);
        }
      });
    }
  },
  mounted() {
    getTagList({
      type: 1
    }).then(data => {
      // console.log(data);
      if (data.resCode == 0) {
        this.Gloading = false;
        if (data.resList) this.TagList = data.resList;
        else this.TagList = [];
      } else {
        this.TagList = [];
        this.openError(data.resMsg);
      }
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
    hack() {
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    handleNodeClick1(data) {
      this.tagid = data.id;
      this.btnDisabled = false;
      this.getTagUser(data);
      this.userInfo = [];
    },
    handleNodeClick2(data) {
      this.deptid = data.id;
      this.getDeptUser({
        deptid: data.id
      });
    },
    handleCheckChange2(data, checked, leafChecked) {
      this.deptid = data.id;
      this.recursiveList = [];
      this.recursive(data);
      if (this.isFirst) this.first = data.id;
      this.isFirst = false; // 设置this.isFirs的布尔值来判断是否是当前勾选的部门
      // console.log('this.canRun',this.canRun,'this.isFirst',this.isFirst);
      if (checked) {
        if (this.canRun) {
          if (this.$refs.tree2.getCheckedKeys().indexOf(data.id) < 0) {
            this.setCheck(data.id, true, false);
          }
          for (let i = 0; i < this.recursiveList.length; i++) {
            let item = this.recursiveList[i];
            if (this.$refs.tree2.getCheckedKeys().indexOf(item) < 0) {
              this.setCheck(item, true, false);
            }
          }

          this.checkUsers(data.id, leafChecked);
        }
      } else {
        if (this.canRun) {
          if (this.$refs.tree2.getCheckedKeys().indexOf(data.id) > -1) {
            this.setCheck(data.id, false, false);
          }
          this.recursiveList.forEach(item => {
            if (this.$refs.tree2.getCheckedKeys().indexOf(item) > -1) {
              this.setCheck(item, false, false);
            }
          });

          this.checkedUserList.forEach(item => {
            if (item.deptid == data.id) {
              item.status = 120;
            }
          });
          this.getuser({
            deptid: this.first
          });
        }
      }
      this.canRun = true; // 函数节流，通过改变this.canRun的布尔值来拦截勾选部门用户导致部门勾选状态发生变化
    },
    getuser(params) {
      // this.checkDept(this.deptid);
      getUserBy(params).then(data => {
        if (data.resList) {
          this.userInfo2 = data.resList;
          this.userInfo2.forEach(item => {
            item['isCheck'] = false;
            this.checkedUserList.forEach(i => {
              if (i.id == item.id && (i.status == 11 || i.status == 12)) {
                item['isCheck'] = true; // 渲染已选择的用户，标记为true
              }
            });

            this.showChange();
            this.canRun = true;
            this.hack();
          });
        } else {
          this.userInfo2 = [];
        }
      });
    },
    setCheck(id, flag1, flag2) {
      this.$refs.tree2.setChecked(id, flag1, flag2);
    },
    setCheck2(id, flag1, flag2) {
      this.$refs.tree3.setChecked(id, flag1, flag2);
    },
    checkUsers(deptid, leafChecked) {
      getUserBy({
        deptid: deptid
      }).then(data => {
        if (data.resList) {
          data.resList.forEach(item => {
            item['isCheck'] = true;
            item['status'] = 12;
            item['deptid'] = deptid;
            getDepartmentById(deptid).then(data => {
              if (data.name) {
                item['deptName'] = data.name;
                if (JSON.stringify(this.checkedUserList).indexOf(item.id) < 0) {
                  // console.log('push item');
                  this.checkedUserList.push(item);
                } else {
                  this.checkedUserList.forEach(item2 => {
                    if (item2.id == item.id) {
                      // console.log('change item ');
                      item2.status = 12;
                      if (item2.deptName.indexOf(item.deptName) < 0) {
                        // console.log('add deptName');
                        item2.deptName += ' ' + item.deptName;
                      }
                    }
                  });
                }

                this.showChange();
                this.canRun = true;
                if (!leafChecked) this.isFirst = true;
              }

              // console.log("this.isFirst",this.isFirst,"this.first",this.first);
              if (this.isFirst) this.getuser({
                deptid: this.first
              });
            });
          });
        } else {
          this.isFirst = true;
          this.userInfo2 = [];
        }
      });
    },
    recursive(item) {
      if (item.resList != '') {
        item.resList.forEach(item2 => {
          this.recursiveList.push(item2.id);
          this.recursive(item2);
        });
      } else {
        return this.recursiveList;
      }
    },
    checkUser(item) {
      // item.status 11：新添加, 110：新添加待删除
      // item.status 12：新添加未确定, 120：新添加未确定待删除
      // item.status 13：新添加待取消, 130：新添加待取消待删除
      var id = this.deptid;
      if (!item.isCheck) {
        // console.log('check');
        item['isCheck'] = true;
        item['status'] = 12;
        item['deptid'] = id;
        getDepartmentById(id).then(data => {
          if (data.name) {
            item['deptName'] = data.name;
            // console.log(JSON.stringify(this.checkedUserList));
            if (JSON.stringify(this.checkedUserList).indexOf(item.id) < 0) {
              // console.log('push');
              this.checkedUserList.push(item);
            } else {
              // console.log('change');
              this.checkedUserList.forEach(item2 => {
                if (item2.id == item.id) {
                  item2.status = 12;
                  if (item2.name.indexOf(item.name) < 0) {
                    item2.name += ' ' + item.name;
                  }
                }
              });
            }
          }
        });
      } else {
        // console.log('uncheck');
        item['isCheck'] = false;
        this.checkedUserList.forEach(item2 => {
          if (item2.id == item.id) {
            item2['isCheck'] = false;
            item2['status'] = 120;
          }
        });
      }

      // console.log(JSON.stringify(item));
      this.checkDept(id);
      this.showChange();
      this.hack();
    },
    checkDept(id) {
      var name, len_1, len_2;
      getDepartmentById(id).then(data => {
        if (data.name) {
          name = data.name;
          if (this.checkedUserList != '') {
            len_1 = this.checkedUserList.filter(function(e) {
              return (e.status == 10 || e.status == 11 || e.status == 12) && e.deptName.indexOf(name) > -1;
            }).length;
            if (this.userInfo2) len_2 = this.userInfo2.length;
            else len_2 = -1;
            // console.log(len_1, len_2, len_1 != len_2);
            if (len_1 != len_2) {
              this.$refs.tree2.setChecked(id, false, false);
            } else {
              if (len_1 != 0) this.$refs.tree2.setChecked(id, true, false);
            }
            this.canRun = false; // this.canRun：函数节流，避免勾选部门用户导致部门勾选状态发生变化
          }

          this.hack();
        }
      });
    },
    clearUser(item) {
      for (var i = 0; i < this.checkedUserList.length; i++) {
        if (this.checkedUserList[i].id == item.id) {
          this.checkedUserList.splice(i, 1);
        }
      }
      for (var i = 0; i < this.currentUser.length; i++) {
        if (this.currentUser[i].id == item.id) {
          this.currentUser.splice(i, 1);
        }
      }
      // this.checkedUserList.splice(this.checkedUserList.indexOf(item),1);
      // this.currentUser.splice(this.currentUser.indexOf(item),1);
      this.checkedMemberNum = this.checkedUserList.length;
      this.clearDeptid = item.deptid;
      this.hack();

      var params = {
        deptid: this.deptid
      };
      this.getuser(params);
    },
    moreMember() {
      this.dialogVisible2 = true;
      this.showChange();
    },
    showChange() {
      this.currentUser = this.checkedUserList.filter(function(e) {
        return e;
      });
      this.hack();
    },
    getTagUser(item) {
      let params = {
        tid: item.id,
        paPageNum: 1
      };
      getTagUser(params).then(data => {
        this.Gloading = false;
        if (data.resCode == 0) {
          this.currentIndex = item.id;
          this.userInfo = data.ulist;

          if (item.name != '') this.currentTag = item.name;
          if (item.name == undefined) {
            getTag({
              id: item.id
            }).then(data2 => {
              this.currentTag = data2.name;
            });
          }
        } else {
          this.userInfo = [];
          this.openError(data.resMsg);
        }
        this.hack();
      });
    },
    getTagUser2(item) {
      let params = {
        tid: item,
        paPageNum: 1
      };
      getTagUser(params).then(data => {
        if (data.resCode == 0) {
          if (data.ulist) this.userInfo = data.ulist;
        } else {
          this.userInfo = [];
          this.openError(data.resMsg);
        }
        this.hack();
      });
    },
    getDeptUser(params) {
      getUserBy(params).then(data => {
        // console.log(data);
        if (data.resList) {
          this.userInfo2 = data.resList;
          this.userInfo2.forEach(item => {
            item['isCheck'] = false;
            this.checkedUserList.forEach(i => {
              if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                item['isCheck'] = true; // 渲染已选择的用户，标记为true
              }
            });

            this.showChange();
            this.canRun = true;
            this.hack();
          });
        } else {
          this.userInfo2 = [];
        }
      });
    },
    addTagOne() {
      window.localStorage.setItem('saastag', '添加标签');
      this.$router.push('/AddTag');
    },
    addTag() {
      window.localStorage.setItem('saastag', '添加标签');
      window.localStorage.setItem('saastagid', this.currentIndex);
      this.$router.push('/AddTag');
    },
    editTag() {
      window.localStorage.setItem('saastag', '编辑标签');
      window.localStorage.setItem('saastagid', this.currentIndex);
      this.$router.push('/AddTag');
    },
    onDelTag() {
      this.$confirm('确定删除该标签?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      }).then(() => {
        delTag({
          id: this.currentIndex
        }).then(data => {
          // console.log(data);
          if (data.success) {
            this.openSuccess('删除成功！');
            this.btnDisabled = true;
            this.currentTag = '标签名称';

            this.TagList.forEach(item => {
              if (item.id == this.currentIndex) {
                this.TagList.splice(this.TagList.indexOf(item), 1);
              }
            });
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    onAddTagUser() {
      this.dialogVisible1 = true;
      this.checkedUserList = [];
      getTagUser({
        tid: this.tagid
      }).then(data => {
        if (data.resCode == 0) {
          if (data.ulist.length != 0) {
            if (this.checkedUserList.length == 0) {
              data.ulist.forEach(item => {
                item['isCheck'] = true;
                item['status'] = 10;
                if (item.deptList != '') {
                  item['deptid'] = item.deptList[0].id;
                  item['deptName'] = item.deptList[0].name;
                }
                this.checkedUserList.push(item);
              });
            }

            this.showChange();
            this.userInfo2 = []; // 清空标签用户列表
            this.dialogVisible7 = true;
          }
        } else this.openError(data.resMsg);
        this.hack();
      });
    },
    submitUserList() {
      let array = [],
        array2 = [];
      for (var i = 0; i < this.checkedUserList.length; i++) {
        var item = this.checkedUserList[i];
        if (item.status == 12) item.status = 11;
        if (item.status == 110 || item.status == 120) {
          array2.push({
            id: item.id
          });
          this.checkedUserList.splice(i, 1);
          i--;
        }
      }
      this.checkedUserList.forEach(item => {
        if (array.indexOf({
            id: item.id
          }) < 0) {
          if (item.status == 10 || item.status == 11) array.push({
            id: item.id
          });
        }
      });
      if (array.length < 1) return this.openError('标签用户不能为空！');
      // console.log(JSON.stringify(array));
      addTagUser({
        tid: this.currentIndex,
        ulist: array
      }).then(data => {
        // console.log(data);
        if (data.resCode == 0) {
          this.openSuccess('添加成功！');
          if (array2 != '') {
            delTagUser({
              tid: this.currentIndex,
              ulist: array2
            }).then(data => {
              if (data.resCode == -1) this.openError(data.resMsg);
            });
          }
          this.getTagUser({
            id: this.tagid
          });
        } else this.openError(data.resMsg);
      });
      this.dialogVisible1 = false;
    },
    confirmMember() {
      this.dialogVisible2 = false;
      this.checkDept(this.deptid); // 查询当前标签人员是否全部选中，是则选择标签
    },
    closeDialog1() {
      this.dialogVisible1 = false;
    },
    closeDialog2() {
      this.dialogVisible2 = false;
    },
    closeDialog3() {
      this.dialogVisible3 = false;
    },
    onEditTag(data) {
      this.userid = data.id;
      this.dialogVisible3 = true;
      this.$nextTick(() => {
        getUserTag({
          uid: this.userid
        }).then(data => {
          // console.log(data);
          if (data.resCode == 0) {
            if (data.tlist != '') {
              this.$refs.tree3.setCheckedNodes([]);  // 清空已选择的标签
              this.tlist = data.tlist;
              data.tlist.forEach(item => {
                this.setCheck2(item.id, true, false);
              });
            }
          } else this.openError(data.resMsg);
          this.hack();
        });
      });
    },
    onUpdUserTag() {
      let array = [];
      let arrayOld = []; // 存放原来的标签
      let arrayDel = []; // 存放待删除的标签
      let checkedtag = this.$refs.tree3.getCheckedKeys();

      this.tlist.forEach(item => {
        arrayOld.push({
          id: item.id
        });
      });
      checkedtag.forEach(item => {
        array.push({
          id: item
        });
      });
      this.tlist.forEach(item => {
        if (JSON.stringify(array).indexOf(item.id) < 0) arrayDel.push({
          id: item.id
        });
      });

      if (array.length < 1) return this.openError('标签列表不能为空！');
      addUserTag({
        uid: this.userid,
        tlist: array
      }).then(data => {
        // console.log(data);
        if (data.resCode == 0) {
          for (let i = 0; i < arrayDel.length; i++) {
            let item = arrayDel[i];
            delTagUser({
              tid: item.id,
              ulist: [{
                id: this.userid
              }]
            }).then(data => {
              if (data.resCode == -1) this.openError(data.resMsg);
            });
          }
          if(checkedtag.indexOf(this.tagid)){
            for (var i in this.userInfo) {
              if (this.userInfo[i].id == this.userid) {
                this.userInfo.splice(i, 1);
              }
            }
          }
          this.openSuccess('修改成功！');
        } else {
          this.openError(data.resMsg);
        }
        this.dialogVisible3 = false;
      });
    },
    onDelUser(item) {
      this.$confirm('确定移除该用户?', '提示', {
        confirmButtonText: '移除',
        cancelButtonText: '不移除',
        type: 'warning'
      }).then(() => {
        delTagUser({
          tid: this.currentIndex,
          ulist: [{
            id: item.id
          }]
        }).then(data => {
          if (data.success) {
            this.openSuccess(item.name + '已经从' + this.currentTag + '移除！');

            if (this.userInfo.length == 0) {
              this.NotDis = true;
            }
            for (var i in this.userInfo) {
              if (this.userInfo[i].id == item.id) {
                this.userInfo.splice(i, 1);
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }).catch(() => {});
    },
    getUsers() {
      if (this.searchTxt === '') {
        var params = {
          deptid: this.currentIndex,
          pgPageNum: 1,
          pgLimit: this.pgLimit,
          keyword: this.searchTxt
        };
        this.getuser(params);
      }
    },
    searchTag() {
      for (var i = 0; i < this.TagList.length; i++) {
        var item = this.TagList[i];
        var result = item.name.match(this.searchTxt);
        if (result != null) {
          this.tagid = item.id;
          this.btnDisabled = false;
          this.highlightkeys = item.id;
          this.getTagUser(item);
          this.userInfo = [];
          break;
        } else {
          this.tagid = '';
          this.btnDisabled = true;
        }
      };
    },
    searchTagInput() {
      if (this.searchTxt != '') {
        this.searchTag();
      } else {
        this.tagid = '';
        this.highlightkeys = '';
        this.btnDisabled = true;
        this.userInfo = [];
        this.currentTag = '';

        getTagList({
          type: 1
        }).then(data => {
          // console.log(data);
          if (data.resCode == 0) {
            this.Gloading = false;
            if (data.resList) this.TagList = data.resList;
            else this.TagList = [];
          } else {
            this.TagList = [];
            this.openError(data.resMsg);
          }
        });
      }
    },
    searchTagBtn() {
      if (this.searchTxt != '') {
        this.searchTag();
      } else {
        this.openError('请先输入标签关键字再搜索！');
      }
    },
    handleCurrentChange(currentPage) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
