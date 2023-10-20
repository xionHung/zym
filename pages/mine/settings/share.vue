<template>
	<view class="container">
		<ShareQrcode />
	</view>
</template>

<script>
import ShareQrcode from '@/pages/components/ShareQrcode.vue';
export default {
	components: {
		ShareQrcode
	},
	data() {
		return {};
	},
	methods: {},
	onLoad(options) {}
};
</script>

<style scoped lang="scss">
.container {
	padding: 26rpx 31rpx;
}
</style>
