<template>
	<view class="cu-modal bottom-modal" :class="visiable ? 'show' : ''" @click="cancel">
		<view class="cu-dialog" @click.stop="() => ({})">
			<view class="title-box flex">
				<view class="line"></view>
				<view class="title">{{ title }}</view>
				<view class="line"></view>
			</view>
			<view class="dialog-content">
				<slot></slot>
			</view>
			<view class="dialog-footer flex-space-between" v-if="!customFooter">
				<view class="btn" @click.stop="cancel">{{ cancelText }}</view>
				<view class="btn active" @click="confirm">{{ confirmText }}</view>
			</view>
			<!-- 自定义底部按钮 -->
			<view class="dialog-footer" v-else>
				<slot name="footer"></slot>
			</view>
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
.cu-dialog {
	background: white;
	border-radius: 20rpx 20rpx 0px 0px !important;
}
.title-box {
	height: 124rpx;
	padding: 0 58rpx;
	.line {
		width: 170rpx;
		flex: none;
		border-bottom: 2rpx solid #d0cece;
	}
	.title {
		flex: 1;
		text-align: center;
		color: $themeColor;
		font-weight: bold;
		font-size: 36rpx;
		margin: 0 20rpx;
	}
}
.dialog-footer,
.dialog-content {
	padding: 0 58rpx;
}
.dialog-footer {
	margin-bottom: 40rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
	.btn {
		width: 230rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #e5e5e5;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #c4c4c4;
		&.active {
			color: #fff;
			background: $themeColor;
		}
	}
}
// @keyframes slide-bottom {
//   0% {
//     opacity: 0;
//     transform: translateY(100%);
//   }

//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
</style>
