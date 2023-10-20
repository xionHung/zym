<template>
	<view class="arena-item"  @click.stop="$emit('select', obj)">
		<md-image :src="obj.room_headpic" :width="140" :height="140" isPath :radius="20 " />
		<view class="container">
			<view class="title flex">
				<view class="mr-10">{{obj.name}}</view>
				<md-image v-if="obj.is_vip == 1" :height="34" :width="92" src="img/club/union.png" />
			</view>
			<view class="flex address">
				<text class="icon-location"></text>
				<view class="text-ellipsis">{{ obj.address }}</view>
				<view class="line" v-if="obj.distance">{{ obj.distance }}</view>
			</view>
			<view class="btns flex-space-between">
				<view class="devices">
					<view class="device" v-for="(item, index) in obj.room_device" :key="index" v-if="index < 3">{{ item }}</view>
				</view>
				<view class="btn">{{'预定'}}</view>
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		props: {
			obj: {
				type: Object,
				default: () => {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.arena-item {
		background: #FFFFFF;
		border: 2rpx solid rgba(254,106,28,0.29);
		box-shadow: 0px 4rpx 4rpx 0px rgba(254,106,28,0.22);
		border-radius: 20rpx;
		padding: 24rpx 20rpx 16rpx 22rpx;
		margin-bottom: 20rpx;
		display: flex;
		.container {
			margin-left: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
			overflow: hidden;
			.title {
				color: #333;
				font-size: 34rpx;
				font-weight: bold;
				line-height: 1;
			}
			.address {
				font-size: 22rpx;
				color: #666;
				.line {
					padding-left: 10rpx;
					margin-left: 10rpx;
					border-left: 1rpx solid #f3f3f3;
				}
			}
			.btns {
				.devices {
					display: flex;
					align-items: center;
					.device {
						height: 36rpx;
						line-height: 36rpx;
						background-color: #ededed;
						color: #666;
						font-size: 22rpx;
						border-radius: 14rpx;
						padding: 0 18rpx;
						margin-right: 16rpx;
						&:last-child {
							margin-right: 0;
						}
					}
				}
				.btn {
					width: 114rpx;
					height: 54rpx;
					background: $themeColor;
					border-radius: 27rpx;
					text-align: center;
					line-height: 54rpx;
					color: #fff;
					flex: none;
					font-size: 30rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>