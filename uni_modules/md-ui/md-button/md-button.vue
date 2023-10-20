<template>
	<view
		:class="{
			'md-btn': 'md-btn',
			primary: btnStatus === 'primary',
			gray: btnStatus === 'gray',
			disabled: btnStatus === 'disabled',
			white: btnStatus === 'white',
			cancel: btnStatus === 'cancel'
		}"
		@click="onClick"
	>
		<slot></slot>
	</view>
</template>

<script>
export default {
	props: {
		// priamry | gray | disable | white | cancel
		type: {
			type: String,
			default: () => 'primary'
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		// 处理按钮为禁用状态的样式
		btnStatus() {
			return this.disabled ? 'disabled' : this.type;
		}
	},
	data() {
		return {};
	},
	methods: {
		onClick() {
			// 处理按钮为禁用状态的交互
			if (this.disabled) return;
			this.$emit('click');
		}
	}
};
</script>

<style scoped lang="scss">
.md-btn {
	width: 100%;
	height: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 28rpx;
	font-size: 24rpx;
	color: #fff;
	padding: 12rpx 20rpx;
	line-height: 1;
}
.primary {
	background: $themeColor;
}
.gray {
	background: $color999;
}
.cancel {
	background: #eeeeee;
	color: #999999;
}
.disabled {
	background: #e5e5e5;
	color: #c4c4c4;
}
.white {
	background: white;
	color: #333;
}
</style>
