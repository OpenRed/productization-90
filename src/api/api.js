import promise from 'es6-promise';
promise.polyfill();
import axios from 'axios';
import qs from 'qs'
import {
  JSEncrypt
} from 'JsEncrypt'

let base = '/avctraining';

// 针对Nodejs端接口：Separated、Transcode、Removefile、Getfile
let host = 'http://120.132.18.193:3000'; // 90分线上Nodejs资源服务器
const VERSION = 1;
const OSTYPE = 3;
// let TOKEN;
let TOKEN = window.localStorage.getItem("saastoken");

// let base = 'http://192.168.21.5:8080/avctraining';
// let base = 'http://training.avcon.com.cn/avctraining';
// axios.defaults.headers = {"Access-Control-Allow-Origin": "*"}

import app from '../main.js';
setTimeout(() => {
  // console.log(app);
}, 100);

/****** respone拦截器==>对响应做处理 ******/
axios.interceptors.response.use(
  response => { //成功请求到数据
    if (response.data.resCode === -1001 && app.$route.path !== '/login') {
      console.log('111111', app.$route.path);
      setTimeout(() => {
        // return app.$router.push('/login');
        app.$router.push('/login');
        return response;
      }, 100);
      // return;
    }
    return response;
  },
  error => { //响应错误处理
    console.log('error');
    console.log(error);
    console.log(JSON.stringify(error));
    return Promise.reject(error)
  }
);

let publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNcZygqX22xUTqqMphpXGv70jCKjJ1fKof20Jb
    2TsIBXyerjXPwh5yDKa5qHuln80LyR40Z35anSOlfvdydsxwK/vm2pE8tq2rQropRdDhNNccs8BU
    wKXmtJ+poOU+1EUjAR9T3VbcFfISWXLMPG+7QCjDdIynzOYVS6JiRb1J5wIDAQAB
    -----END PUBLIC KEY-----`;

export function requestCode(po) {
  var params = {
    'mobile': po.mobile,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/user/sendMsg`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function requestLogin(po) {
  var params = {
    // 'mobile': po.mobile,
    'userName': po.userName,
    'regType': 5,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  // let config = {
  //   headers: {"Access-Control-Allow-Origin": "*"},
  // }
  let jse = new JSEncrypt()
  if (po.code.length !== 4) {
    jse.setPublicKey(publicKey)
    let encrypted = jse.encrypt(po.code)
    params['code'] = encrypted;
  } else {
    params['code'] = po.code;
  }
  return axios.post(`${base}/user/login`, qs.stringify(params)).then(function getRes(res) {
    if (res.data.token) window.localStorage.saastoken = res.data.token; // 设置全局token
    if (res.data.id) window.localStorage.saasid = res.data.id; // 设置全局用户id
    if (res.data.pwSuffix) window.localStorage.saaspwSuffix = res.data.pwSuffix; // 设置重置密码前缀
    TOKEN = res.data.token;
    console.log('/user/login TOKEN', window.localStorage.saastoken);
    return res.data
  })
};

export function updUserPass(po) {
  let jse = new JSEncrypt()
  jse.setPublicKey(publicKey)
  let encrypted = jse.encrypt(po.pwd)
  var params = {
    // 'code': po.code,
    'id': window.localStorage.getItem("saasid"),
    'userName': po.userName,
    'loginType': po.loginType,
    'passwordEnc': encrypted,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.code !== '') params['code'] = po.code;
  if (po.oldPassword !== '') {
    let encrypted2 = jse.encrypt(po.oldPassword)
    params['oldPassword'] = encrypted2;
  }
  return axios.post(`${base}/user/updUserPass`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function requestloginOut() {
  var params = {
    'id': window.localStorage.getItem("saasid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/user/loginOut`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function updUserInfoImg(po) {
  var params = {
    'id': window.localStorage.getItem("saasid"),
    'logoUrl': po.logoUrl,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/user/updUserInfo`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function updUserInfo(po) {
  var params = {
    'id': window.localStorage.getItem("saasid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.logoUrl!=='') {
    params['logoUrl'] = po.logoUrl;
  }
  if (po.name!=='') {
    params['name'] = po.name;
  }
  if (po.nickName!=='') {
    params['nickName'] = po.nickName;
  }
  if (po.birthday!=='') {
    params['birthday'] = po.birthday;
  }
  if (po.gender!=='') {
    params['gender'] = po.gender;
  }
  return axios.post(`${base}/user/updUserInfo`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function getOneUserInfo(po) {
  return axios.get(`${base}/user/findUserInfo`, {
    params: {
      'mobile': po,
      'time': new Date().getTime(),
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function updLecturerInfo(po) {
  var params = {
    'id': po.id,
    'name': po.name,
    'mobile': po.mobile,
    'desc': po.desc,
    'cover': po.cover,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/org/lecturer`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function updLecturerInfo2(po) {
  var params = {
    'id': po.id,
    'desc': po.desc,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/org/lecturer`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function addcourse(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'creator': window.localStorage.getItem("saasid"),
    'name': po.name,
    'type': 1,
    'status': po.status,
    'desc': po.desc,
    'category': po.category,
    'lecturer': po.lecturer,
    'liveFlag': po.liveFlag,
    'cover': po.cover,
    'descType': po.descType,
    'attach': po.attach,
    'warehouse': po.warehouse,
    'courseMenu': po.courseMenu,
    'visit': po.visit,
    'visitUJson': po.visitUJson,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/course`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function getcourse(po) {
  return axios.get(`${base}/course`, {
    params: {
      'pgPageNum': po.pgPageNum,
      'name': po.name,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOnecourse(po) {
  return axios.get(`${base}/course`, {
    params: {
      'status': 0,
      'category': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOnecourses(po) {
  return axios.get(`${base}/course/` + po, {
    params: {
      'id': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function delcourse(po) {
  return axios.delete(`${base}/course/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function updcourse(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': po.id,
    'desc': po.desc,
    'status': po.status,
    'name': po.name,
    'category': po.category,
    'cover': po.cover,
    'lecturer': po.lecturer,
    'live': po.live,
    'livePull': po.livePull,
    'httpHost': po.httpHost,
    'liveStatus': po.liveStatus,
    'visit': po.visit,
    'liveFlag': po.liveFlag,
    'descType': po.descType,
    'attach': po.attach,
    'warehouse': po.warehouse,
    'courseMenu': po.courseMenu,
    'visit': po.visit,
    'visitUJson': po.visitUJson,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.begintime !== '' && po.begintime !== undefined) {
    params['beginTime'] = po.begintime;
  }
  if (po.endtime !== '' && po.begintime !== undefined) {
    params['endTime'] = po.endtime;
  }
  return axios.put(`${base}/course`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function updcourse2(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': po.id,
    'liveStatus': po.liveStatus,
    'attachList': po.attachList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/course`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function uploadImg(po) {
  var params = {
    'files': po,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/uploadImg`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function uploadImgFile(po) {
  var params = {
    'files': po,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/uploadImgFile`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};


export function getchapter(po) {
  return axios.get(`${base}/course/CourseChapter`, {
    params: {
      'parent': po.parent,
      'course': po.course,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function delchapter(po) {
  return axios.delete(`${base}/course/CourseChapter/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function addchapter(po) {
  var params = {
    'name': po.name,
    'course': po.course,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.parent !== undefined) {
    params['parent'] = po.parent;
  }
  if (po.attach !== undefined) {
    params['attach'] = po.attach;
  }
  return axios.post(`${base}/course/CourseChapter`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};


export function changechapter(po) {
  var params = {
    'id': po.id,
    'name': po.name,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.desc !== '') {
    params['desc'] = po.desc;
  }
  if (po.category !== '') {
    params['category'] = po.category;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }
  if (po.status !== '') {
    params['status'] = po.status;
  }
  if (po.attach !== '') {
    params['attach'] = po.attach;
  }
  return axios.put(`${base}/course/CourseChapter`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function getcourseCategory(po) {
  return axios.get(`${base}/courseCategoty`, {
    params: {
      'keyword': po.name,
      'pgPageNum': po.pgPageNum,
      'category': po.category,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getcategory() {
  return axios.get(`${base}/category`, {
    params: {
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOnecategory(po) {
  return axios.get(`${base}/category/` + po, {
    params: {
      'parent': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOnecategorys(po) {
  return axios.get(`${base}/category`, {
    params: {
      'parent': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function delcategory(po) {
  return axios.delete(`${base}/category/` + po, {
    params: {
      'id': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function addcategory(po) {
  var params = {
    'name': po.name,
    'parent': po.parent,
    'course': po.course,
    'desc': po.desc,
    'status': 1,
    'type': 1,
    'sort': 1,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/category`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function changecategory(po) {
  var params = {
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.name !== '') {
    params['name'] = po.name;
  }
  if (po.desc !== '') {
    params['desc'] = po.desc;
  }
  if (po.type !== '') {
    params['type'] = po.type;
  }
  if (po.status !== '') {
    params['status'] = po.status;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }
  if (po.course !== '') {
    params['course'] = po.course;
  }
  return axios.put(`${base}/category`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function gethome() {
  // setTimeout(function() {}, 200)
  console.log('TOKEN', TOKEN);
  return axios.get(`${base}/home`, {
    params: {
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function delhome(po) {
  return axios.delete(`${base}/home/delete`, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function addhome(po) {
  var params = {
    'name': po.name,
    'status': 1,
    'type': 1,
    'sort': 1,
    'templet': po.templet,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/home`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function changehome(po) {
  var params = {
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.name !== '') {
    params['name'] = po.name;
  }
  if (po.type !== '') {
    params['type'] = po.type;
  }
  if (po.status !== '') {
    params['status'] = po.status;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }
  if (po.templet !== '') {
    params['templet'] = po.templet;
  }
  return axios.put(`${base}/home`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function changehomesort(po) {
  var params = {
    'id': po.id,
    'shift': po.shift,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/home/sort`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function gethomecourse(po) {
  return axios.get(`${base}/homeCourse`, {
    params: {
      'hcid': po,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getHomeCourseAll(po) {
  var params = {
    'hcid': po.hcid,
    'pgPageNum': po.pgPageNum,
    'keyword': po.keyword,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/getHomeCourseAll`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addhomecourse(po) {
  var params = {
    'hcid': po.hcid,
    'course': po.course,
    'status': 0,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/homeCourse`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delhomeCourse(po) {
  return axios.delete(`${base}/homeCourse/delete`, {
    params: {
      'hcid': po.hcid,
      'course': po.course,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getbanner() {
  return axios.get(`${base}/banner`, {
    params: {
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function addbanner(po) {
  var timestamp1 = Date.parse(new Date());
  var params = {
    'model': 2,
    'val': po.val,
    'cover': po.cover,
    'beginTime': timestamp1,
    'endTime': timestamp1,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/banner`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function changebanner(po) {
  var params = {
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.status !== '') {
    params['status'] = po.status;
  }
  if (po.model !== '') {
    params['model'] = po.model;
  }
  if (po.val !== '') {
    params['val'] = po.val;
  }
  if (po.cover !== '') {
    params['cover'] = po.cover;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }

  return axios.put(`${base}/banner`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};


export function delbanner(po) {
  return axios.delete(`${base}/banner/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function getlecturer() {
  return axios.get(`${base}/org/lecturer`, {
    params: {
      'pgLimit': 1000,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function addlecturer(po) {
  var params = {
    'name': po.name,
    'mobile': po.mobile,
    'desc': po.desc,
    'cover': po.cover,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.logoUrl !== '') {
    params['logoUrl'] = po.logoUrl;
  }
  return axios.post(`${base}/org/lecturer`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function dellecturer(po) {
  return axios.delete(`${base}/org/lecturer/` + po.id, {
    params: {
      'id': po.id,
      'uid': po.uid,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};


export function getattachforname(po) {
  return axios.get(`${base}/attach`, {
    params: {
      'name': po.name,
      'parent': po.parent,
      'pgPageNum': 1,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getattach(po) {
  return axios.get(`${base}/attachAll`, {
    params: {
      'parent': po.parent,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOneattach(po) {
  return axios.get(`${base}/attach/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function addattach(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  let params = {
    'url': po.url,
    'parent': po.parent,
    'name': po.name,
    'type': po.type,
    'idlist': po.attachidList,
    'audioUrl': po.audioUrl,
    'min': po.min,
    'size': po.size,
    'transcode': po.transcode,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/attach`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function updattach(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  let params = {
    'id': po.id,
    'parent': po.parent,
    'transcode': po.transcode,
    'size': po.size,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.name) params.name = po.name;
  if (po.type) params.type = po.type;
  if (po.idlist) params.idlist = po.idlist;
  if (po.min) params.min = po.min;
  if (po.audioUrl) params.audioUrl = po.audioUrl;
  // if(po.transcode) params.transcode = po.transcode;
  return axios.put(`${base}/attach`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function changeattach(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  let params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.id) params['id'] = po.id
  if (po.parent !== undefined) params['parent'] = po.parent
  if (po.name !== undefined) params['name'] = po.name
  if (po.attachidList) params['idlist'] = po.attachidList
  if (po.type !== undefined) params['type'] = po.type
  if (po.min !== undefined) params['min'] = po.min
  if (po.audioUrl !== undefined) params['audioUrl'] = po.audioUrl
  if (po.transcode !== undefined) params['transcode'] = po.transcode

  return axios.put(`${base}/attach`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function delattach(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'idlist': po.attachIdList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/attach/delete`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function getorganization() {
  return axios.get(`${base}/organization/` + window.localStorage.getItem("saasoid"), {
    params: {
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function updorganization(po) {
  var params = {
    'name': po.name,
    'logoUrl': po.logoUrl,
    'desc': po.desc,
    'status': 0,
    'openFlag': po.openFlag,
    'httpHost': po.httpHost,
    'id': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/organization`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};



export function getaccess() {
  return axios.get(`${base}/org/control`, {
    params: {
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function updaccess(po) {
  var params = {
    'status': po.status,
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/org/control`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function addaccess(po) {
  var params = {
    'mobile': po,
    'uid': window.localStorage.getItem('saasid'),
    'oid': window.localStorage.getItem("saasoid"),
    'creator': window.localStorage.getItem('saasid'),
    // 'superFlag':0
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/org/control`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delaccess(po) {
  return axios.delete(`${base}/org/control/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getvisit(po) {
  return axios.get(`${base}/visit`, {
    params: {
      'pgPageNum': po.pgPageNum,
      'name': po.name,
      'liveFlag': po.liveFlag,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getvisituser(po) {
  var params = {
    'course': po.course,
    'pgPageNum': po.pgPageNum,
    'type': po.type,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.username !== '') {
    params['keyword'] = po.username;
  }
  return axios.get(`${base}/visit/user`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};


export function addexample(po) {
  var params = {
    'name': po.name,
    'status': 0,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/example`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function changeexample(po) {
  var params = {
    'id': po.id,
    'name': po.name,
    'desc': po.desc,
    'status': 0,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/example`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delexample(po) {
  return axios.delete(`${base}/example/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOneexample(po) {
  return axios.get(`${base}/example/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getexample(po) {
  return axios.get(`${base}/example`, {
    params: {
      'pgPageNum': po.pgPageNum,
      'name': po.name,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getproblems(po) {
  var params = {
    'pgPageNum': po.pgPageNum,
    'content': po.content,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (window.sessionStorage.getItem('saasTestid') !== null) {
    params['warehouse'] = window.sessionStorage.getItem('saasTestid');
  }
  return axios.get(`${base}/problems`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getOneproblems(po) {
  return axios.get(`${base}/problems/` + po, {
    params: {
      'id': po,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function addproblems(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'content': po.content,
    'contentType': po.contentType,
    'status': po.status,
    'type': po.type,
    'answerParsing': po.answerParsing,
    'status': po.status,
    'paList': po.paList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (window.sessionStorage.getItem('saasTestid') !== null) {
    params['warehouse'] = window.sessionStorage.getItem('saasTestid');
  }
  return axios.post(`${base}/problems`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function updproblems(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': po.id,
    'content': po.content,
    'contentType': po.contentType,
    'status': po.status,
    'type': po.type,
    'answerParsing': po.answerParsing,
    'status': po.status,
    'paList': po.paList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  // if(window.localStorage.getItem('saasTestid')!==null){
  //   params['warehouse'] = window.localStorage.getItem('saasTestid');
  // }
  return axios.put(`${base}/problems`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};


export function delproblems(po) {
  var params = {
    'id': po,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  // if(window.localStorage.getItem('saasTestid')!==null){
  //   params['warehouse'] = window.localStorage.getItem('saasTestid');
  // }
  return axios.delete(`${base}/problems/` + po, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addwarehouseproblems(po) {
  var params = {
    'problems': po.problems,
    'warehouse': window.sessionStorage.getItem('saasTestid'),
    'status': 0,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/warehouseStorage`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function getwarehouseproblems(po) {
  var params = {
    'pgPageNum': po.pgPageNum,
    'warehouse': window.sessionStorage.getItem('saasTestid'),
    'content': po.content,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/warehouseStorage`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function delwarehouseStorage(po) {
  var params = {
    'problems': po.problems,
    'warehouse': window.sessionStorage.getItem('saasTestid'),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.delete(`${base}/warehouseStorage/` + po.problems, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getcourseMenu(po) {
  var params = {
    'cid': po,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/courseMenu`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function Separated(url) {
  return axios.get(host + `/separated`, {
    params: {
      'url': url
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function Transcode(SeparatePath) {
  return axios.get(host + `/transcode`, {
    params: {
      'path': SeparatePath
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function Removefile(po) {
  return axios.get(host + `/removefile`, {}).then(function getRes(res) {
    return res.data
  })
};

export function Getfile(path) {
  return axios.get(host + `/getfile`, {
    params: {
      'path': path
    }
  }).then(function getRes(res) {
    return res.data
  })
};

// Add api
// export function getPro(id) {
//   var params = {
//     'id':id,
//     'oid':1000
//   }
//   return axios.get(`${base}/problems`, {params}).then(function getRes (res) {return res.data})};

export function getDepartmentAll(oid) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/department/all`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getDepartment(po) {
  var params = {
    'id': po.id,
    'name': po.name,
    'parent': po.parent,
    'paPageNum': po.paPageNum,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/department`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getDepartmentById(id) {
  var params = {
    'id': id,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/department/` + id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addDepartment(po) {
  var params = {
    'name': po.name,
    'parent': parseInt(po.parent),
    'desc': po.desc,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/department`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function addDepartmentUser(id, ulist, rmulist) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': parseInt(id),
    'uid': parseInt(window.localStorage.getItem("saasid")),
    'ulist': ulist,
    'rmulist': rmulist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/department/user`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function updateDepartment(po) {
  var params = {
    'id': parseInt(po.id),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  };

  if (po.name !== '') {
    params['name'] = po.name;
  }
  if (po.parent !== '') {
    params['parent'] = parseInt(po.parent);
  }
  if (po.desc !== '') {
    params['desc'] = po.desc;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }
  return axios.put(`${base}/department`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delDepartment(id) {
  var params = {
    'id': parseInt(id),
    'oid': window.localStorage.getItem("saasoid"),
    'uid': parseInt(window.localStorage.getItem("saasid")),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  console.log(params);
  return axios.post(`${base}/department/delete`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function getUserAll(po) {
  var params = {
    'deptid': 0,
    'deptChild': 1,
    'deptFlag': 1,
    'pgPageNum': po.pgPageNum,
    'pgLimit': po.pgLimit,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.keyword != '') {
    params['keyword'] = po.keyword;
  }
  return axios.get(`${base}/department/user`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getUserBy(po) {
  var params = {
    'deptid': parseInt(po.deptid),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.pgPageNum != '') {
    params['pgPageNum'] = po.pgPageNum;
  }
  if (po.pgLimit != '') {
    params['pgLimit'] = po.pgLimit;
  }
  if (po.keyword != '') {
    params['keyword'] = po.keyword;
  }
  return axios.get(`${base}/department/user`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addUser(po, deptList) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'userName': po.userName,
    'deptList': deptList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.name) params['name'] = po.name.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s+/g, ' ');
  if (po.mobile) params['mobile'] = po.mobile;
  if (po.email) params['email'] = po.email;

  // let jse = new JSEncrypt()
  // jse.setPublicKey(publicKey)
  // if (po.password != '') {
  //   params['passwordEnc'] = jse.encrypt(po.password);
  // }

  return axios.post(`${base}/user/adddept`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function updateUser(po, deptList) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'userName': po.userName,
    'deptList': deptList,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }

  if (po.name) params['name'] = po.name.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s+/g, ' ');
  if (po.mobile) params['mobile'] = po.mobile;
  if (po.email) params['email'] = po.email;

  // let jse = new JSEncrypt()
  // jse.setPublicKey(publicKey)
  // if (po.password != '') {
  //   params['passwordEnc'] = jse.encrypt(po.password);
  // }

  return axios.post(`${base}/user/adddept`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function delUser(deptid, id) {
  var params = {
    'deptid': parseInt(deptid),
    'uid': parseInt(id),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  };
  return axios.post(`${base}/user/rmdept`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delUserFromOrg(userid) {
  var params = {
    'userId': parseInt(window.localStorage.getItem("saasid")),
    'uid': parseInt(userid),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  };
  return axios.post(`${base}/user/organization/delete`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function getVisit(courseid) {
  var params = {
    'course': parseInt(courseid),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/course/visit`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getCanSee(courseid) {
  var params = {
    'course': parseInt(courseid),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/course/` + courseid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addPaper(po, plist) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'name': po.name,
    'duration': parseInt(po.duration),
    'passrate': parseFloat(po.passrate),
    'plist': plist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/exam/pager`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function getPaperList(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.pgPageNum != '') params.pgPageNum = parseInt(po.pgPageNum);
  if (po.name != '') params.name = po.name;
  return axios.get(`${base}/exam/pager`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getPaperById(id) {
  var params = {
    'id': parseInt(id),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/exam/pager/` + id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function updPaper(po, plist) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': parseInt(po.id),
    'name': po.name,
    'duration': parseInt(po.duration),
    'passrate': parseFloat(po.passrate),
    'plist': plist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/exam/pager`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function delPaper(id) {
  return axios.delete(`${base}/exam/pager/` + id, {
    params: {
      'id': parseInt(id),
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function addExam(po, elist) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'name': po.name,
    'from': parseInt(po.from),
    'random': parseInt(po.random),
    'rework': parseInt(po.rework),
    'reworklast': parseInt(po.reworklast),
    'answerShow': parseInt(po.answerShow),
    'beginTime': parseInt(po.begintime),
    'endTime': parseInt(po.endtime),
    'elist': elist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.desc != '') {
    params.desc = po.desc
  }
  if (po.cover != '') {
    params.cover = po.cover
  }
  if (po.from == 1 && po.exlink != '') {
    params.exlink = po.exlink
  }
  if (po.rework > 0) {
    params.reworkModel = po.reworkModel;
    if (po.reworkModel == '1' && po.reworkBeginTime != '') params.reworkBeginTime = parseInt(po.reworkBeginTime);
    if (po.reworkEndTime != '') params.reworkEndTime = parseInt(po.reworkEndTime);
    if (po.intervalHour != '') params.intervalHour = parseInt(po.intervalHour);
    if (po.intervalMinute != '') params.intervalMinute = parseInt(po.intervalMinute);
    if (po.notice != '') params.notice = parseInt(po.notice);
    if (po.noticeBeforeTimer != '') params.noticeBeforeTimer = parseInt(po.noticeBeforeTimer);
  }
  return axios.post(`${base}/exam`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function getExamList(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.pgPageNum != '') params.pgPageNum = parseInt(po.pgPageNum);
  if (po.name != '') params.name = po.name;
  return axios.get(`${base}/exam`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getExamById(id) {
  var params = {
    'id': parseInt(id),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/exam/` + id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function updExam(po, elist) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': parseInt(po.id),
    'name': po.name,
    'cover': po.cover,
    'from': parseInt(po.from),
    'random': parseInt(po.random),
    'rework': po.rework,
    'reworklast': parseInt(po.reworklast),
    'answerShow': parseInt(po.answerShow),
    'beginTime': parseInt(po.begintime),
    'endTime': parseInt(po.endtime),
    'reworkModel': parseInt(po.reworkModel),
    'elist': elist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.desc != '') {
    params.desc = po.desc
  }
  if (po.from == 1 && po.exlink != '') {
    params.exlink = po.exlink
  }
  if (po.rework > 0) {
    params.reworkModel = po.reworkModel;
    if (po.reworkModel == '1' && po.reworkBeginTime != '') params.reworkBeginTime = parseInt(po.reworkBeginTime);
    if (po.reworkEndTime != '') params.reworkEndTime = parseInt(po.reworkEndTime);
    if (po.intervalHour != '') params.intervalHour = parseInt(po.intervalHour);
    if (po.intervalMinute != '') params.intervalMinute = parseInt(po.intervalMinute);
    if (po.notice != '') params.notice = parseInt(po.notice);
    if (po.noticeBeforeTimer != '') params.noticeBeforeTimer = parseInt(po.noticeBeforeTimer);
  }
  return axios.put(`${base}/exam`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function openExam(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'id': parseInt(po.id),
    'status': parseInt(po.status),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/exam`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function delExam(id) {
  return axios.delete(`${base}/exam/` + id, {
    params: {
      'id': parseInt(id),
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function pushCourse(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'userId': parseInt(window.localStorage.getItem("saasid")),
    'course': parseInt(po.course),
    'desc': po.desc,
    'pushTime': parseInt(po.pushtime),
    'chapter': parseInt(po.chapter),
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.pushId) params.pushId = po.pushId;
  return axios.post(`${base}/course/push`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function canclePushCourse(po) {
  return axios.delete(`${base}/course/push/` + po.pushId, {
    params: {
      'userId': parseInt(window.localStorage.getItem("saasid")),
      'course': po.course,
      'pushId': po.pushId,
      'chapter': po.chapter,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function addTag(po) {
  var params = {
    'name': po.name,
    'type': po.type,
    'desc': po.desc,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/tags`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function updTag(po) {
  var params = {
    'id': po.id,
    'name': po.name,
    'type': po.type,
    'desc': po.desc,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/tags`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delTag(po) {
  return axios.delete(`${base}/tags/` + po.id, {
    params: {
      'id': po.id,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getTag(po) {
  var params = {
    'id': po.id,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/tags/` + po.id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getTagList(po) {
  var params = {
    'type': po.type,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/tags`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addTagUser(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'tid': po.tid,
    'ulist': po.ulist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/tags/user`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function addUserTag(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'uid': po.uid,
    'tlist': po.tlist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/tags/user`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function getUserTag(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/tags/user/` + po.uid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getTagUser(po) {
  var params = {
    'tid': po.tid,
    'paPageNum': po.paPageNum,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/tags/user`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function delTagUser(po) {
  let config = {
    headers: {
      'content-type': 'application/json;charset=utf-8',
    }
  };
  var params = {
    'tid': po.tid,
    'ulist': po.ulist,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/tags/user`, JSON.stringify(params), config).then(function getRes(res) {
    return res.data
  })
};

export function associateExam(po) {
  var params = {
    'course': po.course,
    'chapter': po.chapter,
    'exam': po.exam,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/course/exam`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function cancleAssociateExam(po) {
  return axios.delete(`${base}/course/exam`, {
    params: {
      'course': po.course,
      'chapter': po.chapter,
      'exam': po.exam,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function getAppVersion(po) {
  var params = {
    'osType': po.osType,
    'app': po.name,
    'versionCode': 1,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/getAppVersion`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getExamResult(po) {
  var params = {
    'userId': parseInt(window.localStorage.getItem("saasid")),
    'eid': po.eid,
    'channel': po.channel,
    'channelval': po.channelval,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/exam/report/` + po.eid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getExamResultByUser(po) {
  var params = {
    'userId': parseInt(window.localStorage.getItem("saasid")),
    'eid': po.eid,
    'uid': po.uid,
    'channel': po.channel,
    'channelval': po.channelval,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/exam/report/` + po.eid + `/` + po.uid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getStatistic(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'userId': window.localStorage.getItem("saasid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.beginTime) params.beginTime = po.beginTime;
  if (po.endTime) params.endTime = po.endTime;
  return axios.get(`${base}/exam/report/org/` + oid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getUserStatistic(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'userId': window.localStorage.getItem("saasid"),
    'uid': po.uid,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/exam/report/org/` + oid + `/u/` + po.uid, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getAdvertList(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/adt/`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getAdvert(po) {
  let oid = window.localStorage.getItem("saasoid");
  var params = {
    'oid': oid,
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/adt/` + po.id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addadvert(po) {
  var params = {
    'name': po.name,
    'val': po.val || '',
    'cover': po.cover,
    'oid': window.localStorage.getItem("saasoid"),
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/adt`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

// export function updAdvert (po) {
//   let config = {
//     headers: {
//       'content-type':'application/json;charset=utf-8',
//     }
//   };
//   var params ={
//     'oid':window.localStorage.getItem("saasoid"),
//     'id':po.id,
//     'name':po.name,
//     'val':po.val,
//     'cover':po.cover,
//     'status': po.status
//   }
//   return axios.put(`${base}/adt/`+po.id, JSON.stringify(params), config).then(function getRes (res) {return res.data})};

export function updAdvert(po) {
  var params = {
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  if (po.name !== '') {
    params['name'] = po.name;
  }
  if (po.status !== '') {
    params['status'] = po.status;
  }
  if (po.val !== '') {
    params['val'] = po.val;
  }
  if (po.cover !== '') {
    params['cover'] = po.cover;
  }
  if (po.sort !== '') {
    params['sort'] = po.sort;
  }

  return axios.put(`${base}/adt`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delAdvert(po) {
  return axios.delete(`${base}/adt/` + po.id, {
    params: {
      'id': po.id,
      'oid': window.localStorage.getItem("saasoid"),
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function saasInit(po) {
  var params = {
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/saasIndex`, {
    params
  }).then(function getRes(res) {
    if (res.data.themeName) window.localStorage.saasThemeName = res.data.themeName;
    return res.data
  })
};

export function getCommentList(refid) {
  var params = {
    'refid': refid,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/livecomment/all`, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function getComment(po) {
  let oid = window.localStorage.getItem("saasoid");
  var params = {
    'oid': oid,
    'id': po.id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.get(`${base}/adt/` + po.id, {
    params
  }).then(function getRes(res) {
    return res.data
  })
};

export function addComment(po) {
  var params = {
    'oid': window.localStorage.getItem("saasoid"),
    'name': po.name,
    'val': po.val || '',
    'cover': po.cover,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/adt`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function verifyComment(id) {
  var params = {
    'userId': window.localStorage.getItem("saasid"),
    'id': id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/livecomment/verified`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function rejectComment(id) {
  var params = {
    'userId': window.localStorage.getItem("saasid"),
    'id': id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.put(`${base}/livecomment/rejected`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};

export function delComment(id) {
  return axios.delete(`${base}/livecomment/` + id, {
    params: {
      'userId': window.localStorage.getItem("saasid"),
      'id': id,
      'token': TOKEN,
      'osType': OSTYPE,
      'version': VERSION,
      'time': new Date().getTime()   // 区分不同的请求，不传给后台
    }
  }).then(function getRes(res) {
    return res.data
  })
};

export function resetPwd(id) {
  var params = {
    'id': id,
    'token': TOKEN,
    'osType': OSTYPE,
    'version': VERSION,
    'time': new Date().getTime()   // 区分不同的请求，不传给后台
  }
  return axios.post(`${base}/user/resetPassword`, qs.stringify(params)).then(function getRes(res) {
    return res.data
  })
};
