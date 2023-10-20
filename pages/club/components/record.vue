<template>
	<view class="club-record" @click="_click">
		<image class="club-record-icon" :src="obj.image[0]" mode="aspectFill" />
		<view class="title">{{obj.title}}</view>
		<view class="flex-space-between">
			<view class="flex">
				<md-avatar :width="32" :src="obj.headpic" />
				<view class="name">{{ obj.nickname }}</view>
			</view>
			<view class="flex">
				<view class="mr-20">
					<text class="icon icon-heart"></text>
					<text class="num">{{ obj.like_num }}</text>
				</view>
				<view class="mr-20">
					<text class="iconfont icon-message"></text>
					<text class="num">{{ obj.comment_num }}</text>
				</view>
				<view>
					<text class="iconfont icon-fenxiang"></text>
					<text class="num">{{ obj.send_num }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			obj: Object,
		},
    methods: {
      _click() {
        uni.navigateTo({ url: '/pages/mine/person/share-details?id=' + this.obj.id });
      }
    }
	}
</script>

<style lang="scss" scoped>
	.club-record {
		&-icon {
			width: 100%;
			height: 196rpx;
			border-radius: 10rpx;
		}
		.title {
			color: #333;
			font-size: 26rpx;
			line-height: 1;
			margin: 14rpx 0 16rpx 0;
		}
		.name {
			color: #666;
			font-size: 22rpx;
			margin-left: 6rpx;
		}
		.iconfont {
			font-size: 30rpx;
		}
		.icon {
			font-size: 20rpx;
		}
		.num {
			color: #999;
			margin-left: 6rpx;
			font-size: 16rpx;
		}
	}
</style>