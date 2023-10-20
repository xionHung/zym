<template>
	<view class="pa-30">
		<view class="bg-white br-20 pa-20 pt-32 pb-32">
			<view class="primary-color fs-20 mb-20">您的投诉将在24小时内受理，请尽量提交详细的投诉说明</view>
			<view class="fs-24 mb-20">
				我要投诉的是“
				<text class="primary-color">{{ info.circle[0].nickname }}</text>
				”发的帖子：
			</view>
			<view class="flex pa-20 bg-gray mb-20">
				<!-- 头像 -->
				<md-avatar :src="info.circle[0].headpic" :sex="info.circle[0].sex" class="mr-8" width="60"></md-avatar>
				<view class="h-14">
					<view class="flex fs-20">
						<text class="primary-color">{{ info.circle[0].nickname }}</text>
						：
						<text>{{ info.circle[0].title }}</text>
					</view>
				</view>
			</view>
			<view class="mb-20">
				<view class="mb-20 fs-24">请选择你想要投诉的类型</view>
				<!-- <view class="tags">
					<view class="tag">涉黄信息</view>
					<view class="tag">涉黄信息</view>
					<view class="tag">涉黄信息</view>
					<view class="tag">涉黄信息</view>
					<view class="tag">涉黄信息</view>
					<view class="tag text-cut">涉及成年人</view>
				</view> -->
				<md-checkable-tag :tags="complaints" :config="{ label: 'name', value: 'id' }" v-model="type"></md-checkable-tag>
				<view class="mt-50">
					<button class="primary-btn submit-btn" @click="sendComplaint">提交</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			complaints: [],
			type: [],
			info: {}
		};
	},
	methods: {
		/**
		 * 接口相关
		 */
		async getComplaints() {
			try {
				const res = await this.$api.Config.complaint();
				this.complaints = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 帖子详情
		async getDetailInfo(circle_id) {
			try {
				const res = await this.$api.UserCircle.info({ circle_id, limit: 1, pageNum: 1 });
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		async sendComplaint() {
			const { type } = this;
			if (type.length <= 0) {
				uni.showModal({
					content: '请选择投诉类型',
					showCancel: false
				});
				return;
			}
			const _type = type.join();
			try {
				const res = await this.$api.UserCircle.complaint({ circle_id: this.id, type: _type });
				uni.showModal({
					content: '投诉成功',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.navigateBack();
						}
					}
				});
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		const { id } = options;
		this.id = id;
		this.getComplaints();
		this.getDetailInfo(id);
	}
};
</script>

<style scoped lang="scss">
.tags {
	display: flex;
	flex-wrap: wrap;
	.tag {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		background: #f3f3f3;
		border-radius: 10rpx;
		font-size: 20rpx;
		margin-bottom: 16rpx;
		padding: 4rpx;
		&:not(:nth-of-type(4n)) {
			margin-right: 30rpx;
		}
	}
}
.submit-btn {
	width: 140rpx;
	height: 50rpx;
	background: #FF7234;
	border-radius: 10rpx;
	color: white;
	font-size: 20rpx
}
</style>
