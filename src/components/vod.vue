<template>
  <div class="video-box">
    <div class="player">
      <video-player class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="false"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @statechanged="playerStateChanged($event)"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  import '../../node_modules/video.js/dist/video-js.css'
  import '../../node_modules/vue-video-player/src/custom-theme.css'
  import 'videojs-contrib-hls' // 引入才能播放m3u8文件
  import 'videojs-flash' // 引入才能播放rtmp视频

  export default {
    data () {
      return {
        playerOptions: {
          playbackRates: [0.8, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [ // 流配置，数组形式，会根据兼容顺序自动切换
            {
              type: "rtmp/mp4",
              type: "video/mp4",
              type: "application/x-mpegURL",
              src: window.localStorage.saashttphost
              // src: 'rtmp://120.132.18.193:1935/live/9999',
              // src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
              // src: 'http://120.132.18.193:8080/vod/2018/6/29/1530263522730512.mp4'
            }
          ],
          techOrder: ['flash', 'html5'], // 兼容顺序
          sourceOrder: true,
          flash: { hls: { withCredentials: false }}, //可以使用rtmp视频
          html5: { hls: { withCredentials: false }},//可以使用m3u8视频
          // poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-3.jpg', // 你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: true, // 进度条
            customControlSpacer: true, // 未知
            fullscreenToggle: true // 全屏
          }
        }
      }
    },
    watch: {
      //更改视频源 videoUrl从弹出框组件传值
      videoUrl: function (val) {
        if (val !== '') {
          this.$refs.videoPlayer.player.src(val)
        }
      },
      //弹出框关闭后暂停 否则一直在播放 state从弹出框组件传值
      state: function (val) {
        if (val) {
          this.$refs.videoPlayer.player.pause()
        }
      }
    },
    components: { videoPlayer },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    mounted () {
      console.log(this.playerOptions.sources[0].src);
    },
    beforeDestroy(){
      window.localStorage.removeItem('saaslivesrc');
    },
    methods: {
      onPlayerPlay (player) { console.log('paly') },
      onPlayerPause (player) { console.log('pause') },
      playerStateChanged (player) {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css">
.vjs_video_3-dimensions.vjs-fluid { padding-top: 0; }
.video-js { position: static; }
.video-js.vjs-fluid { padding-top: 0 !important; }
.vjs-custom-skin>.video-js { height: 100%; }
</style>
