
<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GoCourseSort"></i>添加分类</div>
  </div>
  <div class="TopLine"></div>
  <br />
  <br />
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="分类名称">
      <el-input v-model="form.name" id="sortname" style="width: 400px;"></el-input>
    </el-form-item>
    <el-form-item label="分类描述" style="width: 550px;">
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.desc">
      </el-input>
    </el-form-item>
    <el-form-item label="所属上级分类" v-if="title==='添加子分类'">
      <el-input style="width:400px;height:28px;" :disabled="true" v-model="form.parentName"></el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="Onaddcategory">提交</el-button>
    </el-form-item>
  </el-form>

  <el-dialog :visible.sync="dialogVisible" size="small" title="选择分类">
    <div style="width:100%;height:300px;overflow-y: auto;border:1px solid #cdcdcd">
      <div style="width:100%;" v-for="One in data">
        <div style="width:100%;line-height:40px;text-indent: 5px;cursor: pointer;" v-bind:class="{ asd: One.checked }" @click="TreeClick(One.id,One.name,One.desc)">
          <span v-if="One.resList!==undefined">
            <i v-if="One.tofDis" class="el-icon-minus"></i>
            <i v-else class="el-icon-plus"></i>
          </span>
          {{One.name}}
        </div>
        <div style="width:100%;" v-if="One.tofDis" v-for="Two in One.resList">
          <div style="width:100%;height:40px;line-height:40px;text-indent: 15px;cursor: pointer;" v-bind:class="{ asd: Two.checked }" @click="TreeClick(Two.id,Two.name,Two.desc)">
            {{Two.name}}
          </div>
        </div>
        <div style="display:none">{{qwe}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="choeseTrue">提 交</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {
  getcategory,
  getcourseCategory,
  addcategory,
  getOnecategory,
  getOnecourse
} from '@/api/api';
export default {
  data() {
    return {
      form: {
        parent: '',
        parentName: '',
        name: '',
        desc: ''
      },
      radio: '1',
      dialogVisible: false,
      dialogVisible2: false,
      data: [],
      dataL: [],
      tof: true,
      qwe: 0,
      cateid: window.localStorage.saascateid ? window.localStorage.saascateid : '',
      title: window.localStorage.saastitle ? window.localStorage.saastitle : '',
      sort: window.localStorage.saasdata ? JSON.parse(window.localStorage.saasdata) : {}
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    }
  },
  mounted() {
    console.log(this.sort);
    if (this.sort.id) this.form.parent = this.sort.id;
    if (this.sort.name) this.form.parentName = this.sort.name;
    setTimeout(function () {
      document.querySelector('#sortname input').focus()
    }, 20);
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
    GoCourseSort() {
      this.$router.push('/CourseSortList');
    },
    choeseTrue() {
      this.dialogVisible = false;
    },
    TreeClick(id, name, desc) {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          if (this.data[i].tofDis) {
            this.data[i].tofDis = false;
          } else {
            this.data[i].tofDis = true;
          }
          break;
        } else {
          for (var j = 0; j < this.data[i].resList.length; j++) {
            if (this.data[i].resList[j].id === id) {
              if (this.data[i].resList[j].tofDis) {
                this.data[i].resList[j].tofDis = false;
              } else {
                this.data[i].resList[j].tofDis = true;
              }
              break;
            }
          }
        }
      }

      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].resList !== undefined) {
          if (this.data[i].id === id) {
            if (this.data[i].checked) {
              this.data[i].checked = false;
            } else {
              this.data[i].checked = true;
            }
          } else {
            this.data[i].checked = false;
          }
          for (var j = 0; j < this.data[i].resList.length; j++) {
            if (this.data[i].resList[j].resList !== undefined) {
              if (this.data[i].resList[j].id === id) {
                if (this.data[i].resList[j].checked) {
                  this.data[i].resList[j].checked = false;
                } else {
                  this.data[i].resList[j].checked = true;
                }
              } else {
                this.data[i].resList[j].checked = false;
              }
              for (var k = 0; k < this.data[i].resList[j].resList.length; k++) {
                if (this.data[i].resList[j].resList[k].id === id) {
                  if (this.data[i].resList[j].resList[k].checked) {
                    this.data[i].resList[j].resList[k].checked = false;
                  } else {
                    this.data[i].resList[j].resList[k].checked = true;
                  }
                } else {
                  this.data[i].resList[j].resList[k].checked = false;
                }
              }
            }
          }
        }
      }
      this.qwe++;
    },
    Onaddcategory() {
      if (this.form.name === '') return this.openError('分类名称不能为空');
      var loginParams = {
        name: this.form.name,
        desc: this.form.desc,
        parent: this.form.parent===''?this.cateid:this.form.parent
      };
      addcategory(loginParams).then(data => {
        if (data.success) {
          this.$router.push('/CourseSortList');
        } else {
          this.openError(data.resMsg);
        }
      })
    }
  }
}
</script>
<style>
.asd {
  background: #dcdcdc;
}
</style>
