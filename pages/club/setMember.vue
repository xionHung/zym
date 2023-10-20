<template>
	<PageComp title="设置管理员" :isApplique="false" navStyle="background: #fff" >
		<md-divider :height="30" />
		<view class="box-card">
			<view class="flex-center">
				<md-avatar :width="112" />
			</view>
			<view class="remark">{{ '管理员无法进行以下操作' }}</view>
			<view class="items">
				<view class="item">{{'提现'}}</view>
				<view class="item">{{'资金明细'}}</view>
				<view class="item">{{'充值卡管理'}}</view>
				<view class="item">{{'成员管理'}}</view>
			</view>
			<view class="add flex-center" @click="jump">
				<text class="icon icon-plus" />
				<text>{{ '添加管理员' }}</text>
			</view>
		</view>
		
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		methods: {
			async init() {
				let {data} = await this.$api.Club.memberManage({club_id: this.id});
				this.main = data.admin;
				this.member = data.member.data;
			},
			jump() {
				console.log(123);
				uni.redirectTo({
					url: '/pages/club/choose?id=' + this.id,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-card {
		background-color: #fff;
		box-shadow: 0 5rpx 8rpx 0 rgba(216,215,215,0.36);
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx 30rpx 10rpx;
		.remark {
			font-size: 30rpx;
			color: #333;
			margin-top: 30rpx;
		}
		.items {
			padding: 24rpx 0 26rpx 60rpx;
			color: #333;
			font-size: 24rpx;
			line-height: 1;
			border-bottom: 1rpx solid #d8d8d8;
			.item {
				margin-bottom: 10rpx;
				position: relative;
				&:last-child {
					margin: 0;
				}
				&::before {
					content: '';
					width: 8rpx;
					height: 8rpx;
					background-color: $themeColor;
					border-radius: 50%;
					position: absolute;
					left: -20rpx;
					top: 8rpx;
				}
			}
		}
		.add {
			height: 140rpx;
			font-size: 26rpx;
			color: #999;
			font-weight: bold;
		}
	}
</style>