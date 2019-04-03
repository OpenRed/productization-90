export function SaveMsg(params) {
  console.log(params);
  if (params.id === undefined) {
    params.id = '';
  }
  if (params.name === undefined) {
    params.name = '';
  }
  window.localStorage.setItem("saasid", params.id);
  window.localStorage.setItem("saastoken", params.token);
  window.localStorage.setItem("saasnickname", params.nickName);
  window.localStorage.setItem("saasname", params.name);
  window.localStorage.setItem("saasbirthday", params.birthday);
  if (params.gender === 0) {
    params.gender = '女';
  } else if (params.gender === 1) {
    params.gender = '男';
  } else {
    params.gender = '其他';
  }
  window.localStorage.setItem("saasgender", params.gender);
  // window.localStorage.setItem("saassuccess",params.success);
  if (params.orgList !== undefined) {
    window.localStorage.setItem("saasoid", params.orgList[0].id);
    window.localStorage.setItem("saasorg", JSON.stringify(params.orgList[0]));
  }
  window.localStorage.setItem("saasmobile", params.mobile);
  window.localStorage.setItem("saasicon", params.logoUrl);

  if (params.orgList !== undefined) {
    window.localStorage.setItem("saasorgList", JSON.stringify(params.orgList));
  }
};

export function ClearMsg(params) {
  window.localStorage.removeItem("saasid");
  window.localStorage.removeItem("saastoken");
  window.localStorage.removeItem("saasname");
  window.localStorage.removeItem("saasbirthday");
  window.localStorage.removeItem("saasgender");
  // window.localStorage.removeItem("saassuccess");
  window.localStorage.removeItem("saasoid");
  window.localStorage.removeItem("saasmobile");
  window.localStorage.removeItem("saaslogoUrl");
  window.localStorage.removeItem("saasorgList");
};


export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};

// export function showImgDelay(imgObj,imgSrc,maxErrorNum){
//     showSpan.innerHTML += "--" + maxErrorNum;    //显示出加载图片出错的次数
//      if(maxErrorNum>0){
//          imgObj.onerror=function(){
//              showImgDelay(imgObj,imgSrc,maxErrorNum-1);
//          };
//          setTimeout(function(){
//              imgObj.src=imgSrc;
//          },500);
//      }else{
//          imgObj.onerror=null;
//          imgObj.src="images/default.jpg";
//      }
//  }

export function Timetrans(date) {
  var date = new Date(date); //如果date为10位需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}
