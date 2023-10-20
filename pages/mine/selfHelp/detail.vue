<template>
	<view class="container">
		<view class="card">
			<u-parse :content="content" class="rich-txt" :loading="loading"></u-parse>
		</view>
	</view>
</template>

<script>
import Uparse from '@/pages/components/Uparse.vue';
export default {
	components: {
		Uparse
	},
	data() {
		return {
			content: '',
			loading: false,
		};
	},
	methods: {
		async getInfo(id) {
			this.loading = true;
			try {
				const { data } = await this.$api.Setting.helpInfo({ id });
				this.content = data.content;
			} catch (e) {
				//TODO handle the exception
			}
			this.loading = false;
		},
	},
	onLoad(options) {
		const { id } = options;
		this.getInfo(id);
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding-top: 28rpx;
	.card {
		width: 688rpx;
		line-height: 100rpx;
		padding: 0 40rpx 0 38rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #fff;
		box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(153, 153, 153, 0.11);
		font-size: 30rpx;
		color: #666;
	}
	.rich-txt {
		word-break: break-all;
		white-space: pre-line;
	}
}
</style>
