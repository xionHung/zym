<template>
	<image :src="srcFormate" :style="imageStyle" :mode="mode" />
</template>

<script>
	import appConfig from "@/configs"
	export default {
		props: {
			src: String,
			mode: {
				type: String,
				default: () => 'aspectFill'
			},
			width: {
				type: Number,
				default: () => 300,
			},
			height: {
				type: Number,
				default: () => 300,
			},
			radius: {
				type: Number,
				default: () => 0,
			},
			isPath: Boolean, //是否开启接口图片
		},
		computed: {
			srcFormate() {
				if(this.isPath) return this.src;
				return appConfig.IMGURL + this.src;
			},
			imageStyle() {
				// return `width: 100%; height: 100%;`
				return `width: ${this.width}rpx; height: ${this.height}rpx; border-radius: ${this.radius}rpx; flex: none;`;
			}
		}
	}
</script>