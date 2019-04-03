<template>
<div class="demo">
  <!-- 遮罩层 -->
  <div class="modal" v-show="panel"></div>
  <div class="box" :id="boxId" v-show="panel">
    <div class="wrap">
      <h3>裁剪合适的图片大小</h3>
      <div class="picture">
        <img :id="cropperId" :src="url" alt="Picture" width="100%">
      </div>
      <div class="button">
        <button type="button" @click="crop">确定</button>
        <button type="button" @click="cancle">取消</button>
        <button type="button" @click="zoomin">放大</button>
        <button type="button" @click="zoomout">缩小</button>
      </div>
    </div>
  </div>

  <div v-if="hackReset">
    <div class="show" :style="{ width: width + 'px', height: width / parseFloat(aspectRatio) + 'px' }">
      <!-- <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div> -->
      <img class="picture" :src="headerImage" :onerror="errorImg" />
    </div>
    <div class="choose upload">
      <p>*仅支持JPG、PNG格式的图片文件</p>
      <p>文件大小小于2M</p>
      <el-button size="small" style="width:80px">本地上传</el-button>
      <input type="file" name="files" class="change" ref="inputer" title="点击选择本地文件" accept="image" @change="change">
      <label for="change"></label>
    </div>
  </div>
</div>
</template>

<script>
import Cropper from 'cropperjs'
import axios from 'axios'
import {
  Uppinture
} from '@/api/api'

export default {
  props: {
    // 展示裁剪图片的比例
    aspectRatio: {
      type: Number,
      default: 1
    },
    // 展示图片div的宽度
    width: {
      type: Number,
      default: 250
    },
    // 裁剪框距离浏览器窗口顶部的距离
    marginTop: {
      type: String,
      default: '30'
    },
    // 是否显示图片，修改时显示已有图片，添加时不显示
    source: {
      type: String,
      default: ''
    },
    // 裁剪框id
    boxId: {
      type: String,
      default: 'box'
    },
    // copper实例化的div容器id
    cropperId: {
      type: String,
      default: 'image'
    }
  },
  data() {
    return {
      headerImage: '',
      picValue: '',
      cropper: '',
      croppable: false,
      panel: false,
      url: '',
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      UploadFileUrl: window.localStorage.saasUploadFileUrl ? window.localStorage.saasUploadFileUrl : '',
      hackReset: false
    }
  },
  mounted() {
    //初始化这个裁剪框
    var self = this;
    var image = document.getElementById(this.cropperId);
    this.cropper = new Cropper(image, {
      // Options: https://www.npmjs.com/package/cropperjs
      aspectRatio: this.aspectRatio, // 截图比例，1代表1:1，16/9代表16:9
      viewMode: 1, // 定义cropper的视图模式。如果将viewMode设置为0，裁剪框可以扩展到画布之外，而1、2或3的值将限制裁剪框的大小。viewMode为2或3时，还会将画布限制在容器中。注意，如果画布和容器的比例相同，那么2和3之间没有区别。
      background: true, //是否显示背景
      zoomable: true, //是否可以缩放
      dragMode: 'move', //拖拽模式,默认为crop:产生一个新的裁剪框,可改变大小,move:可移动图片,none:不可移动图片
      autoCropArea: 0.8, //定义初始化裁剪框对比图片的比例大小,默认为0.8
      cropBoxResizable: false, //是否可以调整剪裁框的大小
      cropBoxMovable: true, //是否可以移动剪裁框
      ready: function() {
        self.croppable = true;
      }
    });
    console.log('source', this.source);
    if (this.source) {
      this.hack(this.source);
    } else {
      this.hack();
    }
    if (document.getElementById(this.boxId)) {
      document.getElementById(this.boxId).style.top = this.marginTop + 'px';
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
    hack(url) {
      console.log('url', url);
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
        if (url) this.headerImage = url;
      })
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    change(e) {
      console.log('change');
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.panel = true;
      this.picValue = files[0];

      this.url = this.getObjectURL(this.picValue);
      //每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      this.panel = true;
    },
    crop() {
      let _this = this;
      this.panel = false;
      var croppedCanvas;
      var roundedCanvas;

      if (!this.croppable) {
        return;
      }
      // Crop
      // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        //通过FormData构造函数创建一个空对象
        var formData = new FormData();
        var name = new Date().getTime() + '.png';
        //可以通过append()方法来追加数据
        formData.append('files', blob, name);
        console.log('blob');
        console.log(blob);
        // Use `jQuery.ajax` method
        this.Jq.ajax(this.UploadFileUrl, {
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success(response) {
            let data = JSON.parse(response);
            console.log('Upload success');
            console.log(data); // '{"success":true,"resMsg":"upload success","fileurl":"http://192.168.21.196:2505/group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filepath":"group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filename":"1551766934981.png","filesize":529418,"filetype":"png","upload":true}'
            if (data.success) {
              console.log(data.fileurl);
              _this.hack(data.fileurl);
              this.headerImage = data.fileurl;
              // console.log('this.headerImage');
              console.log(this.headerImage);
              _this.$emit('upload', data.fileurl); //触发 upload方法，data.url为向父组件传递的数据
            } else {
              console.log(data.resMsg);
              _this.openError('系统异常！');
            }
          },
          error() {
            console.log('Upload error');
          },
        });
      });
      console.log('this.headerImage');
      console.log(this.headerImage);

      // var reader = new FileReader();
      // // 将图片将转成 base64 格式
      // reader.readAsDataURL(_this.file);
      // reader.onload = function() {
      //   console.log(this.result);
      //   this.url = this.result;
      //   //每次替换图片要重新得到新的url
      //   if (this.cropper) {
      //     this.cropper.replace(this.url);
      //   }
      //   this.panel = true;
      //   // _this.imgCropperData.imgSrc = this.result;
      //   // _this.initCropper();
      // }

      // console.log('this.headerImage');
      // console.log(this.headerImage);
      // this.postImg()
    },
    processData(dataUrl) {
      var binaryString = window.atob(dataUrl.split(',')[1]);
      var arrayBuffer = new ArrayBuffer(binaryString.length);
      var intArray = new Uint8Array(arrayBuffer);
      for (var i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
      }

      var data = [intArray],
        blob;

      try {
        blob = new Blob(data);
      } catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
        if (e.name === 'TypeError' && window.BlobBuilder) {
          var builder = new BlobBuilder();
          builder.append(arrayBuffer);
          blob = builder.getBlob(imgType); // imgType为上传文件类型，即 file.type
        } else {
          console.log('版本过低，不支持上传图片');
        }
      }
      return blob;
    },
    blob(blob) {
      var formData = new FormData();
      var name = new Date().getTime() + '.png';
      formData.append(name, blob);
      $ajax(this.UploadFileUrl, {
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
          console.log(data);
        },
        error: function(error) {
          console.log(error);
        }
      });
    },
    cancle() {
      this.panel = false;
      this.url = ''
      this.hack()
    },
    zoomin() {
      if (this.cropper) {
        this.cropper.zoom(0.2);
      }
    },
    zoomout() {
      if (this.cropper) {
        this.cropper.zoom(-0.2);
      }
    },
    getPicCanvas(sourceCanvas) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var width = sourceCanvas.width;
      var height = sourceCanvas.height;

      canvas.width = width;
      canvas.height = height;

      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      // context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
      context.fill();

      return canvas;
    },
    postImg() {
      console.log(this.UploadFileUrl);
      console.log('change');

      if (this.UploadFileUrl.indexOf('null') > -1) return this.openError('上传地址请求失败，请联系管理员！')
      // 图片的上传操作
      //通过FormData构造函数创建一个空对象
      var formData = new FormData();
      var name = new Date().getTime() + '.png';
      // var blobImg = this.convertBase64UrlToBlob(this.headerImage);
      // var blobImg = this.blobToFile(this.dataURLtoBlob(this.headerImage), name);
      // var blobImg = window.dataURLtoBlob && window.dataURLtoBlob(this.headerImage);
      var blobImg = this.processData(this.headerImage);
      console.log('blobImg');
      console.log(blobImg);
      //可以通过append()方法来追加数据
      formData.append('files', blobImg, name)
      // 通过get方法对值进行读取 console.log(formData.get("files"));

      var xhr = new XMLHttpRequest();
      xhr.open("post", this.UploadFileUrl);
      // xhr.open("post", 'http://192.168.21.196:3000/file2');
      xhr.send(formData);
      xhr.onload = () => {
        let data = JSON.parse(xhr.response);
        if (xhr.status == 200 && data.success) {
          console.log(xhr.response); // '{"success":true,"resMsg":"upload success","fileurl":"http://192.168.21.196:2505/group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filepath":"group1/M00/00/00/rBEAAlx-FXqANWmYAAgUCnKI3ng239.png","filename":"1551766934981.png","filesize":529418,"filetype":"png","upload":true}'
          console.log(data.fileurl);
          this.$emit('upload', data.fileurl); //触发 upload方法，data.url为向父组件传递的数据
          // if (data.fileurl) this.openSuccess('图片上传成功！')
        } else {
          console.log(xhr.response.resMsg);
          this.openError('系统异常！');
        }
      }
    },
    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
        type: 'image/png'
      });
    },
    //将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },
    //将blob转换成file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.demo .button {
  height: 50px;
  margin-top: 30px;
}

.demo .button button {
  height: 40px;
  float: right;
  margin-right: 10px;
  width: 80px;
  border: none;
  border-radius: 5px;
  background: #1f78d1;
  color: #fff;
}

.demo .show {
  float: left;
  margin-right: 15px;
  overflow: hidden;
  position: relative;
  /* border-radius: 50%; */
  border: 1px solid #d5d5d5;
}

.demo .choose {
  float: left;
  position: relative;
}

.demo .choose p {
  height: 30px;
  line-height: 30px;
}

.demo .choose .el-button {
  margin-top: 20px;
}

.demo .show .picture {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.demo .box {
  width: 600px;
  margin: 0 auto;
  z-index: 99;
  position: fixed;
  left: 0;
  /* top: 30px; */
  right: 0;
  background: #fff;
  border-radius: 5px;
}

.demo .modal {
  /* background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0; */
}

.demo .box .wrap {
  border: solid 1px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.demo .box .wrap h3 {
  height: 60px;
  line-height: 60px;
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.demo .box .wrap .picture {
  padding: 20px 0;
  box-sizing: border-box;
  height: 500px;
}

.demo #image {
  max-width: 100%;
}

.change {
  position: absolute;
  left: 0;
  width: 80px;
  height: 28px;
  margin-top: 20px;
  opacity: 0;
}

.cropper-view-box,
.cropper-face {
  /* border-radius: 50%; */
}

/*!
 * Cropper.js v1.0.0-rc
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-03-25T12:02:21.062Z
 */

.cropper-container {
  font-size: 0;
  line-height: 0;

  position: relative;

  -webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;

  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}

.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: .5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;

  width: 100%;
  height: 100%;

  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;

  display: block;

  opacity: .5;
  border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;

  display: block;

  width: 0;
  height: 0;

  opacity: .75
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;

  display: block;

  width: 100%;
  height: 100%;

  opacity: .1;
}

.cropper-face {
  top: 0;
  left: 0;

  background-color: #fff;
}

.cropper-line {
  background-color: #39f
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}

.cropper-point {
  width: 5px;
  height: 5px;

  opacity: .75;
  background-color: #39f
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}

@media (min-width: 768px) {

  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}

@media (min-width: 992px) {

  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}

@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  position: absolute;

  display: block;

  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
.cropper-container.cropper-bg, .cropper-canvas {
  width: 100% !important;
  height: 100% !important;
}
.cropper-hide {
  width: 100% !important;
  height: 100% !important;
}
</style>
