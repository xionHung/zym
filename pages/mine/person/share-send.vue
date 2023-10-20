<template>
	<view class="container">
		<md-textarea placeholder="只言片羽..." v-model="form.title"></md-textarea>
		<!-- 上传图片区域 -->
		<view class="mt-20 upload-images mb-100">
			<md-upload-image mode="square" v-model="form.image" :count="9" typeName="notice"></md-upload-image>
		</view>
		<!-- 同步 -->
		<view class="border-bottom border-top pb-20 pt-20" v-if="pageType !== 'circle'">
			<md-radio :mode="3" :list="[{ value: 1 }]" v-model="type" isCancel>
				<view class="flex">
					<view class="w-14 h-14 br-10 mr-20">
						<md-image src="/ylq.jpg" width="70" height="70" radius="10"></md-image>
					</view>
					<text>羽乐圈</text>
				</view>
			</md-radio>
		</view>
		<!-- 发布按钮 -->
		<view class="flex flex-end">
			<view class="send-btn" @click="handleSend">发布</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageType: '',
			form: {
				title: '',
				image: ''
			},
			type: 2
		};
	},
	methods: {
		handleSend() {
			if (!this.form.title || !this.form.image) return this.$toast('标题或图片不能为空');
			this.addCircle();
		},
		/**
		 * 接口相关
		 */
		async addCircle() {
			try {
				let url = this.pageType == 'circle'?'UserCircle': 'UserNotice';
				await this.$api[url].add(this.form);
				await this.$toast('发布成功');
				uni.navigateBack();
				uni.$emit('refresh');
			} catch (e) {
				//TODO handle the exception
			}
		},
	},
	onLoad(options) {
		const { type, card_id } = options;
		
		if (type) return this.pageType = type;
		this.form.club_id = card_id;
	}
};
</script>

<style scoped lang="scss">
.container {
	padding: 30rpx;

	.upload-images {
		.image {
			width: 100%;
			height: 100%;
			&.close {
				position: relative;
				.close-btn {
					position: absolute;
					right: -4rpx;
					top: -4rpx;
					color: white;
					width: 26rpx;
					height: 26rpx;
					line-height: 26rpx;
					text-align: center;
					background: #333333;
					opacity: 0.66;
					border-radius: 20rpx;
					font-size: 18rpx;
					padding-top: 4rpx;
					padding-right: 4rpx;
					cursor: pointer;
				}
			}
		}
	}

	.send-btn {
		width: 174rpx;
		height: 75rpx;
		line-height: 75rpx;
		text-align: center;
		background: #ff7234;
		box-shadow: 5rpx 5rpx 10rpx 0rpx rgba(254, 106, 28, 0.4);
		border-radius: 20rpx;
		color: white;
		font-size: 30rpx;
		margin-top: 140rpx;
	}
}
</style>
