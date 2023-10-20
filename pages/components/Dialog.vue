<template>
	<view class="cu-modal" :class="visiable ? 'show' : ''" @click="cancel">
		<view class="cu-dialog" @click.stop="() => ({})" :style="style">
			<slot></slot>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: () => false
		},
		style: String,
		title: String,
		cancelText: {
			type: String,
			default: () => '取消'
		},
		confirmText: {
			type: String,
			default: () => '确定'
		},
		// 配合具名插槽footer使用
		customFooter: {
			type: Boolean,
			default: () => false
		}
	},
	computed: {
		visiable: {
			get() {
				return this.show;
			},
			set(val) {
				this.$emit('update:show', val);
			}
		}
	},
	methods: {
		cancel() {
			this.$emit('cancel');
			this.visiable = false;
		},
		confirm() {
			this.$emit('confirm');
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-modal {
	display: flex;
	align-items: center;
	justify-content: center;
	.cu-dialog {
		border-radius: 20rpx;
	}
}
</style>
