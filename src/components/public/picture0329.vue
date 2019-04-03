<template>
<div class="">
  <div v-if="hackReset">
    <div class="show" :style="{ width: width + 'px', height: width / parseFloat(aspectRatio) + 'px', float: 'left' }">
      <img class="picture" :src="src" :onerror="errorImg" width="100%" height="100%" />
    </div>
    <div class="choose upload" style="float:left;margin-left:10px;">
      <label title="上传图片" class="choose-btn">
        <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" :id="cropperId" class="hidden" @change="change">
        <span>选择图片</span>
      </label>
    </div>
  </div>

  <!--图片裁剪框 start-->
  <div style="display: none" class="tailoring-container">
    <div class="black-cloth" @click="closebox"></div>
    <div class="tailoring-content">
      <div class="tailoring-content-one">
        <!-- <label title="上传图片" for="chooseImg" class="l-btn choose-btn">
          <input type="file" accept="image/jpg,image/jpeg,image/png" name="file" id="chooseImg" class="hidden" @change="change">
          选择图片
        </label> -->
        <div class="dialog-title">
          <h3>裁剪合适大小的图片</h3>
        </div>
        <div class="close-tailoring" @click="closebox">×</div>
      </div>
      <div class="tailoring-content-two">
        <div class="tailoring-box-parcel">
          <img :id="boxId">
        </div>
        <div class="preview-box-parcel">
          <p>图片预览：</p>
          <div class="square previewImg"></div>
          <!-- <div class="circular previewImg"></div> -->
        </div>
      </div>
      <div class="tailoring-content-three">
        <button class="l-btn cropper-reset-btn" type="button" @click="reset">复位</button>
        <button class="l-btn cropper-rotate-btn" type="button" @click="turnleft">左转</button>
        <button class="l-btn cropper-scaleX-btn" type="button" @click="turnright">右转</button>
        <button class="l-btn cropper-scaleX-btn" type="button" @click="zoomin">放大</button>
        <button class="l-btn cropper-rotate-btn" type="button" @click="zoomout">缩小</button>

        <button class="l-btn sureCut" id="sureCut" type="button" @click="crop" style="width:100px;">选择</button>
      </div>
    </div>
  </div>
  <!--图片裁剪框 end-->
</div>
</template>

<script>
import Cropper from 'cropperjs';

export default {
  props: {
    // 设置图片裁剪框的比例，1:1、16:9
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
      src: '',
      cropper: '',
      hackReset: true,
      errorImg: 'this.src="' + require('@/static/img/picture.jpg') + '"',
      UploadFileUrl: window.localStorage.saasUploadFileUrl ? window.localStorage.saasUploadFileUrl : ''
    }
  },
  mounted() {
    //初始化这个裁剪框
    var _this = this;
    var image = document.getElementById(this.boxId);
    this.cropper = new Cropper(image, {
      // Options: https://www.npmjs.com/package/cropperjs
      aspectRatio: _this.aspectRatio, //默认比例
      viewMode: 1, // 定义cropper的视图模式。如果将viewMode设置为0，裁剪框可以扩展到画布之外，而1、2或3的值将限制裁剪框的大小。viewMode为2或3时，还会将画布限制在容器中。注意，如果画布和容器的比例相同，那么2和3之间没有区别。
      dragMode: 'move', //拖拽模式,默认为crop:产生一个新的裁剪框,可改变大小,move:可移动图片,none:不可移动图片
      cropBoxResizable: false, //是否可以调整剪裁框的大小
      cropBoxMovable: true, //是否可以移动剪裁框
      preview: '.previewImg', //预览视图
      guides: false, //裁剪框的虚线(九宫格)
      autoCropArea: 0.8, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
      movable: false, //是否允许移动图片
      dragCrop: false, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
      movable: true, //是否允许移动剪裁框
      resizable: false, //是否允许改变裁剪框的大小
      zoomable: true, //是否允许缩放图片大小
      mouseWheelZoom: false, //是否允许通过鼠标滚轮来缩放图片
      touchDragZoom: true, //是否允许通过触摸移动来缩放图片
      rotatable: true, //是否允许旋转图片
      crop: function(e) {
        // 输出结果数据裁剪图像。
      }
    });

    console.log('source', this.source);
    if (this.source) {
      this.hack(this.source);
    } else {
      this.hack();
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
      // console.log('url', url);
      this.hackReset = false; // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true;
        if (url) this.src = url;
      })
    },
    change(e) {
      var _this = this;
      let files = e.target.files || e.dataTransfer.files;
      console.log(files);
      if (!files || !files[0]) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function(evt) {
        console.log('evt');
        console.log(evt);
        var replaceSrc = evt.target.result;
        //更换cropper的图片
        if (_this.cropper) {
          _this.cropper.replace(replaceSrc, false);
        }
        // _this.Jq('#tailoringImg').cropper('replace', replaceSrc, false); //默认false，适应高度，不失真
      }
      reader.readAsDataURL(files[0]);
      this.toggle();
    },
    toggle() {
      this.Jq(".tailoring-container").toggle();
    },
    closebox() {
      this.Jq(".tailoring-container").toggle();
    },
    reset() {
      console.log('reset');
      if (this.cropper) this.cropper.reset();
    },
    turnleft() {
      console.log('turnleft');
      if (this.cropper) this.cropper.rotate(90);
    },
    turnright() {
      console.log('turnright');
      if (this.cropper) this.cropper.rotate(-90);
    },
    zoomin() {
      console.log('zoomin');
      if (this.cropper) this.cropper.zoom(0.2);
    },
    zoomout() {
      console.log('zoomout');
      if (this.cropper) this.cropper.zoom(-0.2);
    },
    crop() {
      console.log('crop', this.croppable);
      let _this = this;

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
              _this.$emit('upload', data.fileurl); //触发 upload方法，data.url为向父组件传递的数据
              _this.hack(data.fileurl);
              _this.closebox();
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
    }
  }
}
</script>

<style>
@import '../../static/css/cropper.min.css';
* {
  margin: 0;
  padding: 0;
}

.l-btn {
  display: inline-block;
  outline: none;
  resize: none;
  border: none;
  padding: 5px 10px;
  background: #8C85E6;
  color: #fff;
  border: solid 1px #8C85E6;
  border-radius: 3px;
  font-size: 14px;
}

.l-btn:hover {
  background: #8078e3;
  animation: anniu 1s infinite;
}

.l-btn:active {
  box-shadow: 0 2px 3px rgba(0, 0, 0, .2) inset;
}

.hidden {
  display: none;
}

.tailoring-container, .tailoring-container div, .tailoring-container p {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.tailoring-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
}

.tailoring-container .black-cloth {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: .9;
  z-index: 1001;
}

.tailoring-container .tailoring-content {
  position: absolute;
  min-width: 800px;
  height: 570px;
  background: #fff;
  z-index: 1002;
  left: 50%;
  top: 50px;
  margin: 0 0 0 -400px;
  /* 水平垂直居中 浏览器版本号低的不支持transform */
  /*left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    -weblit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);*/
  border-radius: 10px;
  box-shadow: 0 0 10px #000;
  padding: 10px;
}

.tailoring-content-one {
  height: 40px;
  width: 100%;
  text-align: center;
}

.tailoring-content .choose-btn {
  float: left;
  line-height: normal;
}

.choose-btn span {
  width: 60px;
  padding: 7px 9px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #c4c4c4;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
}

.choose-btn span:hover {
  color: #20a0ff;
  border-color: #20a0ff;
}

.dialog-title {
  display: inline-block;
}

.tailoring-content .close-tailoring {
  display: inline-block;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: #eee;
  color: #fff;
  font-size: 22px;
  text-align: center;
  line-height: 30px;
  float: right;
  cursor: pointer;
}

.tailoring-content .close-tailoring:hover {
  background: #ccc;
}

.tailoring-content .tailoring-content-two {
  width: 100%;
  height: 470px;
  position: relative;
  padding: 8px;
  border: 1px solid #DDD;
}

.tailoring-content .tailoring-box-parcel {
  /* width: 520px; */
  width: calc(100% - 240px);
  height: 450px;
  position: absolute;
  /* left: 0; */
  border: solid 1px #ddd;
}

.tailoring-content .preview-box-parcel {
  display: inline-block;
  width: 228px;
  height: 450px;
  position: absolute;
  right: 0;
  padding: 4px 14px;
}

.preview-box-parcel p {
  color: #555;
}

.previewImg {
  width: 200px !important;
  height: 200px !important;
  overflow: hidden;
}

.preview-box-parcel .square {
  /* border: solid 1px #ddd; */
}

.preview-box-parcel .circular {
  border-radius: 100%;
  margin-top: 10px;
  border: solid 1px #ddd;
}

.tailoring-content .tailoring-content-three {
  width: 100%;
  height: 40px;
  padding-top: 10px;
  line-height: normal;
}

.sureCut {
  float: right;
}

@media all and (max-width: 768px) {
  .tailoring-container .tailoring-content {
    width: 100%;
    min-width: 320px;
    height: 460px;
  }

  .tailoring-content .tailoring-content-two {
    height: 360px;
  }

  .tailoring-content .tailoring-box-parcel {
    height: 350px;
  }

  .tailoring-container .tailoring-box-parcel {
    width: 100%;
  }

  .tailoring-container .preview-box-parcel {
    display: none;
  }
}
</style>
