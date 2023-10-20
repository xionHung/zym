<template>
	<view class="md-linear-title flex-center">
		<view class="left" />
		<view class="title">{{ title }}</view>
		<view class="right" />
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: () => '标题'
			}
		},
	}
</script>

<style lang="scss">
	.md-linear-title {
		height: 104rpx;
		.title {
			color: #E1C178;
			font-size: 30rpx;
			font-weight: bold;
			margin: 0 40rpx;
		}
		.right,
		.left {
			width: 120rpx;
			height: 4rpx;
			border-radius: 4rpx;
			position: relative;
			flex: none;
			&::after {
				content: '';
				width: 6rpx;
				height: 6rpx;
				background: #E1C178;
				position: absolute;
				transform: rotateZ(45deg);
			}
			&.left {
				background: linear-gradient(90deg, #FFFFFF 0%, #E1C178 100%);
				&::after {
					right: -23rpx;
				}
			}
			&.right {
				background: linear-gradient(90deg, #E1C178 0%, #fff 100%);
				&::after {
					left: -23rpx;
				}
			}
		}
	}
</style>