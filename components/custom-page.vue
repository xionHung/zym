<template>
	<view class="custom-page" :style="pageBg ? `background: ${pageBg};` : ''">
		<cu-custom :isBack="showBack" :leftStyle="leftStyle">
			<template #content>{{ title }}</template>
		</cu-custom>
		<view class="fixed-head-bg" :style="bgHeight ? `height:${bgHeight}` : ''">
			<image v-if="hasImage" :src="IMGURL + 'img/home/bg-banner.png'" class="icon-bg" mode="widthFix" :style="{ top: Number(StatusBar) + 'px' }"></image>
		</view>
		<!-- <view class="fixed-head-title flex-space-between">
      <view class="head-side">
        <button v-if="showBack" class="rbtn back-btn" @click="backEvent">
          <text class="icon-left"></text>
        </button>
      </view>
      <view class="title">{{ title }}</view>
      <view class="head-side"></view>
    </view> -->
		<view class="page-container">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '中羽盟'
		},
		showBack: {
			type: Boolean,
			default: true
		},
		bgHeight: {
			type: String,
			default: ''
		},
		pageBg: {
			type: String,
			default: ''
		},
		hasImage: {
			type: Boolean,
			default: true
		},
		leftStyle:{
			type: String,
			default: 'color: white;'
		}
	},
	data() {
		return {
			StatusBar: this.StatusBar,
		};
	},
	onReachBottom() {},
	mounted() {},
	created() {},
	methods: {
		// backEvent() {
		// 	console.log('handle back');
		// 	uni.navigateBack();
		// }
	}
};
</script>

<style lang="scss" scoped>
.custom-page {
	position: relative;
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.fixed-head-bg {
		z-index: 1;
	}
	.fixed-head-title {
		position: relative;
		flex: 0 0 56rpx;
		height: 56rpx;
		color: #fff;
		font-size: 32rpx;
		text-align: center;
		z-index: 1;
		.head-side {
			width: 80rpx;
		}
		.title {
			flex: 1;
			font-size: 30rpx;
		}
	}
	.page-container {
		display: flex;
		position: relative;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		z-index: 2;
	}
}
</style>
