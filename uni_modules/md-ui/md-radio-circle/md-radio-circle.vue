<template>
	<view class="md-radio-circle flex-center" :class="{avtive: value}" @click="_click">
		<view class="circle"></view>
	</view>
</template>

<script>
	export default {
		props: {
			value: Boolean,
			disabled: Boolean,
		},
		methods: {
			_click() {
				if (this.disabled) return;
				this.$emit('input', !this.value);
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-radio-circle {
		width: 34rpx;
		height: 34rpx;
		background: $color999;
		border-radius: 50%;
		&.avtive {
			background: $themeColor;
		}
		.circle {
			width: 14rpx;
			height: 14rpx;
			background: #F7F7F7;
			border-radius: 50%;
		}
	}
</style>