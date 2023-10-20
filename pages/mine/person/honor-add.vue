<template>
	<view class="container">
		<view class="content card">
			<view class="title">描述</view>
			<md-textarea v-model="form.title" placeholder="请从这里输入描述"></md-textarea>
			<view class="title mt-39">图片</view>
			<view class="add-image">
				<md-upload-image v-model="form.img" typeName="user" mode="custom">
					<image v-if="form.img" :src="form.img" class="wp-100 hp-100" mode="aspectFit" />
					<view class="add-image-content flex flex-col flex-center" v-else>
						<text class="icon-image primary-color"></text>
						<view>添加图片</view>
					</view>
				</md-upload-image>
			</view>
		</view>
		<view class="flex flex-center bottom-btn">
			<md-button class="card" @click="handleSave">保存</md-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				title: '',
				img: ''
			}
		};
	},
	methods: {
		handleSave() {
			this.addHonor();
		},
		/**
		 * 接口相关
		 */
		async addHonor() {
			try {
				await this.$api.UserDetail.addHonor(this.form);
				uni.$emit('refresh');
				uni.navigateBack();
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style scoped lang="scss">
.container {
	width: 100%;
	height: 100vh;
	.content {
		margin: 20rpx 30rpx;
		padding: 20rpx 30rpx 39rpx;
		background-color: white;

		.title {
			color: #666;
			font-weight: bold;
			line-height: 31rpx;
			margin-bottom: 20rpx;
		}

		.add-image {
			width: 636rpx;
			height: 199rpx;
			/deep/ .md-upload-image {
				height: 100%;
				& > view {
					height: 100%;
				}
			}
			&-content {
				width: 100%;
				height: 100%;
				background-color: #fff8f8;
				padding: 42rpx 0 64rpx;
				color: #999999;
				font-size: 22rpx;
			}
		}
		.icon-image {
			font-size: 48rpx;
			margin-bottom: 24rpx;
		}
	}

	.bottom-btn {
		margin-top: 150rpx;
		/deep/ .md-btn {
			height: 70rpx;
			width: 340rpx;
			line-height: 70rpx;
			font-size: 35rpx;
			border-radius: 35rpx;
			text-align: center;
		}
	}
}
</style>
