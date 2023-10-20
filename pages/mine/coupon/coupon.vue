<template>
	<view class="container">
		<view class="content bg-white">
			<view class="coupon-wrapper">
				<view class="pl-25 mb-12 fs-30 pl-35 fw-bold">球馆充值（{{ info.room_card_count }}）</view>
				<view class="coupon room-list flex flex-col flex-top flex-between" v-for="item in info.room_card" :key="item.id">
					<view class="wp-100 flex-space-between">
						<view class="fs-34">{{ item.room_name }}</view>
						<text>充值卡</text>
					</view>
					<view class="yue flex flex-between wp-100">
						<view class="yue-msg">
							<view>余额：{{ item.money }}元</view>
						</view>
						<view class="detail-btn flex-bottom-self" @click="handleDetail('room', item.room_id)">详情</view>
					</view>
				</view>
			</view>
			<view class="coupon-wrapper">
				<view class="mb-12 fs-30 pl-35 fw-bold">羽盟卡（{{ info.union_card_count }}）</view>
				<view class="coupon flex flex-col flex-top flex-between">
					<view class="wp-100 flex-space-between">
						<view class="fs-34">羽盟卡</view>
						<text>充值卡</text>
					</view>
					<view class="yue flex flex-between wp-100">
						<view class="yue-msg">
							<view>可用次数：{{ info.union_card.num }}次</view>
							<view>有效期至：{{ info.union_card.endtime }}</view>
						</view>
						<view class="detail-btn flex-bottom-self" @click="handleDetail('union')">详情</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			info: {}
		};
	},
	onLoad() {
		this.getList();
	},
	methods: {
		handleDetail(type, id) {
			uni.navigateTo({
				url: `/pages/mine/coupon/detail?type=${type}&room_id=${id}`
			});
		},
		/**
		 * 接口相关
		 */
		async getList() {
			try {
				const res = await this.$api.Card.getList();
				this.info = res.data;
			} catch (error) {}
		}
	}
};
</script>

<style scoped lang="scss">
.container {
	padding: 20rpx 31rpx;
	.content {
		border-radius: 20rpx;
		.coupon-wrapper {
			padding: 16rpx;
			&:not(:first-of-type) {
				margin-top: 10rpx;
			}
			.coupon {
				width: 100%;
				height: 370rpx;
				border: 2px solid;
				border-image: linear-gradient(180deg, #fff9ed, #f7ecd3) 10 10;
				background: linear-gradient(267deg, #f7edd7 0%, #e9ce93 100%);
				box-shadow: 0rpx 8rpx 22rpx 0rpx rgba(213, 213, 213, 0.09);
				border-radius: 20rpx;
				padding: 58rpx 33rpx 54rpx;
				color: #664630;
				font-weight: bold;
				.yue {
					.yue-msg {
						& > view:not(:first-of-type) {
							margin-top: 8rpx;
						}
					}
					.detail-btn {
						width: 119rpx;
						height: 50rpx;
						background: #edd6a4;
						border-radius: 25rpx;
						text-align: center;
						line-height: 50rpx;
						color: white;
						font-size: 31rpx;
						margin-bottom: -8rpx;
					}
				}
			}
		}
	}
}
</style>
