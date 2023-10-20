<template>
	<view class="page-settings">
		<view class="card" v-if="type == 4">
			<button class="rbtn" @click="handlePhone">
				<view class="left flex-start">
					<view class="icon"></view>
					<view style="text-align: left">
						<view>商务合作</view>
						<view class="phone">{{ content }}</view>
					</view>
				</view>
				<text class="icon-phone-fill right"></text>
			</button>
		</view>
		<view class="card content" v-else>
			<u-parse :content="content" class="rich-txt" :loading="loading"></u-parse>
		</view>
	</view>
</template>

<script>
import itemList from './itemList.js';
import Uparse from '@/pages/components/Uparse.vue';
export default {
	components: {
		Uparse
	},
	data() {
		return {
			type: '',
			content: '',
			loading: false
		};
	},
	onLoad(options) {
		const { type } = options;
		this.type = type;
		const pageTitle = itemList.find((item) => item.value === type).label;
		uni.setNavigationBarTitle({ title: pageTitle });
		this.getSettingInfo(type);
	},
	methods: {
		handlePhone() {
			uni.makePhoneCall({
				phoneNumber: this.content
			});
		},
		/**
		 * 接口相关
		 */
		async getSettingInfo(type) {
			this.loading = true;
			try {
				const { data } = await this.$api.Setting.content({ type });
				this.content = data.content;
			} catch (e) {
				//TODO handle the exception
			}
			this.loading = false;
		}
	}
};
</script>

<style>
@import url('@/components/u-parse/u-parse.css');
</style>
<style lang="scss" scoped>
.page-settings {
	padding-top: 28rpx;
	.card {
		width: 688rpx;
		padding: 0 40rpx 0 38rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #fff;
		box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(153, 153, 153, 0.11);
		font-size: 30rpx;
		color: #666;
		.rbtn {
			width: 100%;
			height: 122rpx;
			justify-content: space-between;
			.icon {
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				background: $themeColor;
				margin-right: 30rpx;
			}
			.phone {
				color: #999;
				margin-top: 16rpx;
			}
			.right {
				color: $themeColor;
				font-size: 50rpx;
			}
		}
	}
	.content {
		line-height: 100rpx;
	}
	.rich-txt {
		word-break: break-all;
		white-space: pre-line;
	}
}
</style>
