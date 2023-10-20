<template>
	<view class="md-tag" :style="style" @click="onClick">
		<slot></slot>
	</view>
</template>

<script>
// 16进制转rgb
function toRGB(sColor) {
	sColor = sColor.toLowerCase();
	//十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	// 如果是16进制颜色
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = '#';
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
		}
		return sColorChange.join(',');
	}
	return sColor;
}

export default {
	props: {
		color: {
			type: String,
			default: '#ff8a32'
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		style() {
			return `color: ${this.color}; background: ${this.active ? `rgba(${toRGB(this.color)}, .3)` : 'white'}; border: 1rpx solid ${
				!this.active ? this.color : `rgba(${toRGB(this.color)}, .3)`
			};`;
		}
	},
	data() {
		return {
			active: this.checked
		};
	},
	methods: {
		onClick() {
			this.active = !this.active;
			this.$emit('check', this.active);
		}
	}
};
</script>

<style scoped lang="scss">
.md-tag {
	display: inline-block;
	font-size: 24rpx;
	padding: 0 26rpx;
	height: 40rpx;
	line-height: 40rpx;
	// color: #ff8a32;
	// background: rgba(#ff8a32, .3);
	border-radius: 17rpx;
}
</style>
