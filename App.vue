<script>
import Vue from 'vue';
export default {
  data() {
    return {};
  },
  methods: {},
  async onLaunch() {
    const app = this.$scope;
    app.globalData.$api = this.$api;

    // #ifdef MP-WEIXIN
    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager();
      if (updateManager && updateManager.onCheckForUpdate) {
        updateManager.onCheckForUpdate(function(res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                  if (res.confirm) {
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function() {
              uni.showModal({
                title: '已经有新版本了~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              });
            });
          }
        });
      }
    }
    // #endif

    uni.getSystemInfo({
      success: function(e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      }
    });
  },
  onShow: function() {
    console.log('App Show');
    // #ifdef APP-PLUS
    // Vue.prototype.$store.dispatch('setLocation');
    // #endif
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style lang="scss">
@import url("colorui/main.css");
@import url("@/static/iconfont/style.css");
@import url("@/static/iconfont/iconfont.css");
@import url("@/static/uni.css");
@import url('@/static/iconfont/gamefont.css');
@import "@/static/global.scss";

/*每个页面公共css */
html,
body {
  width: 100%;
  height: 100%;
  font-family: PingFangSC-Medium, PingFang SC !important;
  color: #383838;
}

* {
  box-sizing: border-box;
}

page {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: PingFang-SC-Bold, PingFang-SC !important;
  background: #f7f7f7;
  font-size: 26rpx;
  box-sizing: border-box;
  /* font-weight: bold; */
}

.container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.icon-left {
  font-size: 42rpx;
}

.status_bar {
  flex: 0 0 var(--status-bar-height);
  height: var(--status-bar-height);
  line-height: var(--status-bar-height);
  text-align: center;
}

view {
  box-sizing: border-box;
}

/*每个页面公共css */
uni-button:after {
  border: none;
}

image {
  will-change: transform;
}

view {
  box-sizing: border-box;
}

.text-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-space-around {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.flex-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.flex-column {
  flex-direction: column;
}

.flex1 {
  flex: 1;
}

.flex2 {
  flex: 2;
}

.flex3 {
  flex: 3;
}

.pb-safe-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.input-placeholder,
.textarea-placeholder {
  color: #cbcbcb;
}

button {
  border-radius: 8rpx;
}

.rbtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  background: none;
  line-height: 1;
  font-size: inherit;
  color: inherit;
  border-radius: 8rpx;
  border-color: transparent;

  &:after {
    border: none;
  }

  &.disabled {
    background: #eaeaea !important;
    color: #93a1a8 !important;
  }
}

.em-4 {
  width: 4em;
  text-align-last: justify;
  // &:after {
  // 	content: '';
  // 	display: block;
  // }
}

.relative {
  position: relative;
}

.bold {
  font-weight: bold;
}

.switch-check {
  position: relative;
  width: 80rpx;
  height: 48rpx;
  border-radius: 48rpx;
  // border: 2rpx solid #ccc;
  background: #fff;
  box-shadow: 0 0 0rpx 2rpx #ccc;

  .switch-circle {
    position: absolute;
    left: 0;
    top: 0;
    width: 48rpx;
    height: 48rpx;
    // bottom: 0;
    border-radius: 50%;
    background: #fff;
    // border: 2rpx solid #ccc;
    box-shadow: 0 0 0rpx 2rpx #ccc;
    transition: all linear 0.1s;
  }

  &.checked .switch-circle {
    // left: auto;
    // right: 0;
    left: 32rpx;
    background: #bfd01e;
  }
}

.fixed-head-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 474rpx;
  background: rgb(254, 106, 28);
  // z-index: -1;
  border-radius: 0 0 380rpx 380rpx / 0 0 40rpx 40rpx;

  .icon-bg {
    position: absolute;
    top: 44rpx;
    width: 226rpx;
    height: 256rpx;
  }
}
.mgl20{
	margin-left: 20rpx;
}
.mgt20{
	margin-top: 20rpx;
}
.mgt30{
	margin-top: 30rpx;
}
.flexCls{
	display: flex;
}
.flexCls-center{
	display: flex;
	align-items: center;
}
.flexCls-wrap{
	display: flex;
	flex-wrap: wrap;
}
.page{
	padding: 0 30rpx;
}
</style>
