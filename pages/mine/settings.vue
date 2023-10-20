<template>
	<view class="page-settings">
		<view class="card">
			<view class="item" v-for="(item, index) in navList" :key="index">
				<button class="rbtn" @click="handleClick(item.value)">
					<text class="label">{{ item.label }}</text>
					<text class="icon-right"></text>
				</button>
			</view>
			<view class="item">
				<button class="rbtn" @click="handleUrl('/pages/mine/settings/share')">
					<text class="label">分享</text>
					<text class="icon-right"></text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import itemList from './settings/itemList.js';
export default {
	data() {
		return {
			navList: itemList
		};
	},
	mounted() {},
	methods: {
		handleClick(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type
			});
		},
		handleUrl(url) {
			if (!url) return;
			uni.navigateTo({
				url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page-settings {
	padding-top: 28rpx;
	.card {
		width: 688rpx;
		padding: 0 40rpx 0 20rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #fff;
		box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(153, 153, 153, 0.11);
		font-size: 24rpx;
		color: #666;
		font-weight: bold;
		.item {
			border-bottom: 2rpx solid #d8d8d8;
			&:nth-last-child(1) {
				border-bottom: 0;
			}
			.rbtn {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 80rpx;
			}
		}
	}
}
</style>
