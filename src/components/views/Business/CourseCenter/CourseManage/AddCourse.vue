<template>
<div style="width:100%;height:100%;">
  <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOCourseList"></i>添加{{ThemeName}}</div>
  <div class="TopLine"></div>
  <br />
  <el-form ref="form" :model="form" label-width="100px" style="height:calc(100% - 120px);overflow-y:auto" id="form" method="post">
    <el-form-item :label="ThemeName+'名称'">
      <el-input v-model="form.name" style="width: 385px;" @change="verification" id="livename" autofocus></el-input>
    </el-form-item>
    <el-form-item :label="ThemeName+'封面'">
      <!-- <uppicture :aspectRatio="16/9" :width="280" :source="form.cover" @upload="upload"></uppicture> -->
      <div class="show" style="width:280px;height:160px;float: left;">
        <img class="picture" :src="form.cover" :onerror="errorImg" width="100%" height="100%" />
      </div>
      <div class="choose upload" style="float:left;margin-left:10px;">
        <label title="选择图片" class="choose-btn">
          <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" style="display:none" @change="choosefile">
          <span class="choose-file">选择图片</span>
        </label>
      </div>
    </el-form-item>
    <el-form-item label="直播类型">
      <el-radio v-model="radio" label="0">点播</el-radio>
      <el-radio v-model="radio" label="1">直播</el-radio>
    </el-form-item>
    <el-form-item :label="ThemeName+'分类'" style="height:40px;">
      <el-input style="width:280px;height:28px;" :disabled="true" v-model="CnameBlock" @change="verification"></el-input>
      <el-button style="width:100px;height:35px;margin-left:10px;" @click="ChoeseC">选择分类</el-button>
    </el-form-item>
    <el-form-item :label="ThemeName+'讲师'" style="height:40px;">
      <el-input style="width:280px;height:28px;" :disabled="true" v-model="LnameBlock" @change="verification"></el-input>
      <el-button style="width:100px;height:35px;margin-left:10px;" @click="ChoeseL">选择讲师</el-button>
      <el-button style="width:60px;height:35px;" @click="CancleChoeseL">移除</el-button>
    </el-form-item>
    <el-form-item label="关联文档" style="height:40px;">
      <el-input style="width:280px;height:28px;" :disabled="true" v-model="KnameBlock" @change="verification"></el-input>
      <el-button style="width:100px;height:35px;margin-left:10px;" @click="ChoeseK">选择文档</el-button>
      <el-button style="width:60px;height:35px;" @click="CancleChoeseK">移除</el-button>
    </el-form-item>
    <!--<el-form-item label="课后测验" style="height:40px;">-->
    <!--<el-input style="width:280px;height:28px;" :disabled="true" v-model="WnameBlock" @change="verification"></el-input>-->
    <!--<el-button style="width:100px;height:35px;" @click="ChoeseW">选择题库</el-button>-->
    <!--</el-form-item>-->
    <el-form-item label="详情板块">
      <el-checkbox-group v-model="checkList">
        <!-- <div @dblclick="ChangeCheckTxt()"><el-checkbox label="A" :disabled="true"></el-checkbox></div>-->

        <span v-for="(CT,index) in checkTxt">
          <el-checkbox :label="CT.txt" :disabled="index === 0 || index === 1" style="width:20px;height:40px;overflow:hidden;float:left"></el-checkbox>
          <div style="height:40px;float:left;margin-left:6px;margin-right:10px">{{CT.txt}}</div>
          <i class="el-icon-edit" style="float:left;margin-right:10px;height:35px;line-height:35px;cursor: pointer;color:#8E8E8E" @click="changeItemTxt(index,CT.txt)"></i>
          <!-- <el-input v-else style="width:80px;float:left;"></el-input> -->
        </span>
        <!-- <el-checkbox label="C"></el-checkbox>
            <el-checkbox v-for="CT in checkTxt" :label="CT.txt"></el-checkbox> -->
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="可见范围" style="margin-bottom: 0">
      <el-radio v-model="radio2" label="0">全部内部人员可见</el-radio>
      <el-radio v-model="radio2" label="1">指定人员可见</el-radio>
      <el-radio v-model="radio2" label="2">对外公开</el-radio>
    </el-form-item>
    <el-form-item>
      <span v-if="radio2=='0'">企业内部全部人员可见</span>
      <span v-if="radio2=='1'&&!radio2Checked"><span style="color: #20a0ff;cursor: pointer" @click="chooseCanSeeMember">添加指定人员可见</span></span>
      <span v-if="radio2=='1'&&radio2Checked">
        已选择
        <span style="color: #20a0ff;cursor: pointer" @click="chooseCanSeeMember" v-if="hackReset"> {{currentUser.length}} 个人员</span>
        有观看该{{ ThemeName }}权限</span>
      <span v-if="radio2=='2'">所有人员可见</span>
    </el-form-item>
    <el-form-item label="简介类型">
      <el-radio v-model="radio1" label="0">标题+讲师信息+文字（标题和讲师信息系统自动生成）</el-radio><br />
      <el-radio v-model="radio1" label="1">标题+讲师信息+html（标题和讲师信息系统自动生成）</el-radio><br />
      <el-radio v-model="radio1" label="2">html（{{ ThemeName }}标题和讲师信息不会自动生成）</el-radio>
    </el-form-item>
    <el-form-item :label="ThemeName+'简介'" style="width: 485px;">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" @change="verification" v-model="form.desc">
      </el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="OnAddCourse">提交</el-button>
    </el-form-item>
  </el-form>
  <el-dialog :visible.sync="dialogVisible5" title="修改名称" size="tiny">
    <div style="width:100%;height:60px;border:1px solid #cdcdcd">
      <el-form label-width="80px" style="margin-top:10px;">
        <el-form-item label="版块名称">
          <el-input v-model="checkChoeseTxt" style="width:90%;" @keyup.enter.native="onaddhome" id="homename"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible5 = false">取 消</el-button>
      <el-button type="primary" @click="OnchangeItemTxt">提 交</el-button>
    </span>
  </el-dialog>

  <!-- 选择分类 -->
  <el-dialog :visible.sync="dialogVisible" style="width:80%;margin:0 auto;" title="选择分类">
    <div style="width:100%;height:300px;overflow-y: auto;border:1px solid #cdcdcd" v-if="hackReset">
      <div style="width:100%;" v-for="One in data">
        <div style="width:100%;line-height:40px;text-indent: 5px;cursor: pointer;" v-bind:class="{ checkcolor: One.rofShadow }" @click="TreeClick(One)">
          <!-- <div style="width:100%;line-height:40px;text-indent: 5px;cursor: pointer;" v-bind:class="{ checkcolor: One.rofShadow }" @click="TreeClick(One.id,One.name,One.desc)"> -->
          <span v-if="One.resList!==undefined">
            <i v-if="One.hasChild" class="el-icon-minus"></i>
            <i v-else class="el-icon-plus"></i>
          </span>
          {{One.name}}
        </div>
        <div style="width:100%;" v-if="One.hasChild" v-for="Two in One.resList">
          <div style="width:100%;height:40px;line-height:40px;text-indent: 25px;cursor: pointer;" v-bind:class="{ checkcolor: Two.rofShadow }" @click="TreeClick(Two)">
            {{Two.name}}
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" style="height:40px;display:block;" v-if="hackReset">
      <div style="float:left;">
        <el-button type="primary" @click="AddSort">添加分类</el-button>
        <el-button type="primary" :disabled="btnAddSrortChild" @click="AddSortChild">添加子分类</el-button>
      </div>
      <div style="float:right;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="btnAddSrortFirst" @click="choeseTrue">提 交</el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 选择讲师 -->
  <el-dialog :visible.sync="dialogVisible2" style="width:80%;margin:0 auto;" title="选择讲师">
    <div style="width:100%;height:300px;overflow-y: auto;border:1px solid #cdcdcd">
      <div style="width:100%;" v-for="One in dataL" v-if="hackReset">
        <div style="width:100%;line-height:40px;height:40px;text-indent: 10px;cursor: pointer;" v-bind:class="{ checkcolor: One.checked }" @click="TreeClickL(One)">
          {{One.name}}
        </div>
      </div>
    </div>
    <div slot="footer" style="height:40px;display:block;">
      <div style="float:left;">
        <el-button type="primary" @click="AddTeacher">添加讲师</el-button>
      </div>
      <div style="float:right;">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" :disabled="btnChooseTeacher" @click="choeseTrueL">选 择</el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 关联文档 -->
  <UploadFile :Visible="dialogVisible3" VisibleTitle="选择文件" @choose="ChooseFile" @close="CloseChooseFile"></UploadFile>

  <el-dialog :visible.sync="dialogVisible4" size="small" title="题目选择" @close="">
    <div style="width:100%;height:350px;border:1px solid #cdcdcd;">
      <div class="TopButton2 W95" style="padding-top:10px">
        <div class="TopButtonRight2">
          <input class="TopButtonRightInput" type="text" placeholder="请输入关键字" v-model="searchTxt2" v-on:input="getwarehouseproblemsnull" @keydown="show($event)" /><label class="el-icon-search TopButtonRightSearch" @click="Ongetexample(searchTxt2,0)"></label>
          <!-- <el-button type="primary" size="small" @click="addproblemsclick()">添加题目</el-button> -->
        </div>
      </div>
      <div style="width:96%;height:calc(100% - 98px);margin-top:10px;margin-left:2%">

        <div style="width:100%;height:100%;border:1px solid #cdcdcd;overflow-y: auto">
          <div style="width:70%;height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc;border-right:1px solid #cdcdcd;">题目内容</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc;border-right:1px solid #cdcdcd;" v-for="data in dataW">{{data.name}}</div>
          </div>
          <div style="width:calc(30% - 1px);height:100%;float:left;">
            <div style="width:100%;height:40px;line-height:40px;text-align: center;background:#dcdcdc">选择</div>
            <div style="width:100%;height:40px;line-height:40px;text-align: center;border-bottom:1px solid #dcdcdc" v-for="data in dataW">
              <!-- <input name="Fruit" type="CheckBox" :value="data.id" :checked="data.whStorage!==undefined" @change="ChangeCheck(data.id,data.whStorage)" /> -->
              <input name="Fruit" type="radio" :value="data.id" />
            </div>
          </div>
        </div>
      </div>
      <!-- <not-content v-if="NotDis2"></not-content> -->
      <el-pagination style="margin-right:20px;float:right;margin-top:6px" :page-size="Page2.pgLimit" @current-change="handleCurrentChange2" layout="prev, pager, next, jumper" :total="Page2.pgTotalCount">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible4 = false">取消</el-button>
      <el-button type="primary" @click="choeseTrueW">选择</el-button>
    </span>
  </el-dialog>

  <!--选择可见人员-->
  <el-dialog :visible.sync="dialogVisible6" :title="titlename6" top="5%" :before-close="closeDialog6_2">
    <el-tabs v-model="activeName" ref="tab" @tab-click="handdleTabClick" style="margin-top:-20px;">
      <el-tab-pane label="部门" name="dept">
        <br>
        <div style="width:100%; margin-top: -20px; padding: 8px 0;" v-if="hackReset">
          <span>已选择 {{currentUser.length}} 人</span>
          <span style="margin-left: 15px;"><a href="javascript:;" @click="moreMember()">查看更多</a></span>
        </div>

        <div class="Search">
          <div class="SearchLeft">
            <input v-model="searchTxt3" type="text" placeholder="部门名称" @keyup.enter="searchDept">
            <el-button type="default" style="padding: 5px 10px;" @click="searchDept">搜索</el-button>
          </div>
          <div class="SearchRight">
            <input v-model="searchTxt4" type="text" placeholder="人员姓名" @keyup.enter="searchMember">
            <el-button type="default" style="padding: 5px 10px;" @click="searchMember">搜索</el-button>
          </div>
        </div>
        <div style="clear: both"></div>
        <br>

        <div style="width:100%;border:1px solid #cdcdcd">
          <div id="TableDiv" class="Teacher_List_Table">
            <div style="width: 100%;height:calc(100% - 30px);overflow-y: auto;" v-loading="Gloading" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div class="MemberList">
                <div class="TopContentLeft MemberListLeft AddDepartment" id="DeptTopLength_4">
                  <el-tree :data="DepartmentList" show-checkbox node-key="id" ref="tree" empty-text="暂无数据" accordion check-strictly :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys" @node-click="handdleNodeClick"
                    @check-change="handdleCheckChange">
                  </el-tree>
                </div>
                <div class="MemberListRight" v-if="hackReset">
                  <table border="1" bordercolor="#cdcdcd" style="border-collapse:collapse;">
                    <tr>
                      <th>姓名</th>
                      <th>手机号</th>
                      <th>操作</th>
                    </tr>
                    <tr v-for="item in userInfo" v-if="!isSearchMem">
                      <td>{{item.name}}</td>
                      <td>{{item.mobile}}</td>
                      <td>
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                      </td>
                    </tr>
                    <tr v-for="item in userInfo" v-if="isSearchMem">
                      <td>{{item.name}}</td>
                      <td>{{item.mobile}}</td>
                      <td>
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                      </td>
                    </tr>
                    <tr v-if="userInfo==''" style="height:366px;text-align: center;">
                      <td colspan="3">当前部门暂无人员</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="标签" name="tag">
        <br>
        <div style="width:100%; margin-top: -20px; padding: 8px 0;" v-if="hackReset">
          <span>已选择 {{currentUser.length}} 人</span>
          <span style="margin-left: 15px;"><a href="javascript:;" @click="moreMember()">查看更多</a></span>
        </div>

        <div class="Search">
          <div class="SearchLeft">
            <input v-model="searchTxt3" type="text" placeholder="标签名称" @keyup.enter="searchTag">
            <el-button type="default" style="padding: 5px 10px;" @click="searchTag">搜索</el-button>
          </div>
          <div class="SearchRight">
            <input v-model="searchTxt4" type="text" placeholder="人员姓名" @keyup.enter="searchMember">
            <el-button type="default" style="padding: 5px 10px;" @click="searchMember">搜索</el-button>
          </div>
        </div>
        <div style="clear: both"></div>
        <br>

        <div style="width:100%;border:1px solid #cdcdcd">
          <div id="TableDiv" class="Teacher_List_Table">
            <div style="width: 100%;height:calc(100% - 30px);overflow-y: auto;" v-loading="Gloading" element-loading-text="加载中。。。" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div class="MemberList">
                <div class="TopContentLeft MemberListLeft AddDepartment" id="DeptTopLength_4">
                  <el-tree :data="TagList" show-checkbox node-key="id" ref="tree2" empty-text="暂无数据" accordion check-strictly :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys" @node-click="handdleNodeClick2"
                    @check-change="handdleCheckChange2">
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
                      <td colspan="3">当前标签暂无人员</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div style="height:1px; margin: 10px auto;">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog6">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="submitUserList">确定</el-button>
    </div>
  </el-dialog>

  <!--人员选择-->
  <el-dialog :visible.sync="dialogVisible7" :title="titlename7" top="5%" @close="closeDialog7">
    <div class="Search">
      <div class="SearchRight4">
        <!--<el-radio v-model="radio1" label="0">当前开放人员</el-radio>-->
        <el-radio v-model="radio3" label="0">变动人员</el-radio>
      </div>
      <div class="SearchRight5">
        <input v-model="searchTxt1" type="text" placeholder="人员、部门名称" style="text-indent: 0.75em;" @input="searchMember2Input">
        <el-button type="default" style="padding: 5px 10px;" @click="searchMember2Btn">搜索</el-button>
      </div>
    </div>
    <div style="clear: both"></div>
    <br>

    <div style="width: 100%;height: 468px;overflow-x: hidden;border: 1px solid #cdcdcd;">
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 20%">姓名</th>
          <th style="width: 20%">部门</th>
          <th style="width: 20%">手机号</th>
          <th style="width: 20%">变动状态</th>
          <th style="width: 20%">选择</th>
        </tr>
        <!--<tr v-for="item in checkedUserList" v-if="hackReset">-->
        <tr v-for="item in currentUser" v-if="hackReset">
          <td>{{item.name}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.mobile}}</td>
          <td>新添加</td>
          <td><img @click="clearUser(item)" src="../../../../../static/img/close.png" style="cursor: pointer" alt=""></td>
        </tr>
      </table>
    </div>

    <div style="height:1px; margin: 10px auto;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog7">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmMember">确定</el-button>
    </div>
  </el-dialog>

  <!--添加分类-->
  <el-dialog :visible.sync="dialogVisible8" :title="titlename8" top="15%" style="width:80%;min-width:600px;margin:0 auto;" @close="closeDialog8">
    <el-form ref="form" :model="formSort" label-width="150px">
      <el-form-item label="" v-if="titlename8==='添加一级分类'">
        <span style="height: 40px;line-height: 40px;color:red;">* 注：须创建完整的三级分类可在APP中显示</span>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="formSort.name" id="sortname"></el-input>
      </el-form-item>
      <br />
      <el-form-item label="分类描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formSort.desc">
        </el-input>
      </el-form-item>
      <el-form-item label="所属上级分类" style="height:40px;" v-if="titlename8==='添加子分类'">
        <el-input style="width:400px;height:28px;" :disabled="true" v-model="formSort.sortname"></el-input>
      </el-form-item>
    </el-form>

    <div style="height:40px; margin: 10px auto;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog8">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="OnAddSort">添加</el-button>
    </div>
  </el-dialog>

  <!--添加讲师-->
  <el-dialog :visible.sync="dialogVisible9" title="添加讲师" top="15%" style="width:80%;min-width:600px;margin:0 auto;" @close="closeDialog9">
    <el-form ref="form" :model="formTeacher" label-width="150px">
      <el-form-item label="讲师姓名" style="width: 80%;">
        <el-input v-model="formTeacher.name" id="teachername"></el-input>
      </el-form-item>
      <el-form-item label="讲师头像" style="width: 80%;">
        <div class="show" style="width:150px;height:150px;float: left;">
          <img class="picture" :src="formTeacher.cover" :onerror="errorImg" width="100%" height="100%" />
        </div>
        <div class="choose upload" style="float:left;margin-left:10px;">
          <label title="选择图片" class="choose-btn">
            <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" style="display:none" @change="choosefile2">
            <span class="choose-file">选择图片</span>
          </label>
        </div>
      </el-form-item>
      <el-form-item label="讲师简介" style="width: 80%;">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="formTeacher.desc">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="OnAddTeacher">添加</el-button>
        <el-button type="primary" @click="closeDialog9">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <uppicture :aspectRatio="aspectRatio" :file="uploadfile" :position="position" @upload="upload" v-if="showBox"></uppicture>
</div>
</template>
<script>
import {
  formatDate
} from '@/util/util';
import {
  addcourse,
  addcategory,
  getcategory,
  getOnecategorys,
  addlecturer,
  getlecturer,
  getattach,
  addattach,
  getexample,
  getUserBy,
  getDepartmentAll,
  getDepartmentById,
  getTagList,
  getTagUser
} from '@/api/api';
import uppicture from '@/components/public/picture'
import UploadFile from '@/components/public/UploadFile'

export default {
  components: {
    uppicture,
    UploadFile
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible7: false,
      dialogVisible8: false,
      dialogVisible9: false,
      titlename6: '选择可见人员',
      titlename7: '人员选择',
      titlename8: '',
      data: [],
      dataL: [],
      dataW: [],
      Page2: '',
      form: {
        name: '',
        desc: '',
        cover: ''
      },
      myicons: '',
      files: '',
      qwe: '',
      imageUrl: '',
      icontof: true,
      ie9tof: navigator.userAgent.indexOf("MSIE 9.0") > 0,
      tof: true,
      Cid: '',
      Cname: '',
      CidBlock: '',
      CnameBlock: '',
      Lid: '',
      Lname: '',
      LidBlock: '',
      LnameBlock: '',
      qwe: 0,
      value: '',
      textarea: '',
      radio: '0',
      radio1: '0',
      radio2: '2',
      radio2Checked: false,
      radio3: '0',
      checkTxt: [{
          txt: '详情'
        },
        {
          txt: '目录'
        },
        {
          txt: '文档'
        }
        // { txt:'习题' }
      ],
      checkChoeseTxt: '',
      checkChoeseIndex: '',
      checkList: ['详情', '目录'],
      NotDis2: false,
      filepath: [{
        parent: 0,
        fileName: '全部文件'
      }],
      CourseData: [],
      tofAddfold: false,
      tofAddfoldTxt: '',
      type: true,
      Kid: '',
      Kname: '',
      KidBlock: '',
      KnameBlock: '',
      Wid: '',
      Wname: '',
      WidBlock: '',
      WnameBlock: '',

      Gloading: false,
      activeNames1: '200',
      userInfo: [],
      checkedUserList: [],
      checkIndex6: '',
      Page: [],
      pgLimit: 10,
      currentUser: [],
      hackReset: false,
      submitUser: [],
      str: '',
      checkedDept: [],
      checkedDeptNum: 0,
      searchTxt1: '',
      searchTxt2: '',
      searchTxt3: '',
      searchTxt4: '',
      openList: [],
      tempList: [],
      isSearchMem: false,
      defaultProps: {
        children: 'resList',
        label: 'name'
      },
      highlightkeys: 0,
      checkedDeptList: [],
      users: [],
      userInfo: [],
      userInfo2: [],
      clearDeptid: '',

      // add
      deptid: '',
      tagid: '',
      canRun: true,
      recursiveList: [],
      first: '',
      isFirst: true,
      isTag: false,
      activeName: 'dept', // active tag panel
      DepartmentList: [],
      TagList: [],
      formSort: {
        id: '',
        name: '',
        desc: '',
        sortname: ''
      },
      btnAddSrortFirst: true,
      btnAddSrortChild: true,
      btnChooseTeacher: true,
      checkSort: {},
      formTeacher: {
        name: '',
        cover: '',
        desc: ''
      },
      defaultId: window.localStorage.saascateid ? window.localStorage.saascateid : '',
      ThemeName: window.localStorage.saasThemeName ? window.localStorage.saasThemeName : '',
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      uploadfile: '',
      position: '',
      showBox: false,
      aspectRatio: 1
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {

    }
  },
  mounted: function() {
    document.querySelector('#livename input').focus();
    if (window.localStorage.getItem('saasteacherid') && window.localStorage.getItem('saasteachername')) {
      this.LidBlock = window.localStorage.getItem('saasteacherid');
      this.LnameBlock = window.localStorage.getItem('saasteachername');
    }

    getDepartmentAll().then(data => {
      if (data.resCode == 0) {
        this.DepartmentList = data.resList;
        getTagList({
          type: 1
        }).then(data => {
          if (data.resCode == 0) {
            this.Gloading = false;
            this.TagList = data.resList;
          } else {
            this.TagList = [];
          }
        });
      } else {
        this.DepartmentList = [];
      }
    });
  },
  methods: {
    choosefile(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      this.aspectRatio = 16 / 9;
      this.position = 'coursecover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    choosefile2(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(typeof files[0], files[0]);
      if (!files || !files[0]) {
        return;
      }
      this.aspectRatio = 1;
      this.position = 'teachercover';
      this.uploadfile = files[0];
      this.showBox = true;
    },
    upload(data) {
      console.log(data);
      if (data.position === 'coursecover') this.form.cover = data.url;
      if (data.position === 'teachercover') this.formTeacher.cover = data.url;
      this.showBox = false;
    },
    changeItemTxt(index, txt) {
      this.checkChoeseTxt = txt;
      this.checkChoeseIndex = index;
      this.dialogVisible5 = true;
    },
    OnchangeItemTxt() {
      for (var i = 0; i < this.checkTxt.length; i++) {
        if (i === this.checkChoeseIndex) {
          this.checkTxt[i].txt = this.checkChoeseTxt;
          this.checkList[i] = this.checkChoeseTxt;
          this.dialogVisible5 = false;
        }
      }
    },
    AddTeacher() {
      this.dialogVisible9 = true;
      setTimeout(function() {
        document.querySelector('#teachername input').focus();
      }, 20);
    },
    OnAddTeacher() {
      if (this.formTeacher.name === '') return this.openError('讲师姓名不能为空！')
      if (this.formTeacher.cover === '') return this.openError('讲师头像不能为空！')

      addlecturer({
        cover: this.formTeacher.cover,
        name: this.formTeacher.name,
        desc: this.formTeacher.desc
      }).then(data => {
        if (data.success) {
          this.formTeacher.cover = '';
          getlecturer().then(data2 => {
            if (data2.success && data2.resList) this.dataL = data2.resList;
            else this.openError('出错了！');
            this.dialogVisible9 = false;
            this.hack();
          });
        } else {
          this.openError(data.resMsg)
        }
      })
    },
    OnAddCourse() {
      if (/^\s+$/.test(this.form.name)) return this.openError(this.ThemeName + '名称不能全部为空格！');
      // this.successRes(1);      // 测试，跳过图片上传是的跨域问题
      if (this.form.cover === "") {
        return this.openError('请选择图片');
      } else {
        if (this.CnameBlock === '') return this.openError(this.ThemeName + '分类不能为空');
        // if (this.LnameBlock === '') return this.openError('请选择讲师');

        var lastList = [];
        // for(var i=0;i<4;i++){
        for (var i = 0; i < this.checkList.length; i++) {
          for (var j = 0; j < this.checkList.length; j++) {
            if (this.checkTxt[i].txt === this.checkList[j]) {
              lastList[lastList.length] = {
                type: (i + 1),
                name: this.checkList[j],
                status: 0,
                sort: (i + 1)
              }
            }
          }
        }
        var loginParams = {
          name: this.form.name,
          desc: this.form.desc,
          cover: this.form.cover,
          category: this.CidBlock,
          lecturer: this.LidBlock,
          liveFlag: this.radio,
          descType: this.radio1,
          attach: this.KidBlock,
          warehouse: this.WidBlock,
          courseMenu: lastList,
          visit: this.radio2,
          visitUJson: this.str,
          status: 1
        };
        addcourse(loginParams).then(data => {
          // console.log(data);
          if (data.success) {
            this.$router.push('/CourseList');
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
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
    GOCourseList() {
      this.$router.push('/CourseList');
    },
    ChooseFile(data) {
      this.KidBlock = data.id;
      this.KnameBlock = data.name;
      this.dialogVisible3 = data.visible;
    },
    CloseChooseFile(data) {
      this.dialogVisible3 = data;
    },
    ChoeseC() {
      this.dialogVisible = true;
      getOnecategorys(this.defaultId).then(data => {
        // console.log(data);
        if (data.success) {
          if (data.resList !== undefined) {
            this.data = data.resList;
            for (var i = 0; i < this.data.length; i++) {
              let ONE = this.data[i];
              if (ONE.resList !== undefined) {
                ONE.hasChild = false;
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
        this.hack();
      })
    },
    ChoeseL() {
      this.dialogVisible2 = true;
      getlecturer().then(data => {
        if (data.resList) {
          this.dataL = data.resList;
          if (data.resList !== undefined) {
            for (var i = 0; i < this.dataL.length; i++) {
              this.dataL[i].checked = false;
            }
          }
          this.btnChooseTeacher = true;
          this.hack();
        }
      });
    },
    CancleChoeseL() {
      this.LnameBlock = '';
      this.LidBlock = '';
    },
    TreeClick(item) {
      let id = item.id;
      let name = item.name;
      let desc = item.desc;
      this.Cname = name;
      this.Cid = id;
      this.checkSort = item;

      if (this.data !== undefined) {
        for (var i = 0; i < this.data.length; i++) {
          let ONE = this.data[i];
          ONE.rofShadow = ONE.id === item.id ? true : false;
          if (ONE.id === item.id) {
            ONE.hasChild = ONE.hasChild ? false : true;
            this.btnAddSrortFirst = true; // 设置提交按钮不可用，不能关联一级分类
            this.btnAddSrortChild = false; // 设置添加子分类可用
          }
          if (ONE.resList) {
            for (var j = 0; j < ONE.resList.length; j++) {
              let TWO = ONE.resList[j];
              TWO.rofShadow = TWO.id === item.id ? true : false;
              if (TWO.id === item.id) {
                this.btnAddSrortFirst = false; // 设置提交按钮可用，可以关联二级分类
                this.btnAddSrortChild = true; // 设置添加子分类不可用
              }
            }
          }
        }
      }
      this.hack();
    },
    TreeClickL(data) {
      this.Lname = data.name;
      this.Lid = data.id;
      for (var i = 0; i < this.dataL.length; i++) {
        if (this.dataL[i].id === data.id) {
          if (this.dataL[i].checked) {
            this.dataL[i].checked = false;
          } else {
            this.dataL[i].checked = true;
          }
        } else {
          this.dataL[i].checked = false;
        }
      }
      this.btnChooseTeacher = false;
      this.hack();
    },
    choeseTrue() {
      this.dialogVisible = false;
      this.CnameBlock = this.Cname;
      this.CidBlock = this.Cid;
    },
    choeseTrueL() {
      this.dialogVisible2 = false;
      this.LnameBlock = this.Lname;
      this.LidBlock = this.Lid;
    },
    choeseTrueW() {
      var isAutoSend = document.getElementsByName('Fruit');
      for (var i = 0; i < isAutoSend.length; i++) {
        if (isAutoSend[i].checked == true) {
          this.WidBlock = isAutoSend[i].value;
          for (var i = 0; i < this.dataW.length; i++) {
            if (this.dataW[i].id === parseInt(this.WidBlock)) {
              this.WnameBlock = this.dataW[i].name;
            }
          }
          this.dialogVisible4 = false;
        }
      }
    },
    Ongetexample(txt, num) {
      var loginParams = {
        name: txt,
        pgPageNum: num
      };
      getexample(loginParams).then(data => {
        // console.log(data);
        this.Page2 = data;
        if (data.resList !== undefined) {
          this.NotDis = false;
          this.dataW = data.resList;
        } else {
          // this.NotDis = true;
          this.openError(data.resMsg);
        }
        // this.Gloading = false;
      })
    },
    show(ev) {
      if (ev.keyCode === 13) {
        this.Ongetexample(this.searchTxt2, 0);
      }
    },
    handleCurrentChange2(currentPage) {
      this.Ongetexample(this.searchTxt2, currentPage);
    },
    getwarehouseproblemsnull() {
      if (this.searchTxt2 === '') {
        this.Ongetexample('', 0);
      }
    },
    ChoeseW() {
      this.dialogVisible4 = true;
      this.Ongetexample();
    },
    ChoeseK() {
      var loginParams = {
        parent: 0
      };
      getattach(loginParams).then(data => {
        // console.log(data);
        if (data.resList) {
          this.CourseData = data.resList;
          if (data.resList.length !== 0) {
            this.NotDis2 = false;
            for (var i = 0; i < this.CourseData.length; i++) {
              var date = new Date(this.CourseData[i].updateTime);
              this.CourseData[i].tofdis = false;
              this.CourseData[i].choeseF = false;
              this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          } else {
            this.NotDis2 = true;
          }
        } else {
          this.openError(data.resMsg);
        }
        this.dialogVisible3 = true;
      })
    },
    CancleChoeseK() {
      this.KidBlock = '';
      this.KnameBlock = '';
    },
    AddSort() {
      this.titlename8 = '添加分类';
      this.dialogVisible8 = true;
      this.formSort.id = window.localStorage.saascateid !== '' ? window.localStorage.saascateid : '';
      this.formSort.sortname = '默认分类';
      setTimeout(function() {
        document.querySelector('#sortname input').focus();
      }, 20);
    },
    AddSortChild() {
      this.titlename8 = '添加子分类';
      this.dialogVisible8 = true;
      this.formSort.id = this.checkSort.id;
      this.formSort.sortname = this.checkSort.name;
      setTimeout(function() {
        document.querySelector('#sortname input').focus();
      }, 20);
    },
    OnAddSort() {
      var loginParams = {
        parent: this.formSort.id,
        name: this.formSort.name,
        desc: this.formSort.desc
      };
      addcategory(loginParams).then(data => {
        if (data.success) {
          this.ChoeseC();
          this.checkSort = {};
          this.formSort.id = '';
          this.formSort.name = '';
          this.formSort.desc = '';
          this.btnAddSrortChild = true;
        } else {
          this.openError(data.resMsg);
        }
        this.dialogVisible8 = false;
      })
    },
    addfold() {
      this.NotDis2 = false;
      this.tofAddfold = true;
      setTimeout(function() {
        document.getElementById('myinput').focus();
      }, 20);
    },
    addpath() {
      this.KidBlock = this.Kid;
      this.KnameBlock = this.Kname;
      this.Kid = '';
      this.Kname = '';
      this.dialogVisible3 = false;
      this.qwe++;
    },
    choesepath(id, type, name) {
      if (type === 5) {
        this.Kid = '';
        this.Kid = '';
        this.type = true;
      } else {
        this.Kid = id;
        this.Kname = name;
        this.type = false;
      }
      for (var i = 0; i < this.CourseData.length; i++) {
        if (this.CourseData[i].id === id) {
          this.CourseData[i].choeseF = true;
          this.qwe++;
        } else {
          this.CourseData[i].choeseF = false;
        }
      }
    },
    OnAttach() {
      var loginParams = {
        parent: this.filepath[this.filepath.length - 1].parent,
        name: this.tofAddfoldTxt,
        type: 5
      };
      this.tofAddfold = false;
      this.tofAddfoldTxt = '';
      if (loginParams.name !== '') {
        addattach(loginParams).then(data => {
          if (data.success) {
            var loginParams = {
              parent: this.filepath[this.filepath.length - 1].parent
            };
            getattach(loginParams).then(data => {
              if (data.success) {
                // this.filepath[this.filepath.length] = {
                //   parent: id,
                //   fileName: name
                // }
                if (data.resList !== undefined) {
                  this.NotDis2 = false;
                  this.CourseData = data.resList;
                  for (var i = 0; i < this.CourseData.length; i++) {
                    var date = new Date(this.CourseData[i].updateTime);
                    this.CourseData[i].tofdis = false;
                    this.CourseData[i].choeseF = false;
                    this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
                  }
                } else {
                  this.NotDis2 = true;
                }
              } else {
                this.openError(data.resMsg);
              }
            })
          } else {
            this.openError(data.resMsg);
          }
        })
      } else {
        this.NotDis2 = true;
      }
    },
    gopath(id, name, type) {
      if (type === 5) {
        // this.openError(id+"--"+name+"-"+type);
        var loginParams = {
          parent: id
        };
        getattach(loginParams).then(data => {
          if (data.resList) {
            this.filepath[this.filepath.length] = {
              parent: id,
              fileName: name
            }
            this.CourseData = data.resList;
            if (this.CourseData !== undefined) {
              for (var i = 0; i < this.CourseData.length; i++) {
                var date = new Date(this.CourseData[i].updateTime);
                this.CourseData[i].tofdis = false;
                this.CourseData[i].choeseF = false;
                this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
              }
            }
          } else {
            this.openError(data.resMsg);
          }
        });
      }
    },
    backpath(id) {
      var temp = [];
      for (var i = 0; i < this.filepath.length; i++) {
        if (this.filepath[i].parent !== id) {
          temp[i] = this.filepath[i];
        } else {
          temp[i] = this.filepath[i];
          this.filepath = [];
          this.filepath = temp;
          break;
        }
      }

      var loginParams = {
        parent: id
      };
      getattach(loginParams).then(data => {
        if (data.resList) {
          this.CourseData = data.resList;
          if (this.CourseData !== undefined) {
            for (var i = 0; i < this.CourseData.length; i++) {
              var date = new Date(this.CourseData[i].updateTime);
              this.CourseData[i].tofdis = false;
              this.CourseData[i].choeseF = false;
              this.CourseData[i].updatetime = formatDate(date, 'yyyy-MM-dd hh:mm');
            }
          }
        } else {
          this.openError(data.resMsg);
        }
      })
    },
    verification() {},

    // Add methods
    checkUserInfo(tabname) {
      if (tabname == 'dept') {
        this.userInfo.forEach(item => {
          item['isCheck'] = false;
          this.checkedUserList.forEach(i => {
            if (i.id == item.id && (i.status == 11 || i.status == 12)) {
              item['isCheck'] = true; // 渲染已选择的人员，标记为true
            }
          });
        });
        if (this.deptid != '') this.checkDept(this.deptid);
      }
      if (tabname == 'tag') {
        this.userInfo2.forEach(item => {
          item['isCheck'] = false;
          this.checkedUserList.forEach(i => {
            if (i.id == item.id && (i.status == 11 || i.status == 12)) {
              item['isCheck'] = true; // 渲染已选择的人员，标记为true
            }
          });
        });
      }
      this.showChange();
    },
    handdleTabClick(tab, event) {
      this.searchTxt3 = '', this.searchTxt4 = '';
      this.checkUserInfo(tab.name);
    },
    recursive(item) {
      if (item.resList && item.resList != '') {
        item.resList.forEach(item2 => {
          this.recursiveList.push(item2.id);
          this.recursive(item2);
        });
      } else {
        return this.recursiveList;
      }
    },
    setCheck(id, flag1, flag2) {
      this.$refs.tree.setChecked(id, flag1, flag2);
    },
    setCheck2(id, flag1, flag2) {
      this.$refs.tree2.setChecked(id, flag1, flag2);
    },
    hack() {
      // console.log('hack it!');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    showChange() {
      this.currentUser = this.checkedUserList.filter(function(e) {
        return e.status == 11 || e.status == 12;
      });
      this.hack();
    },

    // choose by dept
    handdleNodeClick(data, node, leaf) {
      this.deptid = data.id;
      this.getuser({
        deptid: data.id
      });
      this.isFirst = true;
    },
    handdleCheckChange(data, checked, leafChecked) {
      // console.log(data, checked, leafChecked);
      this.deptid = data.id;
      this.recursiveList = [];
      this.recursive(data);
      if (this.isFirst) this.first = data.id;
      this.isFirst = false; // 设置this.isFirs的布尔值来判断是否是当前勾选的部门
      // console.log('this.canRun',this.canRun,'this.isFirst',this.isFirst);
      if (checked) {
        // console.log('first');
        if (this.canRun) {
          // console.log('check 2223');
          if (this.$refs.tree.getCheckedKeys().indexOf(data.id) < 0) {
            this.setCheck(data.id, true, false);
          }
          for (let i = 0; i < this.recursiveList.length; i++) {
            let item = this.recursiveList[i];
            if (this.$refs.tree.getCheckedKeys().indexOf(item) < 0) {
              this.setCheck(item, true, false);
            }
          }

          this.checkUsers(data.id, leafChecked);
        }
      } else {
        if (this.canRun) {
          // console.log('uncheck 2223');
          if (this.$refs.tree.getCheckedKeys().indexOf(data.id) > -1) {
            this.setCheck(data.id, false, false);
          }
          this.recursiveList.forEach(item => {
            // console.log('set child false');
            if (this.$refs.tree.getCheckedKeys().indexOf(item) > -1) {
              this.setCheck(item, false, false);
            }
          });

          this.checkedUserList.forEach(item => {
            if (item.deptid == data.id) {
              // console.log('uc');
              item.status = 120;
            }
          });
          this.getuser({
            deptid: this.first
          });
          // console.log('this.first',this.first);
        }
      }
      this.canRun = true; // 函数节流，通过改变this.canRun的布尔值来拦截勾选部门人员导致部门勾选状态发生变化
    },
    checkUsers(deptid, leafChecked) {
      getUserBy({
        deptid: deptid
      }).then(data => {
        if (data.resList) {
          // this.userInfo = data.resList;
          data.resList.forEach(item => {
            item['isCheck'] = true;
            item['status'] = 12;
            item['deptid'] = deptid;
            getDepartmentById(deptid).then(data => {
              if (data.name) {
                item['deptName'] = data.name;

                // console.log(this.checkedUserList);
                if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
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

              // console.log("this.isFirst",this.isFirst);
              this.getuser({
                deptid: this.first
              });
            });
          });
        } else {
          this.isFirst = true;
          this.userInfo = [];
        }
      });
    },
    getuser(params) {
      // this.checkDept(this.deptid);
      getUserBy(params).then(data => {
        if (data.resList) {
          this.userInfo = data.resList;
          this.userInfo.forEach(item => {
            item['isCheck'] = false;
            this.checkedUserList.forEach(i => {
              if (i.id == item.id && (i.status == 11 || i.status == 12)) {
                item['isCheck'] = true; // 渲染已选择的人员，标记为true
              }
            });

            this.showChange();
            this.canRun = true;
          });
        } else {
          this.userInfo = [];
        }
      });
    },
    checkUser(item) {
      // item.status 11：新添加, 110：新添加待删除
      // item.status 12：新添加未确定, 120：新添加未确定待删除
      var id = this.deptid;
      if (!item.isCheck) {
        // console.log('check');
        item['isCheck'] = true;
        item['status'] = 12;
        item['deptid'] = id;
        getDepartmentById(id).then(data => {
          if (data.name) {
            item['deptName'] = data.name;

            // console.log(this.checkedUserList);
            // console.log(JSON.stringify(this.checkedUserList));
            if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
              // console.log('push');
              this.checkedUserList.push(item);
            } else {
              this.checkedUserList.forEach(item2 => {
                if (item2.id == item.id) {
                  item2.status = 12;
                  if (item2.name.indexOf(item.name) < 0) {
                    item2.name += ' ' + item.name;
                  }
                }
              });
            }
            this.showChange();
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
      this.hack();
    },
    checkDept(id) {
      var name, len_1, len_2;
      // let keys = this.$refs.tree.getCheckedKeys();
      let keys = [];
      if (this.$refs.tree.getCheckedKeys() != '') keys = this.$refs.tree.getCheckedKeys();
      getDepartmentById(id).then(data => {
        if (data.name) {
          name = data.name;
          if (this.checkedUserList != '') {
            len_1 = this.checkedUserList.filter(function(e) {
              return (e.status == 10 || e.status == 11 || e.status == 12) && e.deptName.indexOf(name) > -1;
            }).length;
            if (this.userInfo) len_2 = this.userInfo.length;
            else len_2 = -1;
            if (len_1 != len_2) {
              // console.log(1111);
              if (keys.indexOf(id) > -1) {
                this.$refs.tree.setChecked(id, false, false);
                this.canRun = false; // this.canRun：函数节流
              }
            } else {
              // console.log(2221);
              if (keys.indexOf(id) < 0) {
                this.$refs.tree.setChecked(id, true, false);
                this.canRun = false; // this.canRun：函数节流
              }
            }
          }

          this.hack();
        }
      });
    },
    checkDept2(id) {
      var name, len_1, len_2;
      let keys = this.$refs.tree.getCheckedKeys();
      getDepartmentById(id).then(data => {
        if (data.name) {
          name = data.name;
          if (this.checkedUserList != '') {
            len_1 = this.checkedUserList.filter(function(e) {
              return (e.status == 10 || e.status == 11 || e.status == 12) && e.deptName.indexOf(name) > -1;
            }).length;
            if (this.userInfo) len_2 = this.userInfo.length;
            else len_2 = -1;
            if (len_1 != len_2) {
              // console.log(1111);
              if (keys.indexOf(id) > -1) {
                this.$refs.tree.setChecked(id, false, false);
                this.canRun = false; // this.canRun：函数节流
              }
            } else {
              // console.log(2221);
              if (keys.indexOf(id) < 0) {
                this.$refs.tree.setChecked(id, true, false);
                this.canRun = false; // this.canRun：函数节流
              }
            }
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

      this.clearDeptid = item.deptid;
      this.hack();

      var params = {
        deptid: this.deptid
      };
      this.getuser(params);
    },

    // choose by tag
    getTagUser(item) {
      getTagUser({
        tid: item.id
      }).then(data => {
        // console.log(data);
        this.Gloading = false;
        if (data.resCode == 0) {
          this.userInfo2 = data.ulist;
        } else {
          this.userInfo = [];
        }
        this.hack();
      });
    },
    handdleNodeClick2(data, node, leaf) {
      // console.log(data, node);
      this.tagid = data.id;
      this.getuser2({
        tid: data.id
      });
    },
    handdleCheckChange2(data, checked, leafChecked) {
      this.tagid = data.id;
      if (checked) {
        this.checkUsers2(data);
      } else {
        this.checkedUserList.forEach(item => {
          if (item.tagid == data.id) {
            if (item.status == 10) item.status = 100;
            if (item.status == 11) item.status = 110;
            if (item.status == 12) item.status = 120;
          }
        });
        this.getuser2({
          tid: data.id
        });
        this.showChange();
      }
    },
    getuser2(params) {
      // this.checkDept(this.deptid);
      getTagUser(params).then(data => {
        // console.log(data.ulist);
        if (data.ulist) {
          this.userInfo2 = data.ulist;
          this.userInfo2.forEach(item => {
            item['isCheck'] = false;
            this.checkedUserList.forEach(i => {
              if (i.id == item.id && (i.status == 11 || i.status == 12)) {
                item['isCheck'] = true; // 渲染已选择的人员，标记为true
              }
            });

            this.showChange();
          });
        } else {
          this.userInfo2 = [];
        }
      });
    },
    checkUsers2(tag) {
      getTagUser({
        tid: tag.id
      }).then(data => {
        // console.log(data.ulist);
        if (data.ulist) {
          this.userInfo2 = data.ulist;
          data.ulist.forEach(item => {
            item['isCheck'] = true;
            item['status'] = 12;
            if (item.deptList) {
              item['deptid'] = item.deptList[0].id;
              item['deptName'] = item.deptList[0].name;
            }
            item['tagid'] = tag.id;
            item['tagName'] = tag.name;

            // console.log(this.checkedUserList);
            if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
              // console.log('push item');
              this.checkedUserList.push(item);
            } else {
              this.checkedUserList.forEach(item2 => {
                if (item2.id == item.id) {
                  // console.log('change item ');
                  // item2.status = 12;
                  if (item2.status == 100) item2.status = 10;
                  if (item2.status == 110) item2.status = 11;
                  if (item2.status == 120) item2.status = 12;
                  if (item2.deptName.indexOf(item.deptName) < 0) {
                    // console.log('add deptName');
                    item2.deptName += ' ' + item.deptName;
                  }
                }
              });
            }

            this.showChange();
          });
        } else {
          this.userInfo2 = [];
        }
      });
    },

    chooseCanSeeMember() {
      this.dialogVisible6 = true;
      if (this.deptid != '') {
        var params = {
          deptid: this.deptid
        };
        this.getuser(params);
      }
      this.hack();
    },
    closeDialog6() {
      this.dialogVisible6 = false;

      for (var i = 0; i < this.checkedUserList.length; i++) {
        if (this.checkedUserList[i].status == 12) {
          this.checkedUserList.splice(i, 1);
          i--;
        }
      }
      for (var i = 0; i < this.checkedUserList.length; i++) {
        if (this.checkedUserList[i].status == 110) {
          this.checkedUserList[i].status = 11;
        }
      }
      this.showChange();
    },
    closeDialog6_2() {
      this.dialogVisible6 = false;
    },
    closeDialog7() {
      this.dialogVisible7 = false;
      this.checkUserInfo(this.$refs.tab.currentName);
    },
    closeDialog8() {
      this.dialogVisible8 = false;
    },
    closeDialog9() {
      this.dialogVisible9 = false;
    },
    confirmMember() {
      // 监测部门人员是否全部勾选，若有一人未勾选则取消勾选部门
      this.checkDept(this.clearDeptid);
      this.dialogVisible7 = false;
      this.checkUserInfo(this.$refs.tab.currentName);
    },
    moreMember() {
      // console.log(this.checkedUserList);
      if (!this.dialogVisible7) {
        this.dialogVisible7 = true;
      }
      this.showChange();
    },
    arrDistinct(arr) {
      var result = [];
      arr.forEach(function(v, i, arr) { //这里利用map，filter方法也可以实现
        var bool = arr.indexOf(v, i + 1); //从传入参数的下一个索引值开始寻找是否存在重复
        if (bool === -1) {
          result.push(v);
        }
      })
      return result;
    },
    submitUserList() {
      if (this.checkedUserList.length > 0) {
        this.submitUser = []; // clear submitUser
        for (var i = 0; i < this.checkedUserList.length; i++) {
          var item = this.checkedUserList[i];
          if (item.status == 120) {
            this.checkedUserList.splice(i, 1);
            i--;
          }
        }

        this.checkedUserList.forEach(item => {
          item.status = 11;
          this.submitUser.push({
            "id": item.id
          });
        });

        this.radio2 = '1';
        this.radio2Checked = true;
        this.checkedDeptNum = this.arrDistinct(this.checkedDept).length;
      } else {
        this.radio2 = '1';
        this.radio2Checked = false;
      }

      this.str = JSON.stringify(this.submitUser); // 数组转换成json数据提交给后端接口
      // console.log(this.str);
      this.dialogVisible6 = false;
      this.hack();
    },
    reverseDept(item) {
      if (this.$refs.tree.store.nodesMap[item.parent] != undefined) {
        this.$refs.tree.store.nodesMap[item.parent].expanded = true;
        if (this.$refs.tree.store.nodesMap[item.parent].data.parent != 0) {
          this.reverseDept(this.$refs.tree.store.nodesMap[item.parent].data);
        } else {
          return;
        }
      }
    },
    recursiveDept(data) {
      if (data.resList != '') {
        for (let i = 0; i < data.resList.length; i++) {
          let item = data.resList[i];
          let result = item.name.match(this.searchTxt3);
          if (result != null) {
            this.highlightkeys = item.id;
            this.reverseDept(item); // 循环展开上级部门
            this.deptid = item.id;
            this.getuser({
              deptid: item.id
            });
            document.getElementById('DeptTopLength_4').scrollTop = 50 * i;
            return;
          } else {
            this.recursiveDept(item);
          }
        }
      } else {
        return;
      }
    },
    searchDept() {
      if (this.searchTxt3 != '') {
        for (let i = 0; i < this.DepartmentList.length; i++) {
          let item = this.DepartmentList[i];
          let result = item.name.match(this.searchTxt3);
          if (result != null) {
            this.highlightkeys = item.id;
            this.reverseDept(item); // 循环展开上级部门
            this.$refs.tree.store.nodesMap[item.id].expanded = true;
            this.deptid = parseInt(item.id);
            var params = {
              deptid: parseInt(item.id)
            };
            this.getuser(params);
            document.getElementById('DeptTopLength_4').scrollTop = 50 * i;
            return;
          } else {
            this.recursiveDept(item);
          }
        };
      } else this.openError('请先输入部门名称再搜索！')
    },
    searchTag() {
      if (this.searchTxt3 != '') {
        for (let i = 0; i < this.TagList.length; i++) {
          let item = this.TagList[i];
          let result = item.name.match(this.searchTxt3);
          if (result != null) {
            this.highlightkeys = item.id;
            this.tagid = item.id;
            this.getuser2({
              tid: item.id
            });
            document.getElementById('DeptTopLength_4').scrollTop = 50 * i;
            return;
          }
        };
        this.openError('暂未搜索到相关标签！')
      } else this.openError('请先输入标签名称再搜索！');
    },
    getSearchUser(params, id) {
      getUserBy(params).then(data => {
        if (data.resList) {
          this.tempList = data;
          this.userInfo = this.tempList.resList.filter(function(e) {
            return e.id == id;
          });
          if (this.userInfo) {
            this.userInfo.forEach(item => {
              item['isCheck'] = false;
              var index = item.id;
              this.checkedUserList.forEach(i => {
                if (i.id == index) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                  // i['status'] = '新添加';  // 设置submit提交后的人员状态为 '已选择' 改为 '新添加'
                }
              });
            });
          }

          this.hack();
        }
      });
    },
    getSearchUser2(id) {
      this.userInfo2 = this.userInfo2.filter(function(e) {
        return e.id == id
      });
      if (this.userInfo2) {
        this.userInfo2.forEach(item => {
          item['isCheck'] = false;
          var index = item.id;
          this.checkedUserList.forEach(i => {
            if (i.id == index) {
              item['isCheck'] = true; // 渲染已选择的人员，标记为true
              // i['status'] = '新添加';  // 设置submit提交后的人员状态为 '已选择' 改为 '新添加'
            }
          });
        });
      }

      this.hack();
    },
    searchMember() {
      let tagName = this.$refs.tab.currentName;
      if (tagName == 'dept') {
        if (this.deptid != '') {
          if (this.searchTxt4 != '' && this.userInfo) {
            for (var i = 0; i < this.userInfo.length; i++) {
              var item = this.userInfo[i];
              var result = item.name.match(this.searchTxt4);
              var result2 = item.mobile.match(this.searchTxt4);
              if (result != null || result2 != null) {
                var params = {
                  deptid: this.deptid
                };
                this.getSearchUser(params, item.id);
                this.isSearchMem = true;
              }
            }
          } else this.openError('请先输入关键字再搜索相关人员！')
        } else this.openError('请搜索部门再搜索相关人员！')
      } else {
        if (this.tagid != '') {
          if (this.searchTxt4 != '' && this.userInfo2) {
            for (var i = 0; i < this.userInfo2.length; i++) {
              var item = this.userInfo2[i];
              var result = item.name.match(this.searchTxt4);
              var result2 = item.mobile.match(this.searchTxt4);
              if (result != null || result2 != null) {
                this.getSearchUser2(item.id);
                this.isSearchMem = true;
              }
            }
          } else this.openError('请先输入关键字再搜索相关人员！')
        } else this.openError('请搜索标签再搜索相关人员！')
      }
    },
    searchMember2() {
      this.tempList = this.checkedUserList.filter(function(e) {
        return e.status == 12 || e.status == 12
      });
      var temp = [];
      var result1, result2, result3;
      this.tempList.forEach(item => {
        result1 = item.name ? item.name.match(this.searchTxt1) : null;
        result2 = item.deptName ? item.deptName.match(this.searchTxt1) : null;
        result3 = item.mobile ? item.mobile.match(this.searchTxt1) : null;
        if (result1 != null || result2 != null || result3 != null) {
          temp.push(item);
        }
      });
      this.currentUser = temp;
      this.hack();
    },
    searchMember2Input() {
      if (this.searchTxt1 != '') {
        this.searchMember2();
      } else {
        this.currentUser = this.checkedUserList.filter(function(e) {
          return e.status == 12 || e.status == 12
        });
      }
    },
    searchMember2Btn() {
      if (this.searchTxt1 != '') {
        this.searchMember2();
      } else this.openError('请先输入人员或部门名称再搜索相关人员！')
    },
    handleCurrentChange(currentPage) {
      this.currentUser = this.checkedUserList.slice((currentPage - 1) * this.pgLimit, (currentPage - 1) * this.pgLimit + this.pgLimit);
    }
  }
}
</script>
<style>
.custom-tree-node span:nth-child(1) {
  float: right;
}

.a {
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  border: 1px solid #bfcbd9;
  background: #FFFFFF;
}
</style>
