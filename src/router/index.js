import Vue from 'vue'
import Router from 'vue-router'


import Login from '@/components/Login' //登录
import Basis from '@/components/Basis' //顶部菜单
import Download from '@/components/Download' //下载页面
import About from '@/components/About' //关于页面
import NotFound from '@/components/404' //404
import Vod from '@/components/vod' //404

import Business from '@/components/views/Business' //业务中心
import Setting from '@/components/views/Setting' //设置
import DataAndPwd from '@/components/views/DataAndPwd' //个人信息和密码

import CourseCenter from '@/components/views/Business/CourseCenter' //左侧菜单
import FileManage from '@/components/views/Business/FileManage' //左侧菜单
import TelBook from '@/components/views/Business/TelBook' //左侧菜单
import ExamCenter from '@/components/views/Business/ExamCenter' //左侧菜单

import Organization from '@/components/views/Setting/Organization' //左侧菜单
import Administrator from '@/components/views/Setting/Administrator' //左侧菜单

import UpdPwd from '@/components/views/DataAndPwd/UpdPwd' //修改密码
import MyData from '@/components/views/DataAndPwd/MyData' //个人资料

import UpdMsg from '@/components/views/MyData/UpdMsg' //修改个人信息
import UpdIcon from '@/components/views/MyData/UpdIcon' //修改个人头像

import OrganizationInfo from '@/components/views/Setting/Organization/OrganizationInfo' //组织机构
import OrganizationSettings from '@/components/views/Setting/Organization/OrganizationSettings' //组织设置
import AdministratorList from '@/components/views/Setting/Administrator/AdministratorList' //管理员

import FileList from '@/components/views/Business/FileManage/FileList' //文件上传
import DepartManage from '@/components/views/Business/TelBook/DepartManage/DepartManage' //部门管理
import TagManage from '@/components/views/Business/TelBook/TagManage/TagManage' //标签管理
import PersonManage from '@/components/views/Business/TelBook/PersonManage/PersonManage' //用户管理
import DepartList from '@/components/views/Business/TelBook/DepartManage/DepartList' //部门列表
import TagList from '@/components/views/Business/TelBook/TagManage/TagList' //标签列表
import PersonList from '@/components/views/Business/TelBook/PersonManage/PersonList' //用户列表
import AddDepart from '@/components/views/Business/TelBook/DepartManage/AddDepart' //添加部门
import AddTag from '@/components/views/Business/TelBook/TagManage/AddTag' //添加标签

import ExamList from '@/components/views/Business/ExamCenter/ExamManage/ExamList' //考试列表
import AddExam from '@/components/views/Business/ExamCenter/ExamManage/AddExam' //添加考试
import UpdExam from '@/components/views/Business/ExamCenter/ExamManage/UpdExam' //编辑考试
import PaperList from '@/components/views/Business/ExamCenter/PaperManage/PaperList' //试卷列表
import AddPaper from '@/components/views/Business/ExamCenter/PaperManage/AddPaper' //添加试卷
import UpdPaper from '@/components/views/Business/ExamCenter/PaperManage/UpdPaper' //编辑试卷
import TestList from '@/components/views/Business/ExamCenter/TestManage/TestList' //题库列表
import TopicList from '@/components/views/Business/ExamCenter/TopicManage/TopicList' //题目列表
import StatisticList from '@/components/views/Business/StatisticCenter/StatisticList' //统计列表
import ExamStatistic from '@/components/views/Business/StatisticCenter/ExamStatistic' //考试统计
import ExamPerson from '@/components/views/Business/StatisticCenter/ExamPerson' //考试统计
import ExamResult from '@/components/views/Business/StatisticCenter/ExamResult' //章节--查看考试结果

import TeacherManage from '@/components/views/Business/CourseCenter/TeacherManage/TeacherManage' //讲师管理
import TeacherList from '@/components/views/Business/CourseCenter/TeacherManage/TeacherList' //讲师列表
import AddTeacher from '@/components/views/Business/CourseCenter/TeacherManage/AddTeacher' //添加讲师
import CourseManage from '@/components/views/Business/CourseCenter/CourseManage/CourseManage' //ThemeName管理
import CourseList from '@/components/views/Business/CourseCenter/CourseManage/CourseList' //ThemeName列表
import AddCourse from '@/components/views/Business/CourseCenter/CourseManage/AddCourse' //添加ThemeName
import UpdCourse from '@/components/views/Business/CourseCenter/CourseManage/UpdCourse' //修改ThemeName
import Chapter from '@/components/views/Business/CourseCenter/CourseManage/Chapter' //章节
import CommentList from '@/components/views/Business/CourseCenter/CommentManage/CommentList' //章节

import CourseSort from '@/components/views/Business/CourseCenter/CourseSort/CourseSort' //分类
import CourseSortList from '@/components/views/Business/CourseCenter/CourseSort/CourseSortList' //分类列表
import HomePage from '@/components/views/Business/CourseCenter/HomePageManage/HomePage' //首页列表
import Plate from '@/components/views/Business/CourseCenter/HomePageManage/Plate' //板块
import Carousel from '@/components/views/Business/CourseCenter/HomePageManage/Carousel' //轮播图列表
import AddCarousel from '@/components/views/Business/CourseCenter/HomePageManage/AddCarousel' //增加轮播图
import UpdCarousel from '@/components/views/Business/CourseCenter/HomePageManage/UpdCarousel' //修改轮播图

Vue.use(Router)

// const ThemeName = window.localStorage.saasThemeName ? window.localStorage.saasThemeName : ''

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/Login',
      component: Login
    },
    {
      path: '/',
      component: Basis,
      children: [{
          path: '/Business',
          component: Business,
          title: '业务中心',
          icon: 'el-icon-picture',
          index: 'Business',
          children: [{
              path: '/',
              component: CourseCenter,
              title: 'ThemeName中心',
              index: 'CourseCenter',
              children: [{
                  path: '/HomePage',
                  redirect: '/Plate',
                  component: HomePage,
                  title: '首页管理',
                  index: 'HomePage',
                  children: [{
                      path: '/Plate',
                      component: Plate,
                      index: 'Plate'
                    },
                    {
                      path: '/Carousel',
                      component: Carousel,
                      index: 'Carousel',
                      title: 'Banner'
                    },
                    {
                      path: '/AddCarousel',
                      component: AddCarousel,
                      title: 'AddCarousel',
                      index: 'AddCarousel'
                    },
                    {
                      path: '/UpdCarousel',
                      component: UpdCarousel,
                      index: 'UpdCarousel',
                      title: '编辑Banner'
                    }
                  ]
                },
                {
                  path: '/',
                  redirect: '/CourseList',
                  component: CourseManage,
                  title: 'ThemeName管理',
                  index: 'CourseList',
                  children: [{
                    path: '/CourseList',
                    component: CourseList,
                    index: 'CourseList',
                    title: 'ThemeName管理'
                  }, {
                    path: '/AddCourse',
                    component: AddCourse,
                    index: 'AddCourse',
                    title: '添加ThemeName'
                  }, {
                    path: '/UpdCourse',
                    component: UpdCourse,
                    index: 'UpdCourse',
                    title: '编辑ThemeName'
                  }, {
                    path: '/Chapter',
                    component: Chapter,
                    index: 'Chapter',
                    title: '章节管理'
                  }]
                },
                {
                  path: '/',
                  redirect: '/CourseSortList',
                  component: CourseSort,
                  title: 'ThemeName分类',
                  index: 'CourseSortList',
                  children: [{
                      path: '/CourseSortList',
                      component: CourseSortList,
                      index: 'CourseSortList',
                      title: 'ThemeName分类'
                    }
                  ]
                },
                {
                  path: '/',
                  redirect: '/TeacherList',
                  component: TeacherManage,
                  title: '讲师管理',
                  index: 'TeacherList',
                  children: [{
                      path: '/TeacherList',
                      component: TeacherList,
                      index: 'TeacherList',
                      title: '讲师列表'
                    },
                    {
                      path: '/AddTeacher',
                      component: AddTeacher,
                      index: 'AddTeacher',
                      title: '添加讲师'
                    }
                  ]
                },
                {
                  path: '/CommentList',
                  component: CommentList,
                  title: '评论审核',
                  index: 'CommentList'
                }
              ]
            }, {
              path: '/FileManage',
              title: '资源管理',
              component: FileManage,
              index: 'FileManage',
              children: [{
                path: '/FileList',
                component: FileList,
                index: 'FileList',
                title: '资源管理'
              }]
            }, {
              path: '/',
              title: '组织架构',
              component: TelBook,
              index: 'TelBook',
              children: [{
                  path: '/',
                  redirect: '/DepartList',
                  component: DepartManage,
                  title: '部门管理',
                  index: 'DepartList',
                  children: [{
                      path: '/DepartList',
                      component: DepartList,
                      index: 'DepartList',
                      title: '部门列表'
                    },
                    {
                      path: '/AddDepart',
                      component: AddDepart,
                      index: 'AddDepart',
                      title: '添加部门'
                    }
                  ]
                },
                {
                  path: '/',
                  redirect: '/TagList',
                  component: TagManage,
                  title: '标签管理',
                  index: 'TagList',
                  children: [{
                    path: '/TagList',
                    component: TagList,
                    index: 'TagList',
                    title: '标签列表'
                  }, {
                    path: '/AddTag',
                    component: AddTag,
                    index: 'AddTag',
                    title: '添加标签'
                  }]
                },
                {
                  path: '/',
                  redirect: '/PersonList',
                  component: PersonManage,
                  title: '用户管理',
                  index: 'PersonList',
                  children: [{
                    path: '/PersonList',
                    component: PersonList,
                    index: 'PersonList',
                    title: '用户列表'
                  }]
                }
              ]
            },
            // {
            //   path: '/ExamCenter',
            //   title: '考试中心',
            //   index: 'ExamCenter',
            //   component: ExamCenter,
            //   children: [{
            //       path: '/ExamList',
            //       component: ExamList,
            //       title: '考试管理',
            //       index: 'ExamList',
            //       children: [{
            //           path: '/AddExam',
            //           component: AddExam,
            //           index: 'AddExam',
            //           title: '添加考试'
            //         },
            //         {
            //           path: '/UpdExam',
            //           component: UpdExam,
            //           index: 'UpdExam',
            //           title: '编辑考试'
            //         }
            //       ]
            //     },
            //     {
            //       path: '/PaperList',
            //       component: PaperList,
            //       title: '试卷管理',
            //       index: 'PaperList',
            //       children: [{
            //           path: '/AddPaper',
            //           component: AddPaper,
            //           index: 'AddPaper',
            //           title: '添加试卷'
            //         },
            //         {
            //           path: '/UpdPaper',
            //           component: UpdPaper,
            //           index: 'UpdPaper',
            //           title: '编辑试卷'
            //         }
            //       ]
            //     },
            //     {
            //       path: '/TestList',
            //       component: TestList,
            //       title: '题库管理',
            //       index: 'TestList'
            //     },
            //     {
            //       path: '/TopicList',
            //       component: TopicList,
            //       title: '题目管理',
            //       index: 'TopicList'
            //     }
            //   ]
            // },
            // {
            //   path: '/StatisticList',
            //   title: '统计中心',
            //   component: StatisticList,
            //   index: 'StatisticList',
            //   children: [{
            //       path: '/ExamStatistic',
            //       component: ExamStatistic,
            //       index: 'ExamStatistic'
            //     },
            //     {
            //       path: '/ExamPerson',
            //       component: ExamPerson,
            //       index: 'ExamPerson'
            //     },
            //     {
            //       path: '/ExamResult',
            //       component: ExamResult,
            //       index: 'ExamResult'
            //     }
            //   ]
            // }
          ]
        },
        {
          path: '/Setting',
          component: Setting,
          title: '系统设置',
          icon: 'el-icon-setting',
          index: 'Setting',
          children: [{
              path: '/Organization',
              title: '机构管理',
              index: 'Organization',
              component: Organization,
              children: [{
                  path: '/OrganizationInfo',
                  component: OrganizationInfo,
                  title: '机构信息',
                  index: 'OrganizationInfo'
                }
                // {
                //   path: '/OrganizationSettings',
                //   component: OrganizationSettings,
                //   title: '机构设置',
                //   index: 'OrganizationSettings'
                // }
              ]
            },
            {
              path: '/Administrator',
              title: '管理员管理',
              index: 'Administrator',
              component: Administrator,
              children: [{
                path: '/AdministratorList',
                component: AdministratorList,
                title: '管理员列表',
                index: 'AdministratorList'
              }]
            }
          ]
        },
        {
          path: '/',
          component: DataAndPwd,
          // index: 'DataAndPwd',
          children: [{
              path: '/MyData',
              component: MyData,
              index: 'MyData',
              children: [{
                  path: '/UpdMsg',
                  component: UpdMsg,
                  index: 'UpdMsg'
                },
                {
                  path: '/UpdIcon',
                  component: UpdIcon,
                  index: 'UpdIcon'
                }
              ]
            },
            {
              path: '/UpdPwd',
              component: UpdPwd,
              index: 'UpdPwd'
            },
          ]
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    },
    {
      path: '/download',
      component: Download,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/vod',
      component: Vod,
    }
  ]
})
