<template>
	<view>
		<view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
			<view class="cu-bar fixed" :style="[...style, ...leftStyle, { background: 'transparent' }]" :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor, { border }]">
				<view class="action" @click.stop="BackPage" v-if="isBack || backEvent">
					<text class="icon-left"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{ top: StatusBar + 'px' }]">
					<slot name="content"></slot>
				</view>
				<view>
					<slot name="right"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar
		};
	},
	name: 'cu-custom',
	props: {
		bgColor: {
			type: String,
			default: ''
		},
		isBack: {
			type: [Boolean, String],
			default: false
		},
		backEvent: {
			type: [Function, Boolean],
			default: false
		},
		bgImage: {
			type: String,
			default: ''
		},
		border: {
			type: Boolean,
			default: false
		},
		leftStyle: String
	},
	computed: {
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var bgImage = this.bgImage;
			var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
			if (this.bgImage) {
				style = `${style}background-image:url(${bgImage});`;
			}
			return style;
		}
	},
	methods: {
		BackPage() {
			if (this.backEvent) {
				this.backEvent();
			} else {
				//获取路由
				let routes = getCurrentPages();
				// 说明不是刷新，分享等单个路由。
				if (routes && routes.length > 1) return uni.navigateBack();
				uni.reLaunch({
					url: '/pages/home/home'
				});
			}
		}
	}
};
</script>

<style></style>
