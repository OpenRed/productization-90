<template>
<div style="text-align: center;position: absolute;left: 0;right: 0;bottom: 20px;top: 75px;">
  <div>
    <img src="../static/img/logo90.png" alt="" style="border-radius:14px;width:128px;" />
    <a id="ver">{{version}}</a>
  </div>
  <div class="telp" style="bottom: 150px;position: absolute;text-align: center;left: 0;right: 0;">
    <div style="text-align: center;width: 265px;height: 50px; line-height: 50px; border-radius:49px; background-color:#d3093b;margin: auto;">
      <a style="font-size: 20px; color: #ffffff;display: block;width: 100%;" :href="link">
        下载90分
      </a>
    </div>
  </div>

  <div style="bottom: 0;position: absolute;padding: 15px 0;text-align: center;left: 0;right: 0;">
    <a style="font-size: 10px;color: #666666;line-height: 1.6;">
      华平信息技术股份有限公司<br>
      Copyright@2017-2025 AVCT
    </a>
  </div>
</div>
</template>

<script>
import {
  getAppVersion
} from '../api/api';

export default {
  data: function() {
    return {
      Gloading: false,
      version: '1.0',
      link: ''
    }
  },
  metaInfo: {
    title: '90分', // set a title
    meta: [{ // set meta
      name: 'viewport',
      content: 'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1'
    }]
  },
  mounted() {
    this.getLink();
  },
  methods: {
    getLink() {
      let osType;
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
        osType = 1;
      } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
        osType = 2;
      } else { //pc
        osType = 2;
      };

      // if(osType==1) this.link = "itms-services://?action=download-manifest&url=https://training.avcon.com.cn/download/xinhua/manifest.plist";
      // else this.link = "https://training.avcon.com.cn/download/xinhua/Training-XinHua-2018-08-24.apk";

      // getAppVersion({name:'xinhua', osType:osType}).then(data=>{
      getAppVersion({
        name: '90分',
        osType: osType
      }).then(data => {
        // console.log(data);
        if (data.success) {
          if (data.download) this.link = data.download;
          if (data.version) this.version = data.version;
        } else alert(data.resMsg);
        // ios: "itms-services://?action=download-manifest&url=https://training.avcon.com.cn/download/xinhua/manifest.plist"
        // andriod: "https://training.avcon.com.cn/download/xinhua/Training-XinHua-2018-08-24.apk"
      });
    }
  }
}
</script>
<style scoped>
a {
  text-decoration: none
}

#ver {
  font-size: 20px;
  color: #000;
  display: block;
  margin-top: 20px;
}
</style>
