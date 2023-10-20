<template>
	<view class="md-avatar" :style="cutomStyle" @click.stop="_click">
		<slot>
			<image class="md-avatar-image" :src="src" mode="aspectFill" />
		</slot>
		<view class="sex-box flex-center" v-if="sex">
			<text :class="['iconfont', sex == 1 ? 'icon-nan' : 'icon-nv']"></text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			default: () => 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
		},
		width: {
			type: Number,
			default: () => 66
		},
		borderWidth: {
			type: Number,
			default: () => 0
		},
		borderColor: {
			type: String,
			default: () => ''
		},
		sex: {
			type: [String, Number],
			default: () => ''
		}
	},
	computed: {
		cutomStyle() {
			return `width: ${this.width}rpx; height: ${this.width}rpx;borderWidth: ${this.borderWidth}rpx; borderColor:${this.borderColor};borderType: solid`;
		}
	},
	methods: {
		_click() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss" scoped>
.md-avatar {
	border-radius: 50%;
	position: relative;
	&-image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
	}
	.sex-box {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background-color: #fff;
		right: 2rpx;
		bottom: 0rpx;
		font-size: 14rpx;
		position: absolute;
		.icon-nv {
			color: $red;
		}
		.icon-nan {
			color: #2793e1;
		}
	}
}
</style>
