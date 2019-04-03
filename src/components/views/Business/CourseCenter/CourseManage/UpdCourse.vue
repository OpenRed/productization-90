<template>
<div style="width:100%;height:100%;">
  <div>
    <div class="TopName W95"><i class="el-icon-close" style="margin-right:10px;cursor: pointer;" @click="GOCourseList"></i>修改{{ThemeName}}</div>
  </div>
  <div class="TopLine"></div>
  <!-- <br/> -->
  <el-form ref="form" :model="form" label-width="100px" style="overflow-y: auto;height:calc(100% - 100px);padding-top:10px">
    <el-form-item :label="ThemeName+'名称'">
      <el-input v-model="form.name" style="width: 438px;" id="name" @change="verification"></el-input>
    </el-form-item>
    <el-form-item :label="ThemeName+'封面'">
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
      <el-input style="width:280px;height:28px;" :disabled="true" v-model="LecturerName" @change="verification"></el-input>
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
        <span v-for="(CT,index) in checkTxt">
          <el-checkbox :label="CT.name" :disabled="index === 0 || index === 1" style="width:20px;height:40px;overflow:hidden;float:left"></el-checkbox>
          <div style="height:40px;float:left;margin-left:6px;margin-right:10px">{{CT.name}}</div>
          <i class="el-icon-edit" style="float:left;margin-right:10px;height:35px;line-height:35px;cursor: pointer;color:#8E8E8E" @click="changeItemTxt(index,CT.name)"></i>
        </span>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="可见范围" style="margin-bottom: 0">
      <el-radio v-model="radio3" label="0">全部内部人员可见</el-radio>
      <el-radio v-model="radio3" label="1">指定人员可见</el-radio>
      <el-radio v-model="radio3" label="2">对外公开</el-radio>
    </el-form-item>
    <el-form-item>
      <span v-if="radio3=='0'">企业内部全部人员可见</span>
      <span v-if="radio3=='1'&&radio3Checked"><span style="color: #20a0ff;cursor: pointer">添加指定人员可见</span></span>
      <span v-if="radio3=='1'&&!radio3Checked">
        <span v-if="checkedUserList==''">
          <span style="color: #20a0ff;cursor: pointer" @click="moreCheckedMember">添加指定人员可见</span>
        </span>
        <span v-else>
          已开放
          <span style="color: #20a0ff;cursor: pointer" @click="moreCheckedMember">
            <!--{{this.checkedUserList.filter(function(e){ return e.status==10||e.status==11; }).length}} 个人员-->
            {{this.checkedUser.length}} 个人员
          </span>
          有观看该{{ThemeName}}权限
        </span>
      </span>
      <span v-if="radio3=='2'">所有人员可见</span>
    </el-form-item>
    <el-form-item label="简介类型">
      <el-radio v-model="radio1" label="0">标题+讲师信息+文字（标题和讲师信息系统自动生成）</el-radio><br />
      <el-radio v-model="radio1" label="1">标题+讲师信息+html（标题和讲师信息系统自动生成）</el-radio><br />
      <el-radio v-model="radio1" label="2">html（{{ThemeName}}标题和讲师信息不会自动生成）</el-radio>
    </el-form-item>
    <el-form-item :label="ThemeName+'简介'" style="width: 485px;">
      <el-input type="textarea" autosize placeholder="请输入内容" @change="verification" v-model="form.desc">
      </el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width:120px" @click="OnUpdCourse">提交</el-button>
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
    <div style="width:100%;height:300px;overflow-y: auto;border:1px solid #cdcdcd">
      <div style="width:100%;" v-for="One in data" v-if="hackReset">
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
    <div slot="footer" style="height:40px;display:block;">
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
      <div style="width:100%;height:40px;" v-for="One in dataL" v-if="hackReset">
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
  <el-dialog :visible.sync="dialogVisible6" :title="titlename6" top="5%" :before-close="closeDialog6">
    <el-tabs v-model="activeName" ref="tab" @tab-click="handdleTabClick" style="margin-top:-20px;">
      <el-tab-pane label="部门" name="dept">
        <br>
        <div style="width:100%; margin-top: -20px; padding: 8px 0;">
          <span>已选择 {{checkedUser.length}} 人</span>
          <span style="margin-left: 15px;" v-if="visitUser.length===0">
            <a href="javascript:;" @click="moreMember">查看更多</a>
          </span>
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
                <div class="TopContentLeft MemberListLeft AddDepartment" id="DeptTopLength_3">
                  <el-tree :data="DepartmentList" show-checkbox node-key="id" :default-checked-keys="checkedDeptList" ref="tree" empty-text="暂无数据" accordion check-strictly :indent="20" :highlight-current="true" :props="defaultProps"
                    :current-node-key="highlightkeys" @node-click="handdleNodeClick" @check-change="handdleCheckChange">
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
                      <td v-if="visitUser.length!=0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else checked="checked" type="checkbox" @click="checkUser(item)">
                      </td>
                      <td v-if="visitUser.length==0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                      </td>
                    </tr>
                    <tr v-for="item in userInfo" v-if="isSearchMem">
                      <td>{{item.name}}</td>
                      <td>{{item.mobile}}</td>
                      <td v-if="visitUser.length!=0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item, 1)">
                        <input v-else checked="checked" type="checkbox" @click="checkUser(item)">
                      </td>
                      <td v-if="visitUser.length==0">
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
        <div style="width:100%; margin-top: -20px; padding: 8px 0;">
          <!--<span>已选择 {{checkedUserList.filter(function(e){return e.status==10||e.status==11||e.status==12}).length}} 人</span>-->
          <span>已选择 {{checkedUser.length}} 人</span>
          <span style="margin-left: 15px;" v-if="visitUser.length===0">
            <a href="javascript:;" @click="moreMember">查看更多</a>
          </span>
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
                <div class="TopContentLeft MemberListLeft AddDepartment" id="DeptTopLength_3">
                  <el-tree :data="TagList" show-checkbox node-key="id" :default-checked-keys="checkedDeptList" ref="tree2" empty-text="暂无数据" accordion check-strictly :indent="20" :highlight-current="true" :props="defaultProps" :current-node-key="highlightkeys"
                    @node-click="handdleNodeClick2" @check-change="handdleCheckChange2">
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
                      <td v-if="visitUser.length!=0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else checked="checked" type="checkbox" @click="checkUser(item)">
                      </td>
                      <td v-if="visitUser.length==0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else type="checkbox" checked="checked" @click="checkUser(item)">
                      </td>
                    </tr>
                    <tr v-for="item in userInfo2" v-if="isSearchMem">
                      <td>{{item.name}}</td>
                      <td>{{item.mobile}}</td>
                      <td v-if="visitUser.length!=0">
                        <input v-if="!item.isCheck" type="checkbox" @click="checkUser(item)">
                        <input v-else checked="checked" type="checkbox" @click="checkUser(item)">
                      </td>
                      <td v-if="visitUser.length==0">
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
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="confirmMember">确定</el-button>
    </div>
  </el-dialog>

  <!--人员选择-->
  <el-dialog :visible.sync="dialogVisible7" :title="titlename7" top="5%" :before-close="closeDialog7">
    <div class="Search">
      <div class="SearchRight1" v-if="visitUser.length!=0">
        <el-button type="default" style="width:80px;padding: 5px 10px;" @click="chooseCanSeeMember">添加人员</el-button>
      </div>

      <div class="SearchRight2">
        <el-radio v-model="radio4" label="0" v-if="visitUser.length!=0">
          <span @click="showChange">当前开放人员</span>
        </el-radio>
        <el-radio v-model="radio4" label="1">
          <span @click="showChange">变动人员</span>
        </el-radio>
      </div>
      <div class="SearchRight3">
        <input v-model="searchTxt1" type="text" placeholder="人员、部门名称" style="text-indent: 0.75em;" @input="searchMember2Input">
        <el-button type="default" style="padding: 5px 10px;" @click="searchMember2Btn">搜索</el-button>
      </div>
    </div>
    <div style="clear: both"></div>
    <br>

    <div style="width: 100%;height: 438px;overflow-x: hidden;border: 1px solid #cdcdcd;">
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;" v-if="radio4==='0'">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 30%">姓名</th>
          <th style="width: 30%">部门</th>
          <th style="width: 40%">手机号</th>
        </tr>
        <tr v-for="item in currentUser" v-if="hackReset">
          <td>{{item.name}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.mobile}}</td>
        </tr>
      </table>
      <table border="1" bordercolor="#cdcdcd" style="width: 100%;text-align:center;border-collapse:collapse;" v-if="radio4=='1'">
        <tr style="background: rgb(220, 220, 220)">
          <th style="width: 20%">姓名</th>
          <th style="width: 20%">部门</th>
          <th style="width: 20%">手机号</th>
          <th style="width: 20%">变动状态</th>
          <th style="width: 20%">选择</th>
        </tr>
        <tr v-for="item in checkedUserList" v-if="visitUser.length!=0&&hackReset">
          <!--<tr v-for="item in currentUser1" v-if="visitUser.length!=0&&hackReset">-->
          <td>{{item.name}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.mobile}}</td>
          <td v-if="item.status==100">移除</td>
          <td v-else>新添加</td>
          <td><img @click="clearUser(item)" src="../../../../../static/img/close.png" style="cursor: pointer" alt=""></td>
        </tr>
        <tr v-for="item in currentUser1" v-if="visitUser.length==0&&hackReset">
          <td>{{item.name}}</td>
          <td>{{item.deptName}}</td>
          <td>{{item.mobile}}</td>
          <td v-if="item.status==100">移除</td>
          <td v-else>新添加</td>
          <td><img @click="clearUser(item)" src="../../../../../static/img/close.png" style="cursor: pointer" alt=""></td>
        </tr>
      </table>
    </div>

    <div style="height:1px; margin: 40px auto 10px;clear: both">
      <el-button style="float:right" type="primary" size="small" @click="closeDialog7">取消</el-button>
      <el-button style="float:right;margin-right: 10px;" type="primary" size="small" @click="submitUserList">确定</el-button>
    </div>
  </el-dialog>

  <!--添加分类-->
  <el-dialog :visible.sync="dialogVisible8" :title="titlename8" top="15%" style="width:80%;margin:0 auto;" @close="closeDialog8">
    <el-form ref="form" :model="formSort" label-width="150px">
      <el-form-item label="" v-if="titlename8==='添加一级分类'">
        <span style="height: 40px;line-height: 40px;color:red;">* 注：须创建完整的三级分类可在APP中显示</span>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="formSort.name" id="sortname" style="width: 400px;"></el-input>
      </el-form-item>
      <br />
      <el-form-item label="分类描述" style="width: 550px;">
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
  <el-dialog :visible.sync="dialogVisible9" title="添加讲师" top="15%" style="width:80%;margin:0 auto;" @close="closeDialog9">
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
  updcourse,
  addcategory,
  getcategory,
  getlecturer,
  addlecturer,
  getOnecategory,
  getOnecategorys,
  getattach,
  addattach,
  getOneattach,
  getexample,
  getOneexample,
  getcourseMenu,
  getDepartment,
  getDepartmentAll,
  getDepartmentById,
  getUserBy,
  getVisit,
  getCanSee,
  getTag,
  getTagList,
  getTagUser
} from '@/api/api';
import {
  formatDate
} from '@/util/util';
import uppicture from '@/components/public/picture';
import UploadFile from '@/components/public/UploadFile';

export default {
  components: {
    uppicture,
    UploadFile
  },
  data() {
    return {
      departName: '',
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
        name: window.localStorage.getItem('saascoursename'),
        desc: window.localStorage.getItem('saascoursedesc'),
        cover: window.localStorage.saascover
      },
      files: '',
      icontof: false,
      ie9tof: navigator.userAgent.indexOf("MSIE 9.0") > 0,
      tof: true,
      Cid: '',
      Cname: '',
      CidBlock: '',
      CnameBlock: '',
      Lid: '',
      Lname: '',
      LidBlock: '',
      LnameBlock: window.localStorage.getItem('saascourselecturerName'),
      value: '',
      textarea: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      radio: window.localStorage.getItem('saascourseliveFlag'),
      radio1: window.localStorage.getItem('saascoursedescType'),
      checkList: ['A', 'B'],
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
      checkTxt: [{
          id: '',
          name: '详情'
        },
        {
          id: '',
          name: '目录'
        },
        {
          id: '',
          name: '文档'
        },
        // { id:'', name:'习题' }
      ],
      BcheckList: [],
      BcheckChoeseTxt: '',
      checkChoeseTxt: '',
      checkChoeseIndex: '',
      checkList: [],

      // Add
      Gloading: false,
      userInfo: [],
      userInfo2: [],
      checkedUserList: [],
      filter1: false,
      radio3: '',
      radio3Checked: false,
      radio4: '0',
      Page: [],
      pgLimit: 10,
      currentUser: [],
      currentUser1: [],
      checkedUser: [],
      hackReset: false,
      hackReset2: false,
      submitUser: [],
      str: '',
      visitUser: [],
      checkedUser: [],
      checkedDeptNum: 0,
      // checkedMemberNum: 0,
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
      clearDeptid: '',
      deptid: '',
      tagid: '',
      canRun: true,
      canRun2: true,
      recursiveList: [],
      first: '',
      isFirst: true,
      isTag: false,
      activeName: 'dept',
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
      aspectRatio: 1,
      Lecturerid: '', // 讲师id
      LecturerName: '', // 讲师名称
    }
  },
  beforeCreate: function() {
    if (window.localStorage.getItem('saasLoginTrueOrFalse') === 'false' || window.localStorage.getItem('saasLoginTrueOrFalse') === null) {
      this.$router.push('/Login');
    } else {
      // window.localStorage.getItem('saascoursecategory')
      getOnecategory(window.localStorage.getItem('saascoursecategory')).then(data => {
        // console.log(data);
        if (data !== '') {
          if (data.success) {
            this.CnameBlock = data.name;
            this.CidBlock = data.id;
          }
        }
      })
      getOneattach(window.localStorage.saascourseid).then(data => {
        // console.log(data);
        if (data !== '') {
          if (data.success) {
            this.KidBlock = data.id;
            this.KnameBlock = data.name;
          }
        }
      })
      getOneexample(window.localStorage.getItem('saascoursewarehouse')).then(data => {
        // console.log(data);
        if (data !== '') {
          if (data.success) {
            this.WnameBlock = data.name;
            this.WidBlock = data.id;
          }
        }
      })
      // console.log(window.localStorage.getItem('saascourseid'));
      getcourseMenu(window.localStorage.getItem('saascourseid')).then(data => {
        // console.log(data);
        if (data.resList) {
          var list = [];
          for (var j = 0; j < data.resList.length; j++) {
            list[j] = data.resList[j].name;
            this.checkTxt[(data.resList[j].type - 1)] = {
              id: data.resList[j].id,
              name: data.resList[j].name
            }
          }
          if (list.length === 0) {
            list = ['详情', '目录'];
            this.checkTxt[0] = {
              name: '详情',
              cid: window.localStorage.getItem('saascourseid'),
              type: 1,
              status: 0,
              sort: 1
            }
            this.checkTxt[1] = {
              name: '目录',
              cid: window.localStorage.getItem('saascourseid'),
              type: 2,
              status: 0,
              sort: 2
            }
          }
          this.checkList = list;
          this.BcheckList = list;
          // console.log(this.checkTxt);
          // console.log(this.BcheckList);
          // console.log(this.checkList);
        }
      });
    }

    // Add
    getVisit(window.localStorage.getItem('saascourseid')).then(data => {
      // console.log(data);
      if (data.visitUser) {
        this.visitUser = data.visitUser;
        this.visitUser.forEach(item => {
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
    });

    getCanSee(window.localStorage.getItem('saascourseid')).then(data => {
      console.log(data);
      if (data) {
        if (data.visit) this.radio3 = data.visit.toString();
        if (data.attach) this.KidBlock = data.attach; // 设置关联课件id
        if (data.attachName) this.KnameBlock = data.attachName; // 设置关联课件名称
        if (data.lecturer) this.Lecturerid = data.lecturer; // 设置关联讲师id
        if (data.lecturerName) this.LecturerName = data.lecturerName; // 设置关联讲师名称
      }
    });

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
            // console.log(data.resMsg);
          }
        });
      } else {
        this.DepartmentList = [];
        // console.log(data.resMsg);
      }
    });
  },
  computed: {
    checkedMemberNum() {
      return this.checkedUserList.filter(function(e) {
        return e.status == 10 || e.status == 11;
      }).length;
    }
  },
  mounted() {
    setTimeout(function() {
      document.querySelector('#name input').focus();
    }, 20)
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
      // console.log(index,txt);
      this.BcheckChoeseTxt = txt;
      this.checkChoeseTxt = txt;
      this.checkChoeseIndex = index;
      this.dialogVisible5 = true;
    },
    OnchangeItemTxt() {
      for (var i = 0; i < this.checkTxt.length; i++) {
        if (i === this.checkChoeseIndex) {
          this.checkTxt[i].name = this.checkChoeseTxt;
          this.dialogVisible5 = false;
        }
      }
      var tof = false;
      for (var j = 0; j < this.checkList.length; j++) {
        if (this.checkList[j].indexOf(this.BcheckChoeseTxt) !== -1) {
          this.checkList[j] = this.checkChoeseTxt;
        }
      }
      for (var k = 0; k < this.BcheckList.length; k++) {
        if (this.BcheckList[k].indexOf(this.BcheckChoeseTxt) !== -1) {
          this.BcheckList[k] = this.checkChoeseTxt;
        }
      }
      // console.log(this.checkList);
    },
    qwer() {
      for (var i = 0; i < this.checkList.length; i++) {
        var j = this.BcheckList.indexOf(this.checkList[i])
        if (this.BcheckList.indexOf(this.checkList[i]) === -1) {
          for (var k = 0; k < this.checkTxt.length; k++) {
            if (this.checkTxt[k].name === this.checkList[i]) {
              // console.log('新增:'+this.checkList[i]);
              this.checkTxt[k] = {
                name: this.checkList[i]
              }
            }
          }
        }
      }
      for (var i = 0; i < this.BcheckList.length; i++) {
        if (this.checkList.indexOf(this.BcheckList[i]) === -1) {
          for (var k = 0; k < this.checkTxt.length; k++) {
            if (this.checkTxt[k].name === this.BcheckList[i]) {
              // console.log('删除:'+this.BcheckList[i]);
              var id = this.checkTxt[k].id;
              this.checkTxt[k] = {
                id: this.checkTxt[k].id
              }
            }
          }
        }
      }
      // console.log(this.checkTxt);
    },
    ChooseFile(data) {
      this.KidBlock = data.id;
      this.KnameBlock = data.name;
      this.dialogVisible3 = data.visible;
    },
    CloseChooseFile(data) {
      this.dialogVisible3 = data;
    },
    OnUpdCourse() {
      if (/^\s+$/.test(this.form.name)) return this.openError(this.ThemeName + '名称不能全部为空格！');
      if (this.CnameBlock === '') return this.openError(this.ThemeName + '分类不能为空');
      // if (this.LnameBlock === '') return this.openError('请选择讲师');
      // console.log(this.files==="");
      var category = '';
      if (this.CidBlock !== '') {
        category = this.CidBlock;
      }

      for (var i = 0; i < this.checkList.length; i++) {
        var j = this.BcheckList.indexOf(this.checkList[i])
        if (this.BcheckList.indexOf(this.checkList[i]) === -1) {
          for (var k = 0; k < this.checkTxt.length; k++) {
            if (this.checkTxt[k].name === this.checkList[i]) {
              // console.log('新增:'+this.checkList[i]);
              this.checkTxt[k] = {
                name: this.checkList[i],
                cid: window.localStorage.getItem('saascourseid'),
                type: (k + 1),
                status: 0,
                sort: (k + 1)
              }
            }
          }
        }
      }
      for (var i = 0; i < this.BcheckList.length; i++) {
        if (this.checkList.indexOf(this.BcheckList[i]) === -1) {
          for (var k = 0; k < this.checkTxt.length; k++) {
            if (this.checkTxt[k].name === this.BcheckList[i]) {
              // console.log('删除:'+this.BcheckList[i]);
              var id = this.checkTxt[k].id;
              this.checkTxt[k] = {
                id: this.checkTxt[k].id
              }
            }
          }
        }
      }
      for (var h = 0; h < this.checkTxt.length; h++) {
        if (this.checkTxt[h].id !== undefined && this.checkTxt[h].id === '') {
          // console.log(h);
          this.checkTxt.splice(h, 1);
        }
      }
      for (var h = 0; h < this.checkTxt.length; h++) {
        if (this.checkTxt[h].id !== undefined && this.checkTxt[h].id === '') {
          // console.log(h);
          this.checkTxt.splice(h, 1);
        }
      }
      var loginParams = {
        id: window.localStorage.getItem('saascourseid'),
        name: this.form.name,
        cover: this.form.cover,
        desc: this.form.desc,
        category: category,
        lecturer: this.Lecturerid,
        liveFlag: this.radio,
        descType: this.radio1,
        attach: this.KidBlock,
        warehouse: this.WidBlock,
        courseMenu: this.checkTxt,
        visit: this.radio3,
        visitUJson: this.str
      };
      // console.log(loginParams);
      updcourse(loginParams).then(data => {
        if (data.success) {
          this.$router.push('/CourseList');
        } else {
          // console.log(data);
          this.openError(data.resMsg);
        }
      });
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
    GOCourseList() {
      this.$router.push('/CourseList');
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
          // console.log(data.resList);
          this.dataL = data.resList;
          if (data.resList !== undefined) {
            for (var i = 0; i < this.dataL.length; i++) {
              this.dataL[i].checked = false;
            }
          }
        }
        this.btnChooseTeacher = true;
        this.hack2();
      });
    },
    CancleChoeseL() {
      this.Lecturerid = '';    // 移除讲师id
      this.LecturerName = '';   // 移除讲师名称
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
      this.Lecturerid = this.Lid;
      this.LecturerName = this.Lname;
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
        if (data.resList) {
          this.Page2 = data;
          if (data.resList !== undefined && data.success) {
            this.NotDis = false;
            this.dataW = data.resList;
          }
        }
      });
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
        if (data.success) {
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
    },
    choesepath(id, type, name) {
      if (type === 5) {
        this.Kid = '';
        this.Kid = '';
        this.type = true;
      } else {
        var namelist = name.split('.');
        var suffixName = namelist[namelist.length - 1];

        // word、ppt、pdf、txt、jpg、png、bmp、html
        if (suffixName === 'word' ||
          suffixName === 'ppt' ||
          suffixName === 'pdf' ||
          suffixName === 'txt' ||
          suffixName === 'jpg' ||
          suffixName === 'png' ||
          suffixName === 'bmp' ||
          suffixName === 'html'
        ) {
          this.Kid = id;
          this.Kname = name;
          this.type = false;
        } else {
          this.Kid = '';
          this.Kid = '';
          this.type = true;
        }
      }
      for (var i = 0; i < this.CourseData.length; i++) {
        if (this.CourseData[i].id === id) {
          this.CourseData[i].choeseF = true;
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
        if (this.CourseData !== []) {
          this.NotDis2 = false;
        } else {
          this.NotDis2 = true;
        }
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
    verification() {
      if (this.form.name) {
        this.tof = false;
      } else {
        this.tof = true;
      }
    },
    hack() {
      // console.log('hack it');
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
      })
    },
    hack2() {
      // console.log('hack it');
      this.hackReset2 = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset2 = true;
      })
    },

    // Add methods
    handdleTabClick(tab, event) {
      // console.log(tab, event);
      this.searchTxt3 = '', this.searchTxt4 = '';
      this.$nextTick(() => {
        let tagName = this.$refs.tab.currentName;
        if (tagName == 'dept') {
          if (this.deptid != '' || this.clearDeptid != '') {
            this.userInfo.forEach(item => {
              item['isCheck'] = false;
              this.checkedUserList.forEach(i => {
                if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                }
              });
            });
            this.checkDept(this.deptid);
            if (this.checkedUserList == '') this.$refs.tree.setCheckedKeys([]);
            // this.checkDepartment(this.deptid);
          }
        }
        if (tagName == 'tag') {
          if (this.tagid != '') {
            this.userInfo2.forEach(item => {
              item['isCheck'] = false;
              this.checkedUserList.forEach(i => {
                if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                }
              });
            });
            // this.checkTag(this.tagid);
            if (this.checkedUserList == '') this.$refs.tree2.setCheckedKeys([]);
          }
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

    // choose by dept
    handdleNodeClick(data, node, leaf) {
      // console.log(data, node);
      this.deptid = data.id;
      this.getuser({
        deptid: data.id
      });
    },
    handdleCheckChange(data, checked, leafChecked) {
      // console.log(data, checked, leafChecked);
      // console.log('this.canRun', this.canRun, 'checked', checked, 'leafChecked', leafChecked);
      this.deptid = data.id;
      this.recursiveList = [];
      this.recursive(data);
      if (this.isFirst) this.first = data.id;
      this.isFirst = false; // 设置this.isFirst的布尔值来判断是否是当前勾选的部门
      if (this.visitUser.length != 0) {
        if (checked) {
          // console.log('check data, this.first:',this.first);
          if (this.canRun) {
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
          // console.log('uncheck data, this.first:',this.first);
          if (this.canRun) {
            if (this.$refs.tree.getCheckedKeys().indexOf(data.id) > -1) {
              this.setCheck(data.id, false, false);
            }
            this.recursiveList.forEach(item => {
              if (this.$refs.tree.getCheckedKeys().indexOf(item) > -1) {
                this.setCheck(item, false, false);
              }
            });

            this.checkedUserList.forEach(item => {
              if (item.deptid == data.id) {
                if (item.status == 10) item.status = 101;
                if (item.status == 11) item.status = 110;
                if (item.status == 12) item.status = 120;
              }
            });
            this.getuser({
              deptid: this.first
            });
          }
        }
      } else {
        if (checked) {
          // console.log('check data, this.first:',this.first);
          if (this.canRun) {
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
          // console.log('uncheck data, this.first:',this.first);
          if (this.canRun) {
            if (this.$refs.tree.getCheckedKeys().indexOf(data.id) > -1) {
              this.setCheck(data.id, false, false);
            }
            this.recursiveList.forEach(item => {
              if (this.$refs.tree.getCheckedKeys().indexOf(item) > -1) {
                this.setCheck(item, false, false);
              }
            });

            this.checkedUserList.forEach(item => {
              if (item.deptid == data.id) {
                if (item.status == 10) item.status = 100;
                if (item.status == 11) item.status = 110;
                if (item.status == 12) item.status = 120;
              }
            });
            this.getuser({
              deptid: this.first
            });
          }
        }
      }
      this.canRun = true; // 函数节流，通过改变this.canRun的布尔值来拦截勾选部门人员导致部门勾选状态发生变化
    },
    setCheck(id, flag1, flag2) {
      this.$refs.tree.setChecked(id, flag1, flag2);
    },
    setCheck2(id, flag1, flag2) {
      this.$refs.tree2.setChecked(id, flag1, flag2);
    },
    checkUsers(deptid, leafChecked) {
      getUserBy({
        deptid: deptid
      }).then(data => {
        // console.log('checkUsers',deptid, leafChecked);
        if (data.resList) {
          data.resList.forEach(item => {
            item['isCheck'] = true;
            item['status'] = 12;
            item['deptid'] = deptid;
            getDepartmentById(deptid).then(data => {
              if (data.name) {
                item['deptName'] = data.name;

                if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
                  // console.log('push item',item.name,item.id);
                  this.checkedUserList.push(item);
                } else {
                  this.checkedUserList.forEach(item2 => {
                    if (item2.id == item.id) {
                      // console.log('change item ');
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
                this.canRun = true;
              }

              // console.log('leafChecked',leafChecked, deptid);
              if (!leafChecked) {
                // console.log('this.getuser({deptid:this.first})');
                this.isFirst = true;
                this.getuser({
                  deptid: this.first
                });
              }

              this.showChange();
            });
          });
        } else {
          this.userInfo = [];
        }
      });
    },
    getuser(params) {
      // console.log('getuser!');
      this.isSearchMem = false;
      if (this.visitUser.length != 0) {
        getUserBy(params).then(data => {
          if (data.resList) {
            this.userInfo = data.resList;
            this.userInfo.forEach(item => {
              item['isCheck'] = false;
              // item['deptName'] = this.departName;
              this.checkedUserList.forEach(i => {
                if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                }
              });
            });

            // console.log('set isFirst!');
            this.canRun = true, this.isFirst = true;
            this.showChange();
          }
        });
      } else {
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
            });
            this.isFirst = true;
            this.showChange();
          } else {
            this.userInfo = [];
          }
        });
      }
    },

    // choose by tag
    handdleNodeClick2(data) {
      // console.log(data, node);
      this.tagid = data.id;
      this.getuser2(data);
    },
    handdleCheckChange2(data, checked) {
      this.tagid = data.id;
      // console.log('this.canRun2', this.canRun2, 'checked', checked);
      if (checked) {
        // console.log('check 2');
        if (this.canRun2) this.checkUsers2(data);
      } else {
        // console.log('uncheck 2');
        // console.log(this.checkedUserList);
        if (this.canRun2) {
          this.checkedUserList.forEach(item2 => {
            if (item2.tagid == data.id) {
              if (item2.status == 10) item2.status = 100;
              if (item2.status == 11) item2.status = 110;
              if (item2.status == 12) item2.status = 120;
            }
          });
          this.getuser2(data);
        }
      }
      this.canRun2 = true; // this.canRun2：函数节流
    },
    getuser2(item) {
      // this.checkDept(this.deptid);
      // console.log(this.checkedUserList);
      getTagUser({
        tid: item.id
      }).then(data => {
        // console.log(data);
        if (data.ulist) {
          this.userInfo2 = data.ulist;
          this.userInfo2.forEach(item => {
            item['isCheck'] = false;
            this.checkedUserList.forEach(i => {
              if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                item['isCheck'] = true; // 渲染已选择的人员，标记为true
              }
            });
          });
        } else {
          this.userInfo2 = [];
        }

        this.checkTag(item.id);
        this.showChange();
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

            // console.log(JSON.stringify(this.checkedUserList).indexOf('"id":'+item.id+',') < 0);
            if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
              // console.log('push item');
              this.checkedUserList.push(item);
            } else {
              this.checkedUserList.forEach(item2 => {
                if (item2.id == item.id) {
                  // console.log('change item ');
                  // item2.status = 12;
                  if (item2.status == 100) item2.status = 101;
                  if (item2.status == 110) item2.status = 11;
                  if (item2.status == 120) item2.status = 12;
                  item2['tagid'] = tag.id;
                  item2['tagName'] = tag.name;

                  if (item2.deptName.indexOf(item.deptName) < 0) {
                    // console.log('add deptName');
                    item2.deptName += ' ' + item.deptName;
                  }
                }
              });
            }

            this.showChange();
          });
          this.canRun2 = true;
        } else {
          this.userInfo2 = [];
        }
      });
    },

    chooseCanSeeMember() {
      this.dialogVisible6 = true;
      // if(this.deptid!='' && this.activeName=='dept') this.getuser({deptid:this.deptid});
      // if(this.tagid!='' && this.activeName=='tag') this.getuser2({tid:this.tagid});
      this.$nextTick(() => {
        let tagName = this.$refs.tab.currentName;
        // console.log(tagName, this.deptid, this.tagid);
        if (tagName == 'dept') {
          if (this.deptid != '' || this.clearDeptid != '') {
            this.userInfo.forEach(item => {
              item['isCheck'] = false;
              this.checkedUserList.forEach(i => {
                if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                }
              });
            });
            this.checkDept(this.deptid);
          }
        }
        if (tagName == 'tag') {
          if (this.tagid != '') {
            this.userInfo2.forEach(item => {
              item['isCheck'] = false;
              this.checkedUserList.forEach(i => {
                if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                  item['isCheck'] = true; // 渲染已选择的人员，标记为true
                }
              });
            });
            this.checkTag(this.tagid);
          }
        }
      });
      this.hack();
    },
    moreCheckedMember() {
      this.radio4 = '0';

      if (this.visitUser.length != 0) {
        // if(this.checkedUserList.length==0){
        //   this.visitUser.forEach(item=>{
        //     item['isCheck'] = true;
        //     item['status'] = 10;
        //     if(item.deptList!=''){
        //       item['deptid'] = item.deptList[0].id;
        //       item['deptName'] = item.deptList[0].name;
        //     }
        //     this.checkedUserList.push(item);
        //   });
        // }

        this.showChange();
        this.dialogVisible7 = true;
      } else {
        this.dialogVisible6 = true;

        this.$nextTick(() => {
          let tagName = this.$refs.tab.currentName;
          if (tagName == 'dept') {
            if (this.deptid != '' || this.clearDeptid != '') {
              this.userInfo.forEach(item => {
                item['isCheck'] = false;
                this.checkedUserList.forEach(i => {
                  if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                    item['isCheck'] = true; // 渲染已选择的人员，标记为true
                  }
                });
              });
              this.checkDept(this.deptid);
              // if(this.checkedUserList=='') this.$refs.tree.setCheckedKeys([]);
            }
          }
          if (tagName == 'tag') {
            if (this.tagid != '') {
              this.userInfo2.forEach(item => {
                item['isCheck'] = false;
                this.checkedUserList.forEach(i => {
                  if (i.id == item.id && (i.status == 10 || i.status == 11 || i.status == 12)) {
                    item['isCheck'] = true; // 渲染已选择的人员，标记为true
                  }
                });
              });
            }
            // if(this.checkedUserList=='') this.$refs.tree2.setCheckedKeys([]);
          }
        });
      }
      this.hack();
    },
    showChange() {
      this.currentUser = this.checkedUserList.filter(function(e) {
        return e.status == 10 || e.status == 100;
      });
      this.currentUser1 = this.checkedUserList.filter(function(e) {
        return e.status == 100 || e.status == 11 || e.status == 12;
      });
      // this.currentUser1 = this.checkedUserList;
      this.checkedUser = this.checkedUserList.filter(function(e) {
        return e.status == 10 || e.status == 101 || e.status == 11 || e.status == 12;
      });
      this.hack();
    },
    closeDialog6() {
      // console.log('close6');
      if (this.visitUser.length != 0) {
        for (var i = 0; i < this.checkedUserList.length; i++) {
          let item = this.checkedUserList[i];
          if (item.status == 12) { // 将添加立即取消的人员删除
            this.checkedUserList.splice(i, 1);
            i--;
          }
        }
        for (var i = 0; i < this.checkedUserList.length; i++) {
          let item = this.checkedUserList[i];
          if (item.status == 101) item.status = 10;
          if (item.status == 110) item.status = 11;
          if (item.status == 120) item.status = 12;
        }
        this.dialogVisible6 = false;
      } else {
        this.dialogVisible6 = false;
        // console.log(this.checkedUserList);
        for (var i = 0; i < this.checkedUserList.length; i++) {
          let item = this.checkedUserList[i];
          if (item.status == 12 || item.status == 120) {
            this.checkedUserList.splice(i, 1);
            i--;
          }
        }
        for (var i = 0; i < this.checkedUserList.length; i++) {
          let item = this.checkedUserList[i];
          if (item.status == 110) item.status = 11;
        }
      }
      // this.$refs.tree2.setCheckedKeys([]);
      this.showChange();
    },
    closeDialog7() {
      // console.log('close7');
      if (this.visitUser.length != 0) {
        for (var i = 0; i < this.checkedUserList.length; i++) {
          let item = this.checkedUserList[i];
          if (item.status == 100 || item.status == 101) item.status = 10;
          if (item.status == 12) { // 将添加立即取消的人员删除
            this.checkedUserList.splice(i, 1);
            i--;
          }
        }
      }
      this.showChange();
      this.dialogVisible7 = false;
    },
    closeDialog8() {
      this.dialogVisible8 = false;
    },
    closeDialog9() {
      this.dialogVisible9 = false;
    },
    confirmMember() {
      if (this.visitUser.length != 0) {
        // console.log('confirm');
        for (var i = 0; i < this.checkedUserList.length; i++) {
          var item = this.checkedUserList[i];
          if (item.status == 110 || item.status == 120) {
            this.checkedUserList.splice(i, 1); // 去除新添加已取消和新添加未确定已取消的
            i--;
          }
          if (item.status == 101) item.status = 100;
          // if(item.status==12) item.status = 11;   // 新添加未确定的变为新添加
        }
        this.radio4 = '1';
        this.showChange();
      } else {
        if (this.checkedUserList.length > 0) {
          this.submitUser = []; // clear submitUser

          for (var i = 0; i < this.checkedUserList.length; i++) {
            var item = this.checkedUserList[i];
            if (item.status == 110 || item.status == 120) {
              this.checkedUserList.splice(i, 1); // 去除新添加已取消的
              i--;
            }
            if (item.status == 12) item.status = 11;
          }

          this.checkedUserList.forEach(item => {
            this.submitUser.push({
              "id": item.id
            });
          });

          this.radio3 = '1';
          // this.checkedMemberNum = this.checkedUserList.length;
        } else {
          this.radio3 = '1';
        }

        this.str = JSON.stringify(this.submitUser); // 数组转换成json数据提交给后端接口
      }
      this.dialogVisible6 = false;
    },
    submitUserList() {
      if (this.visitUser.length != 0) {
        this.submitUser = [];
        this.checkedUserList.forEach(item => {
          if (item.status == 12) item.status = 11; // 新添加未确定的变为新添加
          this.submitUser.push({
            "id": item.id
          });
        });
        // this.checkedUserList.forEach(item=>{
        //   this.submitUser.push({"id":item.id});
        // });
        this.str = JSON.stringify(this.submitUser); // 数组转换成json数据提交给后端接口
        this.currentUser = this.checkedUserList;
        this.showChange();
        // console.log(this.str);
        // this.checkedMemberNum = this.submitUser.length;
      } else {
        for (var i = 0; i < this.checkedUserList.length; i++) {
          var item = this.checkedUserList[i];
          if (item.status == 120) {
            this.checkedUserList.splice(i, 1); // 去除新添加已取消和新添加未确定已取消的
            i--;
          }
        }
      }

      // 监测部门人员是否全部勾选，若有一人未勾选则取消勾选部门
      this.checkDept(this.clearDeptid);
      this.dialogVisible7 = false;
    },
    moreMember() {
      if (!this.dialogVisible7) {
        this.dialogVisible7 = true;
      }
      this.radio4 = '1';
      this.showChange();
      this.hack();
      // console.log(this.checkedUserList);
    },
    checkUser(item) {
      // item.status 10：原有, 100：移除(原有已删除), 101: 原有待移除
      // item.status 11：新添加, 110：新添加待删除
      // item.status 12：新添加未确定, 120：新添加未确定待删除
      var id = this.deptid;
      if (!item.isCheck) {
        // console.log('check',this.deptid);
        item['isCheck'] = true;
        item['status'] = 12;

        if (this.deptid == '') {
          item['deptid'] = item.deptList[0].id;
          item['deptName'] = item.deptList[0].name;
          if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
            // console.log('push');
            this.checkedUserList.push(item);
          } else {
            this.checkedUserList.forEach(item2 => {
              if (item2.id == item.id) {
                if (item2.status == 100) {
                  // console.log('c 10', item2.deptid);
                  item2.status = 10;
                }
                if (item2.status == 110) {
                  // console.log('c 11', item2.deptid);
                  item2.status = 11;
                }
                if (item2.status == 120) {
                  // console.log('c 12', item2.deptid);
                  item2.status = 12;
                }
                if (item2.name.indexOf(item.name) < 0) {
                  item2.name += ' ' + item.name;
                }
              }
            });
          }
          this.showChange();
        } else {
          item['deptid'] = this.deptid;
          getDepartmentById(this.deptid).then(data => {
            // console.log(data);
            if (data.name) {
              item['deptName'] = data.name;

              if (JSON.stringify(this.checkedUserList).indexOf('"id":' + item.id + ',') < 0) {
                // console.log('push');
                this.checkedUserList.push(item);
              } else {
                this.checkedUserList.forEach(item2 => {
                  if (item2.id == item.id) {
                    if (item2.status == 100) {
                      // console.log('c 10', item2.deptid);
                      item2.status = 100;
                    }
                    if (item2.status == 110) {
                      // console.log('c 11', item2.deptid);
                      item2.status = 11;
                    }
                    if (item2.status == 120) {
                      // console.log('c 12', item2.deptid);
                      item2.status = 12;
                    }
                    if (item2.name.indexOf(item.name) < 0) {
                      item2.name += ' ' + item.name;
                    }
                  }
                });
              }
              this.showChange();
            }
          });
        }

        this.checkDept(id);
        this.hack();
      } else {
        // console.log('uncheck');
        item['isCheck'] = false;
        this.checkedUserList.forEach(item2 => {
          if (item2.id == item.id) {
            item2['isCheck'] = false;
            if (item2.status == 10) {
              // console.log('uc 101', item2.deptid);
              item2.status = 101;
            }
            if (item2.status == 11) {
              // console.log('uc 110', item2.deptid);
              item2.status = 110;
            }
            if (item2.status == 12) {
              // console.log('uc 120', item2.deptid);
              item2.status = 120;
            }
          }
        });
        this.checkDept(id);
        this.showChange();
        this.hack();
      }
    },
    checkDept(id) {
      var name, len_1, len_2;
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
            // console.log(len_1,len_2,name);
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
          } else {
            this.$refs.tree.setCheckedKeys([]);
            this.canRun = false;
          }
          this.hack();
        }
      });
    },
    checkTag(id) {
      // console.log('checkTag');
      let keys = this.$refs.tree2.getCheckedKeys();
      var name, len_1, len_2;
      getTag({
        id: id
      }).then(data => {
        if (data.name) {
          name = data.name;
          if (this.checkedUserList != '') {
            len_1 = this.checkedUserList.filter(function(e) {
              return (e.status == 10 || e.status == 11 || e.status == 12) && e.tagName && e.tagName.indexOf(name) > -1;
            }).length;
            if (this.userInfo2) len_2 = this.userInfo2.length;
            else len_2 = -1;
            // console.log(len_1,len_2,name);
            // console.log(keys, keys!='');
            if (len_1 != len_2) {
              if (keys.indexOf(id) > -1 && keys != '') {
                // console.log(3333);
                this.$refs.tree2.setChecked(id, false, false);
                this.canRun2 = false; // this.canRun2：函数节流
              }
            } else {
              if (keys.indexOf(id) < 0) {
                // console.log(4444);
                if (len_1 != 0) this.$refs.tree2.setChecked(id, true, false);
                this.canRun2 = false; // this.canRun2：函数节流
              }
            }
          } else {
            this.$refs.tree2.setCheckedKeys([]);
            this.canRun2 = false;
          }
          this.hack();
        }
      });
    },
    clearUser(item) {
      if (this.visitUser.length != 0) {
        // change 20180808
        for (var i = 0; i < this.checkedUserList.length; i++) {
          if (this.checkedUserList[i].id == item.id) {
            if (item.status == 100) item.status = 10;
            else this.checkedUserList.splice(i, 1);
          }
        }
        for (var i = 0; i < this.currentUser1.length; i++) {
          if (this.currentUser1[i].id == item.id) {
            this.currentUser1.splice(i, 1);
          }
        }
      } else {
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
        // this.checkedMemberNum = this.checkedUserList.length;

        var params = {
          deptid: this.deptid
        };
        this.getuser(params);
        this.clearDeptid = item.deptid;
        this.hack();
      }
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
            let params = {
              deptid: item.id
            };
            this.getuser(params);
            document.getElementById('DeptTopLength_3').scrollTop = 50 * i;
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
            this.deptid = item.id;
            let params = {
              deptid: item.id
            };
            this.getuser(params);
            document.getElementById('DeptTopLength_3').scrollTop = 50 * i;
            return;
          } else {
            this.recursiveDept(item);
          }
        }
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
              id: item.id
            });
            document.getElementById('DeptTopLength_3').scrollTop = 50 * i;
            return;
          }
        };
        this.openError('暂未搜索到相关标签！')
      } else this.openError('请先输入标签名称再搜索！');
    },
    getSearchUser(params, id) {
      if (this.visitUser.length != 0) {
        getUserBy(params).then(data => {
          this.tempList = data;
          this.userInfo = this.tempList.resList.filter(function(e) {
            return e.id == id
          });
          // console.log(this.tempList.resList.filter(function(e){return e.id==id}));
          if (this.userInfo) {
            this.userInfo.forEach(item => {
              item['isCheck'] = false;
              item['checkFlag'] = -3;
              item['deptName'] = this.departName;
              item['cIndex'] = -1;

              for (var i = 0; i < this.checkedUserList.length; i++) {
                var cItem = this.checkedUserList[i];
                if (!cItem.checkFlag) {
                  cItem['checkFlag'] = 3;
                }
                if (cItem.id == item.id) {
                  item['isCheck'] = true;
                  item['cIndex'] = i;
                  item['checkFlag'] = cItem.checkFlag;
                }
              }
            });
          }

          this.hack();
        });
      } else {
        getUserBy(params).then(data => {
          if (data.resList) {
            this.tempList = data;
            this.userInfo = this.tempList.resList.filter(function(e) {
              return e.id == id
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
      }
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
    searchMember0() {
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
      if (this.radio4 == '0') {
        this.tempList = this.checkedUserList.filter(function(e) {
          return e.status == 10;
        });
        var temp = [];
        var result1, result2;
        this.tempList.forEach(item => {
          result1 = item.name.match(this.searchTxt1);
          if (item.deptName) result2 = item.deptName.match(this.searchTxt1);
          if (result1 != null || result2 != null) {
            temp.push(item);
          }
        });
        this.currentUser = temp;
      }
      if (this.radio4 == '1') {
        this.tempList = this.checkedUserList.filter(function(e) {
          return e.status != 10;
        });
        var temp = [];
        var result1, result2, result3;
        this.tempList.forEach(item => {
          result1 = item.name.match(this.searchTxt1);
          result2 = item.deptName.match(this.searchTxt1);
          result3 = item.mobile.match(this.searchTxt1);
          if (result1 != null || result2 != null || result3 != null) {
            temp.push(item);
          }
        });
        this.currentUser1 = temp;
      }
    },
    searchMember2Input() {
      if (this.searchTxt1 != '') {
        this.searchMember2();
      } else {
        if (this.radio4 == '0') {
          this.currentUser = this.checkedUserList.filter(function(e) {
            return e.status == 10;
          });
        }
        if (this.radio4 == '1') {
          this.currentUser1 = this.checkedUserList.filter(function(e) {
            return e.status != 10;
          });
        }
      }
    },
    searchMember2Btn() {
      // console.log(this.searchTxt1);
      if (this.searchTxt1 != '') {
        this.searchMember2();
      } else this.openError('请先输入人员名称再搜索相关人员！');
    },
    handleCurrentChange(currentPage) {
      // this.currentUser1 = this.checkedUserList.filter(function(e){return e.status=='新添加'||e.status=='移除';}).slice((currentPage-1)*this.pgLimit,(currentPage-1)*this.pgLimit+this.pgLimit);
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
