<template>
<div style="width:100%;height:calc(100% - 20px);">
  <div class="TopName W95">{{ThemeName}}分类</div>
  <div class="TopLine"></div>
  <div style="height:60px;line-height:60px;" class="W95">
    <div>
      <el-button type="primary" style="width:120px;margin-top:10px;" @click="GoAddCourseSort">添加分类</el-button>
      <el-button type="primary" style="width:120px;margin-top:10px;" @click="GoAddCourseSortChild" :disabled="btnAddChild">添加子分类</el-button>
      <el-button type="primary" style="width:100px;margin-top:10px;margin-right:10px" @click="GoUpdCourseSort" :disabled="btnEditCourse">编辑分类</el-button>
      <el-button type="primary" style="width:100px;margin-top:10px;margin-right:20px" @click="GoDelCourseSort" :disabled="btnDelCourse">删除分类</el-button>
    </div>
  </div>
  <div style="height:calc(100% - 20px);" class="W95">
    <div style="width:200px;height:calc(100% - 90px);float:left;border:1px solid #cdcdcd;overflow-y: auto;" v-if="hackReset">
      <div style="width:100%;" v-for="One in data">
        <div style="width:100%;line-height:40px;text-indent: 5px;cursor: pointer;" v-bind:class="{ asd: One.checked }" @click="TreeClick(One)">
          <span v-if="One.resList!==undefined">
            <i v-if="One.hasChild" class="el-icon-minus"></i>
            <i v-else class="el-icon-plus"></i>
          </span>
          {{One.name}}
        </div>
        <div style="width:100%;" v-if="One.hasChild" v-for="Two in One.resList">
          <div style="width:100%;height:40px;line-height:40px;text-indent: 27px;cursor: pointer;" v-bind:class="{ asd: Two.checked }" @click="TreeClick(Two)">
            {{Two.name}}
          </div>
        </div>
      </div>
      <div style="text-align:center;width:100%;height:100px;line-height:100px;" v-if="data.length===0">
        暂无分类
      </div>
      <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" style="height:100%;overflow-y: auto"></el-tree>  -->
    </div>
    <div style="width:calc(100% - 240px);height:calc(100% - 90px);border:1px solid #cdcdcd;float:right;margin-right:10px;overflow-y: auto">
      <el-table :data="tableData" border style="width: 100%" key="tableData" v-if="showCourse">
        <el-table-column prop="sort" label="序列" width="150"></el-table-column>
        <el-table-column prop="name" label="分类名称" width="150"></el-table-column>
        <el-table-column prop="desc" label="分类描述"></el-table-column>
      </el-table>
      <el-table :data="tableData" border style="width: 100%" v-else>
        <el-table-column prop="id" :label="ThemeName+'ID'" width="200"></el-table-column>
        <el-table-column prop="name" :label="ThemeName+'名称'"></el-table-column>
        <el-table-column prop="name" label="主讲人" width="200"></el-table-column>
        <!-- <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="delcaurse(scope.row.id)" size="small">删除</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加分类/添加子分类/编辑分类 -->
  <el-dialog :visible.sync="dialogVisible" :title="dialogVisibleTitle" size="tiny">
    <el-form label-width="100px" style="margin-top:10px;">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" id="sortname"></el-input>
      </el-form-item>
      <el-form-item label="分类描述">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="所属上级分类" v-if="dialogVisibleTitle==='添加子分类'">
        <el-input v-model="form.parentname" :disabled="true" id="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="OnAddCategory">提 交</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  addcategory,
  changecategory,
  getcategory,
  getOnecategorys,
  delcategory,
  getOnecourse,
  delcourse
} from '@/api/api';
export default {
  data() {
    return {
      data: [],
      dialogVisible: false,
      dialogVisibleTitle: '',
      btnAddChild: true,
      btnDelCourse: true,
      btnEditCourse: true,
      tableData: [],
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      showCourse: true,
      coursesort: [],
      form: {
        name: '',
        desc: '',
        parent: '',
        parentname: ''
      },
      hackReset: false,
      defaultId: window.localStorage.saascateid ? window.localStorage.saascateid : '',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''
    };
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    this.GetCategorys();
    this.hack();
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
    GetCategorys() {
      // console.log('get cate');
      getOnecategorys(this.defaultId).then(data => {
        // console.log(data);
        if (data.success) {
          this.showCourse = true;
          this.coursesort = {};
          if (data.resList !== undefined) {
            this.data = data.resList;
            for (var i = 0; i < this.data.length; i++) {
              let ONE = this.data[i];
              ONE.hasChild = false;
              if (ONE.resList !== undefined) {
                // ONE.hasChild = true;
                for (var j = 0; j < ONE.resList.length; j++) {
                  let TWO = ONE.resList[j];
                  TWO.hasChild = false;
                }
              }
            }
          }
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    GetCategoryOne(id) {
      // console.log('get one cate');
      getOnecategorys(id).then(data => {
        // console.log(data);
        if (data.success) {
          this.showCourse = true;
          this.tableData = data.resList ? data.resList : [];
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    //添加分类
    GoAddCourseSort() {
      this.dialogVisibleTitle = '添加分类';
      this.form.name = '';
      this.form.desc = '';
      this.dialogVisible = true;
      setTimeout(function() {
        document.querySelector('#sortname input').focus();
      }, 20);
    },
    GoAddCourseSortChild() {
      this.dialogVisibleTitle = '添加子分类';
      this.dialogVisible = true;
      this.form.name = '';
      this.form.desc = '';
      this.form.parent = this.coursesort.id;
      this.form.parentname = this.coursesort.name;
      setTimeout(function() {
        document.querySelector('#sortname input').focus();
      }, 20);
    },
    //编辑分类
    GoUpdCourseSort() {
      console.log(this.coursesort);
      this.dialogVisible = true;
      this.dialogVisibleTitle = '编辑分类';
      this.form.name = this.coursesort.name;
      this.form.desc = this.coursesort.desc;
      setTimeout(function() {
        document.querySelector('#sortname input').focus();
      }, 20);
    },
    OnAddCategory() {
      if (this.form.name === '') return this.openError('分类名称不能为空');
      var loginParams = {
        name: this.form.name,
        desc: this.form.desc
      };
      if (this.dialogVisibleTitle === '添加分类') loginParams['parent'] = this.defaultId;
      if (this.dialogVisibleTitle === '添加子分类') loginParams['parent'] = this.form.parent;

      if (this.dialogVisibleTitle === '添加分类' || this.dialogVisibleTitle === '添加子分类') {
        addcategory(loginParams).then(data => {
          if (data.success) {
            this.dialogVisible = false;
            this.form.name = '';
            this.form.desc = '';
            this.form.parentname = '';
            this.btnAddChild = true;   // 设置添加子分类禁用
            this.btnEditCourse = true; // 设置编辑分类禁用
            this.btnDelCourse = true;  // 设置删除分类禁用
            if (this.dialogVisibleTitle === '添加分类') this.openSuccess('添加成功！');
            if (this.dialogVisibleTitle === '添加子分类') this.openSuccess('添加成功！');
            this.GetCategorys();
          } else {
            this.openError(data.resMsg);
          }
        })
      } else if (this.dialogVisibleTitle === '编辑分类') {
        if (JSON.stringify(this.coursesort) === '{}') return this.openError('Error！');
        loginParams['id'] = this.coursesort.id;
        changecategory(loginParams).then(data => {
          if (data.success) {
            this.dialogVisible = false;
            this.form.name = '';
            this.form.desc = '';
            this.form.parentname = '';
            this.btnAddChild = true;   // 设置添加子分类禁用
            this.btnEditCourse = true; // 设置编辑分类禁用
            this.btnDelCourse = true;  // 设置删除分类禁用
            if (this.dialogVisibleTitle === '编辑分类') this.openSuccess('修改成功！');
            this.GetCategorys();
          } else {
            this.openError(data.resMsg);
          }
        })
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogVisibleTitle = '';
    },
    //删除分类
    GoDelCourseSort() {
      if (this.coursesort.oid === 0) {
        this.openError('该分类无权限删除');
      } else {
        this.$confirm('确定删除该分类?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '不删除',
          type: 'warning'
        }).then(() => {
          if (this.coursesort.id !== '') {
            delcategory(this.coursesort.id).then(data => {
              if (data.success) {
                this.btnAddChild = true;
                this.btnDelCourse = true;
                this.GetCategorys();
              } else {
                this.openError(data.resMsg);
              }
            });
          } else {
            this.openError('请选择分类');
          }
        }).catch(() => {});
      }
    },
    //分类下的ThemeName删除
    delcaurse(id) {
      this.$confirm('确定删除该' + this.ThemeName + '?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delcourse(id).then(data => {
          if (data.success) {
            getOnecourse(this.coursesort.id).then(data => {
              // console.log(data);
              if (data.success) {
                this.showCourse = false;
              } else {
                this.openError(data.resMsg);
              }
              this.tableData = data.resList;
            })
          } else {
            this.openError(data.success);
          }
        })
      });
    },
    //点击分类节点时获取所有的子节点并展开
    TreeClick(item) {
      console.log(item);
      this.coursesort = item;
      let id = item.id;
      let name = item.name;
      let desc = item.desc;
      let parent = item.parent;
      let oid = item.item;

      this.btnAddChild = false; // 设置添加子分类可用
      this.btnDelCourse = false; // 设置删除分类可用
      this.btnEditCourse = false; // 设置编辑分类可用

      // console.log(this.data);
      for (var i = 0; i < this.data.length; i++) {
        let ONE = this.data[i];
        ONE.checked = false;
        if (ONE.id === id) {
          ONE.checked = true;
          ONE.hasChild = ONE.hasChild ? false : true; // 展开折叠的，折叠已经展开的
          this.showCourse = true;
          this.GetCategoryOne(id);
          if (ONE.resList) {
            for (var j = 0; j < ONE.resList.length; j++) {
              let TWO = ONE.resList[j];
              TWO.checked = false;
            }
          }
        } else {
          if (ONE.resList) {
            for (var j = 0; j < ONE.resList.length; j++) {
              let TWO = ONE.resList[j];
              TWO.checked = false;
              if (TWO.id === id) {
                this.btnAddChild = true;
                this.showCourse = false;
                TWO.checked = true;
                getOnecourse(id).then(data => {
                  // console.log(data);
                  this.tableData = data.resList ? data.resList : [];
                  if (data.success) {
                    this.showCourse = false;
                  } else {
                    this.openError(data.resMsg);
                  }
                })
              }
            }
          }
        }
      }
      this.hack();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.asd {
  background: #dcdcdc;
}
</style>
