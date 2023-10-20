<template>
	<view class="md-star flex-start">
		<text class="iconfont icon-star" :style="iconStyle" v-for="o of number" :key="o" />
		<text class="iconfont icon-star" :style="iconFillStyle" v-for="j of (5 - number)" :key="j" v-show="isFill" />
	  <!-- <image class="icon" :style="iconStyle" src="/static/img/icon/star.png" v-for="o of number" :key="o" /> -->
	</view>
</template>

<script>
	export default {
		props: {
			number: {
				type: Number,
				default: () => 0,
			},
			width: {
				type: Number,
				default: () => 21
			},
			isFill: Boolean, //是否展示灰色的星星
		},
		computed: {
			iconStyle() {
				return `font-size: ${this.width}rpx; color: #FE6A1C;`;
			},
			iconFillStyle() {
				return `font-size: ${this.width}rpx; color: #E6E6E6;`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.md-star {
	  .icon {
	    margin-right: 4rpx;
			&:last-child {
				margin-right: 0;
			}
	  }
	}
</style>