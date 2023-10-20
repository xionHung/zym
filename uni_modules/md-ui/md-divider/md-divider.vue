<template>
	<view class="md-divider" :style="style"></view>
</template>

<script>
	export default {
		props: {
			height: Number,
		},
		computed: {
			style() {
				return `height: ${this.height}rpx`;
			}
		}
	}
</script>