<template>
	<view class="md-title flex-space-between" @click="_click">
		<view class="title">{{ title }}</view>
		<slot></slot>
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
		methods: {
			_click() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-title {
		position: relative;
		.title {
			color: #333;
			font-size: 30rpx;
			font-weight: bold;
			line-height: 1;
			position: relative;
			z-index: 1;
		}
		&::before {
			content: '';
			width: 54rpx;
			height: 12rpx;
			border-radius: 6rpx;
			background-color: #ff945b;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
</style>