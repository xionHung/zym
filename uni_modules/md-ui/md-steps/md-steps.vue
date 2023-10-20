<template>
	<view class="md-step">
		<view class="process-box">
			<view class="process" :style="processStyle"></view>
			<view class="circle-box flex-center" :style="circleStyle">
				<view class="circle"></view>
			</view>
		</view>
		<view class="label-list flex">
			<view class="step-label" :class="{active: current === index}" v-for="(item, index) in list" :key="index">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array,
			current: {
				type: Number,
				default: () => 0,
			},
		},
		computed: {
			processStyle() {
				let percentage = 100 / (this.list.length - 1);
				return `width: ${percentage * this.current}%`;
			},
			circleStyle() {
				let percentage = 100 / (this.list.length - 1);
				let data = percentage * this.current;
				if (data === 0) return `left: 0`;
				if (data === 100) return `left: calc(100% - 34rpx)`;
				return `left: calc(${data}% - 17rpx)`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.md-step {
		padding-top: 17rpx;
		.process-box {
			position: relative;
			height: 8rpx;
			border-radius: 3rpx;
			background: rgba($color: $themeColor, $alpha: 0.2);
			.process {
				height: 100%;
				border-radius: 3rpx;
				background-color: $themeColor;
			}
			.circle-box {
				width: 34rpx;
				height: 34rpx;
				border-radius: 50%;
				background-color: $themeColor;
				position: absolute;
				top: calc(50% - 17rpx);
				.circle {
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background-color: #fff;
				}
			}
		}
		.label-list {
			margin-top: 38rpx;
			font-size: 26rpx;
			line-height: 1;
			color: #999999;
			.step-label {
				flex: 1;
				text-align: center;
				&:first-child {
					text-align: left;
				}
				&:last-child {
					text-align: right;
				}
				&.active {
					color: $themeColor;
				}
			}
		}
	}
</style>