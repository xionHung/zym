<template>
	<view class="app-warp">
		<!-- 安全域 -->
		<view class="status_bar" :style="navCustomStyle"></view>
		<!-- 导航栏内容 -->
		<view class="header-box" :style="navStyle">
			<!-- 左边 -->
			<view class="left">
				<view class="left-box" v-if="isShowBack">
					<slot name="nav-left">
						<text class="icon-left" :style="{color:leftIconColor}" @click="backEvent" />
						<text v-if="leftIconText">{{ leftIconText }}</text>
					</slot>
				</view>
			</view>
			<!-- 中间文字 -->
			<view class="header-container" :style="{color:titleColor}">{{ title }}</view>
			<!-- 右边内容 -->
			<view class="right">
				<slot name="nav-right"></slot>
			</view>
			<!-- 小贴画 -->
			<image v-if="isApplique" :src="IMGURL + 'img/home/bg-banner.png'" class="icon-bg" mode="widthFix" />
			<!-- 小圆弧背景 -->
			<view v-if="isArc" class="fixed-head-bg" :style="bgHeight ? `height:${bgHeight}` : ''" />
		</view>
		<!-- 上内容自定义一般用于不滚动的内容 -->
		<slot name="header"></slot>
		<view class="app-container">
			<slot></slot>
		</view>
		<view class="footer-box">
			<slot name="footer">
				<!-- 按钮 -->
				<view class="btn" v-if="isFooterbtn" @click="confirm">{{ btnText }}</view>
			</slot>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: String,
		leftIconText: String,
		isShowBack: {
			type: Boolean,
			default: () => true,
		},
		isApplique: {
			type: Boolean,
			default: () => true,
		},
		isArc: Boolean,
		customBackFun: Function,
		navStyle: String,
		bgHeight: {
			type: String,
			default: '',
		},
		btnText: String,
		isFooterbtn: Boolean,
		leftIconColor:{
			type:String,
			default:"#FFF"
		},
		titleColor:{type:String,
			default:"#FFF"}
	},
	computed: {
		navCustomStyle() {
			return `padding-top: ${this.StatusBar}px;${this.navStyle}`;
		},
	},
	data() {
		return {
			StatusBar: this.StatusBar,
		};
	},
	methods: {
		backEvent() {
			if (this.customBackFun) return this.customBackFun();
			//获取路由
			let routes = getCurrentPages();
			// 说明不是刷新，分享等单个路由。
			if (routes && routes.length > 1) return uni.navigateBack();
			uni.reLaunch({
				url: '/pages/home/home',
			});
		},
		confirm() {
			this.$emit('confirm');
		},
	},
};
</script>

<style lang="scss" scoped>
.app-warp {
	height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
	background-color: #f7f7f7;
	.header-box {
		height: 88rpx;
		padding-left: 10rpx;
		padding-right: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		color: #333;
		.left,
		.right {
			flex: 1;
			position: relative;
			z-index: 3;
		}
		.left-box {
			min-width: 50rpx;
			display: inline-block;
			// color: $themeColor;
			color: inherit;
			// .icon-left {
			//   font-size: 30rpx;
			// }
		}
		.header-container {
			width: 300rpx;
			flex: none;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			position: relative;
			z-index: 3;
		}
		.icon-bg {
			width: 174rpx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
		}
		.fixed-head-bg {
			position: absolute;
			z-index: 1;
		}
	}
	.app-container {
		flex: 1;
		position: relative;
		z-index: 3;
		overflow: hidden auto;
	}
	.footer-box {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.btn {
			height: 88rpx;
			margin: 30rpx;
			box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
			border-radius: 35rpx;
			background: #ec6826;
			color: #fff;
			font-size: 28rpx;
			text-align: center;
			line-height: 88rpx;
		}
	}
}
</style>
