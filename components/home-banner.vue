<template>
	<view class="banner">
		<swiper class="swiper" :style="{ height }" @change="swiperChange($event, 'current')" :indicator-dots="false" :autoplay="true" :interval="5000" :duration="500">
			<swiper-item v-for="(item, idx) in bannerList" :key="idx">
				<view class="swiper-item">
					<image class="img" :style="{ height }" :src="item" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="line-dots flex-center">
			<view class="dot-item" v-for="(item, idx) in bannerList" :key="idx" :class="{ active: current === idx }"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		height: {
			type: String,
			default: '316rpx'
		},
		// 是否是内页的banner
		isInner: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			current: 0,
			bannerList: []
		};
	},

	async mounted() {
		this.getBanner();
	},
	methods: {
		swiperChange(e, key = 'current') {
			this[key] = e.detail.current;
		},
		async getBanner() {
			let res = [];
			try {
				if (!this.isInner) {
					res = await this.$api.Common.get_ad();
				} else {
					res = await this.$api.Common.get_inner_ad();
				}
				this.bannerList = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss" scoped>
$banner-height: 316rpx;

.swiper {
	height: $banner-height;
}
.banner {
	overflow: hidden;
	position: relative;
	border-radius: 20rpx;
	.line-dots {
		position: absolute;
		bottom: 6%;
		left: 0;
		right: 0;
		.dot-item {
			width: 22rpx;
			height: 6rpx;
			background: #fff;
			margin-right: 10rpx;
			opacity: 0.5;
			border-radius: 3rpx;
			&.active {
				opacity: 1;
			}
			&:nth-last-child(1) {
				margin-right: 0;
			}
		}
	}
	.img {
		display: block;
		width: 100%;
		height: $banner-height;
		pointer-events: auto;
	}
}
</style>
