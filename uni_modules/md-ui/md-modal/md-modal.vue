<template>
  <view class="md-dialog" :class="visiable ? 'show' : ''">
    <view class="mask"></view>
    <view class="wrapper" :style="warpperStyle">
      <view class="container">
        <image
          :src="IMGURL + 'img/home/bg-banner.png'"
          class="md-dialog-bg"
          mode="widthFix"
        ></image>
        <view class="header flex-space-between">
          <text class="title fw-bold flex1" :style="{textAlign:titleCenter?'center':'left'}">{{ title }}</text>
          <button class="rbtn right-close" @click="cancel">
            <text class="icon-close"></text>
          </button>
        </view>
        <view class="content">
          <slot></slot>
        </view>
        <view
          class="footer flex flex-center pl-66 pr-66 pb-26"
          v-if="!hideButton"
        >
          <md-button
            v-show="hasCancel"
            type="cancel"
            class="b-btn cancel-btn"
            @click="cancel"
            >{{ cancelText }}</md-button
          >
          <md-button class="b-btn" @click="confirm">{{
            confirmText
          }}</md-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    title: {
      type: String,
      default: ''
    },
    hideButton: {
      type: Boolean,
      default: false
    },
    hasCancel: {
      type: Boolean,
      default: true
    },
	titleCenter:{
		type: Boolean,
		default: false
	},
	warpperStyle:{
		type:String,
		default:null
	}
  },
  computed: {
    visiable: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  methods: {
    disabledScroll() {
      return;
    },
    cancel() {
      this.$emit('cancel');
      this.visiable = false;
    },
    confirm() {
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: none;
  &.show {
    display: block;
  }
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 510rpx;
    height: 366rpx;
    background: #ffffff;
    box-shadow: 0rpx 5rpx 13rpx 0rpx rgba(189, 189, 189, 0.8);
    border-radius: 20rpx;
    padding: 14rpx;
    overflow: hidden;
    .container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .md-dialog-bg {
        position: absolute !important;
        top: -14rpx;
        left: -100rpx;
        width: 366rpx;
        pointer-events: none;
      }
    }
    .header {
      font-size: 28rpx;
      height: 60rpx;
			padding-left: 14rpx;
      // margin-top: -14rpx;
      .right-close {
        font-size: 32rpx;
      }
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 24rpx;
    }
    .footer {
      .b-btn {
        /deep/ .md-btn {
          width: 140rpx;
        }
      }
      .cancel-btn {
        margin-right: 98rpx;
      }
    }
  }
}
</style>
